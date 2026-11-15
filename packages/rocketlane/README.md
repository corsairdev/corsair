# @corsair-dev/rocketlane

Rocketlane plugin for Corsair: reads and writes tasks, projects, customer companies, time entries and team members through the Rocketlane public API, including archiving a project.

## Install

```bash
pnpm add @corsair-dev/rocketlane
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `companies.create` | `rocketlane.api.companies.create` | `write` | Create a customer company with its account owner, url and description |
| `companies.delete` | `rocketlane.api.companies.delete` | `destructive` | Delete a company permanently; the API answers 204 |
| `companies.get` | `rocketlane.api.companies.get` | `read` | Fetch one company with its owner, url, description and custom fields |
| `companies.list` | `rocketlane.api.companies.list` | `read` | List customer companies with search and token paging |
| `companies.update` | `rocketlane.api.companies.update` | `write` | Update a company: its name, owner, url or description |
| `projects.archive` | `rocketlane.api.projects.archive` | `write` | Archive a project, which keeps its records but removes it from active lists |
| `projects.create` | `rocketlane.api.projects.create` | `write` | Create a project from a customer and an owner, with its dates, visibility and financial details |
| `projects.delete` | `rocketlane.api.projects.delete` | `destructive` | Delete a project permanently; the API answers 204 |
| `projects.get` | `rocketlane.api.projects.get` | `read` | Fetch one project with its customer, owner, team members, status and financial fields |
| `projects.list` | `rocketlane.api.projects.list` | `read` | List projects with filters for company, customer, team member, status and financial ranges, plus token paging |
| `projects.update` | `rocketlane.api.projects.update` | `write` | Update a project: its name, dates, visibility, team members or financial details |
| `tasks.create` | `rocketlane.api.tasks.create` | `write` | Create a task in a project with its dates, effort, status, phase, assignees and custom fields |
| `tasks.delete` | `rocketlane.api.tasks.delete` | `destructive` | Delete a task permanently; the API answers 204 |
| `tasks.get` | `rocketlane.api.tasks.get` | `read` | Fetch one task by id with its project, phase, status, assignees, followers and custom fields |
| `tasks.list` | `rocketlane.api.tasks.list` | `read` | List tasks with filters for project, phase, status, assignee and date ranges, plus token paging |
| `tasks.update` | `rocketlane.api.tasks.update` | `write` | Update a task: its name, dates, effort, progress, status, phase or custom fields |
| `timeEntries.create` | `rocketlane.api.timeEntries.create` | `write` | Log time against a project or task: the date and minutes are required |
| `timeEntries.delete` | `rocketlane.api.timeEntries.delete` | `destructive` | Delete a time entry permanently; the API answers 204 |
| `timeEntries.get` | `rocketlane.api.timeEntries.get` | `read` | Fetch one time entry with its project, task, user, rates and approval state |
| `timeEntries.list` | `rocketlane.api.timeEntries.list` | `read` | List time entries with filters for date, project, task, user, billable and approval status |
| `users.get` | `rocketlane.api.users.get` | `read` | Fetch one user with their role, company, capacity and custom fields |
| `users.list` | `rocketlane.api.users.list` | `read` | List the team members on the instance with token paging |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/rocketlane

## License

Apache-2.0
