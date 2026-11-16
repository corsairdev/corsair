import type { TaxJarEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	CustomerDeletedSchema,
	CustomerIdsResponseSchema,
	CustomerResponseSchema,
	CustomersCreateInputSchema,
	CustomersGetInputSchema,
	CustomersListInputSchema,
	CustomersRemoveInputSchema,
	CustomersUpdateInputSchema,
} from './types';

export const customersList: TaxJarEndpoints['customersList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'customers.list',
			input: CustomersListInputSchema,
			output: CustomerIdsResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/customers' }),
	);
};

export const customersCreate: TaxJarEndpoints['customersCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'customers.create',
			input: CustomersCreateInputSchema,
			output: CustomerResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/customers',
			body: parsed,
		}),
	);
};

export const customersGet: TaxJarEndpoints['customersGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'customers.get',
			input: CustomersGetInputSchema,
			output: CustomerResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/customers/${segment(parsed.customerId)}`,
		}),
	);
};

export const customersUpdate: TaxJarEndpoints['customersUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'customers.update',
			input: CustomersUpdateInputSchema,
			output: CustomerResponseSchema,
		},
		input,
		(parsed) => {
			const { customerId, ...body } = parsed;
			return {
				method: 'PUT',
				path: `/customers/${segment(customerId)}`,
				body,
			};
		},
	);
};

export const customersRemove: TaxJarEndpoints['customersRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{
			event: 'customers.remove',
			input: CustomersRemoveInputSchema,
			confirm: CustomerDeletedSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/customers/${segment(parsed.customerId)}`,
		}),
	);
};
