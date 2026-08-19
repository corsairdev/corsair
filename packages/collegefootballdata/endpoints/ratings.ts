import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataConferenceSPRating,
	CollegeFootballDataEloRating,
	CollegeFootballDataFPIRating,
	CollegeFootballDataSPRating,
	CollegeFootballDataSRSRating,
} from './types';

/** Gets Elo ratings by season or team. */
export const getElo: CollegeFootballDataEndpoints['ratingsGetElo'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataEloRating[]>(
		ctx,
		'/ratings/elo',
		{
			query: compactQuery({
				year: input.year,
				team: input.team,
				conference: input.conference,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.ratings.getElo',
		auditPayload(input, ['year', 'team']),
		'completed',
	);
	return result ?? [];
};

/** Gets ESPN FPI (Football Power Index) ratings. */
export const getFPI: CollegeFootballDataEndpoints['ratingsGetFPI'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataFPIRating[]>(
		ctx,
		'/ratings/fpi',
		{
			query: compactQuery({
				year: input.year,
				team: input.team,
				conference: input.conference,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.ratings.getFPI',
		auditPayload(input, ['year', 'team']),
		'completed',
	);
	return result ?? [];
};

/** Gets SP+ team ratings. */
export const getSP: CollegeFootballDataEndpoints['ratingsGetSP'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataSPRating[]>(
		ctx,
		'/ratings/sp',
		{ query: compactQuery({ year: input.year, team: input.team }) },
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.ratings.getSP',
		auditPayload(input, ['year', 'team']),
		'completed',
	);
	return result ?? [];
};

/** Gets SP+ ratings aggregated by conference. */
export const getConferenceSP: CollegeFootballDataEndpoints['ratingsGetConferenceSP'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataConferenceSPRating[]
		>(ctx, '/ratings/sp/conferences', {
			query: compactQuery({
				year: input.year,
				conference: input.conference,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.ratings.getConferenceSP',
			auditPayload(input, ['year', 'conference']),
			'completed',
		);
		return result ?? [];
	};

/** Gets SRS (Simple Rating System) ratings. Either `year` or `team` must be provided. */
export const getSRS: CollegeFootballDataEndpoints['ratingsGetSRS'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataSRSRating[]>(
		ctx,
		'/ratings/srs',
		{
			query: compactQuery({
				year: input.year,
				team: input.team,
				conference: input.conference,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.ratings.getSRS',
		auditPayload(input, ['year', 'team']),
		'completed',
	);
	return result ?? [];
};
