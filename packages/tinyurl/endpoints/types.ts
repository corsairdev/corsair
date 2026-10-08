import { z } from 'zod';
import { TinyurlLink } from '../schema/database';

/** Official expires_at on POST /create: real `YYYY-MM-DD HH:MM:SS`. */
const EXPIRES_AT = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

function isTinyurlExpiresAt(value: string): boolean {
	const match = EXPIRES_AT.exec(value);
	if (!match) return false;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const hour = Number(match[4]);
	const minute = Number(match[5]);
	const second = Number(match[6]);
	if (hour > 23 || minute > 59 || second > 59) return false;
	const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() === month - 1 &&
		date.getUTCDate() === day &&
		date.getUTCHours() === hour &&
		date.getUTCMinutes() === minute &&
		date.getUTCSeconds() === second
	);
}

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
			.describe('Optional tags; official body uses a comma-separated string'),
		expires_at: z
			.string()
			.refine(
				isTinyurlExpiresAt,
				'expires_at must be a real YYYY-MM-DD HH:MM:SS',
			)
			.optional()
			.describe('Optional expiration in YYYY-MM-DD HH:MM:SS'),
		description: z
			.string()
			.optional()
			.describe('Optional description for the link'),
	})
	.loose();

export type CreateUrlInput = z.infer<typeof CreateUrlInputSchema>;

export const CreateUrlResponseSchema = TinyurlLink.extend({
	url: z.string().url(),
});
export type CreateUrlResponse = z.infer<typeof CreateUrlResponseSchema>;

export const ListUrlsInputSchema = z
	.object({
		type: z
			.enum(['available', 'archived'])
			.describe('URL list type for GET /urls/{type}'),
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Page number for pagination'),
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Results per page (1-100)'),
		from: z.string().optional().describe('Start of time period filter'),
		to: z.string().optional().describe('End of time period filter'),
		alias: z.string().optional().describe('Filter by alias'),
		tag: z.string().optional().describe('Filter by tag'),
	})
	.loose();

export type ListUrlsInput = z.infer<typeof ListUrlsInputSchema>;

export const ListUrlsResponseSchema = z
	.object({
		data: z.array(TinyurlLink),
		code: z.number().optional(),
		errors: z.array(z.unknown()).optional(),
	})
	.loose();

export type ListUrlsResponse = z.infer<typeof ListUrlsResponseSchema>;

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
	listUrls: ListUrlsInput;
};

export type TinyurlEndpointOutputs = {
	createUrl: CreateUrlResponse;
	listUrls: ListUrlsResponse;
};

export const TinyurlEndpointInputSchemas = {
	createUrl: CreateUrlInputSchema,
	listUrls: ListUrlsInputSchema,
} as const;

export const TinyurlEndpointOutputSchemas = {
	createUrl: CreateUrlResponseSchema,
	listUrls: ListUrlsResponseSchema,
} as const;

export { TinyurlLink };
