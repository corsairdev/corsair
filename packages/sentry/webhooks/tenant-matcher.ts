import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

function extractOrganizationSlugFromIssueUrl(
	issue: Record<string, unknown> | null,
): string | undefined {
	if (!issue) return undefined;

	const issueUrl = firstString([issue.web_url, issue.permalink]);
	if (!issueUrl) return undefined;

	const match = issueUrl.match(/^https?:\/\/([^.]+)\.sentry\.io/i);
	return match?.[1];
}

// Sentry Integration Platform webhooks map requests via installation.uuid.
// See https://docs.sentry.io/integrations/integration-platform/webhooks/
export function matchSentryTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const installationUuid = firstString([
		asRecord(body.installation)?.uuid,
		asRecord(asRecord(body.data)?.installation)?.uuid,
	]);
	if (installationUuid) {
		return { linkType: 'installation_id', externalId: installationUuid };
	}

	const organizationSlug = firstString([
		asRecord(asRecord(asRecord(body.data)?.installation)?.organization)?.slug,
		extractOrganizationSlugFromIssueUrl(
			asRecord(asRecord(body.data)?.issue),
		),
	]);
	if (organizationSlug) {
		return { linkType: 'organization_slug', externalId: organizationSlug };
	}

	return null;
}
