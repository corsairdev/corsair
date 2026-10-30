import { logEventFromContext } from 'corsair/core';
import { makeDiffbotRequest } from '../client';
import type { DiffbotEndpoints } from '../index';

export const enhanceEntity: DiffbotEndpoints['enhanceEntity'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['enhanceEntity']>>
	>('enhance', ctx.key, {
		method: 'GET',
		useKgBase: true,
		query: {
			name: input.name,
			type: input.type,
			email: input.email,
			employer: input.employer,
			url: input.url,
			phone: input.phone,
			location: input.location,
			size: input.size,
			refresh: input.refresh,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.enhance.enhanceEntity',
		{ name: input.name, type: input.type },
		'completed',
	);
	return response;
};

export const combineEntityProfiles: DiffbotEndpoints['combineEntityProfiles'] =
	async (ctx, input) => {
		const response = await makeDiffbotRequest<
			Awaited<ReturnType<DiffbotEndpoints['combineEntityProfiles']>>
		>('enhance/combine', ctx.key, {
			method: 'GET',
			useKgBase: true,
			query: {
				name: input.name,
				type: input.type,
				email: input.email,
				employer: input.employer,
				url: input.url,
			},
		});

		await logEventFromContext(
			ctx,
			'diffbot.enhance.combineEntityProfiles',
			{ name: input.name, type: input.type },
			'completed',
		);
		return response;
	};

export const resolveLostId: DiffbotEndpoints['resolveLostId'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['resolveLostId']>>
	>('dql', ctx.key, {
		method: 'GET',
		useKgBase: true,
		query: {
			query: `id:"${input.id}"`,
			size: 1,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.enhance.resolveLostId',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const getKgCoverageReportById: DiffbotEndpoints['getKgCoverageReportById'] =
	async (ctx, input) => {
		const endpoint = input.bulkjobId
			? `enhance/bulk/report/${encodeURIComponent(input.bulkjobId)}/${encodeURIComponent(input.reportId)}`
			: 'report';

		const response = await makeDiffbotRequest<
			Awaited<ReturnType<DiffbotEndpoints['getKgCoverageReportById']>>
		>(endpoint, ctx.key, {
			method: 'GET',
			useKgBase: true,
			query: input.bulkjobId ? {} : { reportId: input.reportId },
		});

		await logEventFromContext(
			ctx,
			'diffbot.enhance.getKgCoverageReportById',
			{ reportId: input.reportId, bulkjobId: input.bulkjobId },
			'completed',
		);
		return response;
	};
