# @corsair-dev/fly

Fly.io plugin for Corsair, built on Fly's public [Machines REST API](https://docs.fly.io/machines/api/)
(`https://api.machines.dev/v1`). It covers apps, Machines, volumes and snapshots, app secrets,
custom-domain certificates, IP addresses, the current token and the region list: 54 operations.

Authenticate with a Fly API token (`fly tokens create org`, or an organization token from the dashboard).
Tokens that start with `FlyV1 ` are sent as they are; any other token is sent as `Bearer <token>`.

Not covered: Managed Postgres, app secret keys (KMS), Machine memory limits, custom-certificate upload,
deploy-token minting and placements. Fly's GraphQL API is not used: Fly documents it as an internal
interface with no stability guarantees.

## Install

```bash
pnpm add @corsair-dev/fly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apps.create` | `fly.api.apps.create` | `write` | Create an app in an organization. The app costs nothing until it has Machines or volumes. |
| `apps.delete` | `fly.api.apps.delete` | `destructive` | Permanently delete an app with its Machines, volumes, secrets, certificates and IP addresses |
| `apps.get` | `fly.api.apps.get` | `read` | Get an app by name |
| `apps.list` | `fly.api.apps.list` | `read` | List the apps in an organization. Pass limit to page through results with next_cursor. |
| `certificates.check` | `fly.api.certificates.check` | `write` | Look up a hostname's DNS now and re-validate its certificate |
| `certificates.delete` | `fly.api.certificates.delete` | `destructive` | Remove a hostname and all its certificates from an app |
| `certificates.get` | `fly.api.certificates.get` | `read` | Get a certificate with the DNS records to create and its validation state |
| `certificates.list` | `fly.api.certificates.list` | `read` | List an app's custom-domain certificates |
| `certificates.request` | `fly.api.certificates.request` | `destructive` | Add a hostname to an app and request Fly-issued (ACME) certificates for it. Fly bills certificates beyond the free allowance. |
| `ipAssignments.create` | `fly.api.ipAssignments.create` | `destructive` | Assign an IP address to an app. Dedicated IPv4 and egress addresses are billed monthly; shared_v4, v6 and private_v6 are free. |
| `ipAssignments.delete` | `fly.api.ipAssignments.delete` | `destructive` | Release an IP address from an app. A released address cannot be got back. |
| `ipAssignments.list` | `fly.api.ipAssignments.list` | `read` | List an app's IP addresses, including its shared IPv4 and egress addresses |
| `machines.cordon` | `fly.api.machines.cordon` | `write` | Cordon a Machine so Fly Proxy stops routing requests to it |
| `machines.create` | `fly.api.machines.create` | `destructive` | Create (and by default start) a Machine. Fly bills it while it runs and for its root filesystem. |
| `machines.createLease` | `fly.api.machines.createLease` | `write` | Take (or, with lease_nonce, refresh) an exclusive lease on a Machine |
| `machines.delete` | `fly.api.machines.delete` | `destructive` | Permanently destroy a Machine. It must be stopped unless force is true. |
| `machines.deleteMetadataKey` | `fly.api.machines.deleteMetadataKey` | `destructive` | Delete one metadata key from a Machine |
| `machines.exec` | `fly.api.machines.exec` | `destructive` | Run a command inside a running Machine and return its stdout, stderr and exit code |
| `machines.get` | `fly.api.machines.get` | `read` | Get a Machine |
| `machines.getLease` | `fly.api.machines.getLease` | `read` | Get the lease currently held on a Machine |
| `machines.getMetadata` | `fly.api.machines.getMetadata` | `read` | Get a Machine's metadata key/value pairs |
| `machines.getMetadataKey` | `fly.api.machines.getMetadataKey` | `read` | Get one metadata value of a Machine |
| `machines.list` | `fly.api.machines.list` | `read` | List an app's Machines (all of them; use listForOrg to page through an organization) |
| `machines.listEvents` | `fly.api.machines.listEvents` | `read` | List a Machine's recent events, newest first |
| `machines.listForOrg` | `fly.api.machines.listForOrg` | `read` | List the Machines of every app in an organization, page by page with next_cursor. Pass region: on 2026-11-16 Fly answered 400 "misfired replay" without it whenever the org had a Machine. |
| `machines.listProcesses` | `fly.api.machines.listProcesses` | `read` | List the processes running on a started Machine |
| `machines.listVersions` | `fly.api.machines.listVersions` | `read` | List a Machine's configuration versions |
| `machines.releaseLease` | `fly.api.machines.releaseLease` | `write` | Release a lease you hold on a Machine |
| `machines.restart` | `fly.api.machines.restart` | `write` | Restart a Machine |
| `machines.setMetadataKey` | `fly.api.machines.setMetadataKey` | `write` | Set one metadata key on a Machine |
| `machines.signal` | `fly.api.machines.signal` | `write` | Send a Unix signal to a Machine's main process |
| `machines.start` | `fly.api.machines.start` | `write` | Start a stopped or suspended Machine |
| `machines.stop` | `fly.api.machines.stop` | `write` | Stop a Machine, optionally with a signal and timeout |
| `machines.suspend` | `fly.api.machines.suspend` | `write` | Suspend a Machine so the next start can resume it from a memory snapshot |
| `machines.uncordon` | `fly.api.machines.uncordon` | `write` | Uncordon a Machine so Fly Proxy routes requests to it again |
| `machines.update` | `fly.api.machines.update` | `destructive` | Replace a Machine's whole configuration (image, size, services…). A larger size bills more. |
| `machines.updateMetadata` | `fly.api.machines.updateMetadata` | `write` | Set several metadata keys at once; an empty string removes a key. Keys not listed stay as they are. |
| `machines.wait` | `fly.api.machines.wait` | `read` | Wait (up to 60 seconds) for a Machine to reach a state, such as started or stopped |
| `platform.regions` | `fly.api.platform.regions` | `read` | List Fly regions with their location, capacity and whether they need a paid plan |
| `secrets.delete` | `fly.api.secrets.delete` | `destructive` | Delete one secret. Running Machines keep the old values until they are updated with min_secrets_version set to the returned version. |
| `secrets.get` | `fly.api.secrets.get` | `read` | Get one secret's name and digest (not its value) |
| `secrets.list` | `fly.api.secrets.list` | `read` | List an app's secrets: names and digests, never values |
| `secrets.set` | `fly.api.secrets.set` | `destructive` | Create or overwrite one secret. An overwritten value cannot be recovered. Running Machines keep the old values until they are updated with min_secrets_version set to the returned version. |
| `secrets.update` | `fly.api.secrets.update` | `destructive` | Set and delete several secrets at once: a string sets one, null deletes it. Running Machines keep the old values until they are updated with min_secrets_version set to the returned version. |
| `tokens.current` | `fly.api.tokens.current` | `read` | Show which organization, apps and Machine the stored token is scoped to |
| `volumes.create` | `fly.api.volumes.create` | `destructive` | Create a volume, empty or restored from a snapshot or another volume. Fly bills it by size. |
| `volumes.createSnapshot` | `fly.api.volumes.createSnapshot` | `destructive` | Take a snapshot of a volume now. Fly bills snapshot storage beyond the free allowance. |
| `volumes.delete` | `fly.api.volumes.delete` | `destructive` | Permanently destroy a volume and its data |
| `volumes.extend` | `fly.api.volumes.extend` | `destructive` | Grow a volume to a larger size. Volumes cannot shrink, and Fly bills the new size. |
| `volumes.get` | `fly.api.volumes.get` | `read` | Get a volume |
| `volumes.list` | `fly.api.volumes.list` | `read` | List an app's volumes (all of them; use listForOrg to page through an organization) |
| `volumes.listForOrg` | `fly.api.volumes.listForOrg` | `read` | List the volumes of every app in an organization, page by page with next_cursor |
| `volumes.listSnapshots` | `fly.api.volumes.listSnapshots` | `read` | List a volume's snapshots |
| `volumes.update` | `fly.api.volumes.update` | `write` | Change a volume's snapshot settings |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/fly

## License

Apache-2.0
