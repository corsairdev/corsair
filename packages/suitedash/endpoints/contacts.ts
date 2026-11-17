import type { SuitedashEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SuitedashEndpointInputSchemas as Inputs,
	SuitedashEndpointOutputSchemas as Outputs,
} from './types';

export const list: SuitedashEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/contacts', query }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: SuitedashEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ identifier, meta }) => ({
			method: 'GET',
			path: `/contact/${segment(identifier)}`,
			query: { meta },
		}),
		// The identifier may be an email address, so only the uid is logged.
		{ log: (_, result) => ({ contactUid: result.data.uid ?? undefined }) },
	);

export const create: SuitedashEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/contact', body }),
		{ log: (_, result) => ({ contactUid: result.data.uid ?? undefined }) },
	);

export const update: SuitedashEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		({ identifier, ...body }) => ({
			method: 'PUT',
			path: `/contact/${segment(identifier)}`,
			body,
		}),
		// The identifier may be an email address, so only the uid is logged.
		{ log: (_, result) => ({ contactUid: result.data.uid ?? undefined }) },
	);

export const meta: SuitedashEndpoints['contactsMeta'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.meta',
			input: Inputs.contactsMeta,
			output: Outputs.contactsMeta,
		},
		input,
		() => ({ method: 'GET', path: '/contact/meta' }),
		{ log: (_, result) => ({ count: Object.keys(result).length }) },
	);
