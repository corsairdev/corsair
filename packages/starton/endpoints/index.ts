import { call, deployFromTemplate, read } from './smart-contract';
import { get } from './transaction';
import { create, list } from './wallet';

export const Wallet = { create, list };

export const SmartContract = { deployFromTemplate, call, read };

export const Transaction = { get };

export * from './types';
