import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const CheckAccount = {
	getCheckAccounts: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['checkAccount.getCheckAccounts'],
		SevdeskEndpointOutputSchemas['checkAccount.getCheckAccounts'],
		'checkAccount.getCheckAccounts',
		'GET',
		'/CheckAccount',
	),
	createFileImportAccount: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['checkAccount.createFileImportAccount'],
		SevdeskEndpointOutputSchemas['checkAccount.createFileImportAccount'],
		'checkAccount.createFileImportAccount',
		'POST',
		'/CheckAccount/Factory/fileImportAccount',
	),
	createClearingAccount: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['checkAccount.createClearingAccount'],
		SevdeskEndpointOutputSchemas['checkAccount.createClearingAccount'],
		'checkAccount.createClearingAccount',
		'POST',
		'/CheckAccount/Factory/clearingAccount',
	),
	getCheckAccountById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['checkAccount.getCheckAccountById'],
		SevdeskEndpointOutputSchemas['checkAccount.getCheckAccountById'],
		'checkAccount.getCheckAccountById',
		'GET',
		'/CheckAccount/{checkAccountId}',
	),
	updateCheckAccount: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['checkAccount.updateCheckAccount'],
		SevdeskEndpointOutputSchemas['checkAccount.updateCheckAccount'],
		'checkAccount.updateCheckAccount',
		'PUT',
		'/CheckAccount/{checkAccountId}',
	),
	deleteCheckAccount: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['checkAccount.deleteCheckAccount'],
		SevdeskEndpointOutputSchemas['checkAccount.deleteCheckAccount'],
		'checkAccount.deleteCheckAccount',
		'DELETE',
		'/CheckAccount/{checkAccountId}',
	),
	getBalanceAtDate: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['checkAccount.getBalanceAtDate'],
		SevdeskEndpointOutputSchemas['checkAccount.getBalanceAtDate'],
		'checkAccount.getBalanceAtDate',
		'GET',
		'/CheckAccount/{checkAccountId}/getBalanceAtDate',
	),
} as const;
