import { logEventFromContext } from 'corsair/core';
import {
	compactQuery,
	encodeAmaraPathSegment,
	makeAmaraRequest,
} from '../client';
import type { AmaraEndpoints } from '../index';
import {
	EmptyOkSchema,
	TeamApplicationListResponseSchema,
	TeamLanguagesSchema,
	TeamListResponseSchema,
	TeamMemberListResponseSchema,
	TeamMemberSchema,
	TeamProjectListResponseSchema,
	TeamProjectSchema,
	TeamSchema,
	TeamTaskListResponseSchema,
	TeamTaskSchema,
} from './types';

export const list: AmaraEndpoints['teamsList'] = async (ctx, input) => {
	const raw = await makeAmaraRequest('teams/', ctx.key, {
		query: compactQuery({
			limit: input.limit,
			offset: input.offset,
		}),
	});
	const response = TeamListResponseSchema.parse(raw);
	await logEventFromContext(ctx, 'amara.teams.list', {}, 'completed');
	return response;
};

export const getDetails: AmaraEndpoints['teamsGetDetails'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.slug)}/`,
		ctx.key,
	);
	const response = TeamSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.getDetails',
		{ slug: input.slug },
		'completed',
	);
	return response;
};

export const getLanguages: AmaraEndpoints['teamsGetLanguages'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.slug)}/languages/`,
		ctx.key,
	);
	const response = TeamLanguagesSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.getLanguages',
		{ slug: input.slug },
		'completed',
	);
	return response;
};

// ─────────────────────────────────────────────────────────────────────────────
// Team Projects
// ─────────────────────────────────────────────────────────────────────────────

export const listProjects: AmaraEndpoints['teamsListProjects'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/projects/`,
		ctx.key,
		{
			query: compactQuery({
				limit: input.limit,
				offset: input.offset,
			}),
		},
	);
	const response = TeamProjectListResponseSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.listProjects',
		{ team_slug: input.team_slug },
		'completed',
	);
	return response;
};

export const getProject: AmaraEndpoints['teamsGetProject'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/projects/${encodeAmaraPathSegment(input.project_slug)}/`,
		ctx.key,
	);
	const response = TeamProjectSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.getProject',
		{ team_slug: input.team_slug, project_slug: input.project_slug },
		'completed',
	);
	return response;
};

export const createProject: AmaraEndpoints['teamsCreateProject'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/projects/`,
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				slug: input.slug,
				...(input.description ? { description: input.description } : {}),
				...(input.guidelines ? { guidelines: input.guidelines } : {}),
			},
		},
	);
	const response = TeamProjectSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.createProject',
		{ team_slug: input.team_slug, slug: input.slug },
		'completed',
	);
	return response;
};

export const updateProject: AmaraEndpoints['teamsUpdateProject'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/projects/${encodeAmaraPathSegment(input.project_slug)}/`,
		ctx.key,
		{
			method: 'PUT',
			body: {
				...(input.name ? { name: input.name } : {}),
				...(input.description ? { description: input.description } : {}),
				...(input.guidelines ? { guidelines: input.guidelines } : {}),
			},
		},
	);
	const response = TeamProjectSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.updateProject',
		{ team_slug: input.team_slug, project_slug: input.project_slug },
		'completed',
	);
	return response;
};

export const deleteProject: AmaraEndpoints['teamsDeleteProject'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/projects/${encodeAmaraPathSegment(input.project_slug)}/`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = EmptyOkSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.deleteProject',
		{ team_slug: input.team_slug, project_slug: input.project_slug },
		'completed',
	);
	return response;
};

// ─────────────────────────────────────────────────────────────────────────────
// Team Members
// ─────────────────────────────────────────────────────────────────────────────

export const listMembers: AmaraEndpoints['teamsListMembers'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/members/`,
		ctx.key,
		{
			query: compactQuery({
				limit: input.limit,
				offset: input.offset,
			}),
		},
	);
	const response = TeamMemberListResponseSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.listMembers',
		{ team_slug: input.team_slug },
		'completed',
	);
	return response;
};

export const getMember: AmaraEndpoints['teamsGetMember'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/members/${encodeAmaraPathSegment(input.username)}/`,
		ctx.key,
	);
	const response = TeamMemberSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.getMember',
		{ team_slug: input.team_slug, username: input.username },
		'completed',
	);
	return response;
};

export const addMember: AmaraEndpoints['teamsAddMember'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/members/`,
		ctx.key,
		{
			method: 'POST',
			body: {
				user: input.user,
				...(input.role ? { role: input.role } : {}),
			},
		},
	);
	const response = TeamMemberSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.addMember',
		{ team_slug: input.team_slug, user: input.user },
		'completed',
	);
	return response;
};

export const updateMember: AmaraEndpoints['teamsUpdateMember'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/members/${encodeAmaraPathSegment(input.username)}/`,
		ctx.key,
		{
			method: 'PUT',
			body: {
				role: input.role,
			},
		},
	);
	const response = TeamMemberSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.updateMember',
		{ team_slug: input.team_slug, username: input.username },
		'completed',
	);
	return response;
};

export const removeMember: AmaraEndpoints['teamsRemoveMember'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/members/${encodeAmaraPathSegment(input.username)}/`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = EmptyOkSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.removeMember',
		{ team_slug: input.team_slug, username: input.username },
		'completed',
	);
	return response;
};

// ─────────────────────────────────────────────────────────────────────────────
// Team Tasks
// ─────────────────────────────────────────────────────────────────────────────

export const listTasks: AmaraEndpoints['teamsListTasks'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/tasks/`,
		ctx.key,
		{
			query: compactQuery({
				limit: input.limit,
				offset: input.offset,
				assignee: input.assignee,
				priority: input.priority,
				type: input.type,
				video_id: input.video_id,
				completed: input.completed,
				open: input.open,
				order_by: input.order_by,
			}),
		},
	);
	const response = TeamTaskListResponseSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.listTasks',
		{ team_slug: input.team_slug },
		'completed',
	);
	return response;
};

export const getTask: AmaraEndpoints['teamsGetTask'] = async (ctx, input) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/tasks/${encodeAmaraPathSegment(String(input.task_id))}/`,
		ctx.key,
	);
	const response = TeamTaskSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.getTask',
		{ team_slug: input.team_slug, task_id: input.task_id },
		'completed',
	);
	return response;
};

// ─────────────────────────────────────────────────────────────────────────────
// Team Applications
// ─────────────────────────────────────────────────────────────────────────────

export const listApplications: AmaraEndpoints['teamsListApplications'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.team_slug)}/applications/`,
		ctx.key,
		{
			query: compactQuery({
				limit: input.limit,
				offset: input.offset,
				status: input.status,
				user: input.user,
			}),
		},
	);
	const response = TeamApplicationListResponseSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.listApplications',
		{ team_slug: input.team_slug },
		'completed',
	);
	return response;
};
