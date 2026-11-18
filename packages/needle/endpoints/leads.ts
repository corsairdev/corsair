import type { NeedleEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	NeedleEndpointInputSchemas as Inputs,
	NeedleEndpointOutputSchemas as Outputs,
} from './types';

/** The key's owning user and organization. Needs only a valid key. */
export const me: NeedleEndpoints['accountMe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.me',
			input: Inputs.accountMe,
			output: Outputs.accountMe,
		},
		input,
		() => ({ method: 'GET', path: '/me' }),
		{ log: (_, result) => ({ userId: result.user.id ?? undefined }) },
	);

/** Creates a lead. A duplicate identity answers 409 rather than merging. */
export const create: NeedleEndpoints['leadsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.create',
			input: Inputs.leadsCreate,
			output: Outputs.leadsCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/leads',
			body,
		}),
		{ log: (_, result) => ({ leadId: result.lead.id ?? undefined }) },
	);

/**
 * Patches the fields sent. `identities` replaces the whole identity set, so
 * omitting it leaves the existing channels alone.
 */
export const update: NeedleEndpoints['leadsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.update',
			input: Inputs.leadsUpdate,
			output: Outputs.leadsUpdate,
		},
		input,
		({ leadId, ...body }) => ({
			method: 'PATCH',
			path: `/leads/${segment(leadId)}`,
			body,
		}),
		{
			log: ({ leadId }, result) => ({
				leadId,
				updatedAt: result.lead.updatedAt ?? undefined,
			}),
		},
	);

/**
 * Creates the lead, or patches the fields onto the one an identity already
 * belongs to. `status` says which happened, so a caller never needs a second
 * read to find out.
 */
export const upsert: NeedleEndpoints['leadsUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.upsert',
			input: Inputs.leadsUpsert,
			output: Outputs.leadsUpsert,
		},
		input,
		(body) => ({ method: 'POST', path: '/leads/upsert', body }),
		{
			log: (_, result) => ({
				status: result.status,
				leadId: result.lead.id ?? undefined,
			}),
		},
	);

export const list: NeedleEndpoints['leadsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.list',
			input: Inputs.leadsList,
			output: Outputs.leadsList,
		},
		input,
		({ cursor, limit }) => ({
			method: 'GET',
			path: '/leads',
			query: { cursor, limit },
		}),
		{
			log: (_, result) => ({
				count: result.leads.length,
				hasMore: result.nextCursor != null,
			}),
		},
	);

export const get: NeedleEndpoints['leadsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.get',
			input: Inputs.leadsGet,
			output: Outputs.leadsGet,
		},
		input,
		({ leadId }) => ({
			method: 'GET',
			path: `/leads/${segment(leadId)}`,
		}),
		{ log: ({ leadId }) => ({ leadId }) },
	);

/** Deletes the lead and its identities. There is no restore call. */
export const remove: NeedleEndpoints['leadsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.remove',
			input: Inputs.leadsRemove,
			output: Outputs.leadsRemove,
		},
		input,
		({ leadId }) => ({
			method: 'DELETE',
			path: `/leads/${segment(leadId)}`,
		}),
		{ log: ({ leadId }) => ({ leadId }) },
	);

/**
 * Free text and structured filters, combined with AND. Both are optional, so a
 * bare call pages through every lead.
 */
export const search: NeedleEndpoints['leadsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'leads.search',
			input: Inputs.leadsSearch,
			output: Outputs.leadsSearch,
		},
		input,
		({ cursor, limit, ...body }) => ({
			method: 'POST',
			path: '/leads/search',
			query: { cursor, limit },
			body,
		}),
		{
			log: (_, result) => ({
				count: result.leads.length,
				hasMore: result.nextCursor != null,
			}),
		},
	);
