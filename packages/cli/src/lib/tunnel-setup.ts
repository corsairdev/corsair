import { spawnSync } from 'node:child_process';
import { CORSAIR_TUNNEL_PATH, CORSAIR_TUNNEL_ZONE } from 'corsair/hub';
import { corsairBanner } from './banner';

/**
 * One-time machine enrollment for the dev tunnel. Fetches Corsair's zrok
 * account from Hub (using the `ck_dev_` key), points the local zrok client at
 * Corsair's controller, enrolls, and prints the dev's stable tunnel URL. A dev
 * never touches a zrok account — the key is the only thing they provide.
 */
export async function enrollDevTunnel(opts: {
	apiUrl: string;
	projectApiKey: string;
}): Promise<void> {
	const { apiUrl, projectApiKey } = opts;
	if (!projectApiKey.startsWith('ck_dev_')) return;

	if (spawnSync('zrok', ['version'], { stdio: 'ignore' }).error) {
		console.log(
			[
				'[corsair] zrok is not installed. Install it, then re-run `corsair setup`:',
				'  Homebrew (macOS/Linux):   brew install zrok',
				'  Linux / Windows / others: https://docs.zrok.io/docs/guides/install/',
				'  Binaries (any platform):  https://github.com/openziti/zrok/releases',
			].join('\n'),
		);
		return;
	}

	const res = await fetch(
		`${apiUrl.replace(/\/$/, '')}/api/dev/tunnel-config`,
		{
			headers: { authorization: `Bearer ${projectApiKey}` },
		},
	).catch(() => null);
	if (!res || !res.ok) {
		console.log(
			`[corsair] tunnel setup skipped (Hub ${res ? res.status : 'unreachable'}).`,
		);
		return;
	}
	const { apiEndpoint, accountToken, slug } = (await res.json()) as {
		apiEndpoint: string;
		accountToken: string;
		slug: string;
	};

	// Validate before pointing the local zrok client at it — a compromised Hub
	// must not be able to MITM enrollment through an arbitrary endpoint.
	try {
		const ep = new URL(apiEndpoint);
		if (ep.protocol !== 'https:' || !ep.hostname.endsWith('.corsair.cloud')) {
			throw new Error('untrusted host');
		}
	} catch {
		console.error(
			`[corsair] refusing an untrusted zrok endpoint from Hub: ${apiEndpoint}`,
		);
		return;
	}

	const cfg = spawnSync('zrok', ['config', 'set', 'apiEndpoint', apiEndpoint], {
		stdio: 'ignore',
	});
	if (cfg.error || cfg.status !== 0) {
		console.error(
			'[corsair] failed to point zrok at the Corsair controller — is zrok installed?',
		);
		return;
	}

	const enable = spawnSync('zrok', ['enable', accountToken], {
		encoding: 'utf8',
	});
	const enableOut = `${enable.stdout ?? ''}${enable.stderr ?? ''}`;
	// zrok exits non-zero when a machine is already enrolled — that's our
	// idempotent no-op; any other failure is real and must not be reported ready.
	if ((enable.error || enable.status !== 0) && !/already/i.test(enableOut)) {
		console.error(
			`[corsair] zrok enrollment failed: ${enable.error?.message ?? enableOut.trim() ?? `exit ${enable.status}`}`,
		);
		return;
	}

	console.log(
		corsairBanner(
			`https://${slug}.${CORSAIR_TUNNEL_ZONE}${CORSAIR_TUNNEL_PATH}`,
		),
	);
}
