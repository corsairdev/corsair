# @corsair-dev/hubplanner

Hub Planner plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/hubplanner
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bookings.create` | `hubplanner.api.bookings.create` | `write` | Create a new resource schedule booking |
| `bookings.delete` | `hubplanner.api.bookings.delete` | `destructive` | Delete a specific booking by ID |
| `bookings.deleteBulk` | `hubplanner.api.bookings.deleteBulk` | `destructive` | Bulk delete bookings by IDs or filter parameters |
| `bookings.get` | `hubplanner.api.bookings.get` | `read` | Get booking details by booking ID |
| `bookings.list` | `hubplanner.api.bookings.list` | `read` | List scheduled bookings with pagination and filters |
| `bookings.patch` | `hubplanner.api.bookings.patch` | `write` | Patch specific properties of a booking or approve/reject booking requests |
| `bookings.search` | `hubplanner.api.bookings.search` | `read` | Search bookings matching criteria such as date range or project |
| `bookings.update` | `hubplanner.api.bookings.update` | `write` | Update all properties of an existing booking |
| `categories.create` | `hubplanner.api.categories.create` | `write` | Create a new booking category in a group |
| `categories.createCostCategory` | `hubplanner.api.categories.createCostCategory` | `write` | Create a new project cost category |
| `categories.deleteCostCategory` | `hubplanner.api.categories.deleteCostCategory` | `destructive` | Delete a project cost category by ID |
| `categories.get` | `hubplanner.api.categories.get` | `read` | Get booking category details by category ID |
| `categories.getCostCategory` | `hubplanner.api.categories.getCostCategory` | `read` | Get project cost category by ID |
| `categories.list` | `hubplanner.api.categories.list` | `read` | List all booking categories |
| `categories.listCostCategories` | `hubplanner.api.categories.listCostCategories` | `read` | List all project cost categories |
| `categories.listGroups` | `hubplanner.api.categories.listGroups` | `read` | List booking category groups |
| `categories.search` | `hubplanner.api.categories.search` | `read` | Search booking categories by name or group |
| `categories.searchCostCategories` | `hubplanner.api.categories.searchCostCategories` | `read` | Search project cost categories by name |
| `categories.update` | `hubplanner.api.categories.update` | `write` | Update an existing booking category |
| `categories.updateCostCategory` | `hubplanner.api.categories.updateCostCategory` | `write` | Update an existing project cost category |
| `customFields.addChoices` | `hubplanner.api.customFields.addChoices` | `write` | Add options to dropdown or selection custom field templates |
| `customFields.create` | `hubplanner.api.customFields.create` | `write` | Create a new custom field template for projects or resources |
| `customFields.delete` | `hubplanner.api.customFields.delete` | `destructive` | Delete a custom field template by ID |
| `customFields.get` | `hubplanner.api.customFields.get` | `read` | Get custom field template details by ID |
| `customFields.list` | `hubplanner.api.customFields.list` | `read` | List custom field templates for projects or resources |
| `customFields.search` | `hubplanner.api.customFields.search` | `read` | Search custom field templates matching filter parameters |
| `customFields.update` | `hubplanner.api.customFields.update` | `write` | Update a custom field template and its configuration |
| `events.create` | `hubplanner.api.events.create` | `write` | Create a new company event |
| `events.delete` | `hubplanner.api.events.delete` | `destructive` | Delete a company event by ID |
| `events.get` | `hubplanner.api.events.get` | `read` | Get company event details by event ID |
| `events.list` | `hubplanner.api.events.list` | `read` | List company events with pagination and sorting |
| `events.search` | `hubplanner.api.events.search` | `read` | Search events by name or event code |
| `events.update` | `hubplanner.api.events.update` | `write` | Update an existing company event |
| `milestones.create` | `hubplanner.api.milestones.create` | `write` | Create a new project milestone date |
| `milestones.delete` | `hubplanner.api.milestones.delete` | `destructive` | Delete a project milestone by ID |
| `milestones.get` | `hubplanner.api.milestones.get` | `read` | Get milestone details by milestone ID |
| `milestones.list` | `hubplanner.api.milestones.list` | `read` | List milestones with pagination and sorting |
| `milestones.search` | `hubplanner.api.milestones.search` | `read` | Search milestones by project or date range |
| `milestones.update` | `hubplanner.api.milestones.update` | `write` | Update an existing project milestone |
| `projects.addClients` | `hubplanner.api.projects.addClients` | `write` | Associate client organizations with a project |
| `projects.addResources` | `hubplanner.api.projects.addResources` | `write` | Assign resources to a project |
| `projects.addTags` | `hubplanner.api.projects.addTags` | `write` | Add tags to a project |
| `projects.create` | `hubplanner.api.projects.create` | `write` | Create a new project |
| `projects.delete` | `hubplanner.api.projects.delete` | `destructive` | Delete a specific project by ID |
| `projects.deleteBulk` | `hubplanner.api.projects.deleteBulk` | `destructive` | Delete multiple projects by their IDs |
| `projects.get` | `hubplanner.api.projects.get` | `read` | Get project details by project ID |
| `projects.getTags` | `hubplanner.api.projects.getTags` | `read` | List tags associated with a project |
| `projects.list` | `hubplanner.api.projects.list` | `read` | List all projects with pagination and sorting |
| `projects.removeClient` | `hubplanner.api.projects.removeClient` | `write` | Dissociate a client organization from projects |
| `projects.removeResource` | `hubplanner.api.projects.removeResource` | `write` | Remove a resource from multiple projects |
| `projects.removeTag` | `hubplanner.api.projects.removeTag` | `destructive` | Remove a tag from a project |
| `projects.search` | `hubplanner.api.projects.search` | `read` | Search projects matching custom criteria |
| `projects.setProjectManagers` | `hubplanner.api.projects.setProjectManagers` | `write` | Set designated project managers for a project |
| `projects.update` | `hubplanner.api.projects.update` | `write` | Bulk update projects with modified attributes |
| `resources.addTags` | `hubplanner.api.resources.addTags` | `write` | Add tags to a resource |
| `resources.create` | `hubplanner.api.resources.create` | `write` | Create a new resource member |
| `resources.delete` | `hubplanner.api.resources.delete` | `destructive` | Delete a specific resource by ID |
| `resources.deleteBulk` | `hubplanner.api.resources.deleteBulk` | `destructive` | Delete multiple resources by their IDs |
| `resources.get` | `hubplanner.api.resources.get` | `read` | Get resource details by resource ID |
| `resources.getTags` | `hubplanner.api.resources.getTags` | `read` | List tags associated with a resource |
| `resources.list` | `hubplanner.api.resources.list` | `read` | List all resources with pagination and sorting |
| `resources.removeTag` | `hubplanner.api.resources.removeTag` | `destructive` | Remove a tag from a resource |
| `resources.search` | `hubplanner.api.resources.search` | `read` | Search resources matching custom criteria |
| `resources.update` | `hubplanner.api.resources.update` | `write` | Bulk update resources with modified attributes |
| `timeEntries.create` | `hubplanner.api.timeEntries.create` | `write` | Log new time entry on a project for a resource |
| `timeEntries.delete` | `hubplanner.api.timeEntries.delete` | `destructive` | Delete a timesheet entry by ID |
| `timeEntries.deleteBulk` | `hubplanner.api.timeEntries.deleteBulk` | `destructive` | Delete multiple timesheet entries by their IDs |
| `timeEntries.get` | `hubplanner.api.timeEntries.get` | `read` | Get timesheet entry details by ID |
| `timeEntries.list` | `hubplanner.api.timeEntries.list` | `read` | List recorded timesheet entries with pagination and filters |
| `timeEntries.search` | `hubplanner.api.timeEntries.search` | `read` | Search time entries matching date ranges and resource/project filters |
| `timeEntries.update` | `hubplanner.api.timeEntries.update` | `write` | Update an existing timesheet entry |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/hubplanner

## License

Apache-2.0
