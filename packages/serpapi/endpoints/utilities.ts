import { logEventFromContext } from 'corsair/core';
import type { SerpapiEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactQuery, rejectSerpapiError, serpapiCall } from './shared';
import type {
	SerpapiGoogleDomain,
	SerpapiLocation,
	SerpapiSearchResponse,
} from './types';

/** Confirmed live: `GET /locations.json` - a distinct path, not `/search`. */
export const locationOptions: SerpapiEndpoints['utilitiesLocationOptions'] =
	async (ctx, input) => {
		const result = await serpapiCall<SerpapiLocation[]>(
			ctx,
			'/locations.json',
			{ query: compactQuery({ q: input.q, limit: input.limit }) },
		);
		await logEventFromContext(
			ctx,
			'serpapi.utilities.locationOptions',
			{},
			'completed',
		);
		return result ?? [];
	};

/**
 * Confirmed live: `GET /searches/{search_id}.json` - the id comes from a
 * prior search's own `search_metadata.id`, and retrieval works up to 31
 * days after the original search completed (per the operation's own
 * description).
 */
export const searchArchive: SerpapiEndpoints['utilitiesSearchArchive'] = async (
	ctx,
	input,
) => {
	const result = rejectSerpapiError(
		await serpapiCall<SerpapiSearchResponse>(
			ctx,
			`/searches/${encodeURIComponent(input.search_id)}.json`,
		),
	);
	await logEventFromContext(
		ctx,
		'serpapi.utilities.searchArchive',
		auditPayload(input, ['search_id']),
		'completed',
	);
	return result;
};

/** Confirmed live: `GET /google-domains.json` - a public, unauthenticated endpoint. */
export const domainsList: SerpapiEndpoints['utilitiesDomainsList'] = async (
	ctx,
) => {
	const result = await serpapiCall<SerpapiGoogleDomain[]>(
		ctx,
		'/google-domains.json',
	);
	await logEventFromContext(
		ctx,
		'serpapi.utilities.domainsList',
		{},
		'completed',
	);
	return result ?? [];
};
