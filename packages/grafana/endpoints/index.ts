import { get as healthGet, getStatus } from './health';
import {
	getDistributorHaTracker,
	getIndexGateway,
	getOverridesExporter,
	getRuler,
	getTenants,
} from './ring';
import { createOtlp } from './logs';
import { queryPublic } from './dashboards';
import { postAcs, retrieveJwks } from './auth';

export const Health = { get: healthGet };
export const Status = { get: getStatus };
export const Ring = {
	getDistributorHaTracker,
	getIndexGateway,
	getOverridesExporter,
	getRuler,
};
export const StoreGateway = { getTenants };
export const Logs = { createOtlp };
export const Dashboards = { queryPublic };
export const Saml = { postAcs };
export const Jwks = { retrieve: retrieveJwks };

export * from './types';
