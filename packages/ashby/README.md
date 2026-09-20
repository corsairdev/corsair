# @corsair-dev/ashby

Ashby plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ashby
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiKey.info` | `ashby.api.apiKey.info` | `read` | Retrieve information and permission scopes for the current API key |
| `application.changeStage` | `ashby.api.application.changeStage` | `write` | Move an application to a different interview stage |
| `application.create` | `ashby.api.application.create` | `write` | Create an application linking a candidate to a job |
| `application.info` | `ashby.api.application.info` | `read` | Retrieve details for a specific application |
| `application.list` | `ashby.api.application.list` | `read` | List applications filtered by candidate, job, or status |
| `application.transfer` | `ashby.api.application.transfer` | `write` | Transfer an application to another job |
| `application.update` | `ashby.api.application.update` | `write` | Update application metadata or archive status |
| `candidate.addTag` | `ashby.api.candidate.addTag` | `write` | Add a tag to a candidate |
| `candidate.anonymize` | `ashby.api.candidate.anonymize` | `destructive` | Anonymize candidate personally identifiable data for GDPR compliance |
| `candidate.create` | `ashby.api.candidate.create` | `write` | Create a new candidate in Ashby |
| `candidate.createNote` | `ashby.api.candidate.createNote` | `write` | Create a note on a candidate record |
| `candidate.info` | `ashby.api.candidate.info` | `read` | Retrieve detailed candidate information by ID |
| `candidate.list` | `ashby.api.candidate.list` | `read` | List candidates with cursor-based pagination and time filters |
| `candidate.listNotes` | `ashby.api.candidate.listNotes` | `read` | List all notes for a specific candidate |
| `candidate.removeTag` | `ashby.api.candidate.removeTag` | `write` | Remove a tag from a candidate |
| `candidate.search` | `ashby.api.candidate.search` | `read` | Search candidates by name, email address, or phone number |
| `candidate.update` | `ashby.api.candidate.update` | `write` | Update candidate profile information and custom fields |
| `customField.info` | `ashby.api.customField.info` | `read` | Retrieve custom field definition details |
| `customField.list` | `ashby.api.customField.list` | `read` | List custom field definitions filtered by object type |
| `customField.setValue` | `ashby.api.customField.setValue` | `write` | Set a custom field value on a candidate, application, job, or offer |
| `department.archive` | `ashby.api.department.archive` | `destructive` | Archive a department |
| `department.create` | `ashby.api.department.create` | `write` | Create a new department |
| `department.info` | `ashby.api.department.info` | `read` | Retrieve department details by ID |
| `department.list` | `ashby.api.department.list` | `read` | List all departments in the organization |
| `department.update` | `ashby.api.department.update` | `write` | Update department name or parent department |
| `interview.info` | `ashby.api.interview.info` | `read` | Retrieve interview details by ID |
| `interview.list` | `ashby.api.interview.list` | `read` | List interviews for an interview plan |
| `interview.scheduleInfo` | `ashby.api.interview.scheduleInfo` | `read` | Retrieve details of an interview schedule |
| `interview.scheduleList` | `ashby.api.interview.scheduleList` | `read` | List scheduled interviews for an application |
| `interview.stageList` | `ashby.api.interview.stageList` | `read` | List interview stages for a job or interview plan |
| `job.create` | `ashby.api.job.create` | `write` | Create a new job in Ashby |
| `job.info` | `ashby.api.job.info` | `read` | Retrieve job details by job ID |
| `job.list` | `ashby.api.job.list` | `read` | List jobs with status, department, and location filters |
| `job.search` | `ashby.api.job.search` | `read` | Search jobs by title or status |
| `job.update` | `ashby.api.job.update` | `write` | Update job details, department, or status |
| `jobPosting.info` | `ashby.api.jobPosting.info` | `read` | Retrieve job posting information by ID |
| `jobPosting.list` | `ashby.api.jobPosting.list` | `read` | List published and unpublished job postings |
| `location.archive` | `ashby.api.location.archive` | `destructive` | Archive a location |
| `location.create` | `ashby.api.location.create` | `write` | Create a new location |
| `location.info` | `ashby.api.location.info` | `read` | Retrieve location details by ID |
| `location.list` | `ashby.api.location.list` | `read` | List all locations in the organization |
| `location.update` | `ashby.api.location.update` | `write` | Update location name or hierarchy |
| `offer.create` | `ashby.api.offer.create` | `write` | Create a new job offer for an application |
| `offer.info` | `ashby.api.offer.info` | `read` | Retrieve details for a specific offer |
| `offer.list` | `ashby.api.offer.list` | `read` | List offers filtered by application or status |
| `offer.update` | `ashby.api.offer.update` | `write` | Update job offer details or status |
| `user.info` | `ashby.api.user.info` | `read` | Retrieve organization user details by ID |
| `user.list` | `ashby.api.user.list` | `read` | List users in the organization |
| `user.search` | `ashby.api.user.search` | `read` | Search users by name or email address |
| `webhook.create` | `ashby.api.webhook.create` | `write` | Register a new webhook subscription in Ashby |
| `webhook.delete` | `ashby.api.webhook.delete` | `destructive` | Delete a webhook subscription |
| `webhook.info` | `ashby.api.webhook.info` | `read` | Retrieve webhook configuration details by ID |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 10 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ashby

## License

Apache-2.0
