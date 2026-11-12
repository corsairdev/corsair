import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	clampMetaDescription,
	contributorDisplayName,
	contributorSeoText,
	META_DESCRIPTION_MAX,
	ossIntegrationSeoText,
} from './page-seo';

describe('clampMetaDescription', () => {
	it('returns short text unchanged', () => {
		assert.equal(clampMetaDescription('A short one.'), 'A short one.');
	});

	it('collapses whitespace', () => {
		assert.equal(clampMetaDescription('  two\n  words '), 'two words');
	});

	it('cuts long text at a whole word and stays within the limit', () => {
		const long =
			'Learn how SaaS API integration works from the first authenticated call to a complete, continuously updated sync, covering authentication, pagination, incremental changes, and how AI agents read synced data.';
		const out = clampMetaDescription(long);
		assert.ok(out.length <= META_DESCRIPTION_MAX, `${out.length} characters`);
		assert.ok(out.endsWith('…'));
		assert.ok(long.startsWith(out.slice(0, -1)));
		assert.match(
			long.slice(out.length - 1),
			/^[\s,;:.!?-]/,
			'the cut falls between words',
		);
		assert.doesNotMatch(out, /[\s,;:.]…$/);
	});

	it('cuts mid-word when the text has no usable space', () => {
		const out = clampMetaDescription('x'.repeat(400));
		assert.equal(out.length, META_DESCRIPTION_MAX);
	});
});

describe('contributorDisplayName', () => {
	it('uses the name when there is one', () => {
		assert.equal(
			contributorDisplayName(' Ada Lovelace ', 'ada'),
			'Ada Lovelace',
		);
	});

	it('falls back to the username for an empty or missing name', () => {
		assert.equal(contributorDisplayName('', 'ada'), 'ada');
		assert.equal(contributorDisplayName('   ', 'ada'), 'ada');
		assert.equal(contributorDisplayName(null, 'ada'), 'ada');
		assert.equal(contributorDisplayName(undefined, 'ada'), 'ada');
	});
});

describe('contributorSeoText', () => {
	it('never leaves the name blank', () => {
		const { title, description } = contributorSeoText({
			name: '',
			githubUsername: 'mayank-saraswal',
			integrationCount: 13,
		});
		assert.equal(title, '@mayank-saraswal, Corsair open-source contributor');
		assert.match(
			description,
			/^mayank-saraswal \(@mayank-saraswal\) contributes/,
		);
		assert.match(description, /13 integrations claimed/);
		assert.doesNotMatch(description, /for \./);
	});

	it('shows name and handle when they differ', () => {
		const { title } = contributorSeoText({
			name: 'Ada Lovelace',
			githubUsername: 'ada',
			integrationCount: 1,
		});
		assert.equal(title, 'Ada Lovelace (@ada), Corsair open-source contributor');
	});

	it('uses the singular for one integration', () => {
		const { description } = contributorSeoText({
			name: 'Ada',
			githubUsername: 'ada',
			integrationCount: 1,
		});
		assert.match(description, /1 integration claimed\./);
	});

	it('keeps profiles with nothing claimed out of the index', () => {
		const base = { name: 'Ada', githubUsername: 'ada' };
		assert.equal(
			contributorSeoText({ ...base, integrationCount: 0 }).indexable,
			false,
		);
		assert.equal(
			contributorSeoText({ ...base, integrationCount: 2 }).indexable,
			true,
		);
	});

	it('stays within the description limit for a long name', () => {
		const { description } = contributorSeoText({
			name: 'A very long display name that someone typed in'.repeat(2),
			githubUsername: 'a-rather-long-github-username-here',
			integrationCount: 120,
		});
		assert.ok(description.length <= META_DESCRIPTION_MAX);
	});
});

describe('ossIntegrationSeoText', () => {
	it('gives a short name a title and description of useful length', () => {
		const { title, description } = ossIntegrationSeoText('Ably');
		assert.equal(title, 'Ably integration: status and how to contribute');
		assert.ok(description.length >= 110, `${description.length} characters`);
		assert.ok(description.length <= META_DESCRIPTION_MAX);
	});

	it('stays within the limit for a long name', () => {
		const { description } = ossIntegrationSeoText(
			'SSLMate Cert Spotter API for Certificate Transparency Monitoring',
		);
		assert.ok(description.length <= META_DESCRIPTION_MAX);
	});
});
