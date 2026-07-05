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

const createNewLoadBalancerRoute = getRoute('createNewLoadBalancer');
export const createNewLoadBalancer: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createNewLoadBalancerRoute);
	await logDigitalOceanOperation(ctx, input, createNewLoadBalancerRoute);
	return result;
};

const deleteLoadBalancerRoute = getRoute('deleteLoadBalancer');
export const deleteLoadBalancer: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteLoadBalancerRoute);
	await logDigitalOceanOperation(ctx, input, deleteLoadBalancerRoute);
	return result;
};

const listAllLoadBalancersRoute = getRoute('listAllLoadBalancers');
export const listAllLoadBalancers: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllLoadBalancersRoute);
	await logDigitalOceanOperation(ctx, input, listAllLoadBalancersRoute);
	return result;
};

export const LoadBalancersEndpoints = {
	createNewLoadBalancer,
	deleteLoadBalancer,
	listAllLoadBalancers
} as const;
