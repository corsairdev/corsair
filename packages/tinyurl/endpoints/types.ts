import { z } from 'zod';
import { TinyurlLink } from '../schema/database';

export const CreateUrlInputSchema = z
	.object({
		url: z.string().url().describe('The long URL to be shortened'),
		domain: z
			.string()
			.optional()
			.describe('Domain to use for the shortened URL (e.g. tinyurl.com)'),
		alias: z
			.string()
			.optional()
			.describe('Optional custom alias for the shortened URL'),
		tags: z
			.union([z.string(), z.array(z.string())])
			.optional()
			.describe('Optional tags for organizing shortened URLs'),
		expires_at: z
			.string()
			.optional()
			.describe(
				'Optional expiration date/time in ISO 8601 or YYYY-MM-DD HH:MM:SS format',
			),
		description: z
			.string()
			.optional()
			.describe('Optional description for the link'),
	})
	.loose();

export type CreateUrlInput = z.infer<typeof CreateUrlInputSchema>;

export const CreateUrlResponseSchema = TinyurlLink;
export type CreateUrlResponse = TinyurlLink;

export const TinyurlApiResponseEnvelopeSchema = z
	.object({
		data: TinyurlLink,
		code: z.number().optional(),
		errors: z.array(z.unknown()).optional(),
	})
	.loose();

export type TinyurlApiResponseEnvelope = z.infer<
	typeof TinyurlApiResponseEnvelopeSchema
>;

export type TinyurlEndpointInputs = {
	createUrl: CreateUrlInput;
};

export type TinyurlEndpointOutputs = {
	createUrl: CreateUrlResponse;
};

export const TinyurlEndpointInputSchemas = {
	createUrl: CreateUrlInputSchema,
} as const;

export const TinyurlEndpointOutputSchemas = {
	createUrl: CreateUrlResponseSchema,
} as const;

export { TinyurlLink };
