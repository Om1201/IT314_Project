import fs from "fs";
import path from "path";
import { S3Client, 
         GetObjectCommand, 
         PutObjectCommand, 
         CopyObjectCommand, 
         ListObjectsV2Command } from "@aws-sdk/client-s3";
import stream from "stream";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME ?? "";


export const fetchS3Folder = async (req, res) => {
  try {
    const { key, localPath } = req.body;
    if (!key || !localPath) {
      return res.status(400).json({ error: "key and localPath are required" });
    }

    const listResp = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: key }));
    if (!listResp.Contents || listResp.Contents.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    await Promise.all(
      listResp.Contents.map(async (obj) => {
        const fileKey = obj.Key;
        if (!fileKey) return;

        const getResp = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: fileKey }));
        const filePath = path.join(localPath, fileKey.replace(key, ""));
        await createFolder(path.dirname(filePath));
        await pipeline(getResp.Body, fs.createWriteStream(filePath));
        console.log(`Downloaded ${fileKey} → ${filePath}`);
      })
    );

    res.json({ message: "Folder downloaded successfully" });
  } catch (error) {
    console.error("Error fetching folder:", error);
    res.status(500).json({ error: "Error fetching folder", details: error.message });
  }
};

export const copyS3Folder = async (req, res) => {
  try {
    const { sourcePrefix, destinationPrefix } = req.body;
    if (!sourcePrefix || !destinationPrefix) {
      return res.status(400).json({ error: "sourcePrefix and destinationPrefix are required" });
    }

    const listResp = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: sourcePrefix }));
    if (!listResp.Contents || listResp.Contents.length === 0) {
      return res.status(404).json({ message: "No files to copy" });
    }

    await Promise.all(
      listResp.Contents.map(async (obj) => {
        if (!obj.Key) return;
        const destKey = obj.Key.replace(sourcePrefix, destinationPrefix);
        const copyParams = {
          Bucket: BUCKET,
          CopySource: `${BUCKET}/${obj.Key}`,
          Key: destKey,
        };
        await s3.send(new CopyObjectCommand(copyParams));
        console.log(`Copied ${obj.Key} → ${destKey}`);
      })
    );

    res.json({ message: "Folder copied successfully" });
  } catch (error) {
    console.error("Error copying folder:", error);
    res.status(500).json({ error: "Error copying folder", details: error.message });
  }
};

export const saveToS3 = async (req, res) => {
  try {
    const { key, filePath, content } = req.body;
    if (!key || !filePath || !content) {
      return res.status(400).json({ error: "key, filePath, and content are required" });
    }

    const params = {
      Bucket: BUCKET,
      Key: `${key}${filePath}`,
      Body: content,
    };

    await s3.send(new PutObjectCommand(params));
    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error saving to S3:", error);
    res.status(500).json({ error: "Error saving file", details: error.message });
  }
};

export async function createFolder(dirName) {
  return fs.promises.mkdir(dirName, { recursive: true });
}
