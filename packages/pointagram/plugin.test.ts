import { AuthMissingError } from 'corsair/core';
import type { PointagramKeyBuilderContext } from './index';
import { pointagram, pointagramEndpointSchemas } from './index';

const OPERATIONS = [
	'test.credentials',
	'players.list',
	'players.get',
	'players.create',
	'players.update',
	'players.delete',
	'teams.list',
	'teams.get',
	'teams.create',
	'teams.update',
	'teams.addPlayer',
	'teams.listPlayers',
	'teams.removePlayer',
	'scoreSeries.list',
	'scoreSeries.get',
	'scoreSeries.addPoints',
	'scoreSeries.pointTypes',
	'scoreSeries.history',
	'competitions.list',
	'competitions.get',
	'competitions.players',
	'rewardStore.settings',
	'rewardStore.items',
	'rewardStore.item',
	'rewardStore.purchases',
	'rewardStore.purchase',
	'rewardStore.updatePurchase',
	'rewardStore.revokePurchase',
] as const;

type EndpointMeta = { riskLevel: string; irreversible?: boolean };
type KeyBuilder = (
	ctx: PointagramKeyBuilderContext,
	source: string,
) => Promise<string>;

const keyBuilderOf = (candidate: {
	keyBuilder?: unknown; // unknown: read only to cast it; plugin types differ.
}): KeyBuilder => candidate.keyBuilder as KeyBuilder;

/** Every dot-notation path in the nested endpoint tree. */
function flatten(
	endpoints: Record<string, unknown>, // unknown: walked generically, group by group.
): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		// unknown: each group is an object of endpoint functions.
		for (const name of Object.keys(members as Record<string, unknown>)) {
			// unknown: as above.
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

function keyBuilderContext(overrides: {
	apiKey?: string | null;
	apiUser?: string | null;
}): PointagramKeyBuilderContext {
	return {
		authType: 'api_key',
		options: {},
		tenantId: 'default',
		keys: {
			get_dek: async () => 'dek',
			issue_new_dek: async () => 'dek',
			get_api_key: async () => overrides.apiKey ?? null,
			set_api_key: async () => {},
			get_api_user: async () => overrides.apiUser ?? null,
			set_api_user: async () => {},
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => {},
		},
	} as unknown as PointagramKeyBuilderContext; // unknown: only the fields above are read.
}

describe('pointagram plugin', () => {
	const plugin = pointagram();
	const meta = plugin.endpointMeta as unknown as Record<string, EndpointMeta>; // unknown: read by key to check risk levels.

	it('declares its id, auth type and schema version', () => {
		expect(plugin.id).toBe('pointagram');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.schema?.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('receives no webhooks, because Pointagram sends none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({} as never)).toBe(false);
	});

	it('registers every advertised operation across six groups', () => {
		const endpoints = plugin.endpoints as Record<string, unknown>; // unknown: only names are read.
		expect(flatten(endpoints)).toEqual([...OPERATIONS].sort());
		expect(Object.keys(endpoints)).toEqual([
			'test',
			'players',
			'teams',
			'scoreSeries',
			'competitions',
			'rewardStore',
		]);
	});

	it('has a meta entry for every operation and no extras', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('marks the operations that cannot be undone', () => {
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([path]) => path)
			.sort();

		expect(destructive).toEqual([
			'players.delete',
			'rewardStore.purchase',
			'rewardStore.revokePurchase',
			'teams.removePlayer',
		]);
		expect(meta['players.delete']?.irreversible).toBe(true);
		expect(meta['rewardStore.revokePurchase']?.irreversible).toBe(true);
		// The player stays in Pointagram with their points after leaving a team.
		expect(meta['teams.removePlayer']?.irreversible).toBeUndefined();
	});

	it('keeps the read operations read-only', () => {
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([path]) => path)
			.sort();

		expect(reads).toEqual(
			[
				'test.credentials',
				'players.list',
				'players.get',
				'teams.list',
				'teams.get',
				'teams.listPlayers',
				'scoreSeries.list',
				'scoreSeries.get',
				'scoreSeries.pointTypes',
				'scoreSeries.history',
				'competitions.list',
				'competitions.get',
				'competitions.players',
				'rewardStore.settings',
				'rewardStore.items',
				'rewardStore.item',
				'rewardStore.purchases',
			].sort(),
		);
	});

	it('registers an input and an output schema for every operation', () => {
		// Entries are only checked for presence, never parsed, so their types stay open.
		const schemas = pointagramEndpointSchemas as Record<
			string,
			// unknown: presence check only; no field of these schemas is read.
			{ input?: unknown; output?: unknown } // unknown: see the line above.
		>;

		expect(Object.keys(schemas).sort()).toEqual([...OPERATIONS].sort());
		for (const [path, entry] of Object.entries(schemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
			expect(path).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});

	it('declares api_user as an account field, so the key manager creates its accessor', () => {
		// The account key manager only generates accessors for account-level
		// fields, so the second credential must not be declared under integration.
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['api_user'] },
		});
	});
});

describe('pointagram keyBuilder', () => {
	it('prefers the inline key', async () => {
		const plugin = pointagram({ key: 'inline-key' });

		await expect(
			keyBuilderOf(plugin)(
				keyBuilderContext({ apiKey: 'stored-key' }),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored account key', async () => {
		await expect(
			keyBuilderOf(pointagram())(
				keyBuilderContext({ apiKey: 'stored-key' }),
				'endpoint',
			),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when neither source has a key', async () => {
		await expect(
			keyBuilderOf(pointagram())(keyBuilderContext({}), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for a webhook source, which this plugin never sees', async () => {
		await expect(
			keyBuilderOf(pointagram({ key: 'inline-key' }))(
				keyBuilderContext({}),
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
