// Single source of the path templates the cloud client + management namespace use.
// Kept in sync with contract.openapi.yaml by tests/cloud/contract.test.ts.
export const CLOUD_ROUTES = {
	invoke: '/:tenant/:plugin/call/:op',
	connectLinks: '/connect/links',
	tenants: '/tenants',
	tenant: '/tenants/:id',
	connectionStatus: '/connection-status',
	disconnect: '/disconnect',
} as const;
