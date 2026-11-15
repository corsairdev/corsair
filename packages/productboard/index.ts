import type {
	BindEndpoints,
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
import {
	Analytics,
	Entities,
	JiraIntegrations,
	Members,
	Notes,
	PluginIntegrations,
	Teams,
} from './endpoints';
import {
	ProductboardOperations,
	productboardOperationInputSchema,
} from './endpoints/operations';
import type {
	ProductboardOperationInput,
	ProductboardOutput,
} from './endpoints/types';
import { ProductboardOutputSchema } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ProductboardSchema } from './schema';

export type ProductboardPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalProductboardPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof productboardEndpointsNested>;
};

export type ProductboardContext = CorsairPluginContext<
	typeof ProductboardSchema,
	ProductboardPluginOptions
>;

export type ProductboardKeyBuilderContext =
	KeyBuilderContext<ProductboardPluginOptions>;

export type ProductboardBoundEndpoints = BindEndpoints<
	typeof productboardEndpointsNested
>;

export type ProductboardEndpoints = typeof productboardEndpointsNested;

const productboardEndpointsNested = {
	notes: Notes,
	entities: Entities,
	analytics: Analytics,
	members: Members,
	teams: Teams,
	jiraIntegrations: JiraIntegrations,
	pluginIntegrations: PluginIntegrations,
} as const;

export const productboardEndpointSchemas = {
	'notes.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.list'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.search': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.search'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.create'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.get'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.update'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.delete'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.configurations.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.configurations.list'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.configurations.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.configurations.get'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.relationships.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.relationships.list'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.relationships.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.relationships.create'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.relationships.setCustomer': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.relationships.setCustomer'],
		),
		output: ProductboardOutputSchema,
	},
	'notes.relationships.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.relationships.delete'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.list'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.search': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.search'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.create'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.get'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.update'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.delete'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.configurations.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.configurations.list'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.configurations.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.configurations.get'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.relationships.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.relationships.list'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.relationships.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.relationships.create'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.relationships.setParent': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.relationships.setParent'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.relationships.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.relationships.delete'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.fieldValues.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.fieldValues.list'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.fieldValues.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.fieldValues.create'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.fieldValues.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.fieldValues.update'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.fieldValues.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.fieldValues.delete'],
		),
		output: ProductboardOutputSchema,
	},
	'entities.customerScore': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.customerScore'],
		),
		output: ProductboardOutputSchema,
	},
	'analytics.memberActivities': {
		input: productboardOperationInputSchema(
			ProductboardOperations['analytics.memberActivities'],
		),
		output: ProductboardOutputSchema,
	},
	'members.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['members.list'],
		),
		output: ProductboardOutputSchema,
	},
	'members.search': {
		input: productboardOperationInputSchema(
			ProductboardOperations['members.search'],
		),
		output: ProductboardOutputSchema,
	},
	'members.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['members.get'],
		),
		output: ProductboardOutputSchema,
	},
	'teams.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.list'],
		),
		output: ProductboardOutputSchema,
	},
	'teams.search': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.search'],
		),
		output: ProductboardOutputSchema,
	},
	'teams.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.create'],
		),
		output: ProductboardOutputSchema,
	},
	'teams.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.get'],
		),
		output: ProductboardOutputSchema,
	},
	'teams.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.update'],
		),
		output: ProductboardOutputSchema,
	},
	'teams.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.delete'],
		),
		output: ProductboardOutputSchema,
	},
	'teams.members': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.members'],
		),
		output: ProductboardOutputSchema,
	},
	'jiraIntegrations.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['jiraIntegrations.list'],
		),
		output: ProductboardOutputSchema,
	},
	'jiraIntegrations.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['jiraIntegrations.get'],
		),
		output: ProductboardOutputSchema,
	},
	'jiraIntegrations.connections': {
		input: productboardOperationInputSchema(
			ProductboardOperations['jiraIntegrations.connections'],
		),
		output: ProductboardOutputSchema,
	},
	'jiraIntegrations.connection': {
		input: productboardOperationInputSchema(
			ProductboardOperations['jiraIntegrations.connection'],
		),
		output: ProductboardOutputSchema,
	},
	'pluginIntegrations.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.list'],
		),
		output: ProductboardOutputSchema,
	},
	'pluginIntegrations.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.create'],
		),
		output: ProductboardOutputSchema,
	},
	'pluginIntegrations.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.get'],
		),
		output: ProductboardOutputSchema,
	},
	'pluginIntegrations.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.update'],
		),
		output: ProductboardOutputSchema,
	},
	'pluginIntegrations.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.delete'],
		),
		output: ProductboardOutputSchema,
	},
	'pluginIntegrations.connections.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.connections.list'],
		),
		output: ProductboardOutputSchema,
	},
	'pluginIntegrations.connections.search': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.connections.search'],
		),
		output: ProductboardOutputSchema,
	},
	'pluginIntegrations.connections.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.connections.get'],
		),
		output: ProductboardOutputSchema,
	},
	'pluginIntegrations.connections.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.connections.update'],
		),
		output: ProductboardOutputSchema,
	},
	'pluginIntegrations.connections.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.connections.delete'],
		),
		output: ProductboardOutputSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof productboardEndpointsNested
>;

const productboardEndpointMeta = {
	'notes.list': {
		riskLevel: 'read',
		description: 'List notes using documented filters and cursor pagination.',
	},
	'notes.search': {
		riskLevel: 'read',
		description: 'Search notes with structured filters and relationships.',
	},
	'notes.create': {
		riskLevel: 'write',
		description:
			'Create a text or conversation note, optionally with relationships.',
	},
	'notes.get': { riskLevel: 'read', description: 'Get a note by UUID.' },
	'notes.update': {
		riskLevel: 'write',
		description: 'Update note fields or apply documented patch operations.',
	},
	'notes.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a note.',
	},
	'notes.configurations.list': {
		riskLevel: 'read',
		description: 'List note-type configuration metadata.',
	},
	'notes.configurations.get': {
		riskLevel: 'read',
		description: 'Get configuration metadata for one note type.',
	},
	'notes.relationships.list': {
		riskLevel: 'read',
		description: 'List a note’s customer and product-link relationships.',
	},
	'notes.relationships.create': {
		riskLevel: 'write',
		description: 'Create a customer or product-link relationship for a note.',
	},
	'notes.relationships.setCustomer': {
		riskLevel: 'write',
		description: 'Replace a note’s single customer relationship.',
	},
	'notes.relationships.delete': {
		riskLevel: 'write',
		description: 'Remove a note relationship.',
	},
	'entities.list': {
		riskLevel: 'read',
		description: 'List entities across configured workspace resource types.',
	},
	'entities.search': {
		riskLevel: 'read',
		description: 'Search entities using structured filters.',
	},
	'entities.create': {
		riskLevel: 'write',
		description: 'Create a workspace-configured Productboard entity.',
	},
	'entities.get': { riskLevel: 'read', description: 'Get an entity by UUID.' },
	'entities.update': {
		riskLevel: 'write',
		description: 'Update entity fields or patch operations.',
	},
	'entities.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete an entity.',
	},
	'entities.configurations.list': {
		riskLevel: 'read',
		description: 'List workspace-specific entity configurations.',
	},
	'entities.configurations.get': {
		riskLevel: 'read',
		description: 'Get configuration for an entity type.',
	},
	'entities.relationships.list': {
		riskLevel: 'read',
		description: 'List an entity’s parent, child, and linked relationships.',
	},
	'entities.relationships.create': {
		riskLevel: 'write',
		description: 'Create a relationship between two entities.',
	},
	'entities.relationships.setParent': {
		riskLevel: 'write',
		description: 'Replace an entity’s parent relationship.',
	},
	'entities.relationships.delete': {
		riskLevel: 'write',
		description: 'Delete an entity relationship.',
	},
	'entities.fieldValues.list': {
		riskLevel: 'read',
		description: 'List paginated select, tag, or status field values.',
	},
	'entities.fieldValues.create': {
		riskLevel: 'write',
		description: 'Create a value for a select-type or tag field (not STATUS).',
	},
	'entities.fieldValues.update': {
		riskLevel: 'write',
		description: 'Update a select-type or tag value (not STATUS).',
	},
	'entities.fieldValues.delete': {
		riskLevel: 'destructive',
		description: 'Delete a select-type or tag value (not STATUS).',
	},
	'entities.customerScore': {
		riskLevel: 'read',
		description: 'Read the documented beta aggregated customer score.',
	},
	'analytics.memberActivities': {
		riskLevel: 'read',
		description:
			'List member activities with date filters and cursor pagination.',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List workspace members; PII may be redacted by Productboard.',
	},
	'members.search': {
		riskLevel: 'read',
		description: 'Search or batch-lookup workspace members.',
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Get one workspace member.',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams with cursor pagination and filters.',
	},
	'teams.search': {
		riskLevel: 'read',
		description: 'Search or batch-lookup teams.',
	},
	'teams.create': { riskLevel: 'write', description: 'Create a team.' },
	'teams.get': { riskLevel: 'read', description: 'Get one team.' },
	'teams.update': {
		riskLevel: 'write',
		description: 'Update team fields or member assignments.',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a team and its memberships.',
	},
	'teams.members': {
		riskLevel: 'read',
		description: 'List a team’s members with cursor pagination.',
	},
	'jiraIntegrations.list': {
		riskLevel: 'read',
		description: 'List Jira integrations with cursor pagination.',
	},
	'jiraIntegrations.get': {
		riskLevel: 'read',
		description: 'Get one Jira integration.',
	},
	'jiraIntegrations.connections': {
		riskLevel: 'read',
		description: 'List feature-to-Jira issue connections.',
	},
	'jiraIntegrations.connection': {
		riskLevel: 'read',
		description: 'Get one feature-to-Jira issue connection.',
	},
	'pluginIntegrations.list': {
		riskLevel: 'read',
		description: 'List configured plugin integrations with cursor pagination.',
	},
	'pluginIntegrations.create': {
		riskLevel: 'write',
		description:
			'Create an integration; Productboard probes its configured action URL.',
	},
	'pluginIntegrations.get': {
		riskLevel: 'read',
		description:
			'Get an integration; its action authorization secret is write-only.',
	},
	'pluginIntegrations.update': {
		riskLevel: 'write',
		description:
			'Update integration fields; changing an enabled action URL triggers a probe.',
	},
	'pluginIntegrations.delete': {
		riskLevel: 'destructive',
		description: 'Delete an integration and all associated connections.',
	},
	'pluginIntegrations.connections.list': {
		riskLevel: 'read',
		description: 'List non-initial connections with cursor pagination.',
	},
	'pluginIntegrations.connections.search': {
		riskLevel: 'read',
		description: 'Search connections by documented state or entity-ID filters.',
	},
	'pluginIntegrations.connections.get': {
		riskLevel: 'read',
		description: 'Get one connection; missing links return the initial state.',
	},
	'pluginIntegrations.connections.update': {
		riskLevel: 'write',
		description: 'Create or replace a connection state via upsert.',
	},
	'pluginIntegrations.connections.delete': {
		riskLevel: 'write',
		description: 'Reset a connection to its initial state.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof productboardEndpointsNested
>;

export const productboardAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

const defaultAuthType = 'api_key' as const;

export type BaseProductboardPlugin<T extends ProductboardPluginOptions> =
	CorsairPlugin<
		'productboard',
		typeof ProductboardSchema,
		typeof productboardEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof productboardAuthConfig
	>;

export type InternalProductboardPlugin =
	BaseProductboardPlugin<ProductboardPluginOptions>;
export type ExternalProductboardPlugin<T extends ProductboardPluginOptions> =
	BaseProductboardPlugin<T>;

export function productboard<const T extends ProductboardPluginOptions>(
	incomingOptions: ProductboardPluginOptions &
		T = {} as ProductboardPluginOptions & T,
): ExternalProductboardPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'productboard',
		authConfig: productboardAuthConfig,
		schema: ProductboardSchema,
		options,
		hooks: options.hooks,
		endpoints: productboardEndpointsNested,
		webhooks: {},
		endpointMeta: productboardEndpointMeta,
		endpointSchemas: productboardEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ProductboardKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (ctx.authType === 'api_key') {
				if (!ctx.keys) throw new AuthMissingError('productboard', 'api_key');
				const key = await ctx.keys.get_api_key();
				if (!key) throw new AuthMissingError('productboard', 'api_key');
				return key;
			}
			throw new AuthMissingError('productboard', 'api_key');
		},
	} satisfies InternalProductboardPlugin;
}

export type { ProductboardOperationInput, ProductboardOutput };
