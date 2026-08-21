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
	readFileSync,
	renameSync,
	rmSync,
} from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

// Single source of truth for the pinned frp version + archive checksums, shared
// with scripts/prepare-frpc-packages.mjs. Ships alongside this script (see the
// corsair package.json `files`), so it resolves on the end-user's machine too.
const { version: FRPC_VERSION, checksums: SHA256 } = JSON.parse(
	readFileSync(new URL('./frpc-release.json', import.meta.url), 'utf8'),
);
const ARCH = { x64: 'amd64', arm64: 'arm64' };

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
		// Bounded so a release host that accepts then stalls can't hang `npm install`
		// with no output. Best-effort like the rest of this script — timeout warns.
		const res = await fetch(url, {
			redirect: 'follow',
			signal: AbortSignal.timeout(60_000),
		});
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
