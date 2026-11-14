import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const Contact = {
	getNextCustomerNumber: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contact.getNextCustomerNumber'],
		SevdeskEndpointOutputSchemas['contact.getNextCustomerNumber'],
		'contact.getNextCustomerNumber',
		'GET',
		'/Contact/Factory/getNextCustomerNumber',
	),
	findContactsByCustomFieldValue: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contact.findContactsByCustomFieldValue'],
		SevdeskEndpointOutputSchemas['contact.findContactsByCustomFieldValue'],
		'contact.findContactsByCustomFieldValue',
		'GET',
		'/Contact/Factory/findContactsByCustomFieldValue',
	),
	contactCustomerNumberAvailabilityCheck: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas[
			'contact.contactCustomerNumberAvailabilityCheck'
		],
		SevdeskEndpointOutputSchemas[
			'contact.contactCustomerNumberAvailabilityCheck'
		],
		'contact.contactCustomerNumberAvailabilityCheck',
		'GET',
		'/Contact/Mapper/checkCustomerNumberAvailability',
	),
	getContacts: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contact.getContacts'],
		SevdeskEndpointOutputSchemas['contact.getContacts'],
		'contact.getContacts',
		'GET',
		'/Contact',
	),
	createContact: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contact.createContact'],
		SevdeskEndpointOutputSchemas['contact.createContact'],
		'contact.createContact',
		'POST',
		'/Contact',
	),
	getContactById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contact.getContactById'],
		SevdeskEndpointOutputSchemas['contact.getContactById'],
		'contact.getContactById',
		'GET',
		'/Contact/{contactId}',
	),
	updateContact: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contact.updateContact'],
		SevdeskEndpointOutputSchemas['contact.updateContact'],
		'contact.updateContact',
		'PUT',
		'/Contact/{contactId}',
	),
	deleteContact: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contact.deleteContact'],
		SevdeskEndpointOutputSchemas['contact.deleteContact'],
		'contact.deleteContact',
		'DELETE',
		'/Contact/{contactId}',
	),
	getContactTabsItemCountById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contact.getContactTabsItemCountById'],
		SevdeskEndpointOutputSchemas['contact.getContactTabsItemCountById'],
		'contact.getContactTabsItemCountById',
		'GET',
		'/Contact/{contactId}/getTabsItemCount',
	),
} as const;
