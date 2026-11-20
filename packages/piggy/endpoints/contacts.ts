import type { PiggyEndpoints } from '..';
import { call } from './call';
import {
	createdAtQuery,
	PiggyEndpointInputSchemas as Inputs,
	PiggyEndpointOutputSchemas as Outputs,
} from './types';

const CLIENT = '/api/v3/oauth/clients';

export const list: PiggyEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		({
			limit,
			page,
			sort,
			createdAtGt,
			createdAtGte,
			createdAtLt,
			createdAtLte,
			attributesQuery,
		}) => ({
			method: 'GET',
			path: `${CLIENT}/contacts`,
			query: {
				limit,
				page,
				sort,
				...createdAtQuery({
					createdAtGt,
					createdAtGte,
					createdAtLt,
					createdAtLte,
				}),
				...attributesQuery,
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const create: PiggyEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		({ email, referralCode }) => ({
			method: 'POST',
			path: `${CLIENT}/contacts`,
			body: { email, referral_code: referralCode },
		}),
		{ log: (_, created) => ({ contactUuid: created.data.uuid }) },
	);

export const createAnonymous: PiggyEndpoints['contactsCreateAnonymous'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.createAnonymous',
			input: Inputs.contactsCreateAnonymous,
			output: Outputs.contactsCreateAnonymous,
		},
		input,
		({ contactIdentifierValue }) => ({
			method: 'POST',
			path: `${CLIENT}/contacts/anonymous`,
			body: { contact_identifier_value: contactIdentifierValue },
		}),
		{ log: (_, created) => ({ contactUuid: created.data.uuid }) },
	);

export const findOneByEmail: PiggyEndpoints['contactsFindOneByEmail'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.findOneByEmail',
			input: Inputs.contactsFindOneByEmail,
			output: Outputs.contactsFindOneByEmail,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: `${CLIENT}/contacts/find-one-by`,
			query: { email },
		}),
		{ log: (_, found) => ({ contactUuid: found.data.uuid ?? undefined }) },
	);

export const findOrCreate: PiggyEndpoints['contactsFindOrCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.findOrCreate',
			input: Inputs.contactsFindOrCreate,
			output: Outputs.contactsFindOrCreate,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: `${CLIENT}/contacts/find-or-create`,
			query: { email },
		}),
		{ log: (_, found) => ({ contactUuid: found.data.uuid ?? undefined }) },
	);

export const get: PiggyEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ contactUuid }) => ({
			method: 'GET',
			path: `${CLIENT}/contacts/${encodeURIComponent(contactUuid)}`,
		}),
		{ log: (_, contact) => ({ contactUuid: contact.data.uuid ?? undefined }) },
	);

export const update: PiggyEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		({ contactUuid, attributes }) => ({
			method: 'PUT',
			path: `${CLIENT}/contacts/${encodeURIComponent(contactUuid)}`,
			body: { attributes },
		}),
		{ log: (_, contact) => ({ contactUuid: contact.data.uuid ?? undefined }) },
	);

export const deleteContact: PiggyEndpoints['contactsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
		},
		input,
		({ contactUuid, type }) => ({
			method: 'POST',
			path: `${CLIENT}/contacts/${encodeURIComponent(contactUuid)}/delete`,
			body: { type },
		}),
		{ log: ({ contactUuid, type }) => ({ contactUuid, type }) },
	);

export const claim: PiggyEndpoints['contactsClaim'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.claim',
			input: Inputs.contactsClaim,
			output: Outputs.contactsClaim,
		},
		input,
		({ anonymousContactUuid, email }) => ({
			method: 'PUT',
			path: `${CLIENT}/contacts/${encodeURIComponent(anonymousContactUuid)}/claim`,
			body: { email },
		}),
		{ log: (_, claimed) => ({ contactUuid: claimed.data.uuid ?? undefined }) },
	);

export const merge: PiggyEndpoints['contactsMerge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.merge',
			input: Inputs.contactsMerge,
			output: Outputs.contactsMerge,
		},
		input,
		({ sourceContactUuid, destinationContactUuid }) => ({
			method: 'POST',
			path: `${CLIENT}/contacts/merge`,
			body: {
				source_contact_uuid: sourceContactUuid,
				destination_contact_uuid: destinationContactUuid,
			},
		}),
		{
			log: ({ sourceContactUuid, destinationContactUuid }) => ({
				sourceContactUuid,
				destinationContactUuid,
			}),
		},
	);

export const getCreditBalance: PiggyEndpoints['contactsGetCreditBalance'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.getCreditBalance',
			input: Inputs.contactsGetCreditBalance,
			output: Outputs.contactsGetCreditBalance,
		},
		input,
		({ contactUuid }) => ({
			method: 'GET',
			path: `${CLIENT}/contacts/${encodeURIComponent(contactUuid)}/credit-balance`,
		}),
		undefined,
	);

export const getPrepaidBalance: PiggyEndpoints['contactsGetPrepaidBalance'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.getPrepaidBalance',
			input: Inputs.contactsGetPrepaidBalance,
			output: Outputs.contactsGetPrepaidBalance,
		},
		input,
		({ contactUuid }) => ({
			method: 'GET',
			path: `${CLIENT}/contacts/${encodeURIComponent(contactUuid)}/prepaid-balance`,
		}),
		undefined,
	);

export const getTier: PiggyEndpoints['contactsGetTier'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.getTier',
			input: Inputs.contactsGetTier,
			output: Outputs.contactsGetTier,
		},
		input,
		({ contactUuid }) => ({
			method: 'GET',
			path: `${CLIENT}/contacts/${encodeURIComponent(contactUuid)}/tier`,
		}),
		{ log: (_, tier) => ({ tier: tier.data.name ?? undefined }) },
	);
