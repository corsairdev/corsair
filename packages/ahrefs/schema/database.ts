import { z } from 'zod';

export const DomainMetrics = z.object({
	target: z.string(),
	ahrefs_rank: z.number().int().nullable().optional(),
	domain_rating: z.number().nullable().optional(),
	backlinks: z.number().int().nullable().optional(),
	referring_domains: z.number().int().nullable().optional(),
	all_time_backlinks: z.number().int().nullable().optional(),
	all_time_referring_domains: z.number().int().nullable().optional(),
	date: z.string().optional(),
	updatedAt: z.coerce.date().optional(),
});

export const KeywordMetrics = z
	.object({
		target: z.string().optional(),
		country: z.string().optional(),
		date: z.string().optional(),
		keyword: z.string().nullable().optional(),
		volume: z.number().int().nullable().optional(),
		keyword_difficulty: z.number().int().nullable().optional(),
		difficulty: z.number().int().nullable().optional(),
		cpc: z.number().int().nullable().optional(),
		best_position: z.number().int().nullable().optional(),
		best_position_url: z.string().nullable().optional(),
		sum_traffic: z.number().int().nullable().optional(),
		traffic_potential: z.number().int().nullable().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();

export const RefDomain = z
	.object({
		target: z.string(),
		domain: z.string(),
		domain_rating: z.number().nullable().optional(),
		dofollow_links: z.number().int().nullable().optional(),
		dofollow_refdomains: z.number().int().nullable().optional(),
		links: z.number().int().nullable().optional(),
		refdomains: z.number().int().nullable().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();

export const TopPage = z
	.object({
		target: z.string(),
		country: z.string().optional(),
		date: z.string().optional(),
		raw_url: z.string(),
		keywords: z.number().int().nullable().optional(),
		referring_domains: z.number().int().nullable().optional(),
		sum_traffic: z.number().int().nullable().optional(),
		value: z.number().int().nullable().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();

export const Ranking = z
	.object({
		project_id: z.number().int(),
		device: z.string(),
		date: z.string(),
		keyword: z.string().nullable().optional(),
		country: z.string().optional(),
		position: z.number().int().nullable().optional(),
		previous_position: z.number().int().nullable().optional(),
		url: z.string().nullable().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();

export const SerpPosition = z
	.object({
		country: z.string(),
		keyword: z.string(),
		requestedDate: z.string().optional(),
		position: z.number().int(),
		url: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		domain_rating: z.number().nullable().optional(),
		backlinks: z.number().int().nullable().optional(),
		refdomains: z.number().int().nullable().optional(),
		traffic: z.number().int().nullable().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();

export const SubscriptionUsage = z.object({
	api_key_expiration_date: z.string(),
	subscription: z.string(),
	units_limit_api_key: z.number().int().nullable(),
	units_limit_workspace: z.number().int().nullable(),
	units_usage_api_key: z.number().int(),
	units_usage_workspace: z.number().int().nullable(),
	usage_reset_date: z.string(),
	updatedAt: z.coerce.date().optional(),
});

export type DomainMetrics = z.infer<typeof DomainMetrics>;
export type KeywordMetrics = z.infer<typeof KeywordMetrics>;
export type RefDomain = z.infer<typeof RefDomain>;
export type TopPage = z.infer<typeof TopPage>;
export type Ranking = z.infer<typeof Ranking>;
export type SerpPosition = z.infer<typeof SerpPosition>;
export type SubscriptionUsage = z.infer<typeof SubscriptionUsage>;
