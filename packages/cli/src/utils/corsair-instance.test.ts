import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

jest.mock('c12', () => ({ loadConfig: jest.fn() }));
jest.mock('@babel/preset-react', () => ({}));
jest.mock('@babel/preset-typescript', () => ({}));
jest.mock('../get-tsconfig-info', () => ({ getTsconfigInfo: jest.fn() }));

import { findCorsairConfigPath } from './corsair-instance';

describe('findCorsairConfigPath', () => {
	let cwd: string;

	const touch = (relativePath: string) => {
		const fullPath = path.join(cwd, relativePath);
		fs.mkdirSync(path.dirname(fullPath), { recursive: true });
		fs.writeFileSync(fullPath, '');
	};

	beforeEach(() => {
		cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'corsair-cli-test-'));
	});

	afterEach(() => {
		fs.rmSync(cwd, { recursive: true, force: true });
	});

	it('should return null when no config file exists', () => {
		expect(findCorsairConfigPath(cwd)).toBeNull();
	});

	it('should find a root-level corsair.ts', () => {
		touch('corsair.ts');
		expect(findCorsairConfigPath(cwd)).toBe(path.join(cwd, 'corsair.ts'));
	});

	it('should find a nested src/corsair.ts', () => {
		touch('src/corsair.ts');
		expect(findCorsairConfigPath(cwd)).toBe(path.join(cwd, 'src/corsair.ts'));
	});

	it('should prefer the root config when both root and src exist', () => {
		touch('corsair.ts');
		touch('src/corsair.ts');
		expect(findCorsairConfigPath(cwd)).toBe(path.join(cwd, 'corsair.ts'));
	});

	it('should find custom locations like app/corsair.js', () => {
		touch('app/corsair.js');
		expect(findCorsairConfigPath(cwd)).toBe(path.join(cwd, 'app/corsair.js'));
	});

	it('should find corsair/index.ts', () => {
		touch('corsair/index.ts');
		expect(findCorsairConfigPath(cwd)).toBe(path.join(cwd, 'corsair/index.ts'));
	});
});
