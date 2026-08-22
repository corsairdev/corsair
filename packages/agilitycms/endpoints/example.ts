import { logEventFromContext } from 'corsair/core';
import type { AgilityCmsEndpoints } from '..';
import { makeAgilityCmsRequest } from '../client';
import type { AgilityCmsEndpointOutputs } from './types';

export const getPage: AgilityCmsEndpoints['getPage'] = async (ctx, input) => {
	const response = await makeAgilityCmsRequest<
		AgilityCmsEndpointOutputs['getPage']
	>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/page/${input.pageId}`,
	);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getPage',
		{ ...input },
		'completed',
	);

	return response;
};

export const getItem: AgilityCmsEndpoints['getItem'] = async (ctx, input) => {
	const response = await makeAgilityCmsRequest<
		AgilityCmsEndpointOutputs['getItem']
	>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/item/${input.contentId}`,
	);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getItem',
		{ ...input },
		'completed',
	);

	return response;
};

export const getList: AgilityCmsEndpoints['getList'] = async (ctx, input) => {
	const response = await makeAgilityCmsRequest<
		AgilityCmsEndpointOutputs['getList']
	>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/list/${input.referenceName}`,
		{
			query: {
				contentLinkDepth: input.contentLinkDepth,
				expandAllContentLinks: input.expandAllContentLinks,
				take: input.take,
				skip: input.skip,
				sort: input.sort,
				filter: input.filter,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getList',
		{ ...input },
		'completed',
	);

	return response;
};

export const getSitemap: AgilityCmsEndpoints['getSitemap'] = async (
	ctx,
	input,
) => {
	const response = await makeAgilityCmsRequest<
		AgilityCmsEndpointOutputs['getSitemap']
	>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/sitemap/flat/${input.channelName}`,
	);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getSitemap',
		{ ...input },
		'completed',
	);

	return response;
};

export const getContentModels: AgilityCmsEndpoints['getContentModels'] = async (
	ctx,
	input,
) => {
	const response = await makeAgilityCmsRequest<
		AgilityCmsEndpointOutputs['getContentModels']
	>(input.instanceGuid, ctx.key, input.apiType, `${input.locale}/models`);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getContentModels',
		{ ...input },
		'completed',
	);

	return response;
};
