import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Config, Network, Storage, Vm } from './endpoints';
import type {
	PilvioEndpointInputs,
	PilvioEndpointOutputs,
} from './endpoints/types';
import {
	PilvioEndpointInputSchemas,
	PilvioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PilvioSchema } from './schema';

export type PilvioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPilvioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pilvioEndpointsNested>;
};

export type PilvioContext = CorsairPluginContext<
	typeof PilvioSchema,
	PilvioPluginOptions,
	undefined,
	typeof pilvioAuthConfig
>;

export type PilvioKeyBuilderContext = KeyBuilderContext<
	PilvioPluginOptions,
	typeof pilvioAuthConfig
>;

export type PilvioBoundEndpoints = BindEndpoints<typeof pilvioEndpointsNested>;

type PilvioEndpoint<K extends keyof PilvioEndpointOutputs> = CorsairEndpoint<
	PilvioContext,
	PilvioEndpointInputs[K],
	PilvioEndpointOutputs[K]
>;

export type PilvioEndpoints = {
	[K in keyof PilvioEndpointOutputs]: PilvioEndpoint<K>;
};

const pilvioEndpointsNested = {
	account: {
		getUser: Account.getUser,
		updateProfile: Account.updateProfile,
		tokens: {
			list: Account.listTokens,
			create: Account.createToken,
			update: Account.updateToken,
			delete: Account.deleteToken,
		},
		sshKeys: {
			list: Account.listSshKeys,
			create: Account.createSshKey,
			rename: Account.renameSshKey,
			delete: Account.deleteSshKey,
		},
	},
	config: {
		listLocations: Config.listLocations,
		listVmImages: Config.listVmImages,
		listPlainOsImages: Config.listPlainOsImages,
		listAppCatalogImages: Config.listAppCatalogImages,
		listBootImages: Config.listBootImages,
		listResourcePools: Config.listResourcePools,
		getPricingPolicy: Config.getPricingPolicy,
	},
	vm: {
		list: Vm.list,
		get: Vm.get,
		create: Vm.create,
		start: Vm.start,
		stop: Vm.stop,
		reinstall: Vm.reinstall,
		delete: Vm.deleteVm,
	},
	storage: {
		disks: {
			list: Storage.listDisks,
			create: Storage.createDisk,
			get: Storage.getDisk,
			update: Storage.updateDisk,
			delete: Storage.deleteDisk,
		},
		buckets: {
			list: Storage.listBuckets,
			create: Storage.createBucket,
			get: Storage.getBucket,
			update: Storage.updateBucket,
			delete: Storage.deleteBucket,
		},
	},
	network: {
		networks: {
			list: Network.listNetworks,
			get: Network.getNetwork,
			create: Network.createNetwork,
			delete: Network.deleteNetwork,
		},
		firewalls: {
			list: Network.listFirewalls,
			create: Network.createFirewall,
			delete: Network.deleteFirewall,
		},
	},
} as const;

export const pilvioEndpointSchemas = {
	'account.getUser': {
		input: PilvioEndpointInputSchemas.userGet,
		output: PilvioEndpointOutputSchemas.userGet,
	},
	'account.updateProfile': {
		input: PilvioEndpointInputSchemas.userUpdateProfile,
		output: PilvioEndpointOutputSchemas.userUpdateProfile,
	},
	'account.tokens.list': {
		input: PilvioEndpointInputSchemas.tokensList,
		output: PilvioEndpointOutputSchemas.tokensList,
	},
	'account.tokens.create': {
		input: PilvioEndpointInputSchemas.tokensCreate,
		output: PilvioEndpointOutputSchemas.tokensCreate,
	},
	'account.tokens.update': {
		input: PilvioEndpointInputSchemas.tokensUpdate,
		output: PilvioEndpointOutputSchemas.tokensUpdate,
	},
	'account.tokens.delete': {
		input: PilvioEndpointInputSchemas.tokensDelete,
		output: PilvioEndpointOutputSchemas.tokensDelete,
	},
	'account.sshKeys.list': {
		input: PilvioEndpointInputSchemas.sshKeysList,
		output: PilvioEndpointOutputSchemas.sshKeysList,
	},
	'account.sshKeys.create': {
		input: PilvioEndpointInputSchemas.sshKeysCreate,
		output: PilvioEndpointOutputSchemas.sshKeysCreate,
	},
	'account.sshKeys.rename': {
		input: PilvioEndpointInputSchemas.sshKeysRename,
		output: PilvioEndpointOutputSchemas.sshKeysRename,
	},
	'account.sshKeys.delete': {
		input: PilvioEndpointInputSchemas.sshKeysDelete,
		output: PilvioEndpointOutputSchemas.sshKeysDelete,
	},
	'config.listLocations': {
		input: PilvioEndpointInputSchemas.configListLocations,
		output: PilvioEndpointOutputSchemas.configListLocations,
	},
	'config.listVmImages': {
		input: PilvioEndpointInputSchemas.configListVmImages,
		output: PilvioEndpointOutputSchemas.configListVmImages,
	},
	'config.listPlainOsImages': {
		input: PilvioEndpointInputSchemas.configListPlainOsImages,
		output: PilvioEndpointOutputSchemas.configListPlainOsImages,
	},
	'config.listAppCatalogImages': {
		input: PilvioEndpointInputSchemas.configListAppCatalogImages,
		output: PilvioEndpointOutputSchemas.configListAppCatalogImages,
	},
	'config.listBootImages': {
		input: PilvioEndpointInputSchemas.configListBootImages,
		output: PilvioEndpointOutputSchemas.configListBootImages,
	},
	'config.listResourcePools': {
		input: PilvioEndpointInputSchemas.configListResourcePools,
		output: PilvioEndpointOutputSchemas.configListResourcePools,
	},
	'config.getPricingPolicy': {
		input: PilvioEndpointInputSchemas.configGetPricingPolicy,
		output: PilvioEndpointOutputSchemas.configGetPricingPolicy,
	},
	'vm.list': {
		input: PilvioEndpointInputSchemas.vmList,
		output: PilvioEndpointOutputSchemas.vmList,
	},
	'vm.get': {
		input: PilvioEndpointInputSchemas.vmGet,
		output: PilvioEndpointOutputSchemas.vmGet,
	},
	'vm.create': {
		input: PilvioEndpointInputSchemas.vmCreate,
		output: PilvioEndpointOutputSchemas.vmCreate,
	},
	'vm.start': {
		input: PilvioEndpointInputSchemas.vmStart,
		output: PilvioEndpointOutputSchemas.vmStart,
	},
	'vm.stop': {
		input: PilvioEndpointInputSchemas.vmStop,
		output: PilvioEndpointOutputSchemas.vmStop,
	},
	'vm.reinstall': {
		input: PilvioEndpointInputSchemas.vmReinstall,
		output: PilvioEndpointOutputSchemas.vmReinstall,
	},
	'vm.delete': {
		input: PilvioEndpointInputSchemas.vmDelete,
		output: PilvioEndpointOutputSchemas.vmDelete,
	},
	'storage.disks.list': {
		input: PilvioEndpointInputSchemas.disksList,
		output: PilvioEndpointOutputSchemas.disksList,
	},
	'storage.disks.create': {
		input: PilvioEndpointInputSchemas.disksCreate,
		output: PilvioEndpointOutputSchemas.disksCreate,
	},
	'storage.disks.get': {
		input: PilvioEndpointInputSchemas.disksGet,
		output: PilvioEndpointOutputSchemas.disksGet,
	},
	'storage.disks.update': {
		input: PilvioEndpointInputSchemas.disksUpdate,
		output: PilvioEndpointOutputSchemas.disksUpdate,
	},
	'storage.disks.delete': {
		input: PilvioEndpointInputSchemas.disksDelete,
		output: PilvioEndpointOutputSchemas.disksDelete,
	},
	'storage.buckets.list': {
		input: PilvioEndpointInputSchemas.bucketsList,
		output: PilvioEndpointOutputSchemas.bucketsList,
	},
	'storage.buckets.create': {
		input: PilvioEndpointInputSchemas.bucketsCreate,
		output: PilvioEndpointOutputSchemas.bucketsCreate,
	},
	'storage.buckets.get': {
		input: PilvioEndpointInputSchemas.bucketsGet,
		output: PilvioEndpointOutputSchemas.bucketsGet,
	},
	'storage.buckets.update': {
		input: PilvioEndpointInputSchemas.bucketsUpdate,
		output: PilvioEndpointOutputSchemas.bucketsUpdate,
	},
	'storage.buckets.delete': {
		input: PilvioEndpointInputSchemas.bucketsDelete,
		output: PilvioEndpointOutputSchemas.bucketsDelete,
	},
	'network.networks.list': {
		input: PilvioEndpointInputSchemas.networksList,
		output: PilvioEndpointOutputSchemas.networksList,
	},
	'network.networks.get': {
		input: PilvioEndpointInputSchemas.networksGet,
		output: PilvioEndpointOutputSchemas.networksGet,
	},
	'network.networks.create': {
		input: PilvioEndpointInputSchemas.networksCreate,
		output: PilvioEndpointOutputSchemas.networksCreate,
	},
	'network.networks.delete': {
		input: PilvioEndpointInputSchemas.networksDelete,
		output: PilvioEndpointOutputSchemas.networksDelete,
	},
	'network.firewalls.list': {
		input: PilvioEndpointInputSchemas.firewallsList,
		output: PilvioEndpointOutputSchemas.firewallsList,
	},
	'network.firewalls.create': {
		input: PilvioEndpointInputSchemas.firewallsCreate,
		output: PilvioEndpointOutputSchemas.firewallsCreate,
	},
	'network.firewalls.delete': {
		input: PilvioEndpointInputSchemas.firewallsDelete,
		output: PilvioEndpointOutputSchemas.firewallsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pilvioEndpointsNested
>;

export const pilvioEndpointMeta = {
	'account.getUser': {
		riskLevel: 'read',
		description: 'Read the authenticated user and profile',
	},
	'account.updateProfile': {
		riskLevel: 'write',
		description: 'Update the user profile fields',
	},
	'account.tokens.list': {
		riskLevel: 'read',
		description: 'List the API tokens of the user',
	},
	'account.tokens.create': {
		riskLevel: 'write',
		description:
			'Create an API token, optionally restricted to one billing account',
	},
	'account.tokens.update': {
		riskLevel: 'write',
		description: 'Update a token description or restriction',
	},
	'account.tokens.delete': {
		riskLevel: 'destructive',
		description: 'Delete an API token',
	},
	'account.sshKeys.list': {
		riskLevel: 'read',
		description: 'List the SSH public keys of the user',
	},
	'account.sshKeys.create': {
		riskLevel: 'write',
		description: 'Add an SSH public key',
	},
	'account.sshKeys.rename': {
		riskLevel: 'write',
		description: 'Rename an SSH key',
	},
	'account.sshKeys.delete': {
		riskLevel: 'destructive',
		description: 'Delete an SSH key',
	},
	'config.listLocations': {
		riskLevel: 'read',
		description: 'List the Pilvio data centre locations',
	},
	'config.listVmImages': {
		riskLevel: 'read',
		description: 'List the VM image catalog',
	},
	'config.listPlainOsImages': {
		riskLevel: 'read',
		description: 'List the plain OS images',
	},
	'config.listAppCatalogImages': {
		riskLevel: 'read',
		description: 'List the app catalog images',
	},
	'config.listBootImages': {
		riskLevel: 'read',
		description: 'List bootable media images',
	},
	'config.listResourcePools': {
		riskLevel: 'read',
		description: 'List VM server classes (resource pools)',
	},
	'config.getPricingPolicy': {
		riskLevel: 'read',
		description: 'Read the pricing policy lines',
	},
	'vm.list': {
		riskLevel: 'read',
		description: 'List the virtual machines',
	},
	'vm.get': {
		riskLevel: 'read',
		description: 'Read one VM by UUID',
	},
	'vm.create': {
		riskLevel: 'write',
		description: 'Create a virtual machine from an image or source',
	},
	'vm.start': {
		riskLevel: 'write',
		description: 'Start a stopped VM',
	},
	'vm.stop': {
		riskLevel: 'write',
		description: 'Stop a running VM',
	},
	'vm.reinstall': {
		riskLevel: 'destructive',
		description: 'Reinstall a VM with a new OS; existing data is replaced',
	},
	'vm.delete': {
		riskLevel: 'destructive',
		description: 'Delete a virtual machine',
	},
	'storage.disks.list': {
		riskLevel: 'read',
		description: 'List the block storage disks',
	},
	'storage.disks.create': {
		riskLevel: 'write',
		description: 'Create a disk from empty, an OS image, a disk or a snapshot',
	},
	'storage.disks.get': {
		riskLevel: 'read',
		description: 'Read one disk by UUID',
	},
	'storage.disks.update': {
		riskLevel: 'write',
		description: 'Update disk metadata',
	},
	'storage.disks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a disk',
	},
	'storage.buckets.list': {
		riskLevel: 'read',
		description: 'List the object storage buckets',
	},
	'storage.buckets.create': {
		riskLevel: 'write',
		description: 'Create an S3 bucket with a globally unique name',
	},
	'storage.buckets.get': {
		riskLevel: 'read',
		description: 'Read one bucket by name',
	},
	'storage.buckets.update': {
		riskLevel: 'write',
		description: 'Move a bucket to another billing account',
	},
	'storage.buckets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a bucket',
	},
	'network.networks.list': {
		riskLevel: 'read',
		description: 'List the private networks',
	},
	'network.networks.get': {
		riskLevel: 'read',
		description: 'Read one network by UUID',
	},
	'network.networks.create': {
		riskLevel: 'write',
		description: 'Create a private network',
	},
	'network.networks.delete': {
		riskLevel: 'destructive',
		description: 'Delete an empty, non-default network',
	},
	'network.firewalls.list': {
		riskLevel: 'read',
		description: 'List the firewalls and their rules',
	},
	'network.firewalls.create': {
		riskLevel: 'write',
		description: 'Create a firewall with rules',
	},
	'network.firewalls.delete': {
		riskLevel: 'destructive',
		description: 'Delete a firewall',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pilvioEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const pilvioAuthConfig = {
	api_key: {
		// Pilvio issues API tokens per user; no account-level field is needed
		// beside the token.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePilvioPlugin<T extends PilvioPluginOptions> = CorsairPlugin<
	'pilvio',
	typeof PilvioSchema,
	typeof pilvioEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof pilvioAuthConfig
>;

export type InternalPilvioPlugin = BasePilvioPlugin<PilvioPluginOptions>;

export type ExternalPilvioPlugin<T extends PilvioPluginOptions> =
	BasePilvioPlugin<T>;

export function pilvio<const T extends PilvioPluginOptions>(
	incomingOptions: PilvioPluginOptions & T = {} as PilvioPluginOptions & T,
): ExternalPilvioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pilvio',
		authConfig: pilvioAuthConfig,
		schema: PilvioSchema,
		options: options,
		hooks: options.hooks,
		endpoints: pilvioEndpointsNested,
		webhooks: {},
		endpointMeta: pilvioEndpointMeta,
		endpointSchemas: pilvioEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PilvioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('pilvio', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPilvioPlugin;
}

export { PilvioAPIError } from './client';

export type {
	Bucket,
	Disk,
	Firewall,
	FirewallRule,
	Location,
	Network,
	PilvioEndpointInputs,
	PilvioEndpointOutputs,
	PricingLine,
	SshKey,
	Token,
	User,
	Vm,
} from './endpoints/types';
