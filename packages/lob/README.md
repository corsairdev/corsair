# @corsair-dev/lob

Address verification and print mail with Lob - verify US and international addresses, send and track postcards, letters, checks, self mailers, snap packs and booklets, run bulk-mail campaigns, and manage templates, bank accounts, billing groups and short links.

## Install

```bash
pnpm add @corsair-dev/lob
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getBalance` | `lob.api.account.getBalance` | `read` | Read the account's current Lob Credits balance (live keys only; a test key gets 401) |
| `addresses.create` | `lob.api.addresses.create` | `write` | Create a US or international address in the Lob address book for reuse as a mail to or from address |
| `addresses.delete` | `lob.api.addresses.delete` | `destructive` | Permanently delete an address book entry. Lob marks it deleted and does not restore it |
| `addresses.get` | `lob.api.addresses.get` | `read` | Read one address book entry by its adr_ ID |
| `addresses.list` | `lob.api.addresses.list` | `read` | Page through the address book with before/after cursors, optional metadata and date filters |
| `autocomplete.usAutocomplete` | `lob.api.autocomplete.usAutocomplete` | `read` | Complete a partial US address into up to 10 suggestion lines, optionally restricted to deliverable addresses |
| `bankAccounts.create` | `lob.api.bankAccounts.create` | `write` | Add a US bank account for checks. Lob sends micro-deposits that bankAccounts.verify confirms |
| `bankAccounts.delete` | `lob.api.bankAccounts.delete` | `destructive` | Permanently delete a bank account. Checks can no longer draw on it |
| `bankAccounts.get` | `lob.api.bankAccounts.get` | `read` | Read one bank account by its bank_ ID, including whether it is verified |
| `bankAccounts.list` | `lob.api.bankAccounts.list` | `read` | Page through bank accounts with cursors, date and metadata filters |
| `bankAccounts.verify` | `lob.api.bankAccounts.verify` | `write` | Verify a bank account with its two micro-deposit amounts or its descriptor code |
| `billingGroups.create` | `lob.api.billingGroups.create` | `write` | Create a billing group to split mail costs by team or client |
| `billingGroups.get` | `lob.api.billingGroups.get` | `read` | Read one billing group by its bg_ ID |
| `billingGroups.list` | `lob.api.billingGroups.list` | `read` | Page through billing groups with limit/offset, date filters and sorting |
| `billingGroups.update` | `lob.api.billingGroups.update` | `write` | Change a billing group's name or description |
| `booklets.cancel` | `lob.api.booklets.cancel` | `destructive` | Cancel a booklet before it goes to production. A cancelled piece cannot be restored |
| `booklets.get` | `lob.api.booklets.get` | `read` | Read one booklet by its ord_ ID, including status and tracking events |
| `booklets.list` | `lob.api.booklets.list` | `read` | Page through booklets with cursors and filters (status, campaign, send date, metadata) |
| `booklets.send` | `lob.api.booklets.send` | `destructive` | Print and mail a real booklet. Billed per piece and not recallable once in production; pass an idempotency_key |
| `buckslips.create` | `lob.api.buckslips.create` | `write` | Create a buckslip (a letter insert) from front and back artwork. Printing happens only when you order stock |
| `buckslips.createOrder` | `lob.api.buckslips.createOrder` | `destructive` | Order a print run of a buckslip (at least 5,000). Lob prints and bills the whole order |
| `buckslips.delete` | `lob.api.buckslips.delete` | `destructive` | Permanently delete a buckslip |
| `buckslips.get` | `lob.api.buckslips.get` | `read` | Read one buckslip by its bck_ ID, including stock quantities and status |
| `buckslips.list` | `lob.api.buckslips.list` | `read` | Page through buckslips with cursors |
| `buckslips.listOrders` | `lob.api.buckslips.listOrders` | `read` | List the print orders placed for a buckslip |
| `buckslips.update` | `lob.api.buckslips.update` | `write` | Change a buckslip's description or auto-reorder settings. Auto-reorder places billed print orders when stock runs low |
| `campaigns.create` | `lob.api.campaigns.create` | `write` | Create a draft campaign for bulk mail. Nothing mails until campaigns.send |
| `campaigns.delete` | `lob.api.campaigns.delete` | `destructive` | Permanently delete a campaign |
| `campaigns.get` | `lob.api.campaigns.get` | `read` | Read one campaign by its cmp_ ID, with its creatives and uploads |
| `campaigns.list` | `lob.api.campaigns.list` | `read` | Page through campaigns with cursors |
| `campaigns.send` | `lob.api.campaigns.send` | `destructive` | Send a campaign: Lob prints, mails and bills a piece for every row of its audience upload. Cannot be undone after the cancel window |
| `campaigns.update` | `lob.api.campaigns.update` | `write` | Change a campaign's name, schedule, use type or other settings |
| `cards.create` | `lob.api.cards.create` | `write` | Create a card (a plastic or paper insert) from front and back artwork. Printing happens only when you order stock |
| `cards.createOrder` | `lob.api.cards.createOrder` | `destructive` | Order a print run of a card (at least 10,000). Lob prints and bills the whole order |
| `cards.delete` | `lob.api.cards.delete` | `destructive` | Permanently delete a card |
| `cards.get` | `lob.api.cards.get` | `read` | Read one card by its card_ ID, including stock quantities and status |
| `cards.list` | `lob.api.cards.list` | `read` | Page through cards with cursors |
| `cards.listOrders` | `lob.api.cards.listOrders` | `read` | List the print orders placed for a card |
| `cards.update` | `lob.api.cards.update` | `write` | Change a card's description or auto-reorder settings. Auto-reorder places billed print orders when stock runs low |
| `checks.cancel` | `lob.api.checks.cancel` | `destructive` | Cancel a check before it goes to production. A cancelled check cannot be restored |
| `checks.get` | `lob.api.checks.get` | `read` | Read one check by its chk_ ID, including status, tracking events and the PDF preview URL |
| `checks.list` | `lob.api.checks.list` | `read` | Page through checks with cursors and filters (status, send date, metadata) |
| `checks.send` | `lob.api.checks.send` | `destructive` | Print and mail a real check drawn on a verified bank account. Moves money and is billed per piece; pass an idempotency_key so a replay returns the original check |
| `creatives.create` | `lob.api.creatives.create` | `write` | Add the artwork (a postcard, letter or self mailer creative) to a campaign |
| `creatives.get` | `lob.api.creatives.get` | `read` | Read one creative by its crv_ ID |
| `creatives.update` | `lob.api.creatives.update` | `write` | Change a creative's return address, description or metadata |
| `domains.create` | `lob.api.domains.create` | `write` | Register a custom domain for short links |
| `domains.delete` | `lob.api.domains.delete` | `destructive` | Permanently delete a short-link domain; its links stop resolving |
| `domains.get` | `lob.api.domains.get` | `read` | Read one short-link domain, including whether its DNS is configured |
| `domains.list` | `lob.api.domains.list` | `read` | Page through short-link domains |
| `identityValidation.validate` | `lob.api.identityValidation.validate` | `read` | Score how likely a person or company is associated with a US address (0-100, with a high/medium/low confidence) |
| `informedDelivery.create` | `lob.api.informedDelivery.create` | `write` | Create a USPS Informed Delivery campaign (an email preview with a ride-along image and link) pending approval |
| `informedDelivery.get` | `lob.api.informedDelivery.get` | `read` | Read one Informed Delivery campaign by its USPS campaign ID |
| `informedDelivery.list` | `lob.api.informedDelivery.list` | `read` | List USPS Informed Delivery campaigns |
| `informedDelivery.update` | `lob.api.informedDelivery.update` | `write` | Change an Informed Delivery campaign's details or approve it |
| `intlVerifications.bulk` | `lob.api.intlVerifications.bulk` | `read` | Verify up to 20 international addresses in one call; each row comes back as a verification or a per-row error. Bills each row on a live key |
| `intlVerifications.verify` | `lob.api.intlVerifications.verify` | `read` | Verify one international address and get its deliverability, coverage level and parsed components |
| `letters.cancel` | `lob.api.letters.cancel` | `destructive` | Cancel a letter before it goes to production. Works only within the cancellation window; a cancelled piece cannot be restored |
| `letters.get` | `lob.api.letters.get` | `read` | Read one letter by its ltr_ ID, including tracking number and events on certified or registered mail |
| `letters.list` | `lob.api.letters.list` | `read` | Page through letters with cursors and filters (status, color, campaign, send date, metadata) |
| `letters.send` | `lob.api.letters.send` | `destructive` | Send a real letter that Lob prints, stuffs and mails. Each piece is billed and cannot be recalled once in production; pass an idempotency_key so a replay returns the original instead of mailing twice |
| `links.create` | `lob.api.links.create` | `write` | Create a short link that redirects to a long URL |
| `links.delete` | `lob.api.links.delete` | `destructive` | Permanently delete a short link; printed copies stop resolving |
| `links.get` | `lob.api.links.get` | `read` | Read one short link |
| `links.list` | `lob.api.links.list` | `read` | Page through short links, optionally by campaign or domain |
| `links.update` | `lob.api.links.update` | `write` | Change a short link's target URL, title or metadata |
| `postcards.cancel` | `lob.api.postcards.cancel` | `destructive` | Cancel a postcard before it goes to production. Works only within the cancellation window; a cancelled piece cannot be restored |
| `postcards.get` | `lob.api.postcards.get` | `read` | Read one postcard by its psc_ ID, including print status and the signed PDF preview URL |
| `postcards.list` | `lob.api.postcards.list` | `read` | Page through postcards with cursors and filters (status, size, campaign, send date, metadata) |
| `postcards.send` | `lob.api.postcards.send` | `destructive` | Send a real postcard that Lob prints and mails. Each piece is billed and cannot be recalled once in production; pass an idempotency_key so a replay returns the original instead of mailing twice |
| `qrCodes.list` | `lob.api.qrCodes.list` | `read` | List QR code scan analytics for mailpieces, optionally only scanned codes or given piece IDs |
| `resourceProofs.create` | `lob.api.resourceProofs.create` | `write` | Render a proof of a postcard, letter or self mailer for review, without mailing anything |
| `resourceProofs.get` | `lob.api.resourceProofs.get` | `read` | Read one resource proof by its res_prf_ ID, including the rendered PDF URL |
| `resourceProofs.update` | `lob.api.resourceProofs.update` | `write` | Re-render a resource proof with a different template |
| `reverseGeocode.lookup` | `lob.api.reverseGeocode.lookup` | `read` | Find the US ZIP and ZIP+4 areas nearest a latitude and longitude, sorted by distance |
| `selfMailers.cancel` | `lob.api.selfMailers.cancel` | `destructive` | Cancel a self mailer before it goes to production. A cancelled piece cannot be restored |
| `selfMailers.get` | `lob.api.selfMailers.get` | `read` | Read one self mailer by its sfm_ ID, including status and tracking events |
| `selfMailers.list` | `lob.api.selfMailers.list` | `read` | Page through self mailers with cursors and filters (status, size, campaign, send date, metadata) |
| `selfMailers.send` | `lob.api.selfMailers.send` | `destructive` | Print and mail a real self mailer (a folded piece, no envelope). Billed per piece and not recallable once in production; pass an idempotency_key |
| `snapPacks.cancel` | `lob.api.snapPacks.cancel` | `destructive` | Cancel a snap pack before it goes to production. A cancelled piece cannot be restored |
| `snapPacks.get` | `lob.api.snapPacks.get` | `read` | Read one snap pack by its ord_ ID, including status and tracking events |
| `snapPacks.list` | `lob.api.snapPacks.list` | `read` | Page through snap packs with cursors and filters (status, campaign, send date, metadata) |
| `snapPacks.send` | `lob.api.snapPacks.send` | `destructive` | Print and mail a real snap pack (a sealed pressure-seal mailer). Billed per piece and not recallable once in production; pass an idempotency_key |
| `templates.create` | `lob.api.templates.create` | `write` | Save an HTML template that mailpieces can name by tmpl_ ID |
| `templates.delete` | `lob.api.templates.delete` | `destructive` | Permanently delete a template and its versions |
| `templates.get` | `lob.api.templates.get` | `read` | Read one template by its tmpl_ ID, with its published version |
| `templates.list` | `lob.api.templates.list` | `read` | Page through templates with cursors, date and metadata filters |
| `templates.update` | `lob.api.templates.update` | `write` | Change a template's description or which version is published |
| `templateVersions.create` | `lob.api.templateVersions.create` | `write` | Add a new HTML version to a template |
| `templateVersions.delete` | `lob.api.templateVersions.delete` | `destructive` | Permanently delete a template version (not the published one) |
| `templateVersions.get` | `lob.api.templateVersions.get` | `read` | Read one template version by its vrsn_ ID |
| `templateVersions.list` | `lob.api.templateVersions.list` | `read` | Page through a template's versions |
| `templateVersions.update` | `lob.api.templateVersions.update` | `write` | Change a template version's description, engine or required variables |
| `uploads.create` | `lob.api.uploads.create` | `write` | Create an audience upload for a campaign and map its CSV columns to address fields and merge variables |
| `uploads.createExport` | `lob.api.uploads.createExport` | `write` | Start an export of an upload's rows (all, failures or successes) |
| `uploads.delete` | `lob.api.uploads.delete` | `destructive` | Permanently delete an audience upload |
| `uploads.get` | `lob.api.uploads.get` | `read` | Read one upload by its upl_ ID, including processing state and row counts |
| `uploads.getExport` | `lob.api.uploads.getExport` | `read` | Read an upload export, including its download URL once ready |
| `uploads.getReport` | `lob.api.uploads.getReport` | `read` | Page through an upload's per-row validation report |
| `uploads.list` | `lob.api.uploads.list` | `read` | List audience uploads, optionally for one campaign |
| `uploads.update` | `lob.api.uploads.update` | `write` | Change an upload's column mappings or metadata |
| `uploads.uploadFile` | `lob.api.uploads.uploadFile` | `write` | Attach the audience CSV file to an upload; Lob validates its rows asynchronously |
| `usVerifications.bulk` | `lob.api.usVerifications.bulk` | `read` | Verify up to 20 US addresses in one synchronous call; each row comes back as a verification or a per-row error |
| `usVerifications.verify` | `lob.api.usVerifications.verify` | `read` | Verify one US address with USPS data and get its deliverability, standardized components and confidence score |
| `zip.usZipLookup` | `lob.api.zip.usZipLookup` | `read` | Look up a 5-digit US ZIP code and get its cities, county, FIPS code and default city |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/lob

## License

Apache-2.0
