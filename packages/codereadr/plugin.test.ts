import type { InternalCodereadrPlugin } from './index';
import { codereadr, codereadrEndpointSchemas } from './index';
import { CodereadrSchema } from './schema';

// The factory's return type keeps optional members optional, so the assertions
// below read a value typed the way the plugin declares itself internally.
const plugin = codereadr() as InternalCodereadrPlugin;
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

describe('plugin shape', () => {
	it('uses the provider id', () => {
		expect(plugin.id).toBe('codereadr');
	});

	it('authenticates with an API key only', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares no webhooks, because the API pushes scan data to your own URL', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as never)).toBe(false);
	});

	it('exposes every documented section as a nested operation group', () => {
		expect(Object.keys(endpoints).sort()).toEqual([
			'databases',
			'devices',
			'limits',
			'questions',
			'scans',
			'services',
			'uploads',
			'users',
		]);
	});

	it('names the delete operations delete in the endpoint tree', () => {
		expect(typeof endpoints.scans.delete).toBe('function');
		expect(typeof endpoints.services.delete).toBe('function');
		expect(typeof endpoints.databases.delete).toBe('function');
		expect(typeof endpoints.users.delete).toBe('function');
	});

	it('has a schema version', () => {
		expect(CodereadrSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because this plugin reads the live API only', () => {
		expect(CodereadrSchema.entities).toEqual({});
	});
});

describe('endpoint metadata', () => {
	const meta = plugin.endpointMeta ?? {};

	it('marks every mutating scan operation destructive and irreversible', () => {
		expect(meta['scans.delete']?.riskLevel).toBe('destructive');
		expect(meta['scans.delete']?.irreversible).toBe(true);
	});

	it('marks deletion of services, databases and users irreversible', () => {
		for (const path of [
			'services.delete',
			'databases.delete',
			'users.delete',
		] as const) {
			expect(meta[path]?.riskLevel).toBe('destructive');
			expect(meta[path]?.irreversible).toBe(true);
		}
	});

	it('marks clearing a database destructive and irreversible', () => {
		expect(meta['databases.clear']?.riskLevel).toBe('destructive');
		expect(meta['databases.clear']?.irreversible).toBe(true);
	});

	it('marks reads as read', () => {
		for (const path of [
			'scans.list',
			'services.list',
			'databases.list',
			'databases.showValues',
			'users.list',
			'questions.list',
			'devices.list',
			'uploads.list',
			'limits.retrieve',
		] as const) {
			expect(meta[path]?.riskLevel).toBe('read');
		}
	});

	it('marks inserts and updates as writes, not destructive', () => {
		for (const path of [
			'services.create',
			'services.update',
			'databases.create',
			'databases.update',
			'databases.upsertValue',
			'databases.upsertValues',
			'users.create',
			'users.update',
			'questions.create',
			'devices.update',
		] as const) {
			expect(meta[path]?.riskLevel).toBe('write');
		}
	});

	it('does not mark an upsert irreversible', () => {
		expect(meta['databases.upsertValue']?.irreversible).toBeUndefined();
		expect(meta['databases.upsertValues']?.irreversible).toBeUndefined();
	});

	it('describes every operation', () => {
		for (const [path, entry] of Object.entries(meta)) {
			expect(entry.description?.length ?? 0).toBeGreaterThan(20);
			expect(path).toMatch(/^[a-z]+\.[a-zA-Z]+$/);
		}
	});
});

describe('endpoint schemas', () => {
	it('declares an input and output schema for every operation', () => {
		const metaPaths = Object.keys(plugin.endpointMeta ?? {}).sort();
		const schemaPaths = Object.keys(codereadrEndpointSchemas).sort();
		expect(schemaPaths).toEqual(metaPaths);
	});

	it('covers every endpoint in the tree', () => {
		const treePaths: string[] = [];
		for (const [group, operations] of Object.entries(endpoints)) {
			for (const operation of Object.keys(
				operations as Record<string, unknown>,
			)) {
				treePaths.push(`${group}.${operation}`);
			}
		}
		expect(Object.keys(codereadrEndpointSchemas).sort()).toEqual(
			treePaths.sort(),
		);
	});
});

describe('keyBuilder', () => {
	const keyBuilder = plugin.keyBuilder as NonNullable<
		InternalCodereadrPlugin['keyBuilder']
	>;

	it('returns the key passed in the options', async () => {
		const configured = codereadr({ key: 'inline-key' });
		const configuredKeyBuilder = configured.keyBuilder as NonNullable<
			typeof configured.keyBuilder
		>;
		const key = await configuredKeyBuilder(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'stored-key' },
			} as never,
			'endpoint',
		);
		expect(key).toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		const key = await keyBuilder(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'stored-key' },
			} as never,
			'endpoint',
		);
		expect(key).toBe('stored-key');
	});

	it('throws AuthMissingError when no key is configured', async () => {
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(/codereadr/i);
	});
});
