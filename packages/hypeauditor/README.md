# @corsair-dev/hypeauditor

HypeAuditor plugin for Corsair: influencer reports, media, history, brand mentions, discovery search and saved lists.

## Install

```bash
pnpm add @corsair-dev/hypeauditor
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.planInfo` | `hypeauditor.api.account.planInfo` | `read` | Read the report credits and discovery calls left in the plan; API subscriptions only |
| `account.unlockedReports` | `hypeauditor.api.account.unlockedReports` | `read` | List the reports unlocked on the account, with `refunded` marking a credit returned after a failed build |
| `discovery.keywords` | `hypeauditor.api.discovery.keywords` | `read` | Read the posts behind a keyword search by their content IDs, which is free and safe to repeat |
| `discovery.search` | `hypeauditor.api.discovery.search` | `write` | Search creators with the documented filters, 20 per page; each page costs one discovery call, and `sandbox` answers sample data without spending one |
| `history.instagram` | `hypeauditor.api.history.instagram` | `read` | Read the Instagram metrics history for a username, which is free and safe to repeat |
| `history.tiktok` | `hypeauditor.api.history.tiktok` | `read` | Read the TikTok metrics history for a channel, which is free and safe to repeat |
| `history.twitch` | `hypeauditor.api.history.twitch` | `read` | Read the Twitch metrics history for a channel, which is free and safe to repeat |
| `history.twitter` | `hypeauditor.api.history.twitter` | `read` | Read the Twitter metrics history for a channel, which is free and safe to repeat |
| `history.youtube` | `hypeauditor.api.history.youtube` | `read` | Read the YouTube metrics history for a channel, which is free and safe to repeat |
| `lists.add` | `hypeauditor.api.lists.add` | `write` | Add a report to a saved list; repeating it leaves the report in the list, so it is safe to retry |
| `lists.items` | `hypeauditor.api.lists.items` | `read` | Read the reports saved in one list, up to 100 per page, which is free and safe to repeat |
| `lists.list` | `hypeauditor.api.lists.list` | `read` | List the saved lists in the account; the default "Recent searches" list is `id: 0` |
| `lists.remove` | `hypeauditor.api.lists.remove` | `write` | Remove a report from a saved list; the default "Recent searches" list cannot be changed |
| `media.instagram` | `hypeauditor.api.media.instagram` | `read` | Read an Instagram account’s recent media, which is free and safe to repeat |
| `media.tiktok` | `hypeauditor.api.media.tiktok` | `read` | Read a TikTok account’s media by channel ID, which is free and safe to repeat |
| `media.youtube` | `hypeauditor.api.media.youtube` | `read` | Read a YouTube channel’s media, one page at a time, which is free and safe to repeat |
| `mentions.tiktok` | `hypeauditor.api.mentions.tiktok` | `read` | Read the brands a TikTok account’s videos mention, which is free and safe to repeat |
| `mentions.youtube` | `hypeauditor.api.mentions.youtube` | `read` | Read the brands a YouTube channel’s videos mention, which is free and safe to repeat |
| `reports.instagram` | `hypeauditor.api.reports.instagram` | `write` | Read the Instagram report by username or user ID; the first request for a creator spends a credit, and a 202 answer carries `retryTtl` |
| `reports.snapchat` | `hypeauditor.api.reports.snapchat` | `write` | Read the Snapchat report by username; the first request for a creator spends a credit, and a 202 answer carries `retryTtl` |
| `reports.tiktok` | `hypeauditor.api.reports.tiktok` | `write` | Read the TikTok report by username or user ID; the first request for a creator spends a credit, and a 202 answer carries `retryTtl` |
| `reports.twitch` | `hypeauditor.api.reports.twitch` | `write` | Read the Twitch report by username; the first request for a creator spends a credit, and a 202 answer carries `retryTtl` |
| `reports.twitter` | `hypeauditor.api.reports.twitter` | `write` | Read the Twitter report by username; the first request for a creator spends a credit, and a 202 answer carries `retryTtl` |
| `reports.youtube` | `hypeauditor.api.reports.youtube` | `write` | Read the YouTube report by channel ID or username; the first request for a creator spends a credit, and a 202 answer carries `retryTtl` |
| `suggester.get` | `hypeauditor.api.suggester.get` | `read` | Suggest a channel name from a partial one, which is free and safe to repeat |
| `taxonomy.get` | `hypeauditor.api.taxonomy.get` | `read` | Read the category, thematics and language ids the discovery filters take |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/hypeauditor

## License

Apache-2.0
