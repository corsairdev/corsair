import { z } from 'zod';

const AsticaReadTextInputSchema = z.object({
	input: z.string().describe('HTTPS image URL or Base64-encoded image.'),
	modelVersion: z.string().default('2.5_full'),
});

export type AsticaReadTextInput = z.infer<typeof AsticaReadTextInputSchema>;

const AnalyzeAudioInputSchema = z.object({
	input: z.string().describe('HTTPS audio URL or Base64-encoded audio.'),
	modelVersion: z.string().default('1.0_full'),
	doStream: z.number().int().min(0).max(1).default(0),
	low_priority: z.number().int().min(0).max(1).default(0),
});

export type AnalyzeAudioInput = z.infer<typeof AnalyzeAudioInputSchema>;

const AsticaReadTextOutputSchema = z.object({
	readResult: z
		.unknown()
		.describe('Astica OCR result returned by the text_read Vision parameter.'),
});

export type AsticaReadTextOutput = z.infer<typeof AsticaReadTextOutputSchema>;

const AnalyzeAudioOutputSchema = z.record(z.string(), z.unknown());

export type AnalyzeAudioOutput = z.infer<typeof AnalyzeAudioOutputSchema>;

export type AsticaAiEndpointInputs = {
	readText: AsticaReadTextInput;
	analyzeAudio: AnalyzeAudioInput;
};

export type AsticaAiEndpointOutputs = {
	readText: AsticaReadTextOutput;
	analyzeAudio: AnalyzeAudioOutput;
};

export const AsticaAiEndpointInputSchemas = {
	readText: AsticaReadTextInputSchema,
	analyzeAudio: AnalyzeAudioInputSchema,
} as const;

export const AsticaAiEndpointOutputSchemas = {
	readText: AsticaReadTextOutputSchema,
	analyzeAudio: AnalyzeAudioOutputSchema,
} as const;
