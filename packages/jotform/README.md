# @corsair-dev/jotform

Jotform plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/jotform
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `folders.create` | `jotform.api.folders.create` | `write` | Create a new folder to organize forms |
| `folders.delete` | `jotform.api.folders.delete` | `destructive` | Delete a specific folder by ID |
| `folders.get` | `jotform.api.folders.get` | `read` | Get details, subfolders and form IDs for a specific folder |
| `folders.update` | `jotform.api.folders.update` | `write` | Update folder properties such as name, color or contained forms |
| `forms.clone` | `jotform.api.forms.clone` | `write` | Clone an existing form by duplicating its questions and settings |
| `forms.create` | `jotform.api.forms.create` | `write` | Create a new form with questions, properties and email settings |
| `forms.createForms` | `jotform.api.forms.createForms` | `write` | Create new forms using a complete JSON form content structure |
| `forms.createQuestion` | `jotform.api.forms.createQuestion` | `write` | Add a new question field to a specific form |
| `forms.createQuestions` | `jotform.api.forms.createQuestions` | `write` | Add multiple questions in batch to a specific form |
| `forms.createReport` | `jotform.api.forms.createReport` | `write` | Create a new report (grid, excel, csv, etc.) for a specific form |
| `forms.createSubmission` | `jotform.api.forms.createSubmission` | `write` | Submit a new entry with field answers to a specific form |
| `forms.createSubmissions` | `jotform.api.forms.createSubmissions` | `write` | Add multiple submission entries in batch to a specific form |
| `forms.delete` | `jotform.api.forms.delete` | `destructive` | Delete a specific form by ID from the account |
| `forms.deleteQuestion` | `jotform.api.forms.deleteQuestion` | `destructive` | Delete a specific question field from a form |
| `forms.get` | `jotform.api.forms.get` | `read` | Get basic information and status for a specific form |
| `forms.getFiles` | `jotform.api.forms.getFiles` | `read` | Get list of all uploaded files across submissions for a specific form |
| `forms.getProperties` | `jotform.api.forms.getProperties` | `read` | Get all form properties such as width, height and redirects |
| `forms.getProperty` | `jotform.api.forms.getProperty` | `read` | Get a specific form property by its configuration key |
| `forms.getQuestion` | `jotform.api.forms.getQuestion` | `read` | Get configuration and properties for a specific question on a form |
| `forms.getQuestions` | `jotform.api.forms.getQuestions` | `read` | Get full list of questions and form fields for a specific form |
| `forms.getReports` | `jotform.api.forms.getReports` | `read` | Get all reports created for a specific form |
| `forms.getSubmissions` | `jotform.api.forms.getSubmissions` | `read` | Get submissions list for a specific form with pagination and filtering |
| `forms.setProperties` | `jotform.api.forms.setProperties` | `write` | Update or set configuration properties on a specific form |
| `forms.updateQuestion` | `jotform.api.forms.updateQuestion` | `write` | Update properties or label of a specific question on a form |
| `labels.addResources` | `jotform.api.labels.addResources` | `write` | Add form resources to a specific label |
| `labels.create` | `jotform.api.labels.create` | `write` | Create a new label for organizing forms and assets |
| `labels.delete` | `jotform.api.labels.delete` | `destructive` | Delete a label and all its sublabels |
| `labels.get` | `jotform.api.labels.get` | `read` | Get details and metadata of a specific label |
| `labels.getResources` | `jotform.api.labels.getResources` | `read` | Get list of assets (forms) grouped under a specific label |
| `labels.removeResources` | `jotform.api.labels.removeResources` | `write` | Remove form resources from a specific label |
| `labels.update` | `jotform.api.labels.update` | `write` | Update name, color or parent of an existing label |
| `reports.delete` | `jotform.api.reports.delete` | `destructive` | Delete a specific report by report ID |
| `reports.get` | `jotform.api.reports.get` | `read` | Get configuration and URL for a specific report by report ID |
| `submissions.delete` | `jotform.api.submissions.delete` | `destructive` | Delete a specific submission record from a form |
| `submissions.get` | `jotform.api.submissions.get` | `read` | Get complete submission data and answer records for a specific submission |
| `submissions.update` | `jotform.api.submissions.update` | `write` | Edit answers or read/flag status of an existing submission |
| `system.getPlan` | `jotform.api.system.getPlan` | `read` | Get limits and details for a specific Jotform system plan |
| `user.get` | `jotform.api.user.get` | `read` | Get user account details, including account type, email, website and usage link |
| `user.getFolders` | `jotform.api.user.getFolders` | `read` | Get folders structure and layout for this account |
| `user.getForms` | `jotform.api.user.getForms` | `read` | Get list of forms for this account with pagination, ordering and filtering |
| `user.getHistory` | `jotform.api.user.getHistory` | `read` | Get user activity log history records |
| `user.getInvoices` | `jotform.api.user.getInvoices` | `read` | Get list of invoices and payment receipts for this account |
| `user.getLabels` | `jotform.api.user.getLabels` | `read` | Get all labels created by the user for organizing form assets |
| `user.getReports` | `jotform.api.user.getReports` | `read` | Get list of reports generated across all forms in this account |
| `user.getSettingByKey` | `jotform.api.user.getSettingByKey` | `read` | Get a specific user setting by key name |
| `user.getSettings` | `jotform.api.user.getSettings` | `read` | Get user account settings including company, timezone and industry |
| `user.getSubmissions` | `jotform.api.user.getSubmissions` | `read` | Get list of submissions for all forms in this account |
| `user.getSubusers` | `jotform.api.user.getSubusers` | `read` | Get sub-user accounts list and permissions for this account |
| `user.getUsage` | `jotform.api.user.getUsage` | `read` | Get monthly user usage statistics such as submissions, payments and views |
| `user.login` | `jotform.api.user.login` | `write` | Log in user with username and password to create an authenticated session |
| `user.logout` | `jotform.api.user.logout` | `write` | End the current user session and log out |
| `user.register` | `jotform.api.user.register` | `write` | Register a new user account with username, password and email |
| `user.updateSettings` | `jotform.api.user.updateSettings` | `write` | Update user account settings including name, email, website and timezone |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/jotform

## License

Apache-2.0
