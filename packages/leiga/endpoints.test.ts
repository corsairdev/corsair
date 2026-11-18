jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { flattenIssueDetail } from './endpoints/issues';
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
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Leiga output parsing', () => {
	it('parses the project list', async () => {
		mockFetch(ok(projectListResponse));

		const result = await endpoints.projects.list(makeCtx(), {});

		expect(result.projects).toEqual(projectListResponse);
	});

	it('parses one project with epoch millisecond timestamps', async () => {
		mockFetch(ok(projectResponse));

		const result = await endpoints.projects.get(makeCtx(), { projectId: 1 });

		expect(result.id).toBe(213979847);
		expect(result.projectName).toBe('Sample Project');
		expect(typeof result.createTime).toBe('number');
	});

	it('parses project templates', async () => {
		mockFetch(ok(projectTemplateResponse));

		const result = await endpoints.projects.templates(makeCtx(), {});

		expect(result.templates.map((t) => t.code)).toEqual(['SCRUM', 'KANBAN']);
	});

	it('parses an issue page with its total', async () => {
		mockFetch(ok(issueListResponse));

		const result = await endpoints.issues.list(makeCtx(), { projectId: 1 });

		expect(result.total).toBe(21);
		expect(result.issues).toHaveLength(1);
		expect(result.issues[0]!.issueTypeVO?.code).toBe('chore');
		expect(result.issues[0]!.assigneeVO?.userName).toBe('Casey Example');
	});

	it('flattens the double-wrapped issue detail', async () => {
		mockFetch(ok(issueDetailResponse));

		const result = await endpoints.issues.get(makeCtx(), { issueId: 1 });

		// The inner object wins, and the outer audit fields fill in.
		expect(result.id).toBe(213980410);
		expect(result.issueNumber).toBe('SAMPL-23');
		expect(result.projectId).toBe(213979847);
		expect(result.summary).toBe(
			'Click to uncover the potential of Screen Recording',
		);
	});

	it('flattens the detail for a lookup by number too', async () => {
		mockFetch(ok(issueDetailResponse));

		const result = await endpoints.issues.getByNumber(makeCtx(), {
			issueNumber: 'SAMPL-23',
		});

		expect(result.issueNumber).toBe('SAMPL-23');
	});

	it('parses issue types with their workflowId', async () => {
		mockFetch(ok(issueTypeResponse));

		const result = await endpoints.issues.types(makeCtx(), { projectId: 1 });

		expect(result.issueTypes[0]!.workflowId).toBe(213980057);
	});

	it('parses issue fields from the wrapped object', async () => {
		mockFetch(ok(issueFieldResponse));

		const result = await endpoints.issues.fields(makeCtx(), {
			projectId: 1,
			issueTypeId: 2,
		});

		expect(result.fields.map((f) => f.fieldCode)).toEqual([
			'sprint',
			'summary',
			'customfield_213979997',
		]);
	});

	it('parses sprints with their issue type counts', async () => {
		mockFetch(ok(sprintListResponse));

		const result = await endpoints.sprints.list(makeCtx(), { projectId: 1 });

		expect(result.sprints[0]!.issueTypeCountMap).toEqual({
			Subtask: 0,
			Epic: 0,
			Bug: 4,
			Chore: 0,
			Story: 15,
		});
	});

	it('parses a sprint detail that omits the count map', async () => {
		mockFetch(ok(sprintDetailResponse));

		const result = await endpoints.sprints.get(makeCtx(), { sprintId: 1 });

		expect(result.id).toBe(213980236);
		expect(result.issueTypeCountMap).toBeUndefined();
	});

	it('parses workflows with their named states', async () => {
		mockFetch(ok(workflowListResponse));

		const result = await endpoints.workflows.list(makeCtx(), { projectId: 1 });

		const workflow = result.workflows[0]!;
		expect(workflow.workflowName).toBe('Story Workflow');
		expect(workflow.states?.map((s) => s.stateName)).toEqual([
			'Not Started',
			'In Design',
			'Released',
		]);
	});

	it('parses the next states for a workflow step', async () => {
		mockFetch(ok(nextStateResponse));

		const result = await endpoints.workflows.nextStates(makeCtx(), {
			projectId: 1,
			stateId: 2,
			defId: 3,
		});

		expect(result.states.map((s) => s.stateName)).toEqual([
			'In Progress',
			'Done',
		]);
	});

	it('parses an empty tag list', async () => {
		mockFetch(ok(tagListResponse));

		const result = await endpoints.tags.list(makeCtx(), { projectId: 1 });

		expect(result.tags).toEqual([]);
	});

	it('parses members with their project roles', async () => {
		mockFetch(ok(memberListResponse));

		const result = await endpoints.members.list(makeCtx(), { projectId: 1 });

		expect(result.members[0]!.roleVOList?.[0]?.roleCode).toBe('projectOwner');
		expect(result.members[0]!.orgEmail).toBe('casey@example.org');
	});
});

describe('Leiga shape rejections', () => {
	it('rejects a project list that is not an array', async () => {
		mockFetch(ok({ message: 'unexpected' }));

		await expect(endpoints.projects.list(makeCtx(), {})).rejects.toThrow(
			/unexpected project list body/,
		);
	});

	it('rejects an issue page with no numeric total', async () => {
		mockFetch(ok({ total: 'many', list: [] }));

		await expect(
			endpoints.issues.list(makeCtx(), { projectId: 1 }),
		).rejects.toThrow(/without a numeric total/);
	});

	it('rejects an issue page whose list is not an array', async () => {
		mockFetch(ok({ total: 1, list: { id: 1 } }));

		await expect(
			endpoints.issues.list(makeCtx(), { projectId: 1 }),
		).rejects.toThrow(/unexpected issue page body/);
	});

	it('rejects a list entry that is not an object', async () => {
		mockFetch(ok(['not-a-project']));

		await expect(endpoints.projects.list(makeCtx(), {})).rejects.toThrow(
			/entry 0 is not an object/,
		);
	});

	it('rejects a field list with no fields key', async () => {
		mockFetch(ok({ items: [] }));

		await expect(
			endpoints.issues.fields(makeCtx(), { projectId: 1, issueTypeId: 2 }),
		).rejects.toThrow(/unexpected issue field list body/);
	});

	it('rejects an issue detail with no inner data object', async () => {
		mockFetch(ok({ id: 1, projectId: 2 }));

		await expect(
			endpoints.issues.get(makeCtx(), { issueId: 1 }),
		).rejects.toThrow(/no data object/);
	});

	it('rejects a known field with the wrong type', async () => {
		mockFetch(ok({ ...projectResponse, id: 'not-a-number' }));

		await expect(
			endpoints.projects.get(makeCtx(), { projectId: 1 }),
		).rejects.toThrow();
	});

	it('surfaces a code 5 as a thrown LeigaAPIError', async () => {
		mockFetch(jsonResponse(notFoundResponse));

		await expect(
			endpoints.issues.get(makeCtx(), { issueId: 1 }),
		).rejects.toThrow(/code 5/);
	});
});

describe('flattenIssueDetail', () => {
	it('lets the inner object win on a conflicting id', () => {
		const flattened = flattenIssueDetail({
			data: { id: 2, summary: 'inner' },
			id: 1,
			projectId: 9,
		}) as Record<string, unknown>;

		expect(flattened.id).toBe(2);
		expect(flattened.projectId).toBe(9);
	});

	it('keeps the outer fields the inner object lacks', () => {
		const flattened = flattenIssueDetail({
			data: { id: 2 },
			createTime: 123,
			updateTime: 456,
		}) as Record<string, unknown>;

		expect(flattened.createTime).toBe(123);
		expect(flattened.updateTime).toBe(456);
	});
});
