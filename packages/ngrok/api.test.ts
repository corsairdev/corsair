import { createCorsair } from 'corsair/core';
import { NgrokEndpointOutputSchemas as Outputs } from './endpoints/types';
import { ngrok } from './index';

/**
 * Live smoke test. Read-only: nothing here creates, updates or deletes an
 * endpoint, domain, key or subscription, and nothing mints a token.
 *
 * Every answer goes through its output schema before an assertion touches it.
 * Skipped unless NGROK_API_KEY is set, and the skip is logged so it cannot read
 * as a pass.
 */
const apiKey = process.env.NGROK_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('NGROK_API_KEY is not set: live tests skipped');
}

describeIfKey('ngrok live API', () => {
	const corsair = createCorsair({ plugins: [ngrok({ key: apiKey })] });

	it('lists endpoints through the output schema', async () => {
		const parsed = Outputs.endpointsList.parse(
			await corsair.ngrok.api.endpoints.list({ limit: 1 }),
		);

		expect(Array.isArray(parsed.endpoints)).toBe(true);
		for (const endpoint of parsed.endpoints) {
			expect(typeof endpoint.id).toBe('string');
			// A cloud endpoint always has a public URL and an upstream.
			expect(typeof endpoint.public_url).toBe('string');
			expect(typeof endpoint.url).toBe('string');
		}
	}, 30_000);

	it('lists reserved domains through the output schema', async () => {
		const parsed = Outputs.domainsList.parse(
			await corsair.ngrok.api.domains.list({ limit: 1 }),
		);

		expect(Array.isArray(parsed.reserved_domains)).toBe(true);
		for (const domain of parsed.reserved_domains) {
			expect(typeof domain.id).toBe('string');
			expect(typeof domain.domain).toBe('string');
			// The CNAME target is what the caller points DNS at.
			expect(typeof domain.cname_target).toBe('string');
		}
	}, 30_000);

	it('lists tunnels through the output schema', async () => {
		const parsed = Outputs.tunnelsList.parse(
			await corsair.ngrok.api.tunnels.list({ limit: 1 }),
		);

		expect(Array.isArray(parsed.tunnels)).toBe(true);
	}, 30_000);

	it('lists API keys through the output schema, never with a token', async () => {
		const parsed = Outputs.apiKeysList.parse(
			await corsair.ngrok.api.apiKeys.list({ limit: 1 }),
		);

		expect(Array.isArray(parsed.keys)).toBe(true);
		for (const key of parsed.keys) {
			expect(typeof key.id).toBe('string');
			// A list never carries the token; only a create does.
			expect(key.token).toBeUndefined();
		}
	}, 30_000);

	it('lists event subscriptions through the output schema', async () => {
		const parsed = Outputs.eventsList.parse(
			await corsair.ngrok.api.events.list({ limit: 1 }),
		);

		expect(Array.isArray(parsed.event_subscriptions)).toBe(true);
	}, 30_000);
});
