import { logEventFromContext } from 'corsair/core';
import type { UploadcareEndpoints } from '..';
import { makeUploadcareRequest } from '../client';
import type { GroupsListResponse, UploadcareGroup } from './types';

export const list: UploadcareEndpoints['groupsList'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<GroupsListResponse>('groups/', ctx.key, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(ctx, 'uploadcare.groups.list', { ...input }, 'completed');
	return response;
};

export const get: UploadcareEndpoints['groupGet'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<UploadcareGroup>(`groups/${input.group_id}/`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'uploadcare.groups.get', { ...input }, 'completed');
	return response;
};
