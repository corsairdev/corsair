# @corsair-dev/klaviyo

Klaviyo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/klaviyo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `events.create` | `klaviyo.api.events.create` | `write` | Record an event against a profile by metric name; Klaviyo creates the metric on first use, and the event can trigger flows |
| `events.get` | `klaviyo.api.events.get` | `read` | Read one event by id, with its properties and timestamp |
| `events.list` | `klaviyo.api.events.list` | `read` | Page the events recorded for the account, filtered by metric, profile or time |
| `lists.addProfiles` | `klaviyo.api.lists.addProfiles` | `write` | Add up to 1000 profiles to a list by id; adding does not change their subscription consent |
| `lists.create` | `klaviyo.api.lists.create` | `write` | Create an empty marketing list with a name |
| `lists.get` | `klaviyo.api.lists.get` | `read` | Read one marketing list by id, with its name and timestamps |
| `lists.list` | `klaviyo.api.lists.list` | `read` | List the marketing lists on the account, filtered and cursor-paged |
| `lists.profiles` | `klaviyo.api.lists.profiles` | `read` | Page the profiles that belong to a list |
| `lists.remove` | `klaviyo.api.lists.remove` | `destructive` | Delete a list; the profiles on it stay on the account but lose that membership, and the list cannot be restored |
| `lists.removeProfiles` | `klaviyo.api.lists.removeProfiles` | `destructive` | Remove up to 1000 profiles from a list; their submission or consent elsewhere is untouched |
| `lists.update` | `klaviyo.api.lists.update` | `write` | Rename an existing list |
| `metrics.aggregate` | `klaviyo.api.metrics.aggregate` | `read` | Aggregate a metric into time buckets, such as a daily count over a date range, optionally grouped by a dimension |
| `metrics.get` | `klaviyo.api.metrics.get` | `read` | Read one metric by id |
| `metrics.list` | `klaviyo.api.metrics.list` | `read` | List the metrics defined on the account, such as Placed Order |
| `profiles.create` | `klaviyo.api.profiles.create` | `write` | Create a profile from an email, phone number or external id, with names, location and custom properties; Klaviyo merges a duplicate onto the existing profile |
| `profiles.get` | `klaviyo.api.profiles.get` | `read` | Read one profile by id, optionally including its conversations or push tokens |
| `profiles.list` | `klaviyo.api.profiles.list` | `read` | Search profiles with a Klaviyo filter expression, sorted and cursor-paged; returns each profile with its attributes and subscription state |
| `profiles.subscribe` | `klaviyo.api.profiles.subscribe` | `write` | Subscribe a profile to a list over email or SMS; this grants marketing consent through a queued bulk job, so it confirms the request was accepted rather than returning the profile |
| `profiles.update` | `klaviyo.api.profiles.update` | `write` | Change a profile name, location, custom properties or identifiers by id |
| `segments.create` | `klaviyo.api.segments.create` | `write` | Create a segment from a condition group; Klaviyo evaluates it server-side, so the segment is not immediately populated |
| `segments.get` | `klaviyo.api.segments.get` | `read` | Read one segment by id, with its active flag |
| `segments.list` | `klaviyo.api.segments.list` | `read` | List the segments on the account, filtered and cursor-paged |
| `segments.profiles` | `klaviyo.api.segments.profiles` | `read` | Page the profiles that currently match a segment |
| `segments.remove` | `klaviyo.api.segments.remove` | `destructive` | Delete a segment; its definition is lost and cannot be restored |
| `segments.update` | `klaviyo.api.segments.update` | `write` | Change a segment name or its condition group |
| `tagGroups.create` | `klaviyo.api.tagGroups.create` | `write` | Create a tag group, optionally exclusive so only one of its tags applies |
| `tagGroups.list` | `klaviyo.api.tagGroups.list` | `read` | List the tag groups, which namespace tags and can allow only one tag each |
| `tagGroups.remove` | `klaviyo.api.tagGroups.remove` | `destructive` | Delete a tag group; the tags inside it go with it and cannot be restored |
| `tags.create` | `klaviyo.api.tags.create` | `write` | Create a tag with a name, unique within its tag group |
| `tags.get` | `klaviyo.api.tags.get` | `read` | Read one tag by id, with its name and timestamps |
| `tags.list` | `klaviyo.api.tags.list` | `read` | List the tags on the account, filtered and cursor-paged |
| `tags.remove` | `klaviyo.api.tags.remove` | `destructive` | Delete a tag; it detaches from every campaign, flow, list and segment that carried it |
| `tags.update` | `klaviyo.api.tags.update` | `write` | Rename a tag; its group and attachments stay as they are |
| `webhooks.create` | `klaviyo.api.webhooks.create` | `write` | Create a webhook with an endpoint URL, a shared secret and one or more topics; Klaviyo signs each delivery with that secret |
| `webhooks.get` | `klaviyo.api.webhooks.get` | `read` | Read one webhook by id |
| `webhooks.list` | `klaviyo.api.webhooks.list` | `read` | List the webhooks configured on the account |
| `webhooks.remove` | `klaviyo.api.webhooks.remove` | `destructive` | Delete a webhook; deliveries stop immediately and it cannot be restored |
| `webhooks.update` | `klaviyo.api.webhooks.update` | `write` | Change a webhook name, description, endpoint URL or enabled flag |
| `webhookTopics.list` | `klaviyo.api.webhookTopics.list` | `read` | List the topics a webhook can subscribe to, such as Placed Order |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/klaviyo

## License

Apache-2.0
