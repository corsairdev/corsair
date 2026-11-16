import type { SlackContext } from '../index';

// The connecting user's xoxp token, when the connection holds one; otherwise
// the bot token. Search and DM/private-channel reads need the user token.
export async function userKey(ctx: SlackContext): Promise<string> {
	const keys = ctx.keys as { get_user_token?: () => Promise<string | null> };
	const token = await keys?.get_user_token?.().catch(() => null);
	return token || ctx.key;
}
