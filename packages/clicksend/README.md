# @corsair-dev/clicksend

ClickSend plugin for Corsair. Multi-channel communications platform for SMS, MMS, Voice, Fax, Email, Post, contacts, numbers, and billing — 164 endpoints.

## Install

```bash
pnpm add @corsair-dev/clicksend
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `clicksend.api.account.get` | `read` | Retrieve ClickSend account details and credit balance |
| `account.update` | `clicksend.api.account.update` | `write` | Update ClickSend account profile fields |
| `sms.send` | `clicksend.api.sms.send` | `write` | Send one or more SMS messages |
| `sms.history` | `clicksend.api.sms.history` | `read` | List sent SMS message history with pagination |
| `sms.inbound` | `clicksend.api.sms.inbound` | `read` | List received inbound SMS messages with pagination |
| `sms.receipts` | `clicksend.api.sms.receipts` | `read` | List SMS delivery receipts with pagination |
| `sms.price` | `clicksend.api.sms.price` | `write` | Calculate the price of SMS messages without sending |
| `sms.historyExport` | `clicksend.api.sms.historyExport` | `read` | Export SMS history to a downloadable file |
| `sms.receiptGet` | `clicksend.api.sms.receiptGet` | `read` | Retrieve a single SMS delivery receipt by message ID |
| `sms.receiptCreateTest` | `clicksend.api.sms.receiptCreateTest` | `write` | Create a test SMS delivery receipt for a webhook URL |
| `sms.receiptsMarkRead` | `clicksend.api.sms.receiptsMarkRead` | `write` | Mark SMS delivery receipts as read |
| `sms.inboundCreateTest` | `clicksend.api.sms.inboundCreateTest` | `write` | Create a test inbound SMS message |
| `sms.inboundMarkRead` | `clicksend.api.sms.inboundMarkRead` | `write` | Mark inbound SMS messages as read |
| `sms.inboundMarkReadOne` | `clicksend.api.sms.inboundMarkReadOne` | `write` | Mark a single inbound SMS as read |
| `sms.cancel` | `clicksend.api.sms.cancel` | `write` | Cancel a scheduled SMS message |
| `sms.cancelAll` | `clicksend.api.sms.cancelAll` | `write` | Cancel all scheduled SMS messages |
| `sms.statistics` | `clicksend.api.sms.statistics` | `read` | Retrieve SMS usage statistics |
| `smsTemplates.create` | `clicksend.api.smsTemplates.create` | `write` | Create an SMS message template |
| `smsTemplates.list` | `clicksend.api.smsTemplates.list` | `read` | List SMS templates with pagination |
| `smsTemplates.get` | `clicksend.api.smsTemplates.get` | `read` | Retrieve a single SMS template |
| `smsTemplates.update` | `clicksend.api.smsTemplates.update` | `write` | Update an SMS template |
| `smsTemplates.delete` | `clicksend.api.smsTemplates.delete` | `write` | Delete an SMS template |
| `smsStrippedStrings.list` | `clicksend.api.smsStrippedStrings.list` | `read` | List email-to-SMS stripped-string rules |
| `smsStrippedStrings.get` | `clicksend.api.smsStrippedStrings.get` | `read` | Retrieve a single stripped-string rule |
| `smsStrippedStrings.create` | `clicksend.api.smsStrippedStrings.create` | `write` | Create an email-to-SMS stripped-string rule |
| `smsStrippedStrings.update` | `clicksend.api.smsStrippedStrings.update` | `write` | Update an email-to-SMS stripped-string rule |
| `smsStrippedStrings.delete` | `clicksend.api.smsStrippedStrings.delete` | `write` | Delete an email-to-SMS stripped-string rule |
| `smsEmailSms.create` | `clicksend.api.smsEmailSms.create` | `write` | Allow an email address for email-to-SMS |
| `smsEmailSms.list` | `clicksend.api.smsEmailSms.list` | `read` | List allowed email-to-SMS addresses |
| `voice.send` | `clicksend.api.voice.send` | `write` | Initiate outbound text-to-speech voice call |
| `voice.history` | `clicksend.api.voice.history` | `read` | List voice call history with pagination |
| `voice.cancelAll` | `clicksend.api.voice.cancelAll` | `write` | Cancel all scheduled voice calls |
| `voice.historyExport` | `clicksend.api.voice.historyExport` | `read` | Export voice history to a downloadable file |
| `voice.languages` | `clicksend.api.voice.languages` | `read` | List available voice-call languages |
| `voice.statistics` | `clicksend.api.voice.statistics` | `read` | Retrieve voice usage statistics |
| `voice.receiptsMarkRead` | `clicksend.api.voice.receiptsMarkRead` | `write` | Mark voice delivery receipts as read |
| `mms.send` | `clicksend.api.mms.send` | `write` | Send one or more MMS messages with media |
| `mms.price` | `clicksend.api.mms.price` | `write` | Calculate the price of MMS messages without sending |
| `mms.history` | `clicksend.api.mms.history` | `read` | List MMS message history with pagination |
| `mms.historyExport` | `clicksend.api.mms.historyExport` | `read` | Export MMS history to a downloadable file |
| `mms.receipts` | `clicksend.api.mms.receipts` | `read` | List MMS delivery receipts with pagination |
| `mms.receiptsMarkRead` | `clicksend.api.mms.receiptsMarkRead` | `write` | Mark MMS delivery receipts as read |
| `campaigns.sms.price` | `clicksend.api.campaigns.sms.price` | `write` | Calculate the price of an SMS campaign |
| `campaigns.sms.send` | `clicksend.api.campaigns.sms.send` | `write` | Create and send an SMS campaign to a contact list |
| `campaigns.sms.list` | `clicksend.api.campaigns.sms.list` | `read` | List SMS campaigns with pagination and filters |
| `campaigns.sms.get` | `clicksend.api.campaigns.sms.get` | `read` | Retrieve a single SMS campaign by ID |
| `campaigns.sms.update` | `clicksend.api.campaigns.sms.update` | `write` | Update a scheduled SMS campaign |
| `campaigns.sms.cancel` | `clicksend.api.campaigns.sms.cancel` | `write` | Cancel a scheduled SMS campaign |
| `campaigns.mms.list` | `clicksend.api.campaigns.mms.list` | `read` | List MMS campaigns |
| `campaigns.mms.send` | `clicksend.api.campaigns.mms.send` | `write` | Create and send an MMS campaign to a contact list |
| `campaigns.mms.price` | `clicksend.api.campaigns.mms.price` | `write` | Calculate the price of an MMS campaign |
| `campaigns.mms.update` | `clicksend.api.campaigns.mms.update` | `write` | Update a scheduled MMS campaign |
| `campaigns.mms.cancel` | `clicksend.api.campaigns.mms.cancel` | `write` | Cancel a scheduled MMS campaign |
| `emailAddresses.create` | `clicksend.api.emailAddresses.create` | `write` | Register a new allowed sender email address |
| `emailAddresses.list` | `clicksend.api.emailAddresses.list` | `read` | List allowed sender email addresses |
| `emailAddresses.get` | `clicksend.api.emailAddresses.get` | `read` | Retrieve a single allowed email address by ID |
| `emailAddresses.delete` | `clicksend.api.emailAddresses.delete` | `write` | Delete an allowed email address by ID |
| `emailAddresses.sendToken` | `clicksend.api.emailAddresses.sendToken` | `write` | Send a verification token to an allowed email address |
| `emailAddresses.verify` | `clicksend.api.emailAddresses.verify` | `write` | Verify an allowed email address with its activation token |
| `emailTemplates.list` | `clicksend.api.emailTemplates.list` | `read` | List user email templates |
| `emailTemplates.get` | `clicksend.api.emailTemplates.get` | `read` | Retrieve a single user email template by ID |
| `emailTemplates.create` | `clicksend.api.emailTemplates.create` | `write` | Create a user email template from a master template |
| `emailTemplates.update` | `clicksend.api.emailTemplates.update` | `write` | Update a user email template |
| `emailTemplates.delete` | `clicksend.api.emailTemplates.delete` | `write` | Delete a user email template by ID |
| `emailMasterTemplates.list` | `clicksend.api.emailMasterTemplates.list` | `read` | List ClickSend master email templates |
| `emailMasterTemplates.get` | `clicksend.api.emailMasterTemplates.get` | `read` | Retrieve a single master email template by ID |
| `emailMasterTemplates.listInCategory` | `clicksend.api.emailMasterTemplates.listInCategory` | `read` | List master email templates within a category |
| `emailMasterCategories.list` | `clicksend.api.emailMasterCategories.list` | `read` | List master email template categories |
| `emailMasterCategories.get` | `clicksend.api.emailMasterCategories.get` | `read` | Retrieve a single master template category by ID |
| `emailReceiptRules.list` | `clicksend.api.emailReceiptRules.list` | `read` | List email delivery receipt automation rules |
| `emailReceiptRules.create` | `clicksend.api.emailReceiptRules.create` | `write` | Create an email delivery receipt automation rule |
| `emailReceiptRules.get` | `clicksend.api.emailReceiptRules.get` | `read` | Retrieve a single email receipt automation rule |
| `emailReceiptRules.update` | `clicksend.api.emailReceiptRules.update` | `write` | Update an email delivery receipt automation rule |
| `emailReceiptRules.delete` | `clicksend.api.emailReceiptRules.delete` | `write` | Delete an email delivery receipt automation rule |
| `emailCampaigns.get` | `clicksend.api.emailCampaigns.get` | `read` | Retrieve a single email campaign by ID |
| `faxReceipts.createTest` | `clicksend.api.faxReceipts.createTest` | `write` | Create a test fax delivery receipt for a callback URL |
| `faxReceipts.list` | `clicksend.api.faxReceipts.list` | `read` | List fax delivery receipts with pagination |
| `faxReceipts.get` | `clicksend.api.faxReceipts.get` | `read` | Retrieve a single fax receipt by message ID |
| `faxReceipts.markRead` | `clicksend.api.faxReceipts.markRead` | `write` | Mark fax delivery receipts as read |
| `faxReceiptRules.list` | `clicksend.api.faxReceiptRules.list` | `read` | List fax receipt automation rules |
| `faxReceiptRules.create` | `clicksend.api.faxReceiptRules.create` | `write` | Create a fax receipt automation rule |
| `faxReceiptRules.get` | `clicksend.api.faxReceiptRules.get` | `read` | Retrieve a single fax receipt automation rule |
| `faxReceiptRules.update` | `clicksend.api.faxReceiptRules.update` | `write` | Update a fax receipt automation rule |
| `faxReceiptRules.delete` | `clicksend.api.faxReceiptRules.delete` | `write` | Delete a fax receipt automation rule |
| `faxInboundRules.list` | `clicksend.api.faxInboundRules.list` | `read` | List fax inbound automation rules |
| `faxInboundRules.create` | `clicksend.api.faxInboundRules.create` | `write` | Create a fax inbound automation rule |
| `faxInboundRules.get` | `clicksend.api.faxInboundRules.get` | `read` | Retrieve a single fax inbound automation rule |
| `faxInboundRules.update` | `clicksend.api.faxInboundRules.update` | `write` | Update a fax inbound automation rule |
| `faxInboundRules.delete` | `clicksend.api.faxInboundRules.delete` | `write` | Delete a fax inbound automation rule |
| `contactLists.getAll` | `clicksend.api.contactLists.getAll` | `read` | Retrieve all contact lists with pagination |
| `contactLists.create` | `clicksend.api.contactLists.create` | `write` | Create a new contact list |
| `contactLists.update` | `clicksend.api.contactLists.update` | `write` | Rename a contact list by ID |
| `contactLists.delete` | `clicksend.api.contactLists.delete` | `write` | Delete a contact list by ID |
| `contactLists.get` | `clicksend.api.contactLists.get` | `read` | Retrieve a single contact list by ID |
| `contacts.create` | `clicksend.api.contacts.create` | `write` | Add a new contact to a specific list |
| `contacts.list` | `clicksend.api.contacts.list` | `read` | List contacts within a specific contact list |
| `contacts.get` | `clicksend.api.contacts.get` | `read` | Retrieve a single contact from a list |
| `contacts.update` | `clicksend.api.contacts.update` | `write` | Update contact fields within a list |
| `contacts.delete` | `clicksend.api.contacts.delete` | `write` | Delete a contact from a list |
| `contacts.copy` | `clicksend.api.contacts.copy` | `write` | Copy a contact from one list to another |
| `contacts.transfer` | `clicksend.api.contacts.transfer` | `write` | Move a contact from one list to another |
| `contacts.import` | `clicksend.api.contacts.import` | `write` | Bulk-import contacts into a list from a file URL |
| `contacts.importFields` | `clicksend.api.contacts.importFields` | `read` | List valid import field mappings for a list |
| `contacts.importPreview` | `clicksend.api.contacts.importPreview` | `write` | Preview the first row of a CSV import file |
| `contacts.removeOptedOut` | `clicksend.api.contacts.removeOptedOut` | `write` | Remove opted-out contacts from a list |
| `contacts.search` | `clicksend.api.contacts.search` | `read` | Search contact lists and contacts by keyword |
| `contacts.suggestions` | `clicksend.api.contacts.suggestions` | `read` | List suggested contacts across lists |
| `recharge.transactions` | `clicksend.api.recharge.transactions` | `read` | List recharge transactions with pagination |
| `recharge.transactionGet` | `clicksend.api.recharge.transactionGet` | `read` | Retrieve a single recharge transaction |
| `recharge.packages` | `clicksend.api.recharge.packages` | `read` | List available recharge packages and currency |
| `recharge.purchase` | `clicksend.api.recharge.purchase` | `write` | Purchase a recharge package by ID |
| `recharge.creditCardGet` | `clicksend.api.recharge.creditCardGet` | `read` | Retrieve the stored recharge credit card |
| `recharge.creditCardUpdate` | `clicksend.api.recharge.creditCardUpdate` | `write` | Replace the stored recharge credit card |
| `subaccounts.list` | `clicksend.api.subaccounts.list` | `read` | List subaccounts with pagination |
| `subaccounts.get` | `clicksend.api.subaccounts.get` | `read` | Retrieve a single subaccount |
| `subaccounts.create` | `clicksend.api.subaccounts.create` | `write` | Create a new subaccount |
| `subaccounts.update` | `clicksend.api.subaccounts.update` | `write` | Update subaccount contact fields |
| `subaccounts.delete` | `clicksend.api.subaccounts.delete` | `write` | Delete a subaccount |
| `subaccounts.regenKey` | `clicksend.api.subaccounts.regenKey` | `write` | Regenerate a subaccount API key |
| `reseller.accountsList` | `clicksend.api.reseller.accountsList` | `read` | List reseller child accounts |
| `reseller.settingsGet` | `clicksend.api.reseller.settingsGet` | `read` | Retrieve reseller settings |
| `reseller.settingsUpdate` | `clicksend.api.reseller.settingsUpdate` | `write` | Update reseller settings |
| `referral.accountsList` | `clicksend.api.referral.accountsList` | `read` | List referral accounts |
| `countries.list` | `clicksend.api.countries.list` | `read` | List supported countries as code/value pairs |
| `countries.globalList` | `clicksend.api.countries.globalList` | `read` | List global sending destination countries |
| `countries.pricing` | `clicksend.api.countries.pricing` | `read` | Retrieve per-country pricing for a currency |
| `countries.userCountriesGet` | `clicksend.api.countries.userCountriesGet` | `read` | List enabled global-sending countries |
| `countries.userCountriesSelect` | `clicksend.api.countries.userCountriesSelect` | `write` | Select enabled global-sending countries |
| `countries.userCountriesAgree` | `clicksend.api.countries.userCountriesAgree` | `write` | Agree to sending-country compliance rules |
| `timezones.list` | `clicksend.api.timezones.list` | `read` | List supported timezone names |
| `deliveryIssues.list` | `clicksend.api.deliveryIssues.list` | `read` | List delivery issues with pagination |
| `deliveryIssues.create` | `clicksend.api.deliveryIssues.create` | `write` | Report a message delivery issue |
| `postLetters.send` | `clicksend.api.postLetters.send` | `write` | Send a physical post letter to recipients |
| `postLetters.history` | `clicksend.api.postLetters.history` | `read` | List post letter history with pagination |
| `postLetters.historyExport` | `clicksend.api.postLetters.historyExport` | `read` | Export post letter history to a downloadable file |
| `postLetters.price` | `clicksend.api.postLetters.price` | `write` | Calculate post letter price without sending |
| `postLetters.detectAddress` | `clicksend.api.postLetters.detectAddress` | `write` | Detect a structured address from PDF content or text |
| `postReturnAddresses.create` | `clicksend.api.postReturnAddresses.create` | `write` | Create a post return address |
| `postReturnAddresses.list` | `clicksend.api.postReturnAddresses.list` | `read` | List post return addresses with pagination |
| `postReturnAddresses.get` | `clicksend.api.postReturnAddresses.get` | `read` | Retrieve a single post return address by ID |
| `postReturnAddresses.update` | `clicksend.api.postReturnAddresses.update` | `write` | Update a post return address by ID |
| `postReturnAddresses.delete` | `clicksend.api.postReturnAddresses.delete` | `write` | Delete a post return address by ID |
| `postDirectMail.send` | `clicksend.api.postDirectMail.send` | `write` | Send a direct mail campaign |
| `postDirectMail.searchLocations` | `clicksend.api.postDirectMail.searchLocations` | `read` | Search direct mail delivery locations by country |
| `numbers.list` | `clicksend.api.numbers.list` | `read` | List owned dedicated numbers |
| `numbers.search` | `clicksend.api.numbers.search` | `read` | Search available dedicated numbers by country |
| `numbers.buy` | `clicksend.api.numbers.buy` | `write` | Purchase a dedicated number |
| `smsInboundRules.list` | `clicksend.api.smsInboundRules.list` | `read` | List SMS inbound automation rules |
| `smsInboundRules.create` | `clicksend.api.smsInboundRules.create` | `write` | Create an SMS inbound automation rule |
| `smsInboundRules.get` | `clicksend.api.smsInboundRules.get` | `read` | Retrieve an SMS inbound automation rule |
| `smsInboundRules.update` | `clicksend.api.smsInboundRules.update` | `write` | Update an SMS inbound automation rule |
| `smsInboundRules.delete` | `clicksend.api.smsInboundRules.delete` | `write` | Delete an SMS inbound automation rule |
| `smsReceiptRules.list` | `clicksend.api.smsReceiptRules.list` | `read` | List SMS receipt automation rules |
| `smsReceiptRules.create` | `clicksend.api.smsReceiptRules.create` | `write` | Create an SMS receipt automation rule |
| `smsReceiptRules.get` | `clicksend.api.smsReceiptRules.get` | `read` | Retrieve an SMS receipt automation rule |
| `smsReceiptRules.update` | `clicksend.api.smsReceiptRules.update` | `write` | Update an SMS receipt automation rule |
| `smsReceiptRules.delete` | `clicksend.api.smsReceiptRules.delete` | `write` | Delete an SMS receipt automation rule |
| `voiceReceiptRules.list` | `clicksend.api.voiceReceiptRules.list` | `read` | List voice receipt automation rules |
| `voiceReceiptRules.create` | `clicksend.api.voiceReceiptRules.create` | `write` | Create a voice receipt automation rule |
| `voiceReceiptRules.get` | `clicksend.api.voiceReceiptRules.get` | `read` | Retrieve a voice receipt automation rule |
| `voiceReceiptRules.update` | `clicksend.api.voiceReceiptRules.update` | `write` | Update a voice receipt automation rule |
| `voiceReceiptRules.delete` | `clicksend.api.voiceReceiptRules.delete` | `write` | Delete a voice receipt automation rule |
| `uploads.upload` | `clicksend.api.uploads.upload` | `write` | Upload and convert a file for messaging services |
| `uploads.uploadDocument` | `clicksend.api.uploads.uploadDocument` | `write` | Upload a document for fax and post services |

## Auth

Auth: API key. ClickSend uses HTTP Basic auth (`username:API key`, Base64). Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Notes

- Single-record get/update/delete for SMS email-to-SMS allowed addresses
  (`GET`/`PUT`/`DELETE /sms/email-sms/{id}`) are intentionally not implemented:
  they exist in neither the current official OpenAPI specs nor the official
  SDK path list, so the API does not expose them.
- `sms.cancel` uses `PUT /sms/{message_id}/cancel` per the current spec
  (not DELETE).

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/clicksend — provider reference: https://developers.clicksend.com/docs

## License

Apache-2.0
