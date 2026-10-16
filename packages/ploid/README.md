# @corsair-dev/ploid

Ploid plugin for Corsair. Ploid is an agent-native people API: evidence-backed
people search, identity resolution, deep person profiles, and contact
enrichment.

## Install

```bash
pnpm add @corsair-dev/ploid
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `search.search` | `ploid.api.search.search` | `write` | Search people by semantic query and hard filters; up to 150 results inline, larger or async searches hand off to a People Set (202) |
| `search.candidates` | `ploid.api.search.candidates` | `write` | Find candidate identities in the people index for 1 ACU, including zero matches |
| `person.resolve` | `ploid.api.person.resolve` | `write` | Identify one person from a name plus a clue and return the permanent person_id; 2 ACU when found, free when not |
| `person.get` | `ploid.api.person.get` | `write` | Fetch a reviewed deep person profile (25 ACU first profile) or start a durable research run (202) |
| `person.getRun` | `ploid.api.person.getRun` | `read` | Poll a person research run by id; 404 unknown, 410 expired |
| `person.cancelRun` | `ploid.api.person.cancelRun` | `destructive` | Cancel a queued or running person research run |
| `contacts.enrich` | `ploid.api.contacts.enrich` | `write` | Resolve contact fields (work_email 1, personal_email 3, phone 10 ACU per hit) from a person_id, LinkedIn URL, email, or name plus company domain |
| `account.credits` | `ploid.api.account.credits` | `read` | Read the workspace ACU balance and API key budget state |
| `account.usage` | `ploid.api.account.usage` | `read` | Read workspace ACU usage plus the calling key id and active key count |

## Auth

Auth: API key (Bearer token). Create a key in Ploid workspace settings under
API keys; it is sent as `Authorization: Bearer <key>`. Corsair prompts your
tenant for credentials on first use. Keys carry scopes (`people:search`,
`people:enrich`, `account:read`); the endpoints above need the matching scope.

## Billing

Ploid bills in ACU (1 ACU = $0.10). New accounts start with 50 ACU for 30
days. Per endpoint: candidates 1 ACU per completed search (zero matches still
bill); search 1 ACU plus 1 ACU per returned person; resolve 2 ACU only when a
person is found; person profile exactly 25 ACU on first success with
organization-wide rereads free for 90 days; enrich pays per hit (1 work email,
3 personal email, 10 phone). Failed requests are not charged.

## Rate limits

Two buckets apply per request, organization plan and API key, and the lower
one wins: free 10/min, pay-as-you-go 30/min, API plans 300/min, Scale and
Teams 1000/min. Every 429 carries `Retry-After` (plus
`error.retry_after_seconds` in the body). This plugin retries 429 four
attempts total honoring `Retry-After`, retries transient 5xx three attempts
(billed-failure free per the docs), and fails fast on everything else.

## Data notes

- `person.resolve` treats a no-match as data (`found: false`), not an error.
- `person.get` returns either a profile (200) or a durable run (202) with a
  `run_id` to poll via `person.getRun`; an uncertain identity completes as
  `data: null` with `meta.resolution = unsure` and is free.
- `contacts.enrich` sends the documented flat body with
  `response_format: standard` and reports per-field `found`, `not_found`, or
  `unavailable` statuses; only found fields bill.
- Resolved people (and enrichments keyed by person_id) are merged into a
  `people` entity keyed by the stable Ploid `person_id`.

## Not implemented

- Webhooks: Ploid has no inbound webhook system. Async People Sets accept a
  `webhook_url` passthrough with no documented signature scheme, and person
  runs are polled; this plugin polls instead of receiving pushes.
- `/v1/harness/*`: Ploid's own agent chat surface; the agent orchestrating
  Corsair is the caller's, not Ploid's.
- `/v1/linkedin/*`, `/v1/github/*`, `/v1/socials`: secondary discovery
  surfaces with separate, tighter rate buckets (60/min, 600/hour).
- `/v1/monitors/*`: change monitoring; a coherent follow-up plugin surface.
- `/v1/datasets` and Sets item paging: preview surfaces.
- `PATCH /v1/account/profile`, `DELETE /v1/account/key`: account management,
  the latter destructively revokes the calling key.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ploid

## License

Apache-2.0
