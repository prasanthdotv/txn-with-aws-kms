import express from 'express';
const router = express.Router();

import authAPIs from '../controllers/authController';
import transactionAPIs from '../controllers/transactionController';

router.use('/auth', authAPIs);
router.use('/transfer', transactionAPIs);

module.exports = router;
