import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { packCloudcartKey } from './client';
import type { CloudcartContext } from './index';
import { cloudcart } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const STORE = 'https://shop.example.com';
const PACKED = packCloudcartKey('cc_test_key', STORE);
const mockCtx = {
	key: PACKED,
	$getAccountId: () => 'test-account-id',
	options: { key: 'cc_test_key', storeUrl: STORE },
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => PACKED,
} as unknown as CloudcartContext;

const DATA = { data: { name: 'x' } };
const ID = { id: '1' };
const ID_DATA = { id: '1', data: { name: 'x' } };

type Case = [
	group: string,
	name: string,
	input: Record<string, unknown>,
	method: string,
	url: string,
];

const cases: Case[] = [
	['products', 'createProduct', DATA, 'POST', 'products'],
	['products', 'getProduct', ID, 'GET', 'products/1'],
	['products', 'getProductWithRelations', ID, 'GET', 'products/1/relations'],
	['products', 'listProducts', {}, 'GET', 'products'],
	['products', 'updateProduct', ID_DATA, 'PATCH', 'products/1'],
	['products', 'deleteProduct', ID, 'DELETE', 'products/1'],
	[
		'products',
		'createLinkedProducts',
		ID_DATA,
		'POST',
		'products/1/linked-products',
	],
	[
		'products',
		'getProductsLinkedProduct',
		ID,
		'GET',
		'products/1/linked-product',
	],
	[
		'products',
		'getProductsLinkedProducts',
		ID,
		'GET',
		'products/1/linked-products',
	],
	[
		'products',
		'updateLinkedProduct',
		ID_DATA,
		'PUT',
		'products/1/linked-products',
	],
	[
		'products',
		'deleteLinkedProducts',
		ID,
		'DELETE',
		'products/1/linked-products',
	],
	['products', 'createImage', DATA, 'POST', 'images'],
	['products', 'getImage', ID, 'GET', 'images/1'],
	['products', 'listImages', {}, 'GET', 'images'],
	['products', 'deleteImage', ID, 'DELETE', 'images/1'],

	['categories', 'createCategory', DATA, 'POST', 'categories'],
	['categories', 'getCategory', ID, 'GET', 'categories/1'],
	['categories', 'listCategories', {}, 'GET', 'categories'],
	['categories', 'updateCategory', ID_DATA, 'PATCH', 'categories/1'],
	['categories', 'deleteCategory', ID, 'DELETE', 'categories/1'],
	['categories', 'getCategoryProperties', ID, 'GET', 'categories/1/properties'],
	[
		'categories',
		'addCategoryProperties',
		ID_DATA,
		'POST',
		'categories/1/properties',
	],

	['properties', 'createProperty', DATA, 'POST', 'properties'],
	['properties', 'getProperty', ID, 'GET', 'properties/1'],
	['properties', 'listProperties', {}, 'GET', 'properties'],
	['properties', 'updateProperty', ID_DATA, 'PATCH', 'properties/1'],
	['properties', 'deleteProperty', ID, 'DELETE', 'properties/1'],
	[
		'properties',
		'createPropertyOption',
		{ property_id: '1', ...DATA },
		'POST',
		'properties/1/options',
	],
	['properties', 'getPropertyOption', ID, 'GET', 'properties/options/1'],
	['properties', 'listPropertyOptions', {}, 'GET', 'properties/options'],
	[
		'properties',
		'updatePropertyOption',
		ID_DATA,
		'PATCH',
		'properties/options/1',
	],
	['properties', 'deletePropertyOption', ID, 'DELETE', 'properties/options/1'],
	[
		'properties',
		'createProductsPropertyOptions',
		ID_DATA,
		'POST',
		'products/1/property-options',
	],
	[
		'properties',
		'getPropertyOptionsRelationship',
		ID,
		'GET',
		'products/1/property-options',
	],

	[
		'variants',
		'createVariant',
		{ product_id: '1', ...DATA },
		'POST',
		'products/1/variants',
	],
	['variants', 'getVariant', ID, 'GET', 'variants/1'],
	['variants', 'listVariants', {}, 'GET', 'variants'],
	['variants', 'updateVariant', ID_DATA, 'PATCH', 'variants/1'],
	['variants', 'deleteVariant', ID, 'DELETE', 'variants/1'],
	[
		'variants',
		'createVariantOption',
		{ product_id: '1', variant_id: '2', ...DATA },
		'POST',
		'variants/2/options',
	],
	[
		'variants',
		'createVariantOptions',
		{ parameter_id: '3', ...DATA },
		'POST',
		'variant-parameters/3/options',
	],
	['variants', 'getVariantOption', ID, 'GET', 'variant-options/1'],
	['variants', 'listVariantOptions', {}, 'GET', 'variant-options'],
	['variants', 'updateVariantOption', ID_DATA, 'PATCH', 'variant-options/1'],
	['variants', 'deleteVariantOption', ID, 'DELETE', 'variant-options/1'],
	['variants', 'createVariantParameter', DATA, 'POST', 'variant-parameters'],
	[
		'variants',
		'createVariantParameterForVariant',
		ID_DATA,
		'POST',
		'variants/1/parameters',
	],
	['variants', 'getVariantParameter', ID, 'GET', 'variant-parameters/1'],
	['variants', 'listVariantParameters', {}, 'GET', 'variant-parameters'],
	[
		'variants',
		'updateVariantParameter',
		ID_DATA,
		'PATCH',
		'variant-parameters/1',
	],
	['variants', 'deleteVariantParameter', ID, 'DELETE', 'variant-parameters/1'],

	['customers', 'createCustomer', DATA, 'POST', 'customers'],
	['customers', 'getCustomer', ID, 'GET', 'customers/1'],
	['customers', 'listCustomers', {}, 'GET', 'customers'],
	['customers', 'updateCustomer', ID_DATA, 'PATCH', 'customers/1'],
	['customers', 'deleteCustomer', ID, 'DELETE', 'customers/1'],
	['customers', 'createCustomerGroup', DATA, 'POST', 'customer-groups'],
	['customers', 'getCustomerGroup', ID, 'GET', 'customer-groups/1'],
	['customers', 'listCustomerGroups', {}, 'GET', 'customer-groups'],
	[
		'customers',
		'getCustomerGroupsCustomers',
		ID,
		'GET',
		'customer-groups/1/customers',
	],
	['customers', 'updateCustomerGroup', ID_DATA, 'PATCH', 'customer-groups/1'],
	['customers', 'deleteCustomerGroup', ID, 'DELETE', 'customer-groups/1'],
	[
		'customers',
		'createCustomerBillingAddress',
		{ customer_id: '1', ...DATA },
		'POST',
		'customers/1/billing-addresses',
	],
	[
		'customers',
		'getCustomerBillingAddress',
		ID,
		'GET',
		'customer-billing-addresses/1',
	],
	[
		'customers',
		'listCustomerBillingAddresses',
		{},
		'GET',
		'customer-billing-addresses',
	],
	[
		'customers',
		'updateCustomerBillingAddress',
		ID_DATA,
		'PATCH',
		'customer-billing-addresses/1',
	],
	[
		'customers',
		'deleteCustomerBillingAddress',
		ID,
		'DELETE',
		'customer-billing-addresses/1',
	],
	[
		'customers',
		'createCustomerShippingAddress',
		{ customer_id: '1', ...DATA },
		'POST',
		'customers/1/shipping-addresses',
	],
	[
		'customers',
		'getCustomerShippingAddress',
		ID,
		'GET',
		'customer-shipping-addresses/1',
	],
	[
		'customers',
		'listCustomerShippingAddresses',
		{},
		'GET',
		'customer-shipping-addresses',
	],
	[
		'customers',
		'updateCustomerShippingAddress',
		ID_DATA,
		'PATCH',
		'customer-shipping-addresses/1',
	],
	[
		'customers',
		'deleteCustomerShippingAddress',
		ID,
		'DELETE',
		'customer-shipping-addresses/1',
	],
	['customers', 'createCustomerTag', DATA, 'POST', 'customer-tags'],
	['customers', 'getCustomerTag', ID, 'GET', 'customer-tags/1'],
	['customers', 'listCustomerTags', {}, 'GET', 'customer-tags'],
	['customers', 'updateCustomerTag', ID_DATA, 'PATCH', 'customer-tags/1'],
	['customers', 'deleteCustomerTag', ID, 'DELETE', 'customer-tags/1'],

	['orders', 'createOrder', DATA, 'POST', 'orders'],
	['orders', 'listOrders', {}, 'GET', 'orders'],
	['orders', 'updateOrder', ID_DATA, 'PATCH', 'orders/1'],
	['orders', 'deleteOrder', ID, 'DELETE', 'orders/1'],
	['orders', 'listOrderBillingAddresses', {}, 'GET', 'order-billing-addresses'],
	[
		'orders',
		'listOrderShippingAddresses',
		{},
		'GET',
		'order-shipping-addresses',
	],
	['orders', 'listOrderProducts', {}, 'GET', 'order-products'],
	['orders', 'listOrderProductsOptions', {}, 'GET', 'order-products-options'],
	['orders', 'listOrderPayments', {}, 'GET', 'order-payments'],
	['orders', 'listOrderPaymentV2', {}, 'GET', 'order-payments/v2'],
	['orders', 'listOrderShipping', {}, 'GET', 'order-shippings'],
	['orders', 'listOrderStatus', {}, 'GET', 'order-statuses'],

	['cart', 'getCart', {}, 'GET', 'cart'],
	['cart', 'addToCart', DATA, 'POST', 'cart/items'],
	['cart', 'updateCartItem', ID_DATA, 'PATCH', 'cart/items/1'],
	['cart', 'removeFromCart', ID, 'DELETE', 'cart/items/1'],
	['cart', 'clearCart', {}, 'DELETE', 'cart'],

	['discounts', 'createDiscount', DATA, 'POST', 'discounts'],
	['discounts', 'deleteDiscount', ID, 'DELETE', 'discounts/1'],
	['discounts', 'createDiscountCode', DATA, 'POST', 'discount-codes'],
	['discounts', 'listDiscountCodes', {}, 'GET', 'discount-codes'],
	['discounts', 'updateDiscountCode', ID_DATA, 'PATCH', 'discount-codes/1'],
	['discounts', 'deleteDiscountCode', ID, 'DELETE', 'discount-codes/1'],
	[
		'discounts',
		'generateDiscountCodes',
		DATA,
		'POST',
		'discount-codes/generate',
	],
	[
		'discounts',
		'createProductToDiscount',
		ID_DATA,
		'POST',
		'products/1/discounts',
	],
	[
		'discounts',
		'deleteProductToDiscount',
		{ id: '1', discount_id: '2' },
		'DELETE',
		'products/1/discounts/2',
	],

	['subscribers', 'createSubscriber', DATA, 'POST', 'subscribers'],
	['subscribers', 'getSubscriber', ID, 'GET', 'subscribers/1'],
	['subscribers', 'listSubscribers', {}, 'GET', 'subscribers'],
	['subscribers', 'updateSubscriber', ID_DATA, 'PATCH', 'subscribers/1'],
	['subscribers', 'deleteSubscriber', ID, 'DELETE', 'subscribers/1'],
	[
		'subscribers',
		'createSubscriberChannel',
		DATA,
		'POST',
		'subscriber-channels',
	],
	['subscribers', 'getSubscribersChannel', ID, 'GET', 'subscriber-channels/1'],
	['subscribers', 'listSubscribersChannels', {}, 'GET', 'subscriber-channels'],
	[
		'subscribers',
		'updateSubscribersChannel',
		ID_DATA,
		'PATCH',
		'subscriber-channels/1',
	],
	[
		'subscribers',
		'deleteSubscribersChannel',
		ID,
		'DELETE',
		'subscriber-channels/1',
	],
	['subscribers', 'createSubscriberTag', DATA, 'POST', 'subscriber-tags'],
	['subscribers', 'getSubscriberTag', ID, 'GET', 'subscriber-tags/1'],
	['subscribers', 'listSubscribersTags', {}, 'GET', 'subscriber-tags'],
	['subscribers', 'updateSubscriberTag', ID_DATA, 'PATCH', 'subscriber-tags/1'],
	['subscribers', 'deleteSubscriberTag', ID, 'DELETE', 'subscriber-tags/1'],

	['blogs', 'createBlogPost', DATA, 'POST', 'blog-posts'],
	['blogs', 'getBlogPost', ID, 'GET', 'blog-posts/1'],
	['blogs', 'listBlogPosts', {}, 'GET', 'blog-posts'],
	['blogs', 'updateBlogPost', ID_DATA, 'PATCH', 'blog-posts/1'],
	['blogs', 'deleteBlogPost', ID, 'DELETE', 'blog-posts/1'],
	['blogs', 'createBlogCategory', DATA, 'POST', 'blog-categories'],
	['blogs', 'getBlogCategory', ID, 'GET', 'blog-categories/1'],
	['blogs', 'listBlogCategories', {}, 'GET', 'blog-categories'],
	['blogs', 'updateBlogCategory', ID_DATA, 'PATCH', 'blog-categories/1'],
	['blogs', 'deleteBlogCategory', ID, 'DELETE', 'blog-categories/1'],
	['blogs', 'createBlogTag', DATA, 'POST', 'blog-tags'],
	['blogs', 'getBlogTag', ID, 'GET', 'blog-tags/1'],
	['blogs', 'listBlogTags', {}, 'GET', 'blog-tags'],
	['blogs', 'updateBlogTag', ID_DATA, 'PATCH', 'blog-tags/1'],
	['blogs', 'deleteBlogTag', ID, 'DELETE', 'blog-tags/1'],
	['blogs', 'getBlogAuthor', ID, 'GET', 'blog-authors/1'],

	['misc', 'createVendor', DATA, 'POST', 'vendors'],
	['misc', 'getVendor', ID, 'GET', 'vendors/1'],
	['misc', 'listVendors', {}, 'GET', 'vendors'],
	['misc', 'updateVendor', ID_DATA, 'PATCH', 'vendors/1'],
	['misc', 'deleteVendor', ID, 'DELETE', 'vendors/1'],
	['misc', 'createRedirect', DATA, 'POST', 'redirects'],
	['misc', 'listRedirects', {}, 'GET', 'redirects'],
	['misc', 'deleteRedirect', ID, 'DELETE', 'redirects/1'],
	['misc', 'getPaymentMethods', {}, 'GET', 'payment-methods'],
	['misc', 'listPaymentProviders', {}, 'GET', 'payment-providers'],
	['misc', 'getShippingMethods', {}, 'GET', 'shipping-methods'],
	['misc', 'listShippingProviders', {}, 'GET', 'shipping-providers'],

	['webhooks', 'createWebhook', DATA, 'POST', 'webhooks'],
	['webhooks', 'getWebhook', ID, 'GET', 'webhooks/1'],
	['webhooks', 'listWebhooks', {}, 'GET', 'webhooks'],
	['webhooks', 'updateWebhook', ID_DATA, 'PATCH', 'webhooks/1'],
	['webhooks', 'deleteWebhook', ID, 'DELETE', 'webhooks/1'],
];

describe('cloudcart endpoint map', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ data: { id: '1' } });
		jest.mocked(logEventFromContext).mockReset();
	});

	it('registers a case for every endpoint', () => {
		const tree = cloudcart({ key: 'cc_test_key', storeUrl: STORE }).endpoints;
		if (!tree) throw new Error('missing endpoints');
		const registered: string[] = [];
		for (const [group, ops] of Object.entries(tree)) {
			for (const name of Object.keys(ops)) {
				registered.push(`${group}.${name}`);
			}
		}
		const covered = cases.map(([group, name]) => `${group}.${name}`);
		expect(covered.sort()).toEqual(registered.sort());
	});

	it.each(cases)(
		'%s.%s maps to %s %s',
		async (group, name, input, method, url) => {
			const tree = cloudcart({ key: 'cc_test_key', storeUrl: STORE }).endpoints;
			if (!tree) throw new Error('missing endpoints');
			const ops = tree[group as keyof typeof tree] as Record<
				string,
				(ctx: CloudcartContext, input: unknown) => Promise<unknown>
			>;
			const handler = ops[name];
			if (!handler) throw new Error(`missing ${group}.${name}`);
			await handler(mockCtx, input);
			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ method, url }),
				expect.anything(),
			);
		},
	);
});
