import type { StatusCakeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StatusCakeEndpointInputSchemas as Inputs,
	StatusCakeEndpointOutputSchemas as Outputs,
} from './types';

export const list: StatusCakeEndpoints['contactGroupsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contactGroups.list',
			input: Inputs.contactGroupsList,
			output: Outputs.contactGroupsList,
		},
		input,
		({ page, limit }) => ({
			method: 'GET',
			path: '/contact-groups',
			query: { page, limit },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				totalCount: result.metadata.total_count ?? undefined,
			}),
		},
	);

export const create: StatusCakeEndpoints['contactGroupsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contactGroups.create',
			input: Inputs.contactGroupsCreate,
			output: Outputs.contactGroupsCreate,
		},
		input,
		({ name, email_addresses, mobile_numbers, integrations, ping_url }) => ({
			method: 'POST',
			path: '/contact-groups',
			form: { name, email_addresses, mobile_numbers, integrations, ping_url },
		}),
		{
			log: (_, result) => ({ newId: result.data.new_id ?? undefined }),
		},
	);

export const get: StatusCakeEndpoints['contactGroupsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contactGroups.get',
			input: Inputs.contactGroupsGet,
			output: Outputs.contactGroupsGet,
		},
		input,
		({ group_id }) => ({
			method: 'GET',
			path: `/contact-groups/${segment(group_id)}`,
		}),
		{
			log: (_, result) => ({ id: result.data.id ?? undefined }),
		},
	);

export const update: StatusCakeEndpoints['contactGroupsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contactGroups.update',
			input: Inputs.contactGroupsUpdate,
			output: Outputs.contactGroupsUpdate,
		},
		input,
		({
			group_id,
			name,
			email_addresses,
			mobile_numbers,
			integrations,
			ping_url,
		}) => ({
			method: 'PUT',
			path: `/contact-groups/${segment(group_id)}`,
			form: { name, email_addresses, mobile_numbers, integrations, ping_url },
		}),
		{
			// The 204 body is empty; the group is identified by the path.
			shape: (_raw, { group_id }) => ({ success: true, id: group_id }),
			log: ({ group_id }) => ({ id: group_id }),
		},
	);

// `delete` is a reserved word, so the function is named remove and the
// nested map registers it under the delete key.
export const remove: StatusCakeEndpoints['contactGroupsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contactGroups.delete',
			input: Inputs.contactGroupsDelete,
			output: Outputs.contactGroupsDelete,
		},
		input,
		({ group_id }) => ({
			method: 'DELETE',
			path: `/contact-groups/${segment(group_id)}`,
		}),
		{
			shape: (_raw, { group_id }) => ({ success: true, id: group_id }),
			log: ({ group_id }) => ({ id: group_id }),
		},
	);
