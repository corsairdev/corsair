import { createHmac, timingSafeEqual } from 'node:crypto';

const REPLAY_WINDOW_MS = 5 * 60 * 1000;

function parseSignatureHeader(value: string | undefined): string | undefined {
	if (!value) return undefined;
	return value.startsWith('sha256=') ? value.slice('sha256='.length) : value;
}

export function verifySignedTunnelDelivery(input: {
	body: string;
	signatureHeader: string | undefined;
	timestampHeader: string | undefined;
	signingSecret: string;
}): { ok: true } | { ok: false; error: string } {
	const signingSecret = input.signingSecret.trim();
	if (!signingSecret) {
		return { ok: false, error: 'Tunnel signing secret is required' };
	}

	const signature = parseSignatureHeader(input.signatureHeader);
	if (!signature) {
		return { ok: false, error: 'Invalid tunnel signature' };
	}

	const timestamp = Number(input.timestampHeader);
	if (!Number.isFinite(timestamp)) {
		return { ok: false, error: 'Invalid or missing tunnel timestamp' };
	}

	const ageMs = Math.abs(Date.now() - timestamp * 1000);
	if (ageMs > REPLAY_WINDOW_MS) {
		return {
			ok: false,
			error: 'Tunnel request timestamp is outside the allowed window',
		};
	}

	const expected = createHmac('sha256', signingSecret)
		.update(input.body)
		.digest('hex');

	try {
		if (
			!timingSafeEqual(
				Buffer.from(expected, 'utf8'),
				Buffer.from(signature, 'utf8'),
			)
		) {
			return { ok: false, error: 'Invalid tunnel signature' };
		}
	} catch {
		return { ok: false, error: 'Invalid tunnel signature' };
	}

	return { ok: true };
}
