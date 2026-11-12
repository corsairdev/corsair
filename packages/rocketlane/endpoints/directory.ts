import type { z } from 'zod';
import type { RocketlaneEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { filterOf } from './filters';
import { deletedShape, pagedShape, singleShape } from './shape';
import {
	RocketlaneEndpointInputSchemas as Inputs,
	RocketlaneEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The fields a create and an update share, all optional: an update sends only
 * what changed, while a create's schema has already made its own fields
 * required before reaching this builder.
 */
type CompanyWriteBody = Partial<z.output<(typeof Inputs)['companiesCreate']>>;

export const companiesList: RocketlaneEndpoints['companiesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.list',
			input: Inputs.companiesList,
			output: Outputs.companiesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/1.0/companies',
			replayable: true,
			query: {
				...queryOf({
					pageSize: parsed.page_size,
					pageToken: parsed.page_token,
					includeAllFields: parsed.include_all_fields,
					sortBy: parsed.sort_by,
					sortOrder: parsed.sort_order,
					match: parsed.match,
				}),
				includeFields: parsed.include_fields,
				...filterOf('companyName', parsed.company_name),
			},
		}),
		{
			shape: pagedShape('companies'),
			log: (_, result) => ({
				count: result.companies.length,
				hasMore: result.has_more,
			}),
		},
	);

export const companiesGet: RocketlaneEndpoints['companiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.get',
			input: Inputs.companiesGet,
			output: Outputs.companiesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/1.0/companies/${segment(parsed.company_id)}`,
			replayable: true,
			query: {
				...queryOf({ includeAllFields: parsed.include_all_fields }),
				includeFields: parsed.include_fields,
			},
		}),
		{
			shape: singleShape('company'),
			log: (_, result) => ({ companyId: result.company.companyId ?? 0 }),
		},
	);

// unknown: the body is assembled under provider field names from a
// schema-validated input, so its values are the provider's own shapes.
function companyBody(input: CompanyWriteBody): Record<string, unknown> {
	const owner = input.account_owner;
	return {
		companyName: input.company_name,
		accountOwner: owner
			? { userId: owner.user_id, emailId: owner.email_id }
			: undefined,
		companyUrl: input.company_url,
		visibility: input.visibility,
		description: input.description,
		fields: input.fields,
	};
}

export const companiesCreate: RocketlaneEndpoints['companiesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.create',
			input: Inputs.companiesCreate,
			output: Outputs.companiesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/1.0/companies',
			replayable: false,
			body: companyBody(parsed),
		}),
		{
			shape: singleShape('company'),
			log: (_, result) => ({ companyId: result.company.companyId ?? 0 }),
		},
	);

export const companiesUpdate: RocketlaneEndpoints['companiesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.update',
			input: Inputs.companiesUpdate,
			output: Outputs.companiesUpdate,
		},
		input,
		(parsed) => {
			const { company_id: companyId, ...rest } = parsed;
			return {
				method: 'PUT',
				path: `/1.0/companies/${segment(companyId)}`,
				replayable: false,
				body: companyBody(rest),
			};
		},
		{
			shape: singleShape('company'),
			log: (parsed) => ({ companyId: parsed.company_id }),
		},
	);

export const companiesDelete: RocketlaneEndpoints['companiesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.delete',
			input: Inputs.companiesDelete,
			output: Outputs.companiesDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/1.0/companies/${segment(parsed.company_id)}`,
			replayable: false,
		}),
		{
			shape: deletedShape('company_id'),
			log: (parsed) => ({ companyId: parsed.company_id }),
		},
	);

export const usersList: RocketlaneEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/1.0/users',
			replayable: true,
			query: {
				...queryOf({
					pageSize: parsed.page_size,
					pageToken: parsed.page_token,
					sortBy: parsed.sort_by,
					sortOrder: parsed.sort_order,
					match: parsed.match,
				}),
				includeFields: parsed.include_fields,
			},
		}),
		{
			shape: pagedShape('users'),
			log: (_, result) => ({
				count: result.users.length,
				hasMore: result.has_more,
			}),
		},
	);

export const usersGet: RocketlaneEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/1.0/users/${segment(parsed.user_id)}`,
			replayable: true,
			query: { includeFields: parsed.include_fields },
		}),
		{
			shape: singleShape('user'),
			log: (_, result) => ({ userId: result.user.userId ?? 0 }),
		},
	);
