import { z } from 'zod';

export const RealtimeCreateCallInputSchema = z.object({
	sdp: z.string().optional(),
	// Realtime session config shape is not fully documented publicly and varies by modality; kept loose.
	session: z.record(z.string(), z.unknown()),
});
export type RealtimeCreateCallInput = z.infer<
	typeof RealtimeCreateCallInputSchema
>;

// Realtime API response shape beyond id/sdp is not fully documented publicly; using catchall to accept it.
export const RealtimeCreateCallResponseSchema = z
	.object({
		id: z.string().optional(),
		sdp: z.string().optional(),
	})
	.catchall(z.unknown());
export type RealtimeCreateCallResponse = z.infer<
	typeof RealtimeCreateCallResponseSchema
>;

export const RealtimeCreateClientSecretInputSchema = z.object({
	// See RealtimeCreateCallInputSchema above: session config shape varies by modality, kept loose.
	session: z.record(z.string(), z.unknown()).optional(),
	expiresAfter: z
		.object({
			anchor: z.string(),
			seconds: z.number(),
		})
		.optional(),
});
export type RealtimeCreateClientSecretInput = z.infer<
	typeof RealtimeCreateClientSecretInputSchema
>;

// Response fields beyond value/expires_at are not fully documented publicly; using catchall to accept them.
export const RealtimeCreateClientSecretResponseSchema = z
	.object({
		value: z.string(),
		expires_at: z.number(),
	})
	.catchall(z.unknown());
export type RealtimeCreateClientSecretResponse = z.infer<
	typeof RealtimeCreateClientSecretResponseSchema
>;

export const RealtimeCreateSessionInputSchema = z.object({
	model: z.string().optional(),
	voice: z.string().optional(),
	modalities: z.array(z.string()).optional(),
	instructions: z.string().optional(),
});
export type RealtimeCreateSessionInput = z.infer<
	typeof RealtimeCreateSessionInputSchema
>;

// Session response shape beyond id is not fully documented publicly; using catchall to accept it.
export const RealtimeCreateSessionResponseSchema = z
	.object({
		id: z.string().optional(),
	})
	.catchall(z.unknown());
export type RealtimeCreateSessionResponse = z.infer<
	typeof RealtimeCreateSessionResponseSchema
>;

export const RealtimeCreateTranscriptionSessionInputSchema = z.object({
	inputAudioFormat: z.string().optional(),
	// Transcription config shape (model, language, prompt) is not fully documented publicly; kept loose.
	inputAudioTranscription: z.record(z.string(), z.unknown()).optional(),
});
export type RealtimeCreateTranscriptionSessionInput = z.infer<
	typeof RealtimeCreateTranscriptionSessionInputSchema
>;

// Transcription session response shape beyond id is not fully documented publicly; using catchall to accept it.
export const RealtimeCreateTranscriptionSessionResponseSchema = z
	.object({
		id: z.string().optional(),
	})
	.catchall(z.unknown());
export type RealtimeCreateTranscriptionSessionResponse = z.infer<
	typeof RealtimeCreateTranscriptionSessionResponseSchema
>;
