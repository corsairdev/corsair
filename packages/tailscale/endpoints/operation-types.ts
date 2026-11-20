// Generated from Tailscale's OpenAPI spec (https://api.tailscale.com/api/v2?outputOpenapiSchema=true,
// fetched 2026-11-20); tailscale-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

export type TailscaleJsonValue =
	| null
	| boolean
	| number
	| string
	| TailscaleJsonValue[]
	| { [key: string]: TailscaleJsonValue | undefined };

export const TAILSCALE_OPERATION_IDS = [
	'contacts.get',
	'contacts.resendVerificationEmail',
	'contacts.update',
	'deviceInvites.accept',
	'deviceInvites.create',
	'deviceInvites.delete',
	'deviceInvites.get',
	'deviceInvites.list',
	'deviceInvites.resend',
	'devices.authorize',
	'devices.delete',
	'devices.expireKey',
	'devices.get',
	'devices.list',
	'devices.postureAttributes.batchUpdate',
	'devices.postureAttributes.delete',
	'devices.postureAttributes.get',
	'devices.postureAttributes.set',
	'devices.routes.list',
	'devices.routes.set',
	'devices.setIp',
	'devices.setName',
	'devices.setTags',
	'devices.updateKey',
	'dns.configuration.get',
	'dns.configuration.set',
	'dns.nameservers.list',
	'dns.nameservers.set',
	'dns.preferences.get',
	'dns.preferences.set',
	'dns.searchPaths.list',
	'dns.searchPaths.set',
	'dns.splitDns.get',
	'dns.splitDns.set',
	'dns.splitDns.update',
	'keys.create',
	'keys.delete',
	'keys.get',
	'keys.list',
	'keys.update',
	'logging.awsExternalId.get',
	'logging.awsExternalId.validate',
	'logging.configurationLogs.list',
	'logging.networkLogs.list',
	'logging.streaming.disable',
	'logging.streaming.get',
	'logging.streaming.getStatus',
	'logging.streaming.set',
	'oauthApps.create',
	'oauthApps.delete',
	'oauthApps.get',
	'oauthApps.list',
	'oauthApps.update',
	'policyFile.get',
	'policyFile.preview',
	'policyFile.set',
	'policyFile.validate',
	'postureIntegrations.create',
	'postureIntegrations.delete',
	'postureIntegrations.get',
	'postureIntegrations.list',
	'postureIntegrations.update',
	'services.delete',
	'services.get',
	'services.hosts.getApproval',
	'services.hosts.list',
	'services.hosts.setApproval',
	'services.list',
	'services.update',
	'tailnetSettings.get',
	'tailnetSettings.update',
	'tailnets.create',
	'tailnets.delete',
	'tailnets.list',
	'userInvites.create',
	'userInvites.delete',
	'userInvites.get',
	'userInvites.list',
	'userInvites.resend',
	'users.approve',
	'users.delete',
	'users.get',
	'users.list',
	'users.restore',
	'users.suspend',
	'users.updateRole',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
	'webhooks.rotateSecret',
	'webhooks.test',
	'webhooks.update',
] as const;

export type TailscaleOperationId = (typeof TAILSCALE_OPERATION_IDS)[number];

export type TailscaleDnsConfigurationPreferencesInput = {
	/** If true, resolvers in `nameservers` override the local OS DNS configuration; if false, local resolvers are used. */
	overrideLocalDNS?: boolean;
	/** Whether MagicDNS is enabled for this tailnet. */
	magicDNS?: boolean;
};

export type TailscaleDnsConfigurationResolverInput = {
	/** IPv4 or IPv6 address of the DNS resolver. */
	address?: string;
	/** If true, this resolver should still be used when a device is configured to use a Tailscale exit node. Requires Tailscale v1.88.1 or later. */
	useWithExitNode?: boolean;
};

/** `capabilities` is a mapping of resources to permissible actions. */
export type TailscaleKeyCapabilitiesInput = {
	/** `devices` specifies the key's permissions over devices. This field is only populated for auth keys. */
	devices?: {
		/** `create` specifies the key's permissions when creating devices. */
		create?: {
			/** reusable for auth keys only; reusable auth keys can be used multiple times to register different devices. Learn more about reusable auth keys at https://tailscale.com/docs/features/access-control/auth-keys#types-of-auth-keys. */
			reusable?: boolean;
			/** ephemeral for auth keys only; ephemeral keys are used to connect and then clean up short-lived devices. Learn about ephemeral nodes at https://tailscale.com/docs/features/ephemeral-nodes. */
			ephemeral?: boolean;
			/** preauthorized for auth keys only; these are also referred to as "pre-approved" keys. 'true' means that devices registered with this key won't require additional approval from a tailnet admin. Learn about device approval at… */
			preauthorized?: boolean;
			/** tags are the tags that will be set on devices registered with this key. Learn about tags at https://tailscale.com/docs/features/tags. Whether tags are required or optional depends on the owner of the auth key: - When creating an auth key owned by the tailnet (using OAuth), it must have tags. The… */
			tags?: Array<string>;
			/** nodeAttributes are custom device posture attributes that will be set on devices registered with this key. Attribute keys must be in the `custom:` namespace, and values must be strings, integers, or booleans. At most 100 attributes may be set. Learn about device posture attributes at… */
			nodeAttributes?: Record<string, string | number | boolean>;
		};
	};
};

/** The type of log for logging endpoints. */
export type TailscaleLogTypeInput = 'configuration' | 'network';

/** Map of domain names to lists of nameservers or to `null`. */
export type TailscaleSplitDnsInput = Record<string, Array<string> | null>;

/** The list of custom device attributes that the OAuth app is allowed to set. */
export type TailscaleAllowedNodeAttributesInput = Array<string>;

/** A human-readable description of the OAuth app. Must be at most 300 characters. */
export type TailscaleDescriptionInput = string;

/** The name of the OAuth app. Must be between 3 and 50 characters and contain only alphanumeric characters, dashes, periods, and underscores. */
export type TailscaleNameInput = string;

/** The provider type for the webhook destination, or an empty string if none are applicable. Outgoing webhook events are sent in the format expected by the provider type if non-empty. */
export type TailscaleProviderTypeInput =
	| ''
	| 'slack'
	| 'mattermost'
	| 'googlechat'
	| 'discord';

/** The list of permitted redirect URIs for the OAuth authorization code flow. At least one redirect URI is required. Each URI must use the `https` scheme, except for `localhost`, `127.0.0.1`, and `::1`, which may use any scheme. Raw IP address hosts are not permitted. */
export type TailscaleRedirectURIsInput = Array<string>;

/** The list of OAuth scopes granted to the app. Must be non-empty. Learn more about [OAuth clients and scopes](https://tailscale.com/docs/features/oauth-clients). */
export type TailscaleScopesInput = Array<string>;

/** The list of subscribed events that trigger POST requests to the configured endpoint URL. Learn more about [webhook events](https://tailscale.com/docs/features/webhooks#events). */
export type TailscaleSubscriptionsInput = Array<
	| 'nodeCreated'
	| 'nodeNeedsApproval'
	| 'nodeApproved'
	| 'nodeKeyExpiringInOneDay'
	| 'nodeKeyExpired'
	| 'nodeDeleted'
	| 'nodeSigned'
	| 'nodeNeedsSignature'
	| 'policyUpdate'
	| 'userCreated'
	| 'userNeedsApproval'
	| 'userSuspended'
	| 'userRestored'
	| 'userDeleted'
	| 'userApproved'
	| 'userRoleUpdated'
	| 'subnetIPForwardingNotEnabled'
	| 'exitNodeIPForwardingNotEnabled'
	| 'categoryTailnetManagement'
	| 'categoryDeviceMisconfigurations'
>;

/** An external ID for use in authenticating to AWS using role-based authentication. */
export type TailscaleAwsExternalId = {
	/** The external id that Tailscale will supply to AWS when authenticating using role-based authentication. */
	externalId?: string | null;
	/** The AWS account id that Tailscale will supply to AWS when authenticating using role-based authentication. */
	tailscaleAwsAccountId?: string | null;
};

export type TailscaleConfigurationAuditLog = {
	/** Timestamp of the audit log event, in RFC 3339 format. */
	eventTime?: string | null;
	/** The type of log (always "CONFIG"). */
	type?: string | null;
	/** Timestamp recording the time that the audit log rate limiter enqueued the record to be logged at a future time, in RFC 3339 format. */
	deferredAt?: string | null;
	/** Identifier assigned to one or more audit log events, all of which are the result of a single operation. */
	eventGroupID?: string | null;
	/** The initiator of the action that generated the event, typically an API or user interface, like the Tailscale admin panel. */
	origin?: string | null;
	/** The person who caused the action related to this event. */
	actor?: {
		/** The ID (user ID or node ID) of the actor. */
		id?: string | null;
		/** The entity type of the actor. */
		type?: string | null;
		/** The login name of the actor at time of the action. */
		loginName?: string | null;
		/** The display name of the actor at time of the action. */
		displayName?: string | null;
		/** Indicates the tags owning a node. Its value is only set if `type` is `NODE`. */
		tags?: Array<string> | null;
	} | null;
	/** The object of this event's action. */
	target?: {
		/** The unique ID (user id, tailnet SID, or node id) of the target. */
		id?: string | null;
		/** Name of the entity at time of the action. */
		name?: string | null;
		/** The entity type of Target. */
		type?: string | null;
		/** Indicates whether the target is ephemeral. Its value should only be set if `type` is `NODE``. */
		isEphemeral?: boolean | null;
		/** The property name on this target which was updated by the event. When empty, the event didn't update any fields on this target. */
		property?: string | null;
	} | null;
	/** The type of change attempted against the `target`. */
	action?: string | null;
	/** The value of `target.property`` prior to the event. */
	old?:
		| (
				| string
				| number
				| boolean
				| Array<TailscaleJsonValue>
				| Record<string, TailscaleJsonValue>
		  )
		| null;
	/** The value of `target.property` after the event. */
	new?:
		| (
				| string
				| number
				| boolean
				| Array<TailscaleJsonValue>
				| Record<string, TailscaleJsonValue>
		  )
		| null;
	/** Additional information about the event, such as a client-provided reason, if it exists. */
	actionDetails?: string | null;
	/** Provided when the configuration change failed to be completed. It is a user-presentable reason for the failure. */
	error?: string | null;
};

export type TailscaleConnectionCounts = {
	/** IP protocol name (or number if no name used). */
	proto?: string | null;
	/** Source addr:port. */
	src?: string | null;
	/** Destination addr:port. */
	dst?: string | null;
	/** Number of packets sent. */
	txPkts?: number | null;
	/** Number of bytes sent. */
	txBytes?: number | null;
	/** Number of packets received. */
	rxPkts?: number | null;
	/** Number of bytes received. */
	rxBytes?: number | null;
};

/** A tailnet contact. */
export type TailscaleContact = {
	/** The contact's email address. */
	email?: string | null;
	/** The email address used when contact's email address has not been verified. */
	fallbackEmail?: string | null;
	/** Indicates whether the contact's email address still needs to be verified. */
	needsVerification?: boolean | null;
};

export type TailscaleCreateOrganizationTailnetResponse = {
	/** A stable, globally unique identifier for the tailnet. */
	id?: string | null;
	/** The tailnet name provided in the request. */
	displayName?: string | null;
	/** A stable, globally unique identifier for the organization. */
	orgId?: string | null;
	/** The DNS suffix used to construct fully qualified domain names for devices in this tailnet. */
	dnsName?: string | null;
	/** RFC3339 timestamp of when the tailnet was created. */
	createdAt?: string | null;
	oauthClient?: TailscaleTailnetOAuthClient | null;
	/** True if the requested tailnet already exists. */
	alreadyExists?: boolean | null;
};

/** A Tailscale device (sometimes referred to as *node* or *machine*), is any computer or mobile device that joins a tailnet. Each device has a unique ID (`nodeId` in the schema below) that is used to identify the device in API calls. This ID can be found by going to the… */
export type TailscaleDevice = {
	/** A list of Tailscale IP addresses for the device, including both IPv4 (formatted as 100.x.y.z) and IPv6 (formatted as fd7a:115c:a1e0:a:b:c:d:e) addresses. */
	addresses?: Array<string> | null;
	/** The legacy identifier for a device; you can supply this value wherever {deviceId} is indicated in the endpoint. Note that although "id" is still accepted, "nodeId" is preferred. */
	id?: string | null;
	/** The preferred identifier for a device; supply this value wherever {deviceId} is indicated in the endpoint. */
	nodeId?: string | null;
	/** The user who registered the node. For untagged nodes, this user is the device owner. */
	user?: string | null;
	/** The MagicDNS name of the device. Learn more about MagicDNS at https://tailscale.com/docs/features/magicdns. */
	name?: string | null;
	/** The machine name in the admin console. Learn more about machine names at https://tailscale.com/docs/concepts/machine-names. */
	hostname?: string | null;
	/** The version of the Tailscale client software; this is empty for external devices. */
	clientVersion?: string | null;
	/** 'true' if a Tailscale client version upgrade is available. This value is empty for external devices. */
	updateAvailable?: boolean | null;
	/** The operating system that the device is running. */
	os?: string | null;
	/** The date on which the device was added to the tailnet; this is empty for external devices. */
	created?: string | null;
	/** Indicates if the device recently maintained a TCP connection to the Tailscale control server. */
	connectedToControl?: boolean | null;
	/** When the device was last connected to the Tailscale control server. Omitted if the device has never been online or `connectedToControl` is true. */
	lastSeen?: string | null;
	/** 'true' if the keys for the device will not expire. Learn more at https://tailscale.com/docs/features/access-control/key-expiry. */
	keyExpiryDisabled?: boolean | null;
	/** The expiration date of the device's auth key. Learn more about key expiry at https://tailscale.com/docs/features/access-control/key-expiry. */
	expires?: string | null;
	/** 'true' if the device has been authorized to join the tailnet; otherwise, 'false'. Learn more about device authorization at https://tailscale.com/docs/features/access-control/device-management/device-approval. */
	authorized?: boolean | null;
	/** 'true', indicates that a device is not a member of the tailnet, but is shared in to the tailnet; if 'false', the device is a member of the tailnet. Learn more about node sharing at https://tailscale.com/docs/features/sharing. */
	isExternal?: boolean | null;
	/** 'true', indicates that multiple devices are currently connected using the same node key, which is usually a sign of node state being copied between machines. If only one device is connected using this node's key, the field is omitted. If the number of live connections goes back to 0 or 1, this… */
	multipleConnections?: boolean | null;
	/** For internal use and is not required for any API operations. This value is empty for external devices. */
	machineKey?: string | null;
	/** Mostly for internal use, required for select operations, such as adding a node to a locked tailnet. Learn about tailnet locks at https://tailscale.com/docs/features/tailnet-lock. */
	nodeKey?: string | null;
	/** 'true' if the device is not allowed to accept any connections over Tailscale, including pings. Learn more in the "Allow incoming connections" section of https://tailscale.com/docs/features/client/manage-preferences. */
	blocksIncomingConnections?: boolean | null;
	/** The subnet routes for this device that have been approved by a tailnet admin. Learn more about subnet routes at https://tailscale.com/docs/features/subnet-routers. */
	enabledRoutes?: Array<string> | null;
	/** The subnets this device requests to expose. Learn more about subnet routes at https://tailscale.com/docs/features/subnet-routers. */
	advertisedRoutes?: Array<string> | null;
	/** clientConnectivity provides a report on the device's current physical network conditions. */
	clientConnectivity?: {
		/** Client's magicsock UDP IP:port endpoints (IPv4 or IPv6). */
		endpoints?: Array<string> | null;
		/** 'true' if the host's NAT mappings vary based on the destination IP. */
		mappingVariesByDestIP?: boolean | null;
		/** Map of DERP server locations and their current latency. */
		latency?: Record<
			string,
			{
				/** 'true' for the node's preferred DERP server for incoming traffic. */
				preferred?: boolean | null;
				/** Current latency to DERP server. */
				latencyMs?: number | null;
			}
		> | null;
		/** Identifies features supported by the client. */
		clientSupports?: {
			/** This information is no longer tracked and will always be null. */
			hairPinning?: boolean | null;
			/** 'true' if the device OS supports IPv6, regardless of whether IPv6 internet connectivity is available. */
			ipv6?: boolean | null;
			/** 'true' if PCP port-mapping service exists on your router. */
			pcp?: boolean | null;
			/** 'true' if NAT-PMP port-mapping service exists on your router. */
			pmp?: boolean | null;
			/** 'true' if UDP traffic is enabled on the current network; if 'false', Tailscale may be unable to make direct connections, and will rely on our DERP servers. */
			udp?: boolean | null;
			/** 'true' if UPnP port-mapping service exists on your router. */
			upnp?: boolean | null;
		} | null;
	} | null;
	/** Lets you assign an identity to a device that is separate from human users, and use it as part of an ACL to restrict access. Once a device is tagged, the tag is the owner of that device. A single node can have multiple tags assigned. This value is empty for external devices. Learn more about tags… */
	tags?: Array<string> | null;
	/** Indicates an issue with the tailnet lock node-key signature on this device. This field is only populated when tailnet lock is enabled. */
	tailnetLockError?: string | null;
	/** The node's tailnet lock key. Every node generates a tailnet lock key (so the value will be present) even if tailnet lock is not enabled. Learn more about tailnet lock at https://tailscale.com/docs/features/tailnet-lock. */
	tailnetLockKey?: string | null;
	/** 'true' if Tailscale SSH is enabled on this device. Learn more about Tailscale SSH at https://tailscale.com/docs/features/tailscale-ssh. */
	sshEnabled?: boolean | null;
	/** Contains extra identifiers from the device when the tailnet it is connected to has device posture identification collection enabled. If the device has not opted-in to posture identification collection, this will contain {"disabled": true}. Learn more about posture identity at… */
	postureIdentity?: {
		serialNumbers?: Array<string> | null;
		disabled?: boolean | null;
	} | null;
	/** Reports the status of a single posture for a device. */
	postureStatus?: {
		/** Reports whether the device is passing this posture. */
		passing?: boolean | null;
		/** Whether the status of this posture affects the connectivity of the device. */
		impacting?: boolean | null;
		/** List of posture assertions the device is failing. Empty if the device is passing. */
		failingAssertions?: Array<string> | null;
	} | null;
	/** 'true' if the device is ephemeral. Learn more about ephemeral nodes at https://tailscale.com/docs/features/ephemeral-nodes. */
	isEphemeral?: boolean | null;
	/** distro provides details of the operating system distribution, if available. */
	distro?: {
		/** The operating system distribution that the device is running. */
		name?: string | null;
		/** The operating system distribution version that the device is running. */
		version?: string | null;
		/** The operating system distribution code name that the device is running. */
		codeName?: string | null;
	} | null;
};

/** A device invite is an invitation that shares a device with an external user (a user not in the device's tailnet). Each device invite has a unique ID that is used to identify the invite in API calls. You can find all device invite IDs for a particular device by [listing all device… */
export type TailscaleDeviceInvite = {
	/** The unique identifier for the invite. Supply this value wherever {deviceInviteId} is indicated in the endpoint. */
	id?: string | null;
	/** The creation time of the invite. */
	created?: string | null;
	/** The ID of the tailnet to which the shared device belongs. */
	tailnetId?: number | null;
	/** The ID of the device being shared. */
	deviceId?: number | null;
	/** The ID of the user who created the share invite. */
	sharerId?: number | null;
	/** Specifies whether this device invite can be accepted more than once. */
	multiUse?: boolean | null;
	/** Specifies whether the invited user is able to use the device as an exit node when the device is advertising as one. */
	allowExitNode?: boolean | null;
	/** The email to which the invite was sent. If empty, the invite was not emailed to anyone, but the inviteUrl can be shared manually. */
	email?: string | null;
	/** The last time the invite was attempted to be sent to Email. Only ever set if `email` is not empty. */
	lastEmailSentAt?: string | null;
	/** The link to accept the invite. Anyone with this link can accept the invite. It is not restricted to the person to which the invite was emailed. */
	inviteUrl?: string | null;
	/** `true` when the share invite has been accepted. */
	accepted?: boolean | null;
	/** Set when the invite has been accepted. It holds information about the user who accepted the share invite. */
	acceptedBy?: {
		/** The ID of the user who accepted the share invite. */
		id?: number | null;
		/** The login name of the user who accepted the share invite. */
		loginName?: string | null;
		/** The profile pic URL for the user who accepted the share invite. */
		profilePicUrl?: string | null;
	} | null;
};

export type TailscaleDevicePostureAttributes = {
	/** Contains all the posture attributes assigned to a node. Attribute values can be strings, numbers or booleans. */
	attributes?: Record<string, string | number | boolean> | null;
	/** Contains the expiry time for each posture attribute, if set. */
	expiries?: Record<string, string> | null;
};

export type TailscaleDeviceRoutes = {
	/** The subnets this device requests to expose. */
	advertisedRoutes?: Array<string> | null;
	/** The subnet routes for this device that have been approved by a tailnet admin. */
	enabledRoutes?: Array<string> | null;
};

export type TailscaleDnsConfiguration = {
	/** Global DNS resolvers to use. If `preferences.overrideLocalDNS` is true, these override the local OS configuration; otherwise they are used as fallback resolvers. */
	nameservers?: Array<TailscaleDnsConfigurationResolver> | null;
	/** Map of DNS name suffixes (domains) to lists of resolvers for Split DNS and advanced routing overlays. */
	splitDNS?: Record<
		string,
		Array<TailscaleDnsConfigurationResolver> | null
	> | null;
	/** Search domain paths to apply. */
	searchPaths?: Array<string> | null;
	preferences?: TailscaleDnsConfigurationPreferences | null;
};

export type TailscaleDnsConfigurationPreferences = {
	/** If true, resolvers in `nameservers` override the local OS DNS configuration; if false, local resolvers are used. */
	overrideLocalDNS?: boolean | null;
	/** Whether MagicDNS is enabled for this tailnet. */
	magicDNS?: boolean | null;
};

export type TailscaleDnsConfigurationResolver = {
	/** IPv4 or IPv6 address of the DNS resolver. */
	address?: string | null;
	/** If true, this resolver should still be used when a device is configured to use a Tailscale exit node. Requires Tailscale v1.88.1 or later. */
	useWithExitNode?: boolean | null;
};

export type TailscaleDnsPreferences = {
	/** Whether MagicDNS is active for this tailnet. */
	magicDNS?: boolean | null;
};

export type TailscaleDnsSearchPaths = {
	/** The search domains for the given tailnet. */
	searchPaths?: Array<string> | null;
};

/** An API access token or Auth Key. */
export type TailscaleKey = {
	id?: string | null;
	/** The secret key material (only populated at creation time). */
	key?: string | null;
	/** The type of key. Can be one of "auth", "client", "federated", or "api". - "auth" refers to machine auth keys. - "client" refers to OAuth clients. - "federated" refers to federated identities. - "api" refers to personal API access tokens or tokens generated using an OAuth client or federated… */
	keyType?: string | null;
	/** Duration in seconds until the key expires. Only applies to auth keys. */
	expirySeconds?: number | null;
	created?: string | null;
	updated?: string | null;
	expires?: string | null;
	revoked?: string | null;
	capabilities?: TailscaleKeyCapabilities | null;
	/** A list of scopes granted to the key. Only applies to OAuth clients, API access tokens, and federated identities. */
	scopes?: Array<string> | null;
	/** A list of tags associated to the trust credential. Auth keys created with this client must have these exact tags, or tags owned by the client's tags. Mandatory if the scopes include "devices:core" or "auth_keys". Only applies to OAuth clients and federated identities. */
	tags?: Array<string> | null;
	description?: string | null;
	/** Response for a revoked (deleted) or expired key will have an `invalid` field set to true. */
	invalid?: boolean | null;
	/** ID of the user who created this key, empty for keys created by trust credentials. */
	userId?: string | null;
	/** The value used when matching against the `aud` claim from an OIDC identity token. Specifying the audience is optional as Tailscale will generate a secure audience at creation time by default. It is recommended to let Tailscale generate the audience unless the identity provider you are… */
	audience?: string | null;
	/** The issuer of the OIDC identity token used in the token exchange. Must be a valid and publicly reachable https:// URL. Only applies to federated identities. */
	issuer?: string | null;
	/** The pattern used when matching against the `sub` claim from an OIDC identity token. This pattern can include `*` characters to match against any character. Only applies to federated identities. */
	subject?: string | null;
	/** A map of claim names to pattern strings used to match against arbitrary claims in the OIDC identity token. Patterns can include `*` characters to match against any character. Only applies to federated identities. */
	customClaimRules?: Record<string, string> | null;
};

/** `capabilities` is a mapping of resources to permissible actions. */
export type TailscaleKeyCapabilities = {
	/** `devices` specifies the key's permissions over devices. This field is only populated for auth keys. */
	devices?: {
		/** `create` specifies the key's permissions when creating devices. */
		create?: {
			/** reusable for auth keys only; reusable auth keys can be used multiple times to register different devices. Learn more about reusable auth keys at https://tailscale.com/docs/features/access-control/auth-keys#types-of-auth-keys. */
			reusable?: boolean | null;
			/** ephemeral for auth keys only; ephemeral keys are used to connect and then clean up short-lived devices. Learn about ephemeral nodes at https://tailscale.com/docs/features/ephemeral-nodes. */
			ephemeral?: boolean | null;
			/** preauthorized for auth keys only; these are also referred to as "pre-approved" keys. 'true' means that devices registered with this key won't require additional approval from a tailnet admin. Learn about device approval at… */
			preauthorized?: boolean | null;
			/** tags are the tags that will be set on devices registered with this key. Learn about tags at https://tailscale.com/docs/features/tags. Whether tags are required or optional depends on the owner of the auth key: - When creating an auth key owned by the tailnet (using OAuth), it must have tags. The… */
			tags?: Array<string> | null;
			/** nodeAttributes are custom device posture attributes that will be set on devices registered with this key. Attribute keys must be in the `custom:` namespace, and values must be strings, integers, or booleans. At most 100 attributes may be set. Learn about device posture attributes at… */
			nodeAttributes?: Record<string, string | number | boolean> | null;
		} | null;
	} | null;
};

export type TailscaleListOrganizationTailnetsResponse = {
	/** Tailnets in the organization. */
	tailnets?: Array<TailscaleOrganizationTailnet> | null;
	/** Opaque pagination cursor for the next page. */
	cursor?: string | null;
	/** Total number of tailnets in the organization. */
	totalCount?: number | null;
};

/** The type of log for logging endpoints. */
export type TailscaleLogType = string;

/** The current configuration of a log streaming endpoint. */
export type TailscaleLogstreamEndpointConfiguration = {
	/** The type of log that is streamed to this endpoint. */
	logType?: TailscaleLogType | null;
	/** The type of system to which logs are being streamed. */
	destinationType?: string | null;
	/** The URL to which log streams are being posted. If the DestinationType is `s3`, the URL may be (and often is) empty to use the official Amazon S3 endpoint. */
	url?: string | null;
	/** The username with which log streams to this endpoint are authenticated. */
	user?: string | null;
	/** An optional number of minutes to wait in between uploading new logs. If the quantity of logs does not fit within a single upload, multiple uploads will be made. */
	uploadPeriodMinutes?: number | null;
	/** The compression algorithm with which to compress logs. `none` disables compression. Defaults to `none`. */
	compressionFormat?: string | null;
	/** The token/password with which log streams to this endpoint should be authenticated. */
	token?: string | null;
	/** The S3 bucket name. Required if the destinationType is `s3`. */
	s3Bucket?: string | null;
	/** The region in which the S3 bucket is located. Required if the destinationType is `s3`. */
	s3Region?: string | null;
	/** An optional S3 key prefix to prepend to the auto-generated S3 key name. */
	s3KeyPrefix?: string | null;
	/** What type of authentication to use for S3. Required if the destinationType is `s3`. Tailscale recommends using `rolearn`. See [Amazon documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html). */
	s3AuthenticationType?: string | null;
	/** The S3 access key ID. Required if the destinationType is `s3` and `authenticationType` is `accesskey`. */
	s3AccessKeyId?: string | null;
	/** The S3 secret access key. Required if the destinationType is `s3` and `authenticationType` is `accesskey`. */
	s3SecretAccessKey?: string | null;
	/** The Role ARN that Tailscale should supply to AWS when authenticating using role-based authentication. Required if the destinationType is `s3` and `authenticationType` is `rolearn`. */
	s3RoleArn?: string | null;
	/** The AWS external id that Tailscale supplies when authenticating using role-based authentication. Populated if the destinationType is `s3` and `authenticationType` is `rolearn`. This corresponds to the `externalId` field obtained from… */
	s3ExternalId?: string | null;
	/** The GCS bucket name. Required if the destinationType is `gcs`. */
	gcsBucket?: string | null;
	/** An optional GCS key prefix to append to the GCS bucket name. */
	gcsKeyPrefix?: string | null;
	/** The GCS scopes needed to be able to write to the GCS bucket. */
	gcsScopes?: Array<string> | null;
	/** The JSON workload identity credentials from GCS needed for accessing the GCS account. */
	gcsCredentials?: string | null;
};

/** Latest status of log stream publishing for a specific type of log. */
export type TailscaleLogstreamEndpointPublishingStatus = {
	/** Timestamp of the most recent publishing activity, in RFC 3339 format. */
	lastActivity?: string | null;
	/** The most recent error (if any). */
	lastError?: string | null;
	/** The size of the largest single request body. */
	maxBodySize?: number | null;
	/** Total bytes published across all requests. */
	numBytesSent?: number | null;
	/** The total number of entries published. */
	numEntriesSent?: number | null;
	/** The number of spoofed entries published. A spoofed entry is one that failed to validate because we did not see receive a matching flow log from the other side of the connection. */
	numSpoofedEntries?: number | null;
	/** The total number of requests made to the streaming endpoint. */
	numTotalRequests?: number | null;
	/** The total number of requests to the streaming endpoint that have failed. */
	numFailedRequests?: number | null;
	/** The exponentially weighted moving average rate at which data is being streamed to the endpoint, in bytes per second. */
	rateBytesSent?: number | null;
	/** The exponentially weighted moving average rate at which entries are being sent to the endpoint, in entries per second. */
	rateEntriesSent?: number | null;
	/** The exponentially weighted moving average rate at which requests are being made to the endpoint, in requests per second. */
	rateTotalRequests?: number | null;
	/** The exponentially weighted moving average rate at which requests are failing, in requests per second. */
	rateFailedRequests?: number | null;
};

export type TailscaleNetworkFlowLog = {
	/** Timestamp of the flow log, in RFC 3339 format. */
	logged?: string | null;
	/** Identifier of the node. */
	nodeId?: string | null;
	/** Time at which flow started, in RFC 3339 format. */
	start?: string | null;
	/** Time at which flow ended, in RFC 3339 format. */
	end?: string | null;
	virtualTraffic?: Array<TailscaleConnectionCounts> | null;
	subnetTraffic?: Array<TailscaleConnectionCounts> | null;
	exitTraffic?: Array<TailscaleConnectionCounts> | null;
	physicalTraffic?: Array<TailscaleConnectionCounts> | null;
};

export type TailscaleOAuthApp = {
	/** The unique identifier for the OAuth app. */
	id?: string | null;
	/** The name of the OAuth app. Must be between 3 and 50 characters and contain only alphanumeric characters, dashes, periods, and underscores. */
	name?: string | null;
	/** A human-readable description of the OAuth app. Must be at most 300 characters. */
	description?: string | null;
	/** The list of permitted redirect URIs for the OAuth authorization code flow. At least one redirect URI is required. Each URI must use the `https` scheme, except for `localhost`, `127.0.0.1`, and `::1`, which may use any scheme. Raw IP address hosts are not permitted. */
	redirectURIs?: Array<string> | null;
	/** The list of OAuth scopes granted to the app. Must be non-empty. Learn more about [OAuth clients and scopes](https://tailscale.com/docs/features/oauth-clients). */
	scopes?: Array<string> | null;
	/** The list of custom device attributes that the OAuth app is allowed to set. */
	allowedNodeAttributes?: Array<string> | null;
	/** The client secret for the OAuth app. Only populated when the app is created and cannot be retrieved afterwards. */
	clientSecret?: string | null;
	/** The time the OAuth app was created. */
	created?: string | null;
	/** The time the OAuth app was last updated. */
	updated?: string | null;
};

export type TailscaleOrganizationTailnet = {
	/** A stable, globally unique identifier for the tailnet. */
	id?: string | null;
	/** The tailnet's display name. */
	displayName?: string | null;
	/** A stable, globally unique identifier for the organization. */
	orgId?: string | null;
	/** RFC3339 timestamp of when the tailnet was created. */
	createdAt?: string | null;
};

/** A configured PostureIntegration. */
export type TailscalePostureIntegration = {
	/** The device posture provider. Required on POST requests, ignored on PATCH requests. */
	provider?: string | null;
	/** Identifies which of the provider's clouds to integrate with. - For CrowdStrike Falcon, it will be one of `us-1`, `us-2`, `eu-1` or `us-gov`. - For Microsoft Intune, it will be one of `global` or `us-gov`. - For Jamf Pro, Kandji and Sentinel One, it is the FQDN of your subdomain, for example… */
	cloudId?: string | null;
	/** Unique identifier for your client. - For Microsoft Intune, it will be your application's UUID. - For CrowdStrike Falcon and Jamf Pro, it will be your client id. - For Kandji, Kolide and Sentinel One, this is left blank. */
	clientId?: string | null;
	/** The Microsoft Intune directory (tenant) ID. For other providers, this is left blank. */
	tenantId?: string | null;
	/** The secret (auth key, token, etc.) used to authenticate with the provider. Required when creating a new integration, may be omitted when updating an existing integration, in which case we retain the existing password. */
	clientSecret?: string | null;
	/** A unique identifier for the integration (generated by the system). */
	id?: string | null;
	/** Timestamp of the last time this configuration was updated, in RFC 3339 format. */
	configUpdated?: string | null;
	/** Most recent status for this integration. */
	status?: {
		/** Timestamp of the last synchronization with the device posture provider, in RFC 3339 format. */
		lastSync?: string | null;
		/** If the last synchronization failed, this shows the error message associated with the failed synchronization. */
		error?: string | null;
		/** The number of devices known to the provider. */
		providerHostCount?: number | null;
		/** The number of Tailscale nodes that were matched with provider. */
		matchedCount?: number | null;
		/** The number of Tailscale nodes with identifiers for matching. */
		possibleMatchedCount?: number | null;
	} | null;
};

/** An information summary for a device hosting a Service. */
export type TailscaleServiceHostInfo = {
	/** The preferred identifier for a device. */
	stableNodeID?: string | null;
	/** The approval level of the device hosting the Service. */
	approvalLevel?: string | null;
	/** The configuration status of the device hosting the Service. */
	configured?: string | null;
};

/** Map of domain names to lists of nameservers or to `null`. */
export type TailscaleSplitDns = Record<string, Array<string> | null>;

/** OAuth client credentials with the `all` scope for the newly created tailnet. The secret is returned only once. */
export type TailscaleTailnetOAuthClient = {
	/** A stable, globally unique identifier for the OAuth client. */
	id?: string | null;
	/** The OAuth client secret. */
	secret?: string | null;
};

/** Settings for a tailnet. */
export type TailscaleTailnetSettings = {
	/** Prevents users from editing policies in the admin console to avoid conflicts with external management workflows like GitOps or Terraform. */
	aclsExternallyManagedOn?: boolean | null;
	/** Link to the external tailnet policy definition or management solution for this tailnet. */
	aclsExternalLink?: string | null;
	/** The [admin console session timeout](https://tailscale.com/docs/account/admin-console-session-timeout) for members of this tailnet. Setting it to 0 disables the timeout. */
	adminConsoleSessionTimeoutMinutes?: number | null;
	/** Whether [device approval](https://tailscale.com/docs/features/access-control/device-management/device-approval) is enabled for the tailnet. */
	devicesApprovalOn?: boolean | null;
	/** Whether [auto updates](https://tailscale.com/docs/features/client/update#auto-updates) are enabled for devices that belong to this tailnet. */
	devicesAutoUpdatesOn?: boolean | null;
	/** The [key expiry](https://tailscale.com/docs/features/access-control/key-expiry) duration for devices on this tailnet. */
	devicesKeyDurationDays?: number | null;
	/** Whether [user approval](https://tailscale.com/docs/features/access-control/user-approval) is enabled for this tailnet. */
	usersApprovalOn?: boolean | null;
	/** Which user roles are allowed to [join external tailnets](https://tailscale.com/docs/features/sharing/how-to/invite-any-user). */
	usersRoleAllowedToJoinExternalTailnets?: string | null;
	/** Whether [network flog logs](https://tailscale.com/docs/features/logging/network-flow-logs) are enabled for the tailnet. */
	networkFlowLoggingOn?: boolean | null;
	/** Whether [regional routing](https://tailscale.com/docs/features/route-selection#regional-routing) is enabled for the tailnet. A PATCH request should prefer setting `routeSelection`. A PATCH request must not specify both the `regionalRoutingOn` and `routeSelection` fields. */
	regionalRoutingOn?: boolean | null;
	/** The [route selection](https://tailscale.com/docs/features/route-selection) algorithm used by the tailnet: * `active-passive-failover` - Active-passive failover (formerly known as "Failover") * `regional-routing` - Regional routing * `regional-routing-failover` - Regional routing with in-region… */
	routeSelection?: string | null;
	/** Whether [identity collection](https://tailscale.com/docs/features/access-control/device-management/how-to/manage-identity) is enabled for [device posture](https://tailscale.com/docs/features/device-posture) integrations for the tailnet. */
	postureIdentityCollectionOn?: boolean | null;
	/** Whether provisioning of [HTTPS certificates](https://tailscale.com/docs/how-to/set-up-https-certificates) is enabled for this tailnet. */
	httpsEnabled?: boolean | null;
};

/** Representation of a user within a tailnet. */
export type TailscaleUser = {
	/** The unique identifier for the user. Supply this value wherever {userId} is indicated in an endpoint. */
	id?: string | null;
	/** The name of the user. */
	displayName?: string | null;
	/** The emailish login name of the user. */
	loginName?: string | null;
	/** The profile pic URL for the user. */
	profilePicUrl?: string | null;
	/** The tailnet that owns the user. */
	tailnetId?: string | null;
	/** The time the user joined their tailnet. */
	created?: string | null;
	/** The type of relation this user has to the tailnet associated with the request. */
	type?: string | null;
	/** The role of the user. Learn more about [user roles](https://tailscale.com/docs/reference/user-roles). */
	role?: string | null;
	/** The status of the user. */
	status?: string | null;
	/** Number of devices the user owns. */
	deviceCount?: number | null;
	/** The later of either: - The last time any of the user's nodes were connected to the network. - The last time the user authenticated to any tailscale service, including the admin panel. */
	lastSeen?: string | null;
	/** `true` when the user has a node currently connected to the control server. */
	currentlyConnected?: boolean | null;
};

/** A user invite is an active invitation that lets a user join a tailnet with a preassigned [user role](https://tailscale.com/docs/reference/user-roles). Each user invite has a unique ID that is used to identify the invite in API calls. You can find all user invite IDs for a particular tailnet by… */
export type TailscaleUserInvite = {
	/** The unique identifier for the invite. Supply this value wherever `userInviteId` is indicated in the endpoint. */
	id?: string | null;
	/** The tailnet user role to assign to the invited user upon accepting the invite. */
	role?: string | null;
	/** The ID of the tailnet to which the user was invited. */
	tailnetId?: number | null;
	/** The ID of the user who created the invite. */
	inviterId?: number | null;
	/** The email to which the invite was sent. If empty, the invite was not emailed to anyone, but the inviteUrl can be shared manually. */
	email?: string | null;
	/** The last time the invite was attempted to be sent to Email. Only ever set if `email` is not empty. */
	lastEmailSentAt?: string | null;
	/** Included when `email` is not part of the tailnet's domain, or when `email` is empty. It is the link to accept the invite. When included, anyone with this link can accept the invite. It is not restricted to the person to which the invite was emailed. When `email` is part of the tailnet's domain… */
	inviteUrl?: string | null;
};

/** The approval status of a Service on a specific device. */
export type TailscaleVIPServiceApproval = {
	/** Indicates whether the Service is approved on the device. */
	approved?: boolean | null;
	/** Indicates whether the Service was auto-approved by an auto-approver. */
	autoApproved?: boolean | null;
};

/** An information summary for a Service. Each Service has a unique name within the tailnet, one IPv4 and one IPv6 address, optional comment, list of ports, and optional tags. */
export type TailscaleVIPServiceInfo = {
	/** The unique name of the Service. */
	name?: string | null;
	/** An optional human-readable label for the Service, shown in the Tailscale admin console and to clients with access to the Service. Must be 64 characters or fewer. */
	displayName?: string | null;
	/** The IP addresses assigned to the Service: the IPv4 followed by the IPv6. */
	addrs?: Array<string> | null;
	/** An optional comment for the Service. */
	comment?: string | null;
	/** A list of protocol:port pairs to be exposed by the Service. The only supported protocol is "tcp" at this time. "do-not-validate" can be used to skip validation. */
	ports?: Array<string> | null;
	/** A list of optional tags associated with the Service. */
	tags?: Array<string> | null;
};

export type TailscaleWebhook = {
	/** ID of the webhook endpoint. */
	endpointId?: string | null;
	/** The endpoint that events are sent to from Tailscale via POST requests. */
	endpointUrl?: string | null;
	/** The provider type for the webhook destination, or an empty string if none are applicable. Outgoing webhook events are sent in the format expected by the provider type if non-empty. */
	providerType?: string | null;
	/** The login name for the creator of the webhook endpoint. In some cases, such as webhooks created with an OAuth client, this can be blank. */
	creatorLoginName?: string | null;
	/** The time the webhook endpoint was created. */
	created?: string | null;
	/** The time the webhook endpoint was last modified. */
	lastModified?: string | null;
	/** The list of subscribed events that trigger POST requests to the configured endpoint URL. Learn more about [webhook events](https://tailscale.com/docs/features/webhooks#events). */
	subscriptions?: Array<string> | null;
	/** The webhook secret associated with the endpoint. Only populated on creation or when the secret is rotated. This secret is used for generating the `Tailscale-Webhook-Signature` header in requests sent to the endpoint URL. Learn more about [verifying webhook event… */
	secret?: string | null;
};

export type TailscaleOperationInputs = {
	'contacts.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'contacts.resendVerificationEmail': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** Type of contact. */
		contactType: 'account' | 'support' | 'security';
	};
	'contacts.update': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** Type of contact. */
		contactType: 'account' | 'support' | 'security';
		/** The contact's email address. */
		email: string;
	};
	'deviceInvites.accept': {
		/** The URL of the invite (in the form `https://login.tailscale.com/admin/invite/{code}`) or the `{code}` component of the URL. */
		invite: string;
	};
	'deviceInvites.create': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		invites: Array<{
			/** Whether the invite can be accepted more than once. When set to `true`, it results in an invite that can be accepted up to 1,000 times. */
			multiUse?: boolean;
			/** Whether the invited user can use the device as an exit node when it advertises as one. */
			allowExitNode?: boolean;
			/** The email to send the created invite to. If not set, the endpoint generates and returns an invite URL (but doesn't send it out). */
			email?: string;
		}>;
	};
	'deviceInvites.delete': {
		/** ID of the device invite. */
		deviceInviteId: string;
	};
	'deviceInvites.get': {
		/** ID of the device invite. */
		deviceInviteId: string;
	};
	'deviceInvites.list': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
	};
	'deviceInvites.resend': {
		/** ID of the device invite. */
		deviceInviteId: string;
	};
	'devices.authorize': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		/** - If `true`, authorize a new device or re-authorize a previously deauthorized device. - If `false`, deauthorize an authorized device. */
		authorized: boolean;
	};
	'devices.delete': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
	};
	'devices.expireKey': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
	};
	'devices.get': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		/** Optionally controls whether the response returns **all** fields or only a predefined subset of fields. Currently, there are two supported options: - **`all`:** return all fields in the response - **`default`:** return the following fields - `addresses` - `id` - `nodeId` - `user` - `name` -… */
		fields?: 'all' | 'default';
	};
	'devices.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** Optionally controls whether the response returns **all** fields or only a predefined subset of fields. Currently, there are two supported options: - **`all`:** return all fields in the response - **`default`:** return the following fields - `addresses` - `id` - `nodeId` - `user` - `name` -… */
		fields?: 'all' | 'default';
		/** Server-side filters: top-level device fields matched exactly, all of them together, for example { "tags": ["tag:prod"], "isEphemeral": true, "hostname": "mcp-1" }. A list value matches devices that have every item. Objects such as clientConnectivity cannot be filtered on. */
		filters?: Record<string, string | number | boolean | Array<string>>;
	};
	'devices.postureAttributes.batchUpdate': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** A mapping of deviceId → posture attributes. */
		nodes?: Record<
			string,
			Record<
				string,
				{
					/** Attribute value. */
					value: string | number | boolean;
					/** Optional expiry time for the attribute. If set, Tailscale automatically removes the attribute within a few minutes after the specified time. */
					expiry?: string;
				} | null
			>
		>;
		/** An optional comment indicating why attributes are being set, which will be added to the audit log. */
		comment?: string;
	};
	'devices.postureAttributes.delete': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		/** The name of the posture attribute to set. This must be prefixed with `custom`: Keys have a maximum length of 128 characters including the namespace, and can only contain letters, numbers, underscores, and colon. Keys are case-sensitive. Keys must be unique, but are checked for uniqueness in a… */
		attributeKey: string;
	};
	'devices.postureAttributes.get': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
	};
	'devices.postureAttributes.set': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		/** The name of the posture attribute to set. This must be prefixed with `custom`: Keys have a maximum length of 128 characters including the namespace, and can only contain letters, numbers, underscores, and colon. Keys are case-sensitive. Keys must be unique, but are checked for uniqueness in a… */
		attributeKey: string;
		/** A value can be either a string, number or boolean. A string value can have a maximum length of 50 characters, and can only contain letters, numbers, underscores, and periods. A number value is an integer and must be a JSON safe number (up to 2^53 - 1). */
		value?: string | number | boolean;
		/** An optional expiry time for a given posture attribute. If set, Tailscale will automatically remove the attribute within a few minutes after the specified time. */
		expiry?: string;
		/** An optional comment indicating a reason why an attribute is set, which will be added to the audit log. */
		comment?: string;
	};
	'devices.routes.list': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
	};
	'devices.routes.set': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		/** The new list of enabled subnet routes. */
		routes?: Array<string>;
	};
	'devices.setIp': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		/** The new IPv4 address for the device. */
		ipv4: string;
	};
	'devices.setName': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		/** The new name for the device. This can be provided as either the fully qualified domain name for the device (e.g. "nodename.your-domain.ts.net") or just the base name (e.g. "nodename"). If `name` is unset or provided empty, the device's name is reset to be generated from its OS hostname. */
		name: string;
	};
	'devices.setTags': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		/** The new list of tags for the device. */
		tags?: Array<string>;
	};
	'devices.updateKey': {
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		/** - If `true`, disable the device's key expiry. The original key expiry time is still maintained. Upon re-enabling, the key will expire at that original time. - If `false`, enable the device's key expiry. Sets the key to expire at the original expiry time prior to disabling. The key may already… */
		keyExpiryDisabled: boolean;
	};
	'dns.configuration.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'dns.configuration.set': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** Global DNS resolvers to use. If `preferences.overrideLocalDNS` is true, these override the local OS configuration; otherwise they are used as fallback resolvers. */
		nameservers?: Array<TailscaleDnsConfigurationResolverInput>;
		/** Map of DNS name suffixes (domains) to lists of resolvers for Split DNS and advanced routing overlays. */
		splitDNS?: Record<
			string,
			Array<TailscaleDnsConfigurationResolverInput> | null
		>;
		/** Search domain paths to apply. */
		searchPaths?: Array<string>;
		preferences?: TailscaleDnsConfigurationPreferencesInput;
	};
	'dns.nameservers.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'dns.nameservers.set': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** DNS nameservers. */
		dns?: Array<string>;
	};
	'dns.preferences.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'dns.preferences.set': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** Whether MagicDNS is active for this tailnet. */
		magicDNS: boolean;
	};
	'dns.searchPaths.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'dns.searchPaths.set': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The search domains for the given tailnet. */
		searchPaths: Array<string>;
	};
	'dns.splitDns.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'dns.splitDns.set': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		domains: TailscaleSplitDnsInput;
	};
	'dns.splitDns.update': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		domains: TailscaleSplitDnsInput;
	};
	'keys.create': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The type of key to create. Defaults to "auth" if omitted. */
		keyType?: 'auth' | 'client' | 'federated';
		/** A short string specifying the purpose of the key. Can be a maximum of 50 alphanumeric characters. Hyphens and spaces are also allowed. */
		description?: string;
		capabilities?: TailscaleKeyCapabilitiesInput;
		/** Specifies the duration in seconds until the key expires. Defaults to 90 days if not supplied. Only applies to auth keys. */
		expirySeconds?: number;
		/** A list of scopes to grant to the key. At least one scope is required for OAuth clients and federated identities. See [trust credentials scopes](https://tailscale.com/docs/reference/trust-credentials#scopes) for a list of available scopes. Only applies to OAuth clients and federated identities. */
		scopes?: Array<string>;
		/** A list of tags associated to the trust credential. Auth keys created with this credential must have these exact tags, or tags owned by the credential's tags. Mandatory if the scopes include "devices:core" or "auth_keys". Only applies to OAuth clients and federated identities. */
		tags?: Array<string>;
		/** The issuer of the OIDC identity token used in the token exchange. Must be a valid and publicly reachable https:// URL. Only applies to federated identities. */
		issuer?: string;
		/** The pattern used when matching against the `sub` claim from an OIDC identity token. Patterns can include `*` characters to match against any character. Only applies to federated identities. */
		subject?: string;
		/** The value used when matching against the `aud` claim from an OIDC identity token. Specifying the audience is optional as Tailscale will generate a secure audience at creation time by default. It is recommended to let Tailscale generate the audience unless the identity provider you are… */
		audience?: string;
		/** A map of claim names to pattern strings used to match against arbitrary claims in the OIDC identity token. Patterns can include `*` characters to match against any character. Only applies to federated identities. */
		customClaimRules?: Record<string, string>;
	};
	'keys.delete': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The id of the key. The key ID can be found in the [admin console](https://login.tailscale.com/admin/settings/keys). */
		keyId: string;
	};
	'keys.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The id of the key. The key ID can be found in the [admin console](https://login.tailscale.com/admin/settings/keys). */
		keyId: string;
	};
	'keys.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** If set to true, this will return all auth keys, API access tokens and OAuth clients for the tailnet. */
		all: boolean;
	};
	'keys.update': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The id of the key. The key ID can be found in the [admin console](https://login.tailscale.com/admin/settings/keys). */
		keyId: string;
		/** The type of the key being updated. */
		keyType?: 'client' | 'federated';
		/** A short string specifying the purpose of the key. Can be a maximum of 50 alphanumeric characters. Hyphens and spaces are also allowed. */
		description?: string;
		/** A list of scopes to grant to the key. At least one scope is required. See [trust credentials scopes](https://tailscale.com/docs/reference/trust-credentials#scopes) for a list of available scopes. */
		scopes?: Array<string>;
		/** A list of tags associated to the trust credential. Auth keys created with this credential must have these exact tags, or tags owned by the credential's tags. Mandatory if the scopes include "devices:core" or "auth_keys". */
		tags?: Array<string>;
		/** The issuer of the OIDC identity token used in the token exchange. Must be a valid https:// URL. Only applies to federated identities. */
		issuer?: string;
		/** The pattern used when matching against the `sub` claim from an OIDC identity token. Patterns can include `*` characters to match against any character. Only applies to federated identities. */
		subject?: string;
		/** The value used when matching against the `aud` claim from an OIDC identity token. Only applies to federated identities. */
		audience?: string;
		/** A map of claim names to pattern strings used to match against arbitrary claims in the OIDC identity token. Patterns can include `*` characters to match against any character. Only applies to federated identities. */
		customClaimRules?: Record<string, string>;
	};
	'logging.awsExternalId.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** If set to true, this same AWS external id will be returned on future calls to this endpoint, if and only if those calls also mark `reusable` as true, and the ID has not yet been linked with an AWS account. */
		reusable?: boolean;
	};
	'logging.awsExternalId.validate': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The AWS external ID to validate. */
		id: string;
		/** ARN of the AWS IAM role to validate with this external ID. */
		roleArn?: string;
	};
	'logging.configurationLogs.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The start of the time window for which to retrieve logs, in RFC 3339 format. */
		start: string;
		/** The end of the time window for which to retrieve logs, in RFC 3339 format. */
		end: string;
		/** List of filters on actors, either exact actor IDs or a wildcard search on login name or display name indicated as `~search`. */
		actor?: Array<string>;
		/** List of target elements for which to filter, attempts to match any part of any of the targets to any of the given strings. */
		target?: Array<string>;
		/** List of events for which to filter. */
		event?: Array<
			| 'ADMIN_CONSOLE.LOGIN'
			| 'ADMIN_CONSOLE.LOGOUT'
			| 'API_KEY.CREATE'
			| 'API_KEY.EXPIRED'
			| 'API_KEY.REVOKE'
			| 'BILLING.CANCEL.SUBSCRIPTION'
			| 'BILLING.CREATE.SUBSCRIPTION'
			| 'BILLING.UPDATE.ADDRESS'
			| 'BILLING.UPDATE.BILLING_OWNER'
			| 'BILLING.UPDATE.EMAIL'
			| 'BILLING.UPDATE.PAYMENT_INFO'
			| 'BILLING.UPDATE.STRIPE_CUSTOMER_ID'
			| 'BILLING.UPDATE.SUBSCRIPTION'
			| 'FAILED_REQUEST.UPDATE'
			| 'GROUP.PUSH_GROUP.ATTRIBUTES'
			| 'GROUP.UPDATE.USER_ROLE'
			| 'INVITE.ACCEPT.FEATURE'
			| 'INVITE.ACCEPT.NODE_SHARE'
			| 'INVITE.ACCEPT.TAILNET_INVITE'
			| 'INVITE.CREATE.FEATURE'
			| 'INVITE.CREATE.NODE_SHARE'
			| 'INVITE.CREATE.TAILNET_INVITE'
			| 'INVITE.DELETE.NODE_SHARE'
			| 'INVITE.DELETE.TAILNET_INVITE'
			| 'INVITE.RESEND.NODE_SHARE'
			| 'INVITE.RESEND.TAILNET_INVITE'
			| 'NODE.APPROVE'
			| 'NODE.CREATE'
			| 'NODE.CREATE.ATTRIBUTES'
			| 'NODE.DELETE'
			| 'NODE.DELETE.ATTRIBUTES'
			| 'NODE.DISABLE.KEY_EXPIRY'
			| 'NODE.DISCONNECT_NODE.CLIENT_LOG'
			| 'NODE.ENABLE.KEY_EXPIRY'
			| 'NODE.EXPIRED.KEY_EXPIRY_TIME'
			| 'NODE.LOGIN'
			| 'NODE.LOGOUT'
			| 'NODE.REVOKE'
			| 'NODE.UPDATE.ACL_TAGS'
			| 'NODE.UPDATE.ALLOWED_IPS'
			| 'NODE.UPDATE.ATTRIBUTES'
			| 'NODE.UPDATE.AUTO_APPROVED_ROUTES'
			| 'NODE.UPDATE.EXIT_NODE'
			| 'NODE.UPDATE.KEY_EXPIRY_TIME'
			| 'NODE.UPDATE.MACHINE_NAME'
			| 'NODE.UPDATE.POSTURE_IDENTITY'
			| 'NODE.UPDATE.TKA'
			| 'SHARE.CREATE'
			| 'SHARE.DELETE'
			| 'SHARE.UPDATE'
			| 'TAILNET.ACCEPT.FEATURE'
			| 'TAILNET.CREATE'
			| 'TAILNET.CREATE.LOGSTREAM_ENDPOINT'
			| 'TAILNET.CREATE.POSTURE_INTEGRATION'
			| 'TAILNET.CREATE.TKA'
			| 'TAILNET.DELETE.LOGSTREAM_ENDPOINT'
			| 'TAILNET.DELETE.POSTURE_INTEGRATION'
			| 'TAILNET.DELETE.TKA'
			| 'TAILNET.DISABLE.COLLECT_POSTURE_IDENTITY'
			| 'TAILNET.DISABLE.COLLECT_SERVICES'
			| 'TAILNET.DISABLE.FILE_SHARING'
			| 'TAILNET.DISABLE.GEOSTEERING'
			| 'TAILNET.DISABLE.HTTPS'
			| 'TAILNET.DISABLE.LOG_EXIT_FLOWS'
			| 'TAILNET.DISABLE.MACHINE_APPROVAL_NEEDED'
			| 'TAILNET.DISABLE.MAGIC_DNS'
			| 'TAILNET.DISABLE.MULLVAD_VPN'
			| 'TAILNET.DISABLE.NETWORK_FLOW_LOGGING'
			| 'TAILNET.DISABLE.SCIM'
			| 'TAILNET.DISABLE.TKA'
			| 'TAILNET.DISABLE.USER_APPROVAL_REQUIRED'
			| 'TAILNET.ENABLE.COLLECT_POSTURE_IDENTITY'
			| 'TAILNET.ENABLE.COLLECT_SERVICES'
			| 'TAILNET.ENABLE.FILE_SHARING'
			| 'TAILNET.ENABLE.GEOSTEERING'
			| 'TAILNET.ENABLE.HTTPS'
			| 'TAILNET.ENABLE.LOG_EXIT_FLOWS'
			| 'TAILNET.ENABLE.MACHINE_APPROVAL_NEEDED'
			| 'TAILNET.ENABLE.MAGIC_DNS'
			| 'TAILNET.ENABLE.MULLVAD_VPN'
			| 'TAILNET.ENABLE.NETWORK_FLOW_LOGGING'
			| 'TAILNET.ENABLE.SCIM'
			| 'TAILNET.ENABLE.TKA'
			| 'TAILNET.ENABLE.USER_APPROVAL_REQUIRED'
			| 'TAILNET.JOIN'
			| 'TAILNET.JOIN_WAITLIST.FEATURE'
			| 'TAILNET.LEAVE'
			| 'TAILNET.UPDATE.ACCOUNT_EMAIL'
			| 'TAILNET.UPDATE.ACL'
			| 'TAILNET.UPDATE.DNS_CONFIG'
			| 'TAILNET.UPDATE.LOGSTREAM_ENDPOINT'
			| 'TAILNET.UPDATE.MAX_KEY_DURATION'
			| 'TAILNET.UPDATE.POSTURE_INTEGRATION'
			| 'TAILNET.UPDATE.ROUTE_SELECTION'
			| 'TAILNET.UPDATE.SECURITY_EMAIL'
			| 'TAILNET.UPDATE.SUPPORT_EMAIL'
			| 'TAILNET.UPDATE.TCD'
			| 'TAILNET.UPDATE.TKA'
			| 'TAILNET.VERIFY.ACCOUNT_EMAIL'
			| 'TAILNET.VERIFY.SECURITY_EMAIL'
			| 'TAILNET.VERIFY.SUPPORT_EMAIL'
			| 'USER.APPROVE'
			| 'USER.CREATE'
			| 'USER.DELETE'
			| 'USER.INVITE'
			| 'USER.PUSH_USER.ATTRIBUTES'
			| 'USER.RESEND.TAILNET_INVITE'
			| 'USER.RESTORE'
			| 'USER.RESTORE_GLOBAL'
			| 'USER.SUSPEND'
			| 'USER.SUSPEND_GLOBAL'
			| 'USER.UPDATE.USER_ROLE'
			| 'WEBHOOK_ENDPOINT.CREATE'
			| 'WEBHOOK_ENDPOINT.DELETE'
			| 'WEBHOOK_ENDPOINT.UPDATE.SECRET'
			| 'WEBHOOK_ENDPOINT.UPDATE.SUBSCRIBED_EVENTS'
			| 'WEB_INTERFACE.LOGIN'
			| 'WEB_INTERFACE.LOGOUT'
			| 'PAM_CONNECTOR.CREATE'
			| 'PAM_CONNECTOR.CREATE.ACCESS_TOKEN'
			| 'PAM_CONNECTOR.DELETE'
			| 'PAM_CONNECTOR.DISABLE.ACCESS_TOKEN'
			| 'PAM_CONNECTOR.UPDATE'
			| 'PAM_SERVICE.CREATE'
			| 'PAM_SERVICE.DELETE'
			| 'PAM_SERVICE.UPDATE'
			| 'PAM_SERVICE_ACCOUNT.CREATE'
			| 'PAM_SERVICE_ACCOUNT.CREATE.ACCESS_TOKEN'
			| 'PAM_SERVICE_ACCOUNT.DELETE'
			| 'PAM_SERVICE_ACCOUNT.UPDATE'
			| 'PAM_SETTINGS.CREATE.CUSTOM_DOMAIN'
			| 'PAM_SETTINGS.CREATE.NOTIFICATION'
			| 'PAM_SETTINGS.CREATE.RECORDING_STORAGE'
			| 'PAM_SETTINGS.DELETE.CUSTOM_DOMAIN'
			| 'PAM_SETTINGS.DELETE.NOTIFICATION'
			| 'PAM_SETTINGS.DELETE.RECORDING_STORAGE'
			| 'PAM_SETTINGS.UPDATE'
			| 'PAM_SETTINGS.UPDATE.CUSTOM_DOMAIN'
			| 'PAM_SETTINGS.UPDATE.NOTIFICATION'
			| 'PAM_SETTINGS.UPDATE.SETUP_WIZARD'
		>;
	};
	'logging.networkLogs.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The start of the time window for which to retrieve logs, in RFC 3339 format. */
		start: string;
		/** The end of the time window for which to retrieve logs, in RFC 3339 format. */
		end: string;
	};
	'logging.streaming.disable': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The type of log. */
		logType: TailscaleLogTypeInput;
	};
	'logging.streaming.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The type of log. */
		logType: TailscaleLogTypeInput;
	};
	'logging.streaming.getStatus': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The type of log. */
		logType: TailscaleLogTypeInput;
	};
	'logging.streaming.set': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The type of log. */
		logType: TailscaleLogTypeInput;
		/** The type of system to which logs are being streamed. */
		destinationType?:
			| 'splunk'
			| 'elastic'
			| 'panther'
			| 'cribl'
			| 'crowdstrike'
			| 'datadog'
			| 'axiom'
			| 's3';
		/** The URL to which log streams are being posted. If the DestinationType is `s3`, the URL may be (and often is) empty to use the official Amazon S3 endpoint. */
		url?: string;
		/** The username with which log streams to this endpoint are authenticated. */
		user?: string;
		/** An optional number of minutes to wait in between uploading new logs. If the quantity of logs does not fit within a single upload, multiple uploads will be made. */
		uploadPeriodMinutes?: number;
		/** The compression algorithm with which to compress logs. `none` disables compression. Defaults to `none`. */
		compressionFormat?: 'zstd' | 'gzip' | 'none';
		/** The token/password with which log streams to this endpoint should be authenticated. */
		token?: string;
		/** The S3 bucket name. Required if the destinationType is `s3`. */
		s3Bucket?: string;
		/** The region in which the S3 bucket is located. Required if the destinationType is `s3`. */
		s3Region?: string;
		/** An optional S3 key prefix to prepend to the auto-generated S3 key name. */
		s3KeyPrefix?: string;
		/** What type of authentication to use for S3. Required if the destinationType is `s3`. Tailscale recommends using `rolearn`. See [Amazon documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html). */
		s3AuthenticationType?: 'accesskey' | 'rolearn';
		/** The S3 access key ID. Required if the destinationType is `s3` and `authenticationType` is `accesskey`. */
		s3AccessKeyId?: string;
		/** The S3 secret access key. Required if the destinationType is `s3` and `authenticationType` is `accesskey`. */
		s3SecretAccessKey?: string;
		/** The Role ARN that Tailscale should supply to AWS when authenticating using role-based authentication. Required if the destinationType is `s3` and `authenticationType` is `rolearn`. */
		s3RoleArn?: string;
		/** The GCS bucket name. Required if the destinationType is `gcs`. */
		gcsBucket?: string;
		/** An optional GCS key prefix to append to the GCS bucket name. */
		gcsKeyPrefix?: string;
		/** The GCS scopes needed to be able to write to the GCS bucket. */
		gcsScopes?: Array<string>;
		/** The JSON workload identity credentials from GCS needed for accessing the GCS account. */
		gcsCredentials?: string;
	};
	'oauthApps.create': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		name: TailscaleNameInput;
		description?: TailscaleDescriptionInput;
		redirectURIs: TailscaleRedirectURIsInput;
		scopes: TailscaleScopesInput;
		allowedNodeAttributes?: TailscaleAllowedNodeAttributesInput;
	};
	'oauthApps.delete': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The ID of the OAuth app. */
		appId: string;
	};
	'oauthApps.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The ID of the OAuth app. */
		appId: string;
	};
	'oauthApps.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'oauthApps.update': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The ID of the OAuth app. */
		appId: string;
		name: TailscaleNameInput;
		description?: TailscaleDescriptionInput;
		redirectURIs: TailscaleRedirectURIsInput;
		scopes: TailscaleScopesInput;
		allowedNodeAttributes?: TailscaleAllowedNodeAttributesInput;
	};
	'policyFile.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** Request a detailed description of the tailnet policy file by providing `details=true` in the URL query string. Supplying any other value for `details`, or not sending the param, is treated as sending `details=false`. If using this, do not supply an `Accept` parameter in the header. The response… */
		details?: boolean;
		/** "hujson" (default): the policy as text, comments kept. "json": the policy as an object, comments dropped. */
		format?: 'hujson' | 'json';
	};
	'policyFile.preview': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** Specify for which type of resource (user or IP port) matching rules are to be fetched. Read about [previewing changes in the admin console](https://tailscale.com/docs/features/tailnet-policy-file/manage-tailnet-policies#preview-changes). OAuth Scope: `policy_file:read`. */
		type: 'user' | 'ipport';
		/** - If `type` is `user`, provide the email of a valid user with registered machines. - If `type` is `ipport`, provide an IP address + port: `10.0.0.1:80`. The supplied policy file is queried with this parameter to determine which rules match. */
		previewFor: string;
		/** The whole policy file: HuJSON text (keeps comments) or a JSON object. */
		policy: string | Record<string, TailscaleJsonValue>;
	};
	'policyFile.set': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The etag from policyFile.get. Tailscale saves only if the file is still that version, so a change someone made in between is not overwritten. "ts-default" saves only over the untouched default policy. */
		ifMatch?: string;
		/** The whole policy file: HuJSON text (keeps comments) or a JSON object. */
		policy: string | Record<string, TailscaleJsonValue>;
		/** "hujson" (default): the policy as text, comments kept. "json": the policy as an object, comments dropped. */
		format?: 'hujson' | 'json';
	};
	'policyFile.validate': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** A draft policy file to parse and test, HuJSON text or an object. Give either policy or tests. */
		policy?: string | Record<string, TailscaleJsonValue>;
		/** ACL tests to run against the current policy file, e.g. [{ "src": "dave@example.com", "accept": ["tag:mcp:443"], "deny": ["tag:db:5432"] }]. Give either tests or policy. */
		tests?: Array<{
			/** Specifies the user identity to test, which can be a [user's email address](https://tailscale.com/docs/reference/syntax/policy-file#reference-users), a [group](https://tailscale.com/docs/reference/syntax/policy-file#groups), a [tag](https://tailscale.com/docs/features/tags), or a… */
			src: string;
			/** Specifies the [device posture attributes](https://tailscale.com/docs/reference/syntax/policy-file#proto-1) as key-value pairs to use when evaluating posture conditions in access rules. You only need to use this field if the access rules contain [device posture… */
			srcPostureAttrs?: Record<string, string | number | boolean>;
			/** Specifies the IP protocol for `accept` and `deny` rules, similar to the `proto` field in [ACL rules](https://tailscale.com/docs/reference/syntax/policy-file#acls). When omitted, the test checks for either TCP or UDP access. */
			proto?: string;
			/** Specifies destinations to accept. Each destination in the list is of the form `host:port` where `port` is a single numeric port and `host` is in the format described in the [acl syntax](https://tailscale.com/docs/reference/syntax/policy-file#accept-and-deny-destinations) documentation. Sources… */
			accept?: Array<string>;
			/** Specifies destinations to deny. Each destination in the list is of the form `host:port` where `port` is a single numeric port and `host` is in the format described in the [acl syntax](https://tailscale.com/docs/reference/syntax/policy-file#accept-and-deny-destinations) documentation. Sources in… */
			deny?: Array<string>;
		}>;
	};
	'postureIntegrations.create': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The device posture provider. Required on POST requests, ignored on PATCH requests. */
		provider?:
			| 'falcon'
			| 'intune'
			| 'jamfpro'
			| 'kandji'
			| 'kolide'
			| 'sentinelone';
		/** Identifies which of the provider's clouds to integrate with. - For CrowdStrike Falcon, it will be one of `us-1`, `us-2`, `eu-1` or `us-gov`. - For Microsoft Intune, it will be one of `global` or `us-gov`. - For Jamf Pro, Kandji and Sentinel One, it is the FQDN of your subdomain, for example… */
		cloudId?: string;
		/** Unique identifier for your client. - For Microsoft Intune, it will be your application's UUID. - For CrowdStrike Falcon and Jamf Pro, it will be your client id. - For Kandji, Kolide and Sentinel One, this is left blank. */
		clientId?: string;
		/** The Microsoft Intune directory (tenant) ID. For other providers, this is left blank. */
		tenantId?: string;
		/** The secret (auth key, token, etc.) used to authenticate with the provider. Required when creating a new integration, may be omitted when updating an existing integration, in which case we retain the existing password. */
		clientSecret?: string;
	};
	'postureIntegrations.delete': {
		/** Unique identifier for a posture integration. */
		id: string;
	};
	'postureIntegrations.get': {
		/** Unique identifier for a posture integration. */
		id: string;
	};
	'postureIntegrations.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'postureIntegrations.update': {
		/** Unique identifier for a posture integration. */
		id: string;
		/** The device posture provider. Required on POST requests, ignored on PATCH requests. */
		provider?:
			| 'falcon'
			| 'intune'
			| 'jamfpro'
			| 'kandji'
			| 'kolide'
			| 'sentinelone';
		/** Identifies which of the provider's clouds to integrate with. - For CrowdStrike Falcon, it will be one of `us-1`, `us-2`, `eu-1` or `us-gov`. - For Microsoft Intune, it will be one of `global` or `us-gov`. - For Jamf Pro, Kandji and Sentinel One, it is the FQDN of your subdomain, for example… */
		cloudId?: string;
		/** Unique identifier for your client. - For Microsoft Intune, it will be your application's UUID. - For CrowdStrike Falcon and Jamf Pro, it will be your client id. - For Kandji, Kolide and Sentinel One, this is left blank. */
		clientId?: string;
		/** The Microsoft Intune directory (tenant) ID. For other providers, this is left blank. */
		tenantId?: string;
		/** The secret (auth key, token, etc.) used to authenticate with the provider. Required when creating a new integration, may be omitted when updating an existing integration, in which case we retain the existing password. */
		clientSecret?: string;
	};
	'services.delete': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The unique name of a Service. The name should be prefixed with "svc:". It should be unique across the tailnet, so names already used for a machine cannot be reused for a Service. */
		serviceName: string;
	};
	'services.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The unique name of a Service. The name should be prefixed with "svc:". It should be unique across the tailnet, so names already used for a machine cannot be reused for a Service. */
		serviceName: string;
	};
	'services.hosts.getApproval': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The unique name of a Service. The name should be prefixed with "svc:". It should be unique across the tailnet, so names already used for a machine cannot be reused for a Service. */
		serviceName: string;
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
	};
	'services.hosts.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The unique name of a Service. The name should be prefixed with "svc:". It should be unique across the tailnet, so names already used for a machine cannot be reused for a Service. */
		serviceName: string;
	};
	'services.hosts.setApproval': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The unique name of a Service. The name should be prefixed with "svc:". It should be unique across the tailnet, so names already used for a machine cannot be reused for a Service. */
		serviceName: string;
		/** ID of the device. Using the device's `nodeId` is preferred, but its numeric `id` value can also be used. */
		deviceId: string;
		/** Indicates whether to approve or revoke approval for the Service on the device. */
		approved?: boolean;
	};
	'services.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'services.update': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The unique name of a Service. The name should be prefixed with "svc:". It should be unique across the tailnet, so names already used for a machine cannot be reused for a Service. */
		serviceName: string;
		/** The IP addresses assigned to the Service: the IPv4 followed by the IPv6. */
		addrs?: Array<string>;
		/** The unique name of the Service. */
		name?: string;
		/** An optional human-readable label for the Service, shown in the Tailscale admin console and to clients with access to the Service. Must be 64 characters or fewer. */
		displayName?: string;
		/** An optional comment for the Service. */
		comment?: string;
		/** A list of protocol:port pairs to be exposed by the Service. The only supported protocol is "tcp" at this time. "do-not-validate" can be used to skip validation. */
		ports?: Array<string>;
		/** A list of optional tags associated with the Service. */
		tags?: Array<string>;
	};
	'tailnetSettings.get': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'tailnetSettings.update': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** Prevents users from editing policies in the admin console to avoid conflicts with external management workflows like GitOps or Terraform. */
		aclsExternallyManagedOn?: boolean | null;
		/** Link to the external tailnet policy definition or management solution for this tailnet. */
		aclsExternalLink?: string;
		/** The [admin console session timeout](https://tailscale.com/docs/account/admin-console-session-timeout) for members of this tailnet. Setting it to 0 disables the timeout. */
		adminConsoleSessionTimeoutMinutes?: number;
		/** Whether [device approval](https://tailscale.com/docs/features/access-control/device-management/device-approval) is enabled for the tailnet. */
		devicesApprovalOn?: boolean | null;
		/** Whether [auto updates](https://tailscale.com/docs/features/client/update#auto-updates) are enabled for devices that belong to this tailnet. */
		devicesAutoUpdatesOn?: boolean | null;
		/** The [key expiry](https://tailscale.com/docs/features/access-control/key-expiry) duration for devices on this tailnet. */
		devicesKeyDurationDays?: number;
		/** Whether [user approval](https://tailscale.com/docs/features/access-control/user-approval) is enabled for this tailnet. */
		usersApprovalOn?: boolean | null;
		/** Which user roles are allowed to [join external tailnets](https://tailscale.com/docs/features/sharing/how-to/invite-any-user). */
		usersRoleAllowedToJoinExternalTailnets?: 'none' | 'admin' | 'member';
		/** Whether [network flog logs](https://tailscale.com/docs/features/logging/network-flow-logs) are enabled for the tailnet. */
		networkFlowLoggingOn?: boolean | null;
		/** The [route selection](https://tailscale.com/docs/features/route-selection) algorithm used by the tailnet: * `active-passive-failover` - Active-passive failover (formerly known as "Failover") * `regional-routing` - Regional routing * `regional-routing-failover` - Regional routing with in-region… */
		routeSelection?:
			| 'active-passive-failover'
			| 'regional-routing'
			| 'regional-routing-failover'
			| 'magicroute';
		/** Whether [identity collection](https://tailscale.com/docs/features/access-control/device-management/how-to/manage-identity) is enabled for [device posture](https://tailscale.com/docs/features/device-posture) integrations for the tailnet. */
		postureIdentityCollectionOn?: boolean | null;
		/** Whether provisioning of [HTTPS certificates](https://tailscale.com/docs/how-to/set-up-https-certificates) is enabled for this tailnet. */
		httpsEnabled?: boolean | null;
	};
	'tailnets.create': {
		/** The organization ID, or "-" (the default) for the organization the key belongs to. */
		organization?: string;
		/** A custom name for the tailnet. It can contain letters, numbers, spaces, apostrophes, and hyphens, and must be unique within the organization. */
		displayName: string;
	};
	'tailnets.delete': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'tailnets.list': {
		/** The organization ID, or "-" (the default) for the organization the key belongs to. */
		organization?: string;
		/** Maximum number of tailnets to return per page; defaults to the maximum of 100. */
		limit?: number;
		/** Opaque pagination cursor from a previous response. */
		cursor?: string;
	};
	'userInvites.create': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		invites: Array<{
			/** Optionally specifies a user role to assign the invited user. */
			role?:
				| 'member'
				| 'admin'
				| 'it-admin'
				| 'network-admin'
				| 'billing-admin'
				| 'auditor';
			/** Optionally specifies the email to send the created invite. If not set, the endpoint generates and returns an invite URL, but does not email it out. */
			email?: string;
		}>;
	};
	'userInvites.delete': {
		/** ID of the user invite. */
		userInviteId: string;
	};
	'userInvites.get': {
		/** ID of the user invite. */
		userInviteId: string;
	};
	'userInvites.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'userInvites.resend': {
		/** ID of the user invite. */
		userInviteId: string;
	};
	'users.approve': {
		/** ID of the user. */
		userId: string;
	};
	'users.delete': {
		/** ID of the user. */
		userId: string;
	};
	'users.get': {
		/** ID of the user. */
		userId: string;
	};
	'users.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** Allows for filtering the output by user type. */
		type?: 'member' | 'shared' | 'all';
		/** Allows for filtering the output by user role. Learn more about [user roles](https://tailscale.com/docs/reference/user-roles). */
		role?:
			| 'owner'
			| 'member'
			| 'admin'
			| 'it-admin'
			| 'network-admin'
			| 'billing-admin'
			| 'auditor'
			| 'all';
	};
	'users.restore': {
		/** ID of the user. */
		userId: string;
	};
	'users.suspend': {
		/** ID of the user. */
		userId: string;
	};
	'users.updateRole': {
		/** ID of the user. */
		userId: string;
		/** The role of the user. Learn more about [user roles](https://tailscale.com/docs/reference/user-roles). */
		role?:
			| 'owner'
			| 'member'
			| 'admin'
			| 'it-admin'
			| 'network-admin'
			| 'billing-admin'
			| 'auditor';
	};
	'webhooks.create': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
		/** The endpoint that events are sent to from Tailscale via POST requests. */
		endpointUrl: string;
		providerType?: TailscaleProviderTypeInput;
		subscriptions: TailscaleSubscriptionsInput;
	};
	'webhooks.delete': {
		/** ID for the webhook endpoint. */
		endpointId: string;
	};
	'webhooks.get': {
		/** ID for the webhook endpoint. */
		endpointId: string;
	};
	'webhooks.list': {
		/** The tailnet ID (T1234CNTRL, from Settings → General) or "-", the tailnet the key belongs to. Defaults to the plugin's `tailnet` option, else "-". */
		tailnet?: string;
	};
	'webhooks.rotateSecret': {
		/** ID for the webhook endpoint. */
		endpointId: string;
	};
	'webhooks.test': {
		/** ID for the webhook endpoint. */
		endpointId: string;
	};
	'webhooks.update': {
		/** ID for the webhook endpoint. */
		endpointId: string;
		subscriptions?: TailscaleSubscriptionsInput;
	};
};

export type TailscaleOperationOutputs = {
	'contacts.get': {
		account?: TailscaleContact | null;
		support?: TailscaleContact | null;
		security?: TailscaleContact | null;
	};
	'contacts.resendVerificationEmail': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'contacts.update': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'deviceInvites.accept': {
		/** Information about the device being shared. */
		device?: {
			/** The `nodeId` for the device. */
			id?: string | null;
			/** The operating system that the device is running. */
			os?: string | null;
			/** The name of the device. */
			name?: string | null;
			/** The MagicDNS name of the device. Learn more about MagicDNS at https://tailscale.com/docs/features/magicdns. */
			fqdn?: string | null;
			/** The IPv4 address of the device. */
			ipv4?: string | null;
			/** The IPv6 address of the device. */
			ipv6?: string | null;
			/** Specifies whether the invited user is able to use the device as an exit node when the device is advertising as one. */
			includeExitNode?: boolean | null;
		} | null;
		/** The user who create the device share invite. */
		sharer?: {
			/** The ID of the user who created the share invite. */
			id?: string | null;
			/** The display name of the user who created the share invite. */
			displayName?: string | null;
			/** The email address of the user who created the share invite. */
			loginName?: string | null;
			/** The profile pic URL for the user who created the share invite. */
			profilePicURL?: string | null;
		} | null;
		/** The user accepting the device share invite. */
		acceptedBy?: {
			/** The ID of the user who accepted the share invite. */
			id?: string | null;
			/** The display name of the user who accepted the share invite. */
			displayName?: string | null;
			/** The email address of the user who accepted the share invite. */
			loginName?: string | null;
			/** The profile pic URL for the user who accepted the share invite. */
			profilePicURL?: string | null;
		} | null;
	};
	'deviceInvites.create': Array<TailscaleDeviceInvite> | null;
	'deviceInvites.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'deviceInvites.get': TailscaleDeviceInvite;
	'deviceInvites.list': Array<TailscaleDeviceInvite> | null;
	'deviceInvites.resend': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'devices.authorize': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'devices.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'devices.expireKey': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'devices.get': TailscaleDevice;
	'devices.list': {
		devices?: Array<TailscaleDevice> | null;
	};
	'devices.postureAttributes.batchUpdate': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'devices.postureAttributes.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'devices.postureAttributes.get': TailscaleDevicePostureAttributes;
	'devices.postureAttributes.set': TailscaleDevicePostureAttributes;
	'devices.routes.list': TailscaleDeviceRoutes;
	'devices.routes.set': TailscaleDeviceRoutes;
	'devices.setIp': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'devices.setName': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'devices.setTags': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'devices.updateKey': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'dns.configuration.get': TailscaleDnsConfiguration;
	'dns.configuration.set': TailscaleDnsConfiguration;
	'dns.nameservers.list': {
		/** DNS nameservers. */
		dns?: Array<string> | null;
	};
	'dns.nameservers.set': {
		/** DNS nameservers. */
		dns?: Array<string> | null;
		/** Whether MagicDNS is active for this tailnet. */
		magicDNS?: boolean | null;
	};
	'dns.preferences.get': TailscaleDnsPreferences;
	'dns.preferences.set': TailscaleDnsPreferences;
	'dns.searchPaths.list': TailscaleDnsSearchPaths;
	'dns.searchPaths.set': TailscaleDnsSearchPaths;
	'dns.splitDns.get': TailscaleSplitDns;
	'dns.splitDns.set': TailscaleSplitDns;
	'dns.splitDns.update': TailscaleSplitDns;
	'keys.create': TailscaleKey;
	'keys.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'keys.get': TailscaleKey;
	'keys.list': {
		/** A list of the active keys. */
		keys?: Array<TailscaleKey> | null;
	};
	'keys.update': TailscaleKey;
	'logging.awsExternalId.get': TailscaleAwsExternalId;
	'logging.awsExternalId.validate': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'logging.configurationLogs.list': {
		/** Version of audit logs response. */
		version?: string | null;
		/** The tailnet on which the logged configuration changes were made. */
		tailnet?: string | null;
		/** Matching log entries, ordered chronologically. */
		logs?: Array<TailscaleConfigurationAuditLog> | null;
	};
	'logging.networkLogs.list': {
		/** Matching log entries, ordered chronologically. */
		logs?: Array<TailscaleNetworkFlowLog> | null;
	};
	'logging.streaming.disable': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'logging.streaming.get': TailscaleLogstreamEndpointConfiguration;
	'logging.streaming.getStatus': TailscaleLogstreamEndpointPublishingStatus;
	'logging.streaming.set': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'oauthApps.create': TailscaleOAuthApp;
	'oauthApps.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'oauthApps.get': TailscaleOAuthApp;
	'oauthApps.list': {
		oauthApps?: Array<TailscaleOAuthApp> | null;
	};
	'oauthApps.update': TailscaleOAuthApp;
	'policyFile.get': {
		/** The policy file: HuJSON text for format "hujson" or details, an object for "json". */
		policy?: (string | Record<string, TailscaleJsonValue>) | null;
		/** The version of the file; pass it as ifMatch to policyFile.set. */
		etag?: string | null;
		/** With details: entries that parse but look wrong. */
		warnings?: Array<string> | null;
		/** With details: parse errors. */
		errors?: Array<string> | null;
	};
	'policyFile.preview': {
		matches?: Array<{
			/** Source entities affected by the rule. */
			users?: Array<string> | null;
			/** Destinations that can be accessed. */
			ports?: Array<string> | null;
			/** The rule's location in the policy file. */
			lineNumber?: number | null;
		}> | null;
		/** Echoes the `type` provided in the request. */
		type?: string | null;
		/** Echoes the `previewFor` provided in the request. */
		previewFor?: string | null;
	};
	'policyFile.set': {
		/** The policy file: HuJSON text for format "hujson" or details, an object for "json". */
		policy?: (string | Record<string, TailscaleJsonValue>) | null;
		/** The version of the file; pass it as ifMatch to policyFile.set. */
		etag?: string | null;
		/** With details: entries that parse but look wrong. */
		warnings?: Array<string> | null;
		/** With details: parse errors. */
		errors?: Array<string> | null;
	};
	'policyFile.validate': {
		message?: string | null;
		data?: Array<Record<string, TailscaleJsonValue>> | null;
	} | null;
	'postureIntegrations.create': TailscalePostureIntegration;
	'postureIntegrations.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'postureIntegrations.get': TailscalePostureIntegration;
	'postureIntegrations.list': {
		/** List of PostureIntegrations. */
		integrations?: Array<TailscalePostureIntegration> | null;
	};
	'postureIntegrations.update': TailscalePostureIntegration;
	'services.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'services.get': TailscaleVIPServiceInfo;
	'services.hosts.getApproval': TailscaleVIPServiceApproval;
	'services.hosts.list': {
		hosts?: Array<TailscaleServiceHostInfo> | null;
	};
	'services.hosts.setApproval': TailscaleVIPServiceApproval;
	'services.list': {
		vipServices?: Array<TailscaleVIPServiceInfo> | null;
	};
	'services.update': TailscaleVIPServiceInfo;
	'tailnetSettings.get': TailscaleTailnetSettings;
	'tailnetSettings.update': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'tailnets.create': TailscaleCreateOrganizationTailnetResponse;
	'tailnets.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'tailnets.list': TailscaleListOrganizationTailnetsResponse;
	'userInvites.create': Array<TailscaleUserInvite> | null;
	'userInvites.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'userInvites.get': TailscaleUserInvite;
	'userInvites.list': Array<TailscaleUserInvite> | null;
	'userInvites.resend': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'users.approve': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'users.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'users.get': TailscaleUser;
	'users.list': {
		users?: Array<TailscaleUser> | null;
	};
	'users.restore': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'users.suspend': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'users.updateRole': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'webhooks.create': TailscaleWebhook;
	'webhooks.delete': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'webhooks.get': TailscaleWebhook;
	'webhooks.list': {
		webhooks?: Array<TailscaleWebhook> | null;
	};
	'webhooks.rotateSecret': TailscaleWebhook;
	'webhooks.test': {
		/** Tailscale accepted the call; it answers with no body. */
		success: true;
	};
	'webhooks.update': TailscaleWebhook;
};
