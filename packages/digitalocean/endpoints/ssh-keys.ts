import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createNewSshKeyRoute = getRoute('createNewSshKey');
export const createNewSshKey: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, createNewSshKeyRoute);
};

const deleteSshKeyRoute = getRoute('deleteSshKey');
export const deleteSshKey: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, deleteSshKeyRoute);
};

const listAllSshKeysRoute = getRoute('listAllSshKeys');
export const listAllSshKeys: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, listAllSshKeysRoute);
};

export const SshKeysEndpoints = {
	createNewSshKey,
	deleteSshKey,
	listAllSshKeys,
} as const;
