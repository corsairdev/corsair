import { AuthMissingError } from 'corsair/core';
import type { SimplekpiKeyBuilderContext } from './index';

/**
 * The endpoint tree mixes functions with one deeper group (kpiCategories.kpis),
 * so a walker sees a value of either kind.
 */
type EndpointTreeValue = unknown; // unknown: a function, or a nested group

import { simplekpi, simplekpiEndpointSchemas } from './index';

/** The key builder only reads authType and keys. */
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof simplekpi>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// A test fixture cannot be a full AccountKeyManager, which also needs
	// get_dek and issue_new_dek; only get_api_key is read here.
	return plugin.keyBuilder?.(
		ctx as unknown as SimplekpiKeyBuilderContext, // unknown: partial fixture
		source,
	);
}

const operations = [
	'breakdownItems.create',
	'breakdownItems.delete',
	'breakdownItems.get',
	'breakdownItems.list',
	'breakdownItems.update',
	'kpiCategories.create',
	'kpiCategories.delete',
	'kpiCategories.get',
	'kpiCategories.kpis.create',
	'kpiCategories.kpis.delete',
	'kpiCategories.kpis.get',
	'kpiCategories.kpis.list',
	'kpiCategories.kpis.update',
	'kpiCategories.list',
	'kpiCategories.update',
	'kpiEntries.create',
	'kpiEntries.createBatch',
	'kpiEntries.delete',
	'kpiEntries.get',
	'kpiEntries.list',
	'kpiEntries.update',
	'kpiFrequencies.get',
	'kpiFrequencies.list',
	'kpiIcons.get',
	'kpiIcons.list',
	'kpiUnits.create',
	'kpiUnits.delete',
	'kpiUnits.get',
	'kpiUnits.list',
	'kpiUnits.update',
	'kpis.create',
	'kpis.delete',
	'kpis.get',
	'kpis.list',
	'kpis.update',
	'reports.allDataEntries',
	'users.get',
	'users.list',
];

describe('simplekpi plugin definition', () => {
	const plugin = simplekpi();

	it('registers as simplekpi with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('simplekpi');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the thirty-eight catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) =>
				Object.entries(fns as Record<string, EndpointTreeValue>).flatMap(
					([name, value]) =>
						typeof value === 'object' && value !== null
							? Object.keys(value).map((sub) => `${group}.${name}.${sub}`)
							: [`${group}.${name}`],
				),
		);
		expect(nested.sort()).toEqual(operations);
		expect(nested).toHaveLength(38);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks every delete irreversible and destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const deletes = Object.entries(meta)
			.filter(([name]) => name.endsWith('.delete'))
			.map(([name, entry]) => ({
				name,
				riskLevel: entry.riskLevel,
				irreversible: entry.irreversible,
			}));

		expect(deletes).toHaveLength(6);
		for (const entry of deletes) {
			expect(entry.riskLevel).toBe('destructive');
			expect(entry.irreversible).toBe(true);
		}
	});

	it('keeps every lookup and report read-only', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const name of [
			'kpiFrequencies.list',
			'kpiFrequencies.get',
			'kpiIcons.list',
			'kpiIcons.get',
			'reports.allDataEntries',
			'users.list',
			'users.get',
		]) {
			expect(meta[name as keyof typeof meta]?.riskLevel).toBe('read');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(simplekpiEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(simplekpiEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last and puts caller handlers first', () => {
		const custom = simplekpi({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names).toContain('AUTH_ERROR');
		expect(names).toContain('PERMISSION_ERROR');
	});
});

describe('simplekpi key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(simplekpi({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(simplekpi(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(simplekpi(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			buildKey(simplekpi(), keyContext('stored-key'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
