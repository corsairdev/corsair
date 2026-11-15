import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const Report = {
	reportInvoice: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['report.reportInvoice'],
		SevdeskEndpointOutputSchemas['report.reportInvoice'],
		'report.reportInvoice',
		'GET',
		'/Report/invoicelist',
	),
	reportOrder: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['report.reportOrder'],
		SevdeskEndpointOutputSchemas['report.reportOrder'],
		'report.reportOrder',
		'GET',
		'/Report/orderlist',
	),
	reportContact: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['report.reportContact'],
		SevdeskEndpointOutputSchemas['report.reportContact'],
		'report.reportContact',
		'GET',
		'/Report/contactlist',
	),
	reportVoucher: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['report.reportVoucher'],
		SevdeskEndpointOutputSchemas['report.reportVoucher'],
		'report.reportVoucher',
		'GET',
		'/Report/voucherlist',
	),
} as const;
