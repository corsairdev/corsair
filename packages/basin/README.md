# @corsair-dev/basin

Basin plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/basin
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `domains.list` | `basin.api.domains.list` | `read` | List custom domains configured in the account |
| `forms.create` | `basin.api.forms.create` | `write` | Create a new form |
| `forms.delete` | `basin.api.forms.delete` | `destructive` | Permanently delete a form and its configuration [DESTRUCTIVE] |
| `forms.get` | `basin.api.forms.get` | `read` | Retrieve a form by ID |
| `forms.list` | `basin.api.forms.list` | `read` | List all forms in the account |
| `forms.update` | `basin.api.forms.update` | `write` | Update an existing form configuration |
| `formViews.get` | `basin.api.formViews.get` | `read` | Retrieve a specific form view by ID |
| `formViews.list` | `basin.api.formViews.list` | `read` | List form views in the account |
| `projects.create` | `basin.api.projects.create` | `write` | Create a new project |
| `projects.delete` | `basin.api.projects.delete` | `destructive` | Permanently delete a project [DESTRUCTIVE] |
| `projects.get` | `basin.api.projects.get` | `read` | Retrieve a project by ID |
| `projects.list` | `basin.api.projects.list` | `read` | List all projects in the account |
| `projects.update` | `basin.api.projects.update` | `write` | Update an existing project name |
| `submissions.delete` | `basin.api.submissions.delete` | `destructive` | Permanently delete a form submission [DESTRUCTIVE] |
| `submissions.get` | `basin.api.submissions.get` | `read` | Retrieve a specific form submission by ID |
| `submissions.list` | `basin.api.submissions.list` | `read` | List submissions with filtering and pagination options |
| `submissions.markHam` | `basin.api.submissions.markHam` | `write` | Mark a submission as legitimate (not spam) |
| `submissions.markSpam` | `basin.api.submissions.markSpam` | `write` | Mark a submission as spam |
| `submissions.refireWebhooks` | `basin.api.submissions.refireWebhooks` | `write` | Re-trigger webhooks for a specific submission |
| `submissions.refireWebhooksBulk` | `basin.api.submissions.refireWebhooksBulk` | `write` | Re-trigger webhooks in bulk for multiple submissions |
| `submissions.update` | `basin.api.submissions.update` | `write` | Update a submission state (read, spam, trash) |
| `webhooks.create` | `basin.api.webhooks.create` | `write` | Create a new form webhook integration |
| `webhooks.delete` | `basin.api.webhooks.delete` | `destructive` | Permanently delete a form webhook integration [DESTRUCTIVE] |
| `webhooks.get` | `basin.api.webhooks.get` | `read` | Retrieve a form webhook configuration by ID |
| `webhooks.list` | `basin.api.webhooks.list` | `read` | List all form webhooks |
| `webhooks.update` | `basin.api.webhooks.update` | `write` | Update a form webhook configuration |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/basin

## License

Apache-2.0
