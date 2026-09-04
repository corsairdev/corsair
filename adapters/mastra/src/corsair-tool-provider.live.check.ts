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

// getToolSchema returns null (not a throw) for an operation the instance
// doesn't expose; the JSON-schema path is exercised live via the editor.
assert.equal(await provider.getToolSchema('github.api.repos.list'), null);

// revokeConnection is idempotent: an unreadable connectionId is a no-op, not a
// throw (the real disconnect path is covered by corsair's disconnect.test.ts).
await provider.revokeConnection('not-a-valid-connection-id');

const conns = await provider.listConnections({
	userId: 'dev',
	toolkit: 'github',
});
assert.equal(conns.items.length, 0);

// P1 regression: an existing connectionId is authoritative over a function
// tenantId resolver, so a connection stays on the tenant it was created for
// (authorize and resolveToolsVNext cannot diverge). The throwing resolver would
// run only if connectionId precedence were lost.
const fnProvider = new CorsairToolProvider({
	corsair,
	tenantId: () => {
		throw new Error('resolver must not run when a connectionId is present');
	},
});
const boundId = encodeConnectionId('bound-tenant', 'github');
const bound = await fnProvider.getConnectionStatus({
	items: [{ connectionId: boundId, toolkit: 'github' }],
});
assert.deepEqual(bound, { [boundId]: { connected: false } });

testDb.cleanup();
console.log('corsair-tool-provider.live.check.ts passed');
