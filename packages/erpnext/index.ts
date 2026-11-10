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
import type { ErpnextRuntimeSchemas } from './endpoints';
import {
	erpnextEndpointMeta,
	erpnextEndpointSchemas,
	erpnextEndpoints,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { ErpnextSchema } from './schema';

export const erpnextAuthConfig = {
	api_key: {
		// Frappe tokens are an api_key/api_secret pair generated per user
		// under Settings > My Settings > API Access; the secret is the extra
		// account-level credential beside the base api_key field.
		account: ['api_secret'],
	},
} as const satisfies PluginAuthConfig;

export type ErpnextPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The ERPNext site origin for this tenant, for example
	 * `https://yourcompany.frappe.cloud`. Every deployment is its own host,
	 * so no default exists.
	 */
	baseUrl?: string;
	/**
	 * Compact credential: `<api_key>:<api_secret>` as one string, or the
	 * api key when `apiSecret` is set separately.
	 */
	key?: string;
	apiKey?: string;
	apiSecret?: string;
	hooks?: InternalErpnextPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof erpnextEndpoints>;
};

export type ErpnextContext = CorsairPluginContext<
	typeof ErpnextSchema,
	ErpnextPluginOptions,
	undefined,
	typeof erpnextAuthConfig
>;

export type ErpnextKeyBuilderContext = KeyBuilderContext<
	ErpnextPluginOptions,
	typeof erpnextAuthConfig
>;

export type ErpnextBoundEndpoints = BindEndpoints<typeof erpnextEndpoints>;

export type ErpnextEndpoints = typeof erpnextEndpoints;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseErpnextPlugin<T extends ErpnextPluginOptions> = CorsairPlugin<
	'erpnext',
	typeof ErpnextSchema,
	typeof erpnextEndpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof erpnextAuthConfig
>;

export type InternalErpnextPlugin = BaseErpnextPlugin<ErpnextPluginOptions>;

export type ExternalErpnextPlugin<T extends ErpnextPluginOptions> =
	BaseErpnextPlugin<T>;

// Exhaustiveness gates: adding an endpoint without metadata or schemas — or
// a catalog entry without a tree path — fails to compile.
const endpointMeta = erpnextEndpointMeta satisfies RequiredPluginEndpointMeta<
	typeof erpnextEndpoints
>;

const endpointSchemas =
	erpnextEndpointSchemas satisfies RequiredPluginEndpointSchemas<
		typeof erpnextEndpoints
	>;

// unknown: endpoint trees mix nested groups and handlers; narrowed below.
type ErpnextEndpointTree = Record<string, unknown>;
// unknown: wrappers receive core context/input before Zod parsing.
type ErpnextEndpointHandler = (
	ctx: unknown,
	input: unknown,
	// unknown: handler output before the wrapper's output-schema parse.
) => Promise<unknown>;

/**
 * Binds every ERPNext endpoint to its declared input and output schemas.
 * `endpointSchemas` is also exposed for introspection, but the shared
 * Corsair binder does not execute those metadata schemas. Validating here
 * keeps malformed requests off the wire and rejects incompatible responses
 * at the boundary.
 */
function withErpnextSchemas<T extends ErpnextEndpointTree>(
	tree: T,
	prefix = '',
): T {
	// Widened view for lookups by a dotted path built at runtime.
	const schemas: ErpnextRuntimeSchemas = endpointSchemas;
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema = schemas[operation];
			if (!schema) {
				throw new Error(`Missing ERPNext endpoint schema for ${operation}`);
			}
			// Safe: every leaf of erpnextEndpoints is a (ctx, input) =>
			// Promise handler, and its input is re-parsed by its own schema.
			const endpoint = value as ErpnextEndpointHandler;
			const validated: ErpnextEndpointHandler = async (ctx, input) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			// Safe: non-function values in the tree are nested groups.
			return [key, withErpnextSchemas(value as ErpnextEndpointTree, operation)];
		}
		return [key, value];
	});
	// Safe: the result has the same keys as `tree`, each handler wrapped with
	// the same signature, so it keeps the input tree's type.
	return Object.fromEntries(validatedEntries) as T;
}

const validatedErpnextEndpointsNested = withErpnextSchemas(erpnextEndpoints);

async function resolveErpnextCredential(
	options: ErpnextPluginOptions,
	ctx: ErpnextKeyBuilderContext,
): Promise<string> {
	if (options.key && options.key.includes(':')) {
		const [keyPart, secretPart] = options.key.split(':');
		if (keyPart && secretPart) {
			return options.key;
		}
		// A malformed compact credential (an empty half) would put `token :`
		// on the wire; an unusable credential is a missing one.
		throw new AuthMissingError('erpnext', 'api_key');
	}
	const apiKey = options.apiKey ?? options.key;
	if (apiKey && options.apiSecret) {
		return `${apiKey}:${options.apiSecret}`;
	}
	if (ctx.authType === 'api_key') {
		// The stored api_key alone is not a usable Frappe credential without
		// its api_secret; a missing secret is a missing credential.
		const apiKey = await ctx.keys.get_api_key();
		const apiSecret = await ctx.keys.get_api_secret();
		if (apiKey && apiSecret) {
			return `${apiKey}:${apiSecret}`;
		}
	}
	throw new AuthMissingError('erpnext', 'api_key');
}

export function erpnext<const T extends ErpnextPluginOptions>(
	incomingOptions: ErpnextPluginOptions & T = {} as ErpnextPluginOptions & T,
): ExternalErpnextPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'erpnext',
		authConfig: erpnextAuthConfig,
		schema: ErpnextSchema,
		options,
		hooks: options.hooks,
		// Every public endpoint is the schema-bound tree; endpointSchemas stays
		// as introspection metadata.
		endpoints: validatedErpnextEndpointsNested,
		webhooks: {},
		endpointMeta,
		endpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ErpnextKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('erpnext', 'api_key');
			}

			const credential = await resolveErpnextCredential(options, ctx);
			if (!credential) {
				throw new AuthMissingError('erpnext', 'api_key');
			}
			return credential;
		},
	} satisfies InternalErpnextPlugin;
}

// Only the metadata and the schema registry are exported; the raw handler
// tree stays internal so every consumer goes through the schema-bound
// endpoints the factory exposes above.
export { erpnextEndpointMeta, erpnextEndpointSchemas };
export type {
	ErpnextEndpointInputs,
	ErpnextEndpointOutputs,
} from './endpoints/registry';
