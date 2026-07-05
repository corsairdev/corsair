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

const createNewDomainRecordRoute = getRoute('createNewDomainRecord');
export const createNewDomainRecord: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createNewDomainRecordRoute);
	await logDigitalOceanOperation(ctx, input, createNewDomainRecordRoute);
	return result;
};

const deleteDomainRecordRoute = getRoute('deleteDomainRecord');
export const deleteDomainRecord: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteDomainRecordRoute);
	await logDigitalOceanOperation(ctx, input, deleteDomainRecordRoute);
	return result;
};

const listDomainRecordsRoute = getRoute('listDomainRecords');
export const listDomainRecords: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listDomainRecordsRoute);
	await logDigitalOceanOperation(ctx, input, listDomainRecordsRoute);
	return result;
};

const retrieveDomainRecordRoute = getRoute('retrieveDomainRecord');
export const retrieveDomainRecord: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, retrieveDomainRecordRoute);
	await logDigitalOceanOperation(ctx, input, retrieveDomainRecordRoute);
	return result;
};

const updateDomainRecordRoute = getRoute('updateDomainRecord');
export const updateDomainRecord: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, updateDomainRecordRoute);
	await logDigitalOceanOperation(ctx, input, updateDomainRecordRoute);
	return result;
};

export const DomainRecordsEndpoints = {
	createNewDomainRecord,
	deleteDomainRecord,
	listDomainRecords,
	retrieveDomainRecord,
	updateDomainRecord
} as const;
