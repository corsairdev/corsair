import * as Operations from './operations';

export const ZonesEndpoints = { list: Operations.zonesList, get: Operations.zonesGet, create: Operations.zonesCreate, edit: Operations.zonesEdit, delete: Operations.zonesDelete };
export const DNSEndpoints = { list: Operations.dnsList, get: Operations.dnsGet, create: Operations.dnsCreate, edit: Operations.dnsEdit, delete: Operations.dnsDelete };
export const WorkersEndpoints = { list: Operations.workersList, get: Operations.workersGet, upload: Operations.workersUpload, delete: Operations.workersDelete };
export const WorkerRoutesEndpoints = { list: Operations.workerRoutesList, get: Operations.workerRoutesGet, create: Operations.workerRoutesCreate, edit: Operations.workerRoutesEdit, delete: Operations.workerRoutesDelete };
export const RulesetsEndpoints = { list: Operations.rulesetsList, get: Operations.rulesetsGet, create: Operations.rulesetsCreate, update: Operations.rulesetsUpdate, delete: Operations.rulesetsDelete };

export * from './types';
