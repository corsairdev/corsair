import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

export async function resolveGithubOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const fromToken = toExternalId(
		asRecord(tokens.installation)?.id ?? tokens.installation_id,
	);
	const installationId =
		fromToken ?? (await fetchInstallationId(tokens.access_token));
	return installationId
		? { linkType: 'installation_id', externalId: installationId }
		: null;
}

async function fetchInstallationId(
	accessToken: string | undefined,
): Promise<string | null> {
	if (!accessToken) return null;
	try {
		const res = await fetch('https://api.github.com/user/installations', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28',
			},
		});
		if (!res.ok) return null;
		const body = (await res.json()) as {
			installations?: Array<{ id?: unknown }>;
		};
		const installations = body.installations ?? [];
		// Only safe to infer when the token sees exactly one installation. With
		// several, we can't tell which belongs to this connection without a
		// forwarded installation_id, and linking installations[0] would route
		// that installation's webhooks to the wrong tenant — so fail closed.
		if (installations.length !== 1) return null;
		return toExternalId(installations[0]?.id) ?? null;
	} catch {
		return null;
	}
}
