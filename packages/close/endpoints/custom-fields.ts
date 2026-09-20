import { makeCloseRequestForCtx } from '../client';
import type { CloseContext } from '../index';
import type {
	CustomFieldsListContactInput,
	CustomFieldsListContactResponse,
	CustomFieldsListLeadInput,
	CustomFieldsListLeadResponse,
} from './types';
import {
	CustomFieldsListContactInputSchema,
	CustomFieldsListContactResponseSchema,
	CustomFieldsListLeadInputSchema,
	CustomFieldsListLeadResponseSchema,
} from './types';

export const customFieldsListLead = async (
	ctx: CloseContext,
	input?: CustomFieldsListLeadInput,
): Promise<CustomFieldsListLeadResponse> => {
	const parsedInput =
		input === undefined
			? undefined
			: CustomFieldsListLeadInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'custom_field/lead/', {
		method: 'GET',
		query: parsedInput,
	});
	return CustomFieldsListLeadResponseSchema.parse(res);
};

export const customFieldsListContact = async (
	ctx: CloseContext,
	input?: CustomFieldsListContactInput,
): Promise<CustomFieldsListContactResponse> => {
	const parsedInput =
		input === undefined
			? undefined
			: CustomFieldsListContactInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(
		ctx,
		'custom_field/contact/',
		{ method: 'GET', query: parsedInput },
	);
	return CustomFieldsListContactResponseSchema.parse(res);
};
