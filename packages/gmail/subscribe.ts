/**
 * Structurally matches corsair's CorsairPluginSubscribeResult — kept local so
 * this file needs no cross-package type import; the plugin attach-site
 * (`subscribe: gmailSubscribe`) enforces the contract against CorsairPlugin.
 */
type SubscribeResult = {
	webhookLink: { linkType: string; externalId: string };
	webhookSecret?: string;
};

const GMAIL_API = 'https://gmail.googleapis.com/gmail/v1';

/** Minimal shape we need from the account key manager (ctx.keys). */
type SubscribeCtx = {
	keys: {
		get_access_token: () => Promise<string | null | undefined>;
		get_integration_credentials: () => Promise<
			Record<string, string | null | undefined>
		>;
	};
};

/**
 * BYO subscribe for Gmail: arms `users.watch` on the customer's Pub/Sub topic
 * and returns the routing link (email address) + the push subscription's OIDC
 * identity (service-account email or audience) as the verification secret —
 * Hub's verifyPubsub checks the push JWT against it. Unlike Outlook there is
 * no webhook_signature persist: Gmail notifications are verified by Hub only
 * (the plugin's webhook keyBuilder has no verify branch), and delivery rides
 * the customer's Pub/Sub push subscription, not `webhookUrl` directly.
 */
export async function gmailSubscribe(
	ctx: SubscribeCtx,
	_input: { webhookUrl: string },
): Promise<SubscribeResult | null> {
	const accessToken = await ctx.keys.get_access_token();
	if (!accessToken) return null;

	const creds = await ctx.keys.get_integration_credentials();
	if (!creds.topic_id) return null;

	const authHeader = { authorization: `Bearer ${accessToken}` };

	// ponytail: no watch renewal — Gmail watch expires after ~7 days. The
	// shared renewal job (follow-up #2) covers it alongside Graph's 60 min.
	const watchResp = await fetch(`${GMAIL_API}/users/me/watch`, {
		method: 'POST',
		headers: { ...authHeader, 'content-type': 'application/json' },
		body: JSON.stringify({
			topicName: creds.topic_id,
			labelIds: ['INBOX'],
		}),
	});
	if (!watchResp.ok) {
		// Best-effort: surface for diagnosis; the connect-hook caller swallows it.
		throw new Error(
			`Gmail watch failed (${watchResp.status}): ${await watchResp.text()}`,
		);
	}

	// Pub/Sub notifications carry the mailbox email — that's the routing key.
	const profileResp = await fetch(`${GMAIL_API}/users/me/profile`, {
		headers: authHeader,
	});
	if (!profileResp.ok) {
		throw new Error(
			`Gmail profile fetch failed (${profileResp.status}): ${await profileResp.text()}`,
		);
	}
	const { emailAddress } = (await profileResp.json()) as {
		emailAddress?: string;
	};
	if (!emailAddress) return null;

	return {
		webhookLink: { linkType: 'email_address', externalId: emailAddress },
		webhookSecret: creds.pubsub_audience ?? undefined,
	};
}
