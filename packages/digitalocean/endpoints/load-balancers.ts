import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createNewLoadBalancerRoute = getRoute('createNewLoadBalancer');
export const createNewLoadBalancer: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, createNewLoadBalancerRoute);
};

const deleteLoadBalancerRoute = getRoute('deleteLoadBalancer');
export const deleteLoadBalancer: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, deleteLoadBalancerRoute);
};

const listAllLoadBalancersRoute = getRoute('listAllLoadBalancers');
export const listAllLoadBalancers: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, listAllLoadBalancersRoute);
};

export const LoadBalancersEndpoints = {
	createNewLoadBalancer,
	deleteLoadBalancer,
	listAllLoadBalancers,
} as const;
