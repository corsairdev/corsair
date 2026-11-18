import type { VectorshiftEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	VectorshiftEndpointInputSchemas as Inputs,
	VectorshiftEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Creates a chatbot over a pipeline. Every top-level field is required by the
 * API — the four config objects, `deployed`, and the input/output node names —
 * so the schema keeps them required rather than defaulting them, since a wrong
 * node name produces a chatbot that silently answers nothing.
 */
export const create: VectorshiftEndpoints['chatbotsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'chatbots.create',
			input: Inputs.chatbotsCreate,
			output: Outputs.chatbotsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/chatbot', body }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				name: parsed.name,
				pipeline: parsed.pipeline.id,
			}),
		},
	);

/**
 * Sends one message. The reply carries a `conversation_id` that continues the
 * thread, so a caller keeps state rather than the plugin.
 *
 * `stream: true` is not offered: the plugin reads JSON, and a streamed answer
 * would have to be consumed as server-sent events.
 */
export const run: VectorshiftEndpoints['chatbotsRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'chatbots.run',
			input: Inputs.chatbotsRun,
			output: Outputs.chatbotsRun,
		},
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: `/chatbot/${segment(id)}/run`,
			body,
		}),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				conversation: result.conversation_id ?? undefined,
				// The reply text is the user's content, so only its presence.
				replied: (result.output_message ?? '').length > 0,
				followUps: result.follow_up_questions?.length ?? 0,
			}),
		},
	);
