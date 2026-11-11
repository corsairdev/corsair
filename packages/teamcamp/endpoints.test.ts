import {
	TEAMCAMP_PRIORITY_VALUES,
	TeamcampEndpointInputSchemas,
	TeamcampEndpointOutputSchemas,
} from './endpoints/types';
import {
	archivedProject,
	customerList,
	groupList,
	project,
	projectDetail,
	projectList,
	task,
	taskList,
	userList,
	workspace,
} from './test-fixtures';

describe('output schemas parse live answers', () => {
	it('account.verify reads the workspace', () => {
		const output = TeamcampEndpointOutputSchemas.accountVerify.parse(workspace);
		expect(output.workspaceName).toBe('test');
	});

	it('users.list reads a member with its timezone and last-seen time', () => {
		const output = TeamcampEndpointOutputSchemas.usersList.parse({
			users: userList,
		});
		const user = output.users[0];
		expect(user?.timezone).toBe('India Standard Time');
		expect(user?.dateFormat).toBe('DD MMM YYYY');
		expect(user?.lastSeen).toBe('2026-11-10T12:34:45.461Z');
		expect(user?.isOwner).toBe(true);
	});

	it('customers.list reads an empty list', () => {
		const output = TeamcampEndpointOutputSchemas.customersList.parse({
			customers: customerList,
		});
		expect(output.customers).toEqual([]);
	});

	it('projects.list reads the two-field rows', () => {
		const output = TeamcampEndpointOutputSchemas.projectsList.parse({
			projects: projectList,
		});
		expect(output.projects[0]?.projectName).toBe('Getting Started');
	});

	it('projects.get reads the workflow statuses', () => {
		const output =
			TeamcampEndpointOutputSchemas.projectsGet.parse(projectDetail);
		expect(output.status).toHaveLength(4);
		const first = output.status?.[0];
		expect(first?.Name).toBe('Todo');
		expect(first?.Type).toBe(2);
		expect(first?._id).toBe('ppxah6OgUcGXclowmNm8D');
		expect(first?.Default).toBe(true);
	});

	it('projects.create reads a created project', () => {
		const output = TeamcampEndpointOutputSchemas.projectsCreate.parse(project);
		expect(output.projectId).toBe('0uUAD4N11-tUA00rNE2EB');
		expect(output.statusEnable).toBe(true);
	});

	it('projects.get reads an archived project after a delete', () => {
		const output =
			TeamcampEndpointOutputSchemas.projectsGet.parse(archivedProject);
		expect(output.archived).toBe(true);
		expect(
			TeamcampEndpointOutputSchemas.projectsGet.parse(projectDetail).archived,
		).toBeUndefined();
	});

	it('projects.delete reports the archive and the provider message', () => {
		const output = TeamcampEndpointOutputSchemas.projectsDelete.parse({
			archived: true,
			projectId: 'p1',
			message: 'The project has been deleted successfully.',
		});
		expect(output.message).toContain('deleted successfully');
	});

	it('groups.list reads an empty list', () => {
		const output = TeamcampEndpointOutputSchemas.groupsList.parse({
			groups: groupList,
		});
		expect(output.groups).toEqual([]);
	});

	it('tasks.list reads a row with status, statusId and the duplicate id', () => {
		const output = TeamcampEndpointOutputSchemas.tasksList.parse({
			tasks: taskList,
		});
		const row = output.tasks[0];
		expect(row?.status).toBe(false);
		expect(row?.statusId).toBe('gGtIVfih4xc9mVnlMByIi');
		expect(row?.id).toBe(row?.taskId);
	});

	it('tasks.get reads a task with PascalCase comments', () => {
		const output = TeamcampEndpointOutputSchemas.tasksGet.parse(task);
		const comment = output.comments?.[0];
		expect(comment?._id).toBe('8jqHIXnP5_p9_We9-qey3');
		expect(comment?.CreatedBy).toBe('iXH_-M_COvz453E5uQgoJ');
		expect(comment?.Type).toBe(17);
		expect(output.groupId).toBeNull();
		expect(output.description).toBe('');
		// A read answers objects here, where a create takes plain ids.
		expect(output.taskUsers?.[0]?.taskUserId).toBe('iXH_-M_COvz453E5uQgoJ');
	});

	it('tasks.create reads a created task', () => {
		const output = TeamcampEndpointOutputSchemas.tasksCreate.parse(task);
		expect(output.taskId).toBe('HbQJf4Lc2nJv5djKH4zCU');
		expect(output.status).toBe(false);
	});
});

describe('output schemas reject the wrong shape', () => {
	it('rejects a list whose rows are strings', () => {
		expect(() =>
			TeamcampEndpointOutputSchemas.projectsList.parse({
				projects: ['not-a-project'],
			}),
		).toThrow();
	});

	it('rejects a project with no id, rather than inventing one', () => {
		expect(() =>
			TeamcampEndpointOutputSchemas.projectsGet.parse({ projectName: 'x' }),
		).toThrow();
	});

	it('rejects a task whose status changed type', () => {
		expect(() =>
			TeamcampEndpointOutputSchemas.tasksGet.parse({ ...task, status: 'done' }),
		).toThrow();
	});

	it('accepts a field the schema does not name', () => {
		const output = TeamcampEndpointOutputSchemas.tasksGet.parse({
			...task,
			brandNewField: 'x',
		});
		expect(output.taskId).toBe(task.taskId);
	});
});

describe('input schemas pin the provider rules', () => {
	it('requires a project id on the task list', () => {
		expect(TeamcampEndpointInputSchemas.tasksList.safeParse({}).success).toBe(
			false,
		);
		expect(
			TeamcampEndpointInputSchemas.tasksList.safeParse({ projectId: 'p1' })
				.success,
		).toBe(true);
	});

	it('requires the name on a task create', () => {
		expect(
			TeamcampEndpointInputSchemas.tasksCreate.safeParse({ projectId: 'p1' })
				.success,
		).toBe(false);
	});

	it('rejects a date that is not yyyy-MM-dd', () => {
		for (const dueDate of [
			'30/11/2026',
			'2026-13-01',
			'2026-1-1',
			'tomorrow',
		]) {
			expect({
				dueDate,
				ok: TeamcampEndpointInputSchemas.tasksCreate.safeParse({
					projectId: 'p1',
					taskName: 'x',
					dueDate,
				}).success,
			}).toEqual({ dueDate, ok: false });
		}
		expect(
			TeamcampEndpointInputSchemas.tasksCreate.safeParse({
				projectId: 'p1',
				taskName: 'x',
				dueDate: '2026-11-30',
			}).success,
		).toBe(true);
	});

	it('maps every priority to the number the API documents', () => {
		expect(TEAMCAMP_PRIORITY_VALUES).toEqual({
			none: 0,
			urgent: 1,
			high: 2,
			medium: 3,
			low: 4,
		});
		for (const priority of Object.keys(TEAMCAMP_PRIORITY_VALUES)) {
			expect(
				TeamcampEndpointInputSchemas.tasksCreate.safeParse({
					projectId: 'p1',
					taskName: 'x',
					priority,
				}).success,
			).toBe(true);
		}
	});

	it('rejects a negative estimate and an unknown priority', () => {
		expect(
			TeamcampEndpointInputSchemas.tasksCreate.safeParse({
				projectId: 'p1',
				taskName: 'x',
				estimateTime: -1,
			}).success,
		).toBe(false);
		expect(
			TeamcampEndpointInputSchemas.tasksCreate.safeParse({
				projectId: 'p1',
				taskName: 'x',
				priority: 'critical',
			}).success,
		).toBe(false);
	});

	it('requires at least one field on a project update', () => {
		expect(
			TeamcampEndpointInputSchemas.projectsUpdate.safeParse({ projectId: 'p1' })
				.success,
		).toBe(false);
		expect(
			TeamcampEndpointInputSchemas.projectsUpdate.safeParse({
				projectId: 'p1',
				projectName: 'x',
			}).success,
		).toBe(true);
	});

	it('rejects an empty id anywhere one is required', () => {
		expect(
			TeamcampEndpointInputSchemas.projectsGet.safeParse({ projectId: '' })
				.success,
		).toBe(false);
		expect(
			TeamcampEndpointInputSchemas.tasksGet.safeParse({ taskId: '' }).success,
		).toBe(false);
	});
});
