/**
 * Shared templates for webhook tenant routing conventions:
 * - webhooks/tenant-matcher.ts  → pluginTenantWebhookMatcher
 * - webhooks/oauth-tenant-link.ts → oauthWebhookTenantLinkResolver
 * - authConfig.account fields must use the same linkType as the matcher
 */

export const DEFAULT_TENANT_LINK_TYPE = 'tenant_external_id';

export function buildTenantMatcherTs(
	pascalName: string,
	lowerName: string,
): string {
	return `import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// TODO: Rename linkType '${DEFAULT_TENANT_LINK_TYPE}' to match the provider field
// (e.g. team_id, installation_id, organization_id). Must match authConfig.account
// and oauthWebhookTenantLinkResolver.
// Return null for URL verification / handshake payloads that have no tenant id.
export function match${pascalName}TenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	// TODO: Extract the stable external id from the webhook payload.
	// Example:
	// const externalId = firstString([body.${DEFAULT_TENANT_LINK_TYPE}, asRecord(body.data)?.id]);
	const externalId = firstString([
		body.${DEFAULT_TENANT_LINK_TYPE},
		asRecord(body.data)?.${DEFAULT_TENANT_LINK_TYPE},
	]);

	if (!externalId) return null;

	return { linkType: '${DEFAULT_TENANT_LINK_TYPE}', externalId };
}
`;
}

export function buildOAuthTenantLinkTs(pascalName: string): string {
	return `import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

// TODO: Rename linkType '${DEFAULT_TENANT_LINK_TYPE}' to match pluginTenantWebhookMatcher.
// Called after OAuth to store the routing id on corsair_accounts.config.
export async function resolve${pascalName}OAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	// TODO: Read from token response when the provider includes a stable id.
	// const externalId = toExternalId(asRecord(tokens.team)?.id);
	const externalId = toExternalId(tokens.${DEFAULT_TENANT_LINK_TYPE});
	if (externalId) {
		return { linkType: '${DEFAULT_TENANT_LINK_TYPE}', externalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	// TODO: Fetch from provider API when the token response omits the id.
	// const response = await fetch('https://api.example.com/me', {
	// \theaders: { Authorization: \`Bearer \${accessToken}\` },
	// });
	// if (!response.ok) return null;
	// const payload = (await response.json()) as { id?: string };
	// const fetchedId = toExternalId(payload.id);
	// return fetchedId
	// \t? { linkType: '${DEFAULT_TENANT_LINK_TYPE}', externalId: fetchedId }
	// \t: null;

	return null;
}
`;
}

export function buildAuthConfigTs(
	camelName: string,
	authTypes: readonly string[],
): string {
	const blocks = authTypes.map((authType) => {
		return `\t${authType}: {
\t\taccount: ['${DEFAULT_TENANT_LINK_TYPE}'] as const,
\t},`;
	});

	return `export const ${camelName}AuthConfig = {
${blocks.join('\n')}
} as const satisfies PluginAuthConfig;`;
}

export function formatTenantRoutingPluginFields(pascalName: string): string {
	return `\t\tpluginTenantWebhookMatcher: match${pascalName}TenantWebhook,
\t\toauthWebhookTenantLinkResolver: resolve${pascalName}OAuthWebhookTenantLink,`;
}

export const TENANT_ROUTING_AGENT_CHECKLIST = `
## Webhook tenant routing

Corsair routes multi-tenant webhooks using three linked pieces. **linkType must match across all three:**

| Piece | File | Purpose |
|---|---|---|
| \`pluginTenantWebhookMatcher\` | \`webhooks/tenant-matcher.ts\` | Extract id from incoming webhook |
| \`authConfig.{authType}.account\` | \`index.ts\` | Field name stored on \`corsair_accounts.config\` |
| \`oauthWebhookTenantLinkResolver\` | \`webhooks/oauth-tenant-link.ts\` | Populate field after OAuth (if applicable) |

- [ ] Rename \`${DEFAULT_TENANT_LINK_TYPE}\` to the provider's real field (e.g. \`team_id\`, \`installation_id\`)
- [ ] Update \`match{Plugin}TenantWebhook\` to parse the webhook payload (return \`null\` for handshakes)
- [ ] Update \`{plugin}AuthConfig\` account fields to use the same linkType
- [ ] If OAuth: implement \`resolve{Plugin}OAuthWebhookTenantLink\` (token response and/or post-OAuth API call)
- [ ] Wire \`pluginTenantWebhookMatcher\` and \`oauthWebhookTenantLinkResolver\` on the plugin return object
- [ ] Reference: \`packages/slack/webhooks/tenant-matcher.ts\` and \`packages/slack/webhooks/oauth-tenant-link.ts\`
`;
