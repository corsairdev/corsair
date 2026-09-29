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
import { tryGetStoredKey } from './client';
import { Meta, Things, Workflows } from './endpoints';
import type {
	BubbleEndpointInputs,
	BubbleEndpointOutputs,
} from './endpoints/types';
import {
	BubbleEndpointInputSchemas,
	BubbleEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BubbleSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type BubblePluginOptions = {
	/** Authentication method. Only `api_key` is supported. */
	authType?: PickAuth<'api_key'>;
	/**
	 * Bubble admin API token (Settings → API → Private key in the editor),
	 * sent as `Authorization: Bearer <token>`.
	 */
	key?: string;
	/**
	 * Bubble app name. Resolves the Data/Workflow API base URL
	 * `https://{appName}.bubbleapps.io`; may also be stored as the
	 * account-level `appName` field on each connection instead.
	 */
	appName?: string;
	/**
	 * Overrides the base URL entirely - use for custom-domain deployments or
	 * the development branch (`https://app.bubbleapps.io/version-test`).
	 */
	baseUrl?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalBubblePlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration. Read endpoints (`things.get`, `things.list`)
	 * default to `open`; write endpoints to `allow`; `things.delete` is
	 * `destructive`.
	 */
	permissions?: PluginPermissionsConfig<typeof bubbleEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context & Type Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type BubbleContext = CorsairPluginContext<
	typeof BubbleSchema,
	BubblePluginOptions,
	undefined,
	typeof bubbleAuthConfig
>;

export type BubbleKeyBuilderContext = KeyBuilderContext<
	BubblePluginOptions,
	typeof bubbleAuthConfig
>;

export type BubbleBoundEndpoints = BindEndpoints<typeof bubbleEndpointsNested>;

type BubbleEndpoint<K extends keyof BubbleEndpointOutputs> = CorsairEndpoint<
	BubbleContext,
	BubbleEndpointInputs[K],
	BubbleEndpointOutputs[K]
>;

export type BubbleEndpoints = {
	thingsGet: BubbleEndpoint<'thingsGet'>;
	thingsList: BubbleEndpoint<'thingsList'>;
	thingsCreate: BubbleEndpoint<'thingsCreate'>;
	thingsBulkCreate: BubbleEndpoint<'thingsBulkCreate'>;
	thingsUpdate: BubbleEndpoint<'thingsUpdate'>;
	thingsReplace: BubbleEndpoint<'thingsReplace'>;
	thingsDelete: BubbleEndpoint<'thingsDelete'>;
	workflowsRun: BubbleEndpoint<'workflowsRun'>;
	workflowsRunGet: BubbleEndpoint<'workflowsRunGet'>;
	metaGetSwagger: BubbleEndpoint<'metaGetSwagger'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const bubbleEndpointsNested = {
	things: {
		get: Things.get,
		list: Things.list,
		create: Things.create,
		bulkCreate: Things.bulkCreate,
		update: Things.update,
		replace: Things.replace,
		delete: Things.delete,
	},
	workflows: {
		run: Workflows.run,
		runGet: Workflows.runGet,
	},
	meta: {
		getSwagger: Meta.getSwagger,
	},
} as const;

// No webhooks — Bubble's Data/Workflow API is pull-based (outbound calls
// only). There is no signed inbound event stream to subscribe to.
const bubbleWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas (for get_schema / agent introspection)
// ─────────────────────────────────────────────────────────────────────────────

export const bubbleEndpointSchemas = {
	'things.get': {
		input: BubbleEndpointInputSchemas.thingsGet,
		output: BubbleEndpointOutputSchemas.thingsGet,
	},
	'things.list': {
		input: BubbleEndpointInputSchemas.thingsList,
		output: BubbleEndpointOutputSchemas.thingsList,
	},
	'things.create': {
		input: BubbleEndpointInputSchemas.thingsCreate,
		output: BubbleEndpointOutputSchemas.thingsCreate,
	},
	'things.bulkCreate': {
		input: BubbleEndpointInputSchemas.thingsBulkCreate,
		output: BubbleEndpointOutputSchemas.thingsBulkCreate,
	},
	'things.update': {
		input: BubbleEndpointInputSchemas.thingsUpdate,
		output: BubbleEndpointOutputSchemas.thingsUpdate,
	},
	'things.replace': {
		input: BubbleEndpointInputSchemas.thingsReplace,
		output: BubbleEndpointOutputSchemas.thingsReplace,
	},
	'things.delete': {
		input: BubbleEndpointInputSchemas.thingsDelete,
		output: BubbleEndpointOutputSchemas.thingsDelete,
	},
	'workflows.run': {
		input: BubbleEndpointInputSchemas.workflowsRun,
		output: BubbleEndpointOutputSchemas.workflowsRun,
	},
	'workflows.runGet': {
		input: BubbleEndpointInputSchemas.workflowsRunGet,
		output: BubbleEndpointOutputSchemas.workflowsRunGet,
	},
	'meta.getSwagger': {
		input: BubbleEndpointInputSchemas.metaGetSwagger,
		output: BubbleEndpointOutputSchemas.metaGetSwagger,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bubbleEndpointsNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels for permission system)
// ─────────────────────────────────────────────────────────────────────────────

const bubbleEndpointMeta = {
	'things.get': {
		riskLevel: 'read',
		description: 'Retrieve a single thing by its unique ID',
	},
	'things.list': {
		riskLevel: 'read',
		description:
			'Search and paginate things of a data type, with optional constraints and sorting',
	},
	'things.create': {
		riskLevel: 'write',
		description: 'Create a single thing with the supplied field values',
	},
	'things.bulkCreate': {
		riskLevel: 'write',
		description:
			'Create up to 1,000 things in one request, returning per-record results',
	},
	'things.update': {
		riskLevel: 'write',
		description: 'Change selected fields of an existing thing',
	},
	'things.replace': {
		riskLevel: 'write',
		description:
			'Overwrite all editable fields of an existing thing (omitted fields reset to default)',
	},
	'things.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a thing by its unique ID',
	},
	'workflows.run': {
		riskLevel: 'write',
		description:
			'Run an API workflow with the supplied parameters (Workflow API POST)',
	},
	'workflows.runGet': {
		riskLevel: 'write',
		description:
			'Run an API workflow with query-string parameters (Workflow API GET)',
	},
	'meta.getSwagger': {
		riskLevel: 'read',
		description:
			'Retrieve the auto-generated Swagger 2.0 JSON for enabled Bubble APIs',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bubbleEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

/**
 * `api_key` holds the bearer token; `appName` is the account-level field
 * that resolves the app's API base URL `https://{appName}.bubbleapps.io`.
 */
export const bubbleAuthConfig = {
	api_key: {
		account: ['appName'] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseBubblePlugin<T extends BubblePluginOptions> = CorsairPlugin<
	'bubble',
	typeof BubbleSchema,
	typeof bubbleEndpointsNested,
	typeof bubbleWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof bubbleAuthConfig
>;

export type InternalBubblePlugin = BaseBubblePlugin<BubblePluginOptions>;

export type ExternalBubblePlugin<T extends BubblePluginOptions> =
	BaseBubblePlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function bubble<const T extends BubblePluginOptions>(
	incomingOptions: BubblePluginOptions &
		// Safe: T extends BubblePluginOptions, so an empty object is a valid
		// no-op default when no options are passed. TypeScript requires the cast
		// because it cannot verify T = {}.
		T = {} as BubblePluginOptions & T,
): ExternalBubblePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bubble',
		authConfig: bubbleAuthConfig,
		schema: BubbleSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: bubbleEndpointsNested,
		webhooks: bubbleWebhooksNested,
		endpointMeta: bubbleEndpointMeta,
		endpointSchemas: bubbleEndpointSchemas,
		// No webhooks — Bubble is a pull-based API
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BubbleKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!res) {
					throw new AuthMissingError('bubble', 'api_key');
				}
				return res;
			}

			return '';
		},
	} satisfies InternalBubblePlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	BubbleEndpointInputs,
	BubbleEndpointOutputs,
	ThingsBulkCreateInput,
	ThingsBulkCreateOutput,
	ThingsCreateInput,
	ThingsCreateOutput,
	ThingsDeleteInput,
	ThingsGetInput,
	ThingsListInput,
	ThingsReplaceInput,
	ThingsUpdateInput,
	WorkflowsRunGetInput,
	WorkflowsRunInput,
	WorkflowsRunOutput,
} from './endpoints/types';

export {
	BubbleEndpointInputSchemas,
	BubbleEndpointOutputSchemas,
} from './endpoints/types';
