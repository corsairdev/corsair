import { logEventFromContext } from 'corsair/core';
import { makeChaserRequest } from '../client';
import type { ChaserEndpointInputs, ChaserEndpointOutputs } from './types';

export const listCustomers = async (
	ctx: any,
	_input?: any,
): Promise<ChaserEndpointOutputs['listCustomers']> => {
	const input = ctx.input as ChaserEndpointInputs['listCustomers'];
	const response = await makeChaserRequest<
		ChaserEndpointOutputs['listCustomers']
	>('/v1/customers', ctx.key, ctx.secret ?? '', {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(ctx, 'chaser.customers.list', {}, 'completed');
	return response;
};

export const listInvoices = async (
	ctx: any,
	_input?: any,
): Promise<ChaserEndpointOutputs['listInvoices']> => {
	const input = ctx.input as ChaserEndpointInputs['listInvoices'];
	const response = await makeChaserRequest<
		ChaserEndpointOutputs['listInvoices']
	>('/v1/invoices', ctx.key, ctx.secret ?? '', { method: 'GET', query: input });
	await logEventFromContext(ctx, 'chaser.invoices.list', {}, 'completed');
	return response;
};

export const getInvoice = async (
	ctx: any,
	_input?: any,
): Promise<ChaserEndpointOutputs['getInvoice']> => {
	const input = ctx.input as ChaserEndpointInputs['getInvoice'];
	const response = await makeChaserRequest<ChaserEndpointOutputs['getInvoice']>(
		`/v1/invoices/${input.id}`,
		ctx.key,
		ctx.secret ?? '',
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

export const listCreditNotes = async (
	ctx: any,
	_input?: any,
): Promise<ChaserEndpointOutputs['listCreditNotes']> => {
	const input = ctx.input as ChaserEndpointInputs['listCreditNotes'];
	const response = await makeChaserRequest<
		ChaserEndpointOutputs['listCreditNotes']
	>('/v1/credit-notes', ctx.key, ctx.secret ?? '', {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(ctx, 'chaser.credit-notes.list', {}, 'completed');
	return response;
};

export const getOrganization = async (
	ctx: any,
	_input?: any,
): Promise<ChaserEndpointOutputs['getOrganization']> => {
	const response = await makeChaserRequest<
		ChaserEndpointOutputs['getOrganization']
	>('/v1/organization', ctx.key, ctx.secret ?? '', { method: 'GET' });
	await logEventFromContext(ctx, 'chaser.organization.get', {}, 'completed');
	return response;
};
