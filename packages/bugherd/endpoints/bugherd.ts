import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { resolveFileInput } from 'corsair/http';
import type { BugherdQuery } from '../client';
import { makeBugherdRequest, seg } from '../client';
import type { BugherdContext } from '../context';
import type {
	BugherdAttachmentRecord,
	BugherdColumnRecord,
	BugherdCommentRecord,
	BugherdEndpointInputs,
	BugherdEndpointOutputs,
	BugherdProjectRecord,
	BugherdTaskRecord,
	BugherdUserRecord,
	BugherdWebhookRecord,
} from './types';
import {
	BugherdEndpointInputSchemas,
	BugherdEndpointOutputSchemas,
} from './types';

type Endpoint<K extends keyof BugherdEndpointOutputs> = CorsairEndpoint<
	BugherdContext,
	BugherdEndpointInputs[K],
	BugherdEndpointOutputs[K]
>;

// ── Local storage ─────────────────────────────────────────────────────────────

/**
 * Local tables, or undefined when no database is configured. Core still hands
 * out stub tables then, whose writes throw, so `ctx.db` alone is not the signal.
 */
function store(ctx: BugherdContext) {
	return ctx.database ? ctx.db : undefined;
}

// The part of core's entity table these helpers use.
type Table<T> = {
	// unknown: the saved entity, which the helpers don't read.
	upsertByEntityId: (id: string, row: T) => Promise<unknown>;
	// unknown: core's boolean, which the helpers don't read.
	deleteByEntityId: (id: string) => Promise<unknown>;
	// unknown: whatever an earlier save wrote; checked before use.
	findByEntityId: (id: string) => Promise<{ data: unknown } | null>;
	list: (options?: {
		limit?: number;
		offset?: number;
		// unknown: whatever an earlier save wrote; checked before use.
	}) => Promise<Array<{ entity_id: string; data: unknown }>>;
};

/**
 * Upserts rows, keeping fields a shorter response leaves out. BugHerd's list
 * routes return fewer fields than its detail routes (projects.list has no
 * is_active), and an upsert alone would replace the saved row with the
 * shorter one.
 */
async function save<T extends { id: string }>(
	table: Table<T> | undefined,
	rows: T[],
	label: string,
) {
	if (!table) return;
	for (const row of rows) {
		try {
			const given = Object.fromEntries(
				Object.entries(row).filter(([, value]) => value !== undefined),
			);
			const existing = await table.findByEntityId(row.id);
			const saved =
				existing?.data && typeof existing.data === 'object'
					? (existing.data as Partial<T>)
					: {};
			await table.upsertByEntityId(row.id, { ...saved, ...given } as T);
		} catch {
			console.warn(`Failed to save BugHerd ${label}`);
		}
	}
}

async function drop(
	table: Pick<Table<never>, 'deleteByEntityId'> | undefined,
	id: number | string,
	label: string,
) {
	if (!table) return;
	try {
		await table.deleteByEntityId(String(id));
	} catch {
		console.warn(`Failed to remove BugHerd ${label}`);
	}
}

/**
 * Removes every local row whose data `matches`, in one pass over the table.
 * Pages through list() and filters in memory: search() on data fields is
 * refused when encryptDataAtRest is on. Matches are collected first so this
 * call's deletes don't shift its pages. Best effort: a row another call
 * deletes mid-scan can shift a page, and the next read of the project
 * re-saves or replaces what is left.
 */
async function dropWhere(
	table: Pick<Table<never>, 'deleteByEntityId' | 'list'> | undefined,
	matches: (data: Record<string, unknown>) => boolean,
	label: string,
): Promise<string[]> {
	if (!table) return [];
	const PAGE = 500;
	const found: string[] = [];
	try {
		for (let offset = 0; ; offset += PAGE) {
			const rows = await table.list({ limit: PAGE, offset });
			for (const row of rows) {
				const data =
					row.data && typeof row.data === 'object'
						? (row.data as Record<string, unknown>)
						: {};
				if (matches(data)) found.push(row.entity_id);
			}
			if (rows.length < PAGE) break;
		}
	} catch {
		console.warn(`Failed to read saved BugHerd ${label}s`);
	}
	for (const id of found) await drop(table, id, label);
	return found;
}

/** Deleted tasks take their saved comments and attachments with them. */
async function dropTaskChildren(
	ctx: BugherdContext,
	taskIds: ReadonlyArray<number | string>,
) {
	if (taskIds.length === 0) return;
	const ids = new Set(taskIds.map(Number));
	const db = store(ctx);
	const ofTasks = (data: Record<string, unknown>) =>
		ids.has(Number(data.task_id));
	await dropWhere(db?.comments, ofTasks, 'comment');
	await dropWhere(db?.attachments, ofTasks, 'attachment');
}

const projectRow = (p: BugherdProjectRecord) => ({
	id: String(p.id),
	name: p.name,
	devurl: p.devurl,
	is_active: p.is_active,
	is_public: p.is_public,
	owner_name: p.owner_name,
	created_at: p.created_at,
});

const taskRow = (t: BugherdTaskRecord) => ({
	id: String(t.id),
	project_id: t.project_id,
	local_task_id: t.local_task_id,
	title: t.title,
	description: t.description,
	status: t.status,
	priority: t.priority,
	tag_names: t.tag_names,
	// BugHerd leaves assigned_to_id null and puts the user in assigned_to.
	assigned_to_id: t.assigned_to?.id ?? t.assigned_to_id,
	external_id: t.external_id,
	created_at: t.created_at,
	updated_at: t.updated_at,
	closed_at: t.closed_at,
});

const columnRow = (c: BugherdColumnRecord) => ({
	id: String(c.id),
	project_id: c.project_id,
	name: c.name,
	position: c.position,
});

const commentRow = (taskId: number) => (c: BugherdCommentRecord) => ({
	id: String(c.id),
	task_id: taskId,
	user_id: c.user_id,
	text: c.text,
	is_private: c.is_private,
	created_at: c.created_at,
});

const attachmentRow = (taskId: number) => (a: BugherdAttachmentRecord) => ({
	id: String(a.id),
	task_id: taskId,
	file_name: a.file_name,
	url: a.url,
	created_at: a.created_at,
});

const webhookRow = (w: BugherdWebhookRecord) => ({
	id: String(w.id),
	target_url: w.target_url,
	event: w.event,
	project_id: w.project_id,
});

const userRow = (u: BugherdUserRecord) => ({
	id: String(u.id),
	email: u.email,
	display_name: u.display_name,
});

// ── Response helpers ──────────────────────────────────────────────────────────

/**
 * Projects carry the project's widget key (`api_key`), which lets anyone post
 * feedback into the project. It is a credential, so it never leaves the plugin.
 */
// Projects are loose objects: BugHerd adds fields the schema doesn't list.
function withoutWidgetKey<T extends Record<string, unknown>>(project: T): T {
	if (!project || typeof project !== 'object' || !('api_key' in project))
		return project;
	const { api_key: _dropped, ...rest } = project;
	return rest as T;
}

function cleanProjects<T extends { projects: BugherdProjectRecord[] }>(
	body: T,
): T {
	return { ...body, projects: body.projects.map(withoutWidgetKey) };
}

function cleanProject<T extends { project: BugherdProjectRecord }>(body: T): T {
	return { ...body, project: withoutWidgetKey(body.project) };
}

// Input fields that are zod-checked strings, numbers or booleans.
function query(values: Record<string, unknown>): BugherdQuery | undefined {
	const out: BugherdQuery = {};
	for (const [key, value] of Object.entries(values)) {
		if (value === undefined) continue;
		out[key] = value as string | number | boolean;
	}
	return Object.keys(out).length ? out : undefined;
}

// Zod-checked input fields, passed through to a JSON body.
function defined(values: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(values).filter(([, value]) => value !== undefined),
	);
}

const projectPath = (projectId: number) => `/projects/${seg(projectId)}`;
const taskPath = (projectId: number, taskId: number) =>
	`${projectPath(projectId)}/tasks/${seg(taskId)}`;

// ── Organization and users ────────────────────────────────────────────────────

export const showOrganization: Endpoint<'showOrganization'> = async (ctx) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['showOrganization']
	>('/organization.json', ctx.key);
	await save(
		store(ctx)?.organization,
		[{ id: String(result.organization.id), name: result.organization.name }],
		'organization',
	);
	await logEventFromContext(ctx, 'bugherd.organization.show', {}, 'completed');
	return result;
};

function userList(
	path: string,
	event: string,
): (
	ctx: BugherdContext,
	input: { page?: number; updated_since?: string },
) => Promise<BugherdEndpointOutputs['listUsers']> {
	return async (ctx, input) => {
		const result = await makeBugherdRequest<
			BugherdEndpointOutputs['listUsers']
		>(path, ctx.key, {
			query: query({ updated_since: input.updated_since, page: input.page }),
		});
		await save(store(ctx)?.users, result.users.map(userRow), 'user');
		await logEventFromContext(
			ctx,
			event,
			{ count: result.users.length },
			'completed',
		);
		return result;
	};
}

export const listUsers: Endpoint<'listUsers'> = userList(
	'/users.json',
	'bugherd.users.list',
);
export const listMembers: Endpoint<'listMembers'> = userList(
	'/users/members.json',
	'bugherd.users.listMembers',
);
export const listGuests: Endpoint<'listGuests'> = userList(
	'/users/guests.json',
	'bugherd.users.listGuests',
);

export const showUserProjects: Endpoint<'showUserProjects'> = async (
	ctx,
	input,
) => {
	const { user_id, ...filters } = input;
	const result = cleanProjects(
		await makeBugherdRequest<BugherdEndpointOutputs['showUserProjects']>(
			`/users/${seg(user_id)}/projects.json`,
			ctx.key,
			{ query: query(filters) },
		),
	);
	await save(store(ctx)?.projects, result.projects.map(projectRow), 'project');
	await logEventFromContext(
		ctx,
		'bugherd.users.listProjects',
		{ user_id, count: result.projects.length },
		'completed',
	);
	return result;
};

export const showUserTasks: Endpoint<'showUserTasks'> = async (ctx, input) => {
	const { user_id, ...filters } = input;
	// This route answers with a bare array; other task lists use { tasks }.
	const body = await makeBugherdRequest<
		BugherdEndpointOutputs['showUserTasks'] | BugherdTaskRecord[]
	>(`/users/${seg(user_id)}/tasks.json`, ctx.key, { query: query(filters) });
	const result = Array.isArray(body) ? { tasks: body } : body;
	await save(store(ctx)?.tasks, result.tasks.map(taskRow), 'task');
	await logEventFromContext(
		ctx,
		'bugherd.tasks.listForUser',
		{ user_id, count: result.tasks.length },
		'completed',
	);
	return result;
};

// ── Projects ──────────────────────────────────────────────────────────────────

function projectList(
	path: string,
	event: string,
): (
	ctx: BugherdContext,
	input: { page?: number },
) => Promise<BugherdEndpointOutputs['listProjects']> {
	return async (ctx, input) => {
		const result = cleanProjects(
			await makeBugherdRequest<BugherdEndpointOutputs['listProjects']>(
				path,
				ctx.key,
				{ query: query({ page: input.page }) },
			),
		);
		await save(
			store(ctx)?.projects,
			result.projects.map(projectRow),
			'project',
		);
		await logEventFromContext(
			ctx,
			event,
			{ count: result.projects.length },
			'completed',
		);
		return result;
	};
}

export const listProjects: Endpoint<'listProjects'> = projectList(
	'/projects.json',
	'bugherd.projects.list',
);
export const listActiveProjects: Endpoint<'listActiveProjects'> = projectList(
	'/projects/active.json',
	'bugherd.projects.listActive',
);

async function saveProject(
	ctx: BugherdContext,
	result: { project: BugherdProjectRecord },
) {
	const db = store(ctx);
	await save(db?.projects, [projectRow(result.project)], 'project');
	const project = result.project;
	if (project.columns?.length)
		await save(db?.columns, project.columns.map(columnRow), 'column');
	const people = [...(project.members ?? []), ...(project.guests ?? [])];
	if (people.length) await save(db?.users, people.map(userRow), 'user');
}

export const showProjectDetails: Endpoint<'showProjectDetails'> = async (
	ctx,
	input,
) => {
	const result = cleanProject(
		await makeBugherdRequest<BugherdEndpointOutputs['showProjectDetails']>(
			`${projectPath(input.project_id)}.json`,
			ctx.key,
		),
	);
	await saveProject(ctx, result);
	await logEventFromContext(
		ctx,
		'bugherd.projects.show',
		{ project_id: input.project_id },
		'completed',
	);
	return result;
};

export const createProject: Endpoint<'createProject'> = async (ctx, input) => {
	const result = cleanProject(
		await makeBugherdRequest<BugherdEndpointOutputs['createProject']>(
			'/projects.json',
			ctx.key,
			{ method: 'POST', body: { project: defined(input) } },
		),
	);
	await saveProject(ctx, result);
	await logEventFromContext(
		ctx,
		'bugherd.projects.create',
		{ project_id: result.project.id },
		'completed',
	);
	return result;
};

export const updateProject: Endpoint<'updateProject'> = async (ctx, input) => {
	const { project_id, ...fields } = input;
	const result = cleanProject(
		await makeBugherdRequest<BugherdEndpointOutputs['updateProject']>(
			`${projectPath(project_id)}.json`,
			ctx.key,
			{ method: 'PUT', body: { project: defined(fields) } },
		),
	);
	await saveProject(ctx, result);
	await logEventFromContext(
		ctx,
		'bugherd.projects.update',
		{ project_id },
		'completed',
	);
	return result;
};

export const deleteProject: Endpoint<'deleteProject'> = async (ctx, input) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['deleteProject']
	>(`${projectPath(input.project_id)}.json`, ctx.key, { method: 'DELETE' });
	const db = store(ctx);
	await drop(db?.projects, input.project_id, 'project');
	const inProject = (data: Record<string, unknown>) =>
		data.project_id === input.project_id;
	await dropWhere(db?.columns, inProject, 'column');
	await dropTaskChildren(ctx, await dropWhere(db?.tasks, inProject, 'task'));
	await logEventFromContext(
		ctx,
		'bugherd.projects.delete',
		{ project_id: input.project_id },
		'completed',
	);
	return result;
};

export const addMemberToProject: Endpoint<'addMemberToProject'> = async (
	ctx,
	input,
) => {
	const result = cleanProject(
		await makeBugherdRequest<BugherdEndpointOutputs['addMemberToProject']>(
			`${projectPath(input.project_id)}/add_member.json`,
			ctx.key,
			{ method: 'POST', body: { user_id: input.user_id } },
		),
	);
	await saveProject(ctx, result);
	await logEventFromContext(
		ctx,
		'bugherd.projects.addMember',
		{ project_id: input.project_id },
		'completed',
	);
	return result;
};

export const addGuestToProject: Endpoint<'addGuestToProject'> = async (
	ctx,
	input,
) => {
	const { project_id, ...who } = input;
	const result = cleanProject(
		await makeBugherdRequest<BugherdEndpointOutputs['addGuestToProject']>(
			`${projectPath(project_id)}/add_guest.json`,
			ctx.key,
			{ method: 'POST', body: defined(who) },
		),
	);
	await saveProject(ctx, result);
	// The guest's email stays out of the event.
	await logEventFromContext(
		ctx,
		'bugherd.projects.addGuest',
		{ project_id, invited_by_email: who.email !== undefined },
		'completed',
	);
	return result;
};

// ── Tasks ─────────────────────────────────────────────────────────────────────

async function listTaskRoute(
	ctx: BugherdContext,
	path: string,
	// Zod-checked filters for the query string.
	params: Record<string, unknown>,
	event: string,
	projectId: number,
): Promise<BugherdEndpointOutputs['listTasks']> {
	const result = await makeBugherdRequest<BugherdEndpointOutputs['listTasks']>(
		path,
		ctx.key,
		{ query: query(params) },
	);
	await save(store(ctx)?.tasks, result.tasks.map(taskRow), 'task');
	await logEventFromContext(
		ctx,
		event,
		{ project_id: projectId, count: result.tasks.length },
		'completed',
	);
	return result;
}

export const listTasks: Endpoint<'listTasks'> = async (ctx, input) => {
	const { project_id, ...filters } = input;
	return listTaskRoute(
		ctx,
		`${projectPath(project_id)}/tasks.json`,
		filters,
		'bugherd.tasks.list',
		project_id,
	);
};

function taskView(
	view: 'feedback' | 'archive' | 'taskboard',
	event: string,
): Endpoint<'listFeedbackTasks'> {
	return async (ctx, input) =>
		listTaskRoute(
			ctx,
			`${projectPath(input.project_id)}/tasks/${view}.json`,
			{ page: input.page },
			event,
			input.project_id,
		);
}

export const listFeedbackTasks = taskView(
	'feedback',
	'bugherd.tasks.listFeedback',
);
export const listArchivedTasks = taskView(
	'archive',
	'bugherd.tasks.listArchived',
);
export const listTaskboardTasks = taskView(
	'taskboard',
	'bugherd.tasks.listTaskboard',
);

async function oneTask(
	ctx: BugherdContext,
	path: string,
	event: string,
	method: 'GET' | 'POST' | 'PUT' = 'GET',
	// Zod-checked input, wrapped as BugHerd expects ({ task: ... }).
	body?: Record<string, unknown>,
): Promise<BugherdEndpointOutputs['showTask']> {
	const result = await makeBugherdRequest<BugherdEndpointOutputs['showTask']>(
		path,
		ctx.key,
		{ method, body },
	);
	await save(store(ctx)?.tasks, [taskRow(result.task)], 'task');
	await logEventFromContext(
		ctx,
		event,
		{ task_id: result.task.id, project_id: result.task.project_id },
		'completed',
	);
	return result;
}

export const showTask: Endpoint<'showTask'> = async (ctx, input) =>
	oneTask(
		ctx,
		input.project_id === undefined
			? `/tasks/${seg(input.task_id)}.json`
			: `${taskPath(input.project_id, input.task_id)}.json`,
		'bugherd.tasks.show',
	);

export const showTaskByLocalId: Endpoint<'showTaskByLocalId'> = async (
	ctx,
	input,
) =>
	oneTask(
		ctx,
		`${projectPath(input.project_id)}/local_tasks/${seg(input.local_task_id)}.json`,
		'bugherd.tasks.showByLocalId',
	);

export const createTask: Endpoint<'createTask'> = async (ctx, input) => {
	const { project_id, ...fields } = input;
	return oneTask(
		ctx,
		`${projectPath(project_id)}/tasks.json`,
		'bugherd.tasks.create',
		'POST',
		{ task: defined(fields) },
	);
};

export const updateTask: Endpoint<'updateTask'> = async (ctx, input) => {
	const { project_id, task_id, ...fields } = input;
	return oneTask(
		ctx,
		`${taskPath(project_id, task_id)}.json`,
		'bugherd.tasks.update',
		'PUT',
		{ task: defined(fields) },
	);
};

export const deleteTask: Endpoint<'deleteTask'> = async (ctx, input) => {
	const result = await makeBugherdRequest<BugherdEndpointOutputs['deleteTask']>(
		`${taskPath(input.project_id, input.task_id)}.json`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await drop(store(ctx)?.tasks, input.task_id, 'task');
	await dropTaskChildren(ctx, [input.task_id]);
	await logEventFromContext(
		ctx,
		'bugherd.tasks.delete',
		{ project_id: input.project_id, task_id: input.task_id },
		'completed',
	);
	return result;
};

export const moveTasks: Endpoint<'moveTasks'> = async (ctx, input) => {
	const { project_id, destination_project_id, task_ids } = input;
	// unknown: BugHerd documents no response body for this route.
	const body = await makeBugherdRequest<unknown>(
		`${projectPath(project_id)}/move_tasks.json`,
		ctx.key,
		{ method: 'POST', body: { destination_project_id, task_ids } },
	);
	// Saved rows still name the old project; the next read re-saves them.
	const moved = new Set(task_ids);
	await dropWhere(
		store(ctx)?.tasks,
		(data) =>
			data.project_id === project_id && moved.has(Number(data.local_task_id)),
		'task',
	);
	await logEventFromContext(
		ctx,
		'bugherd.tasks.move',
		{ project_id, destination_project_id, count: task_ids.length },
		'completed',
	);
	// BugHerd documents no response body for this route.
	return body && typeof body === 'object' && !Array.isArray(body)
		? (body as BugherdEndpointOutputs['moveTasks'])
		: {};
};

// ── Comments ──────────────────────────────────────────────────────────────────

export const listComments: Endpoint<'listComments'> = async (ctx, input) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['listComments']
	>(`${taskPath(input.project_id, input.task_id)}/comments.json`, ctx.key);
	await save(
		store(ctx)?.comments,
		result.comments.map(commentRow(input.task_id)),
		'comment',
	);
	await logEventFromContext(
		ctx,
		'bugherd.tasks.listComments',
		{ task_id: input.task_id, count: result.comments.length },
		'completed',
	);
	return result;
};

export const createComment: Endpoint<'createComment'> = async (ctx, input) => {
	const { project_id, task_id, ...fields } = input;
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['createComment']
	>(`${taskPath(project_id, task_id)}/comments.json`, ctx.key, {
		method: 'POST',
		body: { comment: defined(fields) },
	});
	await save(
		store(ctx)?.comments,
		[commentRow(task_id)(result.comment)],
		'comment',
	);
	await logEventFromContext(
		ctx,
		'bugherd.tasks.createComment',
		{ task_id, comment_id: result.comment.id },
		'completed',
	);
	return result;
};

// ── Attachments ───────────────────────────────────────────────────────────────

export const listAttachments: Endpoint<'listAttachments'> = async (
	ctx,
	input,
) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['listAttachments']
	>(`${taskPath(input.project_id, input.task_id)}/attachments.json`, ctx.key);
	await save(
		store(ctx)?.attachments,
		result.attachments.map(attachmentRow(input.task_id)),
		'attachment',
	);
	await logEventFromContext(
		ctx,
		'bugherd.tasks.listAttachments',
		{ task_id: input.task_id, count: result.attachments.length },
		'completed',
	);
	return result;
};

async function oneAttachment(
	ctx: BugherdContext,
	taskId: number,
	path: string,
	event: string,
	options: Parameters<typeof makeBugherdRequest>[2] = {},
): Promise<BugherdEndpointOutputs['showAttachment']> {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['showAttachment']
	>(path, ctx.key, options);
	await save(
		store(ctx)?.attachments,
		[attachmentRow(taskId)(result.attachment)],
		'attachment',
	);
	await logEventFromContext(
		ctx,
		event,
		{ task_id: taskId, attachment_id: result.attachment.id },
		'completed',
	);
	return result;
}

export const showAttachment: Endpoint<'showAttachment'> = async (ctx, input) =>
	oneAttachment(
		ctx,
		input.task_id,
		`${taskPath(input.project_id, input.task_id)}/attachments/${seg(input.attachment_id)}.json`,
		'bugherd.tasks.showAttachment',
	);

export const createAttachment: Endpoint<'createAttachment'> = async (
	ctx,
	input,
) =>
	oneAttachment(
		ctx,
		input.task_id,
		`${taskPath(input.project_id, input.task_id)}/attachments.json`,
		'bugherd.tasks.createAttachment',
		{
			method: 'POST',
			body: { attachment: { file_name: input.file_name, url: input.url } },
		},
	);

/** BugHerd allows about 30 seconds per upload; larger files should use a URL. */
const UPLOAD_MAX_BYTES = 25 * 1024 * 1024;

export const uploadAttachment: Endpoint<'uploadAttachment'> = async (
	ctx,
	input,
) => {
	const file = await resolveFileInput(input.file, {
		maxBytes: UPLOAD_MAX_BYTES,
		fallbackName: 'attachment',
	});
	return oneAttachment(
		ctx,
		input.task_id,
		`${taskPath(input.project_id, input.task_id)}/attachments/upload`,
		'bugherd.tasks.uploadAttachment',
		// BugHerd keeps the name only from ?file_name=; a multipart upload is
		// stored as "attachment" with no file name.
		{
			method: 'POST',
			query: { file_name: file.filename },
			file: file.file,
		},
	);
};

export const deleteAttachment: Endpoint<'deleteAttachment'> = async (
	ctx,
	input,
) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['deleteAttachment']
	>(
		`${taskPath(input.project_id, input.task_id)}/attachments/${seg(input.attachment_id)}.json`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await drop(store(ctx)?.attachments, input.attachment_id, 'attachment');
	await logEventFromContext(
		ctx,
		'bugherd.tasks.deleteAttachment',
		{ task_id: input.task_id, attachment_id: input.attachment_id },
		'completed',
	);
	return result;
};

// ── Columns ───────────────────────────────────────────────────────────────────

export const listColumns: Endpoint<'listColumns'> = async (ctx, input) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['listColumns']
	>(`${projectPath(input.project_id)}/columns.json`, ctx.key);
	await save(store(ctx)?.columns, result.columns.map(columnRow), 'column');
	await logEventFromContext(
		ctx,
		'bugherd.columns.list',
		{ project_id: input.project_id, count: result.columns.length },
		'completed',
	);
	return result;
};

async function oneColumn(
	ctx: BugherdContext,
	path: string,
	event: string,
	method: 'GET' | 'POST' | 'PUT' = 'GET',
	// Zod-checked input, wrapped as BugHerd expects ({ column: ... }).
	body?: Record<string, unknown>,
): Promise<BugherdEndpointOutputs['showColumn']> {
	const result = await makeBugherdRequest<BugherdEndpointOutputs['showColumn']>(
		path,
		ctx.key,
		{ method, body },
	);
	await save(store(ctx)?.columns, [columnRow(result.column)], 'column');
	await logEventFromContext(
		ctx,
		event,
		{ column_id: result.column.id },
		'completed',
	);
	return result;
}

const columnPath = (projectId: number, columnId: number) =>
	`${projectPath(projectId)}/columns/${seg(columnId)}.json`;

export const showColumn: Endpoint<'showColumn'> = async (ctx, input) =>
	oneColumn(
		ctx,
		columnPath(input.project_id, input.column_id),
		'bugherd.columns.show',
	);

export const createColumn: Endpoint<'createColumn'> = async (ctx, input) =>
	oneColumn(
		ctx,
		`${projectPath(input.project_id)}/columns.json`,
		'bugherd.columns.create',
		'POST',
		{ column: { name: input.name } },
	);

export const updateColumn: Endpoint<'updateColumn'> = async (ctx, input) =>
	oneColumn(
		ctx,
		columnPath(input.project_id, input.column_id),
		'bugherd.columns.update',
		'PUT',
		{ column: { name: input.name } },
	);

export const deleteColumn: Endpoint<'deleteColumn'> = async (ctx, input) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['deleteColumn']
	>(columnPath(input.project_id, input.column_id), ctx.key, {
		method: 'DELETE',
	});
	await drop(store(ctx)?.columns, input.column_id, 'column');
	await logEventFromContext(
		ctx,
		'bugherd.columns.delete',
		{ project_id: input.project_id, column_id: input.column_id },
		'completed',
	);
	return result;
};

// ── Webhooks ──────────────────────────────────────────────────────────────────

export const listWebhooks: Endpoint<'listWebhooks'> = async (ctx) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['listWebhooks']
	>('/webhooks.json', ctx.key);
	await save(store(ctx)?.webhooks, result.webhooks.map(webhookRow), 'webhook');
	await logEventFromContext(
		ctx,
		'bugherd.webhooks.list',
		{ count: result.webhooks.length },
		'completed',
	);
	return result;
};

export const createWebhook: Endpoint<'createWebhook'> = async (ctx, input) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['createWebhook']
	>('/webhooks.json', ctx.key, { method: 'POST', body: defined(input) });
	await save(store(ctx)?.webhooks, [webhookRow(result.webhook)], 'webhook');
	await logEventFromContext(
		ctx,
		'bugherd.webhooks.create',
		{ webhook_id: result.webhook.id, event: input.event },
		'completed',
	);
	return result;
};

export const deleteWebhook: Endpoint<'deleteWebhook'> = async (ctx, input) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['deleteWebhook']
	>(`/webhooks/${seg(input.webhook_id)}.json`, ctx.key, { method: 'DELETE' });
	await drop(store(ctx)?.webhooks, input.webhook_id, 'webhook');
	await logEventFromContext(
		ctx,
		'bugherd.webhooks.delete',
		{ webhook_id: input.webhook_id },
		'completed',
	);
	return result;
};

// ── Validation ────────────────────────────────────────────────────────────────

/**
 * Core hands the input to the handler as given and doesn't run
 * endpointSchemas, so each endpoint checks its input (ids, enums, the
 * user_id-or-email rule) before calling BugHerd, and its response after.
 */
export function validated<K extends keyof BugherdEndpointOutputs>(
	name: K,
	handler: Endpoint<K>,
): Endpoint<K> {
	return async (ctx, input) => {
		const parsed = BugherdEndpointInputSchemas[name].parse(input ?? {});
		const result = await handler(ctx, parsed as BugherdEndpointInputs[K]);
		return BugherdEndpointOutputSchemas[name].parse(
			result,
		) as BugherdEndpointOutputs[K];
	};
}
