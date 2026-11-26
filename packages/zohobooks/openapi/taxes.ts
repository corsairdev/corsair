import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	applied_filter: {
		description: 'The filer applied for sorting',
		type: 'string',
	},
	country: {
		description: 'Country to which the tax belongs.',
		type: 'string',
		'x-node_available_in': ['uk', 'eu', 'global'],
		'x-node_unavailable_in': [],
	},
	country_code: {
		description:
			'Two letter country code for the EU country to which the tax belongs.',
		type: 'string',
		'x-node_available_in': ['uk', 'eu', 'gcc', 'global'],
		'x-node_unavailable_in': [],
	},
	'create-a-tax-authority-us-and-ca-edition-only-request': {
		required: ['tax_authority_name'],
		type: 'object',
		properties: {
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			description: { $ref: '#/components/schemas/description' },
			registration_number: { $ref: '#/components/schemas/registration_number' },
			registration_number_label: {
				$ref: '#/components/schemas/registration_number_label',
			},
		},
	},
	'create-a-tax-authority-us-and-ca-edition-only-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_authority: { $ref: '#/components/schemas/tax_authority' },
		},
	},
	'create-a-tax-exemption-us-edition-only-request': {
		required: ['tax_exemption_code', 'type'],
		type: 'object',
		properties: {
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
			description: { description: 'Description', type: 'string' },
			type: { $ref: '#/components/schemas/type' },
		},
	},
	'create-a-tax-exemption-us-edition-only-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_exemption: {
				type: 'object',
				properties: {
					tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
					tax_exemption_code: {
						$ref: '#/components/schemas/tax_exemption_code',
					},
					description: { description: 'Description', type: 'string' },
					type: { $ref: '#/components/schemas/type' },
				},
			},
		},
	},
	'create-a-tax-group-request': {
		type: 'object',
		properties: {
			tax_group_name: { $ref: '#/components/schemas/tax_group_name' },
			taxes: { $ref: '#/components/schemas/taxes' },
		},
	},
	'create-a-tax-group-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_group: {
				type: 'object',
				properties: {
					tax_group_id: { $ref: '#/components/schemas/tax_group_id' },
					tax_group_name: { $ref: '#/components/schemas/tax_group_name' },
					tax_group_percentage: {
						$ref: '#/components/schemas/tax_group_percentage',
					},
					taxes: {
						description:
							'Comma Seperated list of tax IDs that are to be associated to the tax group.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tax_name: { $ref: '#/components/schemas/tax_name' },
								tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
								tax_type: { $ref: '#/components/schemas/tax_type' },
								tax_factor: { $ref: '#/components/schemas/tax_factor' },
								tax_authority_id: {
									$ref: '#/components/schemas/tax_authority_id',
								},
								tax_authority_name: {
									$ref: '#/components/schemas/tax_authority_name',
								},
							},
						},
					},
				},
			},
		},
	},
	'create-a-tax-request': {
		type: 'object',
		properties: {
			tax_name: { $ref: '#/components/schemas/tax_name' },
			tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
			tax_type: { $ref: '#/components/schemas/tax_type' },
			tax_factor: { $ref: '#/components/schemas/tax_factor' },
			tax_specific_type: { $ref: '#/components/schemas/tax_specific_type' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			country_code: { $ref: '#/components/schemas/country_code' },
			purchase_tax_expense_account_id: {
				$ref: '#/components/schemas/purchase_tax_expense_account_id',
			},
			is_value_added: { $ref: '#/components/schemas/is_value_added' },
			update_recurring_invoice: {
				$ref: '#/components/schemas/update_recurring_invoice',
			},
			update_recurring_expense: {
				$ref: '#/components/schemas/update_recurring_expense',
			},
			update_draft_invoice: {
				$ref: '#/components/schemas/update_draft_invoice',
			},
			update_recurring_bills: {
				$ref: '#/components/schemas/update_recurring_bills',
			},
			update_draft_so: { $ref: '#/components/schemas/update_draft_so' },
			update_subscription: { $ref: '#/components/schemas/update_subscription' },
			update_project: { $ref: '#/components/schemas/update_project' },
			is_editable: { $ref: '#/components/schemas/is_editable' },
		},
	},
	'create-a-tax-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax: { $ref: '#/components/schemas/tax' },
		},
	},
	'delete-a-tax-authority-us-and-ca-edition-only-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-a-tax-exemption-us-edition-only-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-a-tax-group-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-a-tax-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	description: { description: 'Description.', type: 'string' },
	'get-a-tax-authority-us-and-ca-edition-only-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_authority: { $ref: '#/components/schemas/tax_authority' },
		},
	},
	'get-a-tax-exemption-us-edition-only-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_exemption: {
				type: 'object',
				properties: {
					tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
					tax_exemption_code: {
						$ref: '#/components/schemas/tax_exemption_code',
					},
					description: {
						description: 'Description of the Tax Exemption.',
						type: 'string',
					},
					type: {
						description:
							'Type of the tax exemption, can be <code>customer</code> or <code>item</code>.',
						type: 'string',
					},
				},
			},
		},
	},
	'get-a-tax-group-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_group: {
				type: 'object',
				properties: {
					tax_group_id: { $ref: '#/components/schemas/tax_group_id' },
					tax_group_name: { $ref: '#/components/schemas/tax_group_name' },
					tax_group_percentage: {
						$ref: '#/components/schemas/tax_group_percentage',
					},
					taxes: {
						description:
							'Comma Seperated list of tax IDs that are to be associated to the tax group.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tax_name: { $ref: '#/components/schemas/tax_name' },
								tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
								tax_type: { $ref: '#/components/schemas/tax_type' },
								tax_factor: { $ref: '#/components/schemas/tax_factor' },
								tax_authority_id: {
									$ref: '#/components/schemas/tax_authority_id',
								},
								tax_authority_name: {
									$ref: '#/components/schemas/tax_authority_name',
								},
							},
						},
					},
				},
			},
		},
	},
	'get-a-tax-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax: { $ref: '#/components/schemas/tax' },
		},
	},
	has_more_page: { description: 'Check if has more pages', type: 'boolean' },
	is_default_tax: { description: 'Check is Tax is default', type: 'boolean' },
	is_editable: { description: 'Check if tax is editable', type: 'boolean' },
	is_value_added: {
		description: 'Check if Tax is Value Added',
		type: 'boolean',
	},
	'list-tax-authorities-us-edition-only-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_authorities: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
						tax_authority_name: {
							$ref: '#/components/schemas/tax_authority_name',
						},
						description: { $ref: '#/components/schemas/description' },
						registration_number: {
							$ref: '#/components/schemas/registration_number',
						},
						registration_number_label: {
							$ref: '#/components/schemas/registration_number_label',
						},
					},
				},
			},
		},
	},
	'list-tax-exemptions-us-edition-only-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_exemptions: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
						tax_exemption_code: {
							$ref: '#/components/schemas/tax_exemption_code',
						},
						description: { description: 'Description.', type: 'string' },
						type: {
							description:
								'Type of the tax exemption, can be <code>customer</code> or <code>item</code>.',
							type: 'string',
						},
					},
				},
			},
		},
	},
	'list-taxes-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			taxes: {
				description:
					'Comma Seperated list of tax IDs that are to be associated to the tax group.',
				type: 'array',
				items: {
					type: 'object',
					properties: {
						tax_id: { $ref: '#/components/schemas/tax_id' },
						tax_name: { $ref: '#/components/schemas/tax_name' },
						tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
						tax_type: { $ref: '#/components/schemas/tax_type' },
						tax_factor: { $ref: '#/components/schemas/tax_factor' },
						tax_specific_type: {
							$ref: '#/components/schemas/tax_specific_type',
						},
						tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
						tax_authority_name: {
							$ref: '#/components/schemas/tax_authority_name',
						},
						is_value_added: { $ref: '#/components/schemas/is_value_added' },
						is_default_tax: { $ref: '#/components/schemas/is_default_tax' },
						is_editable: { $ref: '#/components/schemas/is_editable' },
						output_tax_account_name: {
							$ref: '#/components/schemas/output_tax_account_name',
						},
						purchase_tax_account_name: {
							$ref: '#/components/schemas/purchase_tax_account_name',
						},
						tax_account_id: { $ref: '#/components/schemas/tax_account_id' },
						purchase_tax_account_id: {
							$ref: '#/components/schemas/purchase_tax_account_id',
						},
					},
				},
			},
			page_context: {
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
		},
	},
	output_tax_account_name: {
		type: 'string',
		description: 'Account Name in which Output Tax will be Computed',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	page: { description: 'Number of pages', type: 'integer' },
	per_page: { description: 'Per page values', type: 'integer' },
	purchase_tax_account_id: {
		description:
			'ID of the tax account, in case of withholding tax. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	purchase_tax_account_name: {
		type: 'string',
		description: 'Account Name in which Purchase Tax will be Computed',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	purchase_tax_expense_account_id: {
		description:
			'Account ID in which Purchase Tax will be Computed. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['au', 'ca'],
		'x-node_unavailable_in': [],
	},
	registration_number: {
		description: 'Registration Number of the Tax Authority',
		type: 'string',
		'x-node_available_in': ['ca'],
		'x-node_unavailable_in': [],
	},
	registration_number_label: {
		type: 'string',
		description:
			'Label used to identify the tax authority registration number.',
		'x-node_available_in': ['ca'],
		'x-node_unavailable_in': [],
	},
	report_name: { description: 'The report name', type: 'string' },
	sort_column: {
		description:
			'Sort taxes.Allowed Values: <code>tax_name</code>, <code>taxes</code>, <code>date</code>, <code> due_date</code>, <code>total</code>, <code>balance</code> and  <code>created_time</code>',
		type: 'string',
	},
	sort_order: { description: 'The order for sorting', type: 'string' },
	tax: { type: 'array', items: { $ref: '#/components/schemas/tax-response' } },
	'tax-response': {
		type: 'object',
		properties: {
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tax_name: { $ref: '#/components/schemas/tax_name' },
			tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
			tax_type: { $ref: '#/components/schemas/tax_type' },
			tax_factor: { $ref: '#/components/schemas/tax_factor' },
			tds_payable_account_id: {
				$ref: '#/components/schemas/tds_payable_account_id',
			},
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			is_value_added: { $ref: '#/components/schemas/is_value_added' },
			tax_specific_type: { $ref: '#/components/schemas/tax_specific_type' },
			country: { $ref: '#/components/schemas/country' },
			country_code: { $ref: '#/components/schemas/country_code' },
			purchase_tax_expense_account_id: {
				$ref: '#/components/schemas/purchase_tax_expense_account_id',
			},
		},
	},
	tax_account_id: {
		type: 'string',
		description:
			'Account ID in which tax will be Computed. Note: This value is a set of numeric characters.',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	tax_authority: {
		type: 'object',
		properties: {
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			description: { $ref: '#/components/schemas/description' },
			registration_number: { $ref: '#/components/schemas/registration_number' },
			registration_number_label: {
				$ref: '#/components/schemas/registration_number_label',
			},
		},
	},
	tax_authority_id: {
		description:
			'ID of the tax authority. Tax authority depends on the location of the customer. For sample, if the customer is located in NY, then the tax authority is NY tax authority. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['us', 'mx'],
		'x-node_unavailable_in': [],
	},
	tax_authority_name: {
		description: 'Name of the Tax Authority',
		type: 'string',
	},
	tax_exemption_code: {
		description: 'Code of the Tax Exemption',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description:
			'ID of the Tax Exemption. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['in'],
		'x-node_unavailable_in': [],
	},
	tax_factor: {
		description:
			'Type of Tax Factor. Allowed values: <code>rate</code>, <code>share</code>',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	tax_group_id: {
		description:
			'the id of the tax group. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	tax_group_name: {
		description: 'Name of the tax group to be created.',
		type: 'string',
	},
	tax_group_percentage: {
		description: 'Number of percentage taxable.',
		type: 'number',
		format: 'double',
	},
	tax_id: {
		description:
			'ID of the Tax. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	tax_name: { description: 'Name of the Tax', type: 'string' },
	tax_percentage: {
		description: 'Number of Percentage Taxable.',
		type: 'number',
		format: 'double',
	},
	tax_specific_type: {
		description:
			'Type of Tax For <b>Indian</b> Edition. Allowed Values : <code>igst</code> ,<code>cgst</code> ,<code>sgst</code> ,<code>nil</code>, <code> cess </code>.</br>Type of Tax for <b>Mexico</b> Edition. Allowed Values : <code>isr</code>, <code>iva</code>, <code>ieps</code>.</br>Type of Tax for <b>South Africa</b> Edition. Allowed Values : </br><code>soa_less_than_28d</code> - Supply of accommodation not exceeding 28 days, </br><code>soa_more_than_28d</code> - Supply of accommodation exceeding than 28 days, </br><code>ciu_prev_tax_supply</code> - Change in use (Taxable supplies), </br><code>ciu_prev_nontax_supply</code> - Change in use (Non-Taxable supplies), </br><code>export_of_shg</code> - Export of second hand goods.',
		type: 'string',
		'x-node_available_in': ['in', 'mx', 'za'],
		'x-node_unavailable_in': [],
	},
	tax_type: {
		description:
			'Type to determine whether it is a simple or compound tax. <code>Allowed Values: tax and compound_tax</code>',
		type: 'string',
	},
	taxes: {
		description:
			'Comma Seperated list of tax IDs that are to be associated to the tax group.',
		type: 'string',
	},
	tds_payable_account_id: {
		description:
			'Input Tax ID. The amount of money charged to you as Tax on your purchases. Note: This value is a set of numeric characters.',
		type: 'string',
		'x-node_available_in': ['mx'],
		'x-node_unavailable_in': [],
	},
	type: {
		description:
			'Type of the tax exemption, can be <code>customer</code> or <code>item</code>.',
		type: 'string',
	},
	'update-a-tax-authority-us-and-ca-edition-only-request': {
		type: 'object',
		properties: {
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			description: { $ref: '#/components/schemas/description' },
			registration_number: { $ref: '#/components/schemas/registration_number' },
			registration_number_label: {
				$ref: '#/components/schemas/registration_number_label',
			},
		},
	},
	'update-a-tax-authority-us-and-ca-edition-only-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_authority: { $ref: '#/components/schemas/tax_authority' },
		},
	},
	'update-a-tax-exemption-us-edition-only-request': {
		required: ['tax_exemption_code', 'type'],
		type: 'object',
		properties: {
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
			description: { description: 'Description', type: 'string' },
			type: { $ref: '#/components/schemas/type' },
		},
	},
	'update-a-tax-exemption-us-edition-only-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_exemption: {
				type: 'object',
				properties: {
					tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
					tax_exemption_code: {
						$ref: '#/components/schemas/tax_exemption_code',
					},
					description: { description: 'Description', type: 'string' },
					type: { $ref: '#/components/schemas/type' },
				},
			},
		},
	},
	'update-a-tax-group-request': {
		type: 'object',
		properties: {
			tax_group_name: { $ref: '#/components/schemas/tax_group_name' },
			taxes: { $ref: '#/components/schemas/taxes' },
		},
	},
	'update-a-tax-group-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax_group: {
				type: 'object',
				properties: {
					tax_group_id: { $ref: '#/components/schemas/tax_group_id' },
					tax_group_name: { $ref: '#/components/schemas/tax_group_name' },
					tax_group_percentage: {
						$ref: '#/components/schemas/tax_group_percentage',
					},
					taxes: {
						description:
							'Comma Seperated list of tax IDs that are to be associated to the tax group.',
						type: 'array',
						items: {
							type: 'object',
							properties: {
								tax_id: { $ref: '#/components/schemas/tax_id' },
								tax_name: { $ref: '#/components/schemas/tax_name' },
								tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
								tax_type: { $ref: '#/components/schemas/tax_type' },
								tax_factor: { $ref: '#/components/schemas/tax_factor' },
								tax_authority_id: {
									$ref: '#/components/schemas/tax_authority_id',
								},
								tax_authority_name: {
									$ref: '#/components/schemas/tax_authority_name',
								},
							},
						},
					},
				},
			},
		},
	},
	'update-a-tax-request': {
		type: 'object',
		properties: {
			tax_id: { $ref: '#/components/schemas/tax_id' },
			tax_name: { $ref: '#/components/schemas/tax_name' },
			tax_percentage: { $ref: '#/components/schemas/tax_percentage' },
			tax_type: { $ref: '#/components/schemas/tax_type' },
			tax_factor: { $ref: '#/components/schemas/tax_factor' },
			tax_specific_type: { $ref: '#/components/schemas/tax_specific_type' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			country_code: { $ref: '#/components/schemas/country_code' },
			purchase_tax_expense_account_id: {
				$ref: '#/components/schemas/purchase_tax_expense_account_id',
			},
			is_value_added: { $ref: '#/components/schemas/is_value_added' },
			update_recurring_invoice: {
				$ref: '#/components/schemas/update_recurring_invoice',
			},
			update_recurring_expense: {
				$ref: '#/components/schemas/update_recurring_expense',
			},
			update_draft_invoice: {
				$ref: '#/components/schemas/update_draft_invoice',
			},
			update_recurring_bills: {
				$ref: '#/components/schemas/update_recurring_bills',
			},
			update_draft_so: { $ref: '#/components/schemas/update_draft_so' },
			update_subscription: { $ref: '#/components/schemas/update_subscription' },
			update_project: { $ref: '#/components/schemas/update_project' },
			is_editable: { $ref: '#/components/schemas/is_editable' },
			tds_payable_account_id: {
				$ref: '#/components/schemas/tds_payable_account_id',
			},
		},
	},
	'update-a-tax-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			tax: { $ref: '#/components/schemas/tax' },
		},
	},
	update_draft_invoice: {
		description: 'Check if Draft Invoices should be updated',
		type: 'boolean',
	},
	update_draft_so: {
		description: 'Check if Draft Sales Orders should be updated',
		type: 'boolean',
	},
	update_project: {
		description: 'Check if Projects should be updated',
		type: 'boolean',
	},
	update_recurring_bills: {
		description: 'Check if Recurring Bills should be updated',
		type: 'boolean',
	},
	update_recurring_expense: {
		description: 'Check if recurring expenses should be updated',
		type: 'boolean',
	},
	update_recurring_invoice: {
		description: 'Check if recurring invoice should be updated',
		type: 'boolean',
	},
	update_subscription: {
		description: 'Check if Subscriptions should be updated',
		type: 'boolean',
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'create_tax',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'createTax',
		method: 'POST',
		path: '/settings/taxes',
		summary: 'Create a tax',
		description:
			'Create a tax which can be associated with an item. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
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
			schema: { $ref: '#/components/schemas/create-a-tax-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-tax-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_taxes',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'listTaxes',
		method: 'GET',
		path: '/settings/taxes',
		summary: 'List taxes',
		description:
			'List of simple and compound taxes with pagination. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
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
				schema: { $ref: '#/components/schemas/list-taxes-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_tax',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'updateTax',
		method: 'PUT',
		path: '/settings/taxes/{tax_id}',
		summary: 'Update a tax',
		description:
			'Update the details of a simple or compound tax. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax. Note: This value is a set of numeric characters.',
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
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-tax-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-tax-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_tax',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'getTax',
		method: 'GET',
		path: '/settings/taxes/{tax_id}',
		summary: 'Get a tax',
		description:
			'Get the details of a simple or compound tax. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/get-a-tax-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_tax',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'deleteTax',
		method: 'DELETE',
		path: '/settings/taxes/{tax_id}',
		summary: 'Delete a tax',
		description:
			'Delete a simple or compound tax. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-a-tax-response' },
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_tax_group',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'getTaxGroup',
		method: 'GET',
		path: '/settings/taxgroups/{tax_group_id}',
		summary: 'Get a tax group',
		description:
			'Get the details of a tax group. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_group_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax group. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/get-a-tax-group-response' },
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_tax_group',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'updateTaxGroup',
		method: 'PUT',
		path: '/settings/taxgroups/{tax_group_id}',
		summary: 'Update a tax group',
		description:
			'Update the details of the tax group. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_group_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax group. Note: This value is a set of numeric characters.',
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
			mediaType: 'application/json',
			required: false,
			schema: { $ref: '#/components/schemas/update-a-tax-group-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-tax-group-response' },
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_tax_group',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'deleteTaxGroup',
		method: 'DELETE',
		path: '/settings/taxgroups/{tax_group_id}',
		summary: 'Delete a tax group',
		description:
			'Delete a tax group. Tax group that is associated to transactions cannot be deleted. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_group_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax group. Note: This value is a set of numeric characters.',
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
				schema: { $ref: '#/components/schemas/delete-a-tax-group-response' },
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'create_tax_group',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'createTaxGroup',
		method: 'POST',
		path: '/settings/taxgroups',
		summary: 'Create a tax group',
		description:
			'Create a tax group associating multiple taxes. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
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
			schema: { $ref: '#/components/schemas/create-a-tax-group-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-tax-group-response' },
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'create_tax_authority',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'createTaxAuthority',
		method: 'POST',
		path: '/settings/taxauthorities',
		summary: 'Create a tax authority [US and CA Edition only]',
		description:
			'Create a tax authority. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
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
			schema: {
				$ref: '#/components/schemas/create-a-tax-authority-us-and-ca-edition-only-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-tax-authority-us-and-ca-edition-only-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_tax_authorities',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'listTaxAuthorities',
		method: 'GET',
		path: '/settings/taxauthorities',
		summary: 'List tax authorities [US Edition only]',
		description:
			'List of tax authorities. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
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
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-tax-authorities-us-edition-only-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_tax_authority',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'updateTaxAuthority',
		method: 'PUT',
		path: '/settings/taxauthorities/{tax_authority_id}',
		summary: 'Update a tax authority [US and CA Edition only]',
		description:
			'Update the details of a tax authority. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_authority_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax authority. Note: This value is a set of numeric characters.',
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
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/update-a-tax-authority-us-and-ca-edition-only-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-tax-authority-us-and-ca-edition-only-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_tax_authority',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'getTaxAuthority',
		method: 'GET',
		path: '/settings/taxauthorities/{tax_authority_id}',
		summary: 'Get a tax authority [US and CA Edition only]',
		description:
			'Get the details of a tax authority. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_authority_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax authority. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-a-tax-authority-us-and-ca-edition-only-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_tax_authority',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'deleteTaxAuthority',
		method: 'DELETE',
		path: '/settings/taxauthorities/{tax_authority_id}',
		summary: 'Delete a tax authority [US and CA Edition only]',
		description:
			'Delete a tax authority. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_authority_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax authority. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-a-tax-authority-us-and-ca-edition-only-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'create_tax_exemption',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'createTaxExemption',
		method: 'POST',
		path: '/settings/taxexemptions',
		summary: 'Create a tax exemption [US Edition only]',
		description:
			'Create a tax exemption. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
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
			schema: {
				$ref: '#/components/schemas/create-a-tax-exemption-us-edition-only-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-tax-exemption-us-edition-only-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_tax_exemptions',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'listTaxExemptions',
		method: 'GET',
		path: '/settings/taxexemptions',
		summary: 'List tax exemptions [US Edition only]',
		description:
			'List of tax exemptions. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
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
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-tax-exemptions-us-edition-only-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_tax_exemption',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'updateTaxExemption',
		method: 'PUT',
		path: '/settings/taxexemptions/{tax_exemption_id}',
		summary: 'Update a tax exemption [US Edition only]',
		description:
			'Update the details of a tax exemption. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_exemption_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax exemption. Note: This value is a set of numeric characters.',
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
			mediaType: 'application/json',
			required: false,
			schema: {
				$ref: '#/components/schemas/update-a-tax-exemption-us-edition-only-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-tax-exemption-us-edition-only-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_tax_exemption',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'getTaxExemption',
		method: 'GET',
		path: '/settings/taxexemptions/{tax_exemption_id}',
		summary: 'Get a tax exemption [US Edition only]',
		description:
			'Get the details of a tax exemption. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_exemption_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax exemption. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-a-tax-exemption-us-edition-only-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_tax_exemption',
		group: 'taxes',
		groupSlug: 'taxes',
		name: 'deleteTaxExemption',
		method: 'DELETE',
		path: '/settings/taxexemptions/{tax_exemption_id}',
		summary: 'Delete a tax exemption [US Edition only]',
		description:
			'Delete a tax exemption. Note: You have to enable Sales Tax in order to perform tax related operations.',
		docsUrl: 'https://www.zoho.com/books/api/v3/taxes/',
		parameters: [
			{
				name: 'tax_exemption_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the tax exemption. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-a-tax-exemption-us-edition-only-response',
				},
			},
		],
		scopes: ['ZohoBooks.settings.DELETE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
