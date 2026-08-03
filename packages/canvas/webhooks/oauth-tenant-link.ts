import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

/**
 * Canvas OAuth token responses rarely include account ids. Prefer linking via
 * Live Event `root_account_id` through `matchCanvasTenantWebhook` after the
 * first webhook arrives. If the token payload carries an account id, use it.
 */
export function resolveCanvasOAuthWebhookTenantLink(
	tokens: TokenResponse,
): WebhookTenantMatch | null {
	const externalId = toExternalId(
		tokens.canvas_account_id ?? tokens.account_id,
	);
	if (!externalId) return null;
	return { linkType: 'canvas_account_id', externalId };
}
