import { Joi } from 'express-validation';

const schema = {
  transfer: {
    body: Joi.object({
      amount: Joi.number().greater(0).required(),
      address: Joi.string()
        .regex(/^0x[a-fA-F\d]{40}$/)
        .message('Invalid receiver address')
        .required(),
    }),
  },
};

module.exports = schema;
