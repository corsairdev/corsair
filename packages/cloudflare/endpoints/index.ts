import * as Dns from './dns';
import * as Rulesets from './rulesets';
import * as Workers from './workers';
import * as Zones from './zones';

export const ZonesEndpoints = {
	list: Zones.list,
	get: Zones.get,
	create: Zones.create,
	edit: Zones.edit,
	delete: Zones.deleteZone,
};

export const DNSEndpoints = {
	list: Dns.list,
	get: Dns.get,
	create: Dns.create,
	edit: Dns.edit,
	delete: Dns.deleteDns,
};

export const WorkersEndpoints = {
	list: Workers.list,
	get: Workers.get,
	upload: Workers.upload,
	delete: Workers.deleteWorker,
};

export const WorkerRoutesEndpoints = {
	list: Workers.routesList,
	get: Workers.routesGet,
	create: Workers.routesCreate,
	edit: Workers.routesEdit,
	delete: Workers.routesDelete,
};

export const RulesetsEndpoints = {
	list: Rulesets.list,
	get: Rulesets.get,
	create: Rulesets.create,
	update: Rulesets.update,
	delete: Rulesets.deleteRuleset,
};

export * from './types';
