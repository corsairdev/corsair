import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withFeedbackTemplatePath = (feedbackTemplateId?: string): string =>
	feedbackTemplateId === undefined
		? '/feedback_templates'
		: leverPathParameter(
				'/feedback_templates/{feedbackTemplateId}',
				'feedbackTemplateId',
				feedbackTemplateId,
			);

export const listFeedbackTemplates: LeverEndpoints['listFeedbackTemplates'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['listFeedbackTemplates']
		>(ctx, '/feedback_templates', { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'lever.feedbackTemplates.list',
			input,
			'completed',
		);
		return response;
	};

export const retrieveFeedbackTemplate: LeverEndpoints['retrieveFeedbackTemplate'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrieveFeedbackTemplate']
		>(ctx, withFeedbackTemplatePath(input.feedbackTemplateId), {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'lever.feedbackTemplates.retrieve',
			input,
			'completed',
		);
		return response;
	};

export const createFeedbackTemplate: LeverEndpoints['createFeedbackTemplate'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['createFeedbackTemplate']
		>(ctx, withFeedbackTemplatePath(), { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'lever.feedbackTemplates.create',
			input,
			'completed',
		);
		return response;
	};

export const updateFeedbackTemplate: LeverEndpoints['updateFeedbackTemplate'] =
	async (ctx, input) => {
		const { feedbackTemplateId, ...body } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['updateFeedbackTemplate']
		>(ctx, withFeedbackTemplatePath(feedbackTemplateId), {
			method: 'PUT',
			body,
		});
		await logEventFromContext(
			ctx,
			'lever.feedbackTemplates.update',
			input,
			'completed',
		);
		return response;
	};

export const deleteFeedbackTemplate: LeverEndpoints['deleteFeedbackTemplate'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['deleteFeedbackTemplate']
		>(ctx, withFeedbackTemplatePath(input.feedbackTemplateId), {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'lever.feedbackTemplates.delete',
			input,
			'completed',
		);
		return response;
	};
