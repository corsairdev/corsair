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
| `education.list` | `remoet.api.education.list` | `read` | List the education entries on the user profile |
| `jobContext.get` | `remoet.api.jobContext.get` | `read` | Look up what Remoet knows about a job page URL: company, tech stack, salary, remote policy, reposts and how long ago Remoet first saw it (at least that old, not a posting date). Returns match null for untracked pages |
| `jobs.search` | `remoet.api.jobs.search` | `read` | Search Remoet's public tech job catalogue by keywords, tech stack, company, location, remote policy, seniority and salary floor. Each job's firstSeenAt is when Remoet first saw it, not when it was posted. Paginated with page and pageSize (max 50) |
| `linkTrees.get` | `remoet.api.linkTrees.get` | `read` | Get one of the user's link tree pages by slug |
| `linkTrees.list` | `remoet.api.linkTrees.list` | `read` | List the user's shareable link tree pages |
| `profile.get` | `remoet.api.profile.get` | `read` | Get the signed-in user's whole Remoet profile: contact fields, work experience, projects, education and link trees |
| `profile.getLinks` | `remoet.api.profile.getLinks` | `read` | Get the user's public profile links (website, GitHub, LinkedIn and more); private links come back null |
| `profile.update` | `remoet.api.profile.update` | `write` | Update the user's phone, url, location, githubUrl or linkedinUrl on their Remoet profile (500 characters max each) |
| `projects.list` | `remoet.api.projects.list` | `read` | List the projects on the user profile |
| `savedJobs.create` | `remoet.api.savedJobs.create` | `write` | Save a job to the user's saved jobs by its id, with an optional note (500 characters max) |
| `savedJobs.delete` | `remoet.api.savedJobs.delete` | `destructive` | Remove a saved-job entry by its saved-job id (not the job id) |
| `savedJobs.list` | `remoet.api.savedJobs.list` | `read` | List the user's saved jobs with their notes. A locked entry has job null and a lockedReason saying how to unlock it, usually: star the company to see it again. Paginated with page and pageSize (max 50) |
| `savedJobs.update` | `remoet.api.savedJobs.update` | `write` | Replace the note on a saved-job entry by its saved-job id (not the job id); null clears it |
| `starredJobs.list` | `remoet.api.starredJobs.list` | `read` | List jobs at the companies the user has starred, filtered by keywords, location, tech stack, remote policy, seniority and salary floor. createdAt is when Remoet first saw a job, not when it was posted. Paginated with page and pageSize (max 50) |
| `stars.create` | `remoet.api.stars.create` | `write` | Star a company on Remoet by its slug so its jobs reach the user feed. Stars are capped per user and removing one uses a limited budget, so confirm before starring |
| `stars.delete` | `remoet.api.stars.delete` | `destructive` | Unstar a company by its slug. Each unstar spends from a limited budget that resets every 30 days, so confirm with the user first |
| `workExperience.list` | `remoet.api.workExperience.list` | `read` | List the user's work experience (their employment history, not job postings) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/remoet

## License

Apache-2.0
