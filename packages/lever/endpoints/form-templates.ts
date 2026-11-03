import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withFormTemplatePath = (formTemplateId?: string): string =>
	formTemplateId === undefined
		? '/form_templates'
		: leverPathParameter(
				'/form_templates/{formTemplateId}',
				'formTemplateId',
				formTemplateId,
			);

export const listFormTemplates: LeverEndpoints['listFormTemplates'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['listFormTemplates']
	>(ctx, '/form_templates', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'lever.formTemplates.list',
		input,
		'completed',
	);
	return response;
};

export const retrieveFormTemplate: LeverEndpoints['retrieveFormTemplate'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrieveFormTemplate']
		>(ctx, withFormTemplatePath(input.formTemplateId), { method: 'GET' });
		await logEventFromContext(
			ctx,
			'lever.formTemplates.retrieve',
			input,
			'completed',
		);
		return response;
	};

export const createFormTemplate: LeverEndpoints['createFormTemplate'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['createFormTemplate']
	>(ctx, withFormTemplatePath(), { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'lever.formTemplates.create',
		input,
		'completed',
	);
	return response;
};

export const updateFormTemplate: LeverEndpoints['updateFormTemplate'] = async (
	ctx,
	input,
) => {
	const { formTemplateId, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['updateFormTemplate']
	>(ctx, withFormTemplatePath(formTemplateId), { method: 'PUT', body });
	await logEventFromContext(
		ctx,
		'lever.formTemplates.update',
		input,
		'completed',
	);
	return response;
};

export const deleteFormTemplate: LeverEndpoints['deleteFormTemplate'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['deleteFormTemplate']
	>(ctx, withFormTemplatePath(input.formTemplateId), { method: 'DELETE' });
	await logEventFromContext(
		ctx,
		'lever.formTemplates.delete',
		input,
		'completed',
	);
	return response;
};
