import assert from 'node:assert/strict';
import {
	decodeConnectionId,
	encodeConnectionId,
	mapAuthStatus,
	parseOperationPaths,
} from './corsair-tool-provider.js';

// connectionId encodes (tenant, toolkit) and round-trips
const id = encodeConnectionId('acme', 'github');
assert.deepEqual(decodeConnectionId(id), {
	tenantId: 'acme',
	toolkit: 'github',
});

// tenants with awkward characters survive the round-trip
const weird = encodeConnectionId('tenant:with:colons', 'slack');
assert.deepEqual(decodeConnectionId(weird), {
	tenantId: 'tenant:with:colons',
	toolkit: 'slack',
});

// garbage decodes to null, not a throw
assert.equal(decodeConnectionId('not-base64url-json'), null);
assert.equal(decodeConnectionId(''), null);

// auth status mapping: only a live credential completes the flow; everything
// else stays pending so an in-progress authorize poll is not aborted.
assert.equal(mapAuthStatus('connected'), 'completed');
assert.equal(mapAuthStatus('missing_credentials'), 'pending');
assert.equal(mapAuthStatus('not_connected'), 'pending');
assert.equal(mapAuthStatus(undefined), 'pending');

// operation-path parsing tolerates blank lines and whitespace
assert.deepEqual(
	parseOperationPaths('github.api.repos.list\n\n  github.api.issues.list  \n'),
	['github.api.repos.list', 'github.api.issues.list'],
);
assert.deepEqual(parseOperationPaths(''), []);

console.log('corsair-tool-provider.check: all assertions passed');
