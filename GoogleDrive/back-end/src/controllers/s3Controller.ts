import { Request, Response } from 'express';
import AWS from 'aws-sdk';
import { AuthRequest } from '../middleware/auth';

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const s3 = new AWS.S3();

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

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
      Expires: 300, // 5 minutes
    };

    const presignedUrl = await s3.getSignedUrlPromise('putObject', params);

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

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Expires: 300, // 5 minutes
    };

    const presignedUrl = await s3.getSignedUrlPromise('getObject', params);

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