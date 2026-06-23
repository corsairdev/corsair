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
	const accountId = firstString([
		Array.isArray(listFolder?.accounts) ? listFolder.accounts[0] : undefined,
	]);
	if (accountId) {
		return { linkType: 'account_id', externalId: accountId };
	}

	const delta = asRecord(body.delta);
	const userId = firstString([
		Array.isArray(delta?.users) ? delta.users[0] : undefined,
	]);
	if (!userId) return null;

	return { linkType: 'user_id', externalId: userId };
}
