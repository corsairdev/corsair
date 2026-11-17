import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { compactQuery, makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

/** List all viewable projects, sorted by most recently created first. */
export const projectsList: HexEndpoints['projectsList'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.projectsList.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['projectsList']>(
		`/v1/projects`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				includeArchived: parsedInput.includeArchived,
				includeComponents: parsedInput.includeComponents,
				includeTrashed: parsedInput.includeTrashed,
				includeUnlisted: parsedInput.includeUnlisted,
				includeSharing: parsedInput.includeSharing,
				statuses: parsedInput.statuses,
				categories: parsedInput.categories,
				creatorEmail: parsedInput.creatorEmail,
				ownerEmail: parsedInput.ownerEmail,
				collectionId: parsedInput.collectionId,
				limit: parsedInput.limit,
				after: parsedInput.after,
				before: parsedInput.before,
				sortBy: parsedInput.sortBy,
				sortDirection: parsedInput.sortDirection,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.projectsList.parse(response);
	await logEventFromContext(
		ctx,
		'hex.projects.list',
		{ operation: 'projects.list' },
		'completed',
	);
	return parsed;
};

/** Create a new project in the workspace with the specified title, and optionally a description. */
export const projectsCreate: HexEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.projectsCreate.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['projectsCreate']>(
		`/v1/projects`,
		ctx.key,
		{
			method: 'POST',
			body: {
				title: parsedInput.title,
				description: parsedInput.description,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.projectsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'hex.projects.create',
		{ operation: 'projects.create' },
		'completed',
	);
	return parsed;
};

/** Get metadata about a single project. */
export const projectsGet: HexEndpoints['projectsGet'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.projectsGet.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['projectsGet']>(
		`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				includeSharing: parsedInput.includeSharing,
				includeUnlisted: parsedInput.includeUnlisted,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.projectsGet.parse(response);
	await logEventFromContext(
		ctx,
		'hex.projects.get',
		{ operation: 'projects.get' },
		'completed',
	);
	return parsed;
};

/** Add or remove a status, including endorsements, from a project. */
export const projectsUpdate: HexEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.projectsUpdate.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['projectsUpdate']>(
		`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				status: parsedInput.status,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.projectsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'hex.projects.update',
		{ operation: 'projects.update' },
		'completed',
	);
	return parsed;
};

/** Given a project ID, return the list of warehouse tables queried in the project. */
export const projectsGetQueriedTables: HexEndpoints['projectsGetQueriedTables'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.projectsGetQueriedTables.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['projectsGetQueriedTables']
		>(
			`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}/queriedTables`,
			ctx.key,
			{
				method: 'GET',
				query: compactQuery({
					limit: parsedInput.limit,
					after: parsedInput.after,
					before: parsedInput.before,
				}),
			},
		);
		const parsed =
			HexEndpointOutputSchemas.projectsGetQueriedTables.parse(response);
		await logEventFromContext(
			ctx,
			'hex.projects.getQueriedTables',
			{ operation: 'projects.getQueriedTables' },
			'completed',
		);
		return parsed;
	};

/** Add a project to collections or remove it from collections. */
export const projectsEditSharingCollections: HexEndpoints['projectsEditSharingCollections'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.projectsEditSharingCollections.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['projectsEditSharingCollections']
		>(
			`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}/sharing/collections`,
			ctx.key,
			{
				method: 'PATCH',
				body: {
					sharing: parsedInput.sharing,
				},
			},
		);
		const parsed =
			HexEndpointOutputSchemas.projectsEditSharingCollections.parse(response);
		await logEventFromContext(
			ctx,
			'hex.projects.editSharingCollections',
			{ operation: 'projects.editSharingCollections' },
			'completed',
		);
		return parsed;
	};

/** Add groups to a project or update/remove their project sharing access. Use CAN_VIEW for the UI permission labeled "Can explore" and APP_ONLY for "Can view app". Use NONE to remove a group's access. */
export const projectsEditSharingGroups: HexEndpoints['projectsEditSharingGroups'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.projectsEditSharingGroups.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['projectsEditSharingGroups']
		>(
			`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}/sharing/groups`,
			ctx.key,
			{
				method: 'PATCH',
				body: {
					sharing: parsedInput.sharing,
				},
			},
		);
		const parsed =
			HexEndpointOutputSchemas.projectsEditSharingGroups.parse(response);
		await logEventFromContext(
			ctx,
			'hex.projects.editSharingGroups',
			{ operation: 'projects.editSharingGroups' },
			'completed',
		);
		return parsed;
	};

/** Add users to a project or update/remove their project sharing access. Use CAN_VIEW for the UI permission labeled "Can explore" and APP_ONLY for "Can view app". Use NONE to remove a user's access. */
export const projectsEditSharingUsers: HexEndpoints['projectsEditSharingUsers'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.projectsEditSharingUsers.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['projectsEditSharingUsers']
		>(
			`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}/sharing/users`,
			ctx.key,
			{
				method: 'PATCH',
				body: {
					sharing: parsedInput.sharing,
					includeUnlisted: parsedInput.includeUnlisted,
				},
			},
		);
		const parsed =
			HexEndpointOutputSchemas.projectsEditSharingUsers.parse(response);
		await logEventFromContext(
			ctx,
			'hex.projects.editSharingUsers',
			{ operation: 'projects.editSharingUsers' },
			'completed',
		);
		return parsed;
	};

/** Update workspace or public-web sharing for a project. For projects, use CAN_VIEW to grant the UI permission labeled "Can explore" and APP_ONLY for "Can view app". Use NONE to remove access. Omitted fields are left unchanged. */
export const projectsEditSharingOrgAndPublic: HexEndpoints['projectsEditSharingOrgAndPublic'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.projectsEditSharingOrgAndPublic.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['projectsEditSharingOrgAndPublic']
		>(
			`/v1/projects/${encodeURIComponent(String(parsedInput.projectId))}/sharing/workspaceAndPublic`,
			ctx.key,
			{
				method: 'PATCH',
				body: {
					sharing: parsedInput.sharing,
				},
			},
		);
		const parsed =
			HexEndpointOutputSchemas.projectsEditSharingOrgAndPublic.parse(response);
		await logEventFromContext(
			ctx,
			'hex.projects.editSharingOrgAndPublic',
			{ operation: 'projects.editSharingOrgAndPublic' },
			'completed',
		);
		return parsed;
	};

/** Update the compute profile (kernel image and/or kernel size) on one or more projects in a single request. At least one of kernelImage or kernelSize must be provided; the change applies to both the logic and published compute profiles. The caller must have edit permission on every project in the batch — a single failure rejects the whole batch (no partial updates). Cross-org project IDs are silently dropped. Batch size is capped at 250 IDs per request; larger batches should be paged. */
export const projectsBatchUpdateComputeProfile: HexEndpoints['projectsBatchUpdateComputeProfile'] =
	async (ctx, input) => {
		const parsedInput =
			HexEndpointInputSchemas.projectsBatchUpdateComputeProfile.parse(input);
		const response = await makeHexRequest<
			HexEndpointOutputs['projectsBatchUpdateComputeProfile']
		>(`/v1/projects/compute-profile/batch`, ctx.key, {
			method: 'POST',
			body: {
				projectIds: parsedInput.projectIds,
				kernelImage: parsedInput.kernelImage,
				kernelSize: parsedInput.kernelSize,
			},
		});
		const parsed =
			HexEndpointOutputSchemas.projectsBatchUpdateComputeProfile.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'hex.projects.batchUpdateComputeProfile',
			{ operation: 'projects.batchUpdateComputeProfile' },
			'completed',
		);
		return parsed;
	};

/** Exports a Hex project in the *.hex.yaml format. */
export const projectsExport: HexEndpoints['projectsExport'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.projectsExport.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['projectsExport']>(
		`/v1/projects/export`,
		ctx.key,
		{
			method: 'POST',
			body: {
				projectId: parsedInput.projectId,
				version: parsedInput.version,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.projectsExport.parse(response);
	await logEventFromContext(
		ctx,
		'hex.projects.export',
		{ operation: 'projects.export' },
		'completed',
	);
	return parsed;
};
