import {
	isLoopbackDeliveryUrl,
	resolveConnectSourceFromDeliveryUrl,
	validateExplicitConnectSource,
} from '../hub/contracts/delivery-mode';

describe('hub delivery-mode', () => {
	describe('isLoopbackDeliveryUrl', () => {
		it('detects localhost delivery URLs', () => {
			expect(isLoopbackDeliveryUrl('http://localhost:3001/api/corsair')).toBe(
				true,
			);
			expect(isLoopbackDeliveryUrl('http://127.0.0.1:3001/api/corsair')).toBe(
				true,
			);
			expect(isLoopbackDeliveryUrl('https://app.example.com/api/corsair')).toBe(
				false,
			);
		});
	});

	describe('resolveConnectSourceFromDeliveryUrl', () => {
		it('uses client delivery for loopback URLs', () => {
			expect(
				resolveConnectSourceFromDeliveryUrl(
					'http://localhost:3001/api/corsair',
				),
			).toBe('client');
			expect(
				resolveConnectSourceFromDeliveryUrl(
					'http://127.0.0.1:3001/api/corsair',
				),
			).toBe('client');
		});

		it('uses server delivery for public URLs', () => {
			expect(
				resolveConnectSourceFromDeliveryUrl(
					'https://app.example.com/api/corsair',
				),
			).toBe('server');
		});
	});

	describe('validateExplicitConnectSource', () => {
		const loopbackUrl = 'http://localhost:3001/api/corsair';
		const publicUrl = 'https://app.example.com/api/corsair';

		it('allows omitted source', () => {
			expect(
				validateExplicitConnectSource({
					deliveryUrl: loopbackUrl,
					oauthMode: 'managed',
				}),
			).toBeNull();
		});

		it('blocks explicit server source on loopback delivery URLs', () => {
			expect(
				validateExplicitConnectSource({
					source: 'server',
					deliveryUrl: loopbackUrl,
					oauthMode: 'managed',
				}),
			).toEqual({
				error: expect.stringContaining('source "server"'),
				status: 400,
			});
		});

		it('blocks explicit server source on loopback for BYO OAuth', () => {
			expect(
				validateExplicitConnectSource({
					source: 'server',
					deliveryUrl: loopbackUrl,
					oauthMode: 'byo',
				}),
			).toEqual({
				error: expect.stringContaining('source "server"'),
				status: 400,
			});
		});

		it('blocks managed client source on public delivery URLs', () => {
			expect(
				validateExplicitConnectSource({
					source: 'client',
					deliveryUrl: publicUrl,
					oauthMode: 'managed',
				}),
			).toEqual({
				error: expect.stringContaining('managed OAuth'),
				status: 400,
			});
		});

		it('allows explicit client source on loopback managed OAuth', () => {
			expect(
				validateExplicitConnectSource({
					source: 'client',
					deliveryUrl: loopbackUrl,
					oauthMode: 'managed',
				}),
			).toBeNull();
		});
	});
});
