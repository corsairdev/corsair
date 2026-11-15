import type { WebexEndpoints } from '..';
import { segment } from '../client';
import { call, list as listPage } from './call';
import {
	WebexEndpointInputSchemas as Inputs,
	WebexEndpointOutputSchemas as Outputs,
} from './types';

/** The account behind the token: its id, emails and licence list. */
export const me: WebexEndpoints['peopleMe'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'people.me', input: Inputs.peopleMe, output: Outputs.peopleMe },
		input,
		() => ({ method: 'GET', path: '/people/me' }),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				displayName: result.displayName ?? undefined,
				type: result.type ?? undefined,
			}),
		},
	);

export const list: WebexEndpoints['peopleList'] = (ctx, input) =>
	listPage(
		ctx,
		{
			event: 'people.list',
			input: Inputs.peopleList,
			output: Outputs.peopleList,
		},
		input,
		({ email, displayName, id, orgId, max }) => ({
			method: 'GET',
			path: '/people',
			query: { email, displayName, id, orgId, max },
		}),
		{
			// The list is people, so only the count is logged.
			log: (_, result) => ({ count: result.items?.length ?? 0 }),
		},
	);

export const get: WebexEndpoints['peopleGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.get',
			input: Inputs.peopleGet,
			output: Outputs.peopleGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/people/${segment(id)}` }),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				displayName: result.displayName ?? undefined,
			}),
		},
	);

export const teams: WebexEndpoints['teamsList'] = (ctx, input) =>
	listPage(
		ctx,
		{ event: 'teams.list', input: Inputs.teamsList, output: Outputs.teamsList },
		input,
		({ max }) => ({ method: 'GET', path: '/teams', query: { max } }),
		{ log: (_, result) => ({ count: result.items?.length ?? 0 }) },
	);

export const teamGet: WebexEndpoints['teamsGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'teams.get', input: Inputs.teamsGet, output: Outputs.teamsGet },
		input,
		({ id }) => ({ method: 'GET', path: `/teams/${segment(id)}` }),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				name: result.name ?? undefined,
			}),
		},
	);

export const teamCreate: WebexEndpoints['teamsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.create',
			input: Inputs.teamsCreate,
			output: Outputs.teamsCreate,
		},
		input,
		({ name }) => ({ method: 'POST', path: '/teams', body: { name } }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				name: parsed.name,
			}),
		},
	);

export const teamRemove: WebexEndpoints['teamsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.delete',
			input: Inputs.teamsDelete,
			output: Outputs.teamsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/teams/${segment(id)}` }),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);

export const teamMembershipsList: WebexEndpoints['teamMembershipsList'] = (
	ctx,
	input,
) =>
	listPage(
		ctx,
		{
			event: 'teamMemberships.list',
			input: Inputs.teamMembershipsList,
			output: Outputs.teamMembershipsList,
		},
		input,
		({ teamId, max }) => ({
			method: 'GET',
			path: '/team/memberships',
			query: { teamId, max },
		}),
		{ log: (_, result) => ({ count: result.items?.length ?? 0 }) },
	);

export const teamMembershipsCreate: WebexEndpoints['teamMembershipsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'teamMemberships.create',
			input: Inputs.teamMembershipsCreate,
			output: Outputs.teamMembershipsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/team/memberships', body }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				team: parsed.teamId,
				moderator: parsed.isModerator ?? false,
			}),
		},
	);

export const teamMembershipsRemove: WebexEndpoints['teamMembershipsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'teamMemberships.delete',
			input: Inputs.teamMembershipsDelete,
			output: Outputs.teamMembershipsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/team/memberships/${segment(id)}`,
		}),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);

export const membershipsList: WebexEndpoints['membershipsList'] = (
	ctx,
	input,
) =>
	listPage(
		ctx,
		{
			event: 'memberships.list',
			input: Inputs.membershipsList,
			output: Outputs.membershipsList,
		},
		input,
		({ roomId, personId, personEmail, max }) => ({
			method: 'GET',
			path: '/memberships',
			query: { roomId, personId, personEmail, max },
		}),
		{ log: (_, result) => ({ count: result.items?.length ?? 0 }) },
	);

export const membershipsCreate: WebexEndpoints['membershipsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'memberships.create',
			input: Inputs.membershipsCreate,
			output: Outputs.membershipsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/memberships', body }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				room: parsed.roomId,
				moderator: parsed.isModerator ?? false,
			}),
		},
	);

export const membershipsRemove: WebexEndpoints['membershipsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'memberships.delete',
			input: Inputs.membershipsDelete,
			output: Outputs.membershipsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/memberships/${segment(id)}`,
		}),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);
