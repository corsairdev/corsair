import type {
	AuthTypes,
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
import type { z } from 'zod';
import {
	missiveEndpointMeta,
	missiveEndpointSchemas,
	missiveEndpoints,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { MissiveSchema } from './schema';

export const missiveAuthConfig = {
	api_key: {
		// Missive tokens are personal (created under Preferences > API), so the
		// token itself is the whole account-level credential.
		account: [],
	},
} as const satisfies PluginAuthConfig;

export type MissivePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Missive personal API token (`missive_pat-…`). Overrides the stored key. */
	key?: string;
	hooks?: InternalMissivePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof missiveEndpoints>;
};

export type MissiveContext = CorsairPluginContext<
	typeof MissiveSchema,
	MissivePluginOptions,
	undefined,
	typeof missiveAuthConfig
>;

export type MissiveKeyBuilderContext = KeyBuilderContext<
	MissivePluginOptions,
	typeof missiveAuthConfig
>;

export type MissiveBoundEndpoints = BindEndpoints<typeof missiveEndpoints>;

export type MissiveEndpoints = typeof missiveEndpoints;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseMissivePlugin<T extends MissivePluginOptions> = CorsairPlugin<
	'missive',
	typeof MissiveSchema,
	typeof missiveEndpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof missiveAuthConfig
>;

export type InternalMissivePlugin = BaseMissivePlugin<MissivePluginOptions>;

export type ExternalMissivePlugin<T extends MissivePluginOptions> =
	BaseMissivePlugin<T>;

// Exhaustiveness gates: adding an endpoint without metadata or schemas — or a
// catalog entry without a tree path — fails to compile.
const endpointMeta = missiveEndpointMeta satisfies RequiredPluginEndpointMeta<
	typeof missiveEndpoints
>;

const endpointSchemas =
	missiveEndpointSchemas satisfies RequiredPluginEndpointSchemas<
		typeof missiveEndpoints
	>;

// unknown: endpoint trees mix nested groups and handlers; narrowed below.
type MissiveEndpointTree = Record<string, unknown>;
// unknown: wrappers receive core context/input before Zod parsing.
type MissiveEndpointHandler = (
	ctx: unknown,
	input: unknown,
	// unknown: handler output before the wrapper's output-schema parse.
) => Promise<unknown>;

/**
 * Binds every Missive endpoint to its declared input and output schemas.
 * `endpointSchemas` is also exposed for introspection, but the shared Corsair
 * binder does not execute those metadata schemas. Validating here keeps
 * malformed requests off the wire and rejects incompatible responses at the
 * boundary.
 */
function withMissiveSchemas<T extends MissiveEndpointTree>(
	tree: T,
	prefix = '',
): T {
	// Widened view for lookups by a dotted path built at runtime.
	const schemas: Record<
		string,
		{ input: z.ZodType; output: z.ZodType } | undefined
	> = endpointSchemas;
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema = schemas[operation];
			if (!schema) {
				throw new Error(`Missing Missive endpoint schema for ${operation}`);
			}
			// Safe: every leaf of missiveEndpoints is a (ctx, input) =>
			// Promise handler, and its input is re-parsed by its own schema.
			const endpoint = value as MissiveEndpointHandler;
			const validated: MissiveEndpointHandler = async (ctx, input) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			// Safe: non-function values in the tree are nested groups.
			return [key, withMissiveSchemas(value as MissiveEndpointTree, operation)];
		}
		return [key, value];
	});
	// Safe: the result has the same keys as `tree`, each handler wrapped with
	// the same signature, so it keeps the input tree's type.
	return Object.fromEntries(validatedEntries) as T;
}

const validatedMissiveEndpointsNested = withMissiveSchemas(missiveEndpoints);

export function missive<const T extends MissivePluginOptions>(
	incomingOptions: MissivePluginOptions & T = {} as MissivePluginOptions & T,
): ExternalMissivePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'missive',
		authConfig: missiveAuthConfig,
		schema: MissiveSchema,
		options,
		hooks: options.hooks,
		// Every public endpoint is the schema-bound tree; endpointSchemas stays
		// as introspection metadata.
		endpoints: validatedMissiveEndpointsNested,
		webhooks: {},
		endpointMeta,
		endpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MissiveKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('missive', 'api_key');
			}

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (apiKey) {
					return apiKey;
				}
			}

			throw new AuthMissingError('missive', 'api_key');
		},
	} satisfies InternalMissivePlugin;
}

export { missiveEndpointMeta, missiveEndpointSchemas };
// Export the schema-bound tree, never the raw handlers: direct consumers of
// this export get the same input/output validation the plugin binds.
export { validatedMissiveEndpointsNested as missiveEndpoints };
export type {
	MissiveEndpointInputs,
	MissiveEndpointOutputs,
} from './endpoints/types';
