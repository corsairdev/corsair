import type { GoogleAdminEndpoints } from '..';
import { segment } from '../client';
import { call, pageCount } from './call';
import type { GoogleAdminEndpointOutputs } from './types';
import {
	GoogleAdminEndpointInputSchemas as Inputs,
	GoogleAdminEndpointOutputSchemas as Outputs,
} from './types';

export const list: GoogleAdminEndpoints['usersList'] = async (ctx, rawInput) =>
	call(
		ctx,
		{ event: 'users.list', input: Inputs.usersList, output: Outputs.usersList },
		rawInput,
		(input) => ({
			method: 'GET',
			path: '/users',
			query: {
				customer: input.customer ?? undefined,
				domain: input.domain ?? undefined,
				query: input.query ?? undefined,
				maxResults: input.maxResults ?? undefined,
				pageToken: input.pageToken ?? undefined,
				orderBy: input.orderBy ?? undefined,
				sortOrder: input.sortOrder ?? undefined,
				projection: input.projection ?? undefined,
				customFieldMask: input.customFieldMask ?? undefined,
				showDeleted: input.showDeleted ?? undefined,
				viewType: input.viewType ?? undefined,
			},
		}),
		(result) => pageCount(result.users),
	);

export const get: GoogleAdminEndpoints['usersGet'] = async (ctx, rawInput) =>
	call(
		ctx,
		{ event: 'users.get', input: Inputs.usersGet, output: Outputs.usersGet },
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/users/${segment(input.userKey)}`,
			query: {
				projection: input.projection ?? undefined,
				customFieldMask: input.customFieldMask ?? undefined,
				viewType: input.viewType ?? undefined,
			},
		}),
	);

/**
 * users.insert takes the User resource as its body. The documented
 * `resolveConflictAccount` query parameter is left out: its 202 answer carries
 * an invitation body whose shape the docs do not describe, so a caller cannot
 * be told what they received.
 */
export const insert: GoogleAdminEndpoints['usersInsert'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.insert',
			input: Inputs.usersInsert,
			output: Outputs.usersInsert,
		},
		rawInput,
		(input) => ({ method: 'POST', path: '/users', body: input }),
	);

export const update: GoogleAdminEndpoints['usersUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.update',
			input: Inputs.usersUpdate,
			output: Outputs.usersUpdate,
		},
		rawInput,
		(input) => {
			const { userKey, ...body } = input;
			return { method: 'PUT', path: `/users/${segment(userKey)}`, body };
		},
	);

export const remove: GoogleAdminEndpoints['usersDelete'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.delete',
			input: Inputs.usersDelete,
			output: Outputs.usersDelete,
		},
		rawInput,
		(input) => ({ method: 'DELETE', path: `/users/${segment(input.userKey)}` }),
	);

export const undelete: GoogleAdminEndpoints['usersUndelete'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.undelete',
			input: Inputs.usersUndelete,
			output: Outputs.usersUndelete,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/users/${segment(input.userKey)}/undelete`,
			// The request body is a UserUndelete; an empty object when no unit is named.
			body: input.orgUnitPath ? { orgUnitPath: input.orgUnitPath } : {},
		}),
	);

export const makeAdmin: GoogleAdminEndpoints['usersMakeAdmin'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.makeAdmin',
			input: Inputs.usersMakeAdmin,
			output: Outputs.usersMakeAdmin,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/users/${segment(input.userKey)}/makeAdmin`,
			body: { status: input.status },
		}),
	);

export const signOut: GoogleAdminEndpoints['usersSignOut'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.signOut',
			input: Inputs.usersSignOut,
			output: Outputs.usersSignOut,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/users/${segment(input.userKey)}/signOut`,
		}),
	);

export const aliasesList: GoogleAdminEndpoints['usersAliasesList'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.aliases.list',
			input: Inputs.usersAliasesList,
			output: Outputs.usersAliasesList,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/users/${segment(input.userKey)}/aliases`,
		}),
		(result) => pageCount(result.aliases),
	);

export const aliasesInsert: GoogleAdminEndpoints['usersAliasesInsert'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.aliases.insert',
			input: Inputs.usersAliasesInsert,
			output: Outputs.usersAliasesInsert,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/users/${segment(input.userKey)}/aliases`,
			body: { alias: input.alias },
		}),
	);

export const aliasesDelete: GoogleAdminEndpoints['usersAliasesDelete'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.aliases.delete',
			input: Inputs.usersAliasesDelete,
			output: Outputs.usersAliasesDelete,
		},
		rawInput,
		(input) => ({
			method: 'DELETE',
			path: `/users/${segment(input.userKey)}/aliases/${segment(input.alias)}`,
		}),
	);

export const photosGet: GoogleAdminEndpoints['usersPhotosGet'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.photos.get',
			input: Inputs.usersPhotosGet,
			output: Outputs.usersPhotosGet,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/users/${segment(input.userKey)}/photos/thumbnail`,
		}),
	);

/** users.photos.update is the PUT that replaces the photo, per the reference. */
export const photosUpdate: GoogleAdminEndpoints['usersPhotosUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.photos.update',
			input: Inputs.usersPhotosUpdate,
			output: Outputs.usersPhotosUpdate,
		},
		rawInput,
		(input) => ({
			method: 'PUT',
			path: `/users/${segment(input.userKey)}/photos/thumbnail`,
			body: {
				photoData: input.photoData,
				...(input.mimeType ? { mimeType: input.mimeType } : {}),
			},
		}),
	);

export const photosDelete: GoogleAdminEndpoints['usersPhotosDelete'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'users.photos.delete',
			input: Inputs.usersPhotosDelete,
			output: Outputs.usersPhotosDelete,
		},
		rawInput,
		(input) => ({
			method: 'DELETE',
			path: `/users/${segment(input.userKey)}/photos/thumbnail`,
		}),
	);

/** Named for callers that want the list result type without reaching into the map. */
export type UsersListResult = GoogleAdminEndpointOutputs['usersList'];
