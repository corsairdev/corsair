# @corsair-dev/teamwork

Teamwork.com for Corsair: 220 operations named `resource.action` (`tasks.list`, `time.createForTask`), one per action, built from Teamwork's published V1, V2 and V3 OpenAPI contracts and checked against a live site.

## Install

```sh
pnpm add @corsair-dev/teamwork
```

## Configure

```ts
import { teamwork } from '@corsair-dev/teamwork';

const plugin = teamwork();
```

Store the Teamwork API key and that tenant's site as `site_name` (`acme` for acme.teamwork.com, `acme.eu` for an EU site) through Corsair's API-key credential flow. Teamwork uses HTTP Basic authentication with the API key as the username and an empty password, over HTTPS. The optional `siteName` plugin option is a global override intended for a single Teamwork site. Full `.teamwork.com` hostnames and site URLs are also accepted; hosts outside teamwork.com are not.

## Operation input shape

Operations are grouped by resource under `teamwork.api`. Supply path variables, query parameters and a request body in separate fields; absent path and query maps default to empty objects.

```ts
await corsair.teamwork.api.tasks.list({
  query: { projectIds: [1470497], includeCompletedTasks: false },
});

await corsair.teamwork.api.tasks.create({
  path: { tasklistId: 4073104 },
  body: { task: { name: 'Draft the launch post' }, taskOptions: { notify: false } },
});
```

Path and query inputs are strict. Request bodies check every documented field but also accept keys the published specs leave out (a V1 milestone `title`, a V3 time entry `description`), and V3 bodies only require what the API requires (verified live). Responses are parsed leniently: Teamwork sends `null` for most unset fields and, on V1, booleans and numbers where the spec says string, so every response field is optional and nullable and unknown enum values pass.

## One operation per action

Teamwork documents most actions two or three times (V1, V2 and V3 routes, PUT and PATCH). Each action here has one operation: the V3 route where V3 has it, V1 where it doesn't (most creates and updates, complete/uncomplete, move/copy, categories, boards, portfolio, teams), and V2 only for a project's task predecessors. Lists take filters instead of one route per parent: `tasks.list` with `projectIds`, `tasklistIds` or `parentTaskId` replaces the per-project, per-list and subtask lists. The routes left out, and why, are listed under "Left out" below. Of the 220: V3 90, V1 129, V2 1.

Schemas are built from the manifest the first time an operation is used, so importing the plugin costs about 3 MB of heap over zod and core.

## Pagination, rate limits and retries

V3 lists take `page` and `pageSize` (50 by default, usually up to 500) and return `meta.page` with `pageOffset`, `pageSize` and `hasMore`. Teamwork caps a request at 50,000 records and recommends `updatedAfter` to continue large task and time collections. V1 lists take `page`/`pageSize`; Teamwork reports V1 totals in `x-page`, `x-pages` and `x-records` headers, which Corsair's JSON transport does not expose.

Array query parameters follow the collection format in the contract: comma-separated by default, repeated keys where the contract says `multi`. Sparse fieldsets (`fields[projects]`, `fields[tasks]` and so on) parse on every resource.

V3 task creates and updates accept Teamwork's own examples (plain numeric assignee arrays, string priorities, descriptions, custom-field arrays). Creates require a task name, and every task write requires `taskOptions.notify`, so the caller decides whether assignees get an email.

Teamwork publishes no numeric rate limit. Corsair's HTTP transport retries HTTP 429 and honours `Retry-After`; the plugin adds no second retry loop. Writes are not retried on server or network errors.

## Operations

### projects

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `projects.list` | read | `GET /projects/api/v3/projects.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projects.listStarred` | read | `GET /projects/api/v3/projects/starred.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projects.get` | read | `GET /projects/api/v3/projects/{projectId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projects.create` | write | `POST /projects.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projects.update` | write | `PUT /projects/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projects.delete` | destructive | `DELETE /projects/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projects.clone` | write | `POST /projects/{id}/clone.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projects.star` | write | `PUT /projects/{id}/star.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projects.getStats` | read | `GET /projects/{id}/stats.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projects.getRates` | read | `GET /projects/{id}/rates.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projects.setRates` | write | `POST /projects/{id}/rates.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projects.convertTentative` | write | `PUT /projects/api/v3/projects/tentative/{projectId}/convert.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projects.listTaskPredecessors` | read | `GET /projects/api/v2/projects/{id}/predecessors.json` | [v2](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v2) |

### projectMetrics

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `projectMetrics.billable` | read | `GET /projects/api/v3/projects/metrics/billable.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projectMetrics.health` | read | `GET /projects/api/v3/projects/metrics/healths.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projectMetrics.invoices` | read | `GET /projects/api/v3/projects/metrics/invoices.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projectMetrics.unbilled` | read | `GET /projects/api/v3/projects/metrics/unbilled.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

### projectTemplates

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `projectTemplates.list` | read | `GET /projects/api/v3/projects/templates.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projectTemplates.get` | read | `GET /projects/api/v3/projects/templates/{id}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projectTemplates.listRequiredCustomFields` | read | `GET /projects/api/v3/projects/templates/{id}/customfields/required.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projectTemplates.create` | write | `POST /projects/template.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### projectCategories

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `projectCategories.list` | read | `GET /projectCategories.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectCategories.get` | read | `GET /projectCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectCategories.create` | write | `POST /projectCategories.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectCategories.update` | write | `PUT /projectCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectCategories.delete` | destructive | `DELETE /projectCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### projectUpdates

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `projectUpdates.list` | read | `GET /projects/api/v3/projects/updates.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projectUpdates.create` | destructive | `POST /projects/{projectId}/update.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectUpdates.update` | destructive | `PUT /projects/updates/{updateId}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectUpdates.delete` | destructive | `DELETE /projects/updates/{updateId}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectUpdates.request` | destructive | `PUT /projects/{projectId}/update/request.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### projectPeople

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `projectPeople.list` | read | `GET /projects/api/v3/projects/{projectId}/people.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projectPeople.get` | read | `GET /projects/api/v3/projects/{projectId}/people/{personId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projectPeople.getPermissions` | read | `GET /projects/{projectId}/people/{personId}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectPeople.add` | write | `PUT /projects/api/v3/projects/{projectId}/people.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `projectPeople.remove` | destructive | `PUT /projects/{projectId}/people/{personId}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### projectRoles

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `projectRoles.list` | read | `GET /projects/{id}/roles.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectRoles.get` | read | `GET /roles/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectRoles.update` | write | `PUT /roles/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `projectRoles.delete` | destructive | `DELETE /roles/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### tasks

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `tasks.list` | read | `GET /projects/api/v3/tasks.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasks.get` | read | `GET /projects/api/v3/tasks/{taskId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasks.create` | write | `POST /projects/api/v3/tasklists/{tasklistId}/tasks.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasks.createSubtask` | write | `POST /projects/api/v3/tasks/{taskId}/subtasks.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasks.update` | write | `PATCH /projects/api/v3/tasks/{taskId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasks.delete` | destructive | `DELETE /projects/api/v3/tasks/{taskId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasks.complete` | write | `PUT /tasks/{id}/complete.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.uncomplete` | write | `PUT /tasks/{id}/uncomplete.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.quickAdd` | write | `POST /projects/{projectId}/tasks/quickadd.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.quickAddSubtasks` | write | `POST /tasks/{id}/quickadd.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.reorder` | write | `PUT /tasklists/{id}/tasks/reorder.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.move` | write | `PUT /tasks/{taskId}/move.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.copy` | write | `PUT /tasks/{taskId}/copy.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.setEstimate` | write | `PUT /tasks/{id}/estimatedtime.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.listDependencies` | read | `GET /tasks/{id}/dependencies.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.listPredecessors` | read | `GET /tasks/{id}/predecessors.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.listRecurring` | read | `GET /tasks/{taskId}/recurring.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasks.countCompleted` | read | `GET /projects/api/v3/tasks/metrics/complete.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasks.countLate` | read | `GET /projects/api/v3/tasks/metrics/late.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasks.timeReport` | read | `GET /projects/api/v3/reporting/precanned/tasktime.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

### personalTasks

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `personalTasks.list` | read | `GET /projects/api/v3/me/personaltasks.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `personalTasks.get` | read | `GET /projects/api/v3/me/personaltasks/{id}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `personalTasks.create` | write | `POST /projects/api/v3/me/personaltasks.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

### taskReminders

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `taskReminders.list` | read | `GET /projects/api/v3/tasks/{id}/reminders.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `taskReminders.create` | destructive | `POST /projects/api/v3/tasks/{taskId}/reminders.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `taskReminders.update` | write | `PATCH /projects/api/v3/tasks/{taskId}/reminders/{reminderId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `taskReminders.delete` | destructive | `DELETE /projects/api/v3/tasks/{taskId}/reminders/{reminderId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

### tasklists

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `tasklists.list` | read | `GET /projects/api/v3/tasklists.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasklists.get` | read | `GET /projects/api/v3/tasklists/{tasklistId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasklists.create` | write | `POST /projects/{id}/tasklists.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasklists.update` | write | `PUT /tasklists/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasklists.delete` | destructive | `DELETE /tasklists/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasklists.listTemplates` | read | `GET /projects/api/v3/tasklists/templates.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `tasklists.reorder` | write | `PUT /projects/{id}/tasklists/reorder.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasklists.copy` | write | `PUT /tasklist/{id}/copy.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `tasklists.move` | write | `PUT /tasklist/{id}/move.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### milestones

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `milestones.list` | read | `GET /projects/api/v3/milestones.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `milestones.get` | read | `GET /projects/api/v3/milestones/{milestoneId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `milestones.create` | write | `POST /projects/{id}/milestones.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `milestones.update` | write | `PUT /milestones/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `milestones.delete` | destructive | `DELETE /milestones/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `milestones.complete` | write | `PUT /milestones/{id}/complete.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `milestones.uncomplete` | write | `PUT /milestones/{id}/uncomplete.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `milestones.listByDeadline` | read | `GET /projects/api/v3/milestones/metrics/deadlines.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

### people

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `people.list` | read | `GET /projects/api/v3/people.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `people.get` | read | `GET /projects/api/v3/people/{personId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `people.me` | read | `GET /projects/api/v3/me.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `people.create` | destructive | `POST /people.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `people.update` | write | `PUT /people/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `people.delete` | destructive | `DELETE /projects/api/v3/people/{personId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `people.listDeleted` | read | `GET /people/deleted.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `people.myStats` | read | `GET /stats.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `people.addToProjects` | write | `PUT /projects/api/v3/projects/people/{userId}/enqueue.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `people.performance` | read | `GET /projects/api/v3/people/metrics/performance.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `people.utilization` | read | `GET /projects/api/v3/people/utilization.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `people.taskCompletion` | read | `GET /projects/api/v3/reporting/precanned/usertaskcompletion.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

### statuses

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `statuses.list` | read | `GET /projects/api/v3/statuses.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `statuses.timeline` | read | `GET /projects/api/v3/statuses/timeline.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `statuses.getMine` | read | `GET /me/status.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `statuses.getForPerson` | read | `GET /people/{id}/status.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `statuses.create` | write | `POST /people/{id}/status.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `statuses.update` | write | `PUT /people/status/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `statuses.delete` | destructive | `DELETE /people/status/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### companies

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `companies.list` | read | `GET /projects/api/v3/companies.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `companies.listForProject` | read | `GET /projects/{id}/companies.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `companies.get` | read | `GET /projects/api/v3/companies/{companyId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `companies.create` | write | `POST /projects/api/v3/companies.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `companies.update` | write | `PATCH /projects/api/v3/companies/{companyId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `companies.delete` | destructive | `DELETE /projects/api/v3/companies/{companyId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `companies.setRates` | write | `PATCH /projects/api/v3/companies/{companyId}/rates.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `companies.convertCurrency` | destructive | `POST /projects/api/v3/companies/{id}/convert-currency.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `companies.addDomains` | write | `POST /projects/api/v3/companies/{id}/domains.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `companies.updateDomain` | write | `PATCH /projects/api/v3/companies/domains/{id}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `companies.deleteDomain` | destructive | `DELETE /projects/api/v3/companies/domains/{id}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

### comments

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `comments.list` | read | `GET /projects/api/v3/comments.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `comments.get` | read | `GET /projects/api/v3/comments/{id}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `comments.listNotified` | read | `GET /projects/api/v3/comments/{id}/notified.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `comments.create` | write | `POST /{resource}/{resourceId}/comments.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `comments.update` | write | `PUT /comments/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `comments.delete` | destructive | `DELETE /comments/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `comments.markRead` | write | `PUT /comments/{id}/markread.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### files

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `files.listForProject` | read | `GET /projects/{id}/files.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `files.listForTask` | read | `GET /tasks/{id}/files.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `files.addToProject` | write | `POST /projects/{id}/files.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `files.addToTask` | write | `POST /tasks/{id}/files.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `files.addVersion` | write | `POST /files/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `files.delete` | destructive | `DELETE /files/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `files.getShareLink` | read | `GET /files/{id}/sharedlink.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `files.copy` | write | `PUT /files/{id}/copy.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### fileCategories

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `fileCategories.list` | read | `GET /projects/{id}/fileCategories.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `fileCategories.get` | read | `GET /fileCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `fileCategories.create` | write | `POST /projects/{id}/fileCategories.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `fileCategories.update` | write | `PUT /fileCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `fileCategories.delete` | destructive | `DELETE /fileCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### links

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `links.list` | read | `GET /links.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `links.listForProject` | read | `GET /projects/{id}/links.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `links.get` | read | `GET /links/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `links.create` | write | `POST /projects/{id}/links.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `links.update` | write | `PUT /links/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `links.delete` | destructive | `DELETE /links/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### linkCategories

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `linkCategories.list` | read | `GET /projects/{id}/linkCategories.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `linkCategories.get` | read | `GET /linkCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `linkCategories.create` | write | `POST /projects/{id}/linkCategories.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `linkCategories.delete` | destructive | `DELETE /linkCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### notebooks

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `notebooks.list` | read | `GET /projects/api/v3/notebooks.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `notebooks.get` | read | `GET /projects/api/v3/notebooks/{notebookId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `notebooks.create` | write | `POST /projects/api/v3/projects/{projectId}/notebooks.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `notebooks.update` | write | `PATCH /projects/api/v3/notebooks/{notebookId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `notebooks.delete` | destructive | `DELETE /projects/api/v3/notebooks/{notebookId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `notebooks.lock` | write | `PUT /notebooks/{id}/lock.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `notebooks.unlock` | write | `PUT /notebooks/{id}/unlock.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `notebooks.copy` | write | `PUT /notebooks/{id}/copy.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `notebooks.move` | write | `PUT /notebooks/{id}/move.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `notebooks.listVersions` | read | `GET /projects/api/v3/notebooks/{notebookId}/versions.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `notebooks.getVersion` | read | `GET /projects/api/v3/notebooks/{notebookId}/versions/{versionId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `notebooks.deleteVersions` | destructive | `DELETE /projects/api/v3/notebooks/{notebookId}/versions.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

### notebookCategories

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `notebookCategories.list` | read | `GET /projects/{id}/notebookCategories.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `notebookCategories.get` | read | `GET /notebookCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `notebookCategories.create` | write | `POST /projects/{id}/notebookCategories.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `notebookCategories.update` | write | `PUT /notebookCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `notebookCategories.delete` | destructive | `DELETE /notebookCategories/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### boardColumns

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `boardColumns.list` | read | `GET /projects/{id}/boards/columns.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `boardColumns.get` | read | `GET /boards/columns/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `boardColumns.create` | write | `POST /projects/{id}/boards/columns.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `boardColumns.update` | write | `PUT /boards/columns/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `boardColumns.delete` | destructive | `DELETE /boards/columns/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### boardCards

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `boardCards.list` | read | `GET /boards/columns/{id}/cards.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `boardCards.get` | read | `GET /boards/columns/cards/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `boardCards.update` | write | `PUT /boards/columns/cards/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `boardCards.move` | write | `PUT /boards/columns/cards/{id}/move.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `boardCards.delete` | destructive | `DELETE /boards/columns/cards/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### portfolioBoards

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `portfolioBoards.list` | read | `GET /portfolio/boards.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `portfolioBoards.create` | write | `POST /portfolio/boards.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `portfolioBoards.update` | write | `PUT /portfolio/boards/{boardId}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `portfolioBoards.delete` | destructive | `DELETE /portfolio/boards/{boardId}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### portfolioColumns

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `portfolioColumns.list` | read | `GET /portfolio/boards/{boardId}/columns.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `portfolioColumns.get` | read | `GET /portfolio/columns/{columnId}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `portfolioColumns.create` | write | `POST /portfolio/boards/{boardId}/columns.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `portfolioColumns.delete` | destructive | `DELETE /portfolio/columns/{columnId}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### portfolioCards

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `portfolioCards.list` | read | `GET /portfolio/columns/{columnId}/cards.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `portfolioCards.get` | read | `GET /portfolio/cards/{cardId}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `portfolioCards.add` | write | `POST /portfolio/columns/{columnId}/cards.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `portfolioCards.move` | write | `PUT /portfolio/cards/{cardId}/move.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `portfolioCards.delete` | destructive | `DELETE /portfolio/cards/{cardId}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### teams

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `teams.list` | read | `GET /teams.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.get` | read | `GET /teams/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.create` | write | `POST /teams.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.update` | write | `PUT /teams/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.delete` | destructive | `DELETE /teams/{id}.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.setMembers` | destructive | `PUT /teams/{id}/people.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.listSubteams` | read | `GET /teams/{id}/subteams.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.listMemberIds` | read | `GET /teams/users.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.createForProject` | write | `POST /projects/{id}/teams.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.listForProject` | read | `GET /projects/{id}/teams.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.listForCompany` | read | `GET /companies/{id}/teams.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `teams.listForPerson` | read | `GET /people/{id}/teams.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |

### time

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `time.list` | read | `GET /projects/api/v3/time.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.get` | read | `GET /projects/api/v3/time/{timelogId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.create` | write | `POST /projects/api/v3/projects/{projectId}/time.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.createForTask` | write | `POST /projects/api/v3/tasks/{taskId}/time.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.update` | write | `PATCH /projects/api/v3/time/{timelogId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.delete` | destructive | `DELETE /projects/api/v3/time/{timelogId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.totals` | read | `GET /projects/api/v3/time/total.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.estimatedTotals` | read | `GET /projects/estimatedtime/total.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `time.loggedByPerson` | read | `GET /people/{id}/loggedtime.json` | [v1](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `time.byCompany` | read | `GET /projects/api/v3/companies/time.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.report` | read | `GET /projects/api/v3/time/report.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.reportTotals` | read | `GET /projects/api/v3/time/report/totals.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.reportByType` | read | `GET /projects/api/v3/time/report/{type}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `time.validate` | read | `GET /projects/api/v3/time/validate.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

### timers

| Operation | Risk | Route | Spec |
|---|---|---|---|
| `timers.list` | read | `GET /projects/api/v3/timers.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `timers.listMine` | read | `GET /projects/api/v3/me/timers.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `timers.get` | read | `GET /projects/api/v3/timers/{timerId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `timers.create` | write | `POST /projects/api/v3/me/timers.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `timers.update` | write | `PUT /projects/api/v3/me/timers/{timerId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `timers.pause` | write | `PUT /projects/api/v3/me/timers/{timerId}/pause.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `timers.resume` | write | `PUT /projects/api/v3/me/timers/{timerId}/resume.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `timers.complete` | write | `PUT /projects/api/v3/me/timers/{timerId}/complete.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `timers.delete` | destructive | `DELETE /projects/api/v3/me/timers/{timerId}.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `timers.undelete` | write | `PUT /projects/api/v3/me/timers/{timerId}/undelete.json` | [v3](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

## Left out

Routes in Teamwork's specs that are not operations here, because another operation does the same thing or because they are of no use to an agent.

| Version | Route | Why |
|---|---|---|
| v3 | `GET /projects/api/v3/projects/teamwork/samples.json` | Teamwork's onboarding sample catalog |
| v3 | `GET /projects/api/v3/projects/metrics/owners.json` | a count projects.list can filter for (projectOwnerIds) |
| v3 | `GET /projects/api/v3/projects/metrics/active.json` | a count projects.list returns (meta.page.count) |
| v3 | `GET /projects/api/v3/projects/number.json` | account setting; 404 on the trial site in the 11-16 live run |
| v3 | `PUT /projects/api/v3/projects/number.json` | account setting; its GET 404s on the trial site |
| v1 | `GET /files/{id}/comments/teams.json` | duplicate route of /files/{id}/teams.json; the tasklist one answers 400 live |
| v1 | `GET /links/{id}/comments/teams.json` | duplicate route of /links/{id}/teams.json; the tasklist one answers 400 live |
| v1 | `GET /milestones/{id}/comments/teams.json` | duplicate route of /milestones/{id}/teams.json; the tasklist one answers 400 live |
| v1 | `GET /notebooks/{id}/comments/teams.json` | duplicate route of /notebooks/{id}/teams.json; the tasklist one answers 400 live |
| v1 | `GET /projects/{id}/time/total.json` | duplicate route of /projects/{projectId}/time/total.json; the tasklist one answers 400 live |
| v1 | `GET /tasklists/{id}/comments/teams.json` | duplicate route of /tasklists/{id}/teams.json; the tasklist one answers 400 live |
| v1 | `GET /tasklists/{id}/time/total.json` | duplicate route of /tasklists/{tasklistId}/time/total.json; the tasklist one answers 400 live |
| v1 | `GET /tasks/{id}/comments/teams.json` | duplicate route of /tasks/{id}/teams.json; the tasklist one answers 400 live |
| v1 | `GET /tasks/{id}/time/total.json` | duplicate route of /tasks/{taskId}/time/total.json; the tasklist one answers 400 live |
| v1 | `PUT /comments/{commentId}/react.json` | emoji reactions |
| v1 | `GET /comments/{commentId}/reactions.json` | emoji reactions |
| v1 | `PUT /projects/updates/{updateId}/react.json` | emoji reactions |
| v1 | `GET /projects/updates/{updateId}/reactions.json` | emoji reactions |
| v1 | `PUT /{resource}/{id}/unreact.json` | emoji reactions |
| v1 | `GET /portfolio/boards/{id}/teams.json` | item-level team visibility |
| v1 | `GET /comments/{id}/teams.json` | item-level team visibility; teams.listForProject covers who can see project work |
| v1 | `GET /files/{id}/teams.json` | item-level team visibility; teams.listForProject covers who can see project work |
| v1 | `GET /links/{id}/teams.json` | item-level team visibility; teams.listForProject covers who can see project work |
| v1 | `GET /milestones/{id}/teams.json` | item-level team visibility; teams.listForProject covers who can see project work |
| v1 | `GET /notebooks/{id}/teams.json` | item-level team visibility; teams.listForProject covers who can see project work |
| v1 | `GET /tasklists/{id}/teams.json` | item-level team visibility; teams.listForProject covers who can see project work |
| v1 | `GET /tasks/{id}/teams.json` | item-level team visibility; teams.listForProject covers who can see project work |
| v3 | `POST /projects/api/v3/comments.json` | its body has no field for the item to comment on; comments.create (V1) takes it in the path |
| v3 | `GET /projects/api/v3/links/{linkId}/project.json` | links.get returns the project |
| v3 | `GET /projects/api/v3/milestones/{milestoneId}/project.json` | milestones.get returns projectId |
| v3 | `GET /projects/api/v3/notebooks/{notebookId}/compare.json` | no documented parameter picks the two versions to compare (the spec and the reference list only notebookId) |
| v3 | `GET /projects/api/v3/notebooks/{notebookId}/project.json` | notebooks.get returns projectId |
| v3 | `GET /projects/api/v3/projects/{projectId}/featureorder.json` | order of the tabs in the web UI |
| v3 | `PUT /projects/api/v3/projects/{projectId}/featureorder.json` | order of the tabs in the web UI |
| v3 | `GET /projects/api/v3/files/{fileId}/project.json` | parent-project lookup; files.listForProject lists them by project |
| v3 | `GET /projects/api/v3/reporting/dashboards/data/milestones.json` | reporting dashboard widget data; milestones.list returns the records |
| v3 | `GET /projects/api/v3/reporting/dashboards/details/milestones.json` | reporting dashboard widget data; milestones.list returns the records |
| v1 | `GET /people/APIKeys.json` | returns every user's API key; an agent tool should not hand those out |
| v3 | `POST /projects/api/v3/links/{linkId}/comments.json` | same action as comments.create |
| v1 | `GET /comments.json` | same action as comments.list |
| v3 | `GET /projects/api/v3/links/{linkId}/comments.json` | same action as comments.list |
| v1 | `GET /{resource}/{resourceId}/comments.json` | same action as comments.list |
| v1 | `POST /companies.json` | same action as companies.create |
| v1 | `DELETE /companies/{id}.json` | same action as companies.delete |
| v1 | `GET /companies/{id}.json` | same action as companies.get |
| v1 | `GET /companies.json` | same action as companies.list |
| v1 | `PUT /companies/{id}.json` | same action as companies.update |
| v1 | `GET /milestones/{id}.json` | same action as milestones.get |
| v1 | `GET /milestones.json` | same action as milestones.list |
| v3 | `GET /projects/api/v3/projects/{projectId}/milestones.json` | same action as milestones.list |
| v1 | `GET /projects/{id}/milestones.json` | same action as milestones.list |
| v1 | `POST /projects/{id}/notebooks.json` | same action as notebooks.create |
| v1 | `DELETE /notebooks/{id}.json` | same action as notebooks.delete |
| v1 | `GET /notebooks/{id}.json` | same action as notebooks.get |
| v1 | `GET /notebookCategories/{id}/notebooks.json` | same action as notebooks.list |
| v1 | `GET /notebooks.json` | same action as notebooks.list |
| v1 | `GET /projects/{id}/notebooks.json` | same action as notebooks.list |
| v1 | `PUT /notebooks/{id}.json` | same action as notebooks.update |
| v1 | `DELETE /people/{id}.json` | same action as people.delete |
| v1 | `GET /people/{id}.json` | same action as people.get |
| v1 | `GET /companies/{id}/people.json` | same action as people.list |
| v1 | `GET /people.json` | same action as people.list |
| v1 | `GET /me.json` | same action as people.me |
| v1 | `POST /projects/{projectId}/people/{personId}.json` | same action as projectPeople.add |
| v1 | `GET /projects/{projectId}/people.json` | same action as projectPeople.list |
| v2 | `GET /projects/api/v2/projects/templates.json` | same action as projectTemplates.list |
| v3 | `GET /projects/api/v3/projects/{projectIds}/updates.json` | same action as projectUpdates.list |
| v1 | `GET /projects/{projectId}/update.json` | same action as projectUpdates.list |
| v1 | `GET /projects/{projectId}/updates.json` | same action as projectUpdates.list |
| v2 | `GET /projects/api/v2/projects/{projectId}.json` | same action as projects.get |
| v1 | `GET /projects/{id}.json` | same action as projects.get |
| v1 | `GET /companies/{id}/projects.json` | same action as projects.list |
| v1 | `GET /projects.json` | same action as projects.list |
| v2 | `GET /projects/api/v2/projects.json` | same action as projects.list |
| v1 | `GET /projects/starred.json` | same action as projects.listStarred |
| v1 | `PUT /projects/{projectId}.json` | same action as projects.update |
| v1 | `DELETE /me/status/{id}.json` | same action as statuses.delete |
| v1 | `DELETE /people/{personId}/status/{statusId}.json` | same action as statuses.delete |
| v1 | `GET /statuses.json` | same action as statuses.list |
| v1 | `PUT /me/status/id.json` | same action as statuses.update |
| v1 | `PUT /people/{personId}/status/{statusId}.json` | same action as statuses.update |
| v1 | `POST /tasks/{id}/reminders.json` | same action as taskReminders.create |
| v1 | `DELETE /taskreminders/{id}.json` | same action as taskReminders.delete |
| v1 | `GET /tasks/{id}/reminders.json` | same action as taskReminders.list |
| v1 | `PUT /taskreminders/{id}.json` | same action as taskReminders.update |
| v3 | `DELETE /projects/api/v3/tasklists/{tasklistId}.json` | same action as tasklists.delete (the V3 route answers 404 live) |
| v1 | `GET /tasklists/{id}.json` | same action as tasklists.get |
| v3 | `GET /projects/api/v3/projects/{projectId}/tasklists.json` | same action as tasklists.list |
| v1 | `GET /projects/{id}/tasklists.json` | same action as tasklists.list |
| v1 | `GET /tasklists.json` | same action as tasklists.list |
| v1 | `GET /tasklists/templates.json` | same action as tasklists.listTemplates |
| v3 | `POST /projects/api/v3/taskgroups/{taskgroupId}/tasks.json` | same action as tasks.create |
| v1 | `POST /projects/{id}/tasks.json` | same action as tasks.create |
| v1 | `POST /tasklists/{id}/tasks.json` | same action as tasks.create |
| v1 | `POST /tasks/{id}.json` | same action as tasks.createSubtask |
| v1 | `GET /tasks/{id}.json` | same action as tasks.get |
| v1 | `GET /completedtasks.json` | same action as tasks.list |
| v1 | `GET /projectCategories/{categoryId}/tasks.json` | same action as tasks.list |
| v2 | `GET /projects/api/v2/projects/{id}/taskids.json` | same action as tasks.list |
| v2 | `GET /projects/api/v2/tasklists/{id}/taskids.json` | same action as tasks.list |
| v2 | `GET /projects/api/v2/tasks.json` | same action as tasks.list |
| v2 | `GET /projects/api/v2/tasks/{taskId}.json` | same action as tasks.list |
| v3 | `GET /projects/api/v3/projects/{projectId}/tasks.json` | same action as tasks.list |
| v3 | `GET /projects/api/v3/taskgroups/{taskgroupId}/tasks.json` | same action as tasks.list |
| v3 | `GET /projects/api/v3/tasklists/{tasklistId}/tasks.json` | same action as tasks.list |
| v3 | `GET /projects/api/v3/tasks/{taskId}/subtasks.json` | same action as tasks.list |
| v1 | `GET /projects/{id}/tasks.json` | same action as tasks.list |
| v1 | `GET /tasklists/{id}/tasks.json` | same action as tasks.list |
| v1 | `GET /tasks.json` | same action as tasks.list |
| v1 | `GET /tasks/{parentTaskId}/subtasks.json` | same action as tasks.list |
| v3 | `PUT /projects/api/v3/tasks/{taskId}.json` | same action as tasks.update |
| v1 | `DELETE /teams.json` | same action as teams.delete, for several ids |
| v3 | `GET /projects/api/v3/reporting/precanned/companytime.json` | same action as time.byCompany |
| v1 | `POST /projects/{id}/time_entries.json` | same action as time.create |
| v1 | `POST /tasks/{id}/time_entries.json` | same action as time.createForTask |
| v1 | `DELETE /time_entries/{id}.json` | same action as time.delete |
| v1 | `GET /time_entries/{id}.json` | same action as time.get |
| v3 | `GET /projects/api/v3/allocations/{allocationId}/time.json` | same action as time.list |
| v3 | `GET /projects/api/v3/projects/{projectId}/time.json` | same action as time.list |
| v3 | `GET /projects/api/v3/tasks/{taskId}/time.json` | same action as time.list |
| v1 | `GET /projects/{id}/time_entries.json` | same action as time.list |
| v1 | `GET /tasks/{id}/time_entries.json` | same action as time.list |
| v1 | `GET /time_entries.json` | same action as time.list |
| v1 | `GET /projects/time/total.json` | same action as time.totals |
| v1 | `GET /time/total.json` | same action as time.totals |
| v3 | `GET /projects/api/v3/projects/{projectId}/time/total.json` | same action as time.totals with projectIds |
| v3 | `GET /projects/api/v3/tasks/{taskId}/time/total.json` | same action as time.totals with taskIds |
| v3 | `GET /projects/api/v3/tasklists/{tasklistId}/time/total.json` | same action as time.totals with tasklistIds |
| v3 | `PUT /projects/api/v3/time/{timelogId}.json` | same action as time.update |
| v1 | `PUT /time_entries/{id}.json` | same action as time.update |
| v1 | `GET /people/{id}/timers.json` | same action as timers.list |
| v1 | `GET /timers.json` | same action as timers.list |
| v1 | `GET /me/timers.json` | same action as timers.listMine |
| v3 | `GET /projects/api/v3/tasklists/{tasklistId}/project.json` | tasklists.get returns projectId |
| v3 | `GET /projects/api/v3/tasks/{taskId}/project.json` | tasks.get returns projectId |
| v1 | `GET /calendarevents/{eventId}/availablePeople.json` | who can be notified on an item = the people on the project (projectPeople.list) |
| v1 | `GET /projects/{projectId}/files/availablepeople.json` | who can be notified on an item = the people on the project (projectPeople.list) |
| v1 | `GET /projects/{projectId}/links/availablepeople.json` | who can be notified on an item = the people on the project (projectPeople.list) |
| v1 | `GET /projects/{projectId}/messages/availablepeople.json` | who can be notified on an item = the people on the project (projectPeople.list) |
| v1 | `GET /projects/{projectId}/milestones/availablepeople.json` | who can be notified on an item = the people on the project (projectPeople.list) |
| v1 | `GET /projects/{projectId}/notebooks/availablepeople.json` | who can be notified on an item = the people on the project (projectPeople.list) |
| v1 | `GET /projects/{projectId}/tasks/availablepeople.json` | who can be notified on an item = the people on the project (projectPeople.list) |

## Unsupported documented routes

These operations were excluded because their published contract is multipart/binary, returns binary files, or omits a usable success schema. No routes are guessed or substituted.

| Version | HTTP method and route | Reason |
|---|---|---|
| v1 | `PUT /projects/{id}/unstar.json` | success response schema is undocumented |
| v1 | `PUT /tasks/{id}.json` | success response schema is undocumented |
| v1 | `DELETE /tasks/{id}.json` | success response schema is undocumented |
| v1 | `GET /tasks/{id}/followers.json` | success response schema is undocumented |
| v1 | `PUT /tasks/{taskId}.json#merge` | OpenAPI route contains a fragment marker, so the actual request path is unverified |
| v1 | `POST /projects/{id}/people.json#merge` | OpenAPI route contains a fragment marker, so the actual request path is unverified |
| v1 | `PUT /projects/{id}/people.json#merge` | OpenAPI route contains a fragment marker, so the actual request path is unverified |
| v1 | `POST /me/status.json` | success response schema is undocumented |
| v1 | `GET /files/{id}.json` | success response schema is undocumented |
| v1 | `PUT /files/{id}/move.json` | success response schema is undocumented |
| v1 | `PUT /linkCategories/{id}.json` | success response schema is undocumented |
| v1 | `GET /comments/{commentId}.json#merge` | OpenAPI route contains a fragment marker, so the actual request path is unverified |
| v1 | `POST /boards/columns/{id}/cards.json` | success response schema is undocumented |
| v1 | `GET /portfolio/boards/{boardId}.json` | success response schema is undocumented |
| v1 | `PUT /portfolio/columns/{columnId}.json` | success response schema is undocumented |
| v1 | `POST /pendingfiles.json` | provider documentation describes multipart file upload, which the published JSON body schema does not model |
| v1 | `PUT /projects/api/v1/pendingfiles/presignedurl.json` | success response schema is undocumented |
| v1 | `POST /projects/{id}/roles.json` | success response schema is undocumented |
| v1 | `PUT /projects/{projectId}/people/{id}.json#merge` | OpenAPI route contains a fragment marker, so the actual request path is unverified |
| v1 | `GET /v/2/tasks/{id}/comments.json` | success response schema is undocumented |
| v1 | `PUT /projects/{TemplateID}.json#merge` | OpenAPI route contains a fragment marker, so the actual request path is unverified |
| v1 | `DELETE /projects/{TemplateID}.json#merge` | OpenAPI route contains a fragment marker, so the actual request path is unverified |
| v3 | `PUT /projects/api/v3/notebooks/{notebookId}/lock.json` | success response schema is undocumented |
| v3 | `PUT /projects/api/v3/notebooks/{notebookId}/unlock.json` | success response schema is undocumented |
| v3 | `PUT /projects/api/v3/projects/templates/{id}/customfields/required.json` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/projects/{projectId}/tasklists.csv` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/projects/{projectId}/tasklists.html` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/projects/{projectId}/tasklists.pdf` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/projects/{projectId}/tasklists.xlsx` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/health/projects.csv` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/health/projects.html` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/health/projects.pdf` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/health/projects.xlsx` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/plannedvsactual/milestones.csv` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/plannedvsactual/milestones.html` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/plannedvsactual/milestones.pdf` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/plannedvsactual/milestones.xlsx` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/plannedvsactual/tasks.csv` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/plannedvsactual/tasks.html` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/plannedvsactual/tasks.pdf` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/plannedvsactual/tasks.xlsx` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/utilization.csv` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/utilization.html` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/utilization.pdf` | success response schema is undocumented |
| v3 | `GET /projects/api/v3/reporting/precanned/utilization.xlsx` | success response schema is undocumented |

Webhooks are not included. File upload/download flows and binary report downloads are excluded because Corsair's JSON transport does not preserve binary bodies.

## Testing

`pnpm --dir packages/teamwork test` runs the local contract suite. Set `TEAMWORK_API_KEY` and `TEAMWORK_SITE_NAME` and run `pnpm --dir packages/teamwork test:live` for the read-only authenticated account-profile smoke test.
