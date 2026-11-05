import { z } from 'zod';

// Entity shapes follow the CoinMarketCal v2 API response objects:
// https://coinmarketcal.com/developer/docs/events
// https://coinmarketcal.com/developer/docs/coins
// https://coinmarketcal.com/developer/docs/categories

/** Coin reference embedded in an event (`CoinRef`). */
export const CoinmarketcalCoinRef = z.object({
	slug: z.string(),
	symbol: z.string(),
	name: z.string(),
});

/** A coin from `GET /v2/coins` and `GET /v2/coins/{slug}`. Keyed by `slug`. */
export const CoinmarketcalCoin = z.object({
	slug: z.string(),
	symbol: z.string().optional(),
	name: z.string().optional(),
	rank: z.number().nullable().optional(),
	tracked: z.boolean().optional(),
	iconUrl: z.string().nullable().optional(),
	upcomingCount: z.number().nullable().optional(),
	majorCount: z.number().nullable().optional(),
	peakImpact: z.number().nullable().optional(),
});

/** An event from `GET /v2/events` and `GET /v2/events/{id}`. Keyed by `id`. */
export const CoinmarketcalEvent = z.object({
	id: z.string(),
	slug: z.string().optional(),
	title: z.string().optional(),
	description: z.string().nullable().optional(),
	date: z.string().optional(),
	dateEnd: z.string().nullable().optional(),
	dateType: z.string().optional(),
	isEstimated: z.boolean().optional(),
	displayedDate: z.string().optional(),
	// Returned on Standard tier and above only.
	categories: z.array(z.string()).optional(),
	coins: z.array(CoinmarketcalCoinRef).optional(),
	// Pro tier and above only.
	impact: z.union([z.number(), z.string()]).nullable().optional(),
	impactSummary: z.string().nullable().optional(),
	sourceUrl: z.string().nullable().optional(),
	snapshotUrl: z.string().nullable().optional(),
	lastVerifiedAt: z.string().nullable().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

/** A category from `GET /v2/categories` (Standard tier and above). Keyed by `id`. */
export const CoinmarketcalCategory = z.object({
	id: z.string(),
	name: z.string().optional(),
	slug: z.string().optional(),
});

export type CoinmarketcalCoinEntity = z.infer<typeof CoinmarketcalCoin>;
export type CoinmarketcalEventEntity = z.infer<typeof CoinmarketcalEvent>;
export type CoinmarketcalCategoryEntity = z.infer<typeof CoinmarketcalCategory>;
