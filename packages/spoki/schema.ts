import { z } from 'zod';

// Channel entries as returned inside the documented "Retrieve account"
// response: { name, identifier, platform, status, phone_status,
// quality_score ("🟢 Green"), is_primary }.
export const SpokiChannelSchema = z.object({
	name: z.string(),
	identifier: z.string(),
	platform: z.string(),
	status: z.string(),
	phone_status: z.string(),
	quality_score: z.string(),
	is_primary: z.boolean(),
});

export const SpokiAccountSchema = z.object({
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

export const SpokiSchema = {
	version: '1.0.0',
	entities: {
		accounts: SpokiAccountSchema,
		channels: SpokiChannelSchema,
	},
} as const;
