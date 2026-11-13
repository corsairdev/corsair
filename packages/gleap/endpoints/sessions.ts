import { logEventFromContext } from 'corsair/core';
import type { GleapEndpoints } from '..';
import { makeGleapRequest } from '../client';
import type {
	SessionsActivitiesOutput,
	SessionsCreateOutput,
	SessionsDeleteOutput,
	SessionsGetByUserIdOutput,
	SessionsGetOutput,
	SessionsListOutput,
	SessionsSearchOutput,
	SessionsUpdateOutput,
} from './types';
import {
	GleapEndpointInputSchemas,
	GleapEndpointOutputSchemas,
} from './types';

export const list: GleapEndpoints['sessionsList'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.sessionsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		skip: parsed.skip,
		limit: parsed.limit,
		sort: parsed.sort,
	};
	const response = await makeGleapRequest<SessionsListOutput>(
		'/sessions',
		ctx.key,
		{
			method: 'GET',
			query,
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.sessionsList.parse(response);
	const count = Array.isArray(output)
		? output.length
		: output.sessions.length;
	await logEventFromContext(
		ctx,
		'gleap.sessions.list',
		{ count },
		'completed',
	);
	return output;
};

export const get: GleapEndpoints['sessionsGet'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.sessionsGet.parse(input);
	const response = await makeGleapRequest<SessionsGetOutput>(
		`/sessions/${encodeURIComponent(parsed.sessionId)}`,
		ctx.key,
		{
			method: 'GET',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.sessionsGet.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.sessions.get',
		{ sessionId: parsed.sessionId },
		'completed',
	);
	return output;
};

export const getByUserId: GleapEndpoints['sessionsGetByUserId'] = async (
	ctx,
	input,
) => {
	const parsed = GleapEndpointInputSchemas.sessionsGetByUserId.parse(input);
	const response = await makeGleapRequest<SessionsGetByUserIdOutput>(
		`/sessions/by-user-id/${encodeURIComponent(parsed.userId)}`,
		ctx.key,
		{
			method: 'GET',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output =
		GleapEndpointOutputSchemas.sessionsGetByUserId.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.sessions.getByUserId',
		{ completed: true },
		'completed',
	);
	return output;
};

export const create: GleapEndpoints['sessionsCreate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.sessionsCreate.parse(input);
	const { project, ...body } = parsed;
	const response = await makeGleapRequest<SessionsCreateOutput>(
		'/sessions',
		ctx.key,
		{
			method: 'POST',
			body,
			projectId: project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.sessionsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.sessions.create',
		{ created: true },
		'completed',
	);
	return output;
};

export const update: GleapEndpoints['sessionsUpdate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.sessionsUpdate.parse(input);
	const { sessionId, project, ...body } = parsed;
	const response = await makeGleapRequest<SessionsUpdateOutput>(
		`/sessions/${encodeURIComponent(sessionId)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
			projectId: project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.sessionsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.sessions.update',
		{ sessionId },
		'completed',
	);
	return output;
};

export const del: GleapEndpoints['sessionsDelete'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.sessionsDelete.parse(input);
	const response = await makeGleapRequest<SessionsDeleteOutput>(
		`/sessions/${encodeURIComponent(parsed.sessionId)}`,
		ctx.key,
		{
			method: 'DELETE',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.sessionsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.sessions.delete',
		{ sessionId: parsed.sessionId },
		'completed',
	);
	return output;
};

export const search: GleapEndpoints['sessionsSearch'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.sessionsSearch.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		query: parsed.query,
		searchTerm: parsed.searchTerm,
		skip: parsed.skip,
		limit: parsed.limit,
	};
	const response = await makeGleapRequest<SessionsSearchOutput>(
		'/sessions/search',
		ctx.key,
		{
			method: 'GET',
			query,
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.sessionsSearch.parse(response);
	const count = Array.isArray(output)
		? output.length
		: (output.results?.length ?? 0);
	await logEventFromContext(
		ctx,
		'gleap.sessions.search',
		{ count },
		'completed',
	);
	return output;
};

export const activities: GleapEndpoints['sessionsActivities'] = async (
	ctx,
	input,
) => {
	const parsed = GleapEndpointInputSchemas.sessionsActivities.parse(input);
	const response = await makeGleapRequest<SessionsActivitiesOutput>(
		`/sessions/${encodeURIComponent(parsed.sessionId)}/activities`,
		ctx.key,
		{
			method: 'GET',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output =
		GleapEndpointOutputSchemas.sessionsActivities.parse(response);
	const count = Array.isArray(output)
		? output.length
		: (output.activities?.length ?? 0);
	await logEventFromContext(
		ctx,
		'gleap.sessions.activities',
		{ sessionId: parsed.sessionId, count },
		'completed',
	);
	return output;
};
