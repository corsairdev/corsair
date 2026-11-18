import type { CorsairContext } from 'corsair/core';
import type { QuickBooksContext } from '..';
import { makeQuickBooksRequest } from '../client';
import type {
	QuickBooksEndpointInputs,
	QuickBooksEndpointOutputs,
} from './types';
import {
	QuickBooksEndpointInputSchemas,
	QuickBooksEndpointOutputSchemas,
} from './types';

type EndpointContext = CorsairContext & {
	key: string;
	options: Pick<QuickBooksContext['options'], 'environment'>;
};

export async function get(
	ctx: EndpointContext,
	input: QuickBooksEndpointInputs['companyGet'],
): Promise<QuickBooksEndpointOutputs['companyGet']> {
	const parsedInput = QuickBooksEndpointInputSchemas.companyGet.parse(input);
	const realmId = encodeURIComponent(parsedInput.realmId);
	// unknown because the shared transport returns untrusted provider JSON before validation.
	const response = await makeQuickBooksRequest<unknown>(
		`company/${realmId}/companyinfo/${realmId}`,
		ctx.key,
		{},
		ctx.options.environment,
	);
	return QuickBooksEndpointOutputSchemas.companyGet.parse(response);
}

export async function list(
	ctx: EndpointContext,
	input: QuickBooksEndpointInputs['companyList'],
): Promise<QuickBooksEndpointOutputs['companyList']> {
	const parsedInput = QuickBooksEndpointInputSchemas.companyList.parse(input);
	// unknown because the shared transport returns untrusted provider JSON before validation.
	const response = await makeQuickBooksRequest<unknown>(
		`company/${encodeURIComponent(parsedInput.realmId)}/query`,
		ctx.key,
		{ query: { query: 'SELECT * FROM CompanyInfo' } },
		ctx.options.environment,
	);
	return QuickBooksEndpointOutputSchemas.companyList.parse(response);
}
