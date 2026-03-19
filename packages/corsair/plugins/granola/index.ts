import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from '../../core';
import type { PickAuth } from '../../core/constants';
import type { GranolaEndpointInputs, GranolaEndpointOutputs } from './endpoints/types';
import { GranolaEndpointInputSchemas, GranolaEndpointOutputSchemas } from './endpoints/types';
import { Notes } from './endpoints';
import { GranolaSchema } from './schema';
import { errorHandlers } from './error-handlers';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint types
// ─────────────────────────────────────────────────────────────────────────────

type GranolaEndpoint<K extends keyof GranolaEndpointOutputs> = CorsairEndpoint<
	GranolaContext,
	GranolaEndpointInputs[K],
	GranolaEndpointOutputs[K]
>;

export type GranolaEndpoints = {
	notesGet: GranolaEndpoint<'notesGet'>;
	notesList: GranolaEndpoint<'notesList'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Plugin options
// ─────────────────────────────────────────────────────────────────────────────

export type GranolaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGranolaPlugin['hooks'];
	webhookHooks?: InternalGranolaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Granola plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Granola endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof granolaEndpointsNested>;
};

export type GranolaContext = CorsairPluginContext<typeof GranolaSchema, GranolaPluginOptions>;

export type GranolaKeyBuilderContext = KeyBuilderContext<GranolaPluginOptions>;

export type GranolaBoundEndpoints = BindEndpoints<typeof granolaEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint tree
// ─────────────────────────────────────────────────────────────────────────────

const granolaEndpointsNested = {
	notes: {
		get: Notes.get,
		list: Notes.list,
	},
} as const;

const granolaWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint schemas
// ─────────────────────────────────────────────────────────────────────────────

export const granolaEndpointSchemas = {
	'notes.get': {
		input: GranolaEndpointInputSchemas.notesGet,
		output: GranolaEndpointOutputSchemas.notesGet,
	},
	'notes.list': {
		input: GranolaEndpointInputSchemas.notesList,
		output: GranolaEndpointOutputSchemas.notesList,
	},
} satisfies RequiredPluginEndpointSchemas<typeof granolaEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint metadata (risk levels)
// ─────────────────────────────────────────────────────────────────────────────

const granolaEndpointMeta = {
	'notes.get': { riskLevel: 'read', description: 'Get a meeting note by ID' },
	'notes.list': { riskLevel: 'read', description: 'List all meeting notes' },
} satisfies RequiredPluginEndpointMeta<typeof granolaEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth config
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType = 'api_key' as const;

export const granolaAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin type definitions
// ─────────────────────────────────────────────────────────────────────────────

export type BaseGranolaPlugin<T extends GranolaPluginOptions> = CorsairPlugin<
	'granola',
	typeof GranolaSchema,
	typeof granolaEndpointsNested,
	typeof granolaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGranolaPlugin = BaseGranolaPlugin<GranolaPluginOptions>;

export type ExternalGranolaPlugin<T extends GranolaPluginOptions> = BaseGranolaPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin factory
// ─────────────────────────────────────────────────────────────────────────────

export function granola<const T extends GranolaPluginOptions>(
	incomingOptions: GranolaPluginOptions & T = {} as GranolaPluginOptions & T,
): ExternalGranolaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'granola',
		schema: GranolaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: granolaEndpointsNested,
		webhooks: granolaWebhooksNested,
		endpointMeta: granolaEndpointMeta,
		endpointSchemas: granolaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GranolaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) return '';
				return res;
			}

			return '';
		},
	} satisfies InternalGranolaPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint type exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GranolaEndpointInputs,
	GranolaEndpointOutputs,
	NotesGetResponse,
	NotesListResponse,
} from './endpoints/types';
