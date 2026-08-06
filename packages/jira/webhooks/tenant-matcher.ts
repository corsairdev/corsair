import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

function cloudUrlFromSelf(self: unknown): string | undefined {
	if (typeof self !== 'string') return undefined;
	try {
		const url = new URL(self);
		return `${url.protocol}//${url.host}`;
	} catch {
		return undefined;
	}
}

function extractJiraCloudUrl(
	body: Record<string, unknown>,
): string | undefined {
	const issue = asRecord(body.issue);
	const project = asRecord(body.project);
	const user = asRecord(body.user);

	const issueFields = asRecord(issue?.fields);
	const issueProject = asRecord(issueFields?.project);

	return firstString([
		cloudUrlFromSelf(issue?.self),
		cloudUrlFromSelf(issueProject?.self),
		cloudUrlFromSelf(project?.self),
		cloudUrlFromSelf(user?.self),
	]);
}

// Jira Cloud webhooks embed the site hostname in issue/project self URLs.
// cloudId is not included on webhook payloads; cloud_url matches jiraAuthConfig.
// See https://developer.atlassian.com/cloud/jira/software/webhooks/
export function matchJiraTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const cloudUrl = extractJiraCloudUrl(body);
	if (!cloudUrl) return null;

	return { linkType: 'cloud_url', externalId: cloudUrl };
}
