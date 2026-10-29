import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import {
	cacheAircraft,
	cacheAirlines,
	cacheAirports,
	cacheCars,
	cacheElectricVehicles,
	cacheMotorcycles,
} from './persist';
import { asArray } from './shared';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Aircraft, airlines, airports and road vehicles.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/**
 * Returns a list of aircrafts that match the given parameters. This API
 * only supports airplanes - for helicopter specs please use our Helicopter
 * API.
 */
export const aircraft: ApiNinjasEndpoints['transportAircraft'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['transportAircraft']
	>('aircraft', ctx.key, {
		version: 'v1',
		query: {
			manufacturer: input.manufacturer,
			model: input.model,
			engine_type: input.engine_type,
			min_speed: input.min_speed,
			max_speed: input.max_speed,
			min_range: input.min_range,
			max_range: input.max_range,
			min_length: input.min_length,
			max_length: input.max_length,
			min_height: input.min_height,
			max_height: input.max_height,
			min_wingspan: input.min_wingspan,
			max_wingspan: input.max_wingspan,
			limit: input.limit,
		},
	});

	await cacheAircraft(ctx.db.aircraft, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.transport.aircraft',
		withCount(
			auditPayload(input, [
				'manufacturer',
				'model',
				'engine_type',
				'min_speed',
				'max_speed',
				'min_range',
				'max_range',
				'min_length',
				'max_length',
				'min_height',
				'max_height',
				'min_wingspan',
				'max_wingspan',
				'limit',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Returns airline details including fleet composition, base airport and
 * branding assets, by name, IATA code or ICAO code.
 */
export const airlines: ApiNinjasEndpoints['transportAirlines'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['transportAirlines']
	>('airlines', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			iata: input.iata,
			icao: input.icao,
		},
	});

	await cacheAirlines(ctx.db.airlines, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.transport.airlines',
		withCount(auditPayload(input, ['name', 'iata', 'icao']), result),
		'completed',
	);
	return result;
};

/**
 * Returns a list of up to 10 airport results. Use the offset parameter to
 * access more results if available.
 */
export const airports: ApiNinjasEndpoints['transportAirports'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['transportAirports']
	>('airports', ctx.key, {
		version: 'v1',
		query: {
			iata: input.iata,
			icao: input.icao,
			name: input.name,
			country: input.country,
			region: input.region,
			city: input.city,
			timezone: input.timezone,
			min_elevation: input.min_elevation,
			max_elevation: input.max_elevation,
			size: input.size,
			has_iata: input.has_iata,
			min_runway_length: input.min_runway_length,
			type: input.type,
			scheduled_service: input.scheduled_service,
			continent: input.continent,
			surface: input.surface,
			has_lights: input.has_lights,
			q: input.q,
			include_closed: input.include_closed,
			limit: input.limit,
			sort: input.sort,
			order: input.order,
			offset: input.offset,
		},
	});

	await cacheAirports(ctx.db.airports, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.transport.airports',
		withCount(
			auditPayload(input, [
				'iata',
				'icao',
				'name',
				'country',
				'region',
				'city',
				'timezone',
				'min_elevation',
				'max_elevation',
				'size',
				'has_iata',
				'min_runway_length',
				'type',
				'scheduled_service',
				'continent',
				'surface',
				'has_lights',
				'include_closed',
				'limit',
				'sort',
				'order',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/** Get helicopter technical specifications that match the given parameters. */
export const helicopters: ApiNinjasEndpoints['transportHelicopters'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['transportHelicopters']
	>('helicopter', ctx.key, {
		version: 'v1',
		query: {
			manufacturer: input.manufacturer,
			model: input.model,
			min_speed: input.min_speed,
			max_speed: input.max_speed,
			min_range: input.min_range,
			max_range: input.max_range,
			min_length: input.min_length,
			max_length: input.max_length,
			min_height: input.min_height,
			max_height: input.max_height,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.transport.helicopters',
		withCount(
			auditPayload(input, [
				'manufacturer',
				'model',
				'min_speed',
				'max_speed',
				'min_range',
				'max_range',
				'min_length',
				'max_length',
				'min_height',
				'max_height',
				'limit',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Get car data from given parameters. Returns a list of car models (and
 * their information) that satisfy the parameters.
 */
export const cars: ApiNinjasEndpoints['transportCars'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['transportCars']
	>('cars', ctx.key, {
		version: 'v1',
		query: {
			make: input.make,
			model: input.model,
			trim: input.trim,
		},
	});

	await cacheCars(ctx.db.vehicles, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.transport.cars',
		withCount(auditPayload(input, ['make', 'model', 'trim']), result),
		'completed',
	);
	return result;
};

/**
 * Returns up to 30 motorcycle results matching the input name parameters.
 * For searches that yield more than 30 results, please use the offset
 * parameter.
 */
export const motorcycles: ApiNinjasEndpoints['transportMotorcycles'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['transportMotorcycles']
	>('motorcycles', ctx.key, {
		version: 'v1',
		query: {
			make: input.make,
			model: input.model,
			year: input.year,
			offset: input.offset,
		},
	});

	await cacheMotorcycles(ctx.db.vehicles, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.transport.motorcycles',
		withCount(auditPayload(input, ['make', 'model', 'year', 'offset']), result),
		'completed',
	);
	return result;
};

/**
 * Get electric vehicle data from given parameters. Returns a list of
 * electric vehicles that satisfy the parameters.
 */
export const electricVehicles: ApiNinjasEndpoints['transportElectricVehicles'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['transportElectricVehicles']
		>('electricvehicle', ctx.key, {
			version: 'v1',
			query: {
				make: input.make,
				model: input.model,
				min_year: input.min_year,
				max_year: input.max_year,
				min_range: input.min_range,
				max_range: input.max_range,
				limit: input.limit,
				offset: input.offset,
			},
		});

		await cacheElectricVehicles(ctx.db.vehicles, asArray(result), new Date());

		await logEventFromContext(
			ctx,
			'apininjas.transport.electricVehicles',
			withCount(
				auditPayload(input, [
					'make',
					'model',
					'min_year',
					'max_year',
					'min_range',
					'max_range',
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
 * Returns key vehicle information including manufacturer, country of
 * origin, and model year for a given VIN.
 */
export const vin: ApiNinjasEndpoints['transportVin'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['transportVin']
	>('vinlookup', ctx.key, {
		version: 'v1',
		query: {
			vin: input.vin,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.transport.vin',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};
