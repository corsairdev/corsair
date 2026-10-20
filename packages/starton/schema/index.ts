import {
	StartonPin,
	StartonSmartContract,
	StartonSmartContractTemplate,
	StartonTransaction,
	StartonWallet,
	StartonWatcher,
	StartonWebhook,
} from './database';

export const StartonSchema = {
	version: '1.0.0',
	entities: {
		wallets: StartonWallet,
		smartContracts: StartonSmartContract,
		transactions: StartonTransaction,
		templates: StartonSmartContractTemplate,
		watchers: StartonWatcher,
		webhooks: StartonWebhook,
		pins: StartonPin,
	},
} as const;

export {
	StartonCustomGas,
	StartonPaginationMeta,
	StartonPin,
	StartonSmartContract,
	StartonSmartContractTemplate,
	StartonSmartContractUI,
	StartonSpeed,
	StartonTransaction,
	StartonTransactionLog,
	StartonTransactionState,
	StartonTransactionStatus,
	StartonWallet,
	StartonWatcher,
	StartonWatcherType,
	StartonWebhook,
	StartonWebhookStatus,
} from './database';
