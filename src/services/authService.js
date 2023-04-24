import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

import tokenConfig from '../config/jwtTokens';

const getAuthPrivateKey = () => {
	const privKeyPath = path.resolve(__dirname, '../constants/private-key.pem');
	const privateKey = fs.readFileSync(privKeyPath, {
		encoding: 'utf8',
	});
	return privateKey;
};

const getAuthPublicKey = () => {
	const pubKeyPath = path.resolve(__dirname, '../constants/public-key.pem');
	const publicKey = fs.readFileSync(pubKeyPath, {
		encoding: 'utf8',
	});
	return publicKey;
};

const generateTokens = () => {
	const accessToken = jwt.sign({ type: 'access' }, getAuthPrivateKey(), tokenConfig.accessToken);
	const refreshToken = jwt.sign({ type: 'refresh' }, getAuthPrivateKey(), tokenConfig.refreshToken);
	return { accessToken, refreshToken };
};

const refreshTokens = (refreshToken) => {
	jwt.verify(refreshToken, getAuthPublicKey());
	return generateTokens();
};

module.exports = {
	getAuthPrivateKey,
	getAuthPublicKey,
	generateTokens,
	refreshTokens,
};
