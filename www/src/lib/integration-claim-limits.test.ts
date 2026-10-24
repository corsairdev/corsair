import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	canClaimMore,
	MAX_USER_BUILT_INTEGRATIONS,
} from './integration-claim-limits';

describe('canClaimMore', () => {
	it('caps a contributor at five held claims', () => {
		assert.equal(MAX_USER_BUILT_INTEGRATIONS, 5);
		assert.equal(canClaimMore(0), true);
		assert.equal(canClaimMore(MAX_USER_BUILT_INTEGRATIONS - 1), true);
		assert.equal(canClaimMore(MAX_USER_BUILT_INTEGRATIONS), false);
	});

	it('stays closed if the count somehow exceeds the cap', () => {
		assert.equal(canClaimMore(MAX_USER_BUILT_INTEGRATIONS + 1), false);
		assert.equal(canClaimMore(10), false);
	});
});
