import { AuthMissingError } from 'corsair/core';
import { memberSpotEndpointSchemas, memberspot } from './index';
import { MemberSpotSchema } from './schema';

// The factory's public type keeps optional members optional; tests assert on
// what the plugin defines, so it is read once here.
const plugin = memberspot();
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
const meta = plugin.endpointMeta as NonNullable<typeof plugin.endpointMeta>;

describe('plugin shape', () => {
	it('uses the provider id', () => {
		expect(plugin.id).toBe('memberspot');
	});

	it('authenticates with an API key only', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares no webhooks, because the API sends none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: undefined }),
		).toBe(false);
	});

	it('groups endpoints by resource', () => {
		expect(Object.keys(endpoints).sort()).toEqual([
			'auth',
			'chapters',
			'courses',
			'customProperties',
			'exams',
			'offers',
			'users',
		]);
	});

	it('exposes all 32 documented paths', () => {
		// The spec has 32 paths and 34 operations: delete-users and
		// delete-users-by-uid each document DELETE and POST, and this plugin builds
		// the POST form of both.
		const paths: string[] = [];
		for (const [group, ops] of Object.entries(endpoints)) {
			// unknown: the tree holds callables under unknown keys, and only the
			// key names matter here.
			for (const name of Object.keys(ops as Record<string, unknown>)) {
				paths.push(`${group}.${name}`);
			}
		}
		expect(paths).toHaveLength(32);
	});

	it('carries a schema version and no entities', () => {
		expect(MemberSpotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		// Every read is current, and the API is the system of record, so a local
		// mirror would only add staleness.
		expect(MemberSpotSchema.entities).toEqual({});
	});
});

describe('endpoint metadata', () => {
	it('declares metadata for every endpoint', () => {
		expect(Object.keys(meta).sort()).toEqual(
			Object.keys(memberSpotEndpointSchemas).sort(),
		);
	});

	it('marks the catalog and progress routes as reads', () => {
		for (const path of [
			'auth.check',
			'offers.list',
			'courses.list',
			'exams.list',
			'exams.results',
			'customProperties.list',
			'users.list',
			'users.findByEmail',
			'users.findByUid',
			'users.offers',
			'users.loginToken',
			'users.courseProgress',
			'users.courseProgressDetail',
		] as const) {
			expect(meta[path]?.riskLevel).toBe('read');
		}
	});

	it('marks only the delete routes destructive and irreversible', () => {
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([path]) => path)
			.sort();
		expect(destructive).toEqual(['users.delete', 'users.deleteByUid']);
		for (const path of destructive) {
			expect(meta[path as keyof typeof meta]?.irreversible).toBe(true);
		}
	});

	it('marks grants and state changes as writes, not destructive', () => {
		for (const path of [
			'users.grantOffer',
			'users.grantOfferByUid',
			'users.setOfferState',
			'users.setOfferExpires',
			'users.setCourseStartDate',
			'users.setCustomProperties',
			'users.setCustomProperty',
			'chapters.enableAccess',
		] as const) {
			expect(meta[path]?.riskLevel).toBe('write');
			expect(meta[path]?.irreversible).toBeUndefined();
		}
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length ?? 0).toBeGreaterThan(20);
		}
	});
});

describe('endpoint schemas', () => {
	it('covers every endpoint in the tree', () => {
		const paths: string[] = [];
		for (const [group, ops] of Object.entries(endpoints)) {
			// unknown: same as above, only the key names are needed.
			for (const name of Object.keys(ops as Record<string, unknown>)) {
				paths.push(`${group}.${name}`);
			}
		}
		expect(Object.keys(memberSpotEndpointSchemas).sort()).toEqual(paths.sort());
	});
});

describe('keyBuilder', () => {
	/**
	 * The context type narrows to a non-assignable shape for this option set, so
	 * the fixture is spelled out. Safe: the key builder reads only authType,
	 * options.key and keys.get_api_key.
	 */
	const keyBuilder = plugin.keyBuilder as unknown as (
		ctx: {
			authType: 'api_key';
			options: Record<string, never>;
			keys: { get_api_key: () => Promise<string | undefined> };
			tenantId: string;
		},
		source: 'endpoint' | 'webhook',
	) => Promise<string>;

	it('prefers the inline key', async () => {
		const configured = memberspot({ key: 'inline-key' });
		const configuredKeyBuilder =
			configured.keyBuilder as unknown as typeof keyBuilder;
		await expect(
			configuredKeyBuilder(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: async () => 'stored-key' },
					tenantId: 'default',
				},
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: async () => 'stored-key' },
					tenantId: 'default',
				},
				'endpoint',
			),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when neither exists', async () => {
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: async () => undefined },
					tenantId: 'default',
				},
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
