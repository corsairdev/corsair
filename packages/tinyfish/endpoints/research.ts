import type { TinyFishEndpoints } from '..';
import { makeTinyFishRequest } from '../client';
import { callTinyFish } from './call';
import {
	TinyFishEndpointInputSchemas,
	TinyFishEndpointOutputSchemas,
} from './types';

export const start: TinyFishEndpoints['startResearch'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.research.start',
		TinyFishEndpointInputSchemas.startResearch,
		TinyFishEndpointOutputSchemas.startResearch,
		input,
		(validated) =>
			makeTinyFishRequest(
				'agent',
				'/v1/automation/run-research-async',
				ctx.key,
				{ method: 'POST', body: validated },
			),
		(validated, response) => ({
			researchRunId: response.research_run_id,
			accepted: response.error === null,
			mode: validated.mode ?? 'deep',
			stream: validated.stream ?? false,
		}),
	);
};

export const list: TinyFishEndpoints['listResearchRuns'] = async (
	ctx,
	input,
) => {
	return callTinyFish(
		ctx,
		'tinyfish.research.list',
		TinyFishEndpointInputSchemas.listResearchRuns,
		TinyFishEndpointOutputSchemas.listResearchRuns,
		input,
		(validated) =>
			makeTinyFishRequest('agent', '/v1/research-run', ctx.key, {
				method: 'GET',
				query: {
					status: validated.status,
					query: validated.query,
					created_after: validated.created_after,
					created_before: validated.created_before,
					sort_direction: validated.sort_direction,
					cursor: validated.cursor,
					limit: validated.limit,
				},
			}),
		(_validated, response) => ({
			count: response.data.length,
			total: response.pagination.total,
			hasMore: response.pagination.has_more,
		}),
	);
};

export const get: TinyFishEndpoints['getResearchRun'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.research.get',
		TinyFishEndpointInputSchemas.getResearchRun,
		TinyFishEndpointOutputSchemas.getResearchRun,
		input,
		(validated) =>
			makeTinyFishRequest(
				'agent',
				`/v1/research-run/${encodeURIComponent(validated.researchRunId)}`,
				ctx.key,
				{ method: 'GET' },
			),
		(_validated, response) => ({
			researchRunId: response.research_run_id,
			status: response.status,
			evidenceCount: response.evidence?.length ?? 0,
			hasDeepResult: response.deep_result !== null,
		}),
	);
};

export const cancel: TinyFishEndpoints['cancelResearchRun'] = async (
	ctx,
	input,
) => {
	return callTinyFish(
		ctx,
		'tinyfish.research.cancel',
		TinyFishEndpointInputSchemas.cancelResearchRun,
		TinyFishEndpointOutputSchemas.cancelResearchRun,
		input,
		(validated) =>
			makeTinyFishRequest(
				'agent',
				`/v1/research-run/${encodeURIComponent(validated.researchRunId)}/cancel`,
				ctx.key,
				{ method: 'POST' },
			),
		(_validated, response) => ({
			researchRunId: response.research_run_id,
			status: response.status,
			cancelled: response.cancelled,
		}),
	);
};
