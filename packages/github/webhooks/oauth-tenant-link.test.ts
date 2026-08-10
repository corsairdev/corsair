import type { TokenResponse } from 'corsair/core';
import { resolveGithubOAuthWebhookTenantLink } from './oauth-tenant-link';

jest.mock('corsair/core', () => ({
	asRecord: (v: unknown) =>
		v && typeof v === 'object' && !Array.isArray(v) ? v : null,
	toExternalId: (v: unknown) =>
		v === null || v === undefined ? undefined : String(v).trim() || undefined,
}));

describe('resolveGithubOAuthWebhookTenantLink', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('uses installation_id from the token without calling the API', async () => {
		const fetchSpy = jest.fn();
		global.fetch = fetchSpy as unknown as typeof fetch;

		const link = await resolveGithubOAuthWebhookTenantLink({
			access_token: 'tok',
			installation_id: '123',
		} as unknown as TokenResponse);

		expect(link).toEqual({ linkType: 'installation_id', externalId: '123' });
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('falls back to GET /user/installations when the token lacks installation_id', async () => {
		const fetchSpy = jest.fn(async () => ({
			ok: true,
			json: async () => ({ installations: [{ id: 456 }] }),
		}));
		global.fetch = fetchSpy as unknown as typeof fetch;

		const link = await resolveGithubOAuthWebhookTenantLink({
			access_token: 'tok',
		} as unknown as TokenResponse);

		expect(link).toEqual({ linkType: 'installation_id', externalId: '456' });
		expect(fetchSpy).toHaveBeenCalledWith(
			'https://api.github.com/user/installations',
			expect.objectContaining({
				headers: expect.objectContaining({ Authorization: 'Bearer tok' }),
			}),
		);
	});

	it('returns null when the API reports no installations', async () => {
		global.fetch = (async () => ({
			ok: true,
			json: async () => ({ installations: [] }),
		})) as unknown as typeof fetch;

		const link = await resolveGithubOAuthWebhookTenantLink({
			access_token: 'tok',
		} as unknown as TokenResponse);

		expect(link).toBeNull();
	});

	it('returns null when the token can see multiple installations (ambiguous)', async () => {
		global.fetch = (async () => ({
			ok: true,
			json: async () => ({ installations: [{ id: 456 }, { id: 789 }] }),
		})) as unknown as typeof fetch;

		const link = await resolveGithubOAuthWebhookTenantLink({
			access_token: 'tok',
		} as unknown as TokenResponse);

		// Can't tell which installation belongs to this connection without a
		// forwarded installation_id — linking installations[0] would route
		// webhooks to the wrong tenant, so fail closed.
		expect(link).toBeNull();
	});

	it('returns null with no access token and never calls the API', async () => {
		const fetchSpy = jest.fn();
		global.fetch = fetchSpy as unknown as typeof fetch;

		const link = await resolveGithubOAuthWebhookTenantLink(
			{} as unknown as TokenResponse,
		);

		expect(link).toBeNull();
		expect(fetchSpy).not.toHaveBeenCalled();
	});
});
