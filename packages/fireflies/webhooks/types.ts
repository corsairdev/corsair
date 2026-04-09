import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

export const FirefliesWebhookPayloadSchema = z.object({
	meetingId: z.string(),
	clientReferenceId: z.string().nullable().optional(),
	eventType: z.string(),
});

export interface FirefliesWebhookPayload {
	meetingId: string;
	clientReferenceId?: string | null;
	eventType: string;
}

export const TranscriptionCompletePayloadSchema =
	FirefliesWebhookPayloadSchema.extend({
		eventType: z.literal('Transcription'),
	});
export interface TranscriptionCompleteEvent extends FirefliesWebhookPayload {
	eventType: 'Transcription';
}

export const TranscriptProcessingPayloadSchema =
	FirefliesWebhookPayloadSchema.extend({
		eventType: z.literal('TranscriptProcessing'),
	});
export interface TranscriptProcessingEvent extends FirefliesWebhookPayload {
	eventType: 'TranscriptProcessing';
}

export const NewMeetingPayloadSchema = FirefliesWebhookPayloadSchema.extend({
	eventType: z.literal('NewMeeting'),
});
export interface NewMeetingEvent extends FirefliesWebhookPayload {
	eventType: 'NewMeeting';
}

export const InMeetingPayloadSchema = FirefliesWebhookPayloadSchema.extend({
	eventType: z.literal('InMeeting'),
});
export interface InMeetingEvent extends FirefliesWebhookPayload {
	eventType: 'InMeeting';
}

export const MeetingDeletedPayloadSchema = FirefliesWebhookPayloadSchema.extend(
	{
		eventType: z.literal('MeetingDeleted'),
	},
);
export interface MeetingDeletedEvent extends FirefliesWebhookPayload {
	eventType: 'MeetingDeleted';
}

export type FirefliesWebhookOutputs = {
	transcriptionComplete: TranscriptionCompleteEvent;
	transcriptProcessing: TranscriptProcessingEvent;
	newMeeting: NewMeetingEvent;
	inMeeting: InMeetingEvent;
	meetingDeleted: MeetingDeletedEvent;
};

// unknown: webhook body arrives as string | object | undefined at runtime; return is unknown until narrowed
function parseBody(body: unknown): unknown {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body);
		} catch {
			return {};
		}
	}
	return body ?? {};
}

export function createFirefliesMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// as Record<string, unknown>: parseBody always returns a plain object after parsing; eventType is read as unknown and compared by value
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return parsedBody.eventType === eventType;
	};
}

export function verifyFirefliesWebhookSignature(
	request: {
		rawBody?: string;
		payload: FirefliesWebhookPayload;
		headers: Record<string, string | string[] | undefined>;
	},
	secret: string,
): { valid: boolean; error?: string } {
	const signatureHeader = request.headers['x-fireflies-signature'];
	if (!signatureHeader) {
		return { valid: false, error: 'Missing x-fireflies-signature header' };
	}
	const signature = Array.isArray(signatureHeader)
		? signatureHeader[0]
		: signatureHeader;
	if (!signature) {
		return { valid: false, error: 'Empty signature header' };
	}
	const body = request.rawBody ?? JSON.stringify(request.payload);
	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(body)
		.digest('hex');
	try {
		const isValid = crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
		return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
	} catch {
		return { valid: false, error: 'Signature comparison failed' };
	}
}
