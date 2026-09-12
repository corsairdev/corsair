# @corsair-dev/classmarker

Classmarker plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/classmarker
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accessLists.addCodes` | `classmarker.api.accessLists.addCodes` | `write` | Add access-list codes for a link exam. |
| `accessLists.deleteCodes` | `classmarker.api.accessLists.deleteCodes` | `destructive` | Delete access-list codes for a link exam. |
| `apiKeys.delete` | `classmarker.api.apiKeys.delete` | `destructive` | Delete a ClassMarker API key by id. |
| `categories.create` | `classmarker.api.categories.create` | `write` | Create a category under a parent category. |
| `categories.createParent` | `classmarker.api.categories.createParent` | `write` | Create a parent category in the question bank. |
| `categories.list` | `classmarker.api.categories.list` | `read` | List parent categories and sub-categories. |
| `categories.update` | `classmarker.api.categories.update` | `write` | Update a category and optionally re-parent it. |
| `categories.updateParent` | `classmarker.api.categories.updateParent` | `write` | Update a parent category in the question bank. |
| `certificates.list` | `classmarker.api.certificates.list` | `read` | List all ClassMarker certificates. |
| `groups.create` | `classmarker.api.groups.create` | `write` | Create a new ClassMarker group. |
| `groups.delete` | `classmarker.api.groups.delete` | `destructive` | Delete a ClassMarker group. |
| `groups.get` | `classmarker.api.groups.get` | `read` | Get details for a specific ClassMarker group. |
| `groupsLinksExams.getAll` | `classmarker.api.groupsLinksExams.getAll` | `read` | List all groups, links, and assigned tests visible to the API key. |
| `questions.create` | `classmarker.api.questions.create` | `write` | Create a new question in the question bank. |
| `questions.get` | `classmarker.api.questions.get` | `read` | Get one question from the question bank. |
| `questions.list` | `classmarker.api.questions.list` | `read` | List question-bank questions (200 per page). |
| `questions.update` | `classmarker.api.questions.update` | `write` | Update an existing question in the question bank. |
| `recentResults.forAllGroups` | `classmarker.api.recentResults.forAllGroups` | `read` | Fetch recent results across all groups with timestamp pagination. |
| `recentResults.forAllLinks` | `classmarker.api.recentResults.forAllLinks` | `read` | Fetch recent results across all links with timestamp pagination. |
| `recentResults.forGroupExam` | `classmarker.api.recentResults.forGroupExam` | `read` | Fetch recent results for one group/test pair. |
| `recentResults.forLinkExam` | `classmarker.api.recentResults.forLinkExam` | `read` | Fetch recent results for one link/test pair. |
| `tests.deleteLink` | `classmarker.api.tests.deleteLink` | `destructive` | Delete one link assignment from a test. |
| `tests.get` | `classmarker.api.tests.get` | `read` | Get details for a specific ClassMarker test. |
| `tests.list` | `classmarker.api.tests.list` | `read` | List all tests available to the API key. |
| `users.create` | `classmarker.api.users.create` | `write` | Create a new ClassMarker user. |
| `users.delete` | `classmarker.api.users.delete` | `destructive` | Delete an existing ClassMarker user. |
| `users.get` | `classmarker.api.users.get` | `read` | Get details for one ClassMarker user. |
| `users.list` | `classmarker.api.users.list` | `read` | List users in your ClassMarker account. |
| `utility.getInitialFinishedAfterTimestamp` | `classmarker.api.utility.getInitialFinishedAfterTimestamp` | `read` | Compute the initial finishedAfterTimestamp cursor for recent-results pagination. |
| `webhooks.delete` | `classmarker.api.webhooks.delete` | `destructive` | Delete a ClassMarker webhook. |
| `webhooks.list` | `classmarker.api.webhooks.list` | `read` | List configured ClassMarker webhooks. |

## Auth

Auth: API key pair. Corsair prompts your tenant for both `api_key` and `api_key_secret` on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/classmarker

## License

Apache-2.0
