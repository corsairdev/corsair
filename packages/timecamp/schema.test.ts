/**
 * Registry integrity and auth wiring.
 */
import {
	TimecampEndpointInputSchemas,
	TimecampEndpointOutputSchemas,
} from './endpoints/types';
import { timecamp } from './index';
import { TimecampSchema } from './schema';

describe('database schema', () => {
	it('declares a semver version', () => {
		expect(TimecampSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('caches the project list', () => {
		expect(Object.keys(TimecampSchema.entities)).toEqual(['projects']);
	});
});

describe('endpoint registry', () => {
	it('registers the single documented operation', () => {
		expect(Object.keys(TimecampEndpointInputSchemas)).toEqual([
			'getProjectsList',
		]);
	});

	it('pairs every input schema with an output schema', () => {
		expect(Object.keys(TimecampEndpointOutputSchemas).sort()).toEqual(
			Object.keys(TimecampEndpointInputSchemas).sort(),
		);
	});

	it('gives every nested operation a schema and metadata entry', () => {
		const plugin = timecamp({ key: 'tc-test' });
		const schemas = plugin.endpointSchemas as Record<string, unknown>;
		const meta = plugin.endpointMeta as Record<string, unknown>;
		const groups: Record<string, Record<string, unknown>> = plugin.endpoints ??
		{};

		for (const [group, ops] of Object.entries(groups)) {
			for (const op of Object.keys(ops)) {
				expect(schemas[`${group}.${op}`]).toBeDefined();
				expect(meta[`${group}.${op}`]).toBeDefined();
			}
		}
	});

	it('marks the read-only operation as read', () => {
		const plugin = timecamp({ key: 'tc-test' });
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		expect(meta['projects.getList']?.riskLevel).toBe('read');
	});
});

describe('auth', () => {
	it('defaults to api_key, the only auth TimeCamp issues', () => {
		const plugin = timecamp();
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(plugin.authConfig ?? {})).toEqual(['api_key']);
	});

	it('declares no webhooks, since TimeCamp delivers no events', () => {
		const plugin = timecamp();
		expect(Object.keys(plugin.webhooks ?? {})).toHaveLength(0);
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('prefers an explicitly configured key over stored credentials', async () => {
		const plugin = timecamp({ key: 'explicit-key' });
		const ctx = {
			keys: { get_api_key: async () => 'stored-key' },
		} as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).resolves.toBe(
			'explicit-key',
		);
	});

	it('falls back to the stored key when none is configured', async () => {
		const plugin = timecamp();
		const ctx = {
			keys: { get_api_key: async () => 'stored-key' },
		} as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).resolves.toBe(
			'stored-key',
		);
	});

	it('raises AuthMissingError when no key exists anywhere', async () => {
		const plugin = timecamp();
		const ctx = { keys: { get_api_key: async () => null } } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toThrow();
	});
});

describe('input validation', () => {
	it('accepts an empty input', () => {
		expect(
			TimecampEndpointInputSchemas.getProjectsList.safeParse({}).success,
		).toBe(true);
	});

	it('rejects a non-boolean include_archived', () => {
		expect(
			TimecampEndpointInputSchemas.getProjectsList.safeParse({
				include_archived: 'yes',
			}).success,
		).toBe(false);
	});
});
