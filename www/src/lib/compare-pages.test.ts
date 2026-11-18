import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { COMPARE_SLUGS } from './compare-pages';

const compareDir = join(import.meta.dirname, '..', 'app', 'compare');

describe('COMPARE_SLUGS', () => {
	it('lists every page under app/compare, so each one reaches the sitemap', () => {
		const pageSlugs = readdirSync(compareDir, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name)
			.sort();

		assert.deepEqual([...COMPARE_SLUGS].sort(), pageSlugs);
	});
});
