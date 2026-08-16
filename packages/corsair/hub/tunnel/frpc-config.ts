/**
 * Renders the frpc.toml the SDK spawns. `localPort` is the loopback path-guard,
 * not the app itself — so the tunnel only ever reaches /api/corsair. The
 * ck_dev_ key rides in `metadatas.token`; the Hub validates it live on Login.
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
}): string {
	// Reject anything that could break out of the toml string literal.
	if (!/^[\x20-\x21\x23-\x7E]+$/.test(opts.apiKey)) {
		throw new Error(
			'apiKey contains invalid characters (quotes, newlines, or control chars)',
		);
	}
	const lines = [
		`serverAddr = "${opts.serverAddr}"`,
		`serverPort = ${opts.serverPort}`,
		'loginFailExit = true',
		`metadatas.token = "${opts.apiKey}"`,
	];
	if (opts.caCertPath) {
		lines.push(
			'transport.tls.enable = true',
			`transport.tls.serverName = "${opts.serverName ?? opts.serverAddr}"`,
			`transport.tls.trustedCaFile = "${opts.caCertPath}"`,
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
