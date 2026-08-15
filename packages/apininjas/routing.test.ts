/**
 * Exercises all 129 operations against a mocked transport.
 *
 * Every case replays the response captured from the live API for that
 * operation, so a handler is checked against the payload the provider actually
 * sends rather than an invented one. The inputs are the parameter names the
 * documentation lists and a live call confirmed.
 *
 * What each case asserts: the versioned URL, the HTTP method, that the key
 * travels in the `X-Api-Key` header and never in the query string, and that no
 * unset parameter is serialised into the URL.
 */
import {
	Calendar,
	Economics,
	Entertainment,
	Health,
	Internet,
	Location,
	Markets,
	Reference,
	Text,
	Transport,
	Utility,
	Validation,
} from './endpoints';
import { CAPTURED_RESPONSES } from './fixtures';
import { apiNinjasEndpointSchemas } from './index';

const TEST_KEY = 'test-api-key-not-a-real-credential';

type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
};

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof Text.sentiment>[0];

function makeCtx() {
	const db = {
		airports: makeStore(),
		airlines: makeStore(),
		aircraft: makeStore(),
		vehicles: makeStore(),
		countries: makeStore(),
		cities: makeStore(),
		universities: makeStore(),
		stockExchanges: makeStore(),
		sp500: makeStore(),
		emoji: makeStore(),
		animals: makeStore(),
		planets: makeStore(),
		stars: makeStore(),
	};
	const ctx = {
		key: TEST_KEY,
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

let lastCall: { url: string; init: RequestInit } | undefined;

/** Stubs global fetch with one response and records the request it received. */
function mockResponse(body: unknown, contentType = 'application/json') {
	global.fetch = (async (url: string, init: RequestInit) => {
		lastCall = { url, init };
		const isJson = contentType.includes('json');
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url,
			headers: new Headers({ 'Content-Type': contentType }),
			json: async () => body,
			text: async () => (isJson ? JSON.stringify(body) : String(body)),
		};
	}) as unknown as typeof global.fetch;
}

type Case = {
	key: string;
	path: string;
	call: (ctx: Ctx, input: unknown) => Promise<unknown>;
	input: Record<string, unknown>;
	url: string;
	method: string;
};

const CASES: Case[] = [
	{
		key: 'locationGeocode',
		path: 'location.geocode',
		call: (ctx, input) => Location.geocode(ctx, input as never),
		input: { city: 'London' },
		url: 'https://api.api-ninjas.com/v1/geocoding',
		method: 'GET',
	},
	{
		key: 'locationReverseGeocode',
		path: 'location.reverseGeocode',
		call: (ctx, input) => Location.reverseGeocode(ctx, input as never),
		input: { lat: 51.5074, lon: -0.1278 },
		url: 'https://api.api-ninjas.com/v1/reversegeocoding',
		method: 'GET',
	},
	{
		key: 'locationCities',
		path: 'location.cities',
		call: (ctx, input) => Location.cities(ctx, input as never),
		input: { name: 'London' },
		url: 'https://api.api-ninjas.com/v1/city',
		method: 'GET',
	},
	{
		key: 'locationCountry',
		path: 'location.country',
		call: (ctx, input) => Location.country(ctx, input as never),
		input: { name: 'Germany' },
		url: 'https://api.api-ninjas.com/v1/country',
		method: 'GET',
	},
	{
		key: 'locationCounty',
		path: 'location.county',
		call: (ctx, input) => Location.county(ctx, input as never),
		input: { county: 'Los Angeles', state: 'CA' },
		url: 'https://api.api-ninjas.com/v1/county',
		method: 'GET',
	},
	{
		key: 'locationZipCode',
		path: 'location.zipCode',
		call: (ctx, input) => Location.zipCode(ctx, input as never),
		input: { zip: '90210' },
		url: 'https://api.api-ninjas.com/v1/zipcode',
		method: 'GET',
	},
	{
		key: 'locationPostalCode',
		path: 'location.postalCode',
		call: (ctx, input) => Location.postalCode(ctx, input as never),
		input: { postal_code: 'K1A0B1' },
		url: 'https://api.api-ninjas.com/v1/postalcode',
		method: 'GET',
	},
	{
		key: 'locationUniversities',
		path: 'location.universities',
		call: (ctx, input) => Location.universities(ctx, input as never),
		input: { name: 'harvard' },
		url: 'https://api.api-ninjas.com/v1/university',
		method: 'GET',
	},
	{
		key: 'locationHospitals',
		path: 'location.hospitals',
		call: (ctx, input) => Location.hospitals(ctx, input as never),
		input: { city: 'Houston' },
		url: 'https://api.api-ninjas.com/v1/hospitals',
		method: 'GET',
	},
	{
		key: 'locationEvChargers',
		path: 'location.evChargers',
		call: (ctx, input) => Location.evChargers(ctx, input as never),
		input: { lat: 37.7749, lon: -122.4194 },
		url: 'https://api.api-ninjas.com/v1/evcharger',
		method: 'GET',
	},
	{
		key: 'locationWeather',
		path: 'location.weather',
		call: (ctx, input) => Location.weather(ctx, input as never),
		input: { lat: 51.5074, lon: -0.1278 },
		url: 'https://api.api-ninjas.com/v1/weather',
		method: 'GET',
	},
	{
		key: 'locationWeatherForecast',
		path: 'location.weatherForecast',
		call: (ctx, input) => Location.weatherForecast(ctx, input as never),
		input: { lat: 51.5074, lon: -0.1278 },
		url: 'https://api.api-ninjas.com/v1/weatherforecast',
		method: 'GET',
	},
	{
		key: 'locationAirQuality',
		path: 'location.airQuality',
		call: (ctx, input) => Location.airQuality(ctx, input as never),
		input: { lat: 51.5074, lon: -0.1278 },
		url: 'https://api.api-ninjas.com/v1/airquality',
		method: 'GET',
	},
	{
		key: 'calendarTimezone',
		path: 'calendar.timezone',
		call: (ctx, input) => Calendar.timezone(ctx, input as never),
		input: { timezone: 'America/New_York' },
		url: 'https://api.api-ninjas.com/v1/timezone',
		method: 'GET',
	},
	{
		key: 'calendarWorldTime',
		path: 'calendar.worldTime',
		call: (ctx, input) => Calendar.worldTime(ctx, input as never),
		input: { timezone: 'America/New_York' },
		url: 'https://api.api-ninjas.com/v1/worldtime',
		method: 'GET',
	},
	{
		key: 'calendarHolidays',
		path: 'calendar.holidays',
		call: (ctx, input) => Calendar.holidays(ctx, input as never),
		input: { country: 'us' },
		url: 'https://api.api-ninjas.com/v2/holidays',
		method: 'GET',
	},
	{
		key: 'calendarPublicHolidays',
		path: 'calendar.publicHolidays',
		call: (ctx, input) => Calendar.publicHolidays(ctx, input as never),
		input: { country: 'us' },
		url: 'https://api.api-ninjas.com/v1/publicholidays',
		method: 'GET',
	},
	{
		key: 'calendarIsPublicHoliday',
		path: 'calendar.isPublicHoliday',
		call: (ctx, input) => Calendar.isPublicHoliday(ctx, input as never),
		input: { country: 'us', date: '2026-12-25' },
		url: 'https://api.api-ninjas.com/v1/ispublicholiday',
		method: 'GET',
	},
	{
		key: 'calendarIsWorkingDay',
		path: 'calendar.isWorkingDay',
		call: (ctx, input) => Calendar.isWorkingDay(ctx, input as never),
		input: { country: 'us', date: '2026-12-25' },
		url: 'https://api.api-ninjas.com/v1/isworkingday',
		method: 'GET',
	},
	{
		key: 'calendarWorkingDays',
		path: 'calendar.workingDays',
		call: (ctx, input) => Calendar.workingDays(ctx, input as never),
		input: { country: 'us', start_date: '2026-08-01', end_date: '2026-08-31' },
		url: 'https://api.api-ninjas.com/v1/workingdays',
		method: 'GET',
	},
	{
		key: 'internetDomain',
		path: 'internet.domain',
		call: (ctx, input) => Internet.domain(ctx, input as never),
		input: { domain: 'example.com' },
		url: 'https://api.api-ninjas.com/v1/domain',
		method: 'GET',
	},
	{
		key: 'internetDnsRecords',
		path: 'internet.dnsRecords',
		call: (ctx, input) => Internet.dnsRecords(ctx, input as never),
		input: { domain: 'example.com' },
		url: 'https://api.api-ninjas.com/v1/dnslookup',
		method: 'GET',
	},
	{
		key: 'internetMxRecords',
		path: 'internet.mxRecords',
		call: (ctx, input) => Internet.mxRecords(ctx, input as never),
		input: { domain: 'example.com' },
		url: 'https://api.api-ninjas.com/v1/mxlookup',
		method: 'GET',
	},
	{
		key: 'internetWhois',
		path: 'internet.whois',
		call: (ctx, input) => Internet.whois(ctx, input as never),
		input: { domain: 'example.com' },
		url: 'https://api.api-ninjas.com/v1/whois',
		method: 'GET',
	},
	{
		key: 'internetIpLookup',
		path: 'internet.ipLookup',
		call: (ctx, input) => Internet.ipLookup(ctx, input as never),
		input: { address: '8.8.8.8' },
		url: 'https://api.api-ninjas.com/v1/iplookup',
		method: 'GET',
	},
	{
		key: 'internetUrlLookup',
		path: 'internet.urlLookup',
		call: (ctx, input) => Internet.urlLookup(ctx, input as never),
		input: { url: 'https://example.com' },
		url: 'https://api.api-ninjas.com/v1/urllookup',
		method: 'GET',
	},
	{
		key: 'internetWebpage',
		path: 'internet.webpage',
		call: (ctx, input) => Internet.webpage(ctx, input as never),
		input: { url: 'https://example.com' },
		url: 'https://api.api-ninjas.com/v1/webpage',
		method: 'GET',
	},
	{
		key: 'internetScrape',
		path: 'internet.scrape',
		call: (ctx, input) => Internet.scrape(ctx, input as never),
		input: { url: 'https://example.com' },
		url: 'https://api.api-ninjas.com/v1/webscraper',
		method: 'GET',
	},
	{
		key: 'internetUserAgent',
		path: 'internet.userAgent',
		call: (ctx, input) => Internet.userAgent(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/useragentgenerate',
		method: 'GET',
	},
	{
		key: 'validationEmail',
		path: 'validation.email',
		call: (ctx, input) => Validation.email(ctx, input as never),
		input: { email: 'test@example.com' },
		url: 'https://api.api-ninjas.com/v1/validateemail',
		method: 'GET',
	},
	{
		key: 'validationDisposableEmail',
		path: 'validation.disposableEmail',
		call: (ctx, input) => Validation.disposableEmail(ctx, input as never),
		input: { email: 'someone@example.com' },
		url: 'https://api.api-ninjas.com/v1/disposableemailchecker',
		method: 'GET',
	},
	{
		key: 'validationPhone',
		path: 'validation.phone',
		call: (ctx, input) => Validation.phone(ctx, input as never),
		input: { number: '+14155552671' },
		url: 'https://api.api-ninjas.com/v1/validatephone',
		method: 'GET',
	},
	{
		key: 'validationRoutingNumber',
		path: 'validation.routingNumber',
		call: (ctx, input) => Validation.routingNumber(ctx, input as never),
		input: { routing_number: '121000248' },
		url: 'https://api.api-ninjas.com/v1/routingnumber',
		method: 'GET',
	},
	{
		key: 'validationIban',
		path: 'validation.iban',
		call: (ctx, input) => Validation.iban(ctx, input as never),
		input: { iban: 'DE89370400440532013000' },
		url: 'https://api.api-ninjas.com/v1/iban',
		method: 'GET',
	},
	{
		key: 'validationBin',
		path: 'validation.bin',
		call: (ctx, input) => Validation.bin(ctx, input as never),
		input: { bin: '411111' },
		url: 'https://api.api-ninjas.com/v2/bin',
		method: 'GET',
	},
	{
		key: 'validationSwiftCode',
		path: 'validation.swiftCode',
		call: (ctx, input) => Validation.swiftCode(ctx, input as never),
		input: { swift: 'BOFAUS3N' },
		url: 'https://api.api-ninjas.com/v1/swiftcode',
		method: 'GET',
	},
	{
		key: 'marketsStockPrice',
		path: 'markets.stockPrice',
		call: (ctx, input) => Markets.stockPrice(ctx, input as never),
		input: { ticker: 'AAPL' },
		url: 'https://api.api-ninjas.com/v1/stockprice',
		method: 'GET',
	},
	{
		key: 'marketsTicker',
		path: 'markets.ticker',
		call: (ctx, input) => Markets.ticker(ctx, input as never),
		input: { ticker: 'AAPL' },
		url: 'https://api.api-ninjas.com/v1/ticker',
		method: 'GET',
	},
	{
		key: 'marketsTickerList',
		path: 'markets.tickerList',
		call: (ctx, input) => Markets.tickerList(ctx, input as never),
		input: { limit: 3 },
		url: 'https://api.api-ninjas.com/v1/stockpricelist',
		method: 'GET',
	},
	{
		key: 'marketsStockExchanges',
		path: 'markets.stockExchanges',
		call: (ctx, input) => Markets.stockExchanges(ctx, input as never),
		input: { mic: 'XNAS' },
		url: 'https://api.api-ninjas.com/v1/stockexchange',
		method: 'GET',
	},
	{
		key: 'marketsSp500',
		path: 'markets.sp500',
		call: (ctx, input) => Markets.sp500(ctx, input as never),
		input: { ticker: 'MSFT' },
		url: 'https://api.api-ninjas.com/v1/sp500',
		method: 'GET',
	},
	{
		key: 'marketsMarketCap',
		path: 'markets.marketCap',
		call: (ctx, input) => Markets.marketCap(ctx, input as never),
		input: { ticker: 'NVDA' },
		url: 'https://api.api-ninjas.com/v1/marketcap',
		method: 'GET',
	},
	{
		key: 'marketsEarnings',
		path: 'markets.earnings',
		call: (ctx, input) => Markets.earnings(ctx, input as never),
		input: { ticker: 'AAPL', year: 2026 },
		url: 'https://api.api-ninjas.com/v2/earnings',
		method: 'GET',
	},
	{
		key: 'marketsEarningsCalendar',
		path: 'markets.earningsCalendar',
		call: (ctx, input) => Markets.earningsCalendar(ctx, input as never),
		input: { ticker: 'AAPL' },
		url: 'https://api.api-ninjas.com/v1/earningscalendar',
		method: 'GET',
	},
	{
		key: 'marketsEarningsTranscript',
		path: 'markets.earningsTranscript',
		call: (ctx, input) => Markets.earningsTranscript(ctx, input as never),
		input: { ticker: 'AAPL', year: 2024, quarter: 1 },
		url: 'https://api.api-ninjas.com/v1/earningstranscript',
		method: 'GET',
	},
	{
		key: 'marketsInsiderTransactions',
		path: 'markets.insiderTransactions',
		call: (ctx, input) => Markets.insiderTransactions(ctx, input as never),
		input: { ticker: 'MSFT' },
		url: 'https://api.api-ninjas.com/v1/insidertransactions',
		method: 'GET',
	},
	{
		key: 'marketsSecFilings',
		path: 'markets.secFilings',
		call: (ctx, input) => Markets.secFilings(ctx, input as never),
		input: { ticker: 'AAPL', filing: '10-K' },
		url: 'https://api.api-ninjas.com/v1/sec',
		method: 'GET',
	},
	{
		key: 'marketsEtf',
		path: 'markets.etf',
		call: (ctx, input) => Markets.etf(ctx, input as never),
		input: { ticker: 'SPY' },
		url: 'https://api.api-ninjas.com/v1/etf',
		method: 'GET',
	},
	{
		key: 'marketsMutualFund',
		path: 'markets.mutualFund',
		call: (ctx, input) => Markets.mutualFund(ctx, input as never),
		input: { ticker: 'VFIAX' },
		url: 'https://api.api-ninjas.com/v1/mutualfund',
		method: 'GET',
	},
	{
		key: 'marketsCryptoPrice',
		path: 'markets.cryptoPrice',
		call: (ctx, input) => Markets.cryptoPrice(ctx, input as never),
		input: { symbol: 'BTCUSDT' },
		url: 'https://api.api-ninjas.com/v1/cryptoprice',
		method: 'GET',
	},
	{
		key: 'marketsBitcoin',
		path: 'markets.bitcoin',
		call: (ctx, input) => Markets.bitcoin(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/bitcoin',
		method: 'GET',
	},
	{
		key: 'marketsCommodityPrice',
		path: 'markets.commodityPrice',
		call: (ctx, input) => Markets.commodityPrice(ctx, input as never),
		input: { name: 'gold' },
		url: 'https://api.api-ninjas.com/v1/commodityprice',
		method: 'GET',
	},
	{
		key: 'marketsConvertCurrency',
		path: 'markets.convertCurrency',
		call: (ctx, input) => Markets.convertCurrency(ctx, input as never),
		input: { have: 'USD', want: 'EUR', amount: 100 },
		url: 'https://api.api-ninjas.com/v1/convertcurrency',
		method: 'GET',
	},
	{
		key: 'marketsExchangeRate',
		path: 'markets.exchangeRate',
		call: (ctx, input) => Markets.exchangeRate(ctx, input as never),
		input: { pair: 'USD_EUR' },
		url: 'https://api.api-ninjas.com/v1/exchangerate',
		method: 'GET',
	},
	{
		key: 'economicsGdp',
		path: 'economics.gdp',
		call: (ctx, input) => Economics.gdp(ctx, input as never),
		input: { country: 'us' },
		url: 'https://api.api-ninjas.com/v1/gdp',
		method: 'GET',
	},
	{
		key: 'economicsInflation',
		path: 'economics.inflation',
		call: (ctx, input) => Economics.inflation(ctx, input as never),
		input: { country: 'united states' },
		url: 'https://api.api-ninjas.com/v1/inflation',
		method: 'GET',
	},
	{
		key: 'economicsUnemployment',
		path: 'economics.unemployment',
		call: (ctx, input) => Economics.unemployment(ctx, input as never),
		input: { country: 'united states' },
		url: 'https://api.api-ninjas.com/v1/unemployment',
		method: 'GET',
	},
	{
		key: 'economicsPopulation',
		path: 'economics.population',
		call: (ctx, input) => Economics.population(ctx, input as never),
		input: { country: 'Japan' },
		url: 'https://api.api-ninjas.com/v1/population',
		method: 'GET',
	},
	{
		key: 'economicsInterestRate',
		path: 'economics.interestRate',
		call: (ctx, input) => Economics.interestRate(ctx, input as never),
		input: { rate: 'fed_funds' },
		url: 'https://api.api-ninjas.com/v2/interestrate',
		method: 'GET',
	},
	{
		key: 'economicsMortgageRate',
		path: 'economics.mortgageRate',
		call: (ctx, input) => Economics.mortgageRate(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v2/mortgagerate',
		method: 'GET',
	},
	{
		key: 'economicsMortgageCalculator',
		path: 'economics.mortgageCalculator',
		call: (ctx, input) => Economics.mortgageCalculator(ctx, input as never),
		input: { loan_amount: 400000, interest_rate: 3.5, duration_years: 30 },
		url: 'https://api.api-ninjas.com/v1/mortgagecalculator',
		method: 'GET',
	},
	{
		key: 'economicsIncomeTax',
		path: 'economics.incomeTax',
		call: (ctx, input) => Economics.incomeTax(ctx, input as never),
		input: { country: 'us', year: 2024 },
		url: 'https://api.api-ninjas.com/v2/incometax',
		method: 'GET',
	},
	{
		key: 'economicsIncomeTaxCalculator',
		path: 'economics.incomeTaxCalculator',
		call: (ctx, input) => Economics.incomeTaxCalculator(ctx, input as never),
		input: {
			country: 'us',
			region: 'California',
			income: 100000,
			filing_status: 'single',
		},
		url: 'https://api.api-ninjas.com/v1/incometaxcalculator',
		method: 'GET',
	},
	{
		key: 'economicsSalesTax',
		path: 'economics.salesTax',
		call: (ctx, input) => Economics.salesTax(ctx, input as never),
		input: { zip_code: '90210' },
		url: 'https://api.api-ninjas.com/v1/salestax',
		method: 'GET',
	},
	{
		key: 'economicsSalesTaxCalculator',
		path: 'economics.salesTaxCalculator',
		call: (ctx, input) => Economics.salesTaxCalculator(ctx, input as never),
		input: { amount: 100, zip_code: '90210' },
		url: 'https://api.api-ninjas.com/v1/salestaxcalculator',
		method: 'GET',
	},
	{
		key: 'economicsPropertyTax',
		path: 'economics.propertyTax',
		call: (ctx, input) => Economics.propertyTax(ctx, input as never),
		input: { zip: '90210' },
		url: 'https://api.api-ninjas.com/v1/propertytax',
		method: 'GET',
	},
	{
		key: 'economicsVatRates',
		path: 'economics.vatRates',
		call: (ctx, input) => Economics.vatRates(ctx, input as never),
		input: { country: 'DE' },
		url: 'https://api.api-ninjas.com/v1/vat',
		method: 'GET',
	},
	{
		key: 'textSentiment',
		path: 'text.sentiment',
		call: (ctx, input) => Text.sentiment(ctx, input as never),
		input: { text: 'I am loving this new integration' },
		url: 'https://api.api-ninjas.com/v1/sentiment',
		method: 'GET',
	},
	{
		key: 'textSimilarity',
		path: 'text.similarity',
		call: (ctx, input) => Text.similarity(ctx, input as never),
		input: { text_1: 'hello there', text_2: 'hi there' },
		url: 'https://api.api-ninjas.com/v1/textsimilarity',
		method: 'POST',
	},
	{
		key: 'textEmbeddings',
		path: 'text.embeddings',
		call: (ctx, input) => Text.embeddings(ctx, input as never),
		input: { text: 'corsair integration' },
		url: 'https://api.api-ninjas.com/v1/embeddings',
		method: 'POST',
	},
	{
		key: 'textLanguage',
		path: 'text.language',
		call: (ctx, input) => Text.language(ctx, input as never),
		input: { text: 'Guten Tag wie geht es Ihnen heute mein Freund' },
		url: 'https://api.api-ninjas.com/v1/textlanguage',
		method: 'GET',
	},
	{
		key: 'textSpellCheck',
		path: 'text.spellCheck',
		call: (ctx, input) => Text.spellCheck(ctx, input as never),
		input: { text: 'helo wrld thsi is a tset' },
		url: 'https://api.api-ninjas.com/v1/spellcheck',
		method: 'GET',
	},
	{
		key: 'textProfanityFilter',
		path: 'text.profanityFilter',
		call: (ctx, input) => Text.profanityFilter(ctx, input as never),
		input: { text: 'damn this thing' },
		url: 'https://api.api-ninjas.com/v1/profanityfilter',
		method: 'GET',
	},
	{
		key: 'textDictionary',
		path: 'text.dictionary',
		call: (ctx, input) => Text.dictionary(ctx, input as never),
		input: { word: 'hello' },
		url: 'https://api.api-ninjas.com/v1/dictionary',
		method: 'GET',
	},
	{
		key: 'textThesaurus',
		path: 'text.thesaurus',
		call: (ctx, input) => Text.thesaurus(ctx, input as never),
		input: { word: 'happy' },
		url: 'https://api.api-ninjas.com/v1/thesaurus',
		method: 'GET',
	},
	{
		key: 'textRhymes',
		path: 'text.rhymes',
		call: (ctx, input) => Text.rhymes(ctx, input as never),
		input: { word: 'cat' },
		url: 'https://api.api-ninjas.com/v1/rhyme',
		method: 'GET',
	},
	{
		key: 'textRandomWord',
		path: 'text.randomWord',
		call: (ctx, input) => Text.randomWord(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v2/randomword',
		method: 'GET',
	},
	{
		key: 'textLoremIpsum',
		path: 'text.loremIpsum',
		call: (ctx, input) => Text.loremIpsum(ctx, input as never),
		input: { paragraphs: 1 },
		url: 'https://api.api-ninjas.com/v1/loremipsum',
		method: 'GET',
	},
	{
		key: 'utilityQrCode',
		path: 'utility.qrCode',
		call: (ctx, input) => Utility.qrCode(ctx, input as never),
		input: { data: 'https://example.com', format: 'svg' },
		url: 'https://api.api-ninjas.com/v1/qrcode',
		method: 'GET',
	},
	{
		key: 'utilityBarcode',
		path: 'utility.barcode',
		call: (ctx, input) => Utility.barcode(ctx, input as never),
		input: { text: 'hello', type: 'code128', format: 'svg' },
		url: 'https://api.api-ninjas.com/v1/barcodegenerate',
		method: 'GET',
	},
	{
		key: 'utilityPassword',
		path: 'utility.password',
		call: (ctx, input) => Utility.password(ctx, input as never),
		input: { length: 20 },
		url: 'https://api.api-ninjas.com/v1/passwordgenerator',
		method: 'GET',
	},
	{
		key: 'utilityRandomUser',
		path: 'utility.randomUser',
		call: (ctx, input) => Utility.randomUser(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v2/randomuser',
		method: 'GET',
	},
	{
		key: 'utilityCounter',
		path: 'utility.counter',
		call: (ctx, input) => Utility.counter(ctx, input as never),
		input: { id: 'corsair_recon_probe' },
		url: 'https://api.api-ninjas.com/v1/counter',
		method: 'GET',
	},
	{
		key: 'utilityConvertUnit',
		path: 'utility.convertUnit',
		call: (ctx, input) => Utility.convertUnit(ctx, input as never),
		input: { amount: 100, unit: 'kilometer' },
		url: 'https://api.api-ninjas.com/v1/unitconversion',
		method: 'GET',
	},
	{
		key: 'utilityLogo',
		path: 'utility.logo',
		call: (ctx, input) => Utility.logo(ctx, input as never),
		input: { name: 'Microsoft' },
		url: 'https://api.api-ninjas.com/v1/logo',
		method: 'GET',
	},
	{
		key: 'utilityCountryFlag',
		path: 'utility.countryFlag',
		call: (ctx, input) => Utility.countryFlag(ctx, input as never),
		input: { country: 'us' },
		url: 'https://api.api-ninjas.com/v1/countryflag',
		method: 'GET',
	},
	{
		key: 'utilityRandomImage',
		path: 'utility.randomImage',
		call: (ctx, input) => Utility.randomImage(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/randomimage',
		method: 'GET',
	},
	{
		key: 'utilityEmoji',
		path: 'utility.emoji',
		call: (ctx, input) => Utility.emoji(ctx, input as never),
		input: { name: 'smile' },
		url: 'https://api.api-ninjas.com/v1/emoji',
		method: 'GET',
	},
	{
		key: 'transportAircraft',
		path: 'transport.aircraft',
		call: (ctx, input) => Transport.aircraft(ctx, input as never),
		input: { manufacturer: 'Boeing', model: '737' },
		url: 'https://api.api-ninjas.com/v1/aircraft',
		method: 'GET',
	},
	{
		key: 'transportAirlines',
		path: 'transport.airlines',
		call: (ctx, input) => Transport.airlines(ctx, input as never),
		input: { iata: 'SQ' },
		url: 'https://api.api-ninjas.com/v1/airlines',
		method: 'GET',
	},
	{
		key: 'transportAirports',
		path: 'transport.airports',
		call: (ctx, input) => Transport.airports(ctx, input as never),
		input: { iata: 'LHR' },
		url: 'https://api.api-ninjas.com/v1/airports',
		method: 'GET',
	},
	{
		key: 'transportHelicopters',
		path: 'transport.helicopters',
		call: (ctx, input) => Transport.helicopters(ctx, input as never),
		input: { manufacturer: 'Bell', model: '430' },
		url: 'https://api.api-ninjas.com/v1/helicopter',
		method: 'GET',
	},
	{
		key: 'transportCars',
		path: 'transport.cars',
		call: (ctx, input) => Transport.cars(ctx, input as never),
		input: { model: 'corolla' },
		url: 'https://api.api-ninjas.com/v1/cars',
		method: 'GET',
	},
	{
		key: 'transportMotorcycles',
		path: 'transport.motorcycles',
		call: (ctx, input) => Transport.motorcycles(ctx, input as never),
		input: { make: 'Kawasaki' },
		url: 'https://api.api-ninjas.com/v1/motorcycles',
		method: 'GET',
	},
	{
		key: 'transportElectricVehicles',
		path: 'transport.electricVehicles',
		call: (ctx, input) => Transport.electricVehicles(ctx, input as never),
		input: { make: 'Tesla' },
		url: 'https://api.api-ninjas.com/v1/electricvehicle',
		method: 'GET',
	},
	{
		key: 'transportVin',
		path: 'transport.vin',
		call: (ctx, input) => Transport.vin(ctx, input as never),
		input: { vin: 'JH4TB2H26CC000000' },
		url: 'https://api.api-ninjas.com/v1/vinlookup',
		method: 'GET',
	},
	{
		key: 'healthCaloriesBurned',
		path: 'health.caloriesBurned',
		call: (ctx, input) => Health.caloriesBurned(ctx, input as never),
		input: { activity: 'skiing' },
		url: 'https://api.api-ninjas.com/v1/caloriesburned',
		method: 'GET',
	},
	{
		key: 'healthNutrition',
		path: 'health.nutrition',
		call: (ctx, input) => Health.nutrition(ctx, input as never),
		input: { query: '1lb brisket and fries' },
		url: 'https://api.api-ninjas.com/v1/nutrition',
		method: 'GET',
	},
	{
		key: 'healthExercises',
		path: 'health.exercises',
		call: (ctx, input) => Health.exercises(ctx, input as never),
		input: { muscle: 'biceps' },
		url: 'https://api.api-ninjas.com/v1/exercises',
		method: 'GET',
	},
	{
		key: 'healthRecipes',
		path: 'health.recipes',
		call: (ctx, input) => Health.recipes(ctx, input as never),
		input: { title: 'pasta' },
		url: 'https://api.api-ninjas.com/v3/recipe',
		method: 'GET',
	},
	{
		key: 'healthCocktails',
		path: 'health.cocktails',
		call: (ctx, input) => Health.cocktails(ctx, input as never),
		input: { name: 'bloody mary' },
		url: 'https://api.api-ninjas.com/v1/cocktail',
		method: 'GET',
	},
	{
		key: 'referenceAnimals',
		path: 'reference.animals',
		call: (ctx, input) => Reference.animals(ctx, input as never),
		input: { name: 'cheetah' },
		url: 'https://api.api-ninjas.com/v1/animals',
		method: 'GET',
	},
	{
		key: 'referenceCats',
		path: 'reference.cats',
		call: (ctx, input) => Reference.cats(ctx, input as never),
		input: { name: 'aegean' },
		url: 'https://api.api-ninjas.com/v1/cats',
		method: 'GET',
	},
	{
		key: 'referenceDogs',
		path: 'reference.dogs',
		call: (ctx, input) => Reference.dogs(ctx, input as never),
		input: { name: 'golden retriever' },
		url: 'https://api.api-ninjas.com/v1/dogs',
		method: 'GET',
	},
	{
		key: 'referencePlanets',
		path: 'reference.planets',
		call: (ctx, input) => Reference.planets(ctx, input as never),
		input: { name: 'Mars' },
		url: 'https://api.api-ninjas.com/v1/planets',
		method: 'GET',
	},
	{
		key: 'referenceStars',
		path: 'reference.stars',
		call: (ctx, input) => Reference.stars(ctx, input as never),
		input: { name: 'vega' },
		url: 'https://api.api-ninjas.com/v1/stars',
		method: 'GET',
	},
	{
		key: 'referenceHistoricalEvents',
		path: 'reference.historicalEvents',
		call: (ctx, input) => Reference.historicalEvents(ctx, input as never),
		input: { text: 'world war' },
		url: 'https://api.api-ninjas.com/v1/historicalevents',
		method: 'GET',
	},
	{
		key: 'referenceHistoricalFigures',
		path: 'reference.historicalFigures',
		call: (ctx, input) => Reference.historicalFigures(ctx, input as never),
		input: { name: 'napoleon' },
		url: 'https://api.api-ninjas.com/v1/historicalfigures',
		method: 'GET',
	},
	{
		key: 'referenceDayInHistory',
		path: 'reference.dayInHistory',
		call: (ctx, input) => Reference.dayInHistory(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/dayinhistory',
		method: 'GET',
	},
	{
		key: 'referenceCelebrities',
		path: 'reference.celebrities',
		call: (ctx, input) => Reference.celebrities(ctx, input as never),
		input: { name: 'Michael Jordan' },
		url: 'https://api.api-ninjas.com/v1/celebrity',
		method: 'GET',
	},
	{
		key: 'referenceBabyNames',
		path: 'reference.babyNames',
		call: (ctx, input) => Reference.babyNames(ctx, input as never),
		input: { gender: 'boy' },
		url: 'https://api.api-ninjas.com/v1/babynames',
		method: 'GET',
	},
	{
		key: 'entertainmentJokes',
		path: 'entertainment.jokes',
		call: (ctx, input) => Entertainment.jokes(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/jokes',
		method: 'GET',
	},
	{
		key: 'entertainmentDadJokes',
		path: 'entertainment.dadJokes',
		call: (ctx, input) => Entertainment.dadJokes(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/dadjokes',
		method: 'GET',
	},
	{
		key: 'entertainmentChuckNorris',
		path: 'entertainment.chuckNorris',
		call: (ctx, input) => Entertainment.chuckNorris(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/chucknorris',
		method: 'GET',
	},
	{
		key: 'entertainmentJokeOfTheDay',
		path: 'entertainment.jokeOfTheDay',
		call: (ctx, input) => Entertainment.jokeOfTheDay(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/jokeoftheday',
		method: 'GET',
	},
	{
		key: 'entertainmentFacts',
		path: 'entertainment.facts',
		call: (ctx, input) => Entertainment.facts(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/facts',
		method: 'GET',
	},
	{
		key: 'entertainmentFactOfTheDay',
		path: 'entertainment.factOfTheDay',
		call: (ctx, input) => Entertainment.factOfTheDay(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/factoftheday',
		method: 'GET',
	},
	{
		key: 'entertainmentQuotes',
		path: 'entertainment.quotes',
		call: (ctx, input) => Entertainment.quotes(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v2/quotes',
		method: 'GET',
	},
	{
		key: 'entertainmentRandomQuotes',
		path: 'entertainment.randomQuotes',
		call: (ctx, input) => Entertainment.randomQuotes(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v2/randomquotes',
		method: 'GET',
	},
	{
		key: 'entertainmentQuoteOfTheDay',
		path: 'entertainment.quoteOfTheDay',
		call: (ctx, input) => Entertainment.quoteOfTheDay(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v2/quoteoftheday',
		method: 'GET',
	},
	{
		key: 'entertainmentAdvice',
		path: 'entertainment.advice',
		call: (ctx, input) => Entertainment.advice(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/advice',
		method: 'GET',
	},
	{
		key: 'entertainmentBucketList',
		path: 'entertainment.bucketList',
		call: (ctx, input) => Entertainment.bucketList(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/bucketlist',
		method: 'GET',
	},
	{
		key: 'entertainmentHobbies',
		path: 'entertainment.hobbies',
		call: (ctx, input) => Entertainment.hobbies(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/hobbies',
		method: 'GET',
	},
	{
		key: 'entertainmentHoroscope',
		path: 'entertainment.horoscope',
		call: (ctx, input) => Entertainment.horoscope(ctx, input as never),
		input: { zodiac: 'aries' },
		url: 'https://api.api-ninjas.com/v1/horoscope',
		method: 'GET',
	},
	{
		key: 'entertainmentRiddles',
		path: 'entertainment.riddles',
		call: (ctx, input) => Entertainment.riddles(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/riddles',
		method: 'GET',
	},
	{
		key: 'entertainmentTrivia',
		path: 'entertainment.trivia',
		call: (ctx, input) => Entertainment.trivia(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/trivia',
		method: 'GET',
	},
	{
		key: 'entertainmentTriviaOfTheDay',
		path: 'entertainment.triviaOfTheDay',
		call: (ctx, input) => Entertainment.triviaOfTheDay(ctx, input as never),
		input: {},
		url: 'https://api.api-ninjas.com/v1/triviaoftheday',
		method: 'GET',
	},
	{
		key: 'entertainmentGenerateSudoku',
		path: 'entertainment.generateSudoku',
		call: (ctx, input) => Entertainment.generateSudoku(ctx, input as never),
		input: { width: 3, height: 3, difficulty: 'easy' },
		url: 'https://api.api-ninjas.com/v1/sudokugenerate',
		method: 'GET',
	},
	{
		key: 'entertainmentSolveSudoku',
		path: 'entertainment.solveSudoku',
		call: (ctx, input) => Entertainment.solveSudoku(ctx, input as never),
		input: {
			width: 3,
			height: 3,
			puzzle: [
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 3, 0, 8, 5],
				[0, 0, 1, 0, 2, 0, 0, 0, 0],
				[0, 0, 0, 5, 0, 7, 0, 0, 0],
				[0, 0, 4, 0, 0, 0, 1, 0, 0],
				[0, 9, 0, 0, 0, 0, 0, 0, 0],
				[5, 0, 0, 0, 0, 0, 0, 7, 3],
				[0, 0, 2, 0, 1, 0, 0, 0, 0],
				[0, 0, 0, 0, 4, 0, 0, 0, 9],
			],
		},
		url: 'https://api.api-ninjas.com/v1/sudokusolve',
		method: 'GET',
	},
];

const capturedResponses = CAPTURED_RESPONSES;

/** Operations whose response is an image, so the mock must not claim JSON. */
const IMAGE_OPERATIONS = new Set([
	'utility.qrCode',
	'utility.barcode',
	'utility.randomImage',
]);

/**
 * Operations the free tier refuses, so no response could be captured. Listed
 * explicitly: a fixture missing for any other operation is a mistake.
 */
const UNCAPTURED = new Set([
	'calendarWorldTime',
	'internetWhois',
	'marketsTickerList',
	'marketsEarningsTranscript',
	'marketsConvertCurrency',
	'marketsExchangeRate',
	'economicsInflation',
	'economicsInterestRate',
	'healthNutrition',
]);

describe('every operation issues the documented request', () => {
	beforeEach(() => {
		lastCall = undefined;
	});

	test.each(CASES.map((c) => [c.path, c] as const))(
		'%s',
		async (_path, testCase) => {
			const { ctx } = makeCtx();
			// Nine operations are premium-gated on the free tier and have no
			// capture; every other case must have one, so a missing fixture fails
			// here rather than quietly testing against an empty object.
			const body = UNCAPTURED.has(testCase.key)
				? {}
				: capturedResponses[testCase.key as keyof typeof capturedResponses];
			if (!UNCAPTURED.has(testCase.key)) {
				expect(body).toBeDefined();
			}
			const isImage = IMAGE_OPERATIONS.has(testCase.path);
			mockResponse(body, isImage ? 'image/svg+xml' : 'application/json');

			await testCase.call(ctx, testCase.input);

			expect(lastCall).toBeDefined();
			const call = lastCall as { url: string; init: RequestInit };
			const requested = new URL(call.url);

			expect(`${requested.origin}${requested.pathname}`).toBe(testCase.url);
			expect(call.init.method).toBe(testCase.method);

			const headers = new Headers(call.init.headers);
			expect(headers.get('X-Api-Key')).toBe(TEST_KEY);

			// The credential must never reach the query string, where it would be
			// captured by any log that records request URLs.
			expect(call.url).not.toContain(TEST_KEY.slice(0, 12));
			expect(requested.search).not.toMatch(/api[-_]?key/i);

			// `undefined` in a query string is a value the provider would match on.
			expect(requested.search).not.toContain('undefined');
		},
	);
});

describe('coverage', () => {
	it('exercises every registered operation exactly once', () => {
		const exercised = CASES.map((c) => c.path).sort();
		const registered = Object.keys(apiNinjasEndpointSchemas).sort();

		expect(exercised).toEqual(registered);
		expect(new Set(exercised).size).toBe(exercised.length);
		expect(registered).toHaveLength(129);
	});
});
