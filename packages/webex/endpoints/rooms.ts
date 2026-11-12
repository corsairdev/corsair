import type { WebexEndpoints } from '..';
import { segment } from '../client';
import { call, list as listPage } from './call';
import {
	WebexEndpointInputSchemas as Inputs,
	WebexEndpointOutputSchemas as Outputs,
} from './types';

export const list: WebexEndpoints['roomsList'] = (ctx, input) =>
	listPage(
		ctx,
		{ event: 'rooms.list', input: Inputs.roomsList, output: Outputs.roomsList },
		input,
		({ max, type, teamId, sortBy }) => ({
			method: 'GET',
			path: '/rooms',
			query: { max, type, teamId, sortBy },
		}),
		{ log: (_, result) => ({ count: result.items?.length ?? 0 }) },
	);

export const get: WebexEndpoints['roomsGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'rooms.get', input: Inputs.roomsGet, output: Outputs.roomsGet },
		input,
		({ id }) => ({ method: 'GET', path: `/rooms/${segment(id)}` }),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				title: result.title ?? undefined,
			}),
		},
	);

export const create: WebexEndpoints['roomsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rooms.create',
			input: Inputs.roomsCreate,
			output: Outputs.roomsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/rooms', body }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				title: parsed.title,
			}),
		},
	);

export const update: WebexEndpoints['roomsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rooms.update',
			input: Inputs.roomsUpdate,
			output: Outputs.roomsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/rooms/${segment(id)}`,
			body,
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				title: result.title ?? undefined,
			}),
		},
	);

export const remove: WebexEndpoints['roomsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rooms.delete',
			input: Inputs.roomsDelete,
			output: Outputs.roomsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/rooms/${segment(id)}` }),
		{
			// Webex answers 204 with no body.
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);
