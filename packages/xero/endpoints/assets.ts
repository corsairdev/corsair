import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const get: XeroEndpoints['assetsGet'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, assetId } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['assetsGet']>(
		`https://api.xero.com/assets.xro/1.0/Assets/${assetId}`,
		ctx.key,
		{
			method: 'GET',
			tenantId,
			isRawUrl: true,
		},
	);

	await logEventFromContext(ctx, 'xero.assets.get', { ...input }, 'completed');
	return response;
};

export const list: XeroEndpoints['assetsList'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, page, pageSize, status } = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (pageSize !== undefined) query.pageSize = pageSize;
	if (status) query.status = status;

	const response = await makeXeroRequest<XeroEndpointOutputs['assetsList']>(
		'https://api.xero.com/assets.xro/1.0/Assets',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
			isRawUrl: true,
		},
	);

	await logEventFromContext(ctx, 'xero.assets.list', { ...input }, 'completed');
	return response;
};

export const Assets = {
	get,
	list,
};
