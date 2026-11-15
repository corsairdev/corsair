import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const ContactField = {
	getPlaceholder: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.getPlaceholder'],
		SevdeskEndpointOutputSchemas['contactField.getPlaceholder'],
		'contactField.getPlaceholder',
		'GET',
		'/Textparser/fetchDictionaryEntriesByType',
	),
	getContactFields: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.getContactFields'],
		SevdeskEndpointOutputSchemas['contactField.getContactFields'],
		'contactField.getContactFields',
		'GET',
		'/ContactCustomField',
	),
	createContactField: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.createContactField'],
		SevdeskEndpointOutputSchemas['contactField.createContactField'],
		'contactField.createContactField',
		'POST',
		'/ContactCustomField',
	),
	getContactFieldsById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.getContactFieldsById'],
		SevdeskEndpointOutputSchemas['contactField.getContactFieldsById'],
		'contactField.getContactFieldsById',
		'GET',
		'/ContactCustomField/{contactCustomFieldId}',
	),
	updateContactfield: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.updateContactfield'],
		SevdeskEndpointOutputSchemas['contactField.updateContactfield'],
		'contactField.updateContactfield',
		'PUT',
		'/ContactCustomField/{contactCustomFieldId}',
	),
	deleteContactCustomFieldId: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.deleteContactCustomFieldId'],
		SevdeskEndpointOutputSchemas['contactField.deleteContactCustomFieldId'],
		'contactField.deleteContactCustomFieldId',
		'DELETE',
		'/ContactCustomField/{contactCustomFieldId}',
	),
	getContactFieldSettings: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.getContactFieldSettings'],
		SevdeskEndpointOutputSchemas['contactField.getContactFieldSettings'],
		'contactField.getContactFieldSettings',
		'GET',
		'/ContactCustomFieldSetting',
	),
	createContactFieldSetting: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.createContactFieldSetting'],
		SevdeskEndpointOutputSchemas['contactField.createContactFieldSetting'],
		'contactField.createContactFieldSetting',
		'POST',
		'/ContactCustomFieldSetting',
	),
	getContactFieldSettingById: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.getContactFieldSettingById'],
		SevdeskEndpointOutputSchemas['contactField.getContactFieldSettingById'],
		'contactField.getContactFieldSettingById',
		'GET',
		'/ContactCustomFieldSetting/{contactCustomFieldSettingId}',
	),
	updateContactFieldSetting: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.updateContactFieldSetting'],
		SevdeskEndpointOutputSchemas['contactField.updateContactFieldSetting'],
		'contactField.updateContactFieldSetting',
		'PUT',
		'/ContactCustomFieldSetting/{contactCustomFieldSettingId}',
	),
	deleteContactFieldSetting: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.deleteContactFieldSetting'],
		SevdeskEndpointOutputSchemas['contactField.deleteContactFieldSetting'],
		'contactField.deleteContactFieldSetting',
		'DELETE',
		'/ContactCustomFieldSetting/{contactCustomFieldSettingId}',
	),
	getReferenceCount: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['contactField.getReferenceCount'],
		SevdeskEndpointOutputSchemas['contactField.getReferenceCount'],
		'contactField.getReferenceCount',
		'GET',
		'/ContactCustomFieldSetting/{contactCustomFieldSettingId}/getReferenceCount',
	),
} as const;
