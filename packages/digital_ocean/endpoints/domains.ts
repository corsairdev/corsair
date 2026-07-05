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

const createNewDomainRoute = getRoute('createNewDomain');
export const createNewDomain: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createNewDomainRoute);
	await logDigitalOceanOperation(ctx, input, createNewDomainRoute);
	return result;
};

const deleteDomainRoute = getRoute('deleteDomain');
export const deleteDomain: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteDomainRoute);
	await logDigitalOceanOperation(ctx, input, deleteDomainRoute);
	return result;
};

const listAllDomainsRoute = getRoute('listAllDomains');
export const listAllDomains: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllDomainsRoute);
	await logDigitalOceanOperation(ctx, input, listAllDomainsRoute);
	return result;
};

const retrieveDomainRoute = getRoute('retrieveDomain');
export const retrieveDomain: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, retrieveDomainRoute);
	await logDigitalOceanOperation(ctx, input, retrieveDomainRoute);
	return result;
};

export const DomainsEndpoints = {
	createNewDomain,
	deleteDomain,
	listAllDomains,
	retrieveDomain
} as const;
