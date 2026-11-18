import { AuthMissingError } from 'corsair/core';
import type { HoneybadgerKeyBuilderContext } from './index';
import {
	honeybadger,
	honeybadgerEndpointMeta,
	honeybadgerEndpointSchemas,
} from './index';

const OPERATIONS = [
	'projects.list',
	'projects.get',
	'projects.create',
	'projects.update',
	'projects.delete',
	'projects.stats',
	'projects.occurrences',
	'occurrences.list',
	'faults.list',
	'faults.get',
	'faults.update',
	'faults.delete',
	'faults.resolve',
	'faults.unresolve',
	'faults.ignore',
	'faults.unignore',
	'faults.summary',
	'faults.assign',
	'faults.unassign',
	'faults.merge',
	'faults.pauseRecording',
	'faults.resumeRecording',
	'faults.snooze',
	'faults.unsnooze',
	'faults.affectedUsers',
	'faults.occurrences',
	'notices.list',
	'notices.get',
	'comments.list',
	'comments.get',
	'comments.create',
	'comments.update',
	'comments.delete',
	'deploys.list',
	'deploys.get',
	'deploys.delete',
	'environments.list',
	'environments.get',
	'environments.create',
	'environments.update',
	'environments.delete',
	'environments.bulkDelete',
	'environments.bulkUpdate',
	'checkIns.list',
	'checkIns.get',
	'checkIns.create',
	'checkIns.update',
	'checkIns.delete',
	'checkIns.replace',
	'checkIns.events',
	'sites.list',
	'sites.get',
	'sites.create',
	'sites.update',
	'sites.delete',
	'sites.checks',
	'sites.outages',
	'streams.list',
	'insights.query',
	'account.get',
	'account.usage',
	'token.get',
] as const;

/**
 * The shape core calls: a source of `endpoint` or `webhook`, and a key back.
 * Taken from the plugin type so it cannot drift from the real signature.
 */
type KeyBuilder = NonNullable<ReturnType<typeof honeybadger>['keyBuilder']>;

/** Collects `group.name` for every endpoint, whatever its group's shape. */
function flatten(endpoints: object): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as object)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('honeybadger plugin', () => {
	const plugin = honeybadger();
	// The literal's own type omits `irreversible` on the entries that do not set
	// it, so each entry is read through the contract core uses.
	const metaOf = (operation: keyof typeof honeybadgerEndpointMeta) =>
		honeybadgerEndpointMeta[operation] as {
			riskLevel: string;
			irreversible?: boolean;
			description: string;
		};
	// The plugin type makes `keyBuilder` optional; this plugin always sets it, so
	// the cast is what tells the test that. core's binder does the same lookup.
	const keyBuilderOf = (candidate: { keyBuilder?: KeyBuilder }): KeyBuilder =>
		candidate.keyBuilder as KeyBuilder;

	// A fixture only implements `get_api_key`, while the real context carries a
	// full AccountKeyManager. The keyBuilder reads nothing else.
	const keyContext = (key?: string) =>
		({
			authType: 'api_key',
			keys: { get_api_key: async () => key },
		}) as unknown as HoneybadgerKeyBuilderContext; // fixture, see above

	it('registers every operation as api.<group>.<name>', () => {
		expect(flatten(plugin.endpoints as object)).toEqual([...OPERATIONS].sort());
	});

	it('declares input and output schemas for every operation', () => {
		expect(Object.keys(honeybadgerEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = honeybadgerEndpointSchemas[operation];
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('declares metadata for every operation, with no placeholder text', () => {
		expect(Object.keys(honeybadgerEndpointMeta).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = metaOf(operation);
			expect(entry.description.length).toBeGreaterThan(40);
			expect(entry.description).not.toMatch(/example resource/i);
			expect(entry.description).not.toMatch(/TODO/);
		}
	});

	it('marks every read read-only', () => {
		const reads = OPERATIONS.filter(
			(operation) => metaOf(operation).riskLevel === 'read',
		);
		expect(reads).toEqual([
			'projects.list',
			'projects.get',
			'projects.stats',
			'projects.occurrences',
			'occurrences.list',
			'faults.list',
			'faults.get',
			'faults.summary',
			'faults.affectedUsers',
			'faults.occurrences',
			'notices.list',
			'notices.get',
			'comments.list',
			'comments.get',
			'deploys.list',
			'deploys.get',
			'environments.list',
			'environments.get',
			'checkIns.list',
			'checkIns.get',
			'checkIns.events',
			'sites.list',
			'sites.get',
			'sites.checks',
			'sites.outages',
			'streams.list',
			'insights.query',
			'account.get',
			'account.usage',
			'token.get',
		]);
	});

	// A BadgerQL query is a POST. It changes nothing, so it is a read; treating it
	// as a write would make a read-only caller unable to use it.
	it('treats the Insights query POST as a read', () => {
		expect(metaOf('insights.query').riskLevel).toBe('read');
	});

	it('marks deletes and merges destructive and irreversible', () => {
		const destructive = OPERATIONS.filter(
			(operation) => metaOf(operation).riskLevel === 'destructive',
		);
		expect(destructive).toEqual([
			'projects.delete',
			'faults.delete',
			'faults.merge',
			'comments.delete',
			'deploys.delete',
			'environments.delete',
			'environments.bulkDelete',
			'checkIns.delete',
			'checkIns.replace',
			'sites.delete',
		]);
		for (const operation of destructive) {
			expect([operation, metaOf(operation).irreversible]).toEqual([
				operation,
				true,
			]);
		}
	});

	it('marks state changes on faults and alerts as writes', () => {
		for (const operation of [
			'faults.resolve',
			'faults.unresolve',
			'faults.ignore',
			'faults.unignore',
			'faults.assign',
			'faults.unassign',
			'faults.pauseRecording',
			'faults.resumeRecording',
			'faults.snooze',
			'faults.unsnooze',
			'comments.create',
			'comments.update',
		] as const) {
			expect([operation, metaOf(operation).riskLevel]).toEqual([
				operation,
				'write',
			]);
		}
	});

	it('offers api_key auth only, and no webhooks', () => {
		// Honeybadger sends no inbound deliveries, so registering a route would
		// offer a webhook URL that never receives anything.
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	describe('keyBuilder', () => {
		it('returns the explicitly configured key', async () => {
			const configured = honeybadger({ key: 'inline-key' });
			await expect(
				keyBuilderOf(configured)(keyContext(), 'endpoint'),
			).resolves.toBe('inline-key');
		});

		it('falls back to the stored key', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
			).resolves.toBe('stored-key');
		});

		// Failing open would send an empty Bearer header and surface a generic
		// 401 instead of Corsair's disconnected-auth flow.
		it('throws AuthMissingError when no key is available', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});

		it('throws AuthMissingError for a non-endpoint source', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-key'), 'webhook'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
