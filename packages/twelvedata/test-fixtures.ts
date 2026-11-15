/**
 * Shapes from live responses and the provider's error bodies.
 *
 * The reference lists below are trimmed copies of what the open routes returned;
 * the error bodies are what a probe with a bogus key returned.
 */

export const stock = {
	symbol: 'AAPL',
	name: 'Apple Inc.',
	currency: 'EUR',
	exchange: 'VSE',
	mic_code: 'XWBO',
	country: 'Austria',
	type: 'Common Stock',
	figi_code: 'BBG00GQ6RZH7',
	cfi_code: 'ESVUFR',
	isin: 'request_access_via_add_ons',
	cusip: 'request_access_via_add_ons',
};

export const stocksList = {
	data: [stock, { ...stock, exchange: 'BVC', country: 'Colombia' }],
};

export const forexPair = {
	symbol: 'EUR/AED',
	currency_group: 'Exotic-Cross',
	currency_base: 'Euro',
	currency_quote: 'UAE Dirham',
};

export const forexPairsList = { data: [forexPair] };

export const cryptoPair = {
	symbol: '0xBTC/USD',
	available_exchanges: ['Bittrex', 'HitBTC'],
	currency_base: '0xBitcoin',
	currency_quote: 'US Dollar',
};

export const cryptoList = { data: [cryptoPair] };

export const exchange = {
	title: 'Investors Exchange',
	name: 'IEX',
	code: 'IEXG',
	country: 'United States',
	timezone: 'America/New_York',
};

export const exchangesList = { data: [exchange] };

/** A quote, where every number is a string. */
export const quote = {
	symbol: 'AAPL',
	name: 'Apple Inc.',
	exchange: 'NASDAQ',
	mic_code: 'XNGS',
	currency: 'USD',
	datetime: '2026-05-01',
	timestamp: 1777000000,
	open: '208.25',
	high: '211.66',
	low: '207.20',
	close: '211.00',
	volume: '38214000',
	previous_close: '208.00',
	change: '3.00000',
	percent_change: '1.44231',
	average_volume: '45000000',
	is_market_open: false,
	fifty_two_week: { low: '164.08', high: '260.10' },
};

/** The smallest answer: one symbol, one value. */
export const price = { price: '211.66000' };

export const timeSeries = {
	meta: {
		symbol: 'AAPL',
		interval: '1day',
		currency: 'USD',
		exchange: 'NASDAQ',
		type: 'Common Stock',
	},
	values: [
		{
			datetime: '2026-05-01',
			open: '208.25',
			high: '211.66',
			low: '207.20',
			close: '211.00',
			volume: '38214000',
		},
		{
			datetime: '2026-04-30',
			open: '206.00',
			high: '209.10',
			low: '205.50',
			close: '208.00',
			volume: '41200000',
		},
	],
	status: 'ok',
};

export const exchangeRate = {
	symbol: 'EUR/USD',
	rate: '1.08542',
	timestamp: 1777000000,
};

export const apiUsage = {
	timestamp: '2026-05-01 10:00:00',
	current_usage: 42,
	plan_limit: 800,
};

/** An indicator: a different set of decimal strings per indicator. */
export const rsiSeries = {
	meta: { symbol: 'AAPL', interval: '1day', indicator: 'rsi' },
	values: [
		{ datetime: '2026-05-01', rsi: '62.34189' },
		{ datetime: '2026-04-30', rsi: '58.11234' },
	],
	status: 'ok',
};

export const macdSeries = {
	meta: { symbol: 'AAPL', interval: '1day', indicator: 'macd' },
	values: [
		{
			datetime: '2026-05-01',
			macd: '1.23456',
			macd_signal: '0.98765',
			macd_hist: '0.24691',
		},
	],
	status: 'ok',
};

// ---------------------------------------------------------------------------
// error bodies, copied from live probes
// ---------------------------------------------------------------------------

/** A missing or wrong key, answered with 401. */
export const badKey = {
	code: 401,
	message:
		'**apikey** parameter is incorrect or not specified. You can get your free API key instantly following this link: https://twelvedata.com/pricing',
	status: 'error',
};

/** A plan that does not include the endpoint, answered with 403. */
export const planLimit = {
	code: 403,
	message:
		'/earnings is available exclusively with grow or pro or ultra or venture plans',
	status: 'error',
};

/** A 200 whose body still says the request failed. */
export const symbolNotFound = {
	code: 400,
	message: '**symbol** parameter is incorrect or not specified',
	status: 'error',
};

/** A batch answer where one symbol failed and the others did not. */
export const partialBatch = {
	AAPL: { symbol: 'AAPL', close: '211.00', status: 'ok' },
	BAD: { code: 400, message: 'symbol not found', status: 'error' },
};
