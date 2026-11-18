import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatRelativeTime } from './relative-time';

const NOW = Date.parse('2026-09-29T12:00:00.000Z');

function secondsAgo(seconds: number): string {
	return new Date(NOW - seconds * 1000).toISOString();
}

describe('formatRelativeTime', () => {
	it('renders an em dash for invalid dates instead of NaNmo ago', () => {
		assert.equal(formatRelativeTime('not-a-date', NOW), '—');
		assert.equal(formatRelativeTime('', NOW), '—');
		assert.equal(formatRelativeTime('2026-13-45', NOW), '—');
	});

	it('says just now for brand new and future timestamps', () => {
		assert.equal(formatRelativeTime(secondsAgo(0), NOW), 'just now');
		assert.equal(formatRelativeTime(secondsAgo(-5), NOW), 'just now');
		assert.equal(
			formatRelativeTime(new Date(NOW + 86_400_000).toISOString(), NOW),
			'just now',
		);
	});

	it('steps through each unit at its boundary', () => {
		assert.equal(formatRelativeTime(secondsAgo(1), NOW), '1s ago');
		assert.equal(formatRelativeTime(secondsAgo(59), NOW), '59s ago');
		assert.equal(formatRelativeTime(secondsAgo(60), NOW), '1m ago');
		assert.equal(formatRelativeTime(secondsAgo(3599), NOW), '59m ago');
		assert.equal(formatRelativeTime(secondsAgo(3600), NOW), '1h ago');
		assert.equal(formatRelativeTime(secondsAgo(86_399), NOW), '23h ago');
		assert.equal(formatRelativeTime(secondsAgo(86_400), NOW), '1d ago');
		assert.equal(formatRelativeTime(secondsAgo(604_799), NOW), '6d ago');
		assert.equal(formatRelativeTime(secondsAgo(604_800), NOW), '1w ago');
		assert.equal(formatRelativeTime(secondsAgo(2_629_799), NOW), '4w ago');
		assert.equal(formatRelativeTime(secondsAgo(2_629_800), NOW), '1mo ago');
		assert.equal(formatRelativeTime(secondsAgo(31_535_999), NOW), '11mo ago');
		assert.equal(formatRelativeTime(secondsAgo(31_536_000), NOW), '1y ago');
	});

	it('renders years for old timestamps instead of runaway months', () => {
		assert.equal(formatRelativeTime(secondsAgo(800 * 86_400), NOW), '2y ago');
		assert.equal(formatRelativeTime(secondsAgo(365 * 86_400), NOW), '1y ago');
	});

	it('keeps using the default clock when now is omitted', (t) => {
		t.mock.method(Date, 'now', () => NOW);
		assert.equal(formatRelativeTime(secondsAgo(30)), '30s ago');
	});
});
