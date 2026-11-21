import type { SlackContext } from '../index';

// The key manager's methods depend on the auth type and the declared account
// fields, so the two getters read here are looked up by name, not by type.
async function stored(ctx: SlackContext, name: string): Promise<string | null> {
	const keys = ctx.keys as Record<string, unknown> | undefined;
	const get = keys?.[name];
	if (typeof get !== 'function') return null;
	try {
		const value: unknown = await get.call(keys);
		return typeof value === 'string' && value ? value : null;
	} catch {
		return null;
	}
}

// The connecting user's own token, for reads only the user can make (search,
// their DMs and private channels). It replaces the key only when that key is
// the connection's stored one; a key the caller or a hook chose is kept.
export async function userKey(ctx: SlackContext): Promise<string> {
	const [user, own] = await Promise.all([
		stored(ctx, 'get_user_token'),
		stored(ctx, 'get_access_token'),
	]);
	return user && ctx.key === own ? user : ctx.key;
}
