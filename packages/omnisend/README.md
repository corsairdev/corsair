# @corsair-dev/omnisend

Omnisend plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/omnisend
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `batches.create` | `omnisend.api.batches.create` | `write` | Queue up to 100 contact, product, category or event writes that Omnisend applies one by one, and read the batch back with batches.get until it is finished or stopped |
| `batches.get` | `omnisend.api.batches.get` | `read` | Read a batch status and counts; pending and inProgress mean it still runs, finished and stopped mean it ended |
| `batches.list` | `omnisend.api.batches.list` | `read` | Page the batches for one endpoint; categories batches cannot be listed |
| `batches.listItems` | `omnisend.api.batches.listItems` | `read` | Read the per-item requests, responses and errors of a batch |
| `campaigns.cancel` | `omnisend.api.campaigns.cancel` | `write` | Cancel a scheduled, paused or started-email campaign; sent campaigns cannot be canceled |
| `campaigns.copy` | `omnisend.api.campaigns.copy` | `write` | Duplicate a campaign as a new draft |
| `campaigns.create` | `omnisend.api.campaigns.create` | `write` | Create a campaign; a regular email campaign needs a template id, and creating with no verified sender answers 422 |
| `campaigns.delete` | `omnisend.api.campaigns.delete` | `destructive` | Delete a campaign; it cannot be restored |
| `campaigns.get` | `omnisend.api.campaigns.get` | `read` | Read one campaign by id, with its content and sending settings |
| `campaigns.getUtm` | `omnisend.api.campaigns.getUtm` | `read` | Read the UTM tags stamped on a campaign links |
| `campaigns.list` | `omnisend.api.campaigns.list` | `read` | Page the campaigns, filtered by status, channel, type, name or dates |
| `campaigns.restoreToDraft` | `omnisend.api.campaigns.restoreToDraft` | `write` | Move a scheduled campaign back to draft |
| `campaigns.send` | `omnisend.api.campaigns.send` | `write` | Send a draft campaign to its audience. This cannot be undone, and it answers 402 when the audience exceeds the billing tier |
| `campaigns.sendTestEmail` | `omnisend.api.campaigns.sendTestEmail` | `write` | Render a campaign and email it to 1-5 addresses, so no customer receives it |
| `campaigns.setUtm` | `omnisend.api.campaigns.setUtm` | `write` | Set the UTM tags stamped on a campaign links |
| `campaigns.update` | `omnisend.api.campaigns.update` | `write` | Change a draft campaign; started or scheduled campaigns answer 409 |
| `categories.create` | `omnisend.api.categories.create` | `write` | Create a product category under your own category ID |
| `categories.delete` | `omnisend.api.categories.delete` | `destructive` | Delete a product category |
| `categories.get` | `omnisend.api.categories.get` | `read` | Read one product category by your own category ID |
| `categories.list` | `omnisend.api.categories.list` | `read` | Page the product categories |
| `categories.update` | `omnisend.api.categories.update` | `write` | Rename a product category |
| `contacts.addTags` | `omnisend.api.contacts.addTags` | `write` | Queue tags onto up to 250 contacts by id, email or phone, or every contact in a segment; the route answers 202 and the tags appear shortly after |
| `contacts.get` | `omnisend.api.contacts.get` | `read` | Read one contact by id, with its identifiers and consents |
| `contacts.list` | `omnisend.api.contacts.list` | `read` | Page the brand contacts, filtered by email, phone, status, segment or tag |
| `contacts.removeTags` | `omnisend.api.contacts.removeTags` | `write` | Queue tag removal for up to 250 contacts by id, email or phone, or every contact in a segment; the route answers 202 and the tags disappear shortly after |
| `contacts.update` | `omnisend.api.contacts.update` | `write` | Change a contact by id; sent tags replace the existing ones, so removing one tag means sending the rest |
| `contacts.updateByEmail` | `omnisend.api.contacts.updateByEmail` | `write` | Change the contact an email address matches; sent tags replace the existing ones |
| `contacts.upsert` | `omnisend.api.contacts.upsert` | `write` | Create a contact, or update the one an identifier already matches; sent tags replace the existing ones |
| `emailContent.get` | `omnisend.api.emailContent.get` | `read` | Read the content of a campaign email by id |
| `emailContent.render` | `omnisend.api.emailContent.render` | `read` | Render a campaign email to its HTML for preview; nothing is sent and no state changes |
| `emailContent.replace` | `omnisend.api.emailContent.replace` | `write` | Replace a campaign email content in full; omitted fields drop to their defaults |
| `events.defineSchema` | `omnisend.api.events.defineSchema` | `write` | Declare a custom event schema and its property types; a type, once declared, cannot change |
| `events.queryMetadata` | `omnisend.api.events.queryMetadata` | `read` | List the event schemas the brand knows, per category, with their declared property types |
| `events.send` | `omnisend.api.events.send` | `write` | Record an event for a contact, which creates or updates that contact and can trigger automations that email real customers. The event is queued (202) and append-only: it cannot be edited, read back or deleted |
| `events.updateSchema` | `omnisend.api.events.updateSchema` | `write` | Merge changes into an event schema; the properties present change and none are deleted, and a declared type cannot change |
| `products.create` | `omnisend.api.products.create` | `write` | Create a catalog product with at least one variant; prices are floats in the store currency |
| `products.delete` | `omnisend.api.products.delete` | `destructive` | Delete a product from the catalog |
| `products.get` | `omnisend.api.products.get` | `read` | Read one product by your own product ID, with its variants and prices |
| `products.list` | `omnisend.api.products.list` | `read` | Page the catalog products, filtered by title or dates |
| `products.replace` | `omnisend.api.products.replace` | `write` | Replace a product in full; omitted fields drop to their defaults |
| `templates.create` | `omnisend.api.templates.create` | `write` | Create an email template with a name and editor sections |
| `templates.delete` | `omnisend.api.templates.delete` | `destructive` | Delete an email template |
| `templates.get` | `omnisend.api.templates.get` | `read` | Read one email template by id, with its sections and styles |
| `templates.importFromHtml` | `omnisend.api.templates.importFromHtml` | `write` | Import raw HTML, up to 1 MB, as a new email template Omnisend converts to editor sections |
| `templates.list` | `omnisend.api.templates.list` | `read` | Page the email templates, filtered by name |
| `templates.render` | `omnisend.api.templates.render` | `read` | Render a template to its HTML for preview; nothing is sent and no state changes |
| `templates.replace` | `omnisend.api.templates.replace` | `write` | Replace an email template in full; omitted fields drop to their defaults |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/omnisend

## License

Apache-2.0
