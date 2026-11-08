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
	nutshellEndpointMeta,
	nutshellEndpointSchemas,
	nutshellEndpoints,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { NutshellSchema } from './schema';

export const nutshellAuthConfig = {
	api_key: {
		// Nutshell authenticates HTTP Basic with the user's email as the
		// username and the API key as the password, so the email is part of the
		// account-level credential rather than the secret.
		account: ['email'] as const,
	},
} as const satisfies PluginAuthConfig;

export type NutshellPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * Compact local override: `<email>:<api-key>`, or just the API key when
	 * `email` is also set.
	 */
	key?: string;
	/** Email of the Nutshell user that owns the API key. */
	email?: string;
	credentials?: {
		email: string;
		apiKey: string;
	};
	hooks?: InternalNutshellPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof nutshellEndpoints>;
};

export type NutshellContext = CorsairPluginContext<
	typeof NutshellSchema,
	NutshellPluginOptions,
	undefined,
	typeof nutshellAuthConfig
>;

export type NutshellKeyBuilderContext = KeyBuilderContext<
	NutshellPluginOptions,
	typeof nutshellAuthConfig
>;

export type NutshellBoundEndpoints = BindEndpoints<typeof nutshellEndpoints>;

export type NutshellEndpoints = typeof nutshellEndpoints;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseNutshellPlugin<T extends NutshellPluginOptions> = CorsairPlugin<
	'nutshell',
	typeof NutshellSchema,
	typeof nutshellEndpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof nutshellAuthConfig
>;

export type InternalNutshellPlugin = BaseNutshellPlugin<NutshellPluginOptions>;

export type ExternalNutshellPlugin<T extends NutshellPluginOptions> =
	BaseNutshellPlugin<T>;

// Exhaustiveness gates: adding an endpoint without metadata or schemas — or a
// catalog entry without a tree path — fails to compile.
const endpointMeta = nutshellEndpointMeta satisfies RequiredPluginEndpointMeta<
	typeof nutshellEndpoints
>;

const endpointSchemas =
	nutshellEndpointSchemas satisfies RequiredPluginEndpointSchemas<
		typeof nutshellEndpoints
	>;

// unknown: endpoint trees mix nested groups and handlers; narrowed below.
type NutshellEndpointTree = Record<string, unknown>;
// unknown: wrappers receive core context/input before Zod parsing.
type NutshellEndpointHandler = (
	ctx: unknown,
	input: unknown,
) => Promise<unknown>;

/**
 * Binds every Nutshell endpoint to its declared input and output schemas.
 * `endpointSchemas` is also exposed for introspection, but the shared Corsair
 * binder does not execute those metadata schemas. Validating here keeps
 * malformed requests off the wire and rejects incompatible responses at the
 * boundary.
 */
function withNutshellSchemas<T extends NutshellEndpointTree>(
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
				throw new Error(`Missing Nutshell endpoint schema for ${operation}`);
			}
			// Safe: every leaf of nutshellEndpoints is a (ctx, input) =>
			// Promise handler, and its input is re-parsed by its own schema.
			const endpoint = value as NutshellEndpointHandler;
			const validated: NutshellEndpointHandler = async (ctx, input) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			// Safe: non-function values in the tree are nested groups.
			return [
				key,
				withNutshellSchemas(value as NutshellEndpointTree, operation),
			];
		}
		return [key, value];
	});
	// Safe: the result has the same keys as `tree`, each handler wrapped with
	// the same signature, so it keeps the input tree's type.
	return Object.fromEntries(validatedEntries) as T;
}

const validatedNutshellEndpointsNested = withNutshellSchemas(nutshellEndpoints);

export function nutshell<const T extends NutshellPluginOptions>(
	incomingOptions: NutshellPluginOptions & T = {} as NutshellPluginOptions & T,
): ExternalNutshellPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'nutshell',
		authConfig: nutshellAuthConfig,
		schema: NutshellSchema,
		options,
		hooks: options.hooks,
		// Every public endpoint is the schema-bound tree; endpointSchemas stays
		// as introspection metadata.
		endpoints: validatedNutshellEndpointsNested,
		webhooks: {},
		endpointMeta,
		endpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NutshellKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('nutshell', 'api_key');
			}

			if (options.credentials) {
				return `${options.credentials.email}:${options.credentials.apiKey}`;
			}
			if (options.key?.includes(':') && !options.email) {
				return options.key;
			}
			if (options.email && options.key) {
				return `${options.email}:${options.key}`;
			}

			if (ctx.authType === 'api_key') {
				const email = await ctx.keys.get_email();
				const apiKey = await ctx.keys.get_api_key();
				if (email && apiKey) {
					return `${email}:${apiKey}`;
				}
			}

			throw new AuthMissingError('nutshell', 'api_key');
		},
	} satisfies InternalNutshellPlugin;
}

export { nutshellEndpointMeta, nutshellEndpointSchemas, nutshellEndpoints };
export type {
	NutshellEndpointInputs,
	NutshellEndpointOutputs,
} from './endpoints/types';
