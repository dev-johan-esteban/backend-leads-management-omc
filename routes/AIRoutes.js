import express from 'express';
import { getLeadsSummary, testAIConnection } from '../controllers/AIController.js';

const router = express.Router();


router.post('/summary', getLeadsSummary);

export default router;