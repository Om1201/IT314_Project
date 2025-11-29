import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    CopyObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand, 
    DeleteObjectsCommand,
    HeadObjectCommand
} from "@aws-sdk/client-s3";
import {langMap} from "../utils/mapping.js"

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.R2_BUCKET_NAME;

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
      return res.status(400).json({ success: false, message: "key (project prefix) is required" });
    }

    const listResp = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: key }));

    if (!listResp.Contents || listResp.Contents.length === 0) {
      
      // const defaultFile = {
      //   id: `main_${Date.now()}`,
      //   name: 'main.js',
      //   language: 'javascript',
      //   code: "// Write your code here\nconsole.log('Hello World');",
      //   input: '',
      //   output: '',
      //   saved: true,
      // };
      return res.json({ success: true, message: "Files loaded successfully", data: [] });
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
    return res.json({ success: true, message: "Files loaded successfully", data: files.length > 0 ? files : [/* send default file if you want */] });

  } catch (error) {
    console.log("Error loading project files:", error);
    return res.status(500).json({ success: false, message: "Error loading project", details: error.message });
  }
};

export const saveToS3 = async (req, res) => {
  try {
    const { key, filePath, content } = req.validatedData;
    
    
    if (!key || !filePath || (content === undefined)) {
      return res.status(400).json({ success: false, message: "key, filePath, and content are required" });
    }

    try {
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: `${key}${filePath}` }));
      return res.status(400).json({
        success: false,
        message: "File already exists at this path",
      });
    } catch (err) {}



    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: `${key}${filePath}`,
      Body: content,
      ContentType: 'text/plain',
    }));

    const node = {
      id: `${key}${filePath}_${Math.random()}`,  
      name: filePath,                            
      language: langMap[filePath.split('/').pop().split('.').pop()]||"plaintext", 
      code: content,
      input: "",
      output: "",
      saved: true,
    };

    return res.json({ success: true, message: "File saved successfully", data: node });
  } catch (error) {
    console.error("Error saving file:", error);
    return res.status(500).json({ success: false, message: "Error saving file" });
  }
};

export const deleteS3File = async (req, res) => {
  try {
    const { key, filePath } = req.body;
    if (!key || !filePath) {
      return res.status(400).json({ success: false, message: "key and filePath are required" });
    }

    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: `${key}${filePath}`,
    }));

    return res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({ success: false, message: "Error deleting file" });
  }
};

// export const deleteS3Folder = async (req, res) => {
//   try {
//     const { key, filePath } = req.body;
//     const prefix = `${key}/${filePath}`; // e.g. "user123/folder/"
//     console.log("Deleting folder:", prefix);

//     const listedObjects = await s3.send(new ListObjectsV2Command({
//       Bucket: BUCKET,
//       Prefix: prefix,
//     }));

//     if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
//       return res.json({ success: false, message: "No files found in the folder" });
//     }

//     const deleteParams = {
//       Bucket: BUCKET,
//       Delete: {
//         Objects: listedObjects.Contents.map(obj => ({ Key: obj.Key })),
//       },
//     };

//     await s3.send(new DeleteObjectsCommand(deleteParams));

//     return res.json({ success: true, message: "Folder deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting folder:", error);
//     return res.status(500).json({ success: false, message: "Error deleting folder" });
//   }
// };

export const deleteS3Folder = async (req, res) => {
  try {
    const { key, filePath } = req.body;
    const prefix = `${key}/${filePath.replace(/^\/+/, "")}`; 

    const listedObjects = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
    }));

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      await s3.send(new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: prefix,
      }));
      return res.json({ success: true, message: "Folder deleted (empty or marker only)" });
    }

    await s3.send(new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: listedObjects.Contents.map(obj => ({ Key: obj.Key })),
      },
    }));

    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: prefix.endsWith("/") ? prefix : `${prefix}/`,
    }));

    return res.json({ success: true, message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return res.status(500).json({ success: false, message: "Error deleting folder" });
  }
};


export const renameS3File = async (req, res) => {
  try {
    const { key, oldFilePath, newFilePath } = req.validatedData;
    if (!key || !oldFilePath || !newFilePath) {
      return res.status(400).json({ success: false, message: "key, oldFilePath, and newFilePath are required" });
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

    return res.json({ success: true, message: "File renamed successfully" });
  } catch (error) {
    console.error("Error renaming file:", error);
    return res.status(500).json({ success: false, message: "Error renaming file" });
  }
};

export const renameS3Folder = async (req, res) => {
  try {
    const { key, oldFilePath, newFilePath } = req.validatedData;
    const prefix = `${key}${oldFilePath}`;

    const listedObjects = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
    }));

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      return res.status(404).json({ success: false, message: "No files found in the folder" });
    }

    for (const obj of listedObjects.Contents) {
      const oldKey = obj.Key;
      const newKey = oldKey.replace(prefix, `${key}${newFilePath}`);
      await s3.send(new CopyObjectCommand({
        Bucket: BUCKET,
        CopySource: `${BUCKET}/${oldKey}`,
        Key: newKey,
      }));
    }

    await s3.send(new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: listedObjects.Contents.map(obj => ({ Key: obj.Key })),
      },
    }));

    return res.status(200).json({ success: true, message: "Folder renamed successfully" });
  } catch (error) {
    console.error("Error renaming folder:", error);
    return res.status(500).json({ success: false, message: "Error renaming folder" });
  }
};



export const updateFile = async (req, res) => {
  try {
    const { key, filePath, content } = req.body;
    
    if (!key || !filePath || content === undefined) {
      return res.status(400).json({ success: false, message: "key, filePath, and content are required" });
    }

    const s3Key = `${key}${filePath}`;

    try {
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: s3Key }));
    } catch (err) {
      if (err.name === "NotFound") {
        return res.status(404).json({ 
          success: false,
          message: "File not found. Cannot update.",
        });
      }
      throw err; 
    }

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: content,
      ContentType: 'text/plain',
    }));

    const node = {
      id: `${s3Key}_${Math.random()}`, 
      name: filePath,
      language: langMap[filePath.split('/').pop().split('.').pop()] || "plaintext", 
      code: content,
      input: "",
      output: "",
      saved: true,
    };

    return res.json({ success: true, message: "File updated successfully", data: node });

  } catch (error) {
    console.error("Error updating file:", error);
    return res.status(500).json({ success: false, message: "Error updating file" });
  }
};