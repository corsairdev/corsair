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
		assert.equal(meta.openGraph.title, 'Serphouse | Corsair OSS');
		assert.equal(meta.openGraph.description, 'Serphouse in the catalog.');
		assert.equal(meta.openGraph.url, '/oss/serphouse');
		assert.equal(meta.openGraph.siteName, 'Corsair');
		assert.equal(meta.openGraph.type, 'website');
		assert.deepEqual(
			meta.openGraph.images.map((image) => image.url),
			['/og-image.png'],
		);
		assert.equal(meta.twitter.card, 'summary_large_image');
		assert.equal(meta.twitter.title, 'Serphouse | Corsair OSS');
	});
});
