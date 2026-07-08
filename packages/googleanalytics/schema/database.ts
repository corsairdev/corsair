import { z } from 'zod';

// Accounts and properties are the two resources callers enumerate and resolve
// most often, so they are worth caching locally. Everything else (reports,
// audience lists, settings singletons) is fetched live.
export const GoogleAnalyticsAccount = z.object({
	name: z.string(),
	displayName: z.string().optional(),
	regionCode: z.string().optional(),
	countryCode: z.string().optional(),
	createTime: z.string().optional(),
	updateTime: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});
export type GoogleAnalyticsAccount = z.infer<typeof GoogleAnalyticsAccount>;

export const GoogleAnalyticsProperty = z.object({
	name: z.string().optional(),
	parent: z.string().optional(),
	displayName: z.string().optional(),
	propertyType: z.string().optional(),
	timeZone: z.string().optional(),
	currencyCode: z.string().optional(),
	industryCategory: z.string().optional(),
	account: z.string().optional(),
	createTime: z.string().optional(),
	updateTime: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});
export type GoogleAnalyticsProperty = z.infer<typeof GoogleAnalyticsProperty>;
