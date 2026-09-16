export interface CloudConfig {
	url: string;
	key: string;
}

export interface CloudOpTree {
	[plugin: string]: string[];
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

// The cloud key is sent as a bearer token, so http:// would leak it in
// cleartext — allowed only for loopback, matching the reference client.
function assertSecureCloudUrl(url: string): void {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error(`Corsair Cloud URL is not a valid URL: "${url}"`);
	}
	if (parsed.protocol === 'https:') return;
	if (parsed.protocol === 'http:' && LOOPBACK_HOSTS.has(parsed.hostname)) {
		return;
	}
	throw new Error(
		`Corsair Cloud URL must use https:// (got "${url}") — http:// is only allowed for localhost/127.0.0.1.`,
	);
}

export function resolveCloudConfig(options: {
	url?: string;
	key?: string;
}): CloudConfig {
	const url = (options.url || process.env.CORSAIR_CLOUD_URL || '')
		.trim()
		.replace(/\/+$/, '');
	if (!url) {
		throw new Error(
			'Corsair Cloud URL required — pass --url or set CORSAIR_CLOUD_URL.',
		);
	}
	assertSecureCloudUrl(url);
	const key = (options.key || process.env.CORSAIR_CLOUD_KEY || '').trim();
	if (!key) {
		throw new Error(
			'Corsair Cloud key required — pass --key or set CORSAIR_CLOUD_KEY.',
		);
	}
	return { url, key };
}

export async function fetchCloudOpTree(
	config: CloudConfig,
): Promise<CloudOpTree> {
	const res = await fetch(`${config.url}/call`, {
		headers: { authorization: `Bearer ${config.key}` },
	});
	if (!res.ok) {
		throw new Error(
			`Corsair Cloud discovery failed: ${res.status} ${res.statusText}`,
		);
	}
	const body = (await res.json()) as { plugins?: CloudOpTree };
	return body.plugins ?? {};
}
