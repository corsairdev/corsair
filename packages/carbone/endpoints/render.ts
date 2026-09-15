import { logEventFromContext } from 'corsair/core';
import { assertCarboneSuccess, makeCarboneRequest } from '../client';
import type { CarboneEndpoints } from '../index';
import type { GenerateReportOutput, RenderTemplateDirectOutput } from './types';

export const generateReport: CarboneEndpoints['generateReport'] = async (
	ctx,
	input,
) => {
	const templateId = encodeURIComponent(input.templateId);
	const { templateId: _, ...renderOptions } = input;

	const response = assertCarboneSuccess(
		await makeCarboneRequest<GenerateReportOutput>(`/render/${templateId}`, {
			apiKey: ctx.key,
			version: ctx.options?.version,
			method: 'POST',
			body: renderOptions as Record<string, unknown>,
		}),
	);

	await logEventFromContext(
		ctx,
		'carbone.render.generateReport',
		{
			templateId: input.templateId,
			renderId: response.data?.renderId,
			convertTo: input.convertTo,
		},
		'completed',
	);

	return response;
};

export const renderDirect: CarboneEndpoints['renderDirect'] = async (
	ctx,
	input,
) => {
	const response = assertCarboneSuccess(
		await makeCarboneRequest<RenderTemplateDirectOutput>('/render/template', {
			apiKey: ctx.key,
			version: ctx.options?.version,
			method: 'POST',
			body: input as unknown as Record<string, unknown>,
		}),
	);

	await logEventFromContext(
		ctx,
		'carbone.render.renderDirect',
		{
			renderId: response.data?.renderId,
			convertTo: input.convertTo,
		},
		'completed',
	);

	return response;
};
