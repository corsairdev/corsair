import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
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
import type {
	ApiNinjasEndpointInputs,
	ApiNinjasEndpointOutputs,
} from './endpoints/types';
import {
	ApiNinjasEndpointInputSchemas,
	ApiNinjasEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ApiNinjasSchema } from './schema';

/**
 * API Ninjas exposes about 150 unrelated single-fact services behind one API
 * key: weather, geocoding, market data, tax rates, dictionary lookups,
 * validation, generators. This plugin covers the 129 operations listed in the
 * Corsair catalog.
 *
 * Two provider behaviours are worth knowing before reading the endpoints:
 *
 * - Almost every failure is a `400`. A missing key, an invalid key, a
 *   premium-gated endpoint, an exhausted monthly quota and an ordinary bad
 *   parameter all share that status, so `error-handlers.ts` reads the body
 *   rather than the status.
 * - The free tier answers `200` with prose in place of values it withholds,
 *   so output schemas accept both the documented type and a string.
 *
 * @see https://api-ninjas.com/api
 */

export type ApiNinjasPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalApiNinjasPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apiNinjasEndpointsNested>;
};

export type ApiNinjasContext = CorsairPluginContext<
	typeof ApiNinjasSchema,
	ApiNinjasPluginOptions
>;

export type ApiNinjasKeyBuilderContext =
	KeyBuilderContext<ApiNinjasPluginOptions>;

export type ApiNinjasBoundEndpoints = BindEndpoints<
	typeof apiNinjasEndpointsNested
>;

type ApiNinjasEndpoint<K extends keyof ApiNinjasEndpointOutputs> =
	CorsairEndpoint<
		ApiNinjasContext,
		ApiNinjasEndpointInputs[K],
		ApiNinjasEndpointOutputs[K]
	>;

export type ApiNinjasEndpoints = {
	locationGeocode: ApiNinjasEndpoint<'locationGeocode'>;
	locationReverseGeocode: ApiNinjasEndpoint<'locationReverseGeocode'>;
	locationCities: ApiNinjasEndpoint<'locationCities'>;
	locationCountry: ApiNinjasEndpoint<'locationCountry'>;
	locationCounty: ApiNinjasEndpoint<'locationCounty'>;
	locationZipCode: ApiNinjasEndpoint<'locationZipCode'>;
	locationPostalCode: ApiNinjasEndpoint<'locationPostalCode'>;
	locationUniversities: ApiNinjasEndpoint<'locationUniversities'>;
	locationHospitals: ApiNinjasEndpoint<'locationHospitals'>;
	locationEvChargers: ApiNinjasEndpoint<'locationEvChargers'>;
	locationWeather: ApiNinjasEndpoint<'locationWeather'>;
	locationWeatherForecast: ApiNinjasEndpoint<'locationWeatherForecast'>;
	locationAirQuality: ApiNinjasEndpoint<'locationAirQuality'>;
	calendarTimezone: ApiNinjasEndpoint<'calendarTimezone'>;
	calendarWorldTime: ApiNinjasEndpoint<'calendarWorldTime'>;
	calendarHolidays: ApiNinjasEndpoint<'calendarHolidays'>;
	calendarPublicHolidays: ApiNinjasEndpoint<'calendarPublicHolidays'>;
	calendarIsPublicHoliday: ApiNinjasEndpoint<'calendarIsPublicHoliday'>;
	calendarIsWorkingDay: ApiNinjasEndpoint<'calendarIsWorkingDay'>;
	calendarWorkingDays: ApiNinjasEndpoint<'calendarWorkingDays'>;
	internetDomain: ApiNinjasEndpoint<'internetDomain'>;
	internetDnsRecords: ApiNinjasEndpoint<'internetDnsRecords'>;
	internetMxRecords: ApiNinjasEndpoint<'internetMxRecords'>;
	internetWhois: ApiNinjasEndpoint<'internetWhois'>;
	internetIpLookup: ApiNinjasEndpoint<'internetIpLookup'>;
	internetUrlLookup: ApiNinjasEndpoint<'internetUrlLookup'>;
	internetWebpage: ApiNinjasEndpoint<'internetWebpage'>;
	internetScrape: ApiNinjasEndpoint<'internetScrape'>;
	internetUserAgent: ApiNinjasEndpoint<'internetUserAgent'>;
	validationEmail: ApiNinjasEndpoint<'validationEmail'>;
	validationDisposableEmail: ApiNinjasEndpoint<'validationDisposableEmail'>;
	validationPhone: ApiNinjasEndpoint<'validationPhone'>;
	validationRoutingNumber: ApiNinjasEndpoint<'validationRoutingNumber'>;
	validationIban: ApiNinjasEndpoint<'validationIban'>;
	validationBin: ApiNinjasEndpoint<'validationBin'>;
	validationSwiftCode: ApiNinjasEndpoint<'validationSwiftCode'>;
	marketsStockPrice: ApiNinjasEndpoint<'marketsStockPrice'>;
	marketsTicker: ApiNinjasEndpoint<'marketsTicker'>;
	marketsTickerList: ApiNinjasEndpoint<'marketsTickerList'>;
	marketsStockExchanges: ApiNinjasEndpoint<'marketsStockExchanges'>;
	marketsSp500: ApiNinjasEndpoint<'marketsSp500'>;
	marketsMarketCap: ApiNinjasEndpoint<'marketsMarketCap'>;
	marketsEarnings: ApiNinjasEndpoint<'marketsEarnings'>;
	marketsEarningsCalendar: ApiNinjasEndpoint<'marketsEarningsCalendar'>;
	marketsEarningsTranscript: ApiNinjasEndpoint<'marketsEarningsTranscript'>;
	marketsInsiderTransactions: ApiNinjasEndpoint<'marketsInsiderTransactions'>;
	marketsSecFilings: ApiNinjasEndpoint<'marketsSecFilings'>;
	marketsEtf: ApiNinjasEndpoint<'marketsEtf'>;
	marketsMutualFund: ApiNinjasEndpoint<'marketsMutualFund'>;
	marketsCryptoPrice: ApiNinjasEndpoint<'marketsCryptoPrice'>;
	marketsBitcoin: ApiNinjasEndpoint<'marketsBitcoin'>;
	marketsCommodityPrice: ApiNinjasEndpoint<'marketsCommodityPrice'>;
	marketsConvertCurrency: ApiNinjasEndpoint<'marketsConvertCurrency'>;
	marketsExchangeRate: ApiNinjasEndpoint<'marketsExchangeRate'>;
	economicsGdp: ApiNinjasEndpoint<'economicsGdp'>;
	economicsInflation: ApiNinjasEndpoint<'economicsInflation'>;
	economicsUnemployment: ApiNinjasEndpoint<'economicsUnemployment'>;
	economicsPopulation: ApiNinjasEndpoint<'economicsPopulation'>;
	economicsInterestRate: ApiNinjasEndpoint<'economicsInterestRate'>;
	economicsMortgageRate: ApiNinjasEndpoint<'economicsMortgageRate'>;
	economicsMortgageCalculator: ApiNinjasEndpoint<'economicsMortgageCalculator'>;
	economicsIncomeTax: ApiNinjasEndpoint<'economicsIncomeTax'>;
	economicsIncomeTaxCalculator: ApiNinjasEndpoint<'economicsIncomeTaxCalculator'>;
	economicsSalesTax: ApiNinjasEndpoint<'economicsSalesTax'>;
	economicsSalesTaxCalculator: ApiNinjasEndpoint<'economicsSalesTaxCalculator'>;
	economicsPropertyTax: ApiNinjasEndpoint<'economicsPropertyTax'>;
	economicsVatRates: ApiNinjasEndpoint<'economicsVatRates'>;
	textSentiment: ApiNinjasEndpoint<'textSentiment'>;
	textSimilarity: ApiNinjasEndpoint<'textSimilarity'>;
	textEmbeddings: ApiNinjasEndpoint<'textEmbeddings'>;
	textLanguage: ApiNinjasEndpoint<'textLanguage'>;
	textSpellCheck: ApiNinjasEndpoint<'textSpellCheck'>;
	textProfanityFilter: ApiNinjasEndpoint<'textProfanityFilter'>;
	textDictionary: ApiNinjasEndpoint<'textDictionary'>;
	textThesaurus: ApiNinjasEndpoint<'textThesaurus'>;
	textRhymes: ApiNinjasEndpoint<'textRhymes'>;
	textRandomWord: ApiNinjasEndpoint<'textRandomWord'>;
	textLoremIpsum: ApiNinjasEndpoint<'textLoremIpsum'>;
	utilityQrCode: ApiNinjasEndpoint<'utilityQrCode'>;
	utilityBarcode: ApiNinjasEndpoint<'utilityBarcode'>;
	utilityPassword: ApiNinjasEndpoint<'utilityPassword'>;
	utilityRandomUser: ApiNinjasEndpoint<'utilityRandomUser'>;
	utilityCounter: ApiNinjasEndpoint<'utilityCounter'>;
	utilityConvertUnit: ApiNinjasEndpoint<'utilityConvertUnit'>;
	utilityLogo: ApiNinjasEndpoint<'utilityLogo'>;
	utilityCountryFlag: ApiNinjasEndpoint<'utilityCountryFlag'>;
	utilityRandomImage: ApiNinjasEndpoint<'utilityRandomImage'>;
	utilityEmoji: ApiNinjasEndpoint<'utilityEmoji'>;
	transportAircraft: ApiNinjasEndpoint<'transportAircraft'>;
	transportAirlines: ApiNinjasEndpoint<'transportAirlines'>;
	transportAirports: ApiNinjasEndpoint<'transportAirports'>;
	transportHelicopters: ApiNinjasEndpoint<'transportHelicopters'>;
	transportCars: ApiNinjasEndpoint<'transportCars'>;
	transportMotorcycles: ApiNinjasEndpoint<'transportMotorcycles'>;
	transportElectricVehicles: ApiNinjasEndpoint<'transportElectricVehicles'>;
	transportVin: ApiNinjasEndpoint<'transportVin'>;
	healthCaloriesBurned: ApiNinjasEndpoint<'healthCaloriesBurned'>;
	healthNutrition: ApiNinjasEndpoint<'healthNutrition'>;
	healthExercises: ApiNinjasEndpoint<'healthExercises'>;
	healthRecipes: ApiNinjasEndpoint<'healthRecipes'>;
	healthCocktails: ApiNinjasEndpoint<'healthCocktails'>;
	referenceAnimals: ApiNinjasEndpoint<'referenceAnimals'>;
	referenceCats: ApiNinjasEndpoint<'referenceCats'>;
	referenceDogs: ApiNinjasEndpoint<'referenceDogs'>;
	referencePlanets: ApiNinjasEndpoint<'referencePlanets'>;
	referenceStars: ApiNinjasEndpoint<'referenceStars'>;
	referenceHistoricalEvents: ApiNinjasEndpoint<'referenceHistoricalEvents'>;
	referenceHistoricalFigures: ApiNinjasEndpoint<'referenceHistoricalFigures'>;
	referenceDayInHistory: ApiNinjasEndpoint<'referenceDayInHistory'>;
	referenceCelebrities: ApiNinjasEndpoint<'referenceCelebrities'>;
	referenceBabyNames: ApiNinjasEndpoint<'referenceBabyNames'>;
	entertainmentJokes: ApiNinjasEndpoint<'entertainmentJokes'>;
	entertainmentDadJokes: ApiNinjasEndpoint<'entertainmentDadJokes'>;
	entertainmentChuckNorris: ApiNinjasEndpoint<'entertainmentChuckNorris'>;
	entertainmentJokeOfTheDay: ApiNinjasEndpoint<'entertainmentJokeOfTheDay'>;
	entertainmentFacts: ApiNinjasEndpoint<'entertainmentFacts'>;
	entertainmentFactOfTheDay: ApiNinjasEndpoint<'entertainmentFactOfTheDay'>;
	entertainmentQuotes: ApiNinjasEndpoint<'entertainmentQuotes'>;
	entertainmentRandomQuotes: ApiNinjasEndpoint<'entertainmentRandomQuotes'>;
	entertainmentQuoteOfTheDay: ApiNinjasEndpoint<'entertainmentQuoteOfTheDay'>;
	entertainmentAdvice: ApiNinjasEndpoint<'entertainmentAdvice'>;
	entertainmentBucketList: ApiNinjasEndpoint<'entertainmentBucketList'>;
	entertainmentHobbies: ApiNinjasEndpoint<'entertainmentHobbies'>;
	entertainmentHoroscope: ApiNinjasEndpoint<'entertainmentHoroscope'>;
	entertainmentRiddles: ApiNinjasEndpoint<'entertainmentRiddles'>;
	entertainmentTrivia: ApiNinjasEndpoint<'entertainmentTrivia'>;
	entertainmentTriviaOfTheDay: ApiNinjasEndpoint<'entertainmentTriviaOfTheDay'>;
	entertainmentGenerateSudoku: ApiNinjasEndpoint<'entertainmentGenerateSudoku'>;
	entertainmentSolveSudoku: ApiNinjasEndpoint<'entertainmentSolveSudoku'>;
};

const apiNinjasEndpointsNested = {
	location: {
		geocode: Location.geocode,
		reverseGeocode: Location.reverseGeocode,
		cities: Location.cities,
		country: Location.country,
		county: Location.county,
		zipCode: Location.zipCode,
		postalCode: Location.postalCode,
		universities: Location.universities,
		hospitals: Location.hospitals,
		evChargers: Location.evChargers,
		weather: Location.weather,
		weatherForecast: Location.weatherForecast,
		airQuality: Location.airQuality,
	},
	calendar: {
		timezone: Calendar.timezone,
		worldTime: Calendar.worldTime,
		holidays: Calendar.holidays,
		publicHolidays: Calendar.publicHolidays,
		isPublicHoliday: Calendar.isPublicHoliday,
		isWorkingDay: Calendar.isWorkingDay,
		workingDays: Calendar.workingDays,
	},
	internet: {
		domain: Internet.domain,
		dnsRecords: Internet.dnsRecords,
		mxRecords: Internet.mxRecords,
		whois: Internet.whois,
		ipLookup: Internet.ipLookup,
		urlLookup: Internet.urlLookup,
		webpage: Internet.webpage,
		scrape: Internet.scrape,
		userAgent: Internet.userAgent,
	},
	validation: {
		email: Validation.email,
		disposableEmail: Validation.disposableEmail,
		phone: Validation.phone,
		routingNumber: Validation.routingNumber,
		iban: Validation.iban,
		bin: Validation.bin,
		swiftCode: Validation.swiftCode,
	},
	markets: {
		stockPrice: Markets.stockPrice,
		ticker: Markets.ticker,
		tickerList: Markets.tickerList,
		stockExchanges: Markets.stockExchanges,
		sp500: Markets.sp500,
		marketCap: Markets.marketCap,
		earnings: Markets.earnings,
		earningsCalendar: Markets.earningsCalendar,
		earningsTranscript: Markets.earningsTranscript,
		insiderTransactions: Markets.insiderTransactions,
		secFilings: Markets.secFilings,
		etf: Markets.etf,
		mutualFund: Markets.mutualFund,
		cryptoPrice: Markets.cryptoPrice,
		bitcoin: Markets.bitcoin,
		commodityPrice: Markets.commodityPrice,
		convertCurrency: Markets.convertCurrency,
		exchangeRate: Markets.exchangeRate,
	},
	economics: {
		gdp: Economics.gdp,
		inflation: Economics.inflation,
		unemployment: Economics.unemployment,
		population: Economics.population,
		interestRate: Economics.interestRate,
		mortgageRate: Economics.mortgageRate,
		mortgageCalculator: Economics.mortgageCalculator,
		incomeTax: Economics.incomeTax,
		incomeTaxCalculator: Economics.incomeTaxCalculator,
		salesTax: Economics.salesTax,
		salesTaxCalculator: Economics.salesTaxCalculator,
		propertyTax: Economics.propertyTax,
		vatRates: Economics.vatRates,
	},
	text: {
		sentiment: Text.sentiment,
		similarity: Text.similarity,
		embeddings: Text.embeddings,
		language: Text.language,
		spellCheck: Text.spellCheck,
		profanityFilter: Text.profanityFilter,
		dictionary: Text.dictionary,
		thesaurus: Text.thesaurus,
		rhymes: Text.rhymes,
		randomWord: Text.randomWord,
		loremIpsum: Text.loremIpsum,
	},
	utility: {
		qrCode: Utility.qrCode,
		barcode: Utility.barcode,
		password: Utility.password,
		randomUser: Utility.randomUser,
		counter: Utility.counter,
		convertUnit: Utility.convertUnit,
		logo: Utility.logo,
		countryFlag: Utility.countryFlag,
		randomImage: Utility.randomImage,
		emoji: Utility.emoji,
	},
	transport: {
		aircraft: Transport.aircraft,
		airlines: Transport.airlines,
		airports: Transport.airports,
		helicopters: Transport.helicopters,
		cars: Transport.cars,
		motorcycles: Transport.motorcycles,
		electricVehicles: Transport.electricVehicles,
		vin: Transport.vin,
	},
	health: {
		caloriesBurned: Health.caloriesBurned,
		nutrition: Health.nutrition,
		exercises: Health.exercises,
		recipes: Health.recipes,
		cocktails: Health.cocktails,
	},
	reference: {
		animals: Reference.animals,
		cats: Reference.cats,
		dogs: Reference.dogs,
		planets: Reference.planets,
		stars: Reference.stars,
		historicalEvents: Reference.historicalEvents,
		historicalFigures: Reference.historicalFigures,
		dayInHistory: Reference.dayInHistory,
		celebrities: Reference.celebrities,
		babyNames: Reference.babyNames,
	},
	entertainment: {
		jokes: Entertainment.jokes,
		dadJokes: Entertainment.dadJokes,
		chuckNorris: Entertainment.chuckNorris,
		jokeOfTheDay: Entertainment.jokeOfTheDay,
		facts: Entertainment.facts,
		factOfTheDay: Entertainment.factOfTheDay,
		quotes: Entertainment.quotes,
		randomQuotes: Entertainment.randomQuotes,
		quoteOfTheDay: Entertainment.quoteOfTheDay,
		advice: Entertainment.advice,
		bucketList: Entertainment.bucketList,
		hobbies: Entertainment.hobbies,
		horoscope: Entertainment.horoscope,
		riddles: Entertainment.riddles,
		trivia: Entertainment.trivia,
		triviaOfTheDay: Entertainment.triviaOfTheDay,
		generateSudoku: Entertainment.generateSudoku,
		solveSudoku: Entertainment.solveSudoku,
	},
} as const;

export const apiNinjasEndpointSchemas = {
	'location.geocode': {
		input: ApiNinjasEndpointInputSchemas.locationGeocode,
		output: ApiNinjasEndpointOutputSchemas.locationGeocode,
	},
	'location.reverseGeocode': {
		input: ApiNinjasEndpointInputSchemas.locationReverseGeocode,
		output: ApiNinjasEndpointOutputSchemas.locationReverseGeocode,
	},
	'location.cities': {
		input: ApiNinjasEndpointInputSchemas.locationCities,
		output: ApiNinjasEndpointOutputSchemas.locationCities,
	},
	'location.country': {
		input: ApiNinjasEndpointInputSchemas.locationCountry,
		output: ApiNinjasEndpointOutputSchemas.locationCountry,
	},
	'location.county': {
		input: ApiNinjasEndpointInputSchemas.locationCounty,
		output: ApiNinjasEndpointOutputSchemas.locationCounty,
	},
	'location.zipCode': {
		input: ApiNinjasEndpointInputSchemas.locationZipCode,
		output: ApiNinjasEndpointOutputSchemas.locationZipCode,
	},
	'location.postalCode': {
		input: ApiNinjasEndpointInputSchemas.locationPostalCode,
		output: ApiNinjasEndpointOutputSchemas.locationPostalCode,
	},
	'location.universities': {
		input: ApiNinjasEndpointInputSchemas.locationUniversities,
		output: ApiNinjasEndpointOutputSchemas.locationUniversities,
	},
	'location.hospitals': {
		input: ApiNinjasEndpointInputSchemas.locationHospitals,
		output: ApiNinjasEndpointOutputSchemas.locationHospitals,
	},
	'location.evChargers': {
		input: ApiNinjasEndpointInputSchemas.locationEvChargers,
		output: ApiNinjasEndpointOutputSchemas.locationEvChargers,
	},
	'location.weather': {
		input: ApiNinjasEndpointInputSchemas.locationWeather,
		output: ApiNinjasEndpointOutputSchemas.locationWeather,
	},
	'location.weatherForecast': {
		input: ApiNinjasEndpointInputSchemas.locationWeatherForecast,
		output: ApiNinjasEndpointOutputSchemas.locationWeatherForecast,
	},
	'location.airQuality': {
		input: ApiNinjasEndpointInputSchemas.locationAirQuality,
		output: ApiNinjasEndpointOutputSchemas.locationAirQuality,
	},
	'calendar.timezone': {
		input: ApiNinjasEndpointInputSchemas.calendarTimezone,
		output: ApiNinjasEndpointOutputSchemas.calendarTimezone,
	},
	'calendar.worldTime': {
		input: ApiNinjasEndpointInputSchemas.calendarWorldTime,
		output: ApiNinjasEndpointOutputSchemas.calendarWorldTime,
	},
	'calendar.holidays': {
		input: ApiNinjasEndpointInputSchemas.calendarHolidays,
		output: ApiNinjasEndpointOutputSchemas.calendarHolidays,
	},
	'calendar.publicHolidays': {
		input: ApiNinjasEndpointInputSchemas.calendarPublicHolidays,
		output: ApiNinjasEndpointOutputSchemas.calendarPublicHolidays,
	},
	'calendar.isPublicHoliday': {
		input: ApiNinjasEndpointInputSchemas.calendarIsPublicHoliday,
		output: ApiNinjasEndpointOutputSchemas.calendarIsPublicHoliday,
	},
	'calendar.isWorkingDay': {
		input: ApiNinjasEndpointInputSchemas.calendarIsWorkingDay,
		output: ApiNinjasEndpointOutputSchemas.calendarIsWorkingDay,
	},
	'calendar.workingDays': {
		input: ApiNinjasEndpointInputSchemas.calendarWorkingDays,
		output: ApiNinjasEndpointOutputSchemas.calendarWorkingDays,
	},
	'internet.domain': {
		input: ApiNinjasEndpointInputSchemas.internetDomain,
		output: ApiNinjasEndpointOutputSchemas.internetDomain,
	},
	'internet.dnsRecords': {
		input: ApiNinjasEndpointInputSchemas.internetDnsRecords,
		output: ApiNinjasEndpointOutputSchemas.internetDnsRecords,
	},
	'internet.mxRecords': {
		input: ApiNinjasEndpointInputSchemas.internetMxRecords,
		output: ApiNinjasEndpointOutputSchemas.internetMxRecords,
	},
	'internet.whois': {
		input: ApiNinjasEndpointInputSchemas.internetWhois,
		output: ApiNinjasEndpointOutputSchemas.internetWhois,
	},
	'internet.ipLookup': {
		input: ApiNinjasEndpointInputSchemas.internetIpLookup,
		output: ApiNinjasEndpointOutputSchemas.internetIpLookup,
	},
	'internet.urlLookup': {
		input: ApiNinjasEndpointInputSchemas.internetUrlLookup,
		output: ApiNinjasEndpointOutputSchemas.internetUrlLookup,
	},
	'internet.webpage': {
		input: ApiNinjasEndpointInputSchemas.internetWebpage,
		output: ApiNinjasEndpointOutputSchemas.internetWebpage,
	},
	'internet.scrape': {
		input: ApiNinjasEndpointInputSchemas.internetScrape,
		output: ApiNinjasEndpointOutputSchemas.internetScrape,
	},
	'internet.userAgent': {
		input: ApiNinjasEndpointInputSchemas.internetUserAgent,
		output: ApiNinjasEndpointOutputSchemas.internetUserAgent,
	},
	'validation.email': {
		input: ApiNinjasEndpointInputSchemas.validationEmail,
		output: ApiNinjasEndpointOutputSchemas.validationEmail,
	},
	'validation.disposableEmail': {
		input: ApiNinjasEndpointInputSchemas.validationDisposableEmail,
		output: ApiNinjasEndpointOutputSchemas.validationDisposableEmail,
	},
	'validation.phone': {
		input: ApiNinjasEndpointInputSchemas.validationPhone,
		output: ApiNinjasEndpointOutputSchemas.validationPhone,
	},
	'validation.routingNumber': {
		input: ApiNinjasEndpointInputSchemas.validationRoutingNumber,
		output: ApiNinjasEndpointOutputSchemas.validationRoutingNumber,
	},
	'validation.iban': {
		input: ApiNinjasEndpointInputSchemas.validationIban,
		output: ApiNinjasEndpointOutputSchemas.validationIban,
	},
	'validation.bin': {
		input: ApiNinjasEndpointInputSchemas.validationBin,
		output: ApiNinjasEndpointOutputSchemas.validationBin,
	},
	'validation.swiftCode': {
		input: ApiNinjasEndpointInputSchemas.validationSwiftCode,
		output: ApiNinjasEndpointOutputSchemas.validationSwiftCode,
	},
	'markets.stockPrice': {
		input: ApiNinjasEndpointInputSchemas.marketsStockPrice,
		output: ApiNinjasEndpointOutputSchemas.marketsStockPrice,
	},
	'markets.ticker': {
		input: ApiNinjasEndpointInputSchemas.marketsTicker,
		output: ApiNinjasEndpointOutputSchemas.marketsTicker,
	},
	'markets.tickerList': {
		input: ApiNinjasEndpointInputSchemas.marketsTickerList,
		output: ApiNinjasEndpointOutputSchemas.marketsTickerList,
	},
	'markets.stockExchanges': {
		input: ApiNinjasEndpointInputSchemas.marketsStockExchanges,
		output: ApiNinjasEndpointOutputSchemas.marketsStockExchanges,
	},
	'markets.sp500': {
		input: ApiNinjasEndpointInputSchemas.marketsSp500,
		output: ApiNinjasEndpointOutputSchemas.marketsSp500,
	},
	'markets.marketCap': {
		input: ApiNinjasEndpointInputSchemas.marketsMarketCap,
		output: ApiNinjasEndpointOutputSchemas.marketsMarketCap,
	},
	'markets.earnings': {
		input: ApiNinjasEndpointInputSchemas.marketsEarnings,
		output: ApiNinjasEndpointOutputSchemas.marketsEarnings,
	},
	'markets.earningsCalendar': {
		input: ApiNinjasEndpointInputSchemas.marketsEarningsCalendar,
		output: ApiNinjasEndpointOutputSchemas.marketsEarningsCalendar,
	},
	'markets.earningsTranscript': {
		input: ApiNinjasEndpointInputSchemas.marketsEarningsTranscript,
		output: ApiNinjasEndpointOutputSchemas.marketsEarningsTranscript,
	},
	'markets.insiderTransactions': {
		input: ApiNinjasEndpointInputSchemas.marketsInsiderTransactions,
		output: ApiNinjasEndpointOutputSchemas.marketsInsiderTransactions,
	},
	'markets.secFilings': {
		input: ApiNinjasEndpointInputSchemas.marketsSecFilings,
		output: ApiNinjasEndpointOutputSchemas.marketsSecFilings,
	},
	'markets.etf': {
		input: ApiNinjasEndpointInputSchemas.marketsEtf,
		output: ApiNinjasEndpointOutputSchemas.marketsEtf,
	},
	'markets.mutualFund': {
		input: ApiNinjasEndpointInputSchemas.marketsMutualFund,
		output: ApiNinjasEndpointOutputSchemas.marketsMutualFund,
	},
	'markets.cryptoPrice': {
		input: ApiNinjasEndpointInputSchemas.marketsCryptoPrice,
		output: ApiNinjasEndpointOutputSchemas.marketsCryptoPrice,
	},
	'markets.bitcoin': {
		input: ApiNinjasEndpointInputSchemas.marketsBitcoin,
		output: ApiNinjasEndpointOutputSchemas.marketsBitcoin,
	},
	'markets.commodityPrice': {
		input: ApiNinjasEndpointInputSchemas.marketsCommodityPrice,
		output: ApiNinjasEndpointOutputSchemas.marketsCommodityPrice,
	},
	'markets.convertCurrency': {
		input: ApiNinjasEndpointInputSchemas.marketsConvertCurrency,
		output: ApiNinjasEndpointOutputSchemas.marketsConvertCurrency,
	},
	'markets.exchangeRate': {
		input: ApiNinjasEndpointInputSchemas.marketsExchangeRate,
		output: ApiNinjasEndpointOutputSchemas.marketsExchangeRate,
	},
	'economics.gdp': {
		input: ApiNinjasEndpointInputSchemas.economicsGdp,
		output: ApiNinjasEndpointOutputSchemas.economicsGdp,
	},
	'economics.inflation': {
		input: ApiNinjasEndpointInputSchemas.economicsInflation,
		output: ApiNinjasEndpointOutputSchemas.economicsInflation,
	},
	'economics.unemployment': {
		input: ApiNinjasEndpointInputSchemas.economicsUnemployment,
		output: ApiNinjasEndpointOutputSchemas.economicsUnemployment,
	},
	'economics.population': {
		input: ApiNinjasEndpointInputSchemas.economicsPopulation,
		output: ApiNinjasEndpointOutputSchemas.economicsPopulation,
	},
	'economics.interestRate': {
		input: ApiNinjasEndpointInputSchemas.economicsInterestRate,
		output: ApiNinjasEndpointOutputSchemas.economicsInterestRate,
	},
	'economics.mortgageRate': {
		input: ApiNinjasEndpointInputSchemas.economicsMortgageRate,
		output: ApiNinjasEndpointOutputSchemas.economicsMortgageRate,
	},
	'economics.mortgageCalculator': {
		input: ApiNinjasEndpointInputSchemas.economicsMortgageCalculator,
		output: ApiNinjasEndpointOutputSchemas.economicsMortgageCalculator,
	},
	'economics.incomeTax': {
		input: ApiNinjasEndpointInputSchemas.economicsIncomeTax,
		output: ApiNinjasEndpointOutputSchemas.economicsIncomeTax,
	},
	'economics.incomeTaxCalculator': {
		input: ApiNinjasEndpointInputSchemas.economicsIncomeTaxCalculator,
		output: ApiNinjasEndpointOutputSchemas.economicsIncomeTaxCalculator,
	},
	'economics.salesTax': {
		input: ApiNinjasEndpointInputSchemas.economicsSalesTax,
		output: ApiNinjasEndpointOutputSchemas.economicsSalesTax,
	},
	'economics.salesTaxCalculator': {
		input: ApiNinjasEndpointInputSchemas.economicsSalesTaxCalculator,
		output: ApiNinjasEndpointOutputSchemas.economicsSalesTaxCalculator,
	},
	'economics.propertyTax': {
		input: ApiNinjasEndpointInputSchemas.economicsPropertyTax,
		output: ApiNinjasEndpointOutputSchemas.economicsPropertyTax,
	},
	'economics.vatRates': {
		input: ApiNinjasEndpointInputSchemas.economicsVatRates,
		output: ApiNinjasEndpointOutputSchemas.economicsVatRates,
	},
	'text.sentiment': {
		input: ApiNinjasEndpointInputSchemas.textSentiment,
		output: ApiNinjasEndpointOutputSchemas.textSentiment,
	},
	'text.similarity': {
		input: ApiNinjasEndpointInputSchemas.textSimilarity,
		output: ApiNinjasEndpointOutputSchemas.textSimilarity,
	},
	'text.embeddings': {
		input: ApiNinjasEndpointInputSchemas.textEmbeddings,
		output: ApiNinjasEndpointOutputSchemas.textEmbeddings,
	},
	'text.language': {
		input: ApiNinjasEndpointInputSchemas.textLanguage,
		output: ApiNinjasEndpointOutputSchemas.textLanguage,
	},
	'text.spellCheck': {
		input: ApiNinjasEndpointInputSchemas.textSpellCheck,
		output: ApiNinjasEndpointOutputSchemas.textSpellCheck,
	},
	'text.profanityFilter': {
		input: ApiNinjasEndpointInputSchemas.textProfanityFilter,
		output: ApiNinjasEndpointOutputSchemas.textProfanityFilter,
	},
	'text.dictionary': {
		input: ApiNinjasEndpointInputSchemas.textDictionary,
		output: ApiNinjasEndpointOutputSchemas.textDictionary,
	},
	'text.thesaurus': {
		input: ApiNinjasEndpointInputSchemas.textThesaurus,
		output: ApiNinjasEndpointOutputSchemas.textThesaurus,
	},
	'text.rhymes': {
		input: ApiNinjasEndpointInputSchemas.textRhymes,
		output: ApiNinjasEndpointOutputSchemas.textRhymes,
	},
	'text.randomWord': {
		input: ApiNinjasEndpointInputSchemas.textRandomWord,
		output: ApiNinjasEndpointOutputSchemas.textRandomWord,
	},
	'text.loremIpsum': {
		input: ApiNinjasEndpointInputSchemas.textLoremIpsum,
		output: ApiNinjasEndpointOutputSchemas.textLoremIpsum,
	},
	'utility.qrCode': {
		input: ApiNinjasEndpointInputSchemas.utilityQrCode,
		output: ApiNinjasEndpointOutputSchemas.utilityQrCode,
	},
	'utility.barcode': {
		input: ApiNinjasEndpointInputSchemas.utilityBarcode,
		output: ApiNinjasEndpointOutputSchemas.utilityBarcode,
	},
	'utility.password': {
		input: ApiNinjasEndpointInputSchemas.utilityPassword,
		output: ApiNinjasEndpointOutputSchemas.utilityPassword,
	},
	'utility.randomUser': {
		input: ApiNinjasEndpointInputSchemas.utilityRandomUser,
		output: ApiNinjasEndpointOutputSchemas.utilityRandomUser,
	},
	'utility.counter': {
		input: ApiNinjasEndpointInputSchemas.utilityCounter,
		output: ApiNinjasEndpointOutputSchemas.utilityCounter,
	},
	'utility.convertUnit': {
		input: ApiNinjasEndpointInputSchemas.utilityConvertUnit,
		output: ApiNinjasEndpointOutputSchemas.utilityConvertUnit,
	},
	'utility.logo': {
		input: ApiNinjasEndpointInputSchemas.utilityLogo,
		output: ApiNinjasEndpointOutputSchemas.utilityLogo,
	},
	'utility.countryFlag': {
		input: ApiNinjasEndpointInputSchemas.utilityCountryFlag,
		output: ApiNinjasEndpointOutputSchemas.utilityCountryFlag,
	},
	'utility.randomImage': {
		input: ApiNinjasEndpointInputSchemas.utilityRandomImage,
		output: ApiNinjasEndpointOutputSchemas.utilityRandomImage,
	},
	'utility.emoji': {
		input: ApiNinjasEndpointInputSchemas.utilityEmoji,
		output: ApiNinjasEndpointOutputSchemas.utilityEmoji,
	},
	'transport.aircraft': {
		input: ApiNinjasEndpointInputSchemas.transportAircraft,
		output: ApiNinjasEndpointOutputSchemas.transportAircraft,
	},
	'transport.airlines': {
		input: ApiNinjasEndpointInputSchemas.transportAirlines,
		output: ApiNinjasEndpointOutputSchemas.transportAirlines,
	},
	'transport.airports': {
		input: ApiNinjasEndpointInputSchemas.transportAirports,
		output: ApiNinjasEndpointOutputSchemas.transportAirports,
	},
	'transport.helicopters': {
		input: ApiNinjasEndpointInputSchemas.transportHelicopters,
		output: ApiNinjasEndpointOutputSchemas.transportHelicopters,
	},
	'transport.cars': {
		input: ApiNinjasEndpointInputSchemas.transportCars,
		output: ApiNinjasEndpointOutputSchemas.transportCars,
	},
	'transport.motorcycles': {
		input: ApiNinjasEndpointInputSchemas.transportMotorcycles,
		output: ApiNinjasEndpointOutputSchemas.transportMotorcycles,
	},
	'transport.electricVehicles': {
		input: ApiNinjasEndpointInputSchemas.transportElectricVehicles,
		output: ApiNinjasEndpointOutputSchemas.transportElectricVehicles,
	},
	'transport.vin': {
		input: ApiNinjasEndpointInputSchemas.transportVin,
		output: ApiNinjasEndpointOutputSchemas.transportVin,
	},
	'health.caloriesBurned': {
		input: ApiNinjasEndpointInputSchemas.healthCaloriesBurned,
		output: ApiNinjasEndpointOutputSchemas.healthCaloriesBurned,
	},
	'health.nutrition': {
		input: ApiNinjasEndpointInputSchemas.healthNutrition,
		output: ApiNinjasEndpointOutputSchemas.healthNutrition,
	},
	'health.exercises': {
		input: ApiNinjasEndpointInputSchemas.healthExercises,
		output: ApiNinjasEndpointOutputSchemas.healthExercises,
	},
	'health.recipes': {
		input: ApiNinjasEndpointInputSchemas.healthRecipes,
		output: ApiNinjasEndpointOutputSchemas.healthRecipes,
	},
	'health.cocktails': {
		input: ApiNinjasEndpointInputSchemas.healthCocktails,
		output: ApiNinjasEndpointOutputSchemas.healthCocktails,
	},
	'reference.animals': {
		input: ApiNinjasEndpointInputSchemas.referenceAnimals,
		output: ApiNinjasEndpointOutputSchemas.referenceAnimals,
	},
	'reference.cats': {
		input: ApiNinjasEndpointInputSchemas.referenceCats,
		output: ApiNinjasEndpointOutputSchemas.referenceCats,
	},
	'reference.dogs': {
		input: ApiNinjasEndpointInputSchemas.referenceDogs,
		output: ApiNinjasEndpointOutputSchemas.referenceDogs,
	},
	'reference.planets': {
		input: ApiNinjasEndpointInputSchemas.referencePlanets,
		output: ApiNinjasEndpointOutputSchemas.referencePlanets,
	},
	'reference.stars': {
		input: ApiNinjasEndpointInputSchemas.referenceStars,
		output: ApiNinjasEndpointOutputSchemas.referenceStars,
	},
	'reference.historicalEvents': {
		input: ApiNinjasEndpointInputSchemas.referenceHistoricalEvents,
		output: ApiNinjasEndpointOutputSchemas.referenceHistoricalEvents,
	},
	'reference.historicalFigures': {
		input: ApiNinjasEndpointInputSchemas.referenceHistoricalFigures,
		output: ApiNinjasEndpointOutputSchemas.referenceHistoricalFigures,
	},
	'reference.dayInHistory': {
		input: ApiNinjasEndpointInputSchemas.referenceDayInHistory,
		output: ApiNinjasEndpointOutputSchemas.referenceDayInHistory,
	},
	'reference.celebrities': {
		input: ApiNinjasEndpointInputSchemas.referenceCelebrities,
		output: ApiNinjasEndpointOutputSchemas.referenceCelebrities,
	},
	'reference.babyNames': {
		input: ApiNinjasEndpointInputSchemas.referenceBabyNames,
		output: ApiNinjasEndpointOutputSchemas.referenceBabyNames,
	},
	'entertainment.jokes': {
		input: ApiNinjasEndpointInputSchemas.entertainmentJokes,
		output: ApiNinjasEndpointOutputSchemas.entertainmentJokes,
	},
	'entertainment.dadJokes': {
		input: ApiNinjasEndpointInputSchemas.entertainmentDadJokes,
		output: ApiNinjasEndpointOutputSchemas.entertainmentDadJokes,
	},
	'entertainment.chuckNorris': {
		input: ApiNinjasEndpointInputSchemas.entertainmentChuckNorris,
		output: ApiNinjasEndpointOutputSchemas.entertainmentChuckNorris,
	},
	'entertainment.jokeOfTheDay': {
		input: ApiNinjasEndpointInputSchemas.entertainmentJokeOfTheDay,
		output: ApiNinjasEndpointOutputSchemas.entertainmentJokeOfTheDay,
	},
	'entertainment.facts': {
		input: ApiNinjasEndpointInputSchemas.entertainmentFacts,
		output: ApiNinjasEndpointOutputSchemas.entertainmentFacts,
	},
	'entertainment.factOfTheDay': {
		input: ApiNinjasEndpointInputSchemas.entertainmentFactOfTheDay,
		output: ApiNinjasEndpointOutputSchemas.entertainmentFactOfTheDay,
	},
	'entertainment.quotes': {
		input: ApiNinjasEndpointInputSchemas.entertainmentQuotes,
		output: ApiNinjasEndpointOutputSchemas.entertainmentQuotes,
	},
	'entertainment.randomQuotes': {
		input: ApiNinjasEndpointInputSchemas.entertainmentRandomQuotes,
		output: ApiNinjasEndpointOutputSchemas.entertainmentRandomQuotes,
	},
	'entertainment.quoteOfTheDay': {
		input: ApiNinjasEndpointInputSchemas.entertainmentQuoteOfTheDay,
		output: ApiNinjasEndpointOutputSchemas.entertainmentQuoteOfTheDay,
	},
	'entertainment.advice': {
		input: ApiNinjasEndpointInputSchemas.entertainmentAdvice,
		output: ApiNinjasEndpointOutputSchemas.entertainmentAdvice,
	},
	'entertainment.bucketList': {
		input: ApiNinjasEndpointInputSchemas.entertainmentBucketList,
		output: ApiNinjasEndpointOutputSchemas.entertainmentBucketList,
	},
	'entertainment.hobbies': {
		input: ApiNinjasEndpointInputSchemas.entertainmentHobbies,
		output: ApiNinjasEndpointOutputSchemas.entertainmentHobbies,
	},
	'entertainment.horoscope': {
		input: ApiNinjasEndpointInputSchemas.entertainmentHoroscope,
		output: ApiNinjasEndpointOutputSchemas.entertainmentHoroscope,
	},
	'entertainment.riddles': {
		input: ApiNinjasEndpointInputSchemas.entertainmentRiddles,
		output: ApiNinjasEndpointOutputSchemas.entertainmentRiddles,
	},
	'entertainment.trivia': {
		input: ApiNinjasEndpointInputSchemas.entertainmentTrivia,
		output: ApiNinjasEndpointOutputSchemas.entertainmentTrivia,
	},
	'entertainment.triviaOfTheDay': {
		input: ApiNinjasEndpointInputSchemas.entertainmentTriviaOfTheDay,
		output: ApiNinjasEndpointOutputSchemas.entertainmentTriviaOfTheDay,
	},
	'entertainment.generateSudoku': {
		input: ApiNinjasEndpointInputSchemas.entertainmentGenerateSudoku,
		output: ApiNinjasEndpointOutputSchemas.entertainmentGenerateSudoku,
	},
	'entertainment.solveSudoku': {
		input: ApiNinjasEndpointInputSchemas.entertainmentSolveSudoku,
		output: ApiNinjasEndpointOutputSchemas.entertainmentSolveSudoku,
	},
} satisfies RequiredPluginEndpointSchemas<typeof apiNinjasEndpointsNested>;

const apiNinjasEndpointMeta = {
	'location.geocode': {
		riskLevel: 'read',
		description: 'Get current city coordinates by city and country name',
	},
	'location.reverseGeocode': {
		riskLevel: 'read',
		description:
			'Returns a list of cities that contain a given latitude and longitude',
	},
	'location.cities': {
		riskLevel: 'read',
		description: 'Get city data from either a name or population range',
	},
	'location.country': {
		riskLevel: 'read',
		description: 'Get country data from given parameters',
	},
	'location.county': {
		riskLevel: 'read',
		description:
			'Returns details for one or more counties matching the input parameters',
	},
	'location.zipCode': {
		riskLevel: 'read',
		description:
			'Returns a list of ZIP Code details matching the input parameters',
	},
	'location.postalCode': {
		riskLevel: 'read',
		description:
			'Returns a list of postal code details matching the input parameters',
	},
	'location.universities': {
		riskLevel: 'read',
		description:
			'Returns information about universities matching the provided filters',
	},
	'location.hospitals': {
		riskLevel: 'read',
		description: 'Get hospital data based on given parameters',
	},
	'location.evChargers': {
		riskLevel: 'read',
		description: 'find ev charging stations',
	},
	'location.weather': {
		riskLevel: 'read',
		description:
			'Get current weather, wind speed and direction, humidity, and temperature data by city, ZIP code, or geolocation coordinates (latitude/longitude) [premium plan required]',
	},
	'location.weatherForecast': {
		riskLevel: 'read',
		description:
			'Returns a 5-day weather forecast in 3-hour intervals for a given city [premium plan required]',
	},
	'location.airQuality': {
		riskLevel: 'read',
		description:
			'Get air quality by city or location coordinates (latitude/longitude)',
	},
	'calendar.timezone': {
		riskLevel: 'read',
		description:
			'Get timezone info by city/state/country or location coordinates (latitude/longitude)',
	},
	'calendar.worldTime': {
		riskLevel: 'read',
		description:
			'Get the current date and time by city/state/country, location coordinates (latitude/longitude), or timezone [premium plan required]',
	},
	'calendar.holidays': {
		riskLevel: 'read',
		description:
			'Returns a list of holiday entries for a given country and year [premium plan required]',
	},
	'calendar.publicHolidays': {
		riskLevel: 'read',
		description:
			'Returns a list of public holidays for a given country and year [premium plan required]',
	},
	'calendar.isPublicHoliday': {
		riskLevel: 'read',
		description:
			'Returns whether a given date is a public holiday for a given country',
	},
	'calendar.isWorkingDay': {
		riskLevel: 'read',
		description:
			'Returns whether a given date is a working day for a given country',
	},
	'calendar.workingDays': {
		riskLevel: 'read',
		description:
			'Returns a list of working days and non-working days for a given country and year/month',
	},
	'internet.domain': {
		riskLevel: 'read',
		description:
			'Returns availability, registration lifecycle, and email/hosting intelligence for a given domain name',
	},
	'internet.dnsRecords': {
		riskLevel: 'read',
		description:
			'Returns a list of DNS records associated with a particular domain',
	},
	'internet.mxRecords': {
		riskLevel: 'read',
		description:
			'Returns a list of MX records associated with a particular domain',
	},
	'internet.whois': {
		riskLevel: 'read',
		description:
			'Returns domain registration details (e.g. registrar, contact information, expiration date, name servers) for a given domain name [premium plan required]',
	},
	'internet.ipLookup': {
		riskLevel: 'read',
		description: 'Returns the location of the IP address specified',
	},
	'internet.urlLookup': {
		riskLevel: 'read',
		description:
			'Returns the location of the IP address hosting the URL domain',
	},
	'internet.webpage': {
		riskLevel: 'read',
		description:
			'Returns the URL information and web page metadata from a given URL',
	},
	'internet.scrape': {
		riskLevel: 'read',
		description: 'Returns the HTML or plaintext data scraped from a given URL',
	},
	'internet.userAgent': {
		riskLevel: 'read',
		description:
			'Generates a realistic user agent string based on optional parameters',
	},
	'validation.email': {
		riskLevel: 'read',
		description:
			'Returns metadata (including whether it is valid) for a given email address',
	},
	'validation.disposableEmail': {
		riskLevel: 'read',
		description:
			'Returns metadata for a given email address, including whether it is from a disposable email provider',
	},
	'validation.phone': {
		riskLevel: 'read',
		description:
			'Returns metadata (including whether it is valid) for a given phone number',
	},
	'validation.routingNumber': {
		riskLevel: 'read',
		description:
			'Returns detailed information about a bank based on its routing number',
	},
	'validation.iban': {
		riskLevel: 'read',
		description: 'Returns detailed information on a given IBAN',
	},
	'validation.bin': {
		riskLevel: 'read',
		description:
			'Returns detailed information about a bank based on the BIN number provided',
	},
	'validation.swiftCode': {
		riskLevel: 'read',
		description:
			'Returns a list of bank information (including SWIFT/BIC Code) that match the input parameter',
	},
	'markets.stockPrice': {
		riskLevel: 'read',
		description: 'Returns price information for any given ticker symbol',
	},
	'markets.ticker': {
		riskLevel: 'read',
		description:
			'Returns comprehensive company profile information including company name, CEO, address, financial data, exchange information, identifiers...',
	},
	'markets.tickerList': {
		riskLevel: 'read',
		description:
			'Returns a list of all available companies and their ticker symbols',
	},
	'markets.stockExchanges': {
		riskLevel: 'read',
		description:
			'Returns detailed information about stock exchanges matching the specified criteria',
	},
	'markets.sp500': {
		riskLevel: 'read',
		description:
			'Returns S&P 500 index constituents, filterable by ticker, company name, sector or the date the company joined the index',
	},
	'markets.marketCap': {
		riskLevel: 'read',
		description:
			'Returns the current market cap data for any given company ticker',
	},
	'markets.earnings': {
		riskLevel: 'read',
		description:
			'Returns a JSON array of detailed earnings reports, each with comprehensive financial statements and key performance metrics',
	},
	'markets.earningsCalendar': {
		riskLevel: 'read',
		description:
			'Returns a list of past earnings results and upcoming earnings dates',
	},
	'markets.earningsTranscript': {
		riskLevel: 'read',
		description:
			'Returns the earnings transcript for a given company earning quarter [premium plan required]',
	},
	'markets.insiderTransactions': {
		riskLevel: 'read',
		description:
			'Returns a list of insider trading transactions that match the specified filters',
	},
	'markets.secFilings': {
		riskLevel: 'read',
		description:
			'Returns a list of SEC filing information (including the submission URL) corresponding to the given search parameters',
	},
	'markets.etf': {
		riskLevel: 'read',
		description:
			'Returns comprehensive information about any ETF by its ticker',
	},
	'markets.mutualFund': {
		riskLevel: 'read',
		description:
			'Returns comprehensive information about any Mutual Fund by its ticker',
	},
	'markets.cryptoPrice': {
		riskLevel: 'read',
		description:
			'Returns the current price and current time (in UNIX timestamp in seconds) for any cryptocurrency symbol',
	},
	'markets.bitcoin': {
		riskLevel: 'read',
		description:
			'Returns the latest Bitcoin price in USD and 24-hour market data',
	},
	'markets.commodityPrice': {
		riskLevel: 'read',
		description:
			'Returns the current price information for one or more commodities',
	},
	'markets.convertCurrency': {
		riskLevel: 'read',
		description:
			'Converts an existing currency and amount into a new currency [premium plan required]',
	},
	'markets.exchangeRate': {
		riskLevel: 'read',
		description:
			'Returns the exchange rate for a given currency pair [premium plan required]',
	},
	'economics.gdp': {
		riskLevel: 'read',
		description: 'Get GDP data from given parameters',
	},
	'economics.inflation': {
		riskLevel: 'read',
		description:
			'Returns current monthly and annual inflation percentages [premium plan required]',
	},
	'economics.unemployment': {
		riskLevel: 'read',
		description: 'Get unemployment data for a given country',
	},
	'economics.population': {
		riskLevel: 'read',
		description: 'Get population data from given parameters',
	},
	'economics.interestRate': {
		riskLevel: 'read',
		description: 'Get a specific interest rate by name',
	},
	'economics.mortgageRate': {
		riskLevel: 'read',
		description:
			'Returns the daily 30-year and 15-year fixed-rate mortgage (FRM) data',
	},
	'economics.mortgageCalculator': {
		riskLevel: 'read',
		description:
			'Returns monthly payment, annual payment, and interest rate information based on given mortgage parameters',
	},
	'economics.incomeTax': {
		riskLevel: 'read',
		description:
			'Returns comprehensive income tax information including tax brackets and rates at both federal and state/provincial levels (where applicable)',
	},
	'economics.incomeTaxCalculator': {
		riskLevel: 'read',
		description:
			'Returns comprehensive annual tax calculations including federal, state/provincial, and FICA taxes where applicable',
	},
	'economics.salesTax': {
		riskLevel: 'read',
		description:
			'Returns one or more sales tax breakdowns by ZIP code according to the specified parameters',
	},
	'economics.salesTaxCalculator': {
		riskLevel: 'read',
		description: 'Calculates sales tax for a given amount and location',
	},
	'economics.propertyTax': {
		riskLevel: 'read',
		description:
			'Returns a list of regions and corresponding 25th, 50th (median), and 75th percentile effective property tax rates',
	},
	'economics.vatRates': {
		riskLevel: 'read',
		description: 'Returns VAT rates for a specified EU country',
	},
	'text.sentiment': {
		riskLevel: 'read',
		description:
			'Returns sentiment analysis score and overall sentiment for a given block of text',
	},
	'text.similarity': {
		riskLevel: 'read',
		description:
			'Returns a similarity score between 0 and 1 (1 is similar and 0 is dissimilar) of two given texts',
	},
	'text.embeddings': {
		riskLevel: 'read',
		description:
			'Returns a 768-dimensional vector as an array that encodes the meaning of any given input text',
	},
	'text.language': {
		riskLevel: 'read',
		description:
			'Returns the language name and 2-letter ISO language code for a given block of text string',
	},
	'text.spellCheck': {
		riskLevel: 'read',
		description:
			'Returns spelling corrections and suggestions for any given text',
	},
	'text.profanityFilter': {
		riskLevel: 'read',
		description:
			'Returns the censored version (bad words replaced with asterisks) of any given text and whether the text contains profanity',
	},
	'text.dictionary': {
		riskLevel: 'read',
		description: 'Returns a string containing definitions for a given word',
	},
	'text.thesaurus': {
		riskLevel: 'read',
		description:
			'Returns a list of synonyms and a list of antonyms for a given word',
	},
	'text.rhymes': {
		riskLevel: 'read',
		description: 'Returns a list of rhyming words for any given word',
	},
	'text.randomWord': {
		riskLevel: 'read',
		description: 'Returns a random word [premium plan required]',
	},
	'text.loremIpsum': {
		riskLevel: 'read',
		description:
			'Returns one or more paragraphs of lorem ipsum placeholder text',
	},
	'utility.qrCode': {
		riskLevel: 'read',
		description: 'Returns a QRCode image binary specified by input parameters',
	},
	'utility.barcode': {
		riskLevel: 'read',
		description: 'Returns a barcode image binary specified by input parameters',
	},
	'utility.password': {
		riskLevel: 'read',
		description:
			'Returns a random password string adhering to the specified parameters',
	},
	'utility.randomUser': {
		riskLevel: 'read',
		description: 'Returns fake random user profiles',
	},
	'utility.counter': {
		riskLevel: 'write',
		description: 'Fetch and possibly update a counter',
	},
	'utility.convertUnit': {
		riskLevel: 'read',
		description:
			'Returns conversions between different units of the same measurement type',
	},
	'utility.logo': {
		riskLevel: 'read',
		description:
			'Get a list of company names, ticker symbols, and logo image URLs matching the input parameters',
	},
	'utility.countryFlag': {
		riskLevel: 'read',
		description: "Get a country's flag as SVG image URLs",
	},
	'utility.randomImage': {
		riskLevel: 'read',
		description:
			'Returns a random image in JPEG format [premium plan required]',
	},
	'utility.emoji': {
		riskLevel: 'read',
		description: 'Returns a list of emojis according to input parameters',
	},
	'transport.aircraft': {
		riskLevel: 'read',
		description: 'Returns a list of aircrafts that match the given parameters',
	},
	'transport.airlines': {
		riskLevel: 'read',
		description:
			'Returns airline details including fleet composition, base airport and branding assets, by name, IATA code or ICAO code',
	},
	'transport.airports': {
		riskLevel: 'read',
		description: 'Returns a list of up to 10 airport results',
	},
	'transport.helicopters': {
		riskLevel: 'read',
		description:
			'Get helicopter technical specifications that match the given parameters',
	},
	'transport.cars': {
		riskLevel: 'read',
		description:
			'Get car data from given parameters [deprecated by the provider]',
	},
	'transport.motorcycles': {
		riskLevel: 'read',
		description:
			'Returns up to 30 motorcycle results matching the input name parameters',
	},
	'transport.electricVehicles': {
		riskLevel: 'read',
		description: 'Get electric vehicle data from given parameters',
	},
	'transport.vin': {
		riskLevel: 'read',
		description:
			'Returns key vehicle information including manufacturer, country of origin, and model year for a given VIN',
	},
	'health.caloriesBurned': {
		riskLevel: 'read',
		description:
			'Returns the calories burned per hour and total calories burned according to given parameters for given activities (up to 10)',
	},
	'health.nutrition': {
		riskLevel: 'read',
		description:
			'This endpoint uses AI to automatically read any text and extract every food item it contains, along with the right portion for each',
	},
	'health.exercises': {
		riskLevel: 'read',
		description:
			'Returns up to 5 exercises that satisfy the given parameters [premium plan required]',
	},
	'health.recipes': {
		riskLevel: 'read',
		description:
			'Get a list of recipes for a given recipe name or ingredient(s)',
	},
	'health.cocktails': {
		riskLevel: 'read',
		description:
			'Returns up to 10 cocktail recipes matching the search parameters',
	},
	'reference.animals': {
		riskLevel: 'read',
		description: 'Returns up to 10 results matching the input name parameter',
	},
	'reference.cats': {
		riskLevel: 'read',
		description: 'Get a list of cat breeds matching specified parameters',
	},
	'reference.dogs': {
		riskLevel: 'read',
		description: 'Get a list of dog breeds matching specified parameters',
	},
	'reference.planets': {
		riskLevel: 'read',
		description: 'Get a list of planets matching specified parameters',
	},
	'reference.stars': {
		riskLevel: 'read',
		description: 'Get a list of stars matching specified parameters',
	},
	'reference.historicalEvents': {
		riskLevel: 'read',
		description:
			'Returns a list of up to 10 events that match the search parameters',
	},
	'reference.historicalFigures': {
		riskLevel: 'read',
		description:
			'Returns a list of up to 10 people that match the search parameters',
	},
	'reference.dayInHistory': {
		riskLevel: 'read',
		description:
			'Returns historical events that occurred on a specific date [premium plan required]',
	},
	'reference.celebrities': {
		riskLevel: 'read',
		description:
			'Returns a list of up to 30 celebrities that match the search parameters',
	},
	'reference.babyNames': {
		riskLevel: 'read',
		description: 'Returns 10 baby name results',
	},
	'entertainment.jokes': {
		riskLevel: 'read',
		description: 'Returns one (or more) random funny jokes',
	},
	'entertainment.dadJokes': {
		riskLevel: 'read',
		description: 'Returns one (or more) random dad jokes',
	},
	'entertainment.chuckNorris': {
		riskLevel: 'read',
		description: 'Returns a Chuck Norris joke',
	},
	'entertainment.jokeOfTheDay': {
		riskLevel: 'read',
		description: 'Returns a single joke for the current day',
	},
	'entertainment.facts': {
		riskLevel: 'read',
		description: 'Returns one (or more) random facts',
	},
	'entertainment.factOfTheDay': {
		riskLevel: 'read',
		description: 'Returns a single fact for the current day',
	},
	'entertainment.quotes': {
		riskLevel: 'read',
		description:
			'Returns high-quality quotes with advanced filtering by categories (include/exclude), author, work, and pagination support [premium plan required]',
	},
	'entertainment.randomQuotes': {
		riskLevel: 'read',
		description:
			'Returns random high-quality quotes with advanced filtering by categories (include/exclude), author, and work [premium plan required]',
	},
	'entertainment.quoteOfTheDay': {
		riskLevel: 'read',
		description: 'Returns a single aphoristic quote for the current day',
	},
	'entertainment.advice': {
		riskLevel: 'read',
		description: 'Returns a random piece of life advice',
	},
	'entertainment.bucketList': {
		riskLevel: 'read',
		description: 'Returns a random bucket list idea',
	},
	'entertainment.hobbies': {
		riskLevel: 'read',
		description:
			'Returns a random hobby and a Wikipedia link detailing the hobby',
	},
	'entertainment.horoscope': {
		riskLevel: 'read',
		description: 'Returns the daily horoscope for a specific zodiac sign',
	},
	'entertainment.riddles': {
		riskLevel: 'read',
		description: 'Returns one or more random riddles',
	},
	'entertainment.trivia': {
		riskLevel: 'read',
		description: 'Returns a random trivia question and answer',
	},
	'entertainment.triviaOfTheDay': {
		riskLevel: 'read',
		description:
			'Returns a single trivia question and answer for the current day',
	},
	'entertainment.generateSudoku': {
		riskLevel: 'read',
		description: 'Generate a new Sudoku puzzle with specified parameters',
	},
	'entertainment.solveSudoku': {
		riskLevel: 'read',
		description: 'Solve an existing Sudoku puzzle',
	},
} satisfies RequiredPluginEndpointMeta<typeof apiNinjasEndpointsNested>;

// `handleCorsairError` selects the first handler whose `match` returns true,
// walking keys in insertion order. DEFAULT matches everything, so it has to be
// last: spreading caller-supplied handlers after it would leave them
// unreachable.
function mergeErrorHandlers(
	builtIn: CorsairErrorHandler,
	overrides?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtInRest } = builtIn;
	const { DEFAULT: overrideDefault, ...overrideRest } = overrides ?? {};

	return {
		...builtInRest,
		...overrideRest,
		DEFAULT: overrideDefault ?? builtInDefault,
	};
}

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * One key, sent as `X-Api-Key`. There is no OAuth flow, no account-specific
 * host and no second credential to resolve.
 */
export const apiNinjasAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseApiNinjasPlugin<T extends ApiNinjasPluginOptions> =
	CorsairPlugin<
		'apininjas',
		typeof ApiNinjasSchema,
		typeof apiNinjasEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof apiNinjasAuthConfig
	>;

export type InternalApiNinjasPlugin =
	BaseApiNinjasPlugin<ApiNinjasPluginOptions>;

export type ExternalApiNinjasPlugin<T extends ApiNinjasPluginOptions> =
	BaseApiNinjasPlugin<T>;

// The assertion is safe: ApiNinjasPluginOptions has no required fields, so an
// empty object satisfies the constraint at runtime even though TypeScript
// cannot verify it without the assertion.
export function apininjas<const T extends ApiNinjasPluginOptions>(
	incomingOptions: ApiNinjasPluginOptions & T = {} as ApiNinjasPluginOptions &
		T,
): ExternalApiNinjasPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'apininjas',
		schema: ApiNinjasSchema,
		options,
		hooks: options.hooks,
		endpoints: apiNinjasEndpointsNested,
		webhooks: {},
		endpointMeta: apiNinjasEndpointMeta,
		endpointSchemas: apiNinjasEndpointSchemas,
		authConfig: apiNinjasAuthConfig,
		// API Ninjas is request/response only: it has no webhooks, no event
		// subscriptions and nothing that calls back.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ApiNinjasKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('apininjas', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('apininjas', 'api_key');
		},
	} satisfies InternalApiNinjasPlugin;
}

export type {
	ApiNinjasEndpointInputs,
	ApiNinjasEndpointOutputs,
} from './endpoints/types';
export type {
	ApiNinjasAircraftEntity,
	ApiNinjasAirlineEntity,
	ApiNinjasAirportEntity,
	ApiNinjasAnimalEntity,
	ApiNinjasCityEntity,
	ApiNinjasCountryEntity,
	ApiNinjasEmojiEntity,
	ApiNinjasPlanetEntity,
	ApiNinjasSp500Entity,
	ApiNinjasStarEntity,
	ApiNinjasStockExchangeEntity,
	ApiNinjasUniversityEntity,
	ApiNinjasVehicleEntity,
} from './schema/database';
