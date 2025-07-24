import express from 'express';
import { getPresignedUploadUrl, getPresignedDownloadUrl } from '../controllers/s3Controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/presigned-url', getPresignedUploadUrl);
router.get('/presigned-url/:key', getPresignedDownloadUrl);

export default router;