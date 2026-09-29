# @corsair-dev/mailchimp

Mailchimp plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/mailchimp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.ping` | `mailchimp.api.account.ping` | `read` | Health-check the API. |
| `account.root` | `mailchimp.api.account.root` | `read` | Get account and API root information. |
| `campaigns.create` | `mailchimp.api.campaigns.create` | `write` | Create a campaign. |
| `campaigns.get` | `mailchimp.api.campaigns.get` | `read` | Get a campaign. |
| `campaigns.getContent` | `mailchimp.api.campaigns.getContent` | `read` | Get campaign content. |
| `campaigns.list` | `mailchimp.api.campaigns.list` | `read` | List campaigns. |
| `campaigns.remove` | `mailchimp.api.campaigns.remove` | `destructive` | Delete a campaign. |
| `campaigns.schedule` | `mailchimp.api.campaigns.schedule` | `write` | Schedule a campaign. |
| `campaigns.send` | `mailchimp.api.campaigns.send` | `destructive` | Send a campaign to its audience. |
| `campaigns.sendTest` | `mailchimp.api.campaigns.sendTest` | `write` | Send a test email. |
| `campaigns.setContent` | `mailchimp.api.campaigns.setContent` | `write` | Set campaign content. |
| `campaigns.unschedule` | `mailchimp.api.campaigns.unschedule` | `write` | Unschedule a campaign. |
| `campaigns.update` | `mailchimp.api.campaigns.update` | `write` | Update campaign settings. |
| `interestCategories.create` | `mailchimp.api.interestCategories.create` | `write` | Create an interest category. |
| `interestCategories.get` | `mailchimp.api.interestCategories.get` | `read` | Get an interest category. |
| `interestCategories.list` | `mailchimp.api.interestCategories.list` | `read` | List interest categories (groups). |
| `interestCategories.remove` | `mailchimp.api.interestCategories.remove` | `destructive` | Delete an interest category. |
| `interestCategories.update` | `mailchimp.api.interestCategories.update` | `write` | Update an interest category. |
| `interests.create` | `mailchimp.api.interests.create` | `write` | Create an interest. |
| `interests.get` | `mailchimp.api.interests.get` | `read` | Get an interest. |
| `interests.list` | `mailchimp.api.interests.list` | `read` | List interests in a category. |
| `interests.remove` | `mailchimp.api.interests.remove` | `destructive` | Delete an interest. |
| `interests.update` | `mailchimp.api.interests.update` | `write` | Update an interest. |
| `lists.create` | `mailchimp.api.lists.create` | `write` | Create an audience. |
| `lists.get` | `mailchimp.api.lists.get` | `read` | Get an audience by id. |
| `lists.list` | `mailchimp.api.lists.list` | `read` | List all audiences. |
| `lists.remove` | `mailchimp.api.lists.remove` | `destructive` | Delete an audience. |
| `lists.update` | `mailchimp.api.lists.update` | `write` | Update audience settings. |
| `members.add` | `mailchimp.api.members.add` | `write` | Add a new member. |
| `members.archive` | `mailchimp.api.members.archive` | `destructive` | Archive a member. |
| `members.get` | `mailchimp.api.members.get` | `read` | Get a member. |
| `members.list` | `mailchimp.api.members.list` | `read` | List members of an audience. |
| `members.listTags` | `mailchimp.api.members.listTags` | `read` | List a member's tags. |
| `members.remove` | `mailchimp.api.members.remove` | `destructive` | Permanently delete a member. |
| `members.search` | `mailchimp.api.members.search` | `read` | Search members. |
| `members.update` | `mailchimp.api.members.update` | `write` | Update a member. |
| `members.updateTags` | `mailchimp.api.members.updateTags` | `write` | Add or remove a member's tags. |
| `members.upsert` | `mailchimp.api.members.upsert` | `write` | Add or update a member (idempotent). |
| `mergeFields.create` | `mailchimp.api.mergeFields.create` | `write` | Create a merge field. |
| `mergeFields.get` | `mailchimp.api.mergeFields.get` | `read` | Get a merge field. |
| `mergeFields.list` | `mailchimp.api.mergeFields.list` | `read` | List merge fields. |
| `mergeFields.remove` | `mailchimp.api.mergeFields.remove` | `destructive` | Delete a merge field. |
| `mergeFields.update` | `mailchimp.api.mergeFields.update` | `write` | Update a merge field. |
| `segments.addMember` | `mailchimp.api.segments.addMember` | `write` | Add a member to a segment. |
| `segments.create` | `mailchimp.api.segments.create` | `write` | Create a segment. |
| `segments.get` | `mailchimp.api.segments.get` | `read` | Get a segment. |
| `segments.list` | `mailchimp.api.segments.list` | `read` | List segments. |
| `segments.listMembers` | `mailchimp.api.segments.listMembers` | `read` | List members in a segment. |
| `segments.remove` | `mailchimp.api.segments.remove` | `destructive` | Delete a segment. |
| `segments.removeMember` | `mailchimp.api.segments.removeMember` | `destructive` | Remove a member from a segment. |
| `segments.update` | `mailchimp.api.segments.update` | `write` | Update a segment. |
| `webhooks.create` | `mailchimp.api.webhooks.create` | `write` | Create a webhook. |
| `webhooks.get` | `mailchimp.api.webhooks.get` | `read` | Get a webhook. |
| `webhooks.list` | `mailchimp.api.webhooks.list` | `read` | List list webhooks. |
| `webhooks.remove` | `mailchimp.api.webhooks.remove` | `destructive` | Delete a webhook. |
| `webhooks.update` | `mailchimp.api.webhooks.update` | `write` | Update a webhook. |

## Auth

Auth: API key, OAuth 2.0 (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mailchimp

## License

Apache-2.0
