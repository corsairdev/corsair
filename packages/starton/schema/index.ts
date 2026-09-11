import {
	StartonSmartContract,
	StartonTransaction,
	StartonWallet,
} from './database';

export const StartonSchema = {
	version: '1.0.0',
	entities: {
		wallets: StartonWallet,
		smartContracts: StartonSmartContract,
		transactions: StartonTransaction,
	},
} as const;

export {
	StartonCustomGas,
	StartonPaginationMeta,
	StartonSmartContract,
	StartonSmartContractUI,
	StartonSpeed,
	StartonTransaction,
	StartonTransactionLog,
	StartonTransactionState,
	StartonTransactionStatus,
	StartonWallet,
} from './database';
