import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	ancestors: {
		description: 'Ancestor categories of this category.',
		type: 'array',
		items: { $ref: '#/components/schemas/category-ref' },
	},
	applied_filter: {
		description: 'Filter applied to the list.',
		type: 'string',
	},
	'category-child': {
		type: 'object',
		properties: {
			category_id: { $ref: '#/components/schemas/category_id' },
			name: { $ref: '#/components/schemas/name' },
			url: { $ref: '#/components/schemas/url' },
			parent_category_id: { $ref: '#/components/schemas/parent_category_id' },
			visibility: { $ref: '#/components/schemas/visibility' },
			show_in_menu: { $ref: '#/components/schemas/show_in_menu' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
		},
	},
	'category-list-item': {
		type: 'object',
		properties: {
			category_id: { $ref: '#/components/schemas/category_id' },
			name: { $ref: '#/components/schemas/name' },
			description: { $ref: '#/components/schemas/description' },
			url: { $ref: '#/components/schemas/url' },
			parent_category_id: { $ref: '#/components/schemas/parent_category_id' },
			visibility: { $ref: '#/components/schemas/visibility' },
			show_in_menu: { $ref: '#/components/schemas/show_in_menu' },
			sibling_order: { $ref: '#/components/schemas/sibling_order' },
			depth: { $ref: '#/components/schemas/depth' },
			has_active_items: { $ref: '#/components/schemas/has_active_items' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			ondc_category_type: { $ref: '#/components/schemas/ondc_category_type' },
			ondc_category_type_formatted: {
				$ref: '#/components/schemas/ondc_category_type_formatted',
			},
			is_deprecated_ondc_category: {
				$ref: '#/components/schemas/is_deprecated_ondc_category',
			},
		},
	},
	'category-ref': {
		type: 'object',
		properties: {
			category_id: { $ref: '#/components/schemas/category_id' },
			name: { $ref: '#/components/schemas/name' },
			url: { $ref: '#/components/schemas/url' },
			parent_category_id: { $ref: '#/components/schemas/parent_category_id' },
			visibility: { $ref: '#/components/schemas/visibility' },
			show_in_menu: { $ref: '#/components/schemas/show_in_menu' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
		},
	},
	'category-response': {
		type: 'object',
		properties: {
			category_id: { $ref: '#/components/schemas/category_id' },
			name: { $ref: '#/components/schemas/name' },
			description: { $ref: '#/components/schemas/description' },
			url: { $ref: '#/components/schemas/url' },
			parent_category_id: { $ref: '#/components/schemas/parent_category_id' },
			parent_category_name: {
				$ref: '#/components/schemas/parent_category_name',
			},
			visibility: { $ref: '#/components/schemas/visibility' },
			show_in_menu: { $ref: '#/components/schemas/show_in_menu' },
			seo_title: { $ref: '#/components/schemas/seo_title' },
			seo_keyword: { $ref: '#/components/schemas/seo_keyword' },
			seo_description: { $ref: '#/components/schemas/seo_description' },
			category_tax_preferences: {
				$ref: '#/components/schemas/category_tax_preferences',
			},
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			ondc_category_type: { $ref: '#/components/schemas/ondc_category_type' },
			is_deprecated_ondc_category: {
				$ref: '#/components/schemas/is_deprecated_ondc_category',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			ancestors: { $ref: '#/components/schemas/ancestors' },
			children: { $ref: '#/components/schemas/children' },
			products: {
				type: 'object',
				description: 'Items associated with the category.',
			},
		},
	},
	category_id: {
		description: 'Unique identifier of the category.',
		type: 'string',
	},
	category_tax_preference: {
		type: 'object',
		properties: {
			tax_specification: { $ref: '#/components/schemas/tax_specification' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
		},
	},
	category_tax_preferences: {
		description: 'Tax preferences associated with the category.',
		type: 'array',
		items: { $ref: '#/components/schemas/category_tax_preference' },
	},
	children: {
		description: 'Child categories of this category.',
		type: 'array',
		items: { $ref: '#/components/schemas/category-child' },
	},
	'create-a-category-request': {
		type: 'object',
		required: ['name', 'url'],
		properties: {
			name: { $ref: '#/components/schemas/name' },
			url: { $ref: '#/components/schemas/url' },
			description: { $ref: '#/components/schemas/description' },
			sibling_order: { $ref: '#/components/schemas/sibling_order' },
			parent_category_id: { $ref: '#/components/schemas/parent_category_id' },
			parent_category_name: {
				description: 'Name of the parent category.',
				type: 'string',
			},
			visibility: { $ref: '#/components/schemas/visibility' },
			show_in_menu: { $ref: '#/components/schemas/show_in_menu' },
			category_tax_preferences: {
				$ref: '#/components/schemas/category_tax_preferences',
			},
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'create-a-category-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			category: { $ref: '#/components/schemas/category-response' },
		},
	},
	created_time: {
		description: 'Time at which the category was created.',
		type: 'string',
		readOnly: true,
	},
	custom_field: {
		type: 'object',
		properties: {
			index: { description: 'Index of the custom field.', type: 'integer' },
			value: { description: 'Value of the custom field.', type: 'string' },
		},
	},
	custom_fields: {
		description: 'Custom fields for the category.',
		type: 'array',
		items: { $ref: '#/components/schemas/custom_field' },
	},
	'delete-a-category-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	depth: {
		description: 'Depth of the category in the hierarchy.',
		type: 'integer',
	},
	description: {
		description: 'Description of the category. Max-length [12000].',
		type: 'string',
	},
	'get-a-category-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			category: { $ref: '#/components/schemas/category-response' },
		},
	},
	has_active_items: {
		description: 'Indicates whether the category contains active items.',
		type: 'boolean',
		readOnly: true,
	},
	has_more_page: {
		description: 'Indicates whether more pages are available.',
		type: 'boolean',
	},
	is_deprecated_ondc_category: {
		description: 'Indicates whether the ONDC category type is deprecated.',
		type: 'boolean',
		readOnly: true,
	},
	last_modified_time: {
		description: 'Time at which the category was last modified.',
		type: 'string',
		readOnly: true,
	},
	'list-categories-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			categories: {
				description: 'List of categories.',
				type: 'array',
				items: { $ref: '#/components/schemas/category-list-item' },
			},
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	name: {
		description: 'Name of the category. Max-length [100].',
		type: 'string',
	},
	ondc_category_type: { description: 'ONDC category type.', type: 'string' },
	ondc_category_type_formatted: {
		description: 'Formatted ONDC category type.',
		type: 'string',
		readOnly: true,
	},
	page: { description: 'Current page number.', type: 'integer' },
	page_context: {
		description: 'Pagination and list context for the current result set.',
		type: 'object',
		properties: {
			page: { $ref: '#/components/schemas/page' },
			per_page: { $ref: '#/components/schemas/per_page' },
			has_more_page: { $ref: '#/components/schemas/has_more_page' },
			report_name: { $ref: '#/components/schemas/report_name' },
			applied_filter: { $ref: '#/components/schemas/applied_filter' },
			sort_column: { $ref: '#/components/schemas/sort_column' },
			sort_order: { $ref: '#/components/schemas/sort_order' },
		},
	},
	parent_category_id: {
		description:
			'ID of the parent category. Use <code>-1</code> for a root-level category.',
		type: 'string',
	},
	parent_category_name: {
		description: 'Name of the parent category.',
		type: 'string',
		readOnly: true,
	},
	per_page: { description: 'Number of records per page.', type: 'integer' },
	report_name: {
		description: 'Name of the report used for the list.',
		type: 'string',
	},
	seo_description: {
		description: 'SEO description for the category. Max-length [700].',
		type: 'string',
	},
	seo_keyword: {
		description: 'SEO keywords for the category. Max-length [700].',
		type: 'string',
	},
	seo_title: {
		description: 'SEO title for the category. Max-length [100].',
		type: 'string',
	},
	show_in_menu: {
		description: 'Whether the category is shown in the menu.',
		type: 'boolean',
	},
	sibling_order: {
		description: 'Display order of the category among its siblings.',
		type: 'integer',
	},
	sort_column: { description: 'Column used for sorting.', type: 'string' },
	sort_order: {
		description:
			'Sort order. Allowed Values: <code>A</code> and <code>D</code>.',
		type: 'string',
	},
	tax_id: {
		description: 'Tax ID for the category tax preference.',
		type: 'string',
	},
	tax_specification: {
		description: 'Tax specification for the category tax preference.',
		type: 'string',
	},
	'update-a-category-request': {
		type: 'object',
		allOf: [{ $ref: '#/components/schemas/create-a-category-request' }],
	},
	'update-a-category-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			category: { $ref: '#/components/schemas/category-response' },
		},
	},
	url: {
		description: 'URL slug for the category. Max-length [100].',
		type: 'string',
	},
	visibility: {
		description: 'Whether the category is visible.',
		type: 'boolean',
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'list_categories',
		group: 'categories',
		groupSlug: 'categories',
		name: 'listCategories',
		method: 'GET',
		path: '/categories',
		summary: 'List categories',
		description:
			'List all categories with filters and pagination. Results are returned in hierarchical order when not filtered by specific category IDs.',
		docsUrl: 'https://www.zoho.com/books/api/v3/categories/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'parent_category_id',
				in: 'query',
				required: false,
				description:
					'Filter categories by parent category ID. Use <code>-1</code> for root-level categories.',
				schema: { type: 'string' },
			},
			{
				name: 'include_parent_category',
				in: 'query',
				required: false,
				description:
					'If true, the parent category is included in the results when filtering by <code>parent_category_id</code>. Default value is true.',
				schema: { type: 'boolean' },
			},
			{
				name: 'include_root_category',
				in: 'query',
				required: false,
				description:
					'If true, the root category is included in hierarchical list results. Default value is true.',
				schema: { type: 'boolean' },
			},
			{
				name: 'last_modified_time',
				in: 'query',
				required: false,
				description:
					'Return categories modified on or after this timestamp (UTC). Format: <code>yyyy-MM-ddTHH:mm:ssZ</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description: 'Search categories by text.',
				schema: { type: 'string' },
			},
			{
				name: 'category_ids',
				in: 'query',
				required: false,
				description: 'Comma-separated list of category IDs. Maximum 50 IDs.',
				schema: { type: 'string' },
			},
			{
				name: 'name',
				in: 'query',
				required: false,
				description:
					'Filter by category name. Variants: <code>name_startswith</code>, <code>name_contains</code>, <code>name_in</code>, and <code>name_not_in</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'name_startswith',
				in: 'query',
				required: false,
				description:
					'Filter categories whose name starts with the specified text.',
				schema: { type: 'string' },
			},
			{
				name: 'name_contains',
				in: 'query',
				required: false,
				description:
					'Filter categories whose name contains the specified text.',
				schema: { type: 'string' },
			},
			{
				name: 'name_in',
				in: 'query',
				required: false,
				description:
					'Filter categories whose name is in the specified comma-separated list.',
				schema: { type: 'string' },
			},
			{
				name: 'name_not_in',
				in: 'query',
				required: false,
				description:
					'Filter categories whose name is not in the specified comma-separated list.',
				schema: { type: 'string' },
			},
			{
				name: 'created_time',
				in: 'query',
				required: false,
				description:
					'Filter by creation time. Variants: <code>created_time_less_than</code>, <code>created_time_less_equals</code>, <code>created_time_greater_than</code>, and <code>created_time_greater_equals</code>. Format: <code>yyyy-MM-ddTHH:mm:ssZ</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter categories. Allowed Values: <code>All</code>, <code>ShowInMenu</code>, and <code>ActiveItems</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description: 'Page number to be fetched. Default value is 1.',
				schema: { type: 'integer', default: 1 },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description:
					'Number of records to be fetched per page. Default value is 5000.',
				schema: { type: 'integer', default: 5000 },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Column to sort by. Default value is <code>sibling_order</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_order',
				in: 'query',
				required: false,
				description:
					'Sort order. Allowed Values: <code>A</code> and <code>D</code>. Default value is <code>A</code>.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/list-categories-response' },
			},
		],
		scopes: ['ZohoBooks.categories.READ', 'ZohoBooks.items.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_category',
		group: 'categories',
		groupSlug: 'categories',
		name: 'createCategory',
		method: 'POST',
		path: '/categories',
		summary: 'Create a category',
		description: 'Create a new category.',
		docsUrl: 'https://www.zoho.com/books/api/v3/categories/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: true,
			schema: { $ref: '#/components/schemas/create-a-category-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-category-response' },
			},
		],
		scopes: ['ZohoBooks.categories.CREATE', 'ZohoBooks.items.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_category',
		group: 'categories',
		groupSlug: 'categories',
		name: 'getCategory',
		method: 'GET',
		path: '/categories/{category_id}',
		summary: 'Get a category',
		description:
			'Retrieve details of a category, including ancestors and children.',
		docsUrl: 'https://www.zoho.com/books/api/v3/categories/',
		parameters: [
			{
				name: 'category_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the category.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-a-category-response' },
			},
		],
		scopes: ['ZohoBooks.categories.READ', 'ZohoBooks.items.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_category',
		group: 'categories',
		groupSlug: 'categories',
		name: 'updateCategory',
		method: 'PUT',
		path: '/categories/{category_id}',
		summary: 'Update a category',
		description: 'Update an existing category.',
		docsUrl: 'https://www.zoho.com/books/api/v3/categories/',
		parameters: [
			{
				name: 'category_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the category.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'update_all_items',
				in: 'query',
				required: false,
				description:
					'If true, updates POS preferences of all items associated with this category.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: true,
			schema: { $ref: '#/components/schemas/update-a-category-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-category-response' },
			},
		],
		scopes: ['ZohoBooks.categories.UPDATE', 'ZohoBooks.items.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_category',
		group: 'categories',
		groupSlug: 'categories',
		name: 'deleteCategory',
		method: 'DELETE',
		path: '/categories/{category_id}',
		summary: 'Delete a category',
		description: 'Delete a category. Optionally delete its subcategories.',
		docsUrl: 'https://www.zoho.com/books/api/v3/categories/',
		parameters: [
			{
				name: 'category_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the category.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description:
					'ID of the organization. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'delete_sub_categories',
				in: 'query',
				required: false,
				description:
					'If true, deletes subcategories of the category. Allowed Values: <code>true</code> and <code>false</code>.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-a-category-response' },
			},
		],
		scopes: ['ZohoBooks.categories.DELETE', 'ZohoBooks.items.DELETE'],
		riskLevel: 'destructive',
	},
];
