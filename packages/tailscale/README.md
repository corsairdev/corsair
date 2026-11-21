# @corsair-dev/tailscale

Tailscale plugin for Corsair: devices, auth keys, the policy file, DNS, users, Services and audit logs of a tailnet.

## Install

```bash
pnpm add @corsair-dev/tailscale
```

## Options

- `key`: an API access token (`tskey-api-…`, admin console → Settings → Keys;
  it expires after at most 90 days) or an OAuth client secret
  (`tskey-client-…`, Settings → Trust credentials). An OAuth client never
  expires and carries only the scopes it was given; the plugin exchanges it for
  a one-hour access token on first use, caches it in memory, and gets a new one
  five minutes before it runs out or after a 401. Tailscale writes the client ID
  into the secret, so the secret alone is enough. Hub stores either kind as the
  account's API key.
- `tailnet`: the tailnet ID (`T1234CNTRL`, Settings → General) calls address
  unless a call passes its own `tailnet`. Leave it out to use `-`, the tailnet
  the key belongs to.

## How it is built

The 93 operations are every route in Tailscale's published OpenAPI spec
(https://api.tailscale.com/api/v2?outputOpenapiSchema=true, fetched
2026-11-20), named after the resource groups of Tailscale's Go client
(`devices.list`, `keys.create`, `policyFile.set`, `dns.splitDns.update`, …):

- `tailscale-manifest.json` holds each operation's route, a flat input schema
  (path, query, header and body fields in one object), its response schema
  and the OAuth scopes the spec says it needs.
- `endpoints/operation-types.ts` and `endpoints/catalog.ts` are generated from
  the same spec: input and output types, the endpoint tree, risk levels and
  descriptions written for an agent.
- Zod schemas are built from the manifest on first use, one operation at a
  time (`endpoints/openapi-schema.ts`). Inputs keep the published contract;
  responses keep the documented types but let any field be missing or `null`.
  Server-set fields (`readOnly` in the spec, such as a posture integration's
  `status` or the settings' `regionalRoutingOn`) are dropped before sending,
  even when a caller passes back an object it read.

Shapes that don't fit one-field-per-parameter:

- **Policy file.** `policyFile.get` returns `{ policy, etag }`: HuJSON text with
  comments by default, or an object with `format: "json"`; `details: true`
  adds `warnings` and `errors`. `policyFile.set`, `preview` and `validate` take
  `policy` as HuJSON text (sent as `application/hujson`, comments kept) or an
  object. Pass the etag back as `ifMatch` and Tailscale refuses the write (412)
  if the file changed in between.
- **Device filters.** `devices.list` takes `filters`, sent as Tailscale's
  `field=value` query parameters (a list becomes repeated keys).
- **Whole bodies.** Invites (`invites: [...]`) and split DNS (`domains: {...}`)
  are a list or a map, so they go in one named field.

The spec's enums leave out values Tailscale's own Go client sends, so the
manifest adds them: `providerType: ""` (the generic webhook format) and the
`categoryTailnetManagement` and `categoryDeviceMisconfigurations` webhook
subscriptions. The live test creates a webhook with both.

Found by the live tests (the spec says otherwise or nothing):

- Empty invite lists come back as `null`, so `deviceInvites.list` and
  `userInvites.list` return `null` rather than `[]`.
- `tailnetSettings.update` answers `null` instead of the settings, and the
  posture batch update is documented as `null`: both return `{ success: true }`.
- `policyFile.validate` answers 200 with no body when every test passes
  (returned as `null`), and 200 with `message` for a parse error or failing
  tests. An empty `tests` list is a 400 ("no tests given").
- `policyFile.get` with `details=true` must go without an `Accept` header;
  with one, Tailscale skips the base64 encoding.
- `services.update` needs the Service's `name` in the body as well as the path;
  the plugin fills it from `serviceName`.
- An OAuth client calling outside its scopes gets 404 for some routes (users),
  not 403.
- Custom posture attributes and network flow logs depend on the plan (403
  "feature not available on current billing plan" on Personal).

No incoming webhooks yet: the plugin creates and manages webhook endpoints,
but receiving and verifying Tailscale's signed events is separate work.

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.get` | `tailscale.api.contacts.get` | `read` | Get the tailnet's account, support and security contact emails. |
| `contacts.resendVerificationEmail` | `tailscale.api.contacts.resendVerificationEmail` | `destructive` | Email the verification link for a contact address again. |
| `contacts.update` | `tailscale.api.contacts.update` | `destructive` | Change the account, support or security contact email. Tailscale emails the new address to verify it. |
| `deviceInvites.accept` | `tailscale.api.deviceInvites.accept` | `write` | Accept a device share invite from another tailnet into this key's tailnet, by its invite URL or code. The shared device then appears in devices.list. Needs a user's API access token: a share belongs to a user, so an OAuth client can't accept one. |
| `deviceInvites.create` | `tailscale.api.deviceInvites.create` | `destructive` | Share a device with people outside the tailnet. Each invite gives an invite URL to send; with email set, Tailscale emails the invite itself. allowExitNode lets the recipient use the device as an exit node; multiUse lets several people accept one link. deviceId is the device `id` or `nodeId` from devices.list. |
| `deviceInvites.delete` | `tailscale.api.deviceInvites.delete` | `write` | Delete a device share invite; its link stops working. |
| `deviceInvites.get` | `tailscale.api.deviceInvites.get` | `read` | Get a device share invite: its invite URL, who accepted it and when. |
| `deviceInvites.list` | `tailscale.api.deviceInvites.list` | `read` | List the share invites for a device (who it was shared with, accepted or not); null when there are none. deviceId is the device `id` or `nodeId` from devices.list. |
| `deviceInvites.resend` | `tailscale.api.deviceInvites.resend` | `destructive` | Email a device share invite again to the address it was created for. |
| `devices.authorize` | `tailscale.api.devices.authorize` | `write` | Approve (authorized: true) or revoke approval for (authorized: false) a device when the tailnet requires device approval. Revoking cuts the device's access until it is approved again. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.delete` | `tailscale.api.devices.delete` | `destructive` | Remove a device from the tailnet. It loses access at once and must be signed in again (with a new auth key or login) to rejoin. Cannot be undone. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.expireKey` | `tailscale.api.devices.expireKey` | `destructive` | Expire a device's node key now: the device is disconnected until someone signs in on it again. Use it to cut off a lost or compromised machine. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.get` | `tailscale.api.devices.get` | `read` | Get one device. fields: "all" adds routes, posture and connectivity details. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.list` | `tailscale.api.devices.list` | `read` | List the devices in the tailnet: name, hostname, Tailscale IPs, owner, OS, client version, tags, last seen, key expiry, authorized. Pass fields: "all" to add advertised and enabled routes, posture and connectivity details. filters narrows the list on the server by exact match on top-level device fields, all of them required to match (for example { tags: ["tag:prod"], isEphemeral: true }). |
| `devices.postureAttributes.batchUpdate` | `tailscale.api.devices.postureAttributes.batchUpdate` | `write` | Set or delete custom posture attributes on many devices in one call. A null value deletes that attribute. Applied all together or not at all. |
| `devices.postureAttributes.delete` | `tailscale.api.devices.postureAttributes.delete` | `write` | Delete a custom posture attribute (custom:...) from a device. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.postureAttributes.get` | `tailscale.api.devices.postureAttributes.get` | `read` | Get a device's posture attributes: Tailscale's own (node:os, node:tsVersion, node:tsReleaseTrack, ...) and custom ones (custom:<name>) set through the API or a posture integration. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.postureAttributes.set` | `tailscale.api.devices.postureAttributes.set` | `write` | Set a custom posture attribute on a device. attributeKey must start with custom: (for example custom:agentApproved); value is a string, number or boolean. expiry (RFC 3339) makes it lapse on its own. Policy postures can then allow or deny access on it. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.routes.list` | `tailscale.api.devices.routes.list` | `read` | List the subnet routes and exit-node routes a device advertises and which of them are enabled. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.routes.set` | `tailscale.api.devices.routes.set` | `write` | Set which of the routes a device advertises are enabled (subnet routes, and 0.0.0.0/0 plus ::/0 for an exit node). Replaces the enabled list: routes left out are turned off. Only routes the device advertises can be enabled. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.setIp` | `tailscale.api.devices.setIp` | `write` | Change a device's Tailscale IPv4 address to an unused one in the tailnet's range (100.64.0.0/10 by default). Existing connections to the old address break and must reconnect to the new one. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.setName` | `tailscale.api.devices.setName` | `write` | Rename a device: its MagicDNS name becomes <name>.<tailnet>.ts.net. Pass name: "" to go back to the machine's own hostname. Connections using the old name stop resolving. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.setTags` | `tailscale.api.devices.setTags` | `write` | Replace a device's ACL tags (tag:server, tag:mcp, ...). Each tag must be defined in the policy file and owned by the caller (tagOwners). Tagging a user's device turns it into a tagged device that no longer belongs to that user, and the access rules for its tags apply from then on. Pass tags: [] to remove every tag. deviceId is the device `id` or `nodeId` from devices.list. |
| `devices.updateKey` | `tailscale.api.devices.updateKey` | `write` | Turn key expiry off (keyExpiryDisabled: true) or back on for a device, for servers that should stay signed in. deviceId is the device `id` or `nodeId` from devices.list. |
| `dns.configuration.get` | `tailscale.api.dns.configuration.get` | `read` | Get the tailnet's whole DNS configuration in one object: nameservers, split DNS, search paths and preferences. |
| `dns.configuration.set` | `tailscale.api.dns.configuration.set` | `write` | Replace the tailnet's whole DNS configuration in one call (nameservers, split DNS, search paths, preferences). |
| `dns.nameservers.list` | `tailscale.api.dns.nameservers.list` | `read` | List the global DNS nameservers devices use. |
| `dns.nameservers.set` | `tailscale.api.dns.nameservers.set` | `write` | Replace the global DNS nameservers (IP addresses). An empty list removes them all and turns MagicDNS off. |
| `dns.preferences.get` | `tailscale.api.dns.preferences.get` | `read` | Get whether MagicDNS is on. |
| `dns.preferences.set` | `tailscale.api.dns.preferences.set` | `write` | Turn MagicDNS on or off. Turning it on needs at least one nameserver; turning it off breaks <name>.ts.net lookups. |
| `dns.searchPaths.list` | `tailscale.api.dns.searchPaths.list` | `read` | List the DNS search domains pushed to devices. |
| `dns.searchPaths.set` | `tailscale.api.dns.searchPaths.set` | `write` | Replace the DNS search domains pushed to devices. |
| `dns.splitDns.get` | `tailscale.api.dns.splitDns.get` | `read` | Get split DNS: which nameservers answer for which domains. |
| `dns.splitDns.set` | `tailscale.api.dns.splitDns.set` | `write` | Replace the whole split DNS map (domain to nameservers). Domains left out are removed. |
| `dns.splitDns.update` | `tailscale.api.dns.splitDns.update` | `write` | Change split DNS for the given domains only; a domain set to null is removed, others are kept. |
| `keys.create` | `tailscale.api.keys.create` | `destructive` | Create an auth key (keyType "auth", the default) that adds a device to the tailnet, or a trust credential (keyType "client" for an OAuth client, "federated" for a federated identity). For an agent or server, make the auth key preauthorized, tagged (capabilities.devices.create.tags) and ephemeral so the node is removed when it goes offline. The secret is returned once in `key`: hand it to the machine right away, never paste it into chat. |
| `keys.delete` | `tailscale.api.keys.delete` | `destructive` | Revoke a key. Devices already added with an auth key stay; anything using a revoked API token or OAuth client stops working. Cannot be undone. |
| `keys.get` | `tailscale.api.keys.get` | `read` | Get a key: type, description, scopes, tags, created, expires, revoked. Never returns the secret. |
| `keys.list` | `tailscale.api.keys.list` | `read` | List the keys of the caller (all: true for every key in the tailnet): auth keys, API access tokens, OAuth clients and federated identities, with expiry, scopes and tags. Never returns the secrets. |
| `keys.update` | `tailscale.api.keys.update` | `write` | Change an OAuth client's or federated identity's description, scopes or tags (auth keys and API tokens can't be edited). |
| `logging.awsExternalId.get` | `tailscale.api.logging.awsExternalId.get` | `write` | Get (or create on first use) the AWS external ID to put in an IAM role trust policy before streaming logs to S3. |
| `logging.awsExternalId.validate` | `tailscale.api.logging.awsExternalId.validate` | `read` | Check that an IAM role trusts Tailscale with this external ID, before log streaming to S3 is turned on. |
| `logging.configurationLogs.list` | `tailscale.api.logging.configurationLogs.list` | `read` | Read the configuration audit log between start and end (RFC 3339): who changed the policy file, approved or deleted a device, created a key, changed a setting, with old and new values. Filter by actor, target or event (TAILNET.UPDATE.ACL, NODE.CREATE, NODE.APPROVE, API_KEY.CREATE, USER.UPDATE.USER_ROLE, ...). Use it to answer "who changed what, and when". |
| `logging.networkLogs.list` | `tailscale.api.logging.networkLogs.list` | `read` | Read network flow logs between start and end (RFC 3339): which device talked to which, over what protocol and ports, and how many bytes. Network flow logging must be turned on (Premium and Enterprise plans). |
| `logging.streaming.disable` | `tailscale.api.logging.streaming.disable` | `destructive` | Stop streaming configuration or network logs; the destination settings are removed. |
| `logging.streaming.get` | `tailscale.api.logging.streaming.get` | `read` | Get where configuration or network logs are streamed (Splunk, Elastic, Panther, Cribl, CrowdStrike, Datadog, Axiom or S3). |
| `logging.streaming.getStatus` | `tailscale.api.logging.streaming.getStatus` | `read` | Get whether log streaming to a SIEM is working for configuration or network logs, and its last errors. |
| `logging.streaming.set` | `tailscale.api.logging.streaming.set` | `write` | Start or change streaming of configuration or network logs to a SIEM or bucket. Replaces the current destination. |
| `oauthApps.create` | `tailscale.api.oauthApps.create` | `destructive` | Register an OAuth app in the tailnet with its redirect URIs and scopes. The client secret is returned once. |
| `oauthApps.delete` | `tailscale.api.oauthApps.delete` | `destructive` | Delete an OAuth app; sign-ins and tokens issued through it stop working. |
| `oauthApps.get` | `tailscale.api.oauthApps.get` | `read` | Get an OAuth app: name, redirect URIs, scopes. Never returns the secret. |
| `oauthApps.list` | `tailscale.api.oauthApps.list` | `read` | List the OAuth apps registered in the tailnet (apps people in the tailnet sign in to so it can act on their behalf). |
| `oauthApps.update` | `tailscale.api.oauthApps.update` | `write` | Replace an OAuth app's name, redirect URIs or scopes. |
| `policyFile.get` | `tailscale.api.policyFile.get` | `read` | Get the tailnet's policy file (ACLs or grants, groups, tagOwners, autoApprovers, postures, tests). format "hujson" (the default) keeps comments and returns the text; "json" returns an object without comments. etag is the version: pass it as ifMatch to policyFile.set so another edit made in between is not overwritten. details: true also returns warnings and errors. |
| `policyFile.preview` | `tailscale.api.policyFile.preview` | `read` | Show which rules of the policy file you pass apply to a user (type "user", previewFor their email) or a destination (type "ipport", previewFor "100.101.102.103:443"), without saving anything. policy is required: pass a draft, or the text from policyFile.get to preview the current file. |
| `policyFile.set` | `tailscale.api.policyFile.set` | `destructive` | Replace the tailnet's policy file, as HuJSON text (keeps comments) or a JSON object. It controls who can reach what across the whole tailnet, so run policyFile.validate first, and pass ifMatch with the etag from policyFile.get: Tailscale then refuses the write if the file changed since. Tests in the file must pass or nothing is saved. |
| `policyFile.validate` | `tailscale.api.policyFile.validate` | `read` | Check a draft policy file without saving it: pass policy (HuJSON text or object) to parse it and run its tests, or tests (at least one) to run ACL tests against the current file. null or an empty message means everything passed. Problems still answer 200: message holds the parse error, or "test(s) failed" with each failing test in data. |
| `postureIntegrations.create` | `tailscale.api.postureIntegrations.create` | `write` | Connect a device posture provider, so its attributes (compliance, risk score) can gate access in the policy file. |
| `postureIntegrations.delete` | `tailscale.api.postureIntegrations.delete` | `destructive` | Disconnect a device posture provider; rules that rely on its attributes stop matching. |
| `postureIntegrations.get` | `tailscale.api.postureIntegrations.get` | `read` | Get a device posture integration and its sync status. |
| `postureIntegrations.list` | `tailscale.api.postureIntegrations.list` | `read` | List device posture integrations (CrowdStrike Falcon, Intune, Jamf Pro, Kandji, Kolide, SentinelOne, ...). |
| `postureIntegrations.update` | `tailscale.api.postureIntegrations.update` | `write` | Change a device posture integration (credentials, tenant, which devices it reads). |
| `services.delete` | `tailscale.api.services.delete` | `destructive` | Delete a Tailscale Service; its address stops answering on every host. |
| `services.get` | `tailscale.api.services.get` | `read` | Get a Tailscale Service: its addresses, ports, tags and comment. serviceName is svc:<name>. |
| `services.hosts.getApproval` | `tailscale.api.services.hosts.getApproval` | `read` | Get whether a device is approved to serve a Tailscale Service. |
| `services.hosts.list` | `tailscale.api.services.hosts.list` | `read` | List the devices that advertise a Tailscale Service and whether each is approved to serve it. |
| `services.hosts.setApproval` | `tailscale.api.services.hosts.setApproval` | `write` | Approve (approved: true) or stop (false) a device serving a Tailscale Service, when its tags are not auto-approved. |
| `services.list` | `tailscale.api.services.list` | `read` | List Tailscale Services: named virtual endpoints (svc:<name>) with their own Tailscale IPs and MagicDNS name, served by one or more hosts. Use them to give an internal app or MCP server a stable address on the tailnet. |
| `services.update` | `tailscale.api.services.update` | `write` | Create or replace a Tailscale Service (serviceName svc:<name>; name defaults to it): ports ("tcp:443", "do-not-validate") and tags. Hosts then advertise it with `tailscale serve --service=svc:<name>`, and the policy file grants who may reach it. |
| `tailnets.create` | `tailscale.api.tailnets.create` | `destructive` | Create an API-only tailnet in the organization (no human users, not in the admin console), for an app or agent fleet that manages its own network. At most 10 tailnets per organization. The new OAuth client secret is returned once. |
| `tailnets.delete` | `tailscale.api.tailnets.delete` | `destructive` | Delete a whole tailnet with all of its users, devices and settings. Only API-only tailnets can be deleted this way. Cannot be undone. |
| `tailnets.list` | `tailscale.api.tailnets.list` | `read` | List the tailnets in the organization: the original one and any API-only tailnets made with tailnets.create. Pages with cursor. |
| `tailnetSettings.get` | `tailscale.api.tailnetSettings.get` | `read` | Get tailnet settings: device and user approval, device auto-updates, key expiry days, who may join, posture identity collection, network flow logging, regional routing, HTTPS. |
| `tailnetSettings.update` | `tailscale.api.tailnetSettings.update` | `write` | Change tailnet settings; only the fields sent change. Turning on device approval holds every new device until someone approves it. Tailscale answers without the new values: read them with tailnetSettings.get. |
| `userInvites.create` | `tailscale.api.userInvites.create` | `destructive` | Invite people to join the tailnet with a role (member, admin, ...). Each invite gives an invite URL; with email set, Tailscale emails it. Needs a user's API access token (an invite needs an inviting user), not an OAuth client. |
| `userInvites.delete` | `tailscale.api.userInvites.delete` | `write` | Delete an invite to join the tailnet; its link stops working. Needs a user's API access token. |
| `userInvites.get` | `tailscale.api.userInvites.get` | `read` | Get an invite to join the tailnet: role, invite URL, email and whether it was accepted. |
| `userInvites.list` | `tailscale.api.userInvites.list` | `read` | List pending invites for people to join the tailnet; null when there are none. Invites need a user's API access token, not an OAuth client. |
| `userInvites.resend` | `tailscale.api.userInvites.resend` | `destructive` | Email an invite to join the tailnet again. |
| `users.approve` | `tailscale.api.users.approve` | `write` | Approve a user waiting for approval (when the tailnet requires user approval). |
| `users.delete` | `tailscale.api.users.delete` | `destructive` | Delete a user from the tailnet, with their devices. Cannot be undone; users.suspend keeps them restorable. A user's own token can't delete that user. |
| `users.get` | `tailscale.api.users.get` | `read` | Get one user: role, status, login name, device count, last seen. |
| `users.list` | `tailscale.api.users.list` | `read` | List users: role, status (active, idle, suspended, needs-approval), device count, last seen. type and role filter the list. |
| `users.restore` | `tailscale.api.users.restore` | `write` | Restore a suspended user and their access. |
| `users.suspend` | `tailscale.api.users.suspend` | `write` | Suspend a user: they lose access to the tailnet until restored; their devices and settings are kept. A user's own token can't suspend that user. |
| `users.updateRole` | `tailscale.api.users.updateRole` | `write` | Change a user's role (member, admin, it-admin, network-admin, billing-admin, auditor, owner). |
| `webhooks.create` | `tailscale.api.webhooks.create` | `write` | Add a webhook endpoint for tailnet events (nodeCreated, nodeNeedsApproval, nodeKeyExpiringInOneDay, nodeDeleted, policyUpdate, userNeedsApproval, userRoleUpdated, ...), or a whole category (categoryTailnetManagement, categoryDeviceMisconfigurations) that also takes events Tailscale adds later. Tailscale signs each event with the secret (Tailscale-Webhook-Signature). providerType "slack", "discord", "mattermost" or "googlechat" formats the message for that chat app; "" or none sends the generic format. The signing secret is returned once: keep it to verify events. |
| `webhooks.delete` | `tailscale.api.webhooks.delete` | `destructive` | Delete a webhook endpoint; Tailscale stops sending it events. |
| `webhooks.get` | `tailscale.api.webhooks.get` | `read` | Get a webhook endpoint: URL, provider type and subscribed events. |
| `webhooks.list` | `tailscale.api.webhooks.list` | `read` | List the webhook endpoints that receive tailnet events (device added, needs approval, policy changed, user joined, ...). |
| `webhooks.rotateSecret` | `tailscale.api.webhooks.rotateSecret` | `destructive` | Replace a webhook endpoint's signing secret. The new one is returned once; signatures made with the old one stop verifying. |
| `webhooks.test` | `tailscale.api.webhooks.test` | `destructive` | Send a test event to a webhook endpoint (a chat channel, for a Slack or Discord one) to check it receives and accepts deliveries. |
| `webhooks.update` | `tailscale.api.webhooks.update` | `write` | Change which events a webhook endpoint receives. |

## Auth

Auth: API key (an API access token or an OAuth client secret). Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tailscale

## License

Apache-2.0
