import { FileOutputSchema } from 'corsair/http';
import { z } from 'zod';

// Inputs use Mocean's own `mocean-*` parameter names, so a form field maps one
// to one. Outputs are `.loose()` and their documented fields nullish, so a
// field Mocean adds or omits cannot fail a call that has already happened.
// Source: https://moceanapi.com/docs

// Body statuses arrive as numbers, and on voice routes as strings.
const BodyStatus = z.union([z.number(), z.string()]);
// Credits and prices arrive as numbers although the reference says strings.
const Amount = z.union([z.number(), z.string()]).nullish();

// ── sms.send ──────────────────────────────────────────────────────────────

export const MOCEAN_MAX_SMS_RECEIVERS = 500;

const CharsetSchema = z.enum([
	'ISO-8859-1',
	'ISO-8859-7',
	'UTF-8',
	'Windows-1252',
]);

const SmsSendInputSchema = z
	.object({
		mocean_from: z
			.string()
			.min(1)
			.describe('The Sender ID shown on the recipient handset.'),
		mocean_to: z
			.string()
			.min(1)
			.describe(
				'Receiver phone numbers with country code, separated by commas or spaces, up to 500.',
			),
		mocean_text: z
			.string()
			.min(1)
			.describe('The message content; every receiver gets the same text.'),
		mocean_udh: z
			.string()
			.optional()
			.describe('User Data Header, e.g. 0605040B8423F0.'),
		mocean_coding: z
			.number()
			.int()
			.min(1)
			.max(3)
			.optional()
			.describe('DCS coding scheme: 1 for 7-bit, 2 for 8-bit, 3 for UCS2.'),
		mocean_dlr_mask: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('Set to 1 to request delivery reports. Defaults to 0.'),
		mocean_dlr_url: z
			.string()
			.url()
			.optional()
			.describe(
				'Required when mocean_dlr_mask is 1: the delivery report callback URL.',
			),
		mocean_schedule: z
			.string()
			.regex(
				/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
				'Must be YYYY-MM-DD hh:mm:ss',
			)
			.optional()
			.describe(
				'Send later, in Malaysia time (GMT+8). A wrong format is rejected by the gateway.',
			),
		mocean_mclass: z
			.number()
			.int()
			.optional()
			.describe('Set to 1 with mocean_alt_dcs to send a Flash SMS.'),
		mocean_alt_dcs: z
			.number()
			.int()
			.optional()
			.describe('Set to 1 with mocean_mclass to send a Flash SMS.'),
		mocean_charset: CharsetSchema.optional().describe(
			'The character set used in mocean_text.',
		),
		mocean_validity: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('How long the message stays deliverable, in seconds.'),
	})
	.superRefine((value, ctx) => {
		if (value.mocean_dlr_mask === 1 && !value.mocean_dlr_url) {
			ctx.addIssue({
				code: 'custom',
				message: 'mocean_dlr_url is required when mocean_dlr_mask is 1',
			});
		}
		const receivers = value.mocean_to.split(/[ ,]+/).filter(Boolean);
		if (receivers.length > MOCEAN_MAX_SMS_RECEIVERS) {
			ctx.addIssue({
				code: 'custom',
				message: `at most ${MOCEAN_MAX_SMS_RECEIVERS} receivers per request, got ${receivers.length}`,
			});
		}
	});

export type SmsSendInput = z.input<typeof SmsSendInputSchema>;

const MessageResultSchema = z
	.object({
		status: BodyStatus,
		receiver: z.string().nullish(),
		msgid: z.string().nullish(),
		err_msg: z.string().nullish(),
	})
	.loose();

const SmsSendResponseSchema = z.object({
	messages: z.array(MessageResultSchema),
});

export type SmsSendResponse = z.infer<typeof SmsSendResponseSchema>;

// ── sms.status ────────────────────────────────────────────────────────────

const SmsStatusInputSchema = z.object({
	mocean_msgid: z.string().min(1).describe('The msgid from the send response.'),
});

export type SmsStatusInput = z.input<typeof SmsStatusInputSchema>;

const SmsStatusResponseSchema = z
	.object({
		status: BodyStatus,
		// 1 success, 2 failed, 3 expired, 4 pending, 5 not found; kept as a
		// number so an added state cannot fail a read.
		message_status: z.number().nullish(),
		msgid: z.string().nullish(),
		credit_deducted: Amount,
	})
	.loose();

export type SmsStatusResponse = z.infer<typeof SmsStatusResponseSchema>;

// ── account.balance ───────────────────────────────────────────────────────

const BalanceResponseSchema = z
	.object({
		status: BodyStatus,
		value: z.number(),
	})
	.loose();

export type BalanceResponse = z.infer<typeof BalanceResponseSchema>;

// ── account.pricing ───────────────────────────────────────────────────────

const PricingTypeSchema = z.enum(['sms', 'number-lookup', 'verify']);

const AccountPricingInputSchema = z
	.object({
		mocean_mcc: z
			.string()
			.regex(/^\d{1,3}$/, 'A Mobile Country Code of 1-3 digits')
			.optional()
			.describe('Only pricing for this Mobile Country Code; needs mocean_mnc.'),
		mocean_mnc: z
			.string()
			.regex(/^\d{1,4}$/, 'A Mobile Network Code of 1-4 digits')
			.optional()
			.describe('One Mobile Network Code; sent together with mocean_mcc.'),
		mocean_type: PricingTypeSchema.optional().describe("Defaults to 'sms'."),
	})
	.superRefine((value, ctx) => {
		// Mocean answers status 46 (invalid MCC/MNC) to either one alone.
		if ((value.mocean_mnc === undefined) !== (value.mocean_mcc === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'mocean_mcc and mocean_mnc go together',
			});
		}
	});

export type AccountPricingInput = z.input<typeof AccountPricingInputSchema>;

const DestinationSchema = z
	.object({
		country: z.string().nullish(),
		operator: z.string().nullish(),
		mcc: z.string().nullish(),
		mnc: z.string().nullish(),
		price: Amount,
		currency: z.string().nullish(),
	})
	.loose();

const AccountPricingResponseSchema = z
	.object({
		status: BodyStatus.nullish(),
		destinations: z.array(DestinationSchema),
	})
	.loose();

export type AccountPricingResponse = z.infer<
	typeof AccountPricingResponseSchema
>;

// ── verify.request / verify.resend ────────────────────────────────────────

export const MOCEAN_MIN_PIN_VALIDITY_SECONDS = 60;
export const MOCEAN_MAX_PIN_VALIDITY_SECONDS = 3600;

const VerifyRequestInputSchema = z.object({
	mocean_to: z
		.string()
		.min(1)
		.describe('Receiver phone number with country code, e.g. 60123456789.'),
	mocean_brand: z
		.string()
		.min(1)
		.describe(
			'The company or application name shown to the user; the gateway rejects a brand it considers too long (body status 9).',
		),
	mocean_from: z.string().optional().describe('The SMS Sender ID.'),
	mocean_code_length: z
		.union([z.literal(4), z.literal(6)])
		.optional()
		.describe(
			'The verification code length. Defaults to 4 or the account setting.',
		),
	mocean_pin_validity: z
		.number()
		.int()
		.min(MOCEAN_MIN_PIN_VALIDITY_SECONDS)
		.max(MOCEAN_MAX_PIN_VALIDITY_SECONDS)
		.optional()
		.describe(
			`Seconds the code stays valid, ${MOCEAN_MIN_PIN_VALIDITY_SECONDS}-${MOCEAN_MAX_PIN_VALIDITY_SECONDS}. Defaults to 300 or the account setting.`,
		),
});

export type VerifyRequestInput = z.input<typeof VerifyRequestInputSchema>;

const VerifyResponseSchema = z
	.object({
		reqid: z.string().nullish(),
		status: BodyStatus,
		to: z.string().nullish(),
		is_number_reachable: z.string().nullish(),
		resend_number: z.string().nullish(),
	})
	.loose();

export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;

const VerifyResendInputSchema = z.object({
	mocean_reqid: z
		.string()
		.min(1)
		.describe('The reqid of the verify request to resend.'),
});

export type VerifyResendInput = z.input<typeof VerifyResendInputSchema>;

// ── verify.check ──────────────────────────────────────────────────────────

const VerifyCheckInputSchema = z.object({
	mocean_reqid: z.string().min(1).describe('The reqid of the verify request.'),
	mocean_code: z.string().min(1).describe('The PIN the user gave you.'),
});

export type VerifyCheckInput = z.input<typeof VerifyCheckInputSchema>;

const VerifyCheckResponseSchema = z
	.object({
		reqid: z.string().nullish(),
		status: BodyStatus,
	})
	.loose();

export type VerifyCheckResponse = z.infer<typeof VerifyCheckResponseSchema>;

// ── lookup.request ────────────────────────────────────────────────────────

const CarrierSchema = z
	.object({
		country: z.string().nullish(),
		name: z.string().nullish(),
		network_code: z.union([z.string(), z.number()]).nullish(),
		mcc: z.string().nullish(),
		mnc: z.string().nullish(),
	})
	.loose();

const LookupRequestInputSchema = z.object({
	mocean_to: z
		.string()
		.min(1)
		.describe('The phone number to look up, with country code.'),
	mocean_nl_url: z
		.string()
		.url()
		.optional()
		.describe(
			'Callback URL for the async result. Omit it to get the full result synchronously.',
		),
});

export type LookupRequestInput = z.input<typeof LookupRequestInputSchema>;

const LookupResponseSchema = z
	.object({
		status: BodyStatus,
		msgid: z.string().nullish(),
		to: z.string().nullish(),
		current_carrier: CarrierSchema.nullish(),
		original_carrier: CarrierSchema.nullish(),
		// ported | not_ported | unknown, kept as a string so a new value
		// cannot fail a read.
		ported: z.string().nullish(),
	})
	.loose();

export type LookupResponse = z.infer<typeof LookupResponseSchema>;

// ── sms.reportConversion ──────────────────────────────────────────────────

const ConversionInputSchema = z.object({
	mocean_msgid: z.string().min(1).describe('The msgid from the send response.'),
	mocean_delivered: z
		.boolean()
		.describe(
			'true when the user received the message (for example, used the OTP).',
		),
	mocean_timestamp: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
			'Must be yyyy-MM-dd HH:mm:ss',
		)
		.optional()
		.describe('When it happened; defaults to the submission time.'),
});

const StatusOnlySchema = z
	.object({ status: BodyStatus, err_msg: z.string().nullish() })
	.loose();

// ── verify.requestTelegram ────────────────────────────────────────────────

const VerifyTelegramInputSchema = z.object({
	mocean_to: z
		.string()
		.min(1)
		.describe('The Telegram chat ID that gets the code.'),
	mocean_from: z
		.string()
		.min(1)
		.describe('Your Telegram bot username that sends the code.'),
	mocean_brand: z
		.string()
		.min(1)
		.describe('The company or application name shown to the user.'),
	mocean_code_length: z.union([z.literal(4), z.literal(6)]).optional(),
	mocean_pin_validity: z
		.number()
		.int()
		.min(MOCEAN_MIN_PIN_VALIDITY_SECONDS)
		.max(MOCEAN_MAX_PIN_VALIDITY_SECONDS)
		.optional(),
});

// ── voice ─────────────────────────────────────────────────────────────────

const VoiceDialInputSchema = z.object({
	mocean_to: z
		.string()
		.min(1)
		.describe(
			'Number(s) to call with country code, separated by commas or spaces.',
		),
	mocean_command: z
		.array(
			z
				.object({
					action: z
						.string()
						.min(1)
						.describe('say, play, collect, sleep, record or dial'),
				})
				// The action's own fields (language, text, file, max-digits, ...)
				// vary per action; Mocean checks them.
				.loose(),
		)
		.min(1)
		.describe(
			'Mocean Command (MC) objects run in order, e.g. [{ action: "say", language: "en-US", text: "Hello" }].',
		),
	mocean_from: z.string().optional().describe('Caller ID (number of origin).'),
	mocean_event_url: z
		.string()
		.url()
		.optional()
		.describe('Webhook that receives call status events.'),
});

const VoiceDialResponseSchema = z
	.object({
		status: BodyStatus.nullish(),
		calls: z
			.array(
				z
					.object({
						status: BodyStatus,
						receiver: z.string().nullish(),
						session_uuid: z.string().nullish(),
						call_uuid: z.string().nullish(),
						err_msg: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const CallUuidInputSchema = z.object({
	mocean_call_uuid: z
		.string()
		.min(1)
		.describe('The call_uuid from voice.dial.'),
});

const VoiceHangupResponseSchema = z
	.object({
		status: BodyStatus,
		session_uuid: z.string().nullish(),
		call_uuid: z.string().nullish(),
	})
	.loose();

// ── whatsapp ──────────────────────────────────────────────────────────────

const WhatsAppSendInputSchema = z.object({
	mocean_from: z
		.string()
		.min(1)
		.describe('Your registered WhatsApp Business sender number.'),
	mocean_to: z
		.string()
		.min(1)
		.describe(
			'Receiver number with country code, or a Business Scoped User ID.',
		),
	mocean_event_url: z
		.string()
		.url()
		.optional()
		.describe('Webhook that receives delivery events.'),
	mocean_content: z
		.object({
			type: z
				.string()
				.min(1)
				.describe(
					'text, image, video, audio, document, sticker, reaction, template, interactive, location or contacts',
				),
		})
		// Each type has its own fields (text, rich_media_url, wa_template,
		// wa_interactive, location, wa_contacts ...); Mocean checks them.
		.loose()
		.describe('The message, e.g. { type: "text", text: "Hello" }.'),
});

const WhatsAppSendResponseSchema = z
	.object({
		status: BodyStatus,
		message_id: z.string().nullish(),
		err_msg: z.string().nullish(),
	})
	.loose();

const WhatsAppMediaInputSchema = z.object({
	mocean_from: z
		.string()
		.min(1)
		.describe('Your WhatsApp Business sender number that received the media.'),
	mocean_media_id: z
		.string()
		.min(1)
		.describe('The media ID from the inbound message.'),
});

// ── templates (WhatsApp) ──────────────────────────────────────────────────

const TemplateCategory = z.enum(['AUTHENTICATION', 'MARKETING', 'UTILITY']);

const TemplateBody = {
	name: z
		.string()
		.regex(/^[a-z0-9_]+$/, 'Lowercase letters, digits and underscores only')
		.describe('Template name.'),
	language: z.string().min(1).describe('Language code, e.g. en_US.'),
	category: TemplateCategory,
	allowCategoryChange: z
		.boolean()
		.optional()
		.describe('Let Meta pick the category under its guidelines.'),
	message_send_ttl_seconds: z
		.number()
		.int()
		.optional()
		.describe('Time to live of an authentication message, in seconds.'),
	parameter_format: z.enum(['POSITIONAL', 'NAMED']).optional(),
	components: z
		.array(
			z
				.object({
					type: z.string().min(1).describe('HEADER, BODY, FOOTER or BUTTONS'),
				})
				// format, text, example and buttons depend on the component type.
				.loose(),
		)
		.min(1)
		.describe('Header, body, footer and buttons, as in the Meta template API.'),
};

const TemplateSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		language: z.string().nullish(),
		category: z.string().nullish(),
		status: z.string().nullish(),
		// unknown: components follow Meta's template model, which varies per type.
		components: z.array(z.unknown()).nullish(),
	})
	.loose();

const TemplatesListInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	after: z
		.string()
		.optional()
		.describe(
			'paging.cursors.after from the previous page, for the next page.',
		),
	before: z
		.string()
		.optional()
		.describe('paging.cursors.before from a page, for the page before it.'),
	category: TemplateCategory.optional(),
	content: z.string().optional().describe('Search the template text.'),
	language: z.string().optional(),
	name: z.string().optional(),
	name_or_content: z.string().optional(),
	quality_score: z
		.string()
		.optional()
		.describe('GREEN, YELLOW, RED or UNKNOWN'),
	status: z
		.string()
		.optional()
		.describe('Review status: APPROVED, PENDING, REJECTED, ...'),
});

const TemplatesListResponseSchema = z
	.object({
		data: z.array(TemplateSchema).nullish(),
		paging: z
			.object({
				cursors: z
					.object({ before: z.string().nullish(), after: z.string().nullish() })
					.loose()
					.nullish(),
				next: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const TemplateIdInputSchema = z.object({
	templateId: z.string().min(1).describe('The WhatsApp template ID.'),
});

const TemplatesDeleteInputSchema = z.object({
	name: z
		.string()
		.min(1)
		.describe('Template name; deletes every language of it.'),
	hsm_id: z
		.string()
		.optional()
		.describe('Template ID, to delete only that one language.'),
});

const FileSchema = FileOutputSchema;

// ── Registry ──────────────────────────────────────────────────────────────

export const MoceanEndpointInputSchemas = {
	smsSend: SmsSendInputSchema,
	smsStatus: SmsStatusInputSchema,
	smsReportConversion: ConversionInputSchema,
	accountBalance: z.object({}),
	accountPricing: AccountPricingInputSchema,
	verifyRequest: VerifyRequestInputSchema,
	verifyRequestTelegram: VerifyTelegramInputSchema,
	verifyResend: VerifyResendInputSchema,
	verifyCheck: VerifyCheckInputSchema,
	lookupRequest: LookupRequestInputSchema,
	voiceDial: VoiceDialInputSchema,
	voiceHangup: CallUuidInputSchema,
	voiceRecording: CallUuidInputSchema,
	whatsappSend: WhatsAppSendInputSchema,
	whatsappDownloadMedia: WhatsAppMediaInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplateIdInputSchema,
	templatesCreate: z.object(TemplateBody),
	templatesEdit: z.object({
		templateId: TemplateIdInputSchema.shape.templateId,
		...TemplateBody,
	}),
	templatesDelete: TemplatesDeleteInputSchema,
} as const;

export const MoceanEndpointOutputSchemas = {
	smsSend: SmsSendResponseSchema,
	smsStatus: SmsStatusResponseSchema,
	smsReportConversion: StatusOnlySchema,
	accountBalance: BalanceResponseSchema,
	accountPricing: AccountPricingResponseSchema,
	verifyRequest: VerifyResponseSchema,
	verifyRequestTelegram: VerifyResponseSchema,
	verifyResend: VerifyResponseSchema,
	verifyCheck: VerifyCheckResponseSchema,
	lookupRequest: LookupResponseSchema,
	voiceDial: VoiceDialResponseSchema,
	voiceHangup: VoiceHangupResponseSchema,
	voiceRecording: FileSchema,
	whatsappSend: WhatsAppSendResponseSchema,
	whatsappDownloadMedia: FileSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplateSchema,
	templatesCreate: TemplateSchema,
	templatesEdit: TemplateSchema,
	templatesDelete: z
		.object({ success: z.union([z.string(), z.boolean()]).nullish() })
		.loose(),
} as const;

type Ins = typeof MoceanEndpointInputSchemas;
type Outs = typeof MoceanEndpointOutputSchemas;

export type MoceanEndpointInputs = { [K in keyof Ins]: z.input<Ins[K]> };
export type MoceanEndpointOutputs = { [K in keyof Outs]: z.output<Outs[K]> };
