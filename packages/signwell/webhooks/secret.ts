/**
 * The webhook secret is SignWell's webhook id, which is also the HMAC key for
 * the delivery hash. It comes from the plugin's `webhookSecret` option, else
 * from `keys.set_webhook_signature` on the account, else from the id
 * `webhooks.create` returns (which the caller stores).
 *
 * Shared by the key builder (verifying deliveries) and `webhooks.create`, so
 * both always read the same value.
 */
export async function resolveWebhookId(
	options: { webhookSecret?: string } | undefined,
	keys: { get_webhook_signature: () => Promise<string | null> } | undefined,
): Promise<string | undefined> {
	const fromOption = options?.webhookSecret?.trim();
	if (fromOption) return fromOption;
	try {
		const stored = (await keys?.get_webhook_signature())?.trim();
		return stored || undefined;
	} catch (error) {
		console.warn('Failed to read the SignWell webhook id:', error);
		return undefined;
	}
}
