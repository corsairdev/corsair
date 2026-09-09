import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterEndpoints } from '../index';
import type {
	FetchLeadsByListResponse,
	SaveLeadResponse,
	SaveLeadsResponse,
} from './types';

export const save: PhantomBusterEndpoints['saveLead'] = async (ctx, input) => {
	const response = await makePhantomBusterRequest<SaveLeadResponse>(
		'/org-storage/leads/save',
		ctx.key,
		{
			method: 'POST',
			body: { lead: input.lead as Record<string, unknown> },
		},
	);

	await logEventFromContext(ctx, 'phantombuster.leads.save', {}, 'completed');

	return response;
};

export const saveMany: PhantomBusterEndpoints['saveLeads'] = async (ctx, input) => {
	const response = await makePhantomBusterRequest<SaveLeadsResponse>(
		'/org-storage/leads/save-many',
		ctx.key,
		{
			method: 'POST',
			body: { leads: input.leads as Record<string, unknown>[] },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.leads.saveMany',
		{ count: input.leads.length },
		'completed',
	);

	return response;
};

export const fetchByList: PhantomBusterEndpoints['fetchLeadsByList'] = async (
	ctx,
	input,
) => {
	const { listId, pageToken, limit } = input;

	const body: Record<string, unknown> = { listId };
	if (pageToken !== undefined) body.pageToken = pageToken;
	if (limit !== undefined) body.limit = limit;

	const response =
		await makePhantomBusterRequest<FetchLeadsByListResponse>(
			`/org-storage/leads/by-list/${listId}`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);

	await logEventFromContext(
		ctx,
		'phantombuster.leads.fetchByList',
		{ listId },
		'completed',
	);

	return response;
};
