import { logEventFromContext } from 'corsair/core';
import type { OnedriveEndpoints } from '..';
import { makeOnedriveRequest } from '../client';
import type { OnedriveEndpointOutputs } from './types';

function buildItemUrl(
	item_id: string,
	drive_id?: string,
	site_id?: string,
	user_id?: string,
	group_id?: string,
): string {
	if (site_id && drive_id)
		return `sites/${site_id}/drives/${drive_id}/items/${item_id}`;
	if (site_id) return `sites/${site_id}/drive/items/${item_id}`;
	if (group_id) return `groups/${group_id}/drive/items/${item_id}`;
	if (user_id) return `users/${user_id}/drive/items/${item_id}`;
	if (drive_id) return `drives/${drive_id}/items/${item_id}`;
	return `me/drive/items/${item_id}`;
}

export const getForItem: OnedriveEndpoints['permissionsGetForItem'] = async (
	ctx,
	input,
) => {
	const {
		item_id,
		drive_id,
		site_id,
		user_id,
		group_id,
		select,
		if_none_match,
	} = input;

	const url = buildItemUrl(item_id, drive_id, site_id, user_id, group_id);
	const query: Record<string, string | undefined> = {};
	if (select) query['$select'] = select;
	if (if_none_match) query['if-none-match'] = if_none_match;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['permissionsGetForItem']
	>(`${url}/permissions`, ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'onedrive.permissions.getForItem',
		{ item_id },
		'completed',
	);
	return result;
};

export const createForItem: OnedriveEndpoints['permissionsCreateForItem'] =
	async (ctx, input) => {
		const { drive_id, driveItem_id, roles, grantedToV2 } = input;

		const body: Record<string, unknown> = { roles, grantedToV2 };

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['permissionsCreateForItem']
		>(`drives/${drive_id}/items/${driveItem_id}/permissions`, ctx.key, {
			method: 'POST',
			body,
		});

		await logEventFromContext(
			ctx,
			'onedrive.permissions.createForItem',
			{ drive_id, driveItem_id },
			'completed',
		);
		return result;
	};

export const updateForItem: OnedriveEndpoints['permissionsUpdateForItem'] =
	async (ctx, input) => {
		const {
			item_id,
			permission_id,
			roles,
			drive_id,
			site_id,
			user_id,
			group_id,
		} = input;

		const url = buildItemUrl(item_id, drive_id, site_id, user_id, group_id);
		const body: Record<string, unknown> = { roles };

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['permissionsUpdateForItem']
		>(`${url}/permissions/${permission_id}`, ctx.key, {
			method: 'PATCH',
			body,
		});

		await logEventFromContext(
			ctx,
			'onedrive.permissions.updateForItem',
			{ item_id, permission_id },
			'completed',
		);
		return result;
	};

export const deleteFromItem: OnedriveEndpoints['permissionsDeleteFromItem'] =
	async (ctx, input) => {
		const { item_id, perm_id, drive_id, site_id, user_id, group_id } = input;

		const url = buildItemUrl(item_id, drive_id, site_id, user_id, group_id);

		await makeOnedriveRequest<void>(`${url}/permissions/${perm_id}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'onedrive.permissions.deleteFromItem',
			{ item_id, perm_id },
			'completed',
		);
		return { message: `Permission ${perm_id} deleted from item ${item_id}` };
	};

export const inviteUser: OnedriveEndpoints['permissionsInviteUser'] = async (
	ctx,
	input,
) => {
	const {
		item_id,
		roles,
		recipients,
		drive_id,
		site_id,
		user_id,
		group_id,
		message,
		password,
		require_sign_in,
		send_invitation,
		expiration_date_time,
		retain_inherited_permissions,
	} = input;

	const url = buildItemUrl(item_id, drive_id, site_id, user_id, group_id);
	const body: Record<string, unknown> = { roles, recipients };
	if (message) body.message = message;
	if (password) body.password = password;
	if (require_sign_in !== undefined) body.requireSignIn = require_sign_in;
	if (send_invitation !== undefined) body.sendInvitation = send_invitation;
	if (expiration_date_time) body.expirationDateTime = expiration_date_time;
	if (retain_inherited_permissions !== undefined)
		body.retainInheritedPermissions = retain_inherited_permissions;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['permissionsInviteUser']
	>(`${url}/invite`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'onedrive.permissions.inviteUser',
		{ item_id },
		'completed',
	);
	return result;
};

export const createLink: OnedriveEndpoints['permissionsCreateLink'] = async (
	ctx,
	input,
) => {
	const {
		item_id,
		type,
		scope,
		site_id,
		user_id,
		drive_id,
		group_id,
		password,
		expiration_date_time,
		retain_inherited_permissions,
	} = input;

	const url = buildItemUrl(item_id, drive_id, site_id, user_id, group_id);
	const body: Record<string, unknown> = { type };
	if (scope) body.scope = scope;
	if (password) body.password = password;
	if (expiration_date_time) body.expirationDateTime = expiration_date_time;
	if (retain_inherited_permissions !== undefined)
		body.retainInheritedPermissions = retain_inherited_permissions;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['permissionsCreateLink']
	>(`${url}/createLink`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'onedrive.permissions.createLink',
		{ item_id, type },
		'completed',
	);
	return result;
};

export const listSharePermissions: OnedriveEndpoints['permissionsListSharePermissions'] =
	async (ctx, input) => {
		const { shared_drive_item_id } = input;

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['permissionsListSharePermissions']
		>(`shares/${shared_drive_item_id}/permission`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'onedrive.permissions.listSharePermissions',
			{ shared_drive_item_id },
			'completed',
		);
		return result;
	};

export const deleteSharePermission: OnedriveEndpoints['permissionsDeleteSharePermission'] =
	async (ctx, input) => {
		const { shared_drive_item_id } = input;

		await makeOnedriveRequest<void>(
			`shares/${shared_drive_item_id}/permission`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'onedrive.permissions.deleteSharePermission',
			{ shared_drive_item_id },
			'completed',
		);
		return {
			message: `Share permission for ${shared_drive_item_id} deleted successfully`,
		};
	};

export const grantSharePermission: OnedriveEndpoints['permissionsGrantSharePermission'] =
	async (ctx, input) => {
		const { encoded_sharing_url, roles, recipients } = input;

		const body: Record<string, unknown> = { roles, recipients };

		const result = await makeOnedriveRequest<
			OnedriveEndpointOutputs['permissionsGrantSharePermission']
		>(`shares/${encoded_sharing_url}/permission/grant`, ctx.key, {
			method: 'POST',
			body,
		});

		await logEventFromContext(
			ctx,
			'onedrive.permissions.grantSharePermission',
			{},
			'completed',
		);
		return result;
	};

export const getShare: OnedriveEndpoints['permissionsGetShare'] = async (
	ctx,
	input,
) => {
	const { share_id_or_encoded_sharing_url, prefer_redeem, expand_children } =
		input;

	const query: Record<string, string | undefined> = {};
	if (expand_children) query['$expand'] = 'driveItem';
	if (prefer_redeem) query.prefer = prefer_redeem;

	const result = await makeOnedriveRequest<
		OnedriveEndpointOutputs['permissionsGetShare']
	>(`shares/${share_id_or_encoded_sharing_url}`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'onedrive.permissions.getShare',
		{ share_id_or_encoded_sharing_url },
		'completed',
	);
	return result;
};
