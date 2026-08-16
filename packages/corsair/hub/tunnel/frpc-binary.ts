import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

/** Pinned frp release the SDK ships. Bump in lockstep with the VM's frps. */
export const FRPC_VERSION = '0.71.0';

// Seeded from __filename, not import.meta.url: ts-jest transpiles this file to
// CJS (jest runs without --experimental-vm-modules), where import.meta is a parse
// error. esbuild shims __filename in the ESM build. nodeRequire, not require, so
// the CJS output doesn't redeclare the module wrapper's own require.
const nodeRequire = createRequire(__filename);

/**
 * The frpc binary carried by this platform's optional-dependency package
 * (`@corsair-dev/frpc-<platform>-<arch>`), if it installed. Only the one package
 * matching the host os/cpu is installed (npm/pnpm/yarn skip the rest via the
 * packages' `os`/`cpu` fields), so this resolves at most one candidate.
 */
function platformPackageBinary(): string | null {
	const pkg = `@corsair-dev/frpc-${process.platform}-${process.arch}`;
	try {
		// require.resolve honors the installed location (incl. pnpm's layout).
		const bin = join(
			dirname(nodeRequire.resolve(`${pkg}/package.json`)),
			binName(),
		);
		return existsSync(bin) ? bin : null;
	} catch {
		return null; // package not installed for this platform
	}
}

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
	// The platform-arch segment keeps a shared $HOME (devcontainer/NFS) from
	// serving a wrong-arch binary. Kept in lockstep with postinstall-frpc.mjs.
	return join(
		homedir(),
		'.cache',
		'corsair',
		'frpc',
		FRPC_VERSION,
		frpcPlatformKey(),
		binName(),
	);
}

/**
 * Absolute path to a runnable frpc for this platform. Resolution order: an
 * explicit `CORSAIR_FRP_BIN` override, then this platform's optional-dependency
 * package (the esbuild pattern — no install script, so pnpm never blocks it),
 * then the postinstall download cache as a fallback. Throws with an install hint
 * if none resolves.
 */
export function resolveFrpcBinary(): string {
	const override = process.env.CORSAIR_FRP_BIN;
	if (override && existsSync(override)) return override;

	const fromPackage = platformPackageBinary();
	if (fromPackage) return fromPackage;

	const cached = frpcCacheBinary();
	if (existsSync(cached)) return cached;

	// pnpm 10 skips a dependency's postinstall until the consumer approves its
	// build, which leaves this cache empty — name that remedy explicitly.
	throw new Error(
		`frpc binary not found for ${frpcPlatformKey()}. If you use pnpm, run \`pnpm approve-builds corsair\` (or add corsair to onlyBuiltDependencies) and reinstall; otherwise reinstall corsair, or set CORSAIR_FRP_BIN to an frpc path (https://github.com/fatedier/frp/releases).`,
	);
}
