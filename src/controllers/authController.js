import express from 'express';
const router = express.Router();
import { validate } from 'express-validation';

import validatorSchema from '../validators/authAPIValidators';
import { generateTokens, refreshTokens } from '../services/authService';
import httpResponse from '../models/httpResponseModel';
import config from '../config/env';

const login = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (username !== config.USERNAME || password !== config.PASSWORD) {
			throw new Error('UNAUTHORIZED_ERROR');
		}
		const tokens = await generateTokens();
		res.send(new httpResponse(true, tokens, null));
	} catch (e) {
		next(e);
	}
};

const refreshAuthTokens = async (req, res, next) => {
	try {
		const { token } = req.body;
		const tokens = await refreshTokens(token);
		res.send(new httpResponse(true, tokens, null));
	} catch (e) {
		next(e);
	}
};

router.post('/login', validate(validatorSchema.login, { keyByField: true }), login);
router.post('/refresh', validate(validatorSchema.refresh, { keyByField: true }), refreshAuthTokens);

module.exports = router;
