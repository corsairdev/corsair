jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	issueDetailResponse,
	issueFieldResponse,
	issueListResponse,
	issueTypeResponse,
	memberListResponse,
	nextStateResponse,
	notFoundResponse,
	projectListResponse,
	projectResponse,
	projectTemplateResponse,
	sprintDetailResponse,
	sprintListResponse,
	tagListResponse,
	workflowListResponse,
} from './test-fixtures';
import {
	BASE,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Leiga request shapes', () => {
	it('sends the token in the accessToken header, not Authorization', async () => {
		mockFetch(ok(projectListResponse));

		await endpoints.projects.list(makeCtx(), {});

		expect(sentHeader('accessToken')).toBe('test-token');
		expect(sentHeader('Authorization')).toBeNull();
	});

	it('lists projects with GET /project/list', async () => {
		mockFetch(ok(projectListResponse));

		const result = await endpoints.projects.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/project/list`);
		expect(lastCall().init.method).toBe('GET');
		expect(result.projects).toEqual(projectListResponse);
	});

	it('reads a project by id with the projectId query', async () => {
		mockFetch(ok(projectResponse));

		await endpoints.projects.get(makeCtx(), { projectId: 213979847 });

		expect(lastCall().url).toBe(`${BASE}/project/get?projectId=213979847`);
		expect(lastCall().init.method).toBe('GET');
	});

	it('reads a project by key with the projectKey query', async () => {
		mockFetch(ok(projectResponse));

		await endpoints.projects.getByKey(makeCtx(), { projectKey: 'SAMPL' });

		expect(lastCall().url).toBe(
			`${BASE}/project/get-by-project-key?projectKey=SAMPL`,
		);
	});

	it('lists project templates', async () => {
		mockFetch(ok(projectTemplateResponse));

		const result = await endpoints.projects.templates(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/project/project-template`);
		expect(result.templates).toHaveLength(2);
	});

	it('queries issues with a POST and the filters in the body', async () => {
		mockFetch(ok(issueListResponse));

		await endpoints.issues.list(makeCtx(), {
			projectId: 213979847,
			pageSize: 5,
			statusTypes: [2, 3],
		});

		expect(lastCall().url).toBe(`${BASE}/issue/page`);
		// A GET here would be a silent 200 with `accessToken error`.
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			projectId: 213979847,
			pageSize: 5,
			statusTypes: [2, 3],
		});
	});

	it('omits every unset issue filter rather than sending null', async () => {
		mockFetch(ok(issueListResponse));

		await endpoints.issues.list(makeCtx(), { projectId: 213979847 });

		expect(sentBody()).toEqual({ projectId: 213979847 });
	});

	it('reads an issue with the id query, not issueId', async () => {
		mockFetch(ok(issueDetailResponse));

		await endpoints.issues.get(makeCtx(), { issueId: 213980410 });

		expect(lastCall().url).toBe(`${BASE}/issue/get?id=213980410`);
	});

	it('reads an issue by its human-readable number', async () => {
		mockFetch(ok(issueDetailResponse));

		await endpoints.issues.getByNumber(makeCtx(), {
			issueNumber: 'SAMPL-23',
		});

		expect(lastCall().url).toBe(
			`${BASE}/issue/get-by-issue-number?issueNumber=SAMPL-23`,
		);
	});

	it('lists issue types with the projectId query', async () => {
		mockFetch(ok(issueTypeResponse));

		await endpoints.issues.types(makeCtx(), { projectId: 213979847 });

		expect(lastCall().url).toBe(`${BASE}/issue/type-list?projectId=213979847`);
	});

	it('lists issue fields with both ids', async () => {
		mockFetch(ok(issueFieldResponse));

		await endpoints.issues.fields(makeCtx(), {
			projectId: 213979847,
			issueTypeId: 213980142,
		});

		expect(lastCall().url).toBe(
			`${BASE}/issue/issue-fields?projectId=213979847&issueTypeId=213980142`,
		);
	});

	it('lists sprints with a POST body', async () => {
		mockFetch(ok(sprintListResponse));

		await endpoints.sprints.list(makeCtx(), { projectId: 213979847 });

		expect(lastCall().url).toBe(`${BASE}/sprint/list-with-count`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ projectId: 213979847 });
	});

	it('reads a sprint with the id query, not sprintId', async () => {
		mockFetch(ok(sprintDetailResponse));

		await endpoints.sprints.get(makeCtx(), { sprintId: 213980236 });

		// `sprintId` answers {"code":"100","msg":"id should not be null"}.
		expect(lastCall().url).toBe(`${BASE}/sprint/get?id=213980236`);
	});

	it('lists workflows with a POST body', async () => {
		mockFetch(ok(workflowListResponse));

		await endpoints.workflows.list(makeCtx(), { projectId: 213979847 });

		expect(lastCall().url).toBe(`${BASE}/workflow/list`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ projectId: 213979847 });
	});

	it('asks for next states with all three required fields', async () => {
		mockFetch(ok(nextStateResponse));

		await endpoints.workflows.nextStates(makeCtx(), {
			projectId: 213979847,
			stateId: 213980052,
			defId: 213980057,
		});

		expect(lastCall().url).toBe(`${BASE}/workflow/list/next-state`);
		// A body without defId answers {"code":"100"} on HTTP 200.
		expect(sentBody()).toEqual({
			projectId: 213979847,
			stateId: 213980052,
			defId: 213980057,
		});
	});

	it('lists tags with a POST body', async () => {
		mockFetch(ok(tagListResponse));

		await endpoints.tags.list(makeCtx(), { projectId: 213979847 });

		expect(lastCall().url).toBe(`${BASE}/tag/list`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ projectId: 213979847 });
	});

	it('lists members with the projectId query', async () => {
		mockFetch(ok(memberListResponse));

		await endpoints.members.list(makeCtx(), { projectId: 213979847 });

		expect(lastCall().url).toBe(
			`${BASE}/user/project-user-list?projectId=213979847`,
		);
	});

	it('passes the keyword filter through only when set', async () => {
		mockFetch(ok(memberListResponse));

		await endpoints.members.list(makeCtx(), {
			projectId: 213979847,
			keyword: 'Casey',
		});

		expect(lastCall().url).toBe(
			`${BASE}/user/project-user-list?projectId=213979847&keyword=Casey`,
		);
	});
});

describe('Leiga envelope handling', () => {
	it('throws on code 5 even though the status is 200', async () => {
		mockFetch(jsonResponse(notFoundResponse));

		await expect(
			endpoints.projects.get(makeCtx(), { projectId: 1 }),
		).rejects.toThrow(/code 5/);
	});

	it('throws on code 100 for a missing required field', async () => {
		mockFetch(jsonResponse({ code: '100', msg: 'stateId should not be null' }));

		await expect(
			endpoints.workflows.nextStates(makeCtx(), {
				projectId: 213979847,
				stateId: 1,
				defId: 2,
			}),
		).rejects.toThrow(/stateId should not be null/);
	});

	it('rejects a body that carries no code at all', async () => {
		mockFetch(jsonResponse({ data: [] }));

		await expect(endpoints.projects.list(makeCtx(), {})).rejects.toThrow(
			/no code/,
		);
	});
});
