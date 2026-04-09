import { logEventFromContext } from 'corsair/core';
import type { OnedriveEndpoints } from '..';
import { makeOnedriveRequest } from '../client';
import type { OnedriveEndpointOutputs } from './types';

export const getSite: OnedriveEndpoints['sharepointGetSite'] = async (
	ctx,
	input,
) => {
	const { site_id, expand, select } = input;

	const query: Record<string, string | undefined> = {};
	if (expand) query['$expand'] = expand;
	if (select) query['$select'] = select;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['sharepointGetSite']
	>(`sites/${site_id}`, ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'onedrive.sharepoint.getSite',
		{ site_id },
		'completed',
	);
	return result;
};

export const getSitePage: OnedriveEndpoints['sharepointGetSitePage'] = async (
	ctx,
	input,
) => {
	const { site_id, page_id, expand, select } = input;

	const query: Record<string, string | undefined> = {};
	if (expand) query['$expand'] = expand;
	if (select) query['$select'] = select;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['sharepointGetSitePage']
	>(`sites/${site_id}/pages/${page_id}`, ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'onedrive.sharepoint.getSitePage',
		{ site_id, page_id },
		'completed',
	);
	return result;
};

export const getListItems: OnedriveEndpoints['sharepointGetListItems'] = async (
	ctx,
	input,
) => {
	const {
		site_id,
		list_id,
		top,
		skip,
		count,
		expand,
		filter,
		select,
		orderby,
	} = input;

	const query: Record<string, string | number | boolean | undefined> = {};
	if (top !== undefined) query['$top'] = top;
	if (skip !== undefined) query['$skip'] = skip;
	if (count !== undefined) query['$count'] = count;
	if (expand) query['$expand'] = expand;
	if (filter) query['$filter'] = filter;
	if (select) query['$select'] = select;
	if (orderby) query['$orderby'] = orderby;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['sharepointGetListItems']
	>(`sites/${site_id}/lists/${list_id}/items`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'onedrive.sharepoint.getListItems',
		{ site_id, list_id },
		'completed',
	);
	return result;
};

export const listSiteLists: OnedriveEndpoints['sharepointListSiteLists'] =
	async (ctx, input) => {
		const { site_id, top, skip, count, expand, filter, select, orderby } =
			input;

		const query: Record<string, string | number | boolean | undefined> = {};
		if (top !== undefined) query['$top'] = top;
		if (skip !== undefined) query['$skip'] = skip;
		if (count !== undefined) query['$count'] = count;
		if (expand) query['$expand'] = expand;
		if (filter) query['$filter'] = filter;
		if (select) query['$select'] = select;
		if (orderby) query['$orderby'] = orderby;

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['sharepointListSiteLists']
		>(`sites/${site_id}/lists`, ctx.key, { method: 'GET', query });

		await logEventFromContext(
			ctx,
			'onedrive.sharepoint.listSiteLists',
			{ site_id },
			'completed',
		);
		return result;
	};

export const listSiteColumns: OnedriveEndpoints['sharepointListSiteColumns'] =
	async (ctx, input) => {
		const { site_id, top, skip, count, expand, filter, select, orderby } =
			input;

		const query: Record<string, string | number | boolean | undefined> = {};
		if (top !== undefined) query['$top'] = top;
		if (skip !== undefined) query['$skip'] = skip;
		if (count !== undefined) query['$count'] = count;
		if (expand) query['$expand'] = expand;
		if (filter) query['$filter'] = filter;
		if (select) query['$select'] = select;
		if (orderby) query['$orderby'] = orderby;

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['sharepointListSiteColumns']
		>(`sites/${site_id}/columns`, ctx.key, { method: 'GET', query });

		await logEventFromContext(
			ctx,
			'onedrive.sharepoint.listSiteColumns',
			{ site_id },
			'completed',
		);
		return result;
	};

export const listSiteSubsites: OnedriveEndpoints['sharepointListSiteSubsites'] =
	async (ctx, input) => {
		const { site_id, top, skip, count, expand, filter, select, orderby } =
			input;

		const query: Record<string, string | number | boolean | undefined> = {};
		if (top !== undefined) query['$top'] = top;
		if (skip !== undefined) query['$skip'] = skip;
		if (count !== undefined) query['$count'] = count;
		if (expand) query['$expand'] = expand;
		if (filter) query['$filter'] = filter;
		if (select) query['$select'] = select;
		if (orderby) query['$orderby'] = orderby;

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['sharepointListSiteSubsites']
		>(`sites/${site_id}/sites`, ctx.key, { method: 'GET', query });

		await logEventFromContext(
			ctx,
			'onedrive.sharepoint.listSiteSubsites',
			{ site_id },
			'completed',
		);
		return result;
	};

export const listListItemsDelta: OnedriveEndpoints['sharepointListListItemsDelta'] =
	async (ctx, input) => {
		const { site_id, list_id, top, token, expand, select } = input;

		const query: Record<string, string | number | undefined> = {};
		if (top !== undefined) query['$top'] = top;
		if (token) query.token = token;
		if (expand) query['$expand'] = expand;
		if (select) query['$select'] = select;

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['sharepointListListItemsDelta']
		>(`sites/${site_id}/lists/${list_id}/items/delta`, ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'onedrive.sharepoint.listListItemsDelta',
			{ site_id, list_id },
			'completed',
		);
		return result;
	};

export const listSiteItemsDelta: OnedriveEndpoints['sharepointListSiteItemsDelta'] =
	async (ctx, input) => {
		const { site_id, top, token, expand, select } = input;

		const query: Record<string, string | number | undefined> = {};
		if (top !== undefined) query['$top'] = top;
		if (token) query.token = token;
		if (expand) query['$expand'] = expand;
		if (select) query['$select'] = select;

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['sharepointListSiteItemsDelta']
		>(`sites/${site_id}/drive/root/delta`, ctx.key, { method: 'GET', query });

		await logEventFromContext(
			ctx,
			'onedrive.sharepoint.listSiteItemsDelta',
			{ site_id },
			'completed',
		);
		return result;
	};
