import { AuthMissingError } from 'corsair/core';
import { talenthr, talenthrEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof talenthr>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'departments.create',
	'departments.delete',
	'departments.list',
	'divisions.create',
	'divisions.delete',
	'divisions.get',
	'divisions.list',
	'divisions.update',
	'employees.delete',
	'employees.directory',
	'employees.employmentStatuses',
	'employees.get',
	'employees.hire',
	'employees.rehire',
	'employees.terminate',
	'employees.update',
	'jobTitles.list',
	'locations.list',
	'referenceData.employmentStatuses',
	'timeOff.budgets',
	'timeOff.create',
	'timeOff.delete',
	'timeOff.list',
	'timeOff.reply',
	'timeOff.types',
];

const riskLevels = {
	'departments.create': 'write',
	'departments.delete': 'destructive',
	'departments.list': 'read',
	'divisions.create': 'write',
	'divisions.delete': 'destructive',
	'divisions.get': 'read',
	'divisions.list': 'read',
	'divisions.update': 'write',
	'employees.delete': 'destructive',
	'employees.directory': 'read',
	'employees.employmentStatuses': 'read',
	'employees.get': 'read',
	'employees.hire': 'destructive',
	'employees.rehire': 'destructive',
	'employees.terminate': 'destructive',
	'employees.update': 'write',
	'jobTitles.list': 'read',
	'locations.list': 'read',
	'referenceData.employmentStatuses': 'read',
	'timeOff.budgets': 'read',
	'timeOff.create': 'destructive',
	'timeOff.delete': 'destructive',
	'timeOff.list': 'read',
	'timeOff.reply': 'destructive',
	'timeOff.types': 'read',
} as const;

describe('talenthr plugin definition', () => {
	const plugin = talenthr();

	it('registers as talenthr with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('talenthr');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 25 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(operations).toHaveLength(25);
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
		).toEqual(riskLevels);
	});

	it('marks every delete irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const deletes = operations.filter((name) => name.endsWith('.delete'));
		expect(deletes).toEqual([
			'departments.delete',
			'divisions.delete',
			'employees.delete',
			'timeOff.delete',
		]);
		for (const name of deletes) {
			// timeOff.delete only cancels, which another booking can undo, so it
			// is destructive without being irreversible.
			if (name === 'timeOff.delete') continue;
			expect(meta[name as keyof typeof meta]?.irreversible).toBe(true);
		}
	});

	it('registers a schema for every operation, in both directions', () => {
		expect(Object.keys(talenthrEndpointSchemas).sort()).toEqual(operations);
	});

	it('declares entities: {} because the plugin stores nothing', () => {
		expect(plugin.schema).toBeDefined();
		expect(Array.isArray(plugin.schema?.entities)).toBe(false);
		expect(plugin.schema?.entities).toEqual({});
	});

	it('builds error handlers with DEFAULT last', () => {
		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
	});
});

describe('talenthr keyBuilder', () => {
	const plugin = talenthr();

	it('prefers the inline key over the stored one', async () => {
		const inline = talenthr({ key: 'inline-key' });
		const ctx = keyContext('stored-key');

		await expect(buildKey(inline, ctx)).resolves.toBe('inline-key');
		// The stored key is not even read when the inline one wins.
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored key', async () => {
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
