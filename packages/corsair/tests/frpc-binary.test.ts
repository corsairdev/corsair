import { chmodSync, mkdtempSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { frpcPlatformKey, resolveFrpcBinary } from '../hub/tunnel/frpc-binary';

describe('resolveFrpcBinary', () => {
	const original = process.env.CORSAIR_FRP_BIN;
	afterEach(() => {
		if (original === undefined) {
			Reflect.deleteProperty(process.env, 'CORSAIR_FRP_BIN');
		} else {
			process.env.CORSAIR_FRP_BIN = original;
		}
	});

	it('returns CORSAIR_FRP_BIN when it points to an existing file', () => {
		const dir = mkdtempSync(join(tmpdir(), 'frpc-'));
		const fake = join(dir, 'frpc');
		writeFileSync(fake, '#!/bin/sh\n');
		process.env.CORSAIR_FRP_BIN = fake;
		expect(resolveFrpcBinary()).toBe(fake);
	});

	it('adds the executable bit to a resolved binary that lacks it', () => {
		// Windows frpc.exe needs no execute bit.
		if (process.platform === 'win32') return;

		const bin = join(mkdtempSync(join(tmpdir(), 'frpc-')), 'frpc');
		writeFileSync(bin, '#!/bin/sh\nexit 0\n');
		chmodSync(bin, 0o644); // no execute bits
		process.env.CORSAIR_FRP_BIN = bin;

		expect(resolveFrpcBinary()).toBe(bin);
		expect(statSync(bin).mode & 0o111).not.toBe(0);
	});

	it('ignores a CORSAIR_FRP_BIN that does not exist', () => {
		const missing = join(tmpdir(), 'nope-frpc-missing');
		process.env.CORSAIR_FRP_BIN = missing;
		// Falls through to the cache; on a machine with no cached frpc it throws.
		try {
			expect(resolveFrpcBinary()).not.toBe(missing);
		} catch (err) {
			expect((err as Error).message).toMatch(/frpc binary not found/);
		}
	});

	it('reports a platform-arch key', () => {
		expect(frpcPlatformKey()).toBe(`${process.platform}-${process.arch}`);
	});
});
