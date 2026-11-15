import { normalizeHubConfig } from '../hub/config';
import {
	createManagedPricingCredentialCache,
	getManagedPricingApiKey,
} from '../hub/managed-pricing-auth';
import {
	RUNTIME_PROOF_HEADER,
	runtimeProofHeaders,
} from '../hub/runtime-proof';
import type { HubConfig } from '../hub/types';

// The same vector is pinned in hub's runtime-proof.test.ts and the cloud
// runtime's resolve test, so the three sides can't drift apart. The key is
// what the runtime derives for instance env_1 from the test master secret.
const VECTOR_KEY = 'dsvw8pZBaEmXizLtkhpPE6jfbuFwfbwPHBOwYR9z3s8';
const VECTOR_HEADER =
	't=1793000000,v1=9vp360pXuoCx0xzgNneWeluZog7MF4nhA3ltfWw2-E4';

const hub: HubConfig = {
	projectApiKey: 'ck_cloud_acme.secret',
	signingSecret: '',
	apiUrl: 'https://hub.test',
	instanceKey: 'main',
	runtimeProofKey: VECTOR_KEY,
};

afterEach(() => {
	jest.restoreAllMocks();
});

describe('runtimeProofHeaders', () => {
	it('signs the request the way Hub checks it', () => {
		expect(
			runtimeProofHeaders(hub, {
				path: '/managed-pricing/credentials',
				plugin: 'reducto',
				tenantId: 'me',
				operation: 'parse.parse',
				nowMs: 1_793_000_000_000,
			}),
		).toEqual({ [RUNTIME_PROOF_HEADER]: VECTOR_HEADER });
	});

	it('adds nothing outside the runtime', () => {
		const { runtimeProofKey: _drop, ...selfHosted } = hub;
		expect(
			runtimeProofHeaders(selfHosted, {
				path: '/managed-pricing/credentials',
				plugin: 'reducto',
				tenantId: 'me',
				operation: 'parse.parse',
			}),
		).toEqual({});
	});
});

describe('getManagedPricingApiKey', () => {
	function mockHub() {
		return jest.spyOn(globalThis, 'fetch').mockImplementation(
			async () =>
				new Response(JSON.stringify({ api_key: 'rd-key', expires_in: 300 }), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				}),
		);
	}

	it('sends the runtime proof with the key request', async () => {
		const fetchSpy = mockHub();
		await getManagedPricingApiKey(
			{
				hub,
				plugin: 'reducto',
				tenantId: 'me',
				cache: createManagedPricingCredentialCache(),
			},
			{ operation: 'parse.parse' },
		);
		const headers = new Headers(fetchSpy.mock.calls[0]?.[1]?.headers);
		expect(headers.get(RUNTIME_PROOF_HEADER)).toMatch(/^t=\d+,v1=[\w-]+$/);
	});

	it('sends none from a self-hosted SDK', async () => {
		const fetchSpy = mockHub();
		const { runtimeProofKey: _drop, ...selfHosted } = hub;
		await getManagedPricingApiKey(
			{
				hub: selfHosted,
				plugin: 'reducto',
				tenantId: 'me',
				cache: createManagedPricingCredentialCache(),
			},
			{ operation: 'parse.parse' },
		);
		const headers = new Headers(fetchSpy.mock.calls[0]?.[1]?.headers);
		expect(headers.has(RUNTIME_PROOF_HEADER)).toBe(false);
	});
});

describe('normalizeHubConfig', () => {
	it('keeps the runtime proof key, trimmed, and drops an empty one', () => {
		expect(
			normalizeHubConfig({
				projectApiKey: 'ck_cloud_a.b',
				runtimeProofKey: ' k ',
			}).runtimeProofKey,
		).toBe('k');
		expect(
			normalizeHubConfig({
				projectApiKey: 'ck_cloud_a.b',
				runtimeProofKey: ' ',
			}).runtimeProofKey,
		).toBeUndefined();
	});
});
