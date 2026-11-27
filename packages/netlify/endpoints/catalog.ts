// Generated with endpoints/operation-types.ts from Netlify's swagger:
// one entry per operation in netlify-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { netlifySchemaEntry } from './openapi-schema';
import { createNetlifyOperation as op } from './operations';

export const netlifyEndpointsNested = {
	accounts: {
		audit: {
			list: op('accounts.audit.list'),
		},
		builds: {
			status: op('accounts.builds.status'),
		},
		cancel: op('accounts.cancel'),
		create: op('accounts.create'),
		get: op('accounts.get'),
		list: op('accounts.list'),
		listTypes: op('accounts.listTypes'),
		members: {
			add: op('accounts.members.add'),
			get: op('accounts.members.get'),
			list: op('accounts.members.list'),
			remove: op('accounts.members.remove'),
			update: op('accounts.members.update'),
		},
		sites: {
			create: op('accounts.sites.create'),
			list: op('accounts.sites.list'),
		},
		update: op('accounts.update'),
	},
	agentRunners: {
		archive: op('agentRunners.archive'),
		commitToBranch: op('agentRunners.commitToBranch'),
		create: op('agentRunners.create'),
		createPullRequest: op('agentRunners.createPullRequest'),
		createUploadUrl: op('agentRunners.createUploadUrl'),
		delete: op('agentRunners.delete'),
		get: op('agentRunners.get'),
		getDiff: op('agentRunners.getDiff'),
		list: op('agentRunners.list'),
		sessions: {
			answer: op('agentRunners.sessions.answer'),
			create: op('agentRunners.sessions.create'),
			delete: op('agentRunners.sessions.delete'),
			get: op('agentRunners.sessions.get'),
			list: op('agentRunners.sessions.list'),
			stop: op('agentRunners.sessions.stop'),
			update: op('agentRunners.sessions.update'),
		},
		stop: op('agentRunners.stop'),
		update: op('agentRunners.update'),
	},
	aiGateway: {
		getAccountToken: op('aiGateway.getAccountToken'),
		getSiteToken: op('aiGateway.getSiteToken'),
		listProviders: op('aiGateway.listProviders'),
	},
	billing: {
		paymentMethods: {
			list: op('billing.paymentMethods.list'),
		},
	},
	builds: {
		appendLog: op('builds.appendLog'),
		get: op('builds.get'),
		notifyStart: op('builds.notifyStart'),
	},
	cache: {
		purge: op('cache.purge'),
	},
	deployKeys: {
		create: op('deployKeys.create'),
		delete: op('deployKeys.delete'),
		get: op('deployKeys.get'),
		list: op('deployKeys.list'),
	},
	deploys: {
		cancel: op('deploys.cancel'),
		delete: op('deploys.delete'),
		get: op('deploys.get'),
		lock: op('deploys.lock'),
		unlock: op('deploys.unlock'),
		updateValidationsReport: op('deploys.updateValidationsReport'),
		uploadEdgeFunction: op('deploys.uploadEdgeFunction'),
		uploadFile: op('deploys.uploadFile'),
		uploadFunction: op('deploys.uploadFunction'),
		uploadServer: op('deploys.uploadServer'),
	},
	dns: {
		records: {
			create: op('dns.records.create'),
			delete: op('dns.records.delete'),
			get: op('dns.records.get'),
			list: op('dns.records.list'),
		},
		zones: {
			create: op('dns.zones.create'),
			delete: op('dns.zones.delete'),
			get: op('dns.zones.get'),
			list: op('dns.zones.list'),
			transfer: op('dns.zones.transfer'),
		},
	},
	env: {
		create: op('env.create'),
		delete: op('env.delete'),
		deleteValue: op('env.deleteValue'),
		get: op('env.get'),
		list: op('env.list'),
		listForSite: op('env.listForSite'),
		setValue: op('env.setValue'),
		update: op('env.update'),
	},
	forms: {
		submissions: {
			list: op('forms.submissions.list'),
		},
	},
	hooks: {
		create: op('hooks.create'),
		delete: op('hooks.delete'),
		enable: op('hooks.enable'),
		get: op('hooks.get'),
		list: op('hooks.list'),
		listTypes: op('hooks.listTypes'),
		update: op('hooks.update'),
	},
	oauth: {
		tickets: {
			create: op('oauth.tickets.create'),
			exchange: op('oauth.tickets.exchange'),
			get: op('oauth.tickets.get'),
		},
	},
	services: {
		get: op('services.get'),
		getManifest: op('services.getManifest'),
		list: op('services.list'),
	},
	sites: {
		agentRunnerHooks: {
			create: op('sites.agentRunnerHooks.create'),
			delete: op('sites.agentRunnerHooks.delete'),
			get: op('sites.agentRunnerHooks.get'),
			list: op('sites.agentRunnerHooks.list'),
			update: op('sites.agentRunnerHooks.update'),
		},
		agentRunners: {
			create: op('sites.agentRunners.create'),
		},
		assets: {
			create: op('sites.assets.create'),
			delete: op('sites.assets.delete'),
			get: op('sites.assets.get'),
			getPublicSignature: op('sites.assets.getPublicSignature'),
			list: op('sites.assets.list'),
			update: op('sites.assets.update'),
		},
		buildHooks: {
			create: op('sites.buildHooks.create'),
			delete: op('sites.buildHooks.delete'),
			get: op('sites.buildHooks.get'),
			list: op('sites.buildHooks.list'),
			update: op('sites.buildHooks.update'),
		},
		builds: {
			create: op('sites.builds.create'),
			list: op('sites.builds.list'),
		},
		create: op('sites.create'),
		database: {
			branches: {
				create: op('sites.database.branches.create'),
				delete: op('sites.database.branches.delete'),
				get: op('sites.database.branches.get'),
				list: op('sites.database.branches.list'),
				reset: op('sites.database.branches.reset'),
				setComputeSettings: op('sites.database.branches.setComputeSettings'),
			},
			compute: {
				clear: op('sites.database.compute.clear'),
				get: op('sites.database.compute.get'),
				set: op('sites.database.compute.set'),
			},
			create: op('sites.database.create'),
			delete: op('sites.database.delete'),
			get: op('sites.database.get'),
			migrations: {
				get: op('sites.database.migrations.get'),
				list: op('sites.database.migrations.list'),
				run: op('sites.database.migrations.run'),
			},
			snapshots: {
				create: op('sites.database.snapshots.create'),
				delete: op('sites.database.snapshots.delete'),
				list: op('sites.database.snapshots.list'),
				restore: op('sites.database.snapshots.restore'),
			},
		},
		delete: op('sites.delete'),
		deployedBranches: {
			list: op('sites.deployedBranches.list'),
		},
		deploys: {
			create: op('sites.deploys.create'),
			delete: op('sites.deploys.delete'),
			get: op('sites.deploys.get'),
			list: op('sites.deploys.list'),
			restore: op('sites.deploys.restore'),
			rollback: op('sites.deploys.rollback'),
			update: op('sites.deploys.update'),
		},
		devServerHooks: {
			create: op('sites.devServerHooks.create'),
			delete: op('sites.devServerHooks.delete'),
			get: op('sites.devServerHooks.get'),
			list: op('sites.devServerHooks.list'),
			update: op('sites.devServerHooks.update'),
		},
		devServers: {
			create: op('sites.devServers.create'),
			deleteAll: op('sites.devServers.deleteAll'),
			get: op('sites.devServers.get'),
			list: op('sites.devServers.list'),
			markActivity: op('sites.devServers.markActivity'),
			updateState: op('sites.devServers.updateState'),
		},
		disable: op('sites.disable'),
		dns: {
			configure: op('sites.dns.configure'),
			get: op('sites.dns.get'),
		},
		enable: op('sites.enable'),
		files: {
			get: op('sites.files.get'),
			list: op('sites.files.list'),
		},
		forms: {
			delete: op('sites.forms.delete'),
			list: op('sites.forms.list'),
		},
		functions: {
			list: op('sites.functions.list'),
		},
		get: op('sites.get'),
		identity: {
			users: {
				get: op('sites.identity.users.get'),
				lookup: op('sites.identity.users.lookup'),
			},
		},
		list: op('sites.list'),
		metadata: {
			get: op('sites.metadata.get'),
			update: op('sites.metadata.update'),
		},
		serviceInstances: {
			create: op('sites.serviceInstances.create'),
			delete: op('sites.serviceInstances.delete'),
			get: op('sites.serviceInstances.get'),
			list: op('sites.serviceInstances.list'),
			update: op('sites.serviceInstances.update'),
		},
		snippets: {
			create: op('sites.snippets.create'),
			delete: op('sites.snippets.delete'),
			get: op('sites.snippets.get'),
			list: op('sites.snippets.list'),
			update: op('sites.snippets.update'),
		},
		splitTests: {
			create: op('sites.splitTests.create'),
			get: op('sites.splitTests.get'),
			list: op('sites.splitTests.list'),
			publish: op('sites.splitTests.publish'),
			unpublish: op('sites.splitTests.unpublish'),
			update: op('sites.splitTests.update'),
		},
		ssl: {
			get: op('sites.ssl.get'),
			listCertificates: op('sites.ssl.listCertificates'),
			provision: op('sites.ssl.provision'),
		},
		submissions: {
			list: op('sites.submissions.list'),
		},
		unlinkRepo: op('sites.unlinkRepo'),
		update: op('sites.update'),
	},
	submissions: {
		delete: op('submissions.delete'),
		get: op('submissions.get'),
	},
	user: {
		me: op('user.me'),
	},
} as const;

export const netlifyEndpointSchemas = {
	'accounts.audit.list': netlifySchemaEntry('accounts.audit.list'),
	'accounts.builds.status': netlifySchemaEntry('accounts.builds.status'),
	'accounts.cancel': netlifySchemaEntry('accounts.cancel'),
	'accounts.create': netlifySchemaEntry('accounts.create'),
	'accounts.get': netlifySchemaEntry('accounts.get'),
	'accounts.list': netlifySchemaEntry('accounts.list'),
	'accounts.listTypes': netlifySchemaEntry('accounts.listTypes'),
	'accounts.members.add': netlifySchemaEntry('accounts.members.add'),
	'accounts.members.get': netlifySchemaEntry('accounts.members.get'),
	'accounts.members.list': netlifySchemaEntry('accounts.members.list'),
	'accounts.members.remove': netlifySchemaEntry('accounts.members.remove'),
	'accounts.members.update': netlifySchemaEntry('accounts.members.update'),
	'accounts.sites.create': netlifySchemaEntry('accounts.sites.create'),
	'accounts.sites.list': netlifySchemaEntry('accounts.sites.list'),
	'accounts.update': netlifySchemaEntry('accounts.update'),
	'agentRunners.archive': netlifySchemaEntry('agentRunners.archive'),
	'agentRunners.commitToBranch': netlifySchemaEntry(
		'agentRunners.commitToBranch',
	),
	'agentRunners.create': netlifySchemaEntry('agentRunners.create'),
	'agentRunners.createPullRequest': netlifySchemaEntry(
		'agentRunners.createPullRequest',
	),
	'agentRunners.createUploadUrl': netlifySchemaEntry(
		'agentRunners.createUploadUrl',
	),
	'agentRunners.delete': netlifySchemaEntry('agentRunners.delete'),
	'agentRunners.get': netlifySchemaEntry('agentRunners.get'),
	'agentRunners.getDiff': netlifySchemaEntry('agentRunners.getDiff'),
	'agentRunners.list': netlifySchemaEntry('agentRunners.list'),
	'agentRunners.sessions.answer': netlifySchemaEntry(
		'agentRunners.sessions.answer',
	),
	'agentRunners.sessions.create': netlifySchemaEntry(
		'agentRunners.sessions.create',
	),
	'agentRunners.sessions.delete': netlifySchemaEntry(
		'agentRunners.sessions.delete',
	),
	'agentRunners.sessions.get': netlifySchemaEntry('agentRunners.sessions.get'),
	'agentRunners.sessions.list': netlifySchemaEntry(
		'agentRunners.sessions.list',
	),
	'agentRunners.sessions.stop': netlifySchemaEntry(
		'agentRunners.sessions.stop',
	),
	'agentRunners.sessions.update': netlifySchemaEntry(
		'agentRunners.sessions.update',
	),
	'agentRunners.stop': netlifySchemaEntry('agentRunners.stop'),
	'agentRunners.update': netlifySchemaEntry('agentRunners.update'),
	'aiGateway.getAccountToken': netlifySchemaEntry('aiGateway.getAccountToken'),
	'aiGateway.getSiteToken': netlifySchemaEntry('aiGateway.getSiteToken'),
	'aiGateway.listProviders': netlifySchemaEntry('aiGateway.listProviders'),
	'billing.paymentMethods.list': netlifySchemaEntry(
		'billing.paymentMethods.list',
	),
	'builds.appendLog': netlifySchemaEntry('builds.appendLog'),
	'builds.get': netlifySchemaEntry('builds.get'),
	'builds.notifyStart': netlifySchemaEntry('builds.notifyStart'),
	'cache.purge': netlifySchemaEntry('cache.purge'),
	'deployKeys.create': netlifySchemaEntry('deployKeys.create'),
	'deployKeys.delete': netlifySchemaEntry('deployKeys.delete'),
	'deployKeys.get': netlifySchemaEntry('deployKeys.get'),
	'deployKeys.list': netlifySchemaEntry('deployKeys.list'),
	'deploys.cancel': netlifySchemaEntry('deploys.cancel'),
	'deploys.delete': netlifySchemaEntry('deploys.delete'),
	'deploys.get': netlifySchemaEntry('deploys.get'),
	'deploys.lock': netlifySchemaEntry('deploys.lock'),
	'deploys.unlock': netlifySchemaEntry('deploys.unlock'),
	'deploys.updateValidationsReport': netlifySchemaEntry(
		'deploys.updateValidationsReport',
	),
	'deploys.uploadEdgeFunction': netlifySchemaEntry(
		'deploys.uploadEdgeFunction',
	),
	'deploys.uploadFile': netlifySchemaEntry('deploys.uploadFile'),
	'deploys.uploadFunction': netlifySchemaEntry('deploys.uploadFunction'),
	'deploys.uploadServer': netlifySchemaEntry('deploys.uploadServer'),
	'dns.records.create': netlifySchemaEntry('dns.records.create'),
	'dns.records.delete': netlifySchemaEntry('dns.records.delete'),
	'dns.records.get': netlifySchemaEntry('dns.records.get'),
	'dns.records.list': netlifySchemaEntry('dns.records.list'),
	'dns.zones.create': netlifySchemaEntry('dns.zones.create'),
	'dns.zones.delete': netlifySchemaEntry('dns.zones.delete'),
	'dns.zones.get': netlifySchemaEntry('dns.zones.get'),
	'dns.zones.list': netlifySchemaEntry('dns.zones.list'),
	'dns.zones.transfer': netlifySchemaEntry('dns.zones.transfer'),
	'env.create': netlifySchemaEntry('env.create'),
	'env.delete': netlifySchemaEntry('env.delete'),
	'env.deleteValue': netlifySchemaEntry('env.deleteValue'),
	'env.get': netlifySchemaEntry('env.get'),
	'env.list': netlifySchemaEntry('env.list'),
	'env.listForSite': netlifySchemaEntry('env.listForSite'),
	'env.setValue': netlifySchemaEntry('env.setValue'),
	'env.update': netlifySchemaEntry('env.update'),
	'forms.submissions.list': netlifySchemaEntry('forms.submissions.list'),
	'hooks.create': netlifySchemaEntry('hooks.create'),
	'hooks.delete': netlifySchemaEntry('hooks.delete'),
	'hooks.enable': netlifySchemaEntry('hooks.enable'),
	'hooks.get': netlifySchemaEntry('hooks.get'),
	'hooks.list': netlifySchemaEntry('hooks.list'),
	'hooks.listTypes': netlifySchemaEntry('hooks.listTypes'),
	'hooks.update': netlifySchemaEntry('hooks.update'),
	'oauth.tickets.create': netlifySchemaEntry('oauth.tickets.create'),
	'oauth.tickets.exchange': netlifySchemaEntry('oauth.tickets.exchange'),
	'oauth.tickets.get': netlifySchemaEntry('oauth.tickets.get'),
	'services.get': netlifySchemaEntry('services.get'),
	'services.getManifest': netlifySchemaEntry('services.getManifest'),
	'services.list': netlifySchemaEntry('services.list'),
	'sites.agentRunnerHooks.create': netlifySchemaEntry(
		'sites.agentRunnerHooks.create',
	),
	'sites.agentRunnerHooks.delete': netlifySchemaEntry(
		'sites.agentRunnerHooks.delete',
	),
	'sites.agentRunnerHooks.get': netlifySchemaEntry(
		'sites.agentRunnerHooks.get',
	),
	'sites.agentRunnerHooks.list': netlifySchemaEntry(
		'sites.agentRunnerHooks.list',
	),
	'sites.agentRunnerHooks.update': netlifySchemaEntry(
		'sites.agentRunnerHooks.update',
	),
	'sites.agentRunners.create': netlifySchemaEntry('sites.agentRunners.create'),
	'sites.assets.create': netlifySchemaEntry('sites.assets.create'),
	'sites.assets.delete': netlifySchemaEntry('sites.assets.delete'),
	'sites.assets.get': netlifySchemaEntry('sites.assets.get'),
	'sites.assets.getPublicSignature': netlifySchemaEntry(
		'sites.assets.getPublicSignature',
	),
	'sites.assets.list': netlifySchemaEntry('sites.assets.list'),
	'sites.assets.update': netlifySchemaEntry('sites.assets.update'),
	'sites.buildHooks.create': netlifySchemaEntry('sites.buildHooks.create'),
	'sites.buildHooks.delete': netlifySchemaEntry('sites.buildHooks.delete'),
	'sites.buildHooks.get': netlifySchemaEntry('sites.buildHooks.get'),
	'sites.buildHooks.list': netlifySchemaEntry('sites.buildHooks.list'),
	'sites.buildHooks.update': netlifySchemaEntry('sites.buildHooks.update'),
	'sites.builds.create': netlifySchemaEntry('sites.builds.create'),
	'sites.builds.list': netlifySchemaEntry('sites.builds.list'),
	'sites.create': netlifySchemaEntry('sites.create'),
	'sites.database.branches.create': netlifySchemaEntry(
		'sites.database.branches.create',
	),
	'sites.database.branches.delete': netlifySchemaEntry(
		'sites.database.branches.delete',
	),
	'sites.database.branches.get': netlifySchemaEntry(
		'sites.database.branches.get',
	),
	'sites.database.branches.list': netlifySchemaEntry(
		'sites.database.branches.list',
	),
	'sites.database.branches.reset': netlifySchemaEntry(
		'sites.database.branches.reset',
	),
	'sites.database.branches.setComputeSettings': netlifySchemaEntry(
		'sites.database.branches.setComputeSettings',
	),
	'sites.database.compute.clear': netlifySchemaEntry(
		'sites.database.compute.clear',
	),
	'sites.database.compute.get': netlifySchemaEntry(
		'sites.database.compute.get',
	),
	'sites.database.compute.set': netlifySchemaEntry(
		'sites.database.compute.set',
	),
	'sites.database.create': netlifySchemaEntry('sites.database.create'),
	'sites.database.delete': netlifySchemaEntry('sites.database.delete'),
	'sites.database.get': netlifySchemaEntry('sites.database.get'),
	'sites.database.migrations.get': netlifySchemaEntry(
		'sites.database.migrations.get',
	),
	'sites.database.migrations.list': netlifySchemaEntry(
		'sites.database.migrations.list',
	),
	'sites.database.migrations.run': netlifySchemaEntry(
		'sites.database.migrations.run',
	),
	'sites.database.snapshots.create': netlifySchemaEntry(
		'sites.database.snapshots.create',
	),
	'sites.database.snapshots.delete': netlifySchemaEntry(
		'sites.database.snapshots.delete',
	),
	'sites.database.snapshots.list': netlifySchemaEntry(
		'sites.database.snapshots.list',
	),
	'sites.database.snapshots.restore': netlifySchemaEntry(
		'sites.database.snapshots.restore',
	),
	'sites.delete': netlifySchemaEntry('sites.delete'),
	'sites.deployedBranches.list': netlifySchemaEntry(
		'sites.deployedBranches.list',
	),
	'sites.deploys.create': netlifySchemaEntry('sites.deploys.create'),
	'sites.deploys.delete': netlifySchemaEntry('sites.deploys.delete'),
	'sites.deploys.get': netlifySchemaEntry('sites.deploys.get'),
	'sites.deploys.list': netlifySchemaEntry('sites.deploys.list'),
	'sites.deploys.restore': netlifySchemaEntry('sites.deploys.restore'),
	'sites.deploys.rollback': netlifySchemaEntry('sites.deploys.rollback'),
	'sites.deploys.update': netlifySchemaEntry('sites.deploys.update'),
	'sites.devServerHooks.create': netlifySchemaEntry(
		'sites.devServerHooks.create',
	),
	'sites.devServerHooks.delete': netlifySchemaEntry(
		'sites.devServerHooks.delete',
	),
	'sites.devServerHooks.get': netlifySchemaEntry('sites.devServerHooks.get'),
	'sites.devServerHooks.list': netlifySchemaEntry('sites.devServerHooks.list'),
	'sites.devServerHooks.update': netlifySchemaEntry(
		'sites.devServerHooks.update',
	),
	'sites.devServers.create': netlifySchemaEntry('sites.devServers.create'),
	'sites.devServers.deleteAll': netlifySchemaEntry(
		'sites.devServers.deleteAll',
	),
	'sites.devServers.get': netlifySchemaEntry('sites.devServers.get'),
	'sites.devServers.list': netlifySchemaEntry('sites.devServers.list'),
	'sites.devServers.markActivity': netlifySchemaEntry(
		'sites.devServers.markActivity',
	),
	'sites.devServers.updateState': netlifySchemaEntry(
		'sites.devServers.updateState',
	),
	'sites.disable': netlifySchemaEntry('sites.disable'),
	'sites.dns.configure': netlifySchemaEntry('sites.dns.configure'),
	'sites.dns.get': netlifySchemaEntry('sites.dns.get'),
	'sites.enable': netlifySchemaEntry('sites.enable'),
	'sites.files.get': netlifySchemaEntry('sites.files.get'),
	'sites.files.list': netlifySchemaEntry('sites.files.list'),
	'sites.forms.delete': netlifySchemaEntry('sites.forms.delete'),
	'sites.forms.list': netlifySchemaEntry('sites.forms.list'),
	'sites.functions.list': netlifySchemaEntry('sites.functions.list'),
	'sites.get': netlifySchemaEntry('sites.get'),
	'sites.identity.users.get': netlifySchemaEntry('sites.identity.users.get'),
	'sites.identity.users.lookup': netlifySchemaEntry(
		'sites.identity.users.lookup',
	),
	'sites.list': netlifySchemaEntry('sites.list'),
	'sites.metadata.get': netlifySchemaEntry('sites.metadata.get'),
	'sites.metadata.update': netlifySchemaEntry('sites.metadata.update'),
	'sites.serviceInstances.create': netlifySchemaEntry(
		'sites.serviceInstances.create',
	),
	'sites.serviceInstances.delete': netlifySchemaEntry(
		'sites.serviceInstances.delete',
	),
	'sites.serviceInstances.get': netlifySchemaEntry(
		'sites.serviceInstances.get',
	),
	'sites.serviceInstances.list': netlifySchemaEntry(
		'sites.serviceInstances.list',
	),
	'sites.serviceInstances.update': netlifySchemaEntry(
		'sites.serviceInstances.update',
	),
	'sites.snippets.create': netlifySchemaEntry('sites.snippets.create'),
	'sites.snippets.delete': netlifySchemaEntry('sites.snippets.delete'),
	'sites.snippets.get': netlifySchemaEntry('sites.snippets.get'),
	'sites.snippets.list': netlifySchemaEntry('sites.snippets.list'),
	'sites.snippets.update': netlifySchemaEntry('sites.snippets.update'),
	'sites.splitTests.create': netlifySchemaEntry('sites.splitTests.create'),
	'sites.splitTests.get': netlifySchemaEntry('sites.splitTests.get'),
	'sites.splitTests.list': netlifySchemaEntry('sites.splitTests.list'),
	'sites.splitTests.publish': netlifySchemaEntry('sites.splitTests.publish'),
	'sites.splitTests.unpublish': netlifySchemaEntry(
		'sites.splitTests.unpublish',
	),
	'sites.splitTests.update': netlifySchemaEntry('sites.splitTests.update'),
	'sites.ssl.get': netlifySchemaEntry('sites.ssl.get'),
	'sites.ssl.listCertificates': netlifySchemaEntry(
		'sites.ssl.listCertificates',
	),
	'sites.ssl.provision': netlifySchemaEntry('sites.ssl.provision'),
	'sites.submissions.list': netlifySchemaEntry('sites.submissions.list'),
	'sites.unlinkRepo': netlifySchemaEntry('sites.unlinkRepo'),
	'sites.update': netlifySchemaEntry('sites.update'),
	'submissions.delete': netlifySchemaEntry('submissions.delete'),
	'submissions.get': netlifySchemaEntry('submissions.get'),
	'user.me': netlifySchemaEntry('user.me'),
} satisfies RequiredPluginEndpointSchemas<typeof netlifyEndpointsNested>;

export const netlifyEndpointMeta = {
	'accounts.audit.list': {
		riskLevel: 'read',
		description: "List a team's audit log events, one page at a time",
	},
	'accounts.builds.status': {
		riskLevel: 'read',
		description:
			"Get a team's build status: returns the team's counts of active, concurrency-pending, and enqueued builds, and its build minutes usage",
	},
	'accounts.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a team: its sites and members are removed and billing stops',
	},
	'accounts.create': {
		riskLevel: 'destructive',
		description: 'Create a team',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Get a team',
	},
	'accounts.list': {
		riskLevel: 'read',
		description: "List the current user's teams",
	},
	'accounts.listTypes': {
		riskLevel: 'read',
		description: 'List plans available for new teams',
	},
	'accounts.members.add': {
		riskLevel: 'destructive',
		description:
			'Invite someone to the team by email with a role; Netlify sends them an invitation email',
	},
	'accounts.members.get': {
		riskLevel: 'read',
		description: 'Get a team member',
	},
	'accounts.members.list': {
		riskLevel: 'read',
		description: "List a team's members",
	},
	'accounts.members.remove': {
		riskLevel: 'destructive',
		description: 'Remove a team member',
	},
	'accounts.members.update': {
		riskLevel: 'write',
		description: 'Update a team member',
	},
	'accounts.sites.create': {
		riskLevel: 'write',
		description: 'Create a site in a team',
	},
	'accounts.sites.list': {
		riskLevel: 'read',
		description: "List a team's sites, one page at a time",
	},
	'accounts.update': {
		riskLevel: 'destructive',
		description: 'Update a team',
	},
	'agentRunners.archive': {
		riskLevel: 'write',
		description: 'Archive an agent run',
	},
	'agentRunners.commitToBranch': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Commit an agent run's changes to a branch: queues a commit of the run's diff to `target_branch`",
	},
	'agentRunners.create': {
		riskLevel: 'destructive',
		description: 'Start an agent run',
	},
	'agentRunners.createPullRequest': {
		riskLevel: 'destructive',
		description:
			"Open a pull request from an agent run: queues a pull request for the run's diff (`result_diff`)",
	},
	'agentRunners.createUploadUrl': {
		riskLevel: 'write',
		description:
			"Create an upload URL for agent run files: returns a presigned URL for uploading a file that agent run sessions can use, and the file's storage key",
	},
	'agentRunners.delete': {
		riskLevel: 'write',
		description:
			'Stop an agent run (alias): same as `POST /agent_runners/{agent_runner_id}/stop`',
	},
	'agentRunners.get': {
		riskLevel: 'read',
		description: 'Get an agent run',
	},
	'agentRunners.getDiff': {
		riskLevel: 'read',
		description:
			"Get an agent run's diff: returns the run's changes as a unified diff (returned as text)",
	},
	'agentRunners.list': {
		riskLevel: 'read',
		description:
			"List a site's agent runs: lists a site's agent runs, most recently active first, one page at a time",
	},
	'agentRunners.sessions.answer': {
		riskLevel: 'destructive',
		description:
			"Answer an agent run session's pending interaction: answers or skips a pending interaction and resumes the session",
	},
	'agentRunners.sessions.create': {
		riskLevel: 'destructive',
		description:
			'Start a follow-up agent run session: starts a follow-up session on the run',
	},
	'agentRunners.sessions.delete': {
		riskLevel: 'write',
		description:
			'Stop an agent run session (alias): same as `POST /agent_runners/{agent_runner_id}/sessions/{agent_runner_session_id}/stop`',
	},
	'agentRunners.sessions.get': {
		riskLevel: 'read',
		description: 'Get an agent run session',
	},
	'agentRunners.sessions.list': {
		riskLevel: 'read',
		description: "List an agent run's sessions, one page at a time",
	},
	'agentRunners.sessions.stop': {
		riskLevel: 'write',
		description: 'Stop an agent run session: stops the session',
	},
	'agentRunners.sessions.update': {
		riskLevel: 'write',
		description: 'Update an agent run session',
	},
	'agentRunners.stop': {
		riskLevel: 'write',
		description: "Stop an agent run: stops the run's active session",
	},
	'agentRunners.update': {
		riskLevel: 'write',
		description: 'Update an agent run',
	},
	'aiGateway.getAccountToken': {
		riskLevel: 'read',
		description:
			"Get a team's AI Gateway token: returns an AI Gateway token scoped to an account",
	},
	'aiGateway.getSiteToken': {
		riskLevel: 'read',
		description:
			"Get a site's AI Gateway token: returns an AI Gateway token for a specific site",
	},
	'aiGateway.listProviders': {
		riskLevel: 'read',
		description: 'List AI Gateway providers and models',
	},
	'billing.paymentMethods.list': {
		riskLevel: 'read',
		description: 'List payment methods',
	},
	'builds.appendLog': {
		riskLevel: 'write',
		description: 'Add a message to a build log',
	},
	'builds.get': {
		riskLevel: 'read',
		description: 'Get a build',
	},
	'builds.notifyStart': {
		riskLevel: 'write',
		description: 'Mark a build as started',
	},
	'cache.purge': {
		riskLevel: 'write',
		description:
			"Purge cached content from Netlify's CDN for a site (`site_id` or `site_slug`), optionally only the responses with given cache tags",
	},
	'deployKeys.create': {
		riskLevel: 'write',
		description: 'Create a deploy key',
	},
	'deployKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a deploy key',
	},
	'deployKeys.get': {
		riskLevel: 'read',
		description: 'Get a deploy key',
	},
	'deployKeys.list': {
		riskLevel: 'read',
		description: 'List deploy keys',
	},
	'deploys.cancel': {
		riskLevel: 'write',
		description: 'Cancel a deploy',
	},
	'deploys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a deploy: marks a deploy for deletion',
	},
	'deploys.get': {
		riskLevel: 'read',
		description: 'Get a deploy',
	},
	'deploys.lock': {
		riskLevel: 'write',
		description:
			'Lock a deploy: locks a deploy so that subsequent deploys are built but not published',
	},
	'deploys.unlock': {
		riskLevel: 'write',
		description: 'Unlock a deploy',
	},
	'deploys.updateValidationsReport': {
		riskLevel: 'write',
		description:
			"Update a deploy's validations report: updates the deploy validations report for a deploy",
	},
	'deploys.uploadEdgeFunction': {
		riskLevel: 'write',
		description: "Upload a deploy's edge functions bundle",
	},
	'deploys.uploadFile': {
		riskLevel: 'write',
		description:
			'Upload one file a deploy listed as required: `path` is the file path in the site (`index.html`, `assets/app.js`), the bytes are the body',
	},
	'deploys.uploadFunction': {
		riskLevel: 'write',
		description:
			'Upload one function bundle (a zip) a deploy listed as required, by function name',
	},
	'deploys.uploadServer': {
		riskLevel: 'write',
		description:
			"Upload a deploy's Netlify Server bundle: uploads the deploy's Netlify Server bundle, addressed by the digest the deploy declared in its `server` property",
	},
	'dns.records.create': {
		riskLevel: 'write',
		description: 'Create a DNS record',
	},
	'dns.records.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a DNS record',
	},
	'dns.records.get': {
		riskLevel: 'read',
		description: 'Get a DNS record',
	},
	'dns.records.list': {
		riskLevel: 'read',
		description: "List a DNS zone's records",
	},
	'dns.zones.create': {
		riskLevel: 'write',
		description: 'Create a DNS zone',
	},
	'dns.zones.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a DNS zone',
	},
	'dns.zones.get': {
		riskLevel: 'read',
		description: 'Get a DNS zone',
	},
	'dns.zones.list': {
		riskLevel: 'read',
		description:
			'List DNS zones: returns the DNS zones for the team given by `account_slug`, or all DNS zones the current user can access',
	},
	'dns.zones.transfer': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Transfer a DNS zone to another team',
	},
	'env.create': {
		riskLevel: 'write',
		description:
			'Create one or more environment variables on a team, or on one site with `site_id`; each takes `key`, `scopes`, `values` (per deploy context) and `is_secret`',
	},
	'env.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an environment variable: deletes an environment variable',
	},
	'env.deleteValue': {
		riskLevel: 'destructive',
		description:
			'Delete an environment variable value: deletes a specific environment variable value',
	},
	'env.get': {
		riskLevel: 'read',
		description:
			'Get an environment variable: returns an individual environment variable',
	},
	'env.list': {
		riskLevel: 'read',
		description:
			'List environment variables for a team or site: returns all environment variables for an account or site',
	},
	'env.listForSite': {
		riskLevel: 'read',
		description:
			'List environment variables for a site: returns all environment variables for a site',
	},
	'env.setValue': {
		riskLevel: 'write',
		description:
			'Set a value on an environment variable: updates or creates a new value for an existing environment variable',
	},
	'env.update': {
		riskLevel: 'write',
		description:
			'Update an environment variable: updates an existing environment variable and all of its values',
	},
	'forms.submissions.list': {
		riskLevel: 'read',
		description: "List a form's submissions, one page at a time",
	},
	'hooks.create': {
		riskLevel: 'write',
		description:
			"Create an outgoing notification for a site: type `url` with `data.url` (and `data.signature_secret` to sign deliveries with a JWS the plugin's webhooks check), `slack` or `email`, for one event (deploy_created, deploy_failed, submission_created...)",
	},
	'hooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an outgoing hook',
	},
	'hooks.enable': {
		riskLevel: 'write',
		description:
			'Re-enable an outgoing hook: re-enables an outgoing hook that was disabled after repeated delivery errors',
	},
	'hooks.get': {
		riskLevel: 'read',
		description: 'Get an outgoing hook',
	},
	'hooks.list': {
		riskLevel: 'read',
		description:
			"List a site's outgoing hooks: returns the outgoing hooks for a site",
	},
	'hooks.listTypes': {
		riskLevel: 'read',
		description:
			'List outgoing hook types: returns the available outgoing hook types',
	},
	'hooks.update': {
		riskLevel: 'write',
		description: 'Update an outgoing hook',
	},
	'oauth.tickets.create': {
		riskLevel: 'write',
		description: 'Create an OAuth ticket',
	},
	'oauth.tickets.exchange': {
		riskLevel: 'write',
		description: 'Exchange an OAuth ticket for an access token',
	},
	'oauth.tickets.get': {
		riskLevel: 'read',
		description: 'Get an OAuth ticket',
	},
	'services.get': {
		riskLevel: 'read',
		description: 'Get an add-on service',
	},
	'services.getManifest': {
		riskLevel: 'read',
		description: "Get an add-on service's manifest",
	},
	'services.list': {
		riskLevel: 'read',
		description: 'List add-on services',
	},
	'sites.agentRunnerHooks.create': {
		riskLevel: 'write',
		description: 'Create an agent runner hook',
	},
	'sites.agentRunnerHooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an agent runner hook',
	},
	'sites.agentRunnerHooks.get': {
		riskLevel: 'read',
		description: 'Get an agent runner hook',
	},
	'sites.agentRunnerHooks.list': {
		riskLevel: 'read',
		description: "List a site's agent runner hooks",
	},
	'sites.agentRunnerHooks.update': {
		riskLevel: 'write',
		description: 'Update an agent runner hook',
	},
	'sites.agentRunners.create': {
		riskLevel: 'destructive',
		description:
			'Start an agent run on a site: starts an agent run on the site',
	},
	'sites.assets.create': {
		riskLevel: 'write',
		description: 'Create a site asset (only available to some sites)',
	},
	'sites.assets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a site asset (only available to some sites)',
	},
	'sites.assets.get': {
		riskLevel: 'read',
		description: 'Get a site asset (only available to some sites)',
	},
	'sites.assets.getPublicSignature': {
		riskLevel: 'read',
		description:
			"Get a site asset's URL: returns the URL of the asset (only available to some sites)",
	},
	'sites.assets.list': {
		riskLevel: 'read',
		description: "List a site's assets (only available to some sites)",
	},
	'sites.assets.update': {
		riskLevel: 'write',
		description: "Update a site asset's state (only available to some sites)",
	},
	'sites.buildHooks.create': {
		riskLevel: 'write',
		description: 'Create a build hook',
	},
	'sites.buildHooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a build hook',
	},
	'sites.buildHooks.get': {
		riskLevel: 'read',
		description: 'Get a build hook',
	},
	'sites.buildHooks.list': {
		riskLevel: 'read',
		description: "List a site's build hooks",
	},
	'sites.buildHooks.update': {
		riskLevel: 'write',
		description: 'Update a build hook',
	},
	'sites.builds.create': {
		riskLevel: 'write',
		description:
			'Start a build for the site from its linked repository (or from an uploaded zip), optionally for a branch or commit; uses build minutes',
	},
	'sites.builds.list': {
		riskLevel: 'read',
		description: "List a site's builds, one page at a time",
	},
	'sites.create': {
		riskLevel: 'write',
		description:
			'Create a site in your personal team (accounts.sites.create picks the team), optionally linked to a Git repository with build settings',
	},
	'sites.database.branches.create': {
		riskLevel: 'write',
		description: 'Create a database branch: creates a new database branch',
	},
	'sites.database.branches.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a database branch: deletes a database branch',
	},
	'sites.database.branches.get': {
		riskLevel: 'read',
		description:
			'Get a database branch: returns the database branch connection string for a specific branch',
	},
	'sites.database.branches.list': {
		riskLevel: 'read',
		description:
			"List database branches: returns all branches for the site's database with compute status and metadata",
	},
	'sites.database.branches.reset': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Reset a database branch: resets a non-production database branch by re-forking it from a source branch (defaults to the production branch)',
	},
	'sites.database.branches.setComputeSettings': {
		riskLevel: 'destructive',
		description:
			"Set a database branch's compute settings: sets compute settings for a specific database branch, overriding project-level settings",
	},
	'sites.database.compute.clear': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Reset database compute settings to defaults: resets project-level compute settings to tier defaults',
	},
	'sites.database.compute.get': {
		riskLevel: 'read',
		description:
			'Get database compute settings: returns the project-level compute settings for the database',
	},
	'sites.database.compute.set': {
		riskLevel: 'destructive',
		description:
			'Set database compute settings: sets project-level compute settings for the database',
	},
	'sites.database.create': {
		riskLevel: 'write',
		description:
			'Create a site database: creates a new database for the specified site',
	},
	'sites.database.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a site database: deletes the database and all associated branches and snapshots for the specified site',
	},
	'sites.database.get': {
		riskLevel: 'read',
		description:
			'Get a site database: returns the database connection string for the specified site',
	},
	'sites.database.migrations.get': {
		riskLevel: 'read',
		description:
			'Get a database migration: returns the contents of a named migration for the specified branch',
	},
	'sites.database.migrations.list': {
		riskLevel: 'read',
		description:
			'List database migrations: returns the list of migrations available for the specified branch, indicating which ones have been applied to the database',
	},
	'sites.database.migrations.run': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Run database migrations for a deploy: runs database migrations for the specified deploy',
	},
	'sites.database.snapshots.create': {
		riskLevel: 'write',
		description:
			'Create a database snapshot: creates a point-in-time snapshot of a database branch',
	},
	'sites.database.snapshots.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a database snapshot: deletes a database snapshot',
	},
	'sites.database.snapshots.list': {
		riskLevel: 'read',
		description:
			"List database snapshots: returns all snapshots for the site's database",
	},
	'sites.database.snapshots.restore': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Restore a database snapshot: restores a snapshot to a database branch',
	},
	'sites.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a site with all its deploys, forms, functions and settings; its netlify.app subdomain is released',
	},
	'sites.deployedBranches.list': {
		riskLevel: 'read',
		description: "List a site's deployed branches",
	},
	'sites.deploys.create': {
		riskLevel: 'write',
		description:
			'Create a deploy from a file digest (`files`: path -> SHA1) and function digests. Netlify answers with `required` (the SHA1s it still needs); upload each with deploys.uploadFile, and the deploy goes live when the last one lands',
	},
	'sites.deploys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Delete a site's deploy: marks a deploy for deletion",
	},
	'sites.deploys.get': {
		riskLevel: 'read',
		description: "Get a site's deploy",
	},
	'sites.deploys.list': {
		riskLevel: 'read',
		description: "List a site's deploys, one page at a time",
	},
	'sites.deploys.restore': {
		riskLevel: 'write',
		description:
			'Restore a previous deploy: publishes a previous deploy of the site',
	},
	'sites.deploys.rollback': {
		riskLevel: 'write',
		description:
			"Roll back a site's production deploy: rolls back the production deploy to the deploy referenced by its `rollback_id`",
	},
	'sites.deploys.update': {
		riskLevel: 'write',
		description: 'Update a deploy',
	},
	'sites.devServerHooks.create': {
		riskLevel: 'write',
		description: 'Create a dev server hook',
	},
	'sites.devServerHooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a dev server hook',
	},
	'sites.devServerHooks.get': {
		riskLevel: 'read',
		description: 'Get a dev server hook',
	},
	'sites.devServerHooks.list': {
		riskLevel: 'read',
		description: "List a site's dev server hooks",
	},
	'sites.devServerHooks.update': {
		riskLevel: 'write',
		description: 'Update a dev server hook',
	},
	'sites.devServers.create': {
		riskLevel: 'write',
		description: 'Start a dev server',
	},
	'sites.devServers.deleteAll': {
		riskLevel: 'write',
		description:
			"Stop a branch's dev servers: stops all dev servers for a branch",
	},
	'sites.devServers.get': {
		riskLevel: 'read',
		description: 'Get a dev server',
	},
	'sites.devServers.list': {
		riskLevel: 'read',
		description: "List a site's dev servers, one page at a time",
	},
	'sites.devServers.markActivity': {
		riskLevel: 'write',
		description: 'Record dev server activity',
	},
	'sites.devServers.updateState': {
		riskLevel: 'write',
		description: "Update a dev server's state",
	},
	'sites.disable': {
		riskLevel: 'destructive',
		description:
			'Disable a site: disables a site, preventing it from serving content',
	},
	'sites.dns.configure': {
		riskLevel: 'write',
		description:
			"Configure a site's DNS: creates any missing DNS zones and records for the site's custom domain and domain aliases",
	},
	'sites.dns.get': {
		riskLevel: 'read',
		description: "Get a site's DNS configuration",
	},
	'sites.enable': {
		riskLevel: 'write',
		description:
			'Enable a site: re-enables a site that was previously disabled by the user',
	},
	'sites.files.get': {
		riskLevel: 'read',
		description: 'Get a site file by path',
	},
	'sites.files.list': {
		riskLevel: 'read',
		description: "List a site's files",
	},
	'sites.forms.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a form: deletes a form and all of its submissions',
	},
	'sites.forms.list': {
		riskLevel: 'read',
		description: "List a site's forms",
	},
	'sites.functions.list': {
		riskLevel: 'read',
		description: "Search a site's functions",
	},
	'sites.get': {
		riskLevel: 'read',
		description: 'Get a site',
	},
	'sites.identity.users.get': {
		riskLevel: 'read',
		description: 'Get an Identity user: returns one Identity user by ID',
	},
	'sites.identity.users.lookup': {
		riskLevel: 'read',
		description:
			'Look up an Identity user by email: returns the one Identity user with this exact email',
	},
	'sites.list': {
		riskLevel: 'read',
		description:
			'List the sites the token can see, filterable by name and by owner (`filter`: all, owner or guest), one page at a time',
	},
	'sites.metadata.get': {
		riskLevel: 'read',
		description: "Get a site's metadata",
	},
	'sites.metadata.update': {
		riskLevel: 'write',
		description: "Update a site's metadata",
	},
	'sites.serviceInstances.create': {
		riskLevel: 'destructive',
		description: 'Create an add-on instance',
	},
	'sites.serviceInstances.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an add-on instance',
	},
	'sites.serviceInstances.get': {
		riskLevel: 'read',
		description: 'Get an add-on instance',
	},
	'sites.serviceInstances.list': {
		riskLevel: 'read',
		description: "List a site's add-on instances",
	},
	'sites.serviceInstances.update': {
		riskLevel: 'write',
		description: 'Update an add-on instance',
	},
	'sites.snippets.create': {
		riskLevel: 'write',
		description: 'Create a snippet',
	},
	'sites.snippets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a snippet',
	},
	'sites.snippets.get': {
		riskLevel: 'read',
		description: 'Get a snippet',
	},
	'sites.snippets.list': {
		riskLevel: 'read',
		description: "List a site's snippets",
	},
	'sites.snippets.update': {
		riskLevel: 'write',
		description: 'Update a snippet',
	},
	'sites.splitTests.create': {
		riskLevel: 'write',
		description: 'Create a split test',
	},
	'sites.splitTests.get': {
		riskLevel: 'read',
		description: 'Get a split test',
	},
	'sites.splitTests.list': {
		riskLevel: 'read',
		description: "List a site's split tests",
	},
	'sites.splitTests.publish': {
		riskLevel: 'write',
		description: 'Publish a split test',
	},
	'sites.splitTests.unpublish': {
		riskLevel: 'write',
		description: 'Unpublish a split test',
	},
	'sites.splitTests.update': {
		riskLevel: 'write',
		description: 'Update a split test',
	},
	'sites.ssl.get': {
		riskLevel: 'read',
		description: "Get a site's TLS certificate",
	},
	'sites.ssl.listCertificates': {
		riskLevel: 'read',
		description:
			"List TLS certificates for a site's domain: returns details about the certificates associated with a domain",
	},
	'sites.ssl.provision': {
		riskLevel: 'write',
		description:
			"Provision or update a site's TLS certificate: provisions or updates a TLS certificate for the site",
	},
	'sites.submissions.list': {
		riskLevel: 'read',
		description: "List a site's form submissions, one page at a time",
	},
	'sites.unlinkRepo': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unlink the site from its Git repository (beta): this also deletes the deploy key, build hooks and Git notifications that came with the link',
	},
	'sites.update': {
		riskLevel: 'write',
		description: 'Update a site',
	},
	'submissions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a form submission',
	},
	'submissions.get': {
		riskLevel: 'read',
		description: 'Get a form submission, one page at a time',
	},
	'user.me': {
		riskLevel: 'read',
		description:
			'Get the user the token belongs to: name, email, teams and connected accounts',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof netlifyEndpointsNested>;
