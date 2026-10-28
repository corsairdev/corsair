import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { socialMetadata } from './social-metadata';

describe('socialMetadata', () => {
	it('sets the page title, description and URL with the shared fields', () => {
		const meta = socialMetadata({
			title: 'Serphouse | Corsair OSS',
			description: 'Serphouse in the catalog.',
			path: '/oss/serphouse',
		});
		const og = meta.openGraph as Record<string, unknown>;
		assert.equal(og.title, 'Serphouse | Corsair OSS');
		assert.equal(og.description, 'Serphouse in the catalog.');
		assert.equal(og.url, '/oss/serphouse');
		assert.equal(og.siteName, 'Corsair');
		assert.equal(og.type, 'website');
		assert.deepEqual(
			(og.images as { url: string }[]).map((image) => image.url),
			['/og-image.png'],
		);
		const twitter = meta.twitter as Record<string, unknown>;
		assert.equal(twitter.card, 'summary_large_image');
		assert.equal(twitter.title, 'Serphouse | Corsair OSS');
	});
});
