import { defineOperation } from './call';

// List Search Parameters (GET /v2/{account_id}/linkedin/sales-navigator/search/parameters)
export const getSearchParameters = defineOperation(
	'salesNavigatorGetSearchParameters',
	'salesNavigator.getSearchParameters',
	{
		method: 'GET',
		path: '/v2/{account_id}/linkedin/sales-navigator/search/parameters',
		query: ['keywords', 'type', 'offset', 'limit'],
	},
);

// Perform Search from URL (POST /v2/{account_id}/linkedin/sales-navigator/search)
export const searchFromUrl = defineOperation(
	'salesNavigatorSearchFromUrl',
	'salesNavigator.searchFromUrl',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/sales-navigator/search',
		query: ['offset', 'limit'],
		body: ['url'],
	},
);

// Perform People Search (POST /v2/{account_id}/linkedin/sales-navigator/search/people)
export const searchPeople = defineOperation(
	'salesNavigatorSearchPeople',
	'salesNavigator.searchPeople',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/sales-navigator/search/people',
		query: ['offset', 'limit'],
		body: [
			'keywords',
			'save_search',
			'load_saved_search',
			'load_recent_search',
			'current_company',
			'past_company',
			'company_headcount',
			'company_type',
			'company_location',
			'function',
			'current_job_title',
			'past_job_title',
			'seniority',
			'years_in_company',
			'years_in_position',
			'location',
			'postal_code',
			'industry',
			'first_name',
			'last_name',
			'profile_language',
			'years_of_experience',
			'group',
			'school',
			'following_your_company',
			'viewed_your_profile_recently',
			'network_distance',
			'connections_of',
			'past_colleague',
			'shared_experiences',
			'changed_jobs',
			'posted_on_linkedin',
			'persona',
			'account_list',
			'lead_list',
			'recent_interaction',
			'saved_resources',
		],
	},
);

// Perform Companies Search (POST /v2/{account_id}/linkedin/sales-navigator/search/companies)
export const searchCompanies = defineOperation(
	'salesNavigatorSearchCompanies',
	'salesNavigator.searchCompanies',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/sales-navigator/search/companies',
		query: ['offset', 'limit'],
		body: [
			'keywords',
			'save_search',
			'load_saved_search',
			'load_recent_search',
			'annual_revenue',
			'headcount',
			'headcount_growth',
			'location',
			'postal_code',
			'industry',
			'followers',
			'department_headcount',
			'department_headcount_growth',
			'fortune',
			'spotlights',
			'saved_accounts',
			'account_list',
		],
	},
);

// Get Leads Lists (GET /v2/{account_id}/linkedin/sales-navigator/lead-lists)
export const listLeadLists = defineOperation(
	'salesNavigatorListLeadLists',
	'salesNavigator.listLeadLists',
	{
		method: 'GET',
		path: '/v2/{account_id}/linkedin/sales-navigator/lead-lists',
		query: ['offset', 'limit'],
	},
);

// Browse a Lead List (POST /v2/{account_id}/linkedin/sales-navigator/lead-lists/{list_id})
export const browseLeadList = defineOperation(
	'salesNavigatorBrowseLeadList',
	'salesNavigator.browseLeadList',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/sales-navigator/lead-lists/{list_id}',
		query: ['offset', 'limit'],
		body: ['spotlight', 'sort_by', 'sort_order'],
	},
);

// Save a Lead To a List (POST /v2/{account_id}/linkedin/sales-navigator/lead-lists/{list_id}/save)
export const saveLead = defineOperation(
	'salesNavigatorSaveLead',
	'salesNavigator.saveLead',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/sales-navigator/lead-lists/{list_id}/save',
		body: ['user_id'],
	},
);

// Get Accounts Lists (GET /v2/{account_id}/linkedin/sales-navigator/account-lists)
export const listAccountLists = defineOperation(
	'salesNavigatorListAccountLists',
	'salesNavigator.listAccountLists',
	{
		method: 'GET',
		path: '/v2/{account_id}/linkedin/sales-navigator/account-lists',
		query: ['offset', 'limit'],
	},
);

// Browse an Account List (POST /v2/{account_id}/linkedin/sales-navigator/account-lists/{list_id})
export const browseAccountList = defineOperation(
	'salesNavigatorBrowseAccountList',
	'salesNavigator.browseAccountList',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/sales-navigator/account-lists/{list_id}',
		query: ['offset', 'limit'],
		body: ['persona', 'filter', 'sort_by', 'sort_order'],
	},
);

// Save an Account To a List (POST /v2/{account_id}/linkedin/sales-navigator/account-lists/{list_id}/save)
export const saveAccount = defineOperation(
	'salesNavigatorSaveAccount',
	'salesNavigator.saveAccount',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/sales-navigator/account-lists/{list_id}/save',
		body: ['company_id'],
	},
);
