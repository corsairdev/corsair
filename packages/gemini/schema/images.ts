import { z } from 'zod';

export const GEMINI_IMAGE_MODELS = [
	'gemini-2.5-flash-image',
	'gemini-3-pro-image-preview',
	'gemini-2.0-flash-exp-image-generation',
] as const;

export const GeneratedImageSchema = z.object({
	mimeType: z.string(),
	contentBase64: z.string().describe('Base64-encoded image bytes'),
});
export type GeneratedImage = z.infer<typeof GeneratedImageSchema>;
