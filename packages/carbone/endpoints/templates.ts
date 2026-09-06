import { logEventFromContext } from 'corsair/core';
import {
	assertCarboneSuccess,
	CARBONE_API_BASE,
	makeCarboneRequest,
} from '../client';
import type { CarboneEndpoints } from '../index';
import type {
	DeleteTemplateOutput,
	GetTemplateOutput,
	UploadTemplateOutput,
} from './types';

export const uploadTemplate: CarboneEndpoints['uploadTemplate'] = async (
	ctx,
	input,
) => {
	const response = assertCarboneSuccess(
		await makeCarboneRequest<UploadTemplateOutput>('/template', {
			apiKey: ctx.key,
			method: 'POST',
			body: {
				template: input.template,
			},
		}),
	);

	await logEventFromContext(
		ctx,
		'carbone.templates.upload',
		{ id: response.data?.id ?? response.data?.templateId },
		'completed',
	);

	return response;
};

export const getTemplate: CarboneEndpoints['getTemplate'] = async (
	ctx,
	input,
) => {
	const templateId = encodeURIComponent(input.templateId);
	const downloadUrl = `${CARBONE_API_BASE}/template/${templateId}`;

	await logEventFromContext(
		ctx,
		'carbone.templates.get',
		{ templateId: input.templateId },
		'completed',
	);

	return {
		templateId: input.templateId,
		downloadUrl,
		success: true,
	} satisfies GetTemplateOutput;
};

export const deleteTemplate: CarboneEndpoints['deleteTemplate'] = async (
	ctx,
	input,
) => {
	const templateId = encodeURIComponent(input.templateId);
	const response = assertCarboneSuccess(
		await makeCarboneRequest<DeleteTemplateOutput>(`/template/${templateId}`, {
			apiKey: ctx.key,
			method: 'DELETE',
		}),
	);

	await logEventFromContext(
		ctx,
		'carbone.templates.delete',
		{ templateId: input.templateId },
		'completed',
	);

	return response;
};
