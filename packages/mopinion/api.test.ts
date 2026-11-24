import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mopinion } from './index';

/**
 * Live smoke against read-only operations. Skipped unless a Mopinion public
 * key and signature token are provided. Nothing here writes; the v3 data API
 * is read-only anyway.
 *
 *   MOPINION_PUBLIC_KEY=... MOPINION_SIGNATURE_TOKEN=... pnpm test:live
 */
const publicKey = process.env.MOPINION_PUBLIC_KEY;
const signatureToken = process.env.MOPINION_SIGNATURE_TOKEN;
const describeIfKey = publicKey && signatureToken ? describe : describe.skip;

if (!publicKey || !signatureToken) {
	const missing = [
		!publicKey && 'MOPINION_PUBLIC_KEY',
		!signatureToken && 'MOPINION_SIGNATURE_TOKEN',
	]
		.filter(Boolean)
		.join(', ');
	console.warn(`Skipping Mopinion live tests: set ${missing}.`);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mopinion', 'default');
	const corsair = createCorsair({
		plugins: [mopinion({ publicKey, signatureToken })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('mopinion live', () => {
	jest.setTimeout(30_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(() => {
		client?.testDb.cleanup();
	});

	// Ids found by walking the account: report -> dataset -> feedback item.
	let reportId: number | undefined;
	let datasetId: number | undefined;
	let feedbackId: number | string | undefined;

	it('reads the account and its reports', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.mopinion.api.account.get({});
		expect(result._meta?.code).toBe(200);
		reportId = result.reports?.[0]?.id ?? undefined;
		datasetId = result.reports?.[0]?.dataSets?.[0]?.id ?? undefined;
		expect(typeof reportId).toBe('number');
		expect(typeof datasetId).toBe('number');
	});

	it('reads a report and its fields', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const report = await corsair.mopinion.api.reports.get({
			reportId: reportId as number,
		});
		expect(report.id).toBe(reportId);
		const fields = await corsair.mopinion.api.reports.fields({
			reportId: reportId as number,
		});
		expect(Array.isArray(fields.data)).toBe(true);
	});

	it('reads a dataset and its fields', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const dataset = await corsair.mopinion.api.datasets.get({
			datasetId: datasetId as number,
		});
		expect(dataset.id).toBe(datasetId);
		const fields = await corsair.mopinion.api.datasets.fields({
			datasetId: datasetId as number,
		});
		expect(Array.isArray(fields.data)).toBe(true);
	});

	it('pages dataset and report feedback, with a filter', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const page = await corsair.mopinion.api.datasets.feedback({
			datasetId: datasetId as number,
			limit: 2,
			sort: 'created',
			order: 'desc',
		});
		expect(page._meta?.count).toBe(page.data?.length);
		feedbackId = page.data?.[0]?.id ?? undefined;
		const filtered = await corsair.mopinion.api.reports.feedback({
			reportId: reportId as number,
			limit: 2,
			filters: { date_from: '2020-01-01' },
		});
		expect(Array.isArray(filtered.data)).toBe(true);
	});

	it('reads one feedback item through the dataset and the report', async () => {
		if (feedbackId === undefined) return;
		const { corsair } = client as NonNullable<typeof client>;
		const byDataset = await corsair.mopinion.api.datasets.feedbackItem({
			datasetId: datasetId as number,
			feedbackId,
		});
		expect(byDataset.data?.[0]?.id).toBe(feedbackId);
		const byReport = await corsair.mopinion.api.reports.feedbackItem({
			reportId: reportId as number,
			feedbackId,
		});
		expect(byReport.data?.[0]?.id).toBe(feedbackId);
	});

	it('reads a deployment when MOPINION_DEPLOYMENT_KEY is set', async () => {
		const key = process.env.MOPINION_DEPLOYMENT_KEY;
		if (!key) return;
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.mopinion.api.deployments.get({
			deploymentId: key,
		});
		expect(result.id).toBe(key);
	});
});
