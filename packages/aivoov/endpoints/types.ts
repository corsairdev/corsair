import { z } from 'zod';

const GetVoicesInputSchema = z.object({
	language_code: z.string().optional(),
});

export type GetVoicesInput = z.infer<typeof GetVoicesInputSchema>;

const VoiceSchema = z.object({
	voice_id: z.string(),
	name: z.string(),
	language: z.string(),
});

export type Voice = z.infer<typeof VoiceSchema>;

const GetVoicesResponseSchema = z.array(VoiceSchema);

export type GetVoicesResponse = z.infer<typeof GetVoicesResponseSchema>;

const CreateAudioInputSchema = z.object({
	voice_id: z.array(z.string()).min(1),
	transcribe_text: z.array(z.string()).min(1),
	transcribe_ssml_pitch_rate: z
		.array(z.union([z.number().int().min(-50).max(50), z.literal('default')]))
		.optional(),
	transcribe_ssml_spk_rate: z
		.array(z.union([z.number().int().min(20).max(200), z.literal('default')]))
		.optional(),
	transcribe_ssml_volume: z
		.array(z.union([z.number().int().min(-40).max(40), z.literal('default')]))
		.optional(),
});

export type CreateAudioInput = z.infer<typeof CreateAudioInputSchema>;

const CreateAudioResponseSchema = z.object({
	status: z.boolean(),
	message: z.string(),
	audio: z.string(),
});

export type CreateAudioResponse = z.infer<typeof CreateAudioResponseSchema>;

export type AivoovEndpointInputs = {
	getVoices: GetVoicesInput;
	createAudio: CreateAudioInput;
};

export type AivoovEndpointOutputs = {
	getVoices: GetVoicesResponse;
	createAudio: CreateAudioResponse;
};

export const AivoovEndpointInputSchemas = {
	getVoices: GetVoicesInputSchema,
	createAudio: CreateAudioInputSchema,
} as const;

export const AivoovEndpointOutputSchemas = {
	getVoices: GetVoicesResponseSchema,
	createAudio: CreateAudioResponseSchema,
} as const;
