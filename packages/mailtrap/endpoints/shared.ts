import type { MailtrapRequestOptions } from '../client';
import { discoverMailtrapAccountId, makeMailtrapRequest } from '../client';

/**
 * Minimal structural view of the plugin context the endpoints need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else
 * the concrete context exposes.
 */
type MailtrapCallContext = {
	key: string;
	options: { accountId?: string | undefined };
	keys?: { get_account_id?: () => Promise<string | null | undefined> };
};

/**
 * Resolves the account id every operation but `account.listAccounts` needs.
 *
 * Mailtrap needs an account id alongside the token because one Personal
 * Access Token can reach several accounts, and — unlike Harvest/Botpress's
 * header-scoped second credential — it is path-scoped
 * (`/api/accounts/{accountId}/...`). Configuration wins; a stored key is
 * next; discovery via `GET /api/accounts` is the last resort and only
 * succeeds when the token can reach exactly one account.
 */
export async function resolveAccountId(
	ctx: MailtrapCallContext,
): Promise<string> {
	const configured = ctx.options.accountId;
	if (configured) return configured;

	const stored = await ctx.keys?.get_account_id?.();
	if (stored) return stored;

	return await discoverMailtrapAccountId(ctx.key);
}

/** Issues a Mailtrap request under the plugin's Personal Access Token. */
export async function mailtrapCall<T>(
	ctx: MailtrapCallContext,
	path: string,
	options: MailtrapRequestOptions = {},
): Promise<T> {
	return await makeMailtrapRequest<T>(path, ctx.key, options);
}

/**
 * Builds a path scoped to the resolved account, e.g.
 * `/api/accounts/{id}/contacts`.
 */
export async function accountPath(
	ctx: MailtrapCallContext,
	suffix: string,
): Promise<string> {
	const accountId = await resolveAccountId(ctx);
	return `/api/accounts/${encodeURIComponent(accountId)}${suffix}`;
}

/** Drops keys whose value is `undefined`. */
export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const compacted: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

/** Same as {@link compactBody}, for query strings. */
export function compactQuery<
	T extends Record<
		string,
		string | number | boolean | string[] | number[] | undefined
	>,
>(query: T): T {
	const compacted = {} as T;
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined)
			(compacted as Record<string, unknown>)[key] = value;
	}
	return compacted;
}
