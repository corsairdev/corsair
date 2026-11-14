import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type {
	AddressBookAddRecipientResponse,
	AddressBookAddSenderResponse,
	AddressBookCountriesResponse,
	AddressBookDeleteRecipientResponse,
	AddressBookDeleteSenderResponse,
	AddressBookGetSenderResponse,
	AddressBookListRecipientsResponse,
	AddressBookListSendersResponse,
	AddressBookSetDefaultSenderResponse,
	AddressBookStatesResponse,
	AddressBookUpdateRecipientResponse,
	AddressBookUpdateSenderResponse,
} from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const countries: HandwryttenEndpoints['addressBook.countries'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['addressBook.countries'].parse(input);
	const response = await makeHandwryttenRequest<AddressBookCountriesResponse>(
		'/countries/list',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['addressBook.countries'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.addressBook.countries',
		{ count: parsed.countries?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const states: HandwryttenEndpoints['addressBook.states'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['addressBook.states'].parse(input);
	const response = await makeHandwryttenRequest<AddressBookStatesResponse>(
		'/countries/listStates',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['addressBook.states'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.addressBook.states',
		{ count: parsed.states?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const listRecipients: HandwryttenEndpoints['addressBook.listRecipients'] =
	async (ctx, input) => {
		HandwryttenEndpointInputSchemas['addressBook.listRecipients'].parse(input);
		const response =
			await makeHandwryttenRequest<AddressBookListRecipientsResponse>(
				'/profile/recipientsList',
				ctx.key,
				{
					method: 'GET',
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['addressBook.listRecipients'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.addressBook.listRecipients',
			{ count: parsed.addresses?.length ?? 0 },
			'completed',
		);
		return parsed;
	};

export const addRecipient: HandwryttenEndpoints['addressBook.addRecipient'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['addressBook.addRecipient'].parse(input);
		const response =
			await makeHandwryttenRequest<AddressBookAddRecipientResponse>(
				'/profile/addRecipient',
				ctx.key,
				{
					method: 'POST',
					body: parsedInput,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['addressBook.addRecipient'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.addressBook.addRecipient',
			{ addressId: parsed.address_id },
			'completed',
		);
		return parsed;
	};

export const updateRecipient: HandwryttenEndpoints['addressBook.updateRecipient'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['addressBook.updateRecipient'].parse(
				input,
			);
		const response =
			await makeHandwryttenRequest<AddressBookUpdateRecipientResponse>(
				'/profile/updateRecipient',
				ctx.key,
				{
					method: 'PUT',
					body: parsedInput,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['addressBook.updateRecipient'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.addressBook.updateRecipient',
			{ addressId: parsed.address_id },
			'completed',
		);
		return parsed;
	};

export const deleteRecipient: HandwryttenEndpoints['addressBook.deleteRecipient'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['addressBook.deleteRecipient'].parse(
				input,
			);
		const response =
			await makeHandwryttenRequest<AddressBookDeleteRecipientResponse>(
				'/profile/deleteRecipient',
				ctx.key,
				{
					method: 'POST',
					body: parsedInput,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['addressBook.deleteRecipient'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.addressBook.deleteRecipient',
			{ addressId: parsedInput.address_id },
			'completed',
		);
		return parsed;
	};

export const listSenders: HandwryttenEndpoints['addressBook.listSenders'] =
	async (ctx, input) => {
		HandwryttenEndpointInputSchemas['addressBook.listSenders'].parse(input);
		const response =
			await makeHandwryttenRequest<AddressBookListSendersResponse>(
				'/profile/listAddresses',
				ctx.key,
				{
					method: 'GET',
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['addressBook.listSenders'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.addressBook.listSenders',
			{ count: parsed.addresses?.length ?? 0 },
			'completed',
		);
		return parsed;
	};

export const getSender: HandwryttenEndpoints['addressBook.getSender'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['addressBook.getSender'].parse(input);
	const response = await makeHandwryttenRequest<AddressBookGetSenderResponse>(
		'/profile/address',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['addressBook.getSender'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.addressBook.getSender',
		{},
		'completed',
	);
	return parsed;
};

export const addSender: HandwryttenEndpoints['addressBook.addSender'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['addressBook.addSender'].parse(input);
	const response = await makeHandwryttenRequest<AddressBookAddSenderResponse>(
		'/profile/createAddress',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['addressBook.addSender'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.addressBook.addSender',
		{},
		'completed',
	);
	return parsed;
};

export const updateSender: HandwryttenEndpoints['addressBook.updateSender'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['addressBook.updateSender'].parse(input);
		const response =
			await makeHandwryttenRequest<AddressBookUpdateSenderResponse>(
				'/profile/updateAddress',
				ctx.key,
				{
					method: 'PUT',
					body: parsedInput,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['addressBook.updateSender'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.addressBook.updateSender',
			{},
			'completed',
		);
		return parsed;
	};

export const deleteSender: HandwryttenEndpoints['addressBook.deleteSender'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['addressBook.deleteSender'].parse(input);
		const response =
			await makeHandwryttenRequest<AddressBookDeleteSenderResponse>(
				'/profile/deleteAddress',
				ctx.key,
				{
					method: 'POST',
					body: parsedInput,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['addressBook.deleteSender'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.addressBook.deleteSender',
			{ addressId: parsedInput.id },
			'completed',
		);
		return parsed;
	};

export const setDefaultSender: HandwryttenEndpoints['addressBook.setDefaultSender'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas[
				'addressBook.setDefaultSender'
			].parse(input);
		const response =
			await makeHandwryttenRequest<AddressBookSetDefaultSenderResponse>(
				'/profile/setDefaultAddress',
				ctx.key,
				{
					method: 'POST',
					body: parsedInput,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas[
				'addressBook.setDefaultSender'
			].parse(response);
		await logEventFromContext(
			ctx,
			'handwrytten.addressBook.setDefaultSender',
			{ addressId: parsedInput.id },
			'completed',
		);
		return parsed;
	};
