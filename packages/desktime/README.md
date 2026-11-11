# @corsair-dev/desktime

DeskTime plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/desktime
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `company.get` | `desktime.api.company.get` | `read` | Read the account's name, work hours, tracking window and timezone |
| `employee.apps` | `desktime.api.employee.apps` | `read` | Read the apps one employee used on a day, grouped as unrated, neutral and productive |
| `employee.basic` | `desktime.api.employee.basic` | `read` | Read one employee's arrival, departure, tracked time and productivity for a day, defaulting to the key owner and today |
| `employee.projects` | `desktime.api.employee.projects` | `read` | Read the projects one employee tracked time against on a day |
| `employees.list` | `desktime.api.employees.list` | `read` | List every employee for a day, week or month with their arrival, tracked time and productivity, nested by date then employee id |
| `ping.get` | `desktime.api.ping.get` | `read` | Check that the DeskTime API answers. A configured key is still required, because the runtime resolves the account key before any endpoint runs |
| `projects.list` | `desktime.api.projects.list` | `read` | List the account's active projects with their tasks. Archived projects are left out |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/desktime

## License

Apache-2.0
