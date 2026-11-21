import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	api_name: { description: 'API name of the field', type: 'string' },
	applied_filter: { type: 'string' },
	approvers_list: { description: 'List of approvers', type: 'string' },
	'bulk-update-custom-module-request': {
		required: ['record_name'],
		type: 'object',
		additionalProperties: false,
		patternProperties: {
			'^cf_[A-Za-z0-9_]+$': {
				oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
			},
		},
		properties: {
			cf_debt_amount: { $ref: '#/components/schemas/cf_debt_amount' },
			module_record_id: { $ref: '#/components/schemas/module_record_ids' },
			record_name: { description: 'Name of the record', type: 'string' },
		},
	},
	'bulk-update-custom-module-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			module_record: { $ref: '#/components/schemas/module_record_module_put' },
		},
	},
	can_approve: {
		description: 'To get whether the record can be approved',
		type: 'boolean',
	},
	can_submit: {
		description: 'Whether the record can be submitted',
		type: 'boolean',
	},
	cf_debt_amount: { description: 'Value of the custom Field', type: 'number' },
	cf_debt_amount_formatted: {
		description: 'The formatted value of the custom Field',
		type: 'string',
	},
	comment_id: { description: 'ID of the comment', type: 'string' },
	comment_type: { description: 'Type of the comment', type: 'string' },
	commented_by: { description: 'The user who commented', type: 'string' },
	commented_by_id: {
		description: 'The user ID who added the comment',
		type: 'string',
	},
	comments: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				date: { $ref: '#/components/schemas/date' },
				commented_by: { $ref: '#/components/schemas/commented_by' },
				operation_type: { $ref: '#/components/schemas/operation_type' },
				comment_type: { $ref: '#/components/schemas/comment_type' },
				date_formatted: { $ref: '#/components/schemas/date_formatted' },
				description: { $ref: '#/components/schemas/description' },
				time: { $ref: '#/components/schemas/time' },
				comment_id: { $ref: '#/components/schemas/comment_id' },
				commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
			},
		},
	},
	'create-custom-modules-request': {
		required: ['record_name'],
		type: 'object',
		additionalProperties: false,
		patternProperties: {
			'^cf_[A-Za-z0-9_]+$': {
				oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
			},
		},
		properties: {
			record_name: { $ref: '#/components/schemas/record_name' },
			cf_debt_amount: { $ref: '#/components/schemas/cf_debt_amount' },
		},
	},
	'create-custom-modules-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			module_record: { $ref: '#/components/schemas/module_record' },
		},
	},
	'create-module-configuration-request': {
		type: 'object',
		required: ['module_name', 'plural_name'],
		properties: {
			module_name: {
				type: 'string',
				description:
					'Display name of the custom module. <code>Max-length [25]</code>',
			},
			plural_name: {
				type: 'string',
				description:
					'Plural form of the module name. <code>Max-length [30]</code>',
			},
			parent_module_id: {
				type: 'string',
				description: 'ID of the parent module, if this is a sub-module.',
			},
			record_name: {
				type: 'string',
				description:
					'Label for the record name field. <code>Max-length [30]</code>',
			},
			description: {
				type: 'string',
				description:
					'Description of the custom module. <code>Max-length [150]</code>',
			},
			shared_type: {
				type: 'string',
				description:
					'Sharing type for the module. Allowed Values: <code>private</code>, <code>read_only</code>, <code>read_write</code> and <code>public</code>.',
			},
			is_reporting_tags_supported: {
				type: 'boolean',
				description: 'Whether reporting tags are supported for this module.',
			},
			can_edit_module: {
				type: 'boolean',
				description: 'Whether records in this module can be edited.',
			},
			can_create_module: {
				type: 'boolean',
				description: 'Whether records can be created in this module.',
			},
			can_delete_module: {
				type: 'boolean',
				description: 'Whether records can be deleted from this module.',
			},
			can_bulk_update_module: {
				type: 'boolean',
				description: 'Whether bulk update is supported.',
			},
			can_send_mail: {
				type: 'boolean',
				description: 'Whether sending mail is supported from this module.',
			},
			can_bulk_send_mail: {
				type: 'boolean',
				description: 'Whether bulk mail sending is supported.',
			},
			can_attach_documents: {
				type: 'boolean',
				description: 'Whether document attachment is supported.',
			},
			can_show_pdf_view: {
				type: 'boolean',
				description: 'Whether PDF view is available.',
			},
			can_allow_pdf_print: {
				type: 'boolean',
				description: 'Whether PDF print is allowed.',
			},
			allow_forclone: {
				type: 'boolean',
				description: 'Whether cloning records is allowed.',
			},
			can_lock_record: {
				type: 'boolean',
				description: 'Whether record locking is supported.',
			},
			can_use_widget_for_custommodule: {
				type: 'boolean',
				description: 'Whether widgets can be used in this module.',
			},
			can_show_custommodule_lhs: {
				type: 'boolean',
				description:
					'Whether to show the module in the left-hand side navigation.',
			},
			show_custommodule_in: {
				type: 'array',
				description:
					'Where to show the custom module. Each item has a <code>show_in</code> value.',
				items: {
					type: 'object',
					properties: {
						show_in: {
							type: 'string',
							description:
								'Allowed Values: <code>settings</code>, <code>webui</code>, <code>extension</code> and <code>lhs</code>.',
						},
					},
				},
			},
			module_permission: {
				type: 'array',
				description: 'Role-based permissions for the module.',
				items: {
					type: 'object',
					properties: {
						role_id: { type: 'string', description: 'ID of the role.' },
						can_create: {
							type: 'boolean',
							description: 'Permission to create records.',
						},
						can_edit: {
							type: 'boolean',
							description: 'Permission to edit records.',
						},
						can_view: {
							type: 'boolean',
							description: 'Permission to view records.',
						},
						can_delete: {
							type: 'boolean',
							description: 'Permission to delete records.',
						},
						can_approve: {
							type: 'boolean',
							description: 'Permission to approve records.',
						},
						full_access: {
							type: 'boolean',
							description: 'Full access permission.',
						},
					},
				},
			},
			module_visibility: {
				type: 'array',
				description:
					'Visibility settings for the module in different contexts.',
				items: {
					type: 'object',
					properties: {
						type: { type: 'string', description: 'Context type.' },
						is_hidden: {
							type: 'boolean',
							description: 'Whether the module is hidden in this context.',
						},
					},
				},
			},
			allowed_apps: {
				type: 'array',
				description: 'List of apps where this module is available.',
				items: { type: 'string' },
			},
			default_customview_api_name: {
				type: 'string',
				description: 'API name of the default custom view for this module.',
			},
		},
	},
	'create-module-configuration-response': {
		type: 'object',
		properties: {
			code: { type: 'integer' },
			message: { type: 'string' },
			module: { $ref: '#/components/schemas/module_configuration' },
		},
	},
	created_by_id: { description: 'Created by User ID', type: 'string' },
	created_time: {
		description: 'Creation Time of the Sales Order',
		type: 'string',
	},
	created_time_formatted: {
		description: 'Formatted value of created time',
		type: 'string',
	},
	data_type: { description: 'Data Type of the Field', type: 'string' },
	data_type_formatted: {
		description: 'Formattd data type of the field',
		type: 'string',
	},
	date: { description: 'The date of the comment added', type: 'string' },
	date_formatted: { description: 'Date of the comment', type: 'string' },
	'delete-custom-modules-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-individual-records-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-module-configuration-response': {
		type: 'object',
		properties: { code: { type: 'integer' }, message: { type: 'string' } },
	},
	description: { description: 'Description of the comment', type: 'string' },
	email: { description: 'User Email', type: 'string' },
	field_id: { description: 'Field ID', type: 'string' },
	'get-individual-record-details-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			module_record: { $ref: '#/components/schemas/module_record_get' },
			module_record_hash: { $ref: '#/components/schemas/module_record_hash' },
			users: { $ref: '#/components/schemas/users' },
		},
	},
	'get-module-configuration-response': {
		type: 'object',
		properties: {
			code: { type: 'integer' },
			message: { type: 'string' },
			module: { $ref: '#/components/schemas/module_configuration' },
		},
	},
	'get-record-list-of-a-custom-module-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			module_record: { $ref: '#/components/schemas/module_record' },
			page_context: { $ref: '#/components/schemas/page_context' },
		},
	},
	has_more_page: { type: 'boolean' },
	help_text: { description: 'Help Text', type: 'string' },
	id: { description: 'User ID', type: 'number' },
	is_active: { description: 'Field is active', type: 'boolean' },
	is_current_user: {
		description: 'Is the User is current User',
		type: 'boolean',
	},
	is_mandatory: { description: 'Field is mandatory', type: 'boolean' },
	label: { description: 'Label/ Field Name', type: 'string' },
	last_modified_by_id: {
		description: 'Last modified by User ID',
		type: 'string',
	},
	last_modified_time: {
		description: 'Last Modified time of the Sales Order',
		type: 'string',
	},
	last_modified_time_formatted: {
		description: 'Formatted value of modified Time',
		type: 'string',
	},
	'list-module-configurations-response': {
		type: 'object',
		properties: {
			code: { type: 'integer' },
			message: { type: 'string' },
			modules: {
				type: 'array',
				items: { $ref: '#/components/schemas/module_configuration' },
			},
		},
	},
	max_length: { description: 'Maximum length of the field', type: 'number' },
	module_api_name: { description: 'Module API Name', type: 'string' },
	module_configuration: {
		type: 'object',
		properties: {
			module_id: {
				type: 'string',
				description: 'Unique identifier of the module.',
			},
			module_name: {
				type: 'string',
				description: 'Display name of the custom module.',
			},
			module_api_name: {
				type: 'string',
				description: 'API name of the custom module (starts with cm_).',
			},
			is_active: {
				type: 'boolean',
				description: 'Whether the module is active.',
			},
			singular_name: {
				type: 'string',
				description: 'Singular form of the module name.',
			},
			plural_name: {
				type: 'string',
				description: 'Plural form of the module name.',
			},
		},
	},
	module_fields: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				field_id: { $ref: '#/components/schemas/field_id' },
				is_active: { $ref: '#/components/schemas/is_active' },
				is_mandatory: { $ref: '#/components/schemas/is_mandatory' },
				label: { $ref: '#/components/schemas/label' },
				api_name: { $ref: '#/components/schemas/api_name' },
				data_type_formatted: {
					$ref: '#/components/schemas/data_type_formatted',
				},
				value_formatted: { $ref: '#/components/schemas/value_formatted' },
				data_type: { $ref: '#/components/schemas/data_type' },
				pii_type: { $ref: '#/components/schemas/pii_type' },
				value: { $ref: '#/components/schemas/value' },
				max_length: { $ref: '#/components/schemas/max_length' },
				help_text: { $ref: '#/components/schemas/help_text' },
			},
		},
	},
	module_name: { description: 'Name of the Module', type: 'string' },
	module_plural_name: { description: 'Module name in plural', type: 'string' },
	module_record: {
		type: 'array',
		items: { $ref: '#/components/schemas/module_record-response' },
	},
	'module_record-response': {
		type: 'object',
		properties: {
			module_record_id: { $ref: '#/components/schemas/record_id' },
			module_api_name: { $ref: '#/components/schemas/module_api_name' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			last_modified_time_formatted: {
				$ref: '#/components/schemas/last_modified_time_formatted',
			},
			created_time: { $ref: '#/components/schemas/created_time' },
			created_time_formatted: { $ref: '#/components/schemas/created_time' },
			created_by_id: { $ref: '#/components/schemas/created_time_formatted' },
			last_modified_by_id: { $ref: '#/components/schemas/last_modified_by_id' },
			record_name: { $ref: '#/components/schemas/record_name' },
			record_name_formatted: {
				$ref: '#/components/schemas/record_name_formatted',
			},
			cf_debt_amount: { $ref: '#/components/schemas/cf_debt_amount' },
			cf_debt_amount_formatted: {
				$ref: '#/components/schemas/cf_debt_amount_formatted',
			},
		},
	},
	module_record_get: {
		type: 'object',
		properties: {
			module_plural_name: { $ref: '#/components/schemas/module_plural_name' },
			comments: { $ref: '#/components/schemas/comments' },
			module_api_name: { $ref: '#/components/schemas/module_api_name' },
			shared_type: { $ref: '#/components/schemas/shared_type' },
			can_submit: { $ref: '#/components/schemas/can_submit' },
			approvers_list: { $ref: '#/components/schemas/approvers_list' },
			can_approve: { $ref: '#/components/schemas/can_approve' },
			module_name: { $ref: '#/components/schemas/module_name' },
			module_fields: { $ref: '#/components/schemas/module_fields' },
			module_record_id: { $ref: '#/components/schemas/module_record_id' },
			shared_to: { $ref: '#/components/schemas/shared_to' },
		},
	},
	module_record_hash: {
		type: 'object',
		properties: {
			module_record_id: { $ref: '#/components/schemas/date' },
			module_api_name: { $ref: '#/components/schemas/module_api_name' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			last_modified_time_formatted: {
				$ref: '#/components/schemas/last_modified_time_formatted',
			},
			created_time: { $ref: '#/components/schemas/created_time' },
			created_time_formatted: {
				$ref: '#/components/schemas/created_time_formatted',
			},
			created_by_id: { $ref: '#/components/schemas/created_by_id' },
			last_modified_by_id: { $ref: '#/components/schemas/last_modified_by_id' },
			record_name: { $ref: '#/components/schemas/record_name' },
			record_name_formatted: {
				$ref: '#/components/schemas/record_name_formatted',
			},
		},
	},
	module_record_id: { description: 'Reeccord ID', type: 'string' },
	module_record_ids: { description: 'Reeccord IDs', type: 'string' },
	module_record_module_put: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				module_record_id: { $ref: '#/components/schemas/record_id' },
				module_api_name: { $ref: '#/components/schemas/module_api_name' },
				last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
				last_modified_time_formatted: {
					$ref: '#/components/schemas/last_modified_time_formatted',
				},
				created_time: { $ref: '#/components/schemas/created_time' },
				created_time_formatted: { $ref: '#/components/schemas/created_time' },
				created_by_id: { $ref: '#/components/schemas/created_time_formatted' },
				last_modified_by_id: {
					$ref: '#/components/schemas/last_modified_by_id',
				},
				record_name: { $ref: '#/components/schemas/record_name' },
				record_name_formatted: {
					$ref: '#/components/schemas/record_name_formatted',
				},
				cf_debt_amount: { $ref: '#/components/schemas/cf_debt_amount' },
				cf_debt_amount_formatted: {
					$ref: '#/components/schemas/cf_debt_amount_formatted',
				},
				code: { type: 'integer' },
				message: { type: 'string' },
			},
		},
	},
	name: { description: 'User Name', type: 'string' },
	operation_type: { description: 'Type of the operation', type: 'string' },
	page: { type: 'integer' },
	page_context: {
		type: 'object',
		properties: {
			page: { $ref: '#/components/schemas/page' },
			per_page: { $ref: '#/components/schemas/per_page' },
			has_more_page: { $ref: '#/components/schemas/has_more_page' },
			applied_filter: { $ref: '#/components/schemas/applied_filter' },
			sort_column: { $ref: '#/components/schemas/sort_column' },
			sort_order: { $ref: '#/components/schemas/sort_order' },
		},
	},
	per_page: { type: 'integer' },
	photo_url: { description: 'User Photo URL', type: 'string' },
	pii_type: { description: 'PII type of the Field', type: 'string' },
	record_id: { description: 'ID of the Custom Module Record', type: 'string' },
	record_name: { description: 'Name of the record', type: 'string' },
	record_name_formatted: {
		description: 'Name of the Record Formatted',
		type: 'string',
	},
	shared_to: {
		description: 'The users ID to whome it should be shared',
		type: 'array',
		items: { type: 'string' },
	},
	shared_type: { description: 'Sharing type', type: 'string' },
	sort_column: { type: 'string' },
	sort_order: { type: 'string' },
	text: { description: 'User Text', type: 'string' },
	time: { description: 'Time of the record added', type: 'string' },
	'update-custom-module-request': {
		required: ['record_name'],
		type: 'object',
		additionalProperties: false,
		patternProperties: {
			'^cf_[A-Za-z0-9_]+$': {
				oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
			},
		},
		properties: {
			record_name: { $ref: '#/components/schemas/record_name' },
			cf_debt_amount: { $ref: '#/components/schemas/cf_debt_amount' },
		},
	},
	'update-custom-module-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			module_record: { $ref: '#/components/schemas/module_record' },
		},
	},
	'update-module-configuration-request': {
		type: 'object',
		required: ['module_name', 'plural_name'],
		properties: {
			module_name: {
				type: 'string',
				description:
					'Display name of the custom module. <code>Max-length [25]</code>',
			},
			plural_name: {
				type: 'string',
				description:
					'Plural form of the module name. <code>Max-length [30]</code>',
			},
			parent_module_id: {
				type: 'string',
				description: 'ID of the parent module, if this is a sub-module.',
			},
			record_name: {
				type: 'string',
				description:
					'Label for the record name field. <code>Max-length [30]</code>',
			},
			description: {
				type: 'string',
				description:
					'Description of the custom module. <code>Max-length [150]</code>',
			},
			shared_type: {
				type: 'string',
				description:
					'Sharing type for the module. Allowed Values: <code>private</code>, <code>read_only</code>, <code>read_write</code> and <code>public</code>.',
			},
			is_reporting_tags_supported: {
				type: 'boolean',
				description: 'Whether reporting tags are supported for this module.',
			},
			can_edit_module: {
				type: 'boolean',
				description: 'Whether records in this module can be edited.',
			},
			can_bulk_update_module: {
				type: 'boolean',
				description: 'Whether bulk update is supported.',
			},
			can_send_mail: {
				type: 'boolean',
				description: 'Whether sending mail is supported from this module.',
			},
			can_bulk_send_mail: {
				type: 'boolean',
				description: 'Whether bulk mail sending is supported.',
			},
			can_attach_documents: {
				type: 'boolean',
				description: 'Whether document attachment is supported.',
			},
			can_show_pdf_view: {
				type: 'boolean',
				description: 'Whether PDF view is available.',
			},
			can_allow_pdf_print: {
				type: 'boolean',
				description: 'Whether PDF print is allowed.',
			},
			allow_forclone: {
				type: 'boolean',
				description: 'Whether cloning records is allowed.',
			},
			can_lock_record: {
				type: 'boolean',
				description: 'Whether record locking is supported.',
			},
			can_use_widget_for_custommodule: {
				type: 'boolean',
				description: 'Whether widgets can be used in this module.',
			},
			can_show_custommodule_lhs: {
				type: 'boolean',
				description:
					'Whether to show the module in the left-hand side navigation.',
			},
			show_custommodule_in: {
				type: 'array',
				description:
					'Where to show the custom module. Each item has a <code>show_in</code> value.',
				items: {
					type: 'object',
					properties: {
						show_in: {
							type: 'string',
							description:
								'Allowed Values: <code>settings</code>, <code>webui</code>, <code>extension</code> and <code>lhs</code>.',
						},
					},
				},
			},
			module_permission: {
				type: 'array',
				description: 'Role-based permissions for the module.',
				items: {
					type: 'object',
					properties: {
						role_id: { type: 'string', description: 'ID of the role.' },
						can_create: {
							type: 'boolean',
							description: 'Permission to create records.',
						},
						can_edit: {
							type: 'boolean',
							description: 'Permission to edit records.',
						},
						can_view: {
							type: 'boolean',
							description: 'Permission to view records.',
						},
						can_delete: {
							type: 'boolean',
							description: 'Permission to delete records.',
						},
						can_approve: {
							type: 'boolean',
							description: 'Permission to approve records.',
						},
						full_access: {
							type: 'boolean',
							description: 'Full access permission.',
						},
					},
				},
			},
			module_visibility: {
				type: 'array',
				description:
					'Visibility settings for the module in different contexts.',
				items: {
					type: 'object',
					properties: {
						type: { type: 'string', description: 'Context type.' },
						is_hidden: {
							type: 'boolean',
							description: 'Whether the module is hidden in this context.',
						},
					},
				},
			},
			default_customview_api_name: {
				type: 'string',
				description: 'API name of the default custom view for this module.',
			},
		},
	},
	'update-module-configuration-response': {
		type: 'object',
		properties: {
			code: { type: 'integer' },
			message: { type: 'string' },
			module: { $ref: '#/components/schemas/module_configuration' },
		},
	},
	users: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: { $ref: '#/components/schemas/id' },
				text: { $ref: '#/components/schemas/text' },
				name: { $ref: '#/components/schemas/name' },
				email: { $ref: '#/components/schemas/email' },
				photo_url: { $ref: '#/components/schemas/photo_url' },
				is_current_user: { $ref: '#/components/schemas/is_current_user' },
			},
		},
	},
	value: { description: 'Value of the Field', type: 'string' },
	value_formatted: {
		description: 'Formatted value of the Field',
		type: 'string',
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'list_custom_modules',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'listCustomModules',
		method: 'GET',
		path: '/settings/modules',
		summary: 'List custom modules',
		description:
			'List all custom module configurations in the organization. This returns the module definitions including field configurations, permissions, and portal settings.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'portal_type',
				in: 'query',
				required: false,
				description:
					'Filter by portal type. Allowed values: <code>customer</code>, <code>vendor</code> and <code>employee</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_order',
				in: 'query',
				required: false,
				description:
					'Sort order. Allowed values: <code>ascending</code> and <code>descending</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description: 'Page number for pagination.',
				schema: { type: 'integer' },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description: 'Number of records per page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-module-configurations-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_custom_module',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'createCustomModule',
		method: 'POST',
		path: '/settings/modules',
		summary: 'Create a custom module',
		description:
			'Create a new custom module configuration. Define the module name, fields, permissions, and other settings.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
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
				$ref: '#/components/schemas/create-module-configuration-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-module-configuration-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_custom_module',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'getCustomModule',
		method: 'GET',
		path: '/settings/modules/{module_api_name}',
		summary: 'Get a custom module',
		description: 'Get the configuration details of a specific custom module.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'module_api_name',
				in: 'path',
				required: true,
				description:
					'API name of the custom module (e.g., <code>cm_debtor</code>).',
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
					$ref: '#/components/schemas/get-module-configuration-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_custom_module',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'updateCustomModule',
		method: 'PUT',
		path: '/settings/modules/{module_api_name}',
		summary: 'Update a custom module',
		description: 'Update the configuration of an existing custom module.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'module_api_name',
				in: 'path',
				required: true,
				description:
					'API name of the custom module (e.g., <code>cm_debtor</code>).',
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
				$ref: '#/components/schemas/update-module-configuration-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-module-configuration-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_custom_module',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'deleteCustomModule',
		method: 'DELETE',
		path: '/settings/modules/{module_api_name}',
		summary: 'Delete a custom module',
		description:
			'Delete an existing custom module configuration and all its records.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'module_api_name',
				in: 'path',
				required: true,
				description:
					'API name of the custom module (e.g., <code>cm_debtor</code>).',
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
				name: 'force_delete',
				in: 'query',
				required: false,
				description: 'Force delete even if the module has existing records.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-module-configuration-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_custom_module_records',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'listCustomModuleRecords',
		method: 'GET',
		path: '/{module_name}',
		summary: 'List custom module records',
		description: 'Get the list of records of a custom module.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
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
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
				schema: { type: 'string' },
			},
			{
				name: 'customview_id',
				in: 'query',
				required: false,
				description: 'Filter records based on a custom view.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter records by status. Allowed Values: <code>Status.All</code>, <code>Status.Active</code>, <code>Status.Inactive</code>',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description: 'Search records by text.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort records by column. Allowed Values: <code>record_name</code>, <code>created_time</code>, <code>last_modified_time</code> or any custom field API name (<code>cf_*</code>).',
				schema: { type: 'string' },
			},
			{
				name: 'sort_order',
				in: 'query',
				required: false,
				description:
					'Sort order. Allowed Values: <code>A</code> (Ascending), <code>D</code> (Descending)',
				schema: { type: 'string' },
			},
			{
				name: 'page',
				in: 'query',
				required: false,
				description: 'Page number for pagination.',
				schema: { type: 'integer' },
			},
			{
				name: 'per_page',
				in: 'query',
				required: false,
				description: 'Number of records per page.',
				schema: { type: 'integer', default: 10 },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-record-list-of-a-custom-module-response',
				},
			},
		],
		scopes: ['ZohoBooks.custommodules.ALL'],
		riskLevel: 'read',
	},
	{
		id: 'bulk_update_custom_module_records',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'bulkUpdateCustomModuleRecords',
		method: 'PUT',
		path: '/{module_name}',
		summary: 'Bulk update custom module records',
		description: 'Update existing custom module records in bulk.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
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
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/bulk-update-custom-module-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/bulk-update-custom-module-response',
				},
			},
		],
		scopes: ['ZohoBooks.custommodules.ALL'],
		riskLevel: 'write',
	},
	{
		id: 'create_custom_module_record',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'createCustomModuleRecord',
		method: 'POST',
		path: '/{module_name}',
		summary: 'Create a custom module record',
		description: 'Create a new record in a custom module.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
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
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-custom-modules-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-custom-modules-response' },
			},
		],
		scopes: ['ZohoBooks.custommodules.ALL'],
		riskLevel: 'write',
	},
	{
		id: 'delete_custom_module_records',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'deleteCustomModuleRecords',
		method: 'DELETE',
		path: '/{module_name}',
		summary: 'Delete custom module records',
		description: 'Delete records from a custom module.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
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
				name: 'record_ids',
				in: 'query',
				required: false,
				description:
					'Comma-separated list of record IDs to delete. Maximum 200 IDs.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/delete-custom-modules-response' },
			},
		],
		scopes: ['ZohoBooks.custommodules.ALL'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_custom_module_record',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'getCustomModuleRecord',
		method: 'GET',
		path: '/{module_name}/{module_id}',
		summary: 'Get a custom module record',
		description: 'Get the details of an individual record in a custom module.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
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
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
				schema: { type: 'string' },
			},
			{
				name: 'module_id',
				in: 'path',
				required: true,
				description: 'Custom Module ID',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-individual-record-details-response',
				},
			},
		],
		scopes: ['ZohoBooks.custommodules.ALL'],
		riskLevel: 'read',
	},
	{
		id: 'update_custom_module_record',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'updateCustomModuleRecord',
		method: 'PUT',
		path: '/{module_name}/{module_id}',
		summary: 'Update a custom module record',
		description: 'Update an existing record in a custom module.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
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
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
				schema: { type: 'string' },
			},
			{
				name: 'module_id',
				in: 'path',
				required: true,
				description: 'Custom Module ID',
				schema: { type: 'string' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-custom-module-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-custom-module-response' },
			},
		],
		scopes: ['ZohoBooks.custommodules.ALL'],
		riskLevel: 'write',
	},
	{
		id: 'delete_custom_module_record',
		group: 'customModules',
		groupSlug: 'custom-modules',
		name: 'deleteCustomModuleRecord',
		method: 'DELETE',
		path: '/{module_name}/{module_id}',
		summary: 'Delete a custom module record',
		description: 'Delete an individual record from a custom module.',
		docsUrl: 'https://www.zoho.com/books/api/v3/custom-modules/',
		parameters: [
			{
				name: 'module_name',
				in: 'path',
				required: true,
				description: 'Module Name',
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
				name: 'module_id',
				in: 'path',
				required: true,
				description: 'Custom Module ID',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/delete-individual-records-response',
				},
			},
		],
		scopes: ['ZohoBooks.custommodules.ALL'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
