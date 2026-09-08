import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const list: XeroEndpoints['filesList'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, page, pageSize } = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (pageSize !== undefined) query.pageSize = pageSize;

	const response = await makeXeroRequest<XeroEndpointOutputs['filesList']>(
		'https://api.xero.com/files.xro/1.0/Files',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
			isRawUrl: true,
		},
	);

	await logEventFromContext(ctx, 'xero.files.list', { ...input }, 'completed');
	return response;
};

export const listFolders: XeroEndpoints['filesListFolders'] = async (
	ctx,
	input,
) => {
	const { tenantId = ctx.options.tenantId } = input;
	const response = await makeXeroRequest<
		XeroEndpointOutputs['filesListFolders']
	>('https://api.xero.com/files.xro/1.0/Folders', ctx.key, {
		method: 'GET',
		tenantId,
		isRawUrl: true,
	});

	await logEventFromContext(
		ctx,
		'xero.files.listFolders',
		{ ...input },
		'completed',
	);
	return response;
};

export const Files = {
	list,
	listFolders,
};
