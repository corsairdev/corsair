import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/** Pinned frp release the SDK ships. Bump in lockstep with the VM's frps. */
export const FRPC_VERSION = '0.71.0';

export function frpcPlatformKey(): string {
	return `${process.platform}-${process.arch}`;
}

function binName(): string {
	return process.platform === 'win32' ? 'frpc.exe' : 'frpc';
}

/**
 * Where the postinstall step drops the downloaded frpc. Kept in lockstep with
 * `scripts/postinstall-frpc.mjs` — both derive it from homedir + FRPC_VERSION.
 * ponytail: duplicated in that standalone install script (it can't import TS);
 * a shared frpc-version.json is the upgrade path if this drifts.
 */
export function frpcCacheBinary(): string {
	return join(homedir(), '.cache', 'corsair', 'frpc', FRPC_VERSION, binName());
}

/**
 * Absolute path to a runnable frpc for this platform. Resolution order: an
 * explicit `CORSAIR_FRP_BIN` override, then the postinstall download cache.
 * Throws with an install hint if neither resolves.
 *
 * ponytail: per-platform optional-dependency packages (esbuild's pattern) are
 * the offline-registry upgrade path; add a lookup here once they're published.
 */
export function resolveFrpcBinary(): string {
	const override = process.env.CORSAIR_FRP_BIN;
	if (override && existsSync(override)) return override;

	const cached = frpcCacheBinary();
	if (existsSync(cached)) return cached;

	throw new Error(
		`frpc binary not found for ${frpcPlatformKey()}. Reinstall corsair, or set CORSAIR_FRP_BIN to an frpc path (https://github.com/fatedier/frp/releases).`,
	);
}
