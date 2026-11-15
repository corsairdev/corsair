import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const ContactAddress = {
	createContactAddress: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactAddress.createContactAddress'],
		SevdeskEndpointOutputSchemas['contactAddress.createContactAddress'],
		'contactAddress.createContactAddress',
		'POST',
		'/ContactAddress',
	),
	getContactAddresses: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactAddress.getContactAddresses'],
		SevdeskEndpointOutputSchemas['contactAddress.getContactAddresses'],
		'contactAddress.getContactAddresses',
		'GET',
		'/ContactAddress',
	),
	contactAddressId: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactAddress.contactAddressId'],
		SevdeskEndpointOutputSchemas['contactAddress.contactAddressId'],
		'contactAddress.contactAddressId',
		'GET',
		'/ContactAddress/{contactAddressId}',
	),
	updateContactAddress: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactAddress.updateContactAddress'],
		SevdeskEndpointOutputSchemas['contactAddress.updateContactAddress'],
		'contactAddress.updateContactAddress',
		'PUT',
		'/ContactAddress/{contactAddressId}',
	),
	deleteContactAddress: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactAddress.deleteContactAddress'],
		SevdeskEndpointOutputSchemas['contactAddress.deleteContactAddress'],
		'contactAddress.deleteContactAddress',
		'DELETE',
		'/ContactAddress/{contactAddressId}',
	),
} as const;
