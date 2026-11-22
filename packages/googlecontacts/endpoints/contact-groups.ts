import { logEventFromContext } from 'corsair/core';
import {
	joinFieldMask,
	makeAuthenticatedPeopleRequest,
	resourcePath,
} from '../client';
import type { GoogleContactsEndpoints } from '../index';
import {
	DEFAULT_GROUP_FIELDS,
	persistContactGroup,
	WRITE_GROUP_FIELDS,
} from './persist';
import type { GoogleContactsEndpointOutputs } from './types';
import { GoogleContactsEndpointInputSchemas as Inputs } from './types';

export const list: GoogleContactsEndpoints['contactGroupsList'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.contactGroupsList.parse(rawInput);
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

	const groupFields = input.groupFields ?? DEFAULT_GROUP_FIELDS;
	for (const group of result.contactGroups ?? []) {
		await persistContactGroup(ctx, group, groupFields);
	}
	await logEventFromContext(
		ctx,
		'googlecontacts.contactGroups.list',
		{},
		'completed',
	);
	return result;
};

export const get: GoogleContactsEndpoints['contactGroupsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.contactGroupsGet.parse(rawInput);
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactGroupsGet']
	>(resourcePath('contactGroups', input.resourceName), ctx, {
		method: 'GET',
		query: {
			maxMembers: input.maxMembers,
			groupFields: joinFieldMask(input.groupFields),
		},
	});

	await persistContactGroup(
		ctx,
		result,
		input.groupFields ?? DEFAULT_GROUP_FIELDS,
	);
	await logEventFromContext(
		ctx,
		'googlecontacts.contactGroups.get',
		{ resourceName: input.resourceName },
		'completed',
	);
	return result;
};

export const create: GoogleContactsEndpoints['contactGroupsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.contactGroupsCreate.parse(rawInput);
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactGroupsCreate']
	>('/contactGroups', ctx, {
		method: 'POST',
		body: { contactGroup: { name: input.name } },
	});

	await persistContactGroup(ctx, result, WRITE_GROUP_FIELDS);
	await logEventFromContext(
		ctx,
		'googlecontacts.contactGroups.create',
		{ resourceName: result.resourceName },
		'completed',
	);
	return result;
};

export const update: GoogleContactsEndpoints['contactGroupsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.contactGroupsUpdate.parse(rawInput);
	const result = await makeAuthenticatedPeopleRequest<
		GoogleContactsEndpointOutputs['contactGroupsUpdate']
	>(resourcePath('contactGroups', input.resourceName), ctx, {
		method: 'PUT',
		body: {
			contactGroup: {
				resourceName: input.resourceName,
				etag: input.etag,
				name: input.name,
			},
		},
	});

	await persistContactGroup(ctx, result, WRITE_GROUP_FIELDS);
	await logEventFromContext(
		ctx,
		'googlecontacts.contactGroups.update',
		{ resourceName: input.resourceName },
		'completed',
	);
	return result;
};

/** Upper bound for the member list read before a delete-with-contacts. */
const MAX_MEMBERS = 10000;

export const deleteGroup: GoogleContactsEndpoints['contactGroupsDelete'] =
	async (ctx, rawInput) => {
		const input = Inputs.contactGroupsDelete.parse(rawInput);
		const path = resourcePath('contactGroups', input.resourceName);

		// With deleteContacts Google removes the members too, so read who they
		// are first; their saved rows go once the delete succeeds.
		let members: string[] = [];
		if (input.deleteContacts && ctx.db.contacts) {
			const group = await makeAuthenticatedPeopleRequest<
				GoogleContactsEndpointOutputs['contactGroupsGet']
			>(path, ctx, {
				method: 'GET',
				query: { maxMembers: MAX_MEMBERS, groupFields: 'name' },
			});
			members = group.memberResourceNames ?? [];
		}

		await makeAuthenticatedPeopleRequest<void>(path, ctx, {
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
		for (const member of members) {
			try {
				await ctx.db.contacts?.deleteByEntityId(member);
			} catch (error) {
				console.warn('Failed to delete contact from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googlecontacts.contactGroups.delete',
			{
				resourceName: input.resourceName,
				deleteContacts: input.deleteContacts,
			},
			'completed',
		);
	};

export const modifyMembers: GoogleContactsEndpoints['contactGroupsModifyMembers'] =
	async (ctx, rawInput) => {
		const input = Inputs.contactGroupsModifyMembers.parse(rawInput);
		const result = await makeAuthenticatedPeopleRequest<
			GoogleContactsEndpointOutputs['contactGroupsModifyMembers']
		>(
			`${resourcePath('contactGroups', input.resourceName)}/members:modify`,
			ctx,
			{
				method: 'POST',
				body: {
					resourceNamesToAdd: input.resourceNamesToAdd,
					resourceNamesToRemove: input.resourceNamesToRemove,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'googlecontacts.contactGroups.modifyMembers',
			{ resourceName: input.resourceName },
			'completed',
		);
		return result;
	};
