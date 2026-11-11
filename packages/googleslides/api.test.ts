import { createCorsair } from 'corsair/core';
import { googleslides } from './index';

/**
 * Live smoke. Read-only, and it creates one throwaway deck so the slide reads
 * have something to read. CI ignores this file (the test script's ignore
 * pattern covers *.api.test.ts) and it skips without a token.
 *
 * The token is a Google OAuth access token for a test account, with the
 * presentations and drive scopes. GOOGLESLIDES_TOKEN is deliberately not
 * GOOGLESLIDES_API_KEY: there is no API-key flow for this API.
 */
const token = process.env.GOOGLESLIDES_TOKEN;

if (!token) {
	console.warn(
		'[googleslides] GOOGLESLIDES_TOKEN is not set, so the live smoke tests are skipped.',
	);
}

const describeIfToken = token ? describe : describe.skip;

describeIfToken('googleslides live smoke', () => {
	let testDb: ReturnType<typeof import('corsair/tests').createTestDatabase>;
	let corsair: ReturnType<typeof createCorsair>;
	let presentationId: string | undefined;

	beforeAll(async () => {
		// Imported here so the module is only loaded when the suite actually runs.
		const { createIntegrationAndAccount, createTestDatabase } = await import(
			'corsair/tests'
		);
		testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'googleslides', 'default');
		corsair = createCorsair({
			plugins: [googleslides({ key: token })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
	}, 60_000);

	afterAll(async () => {
		// Delete the deck the suite created, so repeated runs do not fill the
		// account. A failure here is reported but does not fail the suite.
		if (presentationId) {
			await corsair.googleslides.api.presentations
				.delete({ presentationId })
				.catch((error: unknown) => {
					// unknown: cleanup failure, logged only.
					console.warn('Could not delete the smoke-test deck:', error);
				});
		}
		testDb.cleanup();
	}, 60_000);

	it('creates a presentation and returns parsed counts', async () => {
		const created = await corsair.googleslides.api.presentations.create({
			title: `Corsair smoke test ${new Date().toISOString()}`,
		});
		presentationId = created.presentationId;

		expect(created.presentationId).toBeTruthy();
		expect(created.url).toContain(created.presentationId);
		// A new deck is blank apart from its masters and layouts.
		expect(created.slideCount).toBe(0);
		expect(created.layoutCount).toBeGreaterThan(0);
		expect(created.masterCount).toBeGreaterThan(0);
	}, 60_000);

	it('reads the presentation back through its output schema', async () => {
		const read = await corsair.googleslides.api.presentations.get({
			presentationId: presentationId as string,
		});

		expect(read.presentationId).toBe(presentationId);
		expect(read.pageWidthEmu).toBeGreaterThan(0);
	}, 60_000);

	it('adds a slide and lists it', async () => {
		const created = await corsair.googleslides.api.slides.create({
			presentationId: presentationId as string,
			layout: 'TITLE_AND_BODY',
		});
		expect(created.slideObjectId).toBeTruthy();
		// Reading back names the layout Google actually applied.
		expect(created.layoutObjectId).toBeTruthy();

		const listed = await corsair.googleslides.api.slides.list({
			presentationId: presentationId as string,
		});
		expect(listed.slides).toHaveLength(1);
		expect(listed.slides[0]?.objectId).toBe(created.slideObjectId);
	}, 60_000);

	it('lists presentations through Drive and finds the deck', async () => {
		const page = await corsair.googleslides.api.presentations.list({
			pageSize: 10,
			query: `name contains 'Corsair smoke test'`,
		});

		expect(Array.isArray(page.files)).toBe(true);
		expect(
			page.files.map((file: { presentationId: string }) => file.presentationId),
		).toContain(presentationId);
	}, 60_000);

	it('exports the deck as a PDF, and the bytes really are a PDF', async () => {
		const exported = await corsair.googleslides.api.presentations.exportPdf({
			presentationId: presentationId as string,
		});

		const bytes = Buffer.from(exported.data, 'base64');
		expect(bytes.byteLength).toBe(exported.byteLength);
		expect(bytes.subarray(0, 4).toString()).toBe('%PDF');
	}, 120_000);
});
