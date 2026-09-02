import { makeAppVeyorRequest, makeAppVeyorTextRequest } from '../client';
import type { AppVeyorEndpoint } from '../index';
import { EndpointInputSchemas, EndpointOutputSchemas } from './types';

export const deleteBuild: AppVeyorEndpoint<'buildsDelete'> = async (
	ctx,
	input,
) => {
	await makeAppVeyorRequest(`/builds/${input.buildId}`, ctx.key, {
		method: 'DELETE',
	});
	return { success: true };
};

export const downloadBuildLog: AppVeyorEndpoint<'buildsDownloadLog'> = async (
	ctx,
	input,
) =>
	EndpointOutputSchemas.buildsDownloadLog.parse(
		await makeAppVeyorTextRequest(`/buildjobs/${input.jobId}/log`, ctx.key),
	);

export const getBuildArtifacts: AppVeyorEndpoint<'buildsGetArtifacts'> = async (
	ctx,
	input,
) =>
	EndpointOutputSchemas.buildsGetArtifacts.parse(
		await makeAppVeyorRequest(`/buildjobs/${input.jobId}/artifacts`, ctx.key),
	);

export const getBuildByVersion: AppVeyorEndpoint<'buildsGetByVersion'> = async (
	ctx,
	input,
) =>
	EndpointOutputSchemas.buildsGetByVersion.parse(
		await makeAppVeyorRequest(
			`/projects/${input.accountName}/${input.projectSlug}/build/${input.buildVersion}`,
			ctx.key,
		),
	);

export const listEnvironments: AppVeyorEndpoint<'environmentsList'> = async (
	ctx,
) =>
	EndpointOutputSchemas.environmentsList.parse(
		await makeAppVeyorRequest('/environments', ctx.key),
	);

export const getProjectBranchBadge: AppVeyorEndpoint<
	'projectsGetBranchBadge'
> = async (ctx, input) =>
	makeAppVeyorTextRequest(
		`/projects/status/${input.token}/branch/${encodeURIComponent(input.branch)}`,
		ctx.key,
	);

export const getProjectBadge: AppVeyorEndpoint<'projectsGetBadge'> = async (
	ctx,
	input,
) => makeAppVeyorTextRequest(`/projects/status/${input.token}`, ctx.key);

export const listProjects: AppVeyorEndpoint<'projectsList'> = async (ctx) =>
	EndpointOutputSchemas.projectsList.parse(
		await makeAppVeyorRequest('/projects', ctx.key),
	);

export const getPublicProjectBadge: AppVeyorEndpoint<
	'projectsGetPublicBadge'
> = async (ctx, input) =>
	makeAppVeyorTextRequest(
		`/projects/status/${input.repositoryProvider}/${encodeURIComponent(input.repositoryAccountName)}/${encodeURIComponent(input.repositorySlug)}`,
		ctx.key,
	);

export const getRole: AppVeyorEndpoint<'rolesGet'> = async (ctx, input) =>
	EndpointOutputSchemas.rolesGet.parse(
		await makeAppVeyorRequest(`/roles/${input.roleId}`, ctx.key),
	);

export const listRoles: AppVeyorEndpoint<'rolesList'> = async (ctx) =>
	EndpointOutputSchemas.rolesList.parse(
		await makeAppVeyorRequest('/roles', ctx.key),
	);

export const listUserInvitations: AppVeyorEndpoint<
	'usersInvitationsList'
> = async (ctx) =>
	EndpointOutputSchemas.usersInvitationsList.parse(
		await makeAppVeyorRequest('/users/invitations', ctx.key),
	);

export const listUsers: AppVeyorEndpoint<'usersList'> = async (ctx) =>
	EndpointOutputSchemas.usersList.parse(
		await makeAppVeyorRequest('/users', ctx.key),
	);

export const listCollaborators: AppVeyorEndpoint<'collaboratorsList'> = async (
	ctx,
) =>
	EndpointOutputSchemas.collaboratorsList.parse(
		await makeAppVeyorRequest('/collaborators', ctx.key),
	);

export const endpointInputSchemas = EndpointInputSchemas;
