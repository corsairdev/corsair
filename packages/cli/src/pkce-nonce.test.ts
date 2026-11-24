import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import {
	pkceNonceFile,
	readPkceNonce,
	removePkceNonce,
	savePkceNonce,
} from './pkce-nonce';

describe('the CLI PKCE nonce file', () => {
	let home: string;
	beforeEach(() => {
		home = fs.mkdtempSync(path.join(os.tmpdir(), 'pkce-home-'));
	});
	afterEach(() => fs.rmSync(home, { recursive: true, force: true }));

	it('lives in a private directory, one file per project, plugin and tenant', () => {
		const a = pkceNonceFile('canva', 'team.a', 'kek-1', home);
		expect(path.dirname(a)).toBe(path.join(home, '.corsair', 'pkce'));
		expect(fs.statSync(path.dirname(a)).mode & 0o777).toBe(0o700);
		expect(pkceNonceFile('canva', 'team_a', 'kek-1', home)).not.toBe(a);
		expect(pkceNonceFile('canva', 'team.a', 'kek-2', home)).not.toBe(a);
		expect(pkceNonceFile('canva', 'team.a', 'kek-1', home)).toBe(a);
	});

	it('keeps the nonce until it is removed, readable only by its owner', () => {
		const file = pkceNonceFile('canva', 'default', 'kek', home);
		savePkceNonce(file, 'n1');
		expect(fs.statSync(file).mode & 0o777).toBe(0o600);
		expect(readPkceNonce(file)).toBe('n1');
		expect(readPkceNonce(file)).toBe('n1');
		removePkceNonce(file, 'n1');
		expect(readPkceNonce(file)).toBeUndefined();
	});

	it("keeps a newer sign-in's nonce when an older exchange finishes", () => {
		const file = pkceNonceFile('canva', 'default', 'kek', home);
		savePkceNonce(file, 'older');
		savePkceNonce(file, 'newer');
		removePkceNonce(file, 'older');
		expect(readPkceNonce(file)).toBe('newer');
	});

	it('refuses to write through a planted symlink', () => {
		const file = pkceNonceFile('canva', 'default', 'kek', home);
		const target = path.join(home, 'victim.txt');
		fs.writeFileSync(target, 'keep me');
		fs.symlinkSync(target, file);
		expect(() => savePkceNonce(file, 'n1')).toThrow();
		expect(fs.readFileSync(target, 'utf8')).toBe('keep me');
		expect(readPkceNonce(file)).toBeUndefined();
	});

	it('refuses a nonce directory that is a symlink', () => {
		fs.mkdirSync(path.join(home, '.corsair'));
		const elsewhere = fs.mkdtempSync(path.join(os.tmpdir(), 'pkce-elsewhere-'));
		fs.symlinkSync(elsewhere, path.join(home, '.corsair', 'pkce'));
		expect(() => pkceNonceFile('canva', 'default', 'kek', home)).toThrow(
			'not a private directory',
		);
		fs.rmSync(elsewhere, { recursive: true, force: true });
	});
});
