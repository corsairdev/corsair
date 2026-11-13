import { createCorsair } from 'corsair/core';
import { KickboxEndpointOutputSchemas as Outputs } from './endpoints/types';
import { kickbox } from './index';

// Live smoke tests. They run only with a real key, and every answer goes
// through the operation's output schema before an assertion touches it, so a
// field typed wrongly fails here as well as for a caller. One verification call
// spends one credit, and nothing here writes anything else.
const apiKey = process.env.KICKBOX_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a pass.
	console.warn('KICKBOX_API_KEY is not set: live tests skipped');
}

describeIfKey('Kickbox live API', () => {
	const corsair = createCorsair({
		plugins: [kickbox({ key: apiKey })],
	});

	it('verifies one address through the output schema', async () => {
		const parsed = Outputs.verify.parse(
			await corsair.kickbox.api.verify.verify({ email: 'test@example.com' }),
		);

		expect(['deliverable', 'undeliverable', 'risky', 'unknown']).toContain(
			parsed.result,
		);
		expect(parsed.success).toBe(true);
	}, 30_000);

	it('checks a disposable domain through the output schema', async () => {
		const parsed = Outputs.disposable.parse(
			await corsair.kickbox.api.verify.disposable({
				address: 'mailinator.com',
			}),
		);

		expect(parsed.disposable).toBe(true);
	}, 30_000);

	it('answers false for a domain that is not disposable', async () => {
		const parsed = Outputs.disposable.parse(
			await corsair.kickbox.api.verify.disposable({ address: 'google.com' }),
		);

		expect(parsed.disposable).toBe(false);
	}, 30_000);
});
