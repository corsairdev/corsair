import { createCorsair } from '../core';
import {
	isLoopbackDeliveryUrl,
	parseHubConnectSessionBody,
	resolveConnectSourceFromDeliveryUrl,
	respondToHubConnectSessionFromRequest,
} from '../hub/connect-response';

describe('hub connect-response', () => {
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

	describe('parseHubConnectSessionBody', () => {
		it('parses valid input', () => {
			expect(
				parseHubConnectSessionBody({
					plugin: 'github',
					tenantId: 'tenant-1',
					source: 'client',
					oauthMode: 'managed',
				}),
			).toEqual({
				plugin: 'github',
				tenantId: 'tenant-1',
				source: 'client',
				oauthMode: 'managed',
			});
		});

		it('defaults tenantId to default', () => {
			expect(
				parseHubConnectSessionBody({
					plugin: 'github',
				}),
			).toEqual({
				plugin: 'github',
				tenantId: 'default',
				oauthMode: undefined,
			});
		});

		it('rejects invalid source', () => {
			expect(
				parseHubConnectSessionBody({
					plugin: 'github',
					source: 'invalid',
				}),
			).toEqual({
				error: 'source must be "client" or "server"',
				status: 400,
			});
		});

		it('rejects invalid oauthMode', () => {
			const result = parseHubConnectSessionBody({
				plugin: 'github',
				source: 'client',
				oauthMode: 'invalid',
			});
			expect(result).toEqual({
				error: 'oauthMode must be "byo" or "managed"',
				status: 400,
			});
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
				resolveConnectSourceFromDeliveryUrl('http://127.0.0.1:3001/api/corsair'),
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

	describe('respondToHubConnectSessionFromRequest', () => {
		const corsair = createCorsair({
			plugins: [],
			kek: 'test-kek-for-hub-connect-response-tests',
			hub: {
				projectApiKey: 'project-key',
				signingSecret: 'signing-secret',
				deliveryUrl: 'http://localhost:3001/api/corsair',
			},
		} as any);

		it('returns 401 when resolveTenantId returns null', async () => {
			const request = new Request('http://localhost/api/hub/create-link', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					plugin: 'github',
					tenantId: 'ignored',
					source: 'client',
				}),
			});

			const response = await respondToHubConnectSessionFromRequest(
				corsair,
				request,
				{
					resolveTenantId: async () => null,
				},
			);

			expect(response.status).toBe(401);
			await expect(response.json()).resolves.toEqual({
				error: 'Unauthorized',
			});
		});

		it('uses resolveTenantId instead of body tenantId', async () => {
			const originalFetch = global.fetch;
			global.fetch = jest.fn().mockResolvedValue({
				ok: false,
				status: 502,
				headers: new Headers({ 'content-type': 'application/json' }),
				text: async () => JSON.stringify({ error: 'upstream failed' }),
			}) as typeof fetch;

			try {
				const request = new Request('http://localhost/api/hub/create-link', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						plugin: 'github',
						tenantId: 'from-body',
						source: 'client',
						oauthMode: 'managed',
					}),
				});

				await respondToHubConnectSessionFromRequest(corsair, request, {
					resolveTenantId: async () => 'from-session',
				});

				expect(global.fetch).toHaveBeenCalledWith(
					expect.stringContaining('/connect/sessions'),
					expect.objectContaining({
						body: expect.stringContaining('"tenantId":"from-session"'),
					}),
				);
				expect(global.fetch).toHaveBeenCalledWith(
					expect.any(String),
					expect.objectContaining({
						body: expect.not.stringContaining('"tenantId":"from-body"'),
					}),
				);
			} finally {
				global.fetch = originalFetch;
			}
		});

		it('returns 405 for unsupported methods', async () => {
			const request = new Request('http://localhost/api/hub/create-link', {
				method: 'PUT',
			});

			const response = await respondToHubConnectSessionFromRequest(
				corsair,
				request,
			);
			expect(response.status).toBe(405);
		});
	});
});
