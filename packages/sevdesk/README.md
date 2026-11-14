# @corsair-dev/sevdesk

Sevdesk REST integration for Corsair, based on the [official OpenAPI 3 specification](https://api.sevdesk.de/openapi.yaml) and [rendered API reference](https://api.sevdesk.de/). It exposes 152 documented JSON operations with strict request schemas, response validation, pagination, resource-version headers, and privacy-safe errors/logging.

## Authentication

Install with `pnpm add @corsair-dev/sevdesk`. Register `sevdesk()` with Corsair and store the API token as the tenant's `api_key`; the factory's `key` option is available for a single-account setup. Do not commit the key or include it in logs.

Configure the raw 32-character hexadecimal Sevdesk API token as an API key. It is sent verbatim in `Authorization` (no Bearer or Token prefix). A deleted Sevdesk user can make the token unretrievable; follow the provider's account guidance.

The live smoke suite is read-only and runs with `SEVDESK_API_KEY` set via `pnpm --dir packages/sevdesk test:live`; it skips when the variable is missing.

Pass `resourceVersion` at the operation input root to set `X-Version` for that call. An optional plugin-level `resourceVersion` is a fallback; per-call values are preferable because Sevdesk versions resources independently. When both are omitted, the header is omitted and Sevdesk selects its documented `default` version. Supported forms follow the spec: `default` or a numeric major/minor such as `1.0`–`1.9`.

## Pagination, retries, and privacy

List routes expose documented `limit` (1–1000), `offset`, and `countAll`; list responses use the documented `objects` array and include the string `total` when requested with `countAll: true`. `embed` accepts resource names as documented. A 429 preserves `Retry-After` on Corsair's `ApiError`. The transport does not retry rate-limited writes; transient network/5xx failures retry only GETs. Event logs and propagated messages omit tokens, request/response data, contact details, invoice details, and resource IDs.

## Accounting and tax rules

Check `basics.bookkeepingSystemVersion` first. Sevdesk Update 2.0 uses `taxRule` instead of legacy `taxType`/`taxSet`; custom tax types/sets are not supported on Update 2.0 accounts. Legacy fields remain in the schemas because older bookkeeping versions are documented. Use Receipt Guidance operations to verify tax rules and position tax rates before creating or updating accounting documents.

| Update 2.0 use case | Rule | Position rates |
| --- | ---: | --- |
| Standard taxable revenue | 1 | 0%, 7%, 19% |
| Exports | 2 | 0% |
| Intra-community supplies | 3 | 0%, 7%, 19% |
| §4 UStG exempt revenue | 4 | 0% |
| §13b reverse charge | 5 | 0% |
| Small-business revenue (§19 UStG) | 11 | 0% |
| Non-domestic taxable service | 17 | 0% |
| One Stop Shop goods/e-services/other services | 18/19/20 | Depends on country |
| §18b reverse charge | 21 | 0% |
| Intra-community acquisitions (expense) | 8 | 0%, 7%, 19% |
| Deductible expenses | 9 | 0%, 7%, 19% |
| Non-deductible expenses | 10 | 0% |
| Reverse-charge expense rules | 12/13/14 | 0% |

Rules 17–21 have further restrictions in the provider's Update 2.0 section; rules 17 and 21 do not support advance/partial/final invoices, rules 18–20 do not support voucher use or advance/partial/final invoices, and rule 21 is not available for vouchers. AR/TR invoices accept only rules 1 or 11, and AR/TR/ER invoices must use the account's default currency. New invoices and credit notes are drafts; newly saved vouchers are DRAFT (50) or UNPAID/DUE (100). Update 2.0 rejects credit-note booking category `ACCOUNTING_TYPE`, requires delivery dates to match the source invoice, and does not support creating credit notes from vouchers. That documented `createCreditNoteFromVoucher` route remains for legacy bookkeeping system 1.0 accounts. Voucher assets must use an asset account correctly; custom accounting types are unsupported. Booking payments and sending documents are separate actions. Enshrining invoices, credit notes, vouchers, and check-account transactions is legally irreversible and marked destructive.

The legacy DATEV CSV export route remains exposed because it is documented but is deprecated; use the DATEV CSV/XML export-job workflow instead. `exportDatevXML` returns JSON job metadata; the resulting XML/ZIP artifact is obtained separately from the returned download URL.

## Complete operation inventory

| Corsair operation | HTTP route | Risk |
| --- | --- | --- |
| `basics.bookkeepingSystemVersion` | `GET /Tools/bookkeepingSystemVersion` | read |
| `checkAccount.getCheckAccounts` | `GET /CheckAccount` | read |
| `checkAccount.createFileImportAccount` | `POST /CheckAccount/Factory/fileImportAccount` | write |
| `checkAccount.createClearingAccount` | `POST /CheckAccount/Factory/clearingAccount` | write |
| `checkAccount.getCheckAccountById` | `GET /CheckAccount/{checkAccountId}` | read |
| `checkAccount.updateCheckAccount` | `PUT /CheckAccount/{checkAccountId}` | write |
| `checkAccount.deleteCheckAccount` | `DELETE /CheckAccount/{checkAccountId}` | destructive |
| `checkAccount.getBalanceAtDate` | `GET /CheckAccount/{checkAccountId}/getBalanceAtDate` | read |
| `checkAccountTransaction.getTransactions` | `GET /CheckAccountTransaction` | read |
| `checkAccountTransaction.createTransaction` | `POST /CheckAccountTransaction` | write |
| `checkAccountTransaction.getCheckAccountTransactionById` | `GET /CheckAccountTransaction/{checkAccountTransactionId}` | read |
| `checkAccountTransaction.updateCheckAccountTransaction` | `PUT /CheckAccountTransaction/{checkAccountTransactionId}` | write |
| `checkAccountTransaction.deleteCheckAccountTransaction` | `DELETE /CheckAccountTransaction/{checkAccountTransactionId}` | destructive |
| `checkAccountTransaction.checkAccountTransactionEnshrine` | `PUT /CheckAccountTransaction/{checkAccountTransactionId}/enshrine` | destructive |
| `privateTransactionRule.listPrivateTransactionRules` | `GET /PrivateTransactionRule` | read |
| `privateTransactionRule.createPrivateTransactionRule` | `POST /PrivateTransactionRule` | write |
| `privateTransactionRule.deletePrivateTransactionRule` | `DELETE /PrivateTransactionRule/{id}` | destructive |
| `contact.getNextCustomerNumber` | `GET /Contact/Factory/getNextCustomerNumber` | read |
| `contact.findContactsByCustomFieldValue` | `GET /Contact/Factory/findContactsByCustomFieldValue` | read |
| `contact.contactCustomerNumberAvailabilityCheck` | `GET /Contact/Mapper/checkCustomerNumberAvailability` | read |
| `contact.getContacts` | `GET /Contact` | read |
| `contact.createContact` | `POST /Contact` | write |
| `contact.getContactById` | `GET /Contact/{contactId}` | read |
| `contact.updateContact` | `PUT /Contact/{contactId}` | write |
| `contact.deleteContact` | `DELETE /Contact/{contactId}` | destructive |
| `contact.getContactTabsItemCountById` | `GET /Contact/{contactId}/getTabsItemCount` | read |
| `contactAddress.createContactAddress` | `POST /ContactAddress` | write |
| `contactAddress.getContactAddresses` | `GET /ContactAddress` | read |
| `contactAddress.contactAddressId` | `GET /ContactAddress/{contactAddressId}` | read |
| `contactAddress.updateContactAddress` | `PUT /ContactAddress/{contactAddressId}` | write |
| `contactAddress.deleteContactAddress` | `DELETE /ContactAddress/{contactAddressId}` | destructive |
| `communicationWay.getCommunicationWays` | `GET /CommunicationWay` | read |
| `communicationWay.createCommunicationWay` | `POST /CommunicationWay` | write |
| `communicationWay.getCommunicationWayById` | `GET /CommunicationWay/{communicationWayId}` | read |
| `communicationWay.deleteCommunicationWay` | `DELETE /CommunicationWay/{communicationWayId}` | destructive |
| `communicationWay.updateCommunicationWay` | `PUT /CommunicationWay/{communicationWayId}` | write |
| `communicationWay.getCommunicationWayKeys` | `GET /CommunicationWayKey` | read |
| `accountingContact.getAccountingContact` | `GET /AccountingContact` | read |
| `accountingContact.createAccountingContact` | `POST /AccountingContact` | write |
| `accountingContact.getAccountingContactById` | `GET /AccountingContact/{accountingContactId}` | read |
| `accountingContact.updateAccountingContact` | `PUT /AccountingContact/{accountingContactId}` | write |
| `accountingContact.deleteAccountingContact` | `DELETE /AccountingContact/{accountingContactId}` | destructive |
| `contactField.getPlaceholder` | `GET /Textparser/fetchDictionaryEntriesByType` | read |
| `contactField.getContactFields` | `GET /ContactCustomField` | read |
| `contactField.createContactField` | `POST /ContactCustomField` | write |
| `contactField.getContactFieldsById` | `GET /ContactCustomField/{contactCustomFieldId}` | read |
| `contactField.updateContactfield` | `PUT /ContactCustomField/{contactCustomFieldId}` | write |
| `contactField.deleteContactCustomFieldId` | `DELETE /ContactCustomField/{contactCustomFieldId}` | destructive |
| `contactField.getContactFieldSettings` | `GET /ContactCustomFieldSetting` | read |
| `contactField.createContactFieldSetting` | `POST /ContactCustomFieldSetting` | write |
| `contactField.getContactFieldSettingById` | `GET /ContactCustomFieldSetting/{contactCustomFieldSettingId}` | read |
| `contactField.updateContactFieldSetting` | `PUT /ContactCustomFieldSetting/{contactCustomFieldSettingId}` | write |
| `contactField.deleteContactFieldSetting` | `DELETE /ContactCustomFieldSetting/{contactCustomFieldSettingId}` | destructive |
| `contactField.getReferenceCount` | `GET /ContactCustomFieldSetting/{contactCustomFieldSettingId}/getReferenceCount` | read |
| `creditNote.getCreditNotes` | `GET /CreditNote` | read |
| `creditNote.createcreditNote` | `POST /CreditNote/Factory/saveCreditNote` | write |
| `creditNote.createCreditNoteFromInvoice` | `POST /CreditNote/Factory/createFromInvoice` | write |
| `creditNote.createCreditNoteFromVoucher` | `POST /CreditNote/Factory/createFromVoucher` | write |
| `creditNote.getcreditNoteById` | `GET /CreditNote/{creditNoteId}` | read |
| `creditNote.updatecreditNote` | `PUT /CreditNote/{creditNoteId}` | write |
| `creditNote.deletecreditNote` | `DELETE /CreditNote/{creditNoteId}` | destructive |
| `creditNote.sendCreditNoteByPrinting` | `GET /CreditNote/{creditNoteId}/sendByWithRender` | destructive |
| `creditNote.creditNoteSendBy` | `PUT /CreditNote/{creditNoteId}/sendBy` | destructive |
| `creditNote.creditNoteEnshrine` | `PUT /CreditNote/{creditNoteId}/enshrine` | destructive |
| `creditNote.creditNoteGetPdf` | `GET /CreditNote/{creditNoteId}/getPdf` | destructive |
| `creditNote.sendCreditNoteViaEMail` | `POST /CreditNote/{creditNoteId}/sendViaEmail` | destructive |
| `creditNote.bookCreditNote` | `PUT /CreditNote/{creditNoteId}/bookAmount` | destructive |
| `creditNote.creditNoteResetToOpen` | `PUT /CreditNote/{creditNoteId}/resetToOpen` | write |
| `creditNote.creditNoteResetToDraft` | `PUT /CreditNote/{creditNoteId}/resetToDraft` | write |
| `creditNotePos.getcreditNotePositions` | `GET /CreditNotePos` | read |
| `export.updateExportConfig` | `PUT /SevClient/{SevClientId}/updateExportConfig` | write |
| `export.exportDatevDepricated` | `GET /Export/datevCSV` | read |
| `export.exportDatevCSV` | `GET /Export/createDatevCsvZipExportJob` | read |
| `export.exportDatevXML` | `GET /Export/createDatevXmlZipExportJob` | read |
| `export.generateDownloadHash` | `GET /Progress/generateDownloadHash` | write |
| `export.getProgress` | `GET /Progress/getProgress` | read |
| `export.jobDownloadInfo` | `GET /ExportJob/jobDownloadInfo` | read |
| `export.exportInvoice` | `GET /Export/invoiceCsv` | read |
| `export.exportInvoiceZip` | `GET /Export/invoiceZip` | read |
| `export.exportCreditNote` | `GET /Export/creditNoteCsv` | read |
| `export.exportVoucher` | `GET /Export/voucherListCsv` | read |
| `export.exportTransactions` | `GET /Export/transactionsCsv` | read |
| `export.exportVoucherZip` | `GET /Export/voucherZip` | read |
| `export.exportContact` | `GET /Export/contactListCsv` | read |
| `part.getParts` | `GET /Part` | read |
| `part.createPart` | `POST /Part` | write |
| `part.getPartById` | `GET /Part/{partId}` | read |
| `part.updatePart` | `PUT /Part/{partId}` | write |
| `part.partGetStock` | `GET /Part/{partId}/getStock` | read |
| `invoice.getInvoices` | `GET /Invoice` | read |
| `invoice.createInvoiceByFactory` | `POST /Invoice/Factory/saveInvoice` | write |
| `invoice.getInvoiceById` | `GET /Invoice/{invoiceId}` | read |
| `invoice.getInvoicePositionsById` | `GET /Invoice/{invoiceId}/getPositions` | read |
| `invoice.createInvoiceFromOrder` | `POST /Invoice/Factory/createInvoiceFromOrder` | write |
| `invoice.createInvoiceReminder` | `POST /Invoice/Factory/createInvoiceReminder` | destructive |
| `invoice.getIsInvoicePartiallyPaid` | `GET /Invoice/{invoiceId}/getIsPartiallyPaid` | read |
| `invoice.cancelInvoice` | `POST /Invoice/{invoiceId}/cancelInvoice` | destructive |
| `invoice.invoiceRender` | `POST /Invoice/{invoiceId}/render` | write |
| `invoice.sendInvoiceViaEMail` | `POST /Invoice/{invoiceId}/sendViaEmail` | destructive |
| `invoice.invoiceGetPdf` | `GET /Invoice/{invoiceId}/getPdf` | destructive |
| `invoice.invoiceSendBy` | `PUT /Invoice/{invoiceId}/sendBy` | destructive |
| `invoice.invoiceEnshrine` | `PUT /Invoice/{invoiceId}/enshrine` | destructive |
| `invoice.bookInvoice` | `PUT /Invoice/{invoiceId}/bookAmount` | destructive |
| `invoice.invoiceResetToOpen` | `PUT /Invoice/{invoiceId}/resetToOpen` | write |
| `invoice.invoiceResetToDraft` | `PUT /Invoice/{invoiceId}/resetToDraft` | write |
| `invoicePos.getInvoicePos` | `GET /InvoicePos` | read |
| `layout.getLetterpapersWithThumb` | `GET /DocServer/getLetterpapersWithThumb` | read |
| `layout.getTemplates` | `GET /DocServer/getTemplatesWithThumb` | read |
| `layout.updateInvoiceTemplate` | `PUT /Invoice/{invoiceId}/changeParameter` | write |
| `layout.updateOrderTemplate` | `PUT /Order/{orderId}/changeParameter` | write |
| `layout.updateCreditNoteTemplate` | `PUT /CreditNote/{creditNoteId}/changeParameter` | write |
| `order.getOrders` | `GET /Order` | read |
| `order.createOrder` | `POST /Order/Factory/saveOrder` | write |
| `order.getOrderById` | `GET /Order/{orderId}` | read |
| `order.updateOrder` | `PUT /Order/{orderId}` | write |
| `order.deleteOrder` | `DELETE /Order/{orderId}` | destructive |
| `order.getOrderPositionsById` | `GET /Order/{orderId}/getPositions` | read |
| `order.getDiscounts` | `GET /Order/{orderId}/getDiscounts` | read |
| `order.getRelatedObjects` | `GET /Order/{orderId}/getRelatedObjects` | read |
| `order.sendorderViaEMail` | `POST /Order/{orderId}/sendViaEmail` | destructive |
| `order.createPackingListFromOrder` | `POST /Order/Factory/createPackingListFromOrder` | write |
| `order.createContractNoteFromOrder` | `POST /Order/Factory/createContractNoteFromOrder` | write |
| `order.orderGetPdf` | `GET /Order/{orderId}/getPdf` | destructive |
| `order.orderSendBy` | `PUT /Order/{orderId}/sendBy` | destructive |
| `orderPos.getOrderPositions` | `GET /OrderPos` | read |
| `orderPos.getOrderPositionById` | `GET /OrderPos/{orderPosId}` | read |
| `orderPos.updateOrderPosition` | `PUT /OrderPos/{orderPosId}` | write |
| `orderPos.deleteOrderPos` | `DELETE /OrderPos/{orderPosId}` | destructive |
| `voucher.voucherFactorySaveVoucher` | `POST /Voucher/Factory/saveVoucher` | write |
| `voucher.getVouchers` | `GET /Voucher` | read |
| `voucher.getVoucherById` | `GET /Voucher/{voucherId}` | read |
| `voucher.updateVoucher` | `PUT /Voucher/{voucherId}` | write |
| `voucher.voucherEnshrine` | `PUT /Voucher/{voucherId}/enshrine` | destructive |
| `voucher.bookVoucher` | `PUT /Voucher/{voucherId}/bookAmount` | destructive |
| `voucher.voucherResetToOpen` | `PUT /Voucher/{voucherId}/resetToOpen` | write |
| `voucher.voucherResetToDraft` | `PUT /Voucher/{voucherId}/resetToDraft` | write |
| `voucherPos.getVoucherPositions` | `GET /VoucherPos` | read |
| `voucher.forAllAccounts` | `GET /ReceiptGuidance/forAllAccounts` | read |
| `voucher.forAccountNumber` | `GET /ReceiptGuidance/forAccountNumber` | read |
| `voucher.forTaxRule` | `GET /ReceiptGuidance/forTaxRule` | read |
| `voucher.forRevenue` | `GET /ReceiptGuidance/forRevenue` | read |
| `voucher.forExpense` | `GET /ReceiptGuidance/forExpense` | read |
| `report.reportInvoice` | `GET /Report/invoicelist` | read |
| `report.reportOrder` | `GET /Report/orderlist` | read |
| `report.reportContact` | `GET /Report/contactlist` | read |
| `report.reportVoucher` | `GET /Report/voucherlist` | read |
| `tag.getTags` | `GET /Tag` | read |
| `tag.getTagById` | `GET /Tag/{tagId}` | read |
| `tag.updateTag` | `PUT /Tag/{tagId}` | write |
| `tag.deleteTag` | `DELETE /Tag/{tagId}` | destructive |
| `tag.createTag` | `POST /Tag/Factory/create` | write |
| `tag.getTagRelations` | `GET /TagRelation` | read |

### Exclusions and webhooks

| OpenAPI route | Reason |
| --- | --- |
| `POST /Voucher/Factory/uploadTempFile` (`voucherUploadFile`) | Multipart/form-data file upload is outside the documented-JSON transport surface. |
| `GET /Invoice/{invoiceId}/getXml` (`invoiceGetXml`) | Returns XML invoice content; the plugin intentionally supports JSON only. |

Webhook receiving is excluded per issue scope. The OpenAPI specification has no top-level webhook definitions and no webhook/callback paths. Other XML Accept/Content-Type modes are not exposed. JSON-wrapped Base64 PDF/export content and JSON export-job metadata remain supported.
