# @corsair-dev/remoet

Remoet plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/remoet
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `education.list` | `remoet.api.education.list` | `read` | List the education entries on the user profile |
| `jobContext.get` | `remoet.api.jobContext.get` | `read` | Look up what Remoet knows about a job page URL: company, tech stack, salary, remote policy, reposts and how long ago Remoet first saw it (at least that old, not a posting date). Returns match null for untracked pages |
| `linkTrees.get` | `remoet.api.linkTrees.get` | `read` | Get one of the user's link tree pages by slug |
| `linkTrees.list` | `remoet.api.linkTrees.list` | `read` | List the user's shareable link tree pages |
| `profile.get` | `remoet.api.profile.get` | `read` | Get the signed-in user's whole Remoet profile: contact fields, work experience, projects, education and link trees |
| `profile.getLinks` | `remoet.api.profile.getLinks` | `read` | Get the user's public profile links (website, GitHub, LinkedIn and more); private links come back null |
| `profile.update` | `remoet.api.profile.update` | `write` | Update the user's phone, url, location, githubUrl or linkedinUrl on their Remoet profile (500 characters max each) |
| `projects.list` | `remoet.api.projects.list` | `read` | List the projects on the user profile |
| `stars.create` | `remoet.api.stars.create` | `write` | Star a company on Remoet by its slug so its jobs reach the user feed. Stars are capped per user and removing one uses a limited budget, so confirm before starring |
| `workExperience.list` | `remoet.api.workExperience.list` | `read` | List the user's work experience (their employment history, not job postings) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/remoet

## License

Apache-2.0
