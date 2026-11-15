import { z } from 'zod';

// Source: https://docs.linguapop.eu/api. Only two operations are documented:
// getLanguages and sendInvitation. The docs also describe a result callback
// that Linguapop POSTs to a URL you supply; it carries no signature or secret,
// so it is not wired up as an inbound webhook here. There is no documented
// route to fetch results (GET /api/actions/getResults answers 200 text/html,
// the app's fallback page for a missing route), so none is built.

// ── languages.list ────────────────────────────────────────────────────────

const LanguagesListInputSchema = z.object({});

export type LanguagesListInput = z.input<typeof LanguagesListInputSchema>;

// `code` is not an enum: Linguapop says codes will not change but languages
// will be added, and a new one must not fail the parse. They are Linguapop's
// own codes ("ger" for German, not "deu").
export const LanguageSchema = z
	.object({
		name: z.string().describe('Display name, such as "Italian".'),
		code: z
			.string()
			.describe(
				'Linguapop language code, such as "ita". Pass it as `languageCode` when creating an invitation.',
			),
	})
	.loose();

export type LinguapopLanguage = z.infer<typeof LanguageSchema>;

const LanguagesListResponseSchema = z.array(LanguageSchema);

export type LanguagesListResponse = z.infer<typeof LanguagesListResponseSchema>;

// ── invitations.create ────────────────────────────────────────────────────

// Constraints come from the field list at https://docs.linguapop.eu/api. The
// API key is deliberately not an input: the client reads it from the account
// and writes it into the body, and `.strict()` makes a caller who passes
// `apiKey` fail loudly instead of believing it was used.
// Only http(s) URLs: `returnUrl` becomes a redirect button in the candidate's
// browser, where a `javascript:` URL would run script.
const HttpUrlSchema = z.url({ protocol: /^https?$/ });

const InvitationsCreateInputSchema = z
	.object({
		email: z
			.email()
			.describe(
				"The candidate's email address. Linguapop also uses it to identify the candidate.",
			),
		languageCode: z
			.string()
			.min(1)
			.describe(
				'Linguapop code of the language to test, from `languages.list`.',
			),
		sendEmail: z
			.boolean()
			.describe(
				'Whether Linguapop emails the invitation to the candidate. When false, share the returned `url` yourself.',
			),
		name: z
			.string()
			.min(1)
			.optional()
			.describe(
				"The candidate's name. It appears in Linguapop's example request but not in its field list, and the API does not require it.",
			),
		externalIdentifier: z
			.string()
			.max(500)
			.optional()
			.describe(
				'An ID from your own system to identify the candidate, at most 500 characters. It comes back on the response and the result callback.',
			),
		generateKioskCode: z
			.boolean()
			.optional()
			.describe(
				'Generate and return a kiosk code. A kiosk must already be set up in Linguapop under Customization.',
			),
		testReading: z
			.boolean()
			.optional()
			.describe(
				'Include a reading section. When omitted, the default from Customization applies.',
			),
		testListening: z
			.boolean()
			.optional()
			.describe(
				'Include a listening section. When omitted, the default from Customization applies.',
			),
		callbackUrl: HttpUrlSchema.max(1000)
			.optional()
			.describe(
				'URL Linguapop POSTs the placement test result to once the candidate finishes, at most 1000 characters. The call is unsigned, and this plugin does not receive it.',
			),
		returnUrl: HttpUrlSchema.max(1000)
			.optional()
			.describe(
				'URL the candidate is redirected to from a button on the results screen, at most 1000 characters. Without it the button is hidden.',
			),
	})
	.strict();

export type InvitationsCreateInput = z.input<
	typeof InvitationsCreateInputSchema
>;

// invitationId and url are the fields a caller cannot do without, so they stay
// required. The rest are `.nullish()` because the live suite is unrun (an
// invitation needs a paid plan) and a surprise there must not turn a created,
// billable invitation into a parse error.
const InvitationsCreateResponseSchema = z
	.object({
		invitationId: z
			.number()
			.int()
			.describe('Unique ID of the invitation; keep it to track the test.'),
		url: z
			.string()
			.describe(
				'Direct link to the placement test, the same one the invitation email carries. It holds the invitation token, so treat it as a secret.',
			),
		externalIdentifier: z
			.string()
			.nullish()
			.describe('The externalIdentifier from the request, when one was sent.'),
		emailSent: z
			.boolean()
			.nullish()
			.describe(
				'Whether the invitation email went out; always false when sendEmail was false.',
			),
		kioskCode: z
			.string()
			.nullish()
			.describe('Kiosk code for the candidate; null unless one was requested.'),
	})
	.loose();

export type InvitationsCreateResponse = z.infer<
	typeof InvitationsCreateResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type LinguapopEndpointInputs = {
	languagesList: LanguagesListInput;
	invitationsCreate: InvitationsCreateInput;
};

export type LinguapopEndpointOutputs = {
	languagesList: LanguagesListResponse;
	invitationsCreate: InvitationsCreateResponse;
};

export const LinguapopEndpointInputSchemas = {
	languagesList: LanguagesListInputSchema,
	invitationsCreate: InvitationsCreateInputSchema,
} as const;

export const LinguapopEndpointOutputSchemas = {
	languagesList: LanguagesListResponseSchema,
	invitationsCreate: InvitationsCreateResponseSchema,
} as const;
