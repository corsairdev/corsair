import { domainApiLookup } from './domain-api-lookup';
import { financialApiLookup } from './financial-api-lookup';
import { freeApiLookup } from './free-api-lookup';
import { listsApiGetList } from './lists-api-get-list';
import { mcpApiLookup } from './mcp-api-lookup';
import { productApiLookup } from './product-api-lookup';
import { recommendationsApiLookup } from './recommendations-api-lookup';
import { redirectsApiLookup } from './redirects-api-lookup';
import { socialApiLookup } from './social-api-lookup';

export const BuiltWithEndpoints = {
	domainApiLookup,
	financialApiLookup,
	freeApiLookup,
	listsApiGetList,
	mcpApiLookup,
	productApiLookup,
	recommendationsApiLookup,
	redirectsApiLookup,
	socialApiLookup,
};

export * from './types';
