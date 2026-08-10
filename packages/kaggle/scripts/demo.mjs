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
 *   node packages/kaggle/scripts/demo.mjs
 *
 * Package: pnpm --filter @corsair-dev/kaggle demo
 *
 * Never paste secrets into Loom titles or GitHub. Blur the terminal if needed.
 */

const USER = process.env.KAGGLE_USERNAME;
const KEY = process.env.KAGGLE_KEY;
const COMBINED = process.env.KAGGLE_API_KEY;
const TOKEN = process.env.KAGGLE_API_TOKEN;
const CRED = COMBINED || (USER && KEY ? `${USER}:${KEY}` : undefined) || TOKEN;

const BASE = 'https://www.kaggle.com/api/v1';

if (!CRED) {
	console.error(`
❌  Missing Kaggle credentials.

Set one of:
  KAGGLE_USERNAME + KAGGLE_KEY
  KAGGLE_API_KEY=username:key
  KAGGLE_API_TOKEN=...

Then:
  node packages/kaggle/scripts/demo.mjs
`);
	process.exit(1);
}

function authHeader() {
	if (CRED.includes(':')) {
		const b64 = Buffer.from(CRED, 'utf8').toString('base64');
		return `Basic ${b64}`;
	}
	return `Bearer ${CRED}`;
}

async function request(path, { query } = {}) {
	const url = new URL(`${BASE}${path}`);
	if (query) {
		for (const [k, v] of Object.entries(query)) {
			if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
		}
	}
	const res = await fetch(url, {
		headers: {
			Authorization: authHeader(),
			Accept: 'application/json',
		},
	});
	const text = await res.text();
	let json;
	try {
		json = JSON.parse(text);
	} catch {
		json = { raw: text.slice(0, 200) };
	}
	if (!res.ok) {
		const err = new Error(`${path} → ${res.status}: ${text.slice(0, 300)}`);
		err.status = res.status;
		throw err;
	}
	return json;
}

function section(title) {
	console.log(`\n${'═'.repeat(60)}`);
	console.log(`  ${title}`);
	console.log('═'.repeat(60));
}

async function tryStep(label, fn) {
	try {
		await fn();
		return true;
	} catch (err) {
		const msg = err?.message || String(err);
		if (err?.status === 429 || /429|rate/i.test(msg)) {
			console.log(`⚠️  soft-skip (${label}): rate limit`);
			return false;
		}
		if (err?.status === 401 || err?.status === 403) {
			console.log(`⚠️  soft-skip (${label}): ${msg.slice(0, 160)}`);
			return false;
		}
		console.log(`⚠️  soft-skip (${label}): ${msg.slice(0, 200)}`);
		return false;
	}
}

async function main() {
	console.log('Corsair × Kaggle plugin — live API demo');
	console.log('PR issue: https://github.com/corsairdev/corsair/issues/470');
	console.log('Package: @corsair-dev/kaggle');
	console.log(
		'Ops: competitions.list · datasets.list · kernels.list · models.list',
	);

	await tryStep('competitions.list', async () => {
		section('1/4  competitions.list  GET /competitions/list');
		const data = await request('/competitions/list', { query: { page: 1 } });
		const rows = Array.isArray(data)
			? data
			: (data?.list ?? data?.results ?? []);
		console.log(
			'count (page):',
			Array.isArray(rows) ? rows.length : typeof data,
		);
		console.log(
			'sample:',
			Array.isArray(rows)
				? rows
						.slice(0, 3)
						.map((c) => c.ref || c.id || c.title || '?')
						.join(', ')
				: JSON.stringify(data).slice(0, 200),
		);
	});

	await tryStep('datasets.list', async () => {
		section('2/4  datasets.list  GET /datasets/list');
		const data = await request('/datasets/list', { query: { page: 1 } });
		const rows = Array.isArray(data)
			? data
			: (data?.list ?? data?.results ?? []);
		console.log(
			'count (page):',
			Array.isArray(rows) ? rows.length : typeof data,
		);
	});

	await tryStep('kernels.list', async () => {
		section('3/4  kernels.list  GET /kernels/list');
		const data = await request('/kernels/list', {
			query: { page: 1, pageSize: 5 },
		});
		const rows = Array.isArray(data)
			? data
			: (data?.list ?? data?.results ?? []);
		console.log(
			'count (page):',
			Array.isArray(rows) ? rows.length : typeof data,
		);
	});

	await tryStep('models.list', async () => {
		section('4/4  models.list  GET /models/list');
		const data = await request('/models/list', { query: { pageSize: 5 } });
		const rows = Array.isArray(data)
			? data
			: (data?.list ?? data?.results ?? []);
		console.log(
			'count (page):',
			Array.isArray(rows) ? rows.length : typeof data,
		);
	});

	section('✅  Kaggle plugin live demo finished');
	console.log(
		'Next: record in Loom, paste https://www.loom.com/share/... under Screenshots / Demos on the PR',
	);
}

main().catch((err) => {
	console.error('\n❌  Demo failed:', err.message || err);
	process.exit(1);
});
