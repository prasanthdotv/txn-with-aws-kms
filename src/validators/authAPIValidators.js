import { Joi } from 'express-validation';

const schema = {
  login: {
    body: Joi.object({
      username: Joi.string().min(8).required(),
      password: Joi.string().min(8).required(),
    }),
  },
  refresh: {
    body: Joi.object({
      token: Joi.string().required(),
    }),
  },
};

module.exports = schema;
