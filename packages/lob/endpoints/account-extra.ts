import type { LobEndpoints } from '..';
import { segment } from '../client';
import { defineOp } from './call';
import { listQuery, omit } from './shared';

// Bank accounts (for checks), billing groups, and the extra verification
// surfaces: bulk international verification, reverse geocoding and identity
// validation.

export const bankAccountsCreate: LobEndpoints['bankAccountsCreate'] = defineOp(
	'bankAccountsCreate',
	'bankAccounts.create',
	(parsed) => ({ method: 'POST', path: '/bank_accounts', body: parsed }),
);

export const bankAccountsGet: LobEndpoints['bankAccountsGet'] = defineOp(
	'bankAccountsGet',
	'bankAccounts.get',
	({ id }) => ({ method: 'GET', path: `/bank_accounts/${segment(id)}` }),
);

export const bankAccountsList: LobEndpoints['bankAccountsList'] = defineOp(
	'bankAccountsList',
	'bankAccounts.list',
	(parsed) => ({
		method: 'GET',
		path: '/bank_accounts',
		query: listQuery(parsed),
	}),
);

export const bankAccountsDelete: LobEndpoints['bankAccountsDelete'] = defineOp(
	'bankAccountsDelete',
	'bankAccounts.delete',
	({ id }) => ({ method: 'DELETE', path: `/bank_accounts/${segment(id)}` }),
);

// Confirms the micro-deposits Lob sent; checks need a verified account.
export const bankAccountsVerify: LobEndpoints['bankAccountsVerify'] = defineOp(
	'bankAccountsVerify',
	'bankAccounts.verify',
	(parsed) => ({
		method: 'POST',
		path: `/bank_accounts/${segment(parsed.id)}/verify`,
		body: omit(parsed, 'id'),
	}),
);

// ── billing groups ────────────────────────────────────────────────────────

export const billingGroupsCreate: LobEndpoints['billingGroupsCreate'] =
	defineOp('billingGroupsCreate', 'billingGroups.create', (parsed) => ({
		method: 'POST',
		path: '/billing_groups',
		body: parsed,
	}));

export const billingGroupsGet: LobEndpoints['billingGroupsGet'] = defineOp(
	'billingGroupsGet',
	'billingGroups.get',
	({ id }) => ({ method: 'GET', path: `/billing_groups/${segment(id)}` }),
);

export const billingGroupsList: LobEndpoints['billingGroupsList'] = defineOp(
	'billingGroupsList',
	'billingGroups.list',
	(parsed) => ({
		method: 'GET',
		path: '/billing_groups',
		query: listQuery(parsed),
	}),
);

// Lob updates billing groups with POST, not PATCH.
export const billingGroupsUpdate: LobEndpoints['billingGroupsUpdate'] =
	defineOp('billingGroupsUpdate', 'billingGroups.update', (parsed) => ({
		method: 'POST',
		path: `/billing_groups/${segment(parsed.id)}`,
		body: omit(parsed, 'id'),
	}));

// ── extra verifications ───────────────────────────────────────────────────

export const intlVerificationsBulk: LobEndpoints['intlVerificationsBulk'] =
	defineOp('intlVerificationsBulk', 'intlVerifications.bulk', (parsed) => ({
		method: 'POST',
		path: '/bulk/intl_verifications',
		body: parsed,
	}));

export const reverseGeocodeLookup: LobEndpoints['reverseGeocodeLookup'] =
	defineOp(
		'reverseGeocodeLookup',
		'reverseGeocode.lookup',
		({ latitude, longitude, size }) => ({
			method: 'POST',
			path: '/us_reverse_geocode_lookups',
			body: { latitude, longitude },
			query: { size },
		}),
	);

export const identityValidationValidate: LobEndpoints['identityValidationValidate'] =
	defineOp(
		'identityValidationValidate',
		'identityValidation.validate',
		(parsed) => ({
			method: 'POST',
			path: '/identity_validation',
			body: parsed,
		}),
	);
