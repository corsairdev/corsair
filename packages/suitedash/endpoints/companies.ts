import type { SuitedashEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SuitedashEndpointInputSchemas as Inputs,
	SuitedashEndpointOutputSchemas as Outputs,
} from './types';

export const list: SuitedashEndpoints['companiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.list',
			input: Inputs.companiesList,
			output: Outputs.companiesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/companies', query }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: SuitedashEndpoints['companiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.get',
			input: Inputs.companiesGet,
			output: Outputs.companiesGet,
		},
		input,
		({ identifier, meta }) => ({
			method: 'GET',
			path: `/company/${segment(identifier)}`,
			query: { meta },
		}),
		// The identifier may be a name, so only the uid is logged.
		{ log: (_, result) => ({ companyUid: result.data.uid ?? undefined }) },
	);

export const create: SuitedashEndpoints['companiesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.create',
			input: Inputs.companiesCreate,
			output: Outputs.companiesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/company', body }),
		{ log: (_, result) => ({ companyUid: result.data.uid ?? undefined }) },
	);

export const update: SuitedashEndpoints['companiesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.update',
			input: Inputs.companiesUpdate,
			output: Outputs.companiesUpdate,
		},
		input,
		({ identifier, ...body }) => ({
			method: 'PUT',
			path: `/company/${segment(identifier)}`,
			body,
		}),
		// The identifier may be a name, so only the uid is logged.
		{ log: (_, result) => ({ companyUid: result.data.uid ?? undefined }) },
	);

/**
 * The account's company custom fields, which is where the keys a write can use
 * come from. Without it a caller is guessing at the uuid keys.
 */
export const meta: SuitedashEndpoints['companiesMeta'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.meta',
			input: Inputs.companiesMeta,
			output: Outputs.companiesMeta,
		},
		input,
		() => ({ method: 'GET', path: '/company/meta' }),
		{ log: (_, result) => ({ count: Object.keys(result).length }) },
	);
