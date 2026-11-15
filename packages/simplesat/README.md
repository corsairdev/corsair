# @corsair-dev/simplesat

Customer feedback from Simplesat: manage customers and team members, list surveys and questions, search and read responses and answers, and send a survey by email.

## Install

```bash
pnpm add @corsair-dev/simplesat
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `answers.get` | `simplesat.api.answers.get` | `read` | Read one answer with its question, chosen option, sentiment and comment |
| `answers.search` | `simplesat.api.answers.search` | `read` | Search answers by date range and filters such as sentiment, across every survey |
| `answers.update` | `simplesat.api.answers.update` | `write` | Change an answer's chosen option, comment or sentiment. The question and survey it belongs to are fixed |
| `customers.bulk` | `simplesat.api.customers.bulk` | `write` | Queue many customer upserts in one request. The answer carries a request_id rather than the stored records, because the write is queued |
| `customers.create` | `simplesat.api.customers.create` | `write` | Create or update a customer. Simplesat matches on external_id or email, so it is an upsert rather than a plain create |
| `customers.get` | `simplesat.api.customers.get` | `read` | Read one customer by their Simplesat id or external id, with their tags and custom attributes |
| `customers.list` | `simplesat.api.customers.list` | `read` | List customers with filters for when they were created or modified and whether they are subscribed; follow `next` for the following page |
| `customers.update` | `simplesat.api.customers.update` | `write` | Update one customer by their Simplesat id or external id, replacing the fields sent |
| `questions.list` | `simplesat.api.questions.list` | `read` | List the questions behind the surveys, filtered by survey or metric, with their types and choices |
| `responses.create` | `simplesat.api.responses.create` | `write` | Create a response, or update the one that already matches it. `created` backdates it, which is how a survey answered elsewhere is imported |
| `responses.get` | `simplesat.api.responses.get` | `read` | Read one response with its survey, customer, answers and team members |
| `responses.search` | `simplesat.api.responses.search` | `read` | Search responses by date range and filters such as customer email, with each response's answers and team members |
| `responses.update` | `simplesat.api.responses.update` | `write` | Update one response by id. The body takes the same shape as a create, so the whole response is sent back |
| `surveys.email` | `simplesat.api.surveys.email` | `write` | Send a survey to one customer by email. This notifies a real person, and the survey is identified by its token |
| `surveys.list` | `simplesat.api.surveys.list` | `read` | List the surveys on the account with their metric, type and survey_token |
| `teamMembers.create` | `simplesat.api.teamMembers.create` | `write` | Create or update a team member, which is how a response is attributed to the person who handled it |
| `teamMembers.get` | `simplesat.api.teamMembers.get` | `read` | Read one team member with their groups and custom attributes |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/simplesat

## License

Apache-2.0
