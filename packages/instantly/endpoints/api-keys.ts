import { asRecord } from 'corsair/core';
import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

// An API key is returned in full only by apiKeys.create. Listing and
// revoking mask it, like webhook header values, so it never reaches an agent
// through a read.
function redactKey<T extends Record<string, unknown>>(record: T): T {
	return typeof record.key === 'string'
		? { ...record, key: '[redacted]' }
		: record;
}

export function redactApiKey<T extends Record<string, unknown>>(record: T): T {
	return redactKey(record);
}

export function redactApiKeys<T extends { items: Record<string, unknown>[] }>(
	page: T,
): T {
	return {
		...page,
		items: page.items.map((item) => redactKey(asRecord(item) ?? item)),
	};
}

export const create: InstantlyEndpoints['apiKeysCreate'] = (ctx, input) =>
	call(
		ctx,
		'apiKeysCreate',
		'apiKeys.create',
		input,
		(body) => ({ method: 'POST', path: '/api-keys', body }),
		{},
	);

export const list: InstantlyEndpoints['apiKeysList'] = async (ctx, input) =>
	redactApiKeys(
		await call(
			ctx,
			'apiKeysList',
			'apiKeys.list',
			input,
			(query) => ({ method: 'GET', path: '/api-keys', query }),
			{ log: (_, result) => ({ count: result.items.length }) },
		),
	);

export const remove: InstantlyEndpoints['apiKeysDelete'] = async (ctx, input) =>
	redactApiKey(
		await call(
			ctx,
			'apiKeysDelete',
			'apiKeys.delete',
			input,
			({ id }) => ({ method: 'DELETE', path: `/api-keys/${segment(id)}` }),
			{ log: ({ id }) => ({ id }) },
		),
	);
