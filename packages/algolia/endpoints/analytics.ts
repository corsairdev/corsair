import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const getAddToCartRateRoute = getRoute('getAddToCartRate');
export const getAddToCartRate: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getAddToCartRateRoute);
};

const getAverageClickPositionRoute = getRoute('getAverageClickPosition');
export const getAverageClickPosition: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, getAverageClickPositionRoute);
};

const getClickPositionsRoute = getRoute('getClickPositions');
export const getClickPositions: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getClickPositionsRoute);
};

const getClickThroughRateRoute = getRoute('getClickThroughRate');
export const getClickThroughRate: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getClickThroughRateRoute);
};

const getConversionRateRoute = getRoute('getConversionRate');
export const getConversionRate: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getConversionRateRoute);
};

const getNoClickRateRoute = getRoute('getNoClickRate');
export const getNoClickRate: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getNoClickRateRoute);
};

const getNoResultsRateRoute = getRoute('getNoResultsRate');
export const getNoResultsRate: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getNoResultsRateRoute);
};

const getNoResultsSearchesRoute = getRoute('getNoResultsSearches');
export const getNoResultsSearches: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, getNoResultsSearchesRoute);
};

const getPurchaseRateRoute = getRoute('getPurchaseRate');
export const getPurchaseRate: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getPurchaseRateRoute);
};

const getRevenueRoute = getRoute('getRevenue');
export const getRevenue: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getRevenueRoute);
};

const getSearchesCountRoute = getRoute('getSearchesCount');
export const getSearchesCount: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getSearchesCountRoute);
};

const getSearchesNoClicksRoute = getRoute('getSearchesNoClicks');
export const getSearchesNoClicks: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getSearchesNoClicksRoute);
};

const getTopCountriesRoute = getRoute('getTopCountries');
export const getTopCountries: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getTopCountriesRoute);
};

const getTopFilterAttributesRoute = getRoute('getTopFilterAttributes');
export const getTopFilterAttributes: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, getTopFilterAttributesRoute);
};

const getTopFilterForAttributeRoute = getRoute('getTopFilterForAttribute');
export const getTopFilterForAttribute: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, getTopFilterForAttributeRoute);
};

const getTopFiltersNoResultsRoute = getRoute('getTopFiltersNoResults');
export const getTopFiltersNoResults: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, getTopFiltersNoResultsRoute);
};

const getTopHitsRoute = getRoute('getTopHits');
export const getTopHits: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getTopHitsRoute);
};

const getTopSearchesRoute = getRoute('getTopSearches');
export const getTopSearches: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getTopSearchesRoute);
};

const getUsersCountRoute = getRoute('getUsersCount');
export const getUsersCount: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getUsersCountRoute);
};

export const AnalyticsEndpoints = {
	getAddToCartRate,
	getAverageClickPosition,
	getClickPositions,
	getClickThroughRate,
	getConversionRate,
	getNoClickRate,
	getNoResultsRate,
	getNoResultsSearches,
	getPurchaseRate,
	getRevenue,
	getSearchesCount,
	getSearchesNoClicks,
	getTopCountries,
	getTopFilterAttributes,
	getTopFilterForAttribute,
	getTopFiltersNoResults,
	getTopHits,
	getTopSearches,
	getUsersCount,
} as const;
