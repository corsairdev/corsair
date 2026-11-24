import { hkdfSync } from 'node:crypto';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

/**
 * Where a manual sign-in's PKCE nonce waits for its pasted code: a private
 * directory under the home folder, so another local user can't plant a file
 * or symlink there. The name is derived under the KEK from plugin and tenant,
 * so two projects, or tenants like `team.a` and `team_a`, never share a file.
 */
export function pkceNonceFile(
	pluginId: string,
	tenantId: string,
	kek: string,
	home = os.homedir(),
): string {
	const dir = path.join(home, '.corsair', 'pkce');
	fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
	const info = fs.lstatSync(dir);
	if (
		info.isSymbolicLink() ||
		!info.isDirectory() ||
		(typeof process.getuid === 'function' && info.uid !== process.getuid())
	) {
		throw new Error(
			`Refusing to keep sign-in data in ${dir}: not a private directory.`,
		);
	}
	fs.chmodSync(dir, 0o700);
	// HKDF under the KEK, as core derives verifiers: a stable, collision-free name per project.
	const name = Buffer.from(
		hkdfSync(
			'sha256',
			kek,
			'corsair-pkce-nonce-file',
			`${pluginId}\0${tenantId}`,
			24,
		),
	).toString('base64url');
	return path.join(dir, `${name}.json`);
}

/** Saves the nonce, refusing to follow a symlink at the file's path. */
export function savePkceNonce(file: string, nonce: string): void {
	const noFollow = fs.constants.O_NOFOLLOW ?? 0;
	const fd = fs.openSync(
		file,
		fs.constants.O_WRONLY |
			fs.constants.O_CREAT |
			fs.constants.O_TRUNC |
			noFollow,
		0o600,
	);
	try {
		fs.writeSync(fd, JSON.stringify({ nonce }));
	} finally {
		fs.closeSync(fd);
	}
}

/** The nonce of the sign-in waiting for a pasted code, left in place until its exchange succeeds. */
export function readPkceNonce(file: string): string | undefined {
	try {
		if (fs.lstatSync(file).isSymbolicLink()) return undefined;
		const { nonce } = JSON.parse(fs.readFileSync(file, 'utf8')) as {
			nonce?: string;
		};
		return nonce;
	} catch {
		return undefined;
	}
}

/**
 * Removes the file only while it still holds this exchange's nonce: a newer
 * sign-in for the same plugin and tenant may have saved its own meanwhile, and
 * its pasted code still needs it.
 */
export function removePkceNonce(file: string, nonce: string): void {
	if (readPkceNonce(file) === nonce) fs.rmSync(file, { force: true });
}
