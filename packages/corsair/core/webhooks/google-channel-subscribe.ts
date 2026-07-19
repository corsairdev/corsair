import { randomUUID } from 'node:crypto';
import type { CorsairPluginSubscribeResult } from '../plugins';

/** Minimal shape we need from the account key manager (ctx.keys). */
type SubscribeCtx = {
	keys: {
		get_access_token: () => Promise<string | null | undefined>;
	};
};

/**
 * Shared BYO subscribe for Google channel-watch providers (Calendar, Drive):
 * only the watch endpoint (and any extra body fields) differ. Opens a
 * notification channel pointed at the Hub URL and returns the routing link
 * (our generated channel id, echoed back in X-Goog-Channel-ID) + the channel
 * token Hub verifies via X-Goog-Channel-Token. No app-side verify, so nothing
 * is persisted locally.
 * No stale-channel cleanup: Google exposes no channel list API, so prior
 * channels can't be enumerated — they lapse at their TTL (expect brief
 * invalid-token noise after reconnects). Default TTLs are accepted;
 * oauth/renewal.ts re-arms before expiry.
 */
export async function googleChannelSubscribe(
	ctx: SubscribeCtx,
	input: {
		webhookUrl: string;
		watchUrl: string;
		body?: Record<string, unknown>;
	},
): Promise<CorsairPluginSubscribeResult | null> {
	const accessToken = await ctx.keys.get_access_token();
	if (!accessToken) return null;

	const channelId = randomUUID();
	const token = randomUUID();

	const response = await fetch(input.watchUrl, {
		method: 'POST',
		signal: AbortSignal.timeout(20_000),
		headers: {
			authorization: `Bearer ${accessToken}`,
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			id: channelId,
			type: 'web_hook',
			address: input.webhookUrl,
			token,
			...input.body,
		}),
	});

	if (!response.ok) {
		// Best-effort: surface for diagnosis; the connect-hook caller swallows it.
		throw new Error(
			`Google channel watch failed (${response.status}): ${await response.text()}`,
		);
	}

	return {
		webhookLink: { linkType: 'channel_id', externalId: channelId },
		webhookSecret: token,
	};
}
