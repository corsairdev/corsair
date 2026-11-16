import { z } from 'zod';

// Inputs use Telnyx's own parameter names. Every response is `{ data }`, and a
// list adds `meta` with the page counters. Outputs are `.loose()` and their
// optional fields nullish, because Telnyx sends `null` for unset relations.
// Field reference: https://developers.telnyx.com/api-reference

/**
 * Telnyx pages with `page[number]` and `page[size]`. `page[size]` runs from 1
 * to 250; the API picks its own default, so the caller states it.
 */
const PageNumberSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Page of results, starting at 1.');
const PageSizeSchema = z
	.number()
	.int()
	.min(1)
	.max(250)
	.optional()
	.describe('Results per page, from 1 to 250.');

/**
 * An ID that goes into a request path. Endpoints encode it, and "." or ".."
 * is refused because a URL resolver would turn it into a different route.
 */
const PathIdSchema = z
	.string()
	.min(1)
	.refine((value) => value !== '.' && value !== '..', {
		message: 'An ID cannot be "." or "..".',
	});

const MetaSchema = z
	.object({
		total_pages: z.number().nullish(),
		total_results: z.number().nullish(),
		page_number: z.number().nullish(),
		page_size: z.number().nullish(),
	})
	.loose();

/**
 * Wraps one record in Telnyx's `{ data }` envelope. A list uses `list()` so its
 * `meta` is typed too.
 */
function record<T extends z.ZodType>(item: T) {
	return z.object({ data: item }).loose();
}

function list<T extends z.ZodType>(item: T) {
	return z.object({ data: z.array(item), meta: MetaSchema.nullish() }).loose();
}

// ── messages ──────────────────────────────────────────────────────────────

export const MessageSchema = z
	.object({
		record_type: z.string().nullish(),
		direction: z.string().nullish(),
		id: z.string(),
		type: z.string().nullish(),
		messaging_profile_id: z.string().nullish(),
		organization_id: z.string().nullish(),
		from: z
			.object({
				phone_number: z.string().nullish(),
				carrier: z.string().nullish(),
				line_type: z.string().nullish(),
			})
			.loose()
			.nullish(),
		to: z
			.array(
				z
					.object({
						phone_number: z.string().nullish(),
						status: z.string().nullish(),
						carrier: z.string().nullish(),
						line_type: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		text: z.string().nullish(),
		num_chars: z.number().nullish(),
		subject: z.string().nullish(),
		// Telnyx sends content_type, sha256 and size as null until the media
		// is fetched.
		media: z
			.array(
				z
					.object({
						url: z.string().nullish(),
						content_type: z.string().nullish(),
						sha256: z.string().nullish(),
						size: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
		webhook_url: z.string().nullish(),
		encoding: z.string().nullish(),
		parts: z.number().nullish(),
		tags: z.array(z.string()).nullish(),
		// Telnyx sends a cost object with a currency and amount string.
		cost: z
			.object({ amount: z.string().nullish(), currency: z.string().nullish() })
			.loose()
			.nullish(),
		received_at: z.string().nullish(),
		sent_at: z.string().nullish(),
		completed_at: z.string().nullish(),
		errors: z
			.array(
				z
					.object({
						code: z.string().nullish(),
						title: z.string().nullish(),
						detail: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type TelnyxMessage = z.infer<typeof MessageSchema>;

export const MessagesSendInputSchema = z
	.object({
		to: z
			.string()
			.min(1)
			.describe('The destination number in E.164 format, e.g. "+13125550001".'),
		from: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The sending number or alphanumeric sender ID. Required when sending from a phone number or sender ID; omit it when the number pool on `messaging_profile_id` picks the sender.',
			),
		text: z
			.string()
			.optional()
			.describe(
				'The message body. Required for SMS; required for MMS only with media.',
			),
		messaging_profile_id: z
			.string()
			.optional()
			.describe(
				'The messaging profile to send through. Required when sending via a number pool or from an alphanumeric sender ID.',
			),
		media_urls: z
			.array(z.string())
			.optional()
			.describe('Media to attach, for MMS. Required for MMS.'),
		subject: z.string().optional(),
		webhook_url: z.string().optional(),
		use_profile_webhooks: z.boolean().optional(),
		type: z
			.enum(['SMS', 'MMS'])
			.optional()
			.describe('The message type. Telnyx infers it when omitted.'),
		send_at: z
			.string()
			.optional()
			.describe('An ISO 8601 timestamp to schedule the message.'),
	})
	// Telnyx refuses a body with neither text nor media, and a body with a
	// sender that is not a number needs a profile, so both are checked here
	// rather than after a failed request.
	.superRefine((value, ctx) => {
		const hasText = (value.text?.length ?? 0) > 0;
		const hasMedia = (value.media_urls?.length ?? 0) > 0;
		if (!hasText && !hasMedia) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide text or at least one media URL.',
				path: ['text'],
			});
		}
		if (value.from === undefined && value.messaging_profile_id === undefined) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Provide from, or a messaging_profile_id so the number pool picks the sender.',
				path: ['from'],
			});
		}
	});

export type MessagesSendInput = z.input<typeof MessagesSendInputSchema>;

export const MessagesSendResponseSchema = record(MessageSchema);

export type MessagesSendResponse = z.infer<typeof MessagesSendResponseSchema>;

export const MessagesGetInputSchema = z.object({
	messageId: PathIdSchema.describe('The message ID.'),
});

export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;

export const MessagesGetResponseSchema = record(MessageSchema);

export type MessagesGetResponse = z.infer<typeof MessagesGetResponseSchema>;

export const MessagesRemoveInputSchema = z.object({
	messageId: PathIdSchema.describe(
		'The ID of the scheduled message to cancel.',
	),
});

export type MessagesRemoveInput = z.infer<typeof MessagesRemoveInputSchema>;

// DELETE /messages/{id} cancels a scheduled message, and Telnyx answers with
// the cancelled message itself, not wrapped in `{ data }`.
export const MessagesRemoveResponseSchema = MessageSchema;

export type MessagesRemoveResponse = z.infer<
	typeof MessagesRemoveResponseSchema
>;

// ── messaging profiles ────────────────────────────────────────────────────

export const MessagingProfileSchema = z
	.object({
		id: z.string(),
		record_type: z.string().nullish(),
		name: z.string().nullish(),
		enabled: z.boolean().nullish(),
		webhook_url: z.string().nullish(),
		webhook_failover_url: z.string().nullish(),
		webhook_api_version: z.string().nullish(),
		whitelisted_destinations: z.array(z.string()).nullish(),
		number_pool_settings: z
			.object({
				number_pool_id: z.string().nullish(),
				skip_unhealthy_numbers: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		url_shortener_settings: z
			.object({
				domain: z.string().nullish(),
				prefix: z.string().nullish(),
				strategy: z.string().nullish(),
			})
			.loose()
			.nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type TelnyxMessagingProfile = z.infer<typeof MessagingProfileSchema>;

export const MessagingProfilesListInputSchema = z.object({
	pageNumber: PageNumberSchema,
	pageSize: PageSizeSchema,
});

export type MessagingProfilesListInput = z.infer<
	typeof MessagingProfilesListInputSchema
>;

export const MessagingProfilesListResponseSchema = list(MessagingProfileSchema);

export type MessagingProfilesListResponse = z.infer<
	typeof MessagingProfilesListResponseSchema
>;

export const MessagingProfilesGetInputSchema = z.object({
	profileId: PathIdSchema.describe('The messaging profile ID.'),
});

export type MessagingProfilesGetInput = z.infer<
	typeof MessagingProfilesGetInputSchema
>;

export const MessagingProfilesGetResponseSchema = record(
	MessagingProfileSchema,
);

export type MessagingProfilesGetResponse = z.infer<
	typeof MessagingProfilesGetResponseSchema
>;

export const MessagingProfilesCreateInputSchema = z.object({
	name: z.string().min(1).describe('The profile name.'),
	enabled: z.boolean().optional(),
	webhook_url: z
		.string()
		.optional()
		.describe('Where inbound messages for the profile are delivered.'),
	webhook_failover_url: z.string().optional(),
	whitelisted_destinations: z
		.array(z.string())
		.describe(
			'Two-letter country codes the profile may send to, e.g. ["US"]. Telnyx requires it.',
		),
});

export type MessagingProfilesCreateInput = z.input<
	typeof MessagingProfilesCreateInputSchema
>;

export const MessagingProfilesCreateResponseSchema = record(
	MessagingProfileSchema,
);

export type MessagingProfilesCreateResponse = z.infer<
	typeof MessagingProfilesCreateResponseSchema
>;

export const MessagingProfilesUpdateInputSchema = z.object({
	profileId: PathIdSchema.describe('The messaging profile to change.'),
	name: z.string().min(1).optional(),
	enabled: z.boolean().optional(),
	webhook_url: z.string().nullable().optional(),
	webhook_failover_url: z.string().nullable().optional(),
	whitelisted_destinations: z.array(z.string()).optional(),
});

export type MessagingProfilesUpdateInput = z.input<
	typeof MessagingProfilesUpdateInputSchema
>;

export const MessagingProfilesUpdateResponseSchema = record(
	MessagingProfileSchema,
);

export type MessagingProfilesUpdateResponse = z.infer<
	typeof MessagingProfilesUpdateResponseSchema
>;

export const MessagingProfilesRemoveInputSchema = z.object({
	profileId: PathIdSchema.describe('The messaging profile to delete.'),
});

export type MessagingProfilesRemoveInput = z.infer<
	typeof MessagingProfilesRemoveInputSchema
>;

export const MessagingProfilesRemoveResponseSchema = record(
	MessagingProfileSchema,
);

export type MessagingProfilesRemoveResponse = z.infer<
	typeof MessagingProfilesRemoveResponseSchema
>;

// ── phone numbers ─────────────────────────────────────────────────────────

export const PhoneNumberSchema = z
	.object({
		id: z.string(),
		record_type: z.string().nullish(),
		phone_number: z.string().nullish(),
		country_iso_alpha2: z.string().nullish(),
		status: z.string().nullish(),
		connection_id: z.string().nullish(),
		connection_name: z.string().nullish(),
		customer_reference: z.string().nullish(),
		messaging_profile_id: z.string().nullish(),
		messaging_profile_name: z.string().nullish(),
		billing_group_id: z.string().nullish(),
		phone_number_type: z.string().nullish(),
		emergency_enabled: z.boolean().nullish(),
		emergency_address_id: z.string().nullish(),
		external_pin: z.string().nullish(),
		purchased_at: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
	})
	.loose();

export type TelnyxPhoneNumber = z.infer<typeof PhoneNumberSchema>;

export const PhoneNumbersListInputSchema = z.object({
	pageNumber: PageNumberSchema,
	pageSize: PageSizeSchema,
	sort: z
		.string()
		.optional()
		.describe('The column to sort by, for example "purchased_at".'),
});

export type PhoneNumbersListInput = z.infer<typeof PhoneNumbersListInputSchema>;

export const PhoneNumbersListResponseSchema = list(PhoneNumberSchema);

export type PhoneNumbersListResponse = z.infer<
	typeof PhoneNumbersListResponseSchema
>;

export const PhoneNumbersGetInputSchema = z.object({
	phoneNumberId: PathIdSchema.describe('The phone number record ID.'),
});

export type PhoneNumbersGetInput = z.infer<typeof PhoneNumbersGetInputSchema>;

export const PhoneNumbersGetResponseSchema = record(PhoneNumberSchema);

export type PhoneNumbersGetResponse = z.infer<
	typeof PhoneNumbersGetResponseSchema
>;

export const PhoneNumbersUpdateInputSchema = z
	.object({
		phoneNumberId: PathIdSchema.describe('The phone number record to change.'),
		connection_id: z
			.string()
			.optional()
			.describe(
				'The call control application or other connection to attach the number to.',
			),
		billing_group_id: z.string().optional(),
		customer_reference: z.string().optional(),
		external_pin: z.string().optional(),
		hd_voice_enabled: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
	})
	.refine(
		(value) => Object.keys(value).some((key) => key !== 'phoneNumberId'),
		'Provide at least one field to change.',
	);

export type PhoneNumbersUpdateInput = z.input<
	typeof PhoneNumbersUpdateInputSchema
>;

export const PhoneNumbersUpdateResponseSchema = record(PhoneNumberSchema);

export type PhoneNumbersUpdateResponse = z.infer<
	typeof PhoneNumbersUpdateResponseSchema
>;

export const PhoneNumbersRemoveInputSchema = z.object({
	phoneNumberId: PathIdSchema.describe('The phone number record to delete.'),
});

export type PhoneNumbersRemoveInput = z.infer<
	typeof PhoneNumbersRemoveInputSchema
>;

export const PhoneNumbersRemoveResponseSchema = record(PhoneNumberSchema);

export type PhoneNumbersRemoveResponse = z.infer<
	typeof PhoneNumbersRemoveResponseSchema
>;

export const AvailablePhoneNumbersListInputSchema = z.object({
	countryCode: z
		.string()
		.length(2)
		.describe('Two-letter country code to search in, e.g. "US".'),
	locality: z.string().optional().describe('A city to search in.'),
	administrativeArea: z
		.string()
		.optional()
		.describe('A state or province to search in.'),
	nationalDestinationCode: z
		.string()
		.optional()
		.describe('An area code to search in.'),
	phoneNumberType: z
		.enum(['local', 'toll_free', 'mobile', 'national', 'shared_cost'])
		.optional(),
	// `limit` is a filter entry, not a top-level query value.
	limit: z
		.number()
		.int()
		.min(1)
		.max(250)
		.optional()
		.describe('The maximum number of results, 1 to 250.'),
});

export type AvailablePhoneNumbersListInput = z.infer<
	typeof AvailablePhoneNumbersListInputSchema
>;

export const AvailablePhoneNumberSchema = z
	.object({
		phone_number: z.string().nullish(),
		record_type: z.string().nullish(),
		region_information: z
			.array(
				z
					.object({
						region_type: z.string().nullish(),
						region_name: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		cost_information: z
			.object({
				upfront_cost: z.string().nullish(),
				monthly_cost: z.string().nullish(),
				currency: z.string().nullish(),
			})
			.loose()
			.nullish(),
		features: z
			.array(z.object({ name: z.string().nullish() }).loose())
			.nullish(),
	})
	.loose();

export const AvailablePhoneNumbersListResponseSchema = z
	.object({
		data: z.array(AvailablePhoneNumberSchema),
		meta: MetaSchema.nullish(),
	})
	.loose();

export type AvailablePhoneNumbersListResponse = z.infer<
	typeof AvailablePhoneNumbersListResponseSchema
>;

// ── calls ─────────────────────────────────────────────────────────────────

export const CallSchema = z
	.object({
		record_type: z.string().nullish(),
		call_control_id: z.string().nullish(),
		call_leg_id: z.string().nullish(),
		call_session_id: z.string().nullish(),
		connection_id: z.string().nullish(),
		from: z.string().nullish(),
		to: z.string().nullish(),
		is_alive: z.boolean().nullish(),
		call_state: z.string().nullish(),
		// Telnyx sends an enum, but a new value must not fail a read.
		state: z.string().nullish(),
		direction: z.string().nullish(),
		started_at: z.string().nullish(),
		answered_at: z.string().nullish(),
		ended_at: z.string().nullish(),
		recording_id: z.string().nullish(),
		client_state: z.string().nullish(),
		// calls.get answers with the duration so far and the start and end.
		call_duration: z.number().nullish(),
		start_time: z.string().nullish(),
		end_time: z.string().nullish(),
	})
	.loose();

export type TelnyxCall = z.infer<typeof CallSchema>;

export const CallsCreateInputSchema = z.object({
	connection_id: z
		.string()
		.min(1)
		.describe('The call control application that handles the call.'),
	to: z.string().min(1).describe('The number to dial, in E.164 format.'),
	from: z.string().min(1).describe('The number to dial from, in E.164 format.'),
	from_display_name: z.string().max(128).optional(),
	timeout_secs: z.number().int().min(1).max(600).optional(),
	time_limit_secs: z.number().int().min(1).optional(),
	webhook_url: z.string().optional(),
	webhook_url_method: z.enum(['GET', 'POST']).optional(),
	client_state: z
		.string()
		.optional()
		.describe('Base64 state returned on every webhook for this call.'),
	command_id: z.string().optional(),
});

export type CallsCreateInput = z.input<typeof CallsCreateInputSchema>;

export const CallsCreateResponseSchema = record(CallSchema);

export type CallsCreateResponse = z.infer<typeof CallsCreateResponseSchema>;

export const CallsGetInputSchema = z.object({
	callControlId: PathIdSchema.describe('The call_control_id of the call.'),
});

export type CallsGetInput = z.infer<typeof CallsGetInputSchema>;

export const CallsGetResponseSchema = record(CallSchema);

export type CallsGetResponse = z.infer<typeof CallsGetResponseSchema>;

export const CallActionResponseSchema = z
	.object({
		data: z
			.object({
				result: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type CallActionResponse = z.infer<typeof CallActionResponseSchema>;

export const CallsHangupInputSchema = z.object({
	callControlId: PathIdSchema.describe('The call_control_id to hang up.'),
});

export type CallsHangupInput = z.infer<typeof CallsHangupInputSchema>;

export const CallsSpeakInputSchema = z.object({
	callControlId: PathIdSchema.describe('The call_control_id to speak on.'),
	payload: z.string().min(1).describe('The text to read aloud.'),
	voice: z
		.string()
		.min(1)
		.describe(
			'The voice to use, e.g. "female", "male" or a provider voice such as "Telnyx.KokoroTTS.af".',
		),
	language: z
		.string()
		.optional()
		.describe('The language of the payload, e.g. "en-US".'),
	loop: z.number().int().min(1).optional(),
	stop: z.string().optional(),
});

export type CallsSpeakInput = z.input<typeof CallsSpeakInputSchema>;

// ── call control applications ─────────────────────────────────────────────

export const CallControlApplicationSchema = z
	.object({
		id: z.string(),
		record_type: z.string().nullish(),
		application_name: z.string().nullish(),
		active: z.boolean().nullish(),
		anchorsite_override: z.string().nullish(),
		webhook_event_url: z.string().nullish(),
		webhook_event_failover_url: z.string().nullish(),
		webhook_api_version: z.string().nullish(),
		// "RFC 2833", "Inband" or "SIP INFO".
		dtmf_type: z.string().nullish(),
		first_command_timeout: z.boolean().nullish(),
		first_command_timeout_secs: z.number().nullish(),
		inbound: z
			.object({ channel_limit: z.number().nullish() })
			.loose()
			.nullish(),
		outbound: z
			.object({ channel_limit: z.number().nullish() })
			.loose()
			.nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type TelnyxCallControlApplication = z.infer<
	typeof CallControlApplicationSchema
>;

export const CallControlApplicationsListInputSchema = z.object({
	pageNumber: PageNumberSchema,
	pageSize: PageSizeSchema,
});

export type CallControlApplicationsListInput = z.infer<
	typeof CallControlApplicationsListInputSchema
>;

export const CallControlApplicationsListResponseSchema = list(
	CallControlApplicationSchema,
);

export type CallControlApplicationsListResponse = z.infer<
	typeof CallControlApplicationsListResponseSchema
>;

export const CallControlApplicationsGetInputSchema = z.object({
	applicationId: PathIdSchema.describe('The call control application ID.'),
});

export type CallControlApplicationsGetInput = z.infer<
	typeof CallControlApplicationsGetInputSchema
>;

export const CallControlApplicationsGetResponseSchema = record(
	CallControlApplicationSchema,
);

export type CallControlApplicationsGetResponse = z.infer<
	typeof CallControlApplicationsGetResponseSchema
>;

export const CallControlApplicationsCreateInputSchema = z.object({
	application_name: z.string().min(1).describe('The application name.'),
	webhook_event_url: z
		.string()
		.min(1)
		.describe('Where Telnyx sends call events for this application.'),
	webhook_event_failover_url: z.string().optional(),
	webhook_api_version: z.enum(['1', '2']).optional(),
	active: z.boolean().optional(),
	anchorsite_override: z.string().optional(),
});

export type CallControlApplicationsCreateInput = z.input<
	typeof CallControlApplicationsCreateInputSchema
>;

export const CallControlApplicationsCreateResponseSchema = record(
	CallControlApplicationSchema,
);

export type CallControlApplicationsCreateResponse = z.infer<
	typeof CallControlApplicationsCreateResponseSchema
>;

export const CallControlApplicationsUpdateInputSchema = z
	.object({
		applicationId: PathIdSchema,
		application_name: z.string().min(1).optional(),
		webhook_event_url: z.string().optional(),
		webhook_event_failover_url: z.string().nullable().optional(),
		webhook_api_version: z.enum(['1', '2']).optional(),
		active: z.boolean().optional(),
		anchorsite_override: z.string().optional(),
	})
	.refine(
		(value) => Object.keys(value).some((key) => key !== 'applicationId'),
		'Provide at least one field to change.',
	);

export type CallControlApplicationsUpdateInput = z.input<
	typeof CallControlApplicationsUpdateInputSchema
>;

export const CallControlApplicationsUpdateResponseSchema = record(
	CallControlApplicationSchema,
);

export type CallControlApplicationsUpdateResponse = z.infer<
	typeof CallControlApplicationsUpdateResponseSchema
>;

export const CallControlApplicationsRemoveInputSchema = z.object({
	applicationId: PathIdSchema.describe(
		'The call control application to delete.',
	),
});

export type CallControlApplicationsRemoveInput = z.infer<
	typeof CallControlApplicationsRemoveInputSchema
>;

export const CallControlApplicationsRemoveResponseSchema = record(
	CallControlApplicationSchema,
);

export type CallControlApplicationsRemoveResponse = z.infer<
	typeof CallControlApplicationsRemoveResponseSchema
>;

// ── registry ──────────────────────────────────────────────────────────────

export type TelnyxEndpointInputs = {
	messagesSend: MessagesSendInput;
	messagesGet: MessagesGetInput;
	messagesRemove: MessagesRemoveInput;
	messagingProfilesList: MessagingProfilesListInput;
	messagingProfilesGet: MessagingProfilesGetInput;
	messagingProfilesCreate: MessagingProfilesCreateInput;
	messagingProfilesUpdate: MessagingProfilesUpdateInput;
	messagingProfilesRemove: MessagingProfilesRemoveInput;
	phoneNumbersList: PhoneNumbersListInput;
	phoneNumbersGet: PhoneNumbersGetInput;
	phoneNumbersUpdate: PhoneNumbersUpdateInput;
	phoneNumbersRemove: PhoneNumbersRemoveInput;
	availablePhoneNumbersList: AvailablePhoneNumbersListInput;
	callsCreate: CallsCreateInput;
	callsGet: CallsGetInput;
	callsHangup: CallsHangupInput;
	callsSpeak: CallsSpeakInput;
	callControlApplicationsList: CallControlApplicationsListInput;
	callControlApplicationsGet: CallControlApplicationsGetInput;
	callControlApplicationsCreate: CallControlApplicationsCreateInput;
	callControlApplicationsUpdate: CallControlApplicationsUpdateInput;
	callControlApplicationsRemove: CallControlApplicationsRemoveInput;
};

export type TelnyxEndpointOutputs = {
	messagesSend: MessagesSendResponse;
	messagesGet: MessagesGetResponse;
	messagesRemove: MessagesRemoveResponse;
	messagingProfilesList: MessagingProfilesListResponse;
	messagingProfilesGet: MessagingProfilesGetResponse;
	messagingProfilesCreate: MessagingProfilesCreateResponse;
	messagingProfilesUpdate: MessagingProfilesUpdateResponse;
	messagingProfilesRemove: MessagingProfilesRemoveResponse;
	phoneNumbersList: PhoneNumbersListResponse;
	phoneNumbersGet: PhoneNumbersGetResponse;
	phoneNumbersUpdate: PhoneNumbersUpdateResponse;
	phoneNumbersRemove: PhoneNumbersRemoveResponse;
	availablePhoneNumbersList: AvailablePhoneNumbersListResponse;
	callsCreate: CallsCreateResponse;
	callsGet: CallsGetResponse;
	callsHangup: CallActionResponse;
	callsSpeak: CallActionResponse;
	callControlApplicationsList: CallControlApplicationsListResponse;
	callControlApplicationsGet: CallControlApplicationsGetResponse;
	callControlApplicationsCreate: CallControlApplicationsCreateResponse;
	callControlApplicationsUpdate: CallControlApplicationsUpdateResponse;
	callControlApplicationsRemove: CallControlApplicationsRemoveResponse;
};

export const TelnyxEndpointInputSchemas = {
	messagesSend: MessagesSendInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesRemove: MessagesRemoveInputSchema,
	messagingProfilesList: MessagingProfilesListInputSchema,
	messagingProfilesGet: MessagingProfilesGetInputSchema,
	messagingProfilesCreate: MessagingProfilesCreateInputSchema,
	messagingProfilesUpdate: MessagingProfilesUpdateInputSchema,
	messagingProfilesRemove: MessagingProfilesRemoveInputSchema,
	phoneNumbersList: PhoneNumbersListInputSchema,
	phoneNumbersGet: PhoneNumbersGetInputSchema,
	phoneNumbersUpdate: PhoneNumbersUpdateInputSchema,
	phoneNumbersRemove: PhoneNumbersRemoveInputSchema,
	availablePhoneNumbersList: AvailablePhoneNumbersListInputSchema,
	callsCreate: CallsCreateInputSchema,
	callsGet: CallsGetInputSchema,
	callsHangup: CallsHangupInputSchema,
	callsSpeak: CallsSpeakInputSchema,
	callControlApplicationsList: CallControlApplicationsListInputSchema,
	callControlApplicationsGet: CallControlApplicationsGetInputSchema,
	callControlApplicationsCreate: CallControlApplicationsCreateInputSchema,
	callControlApplicationsUpdate: CallControlApplicationsUpdateInputSchema,
	callControlApplicationsRemove: CallControlApplicationsRemoveInputSchema,
} as const;

export const TelnyxEndpointOutputSchemas = {
	messagesSend: MessagesSendResponseSchema,
	messagesGet: MessagesGetResponseSchema,
	messagesRemove: MessagesRemoveResponseSchema,
	messagingProfilesList: MessagingProfilesListResponseSchema,
	messagingProfilesGet: MessagingProfilesGetResponseSchema,
	messagingProfilesCreate: MessagingProfilesCreateResponseSchema,
	messagingProfilesUpdate: MessagingProfilesUpdateResponseSchema,
	messagingProfilesRemove: MessagingProfilesRemoveResponseSchema,
	phoneNumbersList: PhoneNumbersListResponseSchema,
	phoneNumbersGet: PhoneNumbersGetResponseSchema,
	phoneNumbersUpdate: PhoneNumbersUpdateResponseSchema,
	phoneNumbersRemove: PhoneNumbersRemoveResponseSchema,
	availablePhoneNumbersList: AvailablePhoneNumbersListResponseSchema,
	callsCreate: CallsCreateResponseSchema,
	callsGet: CallsGetResponseSchema,
	callsHangup: CallActionResponseSchema,
	callsSpeak: CallActionResponseSchema,
	callControlApplicationsList: CallControlApplicationsListResponseSchema,
	callControlApplicationsGet: CallControlApplicationsGetResponseSchema,
	callControlApplicationsCreate: CallControlApplicationsCreateResponseSchema,
	callControlApplicationsUpdate: CallControlApplicationsUpdateResponseSchema,
	callControlApplicationsRemove: CallControlApplicationsRemoveResponseSchema,
} as const;
