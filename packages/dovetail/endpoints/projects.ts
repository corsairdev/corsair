import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const create: DovetailEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		title: input.title,
	};
	if (input.folder_id !== undefined) body.folder_id = input.folder_id;
	if (input.template_id !== undefined) body.template_id = input.template_id;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['projectsCreate']
	>('/v1/projects', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.projects.create',
		{ id: result.data.id, title: result.data.title },
		'completed',
	);
	return result;
};

export const get: DovetailEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['projectsGet']
	>(`/v1/projects/${encodeURIComponent(input.project_id)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'dovetail.projects.get',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const list: DovetailEndpoints['projectsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page?.limit !== undefined) query['page[limit]'] = input.page.limit;
	if (input.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = input.page.start_cursor;
	if (input.filter?.folder_id !== undefined)
		query['filter[folder_id]'] = input.filter.folder_id;
	if (input.filter?.title !== undefined)
		query['filter[title]'] = input.filter.title;
	if (input.sort !== undefined) query.sort = input.sort;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['projectsList']
	>('/v1/projects', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'dovetail.projects.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};
