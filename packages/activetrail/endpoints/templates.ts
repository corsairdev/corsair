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

const deleteTemplateRoute = getRoute('deleteTemplate');
export const deleteTemplate: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, deleteTemplateRoute);
};

const deleteTemplatesTemplateCategoryRoute = getRoute(
	'deleteTemplatesTemplateCategory',
);
export const deleteTemplatesTemplateCategory: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		deleteTemplatesTemplateCategoryRoute,
	);
};

const getTemplateContentRoute = getRoute('getTemplateContent');
export const getTemplateContent: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getTemplateContentRoute);
};

const getTemplatesRoute = getRoute('getTemplates');
export const getTemplates: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getTemplatesRoute);
};

const getTemplatesTemplateCategoryRoute = getRoute(
	'getTemplatesTemplateCategory',
);
export const getTemplatesTemplateCategory: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getTemplatesTemplateCategoryRoute,
	);
};

const postTemplatesCampaignRoute = getRoute('postTemplatesCampaign');
export const postTemplatesCampaign: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, postTemplatesCampaignRoute);
};

const postTemplatesTemplateCategoryRoute = getRoute(
	'postTemplatesTemplateCategory',
);
export const postTemplatesTemplateCategory: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		postTemplatesTemplateCategoryRoute,
	);
};

const updateTemplateRoute = getRoute('updateTemplate');
export const updateTemplate: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, updateTemplateRoute);
};

const updateTemplateCategoryRoute = getRoute('updateTemplateCategory');
export const updateTemplateCategory: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, updateTemplateCategoryRoute);
};

const updateTemplateContentRoute = getRoute('updateTemplateContent');
export const updateTemplateContent: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, updateTemplateContentRoute);
};

export const TemplatesEndpoints = {
	deleteTemplate,
	deleteTemplatesTemplateCategory,
	getTemplateContent,
	getTemplates,
	getTemplatesTemplateCategory,
	postTemplatesCampaign,
	postTemplatesTemplateCategory,
	updateTemplate,
	updateTemplateCategory,
	updateTemplateContent,
} as const;
