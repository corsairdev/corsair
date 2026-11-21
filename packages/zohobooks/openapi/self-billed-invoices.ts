import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas: Record<string, JsonValue> = {
	'create-a-self-billed-invoice-request': {
		type: 'object',
		required: ['bill_number', 'vendor_id', 'line_items', 'entity_type'],
		properties: {
			bill_number: {
				type: 'string',
				description:
					'Unique bill number for the self-billed invoice. Maximum length: 50 characters.',
				maxLength: 50,
			},
			vendor_id: {
				type: 'string',
				description:
					'Unique identifier of the vendor (supplier on whose behalf the invoice is raised). Note: This value is a set of numeric characters.',
			},
			reference_number: {
				type: 'string',
				description: 'Reference number for the self-billed invoice.',
			},
			date: {
				type: 'string',
				description: 'Date of the self-billed invoice. Format: yyyy-mm-dd.',
				format: 'date',
			},
			due_date: {
				type: 'string',
				description: 'Due date for payment. Format: yyyy-mm-dd.',
				format: 'date',
			},
			terms: {
				type: 'string',
				description:
					'Payment terms notes for the self-billed invoice. Maximum length: 10000 characters.',
				maxLength: 10000,
			},
			adjustment: {
				type: 'number',
				description: 'Adjustment amount applied to the total.',
			},
			adjustment_description: {
				type: 'string',
				description:
					'Description for the adjustment amount. Maximum length: 100 characters.',
				maxLength: 100,
			},
			is_draft: {
				type: 'boolean',
				description:
					'Set to <code>true</code> to save the self-billed invoice as a draft.',
			},
			pricebook_id: {
				type: 'string',
				description:
					'Unique identifier of the price book to apply. Note: This value is a set of numeric characters.',
			},
			is_item_level_tax_calc: {
				type: 'boolean',
				description:
					'Set to <code>true</code> to calculate tax at the line-item level.',
			},
			is_inclusive_tax: {
				type: 'boolean',
				description:
					'Set to <code>true</code> if the line-item rates are inclusive of tax.',
			},
			discount: {
				type: 'number',
				description: 'Entity-level discount applied to the subtotal.',
			},
			discount_code: {
				type: 'string',
				maxLength: 200,
				description:
					'Discount reason code for the entity-level discount. Maximum length: 200 characters.',
				'x-node_available_in': ['uae'],
			},
			discount_account_id: {
				type: 'string',
				description:
					'Unique identifier of the account to post the discount amount. Note: This value is a set of numeric characters.',
			},
			discount_type: {
				type: 'string',
				description:
					'Level at which the discount is applied. Allowed values: <code>entity_level</code>, <code>item_level</code>.',
			},
			is_discount_before_tax: {
				type: 'boolean',
				description:
					'Set to <code>true</code> to apply the discount before tax calculation.',
			},
			payment_terms: {
				type: 'integer',
				description: 'Number of days within which payment is due.',
			},
			payment_terms_label: {
				type: 'string',
				description: 'Label for the payment terms (e.g., Net 30).',
			},
			payment_mode: {
				type: 'string',
				description:
					'Mode of payment expected from the buyer. Allowed values: <code>cash</code>, <code>cheque</code>, <code>bank_transfer</code>, <code>sepa_credit_transfer</code>, <code>debit_transfer</code>, <code>card</code>, <code>not_specified</code>, <code>bankers_draft</code>, <code>credit_transfer</code>, <code>direct_debit</code>, <code>sepa_direct_debit</code>, <code>bank_cheque</code>, <code>credit_card</code>, <code>debit_card</code>, <code>online_payment_service</code>.',
				'x-node_available_in': ['uae'],
			},
			bank_account_id: {
				type: 'string',
				description:
					'Unique identifier of the bank account for the expected payment. Note: This value is a set of numeric characters.',
				'x-node_available_in': ['uae'],
			},
			account_id: {
				type: 'string',
				description:
					'Unique identifier of the expense account for the bill. Note: This value is a set of numeric characters.',
			},
			template_id: {
				type: 'string',
				description:
					'Unique identifier of the PDF template for the self-billed invoice. Note: This value is a set of numeric characters.',
			},
			entity_type: {
				type: 'string',
				description:
					'Must be set to <code>self_billed_invoice</code>. Allowed values: <code>bill</code>, <code>self_billed_invoice</code>.',
			},
			tax_treatment: {
				type: 'string',
				description:
					'VAT treatment of the vendor. Allowed values include <code>vat_registered</code>, <code>vat_not_registered</code>, <code>gcc_vat_not_registered</code>, <code>gcc_vat_registered</code>, and <code>non_gcc</code>. <br/><b>For UAE Edition:</b> also <code>dz_vat_registered</code>, <code>dz_vat_not_registered</code>, <code>out_of_scope</code>, <code>gcc_non_vat</code>, <code>fz_vat_registered</code>, and <code>fz_vat_not_registered</code>.',
				'x-node_available_in': ['uae', 'gcc'],
			},
			place_of_supply: {
				type: 'string',
				description:
					'Place where the goods or services are supplied. Use the supported state, emirate, or country code for the organization edition.',
				'x-node_available_in': ['uae'],
			},
			tax_reg_no: {
				type: 'string',
				description: 'Tax Registration Number (TRN) of the vendor.',
				'x-node_available_in': ['uae'],
			},
			registration_details: {
				type: 'object',
				description:
					'Registration details of the vendor. Includes buyer identification, tax registration, and legal information used for E-Invoicing.',
				'x-node_available_in': ['uae'],
				properties: {
					company_registration_no: {
						type: 'string',
						maxLength: 200,
						description:
							'Company registration number (Commercial Registration number). Maximum length: 200 characters.',
					},
					einvoice_identifier_label: {
						type: 'string',
						maxLength: 200,
						description:
							'Label for the buyer identifier used in E-Invoicing (Buyer ID label). Allowed values: <code>TL</code>, <code>EID</code>, <code>PAS</code>, <code>CD</code>. Maximum length: 200 characters.',
					},
					einvoice_identifier_value: {
						type: 'string',
						maxLength: 200,
						description:
							'Value of the buyer identifier used in E-Invoicing (Buyer ID value). Maximum length: 200 characters.',
					},
					additionalfield1: {
						type: 'string',
						maxLength: 200,
						description:
							'Authority or scheme that issued the buyer identifier (Buyer ID authority, for sample Department of Economy and Tourism). Maximum length: 200 characters.',
					},
					legal_name: {
						type: 'string',
						maxLength: 500,
						description:
							'Legal registered name of the vendor. Maximum length: 500 characters.',
					},
					electronic_address_value: {
						type: 'string',
						maxLength: 200,
						description:
							'Electronic address (Peppol ID or similar) of the vendor used for E-Invoicing routing. Maximum length: 200 characters.',
					},
				},
			},
			permit_number: {
				type: 'string',
				description: 'Customs or import permit number.',
			},
			billing_address_id: {
				type: 'string',
				description:
					'Unique identifier of the billing address for the vendor. Note: This value is a set of numeric characters.',
			},
			recurring_bill_id: {
				type: 'string',
				description:
					'Unique identifier of the recurring bill profile linked to this invoice. Note: This value is a set of numeric characters.',
			},
			tags: {
				type: 'array',
				description: 'List of tags to associate with the self-billed invoice.',
				items: {
					type: 'object',
					properties: {
						tag_id: {
							type: 'string',
							description:
								'Unique identifier of the reporting tag. Note: This value is a set of numeric characters.',
						},
						tag_option_id: {
							type: 'string',
							description:
								'Unique identifier of the selected tag option. Note: This value is a set of numeric characters.',
						},
					},
				},
			},
			custom_fields: {
				type: 'array',
				description: 'List of custom fields for the self-billed invoice.',
				items: {
					type: 'object',
					properties: {
						custom_field_id: {
							type: 'string',
							description:
								'Unique identifier of the custom field. Note: This value is a set of numeric characters.',
						},
						value: {
							type: 'string',
							description: 'Value of the custom field.',
						},
					},
				},
			},
			documents: {
				type: 'array',
				description: 'List of documents attached to the self-billed invoice.',
				items: {
					type: 'object',
					properties: {
						document_id: {
							type: 'string',
							description:
								'Unique identifier of the attached document. Note: This value is a set of numeric characters.',
						},
						file_name: {
							type: 'string',
							description: 'File name of the attached document.',
						},
					},
				},
			},
			line_items: {
				type: 'array',
				description: 'List of line items in the self-billed invoice.',
				items: {
					type: 'object',
					properties: {
						item_id: {
							type: 'string',
							description:
								'Unique identifier of the item. Note: This value is a set of numeric characters.',
						},
						name: {
							type: 'string',
							description:
								'Name of the line item. Maximum length: 200 characters.',
							maxLength: 200,
						},
						account_id: {
							type: 'string',
							description:
								'Unique identifier of the expense account for the line item. Note: This value is a set of numeric characters.',
						},
						description: {
							type: 'string',
							description:
								'Description of the line item. Maximum length: 6000 characters.',
							maxLength: 6000,
						},
						rate: { type: 'number', description: 'Unit price of the item.' },
						quantity: { type: 'number', description: 'Quantity of the item.' },
						discount: {
							type: 'number',
							description:
								'Discount percentage or amount applied to the line item.',
						},
						tax_id: {
							type: 'string',
							description:
								'Unique identifier of the tax applied to the line item. Note: This value is a set of numeric characters.',
						},
						reverse_charge_tax_id: {
							type: 'string',
							description:
								'Unique identifier of the reverse charge tax for the line item. Note: This value is a set of numeric characters.',
						},
						unit: {
							type: 'string',
							description: 'Unit of measurement for the item (e.g., kg, pcs).',
						},
						item_order: {
							type: 'integer',
							description: 'Display order of the line item.',
						},
						is_billable: {
							type: 'boolean',
							description:
								'Set to <code>true</code> if the line item is billable to a customer.',
						},
						customer_id: {
							type: 'string',
							description:
								'Unique identifier of the customer to bill, if the line item is billable. Note: This value is a set of numeric characters.',
						},
						project_id: {
							type: 'string',
							description:
								'Unique identifier of the project associated with the line item. Note: This value is a set of numeric characters.',
						},
						hsn_or_sac: {
							type: 'string',
							description: 'HSN or SAC code for the line item.',
							'x-node_available_in': ['uae'],
						},
						unitkey_code: {
							type: 'string',
							description:
								'UN/CEFACT unit code for the line item. Maximum length: 10 characters.',
							maxLength: 10,
							'x-node_available_in': ['uae'],
						},
						product_type: {
							type: 'string',
							description:
								'The product or service type the line item belongs to. Allowed values: <code>goods</code> or <code>service</code>.',
							'x-node_available_in': ['uae'],
						},
						tax_treatment_code: {
							type: 'string',
							description: 'Tax treatment reason code for the line item.',
							'x-node_available_in': ['uae'],
						},
						tags: {
							type: 'array',
							description: 'List of tags for the line item.',
							items: {
								type: 'object',
								properties: {
									tag_id: {
										type: 'string',
										description:
											'Unique identifier of the reporting tag. Note: This value is a set of numeric characters.',
									},
									tag_option_id: {
										type: 'string',
										description:
											'Unique identifier of the selected tag option. Note: This value is a set of numeric characters.',
									},
								},
							},
						},
						item_custom_fields: {
							type: 'array',
							description: 'List of custom fields for the line item.',
							items: {
								type: 'object',
								properties: {
									custom_field_id: {
										type: 'string',
										description:
											'Unique identifier of the custom field. Note: This value is a set of numeric characters.',
									},
									value: {
										type: 'string',
										description: 'Value of the custom field.',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'create-a-self-billed-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bill: {
				type: 'object',
				properties: {
					bill_id: { type: 'string', readOnly: true },
					bill_number: { type: 'string' },
					vendor_id: { type: 'string' },
					vendor_name: { type: 'string', readOnly: true },
					date: { type: 'string' },
					due_date: { type: 'string' },
					status: { type: 'string', readOnly: true },
					entity_type: { type: 'string' },
					total: { type: 'number', readOnly: true },
					balance: { type: 'number', readOnly: true },
				},
			},
		},
	},
	'delete-a-self-billed-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'get-a-self-billed-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bill: {
				type: 'object',
				properties: {
					bill_id: { type: 'string', readOnly: true },
					bill_number: { type: 'string' },
					vendor_id: { type: 'string' },
					vendor_name: { type: 'string', readOnly: true },
					date: { type: 'string' },
					due_date: { type: 'string' },
					status: { type: 'string', readOnly: true },
					entity_type: { type: 'string' },
					total: { type: 'number', readOnly: true },
					balance: { type: 'number', readOnly: true },
					einvoice_status: {
						type: 'string',
						readOnly: true,
						'x-node_available_in': ['uae'],
					},
					is_peppol_supported: {
						type: 'boolean',
						readOnly: true,
						'x-node_available_in': ['uae'],
					},
					source: {
						type: 'string',
						description:
							'Source of the bill. <code>e-invoice</code> indicates the bill was pulled via Peppol. Allowed values: <code>Api</code> and <code>e-invoice</code>.',
						readOnly: true,
						'x-node_available_in': ['uae'],
					},
				},
			},
		},
	},
	'list-self-billed-invoices-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bills: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						bill_id: { type: 'string' },
						bill_number: { type: 'string' },
						vendor_name: { type: 'string' },
						date: { type: 'string' },
						due_date: { type: 'string' },
						status: { type: 'string' },
						entity_type: { type: 'string' },
						total: { type: 'number' },
						balance: { type: 'number' },
					},
				},
			},
			page_context: {
				type: 'object',
				properties: {
					page: { type: 'integer' },
					per_page: { type: 'integer' },
					has_more_page: { type: 'boolean' },
					report_name: { type: 'string' },
					applied_filter: { type: 'string' },
					sort_column: { type: 'string' },
					sort_order: { type: 'string' },
				},
			},
		},
	},
	'push-self-billed-invoice-einvoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'update-a-self-billed-invoice-request': {
		type: 'object',
		properties: {
			bill_number: {
				type: 'string',
				description:
					'Unique bill number for the self-billed invoice. Maximum length: 50 characters.',
				maxLength: 50,
			},
			vendor_id: {
				type: 'string',
				description:
					'Unique identifier of the vendor (supplier on whose behalf the invoice is raised). Note: This value is a set of numeric characters.',
			},
			reference_number: {
				type: 'string',
				description: 'Reference number for the self-billed invoice.',
			},
			date: {
				type: 'string',
				description: 'Date of the self-billed invoice. Format: yyyy-mm-dd.',
				format: 'date',
			},
			due_date: {
				type: 'string',
				description: 'Due date for payment. Format: yyyy-mm-dd.',
				format: 'date',
			},
			terms: {
				type: 'string',
				description:
					'Payment terms notes for the self-billed invoice. Maximum length: 10000 characters.',
				maxLength: 10000,
			},
			adjustment: {
				type: 'number',
				description: 'Adjustment amount applied to the total.',
			},
			adjustment_description: {
				type: 'string',
				description:
					'Description for the adjustment amount. Maximum length: 100 characters.',
				maxLength: 100,
			},
			is_draft: {
				type: 'boolean',
				description:
					'Set to <code>true</code> to save the self-billed invoice as a draft.',
			},
			pricebook_id: {
				type: 'string',
				description:
					'Unique identifier of the price book to apply. Note: This value is a set of numeric characters.',
			},
			is_item_level_tax_calc: {
				type: 'boolean',
				description:
					'Set to <code>true</code> to calculate tax at the line-item level.',
			},
			is_inclusive_tax: {
				type: 'boolean',
				description:
					'Set to <code>true</code> if the line-item rates are inclusive of tax.',
			},
			discount: {
				type: 'number',
				description: 'Entity-level discount applied to the subtotal.',
			},
			discount_code: {
				type: 'string',
				maxLength: 200,
				description:
					'Discount reason code for the entity-level discount. Maximum length: 200 characters.',
				'x-node_available_in': ['uae'],
			},
			discount_account_id: {
				type: 'string',
				description:
					'Unique identifier of the account to post the discount amount. Note: This value is a set of numeric characters.',
			},
			discount_type: {
				type: 'string',
				description:
					'Level at which the discount is applied. Allowed values: <code>entity_level</code>, <code>item_level</code>.',
			},
			is_discount_before_tax: {
				type: 'boolean',
				description:
					'Set to <code>true</code> to apply the discount before tax calculation.',
			},
			payment_terms: {
				type: 'integer',
				description: 'Number of days within which payment is due.',
			},
			payment_terms_label: {
				type: 'string',
				description: 'Label for the payment terms (e.g., Net 30).',
			},
			payment_mode: {
				type: 'string',
				description:
					'Mode of payment expected from the buyer. Allowed values: <code>cash</code>, <code>cheque</code>, <code>bank_transfer</code>, <code>sepa_credit_transfer</code>, <code>debit_transfer</code>, <code>card</code>, <code>not_specified</code>, <code>bankers_draft</code>, <code>credit_transfer</code>, <code>direct_debit</code>, <code>sepa_direct_debit</code>, <code>bank_cheque</code>, <code>credit_card</code>, <code>debit_card</code>, <code>online_payment_service</code>.',
				'x-node_available_in': ['uae'],
			},
			bank_account_id: {
				type: 'string',
				description:
					'Unique identifier of the bank account for the expected payment. Note: This value is a set of numeric characters.',
				'x-node_available_in': ['uae'],
			},
			account_id: {
				type: 'string',
				description:
					'Unique identifier of the expense account for the bill. Note: This value is a set of numeric characters.',
			},
			template_id: {
				type: 'string',
				description:
					'Unique identifier of the PDF template for the self-billed invoice. Note: This value is a set of numeric characters.',
			},
			entity_type: {
				type: 'string',
				description:
					'Must be set to <code>self_billed_invoice</code>. Allowed values: <code>bill</code>, <code>self_billed_invoice</code>.',
			},
			tax_treatment: {
				type: 'string',
				description:
					'VAT treatment of the vendor. Allowed values include <code>vat_registered</code>, <code>vat_not_registered</code>, <code>gcc_vat_not_registered</code>, <code>gcc_vat_registered</code>, and <code>non_gcc</code>. <br/><b>For UAE Edition:</b> also <code>dz_vat_registered</code>, <code>dz_vat_not_registered</code>, <code>out_of_scope</code>, <code>gcc_non_vat</code>, <code>fz_vat_registered</code>, and <code>fz_vat_not_registered</code>.',
				'x-node_available_in': ['uae', 'gcc'],
			},
			place_of_supply: {
				type: 'string',
				description:
					'Place where the goods or services are supplied. Use the supported state, emirate, or country code for the organization edition.',
				'x-node_available_in': ['uae'],
			},
			tax_reg_no: {
				type: 'string',
				description: 'Tax Registration Number (TRN) of the vendor.',
				'x-node_available_in': ['uae'],
			},
			registration_details: {
				type: 'object',
				description:
					'Registration details of the vendor. Includes buyer identification, tax registration, and legal information used for E-Invoicing.',
				'x-node_available_in': ['uae'],
				properties: {
					company_registration_no: {
						type: 'string',
						maxLength: 200,
						description:
							'Company registration number (Commercial Registration number). Maximum length: 200 characters.',
					},
					einvoice_identifier_label: {
						type: 'string',
						maxLength: 200,
						description:
							'Label for the buyer identifier used in E-Invoicing (Buyer ID label). Allowed values: <code>TL</code>, <code>EID</code>, <code>PAS</code>, <code>CD</code>. Maximum length: 200 characters.',
					},
					einvoice_identifier_value: {
						type: 'string',
						maxLength: 200,
						description:
							'Value of the buyer identifier used in E-Invoicing (Buyer ID value). Maximum length: 200 characters.',
					},
					additionalfield1: {
						type: 'string',
						description:
							'Authority or scheme that issued the buyer identifier (Buyer ID authority, for sample Department of Economy and Tourism). Maximum length: 200 characters.',
						maxLength: 200,
					},
					legal_name: {
						type: 'string',
						description:
							'Legal registered name of the vendor. Maximum length: 500 characters.',
						maxLength: 500,
					},
					electronic_address_value: {
						type: 'string',
						maxLength: 200,
						description:
							'Electronic address (Peppol ID or similar) of the vendor used for E-Invoicing routing. Maximum length: 200 characters.',
					},
				},
			},
			permit_number: {
				type: 'string',
				description: 'Customs or import permit number.',
			},
			billing_address_id: {
				type: 'string',
				description:
					'Unique identifier of the billing address for the vendor. Note: This value is a set of numeric characters.',
			},
			recurring_bill_id: {
				type: 'string',
				description:
					'Unique identifier of the recurring bill profile linked to this invoice. Note: This value is a set of numeric characters.',
			},
			tags: {
				type: 'array',
				description: 'List of tags to associate with the self-billed invoice.',
				items: {
					type: 'object',
					properties: {
						tag_id: {
							type: 'string',
							description:
								'Unique identifier of the reporting tag. Note: This value is a set of numeric characters.',
						},
						tag_option_id: {
							type: 'string',
							description:
								'Unique identifier of the selected tag option. Note: This value is a set of numeric characters.',
						},
					},
				},
			},
			custom_fields: {
				type: 'array',
				description: 'List of custom fields for the self-billed invoice.',
				items: {
					type: 'object',
					properties: {
						custom_field_id: {
							type: 'string',
							description:
								'Unique identifier of the custom field. Note: This value is a set of numeric characters.',
						},
						value: {
							type: 'string',
							description: 'Value of the custom field.',
						},
					},
				},
			},
			documents: {
				type: 'array',
				description: 'List of documents attached to the self-billed invoice.',
				items: {
					type: 'object',
					properties: {
						document_id: {
							type: 'string',
							description:
								'Unique identifier of the attached document. Note: This value is a set of numeric characters.',
						},
						file_name: {
							type: 'string',
							description: 'File name of the attached document.',
						},
					},
				},
			},
			line_items: {
				type: 'array',
				description: 'List of line items in the self-billed invoice.',
				items: {
					type: 'object',
					properties: {
						item_id: {
							type: 'string',
							description:
								'Unique identifier of the item. Note: This value is a set of numeric characters.',
						},
						name: {
							type: 'string',
							description:
								'Name of the line item. Maximum length: 200 characters.',
							maxLength: 200,
						},
						account_id: {
							type: 'string',
							description:
								'Unique identifier of the expense account for the line item. Note: This value is a set of numeric characters.',
						},
						description: {
							type: 'string',
							description:
								'Description of the line item. Maximum length: 6000 characters.',
							maxLength: 6000,
						},
						rate: { type: 'number', description: 'Unit price of the item.' },
						quantity: { type: 'number', description: 'Quantity of the item.' },
						discount: {
							type: 'number',
							description:
								'Discount percentage or amount applied to the line item.',
						},
						tax_id: {
							type: 'string',
							description:
								'Unique identifier of the tax applied to the line item. Note: This value is a set of numeric characters.',
						},
						reverse_charge_tax_id: {
							type: 'string',
							description:
								'Unique identifier of the reverse charge tax for the line item. Note: This value is a set of numeric characters.',
						},
						unit: {
							type: 'string',
							description: 'Unit of measurement for the item (e.g., kg, pcs).',
						},
						item_order: {
							type: 'integer',
							description: 'Display order of the line item.',
						},
						is_billable: {
							type: 'boolean',
							description:
								'Set to <code>true</code> if the line item is billable to a customer.',
						},
						customer_id: {
							type: 'string',
							description:
								'Unique identifier of the customer to bill, if the line item is billable. Note: This value is a set of numeric characters.',
						},
						project_id: {
							type: 'string',
							description:
								'Unique identifier of the project associated with the line item. Note: This value is a set of numeric characters.',
						},
						hsn_or_sac: {
							type: 'string',
							description: 'HSN or SAC code for the line item.',
							'x-node_available_in': ['uae'],
						},
						unitkey_code: {
							type: 'string',
							description:
								'UN/CEFACT unit code for the line item. Maximum length: 10 characters.',
							maxLength: 10,
							'x-node_available_in': ['uae'],
						},
						product_type: {
							type: 'string',
							description:
								'The product or service type the line item belongs to. Allowed values: <code>goods</code> or <code>service</code>.',
							'x-node_available_in': ['uae'],
						},
						tax_treatment_code: {
							type: 'string',
							description: 'Tax treatment reason code for the line item.',
							'x-node_available_in': ['uae'],
						},
						tags: {
							type: 'array',
							description: 'List of tags for the line item.',
							items: {
								type: 'object',
								properties: {
									tag_id: {
										type: 'string',
										description:
											'Unique identifier of the reporting tag. Note: This value is a set of numeric characters.',
									},
									tag_option_id: {
										type: 'string',
										description:
											'Unique identifier of the selected tag option. Note: This value is a set of numeric characters.',
									},
								},
							},
						},
						item_custom_fields: {
							type: 'array',
							description: 'List of custom fields for the line item.',
							items: {
								type: 'object',
								properties: {
									custom_field_id: {
										type: 'string',
										description:
											'Unique identifier of the custom field. Note: This value is a set of numeric characters.',
									},
									value: {
										type: 'string',
										description: 'Value of the custom field.',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'update-a-self-billed-invoice-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			bill: {
				type: 'object',
				properties: {
					bill_id: { type: 'string', readOnly: true },
					bill_number: { type: 'string' },
					vendor_id: { type: 'string' },
					vendor_name: { type: 'string', readOnly: true },
					date: { type: 'string' },
					due_date: { type: 'string' },
					status: { type: 'string', readOnly: true },
					entity_type: { type: 'string' },
					total: { type: 'number', readOnly: true },
					balance: { type: 'number', readOnly: true },
				},
			},
		},
	},
};

export const operations: readonly ZohoBooksOperationDefinition[] = [
	{
		id: 'create_self_billed_invoice',
		group: 'selfBilledInvoices',
		groupSlug: 'self-billed-invoices',
		name: 'createSelfBilledInvoice',
		method: 'POST',
		path: '/bills',
		summary: 'Create a Self-Billed Invoice',
		description:
			'Create a new self-billed invoice. Set <code>entity_type</code> to <code>self_billed_invoice</code> to identify it as a self-billed invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/self-billed-invoices/',
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
			schema: {
				$ref: '#/components/schemas/create-a-self-billed-invoice-request',
			},
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-a-self-billed-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_self_billed_invoices',
		group: 'selfBilledInvoices',
		groupSlug: 'self-billed-invoices',
		name: 'listSelfBilledInvoices',
		method: 'GET',
		path: '/bills',
		summary: 'List Self-Billed Invoices',
		description:
			'Retrieve a paginated list of self-billed invoices. Use the <code>entity_type=self_billed_invoice</code> query parameter to filter self-billed invoices only.',
		docsUrl: 'https://www.zoho.com/books/api/v3/self-billed-invoices/',
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
				name: 'entity_type',
				in: 'query',
				required: false,
				description:
					'Filter by entity type. Use <code>self_billed_invoice</code> to list only self-billed invoices.',
				schema: { type: 'string' },
			},
			{
				name: 'bill_number',
				in: 'query',
				required: false,
				description: 'Filter by bill number.',
				schema: { type: 'string' },
			},
			{
				name: 'status',
				in: 'query',
				required: false,
				description:
					'Filter by status. Allowed values: <code>draft</code>, <code>open</code>, <code>paid</code>, <code>overdue</code>, <code>void</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'date_start',
				in: 'query',
				required: false,
				description:
					'Filter invoices with a bill date on or after this date. Format: yyyy-mm-dd.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'date_end',
				in: 'query',
				required: false,
				description:
					'Filter invoices with a bill date on or before this date. Format: yyyy-mm-dd.',
				schema: { type: 'string', format: 'date' },
			},
			{
				name: 'vendor_name',
				in: 'query',
				required: false,
				description: 'Filter by vendor name.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_column',
				in: 'query',
				required: false,
				description:
					'Column to sort the list by. Allowed values: <code>vendor_name</code>, <code>bill_number</code>, <code>date</code>, <code>due_date</code>, <code>total</code>, <code>balance</code>.',
				schema: { type: 'string' },
			},
			{
				name: 'sort_order',
				in: 'query',
				required: false,
				description:
					'Sort order. Allowed values: <code>A</code> (ascending), <code>D</code> (descending).',
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
				description: 'Number of records per page. Default: 25.',
				schema: { type: 'integer' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-self-billed-invoices-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_self_billed_invoice',
		group: 'selfBilledInvoices',
		groupSlug: 'self-billed-invoices',
		name: 'updateSelfBilledInvoice',
		method: 'PUT',
		path: '/bills/{bill_id}',
		summary: 'Update a Self-Billed Invoice',
		description: 'Update the details of an existing self-billed invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/self-billed-invoices/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the self-billed invoice. Note: This value is a set of numeric characters.',
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
			required: true,
			schema: {
				$ref: '#/components/schemas/update-a-self-billed-invoice-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-a-self-billed-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'get_self_billed_invoice',
		group: 'selfBilledInvoices',
		groupSlug: 'self-billed-invoices',
		name: 'getSelfBilledInvoice',
		method: 'GET',
		path: '/bills/{bill_id}',
		summary: 'Get a Self-Billed Invoice',
		description: 'Fetch the details of a self-billed invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/self-billed-invoices/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the self-billed invoice. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/get-a-self-billed-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.READ'],
		riskLevel: 'read',
	},
	{
		id: 'delete_self_billed_invoice',
		group: 'selfBilledInvoices',
		groupSlug: 'self-billed-invoices',
		name: 'deleteSelfBilledInvoice',
		method: 'DELETE',
		path: '/bills/{bill_id}',
		summary: 'Delete a Self-Billed Invoice',
		description: 'Delete an existing self-billed invoice.',
		docsUrl: 'https://www.zoho.com/books/api/v3/self-billed-invoices/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the self-billed invoice. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-a-self-billed-invoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'push_self_billed_invoice_einvoice',
		group: 'selfBilledInvoices',
		groupSlug: 'self-billed-invoices',
		name: 'pushSelfBilledInvoiceEinvoice',
		method: 'POST',
		path: '/selfbilledinvoices/{bill_id}/einvoice/push',
		summary: 'Push a self-billed invoice e-invoice',
		description:
			'Push the e-invoice of a self-billed invoice.<br><b>Rate limit:</b> 150 requests per minute. Exceeding this limit triggers a 30-minute lock-out.',
		docsUrl: 'https://www.zoho.com/books/api/v3/self-billed-invoices/',
		parameters: [
			{
				name: 'bill_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the self-billed invoice. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/push-self-billed-invoice-einvoice-response',
				},
			},
		],
		scopes: ['ZohoBooks.bills.CREATE'],
		riskLevel: 'write',
	},
];
