import type {
	ProjectsGetResponse,
	ResponsesPageResponse,
	StatisticsGetResponse,
	SurveysListResponse,
	UsersListResponse,
} from './endpoints/types';
import {
	SatisMeterEndpointInputSchemas as Inputs,
	SatisMeterEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import {
	EMPTY_SURVEYS_BODY,
	PROJECT_BODY,
	RESPONSES_BODY,
	STATISTICS_BODY,
	SURVEYS_BODY,
	USERS_BODY,
} from './test-fixtures';

/**
 * The output schemas are what a caller's parsed result goes through, so they are
 * exercised directly: a field typed wrong here throws on a successful call.
 */
function parseAs<T>(schema: { parse: (value: object) => T }, value: object) {
	return schema.parse(value);
}

describe('the { data } envelope', () => {
	it('unwraps a project', () => {
		const result = parseAs<ProjectsGetResponse>(Outputs.projectsGet, {
			project: PROJECT_BODY.data,
		});
		expect(result.project.name).toBe('SatisMeter Sample App');
	});

	it('rejects a project answer with no id', () => {
		expect(() =>
			parseAs(Outputs.projectsGet, { project: { name: 'no id' } }),
		).toThrow();
	});

	it('unwraps a survey list', () => {
		const result = parseAs<SurveysListResponse>(Outputs.surveysList, {
			surveys: SURVEYS_BODY.data,
		});
		expect(result.surveys.map((survey) => survey.type)).toEqual([
			'csat',
			'nps',
		]);
	});

	it('accepts an empty survey list', () => {
		const result = parseAs<SurveysListResponse>(Outputs.surveysList, {
			surveys: EMPTY_SURVEYS_BODY.data,
		});
		expect(result.surveys).toEqual([]);
	});

	it('keeps a survey template the plugin has not seen', () => {
		// A template added after this release must not fail a list already read.
		const result = parseAs<SurveysListResponse>(Outputs.surveysList, {
			surveys: [{ id: 'a', type: 'some-new-template', state: 'live' }],
		});
		expect(result.surveys[0]?.type).toBe('some-new-template');
	});

	it('rejects a survey list whose rows are not objects', () => {
		expect(() =>
			parseAs(Outputs.surveysList, { surveys: ['csat', 'nps'] }),
		).toThrow();
	});
});

describe('responses', () => {
	it('parses a page with its cursor', () => {
		const result = parseAs<ResponsesPageResponse>(Outputs.responsesList, {
			responses: RESPONSES_BODY.data,
			page: RESPONSES_BODY.page,
		});
		expect(result.responses).toHaveLength(2);
		expect(result.page.hasNextPage).toBe(true);
	});

	it('accepts the shape of every answer value the spec allows', () => {
		const result = parseAs<ResponsesPageResponse>(Outputs.responsesList, {
			responses: [
				{
					id: 'a',
					answers: [{ value: 5 }, { value: 'text' }, { value: ['one', 'two'] }],
				},
			],
			page: { hasNextPage: false, nextPageCursor: null, size: 20 },
		});
		expect(result.responses[0]?.answers?.map((a) => a.value)).toEqual([
			5,
			'text',
			['one', 'two'],
		]);
	});

	it('reads the cursor from nextPageCursor, the field the API sends', () => {
		// The provider's spec and live responses both use camelCase here. A
		// snake_case reading would yield undefined and silently replay page one.
		const result = parseAs<ResponsesPageResponse>(Outputs.responsesList, {
			responses: [],
			page: { hasNextPage: true, nextPageCursor: 'abc', size: 20 },
		});
		expect(result.page.nextPageCursor).toBe('abc');
	});

	it('rejects a page object missing hasNextPage', () => {
		expect(() =>
			parseAs(Outputs.responsesList, {
				responses: [],
				page: { nextPageCursor: null, size: 20 },
			}),
		).toThrow();
	});

	it('rejects a response row with no id', () => {
		expect(() =>
			parseAs(Outputs.responsesList, {
				responses: [{ created: '2026-01-01T00:00:00.000Z' }],
				page: { hasNextPage: false, size: 20 },
			}),
		).toThrow();
	});

	it('keeps a response field the plugin does not know', () => {
		const result = parseAs<ResponsesPageResponse>(Outputs.responsesList, {
			responses: [{ id: 'a', addedLater: 'kept' }],
			page: { hasNextPage: false, size: 20 },
		});
		expect(result.responses[0]).toMatchObject({ addedLater: 'kept' });
	});
});

describe('statistics', () => {
	it('parses counts and questions', () => {
		const result = parseAs<StatisticsGetResponse>(
			Outputs.statisticsGet,
			STATISTICS_BODY.data,
		);
		expect(result.statistics.responses).toBe(2);
		expect(result.questions).toHaveLength(2);
		expect(result.questions[0]?.statistics?.metric?.value).toBe(50);
	});

	it('accepts a response rate of 0', () => {
		const result = parseAs<StatisticsGetResponse>(Outputs.statisticsGet, {
			statistics: { responses: 0, displays: 5, responseRate: 0 },
			questions: [],
		});
		expect(result.statistics.responseRate).toBe(0);
	});

	it('rejects questions that are not an array', () => {
		expect(() =>
			parseAs(Outputs.statisticsGet, {
				statistics: { responses: 1 },
				questions: { id: 'a' },
			}),
		).toThrow();
	});
});

describe('users', () => {
	it('parses the users list', () => {
		const result = parseAs<UsersListResponse>(Outputs.usersList, USERS_BODY);
		expect(result.users[0]?.id).toBe('5808e7031a943c7e564cdb17');
		expect(result.users[0]?.unsubscribed).toBe(false);
	});

	it('keeps the events array the live answer adds', () => {
		// The provider's article example omits `events`; the live list includes it.
		const result = parseAs<UsersListResponse>(Outputs.usersList, {
			users: [{ id: 'a', events: ['completed-checkout'] }],
		});
		expect(result.users[0]?.events).toEqual(['completed-checkout']);
	});

	it('parses the activity records the live list returns in events', () => {
		// Trimmed from a live `GET /api/users` on 2026-11-12, after a response was
		// recorded for the user: each entry is an object, not an event name.
		const result = parseAs<UsersListResponse>(Outputs.usersList, {
			users: [
				{
					id: '5808e7031a943c7e564cdb20',
					userId: 'corsair-plugin-test-1',
					events: [
						{
							type: 'filled',
							date: '2026-11-12T05:37:09.685Z',
							response: '5808e7031a943c7e564cdb21',
							campaign: '5808e7031a943c7e564cdb22',
						},
					],
				},
			],
		});
		expect(result.users[0]?.events?.[0]).toMatchObject({
			type: 'filled',
			campaign: '5808e7031a943c7e564cdb22',
		});
	});

	it('rejects a users answer without the users key', () => {
		expect(() => parseAs(Outputs.usersList, {})).toThrow();
	});

	it('parses the write acks the plugin builds', () => {
		expect(
			Outputs.usersUpsert.parse({ userId: '007', accepted: true }),
		).toEqual({ userId: '007', accepted: true });
		expect(
			Outputs.usersTrack.parse({
				userId: '007',
				event: 'checkout',
				accepted: true,
			}),
		).toMatchObject({ accepted: true });
		expect(Outputs.usersRemove.parse({ userId: 'abc', removed: true })).toEqual(
			{ userId: 'abc', removed: true },
		);
	});
});

describe('input validation', () => {
	it('rejects an empty project id', () => {
		expect(() => Inputs.projectsGet.parse({ projectId: '' })).toThrow();
	});

	it('requires a project id', () => {
		expect(() => Inputs.projectsGet.parse({})).toThrow();
	});

	it('rejects a date that is not ISO 8601', () => {
		expect(() =>
			Inputs.responsesList.parse({
				projectId: 'a',
				startDate: 'last tuesday',
			}),
		).toThrow();
	});

	it('accepts an ISO timestamp with an offset', () => {
		const parsed = Inputs.responsesList.parse({
			projectId: 'a',
			startDate: '2026-01-01T00:00:00.000Z',
		});
		expect(parsed.startDate).toBe('2026-01-01T00:00:00.000Z');
	});

	it('rejects a page size outside the documented 1-100', () => {
		expect(() =>
			Inputs.responsesList.parse({ projectId: 'a', pageSize: 0 }),
		).toThrow();
		expect(() =>
			Inputs.responsesList.parse({ projectId: 'a', pageSize: 101 }),
		).toThrow();
		// The bounds themselves are valid: the API documents 1 and 100.
		expect(
			Inputs.responsesList.parse({ projectId: 'a', pageSize: 100 }).pageSize,
		).toBe(100);
		expect(
			Inputs.responsesList.parse({ projectId: 'a', pageSize: 1 }).pageSize,
		).toBe(1);
	});

	it('rejects a page size that is not a whole number', () => {
		expect(() =>
			Inputs.responsesList.parse({ projectId: 'a', pageSize: 20.5 }),
		).toThrow();
	});

	it('requires a survey id where the route needs one', () => {
		expect(() => Inputs.surveysGet.parse({ projectId: 'a' })).toThrow();
		expect(() => Inputs.statisticsGet.parse({ projectId: 'a' })).toThrow();
	});

	it('requires a userId and an event to track', () => {
		expect(() =>
			Inputs.usersTrack.parse({ projectId: 'a', event: 'x' }),
		).toThrow();
		expect(() =>
			Inputs.usersTrack.parse({ projectId: 'a', userId: 'u' }),
		).toThrow();
		expect(() =>
			Inputs.usersTrack.parse({ projectId: 'a', userId: '', event: 'x' }),
		).toThrow();
	});

	it('rejects an empty user id on delete', () => {
		expect(() => Inputs.usersRemove.parse({ userId: '' })).toThrow();
	});

	it('accepts traits of any shape, since the caller defines them', () => {
		const parsed = Inputs.usersUpsert.parse({
			projectId: 'a',
			userId: 'u',
			traits: { plan: 'Gold', seats: 5, beta: true },
		});
		expect(parsed.traits).toEqual({ plan: 'Gold', seats: 5, beta: true });
	});
});
