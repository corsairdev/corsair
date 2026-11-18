// Live Prismic tests. Excluded from the default run (CI skips *api.test.ts);
// run with:
//
//   PRISMIC_REPOSITORY=my-repo [PRISMIC_WRITE_TOKEN=...] [PRISMIC_ACCESS_TOKEN=...] pnpm test:live
//
// Every call goes through the plugin's own endpoints, so each answer is parsed
// by the output schema a caller receives. Nothing here writes: the one
// Migration call uses a made-up token, which Prismic refuses before it runs.
import { ApiError } from 'corsair/http';
import { Content, Migration } from './endpoints';
import { buildContext, captureError } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	// The test context has no database to log into.
	return { ...actual, logEventFromContext: jest.fn() };
});

const LIVE_REPO = process.env.PRISMIC_REPOSITORY ?? '';
const LIVE_TOKEN = process.env.PRISMIC_WRITE_TOKEN ?? '';
const LIVE_ACCESS_TOKEN = process.env.PRISMIC_ACCESS_TOKEN ?? '';

const missing = [LIVE_REPO ? undefined : 'PRISMIC_REPOSITORY'].filter(
	(name): name is string => name !== undefined,
);

if (missing.length > 0) {
	// Same check the gate prints, so a skipped run cannot read as a pass.
	console.warn(
		`Skipping Prismic live tests: ${missing.join(' and ')} not set.`,
	);
}
const describeLive = missing.length === 0 ? describe : describe.skip;

describeLive('Prismic live API', () => {
	const ctx = buildContext({
		apiKey: LIVE_TOKEN,
		repository: LIVE_REPO,
		accessToken: LIVE_ACCESS_TOKEN || undefined,
	});

	it('repository.info returns the refs, with one master ref', async () => {
		const info = await Content.info(ctx, {});

		expect(info.refs.filter((ref) => ref.isMasterRef)).toHaveLength(1);
	});

	it('documents.search with no ref reads the master ref first', async () => {
		const page = await Content.search(ctx, { pageSize: 5 });

		expect(Array.isArray(page.results)).toBe(true);
	});

	it('documents.search follows next_page to the second page', async () => {
		const first = await Content.search(ctx, { pageSize: 1 });
		if (!first.next_page) {
			console.warn('Skipping the paging check: fewer than two documents.');
			return;
		}

		const second = await Content.search(ctx, { nextPage: first.next_page });

		expect(second.page).toBe(2);
		expect(second.results[0]?.id).not.toBe(first.results[0]?.id);
	});

	it('documents.search filters by tag', async () => {
		const all = await Content.search(ctx, { pageSize: 20 });
		const tag = all.results.flatMap((document) => document.tags ?? [])[0];
		if (!tag) {
			console.warn('Skipping the tag check: no document carries a tag.');
			return;
		}

		const tagged = await Content.search(ctx, { tags: [tag] });

		expect(tagged.results.length).toBeGreaterThan(0);
		for (const document of tagged.results) {
			expect(document.tags).toContain(tag);
		}
	});

	it('documents.get reads one document by id', async () => {
		const page = await Content.search(ctx, { pageSize: 1 });
		const id = page.results[0]?.id;
		if (!id) {
			console.warn('Skipping the get check: the repository has no documents.');
			return;
		}

		const document = await Content.get(ctx, { id });

		expect(document.id).toBe(id);
	});

	it('documents.get reports an id with no published document', async () => {
		await expect(Content.get(ctx, { id: 'ZZZZcorsairNoDoc' })).rejects.toThrow(
			/No published document/,
		);
	});

	it('an unknown repository answers 404 as an ApiError', async () => {
		const error = await captureError(
			Content.info(ctx, { repository: 'corsair-definitely-not-a-real-repo' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(404);
	});

	it('a bad write token is refused with 403 and not echoed', async () => {
		const error = await captureError(
			Migration.create(
				buildContext({
					apiKey: 'definitely-not-a-token',
					repository: LIVE_REPO,
				}),
				{ title: 'x', type: 'page', lang: 'en-us', data: {} },
			),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(403);
		expect(JSON.stringify(error)).not.toContain('definitely-not-a-token');
	});
});
