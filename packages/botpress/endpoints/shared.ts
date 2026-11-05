import type { BotpressRequestOptions } from '../client';
import { discoverBotpressWorkspaceId, makeBotpressRequest } from '../client';

/**
 * Minimal structural view of the plugin context the endpoints need.
 *
 * Declaring only the members used here keeps the helpers testable without
 * constructing a full Corsair context, and keeps them working whatever else
 * the concrete context exposes.
 */
type BotpressCallContext = {
	key: string;
	options: { workspaceId?: string | undefined };
	keys?: { get_workspace_id?: () => Promise<string | null | undefined> };
};

/**
 * Resolves the workspace id for a call that strictly needs one.
 *
 * Botpress needs a workspace id alongside the token because one Personal
 * Access Token can reach several workspaces. Configuration wins; a stored key
 * is next; discovery via `GET /v1/admin/workspaces` is the last resort and
 * only succeeds when the token can reach exactly one workspace.
 *
 * Only call this for operations confirmed live to require `x-workspace-id`
 * (see `error-handlers.ts` and the per-group comments) — operations that
 * already identify their target by id in the path do not need it.
 */
export async function resolveWorkspaceId(
	ctx: BotpressCallContext,
): Promise<string> {
	const configured = ctx.options.workspaceId?.trim();
	if (configured) return configured;

	const stored = (await ctx.keys?.get_workspace_id?.())?.trim();
	if (stored) return stored;

	return await discoverBotpressWorkspaceId(ctx.key);
}

/** Issues a Botpress request under the plugin's Personal Access Token. */
export async function botpressCall<T>(
	ctx: BotpressCallContext,
	path: string,
	options: BotpressRequestOptions = {},
): Promise<T> {
	return await makeBotpressRequest<T>(path, ctx.key, options);
}

/**
 * Drops keys whose value is `undefined`.
 *
 * Botpress distinguishes an absent field from an explicit `null` on update
 * bodies: omitting a field leaves it alone, `null` clears it. Serialising
 * `undefined` would produce neither, so unset fields are removed before the
 * body is built.
 */
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
		string | number | boolean | string[] | Record<string, string> | undefined
	>,
>(query: T): T {
	const compacted = {} as T;
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined)
			(compacted as Record<string, unknown>)[key] = value;
	}
	return compacted;
}
