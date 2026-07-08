import { z } from 'zod';

export const GoogleAdsCampaign = z.object({
	id: z.string(),
	resourceName: z.string().optional(),
	name: z.string().optional(),
	status: z
		.enum(['ENABLED', 'PAUSED', 'REMOVED', 'UNKNOWN', 'UNSPECIFIED'])
		.optional(),
	advertisingChannelType: z.string().optional(),
	biddingStrategyType: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	budgetAmountMicros: z.string().optional(),
	servingStatus: z.string().optional(),
	optimizationScore: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type GoogleAdsCampaign = z.infer<typeof GoogleAdsCampaign>;

export const GoogleAdsCustomerList = z.object({
	id: z.string(),
	resourceName: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	type: z.string().optional(),
	membershipStatus: z.string().optional(),
	sizeForDisplay: z.string().optional(),
	sizeForSearch: z.string().optional(),
	membershipLifeSpan: z.string().optional(),
	readOnly: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type GoogleAdsCustomerList = z.infer<typeof GoogleAdsCustomerList>;
