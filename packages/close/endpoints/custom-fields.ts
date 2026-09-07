import { makeCloseRequest } from '../client';
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
	const parsedInput = input
		? CustomFieldsListLeadInputSchema.parse(input)
		: undefined;
	const res = await makeCloseRequest<unknown>('custom_field/lead/', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});
	return CustomFieldsListLeadResponseSchema.parse(res);
};

export const customFieldsListContact = async (
	ctx: CloseContext,
	input?: CustomFieldsListContactInput,
): Promise<CustomFieldsListContactResponse> => {
	const parsedInput = input
		? CustomFieldsListContactInputSchema.parse(input)
		: undefined;
	const res = await makeCloseRequest<unknown>(
		'custom_field/contact/',
		ctx.key,
		{ method: 'GET', query: parsedInput },
	);
	return CustomFieldsListContactResponseSchema.parse(res);
};
