export type HubEnvironmentSlug = 'development' | 'production';

export type DeliveryTransport = 'browser' | 'server';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export function isLoopbackUrl(url: string): boolean {
	try {
		const { hostname, protocol } = new URL(url);
		if (protocol !== 'http:' && protocol !== 'https:') return false;
		return LOOPBACK_HOSTS.has(hostname);
	} catch {
		return false;
	}
}

export function resolveDeliveryTransport(
	slug: HubEnvironmentSlug,
): DeliveryTransport {
	return slug === 'development' ? 'browser' : 'server';
}

export function usesBrowserDelivery(slug: HubEnvironmentSlug): boolean {
	return resolveDeliveryTransport(slug) === 'browser';
}

function parseIpv4Octets(
	host: string,
): [number, number, number, number] | null {
	const parts = host.split('.');
	if (parts.length !== 4) return null;
	const octets = parts.map((part) =>
		/^\d{1,3}$/.test(part) ? Number(part) : Number.NaN,
	);
	if (octets.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return null;
	return octets as [number, number, number, number];
}

// Hosts the Hub must never deliver to: loopback, private, link-local, and
// unspecified addresses. A production delivery URL that resolves to one of these
// turns Hub's outbound POST into an SSRF probe (cloud metadata at
// 169.254.169.254, internal services). ponytail: this is the literal-address
// layer only — a hostname that DNS-resolves to a private IP is caught at
// delivery time, not here (validation-time resolution can't stop rebinding).
export function isPrivateOrLoopbackHost(hostname: string): boolean {
	let host = hostname.toLowerCase();
	if (host.endsWith('.')) host = host.slice(0, -1);
	if (host === 'localhost') return true;

	if (host.startsWith('[') && host.endsWith(']')) {
		const v6 = host.slice(1, -1);
		if (v6 === '::' || v6 === '::1') return true;
		if (v6.startsWith('::ffff:')) return true; // IPv4-mapped — never a public host
		if (/^f[cd]/.test(v6)) return true; // fc00::/7 unique-local
		if (/^fe[89ab]/.test(v6)) return true; // fe80::/10 link-local
		return false;
	}

	const octets = parseIpv4Octets(host);
	if (!octets) return false; // a resolvable public hostname
	const [a, b] = octets;
	if (a === 0) return true; // 0.0.0.0/8, incl. the unspecified address
	if (a === 127) return true; // loopback 127.0.0.0/8
	if (a === 10) return true; // private 10.0.0.0/8
	if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata
	if (a === 172 && b >= 16 && b <= 31) return true; // private 172.16.0.0/12
	if (a === 192 && b === 168) return true; // private 192.168.0.0/16
	return false;
}

export function validateProductionDeliveryUrl(
	deliveryUrl: string,
): string | null {
	let parsed: URL;
	try {
		parsed = new URL(deliveryUrl);
	} catch {
		return 'Production delivery URL must be a full URL, e.g. https://your-app.com/api/corsair';
	}
	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
		return 'Production delivery URL must start with http:// or https://';
	}
	if (isPrivateOrLoopbackHost(parsed.hostname)) {
		return 'Production delivery URL must be a public URL, not localhost or a private/internal address';
	}
	return null;
}
