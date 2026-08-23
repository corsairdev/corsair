import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const list: BannerbearEndpoints['listTemplateSets'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listTemplateSets']
	>('/v5/template_sets', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
			project_id: input.project_id,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.template_sets.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BannerbearEndpoints['getTemplateSet'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getTemplateSet']
	>(`/v5/template_sets/${input.uid}`, ctx.key, {
		method: 'GET',
		query: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.template_sets.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: BannerbearEndpoints['createTemplateSet'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['createTemplateSet']
	>('/v5/template_sets', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			templates: input.templates,
			project_id: input.project_id,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.template_sets.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: BannerbearEndpoints['updateTemplateSet'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['updateTemplateSet']
	>(`/v5/template_sets/${input.uid}`, ctx.key, {
		method: 'PATCH',
		body: { templates: input.templates, project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.template_sets.update',
		{ ...input },
		'completed',
	);
	return response;
};
