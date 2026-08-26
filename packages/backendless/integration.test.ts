import { BackendlessClient, redactSecrets } from './client';
import { backendlessEndpointMeta, backendlessEndpoints } from './index';

jest.mock('corsair/http', () => ({
	request: jest.fn(async () => ({ ok: true })),
	ApiError: class ApiError extends Error {},
}));

describe('Backendless provider', () => {
	it('encodes path segments and uses the shared request helper', async () => {
		const { request } = await import('corsair/http');
		const client = new BackendlessClient({
			baseUrl: 'https://demo.backendless.app',
			applicationId: 'application-id',
			restApiKey: 'rest-api-key',
			userToken: 'user-token',
		});
		await client.call('GET', `data/${client.segment('Users & Roles')}`, {
			userScoped: true,
		});
		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://demo.backendless.app' }),
			expect.objectContaining({
				method: 'GET',
				url: '/api/data/Users%20%26%20Roles',
				headers: { 'user-token': 'user-token' },
			}),
		);
		await client.call('GET', 'files/public');
		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({ headers: undefined }),
		);
	});

	it('redacts password, token, and key fields recursively', () => {
		const redacted = redactSecrets({
			password: 'secret',
			nested: { userToken: 'token' },
			restApiKey: 'key',
		}) as Record<string, unknown>;
		expect(redacted.password).toBe('[REDACTED]');
		expect(redacted.restApiKey).toBe('[REDACTED]');
		expect((redacted.nested as Record<string, unknown>).userToken).toBe(
			'[REDACTED]',
		);
	});

	it('marks destructive and security-sensitive operations as destructive', () => {
		expect(backendlessEndpointMeta['files.delete'].riskLevel).toBe(
			'destructive',
		);
		expect(backendlessEndpointMeta['users.delete'].irreversible).toBe(true);
		expect(backendlessEndpointMeta['permissions.grant'].riskLevel).toBe(
			'destructive',
		);
		expect(Object.keys(backendlessEndpoints)).toEqual(
			expect.arrayContaining(['files', 'users', 'permissions', 'messaging']),
		);
	});
});
