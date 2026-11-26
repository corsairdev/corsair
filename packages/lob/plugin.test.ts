import { AuthMissingError } from 'corsair/core';
import { lob, lobEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof lob>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.getBalance',
	'addresses.create',
	'addresses.delete',
	'addresses.get',
	'addresses.list',
	'autocomplete.usAutocomplete',
	'bankAccounts.create',
	'bankAccounts.delete',
	'bankAccounts.get',
	'bankAccounts.list',
	'bankAccounts.verify',
	'billingGroups.create',
	'billingGroups.get',
	'billingGroups.list',
	'billingGroups.update',
	'booklets.cancel',
	'booklets.get',
	'booklets.list',
	'booklets.send',
	'buckslips.create',
	'buckslips.createOrder',
	'buckslips.delete',
	'buckslips.get',
	'buckslips.list',
	'buckslips.listOrders',
	'buckslips.update',
	'campaigns.create',
	'campaigns.delete',
	'campaigns.get',
	'campaigns.list',
	'campaigns.send',
	'campaigns.update',
	'cards.create',
	'cards.createOrder',
	'cards.delete',
	'cards.get',
	'cards.list',
	'cards.listOrders',
	'cards.update',
	'checks.cancel',
	'checks.get',
	'checks.list',
	'checks.send',
	'creatives.create',
	'creatives.get',
	'creatives.update',
	'domains.create',
	'domains.delete',
	'domains.get',
	'domains.list',
	'identityValidation.validate',
	'informedDelivery.create',
	'informedDelivery.get',
	'informedDelivery.list',
	'informedDelivery.update',
	'intlVerifications.bulk',
	'intlVerifications.verify',
	'letters.cancel',
	'letters.get',
	'letters.list',
	'letters.send',
	'links.create',
	'links.delete',
	'links.get',
	'links.list',
	'links.update',
	'postcards.cancel',
	'postcards.get',
	'postcards.list',
	'postcards.send',
	'qrCodes.list',
	'resourceProofs.create',
	'resourceProofs.get',
	'resourceProofs.update',
	'reverseGeocode.lookup',
	'selfMailers.cancel',
	'selfMailers.get',
	'selfMailers.list',
	'selfMailers.send',
	'snapPacks.cancel',
	'snapPacks.get',
	'snapPacks.list',
	'snapPacks.send',
	'templateVersions.create',
	'templateVersions.delete',
	'templateVersions.get',
	'templateVersions.list',
	'templateVersions.update',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.list',
	'templates.update',
	'uploads.create',
	'uploads.createExport',
	'uploads.delete',
	'uploads.get',
	'uploads.getExport',
	'uploads.getReport',
	'uploads.list',
	'uploads.update',
	'uploads.uploadFile',
	'usVerifications.bulk',
	'usVerifications.verify',
	'zip.usZipLookup',
];

describe('lob plugin definition', () => {
	const plugin = lob();

	it('registers as lob with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('lob');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it("exposes every operation in Lob's API reference (105)", () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(nested).toHaveLength(105);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'usVerifications.verify': 'read',
			'usVerifications.bulk': 'read',
			'intlVerifications.verify': 'read',
			'intlVerifications.bulk': 'read',
			'autocomplete.usAutocomplete': 'read',
			'zip.usZipLookup': 'read',
			'reverseGeocode.lookup': 'read',
			'identityValidation.validate': 'read',
			'addresses.create': 'write',
			'addresses.get': 'read',
			'addresses.list': 'read',
			'addresses.delete': 'destructive',
			'postcards.send': 'destructive',
			'postcards.get': 'read',
			'postcards.list': 'read',
			'postcards.cancel': 'destructive',
			'letters.send': 'destructive',
			'letters.get': 'read',
			'letters.list': 'read',
			'letters.cancel': 'destructive',
			'checks.send': 'destructive',
			'checks.get': 'read',
			'checks.list': 'read',
			'checks.cancel': 'destructive',
			'selfMailers.send': 'destructive',
			'selfMailers.get': 'read',
			'selfMailers.list': 'read',
			'selfMailers.cancel': 'destructive',
			'snapPacks.send': 'destructive',
			'snapPacks.get': 'read',
			'snapPacks.list': 'read',
			'snapPacks.cancel': 'destructive',
			'booklets.send': 'destructive',
			'booklets.get': 'read',
			'booklets.list': 'read',
			'booklets.cancel': 'destructive',
			'bankAccounts.create': 'write',
			'bankAccounts.get': 'read',
			'bankAccounts.list': 'read',
			'bankAccounts.delete': 'destructive',
			'bankAccounts.verify': 'write',
			'billingGroups.create': 'write',
			'billingGroups.get': 'read',
			'billingGroups.list': 'read',
			'billingGroups.update': 'write',
			'buckslips.create': 'write',
			'buckslips.get': 'read',
			'buckslips.list': 'read',
			'buckslips.update': 'destructive',
			'buckslips.delete': 'destructive',
			'buckslips.listOrders': 'read',
			'buckslips.createOrder': 'destructive',
			'cards.create': 'write',
			'cards.get': 'read',
			'cards.list': 'read',
			'cards.update': 'destructive',
			'cards.delete': 'destructive',
			'cards.listOrders': 'read',
			'cards.createOrder': 'destructive',
			'campaigns.create': 'write',
			'campaigns.get': 'read',
			'campaigns.list': 'read',
			'campaigns.update': 'write',
			'campaigns.delete': 'destructive',
			'campaigns.send': 'destructive',
			'creatives.create': 'write',
			'creatives.get': 'read',
			'creatives.update': 'write',
			'uploads.create': 'write',
			'uploads.get': 'read',
			'uploads.list': 'read',
			'uploads.update': 'write',
			'uploads.delete': 'destructive',
			'uploads.uploadFile': 'write',
			'uploads.createExport': 'write',
			'uploads.getExport': 'read',
			'uploads.getReport': 'read',
			'informedDelivery.list': 'read',
			'informedDelivery.create': 'write',
			'informedDelivery.get': 'read',
			'informedDelivery.update': 'write',
			'resourceProofs.create': 'write',
			'resourceProofs.get': 'read',
			'resourceProofs.update': 'write',
			'templates.create': 'write',
			'templates.get': 'read',
			'templates.list': 'read',
			'templates.update': 'write',
			'templates.delete': 'destructive',
			'templateVersions.create': 'write',
			'templateVersions.get': 'read',
			'templateVersions.list': 'read',
			'templateVersions.update': 'write',
			'templateVersions.delete': 'destructive',
			'domains.create': 'write',
			'domains.get': 'read',
			'domains.list': 'read',
			'domains.delete': 'destructive',
			'links.create': 'write',
			'links.get': 'read',
			'links.list': 'read',
			'links.update': 'write',
			'links.delete': 'destructive',
			'qrCodes.list': 'read',
			'account.getBalance': 'read',
		});
	});

	it('marks every send, cancel, delete and print order irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = Object.entries(meta)
			.filter(([name]) => /\.(send|cancel|delete|createOrder)$/.test(name))
			.map(([name]) => name);
		expect(irreversible).toHaveLength(25);
		for (const name of irreversible) {
			expect(meta[name as keyof typeof meta]).toMatchObject({
				irreversible: true,
			});
		}
		for (const [name, entry] of Object.entries(meta)) {
			if (entry.riskLevel !== 'destructive') {
				expect(entry.irreversible).toBeUndefined();
			}
			expect(name).toBeTruthy();
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(lobEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(lobEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = lob({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('lob key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(lob({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(lob(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(lob(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys, because Lob webhooks are not handled here', async () => {
		await expect(
			lob().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
