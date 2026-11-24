import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { COMPARE_SLUGS } from '../../lib/compare-pages';
import { COMPARISONS, compareLogo } from './gateway';

const publicDir = join(import.meta.dirname, '..', '..', '..', 'public');

describe('gateway COMPARISONS', () => {
	it('has a page under /compare for every comparison', () => {
		const slugs: readonly string[] = COMPARE_SLUGS;
		for (const c of COMPARISONS) assert.ok(slugs.includes(c.slug), c.slug);
	});

	it('has a saved logo for every comparison, and for Nango', () => {
		for (const slug of [...COMPARISONS.map((c) => c.slug), 'nango']) {
			assert.ok(existsSync(join(publicDir, compareLogo(slug))), slug);
		}
	});

	it('keeps meta descriptions within 160 characters', () => {
		for (const c of COMPARISONS) {
			assert.ok(
				c.metaDescription.length <= 160,
				`${c.slug}: ${c.metaDescription.length}`,
			);
		}
	});

	it('lists https sources on every page, and a question to answer', () => {
		for (const c of COMPARISONS) {
			assert.ok(c.sources.length > 0, c.slug);
			for (const s of c.sources) assert.match(s.url, /^https:\/\//, c.slug);
			assert.ok(c.faq.length > 0, c.slug);
		}
	});

	it('never says Lug as a name', () => {
		for (const c of COMPARISONS) {
			const text = JSON.stringify(c).replaceAll('lug.dev', '');
			assert.doesNotMatch(text, /\blug\b/i, c.slug);
		}
	});
});
