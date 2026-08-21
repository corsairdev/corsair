import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyAivoovWebhookSignature(
	request: WebhookRequest<AivoovWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Webhook secret is not configured' };
	}

	const signature = request.headers?.['x-aivoov-signature'];

	if (!signature) {
		return { valid: false, error: 'Missing webhook signature' };
	}

	const payload =
		typeof request.body === 'string'
			? request.body
			: JSON.stringify(request.body);

	const expected = createHmac('sha256', secret).update(payload).digest('hex');

	const provided = signature.replace(/^sha256=/, '');

	try {
		const valid = timingSafeEqual(
			Buffer.from(provided, 'utf8'),
			Buffer.from(expected, 'utf8'),
		);

		return valid
			? { valid: true }
			: { valid: false, error: 'Invalid webhook signature' };
	} catch {
		return { valid: false, error: 'Invalid webhook signature' };
	}
}
