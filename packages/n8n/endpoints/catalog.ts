// Generated with endpoints/operation-types.ts from n8n's OpenAPI spec:
// one entry per operation in n8n-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { n8nSchemaEntry } from './openapi-schema';
import { createN8nOperation as op } from './operations';

export const n8nEndpointsNested = {
	agents: {
		archive: op('agents.archive'),
		create: op('agents.create'),
		delete: op('agents.delete'),
		executions: {
			list: op('agents.executions.list'),
			stop: op('agents.executions.stop'),
		},
		get: op('agents.get'),
		list: op('agents.list'),
		publish: op('agents.publish'),
		run: op('agents.run'),
		unarchive: op('agents.unarchive'),
		unpublish: op('agents.unpublish'),
		update: op('agents.update'),
		versions: {
			get: op('agents.versions.get'),
			list: op('agents.versions.list'),
		},
	},
	aiPreferences: {
		create: op('aiPreferences.create'),
		delete: op('aiPreferences.delete'),
		get: op('aiPreferences.get'),
		list: op('aiPreferences.list'),
		update: op('aiPreferences.update'),
	},
	audit: {
		generate: op('audit.generate'),
	},
	communityPackages: {
		install: op('communityPackages.install'),
		list: op('communityPackages.list'),
		uninstall: op('communityPackages.uninstall'),
		update: op('communityPackages.update'),
	},
	credentialTypePolicies: {
		attachments: {
			get: op('credentialTypePolicies.attachments.get'),
			replace: op('credentialTypePolicies.attachments.replace'),
		},
		documents: {
			create: op('credentialTypePolicies.documents.create'),
			delete: op('credentialTypePolicies.documents.delete'),
			get: op('credentialTypePolicies.documents.get'),
			list: op('credentialTypePolicies.documents.list'),
			update: op('credentialTypePolicies.documents.update'),
		},
		getInstance: op('credentialTypePolicies.getInstance'),
		getProject: op('credentialTypePolicies.getProject'),
		setInstance: op('credentialTypePolicies.setInstance'),
		setProject: op('credentialTypePolicies.setProject'),
	},
	credentials: {
		create: op('credentials.create'),
		delete: op('credentials.delete'),
		get: op('credentials.get'),
		getDependencies: op('credentials.getDependencies'),
		getSchema: op('credentials.getSchema'),
		list: op('credentials.list'),
		test: op('credentials.test'),
		transfer: op('credentials.transfer'),
		update: op('credentials.update'),
	},
	dataTables: {
		columns: {
			create: op('dataTables.columns.create'),
			delete: op('dataTables.columns.delete'),
			list: op('dataTables.columns.list'),
			update: op('dataTables.columns.update'),
		},
		create: op('dataTables.create'),
		delete: op('dataTables.delete'),
		get: op('dataTables.get'),
		getDependencies: op('dataTables.getDependencies'),
		list: op('dataTables.list'),
		rows: {
			clear: op('dataTables.rows.clear'),
			delete: op('dataTables.rows.delete'),
			insert: op('dataTables.rows.insert'),
			list: op('dataTables.rows.list'),
			update: op('dataTables.rows.update'),
			upsert: op('dataTables.rows.upsert'),
		},
		update: op('dataTables.update'),
	},
	discover: {
		get: op('discover.get'),
	},
	evaluations: {
		cancelRun: op('evaluations.cancelRun'),
		getRun: op('evaluations.getRun'),
		listCases: op('evaluations.listCases'),
		listRuns: op('evaluations.listRuns'),
		startRun: op('evaluations.startRun'),
	},
	executions: {
		delete: op('executions.delete'),
		get: op('executions.get'),
		getTags: op('executions.getTags'),
		list: op('executions.list'),
		retry: op('executions.retry'),
		setTags: op('executions.setTags'),
		stop: op('executions.stop'),
		stopMany: op('executions.stopMany'),
	},
	folders: {
		create: op('folders.create'),
		delete: op('folders.delete'),
		get: op('folders.get'),
		list: op('folders.list'),
		update: op('folders.update'),
	},
	insights: {
		getSummary: op('insights.getSummary'),
	},
	nodeTypePolicies: {
		attachments: {
			get: op('nodeTypePolicies.attachments.get'),
			replace: op('nodeTypePolicies.attachments.replace'),
		},
		documents: {
			create: op('nodeTypePolicies.documents.create'),
			delete: op('nodeTypePolicies.documents.delete'),
			get: op('nodeTypePolicies.documents.get'),
			list: op('nodeTypePolicies.documents.list'),
			update: op('nodeTypePolicies.documents.update'),
		},
		getInstance: op('nodeTypePolicies.getInstance'),
		getProject: op('nodeTypePolicies.getProject'),
		setInstance: op('nodeTypePolicies.setInstance'),
		setProject: op('nodeTypePolicies.setProject'),
	},
	packages: {
		export: op('packages.export'),
		import: op('packages.import'),
		importSelection: op('packages.importSelection'),
	},
	projects: {
		create: op('projects.create'),
		delete: op('projects.delete'),
		list: op('projects.list'),
		update: op('projects.update'),
		users: {
			add: op('projects.users.add'),
			changeRole: op('projects.users.changeRole'),
			list: op('projects.users.list'),
			remove: op('projects.users.remove'),
		},
	},
	promotions: {
		environments: {
			addProject: op('promotions.environments.addProject'),
			apply: op('promotions.environments.apply'),
			connect: op('promotions.environments.connect'),
			continueApply: op('promotions.environments.continueApply'),
			create: op('promotions.environments.create'),
			delete: op('promotions.environments.delete'),
			disconnect: op('promotions.environments.disconnect'),
			get: op('promotions.environments.get'),
			getChangeDetails: op('promotions.environments.getChangeDetails'),
			list: op('promotions.environments.list'),
			listChanges: op('promotions.environments.listChanges'),
			listMissingProjects: op('promotions.environments.listMissingProjects'),
			listProjects: op('promotions.environments.listProjects'),
			promote: op('promotions.environments.promote'),
			removeProject: op('promotions.environments.removeProject'),
			update: op('promotions.environments.update'),
		},
		projects: {
			apply: op('promotions.projects.apply'),
			continueApply: op('promotions.projects.continueApply'),
			getChangeDetails: op('promotions.projects.getChangeDetails'),
			listChanges: op('promotions.projects.listChanges'),
			promote: op('promotions.projects.promote'),
		},
		providers: {
			create: op('promotions.providers.create'),
			delete: op('promotions.providers.delete'),
			get: op('promotions.providers.get'),
			list: op('promotions.providers.list'),
			listBranches: op('promotions.providers.listBranches'),
			listRepositories: op('promotions.providers.listRepositories'),
			update: op('promotions.providers.update'),
		},
		reviews: {
			get: op('promotions.reviews.get'),
			list: op('promotions.reviews.list'),
		},
		settings: {
			get: op('promotions.settings.get'),
			update: op('promotions.settings.update'),
		},
	},
	roleMappingRules: {
		create: op('roleMappingRules.create'),
		delete: op('roleMappingRules.delete'),
		list: op('roleMappingRules.list'),
		move: op('roleMappingRules.move'),
		update: op('roleMappingRules.update'),
	},
	roles: {
		create: op('roles.create'),
		delete: op('roles.delete'),
		get: op('roles.get'),
		list: op('roles.list'),
		update: op('roles.update'),
	},
	settings: {
		ldap: {
			get: op('settings.ldap.get'),
			listSyncs: op('settings.ldap.listSyncs'),
			runSync: op('settings.ldap.runSync'),
			update: op('settings.ldap.update'),
		},
		logStreaming: {
			createDestination: op('settings.logStreaming.createDestination'),
			deleteDestination: op('settings.logStreaming.deleteDestination'),
			getDestination: op('settings.logStreaming.getDestination'),
			listDestinations: op('settings.logStreaming.listDestinations'),
			listEventTypes: op('settings.logStreaming.listEventTypes'),
			testDestination: op('settings.logStreaming.testDestination'),
			updateDestination: op('settings.logStreaming.updateDestination'),
		},
		oidc: {
			get: op('settings.oidc.get'),
			update: op('settings.oidc.update'),
		},
		otel: {
			get: op('settings.otel.get'),
			testTrace: op('settings.otel.testTrace'),
			update: op('settings.otel.update'),
		},
		rateLimits: {
			get: op('settings.rateLimits.get'),
			update: op('settings.rateLimits.update'),
		},
		saml: {
			get: op('settings.saml.get'),
			update: op('settings.saml.update'),
		},
		securityPolicy: {
			get: op('settings.securityPolicy.get'),
			update: op('settings.securityPolicy.update'),
		},
	},
	sourceControl: {
		getStatus: op('sourceControl.getStatus'),
		pull: op('sourceControl.pull'),
		push: op('sourceControl.push'),
	},
	tags: {
		create: op('tags.create'),
		delete: op('tags.delete'),
		get: op('tags.get'),
		list: op('tags.list'),
		update: op('tags.update'),
	},
	users: {
		changeRole: op('users.changeRole'),
		delete: op('users.delete'),
		get: op('users.get'),
		invite: op('users.invite'),
		list: op('users.list'),
	},
	variables: {
		create: op('variables.create'),
		delete: op('variables.delete'),
		list: op('variables.list'),
		update: op('variables.update'),
	},
	workflows: {
		activate: op('workflows.activate'),
		archive: op('workflows.archive'),
		create: op('workflows.create'),
		deactivate: op('workflows.deactivate'),
		delete: op('workflows.delete'),
		get: op('workflows.get'),
		getDependencies: op('workflows.getDependencies'),
		getTags: op('workflows.getTags'),
		getVersion: op('workflows.getVersion'),
		getVersionLegacy: op('workflows.getVersionLegacy'),
		list: op('workflows.list'),
		listHistory: op('workflows.listHistory'),
		publish: op('workflows.publish'),
		run: op('workflows.run'),
		setTags: op('workflows.setTags'),
		transfer: op('workflows.transfer'),
		unarchive: op('workflows.unarchive'),
		unpublish: op('workflows.unpublish'),
		update: op('workflows.update'),
	},
} as const;

export const n8nEndpointSchemas = {
	'agents.archive': n8nSchemaEntry('agents.archive'),
	'agents.create': n8nSchemaEntry('agents.create'),
	'agents.delete': n8nSchemaEntry('agents.delete'),
	'agents.executions.list': n8nSchemaEntry('agents.executions.list'),
	'agents.executions.stop': n8nSchemaEntry('agents.executions.stop'),
	'agents.get': n8nSchemaEntry('agents.get'),
	'agents.list': n8nSchemaEntry('agents.list'),
	'agents.publish': n8nSchemaEntry('agents.publish'),
	'agents.run': n8nSchemaEntry('agents.run'),
	'agents.unarchive': n8nSchemaEntry('agents.unarchive'),
	'agents.unpublish': n8nSchemaEntry('agents.unpublish'),
	'agents.update': n8nSchemaEntry('agents.update'),
	'agents.versions.get': n8nSchemaEntry('agents.versions.get'),
	'agents.versions.list': n8nSchemaEntry('agents.versions.list'),
	'aiPreferences.create': n8nSchemaEntry('aiPreferences.create'),
	'aiPreferences.delete': n8nSchemaEntry('aiPreferences.delete'),
	'aiPreferences.get': n8nSchemaEntry('aiPreferences.get'),
	'aiPreferences.list': n8nSchemaEntry('aiPreferences.list'),
	'aiPreferences.update': n8nSchemaEntry('aiPreferences.update'),
	'audit.generate': n8nSchemaEntry('audit.generate'),
	'communityPackages.install': n8nSchemaEntry('communityPackages.install'),
	'communityPackages.list': n8nSchemaEntry('communityPackages.list'),
	'communityPackages.uninstall': n8nSchemaEntry('communityPackages.uninstall'),
	'communityPackages.update': n8nSchemaEntry('communityPackages.update'),
	'credentialTypePolicies.attachments.get': n8nSchemaEntry(
		'credentialTypePolicies.attachments.get',
	),
	'credentialTypePolicies.attachments.replace': n8nSchemaEntry(
		'credentialTypePolicies.attachments.replace',
	),
	'credentialTypePolicies.documents.create': n8nSchemaEntry(
		'credentialTypePolicies.documents.create',
	),
	'credentialTypePolicies.documents.delete': n8nSchemaEntry(
		'credentialTypePolicies.documents.delete',
	),
	'credentialTypePolicies.documents.get': n8nSchemaEntry(
		'credentialTypePolicies.documents.get',
	),
	'credentialTypePolicies.documents.list': n8nSchemaEntry(
		'credentialTypePolicies.documents.list',
	),
	'credentialTypePolicies.documents.update': n8nSchemaEntry(
		'credentialTypePolicies.documents.update',
	),
	'credentialTypePolicies.getInstance': n8nSchemaEntry(
		'credentialTypePolicies.getInstance',
	),
	'credentialTypePolicies.getProject': n8nSchemaEntry(
		'credentialTypePolicies.getProject',
	),
	'credentialTypePolicies.setInstance': n8nSchemaEntry(
		'credentialTypePolicies.setInstance',
	),
	'credentialTypePolicies.setProject': n8nSchemaEntry(
		'credentialTypePolicies.setProject',
	),
	'credentials.create': n8nSchemaEntry('credentials.create'),
	'credentials.delete': n8nSchemaEntry('credentials.delete'),
	'credentials.get': n8nSchemaEntry('credentials.get'),
	'credentials.getDependencies': n8nSchemaEntry('credentials.getDependencies'),
	'credentials.getSchema': n8nSchemaEntry('credentials.getSchema'),
	'credentials.list': n8nSchemaEntry('credentials.list'),
	'credentials.test': n8nSchemaEntry('credentials.test'),
	'credentials.transfer': n8nSchemaEntry('credentials.transfer'),
	'credentials.update': n8nSchemaEntry('credentials.update'),
	'dataTables.columns.create': n8nSchemaEntry('dataTables.columns.create'),
	'dataTables.columns.delete': n8nSchemaEntry('dataTables.columns.delete'),
	'dataTables.columns.list': n8nSchemaEntry('dataTables.columns.list'),
	'dataTables.columns.update': n8nSchemaEntry('dataTables.columns.update'),
	'dataTables.create': n8nSchemaEntry('dataTables.create'),
	'dataTables.delete': n8nSchemaEntry('dataTables.delete'),
	'dataTables.get': n8nSchemaEntry('dataTables.get'),
	'dataTables.getDependencies': n8nSchemaEntry('dataTables.getDependencies'),
	'dataTables.list': n8nSchemaEntry('dataTables.list'),
	'dataTables.rows.clear': n8nSchemaEntry('dataTables.rows.clear'),
	'dataTables.rows.delete': n8nSchemaEntry('dataTables.rows.delete'),
	'dataTables.rows.insert': n8nSchemaEntry('dataTables.rows.insert'),
	'dataTables.rows.list': n8nSchemaEntry('dataTables.rows.list'),
	'dataTables.rows.update': n8nSchemaEntry('dataTables.rows.update'),
	'dataTables.rows.upsert': n8nSchemaEntry('dataTables.rows.upsert'),
	'dataTables.update': n8nSchemaEntry('dataTables.update'),
	'discover.get': n8nSchemaEntry('discover.get'),
	'evaluations.cancelRun': n8nSchemaEntry('evaluations.cancelRun'),
	'evaluations.getRun': n8nSchemaEntry('evaluations.getRun'),
	'evaluations.listCases': n8nSchemaEntry('evaluations.listCases'),
	'evaluations.listRuns': n8nSchemaEntry('evaluations.listRuns'),
	'evaluations.startRun': n8nSchemaEntry('evaluations.startRun'),
	'executions.delete': n8nSchemaEntry('executions.delete'),
	'executions.get': n8nSchemaEntry('executions.get'),
	'executions.getTags': n8nSchemaEntry('executions.getTags'),
	'executions.list': n8nSchemaEntry('executions.list'),
	'executions.retry': n8nSchemaEntry('executions.retry'),
	'executions.setTags': n8nSchemaEntry('executions.setTags'),
	'executions.stop': n8nSchemaEntry('executions.stop'),
	'executions.stopMany': n8nSchemaEntry('executions.stopMany'),
	'folders.create': n8nSchemaEntry('folders.create'),
	'folders.delete': n8nSchemaEntry('folders.delete'),
	'folders.get': n8nSchemaEntry('folders.get'),
	'folders.list': n8nSchemaEntry('folders.list'),
	'folders.update': n8nSchemaEntry('folders.update'),
	'insights.getSummary': n8nSchemaEntry('insights.getSummary'),
	'nodeTypePolicies.attachments.get': n8nSchemaEntry(
		'nodeTypePolicies.attachments.get',
	),
	'nodeTypePolicies.attachments.replace': n8nSchemaEntry(
		'nodeTypePolicies.attachments.replace',
	),
	'nodeTypePolicies.documents.create': n8nSchemaEntry(
		'nodeTypePolicies.documents.create',
	),
	'nodeTypePolicies.documents.delete': n8nSchemaEntry(
		'nodeTypePolicies.documents.delete',
	),
	'nodeTypePolicies.documents.get': n8nSchemaEntry(
		'nodeTypePolicies.documents.get',
	),
	'nodeTypePolicies.documents.list': n8nSchemaEntry(
		'nodeTypePolicies.documents.list',
	),
	'nodeTypePolicies.documents.update': n8nSchemaEntry(
		'nodeTypePolicies.documents.update',
	),
	'nodeTypePolicies.getInstance': n8nSchemaEntry(
		'nodeTypePolicies.getInstance',
	),
	'nodeTypePolicies.getProject': n8nSchemaEntry('nodeTypePolicies.getProject'),
	'nodeTypePolicies.setInstance': n8nSchemaEntry(
		'nodeTypePolicies.setInstance',
	),
	'nodeTypePolicies.setProject': n8nSchemaEntry('nodeTypePolicies.setProject'),
	'packages.export': n8nSchemaEntry('packages.export'),
	'packages.import': n8nSchemaEntry('packages.import'),
	'packages.importSelection': n8nSchemaEntry('packages.importSelection'),
	'projects.create': n8nSchemaEntry('projects.create'),
	'projects.delete': n8nSchemaEntry('projects.delete'),
	'projects.list': n8nSchemaEntry('projects.list'),
	'projects.update': n8nSchemaEntry('projects.update'),
	'projects.users.add': n8nSchemaEntry('projects.users.add'),
	'projects.users.changeRole': n8nSchemaEntry('projects.users.changeRole'),
	'projects.users.list': n8nSchemaEntry('projects.users.list'),
	'projects.users.remove': n8nSchemaEntry('projects.users.remove'),
	'promotions.environments.addProject': n8nSchemaEntry(
		'promotions.environments.addProject',
	),
	'promotions.environments.apply': n8nSchemaEntry(
		'promotions.environments.apply',
	),
	'promotions.environments.connect': n8nSchemaEntry(
		'promotions.environments.connect',
	),
	'promotions.environments.continueApply': n8nSchemaEntry(
		'promotions.environments.continueApply',
	),
	'promotions.environments.create': n8nSchemaEntry(
		'promotions.environments.create',
	),
	'promotions.environments.delete': n8nSchemaEntry(
		'promotions.environments.delete',
	),
	'promotions.environments.disconnect': n8nSchemaEntry(
		'promotions.environments.disconnect',
	),
	'promotions.environments.get': n8nSchemaEntry('promotions.environments.get'),
	'promotions.environments.getChangeDetails': n8nSchemaEntry(
		'promotions.environments.getChangeDetails',
	),
	'promotions.environments.list': n8nSchemaEntry(
		'promotions.environments.list',
	),
	'promotions.environments.listChanges': n8nSchemaEntry(
		'promotions.environments.listChanges',
	),
	'promotions.environments.listMissingProjects': n8nSchemaEntry(
		'promotions.environments.listMissingProjects',
	),
	'promotions.environments.listProjects': n8nSchemaEntry(
		'promotions.environments.listProjects',
	),
	'promotions.environments.promote': n8nSchemaEntry(
		'promotions.environments.promote',
	),
	'promotions.environments.removeProject': n8nSchemaEntry(
		'promotions.environments.removeProject',
	),
	'promotions.environments.update': n8nSchemaEntry(
		'promotions.environments.update',
	),
	'promotions.projects.apply': n8nSchemaEntry('promotions.projects.apply'),
	'promotions.projects.continueApply': n8nSchemaEntry(
		'promotions.projects.continueApply',
	),
	'promotions.projects.getChangeDetails': n8nSchemaEntry(
		'promotions.projects.getChangeDetails',
	),
	'promotions.projects.listChanges': n8nSchemaEntry(
		'promotions.projects.listChanges',
	),
	'promotions.projects.promote': n8nSchemaEntry('promotions.projects.promote'),
	'promotions.providers.create': n8nSchemaEntry('promotions.providers.create'),
	'promotions.providers.delete': n8nSchemaEntry('promotions.providers.delete'),
	'promotions.providers.get': n8nSchemaEntry('promotions.providers.get'),
	'promotions.providers.list': n8nSchemaEntry('promotions.providers.list'),
	'promotions.providers.listBranches': n8nSchemaEntry(
		'promotions.providers.listBranches',
	),
	'promotions.providers.listRepositories': n8nSchemaEntry(
		'promotions.providers.listRepositories',
	),
	'promotions.providers.update': n8nSchemaEntry('promotions.providers.update'),
	'promotions.reviews.get': n8nSchemaEntry('promotions.reviews.get'),
	'promotions.reviews.list': n8nSchemaEntry('promotions.reviews.list'),
	'promotions.settings.get': n8nSchemaEntry('promotions.settings.get'),
	'promotions.settings.update': n8nSchemaEntry('promotions.settings.update'),
	'roleMappingRules.create': n8nSchemaEntry('roleMappingRules.create'),
	'roleMappingRules.delete': n8nSchemaEntry('roleMappingRules.delete'),
	'roleMappingRules.list': n8nSchemaEntry('roleMappingRules.list'),
	'roleMappingRules.move': n8nSchemaEntry('roleMappingRules.move'),
	'roleMappingRules.update': n8nSchemaEntry('roleMappingRules.update'),
	'roles.create': n8nSchemaEntry('roles.create'),
	'roles.delete': n8nSchemaEntry('roles.delete'),
	'roles.get': n8nSchemaEntry('roles.get'),
	'roles.list': n8nSchemaEntry('roles.list'),
	'roles.update': n8nSchemaEntry('roles.update'),
	'settings.ldap.get': n8nSchemaEntry('settings.ldap.get'),
	'settings.ldap.listSyncs': n8nSchemaEntry('settings.ldap.listSyncs'),
	'settings.ldap.runSync': n8nSchemaEntry('settings.ldap.runSync'),
	'settings.ldap.update': n8nSchemaEntry('settings.ldap.update'),
	'settings.logStreaming.createDestination': n8nSchemaEntry(
		'settings.logStreaming.createDestination',
	),
	'settings.logStreaming.deleteDestination': n8nSchemaEntry(
		'settings.logStreaming.deleteDestination',
	),
	'settings.logStreaming.getDestination': n8nSchemaEntry(
		'settings.logStreaming.getDestination',
	),
	'settings.logStreaming.listDestinations': n8nSchemaEntry(
		'settings.logStreaming.listDestinations',
	),
	'settings.logStreaming.listEventTypes': n8nSchemaEntry(
		'settings.logStreaming.listEventTypes',
	),
	'settings.logStreaming.testDestination': n8nSchemaEntry(
		'settings.logStreaming.testDestination',
	),
	'settings.logStreaming.updateDestination': n8nSchemaEntry(
		'settings.logStreaming.updateDestination',
	),
	'settings.oidc.get': n8nSchemaEntry('settings.oidc.get'),
	'settings.oidc.update': n8nSchemaEntry('settings.oidc.update'),
	'settings.otel.get': n8nSchemaEntry('settings.otel.get'),
	'settings.otel.testTrace': n8nSchemaEntry('settings.otel.testTrace'),
	'settings.otel.update': n8nSchemaEntry('settings.otel.update'),
	'settings.rateLimits.get': n8nSchemaEntry('settings.rateLimits.get'),
	'settings.rateLimits.update': n8nSchemaEntry('settings.rateLimits.update'),
	'settings.saml.get': n8nSchemaEntry('settings.saml.get'),
	'settings.saml.update': n8nSchemaEntry('settings.saml.update'),
	'settings.securityPolicy.get': n8nSchemaEntry('settings.securityPolicy.get'),
	'settings.securityPolicy.update': n8nSchemaEntry(
		'settings.securityPolicy.update',
	),
	'sourceControl.getStatus': n8nSchemaEntry('sourceControl.getStatus'),
	'sourceControl.pull': n8nSchemaEntry('sourceControl.pull'),
	'sourceControl.push': n8nSchemaEntry('sourceControl.push'),
	'tags.create': n8nSchemaEntry('tags.create'),
	'tags.delete': n8nSchemaEntry('tags.delete'),
	'tags.get': n8nSchemaEntry('tags.get'),
	'tags.list': n8nSchemaEntry('tags.list'),
	'tags.update': n8nSchemaEntry('tags.update'),
	'users.changeRole': n8nSchemaEntry('users.changeRole'),
	'users.delete': n8nSchemaEntry('users.delete'),
	'users.get': n8nSchemaEntry('users.get'),
	'users.invite': n8nSchemaEntry('users.invite'),
	'users.list': n8nSchemaEntry('users.list'),
	'variables.create': n8nSchemaEntry('variables.create'),
	'variables.delete': n8nSchemaEntry('variables.delete'),
	'variables.list': n8nSchemaEntry('variables.list'),
	'variables.update': n8nSchemaEntry('variables.update'),
	'workflows.activate': n8nSchemaEntry('workflows.activate'),
	'workflows.archive': n8nSchemaEntry('workflows.archive'),
	'workflows.create': n8nSchemaEntry('workflows.create'),
	'workflows.deactivate': n8nSchemaEntry('workflows.deactivate'),
	'workflows.delete': n8nSchemaEntry('workflows.delete'),
	'workflows.get': n8nSchemaEntry('workflows.get'),
	'workflows.getDependencies': n8nSchemaEntry('workflows.getDependencies'),
	'workflows.getTags': n8nSchemaEntry('workflows.getTags'),
	'workflows.getVersion': n8nSchemaEntry('workflows.getVersion'),
	'workflows.getVersionLegacy': n8nSchemaEntry('workflows.getVersionLegacy'),
	'workflows.list': n8nSchemaEntry('workflows.list'),
	'workflows.listHistory': n8nSchemaEntry('workflows.listHistory'),
	'workflows.publish': n8nSchemaEntry('workflows.publish'),
	'workflows.run': n8nSchemaEntry('workflows.run'),
	'workflows.setTags': n8nSchemaEntry('workflows.setTags'),
	'workflows.transfer': n8nSchemaEntry('workflows.transfer'),
	'workflows.unarchive': n8nSchemaEntry('workflows.unarchive'),
	'workflows.unpublish': n8nSchemaEntry('workflows.unpublish'),
	'workflows.update': n8nSchemaEntry('workflows.update'),
} satisfies RequiredPluginEndpointSchemas<typeof n8nEndpointsNested>;

export const n8nEndpointMeta = {
	'agents.archive': {
		riskLevel: 'write',
		description:
			'Archive an agent. Soft-deletes an agent by archiving it. Idempotent: archiving an already archived agent returns 200 with the current agent. Requires the agent:delete API key scope. Added in n8n 2.50; older instances answer 404.',
	},
	'agents.create': {
		riskLevel: 'write',
		description:
			'Create an agent. Create an agent in your personal project or a team project you have access to. Requires the agent:create API key scope.',
	},
	'agents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an agent. Delete an agent and its associated resources. The agent is deleted right away: it does not need to be archived first, and a published agent with live channels is deleted too. This matches the workflow delete endpoint. Requires the agent:delete API key scope. Cannot be undone.',
	},
	'agents.executions.list': {
		riskLevel: 'read',
		description:
			'List agent executions. List the runs of one agent that you can see, newest first. Project sessions are visible to every project member, private sessions only to their owner. The response is one cursor page: read the next page with the cursor query parameter. Added in n8n 2.50; older instances answer 404.',
	},
	'agents.executions.stop': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Stop an agent run. Stop a run of this agent. A finished run returns its status. An unknown execution returns 404. Requires the agent:execute API key scope. Added in n8n 2.50; older instances answer 404.',
	},
	'agents.get': {
		riskLevel: 'read',
		description:
			'Retrieve an agent. Retrieve one agent by ID. The response carries the agent configuration that the update endpoint writes back. Requires the agent:read API key scope.',
	},
	'agents.list': {
		riskLevel: 'read',
		description:
			'List agents. List the agents in the projects where you hold the agent:list permission. The response is one cursor page: read the next page with the cursor query parameter. Narrow the list to one project with projectId. Requires the agent:list API key scope.',
	},
	'agents.publish': {
		riskLevel: 'destructive',
		description:
			'Publish an agent. Publish an agent. Omit versionId to publish the current draft. Send versionId to publish a saved version. Requires the agent:publish API key scope. Added in n8n 2.50; older instances answer 404.',
	},
	'agents.run': {
		riskLevel: 'destructive',
		description:
			"Run an agent. Run the latest published version of an agent and wait for the final response. Omit sessionId to start a session. Send the same sessionId to continue that session. The Public API rejects an agent that has no published version, and an agent whose published version uses a tool that needs approval. Runs the agent: its model calls spend the connected model account's tokens. Added in n8n 2.50; older instances answer 404.",
	},
	'agents.unarchive': {
		riskLevel: 'write',
		description:
			'Unarchive an agent. Restores an archived agent. Requires the agent:delete API key scope. Added in n8n 2.50; older instances answer 404.',
	},
	'agents.unpublish': {
		riskLevel: 'write',
		description:
			'Unpublish an agent. Unpublish an agent. This stops the published version and disconnects its live channels. Requires the agent:unpublish API key scope. Added in n8n 2.50; older instances answer 404.',
	},
	'agents.update': {
		riskLevel: 'write',
		description:
			'Update an agent. Replace the configuration of an agent. Send the configuration and the concurrency token you read from the retrieve endpoint: a stale token returns a conflict. Fields the server manages are ignored, not rejected. Added in n8n 2.50; older instances answer 404.',
	},
	'agents.versions.get': {
		riskLevel: 'read',
		description:
			'Retrieve an agent version. Retrieve one saved version of an agent, including its configuration, tools, and skills. Requires the agent:read API key scope. Added in n8n 2.50; older instances answer 404.',
	},
	'agents.versions.list': {
		riskLevel: 'read',
		description:
			'Retrieve agent version history. Returns a paginated list of saved agent versions for an agent. The response is one cursor page: read the next page with the cursor query parameter. Requires the agent:read API key scope. Added in n8n 2.50; older instances answer 404.',
	},
	'aiPreferences.create': {
		riskLevel: 'write',
		description:
			'Create an AI preference. Create an AI preference for yourself (scope user), for a project (scope project, with projectId), or for the whole instance (scope instance). A preference for the instance or for another user needs the aiPreference:create permission. Added in n8n 2.50; older instances answer 404.',
	},
	'aiPreferences.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an AI preference. Delete an AI preference. Requires the aiPreference:delete API key scope. Added in n8n 2.50; older instances answer 404. Cannot be undone.',
	},
	'aiPreferences.get': {
		riskLevel: 'read',
		description:
			'Retrieve an AI preference. Retrieve one AI preference by ID. The content, scope, userId and projectId fields form the body that the update endpoint takes. Requires the aiPreference:read API key scope. Added in n8n 2.50; older instances answer 404.',
	},
	'aiPreferences.list': {
		riskLevel: 'read',
		description:
			'List AI preferences. List the AI preferences you can read: the instance preferences, your own preferences, and the preferences of the projects where you hold the projectAiPreference:list permission. With the aiPreference:list permission, the list also has the preferences of other users. Filter with scope and projectId. Added in n8n 2.50; older instances answer 404.',
	},
	'aiPreferences.update': {
		riskLevel: 'write',
		description:
			'Update an AI preference. Replace an AI preference with the full body: content, scope, and the userId or projectId of the scope. A user preference names its user in userId, and a project preference names its project in projectId. Added in n8n 2.50; older instances answer 404.',
	},
	'audit.generate': {
		riskLevel: 'read',
		description:
			'Generate an audit. Generate a security audit for your n8n instance. Requires the securityAudit:generate API key scope. Builds a security report of the instance (credentials, database, nodes, filesystem, instance).',
	},
	'communityPackages.install': {
		riskLevel: 'destructive',
		description:
			'Install a community package. Install a community package by npm name and optional version. Requires the communityPackage:install API key scope. Installs an npm package of nodes on the n8n server.',
	},
	'communityPackages.list': {
		riskLevel: 'read',
		description:
			'List installed community packages. Retrieve all installed community packages with pending update info. Requires the communityPackage:list API key scope.',
	},
	'communityPackages.uninstall': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Uninstall a community package. Uninstall a community package by name. Requires the communityPackage:uninstall API key scope. Cannot be undone.',
	},
	'communityPackages.update': {
		riskLevel: 'destructive',
		description:
			'Update a community package. Update an installed community package to a new version. Requires the communityPackage:update API key scope.',
	},
	'credentialTypePolicies.attachments.get': {
		riskLevel: 'read',
		description:
			"Preview: Retrieve a scope's attached policy documents. Preview — breaking changes may still occur without major version bump. Returns every attached policy document and the scope version. Attachments use evaluation order: floor first, then priority ascending within each group. Use this version when replacing the attachments. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.",
	},
	'credentialTypePolicies.attachments.replace': {
		riskLevel: 'write',
		description:
			"Preview: Replace a scope's attached policy documents. Preview — breaking changes may still occur without major version bump. Replaces every attachment on a scope. scopeId comes from the scope's GET response once it has been written. Each policyId and each (isFloor, priority) pair must be unique within the list. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.",
	},
	'credentialTypePolicies.documents.create': {
		riskLevel: 'write',
		description:
			'Preview: Create a credential type policy document. Preview — breaking changes may still occur without major version bump. Creates a reusable policy document that is not yet attached to any scope. Rule ids must be unique within the list. warnings lists rules that an earlier rule already shadows. Requires the credentialTypePolicy:manage API key scope. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.',
	},
	'credentialTypePolicies.documents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Preview: Delete a credential type policy document. Preview — breaking changes may still occur without major version bump. Deletes a policy document. A document that is still attached to a scope is rejected with 409; detach it first. Requires the credentialTypePolicy:manage API key scope. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'credentialTypePolicies.documents.get': {
		riskLevel: 'read',
		description:
			'Preview: Retrieve a credential type policy document. Preview — breaking changes may still occur without major version bump. Requires the credentialTypePolicy:manage API key scope. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.',
	},
	'credentialTypePolicies.documents.list': {
		riskLevel: 'read',
		description:
			'Preview: List credential type policy documents. Preview — breaking changes may still occur without major version bump. Returns a cursor-paginated list of reusable policy documents. Requires the credentialTypePolicy:manage API key scope. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.',
	},
	'credentialTypePolicies.documents.update': {
		riskLevel: 'write',
		description:
			"Preview: Replace the rules of a credential type policy document. Preview — breaking changes may still occur without major version bump. Replaces the document's whole rule list. version must equal the version last read; a stale value is rejected with 409. Every scope the document is attached to has its version bumped. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.",
	},
	'credentialTypePolicies.getInstance': {
		riskLevel: 'read',
		description:
			'Preview: Retrieve the instance credential type policy. Preview — breaking changes may still occur without major version bump. Returns the composed instance-scope policy: its default action and the rules of every attached policy document in evaluation order. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.',
	},
	'credentialTypePolicies.getProject': {
		riskLevel: 'read',
		description:
			"Preview: Retrieve a project's credential type policy. Preview — breaking changes may still occur without major version bump. Returns the project's own composed policy, not the result of combining it with the instance policy. A project that was never configured reports scopeId: null, no rules, defaultAction: allow, and version: 0. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.",
	},
	'credentialTypePolicies.setInstance': {
		riskLevel: 'write',
		description:
			'Preview: Replace the instance credential type policy. Preview — breaking changes may still occur without major version bump. Sets the instance default action and replaces the rules of its single policy document, creating both on first write. version must equal the version last read; a stale value is rejected with 409. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.',
	},
	'credentialTypePolicies.setProject': {
		riskLevel: 'write',
		description:
			"Preview: Replace a project's credential type policy. Preview — breaking changes may still occur without major version bump. Sets the project's default action and replaces the rules of its single policy document, creating both on first write. Only a team project can have a policy; a personal project is rejected with 400. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.",
	},
	'credentials.create': {
		riskLevel: 'write',
		description:
			'Create a credential. Creates a credential that can be used by nodes of the specified type. Requires the credential:create API key scope. The secret values go in data; n8n encrypts them and never returns them.',
	},
	'credentials.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete credential by ID. Deletes a credential from your instance. You must be the owner of the credential. Requires the credential:delete API key scope. Cannot be undone.',
	},
	'credentials.get': {
		riskLevel: 'read',
		description:
			'Get credential by ID. Retrieves a credential by ID. Credential data (secrets) is not included. Requires the credential:read API key scope.',
	},
	'credentials.getDependencies': {
		riskLevel: 'read',
		description:
			'List credential dependencies. List the workflows and agents that use the credential. Requires the credential:read API key scope.',
	},
	'credentials.getSchema': {
		riskLevel: 'read',
		description:
			'Show credential data schema. (GET /credentials/schema/{credentialTypeName})',
	},
	'credentials.list': {
		riskLevel: 'read',
		description:
			'List credentials. Retrieve all credentials from your instance. Only available for the instance owner and admin. Credential data (secrets) is not included. Requires the credential:list API key scope.',
	},
	'credentials.test': {
		riskLevel: 'read',
		description:
			'Test credential by ID. Tests a credential by ID using the stored credential data. Requires the credential:read API key scope.',
	},
	'credentials.transfer': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer a credential to another project. Transfer a credential to another project. Requires the credential:move API key scope.',
	},
	'credentials.update': {
		riskLevel: 'write',
		description:
			'Update credential by ID. Updates an existing credential. You must be the owner of the credential. Requires the credential:update API key scope.',
	},
	'dataTables.columns.create': {
		riskLevel: 'write',
		description:
			'Add a column to a data table. Add a new column to an existing data table. Requires the dataTableColumn:create API key scope.',
	},
	'dataTables.columns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a column. Remove a column from a data table. This will also delete all data in the column. Requires the dataTableColumn:delete API key scope. Cannot be undone.',
	},
	'dataTables.columns.list': {
		riskLevel: 'read',
		description:
			'List columns of a data table. Retrieve all columns for a specific data table. Requires the dataTableColumn:read API key scope.',
	},
	'dataTables.columns.update': {
		riskLevel: 'write',
		description:
			'Update a column. Rename and/or reorder a column in a data table. Requires the dataTableColumn:update API key scope.',
	},
	'dataTables.create': {
		riskLevel: 'write',
		description:
			'Create a new data table. Create a new data table in your personal project or a team project you have access to. Requires the dataTable:create API key scope.',
	},
	'dataTables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a data table. Delete a data table. This will also delete all rows in the table. Requires the dataTable:delete API key scope. Cannot be undone.',
	},
	'dataTables.get': {
		riskLevel: 'read',
		description:
			'Get a data table. Retrieve a specific data table by ID. Requires the dataTable:read API key scope.',
	},
	'dataTables.getDependencies': {
		riskLevel: 'read',
		description:
			'List data table dependencies. List the workflows that use the data table. Requires the dataTable:read API key scope.',
	},
	'dataTables.list': {
		riskLevel: 'read',
		description:
			'List all data tables. Retrieve a list of all data tables with optional filtering, sorting, and pagination. Each table includes sizeBytes, the value the size sort option orders by. Requires the dataTable:list API key scope.',
	},
	'dataTables.rows.clear': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Clear all rows from a data table. Permanently delete all rows from a data table. The table structure is retained. This action cannot be undone. Requires the dataTableRow:delete API key scope. Cannot be undone.',
	},
	'dataTables.rows.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete rows from a data table. Delete rows matching filter conditions from a data table. Filter is required to prevent accidental deletion of all data. Requires the dataTableRow:delete API key scope. Cannot be undone.',
	},
	'dataTables.rows.insert': {
		riskLevel: 'write',
		description:
			'Insert rows into a data table. Insert one or more rows into a data table. Requires the dataTableRow:create API key scope.',
	},
	'dataTables.rows.list': {
		riskLevel: 'read',
		description:
			'List rows of a data table. Retrieve rows from a data table with optional filtering, sorting, and pagination. Requires the dataTableRow:read API key scope.',
	},
	'dataTables.rows.update': {
		riskLevel: 'write',
		description:
			'Update rows in a data table. Update rows matching filter conditions in a data table. Requires the dataTableRow:update API key scope.',
	},
	'dataTables.rows.upsert': {
		riskLevel: 'write',
		description:
			'Upsert a row in a data table. Update an existing row, or insert a new one if no row matches the filter conditions. Requires the dataTableRow:upsert API key scope.',
	},
	'dataTables.update': {
		riskLevel: 'write',
		description:
			"Update a data table. Update a data table's name. Requires the dataTable:update API key scope.",
	},
	'discover.get': {
		riskLevel: 'read',
		description:
			"Discover available API capabilities. Returns a filtered capability map based on the caller's API key scopes. Each resource includes the operations and endpoints accessible to the authenticated API key. Use query parameters to narrow the response.",
	},
	'evaluations.cancelRun': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a test run. Cancel a running evaluation test run of a workflow. The user must also have the workflow:execute project scope. Requires the testRun:cancel API key scope. Needs a licence with evaluations (Business or Enterprise plans): without it n8n answers 403.',
	},
	'evaluations.getRun': {
		riskLevel: 'read',
		description:
			'Retrieve a test run. Retrieve a single evaluation test run of a workflow, including its aggregated metrics and final result. Requires the testRun:read API key scope.',
	},
	'evaluations.listCases': {
		riskLevel: 'read',
		description:
			'Retrieve test run cases. Retrieve the per-case results of an evaluation test run. Requires the execution:read project scope. Requires the testRun:read API key scope.',
	},
	'evaluations.listRuns': {
		riskLevel: 'read',
		description:
			'Retrieve test runs. Retrieve the evaluation test runs of a workflow. Requires the testRun:list API key scope.',
	},
	'evaluations.startRun': {
		riskLevel: 'destructive',
		description:
			'Trigger a test run. Start a new evaluation test run for a workflow. The workflow must contain a configured evaluation trigger. The user must also have the workflow:execute project scope. Requires the testRun:create API key scope. Needs a licence with evaluations (Business or Enterprise plans): without it n8n answers 403.',
	},
	'executions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an execution. Deletes an execution from your instance. Requires the execution:delete API key scope. Cannot be undone.',
	},
	'executions.get': {
		riskLevel: 'read',
		description:
			'Retrieve an execution. Retrieve an execution from your instance. Requires the execution:read API key scope.',
	},
	'executions.getTags': {
		riskLevel: 'read',
		description:
			'Get execution tags. Get annotation tags for an execution. Requires the executionTags:list API key scope.',
	},
	'executions.list': {
		riskLevel: 'read',
		description:
			'Retrieve all executions. Retrieve all executions from your instance. Requires the execution:list API key scope.',
	},
	'executions.retry': {
		riskLevel: 'destructive',
		description:
			'Retry an execution. Retry an execution from your instance. Requires the execution:retry API key scope. Runs the failed execution again, with the same side effects as the first run.',
	},
	'executions.setTags': {
		riskLevel: 'write',
		description:
			'Update tags of an execution. Update annotation tags of an execution. Requires the executionTags:update API key scope.',
	},
	'executions.stop': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Stop an execution. Stop an execution by id. Requires the execution:stop API key scope.',
	},
	'executions.stopMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Stop multiple executions. Stop multiple executions from your instance based on filter criteria. Requires the execution:stop API key scope.',
	},
	'folders.create': {
		riskLevel: 'write',
		description:
			'Create a folder. Create a folder within a project. Requires the folder:create API key scope. Needs folders in the licence (the free registered Community licence has them): without it n8n answers 403.',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a folder. Delete a folder within a project. When transferToFolderId is provided, workflows and sub-folders are moved to the target folder before deletion. When omitted, workflows are moved to the project root and archived, and child folders are deleted. Requires the folder:delete API key scope. Needs folders in the licence (the free registered Community licence has them): without it n8n answers 403. Cannot be undone.',
	},
	'folders.get': {
		riskLevel: 'read',
		description:
			'Get folder details. Get folder details including sub-folder and workflow counts. Requires the folder:read API key scope. Needs folders in the licence (the free registered Community licence has them): without it n8n answers 403.',
	},
	'folders.list': {
		riskLevel: 'read',
		description:
			'Retrieve folders. Retrieve folders within a project. Supports filtering, sorting, field selection, and pagination. Requires the folder:list API key scope. Needs folders in the licence (the free registered Community licence has them): without it n8n answers 403.',
	},
	'folders.update': {
		riskLevel: 'write',
		description:
			'Update a folder. Update folder name or parent folder. Requires the folder:update API key scope. Needs folders in the licence (the free registered Community licence has them): without it n8n answers 403.',
	},
	'insights.getSummary': {
		riskLevel: 'read',
		description:
			'Retrieve insights summary. Retrieve the insights summary for the selected date range. Requires the insights:read API key scope.',
	},
	'nodeTypePolicies.attachments.get': {
		riskLevel: 'read',
		description:
			"Preview: Retrieve a scope's attached policy documents. Preview — breaking changes may still occur without major version bump. Returns every attached policy document and the scope version. Attachments use evaluation order: floor first, then priority ascending within each group. Use this version when replacing the attachments. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.",
	},
	'nodeTypePolicies.attachments.replace': {
		riskLevel: 'write',
		description:
			"Preview: Replace a scope's attached policy documents. Preview — breaking changes may still occur without major version bump. Replaces every attachment on a scope. scopeId comes from the scope's GET response once it has been written. Each policyId and each (isFloor, priority) pair must be unique within the list. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.",
	},
	'nodeTypePolicies.documents.create': {
		riskLevel: 'write',
		description:
			'Preview: Create a node type policy document. Preview — breaking changes may still occur without major version bump. Creates a reusable policy document that is not yet attached to any scope. Rule ids must be unique within the list. warnings lists rules that an earlier rule already shadows. Requires the nodeTypePolicy:manage API key scope. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.',
	},
	'nodeTypePolicies.documents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Preview: Delete a node type policy document. Preview — breaking changes may still occur without major version bump. Deletes a policy document. A document that is still attached to a scope is rejected with 409; detach it first. Requires the nodeTypePolicy:manage API key scope. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'nodeTypePolicies.documents.get': {
		riskLevel: 'read',
		description:
			'Preview: Retrieve a node type policy document. Preview — breaking changes may still occur without major version bump. Requires the nodeTypePolicy:manage API key scope. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.',
	},
	'nodeTypePolicies.documents.list': {
		riskLevel: 'read',
		description:
			'Preview: List node type policy documents. Preview — breaking changes may still occur without major version bump. Returns a cursor-paginated list of reusable policy documents. Requires the nodeTypePolicy:manage API key scope. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.',
	},
	'nodeTypePolicies.documents.update': {
		riskLevel: 'write',
		description:
			"Preview: Replace the rules of a node type policy document. Preview — breaking changes may still occur without major version bump. Replaces the document's whole rule list. version must equal the version last read; a stale value is rejected with 409. Every scope the document is attached to has its version bumped. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.",
	},
	'nodeTypePolicies.getInstance': {
		riskLevel: 'read',
		description:
			'Preview: Retrieve the instance node type policy. Preview — breaking changes may still occur without major version bump. Returns the composed instance-scope policy: its default action and the rules of every attached policy document in evaluation order. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.',
	},
	'nodeTypePolicies.getProject': {
		riskLevel: 'read',
		description:
			"Preview: Retrieve a project's node type policy. Preview — breaking changes may still occur without major version bump. Returns the project's own composed policy, not the result of combining it with the instance policy. A project that was never configured reports scopeId: null, no rules, defaultAction: allow, and version: 0. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.",
	},
	'nodeTypePolicies.setInstance': {
		riskLevel: 'write',
		description:
			'Preview: Replace the instance node type policy. Preview — breaking changes may still occur without major version bump. Sets the instance default action and replaces the rules of its single policy document, creating both on first write. version must equal the version last read; a stale value is rejected with 409. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.',
	},
	'nodeTypePolicies.setProject': {
		riskLevel: 'write',
		description:
			"Preview: Replace a project's node type policy. Preview — breaking changes may still occur without major version bump. Sets the project's default action and replaces the rules of its single policy document, creating both on first write. Only a team project can have a policy; a personal project is rejected with 400. Needs a licence with feat:typeAvailabilityPolicies (Business or Enterprise plans): without it n8n answers 403.",
	},
	'packages.export': {
		riskLevel: 'read',
		description:
			'Beta: Export agents, workflows, folders, or projects as an n8n package. Beta — breaking changes may still occur without major version bump. Export agents, workflows, and folders, or whole projects, as a gzipped tar archive (.n8np). Provide agentIds/workflowIds/folderIds, or projectIds. Do not combine these two groups. Each exported folder includes its nested folders. Returns a .n8np package (gzip) of the chosen workflows, credentials and data tables.',
	},
	'packages.import': {
		riskLevel: 'destructive',
		description:
			'Beta: Import an n8n package into a project. Beta — breaking changes may still occur without major version bump. Imports Agent-only, workflow-only, mixed, and whole-project packages. The Agents module must be active for packages that contain Agents. Send the gzip-compressed tar archive (.n8np) as the multipart field package.',
	},
	'packages.importSelection': {
		riskLevel: 'destructive',
		description:
			'Beta: Import a selected subset of workflows from an n8n package. Beta — breaking changes may still occur without major version bump. Imports a chosen subset of workflows from one source project of a gzip-compressed tar package (.n8np), instead of the whole package. Send the archive as the multipart field package.',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project. Create a team project on your instance. Requires the project:create API key scope. Needs a licence with feat:projectRole:admin (Business or Enterprise plans): without it n8n answers 403.',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a project. Delete a project from your instance. Requires the project:delete API key scope. Needs a licence with feat:projectRole:admin (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'Retrieve projects. Retrieve projects from your instance. Requires the project:list API key scope. Needs a licence with feat:projectRole:admin (Business or Enterprise plans): without it n8n answers 403.',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			'Update a project. Update a project on your instance. Requires the project:update API key scope. Needs a licence with feat:projectRole:admin (Business or Enterprise plans): without it n8n answers 403.',
	},
	'projects.users.add': {
		riskLevel: 'write',
		description:
			'Add one or more users to a project. Add one or more users to a project on your instance. Requires the project:manageMembers API key scope. Needs a licence with feat:projectRole:admin (Business or Enterprise plans): without it n8n answers 403.',
	},
	'projects.users.changeRole': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Change a user's role in a project. Change a user's role in a project. Requires the project:manageMembers API key scope. Needs a licence with feat:projectRole:admin (Business or Enterprise plans): without it n8n answers 403.",
	},
	'projects.users.list': {
		riskLevel: 'read',
		description:
			'List project members. Returns a list of all members of a project including their role. Requires the user:list API key scope. Needs a licence with feat:projectRole:admin (Business or Enterprise plans): without it n8n answers 403.',
	},
	'projects.users.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a user from a project. Delete a user from a project on your instance. Requires the project:manageMembers API key scope. Needs a licence with feat:projectRole:admin (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'promotions.environments.addProject': {
		riskLevel: 'write',
		description:
			'Beta: Link a project to a promotion environment. Beta — breaking changes may still occur without major version bump. Links a team project to a project-scoped environment. A project can have one environment for each direction. A direction without a project environment uses the instance environment. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.environments.apply': {
		riskLevel: 'destructive',
		description:
			'Beta: Apply a package to the instance. Beta — breaking changes may still occur without major version bump. Checks the full package at the configured branch tip. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.environments.connect': {
		riskLevel: 'write',
		description:
			'Beta: Connect an environment. Beta — breaking changes may still occur without major version bump. Prepares the environment on the instance that handles the request. For a Git provider, this clones the configured branch into local storage. Safe to call repeatedly. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.environments.continueApply': {
		riskLevel: 'destructive',
		description:
			'Beta: Continue Apply after binding setup. Beta — breaking changes may still occur without major version bump. Rechecks the configured source and current target bindings. Send expectedSource with the environmentId, branchName, and full commitSha from the reviewed Apply result. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.environments.create': {
		riskLevel: 'write',
		description:
			'Beta: Create a promotion environment. Beta — breaking changes may still occur without major version bump. Creates an environment for one direction on an existing provider. The settings must match the direction. A GitLab remote URL must belong to the saved provider. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.environments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Beta: Delete a promotion environment. Beta — breaking changes may still occur without major version bump. Deletes the environment with its project links and local checkout. Its provider is kept. Nothing in the Git repository changes. The open promotion reviews of the environment close in n8n. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'promotions.environments.disconnect': {
		riskLevel: 'write',
		description:
			"Beta: Remove an environment's local checkout. Beta — breaking changes may still occur without major version bump. Removes the local checkout on this instance, asks the other main instances to remove theirs, and keeps the environment, its credentials, and the trusted SSH host keys. Another operation on the same environment returns 423. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.",
	},
	'promotions.environments.get': {
		riskLevel: 'read',
		description:
			'Beta: Retrieve a promotion environment. Beta — breaking changes may still occur without major version bump. Returns the environment with its provider summary and the state of its local checkout. Requires the promotions:readEnvironments API key scope. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.environments.getChangeDetails': {
		riskLevel: 'read',
		description:
			'Beta: Read the content of resources in the whole-instance Apply preview. Beta — breaking changes may still occur without major version bump. Returns the content before and after the change for up to 50 resources of the whole-instance Apply preview. Send the commitSha and the resource key values from the preview. The branch side is read at that commit. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403. Added in n8n 2.50; older instances answer 404.',
	},
	'promotions.environments.list': {
		riskLevel: 'read',
		description:
			'Beta: List promotion environments. Beta — breaking changes may still occur without major version bump. Returns a cursor-paginated list of environments. Filter by scope and direction for the instance environments, or by providerId to see which environments a provider edit affects. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.environments.listChanges': {
		riskLevel: 'read',
		description:
			'Beta: Preview the Apply of the whole instance. Beta — breaking changes may still occur without major version bump. Shows what applying the branch tip of an instance Apply environment changes on this instance, for every project of the package. resources and dependencies have the same shape as the project change preview. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403. Added in n8n 2.50; older instances answer 404.',
	},
	'promotions.environments.listMissingProjects': {
		riskLevel: 'read',
		description:
			'Beta: List package projects that are missing on this instance. Beta — breaking changes may still occur without major version bump. Reads the package at the Apply branch tip and returns its team projects whose IDs do not exist on this instance. Projects are matched by ID, not by name. An ID that a personal project uses counts as existing. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.environments.listProjects': {
		riskLevel: 'read',
		description:
			'Beta: List projects linked to a promotion environment. Beta — breaking changes may still occur without major version bump. Requires the promotions:readEnvironments API key scope. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.environments.promote': {
		riskLevel: 'destructive',
		description:
			'Beta: Promote all team projects. Beta — breaking changes may still occur without major version bump. Exports every team project, commits it, and pushes to the configured base branch or a new timestamped branch. When the requireApproval setting is alwaysRequired, it always pushes a new branch, whatever the environment setting is. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.environments.removeProject': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Beta: Unlink a project from a promotion environment. Beta — breaking changes may still occur without major version bump. Requires the promotions:manageEnvironments API key scope. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'promotions.environments.update': {
		riskLevel: 'write',
		description:
			'Beta: Update a promotion environment. Beta — breaking changes may still occur without major version bump. Updates the name, provider, remote, or settings. A remote replaces the whole saved remote, and settings replace the whole saved settings. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.projects.apply': {
		riskLevel: 'destructive',
		description:
			"Beta: Apply a selection of a project's workflows and folders. Beta — breaking changes may still occur without major version bump. Applies selected changes from the project's Apply branch. The project's name, icon, description and telemetry tags always come from the branch, so a request without workflowIds and folderIds applies only the project. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.",
	},
	'promotions.projects.continueApply': {
		riskLevel: 'destructive',
		description:
			"Beta: Continue applying a selection after binding setup. Beta — breaking changes may still occur without major version bump. Rechecks the project's Apply source and the current bindings for the selection. Resend the full selection: workflowIds and folderIds. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.",
	},
	'promotions.projects.getChangeDetails': {
		riskLevel: 'read',
		description:
			'Beta: Read the content of changed resources. Beta — breaking changes may still occur without major version bump. Returns the content before and after the change for up to 50 resources of a change preview. Send the commitSha and the resource key values from the preview. The branch side is read at that commit. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.projects.listChanges': {
		riskLevel: 'read',
		description:
			'Beta: Preview the changes of a project in one direction. Beta — breaking changes may still occur without major version bump. Compares a team project on this instance with the branch of its promotion environment for that direction. For promote the preview is what a promotion sends to the branch, and the key needs the promotions:promote scope. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.projects.promote': {
		riskLevel: 'destructive',
		description:
			"Beta: Promote a selection of a project's workflows and folders. Beta — breaking changes may still occur without major version bump. Promotes a chosen set of a team project's workflows and folders to the branch of the project's Promote environment. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.",
	},
	'promotions.providers.create': {
		riskLevel: 'write',
		description:
			'Beta: Create a promotion provider. Beta — breaking changes may still occur without major version bump. Creates a provider and its authentication material. A Git host provider validates authenticated API access before it saves. For GitLab, the service uses n8n as the Git transport username. Its auth.username is optional. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.providers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Beta: Delete a promotion provider. Beta — breaking changes may still occur without major version bump. A provider used by an environment cannot be deleted. Requires the promotions:manageProviders API key scope. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'promotions.providers.get': {
		riskLevel: 'read',
		description:
			'Beta: Retrieve a promotion provider. Beta — breaking changes may still occur without major version bump. Returns the provider with its public configuration. Secrets are never returned. Requires the promotions:readProviders API key scope. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.providers.list': {
		riskLevel: 'read',
		description:
			'Beta: List promotion providers. Beta — breaking changes may still occur without major version bump. Returns a cursor-paginated list of providers, without their public configuration. Requires the promotions:readProviders API key scope. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.providers.listBranches': {
		riskLevel: 'read',
		description:
			'Beta: List branches of a promotion repository. Beta — breaking changes may still occur without major version bump. Lists branches of the selected GitLab repository and identifies its default branch. Pass the URL-encoded fullPath from repository discovery, or the repositoryPath of a saved GitLab environment, as repositoryId. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.providers.listRepositories': {
		riskLevel: 'read',
		description:
			'Beta: List repositories of a promotion provider. Beta — breaking changes may still occur without major version bump. Lists repositories where the GitLab token identity has at least the Developer role. The token also needs Git write scope for promotions. Protected branches can restrict pushes. Use remoteUrl as an environment remote. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.providers.update': {
		riskLevel: 'write',
		description:
			'Beta: Update a promotion provider. Beta — breaking changes may still occur without major version bump. Renames the provider, and replaces its credentials when auth is sent. A Git host provider can also update its base URL. A different API destination requires auth in the same request. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403.',
	},
	'promotions.reviews.get': {
		riskLevel: 'read',
		description:
			'Beta: Retrieve a promotion review. Beta — breaking changes may still occur without major version bump. Returns one promotion review with the same fields as the list. Reads the merge request from the Git host now. Returns 404 when the Inbox of the key owner does not show the review. Requires the promotions:readReviews API key scope. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403. Added in n8n 2.50; older instances answer 404.',
	},
	'promotions.reviews.list': {
		riskLevel: 'read',
		description:
			'Beta: List promotion reviews. Beta — breaking changes may still occur without major version bump. Returns the promotion reviews that the Inbox of the key owner shows. Instance owners and admins see all reviews. state selects the open or the closed reviews, as the Inbox tabs do. The list starts with the newest activity. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403. Added in n8n 2.50; older instances answer 404.',
	},
	'promotions.settings.get': {
		riskLevel: 'read',
		description:
			'Beta: Get the promotion settings. Beta — breaking changes may still occur without major version bump. Returns who can promote, approve, and apply in their own projects, and whether every promote needs a review. Instance owners and admins can always promote, approve, and apply. Requires the securitySettings:manage API key scope. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403. Added in n8n 2.50; older instances answer 404.',
	},
	'promotions.settings.update': {
		riskLevel: 'write',
		description:
			'Beta: Update the promotion settings. Beta — breaking changes may still occur without major version bump. Changes who can promote, approve, and apply in their own projects, and whether every promote needs a review. Send only the settings to change. A setting that you leave out keeps its value. Needs a licence with feat:promotions (Business or Enterprise plans): without it n8n answers 403. Added in n8n 2.50; older instances answer 404.',
	},
	'roleMappingRules.create': {
		riskLevel: 'write',
		description:
			'Create a role-mapping rule. Creates a rule that maps an identity-provider claim expression to a role. Set type to instance for a rule granting a global role, or project for a rule granting a project role on the projects named in projectIds. Omitting order appends the rule to the end of the evaluation order for its type. Needs a licence with provisioning (Business or Enterprise plans): without it n8n answers 403.',
	},
	'roleMappingRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a role-mapping rule. Deletes a role-mapping rule. The remaining rules of the same type close the gap, so their order values stay a contiguous sequence starting at 0. Requires the roleMappingRule:delete API key scope. Needs a licence with provisioning (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'roleMappingRules.list': {
		riskLevel: 'read',
		description:
			"Retrieve role-mapping rules. Returns the configured role-mapping rules. order is the rule's evaluation position within its own type, so instance and project rules each have their own sequence starting at 0 — filter by type to retrieve a single evaluation order. Requires the roleMappingRule:list API key scope. Needs a licence with provisioning (Business or Enterprise plans): without it n8n answers 403.",
	},
	'roleMappingRules.move': {
		riskLevel: 'write',
		description:
			"Move a role-mapping rule. Changes a rule's position in the evaluation order for its type. targetIndex is the desired 0-based position within the rule's own type sequence; a value beyond the last position moves the rule to the end. Requires the roleMappingRule:update API key scope. Needs a licence with provisioning (Business or Enterprise plans): without it n8n answers 403.",
	},
	'roleMappingRules.update': {
		riskLevel: 'write',
		description:
			"Update a role-mapping rule. Updates a rule's claim expression, role, and/or project assignments. A rule's type cannot be changed once created, so type isn't accepted here, and reordering is handled by the move endpoint. Requires the roleMappingRule:update API key scope. Needs a licence with provisioning (Business or Enterprise plans): without it n8n answers 403.",
	},
	'roles.create': {
		riskLevel: 'write',
		description:
			'Create a custom role. Creates a custom role. Set roleType to global for an instance-wide role or project for a project role. Requires one of these API key scopes: role:manage, role:manageProject. Needs a licence with feat:customRoles (Business or Enterprise plans): without it n8n answers 403.',
	},
	'roles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a custom role. Deletes a custom role. System roles cannot be deleted. A role with users assigned cannot be deleted unless reassignRoleSlug is set to move those users to another role first. Requires one of these API key scopes: role:manage, role:manageProject. Needs a licence with feat:customRoles (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'roles.get': {
		riskLevel: 'read',
		description:
			'Retrieve a role. Returns a single role with its scopes. Set withUsageCount to include how many users and projects use the role. Requires the role:read API key scope.',
	},
	'roles.list': {
		riskLevel: 'read',
		description:
			'Retrieve all roles. Returns all roles grouped by type (global and project). Set withUsageCount to include how many users and projects use each role. Requires the role:list API key scope.',
	},
	'roles.update': {
		riskLevel: 'write',
		description:
			"Update a custom role. Replaces a custom role's display name, description, and scopes. System roles cannot be updated. Requires one of these API key scopes: role:manage, role:manageProject. Needs a licence with feat:customRoles (Business or Enterprise plans): without it n8n answers 403.",
	},
	'settings.ldap.get': {
		riskLevel: 'read',
		description:
			'Retrieve the LDAP configuration. Retrieve the current LDAP configuration, including every field exposed in the UI. The binding admin password is redacted on read. Requires the LDAP feature to be licensed. Requires the ldap:manage API key scope. Needs a licence with feat:ldap (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.ldap.listSyncs': {
		riskLevel: 'read',
		description:
			'Retrieve LDAP synchronization history. Retrieve the history of LDAP synchronizations, most recent first. Requires the LDAP feature to be licensed. Requires the ldap:sync API key scope. Needs a licence with feat:ldap (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.ldap.runSync': {
		riskLevel: 'destructive',
		description:
			'Trigger an LDAP synchronization. Manually trigger an LDAP synchronization. The response returns the new sync history record. Requires the LDAP feature to be licensed. Requires the ldap:sync API key scope. Needs a licence with feat:ldap (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.ldap.update': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Set the LDAP configuration. Replace the LDAP configuration with the provided full object (partial updates are not supported). For bindingAdminPassword, submit the blanking placeholder from a prior GET to keep the stored password unchanged. Requires the LDAP feature to be licensed. Needs a licence with feat:ldap (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.logStreaming.createDestination': {
		riskLevel: 'write',
		description:
			'Create a log streaming destination. Create a log streaming destination. The destination takes effect exactly as it would from the UI, using the same validation. Requires the Log Streaming feature to be licensed. Needs a licence with feat:logStreaming (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.logStreaming.deleteDestination': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a log streaming destination. Remove a log streaming destination. Requires the Log Streaming feature to be licensed. When destinations are managed via environment variables, the delete is rejected with 409 and nothing is removed; reads still return the current values. Requires the eventBusDestination:delete API key scope. Needs a licence with feat:logStreaming (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'settings.logStreaming.getDestination': {
		riskLevel: 'read',
		description:
			'Retrieve a log streaming destination. Retrieve a single log streaming destination by id. Requires the Log Streaming feature to be licensed. Requires the eventBusDestination:read API key scope. Needs a licence with feat:logStreaming (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.logStreaming.listDestinations': {
		riskLevel: 'read',
		description:
			'List log streaming destinations. List the configured log streaming destinations. Requires the Log Streaming feature to be licensed. Requires the eventBusDestination:list API key scope. Needs a licence with feat:logStreaming (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.logStreaming.listEventTypes': {
		riskLevel: 'read',
		description:
			'List streamable event types. List the event types that can be streamed to a log streaming destination. Requires the Log Streaming feature to be licensed. Requires the eventBusDestination:list API key scope. Needs a licence with feat:logStreaming (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.logStreaming.testDestination': {
		riskLevel: 'read',
		description:
			'Send a test message to a log streaming destination. Send a test message to the destination to verify it is reachable and configured correctly. Requires the Log Streaming feature to be licensed. Requires the eventBusDestination:test API key scope. Needs a licence with feat:logStreaming (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.logStreaming.updateDestination': {
		riskLevel: 'write',
		description:
			'Update a log streaming destination. Replace an existing log streaming destination. The update takes effect exactly as it would from the UI, using the same validation. Requires the Log Streaming feature to be licensed. Needs a licence with feat:logStreaming (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.oidc.get': {
		riskLevel: 'read',
		description:
			'Retrieve the OIDC SSO configuration. Retrieve the current OIDC SSO configuration, including every field exposed in the UI. The client secret is redacted on read and is never echoed back in plaintext. Requires the OIDC feature to be licensed. Requires the oidc:manage API key scope. Needs a licence with feat:oidc (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.oidc.update': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Set the OIDC SSO configuration. Set the OIDC SSO configuration. The update takes effect exactly as it would from the UI, using the same validation. clientId, clientSecret and discoveryEndpoint are required; submit the redacted client secret sentinel to keep the stored secret unchanged. Requires the OIDC feature to be licensed. Needs a licence with feat:oidc (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.otel.get': {
		riskLevel: 'read',
		description:
			'Retrieve the OpenTelemetry configuration. Retrieve the current OpenTelemetry configuration, including every field exposed in the UI. Requires the otel:manage API key scope.',
	},
	'settings.otel.testTrace': {
		riskLevel: 'read',
		description:
			'Test the connection to an OTLP collector. Send a single test span to the given OTLP collector and report whether it was accepted. This tests the supplied connection details without changing the stored configuration. Fields managed declaratively via environment variables are overridden with their effective value before the test is sent.',
	},
	'settings.otel.update': {
		riskLevel: 'write',
		description:
			'Set the OpenTelemetry configuration. Set the OpenTelemetry configuration. This is a full replacement: every field must be provided, and a partial body is rejected. The exceptions are exporterProtocol, which defaults to http/protobuf when omitted, and emitWorkflowStartSpan and emitNodeStartSpan, which default to false when omitted.',
	},
	'settings.rateLimits.get': {
		riskLevel: 'read',
		description:
			"Retrieve the Public API rate-limit settings. Retrieve the Public API rate-limit settings. envManagedFields lists the fields that are set by environment variables and can't be changed through the API. Requests to this route count against the rate limits. Requires the securitySettings:manage API key scope.",
	},
	'settings.rateLimits.update': {
		riskLevel: 'write',
		description:
			'Set the Public API rate-limit settings. Set the Public API rate-limit settings. You can send a GET response back as the body, and envManagedFields is ignored. When rate limiting is enabled, at least one limit must be greater than 0.',
	},
	'settings.saml.get': {
		riskLevel: 'read',
		description:
			'Retrieve the SAML SSO configuration. Retrieve the current SAML SSO configuration, including every field exposed in the UI plus the service provider entity ID and ACS return URL. Signing private keys, signing certificates, and identity provider metadata are redacted on read. Requires the SAML feature to be licensed. Needs a licence with feat:saml (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.saml.update': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Set the SAML SSO configuration. Replace the SAML SSO configuration with the provided full object. Every writable field must be sent; use empty strings or empty arrays when a value is unset. Read-only entityID / returnUrl from GET are ignored if included, so a GET response can be sent back as a PUT body. Needs a licence with feat:saml (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.securityPolicy.get': {
		riskLevel: 'read',
		description:
			'Retrieve the security policy. Retrieve the instance security policy: personal-space publishing and sharing, the execution-data redaction enforcement floor, and the read-only usage counts shown in the UI. Requires the Personal Space Policy feature to be licensed. Requires the securitySettings:manage API key scope. Needs a licence with feat:personalSpacePolicy (Business or Enterprise plans): without it n8n answers 403.',
	},
	'settings.securityPolicy.update': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Set the security policy. Replace the instance security policy with the provided full object. Every writable field must be sent. Read-only usage counts from GET are ignored if included, so a GET response can be sent back as a PUT body. The update takes effect exactly as it would from the UI, using the same validation. Needs a licence with feat:personalSpacePolicy (Business or Enterprise plans): without it n8n answers 403.',
	},
	'sourceControl.getStatus': {
		riskLevel: 'read',
		description:
			'Preview pending source control changes. Previews the pending changes between the instance and the connected Git branch in either the push or pull direction. Requires the sourceControl:read API key scope. Needs a licence with feat:sourceControl (Business or Enterprise plans): without it n8n answers 403.',
	},
	'sourceControl.pull': {
		riskLevel: 'destructive',
		description:
			'Pull changes from the remote repository. Fetches changes from the connected Git branch into the instance. Requires the sourceControl:pull API key scope. Needs a licence with feat:sourceControl (Business or Enterprise plans): without it n8n answers 403.',
	},
	'sourceControl.push': {
		riskLevel: 'destructive',
		description:
			'Push local source control changes. Commits and pushes the selected files to the connected Git branch. Each entry in fileNames is resolved against a fresh preview of the pending changes. Requires the sourceControl:push API key scope. Needs a licence with feat:sourceControl (Business or Enterprise plans): without it n8n answers 403.',
	},
	'tags.create': {
		riskLevel: 'write',
		description:
			'Create a tag. Create a tag in your instance. Requires the tag:create API key scope.',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a tag. Deletes a tag. Requires the tag:delete API key scope. Cannot be undone.',
	},
	'tags.get': {
		riskLevel: 'read',
		description:
			'Retrieves a tag. Retrieves a tag. Requires the tag:read API key scope.',
	},
	'tags.list': {
		riskLevel: 'read',
		description:
			'Retrieve all tags. Retrieve all tags from your instance. Requires the tag:list API key scope.',
	},
	'tags.update': {
		riskLevel: 'write',
		description:
			'Update a tag. Update a tag. Requires the tag:update API key scope.',
	},
	'users.changeRole': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Change a user's global role. Change a user's global role Requires the user:changeRole API key scope. Needs a licence with feat:advancedPermissions (Business or Enterprise plans): without it n8n answers 403.",
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete user. Delete a user from your instance. Requires the user:delete API key scope. Cannot be undone.',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Get user by ID/Email. Retrieve a user from your instance. Only available for the instance owner. Requires the user:read API key scope.',
	},
	'users.invite': {
		riskLevel: 'destructive',
		description:
			'Create multiple users. Create one or more users. Requires the user:create API key scope. Sends an invitation email to each address when the instance has email set up.',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'Retrieve all users. Retrieve all users from your instance. Only available for the instance owner. Requires the user:list API key scope.',
	},
	'variables.create': {
		riskLevel: 'write',
		description:
			'Create a variable. Create a variable in your instance. Requires the variable:create API key scope. Needs a licence with feat:variables (Business or Enterprise plans): without it n8n answers 403.',
	},
	'variables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a variable. Delete a variable from your instance. Requires the variable:delete API key scope. Needs a licence with feat:variables (Business or Enterprise plans): without it n8n answers 403. Cannot be undone.',
	},
	'variables.list': {
		riskLevel: 'read',
		description:
			'Retrieve variables. Retrieve variables from your instance. Requires the variable:list API key scope. Needs a licence with feat:variables (Business or Enterprise plans): without it n8n answers 403.',
	},
	'variables.update': {
		riskLevel: 'write',
		description:
			'Update a variable. Update a variable from your instance. Requires the variable:update API key scope. Needs a licence with feat:variables (Business or Enterprise plans): without it n8n answers 403.',
	},
	'workflows.activate': {
		riskLevel: 'destructive',
		description:
			'Publish a workflow. Deprecated: use POST /workflows/{id}/publish instead. Publish a workflow. In n8n v1, this action was termed activating a workflow. Requires the workflow:activate API key scope. Turns the workflow on: its triggers start running it.',
	},
	'workflows.archive': {
		riskLevel: 'write',
		description:
			'Archive a workflow. Soft-deletes a workflow by archiving it. Idempotent: archiving an already archived workflow returns 200 with the current workflow. Requires the workflow:delete API key scope.',
	},
	'workflows.create': {
		riskLevel: 'write',
		description:
			'Create a workflow. Create a workflow in your instance. Requires the workflow:create API key scope.',
	},
	'workflows.deactivate': {
		riskLevel: 'write',
		description:
			'Deactivate a workflow. Deprecated: use POST /workflows/{id}/unpublish instead. Deactivate a workflow. Requires the workflow:deactivate API key scope.',
	},
	'workflows.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a workflow. Delete a workflow. Requires the workflow:delete API key scope. Cannot be undone.',
	},
	'workflows.get': {
		riskLevel: 'read',
		description:
			'Retrieve a workflow. Retrieve a workflow. Requires the workflow:read API key scope.',
	},
	'workflows.getDependencies': {
		riskLevel: 'read',
		description:
			'List workflow dependencies. List the credentials, data tables, sub-workflows and error workflow that the workflow uses, and the workflows and agents that use the workflow. Requires the workflow:read API key scope.',
	},
	'workflows.getTags': {
		riskLevel: 'read',
		description:
			'Get workflow tags. Get workflow tags. Requires the workflowTags:list API key scope.',
	},
	'workflows.getVersion': {
		riskLevel: 'read',
		description:
			'Retrieve a workflow version. Retrieve a single version of a workflow from its version history. Requires the workflow:read API key scope.',
	},
	'workflows.getVersionLegacy': {
		riskLevel: 'read',
		description:
			'Retrieves a specific version of a workflow. Deprecated: use GET /workflows/{workflowId}/versions/{workflowVersionId} instead. Retrieves a specific version of a workflow from workflow history. Requires the workflow:read API key scope. The older route for workflows.getVersion.',
	},
	'workflows.list': {
		riskLevel: 'read',
		description:
			'Retrieve all workflows. Retrieve all workflows from your instance. Requires the workflow:list API key scope.',
	},
	'workflows.listHistory': {
		riskLevel: 'read',
		description:
			'Retrieve workflow version history. Returns a paginated list of workflow versions (version IDs and metadata) for a workflow. Requires the workflow:read API key scope.',
	},
	'workflows.publish': {
		riskLevel: 'destructive',
		description:
			'Publish a workflow. Publish a workflow. In n8n v1, this action was termed activating a workflow. Requires the workflow:activate API key scope. Publishes the current version: its triggers start running it.',
	},
	'workflows.run': {
		riskLevel: 'destructive',
		description:
			'Run a workflow with existing run data. Start a manual execution of the latest saved version of a workflow. n8n reuses the given run data and runs the nodes up to the destination node. The call returns when the execution starts. It does not wait for the execution to finish. The user must also have the workflow:execute project scope. Runs the workflow now; its nodes may call outside services or spend credits there. Added in n8n 2.50; older instances answer 404.',
	},
	'workflows.setTags': {
		riskLevel: 'write',
		description:
			'Update tags of a workflow. Update tags of a workflow. Requires the workflowTags:update API key scope.',
	},
	'workflows.transfer': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer a workflow to another project. Transfer a workflow to another project. Requires the workflow:move API key scope.',
	},
	'workflows.unarchive': {
		riskLevel: 'write',
		description:
			'Unarchive a workflow. Restores an archived workflow. Requires the workflow:delete API key scope.',
	},
	'workflows.unpublish': {
		riskLevel: 'write',
		description:
			'Unpublish a workflow. Unpublish a workflow. In n8n v1, this action was termed deactivating a workflow. Requires the workflow:deactivate API key scope.',
	},
	'workflows.update': {
		riskLevel: 'write',
		description:
			'Update a workflow. Update a workflow. If the workflow is published, the updated version will be automatically re-published unless publishIfActive is set to false.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof n8nEndpointsNested>;
