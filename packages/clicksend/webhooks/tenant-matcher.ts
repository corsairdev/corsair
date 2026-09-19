import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

function parseAuthToken(raw: string): string | undefined {
	if (raw.startsWith('Bearer ')) {
		const token = raw.slice(7).trim();
		return token.length > 0 ? token : undefined;
	}

	if (raw.startsWith('Basic ')) {
		try {
			const decoded = Buffer.from(raw.slice(6).trim(), 'base64').toString(
				'utf8',
			);
			const parts = decoded.split(':');
			if (parts.length > 1 && parts[1]) {
				return parts[1].trim() || undefined;
			}
			return decoded.trim() || undefined;
		} catch {
			return undefined;
		}
	}

	return raw.trim() || undefined;
}

export function matchClickSendTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	const query = request.query as
		| Record<string, string | string[] | undefined>
		| undefined;
	const headers = request.headers as
		| Record<string, string | string[] | undefined>
		| undefined;

	const webhookSecret = firstString([
		parseAuthToken(firstString([headers?.authorization]) ?? ''),
		firstString([headers?.['x-clicksend-token']]),
		firstString([headers?.['x-webhook-secret']]),
		firstString([query?.token]),
		firstString([query?.secret]),
	]);

	if (webhookSecret) {
		return { linkType: 'webhook_signature', externalId: webhookSecret };
	}

	const username = firstString([
		query?.username,
		query?.user_id,
		body?.username,
		asRecord(body?.data)?.username,
		body?.user_id,
		asRecord(body?.data)?.user_id,
		body?.user_id ? String(body.user_id) : undefined,
	]);

	if (!username) return null;

	return { linkType: 'username', externalId: username };
}
