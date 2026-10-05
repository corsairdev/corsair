import { z } from 'zod';
import { CuttlyLinkEntity } from '../schema/database';

/** Official `stats` object returned by the Cutt.ly Regular API analytics call. */
const CuttlyStatsSchema = z
	.object({
		status: z
			.number()
			.describe('Provider status: 1 is success, 0 unknown link, 2 invalid key'),
		date: z.string().optional().describe('Date the link was shortened'),
		clicks: z.number().optional().describe('Total number of clicks'),
		title: z.string().optional().describe('Title of the shortened link'),
		fullLink: z.string().url().optional().describe('Original destination URL'),
		shortLink: z.string().url().optional().describe('Shortened link URL'),
		qrCode: z
			.string()
			.url()
			.optional()
			.describe('QR code URL when the provider returns one'),
		facebook: z.number().optional().describe('Clicks from Facebook'),
		twitter: z.number().optional().describe('Clicks from Twitter'),
		linkedin: z.number().optional().describe('Clicks from LinkedIn'),
		rest: z.number().optional().describe('Other clicks'),
		bots: z.number().optional().describe('Clicks from bots'),
	})
	.loose();

export const CuttlyEndpointInputSchemas = {
	shorten: z.object({
		url: z.string().url().describe('Destination URL to shorten'),
		alias: z
			.string()
			.min(1)
			.max(100)
			.optional()
			.describe('Preferred custom alias when not already taken'),
		useCustomDomain: z
			.boolean()
			.optional()
			.describe('Use the active branded domain from the account (paid plan)'),
		publicStats: z
			.boolean()
			.optional()
			.describe(
				'Make click stats public for this link (Single plan and above)',
			),
		noTitle: z
			.boolean()
			.optional()
			.describe(
				'Skip destination title lookup for a faster response (Team Enterprise)',
			),
	}),
	update: z
		.object({
			shortUrl: z
				.string()
				.url()
				.describe('Existing Cutt.ly short link to edit'),
			url: z
				.string()
				.url()
				.optional()
				.describe('New destination URL for the short link'),
			alias: z
				.string()
				.min(1)
				.max(100)
				.optional()
				.describe('New custom alias when not already taken'),
		})
		.refine((input) => input.url !== undefined || input.alias !== undefined, {
			message: 'Provide a new destination URL or custom alias',
		}),
	analytics: z.object({
		shortUrl: z.string().url().describe('Short link to retrieve analytics for'),
		dateFrom: z
			.string()
			.date()
			.optional()
			.describe('Start date filter YYYY-MM-DD (Team plan)'),
		dateTo: z
			.string()
			.date()
			.optional()
			.describe('End date filter YYYY-MM-DD (Team plan)'),
	}),
} as const;

export const CuttlyEndpointOutputSchemas = {
	shorten: z.object({ url: CuttlyLinkEntity }),
	update: z.object({ url: CuttlyLinkEntity }),
	analytics: z.object({ stats: CuttlyStatsSchema }),
} as const;

export type CuttlyEndpointInputs = {
	shorten: z.infer<typeof CuttlyEndpointInputSchemas.shorten>;
	update: z.infer<typeof CuttlyEndpointInputSchemas.update>;
	analytics: z.infer<typeof CuttlyEndpointInputSchemas.analytics>;
};

export type CuttlyEndpointOutputs = {
	shorten: z.infer<typeof CuttlyEndpointOutputSchemas.shorten>;
	update: z.infer<typeof CuttlyEndpointOutputSchemas.update>;
	analytics: z.infer<typeof CuttlyEndpointOutputSchemas.analytics>;
};
