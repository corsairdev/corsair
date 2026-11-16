import { e2bOperationRoutes } from './routes';
import { createE2bEndpoint } from './shared';

export const Sandboxes = {
	create: createE2bEndpoint(e2bOperationRoutes['sandboxes.create']),
	list: createE2bEndpoint(e2bOperationRoutes['sandboxes.list']),
	listMetrics: createE2bEndpoint(e2bOperationRoutes['sandboxes.listMetrics']),
	getLogs: createE2bEndpoint(e2bOperationRoutes['sandboxes.getLogs']),
	get: createE2bEndpoint(e2bOperationRoutes['sandboxes.get']),
	kill: createE2bEndpoint(e2bOperationRoutes['sandboxes.kill']),
	getMetrics: createE2bEndpoint(e2bOperationRoutes['sandboxes.getMetrics']),
	pause: createE2bEndpoint(e2bOperationRoutes['sandboxes.pause']),
	fork: createE2bEndpoint(e2bOperationRoutes['sandboxes.fork']),
	connect: createE2bEndpoint(e2bOperationRoutes['sandboxes.connect']),
	setTimeout: createE2bEndpoint(e2bOperationRoutes['sandboxes.setTimeout']),
	updateNetwork: createE2bEndpoint(
		e2bOperationRoutes['sandboxes.updateNetwork'],
	),
	refresh: createE2bEndpoint(e2bOperationRoutes['sandboxes.refresh']),
	createSnapshot: createE2bEndpoint(
		e2bOperationRoutes['sandboxes.createSnapshot'],
	),
	listSnapshots: createE2bEndpoint(
		e2bOperationRoutes['sandboxes.listSnapshots'],
	),
} as const;

export const Templates = {
	create: createE2bEndpoint(e2bOperationRoutes['templates.create']),
	list: createE2bEndpoint(e2bOperationRoutes['templates.list']),
	getBuildUploadLink: createE2bEndpoint(
		e2bOperationRoutes['templates.getBuildUploadLink'],
	),
	listDefault: createE2bEndpoint(e2bOperationRoutes['templates.listDefault']),
	get: createE2bEndpoint(e2bOperationRoutes['templates.get']),
	delete: createE2bEndpoint(e2bOperationRoutes['templates.delete']),
	startBuild: createE2bEndpoint(e2bOperationRoutes['templates.startBuild']),
	update: createE2bEndpoint(e2bOperationRoutes['templates.update']),
	getBuildStatus: createE2bEndpoint(
		e2bOperationRoutes['templates.getBuildStatus'],
	),
	getBuildLogs: createE2bEndpoint(e2bOperationRoutes['templates.getBuildLogs']),
	getByAlias: createE2bEndpoint(e2bOperationRoutes['templates.getByAlias']),
} as const;

export const Tags = {
	assign: createE2bEndpoint(e2bOperationRoutes['tags.assign']),
	delete: createE2bEndpoint(e2bOperationRoutes['tags.delete']),
	list: createE2bEndpoint(e2bOperationRoutes['tags.list']),
	listGroups: createE2bEndpoint(e2bOperationRoutes['tags.listGroups']),
	count: createE2bEndpoint(e2bOperationRoutes['tags.count']),
	exists: createE2bEndpoint(e2bOperationRoutes['tags.exists']),
	listAssignments: createE2bEndpoint(
		e2bOperationRoutes['tags.listAssignments'],
	),
} as const;

export const Volumes = {
	list: createE2bEndpoint(e2bOperationRoutes['volumes.list']),
	create: createE2bEndpoint(e2bOperationRoutes['volumes.create']),
	get: createE2bEndpoint(e2bOperationRoutes['volumes.get']),
	delete: createE2bEndpoint(e2bOperationRoutes['volumes.delete']),
} as const;

export const Envd = {
	health: createE2bEndpoint(e2bOperationRoutes['envd.health']),
	metrics: createE2bEndpoint(e2bOperationRoutes['envd.metrics']),
	getEnvironmentVariables: createE2bEndpoint(
		e2bOperationRoutes['envd.getEnvironmentVariables'],
	),
} as const;

export const Filesystem = {
	createWatcher: createE2bEndpoint(
		e2bOperationRoutes['filesystem.createWatcher'],
	),
	getWatcherEvents: createE2bEndpoint(
		e2bOperationRoutes['filesystem.getWatcherEvents'],
	),
	listDir: createE2bEndpoint(e2bOperationRoutes['filesystem.listDir']),
	createDir: createE2bEndpoint(e2bOperationRoutes['filesystem.createDir']),
	move: createE2bEndpoint(e2bOperationRoutes['filesystem.move']),
	remove: createE2bEndpoint(e2bOperationRoutes['filesystem.remove']),
	removeWatcher: createE2bEndpoint(
		e2bOperationRoutes['filesystem.removeWatcher'],
	),
	stat: createE2bEndpoint(e2bOperationRoutes['filesystem.stat']),
} as const;

export const Process = {
	closeStdin: createE2bEndpoint(e2bOperationRoutes['process.closeStdin']),
	list: createE2bEndpoint(e2bOperationRoutes['process.list']),
	sendInput: createE2bEndpoint(e2bOperationRoutes['process.sendInput']),
	sendSignal: createE2bEndpoint(e2bOperationRoutes['process.sendSignal']),
	update: createE2bEndpoint(e2bOperationRoutes['process.update']),
} as const;

export const Teams = {
	getMetrics: createE2bEndpoint(e2bOperationRoutes['teams.getMetrics']),
	getMaxMetrics: createE2bEndpoint(e2bOperationRoutes['teams.getMaxMetrics']),
} as const;

export const Secrets = {
	list: createE2bEndpoint(e2bOperationRoutes['secrets.list']),
	create: createE2bEndpoint(e2bOperationRoutes['secrets.create']),
	get: createE2bEndpoint(e2bOperationRoutes['secrets.get']),
	update: createE2bEndpoint(e2bOperationRoutes['secrets.update']),
	delete: createE2bEndpoint(e2bOperationRoutes['secrets.delete']),
} as const;

export const Events = {
	listBySandbox: createE2bEndpoint(e2bOperationRoutes['events.listBySandbox']),
	list: createE2bEndpoint(e2bOperationRoutes['events.list']),
} as const;

export * from './types';
