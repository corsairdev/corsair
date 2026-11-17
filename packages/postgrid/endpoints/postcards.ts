import type { PostgridEndpoints } from '..';
import { segment } from '../client';
import { call, withContactRefs } from './call';
import {
	PostgridEndpointInputSchemas as Inputs,
	PostgridEndpointOutputSchemas as Outputs,
} from './types';

export const list: PostgridEndpoints['postcardsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'postcards.list',
			input: Inputs.postcardsList,
			output: Outputs.postcardsList,
		},
		input,
		({ skip, limit, search }) => ({
			method: 'GET',
			path: '/postcards',
			query: { skip, limit, search },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: PostgridEndpoints['postcardsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'postcards.get',
			input: Inputs.postcardsGet,
			output: Outputs.postcardsGet,
		},
		input,
		({ id, expand }) => ({
			method: 'GET',
			path: `/postcards/${segment(id)}`,
			query: { expand },
		}),
		{ log: ({ id }) => ({ postcardId: id }) },
	);

export const create: PostgridEndpoints['postcardsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'postcards.create',
			input: Inputs.postcardsCreate,
			output: Outputs.postcardsCreate,
			requiresIdempotencyKey: true,
		},
		input,
		({ idempotencyKey: _ignored, ...body }) => ({
			method: 'POST',
			path: '/postcards',
			body: withContactRefs(body),
		}),
		{
			log: ({ size }, result) => ({
				postcardId: result.id ?? undefined,
				status: result.status ?? undefined,
				size,
			}),
		},
	);

export const cancel: PostgridEndpoints['postcardsCancel'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'postcards.cancel',
			input: Inputs.postcardsCancel,
			output: Outputs.postcardsCancel,
		},
		input,
		// Cancelling without a reason is `DELETE`, which PostGrid documents as
		// "Cancel Postcard". The POST `.../cancellation` route requires a `note` in
		// its body, so an id-only call cannot use it.
		({ id }) => ({
			method: 'DELETE',
			path: `/postcards/${segment(id)}`,
		}),
		{
			log: ({ id }, result) => ({
				postcardId: id,
				status: result.status ?? undefined,
			}),
		},
	);
