import { createCorsair } from 'corsair/core';
import { dub } from './index';

// Live smoke, skipped unless DUB_API_KEY is set. Read-only and few calls:
// analytics endpoints have per-second caps, so the suite stays at four
// requests. CI ignores this file by name.
const describeIfKey = process.env.DUB_API_KEY ? describe : describe.skip;

function createClient() {
	return createCorsair({
		plugins: [dub({ key: process.env.DUB_API_KEY })],
	});
}

describeIfKey('dub live smoke', () => {
	const corsair = createClient();

	it('lists links and pages by the derived cursor', async () => {
		const page = await corsair.dub.api.links.list({});
		expect(Array.isArray(page.items)).toBe(true);
		if (page.items.length > 0) {
			expect(typeof page.items[0]?.id).toBe('string');
		}
	});

	it('lists tags', async () => {
		const page = await corsair.dub.api.tags.list({ pageSize: 5 });
		expect(Array.isArray(page.items)).toBe(true);
	});

	it('lists domains', async () => {
		const page = await corsair.dub.api.domains.list({ pageSize: 5 });
		expect(Array.isArray(page.items)).toBe(true);
	});

	it('lists a small page of events', async () => {
		const page = await corsair.dub.api.events.list({ limit: 5 });
		expect(Array.isArray(page.items)).toBe(true);
		for (const row of page.items) {
			expect(['click', 'lead', 'sale']).toContain(row.event);
		}
	});
});
