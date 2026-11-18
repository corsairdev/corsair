import * as Accounts from './accounts';
import { QuickBooksCatalogEndpoints } from './catalog';
import * as Company from './company';
import { QuickBooksSpecialEndpoints } from './special';

const {
	accounts: CatalogAccounts,
	company: CatalogCompany,
	...CatalogResourceEndpoints
} = QuickBooksCatalogEndpoints;

export const AccountsEndpoints = {
	create: Accounts.create,
	get: Accounts.get,
	list: Accounts.list,
	...CatalogAccounts,
} as const;

export const CompanyEndpoints = {
	get: Company.get,
	list: Company.list,
	...CatalogCompany,
} as const;

export const CatalogEndpoints = {
	...CatalogResourceEndpoints,
	...QuickBooksSpecialEndpoints,
} as const;
