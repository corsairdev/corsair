import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const clearRulesRoute = getRoute('clearRules');
export const clearRules: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, clearRulesRoute);
};

const createOrUpdateRecommendRulesRoute = getRoute(
	'createOrUpdateRecommendRules',
);
export const createOrUpdateRecommendRules: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, createOrUpdateRecommendRulesRoute);
};

const deleteRecommendRuleRoute = getRoute('deleteRecommendRule');
export const deleteRecommendRule: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteRecommendRuleRoute);
};

const deleteRuleRoute = getRoute('deleteRule');
export const deleteRule: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, deleteRuleRoute);
};

const exportRulesRoute = getRoute('exportRules');
export const exportRules: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, exportRulesRoute);
};

const getRecommendRuleRoute = getRoute('getRecommendRule');
export const getRecommendRule: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getRecommendRuleRoute);
};

const getRuleRoute = getRoute('getRule');
export const getRule: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getRuleRoute);
};

const replaceAllRulesRoute = getRoute('replaceAllRules');
export const replaceAllRules: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, replaceAllRulesRoute);
};

const saveRuleRoute = getRoute('saveRule');
export const saveRule: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, saveRuleRoute);
};

const searchRecommendRulesRoute = getRoute('searchRecommendRules');
export const searchRecommendRules: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, searchRecommendRulesRoute);
};

export const RulesEndpoints = {
	clearRules,
	createOrUpdateRecommendRules,
	deleteRecommendRule,
	deleteRule,
	exportRules,
	getRecommendRule,
	getRule,
	replaceAllRules,
	saveRule,
	searchRecommendRules,
} as const;
