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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import type { z } from 'zod';
import { endpoints } from './endpoints';
import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ServiceM8Schema } from './schema';

export type ServiceM8PluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalServiceM8Plugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type ServiceM8Context = CorsairPluginContext<
	typeof ServiceM8Schema,
	ServiceM8PluginOptions
>;
export type ServiceM8KeyBuilderContext =
	KeyBuilderContext<ServiceM8PluginOptions>;
export type ServiceM8BoundEndpoints = BindEndpoints<typeof endpoints>;

const schema = <K extends keyof typeof EndpointInputSchemas>(key: K) => ({
	input: EndpointInputSchemas[key],
	output: EndpointOutputSchemas[key],
});
export const serviceM8EndpointSchemas = {
	'jobs.list': schema('jobs.list'),
	'jobs.retrieve': schema('jobs.retrieve'),
	'jobs.create': schema('jobs.create'),
	'clients.list': schema('clients.list'),
	'clients.retrieve': schema('clients.retrieve'),
	'assets.list': schema('assets.list'),
	'documentTemplates.list': schema('documentTemplates.list'),
	'forms.list': schema('forms.list'),
	'forms.retrieve': schema('forms.retrieve'),
	'notes.list': schema('notes.list'),
	'notes.retrieve': schema('notes.retrieve'),
	'notes.create': schema('notes.create'),
	'notes.update': schema('notes.update'),
	'notes.delete': schema('notes.delete'),
	'queues.list': schema('queues.list'),
	'queues.retrieve': schema('queues.retrieve'),
	'locations.list': schema('locations.list'),
	'locations.retrieve': schema('locations.retrieve'),
	'materials.list': schema('materials.list'),
	'materials.retrieve': schema('materials.retrieve'),
	'tasks.list': schema('tasks.list'),
	'jobActivities.retrieve': schema('jobActivities.retrieve'),
	'jobPayments.retrieve': schema('jobPayments.retrieve'),
	'jobPayments.create': schema('jobPayments.create'),
	'jobPayments.update': schema('jobPayments.update'),
	'jobPayments.delete': schema('jobPayments.delete'),
	'staff.retrieve': schema('staff.retrieve'),
	'customFields.delete': schema('customFields.delete'),
} satisfies RequiredPluginEndpointSchemas<typeof endpoints>;

export type ServiceM8EndpointInputs = {
	[K in keyof typeof serviceM8EndpointSchemas]: z.input<
		(typeof serviceM8EndpointSchemas)[K]['input']
	>;
};
export type ServiceM8EndpointOutputs = {
	[K in keyof typeof serviceM8EndpointSchemas]: z.output<
		(typeof serviceM8EndpointSchemas)[K]['output']
	>;
};

const serviceM8EndpointMeta = {
	'jobs.list': { riskLevel: 'read', description: 'List jobs' },
	'jobs.retrieve': { riskLevel: 'read', description: 'Retrieve a job' },
	'jobs.create': { riskLevel: 'write', description: 'Create a job' },
	'clients.list': { riskLevel: 'read', description: 'List clients' },
	'clients.retrieve': { riskLevel: 'read', description: 'Retrieve a client' },
	'assets.list': { riskLevel: 'read', description: 'List assets' },
	'documentTemplates.list': {
		riskLevel: 'read',
		description: 'List document templates',
	},
	'forms.list': { riskLevel: 'read', description: 'List forms' },
	'forms.retrieve': { riskLevel: 'read', description: 'Retrieve a form' },
	'notes.list': { riskLevel: 'read', description: 'List job notes' },
	'notes.retrieve': { riskLevel: 'read', description: 'Retrieve a job note' },
	'notes.create': { riskLevel: 'write', description: 'Create a job note' },
	'notes.update': { riskLevel: 'write', description: 'Update a job note' },
	'notes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a job note',
	},
	'queues.list': { riskLevel: 'read', description: 'List job queues' },
	'queues.retrieve': { riskLevel: 'read', description: 'Retrieve a job queue' },
	'locations.list': { riskLevel: 'read', description: 'List locations' },
	'locations.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a location',
	},
	'materials.list': { riskLevel: 'read', description: 'List materials' },
	'materials.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a material',
	},
	'tasks.list': { riskLevel: 'read', description: 'List tasks' },
	'jobActivities.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a job activity',
	},
	'jobPayments.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a job payment',
	},
	'jobPayments.create': {
		riskLevel: 'write',
		description: 'Create a job payment',
	},
	'jobPayments.update': {
		riskLevel: 'write',
		description: 'Update a job payment',
	},
	'jobPayments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a job payment',
	},
	'staff.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a staff member',
	},
	'customFields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;

export const serviceM8AuthConfig = {
	api_key: { account: [] as const },
	oauth_2: { account: [] as const },
} as const satisfies PluginAuthConfig;
const defaultAuthType = 'api_key' as const;
export type BaseServiceM8Plugin<T extends ServiceM8PluginOptions> =
	CorsairPlugin<
		'servicem8',
		typeof ServiceM8Schema,
		typeof endpoints,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
export type InternalServiceM8Plugin =
	BaseServiceM8Plugin<ServiceM8PluginOptions>;
export type ExternalServiceM8Plugin<T extends ServiceM8PluginOptions> =
	BaseServiceM8Plugin<T>;

export function servicem8(): ExternalServiceM8Plugin<{}>;
export function servicem8<const T extends ServiceM8PluginOptions>(
	options: ServiceM8PluginOptions & T,
): ExternalServiceM8Plugin<T>;
export function servicem8(
	incomingOptions: ServiceM8PluginOptions = {},
): InternalServiceM8Plugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'servicem8',
		authConfig: serviceM8AuthConfig,
		schema: ServiceM8Schema,
		options,
		oauthConfig: {
			providerName: 'ServiceM8',
			authUrl: 'https://go.servicem8.com/oauth/authorize',
			tokenUrl: 'https://go.servicem8.com/oauth/access_token',
			requiresRegisteredRedirect: true,
			// Forms and payments require additional scopes; do not request them
			// for every authorization by default.
			scopes: [
				'read_jobs',
				'create_jobs',
				'read_customers',
				'read_assets',
				'read_templates',
				'read_job_notes',
				'publish_job_notes',
				'read_job_queues',
				'read_locations',
				'read_inventory',
				'read_tasks',
				'read_schedule',
				'read_staff',
			],
		},
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta: serviceM8EndpointMeta,
		endpointSchemas: serviceM8EndpointSchemas,
		errorHandlers: {
			RATE_LIMIT_ERROR: errorHandlers.RATE_LIMIT_ERROR,
			...options.errorHandlers,
			DEFAULT: options.errorHandlers?.DEFAULT ?? errorHandlers.DEFAULT,
		},
		keyBuilder: async (ctx: ServiceM8KeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key?.trim()) return options.key;
			if (!ctx.keys) throw new AuthMissingError('servicem8', options.authType);
			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'servicem8',
					tokenUrl: 'https://go.servicem8.com/oauth/access_token',
				});
			}
			const key = await ctx.keys.get_api_key();
			if (key?.trim()) return key;
			throw new AuthMissingError('servicem8', ctx.authType);
		},
	} satisfies InternalServiceM8Plugin;
}
export { ServiceM8Error } from './client';
export * from './endpoints/types';
