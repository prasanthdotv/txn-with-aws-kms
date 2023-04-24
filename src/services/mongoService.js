import mongoose from 'mongoose';

import logger from '../middleware/logger';
import { NODE_ENV, DB_URI } from '../config/env';

const connectDb = async () => {
  if (NODE_ENV === 'production') {
    mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslCA: 'rds-combined-ca-bundle.pem',
      replicaSet: 'rs0',
      readPreference: 'secondaryPreferred',
      retryWrites: false,
    });
  } else {
    mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return;
};

mongoose.set('strictQuery', true);
const db = mongoose.connection;

db.once('open', () => logger.info('MongoDB connected'));

db.on('error', (err) => logger.error(`MongoDB connection error - ${err.toString()}`));

module.exports = connectDb;
