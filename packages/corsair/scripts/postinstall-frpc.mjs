#!/usr/bin/env node
// Prefetches the pinned frpc into ~/.cache/corsair/frpc/<version>/ so the dev
// tunnel works with a plain `npm i corsair` — no `brew install`, no manual step.
// Best-effort: a failure prints a hint and never fails the install.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	renameSync,
	rmSync,
} from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

const FRPC_VERSION = '0.71.0'; // keep in sync with hub/tunnel/frpc-binary.ts
const ARCH = { x64: 'amd64', arm64: 'arm64' };

// SHA256 of each frp release archive (from the release's checksums file). The
// downloaded archive is verified against this before anything is extracted or
// run — an executable is never installed from an unverified download.
const SHA256 = {
	'frp_0.71.0_darwin_amd64.tar.gz':
		'1b1b4e2f1836e21e8733f1dddaacd4ed9ae67d7dbee39046b9d7b7eda6253637',
	'frp_0.71.0_darwin_arm64.tar.gz':
		'45be02b186860d375ed49a8941ae9569628a54bf14e67fc36b29c98c99dabcc6',
	'frp_0.71.0_linux_amd64.tar.gz':
		'84f27e39f11169f7adcef8e8b70c9329de17747b1f14dad9fb95eef5682ea716',
	'frp_0.71.0_linux_arm64.tar.gz':
		'f33c293c275d8fc68c654b6fba8f10b2551d6463d09a9fc9cffb7227eae82266',
	'frp_0.71.0_windows_amd64.zip':
		'9e5062e3e5cf07e67144a3a4acf175ef6a2486f3605dd6cf288bae34ab39819f',
	'frp_0.71.0_windows_arm64.zip':
		'b56a5c2a1a2a55d11bc27aeef6edabd39f3d194360ea66660cc27281b502cb1c',
};

function warn(msg) {
	console.warn(
		`[corsair] could not prefetch frpc (${msg}). Set CORSAIR_FRP_BIN to an frpc path or reinstall to enable the dev tunnel.`,
	);
}

async function main() {
	const arch = ARCH[process.arch];
	const os = process.platform === 'win32' ? 'windows' : process.platform;
	if (!arch || !['darwin', 'linux', 'windows'].includes(os)) {
		return warn(`unsupported platform ${process.platform}/${process.arch}`);
	}
	const bin = process.platform === 'win32' ? 'frpc.exe' : 'frpc';
	// platform-arch segment kept in lockstep with hub/tunnel/frpc-binary.ts.
	const dir = join(
		homedir(),
		'.cache',
		'corsair',
		'frpc',
		FRPC_VERSION,
		`${process.platform}-${process.arch}`,
	);
	const dest = join(dir, bin);
	if (existsSync(dest)) return; // already cached

	const base = `frp_${FRPC_VERSION}_${os}_${arch}`;
	const ext = os === 'windows' ? 'zip' : 'tar.gz';
	const archive = `${base}.${ext}`;
	const url = `https://github.com/fatedier/frp/releases/download/v${FRPC_VERSION}/${archive}`;
	try {
		mkdirSync(dir, { recursive: true });
		const res = await fetch(url, { redirect: 'follow' });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const buf = Buffer.from(await res.arrayBuffer());

		const expected = SHA256[archive];
		if (
			!expected ||
			createHash('sha256').update(buf).digest('hex') !== expected
		) {
			throw new Error(`checksum mismatch for ${archive} — refusing to install`);
		}

		// Extract into a temp subdir on the SAME filesystem, then atomically rename
		// the binary into place — a killed tar can't leave a half-written frpc at dest.
		const work = mkdtempSync(join(dir, '.x-'));
		try {
			const tmp = join(work, archive);
			await writeFile(tmp, buf);
			// tar (bsdtar on macOS/Windows, GNU on Linux) extracts tar.gz and zip.
			const r = spawnSync(
				'tar',
				['-xf', tmp, '-C', work, '--strip-components=1', `${base}/${bin}`],
				{ stdio: 'ignore' },
			);
			const extracted = join(work, bin);
			if (r.status !== 0 || !existsSync(extracted)) {
				throw new Error('extract failed');
			}
			renameSync(extracted, dest);
		} finally {
			rmSync(work, { recursive: true, force: true });
		}
		console.log(`[corsair] frpc ${FRPC_VERSION} ready`);
	} catch (err) {
		warn(err.message);
	}
}

main();
