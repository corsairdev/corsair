import { finerworksEndpointMeta, finerworksEndpointsNested } from './endpoints';
import { FinerWorksEndpointOutputSchemas } from './endpoints/types';

/**
 * Every endpoint goes through `makeFinerWorksRequest`, so mocking the client
 * lets each test assert the exact path, method and body the endpoint sends and
 * then feed a documented response back through the output schema.
 */
jest.mock('./client', () => ({
	makeFinerWorksRequest: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { makeFinerWorksRequest } = require('./client') as {
	makeFinerWorksRequest: jest.Mock;
};

/** The envelope FinerWorks returns on every successful call. */
const okStatus = {
	success: true,
	status_code: 200,
	message: '',
	debug: null,
	reference_id: 'ref-1',
	domain: null,
};

type AnyEndpoint = (ctx: unknown, input?: unknown) => Promise<unknown>;

/** Minimal context: a resolved web API key plus an app key from options. */
function makeCtx(overrides: Record<string, unknown> = {}) {
	return {
		key: 'web-key',
		options: { appKey: 'app-key' },
		keys: { get_app_key: jest.fn(async () => null) },
		...overrides,
	};
}

function endpoint(group: string, name: string): AnyEndpoint {
	const groups = finerworksEndpointsNested as unknown as Record<
		string,
		Record<string, AnyEndpoint>
	>;
	const fn = groups[group]?.[name];
	if (!fn) throw new Error(`no endpoint ${group}.${name}`);
	return fn;
}

/** The (path, options) pair the endpoint passed to the client. */
function lastCall(): [
	string,
	unknown,
	{ method?: string; body?: unknown; query?: unknown },
] {
	return makeFinerWorksRequest.mock.calls.at(-1) as [
		string,
		unknown,
		{ method?: string; body?: unknown; query?: unknown },
	];
}

beforeEach(() => {
	makeFinerWorksRequest.mockReset();
});

describe('credentials', () => {
	it('sends both the web API key and the app key', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus });

		await endpoint('account', 'getCompanyInfo')(makeCtx());

		const [, credentials] = lastCall();
		expect(credentials).toEqual({ webApiKey: 'web-key', appKey: 'app-key' });
	});

	it('falls back to the stored app key when no option is set', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus });
		const ctx = makeCtx({
			options: {},
			keys: { get_app_key: jest.fn(async () => 'stored-app-key') },
		});

		await endpoint('account', 'getCompanyInfo')(ctx);

		const [, credentials] = lastCall();
		expect(credentials).toEqual({
			webApiKey: 'web-key',
			appKey: 'stored-app-key',
		});
	});

	it('fails with an actionable error when the app key is absent', async () => {
		const ctx = makeCtx({
			options: {},
			keys: { get_app_key: jest.fn(async () => null) },
		});

		await expect(endpoint('account', 'getCompanyInfo')(ctx)).rejects.toThrow(
			/app key is required/i,
		);
		expect(makeFinerWorksRequest).not.toHaveBeenCalled();
	});
});

describe('account endpoints', () => {
	it('getCompanyInfo GETs /v3/get_company_info', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			site_id: 2,
			address: { city: 'San Antonio', country_code: 'us' },
			lobby_hours: '9-5',
		});

		const res = (await endpoint('account', 'getCompanyInfo')(makeCtx())) as {
			site_id: number;
		};

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/get_company_info');
		expect(opts.method).toBe('GET');
		expect(res.site_id).toBe(2);
	});

	it('getUser passes account_key as a query parameter', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			user_account: { account_id: 1, account_username: 'bob_ross' },
		});

		const res = (await endpoint('account', 'getUser')(makeCtx(), {
			account_key: 'acct-1',
		})) as { user_account: { account_username: string } };

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/get_user');
		expect(opts.method).toBe('GET');
		expect(opts.query).toEqual({ account_key: 'acct-1' });
		expect(res.user_account.account_username).toBe('bob_ross');
	});

	it('getUser omits the query entirely when no account_key is given', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus });

		await endpoint('account', 'getUser')(makeCtx(), {});

		expect(lastCall()[2].query).toBeUndefined();
	});

	it('updateUser PUTs /v3/update_user', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus });

		await endpoint('account', 'updateUser')(makeCtx(), {
			billing_info: { first_name: 'Bob' },
		});

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/update_user');
		expect(opts.method).toBe('PUT');
		expect(opts.body).toEqual({ billing_info: { first_name: 'Bob' } });
	});

	it('updateAppDetails PUTs /v3/update_app_details', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus });

		await endpoint('account', 'updateAppDetails')(makeCtx(), {
			app_details: { app_name: 'Corsair', app_live_mode: true },
		});

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/update_app_details');
		expect(opts.method).toBe('PUT');
	});
});

describe('image endpoints', () => {
	const library = { name: 'inventory', site_id: 2 };

	it('add POSTs /v3/add_images', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus, images: [] });

		await endpoint('images', 'add')(makeCtx(), {
			images: [{ title: 'My Image', file_name: 'a.jpg' }],
			library,
		});

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/add_images');
		expect(opts.method).toBe('POST');
	});

	it('add rejects more than the documented five images', async () => {
		const images = Array.from({ length: 6 }, (_, i) => ({
			file_name: `${i}.jpg`,
		}));

		await expect(
			endpoint('images', 'add')(makeCtx(), { images, library }),
		).rejects.toThrow();
		expect(makeFinerWorksRequest).not.toHaveBeenCalled();
	});

	it('list POSTs /v3/list_images and parses images plus paging', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			images: [{ id: 1, guid: 'g-1', title: 'My Image' }],
			page_number: 1,
			per_page: 10,
			count: 1,
		});

		const res = (await endpoint('images', 'list')(makeCtx(), {
			library,
			page_number: 1,
			per_page: 10,
		})) as { images: Array<{ guid: string }>; count: number };

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/list_images');
		expect(opts.method).toBe('POST');
		expect(res.images[0]?.guid).toBe('g-1');
		expect(res.count).toBe(1);
	});

	it('list rejects a per_page above the documented maximum of 50', async () => {
		await expect(
			endpoint('images', 'list')(makeCtx(), { library, per_page: 51 }),
		).rejects.toThrow();
	});

	it('update PUTs /v3/update_images', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus, images: [] });

		await endpoint('images', 'update')(makeCtx(), {
			images: [{ guid: 'g-1', title: 'Renamed' }],
		});

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/update_images');
		expect(opts.method).toBe('PUT');
	});

	it('update requires a guid on every image', async () => {
		await expect(
			endpoint('images', 'update')(makeCtx(), {
				images: [{ title: 'No guid' }],
			}),
		).rejects.toThrow();
	});

	it('delete DELETEs /v3/delete_images', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus });

		await endpoint('images', 'delete')(makeCtx(), { guids: ['g-1', 'g-2'] });

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/delete_images');
		expect(opts.method).toBe('DELETE');
		expect(opts.body).toMatchObject({ guids: ['g-1', 'g-2'] });
	});

	it('listFileSelection GETs with the selection guid', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			guids: ['a', 'b'],
		});

		const res = (await endpoint('images', 'listFileSelection')(makeCtx(), {
			guid: 'sel-1',
		})) as { guids: string[] };

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/list_file_selection');
		expect(opts.method).toBe('GET');
		expect(opts.query).toEqual({ guid: 'sel-1' });
		expect(res.guids).toEqual(['a', 'b']);
	});

	it('updateFileSelection PUTs /v3/update_file_selection', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			guid: 'sel-1',
		});

		await endpoint('images', 'updateFileSelection')(makeCtx(), {
			guids: ['a'],
			guid: 'sel-1',
		});

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/update_file_selection');
		expect(opts.method).toBe('PUT');
	});
});

describe('gallery endpoints', () => {
	it('addOrUpdateCollection POSTs /v3/add_update_gallery_collection', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus, id: 7 });

		const res = (await endpoint('galleries', 'addOrUpdateCollection')(
			makeCtx(),
			{ name: 'Landscapes' },
		)) as { id: number };

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/add_update_gallery_collection');
		expect(opts.method).toBe('POST');
		expect(res.id).toBe(7);
	});

	it('addOrUpdateCollection requires a name', async () => {
		await expect(
			endpoint('galleries', 'addOrUpdateCollection')(makeCtx(), {}),
		).rejects.toThrow();
	});

	it('list POSTs /v3/list_galleries', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			galleries: [{ id: 1, name: 'Main', image_count: 3 }],
		});

		const res = (await endpoint('galleries', 'list')(makeCtx(), {
			personal: true,
		})) as { galleries: Array<{ name: string }> };

		expect(lastCall()[0]).toBe('v3/list_galleries');
		expect(res.galleries[0]?.name).toBe('Main');
	});

	it('listThemes POSTs /v3/list_gallery_themes', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			themes: [{ slug: 'dark', name: 'Dark' }],
		});

		const res = (await endpoint('galleries', 'listThemes')(makeCtx())) as {
			themes: Array<{ slug: string }>;
		};

		expect(lastCall()[0]).toBe('v3/list_gallery_themes');
		expect(res.themes[0]?.slug).toBe('dark');
	});
});

describe('order endpoints', () => {
	const recipient = {
		first_name: 'Bob',
		last_name: 'Ross',
		address_1: '742 Evergreen Terrace',
		city: 'Mountain Scene',
		zip_postal_code: '88888',
		country_code: 'us',
	};
	const order = {
		order_po: 'PO_0001',
		recipient,
		order_items: [{ product_qty: 1, product_sku: 'AP1234P1234' }],
	};

	it('submit POSTs /v3/submit_orders_v2', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus, orders: [] });

		await endpoint('orders', 'submit')(makeCtx(), { orders: [order] });

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/submit_orders_v2');
		expect(opts.method).toBe('POST');
	});

	it('submit rejects more than the documented five orders', async () => {
		await expect(
			endpoint('orders', 'submit')(makeCtx(), {
				orders: Array.from({ length: 6 }, () => order),
			}),
		).rejects.toThrow();
	});

	it('submit rejects an order whose recipient has no deliverable address', async () => {
		await expect(
			endpoint('orders', 'submit')(makeCtx(), {
				orders: [{ ...order, recipient: { first_name: 'Bob' } }],
			}),
		).rejects.toThrow();
	});

	it('savePending POSTs /v3/save_pending_orders', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus, orders: [] });

		await endpoint('orders', 'savePending')(makeCtx(), { orders: [order] });

		expect(lastCall()[0]).toBe('v3/save_pending_orders');
	});

	it('deletePending POSTs /v3/delete_pending_orders', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus });

		await endpoint('orders', 'deletePending')(makeCtx(), { ids: [1, 2] });

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/delete_pending_orders');
		expect(opts.body).toMatchObject({ ids: [1, 2] });
	});

	it('fetchStatus POSTs /v3/fetch_order_status and parses shipments', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			orders: [
				{
					order_id: 123456,
					order_status_label: 'Shipped',
					shipments: [{ tracking_number: '1HYZ1234567890' }],
				},
			],
		});

		const res = (await endpoint('orders', 'fetchStatus')(makeCtx(), {
			order_ids: [123456],
		})) as {
			orders: Array<{ shipments: Array<{ tracking_number: string }> }>;
		};

		expect(lastCall()[0]).toBe('v3/fetch_order_status');
		expect(res.orders[0]?.shipments[0]?.tracking_number).toBe('1HYZ1234567890');
	});

	it('fetchStatus requires at least one order selector', async () => {
		await expect(
			endpoint('orders', 'fetchStatus')(makeCtx(), {}),
		).rejects.toThrow(/at least one of order_pos or order_ids/i);
	});

	it('listStatusDefinitions GETs /v3/list_order_status_definitions', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			definitions: [{ order_status_id: 7, order_status_label: 'Shipped' }],
		});

		const res = (await endpoint(
			'orders',
			'listStatusDefinitions',
		)(makeCtx())) as { definitions: Array<{ order_status_label: string }> };

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/list_order_status_definitions');
		expect(opts.method).toBe('GET');
		expect(res.definitions[0]?.order_status_label).toBe('Shipped');
	});

	it('validateRecipientAddress POSTs /v3/validate_recipient_address', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			address: { city: 'Mountain Scene', country_code: 'us' },
		});

		const res = (await endpoint('orders', 'validateRecipientAddress')(
			makeCtx(),
			{ recipient },
		)) as { address: { city: string } };

		expect(lastCall()[0]).toBe('v3/validate_recipient_address');
		expect(res.address.city).toBe('Mountain Scene');
	});
});

describe('product endpoints', () => {
	it('getPrices POSTs /v3/get_prices and parses the price breakdown', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			prices: [{ product_sku: 'AP1', total_price: 113.0 }],
		});

		const res = (await endpoint('products', 'getPrices')(makeCtx(), {
			products: [{ product_qty: 1, product_sku: 'AP1' }],
		})) as { prices: Array<{ total_price: number }> };

		expect(lastCall()[0]).toBe('v3/get_prices');
		expect(res.prices[0]?.total_price).toBe(113);
	});

	it('getPrices rejects a non-positive quantity', async () => {
		await expect(
			endpoint('products', 'getPrices')(makeCtx(), {
				products: [{ product_qty: 0, product_sku: 'AP1' }],
			}),
		).rejects.toThrow();
	});

	it('listMediaTypes POSTs /v3/list_media_types', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			media_types: [{ id: 1, name: 'Archival Paper' }],
		});

		const res = (await endpoint('products', 'listMediaTypes')(makeCtx())) as {
			media_types: Array<{ name: string }>;
		};

		expect(lastCall()[0]).toBe('v3/list_media_types');
		expect(res.media_types[0]?.name).toBe('Archival Paper');
	});

	it('listProductTypes POSTs /v3/list_product_types', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			product_types: [{ id: 1, name: 'Canvas Prints' }],
		});

		const res = (await endpoint('products', 'listProductTypes')(makeCtx())) as {
			product_types: Array<{ name: string }>;
		};

		expect(lastCall()[0]).toBe('v3/list_product_types');
		expect(res.product_types[0]?.name).toBe('Canvas Prints');
	});

	it('listStyleTypes POSTs /v3/list_style_types', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			style_types: [{ id: 1, name: 'Extra Border', can_frame: true }],
		});

		const res = (await endpoint('products', 'listStyleTypes')(makeCtx())) as {
			style_types: Array<{ can_frame: boolean }>;
		};

		expect(lastCall()[0]).toBe('v3/list_style_types');
		expect(res.style_types[0]?.can_frame).toBe(true);
	});
});

describe('framing endpoints', () => {
	it('getFrameDetails POSTs /v3/frame_details and parses a single frame', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			frame: { id: 1, name: 'Rustic Britanny', starting_price: 24.1 },
		});

		const res = (await endpoint('framing', 'getFrameDetails')(makeCtx(), {
			id: 1,
		})) as { frame: { name: string } };

		expect(lastCall()[0]).toBe('v3/frame_details');
		expect(res.frame.name).toBe('Rustic Britanny');
	});

	it('getFrameDetails requires an id', async () => {
		await expect(
			endpoint('framing', 'getFrameDetails')(makeCtx(), {}),
		).rejects.toThrow();
	});

	it('listCollections POSTs /v3/list_collections', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			collections: [{ id: 1, name: 'Modern', frames: [{ id: 2 }] }],
		});

		const res = (await endpoint('framing', 'listCollections')(makeCtx())) as {
			collections: Array<{ name: string }>;
		};

		expect(lastCall()[0]).toBe('v3/list_collections');
		expect(res.collections[0]?.name).toBe('Modern');
	});

	it('listGlazing POSTs /v3/list_glazing', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			glazing: [{ id: 1, name: 'Premium Clear' }],
		});

		const res = (await endpoint('framing', 'listGlazing')(makeCtx())) as {
			glazing: Array<{ name: string }>;
		};

		expect(lastCall()[0]).toBe('v3/list_glazing');
		expect(res.glazing[0]?.name).toBe('Premium Clear');
	});

	it('listMats POSTs /v3/list_mats', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			mats: [{ id: 1, name: 'Off White', color: 'white' }],
		});

		const res = (await endpoint('framing', 'listMats')(makeCtx())) as {
			mats: Array<{ color: string }>;
		};

		expect(lastCall()[0]).toBe('v3/list_mats');
		expect(res.mats[0]?.color).toBe('white');
	});
});

describe('shipping endpoints', () => {
	it('getOptionIds GETs /v3/get_shipping_options_ids with a type filter', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			shipping_options: [{ id: 1, shipping_code: 'SD' }],
		});

		const res = (await endpoint('shipping', 'getOptionIds')(makeCtx(), {
			type: 1,
		})) as { shipping_options: Array<{ shipping_code: string }> };

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/get_shipping_options_ids');
		expect(opts.method).toBe('GET');
		expect(opts.query).toEqual({ type: 1 });
		expect(res.shipping_options[0]?.shipping_code).toBe('SD');
	});

	it('rejects a non-numeric shipping type, which the API validates as Int32', async () => {
		await expect(
			endpoint('shipping', 'getOptionIds')(makeCtx(), { type: 'domestic' }),
		).rejects.toThrow();
	});

	it('listOptionsMultiple POSTs /v3/list_shipping_options_multiple', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus, orders: [] });

		await endpoint('shipping', 'listOptionsMultiple')(makeCtx(), {
			orders: [
				{
					order_po: 'PO_0001',
					recipient: {
						first_name: 'Bob',
						last_name: 'Ross',
						address_1: '742 Evergreen Terrace',
						city: 'Mountain Scene',
						zip_postal_code: '88888',
						country_code: 'us',
					},
					order_items: [{ product_qty: 1, product_sku: 'AP1' }],
				},
			],
		});

		expect(lastCall()[0]).toBe('v3/list_shipping_options_multiple');
	});
});

describe('virtual inventory endpoints', () => {
	it('list POSTs /v3/list_virtual_inventory and parses products', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			products: [{ id: 1, sku: 'AP1556P79511', asking_price: 200 }],
			page_number: 1,
			per_page: 10,
			count: 1,
		});

		const res = (await endpoint('inventory', 'list')(makeCtx(), {
			page_number: 1,
			per_page: 10,
		})) as { products: Array<{ sku: string }>; count: number };

		expect(lastCall()[0]).toBe('v3/list_virtual_inventory');
		expect(res.products[0]?.sku).toBe('AP1556P79511');
		expect(res.count).toBe(1);
	});

	it('update PUTs /v3/update_virtual_inventory', async () => {
		makeFinerWorksRequest.mockResolvedValue({
			status: okStatus,
			products: [],
		});

		await endpoint('inventory', 'update')(makeCtx(), {
			virtual_inventory: [{ sku: 'AP1', asking_price: 200 }],
		});

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/update_virtual_inventory');
		expect(opts.method).toBe('PUT');
	});

	it('update requires a sku on every item', async () => {
		await expect(
			endpoint('inventory', 'update')(makeCtx(), {
				virtual_inventory: [{ asking_price: 200 }],
			}),
		).rejects.toThrow();
	});

	it('delete DELETEs /v3/delete_virtual_inventory', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus });

		await endpoint('inventory', 'delete')(makeCtx(), { skus: ['AP1'] });

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/delete_virtual_inventory');
		expect(opts.method).toBe('DELETE');
	});

	it('disconnect PUTs /v3/disconnect_virtual_inventory', async () => {
		makeFinerWorksRequest.mockResolvedValue({ status: okStatus });

		await endpoint('inventory', 'disconnect')(makeCtx(), {
			platform: 'shopify',
		});

		const [path, , opts] = lastCall();
		expect(path).toBe('v3/disconnect_virtual_inventory');
		expect(opts.method).toBe('PUT');
		expect(opts.body).toMatchObject({ platform: 'shopify' });
	});

	it('disconnect requires a platform', async () => {
		await expect(
			endpoint('inventory', 'disconnect')(makeCtx(), {}),
		).rejects.toThrow();
	});
});

describe('endpoint registry', () => {
	const paths = Object.entries(
		finerworksEndpointsNested as unknown as Record<
			string,
			Record<string, unknown>
		>,
	).flatMap(([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`));

	it('exposes the 33 operations the integration is specified to cover', () => {
		expect(paths).toHaveLength(33);
	});

	it('gives every operation an implementation, meta entry and output schema', () => {
		for (const path of paths) {
			expect(
				typeof (finerworksEndpointMeta as unknown as Record<string, unknown>)[
					path
				],
			).toBe('object');
			expect(
				(FinerWorksEndpointOutputSchemas as unknown as Record<string, unknown>)[
					path
				],
			).toBeDefined();
		}
	});

	it('marks the destructive operations as irreversible', () => {
		const meta = finerworksEndpointMeta as unknown as Record<
			string,
			{ riskLevel: string; irreversible?: boolean }
		>;
		for (const path of [
			'images.delete',
			'orders.deletePending',
			'inventory.delete',
		]) {
			expect(meta[path]?.riskLevel).toBe('destructive');
			expect(meta[path]?.irreversible).toBe(true);
		}
	});
});
