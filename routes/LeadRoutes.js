import express from 'express';
import { createLead, getAllLeads, getLeadById, updateLead, deleteLead, getLeadStats } from '../controllers/LeadController.js';


const router = express.Router();


router.post('/', createLead);

router.get('/', getAllLeads);


router.get('/stats', getLeadStats);

router.get('/:id', getLeadById);

router.patch('/:id', updateLead);

router.delete('/:id', deleteLead);





export default router;