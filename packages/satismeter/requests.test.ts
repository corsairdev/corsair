import { satismeter } from './index';
import {
	PROJECT_BODY,
	RESPONSES_BODY,
	RESPONSES_LAST_PAGE_BODY,
	STATISTICS_BODY,
	SURVEY_BODY,
	SURVEYS_BODY,
	USERS_BODY,
} from './test-fixtures';
import {
	fetchCallCount,
	installFetchMock,
	makeCtx,
	respond,
	restoreFetchMock,
	sentBody,
	sentHeaders,
	sentMethod,
	sentQuery,
	sentUrl,
} from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

/**
 * The real endpoint tree, so each operation keeps its own input and output
 * types. Endpoint functions are invoked directly, which means a wrong query
 * selector shows up as a wrong URL rather than as a silently different result.
 */
function endpoints() {
	const tree = satismeter({ key: 'sa-test-key' }).endpoints;
	if (!tree) throw new Error('the plugin registers no endpoints');
	return tree;
}

const PROJECT = '61fce0adea447e24ec27d606';
const SURVEY = '61fce0adea447e24ec27d609';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('projects.get', () => {
	it('reads a project from the versioned base with a bearer token', async () => {
		respond(PROJECT_BODY);

		const result = await endpoints().projects.get(makeCtx(), {
			projectId: PROJECT,
		});

		expect(sentUrl().origin + sentUrl().pathname).toBe(
			`https://app.satismeter.com/api/v3/projects/${PROJECT}`,
		);
		expect(sentMethod()).toBe('GET');
		expect(sentHeaders().get('Authorization')).toBe('Bearer sa-test-key');
		expect(result.project).toEqual(PROJECT_BODY.data);
	});

	it('escapes a project id rather than pasting it into the path', async () => {
		respond(PROJECT_BODY);

		await endpoints().projects.get(makeCtx(), { projectId: 'a/b c' });

		// A raw slash would silently change the route being called.
		expect(sentUrl().pathname).toContain('a%2Fb%20c');
	});
});

describe('surveys.list', () => {
	it('reads the surveys of a project', async () => {
		respond(SURVEYS_BODY);

		const result = await endpoints().surveys.list(makeCtx(), {
			projectId: PROJECT,
		});

		expect(sentUrl().pathname).toBe(`/api/v3/projects/${PROJECT}/campaigns`);
		expect(result.surveys).toHaveLength(2);
		expect(result.surveys[0]).toMatchObject({ type: 'csat', state: 'live' });
	});

	it('does not send a query it was not given', async () => {
		respond(SURVEYS_BODY);

		await endpoints().surveys.list(makeCtx(), { projectId: PROJECT });

		expect([...sentQuery().keys()]).toEqual([]);
	});
});

describe('surveys.get', () => {
	it('reads one survey by id', async () => {
		respond(SURVEY_BODY);

		const result = await endpoints().surveys.get(makeCtx(), {
			projectId: PROJECT,
			surveyId: SURVEY,
		});

		expect(sentUrl().pathname).toBe(
			`/api/v3/projects/${PROJECT}/campaigns/${SURVEY}`,
		);
		expect(result.survey.id).toBe(SURVEY);
	});
});

describe('responses.list', () => {
	it('reads a page of responses and its cursor', async () => {
		respond(RESPONSES_BODY);

		const result = await endpoints().responses.list(makeCtx(), {
			projectId: PROJECT,
		});

		expect(sentUrl().pathname).toBe(`/api/v3/projects/${PROJECT}/responses`);
		expect(result.responses).toHaveLength(2);
		expect(result.page.hasNextPage).toBe(true);
		expect(result.page.nextPageCursor).toContain('eyJjcmVhdGVk');
		expect(result.page.size).toBe(20);
	});

	it('sends the date range, cursor and page size', async () => {
		respond(RESPONSES_BODY);

		await endpoints().responses.list(makeCtx(), {
			projectId: PROJECT,
			startDate: '2026-01-01T00:00:00.000Z',
			endDate: '2026-02-01T00:00:00.000Z',
			pageCursor: 'cursor-abc',
			pageSize: 100,
		});

		expect(sentQuery().get('startDate')).toBe('2026-01-01T00:00:00.000Z');
		expect(sentQuery().get('endDate')).toBe('2026-02-01T00:00:00.000Z');
		expect(sentQuery().get('pageCursor')).toBe('cursor-abc');
		expect(sentQuery().get('pageSize')).toBe('100');
	});

	it('reports the last page when the cursor is absent', async () => {
		respond(RESPONSES_LAST_PAGE_BODY);

		const result = await endpoints().responses.list(makeCtx(), {
			projectId: PROJECT,
			pageCursor: 'last-cursor',
		});

		expect(result.page.hasNextPage).toBe(false);
		expect(result.page.nextPageCursor).toBeUndefined();
		expect(result.responses).toEqual([]);
	});

	it('keeps the answer shapes the spec allows', async () => {
		respond(RESPONSES_BODY);

		const result = await endpoints().responses.list(makeCtx(), {
			projectId: PROJECT,
		});

		const [first] = result.responses;
		expect(first?.answers?.[0]?.value).toBe(5);
		expect(first?.answers?.[1]?.value).toBe('Nothing. Everything is great.');
		expect(first?.user?.traits).toMatchObject({ name: 'Jane Doe' });
		expect(result.responses[1]?.referrer).toBeNull();
	});
});

describe('responses.listForSurvey', () => {
	it('reads one survey\u2019s responses', async () => {
		respond(RESPONSES_BODY);

		const result = await endpoints().responses.listForSurvey(makeCtx(), {
			projectId: PROJECT,
			surveyId: SURVEY,
		});

		expect(sentUrl().pathname).toBe(
			`/api/v3/projects/${PROJECT}/campaigns/${SURVEY}/responses`,
		);
		expect(result.responses).toHaveLength(2);
	});

	it('sends the range without a cursor when none is given', async () => {
		respond(RESPONSES_BODY);

		await endpoints().responses.listForSurvey(makeCtx(), {
			projectId: PROJECT,
			surveyId: SURVEY,
			pageSize: 50,
		});

		expect(sentQuery().get('pageSize')).toBe('50');
		expect(sentQuery().has('pageCursor')).toBe(false);
	});
});

describe('surveys.statistics', () => {
	it('reads the counts and per-question breakdown', async () => {
		respond(STATISTICS_BODY);

		const result = await endpoints().surveys.statistics(makeCtx(), {
			projectId: PROJECT,
			surveyId: SURVEY,
		});

		expect(sentUrl().pathname).toBe(
			`/api/v3/projects/${PROJECT}/campaigns/${SURVEY}/statistics`,
		);
		expect(result.statistics.responses).toBe(2);
		expect(result.statistics.responseRate).toBe(1);
		expect(result.questions).toHaveLength(2);
	});

	it('keeps a long-text question that has no values array', async () => {
		respond(STATISTICS_BODY);

		const result = await endpoints().surveys.statistics(makeCtx(), {
			projectId: PROJECT,
			surveyId: SURVEY,
		});

		const longText = result.questions[1];
		expect(longText?.type).toBe('long-text');
		expect(longText?.statistics?.answers).toBe(1);
		expect(longText?.statistics?.values).toBeUndefined();
	});

	it('sends the date range', async () => {
		respond(STATISTICS_BODY);

		await endpoints().surveys.statistics(makeCtx(), {
			projectId: PROJECT,
			surveyId: SURVEY,
			startDate: '2026-01-01T00:00:00.000Z',
		});

		expect(sentQuery().get('startDate')).toBe('2026-01-01T00:00:00.000Z');
	});
});

describe('users.upsert', () => {
	it('posts to the unversioned users base, not /v3', async () => {
		respond('', 200);

		await endpoints().users.upsert(makeCtx(), {
			projectId: PROJECT,
			userId: '007',
			traits: { name: 'James Bond', plan: 'Gold' },
		});

		// The users API is the one surface outside /api/v3.
		expect(sentUrl().origin + sentUrl().pathname).toBe(
			'https://app.satismeter.com/api/users',
		);
		expect(sentMethod()).toBe('POST');
		expect(sentHeaders().get('Content-Type')).toBe('application/json');
	});

	it('sends userId, project and traits under the provider names', async () => {
		respond('', 200);

		await endpoints().users.upsert(makeCtx(), {
			projectId: PROJECT,
			userId: '007',
			traits: { name: 'James Bond', email: '007@sis.gov.uk' },
		});

		expect(sentBody()).toEqual({
			userId: '007',
			project: PROJECT,
			traits: { name: 'James Bond', email: '007@sis.gov.uk' },
		});
	});

	it('sends surveyDate when the caller sets it', async () => {
		respond('', 200);

		await endpoints().users.upsert(makeCtx(), {
			projectId: PROJECT,
			userId: '007',
			surveyDate: '2100-01-01T00:00:00.000Z',
		});

		expect(sentBody()).toMatchObject({
			surveyDate: '2100-01-01T00:00:00.000Z',
		});
	});

	it('omits traits and surveyDate rather than sending them empty', async () => {
		respond('', 200);

		await endpoints().users.upsert(makeCtx(), {
			projectId: PROJECT,
			userId: '007',
		});

		// An empty traits object would clear traits the user already has.
		expect(sentBody()).toEqual({ userId: '007', project: PROJECT });
	});
});

describe('users.track', () => {
	it('posts a track event with type, userId, event and project', async () => {
		respond('', 200);

		const result = await endpoints().users.track(makeCtx(), {
			projectId: PROJECT,
			userId: '007',
			event: 'completed-checkout',
		});

		expect(sentUrl().pathname).toBe('/api/users');
		expect(sentMethod()).toBe('POST');
		expect(sentBody()).toEqual({
			type: 'track',
			userId: '007',
			event: 'completed-checkout',
			project: PROJECT,
		});
		expect(result).toEqual({
			userId: '007',
			event: 'completed-checkout',
			accepted: true,
		});
	});
});

describe('users.list', () => {
	it('reads the users of a project', async () => {
		respond(USERS_BODY);

		const result = await endpoints().users.list(makeCtx(), {
			projectId: PROJECT,
		});

		expect(sentUrl().pathname).toBe('/api/users');
		expect(sentQuery().get('project')).toBe(PROJECT);
		expect(result.users).toHaveLength(1);
		expect(result.users[0]?.id).toBe('5808e7031a943c7e564cdb17');
	});

	it('filters by userId when given', async () => {
		respond({ users: [] });

		await endpoints().users.list(makeCtx(), {
			projectId: PROJECT,
			userId: '007',
		});

		expect(sentQuery().get('userId')).toBe('007');
	});

	it('accepts an empty list, which a project with no users returns', async () => {
		respond({ users: [] });

		const result = await endpoints().users.list(makeCtx(), {
			projectId: PROJECT,
		});

		expect(result.users).toEqual([]);
	});
});

describe('users.remove', () => {
	it('deletes by internal id on the users base', async () => {
		respond('', 204);

		const result = await endpoints().users.remove(makeCtx(), {
			userId: '5808e7031a943c7e564cdb17',
		});

		expect(sentUrl().origin + sentUrl().pathname).toBe(
			'https://app.satismeter.com/api/users/5808e7031a943c7e564cdb17',
		);
		expect(sentMethod()).toBe('DELETE');
		expect(result).toEqual({
			userId: '5808e7031a943c7e564cdb17',
			removed: true,
		});
	});

	it('sends no body', async () => {
		respond('', 204);

		await endpoints().users.remove(makeCtx(), { userId: 'abc' });

		expect(sentBody()).toBeUndefined();
	});

	it('fails the call when the API refuses the delete', async () => {
		respond({ errors: [{ title: 'User not found' }] }, 404);

		await expect(
			endpoints().users.remove(makeCtx(), { userId: 'nope' }),
		).rejects.toMatchObject({ status: 404, title: 'User not found' });
	});
});

describe('one request per call', () => {
	it('does not retry inside the client', async () => {
		respond(PROJECT_BODY);

		await endpoints().projects.get(makeCtx(), { projectId: PROJECT });

		expect(fetchCallCount()).toBe(1);
	});
});
