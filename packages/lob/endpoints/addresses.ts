import type { LobEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	LobEndpointInputSchemas as Inputs,
	LobEndpointOutputSchemas as Outputs,
} from './registry';

export const create: LobEndpoints['addressesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addresses.create',
			input: Inputs.addressesCreate,
			output: Outputs.addressesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/addresses',
			body: parsed,
		}),
		{
			log: (_, result) => ({ addressId: result.id ?? undefined }),
		},
	);

export const get: LobEndpoints['addressesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addresses.get',
			input: Inputs.addressesGet,
			output: Outputs.addressesGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/addresses/${segment(id)}`,
		}),
		{
			log: (_, result) => ({ addressId: result.id ?? undefined }),
		},
	);

// Lob pages addresses with before/after ID cursors. next_url comes back
// pre-built; the caller can also page by passing this row's ID as `after`.
export const list: LobEndpoints['addressesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addresses.list',
			input: Inputs.addressesList,
			output: Outputs.addressesList,
		},
		input,
		({ limit, before, after, include, date_created, metadata }) => {
			const query: Record<string, string | number | boolean | undefined> = {
				limit,
				before,
				after,
			};
			if (include?.length) query.include = include[0];
			for (const [op, value] of Object.entries(date_created ?? {})) {
				if (typeof value === 'string') query[`date_created[${op}]`] = value;
			}
			for (const [key, value] of Object.entries(metadata ?? {})) {
				query[`metadata[${key}]`] = value;
			}
			return { method: 'GET', path: '/addresses', query };
		},
		{
			log: (_, result) => ({
				count: result.count ?? undefined,
				totalCount: result.total_count ?? undefined,
			}),
		},
	);

// `delete` is reserved in TypeScript, so the function is `remove` and it is
// registered under the `delete` key in the endpoints map.
export const remove: LobEndpoints['addressesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addresses.delete',
			input: Inputs.addressesDelete,
			output: Outputs.addressesDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/addresses/${segment(id)}`,
		}),
		{
			log: ({ id }) => ({ addressId: id }),
		},
	);
