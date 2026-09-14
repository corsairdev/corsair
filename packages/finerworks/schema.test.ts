import {
	FinerWorksEndpointInputSchemas,
	FinerWorksEndpointOutputSchemas,
} from './endpoints/types';
import {
	FinerWorksAddress,
	FinerWorksDimensions,
	FinerWorksFrame,
	FinerWorksImage,
	FinerWorksMountingAddOn,
	FinerWorksOrder,
	FinerWorksPrice,
	FinerWorksSchema,
	FinerWorksShippingQuote,
	FinerWorksSubmittedOrder,
	FinerWorksThirdPartyIntegrations,
	FinerWorksVirtualInventoryProduct,
} from './schema';

describe('FinerWorks schema', () => {
	it('declares a semver version', () => {
		expect(FinerWorksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entity for every documented resource', () => {
		const entities = Object.keys(FinerWorksSchema.entities);
		expect(entities).toEqual(
			expect.arrayContaining([
				'images',
				'virtualInventoryProducts',
				'orders',
				'shipments',
				'orderStatusDefinitions',
				'prices',
				'galleries',
				'galleryThemes',
				'frames',
				'frameCollections',
				'glazing',
				'mats',
				'mediaTypes',
				'productTypes',
				'styleTypes',
				'shippingOptions',
				'userAccounts',
				'companyInfo',
			]),
		);
	});
});

describe('entity shapes match the documented responses', () => {
	it('parses an image record from POST /v3/list_images', () => {
		const parsed = FinerWorksImage.parse({
			id: 0,
			guid: 'ff754fa0-a73e-488a-8fea-9cf2cb15e6bd',
			title: 'My Image',
			file_name: 'myimage.jpg',
			file_size: 100000,
			thumbnail_file_name: null,
			pix_w: 2000,
			pix_h: 3000,
			date_added: '2026-09-03T10:50:27.4466133-05:00',
			active: true,
		});

		expect(parsed.guid).toBe('ff754fa0-a73e-488a-8fea-9cf2cb15e6bd');
		expect(parsed.pix_h).toBe(3000);
	});

	it('parses a virtual inventory product from POST /v3/list_virtual_inventory', () => {
		const parsed = FinerWorksVirtualInventoryProduct.parse({
			id: 123456,
			monetary_format: 'USD',
			quantity_in_stock: 0,
			track_inventory: false,
			sku: 'AP1556P79511',
			product_code: '5M41M9S8X10F131S13X15J2S9X11G1',
			per_item_price: 113.0,
			asking_price: 200.0,
		});

		expect(parsed.sku).toBe('AP1556P79511');
		expect(parsed.asking_price).toBe(200);
	});

	it('parses an order with shipments from POST /v3/fetch_order_status', () => {
		const parsed = FinerWorksOrder.parse({
			order_confirmation_id: 411111111,
			order_po: 'PO_0001',
			order_id: 123456,
			order_status_id: 7,
			order_status_label: 'Shipped',
			shipments: [
				{
					tracking_number: '1HYZ1234567890',
					tracking_url: 'https://shippingservice.com/?tracking=1HYZ1234567890',
					weight: 3.0,
				},
			],
			processing: false,
		});

		expect(parsed.shipments?.[0]?.tracking_number).toBe('1HYZ1234567890');
	});

	it('parses a price breakdown from POST /v3/get_prices', () => {
		const parsed = FinerWorksPrice.parse({
			product_qty: 1,
			product_sku: 'AP1',
			product_price: 4.1,
			add_frame_price: 5.1,
			total_price: 10.1,
		});

		expect(parsed.total_price).toBe(10.1);
	});

	it('parses a frame from POST /v3/frame_details', () => {
		const parsed = FinerWorksFrame.parse({
			id: 1,
			name: 'Rustic Britanny',
			thickness: 3.0,
			allow_glazing: true,
			starting_price: 24.1,
		});

		expect(parsed.allow_glazing).toBe(true);
	});

	it('keeps undocumented fields instead of stripping them', () => {
		const parsed = FinerWorksAddress.parse({
			city: 'Mountain Scene',
			country_code: 'us',
			some_future_field: 'kept',
		}) as Record<string, unknown>;

		expect(parsed.some_future_field).toBe('kept');
	});
});

describe('endpoint schema registries', () => {
	it('declares an input and output schema for the same 33 operations', () => {
		const inputs = Object.keys(FinerWorksEndpointInputSchemas).sort();
		const outputs = Object.keys(FinerWorksEndpointOutputSchemas).sort();

		expect(inputs).toHaveLength(33);
		expect(inputs).toEqual(outputs);
	});

	it('rejects a recipient that is missing a deliverable address', () => {
		const schema =
			FinerWorksEndpointInputSchemas['orders.validateRecipientAddress'];

		expect(() => schema.parse({ recipient: { first_name: 'Bob' } })).toThrow();
		expect(() =>
			schema.parse({
				recipient: {
					first_name: 'Bob',
					last_name: 'Ross',
					address_1: '742 Evergreen Terrace',
					city: 'Mountain Scene',
					zip_postal_code: '88888',
					country_code: 'us',
				},
			}),
		).not.toThrow();
	});

	it('accepts the documented paging bounds and rejects oversized pages', () => {
		const schema = FinerWorksEndpointInputSchemas['inventory.list'];

		expect(() => schema.parse({ per_page: 50 })).not.toThrow();
		expect(() => schema.parse({ per_page: 51 })).toThrow();
	});
});

describe('entities narrowed from the documented examples', () => {
	it('parses the storefront sync ids from PUT /v3/update_virtual_inventory', () => {
		const parsed = FinerWorksThirdPartyIntegrations.parse({
			etsy_product_id: 0,
			shopify_product_id: 123456789,
			shopify_variant_id: 24681012,
			shopify_graphql_product_id: null,
			woocommerce_product_id: 0,
		});

		expect(parsed.shopify_product_id).toBe(123456789);
		expect(parsed.shopify_graphql_product_id).toBeNull();
	});

	it('parses a width/height pair from POST /v3/list_style_types', () => {
		const parsed = FinerWorksDimensions.parse({ width: 1.0, height: 2.0 });

		expect(parsed.width).toBe(1);
		expect(parsed.height).toBe(2);
	});

	it('parses a mounting add-on with nested size limits', () => {
		const parsed = FinerWorksMountingAddOn.parse({
			id: 1,
			name: 'Foam mount',
			rate: 5.0,
			price: 6.0,
			min: { width: 1.0, height: 2.0 },
			max: { width: 30.0, height: 40.0 },
		});

		expect(parsed.min?.width).toBe(1);
		expect(parsed.max?.height).toBe(40);
	});

	it('parses an order confirmation from POST /v3/submit_orders_v2', () => {
		const parsed = FinerWorksSubmittedOrder.parse({
			order_po: 'PO_0001',
			order_id: 123456,
			order_confirmation_id: 411111111,
			order_guid: '00000000-0000-0000-0000-000000000000',
			order_email: null,
			order_confirmation_datetime: '2026-09-11T10:50:27.4466133-05:00',
		});

		expect(parsed.order_id).toBe(123456);
		expect(parsed.order_po).toBe('PO_0001');
	});

	it('parses a batch shipping quote with its calculated total', () => {
		const parsed = FinerWorksShippingQuote.parse({
			order_po: 'PO_0001',
			options: [
				{
					id: 0,
					rate: 9.95,
					shipping_method: 'USPS Priority Mail',
					shipping_code: 'SD',
					calculated_total: {
						order_po: 'PO_0001',
						order_subtotal: 122.0,
						order_shipping_rate: 9.95,
						order_grand_total: 152.28,
						product_pricing: [{ product_qty: 1, product_sku: 'AP1' }],
					},
				},
			],
		});

		expect(parsed.options?.[0]?.shipping_method).toBe('USPS Priority Mail');
		expect(parsed.options?.[0]?.calculated_total?.order_grand_total).toBe(
			152.28,
		);
		expect(
			parsed.options?.[0]?.calculated_total?.product_pricing?.[0]?.product_sku,
		).toBe('AP1');
	});
});
