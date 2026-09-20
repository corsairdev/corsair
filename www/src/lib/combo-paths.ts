import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function resolveCombosDir(cwd = process.cwd()): string {
	const candidates = [
		join(cwd, 'src/data/combos'),
		join(cwd, 'www/src/data/combos'),
	];
	for (const dir of candidates) {
		if (existsSync(dir)) return dir;
	}
	throw new Error(`combo JSON directory not found (cwd=${cwd})`);
}
