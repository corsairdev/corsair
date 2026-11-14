import { z } from 'zod';

// Inputs use the services' own parameter names. Outputs are `.loose()` and their
// fields nullish, so a field a service adds or omits cannot fail a call that has
// already happened. Shapes come from
// https://realphonevalidation.com/api-documentation/ and each service's page.
//
// The services are eleven separate scripts on one host, and they disagree about
// naming. The models follow each script rather than pretending they match:
//
// - Turbo, Turbo Standard, Scrub, Scrub Plus and DNC Plus answer `status` +
//   `error_text`, with the phone type capitalised in some fields.
// - Wireless ID, DNC Lookup, Active and Reassigned Number answer
//   `RESPONSECODE` + `RESPONSEMSG`, in that case.
// - `error_text` and `RESPONSEMSG` are `{}` rather than a string when there is
//   nothing to report, so both are typed to accept either.

/** The body's empty object where a string is expected. */
const EmptyOrTextSchema = z
	.union([z.string(), z.record(z.string(), z.never())])
	.describe('An error string, or {} when there is no error.');

/**
 * A phone number: ten numeric digits, US only, exactly as the docs require.
 *
 * Not normalized from +1 (555) 555-5555 by the plugin: the services reject
 * anything but ten digits, and reformatting a number silently would hide a bad
 * one that the caller should see rejected.
 */
const PhoneSchema = z
	.string()
	.regex(
		/^\d{10}$/,
		'Ten digits, US only, with no punctuation or country code.',
	);

// ── shared connection statuses ────────────────────────────────────────────

/**
 * The status vocabulary Turbo, Turbo Standard, Scrub, Scrub Plus and DNC Plus
 * share. Kept as a string on the output so an unrecognised word still parses.
 */
export const RPV_CONNECTION_STATUSES = [
	'connected',
	'connected-75',
	'pending',
	'disconnected',
	'disconnected-70',
	'busy',
	'unreachable',
	'invalid phone',
	'restricted',
] as const;

/** The three phone types Turbo V3, Turbo Standard and Scrub Plus report. */
export const RPV_PHONE_TYPES = ['Mobile', 'Landline', 'VoIP'] as const;

/** `Iscell` values: Y, N, or V for VoIP on an account that has it enabled. */
export const RPV_ISCELL_VALUES = ['Y', 'N', 'V'] as const;

// ── turboV3 ───────────────────────────────────────────────────────────────

const TurboV3InputSchema = z.object({
	phone: PhoneSchema,
});

export type TurboV3Input = z.infer<typeof TurboV3InputSchema>;

/**
 * The richest answer: connection status plus phone type, caller name, carrier and
 * caller type.
 */
const TurboV3ResponseSchema = z
	.object({
		status: z
			.string()
			.nullish()
			.describe(
				'connected, disconnected, busy, unreachable, invalid phone, restricted, pending, connected-75, disconnected-70.',
			),
		error_text: EmptyOrTextSchema.nullish(),
		phone_type: z.string().nullish().describe('Mobile, Landline or VoIP.'),
		caller_name: z
			.string()
			.nullish()
			.describe('The subscriber name, when the carrier exposes it.'),
		carrier: z.string().nullish(),
		caller_type: z
			.string()
			.nullish()
			.describe('Consumer, Business or Unavailable.'),
	})
	.loose();

export type TurboV3Response = z.infer<typeof TurboV3ResponseSchema>;

// ── turboStandard ─────────────────────────────────────────────────────────

const TurboStandardInputSchema = z.object({
	phone: PhoneSchema,
});

export type TurboStandardInput = z.infer<typeof TurboStandardInputSchema>;

const TurboStandardResponseSchema = z
	.object({
		status: z.string().nullish(),
		error_text: EmptyOrTextSchema.nullish(),
		phone_type: z.string().nullish().describe('Mobile, Landline or VoIP.'),
	})
	.loose();

export type TurboStandardResponse = z.infer<typeof TurboStandardResponseSchema>;

// ── turbo ─────────────────────────────────────────────────────────────────

const TurboInputSchema = z.object({
	phone: PhoneSchema,
});

export type TurboInput = z.infer<typeof TurboInputSchema>;

/**
 * Older than Turbo V3: the same connection status, plus `iscell` and the carrier,
 * but no phone type word or caller name.
 */
const TurboResponseSchema = z
	.object({
		status: z.string().nullish(),
		error_text: EmptyOrTextSchema.nullish(),
		iscell: z
			.string()
			.nullish()
			.describe(
				'Y for a cell phone, N for a landline, V for VoIP when enabled.',
			),
		carrier: z.string().nullish(),
	})
	.loose();

export type TurboResponse = z.infer<typeof TurboResponseSchema>;

// ── scrub ─────────────────────────────────────────────────────────────────

const ScrubInputSchema = z.object({
	phone: PhoneSchema,
});

export type ScrubInput = z.infer<typeof ScrubInputSchema>;

/**
 * The budget option: connection status, and `iscell` and carrier only when the
 * account pays for them. Up to 5% of US numbers may come back as unknown.
 */
const ScrubResponseSchema = z
	.object({
		status: z.string().nullish(),
		error_text: EmptyOrTextSchema.nullish(),
		iscell: z.string().nullish(),
		carrier: z.string().nullish(),
	})
	.loose();

export type ScrubResponse = z.infer<typeof ScrubResponseSchema>;

// ── scrubPlus ─────────────────────────────────────────────────────────────

const ScrubPlusInputSchema = z.object({
	phone: PhoneSchema,
});

export type ScrubPlusInput = z.infer<typeof ScrubPlusInputSchema>;

const ScrubPlusResponseSchema = z
	.object({
		status: z.string().nullish(),
		error_text: EmptyOrTextSchema.nullish(),
		phone_type: z.string().nullish().describe('Mobile, Landline or VoIP.'),
	})
	.loose();

export type ScrubPlusResponse = z.infer<typeof ScrubPlusResponseSchema>;

// ── active ────────────────────────────────────────────────────────────────

const ActiveInputSchema = z.object({
	phone: PhoneSchema,
});

export type ActiveInput = z.infer<typeof ActiveInputSchema>;

/**
 * Whether the number is on a provider that is still in business, which is a
 * different question from whether anyone answers. `L` is an active landline, `C`
 * an active cell, `V` an active VoIP line and `N` inactive.
 */
const ActiveResponseSchema = z
	.object({
		RESPONSECODE: z
			.string()
			.nullish()
			.describe('L active landline, C active cell, V active VoIP, N inactive.'),
		RESPONSEMSG: EmptyOrTextSchema.nullish(),
	})
	.loose();

export type ActiveResponse = z.infer<typeof ActiveResponseSchema>;

// ── wirelessId ────────────────────────────────────────────────────────────

const WirelessIdInputSchema = z.object({
	phone: PhoneSchema,
});

export type WirelessIdInput = z.infer<typeof WirelessIdInputSchema>;

const WirelessIdResponseSchema = z
	.object({
		RESPONSECODE: z
			.string()
			.nullish()
			.describe('landline or cell. Anything else is a refusal.'),
		RESPONSEMSG: EmptyOrTextSchema.nullish(),
	})
	.loose();

export type WirelessIdResponse = z.infer<typeof WirelessIdResponseSchema>;

// ── dncLookup ─────────────────────────────────────────────────────────────

const DncLookupInputSchema = z.object({
	phone: PhoneSchema,
});

export type DncLookupInput = z.infer<typeof DncLookupInputSchema>;

/**
 * A `Y`, `N` or `?` on four lists. `?` means the lookup timed out or the number
 * could not be checked against that list, so it is not a "no": treat it as
 * unknown rather than cleared.
 */
const DncFlagSchema = z
	.string()
	.nullish()
	.describe(
		'Y is on the list, N is not, ? means a timeout or an unchecked list. Treat ? as unknown, not as cleared.',
	);

const DncLookupResponseSchema = z
	.object({
		RESPONSECODE: z
			.string()
			.nullish()
			.describe('OK, or -1, 102 or invalid-phone for a refusal.'),
		RESPONSEMSG: EmptyOrTextSchema.nullish(),
		national_dnc: DncFlagSchema,
		state_dnc: DncFlagSchema,
		dma: DncFlagSchema,
		litigator: z
			.string()
			.nullish()
			.describe('Y, N or ? for a known TCPA litigator or serial plaintiff.'),
		iscell: z.string().nullish().describe('Y cell, N landline, V VoIP.'),
		id: z.string().nullish().describe('An internal identifier.'),
	})
	.loose();

export type DncLookupResponse = z.infer<typeof DncLookupResponseSchema>;

// ── dncPlus ───────────────────────────────────────────────────────────────

const DncPlusInputSchema = z.object({
	phone: PhoneSchema,
});

export type DncPlusInput = z.infer<typeof DncPlusInputSchema>;

/** The DNC lists plus the connection status, in the lowercase style. */
const DncPlusResponseSchema = z
	.object({
		status: z.string().nullish(),
		error_text: EmptyOrTextSchema.nullish(),
		iscell: z.string().nullish(),
		national_dnc: DncFlagSchema,
		state_dnc: DncFlagSchema,
		dma: DncFlagSchema,
		litigator: DncFlagSchema,
	})
	.loose();

export type DncPlusResponse = z.infer<typeof DncPlusResponseSchema>;

// ── fraudCheck ────────────────────────────────────────────────────────────

const FraudCheckInputSchema = z.object({
	phone: PhoneSchema,
});

export type FraudCheckInput = z.infer<typeof FraudCheckInputSchema>;

const FraudLocationSchema = z
	.object({
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		country_name: z.string().nullish(),
		country_iso2: z.string().nullish(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		time_zone: z.string().nullish(),
	})
	.loose();

/**
 * A risk score from 0 to 1000 with a recommended action. Most fields are numeric
 * strings, because the service serialises its upstream telephony data as-is, so
 * they are typed as strings rather than parsed: a caller comparing them should
 * convert them, and silently converting here would hide a non-numeric value.
 */
const FraudCheckResponseSchema = z
	.object({
		status: z.string().nullish().describe('"0" on success.'),
		error_text: EmptyOrTextSchema.nullish(),
		id: z.string().nullish(),
		req_phone: z.string().nullish().describe('The number as submitted.'),
		tstatus: z
			.string()
			.nullish()
			.describe(
				'The lookup outcome: 300 completed, 301 partly completed (some fields empty), 500 not attempted (no score or risk fields), 501 the number does not exist, 599 contact support.',
			),
		tdesc: z.string().nullish().describe('The tstatus in words.'),
		phn_type: z.string().nullish().describe('A numeric code; see phn_desc.'),
		phn_desc: z
			.string()
			.nullish()
			.describe('LANDLINE, VOIP, WIRELESS and so on.'),
		risk_level: z.string().nullish().describe('low, medium or high.'),
		recommendation: z
			.string()
			.nullish()
			.describe('What the score suggests, such as allow, flag or block.'),
		score: z
			.string()
			.nullish()
			.describe('A numeric string from 0 to 1000; higher is riskier.'),
		carrier: z.string().nullish(),
		location_city: z.string().nullish(),
		location_state: z.string().nullish(),
		location_zip: z.string().nullish(),
		location_country_name: z.string().nullish(),
		location_country_iso2: z.string().nullish(),
		location_country_iso3: z.string().nullish(),
		location_latitude: z.string().nullish(),
		location_longitude: z.string().nullish(),
		location_time_zone: z.string().nullish(),
		numbering_original_complete_phone_number: z.string().nullish(),
		numbering_original_country_code: z.string().nullish(),
		numbering_original_phone_number: z.string().nullish(),
	})
	.loose();

export type FraudCheckResponse = z.infer<typeof FraudCheckResponseSchema>;

// ── reassigned ────────────────────────────────────────────────────────────

const ReassignedInputSchema = z.object({
	phone: PhoneSchema,
	contact_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.describe(
			'YYYY-MM-DD, the date consent to contact was given. A number reassigned after it must not be contacted.',
		),
});

export type ReassignedInput = z.infer<typeof ReassignedInputSchema>;

const ReassignedResponseSchema = z
	.object({
		RESPONSECODE: z.string().nullish().describe('OK, or -1 for a problem.'),
		RESPONSEMSG: EmptyOrTextSchema.nullish(),
		reassigned: z
			.string()
			.nullish()
			.describe(
				'yes, no, no_data or undetermined. no_data means the carriers recorded no change since 27 January 2021, not that the number is safe to call.',
			),
		id: z.string().nullish().describe('-1 on an error.'),
	})
	.loose();

export type ReassignedResponse = z.infer<typeof ReassignedResponseSchema>;

// ── emailVerify ───────────────────────────────────────────────────────────

const EmailVerifyInputSchema = z.object({
	email: z.string().min(1).describe('The address to verify.'),
});

export type EmailVerifyInput = z.infer<typeof EmailVerifyInputSchema>;

const EmailVerifyResponseSchema = z
	.object({
		retval: z
			.string()
			.nullish()
			.describe('"0" for a good answer, "-1" when the request failed.'),
		error_text: EmptyOrTextSchema.nullish(),
		error_code: EmptyOrTextSchema.nullish(),
		error: EmptyOrTextSchema.nullish(),
		id: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe('valid, invalid, unknown or accept_all.'),
		connected: z
			.string()
			.nullish()
			.describe(
				'Y or N: the address is connected to an active online network.',
			),
		disposable: z
			.string()
			.nullish()
			.describe('Y or N: a disposable email provider.'),
	})
	.loose();

export type EmailVerifyResponse = z.infer<typeof EmailVerifyResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RealPhoneValidationEndpointInputs = {
	turboV3: TurboV3Input;
	turboStandard: TurboStandardInput;
	turbo: TurboInput;
	scrub: ScrubInput;
	scrubPlus: ScrubPlusInput;
	active: ActiveInput;
	wirelessId: WirelessIdInput;
	dncLookup: DncLookupInput;
	dncPlus: DncPlusInput;
	fraudCheck: FraudCheckInput;
	reassigned: ReassignedInput;
	emailVerify: EmailVerifyInput;
};

export type RealPhoneValidationEndpointOutputs = {
	turboV3: TurboV3Response;
	turboStandard: TurboStandardResponse;
	turbo: TurboResponse;
	scrub: ScrubResponse;
	scrubPlus: ScrubPlusResponse;
	active: ActiveResponse;
	wirelessId: WirelessIdResponse;
	dncLookup: DncLookupResponse;
	dncPlus: DncPlusResponse;
	fraudCheck: FraudCheckResponse;
	reassigned: ReassignedResponse;
	emailVerify: EmailVerifyResponse;
};

export const RealPhoneValidationEndpointInputSchemas = {
	turboV3: TurboV3InputSchema,
	turboStandard: TurboStandardInputSchema,
	turbo: TurboInputSchema,
	scrub: ScrubInputSchema,
	scrubPlus: ScrubPlusInputSchema,
	active: ActiveInputSchema,
	wirelessId: WirelessIdInputSchema,
	dncLookup: DncLookupInputSchema,
	dncPlus: DncPlusInputSchema,
	fraudCheck: FraudCheckInputSchema,
	reassigned: ReassignedInputSchema,
	emailVerify: EmailVerifyInputSchema,
} as const;

export const RealPhoneValidationEndpointOutputSchemas = {
	turboV3: TurboV3ResponseSchema,
	turboStandard: TurboStandardResponseSchema,
	turbo: TurboResponseSchema,
	scrub: ScrubResponseSchema,
	scrubPlus: ScrubPlusResponseSchema,
	active: ActiveResponseSchema,
	wirelessId: WirelessIdResponseSchema,
	dncLookup: DncLookupResponseSchema,
	dncPlus: DncPlusResponseSchema,
	fraudCheck: FraudCheckResponseSchema,
	reassigned: ReassignedResponseSchema,
	emailVerify: EmailVerifyResponseSchema,
} as const;
