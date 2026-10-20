import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Ipfs,
	SmartContract,
	Template,
	Transaction,
	Wallet,
	Watcher,
	Webhook,
} from './endpoints';
import type {
	StartonEndpointInputs,
	StartonEndpointOutputs,
} from './endpoints/types';
import {
	StartonEndpointInputSchemas,
	StartonEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StartonSchema } from './schema';

export type StartonPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Starton project API key. Overrides the account key store. */
	key?: string;
	hooks?: InternalStartonPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof startonEndpointsNested>;
};

export type StartonContext = CorsairPluginContext<
	typeof StartonSchema,
	StartonPluginOptions
>;

export type StartonKeyBuilderContext = KeyBuilderContext<StartonPluginOptions>;

export type StartonBoundEndpoints = BindEndpoints<
	typeof startonEndpointsNested
>;

type StartonEndpoint<K extends keyof StartonEndpointOutputs> = CorsairEndpoint<
	StartonContext,
	StartonEndpointInputs[K],
	StartonEndpointOutputs[K]
>;

export type StartonEndpoints = {
	[K in keyof StartonEndpointOutputs]: StartonEndpoint<K>;
};

const startonEndpointsNested = {
	wallet: {
		create: Wallet.create,
		list: Wallet.list,
	},
	smartContract: {
		deployFromTemplate: SmartContract.deployFromTemplate,
		call: SmartContract.call,
		read: SmartContract.read,
		list: SmartContract.list,
	},
	template: {
		list: Template.list,
	},
	transaction: {
		get: Transaction.get,
	},
	watcher: {
		get: Watcher.get,
		delete: Watcher.delete,
	},
	webhook: {
		list: Webhook.list,
	},
	ipfs: {
		uploadFile: Ipfs.uploadFile,
	},
} as const;

export const startonEndpointSchemas = {
	'wallet.create': {
		input: StartonEndpointInputSchemas.walletCreate,
		output: StartonEndpointOutputSchemas.walletCreate,
	},
	'wallet.list': {
		input: StartonEndpointInputSchemas.walletList,
		output: StartonEndpointOutputSchemas.walletList,
	},
	'smartContract.deployFromTemplate': {
		input: StartonEndpointInputSchemas.smartContractDeployFromTemplate,
		output: StartonEndpointOutputSchemas.smartContractDeployFromTemplate,
	},
	'smartContract.call': {
		input: StartonEndpointInputSchemas.smartContractCall,
		output: StartonEndpointOutputSchemas.smartContractCall,
	},
	'smartContract.read': {
		input: StartonEndpointInputSchemas.smartContractRead,
		output: StartonEndpointOutputSchemas.smartContractRead,
	},
	'smartContract.list': {
		input: StartonEndpointInputSchemas.smartContractList,
		output: StartonEndpointOutputSchemas.smartContractList,
	},
	'template.list': {
		input: StartonEndpointInputSchemas.templateList,
		output: StartonEndpointOutputSchemas.templateList,
	},
	'transaction.get': {
		input: StartonEndpointInputSchemas.transactionGet,
		output: StartonEndpointOutputSchemas.transactionGet,
	},
	'watcher.get': {
		input: StartonEndpointInputSchemas.watcherGet,
		output: StartonEndpointOutputSchemas.watcherGet,
	},
	'watcher.delete': {
		input: StartonEndpointInputSchemas.watcherDelete,
		output: StartonEndpointOutputSchemas.watcherDelete,
	},
	'webhook.list': {
		input: StartonEndpointInputSchemas.webhookList,
		output: StartonEndpointOutputSchemas.webhookList,
	},
	'ipfs.uploadFile': {
		input: StartonEndpointInputSchemas.ipfsUploadFile,
		output: StartonEndpointOutputSchemas.ipfsUploadFile,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof startonEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const startonEndpointMeta = {
	'wallet.create': {
		riskLevel: 'write',
		description: 'Create a new KMS-managed blockchain wallet for the project',
	},
	'wallet.list': {
		riskLevel: 'read',
		description: 'List the KMS-managed wallets for the project (paginated)',
	},
	'smartContract.deployFromTemplate': {
		riskLevel: 'write',
		description:
			'Deploy a smart contract from a Starton-audited template (e.g. ERC20, ERC721)',
	},
	'smartContract.call': {
		riskLevel: 'write',
		description:
			'Execute a state-changing function on a deployed smart contract',
	},
	'smartContract.read': {
		riskLevel: 'read',
		description:
			'Call a read-only function on a deployed smart contract without broadcasting a transaction',
	},
	'smartContract.list': {
		riskLevel: 'read',
		description: 'List the smart contracts in the project (paginated)',
	},
	'template.list': {
		riskLevel: 'read',
		description: 'List the Starton Library smart contract templates',
	},
	'transaction.get': {
		riskLevel: 'read',
		description: 'Retrieve a blockchain transaction by its Starton id',
	},
	'watcher.get': {
		riskLevel: 'read',
		description: 'Retrieve a blockchain event watcher by its id',
	},
	'watcher.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a blockchain event watcher by its id',
	},
	'webhook.list': {
		riskLevel: 'read',
		description: 'List the webhook deliveries sent by watchers (paginated)',
	},
	'ipfs.uploadFile': {
		riskLevel: 'write',
		description: "Upload a file to the project's IPFS storage and pin it",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof startonEndpointsNested>;

export type BaseStartonPlugin<T extends StartonPluginOptions> = CorsairPlugin<
	'starton',
	typeof StartonSchema,
	typeof startonEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalStartonPlugin = BaseStartonPlugin<StartonPluginOptions>;

export type ExternalStartonPlugin<T extends StartonPluginOptions> =
	BaseStartonPlugin<T>;

export function starton<const T extends StartonPluginOptions>(
	// Safe: every StartonPluginOptions field is optional, so {} satisfies it.
	// A narrower type is not practical because TypeScript cannot prove {} fits the open generic T, and a default of T is not expressible.
	incomingOptions: StartonPluginOptions & T = {} as StartonPluginOptions & T,
): ExternalStartonPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'starton',
		schema: StartonSchema,
		options,
		hooks: options.hooks,
		endpoints: startonEndpointsNested,
		webhooks: {},
		endpointMeta: startonEndpointMeta,
		endpointSchemas: startonEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: StartonKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('starton', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('starton', 'api_key');
		},
	} satisfies InternalStartonPlugin;
}

export type {
	StartonEndpointInputs,
	StartonEndpointOutputs,
} from './endpoints/types';
export type {
	StartonPin,
	StartonSmartContract,
	StartonSmartContractTemplate,
	StartonSmartContractUI,
	StartonTransaction,
	StartonWallet,
	StartonWatcher,
	StartonWebhook,
} from './schema/database';
