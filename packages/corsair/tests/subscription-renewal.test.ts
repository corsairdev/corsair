import { renewAccounts } from '../oauth/renewal';

const internalBase = {
	plugins: [] as any[],
	kek: 'k'.repeat(64),
	multiTenancy: true,
	database: { db: {} },
} as any;

describe('renewAccounts (BYO subscription renewal)', () => {
	it('re-subscribes every account whose plugin has subscribe, skips the rest', async () => {
		const called: string[] = [];
		const outlook = { id: 'outlook', subscribe: async () => ({}) };
		const github = { id: 'github' }; // no subscribe capability
		const result = await renewAccounts({
			corsair: {},
			internal: { ...internalBase, plugins: [outlook, github] },
			rows: [
				{ tenantId: 't1', integrationName: 'outlook' },
				{ tenantId: 't2', integrationName: 'outlook' },
				{ tenantId: 't1', integrationName: 'github' },
				{ tenantId: 't1', integrationName: 'unknown' },
			],
			subscribeAndReport: async (_c, plugin, tenantId, keys) => {
				expect(keys.get_access_token).toBeDefined();
				called.push(`${plugin.id}/${tenantId}`);
			},
		});

		expect(called).toEqual(['outlook/t1', 'outlook/t2']);
		expect(result).toEqual({
			renewed: ['outlook/t1', 'outlook/t2'],
			failed: [],
		});
	});

	it('isolates per-account failures and tallies them', async () => {
		const outlook = { id: 'outlook', subscribe: async () => ({}) };
		const result = await renewAccounts({
			corsair: {},
			internal: { ...internalBase, plugins: [outlook] },
			rows: [
				{ tenantId: 'bad', integrationName: 'outlook' },
				{ tenantId: 'good', integrationName: 'outlook' },
			],
			subscribeAndReport: async (_c, _p, tenantId) => {
				if (tenantId === 'bad') throw new Error('provider 500');
			},
		});

		expect(result).toEqual({
			renewed: ['outlook/good'],
			failed: ['outlook/bad'],
		});
	});
});
