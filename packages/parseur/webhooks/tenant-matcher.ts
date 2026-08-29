import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString } from 'corsair/core';

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return asRecord(parsed);
		} catch {
			return null;
		}
	}
	return asRecord(body);
}

export function matchParseurTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = parseBody(request.body);
	if (!body) return null;

	const document = asRecord(body.document);
	const externalId = firstString([
		body.parser_id,
		body.parser,
		body.mailbox_id,
		document?.parser,
		document?.parser_id,
	]);

	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
