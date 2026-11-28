# @corsair-dev/dub

Dub (dub.co) for Corsair: short links, analytics and events, QR codes, tags, domains, folders, customers, the Partners program, and signed webhooks.

## Install

```bash
pnpm add @corsair-dev/dub
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analytics.retrieve` | `dub.api.analytics.retrieve` | `read` | Read aggregated click, lead and sale analytics, grouped by count, timeseries, country, device, link and more |
| `bounties.approveSubmission` | `dub.api.bounties.approveSubmission` | `destructive` | Approve a bounty submission: approve a bounty submission. Optionally specify a custom reward amount. (awards the bounty reward) |
| `bounties.listSubmissions` | `dub.api.bounties.listSubmissions` | `read` | List bounty submissions: list all submissions for a specific bounty in your partner program. |
| `bounties.rejectSubmission` | `dub.api.bounties.rejectSubmission` | `destructive` | Reject a bounty submission: reject a bounty submission with a specified reason and optional note. (notifies the partner) |
| `commissions.bulkUpdate` | `dub.api.commissions.bulkUpdate` | `destructive` | Bulk update commissions: bulk update up to 100 commissions with the same status. (changes what partners are paid) |
| `commissions.create` | `dub.api.commissions.create` | `destructive` | Create commission: create one or more commissions (custom, lead or sale) for a partner. Custom commissions accept a negative `amount` to create a clawback. Commission creation… (creates a commission owed to a partner) |
| `commissions.list` | `dub.api.commissions.list` | `read` | List all commissions: retrieve a paginated list of commissions for your partner program. |
| `commissions.update` | `dub.api.commissions.update` | `destructive` | Update a commission: update an existing commission amount. This is useful for handling refunds (partial or full) or fraudulent sales. (changes what a partner is paid) |
| `customers.delete` | `dub.api.customers.delete` | `destructive` | Permanently delete a customer; past events keep their recorded data |
| `customers.get` | `dub.api.customers.get` | `read` | Retrieve one customer by their Dub id, or their externalId prefixed with ext_ |
| `customers.list` | `dub.api.customers.list` | `read` | List customers with filters and cursor paging; the next cursor is the last customer id |
| `customers.update` | `dub.api.customers.update` | `write` | Update a customer email, name, avatar or country |
| `discountCodes.create` | `dub.api.discountCodes.create` | `destructive` | Create a discount code: create a discount code for a partner. The partner's group must already have a discount assigned to it, and the discount code must be associated with a link… (creates a live discount code) |
| `discountCodes.delete` | `dub.api.discountCodes.delete` | `destructive` | Delete a discount code: delete a discount code for a partner by its unique ID or alphanumeric code. This will also disable the code in your connected discount provider (Stripe,… (deletes the code; customers can no longer use it) |
| `discountCodes.list` | `dub.api.discountCodes.list` | `read` | List discount codes: retrieve a paginated list of discount codes in a program or filtered by partner, discount, or code. |
| `domains.checkStatus` | `dub.api.domains.checkStatus` | `read` | Check the availability of one or more domains: check if a domain name is available for purchase. You can check multiple domains at once. |
| `domains.create` | `dub.api.domains.create` | `write` | Add a domain to the workspace; it still needs DNS verification in the dashboard |
| `domains.delete` | `dub.api.domains.delete` | `destructive` | Permanently delete a domain; its links stop resolving and analytics are not restored on recreate |
| `domains.list` | `dub.api.domains.list` | `read` | List the workspace domains with search and page paging |
| `domains.register` | `dub.api.domains.register` | `destructive` | Register a domain: register a domain for the authenticated workspace. Only available for Enterprise Plans. (claims a .link domain for the workspace) |
| `domains.update` | `dub.api.domains.update` | `write` | Update a domain or rename it with newSlug; redirects and branding are editable here |
| `embedTokens.createReferrals` | `dub.api.embedTokens.createReferrals` | `write` | Create a referrals embed token: create a referrals embed token for the given partner/tenant. The endpoint first attempts to locate an existing enrollment using the provided tenantId. If no… |
| `events.list` | `dub.api.events.list` | `read` | List raw click, lead and sale events with filters, newest first |
| `folders.create` | `dub.api.folders.create` | `write` | Create a folder to group links, with an access level |
| `folders.delete` | `dub.api.folders.delete` | `destructive` | Permanently delete a folder; its links keep existing |
| `folders.list` | `dub.api.folders.list` | `read` | List folders with search and page paging |
| `folders.update` | `dub.api.folders.update` | `write` | Rename a folder, change its description or access level |
| `links.bulkCreate` | `dub.api.links.bulkCreate` | `write` | Create up to 100 links in one call; the answer carries one row per link, including per-link errors |
| `links.bulkDelete` | `dub.api.links.bulkDelete` | `destructive` | Permanently delete up to 100 links in one call; their analytics are not recoverable |
| `links.bulkUpdate` | `dub.api.links.bulkUpdate` | `write` | Apply one set of field changes to up to 100 links named by id or externalId |
| `links.count` | `dub.api.links.count` | `read` | Count links matching the filters, optionally grouped by domain, tag, folder or user |
| `links.create` | `dub.api.links.create` | `write` | Create a short link; a duplicate domain and slug answers 409 conflict |
| `links.delete` | `dub.api.links.delete` | `destructive` | Permanently delete a short link; recreating it does not restore its analytics |
| `links.get` | `dub.api.links.get` | `read` | Retrieve one link by id, externalId, or a domain and slug pair |
| `links.list` | `dub.api.links.list` | `read` | List short links with filters and cursor paging; the next cursor is the last link id |
| `links.update` | `dub.api.links.update` | `write` | Update a short link by id (or externalId prefixed with ext_) |
| `links.upsert` | `dub.api.links.upsert` | `write` | Create a link, or return and update the existing link with the same destination url; a different key renames that link's slug, so use links.update to change one specific link |
| `messages.create` | `dub.api.messages.create` | `destructive` | Send a message to a partner: send a direct message from your partner program to a partner. Until the partner replies, you can only send one message to a partner who isn't enrolled in your… (sends a message to the partner) |
| `messages.list` | `dub.api.messages.list` | `read` | List all messages: retrieve a paginated list of direct messages between your partner program and its partners, newest first. |
| `partners.analytics` | `dub.api.partners.analytics` | `read` | Retrieve analytics for a partner: retrieve analytics for a partner within a program. The response type vary based on the `groupBy` query parameter. |
| `partners.attributeReferringPartner` | `dub.api.partners.attributeReferringPartner` | `destructive` | Attribute a referring partner: attribute a partner to the partner who referred them. Both partners must be approved in your program, and a partner can only be attributed once. When… (can create commissions for past events) |
| `partners.ban` | `dub.api.partners.ban` | `destructive` | Ban a partner: ban a partner from your program. This will disable all links and mark all commissions as canceled. (bans the partner from the program) |
| `partners.create` | `dub.api.partners.create` | `write` | Create or update a partner: creates a partner and enrolls them in the program. If that email is already enrolled, the enrollment is returned unchanged, except a different `tenantId`… |
| `partners.createLink` | `dub.api.partners.createLink` | `write` | Create a link for a partner: create a link for a partner that is enrolled in your program. |
| `partners.deactivate` | `dub.api.partners.deactivate` | `destructive` | Deactivate a partner: this will deactivate the partner from your program and disable all their active links. Their commissions and payouts will remain intact. You can reactivate… (removes the partner and disables their links) |
| `partners.list` | `dub.api.partners.list` | `read` | List all partners: list all partners for a partner program. |
| `partners.listLinks` | `dub.api.partners.listLinks` | `read` | Retrieve a partner's links: retrieve a partner's links by their partner ID or tenant ID. |
| `partners.listNetwork` | `dub.api.partners.listNetwork` | `read` | List all partners in the network: list the partners in the Dub partner network for your program. The partner network must be enabled for the program. |
| `partners.updateGroup` | `dub.api.partners.updateGroup` | `write` | Update the group of partners: move up to 100 partners enrolled in your program into a group. They get the group's rewards and discount. Partners already in the group are skipped, unless… |
| `partners.updateTags` | `dub.api.partners.updateTags` | `write` | Update the tags of partners: add and remove partner tags on up to 100 partners enrolled in your program. Tags that a partner already has are not added again, and tags a partner does not… |
| `partners.upsertLink` | `dub.api.partners.upsertLink` | `write` | Upsert a link for a partner: upsert a link for a partner that is enrolled in your program. If a link with the same URL already exists, return it (or update it if there are any changes).… |
| `payouts.list` | `dub.api.payouts.list` | `read` | List all payouts: retrieve a paginated list of payouts for your partner program. |
| `programApplications.approve` | `dub.api.programApplications.approve` | `destructive` | Approve a partner application: approve a pending partner application to your program. The partner will be enrolled in the specified group and notified of the approval. (enrolls the partner and emails them) |
| `programApplications.list` | `dub.api.programApplications.list` | `read` | List all program applications: retrieve a paginated list of applications for your partner program. Filter by `status` to list pending, approved, or rejected applications. |
| `programApplications.reject` | `dub.api.programApplications.reject` | `destructive` | Reject a partner application: reject a pending partner application to your program. The partner will be notified via email that their application was not approved. (emails the partner) |
| `qr.get` | `dub.api.qr.get` | `read` | Generate an SVG QR code for a URL; the document comes back as the svg string |
| `tags.create` | `dub.api.tags.create` | `write` | Create a tag with an optional color |
| `tags.delete` | `dub.api.tags.delete` | `destructive` | Permanently delete a tag and remove it from every link |
| `tags.list` | `dub.api.tags.list` | `read` | List tags with search, sorting and page paging |
| `tags.update` | `dub.api.tags.update` | `write` | Rename a tag or change its color |
| `track.lead` | `dub.api.track.lead` | `destructive` | Record a lead conversion attributed to a click; there is no delete, so a tracked lead cannot be undone |
| `track.open` | `dub.api.track.open` | `write` | Track a deep link open event: this endpoint is used to track when a user opens your app via a Dub-powered deep link (for both iOS and Android). |
| `track.sale` | `dub.api.track.sale` | `destructive` | Record a sale conversion in cents attributed to a customer; invoiceId deduplicates, but a tracked sale cannot be undone |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 14 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dub

## License

Apache-2.0
