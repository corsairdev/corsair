import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { sevdeskEndpointsNested } from './endpoints';
import { NON_REPLAYABLE_GETS } from './endpoints/operation';
import type { SevdeskEndpointInputs } from './endpoints/types';
import type { SevdeskContext } from './index';
import { sevdesk } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});
jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeSevdeskRequest: jest.fn() };
});
const mockedRequest = jest.mocked(client.makeSevdeskRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);
function buildCtx(): SevdeskContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: '0123456789abcdef0123456789abcdef',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('0123456789abcdef0123456789abcdef'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}
const ctx = buildCtx();
beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});
const cases = [
	{
		key: 'basics.bookkeepingSystemVersion',
		method: 'GET',
		route: '/Tools/bookkeepingSystemVersion',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.basics.bookkeepingSystemVersion,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.basics.bookkeepingSystemVersion,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccount.getCheckAccounts',
		method: 'GET',
		route: '/CheckAccount',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.getCheckAccounts,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.getCheckAccounts,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccount.createFileImportAccount',
		method: 'POST',
		route: '/CheckAccount/Factory/fileImportAccount',
		input: { body: {} },
		response: {},
		expectedOptions: { body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.createFileImportAccount,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.createFileImportAccount,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccount.createClearingAccount',
		method: 'POST',
		route: '/CheckAccount/Factory/clearingAccount',
		input: { body: {} },
		response: {},
		expectedOptions: { body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.createClearingAccount,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.createClearingAccount,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccount.getCheckAccountById',
		method: 'GET',
		route: '/CheckAccount/{checkAccountId}',
		input: { path: { checkAccountId: 1 } },
		response: {},
		expectedOptions: { path: { checkAccountId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.getCheckAccountById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.getCheckAccountById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccount.updateCheckAccount',
		method: 'PUT',
		route: '/CheckAccount/{checkAccountId}',
		input: { path: { checkAccountId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { checkAccountId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.updateCheckAccount,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.updateCheckAccount,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccount.deleteCheckAccount',
		method: 'DELETE',
		route: '/CheckAccount/{checkAccountId}',
		input: { path: { checkAccountId: 1 } },
		response: {},
		expectedOptions: { path: { checkAccountId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.deleteCheckAccount,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.deleteCheckAccount,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccount.getBalanceAtDate',
		method: 'GET',
		route: '/CheckAccount/{checkAccountId}/getBalanceAtDate',
		input: { path: { checkAccountId: 1 }, query: { date: '2026-01-01' } },
		response: {},
		expectedOptions: {
			path: { checkAccountId: 1 },
			query: { date: '2026-01-01' },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.getBalanceAtDate,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccount.getBalanceAtDate,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccountTransaction.getTransactions',
		method: 'GET',
		route: '/CheckAccountTransaction',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction.getTransactions,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction.getTransactions,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccountTransaction.createTransaction',
		method: 'POST',
		route: '/CheckAccountTransaction',
		input: {
			body: {
				valueDate: '2026-01-01T00:00:00Z',
				checkAccount: { id: 1, objectName: 'test' },
				amount: 100.1,
				status: 100,
				payeePayerName: 'Cercei Lannister',
			},
		},
		response: {},
		expectedOptions: {
			body: {
				valueDate: '2026-01-01T00:00:00Z',
				checkAccount: { id: 1, objectName: 'test' },
				amount: 100.1,
				status: 100,
				payeePayerName: 'Cercei Lannister',
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction.createTransaction,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction.createTransaction,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccountTransaction.getCheckAccountTransactionById',
		method: 'GET',
		route: '/CheckAccountTransaction/{checkAccountTransactionId}',
		input: { path: { checkAccountTransactionId: 1 } },
		response: {},
		expectedOptions: { path: { checkAccountTransactionId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction
					.getCheckAccountTransactionById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction
					.getCheckAccountTransactionById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccountTransaction.updateCheckAccountTransaction',
		method: 'PUT',
		route: '/CheckAccountTransaction/{checkAccountTransactionId}',
		input: { path: { checkAccountTransactionId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { checkAccountTransactionId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction
					.updateCheckAccountTransaction,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction
					.updateCheckAccountTransaction,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccountTransaction.deleteCheckAccountTransaction',
		method: 'DELETE',
		route: '/CheckAccountTransaction/{checkAccountTransactionId}',
		input: { path: { checkAccountTransactionId: 1 } },
		response: {},
		expectedOptions: { path: { checkAccountTransactionId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction
					.deleteCheckAccountTransaction,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction
					.deleteCheckAccountTransaction,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'checkAccountTransaction.checkAccountTransactionEnshrine',
		method: 'PUT',
		route: '/CheckAccountTransaction/{checkAccountTransactionId}/enshrine',
		input: { path: { checkAccountTransactionId: 1 } },
		response: {},
		expectedOptions: { path: { checkAccountTransactionId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction
					.checkAccountTransactionEnshrine,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.checkAccountTransaction
					.checkAccountTransactionEnshrine,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'privateTransactionRule.listPrivateTransactionRules',
		method: 'GET',
		route: '/PrivateTransactionRule',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.privateTransactionRule
					.listPrivateTransactionRules,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.privateTransactionRule
					.listPrivateTransactionRules,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'privateTransactionRule.createPrivateTransactionRule',
		method: 'POST',
		route: '/PrivateTransactionRule',
		input: { body: { objectName: 'test' } },
		response: {},
		expectedOptions: { body: { objectName: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.privateTransactionRule
					.createPrivateTransactionRule,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.privateTransactionRule
					.createPrivateTransactionRule,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'privateTransactionRule.deletePrivateTransactionRule',
		method: 'DELETE',
		route: '/PrivateTransactionRule/{id}',
		input: { path: { id: 1 } },
		response: {},
		expectedOptions: { path: { id: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.privateTransactionRule
					.deletePrivateTransactionRule,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.privateTransactionRule
					.deletePrivateTransactionRule,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contact.getNextCustomerNumber',
		method: 'GET',
		route: '/Contact/Factory/getNextCustomerNumber',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contact.getNextCustomerNumber,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contact.getNextCustomerNumber,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contact.findContactsByCustomFieldValue',
		method: 'GET',
		route: '/Contact/Factory/findContactsByCustomFieldValue',
		input: { query: { value: 'test', customFieldName: 'test' } },
		response: {},
		expectedOptions: { query: { value: 'test', customFieldName: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contact.findContactsByCustomFieldValue,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contact.findContactsByCustomFieldValue,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contact.contactCustomerNumberAvailabilityCheck',
		method: 'GET',
		route: '/Contact/Mapper/checkCustomerNumberAvailability',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contact.contactCustomerNumberAvailabilityCheck,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contact.contactCustomerNumberAvailabilityCheck,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contact.getContacts',
		method: 'GET',
		route: '/Contact',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.contact.getContacts, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.contact.getContacts, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'contact.createContact',
		method: 'POST',
		route: '/Contact',
		input: { body: { category: { id: 3, objectName: 'Category' } } },
		response: {},
		expectedOptions: { body: { category: { id: 3, objectName: 'Category' } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.contact.createContact, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.contact.createContact, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'contact.getContactById',
		method: 'GET',
		route: '/Contact/{contactId}',
		input: { path: { contactId: 1 } },
		response: {},
		expectedOptions: { path: { contactId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.contact.getContactById, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.contact.getContactById, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'contact.updateContact',
		method: 'PUT',
		route: '/Contact/{contactId}',
		input: { path: { contactId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { contactId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.contact.updateContact, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.contact.updateContact, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'contact.deleteContact',
		method: 'DELETE',
		route: '/Contact/{contactId}',
		input: { path: { contactId: 1 } },
		response: {},
		expectedOptions: { path: { contactId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.contact.deleteContact, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.contact.deleteContact, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'contact.getContactTabsItemCountById',
		method: 'GET',
		route: '/Contact/{contactId}/getTabsItemCount',
		input: { path: { contactId: 1 } },
		response: {},
		expectedOptions: { path: { contactId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contact.getContactTabsItemCountById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contact.getContactTabsItemCountById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactAddress.createContactAddress',
		method: 'POST',
		route: '/ContactAddress',
		input: {
			body: {
				contact: { id: 1, objectName: 'Contact' },
				country: { id: 1, objectName: 'StaticCountry' },
				category: { id: 1, objectName: 'test' },
			},
		},
		response: {
			contact: { id: 1, objectName: 'Contact' },
			country: { id: 1, objectName: 'StaticCountry' },
		},
		expectedOptions: {
			body: {
				contact: { id: 1, objectName: 'Contact' },
				country: { id: 1, objectName: 'StaticCountry' },
				category: { id: 1, objectName: 'test' },
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactAddress.createContactAddress,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactAddress.createContactAddress,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactAddress.getContactAddresses',
		method: 'GET',
		route: '/ContactAddress',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactAddress.getContactAddresses,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactAddress.getContactAddresses,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactAddress.contactAddressId',
		method: 'GET',
		route: '/ContactAddress/{contactAddressId}',
		input: { path: { contactAddressId: 1 } },
		response: {},
		expectedOptions: { path: { contactAddressId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactAddress.contactAddressId,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactAddress.contactAddressId,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactAddress.updateContactAddress',
		method: 'PUT',
		route: '/ContactAddress/{contactAddressId}',
		input: { path: { contactAddressId: 1 }, body: {} },
		response: {
			contact: { id: 1, objectName: 'Contact' },
			country: { id: 1, objectName: 'StaticCountry' },
		},
		expectedOptions: { path: { contactAddressId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactAddress.updateContactAddress,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactAddress.updateContactAddress,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactAddress.deleteContactAddress',
		method: 'DELETE',
		route: '/ContactAddress/{contactAddressId}',
		input: { path: { contactAddressId: 1 } },
		response: {},
		expectedOptions: { path: { contactAddressId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactAddress.deleteContactAddress,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactAddress.deleteContactAddress,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'communicationWay.getCommunicationWays',
		method: 'GET',
		route: '/CommunicationWay',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.getCommunicationWays,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.getCommunicationWays,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'communicationWay.createCommunicationWay',
		method: 'POST',
		route: '/CommunicationWay',
		input: {
			body: {
				type: 'EMAIL',
				value: 'test',
				key: { id: 1, objectName: 'CommunicationWayKey' },
			},
		},
		response: {},
		expectedOptions: {
			body: {
				type: 'EMAIL',
				value: 'test',
				key: { id: 1, objectName: 'CommunicationWayKey' },
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.createCommunicationWay,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.createCommunicationWay,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'communicationWay.getCommunicationWayById',
		method: 'GET',
		route: '/CommunicationWay/{communicationWayId}',
		input: { path: { communicationWayId: 1 } },
		response: {},
		expectedOptions: { path: { communicationWayId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.getCommunicationWayById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.getCommunicationWayById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'communicationWay.deleteCommunicationWay',
		method: 'DELETE',
		route: '/CommunicationWay/{communicationWayId}',
		input: { path: { communicationWayId: 1 } },
		response: {},
		expectedOptions: { path: { communicationWayId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.deleteCommunicationWay,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.deleteCommunicationWay,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'communicationWay.updateCommunicationWay',
		method: 'PUT',
		route: '/CommunicationWay/{communicationWayId}',
		input: { path: { communicationWayId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { communicationWayId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.updateCommunicationWay,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.updateCommunicationWay,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'communicationWay.getCommunicationWayKeys',
		method: 'GET',
		route: '/CommunicationWayKey',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.getCommunicationWayKeys,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.communicationWay.getCommunicationWayKeys,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'accountingContact.getAccountingContact',
		method: 'GET',
		route: '/AccountingContact',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.accountingContact.getAccountingContact,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.accountingContact.getAccountingContact,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'accountingContact.createAccountingContact',
		method: 'POST',
		route: '/AccountingContact',
		input: { body: { contact: { id: 1, objectName: 'Contact' } } },
		response: {},
		expectedOptions: { body: { contact: { id: 1, objectName: 'Contact' } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.accountingContact.createAccountingContact,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.accountingContact.createAccountingContact,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'accountingContact.getAccountingContactById',
		method: 'GET',
		route: '/AccountingContact/{accountingContactId}',
		input: { path: { accountingContactId: 1 } },
		response: {},
		expectedOptions: { path: { accountingContactId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.accountingContact.getAccountingContactById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.accountingContact.getAccountingContactById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'accountingContact.updateAccountingContact',
		method: 'PUT',
		route: '/AccountingContact/{accountingContactId}',
		input: { path: { accountingContactId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { accountingContactId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.accountingContact.updateAccountingContact,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.accountingContact.updateAccountingContact,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'accountingContact.deleteAccountingContact',
		method: 'DELETE',
		route: '/AccountingContact/{accountingContactId}',
		input: { path: { accountingContactId: 1 } },
		response: {},
		expectedOptions: { path: { accountingContactId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.accountingContact.deleteAccountingContact,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.accountingContact.deleteAccountingContact,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.getPlaceholder',
		method: 'GET',
		route: '/Textparser/fetchDictionaryEntriesByType',
		input: { query: { objectName: 'Invoice' } },
		response: {},
		expectedOptions: { query: { objectName: 'Invoice' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getPlaceholder,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getPlaceholder,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.getContactFields',
		method: 'GET',
		route: '/ContactCustomField',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getContactFields,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getContactFields,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.createContactField',
		method: 'POST',
		route: '/ContactCustomField',
		input: {
			body: {
				contact: { id: 1, objectName: 'Contact' },
				contactCustomFieldSetting: {
					id: 1,
					objectName: 'ContactCustomFieldSetting',
				},
				value: 'test',
				objectName: 'ContactCustomField',
			},
		},
		response: {},
		expectedOptions: {
			body: {
				contact: { id: 1, objectName: 'Contact' },
				contactCustomFieldSetting: {
					id: 1,
					objectName: 'ContactCustomFieldSetting',
				},
				value: 'test',
				objectName: 'ContactCustomField',
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.createContactField,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.createContactField,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.getContactFieldsById',
		method: 'GET',
		route: '/ContactCustomField/{contactCustomFieldId}',
		input: { path: { contactCustomFieldId: 1 } },
		response: {},
		expectedOptions: { path: { contactCustomFieldId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getContactFieldsById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getContactFieldsById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.updateContactfield',
		method: 'PUT',
		route: '/ContactCustomField/{contactCustomFieldId}',
		input: { path: { contactCustomFieldId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { contactCustomFieldId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.updateContactfield,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.updateContactfield,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.deleteContactCustomFieldId',
		method: 'DELETE',
		route: '/ContactCustomField/{contactCustomFieldId}',
		input: { path: { contactCustomFieldId: 1 } },
		response: {},
		expectedOptions: { path: { contactCustomFieldId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.deleteContactCustomFieldId,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.deleteContactCustomFieldId,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.getContactFieldSettings',
		method: 'GET',
		route: '/ContactCustomFieldSetting',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getContactFieldSettings,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getContactFieldSettings,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.createContactFieldSetting',
		method: 'POST',
		route: '/ContactCustomFieldSetting',
		input: { body: { name: 'test' } },
		response: {},
		expectedOptions: { body: { name: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.createContactFieldSetting,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.createContactFieldSetting,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.getContactFieldSettingById',
		method: 'GET',
		route: '/ContactCustomFieldSetting/{contactCustomFieldSettingId}',
		input: { path: { contactCustomFieldSettingId: 1 } },
		response: {},
		expectedOptions: { path: { contactCustomFieldSettingId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getContactFieldSettingById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getContactFieldSettingById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.updateContactFieldSetting',
		method: 'PUT',
		route: '/ContactCustomFieldSetting/{contactCustomFieldSettingId}',
		input: { path: { contactCustomFieldSettingId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { contactCustomFieldSettingId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.updateContactFieldSetting,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.updateContactFieldSetting,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.deleteContactFieldSetting',
		method: 'DELETE',
		route: '/ContactCustomFieldSetting/{contactCustomFieldSettingId}',
		input: { path: { contactCustomFieldSettingId: 1 } },
		response: {},
		expectedOptions: { path: { contactCustomFieldSettingId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.deleteContactFieldSetting,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.deleteContactFieldSetting,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'contactField.getReferenceCount',
		method: 'GET',
		route:
			'/ContactCustomFieldSetting/{contactCustomFieldSettingId}/getReferenceCount',
		input: { path: { contactCustomFieldSettingId: 1 } },
		response: {},
		expectedOptions: { path: { contactCustomFieldSettingId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getReferenceCount,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.contactField.getReferenceCount,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.getCreditNotes',
		method: 'GET',
		route: '/CreditNote',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.getCreditNotes,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.getCreditNotes,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.createcreditNote',
		method: 'POST',
		route: '/CreditNote/Factory/saveCreditNote',
		input: {
			body: {
				creditNote: {
					creditNoteNumber: 'GU-1000',
					creditNoteDate: '2026-01-01T00:00:00Z',
					contact: { id: 1, objectName: 'Contact' },
					status: '100',
					addressCountry: { id: 1, objectName: 'StaticCountry' },
					contactPerson: { id: 1, objectName: 'SevUser' },
					taxRate: 0,
					taxRule: { id: '1', objectName: 'TaxRule' },
					taxText: 'Umsatzsteuer 19%',
					taxType: 'default',
					bookingCategory: 'PROVISION',
					currency: 'EUR',
					header: 'My GU-1000',
					mapAll: true,
					objectName: 'CreditNote',
				},
			},
		},
		response: {},
		expectedOptions: {
			body: {
				creditNote: {
					creditNoteNumber: 'GU-1000',
					creditNoteDate: '2026-01-01T00:00:00Z',
					contact: { id: 1, objectName: 'Contact' },
					status: '100',
					addressCountry: { id: 1, objectName: 'StaticCountry' },
					contactPerson: { id: 1, objectName: 'SevUser' },
					taxRate: 0,
					taxRule: { id: '1', objectName: 'TaxRule' },
					taxText: 'Umsatzsteuer 19%',
					taxType: 'default',
					bookingCategory: 'PROVISION',
					currency: 'EUR',
					header: 'My GU-1000',
					mapAll: true,
					objectName: 'CreditNote',
				},
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.createcreditNote,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.createcreditNote,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.createCreditNoteFromInvoice',
		method: 'POST',
		route: '/CreditNote/Factory/createFromInvoice',
		input: { body: { invoice: { id: 1234, objectName: 'Invoice' } } },
		response: {},
		expectedOptions: { body: { invoice: { id: 1234, objectName: 'Invoice' } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.createCreditNoteFromInvoice,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.createCreditNoteFromInvoice,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.createCreditNoteFromVoucher',
		method: 'POST',
		route: '/CreditNote/Factory/createFromVoucher',
		input: { body: { voucher: { id: 1234, objectName: 'Voucher' } } },
		response: {},
		expectedOptions: { body: { voucher: { id: 1234, objectName: 'Voucher' } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.createCreditNoteFromVoucher,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.createCreditNoteFromVoucher,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.getcreditNoteById',
		method: 'GET',
		route: '/CreditNote/{creditNoteId}',
		input: { path: { creditNoteId: 1 } },
		response: {},
		expectedOptions: { path: { creditNoteId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.getcreditNoteById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.getcreditNoteById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.updatecreditNote',
		method: 'PUT',
		route: '/CreditNote/{creditNoteId}',
		input: { path: { creditNoteId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { creditNoteId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.updatecreditNote,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.updatecreditNote,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.deletecreditNote',
		method: 'DELETE',
		route: '/CreditNote/{creditNoteId}',
		input: { path: { creditNoteId: 1 } },
		response: {},
		expectedOptions: { path: { creditNoteId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.deletecreditNote,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.deletecreditNote,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.sendCreditNoteByPrinting',
		method: 'GET',
		route: '/CreditNote/{creditNoteId}/sendByWithRender',
		input: { path: { creditNoteId: 1 }, query: { sendType: 'test' } },
		response: {},
		expectedOptions: { path: { creditNoteId: 1 }, query: { sendType: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.sendCreditNoteByPrinting,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.sendCreditNoteByPrinting,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.creditNoteSendBy',
		method: 'PUT',
		route: '/CreditNote/{creditNoteId}/sendBy',
		input: {
			path: { creditNoteId: 1 },
			body: { sendType: 'VPR', sendDraft: false },
		},
		response: {},
		expectedOptions: {
			path: { creditNoteId: 1 },
			body: { sendType: 'VPR', sendDraft: false },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.creditNoteSendBy,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.creditNoteSendBy,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.creditNoteEnshrine',
		method: 'PUT',
		route: '/CreditNote/{creditNoteId}/enshrine',
		input: { path: { creditNoteId: 1 } },
		response: {},
		expectedOptions: { path: { creditNoteId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.creditNoteEnshrine,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.creditNoteEnshrine,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.creditNoteGetPdf',
		method: 'GET',
		route: '/CreditNote/{creditNoteId}/getPdf',
		input: { path: { creditNoteId: 1 } },
		response: {},
		expectedOptions: { path: { creditNoteId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.creditNoteGetPdf,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.creditNoteGetPdf,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.sendCreditNoteViaEMail',
		method: 'POST',
		route: '/CreditNote/{creditNoteId}/sendViaEmail',
		input: {
			path: { creditNoteId: 1 },
			body: { toEmail: 'test', subject: 'test', text: 'test' },
		},
		response: {},
		expectedOptions: {
			path: { creditNoteId: 1 },
			body: { toEmail: 'test', subject: 'test', text: 'test' },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.sendCreditNoteViaEMail,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.sendCreditNoteViaEMail,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.bookCreditNote',
		method: 'PUT',
		route: '/CreditNote/{creditNoteId}/bookAmount',
		input: {
			path: { creditNoteId: 1 },
			body: {
				amount: 1,
				date: 1,
				type: 'FULL_PAYMENT',
				checkAccount: { id: 1, objectName: 'CheckAccount' },
			},
		},
		response: {},
		expectedOptions: {
			path: { creditNoteId: 1 },
			body: {
				amount: 1,
				date: 1,
				type: 'FULL_PAYMENT',
				checkAccount: { id: 1, objectName: 'CheckAccount' },
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.bookCreditNote,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.bookCreditNote,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.creditNoteResetToOpen',
		method: 'PUT',
		route: '/CreditNote/{creditNoteId}/resetToOpen',
		input: { path: { creditNoteId: 1 } },
		response: {},
		expectedOptions: { path: { creditNoteId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.creditNoteResetToOpen,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.creditNoteResetToOpen,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNote.creditNoteResetToDraft',
		method: 'PUT',
		route: '/CreditNote/{creditNoteId}/resetToDraft',
		input: { path: { creditNoteId: 1 } },
		response: {},
		expectedOptions: { path: { creditNoteId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.creditNoteResetToDraft,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNote.creditNoteResetToDraft,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'creditNotePos.getcreditNotePositions',
		method: 'GET',
		route: '/CreditNotePos',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNotePos.getcreditNotePositions,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.creditNotePos.getcreditNotePositions,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'export.updateExportConfig',
		method: 'PUT',
		route: '/SevClient/{SevClientId}/updateExportConfig',
		input: {
			path: { SevClientId: 1 },
			body: {
				accountantNumber: 1324124,
				accountantClientNumber: 1234152,
				accountingYearBegin: 1681907569,
			},
		},
		response: {},
		expectedOptions: {
			path: { SevClientId: 1 },
			body: {
				accountantNumber: 1324124,
				accountantClientNumber: 1234152,
				accountingYearBegin: 1681907569,
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.export.updateExportConfig,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.export.updateExportConfig,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'export.exportDatevDepricated',
		method: 'GET',
		route: '/Export/datevCSV',
		input: { query: { startDate: 1, endDate: 1, scope: 'test' } },
		response: {},
		expectedOptions: { query: { startDate: 1, endDate: 1, scope: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.export.exportDatevDepricated,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.export.exportDatevDepricated,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'export.exportDatevCSV',
		method: 'GET',
		route: '/Export/createDatevCsvZipExportJob',
		input: { query: { startDate: 1, endDate: 1, scope: 'test' } },
		response: {},
		expectedOptions: { query: { startDate: 1, endDate: 1, scope: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportDatevCSV, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportDatevCSV, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'export.exportDatevXML',
		method: 'GET',
		route: '/Export/createDatevXmlZipExportJob',
		input: { query: { startDate: 1, endDate: 1, scope: 'test' } },
		response: {},
		expectedOptions: { query: { startDate: 1, endDate: 1, scope: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportDatevXML, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportDatevXML, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'export.generateDownloadHash',
		method: 'GET',
		route: '/Progress/generateDownloadHash',
		input: { query: { jobId: 'test' } },
		response: {},
		expectedOptions: { query: { jobId: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.export.generateDownloadHash,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.export.generateDownloadHash,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'export.getProgress',
		method: 'GET',
		route: '/Progress/getProgress',
		input: { query: { hash: 'test' } },
		response: {},
		expectedOptions: { query: { hash: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.export.getProgress, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.export.getProgress, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'export.jobDownloadInfo',
		method: 'GET',
		route: '/ExportJob/jobDownloadInfo',
		input: { query: { jobId: 'test' } },
		response: {},
		expectedOptions: { query: { jobId: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.export.jobDownloadInfo, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.export.jobDownloadInfo, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'export.exportInvoice',
		method: 'GET',
		route: '/Export/invoiceCsv',
		input: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		response: {},
		expectedOptions: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportInvoice, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportInvoice, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'export.exportInvoiceZip',
		method: 'GET',
		route: '/Export/invoiceZip',
		input: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		response: {},
		expectedOptions: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportInvoiceZip, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportInvoiceZip, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'export.exportCreditNote',
		method: 'GET',
		route: '/Export/creditNoteCsv',
		input: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		response: {},
		expectedOptions: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportCreditNote, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportCreditNote, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'export.exportVoucher',
		method: 'GET',
		route: '/Export/voucherListCsv',
		input: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		response: {},
		expectedOptions: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportVoucher, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportVoucher, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'export.exportTransactions',
		method: 'GET',
		route: '/Export/transactionsCsv',
		input: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		response: {},
		expectedOptions: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.export.exportTransactions,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.export.exportTransactions,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'export.exportVoucherZip',
		method: 'GET',
		route: '/Export/voucherZip',
		input: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		response: {},
		expectedOptions: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportVoucherZip, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportVoucherZip, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'export.exportContact',
		method: 'GET',
		route: '/Export/contactListCsv',
		input: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		response: {},
		expectedOptions: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportContact, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.export.exportContact, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'part.getParts',
		method: 'GET',
		route: '/Part',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.part.getParts, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.part.getParts, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'part.createPart',
		method: 'POST',
		route: '/Part',
		input: {
			body: {
				taxRate: 19,
				unity: { id: 1, objectName: 'Unity' },
				stock: 10000,
				name: 'Dragonglass',
				partNumber: 'Part-1000',
			},
		},
		response: {
			taxRate: 19,
			unity: { id: 1, objectName: 'Unity' },
			stock: 10000,
			name: 'Dragonglass',
			partNumber: 'Part-1000',
		},
		expectedOptions: {
			body: {
				taxRate: 19,
				unity: { id: 1, objectName: 'Unity' },
				stock: 10000,
				name: 'Dragonglass',
				partNumber: 'Part-1000',
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.part.createPart, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.part.createPart, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'part.getPartById',
		method: 'GET',
		route: '/Part/{partId}',
		input: { path: { partId: 1 } },
		response: {},
		expectedOptions: { path: { partId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.part.getPartById, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.part.getPartById, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'part.updatePart',
		method: 'PUT',
		route: '/Part/{partId}',
		input: { path: { partId: 1 }, body: {} },
		response: {
			taxRate: 19,
			unity: { id: 1, objectName: 'Unity' },
			stock: 10000,
			name: 'Dragonglass',
			partNumber: 'Part-1000',
		},
		expectedOptions: { path: { partId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.part.updatePart, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.part.updatePart, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'part.partGetStock',
		method: 'GET',
		route: '/Part/{partId}/getStock',
		input: { path: { partId: 1 } },
		response: {},
		expectedOptions: { path: { partId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.part.partGetStock, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.part.partGetStock, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'invoice.getInvoices',
		method: 'GET',
		route: '/Invoice',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.getInvoices, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.getInvoices, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'invoice.createInvoiceByFactory',
		method: 'POST',
		route: '/Invoice/Factory/saveInvoice',
		input: {
			body: {
				invoice: {
					invoiceDate: '01.01.2022',
					contact: { id: 1, objectName: 'Contact' },
					discount: 0,
					status: '50',
					addressCountry: { id: 1, objectName: 'StaticCountry' },
					contactPerson: { id: 1, objectName: 'SevUser' },
					taxRate: 0,
					taxRule: { id: '1', objectName: 'TaxRule' },
					taxText: 'Umsatzsteuer 19%',
					taxType: 'default',
					invoiceType: 'RE',
					currency: 'EUR',
					mapAll: true,
				},
			},
		},
		response: {},
		expectedOptions: {
			body: {
				invoice: {
					invoiceDate: '01.01.2022',
					contact: { id: 1, objectName: 'Contact' },
					discount: 0,
					status: '50',
					addressCountry: { id: 1, objectName: 'StaticCountry' },
					contactPerson: { id: 1, objectName: 'SevUser' },
					taxRate: 0,
					taxRule: { id: '1', objectName: 'TaxRule' },
					taxText: 'Umsatzsteuer 19%',
					taxType: 'default',
					invoiceType: 'RE',
					currency: 'EUR',
					mapAll: true,
				},
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.createInvoiceByFactory,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.createInvoiceByFactory,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'invoice.getInvoiceById',
		method: 'GET',
		route: '/Invoice/{invoiceId}',
		input: { path: { invoiceId: 1 } },
		response: {},
		expectedOptions: { path: { invoiceId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.getInvoiceById, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.getInvoiceById, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'invoice.getInvoicePositionsById',
		method: 'GET',
		route: '/Invoice/{invoiceId}/getPositions',
		input: { path: { invoiceId: 1 } },
		response: {},
		expectedOptions: { path: { invoiceId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.getInvoicePositionsById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.getInvoicePositionsById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'invoice.createInvoiceFromOrder',
		method: 'POST',
		route: '/Invoice/Factory/createInvoiceFromOrder',
		input: { body: { order: { id: 1, objectName: 'Order' } } },
		response: {},
		expectedOptions: { body: { order: { id: 1, objectName: 'Order' } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.createInvoiceFromOrder,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.createInvoiceFromOrder,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'invoice.createInvoiceReminder',
		method: 'POST',
		route: '/Invoice/Factory/createInvoiceReminder',
		input: {
			query: { 'invoice[id]': 1, 'invoice[objectName]': 'test' },
			body: { invoice: { id: 1, objectName: 'Invoice' } },
		},
		response: {},
		expectedOptions: {
			query: { 'invoice[id]': 1, 'invoice[objectName]': 'test' },
			body: { invoice: { id: 1, objectName: 'Invoice' } },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.createInvoiceReminder,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.createInvoiceReminder,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'invoice.getIsInvoicePartiallyPaid',
		method: 'GET',
		route: '/Invoice/{invoiceId}/getIsPartiallyPaid',
		input: { path: { invoiceId: 1 } },
		response: {},
		expectedOptions: { path: { invoiceId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.getIsInvoicePartiallyPaid,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.getIsInvoicePartiallyPaid,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'invoice.cancelInvoice',
		method: 'POST',
		route: '/Invoice/{invoiceId}/cancelInvoice',
		input: { path: { invoiceId: 1 } },
		response: {},
		expectedOptions: { path: { invoiceId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.cancelInvoice, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.cancelInvoice, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'invoice.invoiceRender',
		method: 'POST',
		route: '/Invoice/{invoiceId}/render',
		input: { path: { invoiceId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { invoiceId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.invoiceRender, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.invoiceRender, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'invoice.sendInvoiceViaEMail',
		method: 'POST',
		route: '/Invoice/{invoiceId}/sendViaEmail',
		input: {
			path: { invoiceId: 1 },
			body: { toEmail: 'test', subject: 'test', text: 'test' },
		},
		response: { from: 'test', to: 'test', subject: 'test' },
		expectedOptions: {
			path: { invoiceId: 1 },
			body: { toEmail: 'test', subject: 'test', text: 'test' },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.sendInvoiceViaEMail,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.sendInvoiceViaEMail,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'invoice.invoiceGetPdf',
		method: 'GET',
		route: '/Invoice/{invoiceId}/getPdf',
		input: { path: { invoiceId: 1 } },
		response: {},
		expectedOptions: { path: { invoiceId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.invoiceGetPdf, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.invoiceGetPdf, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'invoice.invoiceSendBy',
		method: 'PUT',
		route: '/Invoice/{invoiceId}/sendBy',
		input: {
			path: { invoiceId: 1 },
			body: { sendType: 'VPR', sendDraft: true },
		},
		response: {},
		expectedOptions: {
			path: { invoiceId: 1 },
			body: { sendType: 'VPR', sendDraft: true },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.invoiceSendBy, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.invoiceSendBy, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'invoice.invoiceEnshrine',
		method: 'PUT',
		route: '/Invoice/{invoiceId}/enshrine',
		input: { path: { invoiceId: 1 } },
		response: {},
		expectedOptions: { path: { invoiceId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.invoiceEnshrine, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.invoiceEnshrine, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'invoice.bookInvoice',
		method: 'PUT',
		route: '/Invoice/{invoiceId}/bookAmount',
		input: {
			path: { invoiceId: 1 },
			body: {
				amount: 1,
				date: 1,
				type: 'FULL_PAYMENT',
				checkAccount: { id: 1, objectName: 'CheckAccount' },
			},
		},
		response: {},
		expectedOptions: {
			path: { invoiceId: 1 },
			body: {
				amount: 1,
				date: 1,
				type: 'FULL_PAYMENT',
				checkAccount: { id: 1, objectName: 'CheckAccount' },
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.bookInvoice, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.invoice.bookInvoice, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'invoice.invoiceResetToOpen',
		method: 'PUT',
		route: '/Invoice/{invoiceId}/resetToOpen',
		input: { path: { invoiceId: 1 } },
		response: {},
		expectedOptions: { path: { invoiceId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.invoiceResetToOpen,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.invoiceResetToOpen,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'invoice.invoiceResetToDraft',
		method: 'PUT',
		route: '/Invoice/{invoiceId}/resetToDraft',
		input: { path: { invoiceId: 1 } },
		response: {},
		expectedOptions: { path: { invoiceId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.invoiceResetToDraft,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoice.invoiceResetToDraft,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'invoicePos.getInvoicePos',
		method: 'GET',
		route: '/InvoicePos',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoicePos.getInvoicePos,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.invoicePos.getInvoicePos,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'layout.getLetterpapersWithThumb',
		method: 'GET',
		route: '/DocServer/getLetterpapersWithThumb',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.layout.getLetterpapersWithThumb,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.layout.getLetterpapersWithThumb,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'layout.getTemplates',
		method: 'GET',
		route: '/DocServer/getTemplatesWithThumb',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.layout.getTemplates, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.layout.getTemplates, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'layout.updateInvoiceTemplate',
		method: 'PUT',
		route: '/Invoice/{invoiceId}/changeParameter',
		input: {
			path: { invoiceId: 1 },
			body: { key: 'language', value: '573ef2706bd2d50366786471' },
		},
		response: {},
		expectedOptions: {
			path: { invoiceId: 1 },
			body: { key: 'language', value: '573ef2706bd2d50366786471' },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.layout.updateInvoiceTemplate,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.layout.updateInvoiceTemplate,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'layout.updateOrderTemplate',
		method: 'PUT',
		route: '/Order/{orderId}/changeParameter',
		input: {
			path: { orderId: 1 },
			body: { key: 'language', value: '573ef2706bd2d50366786471' },
		},
		response: {},
		expectedOptions: {
			path: { orderId: 1 },
			body: { key: 'language', value: '573ef2706bd2d50366786471' },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.layout.updateOrderTemplate,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.layout.updateOrderTemplate,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'layout.updateCreditNoteTemplate',
		method: 'PUT',
		route: '/CreditNote/{creditNoteId}/changeParameter',
		input: {
			path: { creditNoteId: 1 },
			body: { key: 'language', value: '573ef2706bd2d50366786471' },
		},
		response: {},
		expectedOptions: {
			path: { creditNoteId: 1 },
			body: { key: 'language', value: '573ef2706bd2d50366786471' },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.layout.updateCreditNoteTemplate,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.layout.updateCreditNoteTemplate,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'order.getOrders',
		method: 'GET',
		route: '/Order',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.order.getOrders, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.order.getOrders, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'order.createOrder',
		method: 'POST',
		route: '/Order/Factory/saveOrder',
		input: {
			body: {
				order: {
					orderNumber: 'Offer-1000',
					orderDate: '2026-01-01T00:00:00Z',
					contact: { id: 1, objectName: 'Contact' },
					status: 100,
					addressCountry: { id: 1, objectName: 'StaticCountry' },
					contactPerson: { id: 0, objectName: 'SevUser' },
					taxRate: 0,
					taxRule: { id: '1', objectName: 'TaxRule' },
					taxText: 'Umsatzsteuer 19%',
					taxType: 'default',
					currency: 'EUR',
					header: 'My Offer-1000',
					version: 0,
					mapAll: true,
				},
			},
		},
		response: {},
		expectedOptions: {
			body: {
				order: {
					orderNumber: 'Offer-1000',
					orderDate: '2026-01-01T00:00:00Z',
					contact: { id: 1, objectName: 'Contact' },
					status: 100,
					addressCountry: { id: 1, objectName: 'StaticCountry' },
					contactPerson: { id: 0, objectName: 'SevUser' },
					taxRate: 0,
					taxRule: { id: '1', objectName: 'TaxRule' },
					taxText: 'Umsatzsteuer 19%',
					taxType: 'default',
					currency: 'EUR',
					header: 'My Offer-1000',
					version: 0,
					mapAll: true,
				},
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.order.createOrder, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.order.createOrder, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'order.getOrderById',
		method: 'GET',
		route: '/Order/{orderId}',
		input: { path: { orderId: 1 } },
		response: {},
		expectedOptions: { path: { orderId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.order.getOrderById, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.order.getOrderById, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'order.updateOrder',
		method: 'PUT',
		route: '/Order/{orderId}',
		input: { path: { orderId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { orderId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.order.updateOrder, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.order.updateOrder, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'order.deleteOrder',
		method: 'DELETE',
		route: '/Order/{orderId}',
		input: { path: { orderId: 1 } },
		response: {},
		expectedOptions: { path: { orderId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.order.deleteOrder, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.order.deleteOrder, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'order.getOrderPositionsById',
		method: 'GET',
		route: '/Order/{orderId}/getPositions',
		input: { path: { orderId: 1 } },
		response: {},
		expectedOptions: { path: { orderId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.order.getOrderPositionsById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.order.getOrderPositionsById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'order.getDiscounts',
		method: 'GET',
		route: '/Order/{orderId}/getDiscounts',
		input: { path: { orderId: 1 } },
		response: {},
		expectedOptions: { path: { orderId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.order.getDiscounts, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.order.getDiscounts, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'order.getRelatedObjects',
		method: 'GET',
		route: '/Order/{orderId}/getRelatedObjects',
		input: { path: { orderId: 1 } },
		response: {},
		expectedOptions: { path: { orderId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.order.getRelatedObjects, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.order.getRelatedObjects, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'order.sendorderViaEMail',
		method: 'POST',
		route: '/Order/{orderId}/sendViaEmail',
		input: {
			path: { orderId: 1 },
			body: { toEmail: 'test', subject: 'test', text: 'test' },
		},
		response: {},
		expectedOptions: {
			path: { orderId: 1 },
			body: { toEmail: 'test', subject: 'test', text: 'test' },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.order.sendorderViaEMail, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.order.sendorderViaEMail, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'order.createPackingListFromOrder',
		method: 'POST',
		route: '/Order/Factory/createPackingListFromOrder',
		input: {
			query: { 'order[id]': 1, 'order[objectName]': 'test' },
			body: { id: 1, objectName: 'Order' },
		},
		response: {},
		expectedOptions: {
			query: { 'order[id]': 1, 'order[objectName]': 'test' },
			body: { id: 1, objectName: 'Order' },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.order.createPackingListFromOrder,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.order.createPackingListFromOrder,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'order.createContractNoteFromOrder',
		method: 'POST',
		route: '/Order/Factory/createContractNoteFromOrder',
		input: {
			query: { 'order[id]': 1, 'order[objectName]': 'test' },
			body: { id: 1, objectName: 'Order' },
		},
		response: {},
		expectedOptions: {
			query: { 'order[id]': 1, 'order[objectName]': 'test' },
			body: { id: 1, objectName: 'Order' },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.order.createContractNoteFromOrder,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.order.createContractNoteFromOrder,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'order.orderGetPdf',
		method: 'GET',
		route: '/Order/{orderId}/getPdf',
		input: { path: { orderId: 1 } },
		response: {},
		expectedOptions: { path: { orderId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.order.orderGetPdf, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.order.orderGetPdf, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'order.orderSendBy',
		method: 'PUT',
		route: '/Order/{orderId}/sendBy',
		input: { path: { orderId: 1 }, body: { sendType: 'VPR', sendDraft: true } },
		response: {},
		expectedOptions: {
			path: { orderId: 1 },
			body: { sendType: 'VPR', sendDraft: true },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.order.orderSendBy, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.order.orderSendBy, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'orderPos.getOrderPositions',
		method: 'GET',
		route: '/OrderPos',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.orderPos.getOrderPositions,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.orderPos.getOrderPositions,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'orderPos.getOrderPositionById',
		method: 'GET',
		route: '/OrderPos/{orderPosId}',
		input: { path: { orderPosId: 1 } },
		response: {},
		expectedOptions: { path: { orderPosId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.orderPos.getOrderPositionById,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.orderPos.getOrderPositionById,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'orderPos.updateOrderPosition',
		method: 'PUT',
		route: '/OrderPos/{orderPosId}',
		input: { path: { orderPosId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { orderPosId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.orderPos.updateOrderPosition,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.orderPos.updateOrderPosition,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'orderPos.deleteOrderPos',
		method: 'DELETE',
		route: '/OrderPos/{orderPosId}',
		input: { path: { orderPosId: 1 } },
		response: {},
		expectedOptions: { path: { orderPosId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.orderPos.deleteOrderPos, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.orderPos.deleteOrderPos, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'voucher.voucherFactorySaveVoucher',
		method: 'POST',
		route: '/Voucher/Factory/saveVoucher',
		input: {
			body: {
				voucher: {
					creditDebit: 'C',
					taxType: 'default',
					taxRule: { id: '1', objectName: 'TaxRule' },
					status: 50,
					voucherType: 'VOU',
					mapAll: true,
					objectName: 'test',
				},
			},
		},
		response: {},
		expectedOptions: {
			body: {
				voucher: {
					creditDebit: 'C',
					taxType: 'default',
					taxRule: { id: '1', objectName: 'TaxRule' },
					status: 50,
					voucherType: 'VOU',
					mapAll: true,
					objectName: 'test',
				},
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.voucher.voucherFactorySaveVoucher,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.voucher.voucherFactorySaveVoucher,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'voucher.getVouchers',
		method: 'GET',
		route: '/Voucher',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.getVouchers, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.getVouchers, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'voucher.getVoucherById',
		method: 'GET',
		route: '/Voucher/{voucherId}',
		input: { path: { voucherId: 1 } },
		response: {},
		expectedOptions: { path: { voucherId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.getVoucherById, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.getVoucherById, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'voucher.updateVoucher',
		method: 'PUT',
		route: '/Voucher/{voucherId}',
		input: { path: { voucherId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { voucherId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.updateVoucher, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.updateVoucher, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'voucher.voucherEnshrine',
		method: 'PUT',
		route: '/Voucher/{voucherId}/enshrine',
		input: { path: { voucherId: 1 } },
		response: {},
		expectedOptions: { path: { voucherId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.voucherEnshrine, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.voucherEnshrine, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'voucher.bookVoucher',
		method: 'PUT',
		route: '/Voucher/{voucherId}/bookAmount',
		input: {
			path: { voucherId: 1 },
			body: {
				amount: 1,
				date: '2026-01-01T00:00:00Z',
				type: 'FULL_PAYMENT',
				checkAccount: { id: 1, objectName: 'CheckAccount' },
			},
		},
		response: {},
		expectedOptions: {
			path: { voucherId: 1 },
			body: {
				amount: 1,
				date: '2026-01-01T00:00:00Z',
				type: 'FULL_PAYMENT',
				checkAccount: { id: 1, objectName: 'CheckAccount' },
			},
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.bookVoucher, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.bookVoucher, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'voucher.voucherResetToOpen',
		method: 'PUT',
		route: '/Voucher/{voucherId}/resetToOpen',
		input: { path: { voucherId: 1 } },
		response: {},
		expectedOptions: { path: { voucherId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.voucher.voucherResetToOpen,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.voucher.voucherResetToOpen,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'voucher.voucherResetToDraft',
		method: 'PUT',
		route: '/Voucher/{voucherId}/resetToDraft',
		input: { path: { voucherId: 1 } },
		response: {},
		expectedOptions: { path: { voucherId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.voucher.voucherResetToDraft,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.voucher.voucherResetToDraft,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'voucherPos.getVoucherPositions',
		method: 'GET',
		route: '/VoucherPos',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.voucherPos.getVoucherPositions,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.voucherPos.getVoucherPositions,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'voucher.forAllAccounts',
		method: 'GET',
		route: '/ReceiptGuidance/forAllAccounts',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.forAllAccounts, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.forAllAccounts, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'voucher.forAccountNumber',
		method: 'GET',
		route: '/ReceiptGuidance/forAccountNumber',
		input: { query: { accountNumber: 1 } },
		response: {},
		expectedOptions: { query: { accountNumber: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(
				sevdeskEndpointsNested.voucher.forAccountNumber,
				undefined,
				[ctx, data],
			),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(
				sevdeskEndpointsNested.voucher.forAccountNumber,
				undefined,
				[ctx, { unexpectedField: true }],
			),
	},
	{
		key: 'voucher.forTaxRule',
		method: 'GET',
		route: '/ReceiptGuidance/forTaxRule',
		input: { query: { taxRule: 'test' } },
		response: {},
		expectedOptions: { query: { taxRule: 'test' } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.forTaxRule, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.forTaxRule, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'voucher.forRevenue',
		method: 'GET',
		route: '/ReceiptGuidance/forRevenue',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.forRevenue, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.forRevenue, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'voucher.forExpense',
		method: 'GET',
		route: '/ReceiptGuidance/forExpense',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.forExpense, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.voucher.forExpense, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'report.reportInvoice',
		method: 'GET',
		route: '/Report/invoicelist',
		input: {
			query: { view: 'test', sevQuery: { modelName: {}, objectName: {} } },
		},
		response: {},
		expectedOptions: {
			query: { view: 'test', sevQuery: { modelName: {}, objectName: {} } },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.report.reportInvoice, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.report.reportInvoice, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'report.reportOrder',
		method: 'GET',
		route: '/Report/orderlist',
		input: {
			query: { view: 'test', sevQuery: { modelName: {}, objectName: {} } },
		},
		response: {},
		expectedOptions: {
			query: { view: 'test', sevQuery: { modelName: {}, objectName: {} } },
		},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.report.reportOrder, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.report.reportOrder, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'report.reportContact',
		method: 'GET',
		route: '/Report/contactlist',
		input: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		response: {},
		expectedOptions: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.report.reportContact, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.report.reportContact, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'report.reportVoucher',
		method: 'GET',
		route: '/Report/voucherlist',
		input: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		response: {},
		expectedOptions: { query: { sevQuery: { modelName: {}, objectName: {} } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.report.reportVoucher, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.report.reportVoucher, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'tag.getTags',
		method: 'GET',
		route: '/Tag',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.tag.getTags, undefined, [ctx, data]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.tag.getTags, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'tag.getTagById',
		method: 'GET',
		route: '/Tag/{tagId}',
		input: { path: { tagId: 1 } },
		response: {},
		expectedOptions: { path: { tagId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.tag.getTagById, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.tag.getTagById, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'tag.updateTag',
		method: 'PUT',
		route: '/Tag/{tagId}',
		input: { path: { tagId: 1 }, body: {} },
		response: {},
		expectedOptions: { path: { tagId: 1 }, body: {} },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.tag.updateTag, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.tag.updateTag, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'tag.deleteTag',
		method: 'DELETE',
		route: '/Tag/{tagId}',
		input: { path: { tagId: 1 } },
		response: {},
		expectedOptions: { path: { tagId: 1 } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.tag.deleteTag, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.tag.deleteTag, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'tag.createTag',
		method: 'POST',
		route: '/Tag/Factory/create',
		input: { body: { object: { id: 1, objectName: 'Invoice' } } },
		response: {},
		expectedOptions: { body: { object: { id: 1, objectName: 'Invoice' } } },
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.tag.createTag, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.tag.createTag, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
	{
		key: 'tag.getTagRelations',
		method: 'GET',
		route: '/TagRelation',
		input: {},
		response: {},
		expectedOptions: {},
		invoke: (ctx: SevdeskContext, data: object) =>
			Reflect.apply(sevdeskEndpointsNested.tag.getTagRelations, undefined, [
				ctx,
				data,
			]),
		invalid: (ctx: SevdeskContext) =>
			Reflect.apply(sevdeskEndpointsNested.tag.getTagRelations, undefined, [
				ctx,
				{ unexpectedField: true },
			]),
	},
] as const;

describe('documented operations', () => {
	it('registers every supported JSON operation', () => {
		expect(cases).toHaveLength(152);
		expect(Object.keys(sevdeskEndpointsNested).length).toBeGreaterThan(0);
	});
	it('uses API-key authentication and exposes no webhook receiver', () => {
		const plugin = sevdesk();
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('api_key');
	});
	it('accepts a populated invoice-position response with a numeric quantity', async () => {
		const response = { objects: [{ quantity: '2' }] };
		mockedRequest.mockResolvedValueOnce(response);
		await expect(
			sevdeskEndpointsNested.invoicePos.getInvoicePos(ctx, {}),
		).resolves.toEqual(response);
	});
	it('sends an invoice with a populated line and validates the response envelope', async () => {
		const body = {
			invoice: {
				contact: { id: 1, objectName: 'Contact' },
				contactPerson: { id: 1, objectName: 'SevUser' },
				invoiceDate: '2026-01-01',
				discount: 0,
				addressCountry: { id: 1, objectName: 'StaticCountry' },
				status: '100',
				taxRate: 19,
				taxRule: { id: '1', objectName: 'TaxRule' },
				taxText: 'VAT',
				taxType: 'default',
				invoiceType: 'RE',
				currency: 'EUR',
				mapAll: true,
			},
			invoicePosSave: [
				{
					objectName: 'InvoicePos',
					mapAll: true,
					quantity: 2,
					unity: { id: 1, objectName: 'Unity' },
					taxRate: 19,
				},
			],
		} satisfies SevdeskEndpointInputs['invoice.createInvoiceByFactory']['body'];
		const response = {
			invoice: {
				invoiceNumber: 'RE-1001',
				status: '100',
				taxRule: { id: '1', objectName: 'TaxRule' },
			},
			invoicePos: [{ quantity: '2', taxRate: '19' }],
		};
		mockedRequest.mockResolvedValueOnce(response);
		await expect(
			sevdeskEndpointsNested.invoice.createInvoiceByFactory(ctx, { body }),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'POST',
			'/Invoice/Factory/saveInvoice',
			ctx.key,
			expect.objectContaining({ body, replayable: false }),
		);
	});
	it('sends an expense voucher with an Update 2.0 expense tax rule', async () => {
		const body = {
			voucher: {
				objectName: 'Voucher',
				mapAll: true,
				status: 50,
				taxRule: { id: '9', objectName: 'TaxRule' },
				taxType: 'default',
				creditDebit: 'D',
				voucherType: 'VOU',
			},
			voucherPosSave: [
				{
					objectName: 'VoucherPos',
					mapAll: true,
					accountDatev: { id: 1, objectName: 'AccountDatev' },
					accountingType: { id: 1, objectName: 'AccountingType' },
					taxRate: 19,
					net: true,
					sumNet: 100,
					sumGross: 119,
				},
			],
		} satisfies SevdeskEndpointInputs['voucher.voucherFactorySaveVoucher']['body'];
		const response = {
			voucher: {
				status: '50',
				taxRule: { id: '9', objectName: 'TaxRule' },
				creditDebit: 'D',
				voucherType: 'VOU',
			},
			voucherPos: [],
		};
		mockedRequest.mockResolvedValueOnce(response);
		await expect(
			sevdeskEndpointsNested.voucher.voucherFactorySaveVoucher(ctx, { body }),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'POST',
			'/Voucher/Factory/saveVoucher',
			ctx.key,
			expect.objectContaining({ body, replayable: false }),
		);
	});
	for (const operation of cases) {
		it(`${operation.key} sends the expected route and validates its response`, async () => {
			mockedRequest.mockResolvedValueOnce(operation.response);
			const result = await operation.invoke(ctx, operation.input);
			expect(result).toEqual(operation.response);
			expect(mockedRequest).toHaveBeenCalledWith(
				operation.method,
				operation.route,
				ctx.key,
				expect.objectContaining({
					...operation.expectedOptions,
					resourceVersion: undefined,
					replayable:
						operation.method === 'GET' &&
						!NON_REPLAYABLE_GETS.has(operation.key),
				}),
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				`sevdesk.${operation.key}`,
				{},
				'completed',
			);
		});
		it(`${operation.key} rejects undocumented root fields before network I/O`, async () => {
			await expect(operation.invalid(ctx)).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	}
	it('does not mark a print-and-send GET as replayable', async () => {
		mockedRequest.mockResolvedValueOnce({});
		await sevdeskEndpointsNested.creditNote.sendCreditNoteByPrinting(ctx, {
			path: { creditNoteId: 1 },
			query: { sendType: 'VP' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'GET',
			'/CreditNote/{creditNoteId}/sendByWithRender',
			ctx.key,
			expect.objectContaining({ replayable: false }),
		);
	});
	it('does not log customer content or credentials', async () => {
		mockedRequest.mockResolvedValueOnce({});
		await sevdeskEndpointsNested.contact.createContact(ctx, {
			body: {
				category: { id: 3, objectName: 'Category' },
				name: 'Private Customer',
			},
		});
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(payload).toEqual({});
		expect(JSON.stringify(payload)).not.toContain('Private Customer');
		expect(JSON.stringify(payload)).not.toContain(ctx.key);
	});
});
