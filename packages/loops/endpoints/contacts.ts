import type { LoopsEndpoints } from '..';
import { call, withCustomProperties } from './call';
import {
	LoopsEndpointInputSchemas as Inputs,
	LoopsEndpointOutputSchemas as Outputs,
} from './types';

export const find: LoopsEndpoints['contactsFind'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.find',
			input: Inputs.contactsFind,
			output: Outputs.contactsFind,
		},
		input,
		({ email, userId }) => ({
			method: 'GET',
			path: '/v1/contacts/find',
			query: { email, userId },
		}),
	);

export const create: LoopsEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1/contacts/create',
			body: withCustomProperties(parsed),
		}),
		{
			log: (parsed, result) => ({
				contactId: result.id,
				userId: parsed.userId,
				subscribed: parsed.subscribed,
			}),
		},
	);

export const update: LoopsEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: '/v1/contacts/update',
			body: withCustomProperties(parsed),
		}),
		{
			log: (parsed, result) => ({
				contactId: result.id,
				userId: parsed.userId,
			}),
		},
	);

export const remove: LoopsEndpoints['contactsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
		},
		input,
		({ email, userId }) => ({
			method: 'POST',
			path: '/v1/contacts/delete',
			body: { email, userId },
		}),
	);

export const listProperties: LoopsEndpoints['contactsListProperties'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.listProperties',
			input: Inputs.contactsListProperties,
			output: Outputs.contactsListProperties,
		},
		input,
		({ list }) => ({
			method: 'GET',
			path: '/v1/contacts/properties',
			query: { list },
		}),
	);

export const getSuppression: LoopsEndpoints['contactsGetSuppression'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.getSuppression',
			input: Inputs.contactsGetSuppression,
			output: Outputs.contactsGetSuppression,
		},
		input,
		({ email, userId }) => ({
			method: 'GET',
			path: '/v1/contacts/suppression',
			query: { email, userId },
		}),
	);
