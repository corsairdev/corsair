import { logEventFromContext } from 'corsair/core';
import { LLM_GATEWAY_BASE } from '../client';
import type { HuggingFaceEndpoints } from '../index';
import { req, summarize } from './helpers';

export const chatCompletion: HuggingFaceEndpoints['inferenceChatCompletion'] =
	async (ctx, input) => {
		const { extra, maxTokens, ...rest } = input;
		// Drop stream from free-form extra — JSON client cannot parse SSE bodies.
		const { stream: _stream, ...safeExtra } = (extra ?? {}) as {
			stream?: unknown;
		} & Record<string, unknown>;
		const response = await req(ctx, '/v1/chat/completions', {
			method: 'POST',
			baseUrl: LLM_GATEWAY_BASE,
			body: {
				...rest,
				max_tokens: maxTokens,
				...safeExtra,
				// always non-stream: corsair/http expects a JSON body
				stream: false,
			},
		});
		await logEventFromContext(
			ctx,
			'huggingface.inference.chatCompletion',
			summarize(input),
			'completed',
		);
		return response;
	};

export const embeddings: HuggingFaceEndpoints['inferenceEmbeddings'] = async (
	ctx,
	input,
) => {
	const { extra, ...rest } = input;
	const response = await req(ctx, '/v1/embeddings', {
		method: 'POST',
		baseUrl: LLM_GATEWAY_BASE,
		body: { ...rest, ...extra },
	});
	await logEventFromContext(
		ctx,
		'huggingface.inference.embeddings',
		summarize(input),
		'completed',
	);
	return response;
};
