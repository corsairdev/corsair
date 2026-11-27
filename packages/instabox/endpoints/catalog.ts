// Generated with endpoints/operation-types.ts from Instabox's OpenAPI spec:
// one entry per operation in instabox-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { instaboxSchemaEntry } from './openapi-schema';
import { createInstaboxOperation as op } from './operations';

export const instaboxEndpointsNested = {
	exports: {
		download: op('exports.download'),
		get: op('exports.get'),
	},
	feedback: {
		send: op('feedback.send'),
	},
	gpuQueue: {
		cancel: op('gpuQueue.cancel'),
		list: op('gpuQueue.list'),
	},
	keys: {
		create: op('keys.create'),
		list: op('keys.list'),
		revoke: op('keys.revoke'),
	},
	machines: {
		activityLeases: {
			release: op('machines.activityLeases.release'),
			renew: op('machines.activityLeases.renew'),
		},
		claimOomKill: op('machines.claimOomKill'),
		connectionInfo: op('machines.connectionInfo'),
		create: op('machines.create'),
		createAccess: op('machines.createAccess'),
		createSnapshot: op('machines.createSnapshot'),
		delete: op('machines.delete'),
		desktop: {
			createLink: op('machines.desktop.createLink'),
			get: op('machines.desktop.get'),
			revokeLinks: op('machines.desktop.revokeLinks'),
		},
		disk: op('machines.disk'),
		exec: op('machines.exec'),
		files: {
			createUploadUrl: op('machines.files.createUploadUrl'),
			download: op('machines.files.download'),
			read: op('machines.files.read'),
			write: op('machines.files.write'),
		},
		fork: op('machines.fork'),
		get: op('machines.get'),
		history: {
			get: op('machines.history.get'),
			list: op('machines.history.list'),
		},
		list: op('machines.list'),
		logs: op('machines.logs'),
		metrics: op('machines.metrics'),
		ports: {
			create: op('machines.ports.create'),
			delete: op('machines.ports.delete'),
			installAgent: op('machines.ports.installAgent'),
			list: op('machines.ports.list'),
		},
		processes: op('machines.processes'),
		restore: op('machines.restore'),
		resume: op('machines.resume'),
		secrets: {
			get: op('machines.secrets.get'),
			refresh: op('machines.secrets.refresh'),
			update: op('machines.secrets.update'),
		},
		ssh: {
			createToken: op('machines.ssh.createToken'),
			issueCertificate: op('machines.ssh.issueCertificate'),
			listTokens: op('machines.ssh.listTokens'),
			revokeAllTokens: op('machines.ssh.revokeAllTokens'),
			revokeToken: op('machines.ssh.revokeToken'),
		},
		start: op('machines.start'),
		stop: op('machines.stop'),
		suspend: op('machines.suspend'),
		update: op('machines.update'),
		usage: op('machines.usage'),
		vault: {
			get: op('machines.vault.get'),
			write: op('machines.vault.write'),
		},
		wake: op('machines.wake'),
	},
	me: {
		discord: {
			get: op('me.discord.get'),
			unlink: op('me.discord.unlink'),
		},
		get: op('me.get'),
	},
	operations: {
		get: op('operations.get'),
	},
	orgs: {
		billing: {
			cancelSubscription: op('orgs.billing.cancelSubscription'),
			changePlan: op('orgs.billing.changePlan'),
			checkout: op('orgs.billing.checkout'),
			getTopup: op('orgs.billing.getTopup'),
			movePersonal: op('orgs.billing.movePersonal'),
			portal: op('orgs.billing.portal'),
			resumeSubscription: op('orgs.billing.resumeSubscription'),
			subscribeWithCredits: op('orgs.billing.subscribeWithCredits'),
			topup: op('orgs.billing.topup'),
			update: op('orgs.billing.update'),
		},
		create: op('orgs.create'),
		delete: op('orgs.delete'),
		exports: {
			create: op('orgs.exports.create'),
			list: op('orgs.exports.list'),
		},
		get: op('orgs.get'),
		github: {
			installations: {
				delete: op('orgs.github.installations.delete'),
				list: op('orgs.github.installations.list'),
			},
			jobs: {
				get: op('orgs.github.jobs.get'),
				list: op('orgs.github.jobs.list'),
			},
			stats: op('orgs.github.stats'),
		},
		inviteCode: {
			get: op('orgs.inviteCode.get'),
			regenerate: op('orgs.inviteCode.regenerate'),
		},
		invites: {
			create: op('orgs.invites.create'),
			list: op('orgs.invites.list'),
			resend: op('orgs.invites.resend'),
			revoke: op('orgs.invites.revoke'),
		},
		keys: {
			create: op('orgs.keys.create'),
			list: op('orgs.keys.list'),
			revoke: op('orgs.keys.revoke'),
		},
		list: op('orgs.list'),
		members: {
			changeRole: op('orgs.members.changeRole'),
			list: op('orgs.members.list'),
			remove: op('orgs.members.remove'),
		},
		movePersonal: op('orgs.movePersonal'),
		redeemInvite: op('orgs.redeemInvite'),
		secrets: {
			delete: op('orgs.secrets.delete'),
			import: op('orgs.secrets.import'),
			list: op('orgs.secrets.list'),
			set: op('orgs.secrets.set'),
		},
		update: op('orgs.update'),
		webhooks: {
			create: op('orgs.webhooks.create'),
			delete: op('orgs.webhooks.delete'),
			deliveries: {
				list: op('orgs.webhooks.deliveries.list'),
				retry: op('orgs.webhooks.deliveries.retry'),
			},
			get: op('orgs.webhooks.get'),
			list: op('orgs.webhooks.list'),
			rotate: op('orgs.webhooks.rotate'),
			test: op('orgs.webhooks.test'),
			update: op('orgs.webhooks.update'),
		},
	},
	ports: {
		list: op('ports.list'),
	},
	sessions: {
		list: op('sessions.list'),
		signOut: op('sessions.signOut'),
	},
	snapshots: {
		delete: op('snapshots.delete'),
		files: {
			list: op('snapshots.files.list'),
		},
		get: op('snapshots.get'),
		list: op('snapshots.list'),
	},
	stats: {
		get: op('stats.get'),
	},
	support: {
		tickets: {
			close: op('support.tickets.close'),
			get: op('support.tickets.get'),
			list: op('support.tickets.list'),
			reply: op('support.tickets.reply'),
		},
	},
	templates: {
		list: op('templates.list'),
	},
	usage: {
		get: op('usage.get'),
		machines: op('usage.machines'),
	},
	vault: {
		delete: op('vault.delete'),
		export: op('vault.export'),
		import: op('vault.import'),
		list: op('vault.list'),
		set: op('vault.set'),
		update: op('vault.update'),
	},
} as const;

export const instaboxEndpointSchemas = {
	'exports.download': instaboxSchemaEntry('exports.download'),
	'exports.get': instaboxSchemaEntry('exports.get'),
	'feedback.send': instaboxSchemaEntry('feedback.send'),
	'gpuQueue.cancel': instaboxSchemaEntry('gpuQueue.cancel'),
	'gpuQueue.list': instaboxSchemaEntry('gpuQueue.list'),
	'keys.create': instaboxSchemaEntry('keys.create'),
	'keys.list': instaboxSchemaEntry('keys.list'),
	'keys.revoke': instaboxSchemaEntry('keys.revoke'),
	'machines.activityLeases.release': instaboxSchemaEntry(
		'machines.activityLeases.release',
	),
	'machines.activityLeases.renew': instaboxSchemaEntry(
		'machines.activityLeases.renew',
	),
	'machines.claimOomKill': instaboxSchemaEntry('machines.claimOomKill'),
	'machines.connectionInfo': instaboxSchemaEntry('machines.connectionInfo'),
	'machines.create': instaboxSchemaEntry('machines.create'),
	'machines.createAccess': instaboxSchemaEntry('machines.createAccess'),
	'machines.createSnapshot': instaboxSchemaEntry('machines.createSnapshot'),
	'machines.delete': instaboxSchemaEntry('machines.delete'),
	'machines.desktop.createLink': instaboxSchemaEntry(
		'machines.desktop.createLink',
	),
	'machines.desktop.get': instaboxSchemaEntry('machines.desktop.get'),
	'machines.desktop.revokeLinks': instaboxSchemaEntry(
		'machines.desktop.revokeLinks',
	),
	'machines.disk': instaboxSchemaEntry('machines.disk'),
	'machines.exec': instaboxSchemaEntry('machines.exec'),
	'machines.files.createUploadUrl': instaboxSchemaEntry(
		'machines.files.createUploadUrl',
	),
	'machines.files.download': instaboxSchemaEntry('machines.files.download'),
	'machines.files.read': instaboxSchemaEntry('machines.files.read'),
	'machines.files.write': instaboxSchemaEntry('machines.files.write'),
	'machines.fork': instaboxSchemaEntry('machines.fork'),
	'machines.get': instaboxSchemaEntry('machines.get'),
	'machines.history.get': instaboxSchemaEntry('machines.history.get'),
	'machines.history.list': instaboxSchemaEntry('machines.history.list'),
	'machines.list': instaboxSchemaEntry('machines.list'),
	'machines.logs': instaboxSchemaEntry('machines.logs'),
	'machines.metrics': instaboxSchemaEntry('machines.metrics'),
	'machines.ports.create': instaboxSchemaEntry('machines.ports.create'),
	'machines.ports.delete': instaboxSchemaEntry('machines.ports.delete'),
	'machines.ports.installAgent': instaboxSchemaEntry(
		'machines.ports.installAgent',
	),
	'machines.ports.list': instaboxSchemaEntry('machines.ports.list'),
	'machines.processes': instaboxSchemaEntry('machines.processes'),
	'machines.restore': instaboxSchemaEntry('machines.restore'),
	'machines.resume': instaboxSchemaEntry('machines.resume'),
	'machines.secrets.get': instaboxSchemaEntry('machines.secrets.get'),
	'machines.secrets.refresh': instaboxSchemaEntry('machines.secrets.refresh'),
	'machines.secrets.update': instaboxSchemaEntry('machines.secrets.update'),
	'machines.ssh.createToken': instaboxSchemaEntry('machines.ssh.createToken'),
	'machines.ssh.issueCertificate': instaboxSchemaEntry(
		'machines.ssh.issueCertificate',
	),
	'machines.ssh.listTokens': instaboxSchemaEntry('machines.ssh.listTokens'),
	'machines.ssh.revokeAllTokens': instaboxSchemaEntry(
		'machines.ssh.revokeAllTokens',
	),
	'machines.ssh.revokeToken': instaboxSchemaEntry('machines.ssh.revokeToken'),
	'machines.start': instaboxSchemaEntry('machines.start'),
	'machines.stop': instaboxSchemaEntry('machines.stop'),
	'machines.suspend': instaboxSchemaEntry('machines.suspend'),
	'machines.update': instaboxSchemaEntry('machines.update'),
	'machines.usage': instaboxSchemaEntry('machines.usage'),
	'machines.vault.get': instaboxSchemaEntry('machines.vault.get'),
	'machines.vault.write': instaboxSchemaEntry('machines.vault.write'),
	'machines.wake': instaboxSchemaEntry('machines.wake'),
	'me.discord.get': instaboxSchemaEntry('me.discord.get'),
	'me.discord.unlink': instaboxSchemaEntry('me.discord.unlink'),
	'me.get': instaboxSchemaEntry('me.get'),
	'operations.get': instaboxSchemaEntry('operations.get'),
	'orgs.billing.cancelSubscription': instaboxSchemaEntry(
		'orgs.billing.cancelSubscription',
	),
	'orgs.billing.changePlan': instaboxSchemaEntry('orgs.billing.changePlan'),
	'orgs.billing.checkout': instaboxSchemaEntry('orgs.billing.checkout'),
	'orgs.billing.getTopup': instaboxSchemaEntry('orgs.billing.getTopup'),
	'orgs.billing.movePersonal': instaboxSchemaEntry('orgs.billing.movePersonal'),
	'orgs.billing.portal': instaboxSchemaEntry('orgs.billing.portal'),
	'orgs.billing.resumeSubscription': instaboxSchemaEntry(
		'orgs.billing.resumeSubscription',
	),
	'orgs.billing.subscribeWithCredits': instaboxSchemaEntry(
		'orgs.billing.subscribeWithCredits',
	),
	'orgs.billing.topup': instaboxSchemaEntry('orgs.billing.topup'),
	'orgs.billing.update': instaboxSchemaEntry('orgs.billing.update'),
	'orgs.create': instaboxSchemaEntry('orgs.create'),
	'orgs.delete': instaboxSchemaEntry('orgs.delete'),
	'orgs.exports.create': instaboxSchemaEntry('orgs.exports.create'),
	'orgs.exports.list': instaboxSchemaEntry('orgs.exports.list'),
	'orgs.get': instaboxSchemaEntry('orgs.get'),
	'orgs.github.installations.delete': instaboxSchemaEntry(
		'orgs.github.installations.delete',
	),
	'orgs.github.installations.list': instaboxSchemaEntry(
		'orgs.github.installations.list',
	),
	'orgs.github.jobs.get': instaboxSchemaEntry('orgs.github.jobs.get'),
	'orgs.github.jobs.list': instaboxSchemaEntry('orgs.github.jobs.list'),
	'orgs.github.stats': instaboxSchemaEntry('orgs.github.stats'),
	'orgs.inviteCode.get': instaboxSchemaEntry('orgs.inviteCode.get'),
	'orgs.inviteCode.regenerate': instaboxSchemaEntry(
		'orgs.inviteCode.regenerate',
	),
	'orgs.invites.create': instaboxSchemaEntry('orgs.invites.create'),
	'orgs.invites.list': instaboxSchemaEntry('orgs.invites.list'),
	'orgs.invites.resend': instaboxSchemaEntry('orgs.invites.resend'),
	'orgs.invites.revoke': instaboxSchemaEntry('orgs.invites.revoke'),
	'orgs.keys.create': instaboxSchemaEntry('orgs.keys.create'),
	'orgs.keys.list': instaboxSchemaEntry('orgs.keys.list'),
	'orgs.keys.revoke': instaboxSchemaEntry('orgs.keys.revoke'),
	'orgs.list': instaboxSchemaEntry('orgs.list'),
	'orgs.members.changeRole': instaboxSchemaEntry('orgs.members.changeRole'),
	'orgs.members.list': instaboxSchemaEntry('orgs.members.list'),
	'orgs.members.remove': instaboxSchemaEntry('orgs.members.remove'),
	'orgs.movePersonal': instaboxSchemaEntry('orgs.movePersonal'),
	'orgs.redeemInvite': instaboxSchemaEntry('orgs.redeemInvite'),
	'orgs.secrets.delete': instaboxSchemaEntry('orgs.secrets.delete'),
	'orgs.secrets.import': instaboxSchemaEntry('orgs.secrets.import'),
	'orgs.secrets.list': instaboxSchemaEntry('orgs.secrets.list'),
	'orgs.secrets.set': instaboxSchemaEntry('orgs.secrets.set'),
	'orgs.update': instaboxSchemaEntry('orgs.update'),
	'orgs.webhooks.create': instaboxSchemaEntry('orgs.webhooks.create'),
	'orgs.webhooks.delete': instaboxSchemaEntry('orgs.webhooks.delete'),
	'orgs.webhooks.deliveries.list': instaboxSchemaEntry(
		'orgs.webhooks.deliveries.list',
	),
	'orgs.webhooks.deliveries.retry': instaboxSchemaEntry(
		'orgs.webhooks.deliveries.retry',
	),
	'orgs.webhooks.get': instaboxSchemaEntry('orgs.webhooks.get'),
	'orgs.webhooks.list': instaboxSchemaEntry('orgs.webhooks.list'),
	'orgs.webhooks.rotate': instaboxSchemaEntry('orgs.webhooks.rotate'),
	'orgs.webhooks.test': instaboxSchemaEntry('orgs.webhooks.test'),
	'orgs.webhooks.update': instaboxSchemaEntry('orgs.webhooks.update'),
	'ports.list': instaboxSchemaEntry('ports.list'),
	'sessions.list': instaboxSchemaEntry('sessions.list'),
	'sessions.signOut': instaboxSchemaEntry('sessions.signOut'),
	'snapshots.delete': instaboxSchemaEntry('snapshots.delete'),
	'snapshots.files.list': instaboxSchemaEntry('snapshots.files.list'),
	'snapshots.get': instaboxSchemaEntry('snapshots.get'),
	'snapshots.list': instaboxSchemaEntry('snapshots.list'),
	'stats.get': instaboxSchemaEntry('stats.get'),
	'support.tickets.close': instaboxSchemaEntry('support.tickets.close'),
	'support.tickets.get': instaboxSchemaEntry('support.tickets.get'),
	'support.tickets.list': instaboxSchemaEntry('support.tickets.list'),
	'support.tickets.reply': instaboxSchemaEntry('support.tickets.reply'),
	'templates.list': instaboxSchemaEntry('templates.list'),
	'usage.get': instaboxSchemaEntry('usage.get'),
	'usage.machines': instaboxSchemaEntry('usage.machines'),
	'vault.delete': instaboxSchemaEntry('vault.delete'),
	'vault.export': instaboxSchemaEntry('vault.export'),
	'vault.import': instaboxSchemaEntry('vault.import'),
	'vault.list': instaboxSchemaEntry('vault.list'),
	'vault.set': instaboxSchemaEntry('vault.set'),
	'vault.update': instaboxSchemaEntry('vault.update'),
} satisfies RequiredPluginEndpointSchemas<typeof instaboxEndpointsNested>;

export const instaboxEndpointMeta = {
	'exports.download': {
		riskLevel: 'read',
		description: 'Download a ready export as a .tar.gz (returned as a file)',
	},
	'exports.get': {
		riskLevel: 'read',
		description: 'Get an export',
	},
	'feedback.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"File an `instabox feedback` report, which opens the account's support ticket",
	},
	'gpuQueue.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a live GPU queue entry',
	},
	'gpuQueue.list': {
		riskLevel: 'read',
		description: "List an org's GPU queue entries",
	},
	'keys.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create an API key. Signed-in sessions only; an API key gets 403 permission_denied',
	},
	'keys.list': {
		riskLevel: 'read',
		description:
			"List your personal org's API keys (expired ones included, revoked ones not), as `GET /v1/orgs/{id}/keys` for it. Signed-in sessions only",
	},
	'keys.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Revoke one of your personal org's API keys. Signed-in sessions only",
	},
	'machines.activityLeases.release': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Release a task's activity lease",
	},
	'machines.activityLeases.renew': {
		riskLevel: 'destructive',
		description: "Keep a task's machine awake for a bounded period",
	},
	'machines.claimOomKill': {
		riskLevel: 'write',
		description:
			"The OOM kill of a background job's processes (instabox jobs wait)",
	},
	'machines.connectionInfo': {
		riskLevel: 'read',
		description: 'How to reach the sandbox over SSH. No side effects',
	},
	'machines.create': {
		riskLevel: 'destructive',
		description: 'Create a sandbox',
	},
	'machines.createAccess': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Get a Terminal or VNC connection URL and short-lived admission ticket',
	},
	'machines.createSnapshot': {
		riskLevel: 'write',
		description: "Save a sandbox's system files and storage as a snapshot",
	},
	'machines.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a sandbox, its system files and its storage',
	},
	'machines.desktop.createLink': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"A short-lived link to watch (or use) the machine's desktop in a browser",
	},
	'machines.desktop.get': {
		riskLevel: 'read',
		description:
			"The state of a running machine's desktop; install or start it",
	},
	'machines.desktop.revokeLinks': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke every desktop link of the machine and end their open sessions',
	},
	'machines.disk': {
		riskLevel: 'read',
		description:
			"How full the running sandbox's disks are (/data and /), with a near-full warning",
	},
	'machines.exec': {
		riskLevel: 'destructive',
		description:
			'Run a command in a running machine (cmd through bash -lc, or argv with no shell) and get exitCode, stdout and stderr',
	},
	'machines.files.createUploadUrl': {
		riskLevel: 'write',
		description: 'Get a short-lived signed URL that uploads one file',
	},
	'machines.files.download': {
		riskLevel: 'read',
		description:
			"Download a file's raw bytes from a running machine (returned as a file)",
	},
	'machines.files.read': {
		riskLevel: 'read',
		description: 'Read a file or directory of a running sandbox',
	},
	'machines.files.write': {
		riskLevel: 'write',
		description: 'Write (upload) a file to a running sandbox',
	},
	'machines.fork': {
		riskLevel: 'destructive',
		description: 'Create a copy of a sandbox on its host, without a snapshot',
	},
	'machines.get': {
		riskLevel: 'read',
		description: 'Get a sandbox',
	},
	'machines.history.get': {
		riskLevel: 'read',
		description: 'One past command with its stored output',
	},
	'machines.history.list': {
		riskLevel: 'read',
		description: 'The commands run in the sandbox through exec, newest first',
	},
	'machines.list': {
		riskLevel: 'read',
		description: 'List the sandboxes of your orgs',
	},
	'machines.logs': {
		riskLevel: 'read',
		description:
			"The sandbox's console log and recent operations, to see why it did not boot or is unreachable",
	},
	'machines.metrics': {
		riskLevel: 'read',
		description:
			"The sandbox's recent CPU, memory, network and disk I/O, one sample per 30 seconds",
	},
	'machines.ports.create': {
		riskLevel: 'write',
		description:
			'Give one HTTP port of a sandbox an HTTPS URL, public or private',
	},
	'machines.ports.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Remove a port's public URL and close its active connections",
	},
	'machines.ports.installAgent': {
		riskLevel: 'write',
		description:
			'Install instabox-port in a running sandbox and rotate its credential',
	},
	'machines.ports.list': {
		riskLevel: 'read',
		description: "List a sandbox's public ports",
	},
	'machines.processes': {
		riskLevel: 'read',
		description: "The sandbox's processes, live or as last seen",
	},
	'machines.restore': {
		riskLevel: 'destructive',
		description: "Put a sandbox's disks back to a snapshot's, in place",
	},
	'machines.resume': {
		riskLevel: 'destructive',
		description: 'Resume a paused sandbox where it left off',
	},
	'machines.secrets.get': {
		riskLevel: 'read',
		description: "Read a sandbox's Secret selections and delivery status",
	},
	'machines.secrets.refresh': {
		riskLevel: 'write',
		description: 'Refresh managed Secret delivery in a running sandbox',
	},
	'machines.secrets.update': {
		riskLevel: 'write',
		description: 'Replace supplied Secret selections for a sandbox',
	},
	'machines.ssh.createToken': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Issue an SSH token, for a plain `ssh` command without a key',
	},
	'machines.ssh.issueCertificate': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Issue a short-lived SSH user certificate for the sandbox',
	},
	'machines.ssh.listTokens': {
		riskLevel: 'read',
		description:
			'List SSH token metadata, including revoked and recently expired tokens',
	},
	'machines.ssh.revokeAllTokens': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke every SSH token of the sandbox and close their connections',
	},
	'machines.ssh.revokeToken': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke one SSH token and close its SSH and mosh connections',
	},
	'machines.start': {
		riskLevel: 'destructive',
		description: 'Start a stopped or paused sandbox',
	},
	'machines.stop': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Stop a running sandbox (shuts it down; running programs end, files are kept)',
	},
	'machines.suspend': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Pause a running sandbox, keeping its running programs',
	},
	'machines.update': {
		riskLevel: 'write',
		description:
			'Rename, resize (vCPUs, memory, disk) a stopped sandbox, or set its idle pause and metadata',
	},
	'machines.usage': {
		riskLevel: 'read',
		description: 'What the sandbox used over a window, for billing',
	},
	'machines.vault.get': {
		riskLevel: 'read',
		description: 'What the Vault writes into this machine (docs/vault.md)',
	},
	'machines.vault.write': {
		riskLevel: 'write',
		description: 'Write the current Vault items into the running machine now',
	},
	'machines.wake': {
		riskLevel: 'destructive',
		description: 'Resume an idle-suspended machine before using it',
	},
	'me.discord.get': {
		riskLevel: 'read',
		description: 'The Discord account linked to the signed-in account',
	},
	'me.discord.unlink': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Unlink the signed-in account's Discord account",
	},
	'me.get': {
		riskLevel: 'read',
		description: 'The signed-in user and the sandbox size they get',
	},
	'operations.get': {
		riskLevel: 'read',
		description: 'Get an operation (the progress of a sandbox change)',
	},
	'orgs.billing.cancelSubscription': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"End the org's subscription at the end of the current period. The owner; signed-in sessions only",
	},
	'orgs.billing.changePlan': {
		riskLevel: 'destructive',
		description:
			'Move a subscribed org between the paid plans. The owner; signed-in sessions only',
	},
	'orgs.billing.checkout': {
		riskLevel: 'destructive',
		description:
			'Put an org on a paid plan, its credits first and a card for the rest. The owner; signed-in sessions only',
	},
	'orgs.billing.getTopup': {
		riskLevel: 'read',
		description:
			'What a top-up of the org allows, and the card on file it charges. The owner and admins; signed-in sessions only',
	},
	'orgs.billing.movePersonal': {
		riskLevel: 'destructive',
		description:
			'Move your personal plan, sandboxes and credits into a workspace you own (needs a signed-in user token; an API key gets 403)',
	},
	'orgs.billing.portal': {
		riskLevel: 'destructive',
		description:
			'Open the Stripe customer portal (invoices, the card). The owner and admins; signed-in sessions only',
	},
	'orgs.billing.resumeSubscription': {
		riskLevel: 'destructive',
		description:
			'Take back a cancellation before the period ends. The owner; signed-in sessions only',
	},
	'orgs.billing.subscribeWithCredits': {
		riskLevel: 'destructive',
		description:
			'Put an org on a paid plan paid from its credits. The owner; signed-in sessions only',
	},
	'orgs.billing.topup': {
		riskLevel: 'destructive',
		description:
			'Buy credits for an org on Pro, Builder or Team. The owner and admins; signed-in sessions only',
	},
	'orgs.billing.update': {
		riskLevel: 'destructive',
		description:
			"Set a paid org's spend cap, usage alerts or extra starts. The owner and admins; signed-in sessions only",
	},
	'orgs.create': {
		riskLevel: 'destructive',
		description:
			'Buy a workspace through Stripe Checkout. Signed-in sessions only',
	},
	'orgs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a workspace. The owner, naming it; signed-in sessions only',
	},
	'orgs.exports.create': {
		riskLevel: 'write',
		description: "Export a sandbox's or a snapshot's /data",
	},
	'orgs.exports.list': {
		riskLevel: 'read',
		description: 'List what you can export from a workspace',
	},
	'orgs.get': {
		riskLevel: 'read',
		description: "An org you belong to, with its limits and this month's usage",
	},
	'orgs.github.installations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unlink an install of the GitHub App from an org; its jobs then start no boxes. The App stays installed on GitHub, so Connect GitHub can link it again, here or in another workspace. The owner and admins; signed-in sessions only',
	},
	'orgs.github.installations.list': {
		riskLevel: 'read',
		description:
			'The instabox GitHub App installs linked to an org. The owner and admins; signed-in sessions only',
	},
	'orgs.github.jobs.get': {
		riskLevel: 'read',
		description:
			"One of the org's GitHub Actions jobs, with where its wait went and its branch, commit and failed step",
	},
	'orgs.github.jobs.list': {
		riskLevel: 'read',
		description:
			"The org's GitHub Actions jobs run in CI boxes, with why a job waits or did not start",
	},
	'orgs.github.stats': {
		riskLevel: 'read',
		description:
			"The org's GitHub Actions jobs of the last 7 days, today included, or of a time range, for the CI page",
	},
	'orgs.inviteCode.get': {
		riskLevel: 'read',
		description:
			"A paid org's invite code for people outside it. The owner and admins",
	},
	'orgs.inviteCode.regenerate': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Replace a paid workspace's invite code. The owner and admins",
	},
	'orgs.invites.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Email an invite to join the org. The owner and admins',
	},
	'orgs.invites.list': {
		riskLevel: 'read',
		description: "An org's invites, newest first. The owner and admins",
	},
	'orgs.invites.resend': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Email an open invite again. The owner and admins',
	},
	'orgs.invites.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke an unredeemed invite. The owner and admins',
	},
	'orgs.keys.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Create an API key of an org. The owner and admins (a personal org's owner); signed-in sessions only",
	},
	'orgs.keys.list': {
		riskLevel: 'read',
		description:
			"An org's API keys (expired ones included, revoked ones not). The owner and admins (a personal org's owner); signed-in sessions only",
	},
	'orgs.keys.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Revoke an org's API key. The owner and admins (a personal org's owner); signed-in sessions only",
	},
	'orgs.list': {
		riskLevel: 'read',
		description: 'The orgs you belong to, your personal org first',
	},
	'orgs.members.changeRole': {
		riskLevel: 'write',
		description: "Change a member's role. The owner and admins",
	},
	'orgs.members.list': {
		riskLevel: 'read',
		description: 'The members of an org you belong to, the owner first',
	},
	'orgs.members.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a member, or leave (your own user ID)',
	},
	'orgs.movePersonal': {
		riskLevel: 'destructive',
		description:
			'Move your personal plan, sandboxes and credits into a new workspace (needs a signed-in user token; an API key gets 403)',
	},
	'orgs.redeemInvite': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Join an org with an invite code. Signed-in sessions only',
	},
	'orgs.secrets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an org Secret and its explicit sandbox grants',
	},
	'orgs.secrets.import': {
		riskLevel: 'write',
		description: 'Atomically create or replace a batch of org Secrets',
	},
	'orgs.secrets.list': {
		riskLevel: 'read',
		description: "List an org's Secret metadata, never values",
	},
	'orgs.secrets.set': {
		riskLevel: 'write',
		description: 'Create or replace an org Secret',
	},
	'orgs.update': {
		riskLevel: 'write',
		description: 'Rename an org. The owner and admins',
	},
	'orgs.webhooks.create': {
		riskLevel: 'write',
		description: 'Register a webhook endpoint',
	},
	'orgs.webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook endpoint with its pending deliveries and delivery log',
	},
	'orgs.webhooks.deliveries.list': {
		riskLevel: 'read',
		description:
			"List an endpoint's deliveries, newest first, with their attempts",
	},
	'orgs.webhooks.deliveries.retry': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Send a finished (succeeded or failed) delivery once more',
	},
	'orgs.webhooks.get': {
		riskLevel: 'read',
		description: 'Get a webhook endpoint',
	},
	'orgs.webhooks.list': {
		riskLevel: 'read',
		description: "List an org's webhook endpoints",
	},
	'orgs.webhooks.rotate': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Give an endpoint a new signing secret',
	},
	'orgs.webhooks.test': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Queue a `webhook.test` event to an enabled endpoint',
	},
	'orgs.webhooks.update': {
		riskLevel: 'write',
		description: 'Change a webhook endpoint',
	},
	'ports.list': {
		riskLevel: 'read',
		description: 'List the public ports of all your sandboxes',
	},
	'sessions.list': {
		riskLevel: 'read',
		description: 'List your active sign-ins (CLI and browser sessions)',
	},
	'sessions.signOut': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Sign out one of your sessions (revokes all its tokens) (needs a signed-in user token; an API key gets 403)',
	},
	'snapshots.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a snapshot',
	},
	'snapshots.files.list': {
		riskLevel: 'read',
		description: "Read a file or directory of a snapshot's system files",
	},
	'snapshots.get': {
		riskLevel: 'read',
		description: 'Get a snapshot of one of your orgs',
	},
	'snapshots.list': {
		riskLevel: 'read',
		description: 'List the snapshots of your orgs',
	},
	'stats.get': {
		riskLevel: 'read',
		description:
			'Public figures, such as how many sandboxes are running right now',
	},
	'support.tickets.close': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Close one of the account's tickets (needs a signed-in user token; an API key gets 403)",
	},
	'support.tickets.get': {
		riskLevel: 'read',
		description:
			"One of the account's tickets and its messages (needs a signed-in user token; an API key gets 403)",
	},
	'support.tickets.list': {
		riskLevel: 'read',
		description:
			"The signed-in account's support tickets, newest activity first",
	},
	'support.tickets.reply': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Answer one of the account's open tickets (needs a signed-in user token; an API key gets 403)",
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List the templates a sandbox can start from',
	},
	'usage.get': {
		riskLevel: 'read',
		description:
			"Your storage use, limits, this month's cost and credit balance",
	},
	'usage.machines': {
		riskLevel: 'read',
		description:
			'Compute, disk and egress use and list price by sandbox over a window, deleted sandboxes included',
	},
	'vault.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Vault item. Sign-in sessions only',
	},
	'vault.export': {
		riskLevel: 'write',
		description:
			'Recover one retained legacy item as a private JSON download (needs a signed-in user token; an API key gets 403)',
	},
	'vault.import': {
		riskLevel: 'write',
		description:
			'Atomically import environment variables into the per-user Vault (needs a signed-in user token; an API key gets 403)',
	},
	'vault.list': {
		riskLevel: 'read',
		description: "The caller's Vault items, by name. Sign-in sessions only",
	},
	'vault.set': {
		riskLevel: 'write',
		description: 'Create or replace a Vault item. Sign-in sessions only',
	},
	'vault.update': {
		riskLevel: 'write',
		description:
			"Change a Vault item's selector without resending its value. Sign-in sessions only",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof instaboxEndpointsNested>;
