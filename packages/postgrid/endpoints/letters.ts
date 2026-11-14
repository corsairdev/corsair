import type { PostgridEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PostgridEndpointInputSchemas as Inputs,
	PostgridEndpointOutputSchemas as Outputs,
} from './types';

export const list: PostgridEndpoints['lettersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'letters.list',
			input: Inputs.lettersList,
			output: Outputs.lettersList,
		},
		input,
		({ skip, limit, search }) => ({
			method: 'GET',
			path: '/letters',
			query: { skip, limit, search },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: PostgridEndpoints['lettersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'letters.get',
			input: Inputs.lettersGet,
			output: Outputs.lettersGet,
		},
		input,
		({ id, expand }) => ({
			method: 'GET',
			path: `/letters/${segment(id)}`,
			query: { expand },
		}),
		{ log: ({ id }) => ({ letterId: id }) },
	);

export const create: PostgridEndpoints['lettersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'letters.create',
			input: Inputs.lettersCreate,
			output: Outputs.lettersCreate,
			requiresIdempotencyKey: true,
		},
		input,
		({ idempotencyKey: _ignored, ...body }) => ({
			method: 'POST',
			path: '/letters',
			body,
		}),
		{
			log: ({ to }, result) => ({
				letterId: result.id ?? undefined,
				status: result.status ?? undefined,
				countryCode: to.countryCode,
			}),
		},
	);

export const cancel: PostgridEndpoints['lettersCancel'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'letters.cancel',
			input: Inputs.lettersCancel,
			output: Outputs.lettersCancel,
		},
		input,
		({ id }) => ({
			method: 'POST',
			path: `/letters/${segment(id)}/cancellation`,
		}),
		{
			log: ({ id }, result) => ({
				letterId: id,
				status: result.status ?? undefined,
			}),
		},
	);
