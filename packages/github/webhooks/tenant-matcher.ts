import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, getHeader, readBodyRecord } from 'corsair/core';

// GitHub App webhooks include installation.id on the payload envelope.
// See https://docs.github.com/en/webhooks/webhook-events-and-payloads
export function matchGithubTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const githubEvent = getHeader(request.headers, 'x-github-event');
	if (githubEvent === 'ping') return null;

	const body = readBodyRecord(request);
	if (!body) return null;

	const installationId = firstString([
		asRecord(body.installation)?.id,
		getHeader(request.headers, 'x-github-hook-installation-target-id'),
	]);

	if (!installationId) return null;

	return { linkType: 'installation_id', externalId: installationId };
}
