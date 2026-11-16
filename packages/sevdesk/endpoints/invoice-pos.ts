import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const InvoicePos = {
	getInvoicePos: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['invoicePos.getInvoicePos'],
		SevdeskEndpointOutputSchemas['invoicePos.getInvoicePos'],
		'invoicePos.getInvoicePos',
		'GET',
		'/InvoicePos',
	),
} as const;
