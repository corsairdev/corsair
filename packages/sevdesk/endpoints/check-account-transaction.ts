import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const CheckAccountTransaction = {
	getTransactions: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['checkAccountTransaction.getTransactions'],
		SevdeskEndpointOutputSchemas['checkAccountTransaction.getTransactions'],
		'checkAccountTransaction.getTransactions',
		'GET',
		'/CheckAccountTransaction',
	),
	createTransaction: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['checkAccountTransaction.createTransaction'],
		SevdeskEndpointOutputSchemas['checkAccountTransaction.createTransaction'],
		'checkAccountTransaction.createTransaction',
		'POST',
		'/CheckAccountTransaction',
	),
	getCheckAccountTransactionById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas[
			'checkAccountTransaction.getCheckAccountTransactionById'
		],
		SevdeskEndpointOutputSchemas[
			'checkAccountTransaction.getCheckAccountTransactionById'
		],
		'checkAccountTransaction.getCheckAccountTransactionById',
		'GET',
		'/CheckAccountTransaction/{checkAccountTransactionId}',
	),
	updateCheckAccountTransaction: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas[
			'checkAccountTransaction.updateCheckAccountTransaction'
		],
		SevdeskEndpointOutputSchemas[
			'checkAccountTransaction.updateCheckAccountTransaction'
		],
		'checkAccountTransaction.updateCheckAccountTransaction',
		'PUT',
		'/CheckAccountTransaction/{checkAccountTransactionId}',
	),
	deleteCheckAccountTransaction: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas[
			'checkAccountTransaction.deleteCheckAccountTransaction'
		],
		SevdeskEndpointOutputSchemas[
			'checkAccountTransaction.deleteCheckAccountTransaction'
		],
		'checkAccountTransaction.deleteCheckAccountTransaction',
		'DELETE',
		'/CheckAccountTransaction/{checkAccountTransactionId}',
	),
	checkAccountTransactionEnshrine: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas[
			'checkAccountTransaction.checkAccountTransactionEnshrine'
		],
		SevdeskEndpointOutputSchemas[
			'checkAccountTransaction.checkAccountTransactionEnshrine'
		],
		'checkAccountTransaction.checkAccountTransactionEnshrine',
		'PUT',
		'/CheckAccountTransaction/{checkAccountTransactionId}/enshrine',
	),
} as const;
