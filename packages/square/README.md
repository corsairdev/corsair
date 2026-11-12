# @corsair-dev/square

Square plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/square
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bookings.getBusinessProfile` | `square.api.bookings.getBusinessProfile` | `read` | Retrieves a seller's booking profile. |
| `cards.create` | `square.api.cards.create` | `write` | Adds a card on file to an existing merchant. Requires idempotency_key; pass the same key to retry safely. |
| `cards.disable` | `square.api.cards.disable` | `destructive` | Disables the card, preventing any further updates or charges. Disabling an already disabled card is allowed but has no effect. Cannot be undone. |
| `cards.get` | `square.api.cards.get` | `read` | Retrieves details for a specific Card. |
| `cards.list` | `square.api.cards.list` | `read` | Retrieves a list of cards owned by the account making the request. A max of 25 cards will be returned. |
| `catalog.delete` | `square.api.catalog.delete` | `destructive` | Deletes a single CatalogObject based on the provided ID and returns the set of successfully deleted IDs in the response. Deletion is a cascading event such that all children of the targeted object are also deleted. Cannot be undone. |
| `catalog.get` | `square.api.catalog.get` | `read` | Returns a single CatalogItem as a CatalogObject based on the provided ID. |
| `catalog.list` | `square.api.catalog.list` | `read` | Returns a list of all CatalogObjects of the specified types in the catalog. |
| `catalog.search` | `square.api.catalog.search` | `read` | Searches for CatalogObject of any type by matching supported search attribute values, excluding custom attribute values on items or item variations, against one or more of the specified query filters. |
| `catalog.upsert` | `square.api.catalog.upsert` | `write` | Creates a new or updates the specified CatalogObject. Replaces the whole object: any field left out of the request is cleared, nested variations included. Requires idempotency_key; pass the same key to retry safely. |
| `channels.bulkGet` | `square.api.channels.bulkGet` | `read` | BulkRetrieveChannels. Beta in Square's API; it may change. |
| `channels.get` | `square.api.channels.get` | `read` | RetrieveChannel. Beta in Square's API; it may change. |
| `channels.list` | `square.api.channels.list` | `read` | ListChannels. Beta in Square's API; it may change. |
| `checkout.getLocationSettings` | `square.api.checkout.getLocationSettings` | `read` | Retrieves the location-level settings for a Square-hosted checkout page. Beta in Square's API; it may change. |
| `checkout.updateLocationSettings` | `square.api.checkout.updateLocationSettings` | `write` | Updates the location-level settings for a Square-hosted checkout page. Beta in Square's API; it may change. |
| `customAttributeDefinitions.customer.create` | `square.api.customAttributeDefinitions.customer.create` | `write` | Creates a customer-related custom attribute definition for a Square seller account. Use this endpoint to define a custom attribute that can be associated with customer profiles. Pass the same idempotency_key to retry safely. |
| `customAttributeDefinitions.customer.delete` | `square.api.customAttributeDefinitions.customer.delete` | `destructive` | Deletes a customer-related custom attribute definition from a Square seller account. Cannot be undone. |
| `customAttributeDefinitions.customer.get` | `square.api.customAttributeDefinitions.customer.get` | `read` | Retrieves a customer-related custom attribute definition from a Square seller account. |
| `customAttributeDefinitions.customer.list` | `square.api.customAttributeDefinitions.customer.list` | `read` | Lists the customer-related custom attribute definitions that belong to a Square seller account. |
| `customAttributeDefinitions.customer.update` | `square.api.customAttributeDefinitions.customer.update` | `write` | Updates a customer-related custom attribute definition for a Square seller account. Pass the same idempotency_key to retry safely. |
| `customAttributeDefinitions.location.create` | `square.api.customAttributeDefinitions.location.create` | `write` | Creates a location-related custom attribute definition for a Square seller account. Use this endpoint to define a custom attribute that can be associated with locations. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change. |
| `customAttributeDefinitions.location.delete` | `square.api.customAttributeDefinitions.location.delete` | `destructive` | Deletes a location-related custom attribute definition from a Square seller account. Deleting a custom attribute definition also deletes the corresponding custom attribute from all locations. Cannot be undone. Beta in Square's API; it may change. |
| `customAttributeDefinitions.location.get` | `square.api.customAttributeDefinitions.location.get` | `read` | Retrieves a location-related custom attribute definition from a Square seller account. Beta in Square's API; it may change. |
| `customAttributeDefinitions.location.list` | `square.api.customAttributeDefinitions.location.list` | `read` | Lists the location-related custom attribute definitions that belong to a Square seller account. Beta in Square's API; it may change. |
| `customAttributeDefinitions.location.update` | `square.api.customAttributeDefinitions.location.update` | `write` | Updates a location-related custom attribute definition for a Square seller account. Use this endpoint to update the following fields: `name`, `description`, `visibility`, or the `schema` for a `Selection` data type. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change. |
| `customAttributeDefinitions.merchant.create` | `square.api.customAttributeDefinitions.merchant.create` | `write` | Creates a merchant-related custom attribute definition for a Square seller account. Use this endpoint to define a custom attribute that can be associated with a merchant connecting to your application. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change. |
| `customAttributeDefinitions.merchant.delete` | `square.api.customAttributeDefinitions.merchant.delete` | `destructive` | Deletes a merchant-related custom attribute definition from a Square seller account. Deleting a custom attribute definition also deletes the corresponding custom attribute from the merchant. Cannot be undone. Beta in Square's API; it may change. |
| `customAttributeDefinitions.merchant.get` | `square.api.customAttributeDefinitions.merchant.get` | `read` | Retrieves a merchant-related custom attribute definition from a Square seller account. Beta in Square's API; it may change. |
| `customAttributeDefinitions.merchant.list` | `square.api.customAttributeDefinitions.merchant.list` | `read` | Lists the merchant-related custom attribute definitions that belong to a Square seller account. Beta in Square's API; it may change. |
| `customAttributeDefinitions.merchant.update` | `square.api.customAttributeDefinitions.merchant.update` | `write` | Updates a merchant-related custom attribute definition for a Square seller account. Use this endpoint to update the following fields: `name`, `description`, `visibility`, or the `schema` for a `Selection` data type. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change. |
| `customAttributes.customer.bulkUpsert` | `square.api.customAttributes.customer.bulkUpsert` | `write` | Creates or updates custom attributes for customer profiles as a bulk operation. |
| `customAttributes.customer.delete` | `square.api.customAttributes.customer.delete` | `destructive` | Deletes a custom attribute associated with a customer profile. Cannot be undone. |
| `customAttributes.customer.get` | `square.api.customAttributes.customer.get` | `read` | Retrieves a custom attribute associated with a customer profile. |
| `customAttributes.customer.list` | `square.api.customAttributes.customer.list` | `read` | Lists the custom attributes associated with a customer profile. |
| `customAttributes.customer.upsert` | `square.api.customAttributes.customer.upsert` | `write` | Creates or updates a custom attribute for a customer profile. Pass the same idempotency_key to retry safely. |
| `customAttributes.location.bulkDelete` | `square.api.customAttributes.location.bulkDelete` | `destructive` | Deletes custom attributes for locations as a bulk operation. To delete a custom attribute owned by another application, the `visibility` setting must be `VISIBILITY_READ_WRITE_VALUES`. Cannot be undone. Beta in Square's API; it may change. |
| `customAttributes.location.bulkUpsert` | `square.api.customAttributes.location.bulkUpsert` | `write` | Creates or updates custom attributes for locations as a bulk operation. Use this endpoint to set the value of one or more custom attributes for one or more locations. Beta in Square's API; it may change. |
| `customAttributes.location.delete` | `square.api.customAttributes.location.delete` | `destructive` | Deletes a custom attribute associated with a location. To delete a custom attribute owned by another application, the `visibility` setting must be `VISIBILITY_READ_WRITE_VALUES`. Cannot be undone. Beta in Square's API; it may change. |
| `customAttributes.location.get` | `square.api.customAttributes.location.get` | `read` | Retrieves a custom attribute associated with a location. You can use the `with_definition` query parameter to also retrieve the custom attribute definition in the same call. Beta in Square's API; it may change. |
| `customAttributes.location.list` | `square.api.customAttributes.location.list` | `read` | Lists the custom attributes associated with a location. You can use the `with_definitions` query parameter to also retrieve custom attribute definitions in the same call. Beta in Square's API; it may change. |
| `customAttributes.location.upsert` | `square.api.customAttributes.location.upsert` | `write` | Creates or updates a custom attribute for a location. Use this endpoint to set the value of a custom attribute for a specified location. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change. |
| `customAttributes.merchant.bulkDelete` | `square.api.customAttributes.merchant.bulkDelete` | `destructive` | Deletes custom attributes for a merchant as a bulk operation. To delete a custom attribute owned by another application, the `visibility` setting must be `VISIBILITY_READ_WRITE_VALUES`. Cannot be undone. Beta in Square's API; it may change. |
| `customAttributes.merchant.bulkUpsert` | `square.api.customAttributes.merchant.bulkUpsert` | `write` | Creates or updates custom attributes for a merchant as a bulk operation. Use this endpoint to set the value of one or more custom attributes for a merchant. Beta in Square's API; it may change. |
| `customAttributes.merchant.delete` | `square.api.customAttributes.merchant.delete` | `destructive` | Deletes a custom attribute associated with a merchant. To delete a custom attribute owned by another application, the `visibility` setting must be `VISIBILITY_READ_WRITE_VALUES`. Cannot be undone. Beta in Square's API; it may change. |
| `customAttributes.merchant.get` | `square.api.customAttributes.merchant.get` | `read` | Retrieves a custom attribute associated with a merchant. You can use the `with_definition` query parameter to also retrieve the custom attribute definition in the same call. Beta in Square's API; it may change. |
| `customAttributes.merchant.list` | `square.api.customAttributes.merchant.list` | `read` | Lists the custom attributes associated with a merchant. You can use the `with_definitions` query parameter to also retrieve custom attribute definitions in the same call. Beta in Square's API; it may change. |
| `customAttributes.merchant.upsert` | `square.api.customAttributes.merchant.upsert` | `write` | Creates or updates a custom attribute for a merchant. Use this endpoint to set the value of a custom attribute for a specified merchant. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change. |
| `customerGroups.create` | `square.api.customerGroups.create` | `write` | Creates a new customer group for a business. Pass the same idempotency_key to retry safely. |
| `customerGroups.delete` | `square.api.customerGroups.delete` | `destructive` | Deletes a customer group as identified by the `group_id` value. Cannot be undone. |
| `customerGroups.get` | `square.api.customerGroups.get` | `read` | Retrieves a specific customer group as identified by the `group_id` value. |
| `customerGroups.list` | `square.api.customerGroups.list` | `read` | Retrieves the list of customer groups of a business. |
| `customerGroups.update` | `square.api.customerGroups.update` | `write` | Updates a customer group as identified by the `group_id` value. |
| `customers.addGroup` | `square.api.customers.addGroup` | `write` | Adds a group membership to a customer. |
| `customers.bulkCreate` | `square.api.customers.bulkCreate` | `write` | Creates multiple customer profiles for a business. |
| `customers.bulkDelete` | `square.api.customers.bulkDelete` | `destructive` | Deletes multiple customer profiles. Cannot be undone. |
| `customers.bulkGet` | `square.api.customers.bulkGet` | `read` | Retrieves multiple customer profiles. |
| `customers.bulkUpdate` | `square.api.customers.bulkUpdate` | `write` | Updates multiple customer profiles. |
| `customers.create` | `square.api.customers.create` | `write` | Creates a new customer for a business. Pass the same idempotency_key to retry safely. |
| `customers.delete` | `square.api.customers.delete` | `destructive` | Deletes a customer profile from a business. Cannot be undone. |
| `customers.get` | `square.api.customers.get` | `read` | Returns details for a single customer. |
| `customers.list` | `square.api.customers.list` | `read` | Lists customer profiles associated with a Square account. |
| `customers.removeGroup` | `square.api.customers.removeGroup` | `write` | Removes a group membership from a customer. |
| `customers.search` | `square.api.customers.search` | `read` | Searches the customer profiles associated with a Square account using one or more supported query filters. |
| `customers.update` | `square.api.customers.update` | `write` | Updates a customer profile. This endpoint supports sparse updates, so only new or changed fields are required in the request. To add or update a field, specify the new value. To remove a field, specify `null`. |
| `customerSegments.get` | `square.api.customerSegments.get` | `read` | Retrieves a specific customer segment as identified by the `segment_id` value. |
| `customerSegments.list` | `square.api.customerSegments.list` | `read` | Retrieves the list of customer segments of a business. |
| `disputes.accept` | `square.api.disputes.accept` | `destructive` | Accepts the loss on a dispute. Square returns the disputed amount to the cardholder and updates the dispute state to ACCEPTED. Moves money. Square takes no idempotency_key here; disputes.get shows whether the dispute is already accepted before you repeat the call. Cannot be undone. |
| `disputes.createEvidenceFile` | `square.api.disputes.createEvidenceFile` | `write` | Uploads a file to use as evidence in a dispute challenge. The endpoint accepts HTTP multipart/form-data file uploads in HEIC, HEIF, JPEG, PDF, PNG, and TIFF formats. |
| `disputes.createEvidenceText` | `square.api.disputes.createEvidenceText` | `write` | Uploads text to use as evidence for a dispute challenge. Requires idempotency_key; pass the same key to retry safely. |
| `disputes.deleteEvidence` | `square.api.disputes.deleteEvidence` | `destructive` | Removes specified evidence from a dispute. Square does not send the bank any evidence that is removed. Cannot be undone. |
| `disputes.get` | `square.api.disputes.get` | `read` | Returns details about a specific dispute. |
| `disputes.getEvidence` | `square.api.disputes.getEvidence` | `read` | Returns the metadata for the evidence specified in the request URL path. |
| `disputes.list` | `square.api.disputes.list` | `read` | Returns a list of disputes associated with a particular account. |
| `disputes.listEvidence` | `square.api.disputes.listEvidence` | `read` | Returns a list of evidence associated with a dispute. |
| `disputes.submitEvidence` | `square.api.disputes.submitEvidence` | `destructive` | Submits evidence to the cardholder's bank. Cannot be undone. |
| `inventory.batchGet` | `square.api.inventory.batchGet` | `read` | Returns current counts for the provided CatalogObjects at the requested Locations. |
| `inventory.get` | `square.api.inventory.get` | `read` | Retrieves the current calculated stock count for a given CatalogObject at a given set of Locations. Responses are paginated and unsorted. For more sophisticated queries, use a batch endpoint. |
| `invoices.cancel` | `square.api.invoices.cancel` | `destructive` | Cancels an invoice. The seller cannot collect payments for the canceled invoice. Cannot be undone. |
| `invoices.create` | `square.api.invoices.create` | `write` | Creates a draft invoice for an order created using the Orders API. Pass the same idempotency_key to retry safely. |
| `invoices.createAttachment` | `square.api.invoices.createAttachment` | `write` | Uploads a file and attaches it to an invoice. This endpoint accepts HTTP multipart/form-data file uploads with a JSON `request` part and a `file` part. |
| `invoices.delete` | `square.api.invoices.delete` | `destructive` | Deletes the specified invoice. When an invoice is deleted, the associated order status changes to CANCELED. Cannot be undone. |
| `invoices.deleteAttachment` | `square.api.invoices.deleteAttachment` | `destructive` | Removes an attachment from an invoice and permanently deletes the file. Attachments can be removed only from invoices in the `DRAFT`, `SCHEDULED`, `UNPAID`, or `PARTIALLY_PAID` state. Cannot be undone. |
| `invoices.get` | `square.api.invoices.get` | `read` | Retrieves an invoice by invoice ID. |
| `invoices.list` | `square.api.invoices.list` | `read` | Returns a list of invoices for a given location. The response is paginated. If truncated, the response includes a `cursor` that you use in a subsequent request to retrieve the next set of invoices. |
| `invoices.publish` | `square.api.invoices.publish` | `write` | Publishes the specified draft invoice. Sends the invoice to the customer and may charge the card on file; cancel with invoices.cancel. Moves money. Pass the same idempotency_key to retry safely. |
| `invoices.search` | `square.api.invoices.search` | `read` | Searches for invoices from a location specified in the filter. You can optionally specify customers in the filter for whom to retrieve invoices. |
| `invoices.update` | `square.api.invoices.update` | `write` | Updates an invoice. This endpoint supports sparse updates, so you only need to specify the fields you want to change along with the required `version` field. Some restrictions apply to updating invoices. Pass the same idempotency_key to retry safely. |
| `locations.create` | `square.api.locations.create` | `write` | Creates a location. Creating new locations allows for separate configuration of receipt layouts, item prices, and sales reports. Locations can't be deleted; deactivate with locations.update. |
| `locations.get` | `square.api.locations.get` | `read` | Retrieves details of a single location. Specify "main" as the location ID to retrieve details of the main location. |
| `locations.list` | `square.api.locations.list` | `read` | Provides details about all of the seller's locations, including those with an inactive status. Locations are listed alphabetically by `name`. |
| `locations.update` | `square.api.locations.update` | `write` | Updates a location. |
| `merchants.get` | `square.api.merchants.get` | `read` | Retrieves the `Merchant` object for the given `merchant_id`. |
| `merchants.list` | `square.api.merchants.list` | `read` | Provides details about the merchant associated with a given access token. |
| `oauth.getTokenStatus` | `square.api.oauth.getTokenStatus` | `read` | Returns information about an OAuth access token or an application’s personal access token. |
| `orders.calculate` | `square.api.orders.calculate` | `read` | Enables applications to preview order pricing without creating an order. Beta in Square's API; it may change. |
| `orders.create` | `square.api.orders.create` | `write` | Creates a new order that can include information about products for purchase and settings to apply to the purchase. Pass the same idempotency_key to retry safely. |
| `orders.get` | `square.api.orders.get` | `read` | Retrieves an Order by ID. |
| `orders.pay` | `square.api.orders.pay` | `write` | Pay for an order using one or more approved payments or settle an order with a total of `0`. Approved payments for the same order_id that are not listed in payment_ids are canceled. Moves money. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change. |
| `orders.search` | `square.api.orders.search` | `read` | Search all orders for one or more locations. Orders include all sales, returns, and exchanges regardless of how or when they entered the Square ecosystem (such as Point of Sale, Invoices, and Connect APIs). |
| `orders.update` | `square.api.orders.update` | `write` | Updates an open order by adding, replacing, or deleting fields. Orders with a `COMPLETED` or `CANCELED` state cannot be updated. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change. |
| `paymentLinks.create` | `square.api.paymentLinks.create` | `write` | Creates a Square-hosted checkout page. Applications can share the resulting payment link with their buyer to pay for goods and services. Pass the same idempotency_key to retry safely. |
| `paymentLinks.delete` | `square.api.paymentLinks.delete` | `destructive` | Deletes a payment link. Cannot be undone. |
| `paymentLinks.get` | `square.api.paymentLinks.get` | `read` | Retrieves a payment link. |
| `paymentLinks.list` | `square.api.paymentLinks.list` | `read` | Lists all payment links. |
| `paymentLinks.update` | `square.api.paymentLinks.update` | `write` | Updates a payment link. You can update the `payment_link` fields such as `description`, `checkout_options`, and `pre_populated_data`. |
| `payments.cancel` | `square.api.payments.cancel` | `destructive` | Cancels (voids) a payment. You can use this endpoint to cancel a payment with the APPROVED `status`. Moves money. Square takes no idempotency_key here; payments.get shows whether the payment is already canceled before you repeat the call. Cannot be undone. |
| `payments.cancelByIdempotencyKey` | `square.api.payments.cancelByIdempotencyKey` | `destructive` | Voids a payment by the idempotency_key of the payments.create call that made it; use when that call's response was lost. Moves money. Its idempotency_key names the payment to cancel; it does not make this call repeatable. Cannot be undone. |
| `payments.complete` | `square.api.payments.complete` | `write` | Completes (captures) a payment. By default, payments are set to complete immediately after they are created. Moves money. Square takes no idempotency_key here; payments.get shows whether the payment is already completed before you repeat the call. |
| `payments.create` | `square.api.payments.create` | `write` | Creates a payment using the provided source. Moves money. Pass the same idempotency_key to retry safely. |
| `payments.get` | `square.api.payments.get` | `read` | Retrieves details for a specific payment. |
| `payments.list` | `square.api.payments.list` | `read` | Retrieves a list of payments taken by the account making the request. |
| `payments.refund` | `square.api.payments.refund` | `destructive` | Refunds a payment. You can refund the entire payment amount or a portion of it. You can use this endpoint to refund a card payment or record a refund of a cash or external payment. Moves money. Pass the same idempotency_key to retry safely. Cannot be undone. |
| `payments.update` | `square.api.payments.update` | `write` | Updates a payment with the APPROVED status. You can update the `amount_money` and `tip_money` using this endpoint. Moves money. Pass the same idempotency_key to retry safely. |
| `refunds.get` | `square.api.refunds.get` | `read` | Retrieves a specific refund using the `refund_id`. |
| `refunds.list` | `square.api.refunds.list` | `read` | Retrieves a list of refunds for the account making the request. |
| `webhookEventTypes.list` | `square.api.webhookEventTypes.list` | `read` | Lists all webhook event types that can be subscribed to. |
| `webhookSubscriptions.create` | `square.api.webhookSubscriptions.create` | `write` | Creates a webhook subscription. Pass the same idempotency_key to retry safely. |
| `webhookSubscriptions.delete` | `square.api.webhookSubscriptions.delete` | `destructive` | Deletes a webhook subscription. Cannot be undone. |
| `webhookSubscriptions.get` | `square.api.webhookSubscriptions.get` | `read` | Retrieves a webhook subscription identified by its ID. |
| `webhookSubscriptions.list` | `square.api.webhookSubscriptions.list` | `read` | Lists all webhook subscriptions owned by your application. |
| `webhookSubscriptions.test` | `square.api.webhookSubscriptions.test` | `write` | Tests a webhook subscription by sending a test event to the notification URL. |
| `webhookSubscriptions.update` | `square.api.webhookSubscriptions.update` | `write` | Updates a webhook subscription. |
| `webhookSubscriptions.updateSignatureKey` | `square.api.webhookSubscriptions.updateSignatureKey` | `write` | Updates a webhook subscription by replacing the existing signature key with a new one. The old signature key stops verifying as soon as the new one is issued. Pass the same idempotency_key to retry safely. |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/square

## License

Apache-2.0
