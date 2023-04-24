module.exports = Object.freeze({
  SERVER_ERROR: {
    status: 500,
    message: 'Internal Server Error.',
  },
  VALIDATION_ERROR: {
    status: 400,
    message: 'Validation Failed.',
  },
  INSUFFICIENT_BALANCE: {
    status: 420,
    message: 'Insufficient Balance. Please recharge the account before trying again.',
  },
  INVALID_NONCE: {
    status: 460,
    message: 'Trying to resend a confirmed transaction. Please build a new transaction and resend.',
  },
  UNAUTHORIZED_ERROR: {
    status: 401,
    message: 'Unauthorized Error',
  },
  CORS_DISABLED: {
    status: 403,
    message: 'CORS Disabled',
  },
});
