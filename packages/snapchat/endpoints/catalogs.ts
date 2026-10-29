import { createEndpoint } from './factory';

// ─── Catalogs (org-level) ─────────────────────────────────────────────────────
export const getOrganizationsCatalogsEndpoint = createEndpoint(
	'getOrganizationsCatalogs',
	{
		path: (input) => `/organizations/${String(input.organization_id)}/catalogs`,
	},
);

export const createOrganizationsCatalogsEndpoint = createEndpoint(
	'createOrganizationsCatalogs',
	{
		method: 'POST',
		path: (input) => `/organizations/${String(input.organization_id)}/catalogs`,
		body: (input) => ({ catalogs: input.catalogs }),
	},
);

// ─── Catalog ──────────────────────────────────────────────────────────────────
export const getCatalogsEndpoint = createEndpoint('getCatalogs', {
	path: (input) => `/catalogs/${String(input.catalog_id)}`,
});

export const deleteCatalogsEndpoint = createEndpoint('deleteCatalogs', {
	method: 'DELETE',
	path: (input) => `/catalogs/${String(input.catalog_id)}`,
	body: () => undefined,
});

// ─── Catalog Product Sets ─────────────────────────────────────────────────────
export const getCatalogsProductSetsEndpoint = createEndpoint(
	'getCatalogsProductSets',
	{
		path: (input) => `/catalogs/${String(input.catalog_id)}/product_sets`,
	},
);

export const createCatalogsProductSetsEndpoint = createEndpoint(
	'createCatalogsProductSets',
	{
		method: 'POST',
		path: (input) => `/catalogs/${String(input.catalog_id)}/product_sets`,
		body: (input) => ({
			name: input.name,
			...(input.filter ? { filter: input.filter } : {}),
		}),
	},
);

export const getProductSetsEndpoint = createEndpoint('getProductSets', {
	path: (input) => `/product_sets/${String(input.id)}`,
});

// ─── Catalog Roles ────────────────────────────────────────────────────────────
export const listCatalogRolesEndpoint = createEndpoint('listCatalogRoles', {
	path: (input) => `/catalogs/${String(input.catalog_id)}/roles`,
});

export const createCatalogRoleEndpoint = createEndpoint('createCatalogRole', {
	method: 'POST',
	path: (input) => `/catalogs/${String(input.catalog_id)}/roles`,
	body: (input) => ({ roles: input.roles }),
});

// ─── Catalog Facets ───────────────────────────────────────────────────────────
export const createCatalogsFacetsEndpoint = createEndpoint(
	'createCatalogsFacets',
	{
		method: 'POST',
		path: (input) => `/catalogs/${String(input.catalog_id)}/facets`,
		body: (input) => ({ facets: input.facets }),
	},
);

// ─── Product Feeds ────────────────────────────────────────────────────────────
export const createCatalogsProductFeedsEndpoint = createEndpoint(
	'createCatalogsProductFeeds',
	{
		method: 'POST',
		path: (input) => `/catalogs/${String(input.catalog_id)}/product_feeds`,
		body: (input) => ({
			name: input.name,
			default_currency: input.default_currency,
		}),
	},
);

export const getProductFeedsEndpoint = createEndpoint('getProductFeeds', {
	path: (input) => `/product_feeds/${String(input.product_feed_id)}`,
});

export const deleteProductFeedsEndpoint = createEndpoint('deleteProductFeeds', {
	method: 'DELETE',
	path: (input) => `/product_feeds/${String(input.product_feed_id)}`,
	body: () => undefined,
});

export const getProductFeedsFeedUploadsEndpoint = createEndpoint(
	'getProductFeedsFeedUploads',
	{
		path: (input) =>
			`/product_feeds/${String(input.product_feed_id)}/feed_uploads`,
	},
);

// ─── Search ───────────────────────────────────────────────────────────────────
export const createCatalogsFlightsSearchEndpoint = createEndpoint(
	'createCatalogsFlightsSearch',
	{
		method: 'POST',
		path: (input) => `/catalogs/${String(input.catalog_id)}/flights/search`,
		body: (input) => {
			const { catalog_id: _, ...rest } = input as Record<string, unknown>;
			return rest;
		},
	},
);

export const searchCatalogProductsEndpoint = createEndpoint(
	'searchCatalogProducts',
	{
		method: 'POST',
		path: (input) => `/catalogs/${String(input.catalog_id)}/products/search`,
		body: (input) => {
			const { catalog_id: _, ...rest } = input as Record<string, unknown>;
			return rest;
		},
	},
);

export const searchCatalogsHotelsEndpoint = createEndpoint(
	'searchCatalogsHotels',
	{
		method: 'POST',
		path: (input) => `/catalogs/${String(input.catalog_id)}/hotels/search`,
		body: (input) => {
			const { catalog_id: _, ...rest } = input as Record<string, unknown>;
			return rest;
		},
	},
);

// ─── Dynamic Templates ────────────────────────────────────────────────────────
export const getDynamicTemplateEndpoint = createEndpoint('getDynamicTemplate', {
	path: (input) => `/dynamic_templates/${String(input.id)}`,
});

export const getDynamicTemplatesExternalChangelogsEndpoint = createEndpoint(
	'getDynamicTemplatesExternalChangelogs',
	{
		path: (input) =>
			`/dynamic_templates/${String(input.dynamic_template_id)}/changelog`,
	},
);
