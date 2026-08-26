/** An absolute URL path the tunnel scopes to, e.g. /api/corsair or /external/x. */
const DELIVERY_PATH_RE = /^(?:\/[A-Za-z0-9._~-]+)+$/;

/**
 * Renders the frpc.toml the SDK spawns. `localPort` is the loopback path-guard,
 * not the app itself — so the tunnel only ever reaches the dev's delivery path.
 * The ck_dev_ key rides in `metadatas.token`; the Hub validates it live on Login.
 * `metadatas.path` declares the delivery path so the Hub scopes the tunnel and
 * builds the delivery URL around it (falls back to /api/corsair when absent).
 */
export function buildFrpcConfig(opts: {
	serverAddr: string;
	serverPort: number;
	apiKey: string;
	slug: string;
	localPort: number;
	/** When set, frpc verifies the frps TLS cert against this CA file. */
	caCertPath?: string;
	/** Hostname to verify the cert against; falls back to serverAddr when absent. */
	serverName?: string;
	/** The path the dev app serves; declared to the Hub to scope the tunnel here. */
	deliveryPath?: string;
}): string {
	// Reject anything that could break out of the toml string literal.
	if (!/^[\x20-\x21\x23-\x7E]+$/.test(opts.apiKey)) {
		throw new Error(
			'apiKey contains invalid characters (quotes, newlines, or control chars)',
		);
	}
	if (opts.deliveryPath && !DELIVERY_PATH_RE.test(opts.deliveryPath)) {
		throw new Error(
			'deliveryPath must be an absolute URL path (e.g. /api/corsair)',
		);
	}
	const lines = [
		`serverAddr = "${opts.serverAddr}"`,
		`serverPort = ${opts.serverPort}`,
		'loginFailExit = true',
		`metadatas.token = "${opts.apiKey}"`,
	];
	if (opts.deliveryPath) {
		lines.push(`metadatas.path = "${opts.deliveryPath}"`);
	}
	if (opts.caCertPath) {
		// Windows paths carry backslashes, and `\U` in a TOML basic string is a
		// unicode-escape prefix — frpc dies with "non-hex character" on
		// C:\Users\... (found live on Windows; POSIX paths never hit it).
		// Forward slashes are valid for Windows filesystem consumers.
		const caFile = opts.caCertPath.replace(/\\/g, '/');
		lines.push(
			'transport.tls.enable = true',
			`transport.tls.serverName = "${opts.serverName ?? opts.serverAddr}"`,
			`transport.tls.trustedCaFile = "${caFile}"`,
		);
	}
	lines.push(
		'',
		'[[proxies]]',
		`name = "corsair-${opts.slug}"`,
		'type = "http"',
		'localIP = "127.0.0.1"',
		`localPort = ${opts.localPort}`,
		`subdomain = "${opts.slug}"`,
		'',
	);
	return lines.join('\n');
}
