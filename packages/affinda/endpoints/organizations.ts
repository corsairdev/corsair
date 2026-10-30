import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createOrganizationRoute = getRoute('createOrganization');
export const createOrganization: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createOrganizationRoute);
};

const deleteOrganizationRoute = getRoute('deleteOrganization');
export const deleteOrganization: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteOrganizationRoute);
};

const getOrganizationRoute = getRoute('getOrganization');
export const getOrganization: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getOrganizationRoute);
};

const getOrganizationsRoute = getRoute('getOrganizations');
export const getOrganizations: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getOrganizationsRoute);
};

const updateOrganizationRoute = getRoute('updateOrganization');
export const updateOrganization: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateOrganizationRoute);
};

export const OrganizationsEndpoints = {
	createOrganization,
	deleteOrganization,
	getOrganization,
	getOrganizations,
	updateOrganization,
} as const;
