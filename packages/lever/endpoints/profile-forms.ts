import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withFormsPath = (opportunityId: string, formId?: string): string => {
	const base = leverPathParameter(
		'/opportunities/{opportunityId}/forms',
		'opportunityId',
		opportunityId,
	);
	return formId === undefined
		? base
		: leverPathParameter(`${base}/{formId}`, 'formId', formId);
};

export const listForms: LeverEndpoints['listForms'] = async (ctx, input) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['listForms']>(
		ctx,
		withFormsPath(input.opportunityId),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'lever.forms.list', input, 'completed');
	return response;
};

export const retrieveForm: LeverEndpoints['retrieveForm'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['retrieveForm']>(
		ctx,
		withFormsPath(input.opportunityId, input.formId),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'lever.forms.retrieve', input, 'completed');
	return response;
};

export const createForm: LeverEndpoints['createForm'] = async (ctx, input) => {
	const { opportunityId, perform_as, ...body } = input;
	const response = await makeLeverRequest<LeverEndpointOutputs['createForm']>(
		ctx,
		withFormsPath(opportunityId),
		{ method: 'POST', body, query: { perform_as } },
	);
	await logEventFromContext(ctx, 'lever.forms.create', input, 'completed');
	return response;
};
