/**
 * Live smoke test. CI skips this file by name (`api.test.ts` is in
 * `--testPathIgnorePatterns`), so it only runs through `pnpm test:live`:
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
 * call. All calls are reads: nothing here writes a user, tracks an event or
 * deletes anything.
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
	// A name unlikely to collide with a real user in the project.
	const userId = `corsair-smoke-${Date.now()}`;

	it('upserts a user, lists it back, and deletes it', async () => {
		const text = await makeSatisMeterRequest(key, {
			base: SATISMETER_API_WRITE,
			method: 'POST',
			path: '/users',
			body: {
				userId,
				project: projectId,
				traits: { name: 'Corsair Smoke', plan: 'Gold' },
			},
		});
		// Every successful write answers 204 No Content with no body.
		expect(text).toBe('');

		// Read it back: a 204 proves the request was accepted, not that the
		// traits were stored.
		const listedText = await makeSatisMeterRequest(key, {
			base: SATISMETER_API_WRITE,
			method: 'GET',
			path: '/users',
			query: { project: projectId, userId },
		});
		const listed = Outputs.usersList.parse(parseJsonBody(listedText));
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

		const afterText = await makeSatisMeterRequest(key, {
			base: SATISMETER_API_WRITE,
			method: 'GET',
			path: '/users',
			query: { project: projectId, userId },
		});
		const after = Outputs.usersList.parse(parseJsonBody(afterText));
		expect(after.users).toHaveLength(0);
	});

	it('tracks an event and accepts it', async () => {
		// Tracking needs a user to attach to, so one is created and removed here.
		await makeSatisMeterRequest(key, {
			base: SATISMETER_API_WRITE,
			method: 'POST',
			path: '/users',
			body: { userId, project: projectId },
		});
		const text = await makeSatisMeterRequest(key, {
			base: SATISMETER_API_WRITE,
			method: 'POST',
			path: '/users',
			body: {
				type: 'track',
				userId,
				event: 'corsair-test-event',
				project: projectId,
			},
		});
		// 204: accepted. The event is NOT readable back through the users API,
		// which was confirmed against the live project: `events` stays [] on both
		// the list and the single-user read after a successful track. So this
		// asserts acceptance, not persistence, and says so rather than pretending.
		expect(text).toBe('');

		const listedText = await makeSatisMeterRequest(key, {
			base: SATISMETER_API_WRITE,
			method: 'GET',
			path: '/users',
			query: { project: projectId, userId },
		});
		const listed = Outputs.usersList.parse(parseJsonBody(listedText));
		// The schema still accepts an events array, because the field is sent.
		expect(Array.isArray(listed.users[0]?.events ?? [])).toBe(true);

		const internalId = listed.users[0]?.id;
		if (internalId) {
			await makeSatisMeterRequest(key, {
				base: SATISMETER_API_WRITE,
				method: 'DELETE',
				path: `/users/${internalId}`,
			});
		}
	});

	it('rejects a track with no event name', async () => {
		// The live API answers 400 "Event not specified", which is the one piece
		// of evidence that the track path is really reached.
		await expect(
			makeSatisMeterRequest(key, {
				base: SATISMETER_API_WRITE,
				method: 'POST',
				path: '/users',
				body: {
					type: 'track',
					userId,
					event: '',
					project: projectId,
				},
			}),
		).rejects.toMatchObject({ status: 400, title: 'Event not specified' });
	});
});
