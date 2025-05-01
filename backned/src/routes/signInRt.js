import express from 'express';
import { setSignInProp, setSignInEtd } from '../controllers/signInCont.js';

const router = express.Router();


router.post('/signinEtd', setSignInEtd);

router.post('/signinProp', setSignInProp);

export default router;