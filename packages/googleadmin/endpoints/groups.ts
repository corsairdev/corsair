import type { GoogleAdminEndpoints } from '..';
import { segment } from '../client';
import { call, pageCount } from './call';
import {
	GoogleAdminEndpointInputSchemas as Inputs,
	GoogleAdminEndpointOutputSchemas as Outputs,
} from './types';

export const list: GoogleAdminEndpoints['groupsList'] = async (ctx, rawInput) =>
	call(
		ctx,
		{
			event: 'groups.list',
			input: Inputs.groupsList,
			output: Outputs.groupsList,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: '/groups',
			query: {
				customer: input.customer ?? undefined,
				domain: input.domain ?? undefined,
				userKey: input.userKey ?? undefined,
				query: input.query ?? undefined,
				maxResults: input.maxResults ?? undefined,
				pageToken: input.pageToken ?? undefined,
				orderBy: input.orderBy ?? undefined,
				sortOrder: input.sortOrder ?? undefined,
			},
		}),
		(result) => pageCount(result.groups),
	);

export const get: GoogleAdminEndpoints['groupsGet'] = async (ctx, rawInput) =>
	call(
		ctx,
		{ event: 'groups.get', input: Inputs.groupsGet, output: Outputs.groupsGet },
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/groups/${segment(input.groupKey)}`,
		}),
	);

export const insert: GoogleAdminEndpoints['groupsInsert'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'groups.insert',
			input: Inputs.groupsInsert,
			output: Outputs.groupsInsert,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: '/groups',
			body: {
				email: input.email,
				...(input.name ? { name: input.name } : {}),
				...(input.description ? { description: input.description } : {}),
			},
		}),
	);

/**
 * groups.patch is the documented patch-semantics method; the PUT is the plain
 * replace. A caller who sends only `description` must not have the group's name
 * cleared, so the partial body goes through PATCH.
 */
export const update: GoogleAdminEndpoints['groupsUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'groups.update',
			input: Inputs.groupsUpdate,
			output: Outputs.groupsUpdate,
		},
		rawInput,
		(input) => {
			const { groupKey, ...body } = input;
			return {
				method: 'PATCH',
				path: `/groups/${segment(groupKey)}`,
				body,
			};
		},
	);

export const remove: GoogleAdminEndpoints['groupsDelete'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'groups.delete',
			input: Inputs.groupsDelete,
			output: Outputs.groupsDelete,
		},
		rawInput,
		(input) => ({
			method: 'DELETE',
			path: `/groups/${segment(input.groupKey)}`,
		}),
	);

export const aliasesList: GoogleAdminEndpoints['groupsAliasesList'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'groups.aliases.list',
			input: Inputs.groupsAliasesList,
			output: Outputs.groupsAliasesList,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/groups/${segment(input.groupKey)}/aliases`,
		}),
		(result) => pageCount(result.aliases),
	);

export const aliasesInsert: GoogleAdminEndpoints['groupsAliasesInsert'] =
	async (ctx, rawInput) =>
		call(
			ctx,
			{
				event: 'groups.aliases.insert',
				input: Inputs.groupsAliasesInsert,
				output: Outputs.groupsAliasesInsert,
			},
			rawInput,
			(input) => ({
				method: 'POST',
				path: `/groups/${segment(input.groupKey)}/aliases`,
				body: { alias: input.alias },
			}),
		);

export const aliasesDelete: GoogleAdminEndpoints['groupsAliasesDelete'] =
	async (ctx, rawInput) =>
		call(
			ctx,
			{
				event: 'groups.aliases.delete',
				input: Inputs.groupsAliasesDelete,
				output: Outputs.groupsAliasesDelete,
			},
			rawInput,
			(input) => ({
				method: 'DELETE',
				path: `/groups/${segment(input.groupKey)}/aliases/${segment(input.alias)}`,
			}),
		);
