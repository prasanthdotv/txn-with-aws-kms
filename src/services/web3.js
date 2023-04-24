import Web3 from 'web3';

import config from '../config/env.js';

const web3 = new Web3(new Web3.providers.HttpProvider(config.RPC_URL));
web3.eth.handleRevert = true;

module.exports = web3;
