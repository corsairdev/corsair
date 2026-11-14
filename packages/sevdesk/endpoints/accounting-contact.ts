import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const AccountingContact = {
	getAccountingContact: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['accountingContact.getAccountingContact'],
		SevdeskEndpointOutputSchemas['accountingContact.getAccountingContact'],
		'accountingContact.getAccountingContact',
		'GET',
		'/AccountingContact',
	),
	createAccountingContact: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['accountingContact.createAccountingContact'],
		SevdeskEndpointOutputSchemas['accountingContact.createAccountingContact'],
		'accountingContact.createAccountingContact',
		'POST',
		'/AccountingContact',
	),
	getAccountingContactById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['accountingContact.getAccountingContactById'],
		SevdeskEndpointOutputSchemas['accountingContact.getAccountingContactById'],
		'accountingContact.getAccountingContactById',
		'GET',
		'/AccountingContact/{accountingContactId}',
	),
	updateAccountingContact: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['accountingContact.updateAccountingContact'],
		SevdeskEndpointOutputSchemas['accountingContact.updateAccountingContact'],
		'accountingContact.updateAccountingContact',
		'PUT',
		'/AccountingContact/{accountingContactId}',
	),
	deleteAccountingContact: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['accountingContact.deleteAccountingContact'],
		SevdeskEndpointOutputSchemas['accountingContact.deleteAccountingContact'],
		'accountingContact.deleteAccountingContact',
		'DELETE',
		'/AccountingContact/{accountingContactId}',
	),
} as const;
