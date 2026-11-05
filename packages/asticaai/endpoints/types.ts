import { z } from 'zod';

// Shapes follow https://astica.ai/vision/documentation/ and
// https://astica.ai/hearing/documentation/, with the response fields taken from
// the official samples in alanine/astica-cognitive-api.

export const ASTICA_VISION_MODEL_VERSION = [
	'2.5_full',
	'2.1_full',
	'2.0_full',
	'1.0_full',
] as const;

export type AsticaVisionModelVersion =
	(typeof ASTICA_VISION_MODEL_VERSION)[number];

export const AsticaReadTextInputSchema = z.object({
	/** HTTPS image URL or Base64-encoded image. Max 20MB, 16000x16000px. */
	input: z.string().min(1),
	/** Vision model version. Default 2.5_full. */
	modelVersion: z.enum(ASTICA_VISION_MODEL_VERSION).default('2.5_full'),
});

export type AsticaReadTextInput = z.input<typeof AsticaReadTextInputSchema>;

export const AnalyzeAudioInputSchema = z.object({
	/** HTTPS audio URL or Base64-encoded audio. */
	input: z.string().min(1),
	/** Transcription model version. Default 1.0_full. */
	modelVersion: z.string().min(1).default('1.0_full'),
	/** Stream partial results as they are produced. */
	doStream: z.union([z.literal(0), z.literal(1)]).default(0),
	/** Queue the job and return a resultURI to poll, at a lower price. */
	low_priority: z.union([z.literal(0), z.literal(1)]).default(0),
});

export type AnalyzeAudioInput = z.input<typeof AnalyzeAudioInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Vision / OCR response
// ─────────────────────────────────────────────────────────────────────────────

export const AsticaReadSpanSchema = z
	.object({
		offset: z.number().int(),
		length: z.number().int(),
	})
	.passthrough();

export const AsticaReadLineSchema = z
	.object({
		text: z.string(),
		boundingBox: z.array(z.number()).optional(),
		spans: z.array(AsticaReadSpanSchema).optional(),
	})
	.passthrough();

export const AsticaReadWordSchema = z
	.object({
		text: z.string(),
		boundingBox: z.array(z.number()).optional(),
		confidence: z.number().optional(),
		span: AsticaReadSpanSchema.optional(),
	})
	.passthrough();

export const AsticaReadPageSchema = z
	.object({
		pageNumber: z.number().int().optional(),
		height: z.number().optional(),
		width: z.number().optional(),
		angle: z.number().optional(),
		words: z.array(AsticaReadWordSchema).optional(),
		lines: z.array(AsticaReadLineSchema).optional(),
		spans: z.array(AsticaReadSpanSchema).optional(),
	})
	.passthrough();

export const AsticaReadResultSchema = z
	.object({
		stringIndexType: z.string().optional(),
		/** The full text Astica read out of the image. */
		content: z.string().optional(),
		pages: z.array(AsticaReadPageSchema).optional(),
		styles: z.array(z.unknown()).optional(),
	})
	.passthrough();

export type AsticaReadResult = z.infer<typeof AsticaReadResultSchema>;

export const AsticaReadTextOutputSchema = z
	.object({
		/** 'success' or 'error'. Astica reports failures with HTTP 200. */
		status: z.string().optional(),
		error: z.string().optional(),
		readResult: AsticaReadResultSchema.optional(),
		astica: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export type AsticaReadTextOutput = z.infer<typeof AsticaReadTextOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Listen / transcription response
// ─────────────────────────────────────────────────────────────────────────────

export const AnalyzeAudioOutputSchema = z
	.object({
		/** 'success' or 'error'. Astica reports failures with HTTP 200. */
		status: z.string().optional(),
		error: z.string().optional(),
		/** The transcript. Absent or null when low_priority defers the work. */
		text: z.string().nullable().optional(),
		/** Returned instead of `text` when low_priority is 1; poll it for results. */
		resultURI: z.string().nullable().optional(),
	})
	.passthrough();

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
