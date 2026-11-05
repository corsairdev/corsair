import { asRecord } from 'corsair/core';
import type { EnigmaEndpoints } from '..';
import { firstSearchResult } from '../client';
import {
	call,
	connectionNodes,
	connectionPageInfo,
	firstNode,
	nodeStrings,
	readNumber,
	readString,
} from './call';
import {
	EnigmaEndpointInputSchemas as Inputs,
	EnigmaEndpointOutputSchemas as Outputs,
} from './types';

// Enigma's filter JSON takes one expression; several conditions go under AND,
// as in the GraphQL quickstart's brand card revenue example.
export const CARD_REVENUE_12M_CONDITIONS = {
	filter: {
		AND: [
			{ EQ: ['period', '12m'] },
			{ EQ: ['quantityType', 'card_revenue_amount'] },
			{ EQ: ['rank', 0] },
		],
	},
};

const BRAND_SUMMARY_FIELDS = `
  id
  enigmaId
  names(first: 3) { edges { node { name } } }
  websites(first: 3) { edges { node { website } } }
  industries(first: 3) { edges { node { industryCode industryDesc industryType } } }
  count(field: "operatingLocations")
  cardTransactions(first: 1, conditions: $cardTransactions) {
    edges { node { quantityType period projectedQuantity periodStartDate periodEndDate } }
  }
`;

const BRANDS_MATCH_QUERY = `
query BrandsMatch($searchInput: SearchInput!, $cardTransactions: ConnectionConditions) {
  search(searchInput: $searchInput) {
    __typename
    ... on Brand {
      ${BRAND_SUMMARY_FIELDS}
    }
  }
}`;

const BRANDS_GET_QUERY = `
query BrandsGet(
  $searchInput: SearchInput!,
  $cardTransactions: ConnectionConditions,
  $locationsFirst: Int,
  $locationsAfter: String,
  $legalEntitiesFirst: Int
) {
  search(searchInput: $searchInput) {
    __typename
    ... on Brand {
      id
      enigmaId
      names(first: 3) { edges { node { name } } }
      websites(first: 3) { edges { node { website } } }
      industries(first: 3) { edges { node { industryCode industryDesc industryType } } }
      cardTransactions(first: 1, conditions: $cardTransactions) {
        edges { node { quantityType period projectedQuantity periodStartDate periodEndDate } }
      }
      operatingLocations(first: $locationsFirst, after: $locationsAfter) {
        edges {
          node {
            id
            names(first: 3) { edges { node { name } } }
            addresses(first: 1) {
              edges {
                node {
                  fullAddress
                  streetAddress1
                  streetAddress2
                  city
                  state
                  zip
                  county
                  country
                  latitude
                  longitude
                }
              }
            }
            operatingStatuses(first: 1) { edges { node { operatingStatus } } }
            cardTransactions(first: 1, conditions: $cardTransactions) {
              edges { node { quantityType period projectedQuantity periodStartDate periodEndDate } }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
      legalEntities(first: $legalEntitiesFirst) {
        edges {
          node {
            id
            enigmaId
            names(first: 3) { edges { node { name legalEntityType } } }
            registeredEntities(first: 3) {
              edges { node { name registeredEntityType formationDate } }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}`;

// unknown: the generic input schema's output, spread into the searchInput.
function toBrandSearchInput(
	parsed: Record<string, unknown>,
): Record<string, unknown> {
	return {
		entityType: 'BRAND',
		...parsed,
	};
}

export const match: EnigmaEndpoints['brandsMatch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'brands.match',
			input: Inputs.brandsMatch,
			output: Outputs.brandsMatch,
		},
		input,
		(parsed) => ({
			query: BRANDS_MATCH_QUERY,
			variables: {
				searchInput: toBrandSearchInput(parsed),
				cardTransactions: CARD_REVENUE_12M_CONDITIONS,
			},
		}),
		{
			shape: (raw) => {
				const brand = asRecord(firstSearchResult(raw));
				return {
					brand: brand
						? {
								id: readString(brand, 'id') ?? '',
								enigmaId: readString(brand, 'enigmaId'),
								names: nodeStrings(brand.names, 'name'),
								websites: nodeStrings(brand.websites, 'website'),
								industries: connectionNodes(brand.industries),
								operatingLocationCount: readNumber(brand, 'count'),
								cardRevenue12m: firstNode(brand.cardTransactions),
							}
						: null,
				};
			},
			log: (_parsed, result) => ({
				brandId: result.brand?.id ?? undefined,
			}),
		},
	);

export const get: EnigmaEndpoints['brandsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'brands.get',
			input: Inputs.brandsGet,
			output: Outputs.brandsGet,
		},
		input,
		({ id, locationsFirst, locationsAfter, legalEntitiesFirst }) => ({
			query: BRANDS_GET_QUERY,
			variables: {
				searchInput: { entityType: 'BRAND', id },
				cardTransactions: CARD_REVENUE_12M_CONDITIONS,
				locationsFirst,
				locationsAfter,
				legalEntitiesFirst,
			},
		}),
		{
			shape: (raw) => {
				const brand = asRecord(firstSearchResult(raw));
				return {
					brand: brand
						? {
								id: readString(brand, 'id') ?? '',
								enigmaId: readString(brand, 'enigmaId'),
								names: nodeStrings(brand.names, 'name'),
								websites: nodeStrings(brand.websites, 'website'),
								industries: connectionNodes(brand.industries),
								cardRevenue12m: firstNode(brand.cardTransactions),
								operatingLocations: {
									items: connectionNodes(brand.operatingLocations).map(
										(node) => ({
											id: readString(node, 'id') ?? '',
											names: nodeStrings(node.names, 'name'),
											address: firstNode(node.addresses),
											operatingStatus:
												nodeStrings(
													node.operatingStatuses,
													'operatingStatus',
												)[0] ?? null,
											cardRevenue12m: firstNode(node.cardTransactions),
										}),
									),
									pageInfo: connectionPageInfo(brand.operatingLocations),
								},
								legalEntities: {
									items: connectionNodes(brand.legalEntities).map((node) => ({
										id: readString(node, 'id') ?? '',
										enigmaId: readString(node, 'enigmaId'),
										names: nodeStrings(node.names, 'name'),
										legalEntityType:
											nodeStrings(node.names, 'legalEntityType')[0] ?? null,
										registeredEntities: connectionNodes(
											node.registeredEntities,
										),
									})),
									pageInfo: connectionPageInfo(brand.legalEntities),
								},
							}
						: null,
				};
			},
			log: (_parsed, result) => ({
				brandId: result.brand?.id ?? undefined,
				locationCount: result.brand?.operatingLocations.items.length,
			}),
		},
	);
