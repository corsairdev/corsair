import assert from 'node:assert/strict';
import type { AnyCorsairInstance } from 'corsair';
import type { CorsairToolProviderConfig } from './corsair-tool-provider.js';
import {
	CorsairToolProvider,
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

// ── resolveTenant precedence (tenant isolation) ─────────────────────────────
// A stub Corsair whose management methods record the tenant they were called
// with, so we can assert which tenant each request resolved to.
function providerWith(
	tenantId: CorsairToolProviderConfig['tenantId'],
	seen: { tenant?: string },
) {
	const corsair = {
		manage: {
			connect: {
				createLink: async ({ tenantId }: { tenantId?: string }) => {
					seen.tenant = tenantId;
					return { connectUrl: 'https://connect.example', tenantId };
				},
			},
			connectionStatus: {
				get: async ({ tenantId }: { tenantId?: string }) => {
					seen.tenant = tenantId;
					return {};
				},
			},
		},
	};
	return new CorsairToolProvider({
		corsair: corsair as unknown as AnyCorsairInstance,
		tenantId,
	});
}

// A pinned tenant wins: a connectionId claiming another tenant cannot override it.
{
	const seen: { tenant?: string } = {};
	await providerWith('acme', seen).getConnectionStatus({
		items: [
			{ connectionId: encodeConnectionId('victim', 'slack'), toolkit: 'slack' },
		],
	});
	assert.equal(seen.tenant, 'acme');
}

// Caller known + connectionId for a different tenant → rejected (no cross-tenant).
await assert.rejects(
	providerWith(undefined, {}).resolveToolsVNext({
		toolSlugs: ['slack.api.channels.list'],
		authorId: 'alice',
		connectionId: encodeConnectionId('bob', 'slack'),
		toolkit: 'slack',
		toolMeta: {},
	}),
	/cross-tenant/,
);

// Fresh connection + function resolver + no context → throws, never silently
// opens OAuth under a fallback tenant. (A fresh authorize carries an opaque
// connectionId Mastra minted, which does not decode to our tenant format.)
await assert.rejects(
	providerWith(() => 'x', {}).authorize({
		toolkit: 'slack',
		connectionId: 'fresh-opaque-connection',
	}),
	/cannot resolve a tenant for a new connection/,
);

// Pinned happy path: authorize uses the pin and mints a matching authId.
{
	const seen: { tenant?: string } = {};
	const res = await providerWith('acme', seen).authorize({
		toolkit: 'slack',
		connectionId: 'fresh-opaque-connection',
	});
	assert.equal(seen.tenant, 'acme');
	assert.equal(res.authId, encodeConnectionId('acme', 'slack'));
}

// No caller context (getConnectionStatus): the connectionId is the tenant source
// even when a function resolver is configured.
{
	const seen: { tenant?: string } = {};
	await providerWith(() => 'ignored', seen).getConnectionStatus({
		items: [
			{ connectionId: encodeConnectionId('real', 'slack'), toolkit: 'slack' },
		],
	});
	assert.equal(seen.tenant, 'real');
}

console.log('corsair-tool-provider.check: all assertions passed');
