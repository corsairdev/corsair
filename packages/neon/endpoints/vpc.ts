import { vpcOperations } from '../operations/vpc';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof vpcOperations)[number]['name']) {
	const operation = vpcOperations.find((candidate) => candidate.name === name);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const listOrganizationVPCEndpointsAllRegionsDefinition = getOperation(
	'listOrganizationVPCEndpointsAllRegions',
);
export const listOrganizationVPCEndpointsAllRegions: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listOrganizationVPCEndpointsAllRegionsDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listOrganizationVPCEndpointsAllRegionsDefinition,
		input,
		result,
	);
	await logNeonOperation(
		ctx,
		input,
		listOrganizationVPCEndpointsAllRegionsDefinition,
	);
	return result;
};

const listOrganizationVPCEndpointsDefinition = getOperation(
	'listOrganizationVPCEndpoints',
);
export const listOrganizationVPCEndpoints: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listOrganizationVPCEndpointsDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listOrganizationVPCEndpointsDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, listOrganizationVPCEndpointsDefinition);
	return result;
};

const getOrganizationVPCEndpointDetailsDefinition = getOperation(
	'getOrganizationVPCEndpointDetails',
);
export const getOrganizationVPCEndpointDetails: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getOrganizationVPCEndpointDetailsDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getOrganizationVPCEndpointDetailsDefinition,
		input,
		result,
	);
	await logNeonOperation(
		ctx,
		input,
		getOrganizationVPCEndpointDetailsDefinition,
	);
	return result;
};

const assignOrganizationVPCEndpointDefinition = getOperation(
	'assignOrganizationVPCEndpoint',
);
export const assignOrganizationVPCEndpoint: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		assignOrganizationVPCEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		assignOrganizationVPCEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, assignOrganizationVPCEndpointDefinition);
	return result;
};

const deleteOrganizationVPCEndpointDefinition = getOperation(
	'deleteOrganizationVPCEndpoint',
);
export const deleteOrganizationVPCEndpoint: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteOrganizationVPCEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		deleteOrganizationVPCEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, deleteOrganizationVPCEndpointDefinition);
	return result;
};

const listProjectVPCEndpointsDefinition = getOperation(
	'listProjectVPCEndpoints',
);
export const listProjectVPCEndpoints: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listProjectVPCEndpointsDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		listProjectVPCEndpointsDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, listProjectVPCEndpointsDefinition);
	return result;
};

const assignProjectVPCEndpointDefinition = getOperation(
	'assignProjectVPCEndpoint',
);
export const assignProjectVPCEndpoint: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		assignProjectVPCEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		assignProjectVPCEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, assignProjectVPCEndpointDefinition);
	return result;
};

const deleteProjectVPCEndpointDefinition = getOperation(
	'deleteProjectVPCEndpoint',
);
export const deleteProjectVPCEndpoint: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteProjectVPCEndpointDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		deleteProjectVPCEndpointDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, deleteProjectVPCEndpointDefinition);
	return result;
};

export const VpcEndpoints = {
	listOrganizationVPCEndpointsAllRegions,
	listOrganizationVPCEndpoints,
	getOrganizationVPCEndpointDetails,
	assignOrganizationVPCEndpoint,
	deleteOrganizationVPCEndpoint,
	listProjectVPCEndpoints,
	assignProjectVPCEndpoint,
	deleteProjectVPCEndpoint,
} as const;
