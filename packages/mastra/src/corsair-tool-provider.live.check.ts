import assert from 'node:assert/strict';
import { createCorsair } from 'corsair/core';
import { createTestDatabase } from 'corsair/tests';
import {
	CorsairToolProvider,
	encodeConnectionId,
} from './corsair-tool-provider.js';

// Runs against a REAL corsair instance (not a hand-written stub), so the
// provider's assumptions about corsair.manage are checked against the actual
// namespace. A stubbed manage previously hid a `manage.status` vs
// `manage.connectionStatus` mismatch that only surfaced on a live authorize poll.
const testDb = createTestDatabase();
const corsair = createCorsair({
	plugins: [],
	database: testDb.db,
	kek: 'test-kek-12345678901234567890123456789012',
});
const provider = new CorsairToolProvider({ corsair, tenantId: 'dev' });

const cid = encodeConnectionId('dev', 'github');

// The three methods that go through corsair.manage.connectionStatus.
const cs = await provider.getConnectionStatus({
	items: [{ connectionId: cid, toolkit: 'github' }],
});
assert.deepEqual(cs, { [cid]: { connected: false } });

assert.equal(await provider.getAuthStatus(cid), 'pending');

const conns = await provider.listConnections({
	userId: 'dev',
	toolkit: 'github',
});
assert.equal(conns.items.length, 0);

testDb.cleanup();
console.log('corsair-tool-provider.live.check.ts passed');
