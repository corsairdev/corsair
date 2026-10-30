import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const get: XeroEndpoints['projectsGet'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, projectId } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['projectsGet']>(
		`https://api.xero.com/projects.xro/2.0/Projects/${projectId}`,
		ctx.key,
		{
			method: 'GET',
			tenantId,
			isRawUrl: true,
		},
	);

	await logEventFromContext(
		ctx,
		'xero.projects.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: XeroEndpoints['projectsList'] = async (ctx, input) => {
	const {
		tenantId = ctx.options.tenantId,
		page,
		pageSize,
		contactId,
		states,
	} = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (pageSize !== undefined) query.pageSize = pageSize;
	if (contactId) query.contactId = contactId;
	if (states) query.states = states;

	const response = await makeXeroRequest<XeroEndpointOutputs['projectsList']>(
		'https://api.xero.com/projects.xro/2.0/Projects',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
			isRawUrl: true,
		},
	);

	await logEventFromContext(
		ctx,
		'xero.projects.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const Projects = {
	get,
	list,
};
