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
import { Inspections, Templates, Actions, Users } from './endpoints';
import type {
	SafetyCultureEndpointInputs,
	SafetyCultureEndpointOutputs,
} from './endpoints/types';
import {
	SafetyCultureEndpointInputSchemas,
	SafetyCultureEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SafetyCultureSchema } from './schema';
import { matchSafetyCultureTenantWebhook } from './webhooks/tenant-matcher';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type SafetyCulturePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSafetyCulturePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof safetycultureEndpointsNested>;
};

export type SafetyCultureContext = CorsairPluginContext<
	typeof SafetyCultureSchema,
	SafetyCulturePluginOptions
>;

export type SafetyCultureKeyBuilderContext =
	KeyBuilderContext<SafetyCulturePluginOptions>;

export type SafetyCultureBoundEndpoints = BindEndpoints<
	typeof safetycultureEndpointsNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Types
// ─────────────────────────────────────────────────────────────────────────────

type SafetyCultureEndpoint<
	K extends keyof SafetyCultureEndpointOutputs,
	Input,
> = CorsairEndpoint<SafetyCultureContext, Input, SafetyCultureEndpointOutputs[K]>;

export type SafetyCultureEndpoints = {
	inspectionsList: SafetyCultureEndpoint<
		'inspectionsList',
		SafetyCultureEndpointInputs['inspectionsList']
	>;
	inspectionsGet: SafetyCultureEndpoint<
		'inspectionsGet',
		SafetyCultureEndpointInputs['inspectionsGet']
	>;
	templatesList: SafetyCultureEndpoint<
		'templatesList',
		SafetyCultureEndpointInputs['templatesList']
	>;
	actionsList: SafetyCultureEndpoint<
		'actionsList',
		SafetyCultureEndpointInputs['actionsList']
	>;
	usersList: SafetyCultureEndpoint<
		'usersList',
		SafetyCultureEndpointInputs['usersList']
	>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Nested Endpoint Map
// ─────────────────────────────────────────────────────────────────────────────

const safetycultureEndpointsNested = {
	inspections: {
		list: Inspections.list,
		get: Inspections.get,
	},
	templates: {
		list: Templates.list,
	},
	actions: {
		list: Actions.list,
	},
	users: {
		list: Users.list,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const safetycultureEndpointSchemas = {
	'inspections.list': {
		input: SafetyCultureEndpointInputSchemas.inspectionsList,
		output: SafetyCultureEndpointOutputSchemas.inspectionsList,
	},
	'inspections.get': {
		input: SafetyCultureEndpointInputSchemas.inspectionsGet,
		output: SafetyCultureEndpointOutputSchemas.inspectionsGet,
	},
	'templates.list': {
		input: SafetyCultureEndpointInputSchemas.templatesList,
		output: SafetyCultureEndpointOutputSchemas.templatesList,
	},
	'actions.list': {
		input: SafetyCultureEndpointInputSchemas.actionsList,
		output: SafetyCultureEndpointOutputSchemas.actionsList,
	},
	'users.list': {
		input: SafetyCultureEndpointInputSchemas.usersList,
		output: SafetyCultureEndpointOutputSchemas.usersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof safetycultureEndpointsNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth + Meta
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

const safetycultureEndpointMeta = {
	'inspections.list': {
		riskLevel: 'read',
		description: 'List / search inspections (audits)',
	},
	'inspections.get': {
		riskLevel: 'read',
		description: 'Get a single inspection by audit ID',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List inspection templates',
	},
	'actions.list': {
		riskLevel: 'read',
		description: 'List actions / issues',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List organisation users',
	},
} satisfies RequiredPluginEndpointMeta<typeof safetycultureEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Definition
// ─────────────────────────────────────────────────────────────────────────────

export type BaseSafetyCulturePlugin<T extends SafetyCulturePluginOptions> =
	CorsairPlugin<
		'safetyculture',
		typeof SafetyCultureSchema,
		typeof safetycultureEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalSafetyCulturePlugin =
	BaseSafetyCulturePlugin<SafetyCulturePluginOptions>;

export type ExternalSafetyCulturePlugin<
	T extends SafetyCulturePluginOptions,
> = BaseSafetyCulturePlugin<T>;

export function safetyculture<const T extends SafetyCulturePluginOptions>(
	incomingOptions: SafetyCulturePluginOptions & T = {} as SafetyCulturePluginOptions & T,
): ExternalSafetyCulturePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'safetyculture',
		schema: SafetyCultureSchema,
		options: options,
		hooks: options.hooks,
		endpoints: safetycultureEndpointsNested,
		webhooks: {},
		endpointMeta: safetycultureEndpointMeta,
		endpointSchemas: safetycultureEndpointSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchSafetyCultureTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SafetyCultureKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			throw new AuthMissingError('safetyculture', 'api_key');
		},
	} satisfies InternalSafetyCulturePlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	SafetyCultureEndpointInputs,
	SafetyCultureEndpointOutputs,
	InspectionsListInput,
	InspectionsListResponse,
	InspectionGetInput,
	InspectionGetResponse,
	TemplatesListInput,
	TemplatesListResponse,
	ActionsListInput,
	ActionsListResponse,
	UsersListInput,
	UsersListResponse,
} from './endpoints/types';
