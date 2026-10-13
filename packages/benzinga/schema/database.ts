import { z } from 'zod';

// Entity shapes follow the response objects in the official Benzinga docs.
// Every field except the identifier is optional because the API omits or
// blanks fields that do not apply to a record.

/**
 * News item.
 * https://docs.benzinga.com/api-reference/news-api/get-news-items
 */
export const BenzingaNewsArticle = z.object({
	id: z.number(),
	author: z.string().optional(),
	created: z.string().optional(),
	updated: z.string().optional(),
	title: z.string().optional(),
	teaser: z.string().optional(),
	body: z.string().optional(),
	url: z.string().optional(),
	image: z
		.array(
			z.object({
				size: z.string().optional(),
				url: z.string().optional(),
				alt: z.string().optional(),
			}),
		)
		.optional(),
	channels: z.array(z.object({ name: z.string() })).optional(),
	stocks: z
		.array(
			z.object({
				name: z.string(),
				cusip: z.string().optional(),
				isin: z.string().optional(),
				exchange: z.string().optional(),
				gics: z.string().optional(),
				gics_code: z.string().optional(),
				sector: z.string().optional(),
			}),
		)
		.optional(),
	tags: z.array(z.object({ name: z.string() })).optional(),
	importance_rank: z.number().optional(),
	original_id: z.number().optional(),
});

/**
 * News channel.
 * https://docs.benzinga.com/api-reference/news-api/channels/get-available-news-channels
 */
export const BenzingaNewsChannel = z.object({
	id: z.number(),
	parent: z.number().optional(),
	channel: z.string().optional(),
	weight: z.number().optional(),
});

/**
 * Earnings calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-earnings
 */
export const BenzingaEarning = z.object({
	id: z.string(),
	currency: z.string().optional(),
	cusip: z.string().optional(),
	date: z.string().optional(),
	date_confirmed: z.number().optional(),
	eps: z.string().optional(),
	eps_est: z.string().optional(),
	eps_prior: z.string().optional(),
	eps_surprise: z.string().optional(),
	eps_surprise_percent: z.string().optional(),
	eps_type: z.string().optional(),
	exchange: z.string().optional(),
	importance: z.number().optional(),
	isin: z.string().optional(),
	name: z.string().optional(),
	notes: z.string().optional(),
	period: z.string().optional(),
	period_year: z.number().optional(),
	revenue: z.string().optional(),
	revenue_est: z.string().optional(),
	revenue_prior: z.string().optional(),
	revenue_surprise: z.string().optional(),
	revenue_surprise_percent: z.string().optional(),
	revenue_type: z.string().optional(),
	ticker: z.string().optional(),
	time: z.string().optional(),
	updated: z.number().optional(),
});

/**
 * Dividend calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-dividends
 */
export const BenzingaDividend = z.object({
	id: z.string(),
	confirmed: z.boolean().optional(),
	currency: z.string().optional(),
	cusip: z.string().optional(),
	date: z.string().optional(),
	dividend: z.string().optional(),
	dividend_prior: z.string().optional(),
	dividend_type: z.string().optional(),
	dividend_yield: z.string().optional(),
	end_regular_dividend: z.boolean().optional(),
	ex_dividend_date: z.string().optional(),
	exchange: z.string().optional(),
	frequency: z.number().optional(),
	importance: z.number().optional(),
	isin: z.string().optional(),
	name: z.string().optional(),
	notes: z.string().optional(),
	payable_date: z.string().optional(),
	period: z.string().optional(),
	record_date: z.string().optional(),
	ticker: z.string().optional(),
	updated: z.number().optional(),
	year: z.number().optional(),
});

/**
 * Analyst rating calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-ratings
 */
export const BenzingaRating = z.object({
	id: z.string(),
	action_company: z.string().optional(),
	action_pt: z.string().optional(),
	adjusted_pt_current: z.string().optional(),
	adjusted_pt_prior: z.string().optional(),
	analyst: z.string().optional(),
	analyst_id: z.string().optional(),
	analyst_name: z.string().optional(),
	currency: z.string().optional(),
	cusip: z.string().optional(),
	date: z.string().optional(),
	exchange: z.string().optional(),
	firm_id: z.string().optional(),
	importance: z.number().optional(),
	isin: z.string().optional(),
	name: z.string().optional(),
	notes: z.string().optional(),
	pt_current: z.string().optional(),
	pt_prior: z.string().optional(),
	rating_current: z.string().optional(),
	rating_prior: z.string().optional(),
	ticker: z.string().optional(),
	time: z.string().optional(),
	updated: z.number().optional(),
	url: z.string().optional(),
	url_calendar: z.string().optional(),
	url_news: z.string().optional(),
});

/**
 * Guidance calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-guidance
 */
export const BenzingaGuidance = z.object({
	id: z.string(),
	confirmed: z.boolean().optional(),
	currency: z.string().optional(),
	cusip: z.string().optional(),
	date: z.string().optional(),
	eps_guidance_est: z.string().optional(),
	eps_guidance_max: z.string().optional(),
	eps_guidance_min: z.string().optional(),
	eps_guidance_prior_max: z.string().optional(),
	eps_guidance_prior_min: z.string().optional(),
	eps_type: z.string().optional(),
	exchange: z.string().optional(),
	importance: z.number().optional(),
	is_primary: z.string().optional(),
	name: z.string().optional(),
	notes: z.string().optional(),
	period: z.string().optional(),
	period_year: z.number().optional(),
	prelim: z.string().optional(),
	revenue_guidance_est: z.string().optional(),
	revenue_guidance_max: z.string().optional(),
	revenue_guidance_min: z.string().optional(),
	revenue_guidance_prior_max: z.string().optional(),
	revenue_guidance_prior_min: z.string().optional(),
	revenue_type: z.string().optional(),
	ticker: z.string().optional(),
	time: z.string().optional(),
	updated: z.number().optional(),
});

/**
 * IPO calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-ipos
 */
export const BenzingaIpo = z.object({
	id: z.string(),
	currency: z.string().optional(),
	cusip: z.string().optional(),
	date: z.string().optional(),
	deal_status: z.string().optional(),
	description: z.string().optional(),
	exchange: z.string().optional(),
	initial_filing_date: z.string().optional(),
	insider_lockup_date: z.string().optional(),
	insider_lockup_days: z.number().optional(),
	ipo_type: z.string().optional(),
	last_yr_income: z.number().optional(),
	last_yr_income_year: z.number().optional(),
	last_yr_revenue: z.number().optional(),
	last_yr_revenue_year: z.number().optional(),
	lead_underwriters: z.array(z.string()).optional(),
	market_cap_at_offer: z.number().optional(),
	name: z.string().optional(),
	notes: z.string().optional(),
	offering_shares: z.number().optional(),
	offering_shares_ord_adr: z.number().optional(),
	offering_value: z.number().optional(),
	open_date_verified: z.boolean().optional(),
	ord_shares_out_after_offer: z.number().optional(),
	other_underwriters: z.array(z.string()).optional(),
	price_max: z.string().optional(),
	price_min: z.string().optional(),
	price_open: z.string().optional(),
	price_public_offering: z.string().optional(),
	pricing_date: z.string().optional(),
	pricing_date_verified: z.boolean().optional(),
	sec_accession_number: z.string().optional(),
	sec_filing_url: z.string().optional(),
	shares_outstanding: z.number().optional(),
	sic: z.number().optional(),
	spac_converted_to_target: z.boolean().optional(),
	state_location: z.string().optional(),
	ticker: z.string().optional(),
	time: z.string().optional(),
	underwriter_quiet_expiration_date: z.string().optional(),
	underwriter_quiet_expiration_days: z.number().optional(),
	updated: z.number().optional(),
});

/**
 * Stock split calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-splits
 */
export const BenzingaSplit = z.object({
	id: z.string(),
	cusip: z.string().optional(),
	date_announced: z.string().optional(),
	date_distribution: z.string().optional(),
	date_ex: z.string().optional(),
	date_recorded: z.string().optional(),
	exchange: z.string().optional(),
	importance: z.number().optional(),
	name: z.string().optional(),
	notes: z.string().optional(),
	optionable: z.boolean().optional(),
	ratio: z.string().optional(),
	split_type: z.string().optional(),
	ticker: z.string().optional(),
	updated: z.number().optional(),
});

/**
 * Economic event calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-economics
 */
export const BenzingaEconomic = z.object({
	id: z.string(),
	actual: z.string().optional(),
	actual_t: z.string().optional(),
	confirmed: z.boolean().optional(),
	consensus: z.string().optional(),
	consensus_t: z.string().optional(),
	country: z.string().optional(),
	date: z.string().optional(),
	description: z.string().optional(),
	event_category: z.string().optional(),
	event_name: z.string().optional(),
	event_period: z.string().optional(),
	importance: z.number().optional(),
	notes: z.string().optional(),
	period_year: z.number().optional(),
	prior: z.string().optional(),
	prior_t: z.string().optional(),
	time: z.string().optional(),
	updated: z.number().optional(),
});

/**
 * Conference call calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-conference-calls
 */
export const BenzingaConferenceCall = z.object({
	id: z.string(),
	access_code: z.string().optional(),
	confirmed: z.boolean().optional(),
	cusip: z.string().optional(),
	date: z.string().optional(),
	exchange: z.string().optional(),
	importance: z.number().optional(),
	international_num: z.string().optional(),
	isin: z.string().optional(),
	name: z.string().optional(),
	notes: z.string().optional(),
	period: z.string().optional(),
	period_year: z.number().optional(),
	phone_num: z.string().optional(),
	reservation_num: z.string().optional(),
	start_time: z.string().optional(),
	ticker: z.string().optional(),
	time: z.string().optional(),
	updated: z.number().optional(),
	webcast_url: z.string().optional(),
});

/**
 * Analyst consensus for one ticker. The API response carries no ticker, so
 * `ticker` is the requested symbol and doubles as the entity id.
 * https://docs.benzinga.com/api-reference/calendar-api/get-consensus-ratings
 */
export const BenzingaConsensusRating = z.object({
	ticker: z.string(),
	aggregate_ratings: z
		.object({
			strong_buy: z.number().optional(),
			buy: z.number().optional(),
			hold: z.number().optional(),
			sell: z.number().optional(),
			strong_sell: z.number().optional(),
		})
		.optional(),
	aggregate_type: z.string().optional(),
	consensus_price_target: z.number().optional(),
	consensus_rating: z.string().optional(),
	consensus_rating_val: z.number().optional(),
	high_price_target: z.number().optional(),
	low_price_target: z.number().optional(),
	total_analyst_count: z.number().optional(),
	unique_analyst_count: z.number().optional(),
	updated_at: z.string().optional(),
});

/**
 * Calendar item removed from the feed.
 * https://docs.benzinga.com/api-reference/calendar-api/get-removed
 */
export const BenzingaRemovedCalendarEvent = z.object({
	id: z.string(),
	type: z.string().optional(),
	updated: z.number().optional(),
});

/**
 * News item removed from the feed.
 * https://docs.benzinga.com/api-reference/news-api/get-removed-news
 */
export const BenzingaRemovedNewsItem = z.object({
	id: z.number(),
	updated: z.string().optional(),
});

export const BenzingaEntities = {
	newsArticles: BenzingaNewsArticle,
	newsChannels: BenzingaNewsChannel,
	earnings: BenzingaEarning,
	dividends: BenzingaDividend,
	ratings: BenzingaRating,
	guidance: BenzingaGuidance,
	ipos: BenzingaIpo,
	splits: BenzingaSplit,
	economics: BenzingaEconomic,
	conferenceCalls: BenzingaConferenceCall,
	consensusRatings: BenzingaConsensusRating,
	removedCalendarEvents: BenzingaRemovedCalendarEvent,
	removedNewsItems: BenzingaRemovedNewsItem,
} as const;

export type BenzingaEntities = typeof BenzingaEntities;
