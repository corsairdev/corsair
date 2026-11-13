import { z } from 'zod';

// Object shapes come from the provider's response examples; loose objects preserve additional provider fields.
export const verification_verifyInput = z.object({ email: z.string() });
export const verification_verifyOutput = z
	.object({
		email: z.string(),
		verified: z.boolean(),
		provider: z.string().nullable().optional(),
	})
	.loose();

export const lists_listInput = z.object({});
export const lists_listOutput = z
	.object({
		lists: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						shared_with_team: z.boolean().optional(),
						is_owner: z.boolean().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const lists_createInput = z.object({ name: z.string() });
export const lists_createOutput = z
	.object({
		list: z
			.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
				created_at: z.string().optional(),
				updated_at: z.string().optional(),
				shared_with_team: z.boolean().optional(),
				is_owner: z.boolean().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export const lists_replaceInput = z.object({
	id: z.number().int().nonnegative(),
	name: z.string(),
	isShared: z.boolean(),
});
export const lists_replaceOutput = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		shared_with_team: z.boolean().optional(),
		is_owner: z.boolean().optional(),
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
					id: z.number().optional(),
					name: z.string().nullable().optional(),
					email: z.string().nullable().optional(),
					linkedin_url: z.string().nullable().optional(),
					company: z.string().nullable().optional(),
					job_title: z.string().nullable().optional(),
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
		name: z.string().optional(),
		domain: z.string().optional(),
		email: z.string().optional(),
	})
	.loose();

// Findymail shows direct results and callback payloads; validate both whenever present.
const searchContactResponse = z
	.object({
		contact: searchContact.optional(),
		payload: z.object({ contact: searchContact.optional() }).loose().optional(),
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
						id: z.number().int().optional(),
						name: z.string().optional(),
						is_shared: z.boolean().optional(),
						is_owner: z.boolean().optional(),
						user_id: z.number().int().optional(),
						owner_name: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const exclusionLists_createInput = z.object({
	name: z.string(),
	is_shared: z.boolean().optional(),
});
export const exclusionLists_createOutput = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		is_shared: z.boolean().optional(),
		is_owner: z.boolean().optional(),
	})
	.loose();

export const exclusionLists_getInput = z.object({
	excludedDomainList_id: z.number().int().nonnegative(),
});
export const exclusionLists_getOutput = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		is_shared: z.boolean().optional(),
		is_owner: z.boolean().optional(),
		user_id: z.number().int().optional(),
		owner_name: z.string().optional(),
	})
	.loose();

export const exclusionLists_updateInput = z.object({
	excludedDomainList_id: z.number().int().nonnegative(),
	name: z.string(),
	is_shared: z.boolean().optional(),
});
export const exclusionLists_updateOutput = z
	.object({
		success: z.boolean().optional(),
		list: z
			.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
				is_shared: z.boolean().optional(),
				is_owner: z.boolean().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export const exclusionLists_deleteInput = z.object({
	excludedDomainList_id: z.number().int().nonnegative(),
});
export const exclusionLists_deleteOutput = z
	.object({ success: z.boolean().optional() })
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
						id: z.number().int().optional(),
						domain: z.string().optional(),
						excluded_domain_list_id: z.number().int().nullable().optional(),
					})
					.loose(),
			)
			.optional(),
		current_page: z.number().int().optional(),
		per_page: z.number().int().optional(),
		total: z.number().int().optional(),
	})
	.loose();

export const excludedDomains_addInput = z.object({
	domains: z.array(z.string()),
	list_id: z.number().int().optional(),
});
export const excludedDomains_addOutput = z
	.object({
		success: z.boolean().optional(),
		total: z.number().int().optional(),
		processed_immediately: z.number().int().optional(),
		queued: z.number().int().optional(),
		list_id: z.number().int().optional(),
	})
	.loose();

export const excludedDomains_removeInput = z.object({
	ids: z.array(z.number().int()),
});
export const excludedDomains_removeOutput = z.union([
	z
		.object({
			success: z.boolean().optional(),
			deleted_count: z.number().int().optional(),
		})
		.loose(),
	z
		.object({
			success: z.boolean().optional(),
			deleted_count: z.number().int().optional(),
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
	.object({ hash: z.string().optional() })
	.loose();

export const intellimatch_statusInput = z.object({ hash: z.string() });
export const intellimatch_statusOutput = z
	.object({
		status: z.string().optional(),
		progress: z.number().int().optional(),
		total_jobs: z.number().int().optional(),
		processed_jobs: z.number().int().optional(),
		pending_jobs: z.number().int().optional(),
		failed_jobs: z.number().int().optional(),
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
						id: z.number().int().optional(),
						name: z.string().optional(),
						domain: z.string().optional(),
						description: z.string().optional(),
						employee_count_range: z.string().optional(),
						industries: z.array(z.string()).optional(),
						country: z.string().optional(),
						match_score: z.number().int().optional(),
						contact_name: z.string().optional(),
						contact_email: z.string().optional(),
						contact_job_title: z.string().optional(),
						contact_phone: z.string().optional(),
						contact_linkedin_url: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		meta: z
			.object({
				current_page: z.number().int().optional(),
				per_page: z.number().int().optional(),
				total: z.number().int().optional(),
				last_page: z.number().int().optional(),
				from: z.number().int().optional(),
				to: z.number().int().optional(),
			})
			.loose()
			.optional(),
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
						domain: z.string().optional(),
						name: z.string().optional(),
						linkedin_url: z.string().optional(),
						company_size: z.string().optional(),
						country: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		total: z.number().int().optional(),
		credits_used: z.number().int().optional(),
		message: z.string().optional(),
	})
	.loose();

export const search_reverseEmailInput = z.object({
	email: z.string(),
	with_profile: z.boolean().optional(),
});
export const search_reverseEmailOutput = z
	.object({
		linkedin_url: z.string().nullable().optional(),
		fullName: z.string().optional(),
		username: z.string().optional(),
		headline: z.string().optional(),
		jobTitle: z.string().optional(),
		summary: z.string().optional(),
		city: z.string().optional(),
		region: z.string().optional(),
		country: z.string().optional(),
		companyLinkedinUrl: z.string().optional(),
		companyName: z.string().optional(),
		companyWebsite: z.string().optional(),
		isPremium: z.boolean().optional(),
		isOpenProfile: z.boolean().optional(),
		// The provider examples leave the skills and jobs array item shapes unspecified.
		// Keep elements unknown rather than inventing a stricter profile contract.
		skills: z.array(z.unknown()).optional(),
		jobs: z.array(z.unknown()).optional(),
		educations: z
			.array(
				z
					.object({
						school: z.string().optional(),
						degree: z.string().optional(),
						fieldOfStudy: z.string().optional(),
						startDate: z.string().optional(),
						endDate: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		certificates: z
			.array(
				z
					.object({
						name: z.string().optional(),
						issuingOrganization: z.string().optional(),
						issueDate: z.string().optional(),
						expirationDate: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const search_companyInput = z.object({
	linkedin_url: z.string().optional(),
	domain: z.string().optional(),
	name: z.string().optional(),
});
export const search_companyOutput = z
	.object({
		name: z.string().optional(),
		domain: z.string().optional(),
		company_size: z.string().optional(),
		industry: z.string().optional(),
		linkedin_url: z.string().optional(),
		description: z.string().optional(),
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
			name: z.string().optional(),
			linkedinUrl: z.string().optional(),
			companyWebsite: z.string().optional(),
			companyName: z.string().optional(),
			jobTitle: z.string().optional(),
		})
		.loose(),
);

export const search_phoneInput = z.object({ linkedin_url: z.string() });
export const search_phoneOutput = z.union([
	z
		.object({
			phone: z.string().nullable().optional(),
			line_type: z.string().nullable().optional(),
		})
		.loose(),
	z
		.object({
			phone: z.string().nullable().optional(),
			line_type: z.string().nullable().optional(),
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
						id: z.number().int().optional(),
						type: z.string().optional(),
						category: z.string().optional(),
						payload: z
							.object({
								matched_keyword: z.string().optional(),
								snippet: z.string().optional(),
							})
							.loose()
							.optional(),
						detected_at: z.string().optional(),
						expires_at: z.string().optional(),
						contact: z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								job_title: z.string().optional(),
								linkedin_url: z.string().optional(),
							})
							.loose()
							.optional(),
						company: z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								domain: z.string().optional(),
								industry: z.string().optional(),
								employee_count_range: z.string().optional(),
								country: z.string().optional(),
							})
							.loose()
							.optional(),
						monitors: z
							.array(
								z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										keywords: z.array(z.string()).optional(),
										enrichment_level: z.string().optional(),
										relevance_score: z.number().int().optional(),
										relevance_reasoning: z.string().optional(),
									})
									.loose(),
							)
							.optional(),
					})
					.loose(),
			)
			.optional(),
		meta: z
			.object({
				current_page: z.number().int().optional(),
				per_page: z.number().int().optional(),
				total: z.number().int().optional(),
				last_page: z.number().int().optional(),
				from: z.number().int().optional(),
				to: z.number().int().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export const monitors_listInput = z.object({
	ownership: z.string().optional(),
});
export const monitors_listOutput = z.array(
	z
		.object({
			id: z.number().int().optional(),
			name: z.string().optional(),
			signal_type: z.string().optional(),
			signal_type_label: z.string().optional(),
			signal_level: z.string().optional(),
			status: z.string().optional(),
			keywords: z.array(z.string()).optional(),
			icp_filters: z
				.object({
					industries: z.array(z.string()).optional(),
					countries: z.array(z.string()).optional(),
				})
				.loose()
				.nullable()
				.optional(),
			webhook_url: z.string().nullable().optional(),
			webhook_paused_at: z.string().nullable().optional(),
			post_url: z.string().nullable().optional(),
			profile_url: z.string().nullable().optional(),
			engagement_types: z.string().nullable().optional(),
			enrichment_level: z.string().nullable().optional(),
			lead_list_id: z.string().nullable().optional(),
			ai_relevance_prompt: z.string().nullable().optional(),
			target_companies: z.string().nullable().optional(),
			max_matches: z.number().int().nullable().optional(),
			match_count: z.number().int().optional(),
			is_shared: z.boolean().optional(),
			is_owner: z.boolean().optional(),
			is_team_owner: z.boolean().optional(),
			uses_current_users_monitor_cap: z.boolean().optional(),
			user_id: z.number().int().optional(),
			owner_name: z.string().optional(),
			created_at: z.string().optional(),
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
		id: z.number().int().optional(),
		name: z.string().optional(),
		signal_type: z.string().optional(),
		signal_type_label: z.string().optional(),
		signal_level: z.string().optional(),
		status: z.string().optional(),
		keywords: z.array(z.string()).optional(),
		icp_filters: z.string().nullable().optional(),
		webhook_url: z.string().nullable().optional(),
		webhook_paused_at: z.string().nullable().optional(),
		post_url: z.string().nullable().optional(),
		profile_url: z.string().nullable().optional(),
		engagement_types: z.string().nullable().optional(),
		enrichment_level: z.string().nullable().optional(),
		lead_list_id: z.string().nullable().optional(),
		ai_relevance_prompt: z.string().nullable().optional(),
		target_companies: z.string().nullable().optional(),
		max_matches: z.number().int().nullable().optional(),
		match_count: z.number().int().optional(),
		is_shared: z.boolean().optional(),
		is_owner: z.boolean().optional(),
		is_team_owner: z.boolean().optional(),
		uses_current_users_monitor_cap: z.boolean().optional(),
		user_id: z.number().int().optional(),
		owner_name: z.string().optional(),
		created_at: z.string().optional(),
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
		id: z.number().int().optional(),
		name: z.string().optional(),
		signal_type: z.string().optional(),
		signal_type_label: z.string().optional(),
		signal_level: z.string().optional(),
		status: z.string().optional(),
		keywords: z.array(z.string()).optional(),
		icp_filters: z.string().nullable().optional(),
		webhook_url: z.string().nullable().optional(),
		webhook_paused_at: z.string().nullable().optional(),
		post_url: z.string().nullable().optional(),
		profile_url: z.string().nullable().optional(),
		engagement_types: z.string().nullable().optional(),
		enrichment_level: z.string().nullable().optional(),
		lead_list_id: z.string().nullable().optional(),
		ai_relevance_prompt: z.string().nullable().optional(),
		target_companies: z.string().nullable().optional(),
		max_matches: z.number().int().nullable().optional(),
		match_count: z.number().int().optional(),
		is_shared: z.boolean().optional(),
		is_owner: z.boolean().optional(),
		is_team_owner: z.boolean().optional(),
		user_id: z.number().int().optional(),
		owner_name: z.string().optional(),
		created_at: z.string().optional(),
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
		id: z.number().int().optional(),
		type: z.string().optional(),
		category: z.string().optional(),
		payload: z
			.object({
				matched_keyword: z.string().optional(),
				snippet: z.string().optional(),
			})
			.loose()
			.optional(),
		detected_at: z.string().optional(),
		expires_at: z.string().optional(),
		contact: z
			.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
				job_title: z.string().optional(),
				linkedin_url: z.string().optional(),
			})
			.loose()
			.optional(),
		company: z
			.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
				domain: z.string().optional(),
				industry: z.string().optional(),
				employee_count_range: z.string().optional(),
				country: z.string().optional(),
			})
			.loose()
			.optional(),
		monitors: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						keywords: z.array(z.string()).optional(),
						enrichment_level: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const technologies_searchInput = z.object({ q: z.string() });
export const technologies_searchOutput = z
	.object({
		data: z
			.array(
				z
					.object({
						name: z.string().optional(),
						category: z.string().nullable().optional(),
						subcategory: z.string().nullable().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const technologies_lookupInput = z.object({
	domain: z.string(),
	technologies: z.array(z.string()).optional(),
});
export const technologies_lookupOutput = z
	.object({
		domain: z.string().optional(),
		technologies: z
			.array(
				z
					.object({
						name: z.string().optional(),
						category: z.string().nullable().optional(),
						subcategory: z.string().nullable().optional(),
						last_detected_at: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const usage_creditsInput = z.object({ type: z.string().optional() });
export const usage_creditsOutput = z.union([
	z
		.object({
			credits: z.number().int().optional(),
			email: z.string().optional(),
			has_capacity: z.boolean().nullable().optional(),
			verifier_credits: z.number().int().optional(),
		})
		.loose(),
	z
		.object({
			credits: z.number().int().optional(),
			email: z.string().optional(),
			has_capacity: z.boolean().nullable().optional(),
			verifier_credits: z.number().int().optional(),
		})
		.loose(),
]);

export const usage_summaryInput = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
});
export const usage_summaryOutput = z
	.object({
		from: z.string().optional(),
		to: z.string().optional(),
		total: z
			.object({
				finder: z.number().int().optional(),
				verifier: z.number().int().optional(),
			})
			.loose()
			.optional(),
		items: z
			.array(
				z
					.object({
						date: z.string().optional(),
						finder: z.number().int().optional(),
						verifier: z.number().int().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const usage_teamSummaryInput = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
});
export const usage_teamSummaryOutput = z
	.object({
		from: z.string().optional(),
		to: z.string().optional(),
		total: z
			.object({
				finder: z.number().int().optional(),
				verifier: z.number().int().optional(),
			})
			.loose()
			.optional(),
		members: z
			.array(
				z
					.object({
						name: z.string().optional(),
						finder: z.number().int().optional(),
						verifier: z.number().int().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const lists_updateInput = z.object({
	id: z.number().int().nonnegative(),
	name: z.string(),
	isShared: z.boolean(),
});
export const lists_updateOutput = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		shared_with_team: z.boolean().optional(),
		is_owner: z.boolean().optional(),
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
