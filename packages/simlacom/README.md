# Simla.com plugin for Corsair

Call all documented Simla.com API v5 REST operations from a Corsair instance. The operation registry and its request/response validators are derived from the official v5 method reference.

## Setup

```ts
import { simlacom } from '@corsair-dev/simlacom';

const simla = simlacom();
```

Each connection stores two values: the API key (Settings > Integration > API access keys) and the account `subdomain`, `acme` for `https://acme.simla.com` (the full account URL is accepted too). Hub's connect form asks for both. A `subdomain` plugin option overrides the stored one. Requests only ever go to `https://{subdomain}.simla.com`; the key travels in the `X-API-KEY` header, never in the URL.

Each operation exposes its own TypeScript input and output types, generated from the v5 request and response schemas. The API reference page includes a call example for every registered operation.

Official sources: [v5 method reference](https://rest-api-docs.simla.com/v5/), [API rules, authentication, pagination and limits](https://docs.simla.com/developers/api/api-features/api-rules/), and [API version guide](https://docs.simla.com/developers/api/api-versions/).

## Request and response behavior

- The current API is v5. Operations use `https://{subdomain}.simla.com/api/v5/`; the two account/version discovery methods use their documented `/api/` paths.
- Inputs use `{ path, query, body }`. Each group is strict and validated against the published OpenAPI contract; undocumented fields are rejected. Numeric record ids can be passed as numbers where the reference types them as digit strings.
- Responses are checked for structure only: objects stay objects and lists stay lists, while scalars, nulls and new enum values pass. Live responses differ from the published models (ids and `ordering` as strings, lists where the model has an object), so a strict check would reject valid data. The docs and TypeScript types still describe the published models.
- GET filters use the documented bracketed query names. A list value is always sent as `name[]=a&name[]=b`, also for the few parameters the reference names without `[]` (Simla.com refuses `ids=1&ids=2`). List operations accept `page` (and `limit` where documented); cursor-based methods accept the documented `cursor`. Pagination metadata is returned unchanged.
- POST requests use `application/x-www-form-urlencoded`; nested values are encoded as JSON strings per the provider rules.
- Binary file upload takes a base64 string in `body`; binary downloads (files, call recordings, printed order forms) return `{ kind: 'binary', contentType, base64 }`. Binary payloads are capped at 20 MiB by this client.
- The documented limit is 10 requests/second per IP, or 40/second for telephony. Simla.com may answer with HTTP 503 at the limit. The shared transport honors `Retry-After` for 429; the plugin does not automatically replay 503 writes.
- API errors keep their HTTP status, rate-limit timing and Simla.com's `errorMsg` and per-field `errors` (for example "Telephony not enabled"); other response fields, path/query values and request bodies are removed.
- The reference marks `courier.firstName` on courier create/edit and `phone`, `type`, and `code` on telephony call events as required but omits their types. The plugin enforces presence and documents those value shapes as unverified.
- The order plate print route streams the printed form, so it returns the same base64 envelope as file downloads.

## Operation inventory

The list below covers 227 `/api/v5/*` methods and the two documented `/api/api-versions` and `/api/credentials` discovery methods. Every route links to the [official API reference](https://rest-api-docs.simla.com/v5/).

| Corsair operation | Method | Route | Risk |
| --- | --- | --- | --- |
| `api.apiVersions.get` | GET | [`/api/api-versions`](https://rest-api-docs.simla.com/v5/) | read |
| `api.credentials.get` | GET | [`/api/credentials`](https://rest-api-docs.simla.com/v5/) | read |
| `cost.list.get` | GET | [`/api/v5/costs`](https://rest-api-docs.simla.com/v5/) | read |
| `cost.create.post` | POST | [`/api/v5/costs/create`](https://rest-api-docs.simla.com/v5/) | write |
| `cost.delete.post` | POST | [`/api/v5/costs/delete`](https://rest-api-docs.simla.com/v5/) | destructive |
| `cost.upload.post` | POST | [`/api/v5/costs/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `cost.getById.get` | GET | [`/api/v5/costs/{id}`](https://rest-api-docs.simla.com/v5/) | read |
| `cost.byIdDelete.post` | POST | [`/api/v5/costs/{id}/delete`](https://rest-api-docs.simla.com/v5/) | destructive |
| `cost.byIdEdit.post` | POST | [`/api/v5/costs/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `customFields.list.get` | GET | [`/api/v5/custom-fields`](https://rest-api-docs.simla.com/v5/) | read |
| `customFields.dictionaries.get` | GET | [`/api/v5/custom-fields/dictionaries`](https://rest-api-docs.simla.com/v5/) | read |
| `customFields.dictionariesCreate.post` | POST | [`/api/v5/custom-fields/dictionaries/create`](https://rest-api-docs.simla.com/v5/) | write |
| `customFields.getDictionariesByCode.get` | GET | [`/api/v5/custom-fields/dictionaries/{code}`](https://rest-api-docs.simla.com/v5/) | read |
| `customFields.dictionariesByCodeEdit.post` | POST | [`/api/v5/custom-fields/dictionaries/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `customFields.byEntityCreate.post` | POST | [`/api/v5/custom-fields/{entity}/create`](https://rest-api-docs.simla.com/v5/) | write |
| `customFields.getByEntityByCode.get` | GET | [`/api/v5/custom-fields/{entity}/{code}`](https://rest-api-docs.simla.com/v5/) | read |
| `customFields.byEntityByCodeEdit.post` | POST | [`/api/v5/custom-fields/{entity}/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `customers.list.get` | GET | [`/api/v5/customers`](https://rest-api-docs.simla.com/v5/) | read |
| `customers.combine.post` | POST | [`/api/v5/customers/combine`](https://rest-api-docs.simla.com/v5/) | destructive |
| `customers.create.post` | POST | [`/api/v5/customers/create`](https://rest-api-docs.simla.com/v5/) | write |
| `customers.fixExternalIds.post` | POST | [`/api/v5/customers/fix-external-ids`](https://rest-api-docs.simla.com/v5/) | write |
| `customers.history.get` | GET | [`/api/v5/customers/history`](https://rest-api-docs.simla.com/v5/) | read |
| `customers.notes.get` | GET | [`/api/v5/customers/notes`](https://rest-api-docs.simla.com/v5/) | read |
| `customers.notesCreate.post` | POST | [`/api/v5/customers/notes/create`](https://rest-api-docs.simla.com/v5/) | write |
| `customers.notesByIdDelete.post` | POST | [`/api/v5/customers/notes/{id}/delete`](https://rest-api-docs.simla.com/v5/) | destructive |
| `customers.pushTokens.get` | GET | [`/api/v5/customers/push-tokens`](https://rest-api-docs.simla.com/v5/) | read |
| `customers.pushTokensBatch.post` | POST | [`/api/v5/customers/push-tokens/batch`](https://rest-api-docs.simla.com/v5/) | write |
| `customers.upload.post` | POST | [`/api/v5/customers/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `customers.getByExternalid.get` | GET | [`/api/v5/customers/{externalId}`](https://rest-api-docs.simla.com/v5/) | read |
| `customers.byExternalidEdit.post` | POST | [`/api/v5/customers/{externalId}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `customers.byExternalidSubscriptions.post` | POST | [`/api/v5/customers/{externalId}/subscriptions`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.list.get` | GET | [`/api/v5/customers-corporate`](https://rest-api-docs.simla.com/v5/) | read |
| `corporateCustomers.combine.post` | POST | [`/api/v5/customers-corporate/combine`](https://rest-api-docs.simla.com/v5/) | destructive |
| `corporateCustomers.create.post` | POST | [`/api/v5/customers-corporate/create`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.fixExternalIds.post` | POST | [`/api/v5/customers-corporate/fix-external-ids`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.history.get` | GET | [`/api/v5/customers-corporate/history`](https://rest-api-docs.simla.com/v5/) | read |
| `corporateCustomers.notes.get` | GET | [`/api/v5/customers-corporate/notes`](https://rest-api-docs.simla.com/v5/) | read |
| `corporateCustomers.notesCreate.post` | POST | [`/api/v5/customers-corporate/notes/create`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.notesByIdDelete.post` | POST | [`/api/v5/customers-corporate/notes/{id}/delete`](https://rest-api-docs.simla.com/v5/) | destructive |
| `corporateCustomers.upload.post` | POST | [`/api/v5/customers-corporate/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.getByExternalid.get` | GET | [`/api/v5/customers-corporate/{externalId}`](https://rest-api-docs.simla.com/v5/) | read |
| `corporateCustomers.getByExternalidAddresses.get` | GET | [`/api/v5/customers-corporate/{externalId}/addresses`](https://rest-api-docs.simla.com/v5/) | read |
| `corporateCustomers.byExternalidAddressesCreate.post` | POST | [`/api/v5/customers-corporate/{externalId}/addresses/create`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.byExternalidAddressesByEntityexternalidEdit.post` | POST | [`/api/v5/customers-corporate/{externalId}/addresses/{entityExternalId}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.getByExternalidCompanies.get` | GET | [`/api/v5/customers-corporate/{externalId}/companies`](https://rest-api-docs.simla.com/v5/) | read |
| `corporateCustomers.byExternalidCompaniesCreate.post` | POST | [`/api/v5/customers-corporate/{externalId}/companies/create`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.byExternalidCompaniesByEntityexternalidEdit.post` | POST | [`/api/v5/customers-corporate/{externalId}/companies/{entityExternalId}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.getByExternalidContacts.get` | GET | [`/api/v5/customers-corporate/{externalId}/contacts`](https://rest-api-docs.simla.com/v5/) | read |
| `corporateCustomers.byExternalidContactsCreate.post` | POST | [`/api/v5/customers-corporate/{externalId}/contacts/create`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.byExternalidContactsByEntityexternalidEdit.post` | POST | [`/api/v5/customers-corporate/{externalId}/contacts/{entityExternalId}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `corporateCustomers.byExternalidEdit.post` | POST | [`/api/v5/customers-corporate/{externalId}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `customerInteraction.cartBySiteClear.post` | POST | [`/api/v5/customer-interaction/{site}/cart/clear`](https://rest-api-docs.simla.com/v5/) | destructive |
| `customerInteraction.cartBySiteSet.post` | POST | [`/api/v5/customer-interaction/{site}/cart/set`](https://rest-api-docs.simla.com/v5/) | write |
| `customerInteraction.getCartBySiteByCustomerid.get` | GET | [`/api/v5/customer-interaction/{site}/cart/{customerId}`](https://rest-api-docs.simla.com/v5/) | read |
| `customerInteraction.getFavoritesBySiteByCustomerid.get` | GET | [`/api/v5/customer-interaction/{site}/favorites/{customerId}`](https://rest-api-docs.simla.com/v5/) | read |
| `customerInteraction.favoritesBySiteByCustomeridAdd.post` | POST | [`/api/v5/customer-interaction/{site}/favorites/{customerId}/add`](https://rest-api-docs.simla.com/v5/) | write |
| `customerInteraction.favoritesBySiteByCustomeridRemove.post` | POST | [`/api/v5/customer-interaction/{site}/favorites/{customerId}/remove`](https://rest-api-docs.simla.com/v5/) | write |
| `deliveries.deliveryCalculate.post` | POST | [`/api/v5/delivery/calculate`](https://rest-api-docs.simla.com/v5/) | read |
| `deliveries.deliveryGenericBySubcodeTracking.post` | POST | [`/api/v5/delivery/generic/{subcode}/tracking`](https://rest-api-docs.simla.com/v5/) | write |
| `deliveries.deliveryShipments.get` | GET | [`/api/v5/delivery/shipments`](https://rest-api-docs.simla.com/v5/) | read |
| `deliveries.deliveryShipmentsCreate.post` | POST | [`/api/v5/delivery/shipments/create`](https://rest-api-docs.simla.com/v5/) | destructive |
| `deliveries.getDeliveryShipmentsById.get` | GET | [`/api/v5/delivery/shipments/{id}`](https://rest-api-docs.simla.com/v5/) | read |
| `deliveries.deliveryShipmentsByIdEdit.post` | POST | [`/api/v5/delivery/shipments/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `files.list.get` | GET | [`/api/v5/files`](https://rest-api-docs.simla.com/v5/) | read |
| `files.upload.post` | POST | [`/api/v5/files/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `files.getById.get` | GET | [`/api/v5/files/{id}`](https://rest-api-docs.simla.com/v5/) | read |
| `files.byIdDelete.post` | POST | [`/api/v5/files/{id}/delete`](https://rest-api-docs.simla.com/v5/) | destructive |
| `files.byIdDownload.get` | GET | [`/api/v5/files/{id}/download`](https://rest-api-docs.simla.com/v5/) | read |
| `files.byIdEdit.post` | POST | [`/api/v5/files/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `integration.getIntegrationModulesByCode.get` | GET | [`/api/v5/integration-modules/{code}`](https://rest-api-docs.simla.com/v5/) | read |
| `integration.integrationModulesByCodeEdit.post` | POST | [`/api/v5/integration-modules/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `knowledgeBase.documents.get` | GET | [`/api/v5/knowledge-base/documents`](https://rest-api-docs.simla.com/v5/) | read |
| `knowledgeBase.documentsCreate.post` | POST | [`/api/v5/knowledge-base/documents/create`](https://rest-api-docs.simla.com/v5/) | write |
| `knowledgeBase.documentsHistory.get` | GET | [`/api/v5/knowledge-base/documents/history`](https://rest-api-docs.simla.com/v5/) | read |
| `knowledgeBase.getDocumentsById.get` | GET | [`/api/v5/knowledge-base/documents/{id}`](https://rest-api-docs.simla.com/v5/) | read |
| `knowledgeBase.documentsByIdDelete.post` | POST | [`/api/v5/knowledge-base/documents/{id}/delete`](https://rest-api-docs.simla.com/v5/) | destructive |
| `knowledgeBase.documentsByIdEdit.post` | POST | [`/api/v5/knowledge-base/documents/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `knowledgeBase.sections.get` | GET | [`/api/v5/knowledge-base/sections`](https://rest-api-docs.simla.com/v5/) | read |
| `knowledgeBase.sectionsCreate.post` | POST | [`/api/v5/knowledge-base/sections/create`](https://rest-api-docs.simla.com/v5/) | write |
| `knowledgeBase.sectionsByIdDelete.post` | POST | [`/api/v5/knowledge-base/sections/{id}/delete`](https://rest-api-docs.simla.com/v5/) | destructive |
| `knowledgeBase.sectionsByIdEdit.post` | POST | [`/api/v5/knowledge-base/sections/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `loyalty.accountCreate.post` | POST | [`/api/v5/loyalty/account/create`](https://rest-api-docs.simla.com/v5/) | write |
| `loyalty.getAccountById.get` | GET | [`/api/v5/loyalty/account/{id}`](https://rest-api-docs.simla.com/v5/) | read |
| `loyalty.accountByIdActivate.post` | POST | [`/api/v5/loyalty/account/{id}/activate`](https://rest-api-docs.simla.com/v5/) | write |
| `loyalty.accountByIdBonusCharge.post` | POST | [`/api/v5/loyalty/account/{id}/bonus/charge`](https://rest-api-docs.simla.com/v5/) | destructive |
| `loyalty.accountByIdBonusCredit.post` | POST | [`/api/v5/loyalty/account/{id}/bonus/credit`](https://rest-api-docs.simla.com/v5/) | destructive |
| `loyalty.getAccountByIdBonusOperations.get` | GET | [`/api/v5/loyalty/account/{id}/bonus/operations`](https://rest-api-docs.simla.com/v5/) | read |
| `loyalty.getAccountByIdBonusByStatusDetails.get` | GET | [`/api/v5/loyalty/account/{id}/bonus/{status}/details`](https://rest-api-docs.simla.com/v5/) | read |
| `loyalty.accountByIdEdit.post` | POST | [`/api/v5/loyalty/account/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `loyalty.accounts.get` | GET | [`/api/v5/loyalty/accounts`](https://rest-api-docs.simla.com/v5/) | read |
| `loyalty.bonusOperations.get` | GET | [`/api/v5/loyalty/bonus/operations`](https://rest-api-docs.simla.com/v5/) | read |
| `loyalty.calculate.post` | POST | [`/api/v5/loyalty/calculate`](https://rest-api-docs.simla.com/v5/) | read |
| `loyalty.loyalties.get` | GET | [`/api/v5/loyalty/loyalties`](https://rest-api-docs.simla.com/v5/) | read |
| `loyalty.getLoyaltiesById.get` | GET | [`/api/v5/loyalty/loyalties/{id}`](https://rest-api-docs.simla.com/v5/) | read |
| `notifications.send.post` | POST | [`/api/v5/notifications/send`](https://rest-api-docs.simla.com/v5/) | destructive |
| `orders.list.get` | GET | [`/api/v5/orders`](https://rest-api-docs.simla.com/v5/) | read |
| `orders.combine.post` | POST | [`/api/v5/orders/combine`](https://rest-api-docs.simla.com/v5/) | destructive |
| `orders.create.post` | POST | [`/api/v5/orders/create`](https://rest-api-docs.simla.com/v5/) | write |
| `orders.fixExternalIds.post` | POST | [`/api/v5/orders/fix-external-ids`](https://rest-api-docs.simla.com/v5/) | write |
| `orders.history.get` | GET | [`/api/v5/orders/history`](https://rest-api-docs.simla.com/v5/) | read |
| `orders.linksCreate.post` | POST | [`/api/v5/orders/links/create`](https://rest-api-docs.simla.com/v5/) | write |
| `orders.loyaltyApply.post` | POST | [`/api/v5/orders/loyalty/apply`](https://rest-api-docs.simla.com/v5/) | destructive |
| `orders.loyaltyCancelBonusOperations.post` | POST | [`/api/v5/orders/loyalty/cancel-bonus-operations`](https://rest-api-docs.simla.com/v5/) | destructive |
| `orders.paymentsCreate.post` | POST | [`/api/v5/orders/payments/create`](https://rest-api-docs.simla.com/v5/) | write |
| `orders.paymentsByIdDelete.post` | POST | [`/api/v5/orders/payments/{id}/delete`](https://rest-api-docs.simla.com/v5/) | destructive |
| `orders.paymentsByIdEdit.post` | POST | [`/api/v5/orders/payments/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `orders.statuses.get` | GET | [`/api/v5/orders/statuses`](https://rest-api-docs.simla.com/v5/) | read |
| `orders.upload.post` | POST | [`/api/v5/orders/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `orders.getByExternalid.get` | GET | [`/api/v5/orders/{externalId}`](https://rest-api-docs.simla.com/v5/) | read |
| `orders.byExternalidDeliveryCancel.post` | POST | [`/api/v5/orders/{externalId}/delivery/cancel`](https://rest-api-docs.simla.com/v5/) | destructive |
| `orders.byExternalidEdit.post` | POST | [`/api/v5/orders/{externalId}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `orders.byExternalidPlatesByPlateidPrint.get` | GET | [`/api/v5/orders/{externalId}/plates/{plateId}/print`](https://rest-api-docs.simla.com/v5/) | read |
| `ordersPicking.packs.get` | GET | [`/api/v5/orders/packs`](https://rest-api-docs.simla.com/v5/) | read |
| `ordersPicking.packsCreate.post` | POST | [`/api/v5/orders/packs/create`](https://rest-api-docs.simla.com/v5/) | write |
| `ordersPicking.packsHistory.get` | GET | [`/api/v5/orders/packs/history`](https://rest-api-docs.simla.com/v5/) | read |
| `ordersPicking.getPacksById.get` | GET | [`/api/v5/orders/packs/{id}`](https://rest-api-docs.simla.com/v5/) | read |
| `ordersPicking.packsByIdDelete.post` | POST | [`/api/v5/orders/packs/{id}/delete`](https://rest-api-docs.simla.com/v5/) | destructive |
| `ordersPicking.packsByIdEdit.post` | POST | [`/api/v5/orders/packs/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `payments.paymentCheck.post` | POST | [`/api/v5/payment/check`](https://rest-api-docs.simla.com/v5/) | read |
| `payments.paymentCreateInvoice.post` | POST | [`/api/v5/payment/create-invoice`](https://rest-api-docs.simla.com/v5/) | destructive |
| `payments.paymentInvoiceImport.post` | POST | [`/api/v5/payment/invoice/import`](https://rest-api-docs.simla.com/v5/) | write |
| `payments.getPaymentInvoiceByInvoiceuuid.get` | GET | [`/api/v5/payment/invoice/{invoiceUuid}`](https://rest-api-docs.simla.com/v5/) | read |
| `payments.paymentUpdateInvoice.post` | POST | [`/api/v5/payment/update-invoice`](https://rest-api-docs.simla.com/v5/) | destructive |
| `dataBook.referenceCostGroups.get` | GET | [`/api/v5/reference/cost-groups`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceCostGroupsByCodeEdit.post` | POST | [`/api/v5/reference/cost-groups/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceCostItems.get` | GET | [`/api/v5/reference/cost-items`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceCostItemsByCodeEdit.post` | POST | [`/api/v5/reference/cost-items/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceCountries.get` | GET | [`/api/v5/reference/countries`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceCouriers.get` | GET | [`/api/v5/reference/couriers`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceCouriersCreate.post` | POST | [`/api/v5/reference/couriers/create`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceCouriersByIdEdit.post` | POST | [`/api/v5/reference/couriers/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceCurrencies.get` | GET | [`/api/v5/reference/currencies`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceCurrenciesCreate.post` | POST | [`/api/v5/reference/currencies/create`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceCurrenciesByIdEdit.post` | POST | [`/api/v5/reference/currencies/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceDeliveryServices.get` | GET | [`/api/v5/reference/delivery-services`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceDeliveryServicesByCodeEdit.post` | POST | [`/api/v5/reference/delivery-services/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceDeliveryTypes.get` | GET | [`/api/v5/reference/delivery-types`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceDeliveryTypesByCodeEdit.post` | POST | [`/api/v5/reference/delivery-types/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceLegalEntities.get` | GET | [`/api/v5/reference/legal-entities`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceLegalEntitiesByCodeEdit.post` | POST | [`/api/v5/reference/legal-entities/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceMgChannels.get` | GET | [`/api/v5/reference/mg-channels`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceOrderMethods.get` | GET | [`/api/v5/reference/order-methods`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceOrderMethodsByCodeEdit.post` | POST | [`/api/v5/reference/order-methods/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceOrderTypes.get` | GET | [`/api/v5/reference/order-types`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceOrderTypesByCodeEdit.post` | POST | [`/api/v5/reference/order-types/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referencePaymentStatuses.get` | GET | [`/api/v5/reference/payment-statuses`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referencePaymentStatusesByCodeEdit.post` | POST | [`/api/v5/reference/payment-statuses/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referencePaymentTypes.get` | GET | [`/api/v5/reference/payment-types`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referencePaymentTypesByCodeEdit.post` | POST | [`/api/v5/reference/payment-types/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referencePriceTypes.get` | GET | [`/api/v5/reference/price-types`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referencePriceTypesByCodeEdit.post` | POST | [`/api/v5/reference/price-types/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceProductStatuses.get` | GET | [`/api/v5/reference/product-statuses`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceProductStatusesByCodeEdit.post` | POST | [`/api/v5/reference/product-statuses/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referencePushCategories.get` | GET | [`/api/v5/reference/push-categories`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referencePushCategoriesByCodeEdit.post` | POST | [`/api/v5/reference/push-categories/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceSites.get` | GET | [`/api/v5/reference/sites`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceSitesByCodeEdit.post` | POST | [`/api/v5/reference/sites/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.getReferenceSitesByCodeTracker.get` | GET | [`/api/v5/reference/sites/{code}/tracker`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceStatusGroups.get` | GET | [`/api/v5/reference/status-groups`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceStatuses.get` | GET | [`/api/v5/reference/statuses`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceStatusesByCodeEdit.post` | POST | [`/api/v5/reference/statuses/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceStores.get` | GET | [`/api/v5/reference/stores`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceStoresByCodeEdit.post` | POST | [`/api/v5/reference/stores/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceSubscriptions.get` | GET | [`/api/v5/reference/subscriptions`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceSubscriptionsByChannelByCodeEdit.post` | POST | [`/api/v5/reference/subscriptions/{channel}/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketChannels.get` | GET | [`/api/v5/reference/ticket-channels`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceTicketChannelsCreate.post` | POST | [`/api/v5/reference/ticket-channels/create`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketChannelsByIdEdit.post` | POST | [`/api/v5/reference/ticket-channels/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketStatusGroups.get` | GET | [`/api/v5/reference/ticket-status-groups`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceTicketStatusGroupsCreate.post` | POST | [`/api/v5/reference/ticket-status-groups/create`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketStatusGroupsByIdEdit.post` | POST | [`/api/v5/reference/ticket-status-groups/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketStatuses.get` | GET | [`/api/v5/reference/ticket-statuses`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceTicketStatusesCreate.post` | POST | [`/api/v5/reference/ticket-statuses/create`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketStatusesByIdEdit.post` | POST | [`/api/v5/reference/ticket-statuses/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketSubtopics.get` | GET | [`/api/v5/reference/ticket-subtopics`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceTicketSubtopicsCreate.post` | POST | [`/api/v5/reference/ticket-subtopics/create`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketSubtopicsByIdEdit.post` | POST | [`/api/v5/reference/ticket-subtopics/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketTopics.get` | GET | [`/api/v5/reference/ticket-topics`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceTicketTopicsCreate.post` | POST | [`/api/v5/reference/ticket-topics/create`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketTopicsByIdEdit.post` | POST | [`/api/v5/reference/ticket-topics/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketTypes.get` | GET | [`/api/v5/reference/ticket-types`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceTicketTypesCreate.post` | POST | [`/api/v5/reference/ticket-types/create`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceTicketTypesByIdEdit.post` | POST | [`/api/v5/reference/ticket-types/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `dataBook.referenceUnits.get` | GET | [`/api/v5/reference/units`](https://rest-api-docs.simla.com/v5/) | read |
| `dataBook.referenceUnitsByCodeEdit.post` | POST | [`/api/v5/reference/units/{code}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `segments.list.get` | GET | [`/api/v5/segments`](https://rest-api-docs.simla.com/v5/) | read |
| `settings.list.get` | GET | [`/api/v5/settings`](https://rest-api-docs.simla.com/v5/) | read |
| `store.inventories.get` | GET | [`/api/v5/store/inventories`](https://rest-api-docs.simla.com/v5/) | read |
| `store.inventoriesUpload.post` | POST | [`/api/v5/store/inventories/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `store.offers.get` | GET | [`/api/v5/store/offers`](https://rest-api-docs.simla.com/v5/) | read |
| `store.pricesUpload.post` | POST | [`/api/v5/store/prices/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `store.productGroups.get` | GET | [`/api/v5/store/product-groups`](https://rest-api-docs.simla.com/v5/) | read |
| `store.productGroupsCreate.post` | POST | [`/api/v5/store/product-groups/create`](https://rest-api-docs.simla.com/v5/) | write |
| `store.productGroupsByExternalidEdit.post` | POST | [`/api/v5/store/product-groups/{externalId}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `store.products.get` | GET | [`/api/v5/store/products`](https://rest-api-docs.simla.com/v5/) | read |
| `store.productsBatchCreate.post` | POST | [`/api/v5/store/products/batch/create`](https://rest-api-docs.simla.com/v5/) | write |
| `store.productsBatchEdit.post` | POST | [`/api/v5/store/products/batch/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `store.productsProperties.get` | GET | [`/api/v5/store/products/properties`](https://rest-api-docs.simla.com/v5/) | read |
| `store.productsPropertiesValues.get` | GET | [`/api/v5/store/products/properties/values`](https://rest-api-docs.simla.com/v5/) | read |
| `tasks.list.get` | GET | [`/api/v5/tasks`](https://rest-api-docs.simla.com/v5/) | read |
| `tasks.create.post` | POST | [`/api/v5/tasks/create`](https://rest-api-docs.simla.com/v5/) | write |
| `tasks.history.get` | GET | [`/api/v5/tasks/history`](https://rest-api-docs.simla.com/v5/) | read |
| `tasks.getById.get` | GET | [`/api/v5/tasks/{id}`](https://rest-api-docs.simla.com/v5/) | read |
| `tasks.getByIdComments.get` | GET | [`/api/v5/tasks/{id}/comments`](https://rest-api-docs.simla.com/v5/) | read |
| `tasks.byIdEdit.post` | POST | [`/api/v5/tasks/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `telephony.callEvent.post` | POST | [`/api/v5/telephony/call/event`](https://rest-api-docs.simla.com/v5/) | write |
| `telephony.calls.get` | GET | [`/api/v5/telephony/calls`](https://rest-api-docs.simla.com/v5/) | read |
| `telephony.callsUpload.post` | POST | [`/api/v5/telephony/calls/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `telephony.getCallsByIdRecord.get` | GET | [`/api/v5/telephony/calls/{id}/record`](https://rest-api-docs.simla.com/v5/) | read |
| `telephony.manager.get` | GET | [`/api/v5/telephony/manager`](https://rest-api-docs.simla.com/v5/) | read |
| `tickets.list.get` | GET | [`/api/v5/tickets`](https://rest-api-docs.simla.com/v5/) | read |
| `tickets.comments.get` | GET | [`/api/v5/tickets/comments`](https://rest-api-docs.simla.com/v5/) | read |
| `tickets.commentsCreate.post` | POST | [`/api/v5/tickets/comments/create`](https://rest-api-docs.simla.com/v5/) | write |
| `tickets.commentsByIdDelete.post` | POST | [`/api/v5/tickets/comments/{id}/delete`](https://rest-api-docs.simla.com/v5/) | destructive |
| `tickets.commentsByIdEdit.post` | POST | [`/api/v5/tickets/comments/{id}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `tickets.create.post` | POST | [`/api/v5/tickets/create`](https://rest-api-docs.simla.com/v5/) | write |
| `tickets.history.get` | GET | [`/api/v5/tickets/history`](https://rest-api-docs.simla.com/v5/) | read |
| `tickets.getByExternalid.get` | GET | [`/api/v5/tickets/{externalId}`](https://rest-api-docs.simla.com/v5/) | read |
| `tickets.byExternalidEdit.post` | POST | [`/api/v5/tickets/{externalId}/edit`](https://rest-api-docs.simla.com/v5/) | write |
| `users.userGroups.get` | GET | [`/api/v5/user-groups`](https://rest-api-docs.simla.com/v5/) | read |
| `users.list.get` | GET | [`/api/v5/users`](https://rest-api-docs.simla.com/v5/) | read |
| `users.getById.get` | GET | [`/api/v5/users/{id}`](https://rest-api-docs.simla.com/v5/) | read |
| `users.byIdStatus.post` | POST | [`/api/v5/users/{id}/status`](https://rest-api-docs.simla.com/v5/) | write |
| `verification.smsConfirm.post` | POST | [`/api/v5/verification/sms/confirm`](https://rest-api-docs.simla.com/v5/) | write |
| `verification.getSmsByCheckidStatus.get` | GET | [`/api/v5/verification/sms/{checkId}/status`](https://rest-api-docs.simla.com/v5/) | read |
| `webAnalytics.clientIdsUpload.post` | POST | [`/api/v5/web-analytics/client-ids/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `webAnalytics.sourcesUpload.post` | POST | [`/api/v5/web-analytics/sources/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `webAnalytics.visitsUpload.post` | POST | [`/api/v5/web-analytics/visits/upload`](https://rest-api-docs.simla.com/v5/) | write |
| `statistics.statisticUpdate.get` | GET | [`/api/v5/statistic/update`](https://rest-api-docs.simla.com/v5/) | read |

## Excluded routes and features

The reference also describes 27 provider-hosted integration-module callback/configuration routes (including `/{configUrl}`, `/{registerUrl}`, and dynamic delivery, payment, telephony and messaging action URLs). These are destinations Simla.com invokes as part of separately hosted integrations, not stable Simla.com REST routes for a Corsair client, so they are excluded. `POST /api/v5/integration-modules/{code}/update-scopes` is also left out: it mints a new API key, and a plugin should not hand out or replace the key it is connected with. Webhook receiving/management is excluded by issue #2408; this plugin registers no inbound webhooks.

The live smoke test is read-only. Set `SIMLACOM_API_KEY` and `SIMLACOM_SUBDOMAIN`, then run `pnpm --dir packages/simlacom test:live`; without both values it logs a skip warning and does not call Simla.com.
