import { logEventFromContext } from 'corsair/core';
import type { GrafanaEndpoints } from '..';
import { makeGrafanaRawRequest } from '../client';
import type { GrafanaEndpointOutputs } from './types';

export const queryPublic: GrafanaEndpoints['dashboardsQueryPublic'] = async (
	ctx,
	input,
) => {
	const grafanaUrl =
		input.base_url_override ?? (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['dashboardsQueryPublic'];

	try {
		const path = `/api/public/dashboards/${input.access_token}/panels/${input.panel_id}/query`;

		const body: Record<string, unknown> = {
			from: input.from,
			to: input.to,
			...(input.intervalMs !== undefined && { intervalMs: input.intervalMs }),
			...(input.maxDataPoints !== undefined && {
				maxDataPoints: input.maxDataPoints,
			}),
		};

		const raw = await makeGrafanaRawRequest(path, ctx.key, grafanaUrl, {
			method: 'POST',
			body,
			contentType: 'application/json',
		});

		const success = raw.status_code >= 200 && raw.status_code < 300;

		// Attempt to parse response as JSON; fall back to storing raw content in message
		let results: any;
		try {
			const parsed = JSON.parse(raw.content);
			results = parsed.results ?? parsed;
		} catch {
			// JSON parse failed — content is not valid JSON (e.g. HTML error page)
		}

		result = {
			data: {
				status_code: raw.status_code,
				message: success ? undefined : raw.content,
				results,
			},
			successful: success,
		};
	} catch (error) {
		result = {
			data: {
				status_code: 0,
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			error: error instanceof Error ? error.message : 'Unknown error',
			successful: false,
		};
	}

	if (result.successful && ctx.db.dashboardQueries) {
		try {
			const queryId = `${input.access_token}-${input.panel_id}`;
			await ctx.db.dashboardQueries.upsertByEntityId(queryId, {
				...input,
				id: queryId,
				accessToken: input.access_token,
				panelId: input.panel_id,
				results: result.data.results,
				queriedAt: new Date(),
			});
		} catch (err) {
			console.warn('Failed to save dashboard query to database:', err);
		}
	}

	await logEventFromContext(
		ctx,
		'grafana.dashboards.queryPublic',
		{ access_token: input.access_token, panel_id: input.panel_id },
		'completed',
	);
	return result;
};
