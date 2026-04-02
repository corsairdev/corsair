import { logEventFromContext } from '../../utils/events';
import type { AhrefsEndpoints } from '..';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpointOutputs } from './types';

export const getCompetitorsOverview: AhrefsEndpoints['rankTrackerCompetitorsOverview'] =
	async (ctx, input) => {
		const result = await makeAhrefsRequest<
			AhrefsEndpointOutputs['rankTrackerCompetitorsOverview']
		>('/v3/rank-tracker/competitors-overview', ctx.key, { query: { ...input } });

		if (result.successful && result.data?.competitors && ctx.db.domainRatings) {
			try {
				for (const competitor of result.data.competitors) {
					// competitor is Record<string, unknown>; competitor field is the domain name
					const domain = competitor['competitor'] as string | undefined;
					const domain_rating = competitor['domain_rating'] as number | undefined;
					if (domain) {
						await ctx.db.domainRatings.upsertByEntityId(
							`rankTracker:competitor:${domain}:${input.date}`,
							{
								id: `rankTracker:competitor:${domain}:${input.date}`,
								target: domain,
								date: input.date,
								...(domain_rating !== undefined ? { domain_rating } : {}),
								fetchedAt: new Date(),
							},
						);
					}
				}
			} catch (error) {
				console.warn('[ahrefs] Failed to save rank tracker competitors:', error);
			}
		}

		await logEventFromContext(ctx, 'ahrefs.rankTracker.getCompetitorsOverview', { ...input }, 'completed');
		return result;
	};

export const getOverview: AhrefsEndpoints['rankTrackerOverview'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['rankTrackerOverview']
	>('/v3/rank-tracker/overview', ctx.key, { query: { ...input } });

	if (result.successful && result.data && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(
				`rankTracker:${input.project_id}:${input.date}:${input.device}`,
				{
					id: `rankTracker:${input.project_id}:${input.date}:${input.device}`,
					// Store project as target identifier
					target: String(input.project_id),
					date: input.date,
					fetchedAt: new Date(),
				},
			);
		} catch (error) {
			console.warn('[ahrefs] Failed to save rank tracker overview:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.rankTracker.getOverview', { ...input }, 'completed');
	return result;
};
