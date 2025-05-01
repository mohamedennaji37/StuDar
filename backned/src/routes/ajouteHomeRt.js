import express from 'express';
import multer from 'multer';
import { getLogements, addLogement,deleteLogement,updateLogement } from '../controllers/ajouteHomeCont.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

// Définition des routes
router.get('/logements', getLogements);
router.post('/logements', upload.fields([
    { name: 'logement_url', maxCount: 1 },
    { name: 'url1', maxCount: 1 },
    { name: 'url2', maxCount: 1 },
    { name: 'url3', maxCount: 1 },
    { name: 'url4', maxCount: 1 },
    { name: 'url5', maxCount: 1 },
    { name: 'url6', maxCount: 1 }
]), addLogement);
router.delete('/logements', deleteLogement);
router.put('/logements', upload.fields([
    { name: 'logement_url', maxCount: 1 },
    { name: 'url1', maxCount: 1 },
    { name: 'url2', maxCount: 1 },
    { name: 'url3', maxCount: 1 },
    { name: 'url4', maxCount: 1 },
    { name: 'url5', maxCount: 1 },
    { name: 'url6', maxCount: 1 }
]),updateLogement);

export default router;
