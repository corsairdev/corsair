import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { sevdeskEndpointsNested } from './endpoints';
import type {
	SevdeskEndpointInputs,
	SevdeskEndpointOutputs,
} from './endpoints/types';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SevdeskSchema } from './schema';

export type SevdeskPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	resourceVersion?: string;
	hooks?: InternalSevdeskPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sevdeskEndpointsNested>;
};
export type SevdeskContext = CorsairPluginContext<
	typeof SevdeskSchema,
	SevdeskPluginOptions
>;
export type SevdeskKeyBuilderContext = KeyBuilderContext<SevdeskPluginOptions>;
export type SevdeskBoundEndpoints = BindEndpoints<
	typeof sevdeskEndpointsNested
>;
type Endpoint<K extends keyof SevdeskEndpointOutputs> = CorsairEndpoint<
	SevdeskContext,
	SevdeskEndpointInputs[K],
	SevdeskEndpointOutputs[K]
>;
export type SevdeskEndpoints = {
	bookkeepingSystemVersion: Endpoint<'basics.bookkeepingSystemVersion'>;
	getCheckAccounts: Endpoint<'checkAccount.getCheckAccounts'>;
	createFileImportAccount: Endpoint<'checkAccount.createFileImportAccount'>;
	createClearingAccount: Endpoint<'checkAccount.createClearingAccount'>;
	getCheckAccountById: Endpoint<'checkAccount.getCheckAccountById'>;
	updateCheckAccount: Endpoint<'checkAccount.updateCheckAccount'>;
	deleteCheckAccount: Endpoint<'checkAccount.deleteCheckAccount'>;
	getBalanceAtDate: Endpoint<'checkAccount.getBalanceAtDate'>;
	getTransactions: Endpoint<'checkAccountTransaction.getTransactions'>;
	createTransaction: Endpoint<'checkAccountTransaction.createTransaction'>;
	getCheckAccountTransactionById: Endpoint<'checkAccountTransaction.getCheckAccountTransactionById'>;
	updateCheckAccountTransaction: Endpoint<'checkAccountTransaction.updateCheckAccountTransaction'>;
	deleteCheckAccountTransaction: Endpoint<'checkAccountTransaction.deleteCheckAccountTransaction'>;
	checkAccountTransactionEnshrine: Endpoint<'checkAccountTransaction.checkAccountTransactionEnshrine'>;
	listPrivateTransactionRules: Endpoint<'privateTransactionRule.listPrivateTransactionRules'>;
	createPrivateTransactionRule: Endpoint<'privateTransactionRule.createPrivateTransactionRule'>;
	deletePrivateTransactionRule: Endpoint<'privateTransactionRule.deletePrivateTransactionRule'>;
	getNextCustomerNumber: Endpoint<'contact.getNextCustomerNumber'>;
	findContactsByCustomFieldValue: Endpoint<'contact.findContactsByCustomFieldValue'>;
	contactCustomerNumberAvailabilityCheck: Endpoint<'contact.contactCustomerNumberAvailabilityCheck'>;
	getContacts: Endpoint<'contact.getContacts'>;
	createContact: Endpoint<'contact.createContact'>;
	getContactById: Endpoint<'contact.getContactById'>;
	updateContact: Endpoint<'contact.updateContact'>;
	deleteContact: Endpoint<'contact.deleteContact'>;
	getContactTabsItemCountById: Endpoint<'contact.getContactTabsItemCountById'>;
	createContactAddress: Endpoint<'contactAddress.createContactAddress'>;
	getContactAddresses: Endpoint<'contactAddress.getContactAddresses'>;
	contactAddressId: Endpoint<'contactAddress.contactAddressId'>;
	updateContactAddress: Endpoint<'contactAddress.updateContactAddress'>;
	deleteContactAddress: Endpoint<'contactAddress.deleteContactAddress'>;
	getCommunicationWays: Endpoint<'communicationWay.getCommunicationWays'>;
	createCommunicationWay: Endpoint<'communicationWay.createCommunicationWay'>;
	getCommunicationWayById: Endpoint<'communicationWay.getCommunicationWayById'>;
	deleteCommunicationWay: Endpoint<'communicationWay.deleteCommunicationWay'>;
	updateCommunicationWay: Endpoint<'communicationWay.updateCommunicationWay'>;
	getCommunicationWayKeys: Endpoint<'communicationWay.getCommunicationWayKeys'>;
	getAccountingContact: Endpoint<'accountingContact.getAccountingContact'>;
	createAccountingContact: Endpoint<'accountingContact.createAccountingContact'>;
	getAccountingContactById: Endpoint<'accountingContact.getAccountingContactById'>;
	updateAccountingContact: Endpoint<'accountingContact.updateAccountingContact'>;
	deleteAccountingContact: Endpoint<'accountingContact.deleteAccountingContact'>;
	getPlaceholder: Endpoint<'contactField.getPlaceholder'>;
	getContactFields: Endpoint<'contactField.getContactFields'>;
	createContactField: Endpoint<'contactField.createContactField'>;
	getContactFieldsById: Endpoint<'contactField.getContactFieldsById'>;
	updateContactfield: Endpoint<'contactField.updateContactfield'>;
	deleteContactCustomFieldId: Endpoint<'contactField.deleteContactCustomFieldId'>;
	getContactFieldSettings: Endpoint<'contactField.getContactFieldSettings'>;
	createContactFieldSetting: Endpoint<'contactField.createContactFieldSetting'>;
	getContactFieldSettingById: Endpoint<'contactField.getContactFieldSettingById'>;
	updateContactFieldSetting: Endpoint<'contactField.updateContactFieldSetting'>;
	deleteContactFieldSetting: Endpoint<'contactField.deleteContactFieldSetting'>;
	getReferenceCount: Endpoint<'contactField.getReferenceCount'>;
	getCreditNotes: Endpoint<'creditNote.getCreditNotes'>;
	createcreditNote: Endpoint<'creditNote.createcreditNote'>;
	createCreditNoteFromInvoice: Endpoint<'creditNote.createCreditNoteFromInvoice'>;
	createCreditNoteFromVoucher: Endpoint<'creditNote.createCreditNoteFromVoucher'>;
	getcreditNoteById: Endpoint<'creditNote.getcreditNoteById'>;
	updatecreditNote: Endpoint<'creditNote.updatecreditNote'>;
	deletecreditNote: Endpoint<'creditNote.deletecreditNote'>;
	sendCreditNoteByPrinting: Endpoint<'creditNote.sendCreditNoteByPrinting'>;
	creditNoteSendBy: Endpoint<'creditNote.creditNoteSendBy'>;
	creditNoteEnshrine: Endpoint<'creditNote.creditNoteEnshrine'>;
	creditNoteGetPdf: Endpoint<'creditNote.creditNoteGetPdf'>;
	sendCreditNoteViaEMail: Endpoint<'creditNote.sendCreditNoteViaEMail'>;
	bookCreditNote: Endpoint<'creditNote.bookCreditNote'>;
	creditNoteResetToOpen: Endpoint<'creditNote.creditNoteResetToOpen'>;
	creditNoteResetToDraft: Endpoint<'creditNote.creditNoteResetToDraft'>;
	getcreditNotePositions: Endpoint<'creditNotePos.getcreditNotePositions'>;
	updateExportConfig: Endpoint<'export.updateExportConfig'>;
	exportDatevDepricated: Endpoint<'export.exportDatevDepricated'>;
	exportDatevCSV: Endpoint<'export.exportDatevCSV'>;
	exportDatevXML: Endpoint<'export.exportDatevXML'>;
	generateDownloadHash: Endpoint<'export.generateDownloadHash'>;
	getProgress: Endpoint<'export.getProgress'>;
	jobDownloadInfo: Endpoint<'export.jobDownloadInfo'>;
	exportInvoice: Endpoint<'export.exportInvoice'>;
	exportInvoiceZip: Endpoint<'export.exportInvoiceZip'>;
	exportCreditNote: Endpoint<'export.exportCreditNote'>;
	exportVoucher: Endpoint<'export.exportVoucher'>;
	exportTransactions: Endpoint<'export.exportTransactions'>;
	exportVoucherZip: Endpoint<'export.exportVoucherZip'>;
	exportContact: Endpoint<'export.exportContact'>;
	getParts: Endpoint<'part.getParts'>;
	createPart: Endpoint<'part.createPart'>;
	getPartById: Endpoint<'part.getPartById'>;
	updatePart: Endpoint<'part.updatePart'>;
	partGetStock: Endpoint<'part.partGetStock'>;
	getInvoices: Endpoint<'invoice.getInvoices'>;
	createInvoiceByFactory: Endpoint<'invoice.createInvoiceByFactory'>;
	getInvoiceById: Endpoint<'invoice.getInvoiceById'>;
	getInvoicePositionsById: Endpoint<'invoice.getInvoicePositionsById'>;
	createInvoiceFromOrder: Endpoint<'invoice.createInvoiceFromOrder'>;
	createInvoiceReminder: Endpoint<'invoice.createInvoiceReminder'>;
	getIsInvoicePartiallyPaid: Endpoint<'invoice.getIsInvoicePartiallyPaid'>;
	cancelInvoice: Endpoint<'invoice.cancelInvoice'>;
	invoiceRender: Endpoint<'invoice.invoiceRender'>;
	sendInvoiceViaEMail: Endpoint<'invoice.sendInvoiceViaEMail'>;
	invoiceGetPdf: Endpoint<'invoice.invoiceGetPdf'>;
	invoiceSendBy: Endpoint<'invoice.invoiceSendBy'>;
	invoiceEnshrine: Endpoint<'invoice.invoiceEnshrine'>;
	bookInvoice: Endpoint<'invoice.bookInvoice'>;
	invoiceResetToOpen: Endpoint<'invoice.invoiceResetToOpen'>;
	invoiceResetToDraft: Endpoint<'invoice.invoiceResetToDraft'>;
	getInvoicePos: Endpoint<'invoicePos.getInvoicePos'>;
	getLetterpapersWithThumb: Endpoint<'layout.getLetterpapersWithThumb'>;
	getTemplates: Endpoint<'layout.getTemplates'>;
	updateInvoiceTemplate: Endpoint<'layout.updateInvoiceTemplate'>;
	updateOrderTemplate: Endpoint<'layout.updateOrderTemplate'>;
	updateCreditNoteTemplate: Endpoint<'layout.updateCreditNoteTemplate'>;
	getOrders: Endpoint<'order.getOrders'>;
	createOrder: Endpoint<'order.createOrder'>;
	getOrderById: Endpoint<'order.getOrderById'>;
	updateOrder: Endpoint<'order.updateOrder'>;
	deleteOrder: Endpoint<'order.deleteOrder'>;
	getOrderPositionsById: Endpoint<'order.getOrderPositionsById'>;
	getDiscounts: Endpoint<'order.getDiscounts'>;
	getRelatedObjects: Endpoint<'order.getRelatedObjects'>;
	sendorderViaEMail: Endpoint<'order.sendorderViaEMail'>;
	createPackingListFromOrder: Endpoint<'order.createPackingListFromOrder'>;
	createContractNoteFromOrder: Endpoint<'order.createContractNoteFromOrder'>;
	orderGetPdf: Endpoint<'order.orderGetPdf'>;
	orderSendBy: Endpoint<'order.orderSendBy'>;
	getOrderPositions: Endpoint<'orderPos.getOrderPositions'>;
	getOrderPositionById: Endpoint<'orderPos.getOrderPositionById'>;
	updateOrderPosition: Endpoint<'orderPos.updateOrderPosition'>;
	deleteOrderPos: Endpoint<'orderPos.deleteOrderPos'>;
	voucherFactorySaveVoucher: Endpoint<'voucher.voucherFactorySaveVoucher'>;
	getVouchers: Endpoint<'voucher.getVouchers'>;
	getVoucherById: Endpoint<'voucher.getVoucherById'>;
	updateVoucher: Endpoint<'voucher.updateVoucher'>;
	voucherEnshrine: Endpoint<'voucher.voucherEnshrine'>;
	bookVoucher: Endpoint<'voucher.bookVoucher'>;
	voucherResetToOpen: Endpoint<'voucher.voucherResetToOpen'>;
	voucherResetToDraft: Endpoint<'voucher.voucherResetToDraft'>;
	getVoucherPositions: Endpoint<'voucherPos.getVoucherPositions'>;
	forAllAccounts: Endpoint<'voucher.forAllAccounts'>;
	forAccountNumber: Endpoint<'voucher.forAccountNumber'>;
	forTaxRule: Endpoint<'voucher.forTaxRule'>;
	forRevenue: Endpoint<'voucher.forRevenue'>;
	forExpense: Endpoint<'voucher.forExpense'>;
	reportInvoice: Endpoint<'report.reportInvoice'>;
	reportOrder: Endpoint<'report.reportOrder'>;
	reportContact: Endpoint<'report.reportContact'>;
	reportVoucher: Endpoint<'report.reportVoucher'>;
	getTags: Endpoint<'tag.getTags'>;
	getTagById: Endpoint<'tag.getTagById'>;
	updateTag: Endpoint<'tag.updateTag'>;
	deleteTag: Endpoint<'tag.deleteTag'>;
	createTag: Endpoint<'tag.createTag'>;
	getTagRelations: Endpoint<'tag.getTagRelations'>;
};

const defaultAuthType: AuthTypes = 'api_key' as const;
export const sevdeskEndpointSchemas = {
	'basics.bookkeepingSystemVersion': {
		input: SevdeskEndpointInputSchemas['basics.bookkeepingSystemVersion'],
		output: SevdeskEndpointOutputSchemas['basics.bookkeepingSystemVersion'],
	},
	'checkAccount.getCheckAccounts': {
		input: SevdeskEndpointInputSchemas['checkAccount.getCheckAccounts'],
		output: SevdeskEndpointOutputSchemas['checkAccount.getCheckAccounts'],
	},
	'checkAccount.createFileImportAccount': {
		input: SevdeskEndpointInputSchemas['checkAccount.createFileImportAccount'],
		output:
			SevdeskEndpointOutputSchemas['checkAccount.createFileImportAccount'],
	},
	'checkAccount.createClearingAccount': {
		input: SevdeskEndpointInputSchemas['checkAccount.createClearingAccount'],
		output: SevdeskEndpointOutputSchemas['checkAccount.createClearingAccount'],
	},
	'checkAccount.getCheckAccountById': {
		input: SevdeskEndpointInputSchemas['checkAccount.getCheckAccountById'],
		output: SevdeskEndpointOutputSchemas['checkAccount.getCheckAccountById'],
	},
	'checkAccount.updateCheckAccount': {
		input: SevdeskEndpointInputSchemas['checkAccount.updateCheckAccount'],
		output: SevdeskEndpointOutputSchemas['checkAccount.updateCheckAccount'],
	},
	'checkAccount.deleteCheckAccount': {
		input: SevdeskEndpointInputSchemas['checkAccount.deleteCheckAccount'],
		output: SevdeskEndpointOutputSchemas['checkAccount.deleteCheckAccount'],
	},
	'checkAccount.getBalanceAtDate': {
		input: SevdeskEndpointInputSchemas['checkAccount.getBalanceAtDate'],
		output: SevdeskEndpointOutputSchemas['checkAccount.getBalanceAtDate'],
	},
	'checkAccountTransaction.getTransactions': {
		input:
			SevdeskEndpointInputSchemas['checkAccountTransaction.getTransactions'],
		output:
			SevdeskEndpointOutputSchemas['checkAccountTransaction.getTransactions'],
	},
	'checkAccountTransaction.createTransaction': {
		input:
			SevdeskEndpointInputSchemas['checkAccountTransaction.createTransaction'],
		output:
			SevdeskEndpointOutputSchemas['checkAccountTransaction.createTransaction'],
	},
	'checkAccountTransaction.getCheckAccountTransactionById': {
		input:
			SevdeskEndpointInputSchemas[
				'checkAccountTransaction.getCheckAccountTransactionById'
			],
		output:
			SevdeskEndpointOutputSchemas[
				'checkAccountTransaction.getCheckAccountTransactionById'
			],
	},
	'checkAccountTransaction.updateCheckAccountTransaction': {
		input:
			SevdeskEndpointInputSchemas[
				'checkAccountTransaction.updateCheckAccountTransaction'
			],
		output:
			SevdeskEndpointOutputSchemas[
				'checkAccountTransaction.updateCheckAccountTransaction'
			],
	},
	'checkAccountTransaction.deleteCheckAccountTransaction': {
		input:
			SevdeskEndpointInputSchemas[
				'checkAccountTransaction.deleteCheckAccountTransaction'
			],
		output:
			SevdeskEndpointOutputSchemas[
				'checkAccountTransaction.deleteCheckAccountTransaction'
			],
	},
	'checkAccountTransaction.checkAccountTransactionEnshrine': {
		input:
			SevdeskEndpointInputSchemas[
				'checkAccountTransaction.checkAccountTransactionEnshrine'
			],
		output:
			SevdeskEndpointOutputSchemas[
				'checkAccountTransaction.checkAccountTransactionEnshrine'
			],
	},
	'privateTransactionRule.listPrivateTransactionRules': {
		input:
			SevdeskEndpointInputSchemas[
				'privateTransactionRule.listPrivateTransactionRules'
			],
		output:
			SevdeskEndpointOutputSchemas[
				'privateTransactionRule.listPrivateTransactionRules'
			],
	},
	'privateTransactionRule.createPrivateTransactionRule': {
		input:
			SevdeskEndpointInputSchemas[
				'privateTransactionRule.createPrivateTransactionRule'
			],
		output:
			SevdeskEndpointOutputSchemas[
				'privateTransactionRule.createPrivateTransactionRule'
			],
	},
	'privateTransactionRule.deletePrivateTransactionRule': {
		input:
			SevdeskEndpointInputSchemas[
				'privateTransactionRule.deletePrivateTransactionRule'
			],
		output:
			SevdeskEndpointOutputSchemas[
				'privateTransactionRule.deletePrivateTransactionRule'
			],
	},
	'contact.getNextCustomerNumber': {
		input: SevdeskEndpointInputSchemas['contact.getNextCustomerNumber'],
		output: SevdeskEndpointOutputSchemas['contact.getNextCustomerNumber'],
	},
	'contact.findContactsByCustomFieldValue': {
		input:
			SevdeskEndpointInputSchemas['contact.findContactsByCustomFieldValue'],
		output:
			SevdeskEndpointOutputSchemas['contact.findContactsByCustomFieldValue'],
	},
	'contact.contactCustomerNumberAvailabilityCheck': {
		input:
			SevdeskEndpointInputSchemas[
				'contact.contactCustomerNumberAvailabilityCheck'
			],
		output:
			SevdeskEndpointOutputSchemas[
				'contact.contactCustomerNumberAvailabilityCheck'
			],
	},
	'contact.getContacts': {
		input: SevdeskEndpointInputSchemas['contact.getContacts'],
		output: SevdeskEndpointOutputSchemas['contact.getContacts'],
	},
	'contact.createContact': {
		input: SevdeskEndpointInputSchemas['contact.createContact'],
		output: SevdeskEndpointOutputSchemas['contact.createContact'],
	},
	'contact.getContactById': {
		input: SevdeskEndpointInputSchemas['contact.getContactById'],
		output: SevdeskEndpointOutputSchemas['contact.getContactById'],
	},
	'contact.updateContact': {
		input: SevdeskEndpointInputSchemas['contact.updateContact'],
		output: SevdeskEndpointOutputSchemas['contact.updateContact'],
	},
	'contact.deleteContact': {
		input: SevdeskEndpointInputSchemas['contact.deleteContact'],
		output: SevdeskEndpointOutputSchemas['contact.deleteContact'],
	},
	'contact.getContactTabsItemCountById': {
		input: SevdeskEndpointInputSchemas['contact.getContactTabsItemCountById'],
		output: SevdeskEndpointOutputSchemas['contact.getContactTabsItemCountById'],
	},
	'contactAddress.createContactAddress': {
		input: SevdeskEndpointInputSchemas['contactAddress.createContactAddress'],
		output: SevdeskEndpointOutputSchemas['contactAddress.createContactAddress'],
	},
	'contactAddress.getContactAddresses': {
		input: SevdeskEndpointInputSchemas['contactAddress.getContactAddresses'],
		output: SevdeskEndpointOutputSchemas['contactAddress.getContactAddresses'],
	},
	'contactAddress.contactAddressId': {
		input: SevdeskEndpointInputSchemas['contactAddress.contactAddressId'],
		output: SevdeskEndpointOutputSchemas['contactAddress.contactAddressId'],
	},
	'contactAddress.updateContactAddress': {
		input: SevdeskEndpointInputSchemas['contactAddress.updateContactAddress'],
		output: SevdeskEndpointOutputSchemas['contactAddress.updateContactAddress'],
	},
	'contactAddress.deleteContactAddress': {
		input: SevdeskEndpointInputSchemas['contactAddress.deleteContactAddress'],
		output: SevdeskEndpointOutputSchemas['contactAddress.deleteContactAddress'],
	},
	'communicationWay.getCommunicationWays': {
		input: SevdeskEndpointInputSchemas['communicationWay.getCommunicationWays'],
		output:
			SevdeskEndpointOutputSchemas['communicationWay.getCommunicationWays'],
	},
	'communicationWay.createCommunicationWay': {
		input:
			SevdeskEndpointInputSchemas['communicationWay.createCommunicationWay'],
		output:
			SevdeskEndpointOutputSchemas['communicationWay.createCommunicationWay'],
	},
	'communicationWay.getCommunicationWayById': {
		input:
			SevdeskEndpointInputSchemas['communicationWay.getCommunicationWayById'],
		output:
			SevdeskEndpointOutputSchemas['communicationWay.getCommunicationWayById'],
	},
	'communicationWay.deleteCommunicationWay': {
		input:
			SevdeskEndpointInputSchemas['communicationWay.deleteCommunicationWay'],
		output:
			SevdeskEndpointOutputSchemas['communicationWay.deleteCommunicationWay'],
	},
	'communicationWay.updateCommunicationWay': {
		input:
			SevdeskEndpointInputSchemas['communicationWay.updateCommunicationWay'],
		output:
			SevdeskEndpointOutputSchemas['communicationWay.updateCommunicationWay'],
	},
	'communicationWay.getCommunicationWayKeys': {
		input:
			SevdeskEndpointInputSchemas['communicationWay.getCommunicationWayKeys'],
		output:
			SevdeskEndpointOutputSchemas['communicationWay.getCommunicationWayKeys'],
	},
	'accountingContact.getAccountingContact': {
		input:
			SevdeskEndpointInputSchemas['accountingContact.getAccountingContact'],
		output:
			SevdeskEndpointOutputSchemas['accountingContact.getAccountingContact'],
	},
	'accountingContact.createAccountingContact': {
		input:
			SevdeskEndpointInputSchemas['accountingContact.createAccountingContact'],
		output:
			SevdeskEndpointOutputSchemas['accountingContact.createAccountingContact'],
	},
	'accountingContact.getAccountingContactById': {
		input:
			SevdeskEndpointInputSchemas['accountingContact.getAccountingContactById'],
		output:
			SevdeskEndpointOutputSchemas[
				'accountingContact.getAccountingContactById'
			],
	},
	'accountingContact.updateAccountingContact': {
		input:
			SevdeskEndpointInputSchemas['accountingContact.updateAccountingContact'],
		output:
			SevdeskEndpointOutputSchemas['accountingContact.updateAccountingContact'],
	},
	'accountingContact.deleteAccountingContact': {
		input:
			SevdeskEndpointInputSchemas['accountingContact.deleteAccountingContact'],
		output:
			SevdeskEndpointOutputSchemas['accountingContact.deleteAccountingContact'],
	},
	'contactField.getPlaceholder': {
		input: SevdeskEndpointInputSchemas['contactField.getPlaceholder'],
		output: SevdeskEndpointOutputSchemas['contactField.getPlaceholder'],
	},
	'contactField.getContactFields': {
		input: SevdeskEndpointInputSchemas['contactField.getContactFields'],
		output: SevdeskEndpointOutputSchemas['contactField.getContactFields'],
	},
	'contactField.createContactField': {
		input: SevdeskEndpointInputSchemas['contactField.createContactField'],
		output: SevdeskEndpointOutputSchemas['contactField.createContactField'],
	},
	'contactField.getContactFieldsById': {
		input: SevdeskEndpointInputSchemas['contactField.getContactFieldsById'],
		output: SevdeskEndpointOutputSchemas['contactField.getContactFieldsById'],
	},
	'contactField.updateContactfield': {
		input: SevdeskEndpointInputSchemas['contactField.updateContactfield'],
		output: SevdeskEndpointOutputSchemas['contactField.updateContactfield'],
	},
	'contactField.deleteContactCustomFieldId': {
		input:
			SevdeskEndpointInputSchemas['contactField.deleteContactCustomFieldId'],
		output:
			SevdeskEndpointOutputSchemas['contactField.deleteContactCustomFieldId'],
	},
	'contactField.getContactFieldSettings': {
		input: SevdeskEndpointInputSchemas['contactField.getContactFieldSettings'],
		output:
			SevdeskEndpointOutputSchemas['contactField.getContactFieldSettings'],
	},
	'contactField.createContactFieldSetting': {
		input:
			SevdeskEndpointInputSchemas['contactField.createContactFieldSetting'],
		output:
			SevdeskEndpointOutputSchemas['contactField.createContactFieldSetting'],
	},
	'contactField.getContactFieldSettingById': {
		input:
			SevdeskEndpointInputSchemas['contactField.getContactFieldSettingById'],
		output:
			SevdeskEndpointOutputSchemas['contactField.getContactFieldSettingById'],
	},
	'contactField.updateContactFieldSetting': {
		input:
			SevdeskEndpointInputSchemas['contactField.updateContactFieldSetting'],
		output:
			SevdeskEndpointOutputSchemas['contactField.updateContactFieldSetting'],
	},
	'contactField.deleteContactFieldSetting': {
		input:
			SevdeskEndpointInputSchemas['contactField.deleteContactFieldSetting'],
		output:
			SevdeskEndpointOutputSchemas['contactField.deleteContactFieldSetting'],
	},
	'contactField.getReferenceCount': {
		input: SevdeskEndpointInputSchemas['contactField.getReferenceCount'],
		output: SevdeskEndpointOutputSchemas['contactField.getReferenceCount'],
	},
	'creditNote.getCreditNotes': {
		input: SevdeskEndpointInputSchemas['creditNote.getCreditNotes'],
		output: SevdeskEndpointOutputSchemas['creditNote.getCreditNotes'],
	},
	'creditNote.createcreditNote': {
		input: SevdeskEndpointInputSchemas['creditNote.createcreditNote'],
		output: SevdeskEndpointOutputSchemas['creditNote.createcreditNote'],
	},
	'creditNote.createCreditNoteFromInvoice': {
		input:
			SevdeskEndpointInputSchemas['creditNote.createCreditNoteFromInvoice'],
		output:
			SevdeskEndpointOutputSchemas['creditNote.createCreditNoteFromInvoice'],
	},
	'creditNote.createCreditNoteFromVoucher': {
		input:
			SevdeskEndpointInputSchemas['creditNote.createCreditNoteFromVoucher'],
		output:
			SevdeskEndpointOutputSchemas['creditNote.createCreditNoteFromVoucher'],
	},
	'creditNote.getcreditNoteById': {
		input: SevdeskEndpointInputSchemas['creditNote.getcreditNoteById'],
		output: SevdeskEndpointOutputSchemas['creditNote.getcreditNoteById'],
	},
	'creditNote.updatecreditNote': {
		input: SevdeskEndpointInputSchemas['creditNote.updatecreditNote'],
		output: SevdeskEndpointOutputSchemas['creditNote.updatecreditNote'],
	},
	'creditNote.deletecreditNote': {
		input: SevdeskEndpointInputSchemas['creditNote.deletecreditNote'],
		output: SevdeskEndpointOutputSchemas['creditNote.deletecreditNote'],
	},
	'creditNote.sendCreditNoteByPrinting': {
		input: SevdeskEndpointInputSchemas['creditNote.sendCreditNoteByPrinting'],
		output: SevdeskEndpointOutputSchemas['creditNote.sendCreditNoteByPrinting'],
	},
	'creditNote.creditNoteSendBy': {
		input: SevdeskEndpointInputSchemas['creditNote.creditNoteSendBy'],
		output: SevdeskEndpointOutputSchemas['creditNote.creditNoteSendBy'],
	},
	'creditNote.creditNoteEnshrine': {
		input: SevdeskEndpointInputSchemas['creditNote.creditNoteEnshrine'],
		output: SevdeskEndpointOutputSchemas['creditNote.creditNoteEnshrine'],
	},
	'creditNote.creditNoteGetPdf': {
		input: SevdeskEndpointInputSchemas['creditNote.creditNoteGetPdf'],
		output: SevdeskEndpointOutputSchemas['creditNote.creditNoteGetPdf'],
	},
	'creditNote.sendCreditNoteViaEMail': {
		input: SevdeskEndpointInputSchemas['creditNote.sendCreditNoteViaEMail'],
		output: SevdeskEndpointOutputSchemas['creditNote.sendCreditNoteViaEMail'],
	},
	'creditNote.bookCreditNote': {
		input: SevdeskEndpointInputSchemas['creditNote.bookCreditNote'],
		output: SevdeskEndpointOutputSchemas['creditNote.bookCreditNote'],
	},
	'creditNote.creditNoteResetToOpen': {
		input: SevdeskEndpointInputSchemas['creditNote.creditNoteResetToOpen'],
		output: SevdeskEndpointOutputSchemas['creditNote.creditNoteResetToOpen'],
	},
	'creditNote.creditNoteResetToDraft': {
		input: SevdeskEndpointInputSchemas['creditNote.creditNoteResetToDraft'],
		output: SevdeskEndpointOutputSchemas['creditNote.creditNoteResetToDraft'],
	},
	'creditNotePos.getcreditNotePositions': {
		input: SevdeskEndpointInputSchemas['creditNotePos.getcreditNotePositions'],
		output:
			SevdeskEndpointOutputSchemas['creditNotePos.getcreditNotePositions'],
	},
	'export.updateExportConfig': {
		input: SevdeskEndpointInputSchemas['export.updateExportConfig'],
		output: SevdeskEndpointOutputSchemas['export.updateExportConfig'],
	},
	'export.exportDatevDepricated': {
		input: SevdeskEndpointInputSchemas['export.exportDatevDepricated'],
		output: SevdeskEndpointOutputSchemas['export.exportDatevDepricated'],
	},
	'export.exportDatevCSV': {
		input: SevdeskEndpointInputSchemas['export.exportDatevCSV'],
		output: SevdeskEndpointOutputSchemas['export.exportDatevCSV'],
	},
	'export.exportDatevXML': {
		input: SevdeskEndpointInputSchemas['export.exportDatevXML'],
		output: SevdeskEndpointOutputSchemas['export.exportDatevXML'],
	},
	'export.generateDownloadHash': {
		input: SevdeskEndpointInputSchemas['export.generateDownloadHash'],
		output: SevdeskEndpointOutputSchemas['export.generateDownloadHash'],
	},
	'export.getProgress': {
		input: SevdeskEndpointInputSchemas['export.getProgress'],
		output: SevdeskEndpointOutputSchemas['export.getProgress'],
	},
	'export.jobDownloadInfo': {
		input: SevdeskEndpointInputSchemas['export.jobDownloadInfo'],
		output: SevdeskEndpointOutputSchemas['export.jobDownloadInfo'],
	},
	'export.exportInvoice': {
		input: SevdeskEndpointInputSchemas['export.exportInvoice'],
		output: SevdeskEndpointOutputSchemas['export.exportInvoice'],
	},
	'export.exportInvoiceZip': {
		input: SevdeskEndpointInputSchemas['export.exportInvoiceZip'],
		output: SevdeskEndpointOutputSchemas['export.exportInvoiceZip'],
	},
	'export.exportCreditNote': {
		input: SevdeskEndpointInputSchemas['export.exportCreditNote'],
		output: SevdeskEndpointOutputSchemas['export.exportCreditNote'],
	},
	'export.exportVoucher': {
		input: SevdeskEndpointInputSchemas['export.exportVoucher'],
		output: SevdeskEndpointOutputSchemas['export.exportVoucher'],
	},
	'export.exportTransactions': {
		input: SevdeskEndpointInputSchemas['export.exportTransactions'],
		output: SevdeskEndpointOutputSchemas['export.exportTransactions'],
	},
	'export.exportVoucherZip': {
		input: SevdeskEndpointInputSchemas['export.exportVoucherZip'],
		output: SevdeskEndpointOutputSchemas['export.exportVoucherZip'],
	},
	'export.exportContact': {
		input: SevdeskEndpointInputSchemas['export.exportContact'],
		output: SevdeskEndpointOutputSchemas['export.exportContact'],
	},
	'part.getParts': {
		input: SevdeskEndpointInputSchemas['part.getParts'],
		output: SevdeskEndpointOutputSchemas['part.getParts'],
	},
	'part.createPart': {
		input: SevdeskEndpointInputSchemas['part.createPart'],
		output: SevdeskEndpointOutputSchemas['part.createPart'],
	},
	'part.getPartById': {
		input: SevdeskEndpointInputSchemas['part.getPartById'],
		output: SevdeskEndpointOutputSchemas['part.getPartById'],
	},
	'part.updatePart': {
		input: SevdeskEndpointInputSchemas['part.updatePart'],
		output: SevdeskEndpointOutputSchemas['part.updatePart'],
	},
	'part.partGetStock': {
		input: SevdeskEndpointInputSchemas['part.partGetStock'],
		output: SevdeskEndpointOutputSchemas['part.partGetStock'],
	},
	'invoice.getInvoices': {
		input: SevdeskEndpointInputSchemas['invoice.getInvoices'],
		output: SevdeskEndpointOutputSchemas['invoice.getInvoices'],
	},
	'invoice.createInvoiceByFactory': {
		input: SevdeskEndpointInputSchemas['invoice.createInvoiceByFactory'],
		output: SevdeskEndpointOutputSchemas['invoice.createInvoiceByFactory'],
	},
	'invoice.getInvoiceById': {
		input: SevdeskEndpointInputSchemas['invoice.getInvoiceById'],
		output: SevdeskEndpointOutputSchemas['invoice.getInvoiceById'],
	},
	'invoice.getInvoicePositionsById': {
		input: SevdeskEndpointInputSchemas['invoice.getInvoicePositionsById'],
		output: SevdeskEndpointOutputSchemas['invoice.getInvoicePositionsById'],
	},
	'invoice.createInvoiceFromOrder': {
		input: SevdeskEndpointInputSchemas['invoice.createInvoiceFromOrder'],
		output: SevdeskEndpointOutputSchemas['invoice.createInvoiceFromOrder'],
	},
	'invoice.createInvoiceReminder': {
		input: SevdeskEndpointInputSchemas['invoice.createInvoiceReminder'],
		output: SevdeskEndpointOutputSchemas['invoice.createInvoiceReminder'],
	},
	'invoice.getIsInvoicePartiallyPaid': {
		input: SevdeskEndpointInputSchemas['invoice.getIsInvoicePartiallyPaid'],
		output: SevdeskEndpointOutputSchemas['invoice.getIsInvoicePartiallyPaid'],
	},
	'invoice.cancelInvoice': {
		input: SevdeskEndpointInputSchemas['invoice.cancelInvoice'],
		output: SevdeskEndpointOutputSchemas['invoice.cancelInvoice'],
	},
	'invoice.invoiceRender': {
		input: SevdeskEndpointInputSchemas['invoice.invoiceRender'],
		output: SevdeskEndpointOutputSchemas['invoice.invoiceRender'],
	},
	'invoice.sendInvoiceViaEMail': {
		input: SevdeskEndpointInputSchemas['invoice.sendInvoiceViaEMail'],
		output: SevdeskEndpointOutputSchemas['invoice.sendInvoiceViaEMail'],
	},
	'invoice.invoiceGetPdf': {
		input: SevdeskEndpointInputSchemas['invoice.invoiceGetPdf'],
		output: SevdeskEndpointOutputSchemas['invoice.invoiceGetPdf'],
	},
	'invoice.invoiceSendBy': {
		input: SevdeskEndpointInputSchemas['invoice.invoiceSendBy'],
		output: SevdeskEndpointOutputSchemas['invoice.invoiceSendBy'],
	},
	'invoice.invoiceEnshrine': {
		input: SevdeskEndpointInputSchemas['invoice.invoiceEnshrine'],
		output: SevdeskEndpointOutputSchemas['invoice.invoiceEnshrine'],
	},
	'invoice.bookInvoice': {
		input: SevdeskEndpointInputSchemas['invoice.bookInvoice'],
		output: SevdeskEndpointOutputSchemas['invoice.bookInvoice'],
	},
	'invoice.invoiceResetToOpen': {
		input: SevdeskEndpointInputSchemas['invoice.invoiceResetToOpen'],
		output: SevdeskEndpointOutputSchemas['invoice.invoiceResetToOpen'],
	},
	'invoice.invoiceResetToDraft': {
		input: SevdeskEndpointInputSchemas['invoice.invoiceResetToDraft'],
		output: SevdeskEndpointOutputSchemas['invoice.invoiceResetToDraft'],
	},
	'invoicePos.getInvoicePos': {
		input: SevdeskEndpointInputSchemas['invoicePos.getInvoicePos'],
		output: SevdeskEndpointOutputSchemas['invoicePos.getInvoicePos'],
	},
	'layout.getLetterpapersWithThumb': {
		input: SevdeskEndpointInputSchemas['layout.getLetterpapersWithThumb'],
		output: SevdeskEndpointOutputSchemas['layout.getLetterpapersWithThumb'],
	},
	'layout.getTemplates': {
		input: SevdeskEndpointInputSchemas['layout.getTemplates'],
		output: SevdeskEndpointOutputSchemas['layout.getTemplates'],
	},
	'layout.updateInvoiceTemplate': {
		input: SevdeskEndpointInputSchemas['layout.updateInvoiceTemplate'],
		output: SevdeskEndpointOutputSchemas['layout.updateInvoiceTemplate'],
	},
	'layout.updateOrderTemplate': {
		input: SevdeskEndpointInputSchemas['layout.updateOrderTemplate'],
		output: SevdeskEndpointOutputSchemas['layout.updateOrderTemplate'],
	},
	'layout.updateCreditNoteTemplate': {
		input: SevdeskEndpointInputSchemas['layout.updateCreditNoteTemplate'],
		output: SevdeskEndpointOutputSchemas['layout.updateCreditNoteTemplate'],
	},
	'order.getOrders': {
		input: SevdeskEndpointInputSchemas['order.getOrders'],
		output: SevdeskEndpointOutputSchemas['order.getOrders'],
	},
	'order.createOrder': {
		input: SevdeskEndpointInputSchemas['order.createOrder'],
		output: SevdeskEndpointOutputSchemas['order.createOrder'],
	},
	'order.getOrderById': {
		input: SevdeskEndpointInputSchemas['order.getOrderById'],
		output: SevdeskEndpointOutputSchemas['order.getOrderById'],
	},
	'order.updateOrder': {
		input: SevdeskEndpointInputSchemas['order.updateOrder'],
		output: SevdeskEndpointOutputSchemas['order.updateOrder'],
	},
	'order.deleteOrder': {
		input: SevdeskEndpointInputSchemas['order.deleteOrder'],
		output: SevdeskEndpointOutputSchemas['order.deleteOrder'],
	},
	'order.getOrderPositionsById': {
		input: SevdeskEndpointInputSchemas['order.getOrderPositionsById'],
		output: SevdeskEndpointOutputSchemas['order.getOrderPositionsById'],
	},
	'order.getDiscounts': {
		input: SevdeskEndpointInputSchemas['order.getDiscounts'],
		output: SevdeskEndpointOutputSchemas['order.getDiscounts'],
	},
	'order.getRelatedObjects': {
		input: SevdeskEndpointInputSchemas['order.getRelatedObjects'],
		output: SevdeskEndpointOutputSchemas['order.getRelatedObjects'],
	},
	'order.sendorderViaEMail': {
		input: SevdeskEndpointInputSchemas['order.sendorderViaEMail'],
		output: SevdeskEndpointOutputSchemas['order.sendorderViaEMail'],
	},
	'order.createPackingListFromOrder': {
		input: SevdeskEndpointInputSchemas['order.createPackingListFromOrder'],
		output: SevdeskEndpointOutputSchemas['order.createPackingListFromOrder'],
	},
	'order.createContractNoteFromOrder': {
		input: SevdeskEndpointInputSchemas['order.createContractNoteFromOrder'],
		output: SevdeskEndpointOutputSchemas['order.createContractNoteFromOrder'],
	},
	'order.orderGetPdf': {
		input: SevdeskEndpointInputSchemas['order.orderGetPdf'],
		output: SevdeskEndpointOutputSchemas['order.orderGetPdf'],
	},
	'order.orderSendBy': {
		input: SevdeskEndpointInputSchemas['order.orderSendBy'],
		output: SevdeskEndpointOutputSchemas['order.orderSendBy'],
	},
	'orderPos.getOrderPositions': {
		input: SevdeskEndpointInputSchemas['orderPos.getOrderPositions'],
		output: SevdeskEndpointOutputSchemas['orderPos.getOrderPositions'],
	},
	'orderPos.getOrderPositionById': {
		input: SevdeskEndpointInputSchemas['orderPos.getOrderPositionById'],
		output: SevdeskEndpointOutputSchemas['orderPos.getOrderPositionById'],
	},
	'orderPos.updateOrderPosition': {
		input: SevdeskEndpointInputSchemas['orderPos.updateOrderPosition'],
		output: SevdeskEndpointOutputSchemas['orderPos.updateOrderPosition'],
	},
	'orderPos.deleteOrderPos': {
		input: SevdeskEndpointInputSchemas['orderPos.deleteOrderPos'],
		output: SevdeskEndpointOutputSchemas['orderPos.deleteOrderPos'],
	},
	'voucher.voucherFactorySaveVoucher': {
		input: SevdeskEndpointInputSchemas['voucher.voucherFactorySaveVoucher'],
		output: SevdeskEndpointOutputSchemas['voucher.voucherFactorySaveVoucher'],
	},
	'voucher.getVouchers': {
		input: SevdeskEndpointInputSchemas['voucher.getVouchers'],
		output: SevdeskEndpointOutputSchemas['voucher.getVouchers'],
	},
	'voucher.getVoucherById': {
		input: SevdeskEndpointInputSchemas['voucher.getVoucherById'],
		output: SevdeskEndpointOutputSchemas['voucher.getVoucherById'],
	},
	'voucher.updateVoucher': {
		input: SevdeskEndpointInputSchemas['voucher.updateVoucher'],
		output: SevdeskEndpointOutputSchemas['voucher.updateVoucher'],
	},
	'voucher.voucherEnshrine': {
		input: SevdeskEndpointInputSchemas['voucher.voucherEnshrine'],
		output: SevdeskEndpointOutputSchemas['voucher.voucherEnshrine'],
	},
	'voucher.bookVoucher': {
		input: SevdeskEndpointInputSchemas['voucher.bookVoucher'],
		output: SevdeskEndpointOutputSchemas['voucher.bookVoucher'],
	},
	'voucher.voucherResetToOpen': {
		input: SevdeskEndpointInputSchemas['voucher.voucherResetToOpen'],
		output: SevdeskEndpointOutputSchemas['voucher.voucherResetToOpen'],
	},
	'voucher.voucherResetToDraft': {
		input: SevdeskEndpointInputSchemas['voucher.voucherResetToDraft'],
		output: SevdeskEndpointOutputSchemas['voucher.voucherResetToDraft'],
	},
	'voucherPos.getVoucherPositions': {
		input: SevdeskEndpointInputSchemas['voucherPos.getVoucherPositions'],
		output: SevdeskEndpointOutputSchemas['voucherPos.getVoucherPositions'],
	},
	'voucher.forAllAccounts': {
		input: SevdeskEndpointInputSchemas['voucher.forAllAccounts'],
		output: SevdeskEndpointOutputSchemas['voucher.forAllAccounts'],
	},
	'voucher.forAccountNumber': {
		input: SevdeskEndpointInputSchemas['voucher.forAccountNumber'],
		output: SevdeskEndpointOutputSchemas['voucher.forAccountNumber'],
	},
	'voucher.forTaxRule': {
		input: SevdeskEndpointInputSchemas['voucher.forTaxRule'],
		output: SevdeskEndpointOutputSchemas['voucher.forTaxRule'],
	},
	'voucher.forRevenue': {
		input: SevdeskEndpointInputSchemas['voucher.forRevenue'],
		output: SevdeskEndpointOutputSchemas['voucher.forRevenue'],
	},
	'voucher.forExpense': {
		input: SevdeskEndpointInputSchemas['voucher.forExpense'],
		output: SevdeskEndpointOutputSchemas['voucher.forExpense'],
	},
	'report.reportInvoice': {
		input: SevdeskEndpointInputSchemas['report.reportInvoice'],
		output: SevdeskEndpointOutputSchemas['report.reportInvoice'],
	},
	'report.reportOrder': {
		input: SevdeskEndpointInputSchemas['report.reportOrder'],
		output: SevdeskEndpointOutputSchemas['report.reportOrder'],
	},
	'report.reportContact': {
		input: SevdeskEndpointInputSchemas['report.reportContact'],
		output: SevdeskEndpointOutputSchemas['report.reportContact'],
	},
	'report.reportVoucher': {
		input: SevdeskEndpointInputSchemas['report.reportVoucher'],
		output: SevdeskEndpointOutputSchemas['report.reportVoucher'],
	},
	'tag.getTags': {
		input: SevdeskEndpointInputSchemas['tag.getTags'],
		output: SevdeskEndpointOutputSchemas['tag.getTags'],
	},
	'tag.getTagById': {
		input: SevdeskEndpointInputSchemas['tag.getTagById'],
		output: SevdeskEndpointOutputSchemas['tag.getTagById'],
	},
	'tag.updateTag': {
		input: SevdeskEndpointInputSchemas['tag.updateTag'],
		output: SevdeskEndpointOutputSchemas['tag.updateTag'],
	},
	'tag.deleteTag': {
		input: SevdeskEndpointInputSchemas['tag.deleteTag'],
		output: SevdeskEndpointOutputSchemas['tag.deleteTag'],
	},
	'tag.createTag': {
		input: SevdeskEndpointInputSchemas['tag.createTag'],
		output: SevdeskEndpointOutputSchemas['tag.createTag'],
	},
	'tag.getTagRelations': {
		input: SevdeskEndpointInputSchemas['tag.getTagRelations'],
		output: SevdeskEndpointOutputSchemas['tag.getTagRelations'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof sevdeskEndpointsNested
>;
const sevdeskEndpointMeta = {
	'basics.bookkeepingSystemVersion': {
		riskLevel: 'read',
		description: 'Retrieve bookkeeping system version. Reads Sevdesk data.',
	},
	'checkAccount.getCheckAccounts': {
		riskLevel: 'read',
		description: 'Retrieve check accounts. Reads Sevdesk data.',
	},
	'checkAccount.createFileImportAccount': {
		riskLevel: 'write',
		description:
			'Create a new file import account. Changes Sevdesk data or starts an export job.',
	},
	'checkAccount.createClearingAccount': {
		riskLevel: 'write',
		description:
			'Create a new clearing account. Changes Sevdesk data or starts an export job.',
	},
	'checkAccount.getCheckAccountById': {
		riskLevel: 'read',
		description: 'Find check account by ID. Reads Sevdesk data.',
	},
	'checkAccount.updateCheckAccount': {
		riskLevel: 'write',
		description:
			'Update an existing check account. Changes Sevdesk data or starts an export job.',
	},
	'checkAccount.deleteCheckAccount': {
		riskLevel: 'destructive',
		description:
			'Deletes a check account. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'checkAccount.getBalanceAtDate': {
		riskLevel: 'read',
		description: 'Get the balance at a given date. Reads Sevdesk data.',
	},
	'checkAccountTransaction.getTransactions': {
		riskLevel: 'read',
		description: 'Retrieve transactions. Reads Sevdesk data.',
	},
	'checkAccountTransaction.createTransaction': {
		riskLevel: 'write',
		description:
			'Create a new transaction. Changes Sevdesk data or starts an export job.',
	},
	'checkAccountTransaction.getCheckAccountTransactionById': {
		riskLevel: 'read',
		description: 'Find check account transaction by ID. Reads Sevdesk data.',
	},
	'checkAccountTransaction.updateCheckAccountTransaction': {
		riskLevel: 'write',
		description:
			'Update an existing check account transaction. Changes Sevdesk data or starts an export job.',
	},
	'checkAccountTransaction.deleteCheckAccountTransaction': {
		riskLevel: 'destructive',
		description:
			'Deletes a check account transaction. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'checkAccountTransaction.checkAccountTransactionEnshrine': {
		riskLevel: 'destructive',
		description:
			'Enshrine. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'privateTransactionRule.listPrivateTransactionRules': {
		riskLevel: 'read',
		description: 'List existing rules. Reads Sevdesk data.',
	},
	'privateTransactionRule.createPrivateTransactionRule': {
		riskLevel: 'write',
		description:
			'Create a new rule. Changes Sevdesk data or starts an export job.',
	},
	'privateTransactionRule.deletePrivateTransactionRule': {
		riskLevel: 'destructive',
		description:
			'Delete the rule by id. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'contact.getNextCustomerNumber': {
		riskLevel: 'read',
		description: 'Get next free customer number. Reads Sevdesk data.',
	},
	'contact.findContactsByCustomFieldValue': {
		riskLevel: 'read',
		description: 'Find contacts by custom field value. Reads Sevdesk data.',
	},
	'contact.contactCustomerNumberAvailabilityCheck': {
		riskLevel: 'read',
		description: 'Check if a customer number is available. Reads Sevdesk data.',
	},
	'contact.getContacts': {
		riskLevel: 'read',
		description: 'Retrieve contacts. Reads Sevdesk data.',
	},
	'contact.createContact': {
		riskLevel: 'write',
		description:
			'Create a new contact. Changes Sevdesk data or starts an export job.',
	},
	'contact.getContactById': {
		riskLevel: 'read',
		description: 'Find contact by ID. Reads Sevdesk data.',
	},
	'contact.updateContact': {
		riskLevel: 'write',
		description:
			'Update a existing contact. Changes Sevdesk data or starts an export job.',
	},
	'contact.deleteContact': {
		riskLevel: 'destructive',
		description:
			'Deletes a contact. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'contact.getContactTabsItemCountById': {
		riskLevel: 'read',
		description: 'Get number of all items. Reads Sevdesk data.',
	},
	'contactAddress.createContactAddress': {
		riskLevel: 'write',
		description:
			'Create a new contact address. Changes Sevdesk data or starts an export job.',
	},
	'contactAddress.getContactAddresses': {
		riskLevel: 'read',
		description: 'Retrieve contact addresses. Reads Sevdesk data.',
	},
	'contactAddress.contactAddressId': {
		riskLevel: 'read',
		description: 'Find contact address by ID. Reads Sevdesk data.',
	},
	'contactAddress.updateContactAddress': {
		riskLevel: 'write',
		description:
			'update a existing contact address. Changes Sevdesk data or starts an export job.',
	},
	'contactAddress.deleteContactAddress': {
		riskLevel: 'destructive',
		description:
			'Deletes a contact address. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'communicationWay.getCommunicationWays': {
		riskLevel: 'read',
		description: 'Retrieve communication ways. Reads Sevdesk data.',
	},
	'communicationWay.createCommunicationWay': {
		riskLevel: 'write',
		description:
			'Create a new contact communication way. Changes Sevdesk data or starts an export job.',
	},
	'communicationWay.getCommunicationWayById': {
		riskLevel: 'read',
		description: 'Find communication way by ID. Reads Sevdesk data.',
	},
	'communicationWay.deleteCommunicationWay': {
		riskLevel: 'destructive',
		description:
			'Deletes a communication way. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'communicationWay.updateCommunicationWay': {
		riskLevel: 'write',
		description:
			'Update a existing communication way. Changes Sevdesk data or starts an export job.',
	},
	'communicationWay.getCommunicationWayKeys': {
		riskLevel: 'read',
		description: 'Retrieve communication way keys. Reads Sevdesk data.',
	},
	'accountingContact.getAccountingContact': {
		riskLevel: 'read',
		description: 'Retrieve accounting contact. Reads Sevdesk data.',
	},
	'accountingContact.createAccountingContact': {
		riskLevel: 'write',
		description:
			'Create a new accounting contact. Changes Sevdesk data or starts an export job.',
	},
	'accountingContact.getAccountingContactById': {
		riskLevel: 'read',
		description: 'Find accounting contact by ID. Reads Sevdesk data.',
	},
	'accountingContact.updateAccountingContact': {
		riskLevel: 'write',
		description:
			'Update an existing accounting contact. Changes Sevdesk data or starts an export job.',
	},
	'accountingContact.deleteAccountingContact': {
		riskLevel: 'destructive',
		description:
			'Deletes an accounting contact. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'contactField.getPlaceholder': {
		riskLevel: 'read',
		description: 'Retrieve Placeholders. Reads Sevdesk data.',
	},
	'contactField.getContactFields': {
		riskLevel: 'read',
		description: 'Retrieve contact fields. Reads Sevdesk data.',
	},
	'contactField.createContactField': {
		riskLevel: 'write',
		description:
			'Create contact field. Changes Sevdesk data or starts an export job.',
	},
	'contactField.getContactFieldsById': {
		riskLevel: 'read',
		description: 'Retrieve contact fields. Reads Sevdesk data.',
	},
	'contactField.updateContactfield': {
		riskLevel: 'write',
		description:
			'Update a contact field. Changes Sevdesk data or starts an export job.',
	},
	'contactField.deleteContactCustomFieldId': {
		riskLevel: 'destructive',
		description:
			'delete a contact field. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'contactField.getContactFieldSettings': {
		riskLevel: 'read',
		description: 'Retrieve contact field settings. Reads Sevdesk data.',
	},
	'contactField.createContactFieldSetting': {
		riskLevel: 'write',
		description:
			'Create contact field setting. Changes Sevdesk data or starts an export job.',
	},
	'contactField.getContactFieldSettingById': {
		riskLevel: 'read',
		description: 'Find contact field setting by ID. Reads Sevdesk data.',
	},
	'contactField.updateContactFieldSetting': {
		riskLevel: 'write',
		description:
			'Update contact field setting. Changes Sevdesk data or starts an export job.',
	},
	'contactField.deleteContactFieldSetting': {
		riskLevel: 'destructive',
		description:
			'Deletes a contact field setting. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'contactField.getReferenceCount': {
		riskLevel: 'read',
		description: 'Receive count reference. Reads Sevdesk data.',
	},
	'creditNote.getCreditNotes': {
		riskLevel: 'read',
		description: 'Retrieve CreditNote. Reads Sevdesk data.',
	},
	'creditNote.createcreditNote': {
		riskLevel: 'write',
		description:
			'Create a new creditNote. Changes Sevdesk data or starts an export job.',
	},
	'creditNote.createCreditNoteFromInvoice': {
		riskLevel: 'write',
		description:
			'Creates a new creditNote from an invoice. Changes Sevdesk data or starts an export job.',
	},
	'creditNote.createCreditNoteFromVoucher': {
		riskLevel: 'write',
		description:
			'Creates a new creditNote from a voucher. Changes Sevdesk data or starts an export job.',
	},
	'creditNote.getcreditNoteById': {
		riskLevel: 'read',
		description: 'Find creditNote by ID. Reads Sevdesk data.',
	},
	'creditNote.updatecreditNote': {
		riskLevel: 'write',
		description:
			'Update an existing creditNote. Changes Sevdesk data or starts an export job.',
	},
	'creditNote.deletecreditNote': {
		riskLevel: 'destructive',
		description:
			'Deletes an creditNote. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'creditNote.sendCreditNoteByPrinting': {
		riskLevel: 'destructive',
		description:
			'Send credit note by printing. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'creditNote.creditNoteSendBy': {
		riskLevel: 'destructive',
		description:
			'Mark credit note as sent. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'creditNote.creditNoteEnshrine': {
		riskLevel: 'destructive',
		description:
			'Enshrine. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'creditNote.creditNoteGetPdf': {
		riskLevel: 'destructive',
		description:
			'Retrieve pdf document of a credit note. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'creditNote.sendCreditNoteViaEMail': {
		riskLevel: 'destructive',
		description:
			'Send credit note via email. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'creditNote.bookCreditNote': {
		riskLevel: 'destructive',
		description:
			'Book a credit note. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'creditNote.creditNoteResetToOpen': {
		riskLevel: 'write',
		description:
			'Reset status to open. Changes Sevdesk data or starts an export job.',
	},
	'creditNote.creditNoteResetToDraft': {
		riskLevel: 'write',
		description:
			'Reset status to draft. Changes Sevdesk data or starts an export job.',
	},
	'creditNotePos.getcreditNotePositions': {
		riskLevel: 'read',
		description: 'Retrieve creditNote positions. Reads Sevdesk data.',
	},
	'export.updateExportConfig': {
		riskLevel: 'write',
		description:
			'Update export config. Changes Sevdesk data or starts an export job.',
	},
	'export.exportDatevDepricated': {
		riskLevel: 'read',
		description: 'Export datev. Reads Sevdesk data.',
	},
	'export.exportDatevCSV': {
		riskLevel: 'read',
		description: 'Start DATEV CSV ZIP export. Reads Sevdesk data.',
	},
	'export.exportDatevXML': {
		riskLevel: 'read',
		description: 'Start DATEV XML ZIP export. Reads Sevdesk data.',
	},
	'export.generateDownloadHash': {
		riskLevel: 'write',
		description:
			'Generate download hash. Changes Sevdesk data or starts an export job.',
	},
	'export.getProgress': {
		riskLevel: 'read',
		description: 'Get progress. Reads Sevdesk data.',
	},
	'export.jobDownloadInfo': {
		riskLevel: 'read',
		description: 'Get job download info. Reads Sevdesk data.',
	},
	'export.exportInvoice': {
		riskLevel: 'read',
		description: 'Export invoice. Reads Sevdesk data.',
	},
	'export.exportInvoiceZip': {
		riskLevel: 'read',
		description: 'Export Invoice as zip. Reads Sevdesk data.',
	},
	'export.exportCreditNote': {
		riskLevel: 'read',
		description: 'Export creditNote. Reads Sevdesk data.',
	},
	'export.exportVoucher': {
		riskLevel: 'read',
		description: 'Export voucher as zip. Reads Sevdesk data.',
	},
	'export.exportTransactions': {
		riskLevel: 'read',
		description: 'Export transaction. Reads Sevdesk data.',
	},
	'export.exportVoucherZip': {
		riskLevel: 'read',
		description: 'Export voucher zip. Reads Sevdesk data.',
	},
	'export.exportContact': {
		riskLevel: 'read',
		description: 'Export contact. Reads Sevdesk data.',
	},
	'part.getParts': {
		riskLevel: 'read',
		description: 'Retrieve parts. Reads Sevdesk data.',
	},
	'part.createPart': {
		riskLevel: 'write',
		description:
			'Create a new part. Changes Sevdesk data or starts an export job.',
	},
	'part.getPartById': {
		riskLevel: 'read',
		description: 'Find part by ID. Reads Sevdesk data.',
	},
	'part.updatePart': {
		riskLevel: 'write',
		description:
			'Update an existing part. Changes Sevdesk data or starts an export job.',
	},
	'part.partGetStock': {
		riskLevel: 'read',
		description: 'Get stock of a part. Reads Sevdesk data.',
	},
	'invoice.getInvoices': {
		riskLevel: 'read',
		description: 'Retrieve invoices. Reads Sevdesk data.',
	},
	'invoice.createInvoiceByFactory': {
		riskLevel: 'write',
		description:
			'Create a new invoice. Changes Sevdesk data or starts an export job.',
	},
	'invoice.getInvoiceById': {
		riskLevel: 'read',
		description: 'Find invoice by ID. Reads Sevdesk data.',
	},
	'invoice.getInvoicePositionsById': {
		riskLevel: 'read',
		description: 'Find invoice positions. Reads Sevdesk data.',
	},
	'invoice.createInvoiceFromOrder': {
		riskLevel: 'write',
		description:
			'Create invoice from order. Changes Sevdesk data or starts an export job.',
	},
	'invoice.createInvoiceReminder': {
		riskLevel: 'destructive',
		description:
			'Create invoice reminder. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'invoice.getIsInvoicePartiallyPaid': {
		riskLevel: 'read',
		description:
			'Check if an invoice is already partially paid. Reads Sevdesk data.',
	},
	'invoice.cancelInvoice': {
		riskLevel: 'destructive',
		description:
			'Cancel an invoice / Create cancellation invoice. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'invoice.invoiceRender': {
		riskLevel: 'write',
		description:
			'Render the pdf document of an invoice. Changes Sevdesk data or starts an export job.',
	},
	'invoice.sendInvoiceViaEMail': {
		riskLevel: 'destructive',
		description:
			'Send invoice via email. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'invoice.invoiceGetPdf': {
		riskLevel: 'destructive',
		description:
			'Retrieve pdf document of an invoice. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'invoice.invoiceSendBy': {
		riskLevel: 'destructive',
		description:
			'Mark invoice as sent. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'invoice.invoiceEnshrine': {
		riskLevel: 'destructive',
		description:
			'Enshrine. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'invoice.bookInvoice': {
		riskLevel: 'destructive',
		description:
			'Book an invoice. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'invoice.invoiceResetToOpen': {
		riskLevel: 'write',
		description:
			'Reset status to open. Changes Sevdesk data or starts an export job.',
	},
	'invoice.invoiceResetToDraft': {
		riskLevel: 'write',
		description:
			'Reset status to draft. Changes Sevdesk data or starts an export job.',
	},
	'invoicePos.getInvoicePos': {
		riskLevel: 'read',
		description: 'Retrieve InvoicePos. Reads Sevdesk data.',
	},
	'layout.getLetterpapersWithThumb': {
		riskLevel: 'read',
		description: 'Retrieve letterpapers. Reads Sevdesk data.',
	},
	'layout.getTemplates': {
		riskLevel: 'read',
		description: 'Retrieve templates. Reads Sevdesk data.',
	},
	'layout.updateInvoiceTemplate': {
		riskLevel: 'write',
		description:
			'Update an invoice template. Changes Sevdesk data or starts an export job.',
	},
	'layout.updateOrderTemplate': {
		riskLevel: 'write',
		description:
			'Update an order template. Changes Sevdesk data or starts an export job.',
	},
	'layout.updateCreditNoteTemplate': {
		riskLevel: 'write',
		description:
			'Update an of credit note template. Changes Sevdesk data or starts an export job.',
	},
	'order.getOrders': {
		riskLevel: 'read',
		description: 'Retrieve orders. Reads Sevdesk data.',
	},
	'order.createOrder': {
		riskLevel: 'write',
		description:
			'Create a new order. Changes Sevdesk data or starts an export job.',
	},
	'order.getOrderById': {
		riskLevel: 'read',
		description: 'Find order by ID. Reads Sevdesk data.',
	},
	'order.updateOrder': {
		riskLevel: 'write',
		description:
			'Update an existing order. Changes Sevdesk data or starts an export job.',
	},
	'order.deleteOrder': {
		riskLevel: 'destructive',
		description:
			'Deletes an order. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'order.getOrderPositionsById': {
		riskLevel: 'read',
		description: 'Find order positions. Reads Sevdesk data.',
	},
	'order.getDiscounts': {
		riskLevel: 'read',
		description: 'Find order discounts. Reads Sevdesk data.',
	},
	'order.getRelatedObjects': {
		riskLevel: 'read',
		description: 'Find related objects. Reads Sevdesk data.',
	},
	'order.sendorderViaEMail': {
		riskLevel: 'destructive',
		description:
			'Send order via email. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'order.createPackingListFromOrder': {
		riskLevel: 'write',
		description:
			'Create packing list from order. Changes Sevdesk data or starts an export job.',
	},
	'order.createContractNoteFromOrder': {
		riskLevel: 'write',
		description:
			'Create contract note from order. Changes Sevdesk data or starts an export job.',
	},
	'order.orderGetPdf': {
		riskLevel: 'destructive',
		description:
			'Retrieve pdf document of an order. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'order.orderSendBy': {
		riskLevel: 'destructive',
		description:
			'Mark order as sent. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'orderPos.getOrderPositions': {
		riskLevel: 'read',
		description: 'Retrieve order positions. Reads Sevdesk data.',
	},
	'orderPos.getOrderPositionById': {
		riskLevel: 'read',
		description: 'Find order position by ID. Reads Sevdesk data.',
	},
	'orderPos.updateOrderPosition': {
		riskLevel: 'write',
		description:
			'Update an existing order position. Changes Sevdesk data or starts an export job.',
	},
	'orderPos.deleteOrderPos': {
		riskLevel: 'destructive',
		description:
			'Deletes an order Position. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'voucher.voucherFactorySaveVoucher': {
		riskLevel: 'write',
		description:
			'Create a new voucher. Changes Sevdesk data or starts an export job.',
	},
	'voucher.getVouchers': {
		riskLevel: 'read',
		description: 'Retrieve vouchers. Reads Sevdesk data.',
	},
	'voucher.getVoucherById': {
		riskLevel: 'read',
		description: 'Find voucher by ID. Reads Sevdesk data.',
	},
	'voucher.updateVoucher': {
		riskLevel: 'write',
		description:
			'Update an existing voucher. Changes Sevdesk data or starts an export job.',
	},
	'voucher.voucherEnshrine': {
		riskLevel: 'destructive',
		description:
			'Enshrine. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'voucher.bookVoucher': {
		riskLevel: 'destructive',
		description:
			'Book a voucher. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'voucher.voucherResetToOpen': {
		riskLevel: 'write',
		description:
			'Reset status to open. Changes Sevdesk data or starts an export job.',
	},
	'voucher.voucherResetToDraft': {
		riskLevel: 'write',
		description:
			'Reset status to draft. Changes Sevdesk data or starts an export job.',
	},
	'voucherPos.getVoucherPositions': {
		riskLevel: 'read',
		description: 'Retrieve voucher positions. Reads Sevdesk data.',
	},
	'voucher.forAllAccounts': {
		riskLevel: 'read',
		description: 'Get all account guides. Reads Sevdesk data.',
	},
	'voucher.forAccountNumber': {
		riskLevel: 'read',
		description: 'Get guidance by account number. Reads Sevdesk data.',
	},
	'voucher.forTaxRule': {
		riskLevel: 'read',
		description: 'Get guidance by Tax Rule. Reads Sevdesk data.',
	},
	'voucher.forRevenue': {
		riskLevel: 'read',
		description: 'Get guidance for revenue accounts. Reads Sevdesk data.',
	},
	'voucher.forExpense': {
		riskLevel: 'read',
		description: 'Get guidance for expense accounts. Reads Sevdesk data.',
	},
	'report.reportInvoice': {
		riskLevel: 'read',
		description: 'Export invoice list. Reads Sevdesk data.',
	},
	'report.reportOrder': {
		riskLevel: 'read',
		description: 'Export order list. Reads Sevdesk data.',
	},
	'report.reportContact': {
		riskLevel: 'read',
		description: 'Export contact list. Reads Sevdesk data.',
	},
	'report.reportVoucher': {
		riskLevel: 'read',
		description: 'Export voucher list. Reads Sevdesk data.',
	},
	'tag.getTags': {
		riskLevel: 'read',
		description: 'Retrieve tags. Reads Sevdesk data.',
	},
	'tag.getTagById': {
		riskLevel: 'read',
		description: 'Find tag by ID. Reads Sevdesk data.',
	},
	'tag.updateTag': {
		riskLevel: 'write',
		description: 'Update tag. Changes Sevdesk data or starts an export job.',
	},
	'tag.deleteTag': {
		riskLevel: 'destructive',
		description:
			'Deletes a tag. Confirm before sending, booking, deleting, or legally enshrining accounting records.',
	},
	'tag.createTag': {
		riskLevel: 'write',
		description:
			'Create a new tag. Changes Sevdesk data or starts an export job.',
	},
	'tag.getTagRelations': {
		riskLevel: 'read',
		description: 'Retrieve tag relations. Reads Sevdesk data.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof sevdeskEndpointsNested>;
export const sevdeskAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseSevdeskPlugin<T extends SevdeskPluginOptions> = CorsairPlugin<
	'sevdesk',
	typeof SevdeskSchema,
	typeof sevdeskEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;
export type InternalSevdeskPlugin = BaseSevdeskPlugin<SevdeskPluginOptions>;
export type ExternalSevdeskPlugin<T extends SevdeskPluginOptions> =
	BaseSevdeskPlugin<T>;

export function sevdesk<const T extends SevdeskPluginOptions>(
	incomingOptions: SevdeskPluginOptions & T = {} as SevdeskPluginOptions & T,
): ExternalSevdeskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};
	return {
		id: 'sevdesk',
		authConfig: sevdeskAuthConfig,
		schema: SevdeskSchema,
		options,
		hooks: options.hooks,
		endpoints: sevdeskEndpointsNested,
		webhooks: {},
		endpointMeta: sevdeskEndpointMeta,
		endpointSchemas: sevdeskEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: SevdeskKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('sevdesk', 'api_key');
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('sevdesk', 'api_key');
			return key;
		},
	} satisfies InternalSevdeskPlugin;
}
export { sevdeskEndpointsNested };
export type { SevdeskEndpointInputs, SevdeskEndpointOutputs };
