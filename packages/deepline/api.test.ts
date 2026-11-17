import { createCorsair } from 'corsair/core';
import { deepline } from './index';

// Deliberately free reads only. Dispatch tests use mocked HTTP in CI.
const key = process.env.DEEPLINE_API_KEY;
const hasKey = Boolean(key?.trim());
if (!hasKey)
	console.warn(
		'Skipping Deepline live API tests: DEEPLINE_API_KEY is not set.',
	);
const live = hasKey ? describe : describe.skip;
live('Deepline live read-only API', () => {
	const api = createCorsair({
		plugins: [deepline({ key, permissions: { mode: 'readonly' } })],
	}).deepline.api;
	jest.setTimeout(60000);
	it('checks runtime health', async () => {
		expect((await api.health.get({})).status).toBe('ok');
	});
	it('lists and describes a known free tool without executing it', async () => {
		const result = await api.tools.list({
			grep: 'free_simple_company_search',
			compact: true,
		});
		expect(
			result.tools.some((t) => t.toolId === 'free_simple_company_search'),
		).toBe(true);
		const tool = await api.tools.get({ toolId: 'free_simple_company_search' });
		expect(tool.toolId).toBe('free_simple_company_search');
	});
	it('searches tools and the combined catalog', async () => {
		expect(
			(await api.tools.search({ q: 'company search', limit: 2 })).tools.length,
		).toBeGreaterThan(0);
		expect(
			(
				await api.search.query({
					q: 'company search',
					types: 'tools',
					limit: 2,
				})
			).results.length,
		).toBeGreaterThan(0);
	});
	it('paginates and describes Plays', async () => {
		const first = await api.plays.list({ summary_only: '1', limit: 2 });
		expect(first.plays.length).toBeLessThanOrEqual(2);
		expect(first.plays.length).toBeGreaterThan(0);
		const selected = first.plays[0]!;
		const detail = await api.plays.get({
			name: selected.reference ?? selected.name,
		});
		expect([selected.name, selected.reference]).toContain(detail.play.name);
		if (first.hasMore && first.cursor) {
			const second = await api.plays.list({
				summary_only: '1',
				limit: 2,
				cursor: first.cursor,
			});
			expect(second.plays.length).toBeLessThanOrEqual(2);
			expect(second.plays[0]?.name).not.toBe(selected.name);
		}
	});
	it('reads existing run history and daily activity', async () => {
		expect(Array.isArray((await api.runs.history({ limit: 1 })).runs)).toBe(
			true,
		);
		expect(
			(await api.plays.activity({ days: 1, timeZone: 'UTC' })).buckets,
		).toHaveLength(1);
	});
	it('reads billing without changing it', async () => {
		expect(typeof (await api.billing.entitlements({})).org_id).toBe('string');
		expect(typeof (await api.billing.balance({})).balance).toBe('number');
		expect((await api.billing.balance({ view: 'pill' })).view).toBe('pill');
		expect(
			Array.isArray(
				(await api.billing.usage({ recent_limit: 1 })).recent.entries,
			),
		).toBe(true);
		expect(
			Array.isArray((await api.billing.ledger({ limit: 1 })).entries),
		).toBe(true);
	});
	it('reads Play cost, versions, paths and trigger inventory', async () => {
		const [play] = (await api.plays.list({ summary_only: '1', limit: 1 }))
			.plays;
		const reference = play!.reference ?? `prebuilt/${play!.name}`;
		expect(await api.plays.cost({ name: reference })).toBeTruthy();
		expect(
			Array.isArray(
				(await api.plays.versions.list({ name: reference })).versions,
			),
		).toBe(true);
		expect(Array.isArray((await api.plays.paths({ limit: 5 })).paths)).toBe(
			true,
		);
		expect(await api.plays.triggers.inventory({})).toBeTruthy();
	});
	it('reads run events, run lists and the customer database', async () => {
		expect(Array.isArray((await api.runs.events({ limit: 2 })).events)).toBe(
			true,
		);
		expect(
			Array.isArray((await api.runs.list({ status: 'completed' })).runs),
		).toBe(true);
	});
	it('reads providers, secrets metadata, members and auth status', async () => {
		expect((await api.tools.providers({})).providers.length).toBeGreaterThan(0);
		expect(Array.isArray((await api.secrets.list({})).secrets)).toBe(true);
		expect(Array.isArray((await api.workspace.members.list({})).members)).toBe(
			true,
		);
		expect(
			(await api.integrations.connectLink({ provider: 'hubspot' })).connect_url,
		).toEqual(expect.any(String));
		expect(await api.auth.status({})).toBeTruthy();
	});
	it('reads plans, billing status, auto-recharge and usage events', async () => {
		expect(typeof (await api.billing.status({})).org_id).toBe('string');
		expect(typeof (await api.billing.autoRecharge.get({})).enabled).toBe(
			'boolean',
		);
		expect(Array.isArray((await api.billing.plans({})).plans)).toBe(true);
		expect(typeof (await api.billing.subscription.status({})).subscribed).toBe(
			'boolean',
		);
		expect(
			Array.isArray((await api.billing.usageEvents({ limit: 2 })).entries),
		).toBe(true);
	});
	it('reads Monitors, the ledger and notification configuration', async () => {
		expect(typeof (await api.monitors.access({})).has_access).toBe('boolean');
		expect(Array.isArray((await api.monitors.list({})).monitors)).toBe(true);
		expect(Array.isArray((await api.monitors.available({})).tools)).toBe(true);
		expect(Array.isArray((await api.monitors.ledger.list({})).monitors)).toBe(
			true,
		);
		expect(await api.notifications.configuration.get({})).toBeTruthy();
		expect(
			Array.isArray((await api.notifications.dlq.list({})).deliveries),
		).toBe(true);
	});
});
