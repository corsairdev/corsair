import type {
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
import { cancel, get, submit } from './endpoints';
import type {
	SnowflakeEndpointInputs,
	SnowflakeEndpointOutputs,
} from './endpoints/types';
import {
	SnowflakeEndpointInputSchemas,
	SnowflakeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SnowflakeSchema } from './schema';

export type SnowflakePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Account identifier or `https://<account>.snowflakecomputing.com` host.
	 * Every account has its own API host, so this cannot be derived from the token.
	 */
	account?: string;
	/**
	 * Optional `X-Snowflake-Authorization-Token-Type`. Omit it for key-pair,
	 * OAuth, and programmatic access tokens; Snowflake inspects the token.
	 * Workload identity federation requires `WORKLOAD_IDENTITY_FEDERATION`.
	 */
	tokenType?: string;
	hooks?: InternalSnowflakePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof snowflakeEndpointsNested>;
};

// const assertion: extra credential names must stay literal so the key manager
// generates get_account and get_tokenType.
export const snowflakeAuthConfig = {
	api_key: {
		account: ['account', 'tokenType'],
	},
} as const satisfies PluginAuthConfig;

export type SnowflakeContext = CorsairPluginContext<
	typeof SnowflakeSchema,
	SnowflakePluginOptions,
	undefined,
	typeof snowflakeAuthConfig
>;

export type SnowflakeKeyBuilderContext = KeyBuilderContext<
	SnowflakePluginOptions,
	typeof snowflakeAuthConfig
>;

export type SnowflakeBoundEndpoints = BindEndpoints<
	typeof snowflakeEndpointsNested
>;

type SnowflakeEndpoint<K extends keyof SnowflakeEndpointOutputs> =
	CorsairEndpoint<
		SnowflakeContext,
		SnowflakeEndpointInputs[K],
		SnowflakeEndpointOutputs[K]
	>;

export type SnowflakeEndpoints = {
	statementsSubmit: SnowflakeEndpoint<'statementsSubmit'>;
	statementsGet: SnowflakeEndpoint<'statementsGet'>;
	statementsCancel: SnowflakeEndpoint<'statementsCancel'>;
};

// const assertion: BindEndpoints needs the literal method names.
const snowflakeEndpointsNested = {
	statements: {
		submit,
		get,
		cancel,
	},
} as const;

// const assertion: the schema map must keep literal operation keys.
export const snowflakeEndpointSchemas = {
	'statements.submit': {
		input: SnowflakeEndpointInputSchemas.statementsSubmit,
		output: SnowflakeEndpointOutputSchemas.statementsSubmit,
	},
	'statements.get': {
		input: SnowflakeEndpointInputSchemas.statementsGet,
		output: SnowflakeEndpointOutputSchemas.statementsGet,
	},
	'statements.cancel': {
		input: SnowflakeEndpointInputSchemas.statementsCancel,
		output: SnowflakeEndpointOutputSchemas.statementsCancel,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof snowflakeEndpointsNested
>;

// const assertion: the plugin generic records the default auth literal.
const defaultAuthType = 'api_key' as const;

// const assertion: riskLevel must stay the literal union, not string.
const snowflakeEndpointMeta = {
	// Any SQL goes through here, DROP and DELETE included, and a statement's
	// effect can't be read from its text reliably, so every call asks first
	// (same as clickhouse query.execute).
	'statements.submit': {
		riskLevel: 'destructive',
		description:
			'Submit SQL for execution. Returns rows, a handle while the statement is still running, or DML stats.',
	},
	'statements.get': {
		riskLevel: 'read',
		description:
			'Fetch the status of a statement and one partition of its result.',
	},
	'statements.cancel': {
		riskLevel: 'write',
		description: 'Cancel a running SQL statement.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof snowflakeEndpointsNested
>;

export type BaseSnowflakePlugin<T extends SnowflakePluginOptions> =
	CorsairPlugin<
		'snowflake',
		typeof SnowflakeSchema,
		typeof snowflakeEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof snowflakeAuthConfig
	>;

export type InternalSnowflakePlugin =
	BaseSnowflakePlugin<SnowflakePluginOptions>;

export type ExternalSnowflakePlugin<T extends SnowflakePluginOptions> =
	BaseSnowflakePlugin<T>;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}

export function snowflake<const T extends SnowflakePluginOptions>(
	// The empty default is not a T; this only fills the const type parameter
	// when the caller passes no options.
	incomingOptions: SnowflakePluginOptions & T = {} as SnowflakePluginOptions &
		T,
): ExternalSnowflakePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'snowflake',
		schema: SnowflakeSchema,
		authConfig: snowflakeAuthConfig,
		options: options,
		hooks: options.hooks,
		endpoints: snowflakeEndpointsNested,
		webhooks: {},
		endpointMeta: snowflakeEndpointMeta,
		endpointSchemas: snowflakeEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SnowflakeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('snowflake', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSnowflakePlugin;
}

export { accountBaseUrl, SnowflakeAPIError } from './client';
export type {
	CancelStatementInput,
	CancelStatus,
	GetStatementInput,
	SnowflakeEndpointInputs,
	SnowflakeEndpointOutputs,
	StatementResult,
	SubmitStatementInput,
} from './endpoints/types';
