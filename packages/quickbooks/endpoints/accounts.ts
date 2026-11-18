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
	const response = await makeQuickBooksRequest<unknown>(
		`${companyPath(parsedInput.realmId)}/account`,
		ctx.key,
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
	const response = await makeQuickBooksRequest<unknown>(
		`${companyPath(parsedInput.realmId)}/account/${encodeURIComponent(parsedInput.accountId)}`,
		ctx.key,
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
	const response = await makeQuickBooksRequest<unknown>(
		`${companyPath(parsedInput.realmId)}/query`,
		ctx.key,
		{ query: { query } },
		ctx.options.environment,
	);
	return QuickBooksEndpointOutputSchemas.accountsList.parse(response);
}
