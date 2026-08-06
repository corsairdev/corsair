import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Google Sheets webhooks are Apps Script payloads keyed by spreadsheetId.
export function matchGoogleSheetsTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const spreadsheetId = firstString([body.spreadsheetId]);
	if (!spreadsheetId) return null;

	return { linkType: 'spreadsheet_id', externalId: spreadsheetId };
}
