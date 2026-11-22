import { z } from 'zod';

// Request and response shapes follow https://api-docs.wisprflow.ai (REST API v2).

const TranscribeContextSchema = z.object({
	app: z
		.object({
			name: z.string().optional(),
			type: z.enum(['ai', 'email', 'other']).optional(),
		})
		.optional(),
	dictionary_context: z.array(z.string()).optional(),
	user_identifier: z.string().optional(),
	user_first_name: z.string().optional(),
	user_last_name: z.string().optional(),
	textbox_contents: z
		.object({
			before_text: z.string().optional(),
			selected_text: z.string().optional(),
			after_text: z.string().optional(),
		})
		.optional(),
	screenshot: z.string().optional(),
	content_text: z.string().optional(),
	content_html: z.string().optional(),
	conversation: z
		.object({
			id: z.string(),
			participants: z.array(z.string()).optional(),
			messages: z
				.array(
					z.object({
						role: z.enum(['user', 'human', 'assistant']),
						content: z.string(),
					}),
				)
				.optional(),
		})
		.optional(),
});

const CreateTranscriptionInputSchema = z.object({
	audio: z
		.string()
		.min(1)
		.describe('Base64-encoded 16kHz PCM16 WAV audio, up to 25MB or 6 minutes'),
	language: z
		.array(z.string())
		.default([])
		.describe(
			'ISO 639-1 codes the speaker may use. One code skips detection, empty detects from all languages',
		),
	context: TranscribeContextSchema.default({}).describe(
		'App, user, textbox, screen and conversation context that improves formatting and accuracy',
	),
});

export const TranscriptionSchema = z.object({
	id: z.string().describe('Transcription UUID'),
	text: z.string().describe('Transcribed text with formatting applied'),
	detected_language: z.string().describe('Detected ISO 639-1 language code'),
	total_time: z.number().describe('Processing time in milliseconds'),
	generated_tokens: z
		.number()
		.int()
		.describe('Tokens generated, the unit Wispr Flow bills on'),
});

const WarmupInputSchema = z.object({});

const WarmupResponseSchema = z.object({
	status: z.string(),
});

const GenerateTokenInputSchema = z.object({
	client_id: z
		.string()
		.min(1)
		.describe('Your identifier for the end user or app'),
	duration_secs: z
		.number()
		.int()
		.positive()
		.describe('Token lifetime in seconds'),
	metadata: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Extra data stored with the token'),
});

const GenerateTokenResponseSchema = z.object({
	access_token: z.string().describe('Client JWT for the client-side API'),
	expires_in: z.number().int().describe('Seconds until the token expires'),
});

const RevokeTokenInputSchema = z.object({
	access_token: z.string().min(1).describe('The client JWT to revoke'),
});

const RevokeClientTokensInputSchema = z.object({
	client_id: z.string().min(1).describe('Client whose tokens are all revoked'),
});

const RevokeResponseSchema = z.object({
	status: z.string(),
	message: z.string(),
});

export type CreateTranscriptionInput = z.input<
	typeof CreateTranscriptionInputSchema
>;
export type Transcription = z.infer<typeof TranscriptionSchema>;
export type WarmupInput = z.infer<typeof WarmupInputSchema>;
export type WarmupResponse = z.infer<typeof WarmupResponseSchema>;
export type GenerateTokenInput = z.infer<typeof GenerateTokenInputSchema>;
export type GenerateTokenResponse = z.infer<typeof GenerateTokenResponseSchema>;
export type RevokeTokenInput = z.infer<typeof RevokeTokenInputSchema>;
export type RevokeClientTokensInput = z.infer<
	typeof RevokeClientTokensInputSchema
>;
export type RevokeResponse = z.infer<typeof RevokeResponseSchema>;

export type WisprFlowEndpointInputs = {
	transcriptionsCreate: CreateTranscriptionInput;
	transcriptionsWarmup: WarmupInput;
	tokensGenerate: GenerateTokenInput;
	tokensRevoke: RevokeTokenInput;
	tokensRevokeClient: RevokeClientTokensInput;
};

export type WisprFlowEndpointOutputs = {
	transcriptionsCreate: Transcription;
	transcriptionsWarmup: WarmupResponse;
	tokensGenerate: GenerateTokenResponse;
	tokensRevoke: RevokeResponse;
	tokensRevokeClient: RevokeResponse;
};

export const WisprFlowEndpointInputSchemas = {
	transcriptionsCreate: CreateTranscriptionInputSchema,
	transcriptionsWarmup: WarmupInputSchema,
	tokensGenerate: GenerateTokenInputSchema,
	tokensRevoke: RevokeTokenInputSchema,
	tokensRevokeClient: RevokeClientTokensInputSchema,
} as const;

export const WisprFlowEndpointOutputSchemas = {
	transcriptionsCreate: TranscriptionSchema,
	transcriptionsWarmup: WarmupResponseSchema,
	tokensGenerate: GenerateTokenResponseSchema,
	tokensRevoke: RevokeResponseSchema,
	tokensRevokeClient: RevokeResponseSchema,
} as const;
