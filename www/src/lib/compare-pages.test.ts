import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { COMPARE_SLUGS } from './compare-pages';

const compareDir = join(import.meta.dirname, '..', 'app', 'compare');
const pageFiles = ['page.tsx', 'page.ts', 'page.jsx', 'page.js'];

function subfolders(dir: string) {
	return readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name);
}

const isPrivate = (name: string) => name.startsWith('_');
const isRouteGroup = (name: string) =>
	name.startsWith('(') && name.endsWith(')');

// True when the folder serves a page at its own URL. Route groups (`(name)`)
// add no URL segment, so a page inside one still belongs to this folder.
// Private folders (`_name`) are never routed.
function servesPage(dir: string): boolean {
	if (pageFiles.some((file) => existsSync(join(dir, file)))) return true;
	return subfolders(dir)
		.filter(isRouteGroup)
		.some((group) => servesPage(join(dir, group)));
}

// Slugs of the pages served at /compare/<slug>, looking through route groups
// at either level (compare/(group)/foo and compare/foo/(group)/page.tsx).
function findCompareSlugs(dir: string): string[] {
	return subfolders(dir).flatMap((name) => {
		if (isPrivate(name)) return [];
		if (isRouteGroup(name)) return findCompareSlugs(join(dir, name));
		return servesPage(join(dir, name)) ? [name] : [];
	});
}

describe('COMPARE_SLUGS', () => {
	it('lists every page under app/compare, so each one reaches the sitemap', () => {
		const pageSlugs = [...new Set(findCompareSlugs(compareDir))].sort();

		assert.deepEqual([...COMPARE_SLUGS].sort(), pageSlugs);
	});
});
