import { logEventFromContext } from 'corsair/core';
import { makeDiffbotRequest } from '../client';
import type { DiffbotEndpoints } from '../index';

export const createBulk: DiffbotEndpoints['createBulk'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['createBulk']>>
	>('bulk', ctx.key, {
		method: 'POST',
		body: input.urls.join('\n'),
		query: {
			name: input.name,
			apiUrl: input.apiUrl,
			notifyEmail: input.notifyEmail,
			maxRounds: input.maxRounds,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.bulk.createBulk',
		{ name: input.name, count: input.urls.length },
		'completed',
	);
	return response;
};

export const startBulk: DiffbotEndpoints['startBulk'] = async (ctx, input) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['startBulk']>>
	>('bulk', ctx.key, {
		method: 'GET',
		query: {
			name: input.name,
			apiUrl: input.apiUrl,
			urls: input.urls,
			notifyEmail: input.notifyEmail,
			maxRounds: input.maxRounds,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.bulk.startBulk',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const stopBulkJob: DiffbotEndpoints['stopBulkJob'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['stopBulkJob']>>
	>('bulk', ctx.key, {
		method: 'GET',
		query: {
			name: input.name,
			pause: 1,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.bulk.stopBulkJob',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const getBulkData: DiffbotEndpoints['getBulkData'] = async (
	ctx,
	input,
) => {
	const format = input.format ?? 'json';
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getBulkData']>>
	>(
		`bulk/download/${encodeURIComponent(ctx.key)}-${encodeURIComponent(input.name)}.${format}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'diffbot.bulk.getBulkData',
		{ name: input.name, format },
		'completed',
	);
	return response;
};

export const listBulkJobs: DiffbotEndpoints['listBulkJobs'] = async (
	ctx,
	_input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['listBulkJobs']>>
	>('bulk', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'diffbot.bulk.listBulkJobs', {}, 'completed');
	return response;
};
