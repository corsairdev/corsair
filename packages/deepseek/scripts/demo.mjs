/**
 * Live demo for Corsair OSS R4 (Loom / screen recording).
 *
 * Get a free API key (required — offline tests cannot satisfy R4):
 *   1. Open https://platform.deepseek.com/
 *   2. Sign up / log in
 *   3. API Keys → Create key
 *   4. Top up if the free tier requires balance (often a small amount)
 *
 * Usage (from monorepo root, PowerShell):
 *   $env:DEEPSEEK_API_KEY = "sk-..."
 *   node packages/deepseek/scripts/demo.mjs
 *
 * Usage (bash):
 *   export DEEPSEEK_API_KEY=sk-...
 *   node packages/deepseek/scripts/demo.mjs
 *
 * Package script:
 *   pnpm --filter @corsair-dev/deepseek demo
 *
 * What it proves on camera (all 4 plugin ops):
 *   1. models.list
 *   2. user.getBalance
 *   3. chat.createCompletion (deepseek-chat)
 *   4. anthropic.createMessage
 *
 * Never paste your real API key into the Loom description or GitHub.
 * Blur the terminal if the key is visible.
 */

const API_KEY = process.env.DEEPSEEK_API_KEY;
const BASE = 'https://api.deepseek.com';

if (!API_KEY) {
	console.error(`
❌  DEEPSEEK_API_KEY is not set.

You need a real DeepSeek API key to record the R4 Loom demo.
Offline Jest tests alone are not enough for the Plugin PR Gate (R4).

How to get a key (free tier available):
  1. https://platform.deepseek.com/
  2. Sign up / log in
  3. API Keys → Create API key
  4. Copy the key (starts with sk-...)

Then re-run:
  PowerShell:  $env:DEEPSEEK_API_KEY = "sk-..." ; node packages/deepseek/scripts/demo.mjs
  bash:        export DEEPSEEK_API_KEY=sk-... && node packages/deepseek/scripts/demo.mjs
`);
	process.exit(1);
}

async function request(path, { method = 'GET', body } = {}) {
	const res = await fetch(`${BASE}/${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${API_KEY}`,
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
		throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
	}
	return json;
}

function section(title) {
	console.log(`\n${'═'.repeat(60)}`);
	console.log(`  ${title}`);
	console.log('═'.repeat(60));
}

async function main() {
	console.log('Corsair × DeepSeek plugin — live API demo');
	console.log('PR: https://github.com/corsairdev/corsair/pull/341');
	console.log('Package: @corsair-dev/deepseek');
	console.log(
		'Ops: models.list · user.getBalance · chat.createCompletion · anthropic.createMessage',
	);

	section('1/4  models.list  (DEEPSEEK_LIST_MODELS)');
	const models = await request('models');
	const ids = (models.data ?? []).map((m) => m.id);
	console.log('models:', ids.join(', ') || '(none)');
	console.log('count:', ids.length);

	section('2/4  user.getBalance  (DEEPSEEK_GET_USER_BALANCE)');
	const balance = await request('user/balance');
	console.log(JSON.stringify(balance, null, 2));

	section('3/4  chat.createCompletion  (DEEPSEEK_CREATE_CHAT_COMPLETION)');
	const chat = await request('chat/completions', {
		method: 'POST',
		body: {
			model: 'deepseek-chat',
			messages: [
				{
					role: 'user',
					content: 'In one short sentence: what is Corsair for developers?',
				},
			],
			stream: false,
			max_tokens: 80,
		},
	});
	console.log('model:', chat.model);
	console.log('assistant:', chat.choices?.[0]?.message?.content);
	console.log('usage:', chat.usage);

	section('4/4  anthropic.createMessage  (DEEPSEEK_CREATE_ANTHROPIC_MESSAGE)');
	const msg = await request('anthropic/v1/messages', {
		method: 'POST',
		body: {
			model: 'deepseek-chat',
			max_tokens: 64,
			messages: [{ role: 'user', content: 'Reply with exactly: deepseek-ok' }],
			stream: false,
		},
	});
	console.log('id:', msg.id);
	console.log('content:', JSON.stringify(msg.content, null, 2));
	console.log('stop_reason:', msg.stop_reason);
	console.log('usage:', msg.usage);

	section('✅  All 4 DeepSeek operations succeeded');
	console.log(
		'Next: record this terminal run in Loom, then paste the https://www.loom.com/... link into PR #341 under ## Screenshots / Demos',
	);
}

main().catch((err) => {
	console.error('\n❌  Demo failed:', err.message || err);
	process.exit(1);
});
