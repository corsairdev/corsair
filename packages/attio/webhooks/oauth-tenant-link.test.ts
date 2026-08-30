import { resolveAttioOAuthWebhookTenantLink } from './oauth-tenant-link';

describe('resolveAttioOAuthWebhookTenantLink', () => {
	const fetchSpy = jest.spyOn(globalThis, 'fetch');

	afterEach(() => {
		fetchSpy.mockReset();
	});

	afterAll(() => {
		fetchSpy.mockRestore();
	});

	it('uses workspace_id from the token response', async () => {
		await expect(
			resolveAttioOAuthWebhookTenantLink({
				access_token: 'tok',
				workspace_id: 'ws-from-token',
			}),
		).resolves.toEqual({
			linkType: 'tenant_external_id',
			externalId: 'ws-from-token',
		});
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('reads workspace_id from GET /v2/self', async () => {
		fetchSpy.mockResolvedValue(
			new Response(
				JSON.stringify({
					active: true,
					workspace_id: 'ws-from-self',
					workspace_name: 'Acme',
				}),
				{ status: 200 },
			),
		);

		await expect(
			resolveAttioOAuthWebhookTenantLink({ access_token: 'tok' }),
		).resolves.toEqual({
			linkType: 'tenant_external_id',
			externalId: 'ws-from-self',
		});
		expect(fetchSpy).toHaveBeenCalledWith(
			'https://api.attio.com/v2/self',
			expect.objectContaining({
				headers: { Authorization: 'Bearer tok' },
				signal: expect.any(AbortSignal),
			}),
		);
	});

	it('returns null when /v2/self has no workspace_id', async () => {
		fetchSpy.mockResolvedValue(
			new Response(JSON.stringify({ active: false }), { status: 200 }),
		);

		await expect(
			resolveAttioOAuthWebhookTenantLink({ access_token: 'tok' }),
		).resolves.toBeNull();
	});
});
