import { logEventFromContext } from 'corsair/core';
import type { InsightoaiEndpoints } from '..';
import { makeInsightoaiRequest } from '../client';
import type { InsightoaiEndpointOutputs } from './types';

export const createForm: InsightoaiEndpoints['createForm'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['createForm']
	>('/api/v1/form', ctx.key, {
		method: 'POST',
		body: input,
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.forms.createForm',
		{ formType: input.form_type },
		'completed',
	);
	return result;
};

export const getCapturedFormByFormId: InsightoaiEndpoints['getCapturedFormByFormId'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getCapturedFormByFormId']
		>(`/api/v1/capturedform/${input.form_id}`, ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.forms.getCapturedFormByFormId',
			{ formId: input.form_id },
			'completed',
		);
		return result;
	};

export const deleteFormById: InsightoaiEndpoints['deleteFormById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['deleteFormById']
	>(`/api/v1/form/${input.form_id}`, ctx.key, {
		method: 'DELETE',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.forms.deleteFormById',
		{ formId: input.form_id },
		'completed',
	);
	return result;
};

export const deleteBulkFormsByIds: InsightoaiEndpoints['deleteBulkFormsByIds'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['deleteBulkFormsByIds']
		>('/api/v1/form/multiple', ctx.key, {
			method: 'DELETE',
			body: input,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.forms.deleteBulkFormsByIds',
			{ itemCount: input.form_ids.length },
			'completed',
		);
		return result;
	};
