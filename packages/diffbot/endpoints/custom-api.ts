import { logEventFromContext } from 'corsair/core';
import { makeDiffbotRequest } from '../client';
import type { DiffbotEndpoints } from '../index';

export const createCustomApi: DiffbotEndpoints['createCustomApi'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['createCustomApi']>>
	>('custom', ctx.key, {
		method: 'POST',
		body: input.rules,
		query: {
			api: input.api,
			url: input.url,
			pattern: input.pattern,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.customApi.createCustomApi',
		{ api: input.api, url: input.url },
		'completed',
	);
	return response;
};

export const listCustomApis: DiffbotEndpoints['listCustomApis'] = async (
	ctx,
	_input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['listCustomApis']>>
	>('custom', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'diffbot.customApi.listCustomApis',
		{},
		'completed',
	);
	return response;
};

export const deleteCustomApi: DiffbotEndpoints['deleteCustomApi'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['deleteCustomApi']>>
	>('custom', ctx.key, {
		method: 'DELETE',
		query: {
			api: input.api,
			url: input.url,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.customApi.deleteCustomApi',
		{ api: input.api },
		'completed',
	);
	return response;
};
