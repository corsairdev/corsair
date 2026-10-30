import { logEventFromContext } from 'corsair/core';
import { makeSynthflowAiRequest } from '../client';
import type { SynthflowAiEndpoints } from '../index';
import type { SynthflowAiEndpointOutputs } from './types';

export const create: SynthflowAiEndpoints['phoneBooksCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['phoneBooksCreate']
	>('phonebooks', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.phoneBooks.create',
		{ name: input.name },
		'completed',
	);

	return response;
};

export const list: SynthflowAiEndpoints['phoneBooksList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit !== undefined) query.limit = input.limit;
	if (input?.offset !== undefined) query.offset = input.offset;

	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['phoneBooksList']
	>('phonebooks', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.phoneBooks.list',
		input ? { limit: input.limit, offset: input.offset } : {},
		'completed',
	);

	return response;
};

export const deletePhoneBook: SynthflowAiEndpoints['phoneBooksDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['phoneBooksDelete']
	>(`phonebooks/${input.phone_book_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'synthflowai.phoneBooks.delete',
		{ phone_book_id: input.phone_book_id },
		'completed',
	);

	return response;
};
