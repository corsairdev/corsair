import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	accumulated_dep_value: {
		description: 'Accumulated depreciation value of the fixed asset',
		type: 'number',
	},
	accumulated_value: {
		description: 'Accumulated value of the fixed asset',
		type: 'number',
	},
	'add-comment-request': {
		type: 'object',
		properties: {
			description: {
				type: 'string',
				description:
					'It displays the description of the comment added for the fixed asset',
			},
		},
	},
	'add-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comment: {
				type: 'object',
				properties: {
					comment_id: { $ref: '#/components/schemas/comment_id' },
					description: { $ref: '#/components/schemas/description' },
					commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
					commented_by: { $ref: '#/components/schemas/commented_by' },
					comment_type: { $ref: '#/components/schemas/comment_type' },
					date: { $ref: '#/components/schemas/date' },
					date_description: { $ref: '#/components/schemas/date_description' },
					time: { $ref: '#/components/schemas/time' },
					operation_type: { $ref: '#/components/schemas/operation_type' },
				},
			},
		},
	},
	asset_account_id: {
		description: 'Enter the account id to track the fixed asset.',
		type: 'string',
	},
	asset_account_name: {
		description: 'Name of the asset account',
		type: 'string',
	},
	asset_cost: {
		description: 'Enter the purchase cost of the asset',
		type: 'number',
		format: 'double',
	},
	asset_forcast: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				valuation_date: { $ref: '#/components/schemas/valuation_date' },
				depreciated_value: { $ref: '#/components/schemas/depreciated_value' },
				current_value: { $ref: '#/components/schemas/current_value' },
				accumulated_value: { $ref: '#/components/schemas/accumulated_value' },
			},
		},
	},
	asset_history: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				valuation_id: { $ref: '#/components/schemas/valuation_id' },
				description: { $ref: '#/components/schemas/description' },
				valuation_date: { $ref: '#/components/schemas/valuation_date' },
				depreciated_value: { $ref: '#/components/schemas/depreciated_value' },
				current_value: { $ref: '#/components/schemas/current_value' },
				accumulated_value: { $ref: '#/components/schemas/accumulated_value' },
				type: { $ref: '#/components/schemas/type' },
				is_journal_posted: { $ref: '#/components/schemas/is_journal_posted' },
			},
		},
	},
	asset_name: {
		description: 'Enter the name of the fixed asset.',
		type: 'string',
	},
	asset_number: { description: 'Number of the fixed asset', type: 'string' },
	asset_number_prefix: {
		description: 'Prefix of the asset number',
		type: 'string',
	},
	asset_number_suffix: {
		description: 'Suffix of the asset number',
		type: 'integer',
	},
	asset_purchase_date: {
		description: 'Enter the Purchase date of the asset',
		type: 'string',
	},
	associated_transactions: {
		description: 'Associated transactions of the fixed asset',
		type: 'array',
		items: { type: 'object' },
	},
	comment_id: { description: 'ID of the comment', type: 'string' },
	comment_type: { description: 'Type of the comment', type: 'string' },
	commented_by: {
		description: 'Name of the person who commented',
		type: 'string',
	},
	commented_by_id: {
		description: 'ID of the person who commented',
		type: 'string',
	},
	comments: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				comment_id: { $ref: '#/components/schemas/comment_id' },
				description: { $ref: '#/components/schemas/description' },
				commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
				commented_by: { $ref: '#/components/schemas/commented_by' },
				comment_type: { $ref: '#/components/schemas/comment_type' },
				date: { $ref: '#/components/schemas/date' },
				date_description: { $ref: '#/components/schemas/date_description' },
				time: { $ref: '#/components/schemas/time' },
				operation_type: { $ref: '#/components/schemas/operation_type' },
			},
		},
	},
	computation_type: {
		description:
			'Enter the computation types of assets. The available types are: <code>prorata_basis</code> and <code>no_prorata</code>',
		type: 'string',
	},
	'create-a-fixed-asset-request': {
		type: 'object',
		required: [
			'asset_name',
			'fixed_asset_type_id',
			'asset_account_id',
			'asset_cost',
			'asset_purchase_date',
		],
		properties: {
			asset_name: { $ref: '#/components/schemas/asset_name' },
			fixed_asset_type_id: { $ref: '#/components/schemas/fixed_asset_type_id' },
			asset_account_id: { $ref: '#/components/schemas/asset_account_id' },
			expense_account_id: { $ref: '#/components/schemas/expense_account_id' },
			depreciation_account_id: {
				$ref: '#/components/schemas/depreciation_account_id',
			},
			depreciation_method: { $ref: '#/components/schemas/depreciation_method' },
			depreciation_frequency: {
				$ref: '#/components/schemas/depreciation_frequency',
			},
			depreciation_percentage: {
				$ref: '#/components/schemas/depreciation_percentage',
			},
			total_life: { $ref: '#/components/schemas/total_life' },
			salvage_value: { $ref: '#/components/schemas/salvage_value' },
			depreciation_start_date: {
				$ref: '#/components/schemas/depreciation_start_date',
			},
			description: { $ref: '#/components/schemas/description' },
			asset_cost: { $ref: '#/components/schemas/asset_cost' },
			computation_type: { $ref: '#/components/schemas/computation_type' },
			warranty_expiry_date: {
				$ref: '#/components/schemas/warranty_expiry_date',
			},
			asset_purchase_date: { $ref: '#/components/schemas/asset_purchase_date' },
			serial_no: { $ref: '#/components/schemas/serial_no' },
			dep_start_value: { $ref: '#/components/schemas/dep_start_value' },
			notes: { $ref: '#/components/schemas/notes' },
			tags: { $ref: '#/components/schemas/tags' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'create-a-fixed-asset-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			fixed_asset: { $ref: '#/components/schemas/fixed_asset' },
		},
	},
	'create-a-fixed-asset-type-request': {
		required: [
			'fixed_asset_type_name',
			'expense_account_id',
			'depreciation_account_id',
			'depreciation_method',
			'depreciation_frequency',
			'depreciation_percentage',
			'total_life',
			'computation_type',
		],
		type: 'object',
		properties: {
			fixed_asset_type_name: {
				$ref: '#/components/schemas/fixed_asset_type_name',
			},
			expense_account_id: { $ref: '#/components/schemas/expense_account_id' },
			depreciation_account_id: {
				$ref: '#/components/schemas/depreciation_account_id',
			},
			depreciation_method: { $ref: '#/components/schemas/depreciation_method' },
			depreciation_frequency: {
				$ref: '#/components/schemas/depreciation_frequency',
			},
			depreciation_percentage: {
				$ref: '#/components/schemas/depreciation_percentage',
			},
			total_life: { $ref: '#/components/schemas/total_life' },
			computation_type: { $ref: '#/components/schemas/computation_type' },
		},
	},
	'create-a-fixed-asset-type-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			fixed_asset_type: { $ref: '#/components/schemas/fixed_asset_type' },
		},
	},
	current_asset_value: {
		description: 'Current value of the fixed asset',
		type: 'number',
	},
	current_value: {
		description: 'Current value of the fixed asset',
		type: 'number',
	},
	custom_fields: {
		description: 'Custom fields for the fixed asset.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				customfield_id: { $ref: '#/components/schemas/customfield_id' },
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	customfield_id: { description: 'ID of the Custom Field', type: 'string' },
	date: { description: 'Date of the comment', type: 'string' },
	date_description: { description: 'Description of the date', type: 'string' },
	'delete-a-fixed-asset-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-a-fixed-asset-type-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-comment-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	dep_start_value: {
		description: 'Enter the value from which depreciation will be calculated.',
		type: 'number',
		format: 'double',
	},
	depreciated_value: {
		description: 'Depreciated value of the fixed asset',
		type: 'number',
	},
	depreciation_account_id: {
		description:
			"Enter the account id to track the asset's depreciation over time.",
		type: 'string',
	},
	depreciation_account_name: {
		description: 'Name of the depreciation account',
		type: 'string',
	},
	depreciation_frequency: {
		description:
			'Enter the frequency of depreciation. The available frequencies are: <code>yearly</code> and <code>monthly</code>',
		type: 'string',
	},
	depreciation_method: {
		description:
			'Enter the depreciation method for your asset.The available methods are: <code>declining_method</code> and <code>straight_line</code>. <br/><b>For US and GLobal Edition:</b> <code>declining_method</code>, <code>straight_line</code>, <code>200_declining_method</code> and <code>150_declining_method</code>',
		type: 'string',
	},
	depreciation_percentage: {
		description:
			'Enter the depreciation percentage only if the entered depreciation method is a declining method. The entered percentage should be within the range of 0 to 100',
		type: 'number',
		format: 'double',
	},
	depreciation_start_date: {
		description: 'Enter the depreciation start date of the asset',
		type: 'string',
	},
	description: { description: 'Description of the asset', type: 'string' },
	expense_account_id: {
		description:
			"Enter the account id to track the expenses associated with the asset's depreciation.The available account types are <b>Expense</b>  and <b>Other Expense</b>",
		type: 'string',
	},
	expense_account_name: {
		description: 'Name of the expense account',
		type: 'string',
	},
	fixed_asset: {
		type: 'object',
		properties: {
			fixed_asset_id: { $ref: '#/components/schemas/fixed_asset_id' },
			asset_name: { $ref: '#/components/schemas/asset_name' },
			status: { $ref: '#/components/schemas/status' },
			asset_number: { $ref: '#/components/schemas/asset_number' },
			asset_number_prefix: { $ref: '#/components/schemas/asset_number_prefix' },
			asset_number_suffix: { $ref: '#/components/schemas/asset_number_suffix' },
			description: { $ref: '#/components/schemas/description' },
			total_life: { $ref: '#/components/schemas/total_life' },
			fixed_asset_type_id: { $ref: '#/components/schemas/fixed_asset_type_id' },
			fixed_asset_type_name: {
				$ref: '#/components/schemas/fixed_asset_type_name',
			},
			depreciation_method: { $ref: '#/components/schemas/depreciation_method' },
			depreciation_percentage: {
				$ref: '#/components/schemas/depreciation_percentage',
			},
			depreciation_frequency: {
				$ref: '#/components/schemas/depreciation_frequency',
			},
			asset_cost: { $ref: '#/components/schemas/asset_cost' },
			dep_start_value: { $ref: '#/components/schemas/dep_start_value' },
			salvage_value: { $ref: '#/components/schemas/salvage_value' },
			asset_purchase_date: { $ref: '#/components/schemas/asset_purchase_date' },
			current_asset_value: { $ref: '#/components/schemas/current_asset_value' },
			accumulated_dep_value: {
				$ref: '#/components/schemas/accumulated_dep_value',
			},
			serial_no: { $ref: '#/components/schemas/serial_no' },
			depreciation_start_date: {
				$ref: '#/components/schemas/depreciation_start_date',
			},
			last_depreciation_date: {
				$ref: '#/components/schemas/last_depreciation_date',
			},
			asset_account_id: { $ref: '#/components/schemas/asset_account_id' },
			asset_account_name: { $ref: '#/components/schemas/asset_account_name' },
			expense_account_id: { $ref: '#/components/schemas/expense_account_id' },
			expense_account_name: {
				$ref: '#/components/schemas/expense_account_name',
			},
			depreciation_account_id: {
				$ref: '#/components/schemas/depreciation_account_id',
			},
			depreciation_account_name: {
				$ref: '#/components/schemas/depreciation_account_name',
			},
			computation_type: { $ref: '#/components/schemas/computation_type' },
			warranty_expiry_date: {
				$ref: '#/components/schemas/warranty_expiry_date',
			},
			notes: { $ref: '#/components/schemas/notes' },
			tags: { $ref: '#/components/schemas/tags_response' },
			associated_transactions: {
				$ref: '#/components/schemas/associated_transactions',
			},
			comments: { $ref: '#/components/schemas/comments' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	fixed_asset_id: { description: 'ID of the fixed asset', type: 'string' },
	fixed_asset_type: {
		type: 'object',
		properties: {
			fixed_asset_type_id: { $ref: '#/components/schemas/fixed_asset_type_id' },
			fixed_asset_type_name: {
				$ref: '#/components/schemas/fixed_asset_type_name',
			},
			expense_account_id: { $ref: '#/components/schemas/expense_account_id' },
			expense_account_name: {
				$ref: '#/components/schemas/expense_account_name',
			},
			depreciation_account_id: {
				$ref: '#/components/schemas/depreciation_account_id',
			},
			depreciation_account_name: {
				$ref: '#/components/schemas/depreciation_account_name',
			},
			depreciation_method: { $ref: '#/components/schemas/depreciation_method' },
			depreciation_percentage: {
				$ref: '#/components/schemas/depreciation_percentage',
			},
			total_life: { $ref: '#/components/schemas/total_life' },
			depreciation_frequency: {
				$ref: '#/components/schemas/depreciation_frequency',
			},
			computation_type: { $ref: '#/components/schemas/computation_type' },
		},
	},
	fixed_asset_type_id: {
		description:
			'Associate the fixed asset with a fixed asset type by specifying fixed asset type id.',
		type: 'string',
	},
	fixed_asset_type_name: {
		description: 'Enter the name of fixed asset type',
		type: 'string',
	},
	'get-fixed-asset-forecast-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			data: { $ref: '#/components/schemas/asset_forcast' },
		},
	},
	'get-fixed-asset-history-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			asset_history: { $ref: '#/components/schemas/asset_history' },
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	'get-fixed-asset-list-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			fixedassets: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						fixed_asset_id: { $ref: '#/components/schemas/fixed_asset_id' },
						asset_number: { $ref: '#/components/schemas/asset_number' },
						asset_name: { $ref: '#/components/schemas/asset_name' },
						status: { $ref: '#/components/schemas/status' },
						current_asset_value: {
							$ref: '#/components/schemas/current_asset_value',
						},
						asset_cost: { $ref: '#/components/schemas/asset_cost' },
						fixed_asset_type_name: {
							$ref: '#/components/schemas/fixed_asset_type_name',
						},
					},
				},
			},
		},
	},
	'get-fixed-asset-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			'fissed-asset': { $ref: '#/components/schemas/fixed_asset' },
		},
	},
	'get-fixed-asset-type-list-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			fixed_asset_types: {
				type: 'array',
				items: { $ref: '#/components/schemas/fixed_asset_type' },
			},
		},
	},
	has_more_page: { type: 'boolean' },
	is_journal_posted: {
		description: 'Whether the journal is posted or not',
		type: 'boolean',
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	last_depreciation_date: {
		description: 'Last depreciation date of the fixed asset',
		type: 'string',
	},
	line_item_id: {
		type: 'string',
		description:
			'Enter the line item id that is associated with the fixed asset account.',
	},
	notes: {
		description: 'Provide notes for the asset, if required',
		type: 'string',
	},
	operation_type: {
		description: 'Type of Operation that caused the comment',
		type: 'string',
	},
	page: { type: 'integer' },
	page_context: {
		type: 'object',
		properties: {
			page: { $ref: '#/components/schemas/page' },
			per_page: { $ref: '#/components/schemas/per_page' },
			has_more_page: { $ref: '#/components/schemas/has_more_page' },
		},
	},
	per_page: { type: 'integer' },
	salvage_value: {
		description:
			"Enter the remaining amount of the asset after its useful life or the value after it's fully depreciated",
		type: 'string',
		format: 'double',
	},
	'sell-fixed-asset-request': {
		required: ['invoice_id', 'line_item_id', 'reason', 'expense_account_id'],
		type: 'object',
		properties: {
			expense_account_id: { $ref: '#/components/schemas/expense_account_id' },
			invoice_id: {
				type: 'string',
				description:
					'Enter the invoice id associated with selling the fixed asset.',
			},
			line_item_id: { $ref: '#/components/schemas/line_item_id' },
			reason: {
				type: 'string',
				description: 'Enter the reason for selling the fixed asset',
			},
		},
	},
	'sell-fixed-asset-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	serial_no: { description: 'serial number of the asset', type: 'string' },
	status: { description: 'Status of the fixed asset', type: 'string' },
	tag_id: { description: "Tag's ID", type: 'string' },
	tag_name: { description: "Tag's Name", type: 'string' },
	tag_option_id: { description: "Tag Option's ID", type: 'string' },
	tag_option_name: { description: "Tag Option's Name", type: 'string' },
	tags: {
		description:
			'Reporting tags help organize and filter data across reports and enable detailed business intelligence analysis.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tag_id: { $ref: '#/components/schemas/tag_id' },
				tag_option_id: { $ref: '#/components/schemas/tag_option_id' },
			},
		},
	},
	tags_response: {
		description:
			'Reporting tags help organize and filter data across reports and enable detailed business intelligence analysis.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tag_id: { $ref: '#/components/schemas/tag_id' },
				tag_name: { $ref: '#/components/schemas/tag_name' },
				tag_option_id: { $ref: '#/components/schemas/tag_option_id' },
				tag_option_name: { $ref: '#/components/schemas/tag_option_name' },
				is_tag_mandatory: { $ref: '#/components/schemas/is_tag_mandatory' },
			},
		},
	},
	time: { description: 'Time of the comment', type: 'string' },
	total_life: {
		description: 'Enter the total life of the asset (in months)',
		type: 'number',
	},
	type: { description: 'Type of this entry', type: 'string' },
	'update-a-fixed-asset-request': {
		type: 'object',
		required: [
			'asset_name',
			'fixed_asset_type_id',
			'asset_account_id',
			'asset_cost',
			'asset_purchase_date',
		],
		properties: {
			asset_name: { $ref: '#/components/schemas/asset_name' },
			fixed_asset_type_id: { $ref: '#/components/schemas/fixed_asset_type_id' },
			asset_account_id: { $ref: '#/components/schemas/asset_account_id' },
			expense_account_id: { $ref: '#/components/schemas/expense_account_id' },
			depreciation_account_id: {
				$ref: '#/components/schemas/depreciation_account_id',
			},
			depreciation_method: { $ref: '#/components/schemas/depreciation_method' },
			depreciation_frequency: {
				$ref: '#/components/schemas/depreciation_frequency',
			},
			depreciation_percentage: {
				$ref: '#/components/schemas/depreciation_percentage',
			},
			total_life: { $ref: '#/components/schemas/total_life' },
			salvage_value: { $ref: '#/components/schemas/salvage_value' },
			depreciation_start_date: {
				$ref: '#/components/schemas/depreciation_start_date',
			},
			description: { $ref: '#/components/schemas/description' },
			asset_cost: { $ref: '#/components/schemas/asset_cost' },
			computation_type: { $ref: '#/components/schemas/computation_type' },
			warranty_expiry_date: {
				$ref: '#/components/schemas/warranty_expiry_date',
			},
			asset_purchase_date: { $ref: '#/components/schemas/asset_purchase_date' },
			serial_no: { $ref: '#/components/schemas/serial_no' },
			dep_start_value: { $ref: '#/components/schemas/dep_start_value' },
			notes: { $ref: '#/components/schemas/notes' },
			tags: { $ref: '#/components/schemas/tags' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
		},
	},
	'update-a-fixed-asset-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			fixed_asset: { $ref: '#/components/schemas/fixed_asset' },
		},
	},
	'update-a-fixed-asset-type-request': {
		required: [
			'fixed_asset_type_name',
			'expense_account_id',
			'depreciation_account_id',
			'depreciation_method',
			'depreciation_frequency',
			'depreciation_percentage',
			'total_life',
			'computation_type',
		],
		type: 'object',
		properties: {
			fixed_asset_type_name: {
				$ref: '#/components/schemas/fixed_asset_type_name',
			},
			expense_account_id: { $ref: '#/components/schemas/expense_account_id' },
			depreciation_account_id: {
				$ref: '#/components/schemas/depreciation_account_id',
			},
			depreciation_method: { $ref: '#/components/schemas/depreciation_method' },
			depreciation_frequency: {
				$ref: '#/components/schemas/depreciation_frequency',
			},
			depreciation_percentage: {
				$ref: '#/components/schemas/depreciation_percentage',
			},
			total_life: { $ref: '#/components/schemas/total_life' },
			computation_type: { $ref: '#/components/schemas/computation_type' },
		},
	},
	'update-a-fixed-asset-type-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			fixed_asset_type: { $ref: '#/components/schemas/fixed_asset_type' },
		},
	},
	'update-fixed-asset-status': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	valuation_date: { description: 'Date of the valuation', type: 'string' },
	valuation_id: { description: 'ID of the valuation', type: 'string' },
	value: { description: 'Value of the Custom Field', type: 'string' },
	warranty_expiry_date: {
		description: 'Enter the warranty expiration date of the asset',
		type: 'string',
	},
	'write-off-fixed-asset-request': {
		required: ['date', 'expense_account_id', 'reason'],
		type: 'object',
		properties: {
			date: {
				type: 'string',
				description: 'Enter the date on which the fixed asset is written off',
			},
			expense_account_id: {
				type: 'string',
				description:
					'Enter an account id to track the expenses associated with the written-off fixed asset',
			},
			reason: {
				type: 'string',
				description: 'Enter the reason for writing off the fixed asset',
			},
		},
	},
	'write-off-fixed-asset-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_fixed_asset',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'createFixedAsset',
		method: 'POST',
		path: '/fixedassets',
		summary: 'Create a fixed asset',
		description: 'Create a fixed asset.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
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
			schema: { $ref: '#/components/schemas/create-a-fixed-asset-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-fixed-asset-response' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_fixed_assets',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'listFixedAssets',
		method: 'GET',
		path: '/fixedassets',
		summary: 'Get fixed asset list',
		description: 'fixed asset list.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter fixed asset by fixed asset status. Allowed Values: <code>Status.All</code>, <code>Status.Active</code>, <code>Status.Cancel</code>, <code>Status.FullyDepreciated</code>, <code>Status.WriteOff</code>, <code>Status.Sold</code> and <code>Status.Draft</code>',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort fixed asset list. Allowed Values: <code>asset_name</code>, <code>asset_number</code>, <code>asset_cost</code>, <code>created_time</code> and <code>current_asset_value</code>',
				schema: { type: 'string' },
			},
			{
				name: 'sort_order',
				in: 'query',
				required: false,
				description:
					'Sort fixed asset list in ascendeing or descending order. Allowed Values: <code>A</code> and <code>D</code>',
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
				description: 'Number of records to be fetched per page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/get-fixed-asset-list-response' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_fixed_asset',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'updateFixedAsset',
		method: 'PUT',
		path: '/fixedassets/{fixed_asset_id}',
		summary: 'Update a fixed asset',
		description: 'Updates the fixed asset with given information.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
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
			schema: { $ref: '#/components/schemas/update-a-fixed-asset-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-fixed-asset-response' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_fixed_asset',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'getFixedAsset',
		method: 'GET',
		path: '/fixedassets/{fixed_asset_id}',
		summary: 'Get fixed asset',
		description: 'Get the details of the fixed asset.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
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
				schema: { $ref: '#/components/schemas/get-fixed-asset-response' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_fixed_asset',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'deleteFixedAsset',
		method: 'DELETE',
		path: '/fixedassets/{fixed_asset_id}',
		summary: 'Delete a fixed asset',
		description: 'Deletes the given fixed asset.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
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
				schema: { $ref: '#/components/schemas/delete-a-fixed-asset-response' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_fixed_asset_history',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'getFixedAssetHistory',
		method: 'GET',
		path: '/fixedassets/{fixed_asset_id}/history',
		summary: 'Get fixed asset history',
		description:
			'It displays a detailed summary of the asset from acquisition till write off.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
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
				description: 'Number of records to be fetched per page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-fixed-asset-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.fixedasset.READ'],
		riskLevel: 'read',
	},
	{
		id: 'get_fixed_asset_forecast',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'getFixedAssetForecast',
		method: 'GET',
		path: '/fixedassets/{fixed_asset_id}/forecast',
		summary: "Get fixed asset's forecast depreciation",
		description:
			"It displays a detailed summary of the asset's future depreciation rates.",
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
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
					$ref: '#/components/schemas/get-fixed-asset-forecast-response',
				},
			},
		],
		scopes: ['ZohoBooks.fixedasset.READ'],
		riskLevel: 'read',
	},
	{
		id: 'mark_fixed_asset_active',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'markFixedAssetActive',
		method: 'POST',
		path: '/fixedassets/{fixed_asset_id}/status/active',
		summary: 'Mark fixed asset as active',
		description:
			'Mark the fixed asset as active to start calculating depreciation for the asset.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
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
				schema: { $ref: '#/components/schemas/update-fixed-asset-status' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'mark_fixed_asset_cancel',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'markFixedAssetCancel',
		method: 'POST',
		path: '/fixedassets/{fixed_asset_id}/status/cancel',
		summary: 'Cancel fixed asset',
		description: 'Cancel the fixed asset.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
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
				schema: { $ref: '#/components/schemas/update-fixed-asset-status' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'mark_fixed_asset_draft',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'markFixedAssetDraft',
		method: 'POST',
		path: '/fixedassets/{fixed_asset_id}/status/draft',
		summary: 'Mark fixed asset as draft',
		description: 'Mark the fixed asset as draft.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
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
				schema: { $ref: '#/components/schemas/update-fixed-asset-status' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'write_off_fixed_asset',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'writeOffFixedAsset',
		method: 'POST',
		path: '/fixedassets/{fixed_asset_id}/writeoff',
		summary: 'Write off fixed asset',
		description: 'Write off the fixed asset.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
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
			schema: { $ref: '#/components/schemas/write-off-fixed-asset-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/write-off-fixed-asset-response' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.CREATE'],
		riskLevel: 'destructive',
	},
	{
		id: 'sell_fixed_asset',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'sellFixedAsset',
		method: 'POST',
		path: '/fixedassets/{fixed_asset_id}/sell',
		summary: 'Sell fixed asset',
		description: 'Sell the fixed asset.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
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
			schema: { $ref: '#/components/schemas/sell-fixed-asset-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/sell-fixed-asset-response' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'create_fixed_asset_comment',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'createFixedAssetComment',
		method: 'POST',
		path: '/fixedassets/{fixed_asset_id}/comments',
		summary: 'Add a comment',
		description: 'Add a comment to the fixed asset.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
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
			schema: { $ref: '#/components/schemas/add-comment-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/add-comment-response' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_fixed_asset_comment',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'deleteFixedAssetComment',
		method: 'DELETE',
		path: '/fixedassets/{fixed_asset_id}/comments/{comment_id}',
		summary: 'Delete a comment',
		description: 'Delete the comment of the fixed asset.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset.',
				schema: { type: 'string' },
			},
			{
				name: 'comment_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the comment.',
				schema: { type: 'string' },
			},
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
				schema: { $ref: '#/components/schemas/delete-comment-response' },
			},
		],
		scopes: ['ZohoBooks.fixedasset.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'create_fixed_asset_type',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'createFixedAssetType',
		method: 'POST',
		path: '/fixedassettypes',
		summary: 'Create a fixed asset type',
		description: 'Create a fixed asset type.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
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
				$ref: '#/components/schemas/create-a-fixed-asset-type-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-fixed-asset-type-response',
				},
			},
		],
		scopes: ['ZohoBooks.fixedasset.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_fixed_asset_type_list',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'getFixedAssetTypeList',
		method: 'GET',
		path: '/fixedassettypes',
		summary: 'Get fixed asset type list',
		description: 'fixed asset type list.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
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
				description: 'Number of records to be fetched per page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-fixed-asset-type-list-response',
				},
			},
		],
		scopes: ['ZohoBooks.fixedasset.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_fixed_asset_type',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'updateFixedAssetType',
		method: 'PUT',
		path: '/fixedassettypes/{fixed_asset_type_id}',
		summary: 'Update a fixed asset type',
		description: 'Updates the fixed asset type with given information.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_type_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset type.',
				schema: { type: 'string' },
			},
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
				$ref: '#/components/schemas/update-a-fixed-asset-type-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-fixed-asset-type-response',
				},
			},
		],
		scopes: ['ZohoBooks.fixedasset.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_fixed_asset_type',
		group: 'fixedAssets',
		groupSlug: 'fixed-assets',
		name: 'deleteFixedAssetType',
		method: 'DELETE',
		path: '/fixedassettypes/{fixed_asset_type_id}',
		summary: 'Delete a fixed asset type',
		description: 'Deletes the given fixed asset type.',
		docsUrl: 'https://www.zoho.com/books/api/v3/fixed-assets/',
		parameters: [
			{
				name: 'fixed_asset_type_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the fixed asset type.',
				schema: { type: 'string' },
			},
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
					$ref: '#/components/schemas/delete-a-fixed-asset-type-response',
				},
			},
		],
		scopes: ['ZohoBooks.fixedasset.DELETE'],
		riskLevel: 'destructive',
	},
];
