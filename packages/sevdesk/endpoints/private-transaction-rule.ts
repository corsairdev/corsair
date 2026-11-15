import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const PrivateTransactionRule = {
	listPrivateTransactionRules: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas[
			'privateTransactionRule.listPrivateTransactionRules'
		],
		SevdeskEndpointOutputSchemas[
			'privateTransactionRule.listPrivateTransactionRules'
		],
		'privateTransactionRule.listPrivateTransactionRules',
		'GET',
		'/PrivateTransactionRule',
	),
	createPrivateTransactionRule: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas[
			'privateTransactionRule.createPrivateTransactionRule'
		],
		SevdeskEndpointOutputSchemas[
			'privateTransactionRule.createPrivateTransactionRule'
		],
		'privateTransactionRule.createPrivateTransactionRule',
		'POST',
		'/PrivateTransactionRule',
	),
	deletePrivateTransactionRule: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas[
			'privateTransactionRule.deletePrivateTransactionRule'
		],
		SevdeskEndpointOutputSchemas[
			'privateTransactionRule.deletePrivateTransactionRule'
		],
		'privateTransactionRule.deletePrivateTransactionRule',
		'DELETE',
		'/PrivateTransactionRule/{id}',
	),
} as const;
