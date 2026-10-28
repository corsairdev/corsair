/**
 * The webhook secret: the plugin's webhookSecret option, else the one
 * stored with keys.set_webhook_signature. Trimmed; undefined when neither is
 * set. Shared by the key builder (verifying deliveries) and webhooks.create
 * (attaching the header), so both always use the same value.
 */
export async function resolveWebhookSecret(
	options: { webhookSecret?: string } | undefined,
	keys: { get_webhook_signature: () => Promise<string | null> } | undefined,
): Promise<string | undefined> {
	const fromOption = options?.webhookSecret?.trim();
	if (fromOption) return fromOption;
	try {
		const stored = (await keys?.get_webhook_signature())?.trim();
		return stored || undefined;
	} catch (error) {
		console.warn('Failed to read the Instantly webhook secret:', error);
		return undefined;
	}
}
