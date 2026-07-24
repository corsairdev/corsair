import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createNewDomainRoute = getRoute('createNewDomain');
export const createNewDomain: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, createNewDomainRoute);
};

const deleteDomainRoute = getRoute('deleteDomain');
export const deleteDomain: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, deleteDomainRoute);
};

const listAllDomainsRoute = getRoute('listAllDomains');
export const listAllDomains: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, listAllDomainsRoute);
};

const retrieveDomainRoute = getRoute('retrieveDomain');
export const retrieveDomain: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, retrieveDomainRoute);
};

export const DomainsEndpoints = {
	createNewDomain,
	deleteDomain,
	listAllDomains,
	retrieveDomain,
} as const;
