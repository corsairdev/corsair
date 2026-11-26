// Live Brave Search API tests. CI never runs `*api.test.ts`; run them with:
//
//   BRAVE_SEARCH_API_KEY=... npx jest api.test.ts
//   BRAVE_SEARCH_ADMIN_KEY=bsk_admin_... also runs the admin.* checks
//
// Each successful search spends one request on the key's plan (about 15 here);
// failed calls are free. Calls go through createCorsair, so the plugin's
// error handlers apply as in production. An operation outside the key's plan
// must fail with Brave's OPTION_NOT_IN_PLAN, not with a plugin error.
import { createCorsair } from 'corsair/core';
import { bravesearch } from './index';

const key = process.env.BRAVE_SEARCH_API_KEY?.trim() ?? '';
const adminKey = process.env.BRAVE_SEARCH_ADMIN_KEY?.trim() ?? '';
if (!key) {
	console.warn(
		'[bravesearch] live API tests skipped: set BRAVE_SEARCH_API_KEY to enable them.',
	);
}
const live = key ? describe : describe.skip;

// `unknown` is necessary because a thrown value has no guaranteed type.
async function inPlanOr<T>(call: Promise<T>): Promise<T | 'not in plan'> {
	try {
		return await call;
	} catch (error) {
		const body = (error as { body?: { error?: { code?: string } } }).body;
		if (body?.error?.code === 'OPTION_NOT_IN_PLAN') return 'not in plan';
		throw error;
	}
}

live('Brave Search live API', () => {
	jest.setTimeout(3 * 60_000);
	const api = createCorsair({
		plugins: [bravesearch({ key, ...(adminKey ? { adminKey } : {}) })],
	}).bravesearch.api;

	it('web.search returns web results and a rich callback key', async () => {
		const result = await api.web.search({
			q: 'weather in london',
			count: 3,
			enable_rich_callback: true,
		});
		expect(result.query?.original).toBe('weather in london');
		expect(result.web?.results?.length).toBeGreaterThan(0);
		const callbackKey = result.rich?.hint?.callback_key;
		expect(callbackKey).toEqual(expect.any(String));

		const rich = await api.web.rich({ callback_key: callbackKey ?? '' });
		expect(rich.results?.[0]?.subtype).toBe('weather');
	});

	it('llm.context returns grounding text within the token budget', async () => {
		const result = await api.llm.context({
			q: 'tallest mountains in the world',
			count: 3,
			maximum_number_of_tokens: 1024,
		});
		expect(result.grounding?.generic?.[0]?.snippets?.length).toBeGreaterThan(0);
	});

	it.each([
		['news', () => api.news.search({ q: 'brave search', count: 2 })],
		['videos', () => api.videos.search({ q: 'rust programming', count: 2 })],
		['images', () => api.images.search({ q: 'golden gate bridge', count: 2 })],
	] as const)('%s.search returns results', async (_name, run) => {
		const result = await run();
		expect(result.results?.length).toBeGreaterThan(0);
	});

	it('local.placeSearch ids feed local.pois and local.descriptions', async () => {
		const places = await api.local.placeSearch({
			q: 'coffee',
			location: 'san francisco ca united states',
			count: 2,
		});
		const ids = (places.results ?? []).flatMap((r) => (r.id ? [r.id] : []));
		expect(ids.length).toBeGreaterThan(0);

		const pois = await api.local.pois({ ids });
		expect(pois.results?.[0]?.id).toEqual(expect.any(String));

		const descriptions = await api.local.descriptions({ ids });
		expect(descriptions.results?.length).toBeGreaterThan(0);
	});

	it('suggest, spellcheck and answers succeed or report OPTION_NOT_IN_PLAN', async () => {
		const suggest = await inPlanOr(api.suggest.search({ q: 'hello wor' }));
		if (suggest !== 'not in plan') expect(suggest.results).toBeDefined();
		const spell = await inPlanOr(api.spellcheck.search({ q: 'helo wrold' }));
		if (spell !== 'not in plan') expect(spell.results).toBeDefined();
		const answer = await inPlanOr(
			api.answers.create({
				messages: [
					{ role: 'user', content: 'What is the second highest mountain?' },
				],
				enable_citations: true,
			}),
		);
		if (answer !== 'not in plan') {
			expect(answer.choices[0]?.message.content.length).toBeGreaterThan(0);
		}
	});

	(adminKey ? it : it.skip)(
		'admin.me and admin.usage read the organization',
		async () => {
			const me = await api.admin.me({});
			expect(me.status).toBe('active');
			const usage = await api.admin.usage({
				starting_at: new Date(Date.now() - 86_400_000).toISOString(),
				bucket_width: '1h',
				group_by: ['endpoint'],
			});
			expect(Array.isArray(usage.data)).toBe(true);
		},
	);
});
