import { describe, expect, it } from '@jest/globals';

import { matchSpokiTenantWebhook } from './tenant-matcher';

describe('matchSpokiTenantWebhook', () => {
	it('returns null when no tenant header is present', () => {
		expect(
			matchSpokiTenantWebhook({
				headers: {},
				body: {},
			}),
		).toBeNull();
	});

	it('matches the Spoki tenant ID header', () => {
		expect(
			matchSpokiTenantWebhook({
				headers: {
					'x-spoki-tenant-id': 'tenant-123',
				},
				body: {},
			}),
		).toEqual({
			tenantId: 'tenant-123',
			linkType: 'spoki_account',
			externalId: 'tenant-123',
		});
	});

	it('supports X-Spoki-Tenant-Id casing', () => {
		expect(
			matchSpokiTenantWebhook({
				headers: {
					'X-Spoki-Tenant-Id': 'tenant-456',
				},
				body: {},
			}),
		).toEqual({
			tenantId: 'tenant-456',
			linkType: 'spoki_account',
			externalId: 'tenant-456',
		});
	});
});
