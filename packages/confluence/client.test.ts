import { request } from 'corsair/http';
import * as client from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);

type ValidTokenResult = {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
	refreshed: boolean;
};

type AccessibleResource = {
	id: string;
	url: string;
	name: string;
	scopes: string[];
};

const clientUnderTest = client as typeof client & {
	getValidConfluenceAccessToken: (input: {
		accessToken?: string | null;
		expiresAt?: string | null;
		refreshToken: string;
		clientId: string;
		clientSecret: string;
		forceRefresh?: boolean;
	}) => Promise<ValidTokenResult>;
	resolveConfluenceCloudResource: (
		accessToken: string,
		cloudUrl?: string | null,
	) => Promise<AccessibleResource>;
	normalizeConfluenceCloudUrl: (cloudUrl: string) => string;
};

describe('Confluence API client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('normalizes arbitrarily many trailing slashes in linear time', () => {
		const cloudUrl = `https://example.atlassian.net${'/'.repeat(10_000)}`;

		expect(clientUnderTest.normalizeConfluenceCloudUrl(cloudUrl)).toBe(
			'https://example.atlassian.net',
		);
	});

	it('routes OAuth requests through the Atlassian cloud ID gateway', async () => {
		await client.makeConfluenceRequest(
			'pages',
			'access-token',
			'https://example.atlassian.net',
			{
				authType: 'oauth_2',
				base: '/wiki/api/v2',
				cloudId: 'cloud-123',
			} as never,
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.atlassian.com/ex/confluence/cloud-123/wiki/api/v2',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer access-token',
				}),
			}),
			expect.any(Object),
			expect.any(Object),
		);
	});

	it('rejects OAuth requests without a resolved cloud ID', async () => {
		await expect(
			client.makeConfluenceRequest(
				'pages',
				'access-token',
				'https://example.atlassian.net',
				{ authType: 'oauth_2' },
			),
		).rejects.toThrow('cloud ID');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refreshes expired Atlassian tokens and returns the rotated refresh token', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					access_token: 'new-access-token',
					refresh_token: 'new-refresh-token',
					expires_in: 3600,
				}),
				{ status: 200 },
			),
		);

		const result = await Promise.resolve().then(() =>
			clientUnderTest.getValidConfluenceAccessToken({
				accessToken: 'expired-token',
				expiresAt: '1',
				refreshToken: 'old-refresh-token',
				clientId: 'client-id',
				clientSecret: 'client-secret',
			}),
		);

		expect(result).toMatchObject({
			accessToken: 'new-access-token',
			refreshToken: 'new-refresh-token',
			refreshed: true,
		});
		expect(fetchMock).toHaveBeenCalledWith(
			'https://auth.atlassian.com/oauth/token',
			expect.objectContaining({
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			}),
		);
	});

	it('selects the configured Confluence site from multiple resources', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify([
					{
						id: 'site-a',
						url: 'https://a.atlassian.net',
						name: 'Site A',
						scopes: ['read:confluence-content.summary'],
					},
					{
						id: 'site-b',
						url: 'https://b.atlassian.net',
						name: 'Site B',
						scopes: ['read:confluence-content.summary'],
					},
				]),
				{ status: 200 },
			),
		);

		const resource = await Promise.resolve().then(() =>
			clientUnderTest.resolveConfluenceCloudResource(
				'access-token',
				'https://b.atlassian.net/',
			),
		);

		expect(resource).toMatchObject({
			id: 'site-b',
			url: 'https://b.atlassian.net',
		});
	});

	it('requires an explicit site when OAuth grants access to multiple sites', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify([
					{
						id: 'site-a',
						url: 'https://a.atlassian.net',
						name: 'Site A',
						scopes: ['read:confluence-content.summary'],
					},
					{
						id: 'site-b',
						url: 'https://b.atlassian.net',
						name: 'Site B',
						scopes: ['read:confluence-content.summary'],
					},
				]),
				{ status: 200 },
			),
		);

		await expect(
			Promise.resolve().then(() =>
				clientUnderTest.resolveConfluenceCloudResource('access-token'),
			),
		).rejects.toThrow('cloudUrl');
	});
});
