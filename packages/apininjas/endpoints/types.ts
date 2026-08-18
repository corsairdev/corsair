import { z } from 'zod';

/**
 * Request and response shapes for the API Ninjas endpoints.
 *
 * Input schemas come from the documented parameter table of each endpoint; a
 * response never says which parameters a call accepts. Output schemas are built
 * from responses captured against a live account on 2026-08-15 and checked
 * against the documented response fields.
 *
 * Two provider behaviours drive the shape of everything below:
 *
 * 1. The free tier answers 200 and replaces individual field values with prose
 *    ("This field is for premium subscribers only."). A field the documentation
 *    describes as a number can therefore arrive as a string, so those fields
 *    accept both. A schema that insisted on the documented type would reject
 *    the whole row, and a rejected row is a lost row.
 * 2. Fields come and go by plan and by record. Every field is optional and
 *    nullable and every object is loose, so an unmodelled field is preserved
 *    rather than stripped.
 *
 * @see https://api-ninjas.com/api
 */

/* -------------------------------------------------------------------------- */
/* location                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get current city coordinates by city and country name.
 *
 * GET v1/geocoding
 */
const LocationGeocodeInputSchema = z.object({
	/** City name. */
	city: z.string(),
	/** US state (for United States cities only). */
	state: z.string().optional(),
	/** Country name, 2-letter ISO country code, or 3-letter ISO country code. */
	country: z.string().optional(),
	/** 5-digit zipcode (for United States cities only). */
	zipcode: z.string().optional(),
});

const LocationGeocodeOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			latitude: z.number().nullable().optional(),
			longitude: z.number().nullable().optional(),
			country: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of cities that contain a given latitude and longitude.
 *
 * GET v1/reversegeocoding
 */
const LocationReverseGeocodeInputSchema = z.object({
	/** Latitude coordinate. */
	lat: z.number(),
	/** Longitude coordinate. */
	lon: z.number(),
});

const LocationReverseGeocodeOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Get city data from either a name or population range. Returns a list of cities that satisfies the parameters.
 *
 * GET v1/city
 */
const LocationCitiesInputSchema = z.object({
	/** Name of city. */
	name: z.string().optional(),
	/** Country filter. Must be an ISO-3166 alpha-2 country code (e.g. US). */
	country: z.string().optional(),
	/** Minimum latitude coordinate. */
	min_lat: z.number().optional(),
	/** Maximum latitude coordinate. */
	max_lat: z.number().optional(),
	/** Minimum longitude coordinate. */
	min_lon: z.number().optional(),
	/** Maximum longitude coordinate. */
	max_lon: z.number().optional(),
	/** Minimum city population. */
	min_population: z.number().optional(),
	/** Maximum city population. */
	max_population: z.number().optional(),
	/** How many results to return. Must be between 1 and 30. Default is 1. To get more than 30 results, use the offset parameter. [premium] */
	limit: z.number().optional(),
	/** Number of results to offset for pagination. [premium] */
	offset: z.number().optional(),
});

const LocationCitiesOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			latitude: z.number().nullable().optional(),
			longitude: z.number().nullable().optional(),
			country: z.string().nullable().optional(),
			population: z.number().nullable().optional(),
			is_capital: z.boolean().nullable().optional(),
		})
		.loose(),
);

/**
 * Get country data from given parameters. Returns a list of country statistics that satisfy the parameters.
 *
 * GET v1/country
 */
const LocationCountryInputSchema = z.object({
	/** Plain English name, 2-letter ISO-3166 alpha-2, or 3-letter ISO-3166 alpha-3 code of country. */
	name: z.string().optional(),
	/** 3-letter currency code of country (e.g. USD). */
	currency: z.string().optional(),
	/** Minimum gross domestic product (GDP) of country, in US Dollars. */
	min_gdp: z.number().optional(),
	/** Maximum gross domestic product (GDP) of country, in US Dollars. */
	max_gdp: z.number().optional(),
	/** Minimum population of country (in thousands). */
	min_population: z.number().optional(),
	/** Maximum population of country (in thousands). */
	max_population: z.number().optional(),
	/** Minimum surface area of country in km2. */
	min_area: z.number().optional(),
	/** Maximum surface area of country in km2. */
	max_area: z.number().optional(),
	/** Minimum unemployment rate in %. */
	min_unemployment: z.number().optional(),
	/** Maximum unemployment rate in %. */
	max_unemployment: z.number().optional(),
	/** Minimum GDP growth rate in %. */
	min_gdp_growth: z.number().optional(),
	/** Maximum GDP growth rate in %. */
	max_gdp_growth: z.number().optional(),
	/** Minimum infant mortality rate per 1,000 live births. */
	min_infant_mortality: z.number().optional(),
	/** Maximum infant mortality rate per 1,000 live births. */
	max_infant_mortality: z.number().optional(),
	/** Minimum fertility rate (average number of children per woman). */
	min_fertility: z.number().optional(),
	/** Maximum fertility rate (average number of children per woman). */
	max_fertility: z.number().optional(),
	/** Minimum urban population rate in %. */
	min_urban_pop_rate: z.number().optional(),
	/** Maximum urban population rate in %. */
	max_urban_pop_rate: z.number().optional(),
	/** How many results to return. Must be between 1 and 30. Default is 5. */
	limit: z.number().optional(),
});

const LocationCountryOutputSchema = z.array(
	z
		.object({
			gdp: z.number().nullable().optional(),
			sex_ratio: z.number().nullable().optional(),
			surface_area: z.number().nullable().optional(),
			life_expectancy_male: z.number().nullable().optional(),
			unemployment: z.number().nullable().optional(),
			imports: z.number().nullable().optional(),
			homicide_rate: z.number().nullable().optional(),
			currency: z
				.object({
					code: z.string().nullable().optional(),
					name: z.string().nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
			iso2: z.string().nullable().optional(),
			employment_services: z.number().nullable().optional(),
			employment_industry: z.number().nullable().optional(),
			urban_population_growth: z.number().nullable().optional(),
			secondary_school_enrollment_female: z.number().nullable().optional(),
			employment_agriculture: z.number().nullable().optional(),
			capital: z.string().nullable().optional(),
			co2_emissions: z.number().nullable().optional(),
			forested_area: z.number().nullable().optional(),
			tourists: z.number().nullable().optional(),
			exports: z.number().nullable().optional(),
			life_expectancy_female: z.number().nullable().optional(),
			post_secondary_enrollment_female: z.number().nullable().optional(),
			post_secondary_enrollment_male: z.number().nullable().optional(),
			primary_school_enrollment_female: z.number().nullable().optional(),
			infant_mortality: z.number().nullable().optional(),
			gdp_growth: z.number().nullable().optional(),
			threatened_species: z.number().nullable().optional(),
			population: z.number().nullable().optional(),
			urban_population: z.number().nullable().optional(),
			secondary_school_enrollment_male: z.number().nullable().optional(),
			name: z.string().nullable().optional(),
			pop_growth: z.number().nullable().optional(),
			region: z.string().nullable().optional(),
			pop_density: z.number().nullable().optional(),
			internet_users: z.number().nullable().optional(),
			gdp_per_capita: z.number().nullable().optional(),
			fertility: z.number().nullable().optional(),
			refugees: z.number().nullable().optional(),
			primary_school_enrollment_male: z.number().nullable().optional(),
			telephone_country_codes: z.array(z.string()).nullable().optional(),
		})
		.loose(),
);

/**
 * Returns details for one or more counties matching the input parameters. For premium users, you can also specify the limit and offset parameters to paginate through results.
 *
 * GET v1/county
 */
const LocationCountyInputSchema = z.object({
	/** Full name of the county to search. */
	county: z.string().optional(),
	/** 5-digit ZIP code to search. */
	zipcode: z.string().optional(),
	/** 2-letter state code (case-insensitive). */
	state: z.string().optional(),
	/** Number of results to return. Must be between 1 and 30. Default is 1. [premium] */
	limit: z.number().optional(),
	/** Number of results to offset for pagination. Default is 0. [premium] */
	offset: z.number().optional(),
});

const LocationCountyOutputSchema = z.array(
	z
		.object({
			county_name: z.string().nullable().optional(),
			county_fips: z.string().nullable().optional(),
			state_code: z.string().nullable().optional(),
			state_name: z.string().nullable().optional(),
			latitude: z.union([z.number(), z.string()]).nullable().optional(),
			longitude: z.union([z.number(), z.string()]).nullable().optional(),
			zip_codes: z
				.union([z.array(z.string()), z.string()])
				.nullable()
				.optional(),
			timezone: z.string().nullable().optional(),
			population: z.number().nullable().optional(),
			median_age: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of ZIP Code details matching the input parameters.
 *
 * GET v1/zipcode
 */
const LocationZipCodeInputSchema = z.object({
	/** The ZIP Code to look up. */
	zip: z.string().optional(),
	/** Full name of the city to search (case-sensitive). [premium] */
	city: z.string().optional(),
	/** 2-letter abbreviation of the state (case-insensitive). [premium] */
	state: z.string().optional(),
});

const LocationZipCodeOutputSchema = z.array(
	z
		.object({
			zip_code: z.string().nullable().optional(),
			valid: z.union([z.boolean(), z.string()]).nullable().optional(),
			city: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
			county: z.string().nullable().optional(),
			timezone: z.string().nullable().optional(),
			area_codes: z
				.union([z.array(z.string()), z.string()])
				.nullable()
				.optional(),
			country: z.string().nullable().optional(),
			lat: z.string().nullable().optional(),
			lon: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of postal code details matching the input parameters.
 *
 * GET v1/postalcode
 */
const LocationPostalCodeInputSchema = z.object({
	/** The postal code to look up. Accepts Canadian postal codes in 6 characters (A1A1A1) or 7 characters with a space (A1A 1A1). The space will be automatically normalized if not provided. */
	postal_code: z.string().optional(),
	/** Full name of the city to search (case-sensitive). [premium] */
	city: z.string().optional(),
	/** 2-letter abbreviation of the province (e.g., ON, BC, QC). [premium] */
	province: z.string().optional(),
});

const LocationPostalCodeOutputSchema = z.array(
	z
		.object({
			city: z.string().nullable().optional(),
			province: z.string().nullable().optional(),
			postal_code: z.string().nullable().optional(),
			area_code: z.string().nullable().optional(),
			timezone: z.string().nullable().optional(),
			lat: z.string().nullable().optional(),
			lon: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns information about universities matching the provided filters. At least one filter parameter is required. Free users can use name or country - all other filters are premium-only.
 *
 * GET v1/university
 */
const LocationUniversitiesInputSchema = z.object({
	/** The name of the university to search for. Can be a partial match (e.g., "Harvard" will match "Harvard University"). At least one filter parameter (excluding offset/limit) must be provided. */
	name: z.string().optional(),
	/** The country to filter by. Must be USA or Canada (case-insensitive). At least one filter parameter (excluding offset/limit) must be provided. */
	country: z.string().optional(),
	/** The city where the university is located. [premium] */
	city: z.string().optional(),
	/** The state or province where the university is located. [premium] */
	state: z.string().optional(),
	/** Minimum student-to-faculty ratio as a number (e.g., 15 for 15:1 ratio). [premium] */
	min_faculty_ratio: z.number().optional(),
	/** Maximum student-to-faculty ratio as a number (e.g., 20 for 20:1 ratio). [premium] */
	max_faculty_ratio: z.number().optional(),
	/** Minimum number of enrolled students. [premium] */
	min_enrolled: z.number().optional(),
	/** Maximum number of enrolled students. [premium] */
	max_enrolled: z.number().optional(),
	/** Minimum annual tuition cost (in USD). [premium] */
	min_tuition: z.number().optional(),
	/** Maximum annual tuition cost (in USD). [premium] */
	max_tuition: z.number().optional(),
	/** The number of results to skip. Must be zero or a positive integer. Default is 0. [premium] */
	offset: z.number().optional(),
	/** The maximum number of results to return. Must be between 1 and 30. Default is 10 for premium users, fixed at 5 for free users. [premium] */
	limit: z.number().optional(),
});

const LocationUniversitiesOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			degree_types: z.array(z.string()).nullable().optional(),
			address: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
			postal_code: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			county: z.string().nullable().optional(),
			timezone: z.string().nullable().optional(),
			latitude: z.string().nullable().optional(),
			longitude: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			website: z.string().nullable().optional(),
			institution_type: z.string().nullable().optional(),
			years: z.string().nullable().optional(),
			enrollment: z.string().nullable().optional(),
			student_faculty_ratio: z.string().nullable().optional(),
			/** The contact email address of the university. Only returned for some records. */
			email: z.string().nullable().optional(),
			/** The annual tuition cost in USD. Only returned for records where tuition data is available; frequently omitted. */
			tuition: z.union([z.number(), z.string()]).nullable().optional(),
		})
		.loose(),
);

/**
 * Get hospital data based on given parameters. Returns a list of hospitals that match the specified criteria.
 *
 * GET v1/hospitals
 */
const LocationHospitalsInputSchema = z.object({
	/** Name of the hospital to search for. Supports partial matching. */
	name: z.string().optional(),
	/** City where the hospital is located. */
	city: z.string().optional(),
	/** State where the hospital is located. */
	state: z.string().optional(),
	/** ZIP code of the hospital location. */
	zipcode: z.string().optional(),
	/** County where the hospital is located. */
	county: z.string().optional(),
	/** Minimum latitude coordinate. */
	min_latitude: z.number().optional(),
	/** Maximum latitude coordinate. */
	max_latitude: z.number().optional(),
	/** Minimum longitude coordinate. */
	min_longitude: z.number().optional(),
	/** Maximum longitude coordinate. */
	max_longitude: z.number().optional(),
	/** Number of results to return. Default is 5. Maximum is 100. [premium] */
	limit: z.number().optional(),
	/** Number of results to skip. Default is 0. [premium] */
	offset: z.number().optional(),
});

const LocationHospitalsOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			care_type: z.string().nullable().optional(),
			address: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
			zipcode: z.string().nullable().optional(),
			county: z.string().nullable().optional(),
			location_area_code: z.string().nullable().optional(),
			fips_code: z.string().nullable().optional(),
			timezone: z.string().nullable().optional(),
			latitude: z.string().nullable().optional(),
			longitude: z.string().nullable().optional(),
			phone_number: z.string().nullable().optional(),
			website: z.string().nullable().optional(),
			ownership: z.string().nullable().optional(),
			bedcount: z.number().nullable().optional(),
			/** Mailing address fields of the hospital. */
			'address, city, state, zipcode': z.string().nullable().optional(),
			/** Geographic coordinates of the hospital. */
			'latitude, longitude': z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * FIND_EV_CHARGING_STATIONS
 *
 * GET v1/evcharger
 */
const LocationEvChargersInputSchema = z.object({
	/** Latitude coordinate (e.g. 37.4277). */
	lat: z.number(),
	/** Longitude coordinate (e.g. -122.1701). */
	lon: z.number(),
	/** Search distance in kilometers. The search area is a box from specified lat - distance to lat + distance and lon - distance to lon + distance. Default is 3 kilometers. Max value is 50 kilometers. */
	distance: z.number().optional(),
	/** Charging level (1, 2, or 3). By default, all levels are returned. */
	level: z.string().optional(),
	/** How many results to return. Must be between 1 and 30. Default is 3. [premium] */
	limit: z.number().optional(),
	/** Number of results to skip. Used for pagination. Default is 0. [premium] */
	offset: z.number().optional(),
});

const LocationEvChargersOutputSchema = z.array(
	z
		.object({
			is_active: z.boolean().nullable().optional(),
			name: z.string().nullable().optional(),
			address: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			region: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			latitude: z.number().nullable().optional(),
			longitude: z.number().nullable().optional(),
			connections: z
				.array(
					z
						.object({
							type_name: z.string().nullable().optional(),
							type_official: z.string().nullable().optional(),
							level: z.number().nullable().optional(),
							num_connectors: z.number().nullable().optional(),
						})
						.loose(),
				)
				.nullable()
				.optional(),
			/** Geographic coordinates of the charging station. */
			'latitude, longitude': z.string().nullable().optional(),
			/** Official specification name (e.g., SAE J1772-2009). */
			type_official: z.string().nullable().optional(),
			/** Charging level (1, 2, or 3). */
			level: z.string().nullable().optional(),
			/** Number of connectors of this type at the station. */
			num_connectors: z.union([z.number(), z.string()]).nullable().optional(),
		})
		.loose(),
);

/**
 * Get current weather, wind speed and direction, humidity, and temperature data by city, ZIP code, or geolocation coordinates (latitude/longitude).
 *
 * GET v1/weather
 */
/**
 * One of the following parameter combinations must be provided:
 *
 * Documented as a parameter combination, so every field is optional here and
 * the provider validates the combination.
 */
const LocationWeatherInputSchema = z.object({
	/** Latitude of desired location. */
	lat: z.number().optional(),
	/** Longitude of desired location. */
	lon: z.number().optional(),
	/** 5 digit Zip code (United States only) [premium] */
	zip: z.string().optional(),
	/** City name. [premium] */
	city: z.string().optional(),
	/** US state (for United States cities only). [premium] */
	state: z.string().optional(),
	/** Country name. [premium] */
	country: z.string().optional(),
});

const LocationWeatherOutputSchema = z
	.object({
		cloud_pct: z.number().nullable().optional(),
		temp: z.number().nullable().optional(),
		feels_like: z.number().nullable().optional(),
		humidity: z.number().nullable().optional(),
		min_temp: z.number().nullable().optional(),
		max_temp: z.number().nullable().optional(),
		wind_speed: z.number().nullable().optional(),
		wind_degrees: z.number().nullable().optional(),
		sunrise: z.number().nullable().optional(),
		sunset: z.number().nullable().optional(),
	})
	.loose();

/**
 * Returns a 5-day weather forecast in 3-hour intervals for a given city.
 *
 * GET v1/weatherforecast
 */
/**
 * One of the following parameter combinations must be provided:
 *
 * Documented as a parameter combination, so every field is optional here and
 * the provider validates the combination.
 */
const LocationWeatherForecastInputSchema = z.object({
	/** Latitude of desired location. */
	lat: z.number().optional(),
	/** Longitude of desired location. */
	lon: z.number().optional(),
	/** 5 digit Zip code (United States only) [premium] */
	zip: z.string().optional(),
	/** City name. [premium] */
	city: z.string().optional(),
	/** US state (for United States cities only). [premium] */
	state: z.string().optional(),
	/** Country name. [premium] */
	country: z.string().optional(),
});

const LocationWeatherForecastOutputSchema = z.array(
	z
		.object({
			timestamp: z.number().nullable().optional(),
			temp: z.number().nullable().optional(),
			feels_like: z.number().nullable().optional(),
			humidity: z.number().nullable().optional(),
			min_temp: z.number().nullable().optional(),
			max_temp: z.number().nullable().optional(),
			weather: z.string().nullable().optional(),
			cloud_pct: z.number().nullable().optional(),
			wind_speed: z.number().nullable().optional(),
			wind_degrees: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * Get air quality by city or location coordinates (latitude/longitude). Returns the air quality index (AQI) and concentrations of major pollutants.
 *
 * GET v1/airquality
 */
const LocationAirQualityInputSchema = z.object({
	/** Latitude of desired location. */
	lat: z.number().optional(),
	/** Longitude of desired location. */
	lon: z.number().optional(),
	/** City name. */
	city: z.string().optional(),
	/** US state (for United States cities only). */
	state: z.string().optional(),
	/** Country name. */
	country: z.string().optional(),
});

const LocationAirQualityOutputSchema = z
	.object({
		CO: z
			.object({
				concentration: z.number().nullable().optional(),
				aqi: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		NO2: z
			.object({
				concentration: z.number().nullable().optional(),
				aqi: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		O3: z
			.object({
				concentration: z.number().nullable().optional(),
				aqi: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		SO2: z
			.object({
				concentration: z.number().nullable().optional(),
				aqi: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		'PM2.5': z
			.object({
				concentration: z.number().nullable().optional(),
				aqi: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		PM10: z
			.object({
				concentration: z.number().nullable().optional(),
				aqi: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		overall_aqi: z.number().nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/* calendar                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get timezone info by city/state/country or location coordinates (latitude/longitude). Returns the timezone name of the specified input location and the time offset in seconds.
 *
 * GET v1/timezone
 */
const CalendarTimezoneInputSchema = z.object({
	/** Timezone name. */
	timezone: z.string().optional(),
	/** Latitude of desired location. [premium] */
	lat: z.number().optional(),
	/** Longitude of desired location. [premium] */
	lon: z.number().optional(),
	/** City name. [premium] */
	city: z.string().optional(),
	/** US state (for United States cities only). [premium] */
	state: z.string().optional(),
	/** Country name. [premium] */
	country: z.string().optional(),
});

const CalendarTimezoneOutputSchema = z
	.object({
		timezone: z.string().nullable().optional(),
		utc_offset: z.number().nullable().optional(),
		local_time: z.string().nullable().optional(),
		/** City name. Only available for lat/lon or city/state/country inputs. */
		city: z.string().nullable().optional(),
	})
	.loose();

/**
 * Get the current date and time by city/state/country, location coordinates (latitude/longitude), or timezone.
 *
 * GET v1/worldtime
 */
const CalendarWorldTimeInputSchema = z.object({
	/** Timezone name (e.g. Europe/London). */
	timezone: z.string().optional(),
	/** Latitude of desired location. [premium] */
	lat: z.number().optional(),
	/** Longitude of desired location. [premium] */
	lon: z.number().optional(),
	/** City name. [premium] */
	city: z.string().optional(),
	/** US state (for United States cities only). [premium] */
	state: z.string().optional(),
	/** Country name. [premium] */
	country: z.string().optional(),
});

/** Declared from the documentation: this endpoint is premium-gated, so no free-tier response could be captured. */
const CalendarWorldTimeOutputSchema = z
	.object({
		/** IANA timezone identifier (for example Europe/London). */
		timezone: z.string().nullable().optional(),
		/** Local date and time string (YYYY-MM-DD HH:MM:SS). */
		datetime: z.string().nullable().optional(),
		/** Current date in YYYY-MM-DD format. */
		date: z.string().nullable().optional(),
		/** Current year as a 4-digit string. */
		year: z.string().nullable().optional(),
		/** Current month as a 2-digit string between 01 and 12 (inclusive). */
		month: z.string().nullable().optional(),
		/** Current day of the month as a 2-digit string between 01 and 31 (inclusive). */
		day: z.string().nullable().optional(),
		/** Current hour in 24-hour format as a 2-digit string between 00 and 23 (inclusive). */
		hour: z.string().nullable().optional(),
		/** Current minute as a 2-digit string between 00 and 59 (inclusive). */
		minute: z.string().nullable().optional(),
		/** Current second as a 2-digit string between 00 and 59 (inclusive). */
		second: z.string().nullable().optional(),
		/** Name of the day of the week (for example Sunday). */
		day_of_week: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns a list of holiday entries for a given country and year. Each entry in the response contains the holiday name, date, day of the week, and the type of holiday.
 *
 * GET v2/holidays
 */
const CalendarHolidaysInputSchema = z.object({
	/** Country name or ISO 3166-2 country code (preferred). */
	country: z.string(),
	/** Calendar year between 2005 and 2039 (inclusive). Default is the current year. Note: not all countries are guaranteed to contain data going back to 2005. */
	year: z.number().optional(),
	/** Holiday type filter. Possible values are: */
	type: z.string().optional(),
});

const CalendarHolidaysOutputSchema = z.array(
	z
		.object({
			country: z.string().nullable().optional(),
			iso: z.string().nullable().optional(),
			year: z.number().nullable().optional(),
			date: z.string().nullable().optional(),
			day: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			type: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of public holidays for a given country and year.
 *
 * GET v1/publicholidays
 */
const CalendarPublicHolidaysInputSchema = z.object({
	/** 2-letter ISO country code or full country name. */
	country: z.string(),
	/** Calendar year between 1980 and 2050 (inclusive). Defaults to current year. [premium] */
	year: z.number().optional(),
});

const CalendarPublicHolidaysOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			local_name: z.string().nullable().optional(),
			date: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			year: z.number().nullable().optional(),
			regions: z.array(z.string()).nullable().optional(),
			federal: z.boolean().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns whether a given date is a public holiday for a given country.
 *
 * GET v1/ispublicholiday
 */
const CalendarIsPublicHolidayInputSchema = z.object({
	/** 2-letter ISO country code. */
	country: z.string(),
	/** Date in YYYY-MM-DD format. Must be between 1980-01-01 and 2050-12-31 (inclusive). */
	date: z.string(),
});

const CalendarIsPublicHolidayOutputSchema = z
	.object({
		date: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		is_public_holiday: z.boolean().nullable().optional(),
		public_holiday_name: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns whether a given date is a working day for a given country.
 *
 * GET v1/isworkingday
 */
const CalendarIsWorkingDayInputSchema = z.object({
	/** 2-letter ISO country code. */
	country: z.string(),
	/** Date in YYYY-MM-DD format. Must be between 1980-01-01 and 2050-12-31 (inclusive). */
	date: z.string(),
	/** Comma-separated list of weekend days (mon,tue,wed,thu,fri,sat,sun). This parameter is optional: if not provided, the default weekend days will be determined based on the country. If specified, your values will override the country defaults. */
	weekend: z.string().optional(),
	/** Whether to include public holidays as non-working days (true/false). Defaults to true. */
	public_holidays: z.boolean().optional(),
});

const CalendarIsWorkingDayOutputSchema = z
	.object({
		date: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		day_of_week: z.string().nullable().optional(),
		is_workday: z.boolean().nullable().optional(),
		public_holiday_name: z.string().nullable().optional(),
		non_working_reason: z.array(z.string()).nullable().optional(),
	})
	.loose();

/**
 * Returns a list of working days and non-working days for a given country and year/month.
 *
 * GET v1/workingdays
 */
const CalendarWorkingDaysInputSchema = z.object({
	/** 2-letter ISO country code. */
	country: z.string(),
	/** Calendar year between 1980 and 2050 (inclusive). By default, the current year is used. [premium] */
	year: z.number().optional(),
	/** Month number (1-12). If provided, returns data for just that month. */
	month: z.number().optional(),
	/** Comma-separated list of weekend days (mon, tue, wed, thu, fri, sat, sun). This parameter is optional: if not provided, the default weekend days will be determined based on the country. If specified, your values will override the country defaults. */
	weekend: z.string().optional(),
	/** Whether to include public holidays as non-working days (true/false). Defaults to true. */
	public_holidays: z.boolean().optional(),
});

const CalendarWorkingDaysOutputSchema = z
	.object({
		num_working_days: z.number().nullable().optional(),
		num_non_working_days: z.number().nullable().optional(),
		working_days: z.array(z.string()).nullable().optional(),
		non_working_days: z
			.array(
				z
					.object({
						date: z.string().nullable().optional(),
						reasons: z.array(z.string()).nullable().optional(),
						holiday_name: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		year: z.number().nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/* internet                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Returns availability, registration lifecycle, and email/hosting intelligence for a given domain name.
 *
 * GET v1/domain
 */
const InternetDomainInputSchema = z.object({
	/** Valid domain to check (e.g. github.com). For top-level domains other than .com, a premium subscription is required. */
	domain: z.string(),
});

const InternetDomainOutputSchema = z
	.object({
		domain: z.string().nullable().optional(),
		available: z.boolean().nullable().optional(),
		creation_date: z.number().nullable().optional(),
		expiration_date: z.number().nullable().optional(),
		registrar: z.string().nullable().optional(),
		age_days: z.number().nullable().optional(),
		/** Unix timestamp of when the domain record was last updated. */
		updated_date: z.union([z.number(), z.string()]).nullable().optional(),
		/** Array of EPP status codes translated to snake_case strings (e.g. client_transfer_prohibited, pending_delete, redemption_period). Indicates registrar/registry locks and the domain's lifecycle state. */
		domain_status: z
			.union([z.array(z.string()), z.string()])
			.nullable()
			.optional(),
		/** Whether the domain has any MX (mail exchange) records, i.e. whether it is configured to receive email. */
		has_mx: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** Whether the domain is a known free or webmail provider (e.g. gmail.com, outlook.com). */
		is_free_email_provider: z
			.union([z.boolean(), z.string()])
			.nullable()
			.optional(),
		/** Whether the domain's top-level domain is one disproportionately associated with spam or abuse. */
		risky_tld: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** Whether the domain is a known disposable / temporary email provider. See our Disposable Email Checker API. */
		is_disposable_email_domain: z
			.union([z.boolean(), z.string()])
			.nullable()
			.optional(),
		/** Whether the domain looks like a custom/business email domain: it accepts mail and is not a free, webmail, or disposable provider. */
		is_custom_domain: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** The email provider serving the domain, inferred from its MX records (e.g. Google Workspace, Microsoft 365), or null if not recognized. */
		mx_provider: z.string().nullable().optional(),
		/** Whether the domain appears to be parked or listed for sale, inferred from its nameservers. */
		is_parked: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** The IPv4 address the domain currently resolves to. */
		ip: z.string().nullable().optional(),
		/** The network / hosting provider (autonomous system) the resolved IP belongs to. */
		hosting_provider: z.string().nullable().optional(),
		/** Two-letter country code where the resolved IP is registered. */
		country: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns a list of DNS records associated with a particular domain.
 *
 * GET v1/dnslookup
 */
const InternetDnsRecordsInputSchema = z.object({
	/** Valid domain to check (e.g. example.com). For top-level domains other than .com, a premium subscription is required. */
	domain: z.string(),
});

const InternetDnsRecordsOutputSchema = z.array(
	z
		.object({
			record_type: z.string().nullable().optional(),
			value: z.string().nullable().optional(),
			mname: z.string().nullable().optional(),
			rname: z.string().nullable().optional(),
			serial: z.number().nullable().optional(),
			refresh: z.number().nullable().optional(),
			retry: z.number().nullable().optional(),
			expire: z.number().nullable().optional(),
			ttl: z.number().nullable().optional(),
			/**  */
			AAAA: z.string().nullable().optional(),
			/**  */
			CNAME: z.string().nullable().optional(),
			/**  */
			MX: z.string().nullable().optional(),
			/**  */
			NS: z.string().nullable().optional(),
			/**  */
			PTR: z.string().nullable().optional(),
			/**  */
			SRV: z.string().nullable().optional(),
			/**  */
			SOA: z.string().nullable().optional(),
			/**  */
			TXT: z.string().nullable().optional(),
			/**  */
			CAA: z.string().nullable().optional(),
			/** Priority value (for MX records). */
			priority: z.string().nullable().optional(),
			/** Additional fields for SOA records only. */
			'mname, rname, serial, refresh, retry, expire, ttl': z
				.string()
				.nullable()
				.optional(),
		})
		.loose(),
);

/**
 * Returns a list of MX records associated with a particular domain. Free users receive only data from the first MX record, while premium users get access to all MX records.
 *
 * GET v1/mxlookup
 */
const InternetMxRecordsInputSchema = z.object({
	/** Valid domain to check (e.g. x.com). All top-level domains are supported. */
	domain: z.string(),
});

const InternetMxRecordsOutputSchema = z.array(
	z
		.object({
			priority: z.number().nullable().optional(),
			value: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns domain registration details (e.g. registrar, contact information, expiration date, name servers) for a given domain name.
 *
 * GET v1/whois
 */
const InternetWhoisInputSchema = z.object({
	/** Valid domain to check (e.g. example.com). For top-level domains other than .com, a premium subscription is required. */
	domain: z.string(),
});

/** Declared from the documentation: this endpoint is premium-gated, so no free-tier response could be captured. */
const InternetWhoisOutputSchema = z
	.object({
		/** The domain name that was queried. */
		domain_name: z.string().nullable().optional(),
		/** Name of the domain registrar. */
		registrar: z.string().nullable().optional(),
		/** URL of the domain registrar. Not returned for all TLDs. */
		registrar_url: z.string().nullable().optional(),
		/** WHOIS server used for the query. Not returned for all TLDs. */
		whois_server: z.string().nullable().optional(),
		/** Unix timestamp of when the domain was last updated. */
		updated_date: z.union([z.number(), z.string()]).nullable().optional(),
		/** Unix timestamp of when the domain was created. */
		creation_date: z.union([z.number(), z.string()]).nullable().optional(),
		/** Unix timestamp of when the domain expires. */
		expiration_date: z.union([z.number(), z.string()]).nullable().optional(),
		/** Array of name server hostnames. */
		name_servers: z
			.union([z.array(z.string()), z.string()])
			.nullable()
			.optional(),
		/** DNSSEC status (e.g., signeddelegation). */
		dnssec: z.string().nullable().optional(),
		/** Contact email(s) from the WHOIS record. Returned only for some TLDs (e.g. .org); not present for .com. */
		emails: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns the location of the IP address specified. The response contains both the geographical coordinates (latitude/longitude) as well as the city and country.
 *
 * GET v1/iplookup
 */
const InternetIpLookupInputSchema = z.object({
	/** IP Address to query. Must be in IPv4 format A.B.C.D(e.g. 73.9.149.180) or IPv6 format X:X:X:X:X:X:X:X(e.g. 2001:0db8:85a3:0000:0000:8a2e:0370:7334). */
	address: z.string(),
});

const InternetIpLookupOutputSchema = z
	.object({
		is_valid: z.boolean().nullable().optional(),
		country: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		region_code: z.string().nullable().optional(),
		region: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		lat: z.number().nullable().optional(),
		lon: z.number().nullable().optional(),
		timezone: z.string().nullable().optional(),
		isp: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		/** Whether the IP belongs to a known cloud or datacenter provider (e.g. AWS, GCP, Azure, Oracle, DigitalOcean). */
		is_datacenter: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** Whether the IP's network (ASN) is a known hosting/datacenter provider. */
		is_hosting: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** Whether the IP is a known Tor exit node. */
		is_tor: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** Whether the IP is associated with a known commercial VPN provider. */
		is_vpn: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** Whether the IP is an Apple iCloud Private Relay egress node. */
		is_icloud_relay: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** Whether the IP is a bogon (unallocated or reserved address that should not appear on the public internet). */
		is_bogon: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** Whether the IP appears on multiple public abuse/threat blocklists. */
		is_abuser: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** Overall risk level derived from blocklist activity: one of low, medium, or high. */
		threat_level: z.string().nullable().optional(),
		/** The Autonomous System Number that announces the IP (e.g. AS15169). */
		asn: z.string().nullable().optional(),
		/** The name of the organization that operates the ASN. */
		asn_name: z.string().nullable().optional(),
		/** The network route (CIDR prefix) the IP belongs to. */
		route: z.string().nullable().optional(),
		/** The registered abuse-contact email for the IP's network, when available. */
		abuse_email: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns the location of the IP address hosting the URL domain. The response contains both the geographical coordinates (latitude/longitude) as well as the city and country.
 *
 * GET v1/urllookup
 */
const InternetUrlLookupInputSchema = z.object({
	/** Valid URL to check. It supports schemes (e.g. http://example.com) as well as schemeless (e.g. example.com) formats. For top-level domains other than .com, a premium subscription is required. */
	url: z.string(),
});

const InternetUrlLookupOutputSchema = z
	.object({
		is_valid: z.boolean().nullable().optional(),
		country: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		region_code: z.string().nullable().optional(),
		region: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		lat: z.number().nullable().optional(),
		lon: z.number().nullable().optional(),
		timezone: z.string().nullable().optional(),
		isp: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns the URL information and web page metadata from a given URL.
 *
 * GET v1/webpage
 */
const InternetWebpageInputSchema = z.object({
	/** URL to retrieve information from. */
	url: z.string(),
});

const InternetWebpageOutputSchema = z
	.object({
		url: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
		url_path: z.string().nullable().optional(),
		url_parameters: z.record(z.string(), z.unknown()).nullable().optional(),
		page_title: z.string().nullable().optional(),
		page_description: z.string().nullable().optional(),
		meta_tags: z
			.object({
				viewport: z.string().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		favicon: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns the HTML or plaintext data scraped from a given URL. Maximum size of data returned is 2MB.
 *
 * GET v1/webscraper
 */
const InternetScrapeInputSchema = z.object({
	/** URL to scrape. */
	url: z.string(),
	/** Whether to only extract visible text (ignores HTML tags and metadata). Must be either true or false. Default is false. */
	text_only: z.boolean().optional(),
	/** User-Agent string to use in the request header. */
	user_agent: z.string().optional(),
});

const InternetScrapeOutputSchema = z
	.object({
		data: z.string().nullable().optional(),
	})
	.loose();

/**
 * Generates a realistic user agent string based on optional parameters.
 *
 * GET v1/useragentgenerate
 */
const InternetUserAgentInputSchema = z.object({
	/** Device brand (e.g. Apple, Samsung) */
	brand: z.string().optional(),
	/** Device model (e.g. iPhone, Galaxy) */
	model: z.string().optional(),
	/** Operating system (e.g. Windows, iOS, Android) */
	os: z.string().optional(),
	/** Browser name (e.g. Chrome, Firefox, Safari) */
	browser: z.string().optional(),
});

const InternetUserAgentOutputSchema = z
	.object({
		user_agent: z.string().nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/* validation                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Returns metadata (including whether it is valid) for a given email address. This API will check the formatting of the email and the existence of DNS records for the domain to make sure it is a valid email address.
 *
 * GET v1/validateemail
 */
const ValidationEmailInputSchema = z.object({
	/** Email address to validate. */
	email: z.string(),
});

const ValidationEmailOutputSchema = z
	.object({
		is_valid: z.boolean().nullable().optional(),
		email: z.string().nullable().optional(),
		is_disposable: z.boolean().nullable().optional(),
		is_public: z.boolean().nullable().optional(),
		main_category: z.string().nullable().optional(),
		sub_category: z.string().nullable().optional(),
		/** Domain of the email address. */
		domain: z.string().nullable().optional(),
		/** The local part of the email address (the portion before the @). */
		local_part: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns metadata for a given email address, including whether it is from a disposable email provider. We maintain a large database of hundreds of thousands of disposable domains and check against it for every email address.
 *
 * GET v1/disposableemailchecker
 */
const ValidationDisposableEmailInputSchema = z.object({
	/** Email address to check. */
	email: z.string(),
});

const ValidationDisposableEmailOutputSchema = z
	.object({
		email: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
		is_disposable: z.boolean().nullable().optional(),
	})
	.loose();

/**
 * Returns metadata (including whether it is valid) for a given phone number.
 *
 * GET v1/validatephone
 */
const ValidationPhoneInputSchema = z.object({
	/** Phone number to check. The leading + is optional. If country is not set, include the country code (e.g. 12065550100 or +12065550100). */
	number: z.string(),
	/** 2-letter ISO-3166 country code the phone number belongs to. */
	country: z.string().optional(),
});

const ValidationPhoneOutputSchema = z
	.object({
		is_valid: z.boolean().nullable().optional(),
		is_formatted_properly: z.boolean().nullable().optional(),
		country: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		timezones: z.array(z.string()).nullable().optional(),
		format_national: z.string().nullable().optional(),
		format_international: z.string().nullable().optional(),
		format_e164: z.string().nullable().optional(),
		country_code: z.number().nullable().optional(),
		/** Line type of the number, such as mobile, landline, voip, or toll_free. For carrier and VOIP details, see the Phone Lookup API. */
		line_type: z.string().nullable().optional(),
		/** Whether the number is a mobile number. */
		is_mobile: z.union([z.boolean(), z.string()]).nullable().optional(),
		/** The phone number as an RFC3966 tel: URI. */
		format_rfc3966: z.string().nullable().optional(),
		/** Whether the number is a possible number (valid length and pattern), even if not confirmed valid. */
		is_possible: z.union([z.boolean(), z.string()]).nullable().optional(),
	})
	.loose();

/**
 * Returns detailed information about a bank based on its routing number.
 *
 * GET v1/routingnumber
 */
const ValidationRoutingNumberInputSchema = z.object({
	/** The 9-digit routing number of the bank to look up. */
	routing_number: z.number(),
});

const ValidationRoutingNumberOutputSchema = z.array(
	z
		.object({
			bank_name: z.string().nullable().optional(),
			routing_number: z.string().nullable().optional(),
			street_address: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
			zip_code: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			county: z.string().nullable().optional(),
			timezone: z.string().nullable().optional(),
			latitude: z.string().nullable().optional(),
			longitude: z.string().nullable().optional(),
			phone_number: z.union([z.number(), z.string()]).nullable().optional(),
			ach_supported: z.boolean().nullable().optional(),
			fedwire_supported: z.boolean().nullable().optional(),
			checksum_valid: z.boolean().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns detailed information on a given IBAN.
 *
 * GET v1/iban
 */
const ValidationIbanInputSchema = z.object({
	/** The IBAN to look up. */
	iban: z.string(),
});

const ValidationIbanOutputSchema = z
	.object({
		iban: z.string().nullable().optional(),
		bank_name: z.string().nullable().optional(),
		bank_address: z.string().nullable().optional(),
		account_number: z.string().nullable().optional(),
		bank_code: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		checksum: z.string().nullable().optional(),
		valid: z.union([z.boolean(), z.string()]).nullable().optional(),
		invalid_reason: z.string().nullable().optional(),
		bban: z.string().nullable().optional(),
		swift_code: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns detailed information about a bank based on the BIN number provided.
 *
 * GET v2/bin
 */
const ValidationBinInputSchema = z.object({
	/** The Bank Identification Number (BIN) to look up. This is typically the first 6 or 8 digits of a credit card number. */
	bin: z.string(),
});

const ValidationBinOutputSchema = z.array(
	z
		.object({
			bin: z.string().nullable().optional(),
			country_iso2: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			brand: z.string().nullable().optional(),
			type: z.string().nullable().optional(),
			categories: z
				.union([z.array(z.string()), z.string()])
				.nullable()
				.optional(),
			issuer: z.string().nullable().optional(),
			is_valid: z.union([z.boolean(), z.string()]).nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of bank information (including SWIFT/BIC Code) that match the input parameter. Returns at most 100 results. For more results, use the offset parameter.
 *
 * GET v1/swiftcode
 */
const ValidationSwiftCodeInputSchema = z.object({
	/** The SWIFT Code of the bank to look up. */
	swift: z.string().optional(),
	/** The name of the bank to look up. This parameter supports partial matching (e.g., Silicon Valley will match Silicon Valley Bank). [premium] */
	bank: z.string().optional(),
	/** Name of the city in which the bank is located. */
	city: z.string().optional(),
	/** ISO 3166 2-letter country code of the bank's country. */
	country: z.string().optional(),
	/** 9-digit US ABA routing number (e.g. 121000248). Returns the SWIFT/BIC codes of the US bank identified by the routing number - useful for finding the SWIFT code needed to receive an international wire into a US account. See our Routing Number API for the reverse lookup. */
	routing_number: z.string().optional(),
	/** The number of results to offset for pagination. Default is 0. [premium] */
	offset: z.number().optional(),
});

const ValidationSwiftCodeOutputSchema = z.array(
	z
		.object({
			swift_code: z.string().nullable().optional(),
			bank_name: z.string().nullable().optional(),
			address: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			region: z.string().nullable().optional(),
			postal_code: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			country_code: z.string().nullable().optional(),
		})
		.loose(),
);

/* -------------------------------------------------------------------------- */
/* markets                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Returns price information for any given ticker symbol. Premium members have access to live prices, while free users only have access to 15-minute delayed data.
 *
 * GET v1/stockprice
 */
const MarketsStockPriceInputSchema = z.object({
	/** Stock or index ticker symbol (e.g., AAPL or ^DJI). */
	ticker: z.string(),
});

const MarketsStockPriceOutputSchema = z
	.object({
		ticker: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		price: z.number().nullable().optional(),
		exchange: z.string().nullable().optional(),
		updated: z.number().nullable().optional(),
		currency: z.string().nullable().optional(),
		volume: z.number().nullable().optional(),
	})
	.loose();

/**
 * Returns comprehensive company profile information including company name, CEO, address, financial data, exchange information, identifiers (CIK, CUSIP, ISIN), and latest earnings information when available. Premium members have access to live prices, while free users only have access to 15-minute delayed data.
 *
 * GET v1/ticker
 */
const MarketsTickerInputSchema = z.object({
	/** Stock ticker symbol (e.g., AAPL). */
	ticker: z.string(),
});

const MarketsTickerOutputSchema = z
	.object({
		name: z.string().nullable().optional(),
		ticker: z.string().nullable().optional(),
		chief_executive_officer: z.string().nullable().optional(),
		address: z
			.object({
				address: z.string().nullable().optional(),
				city: z.string().nullable().optional(),
				state: z.string().nullable().optional(),
				zip: z.string().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		latest_price: z.union([z.number(), z.string()]).nullable().optional(),
		latest_market_cap: z.union([z.number(), z.string()]).nullable().optional(),
		latest_dividend: z.string().nullable().optional(),
		cik: z.string().nullable().optional(),
		cusip: z.string().nullable().optional(),
		isin: z.string().nullable().optional(),
		exchange: z.string().nullable().optional(),
		website: z.string().nullable().optional(),
		phone_number: z.string().nullable().optional(),
		ipo_date: z.string().nullable().optional(),
		latest_earnings: z
			.object({
				year: z.number().nullable().optional(),
				quarter: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		sector: z.string().nullable().optional(),
		industry: z.string().nullable().optional(),
		sic_code: z.string().nullable().optional(),
		sic_description: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns a list of all available companies and their ticker symbols. Supports pagination to retrieve results in batches.
 *
 * GET v1/stockpricelist
 */
const MarketsTickerListInputSchema = z.object({
	/** Number of results to offset for pagination. Default is 0. */
	offset: z.number().optional(),
	/** Number of results to return. Must be between 1 and 1000. Default is 100. */
	limit: z.number().optional(),
});

/** Declared from the documentation: this endpoint is premium-gated, so no free-tier response could be captured. */
const MarketsTickerListOutputSchema = z.array(
	z
		.object({
			/** The stock ticker symbol. */
			ticker: z.string().nullable().optional(),
			/** The full company name. */
			name: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns detailed information about stock exchanges matching the specified criteria. At least one parameter is required.
 *
 * GET v1/stockexchange
 */
const MarketsStockExchangesInputSchema = z.object({
	/** Market Identifier Code (e.g., XNYS). */
	mic: z.string().optional(),
	/** Stock exchange name (supports partial matching). */
	name: z.string().optional(),
	/** City where the exchange is located. */
	city: z.string().optional(),
	/** 2-letter country code (ISO-3166-1 alpha-2) (e.g., US). */
	country: z.string().optional(),
});

const MarketsStockExchangesOutputSchema = z.array(
	z
		.object({
			mic: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			iso2: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			address: z.string().nullable().optional(),
			website: z.string().nullable().optional(),
			founded: z.string().nullable().optional(),
			num_listings: z.number().nullable().optional(),
			market_cap_usd: z.number().nullable().optional(),
			/** Market cap in local currency when market_cap_usd is absent. */
			market_cap: z.union([z.number(), z.string()]).nullable().optional(),
			currency: z.string().nullable().optional(),
			timezone: z.string().nullable().optional(),
			/** Opening time. Business/Professional tier. */
			market_open: z.string().nullable().optional(),
			/** Closing time. Business/Professional tier. */
			market_close: z.string().nullable().optional(),
			/** Whether the exchange is currently open. Business/Professional tier. */
			is_market_open: z.union([z.boolean(), z.string()]).nullable().optional(),
			/** Reason the exchange is closed, or null if open. */
			closed_reason: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns S&P 500 index constituents, filterable by ticker, company name, sector or the date the company joined the index.
 *
 * GET v1/sp500
 */
const MarketsSp500InputSchema = z.object({
	/** Stock ticker symbol of a constituent. */
	ticker: z.string().optional(),
	/** Company name of a constituent. */
	name: z.string().optional(),
	/** GICS sector, for example Health Care. */
	sector: z.string().optional(),
	/** Date the company was added to the index, as YYYY-MM-DD. */
	date_added: z.string().optional(),
});

const MarketsSp500OutputSchema = z.array(
	z
		.object({
			ticker: z.string().nullable().optional(),
			company_name: z.string().nullable().optional(),
			sector: z.string().nullable().optional(),
			date_added: z.string().nullable().optional(),
			cik: z.string().nullable().optional(),
			sub_industry: z.string().nullable().optional(),
			headquarters: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns the current market cap data for any given company ticker. Premium members have access to live prices, while free users only have access to 15-minute delayed data.
 *
 * GET v1/marketcap
 */
const MarketsMarketCapInputSchema = z.object({
	/** Stock ticker symbol (e.g., NVDA). */
	ticker: z.string(),
});

const MarketsMarketCapOutputSchema = z
	.object({
		ticker: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		market_cap: z.number().nullable().optional(),
		currency: z.string().nullable().optional(),
		updated: z.number().nullable().optional(),
	})
	.loose();

/**
 * Returns a JSON array of detailed earnings reports, each with comprehensive financial statements and key performance metrics. Query a single company by ticker or cik, or query every company that filed within a date range using date or date_start/date_end. Results are paginated 50 per page via offset.
 *
 * GET v2/earnings
 */
const MarketsEarningsInputSchema = z.object({
	/** Company ticker symbol (e.g., ADBE). Identifies the company to query - use this or cik, or omit both and query by date. */
	ticker: z.string().optional(),
	/** Company Central Index Key (e.g., 796343). Alternative to ticker for identifying a company. */
	cik: z.string().optional(),
	/** Fiscal period. Must be one of: q1, q2, q3, q4, or fy (full year). Requires a ticker/cik and year. */
	period: z.string().optional(),
	/** Fiscal year. E.g. 2026. Historical coverage goes back to 2010. For data before 2026, you must have a premium subscription. Combine with a ticker to return every period that year, or add period/quarter for a single filing. */
	year: z.number().optional(),
	/** Fiscal quarter 1-4 (an alternative to period). Requires a ticker/cik and year. */
	quarter: z.number().optional(),
	/** Return every filing whose SEC filing date equals this date (YYYY-MM-DD). Works without a ticker - returns all companies that filed that day. */
	date: z.string().optional(),
	/** Start of a filing-date range (YYYY-MM-DD): all companies that filed on or after this date. Cannot be combined with date. */
	date_start: z.string().optional(),
	/** End of a filing-date range (YYYY-MM-DD). Combine with date_start and page through results with offset. */
	date_end: z.string().optional(),
	/** Number of results to skip for pagination. Results are returned 50 per page. Default is 0. */
	offset: z.number().optional(),
});

const MarketsEarningsOutputSchema = z.array(
	z
		.object({
			company_info: z
				.object({
					ticker: z.string().nullable().optional(),
					cik: z.string().nullable().optional(),
					company_name: z.string().nullable().optional(),
					fiscal_year: z.number().nullable().optional(),
					fiscal_quarter: z.number().nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
			income_statement: z
				.object({
					weighted_average_shares_basic: z.number().nullable().optional(),
					weighted_average_shares_diluted: z.number().nullable().optional(),
					earnings_per_share_basic: z.number().nullable().optional(),
					earnings_per_share_diluted: z.number().nullable().optional(),
					total_revenue: z.number().nullable().optional(),
					cost_of_revenue: z.number().nullable().optional(),
					gross_profit: z.number().nullable().optional(),
					research_and_development: z.number().nullable().optional(),
					general_and_administrative: z.number().nullable().optional(),
					sales_and_marketing: z.number().nullable().optional(),
					operating_income: z.number().nullable().optional(),
					interest_expense: z.string().nullable().optional(),
					tax_provision: z.number().nullable().optional(),
					net_income: z.number().nullable().optional(),
					net_income_available_to_common: z.string().nullable().optional(),
					depreciation_and_amortization: z.number().nullable().optional(),
					stock_based_compensation: z.number().nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
			balance_sheet: z
				.object({
					cash_and_equivalents: z.number().nullable().optional(),
					accounts_receivable: z.number().nullable().optional(),
					inventory: z.number().nullable().optional(),
					current_assets: z.number().nullable().optional(),
					property_plant_equipment: z.number().nullable().optional(),
					goodwill: z.string().nullable().optional(),
					intangible_assets: z.number().nullable().optional(),
					total_assets: z.number().nullable().optional(),
					accounts_payable: z.number().nullable().optional(),
					current_liabilities: z.number().nullable().optional(),
					long_term_debt: z.number().nullable().optional(),
					total_debt: z.number().nullable().optional(),
					total_liabilities: z.number().nullable().optional(),
					stockholders_equity: z.number().nullable().optional(),
					retained_earnings: z.number().nullable().optional(),
					working_capital: z.number().nullable().optional(),
					temporary_equity: z.string().nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
			cash_flow: z
				.object({
					operating_cash_flow: z.number().nullable().optional(),
					capital_expenditures: z.number().nullable().optional(),
					free_cash_flow: z.number().nullable().optional(),
					dividends_paid: z.number().nullable().optional(),
					share_repurchases: z.number().nullable().optional(),
					net_cash_investing: z.number().nullable().optional(),
					net_cash_financing: z.number().nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
			filing_info: z
				.object({
					filing_type: z.string().nullable().optional(),
					filing_date: z.string().nullable().optional(),
					period_end_date: z.string().nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
		})
		.loose(),
);

/**
 * Returns a list of past earnings results and upcoming earnings dates. You can query by ticker symbol to get earnings for a specific company, by a single date, or by a date range. Up to 50 earnings results are returned per request.
 *
 * GET v1/earningscalendar
 */
const MarketsEarningsCalendarInputSchema = z.object({
	/** Company ticker symbol (e.g., MSFT). If provided, returns earnings data for that specific company. */
	ticker: z.string().optional(),
	/** Date in YYYY-MM-DD format (e.g., 2024-01-15). If provided, returns all earnings data for that specific date. */
	date: z.string().optional(),
	/** Start date of a range in YYYY-MM-DD format (e.g., 2024-01-15). Inclusive. If only date_start is provided, date_end defaults to 7 days later. Cannot be combined with date. */
	date_start: z.string().optional(),
	/** End date of a range in YYYY-MM-DD format (e.g., 2024-01-22). Inclusive. Must be on or after date_start. If only date_end is provided, date_start defaults to 7 days earlier. Cannot be combined with date. */
	date_end: z.string().optional(),
	/** Whether to show upcoming earnings dates. Must be either true or false. If unset, the default value is false. [premium] */
	show_upcoming: z.boolean().optional(),
	/** Number of results to skip for pagination. Must be a non-negative integer. Each request returns up to 50 results; use offset to page through larger result sets (e.g. offset=50 for the next 50 results). */
	offset: z.number().optional(),
});

const MarketsEarningsCalendarOutputSchema = z.array(
	z
		.object({
			date: z.string().nullable().optional(),
			ticker: z.string().nullable().optional(),
			earnings_timing: z.string().nullable().optional(),
			earnings_call_timestamp: z
				.union([z.number(), z.string()])
				.nullable()
				.optional(),
			actual_revenue: z.number().nullable().optional(),
			estimated_revenue: z
				.union([z.number(), z.string()])
				.nullable()
				.optional(),
			revenue_difference: z
				.union([z.number(), z.string()])
				.nullable()
				.optional(),
			revenue_difference_pct: z
				.union([z.number(), z.string()])
				.nullable()
				.optional(),
			actual_eps: z.number().nullable().optional(),
			estimated_eps: z.union([z.number(), z.string()]).nullable().optional(),
			eps_difference: z.union([z.number(), z.string()]).nullable().optional(),
			eps_difference_pct: z
				.union([z.number(), z.string()])
				.nullable()
				.optional(),
			report_date_status: z.string().nullable().optional(),
			date_confirmed: z.string().nullable().optional(),
			report_datetime: z.string().nullable().optional(),
			sec_8k_url: z.string().nullable().optional(),
			eps_beat_miss: z.string().nullable().optional(),
			revenue_beat_miss: z.string().nullable().optional(),
			eps_surprise_streak: z.string().nullable().optional(),
			avg_eps_surprise_pct_4q: z.string().nullable().optional(),
			eps_sue: z.string().nullable().optional(),
			last_earnings_move_pct: z.string().nullable().optional(),
			avg_earnings_move_pct: z.string().nullable().optional(),
			days_to_next_earnings: z.string().nullable().optional(),
			next_earnings_date: z.string().nullable().optional(),
			has_transcript: z.string().nullable().optional(),
			surprise_history: z.string().nullable().optional(),
			fiscal_year: z.number().nullable().optional(),
			fiscal_quarter: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns the earnings transcript for a given company earning quarter.
 *
 * GET v1/earningstranscript
 */
const MarketsEarningsTranscriptInputSchema = z.object({
	/** Company ticker symbol (e.g., AAPL). */
	ticker: z.string().optional(),
	/** Company Central Index Key (e.g., 320193). */
	cik: z.string().optional(),
	/** Earnings year (e.g., 2026). Must be a valid year between 2000 and the current year. If provided, quarter must also be provided. */
	year: z.number().optional(),
	/** Earnings quarter from Q1 to Q4. Must be one of the following values: 1, 2, 3, 4. If provided, year must also be provided. */
	quarter: z.number().optional(),
	/** If set to true, restricts transcript_split (and the rebuilt transcript string) to analyst Q&A turns only, omitting prepared remarks. */
	qa_only: z.boolean().optional(),
});

/** Declared from the documentation: this endpoint is premium-gated, so no free-tier response could be captured. */
const MarketsEarningsTranscriptOutputSchema = z
	.object({
		/** The date of the earnings call. */
		date: z.string().nullable().optional(),
		/** The UNIX timestamp (in seconds) of the earnings call to the nearest minute. */
		timestamp: z.union([z.number(), z.string()]).nullable().optional(),
		/** The ticker symbol of the company. */
		ticker: z.string().nullable().optional(),
		/** The CIK of the company. */
		cik: z.string().nullable().optional(),
		/** The year of the earnings call. */
		year: z.union([z.number(), z.string()]).nullable().optional(),
		/** The quarter of the earnings call. */
		quarter: z.string().nullable().optional(),
		/** Timing of the earnings call. Possible values are: */
		earnings_timing: z.string().nullable().optional(),
		/** The transcript of the earnings call as a single string. */
		transcript: z.string().nullable().optional(),
		/** The list of participants of the earnings call. Each participant is an object with name, role, and company properties. */
		participants: z
			.union([z.array(z.string()), z.string()])
			.nullable()
			.optional(),
		/** A concise summary of the earnings call, covering the main points discussed including financial performance, key metrics, and strategic initiatives. */
		summary: z.string().nullable().optional(),
		/** Any forward-looking guidance issued by the company during the call, including revenue projections, earnings estimates, margin expectations, or other forecasts. Empty string if no guidance was provided. */
		guidance: z.string().nullable().optional(),
		/** Any risk factors, challenges, headwinds, or concerns mentioned during the call that could negatively impact the company's future performance. Empty string if no risk factors were mentioned. */
		risk_factors: z.string().nullable().optional(),
		/** The overall sentiment of the entire transcript on a scale from -1 (very negative) to 1 (very positive), where 0 is neutral. */
		overall_sentiment: z.string().nullable().optional(),
		/** A brief explanation of the overall sentiment score, including key positive signals, key negative signals, and the reasoning behind the score. */
		overall_sentiment_rationale: z.string().nullable().optional(),
		/** The transcript of the earnings call split into sections by speaker. Each section includes: */
		transcript_split: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns a list of insider trading transactions that match the specified filters. All parameters are optional and can be combined for advanced filtering.
 *
 * GET v1/insidertransactions
 */
const MarketsInsiderTransactionsInputSchema = z.object({
	/** Company ticker symbol (e.g., AAPL, MSFT). */
	ticker: z.string().optional(),
	/** Central Index Key (CIK) of the company (e.g., 789019). */
	cik: z.string().optional(),
	/** Name of the insider (exact match). Use the /v1/insiderslist endpoint to look up insider names. */
	name: z.string().optional(),
	/** SEC form type: 3, 4, or 5. */
	form_type: z.string().optional(),
	/** Type of transaction (e.g., Purchase, Sale, Award). */
	transaction_type: z.string().optional(),
	/** Transaction code (e.g., P for Purchase, S for Sale, A for Award). */
	transaction_code: z.string().optional(),
	/** Transaction date in YYYY-MM-DD format (e.g., 2024-01-15). */
	transaction_date: z.string().optional(),
	/** Minimum transaction date in YYYY-MM-DD format. */
	min_transaction_date: z.number().optional(),
	/** Maximum transaction date in YYYY-MM-DD format. */
	max_transaction_date: z.number().optional(),
	/** Type of insider: director (matches director or chairman), 10_percent_owner (matches 10% Owner), or officer (excludes director, 10% owner, and chairman). */
	insider_type: z.string().optional(),
	/** Minimum transaction value in USD (e.g., 10000). */
	min_transaction_value: z.number().optional(),
	/** Maximum transaction value in USD (e.g., 1000000). */
	max_transaction_value: z.number().optional(),
	/** Maximum number of results to return. Max value is 100. Default value is 10. [premium] */
	limit: z.number().optional(),
	/** Number of results to skip for pagination (default: 0). [premium] */
	offset: z.number().optional(),
});

const MarketsInsiderTransactionsOutputSchema = z.array(
	z
		.object({
			accession_number: z.string().nullable().optional(),
			form: z.string().nullable().optional(),
			filing_date: z.string().nullable().optional(),
			sec_filing_url: z.string().nullable().optional(),
			cik: z.string().nullable().optional(),
			ticker: z.string().nullable().optional(),
			company_name: z.string().nullable().optional(),
			insider_name: z.string().nullable().optional(),
			insider_position: z.string().nullable().optional(),
			transaction_code: z.string().nullable().optional(),
			transaction_name: z.string().nullable().optional(),
			transaction_type: z.string().nullable().optional(),
			transaction_price: z.number().nullable().optional(),
			shares: z.number().nullable().optional(),
			transaction_value: z.number().nullable().optional(),
			pre_transaction_shares: z.number().nullable().optional(),
			pre_transaction_shares_value: z.number().nullable().optional(),
			remaining_shares: z.number().nullable().optional(),
			remaining_shares_value: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of SEC filing information (including the submission URL) corresponding to the given search parameters.
 *
 * GET v1/sec
 */
const MarketsSecFilingsInputSchema = z.object({
	/** Ticker symbol of the company to search (e.g. AAPL for Apple). */
	ticker: z.string(),
	/** SEC filing form type. The following values are supported: */
	filing: z.string(),
	/** Start date to search. Must be in YYYY-MM-DD format (e.g. 2023-04-01). [premium] */
	start: z.string().optional(),
	/** End date to search. Must be in YYYY-MM-DD format (e.g. 2023-04-01). [premium] */
	end: z.string().optional(),
	/** Number of results to return from 1 to 100. By default, up to 2 results are returned. [premium] */
	limit: z.number().optional(),
});

const MarketsSecFilingsOutputSchema = z.array(
	z
		.object({
			ticker: z.string().nullable().optional(),
			filing_date: z.string().nullable().optional(),
			filing_url: z.string().nullable().optional(),
			form_type: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns comprehensive information about any ETF by its ticker. Premium members have access to live prices, while free users only have access to 15-minute delayed data.
 *
 * GET v1/etf
 */
const MarketsEtfInputSchema = z.object({
	/** ETF ticker symbol (e.g., QQQ, SPY, VTI). You must pass the complete ticker symbol, including any exchange suffix (dot notation) when the listing requires it. For example, EUNL.DE, not EUNL. */
	ticker: z.string(),
});

const MarketsEtfOutputSchema = z
	.object({
		etf_ticker: z.string().nullable().optional(),
		price: z.union([z.number(), z.string()]).nullable().optional(),
		etf_name: z.string().nullable().optional(),
		isin: z.string().nullable().optional(),
		cusip: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		domicile: z.string().nullable().optional(),
		expense_ratio: z.union([z.number(), z.string()]).nullable().optional(),
		aum: z.string().nullable().optional(),
		aum_currency: z.string().nullable().optional(),
		aum_usd: z.union([z.number(), z.string()]).nullable().optional(),
		holdings: z
			.union([z.array(z.string()), z.string()])
			.nullable()
			.optional(),
		num_holdings: z.union([z.number(), z.string()]).nullable().optional(),
	})
	.loose();

/**
 * Returns comprehensive information about any Mutual Fund by its ticker.
 *
 * GET v1/mutualfund
 */
const MarketsMutualFundInputSchema = z.object({
	/** Mutual Fund ticker symbol (e.g., VFIAX, FXAIX, FZROX). */
	ticker: z.string(),
});

const MarketsMutualFundOutputSchema = z
	.object({
		fund_ticker: z.string().nullable().optional(),
		fund_name: z.string().nullable().optional(),
		isin: z.string().nullable().optional(),
		cusip: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		expense_ratio: z.string().nullable().optional(),
		aum: z.union([z.number(), z.string()]).nullable().optional(),
		price: z.union([z.number(), z.string()]).nullable().optional(),
		holdings: z
			.union([z.array(z.string()), z.string()])
			.nullable()
			.optional(),
		num_holdings: z.union([z.number(), z.string()]).nullable().optional(),
	})
	.loose();

/**
 * Returns the current price and current time (in UNIX timestamp in seconds) for any cryptocurrency symbol. Premium members have access to live prices, while free users only have access to 15-minute delayed data. For historical price data, see /v1/cryptopricehistorical.
 *
 * GET v1/cryptoprice
 */
const MarketsCryptoPriceInputSchema = z.object({
	/** Cryptocurrency symbol (e.g. LTCBTC). To get the full list of available crypto-quoted symbols, use the Crypto Symbols API. Premium subscribers can also quote any cryptocurrency in a supported fiat currency (e.g. BTCEUR, ETHJPY). */
	symbol: z.string(),
});

const MarketsCryptoPriceOutputSchema = z
	.object({
		symbol: z.string().nullable().optional(),
		price: z.string().nullable().optional(),
		timestamp: z.number().nullable().optional(),
	})
	.loose();

/**
 * Returns the latest Bitcoin price in USD and 24-hour market data. Premium members have access to live prices, while free users only have access to 15-minute delayed data. For historical price data, see /v1/bitcoinhistorical.
 *
 * GET v1/bitcoin
 */
const MarketsBitcoinInputSchema = z.object({});

const MarketsBitcoinOutputSchema = z
	.object({
		price: z.string().nullable().optional(),
		timestamp: z.number().nullable().optional(),
		'24h_price_change': z.string().nullable().optional(),
		'24h_price_change_percent': z.string().nullable().optional(),
		'24h_high': z.string().nullable().optional(),
		'24h_low': z.string().nullable().optional(),
		'24h_volume': z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns the current price information for one or more commodities. Prices are based on rolling futures contracts and are quoted in the commodity's native unit and currency convention - see the unit and currency_unit fields below. Use the optional currency and unit parameters to convert into any supported currency or compatible mass/volume/energy unit. Premium members have access to live prices, while free users only have access to 15-minute delayed data.
 *
 * GET v1/commodityprice
 */
const MarketsCommodityPriceInputSchema = z.object({
	/** Name of a single commodity. Either name or names is required (not both). Free tier users have access to 7 commodities per week. These commodities rotate weekly on a deterministic schedule. Premium users have access to all commodities. The supported values are: */
	name: z.string().optional(),
	/** Comma-separated list of commodity values for a batch request (e.g., gold,silver,platinum). Maximum 30 per call. When provided, the response is a JSON array instead of a single object. Mutually exclusive with name. Available to Business, Professional, and Enterprise subscribers, or any annual plan; other tiers should use the name parameter for single-commodity lookups. */
	names: z.string().optional(),
	/** ISO 4217 currency code to convert the price into (e.g., EUR, GBP, INR, JPY). When provided, USX prices are first normalized to USD before conversion, so the response is always in major currency units. Defaults to the commodity's native USD/USX quote. */
	currency: z.string().optional(),
	/** Target unit for the price. Supported: mass (troy_ounce, lb, kg, g, oz, metric_ton, short_ton, hundredweight), volume (barrel, gallon, liter, cubic_meter), and energy (MMBtu, MWh, GJ, therm). Bushel and board_feet are commodity-specific and cannot be cross-converted - requests to convert them will return an error. */
	unit: z.string().optional(),
});

const MarketsCommodityPriceOutputSchema = z
	.object({
		exchange: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		value: z.string().nullable().optional(),
		unit: z.string().nullable().optional(),
		currency_unit: z.string().nullable().optional(),
		price: z.number().nullable().optional(),
		change_24h_percent: z.number().nullable().optional(),
		change_24h: z.number().nullable().optional(),
		low_24h: z.number().nullable().optional(),
		high_24h: z.number().nullable().optional(),
		previous_close: z.number().nullable().optional(),
		updated: z.number().nullable().optional(),
		/** 52-week high and low prices. */
		high_52w: z.string().nullable().optional(),
	})
	.loose();

/**
 * Converts an existing currency and amount into a new currency.
 *
 * GET v1/convertcurrency
 */
const MarketsConvertCurrencyInputSchema = z.object({
	/** Currency you currently hold. Must be 3-character currency code (e.g. USD). */
	have: z.string(),
	/** Currency you want to convert to. Must be 3-character currency code (e.g. USD). */
	want: z.string(),
	/** Amount of currency to convert. */
	amount: z.number(),
});

/** Declared from the documentation: this endpoint is premium-gated, so no free-tier response could be captured. */
const MarketsConvertCurrencyOutputSchema = z
	.object({
		/** The original amount to convert (e.g. 5000). */
		old_amount: z.union([z.number(), z.string()]).nullable().optional(),
		/** The original currency code (e.g. GBP). */
		old_currency: z.string().nullable().optional(),
		/** The converted amount in the new currency (e.g. 9559.32). */
		new_amount: z.union([z.number(), z.string()]).nullable().optional(),
		/** The new currency code (e.g. AUD). */
		new_currency: z.string().nullable().optional(),
		/** Unix timestamp (in seconds) indicating the time at which the exchange rate used for the conversion was applied. */
		timestamp: z.union([z.number(), z.string()]).nullable().optional(),
	})
	.loose();

/**
 * Returns the exchange rate for a given currency pair.
 *
 * GET v1/exchangerate
 */
const MarketsExchangeRateInputSchema = z.object({
	/** Currency pair to query. Must be in the form of currency1_currency2 (e.g. USD_EUR). */
	pair: z.string(),
});

/** Declared from the documentation: this endpoint is premium-gated, so no free-tier response could be captured. */
const MarketsExchangeRateOutputSchema = z
	.object({
		/** The requested currency pair. */
		currency_pair: z.string().nullable().optional(),
		/** The exchange rate for the given currency pair. */
		exchange_rate: z.union([z.number(), z.string()]).nullable().optional(),
		/** Unix timestamp (in seconds) indicating the time at which the exchange rate was applied. */
		timestamp: z.union([z.number(), z.string()]).nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/* economics                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Get GDP data from given parameters. Returns GDP statistics that satisfy the parameters.
 *
 * GET v1/gdp
 */
const EconomicsGdpInputSchema = z.object({
	/** Country name (case-insensitive) or 2-letter ISO-3166 alpha-2 code of the country. E.g. Canada or CA. */
	country: z.string().optional(),
	/** Year for which to retrieve GDP data. */
	year: z.number().optional(),
});

const EconomicsGdpOutputSchema = z.array(
	z
		.object({
			country: z.string().nullable().optional(),
			year: z.number().nullable().optional(),
			gdp_growth: z.number().nullable().optional(),
			gdp_nominal: z.number().nullable().optional(),
			gdp_per_capita_nominal: z.number().nullable().optional(),
			gdp_ppp: z.number().nullable().optional(),
			gdp_per_capita_ppp: z.number().nullable().optional(),
			gdp_ppp_share: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns current monthly and annual inflation percentages.
 *
 * GET v1/inflation
 */
const EconomicsInflationInputSchema = z.object({
	/** Inflation indicator type. Can be either CPI (Consumer Price Index) or HICP (Harmonized Index of Consumer Prices). If not provided, the CPI will be used by default. */
	type: z.string().optional(),
	/** 2-letter country code (ISO-3166-1 alpha-2) or name of country (case-insensitive). */
	country: z.string().optional(),
});

/** Declared from the documentation: this endpoint is premium-gated, so no free-tier response could be captured. */
const EconomicsInflationOutputSchema = z.array(
	z
		.object({
			/** The name of the country. */
			country: z.string().nullable().optional(),
			/** The 2-letter country code (ISO-3166-1 alpha-2). */
			country_code: z.string().nullable().optional(),
			/** The type of inflation indicator (CPI or HICP). */
			type: z.string().nullable().optional(),
			/** The period for the inflation data. */
			period: z.union([z.number(), z.string()]).nullable().optional(),
			/** The monthly inflation rate as a percentage. */
			monthly_rate_pct: z.union([z.number(), z.string()]).nullable().optional(),
			/** The yearly inflation rate as a percentage. */
			yearly_rate_pct: z.union([z.number(), z.string()]).nullable().optional(),
		})
		.loose(),
);

/**
 * Get unemployment data for a given country. Returns historical, current and forecast unemployment statistics.
 *
 * GET v1/unemployment
 */
const EconomicsUnemploymentInputSchema = z.object({
	/** Country name (case-insensitive) or 2-letter ISO-3166 alpha-2 code of the country. E.g. Canada or CA. */
	country: z.string().optional(),
	/** Year for which to retrieve unemployment data. */
	year: z.number().optional(),
});

const EconomicsUnemploymentOutputSchema = z.array(
	z
		.object({
			country: z.string().nullable().optional(),
			year: z.number().nullable().optional(),
			unemployment_rate: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * Get population data from given parameters. Returns a list of up to 5 country population statistics that satisfy the parameters. For more results use the offset parameter.
 *
 * GET v1/population
 */
const EconomicsPopulationInputSchema = z.object({
	/** Country name (case-insensitive) or 2-letter ISO-3166 alpha-2 code of the country. E.g. Japan or JP. */
	country: z.string().optional(),
	/** Minimum population of country. */
	min_population: z.number().optional(),
	/** Maximum population of country. */
	max_population: z.number().optional(),
	/** Offset results for pagination. */
	offset: z.number().optional(),
});

const EconomicsPopulationOutputSchema = z
	.object({
		historical_population: z
			.array(
				z
					.object({
						year: z.number().nullable().optional(),
						population: z.number().nullable().optional(),
						yearly_change_percentage: z.number().nullable().optional(),
						yearly_change: z.number().nullable().optional(),
						migrants: z.number().nullable().optional(),
						median_age: z.number().nullable().optional(),
						fertility_rate: z.number().nullable().optional(),
						density: z.number().nullable().optional(),
						urban_population_pct: z.number().nullable().optional(),
						urban_population: z.number().nullable().optional(),
						percentage_of_world_population: z.number().nullable().optional(),
						rank: z.number().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		population_forecast: z
			.array(
				z
					.object({
						year: z.number().nullable().optional(),
						population: z.number().nullable().optional(),
						yearly_change_percentage: z.number().nullable().optional(),
						yearly_change: z.number().nullable().optional(),
						migrants: z.union([z.number(), z.string()]).nullable().optional(),
						median_age: z.number().nullable().optional(),
						fertility_rate: z.number().nullable().optional(),
						density: z.number().nullable().optional(),
						urban_population_pct: z.number().nullable().optional(),
						urban_population: z.number().nullable().optional(),
						percentage_of_world_population: z.number().nullable().optional(),
						rank: z.number().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		country_name: z.string().nullable().optional(),
		/** Total population count for the country in the given year. */
		population: z.union([z.number(), z.string()]).nullable().optional(),
		/** Percentage change in population from the previous year (can be positive or negative). */
		yearly_change_percentage: z
			.union([z.number(), z.string()])
			.nullable()
			.optional(),
		/** Absolute change in population from the previous year (can be positive or negative). */
		yearly_change: z.string().nullable().optional(),
		/** Net number of migrants (immigrants minus emigrants) for the year. */
		migrants: z.union([z.number(), z.string()]).nullable().optional(),
		/** Median age of the population in years. */
		median_age: z.string().nullable().optional(),
		/** Average number of children born per woman in the population. */
		fertility_rate: z.union([z.number(), z.string()]).nullable().optional(),
		/** Population density per square kilometer. */
		density: z.string().nullable().optional(),
		/** Percentage of the total population living in urban areas. */
		urban_population_pct: z
			.union([z.number(), z.string()])
			.nullable()
			.optional(),
		/** Total number of people living in urban areas. */
		urban_population: z.union([z.number(), z.string()]).nullable().optional(),
		/** Percentage of the world's total population represented by this country. */
		percentage_of_world_population: z
			.union([z.number(), z.string()])
			.nullable()
			.optional(),
		/** World ranking by population size (1 being the most populous country). */
		rank: z.union([z.number(), z.string()]).nullable().optional(),
	})
	.loose();

/**
 * Get a specific interest rate by name. Returns the rate value, name, and last updated timestamp.
 *
 * GET v2/interestrate
 */
const EconomicsInterestRateInputSchema = z.object({
	rate: z.string(),
});

/** Declared from the documentation: this endpoint is premium-gated, so no free-tier response could be captured. */
const EconomicsInterestRateOutputSchema = z
	.object({
		/** The name of the interest rate. */
		rate_name: z.string().nullable().optional(),
		/** The interest rate value as a percentage. */
		rate_pct: z.union([z.number(), z.string()]).nullable().optional(),
		/** Date when the rate was last updated (MM-DD-YYYY format). */
		last_updated: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns the daily 30-year and 15-year fixed-rate mortgage (FRM) data. If no parameters are set, the mortgage rate data for the most recent day is returned.
 *
 * GET v2/mortgagerate
 */
const EconomicsMortgageRateInputSchema = z.object({
	/** Individual date to query in YYYY-MM-DD format. [premium] */
	date: z.string().optional(),
	/** Minimum date range to query in YYYY-MM-DD format. Must be used with max_date. [premium] */
	min_date: z.number().optional(),
	/** Maximum date range to query in YYYY-MM-DD format. Must be used with min_date. [premium] */
	max_date: z.number().optional(),
});

const EconomicsMortgageRateOutputSchema = z.array(
	z
		.object({
			date: z.string().nullable().optional(),
			frm_30: z.string().nullable().optional(),
			frm_15: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns monthly payment, annual payment, and interest rate information based on given mortgage parameters.
 *
 * GET v1/mortgagecalculator
 */
const EconomicsMortgageCalculatorInputSchema = z.object({
	/** Principal loan amount. */
	loan_amount: z.number().optional(),
	/** Total value of the home or asset. Must be greater than downpayment. */
	home_value: z.string().optional(),
	/** Downpayment on the home or asset. Cannot exceed home_value. */
	downpayment: z.number().optional(),
	/** Annual interest rate (in %). For example, a 3.5% interest rate would be 3.5. Cannot exceed 10000. */
	interest_rate: z.number(),
	/** Duration of the loan in years. Must be between 1 and 10000. If not set, the default value is 30 years. */
	duration_years: z.number().optional(),
	/** Monthly homeowner association fees. */
	monthly_hoa: z.number().optional(),
	/** Annual property tax owed. */
	annual_property_tax: z.number().optional(),
	/** Annual homeowner's insurance bill. */
	annual_home_insurance: z.number().optional(),
});

const EconomicsMortgageCalculatorOutputSchema = z
	.object({
		monthly_payment: z
			.object({
				total: z.number().nullable().optional(),
				mortgage: z.number().nullable().optional(),
				property_tax: z.number().nullable().optional(),
				hoa: z.number().nullable().optional(),
				annual_home_ins: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		annual_payment: z
			.object({
				total: z.number().nullable().optional(),
				mortgage: z.number().nullable().optional(),
				property_tax: z.number().nullable().optional(),
				hoa: z.number().nullable().optional(),
				home_insurance: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		total_interest_paid: z.number().nullable().optional(),
	})
	.loose();

/**
 * Returns comprehensive income tax information including tax brackets and rates at both federal and state/provincial levels (where applicable).
 *
 * GET v2/incometax
 */
const EconomicsIncomeTaxInputSchema = z.object({
	/** 2-letter country code (e.g., US, CA) */
	country: z.string(),
	/** The tax year for which to retrieve data */
	year: z.number(),
	/** Comma-separated list of regions to filter the response. For United States, specify 2-letter state codes (e.g., AL, CA, NY) or federal for federal tax information only. For Canada, specify 2-letter provincial codes (e.g., ON, BC, QC) or federal for federal tax information only. Multiple regions can be specified (e.g., federal,AL,CA,NY). When specified, filters the response to only include tax information for those regions. If unset, the response will include all regions (federal and all states/provinces). */
	regions: z.string().optional(),
});

const EconomicsIncomeTaxOutputSchema = z
	.object({
		country: z.string().nullable().optional(),
		year: z.number().nullable().optional(),
		fica: z.string().nullable().optional(),
		states: z.string().nullable().optional(),
		federal: z
			.object({
				married: z
					.object({
						brackets: z
							.array(
								z
									.object({
										rate: z.number().nullable().optional(),
										min: z.number().nullable().optional(),
										max: z
											.union([z.number(), z.string()])
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
					})
					.loose()
					.nullable()
					.optional(),
				married_separate: z
					.object({
						brackets: z
							.array(
								z
									.object({
										rate: z.number().nullable().optional(),
										min: z.number().nullable().optional(),
										max: z
											.union([z.number(), z.string()])
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
					})
					.loose()
					.nullable()
					.optional(),
				single: z
					.object({
						brackets: z
							.array(
								z
									.object({
										rate: z.number().nullable().optional(),
										min: z.number().nullable().optional(),
										max: z
											.union([z.number(), z.string()])
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
					})
					.loose()
					.nullable()
					.optional(),
				head_of_household: z
					.object({
						brackets: z
							.array(
								z
									.object({
										rate: z.number().nullable().optional(),
										min: z.number().nullable().optional(),
										max: z
											.union([z.number(), z.string()])
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
					})
					.loose()
					.nullable()
					.optional(),
			})
			.loose()
			.nullable()
			.optional(),
		/** The provincial tax rates for the given country and year (Canada only). */
		provinces: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns comprehensive annual tax calculations including federal, state/provincial, and FICA taxes where applicable.
 *
 * GET v1/incometaxcalculator
 */
const EconomicsIncomeTaxCalculatorInputSchema = z.object({
	/** 2-letter country code (e.g., US, CA) */
	country: z.string(),
	/** State/province code (e.g., CA, NY, ON) */
	region: z.string(),
	/** Annual income amount */
	income: z.number(),
	/** Tax year in YYYY format (e.g., 2026). If not specified, the latest year will be used. */
	tax_year: z.string().optional(),
	/** Tax filing status. Possible values: single, married (married filing jointly), married_separate (married filing separately), or head_of_household */
	filing_status: z.string(),
	/** Total tax deductions amount */
	deductions: z.string().optional(),
	/** Total tax credits amount */
	credits: z.string().optional(),
	/** Set to true for self-employed tax calculations (US only) */
	self_employed: z.boolean().optional(),
});

const EconomicsIncomeTaxCalculatorOutputSchema = z
	.object({
		country: z.string().nullable().optional(),
		region: z.string().nullable().optional(),
		income: z.number().nullable().optional(),
		taxable_income: z.number().nullable().optional(),
		deductions: z.number().nullable().optional(),
		credits: z.number().nullable().optional(),
		tax_year: z.string().nullable().optional(),
		federal_effective_rate: z.number().nullable().optional(),
		federal_taxes_owed: z.number().nullable().optional(),
		fica_social_security: z.string().nullable().optional(),
		fica_social_security_rate: z
			.union([z.number(), z.string()])
			.nullable()
			.optional(),
		fica_social_security_cap: z
			.union([z.number(), z.string()])
			.nullable()
			.optional(),
		fica_medicare: z.string().nullable().optional(),
		fica_medicare_rate: z.union([z.number(), z.string()]).nullable().optional(),
		fica_total: z.union([z.number(), z.string()]).nullable().optional(),
		region_effective_rate: z
			.union([z.number(), z.string()])
			.nullable()
			.optional(),
		region_taxes_owed: z.string().nullable().optional(),
		total_taxes_owed: z.string().nullable().optional(),
		income_after_tax: z.string().nullable().optional(),
		total_effective_tax_rate: z
			.union([z.number(), z.string()])
			.nullable()
			.optional(),
	})
	.loose();

/**
 * Returns one or more sales tax breakdowns by ZIP code according to the specified parameters. Each breakdown includes the state sales tax (if any), county sales tax (if any), city sales tax (if any), and any additional special sales taxes. All tax values are presented in decimals (e.g. 0.1 means 10% tax).
 *
 * GET v1/salestax
 */
const EconomicsSalesTaxInputSchema = z.object({
	/** Valid US ZIP code. */
	zip_code: z.string().optional(),
	/** Street address (e.g. 9641 Sunset Blvd). Used together with city and state for the most accurate lookup. */
	street_address: z.string().optional(),
	/** City name. */
	city: z.string().optional(),
	/** State name. */
	state: z.string().optional(),
});

const EconomicsSalesTaxOutputSchema = z.array(
	z
		.object({
			zip_code: z.string().nullable().optional(),
			state_rate: z.string().nullable().optional(),
			city_rate: z.union([z.number(), z.string()]).nullable().optional(),
			county_rate: z.union([z.number(), z.string()]).nullable().optional(),
			additional_rate: z.union([z.number(), z.string()]).nullable().optional(),
			total_rate: z.union([z.number(), z.string()]).nullable().optional(),
			/** The street address from the request. Only returned when the street_address parameter is provided. */
			street_address: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Calculates sales tax for a given amount and location. Returns a detailed breakdown including state, county, city, and special district taxes, along with the calculated tax amount and total amount after tax.
 *
 * GET v1/salestaxcalculator
 */
const EconomicsSalesTaxCalculatorInputSchema = z.object({
	/** Purchase amount to calculate tax on. */
	amount: z.number(),
	/** Valid US ZIP code. */
	zip_code: z.string().optional(),
	/** Street address (e.g. 9641 Sunset Blvd). Used together with city and state for the most accurate lookup. */
	street_address: z.string().optional(),
	/** City name. */
	city: z.string().optional(),
	/** State name. */
	state: z.string().optional(),
});

const EconomicsSalesTaxCalculatorOutputSchema = z.array(
	z
		.object({
			zip_code: z.string().nullable().optional(),
			pre_tax_amount: z.string().nullable().optional(),
			state_rate: z.number().nullable().optional(),
			total_rate: z.union([z.number(), z.string()]).nullable().optional(),
			city_rate: z.union([z.number(), z.string()]).nullable().optional(),
			county_rate: z.union([z.number(), z.string()]).nullable().optional(),
			additional_rate: z.union([z.number(), z.string()]).nullable().optional(),
			state_tax: z.number().nullable().optional(),
			city_tax: z.string().nullable().optional(),
			county_tax: z.string().nullable().optional(),
			additional_tax: z.string().nullable().optional(),
			total_tax: z.string().nullable().optional(),
			total_price: z.union([z.number(), z.string()]).nullable().optional(),
			/** The street address from the request. Only returned when the street_address parameter is provided. */
			street_address: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of regions and corresponding 25th, 50th (median), and 75th percentile effective property tax rates. The region is mostly zipcode-based, but sometimes a single zipcode can contain multiple regions due to local tax laws.
 *
 * GET v1/propertytax
 */
const EconomicsPropertyTaxInputSchema = z.object({
	/** 2-letter abbreviation of the state (case-insensitive). */
	state: z.string().optional(),
	/** The name of the county for which property tax data is being requested. */
	county: z.string().optional(),
	/** Full name of the city to search (case-sensitive). */
	city: z.string().optional(),
	/** The ZIP Code to look up property tax rates. */
	zip: z.string().optional(),
});

const EconomicsPropertyTaxOutputSchema = z.array(
	z
		.object({
			state: z.string().nullable().optional(),
			county: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			zip: z.string().nullable().optional(),
			property_tax_25th_percentile: z.number().nullable().optional(),
			property_tax_50th_percentile: z.number().nullable().optional(),
			property_tax_75th_percentile: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns VAT rates for a specified EU country. Results include standard rate, reduced rates, super-reduced rates, and any special categories.
 *
 * GET v1/vat
 */
const EconomicsVatRatesInputSchema = z.object({
	/** Two-letter country code (ISO 3166-1 alpha-2). */
	country: z.string(),
	/** VAT rate type. Possible values: standard, reduced, super_reduced, exempted, parking. Numeric rate values for types other than standard require a premium subscription. */
	type: z.number().optional(),
	/** Filter results after this date (YYYY-MM-DD format). */
	min_date: z.number().optional(),
	/** Filter results before this date (YYYY-MM-DD format). */
	max_date: z.number().optional(),
	/** Number of results to return (1-100). Default is 5. [premium] */
	limit: z.number().optional(),
	/** Number of results to offset for pagination. Default is 0. [premium] */
	offset: z.number().optional(),
});

const EconomicsVatRatesOutputSchema = z.array(
	z
		.object({
			country: z.string().nullable().optional(),
			type: z.string().nullable().optional(),
			rate: z.union([z.number(), z.string()]).nullable().optional(),
			date: z.string().nullable().optional(),
			category: z.string().nullable().optional(),
		})
		.loose(),
);

/* -------------------------------------------------------------------------- */
/* text                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Returns sentiment analysis score and overall sentiment for a given block of text.
 *
 * GET v1/sentiment
 */
const TextSentimentInputSchema = z.object({
	/** Query text for sentiment analysis. Maximum 2000 characters. */
	text: z.string(),
});

const TextSentimentOutputSchema = z
	.object({
		score: z.number().nullable().optional(),
		text: z.string().nullable().optional(),
		sentiment: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns a similarity score between 0 and 1 (1 is similar and 0 is dissimilar) of two given texts.
 *
 * POST v1/textsimilarity
 */
const TextSimilarityInputSchema = z.object({
	/** First input text. Maximum 5000 characters. */
	text_1: z.string(),
	/** Second input text. Maximum 5000 characters. */
	text_2: z.string(),
});

const TextSimilarityOutputSchema = z
	.object({
		similarity: z.number().nullable().optional(),
	})
	.loose();

/**
 * Returns a 768-dimensional vector as an array that encodes the meaning of any given input text.
 *
 * POST v1/embeddings
 */
const TextEmbeddingsInputSchema = z.object({
	/** Query text to embed. Maximum 5000 characters. */
	text: z.string(),
});

const TextEmbeddingsOutputSchema = z
	.object({
		embeddings: z.array(z.number()).nullable().optional(),
	})
	.loose();

/**
 * Returns the language name and 2-letter ISO language code for a given block of text string.
 *
 * GET v1/textlanguage
 */
const TextLanguageInputSchema = z.object({
	/** Input text (10 words or more recommended). Maximum 1000 characters. */
	text: z.string(),
});

const TextLanguageOutputSchema = z
	.object({
		iso: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns spelling corrections and suggestions for any given text.
 *
 * GET v1/spellcheck
 */
const TextSpellCheckInputSchema = z.object({
	/** Input text. Maximum 50 characters for free tier, 500 characters for premium subscribers. */
	text: z.string(),
});

const TextSpellCheckOutputSchema = z
	.object({
		original: z.string().nullable().optional(),
		corrected: z.string().nullable().optional(),
		corrections: z
			.array(
				z
					.object({
						word: z.string().nullable().optional(),
						index: z.number().nullable().optional(),
						correction: z.string().nullable().optional(),
						candidates: z.array(z.string()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		/** The index of the word in the original text. */
		index: z.string().nullable().optional(),
		/** The corrected word. */
		correction: z.string().nullable().optional(),
		/** An array of possible corrections for the word. */
		candidates: z
			.union([z.array(z.string()), z.string()])
			.nullable()
			.optional(),
	})
	.loose();

/**
 * Returns the censored version (bad words replaced with asterisks) of any given text and whether the text contains profanity.
 *
 * GET v1/profanityfilter
 */
const TextProfanityFilterInputSchema = z.object({
	/** Input text. Maximum 1000 characters. */
	text: z.string(),
});

const TextProfanityFilterOutputSchema = z
	.object({
		original: z.string().nullable().optional(),
		censored: z.string().nullable().optional(),
		has_profanity: z.boolean().nullable().optional(),
	})
	.loose();

/**
 * Returns a string containing definitions for a given word.
 *
 * GET v1/dictionary
 */
const TextDictionaryInputSchema = z.object({
	/** Word to look up. */
	word: z.string(),
});

const TextDictionaryOutputSchema = z
	.object({
		definition: z.string().nullable().optional(),
		word: z.string().nullable().optional(),
		valid: z.boolean().nullable().optional(),
	})
	.loose();

/**
 * Returns a list of synonyms and a list of antonyms for a given word.
 *
 * GET v1/thesaurus
 */
const TextThesaurusInputSchema = z.object({
	/** Word to look up. */
	word: z.string(),
});

const TextThesaurusOutputSchema = z
	.object({
		word: z.string().nullable().optional(),
		synonyms: z.array(z.string()).nullable().optional(),
		antonyms: z.array(z.string()).nullable().optional(),
	})
	.loose();

/**
 * Returns a list of rhyming words for any given word.
 *
 * GET v1/rhyme
 */
const TextRhymesInputSchema = z.object({
	/** Word to look up. */
	word: z.string(),
});

const TextRhymesOutputSchema = z.array(z.string());

/**
 * Returns a random word.
 *
 * GET v2/randomword
 */
const TextRandomWordInputSchema = z.object({
	/** Type of word. Possible values are: noun, verb, adjective, adverb. [premium] */
	type: z.string().optional(),
	/** How many results to return. Must be between 1 and 30. Default is 1. [premium] */
	limit: z.number().optional(),
});

const TextRandomWordOutputSchema = z.array(z.string());

/**
 * Returns one or more paragraphs of lorem ipsum placeholder text.
 *
 * GET v1/loremipsum
 */
const TextLoremIpsumInputSchema = z.object({
	/** Maximum character length. */
	max_length: z.number().optional(),
	/** Number of paragraphs to generate. If unset, a default value of 1 will be used. */
	paragraphs: z.number().optional(),
	/** Whether to begin the text with the words "Lorem ipsum". Must be either true or false. If unset, a default value of true will be used. */
	start_with_lorem_ipsum: z.boolean().optional(),
	/** Whether to randomly generate paragraphs. Must be either true or false. If unset, a default value of true will be used. */
	random: z.boolean().optional(),
});

const TextLoremIpsumOutputSchema = z
	.object({
		text: z.string().nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/* utility                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Returns a QRCode image binary specified by input parameters.
 *
 * GET v1/qrcode
 */
const UtilityQrCodeInputSchema = z.object({
	/** Data to encode in the QR code. */
	data: z.string(),
	/** Image format to return. Must be one of the following: png, jpg, jpeg, eps, svg. */
	format: z.string().optional(),
	/** Size of the QR code image to generate (e.g. 200). The output will be a square image with (size x size) dimensions. The default size is 250. */
	size: z.number().optional(),
	/** Foreground color of the QR code. Must be a 6-digit hex color (e.g. 00ff00 for green). Default is 000000 (black). */
	fg_color: z.string().optional(),
	/** Background color of the QR code. Must be a 6-digit hex color (e.g. 00ff00 for green). Default is ffffff (white). */
	bg_color: z.string().optional(),
});

/**
 * Returns the generated QR code image in the format specified by the format parameter (for example PNG, JPG, SVG). The response body is binary image data (or text for SVG/EPS). Returns an error if the request is unsuccessful.
 *
 * `encoding` is `text` when the payload is exactly what the provider sent
 * (SVG, EPS) and `lossy-text` when it is a raster format that was decoded as
 * text on the way through and can no longer be written back out as an image.
 */
const UtilityQrCodeOutputSchema = z.object({
	content_type: z.string(),
	encoding: z.enum(['text', 'lossy-text']),
	data: z.string(),
});

/**
 * Returns a barcode image binary specified by input parameters.
 *
 * GET v1/barcodegenerate
 */
const UtilityBarcodeInputSchema = z.object({
	/** Text to encode in the barcode. */
	text: z.string(),
	/** Type of barcode to generate. Must be one of: code39, code128, ean, ean13, ean8, gs1, gtin, isbn, isbn10, isbn13, issn, jan, pzn, upc, upca. Default is upc. */
	type: z.string().optional(),
	/** Image format to return. Must be one of: png, svg. Default is png. */
	format: z.string().optional(),
	/** Whether to include the text below the barcode. Must be true or false. Default is true. */
	include_text: z.boolean().optional(),
});

/**
 * Returns the barcode image as binary data in the requested format (PNG or SVG), or an error if the request is unsuccessful.
 *
 * `encoding` is `text` when the payload is exactly what the provider sent
 * (SVG, EPS) and `lossy-text` when it is a raster format that was decoded as
 * text on the way through and can no longer be written back out as an image.
 */
const UtilityBarcodeOutputSchema = z.object({
	content_type: z.string(),
	encoding: z.enum(['text', 'lossy-text']),
	data: z.string(),
});

/**
 * Returns a random password string adhering to the specified parameters.
 *
 * GET v1/passwordgenerator
 */
const UtilityPasswordInputSchema = z.object({
	/** Length of password in characters. If not set, a default value of 16 is used. */
	length: z.number().optional(),
	/** Whether to exclude numbers from the password. Must be either true or false. If not set, a default value of false will be used. */
	exclude_numbers: z.boolean().optional(),
	/** Whether to exclude special characters(!@#$%^&*()) from the password. Must be either true or false. If not set, a default value of false will be used. */
	exclude_special_chars: z.boolean().optional(),
});

const UtilityPasswordOutputSchema = z
	.object({
		random_password: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns fake random user profiles. Supports customizable fields, filtering, and localization.
 *
 * GET v2/randomuser
 */
const UtilityRandomUserInputSchema = z.object({
	/** Number of users to generate (1-30). Default: 10 */
	count: z.number().optional(),
	/** Filter by gender: "male", "female", "nonbinary", or "any". Default: "any" */
	gender: z.string().optional(),
	/** Minimum age (0-1000). Default: 0 */
	min_age: z.number().optional(),
	/** Maximum age (0-1000). Default: 100 */
	max_age: z.number().optional(),
	/** Locale for generating localized data (e.g., "en_US", "de_DE", "fr_FR"). Default: "en_US" */
	locale: z.string().optional(),
	/** Comma-separated list of fields to include (e.g., "name,email,phone"). If not specified, all available fields are returned. */
	fields: z.string().optional(),
	/** Comma-separated list of fields to exclude from the response. */
	exclude: z.string().optional(),
	/** Seed value for reproducible random data generation. */
	seed: z.string().optional(),
});

const UtilityRandomUserOutputSchema = z.array(
	z
		.object({
			id: z.string().nullable().optional(),
			username: z.string().nullable().optional(),
			password: z.string().nullable().optional(),
			email: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			first_name: z.string().nullable().optional(),
			last_name: z.string().nullable().optional(),
			full_name: z.string().nullable().optional(),
			prefix: z.string().nullable().optional(),
			suffix: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			cell: z.string().nullable().optional(),
			address: z.string().nullable().optional(),
			street_address: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
			postal_code: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			latitude: z.number().nullable().optional(),
			longitude: z.number().nullable().optional(),
			timezone: z.string().nullable().optional(),
			dob: z.string().nullable().optional(),
			age: z.number().nullable().optional(),
			gender: z.string().nullable().optional(),
			job: z.string().nullable().optional(),
			company: z.string().nullable().optional(),
			company_email: z.string().nullable().optional(),
			ssn: z.string().nullable().optional(),
			credit_card: z.string().nullable().optional(),
			credit_card_provider: z.string().nullable().optional(),
			iban: z.string().nullable().optional(),
			ipv4: z.string().nullable().optional(),
			ipv6: z.string().nullable().optional(),
			mac_address: z.string().nullable().optional(),
			user_agent: z.string().nullable().optional(),
			url: z.string().nullable().optional(),
			domain: z.string().nullable().optional(),
			picture: z.string().nullable().optional(),
			avatar: z.string().nullable().optional(),
			uuid: z.string().nullable().optional(),
			md5: z.string().nullable().optional(),
			sha1: z.string().nullable().optional(),
			sha256: z.string().nullable().optional(),
			locale: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Fetch and possibly update a counter.
 *
 * GET v1/counter
 */
const UtilityCounterInputSchema = z.object({
	/** ID to specify the counter. Use a new id to create a new counter. */
	id: z.string(),
	/** Whether to increase the count by 1. If used, must be set to true. */
	hit: z.boolean().optional(),
	/** Set the count to a specific integer value. Setting the value to 0 resets the counter. */
	value: z.number().optional(),
});

const UtilityCounterOutputSchema = z
	.object({
		id: z.string().nullable().optional(),
		value: z.number().nullable().optional(),
	})
	.loose();

/**
 * Returns conversions between different units of the same measurement type.
 *
 * GET v1/unitconversion
 */
const UtilityConvertUnitInputSchema = z.object({
	/** The numerical value to convert. */
	amount: z.number(),
	/** The source unit to convert from. Spaces should be replaced with underscores. See Supported Measurement Types for a list of available units. */
	unit: z.string(),
});

const UtilityConvertUnitOutputSchema = z
	.object({
		type: z.string().nullable().optional(),
		unit: z.string().nullable().optional(),
		amount: z.number().nullable().optional(),
		conversions: z
			.object({
				meter: z.number().nullable().optional(),
				kilometer: z.number().nullable().optional(),
				centimeter: z.number().nullable().optional(),
				millimeter: z.number().nullable().optional(),
				micrometer: z.number().nullable().optional(),
				nanometer: z.number().nullable().optional(),
				mile: z.number().nullable().optional(),
				yard: z.number().nullable().optional(),
				foot: z.number().nullable().optional(),
				inch: z.number().nullable().optional(),
				nautical_mile: z.number().nullable().optional(),
				furlong: z.number().nullable().optional(),
				light_year: z.number().nullable().optional(),
				astronomical_unit: z.number().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
	})
	.loose();

/**
 * Get a list of company names, ticker symbols, and logo image URLs matching the input parameters. Returns at most 10 results.
 *
 * GET v1/logo
 */
const UtilityLogoInputSchema = z.object({
	/** Company name. Supports partial matching (e.g. Micro will match Microsoft). Case-insensitive. */
	name: z.string().optional(),
	/** Company ticker symbol (for publicly traded companies only). */
	ticker: z.string().optional(),
});

const UtilityLogoOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			image: z.string().nullable().optional(),
			ticker: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Get a country's flag as SVG image URLs. Both 1:1 and 4:3 aspect ratios are supported and returned in the response.
 *
 * GET v1/countryflag
 */
const UtilityCountryFlagInputSchema = z.object({
	/** 2-letter ISO-3166 alpha-2 country code (e.g. US, CA, FR). For countries in the United Kingdom, use GB for Great Britain, GB-ENG for England, GB-SCT for Scotland, GB-WLS for Wales, GB-NIR for Northern Ireland. */
	country: z.string(),
});

const UtilityCountryFlagOutputSchema = z
	.object({
		country: z.string().nullable().optional(),
		square_image_url: z.string().nullable().optional(),
		rectangle_image_url: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns a random image in JPEG format.
 *
 * GET v1/randomimage
 */
const UtilityRandomImageInputSchema = z.object({
	/** Image category. If set, must be one of the following: nature, city, technology, food, still_life, abstract, wildlife. */
	category: z.string().optional(),
	/** Width of the image to generate. Must be between 1 and 5000. Default value is 640. */
	width: z.number().optional(),
	/** Height of the image to generate. Must be between 1 and 5000. Default value is 480. */
	height: z.number().optional(),
});

/**
 * Returns a random image in JPG format. The response body is binary image data. Returns an error if the request is unsuccessful.
 *
 * `encoding` is `text` when the payload is exactly what the provider sent
 * (SVG, EPS) and `lossy-text` when it is a raster format that was decoded as
 * text on the way through and can no longer be written back out as an image.
 */
const UtilityRandomImageOutputSchema = z.object({
	content_type: z.string(),
	encoding: z.enum(['text', 'lossy-text']),
	data: z.string(),
});

/**
 * Returns a list of emojis according to input parameters. Returns at most 30 results. To access more than 30 results, use the offset parameter to offset results in multiple API calls.
 *
 * GET v1/emoji
 */
const UtilityEmojiInputSchema = z.object({
	/** Descriptive name of emoji. */
	name: z.string().optional(),
	/** Unicode character code for the emoji. */
	code: z.string().optional(),
	/** Main category the emoji belongs to. Possible values are: */
	group: z.string().optional(),
	/** Sub-category the emoji belongs to. Possible values are: */
	subgroup: z.string().optional(),
	/** Number of results to offset for pagination. */
	offset: z.number().optional(),
});

const UtilityEmojiOutputSchema = z.array(
	z
		.object({
			code: z.string().nullable().optional(),
			character: z.string().nullable().optional(),
			image: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			group: z.string().nullable().optional(),
			subgroup: z.string().nullable().optional(),
		})
		.loose(),
);

/* -------------------------------------------------------------------------- */
/* transport                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Returns a list of aircrafts that match the given parameters. This API only supports airplanes - for helicopter specs please use our Helicopter API.
 *
 * GET v1/aircraft
 */
const TransportAircraftInputSchema = z.object({
	/** Company that designed and built the aircraft. */
	manufacturer: z.string().optional(),
	/** Aircraft model name. */
	model: z.string().optional(),
	/** Type of engine. Must be one of: piston, propjet, jet. */
	engine_type: z.string().optional(),
	/** Minimum max. air speed in knots. */
	min_speed: z.number().optional(),
	/** Maximum max. air speed in knots. */
	max_speed: z.number().optional(),
	/** Minimum range of the aircraft in nautical miles. */
	min_range: z.number().optional(),
	/** Maximum range of the aircraft in nautical miles. */
	max_range: z.number().optional(),
	/** Minimum length of the aircraft in feet. */
	min_length: z.number().optional(),
	/** Maximum length of the aircraft in feet. */
	max_length: z.number().optional(),
	/** Minimum height of the aircraft in feet. */
	min_height: z.number().optional(),
	/** Maximum height of the aircraft in feet. */
	max_height: z.number().optional(),
	/** Minimum wingspan of the aircraft in feet. */
	min_wingspan: z.number().optional(),
	/** Maximum wingspan of the aircraft in feet. */
	max_wingspan: z.number().optional(),
	/** How many results to return. Must be between 1 and 30. Default is 1. */
	limit: z.number().optional(),
});

const TransportAircraftOutputSchema = z.array(
	z
		.object({
			manufacturer: z.string().nullable().optional(),
			model: z.string().nullable().optional(),
			engine_type: z.string().nullable().optional(),
			max_speed_knots: z.string().nullable().optional(),
			ceiling_ft: z.string().nullable().optional(),
			gross_weight_lbs: z.string().nullable().optional(),
			length_ft: z.string().nullable().optional(),
			height_ft: z.string().nullable().optional(),
			wing_span_ft: z.string().nullable().optional(),
			range_nautical_miles: z.string().nullable().optional(),
			/** Engine thrust in pounds-force. */
			engine_thrust_lb_ft: z
				.union([z.number(), z.string()])
				.nullable()
				.optional(),
			/** Cruise speed in knots. */
			cruise_speed_knots: z
				.union([z.number(), z.string()])
				.nullable()
				.optional(),
			/** Takeoff ground run distance in feet. */
			takeoff_ground_run_ft: z
				.union([z.number(), z.string()])
				.nullable()
				.optional(),
			/** Landing ground roll distance in feet. */
			landing_ground_roll_ft: z
				.union([z.number(), z.string()])
				.nullable()
				.optional(),
			/** Empty weight in pounds. */
			empty_weight_lbs: z.union([z.number(), z.string()]).nullable().optional(),
		})
		.loose(),
);

/**
 * Returns airline details including fleet composition, base airport and branding assets, by name, IATA code or ICAO code.
 *
 * GET v1/airlines
 */
const TransportAirlinesInputSchema = z.object({
	/** Airline name. */
	name: z.string().optional(),
	/** Two-character IATA airline code. */
	iata: z.string().optional(),
	/** Three-character ICAO airline code. */
	icao: z.string().optional(),
});

const TransportAirlinesOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			year_created: z.string().nullable().optional(),
			base: z.string().nullable().optional(),
			iata: z.string().nullable().optional(),
			icao: z.string().nullable().optional(),
			fleet: z
				.object({
					A359: z.number().nullable().optional(),
					A388: z.number().nullable().optional(),
					B38M: z.number().nullable().optional(),
					B738: z.number().nullable().optional(),
					B744: z.number().nullable().optional(),
					B772: z.number().nullable().optional(),
					B773: z.number().nullable().optional(),
					B77W: z.number().nullable().optional(),
					B78X: z.number().nullable().optional(),
					total: z.number().nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
			logo_url: z.string().nullable().optional(),
			brandmark_url: z.string().nullable().optional(),
			tail_logo_url: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of up to 10 airport results. Use the offset parameter to access more results if available.
 *
 * GET v1/airports
 */
const TransportAirportsInputSchema = z.object({
	/** International Air Transport Association (IATA) airport code (typically 3 characters). Supports partial, case-insensitive matching (e.g. LH matches LHR). */
	iata: z.string().optional(),
	/** International Civil Aviation Organization (ICAO) 4-character airport code. Supports partial, case-insensitive matching (e.g. EGL matches EGLL). */
	icao: z.string().optional(),
	/** Airport name. Supports partial matching (e.g. Heathrow matches London Heathrow Airport). [premium] */
	name: z.string().optional(),
	/** Airport country. Must be 2-character ISO-2 country code (e.g. GB). */
	country: z.string().optional(),
	/** Administrative region such as state or province within a country (e.g. California). Supports partial, case-insensitive matching. [premium] */
	region: z.string().optional(),
	/** Airport city (e.g. London). Supports partial, case-insensitive matching (e.g. York may match New York). [premium] */
	city: z.string().optional(),
	/** Airport timezone (e.g. Europe/London). */
	timezone: z.string().optional(),
	/** Minimum airport elevation in feet. */
	min_elevation: z.number().optional(),
	/** Maximum airport elevation in feet. */
	max_elevation: z.number().optional(),
	/** Airport size. Must be one of: large, medium, small. */
	size: z.string().optional(),
	/** Filter by whether the airport has an IATA code. true returns only IATA-coded airports; false returns only those without. */
	has_iata: z.boolean().optional(),
	/** Minimum length (in feet) of at least one runway at the airport. */
	min_runway_length: z.number().optional(),
	/** Facility type (more granular than size). Must be one of: large_airport, medium_airport, small_airport, heliport, seaplane_base, balloonport, closed. */
	type: z.string().optional(),
	/** Filter by whether the airport has scheduled airline service. true or false. */
	scheduled_service: z.boolean().optional(),
	/** Continent code. Must be one of: AF, AN, AS, EU, NA, OC, SA. */
	continent: z.string().optional(),
	/** Filter to airports having at least one runway of the given surface category. Must be one of: paved, unpaved, water, unknown. */
	surface: z.string().optional(),
	/** Filter by whether the airport has at least one lighted runway. true or false. */
	has_lights: z.boolean().optional(),
	/** Free-text search across airport name, city, codes, and alternate-name keywords. */
	q: z.string().optional(),
	/** Set to true to include permanently closed airports. Closed airports are excluded by default. */
	include_closed: z.boolean().optional(),
	/** Maximum number of results to return. Must be between 1 and 100. Default is 10. */
	limit: z.number().optional(),
	/** Sort order for results. Must be one of: passengers (default), name, elevation, runway_length, longest_runway, num_runways. */
	sort: z.string().optional(),
	/** Sort direction. Must be asc or desc. Default is desc. */
	order: z.string().optional(),
	/** Number of results to offset for pagination. */
	offset: z.number().optional(),
});

const TransportAirportsOutputSchema = z.array(
	z
		.object({
			icao: z.string().nullable().optional(),
			ident: z.string().nullable().optional(),
			iata: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			region: z.string().nullable().optional(),
			region_code: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			country_name: z.string().nullable().optional(),
			continent: z.string().nullable().optional(),
			elevation_ft: z.number().nullable().optional(),
			elevation_m: z.number().nullable().optional(),
			latitude: z.number().nullable().optional(),
			longitude: z.number().nullable().optional(),
			timezone: z.string().nullable().optional(),
			type: z.string().nullable().optional(),
			size: z.string().nullable().optional(),
			scheduled_service: z.boolean().nullable().optional(),
			is_closed: z.boolean().nullable().optional(),
			gps_code: z.string().nullable().optional(),
			local_code: z.string().nullable().optional(),
			home_link: z.string().nullable().optional(),
			wikipedia_link: z.string().nullable().optional(),
			keywords: z.array(z.string()).nullable().optional(),
			num_runways: z.number().nullable().optional(),
			longest_runway_ft: z.number().nullable().optional(),
			runways: z
				.array(
					z
						.object({
							length: z.number().nullable().optional(),
							width: z.number().nullable().optional(),
							has_lights: z.boolean().nullable().optional(),
							surface: z.string().nullable().optional(),
							surface_category: z.string().nullable().optional(),
							closed: z.boolean().nullable().optional(),
							le_ident: z.string().nullable().optional(),
							he_ident: z.string().nullable().optional(),
							le_heading_deg: z.number().nullable().optional(),
							he_heading_deg: z.number().nullable().optional(),
						})
						.loose(),
				)
				.nullable()
				.optional(),
			estimated_annual_passengers: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * Get helicopter technical specifications that match the given parameters.
 *
 * GET v1/helicopter
 */
const TransportHelicoptersInputSchema = z.object({
	/** Company that designed and built the helicopter. */
	manufacturer: z.string().optional(),
	/** Helicopter model name. */
	model: z.string().optional(),
	/** Minimum max. air speed in knots. */
	min_speed: z.number().optional(),
	/** Maximum max. air speed in knots. */
	max_speed: z.number().optional(),
	/** Minimum range of the helicopter in nautical miles. */
	min_range: z.number().optional(),
	/** Maximum range of the helicopter in nautical miles. */
	max_range: z.number().optional(),
	/** Minimum length of the helicopter in feet. */
	min_length: z.number().optional(),
	/** Maximum length of the helicopter in feet. */
	max_length: z.number().optional(),
	/** Minimum height of the helicopter in feet. */
	min_height: z.number().optional(),
	/** Maximum height of the helicopter in feet. */
	max_height: z.number().optional(),
	/** How many results to return. Must be between 1 and 30. Default is 1. */
	limit: z.number().optional(),
});

const TransportHelicoptersOutputSchema = z.array(
	z
		.object({
			manufacturer: z.string().nullable().optional(),
			model: z.string().nullable().optional(),
			max_speed_sl_knots: z.string().nullable().optional(),
			cruise_speed_sl_knots: z.string().nullable().optional(),
			vne_speed_knots: z.string().nullable().optional(),
			range_nautical_miles: z.string().nullable().optional(),
			fuel_consumption_gallons_pr_hr: z.string().nullable().optional(),
			fuel_capacity_gallons: z.string().nullable().optional(),
			fuel_opt_gallons: z.string().nullable().optional(),
			gross_external_load_lbs: z.string().nullable().optional(),
			external_load_limit_lbs: z.string().nullable().optional(),
			main_rotor_diameter_ft: z.string().nullable().optional(),
			num_blades: z.string().nullable().optional(),
			blade_material: z.string().nullable().optional(),
			storage_width_ft: z.string().nullable().optional(),
			length_ft: z.string().nullable().optional(),
			height_ft: z.string().nullable().optional(),
			/** Cruise time in minutes. */
			cruise_time_min: z.union([z.number(), z.string()]).nullable().optional(),
			/** Type of rotor system. */
			rotor_type: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Get car data from given parameters. Returns a list of car models (and their information) that satisfy the parameters.
 *
 * GET v1/cars
 */
const TransportCarsInputSchema = z.object({
	/** Vehicle manufacturer (e.g. audi). */
	make: z.string().optional(),
	/** Vehicle model (e.g. a4). You can find the list of models by calling the /v1/carmodels endpoint. */
	model: z.string(),
	/** Vehicle trim (e.g. 1.6 AT (101 hp)). You can find the list of trims by calling the /v1/cartrims endpoint. */
	trim: z.string().optional(),
});

const TransportCarsOutputSchema = z.array(
	z
		.object({
			city_mpg: z.union([z.number(), z.string()]).nullable().optional(),
			class: z.string().nullable().optional(),
			combination_mpg: z.union([z.number(), z.string()]).nullable().optional(),
			cylinders: z.number().nullable().optional(),
			displacement: z.number().nullable().optional(),
			drive: z.string().nullable().optional(),
			fuel_type: z.string().nullable().optional(),
			highway_mpg: z.union([z.number(), z.string()]).nullable().optional(),
			make: z.string().nullable().optional(),
			model: z.string().nullable().optional(),
			transmission: z.string().nullable().optional(),
			year: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns up to 30 motorcycle results matching the input name parameters. For searches that yield more than 30 results, please use the offset parameter.
 *
 * GET v1/motorcycles
 */
const TransportMotorcyclesInputSchema = z.object({
	/** Name of manufacturer/brand. Supports partial matching (e.g. Harley will match Harley-Davidson). */
	make: z.string().optional(),
	/** Name of motorcycle model. Supports partial matching (e.g. Ninja will match Ninja 650). */
	model: z.string().optional(),
	/** Release year of motorcycle model. Must be in the form of YYYY (e.g. 2022). */
	year: z.number().optional(),
	/** Number of results to offset for pagination. Default is 0. [premium] */
	offset: z.number().optional(),
});

const TransportMotorcyclesOutputSchema = z.array(
	z
		.object({
			make: z.string().nullable().optional(),
			model: z.string().nullable().optional(),
			year: z.string().nullable().optional(),
			type: z.string().nullable().optional(),
			displacement: z.string().nullable().optional(),
			engine: z.string().nullable().optional(),
			compression: z.string().nullable().optional(),
			bore_stroke: z.string().nullable().optional(),
			valves_per_cylinder: z.string().nullable().optional(),
			fuel_system: z.string().nullable().optional(),
			fuel_control: z.string().nullable().optional(),
			lubrication: z.string().nullable().optional(),
			cooling: z.string().nullable().optional(),
			gearbox: z.string().nullable().optional(),
			transmission: z.string().nullable().optional(),
			clutch: z.string().nullable().optional(),
			frame: z.string().nullable().optional(),
			front_suspension: z.string().nullable().optional(),
			front_wheel_travel: z.string().nullable().optional(),
			rear_suspension: z.string().nullable().optional(),
			rear_wheel_travel: z.string().nullable().optional(),
			front_tire: z.string().nullable().optional(),
			rear_tire: z.string().nullable().optional(),
			front_brakes: z.string().nullable().optional(),
			rear_brakes: z.string().nullable().optional(),
			seat_height: z.string().nullable().optional(),
			ground_clearance: z.string().nullable().optional(),
			wheelbase: z.string().nullable().optional(),
			fuel_capacity: z.string().nullable().optional(),
			starter: z.string().nullable().optional(),
			power: z.string().nullable().optional(),
			torque: z.string().nullable().optional(),
			top_speed: z.string().nullable().optional(),
			fuel_consumption: z.string().nullable().optional(),
			emission: z.string().nullable().optional(),
			total_weight: z.string().nullable().optional(),
			total_height: z.string().nullable().optional(),
			total_length: z.string().nullable().optional(),
			total_width: z.string().nullable().optional(),
			ignition: z.string().nullable().optional(),
			dry_weight: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Get electric vehicle data from given parameters. Returns a list of electric vehicles that satisfy the parameters.
 *
 * GET v1/electricvehicle
 */
const TransportElectricVehiclesInputSchema = z.object({
	/** Vehicle manufacturer (e.g. tesla or nissan). */
	make: z.string().optional(),
	/** Vehicle model. Supports partial matching (e.g. Model matches Model 3, Model Y, etc.). */
	model: z.string().optional(),
	/** Minimum vehicle model year (e.g. 2020). */
	min_year: z.number().optional(),
	/** Maximum vehicle model year (e.g. 2023). */
	max_year: z.number().optional(),
	/** Minimum range in kilometers (e.g. 250). */
	min_range: z.number().optional(),
	/** Maximum range in kilometers (e.g. 400). */
	max_range: z.number().optional(),
	/** How many results to return. Must be between 1 and 10. Default is 1. [premium] */
	limit: z.number().optional(),
	/** Number of results to skip. Used for pagination. Default is 0. [premium] */
	offset: z.number().optional(),
});

const TransportElectricVehiclesOutputSchema = z.array(
	z
		.object({
			make: z.string().nullable().optional(),
			model: z.string().nullable().optional(),
			year_start: z.string().nullable().optional(),
			battery_capacity: z.string().nullable().optional(),
			battery_type: z.string().nullable().optional(),
			battery_number_of_cells: z.string().nullable().optional(),
			battery_architecture: z.string().nullable().optional(),
			battery_useable_capacity: z.string().nullable().optional(),
			battery_cathode_material: z.string().nullable().optional(),
			battery_pack_configuration: z.string().nullable().optional(),
			battery_voltage: z.string().nullable().optional(),
			battery_form_factor: z.string().nullable().optional(),
			battery_name: z.string().nullable().optional(),
			charge_port: z.string().nullable().optional(),
			charge_port_location: z.string().nullable().optional(),
			charge_power: z.string().nullable().optional(),
			charge_speed: z.string().nullable().optional(),
			charge_power_max: z.string().nullable().optional(),
			charge_power_10p_80p: z.string().nullable().optional(),
			autocharge_supported: z.string().nullable().optional(),
			plug_charge_supported: z.string().nullable().optional(),
			supported_charging_protocol: z.string().nullable().optional(),
			preconditioning_possible: z.string().nullable().optional(),
			acceleration_0_100_kmh: z.string().nullable().optional(),
			top_speed: z.string().nullable().optional(),
			electric_range: z.union([z.number(), z.string()]).nullable().optional(),
			total_power: z.string().nullable().optional(),
			total_torque: z.string().nullable().optional(),
			drive: z.string().nullable().optional(),
			vehicle_consumption: z.string().nullable().optional(),
			co2_emissions: z.string().nullable().optional(),
			vehicle_fuel_equivalent: z.string().nullable().optional(),
			rated_consumption: z.string().nullable().optional(),
			rated_fuel_equivalent: z.string().nullable().optional(),
			length: z.string().nullable().optional(),
			width: z.string().nullable().optional(),
			width_with_mirrors: z.string().nullable().optional(),
			height: z.string().nullable().optional(),
			wheelbase: z.string().nullable().optional(),
			gross_vehicle_weight: z.string().nullable().optional(),
			max_payload: z.string().nullable().optional(),
			cargo_volume: z.string().nullable().optional(),
			cargo_volume_frunk: z.string().nullable().optional(),
			seats: z.string().nullable().optional(),
			turning_circle: z.string().nullable().optional(),
			platform: z.string().nullable().optional(),
			car_body: z.string().nullable().optional(),
			segment: z.string().nullable().optional(),
			/** Exterior dimensions in millimeters. */
			'length, width, height': z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns key vehicle information including manufacturer, country of origin, and model year for a given VIN.
 *
 * GET v1/vinlookup
 */
const TransportVinInputSchema = z.object({
	/** Valid VIN to check. Must be a 17-character string. */
	vin: z.string(),
});

const TransportVinOutputSchema = z
	.object({
		vin: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		manufacturer: z.string().nullable().optional(),
		model: z.string().nullable().optional(),
		class: z.string().nullable().optional(),
		region: z.string().nullable().optional(),
		wmi: z.string().nullable().optional(),
		vds: z.string().nullable().optional(),
		vis: z.string().nullable().optional(),
		year: z.number().nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/* health                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Returns the calories burned per hour and total calories burned according to given parameters for given activities (up to 10).
 *
 * GET v1/caloriesburned
 */
const HealthCaloriesBurnedInputSchema = z.object({
	/** Name of the given activity. This value can be partial (e.g. ski will match water skiing and downhill skiing). */
	activity: z.string(),
	/** Weight of the user performing the activity in pounds. Must be between 50 and 500. Default value is 160. */
	weight: z.number().optional(),
	/** How long the activity was performed in minutes. Must be 1 or greater. Default value is 60 (1 hour). */
	duration: z.number().optional(),
});

const HealthCaloriesBurnedOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			calories_per_hour: z.number().nullable().optional(),
			duration_minutes: z.number().nullable().optional(),
			total_calories: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * This endpoint uses AI to automatically read any text and extract every food item it contains, along with the right portion for each. It can process multiple food items at once - simply copy and paste any text, such as a recipe or your food journal, directly, and it will return the nutrition data for every food item found. Items without a specified amount default to a 100g serving.
 *
 * GET v1/nutrition
 */
const HealthNutritionInputSchema = z.object({
	/** Query text to extract nutrition information. If your query contains commas, make sure they are URL encoded properly (e.g., %2C) - otherwise the server will fail to receive the correct input. */
	query: z.string(),
});

/** Declared from the documentation: this endpoint is premium-gated, so no free-tier response could be captured. */
const HealthNutritionOutputSchema = z.array(
	z
		.object({
			/** Nutritional energy in calories. */
			calories: z.union([z.number(), z.string()]).nullable().optional(),
			/** Serving size in grams. */
			serving_size_g: z.union([z.number(), z.string()]).nullable().optional(),
			/** Total combined fat (including saturated and trans fats) in grams. */
			fat_total_g: z.union([z.number(), z.string()]).nullable().optional(),
			/** Saturated fat in grams. */
			fat_saturated_g: z.union([z.number(), z.string()]).nullable().optional(),
			/** Trans fat in grams. */
			fat_trans_g: z.union([z.number(), z.string()]).nullable().optional(),
			/** Protein in grams. */
			protein_g: z.union([z.number(), z.string()]).nullable().optional(),
			/** Sodium in milligrams. */
			sodium_mg: z.union([z.number(), z.string()]).nullable().optional(),
			/** Potassium in milligrams. */
			potassium_mg: z.union([z.number(), z.string()]).nullable().optional(),
			/** Cholesterol in milligrams. */
			cholesterol_mg: z.union([z.number(), z.string()]).nullable().optional(),
			/** Total carbohydrates (including fiber and sugar) in grams. */
			carbohydrates_total_g: z
				.union([z.number(), z.string()])
				.nullable()
				.optional(),
			/** Fiber in grams. */
			fiber_g: z.union([z.number(), z.string()]).nullable().optional(),
			/** Sugar in grams. */
			sugar_g: z.union([z.number(), z.string()]).nullable().optional(),
			/** Added sugars in grams. */
			added_sugars_g: z.union([z.number(), z.string()]).nullable().optional(),
			/** Net carbohydrates (total carbohydrates minus fiber) in grams. */
			net_carbs_g: z.union([z.number(), z.string()]).nullable().optional(),
			/** Iron in milligrams. */
			iron_mg: z.union([z.number(), z.string()]).nullable().optional(),
			/** Calcium in milligrams. */
			calcium_mg: z.union([z.number(), z.string()]).nullable().optional(),
			/** Magnesium in milligrams. */
			magnesium_mg: z.union([z.number(), z.string()]).nullable().optional(),
			/** Zinc in milligrams. */
			zinc_mg: z.union([z.number(), z.string()]).nullable().optional(),
			/** Vitamin A in micrograms (RAE). */
			vitamin_a_mcg: z.string().nullable().optional(),
			/** Vitamin C in milligrams. */
			vitamin_c_mg: z.union([z.number(), z.string()]).nullable().optional(),
			/** Vitamin D in micrograms. */
			vitamin_d_mcg: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns up to 5 exercises that satisfy the given parameters.
 *
 * GET v1/exercises
 */
/**
 * Show Available Values
 *
 * Documented as a parameter combination, so every field is optional here and
 * the provider validates the combination.
 */
const HealthExercisesInputSchema = z.object({
	/** Name of exercise. This value can be partial (e.g. press will match Dumbbell Bench Press). */
	name: z.string().optional(),
	/** Exercise type. Possible values are: cardio, olympic_weightlifting, plyometrics, powerlifting, strength, stretching, strongman. */
	type: z.string().optional(),
	/** Muscle group targeted by the exercise. Possible values are: */
	muscle: z.string().optional(),
	/** Difficulty level of the exercise. Possible values are: beginner, intermediate, expert. */
	difficulty: z.string().optional(),
	/** Equipment required for the exercise. Multiple equipments can be specified using comma separation (e.g. dumbbell,flat bench). This value can be partial (e.g. dumbbell will match exercises using dumbbells). */
	equipments: z.string().optional(),
	/** Number of results to offset for pagination. Default is 0. [premium] */
	offset: z.number().optional(),
});

const HealthExercisesOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			type: z.string().nullable().optional(),
			muscle: z.string().nullable().optional(),
			difficulty: z.string().nullable().optional(),
			instructions: z.string().nullable().optional(),
			equipments: z.array(z.string()).nullable().optional(),
			safety_info: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Get a list of recipes for a given recipe name or ingredient(s). Returns a list of recipes. To access more results, use the limit parameter to limit the number of results and the offset parameter to offset results for pagination in multiple API calls.
 *
 * GET v3/recipe
 */
const HealthRecipesInputSchema = z.object({
	/** Recipe title to search for. */
	title: z.string().optional(),
	/** Comma-separated list of ingredients to search for. */
	ingredients: z.string().optional(),
	/** Number of results to return. Must be between 1 and 10. If not set, a default value of 1 will be used. */
	limit: z.number().optional(),
	/** Number of results to offset for pagination. */
	offset: z.number().optional(),
});

const HealthRecipesOutputSchema = z.array(
	z
		.object({
			title: z.string().nullable().optional(),
			ingredients: z
				.array(
					z
						.object({
							name: z.string().nullable().optional(),
							quantity: z.number().nullable().optional(),
							unit: z.string().nullable().optional(),
						})
						.loose(),
				)
				.nullable()
				.optional(),
			servings: z.string().nullable().optional(),
			instructions: z.array(z.string()).nullable().optional(),
			nutrition: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns up to 10 cocktail recipes matching the search parameters.
 *
 * GET v1/cocktail
 */
const HealthCocktailsInputSchema = z.object({
	/** Name of cocktail. This parameter supports partial matches (e.g. bloody will match bloody mary and bloody margarita). */
	name: z.string().optional(),
	/** Comma-separated string of ingredients to search. Only cocktails containing all listed ingredients will be returned. For example, to search cocktails containing Vodka and lemon juice, use vodka,lemon juice. */
	ingredients: z.string().optional(),
});

const HealthCocktailsOutputSchema = z.array(
	z
		.object({
			ingredients: z.array(z.string()).nullable().optional(),
			instructions: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
		})
		.loose(),
);

/* -------------------------------------------------------------------------- */
/* reference                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Returns up to 10 results matching the input name parameter.
 *
 * GET v1/animals
 */
const ReferenceAnimalsInputSchema = z.object({
	/** Common name of animal to search. This parameter supports partial matches (e.g. fox will match gray fox and red fox). */
	name: z.string(),
});

const ReferenceAnimalsOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			taxonomy: z
				.object({
					kingdom: z.string().nullable().optional(),
					phylum: z.string().nullable().optional(),
					class: z.string().nullable().optional(),
					order: z.string().nullable().optional(),
					family: z.string().nullable().optional(),
					genus: z.string().nullable().optional(),
					scientific_name: z.string().nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
			locations: z.array(z.string()).nullable().optional(),
			characteristics: z
				.object({
					prey: z.string().nullable().optional(),
					name_of_young: z.string().nullable().optional(),
					group_behavior: z.string().nullable().optional(),
					estimated_population_size: z.string().nullable().optional(),
					biggest_threat: z.string().nullable().optional(),
					most_distinctive_feature: z.string().nullable().optional(),
					gestation_period: z.string().nullable().optional(),
					habitat: z.string().nullable().optional(),
					diet: z.string().nullable().optional(),
					average_litter_size: z.string().nullable().optional(),
					lifestyle: z.string().nullable().optional(),
					common_name: z.string().nullable().optional(),
					number_of_species: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					slogan: z.string().nullable().optional(),
					group: z.string().nullable().optional(),
					color: z.string().nullable().optional(),
					skin_type: z.string().nullable().optional(),
					top_speed: z.string().nullable().optional(),
					lifespan: z.string().nullable().optional(),
					weight: z.string().nullable().optional(),
					height: z.string().nullable().optional(),
					age_of_sexual_maturity: z.string().nullable().optional(),
					age_of_weaning: z.string().nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
		})
		.loose(),
);

/**
 * Get a list of cat breeds matching specified parameters. Returns at most 20 results. To access more than 20 results, use the offset parameter to offset results in multiple API calls.
 *
 * GET v1/cats
 */
const ReferenceCatsInputSchema = z.object({
	/** The name of cat breed. */
	name: z.string().optional(),
	/** Minimum weight in pounds. */
	min_weight: z.number().optional(),
	/** Maximum weight in pounds. */
	max_weight: z.number().optional(),
	/** Minimum life expectancy in years. */
	min_life_expectancy: z.number().optional(),
	/** Maximum life expectancy in years. */
	max_life_expectancy: z.number().optional(),
	/** How much hair the cat sheds. Possible values: 1, 2, 3, 4, 5, where 1 indicates no shedding and 5 indicates maximum shedding. */
	shedding: z.string().optional(),
	/** How affectionate the cat is to family. Possible values: 1, 2, 3, 4, 5, where 1 indicates minimal affection and 5 indicates maximum affection. */
	family_friendly: z.string().optional(),
	/** How playful the cat is. Possible values: 1, 2, 3, 4, 5, where 1 indicates serious and stern and 5 indicates maximum playfulness. */
	playfulness: z.string().optional(),
	/** How much work is required to properly groom the cat. Possible values: 1, 2, 3, 4, 5, where 1 indicates maximum grooming effort and 5 indicates minimum grooming effort. */
	grooming: z.string().optional(),
	/** How well the cat gets along with other pets in the household (for example, dogs). Possible values: 1, 2, 3, 4, 5, where 1 indicates the cat isn't very friendly to other pets and 5 indicates the cat gets along very well with other pets. */
	other_pets_friendly: z.string().optional(),
	/** How well the cat gets along with children. Possible values: 1, 2, 3, 4, 5, where 1 indicates the cat does not get along well with kids and 5 indicates the cat is very kid-friendly. */
	children_friendly: z.string().optional(),
	/** Number of results to offset for pagination. */
	offset: z.number().optional(),
});

const ReferenceCatsOutputSchema = z.array(
	z
		.object({
			length: z.string().nullable().optional(),
			origin: z.string().nullable().optional(),
			image_link: z.string().nullable().optional(),
			family_friendly: z.number().nullable().optional(),
			shedding: z.number().nullable().optional(),
			general_health: z.number().nullable().optional(),
			playfulness: z.number().nullable().optional(),
			meowing: z.number().nullable().optional(),
			children_friendly: z.number().nullable().optional(),
			stranger_friendly: z.number().nullable().optional(),
			grooming: z.number().nullable().optional(),
			intelligence: z.number().nullable().optional(),
			other_pets_friendly: z.number().nullable().optional(),
			min_weight: z.number().nullable().optional(),
			max_weight: z.number().nullable().optional(),
			min_life_expectancy: z.number().nullable().optional(),
			max_life_expectancy: z.number().nullable().optional(),
			name: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Get a list of dog breeds matching specified parameters. Returns at most 20 results. To access more than 20 results, use the offset parameter to offset results in multiple API calls.
 *
 * GET v1/dogs
 */
const ReferenceDogsInputSchema = z.object({
	/** The name of breed. */
	name: z.string().optional(),
	/** Minimum height in inches. */
	min_height: z.number().optional(),
	/** Maximum height in inches. */
	max_height: z.number().optional(),
	/** Minimum weight in pounds. */
	min_weight: z.number().optional(),
	/** Maximum weight in pounds. */
	max_weight: z.number().optional(),
	/** Minimum life expectancy in years. */
	min_life_expectancy: z.number().optional(),
	/** Maximum life expectancy in years. */
	max_life_expectancy: z.number().optional(),
	/** How much hair the breed sheds. Possible values: 1, 2, 3, 4, 5, where 1 indicates no shedding and 5 indicates maximum shedding. */
	shedding: z.string().optional(),
	/** How vocal the breed is. Possible values: 1, 2, 3, 4, 5, where 1 indicates minimal barking and 5 indicates maximum barking. */
	barking: z.string().optional(),
	/** How much energy the breed has. Possible values: 1, 2, 3, 4, 5, where 1 indicates low energy and 5 indicates high energy. */
	energy: z.string().optional(),
	/** How likely the breed is to alert strangers. Possible values: 1, 2, 3, 4, 5, where 1 indicates minimal alerting and 5 indicates maximum alerting. */
	protectiveness: z.string().optional(),
	/** How easy it is to train the breed. Possible values: 1, 2, 3, 4, 5, where 1 indicates the breed is very difficult to train and 5 indicates the breed is very easy to train. */
	trainability: z.string().optional(),
	/** Number of results to offset for pagination. */
	offset: z.number().optional(),
});

const ReferenceDogsOutputSchema = z.array(
	z
		.object({
			image_link: z.string().nullable().optional(),
			good_with_children: z.number().nullable().optional(),
			good_with_other_dogs: z.number().nullable().optional(),
			shedding: z.number().nullable().optional(),
			grooming: z.number().nullable().optional(),
			drooling: z.number().nullable().optional(),
			coat_length: z.number().nullable().optional(),
			good_with_strangers: z.number().nullable().optional(),
			playfulness: z.number().nullable().optional(),
			protectiveness: z.number().nullable().optional(),
			trainability: z.number().nullable().optional(),
			energy: z.number().nullable().optional(),
			barking: z.number().nullable().optional(),
			min_life_expectancy: z.number().nullable().optional(),
			max_life_expectancy: z.number().nullable().optional(),
			max_height_male: z.number().nullable().optional(),
			max_height_female: z.number().nullable().optional(),
			max_weight_male: z.number().nullable().optional(),
			max_weight_female: z.number().nullable().optional(),
			min_height_male: z.number().nullable().optional(),
			min_height_female: z.number().nullable().optional(),
			min_weight_male: z.number().nullable().optional(),
			min_weight_female: z.number().nullable().optional(),
			name: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Get a list of planets matching specified parameters. Returns at most 30 results. To access more than 30 results, use the offset parameter to offset results in multiple API calls.
 *
 * GET v1/planets
 */
const ReferencePlanetsInputSchema = z.object({
	/** The name of the planet. */
	name: z.string().optional(),
	/** Minimum mass of the planet in Jupiters (1 Jupiter = 1.898 1027 kg). */
	min_mass: z.number().optional(),
	/** Maximum mass of the planet in Jupiters (1 Jupiter = 1.898 1027 kg). */
	max_mass: z.number().optional(),
	/** Minimum average radius of the planet in Jupiters (1 Jupiter = 69911 km). */
	min_radius: z.number().optional(),
	/** Maximum average radius of the planet in Jupiters (1 Jupiter = 69911 km). */
	max_radius: z.number().optional(),
	/** Minimum orbital period of the planet in Earth days. */
	min_period: z.number().optional(),
	/** Maximum orbital period of the planet in Earth days. */
	max_period: z.number().optional(),
	/** Minimum average surface temperature of the planet in Kelvin. */
	min_temperature: z.number().optional(),
	/** Maximum average surface temperature of the planet in Kelvin. */
	max_temperature: z.number().optional(),
	/** Minimum distance the planet is from Earth in light years. */
	min_distance_light_year: z.number().optional(),
	/** Maximum distance the planet is from Earth in light years. */
	max_distance_light_year: z.number().optional(),
	/** Minimum semi major axis of planet in astronomical units (AU). */
	min_semi_major_axis: z.number().optional(),
	/** Maximum semi major axis of planet in astronomical units (AU). */
	max_semi_major_axis: z.number().optional(),
	/** Number of results to offset for pagination. */
	offset: z.number().optional(),
});

const ReferencePlanetsOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			mass: z.number().nullable().optional(),
			radius: z.number().nullable().optional(),
			period: z.number().nullable().optional(),
			semi_major_axis: z.number().nullable().optional(),
			temperature: z.number().nullable().optional(),
			distance_light_year: z.number().nullable().optional(),
			host_star_mass: z.number().nullable().optional(),
			host_star_temperature: z.number().nullable().optional(),
		})
		.loose(),
);

/**
 * Get a list of stars matching specified parameters. Returns at most 30 results. To access more than 30 results, use the offset parameter to offset results in multiple API calls.
 *
 * GET v1/stars
 */
const ReferenceStarsInputSchema = z.object({
	/** The name of the star. Note that many of the star names contain Greek characters. */
	name: z.string().optional(),
	/** The constellation that the star belongs to. */
	constellation: z.string().optional(),
	/** Minimum apparent magnitude brightness of the star. */
	min_apparent_magnitude: z.number().optional(),
	/** Maximum apparent magnitude brightness of the star. */
	max_apparent_magnitude: z.number().optional(),
	/** Minimum absolute magnitude brightness of the star. */
	min_absolute_magnitude: z.number().optional(),
	/** Maximum absolute magnitude brightness of the star. */
	max_absolute_magnitude: z.number().optional(),
	/** Minimum distance the star is from Earth in light years. */
	min_distance_light_year: z.number().optional(),
	/** Maximum distance the star is from Earth in light years. */
	max_distance_light_year: z.number().optional(),
	/** Number of results to offset for pagination. */
	offset: z.number().optional(),
});

const ReferenceStarsOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			constellation: z.string().nullable().optional(),
			right_ascension: z.string().nullable().optional(),
			declination: z.string().nullable().optional(),
			apparent_magnitude: z.string().nullable().optional(),
			absolute_magnitude: z.string().nullable().optional(),
			distance_light_year: z.string().nullable().optional(),
			spectral_class: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of up to 10 events that match the search parameters. Use the offset parameter to paginate through more results.
 *
 * GET v1/historicalevents
 */
const ReferenceHistoricalEventsInputSchema = z.object({
	/** Query text to search events by. Use keywords or short phrases for best match results. */
	text: z.string().optional(),
	/** 4-digit year (e.g. 1776). For BC/BCE years, use a negative integer (e.g. -351 for 351 BC). */
	year: z.number().optional(),
	/** Integer month (e.g. 3 for March). */
	month: z.number().optional(),
	/** Calendar day of the month. */
	day: z.number().optional(),
	/** Number of results to offset pagination. [premium] */
	offset: z.number().optional(),
});

const ReferenceHistoricalEventsOutputSchema = z.array(
	z
		.object({
			year: z.string().nullable().optional(),
			month: z.string().nullable().optional(),
			day: z.string().nullable().optional(),
			event: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of up to 10 people that match the search parameters.
 *
 * GET v1/historicalfigures
 */
const ReferenceHistoricalFiguresInputSchema = z.object({
	/** Name of the person to search. Includes partial results (e.g. julius will match Julius Caesar). */
	name: z.string(),
	/** Number of results to offset pagination. */
	offset: z.number().optional(),
});

const ReferenceHistoricalFiguresOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			title: z.string().nullable().optional(),
			info: z
				.object({
					born: z.string().nullable().optional(),
					died: z.string().nullable().optional(),
					rank: z
						.union([z.array(z.unknown()), z.string()])
						.nullable()
						.optional(),
					unit: z.array(z.string()).nullable().optional(),
					house: z.string().nullable().optional(),
					issue: z.string().nullable().optional(),
					reign: z.string().nullable().optional(),
					burial: z.string().nullable().optional(),
					father: z.string().nullable().optional(),
					mother: z.string().nullable().optional(),
					spouse: z
						.union([z.array(z.unknown()), z.string()])
						.nullable()
						.optional(),
					religion: z.string().nullable().optional(),
					successor: z.string().nullable().optional(),
					allegiance: z.string().nullable().optional(),
					preceded_by: z.string().nullable().optional(),
					predecessor: z.string().nullable().optional(),
					'battles/wars': z.array(z.string()).nullable().optional(),
					succeeded_by: z.string().nullable().optional(),
					prime_minister: z.string().nullable().optional(),
					'service/branch': z
						.union([z.array(z.unknown()), z.string()])
						.nullable()
						.optional(),
					vice_president: z.string().nullable().optional(),
					years_of_service: z.string().nullable().optional(),
					in_office: z.string().nullable().optional(),
					coronation: z.string().nullable().optional(),
					issuedetail: z.string().nullable().optional(),
					regent: z.string().nullable().optional(),
					genre: z.string().nullable().optional(),
					period: z.string().nullable().optional(),
					children: z.string().nullable().optional(),
					occupation: z.string().nullable().optional(),
					citizenship: z.string().nullable().optional(),
					notable_works: z.string().nullable().optional(),
					commands_held: z.string().nullable().optional(),
					genres: z.string().nullable().optional(),
					labels: z.string().nullable().optional(),
					birth_name: z.string().nullable().optional(),
					instruments: z.string().nullable().optional(),
					years_active: z.string().nullable().optional(),
					also_known_as: z.string().nullable().optional(),
				})
				.loose()
				.nullable()
				.optional(),
		})
		.loose(),
);

/**
 * Returns historical events that occurred on a specific date. If no date parameters are provided, returns events for today's date.
 *
 * GET v1/dayinhistory
 */
const ReferenceDayInHistoryInputSchema = z.object({
	/** The month of the historical events to retrieve. Must be between 1 and 12. If specified, day must also be provided. If both are omitted, today's date is used. [premium] */
	month: z.number().optional(),
	/** The day of the month for the historical events to retrieve. Must be between 1 and 31. If specified, month must also be provided. If both are omitted, today's date is used. [premium] */
	day: z.number().optional(),
	/** The number of results to skip. Must be zero or a positive integer. Default is 0. [premium] */
	offset: z.number().optional(),
	/** The maximum number of results to return. Must be between 1 and 30. Default is 1. [premium] */
	limit: z.number().optional(),
});

const ReferenceDayInHistoryOutputSchema = z.array(
	z
		.object({
			year: z.number().nullable().optional(),
			month: z.number().nullable().optional(),
			day: z.number().nullable().optional(),
			event: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a list of up to 30 celebrities that match the search parameters. To get more than 30 results, use the offset parameter.
 *
 * GET v1/celebrity
 */
const ReferenceCelebritiesInputSchema = z.object({
	/** Name of the celebrity you wish to search. This field is case-insensitive. */
	name: z.string().optional(),
	/** Minimum net worth of celebrities. */
	min_net_worth: z.number().optional(),
	/** Maximum net worth of celebrities. */
	max_net_worth: z.number().optional(),
	/** Nationality of celebrities. Must be an ISO 3166 Alpha-2 country code (e.g. US). */
	nationality: z.string().optional(),
	/** Minimum height of celebrities in meters (e.g. 1.65). */
	min_height: z.number().optional(),
	/** Maximum height of celebrities in meters (e.g. 1.80). */
	max_height: z.number().optional(),
	/** Number of results to offset for pagination. [premium] */
	offset: z.number().optional(),
});

const ReferenceCelebritiesOutputSchema = z.array(
	z
		.object({
			name: z.string().nullable().optional(),
			net_worth: z.number().nullable().optional(),
			gender: z.string().nullable().optional(),
			nationality: z.string().nullable().optional(),
			occupation: z.array(z.string()).nullable().optional(),
			height: z.number().nullable().optional(),
			birthday: z.string().nullable().optional(),
			age: z.number().nullable().optional(),
			is_alive: z.boolean().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns 10 baby name results.
 *
 * GET v1/babynames
 */
const ReferenceBabyNamesInputSchema = z.object({
	/** Baby name gender. Must be one of the following: boy, girl, neutral */
	gender: z.string().optional(),
	/** Whether to only return popular (top 10%) of names. Must be either true or false. If unset, default is true. */
	popular_only: z.boolean().optional(),
});

const ReferenceBabyNamesOutputSchema = z.array(z.string());

/* -------------------------------------------------------------------------- */
/* entertainment                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Returns one (or more) random funny jokes. Free users have access to 100 jokes - premium users have access to over 20,000 jokes.
 *
 * GET v1/jokes
 */
const EntertainmentJokesInputSchema = z.object({
	/** How many jokes to return. Must be between 1 and 100. Default is 1. [premium] */
	limit: z.number().optional(),
});

const EntertainmentJokesOutputSchema = z.array(
	z
		.object({
			joke: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns one (or more) random dad jokes. Free users have access to 100 jokes - premium users have access to over 15,000 dad jokes.
 *
 * GET v1/dadjokes
 */
const EntertainmentDadJokesInputSchema = z.object({
	/** How many jokes to return. Must be between 1 and 100. Default is 1. [premium] */
	limit: z.number().optional(),
});

const EntertainmentDadJokesOutputSchema = z.array(
	z
		.object({
			joke: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a Chuck Norris joke.
 *
 * GET v1/chucknorris
 */
const EntertainmentChuckNorrisInputSchema = z.object({});

const EntertainmentChuckNorrisOutputSchema = z
	.object({
		joke: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns a single joke for the current day. The same joke is returned for all requests on the same day, and changes each day. Perfect for displaying on your website or app. No parameters are available for this endpoint to ensure everyone sees the same joke of the day.
 *
 * GET v1/jokeoftheday
 */
const EntertainmentJokeOfTheDayInputSchema = z.object({});

const EntertainmentJokeOfTheDayOutputSchema = z.array(
	z
		.object({
			joke: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns one (or more) random facts. Free users have access to 100 facts - premium users have access to over 500,000 facts.
 *
 * GET v1/facts
 */
const EntertainmentFactsInputSchema = z.object({
	/** How many results to return. Must be between 1 and 100. Default is 1. [premium] */
	limit: z.number().optional(),
});

const EntertainmentFactsOutputSchema = z.array(
	z
		.object({
			fact: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a single fact for the current day. The same fact is returned for all requests on the same day, and changes each day. Perfect for displaying on your website or app. No parameters are available for this endpoint to ensure everyone sees the same fact of the day.
 *
 * GET v1/factoftheday
 */
const EntertainmentFactOfTheDayInputSchema = z.object({});

const EntertainmentFactOfTheDayOutputSchema = z.array(
	z
		.object({
			fact: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns high-quality quotes with advanced filtering by categories (include/exclude), author, work, and pagination support. Returns quotes in deterministic order. For random quotes, use /v2/randomquotes or /v2/quoteoftheday.
 *
 * GET v2/quotes
 */
const EntertainmentQuotesInputSchema = z.object({
	/** Comma-separated list of categories to include in results (results will match all of the categories). Example: categories=wisdom,success */
	categories: z.string().optional(),
	/** Comma-separated list of categories to exclude from results (results will not match any of the categories). Example: exclude_categories=love,philosophy */
	exclude_categories: z.string().optional(),
	/** Filter quotes by author name (partial match supported). Example: author=Einstein */
	author: z.string().optional(),
	/** Filter quotes by work title (partial match supported). Example: work=War */
	work: z.string().optional(),
	/** Number of results to return. Must be between 1 and 100. Default is 1. [premium] */
	limit: z.number().optional(),
	/** Number of results to skip for pagination. Default is 0. [premium] */
	offset: z.number().optional(),
});

const EntertainmentQuotesOutputSchema = z.array(
	z
		.object({
			quote: z.string().nullable().optional(),
			author: z.string().nullable().optional(),
			work: z.string().nullable().optional(),
			categories: z.array(z.string()).nullable().optional(),
		})
		.loose(),
);

/**
 * Returns random high-quality quotes with advanced filtering by categories (include/exclude), author, and work. Each request returns different random quotes.
 *
 * GET v2/randomquotes
 */
const EntertainmentRandomQuotesInputSchema = z.object({
	/** Comma-separated list of categories to include in results (results will match all of the categories). Example: categories=wisdom,success */
	categories: z.string().optional(),
	/** Comma-separated list of categories to exclude from results (results will not match any of the categories). Example: exclude_categories=love,philosophy */
	exclude_categories: z.string().optional(),
	/** Filter quotes by author name (partial match supported). Example: author=Einstein */
	author: z.string().optional(),
	/** Filter quotes by work title (partial match supported). Example: work=War */
	work: z.string().optional(),
	/** Number of random results to return. Must be between 1 and 100. Default is 1. [premium] */
	limit: z.number().optional(),
});

const EntertainmentRandomQuotesOutputSchema = z.array(
	z
		.object({
			quote: z.string().nullable().optional(),
			author: z.string().nullable().optional(),
			work: z.string().nullable().optional(),
			categories: z.array(z.string()).nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a single aphoristic quote for the current day. The same pre-vetted, high-quality quote is returned for all requests on the same day, and changes each day. Perfect for displaying on your website or app. No filtering parameters are available for this endpoint to ensure everyone sees the same quote of the day.
 *
 * GET v2/quoteoftheday
 */
const EntertainmentQuoteOfTheDayInputSchema = z.object({});

const EntertainmentQuoteOfTheDayOutputSchema = z.array(
	z
		.object({
			quote: z.string().nullable().optional(),
			author: z.string().nullable().optional(),
			work: z.string().nullable().optional(),
			categories: z.array(z.string()).nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a random piece of life advice.
 *
 * GET v1/advice
 */
const EntertainmentAdviceInputSchema = z.object({});

const EntertainmentAdviceOutputSchema = z
	.object({
		advice: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns a random bucket list idea.
 *
 * GET v1/bucketlist
 */
const EntertainmentBucketListInputSchema = z.object({});

const EntertainmentBucketListOutputSchema = z
	.object({
		item: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns a random hobby and a Wikipedia link detailing the hobby.
 *
 * GET v1/hobbies
 */
const EntertainmentHobbiesInputSchema = z.object({
	/** Possible values are: general, sports_and_outdoors, education, collection, competition, observation. */
	category: z.string().optional(),
});

const EntertainmentHobbiesOutputSchema = z
	.object({
		hobby: z.string().nullable().optional(),
		link: z.string().nullable().optional(),
		category: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns the daily horoscope for a specific zodiac sign. Optionally, you can provide a date parameter to get historical horoscopes.
 *
 * GET v1/horoscope
 */
const EntertainmentHoroscopeInputSchema = z.object({
	/** The zodiac sign to get a horoscope for. Valid values are: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces. */
	zodiac: z.string(),
	/** The date for the horoscope in YYYY-MM-DD format. The date must be either current or in the past. It cannot be in the future. If not provided, returns the horoscope for today's date. [premium] */
	date: z.string().optional(),
});

const EntertainmentHoroscopeOutputSchema = z
	.object({
		date: z.string().nullable().optional(),
		sign: z.string().nullable().optional(),
		horoscope: z.string().nullable().optional(),
	})
	.loose();

/**
 * Returns one or more random riddles.
 *
 * GET v1/riddles
 */
const EntertainmentRiddlesInputSchema = z.object({
	/** Number of results to return. Must be between 1 and 20. Default is 1. [premium] */
	limit: z.number().optional(),
});

const EntertainmentRiddlesOutputSchema = z.array(
	z
		.object({
			title: z.string().nullable().optional(),
			question: z.string().nullable().optional(),
			answer: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a random trivia question and answer. Free users have access to 100 trivia questions - premium users have access to over 100,000 trivia questions.
 *
 * GET v1/trivia
 */
const EntertainmentTriviaInputSchema = z.object({
	/** Category of trivia. The possible values are: [premium] */
	category: z.string().optional(),
	/** How many results to return. Must be between 1 and 30. Default is 1. [premium] */
	limit: z.number().optional(),
});

const EntertainmentTriviaOutputSchema = z.array(
	z
		.object({
			category: z.string().nullable().optional(),
			question: z.string().nullable().optional(),
			answer: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Returns a single trivia question and answer for the current day. The same question is returned for all requests on the same day, and changes each day. Perfect for displaying on your website or app. No filtering parameters are available for this endpoint to ensure everyone sees the same trivia of the day.
 *
 * GET v1/triviaoftheday
 */
const EntertainmentTriviaOfTheDayInputSchema = z.object({});

const EntertainmentTriviaOfTheDayOutputSchema = z.array(
	z
		.object({
			category: z.string().nullable().optional(),
			question: z.string().nullable().optional(),
			answer: z.string().nullable().optional(),
		})
		.loose(),
);

/**
 * Generate a new Sudoku puzzle with specified parameters.
 *
 * GET v1/sudokugenerate
 */
const EntertainmentGenerateSudokuInputSchema = z.object({
	/** Width of each box in the Sudoku grid. Default is 3. Must be between 2 and 4. */
	width: z.number().optional(),
	/** Height of each box in the Sudoku grid. Default is 3. Must be between 2 and 4. */
	height: z.number().optional(),
	/** Difficulty level of the puzzle. Possible values: easy, medium, hard. Default is medium. */
	difficulty: z.string().optional(),
	/** Seed value for reproducible puzzle generation. */
	seed: z.string().optional(),
});

const EntertainmentGenerateSudokuOutputSchema = z
	.object({
		puzzle: z.array(z.array(z.number().nullable())).nullable().optional(),
		solution: z.array(z.array(z.number().nullable())).nullable().optional(),
	})
	.loose();

/**
 * Solve an existing Sudoku puzzle.
 *
 * GET v1/sudokusolve
 */
const EntertainmentSolveSudokuInputSchema = z.object({
	/** 2D JSON array representing the Sudoku puzzle. Use 0 for empty cells. */
	puzzle: z.array(z.array(z.number())),
	/** Width of each box in the Sudoku grid. Must be between 2 and 4. */
	width: z.number(),
	/** Height of each box in the Sudoku grid. Must be between 2 and 4. */
	height: z.number(),
});

const EntertainmentSolveSudokuOutputSchema = z
	.object({
		status: z.string().nullable().optional(),
		solution: z.array(z.array(z.number().nullable())).nullable().optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/* registry                                                                   */
/* -------------------------------------------------------------------------- */

export const ApiNinjasEndpointInputSchemas = {
	locationGeocode: LocationGeocodeInputSchema,
	locationReverseGeocode: LocationReverseGeocodeInputSchema,
	locationCities: LocationCitiesInputSchema,
	locationCountry: LocationCountryInputSchema,
	locationCounty: LocationCountyInputSchema,
	locationZipCode: LocationZipCodeInputSchema,
	locationPostalCode: LocationPostalCodeInputSchema,
	locationUniversities: LocationUniversitiesInputSchema,
	locationHospitals: LocationHospitalsInputSchema,
	locationEvChargers: LocationEvChargersInputSchema,
	locationWeather: LocationWeatherInputSchema,
	locationWeatherForecast: LocationWeatherForecastInputSchema,
	locationAirQuality: LocationAirQualityInputSchema,
	calendarTimezone: CalendarTimezoneInputSchema,
	calendarWorldTime: CalendarWorldTimeInputSchema,
	calendarHolidays: CalendarHolidaysInputSchema,
	calendarPublicHolidays: CalendarPublicHolidaysInputSchema,
	calendarIsPublicHoliday: CalendarIsPublicHolidayInputSchema,
	calendarIsWorkingDay: CalendarIsWorkingDayInputSchema,
	calendarWorkingDays: CalendarWorkingDaysInputSchema,
	internetDomain: InternetDomainInputSchema,
	internetDnsRecords: InternetDnsRecordsInputSchema,
	internetMxRecords: InternetMxRecordsInputSchema,
	internetWhois: InternetWhoisInputSchema,
	internetIpLookup: InternetIpLookupInputSchema,
	internetUrlLookup: InternetUrlLookupInputSchema,
	internetWebpage: InternetWebpageInputSchema,
	internetScrape: InternetScrapeInputSchema,
	internetUserAgent: InternetUserAgentInputSchema,
	validationEmail: ValidationEmailInputSchema,
	validationDisposableEmail: ValidationDisposableEmailInputSchema,
	validationPhone: ValidationPhoneInputSchema,
	validationRoutingNumber: ValidationRoutingNumberInputSchema,
	validationIban: ValidationIbanInputSchema,
	validationBin: ValidationBinInputSchema,
	validationSwiftCode: ValidationSwiftCodeInputSchema,
	marketsStockPrice: MarketsStockPriceInputSchema,
	marketsTicker: MarketsTickerInputSchema,
	marketsTickerList: MarketsTickerListInputSchema,
	marketsStockExchanges: MarketsStockExchangesInputSchema,
	marketsSp500: MarketsSp500InputSchema,
	marketsMarketCap: MarketsMarketCapInputSchema,
	marketsEarnings: MarketsEarningsInputSchema,
	marketsEarningsCalendar: MarketsEarningsCalendarInputSchema,
	marketsEarningsTranscript: MarketsEarningsTranscriptInputSchema,
	marketsInsiderTransactions: MarketsInsiderTransactionsInputSchema,
	marketsSecFilings: MarketsSecFilingsInputSchema,
	marketsEtf: MarketsEtfInputSchema,
	marketsMutualFund: MarketsMutualFundInputSchema,
	marketsCryptoPrice: MarketsCryptoPriceInputSchema,
	marketsBitcoin: MarketsBitcoinInputSchema,
	marketsCommodityPrice: MarketsCommodityPriceInputSchema,
	marketsConvertCurrency: MarketsConvertCurrencyInputSchema,
	marketsExchangeRate: MarketsExchangeRateInputSchema,
	economicsGdp: EconomicsGdpInputSchema,
	economicsInflation: EconomicsInflationInputSchema,
	economicsUnemployment: EconomicsUnemploymentInputSchema,
	economicsPopulation: EconomicsPopulationInputSchema,
	economicsInterestRate: EconomicsInterestRateInputSchema,
	economicsMortgageRate: EconomicsMortgageRateInputSchema,
	economicsMortgageCalculator: EconomicsMortgageCalculatorInputSchema,
	economicsIncomeTax: EconomicsIncomeTaxInputSchema,
	economicsIncomeTaxCalculator: EconomicsIncomeTaxCalculatorInputSchema,
	economicsSalesTax: EconomicsSalesTaxInputSchema,
	economicsSalesTaxCalculator: EconomicsSalesTaxCalculatorInputSchema,
	economicsPropertyTax: EconomicsPropertyTaxInputSchema,
	economicsVatRates: EconomicsVatRatesInputSchema,
	textSentiment: TextSentimentInputSchema,
	textSimilarity: TextSimilarityInputSchema,
	textEmbeddings: TextEmbeddingsInputSchema,
	textLanguage: TextLanguageInputSchema,
	textSpellCheck: TextSpellCheckInputSchema,
	textProfanityFilter: TextProfanityFilterInputSchema,
	textDictionary: TextDictionaryInputSchema,
	textThesaurus: TextThesaurusInputSchema,
	textRhymes: TextRhymesInputSchema,
	textRandomWord: TextRandomWordInputSchema,
	textLoremIpsum: TextLoremIpsumInputSchema,
	utilityQrCode: UtilityQrCodeInputSchema,
	utilityBarcode: UtilityBarcodeInputSchema,
	utilityPassword: UtilityPasswordInputSchema,
	utilityRandomUser: UtilityRandomUserInputSchema,
	utilityCounter: UtilityCounterInputSchema,
	utilityConvertUnit: UtilityConvertUnitInputSchema,
	utilityLogo: UtilityLogoInputSchema,
	utilityCountryFlag: UtilityCountryFlagInputSchema,
	utilityRandomImage: UtilityRandomImageInputSchema,
	utilityEmoji: UtilityEmojiInputSchema,
	transportAircraft: TransportAircraftInputSchema,
	transportAirlines: TransportAirlinesInputSchema,
	transportAirports: TransportAirportsInputSchema,
	transportHelicopters: TransportHelicoptersInputSchema,
	transportCars: TransportCarsInputSchema,
	transportMotorcycles: TransportMotorcyclesInputSchema,
	transportElectricVehicles: TransportElectricVehiclesInputSchema,
	transportVin: TransportVinInputSchema,
	healthCaloriesBurned: HealthCaloriesBurnedInputSchema,
	healthNutrition: HealthNutritionInputSchema,
	healthExercises: HealthExercisesInputSchema,
	healthRecipes: HealthRecipesInputSchema,
	healthCocktails: HealthCocktailsInputSchema,
	referenceAnimals: ReferenceAnimalsInputSchema,
	referenceCats: ReferenceCatsInputSchema,
	referenceDogs: ReferenceDogsInputSchema,
	referencePlanets: ReferencePlanetsInputSchema,
	referenceStars: ReferenceStarsInputSchema,
	referenceHistoricalEvents: ReferenceHistoricalEventsInputSchema,
	referenceHistoricalFigures: ReferenceHistoricalFiguresInputSchema,
	referenceDayInHistory: ReferenceDayInHistoryInputSchema,
	referenceCelebrities: ReferenceCelebritiesInputSchema,
	referenceBabyNames: ReferenceBabyNamesInputSchema,
	entertainmentJokes: EntertainmentJokesInputSchema,
	entertainmentDadJokes: EntertainmentDadJokesInputSchema,
	entertainmentChuckNorris: EntertainmentChuckNorrisInputSchema,
	entertainmentJokeOfTheDay: EntertainmentJokeOfTheDayInputSchema,
	entertainmentFacts: EntertainmentFactsInputSchema,
	entertainmentFactOfTheDay: EntertainmentFactOfTheDayInputSchema,
	entertainmentQuotes: EntertainmentQuotesInputSchema,
	entertainmentRandomQuotes: EntertainmentRandomQuotesInputSchema,
	entertainmentQuoteOfTheDay: EntertainmentQuoteOfTheDayInputSchema,
	entertainmentAdvice: EntertainmentAdviceInputSchema,
	entertainmentBucketList: EntertainmentBucketListInputSchema,
	entertainmentHobbies: EntertainmentHobbiesInputSchema,
	entertainmentHoroscope: EntertainmentHoroscopeInputSchema,
	entertainmentRiddles: EntertainmentRiddlesInputSchema,
	entertainmentTrivia: EntertainmentTriviaInputSchema,
	entertainmentTriviaOfTheDay: EntertainmentTriviaOfTheDayInputSchema,
	entertainmentGenerateSudoku: EntertainmentGenerateSudokuInputSchema,
	entertainmentSolveSudoku: EntertainmentSolveSudokuInputSchema,
} as const;

export const ApiNinjasEndpointOutputSchemas = {
	locationGeocode: LocationGeocodeOutputSchema,
	locationReverseGeocode: LocationReverseGeocodeOutputSchema,
	locationCities: LocationCitiesOutputSchema,
	locationCountry: LocationCountryOutputSchema,
	locationCounty: LocationCountyOutputSchema,
	locationZipCode: LocationZipCodeOutputSchema,
	locationPostalCode: LocationPostalCodeOutputSchema,
	locationUniversities: LocationUniversitiesOutputSchema,
	locationHospitals: LocationHospitalsOutputSchema,
	locationEvChargers: LocationEvChargersOutputSchema,
	locationWeather: LocationWeatherOutputSchema,
	locationWeatherForecast: LocationWeatherForecastOutputSchema,
	locationAirQuality: LocationAirQualityOutputSchema,
	calendarTimezone: CalendarTimezoneOutputSchema,
	calendarWorldTime: CalendarWorldTimeOutputSchema,
	calendarHolidays: CalendarHolidaysOutputSchema,
	calendarPublicHolidays: CalendarPublicHolidaysOutputSchema,
	calendarIsPublicHoliday: CalendarIsPublicHolidayOutputSchema,
	calendarIsWorkingDay: CalendarIsWorkingDayOutputSchema,
	calendarWorkingDays: CalendarWorkingDaysOutputSchema,
	internetDomain: InternetDomainOutputSchema,
	internetDnsRecords: InternetDnsRecordsOutputSchema,
	internetMxRecords: InternetMxRecordsOutputSchema,
	internetWhois: InternetWhoisOutputSchema,
	internetIpLookup: InternetIpLookupOutputSchema,
	internetUrlLookup: InternetUrlLookupOutputSchema,
	internetWebpage: InternetWebpageOutputSchema,
	internetScrape: InternetScrapeOutputSchema,
	internetUserAgent: InternetUserAgentOutputSchema,
	validationEmail: ValidationEmailOutputSchema,
	validationDisposableEmail: ValidationDisposableEmailOutputSchema,
	validationPhone: ValidationPhoneOutputSchema,
	validationRoutingNumber: ValidationRoutingNumberOutputSchema,
	validationIban: ValidationIbanOutputSchema,
	validationBin: ValidationBinOutputSchema,
	validationSwiftCode: ValidationSwiftCodeOutputSchema,
	marketsStockPrice: MarketsStockPriceOutputSchema,
	marketsTicker: MarketsTickerOutputSchema,
	marketsTickerList: MarketsTickerListOutputSchema,
	marketsStockExchanges: MarketsStockExchangesOutputSchema,
	marketsSp500: MarketsSp500OutputSchema,
	marketsMarketCap: MarketsMarketCapOutputSchema,
	marketsEarnings: MarketsEarningsOutputSchema,
	marketsEarningsCalendar: MarketsEarningsCalendarOutputSchema,
	marketsEarningsTranscript: MarketsEarningsTranscriptOutputSchema,
	marketsInsiderTransactions: MarketsInsiderTransactionsOutputSchema,
	marketsSecFilings: MarketsSecFilingsOutputSchema,
	marketsEtf: MarketsEtfOutputSchema,
	marketsMutualFund: MarketsMutualFundOutputSchema,
	marketsCryptoPrice: MarketsCryptoPriceOutputSchema,
	marketsBitcoin: MarketsBitcoinOutputSchema,
	marketsCommodityPrice: MarketsCommodityPriceOutputSchema,
	marketsConvertCurrency: MarketsConvertCurrencyOutputSchema,
	marketsExchangeRate: MarketsExchangeRateOutputSchema,
	economicsGdp: EconomicsGdpOutputSchema,
	economicsInflation: EconomicsInflationOutputSchema,
	economicsUnemployment: EconomicsUnemploymentOutputSchema,
	economicsPopulation: EconomicsPopulationOutputSchema,
	economicsInterestRate: EconomicsInterestRateOutputSchema,
	economicsMortgageRate: EconomicsMortgageRateOutputSchema,
	economicsMortgageCalculator: EconomicsMortgageCalculatorOutputSchema,
	economicsIncomeTax: EconomicsIncomeTaxOutputSchema,
	economicsIncomeTaxCalculator: EconomicsIncomeTaxCalculatorOutputSchema,
	economicsSalesTax: EconomicsSalesTaxOutputSchema,
	economicsSalesTaxCalculator: EconomicsSalesTaxCalculatorOutputSchema,
	economicsPropertyTax: EconomicsPropertyTaxOutputSchema,
	economicsVatRates: EconomicsVatRatesOutputSchema,
	textSentiment: TextSentimentOutputSchema,
	textSimilarity: TextSimilarityOutputSchema,
	textEmbeddings: TextEmbeddingsOutputSchema,
	textLanguage: TextLanguageOutputSchema,
	textSpellCheck: TextSpellCheckOutputSchema,
	textProfanityFilter: TextProfanityFilterOutputSchema,
	textDictionary: TextDictionaryOutputSchema,
	textThesaurus: TextThesaurusOutputSchema,
	textRhymes: TextRhymesOutputSchema,
	textRandomWord: TextRandomWordOutputSchema,
	textLoremIpsum: TextLoremIpsumOutputSchema,
	utilityQrCode: UtilityQrCodeOutputSchema,
	utilityBarcode: UtilityBarcodeOutputSchema,
	utilityPassword: UtilityPasswordOutputSchema,
	utilityRandomUser: UtilityRandomUserOutputSchema,
	utilityCounter: UtilityCounterOutputSchema,
	utilityConvertUnit: UtilityConvertUnitOutputSchema,
	utilityLogo: UtilityLogoOutputSchema,
	utilityCountryFlag: UtilityCountryFlagOutputSchema,
	utilityRandomImage: UtilityRandomImageOutputSchema,
	utilityEmoji: UtilityEmojiOutputSchema,
	transportAircraft: TransportAircraftOutputSchema,
	transportAirlines: TransportAirlinesOutputSchema,
	transportAirports: TransportAirportsOutputSchema,
	transportHelicopters: TransportHelicoptersOutputSchema,
	transportCars: TransportCarsOutputSchema,
	transportMotorcycles: TransportMotorcyclesOutputSchema,
	transportElectricVehicles: TransportElectricVehiclesOutputSchema,
	transportVin: TransportVinOutputSchema,
	healthCaloriesBurned: HealthCaloriesBurnedOutputSchema,
	healthNutrition: HealthNutritionOutputSchema,
	healthExercises: HealthExercisesOutputSchema,
	healthRecipes: HealthRecipesOutputSchema,
	healthCocktails: HealthCocktailsOutputSchema,
	referenceAnimals: ReferenceAnimalsOutputSchema,
	referenceCats: ReferenceCatsOutputSchema,
	referenceDogs: ReferenceDogsOutputSchema,
	referencePlanets: ReferencePlanetsOutputSchema,
	referenceStars: ReferenceStarsOutputSchema,
	referenceHistoricalEvents: ReferenceHistoricalEventsOutputSchema,
	referenceHistoricalFigures: ReferenceHistoricalFiguresOutputSchema,
	referenceDayInHistory: ReferenceDayInHistoryOutputSchema,
	referenceCelebrities: ReferenceCelebritiesOutputSchema,
	referenceBabyNames: ReferenceBabyNamesOutputSchema,
	entertainmentJokes: EntertainmentJokesOutputSchema,
	entertainmentDadJokes: EntertainmentDadJokesOutputSchema,
	entertainmentChuckNorris: EntertainmentChuckNorrisOutputSchema,
	entertainmentJokeOfTheDay: EntertainmentJokeOfTheDayOutputSchema,
	entertainmentFacts: EntertainmentFactsOutputSchema,
	entertainmentFactOfTheDay: EntertainmentFactOfTheDayOutputSchema,
	entertainmentQuotes: EntertainmentQuotesOutputSchema,
	entertainmentRandomQuotes: EntertainmentRandomQuotesOutputSchema,
	entertainmentQuoteOfTheDay: EntertainmentQuoteOfTheDayOutputSchema,
	entertainmentAdvice: EntertainmentAdviceOutputSchema,
	entertainmentBucketList: EntertainmentBucketListOutputSchema,
	entertainmentHobbies: EntertainmentHobbiesOutputSchema,
	entertainmentHoroscope: EntertainmentHoroscopeOutputSchema,
	entertainmentRiddles: EntertainmentRiddlesOutputSchema,
	entertainmentTrivia: EntertainmentTriviaOutputSchema,
	entertainmentTriviaOfTheDay: EntertainmentTriviaOfTheDayOutputSchema,
	entertainmentGenerateSudoku: EntertainmentGenerateSudokuOutputSchema,
	entertainmentSolveSudoku: EntertainmentSolveSudokuOutputSchema,
} as const;

export type ApiNinjasEndpointInputs = {
	locationGeocode: z.infer<typeof LocationGeocodeInputSchema>;
	locationReverseGeocode: z.infer<typeof LocationReverseGeocodeInputSchema>;
	locationCities: z.infer<typeof LocationCitiesInputSchema>;
	locationCountry: z.infer<typeof LocationCountryInputSchema>;
	locationCounty: z.infer<typeof LocationCountyInputSchema>;
	locationZipCode: z.infer<typeof LocationZipCodeInputSchema>;
	locationPostalCode: z.infer<typeof LocationPostalCodeInputSchema>;
	locationUniversities: z.infer<typeof LocationUniversitiesInputSchema>;
	locationHospitals: z.infer<typeof LocationHospitalsInputSchema>;
	locationEvChargers: z.infer<typeof LocationEvChargersInputSchema>;
	locationWeather: z.infer<typeof LocationWeatherInputSchema>;
	locationWeatherForecast: z.infer<typeof LocationWeatherForecastInputSchema>;
	locationAirQuality: z.infer<typeof LocationAirQualityInputSchema>;
	calendarTimezone: z.infer<typeof CalendarTimezoneInputSchema>;
	calendarWorldTime: z.infer<typeof CalendarWorldTimeInputSchema>;
	calendarHolidays: z.infer<typeof CalendarHolidaysInputSchema>;
	calendarPublicHolidays: z.infer<typeof CalendarPublicHolidaysInputSchema>;
	calendarIsPublicHoliday: z.infer<typeof CalendarIsPublicHolidayInputSchema>;
	calendarIsWorkingDay: z.infer<typeof CalendarIsWorkingDayInputSchema>;
	calendarWorkingDays: z.infer<typeof CalendarWorkingDaysInputSchema>;
	internetDomain: z.infer<typeof InternetDomainInputSchema>;
	internetDnsRecords: z.infer<typeof InternetDnsRecordsInputSchema>;
	internetMxRecords: z.infer<typeof InternetMxRecordsInputSchema>;
	internetWhois: z.infer<typeof InternetWhoisInputSchema>;
	internetIpLookup: z.infer<typeof InternetIpLookupInputSchema>;
	internetUrlLookup: z.infer<typeof InternetUrlLookupInputSchema>;
	internetWebpage: z.infer<typeof InternetWebpageInputSchema>;
	internetScrape: z.infer<typeof InternetScrapeInputSchema>;
	internetUserAgent: z.infer<typeof InternetUserAgentInputSchema>;
	validationEmail: z.infer<typeof ValidationEmailInputSchema>;
	validationDisposableEmail: z.infer<
		typeof ValidationDisposableEmailInputSchema
	>;
	validationPhone: z.infer<typeof ValidationPhoneInputSchema>;
	validationRoutingNumber: z.infer<typeof ValidationRoutingNumberInputSchema>;
	validationIban: z.infer<typeof ValidationIbanInputSchema>;
	validationBin: z.infer<typeof ValidationBinInputSchema>;
	validationSwiftCode: z.infer<typeof ValidationSwiftCodeInputSchema>;
	marketsStockPrice: z.infer<typeof MarketsStockPriceInputSchema>;
	marketsTicker: z.infer<typeof MarketsTickerInputSchema>;
	marketsTickerList: z.infer<typeof MarketsTickerListInputSchema>;
	marketsStockExchanges: z.infer<typeof MarketsStockExchangesInputSchema>;
	marketsSp500: z.infer<typeof MarketsSp500InputSchema>;
	marketsMarketCap: z.infer<typeof MarketsMarketCapInputSchema>;
	marketsEarnings: z.infer<typeof MarketsEarningsInputSchema>;
	marketsEarningsCalendar: z.infer<typeof MarketsEarningsCalendarInputSchema>;
	marketsEarningsTranscript: z.infer<
		typeof MarketsEarningsTranscriptInputSchema
	>;
	marketsInsiderTransactions: z.infer<
		typeof MarketsInsiderTransactionsInputSchema
	>;
	marketsSecFilings: z.infer<typeof MarketsSecFilingsInputSchema>;
	marketsEtf: z.infer<typeof MarketsEtfInputSchema>;
	marketsMutualFund: z.infer<typeof MarketsMutualFundInputSchema>;
	marketsCryptoPrice: z.infer<typeof MarketsCryptoPriceInputSchema>;
	marketsBitcoin: z.infer<typeof MarketsBitcoinInputSchema>;
	marketsCommodityPrice: z.infer<typeof MarketsCommodityPriceInputSchema>;
	marketsConvertCurrency: z.infer<typeof MarketsConvertCurrencyInputSchema>;
	marketsExchangeRate: z.infer<typeof MarketsExchangeRateInputSchema>;
	economicsGdp: z.infer<typeof EconomicsGdpInputSchema>;
	economicsInflation: z.infer<typeof EconomicsInflationInputSchema>;
	economicsUnemployment: z.infer<typeof EconomicsUnemploymentInputSchema>;
	economicsPopulation: z.infer<typeof EconomicsPopulationInputSchema>;
	economicsInterestRate: z.infer<typeof EconomicsInterestRateInputSchema>;
	economicsMortgageRate: z.infer<typeof EconomicsMortgageRateInputSchema>;
	economicsMortgageCalculator: z.infer<
		typeof EconomicsMortgageCalculatorInputSchema
	>;
	economicsIncomeTax: z.infer<typeof EconomicsIncomeTaxInputSchema>;
	economicsIncomeTaxCalculator: z.infer<
		typeof EconomicsIncomeTaxCalculatorInputSchema
	>;
	economicsSalesTax: z.infer<typeof EconomicsSalesTaxInputSchema>;
	economicsSalesTaxCalculator: z.infer<
		typeof EconomicsSalesTaxCalculatorInputSchema
	>;
	economicsPropertyTax: z.infer<typeof EconomicsPropertyTaxInputSchema>;
	economicsVatRates: z.infer<typeof EconomicsVatRatesInputSchema>;
	textSentiment: z.infer<typeof TextSentimentInputSchema>;
	textSimilarity: z.infer<typeof TextSimilarityInputSchema>;
	textEmbeddings: z.infer<typeof TextEmbeddingsInputSchema>;
	textLanguage: z.infer<typeof TextLanguageInputSchema>;
	textSpellCheck: z.infer<typeof TextSpellCheckInputSchema>;
	textProfanityFilter: z.infer<typeof TextProfanityFilterInputSchema>;
	textDictionary: z.infer<typeof TextDictionaryInputSchema>;
	textThesaurus: z.infer<typeof TextThesaurusInputSchema>;
	textRhymes: z.infer<typeof TextRhymesInputSchema>;
	textRandomWord: z.infer<typeof TextRandomWordInputSchema>;
	textLoremIpsum: z.infer<typeof TextLoremIpsumInputSchema>;
	utilityQrCode: z.infer<typeof UtilityQrCodeInputSchema>;
	utilityBarcode: z.infer<typeof UtilityBarcodeInputSchema>;
	utilityPassword: z.infer<typeof UtilityPasswordInputSchema>;
	utilityRandomUser: z.infer<typeof UtilityRandomUserInputSchema>;
	utilityCounter: z.infer<typeof UtilityCounterInputSchema>;
	utilityConvertUnit: z.infer<typeof UtilityConvertUnitInputSchema>;
	utilityLogo: z.infer<typeof UtilityLogoInputSchema>;
	utilityCountryFlag: z.infer<typeof UtilityCountryFlagInputSchema>;
	utilityRandomImage: z.infer<typeof UtilityRandomImageInputSchema>;
	utilityEmoji: z.infer<typeof UtilityEmojiInputSchema>;
	transportAircraft: z.infer<typeof TransportAircraftInputSchema>;
	transportAirlines: z.infer<typeof TransportAirlinesInputSchema>;
	transportAirports: z.infer<typeof TransportAirportsInputSchema>;
	transportHelicopters: z.infer<typeof TransportHelicoptersInputSchema>;
	transportCars: z.infer<typeof TransportCarsInputSchema>;
	transportMotorcycles: z.infer<typeof TransportMotorcyclesInputSchema>;
	transportElectricVehicles: z.infer<
		typeof TransportElectricVehiclesInputSchema
	>;
	transportVin: z.infer<typeof TransportVinInputSchema>;
	healthCaloriesBurned: z.infer<typeof HealthCaloriesBurnedInputSchema>;
	healthNutrition: z.infer<typeof HealthNutritionInputSchema>;
	healthExercises: z.infer<typeof HealthExercisesInputSchema>;
	healthRecipes: z.infer<typeof HealthRecipesInputSchema>;
	healthCocktails: z.infer<typeof HealthCocktailsInputSchema>;
	referenceAnimals: z.infer<typeof ReferenceAnimalsInputSchema>;
	referenceCats: z.infer<typeof ReferenceCatsInputSchema>;
	referenceDogs: z.infer<typeof ReferenceDogsInputSchema>;
	referencePlanets: z.infer<typeof ReferencePlanetsInputSchema>;
	referenceStars: z.infer<typeof ReferenceStarsInputSchema>;
	referenceHistoricalEvents: z.infer<
		typeof ReferenceHistoricalEventsInputSchema
	>;
	referenceHistoricalFigures: z.infer<
		typeof ReferenceHistoricalFiguresInputSchema
	>;
	referenceDayInHistory: z.infer<typeof ReferenceDayInHistoryInputSchema>;
	referenceCelebrities: z.infer<typeof ReferenceCelebritiesInputSchema>;
	referenceBabyNames: z.infer<typeof ReferenceBabyNamesInputSchema>;
	entertainmentJokes: z.infer<typeof EntertainmentJokesInputSchema>;
	entertainmentDadJokes: z.infer<typeof EntertainmentDadJokesInputSchema>;
	entertainmentChuckNorris: z.infer<typeof EntertainmentChuckNorrisInputSchema>;
	entertainmentJokeOfTheDay: z.infer<
		typeof EntertainmentJokeOfTheDayInputSchema
	>;
	entertainmentFacts: z.infer<typeof EntertainmentFactsInputSchema>;
	entertainmentFactOfTheDay: z.infer<
		typeof EntertainmentFactOfTheDayInputSchema
	>;
	entertainmentQuotes: z.infer<typeof EntertainmentQuotesInputSchema>;
	entertainmentRandomQuotes: z.infer<
		typeof EntertainmentRandomQuotesInputSchema
	>;
	entertainmentQuoteOfTheDay: z.infer<
		typeof EntertainmentQuoteOfTheDayInputSchema
	>;
	entertainmentAdvice: z.infer<typeof EntertainmentAdviceInputSchema>;
	entertainmentBucketList: z.infer<typeof EntertainmentBucketListInputSchema>;
	entertainmentHobbies: z.infer<typeof EntertainmentHobbiesInputSchema>;
	entertainmentHoroscope: z.infer<typeof EntertainmentHoroscopeInputSchema>;
	entertainmentRiddles: z.infer<typeof EntertainmentRiddlesInputSchema>;
	entertainmentTrivia: z.infer<typeof EntertainmentTriviaInputSchema>;
	entertainmentTriviaOfTheDay: z.infer<
		typeof EntertainmentTriviaOfTheDayInputSchema
	>;
	entertainmentGenerateSudoku: z.infer<
		typeof EntertainmentGenerateSudokuInputSchema
	>;
	entertainmentSolveSudoku: z.infer<typeof EntertainmentSolveSudokuInputSchema>;
};

export type ApiNinjasEndpointOutputs = {
	locationGeocode: z.infer<typeof LocationGeocodeOutputSchema>;
	locationReverseGeocode: z.infer<typeof LocationReverseGeocodeOutputSchema>;
	locationCities: z.infer<typeof LocationCitiesOutputSchema>;
	locationCountry: z.infer<typeof LocationCountryOutputSchema>;
	locationCounty: z.infer<typeof LocationCountyOutputSchema>;
	locationZipCode: z.infer<typeof LocationZipCodeOutputSchema>;
	locationPostalCode: z.infer<typeof LocationPostalCodeOutputSchema>;
	locationUniversities: z.infer<typeof LocationUniversitiesOutputSchema>;
	locationHospitals: z.infer<typeof LocationHospitalsOutputSchema>;
	locationEvChargers: z.infer<typeof LocationEvChargersOutputSchema>;
	locationWeather: z.infer<typeof LocationWeatherOutputSchema>;
	locationWeatherForecast: z.infer<typeof LocationWeatherForecastOutputSchema>;
	locationAirQuality: z.infer<typeof LocationAirQualityOutputSchema>;
	calendarTimezone: z.infer<typeof CalendarTimezoneOutputSchema>;
	calendarWorldTime: z.infer<typeof CalendarWorldTimeOutputSchema>;
	calendarHolidays: z.infer<typeof CalendarHolidaysOutputSchema>;
	calendarPublicHolidays: z.infer<typeof CalendarPublicHolidaysOutputSchema>;
	calendarIsPublicHoliday: z.infer<typeof CalendarIsPublicHolidayOutputSchema>;
	calendarIsWorkingDay: z.infer<typeof CalendarIsWorkingDayOutputSchema>;
	calendarWorkingDays: z.infer<typeof CalendarWorkingDaysOutputSchema>;
	internetDomain: z.infer<typeof InternetDomainOutputSchema>;
	internetDnsRecords: z.infer<typeof InternetDnsRecordsOutputSchema>;
	internetMxRecords: z.infer<typeof InternetMxRecordsOutputSchema>;
	internetWhois: z.infer<typeof InternetWhoisOutputSchema>;
	internetIpLookup: z.infer<typeof InternetIpLookupOutputSchema>;
	internetUrlLookup: z.infer<typeof InternetUrlLookupOutputSchema>;
	internetWebpage: z.infer<typeof InternetWebpageOutputSchema>;
	internetScrape: z.infer<typeof InternetScrapeOutputSchema>;
	internetUserAgent: z.infer<typeof InternetUserAgentOutputSchema>;
	validationEmail: z.infer<typeof ValidationEmailOutputSchema>;
	validationDisposableEmail: z.infer<
		typeof ValidationDisposableEmailOutputSchema
	>;
	validationPhone: z.infer<typeof ValidationPhoneOutputSchema>;
	validationRoutingNumber: z.infer<typeof ValidationRoutingNumberOutputSchema>;
	validationIban: z.infer<typeof ValidationIbanOutputSchema>;
	validationBin: z.infer<typeof ValidationBinOutputSchema>;
	validationSwiftCode: z.infer<typeof ValidationSwiftCodeOutputSchema>;
	marketsStockPrice: z.infer<typeof MarketsStockPriceOutputSchema>;
	marketsTicker: z.infer<typeof MarketsTickerOutputSchema>;
	marketsTickerList: z.infer<typeof MarketsTickerListOutputSchema>;
	marketsStockExchanges: z.infer<typeof MarketsStockExchangesOutputSchema>;
	marketsSp500: z.infer<typeof MarketsSp500OutputSchema>;
	marketsMarketCap: z.infer<typeof MarketsMarketCapOutputSchema>;
	marketsEarnings: z.infer<typeof MarketsEarningsOutputSchema>;
	marketsEarningsCalendar: z.infer<typeof MarketsEarningsCalendarOutputSchema>;
	marketsEarningsTranscript: z.infer<
		typeof MarketsEarningsTranscriptOutputSchema
	>;
	marketsInsiderTransactions: z.infer<
		typeof MarketsInsiderTransactionsOutputSchema
	>;
	marketsSecFilings: z.infer<typeof MarketsSecFilingsOutputSchema>;
	marketsEtf: z.infer<typeof MarketsEtfOutputSchema>;
	marketsMutualFund: z.infer<typeof MarketsMutualFundOutputSchema>;
	marketsCryptoPrice: z.infer<typeof MarketsCryptoPriceOutputSchema>;
	marketsBitcoin: z.infer<typeof MarketsBitcoinOutputSchema>;
	marketsCommodityPrice: z.infer<typeof MarketsCommodityPriceOutputSchema>;
	marketsConvertCurrency: z.infer<typeof MarketsConvertCurrencyOutputSchema>;
	marketsExchangeRate: z.infer<typeof MarketsExchangeRateOutputSchema>;
	economicsGdp: z.infer<typeof EconomicsGdpOutputSchema>;
	economicsInflation: z.infer<typeof EconomicsInflationOutputSchema>;
	economicsUnemployment: z.infer<typeof EconomicsUnemploymentOutputSchema>;
	economicsPopulation: z.infer<typeof EconomicsPopulationOutputSchema>;
	economicsInterestRate: z.infer<typeof EconomicsInterestRateOutputSchema>;
	economicsMortgageRate: z.infer<typeof EconomicsMortgageRateOutputSchema>;
	economicsMortgageCalculator: z.infer<
		typeof EconomicsMortgageCalculatorOutputSchema
	>;
	economicsIncomeTax: z.infer<typeof EconomicsIncomeTaxOutputSchema>;
	economicsIncomeTaxCalculator: z.infer<
		typeof EconomicsIncomeTaxCalculatorOutputSchema
	>;
	economicsSalesTax: z.infer<typeof EconomicsSalesTaxOutputSchema>;
	economicsSalesTaxCalculator: z.infer<
		typeof EconomicsSalesTaxCalculatorOutputSchema
	>;
	economicsPropertyTax: z.infer<typeof EconomicsPropertyTaxOutputSchema>;
	economicsVatRates: z.infer<typeof EconomicsVatRatesOutputSchema>;
	textSentiment: z.infer<typeof TextSentimentOutputSchema>;
	textSimilarity: z.infer<typeof TextSimilarityOutputSchema>;
	textEmbeddings: z.infer<typeof TextEmbeddingsOutputSchema>;
	textLanguage: z.infer<typeof TextLanguageOutputSchema>;
	textSpellCheck: z.infer<typeof TextSpellCheckOutputSchema>;
	textProfanityFilter: z.infer<typeof TextProfanityFilterOutputSchema>;
	textDictionary: z.infer<typeof TextDictionaryOutputSchema>;
	textThesaurus: z.infer<typeof TextThesaurusOutputSchema>;
	textRhymes: z.infer<typeof TextRhymesOutputSchema>;
	textRandomWord: z.infer<typeof TextRandomWordOutputSchema>;
	textLoremIpsum: z.infer<typeof TextLoremIpsumOutputSchema>;
	utilityQrCode: z.infer<typeof UtilityQrCodeOutputSchema>;
	utilityBarcode: z.infer<typeof UtilityBarcodeOutputSchema>;
	utilityPassword: z.infer<typeof UtilityPasswordOutputSchema>;
	utilityRandomUser: z.infer<typeof UtilityRandomUserOutputSchema>;
	utilityCounter: z.infer<typeof UtilityCounterOutputSchema>;
	utilityConvertUnit: z.infer<typeof UtilityConvertUnitOutputSchema>;
	utilityLogo: z.infer<typeof UtilityLogoOutputSchema>;
	utilityCountryFlag: z.infer<typeof UtilityCountryFlagOutputSchema>;
	utilityRandomImage: z.infer<typeof UtilityRandomImageOutputSchema>;
	utilityEmoji: z.infer<typeof UtilityEmojiOutputSchema>;
	transportAircraft: z.infer<typeof TransportAircraftOutputSchema>;
	transportAirlines: z.infer<typeof TransportAirlinesOutputSchema>;
	transportAirports: z.infer<typeof TransportAirportsOutputSchema>;
	transportHelicopters: z.infer<typeof TransportHelicoptersOutputSchema>;
	transportCars: z.infer<typeof TransportCarsOutputSchema>;
	transportMotorcycles: z.infer<typeof TransportMotorcyclesOutputSchema>;
	transportElectricVehicles: z.infer<
		typeof TransportElectricVehiclesOutputSchema
	>;
	transportVin: z.infer<typeof TransportVinOutputSchema>;
	healthCaloriesBurned: z.infer<typeof HealthCaloriesBurnedOutputSchema>;
	healthNutrition: z.infer<typeof HealthNutritionOutputSchema>;
	healthExercises: z.infer<typeof HealthExercisesOutputSchema>;
	healthRecipes: z.infer<typeof HealthRecipesOutputSchema>;
	healthCocktails: z.infer<typeof HealthCocktailsOutputSchema>;
	referenceAnimals: z.infer<typeof ReferenceAnimalsOutputSchema>;
	referenceCats: z.infer<typeof ReferenceCatsOutputSchema>;
	referenceDogs: z.infer<typeof ReferenceDogsOutputSchema>;
	referencePlanets: z.infer<typeof ReferencePlanetsOutputSchema>;
	referenceStars: z.infer<typeof ReferenceStarsOutputSchema>;
	referenceHistoricalEvents: z.infer<
		typeof ReferenceHistoricalEventsOutputSchema
	>;
	referenceHistoricalFigures: z.infer<
		typeof ReferenceHistoricalFiguresOutputSchema
	>;
	referenceDayInHistory: z.infer<typeof ReferenceDayInHistoryOutputSchema>;
	referenceCelebrities: z.infer<typeof ReferenceCelebritiesOutputSchema>;
	referenceBabyNames: z.infer<typeof ReferenceBabyNamesOutputSchema>;
	entertainmentJokes: z.infer<typeof EntertainmentJokesOutputSchema>;
	entertainmentDadJokes: z.infer<typeof EntertainmentDadJokesOutputSchema>;
	entertainmentChuckNorris: z.infer<
		typeof EntertainmentChuckNorrisOutputSchema
	>;
	entertainmentJokeOfTheDay: z.infer<
		typeof EntertainmentJokeOfTheDayOutputSchema
	>;
	entertainmentFacts: z.infer<typeof EntertainmentFactsOutputSchema>;
	entertainmentFactOfTheDay: z.infer<
		typeof EntertainmentFactOfTheDayOutputSchema
	>;
	entertainmentQuotes: z.infer<typeof EntertainmentQuotesOutputSchema>;
	entertainmentRandomQuotes: z.infer<
		typeof EntertainmentRandomQuotesOutputSchema
	>;
	entertainmentQuoteOfTheDay: z.infer<
		typeof EntertainmentQuoteOfTheDayOutputSchema
	>;
	entertainmentAdvice: z.infer<typeof EntertainmentAdviceOutputSchema>;
	entertainmentBucketList: z.infer<typeof EntertainmentBucketListOutputSchema>;
	entertainmentHobbies: z.infer<typeof EntertainmentHobbiesOutputSchema>;
	entertainmentHoroscope: z.infer<typeof EntertainmentHoroscopeOutputSchema>;
	entertainmentRiddles: z.infer<typeof EntertainmentRiddlesOutputSchema>;
	entertainmentTrivia: z.infer<typeof EntertainmentTriviaOutputSchema>;
	entertainmentTriviaOfTheDay: z.infer<
		typeof EntertainmentTriviaOfTheDayOutputSchema
	>;
	entertainmentGenerateSudoku: z.infer<
		typeof EntertainmentGenerateSudokuOutputSchema
	>;
	entertainmentSolveSudoku: z.infer<
		typeof EntertainmentSolveSudokuOutputSchema
	>;
};
