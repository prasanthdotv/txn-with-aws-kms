import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { expressjwt as jwt } from 'express-jwt';
import morgan from 'morgan';

import env from './config/env';
import logger from './middleware/logger';
import routes from './routes/routes.js';
import corsEnabledURLs from './constants/corsUrls';
import corsOptionsDelegate from './middleware/corsHandler';
import errorHandler from './middleware/errorHandler.js';
import connectDb from './services/mongoService';
import { getAuthPublicKey } from './services/authService';
import openAccessUrls from './constants/openAccessUrls';
import tokenConfig from './config/jwtTokens';

const app = express();

app.use(morgan('short', { stream: logger.stream }));

if (env.NODE_ENV === 'production') {
  if (env.ALLOW_DOMAIN) {
    const domains = env.ALLOW_DOMAIN.split(',');
    domains.forEach((domain) => corsEnabledURLs.push(domain.toLowerCase()));
  }
  app.use(cors(corsOptionsDelegate));
} else {
  app.use(cors());
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  jwt({ secret: getAuthPublicKey(), algorithms: [tokenConfig.accessToken.algorithm] }).unless({
    path: [...openAccessUrls],
  })
);

if (env.NODE_ENV != 'production') {
  app.use('/', (req, res, next) => {
    logger.log({ level: 'debug', message: JSON.stringify(req.body) });
    next();
  });
}

app.use('/api', routes);
app.use(errorHandler);

// Connecting to DB
connectDb()
  .then(() => {
    app.emit('ready');
  })
  .catch((e) => {
    logger.error(`Error connecting to DB: ${e}`);
  });

module.exports = app;
