import { z } from 'zod';

/**
 * Locally mirrored API Ninjas reference data.
 *
 * Field names match the official JSON keys exactly. Each field is labeled
 * from the provider's documentation (live 2026-08-15). Local-only keys are
 * `id` and `captured_at`.
 *
 * Prices, random/daily values, generators and caller-supplied lookups are
 * not stored. Masked free-tier prose is dropped at write time, not here.
 *
 * Docs: https://api-ninjas.com/api
 */

/** Official scalar that the free tier may replace with placeholder prose. */
const Text = z.string().nullable().optional();
const Num = z.union([z.number(), z.string()]).nullable().optional();
const Flag = z.union([z.boolean(), z.string()]).nullable().optional();

/**
 * Airports (`GET /v1/airports`).
 *
 * Official: https://api-ninjas.com/api/airports
 */
export const ApiNinjasAirportEntity = z.object({
	id: z.string(),
	/** 3-character IATA airport code. */
	iata: Text,
	/** 4-character ICAO airport code. May be empty — use `ident`. */
	icao: Text,
	/** Identifier that is always present when ICAO is empty. */
	ident: Text,
	/** Airport name. */
	name: Text,
	/** City where the airport is located. */
	city: Text,
	/** Administrative region (state or province). */
	region: Text,
	/** Administrative region code. */
	region_code: Text,
	/** 2-letter ISO country code. */
	country: Text,
	/** Country name. */
	country_name: Text,
	/** Continent code: AF, AN, AS, EU, NA, OC, SA. */
	continent: Text,
	/** Airport elevation in feet. */
	elevation_ft: Num,
	/** Airport elevation in metres. */
	elevation_m: Num,
	/** Latitude coordinate. */
	latitude: Num,
	/** Longitude coordinate. */
	longitude: Num,
	/** Airport timezone (e.g. Europe/London). */
	timezone: Text,
	/** Facility type (large_airport, heliport, …). */
	type: Text,
	/** Airport size: large, medium, small. */
	size: Text,
	/** Whether the airport has scheduled airline service. */
	scheduled_service: Flag,
	/** Whether the airport is permanently closed. */
	is_closed: Flag,
	/** GPS code. */
	gps_code: Text,
	/** Local airport code. */
	local_code: Text,
	/** Official airport website. */
	home_link: Text,
	/** Wikipedia page for the airport. */
	wikipedia_link: Text,
	/** Alternate-name keywords. */
	keywords: z.array(z.string()).nullable().optional(),
	/** Number of runways. */
	num_runways: Num,
	/** Longest runway length in feet. */
	longest_runway_ft: Num,
	/** Runway records from the official response. */
	runways: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
	/** Estimated annual passengers. */
	estimated_annual_passengers: Num,
	captured_at: z.coerce.date(),
});
export type ApiNinjasAirportEntity = z.infer<typeof ApiNinjasAirportEntity>;

/**
 * Airlines (`GET /v1/airlines`).
 *
 * No documentation page. Keys confirmed against live `/v1/airlines`.
 */
export const ApiNinjasAirlineEntity = z.object({
	id: z.string(),
	/** Airline name. */
	name: Text,
	/** Two-character IATA airline code. */
	iata: Text,
	/** Three-character ICAO airline code. */
	icao: Text,
	/** Country the airline is based in. */
	country: Text,
	/** Year the airline was created. */
	year_created: Text,
	/** Base airport. */
	base: Text,
	/** Fleet composition, including `total`. */
	fleet: z.record(z.string(), z.unknown()).nullable().optional(),
	/** Airline logo URL. */
	logo_url: Text,
	/** Brand mark URL. */
	brandmark_url: Text,
	/** Tail logo URL. */
	tail_logo_url: Text,
	captured_at: z.coerce.date(),
});
export type ApiNinjasAirlineEntity = z.infer<typeof ApiNinjasAirlineEntity>;

/**
 * Aircraft (`GET /v1/aircraft`).
 *
 * Official: https://api-ninjas.com/api/aircraft
 * Sample values arrive as strings.
 */
export const ApiNinjasAircraftEntity = z.object({
	id: z.string(),
	/** Company that designed and built the aircraft. */
	manufacturer: Text,
	/** Aircraft model name. */
	model: Text,
	/** Type of engine (e.g. Jet, Piston, Propjet). */
	engine_type: Text,
	/** Engine thrust in pounds-force. */
	engine_thrust_lb_ft: Num,
	/** Maximum air speed in knots. */
	max_speed_knots: Num,
	/** Cruise speed in knots. */
	cruise_speed_knots: Num,
	/** Service ceiling in feet. */
	ceiling_ft: Num,
	/** Takeoff ground run distance in feet. */
	takeoff_ground_run_ft: Num,
	/** Landing ground roll distance in feet. */
	landing_ground_roll_ft: Num,
	/** Gross weight in pounds. */
	gross_weight_lbs: Num,
	/** Empty weight in pounds. */
	empty_weight_lbs: Num,
	/** Length in feet. */
	length_ft: Num,
	/** Height in feet. */
	height_ft: Num,
	/** Wingspan in feet. */
	wing_span_ft: Num,
	/** Range in nautical miles. */
	range_nautical_miles: Num,
	captured_at: z.coerce.date(),
});
export type ApiNinjasAircraftEntity = z.infer<typeof ApiNinjasAircraftEntity>;

/**
 * Road vehicles from `/v1/cars` (deprecated), `/v1/motorcycles` and
 * `/v1/electricvehicle`. `kind` is local — the three official shapes share
 * make/model keys.
 *
 * Cars: https://api-ninjas.com/api/cars
 */
export const ApiNinjasVehicleEntity = z.object({
	id: z.string(),
	/** Local discriminator for the three vehicle endpoints. */
	kind: z.enum(['car', 'motorcycle', 'electric']),
	/** Manufacturer name. */
	make: Text,
	/** Model name. */
	model: Text,
	/** Model year (`/v1/cars`, `/v1/motorcycles`). */
	year: Num,
	/** First production year (`/v1/electricvehicle` `year_start`). */
	year_start: Num,
	/** Official `/v1/cars` `class` (e.g. compact car). */
	class: Text,
	/** Official `/v1/motorcycles` `type` (e.g. ATV). */
	type: Text,
	/** Fuel type (`/v1/cars`). */
	fuel_type: Text,
	/** City MPG (`/v1/cars`). */
	city_mpg: Num,
	/** Combined MPG (`/v1/cars`). */
	combination_mpg: Num,
	/** Highway MPG (`/v1/cars`). */
	highway_mpg: Num,
	/** Cylinder count (`/v1/cars`). */
	cylinders: Num,
	/** Engine displacement (`/v1/cars`, `/v1/motorcycles`). */
	displacement: Num,
	/** Drive layout. */
	drive: Text,
	/** Transmission. */
	transmission: Text,
	/** Usable battery capacity (`/v1/electricvehicle`). */
	battery_capacity: Text,
	/** Electric range (`/v1/electricvehicle`). */
	electric_range: Num,
	captured_at: z.coerce.date(),
});
export type ApiNinjasVehicleEntity = z.infer<typeof ApiNinjasVehicleEntity>;

/**
 * Countries (`GET /v1/country`).
 *
 * Official: https://api-ninjas.com/api/country
 * `population` is documented in thousands.
 */
export const ApiNinjasCountryEntity = z.object({
	id: z.string(),
	/** Country name. */
	name: Text,
	/** 2-letter ISO-3166 alpha-2 code. */
	iso2: Text,
	/** Capital city. */
	capital: Text,
	/** Geographic region (e.g. Northern America). */
	region: Text,
	/** Official currency object. */
	currency: z
		.object({
			/** 3-letter currency code. */
			code: Text,
			/** Currency name. */
			name: Text,
		})
		.loose()
		.nullable()
		.optional(),
	/** Gross domestic product in US dollars. */
	gdp: Num,
	/** GDP per capita. */
	gdp_per_capita: Num,
	/** GDP growth rate in %. */
	gdp_growth: Num,
	/** Population in thousands. */
	population: Num,
	/** Population density. */
	pop_density: Num,
	/** Population growth rate. */
	pop_growth: Num,
	/** Surface area in km². */
	surface_area: Num,
	/** Urban population rate in %. */
	urban_population: Num,
	/** Urban population growth rate. */
	urban_population_growth: Num,
	/** Unemployment rate in %. */
	unemployment: Num,
	/** Fertility rate (children per woman). */
	fertility: Num,
	/** Infant mortality per 1,000 live births. */
	infant_mortality: Num,
	/** Male life expectancy. */
	life_expectancy_male: Num,
	/** Female life expectancy. */
	life_expectancy_female: Num,
	/** Sex ratio. */
	sex_ratio: Num,
	/** Employment in services (%). */
	employment_services: Num,
	/** Employment in industry (%). */
	employment_industry: Num,
	/** Employment in agriculture (%). */
	employment_agriculture: Num,
	/** Imports. */
	imports: Num,
	/** Exports. */
	exports: Num,
	/** CO₂ emissions. */
	co2_emissions: Num,
	/** Forested area (%). */
	forested_area: Num,
	/** Annual tourists. */
	tourists: Num,
	/** Homicide rate. */
	homicide_rate: Num,
	/** Threatened species count. */
	threatened_species: Num,
	/** Internet users (%). */
	internet_users: Num,
	/** Refugees. */
	refugees: Num,
	/** Primary school enrollment, female. */
	primary_school_enrollment_female: Num,
	/** Primary school enrollment, male. */
	primary_school_enrollment_male: Num,
	/** Secondary school enrollment, female. */
	secondary_school_enrollment_female: Num,
	/** Secondary school enrollment, male. */
	secondary_school_enrollment_male: Num,
	/** Post-secondary enrollment, female. */
	post_secondary_enrollment_female: Num,
	/** Post-secondary enrollment, male. */
	post_secondary_enrollment_male: Num,
	/** Telephone country codes. */
	telephone_country_codes: z.array(z.string()).nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasCountryEntity = z.infer<typeof ApiNinjasCountryEntity>;

/**
 * Cities (`GET /v1/city`).
 *
 * Official: https://api-ninjas.com/api/city
 * Documented fields only — the API does not return `region`.
 */
export const ApiNinjasCityEntity = z.object({
	id: z.string(),
	/** The name of the city. */
	name: Text,
	/** Latitude coordinate of the city. */
	latitude: Num,
	/** Longitude coordinate of the city. */
	longitude: Num,
	/** 2-letter ISO 3166 alpha-2 country code. */
	country: Text,
	/** City population count. */
	population: Num,
	/** Whether the city is a capital city. */
	is_capital: Flag,
	captured_at: z.coerce.date(),
});
export type ApiNinjasCityEntity = z.infer<typeof ApiNinjasCityEntity>;

/**
 * Universities (`GET /v1/university`).
 *
 * Official: https://api-ninjas.com/api/university
 */
export const ApiNinjasUniversityEntity = z.object({
	id: z.string(),
	/** The full name of the university. */
	name: Text,
	/** Degree types offered. */
	degree_types: z.array(z.string()).nullable().optional(),
	/** Street address. */
	address: Text,
	/** City where the university is located. */
	city: Text,
	/** State or province abbreviation. */
	state: Text,
	/** Postal/zip code. */
	postal_code: Text,
	/** Country (e.g. USA, Canada). */
	country: Text,
	/** County. */
	county: Text,
	/** Timezone (e.g. EST). */
	timezone: Text,
	/** Latitude coordinate. */
	latitude: Text,
	/** Longitude coordinate. */
	longitude: Text,
	/** Contact phone number. */
	phone: Text,
	/** Contact email. Only returned for some records. */
	email: Text,
	/** Official website URL. */
	website: Text,
	/** Institution type (e.g. Private (Not For Profit)). */
	institution_type: Text,
	/** Typical undergraduate duration (e.g. 4 Years). */
	years: Text,
	/** Enrolled students, as a string. */
	enrollment: Text,
	/** Student-to-faculty ratio (e.g. 7 to 1). */
	student_faculty_ratio: Text,
	/** Annual tuition in USD. Frequently omitted. */
	tuition: Num,
	captured_at: z.coerce.date(),
});
export type ApiNinjasUniversityEntity = z.infer<
	typeof ApiNinjasUniversityEntity
>;

/**
 * Stock exchanges (`GET /v1/stockexchange`).
 *
 * Official: https://api-ninjas.com/api/stockexchange
 */
export const ApiNinjasStockExchangeEntity = z.object({
	id: z.string(),
	/** Market Identifier Code (e.g. XNYS). */
	mic: Text,
	/** Stock exchange name. */
	name: Text,
	/** City where the exchange is located. */
	city: Text,
	/** Country name or code, as returned. */
	country: Text,
	/** ISO2 country code. */
	iso2: Text,
	/** Description of the stock exchange. */
	description: Text,
	/** Physical address. */
	address: Text,
	/** Official website. */
	website: Text,
	/** Year the exchange was established, as a string. */
	founded: Text,
	/** Number of listings. */
	num_listings: Num,
	/** Total market cap of listed companies, in USD. */
	market_cap_usd: Num,
	/** Market cap in local `currency` when `market_cap_usd` is absent. */
	market_cap: Num,
	/** Local trading currency. */
	currency: Text,
	/** Timezone of the stock exchange. */
	timezone: Text,
	/** Opening time. Business/Professional tier. */
	market_open: Text,
	/** Closing time. Business/Professional tier. */
	market_close: Text,
	/** Whether the exchange is currently open. Business/Professional tier. */
	is_market_open: Flag,
	/** Reason the exchange is closed, or null if open. */
	closed_reason: Text,
	captured_at: z.coerce.date(),
});
export type ApiNinjasStockExchangeEntity = z.infer<
	typeof ApiNinjasStockExchangeEntity
>;

/**
 * S&P 500 constituents (`GET /v1/sp500`).
 *
 * No documentation page. Keys confirmed against live `/v1/sp500`.
 */
export const ApiNinjasSp500Entity = z.object({
	id: z.string(),
	/** Stock ticker symbol of a constituent. */
	ticker: Text,
	/** Company name. */
	company_name: Text,
	/** GICS sector. */
	sector: Text,
	/** GICS sub-industry. */
	sub_industry: Text,
	/** Headquarters location. */
	headquarters: Text,
	/** Date the company was added, YYYY-MM-DD. */
	date_added: Text,
	/** SEC Central Index Key. */
	cik: Text,
	captured_at: z.coerce.date(),
});
export type ApiNinjasSp500Entity = z.infer<typeof ApiNinjasSp500Entity>;

/**
 * Emoji (`GET /v1/emoji`).
 *
 * Official: https://api-ninjas.com/api/emoji
 */
export const ApiNinjasEmojiEntity = z.object({
	id: z.string(),
	/** Unicode character code (e.g. U+1F642). */
	code: Text,
	/** The emoji character itself. */
	character: Text,
	/** URL to an image of the emoji. */
	image: Text,
	/** Descriptive name of the emoji. */
	name: Text,
	/** Main category. */
	group: Text,
	/** Sub-category. */
	subgroup: Text,
	captured_at: z.coerce.date(),
});
export type ApiNinjasEmojiEntity = z.infer<typeof ApiNinjasEmojiEntity>;

/**
 * Animals (`GET /v1/animals`).
 *
 * Official: https://api-ninjas.com/api/animals
 * Nested `taxonomy` and `characteristics` are stored as returned.
 */
export const ApiNinjasAnimalEntity = z.object({
	id: z.string(),
	/** Common name of the animal. */
	name: Text,
	/** Taxonomic classification. */
	taxonomy: z
		.object({
			kingdom: Text,
			phylum: Text,
			class: Text,
			order: Text,
			family: Text,
			genus: Text,
			scientific_name: Text,
		})
		.loose()
		.nullable()
		.optional(),
	/** Geographic locations where the animal is found. */
	locations: z.array(z.string()).nullable().optional(),
	/** Detailed characteristics from the official response. */
	characteristics: z.record(z.string(), z.unknown()).nullable().optional(),
	captured_at: z.coerce.date(),
});
export type ApiNinjasAnimalEntity = z.infer<typeof ApiNinjasAnimalEntity>;

/**
 * Planets (`GET /v1/planets`).
 *
 * Official: https://api-ninjas.com/api/planets
 */
export const ApiNinjasPlanetEntity = z.object({
	id: z.string(),
	/** The name of the planet. */
	name: Text,
	/** Mass in Jupiters (1 Jupiter = 1.898 × 10²⁷ kg). */
	mass: Num,
	/** Average radius in Jupiters (1 Jupiter = 69911 km). */
	radius: Num,
	/** Orbital period in Earth days. */
	period: Num,
	/** Semi-major axis in astronomical units (AU). */
	semi_major_axis: Num,
	/** Average surface temperature in Kelvin. */
	temperature: Num,
	/** Distance from Earth in light years. */
	distance_light_year: Num,
	/** Host star mass in solar masses. */
	host_star_mass: Num,
	/** Host star temperature in Kelvin. */
	host_star_temperature: Num,
	captured_at: z.coerce.date(),
});
export type ApiNinjasPlanetEntity = z.infer<typeof ApiNinjasPlanetEntity>;

/**
 * Stars (`GET /v1/stars`).
 *
 * Official: https://api-ninjas.com/api/stars
 */
export const ApiNinjasStarEntity = z.object({
	id: z.string(),
	/** The name of the star. */
	name: Text,
	/** The constellation that the star belongs to. */
	constellation: Text,
	/** Right ascension coordinate. */
	right_ascension: Text,
	/** Declination coordinate. */
	declination: Text,
	/** Apparent magnitude (brightness as seen from Earth). */
	apparent_magnitude: Num,
	/** Absolute magnitude (intrinsic brightness). */
	absolute_magnitude: Num,
	/** Distance from Earth in light years. */
	distance_light_year: Num,
	/** Spectral classification. */
	spectral_class: Text,
	captured_at: z.coerce.date(),
});
export type ApiNinjasStarEntity = z.infer<typeof ApiNinjasStarEntity>;
