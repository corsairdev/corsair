# @corsair-dev/cloudcart

CloudCart plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cloudcart
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `products.createProduct` | `cloudcart.api.products.createProduct` | `write` | Create product |
| `products.getProduct` | `cloudcart.api.products.getProduct` | `read` | Get product |
| `products.getProductWithRelations` | `cloudcart.api.products.getProductWithRelations` | `read` | Get product with relations |
| `products.listProducts` | `cloudcart.api.products.listProducts` | `read` | List products |
| `products.updateProduct` | `cloudcart.api.products.updateProduct` | `write` | Update product |
| `products.deleteProduct` | `cloudcart.api.products.deleteProduct` | `destructive` | Delete product |
| `products.createLinkedProducts` | `cloudcart.api.products.createLinkedProducts` | `write` | Create linked products |
| `products.getProductsLinkedProduct` | `cloudcart.api.products.getProductsLinkedProduct` | `read` | Get product linked product |
| `products.getProductsLinkedProducts` | `cloudcart.api.products.getProductsLinkedProducts` | `read` | Get products linked products |
| `products.updateLinkedProduct` | `cloudcart.api.products.updateLinkedProduct` | `write` | Update linked product |
| `products.deleteLinkedProducts` | `cloudcart.api.products.deleteLinkedProducts` | `destructive` | Delete linked products |
| `products.createImage` | `cloudcart.api.products.createImage` | `write` | Create image |
| `products.getImage` | `cloudcart.api.products.getImage` | `read` | Get image |
| `products.listImages` | `cloudcart.api.products.listImages` | `read` | List images |
| `products.deleteImage` | `cloudcart.api.products.deleteImage` | `destructive` | Delete image |
| `categories.createCategory` | `cloudcart.api.categories.createCategory` | `write` | Create category |
| `categories.getCategory` | `cloudcart.api.categories.getCategory` | `read` | Get category |
| `categories.listCategories` | `cloudcart.api.categories.listCategories` | `read` | List categories |
| `categories.updateCategory` | `cloudcart.api.categories.updateCategory` | `write` | Update category |
| `categories.deleteCategory` | `cloudcart.api.categories.deleteCategory` | `destructive` | Delete category |
| `categories.getCategoryProperties` | `cloudcart.api.categories.getCategoryProperties` | `read` | Get category properties |
| `categories.addCategoryProperties` | `cloudcart.api.categories.addCategoryProperties` | `write` | Add category properties |
| `properties.createProperty` | `cloudcart.api.properties.createProperty` | `write` | Create property |
| `properties.getProperty` | `cloudcart.api.properties.getProperty` | `read` | Get property |
| `properties.listProperties` | `cloudcart.api.properties.listProperties` | `read` | List properties |
| `properties.updateProperty` | `cloudcart.api.properties.updateProperty` | `write` | Update property |
| `properties.deleteProperty` | `cloudcart.api.properties.deleteProperty` | `destructive` | Delete property |
| `properties.createPropertyOption` | `cloudcart.api.properties.createPropertyOption` | `write` | Create property option |
| `properties.getPropertyOption` | `cloudcart.api.properties.getPropertyOption` | `read` | Get property option |
| `properties.listPropertyOptions` | `cloudcart.api.properties.listPropertyOptions` | `read` | List property options |
| `properties.updatePropertyOption` | `cloudcart.api.properties.updatePropertyOption` | `write` | Update property option |
| `properties.deletePropertyOption` | `cloudcart.api.properties.deletePropertyOption` | `destructive` | Delete property option |
| `properties.createProductsPropertyOptions` | `cloudcart.api.properties.createProductsPropertyOptions` | `write` | Create product property options |
| `properties.getPropertyOptionsRelationship` | `cloudcart.api.properties.getPropertyOptionsRelationship` | `read` | Get property options relationship |
| `variants.createVariant` | `cloudcart.api.variants.createVariant` | `write` | Create variant |
| `variants.getVariant` | `cloudcart.api.variants.getVariant` | `read` | Get variant |
| `variants.listVariants` | `cloudcart.api.variants.listVariants` | `read` | List variants |
| `variants.updateVariant` | `cloudcart.api.variants.updateVariant` | `write` | Update variant |
| `variants.deleteVariant` | `cloudcart.api.variants.deleteVariant` | `destructive` | Delete variant |
| `variants.createVariantOption` | `cloudcart.api.variants.createVariantOption` | `write` | Create variant option |
| `variants.createVariantOptions` | `cloudcart.api.variants.createVariantOptions` | `write` | Create variant options |
| `variants.getVariantOption` | `cloudcart.api.variants.getVariantOption` | `read` | Get variant option |
| `variants.listVariantOptions` | `cloudcart.api.variants.listVariantOptions` | `read` | List variant options |
| `variants.updateVariantOption` | `cloudcart.api.variants.updateVariantOption` | `write` | Update variant option |
| `variants.deleteVariantOption` | `cloudcart.api.variants.deleteVariantOption` | `destructive` | Delete variant option |
| `variants.createVariantParameter` | `cloudcart.api.variants.createVariantParameter` | `write` | Create variant parameter |
| `variants.createVariantParameterForVariant` | `cloudcart.api.variants.createVariantParameterForVariant` | `write` | Create variant parameter for variant |
| `variants.getVariantParameter` | `cloudcart.api.variants.getVariantParameter` | `read` | Get variant parameter |
| `variants.listVariantParameters` | `cloudcart.api.variants.listVariantParameters` | `read` | List variant parameters |
| `variants.updateVariantParameter` | `cloudcart.api.variants.updateVariantParameter` | `write` | Update variant parameter |
| `variants.deleteVariantParameter` | `cloudcart.api.variants.deleteVariantParameter` | `destructive` | Delete variant parameter |
| `customers.createCustomer` | `cloudcart.api.customers.createCustomer` | `write` | Create customer |
| `customers.getCustomer` | `cloudcart.api.customers.getCustomer` | `read` | Get customer |
| `customers.listCustomers` | `cloudcart.api.customers.listCustomers` | `read` | List customers |
| `customers.updateCustomer` | `cloudcart.api.customers.updateCustomer` | `write` | Update customer |
| `customers.deleteCustomer` | `cloudcart.api.customers.deleteCustomer` | `destructive` | Delete customer |
| `customers.createCustomerGroup` | `cloudcart.api.customers.createCustomerGroup` | `write` | Create customer group |
| `customers.getCustomerGroup` | `cloudcart.api.customers.getCustomerGroup` | `read` | Get customer group |
| `customers.listCustomerGroups` | `cloudcart.api.customers.listCustomerGroups` | `read` | List customer groups |
| `customers.getCustomerGroupsCustomers` | `cloudcart.api.customers.getCustomerGroupsCustomers` | `read` | Get customer groups customers |
| `customers.updateCustomerGroup` | `cloudcart.api.customers.updateCustomerGroup` | `write` | Update customer group |
| `customers.deleteCustomerGroup` | `cloudcart.api.customers.deleteCustomerGroup` | `destructive` | Delete customer group |
| `customers.createCustomerBillingAddress` | `cloudcart.api.customers.createCustomerBillingAddress` | `write` | Create customer billing address |
| `customers.getCustomerBillingAddress` | `cloudcart.api.customers.getCustomerBillingAddress` | `read` | Get customer billing address |
| `customers.listCustomerBillingAddresses` | `cloudcart.api.customers.listCustomerBillingAddresses` | `read` | List customer billing addresses |
| `customers.updateCustomerBillingAddress` | `cloudcart.api.customers.updateCustomerBillingAddress` | `write` | Update customer billing address |
| `customers.deleteCustomerBillingAddress` | `cloudcart.api.customers.deleteCustomerBillingAddress` | `destructive` | Delete customer billing address |
| `customers.createCustomerShippingAddress` | `cloudcart.api.customers.createCustomerShippingAddress` | `write` | Create customer shipping address |
| `customers.getCustomerShippingAddress` | `cloudcart.api.customers.getCustomerShippingAddress` | `read` | Get customer shipping address |
| `customers.listCustomerShippingAddresses` | `cloudcart.api.customers.listCustomerShippingAddresses` | `read` | List customer shipping addresses |
| `customers.updateCustomerShippingAddress` | `cloudcart.api.customers.updateCustomerShippingAddress` | `write` | Update customer shipping address |
| `customers.deleteCustomerShippingAddress` | `cloudcart.api.customers.deleteCustomerShippingAddress` | `destructive` | Delete customer shipping address |
| `customers.createCustomerTag` | `cloudcart.api.customers.createCustomerTag` | `write` | Create customer tag |
| `customers.getCustomerTag` | `cloudcart.api.customers.getCustomerTag` | `read` | Get customer tag |
| `customers.listCustomerTags` | `cloudcart.api.customers.listCustomerTags` | `read` | List customer tags |
| `customers.updateCustomerTag` | `cloudcart.api.customers.updateCustomerTag` | `write` | Update customer tag |
| `customers.deleteCustomerTag` | `cloudcart.api.customers.deleteCustomerTag` | `destructive` | Delete customer tag |
| `orders.createOrder` | `cloudcart.api.orders.createOrder` | `write` | Create order |
| `orders.getOrder` | `cloudcart.api.orders.getOrder` | `read` | Get order |
| `orders.listOrders` | `cloudcart.api.orders.listOrders` | `read` | List orders |
| `orders.updateOrder` | `cloudcart.api.orders.updateOrder` | `write` | Update order |
| `orders.deleteOrder` | `cloudcart.api.orders.deleteOrder` | `destructive` | Delete order |
| `orders.listOrderBillingAddresses` | `cloudcart.api.orders.listOrderBillingAddresses` | `read` | List order billing addresses |
| `orders.listOrderShippingAddresses` | `cloudcart.api.orders.listOrderShippingAddresses` | `read` | List order shipping addresses |
| `orders.listOrderProducts` | `cloudcart.api.orders.listOrderProducts` | `read` | List order products |
| `orders.listOrderProductsOptions` | `cloudcart.api.orders.listOrderProductsOptions` | `read` | List order products options |
| `orders.listOrderPayments` | `cloudcart.api.orders.listOrderPayments` | `read` | List order payments |
| `orders.listOrderShipping` | `cloudcart.api.orders.listOrderShipping` | `read` | List order shipping |
| `orders.listOrderStatus` | `cloudcart.api.orders.listOrderStatus` | `read` | List order statuses |
| `discounts.createDiscount` | `cloudcart.api.discounts.createDiscount` | `write` | Create discount |
| `discounts.deleteDiscount` | `cloudcart.api.discounts.deleteDiscount` | `destructive` | Delete discount |
| `discounts.createDiscountCode` | `cloudcart.api.discounts.createDiscountCode` | `write` | Create discount code |
| `discounts.listDiscountCodes` | `cloudcart.api.discounts.listDiscountCodes` | `read` | List discount codes |
| `discounts.updateDiscountCode` | `cloudcart.api.discounts.updateDiscountCode` | `write` | Update discount code |
| `discounts.deleteDiscountCode` | `cloudcart.api.discounts.deleteDiscountCode` | `destructive` | Delete discount code |
| `discounts.generateDiscountCodes` | `cloudcart.api.discounts.generateDiscountCodes` | `write` | Generate discount codes |
| `discounts.createProductToDiscount` | `cloudcart.api.discounts.createProductToDiscount` | `write` | Create product to discount |
| `discounts.deleteProductToDiscount` | `cloudcart.api.discounts.deleteProductToDiscount` | `destructive` | Delete product to discount |
| `subscribers.createSubscriber` | `cloudcart.api.subscribers.createSubscriber` | `write` | Create subscriber |
| `subscribers.getSubscriber` | `cloudcart.api.subscribers.getSubscriber` | `read` | Get subscriber |
| `subscribers.listSubscribers` | `cloudcart.api.subscribers.listSubscribers` | `read` | List subscribers |
| `subscribers.updateSubscriber` | `cloudcart.api.subscribers.updateSubscriber` | `write` | Update subscriber |
| `subscribers.deleteSubscriber` | `cloudcart.api.subscribers.deleteSubscriber` | `destructive` | Delete subscriber |
| `subscribers.createSubscriberChannel` | `cloudcart.api.subscribers.createSubscriberChannel` | `write` | Create subscriber channel |
| `subscribers.getSubscribersChannel` | `cloudcart.api.subscribers.getSubscribersChannel` | `read` | Get subscriber channel |
| `subscribers.listSubscribersChannels` | `cloudcart.api.subscribers.listSubscribersChannels` | `read` | List subscriber channels |
| `subscribers.updateSubscribersChannel` | `cloudcart.api.subscribers.updateSubscribersChannel` | `write` | Update subscriber channel |
| `subscribers.deleteSubscribersChannel` | `cloudcart.api.subscribers.deleteSubscribersChannel` | `destructive` | Delete subscriber channel |
| `subscribers.createSubscriberTag` | `cloudcart.api.subscribers.createSubscriberTag` | `write` | Create subscriber tag |
| `subscribers.getSubscriberTag` | `cloudcart.api.subscribers.getSubscriberTag` | `read` | Get subscriber tag |
| `subscribers.listSubscribersTags` | `cloudcart.api.subscribers.listSubscribersTags` | `read` | List subscriber tags |
| `subscribers.updateSubscriberTag` | `cloudcart.api.subscribers.updateSubscriberTag` | `write` | Update subscriber tag |
| `subscribers.deleteSubscriberTag` | `cloudcart.api.subscribers.deleteSubscriberTag` | `destructive` | Delete subscriber tag |
| `blogs.createBlogPost` | `cloudcart.api.blogs.createBlogPost` | `write` | Create blog post |
| `blogs.getBlogPost` | `cloudcart.api.blogs.getBlogPost` | `read` | Get blog post |
| `blogs.listBlogPosts` | `cloudcart.api.blogs.listBlogPosts` | `read` | List blog posts |
| `blogs.updateBlogPost` | `cloudcart.api.blogs.updateBlogPost` | `write` | Update blog post |
| `blogs.deleteBlogPost` | `cloudcart.api.blogs.deleteBlogPost` | `destructive` | Delete blog post |
| `blogs.createBlogCategory` | `cloudcart.api.blogs.createBlogCategory` | `write` | Create blog category |
| `blogs.getBlogCategory` | `cloudcart.api.blogs.getBlogCategory` | `read` | Get blog category |
| `blogs.listBlogCategories` | `cloudcart.api.blogs.listBlogCategories` | `read` | List blog categories |
| `blogs.updateBlogCategory` | `cloudcart.api.blogs.updateBlogCategory` | `write` | Update blog category |
| `blogs.deleteBlogCategory` | `cloudcart.api.blogs.deleteBlogCategory` | `destructive` | Delete blog category |
| `blogs.createBlogTag` | `cloudcart.api.blogs.createBlogTag` | `write` | Create blog tag |
| `blogs.getBlogTag` | `cloudcart.api.blogs.getBlogTag` | `read` | Get blog tag |
| `blogs.listBlogTags` | `cloudcart.api.blogs.listBlogTags` | `read` | List blog tags |
| `blogs.updateBlogTag` | `cloudcart.api.blogs.updateBlogTag` | `write` | Update blog tag |
| `blogs.deleteBlogTag` | `cloudcart.api.blogs.deleteBlogTag` | `destructive` | Delete blog tag |
| `blogs.getBlogAuthor` | `cloudcart.api.blogs.getBlogAuthor` | `read` | Get blog author |
| `misc.createVendor` | `cloudcart.api.misc.createVendor` | `write` | Create vendor |
| `misc.getVendor` | `cloudcart.api.misc.getVendor` | `read` | Get vendor |
| `misc.listVendors` | `cloudcart.api.misc.listVendors` | `read` | List vendors |
| `misc.updateVendor` | `cloudcart.api.misc.updateVendor` | `write` | Update vendor |
| `misc.deleteVendor` | `cloudcart.api.misc.deleteVendor` | `destructive` | Delete vendor |
| `misc.createRedirect` | `cloudcart.api.misc.createRedirect` | `write` | Create redirect |
| `misc.listRedirects` | `cloudcart.api.misc.listRedirects` | `read` | List redirects |
| `misc.deleteRedirect` | `cloudcart.api.misc.deleteRedirect` | `destructive` | Delete redirect |
| `misc.getPaymentMethods` | `cloudcart.api.misc.getPaymentMethods` | `read` | Get payment methods |
| `misc.listPaymentProviders` | `cloudcart.api.misc.listPaymentProviders` | `read` | List payment providers |
| `misc.getShippingMethods` | `cloudcart.api.misc.getShippingMethods` | `read` | Get shipping methods |
| `misc.listShippingProviders` | `cloudcart.api.misc.listShippingProviders` | `read` | List shipping providers |
| `webhooks.createWebhook` | `cloudcart.api.webhooks.createWebhook` | `write` | Create webhook |
| `webhooks.getWebhook` | `cloudcart.api.webhooks.getWebhook` | `read` | Get webhook |
| `webhooks.listWebhooks` | `cloudcart.api.webhooks.listWebhooks` | `read` | List webhooks |
| `webhooks.updateWebhook` | `cloudcart.api.webhooks.updateWebhook` | `write` | Update webhook |
| `webhooks.deleteWebhook` | `cloudcart.api.webhooks.deleteWebhook` | `destructive` | Delete webhook |
| `carts.addToCart` | `cloudcart.api.carts.addToCart` | `write` | Add to cart |
| `carts.getCart` | `cloudcart.api.carts.getCart` | `read` | Get cart |
| `carts.updateCartItem` | `cloudcart.api.carts.updateCartItem` | `write` | Update cart item |
| `carts.removeFromCart` | `cloudcart.api.carts.removeFromCart` | `destructive` | Remove from cart |
| `carts.clearCart` | `cloudcart.api.carts.clearCart` | `destructive` | Clear cart |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Webhooks supported:
- `order.created`: Triggered when an order is created.
- `product.created`: Triggered when a product is created.
- `customer.created`: Triggered when a customer is created.

Event payloads are the CloudCart store objects themselves. Deliveries are
unsigned (CloudCart publishes no webhook signature scheme), so configure one
webhook URL per action in the store admin.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cloudcart

## License

Apache-2.0
