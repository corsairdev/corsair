import * as Accounts from './accounts';
import * as Company from './company';

export const AccountsEndpoints = {
	create: Accounts.create,
	get: Accounts.get,
	list: Accounts.list,
} as const;

export const CompanyEndpoints = {
	get: Company.get,
	list: Company.list,
} as const;
