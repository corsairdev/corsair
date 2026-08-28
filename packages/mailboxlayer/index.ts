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
import { tryGetStoredKey } from './client';
import { Email } from './endpoints';
import type {
	MailboxLayerEndpointInputs,
	MailboxLayerEndpointOutputs,
} from './endpoints/types';
import {
	MailboxLayerEndpointInputSchemas,
	MailboxLayerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MailboxLayerSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type MailboxLayerPluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/** mailboxlayer access_key */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalMailboxLayerPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the mailboxlayer plugin.
	 * The only endpoint is read-only, so the default mode is effectively 'open'.
	 */
	permissions?: PluginPermissionsConfig<typeof mailboxLayerEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context & Type Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type MailboxLayerContext = CorsairPluginContext<
	typeof MailboxLayerSchema,
	MailboxLayerPluginOptions,
	undefined,
	typeof mailboxLayerAuthConfig
>;

export type MailboxLayerKeyBuilderContext = KeyBuilderContext<
	MailboxLayerPluginOptions,
	typeof mailboxLayerAuthConfig
>;

export type MailboxLayerBoundEndpoints = BindEndpoints<
	typeof mailboxLayerEndpointsNested
>;

type MailboxLayerEndpoint<K extends keyof MailboxLayerEndpointOutputs> =
	CorsairEndpoint<
		MailboxLayerContext,
		MailboxLayerEndpointInputs[K],
		MailboxLayerEndpointOutputs[K]
	>;

export type MailboxLayerEndpoints = {
	check: MailboxLayerEndpoint<'check'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const mailboxLayerEndpointsNested = {
	email: {
		check: Email.check,
	},
} as const;

// No webhooks — mailboxlayer is a pull-based API (no event delivery)
const mailboxLayerWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas (for get_schema / agent introspection)
// ─────────────────────────────────────────────────────────────────────────────

export const mailboxLayerEndpointSchemas = {
	'email.check': {
		input: MailboxLayerEndpointInputSchemas.check,
		output: MailboxLayerEndpointOutputSchemas.check,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mailboxLayerEndpointsNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels for permission system)
// ─────────────────────────────────────────────────────────────────────────────

const mailboxLayerEndpointMeta = {
	'email.check': {
		riskLevel: 'read',
		description:
			'Validate whether an email address is correctly formatted, has valid MX records, and is deliverable via SMTP',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof mailboxLayerEndpointsNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export const mailboxLayerAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseMailboxLayerPlugin<T extends MailboxLayerPluginOptions> =
	CorsairPlugin<
		'mailboxlayer',
		typeof MailboxLayerSchema,
		typeof mailboxLayerEndpointsNested,
		typeof mailboxLayerWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof mailboxLayerAuthConfig
	>;

export type InternalMailboxLayerPlugin =
	BaseMailboxLayerPlugin<MailboxLayerPluginOptions>;

export type ExternalMailboxLayerPlugin<T extends MailboxLayerPluginOptions> =
	BaseMailboxLayerPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function mailboxlayer<const T extends MailboxLayerPluginOptions>(
	incomingOptions: MailboxLayerPluginOptions &
		// Safe: T extends MailboxLayerPluginOptions, so an empty object is a valid
		// no-op default when no options are passed. TypeScript requires the cast
		// because it cannot verify T = {}.
		T = {} as MailboxLayerPluginOptions & T,
): ExternalMailboxLayerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mailboxlayer',
		authConfig: mailboxLayerAuthConfig,
		schema: MailboxLayerSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: mailboxLayerEndpointsNested,
		webhooks: mailboxLayerWebhooksNested,
		endpointMeta: mailboxLayerEndpointMeta,
		endpointSchemas: mailboxLayerEndpointSchemas,
		// No webhooks — mailboxlayer is a pull-based API
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MailboxLayerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalMailboxLayerPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CheckInput,
	CheckResponse,
	MailboxLayerEndpointInputs,
	MailboxLayerEndpointOutputs,
} from './endpoints/types';

export { CheckInputSchema, CheckResponseSchema } from './endpoints/types';
