import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

function parseBasicAuthApiKey(raw: string): string | undefined {
	if (!raw.startsWith('Basic ')) {
		return undefined;
	}

	try {
		const decoded = Buffer.from(raw.slice(6).trim(), 'base64').toString('utf8');
		const colonIndex = decoded.indexOf(':');
		if (colonIndex === -1) {
			return undefined;
		}
		const apiKey = decoded.slice(colonIndex + 1).trim();
		return apiKey.length > 0 ? apiKey : undefined;
	} catch {
		return undefined;
	}
}

function parseBearerToken(raw: string): string | undefined {
	if (!raw.startsWith('Bearer ')) {
		return undefined;
	}

	const token = raw.slice(7).trim();
	return token.length > 0 ? token : undefined;
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

	const authHeader = firstString([headers?.authorization]);
	const basicApiKey = authHeader ? parseBasicAuthApiKey(authHeader) : undefined;
	if (basicApiKey) {
		return { linkType: 'api_key', externalId: basicApiKey };
	}

	const webhookSecret = firstString([
		authHeader ? parseBearerToken(authHeader) : undefined,
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
