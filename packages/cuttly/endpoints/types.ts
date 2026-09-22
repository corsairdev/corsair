import { z } from 'zod';
import { CuttlyLinkEntity } from '../schema/database';

const CuttlyStatsSchema = z
	.object({
		status: z.number(),
		date: z.string().optional(),
		clicks: z.number().optional(),
		title: z.string().optional(),
		fullLink: z.string().url().optional(),
		shortLink: z.string().url().optional(),
		qrCode: z.string().url().optional(),
		facebook: z.number().optional(),
		twitter: z.number().optional(),
		linkedin: z.number().optional(),
		rest: z.number().optional(),
		bots: z.number().optional(),
	})
	.loose();

export const CuttlyEndpointInputSchemas = {
	shorten: z.object({
		url: z.string().url(),
		alias: z.string().min(1).max(100).optional(),
		useCustomDomain: z.boolean().optional(),
		publicStats: z.boolean().optional(),
		noTitle: z.boolean().optional(),
	}),
	update: z
		.object({
			shortUrl: z.string().url(),
			url: z.string().url().optional(),
			alias: z.string().min(1).max(100).optional(),
		})
		.refine((input) => input.url !== undefined || input.alias !== undefined, {
			message: 'Provide a new destination URL or custom alias',
		}),
	analytics: z.object({
		shortUrl: z.string().url(),
		dateFrom: z.string().date().optional(),
		dateTo: z.string().date().optional(),
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
