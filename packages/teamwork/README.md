# @corsair-dev/teamwork

Teamwork.com API integration for Corsair, with 362 documented JSON operations validated against the provider's published OpenAPI contracts.

## Install

```sh
pnpm add @corsair-dev/teamwork
```

## Configure

```ts
import { teamwork } from '@corsair-dev/teamwork';

const plugin = teamwork();
```

Store the Teamwork API key and that tenant's site subdomain as `tenant_external_id` through Corsair's API-key credential flow. Teamwork uses HTTP Basic authentication with the API key as the username and an empty password, over HTTPS. The optional `siteName` plugin option is a global override intended for a single Teamwork site; full `.teamwork.com` hostnames are also accepted. Custom API hosts are not supported.

## Operation input shape

Each operation is available by its stable operation ID under `teamwork.api`. Supply path variables, query parameters, and a request body in separate fields; absent path and query maps default to empty objects.

```ts
await corsair.teamwork.api.v3_get_projects_api_v3_projects_json({
  path: {},
  query: { page: 1, pageSize: 50 },
});

```

All operation input objects are strict. Inputs and documented success responses are validated with Zod; the registry includes create, update, completion, move, delete, timer, file metadata, notebook, link, comment, board, and time-tracking operations where the provider documents a JSON contract.

## Authentication, versions, and pagination

The official docs recommend V3 where available. The integration includes documented V1 operations that have no corresponding V3 contract in the selected domains, and eight V2 operations retained for documented task IDs, predecessors, custom fields, and templates. Every route uses the tenant host and the exact versioned path from Teamwork's OpenAPI documents.

V3 requests expose the documented `page` and `pageSize` query fields (50 default, usually up to 500 records per page). V3 list responses retain Teamwork's `meta.page` fields, including `pageOffset`, `pageSize`, and `hasMore`. The provider documents a 50,000-record request cap and recommends `updatedAfter` for continuation on large task/time collections. V1 pagination uses `page`/`pageSize`; Teamwork documents `x-page`, `x-pages`, and `x-records` response headers, which Corsair's current JSON transport does not expose.

Array query parameters follow the collection format in the OpenAPI contract; Swagger's default CSV format is serialized as comma-separated values, while explicitly documented `multi` parameters remain repeated keys.

When a V3 response supports field projection, `fields[projects]` selection also adjusts response validation: selected project fields are required and omitted fields remain optional. Project output types reflect that sparse response shape.

V3 task create/update inputs accept Teamwork's official examples, including plain numeric assignee arrays, string priorities, descriptions, and custom-field arrays. Known fields are still validated and unknown fields are rejected.

V3 task create operations require `task.name`; update operations accept partial task fields.

Teamwork's published API guide and OpenAPI documents do not specify a numeric rate quota or a documented rate-limit window. Corsair's HTTP transport handles HTTP 429 responses and honors `Retry-After`; plugin handlers do not add a second retry loop. Writes are not retried on server or network failures.

## API operation inventory

The package covers these resource tags: Boards (10), Comments (10), Companies (16), Custom Fields (4), File Categories (5), Files (9), Link Categories (4), LinkItems (3), Links (6), Milestones (15), Notebook Categories (5), Notebooks (21), People (29), People Status (10), PeopleStatus (2), Permissions (2), Portfolio boards (13), Project Categories (6), Project Owner (1), Project Roles (5), Project Templates (2), Project Updates (6), Projects (30), ProjectUpdates (2), Reactions (5), Task lists (10), Task Reminders (4), Tasklists (2), TaskLists (4), TaskReminders (4), Tasks (41), Teams (27), Time Tracking (19), TimeTracking (30). The provider may retain legacy operations; V3 is preferred when the docs offer an equivalent.

| Operation ID | Risk | HTTP method and route | Provider operation | Reference |
|---|---|---|---|---|
| `v1_get_projects_json` | read | `GET /projects.json` | Retrieve All Projects | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_json` | write | `POST /projects.json` | Create Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_json` | read | `GET /projects/{id}.json` | Retrieve a Single Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_projects_id_json` | write | `PUT /projects/{id}.json` | Update Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_projects_id_json` | destructive | `DELETE /projects/{id}.json` | Delete Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_clone_json` | write | `POST /projects/{id}/clone.json` | Copy a project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_companies_id_projects_json` | read | `GET /companies/{id}/projects.json` | Retrieve Projects assigned to a specific Company | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_starred_json` | read | `GET /projects/starred.json` | Retrieve your Starred Projects | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_rates_json` | read | `GET /projects/{id}/rates.json` | Get Project Rates | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_rates_json` | write | `POST /projects/{id}/rates.json` | Set Project Rates | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_stats_json` | read | `GET /projects/{id}/stats.json` | Get Project Stats | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_projects_id_star_json` | write | `PUT /projects/{id}/star.json` | Star a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projectcategories_json` | read | `GET /projectCategories.json` | Retrieving all of a Project Categories | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projectcategories_json` | write | `POST /projectCategories.json` | Creating Project Categories | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projectcategories_id_json` | read | `GET /projectCategories/{id}.json` | Retrieve a Single Project Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_projectcategories_id_json` | write | `PUT /projectCategories/{id}.json` | Updating a Project Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_projectcategories_id_json` | destructive | `DELETE /projectCategories/{id}.json` | Deleting a Project Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projectcategories_categoryid_tasks_json` | read | `GET /projectCategories/{categoryId}/tasks.json` | Retrieving Tasks associated with the Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_projects_projectid_json` | write | `PUT /projects/{projectId}.json` | Setting a Project Owner | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_milestones_json` | read | `GET /milestones.json` | List All Milestones | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_milestones_json` | read | `GET /projects/{id}/milestones.json` | List Milestones on a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_milestones_json` | write | `POST /projects/{id}/milestones.json` | Create a Single Milestone | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_milestones_id_json` | read | `GET /milestones/{id}.json` | Get a Single Milestone | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_milestones_id_json` | write | `PUT /milestones/{id}.json` | Update a Single Milestone | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_milestones_id_json` | destructive | `DELETE /milestones/{id}.json` | Delete a Milestone | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_milestones_id_complete_json` | write | `PUT /milestones/{id}/complete.json` | Complete a Milestone | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_milestones_id_uncomplete_json` | write | `PUT /milestones/{id}/uncomplete.json` | Un-complete a Milestone | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasklists_json` | read | `GET /tasklists.json` | Get all Task Lists | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_tasklists_json` | read | `GET /projects/{id}/tasklists.json` | Get all Task Lists for a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_tasklists_json` | write | `POST /projects/{id}/tasklists.json` | Create Task List | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasklists_id_json` | read | `GET /tasklists/{id}.json` | Retrieve Single Task List | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_tasklists_id_json` | write | `PUT /tasklists/{id}.json` | Update Task List | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_tasklists_id_json` | destructive | `DELETE /tasklists/{id}.json` | Delete a Task List | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasklists_templates_json` | read | `GET /tasklists/templates.json` | Template Task Lists: get all template task lists | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_projects_id_tasklists_reorder_json` | write | `PUT /projects/{id}/tasklists/reorder.json` | Reorder Lists | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_tasklist_id_copy_json` | write | `PUT /tasklist/{id}/copy.json` | Copy a Task List, or Copy a Task List to another Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_tasklist_id_move_json` | write | `PUT /tasklist/{id}/move.json` | Move a Task List to another Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_json` | read | `GET /tasks.json` | Get all Tasks across all Projects | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_tasks_json` | read | `GET /projects/{id}/tasks.json` | Get all Tasks on a given Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_tasks_json` | write | `POST /projects/{id}/tasks.json` | Create a Task on a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasklists_id_tasks_json` | read | `GET /tasklists/{id}/tasks.json` | Get all Tasks on a given Task List | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_tasklists_id_tasks_json` | write | `POST /tasklists/{id}/tasks.json` | Create a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_id_json` | read | `GET /tasks/{id}.json` | Retrieve a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_tasks_id_json` | write | `POST /tasks/{id}.json` | Create a Sub Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_id_dependencies_json` | read | `GET /tasks/{id}/dependencies.json` | Retrieve Task Dependencies | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_completedtasks_json` | read | `GET /completedtasks.json` | Get completed Tasks | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_id_predecessors_json` | read | `GET /tasks/{id}/predecessors.json` | Get Task Predecessors | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_parenttaskid_subtasks_json` | read | `GET /tasks/{parentTaskId}/subtasks.json` | Get Sub Tasks of a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_taskid_recurring_json` | read | `GET /tasks/{taskId}/recurring.json` | Get Recurring Tasks related to original Task. | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_tasks_id_quickadd_json` | write | `POST /tasks/{id}/quickadd.json` | Quickly add multiple Sub Tasks | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_projectid_tasks_quickadd_json` | write | `POST /projects/{projectId}/tasks/quickadd.json` | Quickly add multiple Tasks | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_tasks_id_complete_json` | write | `PUT /tasks/{id}/complete.json` | Mark a Task complete | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_tasks_id_uncomplete_json` | write | `PUT /tasks/{id}/uncomplete.json` | Mark a Task uncomplete | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_tasklists_id_tasks_reorder_json` | write | `PUT /tasklists/{id}/tasks/reorder.json` | Reorder the Tasks | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_tasks_taskid_move_json` | write | `PUT /tasks/{taskId}/move.json` | Move a Task from one Project to Another | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_tasks_taskid_copy_json` | write | `PUT /tasks/{taskId}/copy.json` | Copy a Task from one Project to Another | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_id_reminders_json` | read | `GET /tasks/{id}/reminders.json` | Get all Reminders on a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_tasks_id_reminders_json` | write | `POST /tasks/{id}/reminders.json` | Create a Reminder on a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_taskreminders_id_json` | write | `PUT /taskreminders/{id}.json` | Update an Existing Reminder on a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_taskreminders_id_json` | destructive | `DELETE /taskreminders/{id}.json` | Delete an existing reminder on a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_companies_json` | read | `GET /companies.json` | Retrieve Companies | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_companies_json` | write | `POST /companies.json` | Create A Company | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_companies_json` | read | `GET /projects/{id}/companies.json` | Retrieving Companies within a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_companies_id_json` | read | `GET /companies/{id}.json` | Retrieve a Single Company | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_companies_id_json` | write | `PUT /companies/{id}.json` | Update A Company | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_companies_id_json` | destructive | `DELETE /companies/{id}.json` | Delete A Company | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_people_json` | read | `GET /people.json` | Get All People | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_people_json` | write | `POST /people.json` | Creates a new User Account | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_calendarevents_eventid_availablepeople_json` | read | `GET /calendarevents/{eventId}/availablePeople.json` | Get available People for a Calendar Event | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_projectid_messages_availablepeople_json` | read | `GET /projects/{projectId}/messages/availablepeople.json` | Get available People for a Message | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_projectid_milestones_availablepeople_json` | read | `GET /projects/{projectId}/milestones/availablepeople.json` | Get available People for a Milestone | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_projectid_notebooks_availablepeople_json` | read | `GET /projects/{projectId}/notebooks/availablepeople.json` | Get available People for following a Notebook | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_projectid_tasks_availablepeople_json` | read | `GET /projects/{projectId}/tasks/availablepeople.json` | Get available People for a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_projectid_files_availablepeople_json` | read | `GET /projects/{projectId}/files/availablepeople.json` | Get available People to notify when adding a File | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_projectid_links_availablepeople_json` | read | `GET /projects/{projectId}/links/availablepeople.json` | Get available People to notify when adding a Link | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_projectid_people_json` | read | `GET /projects/{projectId}/people.json` | Get all People (within a Project) | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_companies_id_people_json` | read | `GET /companies/{id}/people.json` | Get People (within a Company) | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_me_json` | read | `GET /me.json` | Get Current User Details | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_stats_json` | read | `GET /stats.json` | Current User Summary Stats | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_people_id_json` | read | `GET /people/{id}.json` | Retrieve a Specific Person | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_people_id_json` | write | `PUT /people/{id}.json` | Editing a User | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_people_id_json` | destructive | `DELETE /people/{id}.json` | Delete User | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_people_apikeys_json` | read | `GET /people/APIKeys.json` | Retrieve all API Keys for all People on account | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_people_deleted_json` | read | `GET /people/deleted.json` | Get all deleted People | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_statuses_json` | read | `GET /statuses.json` | Retrieve all Statuses | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_people_id_status_json` | read | `GET /people/{id}/status.json` | Retrieve a Persons Status | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_people_id_status_json` | write | `POST /people/{id}/status.json` | Create a User Status | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_me_status_json` | read | `GET /me/status.json` | Retrieve my Status | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_me_status_id_json` | write | `PUT /me/status/id.json` | Update my Status | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_people_personid_status_statusid_json` | write | `PUT /people/{personId}/status/{statusId}.json` | Update User Status | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_people_personid_status_statusid_json` | destructive | `DELETE /people/{personId}/status/{statusId}.json` | Delete a User Status | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_people_status_id_json` | write | `PUT /people/status/{id}.json` | Update Status | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_people_status_id_json` | destructive | `DELETE /people/status/{id}.json` | Delete a Status | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_me_status_id_json` | destructive | `DELETE /me/status/{id}.json` | Delete my Status | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_id_files_json` | read | `GET /tasks/{id}/files.json` | List Files on a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_tasks_id_files_json` | write | `POST /tasks/{id}/files.json` | Add a File to a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_files_json` | read | `GET /projects/{id}/files.json` | List Files on a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_files_json` | write | `POST /projects/{id}/files.json` | Add a File to a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_files_id_json` | write | `POST /files/{id}.json` | Add a new File Version to a File | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_files_id_json` | destructive | `DELETE /files/{id}.json` | Delete a File from a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_files_id_sharedlink_json` | read | `GET /files/{id}/sharedlink.json` | Get a short URL for sharing a File | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_files_id_copy_json` | write | `PUT /files/{id}/copy.json` | Copy a File to another Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_filecategories_json` | read | `GET /projects/{id}/fileCategories.json` | Retrieving all of a File Categories | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_filecategories_json` | write | `POST /projects/{id}/fileCategories.json` | Creating File Categories | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_filecategories_id_json` | read | `GET /fileCategories/{id}.json` | Retrieve a Single File Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_filecategories_id_json` | write | `PUT /fileCategories/{id}.json` | Updating a File Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_filecategories_id_json` | destructive | `DELETE /fileCategories/{id}.json` | Deleting a File Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_notebooks_json` | read | `GET /notebooks.json` | List All Notebooks | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_notebooks_json` | read | `GET /projects/{id}/notebooks.json` | List Notebooks on a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_notebooks_json` | write | `POST /projects/{id}/notebooks.json` | Create a Single Notebook | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_notebookcategories_id_notebooks_json` | read | `GET /notebookCategories/{id}/notebooks.json` | List Notebooks in a Specific Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_notebooks_id_json` | read | `GET /notebooks/{id}.json` | Get a Single Notebook | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_notebooks_id_json` | write | `PUT /notebooks/{id}.json` | Update a Single Notebook | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_notebooks_id_json` | destructive | `DELETE /notebooks/{id}.json` | Delete a Single Notebook | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_notebooks_id_lock_json` | write | `PUT /notebooks/{id}/lock.json` | Lock a Single Notebook for Editing | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_notebooks_id_unlock_json` | write | `PUT /notebooks/{id}/unlock.json` | Unlock a Single Notebook | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_notebooks_id_copy_json` | write | `PUT /notebooks/{id}/copy.json` | Copy a Notebook to another Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_notebooks_id_move_json` | write | `PUT /notebooks/{id}/move.json` | Move a Notebook to another Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_notebookcategories_json` | read | `GET /projects/{id}/notebookCategories.json` | Retrieving all of a Notebook Categories | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_notebookcategories_json` | write | `POST /projects/{id}/notebookCategories.json` | Creating Notebook Categories | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_notebookcategories_id_json` | read | `GET /notebookCategories/{id}.json` | Retrieve a Single Notebook Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_notebookcategories_id_json` | write | `PUT /notebookCategories/{id}.json` | Updating a Notebook Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_notebookcategories_id_json` | destructive | `DELETE /notebookCategories/{id}.json` | Deleting a Notebook Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_links_json` | read | `GET /projects/{id}/links.json` | List Links on a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_links_json` | write | `POST /projects/{id}/links.json` | Create a Single Link | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_links_json` | read | `GET /links.json` | List All Links | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_links_id_json` | read | `GET /links/{id}.json` | Get a Single Link | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_links_id_json` | write | `PUT /links/{id}.json` | Update a Single Link | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_links_id_json` | destructive | `DELETE /links/{id}.json` | Delete a Single Link | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_linkcategories_json` | read | `GET /projects/{id}/linkCategories.json` | Retrieving all of a Link Categories | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_linkcategories_json` | write | `POST /projects/{id}/linkCategories.json` | Creating Link Categories | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_linkcategories_id_json` | read | `GET /linkCategories/{id}.json` | Retrieve a Single Link Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_linkcategories_id_json` | destructive | `DELETE /linkCategories/{id}.json` | Deleting a Link Category | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_time_entries_json` | read | `GET /time_entries.json` | Retrieve all Time Entries across all Projects | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_time_entries_json` | read | `GET /projects/{id}/time_entries.json` | Retrieve all Time Entries for a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_time_entries_json` | write | `POST /projects/{id}/time_entries.json` | Create a Time-Entry | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_id_time_entries_json` | read | `GET /tasks/{id}/time_entries.json` | Retrieve all Task times | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_tasks_id_time_entries_json` | write | `POST /tasks/{id}/time_entries.json` | Create a Time-Entry (for a Task) | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_time_entries_id_json` | read | `GET /time_entries/{id}.json` | Retrieve single Time-Entry | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_time_entries_id_json` | write | `PUT /time_entries/{id}.json` | Update a Time Entry | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_time_entries_id_json` | destructive | `DELETE /time_entries/{id}.json` | Delete a Time-Entry | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_time_total_json` | read | `GET /projects/{id}/time/total.json` | Time Totals on a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_time_total_json` | read | `GET /time/total.json` | Get Total Time across an Account | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_time_total_json` | read | `GET /projects/time/total.json` | Time Totals across Projects | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_estimatedtime_total_json` | read | `GET /projects/estimatedtime/total.json.` | Estimated Time Totals on Projects | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasklists_id_time_total_json` | read | `GET /tasklists/{id}/time/total.json` | Total Time on a Tasklist | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_id_time_total_json` | read | `GET /tasks/{id}/time/total.json` | Total Time on a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_people_id_loggedtime_json` | read | `GET /people/{id}/loggedtime.json` | Get Logged Time by Person | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_timers_json` | read | `GET /timers.json` | Get all Running Timers | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_me_timers_json` | read | `GET /me/timers.json` | Get all your Running Timers | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_people_id_timers_json` | read | `GET /people/{id}/timers.json` | Get all Running Timers for a specific Person | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_tasks_id_estimatedtime_json` | write | `PUT /tasks/{id}/estimatedtime.json` | Add a Time estimate to a Task | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_comments_id_json` | destructive | `DELETE /comments/{id}.json` | Deleting a Comment | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_comments_id_json` | write | `PUT /comments/{id}.json` | Updating a Comment | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_resource_resourceid_comments_json` | read | `GET /{resource}/{resourceId}/comments.json` | Retrieving Recent Comments | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_resource_resourceid_comments_json` | write | `POST /{resource}/{resourceId}/comments.json` | Creating a Comment | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_comments_json` | read | `GET /comments.json` | Retrieving Comments across all types | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_comments_id_markread_json` | write | `PUT /comments/{id}/markread.json` | Mark a Comment as Read | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_boards_columns_json` | read | `GET /projects/{id}/boards/columns.json` | List Columns | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_boards_columns_json` | write | `POST /projects/{id}/boards/columns.json` | Create a new Column | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_boards_columns_id_cards_json` | read | `GET /boards/columns/{id}/cards.json` | List Cards in a Column | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_boards_columns_cards_id_move_json` | write | `PUT /boards/columns/cards/{id}/move.json` | Move a Card | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_boards_columns_cards_id_json` | write | `PUT /boards/columns/cards/{id}.json` | Edit a Card | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_boards_columns_cards_id_json` | destructive | `DELETE /boards/columns/cards/{id}.json` | Remove a Card | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_boards_columns_cards_id_json` | read | `GET /boards/columns/cards/{id}.json` | Get a Card  | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_boards_columns_id_json` | destructive | `DELETE /boards/columns/{id}.json` | Delete a Column | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_boards_columns_id_json` | write | `PUT /boards/columns/{id}.json` | Edit a Column | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_boards_columns_id_json` | read | `GET /boards/columns/{id}.json` | Get a Column | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_portfolio_boards_json` | read | `GET /portfolio/boards.json` | Boards in Portfolio View | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_portfolio_boards_json` | write | `POST /portfolio/boards.json` | Create a new Board | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_portfolio_boards_boardid_json` | write | `PUT /portfolio/boards/{boardId}.json` | Edit a Board | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_portfolio_boards_boardid_json` | destructive | `DELETE /portfolio/boards/{boardId}.json` | Delete a board | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_portfolio_boards_boardid_columns_json` | read | `GET /portfolio/boards/{boardId}/columns.json` | Columns inside a Portfolio Board | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_portfolio_boards_boardid_columns_json` | write | `POST /portfolio/boards/{boardId}/columns.json` | Add a column to the given Board | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_portfolio_columns_columnid_cards_json` | read | `GET /portfolio/columns/{columnId}/cards.json` | Get Cards inside a Portfolio Column | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_portfolio_columns_columnid_cards_json` | write | `POST /portfolio/columns/{columnId}/cards.json` | Adding a Project to a Column from Backlog | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_portfolio_cards_cardid_json` | read | `GET /portfolio/cards/{cardId}.json` | Get a specific Card inside a Column | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_portfolio_cards_cardid_json` | destructive | `DELETE /portfolio/cards/{cardId}.json` | Delete a Card in a Portfolio Column | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_portfolio_cards_cardid_move_json` | write | `PUT /portfolio/cards/{cardId}/move.json` | Move Projects on a Portfolio Board | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_portfolio_columns_columnid_json` | destructive | `DELETE /portfolio/columns/{columnId}.json` | Delete a Portfolio Column | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_portfolio_columns_columnid_json` | read | `GET /portfolio/columns/{columnId}.json` | Get a Portfolio Column | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_projectid_updates_json` | read | `GET /projects/{projectId}/updates.json` | Get Project Updates | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_projectid_update_json` | read | `GET /projects/{projectId}/update.json` | Get most recent Update | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_projectid_update_json` | write | `POST /projects/{projectId}/update.json` | Create a Project Update | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_projects_updates_updateid_json` | write | `PUT /projects/updates/{updateId}.json` | Modify a Project Update | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_projects_updates_updateid_json` | destructive | `DELETE /projects/updates/{updateId}.json` | Delete a Project Update | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_projects_projectid_update_request_json` | destructive | `PUT /projects/{projectId}/update/request.json` | Requesting a Project Update from a Project Owner | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_projectid_people_personid_json` | write | `POST /projects/{projectId}/people/{personId}.json` | Add a New User to a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_projects_projectid_people_personid_json` | destructive | `PUT /projects/{projectId}/people/{personId}.json` | Remove a User from a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_projectid_people_personid_json` | read | `GET /projects/{projectId}/people/{personId}.json` | Get a Users Permissions on a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_roles_json` | read | `GET /projects/{id}/roles.json` | List Roles on a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_roles_id_json` | read | `GET /roles/{id}.json` | Get an Individual Role | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_roles_id_json` | write | `PUT /roles/{id}.json` | Update a Role on a Project | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_roles_id_json` | destructive | `DELETE /roles/{id}.json` | Delete a Role | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_comments_commentid_reactions_json` | read | `GET /comments/{commentId}/reactions.json` | Get Reactions on a specific Comment | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_updates_updateid_reactions_json` | read | `GET /projects/updates/{updateId}/reactions.json` | Get Reactions to a Project Update | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_comments_commentid_react_json` | write | `PUT /comments/{commentId}/react.json` | React to a Comment | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_projects_updates_updateid_react_json` | write | `PUT /projects/updates/{updateId}/react.json` | React to a Project Update | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_resource_id_unreact_json` | write | `PUT /{resource}/{id}/unreact.json` | Unreacting to a Comment/Message/ProjectUpdate | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_template_json` | write | `POST /projects/template.json` | Create a Project Template | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_teams_json` | read | `GET /teams.json` | Get All Teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_teams_json` | write | `POST /teams.json` | Creates a new Team | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_teams_json` | destructive | `DELETE /teams.json` | Delete teams in bulk | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_teams_id_json` | read | `GET /teams/{id}.json` | Returns a single team identified by it's ID | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_teams_id_json` | write | `PUT /teams/{id}.json` | Updates a team | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_delete_teams_id_json` | destructive | `DELETE /teams/{id}.json` | Delete a team by id | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_put_teams_id_people_json` | write | `PUT /teams/{id}/people.json` | Add or replace members of a team | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_projects_id_teams_json` | read | `GET /projects/{id}/teams.json` | Get a project's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_post_projects_id_teams_json` | write | `POST /projects/{id}/teams.json` | Creates a new Project-Specific Team | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_companies_id_teams_json` | read | `GET /companies/{id}/teams.json` | Get Teams for company id | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_milestones_id_teams_json` | read | `GET /milestones/{id}/teams.json` | Get a milestone's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_notebooks_id_teams_json` | read | `GET /notebooks/{id}/teams.json` | Get a notebook's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_id_teams_json` | read | `GET /tasks/{id}/teams.json` | Get a task's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_files_id_teams_json` | read | `GET /files/{id}/teams.json` | Get a file's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasklists_id_teams_json` | read | `GET /tasklists/{id}/teams.json` | Get a tasklist's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_links_id_teams_json` | read | `GET /links/{id}/teams.json` | Get a link's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_portfolio_boards_id_teams_json` | read | `GET /portfolio/boards/{id}/teams.json` | Get a portfolio board's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_comments_id_teams_json` | read | `GET /comments/{id}/teams.json` | Get a comment's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_teams_id_subteams_json` | read | `GET /teams/{id}/subteams.json` | Get a team's subteams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_people_id_teams_json` | read | `GET /people/{id}/teams.json` | Get a person's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_milestones_id_comments_teams_json` | read | `GET /milestones/{id}/comments/teams.json` | Get a milestone's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_notebooks_id_comments_teams_json` | read | `GET /notebooks/{id}/comments/teams.json` | Get a notebook's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasks_id_comments_teams_json` | read | `GET /tasks/{id}/comments/teams.json` | Get a task's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_files_id_comments_teams_json` | read | `GET /files/{id}/comments/teams.json` | Get a file's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_tasklists_id_comments_teams_json` | read | `GET /tasklists/{id}/comments/teams.json` | Get a tasklist's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_links_id_comments_teams_json` | read | `GET /links/{id}/comments/teams.json` | Get a link's teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v1_get_teams_users_json` | read | `GET /teams/users.json` | Get all user ids for all teams | [v1 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v1) |
| `v2_get_projects_api_v2_projects_templates_json` | read | `GET /projects/api/v2/projects/templates.json` | Get Project Templates | [v2 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v2) |
| `v2_get_projects_api_v2_projects_id_predecessors_json` | read | `GET /projects/api/v2/projects/{id}/predecessors.json` | Retrieve all Task Predecessors/Dependencies on a given Project | [v2 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v2) |
| `v2_get_projects_api_v2_tasklists_id_taskids_json` | read | `GET /projects/api/v2/tasklists/{id}/taskids.json` | Get all Task IDs on a given Task List | [v2 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v2) |
| `v2_get_projects_api_v2_projects_id_taskids_json` | read | `GET /projects/api/v2/projects/{id}/taskids.json` | Get all Tasks IDs on a given Project | [v2 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v2) |
| `v2_get_projects_api_v2_projects_json` | read | `GET /projects/api/v2/projects.json` | Get Custom Fields on projects | [v2 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v2) |
| `v2_get_projects_api_v2_tasks_json` | read | `GET /projects/api/v2/tasks.json` | Get Custom Fields on tasks | [v2 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v2) |
| `v2_get_projects_api_v2_tasks_taskid_json` | read | `GET /projects/api/v2/tasks/{taskId}.json` | Get Custom Fields on a task | [v2 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v2) |
| `v2_get_projects_api_v2_projects_projectid_json` | read | `GET /projects/api/v2/projects/{projectId}.json` | Get Custom Fields on a project | [v2 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v2) |
| `v3_get_projects_api_v3_allocations_allocationid_time_json` | read | `GET /projects/api/v3/allocations/{allocationId}/time.json` | Get time entries for a specific allocation | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_comments_json` | read | `GET /projects/api/v3/comments.json` | Get a list of comments | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_comments_json` | write | `POST /projects/api/v3/comments.json` | Create a comment | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_comments_id_json` | read | `GET /projects/api/v3/comments/{id}.json` | Retrieve a specific comment | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_comments_id_notified_json` | read | `GET /projects/api/v3/comments/{id}/notified.json` | List users notified for a comment | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_companies_json` | read | `GET /projects/api/v3/companies.json` | Get all companies. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_companies_json` | write | `POST /projects/api/v3/companies.json` | Create a company. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_delete_projects_api_v3_companies_domains_id_json` | destructive | `DELETE /projects/api/v3/companies/domains/{id}.json` | Delete an existing company domain. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_patch_projects_api_v3_companies_domains_id_json` | write | `PATCH /projects/api/v3/companies/domains/{id}.json` | Update an existing company domain. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_companies_time_json` | read | `GET /projects/api/v3/companies/time.json` | Get all time entries, grouped by company ID | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_delete_projects_api_v3_companies_companyid_json` | destructive | `DELETE /projects/api/v3/companies/{companyId}.json` | Delete an existing company. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_companies_companyid_json` | read | `GET /projects/api/v3/companies/{companyId}.json` | Get a specific company. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_patch_projects_api_v3_companies_companyid_json` | write | `PATCH /projects/api/v3/companies/{companyId}.json` | Update an existing company. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_patch_projects_api_v3_companies_companyid_rates_json` | write | `PATCH /projects/api/v3/companies/{companyId}/rates.json` | Set client rates for a company. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_companies_id_convert_currency_json` | destructive | `POST /projects/api/v3/companies/{id}/convert-currency.json` | Convert a company's currency | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_companies_id_domains_json` | write | `POST /projects/api/v3/companies/{id}/domains.json` | Create a new company domains. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_files_fileid_project_json` | read | `GET /projects/api/v3/files/{fileId}/project.json` | Get the parent project for a specific file. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_links_linkid_comments_json` | read | `GET /projects/api/v3/links/{linkId}/comments.json` | Get a list of comments for a link item | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_links_linkid_comments_json` | write | `POST /projects/api/v3/links/{linkId}/comments.json` | Create a comment on a link item. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_links_linkid_project_json` | read | `GET /projects/api/v3/links/{linkId}/project.json` | Get the parent project for a specific link item. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_me_json` | read | `GET /projects/api/v3/me.json` | Get logged user information | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_me_personaltasks_json` | read | `GET /projects/api/v3/me/personaltasks.json` | Get the current user's personal tasks. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_me_personaltasks_json` | write | `POST /projects/api/v3/me/personaltasks.json` | Creates a personal task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_me_personaltasks_id_json` | read | `GET /projects/api/v3/me/personaltasks/{id}.json` | Get a specific personal task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_me_timers_json` | read | `GET /projects/api/v3/me/timers.json` | Get all your running timers | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_me_timers_json` | write | `POST /projects/api/v3/me/timers.json` | Create a new timer | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_delete_projects_api_v3_me_timers_timerid_json` | destructive | `DELETE /projects/api/v3/me/timers/{timerId}.json` | Delete a timer by ID | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_me_timers_timerid_json` | write | `PUT /projects/api/v3/me/timers/{timerId}.json` | Edits a timer | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_me_timers_timerid_complete_json` | write | `PUT /projects/api/v3/me/timers/{timerId}/complete.json` | Complete a timer by ID | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_me_timers_timerid_pause_json` | write | `PUT /projects/api/v3/me/timers/{timerId}/pause.json` | Pause a timer by ID | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_me_timers_timerid_resume_json` | write | `PUT /projects/api/v3/me/timers/{timerId}/resume.json` | Resume a timer by ID | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_me_timers_timerid_undelete_json` | write | `PUT /projects/api/v3/me/timers/{timerId}/undelete.json` | Restore a deleted timer item. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_milestones_json` | read | `GET /projects/api/v3/milestones.json` | Get all milestones | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_milestones_metrics_deadlines_json` | read | `GET /projects/api/v3/milestones/metrics/deadlines.json` | Get milestones by due date in a time range | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_milestones_milestoneid_json` | read | `GET /projects/api/v3/milestones/{milestoneId}.json` | Get a milestone by id. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_milestones_milestoneid_project_json` | read | `GET /projects/api/v3/milestones/{milestoneId}/project.json` | Get the parent project for a specific milestone. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_notebooks_json` | read | `GET /projects/api/v3/notebooks.json` | Get a list of notebooks. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_delete_projects_api_v3_notebooks_notebookid_json` | destructive | `DELETE /projects/api/v3/notebooks/{notebookId}.json` | Delete an existing notebook. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_notebooks_notebookid_json` | read | `GET /projects/api/v3/notebooks/{notebookId}.json` | Get a specific notebook. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_patch_projects_api_v3_notebooks_notebookid_json` | write | `PATCH /projects/api/v3/notebooks/{notebookId}.json` | Edits a notebook | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_notebooks_notebookid_compare_json` | read | `GET /projects/api/v3/notebooks/{notebookId}/compare.json` | Compare 2 notebook versions | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_notebooks_notebookid_project_json` | read | `GET /projects/api/v3/notebooks/{notebookId}/project.json` | Get the parent project for a specific notebook. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_delete_projects_api_v3_notebooks_notebookid_versions_json` | destructive | `DELETE /projects/api/v3/notebooks/{notebookId}/versions.json` | Delete notebook versions. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_notebooks_notebookid_versions_json` | read | `GET /projects/api/v3/notebooks/{notebookId}/versions.json` | Get notebook versions | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_notebooks_notebookid_versions_versionid_json` | read | `GET /projects/api/v3/notebooks/{notebookId}/versions/{versionId}.json` | Get a notebook version | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_people_json` | read | `GET /projects/api/v3/people.json` | Returns a list of people | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_people_metrics_performance_json` | read | `GET /projects/api/v3/people/metrics/performance.json` | Performance of users completing the most tasks | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_people_utilization_json` | read | `GET /projects/api/v3/people/utilization.json` | Return the user utilization. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_delete_projects_api_v3_people_personid_json` | destructive | `DELETE /projects/api/v3/people/{personId}.json` | Delete an existing person. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_people_personid_json` | read | `GET /projects/api/v3/people/{personId}.json` | Returns a person | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_json` | read | `GET /projects/api/v3/projects.json` | Returns a list of projects | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_metrics_active_json` | read | `GET /projects/api/v3/projects/metrics/active.json` | Get the total count of active projects | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_metrics_billable_json` | read | `GET /projects/api/v3/projects/metrics/billable.json` | Get the total billable time per project | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_metrics_healths_json` | read | `GET /projects/api/v3/projects/metrics/healths.json` | Get a health summary for all projects | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_metrics_invoices_json` | read | `GET /projects/api/v3/projects/metrics/invoices.json` | Return open invoices across all projects | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_metrics_owners_json` | read | `GET /projects/api/v3/projects/metrics/owners.json` | Get number of owned and un-assigned projects | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_metrics_unbilled_json` | read | `GET /projects/api/v3/projects/metrics/unbilled.json` | Return un-billed expenses across all projects | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_number_json` | read | `GET /projects/api/v3/projects/number.json` | Get the project number settings | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_projects_number_json` | write | `PUT /projects/api/v3/projects/number.json` | Set the project number settings | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_projects_people_userid_enqueue_json` | write | `PUT /projects/api/v3/projects/people/{userId}/enqueue.json` | Bulk applies a user to many projects | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_starred_json` | read | `GET /projects/api/v3/projects/starred.json` | Returns a list of starred projects | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_teamwork_samples_json` | read | `GET /projects/api/v3/projects/teamwork/samples.json` | Returns a list of teamwork sample projects | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_templates_json` | read | `GET /projects/api/v3/projects/templates.json` | Returns a list of projects templates | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_templates_id_json` | read | `GET /projects/api/v3/projects/templates/{id}.json` | Returns a project template | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_templates_id_customfields_required_json` | read | `GET /projects/api/v3/projects/templates/{id}/customfields/required.json` | Get required custom fields for a project template | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_projects_tentative_projectid_convert_json` | write | `PUT /projects/api/v3/projects/tentative/{projectId}/convert.json` | Converts the given tentative project into normal | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_updates_json` | read | `GET /projects/api/v3/projects/updates.json` | Get all project updates | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_projectids_updates_json` | read | `GET /projects/api/v3/projects/{projectIds}/updates.json` | Get all updates from a specific project | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_projectid_json` | read | `GET /projects/api/v3/projects/{projectId}.json` | Returns a project | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_projectid_featureorder_json` | read | `GET /projects/api/v3/projects/{projectId}/featureorder.json` | Returns a project features order to display in tab | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_projects_projectid_featureorder_json` | write | `PUT /projects/api/v3/projects/{projectId}/featureorder.json` | Sets the the features order to display in tab | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_projectid_milestones_json` | read | `GET /projects/api/v3/projects/{projectId}/milestones.json` | Get milestones in a project | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_projects_projectid_notebooks_json` | write | `POST /projects/api/v3/projects/{projectId}/notebooks.json` | Create a new notebook. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_projectid_people_json` | read | `GET /projects/api/v3/projects/{projectId}/people.json` | Returns a list of people on a project | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_projects_projectid_people_json` | write | `PUT /projects/api/v3/projects/{projectId}/people.json` | Add people to a project | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_projectid_people_personid_json` | read | `GET /projects/api/v3/projects/{projectId}/people/{personId}.json` | Returns a person on a project | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_projectid_tasklists_json` | read | `GET /projects/api/v3/projects/{projectId}/tasklists.json` | Get tasklists in a project | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_projectid_tasks_json` | read | `GET /projects/api/v3/projects/{projectId}/tasks.json` | Get a specific project's tasks. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_projectid_time_json` | read | `GET /projects/api/v3/projects/{projectId}/time.json` | Get time entries for a specific project | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_projects_projectid_time_json` | write | `POST /projects/api/v3/projects/{projectId}/time.json` | Create a time entry in a specific project. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_projects_projectid_time_total_json` | read | `GET /projects/api/v3/projects/{projectId}/time/total.json` | Get timelog totals for a specific project. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_reporting_dashboards_data_milestones_json` | read | `GET /projects/api/v3/reporting/dashboards/data/milestones.json` | Get milestone chart data. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_reporting_dashboards_details_milestones_json` | read | `GET /projects/api/v3/reporting/dashboards/details/milestones.json` | Get milestone details. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_reporting_precanned_companytime_json` | read | `GET /projects/api/v3/reporting/precanned/companytime.json` | Get all time entries, grouped by company ID | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_reporting_precanned_tasktime_json` | read | `GET /projects/api/v3/reporting/precanned/tasktime.json` | Generate a precanned task time report. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_reporting_precanned_usertaskcompletion_json` | read | `GET /projects/api/v3/reporting/precanned/usertaskcompletion.json` | Returns task completions for all users | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_statuses_json` | read | `GET /projects/api/v3/statuses.json` | Get all statuses | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_statuses_timeline_json` | read | `GET /projects/api/v3/statuses/timeline.json` | Get the people statuses timeline. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_taskgroups_taskgroupid_tasks_json` | read | `GET /projects/api/v3/taskgroups/{taskgroupId}/tasks.json` | Get a specific taskgroup's tasks. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_taskgroups_taskgroupid_tasks_json` | write | `POST /projects/api/v3/taskgroups/{taskgroupId}/tasks.json` | Creates a task in a taskgroup. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasklists_json` | read | `GET /projects/api/v3/tasklists.json` | Get all tasklists | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasklists_templates_json` | read | `GET /projects/api/v3/tasklists/templates.json` | Get all tasklist templates | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_delete_projects_api_v3_tasklists_tasklistid_json` | destructive | `DELETE /projects/api/v3/tasklists/{tasklistId}.json` | Delete an existing tasklist. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasklists_tasklistid_json` | read | `GET /projects/api/v3/tasklists/{tasklistId}.json` | Get specific tasklist | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasklists_tasklistid_project_json` | read | `GET /projects/api/v3/tasklists/{tasklistId}/project.json` | Get the parent project for a specific tasklist. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasklists_tasklistid_tasks_json` | read | `GET /projects/api/v3/tasklists/{tasklistId}/tasks.json` | Get a specific tasklist's tasks. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_tasklists_tasklistid_tasks_json` | write | `POST /projects/api/v3/tasklists/{tasklistId}/tasks.json` | Creates a task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasklists_tasklistid_time_total_json` | read | `GET /projects/api/v3/tasklists/{tasklistId}/time/total.json` | Get timelog totals for a specific task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasks_json` | read | `GET /projects/api/v3/tasks.json` | Get all tasks. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasks_metrics_complete_json` | read | `GET /projects/api/v3/tasks/metrics/complete.json` | Total count of completed tasks | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasks_metrics_late_json` | read | `GET /projects/api/v3/tasks/metrics/late.json` | Get total count of late tasks | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasks_id_reminders_json` | read | `GET /projects/api/v3/tasks/{id}/reminders.json` | Gets task reminders | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_delete_projects_api_v3_tasks_taskid_json` | destructive | `DELETE /projects/api/v3/tasks/{taskId}.json` | Delete an existing task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasks_taskid_json` | read | `GET /projects/api/v3/tasks/{taskId}.json` | Get a specific task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_patch_projects_api_v3_tasks_taskid_json` | write | `PATCH /projects/api/v3/tasks/{taskId}.json` | Update an existing task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_tasks_taskid_json` | write | `PUT /projects/api/v3/tasks/{taskId}.json` | Update an existing task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasks_taskid_project_json` | read | `GET /projects/api/v3/tasks/{taskId}/project.json` | Get the parent project for a specific task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_tasks_taskid_reminders_json` | write | `POST /projects/api/v3/tasks/{taskId}/reminders.json` | Add task reminder | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_delete_projects_api_v3_tasks_taskid_reminders_reminderid_json` | destructive | `DELETE /projects/api/v3/tasks/{taskId}/reminders/{reminderId}.json` | Delete task reminder | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_patch_projects_api_v3_tasks_taskid_reminders_reminderid_json` | write | `PATCH /projects/api/v3/tasks/{taskId}/reminders/{reminderId}.json` | Update task reminder | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasks_taskid_subtasks_json` | read | `GET /projects/api/v3/tasks/{taskId}/subtasks.json` | Get all subtasks for a specific task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_tasks_taskid_subtasks_json` | write | `POST /projects/api/v3/tasks/{taskId}/subtasks.json` | Creates a subtask. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasks_taskid_time_json` | read | `GET /projects/api/v3/tasks/{taskId}/time.json` | Get time entries for a specific task | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_post_projects_api_v3_tasks_taskid_time_json` | write | `POST /projects/api/v3/tasks/{taskId}/time.json` | Create a time entry linked to a specific task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_tasks_taskid_time_total_json` | read | `GET /projects/api/v3/tasks/{taskId}/time/total.json` | Get timelog totals for a specific task. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_time_json` | read | `GET /projects/api/v3/time.json` | Get all time entries | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_time_report_json` | read | `GET /projects/api/v3/time/report.json` | Get time report | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_time_report_totals_json` | read | `GET /projects/api/v3/time/report/totals.json` | Get time report totals | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_time_report_type_json` | read | `GET /projects/api/v3/time/report/{type}.json` | Get time report by type | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_time_total_json` | read | `GET /projects/api/v3/time/total.json` | Get timelog totals. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_time_validate_json` | read | `GET /projects/api/v3/time/validate.json` | Validate if a timelog can be created | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_delete_projects_api_v3_time_timelogid_json` | destructive | `DELETE /projects/api/v3/time/{timelogId}.json` | Delete an existing timelog. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_time_timelogid_json` | read | `GET /projects/api/v3/time/{timelogId}.json` | Get a specific time entry | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_patch_projects_api_v3_time_timelogid_json` | write | `PATCH /projects/api/v3/time/{timelogId}.json` | Update an existing time entry. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_put_projects_api_v3_time_timelogid_json` | write | `PUT /projects/api/v3/time/{timelogId}.json` | Update an existing time entry. | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_timers_json` | read | `GET /projects/api/v3/timers.json` | Get all running timers | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |
| `v3_get_projects_api_v3_timers_timerid_json` | read | `GET /projects/api/v3/timers/{timerId}.json` | Get a specific timer | [v3 OpenAPI](https://apidocs.teamwork.com/api/oas/download?slug=teamwork&api_version=v3) |

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
