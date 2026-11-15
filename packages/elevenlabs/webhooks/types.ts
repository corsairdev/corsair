import crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// Every event keeps only `type` as required and allows any extra field, so a
// field ElevenLabs adds never refuses a signed delivery.

// unknown: free-form provider objects (telephony metadata, analysis...) passed on as sent.
const JsonObjectSchema = z.record(z.string(), z.unknown());

const CommonEventFields = {
	event_timestamp: z
		.union([z.number(), z.string()])
		.nullish()
		.describe('When the event happened, in Unix time.'),
};

export const PostCallTranscriptionEventSchema = z
	.object({
		type: z.literal('post_call_transcription'),
		...CommonEventFields,
		data: z
			.object({
				agent_id: z.string().nullish(),
				conversation_id: z.string().nullish(),
				status: z.string().nullish(),
				// unknown: transcript turns carry tool calls and metrics that differ by agent.
				transcript: z.array(z.record(z.string(), z.unknown())).nullish(),
				metadata: JsonObjectSchema.nullish(),
				analysis: JsonObjectSchema.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type PostCallTranscriptionEvent = z.infer<
	typeof PostCallTranscriptionEventSchema
>;

export const PostCallAudioEventSchema = z
	.object({
		type: z.literal('post_call_audio'),
		...CommonEventFields,
		data: z
			.object({
				agent_id: z.string().nullish(),
				conversation_id: z.string().nullish(),
				full_audio: z
					.string()
					.nullish()
					.describe('The whole conversation as base64-encoded MP3.'),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type PostCallAudioEvent = z.infer<typeof PostCallAudioEventSchema>;

export const CallInitiationFailureEventSchema = z
	.object({
		type: z.literal('call_initiation_failure'),
		...CommonEventFields,
		data: z
			.object({
				agent_id: z.string().nullish(),
				conversation_id: z.string().nullish(),
				failure_reason: z
					.string()
					.nullish()
					.describe('busy, no-answer or unknown.'),
				metadata: JsonObjectSchema.nullish().describe(
					'What the telephony provider said (type sip or twilio, plus body).',
				),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type CallInitiationFailureEvent = z.infer<
	typeof CallInitiationFailureEventSchema
>;

export const SpeechToTextTranscriptionEventSchema = z
	.object({
		type: z.literal('speech_to_text_transcription'),
		...CommonEventFields,
		data: z
			.object({
				request_id: z
					.string()
					.nullish()
					.describe('The request_id speechToText.convert returned.'),
				webhook_metadata: z
					.union([JsonObjectSchema, z.string()])
					.nullish()
					.describe('What was passed as webhookMetadata.'),
				transcription: z
					.object({
						language_code: z.string().nullish(),
						language_probability: z.number().nullish(),
						text: z.string().nullish(),
						// unknown: word entries carry timing and speaker fields that differ by request options.
						words: z.array(z.record(z.string(), z.unknown())).nullish(),
						transcription_id: z.string().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type SpeechToTextTranscriptionEvent = z.infer<
	typeof SpeechToTextTranscriptionEventSchema
>;

/** A failed asynchronous transcription. It has no `data`; the fields are top-level. */
export const SpeechToTextFailedEventSchema = z
	.object({
		type: z.literal('webhook_error'),
		...CommonEventFields,
		request_id: z
			.string()
			.nullish()
			.describe('The request_id speechToText.convert returned.'),
		error_message: z.string().nullish(),
		webhook_metadata: z.union([JsonObjectSchema, z.string()]).nullish(),
	})
	.loose();
export type SpeechToTextFailedEvent = z.infer<
	typeof SpeechToTextFailedEventSchema
>;

// ElevenLabs lists the voice library events by name but documents no fields.
const voiceEventSchema = <T extends string>(type: T) =>
	z
		.object({
			type: z.literal(type),
			...CommonEventFields,
			data: JsonObjectSchema.nullish(),
		})
		.loose();

export const VoiceRemovalNoticeEventSchema = voiceEventSchema(
	'voice_removal_notice',
);
export type VoiceRemovalNoticeEvent = z.infer<
	typeof VoiceRemovalNoticeEventSchema
>;

export const VoiceRemovalNoticeWithdrawnEventSchema = voiceEventSchema(
	'voice_removal_notice_withdrawn',
);
export type VoiceRemovalNoticeWithdrawnEvent = z.infer<
	typeof VoiceRemovalNoticeWithdrawnEventSchema
>;

export const VoiceRemovedEventSchema = voiceEventSchema('voice_removed');
export type VoiceRemovedEvent = z.infer<typeof VoiceRemovedEventSchema>;

export type ElevenLabsWebhookOutputs = {
	postCallTranscription: PostCallTranscriptionEvent;
	postCallAudio: PostCallAudioEvent;
	callInitiationFailure: CallInitiationFailureEvent;
	transcriptionCompleted: SpeechToTextTranscriptionEvent;
	transcriptionFailed: SpeechToTextFailedEvent;
	voiceRemovalNotice: VoiceRemovalNoticeEvent;
	voiceRemovalNoticeWithdrawn: VoiceRemovalNoticeWithdrawnEvent;
	voiceRemoved: VoiceRemovedEvent;
};

// ── Matching ────────────────────────────────────────────────────────────────

export const ELEVENLABS_SIGNATURE_HEADER = 'elevenlabs-signature';

export function headerValue(
	headers: Record<string, string | string[] | undefined> | undefined,
	name: string,
): string | undefined {
	if (!headers) return undefined;
	const found =
		headers[name] ??
		Object.entries(headers).find(
			([key]) => key.toLowerCase() === name.toLowerCase(),
		)?.[1];
	const value = Array.isArray(found) ? found[0] : found;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: a webhook body arrives as a string or already-parsed JSON of any shape.
function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			return parseBody(JSON.parse(body));
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? // unknown: narrowed to an object above; callers read fields one by one.
			(body as Record<string, unknown>)
		: null;
}

/** Every ElevenLabs delivery carries the signature header. */
export function isElevenLabsWebhook(request: RawWebhookRequest): boolean {
	return (
		headerValue(
			request.headers as Record<string, string | string[] | undefined>,
			ELEVENLABS_SIGNATURE_HEADER,
		) !== undefined
	);
}

/** The plugin-level matcher already checked the header, except when Hub routed the delivery. */
export function matchEventType(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) =>
		parseBody(request.body)?.type === eventType;
}

// ── Signature ───────────────────────────────────────────────────────────────

/** The tolerance ElevenLabs' own SDKs use for `t=`. */
export const ELEVENLABS_SIGNATURE_TOLERANCE_MS = 30 * 60 * 1000;

/**
 * A delivery this plugin won't accept. It's thrown rather than returned, because
 * processWebhook acknowledges anything a handler returns. Thrown, it comes back as
 * `response.success: false`, the HTTP handler answers non-2xx, no after hook runs
 * and ElevenLabs can retry.
 */
export class ElevenLabsWebhookRefusedError extends Error {
	constructor(
		message: string,
		public readonly statusCode: 400 | 401,
	) {
		super(message);
		this.name = 'ElevenLabsWebhookRefusedError';
	}
}

export type ElevenLabsVerifyOptions = {
	/** Current time in ms, for tests. */
	now?: number;
};

/**
 * Checks `ElevenLabs-Signature: t=<unix seconds>,v0=<hex>`, an HMAC-SHA256 of
 * `<t>.<raw body>` with the webhook's secret. It needs the exact bytes that were
 * sent, so hand processWebhook `await request.text()`, not parsed JSON. Refuses
 * when no secret is configured.
 */
export function verifyElevenLabsWebhookSignature(
	// unknown: the payload is generic at this layer; only headers and rawBody are read.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	options: ElevenLabsVerifyOptions = {},
): { valid: boolean; error?: string } {
	if (request.hubVerified === true) return { valid: true };

	if (!secret) {
		return {
			valid: false,
			error: 'No ElevenLabs webhook secret is configured',
		};
	}
	if (!request.rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}
	const header = headerValue(request.headers, ELEVENLABS_SIGNATURE_HEADER);
	if (!header) {
		return { valid: false, error: 'Missing ElevenLabs-Signature header' };
	}

	const parts = header.split(',').map((part) => part.trim());
	const timestamp = parts
		.find((part) => part.startsWith('t='))
		?.slice('t='.length);
	const signatures = parts
		.filter((part) => part.startsWith('v0='))
		.map((part) => part.slice('v0='.length));
	if (!timestamp || !/^\d+$/.test(timestamp) || signatures.length === 0) {
		return { valid: false, error: 'Malformed ElevenLabs-Signature header' };
	}

	const now = options.now ?? Date.now();
	const age = Math.abs(now - Number(timestamp) * 1000);
	if (age > ELEVENLABS_SIGNATURE_TOLERANCE_MS) {
		return {
			valid: false,
			error: 'ElevenLabs webhook timestamp is outside the 30 minute tolerance',
		};
	}

	const expected = crypto
		.createHmac('sha256', secret)
		.update(`${timestamp}.${request.rawBody}`, 'utf8')
		.digest();
	const matches = signatures.some((signature) => {
		if (!/^[0-9a-fA-F]+$/.test(signature)) return false;
		const given = Buffer.from(signature, 'hex');
		return (
			given.length === expected.length &&
			crypto.timingSafeEqual(given, expected)
		);
	});
	return matches
		? { valid: true }
		: { valid: false, error: 'Invalid ElevenLabs webhook signature' };
}
