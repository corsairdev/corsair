import { defineOperation } from './call';

// Get InMail Credits (GET /v2/{account_id}/linkedin/inmail-credits)
export const getInmailCredits = defineOperation(
	'linkedinGetInmailCredits',
	'linkedin.getInmailCredits',
	{
		method: 'GET',
		path: '/v2/{account_id}/linkedin/inmail-credits',
		query: ['service'],
	},
);

// List Available Contracts (GET /v2/{account_id}/linkedin/contracts)
export const listContracts = defineOperation(
	'linkedinListContracts',
	'linkedin.listContracts',
	{ method: 'GET', path: '/v2/{account_id}/linkedin/contracts' },
);

// Select a Contract (POST /v2/{account_id}/linkedin/contracts/{contract_id}/select)
export const selectContract = defineOperation(
	'linkedinSelectContract',
	'linkedin.selectContract',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/contracts/{contract_id}/select',
	},
);

// List Profile Views (GET /v2/{account_id}/linkedin/analytics/profile-views)
export const listProfileViews = defineOperation(
	'linkedinListProfileViews',
	'linkedin.listProfileViews',
	{
		method: 'GET',
		path: '/v2/{account_id}/linkedin/analytics/profile-views',
		query: [
			'sort_by',
			'date_range',
			'industry',
			'company',
			'location',
			'details_sections',
			'offset',
			'limit',
		],
	},
);

// Get a Company Profile (GET /v2/{account_id}/linkedin/company/{company_id})
export const getCompany = defineOperation(
	'linkedinGetCompany',
	'linkedin.getCompany',
	{ method: 'GET', path: '/v2/{account_id}/linkedin/company/{company_id}' },
);

// List Managed Company Pages (GET /v2/{account_id}/linkedin/company/pages)
export const listManagedCompanyPages = defineOperation(
	'linkedinListManagedCompanyPages',
	'linkedin.listManagedCompanyPages',
	{ method: 'GET', path: '/v2/{account_id}/linkedin/company/pages' },
);

// Invite Members to Follow a Company (POST /v2/{account_id}/linkedin/company/{company_id}/follow-requests)
export const inviteToFollowCompany = defineOperation(
	'linkedinInviteToFollowCompany',
	'linkedin.inviteToFollowCompany',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/company/{company_id}/follow-requests',
		body: ['member_ids'],
	},
);

// Get Company Follow Request Credits (GET /v2/{account_id}/linkedin/company/{company_id}/follow-requests/credits)
export const getCompanyFollowCredits = defineOperation(
	'linkedinGetCompanyFollowCredits',
	'linkedin.getCompanyFollowCredits',
	{
		method: 'GET',
		path: '/v2/{account_id}/linkedin/company/{company_id}/follow-requests/credits',
	},
);

// Endorse a Member's Skill (POST /v2/{account_id}/linkedin/member/{member_id}/endorse-skill)
export const endorseSkill = defineOperation(
	'linkedinEndorseSkill',
	'linkedin.endorseSkill',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/member/{member_id}/endorse-skill',
		body: ['skill_id'],
	},
);

// Perform a Request to any LinkedIn API Endpoint (POST /v2/{account_id}/linkedin/)
export const request = defineOperation('linkedinRequest', 'linkedin.request', {
	method: 'POST',
	path: '/v2/{account_id}/linkedin/',
	body: [
		'url',
		'method',
		'body',
		'binary_body',
		'headers',
		'path_variables',
		'query_params',
		'bypass_url_encoding',
	],
});

// List Search Parameters (GET /v2/{account_id}/linkedin/search/parameters)
export const getSearchParameters = defineOperation(
	'linkedinGetSearchParameters',
	'linkedin.getSearchParameters',
	{
		method: 'GET',
		path: '/v2/{account_id}/linkedin/search/parameters',
		query: ['type', 'keywords', 'offset', 'limit'],
	},
);

// Perform Classic Search from URL (POST /v2/{account_id}/linkedin/search)
export const searchFromUrl = defineOperation(
	'linkedinSearchFromUrl',
	'linkedin.searchFromUrl',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/search',
		query: ['offset', 'limit', 'cursor'],
		body: ['url'],
	},
);

// Perform People Search (POST /v2/{account_id}/linkedin/search/people)
export const searchPeople = defineOperation(
	'linkedinSearchPeople',
	'linkedin.searchPeople',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/search/people',
		query: ['cursor'],
		body: [
			'keywords',
			'network_distance',
			'location',
			'current_company',
			'past_company',
			'school',
			'connections_of',
			'followers_of',
			'industry',
			'service',
			'profile_language',
			'open_to_volunteering',
			'advanced_keywords',
		],
	},
);

// Perform Companies Search (POST /v2/{account_id}/linkedin/search/companies)
export const searchCompanies = defineOperation(
	'linkedinSearchCompanies',
	'linkedin.searchCompanies',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/search/companies',
		query: ['cursor'],
		body: [
			'keywords',
			'location',
			'industry',
			'headcount',
			'has_job_postings',
			'is_employing_relations',
		],
	},
);

// Perform Posts Search (POST /v2/{account_id}/linkedin/search/posts)
export const searchPosts = defineOperation(
	'linkedinSearchPosts',
	'linkedin.searchPosts',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/search/posts',
		query: ['cursor', 'limit'],
		body: [
			'keywords',
			'sort_by',
			'date_posted',
			'content_type',
			'posted_by',
			'mentioning',
			'author',
		],
	},
);

// Perform Jobs Search (POST /v2/{account_id}/linkedin/search/jobs)
export const searchJobs = defineOperation(
	'linkedinSearchJobs',
	'linkedin.searchJobs',
	{
		method: 'POST',
		path: '/v2/{account_id}/linkedin/search/jobs',
		query: ['offset', 'limit'],
		body: [
			'keywords',
			'sort_by',
			'date_posted',
			'workplace_type',
			'seniority',
			'employment_status',
			'company',
			'primary_location',
			'location',
			'location_radius',
			'industry',
			'function',
			'job_title',
			'easy_apply',
			'has_verifications',
			'under_10_applicants',
			'in_your_network',
			'fair_chance_employer',
			'salary',
			'benefits',
			'commitments',
		],
	},
);
