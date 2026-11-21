import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	account_id: {
		type: 'string',
		description: 'Unique identifier of the expense account for the line item.',
	},
	account_name: {
		description: 'For which Account the Expense is raised. Max-length [100]',
		type: 'string',
	},
	acquisition_vat_id: {
		description:
			'This is the ID of the tax applied in case this is an EU - goods expense and acquisition VAT needs to be reported.',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	acquisition_vat_summary: {
		description: 'Summary of the VAT Acquistion',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tax_name: { $ref: '#/components/schemas/tax_name' },
				tax_amount: { $ref: '#/components/schemas/tax_amount' },
			},
		},
	},
	acquisition_vat_total: {
		description: 'Enter the total acquisition vat.',
		type: 'number',
		format: 'double',
	},
	amount: {
		description: 'Recurring Expense amount.',
		type: 'number',
		format: 'double',
	},
	bcy_total: { type: 'number', format: 'double' },
	comment_id: { type: 'string' },
	commented_by: { type: 'string' },
	commented_by_id: { type: 'string' },
	'create-a-recurring-expense-request': {
		required: [
			'account_id',
			'recurrence_name',
			'start_date',
			'recurrence_frequency',
			'repeat_every',
			'amount',
		],
		type: 'object',
		properties: {
			account_id: { $ref: '#/components/schemas/account_id' },
			recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			recurrence_frequency: {
				$ref: '#/components/schemas/recurrence_frequency',
			},
			repeat_every: { $ref: '#/components/schemas/repeat_every' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			reverse_charge_tax_id: {
				$ref: '#/components/schemas/reverse_charge_tax_id',
			},
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: { $ref: '#/components/schemas/line_items' },
			amount: { $ref: '#/components/schemas/amount' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			product_type: { $ref: '#/components/schemas/product_type' },
			acquisition_vat_id: { $ref: '#/components/schemas/acquisition_vat_id' },
			reverse_charge_vat_id: {
				$ref: '#/components/schemas/reverse_charge_vat_id',
			},
			tax_id: { $ref: '#/components/schemas/tax_id' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			is_billable: { $ref: '#/components/schemas/is_billable' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			project_id: { $ref: '#/components/schemas/project_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'create-a-recurring-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_expense: {
				$ref: '#/components/schemas/recurring_expense-response',
			},
		},
	},
	created_time: { type: 'string' },
	currency_code: { type: 'string' },
	currency_id: {
		type: 'string',
		description:
			'Unique identifier of the currency used for the recurring expense.',
	},
	custom_fields: {
		description: 'Custom fields for a recurring-expense.',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				customfield_id: { $ref: '#/components/schemas/customfield_id' },
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	customer_id: {
		description: 'Search expenses by customer id.',
		type: 'string',
	},
	customer_name: {
		description:
			'Name of the Custome for which expense is raised. Max-length [100]',
		type: 'string',
	},
	customfield_id: {
		type: 'string',
		description: 'Unique identifier of the custom field.',
	},
	date: { type: 'string' },
	'delete-a-recurring-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: {
		description: 'Search recurring expenses by description. Max-length [100]',
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
		description: 'Place to where the goods/services are supplied',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	end_date: {
		description:
			'Date on which recurring expense has to expire. Can be left as empty to run forever. Format [yyyy-mm-dd].',
		type: 'string',
	},
	exchange_rate: {
		type: 'number',
		description: 'Exchange rate applied for the recurring expense currency.',
		format: 'double',
	},
	expense_id: { type: 'string' },
	filter_by: {
		description:
			'Filter expenses by expense status. Allowed Values <code>Status.All</code>, <code>Status.Active</code>, <code>Status.Expired</code> and <code>Status.Stopped</code>',
		type: 'string',
	},
	'get-a-recurring-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_expense: {
				type: 'object',
				properties: {
					recurring_expense_id: {
						$ref: '#/components/schemas/recurring_expense_id',
					},
					recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
					start_date: { $ref: '#/components/schemas/start_date' },
					end_date: { $ref: '#/components/schemas/end_date' },
					is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
					source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
					destination_of_supply: {
						$ref: '#/components/schemas/destination_of_supply',
					},
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
					destination_of_supply_state: {
						$ref: '#/components/schemas/destination_of_supply_state',
					},
					hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
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
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					acquisition_vat_total: {
						$ref: '#/components/schemas/acquisition_vat_total',
					},
					reverse_charge_vat_total: {
						$ref: '#/components/schemas/reverse_charge_vat_total',
					},
					acquisition_vat_summary: {
						$ref: '#/components/schemas/acquisition_vat_summary',
					},
					reverse_charge_vat_summary: {
						$ref: '#/components/schemas/reverse_charge_vat_summary',
					},
					recurrence_frequency: {
						$ref: '#/components/schemas/recurrence_frequency',
					},
					repeat_every: { $ref: '#/components/schemas/repeat_every' },
					last_created_date: { $ref: '#/components/schemas/last_created_date' },
					next_expense_date: { $ref: '#/components/schemas/next_expense_date' },
					account_id: { $ref: '#/components/schemas/account_id' },
					account_name: { $ref: '#/components/schemas/account_name' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					currency_code: { $ref: '#/components/schemas/currency_code' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					tax_id: { $ref: '#/components/schemas/tax_id' },
					tax_name: { $ref: '#/components/schemas/tax_name' },
					tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
					tax_amount: { $ref: '#/components/schemas/tax_amount' },
					sub_total: { $ref: '#/components/schemas/sub_total' },
					total: { $ref: '#/components/schemas/total' },
					bcy_total: { $ref: '#/components/schemas/bcy_total' },
					amount: { $ref: '#/components/schemas/amount' },
					description: { $ref: '#/components/schemas/description' },
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					is_billable: { $ref: '#/components/schemas/is_billable' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					customer_name: { $ref: '#/components/schemas/customer_name' },
					status: { $ref: '#/components/schemas/status' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					project_id: { $ref: '#/components/schemas/project_id' },
					project_name: { $ref: '#/components/schemas/project_name' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
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
							hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
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
	is_billable: {
		type: 'boolean',
		description: 'Indicates whether the expense is billable to a customer.',
	},
	is_inclusive_tax: {
		type: 'boolean',
		description:
			'Indicates whether the tax amount is inclusive in the expense amount.',
	},
	is_pre_gst: {
		description: 'Applicable for transactions that fall before july 1, 2017',
		type: 'boolean',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	is_reverse_charge_applied: {
		description: 'Applicable for transactions where you pay reverse charge',
		type: 'boolean',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	is_tag_mandatory: {
		description: 'Used to check if the tag is mandatory',
		type: 'boolean',
	},
	item_order: {
		type: 'string',
		description:
			'Order in which the line item appears in the recurring expense.',
	},
	item_total: { type: 'string' },
	last_created_date: {
		description:
			'Search recurring expenses by date on when last expense was generated. Variants: <code>last_created_date_start</code>, <code>last_created_date_end</code>, <code>last_created_date_before</code> and <code>last_created_date_after</code> . Format [yyyy-mm-dd]',
		type: 'string',
	},
	last_modified_time: { type: 'string' },
	line_item_id: { type: 'string', description: 'ID of the line item' },
	line_items: {
		type: 'array',
		description: 'Unique identifier of the line item.',
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
				tags: { $ref: '#/components/schemas/tags_response' },
			},
		},
	},
	'list-child-expenses-created-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			expensehistory: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						expense_id: { $ref: '#/components/schemas/expense_id' },
						date: { $ref: '#/components/schemas/date' },
						account_name: { $ref: '#/components/schemas/account_name' },
						customer_name: { $ref: '#/components/schemas/customer_name' },
						total: { $ref: '#/components/schemas/total' },
						status: { $ref: '#/components/schemas/status' },
						vendor_name: { $ref: '#/components/schemas/vendor_name' },
						paid_through_account_name: {
							$ref: '#/components/schemas/paid_through_account_name',
						},
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
					},
				},
			},
		},
	},
	'list-recurring-expense-history-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			comments: {
				type: 'object',
				properties: {
					comment_id: { $ref: '#/components/schemas/comment_id' },
					recurring_expense_id: {
						$ref: '#/components/schemas/recurring_expense_id',
					},
					description: { $ref: '#/components/schemas/description' },
					commented_by_id: { $ref: '#/components/schemas/commented_by_id' },
					commented_by: { $ref: '#/components/schemas/commented_by' },
					date: { $ref: '#/components/schemas/date' },
					time: { $ref: '#/components/schemas/time' },
					operation_type: { $ref: '#/components/schemas/operation_type' },
					transaction_id: { $ref: '#/components/schemas/transaction_id' },
					transaction_type: { $ref: '#/components/schemas/transaction_type' },
				},
			},
		},
	},
	'list-recurring-expenses-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_expenses: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						recurring_expense_id: {
							$ref: '#/components/schemas/recurring_expense_id',
						},
						recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
						recurrence_frequency: {
							$ref: '#/components/schemas/recurrence_frequency',
						},
						repeat_every: { $ref: '#/components/schemas/repeat_every' },
						last_created_date: {
							$ref: '#/components/schemas/last_created_date',
						},
						next_expense_date: {
							$ref: '#/components/schemas/next_expense_date',
						},
						account_name: { $ref: '#/components/schemas/account_name' },
						description: { $ref: '#/components/schemas/description' },
						currency_id: { $ref: '#/components/schemas/currency_id' },
						currency_code: { $ref: '#/components/schemas/currency_code' },
						total: { $ref: '#/components/schemas/total' },
						is_billable: { $ref: '#/components/schemas/is_billable' },
						customer_name: { $ref: '#/components/schemas/customer_name' },
						custom_fields: { $ref: '#/components/schemas/custom_fields' },
						status: { $ref: '#/components/schemas/status' },
						created_time: { $ref: '#/components/schemas/created_time' },
						last_modified_time: {
							$ref: '#/components/schemas/last_modified_time',
						},
						tags: { $ref: '#/components/schemas/tags_response' },
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
					},
				},
			},
		},
	},
	location_id: { description: 'Location ID', type: 'string' },
	location_name: { description: 'Name of the location.', type: 'string' },
	next_expense_date: {
		description:
			'Search recurring expenses by date on which next expense will be generated. Variants: <code>next_expense_date_start</code>, <code>next_expense_date_end</code>, <code>next_expense_date_before</code> and <code>next_expense_date_after</code> . Format [yyyy-mm-dd]',
		type: 'string',
	},
	operation_type: { type: 'string' },
	paid_through_account_name: { type: 'string' },
	place_of_supply: {
		description:
			'The place of supply is where a transaction is considered to have occurred for VAT purposes. For the supply of goods, the place of supply is the location of the goods when the supply occurs. For the supply of services, the place of supply should be where the supplier is established. (If not given, <code>place of contact</code> given for the contact will be taken)<br/>Supported codes for UAE emirates are : </br>Abu Dhabi - <code>AB</code>,</br>Ajman - <code>AJ</code>,</br>Dubai - <code>DU</code>,</br>Fujairah - <code>FU</code>,</br>Ras al-Khaimah - <code>RA</code>,</br>Sharjah - <code>SH</code>,</br>Umm al-Quwain - <code>UM</code>.<br/>Supported codes for the GCC countries are : </br>United Arab Emirates - <code>AE</code>,</br>Saudi Arabia - <code>SA</code>,</br>Bahrain - <code>BH</code>,</br>Kuwait - <code>KW</code>,</br>Oman - <code>OM</code>,</br>Qatar - <code>QA</code>.',
		type: 'string',
		'x-node_available_in': ['gcc'],
		'x-node_unavailable_in': [],
	},
	product_type: {
		description:
			'Type of the expense. This denotes whether the expense is to be treated as a goods or service or capital asset purchase. Allowed Values:<br/> <b>For UK edition:</b><code>digital_service</code>, <code>goods</code> and <code>service</code>.<br/><b>For SouthAfrica Edition:</b> <code>service</code>, <code>goods</code>, <code>capital_service</code> and <code>capital_goods</code>',
		type: 'string',
		'x-node_available_in': ['uk', 'za'],
		'x-node_unavailable_in': [],
	},
	project_id: {
		type: 'string',
		description:
			'Unique identifier of the project associated with the recurring expense.',
	},
	project_name: { type: 'string' },
	recurrence_frequency: {
		type: 'string',
		description: 'Frequency at which the recurring expense is generated.',
	},
	recurrence_name: {
		description: 'Name of the Recurring Expense. Max-length [100]',
		type: 'string',
	},
	'recurring_expense-response': {
		type: 'object',
		properties: {
			account_id: { $ref: '#/components/schemas/account_id' },
			recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			destination_of_supply_state: {
				$ref: '#/components/schemas/destination_of_supply_state',
			},
			hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
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
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			acquisition_vat_total: {
				$ref: '#/components/schemas/acquisition_vat_total',
			},
			reverse_charge_vat_total: {
				$ref: '#/components/schemas/reverse_charge_vat_total',
			},
			acquisition_vat_summary: {
				$ref: '#/components/schemas/acquisition_vat_summary',
			},
			reverse_charge_vat_summary: {
				$ref: '#/components/schemas/reverse_charge_vat_summary',
			},
			recurrence_frequency: {
				$ref: '#/components/schemas/recurrence_frequency',
			},
			repeat_every: { $ref: '#/components/schemas/repeat_every' },
			amount: { $ref: '#/components/schemas/amount' },
			total: { $ref: '#/components/schemas/total' },
			sub_total: { $ref: '#/components/schemas/sub_total' },
			bcy_total: { $ref: '#/components/schemas/bcy_total' },
			product_type: { $ref: '#/components/schemas/product_type' },
			acquisition_vat_id: { $ref: '#/components/schemas/acquisition_vat_id' },
			reverse_charge_vat_id: {
				$ref: '#/components/schemas/reverse_charge_vat_id',
			},
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tax_name: { $ref: '#/components/schemas/tax_name' },
			tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
			created_time: { $ref: '#/components/schemas/created_time' },
			last_modified_time: { $ref: '#/components/schemas/last_modified_time' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			is_billable: { $ref: '#/components/schemas/is_billable' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			project_id: { $ref: '#/components/schemas/project_id' },
			project_name: { $ref: '#/components/schemas/project_name' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
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
					hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
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
	recurring_expense_id: { type: 'string' },
	repeat_every: {
		type: 'string',
		description: 'Interval at which the recurring expense should repeat.',
	},
	'resume-a-recurring-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	reverse_charge_tax_amount: {
		description: 'Tax amount of the reverse charge',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_id: {
		description:
			'Enter reverse charge tax ID<br\\><b>For SouthAfrica edition:</b>(Required if customer tax treatment is <code>vat_registered</code>)<br/>Used to specify whether the transaction is applicable for Domestic Reverse Charge (DRC) or not.',
		type: 'string',
		'x-node_available_in': ['in', 'gcc', 'za'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_name: {
		description: 'Enter reverse charge tax name',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_tax_percentage: {
		description: 'Tax percentage of the reverse charge',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_vat_id: {
		description:
			'This is the ID of the tax applied in case this is a non UK - service expense and reverse charge VAT needs to be reported.',
		type: 'string',
		'x-node_available_in': ['in', 'uk'],
		'x-node_unavailable_in': [],
	},
	reverse_charge_vat_summary: {
		description: 'Summary of the Reverse Charge',
		type: 'array',
		items: {
			type: 'object',
			properties: {
				tax_name: { $ref: '#/components/schemas/tax_name' },
				tax_amount: { $ref: '#/components/schemas/tax_amount' },
			},
		},
	},
	reverse_charge_vat_total: {
		description: 'Enter the total of the reverse charge vat.',
		type: 'number',
		format: 'double',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	search_text: {
		description:
			'Search expenses by account name or description or <code>customer name</code>  or <code>vendor name</code>. Max-length [100] .',
		type: 'string',
	},
	sort_column: {
		description:
			'Sort expenses.Allowed Values <code>next_expense_date</code>, <code>account_name</code>, <code>total</code>, <code>last_created_date</code>, <code>recurrence_name</code>, <code>customer_name</code> and <code>created_time</code>',
		type: 'string',
	},
	source_of_supply: {
		description:
			'Place from where the goods/services are supplied. (If not given, <code>place of contact</code> given for the contact will be taken)',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	start_date: {
		description:
			'Start date of the recurring expense. Expenses will not be generated for dates prior to the current date. Format [yyyy-mm-dd].',
		type: 'string',
	},
	status: { description: 'Status of the recurring expense', type: 'string' },
	'stop-a-recurring-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	sub_total: { type: 'number', format: 'double' },
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
	tax_amount: { type: 'number', format: 'double' },
	tax_exemption_code: {
		description: 'Enter the code for tax exemption',
		type: 'string',
		'x-node_available_in': ['in', 'mx'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description: 'Enter ID of the tax exemption',
		type: 'string',
		'x-node_available_in': ['in', 'mx'],
		'x-node_unavailable_in': [],
	},
	tax_id: { type: 'string', description: 'ID of the tax.' },
	tax_name: { type: 'string' },
	tax_percentage: { type: 'number', format: 'double' },
	tax_treatment: {
		description:
			'VAT treatment for the recurring expense.Choose whether the contact falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> are supported only for <b>UAE</b>.<br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
		type: 'string',
		'x-node_available_in': ['gcc', 'mx', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	tax_type: { type: 'string' },
	time: { type: 'string' },
	total: { type: 'number', format: 'double' },
	transaction_id: { type: 'string' },
	transaction_type: { type: 'string' },
	'update-a-recurring-expense-request': {
		required: [
			'account_id',
			'recurrence_name',
			'start_date',
			'recurrence_frequency',
			'repeat_every',
			'amount',
		],
		type: 'object',
		properties: {
			account_id: { $ref: '#/components/schemas/account_id' },
			recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
			start_date: { $ref: '#/components/schemas/start_date' },
			end_date: { $ref: '#/components/schemas/end_date' },
			recurrence_frequency: {
				$ref: '#/components/schemas/recurrence_frequency',
			},
			repeat_every: { $ref: '#/components/schemas/repeat_every' },
			gst_no: { $ref: '#/components/schemas/gst_no' },
			source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
			destination_of_supply: {
				$ref: '#/components/schemas/destination_of_supply',
			},
			place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
			reverse_charge_tax_id: {
				$ref: '#/components/schemas/reverse_charge_tax_id',
			},
			location_id: { $ref: '#/components/schemas/location_id' },
			line_items: { $ref: '#/components/schemas/line_items' },
			amount: { $ref: '#/components/schemas/amount' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			product_type: { $ref: '#/components/schemas/product_type' },
			acquisition_vat_id: { $ref: '#/components/schemas/acquisition_vat_id' },
			reverse_charge_vat_id: {
				$ref: '#/components/schemas/reverse_charge_vat_id',
			},
			tax_id: { $ref: '#/components/schemas/tax_id' },
			is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
			is_billable: { $ref: '#/components/schemas/is_billable' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			project_id: { $ref: '#/components/schemas/project_id' },
			currency_id: { $ref: '#/components/schemas/currency_id' },
			exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
			custom_fields: { $ref: '#/components/schemas/custom_fields' },
			tags: { $ref: '#/components/schemas/tags' },
		},
	},
	'update-a-recurring-expense-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			recurring_expense: {
				type: 'object',
				properties: {
					account_id: { $ref: '#/components/schemas/account_id' },
					recurrence_name: { $ref: '#/components/schemas/recurrence_name' },
					start_date: { $ref: '#/components/schemas/start_date' },
					end_date: { $ref: '#/components/schemas/end_date' },
					is_pre_gst: { $ref: '#/components/schemas/is_pre_gst' },
					source_of_supply: { $ref: '#/components/schemas/source_of_supply' },
					destination_of_supply: {
						$ref: '#/components/schemas/destination_of_supply',
					},
					place_of_supply: { $ref: '#/components/schemas/place_of_supply' },
					gst_no: { $ref: '#/components/schemas/gst_no' },
					gst_treatment: { $ref: '#/components/schemas/gst_treatment' },
					tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
					destination_of_supply_state: {
						$ref: '#/components/schemas/destination_of_supply_state',
					},
					hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
					vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
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
					is_reverse_charge_applied: {
						$ref: '#/components/schemas/is_reverse_charge_applied',
					},
					acquisition_vat_total: {
						$ref: '#/components/schemas/acquisition_vat_total',
					},
					reverse_charge_vat_total: {
						$ref: '#/components/schemas/reverse_charge_vat_total',
					},
					acquisition_vat_summary: {
						$ref: '#/components/schemas/acquisition_vat_summary',
					},
					reverse_charge_vat_summary: {
						$ref: '#/components/schemas/reverse_charge_vat_summary',
					},
					recurrence_frequency: {
						$ref: '#/components/schemas/recurrence_frequency',
					},
					repeat_every: { $ref: '#/components/schemas/repeat_every' },
					amount: { description: 'Recurring Expense amount.', type: 'string' },
					total: { $ref: '#/components/schemas/total' },
					sub_total: { $ref: '#/components/schemas/sub_total' },
					bcy_total: { $ref: '#/components/schemas/bcy_total' },
					product_type: { $ref: '#/components/schemas/product_type' },
					acquisition_vat_id: {
						$ref: '#/components/schemas/acquisition_vat_id',
					},
					reverse_charge_vat_id: {
						$ref: '#/components/schemas/reverse_charge_vat_id',
					},
					tax_id: { $ref: '#/components/schemas/tax_id' },
					tax_name: { $ref: '#/components/schemas/tax_name' },
					tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
					created_time: { $ref: '#/components/schemas/created_time' },
					last_modified_time: {
						$ref: '#/components/schemas/last_modified_time',
					},
					is_inclusive_tax: { $ref: '#/components/schemas/is_inclusive_tax' },
					is_billable: { $ref: '#/components/schemas/is_billable' },
					customer_id: { $ref: '#/components/schemas/customer_id' },
					currency_id: { $ref: '#/components/schemas/currency_id' },
					exchange_rate: { $ref: '#/components/schemas/exchange_rate' },
					project_id: { $ref: '#/components/schemas/project_id' },
					project_name: { $ref: '#/components/schemas/project_name' },
					location_id: { $ref: '#/components/schemas/location_id' },
					location_name: { $ref: '#/components/schemas/location_name' },
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
							hsn_or_sac: { $ref: '#/components/schemas/hsn_or_sac' },
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
	value: { description: 'Value of the Custom Field', type: 'string' },
	vat_treatment: {
		description:
			'VAT treatment for the expense. VAT treatment denotes the location of the vendor, if the vendor resides in UK then the VAT treatment is <code>uk</code>. If the vendor is in an EU country & VAT registered, you are resides in Northen Ireland and purchasing Goods then his VAT treatment is <code>eu_vat_registered</code> and if he resides outside the UK then his VAT treatment is <code>overseas</code>(For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
	vendor_name: { type: 'string' },
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_recurring_expense',
		group: 'recurringExpenses',
		groupSlug: 'recurring-expenses',
		name: 'createRecurringExpense',
		method: 'POST',
		path: '/recurringexpenses',
		summary: 'Create a recurring expense',
		description: 'Create a recurring expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-expenses/',
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
				$ref: '#/components/schemas/create-a-recurring-expense-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-recurring-expense-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_recurring_expenses',
		group: 'recurringExpenses',
		groupSlug: 'recurring-expenses',
		name: 'listRecurringExpenses',
		method: 'GET',
		path: '/recurringexpenses',
		summary: 'List recurring expenses',
		description: 'List all the Expenses with pagination.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-expenses/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'recurrence_name',
				in: 'query',
				required: false,
				description:
					'Search recurring expenses by recurring expense name. Variants: <code>recurrence_name_startswith</code> and <code>recurrence_name_contains</code>. Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'last_created_date',
				in: 'query',
				required: false,
				description:
					'Search recurring expenses by date on when last expense was generated. Variants: <code>last_created_date_start</code>, <code>last_created_date_end</code>, <code>last_created_date_before</code> and <code>last_created_date_after</code> . Format [yyyy-mm-dd]',
				schema: { type: 'string' },
			},
			{
				name: 'next_expense_date',
				in: 'query',
				required: false,
				description:
					'Search recurring expenses by date on which next expense will be generated. Variants: <code>next_expense_date_start</code>, <code>next_expense_date_end</code>, <code>next_expense_date_before</code> and <code>next_expense_date_after</code> . Format [yyyy-mm-dd]',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Search expenses by expense status. Allowed Values <code>active</code>, <code>stopped</code> and <code>expired</code>',
				schema: { type: 'string' },
			},
			{
				name: 'account_id',
				in: 'query',
				required: false,
				description:
					'Unique identifier of the expense account for the line item.',
				schema: { type: 'string' },
			},
			{
				name: 'account_name',
				in: 'query',
				required: false,
				description:
					'Search expenses by expense account name. Variants <code>account_name_startswith</code> and <code>account_name_contains</code> . Max-length [100]',
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
				name: 'customer_name',
				in: 'query',
				required: false,
				description:
					'Search expenses by customer name. Variants: <code>customer_name_startswith</code> and <code>customer_name_contains</code> . Max-length [100]',
				schema: { type: 'string' },
			},
			{
				name: 'customer_id',
				in: 'query',
				required: false,
				description: 'Search expenses by customer id.',
				schema: { type: 'string' },
			},
			{
				name: 'paid_through_account_id',
				in: 'query',
				required: false,
				description: 'Search expenses by paid through account id.',
				schema: { type: 'string' },
			},
			{
				name: 'filter_by',
				in: 'query',
				required: false,
				description:
					'Filter expenses by expense status. Allowed Values <code>Status.All</code>, <code>Status.Active</code>, <code>Status.Expired</code> and <code>Status.Stopped</code>',
				schema: { type: 'string' },
			},
			{
				name: 'search_text',
				in: 'query',
				required: false,
				description:
					'Search expenses by account name or description or <code>customer name</code>  or <code>vendor name</code>. Max-length [100] .',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort expenses.Allowed Values <code>next_expense_date</code>, <code>account_name</code>, <code>total</code>, <code>last_created_date</code>, <code>recurrence_name</code>, <code>customer_name</code> and <code>created_time</code>',
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
					$ref: '#/components/schemas/list-recurring-expenses-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_recurring_expense_using_custom_field',
		group: 'recurringExpenses',
		groupSlug: 'recurring-expenses',
		name: 'updateRecurringExpenseUsingCustomField',
		method: 'PUT',
		path: '/recurringexpenses',
		summary: "Update an recurring expense using a custom field's unique value",
		description:
			"A custom field will have unique values if it's configured to not accept duplicate values. Now, you can use that custom field's value to update a recurring expense by providing its API name in the X-Unique-Identifier-Key header and its value in the X-Unique-Identifier-Value header. Based on this value, the corresponding recurring expense will be retrieved and updated. Additionally, there is an optional X-Upsert header. If the X-Upsert header is true and the custom field's unique value is not found in any of the existing recurring expenses, a new recurring expense will be created if the necessary payload details are available",
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-expenses/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
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
			schema: {
				$ref: '#/components/schemas/update-a-recurring-expense-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-recurring-expense-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_recurring_expense',
		group: 'recurringExpenses',
		groupSlug: 'recurring-expenses',
		name: 'updateRecurringExpense',
		method: 'PUT',
		path: '/recurringexpenses/{recurring_expense_id}',
		summary: 'Update a recurring expense',
		description: 'Update a recurring expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-expenses/',
		parameters: [
			{
				name: 'recurring_expense_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring expense.',
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
				$ref: '#/components/schemas/update-a-recurring-expense-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-recurring-expense-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_recurring_expense',
		group: 'recurringExpenses',
		groupSlug: 'recurring-expenses',
		name: 'getRecurringExpense',
		method: 'GET',
		path: '/recurringexpenses/{recurring_expense_id}',
		summary: 'Get a recurring expense',
		description: 'Get the details of the recurring expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-expenses/',
		parameters: [
			{
				name: 'recurring_expense_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring expense.',
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
					$ref: '#/components/schemas/get-a-recurring-expense-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_recurring_expense',
		group: 'recurringExpenses',
		groupSlug: 'recurring-expenses',
		name: 'deleteRecurringExpense',
		method: 'DELETE',
		path: '/recurringexpenses/{recurring_expense_id}',
		summary: 'Delete a recurring expense',
		description: 'Deleting an existing recurring expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-expenses/',
		parameters: [
			{
				name: 'recurring_expense_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring expense.',
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
					$ref: '#/components/schemas/delete-a-recurring-expense-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'stop_recurring_expense',
		group: 'recurringExpenses',
		groupSlug: 'recurring-expenses',
		name: 'stopRecurringExpense',
		method: 'POST',
		path: '/recurringexpenses/{recurring_expense_id}/status/stop',
		summary: 'Stop a recurring expense',
		description: 'Stop an active recurring expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-expenses/',
		parameters: [
			{
				name: 'recurring_expense_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring expense.',
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
					$ref: '#/components/schemas/stop-a-recurring-expense-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'resume_recurring_expense',
		group: 'recurringExpenses',
		groupSlug: 'recurring-expenses',
		name: 'resumeRecurringExpense',
		method: 'POST',
		path: '/recurringexpenses/{recurring_expense_id}/status/resume',
		summary: 'Resume a recurring Expense',
		description: 'Resume a stopped recurring expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-expenses/',
		parameters: [
			{
				name: 'recurring_expense_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring expense.',
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
					$ref: '#/components/schemas/resume-a-recurring-expense-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_child_expenses_of_recurring_expense',
		group: 'recurringExpenses',
		groupSlug: 'recurring-expenses',
		name: 'listChildExpensesOfRecurringExpense',
		method: 'GET',
		path: '/recurringexpenses/{recurring_expense_id}/expenses',
		summary: 'List child expenses created',
		description: 'List child expenses created from recurring expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-expenses/',
		parameters: [
			{
				name: 'recurring_expense_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring expense.',
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
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Sort expenses.Allowed Values <code>next_expense_date</code>, <code>account_name</code>, <code>total</code>, <code>last_created_date</code>, <code>recurrence_name</code>, <code>customer_name</code> and <code>created_time</code>',
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
					$ref: '#/components/schemas/list-child-expenses-created-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.READ'],
		riskLevel: 'read',
	},
	{
		id: 'list_recurring_expense_history',
		group: 'recurringExpenses',
		groupSlug: 'recurring-expenses',
		name: 'listRecurringExpenseHistory',
		method: 'GET',
		path: '/recurringexpenses/{recurring_expense_id}/comments',
		summary: 'List recurring expense history',
		description: 'Get history and comments of a recurring expense.',
		docsUrl: 'https://www.zoho.com/books/api/v3/recurring-expenses/',
		parameters: [
			{
				name: 'recurring_expense_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the recurring expense.',
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
					$ref: '#/components/schemas/list-recurring-expense-history-response',
				},
			},
		],
		scopes: ['ZohoBooks.expenses.READ'],
		riskLevel: 'read',
	},
];
