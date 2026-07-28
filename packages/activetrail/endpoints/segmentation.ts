import type { ActiveTrailEndpoint } from './factory';
import { executeActiveTrailOperation } from './factory';
import { activeTrailRoutes } from './routes';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[activetrail] missing route: ${name}`);
	}
	return route;
}

const createSegmentationRoute = getRoute('createSegmentation');
export const createSegmentation: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, createSegmentationRoute);
};

const getSegmentationRuleFieldTypesRoute = getRoute(
	'getSegmentationRuleFieldTypes',
);
export const getSegmentationRuleFieldTypes: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getSegmentationRuleFieldTypesRoute,
	);
};

const getSegmentationRuleOperationsRoute = getRoute(
	'getSegmentationRuleOperations',
);
export const getSegmentationRuleOperations: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getSegmentationRuleOperationsRoute,
	);
};

const getSegmentationRuleTypesRoute = getRoute('getSegmentationRuleTypes');
export const getSegmentationRuleTypes: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSegmentationRuleTypesRoute);
};

const getSegmentationRuleTypesMappingRoute = getRoute(
	'getSegmentationRuleTypesMapping',
);
export const getSegmentationRuleTypesMapping: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getSegmentationRuleTypesMappingRoute,
	);
};

const getSegmentationsRoute = getRoute('getSegmentations');
export const getSegmentations: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSegmentationsRoute);
};

const updateSegmentationRoute = getRoute('updateSegmentation');
export const updateSegmentation: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, updateSegmentationRoute);
};

export const SegmentationEndpoints = {
	createSegmentation,
	getSegmentationRuleFieldTypes,
	getSegmentationRuleOperations,
	getSegmentationRuleTypes,
	getSegmentationRuleTypesMapping,
	getSegmentations,
	updateSegmentation,
} as const;
