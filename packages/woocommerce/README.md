# @corsair-dev/woocommerce

WooCommerce integration for Corsair: WooCommerce stores (REST API v3): products with variations, attributes, categories, tags, brands, reviews and shipping classes, orders with notes, refunds, receipts and customer emails, customers and their downloads, coupons, tax rates and classes, shipping zones, locations and methods, payment gateways, store settings, sales and top-seller reports, system status and tools, countries and currencies, batch updates, and signed webhooks for orders, products, customers and coupons (155 operations).

## Install

```bash
pnpm add @corsair-dev/woocommerce
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `coupons.batch` | `woocommerce.api.coupons.batch` | `destructive` | Create, update and delete up to 100 coupons in one call |
| `coupons.create` | `woocommerce.api.coupons.create` | `write` | Create a coupon |
| `coupons.delete` | `woocommerce.api.coupons.delete` | `destructive` | Delete a coupon; without force true it goes to the trash |
| `coupons.get` | `woocommerce.api.coupons.get` | `read` | Get one coupon |
| `coupons.list` | `woocommerce.api.coupons.list` | `read` | List coupons, one page at a time, with search and filters |
| `coupons.update` | `woocommerce.api.coupons.update` | `write` | Update a coupon: only the fields you pass change |
| `customers.batch` | `woocommerce.api.customers.batch` | `destructive` | Create, update and delete up to 100 customers in one call |
| `customers.create` | `woocommerce.api.customers.create` | `write` | Create a customer |
| `customers.delete` | `woocommerce.api.customers.delete` | `destructive` | Delete a customer (WooCommerce needs force true) |
| `customers.downloads` | `woocommerce.api.customers.downloads` | `read` | List the downloadable files a customer has access to |
| `customers.get` | `woocommerce.api.customers.get` | `read` | Get one customer |
| `customers.list` | `woocommerce.api.customers.list` | `read` | List customers, one page at a time, with search and filters |
| `customers.update` | `woocommerce.api.customers.update` | `write` | Update a customer: only the fields you pass change |
| `data.continents.get` | `woocommerce.api.data.continents.get` | `read` | Get one continent |
| `data.continents.list` | `woocommerce.api.data.continents.list` | `read` | List continents |
| `data.countries.get` | `woocommerce.api.data.countries.get` | `read` | Get one country |
| `data.countries.list` | `woocommerce.api.data.countries.list` | `read` | List countries |
| `data.currencies.current` | `woocommerce.api.data.currencies.current` | `read` | Get the store's currency |
| `data.currencies.get` | `woocommerce.api.data.currencies.get` | `read` | Get one currency |
| `data.currencies.list` | `woocommerce.api.data.currencies.list` | `read` | List currencies |
| `data.index` | `woocommerce.api.data.index` | `read` | List the reference data routes (continents, countries, currencies) |
| `orders.batch` | `woocommerce.api.orders.batch` | `destructive` | Create, update and delete up to 100 orders in one call |
| `orders.create` | `woocommerce.api.orders.create` | `write` | Create an order with line items, billing and shipping addresses, shipping lines, fees, coupons and a status (no payment is taken; set_paid marks it paid) |
| `orders.delete` | `woocommerce.api.orders.delete` | `destructive` | Delete an order; without force true it goes to the trash |
| `orders.emailTemplates` | `woocommerce.api.orders.emailTemplates` | `read` | List the emails that can be sent for an order |
| `orders.get` | `woocommerce.api.orders.get` | `read` | Get one order |
| `orders.list` | `woocommerce.api.orders.list` | `read` | List orders, one page at a time, with search and filters |
| `orders.notes.create` | `woocommerce.api.orders.notes.create` | `write` | Create a order note for a order |
| `orders.notes.delete` | `woocommerce.api.orders.notes.delete` | `destructive` | Delete a order note (WooCommerce needs force true) |
| `orders.notes.get` | `woocommerce.api.orders.notes.get` | `read` | Get one order note |
| `orders.notes.list` | `woocommerce.api.orders.notes.list` | `read` | List the order notes of a order |
| `orders.receipt.create` | `woocommerce.api.orders.receipt.create` | `write` | Generate the receipt of an order |
| `orders.receipt.get` | `woocommerce.api.orders.receipt.get` | `read` | Get the receipt of an order (a link to the rendered receipt) |
| `orders.refunds.create` | `woocommerce.api.orders.refunds.create` | `destructive` | Refund an order, in full or by line item; with api_refund true (the default) the payment gateway sends the money back |
| `orders.refunds.delete` | `woocommerce.api.orders.refunds.delete` | `destructive` | Delete a refund (WooCommerce needs force true) |
| `orders.refunds.get` | `woocommerce.api.orders.refunds.get` | `read` | Get one refund |
| `orders.refunds.list` | `woocommerce.api.orders.refunds.list` | `read` | List the refunds of a order, one page at a time, with search and filters |
| `orders.refunds.preview` | `woocommerce.api.orders.refunds.preview` | `read` | Work out a refund (amounts, taxes, line items) without creating it |
| `orders.sendEmail` | `woocommerce.api.orders.sendEmail` | `destructive` | Send one of the order emails (an invoice, a status email) to the customer or another address |
| `orders.sendOrderDetails` | `woocommerce.api.orders.sendOrderDetails` | `destructive` | Email the order details (invoice) to the customer |
| `orders.statuses` | `woocommerce.api.orders.statuses` | `read` | List the order statuses the store uses, core and custom |
| `orders.update` | `woocommerce.api.orders.update` | `write` | Update an order: status (processing, completed, cancelled ...), addresses, line items, notes and meta; only the fields you pass change |
| `paymentGateways.get` | `woocommerce.api.paymentGateways.get` | `read` | Get one payment gateway |
| `paymentGateways.list` | `woocommerce.api.paymentGateways.list` | `read` | List payment gateways |
| `paymentGateways.update` | `woocommerce.api.paymentGateways.update` | `destructive` | Enable, disable or reconfigure a payment gateway (title, description, settings) |
| `products.attributes.batch` | `woocommerce.api.products.attributes.batch` | `destructive` | Create, update and delete up to 100 product attributes in one call |
| `products.attributes.create` | `woocommerce.api.products.attributes.create` | `write` | Create a product attribute for a product |
| `products.attributes.delete` | `woocommerce.api.products.attributes.delete` | `destructive` | Delete a product attribute (WooCommerce needs force true) |
| `products.attributes.get` | `woocommerce.api.products.attributes.get` | `read` | Get one product attribute |
| `products.attributes.list` | `woocommerce.api.products.attributes.list` | `read` | List the product attributes of a product |
| `products.attributes.terms.batch` | `woocommerce.api.products.attributes.terms.batch` | `destructive` | Create, update and delete up to 100 attribute terms in one call |
| `products.attributes.terms.create` | `woocommerce.api.products.attributes.terms.create` | `write` | Create a attribute term for a product attribute |
| `products.attributes.terms.delete` | `woocommerce.api.products.attributes.terms.delete` | `destructive` | Delete a attribute term (WooCommerce needs force true) |
| `products.attributes.terms.get` | `woocommerce.api.products.attributes.terms.get` | `read` | Get one attribute term |
| `products.attributes.terms.list` | `woocommerce.api.products.attributes.terms.list` | `read` | List the attribute terms of a product attribute, one page at a time, with search and filters |
| `products.attributes.terms.update` | `woocommerce.api.products.attributes.terms.update` | `write` | Update a attribute term: only the fields you pass change |
| `products.attributes.update` | `woocommerce.api.products.attributes.update` | `write` | Update a product attribute: only the fields you pass change |
| `products.batch` | `woocommerce.api.products.batch` | `destructive` | Create, update and delete up to 100 products in one call |
| `products.brands.batch` | `woocommerce.api.products.brands.batch` | `destructive` | Create, update and delete up to 100 brands in one call |
| `products.brands.create` | `woocommerce.api.products.brands.create` | `write` | Create a brand for a product |
| `products.brands.delete` | `woocommerce.api.products.brands.delete` | `destructive` | Delete a brand (WooCommerce needs force true) |
| `products.brands.get` | `woocommerce.api.products.brands.get` | `read` | Get one brand |
| `products.brands.list` | `woocommerce.api.products.brands.list` | `read` | List the brands of a product, one page at a time, with search and filters |
| `products.brands.update` | `woocommerce.api.products.brands.update` | `write` | Update a brand: only the fields you pass change |
| `products.categories.batch` | `woocommerce.api.products.categories.batch` | `destructive` | Create, update and delete up to 100 product categories in one call |
| `products.categories.create` | `woocommerce.api.products.categories.create` | `write` | Create a product category for a product |
| `products.categories.delete` | `woocommerce.api.products.categories.delete` | `destructive` | Delete a product category (WooCommerce needs force true) |
| `products.categories.get` | `woocommerce.api.products.categories.get` | `read` | Get one product category |
| `products.categories.list` | `woocommerce.api.products.categories.list` | `read` | List the product categories of a product, one page at a time, with search and filters |
| `products.categories.update` | `woocommerce.api.products.categories.update` | `write` | Update a product category: only the fields you pass change |
| `products.create` | `woocommerce.api.products.create` | `write` | Create a product |
| `products.customFieldNames` | `woocommerce.api.products.customFieldNames` | `read` | List the custom field (meta) names used on products, one page at a time |
| `products.delete` | `woocommerce.api.products.delete` | `destructive` | Delete a product; without force true it goes to the trash |
| `products.duplicate` | `woocommerce.api.products.duplicate` | `write` | Duplicate a product (as a draft copy) |
| `products.get` | `woocommerce.api.products.get` | `read` | Get one product |
| `products.list` | `woocommerce.api.products.list` | `read` | List products, one page at a time, with search and filters |
| `products.related` | `woocommerce.api.products.related` | `read` | List the ids of products related to a product |
| `products.reviews.batch` | `woocommerce.api.products.reviews.batch` | `destructive` | Create, update and delete up to 100 product reviews in one call |
| `products.reviews.create` | `woocommerce.api.products.reviews.create` | `write` | Create a product review for a product |
| `products.reviews.delete` | `woocommerce.api.products.reviews.delete` | `destructive` | Delete a product review; without force true it goes to the trash |
| `products.reviews.get` | `woocommerce.api.products.reviews.get` | `read` | Get one product review |
| `products.reviews.list` | `woocommerce.api.products.reviews.list` | `read` | List the product reviews of a product, one page at a time, with search and filters |
| `products.reviews.update` | `woocommerce.api.products.reviews.update` | `write` | Update a product review: only the fields you pass change |
| `products.shippingClasses.batch` | `woocommerce.api.products.shippingClasses.batch` | `destructive` | Create, update and delete up to 100 shipping classes in one call |
| `products.shippingClasses.create` | `woocommerce.api.products.shippingClasses.create` | `write` | Create a shipping class for a product |
| `products.shippingClasses.delete` | `woocommerce.api.products.shippingClasses.delete` | `destructive` | Delete a shipping class (WooCommerce needs force true) |
| `products.shippingClasses.get` | `woocommerce.api.products.shippingClasses.get` | `read` | Get one shipping class |
| `products.shippingClasses.list` | `woocommerce.api.products.shippingClasses.list` | `read` | List the shipping classes of a product, one page at a time, with search and filters |
| `products.shippingClasses.suggestSlug` | `woocommerce.api.products.shippingClasses.suggestSlug` | `read` | Suggest a unique slug for a new shipping class name |
| `products.shippingClasses.update` | `woocommerce.api.products.shippingClasses.update` | `write` | Update a shipping class: only the fields you pass change |
| `products.suggested` | `woocommerce.api.products.suggested` | `read` | List products suggested for a product by shared categories and tags |
| `products.tags.batch` | `woocommerce.api.products.tags.batch` | `destructive` | Create, update and delete up to 100 product tags in one call |
| `products.tags.create` | `woocommerce.api.products.tags.create` | `write` | Create a product tag for a product |
| `products.tags.delete` | `woocommerce.api.products.tags.delete` | `destructive` | Delete a product tag (WooCommerce needs force true) |
| `products.tags.get` | `woocommerce.api.products.tags.get` | `read` | Get one product tag |
| `products.tags.list` | `woocommerce.api.products.tags.list` | `read` | List the product tags of a product, one page at a time, with search and filters |
| `products.tags.update` | `woocommerce.api.products.tags.update` | `write` | Update a product tag: only the fields you pass change |
| `products.update` | `woocommerce.api.products.update` | `write` | Update a product: only the fields you pass change |
| `products.variations.batch` | `woocommerce.api.products.variations.batch` | `destructive` | Create, update and delete up to 100 variations in one call |
| `products.variations.create` | `woocommerce.api.products.variations.create` | `write` | Create a variation for a product |
| `products.variations.delete` | `woocommerce.api.products.variations.delete` | `destructive` | Delete a variation; without force true it goes to the trash |
| `products.variations.generate` | `woocommerce.api.products.variations.generate` | `write` | Create every missing variation from a variable product's attributes |
| `products.variations.get` | `woocommerce.api.products.variations.get` | `read` | Get one variation |
| `products.variations.list` | `woocommerce.api.products.variations.list` | `read` | List the variations of a product, one page at a time, with search and filters |
| `products.variations.update` | `woocommerce.api.products.variations.update` | `write` | Update a variation: only the fields you pass change |
| `refunds.list` | `woocommerce.api.refunds.list` | `read` | List refunds across all orders, one page at a time |
| `reports.couponTotals` | `woocommerce.api.reports.couponTotals` | `read` | Get coupon totals by type |
| `reports.customerTotals` | `woocommerce.api.reports.customerTotals` | `read` | Get customer totals (paying and non-paying) |
| `reports.list` | `woocommerce.api.reports.list` | `read` | List the available reports |
| `reports.orderTotals` | `woocommerce.api.reports.orderTotals` | `read` | Get order totals by status |
| `reports.productTotals` | `woocommerce.api.reports.productTotals` | `read` | Get product totals by type |
| `reports.reviewTotals` | `woocommerce.api.reports.reviewTotals` | `read` | Get review totals by rating |
| `reports.sales` | `woocommerce.api.reports.sales` | `read` | Get the sales report (gross and net sales, orders, items, tax, shipping, discounts) for a period or date range |
| `reports.topSellers` | `woocommerce.api.reports.topSellers` | `read` | Get the top-selling products for a period or date range |
| `settings.batch` | `woocommerce.api.settings.batch` | `destructive` | Update several settings of a group in one call |
| `settings.batchAll` | `woocommerce.api.settings.batchAll` | `destructive` | Update settings across groups in one call |
| `settings.get` | `woocommerce.api.settings.get` | `read` | Get one setting |
| `settings.groups` | `woocommerce.api.settings.groups` | `read` | List the settings groups (general, products, tax, shipping, checkout, account, email, advanced ...) |
| `settings.list` | `woocommerce.api.settings.list` | `read` | List every setting in a group with its value, type and options |
| `settings.update` | `woocommerce.api.settings.update` | `write` | Update one setting value |
| `shipping.zones.create` | `woocommerce.api.shipping.zones.create` | `write` | Create a shipping zone |
| `shipping.zones.delete` | `woocommerce.api.shipping.zones.delete` | `destructive` | Delete a shipping zone (WooCommerce needs force true) |
| `shipping.zones.get` | `woocommerce.api.shipping.zones.get` | `read` | Get one shipping zone |
| `shipping.zones.list` | `woocommerce.api.shipping.zones.list` | `read` | List shipping zones |
| `shipping.zones.locations.list` | `woocommerce.api.shipping.zones.locations.list` | `read` | List zone locations |
| `shipping.zones.locations.replace` | `woocommerce.api.shipping.zones.locations.replace` | `destructive` | Replace every location (country, state, postcode) of a shipping zone |
| `shipping.zones.methods.create` | `woocommerce.api.shipping.zones.methods.create` | `write` | Create a shipping method |
| `shipping.zones.methods.delete` | `woocommerce.api.shipping.zones.methods.delete` | `destructive` | Delete a shipping method (WooCommerce needs force true) |
| `shipping.zones.methods.get` | `woocommerce.api.shipping.zones.methods.get` | `read` | Get one shipping method |
| `shipping.zones.methods.list` | `woocommerce.api.shipping.zones.methods.list` | `read` | List shipping methods |
| `shipping.zones.methods.update` | `woocommerce.api.shipping.zones.methods.update` | `write` | Update a shipping method: only the fields you pass change |
| `shipping.zones.update` | `woocommerce.api.shipping.zones.update` | `write` | Update a shipping zone: only the fields you pass change |
| `shippingMethods.get` | `woocommerce.api.shippingMethods.get` | `read` | Get one shipping method type |
| `shippingMethods.list` | `woocommerce.api.shippingMethods.list` | `read` | List shipping method types |
| `systemStatus.get` | `woocommerce.api.systemStatus.get` | `read` | Get the system status report: environment, database, active plugins, theme, settings, pages and security |
| `systemStatus.tools.get` | `woocommerce.api.systemStatus.tools.get` | `read` | Get one system status tool |
| `systemStatus.tools.list` | `woocommerce.api.systemStatus.tools.list` | `read` | List system status tools |
| `systemStatus.tools.run` | `woocommerce.api.systemStatus.tools.run` | `destructive` | Run a system status tool (clear transients, regenerate product lookup tables, delete orphaned variations ...) |
| `taxes.batch` | `woocommerce.api.taxes.batch` | `destructive` | Create, update and delete up to 100 tax rates in one call |
| `taxes.classes.create` | `woocommerce.api.taxes.classes.create` | `write` | Create a tax class for a tax rate |
| `taxes.classes.delete` | `woocommerce.api.taxes.classes.delete` | `destructive` | Delete a tax class (WooCommerce needs force true) |
| `taxes.classes.get` | `woocommerce.api.taxes.classes.get` | `read` | Get one tax class |
| `taxes.classes.list` | `woocommerce.api.taxes.classes.list` | `read` | List the tax classes of a tax rate |
| `taxes.create` | `woocommerce.api.taxes.create` | `write` | Create a tax rate |
| `taxes.delete` | `woocommerce.api.taxes.delete` | `destructive` | Delete a tax rate (WooCommerce needs force true) |
| `taxes.get` | `woocommerce.api.taxes.get` | `read` | Get one tax rate |
| `taxes.list` | `woocommerce.api.taxes.list` | `read` | List tax rates, one page at a time |
| `taxes.update` | `woocommerce.api.taxes.update` | `write` | Update a tax rate: only the fields you pass change |
| `variations.list` | `woocommerce.api.variations.list` | `read` | List variations across all products, one page at a time, with search and filters |
| `webhooks.batch` | `woocommerce.api.webhooks.batch` | `destructive` | Create, update and delete up to 100 webhooks in one call |
| `webhooks.create` | `woocommerce.api.webhooks.create` | `write` | Create a webhook: a topic (order.created, product.updated, customer.deleted, coupon.restored or action.<hook>), a delivery URL and a secret. With a secret, the plugin's webhooks verify the deliveries |
| `webhooks.delete` | `woocommerce.api.webhooks.delete` | `destructive` | Delete a webhook (WooCommerce needs force true) |
| `webhooks.get` | `woocommerce.api.webhooks.get` | `read` | Get one webhook |
| `webhooks.list` | `woocommerce.api.webhooks.list` | `read` | List webhooks, one page at a time, with search and filters |
| `webhooks.update` | `woocommerce.api.webhooks.update` | `write` | Update a webhook: only the fields you pass change |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 5 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/woocommerce

## License

Apache-2.0
