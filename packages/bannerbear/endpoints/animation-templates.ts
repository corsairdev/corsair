import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { encodeBannerbearUid, makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const list: BannerbearEndpoints['listAnimationTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listAnimationTemplates']
	>('/v5/animation_templates', ctx.key, {
		method: 'GET',
		query: { page: input.page },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.animation_templates.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BannerbearEndpoints['getAnimationTemplate'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getAnimationTemplate']
	>(`/v5/animation_templates/${encodeBannerbearUid(input.uid)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'bannerbear.animation_templates.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: BannerbearEndpoints['createAnimationTemplate'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['createAnimationTemplate']
	>('/v5/animation_templates', ctx.key, {
		method: 'POST',
		body: { ...input },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.animation_templates.create',
		{ ...input },
		'completed',
	);
	return response;
};
