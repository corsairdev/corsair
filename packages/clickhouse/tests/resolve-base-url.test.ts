import { AuthMissingError } from 'corsair/core';
import { resolveBaseUrl } from '../client';

describe('resolveBaseUrl', () => {
	it('prefers ctx.options.baseUrl when set', async () => {
		const url = await resolveBaseUrl({
			options: { baseUrl: 'https://ch.example.com:8443' },
			keys: {
				get_tenant_external_id: async () => 'https://tenant.example.com',
			},
		});
		expect(url).toBe('https://ch.example.com:8443');
	});

	it('falls back to tenant_external_id when options.baseUrl is missing', async () => {
		const url = await resolveBaseUrl({
			options: {},
			keys: {
				get_tenant_external_id: async () => 'https://tenant.example.com:8443',
			},
		});
		expect(url).toBe('https://tenant.example.com:8443');
	});

	it('treats an empty tenant_external_id as missing', async () => {
		await expect(
			resolveBaseUrl({
				options: {},
				keys: { get_tenant_external_id: async () => '' },
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when neither source is available', async () => {
		await expect(
			resolveBaseUrl({ options: {}, keys: undefined }),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
