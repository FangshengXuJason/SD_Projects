import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// @desc    Get all files for user
// @route   GET /api/files
// @access  Private
export const getFiles = async (req: AuthRequest, res: Response) => {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Upload file
// @route   POST /api/files/upload
// @access  Private
export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, originalName, size, mimeType, s3Key, s3Bucket } = req.body;

    const file = await prisma.file.create({
      data: {
        userId: req.user!.id,
        name,
        originalName,
        size: parseInt(size),
        mimeType,
        s3Key,
        s3Bucket,
      },
    });

    res.status(201).json({
      success: true,
      data: file,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single file
// @route   GET /api/files/:id
// @access  Private
export const getFile = async (req: AuthRequest, res: Response) => {
  try {
    const file = await prisma.file.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!file) {
      res.status(404);
      throw new Error('File not found');
    }

    res.json({
      success: true,
      data: file,
    });
  } catch (error: any) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
export const deleteFile = async (req: AuthRequest, res: Response) => {
  try {
    const file = await prisma.file.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!file) {
      res.status(404);
      throw new Error('File not found');
    }

    await prisma.file.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Download file
// @route   GET /api/files/:id/download
// @access  Private
export const downloadFile = async (req: AuthRequest, res: Response) => {
  try {
    const file = await prisma.file.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!file) {
      res.status(404);
      throw new Error('File not found');
    }

    // Return file info for download
    res.json({
      success: true,
      data: {
        downloadUrl: `/api/s3/presigned-url/${file.s3Key}`,
        fileName: file.originalName,
        fileSize: file.size,
      },
    });
  } catch (error: any) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      error: error.message,
    });
  }
};