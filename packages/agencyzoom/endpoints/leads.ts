import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const batchCreateLeadRoute = getRoute('batchCreateLead');
export const batchCreateLead: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, batchCreateLeadRoute);
};

const changeStatusForLeadRoute = getRoute('changeStatusForLead');
export const changeStatusForLead: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, changeStatusForLeadRoute);
};

const createALeadNoteRoute = getRoute('createALeadNote');
export const createALeadNote: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, createALeadNoteRoute);
};

const createALeadOpportunityRoute = getRoute('createALeadOpportunity');
export const createALeadOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, createALeadOpportunityRoute);
};

const createALeadQuoteRoute = getRoute('createALeadQuote');
export const createALeadQuote: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, createALeadQuoteRoute);
};

const createBizLeadRoute = getRoute('createBizLead');
export const createBizLead: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, createBizLeadRoute);
};

const createLeadRoute = getRoute('createLead');
export const createLead: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, createLeadRoute);
};

const deleteALeadFileRoute = getRoute('deleteALeadFile');
export const deleteALeadFile: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, deleteALeadFileRoute);
};

const deleteALeadOpportunityRoute = getRoute('deleteALeadOpportunity');
export const deleteALeadOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, deleteALeadOpportunityRoute);
};

const deleteALeadQuoteRoute = getRoute('deleteALeadQuote');
export const deleteALeadQuote: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, deleteALeadQuoteRoute);
};

const getLeadFilesRoute = getRoute('getLeadFiles');
export const getLeadFiles: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, getLeadFilesRoute);
};

const getLeadNotesRoute = getRoute('getLeadNotes');
export const getLeadNotes: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, getLeadNotesRoute);
};

const getLeadQuotesRoute = getRoute('getLeadQuotes');
export const getLeadQuotes: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, getLeadQuotesRoute);
};

const getLeadTasksRoute = getRoute('getLeadTasks');
export const getLeadTasks: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, getLeadTasksRoute);
};

const getTheLeadDetailsRoute = getRoute('getTheLeadDetails');
export const getTheLeadDetails: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getTheLeadDetailsRoute);
};

const getTheOpportunitiesForALeadRoute = getRoute(
	'getTheOpportunitiesForALead',
);
export const getTheOpportunitiesForALead: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		getTheOpportunitiesForALeadRoute,
	);
};

const moveLeadToSoldRoute = getRoute('moveLeadToSold');
export const moveLeadToSold: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, moveLeadToSoldRoute);
};

const searchLeadsRoute = getRoute('searchLeads');
export const searchLeads: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, searchLeadsRoute);
};

const searchLeadsCountRoute = getRoute('searchLeadsCount');
export const searchLeadsCount: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, searchLeadsCountRoute);
};

const updateALeadFileNameRoute = getRoute('updateALeadFileName');
export const updateALeadFileName: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, updateALeadFileNameRoute);
};

const updateALeadOpportunityRoute = getRoute('updateALeadOpportunity');
export const updateALeadOpportunity: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, updateALeadOpportunityRoute);
};

const updateALeadQuoteRoute = getRoute('updateALeadQuote');
export const updateALeadQuote: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, updateALeadQuoteRoute);
};

const updateBusinessLeadRoute = getRoute('updateBusinessLead');
export const updateBusinessLead: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, updateBusinessLeadRoute);
};

const updateLeadRoute = getRoute('updateLead');
export const updateLead: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, updateLeadRoute);
};

const updateLeadStatusByIdRoute = getRoute('updateLeadStatusById');
export const updateLeadStatusById: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, updateLeadStatusByIdRoute);
};

export const LeadsEndpoints = {
	batchCreateLead,
	changeStatusForLead,
	createALeadNote,
	createALeadOpportunity,
	createALeadQuote,
	createBizLead,
	createLead,
	deleteALeadFile,
	deleteALeadOpportunity,
	deleteALeadQuote,
	getLeadFiles,
	getLeadNotes,
	getLeadQuotes,
	getLeadTasks,
	getTheLeadDetails,
	getTheOpportunitiesForALead,
	moveLeadToSold,
	searchLeads,
	searchLeadsCount,
	updateALeadFileName,
	updateALeadOpportunity,
	updateALeadQuote,
	updateBusinessLead,
	updateLead,
	updateLeadStatusById,
} as const;
