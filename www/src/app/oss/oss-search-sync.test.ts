import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { shouldApplySearch, shouldSyncSearchValue } from './oss-search-sync';

describe('shouldSyncSearchValue', () => {
	it('syncs external changes even while focused', () => {
		assert.equal(
			shouldSyncSearchValue({
				defaultValue: '',
				lastApplied: 'slack',
				isFocused: true,
			}),
			true,
		);
	});

	it('skips own-navigation catch-up while focused (user typed ahead)', () => {
		assert.equal(
			shouldSyncSearchValue({
				defaultValue: 's',
				lastApplied: 's',
				isFocused: true,
			}),
			false,
		);
	});

	it('syncs when blurred', () => {
		assert.equal(
			shouldSyncSearchValue({
				defaultValue: 's',
				lastApplied: 's',
				isFocused: false,
			}),
			true,
		);
	});
});

describe('shouldApplySearch', () => {
	it('navigates on clear even when the URL has not caught up', () => {
		assert.equal(shouldApplySearch('', 'hello'), true);
	});

	it('skips repeat searches for the applied query', () => {
		assert.equal(shouldApplySearch('hello', 'hello'), false);
	});
});
