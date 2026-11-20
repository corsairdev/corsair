# @corsair-dev/needle

Needle plugin for Corsair: manage leads and their LinkedIn and Instagram identities, run campaigns and enroll or stop leads, keep suppression lists, search places and preview composed messages.

## Install

```bash
pnpm add @corsair-dev/needle
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.me` | `needle.api.account.me` | `read` | Read the user and organization the API key belongs to, with the key’s role |
| `campaigns.create` | `needle.api.campaigns.create` | `write` | Create a campaign in draft from a sequence graph; it contacts nobody until campaigns.update sets it active |
| `campaigns.delete` | `needle.api.campaigns.delete` | `destructive` | Archive a campaign: it stops sending and leaves the active list, and the record is kept |
| `campaigns.enroll` | `needle.api.campaigns.enroll` | `write` | Enroll up to 500 leads at once, with one result per lead so a batch can partly succeed; an enrolled lead can be contacted |
| `campaigns.get` | `needle.api.campaigns.get` | `read` | Read one campaign, including its sequence graph and status |
| `campaigns.leads` | `needle.api.campaigns.leads` | `read` | Page through the leads enrolled in a campaign with their status |
| `campaigns.list` | `needle.api.campaigns.list` | `read` | Page through campaigns, optionally filtered by status |
| `campaigns.stats` | `needle.api.campaigns.stats` | `read` | Read a campaign’s progress and funnel: invites, messages, replies, and why leads were skipped |
| `campaigns.stopLeads` | `needle.api.campaigns.stopLeads` | `write` | Stop leads in a campaign so no further step reaches them, keeping them in the list |
| `campaigns.update` | `needle.api.campaigns.update` | `write` | Rename a campaign, replace its graph, or set active to start sending and paused to halt it |
| `compose.preview` | `needle.api.compose.preview` | `read` | Preview an AI-composed message for a lead without sending it, with the context sources it used |
| `leads.create` | `needle.api.leads.create` | `write` | Create a lead with a LinkedIn or Instagram identity; a duplicate identity is refused with 409, so use leads.upsert to merge instead |
| `leads.delete` | `needle.api.leads.delete` | `destructive` | Delete a lead and its identities permanently; there is no restore call |
| `leads.get` | `needle.api.leads.get` | `read` | Read one lead by id, with its identities and live enrollment |
| `leads.list` | `needle.api.leads.list` | `read` | Page through the workspace’s leads by cursor |
| `leads.search` | `needle.api.leads.search` | `read` | Search leads by free text and structured filters, combined with AND, paged by cursor |
| `leads.update` | `needle.api.leads.update` | `write` | Patch a lead’s fields by id; sending identities replaces the whole set rather than adding to it |
| `leads.upsert` | `needle.api.leads.upsert` | `write` | Create the lead, or patch the fields onto the one an identity already belongs to, reporting created or matched |
| `places.search` | `needle.api.places.search` | `read` | Search places by free text or around a point, returning addresses, coordinates and websites |
| `suppressions.check` | `needle.api.suppressions.check` | `read` | Check up to 1000 identities against the suppression list and answer contactable with the reason when not |
| `suppressions.create` | `needle.api.suppressions.create` | `write` | Suppress up to 1000 leads or company domains, with counts for what was created and what was already listed |
| `suppressions.delete` | `needle.api.suppressions.delete` | `destructive` | Remove a suppression entry, which makes that person or domain contactable again |
| `suppressions.list` | `needle.api.suppressions.list` | `read` | Page through suppression entries, optionally filtered by reason |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/needle

## License

Apache-2.0
