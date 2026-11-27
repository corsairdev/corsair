# @corsair-dev/instabox

InstaBox cloud Linux machines for agents: machines (create, start, stop, suspend, fork, exec, files, ports, SSH, desktop), snapshots, exports, secrets, Vault, workspaces, members, billing, usage and signed webhooks (129 operations).

## Install

```bash
pnpm add @corsair-dev/instabox
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `exports.download` | `instabox.api.exports.download` | `read` | Download a ready export as a .tar.gz (returned as a file) |
| `exports.get` | `instabox.api.exports.get` | `read` | Get an export |
| `feedback.send` | `instabox.api.feedback.send` | `destructive` | File an `instabox feedback` report, which opens the account's support ticket |
| `gpuQueue.cancel` | `instabox.api.gpuQueue.cancel` | `destructive` | Cancel a live GPU queue entry |
| `gpuQueue.list` | `instabox.api.gpuQueue.list` | `read` | List an org's GPU queue entries |
| `keys.create` | `instabox.api.keys.create` | `destructive` | Create an API key. Signed-in sessions only; an API key gets 403 permission_denied |
| `keys.list` | `instabox.api.keys.list` | `read` | List your personal org's API keys (expired ones included, revoked ones not), as `GET /v1/orgs/{id}/keys` for it. Signed-in sessions only |
| `keys.revoke` | `instabox.api.keys.revoke` | `destructive` | Revoke one of your personal org's API keys. Signed-in sessions only |
| `machines.activityLeases.release` | `instabox.api.machines.activityLeases.release` | `destructive` | Release a task's activity lease |
| `machines.activityLeases.renew` | `instabox.api.machines.activityLeases.renew` | `destructive` | Keep a task's machine awake for a bounded period |
| `machines.claimOomKill` | `instabox.api.machines.claimOomKill` | `write` | The OOM kill of a background job's processes (instabox jobs wait) |
| `machines.connectionInfo` | `instabox.api.machines.connectionInfo` | `read` | How to reach the sandbox over SSH. No side effects |
| `machines.create` | `instabox.api.machines.create` | `destructive` | Create a sandbox |
| `machines.createAccess` | `instabox.api.machines.createAccess` | `destructive` | Get a Terminal or VNC connection URL and short-lived admission ticket |
| `machines.createSnapshot` | `instabox.api.machines.createSnapshot` | `write` | Save a sandbox's system files and storage as a snapshot |
| `machines.delete` | `instabox.api.machines.delete` | `destructive` | Delete a sandbox, its system files and its storage |
| `machines.desktop.createLink` | `instabox.api.machines.desktop.createLink` | `destructive` | A short-lived link to watch (or use) the machine's desktop in a browser |
| `machines.desktop.get` | `instabox.api.machines.desktop.get` | `read` | The state of a running machine's desktop; install or start it |
| `machines.desktop.revokeLinks` | `instabox.api.machines.desktop.revokeLinks` | `destructive` | Revoke every desktop link of the machine and end their open sessions |
| `machines.disk` | `instabox.api.machines.disk` | `read` | How full the running sandbox's disks are (/data and /), with a near-full warning |
| `machines.exec` | `instabox.api.machines.exec` | `destructive` | Run a command in a running machine (cmd through bash -lc, or argv with no shell) and get exitCode, stdout and stderr |
| `machines.files.createUploadUrl` | `instabox.api.machines.files.createUploadUrl` | `write` | Get a short-lived signed URL that uploads one file |
| `machines.files.download` | `instabox.api.machines.files.download` | `read` | Download a file's raw bytes from a running machine (returned as a file) |
| `machines.files.read` | `instabox.api.machines.files.read` | `read` | Read a file or directory of a running sandbox |
| `machines.files.write` | `instabox.api.machines.files.write` | `write` | Write (upload) a file to a running sandbox |
| `machines.fork` | `instabox.api.machines.fork` | `destructive` | Create a copy of a sandbox on its host, without a snapshot |
| `machines.get` | `instabox.api.machines.get` | `read` | Get a sandbox |
| `machines.history.get` | `instabox.api.machines.history.get` | `read` | One past command with its stored output |
| `machines.history.list` | `instabox.api.machines.history.list` | `read` | The commands run in the sandbox through exec, newest first |
| `machines.list` | `instabox.api.machines.list` | `read` | List the sandboxes of your orgs |
| `machines.logs` | `instabox.api.machines.logs` | `read` | The sandbox's console log and recent operations, to see why it did not boot or is unreachable |
| `machines.metrics` | `instabox.api.machines.metrics` | `read` | The sandbox's recent CPU, memory, network and disk I/O, one sample per 30 seconds |
| `machines.ports.create` | `instabox.api.machines.ports.create` | `write` | Give one HTTP port of a sandbox an HTTPS URL, public or private |
| `machines.ports.delete` | `instabox.api.machines.ports.delete` | `destructive` | Remove a port's public URL and close its active connections |
| `machines.ports.installAgent` | `instabox.api.machines.ports.installAgent` | `write` | Install instabox-port in a running sandbox and rotate its credential |
| `machines.ports.list` | `instabox.api.machines.ports.list` | `read` | List a sandbox's public ports |
| `machines.processes` | `instabox.api.machines.processes` | `read` | The sandbox's processes, live or as last seen |
| `machines.restore` | `instabox.api.machines.restore` | `destructive` | Put a sandbox's disks back to a snapshot's, in place |
| `machines.resume` | `instabox.api.machines.resume` | `destructive` | Resume a paused sandbox where it left off |
| `machines.secrets.get` | `instabox.api.machines.secrets.get` | `read` | Read a sandbox's Secret selections and delivery status |
| `machines.secrets.refresh` | `instabox.api.machines.secrets.refresh` | `write` | Refresh managed Secret delivery in a running sandbox |
| `machines.secrets.update` | `instabox.api.machines.secrets.update` | `write` | Replace supplied Secret selections for a sandbox |
| `machines.ssh.createToken` | `instabox.api.machines.ssh.createToken` | `destructive` | Issue an SSH token, for a plain `ssh` command without a key |
| `machines.ssh.issueCertificate` | `instabox.api.machines.ssh.issueCertificate` | `destructive` | Issue a short-lived SSH user certificate for the sandbox |
| `machines.ssh.listTokens` | `instabox.api.machines.ssh.listTokens` | `read` | List SSH token metadata, including revoked and recently expired tokens |
| `machines.ssh.revokeAllTokens` | `instabox.api.machines.ssh.revokeAllTokens` | `destructive` | Revoke every SSH token of the sandbox and close their connections |
| `machines.ssh.revokeToken` | `instabox.api.machines.ssh.revokeToken` | `destructive` | Revoke one SSH token and close its SSH and mosh connections |
| `machines.start` | `instabox.api.machines.start` | `destructive` | Start a stopped or paused sandbox |
| `machines.stop` | `instabox.api.machines.stop` | `destructive` | Stop a running sandbox (shuts it down; running programs end, files are kept) |
| `machines.suspend` | `instabox.api.machines.suspend` | `destructive` | Pause a running sandbox, keeping its running programs |
| `machines.update` | `instabox.api.machines.update` | `write` | Rename, resize (vCPUs, memory, disk) a stopped sandbox, or set its idle pause and metadata |
| `machines.usage` | `instabox.api.machines.usage` | `read` | What the sandbox used over a window, for billing |
| `machines.vault.get` | `instabox.api.machines.vault.get` | `read` | What the Vault writes into this machine (docs/vault.md) |
| `machines.vault.write` | `instabox.api.machines.vault.write` | `write` | Write the current Vault items into the running machine now |
| `machines.wake` | `instabox.api.machines.wake` | `destructive` | Resume an idle-suspended machine before using it |
| `me.discord.get` | `instabox.api.me.discord.get` | `read` | The Discord account linked to the signed-in account |
| `me.discord.unlink` | `instabox.api.me.discord.unlink` | `destructive` | Unlink the signed-in account's Discord account |
| `me.get` | `instabox.api.me.get` | `read` | The signed-in user and the sandbox size they get |
| `operations.get` | `instabox.api.operations.get` | `read` | Get an operation (the progress of a sandbox change) |
| `orgs.billing.cancelSubscription` | `instabox.api.orgs.billing.cancelSubscription` | `destructive` | End the org's subscription at the end of the current period. The owner; signed-in sessions only |
| `orgs.billing.changePlan` | `instabox.api.orgs.billing.changePlan` | `destructive` | Move a subscribed org between the paid plans. The owner; signed-in sessions only |
| `orgs.billing.checkout` | `instabox.api.orgs.billing.checkout` | `destructive` | Put an org on a paid plan, its credits first and a card for the rest. The owner; signed-in sessions only |
| `orgs.billing.getTopup` | `instabox.api.orgs.billing.getTopup` | `read` | What a top-up of the org allows, and the card on file it charges. The owner and admins; signed-in sessions only |
| `orgs.billing.movePersonal` | `instabox.api.orgs.billing.movePersonal` | `destructive` | Move your personal plan, sandboxes and credits into a workspace you own (needs a signed-in user token; an API key gets 403) |
| `orgs.billing.portal` | `instabox.api.orgs.billing.portal` | `destructive` | Open the Stripe customer portal (invoices, the card). The owner and admins; signed-in sessions only |
| `orgs.billing.resumeSubscription` | `instabox.api.orgs.billing.resumeSubscription` | `destructive` | Take back a cancellation before the period ends. The owner; signed-in sessions only |
| `orgs.billing.subscribeWithCredits` | `instabox.api.orgs.billing.subscribeWithCredits` | `destructive` | Put an org on a paid plan paid from its credits. The owner; signed-in sessions only |
| `orgs.billing.topup` | `instabox.api.orgs.billing.topup` | `destructive` | Buy credits for an org on Pro, Builder or Team. The owner and admins; signed-in sessions only |
| `orgs.billing.update` | `instabox.api.orgs.billing.update` | `destructive` | Set a paid org's spend cap, usage alerts or extra starts. The owner and admins; signed-in sessions only |
| `orgs.create` | `instabox.api.orgs.create` | `destructive` | Buy a workspace through Stripe Checkout. Signed-in sessions only |
| `orgs.delete` | `instabox.api.orgs.delete` | `destructive` | Delete a workspace. The owner, naming it; signed-in sessions only |
| `orgs.exports.create` | `instabox.api.orgs.exports.create` | `write` | Export a sandbox's or a snapshot's /data |
| `orgs.exports.list` | `instabox.api.orgs.exports.list` | `read` | List what you can export from a workspace |
| `orgs.get` | `instabox.api.orgs.get` | `read` | An org you belong to, with its limits and this month's usage |
| `orgs.github.installations.delete` | `instabox.api.orgs.github.installations.delete` | `destructive` | Unlink an install of the GitHub App from an org; its jobs then start no boxes. The App stays installed on GitHub, so Connect GitHub can link it again, here or in another workspace. The owner and admins; signed-in sessions only |
| `orgs.github.installations.list` | `instabox.api.orgs.github.installations.list` | `read` | The instabox GitHub App installs linked to an org. The owner and admins; signed-in sessions only |
| `orgs.github.jobs.get` | `instabox.api.orgs.github.jobs.get` | `read` | One of the org's GitHub Actions jobs, with where its wait went and its branch, commit and failed step |
| `orgs.github.jobs.list` | `instabox.api.orgs.github.jobs.list` | `read` | The org's GitHub Actions jobs run in CI boxes, with why a job waits or did not start |
| `orgs.github.stats` | `instabox.api.orgs.github.stats` | `read` | The org's GitHub Actions jobs of the last 7 days, today included, or of a time range, for the CI page |
| `orgs.inviteCode.get` | `instabox.api.orgs.inviteCode.get` | `read` | A paid org's invite code for people outside it. The owner and admins |
| `orgs.inviteCode.regenerate` | `instabox.api.orgs.inviteCode.regenerate` | `destructive` | Replace a paid workspace's invite code. The owner and admins |
| `orgs.invites.create` | `instabox.api.orgs.invites.create` | `destructive` | Email an invite to join the org. The owner and admins |
| `orgs.invites.list` | `instabox.api.orgs.invites.list` | `read` | An org's invites, newest first. The owner and admins |
| `orgs.invites.resend` | `instabox.api.orgs.invites.resend` | `destructive` | Email an open invite again. The owner and admins |
| `orgs.invites.revoke` | `instabox.api.orgs.invites.revoke` | `destructive` | Revoke an unredeemed invite. The owner and admins |
| `orgs.keys.create` | `instabox.api.orgs.keys.create` | `destructive` | Create an API key of an org. The owner and admins (a personal org's owner); signed-in sessions only |
| `orgs.keys.list` | `instabox.api.orgs.keys.list` | `read` | An org's API keys (expired ones included, revoked ones not). The owner and admins (a personal org's owner); signed-in sessions only |
| `orgs.keys.revoke` | `instabox.api.orgs.keys.revoke` | `destructive` | Revoke an org's API key. The owner and admins (a personal org's owner); signed-in sessions only |
| `orgs.list` | `instabox.api.orgs.list` | `read` | The orgs you belong to, your personal org first |
| `orgs.members.changeRole` | `instabox.api.orgs.members.changeRole` | `write` | Change a member's role. The owner and admins |
| `orgs.members.list` | `instabox.api.orgs.members.list` | `read` | The members of an org you belong to, the owner first |
| `orgs.members.remove` | `instabox.api.orgs.members.remove` | `destructive` | Remove a member, or leave (your own user ID) |
| `orgs.movePersonal` | `instabox.api.orgs.movePersonal` | `destructive` | Move your personal plan, sandboxes and credits into a new workspace (needs a signed-in user token; an API key gets 403) |
| `orgs.redeemInvite` | `instabox.api.orgs.redeemInvite` | `destructive` | Join an org with an invite code. Signed-in sessions only |
| `orgs.secrets.delete` | `instabox.api.orgs.secrets.delete` | `destructive` | Delete an org Secret and its explicit sandbox grants |
| `orgs.secrets.import` | `instabox.api.orgs.secrets.import` | `write` | Atomically create or replace a batch of org Secrets |
| `orgs.secrets.list` | `instabox.api.orgs.secrets.list` | `read` | List an org's Secret metadata, never values |
| `orgs.secrets.set` | `instabox.api.orgs.secrets.set` | `write` | Create or replace an org Secret |
| `orgs.update` | `instabox.api.orgs.update` | `write` | Rename an org. The owner and admins |
| `orgs.webhooks.create` | `instabox.api.orgs.webhooks.create` | `write` | Register a webhook endpoint |
| `orgs.webhooks.delete` | `instabox.api.orgs.webhooks.delete` | `destructive` | Delete a webhook endpoint with its pending deliveries and delivery log |
| `orgs.webhooks.deliveries.list` | `instabox.api.orgs.webhooks.deliveries.list` | `read` | List an endpoint's deliveries, newest first, with their attempts |
| `orgs.webhooks.deliveries.retry` | `instabox.api.orgs.webhooks.deliveries.retry` | `destructive` | Send a finished (succeeded or failed) delivery once more |
| `orgs.webhooks.get` | `instabox.api.orgs.webhooks.get` | `read` | Get a webhook endpoint |
| `orgs.webhooks.list` | `instabox.api.orgs.webhooks.list` | `read` | List an org's webhook endpoints |
| `orgs.webhooks.rotate` | `instabox.api.orgs.webhooks.rotate` | `destructive` | Give an endpoint a new signing secret |
| `orgs.webhooks.test` | `instabox.api.orgs.webhooks.test` | `destructive` | Queue a `webhook.test` event to an enabled endpoint |
| `orgs.webhooks.update` | `instabox.api.orgs.webhooks.update` | `write` | Change a webhook endpoint |
| `ports.list` | `instabox.api.ports.list` | `read` | List the public ports of all your sandboxes |
| `sessions.list` | `instabox.api.sessions.list` | `read` | List your active sign-ins (CLI and browser sessions) |
| `sessions.signOut` | `instabox.api.sessions.signOut` | `destructive` | Sign out one of your sessions (revokes all its tokens) (needs a signed-in user token; an API key gets 403) |
| `snapshots.delete` | `instabox.api.snapshots.delete` | `destructive` | Delete a snapshot |
| `snapshots.files.list` | `instabox.api.snapshots.files.list` | `read` | Read a file or directory of a snapshot's system files |
| `snapshots.get` | `instabox.api.snapshots.get` | `read` | Get a snapshot of one of your orgs |
| `snapshots.list` | `instabox.api.snapshots.list` | `read` | List the snapshots of your orgs |
| `stats.get` | `instabox.api.stats.get` | `read` | Public figures, such as how many sandboxes are running right now |
| `support.tickets.close` | `instabox.api.support.tickets.close` | `destructive` | Close one of the account's tickets (needs a signed-in user token; an API key gets 403) |
| `support.tickets.get` | `instabox.api.support.tickets.get` | `read` | One of the account's tickets and its messages (needs a signed-in user token; an API key gets 403) |
| `support.tickets.list` | `instabox.api.support.tickets.list` | `read` | The signed-in account's support tickets, newest activity first |
| `support.tickets.reply` | `instabox.api.support.tickets.reply` | `destructive` | Answer one of the account's open tickets (needs a signed-in user token; an API key gets 403) |
| `templates.list` | `instabox.api.templates.list` | `read` | List the templates a sandbox can start from |
| `usage.get` | `instabox.api.usage.get` | `read` | Your storage use, limits, this month's cost and credit balance |
| `usage.machines` | `instabox.api.usage.machines` | `read` | Compute, disk and egress use and list price by sandbox over a window, deleted sandboxes included |
| `vault.delete` | `instabox.api.vault.delete` | `destructive` | Delete a Vault item. Sign-in sessions only |
| `vault.export` | `instabox.api.vault.export` | `write` | Recover one retained legacy item as a private JSON download (needs a signed-in user token; an API key gets 403) |
| `vault.import` | `instabox.api.vault.import` | `write` | Atomically import environment variables into the per-user Vault (needs a signed-in user token; an API key gets 403) |
| `vault.list` | `instabox.api.vault.list` | `read` | The caller's Vault items, by name. Sign-in sessions only |
| `vault.set` | `instabox.api.vault.set` | `write` | Create or replace a Vault item. Sign-in sessions only |
| `vault.update` | `instabox.api.vault.update` | `write` | Change a Vault item's selector without resending its value. Sign-in sessions only |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 12 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/instabox

## License

Apache-2.0
