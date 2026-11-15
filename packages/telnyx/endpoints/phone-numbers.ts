import type { TelnyxEndpoints } from '..';
import { call, paging } from './call';
import {
	AvailablePhoneNumbersListInputSchema,
	AvailablePhoneNumbersListResponseSchema,
	PhoneNumbersGetInputSchema,
	PhoneNumbersGetResponseSchema,
	PhoneNumbersListInputSchema,
	PhoneNumbersListResponseSchema,
	PhoneNumbersRemoveInputSchema,
	PhoneNumbersRemoveResponseSchema,
	PhoneNumbersUpdateInputSchema,
	PhoneNumbersUpdateResponseSchema,
} from './types';

export const list: TelnyxEndpoints['phoneNumbersList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'phoneNumbers.list',
			input: PhoneNumbersListInputSchema,
			output: PhoneNumbersListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/phone_numbers',
			query: {
				...paging(parsed.pageNumber, parsed.pageSize),
				sort: parsed.sort,
			},
		}),
	);
};

export const get: TelnyxEndpoints['phoneNumbersGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'phoneNumbers.get',
			input: PhoneNumbersGetInputSchema,
			output: PhoneNumbersGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/phone_numbers/${parsed.phoneNumberId}`,
		}),
	);
};

export const update: TelnyxEndpoints['phoneNumbersUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'phoneNumbers.update',
			input: PhoneNumbersUpdateInputSchema,
			output: PhoneNumbersUpdateResponseSchema,
		},
		input,
		(parsed) => {
			const { phoneNumberId, ...body } = parsed;
			return {
				method: 'PATCH',
				path: `/phone_numbers/${phoneNumberId}`,
				body,
			};
		},
	);
};

export const remove: TelnyxEndpoints['phoneNumbersRemove'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'phoneNumbers.remove',
			input: PhoneNumbersRemoveInputSchema,
			output: PhoneNumbersRemoveResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/phone_numbers/${parsed.phoneNumberId}`,
		}),
	);
};

export const availableList: TelnyxEndpoints['availablePhoneNumbersList'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'availablePhoneNumbers.list',
				input: AvailablePhoneNumbersListInputSchema,
				output: AvailablePhoneNumbersListResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: '/available_phone_numbers',
				query: {
					'filter[country_code]': parsed.countryCode,
					'filter[locality]': parsed.locality,
					'filter[administrative_area]': parsed.administrativeArea,
					'filter[national_destination_code]': parsed.nationalDestinationCode,
					'filter[phone_number_type]': parsed.phoneNumberType,
					'filter[limit]': parsed.limit,
					...paging(parsed.pageNumber, parsed.pageSize),
				},
			}),
		);
	};
