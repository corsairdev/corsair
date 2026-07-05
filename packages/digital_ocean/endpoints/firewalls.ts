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

const createNewFirewallRoute = getRoute('createNewFirewall');
export const createNewFirewall: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createNewFirewallRoute);
	await logDigitalOceanOperation(ctx, input, createNewFirewallRoute);
	return result;
};

const deleteFirewallRoute = getRoute('deleteFirewall');
export const deleteFirewall: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteFirewallRoute);
	await logDigitalOceanOperation(ctx, input, deleteFirewallRoute);
	return result;
};

const listAllFirewallsRoute = getRoute('listAllFirewalls');
export const listAllFirewalls: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllFirewallsRoute);
	await logDigitalOceanOperation(ctx, input, listAllFirewallsRoute);
	return result;
};

export const FirewallsEndpoints = {
	createNewFirewall,
	deleteFirewall,
	listAllFirewalls
} as const;
