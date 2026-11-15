import { logEventFromContext } from 'corsair/core';
import type { MinimaxEndpoints } from '..';
import { makeMinimaxRequest } from '../client';
import type {
	SpeechCreateAsyncTaskOutput,
	SpeechQueryAsyncTaskOutput,
	T2aOutput,
} from './types';
import {
	MinimaxEndpointInputSchemas,
	MinimaxEndpointOutputSchemas,
} from './types';

export const t2a: MinimaxEndpoints['speechT2a'] = async (ctx, input) => {
	const parsedInput = MinimaxEndpointInputSchemas.speechT2a.parse(input);

	const response = await makeMinimaxRequest<T2aOutput>('/v1/t2a_v2', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed = MinimaxEndpointOutputSchemas.speechT2a.parse(response);

	// The text is user content; only the model and its length are logged.
	await logEventFromContext(
		ctx,
		'minimax.speech.t2a',
		{ model: parsedInput.model, characters: parsedInput.text.length },
		'completed',
	);

	return parsed;
};

export const createAsyncTask: MinimaxEndpoints['speechCreateAsyncTask'] =
	async (ctx, input) => {
		const parsedInput =
			MinimaxEndpointInputSchemas.speechCreateAsyncTask.parse(input);

		const response = await makeMinimaxRequest<SpeechCreateAsyncTaskOutput>(
			'/v1/t2a_async_v2',
			ctx.key,
			{ method: 'POST', body: parsedInput },
		);

		const parsed =
			MinimaxEndpointOutputSchemas.speechCreateAsyncTask.parse(response);

		await logEventFromContext(
			ctx,
			'minimax.speech.createAsyncTask',
			{
				model: parsedInput.model,
				characters: parsedInput.text?.length ?? 0,
				hasFileInput: parsedInput.text_file_id !== undefined,
			},
			'completed',
		);

		return parsed;
	};

export const queryAsyncTask: MinimaxEndpoints['speechQueryAsyncTask'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MinimaxEndpointInputSchemas.speechQueryAsyncTask.parse(input);

	const response = await makeMinimaxRequest<SpeechQueryAsyncTaskOutput>(
		'/v1/query/t2a_async_query_v2',
		ctx.key,
		{ method: 'GET', query: { task_id: parsedInput.task_id } },
	);

	const parsed =
		MinimaxEndpointOutputSchemas.speechQueryAsyncTask.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.speech.queryAsyncTask',
		{ status: parsed.status },
		'completed',
	);

	return parsed;
};
