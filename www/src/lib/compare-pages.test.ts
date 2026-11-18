import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { COMPARE_SLUGS } from './compare-pages';

const compareDir = join(import.meta.dirname, '..', 'app', 'compare');
const pageFiles = ['page.tsx', 'page.ts', 'page.jsx', 'page.js'];

// A public compare page is a folder that holds a page file. Private folders
// (`_name`) and route groups (`(name)`) are not URLs.
function isPublicPage(name: string) {
	if (name.startsWith('_') || name.startsWith('(')) return false;
	return pageFiles.some((file) => existsSync(join(compareDir, name, file)));
}

describe('COMPARE_SLUGS', () => {
	it('lists every page under app/compare, so each one reaches the sitemap', () => {
		const pageSlugs = readdirSync(compareDir, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name)
			.filter(isPublicPage)
			.sort();

		assert.deepEqual([...COMPARE_SLUGS].sort(), pageSlugs);
	});
});
