import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';
import type {
	ManagementAddBrandRadarPromptsResponse,
	ManagementAddKeywordListKeywordsResponse,
	ManagementAddProjectCompetitorsResponse,
	ManagementAddProjectKeywordsResponse,
	ManagementAddProjectKeywordTagsResponse,
	ManagementBrandRadarPromptsResponse,
	ManagementBrandRadarReportsResponse,
	ManagementCreateBrandRadarReportResponse,
	ManagementCreateKeywordListResponse,
	ManagementCreateProjectResponse,
	ManagementDeleteBrandRadarPromptsResponse,
	ManagementDeleteKeywordListKeywordsResponse,
	ManagementDeleteKeywordListsResponse,
	ManagementDeleteProjectCompetitorsResponse,
	ManagementDeleteProjectKeywordsResponse,
	ManagementDeleteProjectKeywordTagsResponse,
	ManagementDeleteProjectsResponse,
	ManagementKeywordListKeywordsResponse,
	ManagementKeywordListsResponse,
	ManagementLocationsResponse,
	ManagementProjectCompetitorsResponse,
	ManagementProjectKeywordsResponse,
	ManagementProjectsResponse,
	ManagementUpdateBrandRadarPromptsResponse,
	ManagementUpdateBrandRadarReportResponse,
	ManagementUpdateProjectResponse,
} from './types';

export const projects: AhrefsEndpoints['managementProjects'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<ManagementProjectsResponse>(
		'/management/projects',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.management.projects',
		{ project_id: input.project_id, resultCount: response.projects.length },
		'completed',
	);

	return response;
};

export const projectKeywords: AhrefsEndpoints['managementProjectKeywords'] =
	async (ctx, input) => {
		const response = await makeAhrefsRequest<ManagementProjectKeywordsResponse>(
			'/management/project-keywords',
			ctx.key,
			{
				query: input,
			},
		);

		await logEventFromContext(
			ctx,
			'ahrefs.management.projectKeywords',
			{ project_id: input.project_id, resultCount: response.keywords.length },
			'completed',
		);

		return response;
	};

export const keywordLists: AhrefsEndpoints['managementKeywordLists'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<ManagementKeywordListsResponse>(
		'/management/keyword-lists',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.management.keywordLists',
		{ resultCount: response.keyword_lists.length },
		'completed',
	);

	return response;
};

export const keywordListKeywords: AhrefsEndpoints['managementKeywordListKeywords'] =
	async (ctx, input) => {
		const response =
			await makeAhrefsRequest<ManagementKeywordListKeywordsResponse>(
				'/management/keyword-list-keywords',
				ctx.key,
				{
					query: input,
				},
			);

		await logEventFromContext(
			ctx,
			'ahrefs.management.keywordListKeywords',
			{
				keyword_list_id: input.keyword_list_id,
				resultCount: response.keywords.length,
			},
			'completed',
		);

		return response;
	};

export const locations: AhrefsEndpoints['managementLocations'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<ManagementLocationsResponse>(
		'/management/locations',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.management.locations',
		{},
		'completed',
	);

	return response;
};

export const createProject: AhrefsEndpoints['managementCreateProject'] = (
	ctx,
	input,
) =>
	callAhrefs<ManagementCreateProjectResponse>(
		ctx,
		{
			method: 'POST',
			path: '/management/projects',
			event: 'ahrefs.management.createProject',
			bodyKeys: [
				'access',
				'owned_by',
				'project_name',
				'mode',
				'url',
				'protocol',
				'folder_id',
			],
		},
		input,
	);

export const updateProject: AhrefsEndpoints['managementUpdateProject'] = (
	ctx,
	input,
) =>
	callAhrefs<ManagementUpdateProjectResponse>(
		ctx,
		{
			method: 'PATCH',
			path: '/management/update-project',
			event: 'ahrefs.management.updateProject',
			bodyKeys: ['project_id', 'folder', 'access'],
			logKeys: ['project_id'],
		},
		input,
	);

export const deleteProjects: AhrefsEndpoints['managementDeleteProjects'] = (
	ctx,
	input,
) =>
	callAhrefs<ManagementDeleteProjectsResponse>(
		ctx,
		{
			method: 'DELETE',
			path: '/management/projects',
			event: 'ahrefs.management.deleteProjects',
			logKeys: ['project_ids'],
		},
		input,
	);

export const addProjectKeywords: AhrefsEndpoints['managementAddProjectKeywords'] =
	(ctx, input) =>
		callAhrefs<ManagementAddProjectKeywordsResponse>(
			ctx,
			{
				method: 'PUT',
				path: '/management/project-keywords',
				event: 'ahrefs.management.addProjectKeywords',
				bodyKeys: ['keywords', 'locations'],
				logKeys: ['project_id'],
			},
			input,
		);

export const deleteProjectKeywords: AhrefsEndpoints['managementDeleteProjectKeywords'] =
	(ctx, input) =>
		callAhrefs<ManagementDeleteProjectKeywordsResponse>(
			ctx,
			{
				method: 'PUT',
				path: '/management/project-keywords-delete',
				event: 'ahrefs.management.deleteProjectKeywords',
				bodyKeys: ['keywords'],
				logKeys: ['project_id'],
			},
			input,
		);

export const addProjectKeywordTags: AhrefsEndpoints['managementAddProjectKeywordTags'] =
	(ctx, input) =>
		callAhrefs<ManagementAddProjectKeywordTagsResponse>(
			ctx,
			{
				method: 'PUT',
				path: '/management/project-keywords-tags',
				event: 'ahrefs.management.addProjectKeywordTags',
				bodyKeys: ['project_id', 'keywords', 'tags', 'update_mode', 'output'],
				logKeys: ['project_id'],
			},
			input,
		);

export const deleteProjectKeywordTags: AhrefsEndpoints['managementDeleteProjectKeywordTags'] =
	(ctx, input) =>
		callAhrefs<ManagementDeleteProjectKeywordTagsResponse>(
			ctx,
			{
				method: 'PUT',
				path: '/management/project-keywords-tags-delete',
				event: 'ahrefs.management.deleteProjectKeywordTags',
				bodyKeys: ['project_id', 'keywords', 'tags', 'output'],
				logKeys: ['project_id'],
			},
			input,
		);

export const projectCompetitors: AhrefsEndpoints['managementProjectCompetitors'] =
	(ctx, input) =>
		callAhrefs<ManagementProjectCompetitorsResponse>(
			ctx,
			{
				method: 'GET',
				path: '/management/project-competitors',
				event: 'ahrefs.management.projectCompetitors',
				logKeys: ['project_id'],
			},
			input,
		);

export const addProjectCompetitors: AhrefsEndpoints['managementAddProjectCompetitors'] =
	(ctx, input) =>
		callAhrefs<ManagementAddProjectCompetitorsResponse>(
			ctx,
			{
				method: 'POST',
				path: '/management/project-competitors',
				event: 'ahrefs.management.addProjectCompetitors',
				bodyKeys: ['competitors'],
				logKeys: ['project_id'],
			},
			input,
		);

export const deleteProjectCompetitors: AhrefsEndpoints['managementDeleteProjectCompetitors'] =
	(ctx, input) =>
		callAhrefs<ManagementDeleteProjectCompetitorsResponse>(
			ctx,
			{
				method: 'POST',
				path: '/management/project-competitors-delete',
				event: 'ahrefs.management.deleteProjectCompetitors',
				bodyKeys: ['competitors'],
				logKeys: ['project_id'],
			},
			input,
		);

export const createKeywordList: AhrefsEndpoints['managementCreateKeywordList'] =
	(ctx, input) =>
		callAhrefs<ManagementCreateKeywordListResponse>(
			ctx,
			{
				method: 'POST',
				path: '/management/keyword-lists',
				event: 'ahrefs.management.createKeywordList',
				bodyKeys: [
					'name',
					'location',
					'countries',
					'keywords',
					'access',
					'owned_by',
					'folder_id',
				],
			},
			input,
		);

export const deleteKeywordLists: AhrefsEndpoints['managementDeleteKeywordLists'] =
	(ctx, input) =>
		callAhrefs<ManagementDeleteKeywordListsResponse>(
			ctx,
			{
				method: 'DELETE',
				path: '/management/keyword-lists',
				event: 'ahrefs.management.deleteKeywordLists',
				logKeys: ['keyword_list_ids'],
			},
			input,
		);

export const addKeywordListKeywords: AhrefsEndpoints['managementAddKeywordListKeywords'] =
	(ctx, input) =>
		callAhrefs<ManagementAddKeywordListKeywordsResponse>(
			ctx,
			{
				method: 'PUT',
				path: '/management/keyword-list-keywords',
				event: 'ahrefs.management.addKeywordListKeywords',
				bodyKeys: ['keywords'],
				logKeys: ['keyword_list_id'],
			},
			input,
		);

export const deleteKeywordListKeywords: AhrefsEndpoints['managementDeleteKeywordListKeywords'] =
	(ctx, input) =>
		callAhrefs<ManagementDeleteKeywordListKeywordsResponse>(
			ctx,
			{
				method: 'PUT',
				path: '/management/keyword-list-keywords-delete',
				event: 'ahrefs.management.deleteKeywordListKeywords',
				bodyKeys: ['keywords'],
				logKeys: ['keyword_list_id'],
			},
			input,
		);

export const brandRadarReports: AhrefsEndpoints['managementBrandRadarReports'] =
	(ctx, input) =>
		callAhrefs<ManagementBrandRadarReportsResponse>(
			ctx,
			{
				method: 'GET',
				path: '/management/brand-radar-reports',
				event: 'ahrefs.management.brandRadarReports',
			},
			input,
		);

export const createBrandRadarReport: AhrefsEndpoints['managementCreateBrandRadarReport'] =
	(ctx, input) =>
		callAhrefs<ManagementCreateBrandRadarReportResponse>(
			ctx,
			{
				method: 'POST',
				path: '/management/brand-radar-reports',
				event: 'ahrefs.management.createBrandRadarReport',
				bodyKeys: [
					'brand',
					'competitors',
					'name',
					'project_id',
					'country',
					'where',
					'content_filter',
					'prompts_frequency',
				],
				logKeys: ['project_id', 'country'],
			},
			input,
		);

export const updateBrandRadarReport: AhrefsEndpoints['managementUpdateBrandRadarReport'] =
	(ctx, input) =>
		callAhrefs<ManagementUpdateBrandRadarReportResponse>(
			ctx,
			{
				method: 'PATCH',
				path: '/management/brand-radar-reports',
				event: 'ahrefs.management.updateBrandRadarReport',
				bodyKeys: [
					'report_id',
					'brand',
					'competitors',
					'country',
					'where',
					'content_filter',
					'prompts_frequency',
				],
				logKeys: ['report_id', 'country'],
			},
			input,
		);

export const brandRadarPrompts: AhrefsEndpoints['managementBrandRadarPrompts'] =
	(ctx, input) =>
		callAhrefs<ManagementBrandRadarPromptsResponse>(
			ctx,
			{
				method: 'GET',
				path: '/management/brand-radar-prompts',
				event: 'ahrefs.management.brandRadarPrompts',
				logKeys: ['report_id'],
			},
			input,
		);

export const addBrandRadarPrompts: AhrefsEndpoints['managementAddBrandRadarPrompts'] =
	(ctx, input) =>
		callAhrefs<ManagementAddBrandRadarPromptsResponse>(
			ctx,
			{
				method: 'POST',
				path: '/management/brand-radar-prompts',
				event: 'ahrefs.management.addBrandRadarPrompts',
				bodyKeys: ['prompts', 'countries', 'tags'],
				logKeys: ['report_id'],
			},
			input,
		);

export const updateBrandRadarPrompts: AhrefsEndpoints['managementUpdateBrandRadarPrompts'] =
	(ctx, input) =>
		callAhrefs<ManagementUpdateBrandRadarPromptsResponse>(
			ctx,
			{
				method: 'PATCH',
				path: '/management/brand-radar-prompts',
				event: 'ahrefs.management.updateBrandRadarPrompts',
				bodyKeys: ['prompts', 'countries', 'tags'],
				logKeys: ['report_id'],
			},
			input,
		);

export const deleteBrandRadarPrompts: AhrefsEndpoints['managementDeleteBrandRadarPrompts'] =
	(ctx, input) =>
		callAhrefs<ManagementDeleteBrandRadarPromptsResponse>(
			ctx,
			{
				method: 'PUT',
				path: '/management/brand-radar-prompts-delete',
				event: 'ahrefs.management.deleteBrandRadarPrompts',
				bodyKeys: ['prompts', 'countries'],
				logKeys: ['report_id'],
			},
			input,
		);
