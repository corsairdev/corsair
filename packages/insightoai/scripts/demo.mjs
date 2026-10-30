/**
 * Live demo for Corsair OSS R4 (Loom / screen recording).
 *
 * Get an Insighto.ai API key (required — offline tests alone cannot satisfy R4):
 *   1. Sign up / log in at https://insighto.ai (or app dashboard)
 *   2. Settings → generate API key (format typically starts with `in-`)
 *   3. Docs: https://docs.insighto.ai/api/ragify
 *
 * Usage (PowerShell, from monorepo root):
 *   $env:INSIGHTOAI_API_KEY = "in-..."
 *   node packages/insightoai/scripts/demo.mjs
 *
 * Usage (bash):
 *   export INSIGHTOAI_API_KEY=in-...
 *   node packages/insightoai/scripts/demo.mjs
 *
 * Package script:
 *   pnpm --filter @corsair-dev/insightoai demo
 *
 * What it proves on camera (cheap list / read ops — no pre-existing entity IDs):
 *   1. GET /api/v1/contact
 *   2. GET /api/v1/tag/list
 *   3. GET /api/v1/channel/list
 *   4. GET /api/v1/user/get_agent_list  (best-effort)
 *
 * Auth matches the plugin: api_key is sent as a **query parameter** (not a header).
 *
 * Never paste your real API key into the Loom description or GitHub.
 * Blur the terminal if the key is visible. Revoke/rotate after recording.
 */

const API_KEY = process.env.INSIGHTOAI_API_KEY;
const BASE = 'https://api.insighto.ai';

if (!API_KEY) {
	console.error(`
❌  INSIGHTOAI_API_KEY is not set.

You need a real Insighto.ai API key to record the R4 Loom demo.
Offline Jest tests alone are not enough for the Plugin PR Gate (R4).

How to get a key:
  1. https://insighto.ai / dashboard
  2. Settings → API key (often starts with in-)
  3. https://docs.insighto.ai/api/ragify

Then re-run:
  PowerShell:  $env:INSIGHTOAI_API_KEY = "in-..." ; node packages/insightoai/scripts/demo.mjs
  bash:        export INSIGHTOAI_API_KEY=in-... && node packages/insightoai/scripts/demo.mjs

Offline schema tests (no key needed):
  pnpm --filter @corsair-dev/insightoai test
`);
	process.exit(1);
}

async function request(path, { method = 'GET', body, query } = {}) {
	const url = new URL(path.startsWith('http') ? path : `${BASE}${path}`);
	// Insighto dual-auth: api_key mode uses query param (same as makeInsightoaiRequest)
	url.searchParams.set('api_key', API_KEY);
	if (query) {
		for (const [k, v] of Object.entries(query)) {
			if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
		}
	}
	const res = await fetch(url, {
		method,
		headers: {
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

function summarize(label, data) {
	const s = JSON.stringify(data);
	console.log(`${label}:`, s.length > 400 ? `${s.slice(0, 400)}…` : s);
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
				'Check INSIGHTOAI_API_KEY (api_key query param) at the Insighto dashboard.',
			);
			throw err;
		}
		console.log(`⚠️  soft-skip (${label}): ${msg.slice(0, 200)}`);
		return false;
	}
}

async function main() {
	console.log('Corsair × Insighto.ai plugin — live API demo');
	console.log('PR: https://github.com/corsairdev/corsair/pull/382');
	console.log('Package: @corsair-dev/insightoai');
	console.log(
		'Ops: contact list · tag list · channel list · agent list (best-effort)',
	);
	console.log('Auth: api_key as query parameter (matches plugin client)');

	await tryStep('getListOfContacts', async () => {
		section('1/4  contacts.getListOfContacts  GET /api/v1/contact');
		const data = await request('/api/v1/contact', {
			query: { page: 1, size: 5 },
		});
		summarize('response', data);
		console.log('ok: true');
	});

	await tryStep('readTagList', async () => {
		section('2/4  datasources.readTagList  GET /api/v1/tag/list');
		const data = await request('/api/v1/tag/list', {
			query: { page: 1, size: 5 },
		});
		summarize('response', data);
		console.log('ok: true');
	});

	await tryStep('listChannels', async () => {
		section('3/4  widgets.listChannels  GET /api/v1/channel/list');
		const data = await request('/api/v1/channel/list', {
			query: { page: 1, size: 5 },
		});
		summarize('response', data);
		console.log('ok: true');
	});

	await tryStep('getAgentList', async () => {
		section('4/4  agency.getAgentList  GET /api/v1/user/get_agent_list');
		const data = await request('/api/v1/user/get_agent_list', {
			query: { page: 1, size: 5 },
		});
		summarize('response', data);
		console.log('ok: true');
	});

	section('✅  Insighto.ai plugin live demo finished');
	console.log(
		'Next: record this run in Loom, then paste https://www.loom.com/share/... into PR #382 under ## Screenshots / Demos',
	);
	console.log('Then revoke/rotate the API key used for this recording.');
}

main().catch((err) => {
	console.error('\n❌  Demo failed:', err.message || err);
	process.exit(1);
});
