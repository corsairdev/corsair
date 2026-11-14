// Live Prismic smoke tests. Excluded from the default run; run with:
//
//   PRISMIC_REPOSITORY=my-repo [PRISMIC_WRITE_TOKEN=...] pnpm test:live
//
// Every test is a read, and every answer is parsed through the same output
// schema a caller receives, so a field typed wrongly cannot pass silently.
// Nothing here writes: the Migration API creates real drafts, which this suite
// does not do without an explicit repository.
import {
	makePrismicRequest,
	PRISMIC_MIGRATION_BASE,
	PrismicAPIError,
} from './client';
import {
	DocumentSchema,
	PrismicEndpointOutputSchemas,
} from './endpoints/types';
import { captureError } from './test-helpers';

const LIVE_REPO = process.env.PRISMIC_REPOSITORY ?? '';
const LIVE_TOKEN = process.env.PRISMIC_WRITE_TOKEN ?? '';

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
	it('reads the repository metadata through the output schema', async () => {
		const raw = await makePrismicRequest(
			{ repository: LIVE_REPO },
			{ method: 'GET', api: 'content', url: '' },
		);
		const parsed = PrismicEndpointOutputSchemas.repositoryInfo.parse(raw);

		expect(Array.isArray(parsed.refs)).toBe(true);
		// A query is pinned to a ref, so one must exist.
		expect(parsed.refs.length).toBeGreaterThan(0);
	});

	it('queries documents through the output schema', async () => {
		const meta = PrismicEndpointOutputSchemas.repositoryInfo.parse(
			await makePrismicRequest(
				{ repository: LIVE_REPO },
				{ method: 'GET', api: 'content', url: '' },
			),
		);
		const master = meta.refs.find((ref) => ref.isMasterRef) ?? meta.refs[0];

		const raw = await makePrismicRequest(
			{ repository: LIVE_REPO },
			{
				method: 'GET',
				api: 'content',
				url: '/documents/search',
				query: { pageSize: 2, ref: master?.ref ?? undefined },
			},
		);
		const parsed = PrismicEndpointOutputSchemas.documentsSearch.parse(raw);

		expect(Array.isArray(parsed.results)).toBe(true);
		for (const document of parsed.results) {
			expect(DocumentSchema.safeParse(document).success).toBe(true);
		}
	});

	it('rejects a repository that does not exist, which answers 401 with no body', async () => {
		const error = await captureError(
			makePrismicRequest(
				{ repository: 'corsair-definitely-not-a-real-repo' },
				{ method: 'GET', api: 'content', url: '' },
			),
		);

		expect(error).toBeInstanceOf(PrismicAPIError);
		if (!(error instanceof PrismicAPIError)) return;
		expect(error.status).toBe(401);
		expect(error.credentialsRejected).toBe(true);
	});

	it('rejects a bad write token without echoing it', async () => {
		if (LIVE_TOKEN.length === 0) {
			console.warn(
				'Skipping the write-token check: PRISMIC_WRITE_TOKEN is not set.',
			);
			return;
		}

		const error = await captureError(
			makePrismicRequest(
				{ repository: LIVE_REPO, writeToken: 'definitely-not-a-token' },
				{
					method: 'POST',
					api: 'migration',
					url: '/documents',
					body: { title: 'x', type: 'page', lang: 'en-us', data: {} },
				},
			),
		);

		expect(error).toBeInstanceOf(PrismicAPIError);
		if (!(error instanceof PrismicAPIError)) return;
		expect([401, 403]).toContain(error.status);
		expect(JSON.stringify(error)).not.toContain('definitely-not-a-token');
	});

	it('exposes the documented Migration host', () => {
		expect(PRISMIC_MIGRATION_BASE).toBe('https://migration.prismic.io');
	});
});
