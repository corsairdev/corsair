import { createCorsair, createIntegrationKeyManager } from '../core';
import { exchangeCodeForTokens } from '../core/auth/exchange';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { generateOAuthUrl, processOAuthCallback } from '../oauth';
import { pkceChallenge } from '../oauth/pkce';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

jest.mock('../hub/report-connection-status', () => ({
	...jest.requireActual('../hub/report-connection-status'),
	reportPluginConnectionStatus: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../core/auth/exchange', () => ({
	...jest.requireActual('../core/auth/exchange'),
	exchangeCodeForTokens: jest.fn(async () => ({ access_token: 'at' })),
}));

jest.mock('../webhooks/resolve-oauth-tenant-link', () => ({
	resolveOAuthWebhookTenantLink: jest.fn().mockResolvedValue(null),
}));

const KEK = 'test-kek-with-at-least-32-characters!!';
const REDIRECT = 'https://app.example/oauth/callback';

const plugin = (id: string, pkce: boolean) =>
	({
		id,
		options: { authType: 'oauth_2' as const },
		oauthConfig: {
			providerName: id,
			authUrl: `https://${id}.example/authorize`,
			tokenUrl: `https://${id}.example/token`,
			scopes: ['read'],
			pkce,
			...(pkce ? { authParams: { code_challenge_method: 's256' } } : {}),
		},
	}) as unknown as CorsairPlugin;

describe('PKCE through generateOAuthUrl and processOAuthCallback', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: ReturnType<typeof createCorsair>;

	beforeEach(async () => {
		jest.clearAllMocks();
		env = createTestDatabase();
		corsair = createCorsair({
			plugins: [plugin('canvaish', true), plugin('plain', false)],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
		});
		getCorsairInternal(corsair).database!.isPg = false;
		await setupCorsair(corsair, { tenantId: 't1' });
		for (const id of ['canvaish', 'plain']) {
			const km = createIntegrationKeyManager({
				authType: 'oauth_2',
				integrationName: id,
				kek: KEK,
				database: getCorsairInternal(corsair).database!,
			});
			await km.set_client_id('cid');
			await km.set_client_secret('csec');
		}
	});
	afterEach(() => env?.cleanup?.());

	const signIn = async (pluginId: string) => {
		const { url, state } = await generateOAuthUrl(corsair, pluginId, {
			tenantId: 't1',
			redirectUri: REDIRECT,
		});
		await processOAuthCallback(corsair, {
			code: 'code',
			state,
			redirectUri: REDIRECT,
		});
		const sent = jest.mocked(exchangeCodeForTokens).mock.calls.at(-1);
		return { link: new URL(url).searchParams, verifier: sent?.[5] };
	};

	it('exchanges with the verifier whose challenge the link carried', async () => {
		const { link, verifier } = await signIn('canvaish');
		expect(link.get('code_challenge_method')).toBe('s256');
		expect(verifier).toBeDefined();
		expect(pkceChallenge(verifier as string)).toBe(link.get('code_challenge'));
	});

	it('gives every sign-in its own challenge', async () => {
		const first = await signIn('canvaish');
		const second = await signIn('canvaish');
		expect(first.link.get('code_challenge')).not.toBe(
			second.link.get('code_challenge'),
		);
		expect(first.verifier).not.toBe(second.verifier);
	});

	it('leaves a provider without pkce as it was', async () => {
		const { link, verifier } = await signIn('plain');
		expect(link.has('code_challenge')).toBe(false);
		expect(verifier).toBeUndefined();
	});
});
