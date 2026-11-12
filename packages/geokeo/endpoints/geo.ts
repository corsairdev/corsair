import { asRecord, logEventFromContext } from 'corsair/core';
import type { GeokeoContext, GeokeoEndpoints } from '..';
import type { GeokeoCredentials } from '../client';
import { definedQuery, makeGeokeoRequest } from '../client';
import {
	GeokeoEndpointInputSchemas,
	GeokeoEndpointOutputSchemas,
	parseCoordinate,
	parseDistanceKm,
} from './types';

/**
 * The key is a query parameter here, and Geokeo has no keyless mode: without
 * one it answers `{"status":"INVALID_REQUEST"}` with HTTP 200.
 */
async function resolveCredentials(
	ctx: GeokeoContext,
): Promise<GeokeoCredentials> {
	if (ctx.options.key) return { apiKey: ctx.options.key };
	const stored = await ctx.keys.get_api_key();
	return { apiKey: stored ?? undefined };
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
	if (!Array.isArray(rows)) return raw;
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

	const raw = await makeGeokeoRequest(await resolveCredentials(ctx), {
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

	const raw = await makeGeokeoRequest(await resolveCredentials(ctx), {
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
			// The coordinates were the caller's own input, so they are safe to record.
			lat: parsed.lat,
			lng: parsed.lng,
			// The nearest result is the useful summary of a reverse lookup.
			nearest_km: result.results[0]?.distance_km ?? undefined,
			country: result.results[0]?.address_components.country,
		},
		'completed',
	);
	return result;
};
