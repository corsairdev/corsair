import { buildConnectPluginManifestFromContext } from '../hub/setup-introspect';

// Plugins can declare integration-level credential fields (gmail's topic_id /
// pubsub_audience). If the connect manifest omits them, no credentials form
// ever renders their inputs and BYO users have no way to provide them.
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

async function buildManifest() {
	return buildConnectPluginManifestFromContext(
		{ plugins: [gmailLikePlugin], database: undefined, kek: 'kek', hub },
		'default',
		{ skipOAuthUrlGeneration: true },
	);
}

describe('connect manifest credential fields', () => {
	it('includes integration-level credential fields', async () => {
		const [entry] = await buildManifest();
		expect(entry.credentialFields).toEqual(
			expect.arrayContaining(['topic_id', 'pubsub_audience']),
		);
	});

	it('keeps account-level fields and has no duplicates', async () => {
		const [entry] = await buildManifest();
		expect(entry.credentialFields).toEqual(
			expect.arrayContaining(['email_address']),
		);
		expect(new Set(entry.credentialFields).size).toBe(
			entry.credentialFields?.length,
		);
	});
});
