import { logEventFromContext } from 'corsair/core';
import { joinFieldMask, makeAuthenticatedPeopleRequest } from '../client';
import type { GoogleContactsEndpoints } from '../index';
import { persistContactGroup } from './persist';
import type { GoogleContactsEndpointOutputs } from './types';

export const list: GoogleContactsEndpoints['contactGroupsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactGroupsList']
	>('/contactGroups', ctx, {
		method: 'GET',
		query: {
			pageSize: input.pageSize,
			pageToken: input.pageToken,
			syncToken: input.syncToken,
			groupFields: joinFieldMask(input.groupFields),
		},
	});

	for (const group of result.contactGroups ?? []) {
		await persistContactGroup(ctx, group);
	}
	await logEventFromContext(
		ctx,
		'googlecontacts.contactGroups.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GoogleContactsEndpoints['contactGroupsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactGroupsGet']
	>(`/${input.resourceName}`, ctx, {
		method: 'GET',
		query: {
			maxMembers: input.maxMembers,
			groupFields: joinFieldMask(input.groupFields),
		},
	});

	await persistContactGroup(ctx, result);
	await logEventFromContext(
		ctx,
		'googlecontacts.contactGroups.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GoogleContactsEndpoints['contactGroupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactGroupsCreate']
	>('/contactGroups', ctx, {
		method: 'POST',
		body: { contactGroup: { name: input.name } },
	});

	await persistContactGroup(ctx, result);
	await logEventFromContext(
		ctx,
		'googlecontacts.contactGroups.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GoogleContactsEndpoints['contactGroupsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactGroupsUpdate']
	>(`/${input.resourceName}`, ctx, {
		method: 'PUT',
		body: {
			contactGroup: {
				resourceName: input.resourceName,
				etag: input.etag,
				name: input.name,
			},
		},
	});

	await persistContactGroup(ctx, result);
	await logEventFromContext(
		ctx,
		'googlecontacts.contactGroups.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteGroup: GoogleContactsEndpoints['contactGroupsDelete'] =
	async (ctx, input) => {
		await makeAuthenticatedPeopleRequest<void>(`/${input.resourceName}`, ctx, {
			method: 'DELETE',
			query: { deleteContacts: input.deleteContacts },
		});

		if (ctx.db.contactGroups) {
			try {
				await ctx.db.contactGroups.deleteByEntityId(input.resourceName);
			} catch (error) {
				console.warn('Failed to delete contact group from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googlecontacts.contactGroups.delete',
			{ ...input },
			'completed',
		);
	};

export const modifyMembers: GoogleContactsEndpoints['contactGroupsModifyMembers'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedPeopleRequest<
			GoogleContactsEndpointOutputs['contactGroupsModifyMembers']
		>(`/${input.resourceName}/members:modify`, ctx, {
			method: 'POST',
			body: {
				resourceNamesToAdd: input.resourceNamesToAdd,
				resourceNamesToRemove: input.resourceNamesToRemove,
			},
		});

		await logEventFromContext(
			ctx,
			'googlecontacts.contactGroups.modifyMembers',
			{ ...input },
			'completed',
		);
		return result;
	};
