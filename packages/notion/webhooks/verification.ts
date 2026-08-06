import type { NotionWebhooks } from '../index';
import { createNotionMatch } from './types';

type WebhookKeys = {
	get_webhook_signature: () => Promise<string | null>;
	set_webhook_signature: (value: string) => Promise<void>;
};

// Serialize verification handshakes so concurrent handlers in this process
// can't both observe an empty signature and last-write-win.
let registrationChain: Promise<void> = Promise.resolve();

async function ensureWebhookSignature(
	keys: WebhookKeys,
	token: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
	const run = registrationChain.then(async () => {
		const existing = await keys.get_webhook_signature();
		if (existing) {
			if (existing !== token) {
				return {
					ok: false as const,
					error: 'Invalid verification token',
				};
			}
			return { ok: true as const };
		}

		await keys.set_webhook_signature(token);

		// Another writer (or cross-process race) may have replaced it — reject
		// rather than treat a foreign token as a successful handshake.
		const stored = await keys.get_webhook_signature();
		if (stored !== token) {
			return {
				ok: false as const,
				error: 'Invalid verification token',
			};
		}
		return { ok: true as const };
	});
	registrationChain = run.then(
		() => undefined,
		() => undefined,
	);
	return run;
}

export const verification: NotionWebhooks['verification'] = {
	match: createNotionMatch('url_verification'),
	handler: async (ctx, request) => {
		if (
			!('verification_token' in request.payload) ||
			!request.payload.verification_token
		) {
			return {
				success: false,
				data: undefined,
			};
		}

		const token = request.payload.verification_token;
		const ensured = await ensureWebhookSignature(ctx.keys, token);
		if (!ensured.ok) {
			return {
				success: false,
				statusCode: 401,
				error: ensured.error,
			};
		}

		console.log('Notion webhook verification request received');

		return {
			success: true,
			returnToSender: {
				verification_token: token,
			},
			data: {
				verification_token: token,
				type: 'url_verification',
			},
		};
	},
};
