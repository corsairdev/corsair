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
}): string {
	return [
		`serverAddr = "${opts.serverAddr}"`,
		`serverPort = ${opts.serverPort}`,
		'loginFailExit = true',
		`metadatas.token = "${opts.apiKey}"`,
		'',
		'[[proxies]]',
		`name = "corsair-${opts.slug}"`,
		'type = "http"',
		'localIP = "127.0.0.1"',
		`localPort = ${opts.localPort}`,
		`subdomain = "${opts.slug}"`,
		'',
	].join('\n');
}
