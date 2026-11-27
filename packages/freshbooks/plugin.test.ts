import { AuthMissingError } from 'corsair/core';
import type { FreshBooksKeyBuilderContext } from './index';
import { freshBooksEndpointSchemas, freshbooks } from './index';

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
	plugin: ReturnType<typeof freshbooks>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(
		ctx as unknown as FreshBooksKeyBuilderContext,
		'endpoint',
	);
}

const operations = [
	'clients.create',
	'clients.delete',
	'clients.get',
	'clients.list',
	'clients.update',
	'estimates.create',
	'estimates.delete',
	'estimates.get',
	'estimates.list',
	'estimates.update',
	'expenses.create',
	'expenses.delete',
	'expenses.get',
	'expenses.list',
	'expenses.update',
	'invoices.create',
	'invoices.delete',
	'invoices.get',
	'invoices.list',
	'invoices.markSent',
	'invoices.sendEmail',
	'invoices.update',
	'projects.create',
	'projects.delete',
	'projects.get',
	'projects.list',
	'projects.update',
	'tasks.create',
	'tasks.delete',
	'tasks.get',
	'tasks.list',
	'tasks.update',
	'timeEntries.create',
	'timeEntries.delete',
	'timeEntries.get',
	'timeEntries.list',
	'timeEntries.update',
	'users.me',
].sort();

describe('freshbooks plugin definition', () => {
	const plugin = freshbooks();

	it('registers as freshbooks with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('freshbooks');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 38 catalog operations across 8 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		const risk = Object.fromEntries(
			Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
		);
		expect(risk['users.me']).toBe('read');
		expect(risk['clients.list']).toBe('read');
		expect(risk['clients.create']).toBe('write');
		expect(risk['invoices.markSent']).toBe('write');
		expect(risk['invoices.sendEmail']).toBe('write');
		expect(risk['projects.delete']).toBe('destructive');
		expect(risk['timeEntries.delete']).toBe('destructive');
		for (const name of Object.keys(risk)) {
			if (name.endsWith('.delete')) {
				expect(risk[name]).toBe('destructive');
			}
		}
	});

	it('marks the outward-facing and soft-delete writes irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible === true)
			.map(([name]) => name)
			.sort();
		expect(irreversible).toEqual(
			[
				'clients.delete',
				'estimates.delete',
				'expenses.delete',
				'invoices.delete',
				'invoices.sendEmail',
				'projects.delete',
				'tasks.delete',
				'timeEntries.delete',
			].sort(),
		);
		expect(meta['invoices.markSent']).not.toHaveProperty('irreversible', true);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(freshBooksEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(freshBooksEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = freshbooks({
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

describe('freshbooks key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-token');

		await expect(
			buildKey(freshbooks({ key: 'option-token' }), ctx),
		).resolves.toBe('option-token');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored access token', async () => {
		await expect(
			buildKey(freshbooks(), keyContext('stored-token')),
		).resolves.toBe('stored-token');
	});

	it('throws AuthMissingError when no token is stored', async () => {
		await expect(
			buildKey(freshbooks(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys: deliveries are not handled', async () => {
		await expect(
			freshbooks().keyBuilder?.(
				keyContext('stored-token') as unknown as FreshBooksKeyBuilderContext,
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
