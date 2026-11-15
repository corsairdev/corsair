import { AuthMissingError } from 'corsair/core';
import { normalizeErpnextBaseUrl } from './client';
import { endpoints as documentsEndpoints } from './endpoints/documents';
import { erpnext } from './index';

type KeyBuilder = NonNullable<ReturnType<typeof erpnext>['keyBuilder']>;
type KeyBuilderCtx = Parameters<KeyBuilder>[0];

function tenantCtx(fields: {
	apiKey?: string | null;
	apiSecret?: string | null;
	baseUrl?: string | null;
}): KeyBuilderCtx {
	// Safe: the key builder reads only options, authType and these three
	// account getters from the core context.
	return {
		options: { authType: 'api_key' },
		authType: 'api_key',
		keys: {
			get_api_key: async () => fields.apiKey ?? null,
			get_api_secret: async () => fields.apiSecret ?? null,
			get_base_url: async () => fields.baseUrl ?? null,
		},
	} as unknown as KeyBuilderCtx;
}

describe('ERPNext site URL', () => {
	it('accepts an https origin and trims trailing slashes', () => {
		expect(normalizeErpnextBaseUrl(' https://acme.frappe.cloud// ')).toBe(
			'https://acme.frappe.cloud',
		);
		expect(normalizeErpnextBaseUrl('https://erp.example.com/site/')).toBe(
			'https://erp.example.com/site',
		);
	});

	it.each([
		'http://acme.frappe.cloud',
		'acme.frappe.cloud',
		'https://user:pass@acme.frappe.cloud',
		'https://acme.frappe.cloud/?next=1',
		'https://acme.frappe.cloud/#x',
		'ftp://acme.frappe.cloud',
	])('rejects %s', (url) => {
		expect(() => normalizeErpnextBaseUrl(url)).toThrow(/\[erpnext\] base URL/);
	});

	it('never sends the token to a plain-http stored site', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch');
		try {
			await expect(
				documentsEndpoints.get(
					{
						key: 'stored-key:stored-secret',
						options: {},
						keys: { get_base_url: async () => 'http://tenant.example.com' },
					},
					{ doctype: 'Customer', name: 'CUST-001' },
				),
			).rejects.toThrow('[erpnext] base URL must use https');
			expect(fetchSpy).not.toHaveBeenCalled();
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('throws AuthMissingError when a tenant has no stored base_url', async () => {
		await expect(
			documentsEndpoints.get(
				{
					key: 'stored-key:stored-secret',
					options: {},
					keys: { get_base_url: async () => null },
				},
				{ doctype: 'Customer', name: 'CUST-001' },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('ERPNext key builder', () => {
	const plugin = erpnext();
	const keyBuilder = plugin.keyBuilder as KeyBuilder;

	it('returns the stored key pair when the tenant has its site URL', async () => {
		await expect(
			keyBuilder(
				tenantCtx({
					apiKey: 'k',
					apiSecret: 's',
					baseUrl: 'https://acme.frappe.cloud',
				}),
				'endpoint',
			),
		).resolves.toBe('k:s');
	});

	it('throws AuthMissingError for a stored key pair without base_url', async () => {
		await expect(
			keyBuilder(tenantCtx({ apiKey: 'k', apiSecret: 's' }), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('rejects a stored non-https base_url before any request', async () => {
		await expect(
			keyBuilder(
				tenantCtx({
					apiKey: 'k',
					apiSecret: 's',
					baseUrl: 'http://acme.frappe.cloud',
				}),
				'endpoint',
			),
		).rejects.toThrow('[erpnext] base URL must use https');
	});

	it('throws AuthMissingError for explicit credentials without baseUrl', async () => {
		const explicit = erpnext({ apiKey: 'k', apiSecret: 's' });
		const ctx = {
			options: explicit.options,
			authType: 'api_key',
		} as unknown as KeyBuilderCtx;
		await expect(
			(explicit.keyBuilder as KeyBuilder)(ctx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
