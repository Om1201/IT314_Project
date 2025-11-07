import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    CopyObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand 
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });


const getLanguageFromExtension = (filename) => {
    const ext = filename.split('.').pop();
    switch (ext) {
        case 'js': return 'javascript';
        case 'py': return 'python';
        case 'java': return 'java';
        case 'cpp': return 'cpp';
        default: return 'plaintext';
    }
}


export const loadProjectFiles = async (req, res) => {
  try {
    const { key } = req.body; 
    if (!key) {
      return res.status(400).json({ error: "key (project prefix) is required" });
    }

    const listResp = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: key }));

    if (!listResp.Contents || listResp.Contents.length === 0) {
      
      const defaultFile = {
        id: `main_${Date.now()}`,
        name: 'main.js',
        language: 'javascript',
        code: "// Write your code here\nconsole.log('Hello World');",
        input: '',
        output: '',
        saved: true,
      };
      return res.json({ files: [defaultFile] });
    }

    const fileDataPromises = listResp.Contents.map(async (obj) => {
      if (!obj.Key) return null;

      const getResp = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
      const content = await streamToString(getResp.Body);
      const fileName = obj.Key.replace(key, ""); 


      if (!fileName) return null;

      return {
        id: `s3_${fileName}_${Math.random()}`, 
        name: fileName,
        language: getLanguageFromExtension(fileName),
        code: content,
        input: '', 
        output: '', 
        saved: true,
      };
    });

    const files = (await Promise.all(fileDataPromises)).filter(Boolean);
    res.json({ files: files.length > 0 ? files : [/* send default file if you want */] });

  } catch (error) {
    console.error("Error loading project files:", error);
    res.status(500).json({ error: "Error loading project", details: error.message });
  }
};

/**
 * Save file content to S3
 */
export const saveToS3 = async (req, res) => {
  try {
    const { key, filePath, content } = req.body;
    
    if (!key || !filePath || content === undefined) {
      return res.status(400).json({ error: "key, filePath, and content are required" });
    }

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: `${key}${filePath}`,
      Body: content,
      ContentType: 'text/plain',
    }));

    res.json({ message: "File saved successfully" });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ error: "Error saving file", details: error.message });
  }
};

export const deleteS3File = async (req, res) => {
  try {
    const { key, filePath } = req.body;
    if (!key || !filePath) {
      return res.status(400).json({ error: "key and filePath are required" });
    }

    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: `${key}${filePath}`,
    }));

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file", details: error.message });
  }
};

export const renameS3File = async (req, res) => {
  try {
    const { key, oldFilePath, newFilePath } = req.body;
    if (!key || !oldFilePath || !newFilePath) {
      return res.status(400).json({ error: "key, oldFilePath, and newFilePath are required" });
    }

    const sourceKey = `${key}${oldFilePath}`;
    const destKey = `${key}${newFilePath}`;

  
    await s3.send(new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${sourceKey}`, 
      Key: destKey,
    }));


    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: sourceKey,
    }));

    res.json({ message: "File renamed successfully" });
  } catch (error) {
    console.error("Error renaming file:", error);
    res.status(500).json({ error: "Error renaming file", details: error.message });
  }
};