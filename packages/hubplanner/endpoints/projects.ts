import { logEventFromContext } from 'corsair/core';
import type { HubPlannerEndpoints } from '..';
import { makeHubPlannerRequest } from '../client';
import type { Project, Tag } from './types';
import {
	HubPlannerEndpointInputSchemas,
	HubPlannerEndpointOutputSchemas,
} from './types';

export const Projects = {
	list: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.list'].parse(input);
		const response = await makeHubPlannerRequest<Project[]>(
			'/project',
			ctx.key,
			{
				method: 'GET',
				query: {
					page: parsedInput.page,
					limit: parsedInput.limit,
					sort: parsedInput.sort,
				},
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.list'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.list'],

	get: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.get'].parse(input);
		const response = await makeHubPlannerRequest<Project>(
			`/project/${encodeURIComponent(parsedInput.projectId)}`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.get'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.get',
			{ projectId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.get'],

	create: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.create'].parse(input);
		const response = await makeHubPlannerRequest<Project>('/project', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.create'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.create',
			{ projectId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.create'],

	update: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.update'].parse(input);
		const response = await makeHubPlannerRequest<Project[]>(
			'/project',
			ctx.key,
			{
				method: 'PATCH',
				body: parsedInput.projects,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.update'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.update',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.update'],

	delete: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.delete'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>(
			`/project/${encodeURIComponent(parsedInput.projectId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.delete'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.delete',
			{ projectId: parsedInput.projectId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.delete'],

	deleteBulk: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.deleteBulk'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>('/project', ctx.key, {
			method: 'DELETE',
			body: parsedInput.projectIds,
		});
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.deleteBulk'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.deleteBulk',
			{ count: parsedInput.projectIds.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.deleteBulk'],

	search: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.search'].parse(input);
		const response = await makeHubPlannerRequest<Project[]>(
			'/project/search',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput.query ?? {},
				query: {
					page: parsedInput.page,
					limit: parsedInput.limit,
					sort: parsedInput.sort,
				},
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.search'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.search',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.search'],

	addResources: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.addResources'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>(
			`/project/addResourcesToProject/${encodeURIComponent(parsedInput.projectId)}`,
			ctx.key,
			{
				method: 'POST',
				body: { resourceIds: parsedInput.resourceIds },
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.addResources'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.addResources',
			{ projectId: parsedInput.projectId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.addResources'],

	removeResource: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.removeResource'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>(
			`/project/removeResourceFromProjects/${encodeURIComponent(parsedInput.resourceId)}`,
			ctx.key,
			{
				method: 'POST',
				body: { projectIds: parsedInput.projectIds },
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.removeResource'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.removeResource',
			{ resourceId: parsedInput.resourceId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.removeResource'],

	addClients: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.addClients'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>(
			`/project/${encodeURIComponent(parsedInput.projectId)}/client`,
			ctx.key,
			{
				method: 'POST',
				body: { clientIds: parsedInput.clientIds },
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.addClients'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.addClients',
			{ projectId: parsedInput.projectId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.addClients'],

	removeClient: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.removeClient'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>(
			`/project/client/${encodeURIComponent(parsedInput.clientId)}`,
			ctx.key,
			{
				method: 'POST',
				body: { projectIds: parsedInput.projectIds },
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.removeClient'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.removeClient',
			{ clientId: parsedInput.clientId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.removeClient'],

	setProjectManagers: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.setProjectManagers'].parse(
				input,
			);
		const response = await makeHubPlannerRequest<Project>(
			`/project/${encodeURIComponent(parsedInput.projectId)}/project-managers`,
			ctx.key,
			{
				method: 'PUT',
				body: parsedInput.managerIds,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.setProjectManagers'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.setProjectManagers',
			{ projectId: parsedInput.projectId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.setProjectManagers'],

	getTags: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.getTags'].parse(input);
		const response = await makeHubPlannerRequest<Tag[]>(
			`/project/${encodeURIComponent(parsedInput.projectId)}/tag`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.getTags'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.getTags',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.getTags'],

	addTags: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.addTags'].parse(input);
		const response = await makeHubPlannerRequest<Project>(
			`/project/${encodeURIComponent(parsedInput.projectId)}/tag`,
			ctx.key,
			{
				method: 'PATCH',
				body: { tags: parsedInput.tags },
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.addTags'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.addTags',
			{ projectId: parsedInput.projectId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.addTags'],

	removeTag: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['projects.removeTag'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>(
			`/project/${encodeURIComponent(parsedInput.projectId)}/tag/${encodeURIComponent(parsedInput.tagId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['projects.removeTag'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.projects.removeTag',
			{ tagId: parsedInput.tagId },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['projects.removeTag'],
};
