import { makeCloseRequest } from '../client';
import type { CloseContext } from '../index';
import type {
	CustomFieldsListContactInput,
	CustomFieldsListContactResponse,
	CustomFieldsListLeadInput,
	CustomFieldsListLeadResponse,
} from './types';

export const customFieldsListLead = async (
	ctx: CloseContext,
	_input?: CustomFieldsListLeadInput,
): Promise<CustomFieldsListLeadResponse> => {
	const res = await makeCloseRequest<CustomFieldsListLeadResponse>(
		'custom_field/lead/',
		ctx.key,
		{ method: 'GET' },
	);
	return res;
};

export const customFieldsListContact = async (
	ctx: CloseContext,
	_input?: CustomFieldsListContactInput,
): Promise<CustomFieldsListContactResponse> => {
	const res = await makeCloseRequest<CustomFieldsListContactResponse>(
		'custom_field/contact/',
		ctx.key,
		{ method: 'GET' },
	);
	return res;
};
