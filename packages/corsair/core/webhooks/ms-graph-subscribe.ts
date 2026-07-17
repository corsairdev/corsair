import { randomUUID } from 'node:crypto';
import type { CorsairPluginSubscribeResult } from '../plugins';

const GRAPH_API = 'https://graph.microsoft.com/v1.0';
// Graph minimum is 45 min; maxes vary by resource (mail ~4230, driveItem
// ~42300). 60 sits inside every resource's window.
// ponytail: no renewal — subscriptions lapse after this. The shared renewal
// job (vault follow-up #2) covers all Graph plugins at once.
const EXPIRATION_MINUTES = 60;

/** Minimal shape we need from the account key manager (ctx.keys). */
type SubscribeCtx = {
	keys: {
		get_access_token: () => Promise<string | null | undefined>;
		// clientState is persisted as the BASE oauth_2 webhook_signature field so
		// plugins that verify inbound notifications app-side (outlook, onedrive,
		// teams) can read it; sharepoint's verify skips when unset.
		set_webhook_signature: (value: string) => Promise<void>;
	};
};

/**
 * Shared BYO subscribe for every MS Graph plugin: only `resource` and
 * `changeType` differ per provider. Arms the Graph subscription and returns
 * the routing link (subscription_id) + verification secret (clientState) for
 * Hub to store. Token is freshly exchanged at connect time, so no refresh
 * dance here.
 */
export async function msGraphSubscribe(
	ctx: SubscribeCtx,
	input: { webhookUrl: string; resource: string; changeType: string },
): Promise<CorsairPluginSubscribeResult | null> {
	const accessToken = await ctx.keys.get_access_token();
	if (!accessToken) return null;

	const authHeader = { authorization: `Bearer ${accessToken}` };

	// Delete any prior subscriptions pointing at our Hub URL so reconnects don't
	// leave stale subscriptions firing (their old clientState no longer matches
	// the stored webhook_signature → invalid_signature noise). Best-effort.
	try {
		const listResp = await fetch(`${GRAPH_API}/subscriptions`, {
			headers: authHeader,
		});
		if (listResp.ok) {
			const { value } = (await listResp.json()) as {
				value?: Array<{ id: string; notificationUrl?: string }>;
			};
			const stale = (value ?? []).filter(
				(s) => s.notificationUrl === input.webhookUrl,
			);
			await Promise.all(
				stale.map((s) =>
					fetch(`${GRAPH_API}/subscriptions/${s.id}`, {
						method: 'DELETE',
						headers: authHeader,
					}).catch(() => {}),
				),
			);
		}
	} catch {
		// cleanup is best-effort — never block arming the new subscription
	}

	const clientState = randomUUID();
	const expirationDateTime = new Date(
		Date.now() + EXPIRATION_MINUTES * 60_000,
	).toISOString();

	const response = await fetch(`${GRAPH_API}/subscriptions`, {
		method: 'POST',
		headers: { ...authHeader, 'content-type': 'application/json' },
		body: JSON.stringify({
			changeType: input.changeType,
			notificationUrl: input.webhookUrl,
			resource: input.resource,
			expirationDateTime,
			clientState,
		}),
	});

	if (!response.ok) {
		// Best-effort: surface for diagnosis; the connect-hook caller swallows it.
		throw new Error(
			`MS Graph subscribe failed (${response.status}): ${await response.text()}`,
		);
	}

	const created = (await response.json()) as { id?: string };
	if (!created.id) return null;

	// Persist the clientState so the plugin's webhook keyBuilder can verify each
	// inbound notification's clientState. Without this the app 400s with
	// "webhook signature is missing" on plugins that verify app-side.
	await ctx.keys.set_webhook_signature(clientState);

	return {
		webhookLink: { linkType: 'subscription_id', externalId: created.id },
		webhookSecret: clientState,
	};
}
