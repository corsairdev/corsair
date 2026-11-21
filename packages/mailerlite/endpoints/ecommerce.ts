import { z } from 'zod';
import { defineMailerLiteOperation } from './operation';
import {
	MailerLiteCountResponseSchema,
	MailerLiteEntityResponseSchema,
	MailerLiteEntitySchema,
	MailerLiteIdSchema,
	MailerLiteListResponseSchema,
} from './types';

const Identifier = z.string().min(1);
const ListPage = z
	.object({
		limit: z.number().int().positive().max(1000).optional(),
		page: z.number().int().positive().optional(),
	})
	.strict();
const CartSort = z.enum(['id', 'created_at', '-id', '-created_at']);
const CategorySort = z.enum([
	'id',
	'name',
	'created_at',
	'-id',
	'-name',
	'-created_at',
]);
const CustomerSort = z.enum([
	'id',
	'email',
	'created_at',
	'-id',
	'-email',
	'-created_at',
]);
const ProductSort = z.enum([
	'id',
	'name',
	'created_at',
	'-id',
	'-name',
	'-created_at',
]);
const ResourceLookupQuery = z
	.object({ with_resource_id: z.literal(true).optional() })
	.strict();
const ResourceId = z.union([z.string().min(1), z.number().int().positive()]);

const ShopBody = z
	.object({
		name: z.string().min(1),
		url: z.string().url(),
		currency: z.string().length(3),
		platform: z.string().optional(),
		group_id: MailerLiteIdSchema.optional(),
		enable_popups: z.boolean().optional(),
		enabled: z.boolean().optional(),
		access_data: z.string().optional(),
	})
	.strict();

export const Shops = {
	list: defineMailerLiteOperation({
		operation: 'shops.list',
		input: z
			.object({
				query: z
					.object({
						limit: z.number().int().positive().optional(),
						page: z.number().int().positive().optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: '/ecommerce/shops',
			query: input.query,
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'shops.create',
		input: z.object({ body: ShopBody }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: '/ecommerce/shops',
			body: input.body,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'shops.get',
		input: z.object({ shopId: Identifier }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}`,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'shops.update',
		input: z.object({ shopId: Identifier, body: ShopBody }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}`,
			body: input.body,
		}),
	}),
	count: defineMailerLiteOperation({
		operation: 'shops.count',
		input: z.object({}).strict(),
		output: MailerLiteCountResponseSchema,
		request: () => ({
			method: 'GET',
			url: '/ecommerce/shops',
			query: { limit: 0 },
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'shops.delete',
		input: z.object({ shopId: Identifier }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}`,
		}),
	}),
	stats: defineMailerLiteOperation({
		operation: 'shops.stats',
		input: z
			.object({
				shopId: Identifier,
				query: z
					.object({ start_date: z.string(), end_date: z.string() })
					.strict(),
			})
			.strict(),
		output: z
			.object({
				data: z
					.object({
						ecommerce: z
							.object({
								orders_count: z.number(),
								revenue: z.number(),
								average_order_value: z.number(),
								conversion_rate: z.string(),
							})
							.strict(),
						series: z.array(z.object({ date: z.string() }).passthrough()),
					})
					.passthrough(),
			})
			.passthrough(),
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/reports/stats`,
			query: input.query,
		}),
	}),
};

export const EcommerceSettings = {
	get: defineMailerLiteOperation({
		operation: 'ecommerceSettings.get',
		input: z.object({}).strict(),
		output: z
			.object({
				data: z
					.object({
						ecommerce_tracking_in_campaigns: z.boolean(),
						ecommerce_tracking_in_automations: z.boolean(),
						ecommerce_attribution_window: z.number().int(),
					})
					.strict(),
			})
			.strict(),
		request: () => ({ method: 'GET', url: '/ecommerce/settings' }),
	}),
};

export const Carts = {
	list: defineMailerLiteOperation({
		operation: 'carts.list',
		input: z
			.object({
				shopId: Identifier,
				query: ListPage.extend({ sort: CartSort.optional() })
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/carts`,
			query: input.query,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'carts.get',
		input: z
			.object({
				shopId: Identifier,
				cartId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/carts/${encodeURIComponent(input.cartId)}`,
			query: input.query,
		}),
	}),
	count: defineMailerLiteOperation({
		operation: 'carts.count',
		input: z.object({ shopId: Identifier }).strict(),
		output: MailerLiteCountResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/carts`,
			query: { limit: 0 },
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'carts.update',
		input: z
			.object({
				shopId: Identifier,
				cartId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: z
					.object({
						checkout_url: z.string().url().optional(),
						cart_total: z.number().optional(),
						ecommerce_customer_id: ResourceId.optional(),
						resource_id: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/carts/${encodeURIComponent(input.cartId)}`,
			query: input.query,
			body: input.body,
		}),
	}),
};

const CartItemBody = z
	.object({
		ecommerce_product_id: ResourceId.optional(),
		product_resource_id: z.string().optional(),
		resource_id: z.string().optional(),
		ecommerce_product_variant_id: ResourceId.optional(),
		variant: z.string().optional(),
		quantity: z.number().int().positive().optional(),
		price: z.number().optional(),
	})
	.strict()
	.superRefine((item, ctx) => {
		if (
			item.ecommerce_product_id === undefined &&
			item.product_resource_id === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['ecommerce_product_id'],
				message: 'Provide ecommerce_product_id or product_resource_id.',
			});
		}
		if (
			item.ecommerce_product_id !== undefined &&
			item.product_resource_id !== undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['product_resource_id'],
				message: 'Use only one product identifier.',
			});
		}
	});

export const CartItems = {
	list: defineMailerLiteOperation({
		operation: 'cartItems.list',
		input: z
			.object({
				shopId: Identifier,
				cartId: Identifier,
				query: ListPage.extend({ sort: CartSort.optional() })
					.extend(ResourceLookupQuery.shape)
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/carts/${encodeURIComponent(input.cartId)}/items`,
			query: input.query,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'cartItems.get',
		input: z
			.object({
				shopId: Identifier,
				cartId: Identifier,
				itemId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/carts/${encodeURIComponent(input.cartId)}/items/${encodeURIComponent(input.itemId)}`,
			query: input.query,
		}),
	}),
	count: defineMailerLiteOperation({
		operation: 'cartItems.count',
		input: z
			.object({
				shopId: Identifier,
				cartId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteCountResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/carts/${encodeURIComponent(input.cartId)}/items`,
			query: { ...input.query, limit: 0 },
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'cartItems.create',
		input: z
			.object({
				shopId: Identifier,
				cartId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: CartItemBody,
			})
			.strict()
			.superRefine((value, ctx) => {
				if (
					value.body.product_resource_id !== undefined &&
					value.query?.with_resource_id !== true
				)
					ctx.addIssue({
						code: 'custom',
						path: ['query', 'with_resource_id'],
						message:
							'with_resource_id is required when product_resource_id is sent.',
					});
			}),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/carts/${encodeURIComponent(input.cartId)}/items`,
			query: input.query,
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'cartItems.update',
		input: z
			.object({
				shopId: Identifier,
				cartId: Identifier,
				itemId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: CartItemBody,
			})
			.strict()
			.superRefine((value, ctx) => {
				if (
					value.body.product_resource_id !== undefined &&
					value.query?.with_resource_id !== true
				)
					ctx.addIssue({
						code: 'custom',
						path: ['query', 'with_resource_id'],
						message:
							'with_resource_id is required when product_resource_id is sent.',
					});
			}),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/carts/${encodeURIComponent(input.cartId)}/items/${encodeURIComponent(input.itemId)}`,
			query: input.query,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'cartItems.delete',
		input: z
			.object({
				shopId: Identifier,
				cartId: Identifier,
				itemId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/carts/${encodeURIComponent(input.cartId)}/items/${encodeURIComponent(input.itemId)}`,
			query: input.query,
		}),
	}),
};

const CategoryBody = z
	.object({
		name: z.string().min(1),
		exclude_from_automations: z.boolean().optional(),
	})
	.strict();

export const Categories = {
	list: defineMailerLiteOperation({
		operation: 'categories.list',
		input: z
			.object({
				shopId: Identifier,
				query: ListPage.extend({ sort: CategorySort.optional() })
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/categories`,
			query: input.query,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'categories.get',
		input: z
			.object({
				shopId: Identifier,
				categoryId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/categories/${encodeURIComponent(input.categoryId)}`,
			query: input.query,
		}),
	}),
	count: defineMailerLiteOperation({
		operation: 'categories.count',
		input: z.object({ shopId: Identifier }).strict(),
		output: MailerLiteCountResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/categories`,
			query: { limit: 0 },
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'categories.create',
		input: z.object({ shopId: Identifier, body: CategoryBody }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/categories`,
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'categories.update',
		input: z
			.object({
				shopId: Identifier,
				categoryId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: CategoryBody,
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/categories/${encodeURIComponent(input.categoryId)}`,
			query: input.query,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'categories.delete',
		input: z
			.object({
				shopId: Identifier,
				categoryId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntitySchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/categories/${encodeURIComponent(input.categoryId)}`,
			query: input.query,
		}),
	}),
};

export const CategoryProducts = {
	list: defineMailerLiteOperation({
		operation: 'categoryProducts.list',
		input: z
			.object({
				shopId: Identifier,
				categoryId: Identifier,
				query: ListPage.extend(ResourceLookupQuery.shape).strict().optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/categories/${encodeURIComponent(input.categoryId)}/products`,
			query: input.query,
		}),
	}),
	assign: defineMailerLiteOperation({
		operation: 'categoryProducts.assign',
		input: z
			.object({
				shopId: Identifier,
				categoryId: Identifier,
				productId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/categories/${encodeURIComponent(input.categoryId)}/products/${encodeURIComponent(input.productId)}`,
			query: input.query,
		}),
	}),
	unassign: defineMailerLiteOperation({
		operation: 'categoryProducts.unassign',
		input: z
			.object({
				shopId: Identifier,
				categoryId: Identifier,
				productId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntitySchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/categories/${encodeURIComponent(input.categoryId)}/products/${encodeURIComponent(input.productId)}`,
			query: input.query,
		}),
	}),
	assignMultiple: defineMailerLiteOperation({
		operation: 'categoryProducts.assignMultiple',
		input: z
			.object({
				shopId: Identifier,
				productId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: z
					.object({
						categories: z.array(MailerLiteIdSchema).max(100),
						replace: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products/${encodeURIComponent(input.productId)}/categories/multiple`,
			query: input.query,
			body: input.body,
		}),
	}),
};

const CustomerBody = z
	.object({
		email: z.string().email(),
		resource_id: z.string().optional(),
		accepts_marketing: z.boolean().optional(),
		total_spent: z.number().optional(),
		create_subscriber: z.boolean().optional(),
		name: z.string().max(255).nullable().optional(),
		last_name: z.string().max(255).nullable().optional(),
	})
	.strict();

export const Customers = {
	list: defineMailerLiteOperation({
		operation: 'customers.list',
		input: z
			.object({
				shopId: Identifier,
				query: ListPage.extend({
					sort: CustomerSort.optional(),
					'filter[email]': z.string().email().optional(),
				})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/customers`,
			query: input.query,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'customers.get',
		input: z
			.object({
				shopId: Identifier,
				customerId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/customers/${encodeURIComponent(input.customerId)}`,
			query: input.query,
		}),
	}),
	count: defineMailerLiteOperation({
		operation: 'customers.count',
		input: z.object({ shopId: Identifier }).strict(),
		output: MailerLiteCountResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/customers`,
			query: { limit: 0 },
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'customers.create',
		riskLevel: 'destructive',
		input: z.object({ shopId: Identifier, body: CustomerBody }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/customers`,
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'customers.update',
		riskLevel: 'destructive',
		input: z
			.object({
				shopId: Identifier,
				customerId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: CustomerBody,
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/customers/${encodeURIComponent(input.customerId)}`,
			query: input.query,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'customers.delete',
		input: z
			.object({
				shopId: Identifier,
				customerId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/customers/${encodeURIComponent(input.customerId)}`,
			query: input.query,
		}),
	}),
};

const OrderCart = z
	.object({
		resource_id: z.string().optional(),
		items: z
			.array(
				z
					.object({
						resource_id: z.string().optional(),
						ecommerce_product_id: ResourceId.optional(),
						product_resource_id: z.string().optional(),
						ecommerce_product_variant_id: ResourceId.optional(),
						variant: z.string().optional(),
						quantity: z.number().int().positive().optional(),
						price: z.number().optional(),
					})
					.strict()
					.superRefine((item, ctx) => {
						if (
							item.ecommerce_product_id === undefined &&
							item.product_resource_id === undefined
						) {
							ctx.addIssue({
								code: 'custom',
								path: ['ecommerce_product_id'],
								message: 'Provide ecommerce_product_id or product_resource_id.',
							});
						}
						if (
							item.ecommerce_product_id !== undefined &&
							item.product_resource_id !== undefined
						) {
							ctx.addIssue({
								code: 'custom',
								path: ['product_resource_id'],
								message: 'Use only one product identifier.',
							});
						}
					}),
			)
			.min(1),
	})
	.strict();
const OrderCustomer = CustomerBody.extend({
	resource_id: z.string().optional(),
}).strict();
const OrderCreateBody = z
	.object({
		resource_id: z.string().optional(),
		customer: OrderCustomer,
		cart: OrderCart,
		status: z.enum(['pending', 'complete']).optional(),
		total_price: z.number().optional(),
	})
	.strict();
const OrderUpdateBody = z
	.object({
		status: z.enum(['pending', 'complete']).optional(),
		total_price: z.number().optional(),
	})
	.strict();

export const Orders = {
	list: defineMailerLiteOperation({
		operation: 'orders.list',
		input: z
			.object({
				shopId: Identifier,
				query: ListPage.extend({
					sort: CartSort.optional(),
					'filter[status]': z.enum(['pending', 'complete']).optional(),
					'filter[customer]': z.number().int().positive().optional(),
					'filter[attributed]': z.boolean().optional(),
					'filter[email_id]': z.number().int().positive().optional(),
				})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/orders`,
			query: input.query,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'orders.get',
		input: z
			.object({
				shopId: Identifier,
				orderId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/orders/${encodeURIComponent(input.orderId)}`,
			query: input.query,
		}),
	}),
	count: defineMailerLiteOperation({
		operation: 'orders.count',
		input: z.object({ shopId: Identifier }).strict(),
		output: MailerLiteCountResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/orders`,
			query: { limit: 0 },
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'orders.create',
		input: z
			.object({
				shopId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: OrderCreateBody,
			})
			.strict()
			.superRefine((value, ctx) => {
				const order = value.body;
				const hasResourceIdentifier =
					order.resource_id !== undefined ||
					order.customer.resource_id !== undefined ||
					order.cart.resource_id !== undefined ||
					order.cart.items.some(
						(item) =>
							item.resource_id !== undefined ||
							item.product_resource_id !== undefined,
					);
				if (hasResourceIdentifier && value.query?.with_resource_id !== true)
					ctx.addIssue({
						code: 'custom',
						path: ['query', 'with_resource_id'],
						message: 'with_resource_id is required when resource IDs are sent.',
					});
			}),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/orders`,
			query: input.query,
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'orders.update',
		input: z
			.object({
				shopId: Identifier,
				orderId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: OrderUpdateBody,
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/orders/${encodeURIComponent(input.orderId)}`,
			query: input.query,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'orders.delete',
		input: z
			.object({
				shopId: Identifier,
				orderId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/orders/${encodeURIComponent(input.orderId)}`,
			query: input.query,
		}),
	}),
};

const ProductBaseBody = z
	.object({
		name: z.string().min(1),
		price: z.number().optional(),
		exclude_from_automations: z.boolean().optional(),
		enabled: z.boolean().optional(),
		url: z.string().url().optional(),
		image: z.string().url().optional(),
		short_description: z.string().max(255).optional(),
		description: z.string().optional(),
	})
	.strict();
const ProductBody = ProductBaseBody.extend({
	currency: z.string().length(3).optional(),
	type: z.enum(['one-time', 'subscription', 'booking']).optional(),
	settings: z
		.object({
			action: z.enum([
				'move_to_group',
				'remove_from_group',
				'update_custom_field',
			]),
			group_id: z.string().optional(),
			field_id: z.string().optional(),
			action_on_field: z.literal('set_to_current_date').optional(),
			field_value: z.string().optional(),
			free: z.boolean().optional(),
			booking_type: z.enum(['one-on-one', 'group']).optional(),
			duration: z.number().min(15).max(1440).optional(),
			duration_unit: z.enum(['minutes', 'hours']).optional(),
			calendar_integration_type: z
				.enum(['google', 'outlook', 'external'])
				.optional(),
			external_link: z.string().url().optional(),
			location: z
				.enum([
					'google-meet',
					'in-person',
					'phone-call',
					'custom-link',
					'teams-meeting',
				])
				.optional(),
			location_address: z.string().optional(),
			location_link: z.string().url().optional(),
			location_instructions: z.string().optional(),
			timezone_id: z.number().int().positive().optional(),
			booking_window_days: z.number().int().min(0).max(100).optional(),
			buffer_between_meetings: z.number().int().min(0).optional(),
			buffer_between_meetings_unit: z.enum(['minutes', 'hours']).optional(),
			minimum_notice_period: z.number().int().min(0).optional(),
			minimum_notice_period_unit: z
				.enum(['minutes', 'hours', 'days'])
				.optional(),
			booking_group_date_time_utc: z.string().optional(),
			booking_group_max_participants: z
				.number()
				.int()
				.min(1)
				.max(1000)
				.optional(),
			booking_group_display_remaining_slots: z.boolean().optional(),
			custom_availability_days: z
				.record(z.string(), z.array(z.string()).length(2))
				.optional(),
		})
		.strict()
		.optional(),
	discounts: z
		.array(
			z
				.object({
					name: z.string().optional(),
					value: z.number().optional(),
					is_percentage: z.boolean().optional(),
					enabled: z.boolean().optional(),
					start_date: z.string().optional(),
					end_date: z.string().optional(),
				})
				.strict(),
		)
		.optional(),
});

export const Products = {
	list: defineMailerLiteOperation({
		operation: 'products.list',
		input: z
			.object({
				shopId: Identifier,
				query: ListPage.extend({
					sort: ProductSort.optional(),
					'filter[name]': z.string().optional(),
					'filter[type]': z
						.enum(['one-time', 'subscription', 'booking'])
						.optional(),
					'filter[enabled]': z.boolean().optional(),
					'filter[category]': z.number().int().positive().optional(),
					'filter[exclude_from_automations]': z.boolean().optional(),
					type: z.string().optional(),
				})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products`,
			query: input.query,
		}),
	}),
	get: defineMailerLiteOperation({
		operation: 'products.get',
		input: z
			.object({
				shopId: Identifier,
				productId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products/${encodeURIComponent(input.productId)}`,
			query: input.query,
		}),
	}),
	count: defineMailerLiteOperation({
		operation: 'products.count',
		input: z.object({ shopId: Identifier }).strict(),
		output: MailerLiteCountResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products`,
			query: { limit: 0 },
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'products.create',
		input: z.object({ shopId: Identifier, body: ProductBody }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products`,
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'products.update',
		input: z
			.object({
				shopId: Identifier,
				productId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: ProductBody,
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products/${encodeURIComponent(input.productId)}`,
			query: input.query,
			body: input.body,
		}),
	}),
	changeStatus: defineMailerLiteOperation({
		operation: 'products.changeStatus',
		input: z
			.object({
				shopId: Identifier,
				productId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: z.object({ status: z.boolean() }).strict(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products/${encodeURIComponent(input.productId)}/change-status`,
			query: input.query,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'products.delete',
		input: z
			.object({
				shopId: Identifier,
				productId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products/${encodeURIComponent(input.productId)}`,
			query: input.query,
		}),
	}),
};

const ProductVariant = z
	.object({
		name: z.string().min(1),
		attributes: z.record(z.string(), z.string()),
		price_type: z.enum(['fixed', 'increment']).optional(),
		price: z.number().optional(),
		resource_id: z.string().optional(),
		image_url: z.string().url().optional(),
	})
	.strict();

export const ProductVariants = {
	list: defineMailerLiteOperation({
		operation: 'productVariants.list',
		input: z
			.object({
				shopId: Identifier,
				productId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products/${encodeURIComponent(input.productId)}/variants`,
			query: input.query,
		}),
	}),
	create: defineMailerLiteOperation({
		operation: 'productVariants.create',
		input: z
			.object({
				shopId: Identifier,
				productId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: z.array(ProductVariant).min(1),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products/${encodeURIComponent(input.productId)}/variants`,
			query: input.query,
			body: input.body,
		}),
	}),
	update: defineMailerLiteOperation({
		operation: 'productVariants.update',
		input: z
			.object({
				shopId: Identifier,
				productId: Identifier,
				variantId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: ProductVariant,
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PUT',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products/${encodeURIComponent(input.productId)}/variants/${encodeURIComponent(input.variantId)}`,
			query: input.query,
			body: input.body,
		}),
	}),
	delete: defineMailerLiteOperation({
		operation: 'productVariants.delete',
		input: z
			.object({
				shopId: Identifier,
				productId: Identifier,
				variantId: Identifier,
				query: ResourceLookupQuery.optional(),
			})
			.strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'DELETE',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products/${encodeURIComponent(input.productId)}/variants/${encodeURIComponent(input.variantId)}`,
			query: input.query,
		}),
	}),
};

const ImportCustomer = z
	.object({
		email: z.string().email(),
		resource_id: z.string().optional(),
		accepts_marketing: z.boolean().optional(),
		create_subscriber: z.boolean().optional(),
		total_spent: z.number().optional(),
		orders_count: z.number().int().nonnegative().optional(),
		name: z.string().max(255).optional(),
		last_name: z.string().max(255).optional(),
	})
	.strict();
const ImportProduct = ProductBaseBody.extend({
	categories: z.array(MailerLiteIdSchema).optional(),
	resource_id: z.string().optional(),
}).strict();
const ImportCategory = z
	.object({
		name: z.string().min(1),
		exclude_from_automations: z.boolean().optional(),
		resource_id: z.string().optional(),
	})
	.strict();
const ImportOrder = z
	.object({
		customer: CustomerBody.optional(),
		customer_id: MailerLiteIdSchema.optional(),
		cart: OrderCart,
		status: z.enum(['pending', 'complete']).optional(),
		total_price: z.number().optional(),
	})
	.strict()
	.refine(
		(value) => value.customer !== undefined || value.customer_id !== undefined,
		'Provide customer or customer_id.',
	);

export const EcommerceImports = {
	categories: defineMailerLiteOperation({
		operation: 'ecommerceImports.categories',
		input: z
			.object({
				shopId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: z.array(ImportCategory).min(1),
			})
			.strict()
			.superRefine((value, ctx) => {
				if (
					value.body.some((category) => category.resource_id !== undefined) &&
					value.query?.with_resource_id !== true
				)
					ctx.addIssue({
						code: 'custom',
						path: ['query', 'with_resource_id'],
						message: 'with_resource_id is required when resource_id is sent.',
					});
			}),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/categories/import`,
			query: input.query,
			body: input.body,
		}),
	}),
	customers: defineMailerLiteOperation({
		operation: 'ecommerceImports.customers',
		input: z
			.object({ shopId: Identifier, body: z.array(ImportCustomer).min(1) })
			.strict(),
		output: z
			.object({
				data: z.array(
					z
						.object({
							resource_id: z.string().optional(),
							email: z.string().email(),
							accepts_marketing: z.boolean().optional(),
							create_subscriber: z.boolean().optional(),
						})
						.passthrough(),
				),
			})
			.passthrough(),
		request: (input) => ({
			method: 'POST',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/customers/import`,
			body: input.body,
		}),
	}),
	products: defineMailerLiteOperation({
		operation: 'ecommerceImports.products',
		input: z
			.object({
				shopId: Identifier,
				query: ResourceLookupQuery.optional(),
				body: z.array(ImportProduct).min(1),
			})
			.strict()
			.superRefine((value, ctx) => {
				if (
					value.body.some((product) => product.resource_id !== undefined) &&
					value.query?.with_resource_id !== true
				)
					ctx.addIssue({
						code: 'custom',
						path: ['query', 'with_resource_id'],
						message: 'with_resource_id is required when resource_id is sent.',
					});
			}),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/products/import`,
			query: input.query,
			body: input.body,
		}),
	}),
	orders: defineMailerLiteOperation({
		operation: 'ecommerceImports.orders',
		input: z
			.object({
				shopId: Identifier,
				body: z.object({ orders: z.array(ImportOrder).min(1) }).strict(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/ecommerce/shops/${encodeURIComponent(input.shopId)}/orders/import`,
			body: input.body,
		}),
	}),
};
