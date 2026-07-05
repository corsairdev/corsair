import { digitalOceanRoutes } from './routes';
import type { DigitalOceanEndpoint } from './factory';
import { logDigitalOceanOperation, requestDigitalOceanOperation } from './factory';

function getRoute(name: string) {
	const route = digitalOceanRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[digital_ocean] missing route: ${name}`);
	}
	return route;
}

const createNewSshKeyRoute = getRoute('createNewSshKey');
export const createNewSshKey: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createNewSshKeyRoute);
	await logDigitalOceanOperation(ctx, input, createNewSshKeyRoute);
	return result;
};

const deleteSshKeyRoute = getRoute('deleteSshKey');
export const deleteSshKey: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteSshKeyRoute);
	await logDigitalOceanOperation(ctx, input, deleteSshKeyRoute);
	return result;
};

const listAllSshKeysRoute = getRoute('listAllSshKeys');
export const listAllSshKeys: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllSshKeysRoute);
	await logDigitalOceanOperation(ctx, input, listAllSshKeysRoute);
	return result;
};

export const SshKeysEndpoints = {
	createNewSshKey,
	deleteSshKey,
	listAllSshKeys
} as const;
