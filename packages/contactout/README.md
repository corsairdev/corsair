# @corsair-dev/contactout

ContactOut plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/contactout
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.stats` | `contactout.api.account.stats` | `read` | Get email, phone, and search credit usage for a month |
| `company.enrichDomains` | `contactout.api.company.enrichDomains` | `read` | Get company details for up to 30 domains |
| `company.search` | `contactout.api.company.search` | `read` | Search companies by name, domain, size, location, industry, technology, revenue, or founding year |
| `email.enrich` | `contactout.api.email.enrich` | `read` | Get the profile behind an email address |
| `email.toLinkedin` | `contactout.api.email.toLinkedin` | `read` | Get the LinkedIn profile URL for an email address |
| `email.verify` | `contactout.api.email.verify` | `read` | Verify whether an email address is deliverable |
| `linkedin.contactInfo` | `contactout.api.linkedin.contactInfo` | `read` | Get only the emails and phones for a LinkedIn profile |
| `linkedin.enrich` | `contactout.api.linkedin.enrich` | `read` | Get a full LinkedIn profile with emails and phones; emailType picks the work or personal key |
| `linkedin.personalEmailStatus` | `contactout.api.linkedin.personalEmailStatus` | `read` | Check whether a LinkedIn profile has a personal email (free) |
| `linkedin.phoneStatus` | `contactout.api.linkedin.phoneStatus` | `read` | Check whether a LinkedIn profile has a phone number (free) |
| `linkedin.workEmailStatus` | `contactout.api.linkedin.workEmailStatus` | `read` | Check whether a LinkedIn profile has a work email (free) |
| `people.count` | `contactout.api.people.count` | `read` | Count profiles matching search filters (free) |
| `people.decisionMakers` | `contactout.api.people.decisionMakers` | `read` | List a company's decision makers by domain, name, or LinkedIn URL |
| `people.enrich` | `contactout.api.people.enrich` | `read` | Find a profile from a LinkedIn URL, email, phone, or name plus company, school, or location |
| `people.search` | `contactout.api.people.search` | `read` | Search profiles by title, company, location, skills, and more, 25 per page |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/contactout

## License

Apache-2.0
