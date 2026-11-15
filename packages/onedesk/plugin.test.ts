import { AuthMissingError } from 'corsair/core';
import { onedesk, onedeskEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof onedesk>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

/** Every operation, in the order the endpoint tree registers them. */
const operations = [
	'activities.filterDetails',
	'attachments.attachToItem',
	'attachments.attachToOrganization',
	'attachments.attachToPortfolio',
	'attachments.attachToProject',
	'attachments.filter',
	'attachments.filterDetails',
	'attachments.get',
	'attachments.upload',
	'conversations.create',
	'conversations.filter',
	'conversations.filterDetails',
	'conversations.get',
	'conversations.update',
	'customers.create',
	'customers.filter',
	'customers.filterDetails',
	'customers.get',
	'customers.update',
	'invoices.filter',
	'invoices.filterDetails',
	'invoices.get',
	'invoices.update',
	'items.create',
	'items.filter',
	'items.filterDetails',
	'items.get',
	'items.update',
	'messages.create',
	'messages.filter',
	'messages.filterDetails',
	'messages.get',
	'messages.update',
	'organization.containerTypes',
	'organization.itemTypes',
	'organization.lifecycleStatus',
	'organization.profile',
	'organization.userTypes',
	'organizations.create',
	'organizations.filter',
	'organizations.filterDetails',
	'organizations.get',
	'organizations.update',
	'portfolios.create',
	'portfolios.filter',
	'portfolios.filterDetails',
	'portfolios.get',
	'portfolios.update',
	'projects.create',
	'projects.filter',
	'projects.filterDetails',
	'projects.get',
	'projects.update',
	'quotes.filter',
	'quotes.filterDetails',
	'quotes.get',
	'quotes.update',
	'teams.create',
	'teams.filter',
	'teams.filterDetails',
	'teams.get',
	'teams.update',
	'timers.cancel',
	'timers.filter',
	'timers.filterDetails',
	'timers.get',
	'timers.pause',
	'timers.resume',
	'timers.start',
	'timesheets.create',
	'timesheets.filter',
	'timesheets.filterDetails',
	'timesheets.get',
	'timesheets.update',
	'users.create',
	'users.filter',
	'users.filterDetails',
	'users.get',
	'users.update',
];

describe('onedesk plugin definition', () => {
	const plugin = onedesk();

	it('registers as onedesk with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('onedesk');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 77 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(onedeskEndpointSchemas).sort()).toEqual(operations);
		for (const entry of Object.values(onedeskEndpointSchemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks the operations that cannot be undone as irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();
		// A voided invoice cannot be un-voided, so invoices.update is classified
		// by its worst case rather than its common one.
		expect(irreversible).toEqual(['invoices.update', 'timers.cancel']);
	});

	it('treats invoice voiding as destructive so it needs approval', () => {
		expect(plugin.endpointMeta?.['invoices.update']?.riskLevel).toBe(
			'destructive',
		);
	});

	it('treats every filter and get as a read and every create as a write', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const [name, entry] of Object.entries(meta)) {
			if (
				name.endsWith('.filter') ||
				name.endsWith('.filterDetails') ||
				name.endsWith('.get')
			) {
				expect([name, entry.riskLevel]).toEqual([name, 'read']);
			}
			if (name.endsWith('.create')) {
				expect([name, entry.riskLevel]).toEqual([name, 'write']);
			}
		}
	});

	it('treats every timer action as a write, not a read', () => {
		// These are GET requests that change state.
		for (const name of ['timers.start', 'timers.pause', 'timers.resume']) {
			expect(
				plugin.endpointMeta?.[name as keyof typeof plugin.endpointMeta]
					?.riskLevel,
			).toBe('write');
		}
	});

	it('keeps DEFAULT last after merging handlers', () => {
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys.at(-1)).toBe('DEFAULT');
	});
});

describe('onedesk key builder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = onedesk({ key: 'inline-key' });
		const ctx = keyContext('stored-key');

		await expect(buildKey(plugin, ctx)).resolves.toBe('inline-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored account key', async () => {
		await expect(buildKey(onedesk(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		await expect(buildKey(onedesk(), keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
