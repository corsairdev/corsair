import { buildConnectPluginManifestFromContext } from '../hub/setup-introspect';
import { decryptSyncManifest, encryptSyncManifest } from '../hub/sync-payload';

// Integration-level credential fields (gmail's topic_id / pubsub_audience) are
// CUSTOMER-scope infrastructure config. They belong on the hub grid's
// credentials surface (fed by the connections sync manifest) — never on the
// tenant-facing connect page (fed by the connect manifest).
const gmailLikePlugin = {
	id: 'gmail',
	options: { authType: 'oauth_2' },
	authConfig: {
		oauth_2: {
			integration: ['topic_id', 'pubsub_audience'],
			account: ['email_address'],
		},
	},
} as never;

const hub = {
	apiUrl: 'http://localhost:5001',
	projectApiKey: 'ck_dev_test',
	signingSecret: 'csec_test',
} as never;

describe('integration credential field surfaces', () => {
	it('tenant connect manifest excludes integration-level fields', async () => {
		const [entry] = await buildConnectPluginManifestFromContext(
			{ plugins: [gmailLikePlugin], database: undefined, kek: 'kek', hub },
			'default',
			{ skipOAuthUrlGeneration: true },
		);
		expect(entry.credentialFields ?? []).not.toEqual(
			expect.arrayContaining(['topic_id']),
		);
		expect(entry.credentialFields ?? []).not.toEqual(
			expect.arrayContaining(['pubsub_audience']),
		);
	});

	it('connections sync manifest carries integrationCredentialFields', () => {
		const encrypted = encryptSyncManifest(
			{
				tenants: [{ id: 'default' }],
				plugins: [
					{
						id: 'gmail',
						authType: 'oauth_2',
						configured: false,
						missingFields: [],
						integrationCredentialFields: ['topic_id', 'pubsub_audience'],
					},
				],
				syncedAt: new Date().toISOString(),
			},
			'csec_test',
		);
		const manifest = decryptSyncManifest(encrypted, 'csec_test');
		expect(manifest.plugins[0].integrationCredentialFields).toEqual([
			'topic_id',
			'pubsub_audience',
		]);
	});
});
