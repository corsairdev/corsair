import type {
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext as KeyBuilderContextBase,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type {
	KlipfolioEndpointInputs,
	KlipfolioEndpointOutputs,
} from './endpoints/types';
import {
	KlipfolioEndpointInputSchemas,
	KlipfolioEndpointOutputSchemas,
} from './endpoints/types';
import {
	listClients,
	retrieveClient,
	createClient,
	updateClient,
	deleteClient,
	enableDirectBillingClient,
	extendTrialClient,
	retrieveClientFeatures,
	updateClientFeatures,
	retrieveClientProperties,
	updateClientProperties,
	deleteClientProperties,
	retrieveClientResources,
	updateClientResources,
	retrieveClientSettings,
	createClientSettings,
	retrieveClientShareRights,
	setClientShareRights,
	deleteClientShareRight,
} from './endpoints/clients';
import {
	listDatasources,
	retrieveDatasource,
	createDatasource,
	updateDatasource,
	deleteDatasource,
	enableDatasource,
	disableDatasource,
	importDatasource,
	deleteInstancesDatasource,
	retrieveDatasourceProperties,
	updateDatasourceProperties,
	deleteDatasourceProperties,
	retrieveDatasourceShareRights,
	setDatasourceShareRights,
	deleteDatasourceShareRight,
	listDatasourceInstances,
	retrieveDatasourceInstances,
	createDatasourceInstances,
	deleteDatasourceInstances,
	retrieveDatasourceInstancesData,
	updateDatasourceInstancesData,
	refreshDatasourceInstances,
	refreshDatasource,
	retrieveDatasourceInstancesProperties,
	updateDatasourceInstancesProperties,
	deleteDatasourceInstancesProperties,
} from './endpoints/datasources';
import { KlipfolioSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type KlipfolioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalKlipfolioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof klipfolioEndpointsNested>;
};

const defaultAuthType: AuthTypes = 'api_key';

export type KlipfolioContext = CorsairPluginContext<
	typeof KlipfolioSchema,
	KlipfolioPluginOptions
>;

export type KlipfolioKeyBuilderContext =
	KeyBuilderContextBase<KlipfolioPluginOptions>;

export const klipfolioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseKlipfolioPlugin<T extends KlipfolioPluginOptions> =
	CorsairPlugin<
		'klipfolio',
		typeof KlipfolioSchema,
		typeof klipfolioEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalKlipfolioPlugin =
	BaseKlipfolioPlugin<KlipfolioPluginOptions>;

export type ExternalKlipfolioPlugin<T extends KlipfolioPluginOptions> =
	BaseKlipfolioPlugin<T>;

export type KlipfolioEndpoints = {
	[K in keyof KlipfolioEndpointInputs]: CorsairEndpoint<
		KlipfolioContext,
		KlipfolioEndpointInputs[K],
		KlipfolioEndpointOutputs[K]
	>;
};

// Binds every Klipfolio endpoint to its declared input and output schemas.
// Calls use this validated tree at runtime; the schemas registry stays as
// introspection metadata. The runtime context and per-operation shapes are
// intentional opacity: each unknown below carries its own justification.
function withKlipfolioSchemas<
	T extends Record<string, unknown>, // unknown: the tree mixes endpoint functions with family objects at any depth
>(tree: T, prefix = ''): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				klipfolioEndpointSchemas[
					operation as keyof typeof klipfolioEndpointSchemas
				];
			if (!schema) {
				throw new Error(`Missing Klipfolio endpoint schema for ${operation}`);
			}
			const endpoint = value as (
				ctx: unknown, // unknown: the Corsair runtime context varies by deployment; passed through untouched
				input: unknown, // unknown: parsed by schema.input.parse before the call
			) => Promise<unknown>; // unknown: each operation returns its own documented shape, parsed by schema.output.parse
			const validated = async (
				ctx: unknown, // unknown: same runtime context as above; only the schema boundary wraps the call
				input: unknown, // unknown: caller-supplied payload, parsed before transport
			) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				// unknown: family group nodes are plain objects at arbitrary
				// depth; the wrapper recurses so every nested leaf gets a
				// contract from the registry.
				withKlipfolioSchemas(
					value as Record<string, unknown>, // unknown: a family group object, recursed one level deeper
					operation,
				),
			];
		}
		return [key, value];
	});
	// unknown: the rebuild keeps the caller's tree shape while every leaf is
	// replaced by its schema-validated wrapper; TypeScript cannot express the
	// mixed function/object remap structurally, and the satisfies-checked
	// tree definition plus the endpoint schemas registry keep it honest.
	return Object.fromEntries(validatedEntries) as T; // unknown: same tree shape, leaves wrapped by their contracts
}

const klipfolioEndpointsNested = {
	clients: {
		listClients: listClients,
		retrieveClient: retrieveClient,
		createClient: createClient,
		updateClient: updateClient,
		deleteClient: deleteClient,
		enableDirectBillingClient: enableDirectBillingClient,
		extendTrialClient: extendTrialClient,
		retrieveClientFeatures: retrieveClientFeatures,
		updateClientFeatures: updateClientFeatures,
		retrieveClientProperties: retrieveClientProperties,
		updateClientProperties: updateClientProperties,
		deleteClientProperties: deleteClientProperties,
		retrieveClientResources: retrieveClientResources,
		updateClientResources: updateClientResources,
		retrieveClientSettings: retrieveClientSettings,
		createClientSettings: createClientSettings,
		retrieveClientShareRights: retrieveClientShareRights,
		setClientShareRights: setClientShareRights,
		deleteClientShareRight: deleteClientShareRight,
	},
	datasources: {
		listDatasources: listDatasources,
		retrieveDatasource: retrieveDatasource,
		createDatasource: createDatasource,
		updateDatasource: updateDatasource,
		deleteDatasource: deleteDatasource,
		enableDatasource: enableDatasource,
		disableDatasource: disableDatasource,
		importDatasource: importDatasource,
		deleteInstancesDatasource: deleteInstancesDatasource,
		retrieveDatasourceProperties: retrieveDatasourceProperties,
		updateDatasourceProperties: updateDatasourceProperties,
		deleteDatasourceProperties: deleteDatasourceProperties,
		retrieveDatasourceShareRights: retrieveDatasourceShareRights,
		setDatasourceShareRights: setDatasourceShareRights,
		deleteDatasourceShareRight: deleteDatasourceShareRight,
		listDatasourceInstances: listDatasourceInstances,
		retrieveDatasourceInstances: retrieveDatasourceInstances,
		createDatasourceInstances: createDatasourceInstances,
		deleteDatasourceInstances: deleteDatasourceInstances,
		retrieveDatasourceInstancesData: retrieveDatasourceInstancesData,
		updateDatasourceInstancesData: updateDatasourceInstancesData,
		refreshDatasourceInstances: refreshDatasourceInstances,
		refreshDatasource: refreshDatasource,
		retrieveDatasourceInstancesProperties:
			retrieveDatasourceInstancesProperties,
		updateDatasourceInstancesProperties: updateDatasourceInstancesProperties,
		deleteDatasourceInstancesProperties: deleteDatasourceInstancesProperties,
	},
} as const;

export const klipfolioEndpointMeta = {
	'clients.listClients': {
		riskLevel: 'read',
		description: 'List Clients on Klipfolio',
	},
	'clients.retrieveClient': {
		riskLevel: 'read',
		description: 'Get Client on Klipfolio',
	},
	'clients.createClient': {
		riskLevel: 'write',
		description: 'Create Client on Klipfolio',
	},
	'clients.updateClient': {
		riskLevel: 'write',
		description: 'Update Client on Klipfolio',
	},
	'clients.deleteClient': {
		riskLevel: 'destructive',
		description: 'Delete Client on Klipfolio',
	},
	'clients.enableDirectBillingClient': {
		riskLevel: 'write',
		description: 'Enable Direct Billing on Klipfolio',
	},
	'clients.extendTrialClient': {
		riskLevel: 'write',
		description: 'Extend Trial on Klipfolio',
	},
	'clients.retrieveClientFeatures': {
		riskLevel: 'read',
		description: 'Get Client Features on Klipfolio',
	},
	'clients.updateClientFeatures': {
		riskLevel: 'write',
		description: 'Update Client Features on Klipfolio',
	},
	'clients.retrieveClientProperties': {
		riskLevel: 'read',
		description: 'Get Client Properties on Klipfolio',
	},
	'clients.updateClientProperties': {
		riskLevel: 'write',
		description: 'Update Client Properties on Klipfolio',
	},
	'clients.deleteClientProperties': {
		riskLevel: 'destructive',
		description: 'Delete Client Property on Klipfolio',
	},
	'clients.retrieveClientResources': {
		riskLevel: 'read',
		description: 'Get Client Resources on Klipfolio',
	},
	'clients.updateClientResources': {
		riskLevel: 'write',
		description: 'Update Client Resources on Klipfolio',
	},
	'clients.retrieveClientSettings': {
		riskLevel: 'read',
		description: 'Get Client Settings on Klipfolio',
	},
	'clients.createClientSettings': {
		riskLevel: 'write',
		description: 'Set Client Settings on Klipfolio',
	},
	'clients.retrieveClientShareRights': {
		riskLevel: 'read',
		description: 'Get Client Share Rights on Klipfolio',
	},
	'clients.setClientShareRights': {
		riskLevel: 'write',
		description: 'Update Client Share Rights on Klipfolio',
	},
	'clients.deleteClientShareRight': {
		riskLevel: 'destructive',
		description: 'Revoke Group Access to Client on Klipfolio',
	},
	'datasources.listDatasources': {
		riskLevel: 'read',
		description: 'List Data Sources on Klipfolio',
	},
	'datasources.retrieveDatasource': {
		riskLevel: 'read',
		description: 'Get Data Source on Klipfolio',
	},
	'datasources.createDatasource': {
		riskLevel: 'write',
		description: 'Create Data Source on Klipfolio',
	},
	'datasources.updateDatasource': {
		riskLevel: 'write',
		description: 'Update Data Source on Klipfolio',
	},
	'datasources.deleteDatasource': {
		riskLevel: 'destructive',
		description: 'Delete Data Source on Klipfolio',
	},
	'datasources.enableDatasource': {
		riskLevel: 'write',
		description: 'Enable a Data Source on Klipfolio',
	},
	'datasources.disableDatasource': {
		riskLevel: 'write',
		description: 'Disable a Data Source on Klipfolio',
	},
	'datasources.importDatasource': {
		riskLevel: 'write',
		description: 'Import a Data Source on Klipfolio',
	},
	'datasources.deleteInstancesDatasource': {
		riskLevel: 'write',
		description: 'Delete Instances on Klipfolio',
	},
	'datasources.retrieveDatasourceProperties': {
		riskLevel: 'read',
		description: 'Get Data Source Properties on Klipfolio',
	},
	'datasources.updateDatasourceProperties': {
		riskLevel: 'write',
		description: 'Create or Update Data Source Properties on Klipfolio',
	},
	'datasources.deleteDatasourceProperties': {
		riskLevel: 'destructive',
		description: 'Delete a Data Source Property on Klipfolio',
	},
	'datasources.retrieveDatasourceShareRights': {
		riskLevel: 'read',
		description: 'Get Data Source Share Rights on Klipfolio',
	},
	'datasources.setDatasourceShareRights': {
		riskLevel: 'write',
		description: 'Update Data Source Share Rights on Klipfolio',
	},
	'datasources.deleteDatasourceShareRight': {
		riskLevel: 'destructive',
		description: 'Delete Data Source Share Right on Klipfolio',
	},
	'datasources.listDatasourceInstances': {
		riskLevel: 'read',
		description: 'List Data Source Instances on Klipfolio',
	},
	'datasources.retrieveDatasourceInstances': {
		riskLevel: 'read',
		description: 'Get Data Source Instance on Klipfolio',
	},
	'datasources.createDatasourceInstances': {
		riskLevel: 'write',
		description: 'Create Data Source Instance on Klipfolio',
	},
	'datasources.deleteDatasourceInstances': {
		riskLevel: 'destructive',
		description: 'Delete Data Source Instance on Klipfolio',
	},
	'datasources.retrieveDatasourceInstancesData': {
		riskLevel: 'read',
		description: 'Get Data Source Instance Data on Klipfolio',
	},
	'datasources.updateDatasourceInstancesData': {
		riskLevel: 'write',
		description: 'Update Data Source Instance Data on Klipfolio',
	},
	'datasources.refreshDatasourceInstances': {
		riskLevel: 'write',
		description: 'Refresh a Data Source Instance on Klipfolio',
	},
	'datasources.refreshDatasource': {
		riskLevel: 'write',
		description: 'Refresh Multiple Data Sources on Klipfolio',
	},
	'datasources.retrieveDatasourceInstancesProperties': {
		riskLevel: 'read',
		description: 'Get Data Source Instance Properties on Klipfolio',
	},
	'datasources.updateDatasourceInstancesProperties': {
		riskLevel: 'write',
		description:
			'Create or Update Data Source Instance Properties on Klipfolio',
	},
	'datasources.deleteDatasourceInstancesProperties': {
		riskLevel: 'destructive',
		description: 'Delete Data Source Instance Property on Klipfolio',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof klipfolioEndpointsNested
>;

export const klipfolioEndpointSchemas = {
	'clients.listClients': {
		input: KlipfolioEndpointInputSchemas.listClients,
		output: KlipfolioEndpointOutputSchemas.listClients,
	},
	'clients.retrieveClient': {
		input: KlipfolioEndpointInputSchemas.retrieveClient,
		output: KlipfolioEndpointOutputSchemas.retrieveClient,
	},
	'clients.createClient': {
		input: KlipfolioEndpointInputSchemas.createClient,
		output: KlipfolioEndpointOutputSchemas.createClient,
	},
	'clients.updateClient': {
		input: KlipfolioEndpointInputSchemas.updateClient,
		output: KlipfolioEndpointOutputSchemas.updateClient,
	},
	'clients.deleteClient': {
		input: KlipfolioEndpointInputSchemas.deleteClient,
		output: KlipfolioEndpointOutputSchemas.deleteClient,
	},
	'clients.enableDirectBillingClient': {
		input: KlipfolioEndpointInputSchemas.enableDirectBillingClient,
		output: KlipfolioEndpointOutputSchemas.enableDirectBillingClient,
	},
	'clients.extendTrialClient': {
		input: KlipfolioEndpointInputSchemas.extendTrialClient,
		output: KlipfolioEndpointOutputSchemas.extendTrialClient,
	},
	'clients.retrieveClientFeatures': {
		input: KlipfolioEndpointInputSchemas.retrieveClientFeatures,
		output: KlipfolioEndpointOutputSchemas.retrieveClientFeatures,
	},
	'clients.updateClientFeatures': {
		input: KlipfolioEndpointInputSchemas.updateClientFeatures,
		output: KlipfolioEndpointOutputSchemas.updateClientFeatures,
	},
	'clients.retrieveClientProperties': {
		input: KlipfolioEndpointInputSchemas.retrieveClientProperties,
		output: KlipfolioEndpointOutputSchemas.retrieveClientProperties,
	},
	'clients.updateClientProperties': {
		input: KlipfolioEndpointInputSchemas.updateClientProperties,
		output: KlipfolioEndpointOutputSchemas.updateClientProperties,
	},
	'clients.deleteClientProperties': {
		input: KlipfolioEndpointInputSchemas.deleteClientProperties,
		output: KlipfolioEndpointOutputSchemas.deleteClientProperties,
	},
	'clients.retrieveClientResources': {
		input: KlipfolioEndpointInputSchemas.retrieveClientResources,
		output: KlipfolioEndpointOutputSchemas.retrieveClientResources,
	},
	'clients.updateClientResources': {
		input: KlipfolioEndpointInputSchemas.updateClientResources,
		output: KlipfolioEndpointOutputSchemas.updateClientResources,
	},
	'clients.retrieveClientSettings': {
		input: KlipfolioEndpointInputSchemas.retrieveClientSettings,
		output: KlipfolioEndpointOutputSchemas.retrieveClientSettings,
	},
	'clients.createClientSettings': {
		input: KlipfolioEndpointInputSchemas.createClientSettings,
		output: KlipfolioEndpointOutputSchemas.createClientSettings,
	},
	'clients.retrieveClientShareRights': {
		input: KlipfolioEndpointInputSchemas.retrieveClientShareRights,
		output: KlipfolioEndpointOutputSchemas.retrieveClientShareRights,
	},
	'clients.setClientShareRights': {
		input: KlipfolioEndpointInputSchemas.setClientShareRights,
		output: KlipfolioEndpointOutputSchemas.setClientShareRights,
	},
	'clients.deleteClientShareRight': {
		input: KlipfolioEndpointInputSchemas.deleteClientShareRight,
		output: KlipfolioEndpointOutputSchemas.deleteClientShareRight,
	},
	'datasources.listDatasources': {
		input: KlipfolioEndpointInputSchemas.listDatasources,
		output: KlipfolioEndpointOutputSchemas.listDatasources,
	},
	'datasources.retrieveDatasource': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasource,
		output: KlipfolioEndpointOutputSchemas.retrieveDatasource,
	},
	'datasources.createDatasource': {
		input: KlipfolioEndpointInputSchemas.createDatasource,
		output: KlipfolioEndpointOutputSchemas.createDatasource,
	},
	'datasources.updateDatasource': {
		input: KlipfolioEndpointInputSchemas.updateDatasource,
		output: KlipfolioEndpointOutputSchemas.updateDatasource,
	},
	'datasources.deleteDatasource': {
		input: KlipfolioEndpointInputSchemas.deleteDatasource,
		output: KlipfolioEndpointOutputSchemas.deleteDatasource,
	},
	'datasources.enableDatasource': {
		input: KlipfolioEndpointInputSchemas.enableDatasource,
		output: KlipfolioEndpointOutputSchemas.enableDatasource,
	},
	'datasources.disableDatasource': {
		input: KlipfolioEndpointInputSchemas.disableDatasource,
		output: KlipfolioEndpointOutputSchemas.disableDatasource,
	},
	'datasources.importDatasource': {
		input: KlipfolioEndpointInputSchemas.importDatasource,
		output: KlipfolioEndpointOutputSchemas.importDatasource,
	},
	'datasources.deleteInstancesDatasource': {
		input: KlipfolioEndpointInputSchemas.deleteInstancesDatasource,
		output: KlipfolioEndpointOutputSchemas.deleteInstancesDatasource,
	},
	'datasources.retrieveDatasourceProperties': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasourceProperties,
		output: KlipfolioEndpointOutputSchemas.retrieveDatasourceProperties,
	},
	'datasources.updateDatasourceProperties': {
		input: KlipfolioEndpointInputSchemas.updateDatasourceProperties,
		output: KlipfolioEndpointOutputSchemas.updateDatasourceProperties,
	},
	'datasources.deleteDatasourceProperties': {
		input: KlipfolioEndpointInputSchemas.deleteDatasourceProperties,
		output: KlipfolioEndpointOutputSchemas.deleteDatasourceProperties,
	},
	'datasources.retrieveDatasourceShareRights': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasourceShareRights,
		output: KlipfolioEndpointOutputSchemas.retrieveDatasourceShareRights,
	},
	'datasources.setDatasourceShareRights': {
		input: KlipfolioEndpointInputSchemas.setDatasourceShareRights,
		output: KlipfolioEndpointOutputSchemas.setDatasourceShareRights,
	},
	'datasources.deleteDatasourceShareRight': {
		input: KlipfolioEndpointInputSchemas.deleteDatasourceShareRight,
		output: KlipfolioEndpointOutputSchemas.deleteDatasourceShareRight,
	},
	'datasources.listDatasourceInstances': {
		input: KlipfolioEndpointInputSchemas.listDatasourceInstances,
		output: KlipfolioEndpointOutputSchemas.listDatasourceInstances,
	},
	'datasources.retrieveDatasourceInstances': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasourceInstances,
		output: KlipfolioEndpointOutputSchemas.retrieveDatasourceInstances,
	},
	'datasources.createDatasourceInstances': {
		input: KlipfolioEndpointInputSchemas.createDatasourceInstances,
		output: KlipfolioEndpointOutputSchemas.createDatasourceInstances,
	},
	'datasources.deleteDatasourceInstances': {
		input: KlipfolioEndpointInputSchemas.deleteDatasourceInstances,
		output: KlipfolioEndpointOutputSchemas.deleteDatasourceInstances,
	},
	'datasources.retrieveDatasourceInstancesData': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasourceInstancesData,
		output: KlipfolioEndpointOutputSchemas.retrieveDatasourceInstancesData,
	},
	'datasources.updateDatasourceInstancesData': {
		input: KlipfolioEndpointInputSchemas.updateDatasourceInstancesData,
		output: KlipfolioEndpointOutputSchemas.updateDatasourceInstancesData,
	},
	'datasources.refreshDatasourceInstances': {
		input: KlipfolioEndpointInputSchemas.refreshDatasourceInstances,
		output: KlipfolioEndpointOutputSchemas.refreshDatasourceInstances,
	},
	'datasources.refreshDatasource': {
		input: KlipfolioEndpointInputSchemas.refreshDatasource,
		output: KlipfolioEndpointOutputSchemas.refreshDatasource,
	},
	'datasources.retrieveDatasourceInstancesProperties': {
		input: KlipfolioEndpointInputSchemas.retrieveDatasourceInstancesProperties,
		output:
			KlipfolioEndpointOutputSchemas.retrieveDatasourceInstancesProperties,
	},
	'datasources.updateDatasourceInstancesProperties': {
		input: KlipfolioEndpointInputSchemas.updateDatasourceInstancesProperties,
		output: KlipfolioEndpointOutputSchemas.updateDatasourceInstancesProperties,
	},
	'datasources.deleteDatasourceInstancesProperties': {
		input: KlipfolioEndpointInputSchemas.deleteDatasourceInstancesProperties,
		output: KlipfolioEndpointOutputSchemas.deleteDatasourceInstancesProperties,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof klipfolioEndpointsNested
>;

const validatedKlipfolioEndpointsNested = withKlipfolioSchemas(
	klipfolioEndpointsNested,
);

export function klipfolio<const T extends KlipfolioPluginOptions>(
	incomingOptions: KlipfolioPluginOptions & T = {} as KlipfolioPluginOptions &
		T,
): ExternalKlipfolioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'klipfolio',
		authConfig: klipfolioAuthConfig,
		schema: KlipfolioSchema,
		options,
		hooks: options.hooks,
		endpoints: validatedKlipfolioEndpointsNested,
		webhooks: {},
		endpointMeta: klipfolioEndpointMeta,
		endpointSchemas: klipfolioEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: KlipfolioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}
			throw new AuthMissingError('klipfolio', 'api_key');
		},
	} satisfies InternalKlipfolioPlugin;
}
