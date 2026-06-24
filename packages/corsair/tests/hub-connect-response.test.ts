import { createCorsair } from '../core';
import type { CorsairPlugin } from '../core/plugins';
import {
	isLoopbackDeliveryUrl,
	resolveConnectSourceFromDeliveryUrl,
	validateExplicitConnectSource,
} from '../hub/contracts/delivery-mode';
import {
	parseHubConnectSessionBody,
	respondToHubConnectSessionFromRequest,
} from '../hub/connect-response';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

const githubOAuth = {
	id: 'github',
	options: { authType: 'oauth_2' as const },
	oauthConfig: {
		providerName: 'GitHub',
		authUrl: 'https://github.com/login/oauth/authorize',
		tokenUrl: 'https://github.com/login/oauth/access_token',
		scopes: ['repo'],
	},
} as unknown as CorsairPlugin;

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

	describe('respondToHubConnectSessionFromRequest', () => {
		let env: ReturnType<typeof createTestDatabase>;

		beforeEach(async () => {
			env = createTestDatabase();
			await setupCorsair(
				createCorsair({
					plugins: [githubOAuth],
					database: env.db,
					kek: 'test-kek-for-hub-connect-response-tests',
					hub: {
						projectApiKey: 'project-key',
						signingSecret: 'signing-secret',
						deliveryUrl: 'http://localhost:3001/api/corsair',
					},
				} as any),
				{ tenantId: 'default' },
			);
		});

		afterEach(() => env.cleanup());

		const corsair = () =>
			createCorsair({
				plugins: [githubOAuth],
				database: env.db,
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

			const response = await respondToHubConnectSessionFromRequest(corsair(), request, {
				resolveTenantId: async () => null,
			});

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

				await respondToHubConnectSessionFromRequest(corsair(), request, {
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

		it('ignores body tenantId unless allowClientProvidedTenantId is true', async () => {
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

				await respondToHubConnectSessionFromRequest(corsair(), request);

				expect(global.fetch).toHaveBeenCalledWith(
					expect.any(String),
					expect.objectContaining({
						body: expect.stringContaining('"tenantId":"default"'),
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

			const response = await respondToHubConnectSessionFromRequest(corsair(), request);
			expect(response.status).toBe(405);
		});

		it('returns 400 when explicit server source conflicts with loopback delivery URL', async () => {
			const request = new Request('http://localhost/api/hub/create-link', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					plugin: 'github',
					source: 'server',
					oauthMode: 'managed',
				}),
			});

			const response = await respondToHubConnectSessionFromRequest(corsair(), request);

			expect(response.status).toBe(400);
			await expect(response.json()).resolves.toEqual({
				error: expect.stringContaining('source "server"'),
			});
		});
	});
});
