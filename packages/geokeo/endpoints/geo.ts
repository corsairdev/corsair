import { asRecord, logEventFromContext } from 'corsair/core';
import type { GeokeoContext, GeokeoEndpoints } from '..';
import type { GeokeoCredentials } from '../client';
import { definedQuery, GEOKEO_STATUS, makeGeokeoRequest } from '../client';
import {
	GeokeoEndpointInputSchemas,
	GeokeoEndpointOutputSchemas,
	parseCoordinate,
	parseDistanceKm,
} from './types';

/**
 * The key is a query parameter here, and Geokeo has no keyless mode: without
 * one it answers `{"status":"INVALID_REQUEST"}` with HTTP 200. `ctx.key` is the
 * key the binder resolved (option, hook or stored key), so it is the one sent.
 */
function resolveCredentials(ctx: GeokeoContext): GeokeoCredentials {
	return { apiKey: ctx.key };
}

/**
 * Geokeo sends the coordinates as strings and the distance with its unit glued
 * on, so both are parsed into numbers here and added beside the originals. The
 * raw fields stay, because they are what the API actually said.
 */
// unknown: the raw body is the documented envelope, read field by field below.
function withParsedNumbers(raw: unknown): unknown {
	const record = asRecord(raw);
	const rows = record?.results;
	// Live, ZERO_RESULTS arrives as `{"status":"ZERO_RESULTS"}` with no
	// `results` key at all. It is a documented answer (not charged), so it is
	// returned as an empty list, as the plugin documents. A `results` value
	// that is present but not a list stays as sent, so the schema rejects it.
	if (!Array.isArray(rows)) {
		return record?.status === GEOKEO_STATUS.ZERO_RESULTS &&
			!('results' in record)
			? { ...record, results: [] }
			: raw;
	}
	return {
		...record,
		results: rows.map((row) => {
			const result = asRecord(row);
			const location = asRecord(asRecord(result?.geometry)?.location);
			const distance = result?.distance;
			return {
				...result,
				lat: parseCoordinate(
					typeof location?.lat === 'string' ? location.lat : undefined,
				),
				lng: parseCoordinate(
					typeof location?.lng === 'string' ? location.lng : undefined,
				),
				distance_km: parseDistanceKm(
					typeof distance === 'string' ? distance : undefined,
				),
			};
		}),
	};
}

export const forwardGeocode: GeokeoEndpoints['geocode']['forward'] = async (
	ctx,
	input,
) => {
	const parsed = GeokeoEndpointInputSchemas.forwardGeocode.parse(input ?? {});

	const raw = await makeGeokeoRequest(resolveCredentials(ctx), {
		path: '/geocode/v1/search.php',
		query: definedQuery({
			q: parsed.q,
			country: parsed.country,
			format: parsed.format,
		}),
	});

	const result = GeokeoEndpointOutputSchemas.forwardGeocode.parse(
		withParsedNumbers(raw),
	);

	await logEventFromContext(
		ctx,
		'geokeo.geocode.forward',
		{
			// An address is personal data when it carries a street, so the log keeps
			// the count and the match kind rather than the address.
			count: result.results.length,
			class: result.results[0]?.class,
			type: result.results[0]?.type,
			country: result.results[0]?.address_components.country,
		},
		'completed',
	);
	return result;
};

export const reverseGeocode: GeokeoEndpoints['geocode']['reverse'] = async (
	ctx,
	input,
) => {
	const parsed = GeokeoEndpointInputSchemas.reverseGeocode.parse(input ?? {});

	const raw = await makeGeokeoRequest(resolveCredentials(ctx), {
		path: '/geocode/v1/reverse.php',
		query: definedQuery({
			lat: parsed.lat,
			lng: parsed.lng,
			format: parsed.format,
		}),
	});

	const result = GeokeoEndpointOutputSchemas.reverseGeocode.parse(
		withParsedNumbers(raw),
	);

	await logEventFromContext(
		ctx,
		'geokeo.geocode.reverse',
		{
			count: result.results.length,
			// The query point stays out of the log: exact coordinates can locate a
			// person (R8), so only the count, distance and country are kept.
			// The nearest result is the useful summary of a reverse lookup.
			nearest_km: result.results[0]?.distance_km ?? undefined,
			country: result.results[0]?.address_components.country,
		},
		'completed',
	);
	return result;
};
