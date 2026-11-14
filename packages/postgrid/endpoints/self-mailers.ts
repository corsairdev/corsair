import type { PostgridEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PostgridEndpointInputSchemas as Inputs,
	PostgridEndpointOutputSchemas as Outputs,
} from './types';

export const list: PostgridEndpoints['selfMailersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'selfMailers.list',
			input: Inputs.selfMailersList,
			output: Outputs.selfMailersList,
		},
		input,
		({ skip, limit, search }) => ({
			method: 'GET',
			path: '/self_mailers',
			query: { skip, limit, search },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: PostgridEndpoints['selfMailersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'selfMailers.get',
			input: Inputs.selfMailersGet,
			output: Outputs.selfMailersGet,
		},
		input,
		({ id, expand }) => ({
			method: 'GET',
			path: `/self_mailers/${segment(id)}`,
			query: { expand },
		}),
		{ log: ({ id }) => ({ selfMailerId: id }) },
	);

export const create: PostgridEndpoints['selfMailersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'selfMailers.create',
			input: Inputs.selfMailersCreate,
			output: Outputs.selfMailersCreate,
			requiresIdempotencyKey: true,
		},
		input,
		({ idempotencyKey: _ignored, ...body }) => ({
			method: 'POST',
			path: '/self_mailers',
			body,
		}),
		{
			log: ({ size }, result) => ({
				selfMailerId: result.id ?? undefined,
				status: result.status ?? undefined,
				size,
			}),
		},
	);
