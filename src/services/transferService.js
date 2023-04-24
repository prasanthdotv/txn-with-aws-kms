import { default as Common } from '@ethereumjs/common';
import { Transaction } from 'ethereumjs-tx';

import DB_CONSTANTS from '../constants/dbConstants';
import config from '../config/env';
import logger from '../middleware/logger';
import networks from '../constants/networks';
import contractAbi from '../constants/abi.json';
import { eth, utils } from './web3';
import kmsServices from './kmsServices';
import Txn from '../models/txnSchemaModel';

const sendTokens = async (value, to) => {
  const { id } = await Txn.findOneAndUpdate(
    {},
    {
      $set: {
        from: config.ADMIN_WALLET,
        to,
        value,
        status: DB_CONSTANTS.TXN_STATUS.PROCESSING,
      },
    },
    { upsert: true, new: true }
  );
  logger.info('Txn added to DB.');

  try {
    const myContract = new eth.Contract(contractAbi, config.TOKEN_CONTRACT);
    const decimals = await myContract.methods.decimals().call();

    let txObject = {};
    let nonce_count = await eth.getTransactionCount(config.ADMIN_WALLET);
    txObject.nonce = utils.toHex(nonce_count);
    let gasLimit = 90000;
    txObject.gasLimit = utils.toHex(gasLimit);
    let gasPrice = await eth.getGasPrice();
    txObject.gasPrice = utils.toHex(gasPrice);
    txObject.to = config.TOKEN_CONTRACT;
    txObject.from = config.ADMIN_WALLET;
    txObject.value = '0x';
    txObject.data = myContract.methods
      .transfer(to, utils.toHex(BigInt(value * 10 ** decimals).toString()))
      .encodeABI();

    //Sign transaction before sending
    const fetchSign = await kmsServices.fetchSignature();
    // Setting up r,s,v in rawTransaction
    txObject.r = fetchSign.r;
    txObject.s = fetchSign.s;
    txObject.v = fetchSign.v;

    const common = Common.custom(networks[config.NETWORK]);
    const tx = new Transaction(txObject, {
      common,
    });

    const txHash = tx.hash(false);
    const serializedTx = await kmsServices.fetchSerializedTx(txHash, tx);
    const receipt = await eth.sendSignedTransaction(serializedTx.toString('hex'));

    await Txn.findOneAndUpdate(
      { id },
      {
        $set: {
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          status: DB_CONSTANTS.TXN_STATUS.PROCESSED,
        },
      },
      { upsert: true }
    );
    logger.info('Txn updated on DB.');

    return receipt;
  } catch (e) {
    await Txn.findOneAndUpdate(
      { id },
      {
        $set: {
          status: DB_CONSTANTS.TXN_STATUS.NOT_PROCESSED,
        },
      },
      { upsert: true }
    );
    logger.info('Txn updated on DB.');
    throw new Error(e);
  }
};

export default sendTokens;
