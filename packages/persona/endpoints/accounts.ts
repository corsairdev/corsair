import type { PersonaEndpoints } from '..';
import { attributesBody, call, metaBody, pageQuery, segment } from './call';
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
		({ referenceId, ...page }) => ({
			method: 'GET',
			path: '/accounts',
			query: { ...pageQuery(page), 'filter[reference-id]': referenceId },
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: Boolean(result.links?.next),
			}),
		},
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
			path: `/accounts/${segment(accountId)}`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/accounts/${segment(accountId)}`,
			body: attributesBody(attributes),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/accounts/${segment(accountId)}`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		(body) => ({
			method: 'POST',
			path: '/accounts/search',
			body,
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: Boolean(result.links?.next),
			}),
		},
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
		({ accountId, tagName, tagId }) => ({
			method: 'POST',
			path: `/accounts/${segment(accountId)}/add-tag`,
			body: metaBody({ 'tag-name': tagName, 'tag-id': tagId }),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		({ accountId, tagName, tagId }) => ({
			method: 'POST',
			path: `/accounts/${segment(accountId)}/remove-tag`,
			body: metaBody({ 'tag-name': tagName, 'tag-id': tagId }),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
	);
