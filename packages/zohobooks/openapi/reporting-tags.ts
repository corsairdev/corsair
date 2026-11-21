import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	all_options_response: {
		type: 'object',
		properties: {
			code: { type: 'integer' },
			message: { type: 'string' },
			results: {
				type: 'array',
				description: 'List of all options under a reporting tag',
				items: {
					type: 'object',
					properties: {
						option_id: {
							type: 'string',
							description:
								'Option ID or <code>untagged</code> for untagged option if the show_untagged is true',
						},
						option_name: {
							type: 'string',
							description:
								"Option's name or 'Untagged' for untagged option if the show_untagged is true",
						},
						depth: { $ref: '#/components/schemas/depth' },
					},
				},
			},
		},
	},
	criteria_options: {
		description: 'Options for criteria',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				option_id: { $ref: '#/components/schemas/option_id' },
				criteria_options: {
					description: 'List containing filter tags and location',
					type: 'array',
					items: {
						type: 'object',
						properties: {
							tag_id: { $ref: '#/components/schemas/filter_tag_id' },
							type: { $ref: '#/components/schemas/filter_type' },
							options: {
								description: 'Options selected for the criteria',
								type: 'array',
								items: { $ref: '#/components/schemas/option_id' },
							},
						},
					},
				},
			},
		},
	},
	criteria_options_response_for_details_page: {
		type: 'array',
		description: 'Options selected for the criteria',
		items: {
			type: 'object',
			properties: {
				option_id: { $ref: '#/components/schemas/option_id' },
				option_name: { $ref: '#/components/schemas/option_name' },
				option_order: {
					type: 'integer',
					description: 'The order in which the options appear.',
				},
				parent_id: {
					type: 'string',
					description:
						'Parent Option ID. If the options does not have a parent, this will be empty',
				},
				parent_name: {
					type: 'string',
					description:
						'Parent Option Name. If the options does not have a parent, this will be empty',
				},
				is_active: { $ref: '#/components/schemas/option_is_active' },
				is_default: { $ref: '#/components/schemas/option_is_default' },
				criteria: {
					type: 'object',
					properties: {
						criteria_id: { type: 'string', description: 'Filter ID' },
						tag_id: { $ref: '#/components/schemas/filter_tag_id' },
						type: { $ref: '#/components/schemas/filter_type' },
						options: {
							description: 'Options selected for the criteria',
							type: 'array',
							items: { $ref: '#/components/schemas/filter_option_name' },
						},
					},
				},
				children: {
					description: 'Child options of the option',
					type: 'array',
					items: {
						type: 'object',
						properties: {
							option_id: { $ref: '#/components/schemas/option_id' },
							option_name: { $ref: '#/components/schemas/option_name' },
							option_order: {
								type: 'integer',
								description: 'The order in which the options appear.',
							},
							parent_id: {
								type: 'string',
								description:
									'Parent Option ID. If the options does not have a parent, this will be empty',
							},
							parent_name: {
								type: 'string',
								description:
									'Parent Option Name. If the options does not have a parent, this will be empty',
							},
							is_active: { $ref: '#/components/schemas/option_is_active' },
							is_default: { $ref: '#/components/schemas/option_is_default' },
							criteria: {
								type: 'object',
								properties: {
									criteria_id: { type: 'string', description: 'Filter ID' },
									tag_id: { $ref: '#/components/schemas/filter_tag_id' },
									type: { $ref: '#/components/schemas/filter_type' },
									options: {
										description: 'Options selected for the criteria',
										type: 'array',
										items: { $ref: '#/components/schemas/filter_option_id' },
									},
								},
							},
						},
					},
				},
			},
		},
	},
	criteria_tags: {
		description: 'Filter tags and location',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tag_id: { $ref: '#/components/schemas/filter_tag_id' },
				type: { $ref: '#/components/schemas/filter_type' },
			},
		},
	},
	dependent_tags: {
		type: 'array',
		description:
			'The tags and location that is associated as filter for the tag',
		items: {
			type: 'object',
			properties: {
				dependent_id: {
					type: 'string',
					description:
						"Dependent Tag's ID. If the dependent is location, value will be empty",
				},
				dependent_name: {
					type: 'string',
					description:
						"Dependent Tag's Name. If the dependent is location, value will be <code>Location</code>",
				},
				dependent_order: {
					type: 'integer',
					description:
						'The order in which the dependent tags appear. If the dependent is location, value will be empty',
				},
				dependent_type: {
					type: 'string',
					description:
						'Type of the dependent. Allowed values: Tag <code>tag</code>, Location <code>location</code>',
				},
				dependent_options: {
					description:
						'Options selected for the dependent tag. If the dependent is location, this will be empty',
					type: 'array',
					items: {
						type: 'object',
						properties: {
							dependent_option_id: {
								type: 'string',
								description: 'Dependent Option ID',
							},
							dependent_option_name: {
								type: 'string',
								description: 'Dependent Option Name',
							},
							dependent_option_order: {
								type: 'integer',
								description: 'The order in which the options appear.',
							},
						},
					},
				},
				tag_name: { $ref: '#/components/schemas/tag_name' },
			},
		},
	},
	depth: {
		description:
			'Depth or how much indentation required of the option in the hierarchy',
		type: 'integer',
	},
	description: { description: 'Description', type: 'string' },
	entities: {
		description:
			'Entities that can only be enabled or disabled which can also be called as mono-preference entities. <br><i>Note:</i>If you have Payroll joined then <code>journal</code> will be sent in this list instead of <code>multiple_preference_entities</code>',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				entity_name: {
					description:
						'Entity Name<br>Possible Values:  <br>Customer - <code>customers</code>,  <br>Vendor - <code>vendors</code>,  <br>Item - <code>items</code>,  <br>Banking - <code>banking</code> <br>Fixed Asset - <code>fixed_asset</code>',
					type: 'string',
					enum: ['customers', 'vendors', 'items', 'banking', 'fixed_asset'],
				},
				is_enabled: { description: 'Is Enabled', type: 'boolean' },
			},
		},
	},
	filter_option_id: {
		description:
			'Option ID for the filter. It can be an option ID or flags.  <br>Allowed flags: <code>all</code> - Instead of selecting all options, you can send this flag to denote all options of the filter tag or location are selected for the filter to the respective tag. <code>untagged</code> - When you want to show an option when no option is selected for the filter tag. <b>Note: This flag cannot be used for location filter.</b>',
		type: 'string',
	},
	filter_option_name: {
		description:
			'Option Name for the filter. It can be an option name or flags.  <br>Allowed flags: <code>All</code> - Instead of selecting all options, you can send this flag to denote all options of the filter tag or location are selected for the filter to the respective tag. <code>Untagged</code> - When you want to show an option when no option is selected for the filter tag. <b>Note: This flag cannot be used for location filter.</b>',
		type: 'string',
	},
	filter_tag_id: {
		type: 'string',
		description:
			"Filter tag ID. If the filter 'type' is location, <code>null</code> should be passed",
	},
	filter_type: {
		description:
			'Type of filter entity. <br>Allowed values: Tag <code>tag</code> and Location <code>location</code>. <br>',
		type: 'string',
	},
	is_class: {
		description: 'Is segmentation enabled for the tag',
		type: 'boolean',
	},
	is_draft: { description: 'Is tag still in draft state', type: 'boolean' },
	is_mandatory: { description: 'Is Mandatory', type: 'boolean' },
	'list-reporting-tags-response': {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tag_id: { $ref: '#/components/schemas/tag_id' },
				tag_name: { $ref: '#/components/schemas/tag_name' },
				tag_order: { $ref: '#/components/schemas/tag_order' },
				description: { $ref: '#/components/schemas/description' },
				is_active: { $ref: '#/components/schemas/tag_is_active' },
				is_mandatory: { $ref: '#/components/schemas/is_mandatory' },
				is_class: { $ref: '#/components/schemas/is_class' },
				is_draft: { $ref: '#/components/schemas/is_draft' },
			},
		},
	},
	'mark-default_option-response': {
		type: 'object',
		properties: { code: { type: 'integer' }, message: { type: 'string' } },
	},
	multi_preference_entities: {
		type: 'object',
		properties: {
			preference: {
				description:
					"Preference type. Currently, only <code>'transaction' and 'line_item'</code> is supported for this node",
				type: 'string',
			},
			entities: {
				description: 'Entities that can only be enabled or disabled',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						entity_name: {
							description:
								'Entity Name. Possible Values:  <br>Sales - <code>sales</code>,  <br>Purchases - <code>purchases</code>,  <br>Journal - <code>journals</code>,  <br>Inventory Adjustment - <code>inventory_adjustment</code>',
							type: 'string',
							enum: ['sales', 'purchases', 'journals', 'inventory_adjustment'],
						},
						is_enabled: { description: 'Is Enabled', type: 'boolean' },
					},
				},
			},
		},
	},
	option_id: { description: 'Option ID', type: 'string' },
	option_is_active: {
		type: 'boolean',
		description: 'Is the option active for the tag',
	},
	option_is_default: {
		type: 'boolean',
		description: 'Is the option default for the tag',
	},
	option_name: { description: 'Option Name', type: 'string' },
	options_detail_page_response: {
		type: 'object',
		properties: {
			code: { type: 'integer' },
			message: { type: 'string' },
			dependent_tags: { $ref: '#/components/schemas/dependent_tags' },
			description: { $ref: '#/components/schemas/description' },
			is_class: { $ref: '#/components/schemas/is_class' },
			is_draft: { $ref: '#/components/schemas/is_draft' },
			tag_id: { $ref: '#/components/schemas/tag_id' },
			tag_name: { $ref: '#/components/schemas/tag_name' },
			options: {
				$ref: '#/components/schemas/criteria_options_response_for_details_page',
			},
			page_context: {
				type: 'object',
				properties: {
					page: { type: 'integer' },
					per_page: { type: 'integer' },
					has_more_page: { type: 'boolean' },
				},
			},
		},
	},
	'reporting-tags-response': {
		type: 'object',
		properties: { tag: { $ref: '#/components/schemas/tag_response' } },
	},
	tag_id: { description: 'Tag ID', type: 'string' },
	tag_is_active: { type: 'boolean', description: 'Is the tag active' },
	tag_name: { description: 'Tag Name', type: 'string' },
	tag_order: {
		description: 'The order in which the tag appears',
		type: 'integer',
	},
	tag_response: {
		type: 'object',
		properties: {
			tag_id: { $ref: '#/components/schemas/tag_id' },
			tag_name: { $ref: '#/components/schemas/tag_name' },
			description: { $ref: '#/components/schemas/description' },
			is_mandatory: { $ref: '#/components/schemas/is_mandatory' },
			entities: { $ref: '#/components/schemas/entities' },
			multi_preference_entities: {
				$ref: '#/components/schemas/multi_preference_entities',
			},
		},
	},
	'update-criteria-request': {
		required: ['criteria_tags', 'options'],
		type: 'object',
		properties: {
			criteria_tags: { $ref: '#/components/schemas/criteria_tags' },
			options: { $ref: '#/components/schemas/criteria_options' },
		},
	},
	'update-criteria-response': {
		type: 'object',
		properties: { message: { type: 'string' } },
	},
	'update-options-request': {
		required: ['options'],
		type: 'object',
		properties: {
			options: {
				type: 'array',
				description: 'List of options for the reporting tag.',
				items: {
					type: 'object',
					properties: {
						option_name: { $ref: '#/components/schemas/option_name' },
						option_id: { $ref: '#/components/schemas/option_id' },
						is_active: { $ref: '#/components/schemas/option_is_active' },
						is_default: { $ref: '#/components/schemas/option_is_default' },
						children: {
							type: 'array',
							description: 'Child options of an option',
							items: {
								type: 'object',
								properties: {
									option_id: { description: 'Option ID', type: 'string' },
									option_name: { description: 'Option Name', type: 'string' },
									is_active: { $ref: '#/components/schemas/option_is_active' },
									is_default: {
										$ref: '#/components/schemas/option_is_default',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'update-options-response': {
		type: 'object',
		properties: { message: { type: 'string' } },
	},
	'update-reporting-tag-request': {
		required: ['tag_name', 'entities', 'multi_preference_entities'],
		type: 'object',
		properties: {
			tag_name: { $ref: '#/components/schemas/tag_name' },
			description: { $ref: '#/components/schemas/description' },
			is_mandatory: { $ref: '#/components/schemas/is_mandatory' },
			entities: { $ref: '#/components/schemas/entities' },
			multi_preference_entities: {
				$ref: '#/components/schemas/multi_preference_entities',
			},
		},
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'get_tags',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'getTags',
		method: 'GET',
		path: '/reportingtags',
		summary: 'List of all Reporting Tags',
		description:
			'Get a list of all reporting tags in the preferred order that you can set.',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					type: 'object',
					properties: {
						reporting_tags: {
							$ref: '#/components/schemas/list-reporting-tags-response',
						},
					},
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_tag',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'createTag',
		method: 'POST',
		path: '/reportingtags',
		summary: 'Create Reporting Tag',
		description: 'Create a reporting tag',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-reporting-tag-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/reporting-tags-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_default_option',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'markDefaultOption',
		method: 'POST',
		path: '/reportingtags/{tag_id}',
		summary: 'Mark an option as default for a reporting tag',
		description:
			'Mark an option as the default option or clear default option for a reporting tag.',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'path',
				required: true,
				description: 'ID of the reporting tag',
				schema: { type: 'string' },
			},
			{
				name: 'default_option_id',
				in: 'query',
				required: true,
				description:
					'ID of the option to be marked as default. If this parameter is not sent or sent empty, the current default option of the tag will be removed.',
				schema: { $ref: '#/components/schemas/option_id' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/mark-default_option-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'write',
	},
	{
		id: 'update_tag',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'updateTag',
		method: 'PUT',
		path: '/reportingtags/{tag_id}',
		summary: 'Update Reporting Tag',
		description: 'Update a reporting tag',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'path',
				required: true,
				description: 'ID of the reporting tag',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-reporting-tag-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/reporting-tags-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_tag',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'deleteTag',
		method: 'DELETE',
		path: '/reportingtags/{tag_id}',
		summary: 'Delete a reporting tag',
		description:
			'Delete a reporting tag. If there are any usages of the reporting tag in transactions,  custom views or workflows, you will not be able to delete the tag.',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'path',
				required: true,
				description: 'ID of the reporting tag',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { type: 'object', properties: { message: { type: 'string' } } },
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'update_tag_options',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'updateTagOptions',
		method: 'PUT',
		path: '/reportingtags/{tag_id}/options',
		summary: 'Update Reporting Tag Options',
		description:
			'Create, update or delete the options of a reporting tag. Reorder and arrange them in an hierarchical structure as per your organization requirements. <br><b>NOTE:</b> <br><ol> <li>An option cannot be a child option beyond five hierarchical level.</li> <li>The overall children of an option cannot exceed 500 options.</li></ol>',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'path',
				required: true,
				description: 'ID of the reporting tag',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-options-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-options-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_tag_criteria',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'updateTagCriteria',
		method: 'PUT',
		path: '/reportingtags/{tag_id}/criteria',
		summary: 'Update Reporting Tag - Visibility Conditions',
		description:
			'Update the visibility conditions (or filter in some places) of a reporting tag. You can set other tags or location as filters for a tag. Check our help document to know about the requirements of a tag to be associated as a filter to another tag.',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'path',
				required: true,
				description: 'ID of the reporting tag',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-criteria-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-criteria-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'active_tag',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'activeTag',
		method: 'POST',
		path: '/reportingtags/{tag_id}/active',
		summary: 'Mark Reporting Tag as active',
		description:
			'Mark a reporting tag as active so that you can use it on entities which you allowed.  A newly created tag will be in draft state. Use this to mark that tag as ready.',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'path',
				required: true,
				description: 'ID of the reporting tag',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { type: 'object', properties: { message: { type: 'string' } } },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'inactive_tag',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'inactiveTag',
		method: 'POST',
		path: '/reportingtags/{tag_id}/inactive',
		summary: 'Mark Reporting Tag as inactive',
		description: 'Mark a reporting tag as inactive.',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'path',
				required: true,
				description: 'ID of the reporting tag',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { type: 'object', properties: { message: { type: 'string' } } },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'active_tag_option',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'activeTagOption',
		method: 'POST',
		path: '/reportingtags/{tag_id}/option/{option_id}/active',
		summary: 'Mark an option as active',
		description: "Mark a reporting tag's option as active.",
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'path',
				required: true,
				description: 'ID of the reporting tag',
				schema: { type: 'string' },
			},
			{
				name: 'option_id',
				in: 'path',
				required: true,
				description: "ID of a reporting tag's option",
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { type: 'object', properties: { message: { type: 'string' } } },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'inactive_tag_option',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'inactiveTagOption',
		method: 'POST',
		path: '/reportingtags/{tag_id}/option/{option_id}/inactive',
		summary: 'Mark an option as inactive',
		description: "Mark a reporting tag's option as inactive.",
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'path',
				required: true,
				description: 'ID of the reporting tag',
				schema: { type: 'string' },
			},
			{
				name: 'option_id',
				in: 'path',
				required: true,
				description: "ID of a reporting tag's option",
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { type: 'object', properties: { message: { type: 'string' } } },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_all_tag_options',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'getAllTagOptions',
		method: 'GET',
		path: '/reportingtags/options',
		summary: 'Get Reporting Tags Options Detail Page',
		description:
			'Get the options and its criteria details of a reporting tag. For each page, you can retrieve only 200 options.',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'tag_id',
				in: 'query',
				required: true,
				description: 'ID of the reporting tag',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/options_detail_page_response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'reorder_tags',
		group: 'reportingTags',
		groupSlug: 'reporting-tags',
		name: 'reorderTags',
		method: 'PUT',
		path: '/reportingtags/reorder',
		summary: 'Reorder Reporting Tags',
		description:
			'Reorder the reporting tags in your organization. The order of tags will be followed in transactions and reports.',
		docsUrl: 'https://www.zoho.com/books/api/v3/reporting-tags/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				type: 'object',
				properties: {
					tags: {
						description: 'List of reporting tag IDs in the desired order',
						type: 'array',
						items: { $ref: '#/components/schemas/tag_id' },
					},
				},
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					type: 'object',
					properties: {
						code: { type: 'integer' },
						message: { type: 'string' },
						tags: { $ref: '#/components/schemas/list-reporting-tags-response' },
					},
				},
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
];
