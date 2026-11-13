import { z } from 'zod';

// ── Shared shapes ─────────────────────────────────────────────────────────
//
// Every field name below was read from the 2026-10 GraphQL reference rather
// than a prose example. The examples in Shopify's docs are wrong often enough
// to matter: the Customer page still shows `email` and `phone`, neither of
// which exists on the 2026-10 Customer object.

export const MoneySchema = z
	.object({
		amount: z.string(),
		currencyCode: z.string(),
	})
	.loose();

export const MoneyBagSchema = z
	.object({
		shopMoney: MoneySchema,
		presentmentMoney: MoneySchema.nullish(),
	})
	.loose();

export const PageInfoSchema = z
	.object({
		hasNextPage: z.boolean(),
		hasPreviousPage: z.boolean().nullish(),
		endCursor: z.string().nullish(),
		startCursor: z.string().nullish(),
	})
	.loose();

/** GraphQL connections are `{ edges: [{ node, cursor }], pageInfo }`. */
function connection<T extends z.ZodType>(node: T) {
	return z
		.object({
			edges: z.array(z.object({ node, cursor: z.string().nullish() }).loose()),
			pageInfo: PageInfoSchema,
		})
		.loose();
}

/**
 * Every mutation answers `userErrors`. Shopify reports a rejected write there
 * with HTTP 200 and no top-level error, so a caller that ignores this array is
 * told the write succeeded. Parsed in `runMutation`, which throws on a non-empty
 * array rather than letting an empty result through.
 */
export const UserErrorSchema = z
	.object({
		field: z.array(z.string()).nullish(),
		message: z.string(),
	})
	.loose();

export const ShopSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		myshopifyDomain: z.string(),
		currencyCode: z.string(),
		ianaTimezone: z.string().nullish(),
		email: z.string().nullish(),
		description: z.string().nullish(),
		plan: z.object({ displayName: z.string().nullish() }).loose().nullish(),
	})
	.loose();

export const ProductSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		handle: z.string(),
		status: z.string(),
		vendor: z.string(),
		productType: z.string(),
		tags: z.array(z.string()),
		createdAt: z.string(),
		updatedAt: z.string(),
		publishedAt: z.string().nullish(),
		descriptionHtml: z.string().nullish(),
		totalInventory: z.number().nullish(),
		onlineStoreUrl: z.string().nullish(),
		variants: connection(
			z
				.object({
					id: z.string(),
					title: z.string(),
					sku: z.string().nullish(),
					price: z.string().nullish(),
					compareAtPrice: z.string().nullish(),
					inventoryQuantity: z.number().nullish(),
				})
				.loose(),
		).nullish(),
	})
	.loose();

export const CollectionSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		handle: z.string(),
		descriptionHtml: z.string().nullish(),
		updatedAt: z.string(),
		sortOrder: z.string().nullish(),
		productsCount: z.object({ count: z.number() }).loose().nullish(),
	})
	.loose();

export const LineItemSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		quantity: z.number().nullish(),
		sku: z.string().nullish(),
		variant: z.object({ id: z.string() }).loose().nullish(),
		originalUnitPriceSet: MoneyBagSchema.nullish(),
	})
	.loose();

export const OrderSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		createdAt: z.string(),
		updatedAt: z.string().nullish(),
		processedAt: z.string().nullish(),
		cancelledAt: z.string().nullish(),
		closedAt: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		note: z.string().nullish(),
		tags: z.array(z.string()),
		currencyCode: z.string(),
		displayFinancialStatus: z.string().nullish(),
		displayFulfillmentStatus: z.string(),
		cancelReason: z.string().nullish(),
		totalPriceSet: MoneyBagSchema,
		totalTaxSet: MoneyBagSchema.nullish(),
		subtotalPriceSet: MoneyBagSchema.nullish(),
		totalDiscountsSet: MoneyBagSchema.nullish(),
		customer: z
			.object({
				id: z.string(),
				// No `displayName`: see the note in the order fragment. Shopify
				// returns `data: null` for it without PII access.
				defaultEmailAddress: z
					.object({ emailAddress: z.string() })
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		lineItems: connection(LineItemSchema).nullish(),
	})
	.loose();

export const CustomerSchema = z
	.object({
		id: z.string(),
		// No `displayName`: asking for it on the Customer object returns
		// `data: null` when the plan cannot read customer PII, losing the page.
		// First and last name are nulled field-by-field instead.
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		state: z.string(),
		note: z.string().nullish(),
		tags: z.array(z.string()),
		createdAt: z.string(),
		updatedAt: z.string(),
		numberOfOrders: z.string(),
		taxExempt: z.boolean().nullish(),
		verifiedEmail: z.boolean().nullish(),
		// `email` is gone from Customer in 2026-10; the address lives here.
		defaultEmailAddress: z
			.object({
				emailAddress: z.string(),
				marketingState: z.string().nullish(),
			})
			.loose()
			.nullish(),
		defaultPhoneNumber: z.object({ phoneNumber: z.string() }).loose().nullish(),
		amountSpent: MoneySchema.nullish(),
	})
	.loose();

export const LocationAddressSchema = z
	.object({
		address1: z.string().nullish(),
		city: z.string().nullish(),
		province: z.string().nullish(),
		countryCode: z.string().nullish(),
		zip: z.string().nullish(),
	})
	.loose();

export const LocationSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		isActive: z.boolean(),
		// Non-null on every location, but its members are null for a location
		// with no street address.
		address: LocationAddressSchema,
	})
	.loose();

export const InventoryLevelSchema = z
	.object({
		id: z.string(),
		isActive: z.boolean(),
		updatedAt: z.string().nullish(),
		item: z.object({ id: z.string(), sku: z.string().nullish() }).loose(),
		location: z.object({ id: z.string(), name: z.string() }).loose(),
		quantities: z.array(
			z.object({ name: z.string(), quantity: z.number() }).loose(),
		),
	})
	.loose();

export const WebhookSubscriptionSchema = z
	.object({
		id: z.string(),
		topic: z.string(),
		uri: z.string(),
		format: z.string(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

// ── Pagination ────────────────────────────────────────────────────────────
//
// Shopify caps a connection page. The documented maximum for these
// connections is 250, and a caller asking for more is rejected, so the schema
// stops it before the request is sent.
export const MAX_PAGE_SIZE = 250;
export const DEFAULT_PAGE_SIZE = 50;

export const PageArgsSchema = z.object({
	first: z
		.number()
		.int()
		.min(1)
		.max(MAX_PAGE_SIZE)
		.optional()
		.describe(
			`Page size. Defaults to ${DEFAULT_PAGE_SIZE}; the maximum is ${MAX_PAGE_SIZE}.`,
		),
	after: z.string().optional().describe('Cursor from a previous page.'),
});

// ── Products ──────────────────────────────────────────────────────────────

export const ProductStatusSchema = z.enum([
	'ACTIVE',
	'ARCHIVED',
	'DRAFT',
	'UNLISTED',
]);

export const PRODUCT_SORTS = [
	'CREATED_AT',
	'ID',
	'INVENTORY_TOTAL',
	'PRODUCT_TYPE',
	'PUBLISHED_AT',
	'RELEVANCE',
	'TITLE',
	'UPDATED_AT',
	'VENDOR',
] as const;

export const productsListInput = PageArgsSchema.extend({
	query: z
		.string()
		.optional()
		.describe('Shopify search syntax, e.g. "status:active" or "title:boots".'),
	sortKey: z.enum(PRODUCT_SORTS).optional(),
	reverse: z.boolean().optional().describe('Reverse the sort order.'),
});

export const productsGetInput = z.object({
	id: z.string().min(1).describe('Product GID, e.g. gid://shopify/Product/1.'),
});

export const productsCreateInput = z.object({
	title: z.string().min(1),
	descriptionHtml: z.string().optional(),
	vendor: z.string().optional(),
	productType: z.string().optional(),
	handle: z.string().optional(),
	tags: z.array(z.string()).optional(),
	status: ProductStatusSchema.optional(),
});

export const productsUpdateInput = productsCreateInput.partial().extend({
	id: z.string().min(1),
});

export const productsDeleteInput = z.object({
	id: z.string().min(1),
	/**
	 * Product delete is asynchronous by default in Shopify's docs. A caller that
	 * leaves this true gets `deletedProductId` back and no operation to poll,
	 * which is the synchronous behaviour this plugin promises.
	 */
	synchronous: z
		.boolean()
		.optional()
		.describe('Delete synchronously. Defaults to true.'),
});

export const productsListOutput = z.object({
	products: connection(ProductSchema),
});
export const productsGetOutput = z.object({ product: ProductSchema.nullish() });
export const productsCreateOutput = z.object({ product: ProductSchema });
export const productsUpdateOutput = z.object({ product: ProductSchema });
export const productsDeleteOutput = z.object({
	deletedProductId: z.string().nullish(),
	// Present when the delete ran asynchronously: a polling handle. Null or
	// absent for a synchronous delete, which returns the id directly.
	productDeleteOperation: z
		.object({
			id: z.string(),
			status: z.string(),
			deletedProductId: z.string().nullish(),
		})
		.loose()
		.nullish(),
});

// ── Variants ──────────────────────────────────────────────────────────────

export const variantsListInput = PageArgsSchema.extend({
	query: z.string().optional().describe('Shopify search syntax.'),
	productId: z.string().min(1).describe('Product GID to list variants for.'),
});

export const variantsUpdateInput = z.object({
	productId: z.string().min(1),
	id: z.string().min(1).describe('Product variant GID.'),
	price: z.string().optional().describe('Decimal string, e.g. "19.99".'),
	compareAtPrice: z.string().optional(),
	sku: z
		.string()
		.optional()
		.describe(
			'SKU for this variant. Sent as inventoryItem.sku, which is where the API stores it.',
		),
	barcode: z
		.string()
		.optional()
		.describe(
			'Barcode value; sent in the barcodes list, not the deprecated barcode field.',
		),
	barcodeType: z
		.enum(['UPC', 'EAN', 'ISBN', 'GTIN', 'ASIN', 'NS_PID'])
		.optional()
		.describe('Barcode standard. Defaults to UPC when barcode is set.'),
	inventoryPolicy: z.enum(['DENY', 'CONTINUE']).optional(),
});

export const variantsListOutput = z.object({
	productVariants: connection(
		z
			.object({
				id: z.string(),
				title: z.string(),
				sku: z.string().nullish(),
				price: z.string().nullish(),
				compareAtPrice: z.string().nullish(),
				inventoryQuantity: z.number().nullish(),
				inventoryItem: z.object({ id: z.string() }).loose().nullish(),
			})
			.loose(),
	),
});

export const variantsUpdateOutput = z.object({
	productVariants: z.array(
		z.object({ id: z.string(), price: z.string().nullish() }).loose(),
	),
});

// ── Inventory ─────────────────────────────────────────────────────────────

export const inventoryListInput = PageArgsSchema.extend({
	inventoryItemId: z.string().min(1).describe('InventoryItem GID.'),
	first: z
		.number()
		.int()
		.min(1)
		.max(MAX_PAGE_SIZE)
		.optional()
		.describe(
			`Locations per page. Defaults to ${DEFAULT_PAGE_SIZE}; the maximum is ${MAX_PAGE_SIZE}.`,
		),
});

export const inventoryAdjustInput = z.object({
	inventoryItemId: z.string().min(1),
	locationId: z.string().min(1),
	delta: z
		.number()
		.int()
		.describe('Signed change: positive adds stock, negative removes it.'),
	reason: z
		.string()
		.min(1)
		.describe('Inventory change reason, e.g. "correction" or "received".'),
	changeFromQuantity: z
		.number()
		.int()
		.nullish()
		.describe(
			'Expected quantity before the change. Set it to turn the write into a compare-and-swap, which fails when the current quantity differs. Omit it to skip that check.',
		),
	idempotencyKey: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Key that makes this adjustment safe to repeat. Generated per call when omitted; supply your own to make a retry of the same logical adjustment reuse it.',
		),
});

export const inventoryListOutput = z.object({
	inventoryItem: z
		.object({
			id: z.string(),
			sku: z.string().nullish(),
			tracked: z.boolean(),
			inventoryLevels: connection(InventoryLevelSchema),
		})
		.loose()
		.nullish(),
});

export const inventoryAdjustOutput = z.object({
	inventoryAdjustmentGroup: z
		.object({
			createdAt: z.string().nullish(),
			reason: z.string().nullish(),
			changes: z
				.array(z.object({ name: z.string(), delta: z.number() }).loose())
				.nullish(),
		})
		.loose()
		.nullish(),
});

// ── Collections ───────────────────────────────────────────────────────────

export const collectionsListInput = PageArgsSchema.extend({
	query: z.string().optional(),
});

export const collectionsGetInput = z.object({ id: z.string().min(1) });

export const collectionsCreateInput = z.object({
	title: z.string().min(1),
	descriptionHtml: z.string().optional(),
	handle: z.string().optional(),
});

export const collectionsAddProductsInput = z.object({
	id: z.string().min(1).describe('Collection GID.'),
	productIds: z.array(z.string().min(1)).min(1),
});

export const collectionsListOutput = z.object({
	collections: connection(CollectionSchema),
});
export const collectionsGetOutput = z.object({
	collection: CollectionSchema.nullish(),
});
export const collectionsCreateOutput = z.object({
	collection: CollectionSchema,
});
export const collectionsAddProductsOutput = z.object({
	collection: CollectionSchema,
});

// ── Orders ────────────────────────────────────────────────────────────────

export const ORDER_SORTS = [
	'CREATED_AT',
	'CURRENT_TOTAL_PRICE',
	'CUSTOMER_NAME',
	'DESTINATION',
	'FINANCIAL_STATUS',
	'FULFILLMENT_STATUS',
	'ID',
	'ORDER_NUMBER',
	'PO_NUMBER',
	'PROCESSED_AT',
	'RELEVANCE',
	'TOTAL_ITEMS_QUANTITY',
	'TOTAL_PRICE',
	'UPDATED_AT',
] as const;

export const ordersListInput = PageArgsSchema.extend({
	query: z
		.string()
		.optional()
		.describe('Shopify search syntax, e.g. "financial_status:paid".'),
	sortKey: z.enum(ORDER_SORTS).optional(),
	reverse: z.boolean().optional(),
});

export const ordersGetInput = z.object({
	id: z.string().min(1),
	lineItemsFirst: z
		.number()
		.int()
		.min(1)
		.max(MAX_PAGE_SIZE)
		.optional()
		.describe(
			`Line items per page. Defaults to 20; the maximum is ${MAX_PAGE_SIZE}.`,
		),
	lineItemsAfter: z
		.string()
		.optional()
		.describe('Line-item cursor from a previous page.'),
});

export const ordersListLineItemsInput = z.object({
	id: z.string().min(1).describe('Order GID.'),
	first: z
		.number()
		.int()
		.min(1)
		.max(MAX_PAGE_SIZE)
		.optional()
		.describe(
			`Line items per page. Defaults to ${DEFAULT_PAGE_SIZE}; the maximum is ${MAX_PAGE_SIZE}.`,
		),
	after: z.string().optional().describe('Cursor from a previous page.'),
});

export const ordersCancelInput = z.object({
	id: z.string().min(1),
	reason: z
		.enum(['CUSTOMER', 'DECLINED', 'FRAUD', 'INVENTORY', 'OTHER', 'STAFF'])
		.optional(),
	restock: z.boolean().optional().describe('Restock the order items.'),
	notifyCustomer: z
		.boolean()
		.optional()
		.describe('Email the customer about the cancellation.'),
});

export const ordersMarkAsPaidInput = z.object({ id: z.string().min(1) });

export const ordersCloseInput = z.object({ id: z.string().min(1) });

export const ordersListOutput = z.object({ orders: connection(OrderSchema) });
export const ordersGetOutput = z.object({ order: OrderSchema.nullish() });
export const ordersListLineItemsOutput = z.object({
	lineItems: connection(LineItemSchema),
});
export const ordersCancelOutput = z.object({ order: OrderSchema });
export const ordersMarkAsPaidOutput = z.object({ order: OrderSchema });
export const ordersCloseOutput = z.object({ order: OrderSchema });

// ── Customers ─────────────────────────────────────────────────────────────

export const customersListInput = PageArgsSchema.extend({
	query: z.string().optional(),
});

export const customersGetInput = z.object({ id: z.string().min(1) });

export const customersCreateInput = z.object({
	email: z.string().email().optional(),
	phone: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	note: z.string().optional(),
	tags: z.array(z.string()).optional(),
	taxExempt: z.boolean().optional(),
});

export const customersUpdateInput = customersCreateInput.partial().extend({
	id: z.string().min(1),
});

export const customersListOutput = z.object({
	customers: connection(CustomerSchema),
});
export const customersGetOutput = z.object({
	customer: CustomerSchema.nullish(),
});
export const customersCreateOutput = z.object({ customer: CustomerSchema });
export const customersUpdateOutput = z.object({ customer: CustomerSchema });

// ── Shop and locations ────────────────────────────────────────────────────

export const shopGetInput = z.object({});

export const locationsListInput = PageArgsSchema;

export const shopGetOutput = z.object({ shop: ShopSchema });
export const locationsListOutput = z.object({
	locations: connection(LocationSchema),
});

// ── Webhook subscriptions ─────────────────────────────────────────────────

export const webhooksListInput = PageArgsSchema.extend({
	topic: z.string().optional().describe('Filter by topic, e.g. ORDERS_CREATE.'),
});

export const webhooksCreateInput = z.object({
	topic: z.string().min(1).describe('Topic, e.g. ORDERS_CREATE.'),
	uri: z.string().url().describe('HTTPS endpoint Shopify delivers to.'),
});

export const webhooksDeleteInput = z.object({
	id: z.string().min(1).describe('WebhookSubscription GID.'),
});

export const webhooksListOutput = z.object({
	webhookSubscriptions: connection(WebhookSubscriptionSchema),
});
export const webhooksCreateOutput = z.object({
	webhookSubscription: WebhookSubscriptionSchema,
});
export const webhooksDeleteOutput = z.object({
	deletedWebhookSubscriptionId: z.string().nullish(),
});
