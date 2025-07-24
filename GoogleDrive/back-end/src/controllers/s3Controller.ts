import { Request, Response } from 'express';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AuthRequest } from '../middleware/auth';

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// @desc    Get presigned upload URL
// @route   POST /api/s3/presigned-url
// @access  Private
export const getPresignedUploadUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      res.status(400);
      throw new Error('fileName and fileType are required');
    }

    const key = `uploads/${req.user!.id}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    res.json({
      success: true,
      data: {
        uploadUrl: presignedUrl,
        key,
        bucket: process.env.S3_BUCKET_NAME,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get presigned download URL
// @route   GET /api/s3/presigned-url/:key
// @access  Private
export const getPresignedDownloadUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    res.json({
      success: true,
      data: {
        downloadUrl: presignedUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};