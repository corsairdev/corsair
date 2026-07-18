import { usersOperations } from '../operations/users';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof usersOperations)[number]['name']) {
	const operation = usersOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const getCurrentUserInfoDefinition = getOperation('getCurrentUserInfo');
export const getCurrentUserInfo: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getCurrentUserInfoDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getCurrentUserInfoDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getCurrentUserInfoDefinition);
	return result;
};

const getCurrentUserOrganizationsDefinition = getOperation(
	'getCurrentUserOrganizations',
);
export const getCurrentUserOrganizations: NeonEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getCurrentUserOrganizationsDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getCurrentUserOrganizationsDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getCurrentUserOrganizationsDefinition);
	return result;
};

export const UsersEndpoints = {
	getCurrentUserInfo,
	getCurrentUserOrganizations,
} as const;
