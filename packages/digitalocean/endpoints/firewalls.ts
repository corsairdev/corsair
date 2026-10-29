import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createNewFirewallRoute = getRoute('createNewFirewall');
export const createNewFirewall: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, createNewFirewallRoute);
};

const deleteFirewallRoute = getRoute('deleteFirewall');
export const deleteFirewall: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, deleteFirewallRoute);
};

const listAllFirewallsRoute = getRoute('listAllFirewalls');
export const listAllFirewalls: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, listAllFirewallsRoute);
};

export const FirewallsEndpoints = {
	createNewFirewall,
	deleteFirewall,
	listAllFirewalls,
} as const;
