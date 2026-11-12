/**
 * Live smoke test. CI skips this file by name (the workflow passes
 * `api.test.ts` in `--testPathIgnorePatterns`). The package's own `pnpm test`
 * is plain `jest` like every other plugin, so it collects this file too; without
 * the variables below every suite here skips. Run it on purpose with:
 *
 *   SATISMETER_API_KEY=... SATISMETER_PROJECT_ID=... \
 *     pnpm --filter @corsair-dev/satismeter test:live
 *
 * It needs two variables, because SatisMeter's API has no endpoint that lists
 * projects: the project ID is only visible in the dashboard
 * (Settings > Integrations > API). When only one of the two is set the suite
 * says which is missing rather than passing quietly as skipped.
 *
 * Every answer is parsed through its output schema before it is asserted on, so
 * a field typed wrongly throws here instead of for a caller on a successful
 * call. The first suite only reads. The second one writes (upserts a user,
 * tracks an event, deletes the user again) and runs only when
 * `SATISMETER_WRITE_API_KEY` is also set.
 */
import {
	makeSatisMeterRequest,
	parseJsonBody,
	SATISMETER_API_V3,
	SATISMETER_API_WRITE,
} from './client';
import { readEnvelope } from './endpoints/call';
import { SatisMeterEndpointOutputSchemas as Outputs } from './endpoints/types';

const API_KEY = process.env.SATISMETER_API_KEY;
/**
 * The users API refuses the browser write key, so a live write needs the API
 * key. It is opt-in through its own variable: a read-only smoke run should not
 * create or delete anything.
 */
const WRITE_API_KEY = process.env.SATISMETER_WRITE_API_KEY;
const PROJECT_ID = process.env.SATISMETER_PROJECT_ID;

const missing = [
	API_KEY ? undefined : 'SATISMETER_API_KEY',
	PROJECT_ID ? undefined : 'SATISMETER_PROJECT_ID',
].filter((name): name is string => name !== undefined);

if (missing.length > 0) {
	console.warn(
		`satismeter live smoke skipped: set ${missing.join(' and ')} to run it`,
	);
}

const describeIfConfigured = missing.length === 0 ? describe : describe.skip;

// Writing is opt-in, and says so rather than skipping silently.
const describeIfWritable = WRITE_API_KEY ? describe : describe.skip;
if (!WRITE_API_KEY && missing.length === 0) {
	console.warn(
		'satismeter live write smoke skipped: set SATISMETER_WRITE_API_KEY to run it',
	);
}

describeIfConfigured('live SatisMeter API', () => {
	const key = API_KEY ?? '';
	const projectId = PROJECT_ID ?? '';

	async function read(path: string): Promise<ReturnType<typeof readEnvelope>> {
		const text = await makeSatisMeterRequest(key, {
			base: SATISMETER_API_V3,
			method: 'GET',
			path,
		});
		return readEnvelope(text);
	}

	it('reads the project', async () => {
		const envelope = await read(`/projects/${projectId}`);
		const result = Outputs.projectsGet.parse({ project: envelope.data });

		expect(result.project.id).toBe(projectId);
	});

	it('lists the surveys of the project', async () => {
		const envelope = await read(`/projects/${projectId}/campaigns`);
		const result = Outputs.surveysList.parse({ surveys: envelope.data });

		// A new project legitimately has none, so the array is what is asserted.
		expect(Array.isArray(result.surveys)).toBe(true);
	});

	it('reads the first page of project responses', async () => {
		const envelope = await read(`/projects/${projectId}/responses?pageSize=1`);
		const result = Outputs.responsesList.parse({
			responses: envelope.data,
			page: envelope.page,
		});

		expect(Array.isArray(result.responses)).toBe(true);
		expect(typeof result.page.hasNextPage).toBe('boolean');
		// The documented default is 20 and the cap is 100; asking for 1 pins it.
		expect(result.responses.length).toBeLessThanOrEqual(1);
	});

	it('reads one survey and its statistics when the project has one', async () => {
		const surveysEnvelope = await read(`/projects/${projectId}/campaigns`);
		const surveys = Outputs.surveysList.parse({
			surveys: surveysEnvelope.data,
		});
		const first = surveys.surveys[0];
		if (!first) {
			// Nothing to read in an empty project; the list test above is the
			// coverage that applies.
			console.warn('satismeter live smoke: project has no surveys to read');
			return;
		}

		const surveyEnvelope = await read(
			`/projects/${projectId}/campaigns/${first.id}`,
		);
		const survey = Outputs.surveysGet.parse({ survey: surveyEnvelope.data });
		expect(survey.survey.id).toBe(first.id);

		const statsEnvelope = await read(
			`/projects/${projectId}/campaigns/${first.id}/statistics`,
		);
		const stats = Outputs.statisticsGet.parse(statsEnvelope.data);
		expect(Array.isArray(stats.questions)).toBe(true);
	});
});

describeIfWritable('live SatisMeter writes', () => {
	const key = WRITE_API_KEY ?? '';
	const projectId = PROJECT_ID ?? '';
	/** A name unlikely to collide with a real user in the project. */
	const userFor = (label: string) => `corsair-smoke-${label}-${Date.now()}`;

	// unknown: this sends raw request bodies (upserts and track events, some
	// deliberately invalid) past the plugin's input schemas, so values vary.
	function upsert(body: Record<string, unknown>) {
		return makeSatisMeterRequest(key, {
			base: SATISMETER_API_WRITE,
			method: 'POST',
			path: '/users',
			body,
		});
	}

	function listUser(userId: string) {
		return makeSatisMeterRequest(key, {
			base: SATISMETER_API_WRITE,
			method: 'GET',
			path: '/users',
			query: { project: projectId, userId },
		});
	}

	/**
	 * These tests write to a real project, so a user created by one must be
	 * removed even when an assertion fails part-way. Cleanup is registered before
	 * the assertions run, and each test uses its own userId: sharing one meant the
	 * first test deleted the user the second still needed.
	 */
	const created: string[] = [];

	// unknown: traits are a free-form map the provider stores as sent.
	async function createUser(userId: string, traits?: Record<string, unknown>) {
		// Register before the call: the write may land and still fail to answer.
		created.push(userId);
		await upsert({
			userId,
			project: projectId,
			...(traits === undefined ? {} : { traits }),
		});
	}

	afterEach(async () => {
		for (const userId of created.splice(0)) {
			try {
				const text = await listUser(userId);
				const { users } = Outputs.usersList.parse(parseJsonBody(text));
				// Delete only the exact user this run created, never another row.
				const internalId = users.find((user) => user.userId === userId)?.id;
				if (!internalId) continue;
				await makeSatisMeterRequest(key, {
					base: SATISMETER_API_WRITE,
					method: 'DELETE',
					path: `/users/${internalId}`,
				});
			} catch {
				// A cleanup failure must not mask the test's own result; the next
				// run's list would show a leftover, which is what this prevents.
			}
		}
	});

	it('upserts a user, lists it back, and deletes it', async () => {
		const userId = userFor('upsert');
		await createUser(userId, { name: 'Corsair Smoke', plan: 'Gold' });

		// Read it back: a 204 proves the request was accepted, not that the
		// traits were stored.
		const text = await listUser(userId);
		const listed = Outputs.usersList.parse(parseJsonBody(text));
		expect(listed.users).toHaveLength(1);
		expect(listed.users[0]?.traits).toMatchObject({ plan: 'Gold' });

		const internalId = listed.users[0]?.id;
		expect(internalId).toBeDefined();
		if (!internalId) throw new Error('the created user had no id');

		const removed = await makeSatisMeterRequest(key, {
			base: SATISMETER_API_WRITE,
			method: 'DELETE',
			path: `/users/${internalId}`,
		});
		// The provider documents 204 and the live API answers it.
		expect(removed).toBe('');

		const afterText = await listUser(userId);
		const after = Outputs.usersList.parse(parseJsonBody(afterText));
		expect(after.users).toHaveLength(0);
	});

	it('tracks an event and accepts it', async () => {
		const userId = userFor('track');
		await createUser(userId);

		const text = await upsert({
			type: 'track',
			userId,
			event: 'corsair-test-event',
			project: projectId,
		});
		// 204: accepted. The event is NOT readable back through the users API,
		// which was confirmed against the live project: `events` stays [] on both
		// the list and the single-user read after a successful track. So this
		// asserts acceptance, not persistence, and says so rather than pretending.
		expect(text).toBe('');

		const listText = await listUser(userId);
		const listed = Outputs.usersList.parse(parseJsonBody(listText));
		// The schema still accepts an events array, because the field is sent.
		expect(Array.isArray(listed.users[0]?.events ?? [])).toBe(true);
	});

	it('rejects a track with no event name', async () => {
		const userId = userFor('reject');
		await createUser(userId);

		// The live API answers 400 "Event not specified", which is the one piece
		// of evidence that the track path is really reached.
		await expect(
			upsert({
				type: 'track',
				userId,
				event: '',
				project: projectId,
			}),
		).rejects.toMatchObject({ status: 400, title: 'Event not specified' });
	});
});
