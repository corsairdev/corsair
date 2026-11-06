import { AuthMissingError } from 'corsair/core';
import { gumroad, gumroadEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(fields: { authType: 'api_key'; apiKey?: string | null }) {
	return {
		authType: fields.authType,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(fields.apiKey ?? null) },
	};
}

function buildKey(
	plugin: ReturnType<typeof gumroad>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'products.list',
	'products.get',
	'products.create',
	'products.update',
	'products.delete',
	'products.enable',
	'products.disable',
	'products.reviewsList',
	'products.categoriesList',
	'products.coversAdd',
	'products.coversDelete',
	'products.thumbnailSet',
	'products.thumbnailDelete',
	'offerCodes.list',
	'offerCodes.get',
	'offerCodes.update',
	'offerCodes.listForProduct',
	'offerCodes.getForProduct',
	'offerCodes.createForProduct',
	'offerCodes.updateForProduct',
	'offerCodes.deleteForProduct',
	'variantCategories.list',
	'variantCategories.create',
	'variantCategories.get',
	'variantCategories.update',
	'variantCategories.delete',
	'variantCategories.variantsList',
	'variantCategories.variantsCreate',
	'variantCategories.variantsGet',
	'variantCategories.variantsUpdate',
	'variantCategories.variantsDelete',
	'customFields.list',
	'customFields.create',
	'customFields.update',
	'customFields.delete',
	'user.get',
	'user.customHtmlGet',
	'user.customHtmlUpdate',
	'user.customHtmlPreview',
	'user.refundPolicyGet',
	'user.refundPolicyUpdate',
	'public.product',
	'public.profile',
	'media.list',
	'media.create',
	'media.delete',
	'files.presign',
	'files.complete',
	'files.abort',
	'emails.list',
	'emails.get',
	'emails.create',
	'emails.preview',
	'emails.send',
	'emails.schedule',
	'emails.unschedule',
	'emails.delete',
	'workflows.list',
	'workflows.get',
	'workflows.emailsAdd',
	'workflows.emailsUpdate',
	'resourceSubscriptions.subscribe',
	'resourceSubscriptions.list',
	'resourceSubscriptions.testEvent',
	'resourceSubscriptions.unsubscribe',
	'sales.list',
	'sales.get',
	'sales.markAsShipped',
	'sales.refund',
	'sales.revokeAccess',
	'sales.undoRevokeAccess',
	'sales.resendReceipt',
	'subscribers.list',
	'subscribers.get',
	'licenses.verify',
	'licenses.enable',
	'licenses.disable',
	'licenses.decrementUsesCount',
	'licenses.rotate',
	'payouts.list',
	'payouts.get',
	'payouts.upcoming',
	'taxForms.list',
	'taxForms.download',
	'earnings.get',
] as const;

// Every write or destructive operation; everything else must be read.
const writeOperations = new Set([
	'products.create',
	'products.update',
	'products.enable',
	'products.disable',
	'products.coversAdd',
	'products.thumbnailSet',
	'offerCodes.update',
	'offerCodes.createForProduct',
	'offerCodes.updateForProduct',
	'variantCategories.create',
	'variantCategories.update',
	'variantCategories.variantsCreate',
	'variantCategories.variantsUpdate',
	'customFields.create',
	'customFields.update',
	'user.customHtmlUpdate',
	'user.customHtmlPreview',
	'user.refundPolicyUpdate',
	'media.create',
	'files.presign',
	'files.complete',
	'files.abort',
	'emails.create',
	'emails.preview',
	'emails.send',
	'emails.schedule',
	'emails.unschedule',
	'workflows.emailsAdd',
	'workflows.emailsUpdate',
	'resourceSubscriptions.subscribe',
	'resourceSubscriptions.testEvent',
	'sales.markAsShipped',
	'sales.refund',
	'sales.revokeAccess',
	'sales.undoRevokeAccess',
	'sales.resendReceipt',
	'licenses.verify',
	'licenses.enable',
	'licenses.disable',
	'licenses.decrementUsesCount',
	'licenses.rotate',
]);

const destructiveOperations = new Set([
	'products.delete',
	'products.coversDelete',
	'products.thumbnailDelete',
	'offerCodes.deleteForProduct',
	'variantCategories.delete',
	'variantCategories.variantsDelete',
	'customFields.delete',
	'media.delete',
	'emails.delete',
	'resourceSubscriptions.unsubscribe',
	'products.disable',
	'sales.refund',
	'sales.revokeAccess',
	'licenses.disable',
	'emails.send',
	'emails.create',
]);

describe('gumroad plugin definition', () => {
	const plugin = gumroad();

	it('registers as gumroad with api_key auth by default and no webhooks', () => {
		expect(plugin.id).toBe('gumroad');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes the full nested endpoint tree', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([...operations].sort());
	});

	it('marks every read, write and destructive operation correctly, all described', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...operations].sort());
		expect(operations).toHaveLength(85);
		for (const operation of operations) {
			// expect(entry).toBeDefined() does not narrow for the template
			// below, so the risk level is read through optional chaining and
			// the description length assertion pins presence.
			const entry = meta[operation];
			expect(entry).toBeDefined();
			expect(`${operation}: ${entry?.riskLevel}`).toBe(
				`${operation}: ${
					destructiveOperations.has(operation)
						? 'destructive'
						: writeOperations.has(operation)
							? 'write'
							: 'read'
				}`,
			);
			expect(entry?.description?.length).toBeGreaterThan(10);
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(gumroadEndpointSchemas).sort()).toEqual(
			[...operations].sort(),
		);
		for (const schemas of Object.values(gumroadEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = gumroad({
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
		expect(names).toContain('SERVER_ERROR');
	});
});

describe('gumroad key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(buildKey(gumroad({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key for api_key auth', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(buildKey(gumroad(), ctx)).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: null });

		await expect(buildKey(gumroad(), ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('returns an empty key for token-free operations without stored credentials', async () => {
		for (const operation of [
			'public.product',
			'public.profile',
			'licenses.verify',
		]) {
			const ctx = {
				...keyContext({ authType: 'api_key', apiKey: null }),
				meteredOperationId: operation,
			};

			await expect(buildKey(gumroad(), ctx)).resolves.toBe('');
		}
	});

	it('still requires credentials for private operations', async () => {
		const ctx = {
			...keyContext({ authType: 'api_key', apiKey: null }),
			meteredOperationId: 'products.list',
		};

		await expect(buildKey(gumroad(), ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		const ctx = keyContext({ authType: 'api_key', apiKey: 'stored-key' });

		await expect(
			gumroad().keyBuilder?.(ctx as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
