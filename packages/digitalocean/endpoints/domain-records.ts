import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createNewDomainRecordRoute = getRoute('createNewDomainRecord');
export const createNewDomainRecord: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, createNewDomainRecordRoute);
};

const deleteDomainRecordRoute = getRoute('deleteDomainRecord');
export const deleteDomainRecord: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, deleteDomainRecordRoute);
};

const listDomainRecordsRoute = getRoute('listDomainRecords');
export const listDomainRecords: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, listDomainRecordsRoute);
};

const retrieveDomainRecordRoute = getRoute('retrieveDomainRecord');
export const retrieveDomainRecord: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, retrieveDomainRecordRoute);
};

const updateDomainRecordRoute = getRoute('updateDomainRecord');
export const updateDomainRecord: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, updateDomainRecordRoute);
};

export const DomainRecordsEndpoints = {
	createNewDomainRecord,
	deleteDomainRecord,
	listDomainRecords,
	retrieveDomainRecord,
	updateDomainRecord,
} as const;
