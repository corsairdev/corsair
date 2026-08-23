import { getTypes } from './endpoints/data';
import { getByokPlatform, getPlatform } from './endpoints/intelligence';
import { getBulk as getBulkMemory, getChangelog } from './endpoints/memory';
import {
	getClient as sandboxClient,
	engagementAnalysis as sandboxEngagement,
	getMemory as sandboxMemory,
	validate as sandboxValidate,
} from './endpoints/sandbox';
import {
	getComponents,
	getHistory,
	getIncidents,
	get as getStatus,
	getUptime,
	ping,
} from './endpoints/status';
import { list as listWebhooks } from './endpoints/webhooks';
import type { CrowterminalContext } from './index';

// Hits the real CrowTerminal API. CI skips this file by name
// (--testPathIgnorePatterns="api\.test\.ts"); run it with:
//
//   CROWTERMINAL_API_KEY=ct_... pnpm test:live
//
// Only read-only operations run here. Registering an agent, ingesting data and
// creating or deleting webhooks all change real state, so they are left out.

const apiKey = process.env.CROWTERMINAL_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

describeLive('CrowTerminal API', () => {
	const ctx = () => ({ key: apiKey }) as unknown as CrowterminalContext;

	describe('status', () => {
		it('reports service health', async () => {
			const result = await getStatus(ctx(), {});
			expect(typeof result.status).toBe('string');
		}, 30_000);

		it('answers a ping', async () => {
			await expect(ping(ctx(), {})).resolves.toMatchObject({ pong: true });
		}, 30_000);

		it.each([
			['components', getComponents],
			['incidents', getIncidents],
			['history', getHistory],
			['uptime', getUptime],
		])(
			'returns %s',
			async (_name, endpoint) => {
				await expect(
					(
						endpoint as (c: CrowterminalContext, i: unknown) => Promise<unknown>
					)(ctx(), {}),
				).resolves.toBeDefined();
			},
			30_000,
		);
	});

	describe('reference data', () => {
		it('lists data types for all three platforms', async () => {
			const result = await getTypes(ctx(), {});
			expect(Object.keys(result.dataTypes)).toEqual(
				expect.arrayContaining(['TIKTOK', 'INSTAGRAM', 'YOUTUBE']),
			);
		}, 30_000);

		it.each([
			['platform intel', getPlatform],
			['byok platform intel', getByokPlatform],
		])(
			'returns %s',
			async (_name, endpoint) => {
				await expect(
					(
						endpoint as (c: CrowterminalContext, i: unknown) => Promise<unknown>
					)(ctx(), {}),
				).resolves.toBeDefined();
			},
			30_000,
		);
	});

	describe('sandbox', () => {
		it('returns a mock client and mock memory', async () => {
			await expect(sandboxClient(ctx(), {})).resolves.toHaveProperty(
				'clientId',
			);
			await expect(sandboxMemory(ctx(), {})).resolves.toHaveProperty(
				'clientId',
			);
		}, 30_000);

		it('runs a mock engagement analysis', async () => {
			const result = await sandboxEngagement(ctx(), {
				agentMd: { hookPatterns: ['confession'] },
			});
			expect(result.versionsAnalyzed).toEqual(expect.any(Number));
		}, 30_000);

		// The documented way to force a blocked result is a change to "tutorial".
		it('blocks a change the sandbox knows performed badly', async () => {
			const result = await sandboxValidate(ctx(), {
				proposedChanges: [
					{ field: 'hookPatterns', oldValue: 'story', newValue: 'tutorial' },
				],
			});
			expect(result.validation).toBe('blocked');
			expect(result.warnings.length).toBeGreaterThan(0);
		}, 30_000);
	});

	describe('account-scoped reads', () => {
		it('lists webhooks for this key', async () => {
			await expect(listWebhooks(ctx(), {})).resolves.toHaveProperty('webhooks');
		}, 30_000);

		it('reads a changelog for an unknown client without failing', async () => {
			await expect(
				getChangelog(ctx(), { clientId: 'corsair-live-test' }),
			).resolves.toHaveProperty('changelog');
		}, 30_000);

		it('reads several clients in one bulk call', async () => {
			const result = await getBulkMemory(ctx(), {
				clientIds: ['corsair-live-a', 'corsair-live-b'],
			});
			expect(result.clients).toHaveLength(2);
		}, 30_000);
	});

	describe('failure modes', () => {
		it('rejects an invalid api key', async () => {
			const bad = { key: 'ct_invalid' } as unknown as CrowterminalContext;
			await expect(listWebhooks(bad, {})).rejects.toThrow();
		}, 30_000);
	});
});

if (!apiKey) {
	it('skips the live suite without CROWTERMINAL_API_KEY', () => {
		expect(apiKey).toBeUndefined();
	});
}
