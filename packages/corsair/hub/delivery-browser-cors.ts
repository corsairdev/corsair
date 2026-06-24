const HUB_ORIGIN_SUFFIXES = ['.corsair.dev'] as const;

function isLoopbackHostname(hostname: string): boolean {
	return (
		hostname === 'localhost' ||
		hostname === '127.0.0.1' ||
		hostname === '[::1]' ||
		hostname === '::1'
	);
}

function isAllowedHubBrowserOrigin(origin: string): boolean {
	try {
		const { hostname, protocol } = new URL(origin);
		if (protocol !== 'http:' && protocol !== 'https:') return false;
		if (isLoopbackHostname(hostname)) return true;
		return HUB_ORIGIN_SUFFIXES.some(
			(suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix),
		);
	} catch {
		return false;
	}
}

export function resolveHubBrowserDeliveryCorsHeaders(
	origin: string | null,
): Record<string, string> | null {
	if (!origin || !isAllowedHubBrowserOrigin(origin)) {
		return null;
	}

	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers':
			'content-type, x-corsair-signature, x-corsair-timestamp, x-corsair-project, x-corsair-nonce, access-control-request-private-network',
		'Access-Control-Allow-Private-Network': 'true',
		'Access-Control-Max-Age': '0',
		Vary: 'Origin',
	};
}

export function applyHubBrowserDeliveryCors(
	response: Response,
	corsHeaders: Record<string, string> | null,
): Response {
	if (!corsHeaders) {
		return response;
	}

	const headers = new Headers(response.headers);
	for (const [key, value] of Object.entries(corsHeaders)) {
		headers.set(key, value);
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}
