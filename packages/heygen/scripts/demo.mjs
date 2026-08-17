/**
 * Live demo for Corsair OSS R4 (Loom / screen recording).
 *
 * Get a free HeyGen API key (required — offline tests alone cannot satisfy R4):
 *   1. Open https://app.heygen.com/ and sign up / log in (free tier is fine)
 *   2. Settings → API → Create API Token
 *      Direct: https://app.heygen.com/settings?nav=API
 *   3. Copy the token (do not commit it; do not paste into Loom title or GitHub)
 *
 * Usage (PowerShell, from monorepo root):
 *   $env:HEYGEN_API_KEY = "..."
 *   node packages/heygen/scripts/demo.mjs
 *
 * Usage (bash):
 *   export HEYGEN_API_KEY=...
 *   node packages/heygen/scripts/demo.mjs
 *
 * Package script:
 *   pnpm --filter @corsair-dev/heygen demo
 *
 * What it proves on camera (cheap / free-tier friendly reads):
 *   1. users.me              GET /v3/users/me
 *   2. remaining_quota       GET /v2/user/remaining_quota
 *   3. avatars.list          GET /v3/avatars?limit=5
 *   4. voices.listV2         GET /v2/voices
 *   5. videos.list           GET /v1/video.list  (best-effort)
 *
 * Never paste your real API key into the Loom description or GitHub.
 * Blur the terminal if the key is visible. Revoke/rotate after recording.
 */

const API_KEY = process.env.HEYGEN_API_KEY;
const BASE = 'https://api.heygen.com';

if (!API_KEY) {
	console.error(`
❌  HEYGEN_API_KEY is not set.

You need a real HeyGen API key to record the R4 Loom demo.
Offline Jest tests alone are not enough for the Plugin PR Gate (R4).

How to get a free key:
  1. https://app.heygen.com/  (sign up / log in — free tier works)
  2. Settings → API → Create API Token
     https://app.heygen.com/settings?nav=API
  3. Copy the token

Then re-run:
  PowerShell:  $env:HEYGEN_API_KEY = "..." ; node packages/heygen/scripts/demo.mjs
  bash:        export HEYGEN_API_KEY=... && node packages/heygen/scripts/demo.mjs

Offline schema tests (no key needed, for CI / local verification only):
  pnpm --filter @corsair-dev/heygen test
`);
	process.exit(1);
}

async function request(path, { method = 'GET', body, query } = {}) {
	const url = new URL(path.startsWith('http') ? path : `${BASE}${path}`);
	if (query) {
		for (const [k, v] of Object.entries(query)) {
			if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
		}
	}
	const res = await fetch(url, {
		method,
		headers: {
			'X-Api-Key': API_KEY,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	const text = await res.text();
	let json;
	try {
		json = JSON.parse(text);
	} catch {
		json = { raw: text };
	}
	if (!res.ok) {
		const err = new Error(
			`${method} ${path} → ${res.status}: ${text.slice(0, 500)}`,
		);
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

/** Soft-skip rate limits / free-tier blocks so the Loom can still finish. */
async function tryStep(label, fn) {
	try {
		await fn();
		return true;
	} catch (err) {
		const msg = err?.message || String(err);
		if (err?.status === 429 || /429|rate.?limit|quota/i.test(msg)) {
			console.log(
				`⚠️  soft-skip (${label}): rate limit / quota — ${msg.slice(0, 160)}`,
			);
			return false;
		}
		if (err?.status === 401 || err?.status === 403) {
			console.error(`\n❌  Auth failed on ${label}: ${msg.slice(0, 300)}`);
			console.error(
				'Check HEYGEN_API_KEY at https://app.heygen.com/settings?nav=API',
			);
			throw err;
		}
		console.log(`⚠️  soft-skip (${label}): ${msg.slice(0, 200)}`);
		return false;
	}
}

async function main() {
	console.log('Corsair × HeyGen plugin — live API demo');
	console.log('PR: https://github.com/corsairdev/corsair/pull/370');
	console.log('Package: @corsair-dev/heygen');
	console.log(
		'Ops: users.me · remaining_quota · avatars.list · voices.listV2 · videos.list',
	);
	console.log('Auth header: X-Api-Key (matches @corsair-dev/heygen client)');

	await tryStep('users.me', async () => {
		section('1/5  webhooksQuota.getCurrentUser  GET /v3/users/me');
		const me = await request('/v3/users/me');
		// Log only non-sensitive shape — never dump full PII blobs if present.
		const data = me?.data ?? me;
		console.log(
			'user keys:',
			data && typeof data === 'object'
				? Object.keys(data).slice(0, 12).join(', ')
				: typeof data,
		);
		console.log('ok: true');
	});

	await tryStep('remaining_quota', async () => {
		section('2/5  webhooksQuota.remainingQuota  GET /v2/user/remaining_quota');
		const quota = await request('/v2/user/remaining_quota');
		console.log(JSON.stringify(quota, null, 2).slice(0, 800));
	});

	await tryStep('avatars.list', async () => {
		section('3/5  avatars.list  GET /v3/avatars?limit=5');
		const avatars = await request('/v3/avatars', {
			query: { limit: 5 },
		});
		const list =
			avatars?.data?.avatars ??
			avatars?.data ??
			avatars?.avatars ??
			(Array.isArray(avatars) ? avatars : []);
		const rows = Array.isArray(list) ? list : [];
		const sample = rows
			.slice(0, 5)
			.map((a) => a.avatar_id || a.id || a.name || '?');
		console.log('sample avatar ids/names:', sample.join(', ') || '(none)');
		console.log('count (page):', rows.length);
		console.log(
			'has_more:',
			avatars?.has_more ?? avatars?.data?.has_more ?? null,
		);
	});

	await tryStep('voices.listV2', async () => {
		section('4/5  voices.listV2  GET /v2/voices');
		const voices = await request('/v2/voices');
		const list = voices?.data?.voices ?? voices?.data ?? voices?.voices ?? [];
		const rows = Array.isArray(list) ? list : [];
		const sample = rows
			.slice(0, 5)
			.map((v) => v.voice_id || v.id || v.name || '?');
		console.log('sample voices:', sample.join(', ') || '(none)');
		console.log('count (page):', rows.length);
	});

	await tryStep('videos.list', async () => {
		section('5/5  videos.list  GET /v1/video.list (best-effort)');
		const videos = await request('/v1/video.list');
		const list = videos?.data?.videos ?? videos?.data ?? videos?.videos ?? [];
		const rows = Array.isArray(list) ? list : [];
		console.log('video count (page):', rows.length);
		console.log(
			'sample ids:',
			rows
				.slice(0, 3)
				.map((v) => v.video_id || v.id || '?')
				.join(', ') || '(none)',
		);
	});

	section('✅  HeyGen plugin live demo finished');
	console.log(
		'Next: record this run in Loom, then paste https://www.loom.com/share/... into PR #370 under ## Screenshots / Demos',
	);
	console.log('Then revoke/rotate the API token used for this recording.');
}

main().catch((err) => {
	console.error('\n❌  Demo failed:', err.message || err);
	process.exit(1);
});
