import type { TeltelEndpoints } from '..';
import { call, filterParam, metaResultCall } from './call';
import {
	ContactCreateInputSchema,
	ContactCreateResponseSchema,
	ContactGetInputSchema,
	ContactGetResponseSchema,
	ContactGroupContactsInputSchema,
	ContactGroupContactsResponseSchema,
	ContactGroupCreateInputSchema,
	ContactGroupGetInputSchema,
	ContactGroupRemoveInputSchema,
	ContactGroupResponseSchema,
	ContactGroupsListInputSchema,
	ContactGroupsListResponseSchema,
	ContactGroupUpdateInputSchema,
	ContactRemoveInputSchema,
	ContactsCreateBulkInputSchema,
	ContactsCreateBulkResponseSchema,
	ContactsListInputSchema,
	ContactsListResponseSchema,
	ContactUpdateInputSchema,
	MetaResultSchema,
} from './types';

export const contactsList: TeltelEndpoints['contactsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'contacts.list',
			input: ContactsListInputSchema,
			output: ContactsListResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: '/contacts',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				sort: parsed.sort,
				filter: filterParam([
					['group_id', '=', parsed.group_id],
					['phone', '=', parsed.phone],
				]),
			},
		}),
	);
};

export const contactsGet: TeltelEndpoints['contactsGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'contacts.get',
			input: ContactGetInputSchema,
			output: ContactGetResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({ method: 'GET', path: `/contacts/${parsed.contactId}` }),
	);
};

export const contactsCreate: TeltelEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'contacts.create',
			input: ContactCreateInputSchema,
			output: ContactCreateResponseSchema,
		},
		input,
		(parsed) => parsed,
		() => ({ method: 'POST', path: '/contacts' }),
	);
};

export const contactsCreateBulk: TeltelEndpoints['contactsCreateBulk'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'contacts.createBulk',
			input: ContactsCreateBulkInputSchema,
			output: ContactsCreateBulkResponseSchema,
		},
		input,
		// The bulk route takes an array of contacts as the `data` value.
		(parsed) => parsed.contacts,
		() => ({ method: 'POST', path: '/contacts/bulk' }),
	);
};

export const contactsUpdate: TeltelEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'contacts.update',
			input: ContactUpdateInputSchema,
			output: MetaResultSchema,
		},
		input,
		(parsed) => {
			const { contactId, ...body } = parsed;
			return body;
		},
		(parsed) => ({
			method: 'PATCH',
			path: `/contacts/${parsed.contactId}`,
		}),
	);
};

export const contactsRemove: TeltelEndpoints['contactsRemove'] = async (
	ctx,
	input,
) => {
	return metaResultCall(
		ctx,
		{
			event: 'contacts.remove',
			input: ContactRemoveInputSchema,
			output: MetaResultSchema,
		},
		input,
		(parsed) => ({ method: 'DELETE', path: `/contacts/${parsed.contactId}` }),
	);
};

export const groupsList: TeltelEndpoints['contactGroupsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'contactGroups.list',
			input: ContactGroupsListInputSchema,
			output: ContactGroupsListResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: '/contacts/groups',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
			},
		}),
	);
};

export const groupsGet: TeltelEndpoints['contactGroupsGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'contactGroups.get',
			input: ContactGroupGetInputSchema,
			output: ContactGroupResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: `/contacts/groups/${parsed.groupId}`,
		}),
	);
};

export const groupsCreate: TeltelEndpoints['contactGroupsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'contactGroups.create',
			input: ContactGroupCreateInputSchema,
			output: ContactGroupResponseSchema,
		},
		input,
		(parsed) => ({ name: parsed.name }),
		() => ({ method: 'POST', path: '/contacts/groups' }),
	);
};

export const groupsUpdate: TeltelEndpoints['contactGroupsUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'contactGroups.update',
			input: ContactGroupUpdateInputSchema,
			output: MetaResultSchema,
		},
		input,
		(parsed) => ({ name: parsed.name }),
		(parsed) => ({
			method: 'PATCH',
			path: `/contacts/groups/${parsed.groupId}`,
		}),
	);
};

export const groupsRemove: TeltelEndpoints['contactGroupsRemove'] = async (
	ctx,
	input,
) => {
	return metaResultCall(
		ctx,
		{
			event: 'contactGroups.remove',
			input: ContactGroupRemoveInputSchema,
			output: MetaResultSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/contacts/groups/${parsed.groupId}`,
		}),
	);
};

export const groupsContacts: TeltelEndpoints['contactGroupsContacts'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'contactGroups.contacts',
			input: ContactGroupContactsInputSchema,
			output: ContactGroupContactsResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: `/contacts/groups/${parsed.groupId}/contacts`,
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
			},
		}),
	);
};
