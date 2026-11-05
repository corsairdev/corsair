/**
 * Live demo for Corsair OSS R4 (Loom / screen recording).
 *
 * Working proof (R4) already on PR #471 Screenshots / Demos:
 *   https://www.loom.com/share/b0d541fa2dd14e3a9340f4a94b3ff4ea
 *
 * Credentials (pick one):
 *   - Legacy: KAGGLE_USERNAME + KAGGLE_KEY
 *   - Combined: KAGGLE_API_KEY = "username:key"
 *   - Token:   KAGGLE_API_TOKEN
 *
 * Usage (PowerShell, monorepo root):
 *   $env:KAGGLE_USERNAME = "..."
 *   $env:KAGGLE_KEY = "..."
 *   pnpm --filter @corsair-dev/kaggle demo
 *
 * Never paste secrets into Loom titles or GitHub. Blur the terminal if needed.
 */

import type { KaggleEndpoints } from '../index';
import { kaggle } from '../index';

const USER = process.env.KAGGLE_USERNAME;
const KEY = process.env.KAGGLE_KEY;
const COMBINED = process.env.KAGGLE_API_KEY;
const TOKEN = process.env.KAGGLE_API_TOKEN;
const CRED = COMBINED || (USER && KEY ? `${USER}:${KEY}` : undefined) || TOKEN;

if (!CRED) {
	console.error(`
Missing Kaggle credentials.

Set one of:
  KAGGLE_USERNAME + KAGGLE_KEY
  KAGGLE_API_KEY=username:key
  KAGGLE_API_TOKEN=...

Then:
  pnpm --filter @corsair-dev/kaggle demo
`);
	process.exit(1);
}

type HandlerCtx = Parameters<KaggleEndpoints['competitionsList']>[0];

const plugin = kaggle({
	key: CRED,
	username: USER,
});

function ctx(key: string): HandlerCtx {
	const partial = {
		key,
		db: {},
		authType: 'api_key' as const,
		options: plugin.options,
		keys: {
			get_api_key: async () => key,
			get_access_token: async () => key,
		},
	};
	return partial as unknown as HandlerCtx;
}

function section(title: string) {
	console.log(`\n${'='.repeat(60)}`);
	console.log(`  ${title}`);
	console.log('='.repeat(60));
}

function sampleRefs(data: unknown): string {
	const rows = Array.isArray(data)
		? data
		: ((data as { list?: unknown[]; results?: unknown[] } | null)?.list ??
			(data as { results?: unknown[] } | null)?.results ??
			[]);
	if (!Array.isArray(rows)) return JSON.stringify(data).slice(0, 200);
	return rows
		.slice(0, 3)
		.map((row) => {
			const rec = row as { ref?: string; id?: string; title?: string };
			return rec.ref || rec.id || rec.title || '?';
		})
		.join(', ');
}

async function tryStep(label: string, fn: () => Promise<void>) {
	try {
		await fn();
		return true;
	} catch (err) {
		const error = err as { message?: string; status?: number };
		const msg = error?.message || String(err);
		if (error?.status === 429 || /429|rate/i.test(msg)) {
			console.log(`soft-skip (${label}): rate limit`);
			return false;
		}
		console.log(`soft-skip (${label}): ${msg.slice(0, 200)}`);
		return false;
	}
}

async function main() {
	console.log('Corsair x Kaggle plugin — live API demo');
	console.log('PR issue: https://github.com/corsairdev/corsair/issues/470');
	console.log('Package: @corsair-dev/kaggle');
	console.log(
		'Ops: competitions.list · datasets.list · kernels.list · models.list',
	);

	const key = await plugin.keyBuilder(
		{
			authType: 'api_key',
			keys: {
				get_api_key: async () => CRED,
				get_access_token: async () => CRED,
			},
		} as never,
		'endpoint',
	);
	const handlerCtx = ctx(key);

	await tryStep('competitions.list', async () => {
		section('1/4  competitions.list  GET /competitions/list');
		const data = await plugin.endpoints.competitions.list(handlerCtx, {
			page: 1,
		});
		const rows = Array.isArray(data)
			? data
			: ((data as { list?: unknown[]; results?: unknown[] })?.list ??
				(data as { results?: unknown[] })?.results ??
				[]);
		console.log(
			'count (page):',
			Array.isArray(rows) ? rows.length : typeof data,
		);
		console.log('sample:', sampleRefs(data));
	});

	await tryStep('datasets.list', async () => {
		section('2/4  datasets.list  GET /datasets/list');
		const data = await plugin.endpoints.datasets.list(handlerCtx, { page: 1 });
		const rows = Array.isArray(data)
			? data
			: ((data as { list?: unknown[]; results?: unknown[] })?.list ??
				(data as { results?: unknown[] })?.results ??
				[]);
		console.log(
			'count (page):',
			Array.isArray(rows) ? rows.length : typeof data,
		);
	});

	await tryStep('kernels.list', async () => {
		section('3/4  kernels.list  GET /kernels/list');
		const data = await plugin.endpoints.kernels.list(handlerCtx, {
			page: 1,
			pageSize: 5,
		});
		const rows = Array.isArray(data)
			? data
			: ((data as { list?: unknown[]; results?: unknown[] })?.list ??
				(data as { results?: unknown[] })?.results ??
				[]);
		console.log(
			'count (page):',
			Array.isArray(rows) ? rows.length : typeof data,
		);
	});

	await tryStep('models.list', async () => {
		section('4/4  models.list  GET /models/list');
		const data = await plugin.endpoints.models.list(handlerCtx, {
			pageSize: 5,
		});
		const rows = Array.isArray(data)
			? data
			: ((data as { list?: unknown[]; results?: unknown[] })?.list ??
				(data as { results?: unknown[] })?.results ??
				[]);
		console.log(
			'count (page):',
			Array.isArray(rows) ? rows.length : typeof data,
		);
	});

	section('Kaggle plugin live demo finished');
}

main().catch((err) => {
	console.error('\nDemo failed:', (err as Error).message || err);
	process.exit(1);
});
