import { z } from 'zod';

// Object shapes come from the provider's response examples; loose objects preserve additional provider fields.
// Response fields are nullish: Findymail sends null for fields it has no value for, and a
// read should not fail on that. Inputs stay strict.
export const verification_verifyInput = z.object({ email: z.string() });
export const verification_verifyOutput = z
	.object({
		email: z.string(),
		verified: z.boolean(),
		provider: z.string().nullish(),
	})
	.loose();

export const lists_listInput = z.object({});
export const lists_listOutput = z
	.object({
		lists: z
			.array(
				z
					.object({
						id: z.number().nullish(),
						name: z.string().nullish(),
						created_at: z.string().nullish(),
						updated_at: z.string().nullish(),
						shared_with_team: z.boolean().nullish(),
						is_owner: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const lists_createInput = z.object({ name: z.string() });
export const lists_createOutput = z
	.object({
		list: z
			.object({
				id: z.number().nullish(),
				name: z.string().nullish(),
				created_at: z.string().nullish(),
				updated_at: z.string().nullish(),
				shared_with_team: z.boolean().nullish(),
				is_owner: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export const lists_replaceInput = z.object({
	id: z.number().int().nonnegative(),
	name: z.string(),
	isShared: z.boolean(),
});
export const lists_replaceOutput = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		shared_with_team: z.boolean().nullish(),
		is_owner: z.boolean().nullish(),
	})
	.loose();

export const lists_deleteInput = z.object({
	id: z.number().int().nonnegative(),
});
// The documented success body is an empty object; retain additional fields if the provider adds them.
export const lists_deleteOutput = z.object({}).loose();

export const contacts_listInput = z.object({
	id: z.number().int().nonnegative(),
});
export const contacts_listOutput = z
	.object({
		draw: z.number(),
		recordsTotal: z.number(),
		recordsFiltered: z.number(),
		data: z.array(
			z
				.object({
					id: z.number().nullish(),
					name: z.string().nullish(),
					email: z.string().nullish(),
					linkedin_url: z.string().nullish(),
					company: z.string().nullish(),
					job_title: z.string().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export const search_nameInput = z.object({
	name: z.string(),
	domain: z.string(),
	webhook_url: z.string().optional(),
});
const searchContact = z
	.object({
		name: z.string().nullish(),
		domain: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();

// Findymail shows direct results and callback payloads; validate both whenever present.
const searchContactResponse = z
	.object({
		contact: searchContact.nullish(),
		payload: z.object({ contact: searchContact.nullish() }).loose().nullish(),
	})
	.loose();
export const search_nameOutput = searchContactResponse;

export const search_businessProfileInput = z.object({
	linkedin_url: z.string(),
	webhook_url: z.string().optional(),
});
export const search_businessProfileOutput = searchContactResponse;

export const exclusionLists_listInput = z.object({});
export const exclusionLists_listOutput = z
	.object({
		lists: z
			.array(
				z
					.object({
						id: z.number().nullish(),
						name: z.string().nullish(),
						is_shared: z.boolean().nullish(),
						is_owner: z.boolean().nullish(),
						user_id: z.number().nullish(),
						owner_name: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const exclusionLists_createInput = z.object({
	name: z.string(),
	is_shared: z.boolean().optional(),
});
export const exclusionLists_createOutput = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		is_shared: z.boolean().nullish(),
		is_owner: z.boolean().nullish(),
	})
	.loose();

export const exclusionLists_getInput = z.object({
	excludedDomainList_id: z.number().int().nonnegative(),
});
export const exclusionLists_getOutput = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		is_shared: z.boolean().nullish(),
		is_owner: z.boolean().nullish(),
		user_id: z.number().nullish(),
		owner_name: z.string().nullish(),
	})
	.loose();

export const exclusionLists_updateInput = z.object({
	excludedDomainList_id: z.number().int().nonnegative(),
	name: z.string(),
	is_shared: z.boolean().optional(),
});
export const exclusionLists_updateOutput = z
	.object({
		success: z.boolean().nullish(),
		list: z
			.object({
				id: z.number().nullish(),
				name: z.string().nullish(),
				is_shared: z.boolean().nullish(),
				is_owner: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export const exclusionLists_deleteInput = z.object({
	excludedDomainList_id: z.number().int().nonnegative(),
});
export const exclusionLists_deleteOutput = z
	.object({ success: z.boolean().nullish() })
	.loose();

export const excludedDomains_listInput = z.object({
	query: z.string().optional(),
	list_id: z.number().int().optional(),
	per_page: z.number().int().optional(),
	page: z.number().int().optional(),
});
export const excludedDomains_listOutput = z
	.object({
		data: z
			.array(
				z
					.object({
						id: z.number().nullish(),
						domain: z.string().nullish(),
						excluded_domain_list_id: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
		current_page: z.number().nullish(),
		per_page: z.number().nullish(),
		total: z.number().nullish(),
	})
	.loose();

export const excludedDomains_addInput = z.object({
	domains: z.array(z.string()),
	list_id: z.number().int().optional(),
});
export const excludedDomains_addOutput = z
	.object({
		success: z.boolean().nullish(),
		total: z.number().nullish(),
		processed_immediately: z.number().nullish(),
		queued: z.number().nullish(),
		list_id: z.number().nullish(),
	})
	.loose();

export const excludedDomains_removeInput = z.object({
	ids: z.array(z.number().int()),
});
export const excludedDomains_removeOutput = z.union([
	z
		.object({
			success: z.boolean().nullish(),
			deleted_count: z.number().nullish(),
		})
		.loose(),
	z
		.object({
			success: z.boolean().nullish(),
			deleted_count: z.number().nullish(),
		})
		.loose(),
]);

export const intellimatch_searchInput = z.object({
	query: z.string(),
	limit: z.number().int().optional(),
	config: z
		.object({
			find_contact: z.boolean().optional(),
			find_email: z.boolean().optional(),
			find_phone: z.boolean().optional(),
			target_job_titles: z
				.union([z.array(z.string()), z.array(z.array(z.string())).max(3)])
				.optional(),
			lead_list_id: z.number().int().optional(),
			mode: z.string().optional(),
			require_email: z.boolean().optional(),
			add_to_exclusion_list: z.boolean().optional(),
			exclusion_list_id: z.number().int().optional(),
			exclusion_filter_list_ids: z.array(z.number().int()).optional(),
		})
		.optional(),
});
export const intellimatch_searchOutput = z
	.object({ hash: z.string().nullish() })
	.loose();

export const intellimatch_statusInput = z.object({ hash: z.string() });
export const intellimatch_statusOutput = z
	.object({
		status: z.string().nullish(),
		progress: z.number().nullish(),
		total_jobs: z.number().nullish(),
		processed_jobs: z.number().nullish(),
		pending_jobs: z.number().nullish(),
		failed_jobs: z.number().nullish(),
	})
	.loose();

export const intellimatch_resultsInput = z.object({
	hash: z.string(),
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
});
export const intellimatch_resultsOutput = z
	.object({
		data: z
			.array(
				z
					.object({
						id: z.number().nullish(),
						name: z.string().nullish(),
						domain: z.string().nullish(),
						description: z.string().nullish(),
						employee_count_range: z.string().nullish(),
						industries: z.array(z.string()).nullish(),
						country: z.string().nullish(),
						match_score: z.number().nullish(),
						contact_name: z.string().nullish(),
						contact_email: z.string().nullish(),
						contact_job_title: z.string().nullish(),
						contact_phone: z.string().nullish(),
						contact_linkedin_url: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		meta: z
			.object({
				current_page: z.number().nullish(),
				per_page: z.number().nullish(),
				total: z.number().nullish(),
				last_page: z.number().nullish(),
				from: z.number().nullish(),
				to: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export const intellimatch_lookalikesInput = z.object({
	seed: z.string(),
	same_country: z.boolean().optional(),
	same_size: z.boolean().optional(),
	limit: z.number().int().optional(),
	exclusion_list_ids: z.array(z.number().int()).optional(),
});
export const intellimatch_lookalikesOutput = z
	.object({
		companies: z
			.array(
				z
					.object({
						domain: z.string().nullish(),
						name: z.string().nullish(),
						linkedin_url: z.string().nullish(),
						company_size: z.string().nullish(),
						country: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		total: z.number().nullish(),
		credits_used: z.number().nullish(),
		message: z.string().nullish(),
	})
	.loose();

export const search_reverseEmailInput = z.object({
	email: z.string(),
	with_profile: z.boolean().optional(),
});
export const search_reverseEmailOutput = z
	.object({
		linkedin_url: z.string().nullish(),
		fullName: z.string().nullish(),
		username: z.string().nullish(),
		headline: z.string().nullish(),
		jobTitle: z.string().nullish(),
		summary: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
		country: z.string().nullish(),
		companyLinkedinUrl: z.string().nullish(),
		companyName: z.string().nullish(),
		companyWebsite: z.string().nullish(),
		isPremium: z.boolean().nullish(),
		isOpenProfile: z.boolean().nullish(),
		// The provider examples leave the skills and jobs array item shapes unspecified.
		// Keep elements unknown rather than inventing a stricter profile contract.
		skills: z.array(z.unknown()).nullish(),
		jobs: z.array(z.unknown()).nullish(),
		educations: z
			.array(
				z
					.object({
						school: z.string().nullish(),
						degree: z.string().nullish(),
						fieldOfStudy: z.string().nullish(),
						startDate: z.string().nullish(),
						endDate: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		certificates: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						issuingOrganization: z.string().nullish(),
						issueDate: z.string().nullish(),
						expirationDate: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const search_companyInput = z.object({
	linkedin_url: z.string().optional(),
	domain: z.string().optional(),
	name: z.string().optional(),
});
export const search_companyOutput = z
	.object({
		name: z.string().nullish(),
		domain: z.string().nullish(),
		company_size: z.string().nullish(),
		industry: z.string().nullish(),
		linkedin_url: z.string().nullish(),
		description: z.string().nullish(),
	})
	.loose();

export const search_employeesInput = z.object({
	website: z.string(),
	job_titles: z.array(z.string()),
	count: z.number().int().optional(),
});
export const search_employeesOutput = z.array(
	z
		.object({
			name: z.string().nullish(),
			linkedinUrl: z.string().nullish(),
			companyWebsite: z.string().nullish(),
			companyName: z.string().nullish(),
			jobTitle: z.string().nullish(),
		})
		.loose(),
);

export const search_phoneInput = z.object({ linkedin_url: z.string() });
export const search_phoneOutput = z.union([
	z
		.object({
			phone: z.string().nullish(),
			line_type: z.string().nullish(),
		})
		.loose(),
	z
		.object({
			phone: z.string().nullish(),
			line_type: z.string().nullish(),
		})
		.loose(),
]);

export const signals_listInput = z.object({
	signal_type: z.string().optional(),
	monitor_id: z.number().int().optional(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	relevance_scores: z.string().optional(),
	page: z.number().int().optional(),
	per_page: z.number().int().optional(),
});
export const signals_listOutput = z
	.object({
		data: z
			.array(
				z
					.object({
						id: z.number().nullish(),
						type: z.string().nullish(),
						category: z.string().nullish(),
						payload: z
							.object({
								matched_keyword: z.string().nullish(),
								snippet: z.string().nullish(),
							})
							.loose()
							.nullish(),
						detected_at: z.string().nullish(),
						expires_at: z.string().nullish(),
						contact: z
							.object({
								id: z.number().nullish(),
								name: z.string().nullish(),
								job_title: z.string().nullish(),
								linkedin_url: z.string().nullish(),
							})
							.loose()
							.nullish(),
						company: z
							.object({
								id: z.number().nullish(),
								name: z.string().nullish(),
								domain: z.string().nullish(),
								industry: z.string().nullish(),
								employee_count_range: z.string().nullish(),
								country: z.string().nullish(),
							})
							.loose()
							.nullish(),
						monitors: z
							.array(
								z
									.object({
										id: z.number().nullish(),
										name: z.string().nullish(),
										keywords: z.array(z.string()).nullish(),
										enrichment_level: z.string().nullish(),
										relevance_score: z.number().nullish(),
										relevance_reasoning: z.string().nullish(),
									})
									.loose(),
							)
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
		meta: z
			.object({
				current_page: z.number().nullish(),
				per_page: z.number().nullish(),
				total: z.number().nullish(),
				last_page: z.number().nullish(),
				from: z.number().nullish(),
				to: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

// Monitor responses echo request fields that are sent as objects and arrays
// (icp_filters, engagement_types, target_companies); the documented examples
// only show them as null, so both the request form and a string are accepted.
const monitorIcpFiltersOutput = z
	.object({
		industries: z.array(z.string()).nullish(),
		employee_count_ranges: z.array(z.string()).nullish(),
		countries: z.array(z.string()).nullish(),
		job_title_keywords: z.array(z.string()).nullish(),
		seniority_levels: z.array(z.number()).nullish(),
	})
	.loose()
	.nullish();
const monitorStringListOutput = z
	.union([z.array(z.string()), z.string()])
	.nullish();

export const monitors_listInput = z.object({
	ownership: z.string().optional(),
});
export const monitors_listOutput = z.array(
	z
		.object({
			id: z.number().nullish(),
			name: z.string().nullish(),
			signal_type: z.string().nullish(),
			signal_type_label: z.string().nullish(),
			signal_level: z.string().nullish(),
			status: z.string().nullish(),
			keywords: z.array(z.string()).nullish(),
			icp_filters: monitorIcpFiltersOutput,
			webhook_url: z.string().nullish(),
			webhook_paused_at: z.string().nullish(),
			post_url: z.string().nullish(),
			profile_url: z.string().nullish(),
			engagement_types: monitorStringListOutput,
			enrichment_level: z.string().nullish(),
			lead_list_id: z.union([z.number(), z.string()]).nullish(),
			ai_relevance_prompt: z.string().nullish(),
			target_companies: monitorStringListOutput,
			max_matches: z.number().nullish(),
			match_count: z.number().nullish(),
			is_shared: z.boolean().nullish(),
			is_owner: z.boolean().nullish(),
			is_team_owner: z.boolean().nullish(),
			uses_current_users_monitor_cap: z.boolean().nullish(),
			user_id: z.number().nullish(),
			owner_name: z.string().nullish(),
			created_at: z.string().nullish(),
		})
		.loose(),
);

export const monitors_createInput = z.object({
	name: z.string(),
	signal_type: z.string(),
	keywords: z.array(z.string()).optional(),
	webhook_url: z.string().optional(),
	post_url: z.string().optional(),
	profile_url: z.string().optional(),
	engagement_types: z.array(z.string()).optional(),
	enrichment_level: z.string().optional(),
	lead_list_id: z.number().int().optional(),
	ai_relevance_prompt: z.string().optional(),
	max_matches: z.number().int().nullable().optional(),
	target_companies: z.array(z.string()).optional(),
	is_shared: z.boolean().optional(),
	icp_filters: z
		.object({
			industries: z.array(z.string()).optional(),
			employee_count_ranges: z.array(z.string()).optional(),
			countries: z.array(z.string()).optional(),
			job_title_keywords: z.array(z.string()).optional(),
			seniority_levels: z.array(z.number().int()).optional(),
		})
		.optional(),
	job_offer_title_keywords: z.array(z.string()).optional(),
});
// The create response uses the same documented fields as the update response.
export const monitors_createOutput = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		signal_type: z.string().nullish(),
		signal_type_label: z.string().nullish(),
		signal_level: z.string().nullish(),
		status: z.string().nullish(),
		keywords: z.array(z.string()).nullish(),
		icp_filters: monitorIcpFiltersOutput,
		webhook_url: z.string().nullish(),
		webhook_paused_at: z.string().nullish(),
		post_url: z.string().nullish(),
		profile_url: z.string().nullish(),
		engagement_types: monitorStringListOutput,
		enrichment_level: z.string().nullish(),
		lead_list_id: z.union([z.number(), z.string()]).nullish(),
		ai_relevance_prompt: z.string().nullish(),
		target_companies: monitorStringListOutput,
		max_matches: z.number().nullish(),
		match_count: z.number().nullish(),
		is_shared: z.boolean().nullish(),
		is_owner: z.boolean().nullish(),
		is_team_owner: z.boolean().nullish(),
		uses_current_users_monitor_cap: z.boolean().nullish(),
		user_id: z.number().nullish(),
		owner_name: z.string().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();

export const monitors_updateInput = z.object({
	id: z.number().int().nonnegative(),
	name: z.string(),
	keywords: z.array(z.string()).optional(),
	webhook_url: z.string().optional(),
	engagement_types: z.array(z.string()).optional(),
	enrichment_level: z.string().optional(),
	lead_list_id: z.number().int().optional(),
	ai_relevance_prompt: z.string().optional(),
	max_matches: z.number().int().nullable().optional(),
	target_companies: z.array(z.string()).optional(),
	is_shared: z.boolean().optional(),
	icp_filters: z
		.object({
			industries: z.array(z.string()).optional(),
			employee_count_ranges: z.array(z.string()).optional(),
			countries: z.array(z.string()).optional(),
			job_title_keywords: z.array(z.string()).optional(),
			seniority_levels: z.array(z.number().int()).optional(),
		})
		.optional(),
	job_offer_title_keywords: z.array(z.string()).optional(),
});
export const monitors_updateOutput = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		signal_type: z.string().nullish(),
		signal_type_label: z.string().nullish(),
		signal_level: z.string().nullish(),
		status: z.string().nullish(),
		keywords: z.array(z.string()).nullish(),
		icp_filters: monitorIcpFiltersOutput,
		webhook_url: z.string().nullish(),
		webhook_paused_at: z.string().nullish(),
		post_url: z.string().nullish(),
		profile_url: z.string().nullish(),
		engagement_types: monitorStringListOutput,
		enrichment_level: z.string().nullish(),
		lead_list_id: z.union([z.number(), z.string()]).nullish(),
		ai_relevance_prompt: z.string().nullish(),
		target_companies: monitorStringListOutput,
		max_matches: z.number().nullish(),
		match_count: z.number().nullish(),
		is_shared: z.boolean().nullish(),
		is_owner: z.boolean().nullish(),
		is_team_owner: z.boolean().nullish(),
		user_id: z.number().nullish(),
		owner_name: z.string().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();

export const monitors_deleteInput = z.object({
	id: z.number().int().nonnegative(),
});
export const monitors_deleteOutput = z.void();

export const signals_getInput = z.object({
	id: z.number().int().nonnegative(),
});
export const signals_getOutput = z
	.object({
		id: z.number().nullish(),
		type: z.string().nullish(),
		category: z.string().nullish(),
		payload: z
			.object({
				matched_keyword: z.string().nullish(),
				snippet: z.string().nullish(),
			})
			.loose()
			.nullish(),
		detected_at: z.string().nullish(),
		expires_at: z.string().nullish(),
		contact: z
			.object({
				id: z.number().nullish(),
				name: z.string().nullish(),
				job_title: z.string().nullish(),
				linkedin_url: z.string().nullish(),
			})
			.loose()
			.nullish(),
		company: z
			.object({
				id: z.number().nullish(),
				name: z.string().nullish(),
				domain: z.string().nullish(),
				industry: z.string().nullish(),
				employee_count_range: z.string().nullish(),
				country: z.string().nullish(),
			})
			.loose()
			.nullish(),
		monitors: z
			.array(
				z
					.object({
						id: z.number().nullish(),
						name: z.string().nullish(),
						keywords: z.array(z.string()).nullish(),
						enrichment_level: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const technologies_searchInput = z.object({ q: z.string() });
export const technologies_searchOutput = z
	.object({
		data: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						category: z.string().nullish(),
						subcategory: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const technologies_lookupInput = z.object({
	domain: z.string(),
	technologies: z.array(z.string()).optional(),
});
export const technologies_lookupOutput = z
	.object({
		domain: z.string().nullish(),
		technologies: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						category: z.string().nullish(),
						subcategory: z.string().nullish(),
						last_detected_at: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const usage_creditsInput = z.object({ type: z.string().optional() });
export const usage_creditsOutput = z.union([
	z
		.object({
			credits: z.number().nullish(),
			email: z.string().nullish(),
			has_capacity: z.boolean().nullish(),
			verifier_credits: z.number().nullish(),
		})
		.loose(),
	z
		.object({
			credits: z.number().nullish(),
			email: z.string().nullish(),
			has_capacity: z.boolean().nullish(),
			verifier_credits: z.number().nullish(),
		})
		.loose(),
]);

export const usage_summaryInput = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
});
export const usage_summaryOutput = z
	.object({
		from: z.string().nullish(),
		to: z.string().nullish(),
		total: z
			.object({
				finder: z.number().nullish(),
				verifier: z.number().nullish(),
			})
			.loose()
			.nullish(),
		items: z
			.array(
				z
					.object({
						date: z.string().nullish(),
						finder: z.number().nullish(),
						verifier: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const usage_teamSummaryInput = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
});
export const usage_teamSummaryOutput = z
	.object({
		from: z.string().nullish(),
		to: z.string().nullish(),
		total: z
			.object({
				finder: z.number().nullish(),
				verifier: z.number().nullish(),
			})
			.loose()
			.nullish(),
		members: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						finder: z.number().nullish(),
						verifier: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const lists_updateInput = z.object({
	id: z.number().int().nonnegative(),
	name: z.string(),
	isShared: z.boolean(),
});
export const lists_updateOutput = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		shared_with_team: z.boolean().nullish(),
		is_owner: z.boolean().nullish(),
	})
	.loose();

export const FindymailEndpointInputSchemas = {
	verification_verify: verification_verifyInput,
	lists_list: lists_listInput,
	lists_create: lists_createInput,
	lists_replace: lists_replaceInput,
	lists_update: lists_updateInput,
	lists_delete: lists_deleteInput,
	contacts_list: contacts_listInput,
	search_name: search_nameInput,
	search_businessProfile: search_businessProfileInput,
	exclusionLists_list: exclusionLists_listInput,
	exclusionLists_create: exclusionLists_createInput,
	exclusionLists_get: exclusionLists_getInput,
	exclusionLists_update: exclusionLists_updateInput,
	exclusionLists_delete: exclusionLists_deleteInput,
	excludedDomains_list: excludedDomains_listInput,
	excludedDomains_add: excludedDomains_addInput,
	excludedDomains_remove: excludedDomains_removeInput,
	intellimatch_search: intellimatch_searchInput,
	intellimatch_status: intellimatch_statusInput,
	intellimatch_results: intellimatch_resultsInput,
	intellimatch_lookalikes: intellimatch_lookalikesInput,
	search_reverseEmail: search_reverseEmailInput,
	search_company: search_companyInput,
	search_employees: search_employeesInput,
	search_phone: search_phoneInput,
	signals_list: signals_listInput,
	signals_get: signals_getInput,
	monitors_list: monitors_listInput,
	monitors_create: monitors_createInput,
	monitors_update: monitors_updateInput,
	monitors_delete: monitors_deleteInput,
	technologies_search: technologies_searchInput,
	technologies_lookup: technologies_lookupInput,
	usage_credits: usage_creditsInput,
	usage_summary: usage_summaryInput,
	usage_teamSummary: usage_teamSummaryInput,
} as const;

export const FindymailEndpointOutputSchemas = {
	verification_verify: verification_verifyOutput,
	lists_list: lists_listOutput,
	lists_create: lists_createOutput,
	lists_replace: lists_replaceOutput,
	lists_update: lists_updateOutput,
	lists_delete: lists_deleteOutput,
	contacts_list: contacts_listOutput,
	search_name: search_nameOutput,
	search_businessProfile: search_businessProfileOutput,
	exclusionLists_list: exclusionLists_listOutput,
	exclusionLists_create: exclusionLists_createOutput,
	exclusionLists_get: exclusionLists_getOutput,
	exclusionLists_update: exclusionLists_updateOutput,
	exclusionLists_delete: exclusionLists_deleteOutput,
	excludedDomains_list: excludedDomains_listOutput,
	excludedDomains_add: excludedDomains_addOutput,
	excludedDomains_remove: excludedDomains_removeOutput,
	intellimatch_search: intellimatch_searchOutput,
	intellimatch_status: intellimatch_statusOutput,
	intellimatch_results: intellimatch_resultsOutput,
	intellimatch_lookalikes: intellimatch_lookalikesOutput,
	search_reverseEmail: search_reverseEmailOutput,
	search_company: search_companyOutput,
	search_employees: search_employeesOutput,
	search_phone: search_phoneOutput,
	signals_list: signals_listOutput,
	signals_get: signals_getOutput,
	monitors_list: monitors_listOutput,
	monitors_create: monitors_createOutput,
	monitors_update: monitors_updateOutput,
	monitors_delete: monitors_deleteOutput,
	technologies_search: technologies_searchOutput,
	technologies_lookup: technologies_lookupOutput,
	usage_credits: usage_creditsOutput,
	usage_summary: usage_summaryOutput,
	usage_teamSummary: usage_teamSummaryOutput,
} as const;
