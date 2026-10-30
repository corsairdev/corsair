import type { Candidate } from '../schema/content';

/**
 * Build generationConfig for image generation.
 * Caller fields are applied first; `responseModalities: ['IMAGE']` is always last
 * so a caller cannot override the required IMAGE modality (which would return empty images).
 */
export function buildImageGenerationConfig(
	// generationConfig is a free-form pass-through of Google generationConfig fields
	callerConfig?: Record<string, unknown>,
): Record<string, unknown> {
	return {
		...(callerConfig ?? {}),
		responseModalities: ['IMAGE'],
	};
}

/** Extract base64 images from generateContent candidates (image modality). */
export function extractImagesFromCandidates(
	candidates: Candidate[] | undefined,
): Array<{ mimeType: string; contentBase64: string }> {
	return (candidates ?? []).flatMap((candidate) =>
		(candidate.content?.parts ?? [])
			.filter(
				(part): part is { inlineData: { mimeType: string; data: string } } =>
					part.inlineData !== undefined,
			)
			.map((part) => ({
				mimeType: part.inlineData.mimeType,
				contentBase64: part.inlineData.data,
			})),
	);
}
