# @corsair-dev/toneden

ToneDen plugin for Corsair: manage smart links, contests and social unlocks, ad campaigns and playbook campaigns, and read their performance data.

## Install

```bash
pnpm add @corsair-dev/toneden
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attachments.create` | `toneden.api.attachments.create` | `write` | Create a contest or a social unlock |
| `attachments.delete` | `toneden.api.attachments.delete` | `destructive` | Delete a contest or unlock; there is no restore route |
| `attachments.entries` | `toneden.api.attachments.entries` | `read` | Read a contest entry time series, by platform |
| `attachments.entriesTotals` | `toneden.api.attachments.entriesTotals` | `read` | Read entry counts over the past day, week, month and lifetime |
| `attachments.get` | `toneden.api.attachments.get` | `read` | Read one contest or unlock with its actions |
| `attachments.listForUser` | `toneden.api.attachments.listForUser` | `read` | List one user's contests and social unlocks |
| `attachments.unlockPlatforms` | `toneden.api.attachments.unlockPlatforms` | `read` | Read unlock counts by platform |
| `attachments.unlocks` | `toneden.api.attachments.unlocks` | `read` | Read a social unlock time series |
| `attachments.unlocksTotals` | `toneden.api.attachments.unlocksTotals` | `read` | Read unlock counts over the past day, week, month and lifetime |
| `attachments.update` | `toneden.api.attachments.update` | `write` | Change the fields of one contest or unlock |
| `campaigns.create` | `toneden.api.campaigns.create` | `destructive` | Create an ad campaign on Facebook or Google; creating one can start spend, so review the body before calling |
| `campaigns.creativeInsights` | `toneden.api.campaigns.creativeInsights` | `read` | Read performance data for each ad within a campaign |
| `campaigns.delete` | `toneden.api.campaigns.delete` | `destructive` | Delete an ad campaign; there is no restore route |
| `campaigns.get` | `toneden.api.campaigns.get` | `read` | Read one ad campaign |
| `campaigns.insights` | `toneden.api.campaigns.insights` | `read` | Read one campaign performance data |
| `campaigns.list` | `toneden.api.campaigns.list` | `read` | List one user's ad campaigns |
| `campaigns.update` | `toneden.api.campaigns.update` | `destructive` | Change an ad campaign; only the given fields are sent |
| `links.create` | `toneden.api.links.create` | `write` | Create a link with its target, artwork, services and social settings |
| `links.delete` | `toneden.api.links.delete` | `destructive` | Delete a link; there is no restore route |
| `links.expand` | `toneden.api.links.expand` | `read` | Expand a music or podcast URL into the tracking pixels, affiliate codes and services a link would carry |
| `links.get` | `toneden.api.links.get` | `read` | Read one link with its services, pixels and social settings |
| `links.insights` | `toneden.api.links.insights` | `read` | Read one link's performance over a date window |
| `links.insightsOverview` | `toneden.api.links.insightsOverview` | `read` | Read a summary of one link's performance |
| `links.listForUser` | `toneden.api.links.listForUser` | `read` | List one user's links |
| `links.update` | `toneden.api.links.update` | `write` | Change the fields of one link; only the given fields are sent |
| `links.validPath` | `toneden.api.links.validPath` | `read` | Check whether a path and subdomain are still available; answers 200 with `valid: false` rather than failing |
| `offlineConversions.upload` | `toneden.api.offlineConversions.upload` | `write` | Upload offline conversions for a user |
| `playbooks.create` | `toneden.api.playbooks.create` | `destructive` | Create a playbook campaign from a template |
| `playbooks.delete` | `toneden.api.playbooks.delete` | `destructive` | Delete a playbook campaign; there is no restore route |
| `playbooks.get` | `toneden.api.playbooks.get` | `read` | Read one playbook campaign |
| `playbooks.update` | `toneden.api.playbooks.update` | `destructive` | Change a playbook campaign title or archive state |
| `userLists.create` | `toneden.api.userLists.create` | `write` | Create a user list for a Facebook custom audience; the feature requires access from ToneDen support |
| `userLists.list` | `toneden.api.userLists.list` | `read` | List one user's advertising user lists |
| `userLists.updateContacts` | `toneden.api.userLists.updateContacts` | `write` | Add or remove people in a user list |
| `users.get` | `toneden.api.users.get` | `read` | Read a user profile |
| `users.update` | `toneden.api.users.update` | `write` | Change a user profile's name, email or location |

## Auth

Auth: OAuth 2.0, API key (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/toneden

## License

Apache-2.0
