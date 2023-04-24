import express from 'express';
const router = express.Router();
import { validate } from 'express-validation';

import validatorSchema from '../validators/transferAPIvalidators';
import httpResponse from '../models/httpResponseModel';
import sendTokens from '../services/transferService';

const transfer = async (req, res, next) => {
  try {
    const { amount, address } = req.body;
    const receipt = await sendTokens(amount, address);
    res.send(new httpResponse(true, receipt, null));
  } catch (e) {
    next(e);
  }
};

router.post('/', validate(validatorSchema.transfer, { keyByField: true }), transfer);

module.exports = router;
