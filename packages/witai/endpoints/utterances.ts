import { logEventFromContext } from 'corsair/core';
import type { WitAiEndpoints } from '..';
import { makeWitAiRequest } from '../client';
import type { WitAiEndpointOutputs } from './types';

export const listUtterances: WitAiEndpoints['utterancesListUtterances'] =
	async (ctx, input) => {
		const result = await makeWitAiRequest<
			WitAiEndpointOutputs['utterancesListUtterances']
		>('utterances', ctx.key, {
			method: 'GET',
			query: {
				limit: input.limit,
				offset: input.offset,
				intent_id: input.intent_id,
			},
		});
		await logEventFromContext(
			ctx,
			'witai.utterances.listUtterances',
			{},
			'completed',
		);
		return result;
	};

export const createUtterances: WitAiEndpoints['utterancesCreateUtterances'] =
	async (ctx, input) => {
		const result = await makeWitAiRequest<
			WitAiEndpointOutputs['utterancesCreateUtterances']
		>('utterances', ctx.key, {
			method: 'POST',
			body: input.utterances as unknown as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'witai.utterances.createUtterances',
			{ count: input.utterances.length },
			'completed',
		);
		return result;
	};

export const deleteUtterances: WitAiEndpoints['utterancesDeleteUtterances'] =
	async (ctx, input) => {
		const result = await makeWitAiRequest<
			WitAiEndpointOutputs['utterancesDeleteUtterances']
		>('utterances', ctx.key, {
			method: 'DELETE',
			body: input.texts.map((text) => ({ text })) as unknown as Record<
				string,
				unknown
			>,
		});
		await logEventFromContext(
			ctx,
			'witai.utterances.deleteUtterances',
			{ count: input.texts.length },
			'completed',
		);
		return result;
	};
