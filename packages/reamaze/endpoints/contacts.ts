import type { ReamazeEndpoints } from '..';
import { pathSegment } from '../client';
import { call, dataParams, queryOf, unwrapList, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

export const list: ReamazeEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		({ q, data, sort, type, page }) => ({
			method: 'GET',
			path: '/contacts',
			query: {
				...queryOf({ q, sort, type, page }),
				...dataParams(data),
			},
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'contact list'),
				contacts: unwrapList(raw, 'contacts', 'contact list'),
			}),
			log: (_, result) => ({ count: result.contacts.length }),
		},
	);

export const create: ReamazeEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		({ name, email, mobile, id, external_avatar_url, notes, data }) => ({
			method: 'POST',
			path: '/contacts',
			body: {
				contact: { name, email, mobile, id, external_avatar_url, notes, data },
			},
		}),
		{
			shape: (raw) => unwrapObject(raw, 'created contact'),
			log: (parsed, result) => ({
				email:
					typeof result.contact.email === 'string'
						? result.contact.email
						: parsed.email,
			}),
		},
	);

export const update: ReamazeEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		({
			email,
			identifier_type,
			name,
			friendly_name,
			external_avatar_url,
			notes,
			data,
		}) => ({
			method: 'PUT',
			path: `/contacts/${pathSegment(email)}`,
			query: queryOf({ identifier_type }),
			body: {
				// Email, mobile and the other identifiers cannot be changed, so only
				// the writable attributes go in the body.
				contact: { name, friendly_name, external_avatar_url, notes, data },
			},
		}),
		{
			shape: (raw) => unwrapObject(raw, 'updated contact'),
			log: (parsed) => ({ email: parsed.email }),
		},
	);
