# @corsair-dev/apininjas

API Ninjas plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/apininjas
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `calendar.holidays` | `apininjas.api.calendar.holidays` | `read` | Returns a list of holiday entries for a given country and year [premium plan required] |
| `calendar.isPublicHoliday` | `apininjas.api.calendar.isPublicHoliday` | `read` | Returns whether a given date is a public holiday for a given country |
| `calendar.isWorkingDay` | `apininjas.api.calendar.isWorkingDay` | `read` | Returns whether a given date is a working day for a given country |
| `calendar.publicHolidays` | `apininjas.api.calendar.publicHolidays` | `read` | Returns a list of public holidays for a given country and year [premium plan required] |
| `calendar.timezone` | `apininjas.api.calendar.timezone` | `read` | Get timezone info by city/state/country or location coordinates (latitude/longitude) |
| `calendar.workingDays` | `apininjas.api.calendar.workingDays` | `read` | Returns a list of working days and non-working days for a given country and year/month |
| `calendar.worldTime` | `apininjas.api.calendar.worldTime` | `read` | Get the current date and time by city/state/country, location coordinates (latitude/longitude), or timezone [premium plan required] |
| `economics.gdp` | `apininjas.api.economics.gdp` | `read` | Get GDP data from given parameters |
| `economics.incomeTax` | `apininjas.api.economics.incomeTax` | `read` | Returns comprehensive income tax information including tax brackets and rates at both federal and state/provincial levels (where applicable) |
| `economics.incomeTaxCalculator` | `apininjas.api.economics.incomeTaxCalculator` | `read` | Returns comprehensive annual tax calculations including federal, state/provincial, and FICA taxes where applicable |
| `economics.inflation` | `apininjas.api.economics.inflation` | `read` | Returns current monthly and annual inflation percentages [premium plan required] |
| `economics.interestRate` | `apininjas.api.economics.interestRate` | `read` | Get a specific interest rate by name |
| `economics.mortgageCalculator` | `apininjas.api.economics.mortgageCalculator` | `read` | Returns monthly payment, annual payment, and interest rate information based on given mortgage parameters |
| `economics.mortgageRate` | `apininjas.api.economics.mortgageRate` | `read` | Returns the daily 30-year and 15-year fixed-rate mortgage (FRM) data |
| `economics.population` | `apininjas.api.economics.population` | `read` | Get population data from given parameters |
| `economics.propertyTax` | `apininjas.api.economics.propertyTax` | `read` | Returns a list of regions and corresponding 25th, 50th (median), and 75th percentile effective property tax rates |
| `economics.salesTax` | `apininjas.api.economics.salesTax` | `read` | Returns one or more sales tax breakdowns by ZIP code according to the specified parameters |
| `economics.salesTaxCalculator` | `apininjas.api.economics.salesTaxCalculator` | `read` | Calculates sales tax for a given amount and location |
| `economics.unemployment` | `apininjas.api.economics.unemployment` | `read` | Get unemployment data for a given country |
| `economics.vatRates` | `apininjas.api.economics.vatRates` | `read` | Returns VAT rates for a specified EU country |
| `entertainment.advice` | `apininjas.api.entertainment.advice` | `read` | Returns a random piece of life advice |
| `entertainment.bucketList` | `apininjas.api.entertainment.bucketList` | `read` | Returns a random bucket list idea |
| `entertainment.chuckNorris` | `apininjas.api.entertainment.chuckNorris` | `read` | Returns a Chuck Norris joke |
| `entertainment.dadJokes` | `apininjas.api.entertainment.dadJokes` | `read` | Returns one (or more) random dad jokes |
| `entertainment.factOfTheDay` | `apininjas.api.entertainment.factOfTheDay` | `read` | Returns a single fact for the current day |
| `entertainment.facts` | `apininjas.api.entertainment.facts` | `read` | Returns one (or more) random facts |
| `entertainment.generateSudoku` | `apininjas.api.entertainment.generateSudoku` | `read` | Generate a new Sudoku puzzle with specified parameters |
| `entertainment.hobbies` | `apininjas.api.entertainment.hobbies` | `read` | Returns a random hobby and a Wikipedia link detailing the hobby |
| `entertainment.horoscope` | `apininjas.api.entertainment.horoscope` | `read` | Returns the daily horoscope for a specific zodiac sign |
| `entertainment.jokeOfTheDay` | `apininjas.api.entertainment.jokeOfTheDay` | `read` | Returns a single joke for the current day |
| `entertainment.jokes` | `apininjas.api.entertainment.jokes` | `read` | Returns one (or more) random funny jokes |
| `entertainment.quoteOfTheDay` | `apininjas.api.entertainment.quoteOfTheDay` | `read` | Returns a single aphoristic quote for the current day |
| `entertainment.quotes` | `apininjas.api.entertainment.quotes` | `read` | Returns high-quality quotes with advanced filtering by categories (include/exclude), author, work, and pagination support [premium plan required] |
| `entertainment.randomQuotes` | `apininjas.api.entertainment.randomQuotes` | `read` | Returns random high-quality quotes with advanced filtering by categories (include/exclude), author, and work [premium plan required] |
| `entertainment.riddles` | `apininjas.api.entertainment.riddles` | `read` | Returns one or more random riddles |
| `entertainment.solveSudoku` | `apininjas.api.entertainment.solveSudoku` | `read` | Solve an existing Sudoku puzzle |
| `entertainment.trivia` | `apininjas.api.entertainment.trivia` | `read` | Returns a random trivia question and answer |
| `entertainment.triviaOfTheDay` | `apininjas.api.entertainment.triviaOfTheDay` | `read` | Returns a single trivia question and answer for the current day |
| `health.caloriesBurned` | `apininjas.api.health.caloriesBurned` | `read` | Returns the calories burned per hour and total calories burned according to given parameters for given activities (up to 10) |
| `health.cocktails` | `apininjas.api.health.cocktails` | `read` | Returns up to 10 cocktail recipes matching the search parameters |
| `health.exercises` | `apininjas.api.health.exercises` | `read` | Returns up to 5 exercises that satisfy the given parameters [premium plan required] |
| `health.nutrition` | `apininjas.api.health.nutrition` | `read` | This endpoint uses AI to automatically read any text and extract every food item it contains, along with the right portion for each |
| `health.recipes` | `apininjas.api.health.recipes` | `read` | Get a list of recipes for a given recipe name or ingredient(s) |
| `internet.dnsRecords` | `apininjas.api.internet.dnsRecords` | `read` | Returns a list of DNS records associated with a particular domain |
| `internet.domain` | `apininjas.api.internet.domain` | `read` | Returns availability, registration lifecycle, and email/hosting intelligence for a given domain name |
| `internet.ipLookup` | `apininjas.api.internet.ipLookup` | `read` | Returns the location of the IP address specified |
| `internet.mxRecords` | `apininjas.api.internet.mxRecords` | `read` | Returns a list of MX records associated with a particular domain |
| `internet.scrape` | `apininjas.api.internet.scrape` | `read` | Returns the HTML or plaintext data scraped from a given URL |
| `internet.urlLookup` | `apininjas.api.internet.urlLookup` | `read` | Returns the location of the IP address hosting the URL domain |
| `internet.userAgent` | `apininjas.api.internet.userAgent` | `read` | Generates a realistic user agent string based on optional parameters |
| `internet.webpage` | `apininjas.api.internet.webpage` | `read` | Returns the URL information and web page metadata from a given URL |
| `internet.whois` | `apininjas.api.internet.whois` | `read` | Returns domain registration details (e.g. registrar, contact information, expiration date, name servers) for a given domain name [premium plan required] |
| `location.airQuality` | `apininjas.api.location.airQuality` | `read` | Get air quality by city or location coordinates (latitude/longitude) |
| `location.cities` | `apininjas.api.location.cities` | `read` | Get city data from either a name or population range |
| `location.country` | `apininjas.api.location.country` | `read` | Get country data from given parameters |
| `location.county` | `apininjas.api.location.county` | `read` | Returns details for one or more counties matching the input parameters |
| `location.evChargers` | `apininjas.api.location.evChargers` | `read` | find ev charging stations |
| `location.geocode` | `apininjas.api.location.geocode` | `read` | Get current city coordinates by city and country name |
| `location.hospitals` | `apininjas.api.location.hospitals` | `read` | Get hospital data based on given parameters |
| `location.postalCode` | `apininjas.api.location.postalCode` | `read` | Returns a list of postal code details matching the input parameters |
| `location.reverseGeocode` | `apininjas.api.location.reverseGeocode` | `read` | Returns a list of cities that contain a given latitude and longitude |
| `location.universities` | `apininjas.api.location.universities` | `read` | Returns information about universities matching the provided filters |
| `location.weather` | `apininjas.api.location.weather` | `read` | Get current weather, wind speed and direction, humidity, and temperature data by city, ZIP code, or geolocation coordinates (latitude/longitude) [premium plan required] |
| `location.weatherForecast` | `apininjas.api.location.weatherForecast` | `read` | Returns a 5-day weather forecast in 3-hour intervals for a given city [premium plan required] |
| `location.zipCode` | `apininjas.api.location.zipCode` | `read` | Returns a list of ZIP Code details matching the input parameters |
| `markets.bitcoin` | `apininjas.api.markets.bitcoin` | `read` | Returns the latest Bitcoin price in USD and 24-hour market data |
| `markets.commodityPrice` | `apininjas.api.markets.commodityPrice` | `read` | Returns the current price information for one or more commodities |
| `markets.convertCurrency` | `apininjas.api.markets.convertCurrency` | `read` | Converts an existing currency and amount into a new currency [premium plan required] |
| `markets.cryptoPrice` | `apininjas.api.markets.cryptoPrice` | `read` | Returns the current price and current time (in UNIX timestamp in seconds) for any cryptocurrency symbol |
| `markets.earnings` | `apininjas.api.markets.earnings` | `read` | Returns a JSON array of detailed earnings reports, each with comprehensive financial statements and key performance metrics |
| `markets.earningsCalendar` | `apininjas.api.markets.earningsCalendar` | `read` | Returns a list of past earnings results and upcoming earnings dates |
| `markets.earningsTranscript` | `apininjas.api.markets.earningsTranscript` | `read` | Returns the earnings transcript for a given company earning quarter [premium plan required] |
| `markets.etf` | `apininjas.api.markets.etf` | `read` | Returns comprehensive information about any ETF by its ticker |
| `markets.exchangeRate` | `apininjas.api.markets.exchangeRate` | `read` | Returns the exchange rate for a given currency pair [premium plan required] |
| `markets.insiderTransactions` | `apininjas.api.markets.insiderTransactions` | `read` | Returns a list of insider trading transactions that match the specified filters |
| `markets.marketCap` | `apininjas.api.markets.marketCap` | `read` | Returns the current market cap data for any given company ticker |
| `markets.mutualFund` | `apininjas.api.markets.mutualFund` | `read` | Returns comprehensive information about any Mutual Fund by its ticker |
| `markets.secFilings` | `apininjas.api.markets.secFilings` | `read` | Returns a list of SEC filing information (including the submission URL) corresponding to the given search parameters |
| `markets.sp500` | `apininjas.api.markets.sp500` | `read` | Returns S&P 500 index constituents, filterable by ticker, company name, sector or the date the company joined the index |
| `markets.stockExchanges` | `apininjas.api.markets.stockExchanges` | `read` | Returns detailed information about stock exchanges matching the specified criteria |
| `markets.stockPrice` | `apininjas.api.markets.stockPrice` | `read` | Returns price information for any given ticker symbol |
| `markets.ticker` | `apininjas.api.markets.ticker` | `read` | Returns comprehensive company profile information including company name, CEO, address, financial data, exchange information, identifiers... |
| `markets.tickerList` | `apininjas.api.markets.tickerList` | `read` | Returns a list of all available companies and their ticker symbols |
| `reference.animals` | `apininjas.api.reference.animals` | `read` | Returns up to 10 results matching the input name parameter |
| `reference.babyNames` | `apininjas.api.reference.babyNames` | `read` | Returns 10 baby name results |
| `reference.cats` | `apininjas.api.reference.cats` | `read` | Get a list of cat breeds matching specified parameters |
| `reference.celebrities` | `apininjas.api.reference.celebrities` | `read` | Returns a list of up to 30 celebrities that match the search parameters |
| `reference.dayInHistory` | `apininjas.api.reference.dayInHistory` | `read` | Returns historical events that occurred on a specific date [premium plan required] |
| `reference.dogs` | `apininjas.api.reference.dogs` | `read` | Get a list of dog breeds matching specified parameters |
| `reference.historicalEvents` | `apininjas.api.reference.historicalEvents` | `read` | Returns a list of up to 10 events that match the search parameters |
| `reference.historicalFigures` | `apininjas.api.reference.historicalFigures` | `read` | Returns a list of up to 10 people that match the search parameters |
| `reference.planets` | `apininjas.api.reference.planets` | `read` | Get a list of planets matching specified parameters |
| `reference.stars` | `apininjas.api.reference.stars` | `read` | Get a list of stars matching specified parameters |
| `text.dictionary` | `apininjas.api.text.dictionary` | `read` | Returns a string containing definitions for a given word |
| `text.embeddings` | `apininjas.api.text.embeddings` | `read` | Returns a 768-dimensional vector as an array that encodes the meaning of any given input text |
| `text.language` | `apininjas.api.text.language` | `read` | Returns the language name and 2-letter ISO language code for a given block of text string |
| `text.loremIpsum` | `apininjas.api.text.loremIpsum` | `read` | Returns one or more paragraphs of lorem ipsum placeholder text |
| `text.profanityFilter` | `apininjas.api.text.profanityFilter` | `read` | Returns the censored version (bad words replaced with asterisks) of any given text and whether the text contains profanity |
| `text.randomWord` | `apininjas.api.text.randomWord` | `read` | Returns a random word [premium plan required] |
| `text.rhymes` | `apininjas.api.text.rhymes` | `read` | Returns a list of rhyming words for any given word |
| `text.sentiment` | `apininjas.api.text.sentiment` | `read` | Returns sentiment analysis score and overall sentiment for a given block of text |
| `text.similarity` | `apininjas.api.text.similarity` | `read` | Returns a similarity score between 0 and 1 (1 is similar and 0 is dissimilar) of two given texts |
| `text.spellCheck` | `apininjas.api.text.spellCheck` | `read` | Returns spelling corrections and suggestions for any given text |
| `text.thesaurus` | `apininjas.api.text.thesaurus` | `read` | Returns a list of synonyms and a list of antonyms for a given word |
| `transport.aircraft` | `apininjas.api.transport.aircraft` | `read` | Returns a list of aircrafts that match the given parameters |
| `transport.airlines` | `apininjas.api.transport.airlines` | `read` | Returns airline details including fleet composition, base airport and branding assets, by name, IATA code or ICAO code |
| `transport.airports` | `apininjas.api.transport.airports` | `read` | Returns a list of up to 10 airport results |
| `transport.cars` | `apininjas.api.transport.cars` | `read` | Get car data from given parameters [deprecated by the provider] |
| `transport.electricVehicles` | `apininjas.api.transport.electricVehicles` | `read` | Get electric vehicle data from given parameters |
| `transport.helicopters` | `apininjas.api.transport.helicopters` | `read` | Get helicopter technical specifications that match the given parameters |
| `transport.motorcycles` | `apininjas.api.transport.motorcycles` | `read` | Returns up to 30 motorcycle results matching the input name parameters |
| `transport.vin` | `apininjas.api.transport.vin` | `read` | Returns key vehicle information including manufacturer, country of origin, and model year for a given VIN |
| `utility.barcode` | `apininjas.api.utility.barcode` | `read` | Returns a barcode image binary specified by input parameters |
| `utility.convertUnit` | `apininjas.api.utility.convertUnit` | `read` | Returns conversions between different units of the same measurement type |
| `utility.counter` | `apininjas.api.utility.counter` | `write` | Fetch and possibly update a counter |
| `utility.countryFlag` | `apininjas.api.utility.countryFlag` | `read` | Get a country's flag as SVG image URLs |
| `utility.emoji` | `apininjas.api.utility.emoji` | `read` | Returns a list of emojis according to input parameters |
| `utility.logo` | `apininjas.api.utility.logo` | `read` | Get a list of company names, ticker symbols, and logo image URLs matching the input parameters |
| `utility.password` | `apininjas.api.utility.password` | `read` | Returns a random password string adhering to the specified parameters |
| `utility.qrCode` | `apininjas.api.utility.qrCode` | `read` | Returns a QRCode image binary specified by input parameters |
| `utility.randomImage` | `apininjas.api.utility.randomImage` | `read` | Returns a random image in JPEG format [premium plan required] |
| `utility.randomUser` | `apininjas.api.utility.randomUser` | `read` | Returns fake random user profiles |
| `validation.bin` | `apininjas.api.validation.bin` | `read` | Returns detailed information about a bank based on the BIN number provided |
| `validation.disposableEmail` | `apininjas.api.validation.disposableEmail` | `read` | Returns metadata for a given email address, including whether it is from a disposable email provider |
| `validation.email` | `apininjas.api.validation.email` | `read` | Returns metadata (including whether it is valid) for a given email address |
| `validation.iban` | `apininjas.api.validation.iban` | `read` | Returns detailed information on a given IBAN |
| `validation.phone` | `apininjas.api.validation.phone` | `read` | Returns metadata (including whether it is valid) for a given phone number |
| `validation.routingNumber` | `apininjas.api.validation.routingNumber` | `read` | Returns detailed information about a bank based on its routing number |
| `validation.swiftCode` | `apininjas.api.validation.swiftCode` | `read` | Returns a list of bank information (including SWIFT/BIC Code) that match the input parameter |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/apininjas

## License

Apache-2.0
