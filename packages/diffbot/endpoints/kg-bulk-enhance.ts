import { logEventFromContext } from 'corsair/core';
import { makeDiffbotRequest } from '../client';
import type { DiffbotEndpoints } from '../index';

export const createKgBulkEnhance: DiffbotEndpoints['createKgBulkEnhance'] =
	async (ctx, input) => {
		const response = await makeDiffbotRequest<
			Awaited<ReturnType<DiffbotEndpoints['createKgBulkEnhance']>>
		>('enhance/bulk', ctx.key, {
			method: 'POST',
			useKgBase: true,
			body: input.entities,
			query: {
				notifyEmail: input.notifyEmail,
				name: input.name,
			},
		});

		await logEventFromContext(
			ctx,
			'diffbot.kgBulkEnhance.createKgBulkEnhance',
			{ name: input.name, count: input.entities.length },
			'completed',
		);
		return response;
	};

export const getBulkJobStatus: DiffbotEndpoints['getBulkJobStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getBulkJobStatus']>>
	>(`enhance/bulk/${encodeURIComponent(input.bulkjobId)}/status`, ctx.key, {
		method: 'GET',
		useKgBase: true,
	});

	await logEventFromContext(
		ctx,
		'diffbot.kgBulkEnhance.getBulkJobStatus',
		{ bulkjobId: input.bulkjobId },
		'completed',
	);
	return response;
};

export const listBulkJobsStatusForToken: DiffbotEndpoints['listBulkJobsStatusForToken'] =
	async (ctx, _input) => {
		const response = await makeDiffbotRequest<
			Awaited<ReturnType<DiffbotEndpoints['listBulkJobsStatusForToken']>>
		>('enhance/bulk', ctx.key, {
			method: 'GET',
			useKgBase: true,
		});

		await logEventFromContext(
			ctx,
			'diffbot.kgBulkEnhance.listBulkJobsStatusForToken',
			{},
			'completed',
		);
		return response;
	};

export const getBulkResults: DiffbotEndpoints['getBulkResults'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getBulkResults']>>
	>(`enhance/bulk/${encodeURIComponent(input.bulkjobId)}`, ctx.key, {
		method: 'GET',
		useKgBase: true,
		query: {
			format: input.format,
			head: input.head,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.kgBulkEnhance.getBulkResults',
		{ bulkjobId: input.bulkjobId, format: input.format },
		'completed',
	);
	return response;
};

export const downloadBulkResults: DiffbotEndpoints['downloadBulkResults'] =
	async (ctx, input) => {
		const response = await makeDiffbotRequest<
			Awaited<ReturnType<DiffbotEndpoints['downloadBulkResults']>>
		>(`enhance/bulk/${encodeURIComponent(input.bulkjobId)}`, ctx.key, {
			method: 'POST',
			useKgBase: true,
			query: {
				format: input.format,
				filter: input.filter,
				fields: input.fields,
				head: input.head,
			},
		});

		await logEventFromContext(
			ctx,
			'diffbot.kgBulkEnhance.downloadBulkResults',
			{ bulkjobId: input.bulkjobId, format: input.format },
			'completed',
		);
		return response;
	};

export const getBulkSingleResult: DiffbotEndpoints['getBulkSingleResult'] =
	async (ctx, input) => {
		const response = await makeDiffbotRequest<
			Awaited<ReturnType<DiffbotEndpoints['getBulkSingleResult']>>
		>(
			`enhance/bulk/${encodeURIComponent(input.bulkjobId)}/${input.jobIndex}`,
			ctx.key,
			{
				method: 'GET',
				useKgBase: true,
			},
		);

		await logEventFromContext(
			ctx,
			'diffbot.kgBulkEnhance.getBulkSingleResult',
			{ bulkjobId: input.bulkjobId, jobIndex: input.jobIndex },
			'completed',
		);
		return response;
	};

export const stopKgBulkJobById: DiffbotEndpoints['stopKgBulkJobById'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['stopKgBulkJobById']>>
	>(`enhance/bulk/${encodeURIComponent(input.bulkjobId)}/stop`, ctx.key, {
		method: 'GET',
		useKgBase: true,
	});

	await logEventFromContext(
		ctx,
		'diffbot.kgBulkEnhance.stopKgBulkJobById',
		{ bulkjobId: input.bulkjobId },
		'completed',
	);
	return response;
};

export const deleteKgEnhanceBulkjob: DiffbotEndpoints['deleteKgEnhanceBulkjob'] =
	async (ctx, input) => {
		const response = await makeDiffbotRequest<
			Awaited<ReturnType<DiffbotEndpoints['deleteKgEnhanceBulkjob']>>
		>(`enhance/bulk/${encodeURIComponent(input.bulkjobId)}/delete`, ctx.key, {
			method: 'GET',
			useKgBase: true,
		});

		await logEventFromContext(
			ctx,
			'diffbot.kgBulkEnhance.deleteKgEnhanceBulkjob',
			{ bulkjobId: input.bulkjobId },
			'completed',
		);
		return response;
	};
