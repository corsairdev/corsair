// Generated with endpoints/operation-types.ts from Kernel's OpenAPI spec: one
// entry per operation in kernel-manifest.json. Descriptions are written for an
// agent driving a browser; risk levels follow .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { kernelSchemaEntry } from './openapi-schema';
import { createKernelOperation as op } from './operations';

export const kernelEndpointsNested = {
	apiKeys: {
		create: op('apiKeys.create'),
		delete: op('apiKeys.delete'),
		get: op('apiKeys.get'),
		list: op('apiKeys.list'),
		rotate: op('apiKeys.rotate'),
		update: op('apiKeys.update'),
	},
	apps: {
		list: op('apps.list'),
	},
	auditLogs: {
		exportChunk: op('auditLogs.exportChunk'),
		exportDestinations: {
			create: op('auditLogs.exportDestinations.create'),
			delete: op('auditLogs.exportDestinations.delete'),
			get: op('auditLogs.exportDestinations.get'),
			list: op('auditLogs.exportDestinations.list'),
			test: op('auditLogs.exportDestinations.test'),
			update: op('auditLogs.exportDestinations.update'),
		},
		list: op('auditLogs.list'),
	},
	auth: {
		connections: {
			create: op('auth.connections.create'),
			delete: op('auth.connections.delete'),
			exchange: op('auth.connections.exchange'),
			get: op('auth.connections.get'),
			list: op('auth.connections.list'),
			login: op('auth.connections.login'),
			submit: op('auth.connections.submit'),
			timeline: op('auth.connections.timeline'),
			update: op('auth.connections.update'),
		},
		context: {
			get: op('auth.context.get'),
		},
	},
	browserPools: {
		acquire: op('browserPools.acquire'),
		create: op('browserPools.create'),
		delete: op('browserPools.delete'),
		flush: op('browserPools.flush'),
		get: op('browserPools.get'),
		list: op('browserPools.list'),
		release: op('browserPools.release'),
		update: op('browserPools.update'),
	},
	browsers: {
		computer: {
			batch: op('browsers.computer.batch'),
			captureScreenshot: op('browsers.computer.captureScreenshot'),
			clickMouse: op('browsers.computer.clickMouse'),
			dragMouse: op('browsers.computer.dragMouse'),
			getMousePosition: op('browsers.computer.getMousePosition'),
			moveMouse: op('browsers.computer.moveMouse'),
			pressKey: op('browsers.computer.pressKey'),
			readClipboard: op('browsers.computer.readClipboard'),
			scroll: op('browsers.computer.scroll'),
			setCursorVisibility: op('browsers.computer.setCursorVisibility'),
			typeText: op('browsers.computer.typeText'),
			writeClipboard: op('browsers.computer.writeClipboard'),
		},
		create: op('browsers.create'),
		curl: op('browsers.curl'),
		delete: op('browsers.delete'),
		fs: {
			createDirectory: op('browsers.fs.createDirectory'),
			deleteDirectory: op('browsers.fs.deleteDirectory'),
			deleteFile: op('browsers.fs.deleteFile'),
			downloadDirZip: op('browsers.fs.downloadDirZip'),
			fileInfo: op('browsers.fs.fileInfo'),
			listFiles: op('browsers.fs.listFiles'),
			move: op('browsers.fs.move'),
			readFile: op('browsers.fs.readFile'),
			setFilePermissions: op('browsers.fs.setFilePermissions'),
			upload: op('browsers.fs.upload'),
			uploadZip: op('browsers.fs.uploadZip'),
			watch: {
				start: op('browsers.fs.watch.start'),
				stop: op('browsers.fs.watch.stop'),
			},
			writeFile: op('browsers.fs.writeFile'),
		},
		get: op('browsers.get'),
		list: op('browsers.list'),
		liveView: {
			create: op('browsers.liveView.create'),
		},
		loadExtensions: op('browsers.loadExtensions'),
		playwright: {
			execute: op('browsers.playwright.execute'),
			executors: {
				delete: op('browsers.playwright.executors.delete'),
				list: op('browsers.playwright.executors.list'),
			},
		},
		process: {
			exec: op('browsers.process.exec'),
			kill: op('browsers.process.kill'),
			resize: op('browsers.process.resize'),
			spawn: op('browsers.process.spawn'),
			status: op('browsers.process.status'),
			stdin: op('browsers.process.stdin'),
		},
		repl: op('browsers.repl'),
		replays: {
			download: op('browsers.replays.download'),
			list: op('browsers.replays.list'),
			start: op('browsers.replays.start'),
			stop: op('browsers.replays.stop'),
		},
		saveProfile: op('browsers.saveProfile'),
		telemetry: {
			events: op('browsers.telemetry.events'),
		},
		update: op('browsers.update'),
		webmcp: {
			customTools: {
				add: op('browsers.webmcp.customTools.add'),
				list: op('browsers.webmcp.customTools.list'),
				remove: op('browsers.webmcp.customTools.remove'),
			},
			invokeTool: op('browsers.webmcp.invokeTool'),
			listTools: op('browsers.webmcp.listTools'),
		},
	},
	configRegistry: {
		analyses: {
			cancel: op('configRegistry.analyses.cancel'),
			get: op('configRegistry.analyses.get'),
			list: op('configRegistry.analyses.list'),
		},
		list: op('configRegistry.list'),
		lookup: op('configRegistry.lookup'),
		resolve: op('configRegistry.resolve'),
	},
	credentialProviders: {
		create: op('credentialProviders.create'),
		delete: op('credentialProviders.delete'),
		get: op('credentialProviders.get'),
		list: op('credentialProviders.list'),
		listItems: op('credentialProviders.listItems'),
		test: op('credentialProviders.test'),
		update: op('credentialProviders.update'),
	},
	credentials: {
		create: op('credentials.create'),
		delete: op('credentials.delete'),
		get: op('credentials.get'),
		list: op('credentials.list'),
		totpCode: op('credentials.totpCode'),
		update: op('credentials.update'),
	},
	deployments: {
		create: op('deployments.create'),
		delete: op('deployments.delete'),
		get: op('deployments.get'),
		list: op('deployments.list'),
	},
	extensions: {
		delete: op('extensions.delete'),
		download: op('extensions.download'),
		downloadFromChromeStore: op('extensions.downloadFromChromeStore'),
		get: op('extensions.get'),
		list: op('extensions.list'),
		upload: op('extensions.upload'),
	},
	invocations: {
		create: op('invocations.create'),
		deleteBrowsers: op('invocations.deleteBrowsers'),
		get: op('invocations.get'),
		list: op('invocations.list'),
		listBrowsers: op('invocations.listBrowsers'),
		update: op('invocations.update'),
	},
	organization: {
		entitlements: {
			get: op('organization.entitlements.get'),
		},
		limits: {
			get: op('organization.limits.get'),
			update: op('organization.limits.update'),
		},
	},
	profiles: {
		create: op('profiles.create'),
		delete: op('profiles.delete'),
		download: op('profiles.download'),
		get: op('profiles.get'),
		list: op('profiles.list'),
		update: op('profiles.update'),
	},
	projects: {
		create: op('projects.create'),
		delete: op('projects.delete'),
		get: op('projects.get'),
		limits: {
			get: op('projects.limits.get'),
			update: op('projects.limits.update'),
		},
		list: op('projects.list'),
		update: op('projects.update'),
	},
	proxies: {
		check: op('proxies.check'),
		create: op('proxies.create'),
		delete: op('proxies.delete'),
		get: op('proxies.get'),
		list: op('proxies.list'),
		update: op('proxies.update'),
	},
	proxyIPs: {
		get: op('proxyIPs.get'),
		list: op('proxyIPs.list'),
	},
	reportTypes: {
		get: op('reportTypes.get'),
		list: op('reportTypes.list'),
		versions: {
			get: op('reportTypes.versions.get'),
		},
	},
	reports: {
		create: op('reports.create'),
		get: op('reports.get'),
		list: op('reports.list'),
	},
	search: {
		contents: {
			fetch: op('search.contents.fetch'),
		},
		create: op('search.create'),
		get: op('search.get'),
		providers: {
			list: op('search.providers.list'),
		},
	},
	tasks: {
		create: op('tasks.create'),
		get: op('tasks.get'),
		linkBrowsers: op('tasks.linkBrowsers'),
		list: op('tasks.list'),
	},
	telemetry: {
		destinations: {
			create: op('telemetry.destinations.create'),
			delete: op('telemetry.destinations.delete'),
			get: op('telemetry.destinations.get'),
			list: op('telemetry.destinations.list'),
			update: op('telemetry.destinations.update'),
		},
	},
	vaultProviderConfigs: {
		create: op('vaultProviderConfigs.create'),
		delete: op('vaultProviderConfigs.delete'),
		get: op('vaultProviderConfigs.get'),
		list: op('vaultProviderConfigs.list'),
		update: op('vaultProviderConfigs.update'),
	},
	vaults: {
		delete: op('vaults.delete'),
		get: op('vaults.get'),
		getEncryptionKey: op('vaults.getEncryptionKey'),
		items: {
			delete: op('vaults.items.delete'),
			events: op('vaults.items.events'),
			get: op('vaults.items.get'),
			list: op('vaults.items.list'),
			performOperation: op('vaults.items.performOperation'),
			update: op('vaults.items.update'),
			upsert: op('vaults.items.upsert'),
		},
		list: op('vaults.list'),
		upsert: op('vaults.upsert'),
	},
} as const;

export const kernelEndpointSchemas = {
	'apiKeys.create': kernelSchemaEntry('apiKeys.create'),
	'apiKeys.delete': kernelSchemaEntry('apiKeys.delete'),
	'apiKeys.get': kernelSchemaEntry('apiKeys.get'),
	'apiKeys.list': kernelSchemaEntry('apiKeys.list'),
	'apiKeys.rotate': kernelSchemaEntry('apiKeys.rotate'),
	'apiKeys.update': kernelSchemaEntry('apiKeys.update'),
	'apps.list': kernelSchemaEntry('apps.list'),
	'auditLogs.exportChunk': kernelSchemaEntry('auditLogs.exportChunk'),
	'auditLogs.exportDestinations.create': kernelSchemaEntry(
		'auditLogs.exportDestinations.create',
	),
	'auditLogs.exportDestinations.delete': kernelSchemaEntry(
		'auditLogs.exportDestinations.delete',
	),
	'auditLogs.exportDestinations.get': kernelSchemaEntry(
		'auditLogs.exportDestinations.get',
	),
	'auditLogs.exportDestinations.list': kernelSchemaEntry(
		'auditLogs.exportDestinations.list',
	),
	'auditLogs.exportDestinations.test': kernelSchemaEntry(
		'auditLogs.exportDestinations.test',
	),
	'auditLogs.exportDestinations.update': kernelSchemaEntry(
		'auditLogs.exportDestinations.update',
	),
	'auditLogs.list': kernelSchemaEntry('auditLogs.list'),
	'auth.connections.create': kernelSchemaEntry('auth.connections.create'),
	'auth.connections.delete': kernelSchemaEntry('auth.connections.delete'),
	'auth.connections.exchange': kernelSchemaEntry('auth.connections.exchange'),
	'auth.connections.get': kernelSchemaEntry('auth.connections.get'),
	'auth.connections.list': kernelSchemaEntry('auth.connections.list'),
	'auth.connections.login': kernelSchemaEntry('auth.connections.login'),
	'auth.connections.submit': kernelSchemaEntry('auth.connections.submit'),
	'auth.connections.timeline': kernelSchemaEntry('auth.connections.timeline'),
	'auth.connections.update': kernelSchemaEntry('auth.connections.update'),
	'auth.context.get': kernelSchemaEntry('auth.context.get'),
	'browserPools.acquire': kernelSchemaEntry('browserPools.acquire'),
	'browserPools.create': kernelSchemaEntry('browserPools.create'),
	'browserPools.delete': kernelSchemaEntry('browserPools.delete'),
	'browserPools.flush': kernelSchemaEntry('browserPools.flush'),
	'browserPools.get': kernelSchemaEntry('browserPools.get'),
	'browserPools.list': kernelSchemaEntry('browserPools.list'),
	'browserPools.release': kernelSchemaEntry('browserPools.release'),
	'browserPools.update': kernelSchemaEntry('browserPools.update'),
	'browsers.computer.batch': kernelSchemaEntry('browsers.computer.batch'),
	'browsers.computer.captureScreenshot': kernelSchemaEntry(
		'browsers.computer.captureScreenshot',
	),
	'browsers.computer.clickMouse': kernelSchemaEntry(
		'browsers.computer.clickMouse',
	),
	'browsers.computer.dragMouse': kernelSchemaEntry(
		'browsers.computer.dragMouse',
	),
	'browsers.computer.getMousePosition': kernelSchemaEntry(
		'browsers.computer.getMousePosition',
	),
	'browsers.computer.moveMouse': kernelSchemaEntry(
		'browsers.computer.moveMouse',
	),
	'browsers.computer.pressKey': kernelSchemaEntry('browsers.computer.pressKey'),
	'browsers.computer.readClipboard': kernelSchemaEntry(
		'browsers.computer.readClipboard',
	),
	'browsers.computer.scroll': kernelSchemaEntry('browsers.computer.scroll'),
	'browsers.computer.setCursorVisibility': kernelSchemaEntry(
		'browsers.computer.setCursorVisibility',
	),
	'browsers.computer.typeText': kernelSchemaEntry('browsers.computer.typeText'),
	'browsers.computer.writeClipboard': kernelSchemaEntry(
		'browsers.computer.writeClipboard',
	),
	'browsers.create': kernelSchemaEntry('browsers.create'),
	'browsers.curl': kernelSchemaEntry('browsers.curl'),
	'browsers.delete': kernelSchemaEntry('browsers.delete'),
	'browsers.fs.createDirectory': kernelSchemaEntry(
		'browsers.fs.createDirectory',
	),
	'browsers.fs.deleteDirectory': kernelSchemaEntry(
		'browsers.fs.deleteDirectory',
	),
	'browsers.fs.deleteFile': kernelSchemaEntry('browsers.fs.deleteFile'),
	'browsers.fs.downloadDirZip': kernelSchemaEntry('browsers.fs.downloadDirZip'),
	'browsers.fs.fileInfo': kernelSchemaEntry('browsers.fs.fileInfo'),
	'browsers.fs.listFiles': kernelSchemaEntry('browsers.fs.listFiles'),
	'browsers.fs.move': kernelSchemaEntry('browsers.fs.move'),
	'browsers.fs.readFile': kernelSchemaEntry('browsers.fs.readFile'),
	'browsers.fs.setFilePermissions': kernelSchemaEntry(
		'browsers.fs.setFilePermissions',
	),
	'browsers.fs.upload': kernelSchemaEntry('browsers.fs.upload'),
	'browsers.fs.uploadZip': kernelSchemaEntry('browsers.fs.uploadZip'),
	'browsers.fs.watch.start': kernelSchemaEntry('browsers.fs.watch.start'),
	'browsers.fs.watch.stop': kernelSchemaEntry('browsers.fs.watch.stop'),
	'browsers.fs.writeFile': kernelSchemaEntry('browsers.fs.writeFile'),
	'browsers.get': kernelSchemaEntry('browsers.get'),
	'browsers.list': kernelSchemaEntry('browsers.list'),
	'browsers.liveView.create': kernelSchemaEntry('browsers.liveView.create'),
	'browsers.loadExtensions': kernelSchemaEntry('browsers.loadExtensions'),
	'browsers.playwright.execute': kernelSchemaEntry(
		'browsers.playwright.execute',
	),
	'browsers.playwright.executors.delete': kernelSchemaEntry(
		'browsers.playwright.executors.delete',
	),
	'browsers.playwright.executors.list': kernelSchemaEntry(
		'browsers.playwright.executors.list',
	),
	'browsers.process.exec': kernelSchemaEntry('browsers.process.exec'),
	'browsers.process.kill': kernelSchemaEntry('browsers.process.kill'),
	'browsers.process.resize': kernelSchemaEntry('browsers.process.resize'),
	'browsers.process.spawn': kernelSchemaEntry('browsers.process.spawn'),
	'browsers.process.status': kernelSchemaEntry('browsers.process.status'),
	'browsers.process.stdin': kernelSchemaEntry('browsers.process.stdin'),
	'browsers.repl': kernelSchemaEntry('browsers.repl'),
	'browsers.replays.download': kernelSchemaEntry('browsers.replays.download'),
	'browsers.replays.list': kernelSchemaEntry('browsers.replays.list'),
	'browsers.replays.start': kernelSchemaEntry('browsers.replays.start'),
	'browsers.replays.stop': kernelSchemaEntry('browsers.replays.stop'),
	'browsers.saveProfile': kernelSchemaEntry('browsers.saveProfile'),
	'browsers.telemetry.events': kernelSchemaEntry('browsers.telemetry.events'),
	'browsers.update': kernelSchemaEntry('browsers.update'),
	'browsers.webmcp.customTools.add': kernelSchemaEntry(
		'browsers.webmcp.customTools.add',
	),
	'browsers.webmcp.customTools.list': kernelSchemaEntry(
		'browsers.webmcp.customTools.list',
	),
	'browsers.webmcp.customTools.remove': kernelSchemaEntry(
		'browsers.webmcp.customTools.remove',
	),
	'browsers.webmcp.invokeTool': kernelSchemaEntry('browsers.webmcp.invokeTool'),
	'browsers.webmcp.listTools': kernelSchemaEntry('browsers.webmcp.listTools'),
	'configRegistry.analyses.cancel': kernelSchemaEntry(
		'configRegistry.analyses.cancel',
	),
	'configRegistry.analyses.get': kernelSchemaEntry(
		'configRegistry.analyses.get',
	),
	'configRegistry.analyses.list': kernelSchemaEntry(
		'configRegistry.analyses.list',
	),
	'configRegistry.list': kernelSchemaEntry('configRegistry.list'),
	'configRegistry.lookup': kernelSchemaEntry('configRegistry.lookup'),
	'configRegistry.resolve': kernelSchemaEntry('configRegistry.resolve'),
	'credentialProviders.create': kernelSchemaEntry('credentialProviders.create'),
	'credentialProviders.delete': kernelSchemaEntry('credentialProviders.delete'),
	'credentialProviders.get': kernelSchemaEntry('credentialProviders.get'),
	'credentialProviders.list': kernelSchemaEntry('credentialProviders.list'),
	'credentialProviders.listItems': kernelSchemaEntry(
		'credentialProviders.listItems',
	),
	'credentialProviders.test': kernelSchemaEntry('credentialProviders.test'),
	'credentialProviders.update': kernelSchemaEntry('credentialProviders.update'),
	'credentials.create': kernelSchemaEntry('credentials.create'),
	'credentials.delete': kernelSchemaEntry('credentials.delete'),
	'credentials.get': kernelSchemaEntry('credentials.get'),
	'credentials.list': kernelSchemaEntry('credentials.list'),
	'credentials.totpCode': kernelSchemaEntry('credentials.totpCode'),
	'credentials.update': kernelSchemaEntry('credentials.update'),
	'deployments.create': kernelSchemaEntry('deployments.create'),
	'deployments.delete': kernelSchemaEntry('deployments.delete'),
	'deployments.get': kernelSchemaEntry('deployments.get'),
	'deployments.list': kernelSchemaEntry('deployments.list'),
	'extensions.delete': kernelSchemaEntry('extensions.delete'),
	'extensions.download': kernelSchemaEntry('extensions.download'),
	'extensions.downloadFromChromeStore': kernelSchemaEntry(
		'extensions.downloadFromChromeStore',
	),
	'extensions.get': kernelSchemaEntry('extensions.get'),
	'extensions.list': kernelSchemaEntry('extensions.list'),
	'extensions.upload': kernelSchemaEntry('extensions.upload'),
	'invocations.create': kernelSchemaEntry('invocations.create'),
	'invocations.deleteBrowsers': kernelSchemaEntry('invocations.deleteBrowsers'),
	'invocations.get': kernelSchemaEntry('invocations.get'),
	'invocations.list': kernelSchemaEntry('invocations.list'),
	'invocations.listBrowsers': kernelSchemaEntry('invocations.listBrowsers'),
	'invocations.update': kernelSchemaEntry('invocations.update'),
	'organization.entitlements.get': kernelSchemaEntry(
		'organization.entitlements.get',
	),
	'organization.limits.get': kernelSchemaEntry('organization.limits.get'),
	'organization.limits.update': kernelSchemaEntry('organization.limits.update'),
	'profiles.create': kernelSchemaEntry('profiles.create'),
	'profiles.delete': kernelSchemaEntry('profiles.delete'),
	'profiles.download': kernelSchemaEntry('profiles.download'),
	'profiles.get': kernelSchemaEntry('profiles.get'),
	'profiles.list': kernelSchemaEntry('profiles.list'),
	'profiles.update': kernelSchemaEntry('profiles.update'),
	'projects.create': kernelSchemaEntry('projects.create'),
	'projects.delete': kernelSchemaEntry('projects.delete'),
	'projects.get': kernelSchemaEntry('projects.get'),
	'projects.limits.get': kernelSchemaEntry('projects.limits.get'),
	'projects.limits.update': kernelSchemaEntry('projects.limits.update'),
	'projects.list': kernelSchemaEntry('projects.list'),
	'projects.update': kernelSchemaEntry('projects.update'),
	'proxies.check': kernelSchemaEntry('proxies.check'),
	'proxies.create': kernelSchemaEntry('proxies.create'),
	'proxies.delete': kernelSchemaEntry('proxies.delete'),
	'proxies.get': kernelSchemaEntry('proxies.get'),
	'proxies.list': kernelSchemaEntry('proxies.list'),
	'proxies.update': kernelSchemaEntry('proxies.update'),
	'proxyIPs.get': kernelSchemaEntry('proxyIPs.get'),
	'proxyIPs.list': kernelSchemaEntry('proxyIPs.list'),
	'reportTypes.get': kernelSchemaEntry('reportTypes.get'),
	'reportTypes.list': kernelSchemaEntry('reportTypes.list'),
	'reportTypes.versions.get': kernelSchemaEntry('reportTypes.versions.get'),
	'reports.create': kernelSchemaEntry('reports.create'),
	'reports.get': kernelSchemaEntry('reports.get'),
	'reports.list': kernelSchemaEntry('reports.list'),
	'search.contents.fetch': kernelSchemaEntry('search.contents.fetch'),
	'search.create': kernelSchemaEntry('search.create'),
	'search.get': kernelSchemaEntry('search.get'),
	'search.providers.list': kernelSchemaEntry('search.providers.list'),
	'tasks.create': kernelSchemaEntry('tasks.create'),
	'tasks.get': kernelSchemaEntry('tasks.get'),
	'tasks.linkBrowsers': kernelSchemaEntry('tasks.linkBrowsers'),
	'tasks.list': kernelSchemaEntry('tasks.list'),
	'telemetry.destinations.create': kernelSchemaEntry(
		'telemetry.destinations.create',
	),
	'telemetry.destinations.delete': kernelSchemaEntry(
		'telemetry.destinations.delete',
	),
	'telemetry.destinations.get': kernelSchemaEntry('telemetry.destinations.get'),
	'telemetry.destinations.list': kernelSchemaEntry(
		'telemetry.destinations.list',
	),
	'telemetry.destinations.update': kernelSchemaEntry(
		'telemetry.destinations.update',
	),
	'vaultProviderConfigs.create': kernelSchemaEntry(
		'vaultProviderConfigs.create',
	),
	'vaultProviderConfigs.delete': kernelSchemaEntry(
		'vaultProviderConfigs.delete',
	),
	'vaultProviderConfigs.get': kernelSchemaEntry('vaultProviderConfigs.get'),
	'vaultProviderConfigs.list': kernelSchemaEntry('vaultProviderConfigs.list'),
	'vaultProviderConfigs.update': kernelSchemaEntry(
		'vaultProviderConfigs.update',
	),
	'vaults.delete': kernelSchemaEntry('vaults.delete'),
	'vaults.get': kernelSchemaEntry('vaults.get'),
	'vaults.getEncryptionKey': kernelSchemaEntry('vaults.getEncryptionKey'),
	'vaults.items.delete': kernelSchemaEntry('vaults.items.delete'),
	'vaults.items.events': kernelSchemaEntry('vaults.items.events'),
	'vaults.items.get': kernelSchemaEntry('vaults.items.get'),
	'vaults.items.list': kernelSchemaEntry('vaults.items.list'),
	'vaults.items.performOperation': kernelSchemaEntry(
		'vaults.items.performOperation',
	),
	'vaults.items.update': kernelSchemaEntry('vaults.items.update'),
	'vaults.items.upsert': kernelSchemaEntry('vaults.items.upsert'),
	'vaults.list': kernelSchemaEntry('vaults.list'),
	'vaults.upsert': kernelSchemaEntry('vaults.upsert'),
} satisfies RequiredPluginEndpointSchemas<typeof kernelEndpointsNested>;

export const kernelEndpointMeta = {
	'apiKeys.create': {
		riskLevel: 'destructive',
		description:
			'Create a Kernel API key. The secret is shown once in the response: store it right away and never paste it into chat.',
	},
	'apiKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an API key; anything using it stops working. Cannot be undone.',
	},
	'apiKeys.get': {
		riskLevel: 'read',
		description: "Get an API key's metadata.",
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description: 'List API keys (names, scopes, last used; never the secrets).',
	},
	'apiKeys.rotate': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Replace an API key's secret. The new secret is shown once. The old one keeps working for expire_in_days (7 by default); pass expire_in_days: 0 to end it now.",
	},
	'apiKeys.update': {
		riskLevel: 'write',
		description: 'Rename an API key or change its settings.',
	},
	'apps.list': {
		riskLevel: 'read',
		description: 'List deployed Kernel apps and their versions and actions.',
	},
	'auditLogs.exportChunk': {
		riskLevel: 'read',
		description:
			'Download one chunk of the audit log as JSONL (gzipped by default). Returns a file plus has_more and next_cursor for the next chunk.',
	},
	'auditLogs.exportDestinations.create': {
		riskLevel: 'write',
		description:
			'Add a destination (such as an S3 bucket) that receives continuous audit log exports.',
	},
	'auditLogs.exportDestinations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an audit log export destination. Cannot be undone.',
	},
	'auditLogs.exportDestinations.get': {
		riskLevel: 'read',
		description: 'Get an audit log export destination.',
	},
	'auditLogs.exportDestinations.list': {
		riskLevel: 'read',
		description: 'List audit log export destinations.',
	},
	'auditLogs.exportDestinations.test': {
		riskLevel: 'write',
		description:
			'Send a test export to an audit log destination to check it works.',
	},
	'auditLogs.exportDestinations.update': {
		riskLevel: 'write',
		description: 'Update an audit log export destination.',
	},
	'auditLogs.list': {
		riskLevel: 'read',
		description:
			"Search the org's audit log (who called what, when), newest first. Pages with page_token; check has_more.",
	},
	'auth.connections.create': {
		riskLevel: 'write',
		description:
			'Set up managed login for a site: one connection per profile and domain (the profile is created if missing). Then start a login with auth.connections.login.',
	},
	'auth.connections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a managed auth connection and stop its health checks and logins. Cannot be undone; the profile stays.',
	},
	'auth.connections.exchange': {
		riskLevel: 'write',
		description:
			"Exchange a login handoff code for a short-lived token, as Kernel's hosted login page does.",
	},
	'auth.connections.get': {
		riskLevel: 'read',
		description:
			'Get a managed auth connection and its current login flow: status, step, the fields it is waiting for, and hosted_url or live_view_url for a person to finish it. Poll this while a login runs.',
	},
	'auth.connections.list': {
		riskLevel: 'read',
		description:
			'List managed auth connections (site logins Kernel keeps signed in), filtered by profile or domain.',
	},
	'auth.connections.login': {
		riskLevel: 'write',
		description:
			'Start a login for a managed auth connection. Returns hosted_url (and live_view_url) for a person to complete it, or logs in by itself when credentials are stored. Then poll auth.connections.get, and send asked-for fields with auth.connections.submit.',
	},
	'auth.connections.submit': {
		riskLevel: 'write',
		description:
			'Send the values a running login asks for (a username, password, one-time code, or a choice) to a managed auth connection. Poll auth.connections.get for the result.',
	},
	'auth.connections.timeline': {
		riskLevel: 'read',
		description:
			"List a managed auth connection's history (logins, re-auths, health checks), newest first.",
	},
	'auth.connections.update': {
		riskLevel: 'write',
		description:
			"Change a managed auth connection's settings: health checks, auto re-auth, credential, proxy, login URL.",
	},
	'auth.context.get': {
		riskLevel: 'read',
		description:
			'Show who the API key is: its organization, project and scopes.',
	},
	'browserPools.acquire': {
		riskLevel: 'write',
		description:
			'Take a ready browser from a pool (waits up to acquire_timeout_seconds). Returns null when none freed up in time; call again. Give it back with browserPools.release.',
	},
	'browserPools.create': {
		riskLevel: 'write',
		description:
			'Create a pool of pre-started browsers with one configuration, for instant browserPools.acquire. Idle pool browsers are not billed but count toward the concurrency limit.',
	},
	'browserPools.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a browser pool and its browsers. Cannot be undone.',
	},
	'browserPools.flush': {
		riskLevel: 'write',
		description: "Delete a pool's idle browsers so it refills with fresh ones.",
	},
	'browserPools.get': {
		riskLevel: 'read',
		description:
			'Get a browser pool: configuration, size, and how many browsers are available or leased.',
	},
	'browserPools.list': {
		riskLevel: 'read',
		description: 'List browser pools and their sizes.',
	},
	'browserPools.release': {
		riskLevel: 'write',
		description:
			'Return an acquired browser to its pool (optionally reusing it rather than replacing it).',
	},
	'browserPools.update': {
		riskLevel: 'write',
		description:
			'Change a browser pool\'s size or browser configuration. A change applies to browsers the pool creates afterwards: pass discard_all_idle: true to rebuild idle ones now, and release leased ones with reuse: false. To stop loading a profile, send profile: { id: "" }; browsers already in the pool keep the old profile until rebuilt.',
	},
	'browsers.computer.batch': {
		riskLevel: 'write',
		description:
			'Run a list of computer actions (click_mouse, type_text, press_key, scroll, move_mouse, drag_mouse, sleep and more) in order in one call; stops at the first error. Faster than one call per action.',
	},
	'browsers.computer.captureScreenshot': {
		riskLevel: 'read',
		description:
			'Take a PNG screenshot of the browser screen (optionally a region). Headful browsers only: a headless browser has no window, so this returns an empty screen; there, use page.screenshot() inside browsers.playwright.execute. Returns a file: on Corsair it is saved to Files and comes back with a fileId.',
	},
	'browsers.computer.clickMouse': {
		riskLevel: 'write',
		description:
			'Click at screen coordinates x, y (left, right or middle button; num_clicks for double-click).',
	},
	'browsers.computer.dragMouse': {
		riskLevel: 'write',
		description:
			'Press the mouse, drag it along a path of [x, y] points, and release.',
	},
	'browsers.computer.getMousePosition': {
		riskLevel: 'read',
		description: "Get the mouse cursor's current screen coordinates.",
	},
	'browsers.computer.moveMouse': {
		riskLevel: 'write',
		description: 'Move the mouse cursor to screen coordinates x, y (hover).',
	},
	'browsers.computer.pressKey': {
		riskLevel: 'write',
		description:
			'Press keys or a combination on the browser\'s keyboard, e.g. ["Return"] or ["Ctrl+a"] (X keysym names).',
	},
	'browsers.computer.readClipboard': {
		riskLevel: 'read',
		description: "Read the text on the browser VM's clipboard.",
	},
	'browsers.computer.scroll': {
		riskLevel: 'write',
		description:
			'Scroll the mouse wheel by delta_x/delta_y at screen coordinates x, y.',
	},
	'browsers.computer.setCursorVisibility': {
		riskLevel: 'write',
		description: 'Show or hide the mouse cursor in screenshots and live view.',
	},
	'browsers.computer.typeText': {
		riskLevel: 'write',
		description:
			'Type text into the focused field, as keystrokes (optional delay between keys).',
	},
	'browsers.computer.writeClipboard': {
		riskLevel: 'write',
		description: "Put text on the browser VM's clipboard.",
	},
	'browsers.create': {
		riskLevel: 'write',
		description:
			"Start a cloud Chromium browser and get its session_id, cdp_ws_url and browser_live_view_url. Use headless: true unless a person must watch or take over: headless costs about 8x less ($0.06/h vs $0.48/h) and has no live view. stealth: true (or captcha_solver + proxy) helps on bot-protected sites. Pass profile {name, save_changes: true} to start signed in and keep new cookies; the profile is saved when the browser is deleted. start_url opens a page. A browser bills per second while it is active (a CDP, live view or computer-control connection), drops to unbilled standby after about 10 s idle, and is deleted after timeout_seconds of standby (default 60). It holds one of the org's concurrent-browser slots until deleted, so call browsers.delete when done.",
	},
	'browsers.curl': {
		riskLevel: 'write',
		description:
			'Send an HTTP request from inside the browser (its cookies, proxy and network fingerprint) and get status, headers and body back. Handy for an API call that needs the signed-in session.',
	},
	'browsers.delete': {
		riskLevel: 'write',
		description:
			'End a browser session now and stop its billing; frees its concurrency slot. If it was started with profile save_changes: true, the cookies and storage are saved to the profile first. Cannot be undone: the session, its tabs and its files are gone.',
	},
	'browsers.fs.createDirectory': {
		riskLevel: 'write',
		description: 'Create a directory (and its parents) in the browser VM.',
	},
	'browsers.fs.deleteDirectory': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a directory and everything in it from the browser VM.',
	},
	'browsers.fs.deleteFile': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a file from the browser VM.',
	},
	'browsers.fs.downloadDirZip': {
		riskLevel: 'read',
		description:
			'Download a directory from the browser VM as a zip. Returns a file: on Corsair it is saved to Files and comes back with a fileId.',
	},
	'browsers.fs.fileInfo': {
		riskLevel: 'read',
		description:
			"Get a file's or directory's size, mode and modified time in the browser VM.",
	},
	'browsers.fs.listFiles': {
		riskLevel: 'read',
		description:
			'List the files and folders in a directory of the browser VM, with sizes and times.',
	},
	'browsers.fs.move': {
		riskLevel: 'write',
		description: 'Move or rename a file or directory in the browser VM.',
	},
	'browsers.fs.readFile': {
		riskLevel: 'read',
		description:
			'Read a file from the browser VM (for example a download in /tmp/downloads). Returns a file: on Corsair it is saved to Files and comes back with a fileId.',
	},
	'browsers.fs.setFilePermissions': {
		riskLevel: 'write',
		description: "Change a file's mode or owner in the browser VM.",
	},
	'browsers.fs.upload': {
		riskLevel: 'write',
		description:
			'Upload one or more files into the browser VM, each {file, dest_path}; a file is a public URL, {url} or {base64}.',
	},
	'browsers.fs.uploadZip': {
		riskLevel: 'write',
		description:
			'Upload a zip archive and unpack it into dest_path in the browser VM.',
	},
	'browsers.fs.watch.start': {
		riskLevel: 'write',
		description:
			'Start watching a directory in the browser VM for changes; returns a watch_id. Kernel streams the events (not available here), so poll browsers.fs.listFiles instead when you can.',
	},
	'browsers.fs.watch.stop': {
		riskLevel: 'write',
		description: 'Stop a directory watch by its watch_id.',
	},
	'browsers.fs.writeFile': {
		riskLevel: 'write',
		description:
			'Write a file into the browser VM at path (creates or replaces it). Pass the contents as a URL or {base64}.',
	},
	'browsers.get': {
		riskLevel: 'read',
		description:
			'Get a browser session: status, URLs (cdp_ws_url, browser_live_view_url), profile, proxy, timeout and usage cost so far.',
	},
	'browsers.list': {
		riskLevel: 'read',
		description:
			'List browser sessions in the project, newest first; filter by status (active, deleted, all), tags or name query. Pages with offset/limit; check has_more.',
	},
	'browsers.liveView.create': {
		riskLevel: 'write',
		description:
			'Make a live view link for a headful browser so a person can watch (scope read) or take over (scope control): log in, solve a captcha, approve a step. The link lasts until the browser is deleted or ttl_seconds passes and cannot be revoked, so treat it as a credential and share it only with the person who needs it. Headless browsers have no live view.',
	},
	'browsers.loadExtensions': {
		riskLevel: 'write',
		description:
			'Load unpacked Chrome extensions (each a zip, as a URL or base64) into a running browser.',
	},
	'browsers.playwright.execute': {
		riskLevel: 'write',
		description:
			"The simplest way to act on a page: run Playwright code in the browser's VM in one call and get its return value as result (plus stdout/stderr and error). The code gets page, context, browser and webmcp, e.g. `await page.goto('https://example.com'); return await page.title();`. timeout_sec defaults to 60 (max 300). Calls with the same executor name run one at a time in a shared process; pass idempotency_key to make a retry safe.",
	},
	'browsers.playwright.executors.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Stop and remove a named Playwright executor on a browser; a later call with that name starts a fresh one.',
	},
	'browsers.playwright.executors.list': {
		riskLevel: 'read',
		description:
			'List the Playwright executors (worker processes) on a browser and whether each is busy.',
	},
	'browsers.process.exec': {
		riskLevel: 'write',
		description:
			'Run a shell command in the browser VM and wait for it: returns exit code, stdout and stderr (base64). Set timeout_sec for long commands.',
	},
	'browsers.process.kill': {
		riskLevel: 'write',
		description:
			'Send a signal to a spawned process. signal is required: TERM to end it, KILL to force it, or INT, HUP.',
	},
	'browsers.process.resize': {
		riskLevel: 'write',
		description: 'Resize the terminal of a process spawned with allocate_tty.',
	},
	'browsers.process.spawn': {
		riskLevel: 'write',
		description:
			'Start a command in the browser VM without waiting; returns a process_id for browsers.process.status, stdin and kill.',
	},
	'browsers.process.status': {
		riskLevel: 'read',
		description: "Get a spawned process's state, exit code and resource use.",
	},
	'browsers.process.stdin': {
		riskLevel: 'write',
		description: "Write data (base64) to a spawned process's stdin.",
	},
	'browsers.repl': {
		riskLevel: 'write',
		description:
			'Run JavaScript in a persistent Node.js REPL inside the browser VM; variables persist between calls (reset: true starts fresh). Start with repl.help(). Output comes from repl.write, console or repl.emitImage.',
	},
	'browsers.replays.download': {
		riskLevel: 'read',
		description:
			'Download a replay recording as MP4. Returns a file: on Corsair it is saved to Files and comes back with a fileId. Errors with "still preparing" for a few seconds after the recording stops.',
	},
	'browsers.replays.list': {
		riskLevel: 'read',
		description:
			"List a browser's replay recordings with their ids and view URLs.",
	},
	'browsers.replays.start': {
		riskLevel: 'write',
		description:
			'Start recording the browser screen as a video replay (headful browsers); returns a replay_id.',
	},
	'browsers.replays.stop': {
		riskLevel: 'write',
		description:
			'Stop a replay recording; download it with browsers.replays.download once it is processed.',
	},
	'browsers.saveProfile': {
		riskLevel: 'write',
		description:
			"Save the running browser's cookies and storage to a profile now, without ending the session: by id (overwrite) or by name (overwrite or create).",
	},
	'browsers.telemetry.events': {
		riskLevel: 'read',
		description:
			'Read a page of telemetry events for a browser (console, network, page, interaction, captcha and more), filtered by category, type and time. Pages with offset; check has_more.',
	},
	'browsers.update': {
		riskLevel: 'write',
		description:
			'Change a running browser: rename it, change its proxy, viewport or tags, or attach a profile it was started without.',
	},
	'browsers.webmcp.customTools.add': {
		riskLevel: 'write',
		description:
			"Register custom WebMCP tools (JavaScript run in a page) on a browser's tabs.",
	},
	'browsers.webmcp.customTools.list': {
		riskLevel: 'read',
		description: 'List the custom WebMCP tools registered on a browser.',
	},
	'browsers.webmcp.customTools.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a custom WebMCP tool from a browser by its id.',
	},
	'browsers.webmcp.invokeTool': {
		riskLevel: 'write',
		description:
			'Call a WebMCP tool a page exposes, by the tool_ref from browsers.webmcp.listTools, with its input.',
	},
	'browsers.webmcp.listTools': {
		riskLevel: 'read',
		description:
			'List the WebMCP tools that open pages expose (native and custom), each with a tool_ref to call it with browsers.webmcp.invokeTool. Tools vanish when their page navigates away.',
	},
	'configRegistry.analyses.cancel': {
		riskLevel: 'write',
		description: 'Cancel a running config analysis.',
	},
	'configRegistry.analyses.get': {
		riskLevel: 'read',
		description: 'Get a config analysis and its result.',
	},
	'configRegistry.analyses.list': {
		riskLevel: 'read',
		description: 'List config analyses.',
	},
	'configRegistry.list': {
		riskLevel: 'read',
		description: 'List known site configurations.',
	},
	'configRegistry.lookup': {
		riskLevel: 'read',
		description:
			"Look up Kernel's recommended browser and proxy settings for a bot-protected site (no side effects).",
	},
	'configRegistry.resolve': {
		riskLevel: 'write',
		description:
			'Ask Kernel to analyse a site and work out the browser and proxy settings that get through its bot protection; poll configRegistry.analyses.get.',
	},
	'credentialProviders.create': {
		riskLevel: 'write',
		description:
			'Connect an external credential provider (such as 1Password) so managed auth can read logins from it.',
	},
	'credentialProviders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disconnect and delete a credential provider. Cannot be undone.',
	},
	'credentialProviders.get': {
		riskLevel: 'read',
		description: 'Get a credential provider.',
	},
	'credentialProviders.list': {
		riskLevel: 'read',
		description: 'List connected credential providers (such as 1Password).',
	},
	'credentialProviders.listItems': {
		riskLevel: 'read',
		description:
			'List the logins a credential provider makes available (no secret values).',
	},
	'credentialProviders.test': {
		riskLevel: 'read',
		description: "Check that a credential provider's connection works.",
	},
	'credentialProviders.update': {
		riskLevel: 'write',
		description: "Change a credential provider's settings or token.",
	},
	'credentials.create': {
		riskLevel: 'write',
		description:
			'Store login values (username, password, TOTP secret) for a domain so managed auth can sign in by itself. Values are write-only.',
	},
	'credentials.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a stored credential. Cannot be undone.',
	},
	'credentials.get': {
		riskLevel: 'read',
		description:
			"Get a stored credential's metadata (values are never returned).",
	},
	'credentials.list': {
		riskLevel: 'read',
		description:
			'List stored credentials (names and domains; values are never returned).',
	},
	'credentials.totpCode': {
		riskLevel: 'read',
		description:
			'Get the current one-time code for a credential that has a TOTP secret, and when it expires.',
	},
	'credentials.update': {
		riskLevel: 'write',
		description: "Change a stored credential's values or settings.",
	},
	'deployments.create': {
		riskLevel: 'write',
		description:
			'Deploy a Kernel app from a zip (URL or base64) with its entrypoint, or from a source repository.',
	},
	'deployments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an app deployment. Cannot be undone.',
	},
	'deployments.get': {
		riskLevel: 'read',
		description:
			'Get a deployment and its status. Poll this instead of the event stream.',
	},
	'deployments.list': {
		riskLevel: 'read',
		description: 'List app deployments.',
	},
	'extensions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an uploaded extension. Cannot be undone.',
	},
	'extensions.download': {
		riskLevel: 'read',
		description: "Download an uploaded extension's zip. Returns a file.",
	},
	'extensions.downloadFromChromeStore': {
		riskLevel: 'read',
		description:
			'Download an extension from the Chrome Web Store as an unpacked zip, ready for extensions.upload. Returns a file.',
	},
	'extensions.get': {
		riskLevel: 'read',
		description: "Get an uploaded extension's metadata.",
	},
	'extensions.list': {
		riskLevel: 'read',
		description: 'List uploaded Chrome extensions.',
	},
	'extensions.upload': {
		riskLevel: 'write',
		description:
			'Upload a Chrome extension (a zip of the unpacked extension, as a URL or base64) to use in browsers by name.',
	},
	'invocations.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Run an action of a deployed Kernel app (billed per second). async: true returns at once; poll invocations.get for the result.',
	},
	'invocations.deleteBrowsers': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete every browser an invocation started. Cannot be undone.',
	},
	'invocations.get': {
		riskLevel: 'read',
		description:
			'Get an invocation: status, output and timing. Poll this instead of the event stream.',
	},
	'invocations.list': {
		riskLevel: 'read',
		description:
			'List app action invocations, filtered by app, action, status or time.',
	},
	'invocations.listBrowsers': {
		riskLevel: 'read',
		description: 'List the browsers an invocation started.',
	},
	'invocations.update': {
		riskLevel: 'write',
		description:
			"Change an invocation's status, for example mark it succeeded or failed with output.",
	},
	'organization.entitlements.get': {
		riskLevel: 'read',
		description: "Get what the org's plan includes (features and quotas).",
	},
	'organization.limits.get': {
		riskLevel: 'read',
		description:
			"Get the org's limits and current use: concurrent browsers, managed auth connections, vaults.",
	},
	'organization.limits.update': {
		riskLevel: 'write',
		description:
			'Set the default concurrent-browser cap for projects without their own.',
	},
	'profiles.create': {
		riskLevel: 'write',
		description:
			'Create an empty browser profile (saved cookies and storage) to start browsers signed in. Fill it by starting a browser with profile {name, save_changes: true}, logging in, then deleting the browser.',
	},
	'profiles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a browser profile and its saved cookies and storage. Cannot be undone.',
	},
	'profiles.download': {
		riskLevel: 'read',
		description:
			"Download a profile's saved state as a tar.zst (or tar) archive. Returns a file. Holds session cookies: treat it as a credential.",
	},
	'profiles.get': {
		riskLevel: 'read',
		description: 'Get a browser profile by id or name.',
	},
	'profiles.list': {
		riskLevel: 'read',
		description: 'List saved browser profiles (name, id, last used).',
	},
	'profiles.update': {
		riskLevel: 'write',
		description: 'Rename a browser profile.',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project to keep browsers, profiles and keys separate within the org.',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project. Cannot be undone.',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project.',
	},
	'projects.limits.get': {
		riskLevel: 'read',
		description: "Get a project's concurrency limit and use.",
	},
	'projects.limits.update': {
		riskLevel: 'write',
		description: "Set a project's concurrent-browser cap.",
	},
	'projects.list': {
		riskLevel: 'read',
		description: "List the org's projects.",
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Rename or change a project.',
	},
	'proxies.check': {
		riskLevel: 'read',
		description: 'Check that a proxy works and see its exit IP.',
	},
	'proxies.create': {
		riskLevel: 'write',
		description:
			'Create a proxy configuration (datacenter, ISP, residential, mobile or your own) for browsers to route through.',
	},
	'proxies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a proxy configuration. Cannot be undone.',
	},
	'proxies.get': {
		riskLevel: 'read',
		description: 'Get a proxy configuration.',
	},
	'proxies.list': {
		riskLevel: 'read',
		description: 'List proxy configurations.',
	},
	'proxies.update': {
		riskLevel: 'write',
		description: 'Change a proxy configuration.',
	},
	'proxyIPs.get': {
		riskLevel: 'read',
		description: 'Get a reserved ISP proxy IP.',
	},
	'proxyIPs.list': {
		riskLevel: 'read',
		description: "List the org's reserved ISP proxy IPs.",
	},
	'reportTypes.get': {
		riskLevel: 'read',
		description: 'Get a report type and its schema.',
	},
	'reportTypes.list': {
		riskLevel: 'read',
		description: 'List report types.',
	},
	'reportTypes.versions.get': {
		riskLevel: 'read',
		description: "Get one version of a report type's schema.",
	},
	'reports.create': {
		riskLevel: 'write',
		description:
			"Submit a typed report against a task (validated against the report type's schema).",
	},
	'reports.get': {
		riskLevel: 'read',
		description: 'Get a report.',
	},
	'reports.list': {
		riskLevel: 'read',
		description: "List a task's reports, oldest first.",
	},
	'search.contents.fetch': {
		riskLevel: 'read',
		description:
			'Fetch the page contents of chosen results from an earlier search (by result_ids or the top limit results).',
	},
	'search.create': {
		riskLevel: 'read',
		description:
			"Search the web through one of Kernel's search providers and get ranked results (titles, URLs, snippets), kept for search.contents.fetch.",
	},
	'search.get': {
		riskLevel: 'read',
		description: 'Get a search that was run earlier, with its results.',
	},
	'search.providers.list': {
		riskLevel: 'read',
		description: 'List the search providers and the options each supports.',
	},
	'tasks.create': {
		riskLevel: 'write',
		description:
			'Record a task an agent is working on, optionally with the browsers it uses; submit reports against it.',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get a task.',
	},
	'tasks.linkBrowsers': {
		riskLevel: 'write',
		description: 'Link browser sessions to a task.',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List tasks, newest first.',
	},
	'telemetry.destinations.create': {
		riskLevel: 'write',
		description:
			'Add an OTLP destination that browser sessions export telemetry to.',
	},
	'telemetry.destinations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an OTLP telemetry destination. Cannot be undone.',
	},
	'telemetry.destinations.get': {
		riskLevel: 'read',
		description: 'Get an OTLP telemetry destination.',
	},
	'telemetry.destinations.list': {
		riskLevel: 'read',
		description: 'List OTLP telemetry destinations.',
	},
	'telemetry.destinations.update': {
		riskLevel: 'write',
		description: 'Update an OTLP telemetry destination.',
	},
	'vaultProviderConfigs.create': {
		riskLevel: 'write',
		description:
			"Register a vault provider configuration (card or payment provider settings shared by the org's projects).",
	},
	'vaultProviderConfigs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an unused vault provider configuration. Cannot be undone.',
	},
	'vaultProviderConfigs.get': {
		riskLevel: 'read',
		description: 'Get a vault provider configuration.',
	},
	'vaultProviderConfigs.list': {
		riskLevel: 'read',
		description: 'List vault provider configurations.',
	},
	'vaultProviderConfigs.update': {
		riskLevel: 'write',
		description: 'Update a vault provider configuration.',
	},
	'vaults.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a vault and invalidate every item in it. Cannot be undone.',
	},
	'vaults.get': {
		riskLevel: 'read',
		description: 'Get a vault.',
	},
	'vaults.getEncryptionKey': {
		riskLevel: 'read',
		description:
			"Get a vault's public key, for encrypting credential values in a browser before they are sent.",
	},
	'vaults.items.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a vault item and invalidate its secret. Cannot be undone.',
	},
	'vaults.items.events': {
		riskLevel: 'read',
		description: "List a vault item's audit events.",
	},
	'vaults.items.get': {
		riskLevel: 'read',
		description:
			'Get a vault item and the operations it currently offers (wait up to 60 s for a change).',
	},
	'vaults.items.list': {
		riskLevel: 'read',
		description: "List a vault's items (no secret values).",
	},
	'vaults.items.performOperation': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Run an operation a vault item offers, such as fill, authorize, confirm_transaction or add_payment_method. Some move money or use a card: confirm with the person first.',
	},
	'vaults.items.update': {
		riskLevel: 'write',
		description:
			"Update a vault item's card specification or credential values.",
	},
	'vaults.items.upsert': {
		riskLevel: 'write',
		description:
			'Create a vault item (card, credential, wallet or payment request) under a key, or get the identical existing one.',
	},
	'vaults.list': {
		riskLevel: 'read',
		description: 'List vaults in the project.',
	},
	'vaults.upsert': {
		riskLevel: 'write',
		description:
			'Create a vault (a project-scoped store of secrets, cards and credentials for browsers to use), or get the existing one with that name.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kernelEndpointsNested>;
