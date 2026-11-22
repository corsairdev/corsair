import { z } from 'zod';
import { lazyModule } from './lazy-module';
import { defineOperation } from './operation';

// Schemas and handlers are built the first time one of these operations runs.
function build() {
	// Catalog response attributes differ by resource subtype and company tax configuration; documented variants are retained after validation.
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

	const Note = z
		.object({
			url: z.string().url().optional(),
			note: z.string(),
			parent_url: z.string().url().optional(),
			author: z.string().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough();
	const NoteParentQuery = PageQuery.extend({
		contact: z.string().url().optional(),
		project: z.string().url().optional(),
	})
		.strict()
		.superRefine((query, context) => {
			if ((query.contact === undefined) === (query.project === undefined)) {
				context.addIssue({
					code: 'custom',
					message: 'Provide exactly one of contact or project',
				});
			}
		});
	const NoteListInput = z.object({ query: NoteParentQuery }).strict();
	const NoteListData = z.object({ notes: z.array(Note) }).passthrough();
	const NoteListOutput = NoteListData.extend({
		pagination: Pagination,
	}).passthrough();
	const NoteGetInput = z.object({ id: z.string().min(1) }).strict();
	const NoteOutput = z.object({ note: Note }).passthrough();
	const NoteCreateInput = z
		.object({
			parent: z.union([
				z.object({ contact: z.string().url() }).strict(),
				z.object({ project: z.string().url() }).strict(),
			]),
			note: z.string(),
		})
		.strict();
	const NoteUpdateInput = z
		.object({ id: z.string().min(1), note: z.string() })
		.strict();

	const PriceListItem = z
		.object({
			url: z.string().url().optional(),
			code: z.string().optional(),
			quantity: Decimal.optional(),
			item_type: z.string().optional(),
			description: z.string().optional(),
			price: Decimal.optional(),
			vat_status: z.string().optional(),
			sales_tax_rate: Decimal.optional(),
			second_sales_tax_rate: Decimal.optional(),
			category: z.string().url().optional(),
			stock_item: z.string().url().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough();
	const PriceListItemInput = z
		.object({
			code: z.string().min(1).optional(),
			quantity: Decimal.optional(),
			item_type: z
				.enum([
					'Hours',
					'Days',
					'Weeks',
					'Months',
					'Years',
					'Products',
					'Services',
					'Training',
					'Expenses',
					'Comment',
					'Bills',
					'Discount',
					'Credit',
					'VAT',
					'Stock',
				])
				.optional(),
			description: z.string().optional(),
			price: Decimal.optional(),
			vat_status: z
				.enum(['out_of_scope', 'reduced', 'standard', 'zero'])
				.optional(),
			sales_tax_rate: Decimal.optional(),
			second_sales_tax_rate: Decimal.optional(),
			category: z.string().url().optional(),
			stock_item: z.string().url().optional(),
		})
		.strict();
	const PriceListItemCreateInput = z
		.object({
			price_list_item: PriceListItemInput.extend({
				code: z.string().min(1),
				quantity: Decimal,
				item_type: z.enum([
					'Hours',
					'Days',
					'Weeks',
					'Months',
					'Years',
					'Products',
					'Services',
					'Training',
					'Expenses',
					'Comment',
					'Bills',
					'Discount',
					'Credit',
					'VAT',
					'Stock',
				]),
				description: z.string(),
				price: Decimal,
			}),
		})
		.strict();
	const PriceListItemUpdateInput = z
		.object({ id: z.string().min(1), price_list_item: PriceListItemInput })
		.strict();
	const PriceListItemGetInput = z.object({ id: z.string().min(1) }).strict();
	const PriceListItemListInput = z
		.object({
			query: PageQuery.extend({
				sort: z
					.enum([
						'created_at',
						'-created_at',
						'code',
						'-code',
						'updated_at',
						'-updated_at',
					])
					.optional(),
			}).optional(),
		})
		.strict();
	const PriceListItemListData = z
		.object({ price_list_items: z.array(PriceListItem) })
		.passthrough();
	const PriceListItemListOutput = PriceListItemListData.extend({
		pagination: Pagination,
	}).passthrough();
	const PriceListItemOutput = z
		.object({ price_list_item: PriceListItem })
		.passthrough();

	const SalesTaxPeriod = z
		.object({
			url: z.string().url().optional(),
			sales_tax_name: z.string().optional(),
			sales_tax_registration_status: z
				.enum(['Not Registered', 'Registered'])
				.optional(),
			sales_tax_rate_1: Decimal.optional(),
			sales_tax_rate_2: Decimal.optional(),
			sales_tax_rate_3: Decimal.optional(),
			sales_tax_is_value_added: z.boolean().optional(),
			sales_tax_registration_number: z.string().optional(),
			effective_date: z.string().date().optional(),
			is_locked: z.boolean().optional(),
			locked_reason: z.string().optional(),
			second_sales_tax_name: z.string().optional(),
			second_sales_tax_rate_1: Decimal.optional(),
			second_sales_tax_rate_2: Decimal.optional(),
			second_sales_tax_rate_3: Decimal.optional(),
			second_sales_tax_is_compound: z.boolean().optional(),
		})
		.passthrough();
	const SalesTaxPeriodInput = z
		.object({
			sales_tax_name: z.string().min(1).optional(),
			sales_tax_registration_status: z
				.enum(['Not Registered', 'Registered'])
				.optional(),
			sales_tax_rate_1: Decimal.optional(),
			sales_tax_rate_2: Decimal.optional(),
			sales_tax_rate_3: Decimal.optional(),
			sales_tax_is_value_added: z.boolean().optional(),
			sales_tax_registration_number: z.string().optional(),
			effective_date: z.string().date().optional(),
			second_sales_tax_name: z.string().optional(),
			second_sales_tax_rate_1: Decimal.optional(),
			second_sales_tax_rate_2: Decimal.optional(),
			second_sales_tax_rate_3: Decimal.optional(),
			second_sales_tax_is_compound: z.boolean().optional(),
		})
		.strict();
	const SalesTaxPeriodCreateInput = z
		.object({
			sales_tax_period: SalesTaxPeriodInput.extend({
				sales_tax_name: z.string().min(1),
				sales_tax_registration_status: z.enum(['Not Registered', 'Registered']),
				sales_tax_rate_1: Decimal,
				sales_tax_is_value_added: z.boolean(),
				effective_date: z.string().date(),
			}),
		})
		.strict();
	const SalesTaxPeriodUpdateInput = z
		.object({ id: z.string().min(1), sales_tax_period: SalesTaxPeriodInput })
		.strict();
	const SalesTaxPeriodGetInput = z.object({ id: z.string().min(1) }).strict();
	const SalesTaxPeriodListInput = z
		.object({ query: PageQuery.optional() })
		.strict();
	const SalesTaxPeriodListData = z
		.object({ sales_tax_periods: z.array(SalesTaxPeriod) })
		.passthrough();
	const SalesTaxPeriodListOutput = SalesTaxPeriodListData.extend({
		pagination: Pagination,
	}).passthrough();
	const SalesTaxPeriodOutput = z
		.object({ sales_tax_period: SalesTaxPeriod })
		.passthrough();
	const SalesTaxRateInput = z
		.object({
			query: z
				.object({ country: z.string().min(1), date: z.string().date() })
				.strict(),
		})
		.strict();
	const SalesTaxRateOutput = z
		.object({
			sales_tax_rates: z.array(
				z.object({ percentage: Decimal, band: z.string() }).passthrough(),
			),
		})
		.passthrough();

	const Notes = {
		list: defineOperation(NoteListInput, NoteListOutput, {
			method: 'GET',
			path: () => '/v2/notes',
			query: (input) => input.query,
			paginated: {
				data: NoteListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(NoteGetInput, NoteOutput, {
			method: 'GET',
			path: (input) => `/v2/notes/${encodeURIComponent(input.id)}`,
		}),
		create: defineOperation(NoteCreateInput, NoteOutput, {
			method: 'POST',
			path: (input) => `/v2/notes`,
			query: (input) => input.parent,
			body: (input) => ({ note: { note: input.note } }),
		}),
		update: defineOperation(NoteUpdateInput, NoteOutput, {
			method: 'PUT',
			path: (input) => `/v2/notes/${encodeURIComponent(input.id)}`,
			body: (input) => ({ note: { note: input.note } }),
		}),
		delete: defineOperation(NoteGetInput, EmptyResponse, {
			method: 'DELETE',
			path: (input) => `/v2/notes/${encodeURIComponent(input.id)}`,
		}),
	};
	const PriceListItems = {
		list: defineOperation(PriceListItemListInput, PriceListItemListOutput, {
			method: 'GET',
			path: () => '/v2/price_list_items',
			query: (input) => input.query ?? {},
			paginated: {
				data: PriceListItemListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(PriceListItemGetInput, PriceListItemOutput, {
			method: 'GET',
			path: (input) => `/v2/price_list_items/${encodeURIComponent(input.id)}`,
		}),
		create: defineOperation(PriceListItemCreateInput, PriceListItemOutput, {
			method: 'POST',
			path: () => '/v2/price_list_items',
			body: (input) => ({ price_list_item: input.price_list_item }),
		}),
		update: defineOperation(PriceListItemUpdateInput, EmptyResponse, {
			method: 'PUT',
			path: (input) => `/v2/price_list_items/${encodeURIComponent(input.id)}`,
			body: (input) => ({ price_list_item: input.price_list_item }),
		}),
		delete: defineOperation(PriceListItemGetInput, EmptyResponse, {
			method: 'DELETE',
			// The docs show /v2/price_list_item/:id, which answers 404; the plural route deletes (checked on the sandbox).
			path: (input) => `/v2/price_list_items/${encodeURIComponent(input.id)}`,
		}),
	};
	const SalesTaxPeriods = {
		list: defineOperation(SalesTaxPeriodListInput, SalesTaxPeriodListOutput, {
			method: 'GET',
			path: () => '/v2/sales_tax_periods',
			query: (input) => input.query ?? {},
			paginated: {
				data: SalesTaxPeriodListData,
				combine: (data, pagination) => ({ ...data, pagination }),
			},
		}),
		get: defineOperation(SalesTaxPeriodGetInput, SalesTaxPeriodOutput, {
			method: 'GET',
			path: (input) => `/v2/sales_tax_periods/${encodeURIComponent(input.id)}`,
		}),
		create: defineOperation(SalesTaxPeriodCreateInput, SalesTaxPeriodOutput, {
			method: 'POST',
			path: () => '/v2/sales_tax_periods',
			body: (input) => ({ sales_tax_period: input.sales_tax_period }),
		}),
		update: defineOperation(SalesTaxPeriodUpdateInput, EmptyResponse, {
			method: 'PUT',
			path: (input) => `/v2/sales_tax_periods/${encodeURIComponent(input.id)}`,
			body: (input) => ({ sales_tax_period: input.sales_tax_period }),
		}),
		delete: defineOperation(SalesTaxPeriodGetInput, EmptyResponse, {
			method: 'DELETE',
			path: (input) => `/v2/sales_tax_periods/${encodeURIComponent(input.id)}`,
		}),
	};
	const SalesTax = {
		rates: defineOperation(SalesTaxRateInput, SalesTaxRateOutput, {
			method: 'GET',
			path: () => '/v2/ec_moss/sales_tax_rates',
			query: (input) => input.query,
		}),
	};

	const CatalogEndpoints = {
		notes: Notes,
		priceListItems: PriceListItems,
		salesTaxPeriods: SalesTaxPeriods,
		salesTax: SalesTax,
	} as const;

	const CatalogEndpointSchemas = {
		'notes.list': { input: NoteListInput, output: NoteListOutput },
		'notes.get': { input: NoteGetInput, output: NoteOutput },
		'notes.create': { input: NoteCreateInput, output: NoteOutput },
		'notes.update': { input: NoteUpdateInput, output: NoteOutput },
		'notes.delete': { input: NoteGetInput, output: EmptyResponse },
		'priceListItems.list': {
			input: PriceListItemListInput,
			output: PriceListItemListOutput,
		},
		'priceListItems.get': {
			input: PriceListItemGetInput,
			output: PriceListItemOutput,
		},
		'priceListItems.create': {
			input: PriceListItemCreateInput,
			output: PriceListItemOutput,
		},
		'priceListItems.update': {
			input: PriceListItemUpdateInput,
			output: EmptyResponse,
		},
		'priceListItems.delete': {
			input: PriceListItemGetInput,
			output: EmptyResponse,
		},
		'salesTaxPeriods.list': {
			input: SalesTaxPeriodListInput,
			output: SalesTaxPeriodListOutput,
		},
		'salesTaxPeriods.get': {
			input: SalesTaxPeriodGetInput,
			output: SalesTaxPeriodOutput,
		},
		'salesTaxPeriods.create': {
			input: SalesTaxPeriodCreateInput,
			output: SalesTaxPeriodOutput,
		},
		'salesTaxPeriods.update': {
			input: SalesTaxPeriodUpdateInput,
			output: EmptyResponse,
		},
		'salesTaxPeriods.delete': {
			input: SalesTaxPeriodGetInput,
			output: EmptyResponse,
		},
		'salesTax.rates': { input: SalesTaxRateInput, output: SalesTaxRateOutput },
	} as const;
	return { CatalogEndpoints, CatalogEndpointSchemas };
}

export const CatalogEndpointMeta = {
	'notes.list': {
		riskLevel: 'read',
		description: 'List notes for exactly one contact or project',
	},
	'notes.get': {
		riskLevel: 'read',
		description: 'Get a contact or project note',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Create a note for a contact or project',
	},
	'notes.update': {
		riskLevel: 'write',
		description: 'Update the content of a note',
	},
	'notes.delete': { riskLevel: 'destructive', description: 'Delete a note' },
	'priceListItems.list': {
		riskLevel: 'read',
		description: 'List price list items with documented sorting and pagination',
	},
	'priceListItems.get': {
		riskLevel: 'read',
		description: 'Get a price list item',
	},
	'priceListItems.create': {
		riskLevel: 'write',
		description: 'Create a price list item',
	},
	'priceListItems.update': {
		riskLevel: 'write',
		description: 'Update a price list item',
	},
	'priceListItems.delete': {
		riskLevel: 'destructive',
		description: 'Delete a price list item',
	},
	'salesTaxPeriods.list': {
		riskLevel: 'read',
		description: 'List sales tax periods with pagination',
	},
	'salesTaxPeriods.get': {
		riskLevel: 'read',
		description: 'Get a sales tax period',
	},
	'salesTaxPeriods.create': {
		riskLevel: 'write',
		description: 'Create a sales tax period for a US or Universal company',
	},
	'salesTaxPeriods.update': {
		riskLevel: 'write',
		description: 'Update an unlocked sales tax period',
	},
	'salesTaxPeriods.delete': {
		riskLevel: 'destructive',
		description: 'Delete an unlocked sales tax period',
	},
	'salesTax.rates': {
		riskLevel: 'read',
		description: 'List VAT MOSS rates for a country and date',
	},
} as const;

const lazy = lazyModule(build, CatalogEndpointMeta);
export const CatalogEndpoints = lazy.endpoints(
	(module) => module.CatalogEndpoints,
);
export const CatalogEndpointSchemas = lazy.schemas(
	(module) => module.CatalogEndpointSchemas,
);
