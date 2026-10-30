import { z } from 'zod';
import { AccountId, UnknownJson } from './shared';

// Generated from the per-operation OpenAPI definitions in Unipile's v2
// reference (API 2.62). Inputs follow the spec field for field; outputs
// type two levels of each response and pass the rest through.

const SalesNavigatorListLeadListsShape1 = z
	.object({
		data: z.array(
			z
				.object({
					type: z.string(),
					id: z.string(),
					name: z.string(),
					description: z.string().nullish(),
					items_count: z.number(),
					last_modified_at: z.string(),
					last_viewed_at: z.string().nullish(),
				})
				.loose(),
		),
		total_count: z
			.number()
			.nullish()
			.describe('Total number of results if supported by the provider.'),
		next_cursor: z
			.string()
			.nullish()
			.describe(
				'Cursor to get the next page of results if supported. Else use `offset`.',
			),
	})
	.loose();

const LinkedinSearchFromUrlShape2 = z
	.object({
		object: z.string(),
		id: z.string(),
		member_id: z.string().nullish(),
		display_name: z.string(),
		public_identifier: z.string().nullish(),
		profile_url: z.string().nullish(),
		public_picture_url: z.string().nullish(),
		public_picture_url_large: z.string().nullish(),
		relations_count: z.number().nullish(),
		location: z.string().nullish(),
		headline: z.string().nullish(),
		network_distance: z.string(),
		can_send_inmail: z.boolean().nullish(),
		product: z.string(),
		followers_count: z.number().nullish(),
		industry: z.string().nullish(),
		is_verified: z.boolean().nullish(),
		keywords_match: z.string().nullish(),
		is_premium: z.boolean().nullish(),
		is_open_profile: z.boolean().nullish(),
		shared_relations_count: z.number().nullish(),
		website_url: z.string().nullish(),
		portfolio_url: z.string().nullish(),
		services_page_url: z.string().nullish(),
	})
	.loose();

const SalesNavigatorSearchFromUrlShape3 = z
	.object({
		object: z.string(),
		id: z.string(),
		member_id: z.string().nullish(),
		display_name: z.string(),
		public_identifier: z.string().nullish(),
		profile_url: z.string().nullish(),
		public_picture_url: z.string().nullish(),
		public_picture_url_large: z.string().nullish(),
		relations_count: z.number().nullish(),
		location: z.string().nullish(),
		headline: z.string().nullish(),
		network_distance: z.string(),
		can_send_inmail: z.boolean().nullish(),
		product: z.string(),
		shared_relations_count: z.number().nullish(),
		summary: z.string().nullish(),
		has_been_viewed: z.boolean(),
		has_been_saved: z.boolean(),
		has_posted_recently: z.boolean(),
		has_viewed_your_profile: z.boolean(),
		was_hired_recently: z.boolean(),
		was_promoted_recently: z.boolean(),
		follows_your_company: z.boolean(),
		is_premium: z.boolean(),
		is_past_colleague: z.boolean(),
		is_open_profile: z.boolean(),
		websites: z.array(z.string()).nullish(),
		addresses: z.array(z.string()).nullish(),
		contact_info: z.record(z.string(), z.unknown()),
		latest_contact: z.record(z.string(), z.unknown()).nullish(),
		lists_count: z.number(),
		notes_count: z.number(),
		social_handles: z.record(z.string(), z.unknown()).nullish(),
		industry: z.string().nullish(),
		education: z.array(z.unknown()),
		skills: z.array(z.unknown()),
		work_experience: z.array(z.unknown()),
		languages: z.array(z.unknown()),
		volunteering: z.array(z.unknown()),
	})
	.loose();

export const LinkedinInputSchemas = {
	linkedinGetInmailCredits: z.object({
		account_id: AccountId,
		service: z.enum(['classic', 'recruiter', 'sales_navigator']).optional(),
	}),
	linkedinListContracts: z.object({ account_id: AccountId }),
	linkedinSelectContract: z.object({
		contract_id: z
			.string()
			.min(1)
			.describe('The ID of the contract to be activated on the account.'),
		account_id: AccountId,
	}),
	linkedinListProfileViews: z.object({
		account_id: AccountId,
		sort_by: z.enum(['DATE', 'RELEVANCE']).optional(),
		date_range: z.number().optional(),
		industry: z.array(z.string()).optional(),
		company: z.array(z.string()).optional(),
		location: z.array(z.string()).optional(),
		details_sections: z
			.array(z.enum(['COMPANIES', 'INDUSTRIES', 'LOCATIONS']))
			.optional(),
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
	}),
	linkedinGetCompany: z.object({
		company_id: z
			.string()
			.min(1)
			.describe('The ID of the company to retrieve the profile of.'),
		account_id: AccountId,
	}),
	linkedinListManagedCompanyPages: z.object({ account_id: AccountId }),
	linkedinInviteToFollowCompany: z.object({
		company_id: z
			.string()
			.min(1)
			.describe(
				'The numeric LinkedIn company ID. The owner of the account must be an administrator of the page.',
			),
		account_id: AccountId,
		member_ids: z
			.array(z.string())
			.min(1)
			.describe(
				'A list of member profile IDs (ACo...) identifying the members to invite to follow the company page.',
			),
	}),
	linkedinGetCompanyFollowCredits: z.object({
		company_id: z
			.string()
			.min(1)
			.describe(
				'The numeric LinkedIn company ID. The owner of the account must be an administrator of the page.',
			),
		account_id: AccountId,
	}),
	linkedinEndorseSkill: z.object({
		member_id: z
			.string()
			.min(1)
			.describe('The ID of the member for which to endorse the skill.'),
		account_id: AccountId,
		skill_id: z
			.string()
			.describe(
				'The endorsement ID for the selected skill. Use Get a User Profile with `linkedin_skills` in param `with_sections` to retrieve the skills you can endorse for the given member.',
			),
	}),
	linkedinRequest: z.object({
		account_id: AccountId,
		url: z
			.string()
			.describe(
				'The specific LinkedIn public API endpoint you need to call. Path variables can be declared with the `:VARIABLE_NAME` syntax.',
			),
		method: z
			.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
			.describe('The HTTP method to use when performing the request.'),
		body: z
			.record(z.string(), z.unknown())
			.optional()
			.describe('A body object to send in the request.'),
		binary_body: z
			.string()
			.optional()
			.describe(
				'Binary content in base64 to be sent with POST/PUT/PATCH requests. Overrides `body` param.',
			),
		headers: z
			.record(z.string(), z.string().nullable())
			.optional()
			.describe(
				'A headers object to include in the request. Null value may be used in order to remove a specific header from the default set.',
			),
		path_variables: z
			.record(z.string(), z.string())
			.optional()
			.describe(
				'The Path variables that have been declared in the URL. Each variable must have a corresponding VARIABLE_NAME key to be injected in the URL.',
			),
		query_params: z
			.record(z.string(), z.string())
			.optional()
			.describe('Query parameters to include in the request URL.'),
		bypass_url_encoding: z
			.boolean()
			.optional()
			.describe(
				'Whether to bypass URL encoding for query parameters or form-urlencoded body, so you can handle encoding yourself.',
			),
	}),
	linkedinGetSearchParameters: z.object({
		account_id: AccountId,
		type: z.enum([
			'LOCATION',
			'COMPANY',
			'RELATION',
			'PEOPLE',
			'SCHOOL',
			'INDUSTRY',
			'SERVICE',
			'JOB_FUNCTION',
			'JOB_TITLE',
			'EMPLOYMENT_TYPE',
			'SKILL',
		]),
		keywords: z.string(),
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
	}),
	linkedinSearchFromUrl: z.object({
		account_id: AccountId,
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
		cursor: z.string().optional(),
		url: z.string().describe('The URL to perform the search from.'),
	}),
	linkedinSearchPeople: z.object({
		account_id: AccountId,
		cursor: z.string().optional(),
		keywords: z.string().optional().describe('A keyword or group of keywords.'),
		network_distance: z
			.array(z.number())
			.optional()
			.describe(
				'A list of connection degrees (1 for First, 2 for Second and 3 for Third+). Native filter : Connections',
			),
		location: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `LOCATION` type to find out the possible values. Native filter : Locations',
			),
		current_company: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `COMPANY` type to find out the possible values. Native filter : Current company',
			),
		past_company: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `COMPANY` type to find out the possible values. Native filter : Past company',
			),
		school: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `SCHOOL` type to find out the possible values. Native filter : School',
			),
		connections_of: z
			.string()
			.optional()
			.describe(
				'A parameter ID. Use List Search Parameters with `RELATION` type to find out the possible values. Native filter : Connections of',
			),
		followers_of: z
			.string()
			.optional()
			.describe(
				'A parameter ID. Use List Search Parameters with `PEOPLE` type to find out the possible values. Native filter : Followers of',
			),
		industry: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `INDUSTRY` type to find out the possible values. Native filter : Industry',
			),
		service: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `SERVICE` type to find out the possible values. Native filter : Service categories',
			),
		profile_language: z
			.array(z.string().min(2).max(2))
			.optional()
			.describe(
				'A list of ISO 639-1 language codes. Native filter : Profile language',
			),
		open_to_volunteering: z
			.boolean()
			.optional()
			.describe(
				'Whether the users should be open to volunteering. Native filter : Open to Volunteering',
			),
		advanced_keywords: z
			.object({
				first_name: z
					.string()
					.optional()
					.describe('Native filter : First name'),
				last_name: z.string().optional().describe('Native filter : Last name'),
				title: z.string().optional().describe('Native filter : Title'),
				company: z.string().optional().describe('Native filter : Company'),
				school: z.string().optional().describe('Native filter : School'),
			})
			.loose()
			.optional()
			.describe(
				'A set of advanced keywords based filters. Native filter : Keywords',
			),
	}),
	linkedinSearchCompanies: z.object({
		account_id: AccountId,
		cursor: z.string().optional(),
		keywords: z.string().optional().describe('A keyword or group of keywords.'),
		location: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `LOCATION` type to find out the possible values. Native filter : Locations',
			),
		industry: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `INDUSTRY` type to find out the possible values. Native filter : Industry',
			),
		headcount: z
			.array(
				z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.loose(),
			)
			.optional()
			.describe('A list of company headcount ranges.'),
		has_job_postings: z
			.boolean()
			.optional()
			.describe(
				'Whether the companies should have active job postings on LinkedIn. Native filter : Job listings on LinkedIn',
			),
		is_employing_relations: z
			.boolean()
			.optional()
			.describe(
				'Whether the companies should have first degree relations among employees. Native filter : Relations',
			),
	}),
	linkedinSearchPosts: z.object({
		account_id: AccountId,
		cursor: z.string().optional(),
		limit: z.number().min(1).max(49).optional(),
		keywords: z.string().optional().describe('A keyword or group of keywords.'),
		sort_by: z
			.enum(['RELEVANCE', 'DATE'])
			.optional()
			.describe('The sort method. Native filter : Sort by'),
		date_posted: z
			.enum(['PAST_DAY', 'PAST_WEEK', 'PAST_MONTH'])
			.optional()
			.describe(
				'The time period when the posts should have been published. Native filter : Date posted',
			),
		content_type: z
			.enum([
				'VIDEOS',
				'IMAGES',
				'JOB_POSTS',
				'LIVE_VIDEOS',
				'DOCUMENTS',
				'COLLABORATIVE_ARTICLES',
			])
			.optional()
			.describe(
				'Any media or non text-only resource that should be included in the posts. Native filter : Content type',
			),
		posted_by: z
			.object({
				member: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `PEOPLE` type to find out the possible values. Native filter : From member',
					),
				company: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `COMPANY` type to find out the possible values. Native filter : From company',
					),
				me: z
					.boolean()
					.optional()
					.describe(
						'Whether the posts should have been published by yourself. Native filter : Posted by [Me]',
					),
				relations: z
					.boolean()
					.optional()
					.describe(
						'Whether the posts should have been published by your relations. Native filter : Posted by [1st connections]',
					),
				people_you_follow: z
					.boolean()
					.optional()
					.describe(
						'Whether the posts should have been published by users you follow. Native filter : Posted by [People you follow]',
					),
			})
			.loose()
			.optional()
			.describe('The users/companies who published the posts.'),
		mentioning: z
			.object({
				member: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `PEOPLE` type to find out the possible values. Native filter : Mentioning member',
					),
				company: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `COMPANY` type to find out the possible values. Native filter : Mentioning company',
					),
			})
			.loose()
			.optional()
			.describe('The users/companies mentionned in the posts.'),
		author: z
			.object({
				keywords: z
					.string()
					.optional()
					.describe('Native filter : Author keywords'),
				company: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `COMPANY` type to find out the possible values. Native filter : Author company',
					),
				industry: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `INDUSTRY` type to find out the possible values. Native filter : Author industry',
					),
			})
			.loose()
			.optional()
			.describe('Advanced filters on post authors.'),
	}),
	linkedinSearchJobs: z.object({
		account_id: AccountId,
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
		keywords: z.string().optional().describe('A keyword or group of keywords.'),
		sort_by: z
			.enum(['RELEVANCE', 'DATE'])
			.optional()
			.describe('The sort method. Native filter : Sort by'),
		date_posted: z
			.enum(['PAST_DAY', 'PAST_WEEK', 'PAST_MONTH'])
			.optional()
			.describe(
				'The time period when the jobs should have been published. Native filter : Date posted',
			),
		workplace_type: z
			.array(z.enum(['ON_SITE', 'REMOTE', 'HYBRID']))
			.optional()
			.describe('A list of workplace types. Native filter : Remote'),
		seniority: z
			.array(
				z.enum([
					'INTERNSHIP',
					'ENTRY_LEVEL',
					'ASSOCIATE',
					'MID_SENIOR_LEVEL',
					'DIRECTOR',
					'EXECUTIVE',
				]),
			)
			.optional()
			.describe(
				'A list of experience levels required by the jobs. Native filter : Experience level',
			),
		employment_status: z
			.array(
				z.enum([
					'FULL_TIME',
					'PART_TIME',
					'CONTRACT',
					'TEMPORARY',
					'VOLUNTEER',
					'INTERNSHIP',
					'OTHER',
				]),
			)
			.optional()
			.describe('A list of employment statuses. Native filter : Job type'),
		company: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `COMPANY` type to find out the possible values. Native filter : Company',
			),
		primary_location: z
			.string()
			.optional()
			.describe(
				'A parameter ID. Use List Search Parameters with `LOCATION` type to find out the possible values. Native filter : Primary location',
			),
		location: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `LOCATION` type to find out the possible values. Native filter : Location',
			),
		location_radius: z
			.number()
			.optional()
			.describe(
				'The distance radius around the location in kilometers. Native filter : Distance',
			),
		industry: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `INDUSTRY` type to find out the possible values. Native filter : Industry',
			),
		function: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `JOB_FUNCTION` type to find out the possible values. Native filter : Job function',
			),
		job_title: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `JOB_TITLE` type to find out the possible values. Native filter : Job title',
			),
		easy_apply: z
			.boolean()
			.optional()
			.describe(
				'Whether the application can me made directly on LinkedIn. Native filter : Easy apply',
			),
		has_verifications: z
			.boolean()
			.optional()
			.describe(
				'Whether the jobs have a verification badge. Native filter : Has verifications',
			),
		under_10_applicants: z
			.boolean()
			.optional()
			.describe(
				"Whether the jobs didn't receive more than 10 applications. Native filter : Under 10 applicants",
			),
		in_your_network: z
			.boolean()
			.optional()
			.describe(
				'Whether the jobs have been published by relations of you. Native filter : In your network',
			),
		fair_chance_employer: z
			.boolean()
			.optional()
			.describe(
				'Whether the jobs accept applicants with criminal records. Native filter : Fair chance employer',
			),
		salary: z
			.union([
				z
					.object({
						currency: z.enum(['USD']),
						starting_from: z.number().describe('The minimum amount.'),
					})
					.loose(),
				z
					.object({
						currency: z.enum(['AUD']),
						starting_from: z.number().describe('The minimum amount.'),
					})
					.loose(),
				z
					.object({
						currency: z.enum(['GBP']),
						starting_from: z.number().describe('The minimum amount.'),
					})
					.loose(),
			])
			.optional()
			.describe('The minimum salary. Native filter : Salary'),
		benefits: z
			.array(
				z.enum([
					'MEDICAL_INSURANCE',
					'VISION_INSURANCE',
					'DENTAL_INSURANCE',
					'DISABILITY_INSURANCE',
					'401(K)',
					'PENSION_PLAN',
					'PAID_MATERNITY_LEAVE',
					'PAID_PATERNITY_LEAVE',
					'COMMUTER_BENEFITS',
					'STUDENT_LOAN_ASSISTANCE',
					'TUITION_ASSISTANCE',
				]),
			)
			.optional()
			.describe('A list of benefits.'),
		commitments: z
			.array(
				z.enum([
					'CAREER_GROWTH_AND_LEARNING',
					'DIVERSITY_EQUITY_AND_INCLUSION',
					'ENVIRONMENTAL_SUSTAINABILITY',
					'SOCIAL_IMPACT',
					'WORK_LIFE_BALANCE',
				]),
			)
			.optional()
			.describe('A list of commitments.'),
	}),
	salesNavigatorGetSearchParameters: z.object({
		account_id: AccountId,
		keywords: z.string().optional(),
		type: z.enum([
			'COMPANY',
			'ACCOUNT_LIST',
			'LEAD_LIST',
			'LOCATION',
			'POSTAL_CODE',
			'JOB_FUNCTION',
			'JOB_TITLE',
			'INDUSTRY',
			'GROUP',
			'SCHOOL',
			'RELATION',
			'PERSONA',
			'SAVED_PEOPLE_SEARCH',
			'SAVED_COMPANY_SEARCH',
			'RECENT_SEARCH',
			'PROFILE_LANGUAGE',
		]),
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
	}),
	salesNavigatorSearchFromUrl: z.object({
		account_id: AccountId,
		offset: z.number().optional(),
		limit: z.number().min(1).max(50).optional(),
		url: z.string().describe('The URL to perform the search from.'),
	}),
	salesNavigatorSearchPeople: z.object({
		account_id: AccountId,
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
		keywords: z.string().optional().describe('A keyword or group of keywords.'),
		save_search: z
			.object({ name: z.string().describe('A name to identify the search.') })
			.loose()
			.optional()
			.describe('Allows you to save the current search.'),
		load_saved_search: z
			.object({
				id: z
					.string()
					.describe(
						'A parameter ID. Use List Search Parameters with `SAVED_PEOPLE_SEARCH` type to find out the possible values. Native filter : Saved search',
					),
				last_viewed_at: z
					.number()
					.optional()
					.describe(
						'A Unix timestamp indicating the last time the search results were accessed, to be used to retrieve only the new results.',
					),
			})
			.loose()
			.optional()
			.describe('Saved search to be loaded. Overrides all other filters.'),
		load_recent_search: z
			.object({
				id: z
					.string()
					.describe(
						'A parameter ID. Use List Search Parameters with `RECENT_SEARCH` type to find out the possible values. Native filter : Recent search',
					),
			})
			.loose()
			.optional()
			.describe('Recent search to be loaded. Overrides all other filters.'),
		current_company: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `COMPANY or ACCOUNT_LIST` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `COMPANY or ACCOUNT_LIST` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe(
				'You can also use company names in plain text format. Native filter : Company / Current company',
			),
		past_company: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `COMPANY or ACCOUNT_LIST` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `COMPANY or ACCOUNT_LIST` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe(
				'You can also use company names in plain text format. Native filter : Company / Past company',
			),
		company_headcount: z
			.array(
				z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.loose(),
			)
			.optional()
			.describe('A list of headcount ranges.'),
		company_type: z
			.array(
				z.enum([
					'PUBLIC_COMPANY',
					'PRIVATELY_HELD',
					'NON_PROFIT',
					'EDUCATIONAL_INSTITUTION',
					'PARTNERSHIP',
					'SELF_EMPLOYED',
					'SELF_OWNED',
					'GOVERNMENT_AGENCY',
				]),
			)
			.optional()
			.describe('A list of company types.'),
		company_location: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `LOCATION` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `LOCATION` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Company / Company headquarters location'),
		function: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `JOB_FUNCTION` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `JOB_FUNCTION` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Role / Function'),
		current_job_title: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `JOB_TITLE` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `JOB_TITLE` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe(
				'You can also use job titles in plain text format. Native filter : Role / Current job title',
			),
		past_job_title: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `JOB_TITLE` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `JOB_TITLE` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe(
				'You can also use job titles in plain text format. Native filter : Role / Past job title',
			),
		seniority: z
			.object({
				include: z
					.array(
						z.enum([
							'OWNER/PARTNER',
							'CXO',
							'VICE_PRESIDENT',
							'DIRECTOR',
							'EXPERIENCED_MANAGER',
							'ENTRY_LEVEL_MANAGER',
							'STRATEGIC',
							'SENIOR',
							'ENTRY_LEVEL',
							'IN_TRAINING',
						]),
					)
					.optional(),
				exclude: z
					.array(
						z.enum([
							'OWNER/PARTNER',
							'CXO',
							'VICE_PRESIDENT',
							'DIRECTOR',
							'EXPERIENCED_MANAGER',
							'ENTRY_LEVEL_MANAGER',
							'STRATEGIC',
							'SENIOR',
							'ENTRY_LEVEL',
							'IN_TRAINING',
						]),
					)
					.optional(),
			})
			.loose()
			.optional()
			.describe('Native filter : Role / Seniority level'),
		years_in_company: z
			.array(
				z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.loose(),
			)
			.optional()
			.describe('A list of years ranges.'),
		years_in_position: z
			.array(
				z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.loose(),
			)
			.optional()
			.describe('A list of years ranges.'),
		location: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `LOCATION` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `LOCATION` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Personal / Geography / Region'),
		postal_code: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `POSTAL_CODE` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `POSTAL_CODE` type to find out the possible values.',
					),
				radius: z
					.number()
					.optional()
					.describe('The distance radius around the postal code in miles.'),
			})
			.loose()
			.optional()
			.describe('Native filter : Personal / Geography / Postal code'),
		industry: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `INDUSTRY` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `INDUSTRY` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Personal / Industry'),
		first_name: z.array(z.string()).optional().describe('A list of names.'),
		last_name: z.array(z.string()).optional().describe('A list of names.'),
		profile_language: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `PROFILE_LANGUAGE` type to find out the possible values. Native filter : Personal / Profile language',
			),
		years_of_experience: z
			.array(
				z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.loose(),
			)
			.optional()
			.describe('A list of years ranges.'),
		group: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `GROUP` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `GROUP` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Personal / Groups'),
		school: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `SCHOOL` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `SCHOOL` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Personal / School'),
		following_your_company: z
			.boolean()
			.optional()
			.describe(
				'Whether the users are following your company. Native filter : Buyer intent / Following your company',
			),
		viewed_your_profile_recently: z
			.boolean()
			.optional()
			.describe(
				'Whether the users visited your profile recently. Native filter : Buyer intent / Viewed your profile recently',
			),
		network_distance: z
			.array(z.union([z.number(), z.enum(['GROUP'])]))
			.optional()
			.describe(
				'A list of connection degrees (1 for First, 2 for Second, 3 for Third+ and GROUP for Common group members). Native filter : Best path in / Connection',
			),
		connections_of: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `RELATION` type to find out the possible values. Native filter : Best path in / Connections of',
			),
		past_colleague: z
			.boolean()
			.optional()
			.describe(
				'Whether the users are past colleagues of yours. Native filter : Best path in / Past colleague',
			),
		shared_experiences: z
			.boolean()
			.optional()
			.describe(
				'Whether the users share professionnal experiences with you. Native filter : Buyer intent / Shared experiences',
			),
		changed_jobs: z
			.boolean()
			.optional()
			.describe(
				'Whether the users recently changed jobs. Native filter : Recent updates / Changed jobs',
			),
		posted_on_linkedin: z
			.boolean()
			.optional()
			.describe(
				'Whether the users recently published posts on LinkedIn. Native filter : Recent updates / Posted on Linkedin',
			),
		persona: z
			.array(z.string())
			.optional()
			.describe(
				'A list of parameter IDs. Use List Search Parameters with `PERSONA` type to find out the possible values. Native filter : Workflow / Persona',
			),
		account_list: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `ACCOUNT_LIST` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `ACCOUNT_LIST` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Workflow / Account lists'),
		lead_list: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `LEAD_LIST` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `LEAD_LIST` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Workflow / Lead lists'),
		recent_interaction: z
			.object({
				viewed_profile: z
					.boolean()
					.optional()
					.describe(
						"Whether you recently visited the users's profiles. Explicitely set True or False to include or exclude the option. Native filter : Viewed profile",
					),
				messaged: z
					.boolean()
					.optional()
					.describe(
						'Whether you recently sent a message to the users. Explicitely set True or False to include or exclude the option. Native filter : Messaged',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Workflow / People you interacted with'),
		saved_resources: z
			.object({
				saved_leads: z
					.boolean()
					.optional()
					.describe(
						'Whether the users should be included in one of your lists. Explicitely set True or False to include or exclude the option. Native filter : All my saved leads',
					),
				saved_accounts: z
					.boolean()
					.optional()
					.describe(
						'Whether the users should be included in one of your lists. Explicitely set True or False to include or exclude the option. Native filter : All my saved accounts',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Workflow / Saved leads and accounts'),
	}),
	salesNavigatorSearchCompanies: z.object({
		account_id: AccountId,
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
		keywords: z.string().optional().describe('A keyword or group of keywords.'),
		save_search: z
			.object({ name: z.string().describe('A name to identify the search.') })
			.loose()
			.optional()
			.describe('Allows you to save the current search.'),
		load_saved_search: z
			.object({
				id: z
					.string()
					.describe(
						'A parameter ID. Use List Search Parameters with `SAVED_COMPANY_SEARCH` type to find out the possible values. Native filter : Saved search',
					),
				last_viewed_at: z
					.number()
					.optional()
					.describe(
						'A Unix timestamp indicating the last time the search results were accessed, to be used to retrieve only the new results.',
					),
			})
			.loose()
			.optional()
			.describe('Saved search to be loaded. Overrides all other filters.'),
		load_recent_search: z
			.object({
				id: z
					.string()
					.describe(
						'A parameter ID. Use List Search Parameters with `RECENT_SEARCH` type to find out the possible values. Native filter : Recent search',
					),
			})
			.loose()
			.optional()
			.describe('Recent search to be loaded. Overrides all other filters.'),
		annual_revenue: z
			.object({
				min: z.number().optional(),
				max: z.number().optional(),
				currency: z.string(),
			})
			.loose()
			.optional()
			.describe('Native filter : Company attributes / Annual revenue'),
		headcount: z
			.array(
				z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.loose(),
			)
			.optional()
			.describe('A list of headcount ranges.'),
		headcount_growth: z
			.object({ min: z.number(), max: z.number() })
			.loose()
			.optional()
			.describe(
				'Native filter : Company attributes / Company headcount growth',
			),
		location: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `LOCATION` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `LOCATION` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe(
				'Native filter : Company attributes / Headquarters location / Region',
			),
		postal_code: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `POSTAL_CODE` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `POSTAL_CODE` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe(
				'Native filter : Company attributes / Headquarters location / Postal code',
			),
		industry: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `INDUSTRY` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `INDUSTRY` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Company attributes / Industry'),
		followers: z
			.array(
				z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.loose(),
			)
			.optional()
			.describe('A list of followers ranges.'),
		department_headcount: z
			.object({
				min: z.number(),
				max: z.number(),
				department: z
					.string()
					.describe(
						'A parameter ID. Use List Search Parameters with `JOB_FUNCTION` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Company attributes / Department headcount'),
		department_headcount_growth: z
			.object({
				min: z.number(),
				max: z.number(),
				department: z
					.string()
					.describe(
						'A parameter ID. Use List Search Parameters with `JOB_FUNCTION` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe(
				'Native filter : Company attributes / Department headcount growth',
			),
		fortune: z
			.array(
				z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.loose(),
			)
			.optional()
			.describe('A list of fortune ranges.'),
		spotlights: z
			.array(
				z.enum([
					'HIRING_ON_LINKEDIN',
					'RECENT_LEADERSHIP_CHANGE',
					'RECENT_FUNDING_EVENTS',
					'FIRST_DEGREE_CONNECTIONS',
				]),
			)
			.optional()
			.describe('A list of spotlights.'),
		saved_accounts: z
			.boolean()
			.optional()
			.describe(
				'Whether to include all your saved accounts in the results. Native filter : Workflow / Saved accounts / All my saved accounts',
			),
		account_list: z
			.object({
				include: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `ACCOUNT_LIST` type to find out the possible values.',
					),
				exclude: z
					.array(z.string())
					.optional()
					.describe(
						'A list of parameter IDs. Use List Search Parameters with `ACCOUNT_LIST` type to find out the possible values.',
					),
			})
			.loose()
			.optional()
			.describe('Native filter : Workflow / Account lists'),
	}),
	salesNavigatorListLeadLists: z.object({
		account_id: AccountId,
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
	}),
	salesNavigatorBrowseLeadList: z.object({
		list_id: z.string().min(1).describe('The ID of the list to be browsed.'),
		account_id: AccountId,
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
		spotlight: z
			.enum([
				'RECENT_POSITION_CHANGE',
				'RECENTLY_POSTED_ON_LINKEDIN',
				'FOLLOW_YOUR_COMPANY',
				'SHARE_EXPERIENCE',
			])
			.optional()
			.describe('Smart filter to help you prioritize leads.'),
		sort_by: z
			.enum(['DATE_ADDED', 'ACCOUNT', 'NAME', 'OUTREACH_ACTIVITY'])
			.optional()
			.describe('The sort method.'),
		sort_order: z
			.enum(['ASCENDING', 'DESCENDING'])
			.optional()
			.describe('The sort order.'),
	}),
	salesNavigatorSaveLead: z.object({
		list_id: z
			.string()
			.min(1)
			.describe('The ID of the List to save the Lead to.'),
		account_id: AccountId,
		user_id: z
			.string()
			.describe('The ID of the User to be saved as Lead to the List.'),
	}),
	salesNavigatorListAccountLists: z.object({
		account_id: AccountId,
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
	}),
	salesNavigatorBrowseAccountList: z.object({
		list_id: z.string().min(1).describe('The ID of the list to be browsed.'),
		account_id: AccountId,
		offset: z.number().optional(),
		limit: z.number().min(1).max(100).optional(),
		persona: z
			.string()
			.optional()
			.describe(
				'A parameter ID. Use List Search Parameters with `PERSONA` type to find out the possible values. Native filter : Persona',
			),
		filter: z
			.enum(['STARRED', 'GROWTH_ALERTS', 'RISK_ALERTS'])
			.optional()
			.describe('Native filter : Filter companies'),
		sort_by: z
			.enum(['DATE_ADDED', 'NAME'])
			.optional()
			.describe('The sort method.'),
		sort_order: z
			.enum(['ASCENDING', 'DESCENDING'])
			.optional()
			.describe('The sort order.'),
	}),
	salesNavigatorSaveAccount: z.object({
		list_id: z
			.string()
			.min(1)
			.describe('The ID of the List to save the Account to.'),
		account_id: AccountId,
		company_id: z
			.string()
			.describe('The ID of the Company to be saved as Account to the List.'),
	}),
} as const;

export const LinkedinOutputSchemas = {
	linkedinGetInmailCredits: z
		.object({
			object: z.string(),
			credits: z
				.object({
					classic: z
						.number()
						.nullish()
						.describe('InMail credits for Classic Premium.'),
					recruiter: z
						.number()
						.nullish()
						.describe('InMail credits for Recruiter.'),
					sales_navigator: z
						.number()
						.nullish()
						.describe('InMail credits for Sales Navigator.'),
				})
				.loose(),
		})
		.loose(),
	linkedinListContracts: z
		.object({
			object: z.string(),
			contracts: z.array(
				z
					.object({
						object: z.string(),
						product: z.string(),
						selected: z.boolean(),
						id: z.string(),
						name: z.string(),
						description: z.string().nullish(),
					})
					.loose(),
			),
		})
		.loose(),
	linkedinSelectContract: z
		.object({
			object: z.string(),
			contract: z
				.object({
					object: z.string(),
					product: z.string(),
					selected: z.boolean(),
					id: z.string().describe('The ID of the contract.'),
					name: z.string().describe('The name of the contract.'),
					description: z
						.string()
						.nullish()
						.describe('The description of the contract.'),
				})
				.loose(),
		})
		.loose(),
	linkedinListProfileViews: z
		.object({
			object: z.string(),
			entities: z
				.array(
					z
						.object({
							object: z.string(),
							id: z.string().nullable(),
							public_identifier: z.string(),
							name: z.string(),
							picture_url: z.string().nullish(),
							network_distance: z.string().nullish(),
							premium: z.boolean().nullish(),
							verified: z.boolean().nullish(),
							last_visited: z.record(z.string(), z.unknown()).nullable(),
						})
						.loose(),
				)
				.describe('A collection of profile view entities.'),
			analytics: z
				.object({
					object: z.string(),
					views_count: z.number(),
					highlights: z
						.object({
							top_location: z.string().nullish(),
							top_company: z.string().nullish(),
							top_industry: z.string().nullish(),
						})
						.loose()
						.nullish(),
					details: z
						.object({
							locations: z.record(z.string(), z.unknown()).nullish(),
							companies: z.record(z.string(), z.unknown()).nullish(),
							industries: z.record(z.string(), z.unknown()).nullish(),
						})
						.loose()
						.nullish(),
				})
				.loose()
				.nullish()
				.describe(
					'Profile views analytics will only be present in the first request of a series of paginated requests.',
				),
		})
		.loose(),
	linkedinGetCompany: z
		.object({
			id: z.string().describe('The ID of the Company for the provider.'),
			name: z.string().describe('The name of the Company.'),
			profile_url: z
				.string()
				.nullish()
				.describe('The public profile URL of the Company.'),
			public_picture_url: z
				.string()
				.nullish()
				.describe('The public picture URL of the Company.'),
			public_identifier: z
				.string()
				.nullish()
				.describe('The public identifier of the Company.'),
			followers_count: z
				.number()
				.nullish()
				.describe('The number of followers of the Company.'),
			is_following: z
				.boolean()
				.nullish()
				.describe('Whether the current user is following the Company.'),
			object: z.string(),
			description: z
				.string()
				.nullish()
				.describe('The description of the Company.'),
			tagline: z.string().nullish().describe('The tagline of the Company.'),
			is_school: z.boolean().describe('Whether the Company is a school.'),
			is_active: z
				.boolean()
				.describe('Whether the Company is currently in activity.'),
			is_archived: z
				.boolean()
				.describe('Whether the Company has been archived.'),
			is_employee: z
				.boolean()
				.describe('Whether the current user is an employee of the Company.'),
			is_verified: z
				.boolean()
				.describe('Whether the Company has been verified.'),
			is_claimable: z.boolean().describe('Whether the Company can be claimed.'),
			is_claimable_by_viewer: z
				.boolean()
				.describe('Whether the Company can be claimed by the current user.'),
			verified_at: z
				.string()
				.nullish()
				.describe(
					'The date on which the Company was verified. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
				),
			mailbox: z
				.object({
					id: z
						.string()
						.describe(
							'The ID of the mailbox. Should be used to start a chat with the Company provided that messaging is enabled.',
						),
					enabled: z
						.boolean()
						.describe('Whether the Company has enabled messaging.'),
				})
				.loose()
				.describe('The mailbox informations of the Company.'),
			viewer_roles: z
				.array(z.object({ type: z.string(), description: z.string() }).loose())
				.describe(
					'The list of roles the current user may have in the Company.',
				),
			locations: z
				.array(
					z
						.object({
							is_headquarter: z.boolean(),
							country_code: z.string(),
							city: z.string().nullish(),
							area: z.string().nullish(),
							postal_code: z.string().nullish(),
							street: z.string().nullish(),
							description: z.string().nullish(),
						})
						.loose(),
				)
				.describe('The list of locations related to the Company.'),
			industry: z
				.array(z.string())
				.describe('A list of industries associated with the the Company.'),
			activities: z
				.array(z.string())
				.nullish()
				.describe('The list of activities of the Company.'),
			website: z.string().nullish().describe('The website URL of the Company.'),
			establishment_year: z
				.number()
				.nullish()
				.describe('The year the Company was established.'),
			phone: z.string().nullish().describe('The phone number of the Company.'),
			fields_of_expertise: z
				.array(z.string())
				.nullish()
				.describe('The list of fields of expertise of the Company.'),
			acquired_by: z
				.object({
					object: z.string(),
					id: z.string().describe('The ID of the Company for the provider.'),
					name: z.string().describe('The name of the Company.'),
					profile_url: z
						.string()
						.nullish()
						.describe('The public profile URL of the Company.'),
					public_picture_url: z
						.string()
						.nullish()
						.describe('The public picture URL of the Company.'),
					public_identifier: z
						.string()
						.nullish()
						.describe('The public identifier of the Company.'),
					followers_count: z
						.number()
						.nullish()
						.describe('The number of followers of the Company.'),
					is_following: z
						.boolean()
						.nullish()
						.describe('Whether the current user is following the Company.'),
				})
				.loose()
				.nullish()
				.describe('The acquirer company.'),
			insights: z
				.object({
					headcount: z
						.number()
						.nullish()
						.describe('The number of employees of the Company.'),
					headcount_range: z
						.object({ from: z.number().nullish(), to: z.number().nullish() })
						.loose()
						.nullish()
						.describe('The employees count range the Company falls into.'),
					heacount_growth: z
						.array(z.unknown())
						.nullish()
						.describe(
							'A list of time markers to create a chart showing the evolution of the number of employees.',
						),
					growth_periods: z
						.array(z.unknown())
						.nullish()
						.describe(
							'A list of time markers to create a chart showing the evolution of the number of employees.',
						),
					average_tenure: z
						.number()
						.nullish()
						.describe('The average years of experience of employees.'),
				})
				.loose()
				.describe('Insights about the company.'),
			funding: z
				.object({
					crunchbase: z
						.object({
							rounds_url: z.string(),
							rounds_count: z.number(),
							company_url: z.string(),
							last_round: z.record(z.string(), z.unknown()),
						})
						.loose()
						.nullish()
						.describe('Details about Crunchbase funding.'),
				})
				.loose()
				.nullish()
				.describe('Company funding information.'),
			hashtags: z
				.array(z.string())
				.describe('The list of hashtags related to the Company.'),
		})
		.loose(),
	linkedinListManagedCompanyPages: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						mailbox_id: z.string(),
						name: z.string(),
						messaging_enabled: z.boolean().nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	linkedinInviteToFollowCompany: z
		.object({
			object: z.string(),
			result: z
				.object({
					invitations_ids: z
						.array(z.string())
						.describe('The IDs of the successfully sent invitations.'),
					invitations_count: z
						.object({ success: z.number(), failed: z.number() })
						.loose(),
				})
				.loose(),
		})
		.loose(),
	linkedinGetCompanyFollowCredits: z
		.object({
			object: z.string(),
			remaining_credit: z
				.number()
				.describe(
					'The remaining credit for inviting members to follow the company page.',
				),
			credit_grant: z
				.number()
				.describe('The credit that is granted to you on each reset.'),
			resets_on: z
				.string()
				.describe(
					'The next reset date of the credits. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
				),
		})
		.loose(),
	linkedinEndorseSkill: z.object({ object: z.string() }).loose(),
	linkedinRequest: UnknownJson,
	linkedinGetSearchParameters: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						name: z.string(),
						metadata: z.record(z.string(), z.unknown()).nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	linkedinSearchFromUrl: z
		.object({
			data: z.array(LinkedinSearchFromUrlShape2).nullish(),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	linkedinSearchPeople: z
		.object({
			data: z.array(LinkedinSearchFromUrlShape2),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	linkedinSearchCompanies: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						display_name: z.string(),
						public_identifier: z.string().nullish(),
						profile_url: z.string().nullish(),
						public_picture_url: z.string().nullish(),
						public_picture_url_large: z.string().nullish(),
						location: z.string().nullish(),
						industry: z.string().nullish(),
						summary: z.string().nullish(),
						relations_count: z.number().nullish(),
						product: z.string(),
						job_postings_count: z.number().nullish(),
						followers_count: z.number().nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	linkedinSearchPosts: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						share_url: z.string(),
						created_at: z.string(),
						title: z.string().nullish(),
						text: z.string(),
						author: z.record(z.string(), z.unknown()),
						user_reacted: z.union([z.boolean(), z.string()]),
						permissions: z.record(z.string(), z.unknown()),
						reactions_counter: z.array(z.unknown()).nullable(),
						comments_counter: z.number().nullable(),
						reposts_counter: z.number().nullable(),
						poll: z.record(z.string(), z.unknown()).nullish(),
						event: z.record(z.string(), z.unknown()).nullish(),
						attachments: z.array(z.unknown()),
						analytics: z.record(z.string(), z.unknown()).nullish(),
						specifics: z.unknown().nullish(),
						is_repost: z.boolean(),
						reposted_by: z.record(z.string(), z.unknown()).nullish(),
						quoted_post: z.record(z.string(), z.unknown()).nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	linkedinSearchJobs: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						title: z.string(),
						location: z.string().nullish(),
						listed_at: z.string().nullish(),
						workplace_type: z.string().nullish(),
						url: z.string(),
						is_repost: z.boolean(),
						is_promoted: z.boolean(),
						easy_apply: z.boolean(),
						few_applicants: z.boolean(),
						company: z.record(z.string(), z.unknown()),
						insights: z.array(z.string()),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	salesNavigatorGetSearchParameters: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						name: z.string(),
						metadata: z.record(z.string(), z.unknown()).nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	salesNavigatorSearchFromUrl: z
		.object({
			data: z.array(SalesNavigatorSearchFromUrlShape3).nullish(),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	salesNavigatorSearchPeople: z
		.object({
			data: z.array(SalesNavigatorSearchFromUrlShape3),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	salesNavigatorSearchCompanies: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						display_name: z.string(),
						public_identifier: z.string().nullish(),
						profile_url: z.string().nullish(),
						public_picture_url: z.string().nullish(),
						public_picture_url_large: z.string().nullish(),
						location: z.string().nullish(),
						industry: z.string().nullish(),
						summary: z.string().nullish(),
						relations_count: z.number().nullish(),
						product: z.string(),
						type: z.string().nullish(),
						headcount: z.number().nullish(),
						specialties: z.array(z.string()).nullish(),
						is_hiring_on_linkedin: z.boolean().nullish(),
						lists_count: z.number(),
						notes_count: z.number(),
						website: z.string().nullish(),
						founded_on: z.number().nullish(),
						has_been_saved: z.boolean(),
						is_starred: z.boolean(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	salesNavigatorListLeadLists: SalesNavigatorListLeadListsShape1,
	salesNavigatorBrowseLeadList: z
		.object({
			data: z.array(
				z
					.object({
						id: z.string(),
						member_id: z.string().nullish(),
						display_name: z.string(),
						public_identifier: z.string().nullish(),
						profile_url: z.string().nullish(),
						public_picture_url: z.string().nullish(),
						public_picture_url_large: z.string().nullish(),
						relations_count: z.number().nullish(),
						location: z.string().nullish(),
						headline: z.string().nullish(),
						network_distance: z.string(),
						can_send_inmail: z.boolean().nullish(),
						shared_relations_count: z.number().nullish(),
						summary: z.string().nullish(),
						has_posted_recently: z.boolean(),
						has_viewed_your_profile: z.boolean(),
						was_hired_recently: z.boolean(),
						was_promoted_recently: z.boolean(),
						follows_your_company: z.boolean(),
						is_premium: z.boolean(),
						is_past_colleague: z.boolean(),
						is_open_profile: z.boolean(),
						websites: z.array(z.string()).nullish(),
						addresses: z.array(z.string()).nullish(),
						contact_info: z.record(z.string(), z.unknown()),
						latest_contact: z.record(z.string(), z.unknown()).nullish(),
						lists_count: z.number(),
						notes_count: z.number(),
						social_handles: z.record(z.string(), z.unknown()).nullish(),
						industry: z.string().nullish(),
						education: z.array(z.unknown()),
						skills: z.array(z.unknown()),
						work_experience: z.array(z.unknown()),
						languages: z.array(z.unknown()),
						volunteering: z.array(z.unknown()),
						object: z.string(),
						saved_at: z.string(),
						associated_account: z.record(z.string(), z.unknown()).nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	salesNavigatorSaveLead: z.object({ object: z.string() }).loose(),
	salesNavigatorListAccountLists: SalesNavigatorListLeadListsShape1,
	salesNavigatorBrowseAccountList: z
		.object({
			data: z.array(
				z
					.object({
						id: z.string(),
						display_name: z.string(),
						public_identifier: z.string().nullish(),
						profile_url: z.string().nullish(),
						public_picture_url: z.string().nullish(),
						public_picture_url_large: z.string().nullish(),
						location: z.string().nullish(),
						industry: z.string().nullish(),
						summary: z.string().nullish(),
						relations_count: z.number().nullish(),
						type: z.string().nullish(),
						headcount: z.number().nullish(),
						specialties: z.array(z.string()).nullish(),
						is_hiring_on_linkedin: z.boolean().nullish(),
						lists_count: z.number(),
						notes_count: z.number(),
						website: z.string().nullish(),
						founded_on: z.number().nullish(),
						is_starred: z.boolean(),
						object: z.string(),
						recommended_lead: z.record(z.string(), z.unknown()).nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	salesNavigatorSaveAccount: z.object({ object: z.string() }).loose(),
} as const;
