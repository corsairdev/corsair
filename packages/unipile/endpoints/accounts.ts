import type { UnipileEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

// Hosted Auth links are short-lived on purpose; one hour unless the caller
// asks for longer.
const DEFAULT_AUTH_LINK_TTL_MS = 60 * 60 * 1000;

export const list: UnipileEndpoints['accountsList'] = (ctx, input) =>
	call(ctx, 'accountsList', 'accounts.list', input, (parsed) => ({
		method: 'GET',
		path: '/v2/accounts/',
		query: {
			provider: parsed.provider,
			status: parsed.status,
			search: parsed.search,
			account_scope_id: parsed.account_scope_id,
			offset: parsed.offset,
			limit: parsed.limit,
		},
	}));

export const get: UnipileEndpoints['accountsGet'] = (ctx, input) =>
	call(ctx, 'accountsGet', 'accounts.get', input, (parsed) => ({
		method: 'GET',
		path: `/v2/accounts/${segment(parsed.account_id)}`,
	}));

export const remove: UnipileEndpoints['accountsRemove'] = (ctx, input) =>
	call(ctx, 'accountsRemove', 'accounts.remove', input, (parsed) => ({
		method: 'DELETE',
		path: `/v2/accounts/${segment(parsed.account_id)}`,
	}));

export const createAuthLink: UnipileEndpoints['accountsCreateAuthLink'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'accountsCreateAuthLink',
		'accounts.createAuthLink',
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v2/auth/link',
			body: {
				...parsed,
				expires_on:
					parsed.expires_on ??
					new Date(Date.now() + DEFAULT_AUTH_LINK_TTL_MS).toISOString(),
			},
		}),
	);
