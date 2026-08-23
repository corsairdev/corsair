import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { encodeBannerbearUid, makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const list: BannerbearEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listTemplates']
	>('/v5/image_templates', ctx.key, {
		method: 'GET',
		query: { page: input.page },
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
	>(`/v5/image_templates/${encodeBannerbearUid(input.uid)}`, ctx.key, {
		method: 'GET',
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
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['createTemplate']
	>('/v5/image_templates', ctx.key, {
		method: 'POST',
		body: { ...input },
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
	await makeBannerbearRequest<void>(
		`/v5/image_templates/${encodeBannerbearUid(input.uid)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
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
	>(
		`/v5/publications/${encodeBannerbearUid(input.publication_id)}/install`,
		ctx.key,
		{ method: 'POST', body: {} },
	);
	await logEventFromContext(
		ctx,
		'bannerbear.templates.import',
		{ ...input },
		'completed',
	);
	return response;
};
