# @corsair-dev/keyword

Keyword plugin for Corsair: manage rank-tracking projects and their keywords, add and refresh keywords, and read rankings, movement metrics, rank history, competitors, tracked regions, top pages and Share of Voice history.

## Install

```bash
pnpm add @corsair-dev/keyword
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `keyword.api.account.get` | `read` | The token’s own user, optionally with the subscription block |
| `keywords.add` | `keyword.api.keywords.add` | `write` | Add keywords to a project, each with its domain, region and language. Adding a keyword already tracked returns the existing one |
| `keywords.bulkDelete` | `keyword.api.keywords.bulkDelete` | `destructive` | Delete many keywords from one project in a single call; their history is lost |
| `keywords.bulkUpdate` | `keyword.api.keywords.bulkUpdate` | `write` | Apply the same domain, region, tags or status to many keywords in one project |
| `keywords.delete` | `keyword.api.keywords.delete` | `destructive` | Delete one keyword and its ranking history; it cannot be restored |
| `keywords.get` | `keyword.api.keywords.get` | `read` | One keyword with its rank, metrics and rank history |
| `keywords.list` | `keyword.api.keywords.list` | `read` | Every keyword in a project or group with its rank, best rank, search volume and trend, read as of a given day |
| `keywords.refresh` | `keyword.api.keywords.refresh` | `destructive` | Queue keywords for an on-demand rank check; spends the plan’s daily refresh quota. The whole request is refused if the quota would be exceeded |
| `keywords.update` | `keyword.api.keywords.update` | `write` | Change a keyword’s domain, region, tags, status, baseline or favourite flag |
| `metrics.competitors` | `keyword.api.metrics.competitors` | `read` | The top competing URLs for one keyword in a date window, with each result’s type and position |
| `metrics.get` | `keyword.api.metrics.get` | `read` | Keyword movement for a project, group or tag: how many sit in each top-N bucket and how that changed day over day |
| `mindshare.history` | `keyword.api.mindshare.history` | `read` | Share of Voice over a date window, read from Keyword’s cache |
| `projects.archive` | `keyword.api.projects.archive` | `write` | Archive a project or subproject: it stops updating until `projects.restore` brings it back. Keyword refuses to archive the account’s only active top-level project |
| `projects.create` | `keyword.api.projects.create` | `write` | Create a project, or a subproject from a `Parent[sub]Child` name; the parent must exist first |
| `projects.delete` | `keyword.api.projects.delete` | `destructive` | Delete a project with every keyword and its ranking history; it cannot be restored |
| `projects.get` | `keyword.api.projects.get` | `read` | One project or subproject with its tags and counts |
| `projects.list` | `keyword.api.projects.list` | `read` | Every project and subproject with its tags and keyword counts; a subproject is named `Parent[sub]Child` |
| `projects.restore` | `keyword.api.projects.restore` | `write` | Undo an archive, bringing the project and its keywords back |
| `rankChart.get` | `keyword.api.rankChart.get` | `read` | Daily rank history for a set of keywords over a number of days; Keyword refuses a call covering more than 400,000 keyword-days |
| `rankingUrls.list` | `keyword.api.rankingUrls.list` | `read` | The pages that rank best for a project, with their average position and total search volume, 10 to a page |
| `regions.list` | `keyword.api.regions.list` | `read` | The Google regions a project tracks, with each one’s language and keyword count |
| `sharing.get` | `keyword.api.sharing.get` | `read` | A project’s shared-report settings: whether the share link is on, its hash, whether it needs a password, and what the report shows |
| `sharing.update` | `keyword.api.sharing.update` | `write` | Turn a project’s share link on or off, set or clear its password, or toggle what the shared report shows. Everything except the on/off switch needs Keyword’s white-label permission |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/keyword

## License

Apache-2.0
