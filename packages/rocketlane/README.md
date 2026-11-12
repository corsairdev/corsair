# @corsair-dev/rocketlane

Rocketlane plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/rocketlane
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `budgets.createBudget` | `rocketlane.api.budgets.createBudget` | `write` | Create budget |
| `budgets.deleteBudget` | `rocketlane.api.budgets.deleteBudget` | `write` | Delete budget by Id |
| `budgets.getBudget` | `rocketlane.api.budgets.getBudget` | `read` | Get budget by Id |
| `budgets.searchBudgets` | `rocketlane.api.budgets.searchBudgets` | `read` | Get all budgets |
| `budgets.updateBudget` | `rocketlane.api.budgets.updateBudget` | `write` | Update budget by Id |
| `budgets.updateBudgetManualRevenueRecognitionConfigs` | `rocketlane.api.budgets.updateBudgetManualRevenueRecognitionConfigs` | `write` | Update manual revenue recognition configs for a budget |
| `budgets.updateBudgetMilestoneRevenueRecognitionConfigs` | `rocketlane.api.budgets.updateBudgetMilestoneRevenueRecognitionConfigs` | `write` | Update milestone revenue recognition configs for a budget |
| `companies.createCompany` | `rocketlane.api.companies.createCompany` | `write` | Create a company |
| `companies.createCompanyNote` | `rocketlane.api.companies.createCompanyNote` | `write` | Create a note for a company |
| `companies.deleteCompany` | `rocketlane.api.companies.deleteCompany` | `write` | Delete company by Id |
| `companies.getAllCompanies` | `rocketlane.api.companies.getAllCompanies` | `read` | Get all companies |
| `companies.getCompany` | `rocketlane.api.companies.getCompany` | `read` | Get company by Id |
| `companies.updateCompany` | `rocketlane.api.companies.updateCompany` | `write` | Update company by Id |
| `custom_revenue_recognition_configs.getAllCustomRevenueRecognitionConfigs` | `rocketlane.api.custom_revenue_recognition_configs.getAllCustomRevenueRecognitionConfigs` | `read` | Get all custom revenue recognition configs |
| `custom_revenue_recognition_configs.getCustomRevenueRecognitionConfig` | `rocketlane.api.custom_revenue_recognition_configs.getCustomRevenueRecognitionConfig` | `read` | Get custom revenue recognition config by Id |
| `fields.addFieldOption` | `rocketlane.api.fields.addFieldOption` | `write` | Add field Option |
| `fields.createField` | `rocketlane.api.fields.createField` | `write` | Create a Field |
| `fields.deleteField` | `rocketlane.api.fields.deleteField` | `write` | Delete field by Id |
| `fields.getAllFields` | `rocketlane.api.fields.getAllFields` | `read` | Get all fields |
| `fields.getField` | `rocketlane.api.fields.getField` | `read` | Get field by Id |
| `fields.updateField` | `rocketlane.api.fields.updateField` | `write` | Update field by Id |
| `fields.updateFieldOption` | `rocketlane.api.fields.updateFieldOption` | `write` | Update field Option |
| `invoices.getInvoice` | `rocketlane.api.invoices.getInvoice` | `read` | Get invoice by Id |
| `invoices.getInvoiceLineItems` | `rocketlane.api.invoices.getInvoiceLineItems` | `read` | Get invoice line items by invoice Id |
| `invoices.getInvoicePayments` | `rocketlane.api.invoices.getInvoicePayments` | `read` | Get invoice payments by invoice Id |
| `invoices.searchInvoices` | `rocketlane.api.invoices.searchInvoices` | `read` | Get all invoices |
| `phases.createPhase` | `rocketlane.api.phases.createPhase` | `write` | Create a phase |
| `phases.deletePhase` | `rocketlane.api.phases.deletePhase` | `write` | Delete phase by Id |
| `phases.getAllPhases` | `rocketlane.api.phases.getAllPhases` | `read` | Get all phases |
| `phases.getPhase` | `rocketlane.api.phases.getPhase` | `read` | Get phase by Id |
| `phases.updatePhase` | `rocketlane.api.phases.updatePhase` | `write` | Update phase by Id |
| `projects.addMembers` | `rocketlane.api.projects.addMembers` | `write` | Add members to a project |
| `projects.archiveProject` | `rocketlane.api.projects.archiveProject` | `write` | Archive project by Id |
| `projects.assignPlaceholders` | `rocketlane.api.projects.assignPlaceholders` | `write` | Assign placeholders to an user in a project |
| `projects.createProject` | `rocketlane.api.projects.createProject` | `write` | Create a project |
| `projects.deleteProject` | `rocketlane.api.projects.deleteProject` | `write` | Delete project by Id |
| `projects.getAllProjects` | `rocketlane.api.projects.getAllProjects` | `read` | Get all projects |
| `projects.getPlaceholders` | `rocketlane.api.projects.getPlaceholders` | `write` | Get placeholders |
| `projects.getProject` | `rocketlane.api.projects.getProject` | `read` | Get project by Id |
| `projects.importTemplate` | `rocketlane.api.projects.importTemplate` | `write` | Import a template to a project |
| `projects.removeMembers` | `rocketlane.api.projects.removeMembers` | `write` | Remove members from a project |
| `projects.unassignPlaceholders` | `rocketlane.api.projects.unassignPlaceholders` | `write` | Un assign placeholders from an user in a project |
| `projects.updateProject` | `rocketlane.api.projects.updateProject` | `write` | Update project by Id |
| `resource_allocations.getAllResourceAllocations` | `rocketlane.api.resource_allocations.getAllResourceAllocations` | `read` | Get all Resource allocations |
| `space_documents.createSpaceDocument` | `rocketlane.api.space_documents.createSpaceDocument` | `write` | Create a space document |
| `space_documents.deleteSpaceDocument` | `rocketlane.api.space_documents.deleteSpaceDocument` | `write` | Delete space document by Id |
| `space_documents.getAllSpaceDocuments` | `rocketlane.api.space_documents.getAllSpaceDocuments` | `read` | Get all space documents |
| `space_documents.getSpaceDocument` | `rocketlane.api.space_documents.getSpaceDocument` | `read` | Get space document by Id |
| `space_documents.updateSpaceDocument` | `rocketlane.api.space_documents.updateSpaceDocument` | `write` | Update space document by Id |
| `spaces.createSpace` | `rocketlane.api.spaces.createSpace` | `write` | Create a space |
| `spaces.deleteSpace` | `rocketlane.api.spaces.deleteSpace` | `write` | Delete space by Id |
| `spaces.getAllSpaces` | `rocketlane.api.spaces.getAllSpaces` | `read` | Get all spaces |
| `spaces.getSpace` | `rocketlane.api.spaces.getSpace` | `read` | Get space by Id |
| `spaces.updateSpace` | `rocketlane.api.spaces.updateSpace` | `write` | Update space by Id |
| `tasks.addAssigneeToTask` | `rocketlane.api.tasks.addAssigneeToTask` | `write` | Add assignees to a task by Id |
| `tasks.addDependenciesToTask` | `rocketlane.api.tasks.addDependenciesToTask` | `write` | Add dependencies to a task by Id |
| `tasks.addFollowersToTask` | `rocketlane.api.tasks.addFollowersToTask` | `write` | Add followers to a task by Id |
| `tasks.createTask` | `rocketlane.api.tasks.createTask` | `write` | Create a task |
| `tasks.deleteTask` | `rocketlane.api.tasks.deleteTask` | `write` | Delete task by Id |
| `tasks.getAllTasks` | `rocketlane.api.tasks.getAllTasks` | `read` | Get all tasks |
| `tasks.getTask` | `rocketlane.api.tasks.getTask` | `read` | Get task by Id |
| `tasks.moveTaskToGivenPhase` | `rocketlane.api.tasks.moveTaskToGivenPhase` | `write` | Move a task to the phase by Id |
| `tasks.removeAssigneesFromTask` | `rocketlane.api.tasks.removeAssigneesFromTask` | `write` | Remove assignees from a task by Id |
| `tasks.removeDependenciesFromTask` | `rocketlane.api.tasks.removeDependenciesFromTask` | `write` | Remove dependencies from a task by Id |
| `tasks.removeFollowersFromTask` | `rocketlane.api.tasks.removeFollowersFromTask` | `write` | Remove followers from a task by Id |
| `tasks.updateTask` | `rocketlane.api.tasks.updateTask` | `write` | Update task by Id |
| `time_entries.createTimeEntry` | `rocketlane.api.time_entries.createTimeEntry` | `write` | Create a time entry |
| `time_entries.deleteTimeEntry` | `rocketlane.api.time_entries.deleteTimeEntry` | `write` | Delete a time entry |
| `time_entries.getAllTimeEntries` | `rocketlane.api.time_entries.getAllTimeEntries` | `read` | Get all time entries |
| `time_entries.getTimeEntry` | `rocketlane.api.time_entries.getTimeEntry` | `read` | Get a time entry |
| `time_entries.getTimeEntryCategories` | `rocketlane.api.time_entries.getTimeEntryCategories` | `read` | Get time entry categories |
| `time_entries.searchTimeEntries` | `rocketlane.api.time_entries.searchTimeEntries` | `read` | Search time entries |
| `time_entries.updateTimeEntry` | `rocketlane.api.time_entries.updateTimeEntry` | `write` | Update a time entry |
| `time_offs.createTimeoff` | `rocketlane.api.time_offs.createTimeoff` | `write` | Create a time-off |
| `time_offs.deleteTimeoff` | `rocketlane.api.time_offs.deleteTimeoff` | `write` | Delete a time-off |
| `time_offs.getAllTimeoffs` | `rocketlane.api.time_offs.getAllTimeoffs` | `read` | Get all time-offs |
| `time_offs.getTimeoff` | `rocketlane.api.time_offs.getTimeoff` | `read` | Get time-off by Id |
| `users.getAllUsers` | `rocketlane.api.users.getAllUsers` | `read` | Get all users |
| `users.getUser` | `rocketlane.api.users.getUser` | `read` | Get user by Id |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/rocketlane

## License

Apache-2.0
