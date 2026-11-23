import { z } from 'zod';

// Inputs use Mocean's own `mocean-*` parameter names, so a form field maps one
// to one. Outputs are `.loose()` and their documented fields nullish, so a
// field Mocean adds or omits cannot fail a call that has already happened.
// Source: https://moceanapi.com/docs

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
		status: z.number(),
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
		status: z.number(),
		// 1 success, 2 failed, 3 expired, 4 pending, 5 not found; kept as a
		// number so an added state cannot fail a read.
		message_status: z.number(),
		msgid: z.string().nullish(),
		credit_deducted: z.string().nullish(),
	})
	.loose();

export type SmsStatusResponse = z.infer<typeof SmsStatusResponseSchema>;

// ── account.balance ───────────────────────────────────────────────────────

const BalanceResponseSchema = z
	.object({
		status: z.number(),
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
			.describe('Only pricing for this Mobile Country Code.'),
		mocean_mnc: z
			.string()
			.regex(/^\d{1,4}$/, 'A Mobile Network Code of 1-4 digits')
			.optional()
			.describe('One Mobile Network Code; needs mocean_mcc.'),
		mocean_type: PricingTypeSchema.optional().describe("Defaults to 'sms'."),
	})
	.superRefine((value, ctx) => {
		if (value.mocean_mnc !== undefined && value.mocean_mcc === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'mocean_mnc needs mocean_mcc',
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
		price: z.string().nullish(),
		currency: z.string().nullish(),
	})
	.loose();

const AccountPricingResponseSchema = z
	.object({
		status: z.number().nullish(),
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
		status: z.number(),
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
		status: z.number(),
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
		status: z.number(),
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

// ── Registry ──────────────────────────────────────────────────────────────

export type MoceanEndpointInputs = {
	smsSend: SmsSendInput;
	smsStatus: SmsStatusInput;
	accountBalance: Record<string, never>;
	accountPricing: AccountPricingInput;
	verifyRequest: VerifyRequestInput;
	verifyResend: VerifyResendInput;
	verifyCheck: VerifyCheckInput;
	lookupRequest: LookupRequestInput;
};

export type MoceanEndpointOutputs = {
	smsSend: SmsSendResponse;
	smsStatus: SmsStatusResponse;
	accountBalance: BalanceResponse;
	accountPricing: AccountPricingResponse;
	verifyRequest: VerifyResponse;
	verifyResend: VerifyResponse;
	verifyCheck: VerifyCheckResponse;
	lookupRequest: LookupResponse;
};

export const MoceanEndpointInputSchemas = {
	smsSend: SmsSendInputSchema,
	smsStatus: SmsStatusInputSchema,
	accountBalance: z.object({}).loose(),
	accountPricing: AccountPricingInputSchema,
	verifyRequest: VerifyRequestInputSchema,
	verifyResend: VerifyResendInputSchema,
	verifyCheck: VerifyCheckInputSchema,
	lookupRequest: LookupRequestInputSchema,
} as const;

export const MoceanEndpointOutputSchemas = {
	smsSend: SmsSendResponseSchema,
	smsStatus: SmsStatusResponseSchema,
	accountBalance: BalanceResponseSchema,
	accountPricing: AccountPricingResponseSchema,
	verifyRequest: VerifyResponseSchema,
	verifyResend: VerifyResponseSchema,
	verifyCheck: VerifyCheckResponseSchema,
	lookupRequest: LookupResponseSchema,
} as const;
