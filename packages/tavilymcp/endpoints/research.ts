import { logEventFromContext } from 'corsair/core';
import { makeTavilyMcpRequest } from '../client';
import type { TavilyMcpEndpoints } from '../index';
import type { TavilyResearchResponse } from './types';
import {
	TavilyResearchRequestSchema,
	TavilyResearchResponseSchema,
} from './types';

const DEFAULT_MAX_WAIT_MS = 300_000;
const DEFAULT_POLL_INTERVAL_MS = 5_000;

/**
 * Research is asynchronous: POST /research queues a task and returns a
 * request_id, then GET /research/{request_id} is polled until the task
 * reaches a terminal status ('completed' or 'failed') or the wait budget
 * runs out. The last observed task state is returned either way.
 */
export const research: TavilyMcpEndpoints['research'] = async (ctx, input) => {
	const {
		max_wait_ms = DEFAULT_MAX_WAIT_MS,
		poll_interval_ms = DEFAULT_POLL_INTERVAL_MS,
		...body
	} = TavilyResearchRequestSchema.parse(input);

	const created = TavilyResearchResponseSchema.parse(
		await makeTavilyMcpRequest<TavilyResearchResponse>('research', ctx.key, {
			method: 'POST',
			body: { ...body, stream: false },
		}),
	);

	const deadline = Date.now() + max_wait_ms;
	let task = created;

	while (
		task.status !== 'completed' &&
		task.status !== 'failed' &&
		Date.now() + poll_interval_ms <= deadline
	) {
		await new Promise((resolve) => setTimeout(resolve, poll_interval_ms));
		task = TavilyResearchResponseSchema.parse(
			await makeTavilyMcpRequest<TavilyResearchResponse>(
				`research/${created.request_id}`,
				ctx.key,
				{ method: 'GET' },
			),
		);
	}

	// Status polls omit the fields only the create call returns.
	const response: TavilyResearchResponse = {
		...task,
		request_id: created.request_id,
		input: task.input ?? created.input ?? body.input,
		model: task.model ?? created.model,
		created_at: task.created_at ?? created.created_at,
	};

	if (response.status === 'completed') {
		try {
			await ctx.db.researchResults.upsertByEntityId(response.request_id, {
				requestId: response.request_id,
				input: body.input,
				status: response.status,
				content:
					typeof response.content === 'string'
						? response.content
						: response.content
							? JSON.stringify(response.content)
							: null,
				sources: response.sources ?? [],
				researchedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[tavilymcp] Failed to save research result ${response.request_id}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'tavilymcp.tavily.research',
		{
			requestId: response.request_id,
			status: response.status,
			sourceCount: response.sources?.length ?? 0,
		},
		response.status === 'failed' ? 'failed' : 'completed',
	);

	return response;
};
