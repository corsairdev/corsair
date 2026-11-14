import { logEventFromContext } from 'corsair/core';
import type { GeocodioContext, GeocodioEndpoints } from '..';
import type { GeocodioCredentials } from '../client';
import {
	BATCH_TIMEOUT_MS,
	definedQuery,
	fieldsParam,
	makeGeocodioRequest,
} from '../client';
import {
	GeocodioEndpointInputSchemas,
	GeocodioEndpointOutputSchemas,
} from './types';

/**
 * The key builder resolves the key (option, hooks, then the stored key) and
 * refuses a call with none, so the endpoints send the `ctx.key` it resolved.
 */
async function resolveCredentials(
	ctx: GeocodioContext,
): Promise<GeocodioCredentials> {
	return { apiKey: ctx.key };
}

/** The enterprise host is a per-call option, not a separate plugin. */
function enterpriseOf(parsed: { enterprise?: boolean | undefined }) {
	return parsed.enterprise ?? false;
}

export const forwardGeocode: GeocodioEndpoints['geocode']['forward'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.forwardGeocode.parse(input ?? {});

	const raw = await makeGeocodioRequest(
		await resolveCredentials(ctx),
		enterpriseOf(parsed),
		{
			method: 'GET',
			path: '/geocode',
			query: definedQuery({
				q: parsed.q,
				street: parsed.street,
				street2: parsed.street2,
				city: parsed.city,
				county: parsed.county,
				state_province: parsed.state_province,
				postal_code: parsed.postal_code,
				country: parsed.country,
				limit: parsed.limit,
				fields: fieldsParam(parsed.fields),
			}),
		},
	);

	const result = GeocodioEndpointOutputSchemas.forwardGeocode.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.geocode.forward',
		{
			// A street address with a house number is personal data, so the log
			// records the match quality rather than the address itself.
			count: result.results.length,
			accuracy: result.results[0]?.accuracy,
			accuracy_type: result.results[0]?.accuracy_type,
			match_type: result.results[0]?.match_type ?? undefined,
			// A field that was asked for but not returned is worth seeing.
			fields: parsed.fields?.length ?? 0,
			warnings: result._warnings?.length ?? 0,
		},
		'completed',
	);
	return result;
};

export const reverseGeocode: GeocodioEndpoints['geocode']['reverse'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.reverseGeocode.parse(input ?? {});

	const raw = await makeGeocodioRequest(
		await resolveCredentials(ctx),
		enterpriseOf(parsed),
		{
			method: 'GET',
			path: '/reverse',
			query: definedQuery({
				q: parsed.q,
				fields: fieldsParam(parsed.fields),
			}),
		},
	);

	const result = GeocodioEndpointOutputSchemas.reverseGeocode.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.geocode.reverse',
		{
			count: result.results.length,
			accuracy: result.results[0]?.accuracy,
			accuracy_type: result.results[0]?.accuracy_type,
			// Exact coordinates can locate a person, so they stay out of the log.
			fields: parsed.fields?.length ?? 0,
		},
		'completed',
	);
	return result;
};

/**
 * A batch is one POST with a JSON array of addresses. Geocodio answers a
 * `results` array in the same order, each entry holding the query and its own
 * `response`, so a caller can zip it back to the input.
 */
export const batchGeocode: GeocodioEndpoints['geocode']['batch'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.batchGeocode.parse(input ?? {});

	const raw = await makeGeocodioRequest(
		await resolveCredentials(ctx),
		enterpriseOf(parsed),
		{
			method: 'POST',
			path: '/geocode',
			body: parsed.addresses,
			query: definedQuery({
				country: parsed.country,
				fields: fieldsParam(parsed.fields),
			}),
			timeoutMs: BATCH_TIMEOUT_MS,
		},
	);

	const result = GeocodioEndpointOutputSchemas.batchGeocode.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.geocode.batch',
		{
			sent: parsed.addresses.length,
			results: result.results.length,
			// An entry with no match still answers, with an empty result list.
			matched: result.results.filter((entry) => entry.response.results.length)
				.length,
			warnings: result._warnings?.length ?? 0,
		},
		'completed',
	);
	return result;
};

export const batchReverse: GeocodioEndpoints['geocode']['batchReverse'] =
	async (ctx, input) => {
		const parsed = GeocodioEndpointInputSchemas.batchReverse.parse(input ?? {});

		const raw = await makeGeocodioRequest(
			await resolveCredentials(ctx),
			enterpriseOf(parsed),
			{
				method: 'POST',
				path: '/reverse',
				body: parsed.coordinates,
				query: definedQuery({
					country: parsed.country,
					fields: fieldsParam(parsed.fields),
				}),
				timeoutMs: BATCH_TIMEOUT_MS,
			},
		);

		const result = GeocodioEndpointOutputSchemas.batchReverse.parse(raw);

		await logEventFromContext(
			ctx,
			'geocodio.geocode.batchReverse',
			{
				sent: parsed.coordinates.length,
				results: result.results.length,
				matched: result.results.filter((entry) => entry.response.results.length)
					.length,
				warnings: result._warnings?.length ?? 0,
			},
			'completed',
		);
		return result;
	};

/** Parsing splits an address without geocoding it, so it costs no lookup. */
export const parse: GeocodioEndpoints['geocode']['parse'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.parse.parse(input ?? {});

	const raw = await makeGeocodioRequest(await resolveCredentials(ctx), false, {
		method: 'GET',
		path: '/parse',
		query: definedQuery({ q: parsed.q }),
	});

	const result = GeocodioEndpointOutputSchemas.parse.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.geocode.parse',
		{
			// The components are what a caller acts on, so the count is the summary.
			components: Object.keys(result.address_components).length,
			has_city: Boolean(result.address_components.city),
			has_postal_code: Boolean(result.address_components.postal_code),
		},
		'completed',
	);
	return result;
};

/**
 * Distance is a read, and `destinations[]` is the documented spelling for the
 * repeated parameter, so the query builder must not join the array.
 */
export const distance: GeocodioEndpoints['distance']['fromOrigin'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.distance.parse(input ?? {});

	const raw = await makeGeocodioRequest(
		await resolveCredentials(ctx),
		enterpriseOf(parsed),
		{
			method: 'GET',
			path: '/distance',
			query: definedQuery({
				origin: parsed.origin,
				'destinations[]': parsed.destinations,
				mode: parsed.mode,
				units: parsed.units,
				max_results: parsed.max_results,
				max_distance: parsed.max_distance,
				max_duration: parsed.max_duration,
				min_distance: parsed.min_distance,
				min_duration: parsed.min_duration,
				order_by: parsed.order_by,
				sort_order: parsed.sort_order,
				country: parsed.country,
			}),
		},
	);

	const result = GeocodioEndpointOutputSchemas.distance.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.distance.fromOrigin',
		{
			mode: result.mode,
			destinations: parsed.destinations.length,
			returned: result.destinations.length,
			// The nearest destination is the useful summary of a distance call.
			nearest_km: result.destinations[0]?.distance_km,
		},
		'completed',
	);
	return result;
};

export const distanceMatrix: GeocodioEndpoints['distance']['matrix'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.distanceMatrix.parse(input ?? {});

	const raw = await makeGeocodioRequest(await resolveCredentials(ctx), false, {
		method: 'POST',
		path: '/distance-matrix',
		body: {
			origins: parsed.origins,
			destinations: parsed.destinations,
			calculation_type: parsed.calculation_type,
			mode: parsed.mode,
			units: parsed.units,
			max_results: parsed.max_results,
			max_distance: parsed.max_distance,
			max_duration: parsed.max_duration,
			min_distance: parsed.min_distance,
			min_duration: parsed.min_duration,
			order_by: parsed.order_by,
			sort_order: parsed.sort_order,
		},
	});

	const result = GeocodioEndpointOutputSchemas.distanceMatrix.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.distance.matrix',
		{
			mode: result.mode,
			origins: parsed.origins.length,
			destinations: parsed.destinations.length,
			rows: result.results.length,
		},
		'completed',
	);
	return result;
};

export const jobsList: GeocodioEndpoints['jobs']['list'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.jobsList.parse(input ?? {});

	const raw = await makeGeocodioRequest(await resolveCredentials(ctx), false, {
		method: 'GET',
		path: '/distance-jobs',
		query: definedQuery({ page: parsed.page }),
	});

	const result = GeocodioEndpointOutputSchemas.jobsList.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.jobs.list',
		{ count: result.data.length, page: parsed.page ?? 1 },
		'completed',
	);
	return result;
};

export const jobGet: GeocodioEndpoints['jobs']['get'] = async (ctx, input) => {
	const parsed = GeocodioEndpointInputSchemas.jobGet.parse(input ?? {});

	const raw = await makeGeocodioRequest(await resolveCredentials(ctx), false, {
		method: 'GET',
		path: `/distance-jobs/${encodeURIComponent(parsed.identifier)}`,
	});

	const result = GeocodioEndpointOutputSchemas.jobGet.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.jobs.get',
		{ identifier: parsed.identifier, status: result.data.status },
		'completed',
	);
	return result;
};

export const jobDelete: GeocodioEndpoints['jobs']['delete'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.jobDelete.parse(input ?? {});

	const raw = await makeGeocodioRequest(await resolveCredentials(ctx), false, {
		method: 'DELETE',
		path: `/distance-jobs/${encodeURIComponent(parsed.identifier)}`,
	});

	const result = GeocodioEndpointOutputSchemas.jobDelete.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.jobs.delete',
		{ identifier: parsed.identifier },
		'completed',
	);
	return result;
};

export const listsAll: GeocodioEndpoints['lists']['all'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.listsAll.parse(input ?? {});

	const raw = await makeGeocodioRequest(await resolveCredentials(ctx), false, {
		method: 'GET',
		path: '/lists',
		query: definedQuery({ page: parsed.page }),
	});

	const result = GeocodioEndpointOutputSchemas.listsAll.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.lists.all',
		{ count: result.data.length, page: result.current_page ?? 1 },
		'completed',
	);
	return result;
};

export const listGet: GeocodioEndpoints['lists']['get'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.listGet.parse(input ?? {});

	const raw = await makeGeocodioRequest(await resolveCredentials(ctx), false, {
		method: 'GET',
		path: `/lists/${encodeURIComponent(String(parsed.id))}`,
	});

	const result = GeocodioEndpointOutputSchemas.listGet.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.lists.get',
		{ id: parsed.id, state: result.status?.state },
		'completed',
	);
	return result;
};

export const listDelete: GeocodioEndpoints['lists']['delete'] = async (
	ctx,
	input,
) => {
	const parsed = GeocodioEndpointInputSchemas.listDelete.parse(input ?? {});

	const raw = await makeGeocodioRequest(await resolveCredentials(ctx), false, {
		method: 'DELETE',
		path: `/lists/${encodeURIComponent(String(parsed.id))}`,
	});

	const result = GeocodioEndpointOutputSchemas.listDelete.parse(raw);

	await logEventFromContext(
		ctx,
		'geocodio.lists.delete',
		{ id: parsed.id, success: result.success },
		'completed',
	);
	return result;
};
