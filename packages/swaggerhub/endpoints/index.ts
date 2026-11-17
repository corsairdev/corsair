import * as ApiSettings from './api-settings';
import * as Apis from './apis';
import * as Comments from './comments';
import * as Domains from './domains';
import * as Integrations from './integrations';
import * as Projects from './projects';
import * as Specs from './specs';
import * as Templates from './templates';

export const SpecsEndpoints = {
	list: Specs.list,
	validate: Specs.validate,
};

export const ApisEndpoints = {
	list: Apis.list,
	listVersions: Apis.listVersions,
	getDefinition: Apis.getDefinition,
	save: Apis.save,
	delete: Apis.remove,
	deleteVersion: Apis.removeVersion,
	cloneVersion: Apis.cloneVersion,
	forkVersion: Apis.forkVersion,
	compare: Apis.compare,
	getCapabilities: Apis.getCapabilities,
	getDefaultVersion: Apis.getDefaultVersion,
	setDefaultVersion: Apis.setDefaultVersion,
	rename: Apis.rename,
	getNotifications: Apis.getNotifications,
	setNotifications: Apis.setNotifications,
	disableNotifications: Apis.disableNotifications,
};

export const ApiSettingsEndpoints = {
	getLifecycle: ApiSettings.getLifecycle,
	setLifecycle: ApiSettings.setLifecycle,
	getVisibility: ApiSettings.getVisibility,
	setVisibility: ApiSettings.setVisibility,
};

export const CommentsEndpoints = {
	list: Comments.list,
	create: Comments.create,
	update: Comments.update,
	delete: Comments.remove,
	reply: Comments.reply,
};

export const DomainsEndpoints = {
	list: Domains.list,
	getVersions: Domains.getVersions,
	getDefinition: Domains.getDefinition,
	save: Domains.save,
	delete: Domains.remove,
	deleteVersion: Domains.removeVersion,
};

export const TemplatesEndpoints = {
	list: Templates.list,
	get: Templates.get,
	save: Templates.save,
	delete: Templates.remove,
};

export const ProjectsEndpoints = {
	list: Projects.list,
	get: Projects.get,
	create: Projects.create,
	update: Projects.update,
	delete: Projects.remove,
};

export const IntegrationsEndpoints = {
	list: Integrations.list,
	execute: Integrations.execute,
};

export * from './types';
