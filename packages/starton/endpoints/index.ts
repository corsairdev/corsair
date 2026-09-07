import { create, list } from './wallet';
import { call, deployFromTemplate, read } from './smart-contract';
import { get } from './transaction';

export const Wallet = { create, list };

export const SmartContract = { deployFromTemplate, call, read };

export const Transaction = { get };

export * from './types';
