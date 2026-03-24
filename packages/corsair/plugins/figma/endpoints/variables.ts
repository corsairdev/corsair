import { logEventFromContext } from '../../utils/events';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const createModifyDelete: FigmaEndpoints['variablesCreateModifyDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['variablesCreateModifyDelete']>(
		`v1/files/${input.file_key}/variables`,
		ctx.key,
		{
			method: 'POST',
			body: {
				variables: input.variables,
				variableModes: input.variableModes,
				variableModeValues: input.variableModeValues,
				variableCollections: input.variableCollections,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'figma.variables.createModifyDelete',
		{ ...input },
		'completed',
	);
	return result;
};

export const getLocal: FigmaEndpoints['variablesGetLocal'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['variablesGetLocal']>(
		`v1/files/${input.file_key}/variables/local`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'figma.variables.getLocal', { ...input }, 'completed');
	return result;
};

export const getPublished: FigmaEndpoints['variablesGetPublished'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['variablesGetPublished']>(
		`v1/files/${input.file_key}/variables/published`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'figma.variables.getPublished', { ...input }, 'completed');
	return result;
};
