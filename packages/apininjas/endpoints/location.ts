import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import { cacheCities, cacheCountries, cacheUniversities } from './persist';
import { asArray } from './shared';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Geocoding, administrative geography, points of interest and weather.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/** Get current city coordinates by city and country name. */
export const geocode: ApiNinjasEndpoints['locationGeocode'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationGeocode']
	>('geocoding', ctx.key, {
		version: 'v1',
		query: {
			city: input.city,
			state: input.state,
			country: input.country,
			zipcode: input.zipcode,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.location.geocode',
		withCount(auditPayload(input, ['city', 'state', 'country']), result),
		'completed',
	);
	return result;
};

/** Returns a list of cities that contain a given latitude and longitude. */
export const reverseGeocode: ApiNinjasEndpoints['locationReverseGeocode'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['locationReverseGeocode']
		>('reversegeocoding', ctx.key, {
			version: 'v1',
			query: {
				lat: input.lat,
				lon: input.lon,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.location.reverseGeocode',
			withCount(auditPayload(input, []), result),
			'completed',
		);
		return result;
	};

/**
 * Get city data from either a name or population range. Returns a list of
 * cities that satisfies the parameters.
 */
export const cities: ApiNinjasEndpoints['locationCities'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationCities']
	>('city', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			country: input.country,
			min_lat: input.min_lat,
			max_lat: input.max_lat,
			min_lon: input.min_lon,
			max_lon: input.max_lon,
			min_population: input.min_population,
			max_population: input.max_population,
			limit: input.limit,
			offset: input.offset,
		},
	});

	await cacheCities(ctx.db.cities, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.location.cities',
		withCount(
			auditPayload(input, [
				'name',
				'country',
				'min_population',
				'max_population',
				'limit',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Get country data from given parameters. Returns a list of country
 * statistics that satisfy the parameters.
 */
export const country: ApiNinjasEndpoints['locationCountry'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationCountry']
	>('country', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			currency: input.currency,
			min_gdp: input.min_gdp,
			max_gdp: input.max_gdp,
			min_population: input.min_population,
			max_population: input.max_population,
			min_area: input.min_area,
			max_area: input.max_area,
			min_unemployment: input.min_unemployment,
			max_unemployment: input.max_unemployment,
			min_gdp_growth: input.min_gdp_growth,
			max_gdp_growth: input.max_gdp_growth,
			min_infant_mortality: input.min_infant_mortality,
			max_infant_mortality: input.max_infant_mortality,
			min_fertility: input.min_fertility,
			max_fertility: input.max_fertility,
			min_urban_pop_rate: input.min_urban_pop_rate,
			max_urban_pop_rate: input.max_urban_pop_rate,
			limit: input.limit,
		},
	});

	await cacheCountries(ctx.db.countries, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.location.country',
		withCount(
			auditPayload(input, [
				'name',
				'currency',
				'min_gdp',
				'max_gdp',
				'min_population',
				'max_population',
				'min_area',
				'max_area',
				'min_unemployment',
				'max_unemployment',
				'min_gdp_growth',
				'max_gdp_growth',
				'min_infant_mortality',
				'max_infant_mortality',
				'min_fertility',
				'max_fertility',
				'min_urban_pop_rate',
				'max_urban_pop_rate',
				'limit',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Returns details for one or more counties matching the input parameters.
 * For premium users, you can also specify the limit and offset parameters
 * to paginate through results.
 */
export const county: ApiNinjasEndpoints['locationCounty'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationCounty']
	>('county', ctx.key, {
		version: 'v1',
		query: {
			county: input.county,
			zipcode: input.zipcode,
			state: input.state,
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.location.county',
		withCount(
			auditPayload(input, ['county', 'state', 'limit', 'offset']),
			result,
		),
		'completed',
	);
	return result;
};

/** Returns a list of ZIP Code details matching the input parameters. */
export const zipCode: ApiNinjasEndpoints['locationZipCode'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationZipCode']
	>('zipcode', ctx.key, {
		version: 'v1',
		query: {
			zip: input.zip,
			city: input.city,
			state: input.state,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.location.zipCode',
		withCount(auditPayload(input, ['city', 'state']), result),
		'completed',
	);
	return result;
};

/** Returns a list of postal code details matching the input parameters. */
export const postalCode: ApiNinjasEndpoints['locationPostalCode'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationPostalCode']
	>('postalcode', ctx.key, {
		version: 'v1',
		query: {
			postal_code: input.postal_code,
			city: input.city,
			province: input.province,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.location.postalCode',
		withCount(auditPayload(input, ['city', 'province']), result),
		'completed',
	);
	return result;
};

/**
 * Returns information about universities matching the provided filters. At
 * least one filter parameter is required. Free users can use name or
 * country - all other filters are premium-only.
 */
export const universities: ApiNinjasEndpoints['locationUniversities'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationUniversities']
	>('university', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			country: input.country,
			city: input.city,
			state: input.state,
			min_faculty_ratio: input.min_faculty_ratio,
			max_faculty_ratio: input.max_faculty_ratio,
			min_enrolled: input.min_enrolled,
			max_enrolled: input.max_enrolled,
			min_tuition: input.min_tuition,
			max_tuition: input.max_tuition,
			offset: input.offset,
			limit: input.limit,
		},
	});

	await cacheUniversities(ctx.db.universities, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.location.universities',
		withCount(
			auditPayload(input, [
				'name',
				'country',
				'city',
				'state',
				'min_faculty_ratio',
				'max_faculty_ratio',
				'min_enrolled',
				'max_enrolled',
				'min_tuition',
				'max_tuition',
				'offset',
				'limit',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Get hospital data based on given parameters. Returns a list of hospitals
 * that match the specified criteria.
 */
export const hospitals: ApiNinjasEndpoints['locationHospitals'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationHospitals']
	>('hospitals', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			city: input.city,
			state: input.state,
			zipcode: input.zipcode,
			county: input.county,
			min_latitude: input.min_latitude,
			max_latitude: input.max_latitude,
			min_longitude: input.min_longitude,
			max_longitude: input.max_longitude,
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.location.hospitals',
		withCount(
			auditPayload(input, [
				'name',
				'city',
				'state',
				'county',
				'limit',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/** FIND_EV_CHARGING_STATIONS */
export const evChargers: ApiNinjasEndpoints['locationEvChargers'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationEvChargers']
	>('evcharger', ctx.key, {
		version: 'v1',
		query: {
			lat: input.lat,
			lon: input.lon,
			distance: input.distance,
			level: input.level,
			limit: input.limit,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.location.evChargers',
		withCount(
			auditPayload(input, ['distance', 'level', 'limit', 'offset']),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Get current weather, wind speed and direction, humidity, and temperature
 * data by city, ZIP code, or geolocation coordinates (latitude/longitude).
 */
export const weather: ApiNinjasEndpoints['locationWeather'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationWeather']
	>('weather', ctx.key, {
		version: 'v1',
		query: {
			lat: input.lat,
			lon: input.lon,
			zip: input.zip,
			city: input.city,
			state: input.state,
			country: input.country,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.location.weather',
		withCount(auditPayload(input, ['city', 'state', 'country']), result),
		'completed',
	);
	return result;
};

/** Returns a 5-day weather forecast in 3-hour intervals for a given city. */
export const weatherForecast: ApiNinjasEndpoints['locationWeatherForecast'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['locationWeatherForecast']
		>('weatherforecast', ctx.key, {
			version: 'v1',
			query: {
				lat: input.lat,
				lon: input.lon,
				zip: input.zip,
				city: input.city,
				state: input.state,
				country: input.country,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.location.weatherForecast',
			withCount(auditPayload(input, ['city', 'state', 'country']), result),
			'completed',
		);
		return result;
	};

/**
 * Get air quality by city or location coordinates (latitude/longitude).
 * Returns the air quality index (AQI) and concentrations of major
 * pollutants.
 */
export const airQuality: ApiNinjasEndpoints['locationAirQuality'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['locationAirQuality']
	>('airquality', ctx.key, {
		version: 'v1',
		query: {
			lat: input.lat,
			lon: input.lon,
			city: input.city,
			state: input.state,
			country: input.country,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.location.airQuality',
		withCount(auditPayload(input, ['city', 'state', 'country']), result),
		'completed',
	);
	return result;
};
