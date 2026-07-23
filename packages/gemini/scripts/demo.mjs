/**
 * Live demo for Corsair OSS R4 (Loom / screen recording).
 *
 * Get an API key:
 *   https://aistudio.google.com/apikey
 *
 * Usage (PowerShell, from monorepo root):
 *   $env:GEMINI_API_KEY = "..."
 *   node packages/gemini/scripts/demo.mjs
 *
 * Package script:
 *   pnpm --filter @corsair-dev/gemini demo
 *
 * What it proves on camera:
 *   1. listModels
 *   2. countTokens
 *   3. generateContent
 *   4. generateImage (best-effort — model availability varies)
 *   5. generateVideos kickoff + getVideosOperation poll (does not wait for full render)
 *
 * Never paste your real API key into the Loom description or GitHub.
 * Blur the terminal if the key is visible. Revoke after recording.
 */

const API_KEY = process.env.GEMINI_API_KEY;
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

if (!API_KEY) {
	console.error(`
❌  GEMINI_API_KEY is not set.

Get a free key: https://aistudio.google.com/apikey

Then re-run:
  PowerShell:  $env:GEMINI_API_KEY = "..." ; node packages/gemini/scripts/demo.mjs
  bash:        export GEMINI_API_KEY=... && node packages/gemini/scripts/demo.mjs
`);
	process.exit(1);
}

async function request(path, { method = 'GET', body } = {}) {
	const url = path.startsWith('http')
		? path
		: `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
	const res = await fetch(url, {
		method,
		headers: {
			'x-goog-api-key': API_KEY,
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
		throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 500)}`);
	}
	return json;
}

function section(title) {
	console.log(`\n${'═'.repeat(60)}`);
	console.log(`  ${title}`);
	console.log('═'.repeat(60));
}

async function main() {
	console.log('Corsair × Gemini plugin — live API demo');
	console.log('PR: https://github.com/corsairdev/corsair/pull/343');
	console.log('Package: @corsair-dev/gemini');
	console.log(
		'Ops: listModels · countTokens · generateContent · generateImage · videos LRO',
	);

	section('1/5  models.listModels  (GEMINI_LIST_MODELS)');
	const models = await request('/models');
	const names = (models.models ?? []).slice(0, 8).map((m) => m.name);
	console.log('sample models:', names.join(', ') || '(none)');
	console.log('count:', (models.models ?? []).length);

	section('2/5  content.countTokens  (GEMINI_COUNT_TOKENS)');
	const tokens = await request('/models/gemini-2.5-flash:countTokens', {
		method: 'POST',
		body: {
			contents: [{ role: 'user', parts: [{ text: 'Hello, Gemini!' }] }],
		},
	});
	console.log(JSON.stringify(tokens, null, 2));

	section('3/5  content.generateContent  (GEMINI_GENERATE_CONTENT)');
	const chat = await request('/models/gemini-2.5-flash:generateContent', {
		method: 'POST',
		body: {
			contents: [
				{
					role: 'user',
					parts: [
						{
							text: 'In one short sentence: what is Corsair for developers?',
						},
					],
				},
			],
		},
	});
	const text =
		chat.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text ??
		'(no text)';
	console.log('assistant:', text);

	section('4/5  images.generateImage  (GEMINI_GENERATE_IMAGE)');
	// Prefer current Nano Banana / flash-image models listed by the account.
	const imageModels = [
		'gemini-2.5-flash-image',
		'gemini-3.1-flash-image-preview',
		'gemini-3-pro-image-preview',
	];
	let imageOk = false;
	for (const model of imageModels) {
		try {
			const img = await request(`/models/${model}:generateContent`, {
				method: 'POST',
				body: {
					contents: [
						{
							role: 'user',
							parts: [{ text: 'A simple blue square icon, no text' }],
						},
					],
					generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
				},
			});
			const parts = img.candidates?.[0]?.content?.parts ?? [];
			const hasImage = parts.some((p) => p.inlineData?.data);
			console.log('model:', model);
			console.log('has_inline_image:', hasImage);
			console.log(
				'parts_types:',
				parts
					.map((p) => (p.inlineData ? 'image' : p.text ? 'text' : 'other'))
					.join(', '),
			);
			imageOk = true;
			break;
		} catch (err) {
			console.log(`try ${model}:`, err.message.slice(0, 120));
		}
	}
	if (!imageOk) console.log('image generation failed for all tried models');

	section('5/5  videos.generateVideos + getVideosOperation (kickoff only)');
	const videoModels = [
		'veo-3.1-fast-generate-preview',
		'veo-3.1-generate-preview',
		'veo-2.0-generate-001',
	];
	let videoOk = false;
	for (const model of videoModels) {
		try {
			const op = await request(`/models/${model}:predictLongRunning`, {
				method: 'POST',
				body: {
					instances: [{ prompt: 'A calm ocean at sunrise, short clip' }],
				},
			});
			console.log('model:', model);
			console.log('operation name:', op.name);
			console.log('done:', op.done ?? false);
			if (op.name) {
				const status = await request(`/${op.name}`, { method: 'GET' });
				console.log('poll done:', status.done ?? false);
				console.log('poll error:', status.error ?? null);
			}
			videoOk = true;
			break;
		} catch (err) {
			console.log(`try ${model}:`, err.message.slice(0, 120));
		}
	}
	if (!videoOk) console.log('video LRO failed for all tried models');

	section('✅  Gemini plugin live demo finished');
	console.log(
		'Next: record this run in Loom, then paste https://www.loom.com/share/... into PR #343 under ## Screenshots / Demos',
	);
	console.log('Then revoke the API key used for this recording.');
}

main().catch((err) => {
	console.error('\n❌  Demo failed:', err.message || err);
	process.exit(1);
});
