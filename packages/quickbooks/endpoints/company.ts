import type { CorsairContext } from 'corsair/core';
import type { QuickBooksContext } from '..';
import { makeAuthenticatedQuickBooksRequest } from '../client';
import { responseSchema } from './schema-mode';
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
	_refreshAuth?: () => Promise<string>;
	options: Pick<QuickBooksContext['options'], 'environment'>;
};

export async function get(
	ctx: EndpointContext,
	input: QuickBooksEndpointInputs['companyGet'],
): Promise<QuickBooksEndpointOutputs['companyGet']> {
	const parsedInput = QuickBooksEndpointInputSchemas.companyGet.parse(input);
	const realmId = encodeURIComponent(parsedInput.realmId);
	// unknown because the shared transport returns untrusted provider JSON before validation.
	const response = await makeAuthenticatedQuickBooksRequest<unknown>(
		ctx,
		`company/${realmId}/companyinfo/${realmId}`,
		{},
		ctx.options.environment,
	);
	return responseSchema(QuickBooksEndpointOutputSchemas.companyGet).parse(
		response,
	) as QuickBooksEndpointOutputs['companyGet'];
}

export async function list(
	ctx: EndpointContext,
	input: QuickBooksEndpointInputs['companyList'],
): Promise<QuickBooksEndpointOutputs['companyList']> {
	const parsedInput = QuickBooksEndpointInputSchemas.companyList.parse(input);
	// unknown because the shared transport returns untrusted provider JSON before validation.
	const response = await makeAuthenticatedQuickBooksRequest<unknown>(
		ctx,
		`company/${encodeURIComponent(parsedInput.realmId)}/query`,
		{ query: { query: 'SELECT * FROM CompanyInfo' } },
		ctx.options.environment,
	);
	return responseSchema(QuickBooksEndpointOutputSchemas.companyList).parse(
		response,
	) as QuickBooksEndpointOutputs['companyList'];
}
