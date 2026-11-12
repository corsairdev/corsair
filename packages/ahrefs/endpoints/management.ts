import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import type {
	ManagementKeywordListKeywordsResponse,
	ManagementKeywordListsResponse,
	ManagementLocationsResponse,
	ManagementProjectKeywordsResponse,
	ManagementProjectsResponse,
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
