import { logEventFromContext } from 'corsair/core';
import {
	assertCarboneSuccess,
	CARBONE_API_BASE,
	makeCarboneRequest,
} from '../client';
import type { CarboneEndpoints } from '../index';
import type {
	GetRenderOutput,
	RenderInlineOutput,
	RenderTemplateOutput,
} from './types';

export const renderTemplate: CarboneEndpoints['render'] = async (
	ctx,
	input,
) => {
	const templateId = encodeURIComponent(input.templateId);
	const { templateId: _, ...renderOptions } = input;

	const response = assertCarboneSuccess(
		await makeCarboneRequest<RenderTemplateOutput>(`/render/${templateId}`, {
			apiKey: ctx.key,
			method: 'POST',
			body: renderOptions,
		}),
	);

	await logEventFromContext(
		ctx,
		'carbone.render.render',
		{ templateId: input.templateId, renderId: response.data.renderId },
		'completed',
	);

	return response;
};

export const renderInline: CarboneEndpoints['renderInline'] = async (
	ctx,
	input,
) => {
	const response = assertCarboneSuccess(
		await makeCarboneRequest<RenderInlineOutput>('/render/template', {
			apiKey: ctx.key,
			method: 'POST',
			body: input,
		}),
	);

	await logEventFromContext(
		ctx,
		'carbone.render.renderInline',
		{ renderId: response.data.renderId },
		'completed',
	);

	return response;
};

export const getRender: CarboneEndpoints['getRender'] = async (ctx, input) => {
	const renderId = encodeURIComponent(input.renderId);
	const downloadUrl = `${CARBONE_API_BASE}/render/${renderId}`;

	await logEventFromContext(
		ctx,
		'carbone.render.getRender',
		{ renderId: input.renderId },
		'completed',
	);

	return {
		renderId: input.renderId,
		downloadUrl,
	} satisfies GetRenderOutput;
};
