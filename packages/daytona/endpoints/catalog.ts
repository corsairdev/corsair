// Generated with endpoints/operation-types.ts from Daytona's OpenAPI spec:
// one entry per operation in daytona-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { daytonaSchemaEntry } from './openapi-schema';
import { createDaytonaOperation as op } from './operations';

export const daytonaEndpointsNested = {
	analytics: {
		telemetry: {
			getTrace: op('analytics.telemetry.getTrace'),
			logs: op('analytics.telemetry.logs'),
			metrics: op('analytics.telemetry.metrics'),
			traces: op('analytics.telemetry.traces'),
		},
		usage: {
			aggregated: op('analytics.usage.aggregated'),
			bySandbox: op('analytics.usage.bySandbox'),
			chart: op('analytics.usage.chart'),
			sandbox: op('analytics.usage.sandbox'),
		},
	},
	apiKeys: {
		create: op('apiKeys.create'),
		delete: op('apiKeys.delete'),
		getCurrent: op('apiKeys.getCurrent'),
		list: op('apiKeys.list'),
	},
	audit: {
		getOrganizationLogs: op('audit.getOrganizationLogs'),
		getScenarios: op('audit.getScenarios'),
	},
	config: {
		get: op('config.get'),
	},
	dockerRegistries: {
		create: op('dockerRegistries.create'),
		delete: op('dockerRegistries.delete'),
		get: op('dockerRegistries.get'),
		getTransientPushAccess: op('dockerRegistries.getTransientPushAccess'),
		list: op('dockerRegistries.list'),
		update: op('dockerRegistries.update'),
	},
	health: {
		live: op('health.live'),
		ready: op('health.ready'),
	},
	objectStorage: {
		getPushAccess: op('objectStorage.getPushAccess'),
	},
	organizations: {
		createRegion: op('organizations.createRegion'),
		deleteRegion: op('organizations.deleteRegion'),
		getGpuCapacity: op('organizations.getGpuCapacity'),
		getOtelConfig: op('organizations.getOtelConfig'),
		getRegionById: op('organizations.getRegionById'),
		getUsageOverview: op('organizations.getUsageOverview'),
		listAvailableRegions: op('organizations.listAvailableRegions'),
		listAvailableSandboxClasses: op(
			'organizations.listAvailableSandboxClasses',
		),
		listMembers: op('organizations.listMembers'),
		regenerateProxyApiKey: op('organizations.regenerateProxyApiKey'),
		regenerateSnapshotManagerCredentials: op(
			'organizations.regenerateSnapshotManagerCredentials',
		),
		regenerateSshGatewayApiKey: op('organizations.regenerateSshGatewayApiKey'),
		updateRegion: op('organizations.updateRegion'),
	},
	regions: {
		listShared: op('regions.listShared'),
	},
	runners: {
		create: op('runners.create'),
		delete: op('runners.delete'),
		getById: op('runners.getById'),
		getFullById: op('runners.getFullById'),
		list: op('runners.list'),
		updateDraining: op('runners.updateDraining'),
		updateScheduling: op('runners.updateScheduling'),
	},
	sandboxes: {
		addNodes: op('sandboxes.addNodes'),
		archive: op('sandboxes.archive'),
		create: op('sandboxes.create'),
		createSnapshot: op('sandboxes.createSnapshot'),
		createSshAccess: op('sandboxes.createSshAccess'),
		delete: op('sandboxes.delete'),
		expireSignedPortPreviewUrl: op('sandboxes.expireSignedPortPreviewUrl'),
		fork: op('sandboxes.fork'),
		get: op('sandboxes.get'),
		getAncestors: op('sandboxes.getAncestors'),
		getBuildLogsUrl: op('sandboxes.getBuildLogsUrl'),
		getForks: op('sandboxes.getForks'),
		getGangMembershipOperation: op('sandboxes.getGangMembershipOperation'),
		getLogs: op('sandboxes.getLogs'),
		getMetrics: op('sandboxes.getMetrics'),
		getParent: op('sandboxes.getParent'),
		getPortPreviewUrl: op('sandboxes.getPortPreviewUrl'),
		getSignedPortPreviewUrl: op('sandboxes.getSignedPortPreviewUrl'),
		getSigningKey: op('sandboxes.getSigningKey'),
		getToolboxProxyUrl: op('sandboxes.getToolboxProxyUrl'),
		getTraceSpans: op('sandboxes.getTraceSpans'),
		getTraces: op('sandboxes.getTraces'),
		list: op('sandboxes.list'),
		pause: op('sandboxes.pause'),
		recover: op('sandboxes.recover'),
		removeNodes: op('sandboxes.removeNodes'),
		replaceLabels: op('sandboxes.replaceLabels'),
		replaceNode: op('sandboxes.replaceNode'),
		resize: op('sandboxes.resize'),
		revokeSshAccess: op('sandboxes.revokeSshAccess'),
		rotateSigningKey: op('sandboxes.rotateSigningKey'),
		setAutoArchiveInterval: op('sandboxes.setAutoArchiveInterval'),
		setAutoDeleteInterval: op('sandboxes.setAutoDeleteInterval'),
		setAutoPauseInterval: op('sandboxes.setAutoPauseInterval'),
		setAutostopInterval: op('sandboxes.setAutostopInterval'),
		setTtl: op('sandboxes.setTtl'),
		start: op('sandboxes.start'),
		stop: op('sandboxes.stop'),
		updateLastActivity: op('sandboxes.updateLastActivity'),
		updateNetworkSettings: op('sandboxes.updateNetworkSettings'),
		updatePublicStatus: op('sandboxes.updatePublicStatus'),
		updateSecrets: op('sandboxes.updateSecrets'),
	},
	secrets: {
		create: op('secrets.create'),
		delete: op('secrets.delete'),
		get: op('secrets.get'),
		listPaginated: op('secrets.listPaginated'),
		update: op('secrets.update'),
	},
	snapshots: {
		activate: op('snapshots.activate'),
		create: op('snapshots.create'),
		deactivate: op('snapshots.deactivate'),
		get: op('snapshots.get'),
		getAll: op('snapshots.getAll'),
		getBuildLogsUrl: op('snapshots.getBuildLogsUrl'),
		remove: op('snapshots.remove'),
	},
	toolbox: {
		computerUse: {
			click: op('toolbox.computerUse.click'),
			deleteRecording: op('toolbox.computerUse.deleteRecording'),
			downloadRecording: op('toolbox.computerUse.downloadRecording'),
			drag: op('toolbox.computerUse.drag'),
			findAccessibilityNodes: op('toolbox.computerUse.findAccessibilityNodes'),
			focusAccessibilityNode: op('toolbox.computerUse.focusAccessibilityNode'),
			getAccessibilityTree: op('toolbox.computerUse.getAccessibilityTree'),
			getComputerUseStatus: op('toolbox.computerUse.getComputerUseStatus'),
			getComputerUseSystemStatus: op(
				'toolbox.computerUse.getComputerUseSystemStatus',
			),
			getDisplayInfo: op('toolbox.computerUse.getDisplayInfo'),
			getMousePosition: op('toolbox.computerUse.getMousePosition'),
			getProcessErrors: op('toolbox.computerUse.getProcessErrors'),
			getProcessLogs: op('toolbox.computerUse.getProcessLogs'),
			getProcessStatus: op('toolbox.computerUse.getProcessStatus'),
			getRecording: op('toolbox.computerUse.getRecording'),
			getWindows: op('toolbox.computerUse.getWindows'),
			invokeAccessibilityNode: op(
				'toolbox.computerUse.invokeAccessibilityNode',
			),
			keyDown: op('toolbox.computerUse.keyDown'),
			keyUp: op('toolbox.computerUse.keyUp'),
			listRecordings: op('toolbox.computerUse.listRecordings'),
			mouseDown: op('toolbox.computerUse.mouseDown'),
			mouseUp: op('toolbox.computerUse.mouseUp'),
			moveMouse: op('toolbox.computerUse.moveMouse'),
			pressHotkey: op('toolbox.computerUse.pressHotkey'),
			pressKey: op('toolbox.computerUse.pressKey'),
			restartProcess: op('toolbox.computerUse.restartProcess'),
			scroll: op('toolbox.computerUse.scroll'),
			setAccessibilityNodeValue: op(
				'toolbox.computerUse.setAccessibilityNodeValue',
			),
			startComputerUse: op('toolbox.computerUse.startComputerUse'),
			startRecording: op('toolbox.computerUse.startRecording'),
			stopComputerUse: op('toolbox.computerUse.stopComputerUse'),
			stopRecording: op('toolbox.computerUse.stopRecording'),
			takeCompressedRegionScreenshot: op(
				'toolbox.computerUse.takeCompressedRegionScreenshot',
			),
			takeCompressedScreenshot: op(
				'toolbox.computerUse.takeCompressedScreenshot',
			),
			takeRegionScreenshot: op('toolbox.computerUse.takeRegionScreenshot'),
			takeScreenshot: op('toolbox.computerUse.takeScreenshot'),
			typeText: op('toolbox.computerUse.typeText'),
		},
		files: {
			bulkDownload: op('toolbox.files.bulkDownload'),
			bulkUpload: op('toolbox.files.bulkUpload'),
			createFolder: op('toolbox.files.createFolder'),
			delete: op('toolbox.files.delete'),
			download: op('toolbox.files.download'),
			findIn: op('toolbox.files.findIn'),
			getInfo: op('toolbox.files.getInfo'),
			list: op('toolbox.files.list'),
			move: op('toolbox.files.move'),
			replaceIn: op('toolbox.files.replaceIn'),
			search: op('toolbox.files.search'),
			setPermissions: op('toolbox.files.setPermissions'),
			upload: op('toolbox.files.upload'),
		},
		git: {
			addFiles: op('toolbox.git.addFiles'),
			addRemote: op('toolbox.git.addRemote'),
			authenticate: op('toolbox.git.authenticate'),
			checkoutBranch: op('toolbox.git.checkoutBranch'),
			cloneRepository: op('toolbox.git.cloneRepository'),
			commitChanges: op('toolbox.git.commitChanges'),
			configureUser: op('toolbox.git.configureUser'),
			createBranch: op('toolbox.git.createBranch'),
			deleteBranch: op('toolbox.git.deleteBranch'),
			getCommitHistory: op('toolbox.git.getCommitHistory'),
			getConfig: op('toolbox.git.getConfig'),
			getStatus: op('toolbox.git.getStatus'),
			initRepository: op('toolbox.git.initRepository'),
			listBranches: op('toolbox.git.listBranches'),
			listRemotes: op('toolbox.git.listRemotes'),
			pullChanges: op('toolbox.git.pullChanges'),
			pushChanges: op('toolbox.git.pushChanges'),
			resetChanges: op('toolbox.git.resetChanges'),
			restoreFiles: op('toolbox.git.restoreFiles'),
			setConfig: op('toolbox.git.setConfig'),
		},
		info: {
			getUserHomeDir: op('toolbox.info.getUserHomeDir'),
			getVersion: op('toolbox.info.getVersion'),
			getWorkDir: op('toolbox.info.getWorkDir'),
		},
		interpreter: {
			createInterpreterContext: op(
				'toolbox.interpreter.createInterpreterContext',
			),
			deleteInterpreterContext: op(
				'toolbox.interpreter.deleteInterpreterContext',
			),
			executeInterpreterCode: op('toolbox.interpreter.executeInterpreterCode'),
			listInterpreterContexts: op(
				'toolbox.interpreter.listInterpreterContexts',
			),
		},
		lsp: {
			completions: op('toolbox.lsp.completions'),
			didClose: op('toolbox.lsp.didClose'),
			didOpen: op('toolbox.lsp.didOpen'),
			documentSymbols: op('toolbox.lsp.documentSymbols'),
			start: op('toolbox.lsp.start'),
			stop: op('toolbox.lsp.stop'),
			workspaceSymbols: op('toolbox.lsp.workspaceSymbols'),
		},
		ports: {
			get: op('toolbox.ports.get'),
			isInUse: op('toolbox.ports.isInUse'),
		},
		process: {
			codeRun: op('toolbox.process.codeRun'),
			createPtySession: op('toolbox.process.createPtySession'),
			createSession: op('toolbox.process.createSession'),
			deletePtySession: op('toolbox.process.deletePtySession'),
			deleteSession: op('toolbox.process.deleteSession'),
			executeCommand: op('toolbox.process.executeCommand'),
			getEntrypointLogs: op('toolbox.process.getEntrypointLogs'),
			getEntrypointSession: op('toolbox.process.getEntrypointSession'),
			getPtySession: op('toolbox.process.getPtySession'),
			getSession: op('toolbox.process.getSession'),
			getSessionCommand: op('toolbox.process.getSessionCommand'),
			getSessionCommandLogs: op('toolbox.process.getSessionCommandLogs'),
			listPtySessions: op('toolbox.process.listPtySessions'),
			listSessions: op('toolbox.process.listSessions'),
			resizePtySession: op('toolbox.process.resizePtySession'),
			sendInput: op('toolbox.process.sendInput'),
			sessionExecuteCommand: op('toolbox.process.sessionExecuteCommand'),
		},
		system: {
			getSystemMetrics: op('toolbox.system.getSystemMetrics'),
		},
	},
	volumes: {
		create: op('volumes.create'),
		delete: op('volumes.delete'),
		get: op('volumes.get'),
		getByName: op('volumes.getByName'),
		list: op('volumes.list'),
	},
	warmPools: {
		create: op('warmPools.create'),
		delete: op('warmPools.delete'),
		list: op('warmPools.list'),
		update: op('warmPools.update'),
	},
	webhooks: {
		getAppPortalAccess: op('webhooks.getAppPortalAccess'),
		getInitializationStatus: op('webhooks.getInitializationStatus'),
		initialize: op('webhooks.initialize'),
	},
} as const;

export const daytonaEndpointSchemas = {
	'analytics.telemetry.getTrace': daytonaSchemaEntry(
		'analytics.telemetry.getTrace',
	),
	'analytics.telemetry.logs': daytonaSchemaEntry('analytics.telemetry.logs'),
	'analytics.telemetry.metrics': daytonaSchemaEntry(
		'analytics.telemetry.metrics',
	),
	'analytics.telemetry.traces': daytonaSchemaEntry(
		'analytics.telemetry.traces',
	),
	'analytics.usage.aggregated': daytonaSchemaEntry(
		'analytics.usage.aggregated',
	),
	'analytics.usage.bySandbox': daytonaSchemaEntry('analytics.usage.bySandbox'),
	'analytics.usage.chart': daytonaSchemaEntry('analytics.usage.chart'),
	'analytics.usage.sandbox': daytonaSchemaEntry('analytics.usage.sandbox'),
	'apiKeys.create': daytonaSchemaEntry('apiKeys.create'),
	'apiKeys.delete': daytonaSchemaEntry('apiKeys.delete'),
	'apiKeys.getCurrent': daytonaSchemaEntry('apiKeys.getCurrent'),
	'apiKeys.list': daytonaSchemaEntry('apiKeys.list'),
	'audit.getOrganizationLogs': daytonaSchemaEntry('audit.getOrganizationLogs'),
	'audit.getScenarios': daytonaSchemaEntry('audit.getScenarios'),
	'config.get': daytonaSchemaEntry('config.get'),
	'dockerRegistries.create': daytonaSchemaEntry('dockerRegistries.create'),
	'dockerRegistries.delete': daytonaSchemaEntry('dockerRegistries.delete'),
	'dockerRegistries.get': daytonaSchemaEntry('dockerRegistries.get'),
	'dockerRegistries.getTransientPushAccess': daytonaSchemaEntry(
		'dockerRegistries.getTransientPushAccess',
	),
	'dockerRegistries.list': daytonaSchemaEntry('dockerRegistries.list'),
	'dockerRegistries.update': daytonaSchemaEntry('dockerRegistries.update'),
	'health.live': daytonaSchemaEntry('health.live'),
	'health.ready': daytonaSchemaEntry('health.ready'),
	'objectStorage.getPushAccess': daytonaSchemaEntry(
		'objectStorage.getPushAccess',
	),
	'organizations.createRegion': daytonaSchemaEntry(
		'organizations.createRegion',
	),
	'organizations.deleteRegion': daytonaSchemaEntry(
		'organizations.deleteRegion',
	),
	'organizations.getGpuCapacity': daytonaSchemaEntry(
		'organizations.getGpuCapacity',
	),
	'organizations.getOtelConfig': daytonaSchemaEntry(
		'organizations.getOtelConfig',
	),
	'organizations.getRegionById': daytonaSchemaEntry(
		'organizations.getRegionById',
	),
	'organizations.getUsageOverview': daytonaSchemaEntry(
		'organizations.getUsageOverview',
	),
	'organizations.listAvailableRegions': daytonaSchemaEntry(
		'organizations.listAvailableRegions',
	),
	'organizations.listAvailableSandboxClasses': daytonaSchemaEntry(
		'organizations.listAvailableSandboxClasses',
	),
	'organizations.listMembers': daytonaSchemaEntry('organizations.listMembers'),
	'organizations.regenerateProxyApiKey': daytonaSchemaEntry(
		'organizations.regenerateProxyApiKey',
	),
	'organizations.regenerateSnapshotManagerCredentials': daytonaSchemaEntry(
		'organizations.regenerateSnapshotManagerCredentials',
	),
	'organizations.regenerateSshGatewayApiKey': daytonaSchemaEntry(
		'organizations.regenerateSshGatewayApiKey',
	),
	'organizations.updateRegion': daytonaSchemaEntry(
		'organizations.updateRegion',
	),
	'regions.listShared': daytonaSchemaEntry('regions.listShared'),
	'runners.create': daytonaSchemaEntry('runners.create'),
	'runners.delete': daytonaSchemaEntry('runners.delete'),
	'runners.getById': daytonaSchemaEntry('runners.getById'),
	'runners.getFullById': daytonaSchemaEntry('runners.getFullById'),
	'runners.list': daytonaSchemaEntry('runners.list'),
	'runners.updateDraining': daytonaSchemaEntry('runners.updateDraining'),
	'runners.updateScheduling': daytonaSchemaEntry('runners.updateScheduling'),
	'sandboxes.addNodes': daytonaSchemaEntry('sandboxes.addNodes'),
	'sandboxes.archive': daytonaSchemaEntry('sandboxes.archive'),
	'sandboxes.create': daytonaSchemaEntry('sandboxes.create'),
	'sandboxes.createSnapshot': daytonaSchemaEntry('sandboxes.createSnapshot'),
	'sandboxes.createSshAccess': daytonaSchemaEntry('sandboxes.createSshAccess'),
	'sandboxes.delete': daytonaSchemaEntry('sandboxes.delete'),
	'sandboxes.expireSignedPortPreviewUrl': daytonaSchemaEntry(
		'sandboxes.expireSignedPortPreviewUrl',
	),
	'sandboxes.fork': daytonaSchemaEntry('sandboxes.fork'),
	'sandboxes.get': daytonaSchemaEntry('sandboxes.get'),
	'sandboxes.getAncestors': daytonaSchemaEntry('sandboxes.getAncestors'),
	'sandboxes.getBuildLogsUrl': daytonaSchemaEntry('sandboxes.getBuildLogsUrl'),
	'sandboxes.getForks': daytonaSchemaEntry('sandboxes.getForks'),
	'sandboxes.getGangMembershipOperation': daytonaSchemaEntry(
		'sandboxes.getGangMembershipOperation',
	),
	'sandboxes.getLogs': daytonaSchemaEntry('sandboxes.getLogs'),
	'sandboxes.getMetrics': daytonaSchemaEntry('sandboxes.getMetrics'),
	'sandboxes.getParent': daytonaSchemaEntry('sandboxes.getParent'),
	'sandboxes.getPortPreviewUrl': daytonaSchemaEntry(
		'sandboxes.getPortPreviewUrl',
	),
	'sandboxes.getSignedPortPreviewUrl': daytonaSchemaEntry(
		'sandboxes.getSignedPortPreviewUrl',
	),
	'sandboxes.getSigningKey': daytonaSchemaEntry('sandboxes.getSigningKey'),
	'sandboxes.getToolboxProxyUrl': daytonaSchemaEntry(
		'sandboxes.getToolboxProxyUrl',
	),
	'sandboxes.getTraceSpans': daytonaSchemaEntry('sandboxes.getTraceSpans'),
	'sandboxes.getTraces': daytonaSchemaEntry('sandboxes.getTraces'),
	'sandboxes.list': daytonaSchemaEntry('sandboxes.list'),
	'sandboxes.pause': daytonaSchemaEntry('sandboxes.pause'),
	'sandboxes.recover': daytonaSchemaEntry('sandboxes.recover'),
	'sandboxes.removeNodes': daytonaSchemaEntry('sandboxes.removeNodes'),
	'sandboxes.replaceLabels': daytonaSchemaEntry('sandboxes.replaceLabels'),
	'sandboxes.replaceNode': daytonaSchemaEntry('sandboxes.replaceNode'),
	'sandboxes.resize': daytonaSchemaEntry('sandboxes.resize'),
	'sandboxes.revokeSshAccess': daytonaSchemaEntry('sandboxes.revokeSshAccess'),
	'sandboxes.rotateSigningKey': daytonaSchemaEntry(
		'sandboxes.rotateSigningKey',
	),
	'sandboxes.setAutoArchiveInterval': daytonaSchemaEntry(
		'sandboxes.setAutoArchiveInterval',
	),
	'sandboxes.setAutoDeleteInterval': daytonaSchemaEntry(
		'sandboxes.setAutoDeleteInterval',
	),
	'sandboxes.setAutoPauseInterval': daytonaSchemaEntry(
		'sandboxes.setAutoPauseInterval',
	),
	'sandboxes.setAutostopInterval': daytonaSchemaEntry(
		'sandboxes.setAutostopInterval',
	),
	'sandboxes.setTtl': daytonaSchemaEntry('sandboxes.setTtl'),
	'sandboxes.start': daytonaSchemaEntry('sandboxes.start'),
	'sandboxes.stop': daytonaSchemaEntry('sandboxes.stop'),
	'sandboxes.updateLastActivity': daytonaSchemaEntry(
		'sandboxes.updateLastActivity',
	),
	'sandboxes.updateNetworkSettings': daytonaSchemaEntry(
		'sandboxes.updateNetworkSettings',
	),
	'sandboxes.updatePublicStatus': daytonaSchemaEntry(
		'sandboxes.updatePublicStatus',
	),
	'sandboxes.updateSecrets': daytonaSchemaEntry('sandboxes.updateSecrets'),
	'secrets.create': daytonaSchemaEntry('secrets.create'),
	'secrets.delete': daytonaSchemaEntry('secrets.delete'),
	'secrets.get': daytonaSchemaEntry('secrets.get'),
	'secrets.listPaginated': daytonaSchemaEntry('secrets.listPaginated'),
	'secrets.update': daytonaSchemaEntry('secrets.update'),
	'snapshots.activate': daytonaSchemaEntry('snapshots.activate'),
	'snapshots.create': daytonaSchemaEntry('snapshots.create'),
	'snapshots.deactivate': daytonaSchemaEntry('snapshots.deactivate'),
	'snapshots.get': daytonaSchemaEntry('snapshots.get'),
	'snapshots.getAll': daytonaSchemaEntry('snapshots.getAll'),
	'snapshots.getBuildLogsUrl': daytonaSchemaEntry('snapshots.getBuildLogsUrl'),
	'snapshots.remove': daytonaSchemaEntry('snapshots.remove'),
	'toolbox.computerUse.click': daytonaSchemaEntry('toolbox.computerUse.click'),
	'toolbox.computerUse.deleteRecording': daytonaSchemaEntry(
		'toolbox.computerUse.deleteRecording',
	),
	'toolbox.computerUse.downloadRecording': daytonaSchemaEntry(
		'toolbox.computerUse.downloadRecording',
	),
	'toolbox.computerUse.drag': daytonaSchemaEntry('toolbox.computerUse.drag'),
	'toolbox.computerUse.findAccessibilityNodes': daytonaSchemaEntry(
		'toolbox.computerUse.findAccessibilityNodes',
	),
	'toolbox.computerUse.focusAccessibilityNode': daytonaSchemaEntry(
		'toolbox.computerUse.focusAccessibilityNode',
	),
	'toolbox.computerUse.getAccessibilityTree': daytonaSchemaEntry(
		'toolbox.computerUse.getAccessibilityTree',
	),
	'toolbox.computerUse.getComputerUseStatus': daytonaSchemaEntry(
		'toolbox.computerUse.getComputerUseStatus',
	),
	'toolbox.computerUse.getComputerUseSystemStatus': daytonaSchemaEntry(
		'toolbox.computerUse.getComputerUseSystemStatus',
	),
	'toolbox.computerUse.getDisplayInfo': daytonaSchemaEntry(
		'toolbox.computerUse.getDisplayInfo',
	),
	'toolbox.computerUse.getMousePosition': daytonaSchemaEntry(
		'toolbox.computerUse.getMousePosition',
	),
	'toolbox.computerUse.getProcessErrors': daytonaSchemaEntry(
		'toolbox.computerUse.getProcessErrors',
	),
	'toolbox.computerUse.getProcessLogs': daytonaSchemaEntry(
		'toolbox.computerUse.getProcessLogs',
	),
	'toolbox.computerUse.getProcessStatus': daytonaSchemaEntry(
		'toolbox.computerUse.getProcessStatus',
	),
	'toolbox.computerUse.getRecording': daytonaSchemaEntry(
		'toolbox.computerUse.getRecording',
	),
	'toolbox.computerUse.getWindows': daytonaSchemaEntry(
		'toolbox.computerUse.getWindows',
	),
	'toolbox.computerUse.invokeAccessibilityNode': daytonaSchemaEntry(
		'toolbox.computerUse.invokeAccessibilityNode',
	),
	'toolbox.computerUse.keyDown': daytonaSchemaEntry(
		'toolbox.computerUse.keyDown',
	),
	'toolbox.computerUse.keyUp': daytonaSchemaEntry('toolbox.computerUse.keyUp'),
	'toolbox.computerUse.listRecordings': daytonaSchemaEntry(
		'toolbox.computerUse.listRecordings',
	),
	'toolbox.computerUse.mouseDown': daytonaSchemaEntry(
		'toolbox.computerUse.mouseDown',
	),
	'toolbox.computerUse.mouseUp': daytonaSchemaEntry(
		'toolbox.computerUse.mouseUp',
	),
	'toolbox.computerUse.moveMouse': daytonaSchemaEntry(
		'toolbox.computerUse.moveMouse',
	),
	'toolbox.computerUse.pressHotkey': daytonaSchemaEntry(
		'toolbox.computerUse.pressHotkey',
	),
	'toolbox.computerUse.pressKey': daytonaSchemaEntry(
		'toolbox.computerUse.pressKey',
	),
	'toolbox.computerUse.restartProcess': daytonaSchemaEntry(
		'toolbox.computerUse.restartProcess',
	),
	'toolbox.computerUse.scroll': daytonaSchemaEntry(
		'toolbox.computerUse.scroll',
	),
	'toolbox.computerUse.setAccessibilityNodeValue': daytonaSchemaEntry(
		'toolbox.computerUse.setAccessibilityNodeValue',
	),
	'toolbox.computerUse.startComputerUse': daytonaSchemaEntry(
		'toolbox.computerUse.startComputerUse',
	),
	'toolbox.computerUse.startRecording': daytonaSchemaEntry(
		'toolbox.computerUse.startRecording',
	),
	'toolbox.computerUse.stopComputerUse': daytonaSchemaEntry(
		'toolbox.computerUse.stopComputerUse',
	),
	'toolbox.computerUse.stopRecording': daytonaSchemaEntry(
		'toolbox.computerUse.stopRecording',
	),
	'toolbox.computerUse.takeCompressedRegionScreenshot': daytonaSchemaEntry(
		'toolbox.computerUse.takeCompressedRegionScreenshot',
	),
	'toolbox.computerUse.takeCompressedScreenshot': daytonaSchemaEntry(
		'toolbox.computerUse.takeCompressedScreenshot',
	),
	'toolbox.computerUse.takeRegionScreenshot': daytonaSchemaEntry(
		'toolbox.computerUse.takeRegionScreenshot',
	),
	'toolbox.computerUse.takeScreenshot': daytonaSchemaEntry(
		'toolbox.computerUse.takeScreenshot',
	),
	'toolbox.computerUse.typeText': daytonaSchemaEntry(
		'toolbox.computerUse.typeText',
	),
	'toolbox.files.bulkDownload': daytonaSchemaEntry(
		'toolbox.files.bulkDownload',
	),
	'toolbox.files.bulkUpload': daytonaSchemaEntry('toolbox.files.bulkUpload'),
	'toolbox.files.createFolder': daytonaSchemaEntry(
		'toolbox.files.createFolder',
	),
	'toolbox.files.delete': daytonaSchemaEntry('toolbox.files.delete'),
	'toolbox.files.download': daytonaSchemaEntry('toolbox.files.download'),
	'toolbox.files.findIn': daytonaSchemaEntry('toolbox.files.findIn'),
	'toolbox.files.getInfo': daytonaSchemaEntry('toolbox.files.getInfo'),
	'toolbox.files.list': daytonaSchemaEntry('toolbox.files.list'),
	'toolbox.files.move': daytonaSchemaEntry('toolbox.files.move'),
	'toolbox.files.replaceIn': daytonaSchemaEntry('toolbox.files.replaceIn'),
	'toolbox.files.search': daytonaSchemaEntry('toolbox.files.search'),
	'toolbox.files.setPermissions': daytonaSchemaEntry(
		'toolbox.files.setPermissions',
	),
	'toolbox.files.upload': daytonaSchemaEntry('toolbox.files.upload'),
	'toolbox.git.addFiles': daytonaSchemaEntry('toolbox.git.addFiles'),
	'toolbox.git.addRemote': daytonaSchemaEntry('toolbox.git.addRemote'),
	'toolbox.git.authenticate': daytonaSchemaEntry('toolbox.git.authenticate'),
	'toolbox.git.checkoutBranch': daytonaSchemaEntry(
		'toolbox.git.checkoutBranch',
	),
	'toolbox.git.cloneRepository': daytonaSchemaEntry(
		'toolbox.git.cloneRepository',
	),
	'toolbox.git.commitChanges': daytonaSchemaEntry('toolbox.git.commitChanges'),
	'toolbox.git.configureUser': daytonaSchemaEntry('toolbox.git.configureUser'),
	'toolbox.git.createBranch': daytonaSchemaEntry('toolbox.git.createBranch'),
	'toolbox.git.deleteBranch': daytonaSchemaEntry('toolbox.git.deleteBranch'),
	'toolbox.git.getCommitHistory': daytonaSchemaEntry(
		'toolbox.git.getCommitHistory',
	),
	'toolbox.git.getConfig': daytonaSchemaEntry('toolbox.git.getConfig'),
	'toolbox.git.getStatus': daytonaSchemaEntry('toolbox.git.getStatus'),
	'toolbox.git.initRepository': daytonaSchemaEntry(
		'toolbox.git.initRepository',
	),
	'toolbox.git.listBranches': daytonaSchemaEntry('toolbox.git.listBranches'),
	'toolbox.git.listRemotes': daytonaSchemaEntry('toolbox.git.listRemotes'),
	'toolbox.git.pullChanges': daytonaSchemaEntry('toolbox.git.pullChanges'),
	'toolbox.git.pushChanges': daytonaSchemaEntry('toolbox.git.pushChanges'),
	'toolbox.git.resetChanges': daytonaSchemaEntry('toolbox.git.resetChanges'),
	'toolbox.git.restoreFiles': daytonaSchemaEntry('toolbox.git.restoreFiles'),
	'toolbox.git.setConfig': daytonaSchemaEntry('toolbox.git.setConfig'),
	'toolbox.info.getUserHomeDir': daytonaSchemaEntry(
		'toolbox.info.getUserHomeDir',
	),
	'toolbox.info.getVersion': daytonaSchemaEntry('toolbox.info.getVersion'),
	'toolbox.info.getWorkDir': daytonaSchemaEntry('toolbox.info.getWorkDir'),
	'toolbox.interpreter.createInterpreterContext': daytonaSchemaEntry(
		'toolbox.interpreter.createInterpreterContext',
	),
	'toolbox.interpreter.deleteInterpreterContext': daytonaSchemaEntry(
		'toolbox.interpreter.deleteInterpreterContext',
	),
	'toolbox.interpreter.executeInterpreterCode': daytonaSchemaEntry(
		'toolbox.interpreter.executeInterpreterCode',
	),
	'toolbox.interpreter.listInterpreterContexts': daytonaSchemaEntry(
		'toolbox.interpreter.listInterpreterContexts',
	),
	'toolbox.lsp.completions': daytonaSchemaEntry('toolbox.lsp.completions'),
	'toolbox.lsp.didClose': daytonaSchemaEntry('toolbox.lsp.didClose'),
	'toolbox.lsp.didOpen': daytonaSchemaEntry('toolbox.lsp.didOpen'),
	'toolbox.lsp.documentSymbols': daytonaSchemaEntry(
		'toolbox.lsp.documentSymbols',
	),
	'toolbox.lsp.start': daytonaSchemaEntry('toolbox.lsp.start'),
	'toolbox.lsp.stop': daytonaSchemaEntry('toolbox.lsp.stop'),
	'toolbox.lsp.workspaceSymbols': daytonaSchemaEntry(
		'toolbox.lsp.workspaceSymbols',
	),
	'toolbox.ports.get': daytonaSchemaEntry('toolbox.ports.get'),
	'toolbox.ports.isInUse': daytonaSchemaEntry('toolbox.ports.isInUse'),
	'toolbox.process.codeRun': daytonaSchemaEntry('toolbox.process.codeRun'),
	'toolbox.process.createPtySession': daytonaSchemaEntry(
		'toolbox.process.createPtySession',
	),
	'toolbox.process.createSession': daytonaSchemaEntry(
		'toolbox.process.createSession',
	),
	'toolbox.process.deletePtySession': daytonaSchemaEntry(
		'toolbox.process.deletePtySession',
	),
	'toolbox.process.deleteSession': daytonaSchemaEntry(
		'toolbox.process.deleteSession',
	),
	'toolbox.process.executeCommand': daytonaSchemaEntry(
		'toolbox.process.executeCommand',
	),
	'toolbox.process.getEntrypointLogs': daytonaSchemaEntry(
		'toolbox.process.getEntrypointLogs',
	),
	'toolbox.process.getEntrypointSession': daytonaSchemaEntry(
		'toolbox.process.getEntrypointSession',
	),
	'toolbox.process.getPtySession': daytonaSchemaEntry(
		'toolbox.process.getPtySession',
	),
	'toolbox.process.getSession': daytonaSchemaEntry(
		'toolbox.process.getSession',
	),
	'toolbox.process.getSessionCommand': daytonaSchemaEntry(
		'toolbox.process.getSessionCommand',
	),
	'toolbox.process.getSessionCommandLogs': daytonaSchemaEntry(
		'toolbox.process.getSessionCommandLogs',
	),
	'toolbox.process.listPtySessions': daytonaSchemaEntry(
		'toolbox.process.listPtySessions',
	),
	'toolbox.process.listSessions': daytonaSchemaEntry(
		'toolbox.process.listSessions',
	),
	'toolbox.process.resizePtySession': daytonaSchemaEntry(
		'toolbox.process.resizePtySession',
	),
	'toolbox.process.sendInput': daytonaSchemaEntry('toolbox.process.sendInput'),
	'toolbox.process.sessionExecuteCommand': daytonaSchemaEntry(
		'toolbox.process.sessionExecuteCommand',
	),
	'toolbox.system.getSystemMetrics': daytonaSchemaEntry(
		'toolbox.system.getSystemMetrics',
	),
	'volumes.create': daytonaSchemaEntry('volumes.create'),
	'volumes.delete': daytonaSchemaEntry('volumes.delete'),
	'volumes.get': daytonaSchemaEntry('volumes.get'),
	'volumes.getByName': daytonaSchemaEntry('volumes.getByName'),
	'volumes.list': daytonaSchemaEntry('volumes.list'),
	'warmPools.create': daytonaSchemaEntry('warmPools.create'),
	'warmPools.delete': daytonaSchemaEntry('warmPools.delete'),
	'warmPools.list': daytonaSchemaEntry('warmPools.list'),
	'warmPools.update': daytonaSchemaEntry('warmPools.update'),
	'webhooks.getAppPortalAccess': daytonaSchemaEntry(
		'webhooks.getAppPortalAccess',
	),
	'webhooks.getInitializationStatus': daytonaSchemaEntry(
		'webhooks.getInitializationStatus',
	),
	'webhooks.initialize': daytonaSchemaEntry('webhooks.initialize'),
} satisfies RequiredPluginEndpointSchemas<typeof daytonaEndpointsNested>;

export const daytonaEndpointMeta = {
	'analytics.telemetry.getTrace': {
		riskLevel: 'read',
		description: 'Get trace spans',
	},
	'analytics.telemetry.logs': {
		riskLevel: 'read',
		description: 'Get sandbox logs',
	},
	'analytics.telemetry.metrics': {
		riskLevel: 'read',
		description: 'Get sandbox metrics',
	},
	'analytics.telemetry.traces': {
		riskLevel: 'read',
		description: 'Get sandbox traces',
	},
	'analytics.usage.aggregated': {
		riskLevel: 'read',
		description: 'Get aggregated usage',
	},
	'analytics.usage.bySandbox': {
		riskLevel: 'read',
		description: 'Get per-sandbox usage',
	},
	'analytics.usage.chart': {
		riskLevel: 'read',
		description: 'Get usage chart data',
	},
	'analytics.usage.sandbox': {
		riskLevel: 'read',
		description: 'Get sandbox usage periods',
	},
	'apiKeys.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Create API key',
	},
	'apiKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete API key',
	},
	'apiKeys.getCurrent': {
		riskLevel: 'read',
		description: "Get current API key's details",
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description: 'List API keys',
	},
	'audit.getOrganizationLogs': {
		riskLevel: 'read',
		description: 'Get audit logs for organization',
	},
	'audit.getScenarios': {
		riskLevel: 'read',
		description: 'Get supported audit log scenarios',
	},
	'config.get': {
		riskLevel: 'read',
		description: 'Get config',
	},
	'dockerRegistries.create': {
		riskLevel: 'write',
		description: 'Create registry',
	},
	'dockerRegistries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete registry',
	},
	'dockerRegistries.get': {
		riskLevel: 'read',
		description: 'Get registry',
	},
	'dockerRegistries.getTransientPushAccess': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Get temporary registry access for pushing snapshots',
	},
	'dockerRegistries.list': {
		riskLevel: 'read',
		description: 'List registries',
	},
	'dockerRegistries.update': {
		riskLevel: 'write',
		description: 'Update registry',
	},
	'health.live': {
		riskLevel: 'read',
		description: 'health.live',
	},
	'health.ready': {
		riskLevel: 'read',
		description: 'health.ready',
	},
	'objectStorage.getPushAccess': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Get temporary storage access for pushing objects',
	},
	'organizations.createRegion': {
		riskLevel: 'write',
		description: 'Create a new region',
	},
	'organizations.deleteRegion': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a region',
	},
	'organizations.getGpuCapacity': {
		riskLevel: 'read',
		description: 'Get shared GPU capacity',
	},
	'organizations.getOtelConfig': {
		riskLevel: 'read',
		description: 'Get organization OTEL config by organization ID',
	},
	'organizations.getRegionById': {
		riskLevel: 'read',
		description: 'Get region by ID',
	},
	'organizations.getUsageOverview': {
		riskLevel: 'read',
		description: 'Get organization current usage overview',
	},
	'organizations.listAvailableRegions': {
		riskLevel: 'read',
		description: 'List all available regions for the organization',
	},
	'organizations.listAvailableSandboxClasses': {
		riskLevel: 'read',
		description: 'List available sandbox classes for organization',
	},
	'organizations.listMembers': {
		riskLevel: 'read',
		description: 'List organization members',
	},
	'organizations.regenerateProxyApiKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Regenerate proxy API key for a region',
	},
	'organizations.regenerateSnapshotManagerCredentials': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Regenerate snapshot manager credentials for a region',
	},
	'organizations.regenerateSshGatewayApiKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Regenerate SSH gateway API key for a region',
	},
	'organizations.updateRegion': {
		riskLevel: 'write',
		description: 'Update region configuration',
	},
	'regions.listShared': {
		riskLevel: 'read',
		description: 'List all shared regions',
	},
	'runners.create': {
		riskLevel: 'destructive',
		description: 'Create runner',
	},
	'runners.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete runner',
	},
	'runners.getById': {
		riskLevel: 'read',
		description: 'Get runner by ID',
	},
	'runners.getFullById': {
		riskLevel: 'read',
		description: 'Get runner by ID',
	},
	'runners.list': {
		riskLevel: 'read',
		description: 'List all runners',
	},
	'runners.updateDraining': {
		riskLevel: 'write',
		description: 'Update runner draining status',
	},
	'runners.updateScheduling': {
		riskLevel: 'write',
		description: 'Update runner scheduling status',
	},
	'sandboxes.addNodes': {
		riskLevel: 'destructive',
		description: 'Append nodes to a multi-node sandbox',
	},
	'sandboxes.archive': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Archive sandbox',
	},
	'sandboxes.create': {
		riskLevel: 'destructive',
		description:
			'Create a sandbox from a snapshot or image; billed per second for its vCPU, memory and disk while it runs',
	},
	'sandboxes.createSnapshot': {
		riskLevel: 'write',
		description: 'Create a snapshot from a sandbox',
	},
	'sandboxes.createSshAccess': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Create SSH access for sandbox',
	},
	'sandboxes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a sandbox and its disk',
	},
	'sandboxes.expireSignedPortPreviewUrl': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Expire signed preview URL for a sandbox port',
	},
	'sandboxes.fork': {
		riskLevel: 'destructive',
		description: 'Fork a sandbox',
	},
	'sandboxes.get': {
		riskLevel: 'read',
		description: 'Get sandbox details',
	},
	'sandboxes.getAncestors': {
		riskLevel: 'read',
		description: 'Get sandbox fork ancestor chain',
	},
	'sandboxes.getBuildLogsUrl': {
		riskLevel: 'read',
		description: 'Get build logs URL',
	},
	'sandboxes.getForks': {
		riskLevel: 'read',
		description: 'Get sandbox fork children',
	},
	'sandboxes.getGangMembershipOperation': {
		riskLevel: 'read',
		description: 'Get a membership operation of a multi-node GPU sandbox',
	},
	'sandboxes.getLogs': {
		riskLevel: 'read',
		description: 'Get sandbox logs',
	},
	'sandboxes.getMetrics': {
		riskLevel: 'read',
		description: 'Get sandbox metrics',
	},
	'sandboxes.getParent': {
		riskLevel: 'read',
		description: 'Get sandbox fork parent',
	},
	'sandboxes.getPortPreviewUrl': {
		riskLevel: 'read',
		description: 'Get preview URL for a sandbox port',
	},
	'sandboxes.getSignedPortPreviewUrl': {
		riskLevel: 'read',
		description: 'Get signed preview URL for a sandbox port',
	},
	'sandboxes.getSigningKey': {
		riskLevel: 'read',
		description: 'Get the signing key for a sandbox',
	},
	'sandboxes.getToolboxProxyUrl': {
		riskLevel: 'read',
		description: 'Get toolbox proxy URL for a sandbox',
	},
	'sandboxes.getTraceSpans': {
		riskLevel: 'read',
		description: 'Get trace spans',
	},
	'sandboxes.getTraces': {
		riskLevel: 'read',
		description: 'Get sandbox traces',
	},
	'sandboxes.list': {
		riskLevel: 'read',
		description: 'List sandboxes',
	},
	'sandboxes.pause': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Pause sandbox',
	},
	'sandboxes.recover': {
		riskLevel: 'destructive',
		description: 'Recover sandbox from error state',
	},
	'sandboxes.removeNodes': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove the highest ranks from a multi-node sandbox',
	},
	'sandboxes.replaceLabels': {
		riskLevel: 'write',
		description: 'Replace sandbox labels',
	},
	'sandboxes.replaceNode': {
		riskLevel: 'destructive',
		description: 'Replace a failed multi-node sandbox rank',
	},
	'sandboxes.resize': {
		riskLevel: 'destructive',
		description: 'Resize sandbox resources',
	},
	'sandboxes.revokeSshAccess': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke SSH access for sandbox',
	},
	'sandboxes.rotateSigningKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Rotate the signing key, invalidating all previously signed URLs',
	},
	'sandboxes.setAutoArchiveInterval': {
		riskLevel: 'write',
		description: 'Set sandbox auto-archive interval',
	},
	'sandboxes.setAutoDeleteInterval': {
		riskLevel: 'write',
		description: 'Set sandbox auto-delete interval',
	},
	'sandboxes.setAutoPauseInterval': {
		riskLevel: 'write',
		description: 'Set sandbox auto-pause interval',
	},
	'sandboxes.setAutostopInterval': {
		riskLevel: 'write',
		description: 'Set sandbox auto-stop interval',
	},
	'sandboxes.setTtl': {
		riskLevel: 'write',
		description: 'Set sandbox TTL',
	},
	'sandboxes.start': {
		riskLevel: 'destructive',
		description: 'Start or resume sandbox',
	},
	'sandboxes.stop': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Stop sandbox',
	},
	'sandboxes.updateLastActivity': {
		riskLevel: 'write',
		description: 'Update sandbox last activity',
	},
	'sandboxes.updateNetworkSettings': {
		riskLevel: 'write',
		description: 'Update sandbox network settings',
	},
	'sandboxes.updatePublicStatus': {
		riskLevel: 'write',
		description: 'Update public status',
	},
	'sandboxes.updateSecrets': {
		riskLevel: 'write',
		description: 'Update sandbox secrets',
	},
	'secrets.create': {
		riskLevel: 'write',
		description: 'Create secret',
	},
	'secrets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete secret',
	},
	'secrets.get': {
		riskLevel: 'read',
		description: 'Get secret',
	},
	'secrets.listPaginated': {
		riskLevel: 'read',
		description: 'List secrets with pagination',
	},
	'secrets.update': {
		riskLevel: 'write',
		description: 'Update secret',
	},
	'snapshots.activate': {
		riskLevel: 'write',
		description: 'Activate a snapshot',
	},
	'snapshots.create': {
		riskLevel: 'destructive',
		description: 'Create a new snapshot',
	},
	'snapshots.deactivate': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deactivate a snapshot',
	},
	'snapshots.get': {
		riskLevel: 'read',
		description: 'Get snapshot by ID or name',
	},
	'snapshots.getAll': {
		riskLevel: 'read',
		description: 'List all snapshots',
	},
	'snapshots.getBuildLogsUrl': {
		riskLevel: 'read',
		description: 'Get snapshot build logs URL',
	},
	'snapshots.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete snapshot',
	},
	'toolbox.computerUse.click': {
		riskLevel: 'write',
		description: 'Click mouse button',
	},
	'toolbox.computerUse.deleteRecording': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a recording',
	},
	'toolbox.computerUse.downloadRecording': {
		riskLevel: 'read',
		description: 'Download a recording (returned as a file)',
	},
	'toolbox.computerUse.drag': {
		riskLevel: 'write',
		description: 'Drag mouse',
	},
	'toolbox.computerUse.findAccessibilityNodes': {
		riskLevel: 'read',
		description: 'Find accessibility nodes',
	},
	'toolbox.computerUse.focusAccessibilityNode': {
		riskLevel: 'write',
		description: 'Focus an accessibility node',
	},
	'toolbox.computerUse.getAccessibilityTree': {
		riskLevel: 'read',
		description: 'Get accessibility tree',
	},
	'toolbox.computerUse.getComputerUseStatus': {
		riskLevel: 'read',
		description: 'Get computer use process status',
	},
	'toolbox.computerUse.getComputerUseSystemStatus': {
		riskLevel: 'read',
		description: 'Get computer use status',
	},
	'toolbox.computerUse.getDisplayInfo': {
		riskLevel: 'read',
		description: 'Get display information',
	},
	'toolbox.computerUse.getMousePosition': {
		riskLevel: 'read',
		description: 'Get mouse position',
	},
	'toolbox.computerUse.getProcessErrors': {
		riskLevel: 'read',
		description: 'Get process errors',
	},
	'toolbox.computerUse.getProcessLogs': {
		riskLevel: 'read',
		description: 'Get process logs',
	},
	'toolbox.computerUse.getProcessStatus': {
		riskLevel: 'read',
		description: 'Get specific process status',
	},
	'toolbox.computerUse.getRecording': {
		riskLevel: 'read',
		description: 'Get recording details',
	},
	'toolbox.computerUse.getWindows': {
		riskLevel: 'read',
		description: 'Get windows information',
	},
	'toolbox.computerUse.invokeAccessibilityNode': {
		riskLevel: 'write',
		description: 'Invoke an action on an accessibility node',
	},
	'toolbox.computerUse.keyDown': {
		riskLevel: 'write',
		description: 'Press and hold a keyboard key',
	},
	'toolbox.computerUse.keyUp': {
		riskLevel: 'write',
		description: 'Release a held keyboard key',
	},
	'toolbox.computerUse.listRecordings': {
		riskLevel: 'read',
		description: 'List all recordings',
	},
	'toolbox.computerUse.mouseDown': {
		riskLevel: 'write',
		description: 'Press mouse button',
	},
	'toolbox.computerUse.mouseUp': {
		riskLevel: 'write',
		description: 'Release mouse button',
	},
	'toolbox.computerUse.moveMouse': {
		riskLevel: 'write',
		description: 'Move mouse cursor',
	},
	'toolbox.computerUse.pressHotkey': {
		riskLevel: 'write',
		description: 'Press hotkey',
	},
	'toolbox.computerUse.pressKey': {
		riskLevel: 'write',
		description: 'Press key',
	},
	'toolbox.computerUse.restartProcess': {
		riskLevel: 'write',
		description: 'Restart specific process',
	},
	'toolbox.computerUse.scroll': {
		riskLevel: 'write',
		description: 'Scroll mouse wheel',
	},
	'toolbox.computerUse.setAccessibilityNodeValue': {
		riskLevel: 'write',
		description: 'Set the value of an accessibility node',
	},
	'toolbox.computerUse.startComputerUse': {
		riskLevel: 'destructive',
		description: 'Start computer use processes',
	},
	'toolbox.computerUse.startRecording': {
		riskLevel: 'write',
		description: 'Start a new recording',
	},
	'toolbox.computerUse.stopComputerUse': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Stop computer use processes',
	},
	'toolbox.computerUse.stopRecording': {
		riskLevel: 'write',
		description: 'Stop a recording',
	},
	'toolbox.computerUse.takeCompressedRegionScreenshot': {
		riskLevel: 'read',
		description: 'Take a compressed region screenshot',
	},
	'toolbox.computerUse.takeCompressedScreenshot': {
		riskLevel: 'read',
		description: 'Take a compressed screenshot',
	},
	'toolbox.computerUse.takeRegionScreenshot': {
		riskLevel: 'read',
		description: 'Take a region screenshot',
	},
	'toolbox.computerUse.takeScreenshot': {
		riskLevel: 'read',
		description: 'Take a screenshot',
	},
	'toolbox.computerUse.typeText': {
		riskLevel: 'write',
		description: 'Type text',
	},
	'toolbox.files.bulkDownload': {
		riskLevel: 'read',
		description: 'Download multiple files',
	},
	'toolbox.files.bulkUpload': {
		riskLevel: 'write',
		description: 'Upload multiple files',
	},
	'toolbox.files.createFolder': {
		riskLevel: 'write',
		description: 'Create a folder',
	},
	'toolbox.files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a file or directory',
	},
	'toolbox.files.download': {
		riskLevel: 'read',
		description: 'Download a file from a sandbox (returned as a file)',
	},
	'toolbox.files.findIn': {
		riskLevel: 'read',
		description: 'Find text in files',
	},
	'toolbox.files.getInfo': {
		riskLevel: 'read',
		description: 'Get file information',
	},
	'toolbox.files.list': {
		riskLevel: 'read',
		description: 'List files and directories',
	},
	'toolbox.files.move': {
		riskLevel: 'write',
		description: 'Move or rename file/directory',
	},
	'toolbox.files.replaceIn': {
		riskLevel: 'write',
		description: 'Replace text in files',
	},
	'toolbox.files.search': {
		riskLevel: 'read',
		description: 'Search files by pattern',
	},
	'toolbox.files.setPermissions': {
		riskLevel: 'write',
		description: 'Set file permissions',
	},
	'toolbox.files.upload': {
		riskLevel: 'write',
		description: 'Upload a file into a sandbox',
	},
	'toolbox.git.addFiles': {
		riskLevel: 'write',
		description: 'Add files to Git staging',
	},
	'toolbox.git.addRemote': {
		riskLevel: 'write',
		description: 'Add a remote',
	},
	'toolbox.git.authenticate': {
		riskLevel: 'write',
		description: 'Authenticate Git',
	},
	'toolbox.git.checkoutBranch': {
		riskLevel: 'write',
		description: 'Checkout branch or commit',
	},
	'toolbox.git.cloneRepository': {
		riskLevel: 'write',
		description: 'Clone a Git repository',
	},
	'toolbox.git.commitChanges': {
		riskLevel: 'write',
		description: 'Commit changes',
	},
	'toolbox.git.configureUser': {
		riskLevel: 'write',
		description: 'Configure Git user',
	},
	'toolbox.git.createBranch': {
		riskLevel: 'write',
		description: 'Create a new branch',
	},
	'toolbox.git.deleteBranch': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a branch',
	},
	'toolbox.git.getCommitHistory': {
		riskLevel: 'read',
		description: 'Get commit history',
	},
	'toolbox.git.getConfig': {
		riskLevel: 'read',
		description: 'Get a Git config value',
	},
	'toolbox.git.getStatus': {
		riskLevel: 'read',
		description: 'Get Git status',
	},
	'toolbox.git.initRepository': {
		riskLevel: 'write',
		description: 'Initialize a Git repository',
	},
	'toolbox.git.listBranches': {
		riskLevel: 'read',
		description: 'List branches',
	},
	'toolbox.git.listRemotes': {
		riskLevel: 'read',
		description: 'List remotes',
	},
	'toolbox.git.pullChanges': {
		riskLevel: 'write',
		description: 'Pull changes from remote',
	},
	'toolbox.git.pushChanges': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Push changes to remote',
	},
	'toolbox.git.resetChanges': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Reset repository',
	},
	'toolbox.git.restoreFiles': {
		riskLevel: 'write',
		description: 'Restore files',
	},
	'toolbox.git.setConfig': {
		riskLevel: 'write',
		description: 'Set a Git config value',
	},
	'toolbox.info.getUserHomeDir': {
		riskLevel: 'read',
		description: 'Get user home directory',
	},
	'toolbox.info.getVersion': {
		riskLevel: 'read',
		description: 'Get version',
	},
	'toolbox.info.getWorkDir': {
		riskLevel: 'read',
		description: 'Get working directory',
	},
	'toolbox.interpreter.createInterpreterContext': {
		riskLevel: 'write',
		description: 'Create a new interpreter context',
	},
	'toolbox.interpreter.deleteInterpreterContext': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an interpreter context',
	},
	'toolbox.interpreter.executeInterpreterCode': {
		riskLevel: 'destructive',
		description: 'Execute code in an interpreter context',
	},
	'toolbox.interpreter.listInterpreterContexts': {
		riskLevel: 'read',
		description: 'List all user-created interpreter contexts',
	},
	'toolbox.lsp.completions': {
		riskLevel: 'read',
		description: 'Get code completions',
	},
	'toolbox.lsp.didClose': {
		riskLevel: 'write',
		description: 'Notify document closed',
	},
	'toolbox.lsp.didOpen': {
		riskLevel: 'write',
		description: 'Notify document opened',
	},
	'toolbox.lsp.documentSymbols': {
		riskLevel: 'read',
		description: 'Get document symbols',
	},
	'toolbox.lsp.start': {
		riskLevel: 'write',
		description: 'Start LSP server',
	},
	'toolbox.lsp.stop': {
		riskLevel: 'write',
		description: 'Stop LSP server',
	},
	'toolbox.lsp.workspaceSymbols': {
		riskLevel: 'read',
		description: 'Get workspace symbols',
	},
	'toolbox.ports.get': {
		riskLevel: 'read',
		description: 'Get active ports',
	},
	'toolbox.ports.isInUse': {
		riskLevel: 'read',
		description: 'Check if port is in use',
	},
	'toolbox.process.codeRun': {
		riskLevel: 'destructive',
		description:
			"Run code in the sandbox's language runtime and get the result",
	},
	'toolbox.process.createPtySession': {
		riskLevel: 'write',
		description: 'Create a new PTY session',
	},
	'toolbox.process.createSession': {
		riskLevel: 'write',
		description: 'Create a new session',
	},
	'toolbox.process.deletePtySession': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a PTY session',
	},
	'toolbox.process.deleteSession': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a session',
	},
	'toolbox.process.executeCommand': {
		riskLevel: 'destructive',
		description:
			'Run a command in a sandbox and wait for exitCode and output (timeout in seconds)',
	},
	'toolbox.process.getEntrypointLogs': {
		riskLevel: 'read',
		description: 'Get entrypoint logs',
	},
	'toolbox.process.getEntrypointSession': {
		riskLevel: 'read',
		description: 'Get entrypoint session details',
	},
	'toolbox.process.getPtySession': {
		riskLevel: 'read',
		description: 'Get PTY session information',
	},
	'toolbox.process.getSession': {
		riskLevel: 'read',
		description: 'Get session details',
	},
	'toolbox.process.getSessionCommand': {
		riskLevel: 'read',
		description: 'Get session command details',
	},
	'toolbox.process.getSessionCommandLogs': {
		riskLevel: 'read',
		description: 'Get session command logs',
	},
	'toolbox.process.listPtySessions': {
		riskLevel: 'read',
		description: 'List all PTY sessions',
	},
	'toolbox.process.listSessions': {
		riskLevel: 'read',
		description: 'List all sessions',
	},
	'toolbox.process.resizePtySession': {
		riskLevel: 'write',
		description: 'Resize a PTY session',
	},
	'toolbox.process.sendInput': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Send input to command',
	},
	'toolbox.process.sessionExecuteCommand': {
		riskLevel: 'destructive',
		description: 'Execute command in session',
	},
	'toolbox.system.getSystemMetrics': {
		riskLevel: 'read',
		description: 'Get sandbox resource metrics',
	},
	'volumes.create': {
		riskLevel: 'destructive',
		description: 'Create a new volume',
	},
	'volumes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete volume',
	},
	'volumes.get': {
		riskLevel: 'read',
		description: 'Get volume details',
	},
	'volumes.getByName': {
		riskLevel: 'read',
		description: 'Get volume details by name',
	},
	'volumes.list': {
		riskLevel: 'read',
		description: 'List all volumes',
	},
	'warmPools.create': {
		riskLevel: 'destructive',
		description: 'Create a warm pool',
	},
	'warmPools.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a warm pool',
	},
	'warmPools.list': {
		riskLevel: 'read',
		description: 'List warm pools for the organization',
	},
	'warmPools.update': {
		riskLevel: 'destructive',
		description: 'Update a warm pool size',
	},
	'webhooks.getAppPortalAccess': {
		riskLevel: 'write',
		description: 'Get Svix Consumer App Portal access for an organization',
	},
	'webhooks.getInitializationStatus': {
		riskLevel: 'read',
		description: 'Get webhook initialization status for an organization',
	},
	'webhooks.initialize': {
		riskLevel: 'write',
		description: 'Initialize webhooks for an organization',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof daytonaEndpointsNested>;
