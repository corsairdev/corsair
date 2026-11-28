// Generated with endpoints/operation-types.ts from Boat's OpenAPI spec:
// one entry per operation in boat-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { boatSchemaEntry } from './openapi-schema';
import { createBoatOperation as op } from './operations';

export const boatEndpointsNested = {
	account: {
		getCallerAddress: op('account.getCallerAddress'),
		getDataRetention: op('account.getDataRetention'),
		getLimits: op('account.getLimits'),
		getMe: op('account.getMe'),
		updateDataRetention: op('account.updateDataRetention'),
	},
	aiProxy: {
		get: op('aiProxy.get'),
		getUsage: op('aiProxy.getUsage'),
		update: op('aiProxy.update'),
	},
	apiKeys: {
		createScoped: op('apiKeys.createScoped'),
		getUsage: op('apiKeys.getUsage'),
		list: op('apiKeys.list'),
		revoke: op('apiKeys.revoke'),
		rotate: op('apiKeys.rotate'),
	},
	ci: {
		connectGithub: op('ci.connectGithub'),
		getJob: op('ci.getJob'),
		getJobLog: op('ci.getJobLog'),
		getOverview: op('ci.getOverview'),
		setPublicRepos: op('ci.setPublicRepos'),
	},
	credentialProfiles: {
		accounts: {
			add: op('credentialProfiles.accounts.add'),
			delete: op('credentialProfiles.accounts.delete'),
			list: op('credentialProfiles.accounts.list'),
			switch: op('credentialProfiles.accounts.switch'),
		},
		create: op('credentialProfiles.create'),
		customApis: {
			delete: op('credentialProfiles.customApis.delete'),
			set: op('credentialProfiles.customApis.set'),
		},
		delete: op('credentialProfiles.delete'),
		deleteKey: op('credentialProfiles.deleteKey'),
		list: op('credentialProfiles.list'),
		setKey: op('credentialProfiles.setKey'),
		update: op('credentialProfiles.update'),
	},
	deletionOperations: {
		get: op('deletionOperations.get'),
	},
	environments: {
		addRepo: op('environments.addRepo'),
		create: op('environments.create'),
		delete: op('environments.delete'),
		deleteRepo: op('environments.deleteRepo'),
		deleteSecretFile: op('environments.deleteSecretFile'),
		deleteVar: op('environments.deleteVar'),
		list: op('environments.list'),
		setSecretFile: op('environments.setSecretFile'),
		setVar: op('environments.setVar'),
		update: op('environments.update'),
		upgradeSandboxes: op('environments.upgradeSandboxes'),
	},
	namedSnapshots: {
		delete: op('namedSnapshots.delete'),
		get: op('namedSnapshots.get'),
		list: op('namedSnapshots.list'),
		save: op('namedSnapshots.save'),
	},
	orgs: {
		list: op('orgs.list'),
		setActive: op('orgs.setActive'),
		update: op('orgs.update'),
	},
	repos: {
		list: op('repos.list'),
		select: op('repos.select'),
	},
	sandboxes: {
		addSshKey: op('sandboxes.addSshKey'),
		agent: {
			getPrompt: op('sandboxes.agent.getPrompt'),
			interrupt: op('sandboxes.agent.interrupt'),
			listConversations: op('sandboxes.agent.listConversations'),
			listEvents: op('sandboxes.agent.listEvents'),
			prompt: op('sandboxes.agent.prompt'),
			steer: op('sandboxes.agent.steer'),
		},
		commands: {
			attach: op('sandboxes.commands.attach'),
			get: op('sandboxes.commands.get'),
			getLogs: op('sandboxes.commands.getLogs'),
			getStatus: op('sandboxes.commands.getStatus'),
			listHistory: op('sandboxes.commands.listHistory'),
			run: op('sandboxes.commands.run'),
			stop: op('sandboxes.commands.stop'),
		},
		create: op('sandboxes.create'),
		delete: op('sandboxes.delete'),
		downloadArtifact: op('sandboxes.downloadArtifact'),
		files: {
			createDownloadUrl: op('sandboxes.files.createDownloadUrl'),
			createFolder: op('sandboxes.files.createFolder'),
			createUploadUrl: op('sandboxes.files.createUploadUrl'),
			delete: op('sandboxes.files.delete'),
			find: op('sandboxes.files.find'),
			getInfo: op('sandboxes.files.getInfo'),
			list: op('sandboxes.files.list'),
			move: op('sandboxes.files.move'),
			read: op('sandboxes.files.read'),
			replace: op('sandboxes.files.replace'),
			search: op('sandboxes.files.search'),
			setPermissions: op('sandboxes.files.setPermissions'),
			write: op('sandboxes.files.write'),
		},
		fork: op('sandboxes.fork'),
		get: op('sandboxes.get'),
		getAiUsage: op('sandboxes.getAiUsage'),
		getDesktopUrl: op('sandboxes.getDesktopUrl'),
		getNetworkPolicy: op('sandboxes.getNetworkPolicy'),
		getStop: op('sandboxes.getStop'),
		getUsage: op('sandboxes.getUsage'),
		hostPort: op('sandboxes.hostPort'),
		list: op('sandboxes.list'),
		listProcesses: op('sandboxes.listProcesses'),
		recover: op('sandboxes.recover'),
		resume: op('sandboxes.resume'),
		setAiAccess: op('sandboxes.setAiAccess'),
		setNetworkPolicy: op('sandboxes.setNetworkPolicy'),
		share: op('sandboxes.share'),
		snapshots: {
			deleteAll: op('sandboxes.snapshots.deleteAll'),
			getLatest: op('sandboxes.snapshots.getLatest'),
			list: op('sandboxes.snapshots.list'),
		},
		stop: op('sandboxes.stop'),
		unshare: op('sandboxes.unshare'),
		update: op('sandboxes.update'),
	},
	savedSnapshots: {
		delete: op('savedSnapshots.delete'),
		get: op('savedSnapshots.get'),
		list: op('savedSnapshots.list'),
		save: op('savedSnapshots.save'),
		shares: {
			create: op('savedSnapshots.shares.create'),
			list: op('savedSnapshots.shares.list'),
			revoke: op('savedSnapshots.shares.revoke'),
		},
	},
	secrets: {
		get: op('secrets.get'),
		update: op('secrets.update'),
	},
	snapshots: {
		delete: op('snapshots.delete'),
		getDownload: op('snapshots.getDownload'),
		getFile: op('snapshots.getFile'),
		getTree: op('snapshots.getTree'),
		list: op('snapshots.list'),
	},
	telemetry: {
		delete: op('telemetry.delete'),
		get: op('telemetry.get'),
		set: op('telemetry.set'),
	},
	webhooks: {
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		get: op('webhooks.get'),
		list: op('webhooks.list'),
		rotateSecret: op('webhooks.rotateSecret'),
		update: op('webhooks.update'),
	},
} as const;

export const boatEndpointSchemas = {
	'account.getCallerAddress': boatSchemaEntry('account.getCallerAddress'),
	'account.getDataRetention': boatSchemaEntry('account.getDataRetention'),
	'account.getLimits': boatSchemaEntry('account.getLimits'),
	'account.getMe': boatSchemaEntry('account.getMe'),
	'account.updateDataRetention': boatSchemaEntry('account.updateDataRetention'),
	'aiProxy.get': boatSchemaEntry('aiProxy.get'),
	'aiProxy.getUsage': boatSchemaEntry('aiProxy.getUsage'),
	'aiProxy.update': boatSchemaEntry('aiProxy.update'),
	'apiKeys.createScoped': boatSchemaEntry('apiKeys.createScoped'),
	'apiKeys.getUsage': boatSchemaEntry('apiKeys.getUsage'),
	'apiKeys.list': boatSchemaEntry('apiKeys.list'),
	'apiKeys.revoke': boatSchemaEntry('apiKeys.revoke'),
	'apiKeys.rotate': boatSchemaEntry('apiKeys.rotate'),
	'ci.connectGithub': boatSchemaEntry('ci.connectGithub'),
	'ci.getJob': boatSchemaEntry('ci.getJob'),
	'ci.getJobLog': boatSchemaEntry('ci.getJobLog'),
	'ci.getOverview': boatSchemaEntry('ci.getOverview'),
	'ci.setPublicRepos': boatSchemaEntry('ci.setPublicRepos'),
	'credentialProfiles.accounts.add': boatSchemaEntry(
		'credentialProfiles.accounts.add',
	),
	'credentialProfiles.accounts.delete': boatSchemaEntry(
		'credentialProfiles.accounts.delete',
	),
	'credentialProfiles.accounts.list': boatSchemaEntry(
		'credentialProfiles.accounts.list',
	),
	'credentialProfiles.accounts.switch': boatSchemaEntry(
		'credentialProfiles.accounts.switch',
	),
	'credentialProfiles.create': boatSchemaEntry('credentialProfiles.create'),
	'credentialProfiles.customApis.delete': boatSchemaEntry(
		'credentialProfiles.customApis.delete',
	),
	'credentialProfiles.customApis.set': boatSchemaEntry(
		'credentialProfiles.customApis.set',
	),
	'credentialProfiles.delete': boatSchemaEntry('credentialProfiles.delete'),
	'credentialProfiles.deleteKey': boatSchemaEntry(
		'credentialProfiles.deleteKey',
	),
	'credentialProfiles.list': boatSchemaEntry('credentialProfiles.list'),
	'credentialProfiles.setKey': boatSchemaEntry('credentialProfiles.setKey'),
	'credentialProfiles.update': boatSchemaEntry('credentialProfiles.update'),
	'deletionOperations.get': boatSchemaEntry('deletionOperations.get'),
	'environments.addRepo': boatSchemaEntry('environments.addRepo'),
	'environments.create': boatSchemaEntry('environments.create'),
	'environments.delete': boatSchemaEntry('environments.delete'),
	'environments.deleteRepo': boatSchemaEntry('environments.deleteRepo'),
	'environments.deleteSecretFile': boatSchemaEntry(
		'environments.deleteSecretFile',
	),
	'environments.deleteVar': boatSchemaEntry('environments.deleteVar'),
	'environments.list': boatSchemaEntry('environments.list'),
	'environments.setSecretFile': boatSchemaEntry('environments.setSecretFile'),
	'environments.setVar': boatSchemaEntry('environments.setVar'),
	'environments.update': boatSchemaEntry('environments.update'),
	'environments.upgradeSandboxes': boatSchemaEntry(
		'environments.upgradeSandboxes',
	),
	'namedSnapshots.delete': boatSchemaEntry('namedSnapshots.delete'),
	'namedSnapshots.get': boatSchemaEntry('namedSnapshots.get'),
	'namedSnapshots.list': boatSchemaEntry('namedSnapshots.list'),
	'namedSnapshots.save': boatSchemaEntry('namedSnapshots.save'),
	'orgs.list': boatSchemaEntry('orgs.list'),
	'orgs.setActive': boatSchemaEntry('orgs.setActive'),
	'orgs.update': boatSchemaEntry('orgs.update'),
	'repos.list': boatSchemaEntry('repos.list'),
	'repos.select': boatSchemaEntry('repos.select'),
	'sandboxes.addSshKey': boatSchemaEntry('sandboxes.addSshKey'),
	'sandboxes.agent.getPrompt': boatSchemaEntry('sandboxes.agent.getPrompt'),
	'sandboxes.agent.interrupt': boatSchemaEntry('sandboxes.agent.interrupt'),
	'sandboxes.agent.listConversations': boatSchemaEntry(
		'sandboxes.agent.listConversations',
	),
	'sandboxes.agent.listEvents': boatSchemaEntry('sandboxes.agent.listEvents'),
	'sandboxes.agent.prompt': boatSchemaEntry('sandboxes.agent.prompt'),
	'sandboxes.agent.steer': boatSchemaEntry('sandboxes.agent.steer'),
	'sandboxes.commands.attach': boatSchemaEntry('sandboxes.commands.attach'),
	'sandboxes.commands.get': boatSchemaEntry('sandboxes.commands.get'),
	'sandboxes.commands.getLogs': boatSchemaEntry('sandboxes.commands.getLogs'),
	'sandboxes.commands.getStatus': boatSchemaEntry(
		'sandboxes.commands.getStatus',
	),
	'sandboxes.commands.listHistory': boatSchemaEntry(
		'sandboxes.commands.listHistory',
	),
	'sandboxes.commands.run': boatSchemaEntry('sandboxes.commands.run'),
	'sandboxes.commands.stop': boatSchemaEntry('sandboxes.commands.stop'),
	'sandboxes.create': boatSchemaEntry('sandboxes.create'),
	'sandboxes.delete': boatSchemaEntry('sandboxes.delete'),
	'sandboxes.downloadArtifact': boatSchemaEntry('sandboxes.downloadArtifact'),
	'sandboxes.files.createDownloadUrl': boatSchemaEntry(
		'sandboxes.files.createDownloadUrl',
	),
	'sandboxes.files.createFolder': boatSchemaEntry(
		'sandboxes.files.createFolder',
	),
	'sandboxes.files.createUploadUrl': boatSchemaEntry(
		'sandboxes.files.createUploadUrl',
	),
	'sandboxes.files.delete': boatSchemaEntry('sandboxes.files.delete'),
	'sandboxes.files.find': boatSchemaEntry('sandboxes.files.find'),
	'sandboxes.files.getInfo': boatSchemaEntry('sandboxes.files.getInfo'),
	'sandboxes.files.list': boatSchemaEntry('sandboxes.files.list'),
	'sandboxes.files.move': boatSchemaEntry('sandboxes.files.move'),
	'sandboxes.files.read': boatSchemaEntry('sandboxes.files.read'),
	'sandboxes.files.replace': boatSchemaEntry('sandboxes.files.replace'),
	'sandboxes.files.search': boatSchemaEntry('sandboxes.files.search'),
	'sandboxes.files.setPermissions': boatSchemaEntry(
		'sandboxes.files.setPermissions',
	),
	'sandboxes.files.write': boatSchemaEntry('sandboxes.files.write'),
	'sandboxes.fork': boatSchemaEntry('sandboxes.fork'),
	'sandboxes.get': boatSchemaEntry('sandboxes.get'),
	'sandboxes.getAiUsage': boatSchemaEntry('sandboxes.getAiUsage'),
	'sandboxes.getDesktopUrl': boatSchemaEntry('sandboxes.getDesktopUrl'),
	'sandboxes.getNetworkPolicy': boatSchemaEntry('sandboxes.getNetworkPolicy'),
	'sandboxes.getStop': boatSchemaEntry('sandboxes.getStop'),
	'sandboxes.getUsage': boatSchemaEntry('sandboxes.getUsage'),
	'sandboxes.hostPort': boatSchemaEntry('sandboxes.hostPort'),
	'sandboxes.list': boatSchemaEntry('sandboxes.list'),
	'sandboxes.listProcesses': boatSchemaEntry('sandboxes.listProcesses'),
	'sandboxes.recover': boatSchemaEntry('sandboxes.recover'),
	'sandboxes.resume': boatSchemaEntry('sandboxes.resume'),
	'sandboxes.setAiAccess': boatSchemaEntry('sandboxes.setAiAccess'),
	'sandboxes.setNetworkPolicy': boatSchemaEntry('sandboxes.setNetworkPolicy'),
	'sandboxes.share': boatSchemaEntry('sandboxes.share'),
	'sandboxes.snapshots.deleteAll': boatSchemaEntry(
		'sandboxes.snapshots.deleteAll',
	),
	'sandboxes.snapshots.getLatest': boatSchemaEntry(
		'sandboxes.snapshots.getLatest',
	),
	'sandboxes.snapshots.list': boatSchemaEntry('sandboxes.snapshots.list'),
	'sandboxes.stop': boatSchemaEntry('sandboxes.stop'),
	'sandboxes.unshare': boatSchemaEntry('sandboxes.unshare'),
	'sandboxes.update': boatSchemaEntry('sandboxes.update'),
	'savedSnapshots.delete': boatSchemaEntry('savedSnapshots.delete'),
	'savedSnapshots.get': boatSchemaEntry('savedSnapshots.get'),
	'savedSnapshots.list': boatSchemaEntry('savedSnapshots.list'),
	'savedSnapshots.save': boatSchemaEntry('savedSnapshots.save'),
	'savedSnapshots.shares.create': boatSchemaEntry(
		'savedSnapshots.shares.create',
	),
	'savedSnapshots.shares.list': boatSchemaEntry('savedSnapshots.shares.list'),
	'savedSnapshots.shares.revoke': boatSchemaEntry(
		'savedSnapshots.shares.revoke',
	),
	'secrets.get': boatSchemaEntry('secrets.get'),
	'secrets.update': boatSchemaEntry('secrets.update'),
	'snapshots.delete': boatSchemaEntry('snapshots.delete'),
	'snapshots.getDownload': boatSchemaEntry('snapshots.getDownload'),
	'snapshots.getFile': boatSchemaEntry('snapshots.getFile'),
	'snapshots.getTree': boatSchemaEntry('snapshots.getTree'),
	'snapshots.list': boatSchemaEntry('snapshots.list'),
	'telemetry.delete': boatSchemaEntry('telemetry.delete'),
	'telemetry.get': boatSchemaEntry('telemetry.get'),
	'telemetry.set': boatSchemaEntry('telemetry.set'),
	'webhooks.create': boatSchemaEntry('webhooks.create'),
	'webhooks.delete': boatSchemaEntry('webhooks.delete'),
	'webhooks.get': boatSchemaEntry('webhooks.get'),
	'webhooks.list': boatSchemaEntry('webhooks.list'),
	'webhooks.rotateSecret': boatSchemaEntry('webhooks.rotateSecret'),
	'webhooks.update': boatSchemaEntry('webhooks.update'),
} satisfies RequiredPluginEndpointSchemas<typeof boatEndpointsNested>;

export const boatEndpointMeta = {
	'account.getCallerAddress': {
		riskLevel: 'read',
		description:
			"Get the caller's address. The public address that this request comes from, as boat sees it. Use it as an entry of network.inboundAllow. Your network can use another address for the other IP version (IPv4 or IPv6): add both. Any key or session can call this route. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'account.getDataRetention': {
		riskLevel: 'read',
		description:
			'Get account data-retention policy. Returns the current zero-data-retention policy. Per-Boat API keys cannot access this account-wide setting. Responses are never cached. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'account.getLimits': {
		riskLevel: 'read',
		description:
			"Get Boat limits. Check remaining machine starts, included VM time, the wallet, overage prices, access readiness, and concurrent-sandbox capacity for the wallet a create would bill: the org / X-Boat-Org you pass (id or name), else the account's active wallet, else personal.",
	},
	'account.getMe': {
		riskLevel: 'read',
		description:
			'Get current Boat user. Returns GitHub identity for the authenticated Boat account.',
	},
	'account.updateDataRetention': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Update account data-retention policy. Requires an interactive sandbox session; API keys and legacy permanent tokens are refused. Enabling requires the exact confirmation phrase delete archived sandbox data. Disabling affects future archives only and cannot cancel deletion operations already accepted. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'aiProxy.get': {
		riskLevel: 'read',
		description:
			'Get AI credentials proxy. Returns the AI credentials proxy switch of the account in scope, a person or an organization, with its price. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'aiProxy.getUsage': {
		riskLevel: 'read',
		description:
			"Get AI usage. Proxied AI usage, per sandbox and in total, per UTC day, credential and model. Without profile, the usage charged to the wallet in scope. With profile, the requests made with that profile's credentials, whoever pays; only its managers can read it. Needs an API key with account.read. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'aiProxy.update': {
		riskLevel: 'write',
		description:
			'Turn the AI credentials proxy on or off. With the proxy on, sandboxes get placeholder keys and base URLs that point at Boat. Boat swaps in the real key on each request. Real keys never enter the sandbox. Running sandboxes switch at their next start. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'apiKeys.createScoped': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create a scoped API key. Creates a scoped, expiring API key. Requires a dashboard/CLI session or an admin-scoped token. The secret is returned once. At least one of preset, actions, sandboxIds, or environmentIds is required. Full account access requires an explicit admin preset. Mints a new API key; its secret is returned once. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'apiKeys.getUsage': {
		riskLevel: 'read',
		description:
			"Get API key usage. Returns the key's request total for the 30-day UTC window and the sandboxes and Agents it created that still exist, including sandboxes that never got a sandbox row. Works for revoked keys owned by the authenticated account. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description:
			'List API keys. Lists API key metadata only. Raw key secrets are not returned after creation/rotation. Results include expiry and scope. A restricted API-key caller receives apiKeys: []; only an unrestricted account key or browser/CLI session receives the account inventory. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'apiKeys.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke an API key. Revokes the key immediately. Command streams opened with it end within 15 seconds. It does not remove SSH keys that were added to a sandbox, stop running commands, or rotate hosted port tokens. Requires a dashboard or CLI session, or an admin-scoped key. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key. Cannot be undone.',
	},
	'apiKeys.rotate': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Rotate an API key. Replaces the raw secret without changing expiry or scope. Requires a dashboard or CLI session, or an admin-scoped key. A key rotates itself or a key it could create. The old secret stops working at once. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'ci.connectGithub': {
		riskLevel: 'write',
		description:
			'Connect GitHub for CI. Returns a GitHub URL to install the boat CI app, or to authorize an existing installation when account is set. An owner of the GitHub organization must complete authorization and confirm the boat account. Jobs bill org or the wallet in scope. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'ci.getJob': {
		riskLevel: 'read',
		description:
			'Get CI job. One job with its wait, run time, cost, sandbox and error. Needs an API key with account.read. A personal key with the admin preset got 403 api_key_action_forbidden (live 11-28). An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'ci.getJobLog': {
		riskLevel: 'read',
		description:
			"Get CI job log. The job's log from GitHub, up to the last 1 MB. Poll it while the job runs. Needs an API key with account.read. A personal key with the admin preset got 403 api_key_action_forbidden (live 11-28). An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'ci.getOverview': {
		riskLevel: 'read',
		description:
			"Get CI overview. GitHub Actions on boat (runs-on: boat): the setup steps and the next one, jobs boat did not run and why, the linked GitHub accounts with every repository they can see, 7-day stats, and the jobs. The same data as the dashboard's CI tab and boat ci. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'ci.setPublicRepos': {
		riskLevel: 'destructive',
		description:
			"Set CI public repositories. Turns jobs from a linked account's public repositories on or off, and sets the GitHub users whose runs may use boat there. A run is allowed only when both its author and the user who started it (a re-run) are on the list. Each user is checked on GitHub. Lets runs from those repositories bill the account. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'credentialProfiles.accounts.add': {
		riskLevel: 'write',
		description:
			'Add another API key to a credential. Adds an API key as another account of the credential, ready to switch to. The first key of a credential becomes the one in use. A sign-in returns 400 not_an_api_key; add another sign-in with "Add another account" on the dashboard. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'credentialProfiles.accounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Forget an account of a credential. Deletes an account. For the account in use, the credential switches to another account first, or is removed when it was the last one. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key. Cannot be undone.',
	},
	'credentialProfiles.accounts.list': {
		riskLevel: 'read',
		description:
			'List the accounts of a credential. Every account of one credential (several ChatGPT sign-ins, several OpenAI keys), in the order they were added, the one in use marked. Labels only, never a secret. Needs an API key with account.admin, on a profile you manage: an org member who only uses an org profile gets 403. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'credentialProfiles.accounts.switch': {
		riskLevel: 'write',
		description:
			'Switch a credential to another account. Makes this account the one in use; the previous one stays as another account. Switching to the account already in use changes nothing. Every sandbox that uses the profile gets it at once, running ones included, with no restart. Use it when one account runs out of credits. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'credentialProfiles.create': {
		riskLevel: 'write',
		description:
			'Create a credential profile. Creates an empty profile, or a copy of copyFrom. With org, the profile belongs to that organization and only its owners can create it. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'credentialProfiles.customApis.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a custom API. Removes one custom API from the profile. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key. Cannot be undone.',
	},
	'credentialProfiles.customApis.set': {
		riskLevel: 'write',
		description:
			'Set a custom API. Adds or replaces one custom API. The sandbox gets <NAME> and <NAME>_BASE_URL. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'credentialProfiles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a credential profile. Deletes the profile. A default profile returns 409 is_default. A profile that an environment names returns 409 in_use. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key. Cannot be undone.',
	},
	'credentialProfiles.deleteKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a credential profile credential. Removes one credential, an API key or a sign-in. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key. Cannot be undone.',
	},
	'credentialProfiles.list': {
		riskLevel: 'read',
		description:
			"List credential profiles. Returns every AI credential profile you can use, yours and your organizations'. Secret values are never returned. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'credentialProfiles.setKey': {
		riskLevel: 'write',
		description:
			'Set a credential profile API key. Sets one API key. A sign-in id returns 400 not_an_api_key; connect sign-ins on the dashboard Agents page. Running sandboxes that use the profile get the new key. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'credentialProfiles.update': {
		riskLevel: 'write',
		description:
			"Update a credential profile. Renames the profile, or makes it its owner's default. Sandboxes that use the owner's default switch to the new default at their next start. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'deletionOperations.get': {
		riskLevel: 'read',
		description:
			'Get deletion operation. Poll an accepted Boat or snapshot deletion. Only operations owned by the authenticated account are returned. Responses are never cached.',
	},
	'environments.addRepo': {
		riskLevel: 'write',
		description:
			'Add a repository to an environment. Adds a repository (or updates its base branch) by database id from the repository list. Mints a new immutable version.',
	},
	'environments.create': {
		riskLevel: 'write',
		description:
			'Create a sandbox environment. Create a new named environment. It starts on version 1 with all fine-grained flags on and safeForThirdParties off.',
	},
	'environments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a sandbox environment. Soft-deletes an environment. The default environment cannot be deleted, and at least one environment is always kept. Cannot be undone.',
	},
	'environments.deleteRepo': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Remove a repository from an environment. Removes one repository from the environment's selection. Mints a new immutable version. Cannot be undone.",
	},
	'environments.deleteSecretFile': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove one secret file. Removes the secret file at path. Mints a new immutable version. Cannot be undone.',
	},
	'environments.deleteVar': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove one environment variable. Removes a single variable. Mints a new immutable version. Cannot be undone.',
	},
	'environments.list': {
		riskLevel: 'read',
		description:
			'List Sandbox environments. Returns every non-deleted sandbox environment with its latest-version flags, contents, and per-version sandbox usage. A default environment named base is created on first access if none exists.',
	},
	'environments.setSecretFile': {
		riskLevel: 'write',
		description:
			'Write one secret file. Adds or replaces a single secret file by path. Mints a new immutable version.',
	},
	'environments.setVar': {
		riskLevel: 'write',
		description:
			'Set one environment variable. Sets or replaces a single variable without reading or rewriting the rest. Mints a new immutable version.',
	},
	'environments.update': {
		riskLevel: 'write',
		description:
			'Update a sandbox environment. Rename, set as default, and/or edit flags and contents. Any flag or content change mints a new immutable version; existing sandboxes stay on their pinned version until you call upgrade.',
	},
	'environments.upgradeSandboxes': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Upgrade sandboxes to an environment's latest version. Repoints the caller's active sandboxes from an older version of this environment to its latest version, scrubbing any owner secrets the new version drops and hot-pushing the new config.",
	},
	'namedSnapshots.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a named snapshot. Remove a named snapshot and release its storage (boat snapshot rm <name> in the CLI). Sandboxes already deployed from it are unaffected. The older name of the savedSnapshots routes (hidden in the spec, still served). Cannot be undone.',
	},
	'namedSnapshots.get': {
		riskLevel: 'read',
		description:
			'Get a named snapshot. The older name of the savedSnapshots routes (hidden in the spec, still served).',
	},
	'namedSnapshots.list': {
		riskLevel: 'read',
		description:
			'List named snapshots. List your named snapshots, newest first. The older name of the savedSnapshots routes (hidden in the spec, still served).',
	},
	'namedSnapshots.save': {
		riskLevel: 'destructive',
		description:
			"Save a named snapshot. Freeze a sandbox's current state under a name (boat snapshot <id> <name> in the CLI). Answers 202 immediately with the snapshot in saving; a running sandbox takes a fresh capture first, which can run minutes. Poll GET /named-snapshots/{name} until the status settles at ready or failed. The older name of the savedSnapshots routes (hidden in the spec, still served). Snapshots past the plan allowance bill monthly. The free trial refuses it: 403 (live 11-28).",
	},
	'orgs.list': {
		riskLevel: 'read',
		description:
			'List organizations. The wallets this account can bill: your personal account first, then every organization you belong to, each with its id and name. Either spelling works wherever an org is passed (org, X-Boat-Org, teamId).',
	},
	'orgs.setActive': {
		riskLevel: 'write',
		description:
			'Set the active organization. Set the wallet new sandboxes bill when a request names none, for this account on every client: the API, the CLI (boat org switch sets the same value) and the dashboard. Pass an organization id or name you belong to, or personal (or null) for your own account. GET /limits follows it.',
	},
	'orgs.update': {
		riskLevel: 'write',
		description:
			'Update organization settings. The owner renames the organization with name. Requests that name the organization by its old name fail after the rename; its id does not change. The billing name on new invoices follows when it is still the organization name.',
	},
	'repos.list': {
		riskLevel: 'read',
		description:
			'List GitHub repositories available to Boat. Returns GitHub repositories grouped by installation plus the current selected repositories for new Sandboxes. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'repos.select': {
		riskLevel: 'write',
		description:
			'Select repository for sandboxes. Idempotently selects one repository for the sandbox environment. Use databaseId from GET /repos as repositoryId; selecting an already-selected repository updates its baseBranch. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'sandboxes.addSshKey': {
		riskLevel: 'write',
		description:
			'Configure sandbox SSH key. Adds an OpenSSH public key to the running sandbox so the caller can SSH as user user. The response carries machineIp, which is the host to connect to on port 22.',
	},
	'sandboxes.agent.getPrompt': {
		riskLevel: 'read',
		description:
			'Get prompt run status. Returns first-class status for a queued/running/finished prompt so clients do not infer completion from sandbox state and events.',
	},
	'sandboxes.agent.interrupt': {
		riskLevel: 'write',
		description:
			'Interrupt running work. Interrupt running agent work. By default this stops every conversation on the sandbox. Pass conversation to stop just one, leaving the others running. See Integrated agents.',
	},
	'sandboxes.agent.listConversations': {
		riskLevel: 'read',
		description:
			'List boat conversations. Every conversation on the sandbox, most recently prompted first, with what you need to pick one: how many prompts it holds, whether a turn is running in it right now, the last harness and model it ran on, a preview of its last prompt, and current, the one a POST /prompt without new or…',
	},
	'sandboxes.agent.listEvents': {
		riskLevel: 'read',
		description:
			'List boat events. Return Sandbox work, lifecycle, and progress events so product UIs can show what the sandbox is doing. A Sandbox runs many conversations in parallel; this streams all of them by default and every event carries a conversationId. Filter to one or more with conversation. Event payloads are extensible. Pass the ETag of the last page as ifNoneMatch: an unchanged page answers 304, raised as an error with status 304.',
	},
	'sandboxes.agent.prompt': {
		riskLevel: 'destructive',
		description:
			'Prompt Sandbox. Queue a natural-language work item for an agent harness (Codex, Claude Code, pi, OpenCode, or Prime Agent) inside the sandbox. Observe progress with GET /sandboxes/{sandboxId}/events. A Sandbox runs many conversations in parallel. Runs an agent harness with the model key or subscription connected on the Boat dashboard: it spends model usage.',
	},
	'sandboxes.agent.steer': {
		riskLevel: 'destructive',
		description:
			'Steer a running turn. Send a new message to a turn that is already running, without losing what the agent is doing. This is what typing into a coding agent while it works does: the instruction is taken into account and the work continues. Spends model usage like a prompt.',
	},
	'sandboxes.commands.attach': {
		riskLevel: 'read',
		description:
			'Attach to a detached command. The output of a detached command as it is written, one JSON object per line, until the command ends. After 10 minutes the stream ends with a reconnect line: open it again with its offsets to continue with no gap. One open stream replaces polling. Needs the exec key scope. Returns { text, contentType }: the output as newline-delimited JSON frames, one per line.',
	},
	'sandboxes.commands.get': {
		riskLevel: 'read',
		description:
			'Get one command from the history. (GET /sandboxes/{sandboxId}/command-history/{commandId})',
	},
	'sandboxes.commands.getLogs': {
		riskLevel: 'read',
		description:
			"Read a command's stored output. Reads stdout or stderr from a byte offset, at most 1 MiB per call. Read on with nextOffset until done. A running detached command gains output every 30 s; a streamed one every 2 s. Works while the sandbox is stopped.",
	},
	'sandboxes.commands.getStatus': {
		riskLevel: 'read',
		description:
			'Get detached command status and logs. Without offsets, the answer holds the end of each log. With stdoutOffset or stderrOffset, it holds only the output written since those byte offsets, so each poll returns only new output. A sandbox agent too old for offsets answers 409 agent_outdated.',
	},
	'sandboxes.commands.listHistory': {
		riskLevel: 'read',
		description:
			'List the command and process history. Every command run through POST /sandboxes/{sandboxId}/commands in the last 7 days, and every other process that wrote to its stdout/stderr in the last 72 hours (mode process), newest first. Works while the sandbox is stopped.',
	},
	'sandboxes.commands.run': {
		riskLevel: 'destructive',
		description:
			'Execute a command in a sandbox. Runs the command synchronously by default (timeout configurable via timeoutSeconds, 600s cap). With detached: true the command starts in the background and a process id is returned immediately; poll /sandboxes/{sandboxId}/commands/{processId} for status and logs. Runs on the sandbox machine. In the first seconds after a fork or resume it can answer 502 sandbox_restoring (the command did not run): retry after 1-3 s. Without detached it waits for the command (timeoutSeconds, default 30, up to 600) and returns exitCode, stdout and stderr. For live output start it detached and read sandboxes.commands.attach.',
	},
	'sandboxes.commands.stop': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Stop a detached command. Sends SIGTERM to the command and every process it started, then SIGKILL to what is left after 5 s. Only a process started with detached can be stopped. The response carries the command's history record with its final state and output. Cannot be undone.",
	},
	'sandboxes.create': {
		riskLevel: 'destructive',
		description:
			'Create sandbox. Provision a new cloud computer. Store the returned sandbox.id with your product job/session record. Send an Idempotency-Key header to make this call safe to retry after a lost response without creating a second billable sandbox. Starts a machine that bills by the minute until it stops (ttlSeconds, default 1 h). Pass idempotencyKey to make a retry safe. A full start window answers 429 and is not retried.',
	},
	'sandboxes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete sandbox data. Accept irreversible background deletion of the sandbox machine, snapshots, and content-bearing records. This is not archive: the sandbox cannot be resumed. Saved snapshots and other shared artifacts remain independent. Poll the returned operation until completed. Pass the sandboxId again as confirm. Cannot be undone.',
	},
	'sandboxes.downloadArtifact': {
		riskLevel: 'read',
		description:
			'Download a sandbox artifact. Downloads one file of up to 50 MiB, under /home/user or /tmp, as raw bytes.',
	},
	'sandboxes.files.createDownloadUrl': {
		riskLevel: 'read',
		description:
			'Get a download URL for a sandbox file. Returns a short-lived URL that the sandbox serves itself. GET it to download the file as raw bytes, with no size limit and no Authorization header. The URL is bound to this path and expires after ttlSeconds (default 15 minutes, at most 1 hour). Needs file.read.',
	},
	'sandboxes.files.createFolder': {
		riskLevel: 'write',
		description:
			'Create a directory in a sandbox. Missing parent directories are created. An existing directory is not an error. Needs file.write.',
	},
	'sandboxes.files.createUploadUrl': {
		riskLevel: 'write',
		description:
			'Get an upload URL for a sandbox file. Returns a short-lived URL that the sandbox serves itself. PUT the file as the raw request body to write it, with no size limit and no Authorization header. Missing directories are created; an existing file is replaced only once the upload completes.',
	},
	'sandboxes.files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a file or directory in a sandbox. A directory needs recursive=true. A symlink is deleted itself, never its target. /home/user and /tmp themselves cannot be deleted. Needs file.write. Cannot be undone.',
	},
	'sandboxes.files.find': {
		riskLevel: 'read',
		description:
			'Find text in sandbox files. Every line under path that contains pattern. pattern is plain text; with regex=true it is an extended regular expression. Binary files are skipped and symlinks are not followed. Needs file.read.',
	},
	'sandboxes.files.getInfo': {
		riskLevel: 'read',
		description:
			'Get file or directory details in a sandbox. Size, permission bits, type and modification time. Needs file.read.',
	},
	'sandboxes.files.list': {
		riskLevel: 'read',
		description:
			'List a directory in a sandbox. One level, sorted by name. A symlink is listed as a symlink, not followed. Defaults to /home/user. Needs file.read.',
	},
	'sandboxes.files.move': {
		riskLevel: 'write',
		description:
			'Move or rename a file or directory in a sandbox. Works across /home/user and /tmp. A symlink is moved itself, never its target. Needs file.write.',
	},
	'sandboxes.files.read': {
		riskLevel: 'read',
		description:
			"Read a file from a sandbox. Files up to 5 MiB. For a larger file, use POST /sandboxes/{sandboxId}/files/download-url. On a sandbox that is still starting, the call waits until it is ready (up to 60 s, like a command), so it reads the sandbox's own disk and never the machine's stock one.",
	},
	'sandboxes.files.replace': {
		riskLevel: 'write',
		description:
			'Replace text in sandbox files. Replaces every occurrence of pattern with newValue in each file. Needs file.write.',
	},
	'sandboxes.files.search': {
		riskLevel: 'read',
		description:
			'Search files by name in a sandbox. Every file and directory under path whose name matches the glob pattern (for example *.py). Symlinks are not followed. Needs file.read.',
	},
	'sandboxes.files.setPermissions': {
		riskLevel: 'write',
		description:
			'Set file permissions in a sandbox. Sets the permission bits. Files belong to the sandbox user; the owner and group do not change. Needs file.write.',
	},
	'sandboxes.files.write': {
		riskLevel: 'write',
		description:
			"Write a file in a sandbox. Files up to 5 MiB after decoding. For a larger file, use POST /sandboxes/{sandboxId}/files/upload-url. On a sandbox that is still starting, the call waits until it is ready (up to 60 s, like a command): a sandbox's files are in place only once it is ready, so a write any earlier would not stay.",
	},
	'sandboxes.fork': {
		riskLevel: 'destructive',
		description:
			'Fork sandbox. Provision a new sandbox from an existing one. Send an Idempotency-Key header to make this call safe to retry after a lost response without creating a second billable fork. Starts a new machine that bills like a create. Pass idempotencyKey to make a retry safe.',
	},
	'sandboxes.get': {
		riskLevel: 'read',
		description:
			'Get sandbox. Poll this endpoint after create, stop, resume, or fork operations.',
	},
	'sandboxes.getAiUsage': {
		riskLevel: 'read',
		description:
			"Get sandbox AI usage. One sandbox's proxied AI usage per UTC day, credential and model, and whether it is blocked. Needs an API key with sandbox.read on the sandbox. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'sandboxes.getDesktopUrl': {
		riskLevel: 'write',
		description:
			'Get desktop streaming URL. Create or fetch a secret-bearing desktop/noVNC URL for live computer-use visibility. Use ?vnc=1 for noVNC; a provisioning: true response means poll again. The URL carries an access token: keep it out of logs.',
	},
	'sandboxes.getNetworkPolicy': {
		riskLevel: 'read',
		description:
			"Get a sandbox's network policy. The network policy (outbound and inbound), and whether the sandbox's host enforces it. To read the inbound list, add ?include=inboundAllow. Needs sandbox.read.",
	},
	'sandboxes.getStop': {
		riskLevel: 'read',
		description:
			'Get a stop by id. Returns one stop of this sandbox by the id that POST /sandboxes/{sandboxId}/stop returned. Old stops stay readable after a resume or a later stop. Returns 404 when the id is unknown or belongs to another sandbox.',
	},
	'sandboxes.getUsage': {
		riskLevel: 'read',
		description:
			"Get boat usage. Machine time one sandbox consumed, and what it costs, so you can bill your own users per sandbox. Same meter as GET /limits: billable seconds with the sandbox type's multiplier applied, paused past a refused stop, never counting time stopped.",
	},
	'sandboxes.hostPort': {
		riskLevel: 'write',
		description:
			'Expose a sandbox port on a public HTTPS URL. Registers a stable https://<sandbox-subdomain>-<port>.on.boat.dev route for a port inside the sandbox and opens the sandbox firewall for it. Idempotent: calling it again for the same sandbox and port returns the same URL and token.',
	},
	'sandboxes.list': {
		riskLevel: 'read',
		description:
			"List sandboxes. Your sandboxes. In an organization's scope (the active wallet, org, or X-Boat-Org) the list also holds every sandbox that organization pays for, whoever created it; createdBy and access say whose it is and what you may do with it.",
	},
	'sandboxes.listProcesses': {
		riskLevel: 'read',
		description:
			'List the processes in a sandbox. A running sandbox: every user-space process, read now, busiest first. A stopped sandbox: the last sample kept (live: false).',
	},
	'sandboxes.recover': {
		riskLevel: 'destructive',
		description:
			'Recover a sandbox that stopped responding. Power-cycle the machine of a sandbox that stopped answering. The disk is not touched. The sandbox usually answers again within 1-2 minutes and then saves your work by itself; sandbox.recovered fires when it does. Refused with 409: - sandbox_is_reachable: the sandbox answers normally. Power-cycles the machine. A sandbox that still answers gets 409 (and some machines cannot be power-cycled: 409 with the boat stop --force advice).',
	},
	'sandboxes.resume': {
		riskLevel: 'destructive',
		description:
			'Resume sandbox. Starts the machine again; it bills until it stops.',
	},
	'sandboxes.setAiAccess': {
		riskLevel: 'write',
		description:
			"Block or unblock sandbox AI access. Blocks or unblocks the sandbox's AI placeholders, running or stopped. The proxy refuses a blocked sandbox's requests with 403. It has no effect on a sandbox that holds real keys. The sandbox creator, or a manager of its credential profile, can call it. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'sandboxes.setNetworkPolicy': {
		riskLevel: 'write',
		description:
			"Replace a sandbox's network policy. Sets the policy, on a running or a stopped sandbox. The side that the request does not name (mode and allow, or inbound and inboundAllow) stays as it is. To add one address to the inbound list, send inboundAllowAdd. A change also ends open connections that the new policy does not allow.",
	},
	'sandboxes.share': {
		riskLevel: 'write',
		description:
			'Share sandbox with the organization. Let every member of the organization that pays for this sandbox use it. A sandbox that holds none of your personal logins is shared at once. Only a sandbox billed to an organization can be shared (400 otherwise).',
	},
	'sandboxes.snapshots.deleteAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete all snapshots of a sandbox. Accept irreversible deletion of every unpinned snapshot of this sandbox. The sandbox itself and its saved snapshots stay. Snapshots disappear from lists, restores and forks immediately; their stored data is purged in the background. Set X-Ascii-Confirm-Delete to the sandbox id. Pass the sandboxId again as confirm. Cannot be undone.',
	},
	'sandboxes.snapshots.getLatest': {
		riskLevel: 'read',
		description:
			'Get latest boat snapshot. Return the most recent completed snapshot for this sandbox, or null if it has none.',
	},
	'sandboxes.snapshots.list': {
		riskLevel: 'read',
		description:
			'List boat snapshots. List visible completed snapshots for one sandbox with uncapped cursor pagination.',
	},
	'sandboxes.stop': {
		riskLevel: 'write',
		description:
			"Stop and archive sandbox. Stop active work and archive/snapshot the sandbox for later resume or fork. A stop always saves the sandbox's disk first. If that save is failing, the stop is refused and the sandbox keeps running so your work is not discarded, we retry automatically and email you.",
	},
	'sandboxes.unshare': {
		riskLevel: 'write',
		description:
			'Make an organization sandbox private. Make a shared organization sandbox private again, at once. Only you can then use it. Teammates still see it in their list and can stop it. Their SSH keys are removed from the running machine. Nothing on the sandbox changes: files, installs and its environment stay. Only a sandbox billed to an organization can be made private (400 otherwise).',
	},
	'sandboxes.update': {
		riskLevel: 'write',
		description: 'Update sandbox. (PATCH /sandboxes/{sandboxId})',
	},
	'savedSnapshots.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a saved snapshot. Remove a saved snapshot and release its storage (boat snapshot rm <name> in the CLI). Sandboxes already deployed from it are unaffected. Cannot be undone.',
	},
	'savedSnapshots.get': {
		riskLevel: 'read',
		description: 'Get a saved snapshot. (GET /saved-snapshots/{name})',
	},
	'savedSnapshots.list': {
		riskLevel: 'read',
		description:
			'List saved snapshots. List your saved snapshots, newest first. An unknown query parameter is refused with 400 invalid_query, which names it.',
	},
	'savedSnapshots.save': {
		riskLevel: 'destructive',
		description:
			"Save a saved snapshot. Freeze a sandbox's current state under a name (boat snapshot <id> <name> in the CLI). Answers 202 immediately with the snapshot in saving; a running sandbox takes a fresh capture first, which can run minutes. Poll GET /saved-snapshots/{name} until the status settles at ready or failed. Snapshots past the plan allowance bill monthly. The free trial refuses it: 403 (live 11-28).",
	},
	'savedSnapshots.shares.create': {
		riskLevel: 'write',
		description:
			'Share a saved snapshot. Make a secret code that lets any Boat account create a sandbox from this saved snapshot (boat snapshot share <name> in the CLI). The response shows the code once; Boat stores only a hash. Re-saving the name changes what the code deploys. Removing the name removes its codes. Mints a share code anyone with it can use to start a sandbox from the snapshot.',
	},
	'savedSnapshots.shares.list': {
		riskLevel: 'read',
		description:
			'List share codes of a saved snapshot. List the share codes of a saved snapshot, active and revoked (boat snapshot shares <name> in the CLI). The full codes are not returned. Needs snapshot.read.',
	},
	'savedSnapshots.shares.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke a share code. Revoke a share code (boat snapshot unshare <name> <share-id> in the CLI). The code stops creating new sandboxes. Sandboxes already created from it keep their own copy. Needs snapshot.write. Cannot be undone.',
	},
	'secrets.get': {
		riskLevel: 'read',
		description:
			'Get Boat secrets setup. Returns the environment variables and secret files configured for sandboxes. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'secrets.update': {
		riskLevel: 'write',
		description:
			'Update Boat secrets setup. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'snapshots.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Permanently delete snapshot data. Accept irreversible deletion of an unpinned snapshot owned by the authenticated account. Any such snapshot is accepted: it disappears from lists, restores and forks immediately, and its stored data is purged in the background once nothing still reads it (see the operation's stage). Pass the snapshotId again as confirm. Cannot be undone.",
	},
	'snapshots.getDownload': {
		riskLevel: 'read',
		description:
			'Get snapshot download. Return time-limited signed URLs for every chunk needed to reconstruct the sandbox filesystem at this snapshot (the full chain, base through this generation), plus the inventory. Download the chunks and reassemble them as described by reconstruct.',
	},
	'snapshots.getFile': {
		riskLevel: 'read',
		description:
			"Download a file or folder from a snapshot. Stream a single file's bytes, or a folder subtree as a tar archive, directly out of a snapshot, the sandbox can be stopped or archived; the machine is never contacted. Use GET /snapshots/{snapshotId}/tree to list paths, then pass one here.",
	},
	'snapshots.getTree': {
		riskLevel: 'read',
		description:
			'Get snapshot file tree. List the files and folders captured in a snapshot, with sizes. Returns a flat list of entries you can render as a tree.',
	},
	'snapshots.list': {
		riskLevel: 'read',
		description:
			'List snapshots. List visible completed snapshots across all of your sandboxes using immutable ownership attribution. Pinned, deletion-scheduled, and privacy-fenced sandbox snapshots are omitted. Follow nextCursor through the complete history; there is no hidden 500-snapshot cap.',
	},
	'telemetry.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove OpenTelemetry export. Removes the export and its queued deliveries. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key. Cannot be undone.',
	},
	'telemetry.get': {
		riskLevel: 'read',
		description:
			"Get OpenTelemetry export. Returns the account's OpenTelemetry export, or telemetry null when none is set. Header values are never included. Needs an API key with account.admin. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'telemetry.set': {
		riskLevel: 'write',
		description:
			"Set OpenTelemetry export. Sets the account's one OTLP/HTTP destination, or replaces it. Boat then sends one metrics export at once and returns the collector's answer in test. Every 60 seconds Boat sends the sandbox and account gauges to <endpoint>/v1/metrics. Each sandbox lifecycle event goes to <endpoint>/v1/logs. Boat resolves the endpoint host when it is set: a name that does not resolve answers 400. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Create webhook. Registers an account-wide endpoint for sandbox lifecycle events. The endpoint must use HTTPS on port 443 and resolve only to public addresses. Redirects are not followed during delivery. The signing secret is returned only in this response. An account can register at most 10 unique endpoint URLs. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete webhook. Deletes the endpoint and its queued deliveries. An attempt already in flight can still arrive. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key. Cannot be undone.',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description:
			'Get webhook. Returns webhook metadata without the signing secret. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List webhooks. Lists account-wide sandbox lifecycle webhook endpoints. Signing secrets are never included. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
	'webhooks.rotateSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Rotate webhook signing secret. Replaces the endpoint's signing secret. The new secret is returned only in this response; briefly accept the old secret for attempts already in flight. The old signing secret stops working. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.",
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			'Update webhook. Updates the name, endpoint URL, or subscribed events without changing the signing secret. An organization API key gets 403 api_key_org_forbidden here (live 11-28): it needs a personal account key.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof boatEndpointsNested>;
