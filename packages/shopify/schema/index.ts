/**
 * No tables. Shopify is the system of record for products, orders and
 * customers, and this plugin reads them live rather than mirroring them. A
 * local copy would go stale between webhook deliveries, and the webhook
 * handler does not write because a delivery can arrive for a tenant with no
 * row for that resource.
 */
export const ShopifySchema = {
	version: '1.0.0',
	entities: {},
} as const;
