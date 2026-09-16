export interface CloudConfig {
	url: string;
	key: string;
}

export interface CloudOpTree {
	[plugin: string]: string[];
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
