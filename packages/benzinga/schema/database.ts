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
	author: z.string().nullish(),
	created: z.string().nullish(),
	updated: z.string().nullish(),
	title: z.string().nullish(),
	teaser: z.string().nullish(),
	body: z.string().nullish(),
	url: z.string().nullish(),
	image: z
		.array(
			z.object({
				size: z.string().nullish(),
				url: z.string().nullish(),
				alt: z.string().nullish(),
			}),
		)
		.nullish(),
	channels: z.array(z.object({ name: z.string() })).nullish(),
	stocks: z
		.array(
			z.object({
				name: z.string(),
				cusip: z.string().nullish(),
				isin: z.string().nullish(),
				exchange: z.string().nullish(),
				gics: z.string().nullish(),
				gics_code: z.string().nullish(),
				sector: z.string().nullish(),
			}),
		)
		.nullish(),
	tags: z.array(z.object({ name: z.string() })).nullish(),
	importance_rank: z.number().nullish(),
	original_id: z.number().nullish(),
});

/**
 * News channel.
 * https://docs.benzinga.com/api-reference/news-api/channels/get-available-news-channels
 */
export const BenzingaNewsChannel = z.object({
	id: z.number(),
	parent: z.number().nullish(),
	channel: z.string().nullish(),
	weight: z.number().nullish(),
});

/**
 * Earnings calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-earnings
 */
export const BenzingaEarning = z.object({
	id: z.string(),
	currency: z.string().nullish(),
	cusip: z.string().nullish(),
	date: z.string().nullish(),
	date_confirmed: z.number().nullish(),
	eps: z.string().nullish(),
	eps_est: z.string().nullish(),
	eps_prior: z.string().nullish(),
	eps_surprise: z.string().nullish(),
	eps_surprise_percent: z.string().nullish(),
	eps_type: z.string().nullish(),
	exchange: z.string().nullish(),
	importance: z.number().nullish(),
	isin: z.string().nullish(),
	name: z.string().nullish(),
	notes: z.string().nullish(),
	period: z.string().nullish(),
	period_year: z.number().nullish(),
	revenue: z.string().nullish(),
	revenue_est: z.string().nullish(),
	revenue_prior: z.string().nullish(),
	revenue_surprise: z.string().nullish(),
	revenue_surprise_percent: z.string().nullish(),
	revenue_type: z.string().nullish(),
	ticker: z.string().nullish(),
	time: z.string().nullish(),
	updated: z.number().nullish(),
});

/**
 * Dividend calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-dividends
 */
export const BenzingaDividend = z.object({
	id: z.string(),
	confirmed: z.boolean().nullish(),
	currency: z.string().nullish(),
	cusip: z.string().nullish(),
	date: z.string().nullish(),
	dividend: z.string().nullish(),
	dividend_prior: z.string().nullish(),
	dividend_type: z.string().nullish(),
	dividend_yield: z.string().nullish(),
	end_regular_dividend: z.boolean().nullish(),
	ex_dividend_date: z.string().nullish(),
	exchange: z.string().nullish(),
	frequency: z.number().nullish(),
	importance: z.number().nullish(),
	isin: z.string().nullish(),
	name: z.string().nullish(),
	notes: z.string().nullish(),
	payable_date: z.string().nullish(),
	period: z.string().nullish(),
	record_date: z.string().nullish(),
	ticker: z.string().nullish(),
	updated: z.number().nullish(),
	year: z.number().nullish(),
});

/**
 * Analyst rating calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-ratings
 */
export const BenzingaRating = z.object({
	id: z.string(),
	action_company: z.string().nullish(),
	action_pt: z.string().nullish(),
	adjusted_pt_current: z.string().nullish(),
	adjusted_pt_prior: z.string().nullish(),
	analyst: z.string().nullish(),
	analyst_id: z.string().nullish(),
	analyst_name: z.string().nullish(),
	currency: z.string().nullish(),
	cusip: z.string().nullish(),
	date: z.string().nullish(),
	exchange: z.string().nullish(),
	firm_id: z.string().nullish(),
	importance: z.number().nullish(),
	isin: z.string().nullish(),
	name: z.string().nullish(),
	notes: z.string().nullish(),
	pt_current: z.string().nullish(),
	pt_prior: z.string().nullish(),
	rating_current: z.string().nullish(),
	rating_prior: z.string().nullish(),
	ticker: z.string().nullish(),
	time: z.string().nullish(),
	updated: z.number().nullish(),
	url: z.string().nullish(),
	url_calendar: z.string().nullish(),
	url_news: z.string().nullish(),
});

/**
 * Guidance calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-guidance
 */
export const BenzingaGuidance = z.object({
	id: z.string(),
	confirmed: z.boolean().nullish(),
	currency: z.string().nullish(),
	cusip: z.string().nullish(),
	date: z.string().nullish(),
	eps_guidance_est: z.string().nullish(),
	eps_guidance_max: z.string().nullish(),
	eps_guidance_min: z.string().nullish(),
	eps_guidance_prior_max: z.string().nullish(),
	eps_guidance_prior_min: z.string().nullish(),
	eps_type: z.string().nullish(),
	exchange: z.string().nullish(),
	importance: z.number().nullish(),
	is_primary: z.string().nullish(),
	name: z.string().nullish(),
	notes: z.string().nullish(),
	period: z.string().nullish(),
	period_year: z.number().nullish(),
	prelim: z.string().nullish(),
	revenue_guidance_est: z.string().nullish(),
	revenue_guidance_max: z.string().nullish(),
	revenue_guidance_min: z.string().nullish(),
	revenue_guidance_prior_max: z.string().nullish(),
	revenue_guidance_prior_min: z.string().nullish(),
	revenue_type: z.string().nullish(),
	ticker: z.string().nullish(),
	time: z.string().nullish(),
	updated: z.number().nullish(),
});

/**
 * IPO calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-ipos
 */
export const BenzingaIpo = z.object({
	id: z.string(),
	currency: z.string().nullish(),
	cusip: z.string().nullish(),
	date: z.string().nullish(),
	deal_status: z.string().nullish(),
	description: z.string().nullish(),
	exchange: z.string().nullish(),
	initial_filing_date: z.string().nullish(),
	insider_lockup_date: z.string().nullish(),
	insider_lockup_days: z.number().nullish(),
	ipo_type: z.string().nullish(),
	last_yr_income: z.number().nullish(),
	last_yr_income_year: z.number().nullish(),
	last_yr_revenue: z.number().nullish(),
	last_yr_revenue_year: z.number().nullish(),
	lead_underwriters: z.array(z.string()).nullish(),
	market_cap_at_offer: z.number().nullish(),
	name: z.string().nullish(),
	notes: z.string().nullish(),
	offering_shares: z.number().nullish(),
	offering_shares_ord_adr: z.number().nullish(),
	offering_value: z.number().nullish(),
	open_date_verified: z.boolean().nullish(),
	ord_shares_out_after_offer: z.number().nullish(),
	other_underwriters: z.array(z.string()).nullish(),
	price_max: z.string().nullish(),
	price_min: z.string().nullish(),
	price_open: z.string().nullish(),
	price_public_offering: z.string().nullish(),
	pricing_date: z.string().nullish(),
	pricing_date_verified: z.boolean().nullish(),
	sec_accession_number: z.string().nullish(),
	sec_filing_url: z.string().nullish(),
	shares_outstanding: z.number().nullish(),
	sic: z.number().nullish(),
	spac_converted_to_target: z.boolean().nullish(),
	state_location: z.string().nullish(),
	ticker: z.string().nullish(),
	time: z.string().nullish(),
	underwriter_quiet_expiration_date: z.string().nullish(),
	underwriter_quiet_expiration_days: z.number().nullish(),
	updated: z.number().nullish(),
});

/**
 * Stock split calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-splits
 */
export const BenzingaSplit = z.object({
	id: z.string(),
	cusip: z.string().nullish(),
	date_announced: z.string().nullish(),
	date_distribution: z.string().nullish(),
	date_ex: z.string().nullish(),
	date_recorded: z.string().nullish(),
	exchange: z.string().nullish(),
	importance: z.number().nullish(),
	name: z.string().nullish(),
	notes: z.string().nullish(),
	optionable: z.boolean().nullish(),
	ratio: z.string().nullish(),
	split_type: z.string().nullish(),
	ticker: z.string().nullish(),
	updated: z.number().nullish(),
});

/**
 * Economic event calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-economics
 */
export const BenzingaEconomic = z.object({
	id: z.string(),
	actual: z.string().nullish(),
	actual_t: z.string().nullish(),
	confirmed: z.boolean().nullish(),
	consensus: z.string().nullish(),
	consensus_t: z.string().nullish(),
	country: z.string().nullish(),
	date: z.string().nullish(),
	description: z.string().nullish(),
	event_category: z.string().nullish(),
	event_name: z.string().nullish(),
	event_period: z.string().nullish(),
	importance: z.number().nullish(),
	notes: z.string().nullish(),
	period_year: z.number().nullish(),
	prior: z.string().nullish(),
	prior_t: z.string().nullish(),
	time: z.string().nullish(),
	updated: z.number().nullish(),
});

/**
 * Conference call calendar record.
 * https://docs.benzinga.com/api-reference/calendar-api/get-conference-calls
 */
export const BenzingaConferenceCall = z.object({
	id: z.string(),
	access_code: z.string().nullish(),
	confirmed: z.boolean().nullish(),
	cusip: z.string().nullish(),
	date: z.string().nullish(),
	exchange: z.string().nullish(),
	importance: z.number().nullish(),
	international_num: z.string().nullish(),
	isin: z.string().nullish(),
	name: z.string().nullish(),
	notes: z.string().nullish(),
	period: z.string().nullish(),
	period_year: z.number().nullish(),
	phone_num: z.string().nullish(),
	reservation_num: z.string().nullish(),
	start_time: z.string().nullish(),
	ticker: z.string().nullish(),
	time: z.string().nullish(),
	updated: z.number().nullish(),
	webcast_url: z.string().nullish(),
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
			strong_buy: z.number().nullish(),
			buy: z.number().nullish(),
			hold: z.number().nullish(),
			sell: z.number().nullish(),
			strong_sell: z.number().nullish(),
		})
		.nullish(),
	aggregate_type: z.string().nullish(),
	consensus_price_target: z.number().nullish(),
	consensus_rating: z.string().nullish(),
	consensus_rating_val: z.number().nullish(),
	high_price_target: z.number().nullish(),
	low_price_target: z.number().nullish(),
	total_analyst_count: z.number().nullish(),
	unique_analyst_count: z.number().nullish(),
	updated_at: z.string().nullish(),
});

/**
 * Calendar item removed from the feed.
 * https://docs.benzinga.com/api-reference/calendar-api/get-removed
 */
export const BenzingaRemovedCalendarEvent = z.object({
	id: z.string(),
	type: z.string().nullish(),
	updated: z.number().nullish(),
});

/**
 * News item removed from the feed.
 * https://docs.benzinga.com/api-reference/news-api/get-removed-news
 */
export const BenzingaRemovedNewsItem = z.object({
	id: z.number(),
	updated: z.string().nullish(),
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
