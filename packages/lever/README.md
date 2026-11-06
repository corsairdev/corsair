# @corsair-dev/lever

Lever plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/lever
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `applications.list` | `lever.api.applications.list` | `read` | List applications belonging to a pipeline opportunity |
| `applications.listDeleted` | `lever.api.applications.listDeleted` | `read` | List deleted applications |
| `applications.retrieve` | `lever.api.applications.retrieve` | `read` | Retrieve a single application of a pipeline opportunity |
| `archiveReasons.list` | `lever.api.archiveReasons.list` | `read` | List archive reasons configured for the workspace |
| `archiveReasons.retrieve` | `lever.api.archiveReasons.retrieve` | `read` | Retrieve a single archive reason by ID |
| `auditEvents.list` | `lever.api.auditEvents.list` | `read` | List workspace audit events |
| `contacts.retrieve` | `lever.api.contacts.retrieve` | `read` | Retrieve a single contact by ID |
| `contacts.update` | `lever.api.contacts.update` | `write` | Update a contact |
| `dispositionStages.list` | `lever.api.dispositionStages.list` | `read` | List disposition stages configured for the workspace |
| `eeo.retrieveAnonymous` | `lever.api.eeo.retrieveAnonymous` | `read` | Retrieve anonymized EEO responses |
| `eeo.retrieveWithPii` | `lever.api.eeo.retrieveWithPii` | `read` | Retrieve EEO responses including personally identifiable information |
| `feedback.create` | `lever.api.feedback.create` | `write` | Submit a feedback form for a pipeline opportunity |
| `feedback.delete` | `lever.api.feedback.delete` | `destructive` | Delete a feedback form from a pipeline opportunity |
| `feedback.list` | `lever.api.feedback.list` | `read` | List feedback forms on a pipeline opportunity |
| `feedback.retrieve` | `lever.api.feedback.retrieve` | `read` | Retrieve a single feedback form by ID |
| `feedback.update` | `lever.api.feedback.update` | `write` | Update a feedback form on a pipeline opportunity |
| `feedbackTemplates.create` | `lever.api.feedbackTemplates.create` | `write` | Create a feedback template for the workspace |
| `feedbackTemplates.delete` | `lever.api.feedbackTemplates.delete` | `destructive` | Delete a feedback template |
| `feedbackTemplates.list` | `lever.api.feedbackTemplates.list` | `read` | List feedback templates configured for the workspace |
| `feedbackTemplates.retrieve` | `lever.api.feedbackTemplates.retrieve` | `read` | Retrieve a single feedback template by ID |
| `feedbackTemplates.update` | `lever.api.feedbackTemplates.update` | `write` | Update a feedback template |
| `files.delete` | `lever.api.files.delete` | `destructive` | Delete a file from a pipeline opportunity |
| `files.download` | `lever.api.files.download` | `read` | Download the raw bytes of an opportunity file |
| `files.list` | `lever.api.files.list` | `read` | List files attached to a pipeline opportunity |
| `files.retrieve` | `lever.api.files.retrieve` | `read` | Retrieve a single file attached to a pipeline opportunity |
| `forms.create` | `lever.api.forms.create` | `write` | Submit a form for a pipeline opportunity |
| `forms.list` | `lever.api.forms.list` | `read` | List form submissions on a pipeline opportunity |
| `forms.retrieve` | `lever.api.forms.retrieve` | `read` | Retrieve a single form submission by ID |
| `formTemplates.create` | `lever.api.formTemplates.create` | `write` | Create a form template for the workspace |
| `formTemplates.delete` | `lever.api.formTemplates.delete` | `destructive` | Delete a form template |
| `formTemplates.list` | `lever.api.formTemplates.list` | `read` | List form templates configured for the workspace |
| `formTemplates.retrieve` | `lever.api.formTemplates.retrieve` | `read` | Retrieve a single form template by ID |
| `formTemplates.update` | `lever.api.formTemplates.update` | `write` | Update a form template |
| `interviews.create` | `lever.api.interviews.create` | `write` | Schedule an interview for a pipeline opportunity |
| `interviews.delete` | `lever.api.interviews.delete` | `destructive` | Delete a scheduled interview |
| `interviews.list` | `lever.api.interviews.list` | `read` | List interviews scheduled for a pipeline opportunity |
| `interviews.retrieve` | `lever.api.interviews.retrieve` | `read` | Retrieve a single interview by ID |
| `interviews.update` | `lever.api.interviews.update` | `write` | Update a scheduled interview |
| `notes.create` | `lever.api.notes.create` | `write` | Add a note to a pipeline opportunity |
| `notes.delete` | `lever.api.notes.delete` | `destructive` | Delete a note from a pipeline opportunity |
| `notes.list` | `lever.api.notes.list` | `read` | List notes on a pipeline opportunity |
| `notes.retrieve` | `lever.api.notes.retrieve` | `read` | Retrieve a single note on a pipeline opportunity |
| `notes.update` | `lever.api.notes.update` | `write` | Update a note on a pipeline opportunity |
| `offers.download` | `lever.api.offers.download` | `read` | Download the raw bytes of an offer file |
| `offers.list` | `lever.api.offers.list` | `read` | List offers for a pipeline opportunity |
| `opportunities.addLinks` | `lever.api.opportunities.addLinks` | `write` | Add web links (LinkedIn, portfolio) to an opportunity's contact |
| `opportunities.addSources` | `lever.api.opportunities.addSources` | `write` | Add sourcing sources to a pipeline opportunity |
| `opportunities.addTags` | `lever.api.opportunities.addTags` | `write` | Add tags to a pipeline opportunity |
| `opportunities.create` | `lever.api.opportunities.create` | `write` | Create a pipeline opportunity for a candidate profile |
| `opportunities.list` | `lever.api.opportunities.list` | `read` | List pipeline opportunities with filters and pagination |
| `opportunities.listDeleted` | `lever.api.opportunities.listDeleted` | `read` | List deleted pipeline opportunities |
| `opportunities.listFileActions` | `lever.api.opportunities.listFileActions` | `read` | List file actions recorded for a pipeline opportunity |
| `opportunities.removeLinks` | `lever.api.opportunities.removeLinks` | `write` | Remove web links from an opportunity's contact |
| `opportunities.removeSources` | `lever.api.opportunities.removeSources` | `write` | Remove sourcing sources from a pipeline opportunity |
| `opportunities.removeTags` | `lever.api.opportunities.removeTags` | `write` | Remove tags from a pipeline opportunity |
| `opportunities.retrieve` | `lever.api.opportunities.retrieve` | `read` | Retrieve a single pipeline opportunity by ID |
| `opportunities.updateArchivedState` | `lever.api.opportunities.updateArchivedState` | `write` | Archive or unarchive a pipeline opportunity |
| `opportunities.updateStage` | `lever.api.opportunities.updateStage` | `write` | Move a pipeline opportunity to a different hiring stage |
| `panels.create` | `lever.api.panels.create` | `write` | Create an interview panel for a pipeline opportunity |
| `panels.delete` | `lever.api.panels.delete` | `destructive` | Delete an interview panel |
| `panels.list` | `lever.api.panels.list` | `read` | List interview panels for a pipeline opportunity |
| `panels.retrieve` | `lever.api.panels.retrieve` | `read` | Retrieve a single interview panel by ID |
| `panels.update` | `lever.api.panels.update` | `write` | Update an interview panel |
| `postings.apply` | `lever.api.postings.apply` | `write` | Submit an application to a job posting |
| `postings.create` | `lever.api.postings.create` | `write` | Create a job posting |
| `postings.list` | `lever.api.postings.list` | `read` | List job postings |
| `postings.listDeleted` | `lever.api.postings.listDeleted` | `read` | List deleted job postings |
| `postings.listUsers` | `lever.api.postings.listUsers` | `read` | List users with access to a job posting |
| `postings.retrieve` | `lever.api.postings.retrieve` | `read` | Retrieve a single job posting by ID |
| `postings.retrieveApplicationQuestions` | `lever.api.postings.retrieveApplicationQuestions` | `read` | Retrieve the application questions configured for a posting |
| `postings.update` | `lever.api.postings.update` | `write` | Update an existing job posting |
| `referrals.list` | `lever.api.referrals.list` | `read` | List referrals on a pipeline opportunity |
| `referrals.retrieve` | `lever.api.referrals.retrieve` | `read` | Retrieve a single referral by ID |
| `requisitionFields.addOptions` | `lever.api.requisitionFields.addOptions` | `write` | Add dropdown options to a requisition field |
| `requisitionFields.create` | `lever.api.requisitionFields.create` | `write` | Create a requisition field for the workspace |
| `requisitionFields.delete` | `lever.api.requisitionFields.delete` | `destructive` | Delete a requisition field |
| `requisitionFields.deleteOptions` | `lever.api.requisitionFields.deleteOptions` | `destructive` | Remove dropdown option values from a requisition field |
| `requisitionFields.list` | `lever.api.requisitionFields.list` | `read` | List requisition fields configured for the workspace |
| `requisitionFields.replaceOptions` | `lever.api.requisitionFields.replaceOptions` | `destructive` | Replace the dropdown options of a requisition field |
| `requisitionFields.retrieve` | `lever.api.requisitionFields.retrieve` | `read` | Retrieve a single requisition field by ID |
| `requisitionFields.update` | `lever.api.requisitionFields.update` | `write` | Update a requisition field |
| `requisitions.create` | `lever.api.requisitions.create` | `write` | Create a requisition |
| `requisitions.delete` | `lever.api.requisitions.delete` | `destructive` | Delete a requisition |
| `requisitions.list` | `lever.api.requisitions.list` | `read` | List requisitions |
| `requisitions.retrieve` | `lever.api.requisitions.retrieve` | `read` | Retrieve a single requisition by ID |
| `requisitions.update` | `lever.api.requisitions.update` | `write` | Update a requisition |
| `resumes.download` | `lever.api.resumes.download` | `read` | Download the raw bytes of an opportunity resume |
| `resumes.list` | `lever.api.resumes.list` | `read` | List resumes attached to a pipeline opportunity |
| `resumes.retrieve` | `lever.api.resumes.retrieve` | `read` | Retrieve a single resume by ID |
| `sources.list` | `lever.api.sources.list` | `read` | List sourcing sources configured for the workspace |
| `stages.list` | `lever.api.stages.list` | `read` | List hiring stages configured for the workspace |
| `stages.retrieve` | `lever.api.stages.retrieve` | `read` | Retrieve a single hiring stage by ID |
| `surveys.retrieveDiversity` | `lever.api.surveys.retrieveDiversity` | `read` | Retrieve the diversity survey for a job posting |
| `tags.list` | `lever.api.tags.list` | `read` | List tags configured for the workspace |
| `users.create` | `lever.api.users.create` | `write` | Create a workspace user |
| `users.deactivate` | `lever.api.users.deactivate` | `write` | Deactivate a workspace user |
| `users.list` | `lever.api.users.list` | `read` | List workspace users |
| `users.reactivate` | `lever.api.users.reactivate` | `write` | Reactivate a workspace user |
| `users.retrieve` | `lever.api.users.retrieve` | `read` | Retrieve a single workspace user by ID |
| `users.update` | `lever.api.users.update` | `write` | Update a workspace user |
| `webhooks.create` | `lever.api.webhooks.create` | `write` | Register a webhook |
| `webhooks.delete` | `lever.api.webhooks.delete` | `destructive` | Delete a registered webhook |
| `webhooks.list` | `lever.api.webhooks.list` | `read` | List registered webhooks |
| `webhooks.update` | `lever.api.webhooks.update` | `write` | Update a registered webhook |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

Lever attributes writes to a user. Creating opportunities, postings, interviews, panels and feedback, and deleting files, take a `perform_as` Lever user ID; `users.list` returns the IDs.

## Pagination

List operations return `{ data, hasNext, next }`. Pass `next` back as `offset` to fetch the following page; `limit` accepts 1 to 100.

## Webhooks

Incoming webhook events are not supported. Webhook CRUD is available through the API.


## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/lever

## License

Apache-2.0
