# @corsair-dev/omnisend

Email and SMS marketing with Omnisend: contacts and tags, campaigns (send, A/B tests, UTM), automations, segments, email templates and layouts, forms, products and categories, events, images, analytics reports and batches (108 operations).

## Install

```bash
pnpm add @corsair-dev/omnisend
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analytics.generateReport` | `omnisend.api.analytics.generateReport` | `read` | Generate report. Returns aggregated marketing analytics grouped by message send date. Covers delivery, engagement, and revenue attribution metrics for campaigns and automations. Supports optional dimensions (timestamp, channel, activity), filters, and up to 4 queries per request. |
| `analytics.generateStatistics` | `omnisend.api.analytics.generateStatistics` | `read` | Generate report. Returns aggregated marketing analytics grouped by event date (when opens, clicks, orders actually occurred). Covers delivery, engagement, revenue attribution, and audience growth metrics. Requires a timestamp dimension. |
| `automations.copy` | `omnisend.api.automations.copy` | `write` | Copy automation workflow. Create a copy of an existing automation workflow. The copy is always created in a disabled state, regardless of the source automation's status. The request body is optional. When provided, you can specify a custom name for the copy. |
| `automations.create` | `omnisend.api.automations.create` | `write` | Create automation workflow. Create a new automation workflow. |
| `automations.delete` | `omnisend.api.automations.delete` | `destructive` | Delete automation workflow. Delete a single automation workflow by ID. This operation is idempotent — deleting a non-existent automation returns a success response. Cannot be undone. |
| `automations.deleteSchedule` | `omnisend.api.automations.deleteSchedule` | `destructive` | Delete automation workflow schedule. Remove the scheduled start and end of an automation workflow. isEnabled is not changed. This operation is idempotent — deleting a schedule that does not exist returns a success response. Cannot be undone. |
| `automations.disable` | `omnisend.api.automations.disable` | `write` | Disable automation workflow. Disable an automation workflow. Once disabled, the workflow stops accepting new trigger events. Use contactsInWorkflow to control what happens to contacts currently progressing through the workflow: - keep: contacts remain and continue through the remaining blocks until completion. |
| `automations.enable` | `omnisend.api.automations.enable` | `destructive` | Enable automation workflow. Enable an automation workflow. Once enabled, the workflow starts processing trigger events in real time. The request body is optional. Use enrollExisting to also enroll contacts who already qualify at the time of enabling. An enabled automation emails or texts contacts on its own whenever its trigger fires. |
| `automations.get` | `omnisend.api.automations.get` | `read` | Get automation workflow. Get a single automation workflow by ID. |
| `automations.getBlockUtm` | `omnisend.api.automations.getBlockUtm` | `read` | Get UTM tags for an automation block. Retrieve UTM tracking tags for a specific send-action block. Missing or cleared tags are returned with their default values. |
| `automations.getSchedule` | `omnisend.api.automations.getSchedule` | `read` | Get automation workflow schedule. Get the scheduled start and end of an automation workflow. Returns 204 No Content when the workflow has no schedule. |
| `automations.getUtm` | `omnisend.api.automations.getUtm` | `read` | Get aggregated UTM tags for all blocks. Retrieve UTM tracking tags for all send-action blocks in an automation. Each block's tags include default-value synthesis for missing fields. |
| `automations.list` | `omnisend.api.automations.list` | `read` | List automation workflows. List automation workflows with filtering, sorting, and cursor-based pagination. |
| `automations.replaceBlocks` | `omnisend.api.automations.replaceBlocks` | `write` | Replace automation workflow blocks. Replace the full block tree for an automation workflow. Blocks identified by id are updated in place. Blocks identified by temporaryID are created as new blocks. Existing blocks not included in this array are removed. Enabled automations cannot be restructured. |
| `automations.sendBlockTestEmail` | `omnisend.api.automations.sendBlockTestEmail` | `destructive` | Send test email. Send the saved email content of a specific email block as a test email to up to 5 recipients. The email is rendered and delivered asynchronously. Sends a real email to the given addresses. |
| `automations.setBlockUtm` | `omnisend.api.automations.setBlockUtm` | `write` | Update UTM tags for an automation block. Set UTM tracking tags for a specific send-action block. All three tag fields are replaced atomically. Send an empty string to clear a field — the next read will return its default value. |
| `automations.setSchedule` | `omnisend.api.automations.setSchedule` | `write` | Save automation workflow schedule. Schedule when an automation workflow is enabled (startAt), disabled (endAt), or both. The request replaces the whole schedule. Saving a schedule does not change isEnabled. - startAt can be set only for a disabled workflow. At startAt the workflow is enabled the same way as with the enable action. |
| `automations.update` | `omnisend.api.automations.update` | `write` | Patch automation workflow. Partially update an automation workflow. Only the fields provided in the request body are updated. Enabled automations cannot be patched. Disable the automation via POST /automations/{id}/disable, make changes, then re-enable via POST /automations/{id}/enable when ready. |
| `batches.create` | `omnisend.api.batches.create` | `destructive` | Queue up to 100 contact, product, category or event writes that Omnisend applies one by one, and read the batch back with batches.get until it is finished or stopped. An events batch can start automations that message customers, like events.send. |
| `batches.get` | `omnisend.api.batches.get` | `read` | Read a batch status and counts; pending and inProgress mean it still runs, finished and stopped mean it ended. |
| `batches.list` | `omnisend.api.batches.list` | `read` | Page the batches for one endpoint; categories batches cannot be listed. |
| `batches.listItems` | `omnisend.api.batches.listItems` | `read` | Read the per-item requests, responses and errors of a batch. |
| `brands.connect` | `omnisend.api.brands.connect` | `write` | Connect brand. With this endpoint you can connect your site to Omnisend. Note it's only possible to connect store with oAuth flow. Links the brand to an ecommerce platform; meant for platform apps. |
| `brands.getCurrent` | `omnisend.api.brands.getCurrent` | `read` | Get information about brand. With this endpoint you can get brand's information. |
| `campaigns.cancel` | `omnisend.api.campaigns.cancel` | `write` | Cancel a scheduled, paused or started-email campaign; sent campaigns cannot be canceled. |
| `campaigns.copy` | `omnisend.api.campaigns.copy` | `write` | Duplicate a campaign as a new draft. |
| `campaigns.create` | `omnisend.api.campaigns.create` | `write` | Create a campaign; a regular email campaign needs a template id, and creating with no verified sender answers 422. |
| `campaigns.delete` | `omnisend.api.campaigns.delete` | `destructive` | Delete a campaign; it cannot be restored. |
| `campaigns.get` | `omnisend.api.campaigns.get` | `read` | Read one campaign by id, with its content and sending settings. |
| `campaigns.getUtm` | `omnisend.api.campaigns.getUtm` | `read` | Read the UTM tags stamped on a campaign links. |
| `campaigns.list` | `omnisend.api.campaigns.list` | `read` | Page the campaigns, filtered by status, channel, type, name or dates. |
| `campaigns.restoreToDraft` | `omnisend.api.campaigns.restoreToDraft` | `write` | Move a scheduled campaign back to draft. |
| `campaigns.resumeAbTest` | `omnisend.api.campaigns.resumeAbTest` | `destructive` | Resume A/B test. Resume a stopped A/B test. Automatic winner selection becomes eligible to pick this campaign again. Available only while the campaign is in stopped status. Sending to the test audience starts again. |
| `campaigns.selectAbTestWinner` | `omnisend.api.campaigns.selectAbTestWinner` | `destructive` | Select A/B test winner. Manually pick a variant as the winner. The chosen variant is routed into the send pipeline immediately. Sends the chosen variant to the rest of the audience. |
| `campaigns.send` | `omnisend.api.campaigns.send` | `destructive` | Send a draft campaign to its audience. This cannot be undone, and it answers 402 when the audience exceeds the billing tier. Sends the campaign to its whole audience; it cannot be undone. |
| `campaigns.sendTestEmail` | `omnisend.api.campaigns.sendTestEmail` | `destructive` | Render a campaign and email it to 1-5 addresses. Omnisend sends to exactly the addresses given, so use internal test inboxes, not customers. |
| `campaigns.setUtm` | `omnisend.api.campaigns.setUtm` | `write` | Set the UTM tags stamped on a campaign links. Send tags for a regular campaign or variants for an A/B test campaign, not both. |
| `campaigns.stopAbTest` | `omnisend.api.campaigns.stopAbTest` | `write` | Stop A/B test. Halt the A/B test winner-selection phase. While stopped, automatic winner selection no longer considers this campaign until it is resumed. Available only while the campaign is in started status. |
| `campaigns.update` | `omnisend.api.campaigns.update` | `write` | Change a draft campaign; started or scheduled campaigns answer 409. |
| `categories.create` | `omnisend.api.categories.create` | `write` | Create a product category under your own category ID. |
| `categories.delete` | `omnisend.api.categories.delete` | `destructive` | Delete a product category. |
| `categories.get` | `omnisend.api.categories.get` | `read` | Read one product category by your own category ID. |
| `categories.list` | `omnisend.api.categories.list` | `read` | Page the product categories. |
| `categories.update` | `omnisend.api.categories.update` | `write` | Rename a product category. |
| `contacts.addTags` | `omnisend.api.contacts.addTags` | `write` | Queue tags onto up to 250 contacts by id, email or phone, or every contact in a segment; the route answers 202 and the tags appear shortly after. |
| `contacts.get` | `omnisend.api.contacts.get` | `read` | Read one contact by id, with its identifiers and consents. |
| `contacts.list` | `omnisend.api.contacts.list` | `read` | Page the brand contacts, filtered by email, phone, status, segment or tag. |
| `contacts.removeTags` | `omnisend.api.contacts.removeTags` | `destructive` | Queue tag removal for up to 250 contacts by id, email or phone, or every contact in a segment; the route answers 202 and the tags disappear shortly after. |
| `contacts.update` | `omnisend.api.contacts.update` | `write` | Change a contact by id; sent tags replace the existing ones, so removing one tag means sending the rest. |
| `contacts.updateByEmail` | `omnisend.api.contacts.updateByEmail` | `write` | Change the contact an email address matches; sent tags replace the existing ones. |
| `contacts.upsert` | `omnisend.api.contacts.upsert` | `write` | Create a contact, or update the one an identifier already matches; sent tags replace the existing ones. |
| `contentTranslations.listLanguages` | `omnisend.api.contentTranslations.listLanguages` | `read` | Get store languages. Returns the languages available for the store's content together with the store's default language. |
| `emailContent.get` | `omnisend.api.emailContent.get` | `read` | Read the content of a campaign email by id. |
| `emailContent.render` | `omnisend.api.emailContent.render` | `read` | Render a campaign email to its HTML for preview; nothing is sent and no state changes. |
| `emailContent.replace` | `omnisend.api.emailContent.replace` | `write` | Replace a campaign email content in full; omitted fields drop to their defaults. |
| `events.defineSchema` | `omnisend.api.events.defineSchema` | `write` | Declare a custom event schema and its property types; a type, once declared, cannot change. |
| `events.queryMetadata` | `omnisend.api.events.queryMetadata` | `read` | List the event schemas the brand knows, per category, with their declared property types. |
| `events.send` | `omnisend.api.events.send` | `destructive` | Record an event for a contact, which creates or updates that contact and can trigger automations that email real customers. The event is queued (202) and append-only: it cannot be edited, read back or deleted. Omnisend's events guide asks for an origin on every event: use "api" unless your integration has its own origin. |
| `events.updateSchema` | `omnisend.api.events.updateSchema` | `write` | Merge changes into an event schema; the properties present change and none are deleted, and a declared type cannot change. |
| `formAbSetups.create` | `omnisend.api.formAbSetups.create` | `write` | Create a form A/B setup. Create a draft form A/B setup from an existing popup, flyout or fullscreen form. Only those display types are eligible; the source form becomes the setup's main form and its two variants start as identical copies that can be edited independently afterward. |
| `formAbSetups.delete` | `omnisend.api.formAbSetups.delete` | `destructive` | Delete a form A/B setup. Delete a single form A/B setup by ID. Only draft form A/B setups can be deleted; enabled or completed setups cannot. Deleting a non-existent form A/B setup succeeds (idempotent). |
| `formAbSetups.get` | `omnisend.api.formAbSetups.get` | `read` | Get a form A/B setup. Get a single form A/B setup by ID, including its main form, variant forms with their weights, status, lifecycle timestamps, and the auto-close policy configured when the test was started (if any). |
| `formAbSetups.list` | `omnisend.api.formAbSetups.list` | `read` | List form A/B setups. List form A/B setups with sorting and cursor-based pagination support. Each setup includes the auto-close policy configured when the test was started (if any). |
| `formAbSetups.selectWinner` | `omnisend.api.formAbSetups.selectWinner` | `write` | Select a form A/B setup winner. Select a winning variant for a form A/B setup by its version form ID. A winner can only be selected for an enabled (started) setup; selecting one concludes the test in favor of the chosen variant. |
| `formAbSetups.start` | `omnisend.api.formAbSetups.start` | `write` | Start a form A/B setup. Start a form A/B test by ID. Launches the A/B setup so its variants begin serving to visitors according to their weights, moving the setup to enabled status. Starting a form A/B setup that has already been started returns a conflict. |
| `forms.create` | `omnisend.api.forms.create` | `write` | Create form. Create a form with its full content and styling. New forms start in draft status and are not shown to visitors until enabled via POST /forms/{formID}/enable. Choosing a display type: - popup — modal centered over the page that dims the background. |
| `forms.delete` | `omnisend.api.forms.delete` | `destructive` | Delete form. Delete a single form by ID. Forms can be deleted in any state (draft, enabled, disabled). Deleting a non-existent form succeeds (idempotent). When the form owns an A/B test setup, the setup and its version forms are deleted as well. Cannot be undone. |
| `forms.disable` | `omnisend.api.forms.disable` | `write` | Disable form. Disable a single form by ID. Disabling stops serving the form to visitors and moves it to disabled status; the form and its content are preserved and can be enabled again later. Disabling an already disabled form succeeds (idempotent). |
| `forms.enable` | `omnisend.api.forms.enable` | `write` | Enable form. Enable a single form by ID. Enabling publishes the form and starts serving it to visitors according to its targeting rules; the form moves to enabled status. Enabling an already enabled form succeeds (idempotent). |
| `forms.get` | `omnisend.api.forms.get` | `read` | Get form. Get a single form by ID, including its content, styling, targeting rules, and status. When the form is part of an A/B test, abSetupID and abStatus identify the setup it belongs to. |
| `forms.getPeriodicReport` | `omnisend.api.forms.getPeriodicReport` | `read` | Get form periodic report. Get a time series of form performance statistics within a date range. |
| `forms.getReport` | `omnisend.api.forms.getReport` | `read` | Get form report. Get aggregated performance statistics for a single form within a date range. The response contains statistics (totals across all devices) and statisticsByDevice, the same counters split into the desktop, mobile, and tablet buckets. Device buckets with no activity in the range are omitted. |
| `forms.list` | `omnisend.api.forms.list` | `read` | List forms. List forms with sorting and cursor-based pagination support. |
| `forms.listAbSetupReports` | `omnisend.api.forms.listAbSetupReports` | `read` | List A/B setup reports for a form. Returns the results of the A/B tests of the given form. Each report covers one A/B setup and contains the period it ran for (startedAt, and completedAt once it finished), the winning version, and per-version statistics. |
| `forms.listContacts` | `omnisend.api.forms.listContacts` | `read` | Get form submitted contacts. Get the contacts that signed up through the given form, most recent first by default, together with the values they submitted (email, phone, name, address fields, discount code, and custom properties). Pagination: results are cursor-based. |
| `forms.render` | `omnisend.api.forms.render` | `read` | Render a form. Render a single form by ID and return its display steps as HTML. The form is rendered from its current stored content without enabling it or serving it to visitors, so the response can be used to preview how the form will look. |
| `forms.update` | `omnisend.api.forms.update` | `write` | Update form. Partially update a form. Only the fields present in the request body are changed; omitted fields are left unchanged. Nested objects must be sent complete, as they fully replace the stored value. Sending null for an optional field clears it, while sending null for a mandatory field is rejected. |
| `formTemplates.get` | `omnisend.api.formTemplates.get` | `read` | Get template. Get a single form template by ID. |
| `formTemplates.list` | `omnisend.api.formTemplates.list` | `read` | List form templates. List form templates with sorting, filtering and cursor-based pagination support. Only templates available in the brand's library are returned, each with its full content and brand assets applied. |
| `formTemplates.render` | `omnisend.api.formTemplates.render` | `read` | Render a form template. Render a single form template by ID and return its display steps as HTML. |
| `images.delete` | `omnisend.api.images.delete` | `destructive` | Delete image. With this endpoint you can delete an image by ID. Cannot be undone. |
| `images.get` | `omnisend.api.images.get` | `read` | Get image. With this endpoint you can get a single image by ID. |
| `images.list` | `omnisend.api.images.list` | `read` | List images. With this endpoint you can get a paginated list of images for a brand. |
| `images.upload` | `omnisend.api.images.upload` | `write` | Upload image file. With this endpoint you can upload an image file directly from your computer. File Requirements: - Supported formats: JPEG, PNG, GIF, WebP - Maximum file size: 5MB. Sends the file as multipart form data. |
| `images.uploadFromUrl` | `omnisend.api.images.uploadFromUrl` | `write` | Upload image by URL. With this endpoint you can upload an image from a publicly accessible URL. If the name is not provided, the filename will be extracted from the URL. |
| `products.create` | `omnisend.api.products.create` | `write` | Create a catalog product with at least one variant; prices are floats in the store currency. |
| `products.delete` | `omnisend.api.products.delete` | `destructive` | Delete a product from the catalog. |
| `products.get` | `omnisend.api.products.get` | `read` | Read one product by your own product ID, with its variants and prices. |
| `products.list` | `omnisend.api.products.list` | `read` | Page the catalog products, filtered by title or dates. |
| `products.replace` | `omnisend.api.products.replace` | `write` | Replace a product in full; omitted fields drop to their defaults. |
| `segments.create` | `omnisend.api.segments.create` | `write` | Create segment. Creates a new segment. (POST /segments) |
| `segments.delete` | `omnisend.api.segments.delete` | `destructive` | Delete segment. Permanently deletes a segment by its unique identifier. The segment must not be in a building state to be deleted. If the segment is currently being built, a 409 Conflict error is returned. Cannot be undone. |
| `segments.get` | `omnisend.api.segments.get` | `read` | Get segment. Returns a segment by its unique identifier. |
| `segments.getStatistics` | `omnisend.api.segments.getStatistics` | `read` | Get segment statistics. Returns statistics for a segment, including the total number of matching contacts. Returns 409 Conflict (segment-building) while the segment is building; retry once it is ready. |
| `segments.list` | `omnisend.api.segments.list` | `read` | List segments. List segments with sorting and cursor-based pagination support. |
| `segments.replace` | `omnisend.api.segments.replace` | `write` | Update segment. Updates an existing segment by ID. The segment must not be in a building state to be updated. If the segment is currently being built, a 409 Conflict error is returned. |
| `templates.create` | `omnisend.api.templates.create` | `write` | Create an email template with a name and editor sections. |
| `templates.delete` | `omnisend.api.templates.delete` | `destructive` | Delete an email template. |
| `templates.get` | `omnisend.api.templates.get` | `read` | Read one email template by id, with its sections and styles. |
| `templates.importFromHtml` | `omnisend.api.templates.importFromHtml` | `write` | Import raw HTML, up to 1 MB, as a new email template Omnisend converts to editor sections. |
| `templates.list` | `omnisend.api.templates.list` | `read` | Page the email templates, filtered by name. |
| `templates.render` | `omnisend.api.templates.render` | `read` | Render a template to its HTML for preview; nothing is sent and no state changes. |
| `templates.replace` | `omnisend.api.templates.replace` | `write` | Replace an email template in full; omitted fields drop to their defaults. |
| `universalLayouts.create` | `omnisend.api.universalLayouts.create` | `write` | Create universal layout. With this endpoint you can create a new universal layout. |
| `universalLayouts.delete` | `omnisend.api.universalLayouts.delete` | `destructive` | Delete universal layout. With this endpoint you can delete a universal layout by ID. Cannot be undone. |
| `universalLayouts.get` | `omnisend.api.universalLayouts.get` | `read` | Get universal layout. With this endpoint you can get a universal layout by ID. |
| `universalLayouts.list` | `omnisend.api.universalLayouts.list` | `read` | Get universal layouts. With this endpoint you can get a paginated list of universal layouts. Sorting: Items are returned in descending order by creation time (newest first). This is based on the internal document ID which contains a timestamp. |
| `universalLayouts.replace` | `omnisend.api.universalLayouts.replace` | `write` | Update universal layout. With this endpoint you can update (fully replace) a universal layout by ID. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/omnisend

## License

Apache-2.0
