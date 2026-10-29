import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const create: DovetailEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.projectsCreate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		title: parsed.title,
	};
	if (parsed.folder_id !== undefined) body.folder_id = parsed.folder_id;
	if (parsed.template_id !== undefined) body.template_id = parsed.template_id;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['projectsCreate']
	>('/v1/projects', ctx.key, {
		method: 'POST',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.projectsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.projects.create',
		{ id: validated.data.id, title: validated.data.title },
		'completed',
	);
	return validated;
};

export const get: DovetailEndpoints['projectsGet'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.projectsGet.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['projectsGet']
	>(`/v1/projects/${encodeURIComponent(parsed.project_id)}`, ctx.key, {
		method: 'GET',
	});
	const validated = DovetailEndpointOutputSchemas.projectsGet.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.projects.get',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const list: DovetailEndpoints['projectsList'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.projectsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.page?.limit !== undefined)
		query['page[limit]'] = parsed.page.limit;
	if (parsed.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = parsed.page.start_cursor;
	if (parsed.filter?.folder_id !== undefined)
		query['filter[folder_id]'] = parsed.filter.folder_id;
	if (parsed.filter?.title !== undefined)
		query['filter[title]'] = parsed.filter.title;
	if (parsed.sort !== undefined) query.sort = parsed.sort;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['projectsList']
	>('/v1/projects', ctx.key, {
		method: 'GET',
		query,
	});
	const validated = DovetailEndpointOutputSchemas.projectsList.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.projects.list',
		{ count: validated.data.length },
		'completed',
	);
	return validated;
};
