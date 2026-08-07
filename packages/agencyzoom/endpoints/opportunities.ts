import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const createADriverForAnOpportunityRoute = getRoute(
	'createADriverForAnOpportunity',
);
export const createADriverForAnOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		createADriverForAnOpportunityRoute,
	);
};

const createAnOpportunityRoute = getRoute('createAnOpportunity');
export const createAnOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, createAnOpportunityRoute);
};

const createAVehicleForAnOpportunityRoute = getRoute(
	'createAVehicleForAnOpportunity',
);
export const createAVehicleForAnOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		createAVehicleForAnOpportunityRoute,
	);
};

const deleteADriverRoute = getRoute('deleteADriver');
export const deleteADriver: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, deleteADriverRoute);
};

const deleteAnOpportunityRoute = getRoute('deleteAnOpportunity');
export const deleteAnOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, deleteAnOpportunityRoute);
};

const deleteAVehicleRoute = getRoute('deleteAVehicle');
export const deleteAVehicle: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, deleteAVehicleRoute);
};

const getAListOfDriversForAnOpportunityRoute = getRoute(
	'getAListOfDriversForAnOpportunity',
);
export const getAListOfDriversForAnOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		getAListOfDriversForAnOpportunityRoute,
	);
};

const getAListOfVehiclesForAnOpportunityRoute = getRoute(
	'getAListOfVehiclesForAnOpportunity',
);
export const getAListOfVehiclesForAnOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		getAListOfVehiclesForAnOpportunityRoute,
	);
};

const getTheDriverDetailsRoute = getRoute('getTheDriverDetails');
export const getTheDriverDetails: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getTheDriverDetailsRoute);
};

const getTheOpportunityDetailsRoute = getRoute('getTheOpportunityDetails');
export const getTheOpportunityDetails: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getTheOpportunityDetailsRoute);
};

const getTheVehicleDetailsRoute = getRoute('getTheVehicleDetails');
export const getTheVehicleDetails: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getTheVehicleDetailsRoute);
};

const linkADriverToOpportunityRoute = getRoute('linkADriverToOpportunity');
export const linkADriverToOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, linkADriverToOpportunityRoute);
};

const linkAVehicleToOpportunityRoute = getRoute('linkAVehicleToOpportunity');
export const linkAVehicleToOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, linkAVehicleToOpportunityRoute);
};

const unlinkADriverFromOpportunityRoute = getRoute(
	'unlinkADriverFromOpportunity',
);
export const unlinkADriverFromOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		unlinkADriverFromOpportunityRoute,
	);
};

const unlinkAVehicleFromOpportunityRoute = getRoute(
	'unlinkAVehicleFromOpportunity',
);
export const unlinkAVehicleFromOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		unlinkAVehicleFromOpportunityRoute,
	);
};

const updateADriverSDetailsRoute = getRoute('updateADriverSDetails');
export const updateADriverSDetails: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, updateADriverSDetailsRoute);
};

const updateAnOpportunityRoute = getRoute('updateAnOpportunity');
export const updateAnOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, updateAnOpportunityRoute);
};

const updateAVehicleSDetailsRoute = getRoute('updateAVehicleSDetails');
export const updateAVehicleSDetails: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, updateAVehicleSDetailsRoute);
};

export const OpportunitiesEndpoints = {
	createADriverForAnOpportunity,
	createAnOpportunity,
	createAVehicleForAnOpportunity,
	deleteADriver,
	deleteAnOpportunity,
	deleteAVehicle,
	getAListOfDriversForAnOpportunity,
	getAListOfVehiclesForAnOpportunity,
	getTheDriverDetails,
	getTheOpportunityDetails,
	getTheVehicleDetails,
	linkADriverToOpportunity,
	linkAVehicleToOpportunity,
	unlinkADriverFromOpportunity,
	unlinkAVehicleFromOpportunity,
	updateADriverSDetails,
	updateAnOpportunity,
	updateAVehicleSDetails,
} as const;
