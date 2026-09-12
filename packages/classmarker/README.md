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
| `categories.create` | `classmarker.api.categories.create` | `write` | Create a category under a parent category. |
| `categories.createParent` | `classmarker.api.categories.createParent` | `write` | Create a parent category in the question bank. |
| `categories.list` | `classmarker.api.categories.list` | `read` | List parent categories and sub-categories. |
| `categories.update` | `classmarker.api.categories.update` | `write` | Update a category and optionally re-parent it. |
| `categories.updateParent` | `classmarker.api.categories.updateParent` | `write` | Update a parent category in the question bank. |
| `groupsLinksExams.getAll` | `classmarker.api.groupsLinksExams.getAll` | `read` | List all groups, links, and assigned tests visible to the API key. |
| `questions.create` | `classmarker.api.questions.create` | `write` | Create a new question in the question bank. |
| `questions.get` | `classmarker.api.questions.get` | `read` | Get one question from the question bank. |
| `questions.list` | `classmarker.api.questions.list` | `read` | List question-bank questions (200 per page). |
| `questions.update` | `classmarker.api.questions.update` | `write` | Update an existing question in the question bank. |
| `recentResults.forAllGroups` | `classmarker.api.recentResults.forAllGroups` | `read` | Fetch recent results across all groups with timestamp pagination. |
| `recentResults.forAllLinks` | `classmarker.api.recentResults.forAllLinks` | `read` | Fetch recent results across all links with timestamp pagination. |
| `recentResults.forGroupExam` | `classmarker.api.recentResults.forGroupExam` | `read` | Fetch recent results for one group/test pair. |
| `recentResults.forLinkExam` | `classmarker.api.recentResults.forLinkExam` | `read` | Fetch recent results for one link/test pair. |

## Auth

Auth: API key pair. Corsair prompts your tenant for both `api_key` and `api_key_secret` on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/classmarker

## License

Apache-2.0
