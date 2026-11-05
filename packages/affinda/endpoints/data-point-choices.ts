import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createDataPointChoiceRoute = getRoute('createDataPointChoice');
export const createDataPointChoice: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createDataPointChoiceRoute);
};

const getDataPointChoiceRoute = getRoute('getDataPointChoice');
export const getDataPointChoice: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDataPointChoiceRoute);
};

const listDataPointChoicesRoute = getRoute('listDataPointChoices');
export const listDataPointChoices: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, listDataPointChoicesRoute);
};

const replaceDataPointChoicesRoute = getRoute('replaceDataPointChoices');
export const replaceDataPointChoices: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, replaceDataPointChoicesRoute);
};

const updateDataPointChoiceRoute = getRoute('updateDataPointChoice');
export const updateDataPointChoice: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, updateDataPointChoiceRoute);
};

export const DataPointChoicesEndpoints = {
	createDataPointChoice,
	getDataPointChoice,
	listDataPointChoices,
	replaceDataPointChoices,
	updateDataPointChoice,
} as const;
