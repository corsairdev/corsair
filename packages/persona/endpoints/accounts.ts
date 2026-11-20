import type { PersonaEndpoints } from '..';
import { attributesBody, call } from './call';
import {
	PersonaEndpointInputSchemas as Inputs,
	PersonaEndpointOutputSchemas as Outputs,
} from './types';

export const list: PersonaEndpoints['accountsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.list',
			input: Inputs.accountsList,
			output: Outputs.accountsList,
		},
		input,
		({ pageAfter, pageSize }) => ({
			method: 'GET',
			path: '/accounts',
			query: {
				'page[after]': pageAfter,
				'page[size]': pageSize,
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PersonaEndpoints['accountsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.get',
			input: Inputs.accountsGet,
			output: Outputs.accountsGet,
		},
		input,
		({ accountId }) => ({
			method: 'GET',
			path: `/accounts/${encodeURIComponent(accountId)}`,
		}),
		{ log: (_, result) => ({ accountId: result.data?.id ?? undefined }) },
	);

export const create: PersonaEndpoints['accountsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.create',
			input: Inputs.accountsCreate,
			output: Outputs.accountsCreate,
		},
		input,
		({ attributes }) => ({
			method: 'POST',
			path: '/accounts',
			body: attributesBody(attributes),
		}),
		{ log: (_, result) => ({ accountId: result.data?.id ?? undefined }) },
	);

export const update: PersonaEndpoints['accountsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.update',
			input: Inputs.accountsUpdate,
			output: Outputs.accountsUpdate,
		},
		input,
		({ accountId, attributes }) => ({
			method: 'PATCH',
			path: `/accounts/${encodeURIComponent(accountId)}`,
			body: attributesBody(attributes),
		}),
		{ log: (_, result) => ({ accountId: result.data?.id ?? undefined }) },
	);

export const redact: PersonaEndpoints['accountsRedact'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.redact',
			input: Inputs.accountsRedact,
			output: Outputs.accountsRedact,
		},
		input,
		({ accountId }) => ({
			method: 'DELETE',
			path: `/accounts/${encodeURIComponent(accountId)}`,
		}),
		{
			// A 204 no-body answer means Persona accepted the redaction.
			shape: (raw, { accountId }) => {
				if (raw !== undefined && raw !== null && raw !== '') {
					throw new Error(
						`Persona accounts.redact: unexpected body ${JSON.stringify(raw)}`,
					);
				}
				return { success: true };
			},
			log: (_parsed, result) => ({ success: result.success }),
		},
	);

export const search: PersonaEndpoints['accountsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.search',
			input: Inputs.accountsSearch,
			output: Outputs.accountsSearch,
		},
		input,
		({ query }) => ({
			method: 'POST',
			path: '/accounts/search',
			body: { query },
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const addTag: PersonaEndpoints['accountsAddTag'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.addTag',
			input: Inputs.accountsAddTag,
			output: Outputs.accountsAddTag,
		},
		input,
		({ accountId, tag }) => ({
			method: 'POST',
			path: `/accounts/${encodeURIComponent(accountId)}/add-tag`,
			body: attributesBody({ tag }),
		}),
		{ log: (_parsed, result) => ({ success: result.success }) },
	);

export const removeTag: PersonaEndpoints['accountsRemoveTag'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.removeTag',
			input: Inputs.accountsRemoveTag,
			output: Outputs.accountsRemoveTag,
		},
		input,
		({ accountId, tag }) => ({
			method: 'POST',
			path: `/accounts/${encodeURIComponent(accountId)}/remove-tag`,
			body: attributesBody({ tag }),
		}),
		{ log: (_parsed, result) => ({ success: result.success }) },
	);
