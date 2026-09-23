import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	DeleteManyLeadsInput,
	DeleteManyLeadsResponse,
	FetchLeadsByListInput,
	FetchLeadsByListResponse,
	SaveLeadInput,
	SaveLeadResponse,
	SaveLeadsInput,
	SaveLeadsResponse,
} from './types';

export const save = async (
	ctx: PhantomBusterContext,
	input: SaveLeadInput,
): Promise<SaveLeadResponse> => {
	const response = await makePhantomBusterRequest<SaveLeadResponse>(
		'/org-storage/leads/save',
		ctx.key,
		{
			method: 'POST',
			body: { lead: { ...input.lead } },
		},
	);

	await logEventFromContext(ctx, 'phantombuster.leads.save', {}, 'completed');

	return response;
};

export const saveMany = async (
	ctx: PhantomBusterContext,
	input: SaveLeadsInput,
): Promise<SaveLeadsResponse> => {
	const response = await makePhantomBusterRequest<SaveLeadsResponse>(
		'/org-storage/leads/save-many',
		ctx.key,
		{
			method: 'POST',
			body: { leads: input.leads.map((lead) => ({ ...lead })) },
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

export const fetchByList = async (
	ctx: PhantomBusterContext,
	input: FetchLeadsByListInput,
): Promise<FetchLeadsByListResponse> => {
	const { listId } = input;

	// Guard the {listId} path segment: dot segments would be normalized away
	// by URL parsing and change the request target, so reject them outright.
	// Everything else is encoded so one list ID always maps to one segment.
	if (listId === '.' || listId === '..') {
		throw new Error('Invalid listId path segment');
	}

	// unknown: POST bodies are endpoint-specific JSON shapes accepted by makePhantomBusterRequest.
	const body: Record<string, unknown> = {};
	if (input.paginationOptions !== undefined)
		body.paginationOptions = { ...input.paginationOptions };
	if (input.withLeadObjectsOfTypes !== undefined)
		body.withLeadObjectsOfTypes = [...input.withLeadObjectsOfTypes];
	if (input.withCompanies !== undefined)
		body.withCompanies = input.withCompanies;

	const response = await makePhantomBusterRequest<FetchLeadsByListResponse>(
		`/org-storage/leads/by-list/${encodeURIComponent(listId)}`,
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

export const deleteMany = async (
	ctx: PhantomBusterContext,
	input: DeleteManyLeadsInput,
): Promise<DeleteManyLeadsResponse> => {
	const response = await makePhantomBusterRequest<DeleteManyLeadsResponse>(
		'/org-storage/leads/delete-many',
		ctx.key,
		{
			method: 'POST',
			body: { ids: [...input.ids] },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.leads.deleteMany',
		{ count: input.ids.length },
		'completed',
	);

	return response;
};
