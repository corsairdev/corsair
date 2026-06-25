import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Grafana alerting webhook notifier includes orgId on the default payload envelope.
// See https://grafana.com/docs/grafana/latest/alerting/configure-notifications/manage-contact-points/integrations/webhook-notifier/
export function matchGrafanaTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const alerts = Array.isArray(body.alerts) ? body.alerts : [];
	const firstAlert = asRecord(alerts[0]);

	const orgId = firstString([body.orgId, firstAlert?.orgId]);
	if (!orgId) return null;

	return { linkType: 'org_id', externalId: orgId };
}
