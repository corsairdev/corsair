/**
 * Endpoint behaviour.
 *
 * The transport is mocked so these run in CI with no TimeCamp account. The
 * substance here is the normalisation: TimeCamp returns ids as strings or
 * numbers, booleans as "0"/"1", and users as either a map or an array, and
 * none of that may reach a caller.
 */
const requestMock = jest.fn();

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: (...args: unknown[]) => requestMock(...args),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: async () => undefined,
}));

import { Projects } from './endpoints';

function makeCtx() {
	return { key: 'tc-test-token', db: {}, options: {} } as never;
}

/** TimeCamp's native shape: an object keyed by task id, loose types. */
const RAW_TASKS = {
	'101': {
		task_id: '101',
		parent_id: null,
		name: 'Website Redesign',
		archived: '0',
		color: '#ff0000',
		billable: '1',
		budgeted: '5000',
		budget_unit: 'USD',
		root_group_id: '7',
		users: { '11': { user_id: '11' }, '12': { user_id: '12' } },
	},
	'102': {
		task_id: 102,
		parent_id: '0',
		name: 'Archived Project',
		archived: 1,
		users: [],
	},
	'103': {
		task_id: '103',
		parent_id: '101',
		name: 'Child task, not a project',
		archived: '0',
	},
};

beforeEach(() => {
	requestMock.mockReset();
	requestMock.mockResolvedValue(RAW_TASKS);
});

describe('projects.getList', () => {
	it('calls the TimeCamp tasks endpoint', async () => {
		await Projects.getList(makeCtx(), {});
		expect(requestMock.mock.calls[0][1]).toMatchObject({
			url: 'tasks',
			method: 'GET',
		});
	});

	it('returns only root-level tasks, excluding children', async () => {
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects.map((p) => p.task_id)).not.toContain('103');
	});

	it('treats both null and "0" parent_id as root level', async () => {
		const result = await Projects.getList(makeCtx(), {
			include_archived: true,
		});
		expect(result.projects.map((p) => p.task_id).sort()).toEqual([
			'101',
			'102',
		]);
	});

	it('excludes archived projects by default', async () => {
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects.map((p) => p.task_id)).toEqual(['101']);
		expect(result.count).toBe(1);
	});

	it('includes archived projects when asked', async () => {
		const result = await Projects.getList(makeCtx(), {
			include_archived: true,
		});
		expect(result.count).toBe(2);
	});

	it('normalises a numeric task_id to a string', async () => {
		const result = await Projects.getList(makeCtx(), {
			include_archived: true,
		});
		const archived = result.projects.find((p) => p.task_id === '102');
		expect(archived?.task_id).toBe('102');
	});

	it('normalises "0"/"1" flags to booleans', async () => {
		const result = await Projects.getList(makeCtx(), {});
		const project = result.projects[0];
		expect(project?.archived).toBe(false);
		expect(project?.billable).toBe(true);
	});

	it('normalises a numeric-string budget to a number', async () => {
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.budgeted).toBe(5000);
	});

	it('collapses the users map to a list of ids', async () => {
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.assigned_users).toEqual(['11', '12']);
	});

	it('accepts an array payload as well as a keyed object', async () => {
		requestMock.mockResolvedValue(Object.values(RAW_TASKS));
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.task_id).toBe('101');
	});

	it('returns an empty list for an empty payload', async () => {
		requestMock.mockResolvedValue({});
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects).toEqual([]);
		expect(result.count).toBe(0);
	});

	it('skips records with no usable task id rather than emitting junk', async () => {
		requestMock.mockResolvedValue({ bad: { parent_id: null, name: 'No id' } });
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects).toHaveLength(0);
	});

	it('defaults a missing name to an empty string', async () => {
		requestMock.mockResolvedValue({
			'9': { task_id: '9', parent_id: null, archived: '0' },
		});
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.name).toBe('');
	});
});
