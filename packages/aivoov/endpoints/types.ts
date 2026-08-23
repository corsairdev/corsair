import { z } from 'zod';

const ListVoicesInputSchema = z.object({
	language_code: z.string().optional(),
});

const VoiceSchema = z.object({
	voice_id: z.string(),
	name: z.string(),
	gender: z.string().optional(),
	language: z.string().optional(),
});

const ListVoicesResponseSchema = z.array(VoiceSchema);

const CreateAudioInputSchema = z.object({
	voice_id: z.string(),
	text: z.string().min(1),
});

const CreateAudioResponseSchema = z.object({
	status: z.boolean(),
	message: z.string(),
	audio: z.string().optional(),
});

export type ListVoicesInput = z.infer<typeof ListVoicesInputSchema>;

export type ListVoicesResponse = z.infer<typeof ListVoicesResponseSchema>;

export type CreateAudioInput = z.infer<typeof CreateAudioInputSchema>;

export type CreateAudioResponse = z.infer<typeof CreateAudioResponseSchema>;

export type AivoovEndpointInputs = {
	listVoices: ListVoicesInput;
	createAudio: CreateAudioInput;
};

export type AivoovEndpointOutputs = {
	listVoices: ListVoicesResponse;
	createAudio: CreateAudioResponse;
};

export const AivoovEndpointInputSchemas = {
	listVoices: ListVoicesInputSchema,
	createAudio: CreateAudioInputSchema,
} as const;

export const AivoovEndpointOutputSchemas = {
	listVoices: ListVoicesResponseSchema,
	createAudio: CreateAudioResponseSchema,
} as const;
