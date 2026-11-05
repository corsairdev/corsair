# @corsair-dev/booqable

Booqable plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/booqable
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.createCustomer` | `booqable.api.customers.createCustomer` | `write` | Create a new customer in Booqable. |
| `customers.deleteCustomer` | `booqable.api.customers.deleteCustomer` | `destructive` | Delete (archive) a customer by ID. |
| `customers.getCustomer` | `booqable.api.customers.getCustomer` | `read` | Fetch a specific customer by ID. |
| `customers.getCustomers` | `booqable.api.customers.getCustomers` | `read` | Retrieve a paginated list of customers. |
| `customers.searchCustomers` | `booqable.api.customers.searchCustomers` | `read` | Search customers with advanced filtering. |
| `orders.createOrder` | `booqable.api.orders.createOrder` | `write` | Create a new order. |
| `orders.deleteOrder` | `booqable.api.orders.deleteOrder` | `destructive` | Delete (archive) an order by ID. |
| `orders.getNewOrder` | `booqable.api.orders.getNewOrder` | `read` | Retrieve a new order template with default values. |
| `orders.getOrder` | `booqable.api.orders.getOrder` | `read` | Retrieve a specific order by ID. |
| `orders.listOrders` | `booqable.api.orders.listOrders` | `read` | Retrieve a paginated list of orders. |
| `orders.searchOrders` | `booqable.api.orders.searchOrders` | `read` | Search orders with advanced filtering. |
| `productGroups.createProductGroup` | `booqable.api.productGroups.createProductGroup` | `write` | Create a new product group. |
| `productGroups.deleteProductGroup` | `booqable.api.productGroups.deleteProductGroup` | `destructive` | Delete a product group by ID. |
| `productGroups.getProductGroup` | `booqable.api.productGroups.getProductGroup` | `read` | Fetch a specific product group by ID. |
| `productGroups.listProductGroups` | `booqable.api.productGroups.listProductGroups` | `read` | List product groups with filtering and pagination. |
| `products.getProduct` | `booqable.api.products.getProduct` | `read` | Fetch a specific product by ID. |
| `products.listProducts` | `booqable.api.products.listProducts` | `read` | Retrieve a paginated list of products. |
| `companies.updateCompany` | `booqable.api.companies.updateCompany` | `write` | Update the current company information. |
| `inventoryLevels.getInventoryLevels` | `booqable.api.inventoryLevels.getInventoryLevels` | `read` | Fetch inventory levels for products across locations. |
| `barcodes.listBarcodes` | `booqable.api.barcodes.listBarcodes` | `read` | Retrieve a list of barcodes. |
| `bundleItems.listBundleItems` | `booqable.api.bundleItems.listBundleItems` | `read` | Retrieve a list of bundle items. |
| `bundles.searchBundles` | `booqable.api.bundles.searchBundles` | `read` | Search bundles with advanced filtering. |
| `clusters.listClusters` | `booqable.api.clusters.listClusters` | `read` | Retrieve a list of clusters. |
| `coupons.listCoupons` | `booqable.api.coupons.listCoupons` | `read` | Retrieve a list of coupons. |
| `defaultProperties.listDefaultProperties` | `booqable.api.defaultProperties.listDefaultProperties` | `read` | Retrieve default property definitions. |
| `documents.listDocuments` | `booqable.api.documents.listDocuments` | `read` | Retrieve a list of documents. |
| `documents.searchDocuments` | `booqable.api.documents.searchDocuments` | `read` | Search documents with advanced filtering. |
| `emailTemplates.listEmailTemplates` | `booqable.api.emailTemplates.listEmailTemplates` | `read` | List email templates. |
| `employees.listEmployees` | `booqable.api.employees.listEmployees` | `read` | Retrieve a list of employees. |
| `inventoryBreakdowns.listInventoryBreakdowns` | `booqable.api.inventoryBreakdowns.listInventoryBreakdowns` | `read` | Retrieve inventory breakdowns by status and product. |
| `items.listItems` | `booqable.api.items.listItems` | `read` | Retrieve a list of items (products and product groups). |
| `items.searchItems` | `booqable.api.items.searchItems` | `read` | Search items with advanced filtering. |
| `lines.listLines` | `booqable.api.lines.listLines` | `read` | Retrieve a paginated list of order lines. |
| `locations.listLocations` | `booqable.api.locations.listLocations` | `read` | Retrieve a list of locations. |
| `notes.listNotes` | `booqable.api.notes.listNotes` | `read` | Retrieve a list of notes. |
| `paymentMethods.listPaymentMethods` | `booqable.api.paymentMethods.listPaymentMethods` | `read` | Retrieve a list of payment methods. |
| `payments.listPayments` | `booqable.api.payments.listPayments` | `read` | List all payments. |
| `photos.listPhotos` | `booqable.api.photos.listPhotos` | `read` | Retrieve a paginated list of photos. |
| `plannings.listPlannings` | `booqable.api.plannings.listPlannings` | `read` | Retrieve planning records for reservations. |
| `plannings.searchPlannings` | `booqable.api.plannings.searchPlannings` | `read` | Search plannings with advanced filtering. |
| `priceRulesets.listPriceRulesets` | `booqable.api.priceRulesets.listPriceRulesets` | `read` | List price rulesets. |
| `priceStructures.listPriceStructures` | `booqable.api.priceStructures.listPriceStructures` | `read` | List price structures. |
| `properties.listProperties` | `booqable.api.properties.listProperties` | `read` | Retrieve a list of custom properties. |
| `provinces.listProvinces` | `booqable.api.provinces.listProvinces` | `read` | Retrieve a list of provinces. |
| `stockItemPlannings.listStockItemPlannings` | `booqable.api.stockItemPlannings.listStockItemPlannings` | `read` | Retrieve stock item plannings. |
| `stockItems.listStockItems` | `booqable.api.stockItems.listStockItems` | `read` | Retrieve a list of stock items. |
| `taxRates.listTaxRates` | `booqable.api.taxRates.listTaxRates` | `read` | Retrieve a list of tax rates. |
| `taxValues.listTaxValues` | `booqable.api.taxValues.listTaxValues` | `read` | Retrieve a list of tax values. |
| `users.listUsers` | `booqable.api.users.listUsers` | `read` | Retrieve a list of users. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/booqable

## License

Apache-2.0
