import { z } from 'zod';

// Entity schemas modeled on the CallPage REST API response objects.
// https://callpage.github.io/documentation-rest/

export const CallPageId = z.coerce.number().int().positive();

const CallerIdSchema = z.object({
	id: z.number().optional(),
	tel: z.string().nullable().optional(),
	activated_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	tel_formatted: z.string().nullable().optional(),
});

// Users: GET /api/v1/external/users/all and /users/get
export const CallPageUser = z.object({
	id: CallPageId,
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	tel: z.string().nullable().optional(),
	tel_formatted: z.string().nullable().optional(),
	tel_extension: z.string().nullable().optional(),
	last_online: z.string().nullable().optional(),
	parent_id: z.number().nullable().optional(),
	activated_at: z.string().nullable().optional(),
	role: z.object({ slug: z.string() }).nullable().optional(),
	avatar: z.string().nullable().optional(),
	caller_id: CallerIdSchema.nullable().optional(),
});
export type CallPageUser = z.infer<typeof CallPageUser>;

export const CallPageBusinessTime = z.object({
	day_of_week: z.number().int().min(0).max(6),
	enabled: z.boolean(),
	timezone: z.string().nullable().optional(),
	start_time: z.string().nullable(),
	end_time: z.string().nullable(),
});
export type CallPageBusinessTime = z.infer<typeof CallPageBusinessTime>;

// Managers: GET /api/v1/external/managers/all and /managers/get.
// widget_id and user_id are not top-level response fields; the plugin adds
// them (user_id comes from user.id) so a manager can be looked up by widget and user.
export const CallPageManager = z.object({
	id: CallPageId,
	widget_id: CallPageId.optional(),
	user_id: CallPageId.optional(),
	enabled: z.boolean().optional(),
	user: z
		.object({
			id: CallPageId,
			name: z.string().nullable().optional(),
			tel: z.string().nullable().optional(),
			email: z.string().nullable().optional(),
			avatar: z.string().nullable().optional(),
		})
		.optional(),
	departments: z
		.array(z.object({ id: CallPageId, name: z.string() }))
		.optional(),
	business_times: z.array(CallPageBusinessTime).optional(),
});
export type CallPageManager = z.infer<typeof CallPageManager>;

// Widgets: GET /api/v1/external/widgets/all and /widgets/get
export const CallPageWidget = z.object({
	id: CallPageId,
	description: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
	enabled: z.boolean().optional(),
	locale_code: z.string().nullable().optional(),
	installation_status: z.number().nullable().optional(),
	installed_at: z.string().nullable().optional(),
	company_sms_name: z.string().nullable().optional(),
	call_requests_count: z.number().nullable().optional(),
	managers: z.array(CallPageManager).optional(),
});
export type CallPageWidget = z.infer<typeof CallPageWidget>;

const NullableString = z.string().nullable().optional();

// Calls: GET /api/v3/external/calls/history and /calls/{call_id}.
// The API wraps nested objects as { data: ... }; the plugin unwraps them.
export const CallPageCall = z.object({
	id: CallPageId,
	to: NullableString,
	to_formatted: NullableString,
	human_status: NullableString,
	created_at: NullableString,
	scheduled_at: NullableString,
	cancelled_at: NullableString,
	scheduled_success: z.boolean().nullable().optional(),
	leadable_id: z.number().nullable().optional(),
	leadable_type: NullableString,
	leadable_description: NullableString,
	utm: z
		.object({
			utm_medium: NullableString,
			utm_source: NullableString,
			utm_content: NullableString,
			utm_campaign: NullableString,
		})
		.optional(),
	referer: z
		.object({ medium: NullableString, source: NullableString })
		.optional(),
	request: z
		.object({
			id: z.number().optional(),
			ip: NullableString,
			url: NullableString,
			locale: NullableString,
			geo_city: NullableString,
			geo_country_code: NullableString,
			geo_country_name: NullableString,
			user_agent_device: NullableString,
			user_agent_device_type: NullableString,
		})
		.optional(),
	call: z
		.object({
			id: z.number().optional(),
			sid: NullableString,
			type: z.number().nullable().optional(),
			transcribed: z.boolean().nullable().optional(),
			billing_time: z.number().nullable().optional(),
		})
		.optional(),
});
export type CallPageCall = z.infer<typeof CallPageCall>;

// SMS messages: GET /api/v1/external/sms/all. Keyed by widget_id and
// message_id; widget_id is added from the request.
export const CallPageSmsMessage = z.object({
	widget_id: CallPageId.optional(),
	message_id: z.string(),
	text: z.string(),
	enabled: z.union([z.boolean(), z.number()]).optional(),
	updated_at: NullableString,
});
export type CallPageSmsMessage = z.infer<typeof CallPageSmsMessage>;

// Voice messages: GET /api/v1/external/voice/all. Keyed by widget_id and
// message_id; widget_id is added from the request.
export const CallPageVoiceMessage = z.object({
	widget_id: CallPageId.optional(),
	message_id: z.string(),
	enabled: z.union([z.boolean(), z.number()]).optional(),
	updated_at: NullableString,
	recording: z.object({ full_url: z.string() }).nullable().optional(),
});
export type CallPageVoiceMessage = z.infer<typeof CallPageVoiceMessage>;
