import { logEventFromContext } from 'corsair/core';
import type { GeoapifyContext, GeoapifyEndpoints } from '..';
import type { GeoapifyCredentials } from '../client';
import { definedQuery, makeGeoapifyRequest } from '../client';
import {
	GeoapifyEndpointInputSchemas,
	GeoapifyEndpointOutputSchemas,
} from './types';

/**
 * The key builder has already resolved the key (the `key` option, else the
 * stored key) and refuses a call with neither, so the endpoints send `ctx.key`
 * rather than reading the key a second time, which would skip a key a hook set.
 */
async function resolveCredentials(
	ctx: GeoapifyContext,
): Promise<GeoapifyCredentials> {
	return { apiKey: ctx.key };
}

/** The region the caller asked for, which picks the host. */
function regionOf(parsed: { region?: 'global' | 'eu' | undefined }) {
	return parsed.region ?? 'global';
}

/**
 * Geoapify's default is GeoJSON, which wraps each result in a feature. Every
 * endpoint here asks for `json`, so `results` is the array the caller reads.
 */
export const forwardGeocode: GeoapifyEndpoints['geocode']['forward'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.forwardGeocode.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'GET',
			version: 'v1',
			path: '/geocode/search',
			query: definedQuery({
				text: parsed.text,
				type: parsed.type,
				lang: parsed.lang,
				limit: parsed.limit,
				countrycodes: parsed.countrycodes,
				filter: parsed.filter,
				bias: parsed.bias,
				format: 'json',
			}),
		},
	);

	const result = GeoapifyEndpointOutputSchemas.forwardGeocode.parse(raw);

	await logEventFromContext(
		ctx,
		'geoapify.geocode.forward',
		{
			// An address is personal data when it carries a house number, so the log
			// keeps the counts and the best match's confidence rather than the text.
			count: result.results.length,
			top_country: result.results[0]?.country_code,
			top_result_type: result.results[0]?.result_type,
			confidence: result.results[0]?.rank?.confidence,
		},
		'completed',
	);
	return result;
};

export const reverseGeocode: GeoapifyEndpoints['geocode']['reverse'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.reverseGeocode.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'GET',
			version: 'v1',
			path: '/geocode/reverse',
			query: definedQuery({
				lat: parsed.lat,
				lon: parsed.lon,
				type: parsed.type,
				lang: parsed.lang,
				limit: parsed.limit,
				countrycodes: parsed.countrycodes,
				format: 'json',
			}),
		},
	);

	const result = GeoapifyEndpointOutputSchemas.reverseGeocode.parse(raw);

	await logEventFromContext(
		ctx,
		'geoapify.geocode.reverse',
		{
			count: result.results.length,
			top_country: result.results[0]?.country_code,
			top_result_type: result.results[0]?.result_type,
			// The point is as precise as the address it resolves to, so like the
			// forward text it stays out of the log.
		},
		'completed',
	);
	return result;
};

export const autocomplete: GeoapifyEndpoints['geocode']['autocomplete'] =
	async (ctx, input) => {
		const parsed = GeoapifyEndpointInputSchemas.autocomplete.parse(input ?? {});

		const raw = await makeGeoapifyRequest(
			await resolveCredentials(ctx),
			regionOf(parsed),
			{
				method: 'GET',
				version: 'v1',
				path: '/geocode/autocomplete',
				query: definedQuery({
					text: parsed.text,
					type: parsed.type,
					lang: parsed.lang,
					limit: parsed.limit,
					countrycodes: parsed.countrycodes,
					filter: parsed.filter,
					bias: parsed.bias,
					format: 'json',
				}),
			},
		);

		const result = GeoapifyEndpointOutputSchemas.autocomplete.parse(raw);

		await logEventFromContext(
			ctx,
			'geoapify.geocode.autocomplete',
			{
				count: result.results.length,
				top_country: result.results[0]?.country_code,
				top_result_type: result.results[0]?.result_type,
			},
			'completed',
		);
		return result;
	};

/**
 * The places APIs are v2, so they hit `/v2/places`, and they answer a GeoJSON
 * feature collection in every case: there is no `format` parameter.
 */
export const placesSearch: GeoapifyEndpoints['places']['search'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.placesSearch.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'GET',
			version: 'v2',
			path: '/places',
			query: definedQuery({
				categories: parsed.categories,
				filter: parsed.filter,
				bias: parsed.bias,
				conditions: parsed.conditions,
				limit: parsed.limit,
				offset: parsed.offset,
				lang: parsed.lang,
				name: parsed.name,
			}),
		},
	);

	const result = GeoapifyEndpointOutputSchemas.placesSearch.parse(raw);

	await logEventFromContext(
		ctx,
		'geoapify.places.search',
		{
			count: result.features.length,
			categories: parsed.categories.length,
			// A count alone would not tell a caller whether the filter matched at all.
			// Places carry a `categories` list, most general first; there is no
			// single `category` field.
			top_category: result.features[0]?.properties.categories?.at(-1),
		},
		'completed',
	);
	return result;
};

export const placeDetails: GeoapifyEndpoints['places']['details'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.placeDetails.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'GET',
			version: 'v2',
			path: '/place-details',
			query: definedQuery({ id: parsed.id, lang: parsed.lang }),
		},
	);

	const result = GeoapifyEndpointOutputSchemas.placeDetails.parse(raw);

	await logEventFromContext(
		ctx,
		'geoapify.places.details',
		{
			// The place ID names a record, not a person, so it is safe to record.
			place_id: parsed.id,
			found: result.features.length,
		},
		'completed',
	);
	return result;
};

/**
 * A route is a read: it computes an answer and changes nothing. The response
 * holds one result per requested route type, and its geometry is only present
 * when `format: 'geojson'` was asked for.
 */
export const routing: GeoapifyEndpoints['routing']['route'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.routing.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'GET',
			version: 'v1',
			path: '/routing',
			query: definedQuery({
				waypoints: parsed.waypoints,
				mode: parsed.mode,
				type: parsed.type,
				units: parsed.units,
				lang: parsed.lang,
				avoid: parsed.avoid,
				details: parsed.details,
				traffic: parsed.traffic,
				max_speed: parsed.max_speed,
				format: parsed.format ?? 'json',
			}),
		},
	);

	const result = GeoapifyEndpointOutputSchemas.routing.parse(raw);

	await logEventFromContext(
		ctx,
		'geoapify.routing.route',
		{
			mode: parsed.mode,
			waypoints: parsed.waypoints.length,
			distance: result.results?.[0]?.distance,
			time: result.results?.[0]?.time,
			units: result.results?.[0]?.distance_units,
		},
		'completed',
	);
	return result;
};

export const isoline: GeoapifyEndpoints['routing']['isoline'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.isoline.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'GET',
			version: 'v1',
			path: '/isoline',
			// An ID alone reads an earlier result; the other parameters must be left out.
			query: definedQuery(
				parsed.id !== undefined
					? { id: parsed.id }
					: {
							lat: parsed.lat,
							lon: parsed.lon,
							type: parsed.type,
							range: parsed.range,
							mode: parsed.mode,
							units: parsed.units,
							avoid: parsed.avoid,
							traffic: parsed.traffic,
							max_speed: parsed.max_speed,
						},
			),
		},
	);

	const result = GeoapifyEndpointOutputSchemas.isoline.parse(raw);
	// A slow calculation answers 202 with no features and only an ID. That is
	// not a finished result, so the event says so and carries the ID to read it.
	const pendingId =
		result.features.length === 0 ? result.properties?.id : undefined;

	await logEventFromContext(
		ctx,
		'geoapify.routing.isoline',
		{
			// One feature per range, so the count is the number of reachable areas.
			areas: result.features.length,
			type: parsed.type,
			ranges: parsed.range?.length,
			mode: parsed.mode ?? 'drive',
			pending: pendingId !== undefined,
			id: pendingId ?? parsed.id,
		},
		pendingId !== undefined ? 'pending' : 'completed',
	);
	return result;
};

/**
 * The matrix is one POST with a JSON body, and the answer is a row per source
 * and a column per target. Geoapify takes each point as `{ location: [lon, lat] }`
 * (a `lat,lon` string answers 400). A pair with no route has `null` distance and
 * time, which is a normal answer rather than a failure.
 */
function toMatrixPoint(point: { lat: number; lon: number }) {
	return { location: [point.lon, point.lat] };
}

export const routeMatrix: GeoapifyEndpoints['routing']['matrix'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.routeMatrix.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'POST',
			version: 'v1',
			path: '/routematrix',
			body: {
				mode: parsed.mode,
				sources: parsed.sources.map(toMatrixPoint),
				targets: parsed.targets.map(toMatrixPoint),
				type: parsed.type,
				units: parsed.units,
				// The body takes each road type as an object, not a bare string.
				avoid: parsed.avoid?.map((type) => ({ type })),
				traffic: parsed.traffic,
				max_speed: parsed.max_speed,
			},
		},
	);

	const result = GeoapifyEndpointOutputSchemas.routeMatrix.parse(raw);

	await logEventFromContext(
		ctx,
		'geoapify.routing.matrix',
		{
			mode: parsed.mode,
			sources: parsed.sources.length,
			targets: parsed.targets.length,
			// A pair with no route is worth knowing about, so the count is recorded.
			unreachable: result.sources_to_targets
				.flat()
				.filter((cell) => cell.distance === null || cell.time === null).length,
		},
		'completed',
	);
	return result;
};

export const ipGeolocation: GeoapifyEndpoints['geo']['ip'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.ipGeolocation.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'GET',
			version: 'v1',
			path: '/ipinfo',
			query: definedQuery({ ip: parsed.ip, lang: parsed.lang }),
		},
	);

	const result = GeoapifyEndpointOutputSchemas.ipGeolocation.parse(raw);

	await logEventFromContext(
		ctx,
		'geoapify.geo.ip',
		{
			// An IP address identifies a connection, so it is not recorded.
			country: result.country?.iso_code as string | undefined,
			city: result.city?.name as string | undefined,
		},
		'completed',
	);
	return result;
};

export const timezone: GeoapifyEndpoints['geo']['timezone'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.timezone.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'GET',
			version: 'v1',
			path: '/timezone',
			query: definedQuery({ lat: parsed.lat, lon: parsed.lon, at: parsed.at }),
		},
	);

	const result = GeoapifyEndpointOutputSchemas.timezone.parse(raw);

	await logEventFromContext(
		ctx,
		'geoapify.geo.timezone',
		{
			// A point can sit in more than one zone near a border, so both are named.
			zones: result.timezones.length,
			primary: result.timezones[0]?.name,
			utc_offset: result.timezones[0]?.utc_offset,
			at: result.at,
		},
		'completed',
	);
	return result;
};

export const postcodeSearch: GeoapifyEndpoints['geo']['postcodeSearch'] =
	async (ctx, input) => {
		const parsed = GeoapifyEndpointInputSchemas.postcodeSearch.parse(
			input ?? {},
		);

		const raw = await makeGeoapifyRequest(
			await resolveCredentials(ctx),
			regionOf(parsed),
			{
				method: 'GET',
				version: 'v1',
				path: '/postcode/search',
				query: definedQuery({
					postcode: parsed.postcode,
					countrycode: parsed.countrycode,
					lat: parsed.lat,
					lon: parsed.lon,
					lang: parsed.lang,
					format: 'json',
				}),
			},
		);

		const result = GeoapifyEndpointOutputSchemas.postcodeSearch.parse(raw);

		await logEventFromContext(
			ctx,
			'geoapify.geo.postcodeSearch',
			{
				count: result.results.length,
				country_code: result.results[0]?.country_code,
			},
			'completed',
		);
		return result;
	};

export const postcodeList: GeoapifyEndpoints['geo']['postcodeList'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.postcodeList.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'GET',
			version: 'v1',
			path: '/postcode/list',
			query: definedQuery({
				text: parsed.text,
				countrycode: parsed.countrycode,
				filter: parsed.filter,
				bias: parsed.bias,
				limit: parsed.limit,
				offset: parsed.offset,
				lang: parsed.lang,
				format: 'json',
			}),
		},
	);

	const result = GeoapifyEndpointOutputSchemas.postcodeList.parse(raw);

	await logEventFromContext(
		ctx,
		'geoapify.geo.postcodeList',
		{ count: result.results.length, offset: parsed.offset ?? 0 },
		'completed',
	);
	return result;
};

export const boundaries: GeoapifyEndpoints['geo']['boundaries'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.boundaries.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'GET',
			version: 'v1',
			path: '/boundaries/part-of',
			query: definedQuery({
				id: parsed.id,
				lat: parsed.lat,
				lon: parsed.lon,
				osm_id: parsed.osm_id,
				osm_type: parsed.osm_type,
				boundaries: parsed.boundaries,
				lang: parsed.lang,
			}),
		},
	);

	const result = GeoapifyEndpointOutputSchemas.boundaries.parse(raw);

	await logEventFromContext(
		ctx,
		'geoapify.geo.boundaries',
		{
			// One feature per enclosing boundary level, such as city, county, country.
			levels: result.features.length,
			place_id: parsed.id,
		},
		'completed',
	);
	return result;
};

export const elevation: GeoapifyEndpoints['geo']['elevation'] = async (
	ctx,
	input,
) => {
	const parsed = GeoapifyEndpointInputSchemas.elevation.parse(input ?? {});

	const raw = await makeGeoapifyRequest(
		await resolveCredentials(ctx),
		regionOf(parsed),
		{
			method: 'POST',
			version: 'v1',
			path: '/geodata/elevation',
			body: {
				locations: parsed.locations,
				units: parsed.units,
			},
		},
	);

	const result = GeoapifyEndpointOutputSchemas.elevation.parse(raw);
	const known = result.results
		.map((row) => row.elevation)
		.filter((value): value is number => value !== null);

	await logEventFromContext(
		ctx,
		'geoapify.geo.elevation',
		{
			points: result.results.length,
			units: result.results[0]?.units,
			// The highest and lowest sample, which is the useful summary of a line.
			// A point the terrain service has no value for is `null` and skipped.
			highest: known.length > 0 ? Math.max(...known) : undefined,
			lowest: known.length > 0 ? Math.min(...known) : undefined,
			missing: result.results.length - known.length,
		},
		'completed',
	);
	return result;
};
