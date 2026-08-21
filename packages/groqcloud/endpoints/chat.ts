import { logEventFromContext } from 'corsair/core';
import { GroqcloudAPIError, makeGroqcloudRequest } from '../client';
import type { GroqcloudEndpoints } from '../index';
import type {
	ChatCreateCompletionResponse,
	ChatCreateResponseOutput,
} from '../schema/chat';

export const createCompletion: GroqcloudEndpoints['chatCreateCompletion'] =
	async (ctx, input) => {
		// Enforced here, not only in the schema: the endpoint binder does not
		// parse endpoint schemas, so a declared `stream: false` is metadata only.
		// Forwarding `stream: true` would make the buffered transport return a
		// raw text/event-stream string instead of the completion object this
		// operation promises.
		// The declared type is `false | undefined`, but the binder forwards input
		// unvalidated, so a caller can still send `true` at runtime.
		if ((input as { stream?: unknown }).stream === true) {
			throw new GroqcloudAPIError(
				'Streaming is not supported by this operation: the shared transport buffers text/event-stream as plain text. Omit `stream` or set it to false.',
			);
		}

		const result = await makeGroqcloudRequest<ChatCreateCompletionResponse>(
			'chat/completions',
			ctx.key,
			{
				method: 'POST',
				body: input,
			},
		);

		await logEventFromContext(
			ctx,
			'groqcloud.chat.createCompletion',
			{ model: input.model },
			'completed',
		);

		return result;
	};

export const createResponse: GroqcloudEndpoints['chatCreateResponse'] = async (
	ctx,
	input,
) => {
	const result = await makeGroqcloudRequest<ChatCreateResponseOutput>(
		'responses',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'groqcloud.chat.createResponse',
		{ model: input.model },
		'completed',
	);

	return result;
};
