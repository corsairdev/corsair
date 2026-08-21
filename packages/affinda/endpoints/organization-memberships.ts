import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const getAllOrganizationMembershipsRoute = getRoute(
	'getAllOrganizationMemberships',
);
export const getAllOrganizationMemberships: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(
		ctx,
		input,
		getAllOrganizationMembershipsRoute,
	);
};

const getOrganizationMembershipRoute = getRoute('getOrganizationMembership');
export const getOrganizationMembership: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, getOrganizationMembershipRoute);
};

const updateOrganizationMembershipRoute = getRoute(
	'updateOrganizationMembership',
);
export const updateOrganizationMembership: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, updateOrganizationMembershipRoute);
};

export const OrganizationMembershipsEndpoints = {
	getAllOrganizationMemberships,
	getOrganizationMembership,
	updateOrganizationMembership,
} as const;
