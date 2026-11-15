import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';

export const projects: AhrefsEndpoints['managementProjects'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'managementProjects',
			method: 'GET',
			path: '/management/projects',
			event: 'ahrefs.management.projects',
			logKeys: ['project_id'],
		},
		input,
	);

export const projectKeywords: AhrefsEndpoints['managementProjectKeywords'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'managementProjectKeywords',
			method: 'GET',
			path: '/management/project-keywords',
			event: 'ahrefs.management.projectKeywords',
			logKeys: ['project_id'],
		},
		input,
	);

export const keywordLists: AhrefsEndpoints['managementKeywordLists'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'managementKeywordLists',
			method: 'GET',
			path: '/management/keyword-lists',
			event: 'ahrefs.management.keywordLists',
		},
		input,
	);

export const keywordListKeywords: AhrefsEndpoints['managementKeywordListKeywords'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'managementKeywordListKeywords',
				method: 'GET',
				path: '/management/keyword-list-keywords',
				event: 'ahrefs.management.keywordListKeywords',
				logKeys: ['keyword_list_id'],
			},
			input,
		);

export const locations: AhrefsEndpoints['managementLocations'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'managementLocations',
			method: 'GET',
			path: '/management/locations',
			event: 'ahrefs.management.locations',
		},
		input,
	);

export const createProject: AhrefsEndpoints['managementCreateProject'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'managementCreateProject',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'managementUpdateProject',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'managementDeleteProjects',
			method: 'DELETE',
			path: '/management/projects',
			event: 'ahrefs.management.deleteProjects',
			logKeys: ['project_ids'],
		},
		input,
	);

export const addProjectKeywords: AhrefsEndpoints['managementAddProjectKeywords'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'managementAddProjectKeywords',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementDeleteProjectKeywords',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementAddProjectKeywordTags',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementDeleteProjectKeywordTags',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementProjectCompetitors',
				method: 'GET',
				path: '/management/project-competitors',
				event: 'ahrefs.management.projectCompetitors',
				logKeys: ['project_id'],
			},
			input,
		);

export const addProjectCompetitors: AhrefsEndpoints['managementAddProjectCompetitors'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'managementAddProjectCompetitors',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementDeleteProjectCompetitors',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementCreateKeywordList',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementDeleteKeywordLists',
				method: 'DELETE',
				path: '/management/keyword-lists',
				event: 'ahrefs.management.deleteKeywordLists',
				logKeys: ['keyword_list_ids'],
			},
			input,
		);

export const addKeywordListKeywords: AhrefsEndpoints['managementAddKeywordListKeywords'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'managementAddKeywordListKeywords',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementDeleteKeywordListKeywords',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementBrandRadarReports',
				method: 'GET',
				path: '/management/brand-radar-reports',
				event: 'ahrefs.management.brandRadarReports',
			},
			input,
		);

export const createBrandRadarReport: AhrefsEndpoints['managementCreateBrandRadarReport'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'managementCreateBrandRadarReport',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementUpdateBrandRadarReport',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementBrandRadarPrompts',
				method: 'GET',
				path: '/management/brand-radar-prompts',
				event: 'ahrefs.management.brandRadarPrompts',
				logKeys: ['report_id'],
			},
			input,
		);

export const addBrandRadarPrompts: AhrefsEndpoints['managementAddBrandRadarPrompts'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'managementAddBrandRadarPrompts',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementUpdateBrandRadarPrompts',
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
		callAhrefs(
			ctx,
			{
				endpoint: 'managementDeleteBrandRadarPrompts',
				method: 'PUT',
				path: '/management/brand-radar-prompts-delete',
				event: 'ahrefs.management.deleteBrandRadarPrompts',
				bodyKeys: ['prompts', 'countries'],
				logKeys: ['report_id'],
			},
			input,
		);
