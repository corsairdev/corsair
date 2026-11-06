import { asRecord } from 'corsair/core';
import type { EnigmaEndpoints } from '..';
import { firstSearchResult } from '../client';
import {
	call,
	connectionNodes,
	connectionPageInfo,
	nodeStrings,
	readString,
} from './call';
import {
	EnigmaEndpointInputSchemas as Inputs,
	EnigmaEndpointOutputSchemas as Outputs,
} from './types';

const LEGAL_ENTITIES_GET_QUERY = `
query LegalEntitiesGet($searchInput: SearchInput!) {
  search(searchInput: $searchInput) {
    __typename
    ... on LegalEntity {
      id
      enigmaId
      names(first: 3) { edges { node { name legalEntityType } } }
      registeredEntities(first: 3) {
        edges { node { name registeredEntityType formationDate } }
        pageInfo { hasNextPage endCursor }
      }
      addresses(first: 3) {
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
        pageInfo { hasNextPage endCursor }
      }
      brands(first: 3) {
        edges {
          node {
            id
            enigmaId
            names(first: 1) { edges { node { name } } }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}`;

export const get: EnigmaEndpoints['legalEntitiesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'legalEntities.get',
			input: Inputs.legalEntitiesGet,
			output: Outputs.legalEntitiesGet,
		},
		input,
		(parsed) => ({
			query: LEGAL_ENTITIES_GET_QUERY,
			variables: { searchInput: { entityType: 'LEGAL_ENTITY', ...parsed } },
		}),
		{
			shape: (raw) => {
				const node = asRecord(firstSearchResult(raw));
				return {
					legalEntity: node
						? {
								id: readString(node, 'id') ?? '',
								enigmaId: readString(node, 'enigmaId'),
								names: nodeStrings(node.names, 'name'),
								legalEntityType:
									nodeStrings(node.names, 'legalEntityType')[0] ?? null,
								registeredEntities: {
									items: connectionNodes(node.registeredEntities),
									pageInfo: connectionPageInfo(node.registeredEntities),
								},
								addresses: {
									items: connectionNodes(node.addresses),
									pageInfo: connectionPageInfo(node.addresses),
								},
								brands: {
									items: connectionNodes(node.brands).map((brand) => ({
										id: readString(brand, 'id') ?? '',
										enigmaId: readString(brand, 'enigmaId'),
										names: nodeStrings(brand.names, 'name'),
									})),
									pageInfo: connectionPageInfo(node.brands),
								},
							}
						: null,
				};
			},
			log: (_parsed, result) => ({
				legalEntityId: result.legalEntity?.id ?? undefined,
			}),
		},
	);
