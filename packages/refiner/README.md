# @corsair-dev/refiner

Refiner plugin for Corsair - identify users, track events, store and tag survey responses, read NPS/CSAT reports, and manage contacts, surveys and segments.

## Install

```bash
pnpm add @corsair-dev/refiner
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `refiner.api.account.get` | `read` | Read the subscription plan, monthly usage against each limit, and the environments in the account |
| `contacts.delete` | `refiner.api.contacts.delete` | `destructive` | Delete a contact and all their survey responses; overwrite traits with users.identify instead when the responses must survive |
| `contacts.get` | `refiner.api.contacts.get` | `read` | Read one contact and everything on record for them by user ID, email or Refiner UUID |
| `contacts.list` | `refiner.api.contacts.list` | `read` | List contacts with their traits, segments and account, filtered by survey or segment |
| `forms.archive` | `refiner.api.forms.archive` | `write` | Archive a survey; Refiner archives rather than deletes, and an archived survey still appears under all_with_archived |
| `forms.duplicate` | `refiner.api.forms.duplicate` | `write` | Duplicate a survey into a new draft under a new name |
| `forms.history` | `refiner.api.forms.history` | `read` | List the previous versions of a survey, each with its full configuration and question set |
| `forms.list` | `refiner.api.forms.list` | `read` | List surveys by state, optionally with their configuration and response and view counts |
| `forms.publish` | `refiner.api.forms.publish` | `write` | Publish a survey, or unpublish it with published: false so it stops collecting |
| `reporting.get` | `refiner.api.reporting.get` | `read` | Compute an NPS, CSAT, ratings, distribution or count report over a date range and any filters |
| `responses.list` | `refiner.api.responses.list` | `read` | List survey responses and views, filtered by survey, segment, tag, date, answers or contact traits |
| `responses.store` | `refiner.api.responses.store` | `write` | Store a survey response for a user, attaching it to an existing survey; use it to import history or feed a custom survey UI |
| `responses.tag` | `refiner.api.responses.tag` | `write` | Add tags to an existing survey response, up to 20 |
| `segments.list` | `refiner.api.segments.list` | `read` | List segments, reporting whether each is hand-curated or computed |
| `segments.sync` | `refiner.api.segments.sync` | `write` | Add a user to a manual segment, or remove them, creating the contact when no match exists |
| `users.identify` | `refiner.api.users.identify` | `write` | Identify a user by ID or email, creating the contact on first sight and attaching any traits you send |
| `users.track` | `refiner.api.users.track` | `write` | Track a named event for a user, creating the contact when no match exists |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/refiner

## License

Apache-2.0
