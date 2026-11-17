# @corsair-dev/storyblok

Storyblok plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/storyblok
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `assets.bulkDelete` | `storyblok.api.assets.bulkDelete` | `destructive` | Delete several assets in one call, with the same effect as deleting each |
| `assets.delete` | `storyblok.api.assets.delete` | `destructive` | Delete one asset, so any content referencing it shows a broken file |
| `assets.get` | `storyblok.api.assets.get` | `read` | Read one asset with its file details and metadata |
| `assets.list` | `storyblok.api.assets.list` | `read` | List assets with a search and a folder filter |
| `assets.update` | `storyblok.api.assets.update` | `write` | Change an asset's metadata: alt text, title, copyright, focus point, privacy and publish window. Uploading new bytes is a separate flow and is not wrapped |
| `components.create` | `storyblok.api.components.create` | `write` | Create a component, which is the field schema a content type uses. Its name is the key content references |
| `components.delete` | `storyblok.api.components.delete` | `destructive` | Delete a component. Content that uses it can no longer render, and this cannot be undone |
| `components.list` | `storyblok.api.components.list` | `read` | List the components that define content types, with their field schemas |
| `components.update` | `storyblok.api.components.update` | `write` | Replace a component's field schema. Existing content is not migrated: a removed field's values stay in stories, hidden, until a migration removes them |
| `datasourceEntries.create` | `storyblok.api.datasourceEntries.create` | `write` | Add an entry to a datasource |
| `datasourceEntries.delete` | `storyblok.api.datasourceEntries.delete` | `destructive` | Delete a datasource entry; content using that option loses it |
| `datasourceEntries.get` | `storyblok.api.datasourceEntries.get` | `read` | Read one datasource entry with its name, value and position |
| `datasourceEntries.list` | `storyblok.api.datasourceEntries.list` | `read` | List datasource entries, optionally only those of one datasource or one dimension value |
| `datasourceEntries.update` | `storyblok.api.datasourceEntries.update` | `write` | Replace a datasource entry's name and value |
| `datasources.create` | `storyblok.api.datasources.create` | `write` | Create a datasource, whose slug is what content uses to reference it |
| `datasources.delete` | `storyblok.api.datasources.delete` | `destructive` | Delete a datasource along with its entries. Content that references it is left pointing at nothing |
| `datasources.get` | `storyblok.api.datasources.get` | `read` | Read one datasource with its dimensions |
| `datasources.list` | `storyblok.api.datasources.list` | `read` | List the datasources on the space, such as reusable option lists |
| `datasources.update` | `storyblok.api.datasources.update` | `write` | Replace a datasource name and slug |
| `releases.create` | `storyblok.api.releases.create` | `write` | Create a release that stories can be grouped into and published together |
| `releases.delete` | `storyblok.api.releases.delete` | `destructive` | Delete a release. The stories grouped in it stay, but the grouping is gone |
| `releases.get` | `storyblok.api.releases.get` | `read` | Read one release with its schedule, released state and the branches it deploys |
| `releases.list` | `storyblok.api.releases.list` | `read` | List releases with their schedules and released state |
| `releases.update` | `storyblok.api.releases.update` | `write` | Change a release, or publish it in the same call with do_release |
| `spaces.get` | `storyblok.api.spaces.get` | `read` | Read the configured space: its plan, counts, environments and defaults |
| `spaces.list` | `storyblok.api.spaces.list` | `read` | List the spaces the token can reach, which is how a space id is found |
| `stories.create` | `storyblok.api.stories.create` | `write` | Create a story, optionally publishing it or grouping it in a release in the same call |
| `stories.delete` | `storyblok.api.stories.delete` | `destructive` | Delete a story and trash it. Storyblok keeps it in the trash, but this plugin does not wrap a restore, so treat it as permanent |
| `stories.get` | `storyblok.api.stories.get` | `read` | Read one story with its full content, published state, tags and version ids |
| `stories.list` | `storyblok.api.stories.list` | `read` | List stories with filters for slug, tag, parent, publication state and release. This route omits each story's content unless with_summary is set |
| `stories.publish` | `storyblok.api.stories.publish` | `write` | Publish a story, or add it to a release with release_id. Storyblok implements this as a GET, but it changes published state |
| `stories.unpublish` | `storyblok.api.stories.unpublish` | `write` | Unpublish a story, so the Content Delivery API stops serving it. Storyblok implements this as a GET |
| `stories.update` | `storyblok.api.stories.update` | `write` | Replace a story's fields and content. Sending publish also publishes it; without it the change stays a draft |
| `tags.create` | `storyblok.api.tags.create` | `write` | Create a tag, optionally attaching it to a story as it is created |
| `tags.delete` | `storyblok.api.tags.delete` | `destructive` | Delete a tag, removing it from every story that carried it. This cannot be undone |
| `tags.list` | `storyblok.api.tags.list` | `read` | List the tags on the space with how many stories carry each |
| `tags.update` | `storyblok.api.tags.update` | `write` | Rename a tag, which updates every story that carries it |
| `webhooks.create` | `storyblok.api.webhooks.create` | `write` | Register a webhook endpoint for the given actions, optionally with a secret Storyblok signs each delivery with |
| `webhooks.delete` | `storyblok.api.webhooks.delete` | `destructive` | Delete a webhook endpoint, so Storyblok stops posting to its URL |
| `webhooks.get` | `storyblok.api.webhooks.get` | `read` | Read one webhook endpoint with its actions and activation |
| `webhooks.list` | `storyblok.api.webhooks.list` | `read` | List the webhook endpoints on the space |
| `webhooks.listActions` | `storyblok.api.webhooks.listActions` | `read` | List the action names a webhook may subscribe to, read from Storyblok so a new event needs no plugin change |
| `webhooks.update` | `storyblok.api.webhooks.update` | `write` | Replace a webhook endpoint, its action list or its activation |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/storyblok

## License

Apache-2.0
