import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { resolveCombosDir } from './combo-paths';

const here = dirname(fileURLToPath(import.meta.url));
const wwwRoot = join(here, '../..');
const repoRoot = join(wwwRoot, '..');

describe('resolveCombosDir', () => {
	it('resolves from the www project root', () => {
		const dir = resolveCombosDir(wwwRoot);
		assert.equal(dir, join(wwwRoot, 'src/data/combos'));
		assert.equal(existsSync(join(dir, 'slack-linear.json')), true);
	});

	it('resolves from the repo root', () => {
		const dir = resolveCombosDir(repoRoot);
		assert.equal(dir, join(repoRoot, 'www/src/data/combos'));
		assert.equal(existsSync(join(dir, 'slack-linear.json')), true);
	});

	it('throws when neither layout exists', () => {
		assert.throws(
			() => resolveCombosDir(join(here, 'missing-combo-root')),
			/combo JSON directory not found/,
		);
	});
});
