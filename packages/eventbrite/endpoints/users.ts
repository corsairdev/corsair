import type { EventbriteEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EventbriteEndpointInputSchemas as Inputs,
	EventbriteEndpointOutputSchemas as Outputs,
} from './types';

export const me: EventbriteEndpoints['usersMe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.me',
			input: Inputs.usersMe,
			output: Outputs.usersMe,
		},
		input,
		() => ({
			method: 'GET',
			path: '/users/me/',
		}),
		{
			log: (_, result) => ({ userId: result.id ?? undefined }),
		},
	);

export const get: EventbriteEndpoints['userGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.userGet,
			output: Outputs.userGet,
		},
		input,
		({ user_id }) => ({
			method: 'GET',
			path: `/users/${segment(user_id)}/`,
		}),
		{
			log: ({ user_id }) => ({ userId: user_id }),
		},
	);

/**
 * The list answers in the usual `{ organizations, pagination }` envelope, and
 * is empty for a token whose user belongs to no organization.
 */
export const list: EventbriteEndpoints['organizationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'organizations.list',
			input: Inputs.organizationsList,
			output: Outputs.organizationsList,
		},
		input,
		({ user_id, page_size, continuation, page }) => ({
			method: 'GET',
			path: `/users/${segment(user_id ?? 'me')}/organizations/`,
			query: { page_size, continuation, page },
		}),
		{
			log: (_, result) => ({ count: result.organizations.length }),
		},
	);
