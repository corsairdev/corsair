# @corsair-dev/vpndetection

VPNDetection plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/vpndetection
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.identity` | `vpndetection.api.account.identity` | `read` | Read the identity behind the credential: user, organization and current scopes (needs an OAuth token with account.read). |
| `apiKeys.create` | `vpndetection.api.apiKeys.create` | `write` | Create an API key and return its secret once (needs an OAuth token with apikeys.manage). |
| `apiKeys.list` | `vpndetection.api.apiKeys.list` | `read` | List the organization's API keys without their secrets (needs an OAuth token with apikeys.read). |
| `apiKeys.reveal` | `vpndetection.api.apiKeys.reveal` | `destructive` | Read back an existing API key's secret (needs an OAuth token with apikeys.reveal). |
| `apiKeys.revoke` | `vpndetection.api.apiKeys.revoke` | `destructive` | Revoke an API key so it stops working; it stays listed with revoked_at (needs apikeys.manage). |
| `apiKeys.rotate` | `vpndetection.api.apiKeys.rotate` | `destructive` | Replace the secret behind an API key; the old secret stops working at once (needs apikeys.manage and apikeys.reveal). |
| `databases.checksum` | `vpndetection.api.databases.checksum` | `read` | Read the MD5, SHA-1, SHA-256 and SHA-512 checksums of one published database file. |
| `databases.download` | `vpndetection.api.databases.download` | `read` | Get a time-limited download link for one database version and format, or one build by name; the file itself is not fetched. |
| `databases.downloads` | `vpndetection.api.databases.downloads` | `read` | List the organization's recent database download attempts, newest first, refusals included. |
| `databases.list` | `vpndetection.api.databases.list` | `read` | List every database the organization can see with its license standing, versions and formats (needs a key with db.download). |
| `databases.metadata` | `vpndetection.api.databases.metadata` | `read` | Read a database version's last update, entry count and column schema without downloading it. |
| `entitlement.get` | `vpndetection.api.entitlement.get` | `read` | Read the plan behind the key and the requests used against its quota in the current window. |
| `ip.batch` | `vpndetection.api.ip.batch` | `read` | Classify up to 1000 IP addresses in one call (a paid plan; a free key answers a batch of one); per-address failures come back in errors. |
| `ip.lookup` | `vpndetection.api.ip.lookup` | `read` | Check whether an IP address is a VPN, a Tor node or a privacy relay, with its country and ASN; omit ip for the caller's own address. |
| `organization.get` | `vpndetection.api.organization.get` | `read` | Read the credential's organization (needs an OAuth token with org.read). |
| `organization.listMembers` | `vpndetection.api.organization.listMembers` | `read` | List the organization's members (needs an OAuth token with org.read). |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/vpndetection

## License

Apache-2.0
