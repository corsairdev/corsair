#!/usr/bin/env node
// Materializes each per-platform frpc binary into its @corsair-dev/frpc-* package
// right before publish. The binaries are git-ignored — they exist only in the
// published npm tarball, never in the repo. Every download is verified against the
// pinned SHA256 (same set as packages/corsair/scripts/postinstall-frpc.mjs) before
// anything is extracted. Run from anywhere: `node scripts/prepare-frpc-packages.mjs`.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
	chmodSync,
	existsSync,
	mkdtempSync,
	readFileSync,
	renameSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FRPC_VERSION = '0.71.0'; // keep in sync with packages/corsair/hub/tunnel/frpc-binary.ts

// node `${platform}-${arch}` -> the frp release's os/arch + binary name + archive ext.
const TARGETS = [
	{
		key: 'darwin-x64',
		os: 'darwin',
		arch: 'amd64',
		bin: 'frpc',
		ext: 'tar.gz',
	},
	{
		key: 'darwin-arm64',
		os: 'darwin',
		arch: 'arm64',
		bin: 'frpc',
		ext: 'tar.gz',
	},
	{ key: 'linux-x64', os: 'linux', arch: 'amd64', bin: 'frpc', ext: 'tar.gz' },
	{
		key: 'linux-arm64',
		os: 'linux',
		arch: 'arm64',
		bin: 'frpc',
		ext: 'tar.gz',
	},
	{
		key: 'win32-x64',
		os: 'windows',
		arch: 'amd64',
		bin: 'frpc.exe',
		ext: 'zip',
	},
	{
		key: 'win32-arm64',
		os: 'windows',
		arch: 'arm64',
		bin: 'frpc.exe',
		ext: 'zip',
	},
];

// SHA256 of each frp release archive (from the release checksums file).
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

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const NOTICE = `This package bundles the frpc binary from fatedier/frp
(https://github.com/fatedier/frp), redistributed under the Apache License 2.0.
The full license text is in LICENSE.frp. frpc version: ${FRPC_VERSION}.
`;

/** Extract members from a tar.gz or zip. bsdtar (macOS/Windows) reads zip; on
 *  GNU-tar-only Linux, zips fall back to `unzip`. */
function extract(archivePath, workDir, base, members, isZip) {
	const stripped = members.map((m) => `${base}/${m}`);
	let r = spawnSync(
		'tar',
		['-xf', archivePath, '-C', workDir, '--strip-components=1', ...stripped],
		{ stdio: 'ignore' },
	);
	if (r.status !== 0 && isZip) {
		// -j junks the paths (drops the leading `base/`), matching --strip-components=1.
		r = spawnSync(
			'unzip',
			['-o', '-j', archivePath, ...stripped, '-d', workDir],
			{
				stdio: 'ignore',
			},
		);
	}
	return r;
}

async function prepare(t) {
	const pkgDir = join(root, 'packages', `frpc-${t.key}`);
	if (!existsSync(pkgDir)) throw new Error(`missing package dir: ${pkgDir}`);
	const dest = join(pkgDir, t.bin);
	const marker = join(pkgDir, '.frpc-version');
	writeFileSync(join(pkgDir, 'NOTICE'), NOTICE); // cheap; keeps attribution present

	// Skip only when THIS version is already materialized. A binary left from a
	// previous FRPC_VERSION must be re-downloaded + re-verified, never reused
	// under new release metadata — so gate the skip on a version marker.
	if (
		existsSync(dest) &&
		existsSync(join(pkgDir, 'LICENSE.frp')) &&
		existsSync(marker) &&
		readFileSync(marker, 'utf8').trim() === FRPC_VERSION
	) {
		console.log(`  skip ${t.key} (already materialized)`);
		return;
	}

	const base = `frp_${FRPC_VERSION}_${t.os}_${t.arch}`;
	const archive = `${base}.${t.ext}`;
	const expected = SHA256[archive];
	if (!expected) throw new Error(`no pinned checksum for ${archive}`);
	const url = `https://github.com/fatedier/frp/releases/download/v${FRPC_VERSION}/${archive}`;

	const res = await fetch(url, {
		redirect: 'follow',
		signal: AbortSignal.timeout(120_000),
	});
	if (!res.ok) throw new Error(`${t.key}: HTTP ${res.status} for ${url}`);
	const buf = Buffer.from(await res.arrayBuffer());
	if (createHash('sha256').update(buf).digest('hex') !== expected) {
		throw new Error(`${t.key}: checksum mismatch for ${archive} — refusing`);
	}

	const work = mkdtempSync(join(tmpdir(), 'corsair-frpc-pkg-'));
	try {
		const tmp = join(work, archive);
		await writeFile(tmp, buf);
		const r = extract(tmp, work, base, [t.bin, 'LICENSE'], t.ext === 'zip');
		const exBin = join(work, t.bin);
		if (r.status !== 0 || !existsSync(exBin)) {
			throw new Error(
				`${t.key}: extract failed (tar/unzip status ${r.status})`,
			);
		}
		renameSync(exBin, dest);
		if (!t.bin.endsWith('.exe')) chmodSync(dest, 0o755);
		const exLic = join(work, 'LICENSE');
		if (existsSync(exLic)) renameSync(exLic, join(pkgDir, 'LICENSE.frp'));
		else {
			writeFileSync(
				join(pkgDir, 'LICENSE.frp'),
				'frp Apache-2.0 LICENSE: https://github.com/fatedier/frp/blob/master/LICENSE\n',
			);
		}
	} finally {
		rmSync(work, { recursive: true, force: true });
	}
	writeFileSync(marker, `${FRPC_VERSION}\n`);
	console.log(`  ok   ${t.key} -> ${t.bin}`);
}

// An optional single target key (e.g. `darwin-arm64`) — each package's prepack
// hook materializes only its own binary; no arg prepares all six.
const only = process.argv[2];
const targets = only ? TARGETS.filter((t) => t.key === only) : TARGETS;
if (only && targets.length === 0) {
	throw new Error(
		`unknown target "${only}" — expected one of: ${TARGETS.map((t) => t.key).join(', ')}`,
	);
}
for (const t of targets) {
	await prepare(t);
}
console.log('frpc packages prepared.');
