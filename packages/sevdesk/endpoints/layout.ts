import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const Layout = {
	getLetterpapersWithThumb: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['layout.getLetterpapersWithThumb'],
		SevdeskEndpointOutputSchemas['layout.getLetterpapersWithThumb'],
		'layout.getLetterpapersWithThumb',
		'GET',
		'/DocServer/getLetterpapersWithThumb',
	),
	getTemplates: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['layout.getTemplates'],
		SevdeskEndpointOutputSchemas['layout.getTemplates'],
		'layout.getTemplates',
		'GET',
		'/DocServer/getTemplatesWithThumb',
	),
	updateInvoiceTemplate: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['layout.updateInvoiceTemplate'],
		SevdeskEndpointOutputSchemas['layout.updateInvoiceTemplate'],
		'layout.updateInvoiceTemplate',
		'PUT',
		'/Invoice/{invoiceId}/changeParameter',
	),
	updateOrderTemplate: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['layout.updateOrderTemplate'],
		SevdeskEndpointOutputSchemas['layout.updateOrderTemplate'],
		'layout.updateOrderTemplate',
		'PUT',
		'/Order/{orderId}/changeParameter',
	),
	updateCreditNoteTemplate: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['layout.updateCreditNoteTemplate'],
		SevdeskEndpointOutputSchemas['layout.updateCreditNoteTemplate'],
		'layout.updateCreditNoteTemplate',
		'PUT',
		'/CreditNote/{creditNoteId}/changeParameter',
	),
} as const;
