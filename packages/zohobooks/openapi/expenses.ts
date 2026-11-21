import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	account_id: {
		description:
			'ID of the expense account. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	account_name: { type: 'string' },
	acquisition_vat_id: {
		description:
			'This is the ID of the tax applied in case this is an EU - goods expense and acquisition VAT needs to be reported. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	acquisition_vat_summary: {
		type: 'array',
		items: {
			type: 'object',
			properties: { tax: { $ref: '#/components/schemas/tax' } },
		},
	},
	acquisition_vat_total: {
		description: 'Enter acquisition vat total.',
		type: 'number',
		format: 'double',
	},
	'add-attachment-to-an-expense-request': {
		type: 'object',
		required: ['attachment'],
		properties: {
			attachment: {
				type: 'string',
				format: 'binary',
				description:
					'Expense attachment file to attach. Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code>, <code>pdf</code>, <code>xls</code>, <code>xlsx</code>, <code>doc</code>, <code>docx</code>, <code>txt</code> and <code>csv</code>',
			},
			totalFiles: {
				type: 'integer',
				description: 'Total number of files being uploaded.',
			},
			document_ids: {
				type: 'array',
				items: { type: 'string' },
				description:
					'Array of document IDs for batch processing. Note: This value is a set of numeric characters separated by comma.',
			},
		},
	},
	'add-attachment-to-an-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			documents: {
				type: 'array',
				description: 'Details of the uploaded attachments.',
				items: {
					type: 'object',
					properties: {
						document_id: {
							type: 'string',
							description:
								'ID of the uploaded document. Note: This value is a set of numeric characters.',
						},
						file_name: {
							type: 'string',
							description: 'Name of the uploaded file',
						},
						file_size: {
							type: 'integer',
							description: 'Size of the uploaded file in bytes',
						},
						document_type: {
							type: 'string',
							description: 'Type of the document',
						},
					},
				},
			},
		},
	},
	'add-receipt-to-an-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	amount: {
		description: 'Amount of the Expense.',
		type: 'number',
		format: 'double',
	},
	applied_filter: { type: 'string' },
	bcy_total: { type: 'number', format: 'double' },
	bcy_total_without_tax: { type: 'number', format: 'double' },
	can_reclaim_vat_on_mileage: {
		description: 'To specify if tax can be reclaimed for this mileage expense.',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	comment_id: {
		type: 'string',
		description:
			'Unique identifier of the comment. Note: This value is a set of numeric characters.',
	},
	commented_by: { type: 'string' },
	commented_by_id: {
		type: 'string',
		description:
			'Unique identifier of the user who made the comment. Note: This value is a set of numeric characters.',
	},
	'create-an-employee-request': {
		required: ['name', 'email'],
		type: 'object',
		properties: {
			name: { $ref: '#/components/schemas/name' },
			email: { $ref: '#/components/schemas/email' },
		},
	},
	'create-an-employee-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			employee: {
				type: 'object',
				properties: {
					employee_id: { $ref: '#/components/schemas/employee_id' },
					name: { $ref: '#/components/schemas/name' },
					email: { $ref: '#/components/schemas/email' },
				},
			},
		},
	},
	'create-an-expense-request': {
		required: ['date', 'account_id', 'amount', 'paid_through_account_id'],
		type: 'object',
		properties: {
			account_id: { $ref: '#/components/schemas/account_id' },
			date: { $ref: '#/components/schemas/date' },
			amount: { $ref: '#/components/schemas/amount' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			reverse_charge_tax_id: {
				$ref: '#/components/schemas/reverse_charge_tax_id',
			},
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: { $ref: '#/components/schemas/line_items' },
			taxes: { $ref: '#/components/schemas/taxes' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			is_billable: { $ref: '#/components/schemas/is_billable' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			description: { $ref: '#/components/schemas/description' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			project_id: { $ref: '#/components/schemas/project_id' },
			mileage_type: { $ref: '#/components/schemas/mileage_type' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			product_type: { $ref: '#/components/schemas/product_type' },
			acquisition_vat_id: { $ref: '#/components/schemas/acquisition_vat_id' },
			reverse_charge_vat_id: {
				$ref: '#/components/schemas/reverse_charge_vat_id',
			},
			start_reading: { $ref: '#/components/schemas/start_reading' },
			end_reading: { $ref: '#/components/schemas/end_reading' },
			distance: { $ref: '#/components/schemas/distance' },
			mileage_unit: { $ref: '#/components/schemas/mileage_unit' },
			mileage_rate: { $ref: '#/components/schemas/mileage_rate' },
			employee_id: { $ref: '#/components/schemas/employee_id' },
			vehicle_type: { $ref: '#/components/schemas/vehicle_type' },
			can_reclaim_vat_on_mileage: {
				$ref: '#/components/schemas/can_reclaim_vat_on_mileage',
			},
			fuel_type: { $ref: '#/components/schemas/fuel_type' },
			engine_capacity_range: {
				$ref: '#/components/schemas/engine_capacity_range',
			},
			paid_through_account_id: {
				$ref: '#/components/schemas/paid_through_account_id',
			},
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'create-an-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			expense: { $ref: '#/components/schemas/expense-response' },
		},
	},
	created_time: { type: 'string' },
	currency_code: { type: 'string' },
	currency_id: {
		type: 'string',
		description:
			'Unique identifier of the currency. Note: This value is a set of numeric characters.',
	},
	custom_fields: {
		description: 'Custom fields for an expense.',
		type: 'array',
		items: { type: 'string' },
	},
	customer_id: {
		description:
			'ID of the expense account. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	customer_name: {
		description:
			'Name of the Custome for which expense is raised. Max-length [100]',
		type: 'string',
	},
	date: { description: 'Date of the expense', type: 'string' },
	date_description: { type: 'string' },
	'delete-a-receipt-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-an-employee-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-an-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: {
		description: 'Description of the expense. Max-length [100]',
		type: 'string',
	},
	destination_of_supply: {
		description:
			"Place where the goods/services are supplied to. (If not given, organisation's home state will be taken)",
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	destination_of_supply_state: {
		description: 'State to where goods/services are supplied',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	distance: {
		description:
			'Distance travelled for a particular mileage expense where <code>mileage_type</code> is <code>manual</code>',
		type: 'string',
	},
	email: { description: 'Email address of the employee.', type: 'string' },
	employee_id: {
		description:
			'ID of the employee who has submitted this mileage expense. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	end_reading: {
		description:
			'End reading of odometer when creating a mileage expense where <code>mileage_type</code> is <code>odometer</code>.',
		type: 'number',
		format: 'double',
	},
	engine_capacity_range: {
		description:
			'Engine capacity range for a particular mileage expense. Allowed Values: <code>less_than_1400cc</code>, <code>between_1400cc_and_1600cc</code>, <code>between_1600cc_and_2000cc</code> and <code>more_than_2000cc</code>',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	exchange_rate: {
		type: 'number',
		description:
			'Exchange rate of the currency with respect to the base currency of the organization.',
		format: 'double',
	},
	'expense-response': {
		type: 'object',
		properties: {
			expense_id: { $ref: '#/components/schemas/expense_id' },
			transaction_id: { $ref: '#/components/schemas/transaction_id' },
			transaction_type: { $ref: '#/components/schemas/transaction_type' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			destination_of_supply_state: {
				$ref: '#/components/schemas/destination_of_supply_state',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			paid_through_account_name: {
				$ref: '#/components/schemas/paid_through_account_name',
			},
			vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
			reverse_charge_tax_id: {
				$ref: '#/components/schemas/reverse_charge_tax_id',
			},
			reverse_charge_tax_name: {
				$ref: '#/components/schemas/reverse_charge_tax_name',
			},
			reverse_charge_tax_percentage: {
				$ref: '#/components/schemas/reverse_charge_tax_percentage',
			},
			reverse_charge_tax_amount: {
				$ref: '#/components/schemas/reverse_charge_tax_amount',
			},
			tax_amount: { $ref: '#/components/schemas/tax_amount' },
			is_itemized_expense: { $ref: '#/components/schemas/is_itemized_expense' },
			is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
			trip_id: { $ref: '#/components/schemas/trip_id' },
			trip_number: { $ref: '#/components/schemas/trip_number' },
			reverse_charge_vat_total: {
				$ref: '#/components/schemas/reverse_charge_vat_total',
			},
			acquisition_vat_total: {
				$ref: '#/components/schemas/acquisition_vat_total',
			},
			acquisition_vat_summary: {
				$ref: '#/components/schemas/acquisition_vat_summary',
			},
			reverse_charge_vat_summary: {
				$ref: '#/components/schemas/reverse_charge_vat_summary',
			},
			taxes: { $ref: '#/components/schemas/taxes' },
			expense_item_id: { $ref: '#/components/schemas/expense_item_id' },
			account_id: { $ref: '#/components/schemas/account_id' },
			account_name: { $ref: '#/components/schemas/account_name' },
			date: { $ref: '#/components/schemas/date' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tax_name: { $ref: '#/components/schemas/tax_name' },
			tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			currency_code: { $ref: '#/components/schemas/currency_code' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			sub_total: { $ref: '#/components/schemas/sub_total' },
			total: { $ref: '#/components/schemas/total' },
			bcy_total: { $ref: '#/components/schemas/bcy_total' },
			amount: { $ref: '#/components/schemas/amount' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			description: { $ref: '#/components/schemas/description' },
			is_billable: { $ref: '#/components/schemas/is_billable' },
			is_personal: { $ref: '#/components/schemas/is_personal' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			customer_name: { $ref: '#/components/schemas/customer_name' },
			expense_receipt_name: {
				$ref: '#/components/schemas/expense_receipt_name',
			},
			expense_receipt_type: {
				$ref: '#/components/schemas/expense_receipt_type',
			},
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			status: { $ref: '#/components/schemas/status' },
			invoice_id: { $ref: '#/components/schemas/invoice_id' },
			invoice_number: { $ref: '#/components/schemas/invoice_number' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			project_id: { $ref: '#/components/schemas/project_id' },
			project_name: { $ref: '#/components/schemas/project_name' },
			mileage_rate: { $ref: '#/components/schemas/mileage_rate' },
			mileage_type: { $ref: '#/components/schemas/mileage_type' },
			expense_type: { $ref: '#/components/schemas/expense_type' },
			start_reading: { $ref: '#/components/schemas/start_reading' },
			end_reading: { $ref: '#/components/schemas/end_reading' },
			tags: { $ref: '#/components/schemas/tags_response' },
		},
	},
	expense_id: {
		type: 'string',
		description:
			'Unique identifier of the expense. Note: This value is a set of numeric characters.',
	},
	expense_item_id: {
		type: 'string',
		description:
			'Unique identifier of the expense item. Note: This value is a set of numeric characters.',
	},
	expense_receipt_name: { type: 'string' },
	expense_receipt_type: { type: 'string' },
	expense_type: { type: 'string' },
	filter_by: {
		description:
			'Filter expenses by expense status. Allowed Values <code>Status.All</code>, <code>Status.Billable</code>, <code>Status.Nonbillable</code>, <code>Status.Reimbursed</code>, <code>Status.Invoiced</code> and <code>Status.Unbilled</code>',
		type: 'string',
	},
	fuel_type: {
		description:
			'Fuel type for a particular mileage expense. Allowed Values: <code>petrol</code>, <code>lpg</code> and <code>diesel</code>',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	'get-an-employee-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			employee: {
				type: 'object',
				properties: {
					employee_id: { $ref: '#/components/schemas/employee_id' },
					name: { $ref: '#/components/schemas/name' },
					email: { $ref: '#/components/schemas/email' },
				},
			},
		},
	},
	'get-an-expense-receipt-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-an-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			expense: {
				type: 'object',
				properties: {
					expense_id: { $ref: '#/components/schemas/expense_id' },
					transaction_id: { $ref: '#/components/schemas/transaction_id' },
					transaction_type: { $ref: '#/components/schemas/transaction_type' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					destination_of_supply: {
						$ref: '#/components/schemas/destination_of_supply',
					},
					destination_of_supply_state: {
						$ref: '#/components/schemas/destination_of_supply_state',
					},
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
					source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
					paid_through_account_name: {
						$ref: '#/components/schemas/paid_through_account_name',
					},
					vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
					reverse_charge_tax_id: {
						$ref: '#/components/schemas/reverse_charge_tax_id',
					},
					reverse_charge_tax_name: {
						$ref: '#/components/schemas/reverse_charge_tax_name',
					},
					reverse_charge_tax_percentage: {
						$ref: '#/components/schemas/reverse_charge_tax_percentage',
					},
					reverse_charge_tax_amount: {
						$ref: '#/components/schemas/reverse_charge_tax_amount',
					},
					tax_amount: { $ref: '#/components/schemas/tax_amount' },
					is_itemized_expense: {
						$ref: '#/components/schemas/is_itemized_expense',
					},
					is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
					trip_id: { $ref: '#/components/schemas/trip_id' },
					trip_number: { $ref: '#/components/schemas/trip_number' },
					reverse_charge_vat_total: {
						$ref: '#/components/schemas/reverse_charge_vat_total',
					},
					acquisition_vat_total: {
						$ref: '#/components/schemas/acquisition_vat_total',
					},
					acquisition_vat_summary: {
						$ref: '#/components/schemas/acquisition_vat_summary',
					},
					reverse_charge_vat_summary: {
						$ref: '#/components/schemas/reverse_charge_vat_summary',
					},
					expense_item_id: { $ref: '#/components/schemas/expense_item_id' },
					account_id: { $ref: '#/components/schemas/account_id' },
					account_name: { $ref: '#/components/schemas/account_name' },
					date: { $ref: '#/components/schemas/date' },
					tax_id: { $ref: '#/components/schemas/tax_id' },
					tax_name: { $ref: '#/components/schemas/tax_name' },
					tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					sub_total: { $ref: '#/components/schemas/sub_total' },
					total: { $ref: '#/components/schemas/total' },
					bcy_total: { $ref: '#/components/schemas/bcy_total' },
					amount: { $ref: '#/components/schemas/amount' },
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					description: { $ref: '#/components/schemas/description' },
					is_billable: { $ref: '#/components/schemas/is_billable' },
					is_personal: { $ref: '#/components/schemas/is_personal' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					expense_receipt_name: {
						$ref: '#/components/schemas/expense_receipt_name',
					},
					expense_receipt_type: {
						$ref: '#/components/schemas/expense_receipt_type',
					},
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					status: { $ref: '#/components/schemas/status' },
					invoice_id: { $ref: '#/components/schemas/invoice_id' },
					invoice_number: { $ref: '#/components/schemas/invoice_number' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					project_id: { $ref: '#/components/schemas/project_id' },
					project_name: { $ref: '#/components/schemas/project_name' },
					mileage_rate: { $ref: '#/components/schemas/mileage_rate' },
					mileage_type: { $ref: '#/components/schemas/mileage_type' },
					expense_type: { $ref: '#/components/schemas/expense_type' },
					start_reading: { $ref: '#/components/schemas/start_reading' },
					end_reading: { $ref: '#/components/schemas/end_reading' },
					tags: { $ref: '#/components/schemas/tags_response' },
					line_item: {
						type: 'object',
						properties: {
							line_item_id: { $ref: '#/components/schemas/line_item_id' },
							account_id: { $ref: '#/components/schemas/account_id' },
							account_name: { $ref: '#/components/schemas/account_name' },
							description: { $ref: '#/components/schemas/description' },
							tax_amount: { $ref: '#/components/schemas/tax_amount' },
							tax_id: { $ref: '#/components/schemas/tax_id' },
							tax_name: { $ref: '#/components/schemas/tax_name' },
							tax_type: { $ref: '#/components/schemas/tax_type' },
							tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
							item_total: { $ref: '#/components/schemas/item_total' },
							item_order: { $ref: '#/components/schemas/item_order' },
							amount: { $ref: '#/components/schemas/amount' },
							hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
							location_id: { $ref: '#/components/schemas/location_id' },
							reverse_charge_tax_id: {
								$ref: '#/components/schemas/reverse_charge_tax_id',
							},
							reverse_charge_tax_name: {
								$ref: '#/components/schemas/reverse_charge_tax_name',
							},
							reverse_charge_tax_percentage: {
								$ref: '#/components/schemas/reverse_charge_tax_percentage',
							},
							reverse_charge_tax_amount: {
								$ref: '#/components/schemas/reverse_charge_tax_amount',
							},
							tags: { $ref: '#/components/schemas/tags_response' },
						},
					},
				},
			},
		},
	},
	gst_no: {
		description: '15 digit GST identification number of the vendor.',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	gst_treatment: {
		description:
			'Choose whether the contact is GST registered/unregistered/consumer/overseas. Allowed values are <code> business_gst </code> , <code> business_none </code> , <code> overseas </code> , <code> consumer </code>.',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	hsn_or_sac: {
		description: 'Add HSN/SAC code for your goods/services',
		type: 'string',
		'x-node_available_in': ['in', 'ke'],
		'x-node_unavailable_in': [],
	},
	invoice_id: {
		type: 'string',
		description:
			'Unique identifier of the invoice to which the expense is linked. Note: This value is a set of numeric characters.',
	},
	invoice_number: { type: 'string' },
	is_billable: {
		type: 'boolean',
		description:
			'To specify whether the expense is billable to the customer or not.',
	},
	is_inclusive_tax: {
		type: 'boolean',
		description:
			'To specify whether the tax is inclusive in the amount or not.',
	},
	is_itemized_expense: { type: 'boolean' },
	is_personal: { type: 'boolean' },
	is_pre_gst: {
		description: 'Applicable for transactions that fall before july 1, 2017',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	item_order: {
		type: 'string',
		description: 'Order of the line item in the expense.',
	},
	item_total: { type: 'string' },
	last_modified_time: { type: 'string' },
	line_item_id: {
		type: 'string',
		description:
			'Unique identifier of the line item. Note: This value is a set of numeric characters.',
	},
	line_items: {
		type: 'array',
		description: 'Line items for the expense.',
		items: {
			type: 'object',
			properties: {
				line_item_id: { $ref: '#/components/schemas/line_item_id' },
				account_id: { $ref: '#/components/schemas/account_id' },
				description: { $ref: '#/components/schemas/description' },
				amount: { $ref: '#/components/schemas/amount' },
				tax_id: { $ref: '#/components/schemas/tax_id' },
				item_order: { $ref: '#/components/schemas/item_order' },
				product_type: { $ref: '#/components/schemas/product_type' },
				acquisition_vat_id: { $ref: '#/components/schemas/acquisition_vat_id' },
				reverse_charge_vat_id: {
					$ref: '#/components/schemas/reverse_charge_vat_id',
				},
				reverse_charge_tax_id: {
					$ref: '#/components/schemas/reverse_charge_tax_id',
				},
				tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
				tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
				location_id: { $ref: '#/components/schemas/location_id' },
				tags: { $ref: '#/components/schemas/tags_response' },
			},
		},
	},
	'list-employees-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			employees: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						employee_id: { $ref: '#/components/schemas/employee_id' },
						name: { $ref: '#/components/schemas/name' },
						email: { $ref: '#/components/schemas/email' },
					},
				},
			},
			page_context: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sort_column: { $ref: '#/components/schemas/sort_column' },
						filter_by: { $ref: '#/components/schemas/filter_by' },
						search_text: { $ref: '#/components/schemas/search_text' },
						applied_filter: { $ref: '#/components/schemas/applied_filter' },
						page: { $ref: '#/components/schemas/page' },
						per_page: { $ref: '#/components/schemas/per_page' },
					},
				},
			},
		},
	},
	'list-expense-history-and-comments-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comments: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						comment_id: { $ref: '#/components/schemas/comment_id' },
						expense_id: { $ref: '#/components/schemas/expense_id' },
						description: { $ref: '#/components/schemas/description' },
						commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
						commented_by: { $ref: '#/components/schemas/commented_by' },
						date_description: { $ref: '#/components/schemas/date_description' },
						time: { $ref: '#/components/schemas/time' },
						operation_type: { $ref: '#/components/schemas/operation_type' },
						transaction_id: { $ref: '#/components/schemas/transaction_id' },
						transaction_type: { $ref: '#/components/schemas/transaction_type' },
					},
				},
			},
		},
	},
	'list-expenses-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			expenses: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						expense_id: { $ref: '#/components/schemas/expense_id' },
						date: { $ref: '#/components/schemas/date' },
						account_name: { $ref: '#/components/schemas/account_name' },
						description: { $ref: '#/components/schemas/description' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						bcy_total: { $ref: '#/components/schemas/bcy_total' },
						bcy_total_without_tax: {
							$ref: '#/components/schemas/bcy_total_without_tax',
						},
						total: { $ref: '#/components/schemas/total' },
						total_without_tax: {
							$ref: '#/components/schemas/total_without_tax',
						},
						is_billable: { $ref: '#/components/schemas/is_billable' },
						reference_number: { $ref: '#/components/schemas/reference_number' },
						customer_id: { $ref: '#/components/schemas/customer_id' },
						customer_name: { $ref: '#/components/schemas/customer_name' },
						status: { $ref: '#/components/schemas/status' },
						location_id: { $ref: '#/components/schemas/location_id' },
						location_name: { $ref: '#/components/schemas/location_name' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
						},
						expense_receipt_name: {
							$ref: '#/components/schemas/expense_receipt_name',
						},
						mileage_rate: { $ref: '#/components/schemas/mileage_rate' },
						mileage_unit: { $ref: '#/components/schemas/mileage_unit' },
						expense_type: { $ref: '#/components/schemas/expense_type' },
						start_reading: { $ref: '#/components/schemas/start_reading' },
						end_reading: { $ref: '#/components/schemas/end_reading' },
					},
				},
			},
			page_context: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						sort_column: { $ref: '#/components/schemas/sort_column' },
						filter_by: { $ref: '#/components/schemas/filter_by' },
						search_text: { $ref: '#/components/schemas/search_text' },
						applied_filter: { $ref: '#/components/schemas/applied_filter' },
						page: { $ref: '#/components/schemas/page' },
						per_page: { $ref: '#/components/schemas/per_page' },
					},
				},
			},
		},
	},
	location_id: {
		description:
			'Location ID. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	location_name: { description: 'Name of the location.', type: 'string' },
	mileage_rate: {
		description: 'Mileage rate for a particular mileage expense.',
		type: 'number',
		format: 'double',
	},
	mileage_type: { type: 'string', description: 'Type of the mileage.' },
	mileage_unit: {
		description:
			'Unit of the distance travelled. Allowed Values: <code>km</code> and <code>mile</code>',
		type: 'string',
	},
	name: { description: 'Name of the employee.', type: 'string' },
	operation_type: { type: 'string' },
	page: { type: 'string' },
	paid_through_account_id: {
		description:
			'Search expenses by paid through account id. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	paid_through_account_name: {
		description: 'Enter the name of the paid through account.',
		type: 'string',
	},
	per_page: { type: 'string' },
	place_of_supply: {
		description:
			'The place of supply is where a transaction is considered to have occurred for VAT purposes. For the supply of goods, the place of supply is the location of the goods when the supply occurs. For the supply of services, the place of supply should be where the supplier is established. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code>.<br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	product_type: {
		description:
			'Type of the expense. This denotes whether the expense is to be treated as a goods or service or capital asset purchase. Allowed Values:<br/> <b>For UK: </b><code>digital_service</code>, <code>goods</code> and <code>service</code>.<br/><b>For SouthAfrica Edition:</b> <code>service</code>, <code>goods</code>, <code>capital_service</code> and <code>capital_goods</code>',
		type: 'string',
		'x-node_available_in': ['uk', 'za'],
		'x-node_unavailable_in': [],
	},
	project_id: {
		description:
			'ID of the project associated with the customer. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	project_name: { type: 'string' },
	reference_number: {
		description: 'Reference number of the expense. Max-length [100]',
		type: 'string',
	},
	reverse_charge_tax_amount: {
		description: 'Enter amount of the reverse charge tax',
		type: 'integer',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_id: {
		description:
			'ID of the reverse charge tax. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	reverse_charge_tax_name: {
		description: 'Enter name of the reverse charge tax',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_percentage: {
		description: 'Enter percentage of the reverse charge tax',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_vat_id: {
		description:
			'This is the ID of the tax applied in case this is a non UK - service expense and reverse charge VAT needs to be reported. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_vat_summary: {
		type: 'array',
		items: {
			type: 'object',
			properties: { tax: { $ref: '#/components/schemas/tax' } },
		},
	},
	reverse_charge_vat_total: {
		description: 'Enter total of the reverse charge vat tax.',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	search_text: {
		description:
			'Search expenses by account name or description or <code>customer name</code>  or <code>vendor name</code>. Max-length [100]',
		type: 'string',
	},
	sort_column: {
		description:
			'Sort expenses.Allowed Values <code>date</code>, <code>account_name</code>, <code>total</code>, <code>bcy_total</code>, <code>reference_number</code>, <code>customer_name</code> and <code>created_time</code>',
		type: 'string',
	},
	source_of_supply: {
		description:
			'Place from where the goods/services are supplied. (If not given, <code>place of contact</code> given for the contact will be taken)',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	start_reading: {
		description:
			'Start reading of odometer when creating a mileage expense where <code>mileage_type</code> is <code>odometer</code>.',
		type: 'number',
		format: 'double',
	},
	status: { description: 'Expense status', type: 'string' },
	sub_total: { type: 'number', format: 'double' },
	tag_id: {
		description: "Tag's ID. Note: This value is a set of numeric characters.",
		type: 'string',
	},
	tag_name: { description: "Tag's Name", type: 'string' },
	tag_option_id: {
		description:
			"Tag Option's ID. Note: This value is a set of numeric characters.",
		type: 'string',
	},
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
	tax: {
		type: 'object',
		properties: {
			tax_name: { $ref: '#/components/schemas/tax_name' },
			tax_amount: { $ref: '#/components/schemas/tax_amount' },
		},
	},
	tax_amount: {
		type: 'number',
		description: 'Tax amount for the expense.',
		format: 'double',
	},
	tax_exemption_code: {
		description: 'Enter tax exemption code',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description:
			'Enter tax exemption ID. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		type: 'string',
		description:
			'Unique identifier of the tax. Note: This value is a set of numeric characters.',
	},
	tax_name: { type: 'string' },
	tax_percentage: { type: 'number', format: 'double' },
	tax_treatment: {
		description:
			'VAT treatment for the expense .Choose whether the contact falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> are supported only for <b>UAE</b>. <br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
		type: 'string',
		'x-node_available_in': ['gcc', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	tax_type: { type: 'string' },
	taxes: {
		type: 'array',
		description: 'Taxes applicable for the expense.',
		items: {
			type: 'object',
			properties: {
				tax_id: { $ref: '#/components/schemas/tax_id' },
				tax_amount: { $ref: '#/components/schemas/tax_amount' },
			},
		},
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	time: { type: 'string' },
	total: { type: 'number', format: 'double' },
	total_without_tax: { type: 'number', format: 'double' },
	transaction_id: {
		type: 'string',
		description:
			'Unique identifier of the transaction. Note: This value is a set of numeric characters.',
	},
	transaction_type: { type: 'string' },
	trip_id: {
		description:
			'Enter trip ID. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	trip_number: { description: 'Enter trip number', type: 'string' },
	'update-an-expense-request': {
		required: ['date', 'account_id', 'amount', 'paid_through_account_id'],
		type: 'object',
		properties: {
			account_id: { $ref: '#/components/schemas/account_id' },
			date: { $ref: '#/components/schemas/date' },
			amount: {
				description: 'Amount of the Expense.',
				type: 'number',
				format: 'double',
			},
			tax_id: { $ref: '#/components/schemas/tax_id' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			reverse_charge_tax_id: {
				$ref: '#/components/schemas/reverse_charge_tax_id',
			},
			line_items: { $ref: '#/components/schemas/line_items' },
			location_id: { $ref: '#/components/schemas/location_id' },
			taxes: { $ref: '#/components/schemas/taxes' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			is_billable: { $ref: '#/components/schemas/is_billable' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			description: { $ref: '#/components/schemas/description' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			project_id: { $ref: '#/components/schemas/project_id' },
			mileage_type: { $ref: '#/components/schemas/mileage_type' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			product_type: { $ref: '#/components/schemas/product_type' },
			acquisition_vat_id: { $ref: '#/components/schemas/acquisition_vat_id' },
			reverse_charge_vat_id: {
				$ref: '#/components/schemas/reverse_charge_vat_id',
			},
			start_reading: { $ref: '#/components/schemas/start_reading' },
			end_reading: { $ref: '#/components/schemas/end_reading' },
			distance: { $ref: '#/components/schemas/distance' },
			mileage_unit: { $ref: '#/components/schemas/mileage_unit' },
			mileage_rate: { $ref: '#/components/schemas/mileage_rate' },
			employee_id: { $ref: '#/components/schemas/employee_id' },
			vehicle_type: { $ref: '#/components/schemas/vehicle_type' },
			can_reclaim_vat_on_mileage: {
				$ref: '#/components/schemas/can_reclaim_vat_on_mileage',
			},
			fuel_type: { $ref: '#/components/schemas/fuel_type' },
			engine_capacity_range: {
				$ref: '#/components/schemas/engine_capacity_range',
			},
			paid_through_account_id: {
				$ref: '#/components/schemas/paid_through_account_id',
			},
			vendor_id: { $ref: '#/components/schemas/vendor_id' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'update-an-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			expense: {
				type: 'object',
				properties: {
					expense_id: { $ref: '#/components/schemas/expense_id' },
					transaction_id: { $ref: '#/components/schemas/transaction_id' },
					transaction_type: { $ref: '#/components/schemas/transaction_type' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					destination_of_supply: {
						$ref: '#/components/schemas/destination_of_supply',
					},
					destination_of_supply_state: {
						$ref: '#/components/schemas/destination_of_supply_state',
					},
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
					source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
					paid_through_account_name: {
						$ref: '#/components/schemas/paid_through_account_name',
					},
					vat_reg_no: { $ref: '#/components/schemas/vat_reg_no' },
					reverse_charge_tax_id: {
						$ref: '#/components/schemas/reverse_charge_tax_id',
					},
					reverse_charge_tax_name: {
						$ref: '#/components/schemas/reverse_charge_tax_name',
					},
					reverse_charge_tax_percentage: {
						$ref: '#/components/schemas/reverse_charge_tax_percentage',
					},
					reverse_charge_tax_amount: {
						$ref: '#/components/schemas/reverse_charge_tax_amount',
					},
					tax_amount: { $ref: '#/components/schemas/tax_amount' },
					is_itemized_expense: {
						$ref: '#/components/schemas/is_itemized_expense',
					},
					is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
					trip_id: { $ref: '#/components/schemas/trip_id' },
					trip_number: { $ref: '#/components/schemas/trip_number' },
					reverse_charge_vat_total: {
						$ref: '#/components/schemas/reverse_charge_vat_total',
					},
					acquisition_vat_total: {
						$ref: '#/components/schemas/acquisition_vat_total',
					},
					acquisition_vat_summary: {
						$ref: '#/components/schemas/acquisition_vat_summary',
					},
					reverse_charge_vat_summary: {
						$ref: '#/components/schemas/reverse_charge_vat_summary',
					},
					taxes: { $ref: '#/components/schemas/taxes' },
					expense_item_id: { $ref: '#/components/schemas/expense_item_id' },
					account_id: { $ref: '#/components/schemas/account_id' },
					account_name: { $ref: '#/components/schemas/account_name' },
					date: { $ref: '#/components/schemas/date' },
					tax_id: { $ref: '#/components/schemas/tax_id' },
					tax_name: { $ref: '#/components/schemas/tax_name' },
					tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					sub_total: { $ref: '#/components/schemas/sub_total' },
					total: { $ref: '#/components/schemas/total' },
					bcy_total: { $ref: '#/components/schemas/bcy_total' },
					amount: {
						description: 'Amount of the Expense.',
						type: 'number',
						format: 'double',
					},
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					reference_number: { $ref: '#/components/schemas/reference_number' },
					description: { $ref: '#/components/schemas/description' },
					is_billable: { $ref: '#/components/schemas/is_billable' },
					is_personal: { $ref: '#/components/schemas/is_personal' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					expense_receipt_name: {
						$ref: '#/components/schemas/expense_receipt_name',
					},
					expense_receipt_type: {
						$ref: '#/components/schemas/expense_receipt_type',
					},
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					status: { $ref: '#/components/schemas/status' },
					invoice_id: { $ref: '#/components/schemas/invoice_id' },
					invoice_number: { $ref: '#/components/schemas/invoice_number' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
					project_id: { $ref: '#/components/schemas/project_id' },
					project_name: { $ref: '#/components/schemas/project_name' },
					mileage_rate: { $ref: '#/components/schemas/mileage_rate' },
					mileage_type: { $ref: '#/components/schemas/mileage_type' },
					expense_type: { $ref: '#/components/schemas/expense_type' },
					start_reading: { $ref: '#/components/schemas/start_reading' },
					end_reading: { $ref: '#/components/schemas/end_reading' },
					tags: { $ref: '#/components/schemas/tags_response' },
				},
			},
		},
	},
	vat_reg_no: { description: 'Enter VAT registration number.', type: 'string' },
	vat_treatment: {
		description:
			'VAT treatment for the expense. VAT treatment denotes the location of the vendor, if the vendor resides in UK then the VAT treatment is <code>uk</code>. If the vendor is in an EU country & VAT registered, you are resides in Northen Ireland and purchasing Goods then his VAT treatment is <code>eu_vat_registered</code> and if he resides outside the UK then his VAT treatment is <code>overseas</code> (For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	vehicle_type: {
		description:
			'Vehicle type for a particular mileage expense. Allowed Values: <code>car</code>, <code>van</code>, <code>motorcycle</code> and <code>bike</code>',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	vendor_id: {
		description:
			'ID of the vendor the expense is made. Note: This value is a set of numeric characters.',
		type: 'string',
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_expense',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'createExpense',
		method: 'POST',
		path: '/expenses',
		summary: 'Create an Expense',
		description: 'Create billable or non-billable expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
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
				name: 'receipt',
				in: 'query',
				required: false,
				description:
					'Expense receipt file to attach. Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code>, <code>pdf</code>, <code>xls</code>, <code>xlsx</code>, <code>doc</code> and <code>docx</code>.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/create-an-expense-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-an-expense-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_expenses',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'listExpenses',
		method: 'GET',
		path: '/expenses',
		summary: 'List Expenses',
		description: 'List all the Expenses with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
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
				name: 'description',
				in: 'query',
				required: false,
				description:
					'Search expenses by description.Variants <code>description_startswith</code> and <code>description_contains</code>. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'reference_number',
				in: 'query',
				required: false,
				description:
					'Search expenses by reference number. Variants <code>reference_number_startswith</code> and <code>reference_number_contains</code>. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'date',
				in: 'query',
				required: false,
				description:
					'Search expenses by expense date. Variants <code>date_start</code>, <code>date_end</code>, <code>date_before</code> and <code>date_after</code>. Format [yyyy-mm-dd]',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Search expenses by expense status. Allowed Values <code>unbilled</code>, <code>invoiced</code>, <code>reimbursed</code>, <code>non-billable</code> and <code>billable</code>',
				schema: { type: 'string' },
			},
			{
				name: 'amount',
				in: 'query',
				required: false,
				description:
					'Search expenses by amount. Variants: <code>amount_less_than</code>, <code>amount_less_equals</code>, <code>amount_greater_than</code> and <code>amount_greater_than</code>',
				schema: { type: 'number', format: 'double' },
			},
			{
				name: 'account_name',
				in: 'query',
				required: false,
				description:
					'Search expenses by expense account name. Variants <code>account_name_startswith</code> and <code>account_name_contains</code>. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'customer_name',
				in: 'query',
				required: false,
				description:
					'Search expenses by customer name. Variants: <code>customer_name_startswith</code> and <code>customer_name_contains</code>. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_name',
				in: 'query',
				required: false,
				description:
					'Search expenses by vendor name. Variants: <code>vendor_name_startswith</code> and <code>vendor_name_contains</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description:
					'ID of the expense account. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'vendor_id',
				in: 'query',
				required: false,
				description:
					'ID of the vendor the expense is made. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'recurring_expense_id',
				in: 'query',
				required: false,
				description:
					'Search expenses by recurring expense id. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'paid_through_account_id',
				in: 'query',
				required: false,
				description:
					'Search expenses by paid through account id. Note: This value is a set of numeric characters.',
				schema: { type: 'string' },
			},
			{
				name: 'project_id',
				in: 'query',
				required: false,
				description:
					'Search expenses by specific project ID. Accepts the unique identifier for a project to retrieve all expenses associated with that particular project.',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search expenses by account name or description or <code>customer name</code>  or <code>vendor name</code>. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort expenses.Allowed Values <code>date</code>, <code>account_name</code>, <code>total</code>, <code>bcy_total</code>, <code>reference_number</code>, <code>customer_name</code> and <code>created_time</code>',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter expenses by expense status. Allowed Values <code>Status.All</code>, <code>Status.Billable</code>, <code>Status.Nonbillable</code>, <code>Status.Reimbursed</code>, <code>Status.Invoiced</code>and <code>Status.Unbilled</code>',
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
				schema: { $ref: '#/components/schemas/list-expenses-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_expense_using_custom_field',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'updateExpenseUsingCustomField',
		method: 'PUT',
		path: '/expenses',
		summary: "Update an expense using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a expense by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding bill expense be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing expenses, a new expense will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
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
				name: 'X-Unique-Identifier-Key',
				in: 'header',
				required: true,
				description: 'Unique CustomField Api Name',
				schema: { type: 'string' },
			},
			{
				name: 'X-Unique-Identifier-Value',
				in: 'header',
				required: true,
				description: 'Unique CustomField Value',
				schema: { type: 'string' },
			},
			{
				name: 'X-Upsert',
				in: 'header',
				required: false,
				description:
					'If there is no record is found unique custom field value , will create new invoice',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-an-expense-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-an-expense-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_expense',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'updateExpense',
		method: 'PUT',
		path: '/expenses/{expense_id}',
		summary: 'Update an Expense',
		description: 'Update an existing Expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
		parameters: [
			{
				name: 'expense_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
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
				name: 'receipt',
				in: 'query',
				required: false,
				description:
					'Expense receipt file to attach. Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code>, <code>pdf</code>, <code>xls</code>, <code>xlsx</code>, <code>doc</code> and <code>docx</code>.',
				schema: { type: 'string', format: 'binary' },
			},
			{
				name: 'delete_receipt',
				in: 'query',
				required: false,
				description:
					'Delete the existing receipt. If this parameter is set to true, the existing receipt will be deleted and the receipt provided in the request will be attached to the expense. If this parameter is not sent in the request, then the existing receipt will be retained and the new receipt provided in the request will be ignored.',
				schema: { type: 'boolean' },
			},
		],
		request: {
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-an-expense-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-an-expense-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_expense',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'getExpense',
		method: 'GET',
		path: '/expenses/{expense_id}',
		summary: 'Get an Expense',
		description: 'Get the details of the Expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
		parameters: [
			{
				name: 'expense_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/get-an-expense-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_expense',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'deleteExpense',
		method: 'DELETE',
		path: '/expenses/{expense_id}',
		summary: 'Delete an Expense',
		description: 'Delete an existing expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
		parameters: [
			{
				name: 'expense_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-an-expense-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'list_expense_comments',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'listExpenseComments',
		method: 'GET',
		path: '/expenses/{expense_id}/comments',
		summary: 'List expense History & Comments',
		description: 'Get history and comments of expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
		parameters: [
			{
				name: 'expense_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
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
				schema: {
					$ref: '#/components/schemas/list-expense-history-and-comments-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_employees',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'listEmployees',
		method: 'GET',
		path: '/employees',
		summary: 'List employees',
		description: 'List employees with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
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
				schema: { $ref: '#/components/schemas/list-employees-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_employee',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'createEmployee',
		method: 'POST',
		path: '/employees',
		summary: 'Create an employee',
		description: 'Create an employee for an expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
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
			required: false,
			schema: { $ref: '#/components/schemas/create-an-employee-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-an-employee-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_employee',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'getEmployee',
		method: 'GET',
		path: '/employees/{employee_id}',
		summary: 'Get an employee',
		description: 'Get the details of the employee.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
		parameters: [
			{
				name: 'employee_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/get-an-employee-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_employee',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'deleteEmployee',
		method: 'DELETE',
		path: '/employee/{employee_id}',
		summary: 'Delete an employee',
		description: 'Delete an existing employee.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
		parameters: [
			{
				name: 'employee_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-an-employee-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_expense_receipt',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'getExpenseReceipt',
		method: 'GET',
		path: '/expenses/{expense_id}/receipt',
		summary: 'Get an expense receipt',
		description: 'Returns the receipt attached to the expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
		parameters: [
			{
				name: 'expense_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
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
				name: 'preview',
				in: 'query',
				required: false,
				description: 'Get the thumbnail of the receipt.',
				schema: { type: 'boolean' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/get-an-expense-receipt-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_expense_receipt',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'createExpenseReceipt',
		method: 'POST',
		path: '/expenses/{expense_id}/receipt',
		summary: 'Add receipt to an expense.',
		description: 'Attach a receipt to an expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
		parameters: [
			{
				name: 'expense_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
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
				name: 'receipt',
				in: 'query',
				required: false,
				description:
					'Expense receipt file to attach. Allowed Extensions: <code>gif</code>, <code>png</code>, <code>jpeg</code>, <code>jpg</code>, <code>bmp</code>, <code>pdf</code>, <code>xls</code>, <code>xlsx</code>, <code>doc</code> and <code>docx</code>.',
				schema: { type: 'string', format: 'binary' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-receipt-to-an-expense-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_expense_receipt',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'deleteExpenseReceipt',
		method: 'DELETE',
		path: '/expenses/{expense_id}/receipt',
		summary: 'Delete a receipt',
		description: 'Delete the receipt attached to the expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
		parameters: [
			{
				name: 'expense_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-a-receipt-response' },
			},
		],
		scopes: ['ZohoBooks.expenses.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'add_expense_attachment',
		group: 'expenses',
		groupSlug: 'expenses',
		name: 'addExpenseAttachment',
		method: 'POST',
		path: '/expenses/{expense_id}/attachment',
		summary: 'Add attachment to an expense',
		description:
			'Attach one or multiple files to an expense. This endpoint allows you to attach various types of documents to support your expense records. Returns document details for the uploaded attachments.',
		docsUrl: 'https://www.zoho.com/books/api/v3/expenses/',
		parameters: [
			{
				name: 'expense_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the expense. Note: This value is a set of numeric characters.',
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
		request: {
			mediaType: 'multipart/form-data',
			required: false,
			schema: {
				$ref: '#/components/schemas/add-attachment-to-an-expense-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/add-attachment-to-an-expense-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.CREATE'],
		riskLevel: 'write',
	},
];
