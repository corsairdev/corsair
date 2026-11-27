import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { defillamaOperations } from './endpoints/manifest';
import { defillama } from './index';

/**
 * Live run of every free route (no key) against DefiLlama's free hosts:
 *
 *   DEFILLAMA_LIVE=1 DEFILLAMA_LIVE_REPORT=/tmp/report.json npx jest api.test.ts
 *
 * Pro-only routes need a DefiLlama Pro key (a paid plan) and are not run;
 * endpoints.test.ts covers their URLs against a mocked fetch. With
 * DEFILLAMA_API_KEY set, the Pro routes run too. Skipped unless
 * DEFILLAMA_LIVE is set (CI never runs files named api.test.ts).
 */
const live = Boolean(process.env.DEFILLAMA_LIVE);
if (!live) console.warn('Skipping DefiLlama live run: set DEFILLAMA_LIVE=1.');
const describeIf = live ? describe : describe.skip;
const proKey = process.env.DEFILLAMA_API_KEY;

type Result = { ok: boolean; expected?: string; error?: string };
// `any` because the live run walks responses of many operations by field name.
type Json = any;

describeIf('defillama live', () => {
	jest.setTimeout(900_000);
	const results: Record<string, Result> = {};

	afterAll(() => {
		const ran = Object.keys(results);
		const report = {
			operations: defillamaOperations.length,
			ran: ran.length,
			ok: Object.values(results).filter((v) => v.ok && !v.expected).length,
			expected: Object.values(results).filter((v) => v.expected).length,
			failed: Object.values(results).filter((v) => !v.ok).length,
			notRun: defillamaOperations
				.map((o) => o.id)
				.filter((id) => !ran.includes(id)),
			results,
		};
		if (process.env.DEFILLAMA_LIVE_REPORT) {
			writeFileSync(
				process.env.DEFILLAMA_LIVE_REPORT,
				JSON.stringify(report, null, 2),
			);
		}
		console.log(
			`DefiLlama live: ${report.ran} ran, ${report.ok} ok, ${report.expected} expected errors, ${report.failed} failed`,
		);
	});

	it('runs every free route', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'defillama', 'default');
		const corsair = createCorsair({
			plugins: [defillama(proKey ? { key: proKey } : {})],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		const api = corsair.defillama.api as Json;
		const r = async (id: string, input: object = {}, expected?: RegExp) => {
			let node = api;
			for (const part of id.split('.')) node = node?.[part];
			try {
				const out = await node(input);
				results[id] = { ok: true };
				return out;
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				results[id] = expected?.test(message)
					? { ok: true, expected: message.slice(0, 160) }
					: { ok: false, error: message.slice(0, 300) };
				return undefined;
			}
		};

		// Ids to read with.
		const pools: Json = await r('yields.pools');
		const pool =
			pools?.data?.[0]?.pool ?? '747c1d2a-c668-4682-b9f9-296708a3dd90';
		// Bridges are Pro-only: discovered only with a key.
		const bridges: Json = proKey ? await r('bridges.list') : undefined;
		const bridgeId = bridges?.bridges?.[0]?.id ?? 1;
		const day = Math.floor(Date.now() / 1000) - 3 * 86_400;
		const inputs: Record<string, object> = {
			'yields.poolChart': { pool },
			'bridges.get': { id: bridgeId },
			'bridges.transactions': { id: bridgeId },
			'bridges.dayStats': { timestamp: day, chain: 'Ethereum' },
			'coins.block': { chain: 'Ethereum', timestamp: day },
			'coins.historical': { timestamp: day, coins: 'coingecko:ethereum' },
			'tvl.inflows': { protocol: 'aave', timestamp: day },
		};

		// `unknown` because example args are free-form YAML values.
		const docs = require('./plugin-docs.yaml') as {
			apiExamples: Record<string, { args: Record<string, unknown> }>;
		};
		for (const operation of defillamaOperations) {
			const { id } = operation;
			if (!operation.free && !proKey) continue;
			if (results[id]) continue;
			await r(id, inputs[id] ?? docs.apiExamples[id]?.args ?? {});
		}
		await testDb.cleanup?.();
	});

	it('records every result', () => {
		const failed = Object.entries(results).filter(([, v]) => !v.ok);
		expect(failed.map(([id, v]) => `${id}: ${v.error}`)).toEqual([]);
	});
});
