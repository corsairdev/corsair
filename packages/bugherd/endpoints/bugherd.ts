import { logEventFromContext } from 'corsair/core';
import type { BugherdEndpoints } from '..';
import { makeBugherdRequest } from '../client';
import type { BugherdEndpointOutputs } from './types';

export const addGuestToProject: BugherdEndpoints['addGuestToProject'] = async (
	ctx,
	input,
) => {
	const { project_id, email, role } = input;
	const body: Record<string, unknown> = { email };
	if (role) body.role = role;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['addGuestToProject']
	>(`projects/${project_id}/guests`, ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'bugherd.addGuestToProject',
		{ project_id, email },
		'completed',
	);
	return result;
};

export const addMemberToProject: BugherdEndpoints['addMemberToProject'] =
	async (ctx, input) => {
		const { project_id, user_id, role } = input;
		const body: Record<string, unknown> = { user_id };
		if (role) body.role = role;

		const result = await makeBugherdRequest<
			BugherdEndpointOutputs['addMemberToProject']
		>(`projects/${project_id}/members`, ctx.key, {
			method: 'POST',
			body,
		});

		await logEventFromContext(
			ctx,
			'bugherd.addMemberToProject',
			{ project_id, user_id },
			'completed',
		);
		return result;
	};

export const createAttachment: BugherdEndpoints['createAttachment'] = async (
	ctx,
	input,
) => {
	const { task_id, file_name, file_size, content_type, url } = input;
	const body: Record<string, unknown> = {};
	if (file_name) body.file_name = file_name;
	if (file_size) body.file_size = file_size;
	if (content_type) body.content_type = content_type;
	if (url) body.url = url;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['createAttachment']
	>(`tasks/${task_id}/attachments`, ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'bugherd.createAttachment',
		{ task_id },
		'completed',
	);
	return result;
};

export const createColumn: BugherdEndpoints['createColumn'] = async (
	ctx,
	input,
) => {
	const { project_id, name, position } = input;
	const body: Record<string, unknown> = { name };
	if (position !== undefined) body.position = position;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['createColumn']
	>(`projects/${project_id}/columns`, ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'bugherd.createColumn',
		{ project_id, name },
		'completed',
	);
	return result;
};

export const createComment: BugherdEndpoints['createComment'] = async (
	ctx,
	input,
) => {
	const { task_id, body: commentBody } = input;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['createComment']
	>(`tasks/${task_id}/comments`, ctx.key, {
		method: 'POST',
		body: { body: commentBody },
	});

	await logEventFromContext(
		ctx,
		'bugherd.createComment',
		{ task_id },
		'completed',
	);
	return result;
};

export const createProject: BugherdEndpoints['createProject'] = async (
	ctx,
	input,
) => {
	const {
		name,
		is_active,
		is_public,
		description,
		technical_contact_email,
		guest_default_role,
	} = input;
	const body: Record<string, unknown> = { name };
	if (is_active !== undefined) body.is_active = is_active;
	if (is_public !== undefined) body.is_public = is_public;
	if (description !== undefined) body.description = description;
	if (technical_contact_email !== undefined)
		body.technical_contact_email = technical_contact_email;
	if (guest_default_role !== undefined)
		body.guest_default_role = guest_default_role;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['createProject']
	>('projects', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'bugherd.createProject',
		{ name },
		'completed',
	);
	return result;
};

export const createTask: BugherdEndpoints['createTask'] = async (
	ctx,
	input,
) => {
	const {
		project_id,
		description,
		priority,
		status,
		tag_list,
		assignee_id,
		reporter_id,
		external_id,
		due_date,
		column_id,
	} = input;
	const body: Record<string, unknown> = { description };
	if (priority) body.priority = priority;
	if (status) body.status = status;
	if (tag_list?.length) body.tag_list = tag_list;
	if (assignee_id !== undefined) body.assignee_id = assignee_id;
	if (reporter_id !== undefined) body.reporter_id = reporter_id;
	if (external_id !== undefined) body.external_id = external_id;
	if (due_date !== undefined) body.due_date = due_date;
	if (column_id !== undefined) body.column_id = column_id;

	const result = await makeBugherdRequest<BugherdEndpointOutputs['createTask']>(
		`projects/${project_id}/tasks`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'bugherd.createTask',
		{ project_id },
		'completed',
	);
	return result;
};

export const createWebhook: BugherdEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	const { project_id, url, events } = input;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['createWebhook']
	>(`projects/${project_id}/webhooks`, ctx.key, {
		method: 'POST',
		body: { url, events },
	});

	await logEventFromContext(
		ctx,
		'bugherd.createWebhook',
		{ project_id },
		'completed',
	);
	return result;
};

export const deleteProject: BugherdEndpoints['deleteProject'] = async (
	ctx,
	input,
) => {
	const { project_id } = input;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['deleteProject']
	>(`projects/${project_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'bugherd.deleteProject',
		{ project_id },
		'completed',
	);
	return result;
};

export const listActiveProjects: BugherdEndpoints['listActiveProjects'] =
	async (ctx, input) => {
		const { page, per_page } = input;
		const query: Record<string, string | number | boolean | undefined> = {
			is_active: true,
		};
		if (page) query.page = page;
		if (per_page) query.per_page = per_page;

		const result = await makeBugherdRequest<
			BugherdEndpointOutputs['listActiveProjects']
		>('projects', ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'bugherd.listActiveProjects',
			{ page, per_page },
			'completed',
		);
		return result;
	};

export const listAttachments: BugherdEndpoints['listAttachments'] = async (
	ctx,
	input,
) => {
	const { task_id, page, per_page } = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (page) query.page = page;
	if (per_page) query.per_page = per_page;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['listAttachments']
	>(`tasks/${task_id}/attachments`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'bugherd.listAttachments',
		{ task_id },
		'completed',
	);
	return result;
};

export const listColumns: BugherdEndpoints['listColumns'] = async (
	ctx,
	input,
) => {
	const { project_id } = input;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['listColumns']
	>(`projects/${project_id}/columns`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'bugherd.listColumns',
		{ project_id },
		'completed',
	);
	return result;
};

export const listProjects: BugherdEndpoints['listProjects'] = async (
	ctx,
	input,
) => {
	const { page, per_page } = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (page) query.page = page;
	if (per_page) query.per_page = per_page;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['listProjects']
	>('projects', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'bugherd.listProjects',
		{ page, per_page },
		'completed',
	);
	return result;
};

export const listUsers: BugherdEndpoints['listUsers'] = async (ctx, input) => {
	const { page, per_page } = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (page) query.page = page;
	if (per_page) query.per_page = per_page;

	const result = await makeBugherdRequest<BugherdEndpointOutputs['listUsers']>(
		'users',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'bugherd.listUsers',
		{ page, per_page },
		'completed',
	);
	return result;
};

export const listWebhooks: BugherdEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	const { project_id, page, per_page } = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (page) query.page = page;
	if (per_page) query.per_page = per_page;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['listWebhooks']
	>(`projects/${project_id}/webhooks`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'bugherd.listWebhooks',
		{ project_id },
		'completed',
	);
	return result;
};

export const showAttachment: BugherdEndpoints['showAttachment'] = async (
	ctx,
	input,
) => {
	const { attachment_id } = input;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['showAttachment']
	>(`attachments/${attachment_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'bugherd.showAttachment',
		{ attachment_id },
		'completed',
	);
	return result;
};

export const showColumn: BugherdEndpoints['showColumn'] = async (
	ctx,
	input,
) => {
	const { column_id } = input;

	const result = await makeBugherdRequest<BugherdEndpointOutputs['showColumn']>(
		`columns/${column_id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'bugherd.showColumn',
		{ column_id },
		'completed',
	);
	return result;
};

export const showOrganization: BugherdEndpoints['showOrganization'] = async (
	ctx,
	_input,
) => {
	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['showOrganization']
	>('organization', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'bugherd.showOrganization', {}, 'completed');
	return result;
};

export const showProjectDetails: BugherdEndpoints['showProjectDetails'] =
	async (ctx, input) => {
		const { project_id } = input;

		const result = await makeBugherdRequest<
			BugherdEndpointOutputs['showProjectDetails']
		>(`projects/${project_id}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'bugherd.showProjectDetails',
			{ project_id },
			'completed',
		);
		return result;
	};

export const showUserProjects: BugherdEndpoints['showUserProjects'] = async (
	ctx,
	input,
) => {
	const { user_id, page, per_page } = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (page) query.page = page;
	if (per_page) query.per_page = per_page;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['showUserProjects']
	>(`users/${user_id}/projects`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'bugherd.showUserProjects',
		{ user_id },
		'completed',
	);
	return result;
};

export const showUserTasks: BugherdEndpoints['showUserTasks'] = async (
	ctx,
	input,
) => {
	const { user_id, page, per_page } = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (page) query.page = page;
	if (per_page) query.per_page = per_page;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['showUserTasks']
	>(`users/${user_id}/tasks`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'bugherd.showUserTasks',
		{ user_id },
		'completed',
	);
	return result;
};

export const updateColumn: BugherdEndpoints['updateColumn'] = async (
	ctx,
	input,
) => {
	const { column_id, name, position } = input;
	const body: Record<string, unknown> = {};
	if (name !== undefined) body.name = name;
	if (position !== undefined) body.position = position;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['updateColumn']
	>(`columns/${column_id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'bugherd.updateColumn',
		{ column_id },
		'completed',
	);
	return result;
};

export const updateProject: BugherdEndpoints['updateProject'] = async (
	ctx,
	input,
) => {
	const {
		project_id,
		name,
		is_active,
		is_public,
		description,
		technical_contact_email,
		guest_default_role,
	} = input;
	const body: Record<string, unknown> = {};
	if (name !== undefined) body.name = name;
	if (is_active !== undefined) body.is_active = is_active;
	if (is_public !== undefined) body.is_public = is_public;
	if (description !== undefined) body.description = description;
	if (technical_contact_email !== undefined)
		body.technical_contact_email = technical_contact_email;
	if (guest_default_role !== undefined)
		body.guest_default_role = guest_default_role;

	const result = await makeBugherdRequest<
		BugherdEndpointOutputs['updateProject']
	>(`projects/${project_id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'bugherd.updateProject',
		{ project_id },
		'completed',
	);
	return result;
};

export const updateTask: BugherdEndpoints['updateTask'] = async (
	ctx,
	input,
) => {
	const {
		task_id,
		description,
		priority,
		status,
		tag_list,
		assignee_id,
		reporter_id,
		external_id,
		due_date,
		column_id,
	} = input;
	const body: Record<string, unknown> = {};
	if (description !== undefined) body.description = description;
	if (priority !== undefined) body.priority = priority;
	if (status !== undefined) body.status = status;
	if (tag_list !== undefined) body.tag_list = tag_list;
	if (assignee_id !== undefined) body.assignee_id = assignee_id;
	if (reporter_id !== undefined) body.reporter_id = reporter_id;
	if (external_id !== undefined) body.external_id = external_id;
	if (due_date !== undefined) body.due_date = due_date;
	if (column_id !== undefined) body.column_id = column_id;

	const result = await makeBugherdRequest<BugherdEndpointOutputs['updateTask']>(
		`tasks/${task_id}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'bugherd.updateTask',
		{ task_id },
		'completed',
	);
	return result;
};

export const uploadAttachment: BugherdEndpoints['uploadAttachment'] = async (
	ctx,
	input,
) => {
	const { task_id, file } = input;

	// For file uploads, we need to use FormData
	const formData = new FormData();
	formData.append('file', file);

	const config = {
		BASE: 'https://www.bugherd.com/api_v2',
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit' as const,
		HEADERS: {
			Authorization: `Basic ${Buffer.from(`${ctx.key}:x`).toString('base64')}`,
		},
	};

	const requestOptions = {
		method: 'POST' as const,
		url: `tasks/${task_id}/attachments`,
		body: formData,
		mediaType: 'multipart/form-data',
	};

	const { request } = await import('corsair/http');
	const result = await request<BugherdEndpointOutputs['uploadAttachment']>(
		config,
		requestOptions,
	);

	await logEventFromContext(
		ctx,
		'bugherd.uploadAttachment',
		{ task_id, file_name: file.name },
		'completed',
	);
	return result;
};
