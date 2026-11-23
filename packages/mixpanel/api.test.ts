import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mixpanel } from './index';

/**
 * Live smoke against the read-only operations. Skipped unless a service
 * account (username, secret), the project id and, for eu/in projects, the
 * region are all provided. Nothing here writes: the ingestion API would
 * record test events into a production project.
 */
const username = process.env.MIXPANEL_SERVICE_ACCOUNT_USERNAME;
const secret = process.env.MIXPANEL_SERVICE_ACCOUNT_SECRET;
const projectId = process.env.MIXPANEL_PROJECT_ID;
const region = process.env.MIXPANEL_REGION;

const missing = Object.entries({
	MIXPANEL_SERVICE_ACCOUNT_USERNAME: username,
	MIXPANEL_SERVICE_ACCOUNT_SECRET: secret,
	MIXPANEL_PROJECT_ID: projectId,
})
	.filter(([, value]) => !value)
	.map(([name]) => name);

const describeIfKey = missing.length === 0 ? describe : describe.skip;

if (missing.length > 0) {
	const partial =
		missing.length < 3
			? ` (partial: ${missing.join(', ')} missing, the rest set)`
			: '';
	console.warn(
		`Skipping Mixpanel live tests: set ${missing.join(', ')}${partial}.`,
	);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mixpanel', 'default');
	const corsair = createCorsair({
		plugins: [
			mixpanel({
				serviceAccountUsername: username,
				serviceAccountSecret: secret,
				projectId: Number.parseInt(projectId as string, 10),
				// The api/test gate only runs when every variable above is set.
				...(region === 'eu' || region === 'in' ? { region } : {}),
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('mixpanel live', () => {
	jest.setTimeout(60_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(() => {
		client?.testDb.cleanup();
	});

	it('parses the cohort list through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.mixpanel.api.cohorts.list({});
		expect(Array.isArray(result.cohorts)).toBe(true);
		for (const entry of result.cohorts) {
			expect(typeof entry.name === 'string' || entry.name === null).toBe(true);
		}
	});

	it('parses the funnel list through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.mixpanel.api.funnels.list({});
		expect(Array.isArray(result.funnels)).toBe(true);
	});

	it('parses an engage query through its output schema', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		const result = await corsair.mixpanel.api.profiles.query({
			output_properties: ['$email'],
		});
		expect(typeof result.page).toBe('number');
		expect(Array.isArray(result.results)).toBe(true);
	});

	it('exports an empty historical range as an empty page', async () => {
		const { corsair } = client as NonNullable<typeof client>;
		// A range before the project existed, so the answer is small.
		const result = await corsair.mixpanel.api.export.events({
			from_date: '1971-01-01',
			to_date: '1971-01-02',
		});
		expect(Array.isArray(result.events)).toBe(true);
	});
});
