import { hasManualConnectConfig } from '../core/config/manual-connect';

describe('hasManualConnectConfig', () => {
	it('is true when baseUrl and redirectUri are set', () => {
		expect(
			hasManualConnectConfig({
				baseUrl: 'https://app/connect',
				redirectUri: 'https://app/callback',
			}),
		).toBe(true);
	});

	it('is false for permissions-only manual config', () => {
		expect(
			hasManualConnectConfig({
				approvalBaseUrl: 'https://app/approve',
			}),
		).toBe(false);
	});
});
