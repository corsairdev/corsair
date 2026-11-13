import { logEventFromContext } from 'corsair/core';
import type { GleapEndpoints } from '..';
import { makeGleapRequest } from '../client';
import type {
	BoardsCreateOutput,
	BoardsDeleteOutput,
	BoardsListOutput,
	BoardsUpdateOutput,
} from './types';
import {
	GleapEndpointInputSchemas,
	GleapEndpointOutputSchemas,
} from './types';

export const list: GleapEndpoints['boardsList'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.boardsList.parse(input);
	const response = await makeGleapRequest<BoardsListOutput>(
		'/ticket-types',
		ctx.key,
		{
			method: 'GET',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.boardsList.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.boards.list',
		{ count: output.length },
		'completed',
	);
	return output;
};

export const create: GleapEndpoints['boardsCreate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.boardsCreate.parse(input);
	const { project, ...body } = parsed;
	const response = await makeGleapRequest<BoardsCreateOutput>(
		'/ticket-types',
		ctx.key,
		{
			method: 'POST',
			body,
			projectId: project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.boardsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.boards.create',
		{ completed: true },
		'completed',
	);
	return output;
};

export const update: GleapEndpoints['boardsUpdate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.boardsUpdate.parse(input);
	const { type, project, ...body } = parsed;
	const response = await makeGleapRequest<BoardsUpdateOutput>(
		`/ticket-types/${encodeURIComponent(type)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
			projectId: project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.boardsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.boards.update',
		{ type },
		'completed',
	);
	return output;
};

export const del: GleapEndpoints['boardsDelete'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.boardsDelete.parse(input);
	const response = await makeGleapRequest<BoardsDeleteOutput>(
		`/ticket-types/${encodeURIComponent(parsed.type)}`,
		ctx.key,
		{
			method: 'DELETE',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.boardsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.boards.delete',
		{ type: parsed.type },
		'completed',
	);
	return output;
};
