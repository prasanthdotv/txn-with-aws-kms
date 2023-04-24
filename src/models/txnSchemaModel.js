import mongoose from 'mongoose';

import DB_CONSTANTS from '../constants/dbConstants';

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    from: {
      type: String,
      required: true,
      validate: /^0x[a-fA-F0-9]{40}$/,
    },
    to: {
      type: String,
      required: true,
      validate: /^0x[a-fA-F0-9]{40}$/,
    },
    value: {
      type: String,
      required: true,
    },
    transactionHash: {
      type: String,
      unique: true,
      validate: /^[0-9a-fA-F]{64}$/,
    },
    blockNumber: {
      type: Number,
    },
    status: {
      type: Number,
      enum: Object.values(DB_CONSTANTS.TXN_STATUS),
      default: DB_CONSTANTS.TXN_STATUS.NOT_PROCESSED,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

transactionSchema.pre('save', function (next) {
  const self = this;
  if (self.isNew) {
    mongoose.models.Transaction.findOne({}, {}, { sort: { id: -1 } }, function (err, lastDoc) {
      if (err) {
        return next(err);
      }
      if (!lastDoc) {
        self.id = 1;
      } else {
        self.id = lastDoc.id + 1;
      }
      next();
    });
  } else {
    next();
  }
});

const Txn = mongoose.model('Transaction', transactionSchema);
module.exports = Txn;
