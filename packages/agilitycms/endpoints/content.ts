import { logEventFromContext } from 'corsair/core';
import { makeAgilityCmsRequest } from '../client';
import type { AgilityCmsContext } from '../index';
import type {
	GetApiTypesInput,
	GetApiTypesResponse,
	GetContentModelsInput,
	GetContentModelsResponse,
	GetItemInput,
	GetItemResponse,
	GetListInput,
	GetListResponse,
	GetLogsInput,
	GetLogsResponse,
	GetPageInput,
	GetPageModulesInput,
	GetPageModulesResponse,
	GetPageResponse,
	GetSitemapFlatInput,
	GetSitemapFlatResponse,
	PageModule,
	SyncPagesInput,
	SyncPagesResponse,
} from './types';
import {
	GetApiTypesResponseSchema,
	GetContentModelsResponseSchema,
	GetItemResponseSchema,
	GetListResponseSchema,
	GetLogsResponseSchema,
	GetPageModulesResponseSchema,
	GetPageResponseSchema,
	GetSitemapFlatResponseSchema,
	SyncPagesResponseSchema,
} from './types';

function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
	return Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	) as Record<string, string | number | boolean>;
}

export const getPage = async (
	ctx: AgilityCmsContext,
	input: GetPageInput,
): Promise<GetPageResponse> => {
	const response = await makeAgilityCmsRequest<GetPageResponse>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/page/${input.pageId}`,
		{
			apiBaseUrl: ctx.options?.apiBaseUrl,
			query: compactQuery({
				contentLinkDepth: input.contentLinkDepth,
				expandAllContentLinks: input.expandAllContentLinks,
			}),
		},
	);

	const parsed = GetPageResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getPage',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const getItem = async (
	ctx: AgilityCmsContext,
	input: GetItemInput,
): Promise<GetItemResponse> => {
	const response = await makeAgilityCmsRequest<GetItemResponse>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/item/${input.contentId}`,
		{
			apiBaseUrl: ctx.options?.apiBaseUrl,
			query: compactQuery({
				contentLinkDepth: input.contentLinkDepth,
				expandAllContentLinks: input.expandAllContentLinks,
			}),
		},
	);

	const parsed = GetItemResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getItem',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const getList = async (
	ctx: AgilityCmsContext,
	input: GetListInput,
): Promise<GetListResponse> => {
	const response = await makeAgilityCmsRequest<GetListResponse>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/list/${input.referenceName}`,
		{
			apiBaseUrl: ctx.options?.apiBaseUrl,
			query: compactQuery({
				contentLinkDepth: input.contentLinkDepth,
				expandAllContentLinks: input.expandAllContentLinks,
				take: input.take,
				skip: input.skip,
				sort: input.sort,
				direction: input.direction,
				filter: input.filter,
			}),
		},
	);

	const parsed = GetListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getList',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const getContentModels = async (
	ctx: AgilityCmsContext,
	input: GetContentModelsInput,
): Promise<GetContentModelsResponse> => {
	const response = await makeAgilityCmsRequest<GetContentModelsResponse>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/models`,
		{
			apiBaseUrl: ctx.options?.apiBaseUrl,
		},
	);

	const parsed = GetContentModelsResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getContentModels',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const getPageModules = async (
	ctx: AgilityCmsContext,
	input: GetPageModulesInput,
): Promise<GetPageModulesResponse> => {
	const response = await makeAgilityCmsRequest<PageModule[]>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/models`,
		{
			apiBaseUrl: ctx.options?.apiBaseUrl,
		},
	);

	const filtered = (Array.isArray(response) ? response : []).filter(
		(item) => !item.referenceName || item.referenceName.trim() === '',
	);

	const parsed = GetPageModulesResponseSchema.parse(filtered);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getPageModules',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const getSitemapFlat = async (
	ctx: AgilityCmsContext,
	input: GetSitemapFlatInput,
): Promise<GetSitemapFlatResponse> => {
	const response = await makeAgilityCmsRequest<GetSitemapFlatResponse>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/sitemap/flat/${input.channelName}`,
		{
			apiBaseUrl: ctx.options?.apiBaseUrl,
		},
	);

	const parsed = GetSitemapFlatResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getSitemapFlat',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const getLogs = async (
	ctx: AgilityCmsContext,
	input: GetLogsInput,
): Promise<GetLogsResponse> => {
	const response = await makeAgilityCmsRequest<GetLogsResponse>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/sync/items`,
		{
			apiBaseUrl: ctx.options?.apiBaseUrl,
			query: compactQuery({
				syncToken: input.syncToken ?? '0',
				pageSize: input.pageSize,
			}),
		},
	);

	const parsed = GetLogsResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getLogs',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const syncPages = async (
	ctx: AgilityCmsContext,
	input: SyncPagesInput,
): Promise<SyncPagesResponse> => {
	const response = await makeAgilityCmsRequest<SyncPagesResponse>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale}/sync/pages`,
		{
			apiBaseUrl: ctx.options?.apiBaseUrl,
			query: compactQuery({
				syncToken: input.syncToken ?? '0',
				pageSize: input.pageSize,
			}),
		},
	);

	const parsed = SyncPagesResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'agilitycms.content.syncPages',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const getApiTypes = async (
	ctx: AgilityCmsContext,
	input: GetApiTypesInput,
): Promise<GetApiTypesResponse> => {
	const response = await makeAgilityCmsRequest<GetApiTypesResponse>(
		input.instanceGuid,
		ctx.key,
		input.apiType,
		`${input.locale ?? 'en-us'}/types`,
		{
			apiBaseUrl: ctx.options?.apiBaseUrl,
		},
	);

	const parsed = GetApiTypesResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'agilitycms.content.getApiTypes',
		{ ...input },
		'completed',
	);

	return parsed;
};
