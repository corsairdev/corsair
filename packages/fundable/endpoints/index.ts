import * as alerts from './alerts';
import * as companies from './companies';
import * as deals from './deals';
import * as filters from './filters';
import * as investors from './investors';
import * as people from './people';

export const Companies = {
	post: companies.post,
	get: companies.get,
	deals: companies.deals,
	search: companies.search,
};

export const Deals = {
	post: deals.post,
	get: deals.get,
	investors: deals.investors,
};

export const Investors = {
	post: investors.post,
	get: investors.get,
	deals: investors.deals,
	search: investors.search,
};

export const People = {
	post: people.post,
	get: people.get,
	email: people.email,
	phone: people.phone,
	deals: people.deals,
	search: people.search,
};

export const Filters = {
	locations: filters.locations,
	industries: filters.industries,
};

export const Alerts = {
	list: alerts.list,
	configurations: alerts.configurations,
};

export * from './types';
