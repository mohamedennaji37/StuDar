import express from 'express';
import { getLogements, reserveLogement } from '../controllers/offreCont.js';

const router = express.Router();

router.get('/offres', getLogements);
router.post('/reserve', reserveLogement); // New route for reservation

export default router;