import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { zohoBooksSchemaEntry } from '../schema/openapi-validation';
import type {
	ZohoBooksOperationId,
	zohoBooksOperationId,
} from '../schema/operation-types';
import { createZohoBooksOperationEndpoint } from './factory';

export const zohoBooksEndpointsNested = {
	bankAccounts: {
		createBankAccount: createZohoBooksOperationEndpoint('create_bank_account'),
		listBankAccounts: createZohoBooksOperationEndpoint('list_bank_accounts'),
		updateBankAccount: createZohoBooksOperationEndpoint('update_bank_account'),
		getBankAccount: createZohoBooksOperationEndpoint('get_bank_account'),
		deleteBankAccount: createZohoBooksOperationEndpoint('delete_bank_account'),
		markBankAccountInactive: createZohoBooksOperationEndpoint(
			'mark_bank_account_inactive',
		),
		markBankAccountActive: createZohoBooksOperationEndpoint(
			'mark_bank_account_active',
		),
		importBankStatements: createZohoBooksOperationEndpoint(
			'import_bank_statements',
		),
		getLastImportedBankStatement: createZohoBooksOperationEndpoint(
			'get_last_imported_bank_statement',
		),
		deleteLastImportedBankStatement: createZohoBooksOperationEndpoint(
			'delete_last_imported_bank_statement',
		),
		listBankReconciliations: createZohoBooksOperationEndpoint(
			'list_bank_reconciliations',
		),
		createBankReconciliation: createZohoBooksOperationEndpoint(
			'create_bank_reconciliation',
		),
		getBankReconciliation: createZohoBooksOperationEndpoint(
			'get_bank_reconciliation',
		),
		updateBankReconciliation: createZohoBooksOperationEndpoint(
			'update_bank_reconciliation',
		),
		deleteBankReconciliation: createZohoBooksOperationEndpoint(
			'delete_bank_reconciliation',
		),
		saveBankReconciliationDraft: createZohoBooksOperationEndpoint(
			'save_bank_reconciliation_draft',
		),
		addBankReconciliationAttachment: createZohoBooksOperationEndpoint(
			'add_bank_reconciliation_attachment',
		),
		getBankReconciliationDocument: createZohoBooksOperationEndpoint(
			'get_bank_reconciliation_document',
		),
		deleteBankReconciliationDocument: createZohoBooksOperationEndpoint(
			'delete_bank_reconciliation_document',
		),
		listBankAccountBalances: createZohoBooksOperationEndpoint(
			'list_bank_account_balances',
		),
		getBankAccountsOverview: createZohoBooksOperationEndpoint(
			'get_bank_accounts_overview',
		),
		getBankAccountBalance: createZohoBooksOperationEndpoint(
			'get_bank_account_balance',
		),
		getBankAccountBalances: createZohoBooksOperationEndpoint(
			'get_bank_account_balances',
		),
		getBankAccountInsights: createZohoBooksOperationEndpoint(
			'get_bank_account_insights',
		),
		getBankAccountOverview: createZohoBooksOperationEndpoint(
			'get_bank_account_overview',
		),
		getBankAccountStatementSummary: createZohoBooksOperationEndpoint(
			'get_bank_account_statement_summary',
		),
		listBankAccountSubaccounts: createZohoBooksOperationEndpoint(
			'list_bank_account_subaccounts',
		),
		listBankAccountStatements: createZohoBooksOperationEndpoint(
			'list_bank_account_statements',
		),
		listUnreviewedBankStatements: createZohoBooksOperationEndpoint(
			'list_unreviewed_bank_statements',
		),
		listBankAccountTransactions: createZohoBooksOperationEndpoint(
			'list_bank_account_transactions',
		),
		getBankAccountPreferences: createZohoBooksOperationEndpoint(
			'get_bank_account_preferences',
		),
		updateBankAccountPreferences: createZohoBooksOperationEndpoint(
			'update_bank_account_preferences',
		),
		getBankStatementImportEncryptionKey: createZohoBooksOperationEndpoint(
			'get_bank_statement_import_encryption_key',
		),
	},
	bankRules: {
		listBankAccountRules: createZohoBooksOperationEndpoint(
			'list_bank_account_rules',
		),
		createBankAccountRule: createZohoBooksOperationEndpoint(
			'create_bank_account_rule',
		),
		bulkUpdateBankAccountRules: createZohoBooksOperationEndpoint(
			'bulk_update_bank_account_rules',
		),
		bulkDeleteBankAccountRules: createZohoBooksOperationEndpoint(
			'bulk_delete_bank_account_rules',
		),
		getBankAccountRule: createZohoBooksOperationEndpoint(
			'get_bank_account_rule',
		),
		updateBankAccountRule: createZohoBooksOperationEndpoint(
			'update_bank_account_rule',
		),
		deleteBankAccountRule: createZohoBooksOperationEndpoint(
			'delete_bank_account_rule',
		),
		reorderBankAccountRules: createZohoBooksOperationEndpoint(
			'reorder_bank_account_rules',
		),
		skipSuggestedBankAccountRule: createZohoBooksOperationEndpoint(
			'skip_suggested_bank_account_rule',
		),
		listBankAccountMatchFilters: createZohoBooksOperationEndpoint(
			'list_bank_account_match_filters',
		),
		createBankAccountMatchFilter: createZohoBooksOperationEndpoint(
			'create_bank_account_match_filter',
		),
		updateBankAccountMatchFilter: createZohoBooksOperationEndpoint(
			'update_bank_account_match_filter',
		),
		deleteBankAccountMatchFilter: createZohoBooksOperationEndpoint(
			'delete_bank_account_match_filter',
		),
	},
	bankTransactions: {
		createBankTransaction: createZohoBooksOperationEndpoint(
			'create_bank_transaction',
		),
		listBankTransactions: createZohoBooksOperationEndpoint(
			'list_bank_transactions',
		),
		updateBankTransaction: createZohoBooksOperationEndpoint(
			'update_bank_transaction',
		),
		getBankTransaction: createZohoBooksOperationEndpoint(
			'get_bank_transaction',
		),
		deleteBankTransaction: createZohoBooksOperationEndpoint(
			'delete_bank_transaction',
		),
		getMatchingBankTransactions: createZohoBooksOperationEndpoint(
			'get_matching_bank_transactions',
		),
		matchBankTransaction: createZohoBooksOperationEndpoint(
			'match_bank_transaction',
		),
		unmatchBankTransaction: createZohoBooksOperationEndpoint(
			'unmatch_bank_transaction',
		),
		excludeBankTransaction: createZohoBooksOperationEndpoint(
			'exclude_bank_transaction',
		),
		restoreBankTransaction: createZohoBooksOperationEndpoint(
			'restore_bank_transaction',
		),
		categorizeBankTransaction: createZohoBooksOperationEndpoint(
			'categorize_bank_transaction',
		),
		categorizeBankTransactionAsExpense: createZohoBooksOperationEndpoint(
			'categorize_bank_transaction_as_expense',
		),
		uncategorizeBankTransaction: createZohoBooksOperationEndpoint(
			'uncategorize_bank_transaction',
		),
		categorizeBankTransactionAsVendorPayment: createZohoBooksOperationEndpoint(
			'categorize_bank_transaction_as_vendor_payment',
		),
		categorizeBankTransactionAsCustomerPayment:
			createZohoBooksOperationEndpoint(
				'categorize_bank_transaction_as_customer_payment',
			),
		categorizeAsCreditNoteRefunds: createZohoBooksOperationEndpoint(
			'categorize_as_credit_note_refunds',
		),
		categorizeAsVendorCreditRefunds: createZohoBooksOperationEndpoint(
			'categorize_as_vendor_credit_refunds',
		),
		categorizeBankTransactionAsPaymentRefund: createZohoBooksOperationEndpoint(
			'categorize_bank_transaction_as_payment_refund',
		),
		categorizeAsVendorPaymentRefund: createZohoBooksOperationEndpoint(
			'categorize_as_vendor_payment_refund',
		),
	},
	baseCurrencyAdjustment: {
		createBaseCurrencyAdjustment: createZohoBooksOperationEndpoint(
			'create_base_currency_adjustment',
		),
		listBaseCurrencyAdjustments: createZohoBooksOperationEndpoint(
			'list_base_currency_adjustments',
		),
		getBaseCurrencyAdjustment: createZohoBooksOperationEndpoint(
			'get_base_currency_adjustment',
		),
		deleteBaseCurrencyAdjustment: createZohoBooksOperationEndpoint(
			'delete_base_currency_adjustment',
		),
		bulkDeleteBaseCurrencyAdjustments: createZohoBooksOperationEndpoint(
			'bulk_delete_base_currency_adjustments',
		),
		reevaluateBaseCurrencyAdjustment: createZohoBooksOperationEndpoint(
			'reevaluate_base_currency_adjustment',
		),
		listBaseCurrencyAdjustmentAccounts: createZohoBooksOperationEndpoint(
			'list_base_currency_adjustment_accounts',
		),
		listBaseCurrencyAdjustmentContacts: createZohoBooksOperationEndpoint(
			'list_base_currency_adjustment_contacts',
		),
	},
	bills: {
		createBill: createZohoBooksOperationEndpoint('create_bill'),
		listBills: createZohoBooksOperationEndpoint('list_bills'),
		updateBillUsingCustomField: createZohoBooksOperationEndpoint(
			'update_bill_using_custom_field',
		),
		updateBill: createZohoBooksOperationEndpoint('update_bill'),
		getBill: createZohoBooksOperationEndpoint('get_bill'),
		deleteBill: createZohoBooksOperationEndpoint('delete_bill'),
		updateCustomFieldsInBill: createZohoBooksOperationEndpoint(
			'update_custom_fields_in_bill',
		),
		markBillVoid: createZohoBooksOperationEndpoint('mark_bill_void'),
		markBillOpen: createZohoBooksOperationEndpoint('mark_bill_open'),
		submitBill: createZohoBooksOperationEndpoint('submit_bill'),
		approveBill: createZohoBooksOperationEndpoint('approve_bill'),
		updateBillBillingAddress: createZohoBooksOperationEndpoint(
			'update_bill_billing_address',
		),
		listBillPayments: createZohoBooksOperationEndpoint('list_bill_payments'),
		applyCreditsToBill: createZohoBooksOperationEndpoint(
			'apply_credits_to_bill',
		),
		deleteBillPayment: createZohoBooksOperationEndpoint('delete_bill_payment'),
		getBillAttachment: createZohoBooksOperationEndpoint('get_bill_attachment'),
		addBillAttachment: createZohoBooksOperationEndpoint('add_bill_attachment'),
		deleteBillAttachment: createZohoBooksOperationEndpoint(
			'delete_bill_attachment',
		),
		getBillComments: createZohoBooksOperationEndpoint('get_bill_comments'),
		addBillComment: createZohoBooksOperationEndpoint('add_bill_comment'),
		deleteBillComment: createZohoBooksOperationEndpoint('delete_bill_comment'),
		convertPurchaseOrderToBill: createZohoBooksOperationEndpoint(
			'convert_purchase_order_to_bill',
		),
	},
	categories: {
		listCategories: createZohoBooksOperationEndpoint('list_categories'),
		createCategory: createZohoBooksOperationEndpoint('create_category'),
		getCategory: createZohoBooksOperationEndpoint('get_category'),
		updateCategory: createZohoBooksOperationEndpoint('update_category'),
		deleteCategory: createZohoBooksOperationEndpoint('delete_category'),
	},
	chartOfAccounts: {
		createChartOfAccount: createZohoBooksOperationEndpoint(
			'create_chart_of_account',
		),
		listChartOfAccounts: createZohoBooksOperationEndpoint(
			'list_chart_of_accounts',
		),
		updateChartOfAccount: createZohoBooksOperationEndpoint(
			'update_chart_of_account',
		),
		getChartOfAccount: createZohoBooksOperationEndpoint('get_chart_of_account'),
		deleteChartOfAccount: createZohoBooksOperationEndpoint(
			'delete_chart_of_account',
		),
		markChartOfAccountActive: createZohoBooksOperationEndpoint(
			'mark_chart_of_account_active',
		),
		markChartOfAccountInactive: createZohoBooksOperationEndpoint(
			'mark_chart_of_account_inactive',
		),
		bulkMarkChartOfAccountsActive: createZohoBooksOperationEndpoint(
			'bulk_mark_chart_of_accounts_active',
		),
		bulkMarkChartOfAccountsInactive: createZohoBooksOperationEndpoint(
			'bulk_mark_chart_of_accounts_inactive',
		),
		bulkDeleteChartOfAccounts: createZohoBooksOperationEndpoint(
			'bulk_delete_chart_of_accounts',
		),
		listChartOfAccountTransactions: createZohoBooksOperationEndpoint(
			'list_chart_of_account_transactions',
		),
		deleteChartOfAccountTransaction: createZohoBooksOperationEndpoint(
			'delete_chart_of_account_transaction',
		),
	},
	contactPersons: {
		createContactPerson: createZohoBooksOperationEndpoint(
			'create_contact_person',
		),
		updateContactPerson: createZohoBooksOperationEndpoint(
			'update_contact_person',
		),
		deleteContactPerson: createZohoBooksOperationEndpoint(
			'delete_contact_person',
		),
		listContactPersons: createZohoBooksOperationEndpoint(
			'list_contact_persons',
		),
		getContactPerson: createZohoBooksOperationEndpoint('get_contact_person'),
		markContactPersonPrimary: createZohoBooksOperationEndpoint(
			'mark_contact_person_primary',
		),
	},
	contacts: {
		createContact: createZohoBooksOperationEndpoint('create_contact'),
		listContacts: createZohoBooksOperationEndpoint('list_contacts'),
		updateContactUsingCustomField: createZohoBooksOperationEndpoint(
			'update_contact_using_custom_field',
		),
		deleteContacts: createZohoBooksOperationEndpoint('delete_contacts'),
		assignContactOwner: createZohoBooksOperationEndpoint(
			'assign_contact_owner',
		),
		assignOwnerToContacts: createZohoBooksOperationEndpoint(
			'assign_owner_to_contacts',
		),
		markContactsFor1099Tracking: createZohoBooksOperationEndpoint(
			'mark_contacts_for_1099_tracking',
		),
		verifyContactBankAccount: createZohoBooksOperationEndpoint(
			'verify_contact_bank_account',
		),
		verifyContactAddress: createZohoBooksOperationEndpoint(
			'verify_contact_address',
		),
		listContactAutobillRecurringInvoices: createZohoBooksOperationEndpoint(
			'list_contact_autobill_recurring_invoices',
		),
		updateContact: createZohoBooksOperationEndpoint('update_contact'),
		getContact: createZohoBooksOperationEndpoint('get_contact'),
		deleteContact: createZohoBooksOperationEndpoint('delete_contact'),
		markContactActive: createZohoBooksOperationEndpoint('mark_contact_active'),
		markContactInactive: createZohoBooksOperationEndpoint(
			'mark_contact_inactive',
		),
		enableContactPortal: createZohoBooksOperationEndpoint(
			'enable_contact_portal',
		),
		enableContactPaymentReminder: createZohoBooksOperationEndpoint(
			'enable_contact_payment_reminder',
		),
		disableContactPaymentReminder: createZohoBooksOperationEndpoint(
			'disable_contact_payment_reminder',
		),
		emailContactStatement: createZohoBooksOperationEndpoint(
			'email_contact_statement',
		),
		getContactStatementMail: createZohoBooksOperationEndpoint(
			'get_contact_statement_mail',
		),
		getContactEmailContent: createZohoBooksOperationEndpoint(
			'get_contact_email_content',
		),
		emailContact: createZohoBooksOperationEndpoint('email_contact'),
		listContactComments: createZohoBooksOperationEndpoint(
			'list_contact_comments',
		),
		addContactComment: createZohoBooksOperationEndpoint('add_contact_comment'),
		getContactAddress: createZohoBooksOperationEndpoint('get_contact_address'),
		addContactAddress: createZohoBooksOperationEndpoint('add_contact_address'),
		updateContactAddress: createZohoBooksOperationEndpoint(
			'update_contact_address',
		),
		deleteContactAddress: createZohoBooksOperationEndpoint(
			'delete_contact_address',
		),
		listContactCreditNoteRefunds: createZohoBooksOperationEndpoint(
			'list_contact_credit_note_refunds',
		),
		trackContact1099: createZohoBooksOperationEndpoint('track_contact_1099'),
		untrackContact1099: createZohoBooksOperationEndpoint(
			'untrack_contact_1099',
		),
		getUnusedRetainerPayments: createZohoBooksOperationEndpoint(
			'get_unused_retainer_payments',
		),
		addContactBankAccount: createZohoBooksOperationEndpoint(
			'add_contact_bank_account',
		),
		getContactBankAccount: createZohoBooksOperationEndpoint(
			'get_contact_bank_account',
		),
		updateContactBankAccount: createZohoBooksOperationEndpoint(
			'update_contact_bank_account',
		),
		deleteContactBankAccount: createZohoBooksOperationEndpoint(
			'delete_contact_bank_account',
		),
		approveContactBankAccount: createZohoBooksOperationEndpoint(
			'approve_contact_bank_account',
		),
		declineContactBankAccount: createZohoBooksOperationEndpoint(
			'decline_contact_bank_account',
		),
		listContactBankAccounts: createZohoBooksOperationEndpoint(
			'list_contact_bank_accounts',
		),
		listAllContactBankAccounts: createZohoBooksOperationEndpoint(
			'list_all_contact_bank_accounts',
		),
		addContactCard: createZohoBooksOperationEndpoint('add_contact_card'),
		getContactCard: createZohoBooksOperationEndpoint('get_contact_card'),
		updateContactCard: createZohoBooksOperationEndpoint('update_contact_card'),
		deleteContactCard: createZohoBooksOperationEndpoint('delete_contact_card'),
		listContactCards: createZohoBooksOperationEndpoint('list_contact_cards'),
		getContactCardCount: createZohoBooksOperationEndpoint(
			'get_contact_card_count',
		),
		listAllContactPersons: createZohoBooksOperationEndpoint(
			'list_all_contact_persons',
		),
		getContactContactPerson: createZohoBooksOperationEndpoint(
			'get_contact_contact_person',
		),
		inviteContactPersonToPortal: createZohoBooksOperationEndpoint(
			'invite_contact_person_to_portal',
		),
		resendContactPersonPortalInvite: createZohoBooksOperationEndpoint(
			'resend_contact_person_portal_invite',
		),
		enableContactPersonSms: createZohoBooksOperationEndpoint(
			'enable_contact_person_sms',
		),
		disableContactPersonSms: createZohoBooksOperationEndpoint(
			'disable_contact_person_sms',
		),
		deleteContactComment: createZohoBooksOperationEndpoint(
			'delete_contact_comment',
		),
		getContactDocument: createZohoBooksOperationEndpoint(
			'get_contact_document',
		),
		updateContactDocument: createZohoBooksOperationEndpoint(
			'update_contact_document',
		),
		deleteContactDocument: createZohoBooksOperationEndpoint(
			'delete_contact_document',
		),
		restoreContactDocuments: createZohoBooksOperationEndpoint(
			'restore_contact_documents',
		),
		updateContactTags: createZohoBooksOperationEndpoint('update_contact_tags'),
		deleteContactTag: createZohoBooksOperationEndpoint('delete_contact_tag'),
		listContactTaxInfo: createZohoBooksOperationEndpoint(
			'list_contact_tax_info',
		),
		addContactTaxInfo: createZohoBooksOperationEndpoint('add_contact_tax_info'),
		updateContactTaxInfo: createZohoBooksOperationEndpoint(
			'update_contact_tax_info',
		),
		deleteContactTaxInfo: createZohoBooksOperationEndpoint(
			'delete_contact_tax_info',
		),
		listContactAddresses: createZohoBooksOperationEndpoint(
			'list_contact_addresses',
		),
		markContactAddressAsBilling: createZohoBooksOperationEndpoint(
			'mark_contact_address_as_billing',
		),
		markContactAddressAsShipping: createZohoBooksOperationEndpoint(
			'mark_contact_address_as_shipping',
		),
		verifyContactAddressById: createZohoBooksOperationEndpoint(
			'verify_contact_address_by_id',
		),
		addContactAttachment: createZohoBooksOperationEndpoint(
			'add_contact_attachment',
		),
		mergeContact: createZohoBooksOperationEndpoint('merge_contact'),
		verifyContactEinvoice: createZohoBooksOperationEndpoint(
			'verify_contact_einvoice',
		),
		disableContactPortal: createZohoBooksOperationEndpoint(
			'disable_contact_portal',
		),
		getContactsSmsContent: createZohoBooksOperationEndpoint(
			'get_contacts_sms_content',
		),
		sendContactsSms: createZohoBooksOperationEndpoint('send_contacts_sms'),
		getContactSmsContent: createZohoBooksOperationEndpoint(
			'get_contact_sms_content',
		),
		sendContactSms: createZohoBooksOperationEndpoint('send_contact_sms'),
		getContactByReference: createZohoBooksOperationEndpoint(
			'get_contact_by_reference',
		),
		getContactStatement: createZohoBooksOperationEndpoint(
			'get_contact_statement',
		),
		getContactUnusedCredits: createZohoBooksOperationEndpoint(
			'get_contact_unused_credits',
		),
		listContactPaymentRefunds: createZohoBooksOperationEndpoint(
			'list_contact_payment_refunds',
		),
		getContactIncomeAndExpense: createZohoBooksOperationEndpoint(
			'get_contact_income_and_expense',
		),
		getContactProfitAndLoss: createZohoBooksOperationEndpoint(
			'get_contact_profit_and_loss',
		),
		getContactInventorySummary: createZohoBooksOperationEndpoint(
			'get_contact_inventory_summary',
		),
		getContactOpeningBalances: createZohoBooksOperationEndpoint(
			'get_contact_opening_balances',
		),
		updateContactTrnStatus: createZohoBooksOperationEndpoint(
			'update_contact_trn_status',
		),
		getContactClientReviewEmail: createZohoBooksOperationEndpoint(
			'get_contact_client_review_email',
		),
		sendContactClientReviewEmail: createZohoBooksOperationEndpoint(
			'send_contact_client_review_email',
		),
		getContactPaymentMethodEmail: createZohoBooksOperationEndpoint(
			'get_contact_payment_method_email',
		),
		sendContactPaymentMethodEmail: createZohoBooksOperationEndpoint(
			'send_contact_payment_method_email',
		),
		getContactVendorStatementEmail: createZohoBooksOperationEndpoint(
			'get_contact_vendor_statement_email',
		),
		sendContactVendorStatementEmail: createZohoBooksOperationEndpoint(
			'send_contact_vendor_statement_email',
		),
	},
	creditNotes: {
		createCreditNote: createZohoBooksOperationEndpoint('create_credit_note'),
		listCreditNotes: createZohoBooksOperationEndpoint('list_credit_notes'),
		updateCreditNoteUsingCustomField: createZohoBooksOperationEndpoint(
			'update_credit_note_using_custom_field',
		),
		updateCreditNote: createZohoBooksOperationEndpoint('update_credit_note'),
		getCreditNote: createZohoBooksOperationEndpoint('get_credit_note'),
		deleteCreditNote: createZohoBooksOperationEndpoint('delete_credit_note'),
		emailCreditNote: createZohoBooksOperationEndpoint('email_credit_note'),
		getCreditNoteEmail: createZohoBooksOperationEndpoint(
			'get_credit_note_email',
		),
		markCreditNoteVoid: createZohoBooksOperationEndpoint(
			'mark_credit_note_void',
		),
		markCreditNoteDraft: createZohoBooksOperationEndpoint(
			'mark_credit_note_draft',
		),
		markCreditNoteOpen: createZohoBooksOperationEndpoint(
			'mark_credit_note_open',
		),
		submitCreditNote: createZohoBooksOperationEndpoint('submit_credit_note'),
		approveCreditNote: createZohoBooksOperationEndpoint('approve_credit_note'),
		getCreditNoteEmailHistory: createZohoBooksOperationEndpoint(
			'get_credit_note_email_history',
		),
		updateCreditNoteBillingAddress: createZohoBooksOperationEndpoint(
			'update_credit_note_billing_address',
		),
		updateCreditNoteShippingAddress: createZohoBooksOperationEndpoint(
			'update_credit_note_shipping_address',
		),
		listCreditNoteTemplates: createZohoBooksOperationEndpoint(
			'list_credit_note_templates',
		),
		updateCreditNoteTemplate: createZohoBooksOperationEndpoint(
			'update_credit_note_template',
		),
		listInvoicesOfCreditNote: createZohoBooksOperationEndpoint(
			'list_invoices_of_credit_note',
		),
		applyCreditNoteToInvoice: createZohoBooksOperationEndpoint(
			'apply_credit_note_to_invoice',
		),
		deleteInvoiceOfCreditNote: createZohoBooksOperationEndpoint(
			'delete_invoice_of_credit_note',
		),
		listCreditNoteComments: createZohoBooksOperationEndpoint(
			'list_credit_note_comments',
		),
		addCreditNoteComment: createZohoBooksOperationEndpoint(
			'add_credit_note_comment',
		),
		deleteCreditNoteComment: createZohoBooksOperationEndpoint(
			'delete_credit_note_comment',
		),
		listCreditNoteRefundsOfAllCreditNotes: createZohoBooksOperationEndpoint(
			'list_credit_note_refunds_of_all_credit_notes',
		),
		listCreditNoteRefundsOfACreditNote: createZohoBooksOperationEndpoint(
			'list_credit_note_refunds_of_a_credit_note',
		),
		createCreditNoteRefund: createZohoBooksOperationEndpoint(
			'create_credit_note_refund',
		),
		getCreditNoteRefund: createZohoBooksOperationEndpoint(
			'get_credit_note_refund',
		),
		updateCreditNoteRefund: createZohoBooksOperationEndpoint(
			'update_credit_note_refund',
		),
		deleteCreditNoteRefund: createZohoBooksOperationEndpoint(
			'delete_credit_note_refund',
		),
		approveCreditNotes: createZohoBooksOperationEndpoint(
			'approve_credit_notes',
		),
		submitCreditNotes: createZohoBooksOperationEndpoint('submit_credit_notes'),
		finalizeCreditNoteApproval: createZohoBooksOperationEndpoint(
			'finalize_credit_note_approval',
		),
		rejectCreditNote: createZohoBooksOperationEndpoint('reject_credit_note'),
		getCreditNoteSignatureTemplate: createZohoBooksOperationEndpoint(
			'get_credit_note_signature_template',
		),
		printCreditNotes: createZohoBooksOperationEndpoint('print_credit_notes'),
		addCreditNoteAttachment: createZohoBooksOperationEndpoint(
			'add_credit_note_attachment',
		),
		getCreditNoteDocument: createZohoBooksOperationEndpoint(
			'get_credit_note_document',
		),
		updateCreditNoteDocument: createZohoBooksOperationEndpoint(
			'update_credit_note_document',
		),
		deleteCreditNoteDocument: createZohoBooksOperationEndpoint(
			'delete_credit_note_document',
		),
		getCreditNoteCustomFields: createZohoBooksOperationEndpoint(
			'get_credit_note_custom_fields',
		),
		updateCreditNoteCustomFields: createZohoBooksOperationEndpoint(
			'update_credit_note_custom_fields',
		),
		getCreditNoteMailContent: createZohoBooksOperationEndpoint(
			'get_credit_note_mail_content',
		),
		addCreditNoteDigitalSignature: createZohoBooksOperationEndpoint(
			'add_credit_note_digital_signature',
		),
		uploadCreditNoteDigitalSignature: createZohoBooksOperationEndpoint(
			'upload_credit_note_digital_signature',
		),
		getCreditNoteRefundById: createZohoBooksOperationEndpoint(
			'get_credit_note_refund_by_id',
		),
		applyCreditNoteSubstatus: createZohoBooksOperationEndpoint(
			'apply_credit_note_substatus',
		),
		deleteCreditNoteSubstatus: createZohoBooksOperationEndpoint(
			'delete_credit_note_substatus',
		),
		listCreditNotesEinvoice: createZohoBooksOperationEndpoint(
			'list_credit_notes_einvoice',
		),
		pushCreditNotesEinvoice: createZohoBooksOperationEndpoint(
			'push_credit_notes_einvoice',
		),
		cancelCreditNotesEinvoice: createZohoBooksOperationEndpoint(
			'cancel_credit_notes_einvoice',
		),
		getCreditNoteEinvoice: createZohoBooksOperationEndpoint(
			'get_credit_note_einvoice',
		),
		pushCreditNoteEinvoice: createZohoBooksOperationEndpoint(
			'push_credit_note_einvoice',
		),
		cancelCreditNoteEinvoice: createZohoBooksOperationEndpoint(
			'cancel_credit_note_einvoice',
		),
		fetchCreditNoteEinvoice: createZohoBooksOperationEndpoint(
			'fetch_credit_note_einvoice',
		),
		deleteCreditNoteEinvoiceStatus: createZohoBooksOperationEndpoint(
			'delete_credit_note_einvoice_status',
		),
		markCreditNoteEinvoicePushed: createZohoBooksOperationEndpoint(
			'mark_credit_note_einvoice_pushed',
		),
		markCreditNoteEinvoiceCancelled: createZohoBooksOperationEndpoint(
			'mark_credit_note_einvoice_cancelled',
		),
		recallCreditNoteEinvoiceStatus: createZohoBooksOperationEndpoint(
			'recall_credit_note_einvoice_status',
		),
		pushCreditNoteRefundEinvoice: createZohoBooksOperationEndpoint(
			'push_credit_note_refund_einvoice',
		),
		markCreditNoteReadyToPush: createZohoBooksOperationEndpoint(
			'mark_credit_note_ready_to_push',
		),
		updateCreditNoteCfdiStatus: createZohoBooksOperationEndpoint(
			'update_credit_note_cfdi_status',
		),
		cancelEinvoiceCreditNote: createZohoBooksOperationEndpoint(
			'cancel_einvoice_credit_note',
		),
	},
	currency: {
		createCurrency: createZohoBooksOperationEndpoint('create_currency'),
		listCurrencies: createZohoBooksOperationEndpoint('list_currencies'),
		updateCurrency: createZohoBooksOperationEndpoint('update_currency'),
		getCurrency: createZohoBooksOperationEndpoint('get_currency'),
		deleteCurrency: createZohoBooksOperationEndpoint('delete_currency'),
		listExchangeRates: createZohoBooksOperationEndpoint('list_exchange_rates'),
		createExchangeRate: createZohoBooksOperationEndpoint(
			'create_exchange_rate',
		),
		getExchangeRate: createZohoBooksOperationEndpoint('get_exchange_rate'),
		updateExchangeRate: createZohoBooksOperationEndpoint(
			'update_exchange_rate',
		),
		deleteExchangeRate: createZohoBooksOperationEndpoint(
			'delete_exchange_rate',
		),
	},
	customModules: {
		listCustomModules: createZohoBooksOperationEndpoint('list_custom_modules'),
		createCustomModule: createZohoBooksOperationEndpoint(
			'create_custom_module',
		),
		getCustomModule: createZohoBooksOperationEndpoint('get_custom_module'),
		updateCustomModule: createZohoBooksOperationEndpoint(
			'update_custom_module',
		),
		deleteCustomModule: createZohoBooksOperationEndpoint(
			'delete_custom_module',
		),
		listCustomModuleRecords: createZohoBooksOperationEndpoint(
			'list_custom_module_records',
		),
		bulkUpdateCustomModuleRecords: createZohoBooksOperationEndpoint(
			'bulk_update_custom_module_records',
		),
		createCustomModuleRecord: createZohoBooksOperationEndpoint(
			'create_custom_module_record',
		),
		deleteCustomModuleRecords: createZohoBooksOperationEndpoint(
			'delete_custom_module_records',
		),
		getCustomModuleRecord: createZohoBooksOperationEndpoint(
			'get_custom_module_record',
		),
		updateCustomModuleRecord: createZohoBooksOperationEndpoint(
			'update_custom_module_record',
		),
		deleteCustomModuleRecord: createZohoBooksOperationEndpoint(
			'delete_custom_module_record',
		),
	},
	customerDebitNotes: {
		createCustomerDebitNote: createZohoBooksOperationEndpoint(
			'create_customer_debit_note',
		),
		listCustomerDebitNotes: createZohoBooksOperationEndpoint(
			'list_customer_debit_notes',
		),
		updateCustomerDebitNote: createZohoBooksOperationEndpoint(
			'update_customer_debit_note',
		),
		getCustomerDebitNote: createZohoBooksOperationEndpoint(
			'get_customer_debit_note',
		),
		deleteCustomerDebitNote: createZohoBooksOperationEndpoint(
			'delete_customer_debit_note',
		),
	},
	customerPayments: {
		createCustomerPayment: createZohoBooksOperationEndpoint(
			'create_customer_payment',
		),
		listCustomerPayments: createZohoBooksOperationEndpoint(
			'list_customer_payments',
		),
		bulkDeleteCustomerPayments: createZohoBooksOperationEndpoint(
			'bulk_delete_customer_payments',
		),
		updateCustomerPaymentUsingCustomField: createZohoBooksOperationEndpoint(
			'update_customer_payment_using_custom_field',
		),
		updateCustomerPayment: createZohoBooksOperationEndpoint(
			'update_customer_payment',
		),
		getCustomerPayment: createZohoBooksOperationEndpoint(
			'get_customer_payment',
		),
		deleteCustomerPayment: createZohoBooksOperationEndpoint(
			'delete_customer_payment',
		),
		listCustomerPaymentRefunds: createZohoBooksOperationEndpoint(
			'list_customer_payment_refunds',
		),
		createCustomerPaymentRefund: createZohoBooksOperationEndpoint(
			'create_customer_payment_refund',
		),
		updateCustomFieldsInCustomerPayment: createZohoBooksOperationEndpoint(
			'update_custom_fields_in_customer_payment',
		),
		getCustomerPaymentRefund: createZohoBooksOperationEndpoint(
			'get_customer_payment_refund',
		),
		updateCustomerPaymentRefund: createZohoBooksOperationEndpoint(
			'update_customer_payment_refund',
		),
		deleteCustomerPaymentRefund: createZohoBooksOperationEndpoint(
			'delete_customer_payment_refund',
		),
	},
	deliveryChallans: {
		listDeliveryChallans: createZohoBooksOperationEndpoint(
			'list_delivery_challans',
		),
		createDeliveryChallan: createZohoBooksOperationEndpoint(
			'create_delivery_challan',
		),
		getDeliveryChallan: createZohoBooksOperationEndpoint(
			'get_delivery_challan',
		),
		updateDeliveryChallan: createZohoBooksOperationEndpoint(
			'update_delivery_challan',
		),
		deleteDeliveryChallan: createZohoBooksOperationEndpoint(
			'delete_delivery_challan',
		),
		markDeliveryChallanAsOpen: createZohoBooksOperationEndpoint(
			'mark_delivery_challan_as_open',
		),
		markDeliveryChallanAsDelivered: createZohoBooksOperationEndpoint(
			'mark_delivery_challan_as_delivered',
		),
		markDeliveryChallanAsReturned: createZohoBooksOperationEndpoint(
			'mark_delivery_challan_as_returned',
		),
		markDeliveryChallanAsUndelivered: createZohoBooksOperationEndpoint(
			'mark_delivery_challan_as_undelivered',
		),
		returnDeliveryChallans: createZohoBooksOperationEndpoint(
			'return_delivery_challans',
		),
		undoReturnDeliveryChallans: createZohoBooksOperationEndpoint(
			'undo_return_delivery_challans',
		),
		addAttachmentToDeliveryChallan: createZohoBooksOperationEndpoint(
			'add_attachment_to_delivery_challan',
		),
		getDeliveryChallanAttachment: createZohoBooksOperationEndpoint(
			'get_delivery_challan_attachment',
		),
		deleteDeliveryChallanAttachment: createZohoBooksOperationEndpoint(
			'delete_delivery_challan_attachment',
		),
		listDeliveryChallanTemplates: createZohoBooksOperationEndpoint(
			'list_delivery_challan_templates',
		),
		updateDeliveryChallanTemplate: createZohoBooksOperationEndpoint(
			'update_delivery_challan_template',
		),
		updateDeliveryChallanShippingAddress: createZohoBooksOperationEndpoint(
			'update_delivery_challan_shipping_address',
		),
	},
	estimates: {
		createEstimate: createZohoBooksOperationEndpoint('create_estimate'),
		listEstimates: createZohoBooksOperationEndpoint('list_estimates'),
		updateEstimateUsingCustomField: createZohoBooksOperationEndpoint(
			'update_estimate_using_custom_field',
		),
		updateEstimate: createZohoBooksOperationEndpoint('update_estimate'),
		getEstimate: createZohoBooksOperationEndpoint('get_estimate'),
		deleteEstimate: createZohoBooksOperationEndpoint('delete_estimate'),
		updateCustomFieldsInEstimate: createZohoBooksOperationEndpoint(
			'update_custom_fields_in_estimate',
		),
		markEstimateSent: createZohoBooksOperationEndpoint('mark_estimate_sent'),
		markEstimateAccepted: createZohoBooksOperationEndpoint(
			'mark_estimate_accepted',
		),
		markEstimateDeclined: createZohoBooksOperationEndpoint(
			'mark_estimate_declined',
		),
		submitEstimate: createZohoBooksOperationEndpoint('submit_estimate'),
		approveEstimate: createZohoBooksOperationEndpoint('approve_estimate'),
		emailEstimate: createZohoBooksOperationEndpoint('email_estimate'),
		getEstimateEmail: createZohoBooksOperationEndpoint('get_estimate_email'),
		emailMultipleEstimates: createZohoBooksOperationEndpoint(
			'email_multiple_estimates',
		),
		bulkExportEstimatesAsPdf: createZohoBooksOperationEndpoint(
			'bulk_export_estimates_as_pdf',
		),
		bulkPrintEstimates: createZohoBooksOperationEndpoint(
			'bulk_print_estimates',
		),
		updateEstimateBillingAddress: createZohoBooksOperationEndpoint(
			'update_estimate_billing_address',
		),
		updateEstimateShippingAddress: createZohoBooksOperationEndpoint(
			'update_estimate_shipping_address',
		),
		listEstimateTemplates: createZohoBooksOperationEndpoint(
			'list_estimate_templates',
		),
		updateEstimateTemplate: createZohoBooksOperationEndpoint(
			'update_estimate_template',
		),
		listEstimateComments: createZohoBooksOperationEndpoint(
			'list_estimate_comments',
		),
		createEstimateComment: createZohoBooksOperationEndpoint(
			'create_estimate_comment',
		),
		updateEstimateComment: createZohoBooksOperationEndpoint(
			'update_estimate_comment',
		),
		deleteEstimateComment: createZohoBooksOperationEndpoint(
			'delete_estimate_comment',
		),
	},
	expenses: {
		createExpense: createZohoBooksOperationEndpoint('create_expense'),
		listExpenses: createZohoBooksOperationEndpoint('list_expenses'),
		updateExpenseUsingCustomField: createZohoBooksOperationEndpoint(
			'update_expense_using_custom_field',
		),
		updateExpense: createZohoBooksOperationEndpoint('update_expense'),
		getExpense: createZohoBooksOperationEndpoint('get_expense'),
		deleteExpense: createZohoBooksOperationEndpoint('delete_expense'),
		listExpenseComments: createZohoBooksOperationEndpoint(
			'list_expense_comments',
		),
		listEmployees: createZohoBooksOperationEndpoint('list_employees'),
		createEmployee: createZohoBooksOperationEndpoint('create_employee'),
		getEmployee: createZohoBooksOperationEndpoint('get_employee'),
		deleteEmployee: createZohoBooksOperationEndpoint('delete_employee'),
		getExpenseReceipt: createZohoBooksOperationEndpoint('get_expense_receipt'),
		createExpenseReceipt: createZohoBooksOperationEndpoint(
			'create_expense_receipt',
		),
		deleteExpenseReceipt: createZohoBooksOperationEndpoint(
			'delete_expense_receipt',
		),
		addExpenseAttachment: createZohoBooksOperationEndpoint(
			'add_expense_attachment',
		),
	},
	fixedAssets: {
		createFixedAsset: createZohoBooksOperationEndpoint('create_fixed_asset'),
		listFixedAssets: createZohoBooksOperationEndpoint('list_fixed_assets'),
		updateFixedAsset: createZohoBooksOperationEndpoint('update_fixed_asset'),
		getFixedAsset: createZohoBooksOperationEndpoint('get_fixed_asset'),
		deleteFixedAsset: createZohoBooksOperationEndpoint('delete_fixed_asset'),
		getFixedAssetHistory: createZohoBooksOperationEndpoint(
			'get_fixed_asset_history',
		),
		getFixedAssetForecast: createZohoBooksOperationEndpoint(
			'get_fixed_asset_forecast',
		),
		markFixedAssetActive: createZohoBooksOperationEndpoint(
			'mark_fixed_asset_active',
		),
		markFixedAssetCancel: createZohoBooksOperationEndpoint(
			'mark_fixed_asset_cancel',
		),
		markFixedAssetDraft: createZohoBooksOperationEndpoint(
			'mark_fixed_asset_draft',
		),
		writeOffFixedAsset: createZohoBooksOperationEndpoint(
			'write_off_fixed_asset',
		),
		sellFixedAsset: createZohoBooksOperationEndpoint('sell_fixed_asset'),
		createFixedAssetComment: createZohoBooksOperationEndpoint(
			'create_fixed_asset_comment',
		),
		deleteFixedAssetComment: createZohoBooksOperationEndpoint(
			'delete_fixed_asset_comment',
		),
		createFixedAssetType: createZohoBooksOperationEndpoint(
			'create_fixed_asset_type',
		),
		getFixedAssetTypeList: createZohoBooksOperationEndpoint(
			'get_fixed_asset_type_list',
		),
		updateFixedAssetType: createZohoBooksOperationEndpoint(
			'update_fixed_asset_type',
		),
		deleteFixedAssetType: createZohoBooksOperationEndpoint(
			'delete_fixed_asset_type',
		),
	},
	integration: {
		importCustomerUsingCrmAccountId: createZohoBooksOperationEndpoint(
			'import_customer_using_crm_account_id',
		),
		importCustomerUsingCrmContactId: createZohoBooksOperationEndpoint(
			'import_customer_using_crm_contact_id',
		),
		importVendorUsingCrmVendorId: createZohoBooksOperationEndpoint(
			'import_vendor_using_crm_vendor_id',
		),
		importItemUsingCrmProductId: createZohoBooksOperationEndpoint(
			'import_item_using_crm_product_id',
		),
	},
	invoices: {
		createInvoice: createZohoBooksOperationEndpoint('create_invoice'),
		listInvoices: createZohoBooksOperationEndpoint('list_invoices'),
		updateInvoiceUsingCustomField: createZohoBooksOperationEndpoint(
			'update_invoice_using_custom_field',
		),
		deleteInvoices: createZohoBooksOperationEndpoint('delete_invoices'),
		updateInvoice: createZohoBooksOperationEndpoint('update_invoice'),
		getInvoice: createZohoBooksOperationEndpoint('get_invoice'),
		deleteInvoice: createZohoBooksOperationEndpoint('delete_invoice'),
		markInvoiceSent: createZohoBooksOperationEndpoint('mark_invoice_sent'),
		markInvoiceVoid: createZohoBooksOperationEndpoint('mark_invoice_void'),
		markInvoiceDraft: createZohoBooksOperationEndpoint('mark_invoice_draft'),
		emailInvoices: createZohoBooksOperationEndpoint('email_invoices'),
		createInvoiceFromSalesorder: createZohoBooksOperationEndpoint(
			'create_invoice_from_salesorder',
		),
		mapInvoiceWithSalesorder: createZohoBooksOperationEndpoint(
			'map_invoice_with_salesorder',
		),
		submitInvoice: createZohoBooksOperationEndpoint('submit_invoice'),
		approveInvoice: createZohoBooksOperationEndpoint('approve_invoice'),
		getInvoiceEmail: createZohoBooksOperationEndpoint('get_invoice_email'),
		emailInvoice: createZohoBooksOperationEndpoint('email_invoice'),
		remindCustomerForInvoicePayment: createZohoBooksOperationEndpoint(
			'remind_customer_for_invoice_payment',
		),
		getPaymentReminderMailContentForInvoice: createZohoBooksOperationEndpoint(
			'get_payment_reminder_mail_content_for_invoice',
		),
		bulkInvoiceReminder: createZohoBooksOperationEndpoint(
			'bulk_invoice_reminder',
		),
		bulkExportInvoicesAsPdf: createZohoBooksOperationEndpoint(
			'bulk_export_invoices_as_pdf',
		),
		bulkPrintInvoices: createZohoBooksOperationEndpoint('bulk_print_invoices'),
		disableInvoicePaymentReminder: createZohoBooksOperationEndpoint(
			'disable_invoice_payment_reminder',
		),
		enableInvoicePaymentReminder: createZohoBooksOperationEndpoint(
			'enable_invoice_payment_reminder',
		),
		writeOffInvoice: createZohoBooksOperationEndpoint('write_off_invoice'),
		cancelWriteOffInvoice: createZohoBooksOperationEndpoint(
			'cancel_write_off_invoice',
		),
		updateInvoiceBillingAddress: createZohoBooksOperationEndpoint(
			'update_invoice_billing_address',
		),
		updateInvoiceShippingAddress: createZohoBooksOperationEndpoint(
			'update_invoice_shipping_address',
		),
		listInvoiceTemplates: createZohoBooksOperationEndpoint(
			'list_invoice_templates',
		),
		updateInvoiceTemplate: createZohoBooksOperationEndpoint(
			'update_invoice_template',
		),
		listInvoicePayments: createZohoBooksOperationEndpoint(
			'list_invoice_payments',
		),
		listInvoiceCreditsApplied: createZohoBooksOperationEndpoint(
			'list_invoice_credits_applied',
		),
		applyCreditsToInvoice: createZohoBooksOperationEndpoint(
			'apply_credits_to_invoice',
		),
		deleteInvoicePayment: createZohoBooksOperationEndpoint(
			'delete_invoice_payment',
		),
		deleteInvoiceAppliedCredit: createZohoBooksOperationEndpoint(
			'delete_invoice_applied_credit',
		),
		getInvoiceAttachment: createZohoBooksOperationEndpoint(
			'get_invoice_attachment',
		),
		addInvoiceAttachment: createZohoBooksOperationEndpoint(
			'add_invoice_attachment',
		),
		updateInvoiceAttachmentPreference: createZohoBooksOperationEndpoint(
			'update_invoice_attachment_preference',
		),
		deleteInvoiceAttachment: createZohoBooksOperationEndpoint(
			'delete_invoice_attachment',
		),
		getInvoiceDocumentDetails: createZohoBooksOperationEndpoint(
			'get_invoice_document_details',
		),
		deleteInvoiceDocument: createZohoBooksOperationEndpoint(
			'delete_invoice_document',
		),
		addInvoiceDocument: createZohoBooksOperationEndpoint(
			'add_invoice_document',
		),
		deleteInvoiceExpenseReceipt: createZohoBooksOperationEndpoint(
			'delete_invoice_expense_receipt',
		),
		updateCustomFieldsInInvoice: createZohoBooksOperationEndpoint(
			'update_custom_fields_in_invoice',
		),
		listInvoiceComments: createZohoBooksOperationEndpoint(
			'list_invoice_comments',
		),
		addInvoiceComment: createZohoBooksOperationEndpoint('add_invoice_comment'),
		updateInvoiceComment: createZohoBooksOperationEndpoint(
			'update_invoice_comment',
		),
		deleteInvoiceComment: createZohoBooksOperationEndpoint(
			'delete_invoice_comment',
		),
		generateInvoicePaymentLink: createZohoBooksOperationEndpoint(
			'generate_invoice_payment_link',
		),
		approveInvoices: createZohoBooksOperationEndpoint('approve_invoices'),
		voidInvoices: createZohoBooksOperationEndpoint('void_invoices'),
		createInvoicesFromProjects: createZohoBooksOperationEndpoint(
			'create_invoices_from_projects',
		),
		getInvoiceDeliveryNotes: createZohoBooksOperationEndpoint(
			'get_invoice_delivery_notes',
		),
		getInvoicePackingSlips: createZohoBooksOperationEndpoint(
			'get_invoice_packing_slips',
		),
		finalizeInvoiceApproval: createZohoBooksOperationEndpoint(
			'finalize_invoice_approval',
		),
		rejectInvoice: createZohoBooksOperationEndpoint('reject_invoice'),
		sendInvoiceViaSnailMail: createZohoBooksOperationEndpoint(
			'send_invoice_via_snail_mail',
		),
		addInvoiceOnlinePaymentBankAccount: createZohoBooksOperationEndpoint(
			'add_invoice_online_payment_bank_account',
		),
		applyPricebookToInvoice: createZohoBooksOperationEndpoint(
			'apply_pricebook_to_invoice',
		),
		submitInvoices: createZohoBooksOperationEndpoint('submit_invoices'),
		markInvoicesSent: createZohoBooksOperationEndpoint('mark_invoices_sent'),
		writeOffInvoices: createZohoBooksOperationEndpoint('write_off_invoices'),
		markInvoicesShipped: createZohoBooksOperationEndpoint(
			'mark_invoices_shipped',
		),
		unshipInvoices: createZohoBooksOperationEndpoint('unship_invoices'),
		createInvoicesFromEstimates: createZohoBooksOperationEndpoint(
			'create_invoices_from_estimates',
		),
		previewInvoiceCoupons: createZohoBooksOperationEndpoint(
			'preview_invoice_coupons',
		),
		unmapInvoicesFromSalesorders: createZohoBooksOperationEndpoint(
			'unmap_invoices_from_salesorders',
		),
		getInvoiceDashboard: createZohoBooksOperationEndpoint(
			'get_invoice_dashboard',
		),
		getInvoiceByReference: createZohoBooksOperationEndpoint(
			'get_invoice_by_reference',
		),
		getInvoiceCustomFields: createZohoBooksOperationEndpoint(
			'get_invoice_custom_fields',
		),
		getInvoiceAdvancedTrackingDetails: createZohoBooksOperationEndpoint(
			'get_invoice_advanced_tracking_details',
		),
		updateInvoiceAdvancedTrackingDetails: createZohoBooksOperationEndpoint(
			'update_invoice_advanced_tracking_details',
		),
		printInvoiceDeliveryNote: createZohoBooksOperationEndpoint(
			'print_invoice_delivery_note',
		),
		printInvoicePackingSlip: createZohoBooksOperationEndpoint(
			'print_invoice_packing_slip',
		),
		getInvoiceQrCode: createZohoBooksOperationEndpoint('get_invoice_qr_code'),
		getInvoiceSms: createZohoBooksOperationEndpoint('get_invoice_sms'),
		sendInvoiceSms: createZohoBooksOperationEndpoint('send_invoice_sms'),
		getInvoiceSignatureTemplate: createZohoBooksOperationEndpoint(
			'get_invoice_signature_template',
		),
		addInvoiceDigitalSignature: createZohoBooksOperationEndpoint(
			'add_invoice_digital_signature',
		),
		uploadInvoiceDigitalSignature: createZohoBooksOperationEndpoint(
			'upload_invoice_digital_signature',
		),
		uploadInvoiceDocument: createZohoBooksOperationEndpoint(
			'upload_invoice_document',
		),
		updateInvoiceCfdiStatus: createZohoBooksOperationEndpoint(
			'update_invoice_cfdi_status',
		),
		cancelInvoice: createZohoBooksOperationEndpoint('cancel_invoice'),
		markInvoiceReadyToPush: createZohoBooksOperationEndpoint(
			'mark_invoice_ready_to_push',
		),
		applyInvoiceSubstatus: createZohoBooksOperationEndpoint(
			'apply_invoice_substatus',
		),
		deleteInvoiceSubstatus: createZohoBooksOperationEndpoint(
			'delete_invoice_substatus',
		),
		deleteInvoiceLineItem: createZohoBooksOperationEndpoint(
			'delete_invoice_line_item',
		),
		scheduleInvoiceEmail: createZohoBooksOperationEndpoint(
			'schedule_invoice_email',
		),
		cancelScheduledInvoiceEmail: createZohoBooksOperationEndpoint(
			'cancel_scheduled_invoice_email',
		),
		forcePayInvoice: createZohoBooksOperationEndpoint('force_pay_invoice'),
		mailInvoicePdf: createZohoBooksOperationEndpoint('mail_invoice_pdf'),
		createInvoiceSynchronousOnlinePayment: createZohoBooksOperationEndpoint(
			'create_invoice_synchronous_online_payment',
		),
		createInvoiceAsynchronousOnlinePayment: createZohoBooksOperationEndpoint(
			'create_invoice_asynchronous_online_payment',
		),
		getInvoicePaymentQr: createZohoBooksOperationEndpoint(
			'get_invoice_payment_qr',
		),
		getInvoicePaymentQrStatus: createZohoBooksOperationEndpoint(
			'get_invoice_payment_qr_status',
		),
		sendInvoiceDunningNotifications: createZohoBooksOperationEndpoint(
			'send_invoice_dunning_notifications',
		),
		sendInvoiceRetrySms: createZohoBooksOperationEndpoint(
			'send_invoice_retry_sms',
		),
		getInvoiceMetadata: createZohoBooksOperationEndpoint(
			'get_invoice_metadata',
		),
		updateInvoiceMetadata: createZohoBooksOperationEndpoint(
			'update_invoice_metadata',
		),
		listInvoicesEinvoice: createZohoBooksOperationEndpoint(
			'list_invoices_einvoice',
		),
		pushInvoicesEinvoice: createZohoBooksOperationEndpoint(
			'push_invoices_einvoice',
		),
		cancelInvoicesEinvoice: createZohoBooksOperationEndpoint(
			'cancel_invoices_einvoice',
		),
		getInvoiceEinvoice: createZohoBooksOperationEndpoint(
			'get_invoice_einvoice',
		),
		pushInvoiceEinvoice: createZohoBooksOperationEndpoint(
			'push_invoice_einvoice',
		),
		cancelInvoiceEinvoice: createZohoBooksOperationEndpoint(
			'cancel_invoice_einvoice',
		),
		fetchInvoiceEinvoice: createZohoBooksOperationEndpoint(
			'fetch_invoice_einvoice',
		),
		deleteInvoiceEinvoiceStatus: createZohoBooksOperationEndpoint(
			'delete_invoice_einvoice_status',
		),
		markInvoiceEinvoicePushed: createZohoBooksOperationEndpoint(
			'mark_invoice_einvoice_pushed',
		),
		markInvoiceEinvoiceCancelled: createZohoBooksOperationEndpoint(
			'mark_invoice_einvoice_cancelled',
		),
		recallInvoiceEinvoiceStatus: createZohoBooksOperationEndpoint(
			'recall_invoice_einvoice_status',
		),
		updateInvoiceEinvoicePaymentStatus: createZohoBooksOperationEndpoint(
			'update_invoice_einvoice_payment_status',
		),
		cancelEinvoiceInvoice: createZohoBooksOperationEndpoint(
			'cancel_einvoice_invoice',
		),
	},
	items: {
		createItem: createZohoBooksOperationEndpoint('create_item'),
		listItems: createZohoBooksOperationEndpoint('list_items'),
		updateItemUsingCustomField: createZohoBooksOperationEndpoint(
			'update_item_using_custom_field',
		),
		listItemDetails: createZohoBooksOperationEndpoint('list_item_details'),
		updateItem: createZohoBooksOperationEndpoint('update_item'),
		getItem: createZohoBooksOperationEndpoint('get_item'),
		deleteItem: createZohoBooksOperationEndpoint('delete_item'),
		updateCustomFieldsInItem: createZohoBooksOperationEndpoint(
			'update_custom_fields_in_item',
		),
		markItemActive: createZohoBooksOperationEndpoint('mark_item_active'),
		markItemInactive: createZohoBooksOperationEndpoint('mark_item_inactive'),
		createItemMaster: createZohoBooksOperationEndpoint('create_item_master'),
		listItemMasters: createZohoBooksOperationEndpoint('list_item_masters'),
		getItemMaster: createZohoBooksOperationEndpoint('get_item_master'),
		updateItemMaster: createZohoBooksOperationEndpoint('update_item_master'),
		deleteItemMaster: createZohoBooksOperationEndpoint('delete_item_master'),
		bulkMarkItemMastersActive: createZohoBooksOperationEndpoint(
			'bulk_mark_item_masters_active',
		),
		bulkMarkItemMastersInactive: createZohoBooksOperationEndpoint(
			'bulk_mark_item_masters_inactive',
		),
		markItemMasterAsActive: createZohoBooksOperationEndpoint(
			'mark_item_master_as_active',
		),
		markItemMasterAsInactive: createZohoBooksOperationEndpoint(
			'mark_item_master_as_inactive',
		),
		createItemVariant: createZohoBooksOperationEndpoint('create_item_variant'),
		listItemVariants: createZohoBooksOperationEndpoint('list_item_variants'),
		bulkDeleteItemVariants: createZohoBooksOperationEndpoint(
			'bulk_delete_item_variants',
		),
		getItemVariant: createZohoBooksOperationEndpoint('get_item_variant'),
		updateItemVariant: createZohoBooksOperationEndpoint('update_item_variant'),
		deleteItemVariant: createZohoBooksOperationEndpoint('delete_item_variant'),
		bulkMarkItemVariantsActive: createZohoBooksOperationEndpoint(
			'bulk_mark_item_variants_active',
		),
		bulkMarkItemVariantsInactive: createZohoBooksOperationEndpoint(
			'bulk_mark_item_variants_inactive',
		),
		markItemVariantAsActive: createZohoBooksOperationEndpoint(
			'mark_item_variant_as_active',
		),
		markItemVariantAsInactive: createZohoBooksOperationEndpoint(
			'mark_item_variant_as_inactive',
		),
		moveItemVariant: createZohoBooksOperationEndpoint('move_item_variant'),
		ungroupItemVariants: createZohoBooksOperationEndpoint(
			'ungroup_item_variants',
		),
	},
	journals: {
		createJournal: createZohoBooksOperationEndpoint('create_journal'),
		listJournals: createZohoBooksOperationEndpoint('list_journals'),
		updateJournal: createZohoBooksOperationEndpoint('update_journal'),
		getJournal: createZohoBooksOperationEndpoint('get_journal'),
		deleteJournal: createZohoBooksOperationEndpoint('delete_journal'),
		markJournalPublished: createZohoBooksOperationEndpoint(
			'mark_journal_published',
		),
		addJournalAttachment: createZohoBooksOperationEndpoint(
			'add_journal_attachment',
		),
		addJournalComment: createZohoBooksOperationEndpoint('add_journal_comment'),
		deleteJournalComment: createZohoBooksOperationEndpoint(
			'delete_journal_comment',
		),
		reverseJournal: createZohoBooksOperationEndpoint('reverse_journal'),
		submitJournalForApproval: createZohoBooksOperationEndpoint(
			'submit_journal_for_approval',
		),
		approveJournal: createZohoBooksOperationEndpoint('approve_journal'),
		rejectJournal: createZohoBooksOperationEndpoint('reject_journal'),
		listJournalCredits: createZohoBooksOperationEndpoint(
			'list_journal_credits',
		),
		applyJournalCreditsToInvoices: createZohoBooksOperationEndpoint(
			'apply_journal_credits_to_invoices',
		),
		applyJournalCreditsToBills: createZohoBooksOperationEndpoint(
			'apply_journal_credits_to_bills',
		),
		deleteJournalCreditsReceivables: createZohoBooksOperationEndpoint(
			'delete_journal_credits_receivables',
		),
		deleteJournalCreditsPayables: createZohoBooksOperationEndpoint(
			'delete_journal_credits_payables',
		),
		bulkSubmitJournals: createZohoBooksOperationEndpoint(
			'bulk_submit_journals',
		),
		bulkApproveJournals: createZohoBooksOperationEndpoint(
			'bulk_approve_journals',
		),
		bulkPublishJournals: createZohoBooksOperationEndpoint(
			'bulk_publish_journals',
		),
		bulkDeleteJournals: createZohoBooksOperationEndpoint(
			'bulk_delete_journals',
		),
		createRecurringJournal: createZohoBooksOperationEndpoint(
			'create_recurring_journal',
		),
		listRecurringJournals: createZohoBooksOperationEndpoint(
			'list_recurring_journals',
		),
		getRecurringJournal: createZohoBooksOperationEndpoint(
			'get_recurring_journal',
		),
		updateRecurringJournal: createZohoBooksOperationEndpoint(
			'update_recurring_journal',
		),
		deleteRecurringJournal: createZohoBooksOperationEndpoint(
			'delete_recurring_journal',
		),
		resumeRecurringJournal: createZohoBooksOperationEndpoint(
			'resume_recurring_journal',
		),
		stopRecurringJournal: createZohoBooksOperationEndpoint(
			'stop_recurring_journal',
		),
		listChildJournals: createZohoBooksOperationEndpoint('list_child_journals'),
		getTransactionJournalView: createZohoBooksOperationEndpoint(
			'get_transaction_journal_view',
		),
	},
	locations: {
		enableLocations: createZohoBooksOperationEndpoint('enable_locations'),
		createLocation: createZohoBooksOperationEndpoint('create_location'),
		listLocations: createZohoBooksOperationEndpoint('list_locations'),
		updateLocation: createZohoBooksOperationEndpoint('update_location'),
		deleteLocation: createZohoBooksOperationEndpoint('delete_location'),
		markLocationActive: createZohoBooksOperationEndpoint(
			'mark_location_active',
		),
		markLocationInactive: createZohoBooksOperationEndpoint(
			'mark_location_inactive',
		),
		markLocationPrimary: createZohoBooksOperationEndpoint(
			'mark_location_primary',
		),
	},
	openingBalance: {
		createOpeningBalance: createZohoBooksOperationEndpoint(
			'create_opening_balance',
		),
		updateOpeningBalance: createZohoBooksOperationEndpoint(
			'update_opening_balance',
		),
		getOpeningBalance: createZohoBooksOperationEndpoint('get_opening_balance'),
		deleteOpeningBalance: createZohoBooksOperationEndpoint(
			'delete_opening_balance',
		),
		listOpeningBalanceDetails: createZohoBooksOperationEndpoint(
			'list_opening_balance_details',
		),
		listOpeningBalanceTransactions: createZohoBooksOperationEndpoint(
			'list_opening_balance_transactions',
		),
		writeoffOpeningBalance: createZohoBooksOperationEndpoint(
			'writeoff_opening_balance',
		),
		cancelWriteoffOpeningBalance: createZohoBooksOperationEndpoint(
			'cancel_writeoff_opening_balance',
		),
	},
	organizations: {
		createOrganization: createZohoBooksOperationEndpoint('create_organization'),
		listOrganizations: createZohoBooksOperationEndpoint('list_organizations'),
		updateOrganization: createZohoBooksOperationEndpoint('update_organization'),
		getOrganization: createZohoBooksOperationEndpoint('get_organization'),
		listOrganizationsForUser: createZohoBooksOperationEndpoint(
			'list_organizations_for_user',
		),
		getOrganizationAddress: createZohoBooksOperationEndpoint(
			'get_organization_address',
		),
		createOrganizationAddress: createZohoBooksOperationEndpoint(
			'create_organization_address',
		),
		updateOrganizationAddress: createZohoBooksOperationEndpoint(
			'update_organization_address',
		),
		deleteOrganizationAddress: createZohoBooksOperationEndpoint(
			'delete_organization_address',
		),
		copyOrganizationSettings: createZohoBooksOperationEndpoint(
			'copy_organization_settings',
		),
		downgradeOrganizationToInvoice: createZohoBooksOperationEndpoint(
			'downgrade_organization_to_invoice',
		),
		upgradeOrganizationToBooks: createZohoBooksOperationEndpoint(
			'upgrade_organization_to_books',
		),
		markOrganizationInactive: createZohoBooksOperationEndpoint(
			'mark_organization_inactive',
		),
	},
	pricelists: {
		createPricebook: createZohoBooksOperationEndpoint('create_pricebook'),
		listPricebooks: createZohoBooksOperationEndpoint('list_pricebooks'),
		updatePricebook: createZohoBooksOperationEndpoint('update_pricebook'),
		deletePricebook: createZohoBooksOperationEndpoint('delete_pricebook'),
		markPricebookActive: createZohoBooksOperationEndpoint(
			'mark_pricebook_active',
		),
		markPricebookInactive: createZohoBooksOperationEndpoint(
			'mark_pricebook_inactive',
		),
	},
	projects: {
		createProject: createZohoBooksOperationEndpoint('create_project'),
		listProjects: createZohoBooksOperationEndpoint('list_projects'),
		updateProjectsUsingCustomField: createZohoBooksOperationEndpoint(
			'update_projects_using_custom_field',
		),
		updateProject: createZohoBooksOperationEndpoint('update_project'),
		getProject: createZohoBooksOperationEndpoint('get_project'),
		deleteProject: createZohoBooksOperationEndpoint('delete_project'),
		markProjectActive: createZohoBooksOperationEndpoint('mark_project_active'),
		markProjectInactive: createZohoBooksOperationEndpoint(
			'mark_project_inactive',
		),
		cloneProject: createZohoBooksOperationEndpoint('clone_project'),
		addProjectUser: createZohoBooksOperationEndpoint('add_project_user'),
		listProjectUsers: createZohoBooksOperationEndpoint('list_project_users'),
		inviteProjectUser: createZohoBooksOperationEndpoint('invite_project_user'),
		updateProjectUser: createZohoBooksOperationEndpoint('update_project_user'),
		getProjectUser: createZohoBooksOperationEndpoint('get_project_user'),
		deleteProjectUser: createZohoBooksOperationEndpoint('delete_project_user'),
		addProjectComment: createZohoBooksOperationEndpoint('add_project_comment'),
		listProjectComments: createZohoBooksOperationEndpoint(
			'list_project_comments',
		),
		deleteProjectComment: createZohoBooksOperationEndpoint(
			'delete_project_comment',
		),
		listProjectInvoices: createZohoBooksOperationEndpoint(
			'list_project_invoices',
		),
		addProjectTask: createZohoBooksOperationEndpoint('add_project_task'),
		listProjectTasks: createZohoBooksOperationEndpoint('list_project_tasks'),
		updateProjectTask: createZohoBooksOperationEndpoint('update_project_task'),
		getProjectTask: createZohoBooksOperationEndpoint('get_project_task'),
		deleteProjectTask: createZohoBooksOperationEndpoint('delete_project_task'),
	},
	purchaseOrder: {
		createPurchaseOrder: createZohoBooksOperationEndpoint(
			'create_purchase_order',
		),
		listPurchaseOrders: createZohoBooksOperationEndpoint(
			'list_purchase_orders',
		),
		updatePurchaseOrderUsingCustomField: createZohoBooksOperationEndpoint(
			'update_purchase_order_using_custom_field',
		),
		updatePurchaseOrder: createZohoBooksOperationEndpoint(
			'update_purchase_order',
		),
		getPurchaseOrder: createZohoBooksOperationEndpoint('get_purchase_order'),
		deletePurchaseOrder: createZohoBooksOperationEndpoint(
			'delete_purchase_order',
		),
		updateCustomFieldsInPurchaseOrder: createZohoBooksOperationEndpoint(
			'update_custom_fields_in_purchase_order',
		),
		markPurchaseOrderOpen: createZohoBooksOperationEndpoint(
			'mark_purchase_order_open',
		),
		markPurchaseOrderBilled: createZohoBooksOperationEndpoint(
			'mark_purchase_order_billed',
		),
		markPurchaseOrderCancelled: createZohoBooksOperationEndpoint(
			'mark_purchase_order_cancelled',
		),
		submitPurchaseOrder: createZohoBooksOperationEndpoint(
			'submit_purchase_order',
		),
		approvePurchaseOrder: createZohoBooksOperationEndpoint(
			'approve_purchase_order',
		),
		emailPurchaseOrder: createZohoBooksOperationEndpoint(
			'email_purchase_order',
		),
		getPurchaseOrderEmail: createZohoBooksOperationEndpoint(
			'get_purchase_order_email',
		),
		updatePurchaseOrderBillingAddress: createZohoBooksOperationEndpoint(
			'update_purchase_order_billing_address',
		),
		listPurchaseOrderTemplates: createZohoBooksOperationEndpoint(
			'list_purchase_order_templates',
		),
		updatePurchaseOrderTemplate: createZohoBooksOperationEndpoint(
			'update_purchase_order_template',
		),
		getPurchaseOrderAttachment: createZohoBooksOperationEndpoint(
			'get_purchase_order_attachment',
		),
		addPurchaseOrderAttachment: createZohoBooksOperationEndpoint(
			'add_purchase_order_attachment',
		),
		updatePurchaseOrderAttachment: createZohoBooksOperationEndpoint(
			'update_purchase_order_attachment',
		),
		deletePurchaseOrderAttachment: createZohoBooksOperationEndpoint(
			'delete_purchase_order_attachment',
		),
		listPurchaseOrderComments: createZohoBooksOperationEndpoint(
			'list_purchase_order_comments',
		),
		addPurchaseOrderComment: createZohoBooksOperationEndpoint(
			'add_purchase_order_comment',
		),
		updatePurchaseOrderComment: createZohoBooksOperationEndpoint(
			'update_purchase_order_comment',
		),
		deletePurchaseOrderComment: createZohoBooksOperationEndpoint(
			'delete_purchase_order_comment',
		),
		rejectPurchaseOrders: createZohoBooksOperationEndpoint(
			'reject_purchase_orders',
		),
	},
	purchaseReturns: {
		createPurchaseReturn: createZohoBooksOperationEndpoint(
			'create_purchase_return',
		),
		listPurchaseReturns: createZohoBooksOperationEndpoint(
			'list_purchase_returns',
		),
		getPurchaseReturn: createZohoBooksOperationEndpoint('get_purchase_return'),
		updatePurchaseReturn: createZohoBooksOperationEndpoint(
			'update_purchase_return',
		),
		deletePurchaseReturn: createZohoBooksOperationEndpoint(
			'delete_purchase_return',
		),
		confirmPurchaseReturn: createZohoBooksOperationEndpoint(
			'confirm_purchase_return',
		),
		voidPurchaseReturn: createZohoBooksOperationEndpoint(
			'void_purchase_return',
		),
		fulfillPurchaseReturn: createZohoBooksOperationEndpoint(
			'fulfill_purchase_return',
		),
		unfulfillPurchaseReturn: createZohoBooksOperationEndpoint(
			'unfulfill_purchase_return',
		),
		emailPurchaseReturn: createZohoBooksOperationEndpoint(
			'email_purchase_return',
		),
		addAttachmentToPurchaseReturn: createZohoBooksOperationEndpoint(
			'add_attachment_to_purchase_return',
		),
		closePurchaseReturn: createZohoBooksOperationEndpoint(
			'close_purchase_return',
		),
		reopenPurchaseReturn: createZohoBooksOperationEndpoint(
			'reopen_purchase_return',
		),
		updatePurchaseReturnShippingAddress: createZohoBooksOperationEndpoint(
			'update_purchase_return_shipping_address',
		),
		updatePurchaseReturnBillingAddress: createZohoBooksOperationEndpoint(
			'update_purchase_return_billing_address',
		),
		deletePurchaseReturnAttachment: createZohoBooksOperationEndpoint(
			'delete_purchase_return_attachment',
		),
	},
	recurringBills: {
		createRecurringBill: createZohoBooksOperationEndpoint(
			'create_recurring_bill',
		),
		listRecurringBills: createZohoBooksOperationEndpoint(
			'list_recurring_bills',
		),
		updateRecurringBillUsingCustomField: createZohoBooksOperationEndpoint(
			'update_recurring_bill_using_custom_field',
		),
		updateRecurringBill: createZohoBooksOperationEndpoint(
			'update_recurring_bill',
		),
		getRecurringBill: createZohoBooksOperationEndpoint('get_recurring_bill'),
		deleteRecurringBill: createZohoBooksOperationEndpoint(
			'delete_recurring_bill',
		),
		stopRecurringBill: createZohoBooksOperationEndpoint('stop_recurring_bill'),
		resumeRecurringBill: createZohoBooksOperationEndpoint(
			'resume_recurring_bill',
		),
		listRecurringBillHistory: createZohoBooksOperationEndpoint(
			'list_recurring_bill_history',
		),
	},
	recurringExpenses: {
		createRecurringExpense: createZohoBooksOperationEndpoint(
			'create_recurring_expense',
		),
		listRecurringExpenses: createZohoBooksOperationEndpoint(
			'list_recurring_expenses',
		),
		updateRecurringExpenseUsingCustomField: createZohoBooksOperationEndpoint(
			'update_recurring_expense_using_custom_field',
		),
		updateRecurringExpense: createZohoBooksOperationEndpoint(
			'update_recurring_expense',
		),
		getRecurringExpense: createZohoBooksOperationEndpoint(
			'get_recurring_expense',
		),
		deleteRecurringExpense: createZohoBooksOperationEndpoint(
			'delete_recurring_expense',
		),
		stopRecurringExpense: createZohoBooksOperationEndpoint(
			'stop_recurring_expense',
		),
		resumeRecurringExpense: createZohoBooksOperationEndpoint(
			'resume_recurring_expense',
		),
		listChildExpensesOfRecurringExpense: createZohoBooksOperationEndpoint(
			'list_child_expenses_of_recurring_expense',
		),
		listRecurringExpenseHistory: createZohoBooksOperationEndpoint(
			'list_recurring_expense_history',
		),
	},
	recurringInvoices: {
		createRecurringInvoice: createZohoBooksOperationEndpoint(
			'create_recurring_invoice',
		),
		listRecurringInvoices: createZohoBooksOperationEndpoint(
			'list_recurring_invoices',
		),
		updateRecurringInvoiceUsingCustomField: createZohoBooksOperationEndpoint(
			'update_recurring_invoice_using_custom_field',
		),
		updateRecurringInvoice: createZohoBooksOperationEndpoint(
			'update_recurring_invoice',
		),
		getRecurringInvoice: createZohoBooksOperationEndpoint(
			'get_recurring_invoice',
		),
		deleteRecurringInvoice: createZohoBooksOperationEndpoint(
			'delete_recurring_invoice',
		),
		stopRecurringInvoice: createZohoBooksOperationEndpoint(
			'stop_recurring_invoice',
		),
		resumeRecurringInvoice: createZohoBooksOperationEndpoint(
			'resume_recurring_invoice',
		),
		updateRecurringInvoiceTemplate: createZohoBooksOperationEndpoint(
			'update_recurring_invoice_template',
		),
		listRecurringInvoiceHistory: createZohoBooksOperationEndpoint(
			'list_recurring_invoice_history',
		),
		resumeRecurringInvoices: createZohoBooksOperationEndpoint(
			'resume_recurring_invoices',
		),
		stopRecurringInvoices: createZohoBooksOperationEndpoint(
			'stop_recurring_invoices',
		),
		getRecurringInvoiceDashboard: createZohoBooksOperationEndpoint(
			'get_recurring_invoice_dashboard',
		),
		listRecurringInvoiceChildInvoices: createZohoBooksOperationEndpoint(
			'list_recurring_invoice_child_invoices',
		),
		enableRecurringInvoiceAutobill: createZohoBooksOperationEndpoint(
			'enable_recurring_invoice_autobill',
		),
		disableRecurringInvoiceAutobill: createZohoBooksOperationEndpoint(
			'disable_recurring_invoice_autobill',
		),
		deleteRecurringInvoiceBankAccount: createZohoBooksOperationEndpoint(
			'delete_recurring_invoice_bank_account',
		),
		deleteRecurringInvoiceCard: createZohoBooksOperationEndpoint(
			'delete_recurring_invoice_card',
		),
		associateRecurringInvoiceBankAccount: createZohoBooksOperationEndpoint(
			'associate_recurring_invoice_bank_account',
		),
		associateRecurringInvoiceCard: createZohoBooksOperationEndpoint(
			'associate_recurring_invoice_card',
		),
	},
	registers: {
		listRegisterTransactions: createZohoBooksOperationEndpoint(
			'list_register_transactions',
		),
		listRegisterBulkActionHistory: createZohoBooksOperationEndpoint(
			'list_register_bulk_action_history',
		),
		getRegisterBulkActionHistory: createZohoBooksOperationEndpoint(
			'get_register_bulk_action_history',
		),
		getRegisterBulkUpdateEditpage: createZohoBooksOperationEndpoint(
			'get_register_bulk_update_editpage',
		),
		getRegisterBudgetVsActuals: createZohoBooksOperationEndpoint(
			'get_register_budget_vs_actuals',
		),
		bulkUpdateRegisterTransactions: createZohoBooksOperationEndpoint(
			'bulk_update_register_transactions',
		),
		bulkDeleteRegisterTransactions: createZohoBooksOperationEndpoint(
			'bulk_delete_register_transactions',
		),
	},
	reportingTags: {
		getTags: createZohoBooksOperationEndpoint('get_tags'),
		createTag: createZohoBooksOperationEndpoint('create_tag'),
		markDefaultOption: createZohoBooksOperationEndpoint('mark_default_option'),
		updateTag: createZohoBooksOperationEndpoint('update_tag'),
		deleteTag: createZohoBooksOperationEndpoint('delete_tag'),
		updateTagOptions: createZohoBooksOperationEndpoint('update_tag_options'),
		updateTagCriteria: createZohoBooksOperationEndpoint('update_tag_criteria'),
		activeTag: createZohoBooksOperationEndpoint('active_tag'),
		inactiveTag: createZohoBooksOperationEndpoint('inactive_tag'),
		activeTagOption: createZohoBooksOperationEndpoint('active_tag_option'),
		inactiveTagOption: createZohoBooksOperationEndpoint('inactive_tag_option'),
		getAllTagOptions: createZohoBooksOperationEndpoint('get_all_tag_options'),
		reorderTags: createZohoBooksOperationEndpoint('reorder_tags'),
	},
	retainerInvoices: {
		createRetainerInvoice: createZohoBooksOperationEndpoint(
			'create_retainer_invoice',
		),
		listRetainerInvoices: createZohoBooksOperationEndpoint(
			'list_retainer_invoices',
		),
		updateRetainerInvoice: createZohoBooksOperationEndpoint(
			'update_retainer_invoice',
		),
		getRetainerInvoice: createZohoBooksOperationEndpoint(
			'get_retainer_invoice',
		),
		deleteRetainerInvoice: createZohoBooksOperationEndpoint(
			'delete_retainer_invoice',
		),
		markRetainerInvoiceSent: createZohoBooksOperationEndpoint(
			'mark_retainer_invoice_sent',
		),
		updateRetainerInvoiceTemplate: createZohoBooksOperationEndpoint(
			'update_retainer_invoice_template',
		),
		markRetainerInvoiceVoid: createZohoBooksOperationEndpoint(
			'mark_retainer_invoice_void',
		),
		markRetainerInvoiceDraft: createZohoBooksOperationEndpoint(
			'mark_retainer_invoice_draft',
		),
		submitRetainerInvoice: createZohoBooksOperationEndpoint(
			'submit_retainer_invoice',
		),
		approveRetainerInvoice: createZohoBooksOperationEndpoint(
			'approve_retainer_invoice',
		),
		emailRetainerInvoice: createZohoBooksOperationEndpoint(
			'email_retainer_invoice',
		),
		getRetainerInvoiceEmail: createZohoBooksOperationEndpoint(
			'get_retainer_invoice_email',
		),
		updateRetainerInvoiceBillingAddress: createZohoBooksOperationEndpoint(
			'update_retainer_invoice_billing_address',
		),
		listRetainerInvoiceTemplates: createZohoBooksOperationEndpoint(
			'list_retainer_invoice_templates',
		),
		getRetainerInvoiceAttachment: createZohoBooksOperationEndpoint(
			'get_retainer_invoice_attachment',
		),
		addRetainerInvoiceAttachment: createZohoBooksOperationEndpoint(
			'add_retainer_invoice_attachment',
		),
		deleteRetainerInvoiceAttachment: createZohoBooksOperationEndpoint(
			'delete_retainer_invoice_attachment',
		),
		listRetainerInvoice: createZohoBooksOperationEndpoint(
			'list_retainer_invoice',
		),
		addRetainerInvoiceComment: createZohoBooksOperationEndpoint(
			'add_retainer_invoice_comment',
		),
		deleteRetainerInvoiceComment: createZohoBooksOperationEndpoint(
			'delete_retainer_invoice_comment',
		),
		updateRetainerInvoiceComment: createZohoBooksOperationEndpoint(
			'update_retainer_invoice_comment',
		),
		applyRetainerPaymentsToInvoices: createZohoBooksOperationEndpoint(
			'apply_retainer_payments_to_invoices',
		),
		deleteAppliedRetainerPayment: createZohoBooksOperationEndpoint(
			'delete_applied_retainer_payment',
		),
		createRetainerInvoiceAsyncOnlinePayment: createZohoBooksOperationEndpoint(
			'create_retainer_invoice_async_online_payment',
		),
	},
	salesOrder: {
		createSalesOrder: createZohoBooksOperationEndpoint('create_sales_order'),
		listSalesOrders: createZohoBooksOperationEndpoint('list_sales_orders'),
		updateSalesOrderUsingCustomField: createZohoBooksOperationEndpoint(
			'update_sales_order_using_custom_field',
		),
		updateSalesOrder: createZohoBooksOperationEndpoint('update_sales_order'),
		getSalesOrder: createZohoBooksOperationEndpoint('get_sales_order'),
		deleteSalesOrder: createZohoBooksOperationEndpoint('delete_sales_order'),
		updateSalesorderCustomfields: createZohoBooksOperationEndpoint(
			'update_salesorder_customfields',
		),
		markSalesOrderAsOpen: createZohoBooksOperationEndpoint(
			'mark_sales_order_as_open',
		),
		markSalesOrderAsVoid: createZohoBooksOperationEndpoint(
			'mark_sales_order_as_void',
		),
		updateSalesOrderSubStatus: createZohoBooksOperationEndpoint(
			'update_sales_order_sub_status',
		),
		emailSalesOrder: createZohoBooksOperationEndpoint('email_sales_order'),
		getSalesOrderEmail: createZohoBooksOperationEndpoint(
			'get_sales_order_email',
		),
		submitSalesOrder: createZohoBooksOperationEndpoint('submit_sales_order'),
		approveSalesOrder: createZohoBooksOperationEndpoint('approve_sales_order'),
		bulkExportSalesOrdersAsPdf: createZohoBooksOperationEndpoint(
			'bulk_export_sales_orders_as_pdf',
		),
		bulkPrintSalesOrders: createZohoBooksOperationEndpoint(
			'bulk_print_sales_orders',
		),
		updateSalesOrderBillingAddress: createZohoBooksOperationEndpoint(
			'update_sales_order_billing_address',
		),
		updateSalesOrderShippingAddress: createZohoBooksOperationEndpoint(
			'update_sales_order_shipping_address',
		),
		listSalesOrderTemplates: createZohoBooksOperationEndpoint(
			'list_sales_order_templates',
		),
		updateSalesOrderTemplate: createZohoBooksOperationEndpoint(
			'update_sales_order_template',
		),
		getSalesOrderAttachment: createZohoBooksOperationEndpoint(
			'get_sales_order_attachment',
		),
		addSalesOrderAttachment: createZohoBooksOperationEndpoint(
			'add_sales_order_attachment',
		),
		updateSalesOrderAttachmentPreference: createZohoBooksOperationEndpoint(
			'update_sales_order_attachment_preference',
		),
		deleteSalesOrderAttachment: createZohoBooksOperationEndpoint(
			'delete_sales_order_attachment',
		),
		listSalesOrderComments: createZohoBooksOperationEndpoint(
			'list_sales_order_comments',
		),
		addSalesOrderComment: createZohoBooksOperationEndpoint(
			'add_sales_order_comment',
		),
		updateSalesOrderComment: createZohoBooksOperationEndpoint(
			'update_sales_order_comment',
		),
		deleteSalesOrderComment: createZohoBooksOperationEndpoint(
			'delete_sales_order_comment',
		),
	},
	salesReceipt: {
		createSalesReceipt: createZohoBooksOperationEndpoint(
			'create_sales_receipt',
		),
		listSalesReceipts: createZohoBooksOperationEndpoint('list_sales_receipts'),
		updateSalesReceipt: createZohoBooksOperationEndpoint(
			'update_sales_receipt',
		),
		getSalesReceipt: createZohoBooksOperationEndpoint('get_sales_receipt'),
		deleteSalesReceipt: createZohoBooksOperationEndpoint(
			'delete_sales_receipt',
		),
		emailSalesReceipt: createZohoBooksOperationEndpoint('email_sales_receipt'),
	},
	selfBilledInvoices: {
		createSelfBilledInvoice: createZohoBooksOperationEndpoint(
			'create_self_billed_invoice',
		),
		listSelfBilledInvoices: createZohoBooksOperationEndpoint(
			'list_self_billed_invoices',
		),
		updateSelfBilledInvoice: createZohoBooksOperationEndpoint(
			'update_self_billed_invoice',
		),
		getSelfBilledInvoice: createZohoBooksOperationEndpoint(
			'get_self_billed_invoice',
		),
		deleteSelfBilledInvoice: createZohoBooksOperationEndpoint(
			'delete_self_billed_invoice',
		),
		pushSelfBilledInvoiceEinvoice: createZohoBooksOperationEndpoint(
			'push_self_billed_invoice_einvoice',
		),
	},
	tasks: {
		addTask: createZohoBooksOperationEndpoint('add_task'),
		listTasks: createZohoBooksOperationEndpoint('list_tasks'),
		updateTasks: createZohoBooksOperationEndpoint('update_tasks'),
		deleteTasks: createZohoBooksOperationEndpoint('delete_tasks'),
		getTask: createZohoBooksOperationEndpoint('get_task'),
		updateATask: createZohoBooksOperationEndpoint('update_a_task'),
		deleteTask: createZohoBooksOperationEndpoint('delete_task'),
		updatePercentageTask: createZohoBooksOperationEndpoint(
			'update_percentage_task',
		),
		markTaskAsOpen: createZohoBooksOperationEndpoint('mark_task_as_open'),
		markTaskAsOngoing: createZohoBooksOperationEndpoint('mark_task_as_ongoing'),
		markTaskAsCompleted: createZohoBooksOperationEndpoint(
			'mark_task_as_completed',
		),
		addTaskComment: createZohoBooksOperationEndpoint('add_task_comment'),
		listTaskComments: createZohoBooksOperationEndpoint('list_task_comments'),
		deleteTaskComment: createZohoBooksOperationEndpoint('delete_task_comment'),
		addTaskAttachment: createZohoBooksOperationEndpoint('add_task_attachment'),
		getTaskDocument: createZohoBooksOperationEndpoint('get_task_document'),
		deleteTaskDocument: createZohoBooksOperationEndpoint(
			'delete_task_document',
		),
	},
	taxes: {
		createTax: createZohoBooksOperationEndpoint('create_tax'),
		listTaxes: createZohoBooksOperationEndpoint('list_taxes'),
		updateTax: createZohoBooksOperationEndpoint('update_tax'),
		getTax: createZohoBooksOperationEndpoint('get_tax'),
		deleteTax: createZohoBooksOperationEndpoint('delete_tax'),
		getTaxGroup: createZohoBooksOperationEndpoint('get_tax_group'),
		updateTaxGroup: createZohoBooksOperationEndpoint('update_tax_group'),
		deleteTaxGroup: createZohoBooksOperationEndpoint('delete_tax_group'),
		createTaxGroup: createZohoBooksOperationEndpoint('create_tax_group'),
		createTaxAuthority: createZohoBooksOperationEndpoint(
			'create_tax_authority',
		),
		listTaxAuthorities: createZohoBooksOperationEndpoint(
			'list_tax_authorities',
		),
		updateTaxAuthority: createZohoBooksOperationEndpoint(
			'update_tax_authority',
		),
		getTaxAuthority: createZohoBooksOperationEndpoint('get_tax_authority'),
		deleteTaxAuthority: createZohoBooksOperationEndpoint(
			'delete_tax_authority',
		),
		createTaxExemption: createZohoBooksOperationEndpoint(
			'create_tax_exemption',
		),
		listTaxExemptions: createZohoBooksOperationEndpoint('list_tax_exemptions'),
		updateTaxExemption: createZohoBooksOperationEndpoint(
			'update_tax_exemption',
		),
		getTaxExemption: createZohoBooksOperationEndpoint('get_tax_exemption'),
		deleteTaxExemption: createZohoBooksOperationEndpoint(
			'delete_tax_exemption',
		),
	},
	timeEntries: {
		createTimeEntries: createZohoBooksOperationEndpoint('create_time_entries'),
		listTimeEntries: createZohoBooksOperationEndpoint('list_time_entries'),
		deleteTimeEntries: createZohoBooksOperationEndpoint('delete_time_entries'),
		updateTimeEntry: createZohoBooksOperationEndpoint('update_time_entry'),
		getTimeEntry: createZohoBooksOperationEndpoint('get_time_entry'),
		deleteTimeEntry: createZohoBooksOperationEndpoint('delete_time_entry'),
		startEntryTimer: createZohoBooksOperationEndpoint('start_entry_timer'),
		stopEntryTimer: createZohoBooksOperationEndpoint('stop_entry_timer'),
		getRunningTimer: createZohoBooksOperationEndpoint('get_running_timer'),
	},
	transactionLocking: {
		getTransactionLock: createZohoBooksOperationEndpoint(
			'get_transaction_lock',
		),
		updateTransactionLock: createZohoBooksOperationEndpoint(
			'update_transaction_lock',
		),
		deleteTransactionLock: createZohoBooksOperationEndpoint(
			'delete_transaction_lock',
		),
		getAccountingPeriodTransactionLock: createZohoBooksOperationEndpoint(
			'get_accounting_period_transaction_lock',
		),
		listTransactionLocks: createZohoBooksOperationEndpoint(
			'list_transaction_locks',
		),
		updatePartialUnlock: createZohoBooksOperationEndpoint(
			'update_partial_unlock',
		),
	},
	users: {
		createUser: createZohoBooksOperationEndpoint('create_user'),
		listUsers: createZohoBooksOperationEndpoint('list_users'),
		updateUser: createZohoBooksOperationEndpoint('update_user'),
		getUser: createZohoBooksOperationEndpoint('get_user'),
		deleteUser: createZohoBooksOperationEndpoint('delete_user'),
		getCurrentUser: createZohoBooksOperationEndpoint('get_current_user'),
		inviteUser: createZohoBooksOperationEndpoint('invite_user'),
		markUserActive: createZohoBooksOperationEndpoint('mark_user_active'),
		markUserInactive: createZohoBooksOperationEndpoint('mark_user_inactive'),
	},
	vendorCredits: {
		createVendorCredit: createZohoBooksOperationEndpoint(
			'create_vendor_credit',
		),
		listVendorCredits: createZohoBooksOperationEndpoint('list_vendor_credits'),
		updateVendorCredit: createZohoBooksOperationEndpoint(
			'update_vendor_credit',
		),
		getVendorCredit: createZohoBooksOperationEndpoint('get_vendor_credit'),
		deleteVendorCredit: createZohoBooksOperationEndpoint(
			'delete_vendor_credit',
		),
		markVendorCreditOpen: createZohoBooksOperationEndpoint(
			'mark_vendor_credit_open',
		),
		markVendorCreditVoid: createZohoBooksOperationEndpoint(
			'mark_vendor_credit_void',
		),
		submitVendorCredit: createZohoBooksOperationEndpoint(
			'submit_vendor_credit',
		),
		approveVendorCredit: createZohoBooksOperationEndpoint(
			'approve_vendor_credit',
		),
		listBillsCredited: createZohoBooksOperationEndpoint('list_bills_credited'),
		applyCreditsToABill: createZohoBooksOperationEndpoint(
			'apply_credits_to_a_bill',
		),
		deleteVendorCreditBill: createZohoBooksOperationEndpoint(
			'delete_vendor_credit_bill',
		),
		refundVendorCredit: createZohoBooksOperationEndpoint(
			'refund_vendor_credit',
		),
		listVendorCreditRefundsOfAVendorCredit: createZohoBooksOperationEndpoint(
			'list_vendor_credit_refunds_of_a_vendor_credit',
		),
		updateVendorCreditRefund: createZohoBooksOperationEndpoint(
			'update_vendor_credit_refund',
		),
		getVendorCreditRefund: createZohoBooksOperationEndpoint(
			'get_vendor_credit_refund',
		),
		deleteVendorCreditRefund: createZohoBooksOperationEndpoint(
			'delete_vendor_credit_refund',
		),
		listVendorCreditRefundsOfAllVendorCredits: createZohoBooksOperationEndpoint(
			'list_vendor_credit_refunds_of_all_vendor_credits',
		),
		addVendorCreditComment: createZohoBooksOperationEndpoint(
			'add_vendor_credit_comment',
		),
		listVendorCreditComments: createZohoBooksOperationEndpoint(
			'list_vendor_credit_comments',
		),
		deleteVendorCreditComment: createZohoBooksOperationEndpoint(
			'delete_vendor_credit_comment',
		),
	},
	vendorPayments: {
		createVendorPayment: createZohoBooksOperationEndpoint(
			'create_vendor_payment',
		),
		listVendorPayments: createZohoBooksOperationEndpoint(
			'list_vendor_payments',
		),
		updateVendorPaymentUsingCustomField: createZohoBooksOperationEndpoint(
			'update_vendor_payment_using_custom_field',
		),
		bulkDeleteVendorPayments: createZohoBooksOperationEndpoint(
			'bulk_delete_vendor_payments',
		),
		updateVendorPayment: createZohoBooksOperationEndpoint(
			'update_vendor_payment',
		),
		getVendorPayment: createZohoBooksOperationEndpoint('get_vendor_payment'),
		deleteVendorPayment: createZohoBooksOperationEndpoint(
			'delete_vendor_payment',
		),
		listVendorPaymentRefunds: createZohoBooksOperationEndpoint(
			'list_vendor_payment_refunds',
		),
		refundExcessVendorPayment: createZohoBooksOperationEndpoint(
			'refund_excess_vendor_payment',
		),
		getVendorPaymentRefund: createZohoBooksOperationEndpoint(
			'get_vendor_payment_refund',
		),
		updateVendorPaymentRefund: createZohoBooksOperationEndpoint(
			'update_vendor_payment_refund',
		),
		deleteVendorPaymentRefund: createZohoBooksOperationEndpoint(
			'delete_vendor_payment_refund',
		),
		emailVendorPayment: createZohoBooksOperationEndpoint(
			'email_vendor_payment',
		),
		getVendorPaymentEmailContent: createZohoBooksOperationEndpoint(
			'get_vendor_payment_email_content',
		),
	},
} as const;

// Operation-ID tags derive metadata paths without expanding 884 specialized signatures; public call types remain in ZohoBooksBoundEndpoints.
type EndpointKeyTree<Tree> = {
	[Key in keyof Tree]: Tree[Key] extends {
		readonly [zohoBooksOperationId]: ZohoBooksOperationId;
	}
		? () => Promise<void>
		: Tree[Key] extends object
			? EndpointKeyTree<Tree[Key]>
			: never;
};

export type ZohoBooksEndpointKeyTree = EndpointKeyTree<
	typeof zohoBooksEndpointsNested
>;

export const zohoBooksEndpointSchemas = {
	'bankAccounts.createBankAccount': zohoBooksSchemaEntry('create_bank_account'),
	'bankAccounts.listBankAccounts': zohoBooksSchemaEntry('list_bank_accounts'),
	'bankAccounts.updateBankAccount': zohoBooksSchemaEntry('update_bank_account'),
	'bankAccounts.getBankAccount': zohoBooksSchemaEntry('get_bank_account'),
	'bankAccounts.deleteBankAccount': zohoBooksSchemaEntry('delete_bank_account'),
	'bankAccounts.markBankAccountInactive': zohoBooksSchemaEntry(
		'mark_bank_account_inactive',
	),
	'bankAccounts.markBankAccountActive': zohoBooksSchemaEntry(
		'mark_bank_account_active',
	),
	'bankAccounts.importBankStatements': zohoBooksSchemaEntry(
		'import_bank_statements',
	),
	'bankAccounts.getLastImportedBankStatement': zohoBooksSchemaEntry(
		'get_last_imported_bank_statement',
	),
	'bankAccounts.deleteLastImportedBankStatement': zohoBooksSchemaEntry(
		'delete_last_imported_bank_statement',
	),
	'bankAccounts.listBankReconciliations': zohoBooksSchemaEntry(
		'list_bank_reconciliations',
	),
	'bankAccounts.createBankReconciliation': zohoBooksSchemaEntry(
		'create_bank_reconciliation',
	),
	'bankAccounts.getBankReconciliation': zohoBooksSchemaEntry(
		'get_bank_reconciliation',
	),
	'bankAccounts.updateBankReconciliation': zohoBooksSchemaEntry(
		'update_bank_reconciliation',
	),
	'bankAccounts.deleteBankReconciliation': zohoBooksSchemaEntry(
		'delete_bank_reconciliation',
	),
	'bankAccounts.saveBankReconciliationDraft': zohoBooksSchemaEntry(
		'save_bank_reconciliation_draft',
	),
	'bankAccounts.addBankReconciliationAttachment': zohoBooksSchemaEntry(
		'add_bank_reconciliation_attachment',
	),
	'bankAccounts.getBankReconciliationDocument': zohoBooksSchemaEntry(
		'get_bank_reconciliation_document',
	),
	'bankAccounts.deleteBankReconciliationDocument': zohoBooksSchemaEntry(
		'delete_bank_reconciliation_document',
	),
	'bankAccounts.listBankAccountBalances': zohoBooksSchemaEntry(
		'list_bank_account_balances',
	),
	'bankAccounts.getBankAccountsOverview': zohoBooksSchemaEntry(
		'get_bank_accounts_overview',
	),
	'bankAccounts.getBankAccountBalance': zohoBooksSchemaEntry(
		'get_bank_account_balance',
	),
	'bankAccounts.getBankAccountBalances': zohoBooksSchemaEntry(
		'get_bank_account_balances',
	),
	'bankAccounts.getBankAccountInsights': zohoBooksSchemaEntry(
		'get_bank_account_insights',
	),
	'bankAccounts.getBankAccountOverview': zohoBooksSchemaEntry(
		'get_bank_account_overview',
	),
	'bankAccounts.getBankAccountStatementSummary': zohoBooksSchemaEntry(
		'get_bank_account_statement_summary',
	),
	'bankAccounts.listBankAccountSubaccounts': zohoBooksSchemaEntry(
		'list_bank_account_subaccounts',
	),
	'bankAccounts.listBankAccountStatements': zohoBooksSchemaEntry(
		'list_bank_account_statements',
	),
	'bankAccounts.listUnreviewedBankStatements': zohoBooksSchemaEntry(
		'list_unreviewed_bank_statements',
	),
	'bankAccounts.listBankAccountTransactions': zohoBooksSchemaEntry(
		'list_bank_account_transactions',
	),
	'bankAccounts.getBankAccountPreferences': zohoBooksSchemaEntry(
		'get_bank_account_preferences',
	),
	'bankAccounts.updateBankAccountPreferences': zohoBooksSchemaEntry(
		'update_bank_account_preferences',
	),
	'bankAccounts.getBankStatementImportEncryptionKey': zohoBooksSchemaEntry(
		'get_bank_statement_import_encryption_key',
	),
	'bankRules.listBankAccountRules': zohoBooksSchemaEntry(
		'list_bank_account_rules',
	),
	'bankRules.createBankAccountRule': zohoBooksSchemaEntry(
		'create_bank_account_rule',
	),
	'bankRules.bulkUpdateBankAccountRules': zohoBooksSchemaEntry(
		'bulk_update_bank_account_rules',
	),
	'bankRules.bulkDeleteBankAccountRules': zohoBooksSchemaEntry(
		'bulk_delete_bank_account_rules',
	),
	'bankRules.getBankAccountRule': zohoBooksSchemaEntry('get_bank_account_rule'),
	'bankRules.updateBankAccountRule': zohoBooksSchemaEntry(
		'update_bank_account_rule',
	),
	'bankRules.deleteBankAccountRule': zohoBooksSchemaEntry(
		'delete_bank_account_rule',
	),
	'bankRules.reorderBankAccountRules': zohoBooksSchemaEntry(
		'reorder_bank_account_rules',
	),
	'bankRules.skipSuggestedBankAccountRule': zohoBooksSchemaEntry(
		'skip_suggested_bank_account_rule',
	),
	'bankRules.listBankAccountMatchFilters': zohoBooksSchemaEntry(
		'list_bank_account_match_filters',
	),
	'bankRules.createBankAccountMatchFilter': zohoBooksSchemaEntry(
		'create_bank_account_match_filter',
	),
	'bankRules.updateBankAccountMatchFilter': zohoBooksSchemaEntry(
		'update_bank_account_match_filter',
	),
	'bankRules.deleteBankAccountMatchFilter': zohoBooksSchemaEntry(
		'delete_bank_account_match_filter',
	),
	'bankTransactions.createBankTransaction': zohoBooksSchemaEntry(
		'create_bank_transaction',
	),
	'bankTransactions.listBankTransactions': zohoBooksSchemaEntry(
		'list_bank_transactions',
	),
	'bankTransactions.updateBankTransaction': zohoBooksSchemaEntry(
		'update_bank_transaction',
	),
	'bankTransactions.getBankTransaction': zohoBooksSchemaEntry(
		'get_bank_transaction',
	),
	'bankTransactions.deleteBankTransaction': zohoBooksSchemaEntry(
		'delete_bank_transaction',
	),
	'bankTransactions.getMatchingBankTransactions': zohoBooksSchemaEntry(
		'get_matching_bank_transactions',
	),
	'bankTransactions.matchBankTransaction': zohoBooksSchemaEntry(
		'match_bank_transaction',
	),
	'bankTransactions.unmatchBankTransaction': zohoBooksSchemaEntry(
		'unmatch_bank_transaction',
	),
	'bankTransactions.excludeBankTransaction': zohoBooksSchemaEntry(
		'exclude_bank_transaction',
	),
	'bankTransactions.restoreBankTransaction': zohoBooksSchemaEntry(
		'restore_bank_transaction',
	),
	'bankTransactions.categorizeBankTransaction': zohoBooksSchemaEntry(
		'categorize_bank_transaction',
	),
	'bankTransactions.categorizeBankTransactionAsExpense': zohoBooksSchemaEntry(
		'categorize_bank_transaction_as_expense',
	),
	'bankTransactions.uncategorizeBankTransaction': zohoBooksSchemaEntry(
		'uncategorize_bank_transaction',
	),
	'bankTransactions.categorizeBankTransactionAsVendorPayment':
		zohoBooksSchemaEntry('categorize_bank_transaction_as_vendor_payment'),
	'bankTransactions.categorizeBankTransactionAsCustomerPayment':
		zohoBooksSchemaEntry('categorize_bank_transaction_as_customer_payment'),
	'bankTransactions.categorizeAsCreditNoteRefunds': zohoBooksSchemaEntry(
		'categorize_as_credit_note_refunds',
	),
	'bankTransactions.categorizeAsVendorCreditRefunds': zohoBooksSchemaEntry(
		'categorize_as_vendor_credit_refunds',
	),
	'bankTransactions.categorizeBankTransactionAsPaymentRefund':
		zohoBooksSchemaEntry('categorize_bank_transaction_as_payment_refund'),
	'bankTransactions.categorizeAsVendorPaymentRefund': zohoBooksSchemaEntry(
		'categorize_as_vendor_payment_refund',
	),
	'baseCurrencyAdjustment.createBaseCurrencyAdjustment': zohoBooksSchemaEntry(
		'create_base_currency_adjustment',
	),
	'baseCurrencyAdjustment.listBaseCurrencyAdjustments': zohoBooksSchemaEntry(
		'list_base_currency_adjustments',
	),
	'baseCurrencyAdjustment.getBaseCurrencyAdjustment': zohoBooksSchemaEntry(
		'get_base_currency_adjustment',
	),
	'baseCurrencyAdjustment.deleteBaseCurrencyAdjustment': zohoBooksSchemaEntry(
		'delete_base_currency_adjustment',
	),
	'baseCurrencyAdjustment.bulkDeleteBaseCurrencyAdjustments':
		zohoBooksSchemaEntry('bulk_delete_base_currency_adjustments'),
	'baseCurrencyAdjustment.reevaluateBaseCurrencyAdjustment':
		zohoBooksSchemaEntry('reevaluate_base_currency_adjustment'),
	'baseCurrencyAdjustment.listBaseCurrencyAdjustmentAccounts':
		zohoBooksSchemaEntry('list_base_currency_adjustment_accounts'),
	'baseCurrencyAdjustment.listBaseCurrencyAdjustmentContacts':
		zohoBooksSchemaEntry('list_base_currency_adjustment_contacts'),
	'bills.createBill': zohoBooksSchemaEntry('create_bill'),
	'bills.listBills': zohoBooksSchemaEntry('list_bills'),
	'bills.updateBillUsingCustomField': zohoBooksSchemaEntry(
		'update_bill_using_custom_field',
	),
	'bills.updateBill': zohoBooksSchemaEntry('update_bill'),
	'bills.getBill': zohoBooksSchemaEntry('get_bill'),
	'bills.deleteBill': zohoBooksSchemaEntry('delete_bill'),
	'bills.updateCustomFieldsInBill': zohoBooksSchemaEntry(
		'update_custom_fields_in_bill',
	),
	'bills.markBillVoid': zohoBooksSchemaEntry('mark_bill_void'),
	'bills.markBillOpen': zohoBooksSchemaEntry('mark_bill_open'),
	'bills.submitBill': zohoBooksSchemaEntry('submit_bill'),
	'bills.approveBill': zohoBooksSchemaEntry('approve_bill'),
	'bills.updateBillBillingAddress': zohoBooksSchemaEntry(
		'update_bill_billing_address',
	),
	'bills.listBillPayments': zohoBooksSchemaEntry('list_bill_payments'),
	'bills.applyCreditsToBill': zohoBooksSchemaEntry('apply_credits_to_bill'),
	'bills.deleteBillPayment': zohoBooksSchemaEntry('delete_bill_payment'),
	'bills.getBillAttachment': zohoBooksSchemaEntry('get_bill_attachment'),
	'bills.addBillAttachment': zohoBooksSchemaEntry('add_bill_attachment'),
	'bills.deleteBillAttachment': zohoBooksSchemaEntry('delete_bill_attachment'),
	'bills.getBillComments': zohoBooksSchemaEntry('get_bill_comments'),
	'bills.addBillComment': zohoBooksSchemaEntry('add_bill_comment'),
	'bills.deleteBillComment': zohoBooksSchemaEntry('delete_bill_comment'),
	'bills.convertPurchaseOrderToBill': zohoBooksSchemaEntry(
		'convert_purchase_order_to_bill',
	),
	'categories.listCategories': zohoBooksSchemaEntry('list_categories'),
	'categories.createCategory': zohoBooksSchemaEntry('create_category'),
	'categories.getCategory': zohoBooksSchemaEntry('get_category'),
	'categories.updateCategory': zohoBooksSchemaEntry('update_category'),
	'categories.deleteCategory': zohoBooksSchemaEntry('delete_category'),
	'chartOfAccounts.createChartOfAccount': zohoBooksSchemaEntry(
		'create_chart_of_account',
	),
	'chartOfAccounts.listChartOfAccounts': zohoBooksSchemaEntry(
		'list_chart_of_accounts',
	),
	'chartOfAccounts.updateChartOfAccount': zohoBooksSchemaEntry(
		'update_chart_of_account',
	),
	'chartOfAccounts.getChartOfAccount': zohoBooksSchemaEntry(
		'get_chart_of_account',
	),
	'chartOfAccounts.deleteChartOfAccount': zohoBooksSchemaEntry(
		'delete_chart_of_account',
	),
	'chartOfAccounts.markChartOfAccountActive': zohoBooksSchemaEntry(
		'mark_chart_of_account_active',
	),
	'chartOfAccounts.markChartOfAccountInactive': zohoBooksSchemaEntry(
		'mark_chart_of_account_inactive',
	),
	'chartOfAccounts.bulkMarkChartOfAccountsActive': zohoBooksSchemaEntry(
		'bulk_mark_chart_of_accounts_active',
	),
	'chartOfAccounts.bulkMarkChartOfAccountsInactive': zohoBooksSchemaEntry(
		'bulk_mark_chart_of_accounts_inactive',
	),
	'chartOfAccounts.bulkDeleteChartOfAccounts': zohoBooksSchemaEntry(
		'bulk_delete_chart_of_accounts',
	),
	'chartOfAccounts.listChartOfAccountTransactions': zohoBooksSchemaEntry(
		'list_chart_of_account_transactions',
	),
	'chartOfAccounts.deleteChartOfAccountTransaction': zohoBooksSchemaEntry(
		'delete_chart_of_account_transaction',
	),
	'contactPersons.createContactPerson': zohoBooksSchemaEntry(
		'create_contact_person',
	),
	'contactPersons.updateContactPerson': zohoBooksSchemaEntry(
		'update_contact_person',
	),
	'contactPersons.deleteContactPerson': zohoBooksSchemaEntry(
		'delete_contact_person',
	),
	'contactPersons.listContactPersons': zohoBooksSchemaEntry(
		'list_contact_persons',
	),
	'contactPersons.getContactPerson': zohoBooksSchemaEntry('get_contact_person'),
	'contactPersons.markContactPersonPrimary': zohoBooksSchemaEntry(
		'mark_contact_person_primary',
	),
	'contacts.createContact': zohoBooksSchemaEntry('create_contact'),
	'contacts.listContacts': zohoBooksSchemaEntry('list_contacts'),
	'contacts.updateContactUsingCustomField': zohoBooksSchemaEntry(
		'update_contact_using_custom_field',
	),
	'contacts.deleteContacts': zohoBooksSchemaEntry('delete_contacts'),
	'contacts.assignContactOwner': zohoBooksSchemaEntry('assign_contact_owner'),
	'contacts.assignOwnerToContacts': zohoBooksSchemaEntry(
		'assign_owner_to_contacts',
	),
	'contacts.markContactsFor1099Tracking': zohoBooksSchemaEntry(
		'mark_contacts_for_1099_tracking',
	),
	'contacts.verifyContactBankAccount': zohoBooksSchemaEntry(
		'verify_contact_bank_account',
	),
	'contacts.verifyContactAddress': zohoBooksSchemaEntry(
		'verify_contact_address',
	),
	'contacts.listContactAutobillRecurringInvoices': zohoBooksSchemaEntry(
		'list_contact_autobill_recurring_invoices',
	),
	'contacts.updateContact': zohoBooksSchemaEntry('update_contact'),
	'contacts.getContact': zohoBooksSchemaEntry('get_contact'),
	'contacts.deleteContact': zohoBooksSchemaEntry('delete_contact'),
	'contacts.markContactActive': zohoBooksSchemaEntry('mark_contact_active'),
	'contacts.markContactInactive': zohoBooksSchemaEntry('mark_contact_inactive'),
	'contacts.enableContactPortal': zohoBooksSchemaEntry('enable_contact_portal'),
	'contacts.enableContactPaymentReminder': zohoBooksSchemaEntry(
		'enable_contact_payment_reminder',
	),
	'contacts.disableContactPaymentReminder': zohoBooksSchemaEntry(
		'disable_contact_payment_reminder',
	),
	'contacts.emailContactStatement': zohoBooksSchemaEntry(
		'email_contact_statement',
	),
	'contacts.getContactStatementMail': zohoBooksSchemaEntry(
		'get_contact_statement_mail',
	),
	'contacts.getContactEmailContent': zohoBooksSchemaEntry(
		'get_contact_email_content',
	),
	'contacts.emailContact': zohoBooksSchemaEntry('email_contact'),
	'contacts.listContactComments': zohoBooksSchemaEntry('list_contact_comments'),
	'contacts.addContactComment': zohoBooksSchemaEntry('add_contact_comment'),
	'contacts.getContactAddress': zohoBooksSchemaEntry('get_contact_address'),
	'contacts.addContactAddress': zohoBooksSchemaEntry('add_contact_address'),
	'contacts.updateContactAddress': zohoBooksSchemaEntry(
		'update_contact_address',
	),
	'contacts.deleteContactAddress': zohoBooksSchemaEntry(
		'delete_contact_address',
	),
	'contacts.listContactCreditNoteRefunds': zohoBooksSchemaEntry(
		'list_contact_credit_note_refunds',
	),
	'contacts.trackContact1099': zohoBooksSchemaEntry('track_contact_1099'),
	'contacts.untrackContact1099': zohoBooksSchemaEntry('untrack_contact_1099'),
	'contacts.getUnusedRetainerPayments': zohoBooksSchemaEntry(
		'get_unused_retainer_payments',
	),
	'contacts.addContactBankAccount': zohoBooksSchemaEntry(
		'add_contact_bank_account',
	),
	'contacts.getContactBankAccount': zohoBooksSchemaEntry(
		'get_contact_bank_account',
	),
	'contacts.updateContactBankAccount': zohoBooksSchemaEntry(
		'update_contact_bank_account',
	),
	'contacts.deleteContactBankAccount': zohoBooksSchemaEntry(
		'delete_contact_bank_account',
	),
	'contacts.approveContactBankAccount': zohoBooksSchemaEntry(
		'approve_contact_bank_account',
	),
	'contacts.declineContactBankAccount': zohoBooksSchemaEntry(
		'decline_contact_bank_account',
	),
	'contacts.listContactBankAccounts': zohoBooksSchemaEntry(
		'list_contact_bank_accounts',
	),
	'contacts.listAllContactBankAccounts': zohoBooksSchemaEntry(
		'list_all_contact_bank_accounts',
	),
	'contacts.addContactCard': zohoBooksSchemaEntry('add_contact_card'),
	'contacts.getContactCard': zohoBooksSchemaEntry('get_contact_card'),
	'contacts.updateContactCard': zohoBooksSchemaEntry('update_contact_card'),
	'contacts.deleteContactCard': zohoBooksSchemaEntry('delete_contact_card'),
	'contacts.listContactCards': zohoBooksSchemaEntry('list_contact_cards'),
	'contacts.getContactCardCount': zohoBooksSchemaEntry(
		'get_contact_card_count',
	),
	'contacts.listAllContactPersons': zohoBooksSchemaEntry(
		'list_all_contact_persons',
	),
	'contacts.getContactContactPerson': zohoBooksSchemaEntry(
		'get_contact_contact_person',
	),
	'contacts.inviteContactPersonToPortal': zohoBooksSchemaEntry(
		'invite_contact_person_to_portal',
	),
	'contacts.resendContactPersonPortalInvite': zohoBooksSchemaEntry(
		'resend_contact_person_portal_invite',
	),
	'contacts.enableContactPersonSms': zohoBooksSchemaEntry(
		'enable_contact_person_sms',
	),
	'contacts.disableContactPersonSms': zohoBooksSchemaEntry(
		'disable_contact_person_sms',
	),
	'contacts.deleteContactComment': zohoBooksSchemaEntry(
		'delete_contact_comment',
	),
	'contacts.getContactDocument': zohoBooksSchemaEntry('get_contact_document'),
	'contacts.updateContactDocument': zohoBooksSchemaEntry(
		'update_contact_document',
	),
	'contacts.deleteContactDocument': zohoBooksSchemaEntry(
		'delete_contact_document',
	),
	'contacts.restoreContactDocuments': zohoBooksSchemaEntry(
		'restore_contact_documents',
	),
	'contacts.updateContactTags': zohoBooksSchemaEntry('update_contact_tags'),
	'contacts.deleteContactTag': zohoBooksSchemaEntry('delete_contact_tag'),
	'contacts.listContactTaxInfo': zohoBooksSchemaEntry('list_contact_tax_info'),
	'contacts.addContactTaxInfo': zohoBooksSchemaEntry('add_contact_tax_info'),
	'contacts.updateContactTaxInfo': zohoBooksSchemaEntry(
		'update_contact_tax_info',
	),
	'contacts.deleteContactTaxInfo': zohoBooksSchemaEntry(
		'delete_contact_tax_info',
	),
	'contacts.listContactAddresses': zohoBooksSchemaEntry(
		'list_contact_addresses',
	),
	'contacts.markContactAddressAsBilling': zohoBooksSchemaEntry(
		'mark_contact_address_as_billing',
	),
	'contacts.markContactAddressAsShipping': zohoBooksSchemaEntry(
		'mark_contact_address_as_shipping',
	),
	'contacts.verifyContactAddressById': zohoBooksSchemaEntry(
		'verify_contact_address_by_id',
	),
	'contacts.addContactAttachment': zohoBooksSchemaEntry(
		'add_contact_attachment',
	),
	'contacts.mergeContact': zohoBooksSchemaEntry('merge_contact'),
	'contacts.verifyContactEinvoice': zohoBooksSchemaEntry(
		'verify_contact_einvoice',
	),
	'contacts.disableContactPortal': zohoBooksSchemaEntry(
		'disable_contact_portal',
	),
	'contacts.getContactsSmsContent': zohoBooksSchemaEntry(
		'get_contacts_sms_content',
	),
	'contacts.sendContactsSms': zohoBooksSchemaEntry('send_contacts_sms'),
	'contacts.getContactSmsContent': zohoBooksSchemaEntry(
		'get_contact_sms_content',
	),
	'contacts.sendContactSms': zohoBooksSchemaEntry('send_contact_sms'),
	'contacts.getContactByReference': zohoBooksSchemaEntry(
		'get_contact_by_reference',
	),
	'contacts.getContactStatement': zohoBooksSchemaEntry('get_contact_statement'),
	'contacts.getContactUnusedCredits': zohoBooksSchemaEntry(
		'get_contact_unused_credits',
	),
	'contacts.listContactPaymentRefunds': zohoBooksSchemaEntry(
		'list_contact_payment_refunds',
	),
	'contacts.getContactIncomeAndExpense': zohoBooksSchemaEntry(
		'get_contact_income_and_expense',
	),
	'contacts.getContactProfitAndLoss': zohoBooksSchemaEntry(
		'get_contact_profit_and_loss',
	),
	'contacts.getContactInventorySummary': zohoBooksSchemaEntry(
		'get_contact_inventory_summary',
	),
	'contacts.getContactOpeningBalances': zohoBooksSchemaEntry(
		'get_contact_opening_balances',
	),
	'contacts.updateContactTrnStatus': zohoBooksSchemaEntry(
		'update_contact_trn_status',
	),
	'contacts.getContactClientReviewEmail': zohoBooksSchemaEntry(
		'get_contact_client_review_email',
	),
	'contacts.sendContactClientReviewEmail': zohoBooksSchemaEntry(
		'send_contact_client_review_email',
	),
	'contacts.getContactPaymentMethodEmail': zohoBooksSchemaEntry(
		'get_contact_payment_method_email',
	),
	'contacts.sendContactPaymentMethodEmail': zohoBooksSchemaEntry(
		'send_contact_payment_method_email',
	),
	'contacts.getContactVendorStatementEmail': zohoBooksSchemaEntry(
		'get_contact_vendor_statement_email',
	),
	'contacts.sendContactVendorStatementEmail': zohoBooksSchemaEntry(
		'send_contact_vendor_statement_email',
	),
	'creditNotes.createCreditNote': zohoBooksSchemaEntry('create_credit_note'),
	'creditNotes.listCreditNotes': zohoBooksSchemaEntry('list_credit_notes'),
	'creditNotes.updateCreditNoteUsingCustomField': zohoBooksSchemaEntry(
		'update_credit_note_using_custom_field',
	),
	'creditNotes.updateCreditNote': zohoBooksSchemaEntry('update_credit_note'),
	'creditNotes.getCreditNote': zohoBooksSchemaEntry('get_credit_note'),
	'creditNotes.deleteCreditNote': zohoBooksSchemaEntry('delete_credit_note'),
	'creditNotes.emailCreditNote': zohoBooksSchemaEntry('email_credit_note'),
	'creditNotes.getCreditNoteEmail': zohoBooksSchemaEntry(
		'get_credit_note_email',
	),
	'creditNotes.markCreditNoteVoid': zohoBooksSchemaEntry(
		'mark_credit_note_void',
	),
	'creditNotes.markCreditNoteDraft': zohoBooksSchemaEntry(
		'mark_credit_note_draft',
	),
	'creditNotes.markCreditNoteOpen': zohoBooksSchemaEntry(
		'mark_credit_note_open',
	),
	'creditNotes.submitCreditNote': zohoBooksSchemaEntry('submit_credit_note'),
	'creditNotes.approveCreditNote': zohoBooksSchemaEntry('approve_credit_note'),
	'creditNotes.getCreditNoteEmailHistory': zohoBooksSchemaEntry(
		'get_credit_note_email_history',
	),
	'creditNotes.updateCreditNoteBillingAddress': zohoBooksSchemaEntry(
		'update_credit_note_billing_address',
	),
	'creditNotes.updateCreditNoteShippingAddress': zohoBooksSchemaEntry(
		'update_credit_note_shipping_address',
	),
	'creditNotes.listCreditNoteTemplates': zohoBooksSchemaEntry(
		'list_credit_note_templates',
	),
	'creditNotes.updateCreditNoteTemplate': zohoBooksSchemaEntry(
		'update_credit_note_template',
	),
	'creditNotes.listInvoicesOfCreditNote': zohoBooksSchemaEntry(
		'list_invoices_of_credit_note',
	),
	'creditNotes.applyCreditNoteToInvoice': zohoBooksSchemaEntry(
		'apply_credit_note_to_invoice',
	),
	'creditNotes.deleteInvoiceOfCreditNote': zohoBooksSchemaEntry(
		'delete_invoice_of_credit_note',
	),
	'creditNotes.listCreditNoteComments': zohoBooksSchemaEntry(
		'list_credit_note_comments',
	),
	'creditNotes.addCreditNoteComment': zohoBooksSchemaEntry(
		'add_credit_note_comment',
	),
	'creditNotes.deleteCreditNoteComment': zohoBooksSchemaEntry(
		'delete_credit_note_comment',
	),
	'creditNotes.listCreditNoteRefundsOfAllCreditNotes': zohoBooksSchemaEntry(
		'list_credit_note_refunds_of_all_credit_notes',
	),
	'creditNotes.listCreditNoteRefundsOfACreditNote': zohoBooksSchemaEntry(
		'list_credit_note_refunds_of_a_credit_note',
	),
	'creditNotes.createCreditNoteRefund': zohoBooksSchemaEntry(
		'create_credit_note_refund',
	),
	'creditNotes.getCreditNoteRefund': zohoBooksSchemaEntry(
		'get_credit_note_refund',
	),
	'creditNotes.updateCreditNoteRefund': zohoBooksSchemaEntry(
		'update_credit_note_refund',
	),
	'creditNotes.deleteCreditNoteRefund': zohoBooksSchemaEntry(
		'delete_credit_note_refund',
	),
	'creditNotes.approveCreditNotes': zohoBooksSchemaEntry(
		'approve_credit_notes',
	),
	'creditNotes.submitCreditNotes': zohoBooksSchemaEntry('submit_credit_notes'),
	'creditNotes.finalizeCreditNoteApproval': zohoBooksSchemaEntry(
		'finalize_credit_note_approval',
	),
	'creditNotes.rejectCreditNote': zohoBooksSchemaEntry('reject_credit_note'),
	'creditNotes.getCreditNoteSignatureTemplate': zohoBooksSchemaEntry(
		'get_credit_note_signature_template',
	),
	'creditNotes.printCreditNotes': zohoBooksSchemaEntry('print_credit_notes'),
	'creditNotes.addCreditNoteAttachment': zohoBooksSchemaEntry(
		'add_credit_note_attachment',
	),
	'creditNotes.getCreditNoteDocument': zohoBooksSchemaEntry(
		'get_credit_note_document',
	),
	'creditNotes.updateCreditNoteDocument': zohoBooksSchemaEntry(
		'update_credit_note_document',
	),
	'creditNotes.deleteCreditNoteDocument': zohoBooksSchemaEntry(
		'delete_credit_note_document',
	),
	'creditNotes.getCreditNoteCustomFields': zohoBooksSchemaEntry(
		'get_credit_note_custom_fields',
	),
	'creditNotes.updateCreditNoteCustomFields': zohoBooksSchemaEntry(
		'update_credit_note_custom_fields',
	),
	'creditNotes.getCreditNoteMailContent': zohoBooksSchemaEntry(
		'get_credit_note_mail_content',
	),
	'creditNotes.addCreditNoteDigitalSignature': zohoBooksSchemaEntry(
		'add_credit_note_digital_signature',
	),
	'creditNotes.uploadCreditNoteDigitalSignature': zohoBooksSchemaEntry(
		'upload_credit_note_digital_signature',
	),
	'creditNotes.getCreditNoteRefundById': zohoBooksSchemaEntry(
		'get_credit_note_refund_by_id',
	),
	'creditNotes.applyCreditNoteSubstatus': zohoBooksSchemaEntry(
		'apply_credit_note_substatus',
	),
	'creditNotes.deleteCreditNoteSubstatus': zohoBooksSchemaEntry(
		'delete_credit_note_substatus',
	),
	'creditNotes.listCreditNotesEinvoice': zohoBooksSchemaEntry(
		'list_credit_notes_einvoice',
	),
	'creditNotes.pushCreditNotesEinvoice': zohoBooksSchemaEntry(
		'push_credit_notes_einvoice',
	),
	'creditNotes.cancelCreditNotesEinvoice': zohoBooksSchemaEntry(
		'cancel_credit_notes_einvoice',
	),
	'creditNotes.getCreditNoteEinvoice': zohoBooksSchemaEntry(
		'get_credit_note_einvoice',
	),
	'creditNotes.pushCreditNoteEinvoice': zohoBooksSchemaEntry(
		'push_credit_note_einvoice',
	),
	'creditNotes.cancelCreditNoteEinvoice': zohoBooksSchemaEntry(
		'cancel_credit_note_einvoice',
	),
	'creditNotes.fetchCreditNoteEinvoice': zohoBooksSchemaEntry(
		'fetch_credit_note_einvoice',
	),
	'creditNotes.deleteCreditNoteEinvoiceStatus': zohoBooksSchemaEntry(
		'delete_credit_note_einvoice_status',
	),
	'creditNotes.markCreditNoteEinvoicePushed': zohoBooksSchemaEntry(
		'mark_credit_note_einvoice_pushed',
	),
	'creditNotes.markCreditNoteEinvoiceCancelled': zohoBooksSchemaEntry(
		'mark_credit_note_einvoice_cancelled',
	),
	'creditNotes.recallCreditNoteEinvoiceStatus': zohoBooksSchemaEntry(
		'recall_credit_note_einvoice_status',
	),
	'creditNotes.pushCreditNoteRefundEinvoice': zohoBooksSchemaEntry(
		'push_credit_note_refund_einvoice',
	),
	'creditNotes.markCreditNoteReadyToPush': zohoBooksSchemaEntry(
		'mark_credit_note_ready_to_push',
	),
	'creditNotes.updateCreditNoteCfdiStatus': zohoBooksSchemaEntry(
		'update_credit_note_cfdi_status',
	),
	'creditNotes.cancelEinvoiceCreditNote': zohoBooksSchemaEntry(
		'cancel_einvoice_credit_note',
	),
	'currency.createCurrency': zohoBooksSchemaEntry('create_currency'),
	'currency.listCurrencies': zohoBooksSchemaEntry('list_currencies'),
	'currency.updateCurrency': zohoBooksSchemaEntry('update_currency'),
	'currency.getCurrency': zohoBooksSchemaEntry('get_currency'),
	'currency.deleteCurrency': zohoBooksSchemaEntry('delete_currency'),
	'currency.listExchangeRates': zohoBooksSchemaEntry('list_exchange_rates'),
	'currency.createExchangeRate': zohoBooksSchemaEntry('create_exchange_rate'),
	'currency.getExchangeRate': zohoBooksSchemaEntry('get_exchange_rate'),
	'currency.updateExchangeRate': zohoBooksSchemaEntry('update_exchange_rate'),
	'currency.deleteExchangeRate': zohoBooksSchemaEntry('delete_exchange_rate'),
	'customModules.listCustomModules': zohoBooksSchemaEntry(
		'list_custom_modules',
	),
	'customModules.createCustomModule': zohoBooksSchemaEntry(
		'create_custom_module',
	),
	'customModules.getCustomModule': zohoBooksSchemaEntry('get_custom_module'),
	'customModules.updateCustomModule': zohoBooksSchemaEntry(
		'update_custom_module',
	),
	'customModules.deleteCustomModule': zohoBooksSchemaEntry(
		'delete_custom_module',
	),
	'customModules.listCustomModuleRecords': zohoBooksSchemaEntry(
		'list_custom_module_records',
	),
	'customModules.bulkUpdateCustomModuleRecords': zohoBooksSchemaEntry(
		'bulk_update_custom_module_records',
	),
	'customModules.createCustomModuleRecord': zohoBooksSchemaEntry(
		'create_custom_module_record',
	),
	'customModules.deleteCustomModuleRecords': zohoBooksSchemaEntry(
		'delete_custom_module_records',
	),
	'customModules.getCustomModuleRecord': zohoBooksSchemaEntry(
		'get_custom_module_record',
	),
	'customModules.updateCustomModuleRecord': zohoBooksSchemaEntry(
		'update_custom_module_record',
	),
	'customModules.deleteCustomModuleRecord': zohoBooksSchemaEntry(
		'delete_custom_module_record',
	),
	'customerDebitNotes.createCustomerDebitNote': zohoBooksSchemaEntry(
		'create_customer_debit_note',
	),
	'customerDebitNotes.listCustomerDebitNotes': zohoBooksSchemaEntry(
		'list_customer_debit_notes',
	),
	'customerDebitNotes.updateCustomerDebitNote': zohoBooksSchemaEntry(
		'update_customer_debit_note',
	),
	'customerDebitNotes.getCustomerDebitNote': zohoBooksSchemaEntry(
		'get_customer_debit_note',
	),
	'customerDebitNotes.deleteCustomerDebitNote': zohoBooksSchemaEntry(
		'delete_customer_debit_note',
	),
	'customerPayments.createCustomerPayment': zohoBooksSchemaEntry(
		'create_customer_payment',
	),
	'customerPayments.listCustomerPayments': zohoBooksSchemaEntry(
		'list_customer_payments',
	),
	'customerPayments.bulkDeleteCustomerPayments': zohoBooksSchemaEntry(
		'bulk_delete_customer_payments',
	),
	'customerPayments.updateCustomerPaymentUsingCustomField':
		zohoBooksSchemaEntry('update_customer_payment_using_custom_field'),
	'customerPayments.updateCustomerPayment': zohoBooksSchemaEntry(
		'update_customer_payment',
	),
	'customerPayments.getCustomerPayment': zohoBooksSchemaEntry(
		'get_customer_payment',
	),
	'customerPayments.deleteCustomerPayment': zohoBooksSchemaEntry(
		'delete_customer_payment',
	),
	'customerPayments.listCustomerPaymentRefunds': zohoBooksSchemaEntry(
		'list_customer_payment_refunds',
	),
	'customerPayments.createCustomerPaymentRefund': zohoBooksSchemaEntry(
		'create_customer_payment_refund',
	),
	'customerPayments.updateCustomFieldsInCustomerPayment': zohoBooksSchemaEntry(
		'update_custom_fields_in_customer_payment',
	),
	'customerPayments.getCustomerPaymentRefund': zohoBooksSchemaEntry(
		'get_customer_payment_refund',
	),
	'customerPayments.updateCustomerPaymentRefund': zohoBooksSchemaEntry(
		'update_customer_payment_refund',
	),
	'customerPayments.deleteCustomerPaymentRefund': zohoBooksSchemaEntry(
		'delete_customer_payment_refund',
	),
	'deliveryChallans.listDeliveryChallans': zohoBooksSchemaEntry(
		'list_delivery_challans',
	),
	'deliveryChallans.createDeliveryChallan': zohoBooksSchemaEntry(
		'create_delivery_challan',
	),
	'deliveryChallans.getDeliveryChallan': zohoBooksSchemaEntry(
		'get_delivery_challan',
	),
	'deliveryChallans.updateDeliveryChallan': zohoBooksSchemaEntry(
		'update_delivery_challan',
	),
	'deliveryChallans.deleteDeliveryChallan': zohoBooksSchemaEntry(
		'delete_delivery_challan',
	),
	'deliveryChallans.markDeliveryChallanAsOpen': zohoBooksSchemaEntry(
		'mark_delivery_challan_as_open',
	),
	'deliveryChallans.markDeliveryChallanAsDelivered': zohoBooksSchemaEntry(
		'mark_delivery_challan_as_delivered',
	),
	'deliveryChallans.markDeliveryChallanAsReturned': zohoBooksSchemaEntry(
		'mark_delivery_challan_as_returned',
	),
	'deliveryChallans.markDeliveryChallanAsUndelivered': zohoBooksSchemaEntry(
		'mark_delivery_challan_as_undelivered',
	),
	'deliveryChallans.returnDeliveryChallans': zohoBooksSchemaEntry(
		'return_delivery_challans',
	),
	'deliveryChallans.undoReturnDeliveryChallans': zohoBooksSchemaEntry(
		'undo_return_delivery_challans',
	),
	'deliveryChallans.addAttachmentToDeliveryChallan': zohoBooksSchemaEntry(
		'add_attachment_to_delivery_challan',
	),
	'deliveryChallans.getDeliveryChallanAttachment': zohoBooksSchemaEntry(
		'get_delivery_challan_attachment',
	),
	'deliveryChallans.deleteDeliveryChallanAttachment': zohoBooksSchemaEntry(
		'delete_delivery_challan_attachment',
	),
	'deliveryChallans.listDeliveryChallanTemplates': zohoBooksSchemaEntry(
		'list_delivery_challan_templates',
	),
	'deliveryChallans.updateDeliveryChallanTemplate': zohoBooksSchemaEntry(
		'update_delivery_challan_template',
	),
	'deliveryChallans.updateDeliveryChallanShippingAddress': zohoBooksSchemaEntry(
		'update_delivery_challan_shipping_address',
	),
	'estimates.createEstimate': zohoBooksSchemaEntry('create_estimate'),
	'estimates.listEstimates': zohoBooksSchemaEntry('list_estimates'),
	'estimates.updateEstimateUsingCustomField': zohoBooksSchemaEntry(
		'update_estimate_using_custom_field',
	),
	'estimates.updateEstimate': zohoBooksSchemaEntry('update_estimate'),
	'estimates.getEstimate': zohoBooksSchemaEntry('get_estimate'),
	'estimates.deleteEstimate': zohoBooksSchemaEntry('delete_estimate'),
	'estimates.updateCustomFieldsInEstimate': zohoBooksSchemaEntry(
		'update_custom_fields_in_estimate',
	),
	'estimates.markEstimateSent': zohoBooksSchemaEntry('mark_estimate_sent'),
	'estimates.markEstimateAccepted': zohoBooksSchemaEntry(
		'mark_estimate_accepted',
	),
	'estimates.markEstimateDeclined': zohoBooksSchemaEntry(
		'mark_estimate_declined',
	),
	'estimates.submitEstimate': zohoBooksSchemaEntry('submit_estimate'),
	'estimates.approveEstimate': zohoBooksSchemaEntry('approve_estimate'),
	'estimates.emailEstimate': zohoBooksSchemaEntry('email_estimate'),
	'estimates.getEstimateEmail': zohoBooksSchemaEntry('get_estimate_email'),
	'estimates.emailMultipleEstimates': zohoBooksSchemaEntry(
		'email_multiple_estimates',
	),
	'estimates.bulkExportEstimatesAsPdf': zohoBooksSchemaEntry(
		'bulk_export_estimates_as_pdf',
	),
	'estimates.bulkPrintEstimates': zohoBooksSchemaEntry('bulk_print_estimates'),
	'estimates.updateEstimateBillingAddress': zohoBooksSchemaEntry(
		'update_estimate_billing_address',
	),
	'estimates.updateEstimateShippingAddress': zohoBooksSchemaEntry(
		'update_estimate_shipping_address',
	),
	'estimates.listEstimateTemplates': zohoBooksSchemaEntry(
		'list_estimate_templates',
	),
	'estimates.updateEstimateTemplate': zohoBooksSchemaEntry(
		'update_estimate_template',
	),
	'estimates.listEstimateComments': zohoBooksSchemaEntry(
		'list_estimate_comments',
	),
	'estimates.createEstimateComment': zohoBooksSchemaEntry(
		'create_estimate_comment',
	),
	'estimates.updateEstimateComment': zohoBooksSchemaEntry(
		'update_estimate_comment',
	),
	'estimates.deleteEstimateComment': zohoBooksSchemaEntry(
		'delete_estimate_comment',
	),
	'expenses.createExpense': zohoBooksSchemaEntry('create_expense'),
	'expenses.listExpenses': zohoBooksSchemaEntry('list_expenses'),
	'expenses.updateExpenseUsingCustomField': zohoBooksSchemaEntry(
		'update_expense_using_custom_field',
	),
	'expenses.updateExpense': zohoBooksSchemaEntry('update_expense'),
	'expenses.getExpense': zohoBooksSchemaEntry('get_expense'),
	'expenses.deleteExpense': zohoBooksSchemaEntry('delete_expense'),
	'expenses.listExpenseComments': zohoBooksSchemaEntry('list_expense_comments'),
	'expenses.listEmployees': zohoBooksSchemaEntry('list_employees'),
	'expenses.createEmployee': zohoBooksSchemaEntry('create_employee'),
	'expenses.getEmployee': zohoBooksSchemaEntry('get_employee'),
	'expenses.deleteEmployee': zohoBooksSchemaEntry('delete_employee'),
	'expenses.getExpenseReceipt': zohoBooksSchemaEntry('get_expense_receipt'),
	'expenses.createExpenseReceipt': zohoBooksSchemaEntry(
		'create_expense_receipt',
	),
	'expenses.deleteExpenseReceipt': zohoBooksSchemaEntry(
		'delete_expense_receipt',
	),
	'expenses.addExpenseAttachment': zohoBooksSchemaEntry(
		'add_expense_attachment',
	),
	'fixedAssets.createFixedAsset': zohoBooksSchemaEntry('create_fixed_asset'),
	'fixedAssets.listFixedAssets': zohoBooksSchemaEntry('list_fixed_assets'),
	'fixedAssets.updateFixedAsset': zohoBooksSchemaEntry('update_fixed_asset'),
	'fixedAssets.getFixedAsset': zohoBooksSchemaEntry('get_fixed_asset'),
	'fixedAssets.deleteFixedAsset': zohoBooksSchemaEntry('delete_fixed_asset'),
	'fixedAssets.getFixedAssetHistory': zohoBooksSchemaEntry(
		'get_fixed_asset_history',
	),
	'fixedAssets.getFixedAssetForecast': zohoBooksSchemaEntry(
		'get_fixed_asset_forecast',
	),
	'fixedAssets.markFixedAssetActive': zohoBooksSchemaEntry(
		'mark_fixed_asset_active',
	),
	'fixedAssets.markFixedAssetCancel': zohoBooksSchemaEntry(
		'mark_fixed_asset_cancel',
	),
	'fixedAssets.markFixedAssetDraft': zohoBooksSchemaEntry(
		'mark_fixed_asset_draft',
	),
	'fixedAssets.writeOffFixedAsset': zohoBooksSchemaEntry(
		'write_off_fixed_asset',
	),
	'fixedAssets.sellFixedAsset': zohoBooksSchemaEntry('sell_fixed_asset'),
	'fixedAssets.createFixedAssetComment': zohoBooksSchemaEntry(
		'create_fixed_asset_comment',
	),
	'fixedAssets.deleteFixedAssetComment': zohoBooksSchemaEntry(
		'delete_fixed_asset_comment',
	),
	'fixedAssets.createFixedAssetType': zohoBooksSchemaEntry(
		'create_fixed_asset_type',
	),
	'fixedAssets.getFixedAssetTypeList': zohoBooksSchemaEntry(
		'get_fixed_asset_type_list',
	),
	'fixedAssets.updateFixedAssetType': zohoBooksSchemaEntry(
		'update_fixed_asset_type',
	),
	'fixedAssets.deleteFixedAssetType': zohoBooksSchemaEntry(
		'delete_fixed_asset_type',
	),
	'integration.importCustomerUsingCrmAccountId': zohoBooksSchemaEntry(
		'import_customer_using_crm_account_id',
	),
	'integration.importCustomerUsingCrmContactId': zohoBooksSchemaEntry(
		'import_customer_using_crm_contact_id',
	),
	'integration.importVendorUsingCrmVendorId': zohoBooksSchemaEntry(
		'import_vendor_using_crm_vendor_id',
	),
	'integration.importItemUsingCrmProductId': zohoBooksSchemaEntry(
		'import_item_using_crm_product_id',
	),
	'invoices.createInvoice': zohoBooksSchemaEntry('create_invoice'),
	'invoices.listInvoices': zohoBooksSchemaEntry('list_invoices'),
	'invoices.updateInvoiceUsingCustomField': zohoBooksSchemaEntry(
		'update_invoice_using_custom_field',
	),
	'invoices.deleteInvoices': zohoBooksSchemaEntry('delete_invoices'),
	'invoices.updateInvoice': zohoBooksSchemaEntry('update_invoice'),
	'invoices.getInvoice': zohoBooksSchemaEntry('get_invoice'),
	'invoices.deleteInvoice': zohoBooksSchemaEntry('delete_invoice'),
	'invoices.markInvoiceSent': zohoBooksSchemaEntry('mark_invoice_sent'),
	'invoices.markInvoiceVoid': zohoBooksSchemaEntry('mark_invoice_void'),
	'invoices.markInvoiceDraft': zohoBooksSchemaEntry('mark_invoice_draft'),
	'invoices.emailInvoices': zohoBooksSchemaEntry('email_invoices'),
	'invoices.createInvoiceFromSalesorder': zohoBooksSchemaEntry(
		'create_invoice_from_salesorder',
	),
	'invoices.mapInvoiceWithSalesorder': zohoBooksSchemaEntry(
		'map_invoice_with_salesorder',
	),
	'invoices.submitInvoice': zohoBooksSchemaEntry('submit_invoice'),
	'invoices.approveInvoice': zohoBooksSchemaEntry('approve_invoice'),
	'invoices.getInvoiceEmail': zohoBooksSchemaEntry('get_invoice_email'),
	'invoices.emailInvoice': zohoBooksSchemaEntry('email_invoice'),
	'invoices.remindCustomerForInvoicePayment': zohoBooksSchemaEntry(
		'remind_customer_for_invoice_payment',
	),
	'invoices.getPaymentReminderMailContentForInvoice': zohoBooksSchemaEntry(
		'get_payment_reminder_mail_content_for_invoice',
	),
	'invoices.bulkInvoiceReminder': zohoBooksSchemaEntry('bulk_invoice_reminder'),
	'invoices.bulkExportInvoicesAsPdf': zohoBooksSchemaEntry(
		'bulk_export_invoices_as_pdf',
	),
	'invoices.bulkPrintInvoices': zohoBooksSchemaEntry('bulk_print_invoices'),
	'invoices.disableInvoicePaymentReminder': zohoBooksSchemaEntry(
		'disable_invoice_payment_reminder',
	),
	'invoices.enableInvoicePaymentReminder': zohoBooksSchemaEntry(
		'enable_invoice_payment_reminder',
	),
	'invoices.writeOffInvoice': zohoBooksSchemaEntry('write_off_invoice'),
	'invoices.cancelWriteOffInvoice': zohoBooksSchemaEntry(
		'cancel_write_off_invoice',
	),
	'invoices.updateInvoiceBillingAddress': zohoBooksSchemaEntry(
		'update_invoice_billing_address',
	),
	'invoices.updateInvoiceShippingAddress': zohoBooksSchemaEntry(
		'update_invoice_shipping_address',
	),
	'invoices.listInvoiceTemplates': zohoBooksSchemaEntry(
		'list_invoice_templates',
	),
	'invoices.updateInvoiceTemplate': zohoBooksSchemaEntry(
		'update_invoice_template',
	),
	'invoices.listInvoicePayments': zohoBooksSchemaEntry('list_invoice_payments'),
	'invoices.listInvoiceCreditsApplied': zohoBooksSchemaEntry(
		'list_invoice_credits_applied',
	),
	'invoices.applyCreditsToInvoice': zohoBooksSchemaEntry(
		'apply_credits_to_invoice',
	),
	'invoices.deleteInvoicePayment': zohoBooksSchemaEntry(
		'delete_invoice_payment',
	),
	'invoices.deleteInvoiceAppliedCredit': zohoBooksSchemaEntry(
		'delete_invoice_applied_credit',
	),
	'invoices.getInvoiceAttachment': zohoBooksSchemaEntry(
		'get_invoice_attachment',
	),
	'invoices.addInvoiceAttachment': zohoBooksSchemaEntry(
		'add_invoice_attachment',
	),
	'invoices.updateInvoiceAttachmentPreference': zohoBooksSchemaEntry(
		'update_invoice_attachment_preference',
	),
	'invoices.deleteInvoiceAttachment': zohoBooksSchemaEntry(
		'delete_invoice_attachment',
	),
	'invoices.getInvoiceDocumentDetails': zohoBooksSchemaEntry(
		'get_invoice_document_details',
	),
	'invoices.deleteInvoiceDocument': zohoBooksSchemaEntry(
		'delete_invoice_document',
	),
	'invoices.addInvoiceDocument': zohoBooksSchemaEntry('add_invoice_document'),
	'invoices.deleteInvoiceExpenseReceipt': zohoBooksSchemaEntry(
		'delete_invoice_expense_receipt',
	),
	'invoices.updateCustomFieldsInInvoice': zohoBooksSchemaEntry(
		'update_custom_fields_in_invoice',
	),
	'invoices.listInvoiceComments': zohoBooksSchemaEntry('list_invoice_comments'),
	'invoices.addInvoiceComment': zohoBooksSchemaEntry('add_invoice_comment'),
	'invoices.updateInvoiceComment': zohoBooksSchemaEntry(
		'update_invoice_comment',
	),
	'invoices.deleteInvoiceComment': zohoBooksSchemaEntry(
		'delete_invoice_comment',
	),
	'invoices.generateInvoicePaymentLink': zohoBooksSchemaEntry(
		'generate_invoice_payment_link',
	),
	'invoices.approveInvoices': zohoBooksSchemaEntry('approve_invoices'),
	'invoices.voidInvoices': zohoBooksSchemaEntry('void_invoices'),
	'invoices.createInvoicesFromProjects': zohoBooksSchemaEntry(
		'create_invoices_from_projects',
	),
	'invoices.getInvoiceDeliveryNotes': zohoBooksSchemaEntry(
		'get_invoice_delivery_notes',
	),
	'invoices.getInvoicePackingSlips': zohoBooksSchemaEntry(
		'get_invoice_packing_slips',
	),
	'invoices.finalizeInvoiceApproval': zohoBooksSchemaEntry(
		'finalize_invoice_approval',
	),
	'invoices.rejectInvoice': zohoBooksSchemaEntry('reject_invoice'),
	'invoices.sendInvoiceViaSnailMail': zohoBooksSchemaEntry(
		'send_invoice_via_snail_mail',
	),
	'invoices.addInvoiceOnlinePaymentBankAccount': zohoBooksSchemaEntry(
		'add_invoice_online_payment_bank_account',
	),
	'invoices.applyPricebookToInvoice': zohoBooksSchemaEntry(
		'apply_pricebook_to_invoice',
	),
	'invoices.submitInvoices': zohoBooksSchemaEntry('submit_invoices'),
	'invoices.markInvoicesSent': zohoBooksSchemaEntry('mark_invoices_sent'),
	'invoices.writeOffInvoices': zohoBooksSchemaEntry('write_off_invoices'),
	'invoices.markInvoicesShipped': zohoBooksSchemaEntry('mark_invoices_shipped'),
	'invoices.unshipInvoices': zohoBooksSchemaEntry('unship_invoices'),
	'invoices.createInvoicesFromEstimates': zohoBooksSchemaEntry(
		'create_invoices_from_estimates',
	),
	'invoices.previewInvoiceCoupons': zohoBooksSchemaEntry(
		'preview_invoice_coupons',
	),
	'invoices.unmapInvoicesFromSalesorders': zohoBooksSchemaEntry(
		'unmap_invoices_from_salesorders',
	),
	'invoices.getInvoiceDashboard': zohoBooksSchemaEntry('get_invoice_dashboard'),
	'invoices.getInvoiceByReference': zohoBooksSchemaEntry(
		'get_invoice_by_reference',
	),
	'invoices.getInvoiceCustomFields': zohoBooksSchemaEntry(
		'get_invoice_custom_fields',
	),
	'invoices.getInvoiceAdvancedTrackingDetails': zohoBooksSchemaEntry(
		'get_invoice_advanced_tracking_details',
	),
	'invoices.updateInvoiceAdvancedTrackingDetails': zohoBooksSchemaEntry(
		'update_invoice_advanced_tracking_details',
	),
	'invoices.printInvoiceDeliveryNote': zohoBooksSchemaEntry(
		'print_invoice_delivery_note',
	),
	'invoices.printInvoicePackingSlip': zohoBooksSchemaEntry(
		'print_invoice_packing_slip',
	),
	'invoices.getInvoiceQrCode': zohoBooksSchemaEntry('get_invoice_qr_code'),
	'invoices.getInvoiceSms': zohoBooksSchemaEntry('get_invoice_sms'),
	'invoices.sendInvoiceSms': zohoBooksSchemaEntry('send_invoice_sms'),
	'invoices.getInvoiceSignatureTemplate': zohoBooksSchemaEntry(
		'get_invoice_signature_template',
	),
	'invoices.addInvoiceDigitalSignature': zohoBooksSchemaEntry(
		'add_invoice_digital_signature',
	),
	'invoices.uploadInvoiceDigitalSignature': zohoBooksSchemaEntry(
		'upload_invoice_digital_signature',
	),
	'invoices.uploadInvoiceDocument': zohoBooksSchemaEntry(
		'upload_invoice_document',
	),
	'invoices.updateInvoiceCfdiStatus': zohoBooksSchemaEntry(
		'update_invoice_cfdi_status',
	),
	'invoices.cancelInvoice': zohoBooksSchemaEntry('cancel_invoice'),
	'invoices.markInvoiceReadyToPush': zohoBooksSchemaEntry(
		'mark_invoice_ready_to_push',
	),
	'invoices.applyInvoiceSubstatus': zohoBooksSchemaEntry(
		'apply_invoice_substatus',
	),
	'invoices.deleteInvoiceSubstatus': zohoBooksSchemaEntry(
		'delete_invoice_substatus',
	),
	'invoices.deleteInvoiceLineItem': zohoBooksSchemaEntry(
		'delete_invoice_line_item',
	),
	'invoices.scheduleInvoiceEmail': zohoBooksSchemaEntry(
		'schedule_invoice_email',
	),
	'invoices.cancelScheduledInvoiceEmail': zohoBooksSchemaEntry(
		'cancel_scheduled_invoice_email',
	),
	'invoices.forcePayInvoice': zohoBooksSchemaEntry('force_pay_invoice'),
	'invoices.mailInvoicePdf': zohoBooksSchemaEntry('mail_invoice_pdf'),
	'invoices.createInvoiceSynchronousOnlinePayment': zohoBooksSchemaEntry(
		'create_invoice_synchronous_online_payment',
	),
	'invoices.createInvoiceAsynchronousOnlinePayment': zohoBooksSchemaEntry(
		'create_invoice_asynchronous_online_payment',
	),
	'invoices.getInvoicePaymentQr': zohoBooksSchemaEntry(
		'get_invoice_payment_qr',
	),
	'invoices.getInvoicePaymentQrStatus': zohoBooksSchemaEntry(
		'get_invoice_payment_qr_status',
	),
	'invoices.sendInvoiceDunningNotifications': zohoBooksSchemaEntry(
		'send_invoice_dunning_notifications',
	),
	'invoices.sendInvoiceRetrySms': zohoBooksSchemaEntry(
		'send_invoice_retry_sms',
	),
	'invoices.getInvoiceMetadata': zohoBooksSchemaEntry('get_invoice_metadata'),
	'invoices.updateInvoiceMetadata': zohoBooksSchemaEntry(
		'update_invoice_metadata',
	),
	'invoices.listInvoicesEinvoice': zohoBooksSchemaEntry(
		'list_invoices_einvoice',
	),
	'invoices.pushInvoicesEinvoice': zohoBooksSchemaEntry(
		'push_invoices_einvoice',
	),
	'invoices.cancelInvoicesEinvoice': zohoBooksSchemaEntry(
		'cancel_invoices_einvoice',
	),
	'invoices.getInvoiceEinvoice': zohoBooksSchemaEntry('get_invoice_einvoice'),
	'invoices.pushInvoiceEinvoice': zohoBooksSchemaEntry('push_invoice_einvoice'),
	'invoices.cancelInvoiceEinvoice': zohoBooksSchemaEntry(
		'cancel_invoice_einvoice',
	),
	'invoices.fetchInvoiceEinvoice': zohoBooksSchemaEntry(
		'fetch_invoice_einvoice',
	),
	'invoices.deleteInvoiceEinvoiceStatus': zohoBooksSchemaEntry(
		'delete_invoice_einvoice_status',
	),
	'invoices.markInvoiceEinvoicePushed': zohoBooksSchemaEntry(
		'mark_invoice_einvoice_pushed',
	),
	'invoices.markInvoiceEinvoiceCancelled': zohoBooksSchemaEntry(
		'mark_invoice_einvoice_cancelled',
	),
	'invoices.recallInvoiceEinvoiceStatus': zohoBooksSchemaEntry(
		'recall_invoice_einvoice_status',
	),
	'invoices.updateInvoiceEinvoicePaymentStatus': zohoBooksSchemaEntry(
		'update_invoice_einvoice_payment_status',
	),
	'invoices.cancelEinvoiceInvoice': zohoBooksSchemaEntry(
		'cancel_einvoice_invoice',
	),
	'items.createItem': zohoBooksSchemaEntry('create_item'),
	'items.listItems': zohoBooksSchemaEntry('list_items'),
	'items.updateItemUsingCustomField': zohoBooksSchemaEntry(
		'update_item_using_custom_field',
	),
	'items.listItemDetails': zohoBooksSchemaEntry('list_item_details'),
	'items.updateItem': zohoBooksSchemaEntry('update_item'),
	'items.getItem': zohoBooksSchemaEntry('get_item'),
	'items.deleteItem': zohoBooksSchemaEntry('delete_item'),
	'items.updateCustomFieldsInItem': zohoBooksSchemaEntry(
		'update_custom_fields_in_item',
	),
	'items.markItemActive': zohoBooksSchemaEntry('mark_item_active'),
	'items.markItemInactive': zohoBooksSchemaEntry('mark_item_inactive'),
	'items.createItemMaster': zohoBooksSchemaEntry('create_item_master'),
	'items.listItemMasters': zohoBooksSchemaEntry('list_item_masters'),
	'items.getItemMaster': zohoBooksSchemaEntry('get_item_master'),
	'items.updateItemMaster': zohoBooksSchemaEntry('update_item_master'),
	'items.deleteItemMaster': zohoBooksSchemaEntry('delete_item_master'),
	'items.bulkMarkItemMastersActive': zohoBooksSchemaEntry(
		'bulk_mark_item_masters_active',
	),
	'items.bulkMarkItemMastersInactive': zohoBooksSchemaEntry(
		'bulk_mark_item_masters_inactive',
	),
	'items.markItemMasterAsActive': zohoBooksSchemaEntry(
		'mark_item_master_as_active',
	),
	'items.markItemMasterAsInactive': zohoBooksSchemaEntry(
		'mark_item_master_as_inactive',
	),
	'items.createItemVariant': zohoBooksSchemaEntry('create_item_variant'),
	'items.listItemVariants': zohoBooksSchemaEntry('list_item_variants'),
	'items.bulkDeleteItemVariants': zohoBooksSchemaEntry(
		'bulk_delete_item_variants',
	),
	'items.getItemVariant': zohoBooksSchemaEntry('get_item_variant'),
	'items.updateItemVariant': zohoBooksSchemaEntry('update_item_variant'),
	'items.deleteItemVariant': zohoBooksSchemaEntry('delete_item_variant'),
	'items.bulkMarkItemVariantsActive': zohoBooksSchemaEntry(
		'bulk_mark_item_variants_active',
	),
	'items.bulkMarkItemVariantsInactive': zohoBooksSchemaEntry(
		'bulk_mark_item_variants_inactive',
	),
	'items.markItemVariantAsActive': zohoBooksSchemaEntry(
		'mark_item_variant_as_active',
	),
	'items.markItemVariantAsInactive': zohoBooksSchemaEntry(
		'mark_item_variant_as_inactive',
	),
	'items.moveItemVariant': zohoBooksSchemaEntry('move_item_variant'),
	'items.ungroupItemVariants': zohoBooksSchemaEntry('ungroup_item_variants'),
	'journals.createJournal': zohoBooksSchemaEntry('create_journal'),
	'journals.listJournals': zohoBooksSchemaEntry('list_journals'),
	'journals.updateJournal': zohoBooksSchemaEntry('update_journal'),
	'journals.getJournal': zohoBooksSchemaEntry('get_journal'),
	'journals.deleteJournal': zohoBooksSchemaEntry('delete_journal'),
	'journals.markJournalPublished': zohoBooksSchemaEntry(
		'mark_journal_published',
	),
	'journals.addJournalAttachment': zohoBooksSchemaEntry(
		'add_journal_attachment',
	),
	'journals.addJournalComment': zohoBooksSchemaEntry('add_journal_comment'),
	'journals.deleteJournalComment': zohoBooksSchemaEntry(
		'delete_journal_comment',
	),
	'journals.reverseJournal': zohoBooksSchemaEntry('reverse_journal'),
	'journals.submitJournalForApproval': zohoBooksSchemaEntry(
		'submit_journal_for_approval',
	),
	'journals.approveJournal': zohoBooksSchemaEntry('approve_journal'),
	'journals.rejectJournal': zohoBooksSchemaEntry('reject_journal'),
	'journals.listJournalCredits': zohoBooksSchemaEntry('list_journal_credits'),
	'journals.applyJournalCreditsToInvoices': zohoBooksSchemaEntry(
		'apply_journal_credits_to_invoices',
	),
	'journals.applyJournalCreditsToBills': zohoBooksSchemaEntry(
		'apply_journal_credits_to_bills',
	),
	'journals.deleteJournalCreditsReceivables': zohoBooksSchemaEntry(
		'delete_journal_credits_receivables',
	),
	'journals.deleteJournalCreditsPayables': zohoBooksSchemaEntry(
		'delete_journal_credits_payables',
	),
	'journals.bulkSubmitJournals': zohoBooksSchemaEntry('bulk_submit_journals'),
	'journals.bulkApproveJournals': zohoBooksSchemaEntry('bulk_approve_journals'),
	'journals.bulkPublishJournals': zohoBooksSchemaEntry('bulk_publish_journals'),
	'journals.bulkDeleteJournals': zohoBooksSchemaEntry('bulk_delete_journals'),
	'journals.createRecurringJournal': zohoBooksSchemaEntry(
		'create_recurring_journal',
	),
	'journals.listRecurringJournals': zohoBooksSchemaEntry(
		'list_recurring_journals',
	),
	'journals.getRecurringJournal': zohoBooksSchemaEntry('get_recurring_journal'),
	'journals.updateRecurringJournal': zohoBooksSchemaEntry(
		'update_recurring_journal',
	),
	'journals.deleteRecurringJournal': zohoBooksSchemaEntry(
		'delete_recurring_journal',
	),
	'journals.resumeRecurringJournal': zohoBooksSchemaEntry(
		'resume_recurring_journal',
	),
	'journals.stopRecurringJournal': zohoBooksSchemaEntry(
		'stop_recurring_journal',
	),
	'journals.listChildJournals': zohoBooksSchemaEntry('list_child_journals'),
	'journals.getTransactionJournalView': zohoBooksSchemaEntry(
		'get_transaction_journal_view',
	),
	'locations.enableLocations': zohoBooksSchemaEntry('enable_locations'),
	'locations.createLocation': zohoBooksSchemaEntry('create_location'),
	'locations.listLocations': zohoBooksSchemaEntry('list_locations'),
	'locations.updateLocation': zohoBooksSchemaEntry('update_location'),
	'locations.deleteLocation': zohoBooksSchemaEntry('delete_location'),
	'locations.markLocationActive': zohoBooksSchemaEntry('mark_location_active'),
	'locations.markLocationInactive': zohoBooksSchemaEntry(
		'mark_location_inactive',
	),
	'locations.markLocationPrimary': zohoBooksSchemaEntry(
		'mark_location_primary',
	),
	'openingBalance.createOpeningBalance': zohoBooksSchemaEntry(
		'create_opening_balance',
	),
	'openingBalance.updateOpeningBalance': zohoBooksSchemaEntry(
		'update_opening_balance',
	),
	'openingBalance.getOpeningBalance': zohoBooksSchemaEntry(
		'get_opening_balance',
	),
	'openingBalance.deleteOpeningBalance': zohoBooksSchemaEntry(
		'delete_opening_balance',
	),
	'openingBalance.listOpeningBalanceDetails': zohoBooksSchemaEntry(
		'list_opening_balance_details',
	),
	'openingBalance.listOpeningBalanceTransactions': zohoBooksSchemaEntry(
		'list_opening_balance_transactions',
	),
	'openingBalance.writeoffOpeningBalance': zohoBooksSchemaEntry(
		'writeoff_opening_balance',
	),
	'openingBalance.cancelWriteoffOpeningBalance': zohoBooksSchemaEntry(
		'cancel_writeoff_opening_balance',
	),
	'organizations.createOrganization': zohoBooksSchemaEntry(
		'create_organization',
	),
	'organizations.listOrganizations': zohoBooksSchemaEntry('list_organizations'),
	'organizations.updateOrganization': zohoBooksSchemaEntry(
		'update_organization',
	),
	'organizations.getOrganization': zohoBooksSchemaEntry('get_organization'),
	'organizations.listOrganizationsForUser': zohoBooksSchemaEntry(
		'list_organizations_for_user',
	),
	'organizations.getOrganizationAddress': zohoBooksSchemaEntry(
		'get_organization_address',
	),
	'organizations.createOrganizationAddress': zohoBooksSchemaEntry(
		'create_organization_address',
	),
	'organizations.updateOrganizationAddress': zohoBooksSchemaEntry(
		'update_organization_address',
	),
	'organizations.deleteOrganizationAddress': zohoBooksSchemaEntry(
		'delete_organization_address',
	),
	'organizations.copyOrganizationSettings': zohoBooksSchemaEntry(
		'copy_organization_settings',
	),
	'organizations.downgradeOrganizationToInvoice': zohoBooksSchemaEntry(
		'downgrade_organization_to_invoice',
	),
	'organizations.upgradeOrganizationToBooks': zohoBooksSchemaEntry(
		'upgrade_organization_to_books',
	),
	'organizations.markOrganizationInactive': zohoBooksSchemaEntry(
		'mark_organization_inactive',
	),
	'pricelists.createPricebook': zohoBooksSchemaEntry('create_pricebook'),
	'pricelists.listPricebooks': zohoBooksSchemaEntry('list_pricebooks'),
	'pricelists.updatePricebook': zohoBooksSchemaEntry('update_pricebook'),
	'pricelists.deletePricebook': zohoBooksSchemaEntry('delete_pricebook'),
	'pricelists.markPricebookActive': zohoBooksSchemaEntry(
		'mark_pricebook_active',
	),
	'pricelists.markPricebookInactive': zohoBooksSchemaEntry(
		'mark_pricebook_inactive',
	),
	'projects.createProject': zohoBooksSchemaEntry('create_project'),
	'projects.listProjects': zohoBooksSchemaEntry('list_projects'),
	'projects.updateProjectsUsingCustomField': zohoBooksSchemaEntry(
		'update_projects_using_custom_field',
	),
	'projects.updateProject': zohoBooksSchemaEntry('update_project'),
	'projects.getProject': zohoBooksSchemaEntry('get_project'),
	'projects.deleteProject': zohoBooksSchemaEntry('delete_project'),
	'projects.markProjectActive': zohoBooksSchemaEntry('mark_project_active'),
	'projects.markProjectInactive': zohoBooksSchemaEntry('mark_project_inactive'),
	'projects.cloneProject': zohoBooksSchemaEntry('clone_project'),
	'projects.addProjectUser': zohoBooksSchemaEntry('add_project_user'),
	'projects.listProjectUsers': zohoBooksSchemaEntry('list_project_users'),
	'projects.inviteProjectUser': zohoBooksSchemaEntry('invite_project_user'),
	'projects.updateProjectUser': zohoBooksSchemaEntry('update_project_user'),
	'projects.getProjectUser': zohoBooksSchemaEntry('get_project_user'),
	'projects.deleteProjectUser': zohoBooksSchemaEntry('delete_project_user'),
	'projects.addProjectComment': zohoBooksSchemaEntry('add_project_comment'),
	'projects.listProjectComments': zohoBooksSchemaEntry('list_project_comments'),
	'projects.deleteProjectComment': zohoBooksSchemaEntry(
		'delete_project_comment',
	),
	'projects.listProjectInvoices': zohoBooksSchemaEntry('list_project_invoices'),
	'projects.addProjectTask': zohoBooksSchemaEntry('add_project_task'),
	'projects.listProjectTasks': zohoBooksSchemaEntry('list_project_tasks'),
	'projects.updateProjectTask': zohoBooksSchemaEntry('update_project_task'),
	'projects.getProjectTask': zohoBooksSchemaEntry('get_project_task'),
	'projects.deleteProjectTask': zohoBooksSchemaEntry('delete_project_task'),
	'purchaseOrder.createPurchaseOrder': zohoBooksSchemaEntry(
		'create_purchase_order',
	),
	'purchaseOrder.listPurchaseOrders': zohoBooksSchemaEntry(
		'list_purchase_orders',
	),
	'purchaseOrder.updatePurchaseOrderUsingCustomField': zohoBooksSchemaEntry(
		'update_purchase_order_using_custom_field',
	),
	'purchaseOrder.updatePurchaseOrder': zohoBooksSchemaEntry(
		'update_purchase_order',
	),
	'purchaseOrder.getPurchaseOrder': zohoBooksSchemaEntry('get_purchase_order'),
	'purchaseOrder.deletePurchaseOrder': zohoBooksSchemaEntry(
		'delete_purchase_order',
	),
	'purchaseOrder.updateCustomFieldsInPurchaseOrder': zohoBooksSchemaEntry(
		'update_custom_fields_in_purchase_order',
	),
	'purchaseOrder.markPurchaseOrderOpen': zohoBooksSchemaEntry(
		'mark_purchase_order_open',
	),
	'purchaseOrder.markPurchaseOrderBilled': zohoBooksSchemaEntry(
		'mark_purchase_order_billed',
	),
	'purchaseOrder.markPurchaseOrderCancelled': zohoBooksSchemaEntry(
		'mark_purchase_order_cancelled',
	),
	'purchaseOrder.submitPurchaseOrder': zohoBooksSchemaEntry(
		'submit_purchase_order',
	),
	'purchaseOrder.approvePurchaseOrder': zohoBooksSchemaEntry(
		'approve_purchase_order',
	),
	'purchaseOrder.emailPurchaseOrder': zohoBooksSchemaEntry(
		'email_purchase_order',
	),
	'purchaseOrder.getPurchaseOrderEmail': zohoBooksSchemaEntry(
		'get_purchase_order_email',
	),
	'purchaseOrder.updatePurchaseOrderBillingAddress': zohoBooksSchemaEntry(
		'update_purchase_order_billing_address',
	),
	'purchaseOrder.listPurchaseOrderTemplates': zohoBooksSchemaEntry(
		'list_purchase_order_templates',
	),
	'purchaseOrder.updatePurchaseOrderTemplate': zohoBooksSchemaEntry(
		'update_purchase_order_template',
	),
	'purchaseOrder.getPurchaseOrderAttachment': zohoBooksSchemaEntry(
		'get_purchase_order_attachment',
	),
	'purchaseOrder.addPurchaseOrderAttachment': zohoBooksSchemaEntry(
		'add_purchase_order_attachment',
	),
	'purchaseOrder.updatePurchaseOrderAttachment': zohoBooksSchemaEntry(
		'update_purchase_order_attachment',
	),
	'purchaseOrder.deletePurchaseOrderAttachment': zohoBooksSchemaEntry(
		'delete_purchase_order_attachment',
	),
	'purchaseOrder.listPurchaseOrderComments': zohoBooksSchemaEntry(
		'list_purchase_order_comments',
	),
	'purchaseOrder.addPurchaseOrderComment': zohoBooksSchemaEntry(
		'add_purchase_order_comment',
	),
	'purchaseOrder.updatePurchaseOrderComment': zohoBooksSchemaEntry(
		'update_purchase_order_comment',
	),
	'purchaseOrder.deletePurchaseOrderComment': zohoBooksSchemaEntry(
		'delete_purchase_order_comment',
	),
	'purchaseOrder.rejectPurchaseOrders': zohoBooksSchemaEntry(
		'reject_purchase_orders',
	),
	'purchaseReturns.createPurchaseReturn': zohoBooksSchemaEntry(
		'create_purchase_return',
	),
	'purchaseReturns.listPurchaseReturns': zohoBooksSchemaEntry(
		'list_purchase_returns',
	),
	'purchaseReturns.getPurchaseReturn': zohoBooksSchemaEntry(
		'get_purchase_return',
	),
	'purchaseReturns.updatePurchaseReturn': zohoBooksSchemaEntry(
		'update_purchase_return',
	),
	'purchaseReturns.deletePurchaseReturn': zohoBooksSchemaEntry(
		'delete_purchase_return',
	),
	'purchaseReturns.confirmPurchaseReturn': zohoBooksSchemaEntry(
		'confirm_purchase_return',
	),
	'purchaseReturns.voidPurchaseReturn': zohoBooksSchemaEntry(
		'void_purchase_return',
	),
	'purchaseReturns.fulfillPurchaseReturn': zohoBooksSchemaEntry(
		'fulfill_purchase_return',
	),
	'purchaseReturns.unfulfillPurchaseReturn': zohoBooksSchemaEntry(
		'unfulfill_purchase_return',
	),
	'purchaseReturns.emailPurchaseReturn': zohoBooksSchemaEntry(
		'email_purchase_return',
	),
	'purchaseReturns.addAttachmentToPurchaseReturn': zohoBooksSchemaEntry(
		'add_attachment_to_purchase_return',
	),
	'purchaseReturns.closePurchaseReturn': zohoBooksSchemaEntry(
		'close_purchase_return',
	),
	'purchaseReturns.reopenPurchaseReturn': zohoBooksSchemaEntry(
		'reopen_purchase_return',
	),
	'purchaseReturns.updatePurchaseReturnShippingAddress': zohoBooksSchemaEntry(
		'update_purchase_return_shipping_address',
	),
	'purchaseReturns.updatePurchaseReturnBillingAddress': zohoBooksSchemaEntry(
		'update_purchase_return_billing_address',
	),
	'purchaseReturns.deletePurchaseReturnAttachment': zohoBooksSchemaEntry(
		'delete_purchase_return_attachment',
	),
	'recurringBills.createRecurringBill': zohoBooksSchemaEntry(
		'create_recurring_bill',
	),
	'recurringBills.listRecurringBills': zohoBooksSchemaEntry(
		'list_recurring_bills',
	),
	'recurringBills.updateRecurringBillUsingCustomField': zohoBooksSchemaEntry(
		'update_recurring_bill_using_custom_field',
	),
	'recurringBills.updateRecurringBill': zohoBooksSchemaEntry(
		'update_recurring_bill',
	),
	'recurringBills.getRecurringBill': zohoBooksSchemaEntry('get_recurring_bill'),
	'recurringBills.deleteRecurringBill': zohoBooksSchemaEntry(
		'delete_recurring_bill',
	),
	'recurringBills.stopRecurringBill': zohoBooksSchemaEntry(
		'stop_recurring_bill',
	),
	'recurringBills.resumeRecurringBill': zohoBooksSchemaEntry(
		'resume_recurring_bill',
	),
	'recurringBills.listRecurringBillHistory': zohoBooksSchemaEntry(
		'list_recurring_bill_history',
	),
	'recurringExpenses.createRecurringExpense': zohoBooksSchemaEntry(
		'create_recurring_expense',
	),
	'recurringExpenses.listRecurringExpenses': zohoBooksSchemaEntry(
		'list_recurring_expenses',
	),
	'recurringExpenses.updateRecurringExpenseUsingCustomField':
		zohoBooksSchemaEntry('update_recurring_expense_using_custom_field'),
	'recurringExpenses.updateRecurringExpense': zohoBooksSchemaEntry(
		'update_recurring_expense',
	),
	'recurringExpenses.getRecurringExpense': zohoBooksSchemaEntry(
		'get_recurring_expense',
	),
	'recurringExpenses.deleteRecurringExpense': zohoBooksSchemaEntry(
		'delete_recurring_expense',
	),
	'recurringExpenses.stopRecurringExpense': zohoBooksSchemaEntry(
		'stop_recurring_expense',
	),
	'recurringExpenses.resumeRecurringExpense': zohoBooksSchemaEntry(
		'resume_recurring_expense',
	),
	'recurringExpenses.listChildExpensesOfRecurringExpense': zohoBooksSchemaEntry(
		'list_child_expenses_of_recurring_expense',
	),
	'recurringExpenses.listRecurringExpenseHistory': zohoBooksSchemaEntry(
		'list_recurring_expense_history',
	),
	'recurringInvoices.createRecurringInvoice': zohoBooksSchemaEntry(
		'create_recurring_invoice',
	),
	'recurringInvoices.listRecurringInvoices': zohoBooksSchemaEntry(
		'list_recurring_invoices',
	),
	'recurringInvoices.updateRecurringInvoiceUsingCustomField':
		zohoBooksSchemaEntry('update_recurring_invoice_using_custom_field'),
	'recurringInvoices.updateRecurringInvoice': zohoBooksSchemaEntry(
		'update_recurring_invoice',
	),
	'recurringInvoices.getRecurringInvoice': zohoBooksSchemaEntry(
		'get_recurring_invoice',
	),
	'recurringInvoices.deleteRecurringInvoice': zohoBooksSchemaEntry(
		'delete_recurring_invoice',
	),
	'recurringInvoices.stopRecurringInvoice': zohoBooksSchemaEntry(
		'stop_recurring_invoice',
	),
	'recurringInvoices.resumeRecurringInvoice': zohoBooksSchemaEntry(
		'resume_recurring_invoice',
	),
	'recurringInvoices.updateRecurringInvoiceTemplate': zohoBooksSchemaEntry(
		'update_recurring_invoice_template',
	),
	'recurringInvoices.listRecurringInvoiceHistory': zohoBooksSchemaEntry(
		'list_recurring_invoice_history',
	),
	'recurringInvoices.resumeRecurringInvoices': zohoBooksSchemaEntry(
		'resume_recurring_invoices',
	),
	'recurringInvoices.stopRecurringInvoices': zohoBooksSchemaEntry(
		'stop_recurring_invoices',
	),
	'recurringInvoices.getRecurringInvoiceDashboard': zohoBooksSchemaEntry(
		'get_recurring_invoice_dashboard',
	),
	'recurringInvoices.listRecurringInvoiceChildInvoices': zohoBooksSchemaEntry(
		'list_recurring_invoice_child_invoices',
	),
	'recurringInvoices.enableRecurringInvoiceAutobill': zohoBooksSchemaEntry(
		'enable_recurring_invoice_autobill',
	),
	'recurringInvoices.disableRecurringInvoiceAutobill': zohoBooksSchemaEntry(
		'disable_recurring_invoice_autobill',
	),
	'recurringInvoices.deleteRecurringInvoiceBankAccount': zohoBooksSchemaEntry(
		'delete_recurring_invoice_bank_account',
	),
	'recurringInvoices.deleteRecurringInvoiceCard': zohoBooksSchemaEntry(
		'delete_recurring_invoice_card',
	),
	'recurringInvoices.associateRecurringInvoiceBankAccount':
		zohoBooksSchemaEntry('associate_recurring_invoice_bank_account'),
	'recurringInvoices.associateRecurringInvoiceCard': zohoBooksSchemaEntry(
		'associate_recurring_invoice_card',
	),
	'registers.listRegisterTransactions': zohoBooksSchemaEntry(
		'list_register_transactions',
	),
	'registers.listRegisterBulkActionHistory': zohoBooksSchemaEntry(
		'list_register_bulk_action_history',
	),
	'registers.getRegisterBulkActionHistory': zohoBooksSchemaEntry(
		'get_register_bulk_action_history',
	),
	'registers.getRegisterBulkUpdateEditpage': zohoBooksSchemaEntry(
		'get_register_bulk_update_editpage',
	),
	'registers.getRegisterBudgetVsActuals': zohoBooksSchemaEntry(
		'get_register_budget_vs_actuals',
	),
	'registers.bulkUpdateRegisterTransactions': zohoBooksSchemaEntry(
		'bulk_update_register_transactions',
	),
	'registers.bulkDeleteRegisterTransactions': zohoBooksSchemaEntry(
		'bulk_delete_register_transactions',
	),
	'reportingTags.getTags': zohoBooksSchemaEntry('get_tags'),
	'reportingTags.createTag': zohoBooksSchemaEntry('create_tag'),
	'reportingTags.markDefaultOption': zohoBooksSchemaEntry(
		'mark_default_option',
	),
	'reportingTags.updateTag': zohoBooksSchemaEntry('update_tag'),
	'reportingTags.deleteTag': zohoBooksSchemaEntry('delete_tag'),
	'reportingTags.updateTagOptions': zohoBooksSchemaEntry('update_tag_options'),
	'reportingTags.updateTagCriteria': zohoBooksSchemaEntry(
		'update_tag_criteria',
	),
	'reportingTags.activeTag': zohoBooksSchemaEntry('active_tag'),
	'reportingTags.inactiveTag': zohoBooksSchemaEntry('inactive_tag'),
	'reportingTags.activeTagOption': zohoBooksSchemaEntry('active_tag_option'),
	'reportingTags.inactiveTagOption': zohoBooksSchemaEntry(
		'inactive_tag_option',
	),
	'reportingTags.getAllTagOptions': zohoBooksSchemaEntry('get_all_tag_options'),
	'reportingTags.reorderTags': zohoBooksSchemaEntry('reorder_tags'),
	'retainerInvoices.createRetainerInvoice': zohoBooksSchemaEntry(
		'create_retainer_invoice',
	),
	'retainerInvoices.listRetainerInvoices': zohoBooksSchemaEntry(
		'list_retainer_invoices',
	),
	'retainerInvoices.updateRetainerInvoice': zohoBooksSchemaEntry(
		'update_retainer_invoice',
	),
	'retainerInvoices.getRetainerInvoice': zohoBooksSchemaEntry(
		'get_retainer_invoice',
	),
	'retainerInvoices.deleteRetainerInvoice': zohoBooksSchemaEntry(
		'delete_retainer_invoice',
	),
	'retainerInvoices.markRetainerInvoiceSent': zohoBooksSchemaEntry(
		'mark_retainer_invoice_sent',
	),
	'retainerInvoices.updateRetainerInvoiceTemplate': zohoBooksSchemaEntry(
		'update_retainer_invoice_template',
	),
	'retainerInvoices.markRetainerInvoiceVoid': zohoBooksSchemaEntry(
		'mark_retainer_invoice_void',
	),
	'retainerInvoices.markRetainerInvoiceDraft': zohoBooksSchemaEntry(
		'mark_retainer_invoice_draft',
	),
	'retainerInvoices.submitRetainerInvoice': zohoBooksSchemaEntry(
		'submit_retainer_invoice',
	),
	'retainerInvoices.approveRetainerInvoice': zohoBooksSchemaEntry(
		'approve_retainer_invoice',
	),
	'retainerInvoices.emailRetainerInvoice': zohoBooksSchemaEntry(
		'email_retainer_invoice',
	),
	'retainerInvoices.getRetainerInvoiceEmail': zohoBooksSchemaEntry(
		'get_retainer_invoice_email',
	),
	'retainerInvoices.updateRetainerInvoiceBillingAddress': zohoBooksSchemaEntry(
		'update_retainer_invoice_billing_address',
	),
	'retainerInvoices.listRetainerInvoiceTemplates': zohoBooksSchemaEntry(
		'list_retainer_invoice_templates',
	),
	'retainerInvoices.getRetainerInvoiceAttachment': zohoBooksSchemaEntry(
		'get_retainer_invoice_attachment',
	),
	'retainerInvoices.addRetainerInvoiceAttachment': zohoBooksSchemaEntry(
		'add_retainer_invoice_attachment',
	),
	'retainerInvoices.deleteRetainerInvoiceAttachment': zohoBooksSchemaEntry(
		'delete_retainer_invoice_attachment',
	),
	'retainerInvoices.listRetainerInvoice': zohoBooksSchemaEntry(
		'list_retainer_invoice',
	),
	'retainerInvoices.addRetainerInvoiceComment': zohoBooksSchemaEntry(
		'add_retainer_invoice_comment',
	),
	'retainerInvoices.deleteRetainerInvoiceComment': zohoBooksSchemaEntry(
		'delete_retainer_invoice_comment',
	),
	'retainerInvoices.updateRetainerInvoiceComment': zohoBooksSchemaEntry(
		'update_retainer_invoice_comment',
	),
	'retainerInvoices.applyRetainerPaymentsToInvoices': zohoBooksSchemaEntry(
		'apply_retainer_payments_to_invoices',
	),
	'retainerInvoices.deleteAppliedRetainerPayment': zohoBooksSchemaEntry(
		'delete_applied_retainer_payment',
	),
	'retainerInvoices.createRetainerInvoiceAsyncOnlinePayment':
		zohoBooksSchemaEntry('create_retainer_invoice_async_online_payment'),
	'salesOrder.createSalesOrder': zohoBooksSchemaEntry('create_sales_order'),
	'salesOrder.listSalesOrders': zohoBooksSchemaEntry('list_sales_orders'),
	'salesOrder.updateSalesOrderUsingCustomField': zohoBooksSchemaEntry(
		'update_sales_order_using_custom_field',
	),
	'salesOrder.updateSalesOrder': zohoBooksSchemaEntry('update_sales_order'),
	'salesOrder.getSalesOrder': zohoBooksSchemaEntry('get_sales_order'),
	'salesOrder.deleteSalesOrder': zohoBooksSchemaEntry('delete_sales_order'),
	'salesOrder.updateSalesorderCustomfields': zohoBooksSchemaEntry(
		'update_salesorder_customfields',
	),
	'salesOrder.markSalesOrderAsOpen': zohoBooksSchemaEntry(
		'mark_sales_order_as_open',
	),
	'salesOrder.markSalesOrderAsVoid': zohoBooksSchemaEntry(
		'mark_sales_order_as_void',
	),
	'salesOrder.updateSalesOrderSubStatus': zohoBooksSchemaEntry(
		'update_sales_order_sub_status',
	),
	'salesOrder.emailSalesOrder': zohoBooksSchemaEntry('email_sales_order'),
	'salesOrder.getSalesOrderEmail': zohoBooksSchemaEntry(
		'get_sales_order_email',
	),
	'salesOrder.submitSalesOrder': zohoBooksSchemaEntry('submit_sales_order'),
	'salesOrder.approveSalesOrder': zohoBooksSchemaEntry('approve_sales_order'),
	'salesOrder.bulkExportSalesOrdersAsPdf': zohoBooksSchemaEntry(
		'bulk_export_sales_orders_as_pdf',
	),
	'salesOrder.bulkPrintSalesOrders': zohoBooksSchemaEntry(
		'bulk_print_sales_orders',
	),
	'salesOrder.updateSalesOrderBillingAddress': zohoBooksSchemaEntry(
		'update_sales_order_billing_address',
	),
	'salesOrder.updateSalesOrderShippingAddress': zohoBooksSchemaEntry(
		'update_sales_order_shipping_address',
	),
	'salesOrder.listSalesOrderTemplates': zohoBooksSchemaEntry(
		'list_sales_order_templates',
	),
	'salesOrder.updateSalesOrderTemplate': zohoBooksSchemaEntry(
		'update_sales_order_template',
	),
	'salesOrder.getSalesOrderAttachment': zohoBooksSchemaEntry(
		'get_sales_order_attachment',
	),
	'salesOrder.addSalesOrderAttachment': zohoBooksSchemaEntry(
		'add_sales_order_attachment',
	),
	'salesOrder.updateSalesOrderAttachmentPreference': zohoBooksSchemaEntry(
		'update_sales_order_attachment_preference',
	),
	'salesOrder.deleteSalesOrderAttachment': zohoBooksSchemaEntry(
		'delete_sales_order_attachment',
	),
	'salesOrder.listSalesOrderComments': zohoBooksSchemaEntry(
		'list_sales_order_comments',
	),
	'salesOrder.addSalesOrderComment': zohoBooksSchemaEntry(
		'add_sales_order_comment',
	),
	'salesOrder.updateSalesOrderComment': zohoBooksSchemaEntry(
		'update_sales_order_comment',
	),
	'salesOrder.deleteSalesOrderComment': zohoBooksSchemaEntry(
		'delete_sales_order_comment',
	),
	'salesReceipt.createSalesReceipt': zohoBooksSchemaEntry(
		'create_sales_receipt',
	),
	'salesReceipt.listSalesReceipts': zohoBooksSchemaEntry('list_sales_receipts'),
	'salesReceipt.updateSalesReceipt': zohoBooksSchemaEntry(
		'update_sales_receipt',
	),
	'salesReceipt.getSalesReceipt': zohoBooksSchemaEntry('get_sales_receipt'),
	'salesReceipt.deleteSalesReceipt': zohoBooksSchemaEntry(
		'delete_sales_receipt',
	),
	'salesReceipt.emailSalesReceipt': zohoBooksSchemaEntry('email_sales_receipt'),
	'selfBilledInvoices.createSelfBilledInvoice': zohoBooksSchemaEntry(
		'create_self_billed_invoice',
	),
	'selfBilledInvoices.listSelfBilledInvoices': zohoBooksSchemaEntry(
		'list_self_billed_invoices',
	),
	'selfBilledInvoices.updateSelfBilledInvoice': zohoBooksSchemaEntry(
		'update_self_billed_invoice',
	),
	'selfBilledInvoices.getSelfBilledInvoice': zohoBooksSchemaEntry(
		'get_self_billed_invoice',
	),
	'selfBilledInvoices.deleteSelfBilledInvoice': zohoBooksSchemaEntry(
		'delete_self_billed_invoice',
	),
	'selfBilledInvoices.pushSelfBilledInvoiceEinvoice': zohoBooksSchemaEntry(
		'push_self_billed_invoice_einvoice',
	),
	'tasks.addTask': zohoBooksSchemaEntry('add_task'),
	'tasks.listTasks': zohoBooksSchemaEntry('list_tasks'),
	'tasks.updateTasks': zohoBooksSchemaEntry('update_tasks'),
	'tasks.deleteTasks': zohoBooksSchemaEntry('delete_tasks'),
	'tasks.getTask': zohoBooksSchemaEntry('get_task'),
	'tasks.updateATask': zohoBooksSchemaEntry('update_a_task'),
	'tasks.deleteTask': zohoBooksSchemaEntry('delete_task'),
	'tasks.updatePercentageTask': zohoBooksSchemaEntry('update_percentage_task'),
	'tasks.markTaskAsOpen': zohoBooksSchemaEntry('mark_task_as_open'),
	'tasks.markTaskAsOngoing': zohoBooksSchemaEntry('mark_task_as_ongoing'),
	'tasks.markTaskAsCompleted': zohoBooksSchemaEntry('mark_task_as_completed'),
	'tasks.addTaskComment': zohoBooksSchemaEntry('add_task_comment'),
	'tasks.listTaskComments': zohoBooksSchemaEntry('list_task_comments'),
	'tasks.deleteTaskComment': zohoBooksSchemaEntry('delete_task_comment'),
	'tasks.addTaskAttachment': zohoBooksSchemaEntry('add_task_attachment'),
	'tasks.getTaskDocument': zohoBooksSchemaEntry('get_task_document'),
	'tasks.deleteTaskDocument': zohoBooksSchemaEntry('delete_task_document'),
	'taxes.createTax': zohoBooksSchemaEntry('create_tax'),
	'taxes.listTaxes': zohoBooksSchemaEntry('list_taxes'),
	'taxes.updateTax': zohoBooksSchemaEntry('update_tax'),
	'taxes.getTax': zohoBooksSchemaEntry('get_tax'),
	'taxes.deleteTax': zohoBooksSchemaEntry('delete_tax'),
	'taxes.getTaxGroup': zohoBooksSchemaEntry('get_tax_group'),
	'taxes.updateTaxGroup': zohoBooksSchemaEntry('update_tax_group'),
	'taxes.deleteTaxGroup': zohoBooksSchemaEntry('delete_tax_group'),
	'taxes.createTaxGroup': zohoBooksSchemaEntry('create_tax_group'),
	'taxes.createTaxAuthority': zohoBooksSchemaEntry('create_tax_authority'),
	'taxes.listTaxAuthorities': zohoBooksSchemaEntry('list_tax_authorities'),
	'taxes.updateTaxAuthority': zohoBooksSchemaEntry('update_tax_authority'),
	'taxes.getTaxAuthority': zohoBooksSchemaEntry('get_tax_authority'),
	'taxes.deleteTaxAuthority': zohoBooksSchemaEntry('delete_tax_authority'),
	'taxes.createTaxExemption': zohoBooksSchemaEntry('create_tax_exemption'),
	'taxes.listTaxExemptions': zohoBooksSchemaEntry('list_tax_exemptions'),
	'taxes.updateTaxExemption': zohoBooksSchemaEntry('update_tax_exemption'),
	'taxes.getTaxExemption': zohoBooksSchemaEntry('get_tax_exemption'),
	'taxes.deleteTaxExemption': zohoBooksSchemaEntry('delete_tax_exemption'),
	'timeEntries.createTimeEntries': zohoBooksSchemaEntry('create_time_entries'),
	'timeEntries.listTimeEntries': zohoBooksSchemaEntry('list_time_entries'),
	'timeEntries.deleteTimeEntries': zohoBooksSchemaEntry('delete_time_entries'),
	'timeEntries.updateTimeEntry': zohoBooksSchemaEntry('update_time_entry'),
	'timeEntries.getTimeEntry': zohoBooksSchemaEntry('get_time_entry'),
	'timeEntries.deleteTimeEntry': zohoBooksSchemaEntry('delete_time_entry'),
	'timeEntries.startEntryTimer': zohoBooksSchemaEntry('start_entry_timer'),
	'timeEntries.stopEntryTimer': zohoBooksSchemaEntry('stop_entry_timer'),
	'timeEntries.getRunningTimer': zohoBooksSchemaEntry('get_running_timer'),
	'transactionLocking.getTransactionLock': zohoBooksSchemaEntry(
		'get_transaction_lock',
	),
	'transactionLocking.updateTransactionLock': zohoBooksSchemaEntry(
		'update_transaction_lock',
	),
	'transactionLocking.deleteTransactionLock': zohoBooksSchemaEntry(
		'delete_transaction_lock',
	),
	'transactionLocking.getAccountingPeriodTransactionLock': zohoBooksSchemaEntry(
		'get_accounting_period_transaction_lock',
	),
	'transactionLocking.listTransactionLocks': zohoBooksSchemaEntry(
		'list_transaction_locks',
	),
	'transactionLocking.updatePartialUnlock': zohoBooksSchemaEntry(
		'update_partial_unlock',
	),
	'users.createUser': zohoBooksSchemaEntry('create_user'),
	'users.listUsers': zohoBooksSchemaEntry('list_users'),
	'users.updateUser': zohoBooksSchemaEntry('update_user'),
	'users.getUser': zohoBooksSchemaEntry('get_user'),
	'users.deleteUser': zohoBooksSchemaEntry('delete_user'),
	'users.getCurrentUser': zohoBooksSchemaEntry('get_current_user'),
	'users.inviteUser': zohoBooksSchemaEntry('invite_user'),
	'users.markUserActive': zohoBooksSchemaEntry('mark_user_active'),
	'users.markUserInactive': zohoBooksSchemaEntry('mark_user_inactive'),
	'vendorCredits.createVendorCredit': zohoBooksSchemaEntry(
		'create_vendor_credit',
	),
	'vendorCredits.listVendorCredits': zohoBooksSchemaEntry(
		'list_vendor_credits',
	),
	'vendorCredits.updateVendorCredit': zohoBooksSchemaEntry(
		'update_vendor_credit',
	),
	'vendorCredits.getVendorCredit': zohoBooksSchemaEntry('get_vendor_credit'),
	'vendorCredits.deleteVendorCredit': zohoBooksSchemaEntry(
		'delete_vendor_credit',
	),
	'vendorCredits.markVendorCreditOpen': zohoBooksSchemaEntry(
		'mark_vendor_credit_open',
	),
	'vendorCredits.markVendorCreditVoid': zohoBooksSchemaEntry(
		'mark_vendor_credit_void',
	),
	'vendorCredits.submitVendorCredit': zohoBooksSchemaEntry(
		'submit_vendor_credit',
	),
	'vendorCredits.approveVendorCredit': zohoBooksSchemaEntry(
		'approve_vendor_credit',
	),
	'vendorCredits.listBillsCredited': zohoBooksSchemaEntry(
		'list_bills_credited',
	),
	'vendorCredits.applyCreditsToABill': zohoBooksSchemaEntry(
		'apply_credits_to_a_bill',
	),
	'vendorCredits.deleteVendorCreditBill': zohoBooksSchemaEntry(
		'delete_vendor_credit_bill',
	),
	'vendorCredits.refundVendorCredit': zohoBooksSchemaEntry(
		'refund_vendor_credit',
	),
	'vendorCredits.listVendorCreditRefundsOfAVendorCredit': zohoBooksSchemaEntry(
		'list_vendor_credit_refunds_of_a_vendor_credit',
	),
	'vendorCredits.updateVendorCreditRefund': zohoBooksSchemaEntry(
		'update_vendor_credit_refund',
	),
	'vendorCredits.getVendorCreditRefund': zohoBooksSchemaEntry(
		'get_vendor_credit_refund',
	),
	'vendorCredits.deleteVendorCreditRefund': zohoBooksSchemaEntry(
		'delete_vendor_credit_refund',
	),
	'vendorCredits.listVendorCreditRefundsOfAllVendorCredits':
		zohoBooksSchemaEntry('list_vendor_credit_refunds_of_all_vendor_credits'),
	'vendorCredits.addVendorCreditComment': zohoBooksSchemaEntry(
		'add_vendor_credit_comment',
	),
	'vendorCredits.listVendorCreditComments': zohoBooksSchemaEntry(
		'list_vendor_credit_comments',
	),
	'vendorCredits.deleteVendorCreditComment': zohoBooksSchemaEntry(
		'delete_vendor_credit_comment',
	),
	'vendorPayments.createVendorPayment': zohoBooksSchemaEntry(
		'create_vendor_payment',
	),
	'vendorPayments.listVendorPayments': zohoBooksSchemaEntry(
		'list_vendor_payments',
	),
	'vendorPayments.updateVendorPaymentUsingCustomField': zohoBooksSchemaEntry(
		'update_vendor_payment_using_custom_field',
	),
	'vendorPayments.bulkDeleteVendorPayments': zohoBooksSchemaEntry(
		'bulk_delete_vendor_payments',
	),
	'vendorPayments.updateVendorPayment': zohoBooksSchemaEntry(
		'update_vendor_payment',
	),
	'vendorPayments.getVendorPayment': zohoBooksSchemaEntry('get_vendor_payment'),
	'vendorPayments.deleteVendorPayment': zohoBooksSchemaEntry(
		'delete_vendor_payment',
	),
	'vendorPayments.listVendorPaymentRefunds': zohoBooksSchemaEntry(
		'list_vendor_payment_refunds',
	),
	'vendorPayments.refundExcessVendorPayment': zohoBooksSchemaEntry(
		'refund_excess_vendor_payment',
	),
	'vendorPayments.getVendorPaymentRefund': zohoBooksSchemaEntry(
		'get_vendor_payment_refund',
	),
	'vendorPayments.updateVendorPaymentRefund': zohoBooksSchemaEntry(
		'update_vendor_payment_refund',
	),
	'vendorPayments.deleteVendorPaymentRefund': zohoBooksSchemaEntry(
		'delete_vendor_payment_refund',
	),
	'vendorPayments.emailVendorPayment': zohoBooksSchemaEntry(
		'email_vendor_payment',
	),
	'vendorPayments.getVendorPaymentEmailContent': zohoBooksSchemaEntry(
		'get_vendor_payment_email_content',
	),
} satisfies RequiredPluginEndpointSchemas<ZohoBooksEndpointKeyTree>;

export const zohoBooksEndpointMeta = {
	'bankAccounts.createBankAccount': {
		riskLevel: 'write',
		description: 'Create a bank account. Zoho Books API v3.',
	},
	'bankAccounts.listBankAccounts': {
		riskLevel: 'read',
		description: 'List view of accounts. Zoho Books API v3.',
	},
	'bankAccounts.updateBankAccount': {
		riskLevel: 'write',
		description: 'Update bank account. Zoho Books API v3.',
	},
	'bankAccounts.getBankAccount': {
		riskLevel: 'read',
		description: 'Get account details. Zoho Books API v3.',
	},
	'bankAccounts.deleteBankAccount': {
		riskLevel: 'destructive',
		description: 'Delete an account. Zoho Books API v3.',
	},
	'bankAccounts.markBankAccountInactive': {
		riskLevel: 'write',
		description: 'Deactivate account.. Zoho Books API v3.',
	},
	'bankAccounts.markBankAccountActive': {
		riskLevel: 'write',
		description: 'Activate account. Zoho Books API v3.',
	},
	'bankAccounts.importBankStatements': {
		riskLevel: 'write',
		description: 'Import a Bank/Credit Card Statement. Zoho Books API v3.',
	},
	'bankAccounts.getLastImportedBankStatement': {
		riskLevel: 'read',
		description: 'Get last imported statement. Zoho Books API v3.',
	},
	'bankAccounts.deleteLastImportedBankStatement': {
		riskLevel: 'destructive',
		description: 'Delete last imported statement. Zoho Books API v3.',
	},
	'bankAccounts.listBankReconciliations': {
		riskLevel: 'read',
		description: 'List bank reconciliations. Zoho Books API v3.',
	},
	'bankAccounts.createBankReconciliation': {
		riskLevel: 'write',
		description: 'Create a bank reconciliation. Zoho Books API v3.',
	},
	'bankAccounts.getBankReconciliation': {
		riskLevel: 'read',
		description: 'Get a bank reconciliation. Zoho Books API v3.',
	},
	'bankAccounts.updateBankReconciliation': {
		riskLevel: 'write',
		description: 'Update a bank reconciliation. Zoho Books API v3.',
	},
	'bankAccounts.deleteBankReconciliation': {
		riskLevel: 'destructive',
		description: 'Delete a bank reconciliation. Zoho Books API v3.',
	},
	'bankAccounts.saveBankReconciliationDraft': {
		riskLevel: 'write',
		description: 'Save a bank reconciliation as draft. Zoho Books API v3.',
	},
	'bankAccounts.addBankReconciliationAttachment': {
		riskLevel: 'write',
		description: 'Add a reconciliation attachment. Zoho Books API v3.',
	},
	'bankAccounts.getBankReconciliationDocument': {
		riskLevel: 'read',
		description: 'Get a reconciliation document. Zoho Books API v3.',
	},
	'bankAccounts.deleteBankReconciliationDocument': {
		riskLevel: 'destructive',
		description: 'Delete a reconciliation document. Zoho Books API v3.',
	},
	'bankAccounts.listBankAccountBalances': {
		riskLevel: 'read',
		description: 'List bank account balances. Zoho Books API v3.',
	},
	'bankAccounts.getBankAccountsOverview': {
		riskLevel: 'read',
		description: 'Get bank accounts overview. Zoho Books API v3.',
	},
	'bankAccounts.getBankAccountBalance': {
		riskLevel: 'read',
		description: 'Get a bank account balance. Zoho Books API v3.',
	},
	'bankAccounts.getBankAccountBalances': {
		riskLevel: 'read',
		description: 'Get bank account balances. Zoho Books API v3.',
	},
	'bankAccounts.getBankAccountInsights': {
		riskLevel: 'read',
		description: 'Get bank account insights. Zoho Books API v3.',
	},
	'bankAccounts.getBankAccountOverview': {
		riskLevel: 'read',
		description: 'Get a bank account overview. Zoho Books API v3.',
	},
	'bankAccounts.getBankAccountStatementSummary': {
		riskLevel: 'read',
		description: 'Get a bank statement summary. Zoho Books API v3.',
	},
	'bankAccounts.listBankAccountSubaccounts': {
		riskLevel: 'read',
		description: 'List bank account sub-accounts. Zoho Books API v3.',
	},
	'bankAccounts.listBankAccountStatements': {
		riskLevel: 'read',
		description: 'List bank account statements. Zoho Books API v3.',
	},
	'bankAccounts.listUnreviewedBankStatements': {
		riskLevel: 'read',
		description: 'List unreviewed bank statements. Zoho Books API v3.',
	},
	'bankAccounts.listBankAccountTransactions': {
		riskLevel: 'read',
		description: 'List bank account transactions. Zoho Books API v3.',
	},
	'bankAccounts.getBankAccountPreferences': {
		riskLevel: 'read',
		description: 'Get bank account preferences. Zoho Books API v3.',
	},
	'bankAccounts.updateBankAccountPreferences': {
		riskLevel: 'write',
		description: 'Update bank account preferences. Zoho Books API v3.',
	},
	'bankAccounts.getBankStatementImportEncryptionKey': {
		riskLevel: 'read',
		description: 'Get bank statement import encryption key. Zoho Books API v3.',
	},
	'bankRules.listBankAccountRules': {
		riskLevel: 'read',
		description: 'Get Rules List. Zoho Books API v3.',
	},
	'bankRules.createBankAccountRule': {
		riskLevel: 'write',
		description: 'Create a rule. Zoho Books API v3.',
	},
	'bankRules.bulkUpdateBankAccountRules': {
		riskLevel: 'write',
		description: 'Bulk update rules. Zoho Books API v3.',
	},
	'bankRules.bulkDeleteBankAccountRules': {
		riskLevel: 'destructive',
		description: 'Bulk delete rules. Zoho Books API v3.',
	},
	'bankRules.getBankAccountRule': {
		riskLevel: 'read',
		description: 'Get a rule. Zoho Books API v3.',
	},
	'bankRules.updateBankAccountRule': {
		riskLevel: 'write',
		description: 'Update a rule. Zoho Books API v3.',
	},
	'bankRules.deleteBankAccountRule': {
		riskLevel: 'destructive',
		description: 'Delete a rule. Zoho Books API v3.',
	},
	'bankRules.reorderBankAccountRules': {
		riskLevel: 'write',
		description: 'Reorder rules. Zoho Books API v3.',
	},
	'bankRules.skipSuggestedBankAccountRule': {
		riskLevel: 'write',
		description: 'Skip a suggested rule. Zoho Books API v3.',
	},
	'bankRules.listBankAccountMatchFilters': {
		riskLevel: 'read',
		description: 'List match filters. Zoho Books API v3.',
	},
	'bankRules.createBankAccountMatchFilter': {
		riskLevel: 'write',
		description: 'Create a match filter. Zoho Books API v3.',
	},
	'bankRules.updateBankAccountMatchFilter': {
		riskLevel: 'write',
		description: 'Update a match filter. Zoho Books API v3.',
	},
	'bankRules.deleteBankAccountMatchFilter': {
		riskLevel: 'destructive',
		description: 'Delete a match filter. Zoho Books API v3.',
	},
	'bankTransactions.createBankTransaction': {
		riskLevel: 'write',
		description: 'Create a transaction for an account. Zoho Books API v3.',
	},
	'bankTransactions.listBankTransactions': {
		riskLevel: 'read',
		description: 'Get transactions list. Zoho Books API v3.',
	},
	'bankTransactions.updateBankTransaction': {
		riskLevel: 'write',
		description: 'Update a transaction. Zoho Books API v3.',
	},
	'bankTransactions.getBankTransaction': {
		riskLevel: 'read',
		description: 'Get transaction. Zoho Books API v3.',
	},
	'bankTransactions.deleteBankTransaction': {
		riskLevel: 'destructive',
		description: 'Delete a transaction. Zoho Books API v3.',
	},
	'bankTransactions.getMatchingBankTransactions': {
		riskLevel: 'read',
		description: 'Get matching transactions. Zoho Books API v3.',
	},
	'bankTransactions.matchBankTransaction': {
		riskLevel: 'write',
		description: 'Match a transaction. Zoho Books API v3.',
	},
	'bankTransactions.unmatchBankTransaction': {
		riskLevel: 'write',
		description: 'Unmatch a matched transaction. Zoho Books API v3.',
	},
	'bankTransactions.excludeBankTransaction': {
		riskLevel: 'write',
		description: 'Exclude a transaction. Zoho Books API v3.',
	},
	'bankTransactions.restoreBankTransaction': {
		riskLevel: 'write',
		description: 'Restore a transaction. Zoho Books API v3.',
	},
	'bankTransactions.categorizeBankTransaction': {
		riskLevel: 'write',
		description: 'Categorize an uncategorized transaction. Zoho Books API v3.',
	},
	'bankTransactions.categorizeBankTransactionAsExpense': {
		riskLevel: 'write',
		description: 'Categorize as expense. Zoho Books API v3.',
	},
	'bankTransactions.uncategorizeBankTransaction': {
		riskLevel: 'write',
		description: 'Uncategorize a categorized transaction. Zoho Books API v3.',
	},
	'bankTransactions.categorizeBankTransactionAsVendorPayment': {
		riskLevel: 'write',
		description: 'Categorize a vendor payment. Zoho Books API v3.',
	},
	'bankTransactions.categorizeBankTransactionAsCustomerPayment': {
		riskLevel: 'write',
		description: 'Categorize as customer payment. Zoho Books API v3.',
	},
	'bankTransactions.categorizeAsCreditNoteRefunds': {
		riskLevel: 'destructive',
		description: 'Categorize as credit note refunds. Zoho Books API v3.',
	},
	'bankTransactions.categorizeAsVendorCreditRefunds': {
		riskLevel: 'destructive',
		description: 'Categorize as vendor credit refunds. Zoho Books API v3.',
	},
	'bankTransactions.categorizeBankTransactionAsPaymentRefund': {
		riskLevel: 'destructive',
		description: 'Categorize as Customer Payment refund. Zoho Books API v3.',
	},
	'bankTransactions.categorizeAsVendorPaymentRefund': {
		riskLevel: 'destructive',
		description: 'Categorize as Vendor Payment refund. Zoho Books API v3.',
	},
	'baseCurrencyAdjustment.createBaseCurrencyAdjustment': {
		riskLevel: 'write',
		description: 'Create a base currency adjustment. Zoho Books API v3.',
	},
	'baseCurrencyAdjustment.listBaseCurrencyAdjustments': {
		riskLevel: 'read',
		description: 'List base currency adjustment. Zoho Books API v3.',
	},
	'baseCurrencyAdjustment.getBaseCurrencyAdjustment': {
		riskLevel: 'read',
		description: 'Get a base currency adjustment. Zoho Books API v3.',
	},
	'baseCurrencyAdjustment.deleteBaseCurrencyAdjustment': {
		riskLevel: 'destructive',
		description: 'Delete a base currency adjustment. Zoho Books API v3.',
	},
	'baseCurrencyAdjustment.bulkDeleteBaseCurrencyAdjustments': {
		riskLevel: 'destructive',
		description: 'Bulk delete base currency adjustments. Zoho Books API v3.',
	},
	'baseCurrencyAdjustment.reevaluateBaseCurrencyAdjustment': {
		riskLevel: 'write',
		description: 'Reevaluate a base currency adjustment. Zoho Books API v3.',
	},
	'baseCurrencyAdjustment.listBaseCurrencyAdjustmentAccounts': {
		riskLevel: 'read',
		description:
			'List account details for base currency adjustment. Zoho Books API v3.',
	},
	'baseCurrencyAdjustment.listBaseCurrencyAdjustmentContacts': {
		riskLevel: 'read',
		description:
			'List contact details for base currency adjustment. Zoho Books API v3.',
	},
	'bills.createBill': {
		riskLevel: 'write',
		description: 'Create a bill. Zoho Books API v3.',
	},
	'bills.listBills': {
		riskLevel: 'read',
		description: 'List bills. Zoho Books API v3.',
	},
	'bills.updateBillUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update a bill using a custom field's unique value. Zoho Books API v3.",
	},
	'bills.updateBill': {
		riskLevel: 'write',
		description: 'Update a bill. Zoho Books API v3.',
	},
	'bills.getBill': {
		riskLevel: 'read',
		description: 'Get a bill. Zoho Books API v3.',
	},
	'bills.deleteBill': {
		riskLevel: 'destructive',
		description: 'Delete a bill. Zoho Books API v3.',
	},
	'bills.updateCustomFieldsInBill': {
		riskLevel: 'write',
		description: 'Update custom field in existing bills. Zoho Books API v3.',
	},
	'bills.markBillVoid': {
		riskLevel: 'destructive',
		description: 'Void a bill. Zoho Books API v3.',
	},
	'bills.markBillOpen': {
		riskLevel: 'write',
		description: 'Mark a bill as open. Zoho Books API v3.',
	},
	'bills.submitBill': {
		riskLevel: 'write',
		description: 'Submit a bill for approval. Zoho Books API v3.',
	},
	'bills.approveBill': {
		riskLevel: 'destructive',
		description: 'Approve a bill. Zoho Books API v3.',
	},
	'bills.updateBillBillingAddress': {
		riskLevel: 'write',
		description: 'Update billing address. Zoho Books API v3.',
	},
	'bills.listBillPayments': {
		riskLevel: 'read',
		description: 'List bill payments. Zoho Books API v3.',
	},
	'bills.applyCreditsToBill': {
		riskLevel: 'write',
		description: 'Apply credits. Zoho Books API v3.',
	},
	'bills.deleteBillPayment': {
		riskLevel: 'destructive',
		description: 'Delete a payment. Zoho Books API v3.',
	},
	'bills.getBillAttachment': {
		riskLevel: 'read',
		description: 'Get a bill attachment. Zoho Books API v3.',
	},
	'bills.addBillAttachment': {
		riskLevel: 'write',
		description: 'Add attachment to a bill. Zoho Books API v3.',
	},
	'bills.deleteBillAttachment': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. Zoho Books API v3.',
	},
	'bills.getBillComments': {
		riskLevel: 'read',
		description: 'List bill comments & history. Zoho Books API v3.',
	},
	'bills.addBillComment': {
		riskLevel: 'write',
		description: 'Add comment. Zoho Books API v3.',
	},
	'bills.deleteBillComment': {
		riskLevel: 'destructive',
		description: 'Delete a comment. Zoho Books API v3.',
	},
	'bills.convertPurchaseOrderToBill': {
		riskLevel: 'read',
		description: 'Convert PO to Bill. Zoho Books API v3.',
	},
	'categories.listCategories': {
		riskLevel: 'read',
		description: 'List categories. Zoho Books API v3.',
	},
	'categories.createCategory': {
		riskLevel: 'write',
		description: 'Create a category. Zoho Books API v3.',
	},
	'categories.getCategory': {
		riskLevel: 'read',
		description: 'Get a category. Zoho Books API v3.',
	},
	'categories.updateCategory': {
		riskLevel: 'write',
		description: 'Update a category. Zoho Books API v3.',
	},
	'categories.deleteCategory': {
		riskLevel: 'destructive',
		description: 'Delete a category. Zoho Books API v3.',
	},
	'chartOfAccounts.createChartOfAccount': {
		riskLevel: 'write',
		description: 'Create an account. Zoho Books API v3.',
	},
	'chartOfAccounts.listChartOfAccounts': {
		riskLevel: 'read',
		description: 'List chart of accounts. Zoho Books API v3.',
	},
	'chartOfAccounts.updateChartOfAccount': {
		riskLevel: 'write',
		description: 'Update an account. Zoho Books API v3.',
	},
	'chartOfAccounts.getChartOfAccount': {
		riskLevel: 'read',
		description: 'Get an account. Zoho Books API v3.',
	},
	'chartOfAccounts.deleteChartOfAccount': {
		riskLevel: 'destructive',
		description: 'Delete an account. Zoho Books API v3.',
	},
	'chartOfAccounts.markChartOfAccountActive': {
		riskLevel: 'write',
		description: 'Mark an account as active. Zoho Books API v3.',
	},
	'chartOfAccounts.markChartOfAccountInactive': {
		riskLevel: 'write',
		description: 'Mark an account as inactive. Zoho Books API v3.',
	},
	'chartOfAccounts.bulkMarkChartOfAccountsActive': {
		riskLevel: 'write',
		description: 'Bulk mark accounts as active. Zoho Books API v3.',
	},
	'chartOfAccounts.bulkMarkChartOfAccountsInactive': {
		riskLevel: 'write',
		description: 'Bulk mark accounts as inactive. Zoho Books API v3.',
	},
	'chartOfAccounts.bulkDeleteChartOfAccounts': {
		riskLevel: 'destructive',
		description: 'Bulk delete accounts. Zoho Books API v3.',
	},
	'chartOfAccounts.listChartOfAccountTransactions': {
		riskLevel: 'read',
		description: 'List of transactions for an account. Zoho Books API v3.',
	},
	'chartOfAccounts.deleteChartOfAccountTransaction': {
		riskLevel: 'destructive',
		description: 'Delete a transaction. Zoho Books API v3.',
	},
	'contactPersons.createContactPerson': {
		riskLevel: 'write',
		description: 'Create a contact person. Zoho Books API v3.',
	},
	'contactPersons.updateContactPerson': {
		riskLevel: 'write',
		description: 'Update a contact person. Zoho Books API v3.',
	},
	'contactPersons.deleteContactPerson': {
		riskLevel: 'destructive',
		description: 'Delete a contact person. Zoho Books API v3.',
	},
	'contactPersons.listContactPersons': {
		riskLevel: 'read',
		description: 'List contact persons. Zoho Books API v3.',
	},
	'contactPersons.getContactPerson': {
		riskLevel: 'read',
		description: 'Get a contact person. Zoho Books API v3.',
	},
	'contactPersons.markContactPersonPrimary': {
		riskLevel: 'write',
		description: 'Mark as primary contact person. Zoho Books API v3.',
	},
	'contacts.createContact': {
		riskLevel: 'write',
		description: 'Create a Contact. Zoho Books API v3.',
	},
	'contacts.listContacts': {
		riskLevel: 'read',
		description: 'List Contacts. Zoho Books API v3.',
	},
	'contacts.updateContactUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update a contact using a custom field's unique value. Zoho Books API v3.",
	},
	'contacts.deleteContacts': {
		riskLevel: 'destructive',
		description: 'Delete contacts. Zoho Books API v3.',
	},
	'contacts.assignContactOwner': {
		riskLevel: 'write',
		description: 'Assign an Owner to a Contact. Zoho Books API v3.',
	},
	'contacts.assignOwnerToContacts': {
		riskLevel: 'write',
		description: 'Assign an Owner to Multiple Contacts. Zoho Books API v3.',
	},
	'contacts.markContactsFor1099Tracking': {
		riskLevel: 'write',
		description: 'Mark Multiple Contacts for 1099 Tracking. Zoho Books API v3.',
	},
	'contacts.verifyContactBankAccount': {
		riskLevel: 'write',
		description: 'Verify a Contact Bank Account. Zoho Books API v3.',
	},
	'contacts.verifyContactAddress': {
		riskLevel: 'read',
		description: 'Verify a Contact Address. Zoho Books API v3.',
	},
	'contacts.listContactAutobillRecurringInvoices': {
		riskLevel: 'read',
		description:
			'List Auto-bill Recurring Invoices for a Contact Card. Zoho Books API v3.',
	},
	'contacts.updateContact': {
		riskLevel: 'write',
		description: 'Update a Contact. Zoho Books API v3.',
	},
	'contacts.getContact': {
		riskLevel: 'read',
		description: 'Get Contact. Zoho Books API v3.',
	},
	'contacts.deleteContact': {
		riskLevel: 'destructive',
		description: 'Delete a Contact. Zoho Books API v3.',
	},
	'contacts.markContactActive': {
		riskLevel: 'write',
		description: 'Mark as Active. Zoho Books API v3.',
	},
	'contacts.markContactInactive': {
		riskLevel: 'write',
		description: 'Mark as Inactive. Zoho Books API v3.',
	},
	'contacts.enableContactPortal': {
		riskLevel: 'destructive',
		description: 'Enable Portal Access. Zoho Books API v3.',
	},
	'contacts.enableContactPaymentReminder': {
		riskLevel: 'write',
		description: 'Enable Payment Reminders. Zoho Books API v3.',
	},
	'contacts.disableContactPaymentReminder': {
		riskLevel: 'write',
		description: 'Disable Payment Reminders. Zoho Books API v3.',
	},
	'contacts.emailContactStatement': {
		riskLevel: 'destructive',
		description: 'Email Statement. Zoho Books API v3.',
	},
	'contacts.getContactStatementMail': {
		riskLevel: 'read',
		description: 'Get Statement Mail Content. Zoho Books API v3.',
	},
	'contacts.getContactEmailContent': {
		riskLevel: 'read',
		description: 'Get contact email content. Zoho Books API v3.',
	},
	'contacts.emailContact': {
		riskLevel: 'destructive',
		description: 'Email Contact. Zoho Books API v3.',
	},
	'contacts.listContactComments': {
		riskLevel: 'read',
		description: 'List Comments. Zoho Books API v3.',
	},
	'contacts.addContactComment': {
		riskLevel: 'write',
		description: 'Add a comment to a contact. Zoho Books API v3.',
	},
	'contacts.getContactAddress': {
		riskLevel: 'read',
		description: 'Get Contact Addresses. Zoho Books API v3.',
	},
	'contacts.addContactAddress': {
		riskLevel: 'write',
		description: 'Add Additional Address. Zoho Books API v3.',
	},
	'contacts.updateContactAddress': {
		riskLevel: 'write',
		description: 'Edit Additional Address. Zoho Books API v3.',
	},
	'contacts.deleteContactAddress': {
		riskLevel: 'destructive',
		description: 'Delete Additional Address. Zoho Books API v3.',
	},
	'contacts.listContactCreditNoteRefunds': {
		riskLevel: 'read',
		description: 'List credit note refunds for a contact. Zoho Books API v3.',
	},
	'contacts.trackContact1099': {
		riskLevel: 'write',
		description: 'Track 1099. Zoho Books API v3.',
	},
	'contacts.untrackContact1099': {
		riskLevel: 'write',
		description: 'Untrack 1099. Zoho Books API v3.',
	},
	'contacts.getUnusedRetainerPayments': {
		riskLevel: 'read',
		description: 'Get Unused Retainer Payments. Zoho Books API v3.',
	},
	'contacts.addContactBankAccount': {
		riskLevel: 'write',
		description: 'Add a bank account to a contact. Zoho Books API v3.',
	},
	'contacts.getContactBankAccount': {
		riskLevel: 'read',
		description: 'Get a contact bank account. Zoho Books API v3.',
	},
	'contacts.updateContactBankAccount': {
		riskLevel: 'write',
		description: 'Update a contact bank account. Zoho Books API v3.',
	},
	'contacts.deleteContactBankAccount': {
		riskLevel: 'destructive',
		description: 'Delete a contact bank account. Zoho Books API v3.',
	},
	'contacts.approveContactBankAccount': {
		riskLevel: 'destructive',
		description: 'Approve a contact bank account. Zoho Books API v3.',
	},
	'contacts.declineContactBankAccount': {
		riskLevel: 'write',
		description: 'Decline a contact bank account. Zoho Books API v3.',
	},
	'contacts.listContactBankAccounts': {
		riskLevel: 'read',
		description: 'List contact bank accounts. Zoho Books API v3.',
	},
	'contacts.listAllContactBankAccounts': {
		riskLevel: 'read',
		description: 'List all contact bank accounts. Zoho Books API v3.',
	},
	'contacts.addContactCard': {
		riskLevel: 'write',
		description: 'Add a card to a contact. Zoho Books API v3.',
	},
	'contacts.getContactCard': {
		riskLevel: 'read',
		description: 'Get a contact card. Zoho Books API v3.',
	},
	'contacts.updateContactCard': {
		riskLevel: 'write',
		description: 'Update a contact card. Zoho Books API v3.',
	},
	'contacts.deleteContactCard': {
		riskLevel: 'destructive',
		description: 'Delete a contact card. Zoho Books API v3.',
	},
	'contacts.listContactCards': {
		riskLevel: 'read',
		description: 'List contact cards. Zoho Books API v3.',
	},
	'contacts.getContactCardCount': {
		riskLevel: 'read',
		description: 'Get contact card count. Zoho Books API v3.',
	},
	'contacts.listAllContactPersons': {
		riskLevel: 'read',
		description: 'List all contact persons. Zoho Books API v3.',
	},
	'contacts.getContactContactPerson': {
		riskLevel: 'read',
		description: 'Get a contact person of a contact. Zoho Books API v3.',
	},
	'contacts.inviteContactPersonToPortal': {
		riskLevel: 'destructive',
		description: 'Invite a contact person to the portal. Zoho Books API v3.',
	},
	'contacts.resendContactPersonPortalInvite': {
		riskLevel: 'destructive',
		description: 'Resend a portal invite. Zoho Books API v3.',
	},
	'contacts.enableContactPersonSms': {
		riskLevel: 'destructive',
		description: 'Enable SMS for a contact person. Zoho Books API v3.',
	},
	'contacts.disableContactPersonSms': {
		riskLevel: 'destructive',
		description: 'Disable SMS for a contact person. Zoho Books API v3.',
	},
	'contacts.deleteContactComment': {
		riskLevel: 'destructive',
		description: 'Delete a contact comment. Zoho Books API v3.',
	},
	'contacts.getContactDocument': {
		riskLevel: 'read',
		description: 'Get a contact document. Zoho Books API v3.',
	},
	'contacts.updateContactDocument': {
		riskLevel: 'write',
		description: 'Update a contact document. Zoho Books API v3.',
	},
	'contacts.deleteContactDocument': {
		riskLevel: 'destructive',
		description: 'Delete a contact document. Zoho Books API v3.',
	},
	'contacts.restoreContactDocuments': {
		riskLevel: 'write',
		description: 'Restore contact documents. Zoho Books API v3.',
	},
	'contacts.updateContactTags': {
		riskLevel: 'write',
		description: 'Update contact tags. Zoho Books API v3.',
	},
	'contacts.deleteContactTag': {
		riskLevel: 'destructive',
		description: 'Delete a contact tag. Zoho Books API v3.',
	},
	'contacts.listContactTaxInfo': {
		riskLevel: 'read',
		description: 'List contact tax information. Zoho Books API v3.',
	},
	'contacts.addContactTaxInfo': {
		riskLevel: 'write',
		description: 'Add contact tax information. Zoho Books API v3.',
	},
	'contacts.updateContactTaxInfo': {
		riskLevel: 'write',
		description: 'Update contact tax information. Zoho Books API v3.',
	},
	'contacts.deleteContactTaxInfo': {
		riskLevel: 'destructive',
		description: 'Delete contact tax information. Zoho Books API v3.',
	},
	'contacts.listContactAddresses': {
		riskLevel: 'read',
		description: 'List contact addresses. Zoho Books API v3.',
	},
	'contacts.markContactAddressAsBilling': {
		riskLevel: 'write',
		description: 'Mark an address as billing. Zoho Books API v3.',
	},
	'contacts.markContactAddressAsShipping': {
		riskLevel: 'write',
		description: 'Mark an address as shipping. Zoho Books API v3.',
	},
	'contacts.verifyContactAddressById': {
		riskLevel: 'write',
		description: 'Verify a contact address. Zoho Books API v3.',
	},
	'contacts.addContactAttachment': {
		riskLevel: 'write',
		description: 'Add an attachment to a contact. Zoho Books API v3.',
	},
	'contacts.mergeContact': {
		riskLevel: 'destructive',
		description: 'Merge contacts. Zoho Books API v3.',
	},
	'contacts.verifyContactEinvoice': {
		riskLevel: 'write',
		description: 'Verify contact e-invoice details. Zoho Books API v3.',
	},
	'contacts.disableContactPortal': {
		riskLevel: 'write',
		description: 'Disable the contact portal. Zoho Books API v3.',
	},
	'contacts.getContactsSmsContent': {
		riskLevel: 'read',
		description: 'Get bulk contact SMS content. Zoho Books API v3.',
	},
	'contacts.sendContactsSms': {
		riskLevel: 'destructive',
		description: 'Send SMS to contacts. Zoho Books API v3.',
	},
	'contacts.getContactSmsContent': {
		riskLevel: 'read',
		description: 'Get contact SMS content. Zoho Books API v3.',
	},
	'contacts.sendContactSms': {
		riskLevel: 'destructive',
		description: 'Send SMS to a contact. Zoho Books API v3.',
	},
	'contacts.getContactByReference': {
		riskLevel: 'read',
		description: 'Get a contact by reference. Zoho Books API v3.',
	},
	'contacts.getContactStatement': {
		riskLevel: 'read',
		description: 'Get a contact statement. Zoho Books API v3.',
	},
	'contacts.getContactUnusedCredits': {
		riskLevel: 'read',
		description: 'Get unused credits of a contact. Zoho Books API v3.',
	},
	'contacts.listContactPaymentRefunds': {
		riskLevel: 'read',
		description: 'List payment refunds of a contact. Zoho Books API v3.',
	},
	'contacts.getContactIncomeAndExpense': {
		riskLevel: 'read',
		description: 'Get contact income and expense. Zoho Books API v3.',
	},
	'contacts.getContactProfitAndLoss': {
		riskLevel: 'read',
		description: 'Get contact profit and loss. Zoho Books API v3.',
	},
	'contacts.getContactInventorySummary': {
		riskLevel: 'read',
		description: 'Get contact inventory summary. Zoho Books API v3.',
	},
	'contacts.getContactOpeningBalances': {
		riskLevel: 'read',
		description: 'Get contact opening balances. Zoho Books API v3.',
	},
	'contacts.updateContactTrnStatus': {
		riskLevel: 'write',
		description: 'Update contact TRN status. Zoho Books API v3.',
	},
	'contacts.getContactClientReviewEmail': {
		riskLevel: 'read',
		description: 'Get client review email content. Zoho Books API v3.',
	},
	'contacts.sendContactClientReviewEmail': {
		riskLevel: 'destructive',
		description: 'Send a client review email. Zoho Books API v3.',
	},
	'contacts.getContactPaymentMethodEmail': {
		riskLevel: 'read',
		description: 'Get payment method email content. Zoho Books API v3.',
	},
	'contacts.sendContactPaymentMethodEmail': {
		riskLevel: 'destructive',
		description: 'Send a payment method request email. Zoho Books API v3.',
	},
	'contacts.getContactVendorStatementEmail': {
		riskLevel: 'read',
		description: 'Get vendor statement email content. Zoho Books API v3.',
	},
	'contacts.sendContactVendorStatementEmail': {
		riskLevel: 'destructive',
		description: 'Send a vendor statement email. Zoho Books API v3.',
	},
	'creditNotes.createCreditNote': {
		riskLevel: 'write',
		description: 'Create a credit note. Zoho Books API v3.',
	},
	'creditNotes.listCreditNotes': {
		riskLevel: 'read',
		description: 'List all Credit Notes. Zoho Books API v3.',
	},
	'creditNotes.updateCreditNoteUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update a credit note using a custom field's unique value. Zoho Books API v3.",
	},
	'creditNotes.updateCreditNote': {
		riskLevel: 'write',
		description: 'Update a credit note. Zoho Books API v3.',
	},
	'creditNotes.getCreditNote': {
		riskLevel: 'read',
		description: 'Get a credit note. Zoho Books API v3.',
	},
	'creditNotes.deleteCreditNote': {
		riskLevel: 'destructive',
		description: 'Delete a credit note. Zoho Books API v3.',
	},
	'creditNotes.emailCreditNote': {
		riskLevel: 'destructive',
		description: 'Email a credit note. Zoho Books API v3.',
	},
	'creditNotes.getCreditNoteEmail': {
		riskLevel: 'read',
		description: 'Get email content. Zoho Books API v3.',
	},
	'creditNotes.markCreditNoteVoid': {
		riskLevel: 'destructive',
		description: 'Void a Credit Note. Zoho Books API v3.',
	},
	'creditNotes.markCreditNoteDraft': {
		riskLevel: 'write',
		description: 'Convert Credit Note to Draft.. Zoho Books API v3.',
	},
	'creditNotes.markCreditNoteOpen': {
		riskLevel: 'write',
		description: 'Convert to Open. Zoho Books API v3.',
	},
	'creditNotes.submitCreditNote': {
		riskLevel: 'write',
		description: 'Submit a credit note for approval. Zoho Books API v3.',
	},
	'creditNotes.approveCreditNote': {
		riskLevel: 'destructive',
		description: 'Approve a credit note.. Zoho Books API v3.',
	},
	'creditNotes.getCreditNoteEmailHistory': {
		riskLevel: 'read',
		description: 'Email history. Zoho Books API v3.',
	},
	'creditNotes.updateCreditNoteBillingAddress': {
		riskLevel: 'write',
		description: 'Update billing address. Zoho Books API v3.',
	},
	'creditNotes.updateCreditNoteShippingAddress': {
		riskLevel: 'write',
		description: 'Update Shipping address. Zoho Books API v3.',
	},
	'creditNotes.listCreditNoteTemplates': {
		riskLevel: 'read',
		description: 'List credit note template. Zoho Books API v3.',
	},
	'creditNotes.updateCreditNoteTemplate': {
		riskLevel: 'write',
		description: 'Update a credit note template. Zoho Books API v3.',
	},
	'creditNotes.listInvoicesOfCreditNote': {
		riskLevel: 'read',
		description: 'List invoices credited. Zoho Books API v3.',
	},
	'creditNotes.applyCreditNoteToInvoice': {
		riskLevel: 'write',
		description: 'Credit to an invoice. Zoho Books API v3.',
	},
	'creditNotes.deleteInvoiceOfCreditNote': {
		riskLevel: 'destructive',
		description: 'Delete invoices credited. Zoho Books API v3.',
	},
	'creditNotes.listCreditNoteComments': {
		riskLevel: 'read',
		description: 'List credit note comments & history. Zoho Books API v3.',
	},
	'creditNotes.addCreditNoteComment': {
		riskLevel: 'write',
		description: 'Add a comment. Zoho Books API v3.',
	},
	'creditNotes.deleteCreditNoteComment': {
		riskLevel: 'destructive',
		description: 'Delete a Comment. Zoho Books API v3.',
	},
	'creditNotes.listCreditNoteRefundsOfAllCreditNotes': {
		riskLevel: 'read',
		description: 'List credit note refunds. Zoho Books API v3.',
	},
	'creditNotes.listCreditNoteRefundsOfACreditNote': {
		riskLevel: 'read',
		description: 'List refunds of a credit note. Zoho Books API v3.',
	},
	'creditNotes.createCreditNoteRefund': {
		riskLevel: 'destructive',
		description: 'Refund credit note. Zoho Books API v3.',
	},
	'creditNotes.getCreditNoteRefund': {
		riskLevel: 'read',
		description: 'Get credit note refund. Zoho Books API v3.',
	},
	'creditNotes.updateCreditNoteRefund': {
		riskLevel: 'destructive',
		description: 'Update credit note refund. Zoho Books API v3.',
	},
	'creditNotes.deleteCreditNoteRefund': {
		riskLevel: 'destructive',
		description: 'Delete credit note refund. Zoho Books API v3.',
	},
	'creditNotes.approveCreditNotes': {
		riskLevel: 'destructive',
		description: 'Approve credit notes. Zoho Books API v3.',
	},
	'creditNotes.submitCreditNotes': {
		riskLevel: 'write',
		description: 'Submit credit notes for approval. Zoho Books API v3.',
	},
	'creditNotes.finalizeCreditNoteApproval': {
		riskLevel: 'destructive',
		description: 'Finalize approval of a credit note. Zoho Books API v3.',
	},
	'creditNotes.rejectCreditNote': {
		riskLevel: 'destructive',
		description: 'Reject a credit note. Zoho Books API v3.',
	},
	'creditNotes.getCreditNoteSignatureTemplate': {
		riskLevel: 'read',
		description:
			'Get the digital signature template of a credit note. Zoho Books API v3.',
	},
	'creditNotes.printCreditNotes': {
		riskLevel: 'read',
		description: 'Print credit notes. Zoho Books API v3.',
	},
	'creditNotes.addCreditNoteAttachment': {
		riskLevel: 'write',
		description: 'Add attachment to a credit note. Zoho Books API v3.',
	},
	'creditNotes.getCreditNoteDocument': {
		riskLevel: 'read',
		description: 'Retrieve a credit note document. Zoho Books API v3.',
	},
	'creditNotes.updateCreditNoteDocument': {
		riskLevel: 'write',
		description: 'Update a credit note document. Zoho Books API v3.',
	},
	'creditNotes.deleteCreditNoteDocument': {
		riskLevel: 'destructive',
		description: 'Delete a credit note document. Zoho Books API v3.',
	},
	'creditNotes.getCreditNoteCustomFields': {
		riskLevel: 'read',
		description: 'Get credit note custom fields. Zoho Books API v3.',
	},
	'creditNotes.updateCreditNoteCustomFields': {
		riskLevel: 'write',
		description: 'Update credit note custom fields. Zoho Books API v3.',
	},
	'creditNotes.getCreditNoteMailContent': {
		riskLevel: 'read',
		description: 'Get credit note email content. Zoho Books API v3.',
	},
	'creditNotes.addCreditNoteDigitalSignature': {
		riskLevel: 'destructive',
		description: 'Add a digital signature to a credit note. Zoho Books API v3.',
	},
	'creditNotes.uploadCreditNoteDigitalSignature': {
		riskLevel: 'write',
		description: 'Upload a signed credit note. Zoho Books API v3.',
	},
	'creditNotes.getCreditNoteRefundById': {
		riskLevel: 'read',
		description: 'Get a credit note refund. Zoho Books API v3.',
	},
	'creditNotes.applyCreditNoteSubstatus': {
		riskLevel: 'write',
		description: 'Apply a sub-status to a credit note. Zoho Books API v3.',
	},
	'creditNotes.deleteCreditNoteSubstatus': {
		riskLevel: 'destructive',
		description: 'Delete a credit note sub-status. Zoho Books API v3.',
	},
	'creditNotes.listCreditNotesEinvoice': {
		riskLevel: 'read',
		description: 'List credit note e-invoices. Zoho Books API v3.',
	},
	'creditNotes.pushCreditNotesEinvoice': {
		riskLevel: 'destructive',
		description: 'Push credit note e-invoices. Zoho Books API v3.',
	},
	'creditNotes.cancelCreditNotesEinvoice': {
		riskLevel: 'destructive',
		description: 'Cancel credit note e-invoices. Zoho Books API v3.',
	},
	'creditNotes.getCreditNoteEinvoice': {
		riskLevel: 'read',
		description: 'Get a credit note e-invoice. Zoho Books API v3.',
	},
	'creditNotes.pushCreditNoteEinvoice': {
		riskLevel: 'destructive',
		description: 'Push a credit note e-invoice. Zoho Books API v3.',
	},
	'creditNotes.cancelCreditNoteEinvoice': {
		riskLevel: 'destructive',
		description: 'Cancel a credit note e-invoice. Zoho Books API v3.',
	},
	'creditNotes.fetchCreditNoteEinvoice': {
		riskLevel: 'write',
		description: 'Fetch a credit note e-invoice. Zoho Books API v3.',
	},
	'creditNotes.deleteCreditNoteEinvoiceStatus': {
		riskLevel: 'destructive',
		description: 'Delete a credit note e-invoice status. Zoho Books API v3.',
	},
	'creditNotes.markCreditNoteEinvoicePushed': {
		riskLevel: 'write',
		description:
			'Mark a credit note e-invoice as manually pushed. Zoho Books API v3.',
	},
	'creditNotes.markCreditNoteEinvoiceCancelled': {
		riskLevel: 'destructive',
		description:
			'Mark a credit note e-invoice as cancelled. Zoho Books API v3.',
	},
	'creditNotes.recallCreditNoteEinvoiceStatus': {
		riskLevel: 'destructive',
		description: 'Recall a credit note e-invoice status. Zoho Books API v3.',
	},
	'creditNotes.pushCreditNoteRefundEinvoice': {
		riskLevel: 'destructive',
		description: 'Push a credit note refund e-invoice. Zoho Books API v3.',
	},
	'creditNotes.markCreditNoteReadyToPush': {
		riskLevel: 'write',
		description: 'Mark a credit note as ready to push. Zoho Books API v3.',
	},
	'creditNotes.updateCreditNoteCfdiStatus': {
		riskLevel: 'write',
		description: 'Update a credit note CFDI status. Zoho Books API v3.',
	},
	'creditNotes.cancelEinvoiceCreditNote': {
		riskLevel: 'destructive',
		description: 'Cancel an e-invoice credit note. Zoho Books API v3.',
	},
	'currency.createCurrency': {
		riskLevel: 'write',
		description: 'Create a Currency. Zoho Books API v3.',
	},
	'currency.listCurrencies': {
		riskLevel: 'read',
		description: 'List Currencies. Zoho Books API v3.',
	},
	'currency.updateCurrency': {
		riskLevel: 'write',
		description: 'Update a Currency. Zoho Books API v3.',
	},
	'currency.getCurrency': {
		riskLevel: 'read',
		description: 'Get a Currency. Zoho Books API v3.',
	},
	'currency.deleteCurrency': {
		riskLevel: 'destructive',
		description: 'Delete a currency. Zoho Books API v3.',
	},
	'currency.listExchangeRates': {
		riskLevel: 'read',
		description: 'List exchange rates. Zoho Books API v3.',
	},
	'currency.createExchangeRate': {
		riskLevel: 'write',
		description: 'Create an exchange rate. Zoho Books API v3.',
	},
	'currency.getExchangeRate': {
		riskLevel: 'read',
		description: 'Get an exchange rate.. Zoho Books API v3.',
	},
	'currency.updateExchangeRate': {
		riskLevel: 'write',
		description: 'Update an exchange rate. Zoho Books API v3.',
	},
	'currency.deleteExchangeRate': {
		riskLevel: 'destructive',
		description: 'Delete an exchage rate. Zoho Books API v3.',
	},
	'customModules.listCustomModules': {
		riskLevel: 'read',
		description: 'List custom modules. Zoho Books API v3.',
	},
	'customModules.createCustomModule': {
		riskLevel: 'write',
		description: 'Create a custom module. Zoho Books API v3.',
	},
	'customModules.getCustomModule': {
		riskLevel: 'read',
		description: 'Get a custom module. Zoho Books API v3.',
	},
	'customModules.updateCustomModule': {
		riskLevel: 'write',
		description: 'Update a custom module. Zoho Books API v3.',
	},
	'customModules.deleteCustomModule': {
		riskLevel: 'destructive',
		description: 'Delete a custom module. Zoho Books API v3.',
	},
	'customModules.listCustomModuleRecords': {
		riskLevel: 'read',
		description: 'List custom module records. Zoho Books API v3.',
	},
	'customModules.bulkUpdateCustomModuleRecords': {
		riskLevel: 'write',
		description: 'Bulk update custom module records. Zoho Books API v3.',
	},
	'customModules.createCustomModuleRecord': {
		riskLevel: 'write',
		description: 'Create a custom module record. Zoho Books API v3.',
	},
	'customModules.deleteCustomModuleRecords': {
		riskLevel: 'destructive',
		description: 'Delete custom module records. Zoho Books API v3.',
	},
	'customModules.getCustomModuleRecord': {
		riskLevel: 'read',
		description: 'Get a custom module record. Zoho Books API v3.',
	},
	'customModules.updateCustomModuleRecord': {
		riskLevel: 'write',
		description: 'Update a custom module record. Zoho Books API v3.',
	},
	'customModules.deleteCustomModuleRecord': {
		riskLevel: 'destructive',
		description: 'Delete a custom module record. Zoho Books API v3.',
	},
	'customerDebitNotes.createCustomerDebitNote': {
		riskLevel: 'write',
		description: 'Create a customer debit note. Zoho Books API v3.',
	},
	'customerDebitNotes.listCustomerDebitNotes': {
		riskLevel: 'read',
		description: 'List customer debit notes. Zoho Books API v3.',
	},
	'customerDebitNotes.updateCustomerDebitNote': {
		riskLevel: 'write',
		description: 'Update a customer debit note. Zoho Books API v3.',
	},
	'customerDebitNotes.getCustomerDebitNote': {
		riskLevel: 'read',
		description: 'Get a customer debit note. Zoho Books API v3.',
	},
	'customerDebitNotes.deleteCustomerDebitNote': {
		riskLevel: 'destructive',
		description: 'Delete a customer debit note. Zoho Books API v3.',
	},
	'customerPayments.createCustomerPayment': {
		riskLevel: 'destructive',
		description: 'Create a payment. Zoho Books API v3.',
	},
	'customerPayments.listCustomerPayments': {
		riskLevel: 'read',
		description: 'List Customer Payments. Zoho Books API v3.',
	},
	'customerPayments.bulkDeleteCustomerPayments': {
		riskLevel: 'destructive',
		description: 'Bulk delete Customer payments. Zoho Books API v3.',
	},
	'customerPayments.updateCustomerPaymentUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update a payment using a custom field's unique value. Zoho Books API v3.",
	},
	'customerPayments.updateCustomerPayment': {
		riskLevel: 'write',
		description: 'Update a payment. Zoho Books API v3.',
	},
	'customerPayments.getCustomerPayment': {
		riskLevel: 'read',
		description: 'Retrieve a payment. Zoho Books API v3.',
	},
	'customerPayments.deleteCustomerPayment': {
		riskLevel: 'destructive',
		description: 'Delete a payment. Zoho Books API v3.',
	},
	'customerPayments.listCustomerPaymentRefunds': {
		riskLevel: 'read',
		description: 'List refunds of a customer payment. Zoho Books API v3.',
	},
	'customerPayments.createCustomerPaymentRefund': {
		riskLevel: 'destructive',
		description: 'Refund an excess customer payment. Zoho Books API v3.',
	},
	'customerPayments.updateCustomFieldsInCustomerPayment': {
		riskLevel: 'write',
		description:
			'Update custom field in existing customerpayments. Zoho Books API v3.',
	},
	'customerPayments.getCustomerPaymentRefund': {
		riskLevel: 'read',
		description: 'Details of a refund. Zoho Books API v3.',
	},
	'customerPayments.updateCustomerPaymentRefund': {
		riskLevel: 'destructive',
		description: 'Update a refund. Zoho Books API v3.',
	},
	'customerPayments.deleteCustomerPaymentRefund': {
		riskLevel: 'destructive',
		description: 'Delete a Refund. Zoho Books API v3.',
	},
	'deliveryChallans.listDeliveryChallans': {
		riskLevel: 'read',
		description: 'List delivery challans. Zoho Books API v3.',
	},
	'deliveryChallans.createDeliveryChallan': {
		riskLevel: 'write',
		description: 'Create a delivery challan. Zoho Books API v3.',
	},
	'deliveryChallans.getDeliveryChallan': {
		riskLevel: 'read',
		description: 'Retrieve a delivery challan. Zoho Books API v3.',
	},
	'deliveryChallans.updateDeliveryChallan': {
		riskLevel: 'write',
		description: 'Update a delivery challan. Zoho Books API v3.',
	},
	'deliveryChallans.deleteDeliveryChallan': {
		riskLevel: 'destructive',
		description: 'Delete a delivery challan. Zoho Books API v3.',
	},
	'deliveryChallans.markDeliveryChallanAsOpen': {
		riskLevel: 'write',
		description: 'Mark a delivery challan as open. Zoho Books API v3.',
	},
	'deliveryChallans.markDeliveryChallanAsDelivered': {
		riskLevel: 'write',
		description: 'Mark a delivery challan as delivered. Zoho Books API v3.',
	},
	'deliveryChallans.markDeliveryChallanAsReturned': {
		riskLevel: 'write',
		description: 'Mark a delivery challan as returned. Zoho Books API v3.',
	},
	'deliveryChallans.markDeliveryChallanAsUndelivered': {
		riskLevel: 'write',
		description: 'Mark a delivery challan as undelivered. Zoho Books API v3.',
	},
	'deliveryChallans.returnDeliveryChallans': {
		riskLevel: 'write',
		description: 'Return delivery challans. Zoho Books API v3.',
	},
	'deliveryChallans.undoReturnDeliveryChallans': {
		riskLevel: 'write',
		description: 'Undo return of delivery challans. Zoho Books API v3.',
	},
	'deliveryChallans.addAttachmentToDeliveryChallan': {
		riskLevel: 'write',
		description: 'Add attachment to a delivery challan. Zoho Books API v3.',
	},
	'deliveryChallans.getDeliveryChallanAttachment': {
		riskLevel: 'read',
		description: 'Get a delivery challan attachment. Zoho Books API v3.',
	},
	'deliveryChallans.deleteDeliveryChallanAttachment': {
		riskLevel: 'destructive',
		description: 'Delete a delivery challan attachment. Zoho Books API v3.',
	},
	'deliveryChallans.listDeliveryChallanTemplates': {
		riskLevel: 'read',
		description: 'List delivery challan templates. Zoho Books API v3.',
	},
	'deliveryChallans.updateDeliveryChallanTemplate': {
		riskLevel: 'write',
		description: 'Update a delivery challan template. Zoho Books API v3.',
	},
	'deliveryChallans.updateDeliveryChallanShippingAddress': {
		riskLevel: 'write',
		description: 'Update shipping address. Zoho Books API v3.',
	},
	'estimates.createEstimate': {
		riskLevel: 'write',
		description: 'Create an Estimate. Zoho Books API v3.',
	},
	'estimates.listEstimates': {
		riskLevel: 'read',
		description: 'List estimates. Zoho Books API v3.',
	},
	'estimates.updateEstimateUsingCustomField': {
		riskLevel: 'write',
		description:
			"update an Estimate using a custom field's unique value. Zoho Books API v3.",
	},
	'estimates.updateEstimate': {
		riskLevel: 'write',
		description: 'Update an Estimate. Zoho Books API v3.',
	},
	'estimates.getEstimate': {
		riskLevel: 'read',
		description: 'Get an estimate. Zoho Books API v3.',
	},
	'estimates.deleteEstimate': {
		riskLevel: 'destructive',
		description: 'Delete an Estimate. Zoho Books API v3.',
	},
	'estimates.updateCustomFieldsInEstimate': {
		riskLevel: 'write',
		description:
			'Update custom field in existing estimates. Zoho Books API v3.',
	},
	'estimates.markEstimateSent': {
		riskLevel: 'write',
		description: 'Mark an estimate as sent. Zoho Books API v3.',
	},
	'estimates.markEstimateAccepted': {
		riskLevel: 'write',
		description: 'Mark an estimate as accepted. Zoho Books API v3.',
	},
	'estimates.markEstimateDeclined': {
		riskLevel: 'write',
		description: 'Mark an estimate as declined. Zoho Books API v3.',
	},
	'estimates.submitEstimate': {
		riskLevel: 'write',
		description: 'Submit an estimate for approval. Zoho Books API v3.',
	},
	'estimates.approveEstimate': {
		riskLevel: 'destructive',
		description: 'Approve an estimate.. Zoho Books API v3.',
	},
	'estimates.emailEstimate': {
		riskLevel: 'destructive',
		description: 'Email an estimate. Zoho Books API v3.',
	},
	'estimates.getEstimateEmail': {
		riskLevel: 'read',
		description: 'Get estimate email content. Zoho Books API v3.',
	},
	'estimates.emailMultipleEstimates': {
		riskLevel: 'destructive',
		description: 'Email multiple estimates. Zoho Books API v3.',
	},
	'estimates.bulkExportEstimatesAsPdf': {
		riskLevel: 'read',
		description: 'Bulk export estimates. Zoho Books API v3.',
	},
	'estimates.bulkPrintEstimates': {
		riskLevel: 'read',
		description: 'Bulk print estimates. Zoho Books API v3.',
	},
	'estimates.updateEstimateBillingAddress': {
		riskLevel: 'write',
		description: 'Update billing address. Zoho Books API v3.',
	},
	'estimates.updateEstimateShippingAddress': {
		riskLevel: 'write',
		description: 'Update shipping address. Zoho Books API v3.',
	},
	'estimates.listEstimateTemplates': {
		riskLevel: 'read',
		description: 'List estimate template. Zoho Books API v3.',
	},
	'estimates.updateEstimateTemplate': {
		riskLevel: 'write',
		description: 'Update estimate template. Zoho Books API v3.',
	},
	'estimates.listEstimateComments': {
		riskLevel: 'read',
		description: 'List estimate comments & history. Zoho Books API v3.',
	},
	'estimates.createEstimateComment': {
		riskLevel: 'write',
		description: 'Add Comments. Zoho Books API v3.',
	},
	'estimates.updateEstimateComment': {
		riskLevel: 'write',
		description: 'Update comment. Zoho Books API v3.',
	},
	'estimates.deleteEstimateComment': {
		riskLevel: 'destructive',
		description: 'Delete a comment. Zoho Books API v3.',
	},
	'expenses.createExpense': {
		riskLevel: 'write',
		description: 'Create an Expense. Zoho Books API v3.',
	},
	'expenses.listExpenses': {
		riskLevel: 'read',
		description: 'List Expenses. Zoho Books API v3.',
	},
	'expenses.updateExpenseUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update an expense using a custom field's unique value. Zoho Books API v3.",
	},
	'expenses.updateExpense': {
		riskLevel: 'write',
		description: 'Update an Expense. Zoho Books API v3.',
	},
	'expenses.getExpense': {
		riskLevel: 'read',
		description: 'Get an Expense. Zoho Books API v3.',
	},
	'expenses.deleteExpense': {
		riskLevel: 'destructive',
		description: 'Delete an Expense. Zoho Books API v3.',
	},
	'expenses.listExpenseComments': {
		riskLevel: 'read',
		description: 'List expense History & Comments. Zoho Books API v3.',
	},
	'expenses.listEmployees': {
		riskLevel: 'read',
		description: 'List employees. Zoho Books API v3.',
	},
	'expenses.createEmployee': {
		riskLevel: 'write',
		description: 'Create an employee. Zoho Books API v3.',
	},
	'expenses.getEmployee': {
		riskLevel: 'read',
		description: 'Get an employee. Zoho Books API v3.',
	},
	'expenses.deleteEmployee': {
		riskLevel: 'destructive',
		description: 'Delete an employee. Zoho Books API v3.',
	},
	'expenses.getExpenseReceipt': {
		riskLevel: 'read',
		description: 'Get an expense receipt. Zoho Books API v3.',
	},
	'expenses.createExpenseReceipt': {
		riskLevel: 'write',
		description: 'Add receipt to an expense.. Zoho Books API v3.',
	},
	'expenses.deleteExpenseReceipt': {
		riskLevel: 'destructive',
		description: 'Delete a receipt. Zoho Books API v3.',
	},
	'expenses.addExpenseAttachment': {
		riskLevel: 'write',
		description: 'Add attachment to an expense. Zoho Books API v3.',
	},
	'fixedAssets.createFixedAsset': {
		riskLevel: 'write',
		description: 'Create a fixed asset. Zoho Books API v3.',
	},
	'fixedAssets.listFixedAssets': {
		riskLevel: 'read',
		description: 'Get fixed asset list. Zoho Books API v3.',
	},
	'fixedAssets.updateFixedAsset': {
		riskLevel: 'write',
		description: 'Update a fixed asset. Zoho Books API v3.',
	},
	'fixedAssets.getFixedAsset': {
		riskLevel: 'read',
		description: 'Get fixed asset. Zoho Books API v3.',
	},
	'fixedAssets.deleteFixedAsset': {
		riskLevel: 'destructive',
		description: 'Delete a fixed asset. Zoho Books API v3.',
	},
	'fixedAssets.getFixedAssetHistory': {
		riskLevel: 'read',
		description: 'Get fixed asset history. Zoho Books API v3.',
	},
	'fixedAssets.getFixedAssetForecast': {
		riskLevel: 'read',
		description: "Get fixed asset's forecast depreciation. Zoho Books API v3.",
	},
	'fixedAssets.markFixedAssetActive': {
		riskLevel: 'write',
		description: 'Mark fixed asset as active. Zoho Books API v3.',
	},
	'fixedAssets.markFixedAssetCancel': {
		riskLevel: 'destructive',
		description: 'Cancel fixed asset. Zoho Books API v3.',
	},
	'fixedAssets.markFixedAssetDraft': {
		riskLevel: 'write',
		description: 'Mark fixed asset as draft. Zoho Books API v3.',
	},
	'fixedAssets.writeOffFixedAsset': {
		riskLevel: 'destructive',
		description: 'Write off fixed asset. Zoho Books API v3.',
	},
	'fixedAssets.sellFixedAsset': {
		riskLevel: 'write',
		description: 'Sell fixed asset. Zoho Books API v3.',
	},
	'fixedAssets.createFixedAssetComment': {
		riskLevel: 'write',
		description: 'Add a comment. Zoho Books API v3.',
	},
	'fixedAssets.deleteFixedAssetComment': {
		riskLevel: 'destructive',
		description: 'Delete a comment. Zoho Books API v3.',
	},
	'fixedAssets.createFixedAssetType': {
		riskLevel: 'write',
		description: 'Create a fixed asset type. Zoho Books API v3.',
	},
	'fixedAssets.getFixedAssetTypeList': {
		riskLevel: 'read',
		description: 'Get fixed asset type list. Zoho Books API v3.',
	},
	'fixedAssets.updateFixedAssetType': {
		riskLevel: 'write',
		description: 'Update a fixed asset type. Zoho Books API v3.',
	},
	'fixedAssets.deleteFixedAssetType': {
		riskLevel: 'destructive',
		description: 'Delete a fixed asset type. Zoho Books API v3.',
	},
	'integration.importCustomerUsingCrmAccountId': {
		riskLevel: 'write',
		description:
			'Import a customer using the CRM account ID. Zoho Books API v3.',
	},
	'integration.importCustomerUsingCrmContactId': {
		riskLevel: 'write',
		description: 'Import a customer using CRM contact ID. Zoho Books API v3.',
	},
	'integration.importVendorUsingCrmVendorId': {
		riskLevel: 'write',
		description: 'Import a vendor using the CRM vendor ID. Zoho Books API v3.',
	},
	'integration.importItemUsingCrmProductId': {
		riskLevel: 'write',
		description: 'Import an item using the CRM product ID. Zoho Books API v3.',
	},
	'invoices.createInvoice': {
		riskLevel: 'write',
		description: 'Create an invoice. Zoho Books API v3.',
	},
	'invoices.listInvoices': {
		riskLevel: 'read',
		description: 'List invoices. Zoho Books API v3.',
	},
	'invoices.updateInvoiceUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update an invoice using a custom field's unique value. Zoho Books API v3.",
	},
	'invoices.deleteInvoices': {
		riskLevel: 'destructive',
		description: 'Delete invoices. Zoho Books API v3.',
	},
	'invoices.updateInvoice': {
		riskLevel: 'write',
		description: 'Update an invoice. Zoho Books API v3.',
	},
	'invoices.getInvoice': {
		riskLevel: 'read',
		description: 'Get an invoice. Zoho Books API v3.',
	},
	'invoices.deleteInvoice': {
		riskLevel: 'destructive',
		description: 'Delete an invoice. Zoho Books API v3.',
	},
	'invoices.markInvoiceSent': {
		riskLevel: 'write',
		description: 'Mark an invoice as sent. Zoho Books API v3.',
	},
	'invoices.markInvoiceVoid': {
		riskLevel: 'destructive',
		description: 'Void an invoice. Zoho Books API v3.',
	},
	'invoices.markInvoiceDraft': {
		riskLevel: 'write',
		description: 'Mark as draft. Zoho Books API v3.',
	},
	'invoices.emailInvoices': {
		riskLevel: 'destructive',
		description: 'Email multiple invoices. Zoho Books API v3.',
	},
	'invoices.createInvoiceFromSalesorder': {
		riskLevel: 'write',
		description: 'Create an instant invoice. Zoho Books API v3.',
	},
	'invoices.mapInvoiceWithSalesorder': {
		riskLevel: 'write',
		description: 'Associate invoices with sales order. Zoho Books API v3.',
	},
	'invoices.submitInvoice': {
		riskLevel: 'write',
		description: 'Submit an invoice for approval. Zoho Books API v3.',
	},
	'invoices.approveInvoice': {
		riskLevel: 'destructive',
		description: 'Approve an invoice.. Zoho Books API v3.',
	},
	'invoices.getInvoiceEmail': {
		riskLevel: 'read',
		description: 'Get invoice email content. Zoho Books API v3.',
	},
	'invoices.emailInvoice': {
		riskLevel: 'destructive',
		description: 'Email an invoice. Zoho Books API v3.',
	},
	'invoices.remindCustomerForInvoicePayment': {
		riskLevel: 'destructive',
		description: 'Remind Customer. Zoho Books API v3.',
	},
	'invoices.getPaymentReminderMailContentForInvoice': {
		riskLevel: 'read',
		description: 'Get payment reminder mail content. Zoho Books API v3.',
	},
	'invoices.bulkInvoiceReminder': {
		riskLevel: 'destructive',
		description: 'Bulk invoice reminder. Zoho Books API v3.',
	},
	'invoices.bulkExportInvoicesAsPdf': {
		riskLevel: 'read',
		description: 'Bulk export Invoices. Zoho Books API v3.',
	},
	'invoices.bulkPrintInvoices': {
		riskLevel: 'read',
		description: 'Bulk print invoices. Zoho Books API v3.',
	},
	'invoices.disableInvoicePaymentReminder': {
		riskLevel: 'write',
		description: 'Disable payment reminder. Zoho Books API v3.',
	},
	'invoices.enableInvoicePaymentReminder': {
		riskLevel: 'write',
		description: 'Enable payment reminder. Zoho Books API v3.',
	},
	'invoices.writeOffInvoice': {
		riskLevel: 'destructive',
		description: 'Write off invoice. Zoho Books API v3.',
	},
	'invoices.cancelWriteOffInvoice': {
		riskLevel: 'destructive',
		description: 'Cancel write off. Zoho Books API v3.',
	},
	'invoices.updateInvoiceBillingAddress': {
		riskLevel: 'write',
		description: 'Update billing address. Zoho Books API v3.',
	},
	'invoices.updateInvoiceShippingAddress': {
		riskLevel: 'write',
		description: 'Update shipping address. Zoho Books API v3.',
	},
	'invoices.listInvoiceTemplates': {
		riskLevel: 'read',
		description: 'List invoice templates. Zoho Books API v3.',
	},
	'invoices.updateInvoiceTemplate': {
		riskLevel: 'write',
		description: 'Update invoice template. Zoho Books API v3.',
	},
	'invoices.listInvoicePayments': {
		riskLevel: 'read',
		description: 'List invoice payments. Zoho Books API v3.',
	},
	'invoices.listInvoiceCreditsApplied': {
		riskLevel: 'read',
		description: 'List credits applied. Zoho Books API v3.',
	},
	'invoices.applyCreditsToInvoice': {
		riskLevel: 'write',
		description: 'Apply credits. Zoho Books API v3.',
	},
	'invoices.deleteInvoicePayment': {
		riskLevel: 'destructive',
		description: 'Delete a payment. Zoho Books API v3.',
	},
	'invoices.deleteInvoiceAppliedCredit': {
		riskLevel: 'destructive',
		description: 'Delete applied credit. Zoho Books API v3.',
	},
	'invoices.getInvoiceAttachment': {
		riskLevel: 'read',
		description: 'Get last attached attachment. Zoho Books API v3.',
	},
	'invoices.addInvoiceAttachment': {
		riskLevel: 'write',
		description: 'Add attachment to an invoice. Zoho Books API v3.',
	},
	'invoices.updateInvoiceAttachmentPreference': {
		riskLevel: 'write',
		description: 'Update attachment preference. Zoho Books API v3.',
	},
	'invoices.deleteInvoiceAttachment': {
		riskLevel: 'destructive',
		description: 'Delete last attached attachment. Zoho Books API v3.',
	},
	'invoices.getInvoiceDocumentDetails': {
		riskLevel: 'read',
		description: 'Retrieve Invoice Document. Zoho Books API v3.',
	},
	'invoices.deleteInvoiceDocument': {
		riskLevel: 'destructive',
		description: 'Delete Invoice attachment. Zoho Books API v3.',
	},
	'invoices.addInvoiceDocument': {
		riskLevel: 'write',
		description: 'Add a document to an invoice. Zoho Books API v3.',
	},
	'invoices.deleteInvoiceExpenseReceipt': {
		riskLevel: 'destructive',
		description: 'Delete the expense receipt. Zoho Books API v3.',
	},
	'invoices.updateCustomFieldsInInvoice': {
		riskLevel: 'write',
		description: 'Update custom field in existing invoices. Zoho Books API v3.',
	},
	'invoices.listInvoiceComments': {
		riskLevel: 'read',
		description: 'List invoice comments & history. Zoho Books API v3.',
	},
	'invoices.addInvoiceComment': {
		riskLevel: 'write',
		description: 'Add comment. Zoho Books API v3.',
	},
	'invoices.updateInvoiceComment': {
		riskLevel: 'write',
		description: 'Update comment. Zoho Books API v3.',
	},
	'invoices.deleteInvoiceComment': {
		riskLevel: 'destructive',
		description: 'Delete a comment. Zoho Books API v3.',
	},
	'invoices.generateInvoicePaymentLink': {
		riskLevel: 'read',
		description: 'Generate payment link. Zoho Books API v3.',
	},
	'invoices.approveInvoices': {
		riskLevel: 'destructive',
		description: 'Approve invoices. Zoho Books API v3.',
	},
	'invoices.voidInvoices': {
		riskLevel: 'destructive',
		description: 'Mark invoices as void. Zoho Books API v3.',
	},
	'invoices.createInvoicesFromProjects': {
		riskLevel: 'write',
		description: 'Create invoices from projects. Zoho Books API v3.',
	},
	'invoices.getInvoiceDeliveryNotes': {
		riskLevel: 'read',
		description: 'Get delivery notes for invoices. Zoho Books API v3.',
	},
	'invoices.getInvoicePackingSlips': {
		riskLevel: 'read',
		description: 'Get packing slips for invoices. Zoho Books API v3.',
	},
	'invoices.finalizeInvoiceApproval': {
		riskLevel: 'destructive',
		description: 'Finalize approval of an invoice. Zoho Books API v3.',
	},
	'invoices.rejectInvoice': {
		riskLevel: 'destructive',
		description: 'Reject an invoice. Zoho Books API v3.',
	},
	'invoices.sendInvoiceViaSnailMail': {
		riskLevel: 'destructive',
		description: 'Send an invoice via snail mail. Zoho Books API v3.',
	},
	'invoices.addInvoiceOnlinePaymentBankAccount': {
		riskLevel: 'destructive',
		description:
			'Add a bank account for invoice online payments. Zoho Books API v3.',
	},
	'invoices.applyPricebookToInvoice': {
		riskLevel: 'write',
		description: 'Apply a price book to an invoice. Zoho Books API v3.',
	},
	'invoices.submitInvoices': {
		riskLevel: 'write',
		description: 'Submit invoices for approval. Zoho Books API v3.',
	},
	'invoices.markInvoicesSent': {
		riskLevel: 'write',
		description: 'Mark invoices as sent. Zoho Books API v3.',
	},
	'invoices.writeOffInvoices': {
		riskLevel: 'destructive',
		description: 'Write off invoices. Zoho Books API v3.',
	},
	'invoices.markInvoicesShipped': {
		riskLevel: 'write',
		description: 'Mark invoices as shipped. Zoho Books API v3.',
	},
	'invoices.unshipInvoices': {
		riskLevel: 'write',
		description: 'Mark invoices as unshipped. Zoho Books API v3.',
	},
	'invoices.createInvoicesFromEstimates': {
		riskLevel: 'write',
		description: 'Create invoices from estimates. Zoho Books API v3.',
	},
	'invoices.previewInvoiceCoupons': {
		riskLevel: 'write',
		description: 'Preview invoice with coupons. Zoho Books API v3.',
	},
	'invoices.unmapInvoicesFromSalesorders': {
		riskLevel: 'write',
		description: 'Unmap invoices from sales orders. Zoho Books API v3.',
	},
	'invoices.getInvoiceDashboard': {
		riskLevel: 'read',
		description: 'Get invoice dashboard. Zoho Books API v3.',
	},
	'invoices.getInvoiceByReference': {
		riskLevel: 'read',
		description: 'Get an invoice by reference. Zoho Books API v3.',
	},
	'invoices.getInvoiceCustomFields': {
		riskLevel: 'read',
		description: 'Get invoice custom fields. Zoho Books API v3.',
	},
	'invoices.getInvoiceAdvancedTrackingDetails': {
		riskLevel: 'read',
		description: 'Get invoice advanced tracking details. Zoho Books API v3.',
	},
	'invoices.updateInvoiceAdvancedTrackingDetails': {
		riskLevel: 'write',
		description: 'Update invoice advanced tracking details. Zoho Books API v3.',
	},
	'invoices.printInvoiceDeliveryNote': {
		riskLevel: 'read',
		description: 'Print invoice delivery note. Zoho Books API v3.',
	},
	'invoices.printInvoicePackingSlip': {
		riskLevel: 'read',
		description: 'Print invoice packing slip. Zoho Books API v3.',
	},
	'invoices.getInvoiceQrCode': {
		riskLevel: 'read',
		description: 'Get invoice QR code. Zoho Books API v3.',
	},
	'invoices.getInvoiceSms': {
		riskLevel: 'read',
		description: 'Get invoice SMS content. Zoho Books API v3.',
	},
	'invoices.sendInvoiceSms': {
		riskLevel: 'destructive',
		description: 'Send invoice by SMS. Zoho Books API v3.',
	},
	'invoices.getInvoiceSignatureTemplate': {
		riskLevel: 'read',
		description: 'Get invoice signature template. Zoho Books API v3.',
	},
	'invoices.addInvoiceDigitalSignature': {
		riskLevel: 'destructive',
		description: 'Add a digital signature to an invoice. Zoho Books API v3.',
	},
	'invoices.uploadInvoiceDigitalSignature': {
		riskLevel: 'write',
		description: 'Upload a signed invoice. Zoho Books API v3.',
	},
	'invoices.uploadInvoiceDocument': {
		riskLevel: 'write',
		description: 'Upload an invoice document file. Zoho Books API v3.',
	},
	'invoices.updateInvoiceCfdiStatus': {
		riskLevel: 'write',
		description: 'Update an invoice CFDI status. Zoho Books API v3.',
	},
	'invoices.cancelInvoice': {
		riskLevel: 'destructive',
		description: 'Cancel an invoice. Zoho Books API v3.',
	},
	'invoices.markInvoiceReadyToPush': {
		riskLevel: 'write',
		description: 'Mark an invoice as ready to push. Zoho Books API v3.',
	},
	'invoices.applyInvoiceSubstatus': {
		riskLevel: 'write',
		description: 'Apply a sub-status to an invoice. Zoho Books API v3.',
	},
	'invoices.deleteInvoiceSubstatus': {
		riskLevel: 'destructive',
		description: 'Delete an invoice sub-status. Zoho Books API v3.',
	},
	'invoices.deleteInvoiceLineItem': {
		riskLevel: 'destructive',
		description: 'Delete an invoice line item. Zoho Books API v3.',
	},
	'invoices.scheduleInvoiceEmail': {
		riskLevel: 'destructive',
		description: 'Schedule an invoice email. Zoho Books API v3.',
	},
	'invoices.cancelScheduledInvoiceEmail': {
		riskLevel: 'destructive',
		description: 'Cancel a scheduled invoice email. Zoho Books API v3.',
	},
	'invoices.forcePayInvoice': {
		riskLevel: 'destructive',
		description: 'Force pay an invoice. Zoho Books API v3.',
	},
	'invoices.mailInvoicePdf': {
		riskLevel: 'destructive',
		description: 'Email an invoice as PDF. Zoho Books API v3.',
	},
	'invoices.createInvoiceSynchronousOnlinePayment': {
		riskLevel: 'destructive',
		description:
			'Process a synchronous online payment for an invoice. Zoho Books API v3.',
	},
	'invoices.createInvoiceAsynchronousOnlinePayment': {
		riskLevel: 'destructive',
		description:
			'Process an asynchronous online payment for an invoice. Zoho Books API v3.',
	},
	'invoices.getInvoicePaymentQr': {
		riskLevel: 'read',
		description: 'Get invoice online payment QR code. Zoho Books API v3.',
	},
	'invoices.getInvoicePaymentQrStatus': {
		riskLevel: 'read',
		description: 'Get invoice online payment QR status. Zoho Books API v3.',
	},
	'invoices.sendInvoiceDunningNotifications': {
		riskLevel: 'destructive',
		description: 'Send invoice dunning notifications. Zoho Books API v3.',
	},
	'invoices.sendInvoiceRetrySms': {
		riskLevel: 'destructive',
		description: 'Resend invoice payment SMS. Zoho Books API v3.',
	},
	'invoices.getInvoiceMetadata': {
		riskLevel: 'read',
		description: 'Get invoice metadata. Zoho Books API v3.',
	},
	'invoices.updateInvoiceMetadata': {
		riskLevel: 'write',
		description: 'Update invoice metadata. Zoho Books API v3.',
	},
	'invoices.listInvoicesEinvoice': {
		riskLevel: 'read',
		description: 'List invoice e-invoices. Zoho Books API v3.',
	},
	'invoices.pushInvoicesEinvoice': {
		riskLevel: 'destructive',
		description: 'Push invoice e-invoices. Zoho Books API v3.',
	},
	'invoices.cancelInvoicesEinvoice': {
		riskLevel: 'destructive',
		description: 'Cancel invoice e-invoices. Zoho Books API v3.',
	},
	'invoices.getInvoiceEinvoice': {
		riskLevel: 'read',
		description: 'Get an invoice e-invoice. Zoho Books API v3.',
	},
	'invoices.pushInvoiceEinvoice': {
		riskLevel: 'destructive',
		description: 'Push an invoice e-invoice. Zoho Books API v3.',
	},
	'invoices.cancelInvoiceEinvoice': {
		riskLevel: 'destructive',
		description: 'Cancel an invoice e-invoice. Zoho Books API v3.',
	},
	'invoices.fetchInvoiceEinvoice': {
		riskLevel: 'write',
		description: 'Fetch an invoice e-invoice. Zoho Books API v3.',
	},
	'invoices.deleteInvoiceEinvoiceStatus': {
		riskLevel: 'destructive',
		description: 'Delete an invoice e-invoice status. Zoho Books API v3.',
	},
	'invoices.markInvoiceEinvoicePushed': {
		riskLevel: 'write',
		description:
			'Mark an invoice e-invoice as manually pushed. Zoho Books API v3.',
	},
	'invoices.markInvoiceEinvoiceCancelled': {
		riskLevel: 'destructive',
		description: 'Mark an invoice e-invoice as cancelled. Zoho Books API v3.',
	},
	'invoices.recallInvoiceEinvoiceStatus': {
		riskLevel: 'destructive',
		description: 'Recall an invoice e-invoice status. Zoho Books API v3.',
	},
	'invoices.updateInvoiceEinvoicePaymentStatus': {
		riskLevel: 'write',
		description:
			'Update an invoice e-invoice payment status. Zoho Books API v3.',
	},
	'invoices.cancelEinvoiceInvoice': {
		riskLevel: 'destructive',
		description: 'Cancel an e-invoice invoice. Zoho Books API v3.',
	},
	'items.createItem': {
		riskLevel: 'write',
		description: 'Create an Item. Zoho Books API v3.',
	},
	'items.listItems': {
		riskLevel: 'read',
		description: 'List items. Zoho Books API v3.',
	},
	'items.updateItemUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update an item using a custom field's unique value. Zoho Books API v3.",
	},
	'items.listItemDetails': {
		riskLevel: 'read',
		description: 'Bulk fetch item details. Zoho Books API v3.',
	},
	'items.updateItem': {
		riskLevel: 'write',
		description: 'Update an item. Zoho Books API v3.',
	},
	'items.getItem': {
		riskLevel: 'read',
		description: 'Get an item. Zoho Books API v3.',
	},
	'items.deleteItem': {
		riskLevel: 'destructive',
		description: 'Delete an item. Zoho Books API v3.',
	},
	'items.updateCustomFieldsInItem': {
		riskLevel: 'write',
		description: 'Update custom field in existing items. Zoho Books API v3.',
	},
	'items.markItemActive': {
		riskLevel: 'write',
		description: 'Mark as active. Zoho Books API v3.',
	},
	'items.markItemInactive': {
		riskLevel: 'write',
		description: 'Mark as inactive. Zoho Books API v3.',
	},
	'items.createItemMaster': {
		riskLevel: 'write',
		description: 'Create an item. Zoho Books API v3.',
	},
	'items.listItemMasters': {
		riskLevel: 'read',
		description: 'List items. Zoho Books API v3.',
	},
	'items.getItemMaster': {
		riskLevel: 'read',
		description: 'Retrieve an item. Zoho Books API v3.',
	},
	'items.updateItemMaster': {
		riskLevel: 'write',
		description: 'Update an item. Zoho Books API v3.',
	},
	'items.deleteItemMaster': {
		riskLevel: 'destructive',
		description: 'Delete an item. Zoho Books API v3.',
	},
	'items.bulkMarkItemMastersActive': {
		riskLevel: 'write',
		description: 'Bulk mark items as active. Zoho Books API v3.',
	},
	'items.bulkMarkItemMastersInactive': {
		riskLevel: 'write',
		description: 'Bulk mark items as inactive. Zoho Books API v3.',
	},
	'items.markItemMasterAsActive': {
		riskLevel: 'write',
		description: 'Mark an item as active. Zoho Books API v3.',
	},
	'items.markItemMasterAsInactive': {
		riskLevel: 'write',
		description: 'Mark an item as inactive. Zoho Books API v3.',
	},
	'items.createItemVariant': {
		riskLevel: 'write',
		description: 'Create an item variant. Zoho Books API v3.',
	},
	'items.listItemVariants': {
		riskLevel: 'read',
		description: 'List item variants. Zoho Books API v3.',
	},
	'items.bulkDeleteItemVariants': {
		riskLevel: 'destructive',
		description: 'Bulk delete item variants. Zoho Books API v3.',
	},
	'items.getItemVariant': {
		riskLevel: 'read',
		description: 'Retrieve an item variant. Zoho Books API v3.',
	},
	'items.updateItemVariant': {
		riskLevel: 'write',
		description: 'Update an item variant. Zoho Books API v3.',
	},
	'items.deleteItemVariant': {
		riskLevel: 'destructive',
		description: 'Delete an item variant. Zoho Books API v3.',
	},
	'items.bulkMarkItemVariantsActive': {
		riskLevel: 'write',
		description: 'Bulk mark item variants as active. Zoho Books API v3.',
	},
	'items.bulkMarkItemVariantsInactive': {
		riskLevel: 'write',
		description: 'Bulk mark item variants as inactive. Zoho Books API v3.',
	},
	'items.markItemVariantAsActive': {
		riskLevel: 'write',
		description: 'Mark an item variant as active. Zoho Books API v3.',
	},
	'items.markItemVariantAsInactive': {
		riskLevel: 'write',
		description: 'Mark an item variant as inactive. Zoho Books API v3.',
	},
	'items.moveItemVariant': {
		riskLevel: 'write',
		description: 'Move an item variant. Zoho Books API v3.',
	},
	'items.ungroupItemVariants': {
		riskLevel: 'write',
		description: 'Mark item variants as single items. Zoho Books API v3.',
	},
	'journals.createJournal': {
		riskLevel: 'write',
		description: 'Create a journal. Zoho Books API v3.',
	},
	'journals.listJournals': {
		riskLevel: 'read',
		description: 'Get journal list. Zoho Books API v3.',
	},
	'journals.updateJournal': {
		riskLevel: 'write',
		description: 'Update a journal. Zoho Books API v3.',
	},
	'journals.getJournal': {
		riskLevel: 'read',
		description: 'Get journal. Zoho Books API v3.',
	},
	'journals.deleteJournal': {
		riskLevel: 'destructive',
		description: 'Delete a journal. Zoho Books API v3.',
	},
	'journals.markJournalPublished': {
		riskLevel: 'write',
		description: 'Mark a journal as published. Zoho Books API v3.',
	},
	'journals.addJournalAttachment': {
		riskLevel: 'write',
		description: 'Add attachment to a journal. Zoho Books API v3.',
	},
	'journals.addJournalComment': {
		riskLevel: 'write',
		description: 'Add comment. Zoho Books API v3.',
	},
	'journals.deleteJournalComment': {
		riskLevel: 'destructive',
		description: 'Delete a comment. Zoho Books API v3.',
	},
	'journals.reverseJournal': {
		riskLevel: 'write',
		description: 'Reverse a journal. Zoho Books API v3.',
	},
	'journals.submitJournalForApproval': {
		riskLevel: 'write',
		description: 'Submit a journal for approval. Zoho Books API v3.',
	},
	'journals.approveJournal': {
		riskLevel: 'destructive',
		description: 'Approve a journal. Zoho Books API v3.',
	},
	'journals.rejectJournal': {
		riskLevel: 'destructive',
		description: 'Reject a journal. Zoho Books API v3.',
	},
	'journals.listJournalCredits': {
		riskLevel: 'read',
		description: 'List available credits of a journal. Zoho Books API v3.',
	},
	'journals.applyJournalCreditsToInvoices': {
		riskLevel: 'write',
		description: 'Apply journal credits to invoices. Zoho Books API v3.',
	},
	'journals.applyJournalCreditsToBills': {
		riskLevel: 'write',
		description: 'Apply journal credits to bills. Zoho Books API v3.',
	},
	'journals.deleteJournalCreditsReceivables': {
		riskLevel: 'destructive',
		description: 'Delete applied credits from receivables. Zoho Books API v3.',
	},
	'journals.deleteJournalCreditsPayables': {
		riskLevel: 'destructive',
		description: 'Delete applied credits from payables. Zoho Books API v3.',
	},
	'journals.bulkSubmitJournals': {
		riskLevel: 'write',
		description: 'Bulk submit journals for approval. Zoho Books API v3.',
	},
	'journals.bulkApproveJournals': {
		riskLevel: 'destructive',
		description: 'Bulk approve journals. Zoho Books API v3.',
	},
	'journals.bulkPublishJournals': {
		riskLevel: 'write',
		description: 'Bulk publish journals. Zoho Books API v3.',
	},
	'journals.bulkDeleteJournals': {
		riskLevel: 'destructive',
		description: 'Bulk delete journals. Zoho Books API v3.',
	},
	'journals.createRecurringJournal': {
		riskLevel: 'write',
		description: 'Create a recurring journal. Zoho Books API v3.',
	},
	'journals.listRecurringJournals': {
		riskLevel: 'read',
		description: 'List recurring journals. Zoho Books API v3.',
	},
	'journals.getRecurringJournal': {
		riskLevel: 'read',
		description: 'Get a recurring journal. Zoho Books API v3.',
	},
	'journals.updateRecurringJournal': {
		riskLevel: 'write',
		description: 'Update a recurring journal. Zoho Books API v3.',
	},
	'journals.deleteRecurringJournal': {
		riskLevel: 'destructive',
		description: 'Delete a recurring journal. Zoho Books API v3.',
	},
	'journals.resumeRecurringJournal': {
		riskLevel: 'write',
		description: 'Resume a recurring journal. Zoho Books API v3.',
	},
	'journals.stopRecurringJournal': {
		riskLevel: 'write',
		description: 'Stop a recurring journal. Zoho Books API v3.',
	},
	'journals.listChildJournals': {
		riskLevel: 'read',
		description:
			'List child journals of a recurring journal. Zoho Books API v3.',
	},
	'journals.getTransactionJournalView': {
		riskLevel: 'read',
		description: 'Get journal view of a transaction. Zoho Books API v3.',
	},
	'locations.enableLocations': {
		riskLevel: 'write',
		description: 'Enable Locations. Zoho Books API v3.',
	},
	'locations.createLocation': {
		riskLevel: 'write',
		description: 'Create a location. Zoho Books API v3.',
	},
	'locations.listLocations': {
		riskLevel: 'read',
		description: 'List all locations. Zoho Books API v3.',
	},
	'locations.updateLocation': {
		riskLevel: 'write',
		description: 'Update location. Zoho Books API v3.',
	},
	'locations.deleteLocation': {
		riskLevel: 'destructive',
		description: 'Delete a location. Zoho Books API v3.',
	},
	'locations.markLocationActive': {
		riskLevel: 'write',
		description: 'Mark as Active. Zoho Books API v3.',
	},
	'locations.markLocationInactive': {
		riskLevel: 'write',
		description: 'Mark as Inactive. Zoho Books API v3.',
	},
	'locations.markLocationPrimary': {
		riskLevel: 'write',
		description: 'Mark as Primary. Zoho Books API v3.',
	},
	'openingBalance.createOpeningBalance': {
		riskLevel: 'write',
		description: 'Create opening balance. Zoho Books API v3.',
	},
	'openingBalance.updateOpeningBalance': {
		riskLevel: 'write',
		description: 'Update opening balance. Zoho Books API v3.',
	},
	'openingBalance.getOpeningBalance': {
		riskLevel: 'read',
		description: 'Get opening balance. Zoho Books API v3.',
	},
	'openingBalance.deleteOpeningBalance': {
		riskLevel: 'destructive',
		description: 'Delete opening balance. Zoho Books API v3.',
	},
	'openingBalance.listOpeningBalanceDetails': {
		riskLevel: 'read',
		description: 'List opening balance account details. Zoho Books API v3.',
	},
	'openingBalance.listOpeningBalanceTransactions': {
		riskLevel: 'read',
		description: 'List opening balance transactions. Zoho Books API v3.',
	},
	'openingBalance.writeoffOpeningBalance': {
		riskLevel: 'destructive',
		description: 'Write off an opening balance. Zoho Books API v3.',
	},
	'openingBalance.cancelWriteoffOpeningBalance': {
		riskLevel: 'destructive',
		description: 'Cancel a write-off. Zoho Books API v3.',
	},
	'organizations.createOrganization': {
		riskLevel: 'write',
		description: 'Create an organization. Zoho Books API v3.',
	},
	'organizations.listOrganizations': {
		riskLevel: 'read',
		description: 'List organizations. Zoho Books API v3.',
	},
	'organizations.updateOrganization': {
		riskLevel: 'write',
		description: 'Update an organization. Zoho Books API v3.',
	},
	'organizations.getOrganization': {
		riskLevel: 'read',
		description: 'Get an organization. Zoho Books API v3.',
	},
	'organizations.listOrganizationsForUser': {
		riskLevel: 'read',
		description: 'List organizations for a user. Zoho Books API v3.',
	},
	'organizations.getOrganizationAddress': {
		riskLevel: 'read',
		description: 'Get the organization address. Zoho Books API v3.',
	},
	'organizations.createOrganizationAddress': {
		riskLevel: 'write',
		description: 'Create the organization address. Zoho Books API v3.',
	},
	'organizations.updateOrganizationAddress': {
		riskLevel: 'write',
		description: 'Update the organization address. Zoho Books API v3.',
	},
	'organizations.deleteOrganizationAddress': {
		riskLevel: 'destructive',
		description: 'Delete the organization address. Zoho Books API v3.',
	},
	'organizations.copyOrganizationSettings': {
		riskLevel: 'write',
		description: 'Copy settings to an organization. Zoho Books API v3.',
	},
	'organizations.downgradeOrganizationToInvoice': {
		riskLevel: 'destructive',
		description:
			'Downgrade an organization to Zoho Invoice. Zoho Books API v3.',
	},
	'organizations.upgradeOrganizationToBooks': {
		riskLevel: 'write',
		description: 'Upgrade an organization to Zoho Books. Zoho Books API v3.',
	},
	'organizations.markOrganizationInactive': {
		riskLevel: 'write',
		description: 'Mark an organization as inactive. Zoho Books API v3.',
	},
	'pricelists.createPricebook': {
		riskLevel: 'write',
		description: 'Create a pricebook. Zoho Books API v3.',
	},
	'pricelists.listPricebooks': {
		riskLevel: 'read',
		description: 'List all pricebooks. Zoho Books API v3.',
	},
	'pricelists.updatePricebook': {
		riskLevel: 'write',
		description: 'Update pricebook. Zoho Books API v3.',
	},
	'pricelists.deletePricebook': {
		riskLevel: 'destructive',
		description: 'Delete the pricebook. Zoho Books API v3.',
	},
	'pricelists.markPricebookActive': {
		riskLevel: 'write',
		description: 'Mark as Active. Zoho Books API v3.',
	},
	'pricelists.markPricebookInactive': {
		riskLevel: 'write',
		description: 'Mark as Inactive. Zoho Books API v3.',
	},
	'projects.createProject': {
		riskLevel: 'write',
		description: 'Create a project. Zoho Books API v3.',
	},
	'projects.listProjects': {
		riskLevel: 'read',
		description: 'List projects. Zoho Books API v3.',
	},
	'projects.updateProjectsUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update a project using a custom field's unique value. Zoho Books API v3.",
	},
	'projects.updateProject': {
		riskLevel: 'write',
		description: 'Update project. Zoho Books API v3.',
	},
	'projects.getProject': {
		riskLevel: 'read',
		description: 'Get a project. Zoho Books API v3.',
	},
	'projects.deleteProject': {
		riskLevel: 'destructive',
		description: 'Delete project. Zoho Books API v3.',
	},
	'projects.markProjectActive': {
		riskLevel: 'write',
		description: 'Activate project. Zoho Books API v3.',
	},
	'projects.markProjectInactive': {
		riskLevel: 'write',
		description: 'Inactivate a project. Zoho Books API v3.',
	},
	'projects.cloneProject': {
		riskLevel: 'write',
		description: 'Clone project. Zoho Books API v3.',
	},
	'projects.addProjectUser': {
		riskLevel: 'write',
		description: 'Assign users. Zoho Books API v3.',
	},
	'projects.listProjectUsers': {
		riskLevel: 'read',
		description: 'List Users. Zoho Books API v3.',
	},
	'projects.inviteProjectUser': {
		riskLevel: 'destructive',
		description: 'Invite user. Zoho Books API v3.',
	},
	'projects.updateProjectUser': {
		riskLevel: 'write',
		description: 'Update user. Zoho Books API v3.',
	},
	'projects.getProjectUser': {
		riskLevel: 'read',
		description: 'Get a Project User. Zoho Books API v3.',
	},
	'projects.deleteProjectUser': {
		riskLevel: 'destructive',
		description: 'Delete user. Zoho Books API v3.',
	},
	'projects.addProjectComment': {
		riskLevel: 'write',
		description: 'Post comment. Zoho Books API v3.',
	},
	'projects.listProjectComments': {
		riskLevel: 'read',
		description: 'List comments. Zoho Books API v3.',
	},
	'projects.deleteProjectComment': {
		riskLevel: 'destructive',
		description: 'Delete comment. Zoho Books API v3.',
	},
	'projects.listProjectInvoices': {
		riskLevel: 'read',
		description: 'List invoices. Zoho Books API v3.',
	},
	'projects.addProjectTask': {
		riskLevel: 'write',
		description: 'Add a project task. Zoho Books API v3.',
	},
	'projects.listProjectTasks': {
		riskLevel: 'read',
		description: 'List project tasks. Zoho Books API v3.',
	},
	'projects.updateProjectTask': {
		riskLevel: 'write',
		description: 'Update a project task. Zoho Books API v3.',
	},
	'projects.getProjectTask': {
		riskLevel: 'read',
		description: 'Get a project task. Zoho Books API v3.',
	},
	'projects.deleteProjectTask': {
		riskLevel: 'destructive',
		description: 'Delete project Task. Zoho Books API v3.',
	},
	'purchaseOrder.createPurchaseOrder': {
		riskLevel: 'write',
		description: 'Create a purchase order. Zoho Books API v3.',
	},
	'purchaseOrder.listPurchaseOrders': {
		riskLevel: 'read',
		description: 'List purchase orders. Zoho Books API v3.',
	},
	'purchaseOrder.updatePurchaseOrderUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update a purchase order using a custom field's unique value. Zoho Books API v3.",
	},
	'purchaseOrder.updatePurchaseOrder': {
		riskLevel: 'write',
		description: 'Update a purchase order. Zoho Books API v3.',
	},
	'purchaseOrder.getPurchaseOrder': {
		riskLevel: 'read',
		description: 'Get a purchase order. Zoho Books API v3.',
	},
	'purchaseOrder.deletePurchaseOrder': {
		riskLevel: 'destructive',
		description: 'Delete purchase order. Zoho Books API v3.',
	},
	'purchaseOrder.updateCustomFieldsInPurchaseOrder': {
		riskLevel: 'write',
		description:
			'Update custom field in existing purchaseorders. Zoho Books API v3.',
	},
	'purchaseOrder.markPurchaseOrderOpen': {
		riskLevel: 'write',
		description: 'Mark a purchase order as open. Zoho Books API v3.',
	},
	'purchaseOrder.markPurchaseOrderBilled': {
		riskLevel: 'write',
		description: 'Mark as billed. Zoho Books API v3.',
	},
	'purchaseOrder.markPurchaseOrderCancelled': {
		riskLevel: 'destructive',
		description: 'Cancel a purchase order. Zoho Books API v3.',
	},
	'purchaseOrder.submitPurchaseOrder': {
		riskLevel: 'write',
		description: 'Submit a purchase order for approval. Zoho Books API v3.',
	},
	'purchaseOrder.approvePurchaseOrder': {
		riskLevel: 'destructive',
		description: 'Approve a purchase order. Zoho Books API v3.',
	},
	'purchaseOrder.emailPurchaseOrder': {
		riskLevel: 'destructive',
		description: 'Email a purchase order. Zoho Books API v3.',
	},
	'purchaseOrder.getPurchaseOrderEmail': {
		riskLevel: 'read',
		description: 'Get purchase order email content. Zoho Books API v3.',
	},
	'purchaseOrder.updatePurchaseOrderBillingAddress': {
		riskLevel: 'write',
		description: 'Update billing address. Zoho Books API v3.',
	},
	'purchaseOrder.listPurchaseOrderTemplates': {
		riskLevel: 'read',
		description: 'List purchase order templates. Zoho Books API v3.',
	},
	'purchaseOrder.updatePurchaseOrderTemplate': {
		riskLevel: 'write',
		description: 'Update purchase order template. Zoho Books API v3.',
	},
	'purchaseOrder.getPurchaseOrderAttachment': {
		riskLevel: 'read',
		description: 'Get a purchase order attachment. Zoho Books API v3.',
	},
	'purchaseOrder.addPurchaseOrderAttachment': {
		riskLevel: 'write',
		description: 'Add attachment to a purchase order. Zoho Books API v3.',
	},
	'purchaseOrder.updatePurchaseOrderAttachment': {
		riskLevel: 'write',
		description: 'Update attachment preference. Zoho Books API v3.',
	},
	'purchaseOrder.deletePurchaseOrderAttachment': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. Zoho Books API v3.',
	},
	'purchaseOrder.listPurchaseOrderComments': {
		riskLevel: 'read',
		description: 'List purchase order comments & history. Zoho Books API v3.',
	},
	'purchaseOrder.addPurchaseOrderComment': {
		riskLevel: 'write',
		description: 'Add comment. Zoho Books API v3.',
	},
	'purchaseOrder.updatePurchaseOrderComment': {
		riskLevel: 'write',
		description: 'Update comment. Zoho Books API v3.',
	},
	'purchaseOrder.deletePurchaseOrderComment': {
		riskLevel: 'destructive',
		description: 'Delete a comment. Zoho Books API v3.',
	},
	'purchaseOrder.rejectPurchaseOrders': {
		riskLevel: 'destructive',
		description: 'Reject Purchase Order. Zoho Books API v3.',
	},
	'purchaseReturns.createPurchaseReturn': {
		riskLevel: 'write',
		description: 'Create a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.listPurchaseReturns': {
		riskLevel: 'read',
		description: 'List purchase returns. Zoho Books API v3.',
	},
	'purchaseReturns.getPurchaseReturn': {
		riskLevel: 'read',
		description: 'Retrieve a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.updatePurchaseReturn': {
		riskLevel: 'write',
		description: 'Update a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.deletePurchaseReturn': {
		riskLevel: 'destructive',
		description: 'Delete a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.confirmPurchaseReturn': {
		riskLevel: 'write',
		description: 'Confirm a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.voidPurchaseReturn': {
		riskLevel: 'destructive',
		description: 'Void a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.fulfillPurchaseReturn': {
		riskLevel: 'write',
		description: 'Fulfill a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.unfulfillPurchaseReturn': {
		riskLevel: 'write',
		description: 'Unfulfill a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.emailPurchaseReturn': {
		riskLevel: 'destructive',
		description: 'Email a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.addAttachmentToPurchaseReturn': {
		riskLevel: 'write',
		description: 'Add attachment to a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.closePurchaseReturn': {
		riskLevel: 'destructive',
		description: 'Close a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.reopenPurchaseReturn': {
		riskLevel: 'write',
		description: 'Reopen a purchase return. Zoho Books API v3.',
	},
	'purchaseReturns.updatePurchaseReturnShippingAddress': {
		riskLevel: 'write',
		description: 'Update shipping address. Zoho Books API v3.',
	},
	'purchaseReturns.updatePurchaseReturnBillingAddress': {
		riskLevel: 'write',
		description: 'Update billing address. Zoho Books API v3.',
	},
	'purchaseReturns.deletePurchaseReturnAttachment': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. Zoho Books API v3.',
	},
	'recurringBills.createRecurringBill': {
		riskLevel: 'write',
		description: 'Create a recurring bill. Zoho Books API v3.',
	},
	'recurringBills.listRecurringBills': {
		riskLevel: 'read',
		description: 'List recurring bills. Zoho Books API v3.',
	},
	'recurringBills.updateRecurringBillUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update a recurring bill using a custom field's unique value. Zoho Books API v3.",
	},
	'recurringBills.updateRecurringBill': {
		riskLevel: 'write',
		description: 'Update a recurring bill. Zoho Books API v3.',
	},
	'recurringBills.getRecurringBill': {
		riskLevel: 'read',
		description: 'Get a recurring bill. Zoho Books API v3.',
	},
	'recurringBills.deleteRecurringBill': {
		riskLevel: 'destructive',
		description: 'Delete a recurring bill. Zoho Books API v3.',
	},
	'recurringBills.stopRecurringBill': {
		riskLevel: 'write',
		description: 'Stop a recurring bill. Zoho Books API v3.',
	},
	'recurringBills.resumeRecurringBill': {
		riskLevel: 'write',
		description: 'Resume a recurring Bill. Zoho Books API v3.',
	},
	'recurringBills.listRecurringBillHistory': {
		riskLevel: 'read',
		description: 'List recurring bill history. Zoho Books API v3.',
	},
	'recurringExpenses.createRecurringExpense': {
		riskLevel: 'write',
		description: 'Create a recurring expense. Zoho Books API v3.',
	},
	'recurringExpenses.listRecurringExpenses': {
		riskLevel: 'read',
		description: 'List recurring expenses. Zoho Books API v3.',
	},
	'recurringExpenses.updateRecurringExpenseUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update an recurring expense using a custom field's unique value. Zoho Books API v3.",
	},
	'recurringExpenses.updateRecurringExpense': {
		riskLevel: 'write',
		description: 'Update a recurring expense. Zoho Books API v3.',
	},
	'recurringExpenses.getRecurringExpense': {
		riskLevel: 'read',
		description: 'Get a recurring expense. Zoho Books API v3.',
	},
	'recurringExpenses.deleteRecurringExpense': {
		riskLevel: 'destructive',
		description: 'Delete a recurring expense. Zoho Books API v3.',
	},
	'recurringExpenses.stopRecurringExpense': {
		riskLevel: 'write',
		description: 'Stop a recurring expense. Zoho Books API v3.',
	},
	'recurringExpenses.resumeRecurringExpense': {
		riskLevel: 'write',
		description: 'Resume a recurring Expense. Zoho Books API v3.',
	},
	'recurringExpenses.listChildExpensesOfRecurringExpense': {
		riskLevel: 'read',
		description: 'List child expenses created. Zoho Books API v3.',
	},
	'recurringExpenses.listRecurringExpenseHistory': {
		riskLevel: 'read',
		description: 'List recurring expense history. Zoho Books API v3.',
	},
	'recurringInvoices.createRecurringInvoice': {
		riskLevel: 'write',
		description: 'Create a Recurring Invoice. Zoho Books API v3.',
	},
	'recurringInvoices.listRecurringInvoices': {
		riskLevel: 'read',
		description: 'List all  Recurring Invoice. Zoho Books API v3.',
	},
	'recurringInvoices.updateRecurringInvoiceUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update a recurring invoice using a custom field's unique value. Zoho Books API v3.",
	},
	'recurringInvoices.updateRecurringInvoice': {
		riskLevel: 'write',
		description: 'Update Recurring Invoice. Zoho Books API v3.',
	},
	'recurringInvoices.getRecurringInvoice': {
		riskLevel: 'read',
		description: 'Get a Recurring Invoice. Zoho Books API v3.',
	},
	'recurringInvoices.deleteRecurringInvoice': {
		riskLevel: 'destructive',
		description: 'Delete a Recurring Invoice. Zoho Books API v3.',
	},
	'recurringInvoices.stopRecurringInvoice': {
		riskLevel: 'write',
		description: 'Stop a Recurring Invoice. Zoho Books API v3.',
	},
	'recurringInvoices.resumeRecurringInvoice': {
		riskLevel: 'write',
		description: 'Resume a Recurring Invoice. Zoho Books API v3.',
	},
	'recurringInvoices.updateRecurringInvoiceTemplate': {
		riskLevel: 'write',
		description: 'Update Recurring Invoice template. Zoho Books API v3.',
	},
	'recurringInvoices.listRecurringInvoiceHistory': {
		riskLevel: 'read',
		description: 'List Recurring Invoice History. Zoho Books API v3.',
	},
	'recurringInvoices.resumeRecurringInvoices': {
		riskLevel: 'write',
		description: 'Resume recurring invoices. Zoho Books API v3.',
	},
	'recurringInvoices.stopRecurringInvoices': {
		riskLevel: 'write',
		description: 'Stop recurring invoices. Zoho Books API v3.',
	},
	'recurringInvoices.getRecurringInvoiceDashboard': {
		riskLevel: 'read',
		description: 'Get the recurring invoices dashboard. Zoho Books API v3.',
	},
	'recurringInvoices.listRecurringInvoiceChildInvoices': {
		riskLevel: 'read',
		description:
			'List invoices created from a recurring invoice. Zoho Books API v3.',
	},
	'recurringInvoices.enableRecurringInvoiceAutobill': {
		riskLevel: 'destructive',
		description: 'Enable auto-bill for a recurring invoice. Zoho Books API v3.',
	},
	'recurringInvoices.disableRecurringInvoiceAutobill': {
		riskLevel: 'write',
		description:
			'Disable auto-bill for a recurring invoice. Zoho Books API v3.',
	},
	'recurringInvoices.deleteRecurringInvoiceBankAccount': {
		riskLevel: 'destructive',
		description:
			'Delete the bank account of a recurring invoice. Zoho Books API v3.',
	},
	'recurringInvoices.deleteRecurringInvoiceCard': {
		riskLevel: 'destructive',
		description: 'Delete the card of a recurring invoice. Zoho Books API v3.',
	},
	'recurringInvoices.associateRecurringInvoiceBankAccount': {
		riskLevel: 'write',
		description:
			'Associate a bank account with a recurring invoice. Zoho Books API v3.',
	},
	'recurringInvoices.associateRecurringInvoiceCard': {
		riskLevel: 'write',
		description:
			'Associate a card with a recurring invoice. Zoho Books API v3.',
	},
	'registers.listRegisterTransactions': {
		riskLevel: 'read',
		description: 'List register transactions. Zoho Books API v3.',
	},
	'registers.listRegisterBulkActionHistory': {
		riskLevel: 'read',
		description: 'List register bulk action history. Zoho Books API v3.',
	},
	'registers.getRegisterBulkActionHistory': {
		riskLevel: 'read',
		description: 'Get register bulk action history details. Zoho Books API v3.',
	},
	'registers.getRegisterBulkUpdateEditpage': {
		riskLevel: 'read',
		description: 'Get register bulk update edit page. Zoho Books API v3.',
	},
	'registers.getRegisterBudgetVsActuals': {
		riskLevel: 'read',
		description: 'Get register budget vs actuals. Zoho Books API v3.',
	},
	'registers.bulkUpdateRegisterTransactions': {
		riskLevel: 'write',
		description: 'Bulk update register transactions. Zoho Books API v3.',
	},
	'registers.bulkDeleteRegisterTransactions': {
		riskLevel: 'destructive',
		description: 'Bulk delete register transactions. Zoho Books API v3.',
	},
	'reportingTags.getTags': {
		riskLevel: 'read',
		description: 'List of all Reporting Tags. Zoho Books API v3.',
	},
	'reportingTags.createTag': {
		riskLevel: 'write',
		description: 'Create Reporting Tag. Zoho Books API v3.',
	},
	'reportingTags.markDefaultOption': {
		riskLevel: 'write',
		description:
			'Mark an option as default for a reporting tag. Zoho Books API v3.',
	},
	'reportingTags.updateTag': {
		riskLevel: 'write',
		description: 'Update Reporting Tag. Zoho Books API v3.',
	},
	'reportingTags.deleteTag': {
		riskLevel: 'destructive',
		description: 'Delete a reporting tag. Zoho Books API v3.',
	},
	'reportingTags.updateTagOptions': {
		riskLevel: 'write',
		description: 'Update Reporting Tag Options. Zoho Books API v3.',
	},
	'reportingTags.updateTagCriteria': {
		riskLevel: 'write',
		description:
			'Update Reporting Tag - Visibility Conditions. Zoho Books API v3.',
	},
	'reportingTags.activeTag': {
		riskLevel: 'write',
		description: 'Mark Reporting Tag as active. Zoho Books API v3.',
	},
	'reportingTags.inactiveTag': {
		riskLevel: 'write',
		description: 'Mark Reporting Tag as inactive. Zoho Books API v3.',
	},
	'reportingTags.activeTagOption': {
		riskLevel: 'write',
		description: 'Mark an option as active. Zoho Books API v3.',
	},
	'reportingTags.inactiveTagOption': {
		riskLevel: 'write',
		description: 'Mark an option as inactive. Zoho Books API v3.',
	},
	'reportingTags.getAllTagOptions': {
		riskLevel: 'read',
		description: 'Get Reporting Tags Options Detail Page. Zoho Books API v3.',
	},
	'reportingTags.reorderTags': {
		riskLevel: 'write',
		description: 'Reorder Reporting Tags. Zoho Books API v3.',
	},
	'retainerInvoices.createRetainerInvoice': {
		riskLevel: 'write',
		description: 'Create a retainerinvoice. Zoho Books API v3.',
	},
	'retainerInvoices.listRetainerInvoices': {
		riskLevel: 'read',
		description: 'List a retainer invoices. Zoho Books API v3.',
	},
	'retainerInvoices.updateRetainerInvoice': {
		riskLevel: 'write',
		description: 'update a retainerinvoice. Zoho Books API v3.',
	},
	'retainerInvoices.getRetainerInvoice': {
		riskLevel: 'read',
		description: 'Get a retainer invoice. Zoho Books API v3.',
	},
	'retainerInvoices.deleteRetainerInvoice': {
		riskLevel: 'destructive',
		description: 'Delete a retainer invoice. Zoho Books API v3.',
	},
	'retainerInvoices.markRetainerInvoiceSent': {
		riskLevel: 'write',
		description: 'Mark a retainer invoice as sent. Zoho Books API v3.',
	},
	'retainerInvoices.updateRetainerInvoiceTemplate': {
		riskLevel: 'write',
		description: 'Update retainer invoice template. Zoho Books API v3.',
	},
	'retainerInvoices.markRetainerInvoiceVoid': {
		riskLevel: 'destructive',
		description: 'Void a retainer invoice. Zoho Books API v3.',
	},
	'retainerInvoices.markRetainerInvoiceDraft': {
		riskLevel: 'write',
		description: 'Mark as draft. Zoho Books API v3.',
	},
	'retainerInvoices.submitRetainerInvoice': {
		riskLevel: 'write',
		description: 'Submit a retainer invoice for approval. Zoho Books API v3.',
	},
	'retainerInvoices.approveRetainerInvoice': {
		riskLevel: 'destructive',
		description: 'Approve a retainer invoice.. Zoho Books API v3.',
	},
	'retainerInvoices.emailRetainerInvoice': {
		riskLevel: 'destructive',
		description: 'Email a retainer invoice. Zoho Books API v3.',
	},
	'retainerInvoices.getRetainerInvoiceEmail': {
		riskLevel: 'read',
		description: 'Get retainer invoice email content. Zoho Books API v3.',
	},
	'retainerInvoices.updateRetainerInvoiceBillingAddress': {
		riskLevel: 'write',
		description: 'Update billing address. Zoho Books API v3.',
	},
	'retainerInvoices.listRetainerInvoiceTemplates': {
		riskLevel: 'read',
		description: 'List retainer invoice templates. Zoho Books API v3.',
	},
	'retainerInvoices.getRetainerInvoiceAttachment': {
		riskLevel: 'read',
		description: 'Get a retainer invoice attachment. Zoho Books API v3.',
	},
	'retainerInvoices.addRetainerInvoiceAttachment': {
		riskLevel: 'write',
		description: 'Add attachment to a retainer invoice. Zoho Books API v3.',
	},
	'retainerInvoices.deleteRetainerInvoiceAttachment': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. Zoho Books API v3.',
	},
	'retainerInvoices.listRetainerInvoice': {
		riskLevel: 'read',
		description: 'List retainer invoice comments & history. Zoho Books API v3.',
	},
	'retainerInvoices.addRetainerInvoiceComment': {
		riskLevel: 'write',
		description: 'Add comment. Zoho Books API v3.',
	},
	'retainerInvoices.deleteRetainerInvoiceComment': {
		riskLevel: 'destructive',
		description: 'Delete a comment. Zoho Books API v3.',
	},
	'retainerInvoices.updateRetainerInvoiceComment': {
		riskLevel: 'write',
		description: 'Update comment. Zoho Books API v3.',
	},
	'retainerInvoices.applyRetainerPaymentsToInvoices': {
		riskLevel: 'write',
		description:
			'Apply retainer invoice payments to invoices. Zoho Books API v3.',
	},
	'retainerInvoices.deleteAppliedRetainerPayment': {
		riskLevel: 'destructive',
		description:
			'Delete a retainer payment applied to an invoice. Zoho Books API v3.',
	},
	'retainerInvoices.createRetainerInvoiceAsyncOnlinePayment': {
		riskLevel: 'destructive',
		description:
			'Record an asynchronous online payment for a retainer invoice. Zoho Books API v3.',
	},
	'salesOrder.createSalesOrder': {
		riskLevel: 'write',
		description: 'Create a sales order. Zoho Books API v3.',
	},
	'salesOrder.listSalesOrders': {
		riskLevel: 'read',
		description: 'List sales orders. Zoho Books API v3.',
	},
	'salesOrder.updateSalesOrderUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update a sales order using a custom field's unique value. Zoho Books API v3.",
	},
	'salesOrder.updateSalesOrder': {
		riskLevel: 'write',
		description: 'Update a sales order. Zoho Books API v3.',
	},
	'salesOrder.getSalesOrder': {
		riskLevel: 'read',
		description: 'Get a sales order. Zoho Books API v3.',
	},
	'salesOrder.deleteSalesOrder': {
		riskLevel: 'destructive',
		description: 'Delete a sales order. Zoho Books API v3.',
	},
	'salesOrder.updateSalesorderCustomfields': {
		riskLevel: 'write',
		description:
			'Update custom field in existing salesorders. Zoho Books API v3.',
	},
	'salesOrder.markSalesOrderAsOpen': {
		riskLevel: 'write',
		description: 'Mark a sales order as open. Zoho Books API v3.',
	},
	'salesOrder.markSalesOrderAsVoid': {
		riskLevel: 'destructive',
		description: 'Mark a sales order as void. Zoho Books API v3.',
	},
	'salesOrder.updateSalesOrderSubStatus': {
		riskLevel: 'write',
		description: 'Update a sales order sub status. Zoho Books API v3.',
	},
	'salesOrder.emailSalesOrder': {
		riskLevel: 'destructive',
		description: 'Email a sales order. Zoho Books API v3.',
	},
	'salesOrder.getSalesOrderEmail': {
		riskLevel: 'read',
		description: 'Get sales order email content. Zoho Books API v3.',
	},
	'salesOrder.submitSalesOrder': {
		riskLevel: 'write',
		description: 'Submit a sales order for approval. Zoho Books API v3.',
	},
	'salesOrder.approveSalesOrder': {
		riskLevel: 'destructive',
		description: 'Approve a sales order.. Zoho Books API v3.',
	},
	'salesOrder.bulkExportSalesOrdersAsPdf': {
		riskLevel: 'read',
		description: 'Bulk export sales orders. Zoho Books API v3.',
	},
	'salesOrder.bulkPrintSalesOrders': {
		riskLevel: 'read',
		description: 'Bulk print sales orders. Zoho Books API v3.',
	},
	'salesOrder.updateSalesOrderBillingAddress': {
		riskLevel: 'write',
		description: 'Update billing address. Zoho Books API v3.',
	},
	'salesOrder.updateSalesOrderShippingAddress': {
		riskLevel: 'write',
		description: 'Update shipping address. Zoho Books API v3.',
	},
	'salesOrder.listSalesOrderTemplates': {
		riskLevel: 'read',
		description: 'List sales order templates. Zoho Books API v3.',
	},
	'salesOrder.updateSalesOrderTemplate': {
		riskLevel: 'write',
		description: 'Update sales order template. Zoho Books API v3.',
	},
	'salesOrder.getSalesOrderAttachment': {
		riskLevel: 'read',
		description: 'Get a sales order attachment. Zoho Books API v3.',
	},
	'salesOrder.addSalesOrderAttachment': {
		riskLevel: 'write',
		description: 'Add attachment to a sales order. Zoho Books API v3.',
	},
	'salesOrder.updateSalesOrderAttachmentPreference': {
		riskLevel: 'write',
		description: 'Update attachment preference. Zoho Books API v3.',
	},
	'salesOrder.deleteSalesOrderAttachment': {
		riskLevel: 'destructive',
		description: 'Delete an attachment. Zoho Books API v3.',
	},
	'salesOrder.listSalesOrderComments': {
		riskLevel: 'read',
		description: 'List sales order comments & history. Zoho Books API v3.',
	},
	'salesOrder.addSalesOrderComment': {
		riskLevel: 'write',
		description: 'Add comment. Zoho Books API v3.',
	},
	'salesOrder.updateSalesOrderComment': {
		riskLevel: 'write',
		description: 'Update comment. Zoho Books API v3.',
	},
	'salesOrder.deleteSalesOrderComment': {
		riskLevel: 'destructive',
		description: 'Delete a comment. Zoho Books API v3.',
	},
	'salesReceipt.createSalesReceipt': {
		riskLevel: 'write',
		description: 'Create a sales receipt. Zoho Books API v3.',
	},
	'salesReceipt.listSalesReceipts': {
		riskLevel: 'read',
		description: 'List sales receipts. Zoho Books API v3.',
	},
	'salesReceipt.updateSalesReceipt': {
		riskLevel: 'write',
		description: 'Update a sales receipt. Zoho Books API v3.',
	},
	'salesReceipt.getSalesReceipt': {
		riskLevel: 'read',
		description: 'Get a sales receipt. Zoho Books API v3.',
	},
	'salesReceipt.deleteSalesReceipt': {
		riskLevel: 'destructive',
		description: 'Delete a sales receipt. Zoho Books API v3.',
	},
	'salesReceipt.emailSalesReceipt': {
		riskLevel: 'destructive',
		description: 'Email a sales receipt. Zoho Books API v3.',
	},
	'selfBilledInvoices.createSelfBilledInvoice': {
		riskLevel: 'write',
		description: 'Create a Self-Billed Invoice. Zoho Books API v3.',
	},
	'selfBilledInvoices.listSelfBilledInvoices': {
		riskLevel: 'read',
		description: 'List Self-Billed Invoices. Zoho Books API v3.',
	},
	'selfBilledInvoices.updateSelfBilledInvoice': {
		riskLevel: 'write',
		description: 'Update a Self-Billed Invoice. Zoho Books API v3.',
	},
	'selfBilledInvoices.getSelfBilledInvoice': {
		riskLevel: 'read',
		description: 'Get a Self-Billed Invoice. Zoho Books API v3.',
	},
	'selfBilledInvoices.deleteSelfBilledInvoice': {
		riskLevel: 'destructive',
		description: 'Delete a Self-Billed Invoice. Zoho Books API v3.',
	},
	'selfBilledInvoices.pushSelfBilledInvoiceEinvoice': {
		riskLevel: 'destructive',
		description: 'Push a self-billed invoice e-invoice. Zoho Books API v3.',
	},
	'tasks.addTask': {
		riskLevel: 'write',
		description: 'Add a task. Zoho Books API v3.',
	},
	'tasks.listTasks': {
		riskLevel: 'read',
		description: 'List tasks. Zoho Books API v3.',
	},
	'tasks.updateTasks': {
		riskLevel: 'write',
		description: 'Update tasks. Zoho Books API v3.',
	},
	'tasks.deleteTasks': {
		riskLevel: 'destructive',
		description: 'Delete tasks. Zoho Books API v3.',
	},
	'tasks.getTask': {
		riskLevel: 'read',
		description: 'Get a task. Zoho Books API v3.',
	},
	'tasks.updateATask': {
		riskLevel: 'write',
		description: 'Update a tasks. Zoho Books API v3.',
	},
	'tasks.deleteTask': {
		riskLevel: 'destructive',
		description: 'Delete a tasks. Zoho Books API v3.',
	},
	'tasks.updatePercentageTask': {
		riskLevel: 'write',
		description: 'Update completed percentage. Zoho Books API v3.',
	},
	'tasks.markTaskAsOpen': {
		riskLevel: 'write',
		description: 'Mark task as open. Zoho Books API v3.',
	},
	'tasks.markTaskAsOngoing': {
		riskLevel: 'write',
		description: 'Mark task as ongoing. Zoho Books API v3.',
	},
	'tasks.markTaskAsCompleted': {
		riskLevel: 'write',
		description: 'Mark task as completed. Zoho Books API v3.',
	},
	'tasks.addTaskComment': {
		riskLevel: 'write',
		description: 'Add comment to task. Zoho Books API v3.',
	},
	'tasks.listTaskComments': {
		riskLevel: 'read',
		description: 'List comments of task. Zoho Books API v3.',
	},
	'tasks.deleteTaskComment': {
		riskLevel: 'destructive',
		description: 'Delete comment of task. Zoho Books API v3.',
	},
	'tasks.addTaskAttachment': {
		riskLevel: 'write',
		description: 'Add attachment to task. Zoho Books API v3.',
	},
	'tasks.getTaskDocument': {
		riskLevel: 'read',
		description: 'Get document of task. Zoho Books API v3.',
	},
	'tasks.deleteTaskDocument': {
		riskLevel: 'destructive',
		description: 'Delete document of task. Zoho Books API v3.',
	},
	'taxes.createTax': {
		riskLevel: 'write',
		description: 'Create a tax. Zoho Books API v3.',
	},
	'taxes.listTaxes': {
		riskLevel: 'read',
		description: 'List taxes. Zoho Books API v3.',
	},
	'taxes.updateTax': {
		riskLevel: 'write',
		description: 'Update a tax. Zoho Books API v3.',
	},
	'taxes.getTax': {
		riskLevel: 'read',
		description: 'Get a tax. Zoho Books API v3.',
	},
	'taxes.deleteTax': {
		riskLevel: 'destructive',
		description: 'Delete a tax. Zoho Books API v3.',
	},
	'taxes.getTaxGroup': {
		riskLevel: 'read',
		description: 'Get a tax group. Zoho Books API v3.',
	},
	'taxes.updateTaxGroup': {
		riskLevel: 'write',
		description: 'Update a tax group. Zoho Books API v3.',
	},
	'taxes.deleteTaxGroup': {
		riskLevel: 'destructive',
		description: 'Delete a tax group. Zoho Books API v3.',
	},
	'taxes.createTaxGroup': {
		riskLevel: 'write',
		description: 'Create a tax group. Zoho Books API v3.',
	},
	'taxes.createTaxAuthority': {
		riskLevel: 'write',
		description:
			'Create a tax authority [US and CA Edition only]. Zoho Books API v3.',
	},
	'taxes.listTaxAuthorities': {
		riskLevel: 'read',
		description: 'List tax authorities [US Edition only]. Zoho Books API v3.',
	},
	'taxes.updateTaxAuthority': {
		riskLevel: 'write',
		description:
			'Update a tax authority [US and CA Edition only]. Zoho Books API v3.',
	},
	'taxes.getTaxAuthority': {
		riskLevel: 'read',
		description:
			'Get a tax authority [US and CA Edition only]. Zoho Books API v3.',
	},
	'taxes.deleteTaxAuthority': {
		riskLevel: 'destructive',
		description:
			'Delete a tax authority [US and CA Edition only]. Zoho Books API v3.',
	},
	'taxes.createTaxExemption': {
		riskLevel: 'write',
		description: 'Create a tax exemption [US Edition only]. Zoho Books API v3.',
	},
	'taxes.listTaxExemptions': {
		riskLevel: 'read',
		description: 'List tax exemptions [US Edition only]. Zoho Books API v3.',
	},
	'taxes.updateTaxExemption': {
		riskLevel: 'write',
		description: 'Update a tax exemption [US Edition only]. Zoho Books API v3.',
	},
	'taxes.getTaxExemption': {
		riskLevel: 'read',
		description: 'Get a tax exemption [US Edition only]. Zoho Books API v3.',
	},
	'taxes.deleteTaxExemption': {
		riskLevel: 'destructive',
		description: 'Delete a tax exemption [US Edition only]. Zoho Books API v3.',
	},
	'timeEntries.createTimeEntries': {
		riskLevel: 'write',
		description: 'Log time entries. Zoho Books API v3.',
	},
	'timeEntries.listTimeEntries': {
		riskLevel: 'read',
		description: 'List time entries.. Zoho Books API v3.',
	},
	'timeEntries.deleteTimeEntries': {
		riskLevel: 'destructive',
		description: 'Delete time entries. Zoho Books API v3.',
	},
	'timeEntries.updateTimeEntry': {
		riskLevel: 'write',
		description: 'Update time entry. Zoho Books API v3.',
	},
	'timeEntries.getTimeEntry': {
		riskLevel: 'read',
		description: 'Get a time entry. Zoho Books API v3.',
	},
	'timeEntries.deleteTimeEntry': {
		riskLevel: 'destructive',
		description: 'Delete time entry. Zoho Books API v3.',
	},
	'timeEntries.startEntryTimer': {
		riskLevel: 'write',
		description: 'Start timer. Zoho Books API v3.',
	},
	'timeEntries.stopEntryTimer': {
		riskLevel: 'write',
		description: 'Stop timer. Zoho Books API v3.',
	},
	'timeEntries.getRunningTimer': {
		riskLevel: 'read',
		description: 'Get timer. Zoho Books API v3.',
	},
	'transactionLocking.getTransactionLock': {
		riskLevel: 'read',
		description: 'Get transaction lock details. Zoho Books API v3.',
	},
	'transactionLocking.updateTransactionLock': {
		riskLevel: 'destructive',
		description: 'Update transaction lock. Zoho Books API v3.',
	},
	'transactionLocking.deleteTransactionLock': {
		riskLevel: 'destructive',
		description: 'Delete a transaction lock. Zoho Books API v3.',
	},
	'transactionLocking.getAccountingPeriodTransactionLock': {
		riskLevel: 'read',
		description:
			'Get transaction lock for an accounting period. Zoho Books API v3.',
	},
	'transactionLocking.listTransactionLocks': {
		riskLevel: 'read',
		description: 'List transaction locks. Zoho Books API v3.',
	},
	'transactionLocking.updatePartialUnlock': {
		riskLevel: 'destructive',
		description: 'Update partial unlock settings. Zoho Books API v3.',
	},
	'users.createUser': {
		riskLevel: 'destructive',
		description: 'Create a user. Zoho Books API v3.',
	},
	'users.listUsers': {
		riskLevel: 'read',
		description: 'List Users. Zoho Books API v3.',
	},
	'users.updateUser': {
		riskLevel: 'write',
		description: 'Update a user. Zoho Books API v3.',
	},
	'users.getUser': {
		riskLevel: 'read',
		description: 'Get an user details. Zoho Books API v3.',
	},
	'users.deleteUser': {
		riskLevel: 'destructive',
		description: 'Delete a user. Zoho Books API v3.',
	},
	'users.getCurrentUser': {
		riskLevel: 'read',
		description: 'Get current user. Zoho Books API v3.',
	},
	'users.inviteUser': {
		riskLevel: 'destructive',
		description: 'Invite a user. Zoho Books API v3.',
	},
	'users.markUserActive': {
		riskLevel: 'write',
		description: 'Mark user as active. Zoho Books API v3.',
	},
	'users.markUserInactive': {
		riskLevel: 'write',
		description: 'Mark user as inactive. Zoho Books API v3.',
	},
	'vendorCredits.createVendorCredit': {
		riskLevel: 'write',
		description: 'Create a vendor credit. Zoho Books API v3.',
	},
	'vendorCredits.listVendorCredits': {
		riskLevel: 'read',
		description: 'List vendor credits. Zoho Books API v3.',
	},
	'vendorCredits.updateVendorCredit': {
		riskLevel: 'write',
		description: 'Update vendor credit. Zoho Books API v3.',
	},
	'vendorCredits.getVendorCredit': {
		riskLevel: 'read',
		description: 'Get vendor credit. Zoho Books API v3.',
	},
	'vendorCredits.deleteVendorCredit': {
		riskLevel: 'destructive',
		description: 'Delete vendor credit. Zoho Books API v3.',
	},
	'vendorCredits.markVendorCreditOpen': {
		riskLevel: 'write',
		description: 'Convert to open. Zoho Books API v3.',
	},
	'vendorCredits.markVendorCreditVoid': {
		riskLevel: 'destructive',
		description: 'Void vendor credit. Zoho Books API v3.',
	},
	'vendorCredits.submitVendorCredit': {
		riskLevel: 'write',
		description: 'Submit a Vendor credit for approval. Zoho Books API v3.',
	},
	'vendorCredits.approveVendorCredit': {
		riskLevel: 'destructive',
		description: 'Approve a Vendor credit. Zoho Books API v3.',
	},
	'vendorCredits.listBillsCredited': {
		riskLevel: 'read',
		description: 'List bills credited. Zoho Books API v3.',
	},
	'vendorCredits.applyCreditsToABill': {
		riskLevel: 'write',
		description: 'Apply credits to a bill. Zoho Books API v3.',
	},
	'vendorCredits.deleteVendorCreditBill': {
		riskLevel: 'destructive',
		description: 'Delete bills credited. Zoho Books API v3.',
	},
	'vendorCredits.refundVendorCredit': {
		riskLevel: 'destructive',
		description: 'Refund a vendor credit. Zoho Books API v3.',
	},
	'vendorCredits.listVendorCreditRefundsOfAVendorCredit': {
		riskLevel: 'read',
		description: 'List refunds of a vendor credit. Zoho Books API v3.',
	},
	'vendorCredits.updateVendorCreditRefund': {
		riskLevel: 'destructive',
		description: 'Update vendor credit refund. Zoho Books API v3.',
	},
	'vendorCredits.getVendorCreditRefund': {
		riskLevel: 'read',
		description: 'Get vendor credit refund. Zoho Books API v3.',
	},
	'vendorCredits.deleteVendorCreditRefund': {
		riskLevel: 'destructive',
		description: 'Delete vendor credit refund. Zoho Books API v3.',
	},
	'vendorCredits.listVendorCreditRefundsOfAllVendorCredits': {
		riskLevel: 'read',
		description: 'List vendor credit refunds. Zoho Books API v3.',
	},
	'vendorCredits.addVendorCreditComment': {
		riskLevel: 'write',
		description: 'Add a comment. Zoho Books API v3.',
	},
	'vendorCredits.listVendorCreditComments': {
		riskLevel: 'read',
		description: 'List vendor credit comments & history. Zoho Books API v3.',
	},
	'vendorCredits.deleteVendorCreditComment': {
		riskLevel: 'destructive',
		description: 'Delete a comment. Zoho Books API v3.',
	},
	'vendorPayments.createVendorPayment': {
		riskLevel: 'destructive',
		description: 'Create a vendor payment. Zoho Books API v3.',
	},
	'vendorPayments.listVendorPayments': {
		riskLevel: 'read',
		description: 'List vendor payments. Zoho Books API v3.',
	},
	'vendorPayments.updateVendorPaymentUsingCustomField': {
		riskLevel: 'write',
		description:
			"Update an vendor payment using a custom field's unique value. Zoho Books API v3.",
	},
	'vendorPayments.bulkDeleteVendorPayments': {
		riskLevel: 'destructive',
		description: 'Bulk delete vendor payments. Zoho Books API v3.',
	},
	'vendorPayments.updateVendorPayment': {
		riskLevel: 'write',
		description: 'Update a vendor payment. Zoho Books API v3.',
	},
	'vendorPayments.getVendorPayment': {
		riskLevel: 'read',
		description: 'Get a vendor payment. Zoho Books API v3.',
	},
	'vendorPayments.deleteVendorPayment': {
		riskLevel: 'destructive',
		description: 'Delete a vendor payment. Zoho Books API v3.',
	},
	'vendorPayments.listVendorPaymentRefunds': {
		riskLevel: 'read',
		description: 'List refunds of a vendor payment. Zoho Books API v3.',
	},
	'vendorPayments.refundExcessVendorPayment': {
		riskLevel: 'destructive',
		description: 'Refund an excess vendor payment. Zoho Books API v3.',
	},
	'vendorPayments.getVendorPaymentRefund': {
		riskLevel: 'read',
		description: 'Details of a refund. Zoho Books API v3.',
	},
	'vendorPayments.updateVendorPaymentRefund': {
		riskLevel: 'destructive',
		description: 'Update a refund. Zoho Books API v3.',
	},
	'vendorPayments.deleteVendorPaymentRefund': {
		riskLevel: 'destructive',
		description: 'Delete a refund. Zoho Books API v3.',
	},
	'vendorPayments.emailVendorPayment': {
		riskLevel: 'destructive',
		description: 'Email a vendor payment. Zoho Books API v3.',
	},
	'vendorPayments.getVendorPaymentEmailContent': {
		riskLevel: 'read',
		description: 'Get vendor payment email content. Zoho Books API v3.',
	},
} as const satisfies RequiredPluginEndpointMeta<ZohoBooksEndpointKeyTree>;
