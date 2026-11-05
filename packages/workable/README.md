# @corsair-dev/workable

Workable plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/workable
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.get` | `workable.api.accounts.get` | `read` | Get account metadata by subdomain |
| `accounts.list` | `workable.api.accounts.list` | `read` | List all Workable accounts accessible to the authenticated token |
| `candidates.list` | `workable.api.candidates.list` | `read` | List candidates across all jobs |
| `customAttributes.list` | `workable.api.customAttributes.list` | `read` | List custom attributes configured on the account |
| `departments.create` | `workable.api.departments.create` | `write` | Create a department |
| `departments.delete` | `workable.api.departments.delete` | `destructive` | Delete a department |
| `departments.list` | `workable.api.departments.list` | `read` | List all departments |
| `departments.merge` | `workable.api.departments.merge` | `write` | Merge a department into another department |
| `departments.update` | `workable.api.departments.update` | `write` | Update a department's name or parent |
| `disqualificationReasons.list` | `workable.api.disqualificationReasons.list` | `read` | List disqualification reasons |
| `employeeFields.list` | `workable.api.employeeFields.list` | `read` | List employee field definitions |
| `employees.create` | `workable.api.employees.create` | `write` | Create an employee in draft or published state |
| `employees.get` | `workable.api.employees.get` | `read` | Get a specific employee by ID |
| `employees.list` | `workable.api.employees.list` | `read` | List/search employees |
| `employees.update` | `workable.api.employees.update` | `write` | Update an employee's details |
| `employees.uploadDocuments` | `workable.api.employees.uploadDocuments` | `write` | Upload documents for an employee |
| `events.list` | `workable.api.events.list` | `read` | List scheduled events |
| `jobs.list` | `workable.api.jobs.list` | `read` | List jobs |
| `legalEntities.list` | `workable.api.legalEntities.list` | `read` | List account legal entities |
| `members.enable` | `workable.api.members.enable` | `write` | Reactivate a deactivated member |
| `members.invite` | `workable.api.members.invite` | `write` | Invite a new member by email |
| `members.list` | `workable.api.members.list` | `read` | List account members |
| `members.update` | `workable.api.members.update` | `write` | Update a member's roles or collaboration rules |
| `permissionSets.list` | `workable.api.permissionSets.list` | `read` | List permission sets |
| `publicJobs.list` | `workable.api.publicJobs.list` | `read` | List an account's public job postings (no authentication required) |
| `publicLocations.list` | `workable.api.publicLocations.list` | `read` | List the locations of an account's public jobs with per-country counts (no authentication required) |
| `recruiters.list` | `workable.api.recruiters.list` | `read` | List external recruiters |
| `requisitions.list` | `workable.api.requisitions.list` | `read` | List requisitions |
| `stages.list` | `workable.api.stages.list` | `read` | List recruitment pipeline stages |
| `subscriptions.create` | `workable.api.subscriptions.create` | `write` | Subscribe to a candidate or employee webhook event |
| `subscriptions.delete` | `workable.api.subscriptions.delete` | `destructive` | Delete a webhook subscription |
| `subscriptions.list` | `workable.api.subscriptions.list` | `read` | List webhook subscriptions |
| `timeoffBalances.list` | `workable.api.timeoffBalances.list` | `read` | List employee time-off balances |
| `timeoffCategories.list` | `workable.api.timeoffCategories.list` | `read` | List time-off categories |
| `workSchedules.list` | `workable.api.workSchedules.list` | `read` | List work schedules |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/workable

## License

Apache-2.0
