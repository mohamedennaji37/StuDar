const express = require('express');
const router = express.Router();
const depenseCont = require('./controllers/depenseCont');

router.get('/depense', depenseCont.getDepense);
router.post('/depense', depenseCont.setDepense);

module.exports = router;