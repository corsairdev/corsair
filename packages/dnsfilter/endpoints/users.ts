// DNSFilter users, current user, and user UI settings endpoints.
// One file per resource family; each endpoint keeps its own group name.
import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistUsers } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List users - GET /v1/users
export const usersList: DnsfilterEndpoints['usersList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.usersList.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['usersList']
	>('/v1/users', ctx.key, {
		method: 'GET',
		query: {
			page: values.page,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.usersList.parse(response);
	await persistUsers(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.users.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List all users - GET /v1/users/all
export const usersListAll: DnsfilterEndpoints['usersListAll'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.usersListAll.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['usersListAll']
	>('/v1/users/all', ctx.key, {
		method: 'GET',
		query: {
			page: values.page,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.usersListAll.parse(response);
	await persistUsers(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.users.listAll',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Get a user - GET /v1/users/{id}
export const usersGet: DnsfilterEndpoints['usersGet'] = async (ctx, input) => {
	const values = DnsfilterEndpointInputSchemas.usersGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['usersGet']
	>('/v1/users/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.usersGet.parse(response);
	await persistUsers(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.users.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Change password for users - PATCH /v1/users/change_password
export const usersChangePassword: DnsfilterEndpoints['usersChangePassword'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.usersChangePassword.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['usersChangePassword']
		>('/v1/users/change_password', ctx.key, {
			method: 'PATCH',
			body: {
				new_password: values.new_password,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.usersChangePassword.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.users.changePassword',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// List collection users - GET /v1/collections/{collection_id}/users
export const collectionUsersList: DnsfilterEndpoints['collectionUsersList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.collectionUsersList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersList']
		>('/v1/collections/{collection_id}/users', ctx.key, {
			method: 'GET',
			path: {
				collection_id: values.collection_id,
			},
			query: {
				name: values.name,
				page: values.page,
				sort: values.sort,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.collectionUsersList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create a collection user - POST /v1/collections/{collection_id}/users
export const collectionUsersCreate: DnsfilterEndpoints['collectionUsersCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.collectionUsersCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersCreate']
		>('/v1/collections/{collection_id}/users', ctx.key, {
			method: 'POST',
			path: {
				collection_id: values.collection_id,
			},
			body: values.body,
		});
		const result =
			DnsfilterEndpointOutputSchemas.collectionUsersCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a collection user - GET /v1/collections/{collection_id}/users/{id}
export const collectionUsersGet: DnsfilterEndpoints['collectionUsersGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.collectionUsersGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersGet']
		>('/v1/collections/{collection_id}/users/{id}', ctx.key, {
			method: 'GET',
			path: {
				collection_id: values.collection_id,
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.collectionUsersGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete a collection user - DELETE /v1/collections/{collection_id}/users/{id}
export const collectionUsersDelete: DnsfilterEndpoints['collectionUsersDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.collectionUsersDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['collectionUsersDelete']
		>('/v1/collections/{collection_id}/users/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				collection_id: values.collection_id,
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.collectionUsersDelete.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.collectionUsers.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// List organization users - GET /v1/organizations/{organization_id}/users
export const organizationUsersList: DnsfilterEndpoints['organizationUsersList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationUsersList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersList']
		>('/v1/organizations/{organization_id}/users', ctx.key, {
			method: 'GET',
			path: {
				organization_id: values.organization_id,
			},
			query: {
				include_auth_providers: values.include_auth_providers,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create an organization user - POST /v1/organizations/{organization_id}/users
export const organizationUsersCreate: DnsfilterEndpoints['organizationUsersCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationUsersCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersCreate']
		>('/v1/organizations/{organization_id}/users', ctx.key, {
			method: 'POST',
			path: {
				organization_id: values.organization_id,
			},
			body: {
				user: values.user,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get an organization user - GET /v1/organizations/{organization_id}/users/{id}
export const organizationUsersGet: DnsfilterEndpoints['organizationUsersGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationUsersGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersGet']
		>('/v1/organizations/{organization_id}/users/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
				organization_id: values.organization_id,
			},
			query: {
				include_auth_providers: values.include_auth_providers,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update an organization user - PATCH /v1/organizations/{organization_id}/users/{id}
export const organizationUsersUpdate: DnsfilterEndpoints['organizationUsersUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationUsersUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersUpdate']
		>('/v1/organizations/{organization_id}/users/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
				organization_id: values.organization_id,
			},
			body: {
				user: values.user,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete an organization user - DELETE /v1/organizations/{organization_id}/users/{id}
export const organizationUsersDelete: DnsfilterEndpoints['organizationUsersDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationUsersDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersDelete']
		>('/v1/organizations/{organization_id}/users/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersDelete.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Resend invite for organization users - POST /v1/organizations/{organization_id}/users/{id}/resend_invite
export const organizationUsersResendInvite: DnsfilterEndpoints['organizationUsersResendInvite'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.organizationUsersResendInvite.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersResendInvite']
		>('/v1/organizations/{organization_id}/users/{id}/resend_invite', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersResendInvite.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.resendInvite',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a current user - GET /v1/current_user
export const currentUsersGet: DnsfilterEndpoints['currentUsersGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.currentUsersGet.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['currentUsersGet']
	>('/v1/current_user', ctx.key, {
		method: 'GET',
	});
	const result = DnsfilterEndpointOutputSchemas.currentUsersGet.parse(response);
	await persistUsers(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.currentUsers.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a current user - PATCH /v1/current_user
export const currentUsersUpdate: DnsfilterEndpoints['currentUsersUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.currentUsersUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUsersUpdate']
		>('/v1/current_user', ctx.key, {
			method: 'PATCH',
			body: {
				user: values.user,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.currentUsersUpdate.parse(response);
		await persistUsers(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUsers.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a current user UI setting - GET /v2/current_user/ui_settings
export const currentUserUiSettingsGet: DnsfilterEndpoints['currentUserUiSettingsGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.currentUserUiSettingsGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUserUiSettingsGet']
		>('/v2/current_user/ui_settings', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.currentUserUiSettingsGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUserUiSettings.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update a current user UI setting - PATCH /v2/current_user/ui_settings
export const currentUserUiSettingsUpdate: DnsfilterEndpoints['currentUserUiSettingsUpdate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.currentUserUiSettingsUpdate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUserUiSettingsUpdate']
		>('/v2/current_user/ui_settings', ctx.key, {
			method: 'PATCH',
			body: {
				disable_license_warnings: values.disable_license_warnings,
				user_uuid: values.user_uuid,
				theme_mode: values.theme_mode,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.currentUserUiSettingsUpdate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUserUiSettings.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Suppress license warning for current user org UI settings - POST /v2/current_user/suppress_license_warning
export const currentUserOrgUiSettingsSuppressLicenseWarning: DnsfilterEndpoints['currentUserOrgUiSettingsSuppressLicenseWarning'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.currentUserOrgUiSettingsSuppressLicenseWarning.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUserOrgUiSettingsSuppressLicenseWarning']
		>('/v2/current_user/suppress_license_warning', ctx.key, {
			method: 'POST',
			query: {
				body: values.body,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.currentUserOrgUiSettingsSuppressLicenseWarning.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUserOrgUiSettings.suppressLicenseWarning',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
