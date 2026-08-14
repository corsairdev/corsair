import {
	CORSAIR_TUNNEL_PATH,
	CORSAIR_TUNNEL_ZONE,
	resolveFrpcBinary,
} from 'corsair/hub';
import { corsairBanner } from './banner';

/**
 * Readies the dev tunnel for a `ck_dev_` key. With frp there is no machine
 * enrollment: the frpc binary ships with the SDK, so this just verifies it's
 * present, confirms the Hub is reachable (and owns a slug), and prints the
 * stable tunnel URL. The key is the only thing the developer provides.
 */
export async function enrollDevTunnel(opts: {
	apiUrl: string;
	projectApiKey: string;
}): Promise<void> {
	const { apiUrl, projectApiKey } = opts;
	if (!projectApiKey.startsWith('ck_dev_')) return;

	try {
		resolveFrpcBinary();
	} catch {
		console.log(
			[
				'[corsair] the bundled frpc tunnel binary is missing — reinstall corsair:',
				'  macOS / Linux / Windows:  npm i corsair   (or pnpm add / yarn add)',
				'  offline or locked registry: set CORSAIR_FRP_BIN to an frpc path',
				'  frpc binaries (any platform): https://github.com/fatedier/frp/releases',
			].join('\n'),
		);
		return;
	}

	const res = await fetch(
		`${apiUrl.replace(/\/$/, '')}/api/dev/tunnel-config`,
		{ headers: { authorization: `Bearer ${projectApiKey}` } },
	).catch(() => null);
	if (!res || !res.ok) {
		console.log(
			`[corsair] tunnel setup skipped (Hub ${res ? res.status : 'unreachable'}).`,
		);
		return;
	}

	const { slug } = (await res.json()) as { slug?: string };
	if (!/^[a-z0-9-]+$/.test(slug ?? '')) {
		console.error('[corsair] Hub returned an invalid tunnel slug.');
		return;
	}

	console.log(
		corsairBanner(
			`https://${slug}.${CORSAIR_TUNNEL_ZONE}${CORSAIR_TUNNEL_PATH}`,
		),
	);
}
