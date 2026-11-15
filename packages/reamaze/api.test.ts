/**
 * Live Re:amaze reads, run through createCorsair so the host resolver, the
 * keyBuilder, the Basic auth header and every output schema are exercised
 * against a real brand.
 *
 * Needs all three of `REAMAZE_HOST` (e.g. `acme.reamaze.io`),
 * `REAMAZE_EMAIL` and `REAMAZE_TOKEN`. Without them the suite skips, so CI
 * stays hermetic and no credential is ever committed. When only some are set
 * it warns with the missing names, because a partial config must not read as a
 * pass.
 *
 * Read-only by design: this points at a real account, so nothing here creates,
 * updates or deletes. The instance used for verification has conversations and
 * contacts but no systems and no incidents, so those list assertions tolerate
 * empty collections.
 *
 * @see https://www.reamaze.com/api
 */
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { reamaze } from './index';

const HOST = process.env.REAMAZE_HOST ?? '';
const EMAIL = process.env.REAMAZE_EMAIL ?? '';
const TOKEN = process.env.REAMAZE_TOKEN ?? '';

const MISSING = [
	['REAMAZE_HOST', HOST],
	['REAMAZE_EMAIL', EMAIL],
	['REAMAZE_TOKEN', TOKEN],
]
	.filter(([, value]) => String(value).length === 0)
	.map(([name]) => name);

const RUN_LIVE = MISSING.length === 0;

if (!RUN_LIVE && MISSING.length < 3) {
	console.warn(
		`[reamaze] live API suite skipped: a partial config is not enough. Missing ${MISSING.join(', ')}. Set all of REAMAZE_HOST, REAMAZE_EMAIL and REAMAZE_TOKEN.`,
	);
}

const describeLive = RUN_LIVE ? describe : describe.skip;

/** The credential pair as the key builder JSON-encodes it. */
const KEY = JSON.stringify({ email: EMAIL, token: TOKEN });

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'reamaze', 'default');
	const corsair = createCorsair({
		plugins: [reamaze()],
		database: testDb.db,
		kek: '0123456789abcdef0123456789abcdef',
	});
	await corsair.reamaze.keys.issue_new_dek();
	await corsair.reamaze.keys.set_api_key(KEY);
	await corsair.reamaze.keys.set_host(HOST);
	return { corsair, testDb };
}

type Client = Awaited<ReturnType<typeof createClient>>;
let client: Client;

beforeAll(async () => {
	if (!RUN_LIVE) return;
	client = await createClient();
});

afterAll(() => {
	client?.testDb.cleanup();
});

beforeEach(() => {
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describeLive('Re:amaze live API: reads', () => {
	jest.setTimeout(120_000);

	it('conversations.list parses the paged wrapper', async () => {
		const { conversations, total_count } =
			await client.corsair.reamaze.api.conversations.list({});

		expect(Array.isArray(conversations)).toBe(true);
		expect(conversations.length).toBeGreaterThan(0);
		expect(typeof total_count).toBe('number');
	});

	it('conversations.get parses one conversation by slug', async () => {
		const api = client.corsair.reamaze.api;
		const { conversations } = await api.conversations.list({ page: 1 });
		const slug = conversations[0]?.slug;
		expect(slug).toBeTruthy();
		if (!slug) return;

		const conversation = await api.conversations.get({ slug });
		expect(conversation.slug).toBe(slug);
	});

	it('messages.list parses the paged wrapper', async () => {
		const { messages } = await client.corsair.reamaze.api.messages.list({
			page: 1,
		});

		expect(Array.isArray(messages)).toBe(true);
	});

	it('contacts.list parses the paged wrapper', async () => {
		const { contacts } = await client.corsair.reamaze.api.contacts.list({
			page: 1,
		});

		expect(Array.isArray(contacts)).toBe(true);
		expect(contacts.length).toBeGreaterThan(0);
	});

	it('identities.list parses the identities wrapper', async () => {
		const api = client.corsair.reamaze.api;
		const { contacts } = await api.contacts.list({ page: 1 });
		const email = contacts.find((contact) => contact.email)?.email;
		expect(email).toBeTruthy();
		if (!email) return;

		const { identities } = await api.identities.list({ email });
		expect(Array.isArray(identities)).toBe(true);
	});

	it('notes.list parses the bare array the route answers', async () => {
		const api = client.corsair.reamaze.api;
		const { contacts } = await api.contacts.list({ page: 1 });
		const email = contacts.find((contact) => contact.email)?.email;
		expect(email).toBeTruthy();
		if (!email) return;

		const { notes } = await api.notes.list({ contact: email });
		expect(Array.isArray(notes)).toBe(true);
	});

	it('channels.list parses a body with only total_count', async () => {
		const { channels, total_count } =
			await client.corsair.reamaze.api.channels.list({});

		expect(Array.isArray(channels)).toBe(true);
		expect(typeof total_count).toBe('number');
	});

	it('articles.list parses the paged wrapper', async () => {
		const { articles } = await client.corsair.reamaze.api.articles.list({
			page: 1,
		});

		expect(Array.isArray(articles)).toBe(true);
	});

	it('staff.list parses the paged wrapper', async () => {
		const { staff } = await client.corsair.reamaze.api.staff.list({ page: 1 });

		expect(Array.isArray(staff)).toBe(true);
		expect(staff.length).toBeGreaterThan(0);
	});

	it('responseTemplates.list parses the paged wrapper', async () => {
		const { response_templates } =
			await client.corsair.reamaze.api.responseTemplates.list({ page: 1 });

		expect(Array.isArray(response_templates)).toBe(true);
	});

	it('satisfaction.list parses the paged wrapper', async () => {
		const { satisfaction_ratings } =
			await client.corsair.reamaze.api.satisfaction.list({ page: 1 });

		expect(Array.isArray(satisfaction_ratings)).toBe(true);
	});

	it('systems.list parses the bare array, which can be empty', async () => {
		const { systems } = await client.corsair.reamaze.api.systems.list({});

		expect(Array.isArray(systems)).toBe(true);
	});

	it('incidents.list parses the bare array, which can be empty', async () => {
		const { incidents } = await client.corsair.reamaze.api.incidents.list({});

		expect(Array.isArray(incidents)).toBe(true);
	});
});

describeLive('Re:amaze live API: reports', () => {
	jest.setTimeout(120_000);

	it('reports.volume parses a date-to-count map', async () => {
		const report = await client.corsair.reamaze.api.reports.volume({});

		expect(report.start_date).toBeTruthy();
		expect(report.end_date).toBeTruthy();
		const counts = report.conversation_counts ?? {};
		for (const value of Object.values(counts)) {
			expect(typeof value).toBe('number');
		}
	});

	it('reports.responseTime parses response_times and summary', async () => {
		const report = await client.corsair.reamaze.api.reports.responseTime({});

		expect(report.start_date).toBeTruthy();
		expect(report.response_times ?? report.summary).toBeDefined();
	});

	it('reports.staff parses the report map', async () => {
		const report = await client.corsair.reamaze.api.reports.staff({});

		expect(report.start_date).toBeTruthy();
		expect(
			report.report === undefined || typeof report.report === 'object',
		).toBe(true);
	});

	it('reports.tags parses a tag-to-count map', async () => {
		const report = await client.corsair.reamaze.api.reports.tags({});

		expect(report.start_date).toBeTruthy();
		for (const value of Object.values(report.tags ?? {})) {
			expect(typeof value).toBe('number');
		}
	});

	it('reports.channelSummary parses the channels map', async () => {
		const report = await client.corsair.reamaze.api.reports.channelSummary({});

		expect(report.start_date).toBeTruthy();
		expect(
			report.channels === undefined || typeof report.channels === 'object',
		).toBe(true);
	});
});
