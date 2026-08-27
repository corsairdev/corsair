import type { BeeminderAuthParam, BeeminderRequestOptions } from '../client';
import { makeBeeminderRequest } from '../client';

type BeeminderCallContext = {
	key: string;
	options: { username?: string | undefined; authType?: string | undefined };
	keys?: { get_username?: () => Promise<string | null | undefined> };
};

export async function resolveUsername(
	ctx: BeeminderCallContext,
): Promise<string> {
	const configured = ctx.options.username;
	if (configured) return configured;

	const stored = await ctx.keys?.get_username?.();
	if (stored) return stored;

	return 'me';
}

function authParamFor(ctx: BeeminderCallContext): BeeminderAuthParam {
	return ctx.options.authType === 'oauth_2' ? 'access_token' : 'auth_token';
}

export async function beeminderCall<T>(
	ctx: BeeminderCallContext,
	endpoint: string,
	options: BeeminderRequestOptions = {},
): Promise<T> {
	const username = await resolveUsername(ctx);
	const resolvedEndpoint = endpoint.replace('{username}', username);

	return await makeBeeminderRequest<T>(resolvedEndpoint, ctx.key, {
		...options,
		authParam: options.authParam ?? authParamFor(ctx),
	});
}

export function compactBody(
	body: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
	const compacted: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const compacted: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}
