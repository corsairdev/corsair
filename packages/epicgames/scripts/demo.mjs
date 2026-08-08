/**
 * Live demo for Corsair OSS R4 (Loom / screen recording).
 *
 * No Epic OAuth key required for Fortnite island list/metrics — the Fortnite
 * Data API is public (OpenAPI: https://api.fortnite.com/ecosystem/v1/docs).
 *
 * Optional OAuth (client-credentials) if you have one later:
 *   $env:EPIC_GAMES_ACCESS_TOKEN = "..."
 *
 * Optional Unreal Remote Control base (defaults to http://127.0.0.1:30010):
 *   $env:EPIC_REMOTE_CONTROL_BASE = "http://127.0.0.1:30010"
 *
 * Usage (from monorepo root):
 *   node packages/epicgames/scripts/demo.mjs
 *   pnpm --filter @corsair-dev/epicgames demo
 *
 * Offline schema tests (no network, no token):
 *   pnpm --filter @corsair-dev/epicgames test
 *
 * Live public network tests:
 *   $env:EPIC_GAMES_LIVE = "1"
 *   pnpm --filter @corsair-dev/epicgames test
 *
 * Never paste tokens into Loom titles or GitHub.
 */

const TOKEN =
	process.env.EPIC_GAMES_ACCESS_TOKEN ||
	process.env.EPICGAMES_ACCESS_TOKEN ||
	process.env.EPIC_ACCESS_TOKEN;
const ISLANDS_BASE = 'https://api.fortnite.com/ecosystem/v1';
const REMOTE_BASE =
	process.env.EPIC_REMOTE_CONTROL_BASE || 'http://127.0.0.1:30010';

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
		console.log(`⚠️  soft-skip (${label}): ${msg.slice(0, 200)}`);
		return false;
	}
}

async function islandsGet(path, query) {
	const url = new URL(`${ISLANDS_BASE}${path}`);
	if (query) {
		for (const [k, v] of Object.entries(query)) {
			if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
		}
	}
	const headers = {
		Accept: 'application/json',
	};
	// Fortnite Data API GETs work without auth; send Bearer only if you have a token.
	if (TOKEN) {
		headers.Authorization = `Bearer ${TOKEN}`;
	}
	const res = await fetch(url, { headers });
	const text = await res.text();
	if (!res.ok) {
		throw new Error(`${path} → ${res.status}: ${text.slice(0, 300)}`);
	}
	try {
		return JSON.parse(text);
	} catch {
		return { raw: text.slice(0, 200) };
	}
}

async function main() {
	console.log('Corsair × Epic Games plugin — live demo');
	console.log('Issue: https://github.com/corsairdev/corsair/issues/472');
	console.log('Package: @corsair-dev/epicgames');
	console.log(
		TOKEN
			? 'Auth: Bearer token present (optional for public island GETs)'
			: 'Auth: none — using public Fortnite Data API (no key required)',
	);

	await tryStep('islands.list', async () => {
		section('1/4  islands.list  GET /islands?size=5');
		const data = await islandsGet('/islands', { size: 5 });
		const rows = Array.isArray(data)
			? data
			: (data?.islands ?? data?.data ?? data?.items ?? []);
		console.log(
			'count (page):',
			Array.isArray(rows) ? rows.length : typeof data,
		);
		console.log(
			'sample keys:',
			data && typeof data === 'object'
				? Object.keys(data).slice(0, 8).join(', ')
				: typeof data,
		);
		if (Array.isArray(rows) && rows[0]) {
			console.log(
				'first island:',
				rows[0].code,
				'|',
				String(rows[0].title || '').slice(0, 60),
			);
		}

		if (Array.isArray(rows) && rows[0]?.code) {
			const code = rows[0].code;

			section('2/4  islands.get  GET /islands/{code}');
			const meta = await islandsGet(`/islands/${encodeURIComponent(code)}`);
			console.log('code:', meta?.code, 'title:', meta?.title);
			console.log(
				'tags:',
				Array.isArray(meta?.tags) ? meta.tags.join(', ') : meta?.tags,
			);

			section('3/4  islands.getPlays  GET /islands/{code}/metrics/day/plays');
			const plays = await islandsGet(
				`/islands/${encodeURIComponent(code)}/metrics/day/plays`,
			);
			console.log(
				'island',
				code,
				'plays intervals:',
				Array.isArray(plays?.intervals) ? plays.intervals.length : typeof plays,
			);
			if (Array.isArray(plays?.intervals) && plays.intervals[0]) {
				console.log('sample interval:', JSON.stringify(plays.intervals[0]));
			}
		}
	});

	await tryStep('remote OPTIONS (optional local UE)', async () => {
		section('4/4  remote.corsPreflight  OPTIONS /remote (optional)');
		const res = await fetch(`${REMOTE_BASE}/remote`, { method: 'OPTIONS' });
		console.log('status:', res.status, 'allow:', res.headers.get('allow'));
	});

	section('✅  Epic Games demo finished');
	console.log(
		'Record this terminal in Loom (islands.list + get + plays is enough for R4).',
	);
	console.log('Then open the PR with Screenshots / Demos + Closes #472');
}

main().catch((err) => {
	console.error('\n❌  Demo failed:', err.message || err);
	process.exit(1);
});
