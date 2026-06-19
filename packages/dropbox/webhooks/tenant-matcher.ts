import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Dropbox change notifications identify accounts in list_folder.accounts
// (preferred) or delta.users for legacy payloads.
// See https://www.dropbox.com/developers/reference/webhooks
export function matchDropboxTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const listFolder = asRecord(body.list_folder);
	const accountId = firstString([listFolder?.accounts?.[0]]);
	if (accountId) {
		return { linkType: 'account_id', externalId: accountId };
	}

	const delta = asRecord(body.delta);
	const userId = firstString([delta?.users?.[0]]);
	if (!userId) return null;

	return { linkType: 'user_id', externalId: userId };
}
