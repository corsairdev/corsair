// Generated with endpoints/operation-types.ts from Maritime's OpenAPI spec:
// one entry per operation in maritime-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { maritimeSchemaEntry } from './openapi-schema';
import { createMaritimeOperation as op } from './operations';

export const maritimeEndpointsNested = {
	account: {
		delete: op('account.delete'),
		limits: op('account.limits'),
	},
	activity: {
		list: op('activity.list'),
	},
	agentTemplates: {
		list: op('agentTemplates.list'),
	},
	agents: {
		activity: op('agents.activity'),
		browserLiveView: op('agents.browserLiveView'),
		capabilities: {
			change: op('agents.capabilities.change'),
			get: op('agents.capabilities.get'),
		},
		channels: {
			get: op('agents.channels.get'),
			update: op('agents.channels.update'),
			validateTelegram: op('agents.channels.validateTelegram'),
		},
		chat: {
			getTurn: op('agents.chat.getTurn'),
			send: op('agents.chat.send'),
		},
		create: op('agents.create'),
		createOwnerLink: op('agents.createOwnerLink'),
		delete: op('agents.delete'),
		desktop: {
			getMode: op('agents.desktop.getMode'),
			takeover: op('agents.desktop.takeover'),
			updateConfig: op('agents.desktop.updateConfig'),
		},
		diagnostic: op('agents.diagnostic'),
		duplicate: op('agents.duplicate'),
		env: {
			create: op('agents.env.create'),
			delete: op('agents.env.delete'),
			list: op('agents.env.list'),
			update: op('agents.env.update'),
		},
		exec: {
			cancel: op('agents.exec.cancel'),
			get: op('agents.exec.get'),
			run: op('agents.exec.run'),
		},
		files: {
			delete: op('agents.files.delete'),
			download: op('agents.files.download'),
			list: op('agents.files.list'),
			mkdir: op('agents.files.mkdir'),
			move: op('agents.files.move'),
			upload: op('agents.files.upload'),
			write: op('agents.files.write'),
		},
		get: op('agents.get'),
		getStopOperation: op('agents.getStopOperation'),
		gmail: {
			connect: op('agents.gmail.connect'),
			disconnect: op('agents.gmail.disconnect'),
			enable: op('agents.gmail.enable'),
			status: op('agents.gmail.status'),
		},
		hermes: {
			pairings: {
				allow: op('agents.hermes.pairings.allow'),
				approve: op('agents.hermes.pairings.approve'),
				list: op('agents.hermes.pairings.list'),
				revoke: op('agents.hermes.pairings.revoke'),
			},
		},
		inkboxIdentity: op('agents.inkboxIdentity'),
		invoke: op('agents.invoke'),
		list: op('agents.list'),
		listServers: op('agents.listServers'),
		llm: {
			calls: op('agents.llm.calls'),
			deleteSpendLimit: op('agents.llm.deleteSpendLimit'),
			getSpendLimit: op('agents.llm.getSpendLimit'),
			reset: op('agents.llm.reset'),
			setSpendLimit: op('agents.llm.setSpendLimit'),
			status: op('agents.llm.status'),
		},
		logs: op('agents.logs'),
		maritimeTelegram: {
			connect: op('agents.maritimeTelegram.connect'),
			disconnect: op('agents.maritimeTelegram.disconnect'),
			status: op('agents.maritimeTelegram.status'),
		},
		reloadEnv: op('agents.reloadEnv'),
		resetToUpstream: op('agents.resetToUpstream'),
		resize: op('agents.resize'),
		restart: op('agents.restart'),
		setVisibility: op('agents.setVisibility'),
		shareLinks: {
			create: op('agents.shareLinks.create'),
			list: op('agents.shareLinks.list'),
			revoke: op('agents.shareLinks.revoke'),
			revokeForEndUser: op('agents.shareLinks.revokeForEndUser'),
		},
		signedWebhook: {
			delete: op('agents.signedWebhook.delete'),
			get: op('agents.signedWebhook.get'),
			set: op('agents.signedWebhook.set'),
		},
		skills: {
			delete: op('agents.skills.delete'),
			export: op('agents.skills.export'),
			install: op('agents.skills.install'),
			list: op('agents.skills.list'),
			search: op('agents.skills.search'),
			setAllowlist: op('agents.skills.setAllowlist'),
			setEnv: op('agents.skills.setEnv'),
			upload: op('agents.skills.upload'),
		},
		sleep: op('agents.sleep'),
		start: op('agents.start'),
		stats: op('agents.stats'),
		stop: op('agents.stop'),
		triggers: {
			create: op('agents.triggers.create'),
			delete: op('agents.triggers.delete'),
			list: op('agents.triggers.list'),
			update: op('agents.triggers.update'),
		},
		update: op('agents.update'),
		webhookToken: {
			get: op('agents.webhookToken.get'),
			rotate: op('agents.webhookToken.rotate'),
		},
		whatsapp: {
			cancel: op('agents.whatsapp.cancel'),
			log: op('agents.whatsapp.log'),
			pairings: {
				approve: op('agents.whatsapp.pairings.approve'),
				deny: op('agents.whatsapp.pairings.deny'),
				list: op('agents.whatsapp.pairings.list'),
			},
			start: op('agents.whatsapp.start'),
			status: op('agents.whatsapp.status'),
		},
	},
	apiKeys: {
		create: op('apiKeys.create'),
		list: op('apiKeys.list'),
		revoke: op('apiKeys.revoke'),
	},
	appium: {
		sessions: {
			get: op('appium.sessions.get'),
			list: op('appium.sessions.list'),
		},
	},
	apps: {
		delete: op('apps.delete'),
		get: op('apps.get'),
		list: op('apps.list'),
		upload: op('apps.upload'),
	},
	billing: {
		agentPay: {
			createLink: op('billing.agentPay.createLink'),
		},
		agents: op('billing.agents'),
		cancelSwitchToUsage: op('billing.cancelSwitchToUsage'),
		config: op('billing.config'),
		machineTypes: op('billing.machineTypes'),
		meteredUsage: op('billing.meteredUsage'),
		plan: {
			change: op('billing.plan.change'),
			changeWithTrial: op('billing.plan.changeWithTrial'),
			preview: op('billing.plan.preview'),
			resume: op('billing.plan.resume'),
		},
		retryPayment: op('billing.retryPayment'),
		summary: op('billing.summary'),
		switchToUsage: op('billing.switchToUsage'),
		trial: {
			cancel: op('billing.trial.cancel'),
			get: op('billing.trial.get'),
			start: op('billing.trial.start'),
		},
		usage: op('billing.usage'),
	},
	computers: {
		actions: op('computers.actions'),
		completeTakeover: op('computers.completeTakeover'),
		create: op('computers.create'),
		createViewer: op('computers.createViewer'),
		delete: op('computers.delete'),
		exec: op('computers.exec'),
		files: {
			list: op('computers.files.list'),
			read: op('computers.files.read'),
			write: op('computers.files.write'),
		},
		get: op('computers.get'),
		installApp: op('computers.installApp'),
		list: op('computers.list'),
		screenshot: op('computers.screenshot'),
		sessions: {
			close: op('computers.sessions.close'),
			list: op('computers.sessions.list'),
		},
		sleep: op('computers.sleep'),
		tools: {
			call: op('computers.tools.call'),
			list: op('computers.tools.list'),
		},
		usage: op('computers.usage'),
		wake: op('computers.wake'),
	},
	deletedAgents: {
		get: op('deletedAgents.get'),
		list: op('deletedAgents.list'),
	},
	deployments: {
		cancel: op('deployments.cancel'),
		create: op('deployments.create'),
		get: op('deployments.get'),
		list: op('deployments.list'),
		listForAgent: op('deployments.listForAgent'),
		uploadZip: op('deployments.uploadZip'),
	},
	domains: {
		check: op('domains.check'),
		create: op('domains.create'),
		delete: op('domains.delete'),
		get: op('domains.get'),
		labels: {
			delete: op('domains.labels.delete'),
			list: op('domains.labels.list'),
			set: op('domains.labels.set'),
		},
		list: op('domains.list'),
	},
	endUsers: {
		activity: op('endUsers.activity'),
		agents: {
			create: op('endUsers.agents.create'),
			list: op('endUsers.agents.list'),
		},
		delete: op('endUsers.delete'),
		get: op('endUsers.get'),
		list: op('endUsers.list'),
		policy: {
			delete: op('endUsers.policy.delete'),
			get: op('endUsers.policy.get'),
			set: op('endUsers.policy.set'),
		},
		resume: op('endUsers.resume'),
		summary: op('endUsers.summary'),
		suspend: op('endUsers.suspend'),
		tokens: {
			create: op('endUsers.tokens.create'),
			revoke: op('endUsers.tokens.revoke'),
		},
		upsert: op('endUsers.upsert'),
	},
	feedback: {
		create: op('feedback.create'),
		list: op('feedback.list'),
	},
	fleet: {
		activity: op('fleet.activity'),
		batchCreate: op('fleet.batchCreate'),
		overview: op('fleet.overview'),
		propagate: op('fleet.propagate'),
		summary: op('fleet.summary'),
	},
	health: {
		check: op('health.check'),
	},
	llmSpendLimit: {
		deleteDefault: op('llmSpendLimit.deleteDefault'),
		getDefault: op('llmSpendLimit.getDefault'),
		setDefault: op('llmSpendLimit.setDefault'),
	},
	logs: {
		list: op('logs.list'),
	},
	network: {
		activity: op('network.activity'),
		install: {
			get: op('network.install.get'),
			unixScript: op('network.install.unixScript'),
			windowsScript: op('network.install.windowsScript'),
		},
		presets: {
			create: op('network.presets.create'),
			delete: op('network.presets.delete'),
			list: op('network.presets.list'),
			update: op('network.presets.update'),
		},
		privateNetworks: {
			addResource: op('network.privateNetworks.addResource'),
			create: op('network.privateNetworks.create'),
			createInstall: op('network.privateNetworks.createInstall'),
			delete: op('network.privateNetworks.delete'),
			deleteResource: op('network.privateNetworks.deleteResource'),
			list: op('network.privateNetworks.list'),
			update: op('network.privateNetworks.update'),
		},
		settings: {
			get: op('network.settings.get'),
			update: op('network.settings.update'),
		},
		workloads: {
			get: op('network.workloads.get'),
			newIp: op('network.workloads.newIp'),
			test: op('network.workloads.test'),
			update: op('network.workloads.update'),
		},
	},
	notifications: {
		list: op('notifications.list'),
		markRead: op('notifications.markRead'),
		readAll: op('notifications.readAll'),
		unreadCount: op('notifications.unreadCount'),
	},
	organizations: {
		create: op('organizations.create'),
		delete: op('organizations.delete'),
		invites: {
			accept: op('organizations.invites.accept'),
			create: op('organizations.invites.create'),
			list: op('organizations.invites.list'),
			preview: op('organizations.invites.preview'),
			resend: op('organizations.invites.resend'),
			revoke: op('organizations.invites.revoke'),
		},
		leave: op('organizations.leave'),
		me: op('organizations.me'),
		members: {
			changeRole: op('organizations.members.changeRole'),
			list: op('organizations.members.list'),
			remove: op('organizations.members.remove'),
		},
		rename: op('organizations.rename'),
	},
	plans: {
		cancel: op('plans.cancel'),
		launchPromo: op('plans.launchPromo'),
		list: op('plans.list'),
		portal: op('plans.portal'),
		subscribe: op('plans.subscribe'),
	},
	preferences: {
		get: op('preferences.get'),
		update: op('preferences.update'),
	},
	projects: {
		bindings: {
			list: op('projects.bindings.list'),
			reassign: op('projects.bindings.reassign'),
			unbind: op('projects.bindings.unbind'),
		},
		claimCodes: {
			create: op('projects.claimCodes.create'),
			list: op('projects.claimCodes.list'),
		},
		get: op('projects.get'),
		list: op('projects.list'),
		messages: {
			get: op('projects.messages.get'),
			send: op('projects.messages.send'),
		},
		syncInstances: op('projects.syncInstances'),
		telegram: {
			connect: op('projects.telegram.connect'),
			disconnect: op('projects.telegram.disconnect'),
		},
		update: op('projects.update'),
		usage: op('projects.usage'),
		users: {
			get: op('projects.users.get'),
			list: op('projects.users.list'),
			unbind: op('projects.users.unbind'),
		},
	},
	sandboxKeys: {
		create: op('sandboxKeys.create'),
		list: op('sandboxKeys.list'),
		revoke: op('sandboxKeys.revoke'),
	},
	sandboxWebhooks: {
		create: op('sandboxWebhooks.create'),
		delete: op('sandboxWebhooks.delete'),
		deliveries: op('sandboxWebhooks.deliveries'),
		list: op('sandboxWebhooks.list'),
	},
	sandboxes: {
		code: {
			run: op('sandboxes.code.run'),
		},
		commands: {
			get: op('sandboxes.commands.get'),
			history: op('sandboxes.commands.history'),
			kill: op('sandboxes.commands.kill'),
			run: op('sandboxes.commands.run'),
		},
		create: op('sandboxes.create'),
		createScreenViewer: op('sandboxes.createScreenViewer'),
		createUrl: op('sandboxes.createUrl'),
		ephemeral: {
			create: op('sandboxes.ephemeral.create'),
			extend: op('sandboxes.ephemeral.extend'),
			kill: op('sandboxes.ephemeral.kill'),
			list: op('sandboxes.ephemeral.list'),
		},
		files: {
			delete: op('sandboxes.files.delete'),
			list: op('sandboxes.files.list'),
			read: op('sandboxes.files.read'),
			write: op('sandboxes.files.write'),
		},
		get: op('sandboxes.get'),
		info: op('sandboxes.info'),
		kill: op('sandboxes.kill'),
		list: op('sandboxes.list'),
		pause: op('sandboxes.pause'),
		promote: op('sandboxes.promote'),
		rotateSecret: op('sandboxes.rotateSecret'),
		save: op('sandboxes.save'),
		update: op('sandboxes.update'),
		usage: op('sandboxes.usage'),
	},
	secrets: {
		delete: op('secrets.delete'),
		list: op('secrets.list'),
		set: op('secrets.set'),
	},
	servers: {
		list: op('servers.list'),
		release: op('servers.release'),
		rent: op('servers.rent'),
	},
	snapshots: {
		delete: op('snapshots.delete'),
		get: op('snapshots.get'),
		list: op('snapshots.list'),
	},
	stripe: {
		createPortalSession: op('stripe.createPortalSession'),
		invoices: op('stripe.invoices'),
		paymentMethods: op('stripe.paymentMethods'),
		subscriptions: {
			cancel: op('stripe.subscriptions.cancel'),
			list: op('stripe.subscriptions.list'),
		},
	},
	swarms: {
		cancel: op('swarms.cancel'),
		create: op('swarms.create'),
		get: op('swarms.get'),
		getAccess: op('swarms.getAccess'),
		list: op('swarms.list'),
		requestAccess: op('swarms.requestAccess'),
		results: op('swarms.results'),
	},
	templates: {
		create: op('templates.create'),
		delete: op('templates.delete'),
		get: op('templates.get'),
		list: op('templates.list'),
	},
	usage: {
		daily: op('usage.daily'),
		report: op('usage.report'),
		sandboxes: op('usage.sandboxes'),
	},
	wallet: {
		apiUsage: op('wallet.apiUsage'),
		autoRecharge: {
			get: op('wallet.autoRecharge.get'),
			set: op('wallet.autoRecharge.set'),
		},
		balance: op('wallet.balance'),
		browserUsage: op('wallet.browserUsage'),
		checkDeployBalance: op('wallet.checkDeployBalance'),
		claimSignupBonus: op('wallet.claimSignupBonus'),
		paymentMethod: op('wallet.paymentMethod'),
		planUsage: op('wallet.planUsage'),
		purchaseApiCredits: op('wallet.purchaseApiCredits'),
		redeemPromo: op('wallet.redeemPromo'),
		topup: op('wallet.topup'),
		transactions: op('wallet.transactions'),
		validatePromoCode: op('wallet.validatePromoCode'),
	},
	webhooks: {
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		deliveries: {
			list: op('webhooks.deliveries.list'),
			replay: op('webhooks.deliveries.replay'),
		},
		list: op('webhooks.list'),
		test: op('webhooks.test'),
		update: op('webhooks.update'),
	},
} as const;

export const maritimeEndpointSchemas = {
	'account.delete': maritimeSchemaEntry('account.delete'),
	'account.limits': maritimeSchemaEntry('account.limits'),
	'activity.list': maritimeSchemaEntry('activity.list'),
	'agentTemplates.list': maritimeSchemaEntry('agentTemplates.list'),
	'agents.activity': maritimeSchemaEntry('agents.activity'),
	'agents.browserLiveView': maritimeSchemaEntry('agents.browserLiveView'),
	'agents.capabilities.change': maritimeSchemaEntry(
		'agents.capabilities.change',
	),
	'agents.capabilities.get': maritimeSchemaEntry('agents.capabilities.get'),
	'agents.channels.get': maritimeSchemaEntry('agents.channels.get'),
	'agents.channels.update': maritimeSchemaEntry('agents.channels.update'),
	'agents.channels.validateTelegram': maritimeSchemaEntry(
		'agents.channels.validateTelegram',
	),
	'agents.chat.getTurn': maritimeSchemaEntry('agents.chat.getTurn'),
	'agents.chat.send': maritimeSchemaEntry('agents.chat.send'),
	'agents.create': maritimeSchemaEntry('agents.create'),
	'agents.createOwnerLink': maritimeSchemaEntry('agents.createOwnerLink'),
	'agents.delete': maritimeSchemaEntry('agents.delete'),
	'agents.desktop.getMode': maritimeSchemaEntry('agents.desktop.getMode'),
	'agents.desktop.takeover': maritimeSchemaEntry('agents.desktop.takeover'),
	'agents.desktop.updateConfig': maritimeSchemaEntry(
		'agents.desktop.updateConfig',
	),
	'agents.diagnostic': maritimeSchemaEntry('agents.diagnostic'),
	'agents.duplicate': maritimeSchemaEntry('agents.duplicate'),
	'agents.env.create': maritimeSchemaEntry('agents.env.create'),
	'agents.env.delete': maritimeSchemaEntry('agents.env.delete'),
	'agents.env.list': maritimeSchemaEntry('agents.env.list'),
	'agents.env.update': maritimeSchemaEntry('agents.env.update'),
	'agents.exec.cancel': maritimeSchemaEntry('agents.exec.cancel'),
	'agents.exec.get': maritimeSchemaEntry('agents.exec.get'),
	'agents.exec.run': maritimeSchemaEntry('agents.exec.run'),
	'agents.files.delete': maritimeSchemaEntry('agents.files.delete'),
	'agents.files.download': maritimeSchemaEntry('agents.files.download'),
	'agents.files.list': maritimeSchemaEntry('agents.files.list'),
	'agents.files.mkdir': maritimeSchemaEntry('agents.files.mkdir'),
	'agents.files.move': maritimeSchemaEntry('agents.files.move'),
	'agents.files.upload': maritimeSchemaEntry('agents.files.upload'),
	'agents.files.write': maritimeSchemaEntry('agents.files.write'),
	'agents.get': maritimeSchemaEntry('agents.get'),
	'agents.getStopOperation': maritimeSchemaEntry('agents.getStopOperation'),
	'agents.gmail.connect': maritimeSchemaEntry('agents.gmail.connect'),
	'agents.gmail.disconnect': maritimeSchemaEntry('agents.gmail.disconnect'),
	'agents.gmail.enable': maritimeSchemaEntry('agents.gmail.enable'),
	'agents.gmail.status': maritimeSchemaEntry('agents.gmail.status'),
	'agents.hermes.pairings.allow': maritimeSchemaEntry(
		'agents.hermes.pairings.allow',
	),
	'agents.hermes.pairings.approve': maritimeSchemaEntry(
		'agents.hermes.pairings.approve',
	),
	'agents.hermes.pairings.list': maritimeSchemaEntry(
		'agents.hermes.pairings.list',
	),
	'agents.hermes.pairings.revoke': maritimeSchemaEntry(
		'agents.hermes.pairings.revoke',
	),
	'agents.inkboxIdentity': maritimeSchemaEntry('agents.inkboxIdentity'),
	'agents.invoke': maritimeSchemaEntry('agents.invoke'),
	'agents.list': maritimeSchemaEntry('agents.list'),
	'agents.listServers': maritimeSchemaEntry('agents.listServers'),
	'agents.llm.calls': maritimeSchemaEntry('agents.llm.calls'),
	'agents.llm.deleteSpendLimit': maritimeSchemaEntry(
		'agents.llm.deleteSpendLimit',
	),
	'agents.llm.getSpendLimit': maritimeSchemaEntry('agents.llm.getSpendLimit'),
	'agents.llm.reset': maritimeSchemaEntry('agents.llm.reset'),
	'agents.llm.setSpendLimit': maritimeSchemaEntry('agents.llm.setSpendLimit'),
	'agents.llm.status': maritimeSchemaEntry('agents.llm.status'),
	'agents.logs': maritimeSchemaEntry('agents.logs'),
	'agents.maritimeTelegram.connect': maritimeSchemaEntry(
		'agents.maritimeTelegram.connect',
	),
	'agents.maritimeTelegram.disconnect': maritimeSchemaEntry(
		'agents.maritimeTelegram.disconnect',
	),
	'agents.maritimeTelegram.status': maritimeSchemaEntry(
		'agents.maritimeTelegram.status',
	),
	'agents.reloadEnv': maritimeSchemaEntry('agents.reloadEnv'),
	'agents.resetToUpstream': maritimeSchemaEntry('agents.resetToUpstream'),
	'agents.resize': maritimeSchemaEntry('agents.resize'),
	'agents.restart': maritimeSchemaEntry('agents.restart'),
	'agents.setVisibility': maritimeSchemaEntry('agents.setVisibility'),
	'agents.shareLinks.create': maritimeSchemaEntry('agents.shareLinks.create'),
	'agents.shareLinks.list': maritimeSchemaEntry('agents.shareLinks.list'),
	'agents.shareLinks.revoke': maritimeSchemaEntry('agents.shareLinks.revoke'),
	'agents.shareLinks.revokeForEndUser': maritimeSchemaEntry(
		'agents.shareLinks.revokeForEndUser',
	),
	'agents.signedWebhook.delete': maritimeSchemaEntry(
		'agents.signedWebhook.delete',
	),
	'agents.signedWebhook.get': maritimeSchemaEntry('agents.signedWebhook.get'),
	'agents.signedWebhook.set': maritimeSchemaEntry('agents.signedWebhook.set'),
	'agents.skills.delete': maritimeSchemaEntry('agents.skills.delete'),
	'agents.skills.export': maritimeSchemaEntry('agents.skills.export'),
	'agents.skills.install': maritimeSchemaEntry('agents.skills.install'),
	'agents.skills.list': maritimeSchemaEntry('agents.skills.list'),
	'agents.skills.search': maritimeSchemaEntry('agents.skills.search'),
	'agents.skills.setAllowlist': maritimeSchemaEntry(
		'agents.skills.setAllowlist',
	),
	'agents.skills.setEnv': maritimeSchemaEntry('agents.skills.setEnv'),
	'agents.skills.upload': maritimeSchemaEntry('agents.skills.upload'),
	'agents.sleep': maritimeSchemaEntry('agents.sleep'),
	'agents.start': maritimeSchemaEntry('agents.start'),
	'agents.stats': maritimeSchemaEntry('agents.stats'),
	'agents.stop': maritimeSchemaEntry('agents.stop'),
	'agents.triggers.create': maritimeSchemaEntry('agents.triggers.create'),
	'agents.triggers.delete': maritimeSchemaEntry('agents.triggers.delete'),
	'agents.triggers.list': maritimeSchemaEntry('agents.triggers.list'),
	'agents.triggers.update': maritimeSchemaEntry('agents.triggers.update'),
	'agents.update': maritimeSchemaEntry('agents.update'),
	'agents.webhookToken.get': maritimeSchemaEntry('agents.webhookToken.get'),
	'agents.webhookToken.rotate': maritimeSchemaEntry(
		'agents.webhookToken.rotate',
	),
	'agents.whatsapp.cancel': maritimeSchemaEntry('agents.whatsapp.cancel'),
	'agents.whatsapp.log': maritimeSchemaEntry('agents.whatsapp.log'),
	'agents.whatsapp.pairings.approve': maritimeSchemaEntry(
		'agents.whatsapp.pairings.approve',
	),
	'agents.whatsapp.pairings.deny': maritimeSchemaEntry(
		'agents.whatsapp.pairings.deny',
	),
	'agents.whatsapp.pairings.list': maritimeSchemaEntry(
		'agents.whatsapp.pairings.list',
	),
	'agents.whatsapp.start': maritimeSchemaEntry('agents.whatsapp.start'),
	'agents.whatsapp.status': maritimeSchemaEntry('agents.whatsapp.status'),
	'apiKeys.create': maritimeSchemaEntry('apiKeys.create'),
	'apiKeys.list': maritimeSchemaEntry('apiKeys.list'),
	'apiKeys.revoke': maritimeSchemaEntry('apiKeys.revoke'),
	'appium.sessions.get': maritimeSchemaEntry('appium.sessions.get'),
	'appium.sessions.list': maritimeSchemaEntry('appium.sessions.list'),
	'apps.delete': maritimeSchemaEntry('apps.delete'),
	'apps.get': maritimeSchemaEntry('apps.get'),
	'apps.list': maritimeSchemaEntry('apps.list'),
	'apps.upload': maritimeSchemaEntry('apps.upload'),
	'billing.agentPay.createLink': maritimeSchemaEntry(
		'billing.agentPay.createLink',
	),
	'billing.agents': maritimeSchemaEntry('billing.agents'),
	'billing.cancelSwitchToUsage': maritimeSchemaEntry(
		'billing.cancelSwitchToUsage',
	),
	'billing.config': maritimeSchemaEntry('billing.config'),
	'billing.machineTypes': maritimeSchemaEntry('billing.machineTypes'),
	'billing.meteredUsage': maritimeSchemaEntry('billing.meteredUsage'),
	'billing.plan.change': maritimeSchemaEntry('billing.plan.change'),
	'billing.plan.changeWithTrial': maritimeSchemaEntry(
		'billing.plan.changeWithTrial',
	),
	'billing.plan.preview': maritimeSchemaEntry('billing.plan.preview'),
	'billing.plan.resume': maritimeSchemaEntry('billing.plan.resume'),
	'billing.retryPayment': maritimeSchemaEntry('billing.retryPayment'),
	'billing.summary': maritimeSchemaEntry('billing.summary'),
	'billing.switchToUsage': maritimeSchemaEntry('billing.switchToUsage'),
	'billing.trial.cancel': maritimeSchemaEntry('billing.trial.cancel'),
	'billing.trial.get': maritimeSchemaEntry('billing.trial.get'),
	'billing.trial.start': maritimeSchemaEntry('billing.trial.start'),
	'billing.usage': maritimeSchemaEntry('billing.usage'),
	'computers.actions': maritimeSchemaEntry('computers.actions'),
	'computers.completeTakeover': maritimeSchemaEntry(
		'computers.completeTakeover',
	),
	'computers.create': maritimeSchemaEntry('computers.create'),
	'computers.createViewer': maritimeSchemaEntry('computers.createViewer'),
	'computers.delete': maritimeSchemaEntry('computers.delete'),
	'computers.exec': maritimeSchemaEntry('computers.exec'),
	'computers.files.list': maritimeSchemaEntry('computers.files.list'),
	'computers.files.read': maritimeSchemaEntry('computers.files.read'),
	'computers.files.write': maritimeSchemaEntry('computers.files.write'),
	'computers.get': maritimeSchemaEntry('computers.get'),
	'computers.installApp': maritimeSchemaEntry('computers.installApp'),
	'computers.list': maritimeSchemaEntry('computers.list'),
	'computers.screenshot': maritimeSchemaEntry('computers.screenshot'),
	'computers.sessions.close': maritimeSchemaEntry('computers.sessions.close'),
	'computers.sessions.list': maritimeSchemaEntry('computers.sessions.list'),
	'computers.sleep': maritimeSchemaEntry('computers.sleep'),
	'computers.tools.call': maritimeSchemaEntry('computers.tools.call'),
	'computers.tools.list': maritimeSchemaEntry('computers.tools.list'),
	'computers.usage': maritimeSchemaEntry('computers.usage'),
	'computers.wake': maritimeSchemaEntry('computers.wake'),
	'deletedAgents.get': maritimeSchemaEntry('deletedAgents.get'),
	'deletedAgents.list': maritimeSchemaEntry('deletedAgents.list'),
	'deployments.cancel': maritimeSchemaEntry('deployments.cancel'),
	'deployments.create': maritimeSchemaEntry('deployments.create'),
	'deployments.get': maritimeSchemaEntry('deployments.get'),
	'deployments.list': maritimeSchemaEntry('deployments.list'),
	'deployments.listForAgent': maritimeSchemaEntry('deployments.listForAgent'),
	'deployments.uploadZip': maritimeSchemaEntry('deployments.uploadZip'),
	'domains.check': maritimeSchemaEntry('domains.check'),
	'domains.create': maritimeSchemaEntry('domains.create'),
	'domains.delete': maritimeSchemaEntry('domains.delete'),
	'domains.get': maritimeSchemaEntry('domains.get'),
	'domains.labels.delete': maritimeSchemaEntry('domains.labels.delete'),
	'domains.labels.list': maritimeSchemaEntry('domains.labels.list'),
	'domains.labels.set': maritimeSchemaEntry('domains.labels.set'),
	'domains.list': maritimeSchemaEntry('domains.list'),
	'endUsers.activity': maritimeSchemaEntry('endUsers.activity'),
	'endUsers.agents.create': maritimeSchemaEntry('endUsers.agents.create'),
	'endUsers.agents.list': maritimeSchemaEntry('endUsers.agents.list'),
	'endUsers.delete': maritimeSchemaEntry('endUsers.delete'),
	'endUsers.get': maritimeSchemaEntry('endUsers.get'),
	'endUsers.list': maritimeSchemaEntry('endUsers.list'),
	'endUsers.policy.delete': maritimeSchemaEntry('endUsers.policy.delete'),
	'endUsers.policy.get': maritimeSchemaEntry('endUsers.policy.get'),
	'endUsers.policy.set': maritimeSchemaEntry('endUsers.policy.set'),
	'endUsers.resume': maritimeSchemaEntry('endUsers.resume'),
	'endUsers.summary': maritimeSchemaEntry('endUsers.summary'),
	'endUsers.suspend': maritimeSchemaEntry('endUsers.suspend'),
	'endUsers.tokens.create': maritimeSchemaEntry('endUsers.tokens.create'),
	'endUsers.tokens.revoke': maritimeSchemaEntry('endUsers.tokens.revoke'),
	'endUsers.upsert': maritimeSchemaEntry('endUsers.upsert'),
	'feedback.create': maritimeSchemaEntry('feedback.create'),
	'feedback.list': maritimeSchemaEntry('feedback.list'),
	'fleet.activity': maritimeSchemaEntry('fleet.activity'),
	'fleet.batchCreate': maritimeSchemaEntry('fleet.batchCreate'),
	'fleet.overview': maritimeSchemaEntry('fleet.overview'),
	'fleet.propagate': maritimeSchemaEntry('fleet.propagate'),
	'fleet.summary': maritimeSchemaEntry('fleet.summary'),
	'health.check': maritimeSchemaEntry('health.check'),
	'llmSpendLimit.deleteDefault': maritimeSchemaEntry(
		'llmSpendLimit.deleteDefault',
	),
	'llmSpendLimit.getDefault': maritimeSchemaEntry('llmSpendLimit.getDefault'),
	'llmSpendLimit.setDefault': maritimeSchemaEntry('llmSpendLimit.setDefault'),
	'logs.list': maritimeSchemaEntry('logs.list'),
	'network.activity': maritimeSchemaEntry('network.activity'),
	'network.install.get': maritimeSchemaEntry('network.install.get'),
	'network.install.unixScript': maritimeSchemaEntry(
		'network.install.unixScript',
	),
	'network.install.windowsScript': maritimeSchemaEntry(
		'network.install.windowsScript',
	),
	'network.presets.create': maritimeSchemaEntry('network.presets.create'),
	'network.presets.delete': maritimeSchemaEntry('network.presets.delete'),
	'network.presets.list': maritimeSchemaEntry('network.presets.list'),
	'network.presets.update': maritimeSchemaEntry('network.presets.update'),
	'network.privateNetworks.addResource': maritimeSchemaEntry(
		'network.privateNetworks.addResource',
	),
	'network.privateNetworks.create': maritimeSchemaEntry(
		'network.privateNetworks.create',
	),
	'network.privateNetworks.createInstall': maritimeSchemaEntry(
		'network.privateNetworks.createInstall',
	),
	'network.privateNetworks.delete': maritimeSchemaEntry(
		'network.privateNetworks.delete',
	),
	'network.privateNetworks.deleteResource': maritimeSchemaEntry(
		'network.privateNetworks.deleteResource',
	),
	'network.privateNetworks.list': maritimeSchemaEntry(
		'network.privateNetworks.list',
	),
	'network.privateNetworks.update': maritimeSchemaEntry(
		'network.privateNetworks.update',
	),
	'network.settings.get': maritimeSchemaEntry('network.settings.get'),
	'network.settings.update': maritimeSchemaEntry('network.settings.update'),
	'network.workloads.get': maritimeSchemaEntry('network.workloads.get'),
	'network.workloads.newIp': maritimeSchemaEntry('network.workloads.newIp'),
	'network.workloads.test': maritimeSchemaEntry('network.workloads.test'),
	'network.workloads.update': maritimeSchemaEntry('network.workloads.update'),
	'notifications.list': maritimeSchemaEntry('notifications.list'),
	'notifications.markRead': maritimeSchemaEntry('notifications.markRead'),
	'notifications.readAll': maritimeSchemaEntry('notifications.readAll'),
	'notifications.unreadCount': maritimeSchemaEntry('notifications.unreadCount'),
	'organizations.create': maritimeSchemaEntry('organizations.create'),
	'organizations.delete': maritimeSchemaEntry('organizations.delete'),
	'organizations.invites.accept': maritimeSchemaEntry(
		'organizations.invites.accept',
	),
	'organizations.invites.create': maritimeSchemaEntry(
		'organizations.invites.create',
	),
	'organizations.invites.list': maritimeSchemaEntry(
		'organizations.invites.list',
	),
	'organizations.invites.preview': maritimeSchemaEntry(
		'organizations.invites.preview',
	),
	'organizations.invites.resend': maritimeSchemaEntry(
		'organizations.invites.resend',
	),
	'organizations.invites.revoke': maritimeSchemaEntry(
		'organizations.invites.revoke',
	),
	'organizations.leave': maritimeSchemaEntry('organizations.leave'),
	'organizations.me': maritimeSchemaEntry('organizations.me'),
	'organizations.members.changeRole': maritimeSchemaEntry(
		'organizations.members.changeRole',
	),
	'organizations.members.list': maritimeSchemaEntry(
		'organizations.members.list',
	),
	'organizations.members.remove': maritimeSchemaEntry(
		'organizations.members.remove',
	),
	'organizations.rename': maritimeSchemaEntry('organizations.rename'),
	'plans.cancel': maritimeSchemaEntry('plans.cancel'),
	'plans.launchPromo': maritimeSchemaEntry('plans.launchPromo'),
	'plans.list': maritimeSchemaEntry('plans.list'),
	'plans.portal': maritimeSchemaEntry('plans.portal'),
	'plans.subscribe': maritimeSchemaEntry('plans.subscribe'),
	'preferences.get': maritimeSchemaEntry('preferences.get'),
	'preferences.update': maritimeSchemaEntry('preferences.update'),
	'projects.bindings.list': maritimeSchemaEntry('projects.bindings.list'),
	'projects.bindings.reassign': maritimeSchemaEntry(
		'projects.bindings.reassign',
	),
	'projects.bindings.unbind': maritimeSchemaEntry('projects.bindings.unbind'),
	'projects.claimCodes.create': maritimeSchemaEntry(
		'projects.claimCodes.create',
	),
	'projects.claimCodes.list': maritimeSchemaEntry('projects.claimCodes.list'),
	'projects.get': maritimeSchemaEntry('projects.get'),
	'projects.list': maritimeSchemaEntry('projects.list'),
	'projects.messages.get': maritimeSchemaEntry('projects.messages.get'),
	'projects.messages.send': maritimeSchemaEntry('projects.messages.send'),
	'projects.syncInstances': maritimeSchemaEntry('projects.syncInstances'),
	'projects.telegram.connect': maritimeSchemaEntry('projects.telegram.connect'),
	'projects.telegram.disconnect': maritimeSchemaEntry(
		'projects.telegram.disconnect',
	),
	'projects.update': maritimeSchemaEntry('projects.update'),
	'projects.usage': maritimeSchemaEntry('projects.usage'),
	'projects.users.get': maritimeSchemaEntry('projects.users.get'),
	'projects.users.list': maritimeSchemaEntry('projects.users.list'),
	'projects.users.unbind': maritimeSchemaEntry('projects.users.unbind'),
	'sandboxKeys.create': maritimeSchemaEntry('sandboxKeys.create'),
	'sandboxKeys.list': maritimeSchemaEntry('sandboxKeys.list'),
	'sandboxKeys.revoke': maritimeSchemaEntry('sandboxKeys.revoke'),
	'sandboxWebhooks.create': maritimeSchemaEntry('sandboxWebhooks.create'),
	'sandboxWebhooks.delete': maritimeSchemaEntry('sandboxWebhooks.delete'),
	'sandboxWebhooks.deliveries': maritimeSchemaEntry(
		'sandboxWebhooks.deliveries',
	),
	'sandboxWebhooks.list': maritimeSchemaEntry('sandboxWebhooks.list'),
	'sandboxes.code.run': maritimeSchemaEntry('sandboxes.code.run'),
	'sandboxes.commands.get': maritimeSchemaEntry('sandboxes.commands.get'),
	'sandboxes.commands.history': maritimeSchemaEntry(
		'sandboxes.commands.history',
	),
	'sandboxes.commands.kill': maritimeSchemaEntry('sandboxes.commands.kill'),
	'sandboxes.commands.run': maritimeSchemaEntry('sandboxes.commands.run'),
	'sandboxes.create': maritimeSchemaEntry('sandboxes.create'),
	'sandboxes.createScreenViewer': maritimeSchemaEntry(
		'sandboxes.createScreenViewer',
	),
	'sandboxes.createUrl': maritimeSchemaEntry('sandboxes.createUrl'),
	'sandboxes.ephemeral.create': maritimeSchemaEntry(
		'sandboxes.ephemeral.create',
	),
	'sandboxes.ephemeral.extend': maritimeSchemaEntry(
		'sandboxes.ephemeral.extend',
	),
	'sandboxes.ephemeral.kill': maritimeSchemaEntry('sandboxes.ephemeral.kill'),
	'sandboxes.ephemeral.list': maritimeSchemaEntry('sandboxes.ephemeral.list'),
	'sandboxes.files.delete': maritimeSchemaEntry('sandboxes.files.delete'),
	'sandboxes.files.list': maritimeSchemaEntry('sandboxes.files.list'),
	'sandboxes.files.read': maritimeSchemaEntry('sandboxes.files.read'),
	'sandboxes.files.write': maritimeSchemaEntry('sandboxes.files.write'),
	'sandboxes.get': maritimeSchemaEntry('sandboxes.get'),
	'sandboxes.info': maritimeSchemaEntry('sandboxes.info'),
	'sandboxes.kill': maritimeSchemaEntry('sandboxes.kill'),
	'sandboxes.list': maritimeSchemaEntry('sandboxes.list'),
	'sandboxes.pause': maritimeSchemaEntry('sandboxes.pause'),
	'sandboxes.promote': maritimeSchemaEntry('sandboxes.promote'),
	'sandboxes.rotateSecret': maritimeSchemaEntry('sandboxes.rotateSecret'),
	'sandboxes.save': maritimeSchemaEntry('sandboxes.save'),
	'sandboxes.update': maritimeSchemaEntry('sandboxes.update'),
	'sandboxes.usage': maritimeSchemaEntry('sandboxes.usage'),
	'secrets.delete': maritimeSchemaEntry('secrets.delete'),
	'secrets.list': maritimeSchemaEntry('secrets.list'),
	'secrets.set': maritimeSchemaEntry('secrets.set'),
	'servers.list': maritimeSchemaEntry('servers.list'),
	'servers.release': maritimeSchemaEntry('servers.release'),
	'servers.rent': maritimeSchemaEntry('servers.rent'),
	'snapshots.delete': maritimeSchemaEntry('snapshots.delete'),
	'snapshots.get': maritimeSchemaEntry('snapshots.get'),
	'snapshots.list': maritimeSchemaEntry('snapshots.list'),
	'stripe.createPortalSession': maritimeSchemaEntry(
		'stripe.createPortalSession',
	),
	'stripe.invoices': maritimeSchemaEntry('stripe.invoices'),
	'stripe.paymentMethods': maritimeSchemaEntry('stripe.paymentMethods'),
	'stripe.subscriptions.cancel': maritimeSchemaEntry(
		'stripe.subscriptions.cancel',
	),
	'stripe.subscriptions.list': maritimeSchemaEntry('stripe.subscriptions.list'),
	'swarms.cancel': maritimeSchemaEntry('swarms.cancel'),
	'swarms.create': maritimeSchemaEntry('swarms.create'),
	'swarms.get': maritimeSchemaEntry('swarms.get'),
	'swarms.getAccess': maritimeSchemaEntry('swarms.getAccess'),
	'swarms.list': maritimeSchemaEntry('swarms.list'),
	'swarms.requestAccess': maritimeSchemaEntry('swarms.requestAccess'),
	'swarms.results': maritimeSchemaEntry('swarms.results'),
	'templates.create': maritimeSchemaEntry('templates.create'),
	'templates.delete': maritimeSchemaEntry('templates.delete'),
	'templates.get': maritimeSchemaEntry('templates.get'),
	'templates.list': maritimeSchemaEntry('templates.list'),
	'usage.daily': maritimeSchemaEntry('usage.daily'),
	'usage.report': maritimeSchemaEntry('usage.report'),
	'usage.sandboxes': maritimeSchemaEntry('usage.sandboxes'),
	'wallet.apiUsage': maritimeSchemaEntry('wallet.apiUsage'),
	'wallet.autoRecharge.get': maritimeSchemaEntry('wallet.autoRecharge.get'),
	'wallet.autoRecharge.set': maritimeSchemaEntry('wallet.autoRecharge.set'),
	'wallet.balance': maritimeSchemaEntry('wallet.balance'),
	'wallet.browserUsage': maritimeSchemaEntry('wallet.browserUsage'),
	'wallet.checkDeployBalance': maritimeSchemaEntry('wallet.checkDeployBalance'),
	'wallet.claimSignupBonus': maritimeSchemaEntry('wallet.claimSignupBonus'),
	'wallet.paymentMethod': maritimeSchemaEntry('wallet.paymentMethod'),
	'wallet.planUsage': maritimeSchemaEntry('wallet.planUsage'),
	'wallet.purchaseApiCredits': maritimeSchemaEntry('wallet.purchaseApiCredits'),
	'wallet.redeemPromo': maritimeSchemaEntry('wallet.redeemPromo'),
	'wallet.topup': maritimeSchemaEntry('wallet.topup'),
	'wallet.transactions': maritimeSchemaEntry('wallet.transactions'),
	'wallet.validatePromoCode': maritimeSchemaEntry('wallet.validatePromoCode'),
	'webhooks.create': maritimeSchemaEntry('webhooks.create'),
	'webhooks.delete': maritimeSchemaEntry('webhooks.delete'),
	'webhooks.deliveries.list': maritimeSchemaEntry('webhooks.deliveries.list'),
	'webhooks.deliveries.replay': maritimeSchemaEntry(
		'webhooks.deliveries.replay',
	),
	'webhooks.list': maritimeSchemaEntry('webhooks.list'),
	'webhooks.test': maritimeSchemaEntry('webhooks.test'),
	'webhooks.update': maritimeSchemaEntry('webhooks.update'),
} satisfies RequiredPluginEndpointSchemas<typeof maritimeEndpointsNested>;

export const maritimeEndpointMeta = {
	'account.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete the whole Maritime account with every agent, machine and key (irreversible)',
	},
	'account.limits': {
		riskLevel: 'read',
		description:
			'Get the plan, machine counts and caps, and the size limits of one agent',
	},
	'activity.list': {
		riskLevel: 'read',
		description:
			"Get what happened across the account's agents and computers (creates, boots, starts, sleeps, wakes, takeovers, deletes, errors, triggers), newest first",
	},
	'agentTemplates.list': {
		riskLevel: 'read',
		description:
			'List the agent templates (OpenClaw, Hermes, Codex, Claude Code ...) agents.create takes as templateId; public',
	},
	'agents.activity': {
		riskLevel: 'read',
		description: 'Get the stored events of the agent, newest first',
	},
	'agents.browserLiveView': {
		riskLevel: 'read',
		description: "Get a live view link to an agent's browser",
	},
	'agents.capabilities.change': {
		riskLevel: 'write',
		description:
			"Turn one of an agent's capabilities (browser, screen, email ...) on or off",
	},
	'agents.capabilities.get': {
		riskLevel: 'read',
		description: "Get an agent's capabilities and whether each is on",
	},
	'agents.channels.get': {
		riskLevel: 'read',
		description:
			'Read gateway channels: from the live container when active, else from stored boot config',
	},
	'agents.channels.update': {
		riskLevel: 'write',
		description: 'Update gateway channels',
	},
	'agents.channels.validateTelegram': {
		riskLevel: 'read',
		description:
			'Validate a BotFather token via Telegram getMe (no container required)',
	},
	'agents.chat.getTurn': {
		riskLevel: 'read',
		description:
			"Get the caller's retained builtin result without submitting a new message",
	},
	'agents.chat.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send a message to an agent and wait for its reply; a sleeping agent wakes first',
	},
	'agents.create': {
		riskLevel: 'destructive',
		description:
			'Create an agent from a template (agentTemplates.list) and start deploying it; billed while it exists',
	},
	'agents.createOwnerLink': {
		riskLevel: 'write',
		description: "Mints the owner's 24-hour link to a private agent URL",
	},
	'agents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an agent',
	},
	'agents.desktop.getMode': {
		riskLevel: 'read',
		description:
			"Get whether an agent's desktop is driven by the agent or taken over by a person",
	},
	'agents.desktop.takeover': {
		riskLevel: 'write',
		description: "Take over or hand back an agent's desktop",
	},
	'agents.desktop.updateConfig': {
		riskLevel: 'write',
		description:
			'Turn the screen capability on/off for an existing agent (owner only)',
	},
	'agents.diagnostic': {
		riskLevel: 'read',
		description:
			'Get the current recognized issue for an errored agent, if any',
	},
	'agents.duplicate': {
		riskLevel: 'destructive',
		description:
			"Create N new agents from this agent's definition (each billed while it exists)",
	},
	'agents.env.create': {
		riskLevel: 'write',
		description: 'Create or replace one environment variable of an agent',
	},
	'agents.env.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete one environment variable of an agent',
	},
	'agents.env.list': {
		riskLevel: 'read',
		description: "List an agent's environment variables (secret values masked)",
	},
	'agents.env.update': {
		riskLevel: 'write',
		description: 'Update one environment variable of an agent',
	},
	'agents.exec.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a running execution; answers with its final result',
	},
	'agents.exec.get': {
		riskLevel: 'read',
		description:
			'Get an execution started with agents.exec.run: status, exit code and output',
	},
	'agents.exec.run': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Run a shell command in an agent's machine, attached (waits) or detached (returns an execution id)",
	},
	'agents.files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a file or directory (recursive) within the agent's persistent volume",
	},
	'agents.files.download': {
		riskLevel: 'read',
		description:
			"Download a file from an agent's machine by absolute path (returned as a file)",
	},
	'agents.files.list': {
		riskLevel: 'read',
		description: "List a directory inside the agent's container (file browser)",
	},
	'agents.files.mkdir': {
		riskLevel: 'write',
		description:
			"Create a directory (mkdir -p) inside the agent's persistent volume",
	},
	'agents.files.move': {
		riskLevel: 'write',
		description:
			"Rename or move a file/directory within the agent's persistent volume",
	},
	'agents.files.upload': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Upload a file to an agent's disk (dest_dir) or as a chat attachment",
	},
	'agents.files.write': {
		riskLevel: 'write',
		description:
			'Write text content to a file inside the agent container (workspace editor)',
	},
	'agents.get': {
		riskLevel: 'read',
		description: 'Get one agent: status, template, size, URLs and end user',
	},
	'agents.getStopOperation': {
		riskLevel: 'read',
		description: 'Get the progress of a graceful agent stop',
	},
	'agents.gmail.connect': {
		riskLevel: 'write',
		description: 'Inject Gmail credentials into the running agent container',
	},
	'agents.gmail.disconnect': {
		riskLevel: 'write',
		description:
			'Disconnect Gmail: remove credentials, clean container, delete trigger',
	},
	'agents.gmail.enable': {
		riskLevel: 'write',
		description:
			'Enable Gmail for an agent (older name of agents.gmail.connect)',
	},
	'agents.gmail.status': {
		riskLevel: 'read',
		description: 'Check whether Gmail is connected for this agent',
	},
	'agents.hermes.pairings.allow': {
		riskLevel: 'write',
		description: 'Pre-approve a contact by identity',
	},
	'agents.hermes.pairings.approve': {
		riskLevel: 'write',
		description: 'Approve a one-time pairing code the contact relayed',
	},
	'agents.hermes.pairings.list': {
		riskLevel: 'read',
		description:
			'Pending pairing requests + approved contacts across all platforms',
	},
	'agents.hermes.pairings.revoke': {
		riskLevel: 'write',
		description: 'Remove a contact from the approved list',
	},
	'agents.inkboxIdentity': {
		riskLevel: 'read',
		description:
			'Get the Inkbox identity info (phone number, email) for an agent',
	},
	'agents.invoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Post a payload to an agent's invoke URL; it is delivered in the background, waking the agent",
	},
	'agents.list': {
		riskLevel: 'read',
		description: 'List your agents',
	},
	'agents.listServers': {
		riskLevel: 'read',
		description: 'Get active servers for server selection during deploy',
	},
	'agents.llm.calls': {
		riskLevel: 'read',
		description:
			'Get the metered LLM calls of the agent with tokens and cost, newest first',
	},
	'agents.llm.deleteSpendLimit': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Removes the agent's own limit, so the agent follows the account default",
	},
	'agents.llm.getSpendLimit': {
		riskLevel: 'read',
		description:
			'Get the limit that applies to the agent and its spend this month',
	},
	'agents.llm.reset': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Replace the agent's OpenAI key with a Maritime proxy token and set the base URL",
	},
	'agents.llm.setSpendLimit': {
		riskLevel: 'write',
		description: "Sets the agent's own monthly limit",
	},
	'agents.llm.status': {
		riskLevel: 'read',
		description:
			'Check whether the agent is using the Maritime LLM proxy or a custom key',
	},
	'agents.logs': {
		riskLevel: 'read',
		description: "Read an agent's logs, newest first, filtered by level",
	},
	'agents.maritimeTelegram.connect': {
		riskLevel: 'write',
		description: 'Issue a one-tap deep link the user opens in Telegram',
	},
	'agents.maritimeTelegram.disconnect': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Remove this agent's binding to the shared Maritime bot",
	},
	'agents.maritimeTelegram.status': {
		riskLevel: 'read',
		description: 'Get current binding state: not_connected | pending | bound',
	},
	'agents.reloadEnv': {
		riskLevel: 'write',
		description:
			'Applies saved environment variables, starting a parked Agent when necessary',
	},
	'agents.resetToUpstream': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Requests a fresh upstream root while preserving the assigned /data volume',
	},
	'agents.resize': {
		riskLevel: 'destructive',
		description: "Change an agent's RAM / SSD allocation or always-on state",
	},
	'agents.restart': {
		riskLevel: 'destructive',
		description:
			'Get the Agent after the configured restart operation completes',
	},
	'agents.setVisibility': {
		riskLevel: 'write',
		description: 'Sets who may open the agent URL: ``private`` or ``public``',
	},
	'agents.shareLinks.create': {
		riskLevel: 'write',
		description: 'Mints a shared link',
	},
	'agents.shareLinks.list': {
		riskLevel: 'read',
		description: "Lists the agent's live links without their secrets",
	},
	'agents.shareLinks.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revokes one link',
	},
	'agents.shareLinks.revokeForEndUser': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revokes every live link of the agent bound to the end user and returns the count',
	},
	'agents.signedWebhook.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Removes the agent's signed webhook address",
	},
	'agents.signedWebhook.get': {
		riskLevel: 'read',
		description: "Get the agent's signed webhook address",
	},
	'agents.signedWebhook.set': {
		riskLevel: 'write',
		description: "Sets the agent's one signed webhook address",
	},
	'agents.skills.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove an installed skill (workspace or managed dir) and drop its lines from the dependency manifest',
	},
	'agents.skills.export': {
		riskLevel: 'read',
		description:
			'Download an installed skill as a .tar.gz: the other half of upload',
	},
	'agents.skills.install': {
		riskLevel: 'write',
		description: 'Install a skill from ClawHub on an agent',
	},
	'agents.skills.list': {
		riskLevel: 'read',
		description: "Enumerate OpenClaw skills available in this agent's runtime",
	},
	'agents.skills.search': {
		riskLevel: 'read',
		description:
			"Search the framework's community registry server-side: ClawHub (clawhub.ai) for openclaw-family agents, skills.sh for hermes-family",
	},
	'agents.skills.setAllowlist': {
		riskLevel: 'write',
		description:
			'Set the per-agent skill toggle state inside the running container',
	},
	'agents.skills.setEnv': {
		riskLevel: 'write',
		description:
			"Upsert env vars for skills that gate on them (NOTION_API_KEY, GOOGLE_PLACES_API_KEY, …) and trigger a container restart so the agent's gateway picks them up",
	},
	'agents.skills.upload': {
		riskLevel: 'write',
		description:
			'Install a CUSTOM skill from an uploaded archive, then run the same just-works pipeline as /skills/install (env apply, binary auto-resolve, final-state report)',
	},
	'agents.sleep': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Put an agent to sleep now (it wakes on the next message, webhook or trigger)',
	},
	'agents.start': {
		riskLevel: 'destructive',
		description: 'Start a stopped agent (billed while it runs)',
	},
	'agents.stats': {
		riskLevel: 'read',
		description: "Get an agent's CPU, memory and disk use",
	},
	'agents.stop': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Stops immediately or accepts a graceful stop for the Agent's current boot",
	},
	'agents.triggers.create': {
		riskLevel: 'write',
		description: 'Create a trigger that wakes an agent on a schedule or event',
	},
	'agents.triggers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Delete one of an agent's triggers",
	},
	'agents.triggers.list': {
		riskLevel: 'read',
		description: "List an agent's triggers",
	},
	'agents.triggers.update': {
		riskLevel: 'write',
		description: "Update one of an agent's triggers",
	},
	'agents.update': {
		riskLevel: 'write',
		description: 'Update agent metadata',
	},
	'agents.webhookToken.get': {
		riskLevel: 'read',
		description:
			'Get the invoke token for an agent you own, plus a ready-to-use URL',
	},
	'agents.webhookToken.rotate': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Replaces the agent's invoke token with a new stored secret",
	},
	'agents.whatsapp.cancel': {
		riskLevel: 'write',
		description: 'Cancel the WhatsApp linking that agents.whatsapp.start began',
	},
	'agents.whatsapp.log': {
		riskLevel: 'read',
		description: 'Get the last ~4KB of helper stdout/stderr for debugging',
	},
	'agents.whatsapp.pairings.approve': {
		riskLevel: 'write',
		description:
			'Approve a WhatsApp contact asking to talk to an agent, by pairing code',
	},
	'agents.whatsapp.pairings.deny': {
		riskLevel: 'write',
		description:
			'Deny a WhatsApp contact asking to talk to an agent, by pairing code',
	},
	'agents.whatsapp.pairings.list': {
		riskLevel: 'read',
		description: 'Get the WhatsApp pending pairing list + current allowlist',
	},
	'agents.whatsapp.start': {
		riskLevel: 'write',
		description:
			'Start linking a WhatsApp number to an agent (returns the QR or pairing step)',
	},
	'agents.whatsapp.status': {
		riskLevel: 'read',
		description: "Get the state of an agent's WhatsApp link",
	},
	'apiKeys.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Create a new API key',
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description: "List the account's API keys with their scopes (no secrets)",
	},
	'apiKeys.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke an account API key; it stops working at once',
	},
	'appium.sessions.get': {
		riskLevel: 'read',
		description:
			'One session with download URLs of its video, logcat and command log, valid for one hour',
	},
	'appium.sessions.list': {
		riskLevel: 'read',
		description:
			"The account's Appium sessions, newest first, of one phone when ``computerId`` is given",
	},
	'apps.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the app and its file',
	},
	'apps.get': {
		riskLevel: 'read',
		description: 'One app of the account',
	},
	'apps.list': {
		riskLevel: 'read',
		description: "The account's apps, newest first",
	},
	'apps.upload': {
		riskLevel: 'write',
		description:
			'Stores the APK in the multipart field ``file`` (at most 1 GiB)',
	},
	'billing.agentPay.createLink': {
		riskLevel: 'destructive',
		description:
			'A short-lived link an agent pays at with an MPP client, for example ``link-cli mpp pay <payUrl> -X POST``',
	},
	'billing.agents': {
		riskLevel: 'read',
		description: 'Get this billing period cost per agent',
	},
	'billing.cancelSwitchToUsage': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a pending switch to usage billing',
	},
	'billing.config': {
		riskLevel: 'read',
		description: 'Get the live price list Maritime bills with',
	},
	'billing.machineTypes': {
		riskLevel: 'read',
		description: 'List machine types with their prices',
	},
	'billing.meteredUsage': {
		riskLevel: 'read',
		description:
			'Get this billing period: plan credit, cents used, overage, and usage by machine type and machine',
	},
	'billing.plan.change': {
		riskLevel: 'destructive',
		description: 'Change the selected plan under the ordinary checkout rules',
	},
	'billing.plan.changeWithTrial': {
		riskLevel: 'destructive',
		description: 'Open Starter Checkout only while a trial is still available',
	},
	'billing.plan.preview': {
		riskLevel: 'read',
		description:
			'What picking ``plan`` would do now: charge today, discount, awake limit and the sentence to show before confirming',
	},
	'billing.plan.resume': {
		riskLevel: 'destructive',
		description: 'Resume a plan that was set to cancel (charges the plan fee)',
	},
	'billing.retryPayment': {
		riskLevel: 'destructive',
		description:
			"Pays a past-due plan's open invoice now with the card on file",
	},
	'billing.summary': {
		riskLevel: 'read',
		description:
			'Get the billing summary: agents, cost and compute minutes this period',
	},
	'billing.switchToUsage': {
		riskLevel: 'destructive',
		description:
			'A seat-plan account moves to a usage plan at its seat period end',
	},
	'billing.trial.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel the free trial',
	},
	'billing.trial.get': {
		riskLevel: 'read',
		description: 'Get the free trial state',
	},
	'billing.trial.start': {
		riskLevel: 'destructive',
		description: 'Start the 7-day free trial (needs a card on file)',
	},
	'billing.usage': {
		riskLevel: 'read',
		description: 'Get raw usage data for the current billing period',
	},
	'computers.actions': {
		riskLevel: 'destructive',
		description:
			'Run one action (screenshot, click, type, key, scroll ...) or a batch on a computer; wakes it',
	},
	'computers.completeTakeover': {
		riskLevel: 'write',
		description: 'Hand control back to the agent (viewer token, control mode)',
	},
	'computers.create': {
		riskLevel: 'destructive',
		description:
			'Get or create the computer (Linux or Windows desktop, Android phone) of one end user; billed while awake',
	},
	'computers.createViewer': {
		riskLevel: 'write',
		description: 'Mint a viewer link (watch or control)',
	},
	'computers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a computer, its volume, and its snapshots',
	},
	'computers.exec': {
		riskLevel: 'destructive',
		description: 'Run a shell command inside the computer',
	},
	'computers.files.list': {
		riskLevel: 'read',
		description: "List a directory on a computer's disk",
	},
	'computers.files.read': {
		riskLevel: 'read',
		description: 'Read a file (raw bytes)',
	},
	'computers.files.write': {
		riskLevel: 'write',
		description: 'Write a file (raw body)',
	},
	'computers.get': {
		riskLevel: 'read',
		description: 'Get one computer: OS, state, end user and screen',
	},
	'computers.installApp': {
		riskLevel: 'write',
		description:
			'Runs ``adb install -r`` (with ``-g`` unless ``grantPermissions`` is false) on the phone',
	},
	'computers.list': {
		riskLevel: 'read',
		description: 'List computers, optionally for one end user',
	},
	'computers.screenshot': {
		riskLevel: 'read',
		description: 'Screenshot as image bytes (returned as a file)',
	},
	'computers.sessions.close': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Close the open session (30 s grace before sleep)',
	},
	'computers.sessions.list': {
		riskLevel: 'read',
		description: "List a computer's recent sessions (invocations)",
	},
	'computers.sleep': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Sleep a computer (closes the open session)',
	},
	'computers.tools.call': {
		riskLevel: 'destructive',
		description: 'Run one read-only tool deployed to a computer',
	},
	'computers.tools.list': {
		riskLevel: 'read',
		description:
			"List a computer's tools with their input schemas and the tool server's state",
	},
	'computers.usage': {
		riskLevel: 'read',
		description: 'Invocation usage for a period',
	},
	'computers.wake': {
		riskLevel: 'destructive',
		description: 'Wake a computer (free; opens no session)',
	},
	'deletedAgents.get': {
		riskLevel: 'read',
		description: "One deleted agent's history",
	},
	'deletedAgents.list': {
		riskLevel: 'read',
		description:
			"The caller's deleted agents with this external id, newest first",
	},
	'deployments.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Persist cancellation intent for the worker instead of cancelling a request task',
	},
	'deployments.create': {
		riskLevel: 'destructive',
		description:
			'Queues a deployment after checking agent and uploaded-archive ownership',
	},
	'deployments.get': {
		riskLevel: 'read',
		description: 'Get one deployment with its status and build log',
	},
	'deployments.list': {
		riskLevel: 'read',
		description: "List all deployments for the current user's agents",
	},
	'deployments.listForAgent': {
		riskLevel: 'read',
		description: 'List deployments for a specific agent, including build logs',
	},
	'deployments.uploadZip': {
		riskLevel: 'write',
		description: 'Upload a ZIP file of source code for agent deployment',
	},
	'domains.check': {
		riskLevel: 'read',
		description:
			"Asks the edge for the domain's state now, instead of waiting for the next minute's check",
	},
	'domains.create': {
		riskLevel: 'write',
		description: 'Adds a domain and returns the DNS records to create',
	},
	'domains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Stops serving the domain at once and detaches it from the edge',
	},
	'domains.get': {
		riskLevel: 'read',
		description: 'Get one domain as last checked',
	},
	'domains.labels.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Removes a label',
	},
	'domains.labels.list': {
		riskLevel: 'read',
		description:
			"Lists the names under a wildcard domain, agents' and sandbox ports'",
	},
	'domains.labels.set': {
		riskLevel: 'write',
		description: "Names an agent, or a sandbox's port, ``<label>.<base>``",
	},
	'domains.list': {
		riskLevel: 'read',
		description:
			"Lists the account's domains, optionally only those of one agent",
	},
	'endUsers.activity': {
		riskLevel: 'read',
		description:
			"Get the end user's recent activity, newest first: messages, wakes, sleeps, agent creates",
	},
	'endUsers.agents.create': {
		riskLevel: 'destructive',
		description: "Creates the end user's agent, exactly once",
	},
	'endUsers.agents.list': {
		riskLevel: 'read',
		description: "Get the end user's agents in the full agent shape",
	},
	'endUsers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the end user and every agent it owns, with their data',
	},
	'endUsers.get': {
		riskLevel: 'read',
		description: 'Get one end user with its agents and access rollups',
	},
	'endUsers.list': {
		riskLevel: 'read',
		description:
			"Lists the account's end users one page at a time, newest first unless sorted by activity",
	},
	'endUsers.policy.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Removes the policy',
	},
	'endUsers.policy.get': {
		riskLevel: 'read',
		description: "Get the end user's policy, or null when none is set",
	},
	'endUsers.policy.set': {
		riskLevel: 'write',
		description:
			"Replaces the end user's policy and applies it to every agent it owns now",
	},
	'endUsers.resume': {
		riskLevel: 'write',
		description: 'Makes a suspended end user active again',
	},
	'endUsers.summary': {
		riskLevel: 'read',
		description:
			"Get the account's users now and per UTC day: total, new, active, messages, people using it, and AI spend",
	},
	'endUsers.suspend': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Suspends the end user: its agents go to sleep and refuse wakes and LLM calls',
	},
	'endUsers.tokens.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Mints a short-lived token the end user's own client uses to reach one of its agents",
	},
	'endUsers.tokens.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revokes every live token of the end user',
	},
	'endUsers.upsert': {
		riskLevel: 'write',
		description: 'Creates the end user, or updates the fields sent',
	},
	'feedback.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Send a report to Maritime's founders (docs, SDK, API, CLI ...); 5 a minute, 20 a day",
	},
	'feedback.list': {
		riskLevel: 'read',
		description:
			"Lists the calling account's most recent reports, newest first",
	},
	'fleet.activity': {
		riskLevel: 'read',
		description: 'Per-agent activity over a recent window',
	},
	'fleet.batchCreate': {
		riskLevel: 'destructive',
		description: 'Spin up N identical agents named {prefix}-1..N',
	},
	'fleet.overview': {
		riskLevel: 'read',
		description: 'Summary + the full agent list in one call',
	},
	'fleet.propagate': {
		riskLevel: 'write',
		description:
			"Write one file into many of the caller's agents; optionally restart them",
	},
	'fleet.summary': {
		riskLevel: 'read',
		description: "Get the health and usage summary of the account's agents",
	},
	'health.check': {
		riskLevel: 'read',
		description: 'Check that the Maritime API is up (no key needed)',
	},
	'llmSpendLimit.deleteDefault': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Removes the account default',
	},
	'llmSpendLimit.getDefault': {
		riskLevel: 'read',
		description: 'Get the account default',
	},
	'llmSpendLimit.setDefault': {
		riskLevel: 'write',
		description:
			'Sets the monthly limit for each agent that has no limit of its own',
	},
	'logs.list': {
		riskLevel: 'read',
		description: 'Get log entries across all agents owned by the current user',
	},
	'network.activity': {
		riskLevel: 'read',
		description: 'Lists connections through Maritime Networks, newest first',
	},
	'network.install.get': {
		riskLevel: 'read',
		description: 'Describes an install link for the IT person who runs it',
	},
	'network.install.unixScript': {
		riskLevel: 'read',
		description: 'Get the macOS and Linux install script for an install link',
	},
	'network.install.windowsScript': {
		riskLevel: 'read',
		description: 'Get the Windows install script for an install link',
	},
	'network.presets.create': {
		riskLevel: 'write',
		description: 'Creates an account preset',
	},
	'network.presets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an account preset no workload uses',
	},
	'network.presets.list': {
		riskLevel: 'read',
		description: 'Lists the presets the account may use, built-ins first',
	},
	'network.presets.update': {
		riskLevel: 'write',
		description: 'Changes the given parts of an account preset',
	},
	'network.privateNetworks.addResource': {
		riskLevel: 'write',
		description: 'Adds a resource to a network',
	},
	'network.privateNetworks.create': {
		riskLevel: 'write',
		description: 'Creates a network',
	},
	'network.privateNetworks.createInstall': {
		riskLevel: 'write',
		description: 'Makes a new one-time install link for a network',
	},
	'network.privateNetworks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a network and everything in it',
	},
	'network.privateNetworks.deleteResource': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a resource and every grant to it',
	},
	'network.privateNetworks.list': {
		riskLevel: 'read',
		description: "Lists the account's networks",
	},
	'network.privateNetworks.update': {
		riskLevel: 'write',
		description: 'Renames a network or changes its cut off',
	},
	'network.settings.get': {
		riskLevel: 'read',
		description: 'Get the account-wide network settings',
	},
	'network.settings.update': {
		riskLevel: 'write',
		description: 'Changes the account-wide network settings that were given',
	},
	'network.workloads.get': {
		riskLevel: 'read',
		description: "Get a workload's network settings",
	},
	'network.workloads.newIp': {
		riskLevel: 'write',
		description:
			"Starts a new sticky residential session, so the workload's next connection gets a new IP",
	},
	'network.workloads.test': {
		riskLevel: 'read',
		description:
			'Tries one TCP connection from inside the workload and says what to fix when it fails',
	},
	'network.workloads.update': {
		riskLevel: 'write',
		description:
			'Changes the resources a workload may reach, its internet policy, its exit, or its cut off',
	},
	'notifications.list': {
		riskLevel: 'read',
		description: "List the account's notifications",
	},
	'notifications.markRead': {
		riskLevel: 'write',
		description: 'Mark one notification read',
	},
	'notifications.readAll': {
		riskLevel: 'write',
		description: 'Mark every notification read',
	},
	'notifications.unreadCount': {
		riskLevel: 'read',
		description: 'Count unread notifications',
	},
	'organizations.create': {
		riskLevel: 'write',
		description:
			"Create the caller's organization: their account, shared with the people they invite",
	},
	'organizations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the organization',
	},
	'organizations.invites.accept': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Accept an invite as the signed in person',
	},
	'organizations.invites.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Invite one email',
	},
	'organizations.invites.list': {
		riskLevel: 'read',
		description: "List an organization's open invites",
	},
	'organizations.invites.preview': {
		riskLevel: 'read',
		description: 'Who invited you where',
	},
	'organizations.invites.resend': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Email an organization invite again',
	},
	'organizations.invites.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke an organization invite',
	},
	'organizations.leave': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Leave an organization',
	},
	'organizations.me': {
		riskLevel: 'read',
		description:
			'The person, the organization they act in, the one they own, and the others they belong to',
	},
	'organizations.members.changeRole': {
		riskLevel: 'write',
		description: "Change a member's role in an organization",
	},
	'organizations.members.list': {
		riskLevel: 'read',
		description: "List an organization's members",
	},
	'organizations.members.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a member',
	},
	'organizations.rename': {
		riskLevel: 'write',
		description: 'Rename the organization',
	},
	'plans.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel at period end (Stripe cancel_at_period_end)',
	},
	'plans.launchPromo': {
		riskLevel: 'read',
		description:
			'Public: whether the launch credit ($100 of AI credits for the first paid plans) is still open and how many spots remain',
	},
	'plans.list': {
		riskLevel: 'read',
		description: "The catalog plus this account's plan state",
	},
	'plans.portal': {
		riskLevel: 'destructive',
		description:
			'Stripe Customer Portal session: update the card, browse invoices',
	},
	'plans.subscribe': {
		riskLevel: 'destructive',
		description:
			'Start a plan (returns a Stripe Checkout URL that collects the card), or switch/resume in place when a live subscription exists',
	},
	'preferences.get': {
		riskLevel: 'read',
		description: "Get the signed-in user's preferences",
	},
	'preferences.update': {
		riskLevel: 'write',
		description: "Update the signed-in user's preferences",
	},
	'projects.bindings.list': {
		riskLevel: 'read',
		description: "List a project's bindings of end users to agent instances",
	},
	'projects.bindings.reassign': {
		riskLevel: 'write',
		description: 'Move a binding to another agent instance',
	},
	'projects.bindings.unbind': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a binding from a project',
	},
	'projects.claimCodes.create': {
		riskLevel: 'write',
		description:
			'Create claim codes end users redeem to get their own agent instance',
	},
	'projects.claimCodes.list': {
		riskLevel: 'read',
		description: "List a project's claim codes",
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Get one project (a front door that gives each end user an agent instance)',
	},
	'projects.list': {
		riskLevel: 'read',
		description: "The user's projects with rollups: the primary list surface",
	},
	'projects.messages.get': {
		riskLevel: 'read',
		description: 'Get a message sent to a project and its reply',
	},
	'projects.messages.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Send a message to an end user's agent through a project",
	},
	'projects.syncInstances': {
		riskLevel: 'write',
		description:
			"Push a project's source agent env to every instance and reload them",
	},
	'projects.telegram.connect': {
		riskLevel: 'write',
		description:
			'Point a Telegram bot at this project: validate via getMe, register the webhook, upsert the channel row',
	},
	'projects.telegram.disconnect': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Disconnect a project's Telegram bot",
	},
	'projects.update': {
		riskLevel: 'write',
		description: "Update a project's settings",
	},
	'projects.usage': {
		riskLevel: 'read',
		description:
			"Get what each end user's agent instance cost over the last 30 days",
	},
	'projects.users.get': {
		riskLevel: 'read',
		description: 'Get one end user of a project and their agent',
	},
	'projects.users.list': {
		riskLevel: 'read',
		description:
			"The project's end-user list: every identity bound via the HTTP front door",
	},
	'projects.users.unbind': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Unbind an end-user',
	},
	'sandboxKeys.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Creates a per-sandbox key; the secret is returned only here',
	},
	'sandboxKeys.list': {
		riskLevel: 'read',
		description: 'Lists per-sandbox keys without secrets',
	},
	'sandboxKeys.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Revokes a per-sandbox key and rotates its sandbox's secrets",
	},
	'sandboxWebhooks.create': {
		riskLevel: 'write',
		description:
			'Register an https URL for virtual machine events (the signing secret is returned once)',
	},
	'sandboxWebhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a webhook endpoint',
	},
	'sandboxWebhooks.deliveries': {
		riskLevel: 'read',
		description: "Lists one endpoint's deliveries from the last 30 days",
	},
	'sandboxWebhooks.list': {
		riskLevel: 'read',
		description: 'Lists webhook endpoints without secrets, paged',
	},
	'sandboxes.code.run': {
		riskLevel: 'destructive',
		description:
			'Run python in a persistent kernel on a code-interpreter sandbox',
	},
	'sandboxes.commands.get': {
		riskLevel: 'read',
		description: 'Get a command and its output',
	},
	'sandboxes.commands.history': {
		riskLevel: 'read',
		description:
			'Get ``{ data }`` with recent commands from the host, newest first',
	},
	'sandboxes.commands.kill': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Kill a running command in a virtual machine (SIGTERM, then SIGKILL after 10 s)',
	},
	'sandboxes.commands.run': {
		riskLevel: 'destructive',
		description:
			'Run a command in a virtual machine and get exitCode, stdout and stderr (or a command id with background)',
	},
	'sandboxes.create': {
		riskLevel: 'destructive',
		description:
			'Create a virtual machine (sbx-...) from a snapshot, template or image, or return the live one with the same name; billed per second while running',
	},
	'sandboxes.createScreenViewer': {
		riskLevel: 'write',
		description: 'Get ``{ url }`` of a screen viewer that works for one hour',
	},
	'sandboxes.createUrl': {
		riskLevel: 'write',
		description:
			'Get ``{ url }`` for one port, private with the URL token or public',
	},
	'sandboxes.ephemeral.create': {
		riskLevel: 'destructive',
		description:
			'Create a virtual machine that ends with its disk after idleMinutes without activity or at timeLimitMinutes; billed per second',
	},
	'sandboxes.ephemeral.extend': {
		riskLevel: 'destructive',
		description:
			"Restarts the sandbox's time limit from now: ``timeLimitMinutes`` (or ``lifetimeMinutes``) more",
	},
	'sandboxes.ephemeral.kill': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Ends the sandbox now',
	},
	'sandboxes.ephemeral.list': {
		riskLevel: 'read',
		description:
			'Lists the sandboxes that have not ended, newest first, as ``{ sandboxes, nextCursor }``',
	},
	'sandboxes.files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a file, or a directory with recursive',
	},
	'sandboxes.files.list': {
		riskLevel: 'read',
		description: 'List one directory of a sandbox (not recursive)',
	},
	'sandboxes.files.read': {
		riskLevel: 'read',
		description:
			"Read a file from a virtual machine's disk (returned as a file)",
	},
	'sandboxes.files.write': {
		riskLevel: 'write',
		description: "Create or replace a file on a sandbox's disk",
	},
	'sandboxes.get': {
		riskLevel: 'read',
		description: 'Get one sandbox by id or name',
	},
	'sandboxes.info': {
		riskLevel: 'read',
		description: 'Get Sandbox info read from the host',
	},
	'sandboxes.kill': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'End a virtual machine and delete its disk',
	},
	'sandboxes.list': {
		riskLevel: 'read',
		description:
			"Lists the account's sandboxes, newest first, as ``{ data, nextCursor }``",
	},
	'sandboxes.pause': {
		riskLevel: 'write',
		description: 'Pauses the sandbox and returns it once paused',
	},
	'sandboxes.promote': {
		riskLevel: 'destructive',
		description:
			'Promote a virtual machine to a kept agent box (Maritime answers 501 promote_unavailable in API version 1)',
	},
	'sandboxes.rotateSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Replaces the sandbox secret and URL token and returns the Sandbox object',
	},
	'sandboxes.save': {
		riskLevel: 'write',
		description: 'Saves a snapshot of the sandbox under ``name``',
	},
	'sandboxes.update': {
		riskLevel: 'write',
		description:
			'Changes metadata, the idle timer, keepAwake, or the network policy',
	},
	'sandboxes.usage': {
		riskLevel: 'read',
		description: 'Get what the sandbox uses now, measured by its host',
	},
	'secrets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an account secret',
	},
	'secrets.list': {
		riskLevel: 'read',
		description: 'Lists account secret names, paged',
	},
	'secrets.set': {
		riskLevel: 'write',
		description: 'Creates or replaces an account secret',
	},
	'servers.list': {
		riskLevel: 'read',
		description:
			'The swarm servers, whether each is free, yours or rented by someone else, and your open lease',
	},
	'servers.release': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Release the rented swarm server; billing stops and every virtual machine on it ends',
	},
	'servers.rent': {
		riskLevel: 'destructive',
		description:
			'Rent a whole swarm server for this account ($1 a minute while rented, billed per second)',
	},
	'snapshots.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a saved snapshot',
	},
	'snapshots.get': {
		riskLevel: 'read',
		description: 'Get one saved snapshot or stock template',
	},
	'snapshots.list': {
		riskLevel: 'read',
		description: 'Lists saved snapshots and stock templates',
	},
	'stripe.createPortalSession': {
		riskLevel: 'destructive',
		description: 'Create a Stripe Customer Portal session',
	},
	'stripe.invoices': {
		riskLevel: 'read',
		description:
			'List invoices for the current user, each labeled with its product',
	},
	'stripe.paymentMethods': {
		riskLevel: 'read',
		description: 'List payment methods for the current user',
	},
	'stripe.subscriptions.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a subscription',
	},
	'stripe.subscriptions.list': {
		riskLevel: 'read',
		description: 'List subscriptions for the current user',
	},
	'swarms.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel swarm',
	},
	'swarms.create': {
		riskLevel: 'destructive',
		description:
			'Start a swarm: many virtual machines running one command on a rented swarm server ($1 a minute while rented; Scale plan and up)',
	},
	'swarms.get': {
		riskLevel: 'read',
		description:
			"One run with every sandbox's status, exit code and output tail",
	},
	'swarms.getAccess': {
		riskLevel: 'read',
		description:
			'Whether the account may start swarms, and when it asked for access',
	},
	'swarms.list': {
		riskLevel: 'read',
		description: "The account's runs, newest first, with progress and cost",
	},
	'swarms.requestAccess': {
		riskLevel: 'write',
		description: 'Asks for Swarms',
	},
	'swarms.results': {
		riskLevel: 'read',
		description:
			"Every sandbox's outcome as JSON Lines, one sandbox per line, in input order",
	},
	'templates.create': {
		riskLevel: 'destructive',
		description:
			'Registers a customer template and starts its build (201, usually ``building``)',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a customer template and frees its name',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get one customer or stock template',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			"Lists the account's templates, newest first, then the stock templates, as ``{ data, nextCursor }``",
	},
	'usage.daily': {
		riskLevel: 'read',
		description:
			"The account's cost by day: hosting (the usage ledger on a usage plan, allocated under a seat plan, else debits), LLM, minutes",
	},
	'usage.report': {
		riskLevel: 'read',
		description:
			'Get the usage report for the last 30 days: compute minutes and hosting, LLM and total cost, per agent',
	},
	'usage.sandboxes': {
		riskLevel: 'read',
		description:
			'Lists usage records that overlap ``from`` to ``to``, oldest first',
	},
	'wallet.apiUsage': {
		riskLevel: 'read',
		description:
			'The AI credits of the account: budget, lifetime spend, what is left, and the unexpired welcome credit (``welcomeCredit``, None once spent or lapsed)',
	},
	'wallet.autoRecharge.get': {
		riskLevel: 'read',
		description: "Get the wallet's auto-recharge setting",
	},
	'wallet.autoRecharge.set': {
		riskLevel: 'destructive',
		description:
			'Configure auto-recharge: below thresholdCents, charge the saved card for amountCents (max 3x/24h, 6h backoff after a failed charge)',
	},
	'wallet.balance': {
		riskLevel: 'read',
		description: 'Get current wallet balance',
	},
	'wallet.browserUsage': {
		riskLevel: 'read',
		description: 'Browser session usage + rate for the authenticated user',
	},
	'wallet.checkDeployBalance': {
		riskLevel: 'read',
		description: 'Check if user has sufficient balance to deploy an agent',
	},
	'wallet.claimSignupBonus': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'One-time $10 OpenClaw signup bonus',
	},
	'wallet.paymentMethod': {
		riskLevel: 'read',
		description: 'Saved-card status for the billing page',
	},
	'wallet.planUsage': {
		riskLevel: 'read',
		description:
			"Current plan + this user's aggregate usage against its limits",
	},
	'wallet.purchaseApiCredits': {
		riskLevel: 'destructive',
		description: 'Creates a Stripe Checkout session that buys AI credits',
	},
	'wallet.redeemPromo': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Redeem promo',
	},
	'wallet.topup': {
		riskLevel: 'destructive',
		description:
			'Create a Stripe Checkout session for wallet top-up (one-time payment)',
	},
	'wallet.transactions': {
		riskLevel: 'read',
		description: 'Get wallet transaction history',
	},
	'wallet.validatePromoCode': {
		riskLevel: 'read',
		description: 'Validate promo code',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Subscribe an https URL to agent, message, exec and end-user events (the signing secret is returned once)',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook subscription',
	},
	'webhooks.deliveries.list': {
		riskLevel: 'read',
		description: 'The delivery log of one subscription, newest first',
	},
	'webhooks.deliveries.replay': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Sends one delivery again now, whatever its state, and returns the result',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: "List the account's webhook subscriptions",
	},
	'webhooks.test': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deliver a synthetic `ping` event to the subscription and return the result',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			'Update a webhook subscription: URL, events, or isActive (true re-enables it and resets the failure count)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof maritimeEndpointsNested>;
