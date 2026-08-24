import {
	BASECAMP_DEFAULT_USER_AGENT,
	BasecampAccountIdMissingError,
	discoverBasecampAccountId,
	validateAccountId,
} from '../client';

export type BasecampCallContext = {
	key: string;
	options: { accountId?: string; userAgent?: string };
	keys?: { get_account_id?: () => Promise<string | null | undefined> };
};

export async function resolveBasecampAccountId(
	ctx: BasecampCallContext,
): Promise<string> {
	if (ctx.options.accountId) return validateAccountId(ctx.options.accountId);
	const stored = await ctx.keys?.get_account_id?.();
	if (stored) return validateAccountId(stored);
	if (!ctx.key) throw new BasecampAccountIdMissingError();
	return await discoverBasecampAccountId(
		ctx.key,
		ctx.options.userAgent ?? BASECAMP_DEFAULT_USER_AGENT,
	);
}
