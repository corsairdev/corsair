import { logEventFromContext } from '../../utils/events';
import type { GrafanaEndpoints } from '..';
import { makeGrafanaRawRequest } from '../client';
import type { GrafanaEndpointOutputs } from './types';

export const queryPublic: GrafanaEndpoints['dashboardsQueryPublic'] = async (
	ctx,
	input,
) => {
	const grafanaUrl = input.base_url_override ?? (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['dashboardsQueryPublic'];

	try {
		const path = `/api/public/dashboards/${input.access_token}/panels/${input.panel_id}/query`;

		const body: Record<string, unknown> = {
			from: input.from,
			to: input.to,
		};
		if (input.intervalMs !== undefined) {
			body.intervalMs = input.intervalMs;
		}
		if (input.maxDataPoints !== undefined) {
			body.maxDataPoints = input.maxDataPoints;
		}

		const raw = await makeGrafanaRawRequest(path, ctx.key, grafanaUrl, {
			method: 'POST',
			body: body as unknown as Record<string, unknown>,
			contentType: 'application/json',
		});

		const success = raw.status_code >= 200 && raw.status_code < 300;

		// Attempt to parse response as JSON; fall back to storing raw content in message
		let results: Record<string, unknown> | undefined;
		try {
			// results shape is z.record(z.unknown()) — keys are RefIDs from the panel queries
			const parsed = JSON.parse(raw.content) as Record<string, unknown>;
			results = parsed.results as Record<string, unknown> | undefined ?? parsed;
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
				id: queryId,
				accessToken: input.access_token,
				panelId: input.panel_id,
				from: input.from,
				to: input.to,
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
