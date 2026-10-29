import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type {
	CustomFieldInfoResponse,
	CustomFieldListResponse,
	CustomFieldSetValueResponse,
} from './types';

export const info: AshbyEndpoints['customField.info'] = async (ctx, input) => {
	return await ashbyCall<CustomFieldInfoResponse>(ctx, 'customField.info', {
		customFieldDefinitionId: input.customFieldDefinitionId,
	});
};

export const list: AshbyEndpoints['customField.list'] = async (ctx, input) => {
	return await ashbyCall<CustomFieldListResponse>(ctx, 'customField.list', {
		limit: input.limit,
		cursor: input.cursor,
		syncToken: input.syncToken,
		objectType: input.objectType,
	});
};

export const setValue: AshbyEndpoints['customField.setValue'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<CustomFieldSetValueResponse>(
		ctx,
		'customField.setValue',
		{
			objectType: input.objectType,
			objectId: input.objectId,
			customFieldDefinitionId: input.customFieldDefinitionId,
			value: input.value,
		},
	);
};
