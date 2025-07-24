import express from 'express';
import {
  getFiles,
  uploadFile,
  getFile,
  deleteFile,
  downloadFile
} from '../controllers/fileController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getFiles);
router.post('/upload', uploadFile);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);
router.get('/:id/download', downloadFile);

export default router;