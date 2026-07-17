import { randomUUID } from 'node:crypto';

/**
 * Structurally matches corsair's CorsairPluginSubscribeResult — kept local so
 * this file needs no cross-package type import; the plugin attach-site
 * (`subscribe: outlookSubscribe`) enforces the contract against CorsairPlugin.
 */
type SubscribeResult = {
	webhookLink: { linkType: string; externalId: string };
	webhookSecret?: string;
};

const GRAPH_API = 'https://graph.microsoft.com/v1.0';
// Graph caps mail subscriptions at ~4230 min; 60 keeps us safely inside.
// ponytail: no renewal — the subscription expires after this window. Add a
// renewal job when BYO webhooks need to outlive one hour.
const EXPIRATION_MINUTES = 60;
// Incoming mail lands in the Inbox; the demo "send an email → webhook fires"
// only needs new-message events there. Widen to "me/messages" for all folders.
const MAIL_RESOURCE = "me/mailFolders('Inbox')/messages";

/** Minimal shape we need from the account key manager (ctx.keys). */
type SubscribeCtx = {
	keys: { get_access_token: () => Promise<string | null | undefined> };
};

/**
 * BYO subscribe for Outlook: the app holds the token, so it arms the Graph
 * subscription and returns the routing link (subscription_id) + verification
 * secret (clientState) for Hub to store. Token is freshly exchanged at connect
 * time, so no refresh dance here.
 */
export async function outlookSubscribe(
	ctx: SubscribeCtx,
	input: { webhookUrl: string },
): Promise<SubscribeResult | null> {
	const accessToken = await ctx.keys.get_access_token();
	if (!accessToken) return null;

	const clientState = randomUUID();
	const expirationDateTime = new Date(
		Date.now() + EXPIRATION_MINUTES * 60_000,
	).toISOString();

	const response = await fetch(`${GRAPH_API}/subscriptions`, {
		method: 'POST',
		headers: {
			authorization: `Bearer ${accessToken}`,
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			changeType: 'created',
			notificationUrl: input.webhookUrl,
			resource: MAIL_RESOURCE,
			expirationDateTime,
			clientState,
		}),
	});

	if (!response.ok) {
		// Best-effort: surface for diagnosis; the connect-hook caller swallows it.
		throw new Error(
			`Outlook subscribe failed (${response.status}): ${await response.text()}`,
		);
	}

	const created = (await response.json()) as { id?: string };
	if (!created.id) return null;

	return {
		webhookLink: { linkType: 'subscription_id', externalId: created.id },
		webhookSecret: clientState,
	};
}
