// Generated with endpoints/operation-types.ts from Tailscale's OpenAPI spec:
// one entry per operation in tailscale-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { tailscaleSchemaEntry } from './openapi-schema';
import { createTailscaleOperation as op } from './operations';

export const tailscaleEndpointsNested = {
	contacts: {
		get: op('contacts.get'),
		resendVerificationEmail: op('contacts.resendVerificationEmail'),
		update: op('contacts.update'),
	},
	deviceInvites: {
		accept: op('deviceInvites.accept'),
		create: op('deviceInvites.create'),
		delete: op('deviceInvites.delete'),
		get: op('deviceInvites.get'),
		list: op('deviceInvites.list'),
		resend: op('deviceInvites.resend'),
	},
	devices: {
		authorize: op('devices.authorize'),
		delete: op('devices.delete'),
		expireKey: op('devices.expireKey'),
		get: op('devices.get'),
		list: op('devices.list'),
		postureAttributes: {
			batchUpdate: op('devices.postureAttributes.batchUpdate'),
			delete: op('devices.postureAttributes.delete'),
			get: op('devices.postureAttributes.get'),
			set: op('devices.postureAttributes.set'),
		},
		routes: {
			list: op('devices.routes.list'),
			set: op('devices.routes.set'),
		},
		setIp: op('devices.setIp'),
		setName: op('devices.setName'),
		setTags: op('devices.setTags'),
		updateKey: op('devices.updateKey'),
	},
	dns: {
		configuration: {
			get: op('dns.configuration.get'),
			set: op('dns.configuration.set'),
		},
		nameservers: {
			list: op('dns.nameservers.list'),
			set: op('dns.nameservers.set'),
		},
		preferences: {
			get: op('dns.preferences.get'),
			set: op('dns.preferences.set'),
		},
		searchPaths: {
			list: op('dns.searchPaths.list'),
			set: op('dns.searchPaths.set'),
		},
		splitDns: {
			get: op('dns.splitDns.get'),
			set: op('dns.splitDns.set'),
			update: op('dns.splitDns.update'),
		},
	},
	keys: {
		create: op('keys.create'),
		delete: op('keys.delete'),
		get: op('keys.get'),
		list: op('keys.list'),
		update: op('keys.update'),
	},
	logging: {
		awsExternalId: {
			get: op('logging.awsExternalId.get'),
			validate: op('logging.awsExternalId.validate'),
		},
		configurationLogs: {
			list: op('logging.configurationLogs.list'),
		},
		networkLogs: {
			list: op('logging.networkLogs.list'),
		},
		streaming: {
			disable: op('logging.streaming.disable'),
			get: op('logging.streaming.get'),
			getStatus: op('logging.streaming.getStatus'),
			set: op('logging.streaming.set'),
		},
	},
	oauthApps: {
		create: op('oauthApps.create'),
		delete: op('oauthApps.delete'),
		get: op('oauthApps.get'),
		list: op('oauthApps.list'),
		update: op('oauthApps.update'),
	},
	policyFile: {
		get: op('policyFile.get'),
		preview: op('policyFile.preview'),
		set: op('policyFile.set'),
		validate: op('policyFile.validate'),
	},
	postureIntegrations: {
		create: op('postureIntegrations.create'),
		delete: op('postureIntegrations.delete'),
		get: op('postureIntegrations.get'),
		list: op('postureIntegrations.list'),
		update: op('postureIntegrations.update'),
	},
	services: {
		delete: op('services.delete'),
		get: op('services.get'),
		hosts: {
			getApproval: op('services.hosts.getApproval'),
			list: op('services.hosts.list'),
			setApproval: op('services.hosts.setApproval'),
		},
		list: op('services.list'),
		update: op('services.update'),
	},
	tailnetSettings: {
		get: op('tailnetSettings.get'),
		update: op('tailnetSettings.update'),
	},
	tailnets: {
		create: op('tailnets.create'),
		delete: op('tailnets.delete'),
		list: op('tailnets.list'),
	},
	userInvites: {
		create: op('userInvites.create'),
		delete: op('userInvites.delete'),
		get: op('userInvites.get'),
		list: op('userInvites.list'),
		resend: op('userInvites.resend'),
	},
	users: {
		approve: op('users.approve'),
		delete: op('users.delete'),
		get: op('users.get'),
		list: op('users.list'),
		restore: op('users.restore'),
		suspend: op('users.suspend'),
		updateRole: op('users.updateRole'),
	},
	webhooks: {
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		get: op('webhooks.get'),
		list: op('webhooks.list'),
		rotateSecret: op('webhooks.rotateSecret'),
		test: op('webhooks.test'),
		update: op('webhooks.update'),
	},
} as const;

export const tailscaleEndpointSchemas = {
	'contacts.get': tailscaleSchemaEntry('contacts.get'),
	'contacts.resendVerificationEmail': tailscaleSchemaEntry(
		'contacts.resendVerificationEmail',
	),
	'contacts.update': tailscaleSchemaEntry('contacts.update'),
	'deviceInvites.accept': tailscaleSchemaEntry('deviceInvites.accept'),
	'deviceInvites.create': tailscaleSchemaEntry('deviceInvites.create'),
	'deviceInvites.delete': tailscaleSchemaEntry('deviceInvites.delete'),
	'deviceInvites.get': tailscaleSchemaEntry('deviceInvites.get'),
	'deviceInvites.list': tailscaleSchemaEntry('deviceInvites.list'),
	'deviceInvites.resend': tailscaleSchemaEntry('deviceInvites.resend'),
	'devices.authorize': tailscaleSchemaEntry('devices.authorize'),
	'devices.delete': tailscaleSchemaEntry('devices.delete'),
	'devices.expireKey': tailscaleSchemaEntry('devices.expireKey'),
	'devices.get': tailscaleSchemaEntry('devices.get'),
	'devices.list': tailscaleSchemaEntry('devices.list'),
	'devices.postureAttributes.batchUpdate': tailscaleSchemaEntry(
		'devices.postureAttributes.batchUpdate',
	),
	'devices.postureAttributes.delete': tailscaleSchemaEntry(
		'devices.postureAttributes.delete',
	),
	'devices.postureAttributes.get': tailscaleSchemaEntry(
		'devices.postureAttributes.get',
	),
	'devices.postureAttributes.set': tailscaleSchemaEntry(
		'devices.postureAttributes.set',
	),
	'devices.routes.list': tailscaleSchemaEntry('devices.routes.list'),
	'devices.routes.set': tailscaleSchemaEntry('devices.routes.set'),
	'devices.setIp': tailscaleSchemaEntry('devices.setIp'),
	'devices.setName': tailscaleSchemaEntry('devices.setName'),
	'devices.setTags': tailscaleSchemaEntry('devices.setTags'),
	'devices.updateKey': tailscaleSchemaEntry('devices.updateKey'),
	'dns.configuration.get': tailscaleSchemaEntry('dns.configuration.get'),
	'dns.configuration.set': tailscaleSchemaEntry('dns.configuration.set'),
	'dns.nameservers.list': tailscaleSchemaEntry('dns.nameservers.list'),
	'dns.nameservers.set': tailscaleSchemaEntry('dns.nameservers.set'),
	'dns.preferences.get': tailscaleSchemaEntry('dns.preferences.get'),
	'dns.preferences.set': tailscaleSchemaEntry('dns.preferences.set'),
	'dns.searchPaths.list': tailscaleSchemaEntry('dns.searchPaths.list'),
	'dns.searchPaths.set': tailscaleSchemaEntry('dns.searchPaths.set'),
	'dns.splitDns.get': tailscaleSchemaEntry('dns.splitDns.get'),
	'dns.splitDns.set': tailscaleSchemaEntry('dns.splitDns.set'),
	'dns.splitDns.update': tailscaleSchemaEntry('dns.splitDns.update'),
	'keys.create': tailscaleSchemaEntry('keys.create'),
	'keys.delete': tailscaleSchemaEntry('keys.delete'),
	'keys.get': tailscaleSchemaEntry('keys.get'),
	'keys.list': tailscaleSchemaEntry('keys.list'),
	'keys.update': tailscaleSchemaEntry('keys.update'),
	'logging.awsExternalId.get': tailscaleSchemaEntry(
		'logging.awsExternalId.get',
	),
	'logging.awsExternalId.validate': tailscaleSchemaEntry(
		'logging.awsExternalId.validate',
	),
	'logging.configurationLogs.list': tailscaleSchemaEntry(
		'logging.configurationLogs.list',
	),
	'logging.networkLogs.list': tailscaleSchemaEntry('logging.networkLogs.list'),
	'logging.streaming.disable': tailscaleSchemaEntry(
		'logging.streaming.disable',
	),
	'logging.streaming.get': tailscaleSchemaEntry('logging.streaming.get'),
	'logging.streaming.getStatus': tailscaleSchemaEntry(
		'logging.streaming.getStatus',
	),
	'logging.streaming.set': tailscaleSchemaEntry('logging.streaming.set'),
	'oauthApps.create': tailscaleSchemaEntry('oauthApps.create'),
	'oauthApps.delete': tailscaleSchemaEntry('oauthApps.delete'),
	'oauthApps.get': tailscaleSchemaEntry('oauthApps.get'),
	'oauthApps.list': tailscaleSchemaEntry('oauthApps.list'),
	'oauthApps.update': tailscaleSchemaEntry('oauthApps.update'),
	'policyFile.get': tailscaleSchemaEntry('policyFile.get'),
	'policyFile.preview': tailscaleSchemaEntry('policyFile.preview'),
	'policyFile.set': tailscaleSchemaEntry('policyFile.set'),
	'policyFile.validate': tailscaleSchemaEntry('policyFile.validate'),
	'postureIntegrations.create': tailscaleSchemaEntry(
		'postureIntegrations.create',
	),
	'postureIntegrations.delete': tailscaleSchemaEntry(
		'postureIntegrations.delete',
	),
	'postureIntegrations.get': tailscaleSchemaEntry('postureIntegrations.get'),
	'postureIntegrations.list': tailscaleSchemaEntry('postureIntegrations.list'),
	'postureIntegrations.update': tailscaleSchemaEntry(
		'postureIntegrations.update',
	),
	'services.delete': tailscaleSchemaEntry('services.delete'),
	'services.get': tailscaleSchemaEntry('services.get'),
	'services.hosts.getApproval': tailscaleSchemaEntry(
		'services.hosts.getApproval',
	),
	'services.hosts.list': tailscaleSchemaEntry('services.hosts.list'),
	'services.hosts.setApproval': tailscaleSchemaEntry(
		'services.hosts.setApproval',
	),
	'services.list': tailscaleSchemaEntry('services.list'),
	'services.update': tailscaleSchemaEntry('services.update'),
	'tailnetSettings.get': tailscaleSchemaEntry('tailnetSettings.get'),
	'tailnetSettings.update': tailscaleSchemaEntry('tailnetSettings.update'),
	'tailnets.create': tailscaleSchemaEntry('tailnets.create'),
	'tailnets.delete': tailscaleSchemaEntry('tailnets.delete'),
	'tailnets.list': tailscaleSchemaEntry('tailnets.list'),
	'userInvites.create': tailscaleSchemaEntry('userInvites.create'),
	'userInvites.delete': tailscaleSchemaEntry('userInvites.delete'),
	'userInvites.get': tailscaleSchemaEntry('userInvites.get'),
	'userInvites.list': tailscaleSchemaEntry('userInvites.list'),
	'userInvites.resend': tailscaleSchemaEntry('userInvites.resend'),
	'users.approve': tailscaleSchemaEntry('users.approve'),
	'users.delete': tailscaleSchemaEntry('users.delete'),
	'users.get': tailscaleSchemaEntry('users.get'),
	'users.list': tailscaleSchemaEntry('users.list'),
	'users.restore': tailscaleSchemaEntry('users.restore'),
	'users.suspend': tailscaleSchemaEntry('users.suspend'),
	'users.updateRole': tailscaleSchemaEntry('users.updateRole'),
	'webhooks.create': tailscaleSchemaEntry('webhooks.create'),
	'webhooks.delete': tailscaleSchemaEntry('webhooks.delete'),
	'webhooks.get': tailscaleSchemaEntry('webhooks.get'),
	'webhooks.list': tailscaleSchemaEntry('webhooks.list'),
	'webhooks.rotateSecret': tailscaleSchemaEntry('webhooks.rotateSecret'),
	'webhooks.test': tailscaleSchemaEntry('webhooks.test'),
	'webhooks.update': tailscaleSchemaEntry('webhooks.update'),
} satisfies RequiredPluginEndpointSchemas<typeof tailscaleEndpointsNested>;

export const tailscaleEndpointMeta = {
	'contacts.get': {
		riskLevel: 'read',
		description:
			"Get the tailnet's account, support and security contact emails.",
	},
	'contacts.resendVerificationEmail': {
		riskLevel: 'destructive',
		description: 'Email the verification link for a contact address again.',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Change the account, support or security contact email. Tailscale emails the new address to verify it.',
	},
	'deviceInvites.accept': {
		riskLevel: 'write',
		description:
			"Accept a device share invite from another tailnet into this key's tailnet, by its invite URL or code. The shared device then appears in devices.list. Needs a user's API access token: a share belongs to a user, so an OAuth client can't accept one.",
	},
	'deviceInvites.create': {
		riskLevel: 'destructive',
		description:
			'Share a device with people outside the tailnet. Each invite gives an invite URL to send; with email set, Tailscale emails the invite itself. allowExitNode lets the recipient use the device as an exit node; multiUse lets several people accept one link. deviceId is the device `id` or `nodeId` from devices.list.',
	},
	'deviceInvites.delete': {
		riskLevel: 'write',
		description: 'Delete a device share invite; its link stops working.',
	},
	'deviceInvites.get': {
		riskLevel: 'read',
		description:
			'Get a device share invite: its invite URL, who accepted it and when.',
	},
	'deviceInvites.list': {
		riskLevel: 'read',
		description:
			'List the share invites for a device (who it was shared with, accepted or not); null when there are none. deviceId is the device `id` or `nodeId` from devices.list.',
	},
	'deviceInvites.resend': {
		riskLevel: 'destructive',
		description:
			'Email a device share invite again to the address it was created for.',
	},
	'devices.authorize': {
		riskLevel: 'write',
		description:
			"Approve (authorized: true) or revoke approval for (authorized: false) a device when the tailnet requires device approval. Revoking cuts the device's access until it is approved again. deviceId is the device `id` or `nodeId` from devices.list.",
	},
	'devices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a device from the tailnet. It loses access at once and must be signed in again (with a new auth key or login) to rejoin. Cannot be undone. deviceId is the device `id` or `nodeId` from devices.list.',
	},
	'devices.expireKey': {
		riskLevel: 'destructive',
		description:
			"Expire a device's node key now: the device is disconnected until someone signs in on it again. Use it to cut off a lost or compromised machine. deviceId is the device `id` or `nodeId` from devices.list.",
	},
	'devices.get': {
		riskLevel: 'read',
		description:
			'Get one device. fields: "all" adds routes, posture and connectivity details. deviceId is the device `id` or `nodeId` from devices.list.',
	},
	'devices.list': {
		riskLevel: 'read',
		description:
			'List the devices in the tailnet: name, hostname, Tailscale IPs, owner, OS, client version, tags, last seen, key expiry, authorized. Pass fields: "all" to add advertised and enabled routes, posture and connectivity details. filters narrows the list on the server by exact match on top-level device fields, all of them required to match (for example { tags: ["tag:prod"], isEphemeral: true }).',
	},
	'devices.postureAttributes.batchUpdate': {
		riskLevel: 'write',
		description:
			'Set or delete custom posture attributes on many devices in one call. A null value deletes that attribute. Applied all together or not at all.',
	},
	'devices.postureAttributes.delete': {
		riskLevel: 'write',
		description:
			'Delete a custom posture attribute (custom:...) from a device. deviceId is the device `id` or `nodeId` from devices.list.',
	},
	'devices.postureAttributes.get': {
		riskLevel: 'read',
		description:
			"Get a device's posture attributes: Tailscale's own (node:os, node:tsVersion, node:tsReleaseTrack, ...) and custom ones (custom:<name>) set through the API or a posture integration. deviceId is the device `id` or `nodeId` from devices.list.",
	},
	'devices.postureAttributes.set': {
		riskLevel: 'write',
		description:
			'Set a custom posture attribute on a device. attributeKey must start with custom: (for example custom:agentApproved); value is a string, number or boolean. expiry (RFC 3339) makes it lapse on its own. Policy postures can then allow or deny access on it. deviceId is the device `id` or `nodeId` from devices.list.',
	},
	'devices.routes.list': {
		riskLevel: 'read',
		description:
			'List the subnet routes and exit-node routes a device advertises and which of them are enabled. deviceId is the device `id` or `nodeId` from devices.list.',
	},
	'devices.routes.set': {
		riskLevel: 'write',
		description:
			'Set which of the routes a device advertises are enabled (subnet routes, and 0.0.0.0/0 plus ::/0 for an exit node). Replaces the enabled list: routes left out are turned off. Only routes the device advertises can be enabled. deviceId is the device `id` or `nodeId` from devices.list.',
	},
	'devices.setIp': {
		riskLevel: 'write',
		description:
			"Change a device's Tailscale IPv4 address to an unused one in the tailnet's range (100.64.0.0/10 by default). Existing connections to the old address break and must reconnect to the new one. deviceId is the device `id` or `nodeId` from devices.list.",
	},
	'devices.setName': {
		riskLevel: 'write',
		description:
			'Rename a device: its MagicDNS name becomes <name>.<tailnet>.ts.net. Pass name: "" to go back to the machine\'s own hostname. Connections using the old name stop resolving. deviceId is the device `id` or `nodeId` from devices.list.',
	},
	'devices.setTags': {
		riskLevel: 'write',
		description:
			"Replace a device's ACL tags (tag:server, tag:mcp, ...). Each tag must be defined in the policy file and owned by the caller (tagOwners). Tagging a user's device turns it into a tagged device that no longer belongs to that user, and the access rules for its tags apply from then on. Pass tags: [] to remove every tag. deviceId is the device `id` or `nodeId` from devices.list.",
	},
	'devices.updateKey': {
		riskLevel: 'write',
		description:
			'Turn key expiry off (keyExpiryDisabled: true) or back on for a device, for servers that should stay signed in. deviceId is the device `id` or `nodeId` from devices.list.',
	},
	'dns.configuration.get': {
		riskLevel: 'read',
		description:
			"Get the tailnet's whole DNS configuration in one object: nameservers, split DNS, search paths and preferences.",
	},
	'dns.configuration.set': {
		riskLevel: 'write',
		description:
			"Replace the tailnet's whole DNS configuration in one call (nameservers, split DNS, search paths, preferences).",
	},
	'dns.nameservers.list': {
		riskLevel: 'read',
		description: 'List the global DNS nameservers devices use.',
	},
	'dns.nameservers.set': {
		riskLevel: 'write',
		description:
			'Replace the global DNS nameservers (IP addresses). An empty list removes them all and turns MagicDNS off.',
	},
	'dns.preferences.get': {
		riskLevel: 'read',
		description: 'Get whether MagicDNS is on.',
	},
	'dns.preferences.set': {
		riskLevel: 'write',
		description:
			'Turn MagicDNS on or off. Turning it on needs at least one nameserver; turning it off breaks <name>.ts.net lookups.',
	},
	'dns.searchPaths.list': {
		riskLevel: 'read',
		description: 'List the DNS search domains pushed to devices.',
	},
	'dns.searchPaths.set': {
		riskLevel: 'write',
		description: 'Replace the DNS search domains pushed to devices.',
	},
	'dns.splitDns.get': {
		riskLevel: 'read',
		description: 'Get split DNS: which nameservers answer for which domains.',
	},
	'dns.splitDns.set': {
		riskLevel: 'write',
		description:
			'Replace the whole split DNS map (domain to nameservers). Domains left out are removed.',
	},
	'dns.splitDns.update': {
		riskLevel: 'write',
		description:
			'Change split DNS for the given domains only; a domain set to null is removed, others are kept.',
	},
	'keys.create': {
		riskLevel: 'destructive',
		description:
			'Create an auth key (keyType "auth", the default) that adds a device to the tailnet, or a trust credential (keyType "client" for an OAuth client, "federated" for a federated identity). For an agent or server, make the auth key preauthorized, tagged (capabilities.devices.create.tags) and ephemeral so the node is removed when it goes offline. The secret is returned once in `key`: hand it to the machine right away, never paste it into chat.',
	},
	'keys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke a key. Devices already added with an auth key stay; anything using a revoked API token or OAuth client stops working. Cannot be undone.',
	},
	'keys.get': {
		riskLevel: 'read',
		description:
			'Get a key: type, description, scopes, tags, created, expires, revoked. Never returns the secret.',
	},
	'keys.list': {
		riskLevel: 'read',
		description:
			'List the keys of the caller (all: true for every key in the tailnet): auth keys, API access tokens, OAuth clients and federated identities, with expiry, scopes and tags. Never returns the secrets.',
	},
	'keys.update': {
		riskLevel: 'write',
		description:
			"Change an OAuth client's or federated identity's description, scopes or tags (auth keys and API tokens can't be edited).",
	},
	'logging.awsExternalId.get': {
		riskLevel: 'write',
		description:
			'Get (or create on first use) the AWS external ID to put in an IAM role trust policy before streaming logs to S3.',
	},
	'logging.awsExternalId.validate': {
		riskLevel: 'read',
		description:
			'Check that an IAM role trusts Tailscale with this external ID, before log streaming to S3 is turned on.',
	},
	'logging.configurationLogs.list': {
		riskLevel: 'read',
		description:
			'Read the configuration audit log between start and end (RFC 3339): who changed the policy file, approved or deleted a device, created a key, changed a setting, with old and new values. Filter by actor, target or event (TAILNET.UPDATE.ACL, NODE.CREATE, NODE.APPROVE, API_KEY.CREATE, USER.UPDATE.USER_ROLE, ...). Use it to answer "who changed what, and when".',
	},
	'logging.networkLogs.list': {
		riskLevel: 'read',
		description:
			'Read network flow logs between start and end (RFC 3339): which device talked to which, over what protocol and ports, and how many bytes. Network flow logging must be turned on (Premium and Enterprise plans).',
	},
	'logging.streaming.disable': {
		riskLevel: 'destructive',
		description:
			'Stop streaming configuration or network logs; the destination settings are removed.',
	},
	'logging.streaming.get': {
		riskLevel: 'read',
		description:
			'Get where configuration or network logs are streamed (Splunk, Elastic, Panther, Cribl, CrowdStrike, Datadog, Axiom or S3).',
	},
	'logging.streaming.getStatus': {
		riskLevel: 'read',
		description:
			'Get whether log streaming to a SIEM is working for configuration or network logs, and its last errors.',
	},
	'logging.streaming.set': {
		riskLevel: 'write',
		description:
			'Start or change streaming of configuration or network logs to a SIEM or bucket. Replaces the current destination.',
	},
	'oauthApps.create': {
		riskLevel: 'destructive',
		description:
			'Register an OAuth app in the tailnet with its redirect URIs and scopes. The client secret is returned once.',
	},
	'oauthApps.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an OAuth app; sign-ins and tokens issued through it stop working.',
	},
	'oauthApps.get': {
		riskLevel: 'read',
		description:
			'Get an OAuth app: name, redirect URIs, scopes. Never returns the secret.',
	},
	'oauthApps.list': {
		riskLevel: 'read',
		description:
			'List the OAuth apps registered in the tailnet (apps people in the tailnet sign in to so it can act on their behalf).',
	},
	'oauthApps.update': {
		riskLevel: 'write',
		description: "Replace an OAuth app's name, redirect URIs or scopes.",
	},
	'policyFile.get': {
		riskLevel: 'read',
		description:
			'Get the tailnet\'s policy file (ACLs or grants, groups, tagOwners, autoApprovers, postures, tests). format "hujson" (the default) keeps comments and returns the text; "json" returns an object without comments. etag is the version: pass it as ifMatch to policyFile.set so another edit made in between is not overwritten. details: true also returns warnings and errors.',
	},
	'policyFile.preview': {
		riskLevel: 'read',
		description:
			'Show which rules of a policy file (the current one or a draft) apply to a user (type "user", previewFor their email) or a destination (type "ipport", previewFor "100.101.102.103:443"), without saving anything.',
	},
	'policyFile.set': {
		riskLevel: 'destructive',
		description:
			"Replace the tailnet's policy file, as HuJSON text (keeps comments) or a JSON object. It controls who can reach what across the whole tailnet, so run policyFile.validate first, and pass ifMatch with the etag from policyFile.get: Tailscale then refuses the write if the file changed since. Tests in the file must pass or nothing is saved.",
	},
	'policyFile.validate': {
		riskLevel: 'read',
		description:
			'Check a draft policy file without saving it: pass policy (HuJSON text or object) to parse it and run its tests, or tests (at least one) to run ACL tests against the current file. null or an empty message means everything passed. Problems still answer 200: message holds the parse error, or "test(s) failed" with each failing test in data.',
	},
	'postureIntegrations.create': {
		riskLevel: 'write',
		description:
			'Connect a device posture provider, so its attributes (compliance, risk score) can gate access in the policy file.',
	},
	'postureIntegrations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disconnect a device posture provider; rules that rely on its attributes stop matching.',
	},
	'postureIntegrations.get': {
		riskLevel: 'read',
		description: 'Get a device posture integration and its sync status.',
	},
	'postureIntegrations.list': {
		riskLevel: 'read',
		description:
			'List device posture integrations (CrowdStrike Falcon, Intune, Jamf Pro, Kandji, Kolide, SentinelOne, ...).',
	},
	'postureIntegrations.update': {
		riskLevel: 'write',
		description:
			'Change a device posture integration (credentials, tenant, which devices it reads).',
	},
	'services.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Tailscale Service; its address stops answering on every host.',
	},
	'services.get': {
		riskLevel: 'read',
		description:
			'Get a Tailscale Service: its addresses, ports, tags and comment. serviceName is svc:<name>.',
	},
	'services.hosts.getApproval': {
		riskLevel: 'read',
		description:
			'Get whether a device is approved to serve a Tailscale Service.',
	},
	'services.hosts.list': {
		riskLevel: 'read',
		description:
			'List the devices that advertise a Tailscale Service and whether each is approved to serve it.',
	},
	'services.hosts.setApproval': {
		riskLevel: 'write',
		description:
			'Approve (approved: true) or stop (false) a device serving a Tailscale Service, when its tags are not auto-approved.',
	},
	'services.list': {
		riskLevel: 'read',
		description:
			'List Tailscale Services: named virtual endpoints (svc:<name>) with their own Tailscale IPs and MagicDNS name, served by one or more hosts. Use them to give an internal app or MCP server a stable address on the tailnet.',
	},
	'services.update': {
		riskLevel: 'write',
		description:
			'Create or replace a Tailscale Service (serviceName svc:<name>; name defaults to it): ports ("tcp:443", "do-not-validate") and tags. Hosts then advertise it with `tailscale serve --service=svc:<name>`, and the policy file grants who may reach it.',
	},
	'tailnetSettings.get': {
		riskLevel: 'read',
		description:
			'Get tailnet settings: device and user approval, device auto-updates, key expiry days, who may join, posture identity collection, network flow logging, regional routing, HTTPS.',
	},
	'tailnetSettings.update': {
		riskLevel: 'write',
		description:
			'Change tailnet settings; only the fields sent change. Turning on device approval holds every new device until someone approves it. Tailscale answers without the new values: read them with tailnetSettings.get.',
	},
	'tailnets.create': {
		riskLevel: 'destructive',
		description:
			'Create an API-only tailnet in the organization (no human users, not in the admin console), for an app or agent fleet that manages its own network. At most 10 tailnets per organization. The new OAuth client secret is returned once.',
	},
	'tailnets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a whole tailnet with all of its users, devices and settings. Only API-only tailnets can be deleted this way. Cannot be undone.',
	},
	'tailnets.list': {
		riskLevel: 'read',
		description:
			'List the tailnets in the organization: the original one and any API-only tailnets made with tailnets.create. Pages with cursor.',
	},
	'userInvites.create': {
		riskLevel: 'destructive',
		description:
			"Invite people to join the tailnet with a role (member, admin, ...). Each invite gives an invite URL; with email set, Tailscale emails it. Needs a user's API access token (an invite needs an inviting user), not an OAuth client.",
	},
	'userInvites.delete': {
		riskLevel: 'write',
		description:
			"Delete an invite to join the tailnet; its link stops working. Needs a user's API access token.",
	},
	'userInvites.get': {
		riskLevel: 'read',
		description:
			'Get an invite to join the tailnet: role, invite URL, email and whether it was accepted.',
	},
	'userInvites.list': {
		riskLevel: 'read',
		description:
			"List pending invites for people to join the tailnet; null when there are none. Invites need a user's API access token, not an OAuth client.",
	},
	'userInvites.resend': {
		riskLevel: 'destructive',
		description: 'Email an invite to join the tailnet again.',
	},
	'users.approve': {
		riskLevel: 'write',
		description:
			'Approve a user waiting for approval (when the tailnet requires user approval).',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a user from the tailnet, with their devices. Cannot be undone; users.suspend keeps them restorable. A user's own token can't delete that user.",
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Get one user: role, status, login name, device count, last seen.',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List users: role, status (active, idle, suspended, needs-approval), device count, last seen. type and role filter the list.',
	},
	'users.restore': {
		riskLevel: 'write',
		description: 'Restore a suspended user and their access.',
	},
	'users.suspend': {
		riskLevel: 'write',
		description:
			"Suspend a user: they lose access to the tailnet until restored; their devices and settings are kept. A user's own token can't suspend that user.",
	},
	'users.updateRole': {
		riskLevel: 'write',
		description:
			"Change a user's role (member, admin, it-admin, network-admin, billing-admin, auditor, owner).",
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Add a webhook endpoint for tailnet events (nodeCreated, nodeNeedsApproval, nodeKeyExpiringInOneDay, nodeDeleted, policyUpdate, userNeedsApproval, userRoleUpdated, ...). Tailscale signs each event with the secret (Tailscale-Webhook-Signature). providerType "slack", "discord", "mattermost" or "googlechat" formats the message for that chat app. The signing secret is returned once: keep it to verify events.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook endpoint; Tailscale stops sending it events.',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description:
			'Get a webhook endpoint: URL, provider type and subscribed events.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List the webhook endpoints that receive tailnet events (device added, needs approval, policy changed, user joined, ...).',
	},
	'webhooks.rotateSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Replace a webhook endpoint's signing secret. The new one is returned once; signatures made with the old one stop verifying.",
	},
	'webhooks.test': {
		riskLevel: 'write',
		description:
			'Send a test event to a webhook endpoint to check it receives and accepts deliveries.',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Change which events a webhook endpoint receives.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof tailscaleEndpointsNested
>;
