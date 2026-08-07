/**
 * Live demo against public Hugging Face Hub APIs (no token required for list/get).
 *
 *   pnpm --filter @corsair-dev/huggingface demo
 *
 * Optional auth:
 *   $env:HUGGING_FACE_API_KEY = "hf_..."
 *   pnpm --filter @corsair-dev/huggingface demo
 */
import 'dotenv/config';

const TOKEN =
	process.env.HUGGING_FACE_API_KEY ||
	process.env.HF_TOKEN ||
	process.env.HUGGINGFACE_TOKEN ||
	'';

const headers = {
	Accept: 'application/json',
	...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function get(path, label) {
	const url = path.startsWith('http') ? path : `https://huggingface.co${path}`;
	console.log(`\n→ ${label}\n  GET ${url}`);
	const res = await fetch(url, { headers });
	const text = await res.text();
	let body;
	try {
		body = JSON.parse(text);
	} catch {
		body = text.slice(0, 300);
	}
	if (!res.ok) {
		console.log(`  ✗ ${res.status} ${res.statusText}`);
		console.log(
			' ',
			typeof body === 'string' ? body : JSON.stringify(body).slice(0, 400),
		);
		return null;
	}
	console.log(`  ✓ ${res.status}`);
	return body;
}

console.log('Hugging Face plugin demo');
console.log(TOKEN ? 'Auth: Bearer token set' : 'Auth: none (public GETs only)');

const models = await get('/api/models?limit=3&sort=downloads', 'models.list');
if (Array.isArray(models)) {
	console.log(
		'  models:',
		models
			.map((m) => m.id || m.modelId)
			.filter(Boolean)
			.slice(0, 3),
	);
}

const model = await get(
	'/api/models/openai-community/gpt2',
	'models.get openai-community/gpt2',
);
if (model && typeof model === 'object') {
	console.log('  id:', model.id || model.modelId);
	console.log('  downloads:', model.downloads);
	console.log('  tags:', (model.tags || []).slice(0, 5));
}

const datasets = await get(
	'/api/datasets?limit=2&sort=downloads',
	'datasets.list',
);
if (Array.isArray(datasets)) {
	console.log(
		'  datasets:',
		datasets
			.map((d) => d.id)
			.filter(Boolean)
			.slice(0, 2),
	);
}

const trending = await get('/api/trending?limit=3', 'trending.get');
if (trending) {
	console.log(
		'  trending keys:',
		typeof trending === 'object'
			? Object.keys(trending).slice(0, 8)
			: typeof trending,
	);
}

const splits = await get(
	'https://datasets-server.huggingface.co/splits?dataset=nyu-mll/glue',
	'datasets.listSplits (datasets-server)',
);
if (splits && typeof splits === 'object') {
	console.log('  splits sample:', JSON.stringify(splits).slice(0, 200));
}

if (TOKEN) {
	const me = await get('/api/whoami-v2', 'account.getWhoami');
	if (me && typeof me === 'object') {
		console.log('  name:', me.name);
		console.log('  type:', me.type);
	}
} else {
	console.log(
		'\n(skip whoami — set HUGGING_FACE_API_KEY for authenticated demo)',
	);
}

console.log('\nDemo complete.');
