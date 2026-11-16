import { createCorsair } from 'corsair/core';
import { KitEndpointOutputSchemas as Outputs } from './endpoints/types';
import { kit } from './index';

// Live smoke tests. They run only with a real key, and every answer goes
// through the operation's output schema before an assertion touches it, so a
// field typed wrongly fails here as well as for a caller. Read-only: nothing
// here creates a subscriber or spends a send.
const apiKey = process.env.KIT_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a pass.
	console.warn('KIT_API_KEY is not set: live tests skipped');
}

describeIfKey('Kit live API', () => {
	const corsair = createCorsair({
		plugins: [kit({ key: apiKey })],
	});

	it('reads the account through the output schema', async () => {
		const parsed = Outputs.accountGet.parse(
			await corsair.kit.api.account.get({}),
		);

		expect(
			typeof parsed.account.id === 'number' || parsed.account.id === null,
		).toBe(true);
	}, 30_000);

	it('lists the first page of active subscribers through the output schema', async () => {
		const parsed = Outputs.subscribersList.parse(
			await corsair.kit.api.subscribers.list({ per_page: 5 }),
		);

		expect(Array.isArray(parsed.subscribers)).toBe(true);
		for (const subscriber of parsed.subscribers) {
			expect(typeof subscriber.id).toBe('number');
			expect(typeof subscriber.email_address).toBe('string');
		}
	}, 30_000);

	it('lists tags with their subscriber counts through the output schema', async () => {
		const parsed = Outputs.tagsList.parse(
			await corsair.kit.api.tags.list({ include: ['subscriber_count'] }),
		);

		expect(Array.isArray(parsed.tags)).toBe(true);
	}, 30_000);

	it('lists custom fields with their keys through the output schema', async () => {
		const parsed = Outputs.customFieldsList.parse(
			await corsair.kit.api.customFields.list({}),
		);

		expect(Array.isArray(parsed.custom_fields)).toBe(true);
	}, 30_000);

	it('lists forms through the output schema', async () => {
		const parsed = Outputs.formsList.parse(
			await corsair.kit.api.forms.list({}),
		);

		expect(Array.isArray(parsed.forms)).toBe(true);
	}, 30_000);
});
