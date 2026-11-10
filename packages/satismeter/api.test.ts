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
import { makeSatisMeterRequest, SATISMETER_API_V3 } from './client';
import { readEnvelope } from './endpoints/call';
import { SatisMeterEndpointOutputSchemas as Outputs } from './endpoints/types';

const API_KEY = process.env.SATISMETER_API_KEY;
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
