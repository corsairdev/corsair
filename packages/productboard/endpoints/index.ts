import {
	createProductboardEndpoint,
	ProductboardOperations,
} from './operations';

const endpoint = <Name extends keyof typeof ProductboardOperations>(
	name: Name,
) => createProductboardEndpoint(ProductboardOperations[name]);

export const Notes = {
	list: endpoint('notes.list'),
	search: endpoint('notes.search'),
	create: endpoint('notes.create'),
	get: endpoint('notes.get'),
	update: endpoint('notes.update'),
	delete: endpoint('notes.delete'),
	configurations: {
		list: endpoint('notes.configurations.list'),
		get: endpoint('notes.configurations.get'),
	},
	relationships: {
		list: endpoint('notes.relationships.list'),
		create: endpoint('notes.relationships.create'),
		setCustomer: endpoint('notes.relationships.setCustomer'),
		delete: endpoint('notes.relationships.delete'),
	},
} as const;

export const Entities = {
	list: endpoint('entities.list'),
	search: endpoint('entities.search'),
	create: endpoint('entities.create'),
	get: endpoint('entities.get'),
	update: endpoint('entities.update'),
	delete: endpoint('entities.delete'),
	configurations: {
		list: endpoint('entities.configurations.list'),
		get: endpoint('entities.configurations.get'),
	},
	relationships: {
		list: endpoint('entities.relationships.list'),
		create: endpoint('entities.relationships.create'),
		setParent: endpoint('entities.relationships.setParent'),
		delete: endpoint('entities.relationships.delete'),
	},
	fieldValues: {
		list: endpoint('entities.fieldValues.list'),
		create: endpoint('entities.fieldValues.create'),
		update: endpoint('entities.fieldValues.update'),
		delete: endpoint('entities.fieldValues.delete'),
	},
	customerScore: endpoint('entities.customerScore'),
} as const;

export const Analytics = {
	memberActivities: endpoint('analytics.memberActivities'),
} as const;

export const Members = {
	list: endpoint('members.list'),
	search: endpoint('members.search'),
	get: endpoint('members.get'),
} as const;

export const Teams = {
	list: endpoint('teams.list'),
	search: endpoint('teams.search'),
	create: endpoint('teams.create'),
	get: endpoint('teams.get'),
	update: endpoint('teams.update'),
	delete: endpoint('teams.delete'),
	members: endpoint('teams.members'),
} as const;

export const JiraIntegrations = {
	list: endpoint('jiraIntegrations.list'),
	get: endpoint('jiraIntegrations.get'),
	connections: endpoint('jiraIntegrations.connections'),
	connection: endpoint('jiraIntegrations.connection'),
} as const;

export const PluginIntegrations = {
	list: endpoint('pluginIntegrations.list'),
	create: endpoint('pluginIntegrations.create'),
	get: endpoint('pluginIntegrations.get'),
	update: endpoint('pluginIntegrations.update'),
	delete: endpoint('pluginIntegrations.delete'),
	connections: {
		list: endpoint('pluginIntegrations.connections.list'),
		search: endpoint('pluginIntegrations.connections.search'),
		get: endpoint('pluginIntegrations.connections.get'),
		update: endpoint('pluginIntegrations.connections.update'),
		delete: endpoint('pluginIntegrations.connections.delete'),
	},
} as const;

export const Webhooks = {
	list: endpoint('webhooks.list'),
	create: endpoint('webhooks.create'),
	get: endpoint('webhooks.get'),
	delete: endpoint('webhooks.delete'),
} as const;

export * from './operations';
export * from './types';
