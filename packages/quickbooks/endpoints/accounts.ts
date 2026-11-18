import type { CorsairContext } from 'corsair/core';
import type { QuickBooksContext } from '..';
import { makeAuthenticatedQuickBooksRequest } from '../client';
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

function companyPath(realmId: string): string {
	return `company/${encodeURIComponent(realmId)}`;
}

export async function create(
	ctx: EndpointContext,
	input: QuickBooksEndpointInputs['accountsCreate'],
): Promise<QuickBooksEndpointOutputs['accountsCreate']> {
	const parsedInput =
		QuickBooksEndpointInputSchemas.accountsCreate.parse(input);
	// unknown because the shared transport returns untrusted provider JSON before validation.
	const response = await makeAuthenticatedQuickBooksRequest<unknown>(
		ctx,
		`${companyPath(parsedInput.realmId)}/account`,
		{
			method: 'POST',
			body: {
				Name: parsedInput.name,
				...(parsedInput.accountType
					? { AccountType: parsedInput.accountType }
					: {}),
				...(parsedInput.accountSubType
					? { AccountSubType: parsedInput.accountSubType }
					: {}),
				...(parsedInput.acctNum ? { AcctNum: parsedInput.acctNum } : {}),
				...(parsedInput.taxCodeRef
					? { TaxCodeRef: parsedInput.taxCodeRef }
					: {}),
			},
		},
		ctx.options.environment,
	);
	return QuickBooksEndpointOutputSchemas.accountsCreate.parse(response);
}

export async function get(
	ctx: EndpointContext,
	input: QuickBooksEndpointInputs['accountsGet'],
): Promise<QuickBooksEndpointOutputs['accountsGet']> {
	const parsedInput = QuickBooksEndpointInputSchemas.accountsGet.parse(input);
	// unknown because the shared transport returns untrusted provider JSON before validation.
	const response = await makeAuthenticatedQuickBooksRequest<unknown>(
		ctx,
		`${companyPath(parsedInput.realmId)}/account/${encodeURIComponent(parsedInput.accountId)}`,
		{},
		ctx.options.environment,
	);
	return QuickBooksEndpointOutputSchemas.accountsGet.parse(response);
}

export async function list(
	ctx: EndpointContext,
	input: QuickBooksEndpointInputs['accountsList'],
): Promise<QuickBooksEndpointOutputs['accountsList']> {
	const parsedInput = QuickBooksEndpointInputSchemas.accountsList.parse(input);
	const query = [
		'SELECT * FROM Account',
		...(parsedInput.startPosition
			? [`STARTPOSITION ${parsedInput.startPosition}`]
			: []),
		...(parsedInput.maxResults ? [`MAXRESULTS ${parsedInput.maxResults}`] : []),
	].join(' ');
	// unknown because the shared transport returns untrusted provider JSON before validation.
	const response = await makeAuthenticatedQuickBooksRequest<unknown>(
		ctx,
		`${companyPath(parsedInput.realmId)}/query`,
		{ query: { query } },
		ctx.options.environment,
	);
	return QuickBooksEndpointOutputSchemas.accountsList.parse(response);
}
