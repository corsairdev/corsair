import { z } from 'zod';

const TwilioTimestamp = z.string();

export const TwilioMessageEntity = z
	.object({
		account_sid: z.string(),
		api_version: z.string(),
		body: z.string().nullable(),
		date_created: TwilioTimestamp.nullable().optional(),
		date_sent: TwilioTimestamp.nullable().optional(),
		date_updated: TwilioTimestamp.nullable().optional(),
		direction: z.string(),
		error_code: z.number().int().nullable().optional(),
		error_message: z.string().nullable().optional(),
		from: z.string().nullable().optional(),
		messaging_service_sid: z.string().nullable().optional(),
		num_media: z.string().nullable().optional(),
		num_segments: z.string().nullable().optional(),
		price: z.string().nullable().optional(),
		price_unit: z.string().nullable().optional(),
		sid: z.string(),
		status: z.string(),
		to: z.string().nullable().optional(),
		uri: z.string().nullable().optional(),
	})
	.passthrough();

export type TwilioMessageEntity = z.infer<typeof TwilioMessageEntity>;

export const TwilioCallEntity = z
	.object({
		account_sid: z.string(),
		answered_by: z.string().nullable().optional(),
		api_version: z.string(),
		caller_name: z.string().nullable().optional(),
		date_created: TwilioTimestamp.nullable().optional(),
		date_updated: TwilioTimestamp.nullable().optional(),
		direction: z.string(),
		duration: z.string().nullable().optional(),
		end_time: TwilioTimestamp.nullable().optional(),
		forwarded_from: z.string().nullable().optional(),
		from: z.string().nullable().optional(),
		from_formatted: z.string().nullable().optional(),
		group_sid: z.string().nullable().optional(),
		parent_call_sid: z.string().nullable().optional(),
		phone_number_sid: z.string().nullable().optional(),
		price: z.string().nullable().optional(),
		price_unit: z.string().nullable().optional(),
		sid: z.string(),
		start_time: TwilioTimestamp.nullable().optional(),
		status: z.string(),
		to: z.string().nullable().optional(),
		to_formatted: z.string().nullable().optional(),
		trunk_sid: z.string().nullable().optional(),
		uri: z.string().nullable().optional(),
		queue_time: z.string().nullable().optional(),
	})
	.passthrough();

export type TwilioCallEntity = z.infer<typeof TwilioCallEntity>;
