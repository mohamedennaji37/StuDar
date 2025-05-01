import express from 'express';
import multer from 'multer';
import { setSignUpProp, setSignUpEtd } from '../controllers/signUpCont.js';

// Configuration de Multer pour le stockage des fichiers en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Création d'une instance de router d'Express
const router = express.Router();

// Définir les routes avec les middleware appropriés
router.post('/signupEtd', upload.fields([
    { name: 'cin', maxCount: 1 },
    { name: 'fiche_scolarite', maxCount: 1 }
]), setSignUpEtd);

router.post('/signupProp', upload.single('cin'), setSignUpProp);

// Exporter le router pour être utilisé dans `server.js`
export default router;
