import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';
import type { FreshBooksContext } from '../index';

// FreshBooks posts to every verified webhook callback (callbacks.create, then
// callbacks.verify) a form-urlencoded body: `name` (the event, invoice.create),
// `object_id`, `account_id`, `business_id`, `identity_id` and the deprecated
// `user_id` (freshbooks.com/api/webhooks). Each delivery carries
// X-FreshBooks-Hmac-SHA256: base64 of HMAC-SHA256 keyed with the callback's
// verifier over the form fields written the way Python's json.dumps writes a
// dict: `{"name": "invoice.create", "object_id": "1234"}` (every value a
// string, a space after each `:` and `,`, non-ASCII as \uXXXX).
//
// The first delivery after callbacks.create is `callback.verify`, which
// carries the verifier itself and no signature: there is no secret yet. The
// plugin hands it over unsigned so the caller can send it back with
// callbacks.verify and store it as the webhook secret.

const NOUNS = {
	bill: ['create', 'update', 'delete'],
	billVendor: ['create', 'update', 'delete'],
	category: ['create', 'update', 'delete'],
	client: ['create', 'update', 'delete'],
	creditNote: ['create', 'update', 'delete'],
	estimate: ['create', 'update', 'delete', 'sendByEmail'],
	expense: ['create', 'update', 'delete'],
	invoice: ['create', 'update', 'delete', 'sendByEmail'],
	item: ['create', 'update', 'delete'],
	payment: ['create', 'update', 'delete'],
	project: ['create', 'update', 'delete'],
	recurring: ['create', 'update', 'delete'],
	service: ['create', 'update', 'delete'],
	tax: ['create', 'update', 'delete'],
	timeEntry: ['create', 'update', 'delete'],
} as const;

/** FreshBooks' noun for each group (bill_vendor, credit_note, time_entry). */
function wireNoun(noun: string): string {
	return noun.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

const EVENT_NAMES = [
	'callback.verify',
	...Object.entries(NOUNS).flatMap(([noun, verbs]) =>
		verbs.map((verb) => `${wireNoun(noun)}.${verb}`),
	),
] as [string, ...string[]];

export const FreshBooksWebhookEventNameSchema = z.enum(EVENT_NAMES);
export type FreshBooksWebhookEventName = z.infer<
	typeof FreshBooksWebhookEventNameSchema
>;

/** A delivery's fields. Every value arrives as text. */
const EventSchema = z
	.object({
		name: z.string().describe('The event, like invoice.create.'),
		object_id: z
			.string()
			.describe(
				'The id of the object the event is about (for callback.verify: the callback id).',
			),
		account_id: z
			.string()
			.optional()
			.describe('The accounting account id (accounting resources).'),
		business_id: z
			.string()
			.optional()
			.describe('The business id (projects, time entries, services).'),
		identity_id: z
			.string()
			.optional()
			.describe('The FreshBooks user who made the change.'),
		user_id: z.string().optional().describe('Deprecated (FreshBooks Classic).'),
	})
	.passthrough();

const VerifySchema = EventSchema.extend({
	verifier: z
		.string()
		.describe(
			'The verification code. Send it back with callbacks.verify; it is also the secret that signs later deliveries, so keep it out of logs.',
		),
});

export type FreshBooksWebhookEvent = z.infer<typeof EventSchema> & {
	verifier?: string;
};

function header(
	headers: RawWebhookRequest['headers'],
	name: string,
): string | undefined {
	const value = Object.entries(headers).find(
		([key]) => key.toLowerCase() === name,
	)?.[1];
	return Array.isArray(value) ? value[0] : value;
}

/** The form fields in the order they arrived (the signature depends on it). */
export function freshbooksFormFields(
	request: RawWebhookRequest | WebhookRequest<unknown>,
): Array<[string, string]> {
	const raw =
		'rawBody' in request && typeof request.rawBody === 'string'
			? request.rawBody
			: typeof (request as RawWebhookRequest).body === 'string'
				? ((request as RawWebhookRequest).body as string)
				: undefined;
	const seen = new Set<string>();
	const out: Array<[string, string]> = [];
	const add = (key: string, value: unknown) => {
		if (seen.has(key)) return;
		seen.add(key);
		out.push([key, String(value)]);
	};
	if (raw !== undefined) {
		const text = raw.trim();
		if (text.startsWith('{')) {
			try {
				for (const [k, v] of Object.entries(JSON.parse(text))) add(k, v);
				return out;
			} catch {
				return [];
			}
		}
		for (const [k, v] of new URLSearchParams(text)) add(k, v);
		return out;
	}
	const body =
		'payload' in request
			? (request as WebhookRequest<unknown>).payload
			: (request as RawWebhookRequest).body;
	if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
		for (const [k, v] of Object.entries(body)) {
			add(k, Array.isArray(v) ? v[0] : v);
		}
	}
	return out;
}

/** A string the way Python's json.dumps writes it (ensure_ascii). */
function pythonJsonString(value: string): string {
	let out = '"';
	for (let i = 0; i < value.length; i++) {
		const code = value.charCodeAt(i);
		const ch = value[i] as string;
		if (ch === '"') out += '\\"';
		else if (ch === '\\') out += '\\\\';
		else if (ch === '\n') out += '\\n';
		else if (ch === '\r') out += '\\r';
		else if (ch === '\t') out += '\\t';
		else if (ch === '\b') out += '\\b';
		else if (ch === '\f') out += '\\f';
		else if (code < 0x20 || code > 0x7e) {
			out += `\\u${code.toString(16).padStart(4, '0')}`;
		} else out += ch;
	}
	return `${out}"`;
}

/** The text FreshBooks signs: the fields as Python's json.dumps writes a dict. */
export function freshbooksSignedText(fields: Array<[string, string]>): string {
	return `{${fields
		.map(([k, v]) => `${pythonJsonString(k)}: ${pythonJsonString(v)}`)
		.join(', ')}}`;
}

/** Compares X-FreshBooks-Hmac-SHA256 with the signature computed from the verifier, in constant time. */
export function verifyFreshBooksSignature(
	request: RawWebhookRequest | WebhookRequest<unknown>,
	secret: string,
): boolean {
	const supplied = header(request.headers, 'x-freshbooks-hmac-sha256');
	// FreshBooks gives every callback its own verifier, and one URL usually takes
	// several callbacks (one per event or noun): the secret may list them all,
	// separated by commas or whitespace.
	const verifiers = secret.split(/[\s,]+/).filter(Boolean);
	if (!supplied || verifiers.length === 0) return false;
	const fields = freshbooksFormFields(request);
	if (fields.length === 0) return false;
	const text = freshbooksSignedText(fields);
	const given = Buffer.from(supplied.trim(), 'base64');
	let ok = false;
	for (const verifier of verifiers) {
		const expected = createHmac('sha256', verifier)
			.update(text, 'utf8')
			.digest();
		if (given.length === expected.length && timingSafeEqual(given, expected)) {
			ok = true;
		}
	}
	return ok;
}

/** The event a FreshBooks delivery carries, if it is one. */
export function freshbooksEventName(
	request: RawWebhookRequest,
): FreshBooksWebhookEventName | undefined {
	const fields = new Map(freshbooksFormFields(request));
	const parsed = FreshBooksWebhookEventNameSchema.safeParse(fields.get('name'));
	if (!parsed.success || !fields.has('object_id')) return undefined;
	if (parsed.data === 'callback.verify') {
		return fields.has('verifier') ? parsed.data : undefined;
	}
	return header(request.headers, 'x-freshbooks-hmac-sha256')
		? parsed.data
		: undefined;
}

export function matchFreshBooksWebhook(request: RawWebhookRequest): boolean {
	return freshbooksEventName(request) !== undefined;
}

function webhookFor(
	name: FreshBooksWebhookEventName,
): CorsairWebhook<
	FreshBooksContext,
	FreshBooksWebhookEvent,
	FreshBooksWebhookEvent
> {
	const signed = name !== 'callback.verify';
	const schema = signed ? EventSchema : VerifySchema;
	return {
		match: (request) => freshbooksEventName(request) === name,
		handler: async (ctx, request) => {
			if (
				signed &&
				request.hubVerified !== true &&
				!verifyFreshBooksSignature(request, ctx.key ?? '')
			) {
				return {
					success: false,
					statusCode: 401,
					error: ctx.key
						? 'Invalid webhook signature'
						: 'No webhook secret: store the callback verifier as the webhook secret',
				};
			}
			// Parse the signed fields, not a separately parsed payload.
			const parsed = schema.safeParse(
				Object.fromEntries(freshbooksFormFields(request)),
			);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: 'Invalid webhook payload',
				};
			}
			return { success: true, data: parsed.data as FreshBooksWebhookEvent };
		},
	};
}

function describe(name: string): string {
	if (name === 'callback.verify') {
		return 'FreshBooks sent the verification code of a new webhook callback (callback.verify, unsigned). Send `verifier` back with callbacks.verify and keep it as the webhook secret.';
	}
	const [noun, verb] = name.split('.') as [string, string];
	const what =
		noun === 'recurring'
			? 'recurring invoice profile'
			: noun.replace(/_/g, ' ');
	const action =
		verb === 'sendByEmail'
			? 'was sent by email'
			: `was ${verb === 'create' ? 'created' : `${verb}d`}`;
	return `A ${what} ${action} (${name}). The body names the object by object_id; read it with the matching get operation.`;
}

const nested: Record<string, Record<string, ReturnType<typeof webhookFor>>> = {
	callback: { verify: webhookFor('callback.verify') },
};
const schemas: Record<
	string,
	{ description: string; payload: z.ZodType; response: z.ZodType }
> = {
	'callback.verify': {
		description: describe('callback.verify'),
		payload: VerifySchema,
		response: VerifySchema,
	},
};
for (const [noun, verbs] of Object.entries(NOUNS)) {
	for (const verb of verbs) {
		const event = `${wireNoun(noun)}.${verb}` as FreshBooksWebhookEventName;
		nested[noun] = { ...nested[noun], [verb]: webhookFor(event) };
		schemas[`${noun}.${verb}`] = {
			description: describe(event),
			payload: EventSchema,
			response: EventSchema,
		};
	}
}

type Verbs<N extends keyof typeof NOUNS> = (typeof NOUNS)[N][number];

export const freshbooksWebhooksNested = nested as {
	callback: { verify: ReturnType<typeof webhookFor> };
} & {
	[N in keyof typeof NOUNS]: {
		[V in Verbs<N>]: ReturnType<typeof webhookFor>;
	};
};

export const freshbooksWebhookSchemas = schemas;
