import type {
	ShopifyContext,
	ShopifyEndpointInputs,
	ShopifyEndpointOutputs,
} from '..';
import { call } from './call';
import {
	ShopifyEndpointInputSchemas as Inputs,
	ShopifyEndpointOutputSchemas as Outputs,
} from './types';

// `shop` takes no arguments, so the input schema is an empty object and a
// caller writes `api.shop.get()`.
const SHOP_QUERY = `
query ShopGet {
  shop {
    id
    name
    myshopifyDomain
    currencyCode
    ianaTimezone
    email
    description
    plan { displayName }
  }
}`;

// Location has no flat address fields: `address1`, `city`, `province` and the
// rest live under `address`, which is a `LocationAddress`. The nested object is
// non-null but its members are not, which is how a location with no street
// address still reads.
const LOCATIONS_QUERY = `
query LocationsList($first: Int) {
  locations(first: $first) {
    edges {
      node {
        id
        name
        isActive
        address {
          address1
          city
          province
          countryCode
          zip
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

export const get = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['shopGet'],
): Promise<ShopifyEndpointOutputs['shopGet']> =>
	call(
		ctx,
		{ event: 'shop.get', input: Inputs.shopGet, output: Outputs.shopGet },
		input,
		() => ({ query: SHOP_QUERY, replaySafe: true }),
		{ log: (_, result) => ({ shop: result.shop.myshopifyDomain }) },
	);

export const listLocations = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['locationsList'],
): Promise<ShopifyEndpointOutputs['locationsList']> =>
	call(
		ctx,
		{
			event: 'locations.list',
			input: Inputs.locationsList,
			output: Outputs.locationsList,
		},
		input,
		({ first }) => ({
			query: LOCATIONS_QUERY,
			variables: { first: first ?? 50 },
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.locations.edges.length }) },
	);
