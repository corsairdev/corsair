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
	Webhooks,
} from './endpoints';
import {
	ProductboardOperations,
	productboardOperationInputSchema,
	productboardOperationOutputSchema,
} from './endpoints/operations';
import type { ProductboardOutput } from './endpoints/types';
import {
	ProductboardWebhookCreateOutputSchema,
	ProductboardWebhookDeleteOutputSchema,
	ProductboardWebhookGetOutputSchema,
	ProductboardWebhookListOutputSchema,
} from './endpoints/types';
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
	webhooks: Webhooks,
} as const;

export const productboardEndpointSchemas = {
	'notes.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.list'],
		),
	},
	'notes.search': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.search'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.search'],
		),
	},
	'notes.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.create'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.create'],
		),
	},
	'notes.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.get'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.get'],
		),
	},
	'notes.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.update'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.update'],
		),
	},
	'notes.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.delete'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.delete'],
		),
	},
	'notes.configurations.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.configurations.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.configurations.list'],
		),
	},
	'notes.configurations.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.configurations.get'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.configurations.get'],
		),
	},
	'notes.relationships.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.relationships.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.relationships.list'],
		),
	},
	'notes.relationships.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.relationships.create'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.relationships.create'],
		),
	},
	'notes.relationships.setCustomer': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.relationships.setCustomer'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.relationships.setCustomer'],
		),
	},
	'notes.relationships.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['notes.relationships.delete'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['notes.relationships.delete'],
		),
	},
	'entities.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.list'],
		),
	},
	'entities.search': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.search'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.search'],
		),
	},
	'entities.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.create'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.create'],
		),
	},
	'entities.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.get'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.get'],
		),
	},
	'entities.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.update'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.update'],
		),
	},
	'entities.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.delete'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.delete'],
		),
	},
	'entities.configurations.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.configurations.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.configurations.list'],
		),
	},
	'entities.configurations.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.configurations.get'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.configurations.get'],
		),
	},
	'entities.relationships.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.relationships.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.relationships.list'],
		),
	},
	'entities.relationships.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.relationships.create'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.relationships.create'],
		),
	},
	'entities.relationships.setParent': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.relationships.setParent'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.relationships.setParent'],
		),
	},
	'entities.relationships.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.relationships.delete'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.relationships.delete'],
		),
	},
	'entities.fieldValues.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.fieldValues.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.fieldValues.list'],
		),
	},
	'entities.fieldValues.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.fieldValues.create'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.fieldValues.create'],
		),
	},
	'entities.fieldValues.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.fieldValues.update'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.fieldValues.update'],
		),
	},
	'entities.fieldValues.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.fieldValues.delete'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.fieldValues.delete'],
		),
	},
	'entities.customerScore': {
		input: productboardOperationInputSchema(
			ProductboardOperations['entities.customerScore'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['entities.customerScore'],
		),
	},
	'analytics.memberActivities': {
		input: productboardOperationInputSchema(
			ProductboardOperations['analytics.memberActivities'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['analytics.memberActivities'],
		),
	},
	'members.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['members.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['members.list'],
		),
	},
	'members.search': {
		input: productboardOperationInputSchema(
			ProductboardOperations['members.search'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['members.search'],
		),
	},
	'members.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['members.get'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['members.get'],
		),
	},
	'teams.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['teams.list'],
		),
	},
	'teams.search': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.search'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['teams.search'],
		),
	},
	'teams.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.create'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['teams.create'],
		),
	},
	'teams.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.get'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['teams.get'],
		),
	},
	'teams.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.update'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['teams.update'],
		),
	},
	'teams.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.delete'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['teams.delete'],
		),
	},
	'teams.members': {
		input: productboardOperationInputSchema(
			ProductboardOperations['teams.members'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['teams.members'],
		),
	},
	'jiraIntegrations.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['jiraIntegrations.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['jiraIntegrations.list'],
		),
	},
	'jiraIntegrations.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['jiraIntegrations.get'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['jiraIntegrations.get'],
		),
	},
	'jiraIntegrations.connections': {
		input: productboardOperationInputSchema(
			ProductboardOperations['jiraIntegrations.connections'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['jiraIntegrations.connections'],
		),
	},
	'jiraIntegrations.connection': {
		input: productboardOperationInputSchema(
			ProductboardOperations['jiraIntegrations.connection'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['jiraIntegrations.connection'],
		),
	},
	'pluginIntegrations.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['pluginIntegrations.list'],
		),
	},
	'pluginIntegrations.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.create'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['pluginIntegrations.create'],
		),
	},
	'pluginIntegrations.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.get'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['pluginIntegrations.get'],
		),
	},
	'pluginIntegrations.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.update'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['pluginIntegrations.update'],
		),
	},
	'pluginIntegrations.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.delete'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['pluginIntegrations.delete'],
		),
	},
	'pluginIntegrations.connections.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.connections.list'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['pluginIntegrations.connections.list'],
		),
	},
	'pluginIntegrations.connections.search': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.connections.search'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['pluginIntegrations.connections.search'],
		),
	},
	'pluginIntegrations.connections.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.connections.get'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['pluginIntegrations.connections.get'],
		),
	},
	'pluginIntegrations.connections.update': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.connections.update'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['pluginIntegrations.connections.update'],
		),
	},
	'pluginIntegrations.connections.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['pluginIntegrations.connections.delete'],
		),
		output: productboardOperationOutputSchema(
			ProductboardOperations['pluginIntegrations.connections.delete'],
		),
	},
	'webhooks.list': {
		input: productboardOperationInputSchema(
			ProductboardOperations['webhooks.list'],
		),
		output: ProductboardWebhookListOutputSchema,
	},
	'webhooks.create': {
		input: productboardOperationInputSchema(
			ProductboardOperations['webhooks.create'],
		),
		output: ProductboardWebhookCreateOutputSchema,
	},
	'webhooks.get': {
		input: productboardOperationInputSchema(
			ProductboardOperations['webhooks.get'],
		),
		output: ProductboardWebhookGetOutputSchema,
	},
	'webhooks.delete': {
		input: productboardOperationInputSchema(
			ProductboardOperations['webhooks.delete'],
		),
		output: ProductboardWebhookDeleteOutputSchema,
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
		riskLevel: 'destructive',
		description:
			'Create or replace a connection state via upsert; setting it to initial permanently resets the connection.',
	},
	'pluginIntegrations.connections.delete': {
		riskLevel: 'destructive',
		description: 'Reset a connection to its initial state.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List webhook subscriptions with cursor pagination.',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Create a webhook subscription at a public HTTPS notification URL.',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get a webhook subscription by UUID.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a webhook subscription.',
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

export type { ProductboardOperationCallerInput } from './endpoints/operations';
export type { ProductboardOutput };
