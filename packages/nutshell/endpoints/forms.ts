import { defineEndpoint } from './factory';

export const formsGetFieldId = defineEndpoint('forms.getFieldId');
export const formsList = defineEndpoint('forms.list');
export const formsGet = defineEndpoint('forms.get');

export const endpoints = {
	forms: {
		getFieldId: formsGetFieldId,
		list: formsList,
		get: formsGet,
	},
} as const;
