import { logEventFromContext } from 'corsair/core';
import type { GleapEndpoints } from '..';
import { makeGleapRequest } from '../client';
import type {
	TicketsCountsOutput,
	TicketsCreateOutput,
	TicketsDeleteOutput,
	TicketsGetOutput,
	TicketsListOutput,
	TicketsSearchOutput,
	TicketsUpdateOutput,
} from './types';
import { GleapEndpointInputSchemas, GleapEndpointOutputSchemas } from './types';

export const list: GleapEndpoints['ticketsList'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.ticketsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		type: parsed.type,
		status: parsed.status,
		priority: parsed.priority,
		ignoreArchived: parsed.ignoreArchived,
		archived: parsed.archived,
		isSpam: parsed.isSpam,
		startDate: parsed.startDate,
		endDate: parsed.endDate,
		updatedAt: parsed.updatedAt,
		createdAt: parsed.createdAt,
		sort: parsed.sort,
		skip: parsed.skip,
		limit: parsed.limit,
	};

	const response = await makeGleapRequest<TicketsListOutput>(
		'/tickets',
		ctx.key,
		{
			method: 'GET',
			query,
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.ticketsList.parse(response);
	const count = Array.isArray(output) ? output.length : output.items.length;
	await logEventFromContext(ctx, 'gleap.tickets.list', { count }, 'completed');
	return output;
};

export const get: GleapEndpoints['ticketsGet'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.ticketsGet.parse(input);
	const response = await makeGleapRequest<TicketsGetOutput>(
		`/tickets/${encodeURIComponent(parsed.ticketId)}`,
		ctx.key,
		{
			method: 'GET',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.ticketsGet.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.tickets.get',
		{ ticketId: parsed.ticketId },
		'completed',
	);
	return output;
};

export const create: GleapEndpoints['ticketsCreate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.ticketsCreate.parse(input);
	const { project, ...body } = parsed;
	const response = await makeGleapRequest<TicketsCreateOutput>(
		'/tickets',
		ctx.key,
		{
			method: 'POST',
			body,
			projectId: project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.ticketsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.tickets.create',
		{ created: true },
		'completed',
	);
	return output;
};

export const update: GleapEndpoints['ticketsUpdate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.ticketsUpdate.parse(input);
	const { ticketId, project, ...body } = parsed;
	const response = await makeGleapRequest<TicketsUpdateOutput>(
		`/tickets/${encodeURIComponent(ticketId)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
			projectId: project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.ticketsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.tickets.update',
		{ ticketId },
		'completed',
	);
	return output;
};

export const del: GleapEndpoints['ticketsDelete'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.ticketsDelete.parse(input);
	const response = await makeGleapRequest<TicketsDeleteOutput>(
		`/tickets/${encodeURIComponent(parsed.ticketId)}`,
		ctx.key,
		{
			method: 'DELETE',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.ticketsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.tickets.delete',
		{ ticketId: parsed.ticketId },
		'completed',
	);
	return output;
};

export const search: GleapEndpoints['ticketsSearch'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.ticketsSearch.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		searchTerm: parsed.searchTerm,
		type: parsed.type,
		status: parsed.status,
		archived: parsed.archived,
		addSession: parsed.addSession,
	};
	const response = await makeGleapRequest<TicketsSearchOutput>(
		'/tickets/search',
		ctx.key,
		{
			method: 'GET',
			query,
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.ticketsSearch.parse(response);
	const hitsCount = output.hits?.length ?? 0;
	await logEventFromContext(
		ctx,
		'gleap.tickets.search',
		{ hits: hitsCount },
		'completed',
	);
	return output;
};

export const counts: GleapEndpoints['ticketsCounts'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.ticketsCounts.parse(input);
	const response = await makeGleapRequest<TicketsCountsOutput>(
		'/tickets/ticketscount',
		ctx.key,
		{
			method: 'GET',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.ticketsCounts.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.tickets.counts',
		{ completed: true },
		'completed',
	);
	return output;
};
