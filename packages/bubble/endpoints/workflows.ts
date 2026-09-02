import { logEventFromContext } from 'corsair/core';
import type { BubbleEndpoints } from '../index';
import { bubbleCall, compact } from './shared';
import type { BubbleEndpointOutputs } from './types';

function normalizeWorkflowResult(
	raw: BubbleEndpointOutputs['workflowsRun'] | undefined,
): BubbleEndpointOutputs['workflowsRun'] {
	const status = raw && typeof raw.status === 'string' ? raw.status : 'success';
	return { ...raw, status };
}

/**
 * Runs an API workflow via POST. Parameters go in the JSON body.
 * https://manual.bubble.io/core-resources/api/the-bubble-api/the-workflow-api.md
 */
export const run: BubbleEndpoints['workflowsRun'] = async (ctx, input) => {
	const raw = await bubbleCall<BubbleEndpointOutputs['workflowsRun']>(
		ctx,
		`wf/${encodeURIComponent(input.workflowName)}`,
		{
			method: 'POST',
			body: input.params ?? {},
		},
	);

	const result = normalizeWorkflowResult(raw);
	await logEventFromContext(
		ctx,
		'bubble.workflows.run',
		{ workflowName: input.workflowName },
		'completed',
	);
	return result;
};

/**
 * Runs an API workflow via GET. Parameters go on the query string.
 * GET workflows are still side-effecting — do not retry them.
 */
export const runGet: BubbleEndpoints['workflowsRunGet'] = async (
	ctx,
	input,
) => {
	const raw = await bubbleCall<BubbleEndpointOutputs['workflowsRunGet']>(
		ctx,
		`wf/${encodeURIComponent(input.workflowName)}`,
		{
			method: 'GET',
			query: input.params ? compact(input.params) : undefined,
		},
	);

	const result = normalizeWorkflowResult(raw);
	await logEventFromContext(
		ctx,
		'bubble.workflows.runGet',
		{ workflowName: input.workflowName },
		'completed',
	);
	return result;
};
