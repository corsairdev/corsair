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
import type { z } from 'zod';
import type {
	ETerminEndpointInputs,
	ETerminEndpointOutputs,
} from './endpoints';
import {
	eTerminEndpointMeta,
	eTerminEndpointSchemas,
	eTerminEndpoints,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { ETerminSchema } from './schema';

export const ETerminAuthConfig = {
	api_key: { account: ['api_secret'] as const },
} as const satisfies PluginAuthConfig;

export type ETerminPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** eTermin public API key. Overrides the account API key. */
	publicKey?: string;
	/** eTermin private API key. Overrides the account API secret. */
	privateKey?: string;
	hooks?: InternalETerminPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof eTerminEndpoints>;
};

export type ETerminContext = CorsairPluginContext<
	typeof ETerminSchema,
	ETerminPluginOptions,
	undefined,
	typeof ETerminAuthConfig
>;
export type ETerminKeyBuilderContext = KeyBuilderContext<
	ETerminPluginOptions,
	typeof ETerminAuthConfig
>;
export type ETerminBoundEndpoints = BindEndpoints<typeof eTerminEndpoints>;

type ETerminEndpoint<K extends keyof ETerminEndpointOutputs> = (
	ctx: ETerminContext,
	input: ETerminEndpointInputs[K],
) => Promise<ETerminEndpointOutputs[K]>;
export type ETerminEndpoints = {
	[K in keyof ETerminEndpointOutputs]: ETerminEndpoint<K>;
};

const endpointMeta = eTerminEndpointMeta satisfies RequiredPluginEndpointMeta<
	typeof eTerminEndpoints
>;
const endpointSchemas =
	eTerminEndpointSchemas satisfies RequiredPluginEndpointSchemas<
		typeof eTerminEndpoints
	>;

/**
 * Endpoints have distinct generated input/output types. This erased boundary
 * type is used only while iterating the heterogeneous endpoint tree; schemas
 * validate both unknown values before transport and before returning them.
 */
type ETerminEndpointHandler = CorsairEndpoint<ETerminContext, unknown, unknown>;
type ETerminSchemaEntry = { input?: z.ZodType; output?: z.ZodType };

/**
 * The core schema registry supports introspection only. This wrapper makes
 * each public operation parse its input before transport and output before it
 * reaches the caller.
 */
function withETerminSchemas(
	tree: typeof eTerminEndpoints,
): typeof eTerminEndpoints {
	const schemas: Record<string, ETerminSchemaEntry> = endpointSchemas;
	const wrapGroup = (
		group: string,
		endpoints: Record<string, ETerminEndpointHandler>,
	): Record<string, ETerminEndpointHandler> =>
		Object.fromEntries(
			Object.entries(endpoints).map(([action, endpoint]) => {
				const schema = schemas[`${group}.${action}`];
				if (!schema?.input || !schema.output) {
					throw new Error(
						`Missing eTermin endpoint schema for ${group}.${action}`,
					);
				}
				const inputSchema = schema.input;
				const outputSchema = schema.output;
				return [
					action,
					async (ctx: ETerminContext, input: unknown) => {
						// Endpoint input is unknown at this heterogeneous registry boundary.
						// The operation-specific schema parses it before it reaches transport.
						const parsedInput = inputSchema.parse(input ?? {});
						const result = await endpoint(ctx, parsedInput);
						return outputSchema.parse(result);
					},
				];
			}),
		);

	return Object.fromEntries(
		Object.entries(tree).map(([group, endpoints]) => [
			group,
			wrapGroup(group, endpoints),
		]),
	) as typeof eTerminEndpoints;
}
const validatedETerminEndpoints = withETerminSchemas(eTerminEndpoints);
const defaultAuthType: AuthTypes = 'api_key';

export type BaseETerminPlugin<T extends ETerminPluginOptions> = CorsairPlugin<
	'etermin',
	typeof ETerminSchema,
	typeof eTerminEndpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof ETerminAuthConfig
>;
export type InternalETerminPlugin = BaseETerminPlugin<ETerminPluginOptions>;
export type ExternalETerminPlugin<T extends ETerminPluginOptions> =
	BaseETerminPlugin<T>;

export function etermin<const T extends ETerminPluginOptions>(
	incomingOptions: ETerminPluginOptions & T = {} as ETerminPluginOptions & T,
): ExternalETerminPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'etermin',
		authConfig: ETerminAuthConfig,
		schema: ETerminSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: validatedETerminEndpoints,
		webhooks: {},
		endpointMeta,
		endpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: ETerminKeyBuilderContext, source) => {
			if (source !== 'endpoint')
				throw new AuthMissingError('etermin', 'api_key');
			if (options.publicKey) return options.publicKey;
			const publicKey = await ctx.keys.get_api_key();
			if (!publicKey) throw new AuthMissingError('etermin', 'api_key');
			return publicKey;
		},
	} satisfies InternalETerminPlugin;
}

export {
	eTerminEndpointMeta,
	eTerminEndpointSchemas,
	validatedETerminEndpoints as eTerminEndpoints,
};
export type {
	ETerminEndpointInputs,
	ETerminEndpointOutputs,
} from './endpoints';
