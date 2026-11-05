import { logEventFromContext } from 'corsair/core';
import type { ChaserEndpoints } from '..';
import { makeChaserRequest } from '../client';
import type { ChaserEndpointOutputs } from './types';

export const listCustomers: ChaserEndpoints['listCustomers'] = async (
	ctx,
	input,
): Promise<ChaserEndpointOutputs['listCustomers']> => {
	const response = await makeChaserRequest<
		ChaserEndpointOutputs['listCustomers']
	>('/v1/customers', ctx.key, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(ctx, 'chaser.customers.list', {}, 'completed');
	return response;
};

export const listInvoices: ChaserEndpoints['listInvoices'] = async (
	ctx,
	input,
): Promise<ChaserEndpointOutputs['listInvoices']> => {
	const response = await makeChaserRequest<
		ChaserEndpointOutputs['listInvoices']
	>('/v1/invoices', ctx.key, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(ctx, 'chaser.invoices.list', {}, 'completed');
	return response;
};

export const getInvoice: ChaserEndpoints['getInvoice'] = async (
	ctx,
	input,
): Promise<ChaserEndpointOutputs['getInvoice']> => {
	const response = await makeChaserRequest<ChaserEndpointOutputs['getInvoice']>(
		`/v1/invoices/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'chaser.invoices.get',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const listCreditNotes: ChaserEndpoints['listCreditNotes'] = async (
	ctx,
	input,
): Promise<ChaserEndpointOutputs['listCreditNotes']> => {
	const response = await makeChaserRequest<
		ChaserEndpointOutputs['listCreditNotes']
	>('/v1/credit-notes', ctx.key, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(ctx, 'chaser.credit-notes.list', {}, 'completed');
	return response;
};

export const getOrganization: ChaserEndpoints['getOrganization'] = async (
	ctx,
): Promise<ChaserEndpointOutputs['getOrganization']> => {
	const response = await makeChaserRequest<
		ChaserEndpointOutputs['getOrganization']
	>('/v1/organization', ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'chaser.organization.get', {}, 'completed');
	return response;
};
