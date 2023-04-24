const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'dev',
  NETWORK: process.env.NETWORK || 'goerli',
  RPC_URL: process.env.RPC_URL,
  ALLOW_DOMAIN: process.env.ALLOW_DOMAIN,
  DB_URI: process.env.DB_URI,
  ADMIN_WALLET: process.env.ADMIN_WALLET,
  TOKEN_CONTRACT: process.env.TOKEN_CONTRACT,
  AWS: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    API_VERSION: process.env.API_VERSION || '2014-11-01',
    AWS_REGION: process.env.S3_REGION,
    S3: {
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      folder: process.env.S3_FOLDER,
    },
    KMS: {
      KEY_ID: process.env.KMS_KEY_ID,
    },
  },
  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD,
};
module.exports = config;
