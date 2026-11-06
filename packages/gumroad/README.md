# @corsair-dev/gumroad

Gumroad plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/gumroad
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customFields.create` | `gumroad.api.customFields.create` | `write` | Add a custom field to a product's checkout, optionally required |
| `customFields.delete` | `gumroad.api.customFields.delete` | `destructive` | Permanently delete a product's custom field by name |
| `customFields.list` | `gumroad.api.customFields.list` | `read` | List a product's checkout custom fields |
| `customFields.update` | `gumroad.api.customFields.update` | `write` | Flip whether one of a product's custom fields is required |
| `earnings.get` | `gumroad.api.earnings.get` | `read` | Read the annual earnings breakdown (gross, fees, taxes, affiliate credit, net) for one tax year |
| `emails.create` | `gumroad.api.emails.create` | `destructive` | Create a draft audience email by subject, HTML body and audience, or send it immediately with publish=true |
| `emails.delete` | `gumroad.api.emails.delete` | `destructive` | Delete an audience email |
| `emails.get` | `gumroad.api.emails.get` | `read` | Read one audience email by id |
| `emails.list` | `gumroad.api.emails.list` | `read` | List the seller's audience emails, optionally filtered to published, scheduled or draft state |
| `emails.preview` | `gumroad.api.emails.preview` | `write` | Send a preview of an audience email to the seller's own address |
| `emails.schedule` | `gumroad.api.emails.schedule` | `write` | Schedule a draft audience email to publish at a set time in the seller's timezone |
| `emails.send` | `gumroad.api.emails.send` | `destructive` | Publish a draft audience email and send it to its audience |
| `emails.unschedule` | `gumroad.api.emails.unschedule` | `write` | Cancel a scheduled audience email and turn it back into a draft |
| `files.abort` | `gumroad.api.files.abort` | `write` | Cancel a multipart upload started by files.presign |
| `files.complete` | `gumroad.api.files.complete` | `write` | Finalize a multipart upload with the S3 upload id, key and part etags, returning the canonical file URL |
| `files.presign` | `gumroad.api.files.presign` | `write` | Start a multipart file upload and get presigned S3 URLs per 100 MB part (max 20 GB); the binary PUTs to S3 are client-side |
| `licenses.decrementUsesCount` | `gumroad.api.licenses.decrementUsesCount` | `write` | Decrement a license key use counter and read its purchase |
| `licenses.disable` | `gumroad.api.licenses.disable` | `destructive` | Disable a license key so it fails verification, and read its purchase |
| `licenses.enable` | `gumroad.api.licenses.enable` | `write` | Re-enable a disabled license key and read its purchase |
| `licenses.rotate` | `gumroad.api.licenses.rotate` | `write` | Rotate a license key to a new one; the previous key stops validating immediately |
| `licenses.verify` | `gumroad.api.licenses.verify` | `write` | Verify a license key against a product and read its purchase; increments the license use counter unless increment_uses_count is "false" |
| `media.create` | `gumroad.api.media.create` | `write` | Add a media library file from a public image URL or a direct-upload signed blob id |
| `media.delete` | `gumroad.api.media.delete` | `destructive` | Delete a media library file by id |
| `media.list` | `gumroad.api.media.list` | `read` | List the authenticated user's media library files |
| `offerCodes.createForProduct` | `gumroad.api.offerCodes.createForProduct` | `write` | Create a fixed-amount or percentage offer code for a product, optionally universal, automatic and scheduled |
| `offerCodes.deleteForProduct` | `gumroad.api.offerCodes.deleteForProduct` | `destructive` | Permanently delete one of a product's offer codes |
| `offerCodes.getForProduct` | `gumroad.api.offerCodes.getForProduct` | `read` | Read one of a product's offer codes by id |
| `offerCodes.get` | `gumroad.api.offerCodes.get` | `read` | Read one store-wide offer code by id |
| `offerCodes.listForProduct` | `gumroad.api.offerCodes.listForProduct` | `read` | List all of a product's offer codes with amounts and redemption counts |
| `offerCodes.list` | `gumroad.api.offerCodes.list` | `read` | List the store's non-deleted offer codes, newest first, optionally filtered to automatic sales |
| `offerCodes.updateForProduct` | `gumroad.api.offerCodes.updateForProduct` | `write` | Update one of a product's offer codes: usage cap, minimum, automatic application and validity window |
| `offerCodes.update` | `gumroad.api.offerCodes.update` | `write` | Update a store-wide offer code schedule, usage cap or minimum; the amount and universality cannot change |
| `payouts.get` | `gumroad.api.payouts.get` | `read` | Read one payout with its sale ids and optional per-transaction breakdown lines |
| `payouts.list` | `gumroad.api.payouts.list` | `read` | List payouts with amount, currency, status and bank destination, filterable by date range |
| `payouts.upcoming` | `gumroad.api.payouts.upcoming` | `read` | Read the up to two upcoming payouts with their transaction lines |
| `products.categoriesList` | `gumroad.api.products.categoriesList` | `read` | List every product category; a category path feeds the category parameter when creating or updating products |
| `products.coversAdd` | `gumroad.api.products.coversAdd` | `write` | Attach a cover to a product from a public image/video or YouTube/Vimeo URL |
| `products.coversDelete` | `gumroad.api.products.coversDelete` | `destructive` | Permanently delete one of a product's covers by id |
| `products.create` | `gumroad.api.products.create` | `write` | Create a product with name, price in cents, type, tags, refund policy, rich content pages and attached files |
| `products.delete` | `gumroad.api.products.delete` | `destructive` | Permanently delete a product |
| `products.disable` | `gumroad.api.products.disable` | `destructive` | Unpublish (disable) an existing product |
| `products.enable` | `gumroad.api.products.enable` | `write` | Publish (enable) an existing product |
| `products.get` | `gumroad.api.products.get` | `read` | Get one product by id, including description, price, tags and purchasing-power-parity prices |
| `products.list` | `gumroad.api.products.list` | `read` | List the authenticated user's Gumroad products with price, publication state and sales counts |
| `products.reviewsList` | `gumroad.api.products.reviewsList` | `read` | List one product's reviews with rating, message and the seller's public reply |
| `products.thumbnailDelete` | `gumroad.api.products.thumbnailDelete` | `destructive` | Remove a product's thumbnail |
| `products.thumbnailSet` | `gumroad.api.products.thumbnailSet` | `write` | Set a product's thumbnail from a public image URL or a direct-upload signed blob id |
| `products.update` | `gumroad.api.products.update` | `write` | Update a product; files and tags are full replacements, and custom_html or cover_ids can be rewritten |
| `public.product` | `gumroad.api.public.product` | `read` | Read the public product page data for a permalink (price, covers, description, reviews); no authentication required |
| `public.profile` | `gumroad.api.public.profile` | `read` | Read a creator's public profile with up to 100 visible products; no authentication required |
| `resourceSubscriptions.list` | `gumroad.api.resourceSubscriptions.list` | `read` | List active subscriptions for one resource event type |
| `resourceSubscriptions.subscribe` | `gumroad.api.resourceSubscriptions.subscribe` | `write` | Subscribe a post URL to one of the 8 resource event types (sales, refunds, disputes, subscription changes); receiving deliveries is out of scope |
| `resourceSubscriptions.testEvent` | `gumroad.api.resourceSubscriptions.testEvent` | `write` | Queue a sample event for a resource subscription post URL |
| `resourceSubscriptions.unsubscribe` | `gumroad.api.resourceSubscriptions.unsubscribe` | `destructive` | Delete a resource subscription by id |
| `sales.get` | `gumroad.api.sales.get` | `read` | Get one sale by id with price, fees, taxes, refund and chargeback state |
| `sales.list` | `gumroad.api.sales.list` | `read` | List successful sales, filterable by date range, product, buyer email, order id, name or license key |
| `sales.markAsShipped` | `gumroad.api.sales.markAsShipped` | `write` | Mark a physical sale as shipped with an optional tracking URL |
| `sales.refund` | `gumroad.api.sales.refund` | `destructive` | Refund a sale fully, or partially with amount_cents; returns the updated sale |
| `sales.resendReceipt` | `gumroad.api.sales.resendReceipt` | `write` | Resend the purchase receipt to the customer's email |
| `sales.revokeAccess` | `gumroad.api.sales.revokeAccess` | `destructive` | Revoke the buyer's access to a sale without refunding it (refused for refunded, physical or subscription sales) |
| `sales.undoRevokeAccess` | `gumroad.api.sales.undoRevokeAccess` | `write` | Restore a buyer's access to a previously revoked sale |
| `subscribers.get` | `gumroad.api.subscribers.get` | `read` | Read one subscriber by id with status, recurrence and license key |
| `subscribers.list` | `gumroad.api.subscribers.list` | `read` | List one product's subscribers with status, recurrence and license key |
| `taxForms.download` | `gumroad.api.taxForms.download` | `read` | Download a tax form PDF for a year and form type as base64 with filename and content type |
| `taxForms.list` | `gumroad.api.taxForms.list` | `read` | List generated tax forms (1099-K, 1099-MISC) for one tax year or every year |
| `user.customHtmlGet` | `gumroad.api.user.customHtmlGet` | `read` | Read the profile's custom HTML landing page plus a rendered fallback of the current storefront |
| `user.customHtmlPreview` | `gumroad.api.user.customHtmlPreview` | `write` | Sanitize profile HTML and return the sanitized result without saving anything |
| `user.customHtmlUpdate` | `gumroad.api.user.customHtmlUpdate` | `write` | Publish or clear the profile custom HTML landing page; the response carries a sanitization report and the previous HTML for rollback |
| `user.get` | `gumroad.api.user.get` | `read` | Read the authenticated user's profile: name, bio, links and (with view_sales) email |
| `user.refundPolicyGet` | `gumroad.api.user.refundPolicyGet` | `read` | Read the account-level refund policy |
| `user.refundPolicyUpdate` | `gumroad.api.user.refundPolicyUpdate` | `write` | Update the account-level refund policy period and its fine print (max 3000 characters) |
| `variantCategories.create` | `gumroad.api.variantCategories.create` | `write` | Create a variant category on a product by title |
| `variantCategories.delete` | `gumroad.api.variantCategories.delete` | `destructive` | Permanently delete a product's variant category |
| `variantCategories.get` | `gumroad.api.variantCategories.get` | `read` | Read one of a product's variant categories by id |
| `variantCategories.list` | `gumroad.api.variantCategories.list` | `read` | List a product's variant categories |
| `variantCategories.update` | `gumroad.api.variantCategories.update` | `write` | Rename one of a product's variant categories |
| `variantCategories.variantsCreate` | `gumroad.api.variantCategories.variantsCreate` | `write` | Create a variant with a name, price difference in cents and optional purchase cap |
| `variantCategories.variantsDelete` | `gumroad.api.variantCategories.variantsDelete` | `destructive` | Permanently delete a variant |
| `variantCategories.variantsGet` | `gumroad.api.variantCategories.variantsGet` | `read` | Read one variant by id |
| `variantCategories.variantsList` | `gumroad.api.variantCategories.variantsList` | `read` | List the variants in one of a product's variant categories |
| `variantCategories.variantsUpdate` | `gumroad.api.variantCategories.variantsUpdate` | `write` | Update a variant name, price difference or purchase cap |
| `workflows.emailsAdd` | `gumroad.api.workflows.emailsAdd` | `write` | Append one email step to a workflow with a delay in hours, days, weeks or months |
| `workflows.emailsUpdate` | `gumroad.api.workflows.emailsUpdate` | `write` | Update one workflow email step subject, body or delay without changing publication state |
| `workflows.get` | `gumroad.api.workflows.get` | `read` | Read one workflow with its email steps and delivery statistics |
| `workflows.list` | `gumroad.api.workflows.list` | `read` | List the seller's active workflows, newest first |

## Auth

Auth: API key (OAuth access token), sent as `Authorization: Bearer <token>`.
Register an OAuth application at https://gumroad.com/settings/advanced#application-form, then on its page click "Generate access token".
Corsair prompts your tenant for credentials on first use. An `account`-scope
token covers most endpoints; media requires its specific scope, and sales,
payouts and tax data require `view_sales`, `view_payouts` and `view_tax_data`
respectively.

`public.product` and `public.profile` are unauthenticated public reads: the
product page is served from the seller subdomain
(`https://<seller>.gumroad.com/l/<permalink>.json`) and the profile from the
apex host (`https://gumroad.com/<username>.json`; the subdomain form in
Gumroad's docs 404s live). When a token is stored it is sent on both calls and
ignored; `public.product`, `public.profile` and `licenses.verify` also work
with no stored token.

### Scope exclusions

- File uploads are REST-only: `files.presign`, `files.complete` and
  `files.abort` manage the documented multipart session, but the binary S3
  part uploads (PUT each part to its presigned URL) happen client-side and are
  out of scope.
- Resource subscriptions manage webhook registrations only. Gumroad delivers
  events as unauthenticated POSTs with no documented signature scheme, so
  receiving and verifying deliveries stays out of this plugin.

## Webhooks

No webhooks. Gumroad's resource-subscription deliveries are unauthenticated
POSTs without a documented signature scheme; use
`resourceSubscriptions.subscribe` and `resourceSubscriptions.testEvent` to
manage and test registrations on your own endpoint.

## Reference

- Gumroad API docs: https://gumroad.com/api
- Full docs, types, and examples: https://docs.corsair.dev/plugins/gumroad

## License

Apache-2.0
