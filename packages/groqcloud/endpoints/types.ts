import type { z } from 'zod';
import { audioSchemas } from '../schema/audio';
import { chatSchemas } from '../schema/chat';
import { modelsSchemas } from '../schema/models';

export type GroqcloudEndpointInputs = {
	audioCreateTranscription: z.infer<
		typeof audioSchemas.audioCreateTranscription.input
	>;
	audioCreateTranslation: z.infer<
		typeof audioSchemas.audioCreateTranslation.input
	>;
	audioListVoices: z.infer<typeof audioSchemas.audioListVoices.input>;
	chatCreateCompletion: z.infer<typeof chatSchemas.chatCreateCompletion.input>;
	chatCreateResponse: z.infer<typeof chatSchemas.chatCreateResponse.input>;
	modelsListModels: z.infer<typeof modelsSchemas.modelsListModels.input>;
	modelsRetrieveModel: z.infer<typeof modelsSchemas.modelsRetrieveModel.input>;
};

export type GroqcloudEndpointOutputs = {
	audioCreateTranscription: z.infer<
		typeof audioSchemas.audioCreateTranscription.output
	>;
	audioCreateTranslation: z.infer<
		typeof audioSchemas.audioCreateTranslation.output
	>;
	audioListVoices: z.infer<typeof audioSchemas.audioListVoices.output>;
	chatCreateCompletion: z.infer<typeof chatSchemas.chatCreateCompletion.output>;
	chatCreateResponse: z.infer<typeof chatSchemas.chatCreateResponse.output>;
	modelsListModels: z.infer<typeof modelsSchemas.modelsListModels.output>;
	modelsRetrieveModel: z.infer<typeof modelsSchemas.modelsRetrieveModel.output>;
};

export const GroqcloudEndpointInputSchemas = {
	audioCreateTranscription: audioSchemas.audioCreateTranscription.input,
	audioCreateTranslation: audioSchemas.audioCreateTranslation.input,
	audioListVoices: audioSchemas.audioListVoices.input,
	chatCreateCompletion: chatSchemas.chatCreateCompletion.input,
	chatCreateResponse: chatSchemas.chatCreateResponse.input,
	modelsListModels: modelsSchemas.modelsListModels.input,
	modelsRetrieveModel: modelsSchemas.modelsRetrieveModel.input,
} as const;

export const GroqcloudEndpointOutputSchemas = {
	audioCreateTranscription: audioSchemas.audioCreateTranscription.output,
	audioCreateTranslation: audioSchemas.audioCreateTranslation.output,
	audioListVoices: audioSchemas.audioListVoices.output,
	chatCreateCompletion: chatSchemas.chatCreateCompletion.output,
	chatCreateResponse: chatSchemas.chatCreateResponse.output,
	modelsListModels: modelsSchemas.modelsListModels.output,
	modelsRetrieveModel: modelsSchemas.modelsRetrieveModel.output,
} as const;

export * from '../schema/audio';
export * from '../schema/chat';
export * from '../schema/models';
