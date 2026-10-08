import { logEventFromContext } from 'corsair/core';
import type { DripcelEndpoints } from '..';
import { makeDripcelRequest } from '../client';
import type { DripcelCampaign, DripcelTag } from '../schema';
import type { DripcelEndpointOutputs } from './types';

export const getBalance: DripcelEndpoints['getBalance'] = async (
	ctx,
	_input,
) => {
	const balance = await makeDripcelRequest<number>('/balance', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'dripcel.balance.get', {}, 'completed');
	return { balance };
};

export const listCampaigns: DripcelEndpoints['listCampaigns'] = async (
	ctx,
	_input,
) => {
	const campaigns = await makeDripcelRequest<DripcelCampaign[]>(
		'/campaigns',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'dripcel.campaigns.list', {}, 'completed');
	return { campaigns: campaigns ?? [] };
};

export const listEmailTemplates: DripcelEndpoints['listEmailTemplates'] =
	async (ctx, _input) => {
		const data = await makeDripcelRequest<
			DripcelEndpointOutputs['listEmailTemplates']
		>('/email/templates', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'dripcel.emailTemplates.list',
			{},
			'completed',
		);
		return { templates: data?.templates ?? [] };
	};

export const uploadSales: DripcelEndpoints['uploadSales'] = async (
	ctx,
	input,
) => {
	await makeDripcelRequest<undefined>('/sales', ctx.key, {
		method: 'POST',
		body: input.sales,
	});

	await logEventFromContext(
		ctx,
		'dripcel.sales.upload',
		{ count: input.sales.length },
		'completed',
	);
	return { ok: true as const };
};

export const listTags: DripcelEndpoints['listTags'] = async (ctx, _input) => {
	const tags = await makeDripcelRequest<DripcelTag[]>('/tags', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'dripcel.tags.list', {}, 'completed');
	return { tags: tags ?? [] };
};

export const deleteTag: DripcelEndpoints['deleteTag'] = async (ctx, input) => {
	const response = await makeDripcelRequest<
		DripcelEndpointOutputs['deleteTag']
	>(`/tags/${encodeURIComponent(input.tag_id)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'dripcel.tags.delete',
		{ tag_id: input.tag_id },
		'completed',
	);
	return response;
};
