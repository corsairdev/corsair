import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const list: BannerbearEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listTemplates']
	>('/v5/templates', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
			project_id: input.project_id,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.templates.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BannerbearEndpoints['getTemplate'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getTemplate']
	>(`/v5/templates/${input.uid}`, ctx.key, {
		method: 'GET',
		query: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.templates.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: BannerbearEndpoints['createTemplate'] = async (
	ctx,
	input,
) => {
	const { project_id, ...body } = input;
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['createTemplate']
	>('/v5/templates', ctx.key, {
		method: 'POST',
		body: { ...body, project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.templates.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteTemplate: BannerbearEndpoints['deleteTemplate'] = async (
	ctx,
	input,
) => {
	await makeBannerbearRequest<void>(`/v5/templates/${input.uid}`, ctx.key, {
		method: 'DELETE',
		query: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.templates.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const importTemplate: BannerbearEndpoints['importTemplate'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['importTemplate']
	>('/v5/templates/import', ctx.key, {
		method: 'POST',
		body: {
			publication_id: input.publication_id,
			project_id: input.project_id,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.templates.import',
		{ ...input },
		'completed',
	);
	return response;
};
