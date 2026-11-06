import { asRecord } from 'corsair/core';
import type { EnigmaEndpoints } from '..';
import { firstSearchResult } from '../client';
import {
	call,
	connectionNodes,
	firstNode,
	nodeStrings,
	readString,
} from './call';
import {
	EnigmaEndpointInputSchemas as Inputs,
	EnigmaEndpointOutputSchemas as Outputs,
} from './types';

const LOCATIONS_MATCH_QUERY = `
query LocationsMatch($searchInput: SearchInput!) {
  search(searchInput: $searchInput) {
    __typename
    ... on OperatingLocation {
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
      phoneNumbers(first: 3) { edges { node { phoneNumber } } }
      websites(first: 3) { edges { node { website } } }
      operatingStatuses(first: 1) { edges { node { operatingStatus } } }
      brands(first: 3) {
        edges {
          node {
            id
            enigmaId
            names(first: 1) { edges { node { name } } }
          }
        }
      }
    }
  }
}`;

export const match: EnigmaEndpoints['locationsMatch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'locations.match',
			input: Inputs.locationsMatch,
			output: Outputs.locationsMatch,
		},
		input,
		(parsed) => ({
			query: LOCATIONS_MATCH_QUERY,
			variables: {
				searchInput: { entityType: 'OPERATING_LOCATION', ...parsed },
			},
		}),
		{
			shape: (raw) => {
				const node = asRecord(firstSearchResult(raw));
				return {
					location: node
						? {
								id: readString(node, 'id') ?? '',
								names: nodeStrings(node.names, 'name'),
								address: firstNode(node.addresses),
								phoneNumbers: nodeStrings(node.phoneNumbers, 'phoneNumber'),
								websites: nodeStrings(node.websites, 'website'),
								operatingStatus:
									nodeStrings(node.operatingStatuses, 'operatingStatus')[0] ??
									null,
								brands: connectionNodes(node.brands).map((brand) => ({
									id: readString(brand, 'id') ?? '',
									enigmaId: readString(brand, 'enigmaId'),
									names: nodeStrings(brand.names, 'name'),
								})),
							}
						: null,
				};
			},
			log: (_parsed, result) => ({
				locationId: result.location?.id ?? undefined,
			}),
		},
	);
