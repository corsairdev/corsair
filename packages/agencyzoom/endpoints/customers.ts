import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const createACustomerNoteRoute = getRoute('createACustomerNote');
export const createACustomerNote: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, createACustomerNoteRoute);
};

const deleteACustomerRoute = getRoute('deleteACustomer');
export const deleteACustomer: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, deleteACustomerRoute);
};

const deleteACustomerFileRoute = getRoute('deleteACustomerFile');
export const deleteACustomerFile: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, deleteACustomerFileRoute);
};

const deleteACustomerPolicyRoute = getRoute('deleteACustomerPolicy');
export const deleteACustomerPolicy: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, deleteACustomerPolicyRoute);
};

const getAmsPoliciesForACustomerRoute = getRoute('getAmsPoliciesForACustomer');
export const getAmsPoliciesForACustomer: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		getAmsPoliciesForACustomerRoute,
	);
};

const getPoliciesForACustomerRoute = getRoute('getPoliciesForACustomer');
export const getPoliciesForACustomer: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getPoliciesForACustomerRoute);
};

const getTheCustomerDetailsRoute = getRoute('getTheCustomerDetails');
export const getTheCustomerDetails: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getTheCustomerDetailsRoute);
};

const getTheCustomerTasksRoute = getRoute('getTheCustomerTasks');
export const getTheCustomerTasks: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getTheCustomerTasksRoute);
};

const searchCustomersRoute = getRoute('searchCustomers');
export const searchCustomers: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, searchCustomersRoute);
};

const updateCustomerRoute = getRoute('updateCustomer');
export const updateCustomer: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, updateCustomerRoute);
};

export const CustomersEndpoints = {
	createACustomerNote,
	deleteACustomer,
	deleteACustomerFile,
	deleteACustomerPolicy,
	getAmsPoliciesForACustomer,
	getPoliciesForACustomer,
	getTheCustomerDetails,
	getTheCustomerTasks,
	searchCustomers,
	updateCustomer,
} as const;
