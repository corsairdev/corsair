import { z } from 'zod';

export interface SpokiAccount {
	id: number;
	name: string;
	current_credit: number;
	status: string;
	default_language: string;
	phone: string;
	has_official_verification: boolean;
	daily_limit: number;
	phone_status: string;
	quality_score: number;
	quality_reasons: unknown;
	is_active: boolean;
	country_code: string;
	estimated_available_conversations: number;
	account_type: number;
	default_pricing_delta: number;
	low_credit_threshold: number;
	has_low_credit_alert: boolean;
	default_prefix: string;
	default_country_code: string;
	timezone: string;
	contacted_in_24h: number;
	contacted_in_7d: number;
	primary_channel_id?: number | null;
	channels?: SpokiChannel[];
}

export interface SpokiChannel {
	id: number;
	name: string;
	phone: string;
	phone_status: string;
	quality_score: number;
	quality_reasons?: unknown;
	has_official_verification: boolean;
	daily_limit: number;
	account_type: number;
	is_active: boolean;
}

export interface StartAutomationInput {
	secret: string;
	phone: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	language?: string;
	custom_fields?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

export interface SendMessageInput {
	phone: string;
	message: string;
}

export interface SendMessageResponse {
	success?: boolean;
	message?: string;
	[key: string]: unknown;
}

export interface ListAccountsResponse {
	accounts: SpokiAccount[];
	[key: string]: unknown;
}

export interface GetAccountResponse extends SpokiAccount {}

export interface GetAccountByPhoneResponse extends SpokiAccount {}

/*
 * Zod schemas used by Corsair's plugin validator.
 */

const SpokiChannelSchema = z.object({
	id: z.number(),
	name: z.string(),
	phone: z.string(),
	phone_status: z.string(),
	quality_score: z.number(),
	quality_reasons: z.unknown().optional(),
	has_official_verification: z.boolean(),
	daily_limit: z.number(),
	account_type: z.number(),
	is_active: z.boolean(),
});

const SpokiAccountSchema = z.object({
	id: z.number(),
	name: z.string(),
	current_credit: z.number(),
	status: z.string(),
	default_language: z.string(),
	phone: z.string(),
	has_official_verification: z.boolean(),
	daily_limit: z.number(),
	phone_status: z.string(),
	quality_score: z.number(),
	quality_reasons: z.unknown(),
	is_active: z.boolean(),
	country_code: z.string(),
	estimated_available_conversations: z.number(),
	account_type: z.number(),
	default_pricing_delta: z.number(),
	low_credit_threshold: z.number(),
	has_low_credit_alert: z.boolean(),
	default_prefix: z.string(),
	default_country_code: z.string(),
	timezone: z.string(),
	contacted_in_24h: z.number(),
	contacted_in_7d: z.number(),
	primary_channel_id: z.number().nullable().optional(),
	channels: z.array(SpokiChannelSchema).optional(),
});

/*
 * Endpoint input schemas.
 *
 * These names must match the endpoint names used by the plugin.
 */
export const EndpointInputSchemas = {
	getAccount: z.object({
		accountId: z.number(),
	}),

	getAccountByPhone: z.object({
		phone: z.string(),
	}),

	listAccounts: z.object({}),

	sendMessage: z.object({
		phone: z.string(),
		message: z.string(),
	}),

	triggerAutomation: z.object({
		secret: z.string(),
		phone: z.string(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().email().optional(),
		language: z.string().optional(),
		custom_fields: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),
};

/*
 * Endpoint output schemas.
 *
 * These names must match the endpoint names used by the plugin.
 */
export const EndpointOutputSchemas = {
	getAccount: SpokiAccountSchema,

	getAccountByPhone: SpokiAccountSchema,

	listAccounts: z
		.object({
			accounts: z.array(SpokiAccountSchema),
		})
		.passthrough(),

	sendMessage: SendMessageResponseSchema(),

	triggerAutomation: z.unknown(),
};

/*
 * Send-message response.
 *
 * Spoki may return additional fields, so passthrough() keeps
 * the schema flexible while validating the known fields.
 */
function SendMessageResponseSchema() {
	return z
		.object({
			success: z.boolean().optional(),
			message: z.string().optional(),
		})
		.passthrough();
}

/*
 * Typed versions for consumers that want inferred endpoint types.
 */
export type EndpointInput = {
	[K in keyof typeof EndpointInputSchemas]: z.infer<
		(typeof EndpointInputSchemas)[K]
	>;
};

export type EndpointOutput = {
	[K in keyof typeof EndpointOutputSchemas]: z.infer<
		(typeof EndpointOutputSchemas)[K]
	>;
};

/*
 * Backwards-compatible aliases if other code expects
 * Spoki-specific schema names.
 */
export const SpokiEndpointInputSchemas = EndpointInputSchemas;
export const SpokiEndpointOutputSchemas = EndpointOutputSchemas;
