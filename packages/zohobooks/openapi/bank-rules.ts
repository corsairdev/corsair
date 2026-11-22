import type {
	JsonValue,
	ZohoBooksOperationDefinition,
} from '../schema/openapi-types';

export const schemas = {
	account_id: { description: 'Account ID of the Bank', type: 'string' },
	account_ids: {
		description:
			'Comma-separated list of account IDs to which the rule applies. Applicable only when <code>rule_category</code> is <code>selected_accounts</code>. Do not send this parameter when <code>rule_category</code> is <code>all_accounts</code>, <code>all_banks</code>, or <code>all_credit_cards</code>.',
		type: 'string',
	},
	account_name: { description: 'Name of the account', type: 'string' },
	accounts: {
		type: 'array',
		description: 'List of accounts associated with the rule.',
		items: {
			type: 'object',
			properties: {
				account_id: { $ref: '#/components/schemas/account_id' },
				account_name: { $ref: '#/components/schemas/account_name' },
			},
		},
	},
	apply_to: {
		description: 'Entities to which Rule must be applied',
		type: 'string',
	},
	auto_categorize: {
		description:
			'Specifies the auto-categorization behavior when the rule criteria are matched. <code>recognize</code>: Matching bank statements are recognized by the rule and can be categorized manually. <code>autocategorize</code>: Matching bank statements are automatically categorized in Zoho Books based on the rule. Allowed Values: <code>autocategorize</code> and <code>recognize</code>.',
		type: 'string',
	},
	'bank-account-match-filter-request': {
		type: 'object',
		properties: {
			rule_name: {
				type: 'string',
				description: 'Name of the match filter rule.',
			},
			rule_order: {
				type: 'integer',
				description: 'Order in which the match filter is evaluated.',
			},
			apply_to: {
				type: 'string',
				description: 'Transaction type the match filter applies to.',
			},
		},
	},
	'bulk-delete-bank-account-rules-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'bulk-update-bank-account-rules-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	comparator: { description: 'Comparator used in Criteria', type: 'string' },
	'create-a-rule-request': {
		required: [
			'rule_name',
			'rule_category',
			'apply_to',
			'criteria_type',
			'criterion',
			'record_as',
		],
		type: 'object',
		properties: {
			rule_name: { $ref: '#/components/schemas/rule_name' },
			rule_category: { $ref: '#/components/schemas/rule_category' },
			account_ids: { $ref: '#/components/schemas/account_ids' },
			apply_to: {
				description:
					'Specifies whether the rule applies to deposits or withdrawals. This applies to both bank accounts and credit card accounts. Allowed Values: <code>deposits</code>, <code>withdrawals</code>.',
				type: 'string',
			},
			criteria_type: {
				description:
					'Specifies whether all the criteria have to be satisfied or not. Allowed Values : <code>and</code> and <code>or</code>',
				type: 'string',
			},
			auto_categorize: { $ref: '#/components/schemas/auto_categorize' },
			criterion: {
				type: 'array',
				description:
					'List of criteria used to define conditions for applying the bank rule.',
				items: {
					type: 'object',
					properties: {
						field: { $ref: '#/components/schemas/field' },
						comparator: { $ref: '#/components/schemas/comparator' },
						value: { $ref: '#/components/schemas/value' },
					},
				},
			},
			record_as: {
				description:
					'Record the transaction based on the value specified in the apply_to node. For bank accounts: If apply_to is deposits: sales_without_invoices, transfer_fund, interest_income, other_income, expense_refund, deposit. If apply_to is withdrawals: expense, transfer_fund, card_payment, owner_drawings. For credit card accounts: If apply_to is deposits: card_payment, transfer_fund, expense_refund, refund. If apply_to is withdrawals: expense, transfer_fund. Allowed Values: <code>expense</code>, <code>deposit</code>, <code>refund</code>, <code>transfer_fund</code>, <code>card_payment</code>, <code>sales_without_invoices</code>, <code>expense_refund</code>, <code>interest_income</code>, <code>other_income</code>, <code>owner_drawings</code>.',
				type: 'string',
			},
			account_id: {
				description:
					'Account which is involved in the rule with the target account.',
				type: 'string',
			},
			customer_id: {
				description:
					'ID of the customer.(Applicable for sales_without_invoices,deposit, expense)',
				type: 'string',
			},
			tax_id: { $ref: '#/components/schemas/tax_id' },
			reference_number: {
				description:
					'Specifies if Reference number is manual or generated from the statement. Allowed Values: <code>manual</code> and <code>from_statement</code>',
				type: 'string',
			},
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			product_type: { $ref: '#/components/schemas/product_type' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			location_id: { $ref: '#/components/schemas/location_id' },
		},
	},
	'create-a-rule-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			rule: { $ref: '#/components/schemas/rule' },
		},
	},
	'create-bank-account-match-filter-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	criteria_id: { description: 'ID of the Criteria', type: 'string' },
	criteria_type: { description: 'Type of Criteria', type: 'string' },
	criterion: {
		type: 'array',
		description: 'List of criteria based on which the rule will be applied.',
		items: {
			type: 'object',
			properties: {
				criteria_id: { $ref: '#/components/schemas/criteria_id' },
				field: { $ref: '#/components/schemas/field' },
				comparator: { $ref: '#/components/schemas/comparator' },
				value: { $ref: '#/components/schemas/value' },
			},
		},
	},
	customer_id: {
		description: 'ID of the Customer Associated with the Rule',
		type: 'string',
	},
	customer_name: {
		description: 'Name of the Customer Associated with the Rule',
		type: 'string',
	},
	'delete-a-rule-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	'delete-bank-account-match-filter-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	field: { description: 'Field involved in the Criteria', type: 'string' },
	'get-a-rule-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			rule_id: { $ref: '#/components/schemas/rule_id' },
			rule_name: { $ref: '#/components/schemas/rule_name' },
			rule_order: { $ref: '#/components/schemas/rule_order' },
			rule_category: { $ref: '#/components/schemas/rule_category' },
			target_accounts: { $ref: '#/components/schemas/target_accounts' },
			accounts: { $ref: '#/components/schemas/accounts' },
			target_accounts_count: {
				$ref: '#/components/schemas/target_accounts_count',
			},
			apply_to: { $ref: '#/components/schemas/apply_to' },
			criteria_type: { $ref: '#/components/schemas/criteria_type' },
			auto_categorize: { $ref: '#/components/schemas/auto_categorize' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			criterion: { $ref: '#/components/schemas/criterion' },
			record_as: { $ref: '#/components/schemas/record_as' },
			account_id: { $ref: '#/components/schemas/account_id' },
			account_name: { $ref: '#/components/schemas/account_name' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			customer_name: { $ref: '#/components/schemas/customer_name' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			product_type: { $ref: '#/components/schemas/product_type' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
		},
	},
	'get-rules-list-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			rules: {
				type: 'array',
				items: { $ref: '#/components/schemas/rules-response' },
			},
		},
	},
	is_reverse_charge_applied: {
		description:
			'(Required if customer tax treatment is <code>vat_registered</code>)<br/>Used to specify whether the transaction is applicable for Domestic Reverse Charge (DRC) or not.',
		type: 'boolean',
		'x-node_available_in': ['za'],
		'x-node_unavailable_in': [],
	},
	'list-bank-account-match-filters-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	location_id: {
		description:
			'Unique identifier of the business location to associate with the rule. Use the <code>location_id</code> returned by the Locations API for the same organization. Note: This value is a set of numeric characters.',
		type: 'string',
	},
	location_name: { description: 'Name of the location.', type: 'string' },
	payment_mode: {
		description: 'Payment Mode Associated with the Rule',
		type: 'string',
	},
	product_type: {
		description:
			'Product Type associated with the Rule. Allowed values:<br/> <b>For UK and Europe: </b><code>digital_service</code>, <code>goods</code> and <code>service</code>.<br/><b>For SouthAfrica Edition:</b> <code>service</code>, <code>goods</code>, <code>capital_service</code> and <code>capital_goods</code>.',
		type: 'string',
		'x-node_available_in': ['uk', 'za', 'eu'],
		'x-node_unavailable_in': [],
	},
	record_as: {
		description: 'Entity as which it should be recorded',
		type: 'string',
	},
	reference_number: {
		description:
			'Specifies if Reference number is manual or generated from the statement.',
		type: 'string',
	},
	'reorder-bank-account-rules-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	rule: {
		type: 'object',
		properties: {
			rule_id: { $ref: '#/components/schemas/rule_id' },
			rule_name: { $ref: '#/components/schemas/rule_name' },
			rule_order: { $ref: '#/components/schemas/rule_order' },
			rule_category: { $ref: '#/components/schemas/rule_category' },
			target_accounts: { $ref: '#/components/schemas/target_accounts' },
			accounts: { $ref: '#/components/schemas/accounts' },
			target_accounts_count: {
				$ref: '#/components/schemas/target_accounts_count',
			},
			apply_to: { $ref: '#/components/schemas/apply_to' },
			criteria_type: { $ref: '#/components/schemas/criteria_type' },
			auto_categorize: { $ref: '#/components/schemas/auto_categorize' },
			location_id: { $ref: '#/components/schemas/location_id' },
			location_name: { $ref: '#/components/schemas/location_name' },
			criterion: { $ref: '#/components/schemas/criterion' },
			record_as: { $ref: '#/components/schemas/record_as' },
			account_id: { $ref: '#/components/schemas/account_id' },
			account_name: { $ref: '#/components/schemas/account_name' },
			tax_id: { $ref: '#/components/schemas/tax_id' },
			customer_id: { $ref: '#/components/schemas/customer_id' },
			customer_name: { $ref: '#/components/schemas/customer_name' },
			reference_number: { $ref: '#/components/schemas/reference_number' },
			payment_mode: { $ref: '#/components/schemas/payment_mode' },
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			product_type: { $ref: '#/components/schemas/product_type' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_authority_name: { $ref: '#/components/schemas/tax_authority_name' },
			tax_exemption_code: { $ref: '#/components/schemas/tax_exemption_code' },
		},
	},
	rule_category: {
		description:
			'Specifies the scope of accounts to which the rule applies. Use <code>selected_accounts</code> to specific accounts and provide the corresponding <code>account_ids</code>. Use <code>all_accounts</code> to apply the rule across all accounts in the organization, <code>all_banks</code> for all bank accounts, or <code>all_credit_cards</code> for all credit card accounts. Allowed Values: <code>selected_accounts</code>, <code>all_accounts</code>, <code>all_banks</code>, <code>all_credit_cards</code>.',
		type: 'string',
	},
	rule_id: { description: 'ID of the Rule', type: 'string' },
	rule_name: { description: 'Name of the Rule', type: 'string' },
	rule_order: { description: 'Order of the rule', type: 'integer' },
	'rules-response': {
		type: 'object',
		properties: {
			rule_id: { $ref: '#/components/schemas/rule_id' },
			rule_name: { $ref: '#/components/schemas/rule_name' },
			rule_order: { $ref: '#/components/schemas/rule_order' },
			rule_category: { $ref: '#/components/schemas/rule_category' },
			target_accounts_formatted: {
				$ref: '#/components/schemas/target_accounts_formatted',
			},
			target_accounts_count: {
				$ref: '#/components/schemas/target_accounts_count',
			},
			apply_to: { $ref: '#/components/schemas/apply_to' },
			criteria_type: { $ref: '#/components/schemas/criteria_type' },
			record_as: { $ref: '#/components/schemas/record_as' },
			account_id: { $ref: '#/components/schemas/account_id' },
			account_name: { $ref: '#/components/schemas/account_name' },
			criterion: { $ref: '#/components/schemas/criterion' },
		},
	},
	'skip-suggested-bank-account-rule-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	target_account_id: {
		description: 'The account on which the rule has to be applied.',
		type: 'string',
	},
	target_account_name: {
		description:
			'Name of the bank or credit card account associated with the rule.',
		type: 'string',
	},
	target_accounts: {
		type: 'array',
		description:
			'List of bank or credit card accounts on which the rule is applied.',
		items: {
			type: 'object',
			properties: {
				target_account_id: { $ref: '#/components/schemas/target_account_id' },
				target_account_name: {
					$ref: '#/components/schemas/target_account_name',
				},
			},
		},
	},
	target_accounts_count: {
		description: 'Total number of accounts the rule applies to.',
		type: 'integer',
	},
	target_accounts_formatted: {
		description:
			'Comma-separated display string of bank and credit card account names to which the rule applies',
		type: 'string',
	},
	tax_authority_id: {
		description: 'ID of the Tax Authority Associated with the Rule',
		type: 'string',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	tax_authority_name: {
		description: 'Name of the Tax Authority Associated with the Rule',
		type: 'string',
		'x-node_available_in': ['us'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_code: {
		description: 'Code of the Tax Exemption Associated with the Rule',
		type: 'string',
		'x-node_available_in': ['in', 'us'],
		'x-node_unavailable_in': [],
	},
	tax_exemption_id: {
		description: 'ID of the Tax Exemption Associated with the Rule',
		type: 'string',
		'x-node_available_in': ['in', 'us'],
		'x-node_unavailable_in': [],
	},
	tax_id: {
		description: 'Tax ID involved in the transaction.',
		type: 'string',
	},
	tax_treatment: {
		description:
			'VAT treatment for the bank transaction.Choose whether the contact falls under: <code>vat_registered</code>,<code>vat_not_registered</code>,<code>gcc_vat_not_registered</code>,<code>gcc_vat_registered</code>,<code>non_gcc</code>.</br><code>dz_vat_registered</code> and <code>dz_vat_not_registered</code> are supported only for <b>UAE</b>.<br/><b>For Kenya Edition:</b> <code>vat_registered</code> ,<code>vat_not_registered</code> ,<code>non_kenya</code>(A business that is located outside Kenya).<br/><b>For SouthAfrica Edition:</b> <code>vat_registered</code>, <code>vat_not_registered</code>, <code>overseas</code>(A business that is located outside SouthAfrica).',
		type: 'string',
		'x-node_available_in': ['gcc', 'ke', 'za'],
		'x-node_unavailable_in': [],
	},
	'update-a-rule-request': {
		required: [
			'rule_name',
			'rule_category',
			'apply_to',
			'criteria_type',
			'criterion',
			'record_as',
		],
		type: 'object',
		properties: {
			rule_name: { $ref: '#/components/schemas/rule_name' },
			rule_category: { $ref: '#/components/schemas/rule_category' },
			account_ids: { $ref: '#/components/schemas/account_ids' },
			apply_to: {
				description:
					'Specifies whether the rule applies to deposits or withdrawals. This applies to both bank accounts and credit card accounts. Allowed Values: <code>deposits</code>, <code>withdrawals</code>.',
				type: 'string',
			},
			criteria_type: {
				description:
					'Specifies whether all the criteria have to be satisfied or not. Allowed Values : <code>and</code> and <code>or</code>',
				type: 'string',
			},
			auto_categorize: { $ref: '#/components/schemas/auto_categorize' },
			criterion: { $ref: '#/components/schemas/criterion' },
			record_as: {
				description:
					'Record the transaction based on the value specified in the apply_to node. For bank accounts: If apply_to is deposits: sales_without_invoices, transfer_fund, interest_income, other_income, expense_refund, deposit. If apply_to is withdrawals: expense, transfer_fund, card_payment, owner_drawings. For credit card accounts: If apply_to is deposits: card_payment, transfer_fund, expense_refund, refund. If apply_to is withdrawals: expense, transfer_fund. Allowed Values: expense, deposit, refund, transfer_fund, card_payment, sales_without_invoices, expense_refund, interest_income, other_income, owner_drawings.',
				type: 'string',
			},
			account_id: {
				description:
					'Account which is involved in the rule with the target account.',
				type: 'string',
			},
			customer_id: {
				description:
					'ID of the customer.(Applicable for sales_without_invoices,deposit, expense)',
				type: 'string',
			},
			tax_id: { $ref: '#/components/schemas/tax_id' },
			reference_number: {
				description:
					'Specifies if Reference number is manual or generated from the statement. Allowed Values: <code>manual</code> and <code>from_statement</code>',
				type: 'string',
			},
			vat_treatment: { $ref: '#/components/schemas/vat_treatment' },
			tax_treatment: { $ref: '#/components/schemas/tax_treatment' },
			is_reverse_charge_applied: {
				$ref: '#/components/schemas/is_reverse_charge_applied',
			},
			product_type: { $ref: '#/components/schemas/product_type' },
			tax_authority_id: { $ref: '#/components/schemas/tax_authority_id' },
			tax_exemption_id: { $ref: '#/components/schemas/tax_exemption_id' },
			location_id: { $ref: '#/components/schemas/location_id' },
		},
	},
	'update-a-rule-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
			rule: { $ref: '#/components/schemas/rule' },
		},
	},
	'update-bank-account-match-filter-response': {
		type: 'object',
		properties: {
			code: { type: 'integer', readOnly: true },
			message: { type: 'string', readOnly: true },
		},
	},
	value: { description: 'Value to be compared with', type: 'string' },
	vat_treatment: {
		description:
			'(Optional) VAT treatment for the bank rules. VAT treatment denotes the location of the customer, if the customer resides in UK then the VAT treatment is <code>uk</code>. If the customer is in an EU country & VAT registered, you are resides in Northen Ireland and selling/purchasing Goods then his VAT treatment is <code>eu_vat_registered</code>, if he resides outside of the UK then his VAT treatment is <code>overseas</code> (For Pre Brexit, this can be split as <code>eu_vat_registered</code>, <code>eu_vat_not_registered</code> and <code>non_eu</code>).',
		type: 'string',
		'x-node_available_in': ['uk'],
		'x-node_unavailable_in': [],
	},
} as const satisfies Record<string, JsonValue>;

export const operations = [
	{
		id: 'list_bank_account_rules',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'listBankAccountRules',
		method: 'GET',
		path: '/bankaccounts/rules',
		summary: 'Get Rules List',
		description: 'Fetch all the rules created in the organization.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
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
				schema: { $ref: '#/components/schemas/get-rules-list-response' },
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_bank_account_rule',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'createBankAccountRule',
		method: 'POST',
		path: '/bankaccounts/rules',
		summary: 'Create a rule',
		description:
			'Create a rule and apply it on deposit/withdrawal for bank accounts and on refund/charges for credit card accounts.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
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
			schema: { $ref: '#/components/schemas/create-a-rule-request' },
		},
		responses: [
			{
				status: '201',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/create-a-rule-response' },
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'bulk_update_bank_account_rules',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'bulkUpdateBankAccountRules',
		method: 'PUT',
		path: '/bankaccounts/rules',
		summary: 'Bulk update rules',
		description: 'Update multiple bank rules in a single request.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
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
					$ref: '#/components/schemas/bulk-update-bank-account-rules-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'bulk_delete_bank_account_rules',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'bulkDeleteBankAccountRules',
		method: 'DELETE',
		path: '/bankaccounts/rules',
		summary: 'Bulk delete rules',
		description: 'Delete multiple bank rules in a single request.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'rule_ids',
				in: 'query',
				required: true,
				description:
					'Comma-separated IDs of the rules to delete. Note: This value is a set of numeric characters separated by comma.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/bulk-delete-bank-account-rules-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'get_bank_account_rule',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'getBankAccountRule',
		method: 'GET',
		path: '/bankaccounts/rules/{rule_id}',
		summary: 'Get a rule',
		description: 'Get details of a specific rule.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
		parameters: [
			{
				name: 'rule_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank account rule.',
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
				schema: { $ref: '#/components/schemas/get-a-rule-response' },
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'update_bank_account_rule',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'updateBankAccountRule',
		method: 'PUT',
		path: '/bankaccounts/rules/{rule_id}',
		summary: 'Update a rule',
		description: 'Make changes to the rule, add or modify it and update.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
		parameters: [
			{
				name: 'rule_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank account rule.',
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
			schema: { $ref: '#/components/schemas/update-a-rule-request' },
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: { $ref: '#/components/schemas/update-a-rule-response' },
			},
		],
		scopes: ['ZohoBooks.banking.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_bank_account_rule',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'deleteBankAccountRule',
		method: 'DELETE',
		path: '/bankaccounts/rules/{rule_id}',
		summary: 'Delete a rule',
		description:
			'Delete a rule from your account and make it no longer applicable on the transactions.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
		parameters: [
			{
				name: 'rule_id',
				in: 'path',
				required: true,
				description: 'Unique identifier of the bank account rule.',
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
				schema: { $ref: '#/components/schemas/delete-a-rule-response' },
			},
		],
		scopes: ['ZohoBooks.banking.DELETE'],
		riskLevel: 'destructive',
	},
	{
		id: 'reorder_bank_account_rules',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'reorderBankAccountRules',
		method: 'POST',
		path: '/bankaccounts/rules/order',
		summary: 'Reorder rules',
		description: 'Change the order in which bank rules are evaluated.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
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
					$ref: '#/components/schemas/reorder-bank-account-rules-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'skip_suggested_bank_account_rule',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'skipSuggestedBankAccountRule',
		method: 'POST',
		path: '/bankaccounts/rules/skipsuggest',
		summary: 'Skip a suggested rule',
		description: 'Dismiss a bank rule suggested by Zoho Books.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
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
					$ref: '#/components/schemas/skip-suggested-bank-account-rule-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'list_bank_account_match_filters',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'listBankAccountMatchFilters',
		method: 'GET',
		path: '/bankaccounts/matchfilters',
		summary: 'List match filters',
		description:
			'List the match filters used to identify bank transactions for rules.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
		parameters: [
			{
				name: 'organization_id',
				in: 'query',
				required: true,
				description: 'ID of the organization',
				schema: { type: 'string' },
			},
			{
				name: 'account_id',
				in: 'query',
				required: true,
				description:
					'ID of the bank account whose match filters are listed. Required by the API, though the Zoho OpenAPI leaves it out.',
				schema: { type: 'string' },
			},
		],
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/list-bank-account-match-filters-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.READ'],
		riskLevel: 'read',
	},
	{
		id: 'create_bank_account_match_filter',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'createBankAccountMatchFilter',
		method: 'POST',
		path: '/bankaccounts/matchfilters',
		summary: 'Create a match filter',
		description:
			'Create a match filter used to identify bank transactions for rules.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
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
				$ref: '#/components/schemas/bank-account-match-filter-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/create-bank-account-match-filter-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.CREATE'],
		riskLevel: 'write',
	},
	{
		id: 'update_bank_account_match_filter',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'updateBankAccountMatchFilter',
		method: 'PUT',
		path: '/bankaccounts/matchfilters/{match_filter_id}',
		summary: 'Update a match filter',
		description:
			'Update a match filter used to identify bank transactions for rules.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
		parameters: [
			{
				name: 'match_filter_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the match filter. Note: This value is a set of numeric characters.',
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
				$ref: '#/components/schemas/bank-account-match-filter-request',
			},
		},
		responses: [
			{
				status: '200',
				contentType: 'application/json',
				schema: {
					$ref: '#/components/schemas/update-bank-account-match-filter-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.UPDATE'],
		riskLevel: 'write',
	},
	{
		id: 'delete_bank_account_match_filter',
		group: 'bankRules',
		groupSlug: 'bank-rules',
		name: 'deleteBankAccountMatchFilter',
		method: 'DELETE',
		path: '/bankaccounts/matchfilters/{match_filter_id}',
		summary: 'Delete a match filter',
		description: 'Delete a match filter.',
		docsUrl: 'https://www.zoho.com/books/api/v3/bank-rules/',
		parameters: [
			{
				name: 'match_filter_id',
				in: 'path',
				required: true,
				description:
					'Unique identifier of the match filter. Note: This value is a set of numeric characters.',
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
					$ref: '#/components/schemas/delete-bank-account-match-filter-response',
				},
			},
		],
		scopes: ['ZohoBooks.banking.DELETE'],
		riskLevel: 'destructive',
	},
] as const satisfies readonly ZohoBooksOperationDefinition[];
