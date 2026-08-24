import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

const IDENTITY_FETCH_TIMEOUT_MS = 5_000;

function salesforceIdentityUrl(value: string): URL | null {
	try {
		const url = new URL(value);
		if (url.protocol !== 'https:') return null;
		const host = url.hostname.toLowerCase();
		const allowed =
			host === 'login.salesforce.com' ||
			host === 'test.salesforce.com' ||
			host.endsWith('.my.salesforce.com') ||
			/^[a-z0-9-]+\.salesforce\.com$/.test(host);
		if (!allowed || !url.pathname.startsWith('/id/')) return null;
		return url;
	} catch {
		return null;
	}
}

function orgIdFromIdentityPath(pathname: string): string | null {
	const parts = pathname.split('/id/');
	const orgId = parts[1]?.split('/')[0];
	if (orgId && /^00D[a-zA-Z0-9]{12}$|^00D[a-zA-Z0-9]{15}$/.test(orgId)) {
		return orgId;
	}
	return null;
}

export async function resolveSalesforceOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	// 1. Direct external ID or organization_id field in token response
	const directId = toExternalId(
		tokens.organization_id ||
			tokens.tenant_external_id ||
			(tokens.custom_attributes as Record<string, string> | undefined)
				?.organization_id,
	);
	if (directId) {
		return { linkType: 'tenant_external_id', externalId: directId };
	}

	// 2. Extract org ID from Salesforce identity URL (https://login.salesforce.com/id/{orgId}/{userId})
	if (typeof tokens.id === 'string') {
		const identityUrl = salesforceIdentityUrl(tokens.id);
		if (identityUrl) {
			const orgId = orgIdFromIdentityPath(identityUrl.pathname);
			if (orgId) {
				return { linkType: 'tenant_external_id', externalId: orgId };
			}
		}
	}

	// 3. User Identity Endpoint fetch fallback if tokens.id is a URL
	if (typeof tokens.id === 'string' && tokens.access_token) {
		const identityUrl = salesforceIdentityUrl(tokens.id);
		if (!identityUrl) return null;
		try {
			const res = await fetch(identityUrl, {
				headers: { Authorization: `Bearer ${tokens.access_token}` },
				signal: AbortSignal.timeout(IDENTITY_FETCH_TIMEOUT_MS),
			});
			if (res.ok) {
				const payload = (await res.json()) as {
					organization_id?: string;
					org_id?: string;
				};
				const fetchedId = toExternalId(
					payload.organization_id || payload.org_id,
				);
				if (fetchedId) {
					return { linkType: 'tenant_external_id', externalId: fetchedId };
				}
			}
		} catch {
			// ignore network error
		}
	}

	return null;
}
