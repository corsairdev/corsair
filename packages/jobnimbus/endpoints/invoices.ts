import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const invoicesCreate: JobNimbusEndpoints['invoicesCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.invoicesCreate.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/v2/invoices',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.invoicesCreate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.invoices.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const invoicesUpdate: JobNimbusEndpoints['invoicesUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.invoicesUpdate.parse(input);
	const { jnid, ...body } = parsedInput;

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/invoices/${encodeURIComponent(jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.invoicesUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.invoices.update',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const invoicesDelete: JobNimbusEndpoints['invoicesDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.invoicesDelete.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/invoices/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body: { is_active: false },
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.invoicesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.invoices.delete',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const invoicesGet: JobNimbusEndpoints['invoicesGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.invoicesGet.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/invoices/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.invoicesGet.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.invoices.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const invoicesList: JobNimbusEndpoints['invoicesList'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.invoicesList.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/v2/invoices',
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				size: parsedInput.size,
				from: parsedInput.from,
				sort: parsedInput.sort,
				direction: parsedInput.direction,
				actor: parsedInput.actor,
			}),
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.invoicesList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.invoices.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const Invoices = {
	create: invoicesCreate,
	update: invoicesUpdate,
	delete: invoicesDelete,
	get: invoicesGet,
	list: invoicesList,
};
