import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Knowledge base management has no published v3 equivalent per developers.heygen.com/
// endpoint-version-comparison, so these operations stay on their confirmed v1 paths.

// [B] Path inferred as `/v1/streaming/knowledge_base/create`; see endpoints/types.ts.
export const create: HeygenEndpoints['knowledgeBasesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['knowledgeBasesCreate']
	>('/v1/streaming/knowledge_base/create', ctx.key, {
		method: 'POST',
		body: input,
	});

	// Never log `opening` or `prompt` (the AI behavior configuration) — only the name.
	await logEventFromContext(
		ctx,
		'heygen.knowledgeBases.create',
		{ name: input.name },
		'completed',
	);
	return result;
};

// [B] Path inferred as `/v1/streaming/knowledge_base/list`; see endpoints/types.ts.
export const list: HeygenEndpoints['knowledgeBasesList'] = async (ctx) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['knowledgeBasesList']
	>('/v1/streaming/knowledge_base/list', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'heygen.knowledgeBases.list', {}, 'completed');
	return result;
};

// [B] Path inferred as `/v1/streaming/knowledge_base/update`; see endpoints/types.ts.
export const update: HeygenEndpoints['knowledgeBasesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['knowledgeBasesUpdate']
	>('/v1/streaming/knowledge_base/update', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'heygen.knowledgeBases.update',
		{ knowledgeBaseId: input.knowledge_base_id },
		'completed',
	);
	return result;
};

// [B] Path inferred as `/v1/streaming/knowledge_base/delete`; see endpoints/types.ts.
export const deleteKnowledgeBase: HeygenEndpoints['knowledgeBasesDelete'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['knowledgeBasesDelete']
		>('/v1/streaming/knowledge_base/delete', ctx.key, {
			method: 'DELETE',
			query: { knowledge_base_id: input.knowledge_base_id },
		});

		await logEventFromContext(
			ctx,
			'heygen.knowledgeBases.delete',
			{ knowledgeBaseId: input.knowledge_base_id },
			'completed',
		);
		return result;
	};
