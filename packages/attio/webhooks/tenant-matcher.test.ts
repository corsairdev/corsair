import { matchAttioTenantWebhook } from './tenant-matcher';

describe('matchAttioTenantWebhook', () => {
	it('reads workspace_id from event id', () => {
		expect(
			matchAttioTenantWebhook({
				headers: {},
				body: {
					event_type: 'record.created',
					id: {
						workspace_id: 'ws-1',
						object_id: 'obj-1',
						record_id: 'rec-1',
					},
				},
			}),
		).toEqual({ linkType: 'tenant_external_id', externalId: 'ws-1' });
	});

	it('reads workspace_id from events[].id', () => {
		expect(
			matchAttioTenantWebhook({
				headers: {},
				body: {
					webhook_id: 'wh-1',
					events: [
						{
							event_type: 'record.created',
							id: { workspace_id: 'ws-2', record_id: 'rec-2' },
						},
					],
				},
			}),
		).toEqual({ linkType: 'tenant_external_id', externalId: 'ws-2' });
	});

	it('returns null when no workspace id is present', () => {
		expect(
			matchAttioTenantWebhook({
				headers: {},
				body: { event_type: 'record.created' },
			}),
		).toBeNull();
	});
});
