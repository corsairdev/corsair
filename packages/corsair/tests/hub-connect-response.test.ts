import { createCorsair } from '../core';
import {
	isLoopbackDeliveryUrl,
	parseHubConnectSessionBody,
	respondToHubConnectSessionFromRequest,
	validateManagedOAuthLoopback,
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
					source: 'server',
				}),
			).toEqual({
				plugin: 'github',
				tenantId: 'default',
				source: 'server',
				oauthMode: undefined,
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

	describe('validateManagedOAuthLoopback', () => {
		it('blocks managed server delivery on loopback', () => {
			expect(
				validateManagedOAuthLoopback(
					{
						plugin: 'github',
						tenantId: 'default',
						source: 'server',
						oauthMode: 'managed',
					},
					'http://localhost:3001/api/corsair',
				),
			).toEqual({
				error:
					'managed OAuth with a loopback delivery URL requires source: "client"',
				status: 400,
			});
		});

		it('allows managed client delivery on loopback', () => {
			expect(
				validateManagedOAuthLoopback(
					{
						plugin: 'github',
						tenantId: 'default',
						source: 'client',
						oauthMode: 'managed',
					},
					'http://localhost:3001/api/corsair',
				),
			).toBeNull();
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
