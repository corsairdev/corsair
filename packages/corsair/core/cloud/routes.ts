// Single source of the path templates the cloud client + management namespace use.
// Kept in sync with contract.openapi.yaml by tests/cloud/contract.test.ts.
export const CLOUD_ROUTES = {
	invoke: '/:tenant/:plugin/call/:op',
	// Project-root relative (sibling of /api/corsair, NOT under it): the SDK
	// appends this to the base URL minus /api/corsair. Every other route here is
	// /api/corsair-relative. Returns { instances: [{ instanceKey, url }] }.
	instances: '/instances',
	connectLinks: '/connect/links',
	tenants: '/tenants',
	tenant: '/tenants/:id',
	connectionStatus: '/connection-status',
	disconnect: '/disconnect',
	permission: '/permissions/:id',
	permissionLookup: '/permissions/lookup-by-token',
} as const;
