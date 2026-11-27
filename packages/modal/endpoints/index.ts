import type { RequiredPluginEndpointMeta } from 'corsair/core';
import {
	createApp,
	getApp,
	getAppInfo,
	getAppSandboxStats,
	getAppStats,
	listApps,
	stopApp,
} from './apps';
import { callClassMethod, spawnClassMethod } from './classes';
import {
	clearDict,
	containsDictKey,
	createDict,
	deleteDict,
	dictItems,
	getDictValue,
	lenDict,
	listDicts,
	popDictValue,
	putDictValue,
	updateDict,
} from './dicts';
import {
	createEnvironment,
	deleteEnvironment,
	getDefaultEnvironment,
	getEnvironment,
	listEnvironments,
} from './environments';
import {
	listFiles,
	makeDirectory,
	readFile,
	removeFile,
	statFile,
	writeFile,
} from './files';
import {
	cancelFunctionCall,
	getFunctionCall,
	tailFunctionCallLogs,
} from './function-calls';
import {
	callFunction,
	exportFunctionMetrics,
	fetchFunctionLogs,
	getFunction,
	getFunctionCurrentStats,
	getFunctionInfo,
	getFunctionMetricsSchema,
	getFunctionStats,
	spawnFunction,
	tailFunctionLogs,
	updateFunctionAutoscaler,
} from './functions';
import {
	buildImage,
	deleteImage,
	getImage,
	getImageByName,
	publishImage,
} from './images';
import { modalOperations } from './operations';
import { getProxy } from './proxies';
import {
	clearQueue,
	createQueue,
	deleteQueue,
	getQueue,
	lenQueue,
	listQueues,
	peekQueue,
	putQueue,
} from './queues';
import {
	createSandboxConnectToken,
	createSandboxOp,
	execSandbox,
	fetchSandboxLogs,
	getSandbox,
	getSandboxByName,
	getSandboxExitSnapshot,
	getSandboxTags,
	getSandboxTunnels,
	listSandboxes,
	mountSandboxImage,
	pauseSandbox,
	reloadSandboxVolumes,
	restoreSandboxSnapshot,
	resumeSandbox,
	setSandboxName,
	setSandboxTags,
	snapshotSandboxDirectory,
	snapshotSandboxFilesystem,
	snapshotSandboxMemory,
	tailSandboxLogs,
	terminateSandbox,
	unmountSandboxImage,
	updateSandboxNetworkPolicy,
	waitSandbox,
	waitUntilReadySandbox,
} from './sandboxes';
import { createSecret, deleteSecret, getSecret, listSecrets } from './secrets';
import { createModalEndpoint, operationKey } from './shared';
import {
	createVolume,
	deleteVolume,
	getVolume,
	listVolumeFiles,
	listVolumes,
	removeVolumeFile,
} from './volumes';

export const modalEndpointsNested = {
	apps: {
		get: createModalEndpoint(getApp),
		create: createModalEndpoint(createApp),
		list: createModalEndpoint(listApps),
		info: createModalEndpoint(getAppInfo),
		stats: createModalEndpoint(getAppStats),
		sandboxStats: createModalEndpoint(getAppSandboxStats),
		stop: createModalEndpoint(stopApp),
	},
	environments: {
		get: createModalEndpoint(getEnvironment),
		getDefault: createModalEndpoint(getDefaultEnvironment),
		list: createModalEndpoint(listEnvironments),
		create: createModalEndpoint(createEnvironment),
		delete: createModalEndpoint(deleteEnvironment),
	},
	sandboxes: {
		create: createModalEndpoint(createSandboxOp),
		get: createModalEndpoint(getSandbox),
		getByName: createModalEndpoint(getSandboxByName),
		list: createModalEndpoint(listSandboxes),
		exec: createModalEndpoint(execSandbox),
		terminate: createModalEndpoint(terminateSandbox),
		wait: createModalEndpoint(waitSandbox),
		waitUntilReady: createModalEndpoint(waitUntilReadySandbox),
		tunnels: createModalEndpoint(getSandboxTunnels),
		getTags: createModalEndpoint(getSandboxTags),
		setTags: createModalEndpoint(setSandboxTags),
		setName: createModalEndpoint(setSandboxName),
		createConnectToken: createModalEndpoint(createSandboxConnectToken),
		snapshotFilesystem: createModalEndpoint(snapshotSandboxFilesystem),
		snapshotDirectory: createModalEndpoint(snapshotSandboxDirectory),
		snapshotMemory: createModalEndpoint(snapshotSandboxMemory),
		restoreSnapshot: createModalEndpoint(restoreSandboxSnapshot),
		getExitSnapshot: createModalEndpoint(getSandboxExitSnapshot),
		mountImage: createModalEndpoint(mountSandboxImage),
		unmountImage: createModalEndpoint(unmountSandboxImage),
		updateNetworkPolicy: createModalEndpoint(updateSandboxNetworkPolicy),
		reloadVolumes: createModalEndpoint(reloadSandboxVolumes),
		pause: createModalEndpoint(pauseSandbox),
		resume: createModalEndpoint(resumeSandbox),
		logs: createModalEndpoint(tailSandboxLogs),
		fetchLogs: createModalEndpoint(fetchSandboxLogs),
	},
	files: {
		read: createModalEndpoint(readFile),
		write: createModalEndpoint(writeFile),
		list: createModalEndpoint(listFiles),
		stat: createModalEndpoint(statFile),
		makeDirectory: createModalEndpoint(makeDirectory),
		remove: createModalEndpoint(removeFile),
	},
	images: {
		build: createModalEndpoint(buildImage),
		get: createModalEndpoint(getImage),
		getByName: createModalEndpoint(getImageByName),
		publish: createModalEndpoint(publishImage),
		delete: createModalEndpoint(deleteImage),
	},
	functions: {
		get: createModalEndpoint(getFunction),
		info: createModalEndpoint(getFunctionInfo),
		call: createModalEndpoint(callFunction),
		spawn: createModalEndpoint(spawnFunction),
		stats: createModalEndpoint(getFunctionStats),
		currentStats: createModalEndpoint(getFunctionCurrentStats),
		updateAutoscaler: createModalEndpoint(updateFunctionAutoscaler),
		logs: createModalEndpoint(tailFunctionLogs),
		fetchLogs: createModalEndpoint(fetchFunctionLogs),
		metrics: createModalEndpoint(exportFunctionMetrics),
		metricsSchema: createModalEndpoint(getFunctionMetricsSchema),
	},
	classes: {
		call: createModalEndpoint(callClassMethod),
		spawn: createModalEndpoint(spawnClassMethod),
	},
	functionCalls: {
		get: createModalEndpoint(getFunctionCall),
		cancel: createModalEndpoint(cancelFunctionCall),
		logs: createModalEndpoint(tailFunctionCallLogs),
	},
	volumes: {
		get: createModalEndpoint(getVolume),
		create: createModalEndpoint(createVolume),
		list: createModalEndpoint(listVolumes),
		delete: createModalEndpoint(deleteVolume),
		listFiles: createModalEndpoint(listVolumeFiles),
		removeFile: createModalEndpoint(removeVolumeFile),
	},
	secrets: {
		get: createModalEndpoint(getSecret),
		list: createModalEndpoint(listSecrets),
		create: createModalEndpoint(createSecret),
		delete: createModalEndpoint(deleteSecret),
	},
	queues: {
		create: createModalEndpoint(createQueue),
		list: createModalEndpoint(listQueues),
		delete: createModalEndpoint(deleteQueue),
		put: createModalEndpoint(putQueue),
		get: createModalEndpoint(getQueue),
		peek: createModalEndpoint(peekQueue),
		len: createModalEndpoint(lenQueue),
		clear: createModalEndpoint(clearQueue),
	},
	dicts: {
		create: createModalEndpoint(createDict),
		list: createModalEndpoint(listDicts),
		delete: createModalEndpoint(deleteDict),
		get: createModalEndpoint(getDictValue),
		put: createModalEndpoint(putDictValue),
		update: createModalEndpoint(updateDict),
		pop: createModalEndpoint(popDictValue),
		contains: createModalEndpoint(containsDictKey),
		len: createModalEndpoint(lenDict),
		items: createModalEndpoint(dictItems),
		clear: createModalEndpoint(clearDict),
	},
	proxies: {
		get: createModalEndpoint(getProxy),
	},
} as const;

// Object.fromEntries widens keys to string; the entries mirror
// modalEndpointsNested 1:1 (checked by endpoints.test.ts).
export const modalEndpointMeta = Object.fromEntries(
	modalOperations.map((operation) => [
		operationKey(operation),
		{
			riskLevel: operation.riskLevel,
			irreversible: operation.irreversible,
			description: operation.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof modalEndpointsNested>;

export const modalEndpointSchemas = Object.fromEntries(
	modalOperations.map((operation) => [
		operationKey(operation),
		{ input: operation.input, output: operation.output },
	]),
);

export { modalOperations } from './operations';
export * from './types';
