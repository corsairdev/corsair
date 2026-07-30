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
import { EmailReputation, EmailValidation, Iban, Vat } from './endpoints';
import type {
	AbstractEndpointInputs,
	AbstractEndpointOutputs,
} from './endpoints/types';
import {
	AbstractEndpointInputSchemas,
	AbstractEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AbstractSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type AbstractPluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/**
	 * Shared fallback API key, used by any product below that doesn't have
	 * its own dedicated key configured (bypasses the key manager).
	 */
	key?: string;
	/**
	 * Abstract keys are scoped per-product from the dashboard — a key that
	 * unlocks Email Reputation won't necessarily unlock VAT or IBAN
	 * Validation. Set these when your account uses separate keys per
	 * product; each falls back to the shared `key` above when omitted.
	 */
	emailReputationApiKey?: string;
	vatApiKey?: string;
	ibanApiKey?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalAbstractPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Abstract plugin.
	 * All endpoints are read-only, so the default mode is effectively 'open'.
	 */
	permissions?: PluginPermissionsConfig<typeof abstractEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context & Type Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type AbstractContext = CorsairPluginContext<
	typeof AbstractSchema,
	AbstractPluginOptions,
	undefined,
	typeof abstractAuthConfig
>;

export type AbstractKeyBuilderContext = KeyBuilderContext<
	AbstractPluginOptions,
	typeof abstractAuthConfig
>;

export type AbstractBoundEndpoints = BindEndpoints<
	typeof abstractEndpointsNested
>;

type AbstractEndpoint<K extends keyof AbstractEndpointOutputs> =
	CorsairEndpoint<
		AbstractContext,
		AbstractEndpointInputs[K],
		AbstractEndpointOutputs[K]
	>;

export type AbstractEndpoints = {
	emailValidate: AbstractEndpoint<'emailValidate'>;
	emailReputation: AbstractEndpoint<'emailReputation'>;
	vatGetCategories: AbstractEndpoint<'vatGetCategories'>;
	ibanValidate: AbstractEndpoint<'ibanValidate'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const abstractEndpointsNested = {
	email: {
		validate: EmailValidation.validate,
		reputation: EmailReputation.get,
	},
	vat: {
		getCategories: Vat.getCategories,
	},
	iban: {
		validate: Iban.validate,
	},
} as const;

// No webhooks — Abstract is a pull-based API (no event delivery)
const abstractWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas (for get_schema / agent introspection)
// ─────────────────────────────────────────────────────────────────────────────

export const abstractEndpointSchemas = {
	'email.validate': {
		input: AbstractEndpointInputSchemas.emailValidate,
		output: AbstractEndpointOutputSchemas.emailValidate,
	},
	'email.reputation': {
		input: AbstractEndpointInputSchemas.emailReputation,
		output: AbstractEndpointOutputSchemas.emailReputation,
	},
	'vat.getCategories': {
		input: AbstractEndpointInputSchemas.vatGetCategories,
		output: AbstractEndpointOutputSchemas.vatGetCategories,
	},
	'iban.validate': {
		input: AbstractEndpointInputSchemas.ibanValidate,
		output: AbstractEndpointOutputSchemas.ibanValidate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof abstractEndpointsNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels for permission system)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Risk-level metadata for each Abstract endpoint.
 * All endpoints are read-only — they only validate/look up data.
 */
const abstractEndpointMeta = {
	'email.validate': {
		riskLevel: 'read',
		description:
			'Validate whether an email address is real, correctly formatted, and deliverable',
	},
	'email.reputation': {
		riskLevel: 'read',
		description:
			'Assess email deliverability and quality: format, disposable/free/role detection, MX and SMTP validation',
	},
	'vat.getCategories': {
		riskLevel: 'read',
		description:
			'Get VAT rate categories (standard, reduced, special) for a country',
	},
	'iban.validate': {
		riskLevel: 'read',
		description: 'Validate the format and country code of an IBAN number',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof abstractEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Abstract issues a separate API key per product from the dashboard, so
 * beyond the base `api_key` field this exposes one account-level field per
 * product (`ctx.keys.get_email_reputation_api_key()`, etc.) for accounts
 * that use dedicated keys instead of one shared key.
 */
export const abstractAuthConfig = {
	api_key: {
		account: [
			'email_reputation_api_key',
			'vat_api_key',
			'iban_api_key',
		] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseAbstractPlugin<T extends AbstractPluginOptions> = CorsairPlugin<
	'abstract',
	typeof AbstractSchema,
	typeof abstractEndpointsNested,
	typeof abstractWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof abstractAuthConfig
>;

export type InternalAbstractPlugin = BaseAbstractPlugin<AbstractPluginOptions>;

export type ExternalAbstractPlugin<T extends AbstractPluginOptions> =
	BaseAbstractPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function abstract<const T extends AbstractPluginOptions>(
	incomingOptions: AbstractPluginOptions &
		// Safe: T extends AbstractPluginOptions, so an empty object is a valid no-op default
		// when no options are passed. TypeScript requires the cast because it cannot verify T = {}.
		T = {} as AbstractPluginOptions & T,
): ExternalAbstractPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'abstract',
		authConfig: abstractAuthConfig,
		schema: AbstractSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: abstractEndpointsNested,
		webhooks: abstractWebhooksNested,
		endpointMeta: abstractEndpointMeta,
		endpointSchemas: abstractEndpointSchemas,
		// No webhooks — Abstract is a pull-based API
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AbstractKeyBuilderContext, source) => {
			// Direct shared key from options takes priority.
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// This resolves the shared *fallback* key only — every endpoint
			// resolves its own dedicated per-product key first (see
			// endpoints/*.ts) and only falls back to this value if unset.
			// Accounts that only ever configure dedicated per-product keys
			// (a fully valid, documented setup) may have no base api_key
			// credential and no DEK at all, which makes get_api_key() throw
			// rather than return null. tryGetStoredKey treats only that
			// specific "no DEK" state as "no shared key configured" and
			// re-throws anything else (a real decryption/DB failure), so a
			// genuine operational problem can't be silently masked here.
			if (source === 'endpoint') {
				const res = await tryGetStoredKey(() => ctx.keys.get_api_key());
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAbstractPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AbstractEndpointInputs,
	AbstractEndpointOutputs,
	EmailReputationInput,
	EmailReputationResponse,
	EmailValidateInput,
	EmailValidateResponse,
	IbanValidateInput,
	IbanValidateResponse,
	VatCategory,
	VatGetCategoriesInput,
	VatGetCategoriesResponse,
} from './endpoints/types';

export {
	EmailReputationInputSchema,
	EmailReputationResponseSchema,
	EmailValidateInputSchema,
	EmailValidateResponseSchema,
	IbanValidateInputSchema,
	IbanValidateResponseSchema,
	VatGetCategoriesInputSchema,
	VatGetCategoriesResponseSchema,
} from './endpoints/types';
