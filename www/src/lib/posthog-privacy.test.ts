import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { CaptureResult } from 'posthog-js';

import { scrubEvent, scrubHandle } from './posthog-privacy';

describe('scrubHandle', () => {
	it('blanks the handle and keeps the other params', () => {
		assert.equal(
			scrubHandle(
				'https://corsair.dev/start?handle=maya&apps=gmail&utm_source=x',
			),
			'https://corsair.dev/start?handle=:value&apps=gmail&utm_source=x',
		);
		assert.equal(
			scrubHandle('/api/lug-handle?handle=maya'),
			'/api/lug-handle?handle=:value',
		);
		assert.equal(
			scrubHandle('https://corsair.dev/start?step=pick&handle=maya#x'),
			'https://corsair.dev/start?step=pick&handle=:value#x',
		);
	});

	it('catches a percent-encoded name too', () => {
		assert.equal(
			scrubHandle('https://corsair.dev/start?%68andle=maya&apps=gmail'),
			'https://corsair.dev/start?%68andle=:value&apps=gmail',
		);
		assert.equal(scrubHandle('/start?HANDLE=maya'), '/start?HANDLE=:value');
	});

	it('leaves other text alone', () => {
		assert.equal(
			scrubHandle('https://corsair.dev/pricing'),
			'https://corsair.dev/pricing',
		);
		assert.equal(scrubHandle('the handle=maya rule'), 'the handle=maya rule');
	});
});

describe('scrubEvent', () => {
	it('walks nested properties and $set', () => {
		const event = {
			event: '$pageview',
			properties: {
				$current_url: 'https://corsair.dev/start?handle=maya',
				nested: { list: ['/start?handle=maya'] },
			},
			$set: { $initial_current_url: 'https://corsair.dev/?handle=maya' },
		} as unknown as CaptureResult;
		const out = scrubEvent(event);
		assert.equal(
			out?.properties.$current_url,
			'https://corsair.dev/start?handle=:value',
		);
		assert.deepEqual(out?.properties.nested, {
			list: ['/start?handle=:value'],
		});
		assert.equal(
			(out?.$set as Record<string, string>).$initial_current_url,
			'https://corsair.dev/?handle=:value',
		);
	});
});
