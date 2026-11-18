/**
 * The webhook secret: the plugin's webhookSecret option, else the one
 * stored with keys.set_webhook_signature. The full `whsec_...` string is
 * the HMAC key; trim nothing but whitespace.
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
		console.warn('Failed to read the HappyScribe webhook secret:', error);
		return undefined;
	}
}
