import { logEventFromContext } from 'corsair/core';
import type { NorthflankContext } from './index';
import { northflankEndpointsNested } from './index';

// Live integration tests against the real Northflank API.
// Provide a key via NORTHFLANK_API_KEY; the suite skips cleanly without one
// so CI stays green. Only read-only ops run here — nothing is created,
// updated, or deleted in the account.
jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue('test-event-id'),
	};
});

const LIVE_API_KEY = process.env.NORTHFLANK_API_KEY?.trim();
const describeLive = LIVE_API_KEY ? describe : describe.skip;

function createLiveContext(apiKey: string): NorthflankContext {
	return {
		key: apiKey,
		$getAccountId: async (): Promise<string> => 'live-account',
		endpoints: {},
		db: {},
		options: {},
		keys: {
			get_dek: async (): Promise<string> => 'live-dek',
			issue_new_dek: async (): Promise<string> => 'live-dek',
			get_api_key: async (): Promise<string | null> => apiKey,
			set_api_key: async (): Promise<void> => undefined,
			get_webhook_signature: async (): Promise<string | null> => null,
			set_webhook_signature: async (): Promise<void> => undefined,
		},
	};
}

describeLive('Northflank live API (NORTHFLANK_API_KEY)', () => {
	// Narrowed once from the env guard above; every test below reuses it.
	const apiKey: string = LIVE_API_KEY ?? '';
	const ctx = createLiveContext(apiKey);

	it('lists projects', async () => {
		const res = await northflankEndpointsNested.projects.list(ctx, {
			per_page: 5,
		});
		expect(Array.isArray(res.data.projects)).toBe(true);
	});

	it('lists plans', async () => {
		const res = await northflankEndpointsNested.plans.list(ctx, {});
		expect(Array.isArray(res.data.plans)).toBe(true);
	});

	it('lists regions', async () => {
		const res = await northflankEndpointsNested.regions.list(ctx, {});
		expect(res.data.regions.length).toBeGreaterThan(0);
	});

	it('lists addon types', async () => {
		const res = await northflankEndpointsNested.addonTypes.list(ctx, {});
		expect(res.data.addonTypes.length).toBeGreaterThan(0);
		expect(res.data.addonTypes[0]?.type).toBeDefined();
	});

	it('lists cloud provider node types', async () => {
		const res = await northflankEndpointsNested.cloudProviders.listNodeTypes(
			ctx,
			{ per_page: 5 },
		);
		expect(Array.isArray(res.data.nodeTypes)).toBe(true);
	});

	it('lists cloud provider regions', async () => {
		const res = await northflankEndpointsNested.cloudProviders.listRegions(
			ctx,
			{ per_page: 5 },
		);
		expect(Array.isArray(res.data.regions)).toBe(true);
	});

	it('gets a secret with show=all when the project has one', async () => {
		const projects = await northflankEndpointsNested.projects.list(ctx, {
			per_page: 5,
		});
		for (const project of projects.data.projects) {
			const listed = await northflankEndpointsNested.secrets.list(ctx, {
				projectId: project.id,
				per_page: 1,
			});
			const first = listed.data.secrets[0];
			if (first === undefined) continue;
			const res = await northflankEndpointsNested.secrets.get(ctx, {
				projectId: project.id,
				secretId: first.id,
				show: 'all',
			});
			expect(res.data.id).toBe(first.id);
			return;
		}
	});

	it('lists services, pipelines, and secrets for an existing project', async () => {
		const projects = await northflankEndpointsNested.projects.list(ctx, {
			per_page: 1,
		});
		const first = projects.data.projects[0];
		if (first === undefined) return;
		const services = await northflankEndpointsNested.services.list(ctx, {
			projectId: first.id,
		});
		expect(Array.isArray(services.data.services)).toBe(true);
		const pipelines = await northflankEndpointsNested.pipelines.list(ctx, {
			projectId: first.id,
		});
		expect(Array.isArray(pipelines.data.pipelines)).toBe(true);
		const secrets = await northflankEndpointsNested.secrets.list(ctx, {
			projectId: first.id,
		});
		expect(Array.isArray(secrets.data.secrets)).toBe(true);
	});

	it('gets the account DNS id', async () => {
		const res = await northflankEndpointsNested.misc.getDnsId(ctx, {});
		expect(res.data.dns.length).toBeGreaterThan(0);
	});

	it('gets a project when at least one exists', async () => {
		const projects = await northflankEndpointsNested.projects.list(ctx, {
			per_page: 1,
		});
		const first = projects.data.projects[0];
		if (first === undefined) return;
		const res = await northflankEndpointsNested.projects.get(ctx, {
			projectId: first.id,
		});
		expect(res.data.id).toBe(first.id);
	});

	it('logs audit events for live calls', async () => {
		await northflankEndpointsNested.plans.list(ctx, {});
		expect(logEventFromContext).toHaveBeenCalled();
	});
});
