/**
 * Live demo against Docker Hub public APIs (no token required for library/*).
 *
 *   pnpm --filter @corsair-dev/dockerhub demo
 *
 * Optional:
 *   $env:DOCKER_HUB_TOKEN = "dckr_pat_..."
 */
const TOKEN = process.env.DOCKER_HUB_TOKEN || process.env.DOCKERHUB_TOKEN || '';

const headers = {
	Accept: 'application/json',
	...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function get(path, label) {
	const url = path.startsWith('http')
		? path
		: `https://hub.docker.com/v2${path}`;
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

console.log('Docker Hub plugin demo');
console.log(TOKEN ? 'Auth: Bearer token set' : 'Auth: none (public GETs only)');

const repo = await get(
	'/repositories/library/hello-world/',
	'repositories.get library/hello-world',
);
if (repo && typeof repo === 'object') {
	console.log('  name:', repo.name);
	console.log('  star_count:', repo.star_count);
	console.log('  pull_count:', repo.pull_count);
}

const tags = await get(
	'/repositories/library/hello-world/tags?page_size=3',
	'tags.list library/hello-world',
);
if (tags?.results) {
	console.log(
		'  tags:',
		tags.results
			.map((t) => t.name)
			.filter(Boolean)
			.slice(0, 5),
	);
}

const alpine = await get(
	'/repositories/library/alpine/tags?page_size=2',
	'tags.list library/alpine (for images.list source)',
);
if (alpine?.results?.[0]?.images) {
	const digests = alpine.results[0].images
		.map((i) => i.digest)
		.filter(Boolean)
		.slice(0, 3);
	console.log('  sample digests:', digests);
}

if (TOKEN) {
	const orgs = await get('/user/orgs/?page_size=5', 'organizations.list');
	if (orgs) {
		console.log(
			'  orgs:',
			Array.isArray(orgs.results)
				? orgs.results.map((o) => o.orgname || o.username).slice(0, 5)
				: Object.keys(orgs).slice(0, 5),
		);
	}
} else {
	console.log(
		'\n(skip organizations.list — set DOCKER_HUB_TOKEN for authenticated demo)',
	);
}

console.log('\nDemo complete.');
