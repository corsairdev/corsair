import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { SEASON_TYPES } from './types';

/**
 * Returns the static season-type vocabulary. Confirmed against the
 * provider's own OpenAPI document: no endpoint anywhere serves this data -
 * the `SeasonType` enum exists only as a request-parameter schema, referenced
 * by `seasonType` filters across dozens of other operations, never as a
 * response body of its own. Returning
 * it here, rather than omitting the operation, matches the catalog's own
 * framing: "Use this to discover valid seasonType values to pass to other
 * endpoints."
 *
 * `year` is accepted (matching the catalog's input contract) but not used -
 * every value in this vocabulary is valid for every year the API covers,
 * confirmed from the spec, which defines `SeasonType` as a single global
 * enum with no per-year variant.
 */
export const list: CollegeFootballDataEndpoints['seasonTypesList'] = async (
	ctx,
	input,
) => {
	await logEventFromContext(
		ctx,
		'collegefootballdata.seasonTypes.list',
		auditPayload(input, ['year']),
		'completed',
	);
	return [...SEASON_TYPES];
};
