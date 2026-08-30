import { logEventFromContext } from 'corsair/core';
import type { BubbleEndpoints } from '../index';
import { bubbleCall } from './shared';
import type { BubbleEndpointOutputs } from './types';

/**
 * Runs an API workflow. POSTs the workflow's parameters as JSON in the
 * request body (the standard webhook-style invocation), authenticated with
 * the app's admin token.
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

	// The Workflow API answers with whatever the workflow's "Return data
	// from API" action defines (default `{"status":"success"}`); a work-
	// flow that returns nothing yields an empty body, normalised here.
	const status = raw && typeof raw.status === 'string' ? raw.status : 'success';

	await logEventFromContext(
		ctx,
		'bubble.workflows.run',
		{ workflowName: input.workflowName },
		'completed',
	);
	return { ...raw, status };
};
