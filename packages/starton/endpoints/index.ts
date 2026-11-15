import { uploadFile } from './ipfs';
import { call, deployFromTemplate, list, read } from './smart-contract';
import { list as listTemplates } from './template';
import { get } from './transaction';
import { create, list as listWallets } from './wallet';
import { deleteWatcher, get as getWatcher } from './watcher';
import { list as listWebhooks } from './webhook';

export const Wallet = { create, list: listWallets };

export const SmartContract = { deployFromTemplate, call, read, list };

export const Template = { list: listTemplates };

export const Transaction = { get };

export const Watcher = { get: getWatcher, delete: deleteWatcher };

export const Webhook = { list: listWebhooks };

export const Ipfs = { uploadFile };

export * from './types';
