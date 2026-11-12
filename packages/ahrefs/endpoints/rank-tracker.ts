import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';
import type { RankTrackerOverviewResponse } from './types';
import { AhrefsEndpointInputSchemas } from './types';

export const overview: AhrefsEndpoints['rankTrackerOverview'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<RankTrackerOverviewResponse>(
		'/rank-tracker/overview',
		ctx.key,
		{ query: AhrefsEndpointInputSchemas.rankTrackerOverview.parse(input) },
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

export const serpOverview: AhrefsEndpoints['rankTrackerSerpOverview'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'rankTrackerSerpOverview',
			method: 'GET',
			path: '/rank-tracker/serp-overview',
			event: 'ahrefs.rankTracker.serpOverview',
			logKeys: ['project_id', 'keyword', 'country', 'date'],
		},
		input,
	);

export const competitorsOverview: AhrefsEndpoints['rankTrackerCompetitorsOverview'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'rankTrackerCompetitorsOverview',
				method: 'GET',
				path: '/rank-tracker/competitors-overview',
				event: 'ahrefs.rankTracker.competitorsOverview',
				logKeys: ['project_id', 'date'],
			},
			input,
		);

export const competitorsDomains: AhrefsEndpoints['rankTrackerCompetitorsDomains'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'rankTrackerCompetitorsDomains',
				method: 'GET',
				path: '/rank-tracker/competitors-domains',
				event: 'ahrefs.rankTracker.competitorsDomains',
				logKeys: ['project_id', 'date'],
			},
			input,
		);

export const competitorsPages: AhrefsEndpoints['rankTrackerCompetitorsPages'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'rankTrackerCompetitorsPages',
				method: 'GET',
				path: '/rank-tracker/competitors-pages',
				event: 'ahrefs.rankTracker.competitorsPages',
				logKeys: ['project_id', 'date'],
			},
			input,
		);

export const competitorsStats: AhrefsEndpoints['rankTrackerCompetitorsStats'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'rankTrackerCompetitorsStats',
				method: 'GET',
				path: '/rank-tracker/competitors-stats',
				event: 'ahrefs.rankTracker.competitorsStats',
				logKeys: ['project_id', 'date'],
			},
			input,
		);
