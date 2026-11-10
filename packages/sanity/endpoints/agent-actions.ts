import { logEventFromContext } from 'corsair/core';
import { makeSanityRequest, SanityError } from '../client';
import type { SanityEndpoints } from '../index';
import { resolveTarget } from './shared';
import {
	AGENT_ACTION_TIMEOUT_MS,
	SanityEndpointInputSchemas as Inputs,
	SanityEndpointOutputSchemas as Outputs,
} from './types';

/** Agent Actions are experimental and answer only on this API version. */
const AGENT_API_VERSION = 'vX';

type ActionName = 'generate' | 'transform' | 'translate' | 'prompt';

async function runAgentAction<T>(
	ctx: Parameters<SanityEndpoints['agentActionsGenerate']>[0],
	action: ActionName,
	dataset: string | undefined,
	body: Record<string, unknown>,
	accept?: 'text',
) {
	const target = await resolveTarget(ctx, dataset);
	const result = await makeSanityRequest<T>(
		ctx.key,
		{ projectId: target.projectId },
		`/agent/action/${action}/${target.dataset}`,
		{
			method: 'POST',
			apiVersion: AGENT_API_VERSION,
			body,
			accept,
			timeoutMs: AGENT_ACTION_TIMEOUT_MS,
		},
	);
	return { result, dataset: target.dataset };
}

/** The fields every document action sends, without Corsair's own (dataset). */
// unknown: copies validated input fields into the request body.
function bodyOf(input: Record<string, unknown>): Record<string, unknown> {
	const { dataset: _dataset, ...rest } = input;
	return Object.fromEntries(
		Object.entries(rest).filter(([, value]) => value !== undefined),
	);
}

export const generate: SanityEndpoints['agentActionsGenerate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.agentActionsGenerate.parse(rawInput);
	const { result, dataset } = await runAgentAction(
		ctx,
		'generate',
		input.dataset,
		bodyOf(input),
	);
	const response = Outputs.agentActionsGenerate.parse({ document: result });
	await logEventFromContext(
		ctx,
		'sanity.agentActions.generate',
		{ dataset, documentId: response.document._id, noWrite: input.noWrite },
		'completed',
	);
	return response;
};

export const transform: SanityEndpoints['agentActionsTransform'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.agentActionsTransform.parse(rawInput);
	const { result, dataset } = await runAgentAction(
		ctx,
		'transform',
		input.dataset,
		bodyOf(input),
	);
	const response = Outputs.agentActionsTransform.parse({ document: result });
	await logEventFromContext(
		ctx,
		'sanity.agentActions.transform',
		{ dataset, documentId: response.document._id, noWrite: input.noWrite },
		'completed',
	);
	return response;
};

export const translate: SanityEndpoints['agentActionsTranslate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.agentActionsTranslate.parse(rawInput);
	const { result, dataset } = await runAgentAction(
		ctx,
		'translate',
		input.dataset,
		bodyOf(input),
	);
	const response = Outputs.agentActionsTranslate.parse({ document: result });
	await logEventFromContext(
		ctx,
		'sanity.agentActions.translate',
		{
			dataset,
			documentId: response.document._id,
			toLanguage: input.toLanguage.id,
		},
		'completed',
	);
	return response;
};

export const prompt: SanityEndpoints['agentActionsPrompt'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.agentActionsPrompt.parse(rawInput);
	const format = input.format ?? 'string';
	const { result, dataset } = await runAgentAction<string>(
		ctx,
		'prompt',
		input.dataset,
		{ ...bodyOf(input), format },
		'text',
	);
	let response: ReturnType<typeof Outputs.agentActionsPrompt.parse>;
	if (format === 'json') {
		try {
			response = Outputs.agentActionsPrompt.parse({ json: JSON.parse(result) });
		} catch {
			throw new SanityError(
				'Sanity answered a json prompt with text that is not JSON.',
				'bad_response',
			);
		}
	} else {
		response = Outputs.agentActionsPrompt.parse({ text: result ?? '' });
	}
	await logEventFromContext(
		ctx,
		'sanity.agentActions.prompt',
		{ dataset, format },
		'completed',
	);
	return response;
};
