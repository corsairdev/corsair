import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheConference } from './persist';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataConference,
	CollegeFootballDataTeamConferenceAffiliation,
} from './types';

/** Lists all conferences across every NCAA division. */
export const list: CollegeFootballDataEndpoints['conferencesList'] = async (
	ctx,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataConference[]>(
		ctx,
		'/conferences',
	);

	await Promise.all(
		(result ?? []).map((conference) =>
			cacheConference(ctx.db?.conferences, conference),
		),
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.conferences.list',
		{},
		'completed',
	);
	return result ?? [];
};

/**
 * Lists team conference memberships, optionally filtered by team/conference/
 * year range. Confirmed live: both this and `listDivisions` read the same
 * `GET /conferences/affiliations` route, which carries membership,
 * division, and active-year span in one record - see `types.ts`.
 */
export const listMemberships: CollegeFootballDataEndpoints['conferencesListMemberships'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataTeamConferenceAffiliation[]
		>(ctx, '/conferences/affiliations', {
			query: compactQuery({
				team: input.team,
				conference: input.conference,
				year: input.year,
				minYear: input.minYear,
				maxYear: input.maxYear,
				classification: input.classification,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.conferences.listMemberships',
			auditPayload(input, ['conference', 'year']),
			'completed',
		);
		return result ?? [];
	};

/** Lists conference divisions with active years. Same route as `listMemberships`. */
export const listDivisions: CollegeFootballDataEndpoints['conferencesListDivisions'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataTeamConferenceAffiliation[]
		>(ctx, '/conferences/affiliations', {
			query: compactQuery({
				team: input.team,
				conference: input.conference,
				year: input.year,
				minYear: input.minYear,
				maxYear: input.maxYear,
				classification: input.classification,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.conferences.listDivisions',
			auditPayload(input, ['conference', 'year']),
			'completed',
		);
		return result ?? [];
	};
