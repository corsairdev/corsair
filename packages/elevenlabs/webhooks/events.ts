import type { CorsairWebhook } from 'corsair/core';
import type { z } from 'zod';
import { logQuietly } from '../client';
import type { ElevenLabsContext } from '../index';
import {
	CallInitiationFailureEventSchema,
	ElevenLabsWebhookRefusedError,
	matchEventType,
	PostCallAudioEventSchema,
	PostCallTranscriptionEventSchema,
	SpeechToTextFailedEventSchema,
	SpeechToTextTranscriptionEventSchema,
	VoiceRemovalNoticeEventSchema,
	VoiceRemovalNoticeWithdrawnEventSchema,
	VoiceRemovedEventSchema,
	verifyElevenLabsWebhookSignature,
} from './types';

/**
 * One webhook: match by `type`, throw on anything the signature doesn't cover or
 * the schema doesn't accept (see ElevenLabsWebhookRefusedError), then log ids only (a transcript or post-call audio can be very large, and is
 * the customer's content).
 */
function defineEvent<TEvent>(
	eventType: string,
	schema: z.ZodType<TEvent>,
	logName: string,
	// unknown: log fields are plain ids of any type.
	idsOf: (event: TEvent) => Record<string, unknown>,
): CorsairWebhook<ElevenLabsContext, TEvent, TEvent> {
	return {
		match: matchEventType(eventType),
		handler: async (ctx, request) => {
			const verification = verifyElevenLabsWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				throw new ElevenLabsWebhookRefusedError(
					verification.error ||
						'ElevenLabs webhook signature verification failed',
					401,
				);
			}
			const parsed = schema.safeParse(request.payload);
			if (!parsed.success) {
				throw new ElevenLabsWebhookRefusedError(
					`ElevenLabs ${eventType} event did not match its schema`,
					400,
				);
			}
			await logQuietly(ctx, logName, idsOf(parsed.data));
			return { success: true, data: parsed.data };
		},
	};
}

const conversationIds = (event: {
	data?: { agent_id?: string | null; conversation_id?: string | null } | null;
}) => ({
	agentId: event.data?.agent_id,
	conversationId: event.data?.conversation_id,
});

export const ConversationWebhooks = {
	postCallTranscription: defineEvent(
		'post_call_transcription',
		PostCallTranscriptionEventSchema,
		'elevenlabs.webhook.conversations.postCallTranscription',
		conversationIds,
	),
	postCallAudio: defineEvent(
		'post_call_audio',
		PostCallAudioEventSchema,
		'elevenlabs.webhook.conversations.postCallAudio',
		conversationIds,
	),
	callInitiationFailure: defineEvent(
		'call_initiation_failure',
		CallInitiationFailureEventSchema,
		'elevenlabs.webhook.conversations.callInitiationFailure',
		(event) => ({
			...conversationIds(event),
			failureReason: event.data?.failure_reason,
		}),
	),
};

export const SpeechToTextWebhooks = {
	transcriptionCompleted: defineEvent(
		'speech_to_text_transcription',
		SpeechToTextTranscriptionEventSchema,
		'elevenlabs.webhook.speechToText.transcriptionCompleted',
		(event) => ({ requestId: event.data?.request_id }),
	),
	transcriptionFailed: defineEvent(
		'webhook_error',
		SpeechToTextFailedEventSchema,
		'elevenlabs.webhook.speechToText.transcriptionFailed',
		(event) => ({ requestId: event.request_id }),
	),
};

export const VoiceWebhooks = {
	removalNotice: defineEvent(
		'voice_removal_notice',
		VoiceRemovalNoticeEventSchema,
		'elevenlabs.webhook.voices.removalNotice',
		() => ({}),
	),
	removalNoticeWithdrawn: defineEvent(
		'voice_removal_notice_withdrawn',
		VoiceRemovalNoticeWithdrawnEventSchema,
		'elevenlabs.webhook.voices.removalNoticeWithdrawn',
		() => ({}),
	),
	removed: defineEvent(
		'voice_removed',
		VoiceRemovedEventSchema,
		'elevenlabs.webhook.voices.removed',
		() => ({}),
	),
};
