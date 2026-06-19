import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import {
	asRecord,
	firstString,
	getHeader,
	readBodyRecord,
} from 'corsair/core';

function readJwtPayload(
	request: RawWebhookRequest,
): Record<string, unknown> | null {
	const authorization = getHeader(request.headers, 'authorization');
	if (!authorization) return null;

	const token = authorization.startsWith('Bearer ')
		? authorization.slice('Bearer '.length)
		: authorization;
	const parts = token.split('.');
	const payloadSegment = parts[1];
	if (!payloadSegment) return null;

	try {
		const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
		const padded = normalized.padEnd(
			normalized.length + ((4 - (normalized.length % 4)) % 4),
			'=',
		);
		return asRecord(JSON.parse(Buffer.from(padded, 'base64').toString('utf8')));
	} catch {
		return null;
	}
}

// Monday board webhooks sign requests with a JWT that includes accountId.
// App lifecycle webhooks may also include accountId at the top level.
// Challenge handshakes only carry challenge and should not resolve a tenant.
// See https://developer.monday.com/apps/docs/integration-authorization
export function matchMondayTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	if (typeof body.challenge === 'string') return null;

	const accountId = firstString([
		body.accountId,
		readJwtPayload(request)?.accountId,
	]);
	if (!accountId) return null;

	return { linkType: 'accountId', externalId: accountId };
}
