import { makeAppVeyorRequest, makeAppVeyorTextRequest } from '../client';
import type { AppVeyorEndpoint } from '../index';
import { EndpointInputSchemas, EndpointOutputSchemas } from './types';

export const deleteBuild: AppVeyorEndpoint<'buildsDelete'> = async (
	ctx,
	input,
) => {
	const parsed = EndpointInputSchemas.buildsDelete.parse(input);
	await makeAppVeyorRequest(`/builds/${parsed.buildId}`, ctx.key, {
		method: 'DELETE',
	});
	return { success: true };
};

export const downloadBuildLog: AppVeyorEndpoint<'buildsDownloadLog'> = async (
	ctx,
	input,
) => {
	const parsed = EndpointInputSchemas.buildsDownloadLog.parse(input);
	return EndpointOutputSchemas.buildsDownloadLog.parse(
		await makeAppVeyorTextRequest(`/buildjobs/${parsed.jobId}/log`, ctx.key),
	);
};

export const getBuildArtifacts: AppVeyorEndpoint<'buildsGetArtifacts'> = async (
	ctx,
	input,
) => {
	const parsed = EndpointInputSchemas.buildsGetArtifacts.parse(input);
	return EndpointOutputSchemas.buildsGetArtifacts.parse(
		await makeAppVeyorRequest(`/buildjobs/${parsed.jobId}/artifacts`, ctx.key),
	);
};

export const getBuildByVersion: AppVeyorEndpoint<'buildsGetByVersion'> = async (
	ctx,
	input,
) => {
	const parsed = EndpointInputSchemas.buildsGetByVersion.parse(input);
	return EndpointOutputSchemas.buildsGetByVersion.parse(
		await makeAppVeyorRequest(
			`/projects/${parsed.accountName}/${parsed.projectSlug}/build/${parsed.buildVersion}`,
			ctx.key,
		),
	);
};

export const listEnvironments: AppVeyorEndpoint<'environmentsList'> = async (
	ctx,
) =>
	EndpointOutputSchemas.environmentsList.parse(
		await makeAppVeyorRequest('/environments', ctx.key),
	);

export const getProjectBranchBadge: AppVeyorEndpoint<
	'projectsGetBranchBadge'
> = async (ctx, input) => {
	const parsed = EndpointInputSchemas.projectsGetBranchBadge.parse(input);
	return makeAppVeyorTextRequest(
		`/projects/status/${parsed.token}/branch/${encodeURIComponent(parsed.branch)}`,
		ctx.key,
	);
};

export const getProjectBadge: AppVeyorEndpoint<'projectsGetBadge'> = async (
	ctx,
	input,
) => {
	const parsed = EndpointInputSchemas.projectsGetBadge.parse(input);
	return makeAppVeyorTextRequest(`/projects/status/${parsed.token}`, ctx.key);
};

export const listProjects: AppVeyorEndpoint<'projectsList'> = async (ctx) =>
	EndpointOutputSchemas.projectsList.parse(
		await makeAppVeyorRequest('/projects', ctx.key),
	);

export const getPublicProjectBadge: AppVeyorEndpoint<
	'projectsGetPublicBadge'
> = async (ctx, input) => {
	const parsed = EndpointInputSchemas.projectsGetPublicBadge.parse(input);
	return makeAppVeyorTextRequest(
		`/projects/status/${parsed.repositoryProvider}/${encodeURIComponent(parsed.repositoryAccountName)}/${encodeURIComponent(parsed.repositorySlug)}`,
		ctx.key,
	);
};

export const getRole: AppVeyorEndpoint<'rolesGet'> = async (ctx, input) => {
	const parsed = EndpointInputSchemas.rolesGet.parse(input);
	return EndpointOutputSchemas.rolesGet.parse(
		await makeAppVeyorRequest(`/roles/${parsed.roleId}`, ctx.key),
	);
};

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
