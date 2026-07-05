import { activeTrailRoutes } from './routes';
import type { ActiveTrailEndpoint } from './factory';
import { logActiveTrailOperation, requestActiveTrailOperation } from './factory';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error('[active_trail] missing route: ${name}');
	}
	return route;
}

const createSegmentationRoute = getRoute('createSegmentation');
export const createSegmentation: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createSegmentationRoute);
	await logActiveTrailOperation(ctx, input, createSegmentationRoute);
	return result;
};

const getSegmentationRuleFieldTypesRoute = getRoute('getSegmentationRuleFieldTypes');
export const getSegmentationRuleFieldTypes: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSegmentationRuleFieldTypesRoute);
	await logActiveTrailOperation(ctx, input, getSegmentationRuleFieldTypesRoute);
	return result;
};

const getSegmentationRuleOperationsRoute = getRoute('getSegmentationRuleOperations');
export const getSegmentationRuleOperations: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSegmentationRuleOperationsRoute);
	await logActiveTrailOperation(ctx, input, getSegmentationRuleOperationsRoute);
	return result;
};

const getSegmentationRuleTypesRoute = getRoute('getSegmentationRuleTypes');
export const getSegmentationRuleTypes: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSegmentationRuleTypesRoute);
	await logActiveTrailOperation(ctx, input, getSegmentationRuleTypesRoute);
	return result;
};

const getSegmentationRuleTypesMappingRoute = getRoute('getSegmentationRuleTypesMapping');
export const getSegmentationRuleTypesMapping: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSegmentationRuleTypesMappingRoute);
	await logActiveTrailOperation(ctx, input, getSegmentationRuleTypesMappingRoute);
	return result;
};

const getSegmentationsRoute = getRoute('getSegmentations');
export const getSegmentations: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSegmentationsRoute);
	await logActiveTrailOperation(ctx, input, getSegmentationsRoute);
	return result;
};

const updateSegmentationRoute = getRoute('updateSegmentation');
export const updateSegmentation: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateSegmentationRoute);
	await logActiveTrailOperation(ctx, input, updateSegmentationRoute);
	return result;
};

export const SegmentationEndpoints = {
	createSegmentation,
	getSegmentationRuleFieldTypes,
	getSegmentationRuleOperations,
	getSegmentationRuleTypes,
	getSegmentationRuleTypesMapping,
	getSegmentations,
	updateSegmentation
} as const;
