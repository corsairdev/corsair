import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { BugherdContext } from '../context';
import { errorHandlers } from '../error-handlers';
import { bugherd, bugherdEndpointSchemas } from '../index';
import * as B from './bugherd';
import {
	AddGuestToProjectInputSchema,
	BugherdEndpointOutputSchemas,
	CreateWebhookInputSchema,
	ListTasksInputSchema,
	UpdateTaskInputSchema,
} from './types';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function table(saved: Record<string, unknown> | null = null) {
	return {
		upsertByEntityId: jest.fn().mockResolvedValue(undefined),
		deleteByEntityId: jest.fn().mockResolvedValue(true),
		findByEntityId: jest.fn().mockResolvedValue(saved ? { data: saved } : null),
		list: jest.fn().mockResolvedValue([]),
	};
}

function tables() {
	return {
		projects: table(),
		tasks: table(),
		columns: table(),
		comments: table(),
		attachments: table(),
		webhooks: table(),
		users: table(),
		organization: table(),
	};
}

function context(db?: ReturnType<typeof tables>): BugherdContext {
	return {
		key: 'test-key',
		db,
		database: db ? {} : undefined,
	} as unknown as BugherdContext;
}

/** The request options of the nth call: method, url, query, body, formData. */
function call(n = 0) {
	return mockRequest.mock.calls[n]?.[1];
}

// Trimmed from the live API (11-18), throwaway trial account.
const USER = {
	id: 634824,
	email: 'someone@example.com',
	display_name: 'Corsair Tests',
	avatar_url: 'https://www.bugherd.com/images/sidebar/avatar-generic.svg',
};
const LIST_PROJECT = {
	id: 552668,
	name: "Corsair's First Project",
	created_at: '2026-11-18 04:25:17',
	owner_name: 'Corsair Tests',
	tasks: false,
	sites: [],
};
const COLUMN = {
	id: 2387619,
	name: 'backlog',
	project_id: 552668,
	tasks_count: 0,
	created_at: '2026-11-18T04:25:17.382Z',
	updated_at: '2026-11-18T04:25:17.382Z',
};
const PROJECT = {
	id: 552668,
	name: "Corsair's First Project",
	owner_name: 'Corsair Tests',
	devurl: null,
	sites: [],
	api_key: 'widget-key-not-for-output',
	is_active: true,
	is_public: null,
	guests_see_guests: true,
	members: [USER],
	guests: [],
	columns: [COLUMN],
};
const TASK = {
	id: 98765,
	local_task_id: 1,
	project_id: 552668,
	created_at: '2026-11-18T05:00:00Z',
	updated_at: '2026-11-18T05:00:00Z',
	closed_at: null,
	deleted_at: null,
	title: 'corsair-plugin-test',
	description: 'corsair-plugin-test',
	status: 'backlog',
	status_id: 0,
	priority: 'normal',
	priority_id: 3,
	tag_names: ['corsair'],
	external_id: null,
	requester_email: null,
	assigned_to: null,
	requester: null,
	assigned_to_id: null,
	requester_id: null,
};
const COMMENT = {
	id: 8801,
	text: 'corsair-plugin-test',
	created_at: '2026-11-18T05:01:00Z',
	user_id: 634824,
	is_private: false,
};
const ATTACHMENT = {
	id: 331,
	file_name: 'corsair.png',
	url: 'https://example.com/corsair.png',
	created_at: '2026-11-18T05:02:00Z',
};
const WEBHOOK = {
	id: 22649,
	target_url: 'https://example.com/hook',
	event: 'task_create',
	project_id: 552668,
	project_name: null,
	success_count: 0,
	error_count: null,
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('client', () => {
	it('sends HTTP Basic with the key and x', async () => {
		mockRequest.mockResolvedValue({ organization: { id: 1, name: 'Org' } });
		await B.showOrganization(context(), {});
		const config = mockRequest.mock.calls[0]?.[0];
		expect(config?.BASE).toBe('https://www.bugherd.com/api_v2');
		expect(config?.HEADERS).toMatchObject({
			Authorization: `Basic ${btoa('test-key:x')}`,
		});
		expect(call()).toMatchObject({ method: 'GET', url: '/organization.json' });
	});

	it('lets ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/projects.json' },
			{
				url: 'https://www.bugherd.com/api_v2/projects.json',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'rate limited',
		);
		mockRequest.mockRejectedValue(error);
		await expect(B.listProjects(context(), {})).rejects.toBe(error);
	});
});

describe('organization and users', () => {
	it('organization.show stores the organization', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({
			organization: { id: 126847, name: 'Corsair Plugin Test' },
		});
		const out = await B.showOrganization(context(db), {});
		expect(out.organization.id).toBe(126847);
		expect(db.organization.upsertByEntityId).toHaveBeenCalledWith('126847', {
			id: '126847',
			name: 'Corsair Plugin Test',
		});
	});

	it.each([
		['listUsers', '/users.json'],
		['listMembers', '/users/members.json'],
		['listGuests', '/users/guests.json'],
	] as const)('%s calls %s and stores users', async (fn, url) => {
		const db = tables();
		mockRequest.mockResolvedValue({ users: [USER], meta: { count: 1 } });
		const out = await B[fn](context(db), { page: 2 });
		expect(call()).toMatchObject({ method: 'GET', url, query: { page: 2 } });
		expect(out.users).toHaveLength(1);
		expect(db.users.upsertByEntityId).toHaveBeenCalledWith('634824', {
			id: '634824',
			email: USER.email,
			display_name: 'Corsair Tests',
		});
	});

	it('users.list passes updated_since', async () => {
		mockRequest.mockResolvedValue({ users: [] });
		await B.listUsers(context(), { updated_since: '2026-11-01T00:00:00Z' });
		expect(call()?.query).toEqual({ updated_since: '2026-11-01T00:00:00Z' });
	});

	it('users.listProjects filters and drops the widget key', async () => {
		mockRequest.mockResolvedValue({
			projects: [{ ...LIST_PROJECT, api_key: 'k' }],
		});
		const out = await B.showUserProjects(context(), {
			user_id: 634824,
			is_active: true,
		});
		expect(call()).toMatchObject({
			url: '/users/634824/projects.json',
			query: { is_active: true },
		});
		expect(out.projects[0]).not.toHaveProperty('api_key');
	});

	it('tasks.listForUser wraps the bare array BugHerd returns', async () => {
		const db = tables();
		mockRequest.mockResolvedValue([TASK]);
		const out = await B.showUserTasks(context(db), {
			user_id: 634824,
			priority: 'critical',
		});
		expect(call()).toMatchObject({
			url: '/users/634824/tasks.json',
			query: { priority: 'critical' },
		});
		expect(out).toEqual({ tasks: [TASK] });
		expect(db.tasks.upsertByEntityId).toHaveBeenCalledWith(
			'98765',
			expect.objectContaining({ id: '98765', project_id: 552668 }),
		);
		expect(
			BugherdEndpointOutputSchemas.showUserTasks.safeParse(out).success,
		).toBe(true);
	});
});

describe('projects', () => {
	it.each([
		['listProjects', '/projects.json'],
		['listActiveProjects', '/projects/active.json'],
	] as const)('%s calls %s', async (fn, url) => {
		const db = tables();
		mockRequest.mockResolvedValue({
			projects: [LIST_PROJECT],
			meta: { count: 1 },
		});
		const out = await B[fn](context(db), {});
		expect(call()).toMatchObject({ method: 'GET', url });
		expect(call()?.query).toBeUndefined();
		expect(out.projects[0]?.id).toBe(552668);
		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			'552668',
			expect.objectContaining({ name: "Corsair's First Project" }),
		);
		expect(BugherdEndpointOutputSchemas[fn].safeParse(out).success).toBe(true);
	});

	it('projects.show returns details without the widget key and stores columns and people', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({ project: PROJECT });
		const out = await B.showProjectDetails(context(db), { project_id: 552668 });
		expect(call()).toMatchObject({
			method: 'GET',
			url: '/projects/552668.json',
		});
		expect(out.project).not.toHaveProperty('api_key');
		expect(JSON.stringify(out)).not.toContain('widget-key');
		expect(db.columns.upsertByEntityId).toHaveBeenCalledWith(
			'2387619',
			expect.objectContaining({ name: 'backlog' }),
		);
		expect(db.users.upsertByEntityId).toHaveBeenCalledWith(
			'634824',
			expect.anything(),
		);
		expect(
			BugherdEndpointOutputSchemas.showProjectDetails.safeParse(out).success,
		).toBe(true);
	});

	it('projects.create wraps the fields in project', async () => {
		mockRequest.mockResolvedValue({ project: { ...PROJECT, id: 7 } });
		await B.createProject(context(), {
			name: 'corsair-plugin-test',
			devurl: 'https://example.com',
			is_public: false,
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/projects.json',
			body: {
				project: {
					name: 'corsair-plugin-test',
					devurl: 'https://example.com',
					is_public: false,
				},
			},
			mediaType: 'application/json',
		});
	});

	it('projects.update sends only the given fields', async () => {
		mockRequest.mockResolvedValue({ project: PROJECT });
		await B.updateProject(context(), { project_id: 552668, name: 'renamed' });
		expect(call()).toMatchObject({
			method: 'PUT',
			url: '/projects/552668.json',
			body: { project: { name: 'renamed' } },
		});
	});

	it('projects.delete removes the local row after BugHerd confirms', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({ success: true });
		const out = await B.deleteProject(context(db), { project_id: 7 });
		expect(call()).toMatchObject({ method: 'DELETE', url: '/projects/7.json' });
		expect(out).toEqual({ success: true });
		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith('7');
	});

	it('projects.delete keeps the local row when BugHerd refuses', async () => {
		const db = tables();
		mockRequest.mockRejectedValue(new Error('nope'));
		await expect(
			B.deleteProject(context(db), { project_id: 7 }),
		).rejects.toThrow();
		expect(db.projects.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('projects.addMember posts user_id to add_member.json', async () => {
		mockRequest.mockResolvedValue({ project: PROJECT });
		await B.addMemberToProject(context(), {
			project_id: 552668,
			user_id: [1, 2],
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/projects/552668/add_member.json',
			body: { user_id: [1, 2] },
		});
	});

	it('projects.addGuest posts to add_guest.json and keeps the email out of the event', async () => {
		mockRequest.mockResolvedValue({ project: PROJECT });
		await B.addGuestToProject(context(), {
			project_id: 552668,
			email: 'guest@example.com',
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/projects/552668/add_guest.json',
			body: { email: 'guest@example.com' },
		});
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'guest@example.com',
		);
	});

	it('projects.addGuest takes user_id or email, not both or neither', () => {
		expect(
			AddGuestToProjectInputSchema.safeParse({ project_id: 1 }).success,
		).toBe(false);
		expect(
			AddGuestToProjectInputSchema.safeParse({
				project_id: 1,
				user_id: 2,
				email: 'a@example.com',
			}).success,
		).toBe(false);
		expect(
			AddGuestToProjectInputSchema.safeParse({ project_id: 1, user_id: 2 })
				.success,
		).toBe(true);
	});
});

describe('tasks', () => {
	it('tasks.list passes filters', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({ tasks: [TASK], meta: { count: 1 } });
		const out = await B.listTasks(context(db), {
			project_id: 552668,
			status: 'todo',
			tag: 'corsair',
			assigned_to_id: 5,
			page: 1,
		});
		expect(call()).toMatchObject({
			method: 'GET',
			url: '/projects/552668/tasks.json',
			query: { status: 'todo', tag: 'corsair', assigned_to_id: 5, page: 1 },
		});
		expect(db.tasks.upsertByEntityId).toHaveBeenCalledWith(
			'98765',
			expect.objectContaining({ status: 'backlog', tag_names: ['corsair'] }),
		);
		expect(BugherdEndpointOutputSchemas.listTasks.safeParse(out).success).toBe(
			true,
		);
	});

	it('tasks.list rejects a priority BugHerd does not have', () => {
		expect(
			ListTasksInputSchema.safeParse({ project_id: 1, priority: 'high' })
				.success,
		).toBe(false);
	});

	it.each([
		['listFeedbackTasks', 'feedback'],
		['listArchivedTasks', 'archive'],
		['listTaskboardTasks', 'taskboard'],
	] as const)('%s calls tasks/%s.json', async (fn, view) => {
		mockRequest.mockResolvedValue({ tasks: [], meta: { count: 0 } });
		await B[fn](context(), { project_id: 3, page: 2 });
		expect(call()).toMatchObject({
			method: 'GET',
			url: `/projects/3/tasks/${view}.json`,
			query: { page: 2 },
		});
	});

	it('tasks.show uses the project route when given a project', async () => {
		mockRequest.mockResolvedValue({ task: TASK });
		await B.showTask(context(), { project_id: 552668, task_id: 98765 });
		expect(call()?.url).toBe('/projects/552668/tasks/98765.json');
	});

	it('tasks.show uses the global route without a project', async () => {
		mockRequest.mockResolvedValue({ task: TASK });
		const out = await B.showTask(context(), { task_id: 98765 });
		expect(call()?.url).toBe('/tasks/98765.json');
		expect(BugherdEndpointOutputSchemas.showTask.safeParse(out).success).toBe(
			true,
		);
	});

	it('tasks.showByLocalId calls local_tasks', async () => {
		mockRequest.mockResolvedValue({ task: TASK });
		await B.showTaskByLocalId(context(), {
			project_id: 552668,
			local_task_id: 1,
		});
		expect(call()?.url).toBe('/projects/552668/local_tasks/1.json');
	});

	it('tasks.create wraps the fields in task', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({ task: TASK });
		await B.createTask(context(db), {
			project_id: 552668,
			description: 'corsair-plugin-test',
			priority: 'normal',
			tag_names: ['corsair'],
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/projects/552668/tasks.json',
			body: {
				task: {
					description: 'corsair-plugin-test',
					priority: 'normal',
					tag_names: ['corsair'],
				},
			},
		});
		expect(db.tasks.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('stores the assignee from assigned_to, which is where BugHerd puts it', async () => {
		// Live run 11-18: assigned_to_id stays null; assigned_to and assignees
		// carry the user.
		const db = tables();
		mockRequest.mockResolvedValue({
			task: {
				...TASK,
				assigned_to_id: null,
				assigned_to: { id: 634824, display_name: 'Corsair Tests' },
				assignees: [{ id: 634824, display_name: 'Corsair Tests' }],
			},
		});
		const out = await B.showTask(context(db), { task_id: 98765 });
		expect(db.tasks.upsertByEntityId).toHaveBeenCalledWith(
			'98765',
			expect.objectContaining({ assigned_to_id: 634824 }),
		);
		expect(BugherdEndpointOutputSchemas.showTask.safeParse(out).success).toBe(
			true,
		);
	});

	it('tasks.update unassigns with unassign_user', async () => {
		mockRequest.mockResolvedValue({ task: TASK });
		await B.updateTask(context(), {
			project_id: 552668,
			task_id: 98765,
			status: 'doing',
			unassign_user: 634824,
		});
		expect(call()).toMatchObject({
			method: 'PUT',
			url: '/projects/552668/tasks/98765.json',
			body: { task: { status: 'doing', unassign_user: 634824 } },
		});
	});

	it('tasks.update does not offer assigned_to_id null, which BugHerd ignores', () => {
		expect(
			UpdateTaskInputSchema.safeParse({
				project_id: 1,
				task_id: 2,
				assigned_to_id: null,
			}).success,
		).toBe(false);
	});

	it('tasks.delete removes the local row', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({ success: true });
		await B.deleteTask(context(db), { project_id: 552668, task_id: 98765 });
		expect(call()).toMatchObject({
			method: 'DELETE',
			url: '/projects/552668/tasks/98765.json',
		});
		expect(db.tasks.deleteByEntityId).toHaveBeenCalledWith('98765');
	});

	it('tasks.move posts local ids and the destination', async () => {
		mockRequest.mockResolvedValue('');
		const out = await B.moveTasks(context(), {
			project_id: 1,
			destination_project_id: 2,
			task_ids: [4, 5],
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/projects/1/move_tasks.json',
			body: { destination_project_id: 2, task_ids: [4, 5] },
		});
		expect(out).toEqual({});
	});
});

describe('comments', () => {
	it('tasks.listComments reads comments.json and stores them', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({ comments: [COMMENT] });
		const out = await B.listComments(context(db), {
			project_id: 1,
			task_id: 2,
		});
		expect(call()).toMatchObject({
			method: 'GET',
			url: '/projects/1/tasks/2/comments.json',
		});
		expect(db.comments.upsertByEntityId).toHaveBeenCalledWith(
			'8801',
			expect.objectContaining({ task_id: 2, text: 'corsair-plugin-test' }),
		);
		expect(
			BugherdEndpointOutputSchemas.listComments.safeParse(out).success,
		).toBe(true);
	});

	it('tasks.createComment wraps text in comment', async () => {
		mockRequest.mockResolvedValue({ comment: COMMENT });
		await B.createComment(context(), {
			project_id: 1,
			task_id: 2,
			text: 'corsair-plugin-test',
			is_private: true,
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/projects/1/tasks/2/comments.json',
			body: { comment: { text: 'corsair-plugin-test', is_private: true } },
		});
	});
});

describe('attachments', () => {
	it('tasks.listAttachments', async () => {
		mockRequest.mockResolvedValue({ attachments: [ATTACHMENT] });
		const db = tables();
		await B.listAttachments(context(db), { project_id: 1, task_id: 2 });
		expect(call()?.url).toBe('/projects/1/tasks/2/attachments.json');
		expect(db.attachments.upsertByEntityId).toHaveBeenCalledWith(
			'331',
			expect.objectContaining({ task_id: 2 }),
		);
	});

	it('tasks.showAttachment', async () => {
		mockRequest.mockResolvedValue({ attachment: ATTACHMENT });
		await B.showAttachment(context(), {
			project_id: 1,
			task_id: 2,
			attachment_id: 331,
		});
		expect(call()).toMatchObject({
			method: 'GET',
			url: '/projects/1/tasks/2/attachments/331.json',
		});
	});

	it('tasks.createAttachment posts file_name and url', async () => {
		mockRequest.mockResolvedValue({ attachment: ATTACHMENT });
		await B.createAttachment(context(), {
			project_id: 1,
			task_id: 2,
			file_name: 'corsair.png',
			url: 'https://example.com/corsair.png',
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/projects/1/tasks/2/attachments.json',
			body: {
				attachment: {
					file_name: 'corsair.png',
					url: 'https://example.com/corsair.png',
				},
			},
		});
	});

	it('tasks.uploadAttachment sends the raw file with its name in file_name', async () => {
		// Live run 11-18: a multipart upload is stored as "attachment" with
		// file_name null; the raw body with ?file_name= keeps the name.
		mockRequest.mockResolvedValue({ attachment: ATTACHMENT });
		await B.uploadAttachment(context(), {
			project_id: 1,
			task_id: 2,
			file: {
				base64: Buffer.from('hello').toString('base64'),
				filename: 'note.txt',
				contentType: 'text/plain',
			},
		});
		const options = call();
		expect(options).toMatchObject({
			method: 'POST',
			url: '/projects/1/tasks/2/attachments/upload',
			query: { file_name: 'note.txt' },
		});
		expect(options?.mediaType).toBeUndefined();
		expect(options?.formData).toBeUndefined();
		const body = options?.body as Blob;
		expect(body).toBeInstanceOf(Blob);
		expect(body.type).toBe('text/plain');
		expect(await body.text()).toBe('hello');
	});

	it('tasks.uploadAttachment sends a JSON file as bytes, not re-encoded', async () => {
		// With a JSON mediaType core would JSON.stringify the Blob ("{}").
		mockRequest.mockResolvedValue({ attachment: ATTACHMENT });
		await B.uploadAttachment(context(), {
			project_id: 1,
			task_id: 2,
			file: {
				base64: Buffer.from('{"a":1}').toString('base64'),
				filename: 'data.json',
				contentType: 'application/json',
			},
		});
		expect(call()?.mediaType).toBeUndefined();
		expect(await (call()?.body as Blob).text()).toBe('{"a":1}');
	});

	it('tasks.deleteAttachment removes the local row', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({ success: true });
		await B.deleteAttachment(context(db), {
			project_id: 1,
			task_id: 2,
			attachment_id: 331,
		});
		expect(call()).toMatchObject({
			method: 'DELETE',
			url: '/projects/1/tasks/2/attachments/331.json',
		});
		expect(db.attachments.deleteByEntityId).toHaveBeenCalledWith('331');
	});
});

describe('columns', () => {
	it('columns.list', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({ columns: [COLUMN] });
		await B.listColumns(context(db), { project_id: 552668 });
		expect(call()?.url).toBe('/projects/552668/columns.json');
		expect(db.columns.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('columns.show', async () => {
		mockRequest.mockResolvedValue({ column: COLUMN });
		await B.showColumn(context(), { project_id: 552668, column_id: 2387619 });
		expect(call()?.url).toBe('/projects/552668/columns/2387619.json');
	});

	it('columns.create wraps the name in column', async () => {
		mockRequest.mockResolvedValue({ column: COLUMN });
		await B.createColumn(context(), { project_id: 1, name: 'QA' });
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/projects/1/columns.json',
			body: { column: { name: 'QA' } },
		});
	});

	it('columns.update', async () => {
		mockRequest.mockResolvedValue({ column: COLUMN });
		await B.updateColumn(context(), {
			project_id: 1,
			column_id: 9,
			name: 'QA2',
		});
		expect(call()).toMatchObject({
			method: 'PUT',
			url: '/projects/1/columns/9.json',
			body: { column: { name: 'QA2' } },
		});
	});

	it('columns.delete', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({ success: true });
		await B.deleteColumn(context(db), { project_id: 1, column_id: 9 });
		expect(call()).toMatchObject({
			method: 'DELETE',
			url: '/projects/1/columns/9.json',
		});
		expect(db.columns.deleteByEntityId).toHaveBeenCalledWith('9');
	});
});

describe('webhooks', () => {
	it('webhooks.list', async () => {
		mockRequest.mockResolvedValue({ webhooks: [WEBHOOK] });
		const out = await B.listWebhooks(context(), {});
		expect(call()).toMatchObject({ method: 'GET', url: '/webhooks.json' });
		expect(
			BugherdEndpointOutputSchemas.listWebhooks.safeParse(out).success,
		).toBe(true);
	});

	it('webhooks.create posts target_url, event and project_id', async () => {
		mockRequest.mockResolvedValue({ webhook: WEBHOOK });
		await B.createWebhook(context(), {
			target_url: 'https://example.com/hook',
			event: 'task_create',
			project_id: 552668,
		});
		expect(call()).toMatchObject({
			method: 'POST',
			url: '/webhooks.json',
			body: {
				target_url: 'https://example.com/hook',
				event: 'task_create',
				project_id: 552668,
			},
		});
	});

	it('webhooks.create only takes BugHerd events', () => {
		expect(
			CreateWebhookInputSchema.safeParse({
				target_url: 'https://example.com',
				event: 'task_created',
			}).success,
		).toBe(false);
	});

	it('webhooks.delete', async () => {
		const db = tables();
		mockRequest.mockResolvedValue({ success: true });
		await B.deleteWebhook(context(db), { webhook_id: 22649 });
		expect(call()).toMatchObject({
			method: 'DELETE',
			url: '/webhooks/22649.json',
		});
		expect(db.webhooks.deleteByEntityId).toHaveBeenCalledWith('22649');
	});
});

describe('local storage', () => {
	it('a short list row keeps fields a detail read saved', async () => {
		const db = tables();
		db.projects = table({ id: '552668', name: 'old', is_active: true });
		mockRequest.mockResolvedValue({ projects: [LIST_PROJECT] });
		await B.listProjects(context(db), {});
		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			'552668',
			expect.objectContaining({
				name: "Corsair's First Project",
				is_active: true,
			}),
		);
	});

	it('tasks.delete removes saved comments and attachments of the task', async () => {
		const db = tables();
		db.comments.list.mockResolvedValue([
			{ entity_id: '8801', data: { task_id: 98765 } },
			{ entity_id: '8802', data: { task_id: 1 } },
		]);
		db.attachments.list.mockResolvedValue([
			{ entity_id: '331', data: { task_id: 98765 } },
		]);
		mockRequest.mockResolvedValue({ success: true });
		await B.deleteTask(context(db), { project_id: 1, task_id: 98765 });
		expect(db.comments.deleteByEntityId).toHaveBeenCalledWith('8801');
		expect(db.comments.deleteByEntityId).not.toHaveBeenCalledWith('8802');
		expect(db.attachments.deleteByEntityId).toHaveBeenCalledWith('331');
	});

	it('projects.delete removes its saved tasks, their comments, and its columns', async () => {
		const db = tables();
		db.tasks.list.mockResolvedValue([
			{ entity_id: '98765', data: { project_id: 7 } },
		]);
		db.columns.list.mockResolvedValue([
			{ entity_id: '2387619', data: { project_id: 7 } },
		]);
		db.comments.list.mockResolvedValue([
			{ entity_id: '8801', data: { task_id: 98765 } },
		]);
		mockRequest.mockResolvedValue({ success: true });
		await B.deleteProject(context(db), { project_id: 7 });
		expect(db.tasks.deleteByEntityId).toHaveBeenCalledWith('98765');
		expect(db.columns.deleteByEntityId).toHaveBeenCalledWith('2387619');
		expect(db.comments.deleteByEntityId).toHaveBeenCalledWith('8801');
	});

	it("tasks.move drops the moved tasks' saved rows", async () => {
		const db = tables();
		db.tasks.list.mockResolvedValue([
			{ entity_id: '98765', data: { project_id: 1, local_task_id: 4 } },
			{ entity_id: '98766', data: { project_id: 1, local_task_id: 5 } },
		]);
		mockRequest.mockResolvedValue({ success: true });
		await B.moveTasks(context(db), {
			project_id: 1,
			destination_project_id: 2,
			task_ids: [4],
		});
		expect(db.tasks.deleteByEntityId).toHaveBeenCalledWith('98765');
		expect(db.tasks.deleteByEntityId).not.toHaveBeenCalledWith('98766');
	});

	it('cleanup reads every page of saved rows', async () => {
		const db = tables();
		const page = (start: number, n: number) =>
			Array.from({ length: n }, (_, i) => ({
				entity_id: String(start + i),
				data: { task_id: 98765 },
			}));
		db.comments.list
			.mockResolvedValueOnce(page(0, 500))
			.mockResolvedValueOnce(page(500, 3));
		mockRequest.mockResolvedValue({ success: true });
		await B.deleteTask(context(db), { project_id: 1, task_id: 98765 });
		expect(db.comments.list).toHaveBeenCalledWith({ limit: 500, offset: 500 });
		expect(db.comments.deleteByEntityId).toHaveBeenCalledTimes(503);
	});
});

describe('validation', () => {
	it('rejects bad input before calling BugHerd', async () => {
		const plugin = bugherd();
		await expect(
			plugin.endpoints!.projects.addGuest(context(), {
				project_id: 1,
			} as never),
		).rejects.toThrow();
		await expect(
			plugin.endpoints!.tasks.list(context(), {
				project_id: 1,
				priority: 'high',
			} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('checks the response against the output schema', async () => {
		mockRequest.mockResolvedValue({ task: { title: 'no id' } });
		await expect(
			bugherd().endpoints!.tasks.show(context(), { task_id: 1 }),
		).rejects.toThrow();
	});

	it('passes valid input through', async () => {
		mockRequest.mockResolvedValue({ task: TASK });
		const out = await bugherd().endpoints!.tasks.show(context(), {
			task_id: 98765,
		});
		expect(out.task.id).toBe(98765);
	});
});

describe('plugin wiring', () => {
	it('has a schema for every endpoint', () => {
		const plugin = bugherd();
		const groups = plugin.endpoints as Record<string, Record<string, unknown>>;
		const paths = Object.entries(groups).flatMap(([group, ops]) =>
			Object.keys(ops).map((op) => `${group}.${op}`),
		);
		expect(paths.sort()).toEqual(Object.keys(bugherdEndpointSchemas).sort());
		expect(paths).toHaveLength(39);
	});

	it('marks deletes and email invites destructive', () => {
		const meta = bugherd().endpointMeta as Record<
			string,
			{ riskLevel: string }
		>;
		const destructive = Object.entries(meta)
			.filter(([, m]) => m.riskLevel === 'destructive')
			.map(([path]) => path)
			.sort();
		expect(destructive).toEqual([
			'columns.delete',
			'projects.addGuest',
			'projects.delete',
			'tasks.delete',
			'tasks.deleteAttachment',
			'webhooks.delete',
		]);
		expect(meta['tasks.createComment']?.riskLevel).toBe('write');
	});

	it('throws AuthMissingError without a stored key', async () => {
		const plugin = bugherd();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue(null) },
		};
		await expect(
			plugin.keyBuilder?.(ctx as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns the stored key', async () => {
		const plugin = bugherd();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue('stored') },
		};
		await expect(plugin.keyBuilder?.(ctx as never, 'endpoint')).resolves.toBe(
			'stored',
		);
	});

	it('does not retry a 429 core already retried', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/x' },
			{ url: '/x', ok: false, status: 429, statusText: '', body: {} },
			'429',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
