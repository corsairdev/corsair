/**
 * PhantomBuster plugin — factory shape (always runs) plus live API checks.
 *
 * Live checks require PHANTOMBUSTER_API_KEY and hit the real v2 API with
 * read-only endpoints. They are skipped in CI without a key.
 */
import { makePhantomBusterRequest } from './client';
import { phantombuster } from './index';
import { PhantomBusterSchema } from './schema';

const LIVE_KEY = process.env.PHANTOMBUSTER_API_KEY;
const describeLive = LIVE_KEY ? describe : describe.skip;

describe('phantombuster plugin factory', () => {
	it('creates a plugin with the correct id', () => {
		const plugin = phantombuster();
		expect(plugin.id).toBe('phantombuster');
	});

	it('includes the expected endpoint groups', () => {
		const plugin = phantombuster();
		const endpoints = plugin.endpoints;
		expect(endpoints).toHaveProperty('agents');
		expect(endpoints).toHaveProperty('containers');
		expect(endpoints).toHaveProperty('users');
		expect(endpoints).toHaveProperty('orgs');
		expect(endpoints).toHaveProperty('leads');
		expect(endpoints).toHaveProperty('lists');
		expect(endpoints).toHaveProperty('branches');
		expect(endpoints).toHaveProperty('scripts');
		expect(endpoints).toHaveProperty('storage');
		expect(endpoints).toHaveProperty('identities');
		expect(endpoints).toHaveProperty('misc');
	});

	it('uses api_key auth type by default', () => {
		const plugin = phantombuster();
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('has a valid empty schema', () => {
		const plugin = phantombuster();
		expect(plugin.schema).toEqual(PhantomBusterSchema);
		expect(plugin.schema?.entities).toEqual({});
	});

	it('exposes authConfig for api_key', () => {
		const plugin = phantombuster();
		expect(plugin.authConfig).toHaveProperty('api_key');
	});

	it('declares no webhooks (request/response API)', () => {
		const plugin = phantombuster();
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
	});

	it('has endpoint schemas and meta for every group', () => {
		const plugin = phantombuster();
		const schemaKeys = Object.keys(plugin.endpointSchemas ?? {});
		const metaKeys = Object.keys(plugin.endpointMeta ?? {});
		for (const key of [
			'agents.fetchAll',
			'agents.launch',
			'containers.fetchAll',
			'users.fetchMe',
			'orgs.fetch',
			'leads.save',
			'lists.fetchAll',
			'branches.fetchAll',
			'scripts.fetchAll',
			'storage.searchLeadObjects',
			'identities.generateToken',
			'misc.fetchIpLocation',
		]) {
			expect(schemaKeys).toContain(key);
			expect(metaKeys).toContain(key);
		}
	});

	it('marks destructive operations correctly', () => {
		const plugin = phantombuster();
		const meta = plugin.endpointMeta ?? {};
		expect(meta['agents.delete']?.riskLevel).toBe('destructive');
		expect(meta['lists.delete']?.riskLevel).toBe('destructive');
		expect(meta['branches.delete']?.riskLevel).toBe('destructive');
		expect(meta['scripts.delete']?.riskLevel).toBe('destructive');
	});

	it('optional key option is passed through', () => {
		const plugin = phantombuster({ key: 'my-api-key' });
		expect(plugin.options?.key).toBe('my-api-key');
	});
});

type LiveAgent = { id: string; name?: string | null };

async function liveAgents(key: string): Promise<LiveAgent[]> {
	return makePhantomBusterRequest<LiveAgent[]>('/agents/fetch-all', key);
}

describeLive('phantombuster live API (PHANTOMBUSTER_API_KEY)', () => {
	it('fetches branches', async () => {
		const key = LIVE_KEY ?? '';
		const branches = await makePhantomBusterRequest<
			{ id: string; name: string; created_at: number }[]
		>('/branches/fetch-all', key);
		expect(Array.isArray(branches)).toBe(true);
	});

	it('fetches the branches diff', async () => {
		const key = LIVE_KEY ?? '';
		const branches = await makePhantomBusterRequest<{ name: string }[]>(
			'/branches/fetch-all',
			key,
		);
		const name = branches[0]?.name ?? 'master';
		const diff = await makePhantomBusterRequest<unknown[]>(
			'/branches/diff',
			key,
			{ method: 'GET', query: { name } },
		);
		expect(Array.isArray(diff)).toBe(true);
	});

	it('fetches agents', async () => {
		const key = LIVE_KEY ?? '';
		const agents = await liveAgents(key);
		expect(Array.isArray(agents)).toBe(true);
	});

	it('fetches a single agent by id', async () => {
		const key = LIVE_KEY ?? '';
		const agents = await liveAgents(key);
		if (agents.length === 0) return;
		const id = agents[0]?.id ?? '';
		const agent = await makePhantomBusterRequest<{ id: string }>(
			'/agents/fetch',
			key,
			{ method: 'GET', query: { id } },
		);
		expect(agent.id).toBe(id);
	});

	it('fetches agent output for the first agent', async () => {
		const key = LIVE_KEY ?? '';
		const agents = await liveAgents(key);
		if (agents.length === 0) return;
		const id = agents[0]?.id ?? '';
		const output = await makePhantomBusterRequest<{
			status: string;
			isAgentRunning: boolean;
			canSoftAbort: boolean;
		}>('/agents/fetch-output', key, { method: 'GET', query: { id } });
		expect(typeof output.status).toBe('string');
		expect(typeof output.isAgentRunning).toBe('boolean');
		expect(typeof output.canSoftAbort).toBe('boolean');
	});

	it('fetches deleted agents', async () => {
		const key = LIVE_KEY ?? '';
		const deleted = await makePhantomBusterRequest<unknown[]>(
			'/agents/fetch-deleted',
			key,
		);
		expect(Array.isArray(deleted)).toBe(true);
	});

	it('fetches containers for the first agent', async () => {
		const key = LIVE_KEY ?? '';
		const agents = await liveAgents(key);
		if (agents.length === 0) return;
		const agentId = agents[0]?.id ?? '';
		const result = await makePhantomBusterRequest<{
			maxLimitReached: boolean;
			containers: unknown[];
		}>('/containers/fetch-all', key, {
			method: 'GET',
			query: { agentId },
		});
		expect(typeof result.maxLimitReached).toBe('boolean');
		expect(Array.isArray(result.containers)).toBe(true);
	});

	it('fetches the current user', async () => {
		const key = LIVE_KEY ?? '';
		const me = await makePhantomBusterRequest<{ sessionId: string }>(
			'/users/fetch-me',
			key,
		);
		expect(typeof me.sessionId).toBe('string');
	});

	it('fetches the current organization', async () => {
		const key = LIVE_KEY ?? '';
		const org = await makePhantomBusterRequest<Record<string, unknown>>(
			'/orgs/fetch',
			key,
		);
		expect(typeof org).toBe('object');
		expect(org).not.toBeNull();
	});

	it('fetches organization resources', async () => {
		const key = LIVE_KEY ?? '';
		const resources = await makePhantomBusterRequest<Record<string, unknown>>(
			'/orgs/fetch-resources',
			key,
		);
		expect(typeof resources).toBe('object');
		expect(resources).not.toBeNull();
	});

	it('fetches agent groups', async () => {
		const key = LIVE_KEY ?? '';
		const groups = await makePhantomBusterRequest<unknown[]>(
			'/orgs/fetch-agent-groups',
			key,
		);
		expect(Array.isArray(groups)).toBe(true);
	});

	it('fetches running containers', async () => {
		const key = LIVE_KEY ?? '';
		const running = await makePhantomBusterRequest<{ containers: unknown[] }>(
			'/orgs/fetch-running-containers',
			key,
		);
		expect(Array.isArray(running.containers)).toBe(true);
	});

	it('fetches scripts', async () => {
		const key = LIVE_KEY ?? '';
		const scripts = await makePhantomBusterRequest<unknown[]>(
			'/scripts/fetch-all',
			key,
		);
		expect(Array.isArray(scripts)).toBe(true);
	});

	it('fetches lead lists as a bare array (live-verified shape)', async () => {
		const key = LIVE_KEY ?? '';
		const lists = await makePhantomBusterRequest<unknown[]>(
			'/org-storage/lists/fetch-all',
			key,
		);
		expect(Array.isArray(lists)).toBe(true);
	});

	it('geolocates an IP address', async () => {
		const key = LIVE_KEY ?? '';
		const location = await makePhantomBusterRequest<{ country: string }>(
			'/location/ip',
			key,
			{ method: 'GET', query: { ip: '8.8.8.8' } },
		);
		expect(typeof location.country).toBe('string');
	});
});
