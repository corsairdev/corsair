import type { WrikeEndpoints } from '..';
import { id } from '../client';
import { call } from './call';
import {
	WrikeEndpointInputSchemas as Inputs,
	WrikeEndpointOutputSchemas as Outputs,
} from './types';

export const list: WrikeEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		({ me, active, fields }) => ({
			method: 'GET',
			path: '/contacts',
			query: { me, active, fields },
		}),
		{
			// Contacts are people, so only the count is logged.
			log: (_, result) => ({ count: result.data?.length ?? 0 }),
		},
	);

/**
 * One contact, by id or by the literal `me`. Wrike refuses `me` as a contact id
 * (`Invalid ContactOrInvitation ID`), so `me` reads `/contacts?me=true`, which
 * answers the same one-item envelope.
 */
export const get: WrikeEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ id: contactId }) =>
			contactId === 'me'
				? { method: 'GET', path: '/contacts', query: { me: true } }
				: { method: 'GET', path: `/contacts/${id(contactId)}` },
		{
			log: (_, result) => ({
				id: result.data?.[0]?.id ?? undefined,
				type: result.data?.[0]?.type ?? undefined,
			}),
		},
	);

/**
 * The account behind the token. Its `rootFolderId` is the virtual folder every
 * create needs as a parent, so this is worth reading once rather than guessing.
 */
export const account: WrikeEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({ method: 'GET', path: '/account' }),
		{
			log: (_, result) => ({
				id: result.data?.[0]?.id ?? undefined,
				rootFolder: result.data?.[0]?.rootFolderId ?? undefined,
			}),
		},
	);
