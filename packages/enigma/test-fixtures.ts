// GraphQL response bodies copied from the examples in
// https://documentation.enigma.com, with made-up companies. They were not
// captured from the live API.

// unknown: fixture nodes mirror the GraphQL responses, which are untyped.
function connection(
	nodes: Record<string, unknown>[],
	pageInfo: Record<string, unknown> = { hasNextPage: false, endCursor: null },
) {
	return { edges: nodes.map((node) => ({ node })), pageInfo };
}

export const brand = {
	__typename: 'Brand',
	id: '5f1147ed-4d0e-4f36-a1d2-c2b3f2b1a9c4',
	enigmaId: 'ENIGMA-9f8e7d6c',
	names: connection([{ name: 'STARBUCKS' }]),
	websites: connection([{ website: 'https://www.starbucks.com' }]),
	industries: connection([
		{
			industryCode: '722515',
			industryDesc: 'Snack and Nonalcoholic Beverage Bars',
			industryType: 'naics_2022_code',
		},
	]),
	count: 20153,
	cardTransactions: connection([
		{
			quantityType: 'card_revenue_amount',
			period: '12m',
			projectedQuantity: 1998052529.9,
			periodStartDate: '2025-10-01',
			periodEndDate: '2026-09-30',
		},
	]),
};

export const brandLocation = {
	__typename: 'OperatingLocation',
	id: 'b1c2d3e4-5f60-4a7b-8c9d-0e1f2a3b4c5d',
	names: connection([{ name: 'STARBUCKS' }]),
	addresses: connection([
		{
			fullAddress: '462 7th Ave, New York, NY 10018',
			streetAddress1: '462 7th Ave',
			streetAddress2: null,
			city: 'New York',
			state: 'NY',
			zip: '10018',
			county: 'New York County',
			country: 'US',
			latitude: 40.7538,
			longitude: -73.9919,
		},
	]),
	operatingStatuses: connection([{ operatingStatus: 'Open' }]),
	cardTransactions: connection([
		{
			quantityType: 'card_revenue_amount',
			period: '12m',
			projectedQuantity: 2867450.12,
			periodStartDate: '2025-10-01',
			periodEndDate: '2026-09-30',
		},
	]),
};

export const brandLegalEntity = {
	__typename: 'LegalEntity',
	id: 'c3d4e5f6-7a81-4b9c-8d0e-1f2a3b4c5d6e',
	enigmaId: 'ENIGMA-4c5b6a7b',
	names: connection([
		{ name: 'STARBUCKS CORPORATION', legalEntityType: 'Corporation' },
	]),
	registeredEntities: connection([
		{
			name: 'STARBUCKS CORPORATION',
			registeredEntityType: 'Corporation',
			formationDate: '1985-11-04',
		},
	]),
};

export const brandDetail = {
	...brand,
	operatingLocations: connection([brandLocation], {
		hasNextPage: true,
		endCursor: 'b1c2d3e4-5f60-4a7b-8c9d-0e1f2a3b4c5d',
	}),
	legalEntities: connection([brandLegalEntity], {
		hasNextPage: false,
		endCursor: null,
	}),
};

export const locationDetail = {
	__typename: 'OperatingLocation',
	id: 'd5e6f7a8-9b02-4c3d-8e4f-5a6b7c8d9e0f',
	names: connection([{ name: 'BLUESTONE LANE' }]),
	addresses: connection([
		{
			fullAddress: '35 W 8th St, New York, NY 10011',
			streetAddress1: '35 W 8th St',
			city: 'New York',
			state: 'NY',
			zip: '10011',
			county: 'New York County',
			country: 'US',
			latitude: 40.7321,
			longitude: -73.9976,
		},
	]),
	phoneNumbers: connection([{ phoneNumber: '+12122550183' }]),
	websites: connection([{ website: 'https://bluestonelane.com' }]),
	operatingStatuses: connection([{ operatingStatus: 'Open' }]),
	brands: connection([
		{
			id: 'e7f8a9b0-1c34-4d5e-9f6a-7b8c9d0e1f2a',
			enigmaId: 'ENIGMA-1a2b3c4d',
			names: connection([{ name: 'BLUESTONE LANE' }]),
		},
	]),
};

export const legalEntityDetail = {
	__typename: 'LegalEntity',
	id: brandLegalEntity.id,
	enigmaId: brandLegalEntity.enigmaId,
	names: connection([
		{ name: 'STARBUCKS CORPORATION', legalEntityType: 'Corporation' },
	]),
	registeredEntities: connection([
		{
			name: 'STARBUCKS CORPORATION',
			registeredEntityType: 'Corporation',
			formationDate: '1985-11-04',
		},
	]),
	addresses: connection([
		{
			fullAddress: '2401 Utah Ave S, Seattle, WA 98134',
			streetAddress1: '2401 Utah Ave S',
			streetAddress2: null,
			city: 'Seattle',
			state: 'WA',
			zip: '98134',
			county: 'King County',
			country: 'US',
			latitude: 47.5814,
			longitude: -122.3342,
		},
	]),
	brands: connection([
		{
			id: brand.id,
			enigmaId: brand.enigmaId,
			names: connection([{ name: 'STARBUCKS' }]),
		},
	]),
};

// unknown: each match is one SearchUnion member with untyped fields.
export function searchResponse(
	...matches: Record<string, unknown>[]
): Record<string, unknown> {
	return { data: { search: matches } };
}

export const noMatchResponse = searchResponse();

export const nullMatchResponse = { data: { search: [null] } };

export const graphQLErrorResponse = {
	errors: [{ message: 'Cannot query field "nosuch" on type "Query".' }],
	data: null,
};

// The real body api.enigma.com returns for a missing or bad x-api-key.
export const badKeyResponse = {
	error_message: 'Missing or invalid API key',
	error_code: 'UNAUTHORIZED',
	retryable: false,
};
