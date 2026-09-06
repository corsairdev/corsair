import { logEventFromContext } from 'corsair/core';
import { assertCarboneSuccess, makeCarboneRequest } from '../client';
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

	const templateId = response.data?.id ?? response.data?.templateId;
	if (ctx.db.templates && templateId) {
		try {
			await ctx.db.templates.upsertByEntityId(templateId, {
				id: templateId,
				versionId: response.data?.versionId,
				type: response.data?.type,
				size: response.data?.size,
				createdAt: response.data?.createdAt,
			});
		} catch (error) {
			console.warn(
				'[carbone] Failed to save template to local database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'carbone.templates.upload',
		{ id: templateId },
		'completed',
	);

	return response;
};

export const getTemplate: CarboneEndpoints['getTemplate'] = async (
	ctx,
	input,
) => {
	const templateId = encodeURIComponent(input.templateId);
	const content = await makeCarboneRequest<string>(`/template/${templateId}`, {
		apiKey: ctx.key,
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'carbone.templates.get',
		{ templateId: input.templateId },
		'completed',
	);

	return {
		templateId: input.templateId,
		content: typeof content === 'string' ? content : JSON.stringify(content),
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

	if (ctx.db.templates) {
		try {
			await ctx.db.templates.deleteByEntityId(input.templateId);
		} catch (error) {
			console.warn(
				'[carbone] Failed to remove template from local database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'carbone.templates.delete',
		{ templateId: input.templateId },
		'completed',
	);

	return response;
};
