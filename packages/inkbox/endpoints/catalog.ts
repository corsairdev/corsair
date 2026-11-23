// Generated with endpoints/operation-types.ts from Inkbox's OpenAPI spec:
// one entry per operation in inkbox-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { inkboxSchemaEntry } from './openapi-schema';
import { createInkboxOperation as op } from './operations';

export const inkboxEndpointsNested = {
	a2a: {
		contactRules: {
			create: op('a2a.contactRules.create'),
			delete: op('a2a.contactRules.delete'),
			list: op('a2a.contactRules.list'),
			listForOrg: op('a2a.contactRules.listForOrg'),
			update: op('a2a.contactRules.update'),
		},
		contexts: {
			get: op('a2a.contexts.get'),
			list: op('a2a.contexts.list'),
			update: op('a2a.contexts.update'),
		},
		invitations: {
			accept: op('a2a.invitations.accept'),
			create: op('a2a.invitations.create'),
			decline: op('a2a.invitations.decline'),
			get: op('a2a.invitations.get'),
			list: op('a2a.invitations.list'),
			preview: op('a2a.invitations.preview'),
			revoke: op('a2a.invitations.revoke'),
		},
		listDirectory: op('a2a.listDirectory'),
		messages: {
			list: op('a2a.messages.list'),
		},
		previewCard: op('a2a.previewCard'),
		sentContexts: {
			get: op('a2a.sentContexts.get'),
			list: op('a2a.sentContexts.list'),
		},
		sentTasks: {
			get: op('a2a.sentTasks.get'),
			list: op('a2a.sentTasks.list'),
		},
		settings: {
			get: op('a2a.settings.get'),
			listForOrg: op('a2a.settings.listForOrg'),
			update: op('a2a.settings.update'),
		},
		tasks: {
			get: op('a2a.tasks.get'),
			list: op('a2a.tasks.list'),
			reply: op('a2a.tasks.reply'),
		},
	},
	account: {
		whoami: op('account.whoami'),
	},
	agentSignup: {
		getStatus: op('agentSignup.getStatus'),
		resendVerification: op('agentSignup.resendVerification'),
		verify: op('agentSignup.verify'),
	},
	apiKeys: {
		create: op('apiKeys.create'),
		getCurrent: op('apiKeys.getCurrent'),
		revokeCurrent: op('apiKeys.revokeCurrent'),
	},
	billing: {
		callingCountries: {
			buy: op('billing.callingCountries.buy'),
			cancel: op('billing.callingCountries.cancel'),
			list: op('billing.callingCountries.list'),
			quote: op('billing.callingCountries.quote'),
			resume: op('billing.callingCountries.resume'),
		},
		changePlan: op('billing.changePlan'),
		createCheckoutSession: op('billing.createCheckoutSession'),
		createPortalSession: op('billing.createPortalSession'),
		getPricing: op('billing.getPricing'),
		getSubscription: op('billing.getSubscription'),
		getUsage: op('billing.getUsage'),
		identityPacks: {
			buy: op('billing.identityPacks.buy'),
			change: op('billing.identityPacks.change'),
			list: op('billing.identityPacks.list'),
			quote: op('billing.identityPacks.quote'),
		},
		lineBundles: {
			buy: op('billing.lineBundles.buy'),
			change: op('billing.lineBundles.change'),
			list: op('billing.lineBundles.list'),
			quote: op('billing.lineBundles.quote'),
		},
		setVoicePacks: op('billing.setVoicePacks'),
		settings: {
			get: op('billing.settings.get'),
			update: op('billing.settings.update'),
		},
		usageAlerts: {
			delete: op('billing.usageAlerts.delete'),
			list: op('billing.usageAlerts.list'),
			save: op('billing.usageAlerts.save'),
		},
	},
	compliance: {
		brand: {
			delete: op('compliance.brand.delete'),
			get: op('compliance.brand.get'),
			register: op('compliance.brand.register'),
			resendTwoFactorEmail: op('compliance.brand.resendTwoFactorEmail'),
			sendSmsOtp: op('compliance.brand.sendSmsOtp'),
			update: op('compliance.brand.update'),
			verifySmsOtp: op('compliance.brand.verifySmsOtp'),
		},
		campaign: {
			delete: op('compliance.campaign.delete'),
			get: op('compliance.campaign.get'),
			getActive: op('compliance.campaign.getActive'),
			register: op('compliance.campaign.register'),
			resubmit: op('compliance.campaign.resubmit'),
			setActive: op('compliance.campaign.setActive'),
			update: op('compliance.campaign.update'),
		},
		uploadOptInEvidence: op('compliance.uploadOptInEvidence'),
	},
	contacts: {
		bulkDelete: op('contacts.bulkDelete'),
		communicationPolicy: {
			get: op('contacts.communicationPolicy.get'),
			preview: op('contacts.communicationPolicy.preview'),
			set: op('contacts.communicationPolicy.set'),
		},
		create: op('contacts.create'),
		createWithPermissions: op('contacts.createWithPermissions'),
		delete: op('contacts.delete'),
		exportVcard: op('contacts.exportVcard'),
		exportVcards: op('contacts.exportVcards'),
		facts: {
			create: op('contacts.facts.create'),
			delete: op('contacts.facts.delete'),
			get: op('contacts.facts.get'),
			list: op('contacts.facts.list'),
			resolveCitation: op('contacts.facts.resolveCitation'),
			update: op('contacts.facts.update'),
		},
		get: op('contacts.get'),
		getCorrespondence: op('contacts.getCorrespondence'),
		import: op('contacts.import'),
		list: op('contacts.list'),
		lookup: op('contacts.lookup'),
		merge: op('contacts.merge'),
		previewImport: op('contacts.previewImport'),
		update: op('contacts.update'),
	},
	domains: {
		create: op('domains.create'),
		delete: op('domains.delete'),
		forceDelete: op('domains.forceDelete'),
		get: op('domains.get'),
		getDnsRecords: op('domains.getDnsRecords'),
		getHealth: op('domains.getHealth'),
		list: op('domains.list'),
		restore: op('domains.restore'),
		rotateDkim: op('domains.rotateDkim'),
		setDefault: op('domains.setDefault'),
		verify: op('domains.verify'),
	},
	hostedChat: {
		answerInteraction: op('hostedChat.answerInteraction'),
		conversations: {
			create: op('hostedChat.conversations.create'),
			get: op('hostedChat.conversations.get'),
			list: op('hostedChat.conversations.list'),
			listMessages: op('hostedChat.conversations.listMessages'),
			rename: op('hostedChat.conversations.rename'),
		},
		files: {
			download: op('hostedChat.files.download'),
			get: op('hostedChat.files.get'),
			upload: op('hostedChat.files.upload'),
		},
		getStatus: op('hostedChat.getStatus'),
		turns: {
			cancel: op('hostedChat.turns.cancel'),
			create: op('hostedChat.turns.create'),
			get: op('hostedChat.turns.get'),
		},
	},
	hostedWorkspace: {
		environment: {
			get: op('hostedWorkspace.environment.get'),
			update: op('hostedWorkspace.environment.update'),
		},
		get: op('hostedWorkspace.get'),
		getOperation: op('hostedWorkspace.getOperation'),
		getUsage: op('hostedWorkspace.getUsage'),
		getUsageHistory: op('hostedWorkspace.getUsageHistory'),
		ports: {
			get: op('hostedWorkspace.ports.get'),
			rotateToken: op('hostedWorkspace.ports.rotateToken'),
			update: op('hostedWorkspace.ports.update'),
		},
		resize: op('hostedWorkspace.resize'),
		runAction: op('hostedWorkspace.runAction'),
		schedules: {
			create: op('hostedWorkspace.schedules.create'),
			delete: op('hostedWorkspace.schedules.delete'),
			list: op('hostedWorkspace.schedules.list'),
			listOccurrences: op('hostedWorkspace.schedules.listOccurrences'),
			preview: op('hostedWorkspace.schedules.preview'),
			update: op('hostedWorkspace.schedules.update'),
		},
		terminals: {
			close: op('hostedWorkspace.terminals.close'),
			create: op('hostedWorkspace.terminals.create'),
			createTicket: op('hostedWorkspace.terminals.createTicket'),
			list: op('hostedWorkspace.terminals.list'),
		},
	},
	hosting: {
		callTool: op('hosting.callTool'),
		deliveries: {
			list: op('hosting.deliveries.list'),
			retry: op('hosting.deliveries.retry'),
		},
		get: op('hosting.get'),
		set: op('hosting.set'),
	},
	identities: {
		avatar: {
			delete: op('identities.avatar.delete'),
			get: op('identities.avatar.get'),
			getMetadata: op('identities.avatar.getMetadata'),
			setFromStagedMedia: op('identities.avatar.setFromStagedMedia'),
			upload: op('identities.avatar.upload'),
		},
		companion: {
			get: op('identities.companion.get'),
			getHistory: op('identities.companion.getHistory'),
			listConversations: op('identities.companion.listConversations'),
			update: op('identities.companion.update'),
		},
		connectImessageNumber: op('identities.connectImessageNumber'),
		contactAccess: {
			get: op('identities.contactAccess.get'),
			update: op('identities.contactAccess.update'),
		},
		contactPermissions: {
			get: op('identities.contactPermissions.get'),
			list: op('identities.contactPermissions.list'),
			update: op('identities.contactPermissions.update'),
		},
		create: op('identities.create'),
		createTunnel: op('identities.createTunnel'),
		delete: op('identities.delete'),
		disconnectImessageNumber: op('identities.disconnectImessageNumber'),
		domainAffiliation: {
			get: op('identities.domainAffiliation.get'),
			remove: op('identities.domainAffiliation.remove'),
			set: op('identities.domainAffiliation.set'),
		},
		get: op('identities.get'),
		getChannelStatus: op('identities.getChannelStatus'),
		getCurrent: op('identities.getCurrent'),
		list: op('identities.list'),
		listContactCommunicationPolicies: op(
			'identities.listContactCommunicationPolicies',
		),
		mailContactRules: {
			create: op('identities.mailContactRules.create'),
			delete: op('identities.mailContactRules.delete'),
			get: op('identities.mailContactRules.get'),
			list: op('identities.mailContactRules.list'),
			update: op('identities.mailContactRules.update'),
		},
		phoneContactRules: {
			create: op('identities.phoneContactRules.create'),
			delete: op('identities.phoneContactRules.delete'),
			get: op('identities.phoneContactRules.get'),
			list: op('identities.phoneContactRules.list'),
			update: op('identities.phoneContactRules.update'),
		},
		releasePhoneNumber: op('identities.releasePhoneNumber'),
		signingKey: {
			createOrRotate: op('identities.signingKey.createOrRotate'),
			getStatus: op('identities.signingKey.getStatus'),
		},
		slackContactRules: {
			create: op('identities.slackContactRules.create'),
			delete: op('identities.slackContactRules.delete'),
			get: op('identities.slackContactRules.get'),
			list: op('identities.slackContactRules.list'),
			update: op('identities.slackContactRules.update'),
		},
		update: op('identities.update'),
	},
	imessage: {
		assignments: {
			list: op('imessage.assignments.list'),
			release: op('imessage.assignments.release'),
		},
		checkCapability: op('imessage.checkCapability'),
		connect: op('imessage.connect'),
		contactRules: {
			create: op('imessage.contactRules.create'),
			delete: op('imessage.contactRules.delete'),
			get: op('imessage.contactRules.get'),
			list: op('imessage.contactRules.list'),
			listForOrg: op('imessage.contactRules.listForOrg'),
			update: op('imessage.contactRules.update'),
		},
		conversations: {
			get: op('imessage.conversations.get'),
			getThread: op('imessage.conversations.getThread'),
			list: op('imessage.conversations.list'),
		},
		disconnect: op('imessage.disconnect'),
		getMediaPlayback: op('imessage.getMediaPlayback'),
		getOnboarding: op('imessage.getOnboarding'),
		getTriageNumber: op('imessage.getTriageNumber'),
		markRead: op('imessage.markRead'),
		messages: {
			get: op('imessage.messages.get'),
			getThread: op('imessage.messages.getThread'),
			list: op('imessage.messages.list'),
			send: op('imessage.messages.send'),
		},
		numbers: {
			claim: op('imessage.numbers.claim'),
			list: op('imessage.numbers.list'),
		},
		reactions: {
			remove: op('imessage.reactions.remove'),
			send: op('imessage.reactions.send'),
		},
		router: {
			get: op('imessage.router.get'),
			getAvatar: op('imessage.router.getAvatar'),
			getConversation: op('imessage.router.getConversation'),
			listConversations: op('imessage.router.listConversations'),
			listMessages: op('imessage.router.listMessages'),
			update: op('imessage.router.update'),
			updateConnectOnboarding: op('imessage.router.updateConnectOnboarding'),
		},
		sendTyping: op('imessage.sendTyping'),
		uploadMedia: op('imessage.uploadMedia'),
	},
	inbound: {
		checkSignature: op('inbound.checkSignature'),
		events: {
			get: op('inbound.events.get'),
			list: op('inbound.events.list'),
			replay: op('inbound.events.replay'),
			reportResult: op('inbound.events.reportResult'),
		},
		sources: {
			create: op('inbound.sources.create'),
			delete: op('inbound.sources.delete'),
			get: op('inbound.sources.get'),
			list: op('inbound.sources.list'),
			rotate: op('inbound.sources.rotate'),
			update: op('inbound.sources.update'),
		},
	},
	mail: {
		drafts: {
			addAttachments: op('mail.drafts.addAttachments'),
			create: op('mail.drafts.create'),
			delete: op('mail.drafts.delete'),
			duplicate: op('mail.drafts.duplicate'),
			get: op('mail.drafts.get'),
			getAttachment: op('mail.drafts.getAttachment'),
			list: op('mail.drafts.list'),
			removeAttachment: op('mail.drafts.removeAttachment'),
			send: op('mail.drafts.send'),
			update: op('mail.drafts.update'),
		},
		imports: {
			cancel: op('mail.imports.cancel'),
			create: op('mail.imports.create'),
			get: op('mail.imports.get'),
			list: op('mail.imports.list'),
			reissueUploadUrl: op('mail.imports.reissueUploadUrl'),
			start: op('mail.imports.start'),
		},
		listOrgContactRules: op('mail.listOrgContactRules'),
		mailboxes: {
			get: op('mail.mailboxes.get'),
			getById: op('mail.mailboxes.getById'),
			list: op('mail.mailboxes.list'),
			update: op('mail.mailboxes.update'),
		},
		messages: {
			delete: op('mail.messages.delete'),
			forward: op('mail.messages.forward'),
			get: op('mail.messages.get'),
			getAttachment: op('mail.messages.getAttachment'),
			list: op('mail.messages.list'),
			replyAll: op('mail.messages.replyAll'),
			search: op('mail.messages.search'),
			send: op('mail.messages.send'),
			updateFlags: op('mail.messages.updateFlags'),
		},
		threads: {
			delete: op('mail.threads.delete'),
			get: op('mail.threads.get'),
			list: op('mail.threads.list'),
			listFolders: op('mail.threads.listFolders'),
			update: op('mail.threads.update'),
		},
		visibleMessages: {
			delete: op('mail.visibleMessages.delete'),
			get: op('mail.visibleMessages.get'),
			getAttachment: op('mail.visibleMessages.getAttachment'),
			list: op('mail.visibleMessages.list'),
			search: op('mail.visibleMessages.search'),
			updateFlags: op('mail.visibleMessages.updateFlags'),
		},
		visibleThreads: {
			delete: op('mail.visibleThreads.delete'),
			get: op('mail.visibleThreads.get'),
			list: op('mail.visibleThreads.list'),
			update: op('mail.visibleThreads.update'),
		},
	},
	messageSends: {
		lookup: op('messageSends.lookup'),
	},
	notes: {
		access: {
			grant: op('notes.access.grant'),
			list: op('notes.access.list'),
			revoke: op('notes.access.revoke'),
		},
		create: op('notes.create'),
		delete: op('notes.delete'),
		get: op('notes.get'),
		list: op('notes.list'),
		update: op('notes.update'),
	},
	organizationDomains: {
		create: op('organizationDomains.create'),
		delete: op('organizationDomains.delete'),
		get: op('organizationDomains.get'),
		list: op('organizationDomains.list'),
		verify: op('organizationDomains.verify'),
	},
	phone: {
		calls: {
			get: op('phone.calls.get'),
			getSettings: op('phone.calls.getSettings'),
			hangup: op('phone.calls.hangup'),
			list: op('phone.calls.list'),
			listMcpActivity: op('phone.calls.listMcpActivity'),
			listToolInvocations: op('phone.calls.listToolInvocations'),
			listTranscripts: op('phone.calls.listTranscripts'),
			place: op('phone.calls.place'),
		},
		incomingCallAction: {
			get: op('phone.incomingCallAction.get'),
			set: op('phone.incomingCallAction.set'),
		},
		listOrgContactRules: op('phone.listOrgContactRules'),
		media: {
			getPlayback: op('phone.media.getPlayback'),
		},
		numbers: {
			get: op('phone.numbers.get'),
			list: op('phone.numbers.list'),
			provision: op('phone.numbers.provision'),
			release: op('phone.numbers.release'),
			searchTranscripts: op('phone.numbers.searchTranscripts'),
			update: op('phone.numbers.update'),
		},
		smsOptIns: {
			get: op('phone.smsOptIns.get'),
			list: op('phone.smsOptIns.list'),
			optIn: op('phone.smsOptIns.optIn'),
			optOut: op('phone.smsOptIns.optOut'),
		},
		textConversations: {
			get: op('phone.textConversations.get'),
			list: op('phone.textConversations.list'),
			update: op('phone.textConversations.update'),
			updateById: op('phone.textConversations.updateById'),
		},
		texts: {
			delete: op('phone.texts.delete'),
			get: op('phone.texts.get'),
			list: op('phone.texts.list'),
			search: op('phone.texts.search'),
			send: op('phone.texts.send'),
			update: op('phone.texts.update'),
		},
	},
	slack: {
		actions: {
			get: op('slack.actions.get'),
			getByKey: op('slack.actions.getByKey'),
		},
		applications: {
			getRemoval: op('slack.applications.getRemoval'),
			prepare: op('slack.applications.prepare'),
			remove: op('slack.applications.remove'),
		},
		archive: {
			backfill: op('slack.archive.backfill'),
			getCoverage: op('slack.archive.getCoverage'),
			getSettings: op('slack.archive.getSettings'),
			listMessages: op('slack.archive.listMessages'),
			purge: op('slack.archive.purge'),
			search: op('slack.archive.search'),
			updateSettings: op('slack.archive.updateSettings'),
		},
		connections: {
			disconnect: op('slack.connections.disconnect'),
			getCapabilities: op('slack.connections.getCapabilities'),
			importContacts: op('slack.connections.importContacts'),
			list: op('slack.connections.list'),
			listAvailable: op('slack.connections.listAvailable'),
		},
		conversations: {
			get: op('slack.conversations.get'),
			join: op('slack.conversations.join'),
			leave: op('slack.conversations.leave'),
			list: op('slack.conversations.list'),
			listMembers: op('slack.conversations.listMembers'),
			open: op('slack.conversations.open'),
			setProcessingStatus: op('slack.conversations.setProcessingStatus'),
		},
		files: {
			download: op('slack.files.download'),
			get: op('slack.files.get'),
			getPreview: op('slack.files.getPreview'),
			upload: op('slack.files.upload'),
		},
		getCachedMedia: op('slack.getCachedMedia'),
		installations: {
			start: op('slack.installations.start'),
		},
		listEmoji: op('slack.listEmoji'),
		listOrgContactRules: op('slack.listOrgContactRules'),
		messages: {
			delete: op('slack.messages.delete'),
			get: op('slack.messages.get'),
			getContext: op('slack.messages.getContext'),
			getPermalink: op('slack.messages.getPermalink'),
			list: op('slack.messages.list'),
			send: op('slack.messages.send'),
			update: op('slack.messages.update'),
		},
		operations: {
			get: op('slack.operations.get'),
			getByKey: op('slack.operations.getByKey'),
		},
		pins: {
			add: op('slack.pins.add'),
			list: op('slack.pins.list'),
			remove: op('slack.pins.remove'),
		},
		provisioningWorkspaces: {
			list: op('slack.provisioningWorkspaces.list'),
			save: op('slack.provisioningWorkspaces.save'),
		},
		reactions: {
			add: op('slack.reactions.add'),
			list: op('slack.reactions.list'),
			remove: op('slack.reactions.remove'),
		},
		search: op('slack.search'),
		streams: {
			append: op('slack.streams.append'),
			start: op('slack.streams.start'),
			stop: op('slack.streams.stop'),
		},
		users: {
			get: op('slack.users.get'),
			list: op('slack.users.list'),
		},
	},
	tunnels: {
		get: op('tunnels.get'),
		list: op('tunnels.list'),
		signCsr: op('tunnels.signCsr'),
		update: op('tunnels.update'),
	},
	vault: {
		getInfo: op('vault.getInfo'),
		getUnlockBundle: op('vault.getUnlockBundle'),
		initialize: op('vault.initialize'),
		keys: {
			list: op('vault.keys.list'),
			updatePrimary: op('vault.keys.updatePrimary'),
		},
		secrets: {
			create: op('vault.secrets.create'),
			get: op('vault.secrets.get'),
			grantAccess: op('vault.secrets.grantAccess'),
			list: op('vault.secrets.list'),
			listAccess: op('vault.secrets.listAccess'),
			revokeAccess: op('vault.secrets.revokeAccess'),
			update: op('vault.secrets.update'),
		},
	},
	voiceAgent: {
		getConfig: op('voiceAgent.getConfig'),
		listVoices: op('voiceAgent.listVoices'),
		mcpServers: {
			cancelAuthorization: op('voiceAgent.mcpServers.cancelAuthorization'),
			create: op('voiceAgent.mcpServers.create'),
			delete: op('voiceAgent.mcpServers.delete'),
			disconnect: op('voiceAgent.mcpServers.disconnect'),
			get: op('voiceAgent.mcpServers.get'),
			getAuthorization: op('voiceAgent.mcpServers.getAuthorization'),
			getCatalog: op('voiceAgent.mcpServers.getCatalog'),
			list: op('voiceAgent.mcpServers.list'),
			refresh: op('voiceAgent.mcpServers.refresh'),
			startAuthorization: op('voiceAgent.mcpServers.startAuthorization'),
			test: op('voiceAgent.mcpServers.test'),
			update: op('voiceAgent.mcpServers.update'),
		},
		setAuthorityMode: op('voiceAgent.setAuthorityMode'),
		setConfig: op('voiceAgent.setConfig'),
	},
	webhooks: {
		deliveries: {
			list: op('webhooks.deliveries.list'),
			replay: op('webhooks.deliveries.replay'),
		},
		getCatalog: op('webhooks.getCatalog'),
		subscriptions: {
			create: op('webhooks.subscriptions.create'),
			delete: op('webhooks.subscriptions.delete'),
			get: op('webhooks.subscriptions.get'),
			list: op('webhooks.subscriptions.list'),
			update: op('webhooks.subscriptions.update'),
		},
	},
	whatsapp: {
		assignments: {
			list: op('whatsapp.assignments.list'),
			release: op('whatsapp.assignments.release'),
		},
		connect: op('whatsapp.connect'),
		conversations: {
			get: op('whatsapp.conversations.get'),
			getThread: op('whatsapp.conversations.getThread'),
			list: op('whatsapp.conversations.list'),
		},
		disconnect: op('whatsapp.disconnect'),
		getLimits: op('whatsapp.getLimits'),
		getOnboarding: op('whatsapp.getOnboarding'),
		getTriageNumber: op('whatsapp.getTriageNumber'),
		markRead: op('whatsapp.markRead'),
		media: {
			get: op('whatsapp.media.get'),
			getPlayback: op('whatsapp.media.getPlayback'),
			upload: op('whatsapp.media.upload'),
		},
		messages: {
			get: op('whatsapp.messages.get'),
			getThread: op('whatsapp.messages.getThread'),
			list: op('whatsapp.messages.list'),
			send: op('whatsapp.messages.send'),
		},
		numbers: {
			assign: op('whatsapp.numbers.assign'),
			list: op('whatsapp.numbers.list'),
		},
		reactions: {
			delete: op('whatsapp.reactions.delete'),
			get: op('whatsapp.reactions.get'),
			send: op('whatsapp.reactions.send'),
		},
		router: {
			get: op('whatsapp.router.get'),
			listConversations: op('whatsapp.router.listConversations'),
			listMessages: op('whatsapp.router.listMessages'),
			update: op('whatsapp.router.update'),
		},
		sendTyping: op('whatsapp.sendTyping'),
	},
} as const;

export const inkboxEndpointSchemas = {
	'a2a.contactRules.create': inkboxSchemaEntry('a2a.contactRules.create'),
	'a2a.contactRules.delete': inkboxSchemaEntry('a2a.contactRules.delete'),
	'a2a.contactRules.list': inkboxSchemaEntry('a2a.contactRules.list'),
	'a2a.contactRules.listForOrg': inkboxSchemaEntry(
		'a2a.contactRules.listForOrg',
	),
	'a2a.contactRules.update': inkboxSchemaEntry('a2a.contactRules.update'),
	'a2a.contexts.get': inkboxSchemaEntry('a2a.contexts.get'),
	'a2a.contexts.list': inkboxSchemaEntry('a2a.contexts.list'),
	'a2a.contexts.update': inkboxSchemaEntry('a2a.contexts.update'),
	'a2a.invitations.accept': inkboxSchemaEntry('a2a.invitations.accept'),
	'a2a.invitations.create': inkboxSchemaEntry('a2a.invitations.create'),
	'a2a.invitations.decline': inkboxSchemaEntry('a2a.invitations.decline'),
	'a2a.invitations.get': inkboxSchemaEntry('a2a.invitations.get'),
	'a2a.invitations.list': inkboxSchemaEntry('a2a.invitations.list'),
	'a2a.invitations.preview': inkboxSchemaEntry('a2a.invitations.preview'),
	'a2a.invitations.revoke': inkboxSchemaEntry('a2a.invitations.revoke'),
	'a2a.listDirectory': inkboxSchemaEntry('a2a.listDirectory'),
	'a2a.messages.list': inkboxSchemaEntry('a2a.messages.list'),
	'a2a.previewCard': inkboxSchemaEntry('a2a.previewCard'),
	'a2a.sentContexts.get': inkboxSchemaEntry('a2a.sentContexts.get'),
	'a2a.sentContexts.list': inkboxSchemaEntry('a2a.sentContexts.list'),
	'a2a.sentTasks.get': inkboxSchemaEntry('a2a.sentTasks.get'),
	'a2a.sentTasks.list': inkboxSchemaEntry('a2a.sentTasks.list'),
	'a2a.settings.get': inkboxSchemaEntry('a2a.settings.get'),
	'a2a.settings.listForOrg': inkboxSchemaEntry('a2a.settings.listForOrg'),
	'a2a.settings.update': inkboxSchemaEntry('a2a.settings.update'),
	'a2a.tasks.get': inkboxSchemaEntry('a2a.tasks.get'),
	'a2a.tasks.list': inkboxSchemaEntry('a2a.tasks.list'),
	'a2a.tasks.reply': inkboxSchemaEntry('a2a.tasks.reply'),
	'account.whoami': inkboxSchemaEntry('account.whoami'),
	'agentSignup.getStatus': inkboxSchemaEntry('agentSignup.getStatus'),
	'agentSignup.resendVerification': inkboxSchemaEntry(
		'agentSignup.resendVerification',
	),
	'agentSignup.verify': inkboxSchemaEntry('agentSignup.verify'),
	'apiKeys.create': inkboxSchemaEntry('apiKeys.create'),
	'apiKeys.getCurrent': inkboxSchemaEntry('apiKeys.getCurrent'),
	'apiKeys.revokeCurrent': inkboxSchemaEntry('apiKeys.revokeCurrent'),
	'billing.callingCountries.buy': inkboxSchemaEntry(
		'billing.callingCountries.buy',
	),
	'billing.callingCountries.cancel': inkboxSchemaEntry(
		'billing.callingCountries.cancel',
	),
	'billing.callingCountries.list': inkboxSchemaEntry(
		'billing.callingCountries.list',
	),
	'billing.callingCountries.quote': inkboxSchemaEntry(
		'billing.callingCountries.quote',
	),
	'billing.callingCountries.resume': inkboxSchemaEntry(
		'billing.callingCountries.resume',
	),
	'billing.changePlan': inkboxSchemaEntry('billing.changePlan'),
	'billing.createCheckoutSession': inkboxSchemaEntry(
		'billing.createCheckoutSession',
	),
	'billing.createPortalSession': inkboxSchemaEntry(
		'billing.createPortalSession',
	),
	'billing.getPricing': inkboxSchemaEntry('billing.getPricing'),
	'billing.getSubscription': inkboxSchemaEntry('billing.getSubscription'),
	'billing.getUsage': inkboxSchemaEntry('billing.getUsage'),
	'billing.identityPacks.buy': inkboxSchemaEntry('billing.identityPacks.buy'),
	'billing.identityPacks.change': inkboxSchemaEntry(
		'billing.identityPacks.change',
	),
	'billing.identityPacks.list': inkboxSchemaEntry('billing.identityPacks.list'),
	'billing.identityPacks.quote': inkboxSchemaEntry(
		'billing.identityPacks.quote',
	),
	'billing.lineBundles.buy': inkboxSchemaEntry('billing.lineBundles.buy'),
	'billing.lineBundles.change': inkboxSchemaEntry('billing.lineBundles.change'),
	'billing.lineBundles.list': inkboxSchemaEntry('billing.lineBundles.list'),
	'billing.lineBundles.quote': inkboxSchemaEntry('billing.lineBundles.quote'),
	'billing.setVoicePacks': inkboxSchemaEntry('billing.setVoicePacks'),
	'billing.settings.get': inkboxSchemaEntry('billing.settings.get'),
	'billing.settings.update': inkboxSchemaEntry('billing.settings.update'),
	'billing.usageAlerts.delete': inkboxSchemaEntry('billing.usageAlerts.delete'),
	'billing.usageAlerts.list': inkboxSchemaEntry('billing.usageAlerts.list'),
	'billing.usageAlerts.save': inkboxSchemaEntry('billing.usageAlerts.save'),
	'compliance.brand.delete': inkboxSchemaEntry('compliance.brand.delete'),
	'compliance.brand.get': inkboxSchemaEntry('compliance.brand.get'),
	'compliance.brand.register': inkboxSchemaEntry('compliance.brand.register'),
	'compliance.brand.resendTwoFactorEmail': inkboxSchemaEntry(
		'compliance.brand.resendTwoFactorEmail',
	),
	'compliance.brand.sendSmsOtp': inkboxSchemaEntry(
		'compliance.brand.sendSmsOtp',
	),
	'compliance.brand.update': inkboxSchemaEntry('compliance.brand.update'),
	'compliance.brand.verifySmsOtp': inkboxSchemaEntry(
		'compliance.brand.verifySmsOtp',
	),
	'compliance.campaign.delete': inkboxSchemaEntry('compliance.campaign.delete'),
	'compliance.campaign.get': inkboxSchemaEntry('compliance.campaign.get'),
	'compliance.campaign.getActive': inkboxSchemaEntry(
		'compliance.campaign.getActive',
	),
	'compliance.campaign.register': inkboxSchemaEntry(
		'compliance.campaign.register',
	),
	'compliance.campaign.resubmit': inkboxSchemaEntry(
		'compliance.campaign.resubmit',
	),
	'compliance.campaign.setActive': inkboxSchemaEntry(
		'compliance.campaign.setActive',
	),
	'compliance.campaign.update': inkboxSchemaEntry('compliance.campaign.update'),
	'compliance.uploadOptInEvidence': inkboxSchemaEntry(
		'compliance.uploadOptInEvidence',
	),
	'contacts.bulkDelete': inkboxSchemaEntry('contacts.bulkDelete'),
	'contacts.communicationPolicy.get': inkboxSchemaEntry(
		'contacts.communicationPolicy.get',
	),
	'contacts.communicationPolicy.preview': inkboxSchemaEntry(
		'contacts.communicationPolicy.preview',
	),
	'contacts.communicationPolicy.set': inkboxSchemaEntry(
		'contacts.communicationPolicy.set',
	),
	'contacts.create': inkboxSchemaEntry('contacts.create'),
	'contacts.createWithPermissions': inkboxSchemaEntry(
		'contacts.createWithPermissions',
	),
	'contacts.delete': inkboxSchemaEntry('contacts.delete'),
	'contacts.exportVcard': inkboxSchemaEntry('contacts.exportVcard'),
	'contacts.exportVcards': inkboxSchemaEntry('contacts.exportVcards'),
	'contacts.facts.create': inkboxSchemaEntry('contacts.facts.create'),
	'contacts.facts.delete': inkboxSchemaEntry('contacts.facts.delete'),
	'contacts.facts.get': inkboxSchemaEntry('contacts.facts.get'),
	'contacts.facts.list': inkboxSchemaEntry('contacts.facts.list'),
	'contacts.facts.resolveCitation': inkboxSchemaEntry(
		'contacts.facts.resolveCitation',
	),
	'contacts.facts.update': inkboxSchemaEntry('contacts.facts.update'),
	'contacts.get': inkboxSchemaEntry('contacts.get'),
	'contacts.getCorrespondence': inkboxSchemaEntry('contacts.getCorrespondence'),
	'contacts.import': inkboxSchemaEntry('contacts.import'),
	'contacts.list': inkboxSchemaEntry('contacts.list'),
	'contacts.lookup': inkboxSchemaEntry('contacts.lookup'),
	'contacts.merge': inkboxSchemaEntry('contacts.merge'),
	'contacts.previewImport': inkboxSchemaEntry('contacts.previewImport'),
	'contacts.update': inkboxSchemaEntry('contacts.update'),
	'domains.create': inkboxSchemaEntry('domains.create'),
	'domains.delete': inkboxSchemaEntry('domains.delete'),
	'domains.forceDelete': inkboxSchemaEntry('domains.forceDelete'),
	'domains.get': inkboxSchemaEntry('domains.get'),
	'domains.getDnsRecords': inkboxSchemaEntry('domains.getDnsRecords'),
	'domains.getHealth': inkboxSchemaEntry('domains.getHealth'),
	'domains.list': inkboxSchemaEntry('domains.list'),
	'domains.restore': inkboxSchemaEntry('domains.restore'),
	'domains.rotateDkim': inkboxSchemaEntry('domains.rotateDkim'),
	'domains.setDefault': inkboxSchemaEntry('domains.setDefault'),
	'domains.verify': inkboxSchemaEntry('domains.verify'),
	'hostedChat.answerInteraction': inkboxSchemaEntry(
		'hostedChat.answerInteraction',
	),
	'hostedChat.conversations.create': inkboxSchemaEntry(
		'hostedChat.conversations.create',
	),
	'hostedChat.conversations.get': inkboxSchemaEntry(
		'hostedChat.conversations.get',
	),
	'hostedChat.conversations.list': inkboxSchemaEntry(
		'hostedChat.conversations.list',
	),
	'hostedChat.conversations.listMessages': inkboxSchemaEntry(
		'hostedChat.conversations.listMessages',
	),
	'hostedChat.conversations.rename': inkboxSchemaEntry(
		'hostedChat.conversations.rename',
	),
	'hostedChat.files.download': inkboxSchemaEntry('hostedChat.files.download'),
	'hostedChat.files.get': inkboxSchemaEntry('hostedChat.files.get'),
	'hostedChat.files.upload': inkboxSchemaEntry('hostedChat.files.upload'),
	'hostedChat.getStatus': inkboxSchemaEntry('hostedChat.getStatus'),
	'hostedChat.turns.cancel': inkboxSchemaEntry('hostedChat.turns.cancel'),
	'hostedChat.turns.create': inkboxSchemaEntry('hostedChat.turns.create'),
	'hostedChat.turns.get': inkboxSchemaEntry('hostedChat.turns.get'),
	'hostedWorkspace.environment.get': inkboxSchemaEntry(
		'hostedWorkspace.environment.get',
	),
	'hostedWorkspace.environment.update': inkboxSchemaEntry(
		'hostedWorkspace.environment.update',
	),
	'hostedWorkspace.get': inkboxSchemaEntry('hostedWorkspace.get'),
	'hostedWorkspace.getOperation': inkboxSchemaEntry(
		'hostedWorkspace.getOperation',
	),
	'hostedWorkspace.getUsage': inkboxSchemaEntry('hostedWorkspace.getUsage'),
	'hostedWorkspace.getUsageHistory': inkboxSchemaEntry(
		'hostedWorkspace.getUsageHistory',
	),
	'hostedWorkspace.ports.get': inkboxSchemaEntry('hostedWorkspace.ports.get'),
	'hostedWorkspace.ports.rotateToken': inkboxSchemaEntry(
		'hostedWorkspace.ports.rotateToken',
	),
	'hostedWorkspace.ports.update': inkboxSchemaEntry(
		'hostedWorkspace.ports.update',
	),
	'hostedWorkspace.resize': inkboxSchemaEntry('hostedWorkspace.resize'),
	'hostedWorkspace.runAction': inkboxSchemaEntry('hostedWorkspace.runAction'),
	'hostedWorkspace.schedules.create': inkboxSchemaEntry(
		'hostedWorkspace.schedules.create',
	),
	'hostedWorkspace.schedules.delete': inkboxSchemaEntry(
		'hostedWorkspace.schedules.delete',
	),
	'hostedWorkspace.schedules.list': inkboxSchemaEntry(
		'hostedWorkspace.schedules.list',
	),
	'hostedWorkspace.schedules.listOccurrences': inkboxSchemaEntry(
		'hostedWorkspace.schedules.listOccurrences',
	),
	'hostedWorkspace.schedules.preview': inkboxSchemaEntry(
		'hostedWorkspace.schedules.preview',
	),
	'hostedWorkspace.schedules.update': inkboxSchemaEntry(
		'hostedWorkspace.schedules.update',
	),
	'hostedWorkspace.terminals.close': inkboxSchemaEntry(
		'hostedWorkspace.terminals.close',
	),
	'hostedWorkspace.terminals.create': inkboxSchemaEntry(
		'hostedWorkspace.terminals.create',
	),
	'hostedWorkspace.terminals.createTicket': inkboxSchemaEntry(
		'hostedWorkspace.terminals.createTicket',
	),
	'hostedWorkspace.terminals.list': inkboxSchemaEntry(
		'hostedWorkspace.terminals.list',
	),
	'hosting.callTool': inkboxSchemaEntry('hosting.callTool'),
	'hosting.deliveries.list': inkboxSchemaEntry('hosting.deliveries.list'),
	'hosting.deliveries.retry': inkboxSchemaEntry('hosting.deliveries.retry'),
	'hosting.get': inkboxSchemaEntry('hosting.get'),
	'hosting.set': inkboxSchemaEntry('hosting.set'),
	'identities.avatar.delete': inkboxSchemaEntry('identities.avatar.delete'),
	'identities.avatar.get': inkboxSchemaEntry('identities.avatar.get'),
	'identities.avatar.getMetadata': inkboxSchemaEntry(
		'identities.avatar.getMetadata',
	),
	'identities.avatar.setFromStagedMedia': inkboxSchemaEntry(
		'identities.avatar.setFromStagedMedia',
	),
	'identities.avatar.upload': inkboxSchemaEntry('identities.avatar.upload'),
	'identities.companion.get': inkboxSchemaEntry('identities.companion.get'),
	'identities.companion.getHistory': inkboxSchemaEntry(
		'identities.companion.getHistory',
	),
	'identities.companion.listConversations': inkboxSchemaEntry(
		'identities.companion.listConversations',
	),
	'identities.companion.update': inkboxSchemaEntry(
		'identities.companion.update',
	),
	'identities.connectImessageNumber': inkboxSchemaEntry(
		'identities.connectImessageNumber',
	),
	'identities.contactAccess.get': inkboxSchemaEntry(
		'identities.contactAccess.get',
	),
	'identities.contactAccess.update': inkboxSchemaEntry(
		'identities.contactAccess.update',
	),
	'identities.contactPermissions.get': inkboxSchemaEntry(
		'identities.contactPermissions.get',
	),
	'identities.contactPermissions.list': inkboxSchemaEntry(
		'identities.contactPermissions.list',
	),
	'identities.contactPermissions.update': inkboxSchemaEntry(
		'identities.contactPermissions.update',
	),
	'identities.create': inkboxSchemaEntry('identities.create'),
	'identities.createTunnel': inkboxSchemaEntry('identities.createTunnel'),
	'identities.delete': inkboxSchemaEntry('identities.delete'),
	'identities.disconnectImessageNumber': inkboxSchemaEntry(
		'identities.disconnectImessageNumber',
	),
	'identities.domainAffiliation.get': inkboxSchemaEntry(
		'identities.domainAffiliation.get',
	),
	'identities.domainAffiliation.remove': inkboxSchemaEntry(
		'identities.domainAffiliation.remove',
	),
	'identities.domainAffiliation.set': inkboxSchemaEntry(
		'identities.domainAffiliation.set',
	),
	'identities.get': inkboxSchemaEntry('identities.get'),
	'identities.getChannelStatus': inkboxSchemaEntry(
		'identities.getChannelStatus',
	),
	'identities.getCurrent': inkboxSchemaEntry('identities.getCurrent'),
	'identities.list': inkboxSchemaEntry('identities.list'),
	'identities.listContactCommunicationPolicies': inkboxSchemaEntry(
		'identities.listContactCommunicationPolicies',
	),
	'identities.mailContactRules.create': inkboxSchemaEntry(
		'identities.mailContactRules.create',
	),
	'identities.mailContactRules.delete': inkboxSchemaEntry(
		'identities.mailContactRules.delete',
	),
	'identities.mailContactRules.get': inkboxSchemaEntry(
		'identities.mailContactRules.get',
	),
	'identities.mailContactRules.list': inkboxSchemaEntry(
		'identities.mailContactRules.list',
	),
	'identities.mailContactRules.update': inkboxSchemaEntry(
		'identities.mailContactRules.update',
	),
	'identities.phoneContactRules.create': inkboxSchemaEntry(
		'identities.phoneContactRules.create',
	),
	'identities.phoneContactRules.delete': inkboxSchemaEntry(
		'identities.phoneContactRules.delete',
	),
	'identities.phoneContactRules.get': inkboxSchemaEntry(
		'identities.phoneContactRules.get',
	),
	'identities.phoneContactRules.list': inkboxSchemaEntry(
		'identities.phoneContactRules.list',
	),
	'identities.phoneContactRules.update': inkboxSchemaEntry(
		'identities.phoneContactRules.update',
	),
	'identities.releasePhoneNumber': inkboxSchemaEntry(
		'identities.releasePhoneNumber',
	),
	'identities.signingKey.createOrRotate': inkboxSchemaEntry(
		'identities.signingKey.createOrRotate',
	),
	'identities.signingKey.getStatus': inkboxSchemaEntry(
		'identities.signingKey.getStatus',
	),
	'identities.slackContactRules.create': inkboxSchemaEntry(
		'identities.slackContactRules.create',
	),
	'identities.slackContactRules.delete': inkboxSchemaEntry(
		'identities.slackContactRules.delete',
	),
	'identities.slackContactRules.get': inkboxSchemaEntry(
		'identities.slackContactRules.get',
	),
	'identities.slackContactRules.list': inkboxSchemaEntry(
		'identities.slackContactRules.list',
	),
	'identities.slackContactRules.update': inkboxSchemaEntry(
		'identities.slackContactRules.update',
	),
	'identities.update': inkboxSchemaEntry('identities.update'),
	'imessage.assignments.list': inkboxSchemaEntry('imessage.assignments.list'),
	'imessage.assignments.release': inkboxSchemaEntry(
		'imessage.assignments.release',
	),
	'imessage.checkCapability': inkboxSchemaEntry('imessage.checkCapability'),
	'imessage.connect': inkboxSchemaEntry('imessage.connect'),
	'imessage.contactRules.create': inkboxSchemaEntry(
		'imessage.contactRules.create',
	),
	'imessage.contactRules.delete': inkboxSchemaEntry(
		'imessage.contactRules.delete',
	),
	'imessage.contactRules.get': inkboxSchemaEntry('imessage.contactRules.get'),
	'imessage.contactRules.list': inkboxSchemaEntry('imessage.contactRules.list'),
	'imessage.contactRules.listForOrg': inkboxSchemaEntry(
		'imessage.contactRules.listForOrg',
	),
	'imessage.contactRules.update': inkboxSchemaEntry(
		'imessage.contactRules.update',
	),
	'imessage.conversations.get': inkboxSchemaEntry('imessage.conversations.get'),
	'imessage.conversations.getThread': inkboxSchemaEntry(
		'imessage.conversations.getThread',
	),
	'imessage.conversations.list': inkboxSchemaEntry(
		'imessage.conversations.list',
	),
	'imessage.disconnect': inkboxSchemaEntry('imessage.disconnect'),
	'imessage.getMediaPlayback': inkboxSchemaEntry('imessage.getMediaPlayback'),
	'imessage.getOnboarding': inkboxSchemaEntry('imessage.getOnboarding'),
	'imessage.getTriageNumber': inkboxSchemaEntry('imessage.getTriageNumber'),
	'imessage.markRead': inkboxSchemaEntry('imessage.markRead'),
	'imessage.messages.get': inkboxSchemaEntry('imessage.messages.get'),
	'imessage.messages.getThread': inkboxSchemaEntry(
		'imessage.messages.getThread',
	),
	'imessage.messages.list': inkboxSchemaEntry('imessage.messages.list'),
	'imessage.messages.send': inkboxSchemaEntry('imessage.messages.send'),
	'imessage.numbers.claim': inkboxSchemaEntry('imessage.numbers.claim'),
	'imessage.numbers.list': inkboxSchemaEntry('imessage.numbers.list'),
	'imessage.reactions.remove': inkboxSchemaEntry('imessage.reactions.remove'),
	'imessage.reactions.send': inkboxSchemaEntry('imessage.reactions.send'),
	'imessage.router.get': inkboxSchemaEntry('imessage.router.get'),
	'imessage.router.getAvatar': inkboxSchemaEntry('imessage.router.getAvatar'),
	'imessage.router.getConversation': inkboxSchemaEntry(
		'imessage.router.getConversation',
	),
	'imessage.router.listConversations': inkboxSchemaEntry(
		'imessage.router.listConversations',
	),
	'imessage.router.listMessages': inkboxSchemaEntry(
		'imessage.router.listMessages',
	),
	'imessage.router.update': inkboxSchemaEntry('imessage.router.update'),
	'imessage.router.updateConnectOnboarding': inkboxSchemaEntry(
		'imessage.router.updateConnectOnboarding',
	),
	'imessage.sendTyping': inkboxSchemaEntry('imessage.sendTyping'),
	'imessage.uploadMedia': inkboxSchemaEntry('imessage.uploadMedia'),
	'inbound.checkSignature': inkboxSchemaEntry('inbound.checkSignature'),
	'inbound.events.get': inkboxSchemaEntry('inbound.events.get'),
	'inbound.events.list': inkboxSchemaEntry('inbound.events.list'),
	'inbound.events.replay': inkboxSchemaEntry('inbound.events.replay'),
	'inbound.events.reportResult': inkboxSchemaEntry(
		'inbound.events.reportResult',
	),
	'inbound.sources.create': inkboxSchemaEntry('inbound.sources.create'),
	'inbound.sources.delete': inkboxSchemaEntry('inbound.sources.delete'),
	'inbound.sources.get': inkboxSchemaEntry('inbound.sources.get'),
	'inbound.sources.list': inkboxSchemaEntry('inbound.sources.list'),
	'inbound.sources.rotate': inkboxSchemaEntry('inbound.sources.rotate'),
	'inbound.sources.update': inkboxSchemaEntry('inbound.sources.update'),
	'mail.drafts.addAttachments': inkboxSchemaEntry('mail.drafts.addAttachments'),
	'mail.drafts.create': inkboxSchemaEntry('mail.drafts.create'),
	'mail.drafts.delete': inkboxSchemaEntry('mail.drafts.delete'),
	'mail.drafts.duplicate': inkboxSchemaEntry('mail.drafts.duplicate'),
	'mail.drafts.get': inkboxSchemaEntry('mail.drafts.get'),
	'mail.drafts.getAttachment': inkboxSchemaEntry('mail.drafts.getAttachment'),
	'mail.drafts.list': inkboxSchemaEntry('mail.drafts.list'),
	'mail.drafts.removeAttachment': inkboxSchemaEntry(
		'mail.drafts.removeAttachment',
	),
	'mail.drafts.send': inkboxSchemaEntry('mail.drafts.send'),
	'mail.drafts.update': inkboxSchemaEntry('mail.drafts.update'),
	'mail.imports.cancel': inkboxSchemaEntry('mail.imports.cancel'),
	'mail.imports.create': inkboxSchemaEntry('mail.imports.create'),
	'mail.imports.get': inkboxSchemaEntry('mail.imports.get'),
	'mail.imports.list': inkboxSchemaEntry('mail.imports.list'),
	'mail.imports.reissueUploadUrl': inkboxSchemaEntry(
		'mail.imports.reissueUploadUrl',
	),
	'mail.imports.start': inkboxSchemaEntry('mail.imports.start'),
	'mail.listOrgContactRules': inkboxSchemaEntry('mail.listOrgContactRules'),
	'mail.mailboxes.get': inkboxSchemaEntry('mail.mailboxes.get'),
	'mail.mailboxes.getById': inkboxSchemaEntry('mail.mailboxes.getById'),
	'mail.mailboxes.list': inkboxSchemaEntry('mail.mailboxes.list'),
	'mail.mailboxes.update': inkboxSchemaEntry('mail.mailboxes.update'),
	'mail.messages.delete': inkboxSchemaEntry('mail.messages.delete'),
	'mail.messages.forward': inkboxSchemaEntry('mail.messages.forward'),
	'mail.messages.get': inkboxSchemaEntry('mail.messages.get'),
	'mail.messages.getAttachment': inkboxSchemaEntry(
		'mail.messages.getAttachment',
	),
	'mail.messages.list': inkboxSchemaEntry('mail.messages.list'),
	'mail.messages.replyAll': inkboxSchemaEntry('mail.messages.replyAll'),
	'mail.messages.search': inkboxSchemaEntry('mail.messages.search'),
	'mail.messages.send': inkboxSchemaEntry('mail.messages.send'),
	'mail.messages.updateFlags': inkboxSchemaEntry('mail.messages.updateFlags'),
	'mail.threads.delete': inkboxSchemaEntry('mail.threads.delete'),
	'mail.threads.get': inkboxSchemaEntry('mail.threads.get'),
	'mail.threads.list': inkboxSchemaEntry('mail.threads.list'),
	'mail.threads.listFolders': inkboxSchemaEntry('mail.threads.listFolders'),
	'mail.threads.update': inkboxSchemaEntry('mail.threads.update'),
	'mail.visibleMessages.delete': inkboxSchemaEntry(
		'mail.visibleMessages.delete',
	),
	'mail.visibleMessages.get': inkboxSchemaEntry('mail.visibleMessages.get'),
	'mail.visibleMessages.getAttachment': inkboxSchemaEntry(
		'mail.visibleMessages.getAttachment',
	),
	'mail.visibleMessages.list': inkboxSchemaEntry('mail.visibleMessages.list'),
	'mail.visibleMessages.search': inkboxSchemaEntry(
		'mail.visibleMessages.search',
	),
	'mail.visibleMessages.updateFlags': inkboxSchemaEntry(
		'mail.visibleMessages.updateFlags',
	),
	'mail.visibleThreads.delete': inkboxSchemaEntry('mail.visibleThreads.delete'),
	'mail.visibleThreads.get': inkboxSchemaEntry('mail.visibleThreads.get'),
	'mail.visibleThreads.list': inkboxSchemaEntry('mail.visibleThreads.list'),
	'mail.visibleThreads.update': inkboxSchemaEntry('mail.visibleThreads.update'),
	'messageSends.lookup': inkboxSchemaEntry('messageSends.lookup'),
	'notes.access.grant': inkboxSchemaEntry('notes.access.grant'),
	'notes.access.list': inkboxSchemaEntry('notes.access.list'),
	'notes.access.revoke': inkboxSchemaEntry('notes.access.revoke'),
	'notes.create': inkboxSchemaEntry('notes.create'),
	'notes.delete': inkboxSchemaEntry('notes.delete'),
	'notes.get': inkboxSchemaEntry('notes.get'),
	'notes.list': inkboxSchemaEntry('notes.list'),
	'notes.update': inkboxSchemaEntry('notes.update'),
	'organizationDomains.create': inkboxSchemaEntry('organizationDomains.create'),
	'organizationDomains.delete': inkboxSchemaEntry('organizationDomains.delete'),
	'organizationDomains.get': inkboxSchemaEntry('organizationDomains.get'),
	'organizationDomains.list': inkboxSchemaEntry('organizationDomains.list'),
	'organizationDomains.verify': inkboxSchemaEntry('organizationDomains.verify'),
	'phone.calls.get': inkboxSchemaEntry('phone.calls.get'),
	'phone.calls.getSettings': inkboxSchemaEntry('phone.calls.getSettings'),
	'phone.calls.hangup': inkboxSchemaEntry('phone.calls.hangup'),
	'phone.calls.list': inkboxSchemaEntry('phone.calls.list'),
	'phone.calls.listMcpActivity': inkboxSchemaEntry(
		'phone.calls.listMcpActivity',
	),
	'phone.calls.listToolInvocations': inkboxSchemaEntry(
		'phone.calls.listToolInvocations',
	),
	'phone.calls.listTranscripts': inkboxSchemaEntry(
		'phone.calls.listTranscripts',
	),
	'phone.calls.place': inkboxSchemaEntry('phone.calls.place'),
	'phone.incomingCallAction.get': inkboxSchemaEntry(
		'phone.incomingCallAction.get',
	),
	'phone.incomingCallAction.set': inkboxSchemaEntry(
		'phone.incomingCallAction.set',
	),
	'phone.listOrgContactRules': inkboxSchemaEntry('phone.listOrgContactRules'),
	'phone.media.getPlayback': inkboxSchemaEntry('phone.media.getPlayback'),
	'phone.numbers.get': inkboxSchemaEntry('phone.numbers.get'),
	'phone.numbers.list': inkboxSchemaEntry('phone.numbers.list'),
	'phone.numbers.provision': inkboxSchemaEntry('phone.numbers.provision'),
	'phone.numbers.release': inkboxSchemaEntry('phone.numbers.release'),
	'phone.numbers.searchTranscripts': inkboxSchemaEntry(
		'phone.numbers.searchTranscripts',
	),
	'phone.numbers.update': inkboxSchemaEntry('phone.numbers.update'),
	'phone.smsOptIns.get': inkboxSchemaEntry('phone.smsOptIns.get'),
	'phone.smsOptIns.list': inkboxSchemaEntry('phone.smsOptIns.list'),
	'phone.smsOptIns.optIn': inkboxSchemaEntry('phone.smsOptIns.optIn'),
	'phone.smsOptIns.optOut': inkboxSchemaEntry('phone.smsOptIns.optOut'),
	'phone.textConversations.get': inkboxSchemaEntry(
		'phone.textConversations.get',
	),
	'phone.textConversations.list': inkboxSchemaEntry(
		'phone.textConversations.list',
	),
	'phone.textConversations.update': inkboxSchemaEntry(
		'phone.textConversations.update',
	),
	'phone.textConversations.updateById': inkboxSchemaEntry(
		'phone.textConversations.updateById',
	),
	'phone.texts.delete': inkboxSchemaEntry('phone.texts.delete'),
	'phone.texts.get': inkboxSchemaEntry('phone.texts.get'),
	'phone.texts.list': inkboxSchemaEntry('phone.texts.list'),
	'phone.texts.search': inkboxSchemaEntry('phone.texts.search'),
	'phone.texts.send': inkboxSchemaEntry('phone.texts.send'),
	'phone.texts.update': inkboxSchemaEntry('phone.texts.update'),
	'slack.actions.get': inkboxSchemaEntry('slack.actions.get'),
	'slack.actions.getByKey': inkboxSchemaEntry('slack.actions.getByKey'),
	'slack.applications.getRemoval': inkboxSchemaEntry(
		'slack.applications.getRemoval',
	),
	'slack.applications.prepare': inkboxSchemaEntry('slack.applications.prepare'),
	'slack.applications.remove': inkboxSchemaEntry('slack.applications.remove'),
	'slack.archive.backfill': inkboxSchemaEntry('slack.archive.backfill'),
	'slack.archive.getCoverage': inkboxSchemaEntry('slack.archive.getCoverage'),
	'slack.archive.getSettings': inkboxSchemaEntry('slack.archive.getSettings'),
	'slack.archive.listMessages': inkboxSchemaEntry('slack.archive.listMessages'),
	'slack.archive.purge': inkboxSchemaEntry('slack.archive.purge'),
	'slack.archive.search': inkboxSchemaEntry('slack.archive.search'),
	'slack.archive.updateSettings': inkboxSchemaEntry(
		'slack.archive.updateSettings',
	),
	'slack.connections.disconnect': inkboxSchemaEntry(
		'slack.connections.disconnect',
	),
	'slack.connections.getCapabilities': inkboxSchemaEntry(
		'slack.connections.getCapabilities',
	),
	'slack.connections.importContacts': inkboxSchemaEntry(
		'slack.connections.importContacts',
	),
	'slack.connections.list': inkboxSchemaEntry('slack.connections.list'),
	'slack.connections.listAvailable': inkboxSchemaEntry(
		'slack.connections.listAvailable',
	),
	'slack.conversations.get': inkboxSchemaEntry('slack.conversations.get'),
	'slack.conversations.join': inkboxSchemaEntry('slack.conversations.join'),
	'slack.conversations.leave': inkboxSchemaEntry('slack.conversations.leave'),
	'slack.conversations.list': inkboxSchemaEntry('slack.conversations.list'),
	'slack.conversations.listMembers': inkboxSchemaEntry(
		'slack.conversations.listMembers',
	),
	'slack.conversations.open': inkboxSchemaEntry('slack.conversations.open'),
	'slack.conversations.setProcessingStatus': inkboxSchemaEntry(
		'slack.conversations.setProcessingStatus',
	),
	'slack.files.download': inkboxSchemaEntry('slack.files.download'),
	'slack.files.get': inkboxSchemaEntry('slack.files.get'),
	'slack.files.getPreview': inkboxSchemaEntry('slack.files.getPreview'),
	'slack.files.upload': inkboxSchemaEntry('slack.files.upload'),
	'slack.getCachedMedia': inkboxSchemaEntry('slack.getCachedMedia'),
	'slack.installations.start': inkboxSchemaEntry('slack.installations.start'),
	'slack.listEmoji': inkboxSchemaEntry('slack.listEmoji'),
	'slack.listOrgContactRules': inkboxSchemaEntry('slack.listOrgContactRules'),
	'slack.messages.delete': inkboxSchemaEntry('slack.messages.delete'),
	'slack.messages.get': inkboxSchemaEntry('slack.messages.get'),
	'slack.messages.getContext': inkboxSchemaEntry('slack.messages.getContext'),
	'slack.messages.getPermalink': inkboxSchemaEntry(
		'slack.messages.getPermalink',
	),
	'slack.messages.list': inkboxSchemaEntry('slack.messages.list'),
	'slack.messages.send': inkboxSchemaEntry('slack.messages.send'),
	'slack.messages.update': inkboxSchemaEntry('slack.messages.update'),
	'slack.operations.get': inkboxSchemaEntry('slack.operations.get'),
	'slack.operations.getByKey': inkboxSchemaEntry('slack.operations.getByKey'),
	'slack.pins.add': inkboxSchemaEntry('slack.pins.add'),
	'slack.pins.list': inkboxSchemaEntry('slack.pins.list'),
	'slack.pins.remove': inkboxSchemaEntry('slack.pins.remove'),
	'slack.provisioningWorkspaces.list': inkboxSchemaEntry(
		'slack.provisioningWorkspaces.list',
	),
	'slack.provisioningWorkspaces.save': inkboxSchemaEntry(
		'slack.provisioningWorkspaces.save',
	),
	'slack.reactions.add': inkboxSchemaEntry('slack.reactions.add'),
	'slack.reactions.list': inkboxSchemaEntry('slack.reactions.list'),
	'slack.reactions.remove': inkboxSchemaEntry('slack.reactions.remove'),
	'slack.search': inkboxSchemaEntry('slack.search'),
	'slack.streams.append': inkboxSchemaEntry('slack.streams.append'),
	'slack.streams.start': inkboxSchemaEntry('slack.streams.start'),
	'slack.streams.stop': inkboxSchemaEntry('slack.streams.stop'),
	'slack.users.get': inkboxSchemaEntry('slack.users.get'),
	'slack.users.list': inkboxSchemaEntry('slack.users.list'),
	'tunnels.get': inkboxSchemaEntry('tunnels.get'),
	'tunnels.list': inkboxSchemaEntry('tunnels.list'),
	'tunnels.signCsr': inkboxSchemaEntry('tunnels.signCsr'),
	'tunnels.update': inkboxSchemaEntry('tunnels.update'),
	'vault.getInfo': inkboxSchemaEntry('vault.getInfo'),
	'vault.getUnlockBundle': inkboxSchemaEntry('vault.getUnlockBundle'),
	'vault.initialize': inkboxSchemaEntry('vault.initialize'),
	'vault.keys.list': inkboxSchemaEntry('vault.keys.list'),
	'vault.keys.updatePrimary': inkboxSchemaEntry('vault.keys.updatePrimary'),
	'vault.secrets.create': inkboxSchemaEntry('vault.secrets.create'),
	'vault.secrets.get': inkboxSchemaEntry('vault.secrets.get'),
	'vault.secrets.grantAccess': inkboxSchemaEntry('vault.secrets.grantAccess'),
	'vault.secrets.list': inkboxSchemaEntry('vault.secrets.list'),
	'vault.secrets.listAccess': inkboxSchemaEntry('vault.secrets.listAccess'),
	'vault.secrets.revokeAccess': inkboxSchemaEntry('vault.secrets.revokeAccess'),
	'vault.secrets.update': inkboxSchemaEntry('vault.secrets.update'),
	'voiceAgent.getConfig': inkboxSchemaEntry('voiceAgent.getConfig'),
	'voiceAgent.listVoices': inkboxSchemaEntry('voiceAgent.listVoices'),
	'voiceAgent.mcpServers.cancelAuthorization': inkboxSchemaEntry(
		'voiceAgent.mcpServers.cancelAuthorization',
	),
	'voiceAgent.mcpServers.create': inkboxSchemaEntry(
		'voiceAgent.mcpServers.create',
	),
	'voiceAgent.mcpServers.delete': inkboxSchemaEntry(
		'voiceAgent.mcpServers.delete',
	),
	'voiceAgent.mcpServers.disconnect': inkboxSchemaEntry(
		'voiceAgent.mcpServers.disconnect',
	),
	'voiceAgent.mcpServers.get': inkboxSchemaEntry('voiceAgent.mcpServers.get'),
	'voiceAgent.mcpServers.getAuthorization': inkboxSchemaEntry(
		'voiceAgent.mcpServers.getAuthorization',
	),
	'voiceAgent.mcpServers.getCatalog': inkboxSchemaEntry(
		'voiceAgent.mcpServers.getCatalog',
	),
	'voiceAgent.mcpServers.list': inkboxSchemaEntry('voiceAgent.mcpServers.list'),
	'voiceAgent.mcpServers.refresh': inkboxSchemaEntry(
		'voiceAgent.mcpServers.refresh',
	),
	'voiceAgent.mcpServers.startAuthorization': inkboxSchemaEntry(
		'voiceAgent.mcpServers.startAuthorization',
	),
	'voiceAgent.mcpServers.test': inkboxSchemaEntry('voiceAgent.mcpServers.test'),
	'voiceAgent.mcpServers.update': inkboxSchemaEntry(
		'voiceAgent.mcpServers.update',
	),
	'voiceAgent.setAuthorityMode': inkboxSchemaEntry(
		'voiceAgent.setAuthorityMode',
	),
	'voiceAgent.setConfig': inkboxSchemaEntry('voiceAgent.setConfig'),
	'webhooks.deliveries.list': inkboxSchemaEntry('webhooks.deliveries.list'),
	'webhooks.deliveries.replay': inkboxSchemaEntry('webhooks.deliveries.replay'),
	'webhooks.getCatalog': inkboxSchemaEntry('webhooks.getCatalog'),
	'webhooks.subscriptions.create': inkboxSchemaEntry(
		'webhooks.subscriptions.create',
	),
	'webhooks.subscriptions.delete': inkboxSchemaEntry(
		'webhooks.subscriptions.delete',
	),
	'webhooks.subscriptions.get': inkboxSchemaEntry('webhooks.subscriptions.get'),
	'webhooks.subscriptions.list': inkboxSchemaEntry(
		'webhooks.subscriptions.list',
	),
	'webhooks.subscriptions.update': inkboxSchemaEntry(
		'webhooks.subscriptions.update',
	),
	'whatsapp.assignments.list': inkboxSchemaEntry('whatsapp.assignments.list'),
	'whatsapp.assignments.release': inkboxSchemaEntry(
		'whatsapp.assignments.release',
	),
	'whatsapp.connect': inkboxSchemaEntry('whatsapp.connect'),
	'whatsapp.conversations.get': inkboxSchemaEntry('whatsapp.conversations.get'),
	'whatsapp.conversations.getThread': inkboxSchemaEntry(
		'whatsapp.conversations.getThread',
	),
	'whatsapp.conversations.list': inkboxSchemaEntry(
		'whatsapp.conversations.list',
	),
	'whatsapp.disconnect': inkboxSchemaEntry('whatsapp.disconnect'),
	'whatsapp.getLimits': inkboxSchemaEntry('whatsapp.getLimits'),
	'whatsapp.getOnboarding': inkboxSchemaEntry('whatsapp.getOnboarding'),
	'whatsapp.getTriageNumber': inkboxSchemaEntry('whatsapp.getTriageNumber'),
	'whatsapp.markRead': inkboxSchemaEntry('whatsapp.markRead'),
	'whatsapp.media.get': inkboxSchemaEntry('whatsapp.media.get'),
	'whatsapp.media.getPlayback': inkboxSchemaEntry('whatsapp.media.getPlayback'),
	'whatsapp.media.upload': inkboxSchemaEntry('whatsapp.media.upload'),
	'whatsapp.messages.get': inkboxSchemaEntry('whatsapp.messages.get'),
	'whatsapp.messages.getThread': inkboxSchemaEntry(
		'whatsapp.messages.getThread',
	),
	'whatsapp.messages.list': inkboxSchemaEntry('whatsapp.messages.list'),
	'whatsapp.messages.send': inkboxSchemaEntry('whatsapp.messages.send'),
	'whatsapp.numbers.assign': inkboxSchemaEntry('whatsapp.numbers.assign'),
	'whatsapp.numbers.list': inkboxSchemaEntry('whatsapp.numbers.list'),
	'whatsapp.reactions.delete': inkboxSchemaEntry('whatsapp.reactions.delete'),
	'whatsapp.reactions.get': inkboxSchemaEntry('whatsapp.reactions.get'),
	'whatsapp.reactions.send': inkboxSchemaEntry('whatsapp.reactions.send'),
	'whatsapp.router.get': inkboxSchemaEntry('whatsapp.router.get'),
	'whatsapp.router.listConversations': inkboxSchemaEntry(
		'whatsapp.router.listConversations',
	),
	'whatsapp.router.listMessages': inkboxSchemaEntry(
		'whatsapp.router.listMessages',
	),
	'whatsapp.router.update': inkboxSchemaEntry('whatsapp.router.update'),
	'whatsapp.sendTyping': inkboxSchemaEntry('whatsapp.sendTyping'),
} satisfies RequiredPluginEndpointSchemas<typeof inkboxEndpointsNested>;

export const inkboxEndpointMeta = {
	'a2a.contactRules.create': {
		riskLevel: 'write',
		description:
			'Creates an allow or block rule (`action`) controlling which agent (`match_target`) can exchange A2A tasks with this identity, optionally per `direction`. Requires an admin API key.',
	},
	'a2a.contactRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes one A2A contact rule (`rule_id`) from an identity. Requires an admin API key.',
	},
	'a2a.contactRules.list': {
		riskLevel: 'read',
		description:
			'Lists the A2A allow and block rules for one identity (`agent_handle`).',
	},
	'a2a.contactRules.listForOrg': {
		riskLevel: 'read',
		description:
			'Lists active A2A contact rules across every identity in the organization, filterable by `agent_identity_id`, `action` and `direction`. Requires an admin API key.',
	},
	'a2a.contactRules.update': {
		riskLevel: 'write',
		description:
			"Changes an A2A contact rule's `action` and/or `direction`; to change the match target, delete and recreate the rule. Requires an admin API key.",
	},
	'a2a.contexts.get': {
		riskLevel: 'read',
		description:
			'Returns one A2A context (a conversation session) that another agent opened toward this identity, with its tasks in both directions.',
	},
	'a2a.contexts.list': {
		riskLevel: 'read',
		description:
			'Lists A2A contexts visible to an identity, most recently active first, optionally filtered by `direction`.',
	},
	'a2a.contexts.update': {
		riskLevel: 'write',
		description:
			'Renames an A2A context (`name`). Either participant can rename it, whoever opened it.',
	},
	'a2a.invitations.accept': {
		riskLevel: 'write',
		description:
			"Accepts an A2A invitation (`invitation_token`) as the agent that owns the calling agent-scoped API key, connecting it to the invitation's peer agents.",
	},
	'a2a.invitations.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Creates an A2A invitation that lets an outside agent connect to `peer_agent_handles`; Inkbox emails `recipient_email` if set, otherwise returns a link to hand off. Requires an admin API key.',
	},
	'a2a.invitations.decline': {
		riskLevel: 'write',
		description:
			'Declines an A2A invitation by its `invitation_token`. Connections already accepted are not affected. Inkbox needs no API key for this route; the plugin still sends the connected one.',
	},
	'a2a.invitations.get': {
		riskLevel: 'read',
		description:
			'Returns one A2A invitation issued by your organization, with its status, peer agents and email delivery state.',
	},
	'a2a.invitations.list': {
		riskLevel: 'read',
		description:
			'Lists A2A invitations issued by your organization, newest first, optionally filtered by `status`.',
	},
	'a2a.invitations.preview': {
		riskLevel: 'read',
		description:
			"Shows an A2A invitation's inviter, peer agents and expiry from the raw `invitation_token` without accepting it. Inkbox needs no API key for this route; the plugin still sends the connected one.",
	},
	'a2a.invitations.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revokes a pending or awaiting-verification A2A invitation so it can no longer be accepted. Accepted, declined or expired invitations cannot be revoked.',
	},
	'a2a.listDirectory': {
		riskLevel: 'read',
		description:
			"Searches the organization's directory of A2A-enabled agent identities, including non-public cards, by text `q` or `verified_domain`.",
	},
	'a2a.messages.list': {
		riskLevel: 'read',
		description:
			'Lists A2A task messages for an identity, newest first, filterable by `direction`, `task_id`, `context_id`, `role`, peer handles, `since` or full-text `q`.',
	},
	'a2a.previewCard': {
		riskLevel: 'read',
		description:
			'Returns the Agent Card Inkbox would publish for one of your identities, even while A2A is disabled, to review its description and skills.',
	},
	'a2a.sentContexts.get': {
		riskLevel: 'read',
		description:
			'Returns one A2A context this identity opened toward another agent, with its tasks in both directions. Returns 404 for contexts opened toward it.',
	},
	'a2a.sentContexts.list': {
		riskLevel: 'read',
		description: 'Lists A2A contexts this identity opened toward other agents.',
	},
	'a2a.sentTasks.get': {
		riskLevel: 'read',
		description:
			'Returns one A2A task this identity sent to another agent, with its message history.',
	},
	'a2a.sentTasks.list': {
		riskLevel: 'read',
		description:
			'Lists A2A tasks this identity sent to other agents, newest first, filterable by `state`, `context_id`, peer handles, `since` or full-text `q`.',
	},
	'a2a.settings.get': {
		riskLevel: 'read',
		description:
			"Returns an identity's A2A settings (enabled, public discoverability, filter mode, skills, card URL) and lifetime inbound and outbound task counts.",
	},
	'a2a.settings.listForOrg': {
		riskLevel: 'read',
		description:
			"Lists every identity's effective A2A settings across the organization, optionally filtered by `enabled`. Requires an admin API key.",
	},
	'a2a.settings.update': {
		riskLevel: 'write',
		description:
			"Updates an identity's A2A settings: `enabled`, `skills`, `allow_public_egress`, and (admin key only) `publicly_discoverable` and `filter_mode`. Omitted fields are kept.",
	},
	'a2a.tasks.get': {
		riskLevel: 'read',
		description:
			'Returns one A2A task this identity received as the worker, with its message history. Use `a2a.sentTasks.get` for tasks it sent.',
	},
	'a2a.tasks.list': {
		riskLevel: 'read',
		description:
			'Lists A2A tasks visible to an identity, newest first; received tasks by default, or set `direction`. Filterable by `state`, `context_id`, peer handles and `q`.',
	},
	'a2a.tasks.reply': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Replies to a task this identity received, sending message `parts` to the requesting agent and moving the task by `intent`: progress, ask_caller, complete or fail.',
	},
	'account.whoami': {
		riskLevel: 'read',
		description:
			"Returns the authenticated caller's identity and auth type, to check which organization, identity or key a request runs as.",
	},
	'agentSignup.getStatus': {
		riskLevel: 'read',
		description:
			"Returns the calling agent's claim status, its human owner's account state and email, and the restrictions that still apply to it.",
	},
	'agentSignup.resendVerification': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Emails the agent's human owner a new 6-digit verification code, invalidating the previous one. Limited to once every 5 minutes.",
	},
	'agentSignup.verify': {
		riskLevel: 'write',
		description:
			'Submits the 6-digit `verification_code` the human received by email to claim the agent and unlock full sending.',
	},
	'apiKeys.create': {
		riskLevel: 'destructive',
		description:
			'Creates an API key (`label`): set `scoped_identity_id` for an agent-scoped key, or omit it for an admin key with full organization access. The key value is returned only once.',
	},
	'apiKeys.getCurrent': {
		riskLevel: 'read',
		description:
			'Returns metadata for the API key making the call (scope, label, status, last four characters, expiry). The key value itself is never returned.',
	},
	'apiKeys.revokeCurrent': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revokes the API key making the call, permanently, so later requests with it fail. Create a replacement key before revoking.',
	},
	'billing.callingCountries.buy': {
		riskLevel: 'destructive',
		description:
			'Buys outbound calling access to countries (`country_code` or `country_codes`) with an accepted `quote` and a new `request_key`, charging the organization. Reuse the key on retry; admin key only.',
	},
	'billing.callingCountries.cancel': {
		riskLevel: 'destructive',
		description:
			'Cancels renewal of a calling-country agreement (`agreement_id`). Access lasts through the paid period; no prorated refund.',
	},
	'billing.callingCountries.list': {
		riskLevel: 'read',
		description:
			"Lists calling destinations with monthly prices, the organization's calling-country agreements, and the countries already included.",
	},
	'billing.callingCountries.quote': {
		riskLevel: 'read',
		description:
			'Quotes the prorated charge for adding calling countries (`country_code` or `country_codes`) and returns a `quote` token to confirm the purchase. Does not charge.',
	},
	'billing.callingCountries.resume': {
		riskLevel: 'destructive',
		description:
			'Resumes renewal of a canceled calling-country agreement (`agreement_id`) before its coverage ends, at the existing price.',
	},
	'billing.changePlan': {
		riskLevel: 'destructive',
		description:
			"Changes the organization's subscription `plan` (`free` cancels) and optionally its billing `interval`; requires an admin key. Upgrades and moves to yearly are charged and prorated immediately.",
	},
	'billing.createCheckoutSession': {
		riskLevel: 'write',
		description:
			'Creates a Stripe Checkout URL for subscribing to a `plan`, returning to `success_url` or `cancel_url`. The user pays in the browser.',
	},
	'billing.createPortalSession': {
		riskLevel: 'write',
		description:
			"Creates a Stripe billing portal URL where a person manages the organization's billing, returning to `return_url` afterwards.",
	},
	'billing.getPricing': {
		riskLevel: 'read',
		description:
			"Returns usage rates and recurring add-on prices, with the organization's contracted price where one applies.",
	},
	'billing.getSubscription': {
		riskLevel: 'read',
		description:
			"Returns the organization's plan, status, billing interval, pending changes and entitlements, including whether custom email signatures are available.",
	},
	'billing.getUsage': {
		riskLevel: 'read',
		description:
			'Returns organization usage for the current billing cycle (SMS/MMS, call seconds, iMessage, storage, identities) by channel and identity, with remaining allowances and overage.',
	},
	'billing.identityPacks.buy': {
		riskLevel: 'destructive',
		description:
			'Buys an identity pack (extra agent identity slots) with an accepted `quote` and a new `request_key`, charging the organization; may return a `payment_url`. Requires an admin API key.',
	},
	'billing.identityPacks.change': {
		riskLevel: 'destructive',
		description:
			'Cancels or resumes renewal of an identity-pack agreement (`action`: cancel or resume), with a unique `request_key`.',
	},
	'billing.identityPacks.list': {
		riskLevel: 'read',
		description:
			"Lists the identity-pack offer, the organization's identity-pack agreements, identity capacity and whether it is eligible to buy.",
	},
	'billing.identityPacks.quote': {
		riskLevel: 'read',
		description:
			'Quotes the price of an identity pack (extra identity slots) and returns a `quote` token for buying it. Does not charge.',
	},
	'billing.lineBundles.buy': {
		riskLevel: 'destructive',
		description:
			'Buys a line bundle (`code`: a VoIP or personal iMessage line slot plus voice and SMS credits) with an accepted `quote` and `request_key`, charging the organization. Assigns no number; admin key only.',
	},
	'billing.lineBundles.change': {
		riskLevel: 'destructive',
		description:
			'Cancels or resumes a line-bundle agreement (`action`). Canceling removes an unused line slot immediately with no refund.',
	},
	'billing.lineBundles.list': {
		riskLevel: 'read',
		description:
			"Lists line-bundle offers, the organization's bundle agreements, and remaining bundle voice seconds and messages.",
	},
	'billing.lineBundles.quote': {
		riskLevel: 'read',
		description:
			'Quotes the prorated price and credits of a line bundle (`code`) and returns a `quote` token for buying it. Does not charge.',
	},
	'billing.setVoicePacks': {
		riskLevel: 'destructive',
		description:
			'Sets how many call-minute packs of one size the organization holds (`pack`, `quantity`; 0 removes them); increases are invoiced immediately. Paid plans and admin key only.',
	},
	'billing.settings.get': {
		riskLevel: 'read',
		description:
			"Returns the organization's monthly SMS and voice overage spending cap and whether the 'Sent via Inkbox' email footer is removed.",
	},
	'billing.settings.update': {
		riskLevel: 'write',
		description:
			'Sets the monthly SMS/voice overage cap (`overage_cap_cents`; null clears it, 0 blocks overage) and/or `remove_branding_footer` (paid plans only).',
	},
	'billing.usageAlerts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a usage alert override (`rule_id`), restoring the default 90% alert for that quota when no other overrides remain.',
	},
	'billing.usageAlerts.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's usage email alerts (identities, storage, SMS, voice, overage) with thresholds and whether each is a default.",
	},
	'billing.usageAlerts.save': {
		riskLevel: 'write',
		description:
			'Creates or updates a usage email alert (`rule_id`; a new UUID adds one) for a `metric` at a percentage `threshold`, optionally for one `mailbox_id` (storage).',
	},
	'compliance.brand.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes the organization's 10DLC brand registration. Requires an admin API key.",
	},
	'compliance.brand.get': {
		riskLevel: 'read',
		description:
			"Returns the organization's 10DLC brand registration and its current verification status.",
	},
	'compliance.brand.register': {
		riskLevel: 'destructive',
		description:
			"Registers the organization's 10DLC brand (business details for US SMS) for verification. One brand per organization; asynchronous, so check its status afterwards.",
	},
	'compliance.brand.resendTwoFactorEmail': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Resends the verification (2FA) email for the organization's 10DLC brand.",
	},
	'compliance.brand.sendSmsOtp': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Texts a one-time PIN to the brand's phone to verify a sole-proprietor 10DLC brand; confirm it with `compliance.brand.verifySmsOtp`.",
	},
	'compliance.brand.update': {
		riskLevel: 'write',
		description:
			"Replaces the organization's 10DLC brand details; all required business fields must be sent again. Requires an admin API key.",
	},
	'compliance.brand.verifySmsOtp': {
		riskLevel: 'write',
		description:
			'Verifies the 10DLC brand with the one-time PIN (`otp_pin`) received by SMS.',
	},
	'compliance.campaign.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes the organization's 10DLC campaign, which also stops its monthly fee. Requires an admin API key.",
	},
	'compliance.campaign.get': {
		riskLevel: 'read',
		description:
			"Returns the organization's 10DLC campaign and its carrier review status (`campaignStatus`).",
	},
	'compliance.campaign.getActive': {
		riskLevel: 'read',
		description:
			"Returns whether the organization has selected its own 10DLC campaign (`active: true`) or Inkbox's default campaign.",
	},
	'compliance.campaign.register': {
		riskLevel: 'destructive',
		description:
			"Submits the organization's 10DLC campaign (use case, sample messages, opt-in/opt-out keywords, policy links) for carrier review. Costs $20/month once approved.",
	},
	'compliance.campaign.resubmit': {
		riskLevel: 'destructive',
		description:
			"Replaces the 10DLC campaign with a complete new registration and a new campaign ID; local numbers return to Inkbox's default campaign during review.",
	},
	'compliance.campaign.setActive': {
		riskLevel: 'destructive',
		description:
			"Switches the organization's local US numbers to its own approved 10DLC campaign (`active: true`) or back to Inkbox's default. Runs asynchronously.",
	},
	'compliance.campaign.update': {
		riskLevel: 'write',
		description:
			"Updates the 10DLC campaign's `help_message`, `message_flow` and sample messages. Requires an admin API key.",
	},
	'compliance.uploadOptInEvidence': {
		riskLevel: 'write',
		description:
			"Uploads an image (`file`, max 5 MiB) of your SMS opt-in flow and returns a public URL to cite in the campaign's `message_flow`.",
	},
	'contacts.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes 1 to 1,000 contacts by `contact_ids` and returns a result for each.',
	},
	'contacts.communicationPolicy.get': {
		riskLevel: 'read',
		description:
			"Returns a contact's communication policy for an agent identity (`identity_id`): per-address inbound/outbound allow or block and field visibility.",
	},
	'contacts.communicationPolicy.preview': {
		riskLevel: 'read',
		description:
			'Previews what one agent identity (`identity_id`) can see of a contact and whether it may email or phone it in each direction. Requires an admin API key.',
	},
	'contacts.communicationPolicy.set': {
		riskLevel: 'write',
		description:
			"Sets which of a contact's `addresses` an agent identity (`identity_id`) may use inbound and outbound, and its `visibility`, given the current `expected_revision`. Requires an admin API key.",
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Creates a contact with names, company, emails, phones, addresses and custom fields. At least one name field or `company_name` is required.',
	},
	'contacts.createWithPermissions': {
		riskLevel: 'write',
		description:
			"Creates a contact and sets one agent's access `permissions` in a single transaction. Requires an admin API key.",
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes one contact by `contact_id`. Use `contacts.bulkDelete` to delete up to 1,000 at once.',
	},
	'contacts.exportVcard': {
		riskLevel: 'read',
		description: 'Downloads one contact (`contact_id`) as a vCard (.vcf) file.',
	},
	'contacts.exportVcards': {
		riskLevel: 'read',
		description:
			'Exports 1 to 25 contacts (`contact_ids`) as a single vCard document.',
	},
	'contacts.facts.create': {
		riskLevel: 'write',
		description:
			'Adds a memory (`content`, `kind`) to a contact. Requires an admin API key; agent-scoped keys cannot write memories.',
	},
	'contacts.facts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes one memory from a contact. Requires an admin API key.',
	},
	'contacts.facts.get': {
		riskLevel: 'read',
		description:
			'Returns one contact memory with its citations, including a memory whose deadline has passed.',
	},
	'contacts.facts.list': {
		riskLevel: 'read',
		description:
			"Lists a contact's memories, most recently updated first. Set `include_expired` to include memories past their deadline.",
	},
	'contacts.facts.resolveCitation': {
		riskLevel: 'read',
		description:
			"Resolves a memory's citation to its source ID, locator and URL, after rechecking that the caller can still access that correspondence.",
	},
	'contacts.facts.update': {
		riskLevel: 'write',
		description:
			"Edits a contact memory's `content` or moves it to another `kind`. Requires an admin API key.",
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			'Returns one contact by `contact_id`, limited to the fields the caller is permitted to see.',
	},
	'contacts.getCorrespondence': {
		riskLevel: 'read',
		description:
			'Returns email, SMS, iMessage, WhatsApp and call history between one contact and an agent identity, filterable by `channels`, `after`/`before` and per-channel limits.',
	},
	'contacts.import': {
		riskLevel: 'write',
		description:
			'Imports up to 2,500 contacts from a vCard body (max 10 MiB). Pass `X-VCard-Preview-Hash` from a preview to fail if the data or conflicts changed.',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'Lists contacts visible to the caller, with name search `q`, `order` and `review_status` filters.',
	},
	'contacts.lookup': {
		riskLevel: 'read',
		description:
			'Finds contacts by one field: exact `email` or `phone`, or partial match with `email_contains`, `email_domain` or `phone_contains`.',
	},
	'contacts.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Merges duplicate contacts (`losing_contact_ids`) into this contact, combining identifiers, correspondence and memories. Requires an admin API key.',
	},
	'contacts.previewImport': {
		riskLevel: 'read',
		description:
			'Validates a vCard batch (`vcard`) and reports conflicts with existing contacts, without creating any. Returns a `preview_hash` for the import.',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Updates a contact with JSON merge-patch: sent fields replace, null clears, omitted fields are kept.',
	},
	'domains.create': {
		riskLevel: 'write',
		description:
			'Registers a custom email sending domain (`domain`) and returns the DNS records to publish. An apex with existing MX records needs `apex_mx_acknowledged` to displace that mail provider.',
	},
	'domains.delete': {
		riskLevel: 'destructive',
		description:
			'Deletes a custom sending domain: sending and receiving stop at once, and it can be restored for 24 hours before deletion is permanent. Fails while mailboxes still use it.',
	},
	'domains.forceDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a custom sending domain (`domain_id`) by force, bypassing the normal delete flow and its restore window; treat it as permanent.',
	},
	'domains.get': {
		riskLevel: 'read',
		description:
			'Returns one custom sending domain with its status and required DNS records.',
	},
	'domains.getDnsRecords': {
		riskLevel: 'read',
		description:
			'Returns the DNS records (ownership TXT, mail routing, DKIM and others) to publish at the registrar for a custom sending domain.',
	},
	'domains.getHealth': {
		riskLevel: 'read',
		description:
			"Returns a custom sending domain's health: its status and the current check result for each required DNS record.",
	},
	'domains.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's custom email sending domains, optionally filtered by lifecycle `status`.",
	},
	'domains.restore': {
		riskLevel: 'write',
		description:
			'Restores a custom sending domain that is still in its 24-hour deletion grace period.',
	},
	'domains.rotateDkim': {
		riskLevel: 'destructive',
		description:
			'Starts a DKIM key rotation for a custom sending domain and returns the new selector and TXT value to publish; the old key stays active until the new one verifies.',
	},
	'domains.setDefault': {
		riskLevel: 'write',
		description:
			"Makes a verified custom domain (`domain_name`) the organization's default for new mailboxes; pass `inkboxmail.com` to revert. Requires an admin API key.",
	},
	'domains.verify': {
		riskLevel: 'write',
		description:
			"Re-checks a custom sending domain's DNS records now and returns its updated status.",
	},
	'hostedChat.answerInteraction': {
		riskLevel: 'write',
		description:
			'Answers a pending tool approval or question in a hosted-agent conversation with `response` (for example approve_once or deny) at `expected_version`; only the first valid answer counts.',
	},
	'hostedChat.conversations.create': {
		riskLevel: 'write',
		description:
			"Starts a new chat conversation with an identity's hosted agent, with an optional `title`.",
	},
	'hostedChat.conversations.get': {
		riskLevel: 'read',
		description:
			'Returns a snapshot of a hosted-agent conversation: recent items, pending approvals, the current turn, and cursors for paging and events.',
	},
	'hostedChat.conversations.list': {
		riskLevel: 'read',
		description:
			"Lists chat conversations with an identity's hosted agent, optionally filtered by `origin` (`chat`, `communication` or `schedule`).",
	},
	'hostedChat.conversations.listMessages': {
		riskLevel: 'read',
		description:
			'Lists older items of a hosted-agent conversation, paging with `after` and a `snapshot` token from the conversation snapshot.',
	},
	'hostedChat.conversations.rename': {
		riskLevel: 'write',
		description:
			"Updates a hosted-agent conversation's `title` and/or tool `permission_mode` (ask or yolo, which auto-approves tool requests in future turns).",
	},
	'hostedChat.files.download': {
		riskLevel: 'read',
		description:
			'Downloads a hosted-agent chat file (uploaded or produced by the agent) as base64 (`data_base64`).',
	},
	'hostedChat.files.get': {
		riskLevel: 'read',
		description:
			'Returns metadata for a hosted-agent chat file: name, media type, size and availability.',
	},
	'hostedChat.files.upload': {
		riskLevel: 'write',
		description:
			'Uploads a file (`name`, `data_base64`, max 5 MB) for use as an attachment in a hosted-agent chat turn.',
	},
	'hostedChat.getStatus': {
		riskLevel: 'read',
		description:
			"Returns the hosted agent's workspace status for chat: computer state, agent readiness, capabilities, funding and allowed actions.",
	},
	'hostedChat.turns.cancel': {
		riskLevel: 'write',
		description:
			'Requests cancellation of a running turn in a hosted-agent conversation.',
	},
	'hostedChat.turns.create': {
		riskLevel: 'destructive',
		description:
			"Sends a message (`content`: text and file parts) to an identity's hosted agent, starting a turn with an optional `model`; wakes a stopped computer, one turn at a time. Admin API key only.",
	},
	'hostedChat.turns.get': {
		riskLevel: 'read',
		description:
			'Returns the status of one turn in a hosted-agent conversation (queued, running, waiting_for_input, completed, failed and so on) and any blocker.',
	},
	'hostedWorkspace.environment.get': {
		riskLevel: 'read',
		description:
			"Lists environment variables set on the hosted agent's computer; secret values are masked.",
	},
	'hostedWorkspace.environment.update': {
		riskLevel: 'write',
		description:
			"Sets (`set`) or removes (`remove`) environment variables on the hosted agent's computer at `expected_version`. Changes apply to new processes.",
	},
	'hostedWorkspace.get': {
		riskLevel: 'read',
		description:
			"Returns the hosted agent's computer state, agent readiness, capabilities, funding and allowed actions.",
	},
	'hostedWorkspace.getOperation': {
		riskLevel: 'read',
		description:
			'Returns the progress and result of a workspace operation (start, stop, pause, resume, resize, terminal) by `operation_id`.',
	},
	'hostedWorkspace.getUsage': {
		riskLevel: 'read',
		description:
			"Returns current CPU, memory and disk usage of the hosted agent's computer.",
	},
	'hostedWorkspace.getUsageHistory': {
		riskLevel: 'read',
		description:
			"Returns CPU, memory and disk usage history of the hosted agent's computer over a `window` (1h, 24h, 7d or 30d).",
	},
	'hostedWorkspace.ports.get': {
		riskLevel: 'read',
		description:
			"Returns the hosted agent's public URL, default port and exposed ports.",
	},
	'hostedWorkspace.ports.rotateToken': {
		riskLevel: 'destructive',
		description:
			'Issues a new access token URL for an exposed port on the hosted agent; the old token stops working immediately. Requires an admin API key.',
	},
	'hostedWorkspace.ports.update': {
		riskLevel: 'write',
		description:
			'Sets which ports the hosted agent exposes (`ports`, public or token-protected) and the `default_port`, given the current `version`. Removing a port deletes its token.',
	},
	'hostedWorkspace.resize': {
		riskLevel: 'destructive',
		description:
			"Changes a stopped hosted computer's CPU and memory (`shape_id`) and optionally `disk_bytes`, given `expected_version`. Runs asynchronously; larger shapes need a paid plan.",
	},
	'hostedWorkspace.runAction': {
		riskLevel: 'destructive',
		description:
			"Starts, stops, pauses or resumes the hosted agent's computer (`action`) and returns an `operation_id` to poll; stop ends running programs but keeps files. Requires an admin API key.",
	},
	'hostedWorkspace.schedules.create': {
		riskLevel: 'write',
		description:
			'Creates a scheduled run for the hosted agent (cron, interval or once, in `fields`) with `expected_revision` 0. Needs a running agent; scheduled runs auto-approve tool requests.',
	},
	'hostedWorkspace.schedules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a hosted-agent schedule, given its current `expected_revision`.',
	},
	'hostedWorkspace.schedules.list': {
		riskLevel: 'read',
		description:
			"Lists the hosted agent's schedules with their registration status.",
	},
	'hostedWorkspace.schedules.listOccurrences': {
		riskLevel: 'read',
		description:
			'Lists past runs of one hosted-agent schedule and the conversation that holds their output.',
	},
	'hostedWorkspace.schedules.preview': {
		riskLevel: 'read',
		description:
			'Previews the next run times for a schedule `timing` (cron, interval or once) without saving anything.',
	},
	'hostedWorkspace.schedules.update': {
		riskLevel: 'write',
		description:
			'Edits, pauses (`enabled: false`) or resumes a hosted-agent schedule via `fields`, given its current `expected_revision`.',
	},
	'hostedWorkspace.terminals.close': {
		riskLevel: 'write',
		description: "Closes a terminal session on the hosted agent's computer.",
	},
	'hostedWorkspace.terminals.create': {
		riskLevel: 'write',
		description:
			"Opens a terminal or runs a command (`argv`, `cwd`, `env`, optional `pty`, `timeout_ms`) on the hosted agent's computer, which must be started. Requires an admin API key.",
	},
	'hostedWorkspace.terminals.createTicket': {
		riskLevel: 'write',
		description:
			"Returns a short-lived ticket and URL to attach to a terminal session on the hosted agent's computer.",
	},
	'hostedWorkspace.terminals.list': {
		riskLevel: 'read',
		description: "Lists terminal sessions on the hosted agent's computer.",
	},
	'hosting.callTool': {
		riskLevel: 'destructive',
		description:
			"Sends a JSON-RPC MCP request (`method`, `params`) to the identity's hosted tools endpoint, for example to list or call the tools its hosted agent uses.",
	},
	'hosting.deliveries.list': {
		riskLevel: 'read',
		description:
			"Lists up to 100 incoming-event deliveries to an identity's hosted agent, with state, attempts and last error. Page back with `before`.",
	},
	'hosting.deliveries.retry': {
		riskLevel: 'write',
		description:
			"Re-queues a failed event delivery to the identity's hosted agent. Requires an admin API key.",
	},
	'hosting.get': {
		riskLevel: 'read',
		description:
			"Returns an identity's hosted-agent configuration: harness, compute shape, state, default model, instructions, trigger events and current `generation`.",
	},
	'hosting.set': {
		riskLevel: 'destructive',
		description:
			"Configures an identity's hosted agent (harness, `shape_id`, `default_model`, `instructions`, `trigger_events`) at `expected_generation`; admin key only. `enabled: false` deletes the computer and its files.",
	},
	'identities.avatar.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Removes an identity's avatar so future contact cards go out without a photo. Succeeds even when no avatar is set.",
	},
	'identities.avatar.get': {
		riskLevel: 'read',
		description: "Downloads an identity's avatar as a 600x600 JPEG image.",
	},
	'identities.avatar.getMetadata': {
		riskLevel: 'read',
		description:
			'Returns whether an identity has an avatar, its content type, and a temporary authorized URL to fetch it.',
	},
	'identities.avatar.setFromStagedMedia': {
		riskLevel: 'write',
		description:
			"Sets an identity's avatar from a previously uploaded staged media file (`staged_media_handle`) instead of a direct upload.",
	},
	'identities.avatar.upload': {
		riskLevel: 'write',
		description:
			"Uploads or replaces an identity's avatar image (`file`, multipart), used as the photo on the contact cards it shares.",
	},
	'identities.companion.get': {
		riskLevel: 'read',
		description:
			"Returns an identity's Companion mode setting (whether it can join group conversations when an allowed sender brings it in) and per-channel readiness.",
	},
	'identities.companion.getHistory': {
		riskLevel: 'read',
		description:
			"Returns the authorized message history for one Companion mode activation (`activation_id`), including the sponsor's triggering message, page by page.",
	},
	'identities.companion.listConversations': {
		riskLevel: 'read',
		description:
			"Lists an identity's Companion mode conversation scopes (pending or active sponsorship), optionally filtered by `channel`.",
	},
	'identities.companion.update': {
		riskLevel: 'write',
		description:
			'Turns Companion mode on or off (`enabled`) for an identity. Requires an admin API key; it never creates contact rules or channels.',
	},
	'identities.connectImessageNumber': {
		riskLevel: 'write',
		description:
			'Attaches an existing dedicated iMessage number (`imessage_number_id`) to an identity.',
	},
	'identities.contactAccess.get': {
		riskLevel: 'read',
		description:
			'Returns what an identity can see and contact for one contact: email and phone visibility, addresses it may send to or receive from, profile and memories. Requires an admin API key.',
	},
	'identities.contactAccess.update': {
		riskLevel: 'write',
		description:
			"Sets an identity's access to one contact by group: `email` and `phone` visibility and inbound/outbound contactable lists (replacing that side), `profile` and `memories`. Admin API key only.",
	},
	'identities.contactPermissions.get': {
		riskLevel: 'read',
		description:
			"Returns an identity's legacy per-address email and phone permissions (inbound and outbound) for one contact, plus profile and memories access. Requires an admin API key.",
	},
	'identities.contactPermissions.list': {
		riskLevel: 'read',
		description:
			"Lists every contact in the organization with an identity's permissions, including contacts hidden from that identity. Requires an admin API key.",
	},
	'identities.contactPermissions.update': {
		riskLevel: 'write',
		description:
			"Updates an identity's legacy permissions for one contact: `emails`/`phones` maps set both directions, `inbound_*`/`outbound_*` maps set one. Requires an admin API key.",
	},
	'identities.create': {
		riskLevel: 'destructive',
		description:
			'Creates an agent identity (`agent_handle`) with its mailbox and tunnel, optionally provisioning a phone number, claiming an iMessage line or attaching vault secrets.',
	},
	'identities.createTunnel': {
		riskLevel: 'write',
		description:
			'Creates the tunnel for an identity that has none (for example one created with `hosted: true`), named after its handle. Requires an admin API key.',
	},
	'identities.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an identity with its mailbox and tunnel, revokes its scoped API keys and releases its phone number to the carrier. Cannot be undone; the handle stays reserved.',
	},
	'identities.disconnectImessageNumber': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Detaches the dedicated iMessage number from an identity.',
	},
	'identities.domainAffiliation.get': {
		riskLevel: 'read',
		description:
			"Returns the verified organization domain an identity is affiliated with, as shown to A2A peers, and the affiliation's validity.",
	},
	'identities.domainAffiliation.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Removes an identity's affiliation with a verified organization domain.",
	},
	'identities.domainAffiliation.set': {
		riskLevel: 'write',
		description:
			"Affiliates an identity with a verified organization domain claim (`domain_claim_id`) so A2A peers see it belongs to that domain's owner.",
	},
	'identities.get': {
		riskLevel: 'read',
		description:
			'Returns one identity with its linked mailbox, tunnel, phone number and iMessage line, plus its channel and filter settings.',
	},
	'identities.getChannelStatus': {
		riskLevel: 'read',
		description:
			'Returns which channels an identity can use right now: email and sending domain, phone, SMS and calling availability, iMessage and WhatsApp status.',
	},
	'identities.getCurrent': {
		riskLevel: 'read',
		description:
			'Returns the identity the calling agent-scoped API key belongs to.',
	},
	'identities.list': {
		riskLevel: 'read',
		description:
			'Lists all identities in the organization, newest first, each with its mailbox, tunnel, phone number and iMessage line.',
	},
	'identities.listContactCommunicationPolicies': {
		riskLevel: 'read',
		description:
			"Lists an identity's per-contact communication policies (which contact addresses it may use) with paging.",
	},
	'identities.mailContactRules.create': {
		riskLevel: 'write',
		description:
			'Creates an email allow or block rule (`action`) for an identity matching an exact address or domain (`match_type`, `match_target`), optionally per `direction`. Admin API key only.',
	},
	'identities.mailContactRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an email contact rule from an identity. Requires an admin API key.',
	},
	'identities.mailContactRules.get': {
		riskLevel: 'read',
		description:
			'Returns one email allow or block rule of an identity by `rule_id`.',
	},
	'identities.mailContactRules.list': {
		riskLevel: 'read',
		description:
			"Lists an identity's email allow and block rules, newest first, filterable by `action`, `match_type` and `direction`.",
	},
	'identities.mailContactRules.update': {
		riskLevel: 'write',
		description:
			"Changes an email contact rule's `action` or `direction`, or edits one side with `apply_to`. Requires an admin API key.",
	},
	'identities.phoneContactRules.create': {
		riskLevel: 'write',
		description:
			"Creates a phone allow or block rule for an E.164 number (`match_target`) covering an identity's SMS, calls, iMessage and WhatsApp, optionally per `direction`. Admin API key only.",
	},
	'identities.phoneContactRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a phone contact rule from an identity. Requires an admin API key.',
	},
	'identities.phoneContactRules.get': {
		riskLevel: 'read',
		description:
			'Returns one phone allow or block rule of an identity by `rule_id`.',
	},
	'identities.phoneContactRules.list': {
		riskLevel: 'read',
		description:
			"Lists an identity's phone allow and block rules, newest first, filterable by `action`, `match_type` and `direction`.",
	},
	'identities.phoneContactRules.update': {
		riskLevel: 'write',
		description:
			"Changes a phone contact rule's `action` or `direction`, or edits one side with `apply_to`; the number cannot change. Requires an admin API key.",
	},
	'identities.releasePhoneNumber': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Releases an identity's phone number back to the carrier; it is removed from your account and cannot be reassigned. The identity stays active.",
	},
	'identities.signingKey.createOrRotate': {
		riskLevel: 'destructive',
		description:
			"Creates the identity's webhook signing key, or replaces the existing one so payloads are signed with the new key. The key is returned only once.",
	},
	'identities.signingKey.getStatus': {
		riskLevel: 'read',
		description:
			'Reports whether an identity has a webhook signing key configured and when it was created, without returning the secret.',
	},
	'identities.slackContactRules.create': {
		riskLevel: 'write',
		description:
			'Creates a Slack allow or block rule for an identity matching one Slack user or a whole workspace (`match_type`, `match_target`), optionally per `direction`. Admin API key only.',
	},
	'identities.slackContactRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a Slack contact rule from an identity. Requires an admin API key.',
	},
	'identities.slackContactRules.get': {
		riskLevel: 'read',
		description:
			'Returns one Slack allow or block rule of an identity by `rule_id`.',
	},
	'identities.slackContactRules.list': {
		riskLevel: 'read',
		description:
			"Lists an identity's Slack allow and block rules, filterable by `action`, `match_type` (exact_user or workspace) and `direction`.",
	},
	'identities.slackContactRules.update': {
		riskLevel: 'write',
		description:
			"Changes a Slack contact rule's `action` or `direction`, or edits one side with `apply_to`. Requires an admin API key.",
	},
	'identities.update': {
		riskLevel: 'destructive',
		description:
			"Updates an identity's display name, description, iMessage and WhatsApp reachability, attached iMessage line, and whitelist/blacklist filter modes per channel.",
	},
	'imessage.assignments.list': {
		riskLevel: 'read',
		description:
			'Lists active iMessage connections (one per recipient connected to an agent through the router or connect call), newest first, optionally for one `agent_identity_id`.',
	},
	'imessage.assignments.release': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disconnects a recipient from an agent (`assignment_id`): their messages stop reaching the agent and sends into that conversation fail. Requires an admin API key.',
	},
	'imessage.checkCapability': {
		riskLevel: 'read',
		description:
			'Checks which messaging service (`iMessage`, `SMS` or `RCS`) is currently available for an E.164 phone `number`. Read-only; sends nothing.',
	},
	'imessage.connect': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Connects a recipient (`recipient_number`) to an agent identity over a shared iMessage line, and texts them `first_message` if given. Phone contact rules must allow them.',
	},
	'imessage.contactRules.create': {
		riskLevel: 'write',
		description:
			"Creates an allow or block rule for an E.164 number (`match_target`) on an identity's shared phone list (iMessage, SMS, calls, WhatsApp), optionally per `direction`. Admin API key only.",
	},
	'imessage.contactRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a phone-list contact rule (used for iMessage, SMS, calls and WhatsApp) from an identity. Requires an admin API key.',
	},
	'imessage.contactRules.get': {
		riskLevel: 'read',
		description: 'Returns one iMessage/phone-list contact rule of an identity.',
	},
	'imessage.contactRules.list': {
		riskLevel: 'read',
		description:
			"Lists an identity's iMessage/phone-list allow and block rules, newest first, filterable by `action`, `match_type` and `direction`.",
	},
	'imessage.contactRules.listForOrg': {
		riskLevel: 'read',
		description:
			'Lists iMessage/phone-list contact rules across every identity the key can see, optionally narrowed to one `agent_identity_id`. Requires an admin API key.',
	},
	'imessage.contactRules.update': {
		riskLevel: 'write',
		description:
			"Changes an iMessage/phone-list contact rule's `action` or `direction`, or edits one side with `apply_to`; the number cannot change. Requires an admin API key.",
	},
	'imessage.conversations.get': {
		riskLevel: 'read',
		description:
			'Returns one iMessage 1:1 or group conversation by `conversation_id`, with participants and connection status. Read its messages with `imessage.messages.list`.',
	},
	'imessage.conversations.getThread': {
		riskLevel: 'read',
		description:
			'Returns the messages of one reply thread (`thread_id`) inside an iMessage conversation, paged with `cursor`.',
	},
	'imessage.conversations.list': {
		riskLevel: 'read',
		description:
			'Lists iMessage conversations by most recent message, with latest-message preview and unread count, filterable by identity, participants, contact, date range and groups.',
	},
	'imessage.disconnect': {
		riskLevel: 'write',
		description:
			'Disconnects the active iMessage connection between an agent identity (`agent_identity_id`) and a recipient (`recipient_number`).',
	},
	'imessage.getMediaPlayback': {
		riskLevel: 'read',
		description:
			'Returns an iMessage audio attachment (`media_id`) converted to WAV for browser playback.',
	},
	'imessage.getOnboarding': {
		riskLevel: 'read',
		description:
			'Returns instructions a person follows to connect to an agent over iMessage through the router (the `connect @handle` message and links). Sends nothing.',
	},
	'imessage.getTriageNumber': {
		riskLevel: 'read',
		description:
			'Returns the iMessage router number and the `connect @handle` command, with a tap-to-text link and QR code, for people to reach an agent.',
	},
	'imessage.markRead': {
		riskLevel: 'write',
		description:
			"Marks a conversation's inbound iMessages as read and sends a read receipt the person sees under their latest message.",
	},
	'imessage.messages.get': {
		riskLevel: 'read',
		description:
			'Returns one iMessage message by `message_id`, with its content, sender, direction, service and thread.',
	},
	'imessage.messages.getThread': {
		riskLevel: 'read',
		description:
			'Returns the reply thread containing a message (root and replies), using any message in the thread.',
	},
	'imessage.messages.list': {
		riskLevel: 'read',
		description:
			'Lists iMessage messages, filterable by identity, `conversation_id`, `thread_id`, read and blocked state, groups and date range.',
	},
	'imessage.messages.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Sends an iMessage from an identity to `to` (1 to 8 E.164 numbers; 2 or more is a group) or into `conversation_id`, with `text`, media, optional reply target, send style or voice note.',
	},
	'imessage.numbers.claim': {
		riskLevel: 'destructive',
		description:
			'Claims one unattached dedicated iMessage line for the organization. Requires an admin API key; the plugin sends a fresh `idempotencyKey` unless you pass one.',
	},
	'imessage.numbers.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's dedicated iMessage lines, attached or not, with the identity each is attached to.",
	},
	'imessage.reactions.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Removes a tapback the agent sent (`reaction_id`) from the person's message.",
	},
	'imessage.reactions.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Sends a tapback (`reaction`) on a message a person sent the agent (`message_id`). The agent cannot react to its own messages.',
	},
	'imessage.router.get': {
		riskLevel: 'read',
		description:
			"Returns the organization's own iMessage router line and its settings. Returns 404 when the organization has no router line.",
	},
	'imessage.router.getAvatar': {
		riskLevel: 'read',
		description:
			"Downloads the avatar image of the organization's iMessage router.",
	},
	'imessage.router.getConversation': {
		riskLevel: 'read',
		description:
			"Returns one conversation on the organization's iMessage router line.",
	},
	'imessage.router.listConversations': {
		riskLevel: 'read',
		description:
			"Lists conversations people have had with the organization's iMessage router line.",
	},
	'imessage.router.listMessages': {
		riskLevel: 'read',
		description:
			"Lists the messages of one conversation on the organization's iMessage router line.",
	},
	'imessage.router.update': {
		riskLevel: 'write',
		description:
			"Updates the organization's iMessage router settings: contact card fields, `contact_sharing_enabled`, welcome and help messages, and connect/reconnect reply templates.",
	},
	'imessage.router.updateConnectOnboarding': {
		riskLevel: 'write',
		description:
			"Sets whether the organization's iMessage router sends first-contact onboarding when someone connects (`send_first_contact_onboarding_on_connect`).",
	},
	'imessage.sendTyping': {
		riskLevel: 'write',
		description:
			'Shows a typing indicator to the person in a 1:1 iMessage conversation (`conversation_id`). Groups are not supported.',
	},
	'imessage.uploadMedia': {
		riskLevel: 'write',
		description:
			'Uploads a file (`file`, multipart) and returns a `media_url` to pass in `media_urls` when sending an iMessage.',
	},
	'inbound.checkSignature': {
		riskLevel: 'read',
		description:
			"Tests whether a sample request (`headers`, `body`) passes signature settings (`signature`) or a saved source's settings (`source_id`). Stores nothing.",
	},
	'inbound.events.get': {
		riskLevel: 'read',
		description:
			'Returns one inbound event received by a source, with delivery status, attempts, signature result and the request as received.',
	},
	'inbound.events.list': {
		riskLevel: 'read',
		description:
			'Lists events received by one inbound source, newest first, with delivery status.',
	},
	'inbound.events.replay': {
		riskLevel: 'write',
		description:
			'Delivers an inbound event to the hosted agent again with a new delivery ID and resets its status to pending.',
	},
	'inbound.events.reportResult': {
		riskLevel: 'write',
		description:
			"Reports that the agent could not handle an inbound event delivery (`status` failed, `error`, `delivery_id`) so it can be found and replayed. Needs the identity's own key.",
	},
	'inbound.sources.create': {
		riskLevel: 'write',
		description:
			'Creates an inbound webhook source (`name`) for a hosted agent and returns the URL third parties post events to, with optional `signature` checking and `handler` (agent or script).',
	},
	'inbound.sources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an inbound source and all its events; its URL stops working.',
	},
	'inbound.sources.get': {
		riskLevel: 'read',
		description:
			'Returns one inbound source with its URL, signature settings (without the secret) and handler.',
	},
	'inbound.sources.list': {
		riskLevel: 'read',
		description: "Lists an identity's inbound webhook sources, oldest first.",
	},
	'inbound.sources.rotate': {
		riskLevel: 'destructive',
		description:
			'Issues a new URL for an inbound source; the old URL stops working immediately, so senders must be updated.',
	},
	'inbound.sources.update': {
		riskLevel: 'write',
		description:
			"Updates an inbound source's `name`, `signature` settings (null removes verification) or `handler`. The URL does not change.",
	},
	'mail.drafts.addAttachments': {
		riskLevel: 'write',
		description:
			'Adds `attachments` to a draft in a mailbox at its current `generation`, returning the updated draft and a new generation.',
	},
	'mail.drafts.create': {
		riskLevel: 'write',
		description:
			'Creates an email draft in a mailbox (`email_address`) with optional `recipients`, subject, text/HTML body, attachments, or reply/forward fields. Does not send.',
	},
	'mail.drafts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a draft at the given `generation` permanently and frees its storage. A draft that is being sent cannot be deleted.',
	},
	'mail.drafts.duplicate': {
		riskLevel: 'write',
		description:
			'Copies a draft revision (`generation`) into a new editable draft with a new ID and Message-ID.',
	},
	'mail.drafts.get': {
		riskLevel: 'read',
		description:
			'Returns one draft with its recipients, bodies, attachment descriptors, `generation` and send state.',
	},
	'mail.drafts.getAttachment': {
		riskLevel: 'read',
		description:
			'Downloads one attachment of a draft by `part_index` at a given `generation`.',
	},
	'mail.drafts.list': {
		riskLevel: 'read',
		description: "Lists a mailbox's drafts, most recently updated first.",
	},
	'mail.drafts.removeAttachment': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes one attachment (`part_index`) from a draft at the given `generation`, returning the updated draft.',
	},
	'mail.drafts.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Sends a draft revision (`generation`) as an email to its recipients, applying the mailbox signature at send time. Delivers to outside recipients and cannot be undone.',
	},
	'mail.drafts.update': {
		riskLevel: 'write',
		description:
			'Updates fields of a draft at its current `generation` (recipients, subject, bodies, reply fields); omitted fields are kept and null clears one.',
	},
	'mail.imports.cancel': {
		riskLevel: 'write',
		description:
			'Cancels a pending, queued or running mail import job; messages already imported stay in the mailbox.',
	},
	'mail.imports.create': {
		riskLevel: 'write',
		description:
			'Creates an email import job for a mailbox (MBOX, EML or ZIP via `source_format`) and returns an upload target for the file.',
	},
	'mail.imports.get': {
		riskLevel: 'read',
		description:
			"Returns a mail import job's status and counters (processed, imported, duplicates, failed).",
	},
	'mail.imports.list': {
		riskLevel: 'read',
		description: "Lists a mailbox's email import jobs, newest first.",
	},
	'mail.imports.reissueUploadUrl': {
		riskLevel: 'write',
		description:
			'Issues a fresh upload target for a mail import job whose previous upload URL expired before the file was uploaded.',
	},
	'mail.imports.start': {
		riskLevel: 'write',
		description:
			'Validates the uploaded file and queues a mail import job to run.',
	},
	'mail.listOrgContactRules': {
		riskLevel: 'read',
		description:
			'Lists email contact rules across every identity in the organization, optionally for one `agent_identity_id`, filterable by `action`, `match_type` and `direction`. Admin API key only.',
	},
	'mail.mailboxes.get': {
		riskLevel: 'read',
		description:
			'Returns one mailbox by `email_address`: status, sending domain, filter modes, storage use and signature, optionally with its unread count.',
	},
	'mail.mailboxes.getById': {
		riskLevel: 'read',
		description:
			'Returns one mailbox by its UUID (`mailbox_id`), optionally with its unread count.',
	},
	'mail.mailboxes.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's active mailboxes, newest first, optionally with unread counts.",
	},
	'mail.mailboxes.update': {
		riskLevel: 'write',
		description:
			"Updates a mailbox's contact-rule `filter_mode` and email signature (`signature_html`, `signature_text`, `signature_enabled`). The address cannot change.",
	},
	'mail.messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes one message from a mailbox (`email_address`).',
	},
	'mail.messages.forward': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Forwards a stored message from a mailbox to `recipients` as a new thread, with optional note, extra attachments and original attachments. Sends real email.',
	},
	'mail.messages.get': {
		riskLevel: 'read',
		description:
			'Returns one message from a mailbox (`email_address`) with its full plain-text and HTML body.',
	},
	'mail.messages.getAttachment': {
		riskLevel: 'read',
		description:
			"Returns JSON with a temporary download URL for a message attachment (`filename` as in `attachment_metadata`). Fetch the file from that URL; the plugin never follows Inkbox's redirect, so the API key stays on inkbox.ai.",
	},
	'mail.messages.list': {
		riskLevel: 'read',
		description:
			'Lists messages in one mailbox (`email_address`), newest first, filterable by `direction`, `folder` and date range.',
	},
	'mail.messages.replyAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Replies to every participant of a stored message from a mailbox; recipients are resolved server-side and the reply stays in the thread. Sends real email.',
	},
	'mail.messages.search': {
		riskLevel: 'read',
		description:
			'Searches messages in one mailbox (`email_address`) with full-text query `q`, ranked by relevance then recency.',
	},
	'mail.messages.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Sends an email from a mailbox (`email_address`) to `recipients` (to/cc/bcc) with `subject`, text or HTML body, optional attachments, `reply_to` and threading. Delivers real mail.',
	},
	'mail.messages.updateFlags': {
		riskLevel: 'write',
		description:
			'Marks a message in a mailbox as read/unread (`is_read`) or starred (`is_starred`).',
	},
	'mail.threads.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an email thread and its messages from a mailbox (`email_address`).',
	},
	'mail.threads.get': {
		riskLevel: 'read',
		description:
			"Returns one email thread from a mailbox with its messages' metadata (no bodies).",
	},
	'mail.threads.list': {
		riskLevel: 'read',
		description:
			'Lists email threads in one mailbox (`email_address`) by latest activity, filterable by `folder`, `participants` or `contact_id`.',
	},
	'mail.threads.listFolders': {
		riskLevel: 'read',
		description:
			'Lists the folder names that contain at least one thread in a mailbox.',
	},
	'mail.threads.update': {
		riskLevel: 'write',
		description:
			'Moves an email thread in a mailbox to the `inbox`, `spam` or `archive` `folder`.',
	},
	'mail.visibleMessages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a message by UUID from whichever mailbox visible to the API key holds it.',
	},
	'mail.visibleMessages.get': {
		riskLevel: 'read',
		description:
			'Returns a message by UUID from any mailbox the API key can see, with its delivery status; `max_body_chars` limits body length.',
	},
	'mail.visibleMessages.getAttachment': {
		riskLevel: 'read',
		description:
			'Returns a temporary download URL and metadata for a message attachment (`attachment_ref`), across every mailbox the API key can see.',
	},
	'mail.visibleMessages.list': {
		riskLevel: 'read',
		description:
			'Lists email messages across every mailbox the API key can see, newest first, filterable by `mailbox_id`, `direction`, `folder` and `unread_only`.',
	},
	'mail.visibleMessages.search': {
		riskLevel: 'read',
		description:
			'Searches messages across every mailbox the API key can see with full-text query `q`, optionally narrowed to one `mailbox_id`.',
	},
	'mail.visibleMessages.updateFlags': {
		riskLevel: 'write',
		description:
			'Marks a message read/unread or starred by UUID, across every mailbox the API key can see.',
	},
	'mail.visibleThreads.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an email thread by UUID from whichever mailbox visible to the API key holds it.',
	},
	'mail.visibleThreads.get': {
		riskLevel: 'read',
		description:
			'Returns an email thread by UUID from any mailbox the API key can see, with its messages.',
	},
	'mail.visibleThreads.list': {
		riskLevel: 'read',
		description:
			'Lists email threads across every mailbox the API key can see, filterable by `mailbox_id`, `folder`, `participants` or `contact_id`.',
	},
	'mail.visibleThreads.update': {
		riskLevel: 'write',
		description:
			'Moves an email thread (by UUID, in any mailbox the key can see) to another `folder`.',
	},
	'messageSends.lookup': {
		riskLevel: 'read',
		description:
			'Recovers the message ID of an earlier send (email, SMS, iMessage or WhatsApp) from its idempotency key, `sender_kind`, `sender_id` and `operation`. Read-only; sends nothing.',
	},
	'notes.access.grant': {
		riskLevel: 'write',
		description:
			'Grants an agent identity (`identity_id`) read and edit access to a note.',
	},
	'notes.access.list': {
		riskLevel: 'read',
		description:
			'Lists the agent identities that have been granted access to a note.',
	},
	'notes.access.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Revokes an agent identity's access to a note.",
	},
	'notes.create': {
		riskLevel: 'write',
		description:
			'Creates a note with a `body` and optional `title`; the creator is recorded from the API key.',
	},
	'notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a note. Any caller who can see the note can delete it.',
	},
	'notes.get': {
		riskLevel: 'read',
		description:
			'Returns one note by `note_id`, with its body and access grants.',
	},
	'notes.list': {
		riskLevel: 'read',
		description:
			'Lists notes visible to the caller, with full-text search `q` over title and body, an `identity_id` filter and ordering.',
	},
	'notes.update': {
		riskLevel: 'write',
		description:
			"Updates a note's `title` and/or `body`. Any caller who can see the note can edit it.",
	},
	'organizationDomains.create': {
		riskLevel: 'write',
		description:
			'Starts a DNS ownership claim for a `domain` your organization controls (separate from email sending domains) and returns the TXT record to publish. Requires an admin API key.',
	},
	'organizationDomains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Releases an organization domain claim (`claim_id`), freeing a slot in the 10-domain limit. Requires an admin API key.',
	},
	'organizationDomains.get': {
		riskLevel: 'read',
		description:
			'Returns one organization domain claim with its verification state, DNS record and validity dates.',
	},
	'organizationDomains.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's domain ownership claims (verified domains shown to A2A peers). Requires an admin API key.",
	},
	'organizationDomains.verify': {
		riskLevel: 'write',
		description:
			'Checks the DNS record for an organization domain claim now and returns the resulting state, which may still be pending.',
	},
	'phone.calls.get': {
		riskLevel: 'read',
		description:
			'Returns one phone call by `call_id` (dedicated number or iMessage line), with status, direction, mode, voicemail handling and post-call action items.',
	},
	'phone.calls.getSettings': {
		riskLevel: 'read',
		description:
			"Returns an identity's effective call settings: incoming call action, whether a WebSocket or webhook is configured, forwarding target and Voice AI setup.",
	},
	'phone.calls.hangup': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Ends a live phone call by `call_id` from outside the call, including Inkbox Voice AI calls.',
	},
	'phone.calls.list': {
		riskLevel: 'read',
		description:
			'Lists phone calls for an agent identity, newest first, across its dedicated number and iMessage lines, filterable by blocked state and date range.',
	},
	'phone.calls.listMcpActivity': {
		riskLevel: 'read',
		description:
			'Lists the remote MCP tool calls an Inkbox Voice AI agent made during a call. `phone.calls.listToolInvocations` also covers built-in tools.',
	},
	'phone.calls.listToolInvocations': {
		riskLevel: 'read',
		description:
			"Lists a call's built-in and remote MCP tool activity by the Inkbox Voice AI agent, in execution order.",
	},
	'phone.calls.listTranscripts': {
		riskLevel: 'read',
		description:
			'Lists the transcript segments of a call in order, with speaker (`party`) and timestamps.',
	},
	'phone.calls.place': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Places an outbound phone call to `to_number`, bridged to your `client_websocket_url` or run by Inkbox Voice AI (`mode`). Rings a real phone and uses call minutes.',
	},
	'phone.incomingCallAction.get': {
		riskLevel: 'read',
		description:
			'Returns how an identity handles incoming calls (auto-accept to a WebSocket, reject, webhook, Voice AI or forward) and the related URLs or forwarding target.',
	},
	'phone.incomingCallAction.set': {
		riskLevel: 'write',
		description:
			'Sets how an identity handles incoming calls (`incoming_call_action`) with its `client_websocket_url`, `incoming_call_webhook_url` or forwarding target.',
	},
	'phone.listOrgContactRules': {
		riskLevel: 'read',
		description:
			'Lists phone contact rules across every identity in the organization, optionally for one `agent_identity_id`, filterable by `action` and `direction`. Requires an admin API key.',
	},
	'phone.media.getPlayback': {
		riskLevel: 'read',
		description:
			'Returns an audio attachment from a text message (`media_id`) converted for browser playback.',
	},
	'phone.numbers.get': {
		riskLevel: 'read',
		description:
			'Returns one phone number with its SMS readiness (`sms_status`) and incoming-call configuration.',
	},
	'phone.numbers.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's phone numbers with SMS readiness and incoming-call settings.",
	},
	'phone.numbers.provision': {
		riskLevel: 'destructive',
		description:
			'Provisions a new local phone number from carrier inventory (optional US `state`) and assigns it to an identity (`agent_handle`). Returns 429 once the organization reaches its active-number cap.',
	},
	'phone.numbers.release': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Releases a phone number back to the carrier and removes it from your organization. It cannot be recovered.',
	},
	'phone.numbers.searchTranscripts': {
		riskLevel: 'read',
		description:
			'Searches call transcript segments for one phone number with full-text query `q`, optionally by `party` (local or remote).',
	},
	'phone.numbers.update': {
		riskLevel: 'write',
		description:
			"Updates a phone number's incoming-call handling (`incoming_call_action`, WebSocket, webhook or forwarding target) and contact-rule `filter_mode`.",
	},
	'phone.smsOptIns.get': {
		riskLevel: 'read',
		description:
			'Returns the SMS consent state (opted in or out, and source) for one recipient number in your organization.',
	},
	'phone.smsOptIns.list': {
		riskLevel: 'read',
		description:
			'Lists SMS consent records for your organization, most recently updated first, optionally by `status`.',
	},
	'phone.smsOptIns.optIn': {
		riskLevel: 'write',
		description:
			'Marks a recipient number as opted in to SMS from your organization, after you collected consent yourself. This overrides an earlier STOP.',
	},
	'phone.smsOptIns.optOut': {
		riskLevel: 'write',
		description:
			'Marks a recipient number as opted out, so further texts to it from your organization are refused.',
	},
	'phone.textConversations.get': {
		riskLevel: 'read',
		description:
			'Returns the messages of one SMS/MMS conversation on a phone number, newest first; `key` is the conversation UUID or, for 1:1, the remote number.',
	},
	'phone.textConversations.list': {
		riskLevel: 'read',
		description:
			'Lists SMS/MMS conversations on a phone number by most recent message, with previews and unread counts; groups only with `include_groups`.',
	},
	'phone.textConversations.update': {
		riskLevel: 'write',
		description:
			'Marks all messages in an SMS/MMS conversation on a phone number as read or unread (`is_read`).',
	},
	'phone.textConversations.updateById': {
		riskLevel: 'write',
		description:
			'Marks all messages in an SMS/MMS conversation (by `conversation_id`) as read or unread (`is_read`).',
	},
	'phone.texts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes one SMS/MMS message by `message_id`.',
	},
	'phone.texts.get': {
		riskLevel: 'read',
		description:
			'Returns one SMS/MMS message on a phone number, with delivery status and media.',
	},
	'phone.texts.list': {
		riskLevel: 'read',
		description:
			'Lists SMS/MMS messages on a phone number, newest first, filterable by read and blocked state and date range.',
	},
	'phone.texts.search': {
		riskLevel: 'read',
		description:
			'Searches SMS/MMS message bodies on a phone number with full-text query `q`, ranked by relevance.',
	},
	'phone.texts.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Sends an SMS, or MMS with `media_urls`, from a phone number to `to` (1 to 8 numbers; 2 or more is a group) or into `conversation_id`. Texts real phones and uses SMS allowance.',
	},
	'phone.texts.update': {
		riskLevel: 'destructive',
		description:
			'Marks an SMS/MMS message read or unread (`is_read`), or deletes it (`status: deleted`).',
	},
	'slack.actions.get': {
		riskLevel: 'read',
		description:
			'Returns the recorded result of a Slack message send (`action_id`): status, conversation, message timestamp or error. Does not contact Slack.',
	},
	'slack.actions.getByKey': {
		riskLevel: 'read',
		description:
			'Looks up a Slack message send by the idempotency key it was sent with, to check whether a timed-out send went through without sending again.',
	},
	'slack.applications.getRemoval': {
		riskLevel: 'read',
		description:
			'Returns the progress of a Slack app removal (`operation_id`), including whether the app was deleted from Slack.',
	},
	'slack.applications.prepare': {
		riskLevel: 'write',
		description:
			"Starts creating the identity's dedicated Slack app in a saved provisioning workspace (`identity_id`, `provisioning_workspace_id`). Runs in the background; repeat calls reuse it.",
	},
	'slack.applications.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Removes an identity's Slack app from Inkbox and tries to delete it from Slack (`expected_application_generation`, `request_id`); its connection and history become inaccessible. Admin key.",
	},
	'slack.archive.backfill': {
		riskLevel: 'write',
		description:
			"Imports accessible past Slack history for one conversation (`conversation_id`) or thread (`thread_ts`) into a connection's retained archive.",
	},
	'slack.archive.getCoverage': {
		riskLevel: 'read',
		description:
			"Shows which Slack conversations and threads a connection's archive has imported history for, and how far back.",
	},
	'slack.archive.getSettings': {
		riskLevel: 'read',
		description:
			"Returns the retention period (`retention_days`; null means no age limit) for a Slack connection's retained message archive.",
	},
	'slack.archive.listMessages': {
		riskLevel: 'read',
		description:
			"Lists retained Slack messages from a connection's archive, newest first, by conversation, thread or timestamp range, with optional cached sender, reaction and file details.",
	},
	'slack.archive.purge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes all retained Slack messages in a connection's archive and cannot be undone; new messages keep being captured. Requires an admin API key.",
	},
	'slack.archive.search': {
		riskLevel: 'read',
		description:
			"Searches retained Slack messages in one connection's archive by keyword (`q`), optionally by conversation, user or time range. Not semantic search.",
	},
	'slack.archive.updateSettings': {
		riskLevel: 'destructive',
		description:
			'Sets how many days a Slack connection keeps retained messages (`retention_days`; null for no limit); shortening it schedules older messages for deletion. Admin API key only.',
	},
	'slack.connections.disconnect': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disconnects a Slack workspace connection from its identity; live Slack operations stop. Requires an admin API key.',
	},
	'slack.connections.getCapabilities': {
		riskLevel: 'read',
		description:
			"Returns a Slack connection's granted and missing scopes, the features they enable, native status and task-streaming support, and the upload size limit.",
	},
	'slack.connections.importContacts': {
		riskLevel: 'write',
		description:
			'Imports Slack users the connection can see (workspace directory, DMs, shared channels, or one `conversation_id`) as Inkbox contacts, one page per call. Requires an admin API key.',
	},
	'slack.connections.list': {
		riskLevel: 'read',
		description:
			"Lists an identity's Slack workspace connections (`identity_id`) with status, scopes, and app setup and installation state.",
	},
	'slack.connections.listAvailable': {
		riskLevel: 'read',
		description:
			'Lists connected Slack workspaces across the organization, optionally for one `identity_id`, from saved metadata. Requires an admin API key.',
	},
	'slack.conversations.get': {
		riskLevel: 'read',
		description:
			'Returns one Slack channel, DM or group DM (`conversation_id`) visible to the connection.',
	},
	'slack.conversations.join': {
		riskLevel: 'write',
		description:
			"Makes the identity's Slack bot join a public channel (`conversation_id`).",
	},
	'slack.conversations.leave': {
		riskLevel: 'write',
		description:
			"Makes the identity's Slack bot leave a channel (`conversation_id`).",
	},
	'slack.conversations.list': {
		riskLevel: 'read',
		description:
			'Lists Slack conversations the bot is a member of through a connection, including Slack Connect channels; `include_unjoined` adds channels it has not joined.',
	},
	'slack.conversations.listMembers': {
		riskLevel: 'read',
		description: 'Lists the member user IDs of a Slack conversation.',
	},
	'slack.conversations.open': {
		riskLevel: 'write',
		description:
			'Opens or resumes a Slack DM or group DM with `user_ids` and returns the conversation. Sends no message.',
	},
	'slack.conversations.setProcessingStatus': {
		riskLevel: 'write',
		description:
			"Sets Slack's native agent status (`status`: active, processing, suspended or closed) on a thread (`thread_ts`). Not a message; fails where unsupported.",
	},
	'slack.files.download': {
		riskLevel: 'read',
		description:
			'Downloads the bytes of a Slack file (`file_id`) through a connection.',
	},
	'slack.files.get': {
		riskLevel: 'read',
		description:
			'Returns metadata for a Slack file (`file_id`): name, title, MIME type, size and whether it can be downloaded.',
	},
	'slack.files.getPreview': {
		riskLevel: 'read',
		description:
			'Downloads a cached preview image of a Slack file, when one has been captured.',
	},
	'slack.files.upload': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Uploads a file (`filename`, `content_base64`) to a Slack conversation, optionally in a thread with an `initial_comment`. Posts to Slack.',
	},
	'slack.getCachedMedia': {
		riskLevel: 'read',
		description:
			'Downloads a cached Slack display image: a user or bot avatar or a custom emoji (`kind`, `resource_id`).',
	},
	'slack.installations.start': {
		riskLevel: 'write',
		description:
			"Returns a Slack `authorization_url` to open in a browser to install or reconnect the identity's Slack app in a workspace.",
	},
	'slack.listEmoji': {
		riskLevel: 'read',
		description:
			"Lists a Slack workspace's cached custom emoji, optionally filtered by name `q`.",
	},
	'slack.listOrgContactRules': {
		riskLevel: 'read',
		description:
			'Lists Slack contact rules across every identity in the organization, optionally for one `agent_identity_id`, filterable by `action`, `match_type` and `direction`.',
	},
	'slack.messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a bot message (`message_ts`) from a Slack conversation; other users' messages cannot be deleted.",
	},
	'slack.messages.get': {
		riskLevel: 'read',
		description:
			'Returns one Slack message (`message_ts`) from a conversation, under the same permission and retained-history rules as `slack.messages.list`; pass `thread_ts` for a reply.',
	},
	'slack.messages.getContext': {
		riskLevel: 'read',
		description:
			'Returns the Slack messages around one message (`message_ts`), in its conversation or thread, up to 15 per side.',
	},
	'slack.messages.getPermalink': {
		riskLevel: 'read',
		description:
			'Returns a Slack permalink URL for a message. The link does not grant its recipient access to the conversation.',
	},
	'slack.messages.list': {
		riskLevel: 'read',
		description:
			"Reads a Slack conversation's history, or a thread's replies with `thread_ts`: live from Slack with current read permission, otherwise only previously retained messages.",
	},
	'slack.messages.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Posts a message (`text`) as the identity's Slack bot to a conversation, optionally in a thread (`thread_ts`) or as a voice note. Pass `idempotencyKey` to make a retry safe; otherwise the plugin sends a fresh one.",
	},
	'slack.messages.update': {
		riskLevel: 'write',
		description:
			"Edits the `text` of a bot message in a Slack conversation; other users' messages cannot be edited.",
	},
	'slack.operations.get': {
		riskLevel: 'read',
		description:
			'Returns the result of a Slack operation (edit, delete, reaction, pin, join, file upload, task stream) by `operation_id`.',
	},
	'slack.operations.getByKey': {
		riskLevel: 'read',
		description:
			'Looks up a Slack operation (edit, reaction, pin, file upload, task stream) by its idempotency key, to check a timed-out request without repeating it.',
	},
	'slack.pins.add': {
		riskLevel: 'write',
		description: 'Pins a message (`message_ts`) in a Slack conversation.',
	},
	'slack.pins.list': {
		riskLevel: 'read',
		description: 'Lists the pinned items in a Slack conversation.',
	},
	'slack.pins.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Unpins a message (`message_ts`) in a Slack conversation.',
	},
	'slack.provisioningWorkspaces.list': {
		riskLevel: 'read',
		description:
			'Lists the Slack workspaces saved for creating identity apps, with their saved-record `id` (not the Slack workspace ID).',
	},
	'slack.provisioningWorkspaces.save': {
		riskLevel: 'write',
		description:
			"Saves a Slack workspace's app-configuration tokens (`access_token`, `refresh_token`) so Inkbox can create identity apps there. Tokens are never returned.",
	},
	'slack.reactions.add': {
		riskLevel: 'write',
		description:
			'Adds an emoji reaction (`name`) from the bot to a Slack message.',
	},
	'slack.reactions.list': {
		riskLevel: 'read',
		description:
			'Lists the emoji reactions on a Slack message, with counts and reacting users.',
	},
	'slack.reactions.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Removes the bot's emoji reaction (`name`) from a Slack message.",
	},
	'slack.search': {
		riskLevel: 'read',
		description:
			'Searches retained Slack messages by keyword (`q`) across all workspace connections of one identity, optionally narrowed by connection, conversation, user or time.',
	},
	'slack.streams.append': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Adds task-update `chunks` to an open Slack task stream (`stream_id`) to show progress in a thread.',
	},
	'slack.streams.start': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Starts a native Slack task stream in a thread (`thread_ts`) for a recipient user, with initial task-update `chunks`, to show work progress. Does not start any work.',
	},
	'slack.streams.stop': {
		riskLevel: 'write',
		description:
			'Closes a Slack task stream (`stream_id`), optionally with final task-update `chunks`.',
	},
	'slack.users.get': {
		riskLevel: 'read',
		description:
			"Returns one Slack user's profile (`user_id`) through a connection.",
	},
	'slack.users.list': {
		riskLevel: 'read',
		description:
			'Lists users in the connected Slack workspace, paged with `cursor`.',
	},
	'tunnels.get': {
		riskLevel: 'read',
		description:
			'Returns one tunnel by `tunnel_id`, with its public host, TLS mode, certificate details and whether it is connected right now.',
	},
	'tunnels.list': {
		riskLevel: 'read',
		description:
			'Lists all tunnels in the organization, each with its public host and whether it is connected right now.',
	},
	'tunnels.signCsr': {
		riskLevel: 'write',
		description:
			'Signs a certificate signing request (`csr_pem`, CN = tunnel hostname) for a passthrough-TLS tunnel and returns the certificate and chain.',
	},
	'tunnels.update': {
		riskLevel: 'write',
		description:
			"Updates a tunnel's free-form `metadata` (null or {} clears it). The tunnel name and TLS mode cannot change.",
	},
	'vault.getInfo': {
		riskLevel: 'read',
		description:
			"Returns metadata about the organization's vault: ID, key count, secret count and recovery key count. No secret material.",
	},
	'vault.getUnlockBundle': {
		riskLevel: 'read',
		description:
			"Returns the vault's wrapped encryption keys and all encrypted secrets for client-side decryption. Inkbox only stores ciphertext; decrypt locally with the SDK or CLI.",
	},
	'vault.initialize': {
		riskLevel: 'destructive',
		description:
			"Creates the organization's zero-knowledge vault from client-generated key material (`vault_key`, exactly four `recovery_keys`). Use the SDK or CLI to generate it.",
	},
	'vault.keys.list': {
		riskLevel: 'read',
		description:
			"Lists the vault's keys (primary and recovery) as metadata only, optionally filtered by `type`. No wrapped key material.",
	},
	'vault.keys.updatePrimary': {
		riskLevel: 'destructive',
		description:
			"Replaces the vault's primary key with a new wrapped key (`wrapped_org_encryption_key`, `auth_hash`), proven by the current key or a recovery code, which is then used up.",
	},
	'vault.secrets.create': {
		riskLevel: 'write',
		description:
			'Stores a new vault secret: plaintext `name`, `description` and `secret_type`, plus an `encrypted_payload` encrypted client-side. Inkbox cannot read the payload.',
	},
	'vault.secrets.get': {
		riskLevel: 'read',
		description:
			'Returns one vault secret with its access rules and client-side encrypted `encrypted_payload` (ciphertext); decrypt it locally with the vault key.',
	},
	'vault.secrets.grantAccess': {
		riskLevel: 'write',
		description:
			'Grants an agent identity (`identity_id`) access to one vault secret. Requires an admin API key.',
	},
	'vault.secrets.list': {
		riskLevel: 'read',
		description:
			'Lists vault secrets (names, types, descriptions, access) without their encrypted payloads, optionally filtered by `secret_type`.',
	},
	'vault.secrets.listAccess': {
		riskLevel: 'read',
		description:
			'Lists the agent identities that have access to one vault secret.',
	},
	'vault.secrets.revokeAccess': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Revokes an agent identity's access to one vault secret.",
	},
	'vault.secrets.update': {
		riskLevel: 'write',
		description:
			"Updates a vault secret's `name`, `description` or `encrypted_payload` (new ciphertext encrypted client-side). Only supplied fields change.",
	},
	'voiceAgent.getConfig': {
		riskLevel: 'read',
		description:
			"Returns an identity's Inkbox Voice AI settings: voice, instructions, effective voice and model, and authority mode.",
	},
	'voiceAgent.listVoices': {
		riskLevel: 'read',
		description:
			'Lists the voices available for Inkbox Voice AI calls and the default voice.',
	},
	'voiceAgent.mcpServers.cancelAuthorization': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancels an unfinished OAuth approval (`transaction_id`) for a Voice AI MCP server connection.',
	},
	'voiceAgent.mcpServers.create': {
		riskLevel: 'write',
		description:
			"Adds a remote MCP server (`label`, `url`, `transport`, `auth`) whose tools an identity's Voice AI agent can use on calls, optionally limited to `allowed_tools`.",
	},
	'voiceAgent.mcpServers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a Voice AI MCP server connection; new calls can no longer use its tools.',
	},
	'voiceAgent.mcpServers.disconnect': {
		riskLevel: 'write',
		description:
			'Disconnects the OAuth account from a Voice AI MCP server connection (`expected_version`), keeping its other settings.',
	},
	'voiceAgent.mcpServers.get': {
		riskLevel: 'read',
		description:
			'Returns one Voice AI MCP server connection with its settings, auth state, preparation status and health.',
	},
	'voiceAgent.mcpServers.getAuthorization': {
		riskLevel: 'read',
		description:
			'Returns the status of an OAuth approval for a Voice AI MCP server connection, with its `connect_url` and requested scopes.',
	},
	'voiceAgent.mcpServers.getCatalog': {
		riskLevel: 'read',
		description:
			'Lists the tools, prompts, resources and skills a Voice AI MCP server connection exposes.',
	},
	'voiceAgent.mcpServers.list': {
		riskLevel: 'read',
		description:
			"Lists the remote MCP server connections of an identity's Voice AI agent.",
	},
	'voiceAgent.mcpServers.refresh': {
		riskLevel: 'write',
		description:
			"Queues a refresh of a Voice AI MCP server connection's tool catalog.",
	},
	'voiceAgent.mcpServers.startAuthorization': {
		riskLevel: 'write',
		description:
			'Starts OAuth for a Voice AI MCP server connection (`expected_version`) and returns a `connect_url` a person must open to approve access.',
	},
	'voiceAgent.mcpServers.test': {
		riskLevel: 'read',
		description:
			'Tests that a Voice AI MCP server connection can be reached and its tools discovered, without running any tool.',
	},
	'voiceAgent.mcpServers.update': {
		riskLevel: 'write',
		description:
			'Updates a Voice AI MCP server connection (`label`, `url`, `auth`, `enabled`, `allowed_tools`, `context`), given its `expected_version`.',
	},
	'voiceAgent.setAuthorityMode': {
		riskLevel: 'write',
		description:
			"Sets what an identity's Voice AI agent can access on calls (`authority_mode`): `contact_scoped` (the caller only) or `yolo` (all the identity's contacts and messages).",
	},
	'voiceAgent.setConfig': {
		riskLevel: 'write',
		description:
			"Replaces an identity's Voice AI `voice` and `instructions`; omitted fields reset to platform defaults. The authority mode is unchanged.",
	},
	'webhooks.deliveries.list': {
		riskLevel: 'read',
		description:
			'Lists logged webhook delivery attempts, newest first, filterable by identity, subscription, phone number, `event_type` and `success`.',
	},
	'webhooks.deliveries.replay': {
		riskLevel: 'write',
		description:
			"Re-sends a logged webhook event to its subscription's current URL and auth token, recording a new delivery.",
	},
	'webhooks.getCatalog': {
		riskLevel: 'read',
		description:
			'Lists the webhook event types you can subscribe to, with example signature headers.',
	},
	'webhooks.subscriptions.create': {
		riskLevel: 'write',
		description:
			"Subscribes a `url` to webhook `event_types` (mail, SMS, calls, iMessage and more) for an identity, mailbox or phone number. Returns the identity's signing key once if new.",
	},
	'webhooks.subscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a webhook subscription, stopping all its event notifications.',
	},
	'webhooks.subscriptions.get': {
		riskLevel: 'read',
		description:
			'Returns one webhook subscription with its URL, event types and status.',
	},
	'webhooks.subscriptions.list': {
		riskLevel: 'read',
		description:
			'Lists active webhook subscriptions, newest first, filterable by identity, mailbox, phone number, `url` or `event_type`.',
	},
	'webhooks.subscriptions.update': {
		riskLevel: 'write',
		description:
			"Updates a webhook subscription's `url`, `event_types` (replaces the whole selection), `context_config` or `auth_token`.",
	},
	'whatsapp.assignments.list': {
		riskLevel: 'read',
		description:
			'Lists active WhatsApp connections (one per recipient connected to an agent through a shared number or the router), newest first, optionally for one `agent_identity_id`.',
	},
	'whatsapp.assignments.release': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disconnects a recipient from an agent over WhatsApp (`assignment_id`): their messages stop reaching the agent and sends fail. Requires an admin API key.',
	},
	'whatsapp.connect': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Reserves a shared WhatsApp number linking a recipient (`recipient_number`) to an agent identity without sending anything; the agent can reply once they message it. Admin API key only.',
	},
	'whatsapp.conversations.get': {
		riskLevel: 'read',
		description:
			'Returns one WhatsApp 1:1 or group conversation by `conversation_id`, with participants and connection status.',
	},
	'whatsapp.conversations.getThread': {
		riskLevel: 'read',
		description:
			'Returns the messages of one reply thread (`thread_id`) inside a WhatsApp conversation, paged with `cursor`.',
	},
	'whatsapp.conversations.list': {
		riskLevel: 'read',
		description:
			'Lists WhatsApp conversations by most recent message, filterable by identity, participants, contact, blocked state, groups and date range.',
	},
	'whatsapp.disconnect': {
		riskLevel: 'write',
		description:
			'Disconnects the active WhatsApp connection between an agent identity (`agent_identity_id`) and a recipient (`recipient_number`). Requires an admin API key.',
	},
	'whatsapp.getLimits': {
		riskLevel: 'read',
		description:
			"Returns an agent's effective WhatsApp limits (such as media size and opening-message rules) and usage counters for the rolling 24 hours.",
	},
	'whatsapp.getOnboarding': {
		riskLevel: 'read',
		description:
			'Returns instructions a person follows to reach an agent on WhatsApp (connect command, links and QR codes) and whether the channel is ready. Sends nothing.',
	},
	'whatsapp.getTriageNumber': {
		riskLevel: 'read',
		description:
			'Returns the WhatsApp router number and the `connect @handle` command, with a tap link and QR code, for people to reach an agent.',
	},
	'whatsapp.markRead': {
		riskLevel: 'write',
		description:
			"Marks a WhatsApp conversation's inbound messages as read, optionally only up to `through_message_id`, and sends read receipts the person can see.",
	},
	'whatsapp.media.get': {
		riskLevel: 'read',
		description:
			'Returns metadata and a fresh temporary download URL for a WhatsApp media item (`media_id`), including any audio transcription.',
	},
	'whatsapp.media.getPlayback': {
		riskLevel: 'read',
		description:
			'Returns a WhatsApp audio attachment (`media_id`) converted for browser playback.',
	},
	'whatsapp.media.upload': {
		riskLevel: 'write',
		description:
			'Uploads a file (`file`, multipart) for an agent and returns a media ID to send in `media_ids`; pass `recipient_number` when replying through a shared number.',
	},
	'whatsapp.messages.get': {
		riskLevel: 'read',
		description:
			'Returns one WhatsApp message by `message_id`, with sender, direction, participants and mentions.',
	},
	'whatsapp.messages.getThread': {
		riskLevel: 'read',
		description:
			'Returns the reply thread containing a WhatsApp message (root and replies), using any message in the thread.',
	},
	'whatsapp.messages.list': {
		riskLevel: 'read',
		description:
			'Lists WhatsApp messages, filterable by identity, `conversation_id`, `thread_id`, read and blocked state, groups and date range.',
	},
	'whatsapp.messages.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Sends a WhatsApp message from an identity to one E.164 number (`to`) or into `conversation_id`, with `text`, media, a reply target or a voice note. Usually allowed only after the person messaged first.',
	},
	'whatsapp.numbers.assign': {
		riskLevel: 'write',
		description:
			'Attaches a dedicated WhatsApp number (`account_id`) to an agent (`agent_identity_id`), or detaches it with null, given `expected_revision`. Requires an admin API key.',
	},
	'whatsapp.numbers.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's dedicated WhatsApp numbers with the agent each is assigned to, 100 per page. Requires an admin API key.",
	},
	'whatsapp.reactions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Removes a WhatsApp reaction the agent sent (`reaction_id`).',
	},
	'whatsapp.reactions.get': {
		riskLevel: 'read',
		description: 'Returns one WhatsApp reaction by `reaction_id`.',
	},
	'whatsapp.reactions.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Sends an emoji reaction (`reaction` or `custom_emoji`) on a WhatsApp message a person sent (`message_id`).',
	},
	'whatsapp.router.get': {
		riskLevel: 'read',
		description:
			"Returns the organization's own WhatsApp router (number, revision, profile name, whether it accepts new connections), or null if it has none. Requires an admin API key.",
	},
	'whatsapp.router.listConversations': {
		riskLevel: 'read',
		description:
			"Lists conversations on the organization's own WhatsApp router, newest first. Requires an admin API key.",
	},
	'whatsapp.router.listMessages': {
		riskLevel: 'read',
		description:
			"Lists messages exchanged with one person (`remote_number`) on the organization's WhatsApp router, newest first. Requires an admin API key.",
	},
	'whatsapp.router.update': {
		riskLevel: 'write',
		description:
			"Updates the organization's WhatsApp router `profile_display_name` or `accepting_new_connections`, given `expected_router_id` and `expected_revision`. Admin API key only.",
	},
	'whatsapp.sendTyping': {
		riskLevel: 'write',
		description:
			'Shows a typing indicator to the person in a WhatsApp conversation (`conversation_id`); returns 409 where unsupported.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof inkboxEndpointsNested>;
