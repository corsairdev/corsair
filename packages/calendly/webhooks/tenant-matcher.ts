import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

const CALENDLY_ORGANIZATION_URI =
	/^https:\/\/api\.calendly\.com\/organizations\/[^/]+$/;
const CALENDLY_USER_URI = /^https:\/\/api\.calendly\.com\/users\/[^/]+$/;

function findCalendlyOrganizationUri(value: unknown): string | undefined {
	if (typeof value === 'string' && CALENDLY_ORGANIZATION_URI.test(value)) {
		return value;
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			const organizationUri = findCalendlyOrganizationUri(item);
			if (organizationUri) return organizationUri;
		}
		return undefined;
	}

	const record = asRecord(value);
	if (!record) return undefined;

	const directOrganization = firstString([record.organization]);
	if (
		directOrganization &&
		CALENDLY_ORGANIZATION_URI.test(directOrganization)
	) {
		return directOrganization;
	}

	for (const nested of Object.values(record)) {
		const organizationUri = findCalendlyOrganizationUri(nested);
		if (organizationUri) return organizationUri;
	}

	return undefined;
}

function findCalendlyUserUri(value: unknown): string | undefined {
	if (typeof value === 'string' && CALENDLY_USER_URI.test(value)) {
		return value;
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			const userUri = findCalendlyUserUri(item);
			if (userUri) return userUri;
		}
		return undefined;
	}

	const record = asRecord(value);
	if (!record) return undefined;

	for (const nested of Object.values(record)) {
		const userUri = findCalendlyUserUri(nested);
		if (userUri) return userUri;
	}

	return undefined;
}

// Calendly v2 webhook payloads use organization and user URIs throughout the
// nested payload object. Subscriptions are scoped by organization.
// See https://developer.calendly.com/api-docs/69c58a784aabc-webhook-payload
export function matchCalendlyTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const organizationUri = findCalendlyOrganizationUri(body.payload ?? body);
	if (organizationUri) {
		return { linkType: 'organization', externalId: organizationUri };
	}

	const userUri = findCalendlyUserUri(body.payload ?? body);
	if (!userUri) return null;

	return { linkType: 'user_uri', externalId: userUri };
}
