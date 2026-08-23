import { z } from 'zod';
import { AivoovAPIError, makeAivoovRequest } from '../client';

// 1. Define Input Schema with optional language filtering
export const inputSchema = z.object({
	language_code: z
		.string()
		.optional()
		.describe('Optional language code to filter voices (e.g., en-US)'),
});

// 2. Define Output Schema matching AiVOOV voice details
export const voiceSchema = z.object({
	voice_id: z.string(),
	name: z.string(),
	gender: z.string().optional(),
	language_code: z.string().optional(),
});

export const outputSchema = z.object({
	voices: z.array(voiceSchema),
});

// 3. Define the Endpoint Execution Handler
export async function execute({
	input,
	credentials,
}: {
	input: z.infer<typeof inputSchema>;
	credentials: { apiKey: string };
}) {
	const apiKey = credentials.apiKey;

	// Prepare query parameters if language_code is specified
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.language_code) {
		query.language_code = input.language_code;
	}

	try {
		// Calls GET https://aivoov.com/api/v8/voices
		const response = await makeAivoovRequest<any>('/voices', apiKey, {
			method: 'GET',
			query,
		});

		// Normalize response payload into expected structure
		const voicesList = Array.isArray(response)
			? response
			: response?.voices || [];

		return {
			voices: voicesList.map((v: any) => ({
				voice_id: v.voice_id,
				name: v.name,
				gender: v.gender,
				language_code: v.language_code || v.language,
			})),
		};
	} catch (error) {
		if (error instanceof AivoovAPIError) {
			throw new Error(`AiVOOV API failed to list voices: ${error.message}`);
		}
		throw error;
	}
}
