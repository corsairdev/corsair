import { z } from 'zod';
import { SpokiAccountSchema } from '../schema';

/*
 * Shared account/channel types.
 */
export interface SpokiAccount {
	id: number;
	name: string;
	current_credit: number;
	status: string;
	default_language: string;
	phone: string | null;
	has_official_verification: boolean;
	daily_limit: number;
	phone_status: string;
	quality_score: number;
	quality_reasons?: unknown;
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
	name: string;
	identifier: string;
	platform: string;
	status: string;
	phone_status: string;
	quality_score: string;
	is_primary: boolean;
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

export interface TriggerAutomationInput extends StartAutomationInput {
	uuid: string;
}

export interface SendMessageInput {
	phone: string;
	text: string;
	channel_id?: number;
	metadata?: Record<string, unknown>;
}

export interface SendMessageResponse {
	[key: string]: unknown;
}

export interface TriggerAutomationResponse {
	[key: string]: unknown;
}

// GET /api/1/accounts/ returns a bare array of accounts.
export type ListAccountsResponse = SpokiAccount[];

export interface GetAccountResponse extends SpokiAccount {}

export interface GetAccountByPhoneResponse extends SpokiAccount {}

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
		text: z.string(),
		channel_id: z.number().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),

	triggerAutomation: z.object({
		uuid: z.string(),
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

	listAccounts: z.array(SpokiAccountSchema),

	sendMessage: z.object({}).passthrough(),

	triggerAutomation: z.object({}).passthrough(),
};

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

export const SpokiEndpointInputSchemas = EndpointInputSchemas;
export const SpokiEndpointOutputSchemas = EndpointOutputSchemas;
