import { makeVeriphoneRequest } from './client';
import type { CoverageResponse, CreditsResponse } from './endpoints/types';
import { VeriphoneEndpointOutputSchemas } from './endpoints/types';

// Live API tests — skipped unless VERIPHONE_API_KEY is set in the
// environment. They hit the real Veriphone API and prove the endpoint
// output schemas accept the shapes the provider actually returns.
// Docs: https://veriphone.io/docs/v3
const VERIPHONE_API_KEY = process.env.VERIPHONE_API_KEY;

const describeOrSkip = VERIPHONE_API_KEY ? describe : describe.skip;

describeOrSkip('Veriphone API Type Tests', () => {
	it('verify returns correct type', async () => {
		const response = await makeVeriphoneRequest(
			'v3/verify',
			VERIPHONE_API_KEY!,
			{ query: { phone: '+14169670000' } },
		);

		const parsed = VeriphoneEndpointOutputSchemas.verify.parse(response);
		expect(parsed.status).toBe('success');
		expect(parsed.phone_valid).toBe(true);
		expect(parsed.country_code).toBe('CA');
	});

	it('verify with mode=current returns current-carrier fields', async () => {
		const response = await makeVeriphoneRequest(
			'v3/verify',
			VERIPHONE_API_KEY!,
			{ query: { phone: '+14169670000', mode: 'current' } },
		);

		const parsed = VeriphoneEndpointOutputSchemas.verify.parse(response);
		expect(parsed.status).toBe('success');
		expect(parsed.mode).toBe('current');
		expect(parsed).toHaveProperty('original_carrier');
	});

	it('credits returns correct type', async () => {
		const response = await makeVeriphoneRequest<CreditsResponse>(
			'v3/credits',
			VERIPHONE_API_KEY!,
		);

		const parsed = VeriphoneEndpointOutputSchemas.credits.parse(response);
		expect(typeof parsed.counter).toBe('number');
		expect(parsed.active).toBe(true);
	});

	it('coverage returns a country list', async () => {
		const response = await makeVeriphoneRequest<CoverageResponse>(
			'v3/coverage/current',
			VERIPHONE_API_KEY!,
		);

		const parsed = VeriphoneEndpointOutputSchemas.coverage.parse(response);
		expect(Array.isArray(parsed.countries)).toBe(true);
		expect(parsed.countries.length).toBeGreaterThan(0);
		expect(parsed.countries[0]).toHaveProperty('iso');
	});
});
