import * as Access from './access';
import * as Projects from './projects';
import * as Search from './search';
import * as Videos from './videos';

export const VideosEndpoints = {
	list: Videos.list,
	create: Videos.create,
	updateSource: Videos.updateSource,
	delete: Videos.remove,
	listTop: Videos.listTop,
	metrics: Videos.metrics,
	views: Videos.views,
	updateSettings: Videos.updateSettings,
};

export const ProjectsEndpoints = {
	list: Projects.list,
	create: Projects.create,
};

export const DomainsEndpoints = {
	list: Access.listDomains,
	add: Access.addDomain,
};

export const StudentsEndpoints = {
	create: Access.createStudent,
};

export const AccessEndpoints = {
	get: Access.getAccess,
	update: Access.updateAccess,
	updateCode: Access.updateAccessCode,
};

export const SearchEndpoints = {
	search: Search.search,
};

export const AssetsEndpoints = {
	upload: Search.uploadAsset,
};

export * from './types';
