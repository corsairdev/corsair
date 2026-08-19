import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const getAListOfAssignGroupsRoute = getRoute('getAListOfAssignGroups');
export const getAListOfAssignGroups: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfAssignGroupsRoute);
};

const getAListOfCarriersRoute = getRoute('getAListOfCarriers');
export const getAListOfCarriers: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfCarriersRoute);
};

const getAListOfCsrsRoute = getRoute('getAListOfCsrs');
export const getAListOfCsrs: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfCsrsRoute);
};

const getAListOfCustomFieldsRoute = getRoute('getAListOfCustomFields');
export const getAListOfCustomFields: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfCustomFieldsRoute);
};

const getAListOfEmployeesRoute = getRoute('getAListOfEmployees');
export const getAListOfEmployees: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfEmployeesRoute);
};

const getAListOfLeadSourceCategoriesRoute = getRoute(
	'getAListOfLeadSourceCategories',
);
export const getAListOfLeadSourceCategories: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		getAListOfLeadSourceCategoriesRoute,
	);
};

const getAListOfLeadSourcesRoute = getRoute('getAListOfLeadSources');
export const getAListOfLeadSources: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfLeadSourcesRoute);
};

const getAListOfLifeProfessionalsRoute = getRoute(
	'getAListOfLifeProfessionals',
);
export const getAListOfLifeProfessionals: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		getAListOfLifeProfessionalsRoute,
	);
};

const getAListOfLocationsRoute = getRoute('getAListOfLocations');
export const getAListOfLocations: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfLocationsRoute);
};

const getAListOfLossReasonsRoute = getRoute('getAListOfLossReasons');
export const getAListOfLossReasons: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfLossReasonsRoute);
};

const getAListOfPipelinesRoute = getRoute('getAListOfPipelines');
export const getAListOfPipelines: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfPipelinesRoute);
};

const getAListOfProductLinesPolicyTypesRoute = getRoute(
	'getAListOfProductLinesPolicyTypes',
);
export const getAListOfProductLinesPolicyTypes: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		getAListOfProductLinesPolicyTypesRoute,
	);
};

const getAListOfRecycleEventsRoute = getRoute('getAListOfRecycleEvents');
export const getAListOfRecycleEvents: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAListOfRecycleEventsRoute);
};

const getDepartmentsGroupsRoute = getRoute('getDepartmentsGroups');
export const getDepartmentsGroups: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getDepartmentsGroupsRoute);
};

const getListOfEndStagesRoute = getRoute('getListOfEndStages');
export const getListOfEndStages: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getListOfEndStagesRoute);
};

const listProductCategoriesRoute = getRoute('listProductCategories');
export const listProductCategories: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, listProductCategoriesRoute);
};

const searchBusinessClassificationsRoute = getRoute(
	'searchBusinessClassifications',
);
export const searchBusinessClassifications: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		searchBusinessClassificationsRoute,
	);
};

export const ReferenceDataEndpoints = {
	getAListOfAssignGroups,
	getAListOfCarriers,
	getAListOfCsrs,
	getAListOfCustomFields,
	getAListOfEmployees,
	getAListOfLeadSourceCategories,
	getAListOfLeadSources,
	getAListOfLifeProfessionals,
	getAListOfLocations,
	getAListOfLossReasons,
	getAListOfPipelines,
	getAListOfProductLinesPolicyTypes,
	getAListOfRecycleEvents,
	getDepartmentsGroups,
	getListOfEndStages,
	listProductCategories,
	searchBusinessClassifications,
} as const;
