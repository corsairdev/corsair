import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';
import type {
	RankTrackerCompetitorsDomainsResponse,
	RankTrackerCompetitorsOverviewResponse,
	RankTrackerCompetitorsPagesResponse,
	RankTrackerCompetitorsStatsResponse,
	RankTrackerOverviewResponse,
	RankTrackerSerpOverviewResponse,
} from './types';

export const overview: AhrefsEndpoints['rankTrackerOverview'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<RankTrackerOverviewResponse>(
		'/rank-tracker/overview',
		ctx.key,
		{ query: input },
	);

	for (const overview of response.overviews) {
		const keyword = overview.keyword ?? 'unknown';

		try {
			const entityId = [
				input.project_id,
				input.device,
				input.date,
				overview.country ?? 'unknown',
				keyword,
			].join(':');

			await ctx.db.rankings.upsertByEntityId(entityId, {
				...overview,
				project_id: input.project_id,
				device: input.device,
				date: input.date,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[ahrefs] Failed to save rank tracker row ${keyword}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'ahrefs.rankTracker.overview',
		{
			project_id: input.project_id,
			device: input.device,
			date: input.date,
			resultCount: response.overviews.length,
		},
		'completed',
	);

	return response;
};

export const serpOverview: AhrefsEndpoints['rankTrackerSerpOverview'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<RankTrackerSerpOverviewResponse>(
		'/rank-tracker/serp-overview',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.rankTracker.serpOverview',
		{
			project_id: input.project_id,
			keyword: input.keyword,
			country: input.country,
			date: input.date,
			resultCount: response.positions.length,
		},
		'completed',
	);

	return response;
};

export const competitorsOverview: AhrefsEndpoints['rankTrackerCompetitorsOverview'] =
	async (ctx, input) => {
		const response =
			await makeAhrefsRequest<RankTrackerCompetitorsOverviewResponse>(
				'/rank-tracker/competitors-overview',
				ctx.key,
				{
					query: input,
				},
			);

		await logEventFromContext(
			ctx,
			'ahrefs.rankTracker.competitorsOverview',
			{
				project_id: input.project_id,
				date: input.date,
				resultCount: response.keywords.length,
			},
			'completed',
		);

		return response;
	};

export const competitorsDomains: AhrefsEndpoints['rankTrackerCompetitorsDomains'] =
	(ctx, input) =>
		callAhrefs<RankTrackerCompetitorsDomainsResponse>(
			ctx,
			{
				method: 'GET',
				path: '/rank-tracker/competitors-domains',
				event: 'ahrefs.rankTracker.competitorsDomains',
				logKeys: ['project_id', 'date'],
			},
			input,
		);

export const competitorsPages: AhrefsEndpoints['rankTrackerCompetitorsPages'] =
	(ctx, input) =>
		callAhrefs<RankTrackerCompetitorsPagesResponse>(
			ctx,
			{
				method: 'GET',
				path: '/rank-tracker/competitors-pages',
				event: 'ahrefs.rankTracker.competitorsPages',
				logKeys: ['project_id', 'date'],
			},
			input,
		);

export const competitorsStats: AhrefsEndpoints['rankTrackerCompetitorsStats'] =
	(ctx, input) =>
		callAhrefs<RankTrackerCompetitorsStatsResponse>(
			ctx,
			{
				method: 'GET',
				path: '/rank-tracker/competitors-stats',
				event: 'ahrefs.rankTracker.competitorsStats',
				logKeys: ['project_id', 'date'],
			},
			input,
		);
