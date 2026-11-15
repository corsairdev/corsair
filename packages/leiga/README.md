# @corsair-dev/leiga

Leiga plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/leiga
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `issues.fields` | `leiga.api.issues.fields` | `read` | List the fields one issue type exposes, including custom ones |
| `issues.get` | `leiga.api.issues.get` | `read` | Get one issue by id, with its fields and tags |
| `issues.getByNumber` | `leiga.api.issues.getByNumber` | `read` | Get one issue by its human-readable number, such as LGC-12 |
| `issues.list` | `leiga.api.issues.list` | `read` | Query the issues in a project, with filters and paging |
| `issues.types` | `leiga.api.issues.types` | `read` | List the issue types a project offers, such as bug or task |
| `members.list` | `leiga.api.members.list` | `read` | List the members of a project with their roles |
| `projects.get` | `leiga.api.projects.get` | `read` | Get one project by id, with its metadata |
| `projects.getByKey` | `leiga.api.projects.getByKey` | `read` | Get one project by its key, such as LGC |
| `projects.list` | `leiga.api.projects.list` | `read` | List the projects in the organization |
| `projects.templates` | `leiga.api.projects.templates` | `read` | List the project templates available for new projects |
| `sprints.get` | `leiga.api.sprints.get` | `read` | Get one sprint by id |
| `sprints.list` | `leiga.api.sprints.list` | `read` | List a project sprints with per-issue-type counts |
| `tags.list` | `leiga.api.tags.list` | `read` | List the tags defined in a project |
| `workflows.list` | `leiga.api.workflows.list` | `read` | List the workflow steps a project uses |
| `workflows.nextStates` | `leiga.api.workflows.nextStates` | `read` | List the states an issue can move to from its current one |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/leiga

## License

Apache-2.0
