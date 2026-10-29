# @corsair-dev/remoet

Remoet plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/remoet
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `companies.get` | `remoet.api.companies.get` | `read` | Get one Remoet company by slug, including its tech stack, perks and open-role counts; pass checkTechStack to see which technologies it uses |
| `companies.search` | `remoet.api.companies.search` | `read` | Search Remoet's tech companies by name, description, tech stack or seniority, or set starred to list the companies the user has starred. Paginated with page and pageSize (max 100) |
| `education.create` | `remoet.api.education.create` | `write` | Add an education entry to the user's profile: institution is required |
| `education.delete` | `remoet.api.education.delete` | `destructive` | Permanently remove an education entry by its id. Confirm with the user first |
| `education.list` | `remoet.api.education.list` | `read` | List the education entries on the user profile |
| `education.update` | `remoet.api.education.update` | `write` | Update an education entry by its id. Omit a field to leave it unchanged; set an optional text field to '' to clear it. startDate, endDate and isCurrent can only be replaced, never cleared |
| `feed.list` | `remoet.api.feed.list` | `read` | List a page of the user's composed feed: their own item lane (new jobs, welcome, starred-company snapshots) merged with blog posts, job of the day and broadcasts, newest first. Paginated with pageSize (max 50) and cursor, taken from the previous page's nextCursor |
| `jobContext.get` | `remoet.api.jobContext.get` | `read` | Look up what Remoet knows about a job page URL: company, tech stack, salary, remote policy, reposts and how long ago Remoet first saw it (at least that old, not a posting date). Returns match null for untracked pages |
| `jobs.search` | `remoet.api.jobs.search` | `read` | Search Remoet's public tech job catalogue by keywords, tech stack, company, location, remote policy, seniority and salary floor. Each job's firstSeenAt is when Remoet first saw it, not when it was posted. Paginated with page and pageSize (max 50) |
| `linkTrees.get` | `remoet.api.linkTrees.get` | `read` | Get one of the user's link tree pages by slug |
| `linkTrees.list` | `remoet.api.linkTrees.list` | `read` | List the user's shareable link tree pages |
| `profile.get` | `remoet.api.profile.get` | `read` | Get the signed-in user's whole Remoet profile: contact fields, work experience, projects, education and link trees |
| `profile.getLinks` | `remoet.api.profile.getLinks` | `read` | Get the user's public profile links (website, GitHub, LinkedIn and more); private links come back null |
| `profile.update` | `remoet.api.profile.update` | `write` | Update the user's Remoet profile: contact fields, name, avatarUrl, socials and summary (each may be set to null to clear it, 500 characters max, 5000 for summary), and visibility. Explain the visibility trade-off to the user before changing it: NONE hides them from every company's candidate list, STARRED shows them only to companies they have starred, and ALL shows them to every company on Remoet |
| `projects.create` | `remoet.api.projects.create` | `write` | Add a project entry to the user's profile: title and shortDescription are required |
| `projects.delete` | `remoet.api.projects.delete` | `destructive` | Permanently remove a project entry by its id. Confirm with the user first |
| `projects.list` | `remoet.api.projects.list` | `read` | List the projects on the user profile |
| `projects.update` | `remoet.api.projects.update` | `write` | Update a project entry by its id. Omit a field to leave it unchanged; set an optional text field to '' to clear it or technologies to [] to empty it. startDate, endDate and the booleans can only be replaced, never cleared |
| `savedJobs.create` | `remoet.api.savedJobs.create` | `write` | Save a job to the user's saved jobs by its id, with an optional note (500 characters max) |
| `savedJobs.delete` | `remoet.api.savedJobs.delete` | `destructive` | Permanently remove a saved-job entry by its saved-job id (not the job id). Confirm with the user first |
| `savedJobs.list` | `remoet.api.savedJobs.list` | `read` | List the user's saved jobs with their notes. A locked entry has job null and a lockedReason saying how to unlock it, usually: star the company to see it again. Paginated with page and pageSize (max 50) |
| `savedJobs.update` | `remoet.api.savedJobs.update` | `write` | Replace the note on a saved-job entry by its saved-job id (not the job id); null clears it |
| `starredJobs.list` | `remoet.api.starredJobs.list` | `read` | List jobs at the companies the user has starred, filtered by keywords, location, tech stack, remote policy, seniority and salary floor. createdAt is when Remoet first saw a job, not when it was posted. Paginated with page and pageSize (max 50) |
| `stars.create` | `remoet.api.stars.create` | `write` | Star a company on Remoet by its slug so its jobs reach the user feed. Stars are capped per user and removing one uses a limited budget, so confirm before starring |
| `stars.delete` | `remoet.api.stars.delete` | `destructive` | Unstar a company by its slug. Each unstar spends from a limited budget that resets every 30 days, so confirm with the user first |
| `workExperience.create` | `remoet.api.workExperience.create` | `write` | Add a work experience entry to the user's profile: title and startDate are required |
| `workExperience.delete` | `remoet.api.workExperience.delete` | `destructive` | Permanently remove a work experience entry by its id. Confirm with the user first |
| `workExperience.list` | `remoet.api.workExperience.list` | `read` | List the user's work experience (their employment history, not job postings) |
| `workExperience.update` | `remoet.api.workExperience.update` | `write` | Update a work experience entry by its id. Omit a field to leave it unchanged; set an optional text field to '' to clear it or technologies to [] to empty it. startDate, endDate and the booleans can only be replaced, never cleared |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/remoet

## License

Apache-2.0
