import { createEndpoint } from './factory';

// ─── /me/organizations ───────────────────────────────────────────────────────
export const listOrganizationsEndpoint = createEndpoint('listOrganizations', {
	path: () => '/me/organizations',
});

// ─── /organizations/{id} ─────────────────────────────────────────────────────
export const getOrganizationEndpoint = createEndpoint('getOrganization', {
	path: (input) => `/organizations/${String(input.organization_id)}`,
});

// ─── /organizations/{id}/members ─────────────────────────────────────────────
export const listMembersEndpoint = createEndpoint('listMembers', {
	path: (input) => `/organizations/${String(input.organization_id)}/members`,
});

export const getMemberEndpoint = createEndpoint('getMember', {
	path: (input) => `/members/${String(input.member_id)}`,
});

export const deleteMemberEndpoint = createEndpoint('deleteMember', {
	method: 'DELETE',
	path: (input) => `/members/${String(input.member_id)}`,
	body: () => undefined,
});

// ─── Org Roles ────────────────────────────────────────────────────────────────
export const createOrgRoleEndpoint = createEndpoint('createOrgRole', {
	method: 'POST',
	path: (input) => `/organizations/${String(input.organization_id)}/roles`,
	body: (input) => ({ roles: input.roles }),
});

export const listOrgRolesEndpoint = createEndpoint('listOrgRoles', {
	path: (input) => `/organizations/${String(input.organization_id)}/roles`,
});

export const deleteRoleEndpoint = createEndpoint('deleteRole', {
	method: 'DELETE',
	path: (input) => `/roles/${String(input.role_id)}`,
	body: () => undefined,
});

// ─── Org Pixels ──────────────────────────────────────────────────────────────
export const listOrgPixelsEndpoint = createEndpoint('listOrgPixels', {
	path: (input) => `/organizations/${String(input.organization_id)}/pixels`,
});

// ─── Billing Centers ─────────────────────────────────────────────────────────
export const listBillingCentersEndpoint = createEndpoint('listBillingCenters', {
	path: (input) =>
		`/organizations/${String(input.organization_id)}/billingcenters`,
});

export const createBillingCenterEndpoint = createEndpoint(
	'createBillingCenter',
	{
		method: 'POST',
		path: (input) =>
			`/organizations/${String(input.organization_id)}/billingcenters`,
		body: (input) => ({ billingcenters: input.billingcenters }),
	},
);

export const getBillingCenterEndpoint = createEndpoint('getBillingCenter', {
	path: (input) => `/billingcenters/${String(input.billing_center_id)}`,
});

export const updateBillingCenterEndpoint = createEndpoint(
	'updateBillingCenter',
	{
		method: 'PUT',
		path: (input) =>
			`/organizations/${String(input.organization_id)}/billingcenters`,
		body: (input) => ({ billingcenters: input.billingcenters }),
	},
);

// ─── Funding Sources ─────────────────────────────────────────────────────────
export const listFundingSourcesEndpoint = createEndpoint('listFundingSources', {
	path: (input) =>
		`/organizations/${String(input.organization_id)}/fundingsources`,
});

export const getFundingSourceEndpoint = createEndpoint('getFundingSource', {
	path: (input) => `/fundingsources/${String(input.funding_source_id)}`,
});

// ─── Transactions ─────────────────────────────────────────────────────────────
export const listTransactionsEndpoint = createEndpoint('listTransactions', {
	path: (input) =>
		`/organizations/${String(input.organization_id)}/transactions`,
	query: (input) => ({
		start_time: input.start_time as string | undefined,
		end_time: input.end_time as string | undefined,
		ad_account_id: input.ad_account_id as string | undefined,
	}),
});

// ─── Mobile Apps (org) ────────────────────────────────────────────────────────
export const getOrganizationsMobileAppsEndpoint = createEndpoint(
	'getOrganizationsMobileApps',
	{
		path: (input) =>
			`/organizations/${String(input.organization_id)}/mobile_apps`,
	},
);

// ─── Public Profiles ─────────────────────────────────────────────────────────
export const getOrganizationsPublicProfilesEndpoint = createEndpoint(
	'getOrganizationsPublicProfiles',
	{
		path: (input) =>
			`/organizations/${String(input.organization_id)}/public_profiles`,
	},
);

// ─── Member Roles ─────────────────────────────────────────────────────────────
export const listMemberRolesEndpoint = createEndpoint('listMemberRoles', {
	path: (input) => `/members/${String(input.member_id)}/roles`,
});

// ─── Phone Numbers ────────────────────────────────────────────────────────────
export const listPhoneNumbersEndpoint = createEndpoint('listPhoneNumbers', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/phone_numbers`,
});
