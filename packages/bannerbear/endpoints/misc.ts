import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const getFonts: BannerbearEndpoints['getFonts'] = async (
	ctx,
	_input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getFonts']
	>('/v5/fonts', ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'bannerbear.fonts.get', {}, 'completed');
	return response;
};

export const listEffects: BannerbearEndpoints['listEffects'] = async (
	ctx,
	_input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listEffects']
	>('/v5/effects', ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'bannerbear.effects.list', {}, 'completed');
	return response;
};

export const joinPdfs: BannerbearEndpoints['joinPdfs'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['joinPdfs']
	>('/v5/pdfs', ctx.key, {
		method: 'POST',
		body: {
			pdf_urls: input.pdf_urls,
			project_id: input.project_id,
			webhook_url: input.webhook_url,
			metadata: input.metadata,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.pdfs.join',
		{ ...input },
		'completed',
	);
	return response;
};
