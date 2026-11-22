import { z } from 'zod';
import { lazyModule } from './lazy-module';
import { defineOperation } from './operation';

// Schemas and handlers are built the first time one of these operations runs.
function build() {
	// Resource responses contain conditional fields for account type, asset history, and user-defined category data.
	// Updates and status changes answer with the changed record; deletes answer with no body.
	const EmptyResponse = z.union([z.object({}).passthrough(), z.undefined()]);
	const Decimal = z.union([z.string(), z.number()]);
	const PageQuery = z
		.object({
			page: z.number().int().positive().optional(),
			per_page: z.number().int().min(1).max(100).optional(),
		})
		.strict();
	const Pagination = z.object({
		link: z.string().nullable(),
		total_count: z.string().regex(/^\d+$/).nullable(),
	});

	const CapitalAssetType = z
		.object({
			url: z.string().url().optional(),
			name: z.string().optional(),
			system_default: z.boolean().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough();
	const CapitalAssetTypeInput = z.object({ name: z.string().min(1) }).strict();
	const CapitalAssetTypeListInput = z
		.object({ query: PageQuery.optional() })
		.strict();
	const CapitalAssetTypeListData = z
		.object({ capital_asset_types: z.array(CapitalAssetType) })
		.passthrough();
	const CapitalAssetTypeListOutput = CapitalAssetTypeListData.extend({
		pagination: Pagination,
	}).passthrough();
	const CapitalAssetTypeInputById = z
		.object({ id: z.string().min(1) })
		.strict();
	const CapitalAssetTypeCreateInput = z
		.object({ capital_asset_type: CapitalAssetTypeInput })
		.strict();
	const CapitalAssetTypeUpdateInput = z
		.object({
			id: z.string().min(1),
			capital_asset_type: CapitalAssetTypeInput,
		})
		.strict();
	const CapitalAssetTypeOutput = z
		.object({ capital_asset_type: CapitalAssetType })
		.passthrough();

	const CapitalAssetHistory = z
		.object({
			type: z.string(),
			description: z.string(),
			date: z.string().date(),
			value: Decimal.optional(),
			tax_value: Decimal.optional(),
			link: z.string().url().optional(),
		})
		.passthrough();
	const DepreciationProfile = z
		.object({
			depreciation_method: z.string().optional(),
			depreciation_rate: Decimal.optional(),
			depreciation_frequency: z.string().optional(),
		})
		.passthrough();
	const CapitalAsset = z
		.object({
			url: z.string().url().optional(),
			description: z.string().optional(),
			asset_life_years: z.number().int().nullable().optional(),
			depreciation_profile: DepreciationProfile.optional(),
			asset_type: z.string().optional(),
			purchased_on: z.string().date().optional(),
			disposed_on: z.string().date().nullable().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			capital_asset_history: z.array(CapitalAssetHistory).optional(),
		})
		.passthrough();
	const CapitalAssetListInput = z
		.object({
			query: PageQuery.extend({
				view: z.enum(['all', 'disposed', 'disposable']).optional(),
				include_history: z.boolean().optional(),
			}).optional(),
		})
		.strict();
	const CapitalAssetListData = z
		.object({ capital_assets: z.array(CapitalAsset) })
		.passthrough();
	const CapitalAssetListOutput = CapitalAssetListData.extend({
		pagination: Pagination,
	}).passthrough();
	const CapitalAssetGetInput = z
		.object({
			id: z.string().min(1),
			query: z
				.object({ include_history: z.boolean().optional() })
				.strict()
				.optional(),
		})
		.strict();
	const CapitalAssetOutput = z
		.object({ capital_asset: CapitalAsset })
		.passthrough();

	const HirePurchase = z
		.object({
			url: z.string().url().optional(),
			description: z.string().optional(),
			bill: z.string().url().optional(),
			liabilities_over_one_year_category: z.string().url().optional(),
			liabilities_under_one_year_category: z.string().url().optional(),
		})
		.passthrough();
	const HirePurchaseListInput = z
		.object({ query: PageQuery.optional() })
		.strict();
	const HirePurchaseListData = z
		.object({ hire_purchases: z.array(HirePurchase) })
		.passthrough();
	const HirePurchaseListOutput = HirePurchaseListData.extend({
		pagination: Pagination,
	}).passthrough();
	const HirePurchaseGetOutput = z
		.object({ hire_purchase: HirePurchase })
		.passthrough();

	const Property = z
		.object({
			url: z.string().url().optional(),
			address1: z.string().optional(),
			address2: z.string().nullable().optional(),
			address3: z.string().nullable().optional(),
			town: z.string().nullable().optional(),
			region: z.string().nullable().optional(),
			postcode: z.string().nullable().optional(),
			country: z.string().optional(),
		})
		.passthrough();
	const PropertyInput = z
		.object({
			address1: z.string().min(1).optional(),
			address2: z.string().nullable().optional(),
			address3: z.string().nullable().optional(),
			town: z.string().nullable().optional(),
			region: z.string().nullable().optional(),
			postcode: z.string().nullable().optional(),
		})
		.strict();
	const PropertyCreateInput = z
		.object({ property: PropertyInput.extend({ address1: z.string().min(1) }) })
		.strict();
	const PropertyUpdateInput = z
		.object({ id: z.string().min(1), property: PropertyInput })
		.strict();
	const PropertyDeleteInput = z.object({ id: z.string().min(1) }).strict();
	const PropertyListInput = z.object({ query: PageQuery.optional() }).strict();
	const PropertyListData = z
		.object({ properties: z.array(Property) })
		.passthrough();
	const PropertyListOutput = PropertyListData.extend({
		pagination: Pagination,
	}).passthrough();
	const PropertyOutput = z.object({ property: Property }).passthrough();

	const StockItem = z
		.object({
			url: z.string().url().optional(),
			description: z.string().optional(),
			opening_quantity: Decimal.optional(),
			opening_balance: Decimal.optional(),
			cost_of_sale_category: z.string().url().optional(),
			stock_on_hand: Decimal.optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough();
	const StockItemListInput = z
		.object({
			query: PageQuery.extend({
				sort: z
					.enum([
						'created_at',
						'-created_at',
						'description',
						'-description',
						'updated_at',
						'-updated_at',
					])
					.optional(),
			}).optional(),
		})
		.strict();
	const StockItemListData = z
		.object({ stock_items: z.array(StockItem) })
		.passthrough();
	const StockItemListOutput = StockItemListData.extend({
		pagination: Pagination,
	}).passthrough();

	const CapitalAssetTypes = {
		list: defineOperation(
			CapitalAssetTypeListInput,
			CapitalAssetTypeListOutput,
			{
				method: 'GET',
				path: () => '/v2/capital_asset_types',
				query: (input) => input.query ?? {},
				paginated: {
					data: CapitalAssetTypeListData,
					combine: (data, pagination) => ({ ...data, pagination }),
				},
			},
		),
		get: defineOperation(CapitalAssetTypeInputById, CapitalAssetTypeOutput, {
			method: 'GET',
			path: (input) =>
				`/v2/capital_asset_types/${encodeURIComponent(input.id)}`,
		}),
		create: defineOperation(
			CapitalAssetTypeCreateInput,
			CapitalAssetTypeOutput,
			{
				method: 'POST',
				path: () => '/v2/capital_asset_types',
				body: (input) => ({ capital_asset_type: input.capital_asset_type }),
			},
		),
		update: defineOperation(
			CapitalAssetTypeUpdateInput,
			CapitalAssetTypeOutput,
			{
				method: 'PUT',
				path: (input) =>
					`/v2/capital_asset_types/${encodeURIComponent(input.id)}`,
				body: (input) => ({ capital_asset_type: input.capital_asset_type }),
			},
		),
		delete: defineOperation(CapitalAssetTypeInputById, CapitalAssetTypeOutput, {
			method: 'DELETE',
			path: (input) =>
				`/v2/capital_asset_types/${encodeURIComponent(input.id)}`,
		}),
	};
	const CapitalAssets = {
		list: defineOperation(CapitalAssetListInput, CapitalAssetListOutput, {
			method: 'GET',
			path: () => '/v2/capital_assets',
			query: (input) => input.query ?? {},
			paginated: {
				data: CapitalAssetListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(CapitalAssetGetInput, CapitalAssetOutput, {
			method: 'GET',
			path: (input) => `/v2/capital_assets/${encodeURIComponent(input.id)}`,
			query: (input) => input.query ?? {},
		}),
	};
	const HirePurchases = {
		list: defineOperation(HirePurchaseListInput, HirePurchaseListOutput, {
			method: 'GET',
			path: () => '/v2/hire_purchases',
			query: (input) => input.query ?? {},
			paginated: {
				data: HirePurchaseListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			HirePurchaseGetOutput,
			{
				method: 'GET',
				path: (input) => `/v2/hire_purchases/${encodeURIComponent(input.id)}`,
			},
		),
	};
	const Properties = {
		list: defineOperation(PropertyListInput, PropertyListOutput, {
			method: 'GET',
			path: () => '/v2/properties',
			query: (input) => input.query ?? {},
			paginated: {
				data: PropertyListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			PropertyOutput,
			{
				method: 'GET',
				path: (input) => `/v2/properties/${encodeURIComponent(input.id)}`,
			},
		),
		create: defineOperation(PropertyCreateInput, PropertyOutput, {
			method: 'POST',
			path: () => '/v2/properties',
			body: (input) => ({ property: input.property }),
		}),
		update: defineOperation(PropertyUpdateInput, PropertyOutput, {
			method: 'PUT',
			path: (input) => `/v2/properties/${encodeURIComponent(input.id)}`,
			body: (input) => ({ property: input.property }),
		}),
		delete: defineOperation(PropertyDeleteInput, EmptyResponse, {
			method: 'DELETE',
			path: (input) => `/v2/properties/${encodeURIComponent(input.id)}`,
		}),
	};
	const StockItems = {
		list: defineOperation(StockItemListInput, StockItemListOutput, {
			method: 'GET',
			path: () => '/v2/stock_items',
			query: (input) => input.query ?? {},
			paginated: {
				data: StockItemListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(
			z.object({ id: z.string().min(1) }).strict(),
			z.object({ stock_item: StockItem }).passthrough(),
			{
				method: 'GET',
				path: (input) => `/v2/stock_items/${encodeURIComponent(input.id)}`,
			},
		),
	};

	const AssetEndpoints = {
		capitalAssetTypes: CapitalAssetTypes,
		capitalAssets: CapitalAssets,
		hirePurchases: HirePurchases,
		properties: Properties,
		stockItems: StockItems,
	} as const;

	const AssetEndpointSchemas = {
		'capitalAssetTypes.list': {
			input: CapitalAssetTypeListInput,
			output: CapitalAssetTypeListOutput,
		},
		'capitalAssetTypes.get': {
			input: CapitalAssetTypeInputById,
			output: CapitalAssetTypeOutput,
		},
		'capitalAssetTypes.create': {
			input: CapitalAssetTypeCreateInput,
			output: CapitalAssetTypeOutput,
		},
		'capitalAssetTypes.update': {
			input: CapitalAssetTypeUpdateInput,
			output: CapitalAssetTypeOutput,
		},
		'capitalAssetTypes.delete': {
			input: CapitalAssetTypeInputById,
			output: CapitalAssetTypeOutput,
		},
		'capitalAssets.list': {
			input: CapitalAssetListInput,
			output: CapitalAssetListOutput,
		},
		'capitalAssets.get': {
			input: CapitalAssetGetInput,
			output: CapitalAssetOutput,
		},
		'hirePurchases.list': {
			input: HirePurchaseListInput,
			output: HirePurchaseListOutput,
		},
		'hirePurchases.get': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: HirePurchaseGetOutput,
		},
		'properties.list': { input: PropertyListInput, output: PropertyListOutput },
		'properties.get': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: PropertyOutput,
		},
		'properties.create': { input: PropertyCreateInput, output: PropertyOutput },
		'properties.update': { input: PropertyUpdateInput, output: PropertyOutput },
		'properties.delete': { input: PropertyDeleteInput, output: EmptyResponse },
		'stockItems.list': {
			input: StockItemListInput,
			output: StockItemListOutput,
		},
		'stockItems.get': {
			input: z.object({ id: z.string().min(1) }).strict(),
			output: z.object({ stock_item: StockItem }).passthrough(),
		},
	} as const;
	return { AssetEndpoints, AssetEndpointSchemas };
}

export const AssetEndpointMeta = {
	'capitalAssetTypes.list': {
		riskLevel: 'read',
		description: 'List system and custom capital asset types',
	},
	'capitalAssetTypes.get': {
		riskLevel: 'read',
		description: 'Get a capital asset type',
	},
	'capitalAssetTypes.create': {
		riskLevel: 'write',
		description: 'Create a custom capital asset type',
	},
	'capitalAssetTypes.update': {
		riskLevel: 'write',
		description: 'Update an unused custom capital asset type',
	},
	'capitalAssetTypes.delete': {
		riskLevel: 'destructive',
		description: 'Delete an unused custom capital asset type',
	},
	'capitalAssets.list': {
		riskLevel: 'read',
		description: 'List capital assets with optional history and status filters',
	},
	'capitalAssets.get': {
		riskLevel: 'read',
		description: 'Get a capital asset with optional lifecycle history',
	},
	'hirePurchases.list': {
		riskLevel: 'read',
		description: 'List hire purchases linked to company bills',
	},
	'hirePurchases.get': {
		riskLevel: 'read',
		description: 'Get a hire purchase linked to a bill',
	},
	'properties.list': {
		riskLevel: 'read',
		description: 'List properties for an unincorporated landlord company',
	},
	'properties.get': {
		riskLevel: 'read',
		description: 'Get a company property',
	},
	'properties.create': {
		riskLevel: 'write',
		description: 'Create a property for an eligible landlord company',
	},
	'properties.update': {
		riskLevel: 'write',
		description: 'Update a property for an eligible landlord company',
	},
	'properties.delete': {
		riskLevel: 'destructive',
		description: 'Delete a company property',
	},
	'stockItems.list': {
		riskLevel: 'read',
		description: 'List stock items with documented sorting and pagination',
	},
	'stockItems.get': { riskLevel: 'read', description: 'Get a stock item' },
} as const;

const lazy = lazyModule(build, AssetEndpointMeta);
export const AssetEndpoints = lazy.endpoints((module) => module.AssetEndpoints);
export const AssetEndpointSchemas = lazy.schemas(
	(module) => module.AssetEndpointSchemas,
);
