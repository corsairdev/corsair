import { postAcs, retrieveJwks } from './auth';
import { queryPublic } from './dashboards';
import { getStatus, get as healthGet } from './health';
import { createOtlp } from './logs';
import {
	getDistributorHaTracker,
	getIndexGateway,
	getOverridesExporter,
	getRuler,
	getTenants,
} from './ring';

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
