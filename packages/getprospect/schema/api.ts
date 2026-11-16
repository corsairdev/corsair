import { z } from 'zod';

// Runtime schemas generated from the official OpenAPI contract: https://api.getprospect.com/api-docs/openapi.json.
// Request-reachable objects are strict; response objects retain documented forward-compatible fields.
export const SchemaAccountStatus = z
	.enum([
		'allowed_payment',
		'not_allowed_payment',
		'blocked',
		'pending_review',
		'permanently_deleted',
		'russian_suspended',
		'pending_phone_verification',
	])
	.nullable();
export const SchemaAiIndustry = z.enum([
	'Software and IT',
	'Healthcare and Life Sciences',
	'Finance and Insurance',
	'Energy, Utilities and Environmental Services',
	'Industrial Manufacturing and Materials',
	'Real Estate and Construction',
	'Retail and Consumer Channels',
	'Transportation and Logistics',
	'Professional, Business and Legal Services',
	'Education and Training',
	'Media, Entertainment and Culture',
	'Hospitality, Food and Travel Services',
	'Personal and Home Services',
	'Agriculture, Forestry and Fisheries',
	'Automotive, Aerospace and Defense Manufacturing',
	'Non-Profit, Public Sector and Education (Non-Commercial)',
	'AI and ML Platforms',
	'Agriculture and Forestry Software',
	'Blockchain and Web3',
	'Carriers and ISPs',
	'Cloud and Infrastructure Software',
	'Consumer Software',
	'Data and Analytics Software',
	'Developer Tools and Platforms',
	'Enterprise Software Solutions',
	'Financial Services Software',
	'Government and Public Sector Software',
	'Hardware and Networking',
	'Healthcare Software',
	'IoT and Embedded Systems Software',
	'IT Services and Cybersecurity',
	'Manufacturing Software',
	'Metaverse, AR/VR and Other Emerging Platforms',
	'Quantum Computing Software',
	'Real Estate and PropTech Software',
	'Retail and Ecommerce Software',
	'Security and Identity Software',
	'Biotechnology and Pharmaceuticals',
	'Digital Health and Telemedicine',
	'Hospitals, Clinics and Outpatient Care',
	'Medical Devices and Diagnostic Equipment',
	'Medical Testing and Clinical Laboratories',
	'Mental Health and Rehabilitation Services',
	'Pharma Distribution and CRO Services',
	'Banking and Lending',
	'Capital Markets and Cryptocurrency',
	'Cryptocurrency and Blockchain Services',
	'Financial Services Platforms',
	'Insurance and InsurTech',
	'Investment Management and WealthTech',
	'Venture Capital and Private Equity',
	'Electric Power and Grid Management',
	'Nuclear and Advanced Generation',
	'Oil and Gas Exploration, Production and Services',
	'Renewable Energy and Clean Tech',
	'Sustainability Tech and Environmental Consulting',
	'Water, Waste and Environmental Management',
	'3D Printing and Advanced Manufacturing',
	'Building Materials and Chemicals',
	'Consumer Goods and Appliances',
	'Electronics and Computer Equipment',
	'Food, Beverage and Tobacco Production',
	'Industrial Machinery and Equipment',
	'Mining, Metals and Natural Resources',
	'Architecture, Urban Planning and Green Building',
	'Commercial Real Estate Development and Leasing',
	'Construction and Civil Engineering Services',
	'Property and Facility Management',
	'Residential Real Estate Development and Brokerage',
	'Specialty Construction Products',
	'Automotive Service and Collision Repair',
	'Brick-and-Mortar Retail',
	'Media and Entertainment Retail',
	'Online Commerce and Marketplaces',
	'Retail Technology',
	'Specialty Auctions and Collectibles',
	'Wholesale and Distribution',
	'Autonomous Vehicles and Drone Delivery',
	'Car and Truck Rental',
	'Freight and Cargo',
	'Logistics Technology',
	'Passenger Transit and Mobility',
	'Warehousing, Fulfillment and 3PL Services',
	'Accounting, Audit and Financial Advisory',
	'Advertising, Marketing and Multimedia Design',
	'Defense and Government Services',
	'Facilities Management and Commercial Cleaning',
	'Human Resources, Staffing and Recruitment',
	'Legal Services and Regulatory Compliance',
	'Management Consulting and Strategy Consulting',
	'Translation, Document and Information Management',
	'Corporate Training and Learning and Development',
	'E-Learning Platforms and EdTech',
	'K-12 and Higher Education Institutions',
	'Test Prep, Tutoring and After-School Services',
	'Vocational Training and Certification Programs',
	'Digital Publishing and Streaming Platforms',
	'Film, Television and Broadcasting',
	'Gaming, Esports and Interactive Entertainment',
	'Live Events, Experiences and Ticketed Attractions',
	'Museums, Art Galleries and Cultural Preservation',
	'Music, Audio and Podcast Services',
	'Sports and Recreation',
	'Food and Beverage Services',
	'Hospitality and Lodging',
	'Travel Agencies and Leisure Services',
	'Funeral Homes and Related Services',
	'Home Services',
	'Personal Care and Wellness',
	'Veterinary Care and Pet Services',
	'AgriTech and Precision Farming',
	'Aquaculture and Fisheries',
	'Crop Farming and Livestock Production',
	'Farming Equipment and Supplies',
	'Forestry, Logging and Wood Products',
	'Mining and Extraction',
	'Aviation and Aerospace Component Manufacturing',
	'Automotive and Rental Retail',
	'Commercial Space Innovation',
	'Defense Systems and Marine Manufacturing',
	'Motor Vehicle and Parts Manufacturing',
	'Government Administration and Municipal Services',
	'NGOs, Charities and Community Organizations',
	'Public Healthcare and Social Services',
	'Public/Private Research Institutions and Educational Foundations',
	'Student Organizations and Campus Services',
]);
export const SchemaAiIndustryFilter = z
	.object({
		include: z.array(SchemaAiIndustry).max(126).optional(),
		exclude: z.array(SchemaAiIndustry).max(126).optional(),
	})
	.strict();
export const SchemaErrorName = z.enum([
	'VALIDATION_ERROR',
	'UNAUTHORIZED',
	'PAYMENT_REQUIRED',
	'FORBIDDEN',
	'NOT_FOUND',
	'NOT_SAVED',
	'TIMEOUT',
	'REQUEST_TIMEOUT',
	'CONFLICT',
	'GONE',
	'LIST_TOO_LARGE',
	'TOO_MANY_LISTS',
	'LIMIT_REACHED',
	'RATE_LIMIT',
	'TOO_MANY_CONCURRENT_REQUESTS',
	'INTERNAL_ERROR',
	'SAVE_FAILED',
	'EXPORT_FAILED',
	'UPSTREAM_ERROR',
	'UNAVAILABLE',
	'bulk_action_running',
	'VERIFICATION_ERROR',
]);
export const SchemaErrorCode = z.enum([
	'unknown_field',
	'conflicting_fields',
	'missing_field',
	'wrong_type',
	'value_not_allowed',
	'out_of_range',
	'invalid_format',
	'invalid_value',
	'session_required',
	'admin_required',
	'idempotency_key_reused',
	'idempotency_in_progress',
	'idempotency_response_unavailable',
	'idempotency_outcome_unknown',
	'ai_daily_limit',
	'idempotency_unavailable',
	'bulk_action_running',
	'invalid_state',
	'limit_reached',
	'results_unavailable',
	'results_expired',
	'rate_limit_exceeded',
	'job_exceeds_plan_limit',
	'billing_operation_in_progress',
	'cancellation_cooling_down',
	'payment_state_unknown',
	'temporarily_disabled',
	'slug_taken',
	'payment_captured_update_failed',
	'payment_processing_failed',
	'payment_declined',
	'use_checkout',
	'use_fastspring_order',
	'use_phone_addon_update',
	'phone_addon_requires_plan',
	'not_eligible',
	'plan_not_found',
	'billing_cycle_not_found',
	'subscription_not_found',
	'no_stripe_customer',
	'account_not_owned',
	'coupon_invalid',
	'coupon_own_workspace',
	'account_not_new',
	'coupon_already_applied',
	'retention_offer_invalid',
	'payout_profile_missing',
	'minimum_balance',
	'payout_request_open',
	'payout_profile_conflict',
	'already_pending',
	'not_reviewable',
	'email_taken',
	'phone_taken',
	'not_required',
	'deletion_blocked',
	'already_verified',
	'expired',
	'no_bounce',
	'already_kept',
	'cannot_reactivate',
	'in_progress',
	'charge_lock_busy',
	'already_member',
	'already_invited',
	'cannot_remove_admin',
	'invite_limit_reached',
	'workspace_required',
	'integration_not_connected',
	'integration_paused',
	'activation_blocked',
	'connection_owner_only',
	'spreadsheet_missing',
	'push_all_starting',
	'vendor_auth_failed',
	'vendor_permission_missing',
	'vendor_rate_limited',
	'vendor_unavailable',
	'vendor_rejected',
	'creator_removed',
	'creator_mismatch',
	'credential_in_query',
	'ticket_invalid',
	'token_expired',
	'too_many_tickets',
	'too_many_streams',
	'oauth_exchange_failed',
	'email_missing',
	'mailbox_error',
	'not_draft',
	'not_launched',
	'sequence_not_draft',
	'sequence_completed',
	'plan_required',
	'mailbox_missing',
	'mailbox_disconnected',
	'mailbox_inactive',
	'mailbox_bounce_rate',
	'dns_invalid',
	'no_steps',
	'first_step_subject_missing',
	'schedule_missing',
	'step_body_empty',
	'no_leads',
	'step_limit',
	'last_step',
	'last_variant',
	'not_a_permutation',
	'liquid_syntax',
	'lead_opted_out',
	'liquid_render_failed',
	'attachment_limit',
	'upload_not_found',
	'upload_purpose_mismatch',
	'default_schedule',
	'folder_cycle',
	'mailbox_send_failed',
	'too_many_recipients',
	'already_exists',
]);
export const SchemaErrorPayload = z
	.object({
		code: SchemaErrorCode.optional(),
		field: z.string().optional(),
		received_value: z.json().optional(),
		received_type: z.string().optional(),
		invalid_values: z.json().optional(),
		allowed_values: z.array(z.union([z.string(), z.number()])).optional(),
		enum: z.string().optional(),
		did_you_mean: z.string().optional(),
		suggested_values: z
			.array(
				z
					.object({ value: z.json(), suggestions: z.array(z.string()) })
					.passthrough(),
			)
			.max(5)
			.optional(),
		position: z.number().int().optional(),
		allowed_fields: z.array(z.string()).optional(),
		constraints: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();
export const SchemaApiError = z
	.object({
		name: SchemaErrorName,
		message: z.string(),
		payload: SchemaErrorPayload.optional(),
	})
	.passthrough();
export const SchemaApiLog = z
	.object({
		id: z.string(),
		time: z.iso.datetime().nullable(),
		key_id: z.string().nullable(),
		key_name: z.string(),
		method: z.string(),
		path: z.string(),
		status_code: z.number().int(),
		duration_ms: z.number().int().min(0),
		request_body: z.string().nullable(),
	})
	.passthrough();
export const SchemaCursorPagination = z
	.object({
		per_page: z.number().int().min(1),
		has_more: z.boolean(),
		next_cursor: z.string().nullable(),
	})
	.passthrough();
export const SchemaApiLogsListMetadata = z
	.object({ timestamp: z.iso.datetime(), pagination: SchemaCursorPagination })
	.passthrough();
export const SchemaEnvelopeMetadata = z
	.object({ timestamp: z.iso.datetime() })
	.passthrough();
export const SchemaEnvelope = z
	.object({
		success: z.boolean(),
		data: z.json(),
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaApiLogsListResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaApiLog).max(500),
		metadata: SchemaApiLogsListMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaSubscriptionStatus = z.enum(['active', 'pause', 'disabled']);
export const SchemaPlanCredits = z
	.object({
		email_search: z.number().int(),
		email_verification: z.number().int(),
		phone_search: z.number().int(),
	})
	.passthrough();
export const SchemaPlanSummary = z
	.object({
		id: z.string().regex(new RegExp('^[0-9a-f]{24}$')),
		name: z.string().nullable(),
		price: z.number().nullable(),
		currency: z.string().nullable(),
		is_custom: z.boolean(),
		credits: SchemaPlanCredits,
		wallet_plan_credit: z.boolean(),
	})
	.passthrough()
	.nullable();
export const SchemaPaymentGateway = z.enum(['stripe', 'fastspring']).nullable();
export const SchemaSubscription = z
	.object({
		status: SchemaSubscriptionStatus,
		plan: SchemaPlanSummary,
		quantity: z.number().int(),
		billing_cycle: z
			.object({
				id: z.string().regex(new RegExp('^[0-9a-f]{24}$')),
				name: z.string().nullable(),
				period: z.string().nullable(),
				discount: z.number().nullable(),
			})
			.passthrough()
			.nullable(),
		started_at: z.iso.datetime().nullable(),
		expires_at: z.iso.datetime().nullable(),
		next_plan: SchemaPlanSummary,
		phone_addon: z
			.object({
				status: z.enum(['active', 'pause', 'disabled']).nullable(),
				plan: SchemaPlanSummary,
				quantity: z.number().int(),
			})
			.passthrough(),
		pause: z
			.object({
				started_at: z.iso.datetime().nullable(),
				period_months: z.number().int().nullable(),
				discount_percent: z.number().nullable(),
				resumes_at: z.iso.datetime().nullable(),
			})
			.passthrough()
			.nullable(),
		discount: z
			.object({
				percent: z.number(),
				status: z.string().nullable(),
				months_left: z.number().int().nullable(),
			})
			.passthrough()
			.nullable(),
		payer: z.enum(['individual', 'company']).nullable(),
		gateway: SchemaPaymentGateway,
	})
	.passthrough()
	.nullable();
export const SchemaBillingSubscriptionGetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaSubscription,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaBlockedCompany = z
	.object({
		id: z.string().regex(new RegExp('^[0-9a-f]{24}$')),
		domain: z.string(),
		created_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaBlockedPerson = z
	.object({
		id: z.string().regex(new RegExp('^[0-9a-f]{24}$')),
		first_name: z.string(),
		last_name: z.string(),
		linkedin_url: z.url().nullable(),
		company_domain: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaBlocklistCompaniesAddItem = z
	.object({
		domain: z.string().max(200),
		identifier: z.string().max(200).optional(),
	})
	.strict();
export const SchemaBlocklistCompaniesAddRequest = z
	.object({ data: z.array(SchemaBlocklistCompaniesAddItem).min(1).max(1000) })
	.strict();
export const SchemaBlocklistCompanyResult = z
	.object({
		identifiers: z.array(z.string()).min(1),
		blocked_company: SchemaBlockedCompany,
	})
	.passthrough();
export const SchemaBulkInvalidItem = z
	.object({
		identifier: z.string(),
		code: z.enum([
			'missing_field',
			'invalid_format',
			'wrong_type',
			'out_of_range',
		]),
		field: z.string().nullable(),
		reason: z.string(),
	})
	.passthrough();
export const SchemaBlocklistCompaniesAddResult = z
	.object({
		added: z.array(SchemaBlocklistCompanyResult),
		already_blocked: z.array(SchemaBlocklistCompanyResult),
		invalid: z.array(SchemaBulkInvalidItem),
	})
	.passthrough();
export const SchemaBulkAddCounts = z
	.object({
		timestamp: z.iso.datetime(),
		total: z.number().int().min(1),
		added_count: z.number().int().min(0),
		already_blocked_count: z.number().int().min(0),
		invalid_count: z.number().int().min(0),
	})
	.passthrough();
export const SchemaBlocklistCompaniesAddResponse = z
	.object({
		success: z.boolean(),
		data: SchemaBlocklistCompaniesAddResult,
		metadata: SchemaBulkAddCounts,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaBlocklistDeleteResult = z
	.object({
		deleted_ids: z.array(z.string().regex(new RegExp('^[0-9a-f]{24}$'))).min(1),
	})
	.passthrough();
export const SchemaBlocklistCompaniesDeleteResponse = z
	.object({
		success: z.boolean(),
		data: SchemaBlocklistDeleteResult,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPagination = z
	.object({
		page: z.number().int().min(1),
		per_page: z.number().int().min(1),
		total_pages: z.number().int().min(1),
		total_count: z.number().int().min(0),
		max_page: z.number().int().min(1).optional(),
		truncated: z.boolean().optional(),
	})
	.passthrough();
export const SchemaBlocklistListMetadata = z
	.object({ timestamp: z.iso.datetime(), pagination: SchemaPagination })
	.passthrough();
export const SchemaBlocklistCompaniesListResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaBlockedCompany),
		metadata: SchemaBlocklistListMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaBlocklistPeopleAddItem = z
	.object({
		first_name: z.string().max(200),
		last_name: z.string().max(200),
		linkedin_url: z.string().max(200).optional(),
		identifier: z.string().max(200).optional(),
	})
	.strict();
export const SchemaBlocklistPeopleAddRequest = z
	.object({ data: z.array(SchemaBlocklistPeopleAddItem).min(1).max(1000) })
	.strict();
export const SchemaBlocklistPersonResult = z
	.object({
		identifiers: z.array(z.string()).min(1),
		blocked_person: SchemaBlockedPerson,
	})
	.passthrough();
export const SchemaBlocklistPeopleAddResult = z
	.object({
		added: z.array(SchemaBlocklistPersonResult),
		already_blocked: z.array(SchemaBlocklistPersonResult),
		invalid: z.array(SchemaBulkInvalidItem),
	})
	.passthrough();
export const SchemaBlocklistPeopleAddResponse = z
	.object({
		success: z.boolean(),
		data: SchemaBlocklistPeopleAddResult,
		metadata: SchemaBulkAddCounts,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaBlocklistPeopleDeleteResponse = z
	.object({
		success: z.boolean(),
		data: SchemaBlocklistDeleteResult,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaBlocklistPeopleListResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaBlockedPerson),
		metadata: SchemaBlocklistListMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaCompanyBusinessType = z.enum([
	'B2B',
	'B2C',
	'Nonprofit',
	'Unknown',
]);
export const SchemaBusinessTypeFilter = z
	.object({
		include: z.array(SchemaCompanyBusinessType).max(4).optional(),
		exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
	})
	.strict();
export const SchemaCompanyLookupField = z.enum([
	'id',
	'linkedin_id',
	'linkedin_url',
	'domain',
	'name',
	'name_search',
]);
export const SchemaCompaniesBulkEnrichInvalid = z
	.object({
		identifier: z.string(),
		reason: z.string(),
		skipped: z
			.array(
				z
					.object({ field: SchemaCompanyLookupField, reason: z.string() })
					.passthrough(),
			)
			.optional(),
		unknown_fields: z.array(z.string()).optional(),
	})
	.passthrough();
export const SchemaCompaniesBulkEnrichItem = z
	.object({
		identifier: z.string().optional(),
		id: z.string().optional(),
		linkedin_id: z.union([z.string(), z.number().int()]).optional(),
		linkedin_url: z.string().optional(),
		domain: z.string().optional(),
		name: z.string().optional(),
	})
	.strict();
export const SchemaCompanySocialNetworks = z
	.object({
		linkedin_url: z.url().nullable(),
		facebook_url: z.url().nullable(),
		twitter_url: z.url().nullable(),
		instagram_url: z.url().nullable(),
		youtube_url: z.url().nullable(),
		tiktok_url: z.url().nullable(),
		crunchbase_url: z.url().nullable(),
		github_url: z.url().nullable(),
		pinterest_url: z.url().nullable(),
	})
	.passthrough();
export const SchemaCompanyLocation = z
	.object({
		city: z.string().nullable(),
		state: z.string().nullable(),
		state_code: z.string().nullable(),
		country: z.string().nullable(),
		country_code: z.string().nullable(),
		raw_address: z.string().nullable(),
	})
	.passthrough()
	.nullable();
export const SchemaCompanyTechnology = z
	.object({
		id: z.string().regex(new RegExp('^[1-9][0-9]*$')),
		name: z.string(),
		icon_url: z.url().nullable(),
		website: z.string().nullable(),
		categories: z.array(
			z.object({ id: z.string(), name: z.string() }).passthrough(),
		),
	})
	.passthrough();
export const SchemaPersonSavedList = z
	.object({
		id: z.string(),
		name: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaCompanyEdits = z
	.object({ name: z.string().optional() })
	.passthrough();
export const SchemaCompanySaved = z
	.object({
		id: z.string().nullable(),
		saved_at: z.iso.datetime().nullable(),
		list_ids: z.array(z.string()),
		lists: z.array(SchemaPersonSavedList).optional(),
		edits: SchemaCompanyEdits.optional(),
	})
	.passthrough()
	.nullable();
export const SchemaCompany = z
	.object({
		id: z.string().regex(new RegExp('^[0-9a-f]{24}$')),
		name: z.string().nullable(),
		description: z.string().nullable(),
		logo: z.url().nullable(),
		website: z.string().nullable(),
		email: z
			.object({
				domain: z.string().nullable(),
				provider: z.string().nullable(),
			})
			.passthrough(),
		linkedin_url: z.url().nullable(),
		linkedin_id: z.number().int().min(1).nullable(),
		social_networks: SchemaCompanySocialNetworks,
		industry: z.string().nullable(),
		keywords: z.array(z.string()),
		naics_codes: z.array(z.number().int()),
		ai_industries: z.array(z.string()),
		type: z.string().nullable(),
		business_type: z.string().nullable(),
		revenue_stream: z.string().nullable(),
		founded: z.number().int().nullable(),
		employee_count: z.number().int().nullable(),
		employee_range: z.string().nullable(),
		location: SchemaCompanyLocation,
		other_locations: z.array(SchemaCompanyLocation),
		technologies: z.array(SchemaCompanyTechnology).optional(),
		technologies_checked_at: z.iso.datetime().nullable().optional(),
		saved: SchemaCompanySaved,
	})
	.passthrough();
export const SchemaCompaniesBulkEnrichMatched = z
	.object({
		identifier: z.string(),
		matched_by: SchemaCompanyLookupField,
		company: SchemaCompany,
	})
	.passthrough();
export const SchemaCompaniesBulkEnrichMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		total: z.number().int().min(0),
		matched_count: z.number().int().min(0),
		not_matched_count: z.number().int().min(0),
		invalid_count: z.number().int().min(0),
	})
	.passthrough();
export const SchemaCompaniesBulkEnrichNotMatched = z
	.object({
		identifier: z.string(),
		attempted: z.array(SchemaCompanyLookupField),
	})
	.passthrough();
export const SchemaCompaniesBulkEnrichRequest = z
	.object({ data: z.array(SchemaCompaniesBulkEnrichItem).min(1).max(50) })
	.strict();
export const SchemaCompaniesBulkEnrichResult = z
	.object({
		matched: z.array(SchemaCompaniesBulkEnrichMatched),
		not_matched: z.array(SchemaCompaniesBulkEnrichNotMatched),
		invalid: z.array(SchemaCompaniesBulkEnrichInvalid),
	})
	.passthrough();
export const SchemaCompaniesBulkEnrichResponse = z
	.object({
		success: z.boolean(),
		data: SchemaCompaniesBulkEnrichResult,
		metadata: SchemaCompaniesBulkEnrichMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaJobType = z.enum([
	'people_export',
	'companies_export',
	'csv_enrichment',
	'email_verification',
	'people_delete',
	'companies_delete',
	'people_lists_set',
	'companies_lists_set',
	'list_delete',
	'trash_restore',
	'integration_push_all',
	'people_save_search',
	'people_enrich_search',
	'companies_save_search',
	'sequences_leads_enroll',
	'sequences_leads_pause',
	'sequences_leads_opt_out',
	'sequences_leads_resume',
	'sequences_leads_remove',
]);
export const SchemaJobStatus = z.enum([
	'queued',
	'running',
	'awaiting_confirmation',
	'done',
	'failed',
	'cancelled',
]);
export const SchemaJobBase = z
	.object({
		id: z.string(),
		type: SchemaJobType,
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaDeleteResult = z
	.object({
		deleted: z.number().int().min(0),
		skipped: z.number().int().min(0),
	})
	.passthrough();
export const SchemaCompaniesDeleteJob = z
	.object({
		id: z.string(),
		type: z.literal('companies_delete'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				deleted: z.number().int().min(0),
				skipped: z.number().int().min(0),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaCompaniesEditsUpdateRequest = z
	.object({ name: z.string().max(200).nullable().optional() })
	.strict();
export const SchemaCompaniesEditsUpdateResult = z
	.object({ id: z.string(), edits: SchemaCompanyEdits })
	.passthrough();
export const SchemaCompaniesEditsUpdateResponse = z
	.object({
		success: z.boolean(),
		data: SchemaCompaniesEditsUpdateResult,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaCompaniesEnrichLookup = z
	.object({
		id: z.string().optional(),
		linkedin_id: z.union([z.string(), z.number().int()]).optional(),
		linkedin_url: z.string().optional(),
		domain: z.string().optional(),
		name: z.string().optional(),
	})
	.strict();
export const SchemaCompaniesEnrichMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		matched_by: SchemaCompanyLookupField.optional(),
	})
	.passthrough();
export const SchemaCompaniesEnrichRequest = z
	.object({
		data: z
			.object({
				id: z.string().optional(),
				linkedin_id: z.union([z.string(), z.number().int()]).optional(),
				linkedin_url: z.string().optional(),
				domain: z.string().optional(),
				name: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const SchemaCompaniesEnrichResponse = z
	.object({
		success: z.boolean(),
		data: SchemaCompany.nullable(),
		metadata: SchemaCompaniesEnrichMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaCompaniesEnrichmentItem = z
	.object({
		identifier: z.string().max(128).optional(),
		linkedin_url: z.string().max(512).optional(),
		domain: z.string().max(512).optional(),
		name: z.string().max(512).optional(),
	})
	.strict();
export const SchemaCompaniesEnrichmentCreateRequest = z
	.object({
		name: z.string().max(128).optional(),
		data: z.array(SchemaCompaniesEnrichmentItem).min(1).max(10000),
	})
	.strict();
export const SchemaCompaniesExportJob = z
	.object({
		id: z.string(),
		type: z.literal('companies_export'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaCompanyFilterIds = z
	.object({
		include: z.array(z.string()).max(20000).optional(),
		exclude: z.array(z.string()).max(20000).optional(),
	})
	.strict();
export const SchemaCompanyFilterStrings = z
	.object({
		include: z.array(z.string().min(1).max(512)).max(500).optional(),
		exclude: z.array(z.string().max(512)).max(500).optional(),
	})
	.strict();
export const SchemaCompanyLinkedinIdFilter = z
	.object({
		include: z.array(z.number().int().min(1)).max(500).optional(),
		exclude: z.array(z.number().int().min(1)).max(500).optional(),
	})
	.strict();
export const SchemaCompanyIdentityFilters = z
	.object({
		id: z
			.object({
				include: z.array(z.string()).max(20000).optional(),
				exclude: z.array(z.string()).max(20000).optional(),
			})
			.strict()
			.optional(),
		name: z
			.object({
				include: z.array(z.string().min(1).max(512)).max(500).optional(),
				exclude: z.array(z.string().max(512)).max(500).optional(),
			})
			.strict()
			.optional(),
		domain: z
			.object({
				include: z.array(z.string().min(1).max(512)).max(500).optional(),
				exclude: z.array(z.string().max(512)).max(500).optional(),
			})
			.strict()
			.optional(),
		linkedin_id: z
			.object({
				include: z.array(z.number().int().min(1)).max(500).optional(),
				exclude: z.array(z.number().int().min(1)).max(500).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const SchemaCompanyType = z.enum([
	'Privately Held',
	'Public Company',
	'Non Profit',
	'Self Owned',
	'Self Employed',
	'Partnership',
	'Educational',
	'Government Agency',
	'Unknown',
]);
export const SchemaCompanyTypeFilter = z
	.object({
		include: z.array(SchemaCompanyType).max(9).optional(),
		exclude: z.array(SchemaCompanyType).max(9).optional(),
	})
	.strict();
export const SchemaCompanyRevenueStream = z.enum([
	'Professional Services',
	'Product Sales',
	'Grants / Donations',
	'Subscriptions / Recurring',
	'Project / Contract Work',
	'Event / Experience Revenue',
	'Transaction Fees',
	'Rental / Leasing',
	'Advertising',
	'Financial Services',
	'Licensing / IP',
	'Unknown',
]);
export const SchemaRevenueStreamFilter = z
	.object({
		include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
		exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
	})
	.strict();
export const SchemaCompanyFilterCountry = z
	.object({
		include: z.array(z.string().min(1).max(512)).max(500).optional(),
		exclude: z.array(z.string().max(512)).max(500).optional(),
		headquarters_only: z.boolean().optional(),
	})
	.strict();
export const SchemaCompanyLocationFilter = z
	.object({
		include: z.array(z.string().min(2).max(200)).max(100).optional(),
		exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
		headquarters_only: z.boolean().optional(),
	})
	.strict();
export const SchemaCompanyEmployeeRange = z.enum([
	'1-10',
	'11-50',
	'51-200',
	'201-500',
	'501-1000',
	'1001-5000',
	'5001-10000',
	'10001+',
]);
export const SchemaCompanyFilterRange = z
	.object({ min: z.number().optional(), max: z.number().optional() })
	.strict();
export const SchemaDepartment = z.enum([
	'C-Suite',
	'Consulting',
	'Design',
	'Education & Coaching',
	'Engineering & Technical',
	'Finance',
	'Human Resources',
	'Information Technology',
	'Legal',
	'Marketing',
	'Medical & Health',
	'Operations',
	'Procurement & Purchasing',
	'Product',
	'Sales',
	'Account Executive',
	'Account Management',
	'Accounting',
	'Administrative & Office Support',
	'Advertising',
	'Anesthesiology',
	'Architecture & Interior Design',
	'Artificial Intelligence & Machine Learning',
	'Banking & Investment',
	'Bioengineering',
	'Brand Management',
	'Business Analysis',
	'Business Development',
	'Business Intelligence & Data Warehouse',
	'Buying & Merchandising',
	'Call Center',
	'Channel Sales',
	'Chemical Engineering',
	'Chiropractics',
	'Civil & Structural Engineering',
	'Clinical Research',
	'Clinical Systems',
	'Cloud & Infrastructure',
	'Coach & Trainer',
	'Compensation & Benefits',
	'Compliance & Privacy',
	'Construction',
	'Consultant',
	'Content Marketing',
	'Contracts',
	'Corporate Secretary',
	'Culture, Diversity & Inclusion',
	'Customer Experience',
	'Customer Marketing',
	'Customer Retention & Development',
	'Customer Service & Support',
	'Customer Success',
	'Data Center & Servers',
	'Data Engineering',
	'Data Management & Governance',
	'Data Science & Analytics',
	'Database Administration',
	'Dentistry',
	'Dermatology',
	'DevOps & SRE',
	'Digital Marketing',
	'Doctors & Physicians',
	'eCommerce Development',
	'eCommerce Marketing',
	'Education Administration',
	'Electrical & Hardware Engineering',
	'Emergency Medical Services',
	'Employee & Labor Relations',
	'Engineering Management',
	'Enterprise Architecture',
	'Epidemiology',
	'ERP Systems',
	'Ethics & Governance',
	'Event & Field Marketing',
	'Executive',
	'Facilities Management',
	'Field & Outside Sales',
	'Finance Executive',
	'Financial Planning & Analysis',
	'Financial Reporting',
	'Financial Risk',
	'Financial Systems',
	'Founder',
	'Governmental Affairs & Regulatory Law',
	'Graphic, Web & Brand Design',
	'Growth & Demand Generation',
	'Health & Safety',
	'Help Desk & Desktop Services',
	'Hospitality & Food Service',
	'HR Business Partner',
	'Human Resources Executive',
	'Implementation & Onboarding',
	'Industrial & Fashion Design',
	'Industrial Engineering',
	'Infectious Disease',
	'Information Security',
	'Information Technology Executive',
	'Inside Sales',
	'Insurance & Actuarial',
	'Intellectual Property & Patent',
	'Internal Audit & Control',
	'Investor Relations',
	'IT Asset Management',
	'IT Audit & IT Compliance',
	'IT Operations',
	'IT Procurement',
	'IT Strategy',
	'Lawyer & Attorney',
	'Lead Generation',
	'Learning & Development',
	'Legal Counsel',
	'Legal Executive',
	'Legal Operations',
	'Litigation & eDiscovery',
	'Logistics & Transportation',
	'Maintenance & Repair',
	'Manufacturing & Production',
	'Marketing Analytics & Insights',
	'Marketing Communications',
	'Marketing Executive',
	'Marketing Operations',
	'Mechanical Engineering',
	'Medical & Health Executive',
	'Medical Administration',
	'Medical Assistants & Technicians',
	'Medical Education & Training',
	'Mergers & Acquisitions',
	'Mobile Development',
	'Networking',
	'Neurology',
	'Nursing',
	'Nutrition & Dietetics',
	'Obstetrics & Gynecology',
	'Oncology',
	'Operations Executive',
	'Ophthalmology & Optometry',
	'Organizational Development',
	'Orthopedics',
	'Paralegal & Legal Support',
	'Partnerships & Alliances',
	'Pathology',
	'Pediatrics',
	'People Operations',
	'Pharmacy',
	'Photography, Video & Media Production',
	'Physical Security',
	'Physical Therapy',
	'Principal',
	'Product & UX/UI Design',
	'Product Development',
	'Product Executive',
	'Product Management',
	'Product Marketing',
	'Product Operations',
	'Professor',
	'Project Management',
	'Psychiatry',
	'Psychology',
	'Public Health',
	'Public Relations',
	'Quality Management',
	'Radiology',
	'Real Estate',
	'Real Estate Finance',
	'Recruiting & Talent Acquisition',
	'Research & Development',
	'Retail Sales',
	'Revenue Operations',
	'Sales Development (SDR/BDR)',
	'Sales Enablement & Training',
	'Sales Engineering & Solutions',
	'Sales Leader',
	'Sales Operations',
	'Scrum Master & Agile Coach',
	'SEO & Paid Search',
	'Social Media & Influencer Marketing',
	'Social Work & Counseling',
	'Software Development',
	'Store & Retail Operations',
	'Strategic Sourcing',
	'Strategy, Innovation & Transformation',
	'Supply Chain',
	'Sustainability & ESG',
	'Talent Management',
	'Tax',
	'Teacher',
	'Technical Support',
	'Technician',
	'Telecommunications',
	'Test & Quality Assurance',
	'Treasury',
	'Vendor & Supplier Management',
	'Veterinary',
	'Web Development',
	'Workforce Management',
	'Writing & Editing',
]);
export const SchemaCompanyHeadcountByDepartmentRow = z
	.object({
		department: z.enum([
			'C-Suite',
			'Consulting',
			'Design',
			'Education & Coaching',
			'Engineering & Technical',
			'Finance',
			'Human Resources',
			'Information Technology',
			'Legal',
			'Marketing',
			'Medical & Health',
			'Operations',
			'Procurement & Purchasing',
			'Product',
			'Sales',
			'Account Executive',
			'Account Management',
			'Accounting',
			'Administrative & Office Support',
			'Advertising',
			'Anesthesiology',
			'Architecture & Interior Design',
			'Artificial Intelligence & Machine Learning',
			'Banking & Investment',
			'Bioengineering',
			'Brand Management',
			'Business Analysis',
			'Business Development',
			'Business Intelligence & Data Warehouse',
			'Buying & Merchandising',
			'Call Center',
			'Channel Sales',
			'Chemical Engineering',
			'Chiropractics',
			'Civil & Structural Engineering',
			'Clinical Research',
			'Clinical Systems',
			'Cloud & Infrastructure',
			'Coach & Trainer',
			'Compensation & Benefits',
			'Compliance & Privacy',
			'Construction',
			'Consultant',
			'Content Marketing',
			'Contracts',
			'Corporate Secretary',
			'Culture, Diversity & Inclusion',
			'Customer Experience',
			'Customer Marketing',
			'Customer Retention & Development',
			'Customer Service & Support',
			'Customer Success',
			'Data Center & Servers',
			'Data Engineering',
			'Data Management & Governance',
			'Data Science & Analytics',
			'Database Administration',
			'Dentistry',
			'Dermatology',
			'DevOps & SRE',
			'Digital Marketing',
			'Doctors & Physicians',
			'eCommerce Development',
			'eCommerce Marketing',
			'Education Administration',
			'Electrical & Hardware Engineering',
			'Emergency Medical Services',
			'Employee & Labor Relations',
			'Engineering Management',
			'Enterprise Architecture',
			'Epidemiology',
			'ERP Systems',
			'Ethics & Governance',
			'Event & Field Marketing',
			'Executive',
			'Facilities Management',
			'Field & Outside Sales',
			'Finance Executive',
			'Financial Planning & Analysis',
			'Financial Reporting',
			'Financial Risk',
			'Financial Systems',
			'Founder',
			'Governmental Affairs & Regulatory Law',
			'Graphic, Web & Brand Design',
			'Growth & Demand Generation',
			'Health & Safety',
			'Help Desk & Desktop Services',
			'Hospitality & Food Service',
			'HR Business Partner',
			'Human Resources Executive',
			'Implementation & Onboarding',
			'Industrial & Fashion Design',
			'Industrial Engineering',
			'Infectious Disease',
			'Information Security',
			'Information Technology Executive',
			'Inside Sales',
			'Insurance & Actuarial',
			'Intellectual Property & Patent',
			'Internal Audit & Control',
			'Investor Relations',
			'IT Asset Management',
			'IT Audit & IT Compliance',
			'IT Operations',
			'IT Procurement',
			'IT Strategy',
			'Lawyer & Attorney',
			'Lead Generation',
			'Learning & Development',
			'Legal Counsel',
			'Legal Executive',
			'Legal Operations',
			'Litigation & eDiscovery',
			'Logistics & Transportation',
			'Maintenance & Repair',
			'Manufacturing & Production',
			'Marketing Analytics & Insights',
			'Marketing Communications',
			'Marketing Executive',
			'Marketing Operations',
			'Mechanical Engineering',
			'Medical & Health Executive',
			'Medical Administration',
			'Medical Assistants & Technicians',
			'Medical Education & Training',
			'Mergers & Acquisitions',
			'Mobile Development',
			'Networking',
			'Neurology',
			'Nursing',
			'Nutrition & Dietetics',
			'Obstetrics & Gynecology',
			'Oncology',
			'Operations Executive',
			'Ophthalmology & Optometry',
			'Organizational Development',
			'Orthopedics',
			'Paralegal & Legal Support',
			'Partnerships & Alliances',
			'Pathology',
			'Pediatrics',
			'People Operations',
			'Pharmacy',
			'Photography, Video & Media Production',
			'Physical Security',
			'Physical Therapy',
			'Principal',
			'Product & UX/UI Design',
			'Product Development',
			'Product Executive',
			'Product Management',
			'Product Marketing',
			'Product Operations',
			'Professor',
			'Project Management',
			'Psychiatry',
			'Psychology',
			'Public Health',
			'Public Relations',
			'Quality Management',
			'Radiology',
			'Real Estate',
			'Real Estate Finance',
			'Recruiting & Talent Acquisition',
			'Research & Development',
			'Retail Sales',
			'Revenue Operations',
			'Sales Development (SDR/BDR)',
			'Sales Enablement & Training',
			'Sales Engineering & Solutions',
			'Sales Leader',
			'Sales Operations',
			'Scrum Master & Agile Coach',
			'SEO & Paid Search',
			'Social Media & Influencer Marketing',
			'Social Work & Counseling',
			'Software Development',
			'Store & Retail Operations',
			'Strategic Sourcing',
			'Strategy, Innovation & Transformation',
			'Supply Chain',
			'Sustainability & ESG',
			'Talent Management',
			'Tax',
			'Teacher',
			'Technical Support',
			'Technician',
			'Telecommunications',
			'Test & Quality Assurance',
			'Treasury',
			'Vendor & Supplier Management',
			'Veterinary',
			'Web Development',
			'Workforce Management',
			'Writing & Editing',
		]),
		location: z.string().optional(),
		min: z.number().int().optional(),
		max: z.number().int().optional(),
	})
	.strict();
export const SchemaCompanyFilterNumbers = z
	.object({
		include: z.array(z.number()).max(500).optional(),
		exclude: z.array(z.number()).max(500).optional(),
	})
	.strict();
export const SchemaTechnologyMatchMode = z.enum(['ANY', 'ALL']);
export const SchemaCompanyTechnologiesFilter = z
	.object({
		include: z
			.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
			.max(500)
			.optional(),
		exclude: z
			.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
			.max(500)
			.optional(),
		match_mode: z.enum(['ANY', 'ALL']).optional(),
	})
	.strict();
export const SchemaCompanyTechnologyCategoriesFilter = z
	.object({
		include: z
			.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
			.max(200)
			.optional(),
		exclude: z
			.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
			.max(200)
			.optional(),
	})
	.strict();
export const SchemaKeywordsSource = z.enum([
	'specialties',
	'social_media_description',
	'website_pages',
]);
export const SchemaKeywordsFilter = z
	.object({
		include: z.array(z.string().min(3).max(100)).min(1).max(20),
		exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
		include_all: z.boolean().optional(),
		sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
	})
	.strict();
export const SchemaCompaniesSavedScope = z.enum([
	'any',
	'none',
	'without_list',
]);
export const SchemaCompaniesListsFilter = z
	.object({
		saved: z.enum(['any', 'none', 'without_list']).optional(),
		include: z.array(z.string()).max(100).optional(),
		exclude: z.array(z.string()).max(100).optional(),
	})
	.strict();
export const SchemaCompanyFilters = z
	.object({
		company: z
			.object({
				id: z
					.object({
						include: z.array(z.string()).max(20000).optional(),
						exclude: z.array(z.string()).max(20000).optional(),
					})
					.strict()
					.optional(),
				name: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
					})
					.strict()
					.optional(),
				domain: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
					})
					.strict()
					.optional(),
				linkedin_id: z
					.object({
						include: z.array(z.number().int().min(1)).max(500).optional(),
						exclude: z.array(z.number().int().min(1)).max(500).optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		company_industry: z
			.object({
				include: z.array(z.string().min(1).max(512)).max(500).optional(),
				exclude: z.array(z.string().max(512)).max(500).optional(),
			})
			.strict()
			.optional(),
		company_type: z
			.object({
				include: z.array(SchemaCompanyType).max(9).optional(),
				exclude: z.array(SchemaCompanyType).max(9).optional(),
			})
			.strict()
			.optional(),
		company_business_type: z
			.object({
				include: z.array(SchemaCompanyBusinessType).max(4).optional(),
				exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
			})
			.strict()
			.optional(),
		company_revenue_stream: z
			.object({
				include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
				exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
			})
			.strict()
			.optional(),
		company_ai_industry: z
			.object({
				include: z.array(SchemaAiIndustry).max(126).optional(),
				exclude: z.array(SchemaAiIndustry).max(126).optional(),
			})
			.strict()
			.optional(),
		company_country: z
			.object({
				include: z.array(z.string().min(1).max(512)).max(500).optional(),
				exclude: z.array(z.string().max(512)).max(500).optional(),
				headquarters_only: z.boolean().optional(),
			})
			.strict()
			.optional(),
		company_location: z
			.object({
				include: z.array(z.string().min(2).max(200)).max(100).optional(),
				exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
				headquarters_only: z.boolean().optional(),
			})
			.strict()
			.optional(),
		company_headcount_range: z
			.array(SchemaCompanyEmployeeRange)
			.min(1)
			.max(8)
			.optional(),
		company_headcount_custom: z
			.object({ min: z.number().optional(), max: z.number().optional() })
			.strict()
			.optional(),
		company_founded: z
			.object({ min: z.number().optional(), max: z.number().optional() })
			.strict()
			.optional(),
		company_headcount_by_department: z
			.array(SchemaCompanyHeadcountByDepartmentRow)
			.min(1)
			.max(10)
			.optional(),
		company_naics: z
			.object({
				include: z.array(z.number()).max(500).optional(),
				exclude: z.array(z.number()).max(500).optional(),
			})
			.strict()
			.optional(),
		company_technologies: z
			.object({
				include: z
					.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
					.max(500)
					.optional(),
				exclude: z
					.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
					.max(500)
					.optional(),
				match_mode: z.enum(['ANY', 'ALL']).optional(),
			})
			.strict()
			.optional(),
		company_technology_categories: z
			.object({
				include: z
					.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
					.max(200)
					.optional(),
				exclude: z
					.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
					.max(200)
					.optional(),
			})
			.strict()
			.optional(),
		company_keywords: z
			.object({
				include: z.array(z.string().min(3).max(100)).min(1).max(20),
				exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
				include_all: z.boolean().optional(),
				sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
			})
			.strict()
			.optional(),
		lists: z
			.object({
				saved: z.enum(['any', 'none', 'without_list']).optional(),
				include: z.array(z.string()).max(100).optional(),
				exclude: z.array(z.string()).max(100).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const SchemaExportSourceInput = z
	.object({
		type: z.enum(['search', 'list']),
		list_id: z.string().max(64).optional(),
		search_id: z.string().max(64).optional(),
	})
	.strict();
export const SchemaCompaniesExportRequest = z
	.object({
		ids: z.array(z.string()).min(1).max(25000).optional(),
		filters: z
			.object({
				company: z
					.object({
						id: z
							.object({
								include: z.array(z.string()).max(20000).optional(),
								exclude: z.array(z.string()).max(20000).optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						include: z.array(z.string()).max(100).optional(),
						exclude: z.array(z.string()).max(100).optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		sort_by: z
			.enum([
				'company_name',
				'company_employee_count',
				'company_industry',
				'company_country',
				'company_founded',
				'company_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		limit: z.number().min(1).max(1000000).optional(),
		exclude_ids: z.array(z.string()).max(25000).optional(),
		extra_ids: z.array(z.string()).max(25000).optional(),
		columns: z
			.array(
				z.enum([
					'name',
					'domain',
					'website',
					'linkedin_url',
					'industry',
					'employee_count',
					'employee_range',
					'type',
					'business_type',
					'revenue_stream',
					'founded',
					'keywords',
					'naics_codes',
					'country',
					'state',
					'city',
					'raw_address',
					'description',
					'logo_url',
					'email_domain',
					'email_provider',
					'id',
					'saved_at',
					'in_lists',
					'ai_industries',
				]),
			)
			.min(1)
			.max(25)
			.optional(),
		file_format: z.enum(['csv', 'xlsx']).optional(),
		name: z.string().max(64).optional(),
		source: SchemaExportSourceInput.optional(),
	})
	.strict();
export const SchemaCompaniesGetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaCompany,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaCompaniesListsRemoveRequest = z
	.object({ list_id: z.string(), ids: z.array(z.string()).min(1).max(500) })
	.strict();
export const SchemaListMembershipRemoveResult = z
	.object({ removed: z.number().int().min(0) })
	.passthrough();
export const SchemaCompaniesListsRemoveResponse = z
	.object({
		success: z.boolean(),
		data: SchemaListMembershipRemoveResult,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaListsSetResult = z
	.object({
		updated: z.number().int().min(0),
		skipped: z.number().int().min(0),
	})
	.passthrough();
export const SchemaCompaniesListsSetJob = z
	.object({
		id: z.string(),
		type: z.literal('companies_lists_set'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				updated: z.number().int().min(0),
				skipped: z.number().int().min(0),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaCompaniesListsSetRequest = z
	.object({
		ids: z.array(z.string()).min(1).max(25000).optional(),
		filters: z
			.object({
				company: z
					.object({
						id: z
							.object({
								include: z.array(z.string()).max(20000).optional(),
								exclude: z.array(z.string()).max(20000).optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						include: z.array(z.string()).max(100).optional(),
						exclude: z.array(z.string()).max(100).optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		sort_by: z
			.enum([
				'company_name',
				'company_employee_count',
				'company_industry',
				'company_country',
				'company_founded',
				'company_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		limit: z.number().min(1).max(25000).optional(),
		exclude_ids: z.array(z.string()).max(25000).optional(),
		extra_ids: z.array(z.string()).max(25000).optional(),
		list_ids: z.array(z.string()).min(1).max(100),
	})
	.strict();
export const SchemaCompaniesListsSetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaCompaniesListsSetJob,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaCompanySaveItem = z
	.object({
		identifier: z.string().optional(),
		id: z.string().optional(),
		linkedin_id: z.union([z.string(), z.number().int()]).optional(),
		linkedin_url: z.string().optional(),
		domain: z.string().optional(),
	})
	.strict();
export const SchemaCompaniesSaveRequest = z
	.object({
		data: z
			.array(z.union([z.string(), SchemaCompanySaveItem]))
			.min(1)
			.max(500),
		list_ids: z.array(z.string()).max(20).optional(),
	})
	.strict();
export const SchemaSaveSaved = z
	.object({
		identifier: z.string(),
		id: z.string(),
		matched_by: z.string(),
		list_ids: z.array(z.string()),
		saved_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaCompanySaveSaved = z
	.object({
		identifier: z.string(),
		id: z.string(),
		matched_by: SchemaCompanyLookupField,
		list_ids: z.array(z.string()),
		saved_at: z.iso.datetime().nullable(),
		all_list_ids: z.array(z.string()),
	})
	.passthrough();
export const SchemaSaveNotMatched = z
	.object({ identifier: z.string(), attempted: z.array(z.string()) })
	.passthrough();
export const SchemaSaveInvalid = z
	.object({
		identifier: z.string(),
		reason: z.string(),
		skipped: z.array(z.string()).optional(),
		unknown_fields: z.array(z.string()).optional(),
	})
	.passthrough();
export const SchemaSaveFailed = z
	.object({ identifier: z.string(), id: z.string(), reason: z.string() })
	.passthrough();
export const SchemaCompaniesSaveResult = z
	.object({
		saved: z.array(SchemaCompanySaveSaved),
		not_matched: z.array(SchemaSaveNotMatched),
		invalid: z.array(SchemaSaveInvalid),
		failed: z.array(SchemaSaveFailed),
	})
	.passthrough();
export const SchemaSaveResultMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		total: z.number().int().min(0),
		saved_count: z.number().int().min(0),
		not_matched_count: z.number().int().min(0),
		invalid_count: z.number().int().min(0),
		failed_count: z.number().int().min(0),
		credits: z
			.object({ wallet_usd: z.number().optional() })
			.passthrough()
			.nullable()
			.optional(),
	})
	.passthrough();
export const SchemaCompaniesSaveResponse = z
	.object({
		success: z.boolean(),
		data: SchemaCompaniesSaveResult,
		metadata: SchemaSaveResultMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaSaveRunResult = z
	.object({
		requested: z.number().int().min(0),
		saved: z.number().int().min(0),
		not_found: z.number().int().min(0),
		stopped_reason: z.string().nullable(),
		truncated: z.boolean(),
	})
	.passthrough();
export const SchemaCompaniesSaveSearchJob = z
	.object({
		id: z.string(),
		type: z.literal('companies_save_search'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				requested: z.number().int().min(0),
				saved: z.number().int().min(0),
				not_found: z.number().int().min(0),
				stopped_reason: z.string().nullable(),
				truncated: z.boolean(),
			})
			.passthrough()
			.nullable(),
	})
	.passthrough();
export const SchemaSortDirection = z.enum(['asc', 'desc']);
export const SchemaCompaniesSearchMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		sort_by: z.enum([
			'company_name',
			'company_employee_count',
			'company_industry',
			'company_country',
			'company_founded',
			'company_saved_at',
			'relevance',
			'followers',
		]),
		sort_direction: SchemaSortDirection,
		pagination: SchemaPagination,
		lists_filter: z
			.object({
				truncated: z.boolean(),
				companies_used: z.number().int().min(0),
			})
			.passthrough()
			.optional(),
		company_lists: z
			.object({ truncated: z.boolean().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();
export const SchemaCompanySortBy = z.enum([
	'company_name',
	'company_employee_count',
	'company_industry',
	'company_country',
	'company_founded',
	'company_saved_at',
]);
export const SchemaCompaniesSearchRequest = z
	.object({
		filters: z
			.object({
				company: z
					.object({
						id: z
							.object({
								include: z.array(z.string()).max(20000).optional(),
								exclude: z.array(z.string()).max(20000).optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						include: z.array(z.string()).max(100).optional(),
						exclude: z.array(z.string()).max(100).optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		sort_by: z
			.enum([
				'company_name',
				'company_employee_count',
				'company_industry',
				'company_country',
				'company_founded',
				'company_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		page: z.number().int().min(1).max(4000).optional(),
		per_page: z
			.union([z.literal(25), z.literal(50), z.literal(100)])
			.optional(),
	})
	.strict();
export const SchemaCompaniesSearchResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaCompany),
		metadata: SchemaCompaniesSearchMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaCompanyDomainMatchMode = z.enum([
	'ORGANIZATION',
	'PRIMARY',
	'LINKEDIN_WEBSITE',
]);
export const SchemaCompanyKeywordSuggestion = z
	.object({
		type: z.literal('company_keywords'),
		value: z.string(),
		company_count: z.number().int().min(0),
	})
	.passthrough();
export const SchemaCompanyNameMatchMode = z.enum(['EXACT', 'CONTAINS']);
export const SchemaCompanySuggestion = z
	.object({
		type: z.literal('company'),
		value: z.string(),
		id: z.string(),
		domain: z.string().nullable(),
		logo: z.url().nullable(),
		industry: z.string().nullable(),
		employee_range: z.string().nullable(),
		linkedin_url: z.url().nullable(),
		saved: z.boolean(),
	})
	.passthrough();
export const SchemaCreditBalance = z
	.object({
		available: z.number().int(),
		allowance: z.number().int(),
		additional: z.number().int(),
		permanent: z.number().int(),
	})
	.passthrough();
export const SchemaCreditWallet = z
	.object({
		balance: z.number().min(0),
		plan_credit: z.number().min(0),
		top_up: z.number().min(0),
		plan_credit_renews_at: z.iso.datetime().nullable(),
		auto_top_up_enabled: z.boolean(),
		prices: z
			.object({ phone: z.number().min(0), verification: z.number().min(0) })
			.passthrough(),
		top_up_url: z.url(),
	})
	.passthrough();
export const SchemaCreditBalances = z
	.object({
		email_search: SchemaCreditBalance,
		email_verification: z
			.object({
				available: z.number().int(),
				allowance: z.number().int(),
				additional: z.number().int(),
				permanent: z.number().int(),
			})
			.passthrough(),
		phone_search: z
			.object({
				available: z.number().int(),
				allowance: z.number().int(),
				additional: z.number().int(),
				permanent: z.number().int(),
			})
			.passthrough(),
		reset_at: z.iso.datetime().nullable(),
		wallet: SchemaCreditWallet.optional(),
	})
	.passthrough();
export const SchemaCreditsGetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaCreditBalances,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaCsvEnrichmentJob = z
	.object({
		id: z.string(),
		type: z.literal('csv_enrichment'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaDepartmentFilter = z
	.object({
		include: z.array(SchemaDepartment).max(196).optional(),
		exclude: z.array(SchemaDepartment).max(196).optional(),
	})
	.strict();
export const SchemaEmailContactStatus = z.enum([
	'valid',
	'invalid',
	'accept_all',
	'not_found',
]);
export const SchemaEmailDomainStatus = z
	.enum(['valid', 'invalid', 'accept_all', 'disposable', 'unknown'])
	.nullable();
export const SchemaEmailEnvelopeMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		credits: z
			.object({
				email_search: z.number().int().optional(),
				email_verification: z.number().int().optional(),
				reset_at: z.iso.datetime().nullable().optional(),
				wallet_usd: z.number().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export const SchemaEmailFileInspectInput = z
	.object({ file_key: z.string().max(512) })
	.strict();
export const SchemaEmailFileInspectRequest = z
	.object({ data: SchemaEmailFileInspectInput })
	.strict();
export const SchemaEmailFileInspection = z
	.object({
		headers: z.array(z.string()),
		preview: z.array(z.array(z.string())).max(5),
		delimiter: z.string().nullable(),
		encoding: z.string(),
		has_header: z.boolean(),
		email_column_candidates: z.array(
			z
				.object({
					index: z.number().int().min(0),
					header: z.string().nullable(),
					sample: z.string(),
				})
				.passthrough(),
		),
		suggested_email_column: z.number().int().min(0).nullable(),
	})
	.passthrough();
export const SchemaEmailFileInspectionResponse = z
	.object({
		success: z.boolean(),
		data: SchemaEmailFileInspection,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEmailFindLookup = z
	.object({
		full_name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		domain: z.string().optional(),
		company: z.string().optional(),
	})
	.strict();
export const SchemaEmailFindRequest = z
	.object({
		data: z
			.object({
				full_name: z.string().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				domain: z.string().optional(),
				company: z.string().optional(),
			})
			.strict(),
	})
	.strict();
export const SchemaEmailFindStatus = z.enum(['valid', 'not_found']);
export const SchemaEmailFindResult = z
	.object({
		email: z.string().nullable(),
		status: SchemaEmailFindStatus,
		account: z.string().nullable(),
		domain: z.string().nullable(),
		domain_status: SchemaEmailDomainStatus,
		smtp_provider: z.string().nullable(),
		free_email: z.boolean().nullable(),
	})
	.passthrough();
export const SchemaEmailFindResponse = z
	.object({
		success: z.boolean(),
		data: SchemaEmailFindResult,
		metadata: SchemaEmailEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEmailVerificationSource = z
	.enum(['api', 'file', 'paste'])
	.nullable();
export const SchemaEmailVerificationStatus = z.enum([
	'queued',
	'counting',
	'awaiting_confirmation',
	'verifying',
	'assembling',
	'completed',
	'failed',
	'cancelled',
]);
export const SchemaEmailVerification = z
	.object({
		id: z.string(),
		name: z.string(),
		source: SchemaEmailVerificationSource,
		status: SchemaEmailVerificationStatus,
		stopped_reason: z.string().nullable(),
		auto_start_blocked: z
			.object({ at: z.iso.datetime(), reason: z.literal('credits') })
			.passthrough()
			.nullable(),
		counts: z
			.object({
				total_rows: z.number().int().min(0),
				parsed_rows: z.number().int().min(0),
				billable: z.number().int().min(0),
				duplicates: z.number().int().min(0),
				invalid_syntax: z.number().int().min(0),
				blank: z.number().int().min(0),
				verified: z.number().int().min(0),
				valid: z.number().int().min(0),
				invalid: z.number().int().min(0),
				accept_all: z.number().int().min(0),
				unknown: z.number().int().min(0),
			})
			.passthrough(),
		batches: z
			.object({ total: z.number().int().min(0), done: z.number().int().min(0) })
			.passthrough(),
		progress_percent: z.number().int().min(0).max(100),
		result_files: z
			.object({
				all: z.object({ url: z.url() }).passthrough().nullable(),
				valid: z.object({ url: z.url() }).passthrough().nullable(),
				invalid: z.object({ url: z.url() }).passthrough().nullable(),
			})
			.passthrough()
			.nullable(),
		result_expires_at: z.iso.datetime().nullable(),
		results_expires_at: z.iso.datetime().nullable(),
		results_available: z.boolean(),
		results_unavailable_reason: z
			.enum(['too_large', 'not_stored', 'expired'])
			.nullable(),
		links: z
			.object({
				self: z.string(),
				job: z.string(),
				results: z.string().nullable(),
			})
			.passthrough(),
		owner: z
			.object({
				id: z.string(),
				first_name: z.string().nullable(),
				last_name: z.string().nullable(),
				photo_url: z.string().nullable(),
			})
			.passthrough()
			.nullable(),
		created_by: z
			.object({ id: z.string(), name: z.string().nullable() })
			.passthrough()
			.nullable(),
		error: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		updated_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaEmailVerificationCreateInput = z
	.object({
		emails: z.array(z.string()).min(1).max(10000).optional(),
		file_key: z.string().max(512).optional(),
		name: z.string().max(128).optional(),
		email_column: z.number().int().min(0).optional(),
		source: z.enum(['file', 'paste']).optional(),
	})
	.strict();
export const SchemaEmailVerificationCreateRequest = z
	.object({ data: SchemaEmailVerificationCreateInput })
	.strict();
export const SchemaEmailVerifyStatus = z.enum([
	'valid',
	'invalid',
	'accept_all',
	'unknown',
]);
export const SchemaEmailVerificationHistoryEntry = z
	.object({
		id: z.string(),
		email: z.string(),
		status: SchemaEmailVerifyStatus,
		provider: z.string(),
		domain: z.string(),
		free_email: z.boolean().nullable(),
		owner: z
			.object({
				id: z.string(),
				first_name: z.string().nullable(),
				last_name: z.string().nullable(),
				photo_url: z.string().nullable(),
			})
			.passthrough()
			.nullable(),
		verified_by: z
			.object({ id: z.string(), name: z.string().nullable() })
			.passthrough()
			.nullable(),
		created_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaEmailVerificationsListMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		pagination: z
			.object({
				page: z.number().int().min(1),
				per_page: z.number().int().min(1).max(100),
				total_pages: z.number().int().min(1),
				total_count: z.number().int().min(0),
				max_page: z.number().int().min(1).optional(),
				truncated: z.boolean().optional(),
				page_size: z.number().int().min(1).max(100),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaEmailVerificationHistoryListResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaEmailVerificationHistoryEntry),
		metadata: SchemaEmailVerificationsListMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEmailVerificationJob = z
	.object({
		id: z.string(),
		type: z.literal('email_verification'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaEmailVerificationListResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaEmailVerification),
		metadata: SchemaEmailVerificationsListMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEmailVerificationResponse = z
	.object({
		success: z.boolean(),
		data: SchemaEmailVerification,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEmailVerificationResult = z
	.object({
		email: z.string(),
		status: SchemaEmailVerifyStatus,
		account: z.string(),
		domain: z.string(),
		domain_status: z.string(),
		smtp_provider: z.string(),
		free_email: z.boolean().nullable(),
	})
	.passthrough();
export const SchemaEmailVerificationResultItem = z
	.object({
		email: z.string(),
		status: SchemaEmailVerifyStatus,
		account: z.string(),
		domain: z.string(),
		domain_status: z.string(),
		smtp_provider: z.string(),
		provider: z.string(),
		free_email: z.boolean().nullable(),
	})
	.passthrough();
export const SchemaEmailVerificationResultsMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		pagination: z
			.object({
				next_cursor: z.string().nullable(),
				limit: z.number().int().min(1).max(500),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaEmailVerificationResultsResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaEmailVerificationResultItem),
		metadata: SchemaEmailVerificationResultsMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEmailVerifyLookup = z.object({ email: z.string() }).strict();
export const SchemaEmailVerifyRequest = z
	.object({ data: z.object({ email: z.string() }).strict() })
	.strict();
export const SchemaEmailVerifyResponse = z
	.object({
		success: z.boolean(),
		data: SchemaEmailVerificationResult,
		metadata: SchemaEmailEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEnrichRunResult = z
	.object({
		requested: z.number().int().min(0),
		truncated: z.boolean(),
		found: z.number().int().min(0),
		already_not_found: z.number().int().min(0),
		stopped_reason: z.string().nullable(),
		capped_by_plan: z.number().int().min(1).optional(),
	})
	.passthrough();
export const SchemaEnrichmentStatus = z.enum([
	'queued',
	'sampling',
	'matching',
	'awaiting_confirmation',
	'enriching',
	'finding',
	'assembling',
	'completed',
	'failed',
	'cancelled',
]);
export const SchemaEnrichment = z
	.object({
		id: z.string(),
		type: z.enum(['people', 'companies']),
		name: z.string(),
		source: z.enum(['api', 'file']),
		status: SchemaEnrichmentStatus,
		stopped_reason: z.string().nullable(),
		options: z
			.object({ enrich_email: z.boolean(), enrich_phone: z.boolean() })
			.passthrough()
			.nullable(),
		progress: z
			.object({
				percent: z.number().int().min(0).max(100),
				done: z.number().int().min(0).nullable(),
				total: z.number().int().min(0).nullable(),
			})
			.passthrough(),
		counts: z
			.object({
				rows: z.number().int().min(0),
				matched: z.number().int().min(0),
				not_matched: z.number().int().min(0),
				invalid: z.number().int().min(0),
				emails_found: z.number().int().min(0),
				phones_found: z.number().int().min(0),
			})
			.passthrough(),
		credits_used: z
			.object({
				email: z.number().int().min(0),
				phone: z.number().int().min(0),
			})
			.passthrough(),
		created_at: z.iso.datetime().nullable(),
		started_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		results_expires_at: z.iso.datetime().nullable(),
		links: z
			.object({
				self: z.string(),
				job: z.string(),
				results: z.string().nullable(),
				csv: z.url().nullable(),
				jsonl: z.url().nullable(),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaPersonEmailStatus = z
	.enum(['valid', 'not_found', 'not_checked', 'searching'])
	.nullable();
export const SchemaPersonEmail = z
	.object({
		status: SchemaPersonEmailStatus,
		address: z.string().nullable(),
		domain: z.string().nullable(),
		domain_status: SchemaEmailDomainStatus,
		provider: z.string().nullable(),
		verified_at: z.iso.datetime().nullable(),
		checked_at: z.iso.datetime().nullable(),
		revealed: z.boolean(),
		retry_after: z.number().int().optional(),
	})
	.passthrough();
export const SchemaEnrichmentFinderPerson = z
	.object({
		id: z.string().nullable(),
		full_name: z.string().nullable(),
		first_name: z.string().nullable(),
		last_name: z.string().nullable(),
		linkedin_url: z.string().nullable(),
		email: SchemaPersonEmail,
		primary_position: z
			.object({
				company: z
					.object({
						name: z.string().nullable(),
						domain: z.string().nullable(),
					})
					.strict(),
			})
			.strict(),
	})
	.strict();
export const SchemaEnrichmentListMetadata = z
	.object({ timestamp: z.iso.datetime(), pagination: SchemaPagination })
	.passthrough();
export const SchemaEnrichmentListResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaEnrichment),
		metadata: SchemaEnrichmentListMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEnrichmentResponse = z
	.object({
		success: z.boolean(),
		data: SchemaEnrichment,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEnrichmentResultStatus = z.enum([
	'matched',
	'not_matched',
	'invalid',
	'failed',
	'not_processed',
]);
export const SchemaPersonPhoneStatus = z
	.enum(['not_requested', 'found', 'not_found', 'error'])
	.nullable();
export const SchemaPersonMobilePhone = z
	.object({
		status: SchemaPersonPhoneStatus,
		number: z.string().nullable(),
		numbers: z.array(z.string()),
		revealed: z.boolean(),
		checked_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaPersonLocation = z
	.object({
		city: z.string().nullable(),
		state: z.string().nullable(),
		state_code: z.string().nullable(),
		country: z.string().nullable(),
		country_code: z.string().nullable(),
		time_zone: z.string().nullable(),
		time_zone_offset: z.number().nullable(),
	})
	.passthrough();
export const SchemaPersonPositionCompanyLocation = z
	.object({
		city: z.string().nullable(),
		state: z.string().nullable(),
		state_code: z.string().nullable(),
		country: z.string().nullable(),
		country_code: z.string().nullable(),
		raw_address: z.string().nullable(),
	})
	.passthrough();
export const SchemaPersonPositionCompany = z
	.object({
		id: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		logo: z.url().nullable().optional(),
		website: z.string().nullable().optional(),
		email: SchemaPersonEmail.optional(),
		linkedin_url: z.string().nullable().optional(),
		social_networks: SchemaCompanySocialNetworks.optional(),
		industry: z.string().nullable().optional(),
		keywords: z.array(z.string()).optional(),
		naics_codes: z.array(z.number().int()).optional(),
		ai_industries: z.array(z.string()).optional(),
		type: z.string().nullable().optional(),
		business_type: z.string().nullable().optional(),
		revenue_stream: z.string().nullable().optional(),
		founded: z.number().int().nullable().optional(),
		employee_count: z.number().int().nullable().optional(),
		employee_range: z.string().nullable().optional(),
		location: z
			.object({
				city: z.string().nullable(),
				state: z.string().nullable(),
				state_code: z.string().nullable(),
				country: z.string().nullable(),
				country_code: z.string().nullable(),
				raw_address: z.string().nullable(),
			})
			.passthrough()
			.nullable()
			.optional(),
		other_locations: z.array(SchemaPersonPositionCompanyLocation).optional(),
		technologies: z.array(SchemaCompanyTechnology).optional(),
		technologies_checked_at: z.iso.datetime().nullable().optional(),
	})
	.passthrough();
export const SchemaPersonPosition = z
	.object({
		job_title: z.string().nullable(),
		normalized_job_title: z.string().nullable(),
		seniority: z.string().nullable(),
		departments: z.array(z.string()),
		start_date: z.string().nullable(),
		company: z
			.object({
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				description: z.string().nullable().optional(),
				logo: z.url().nullable().optional(),
				website: z.string().nullable().optional(),
				email: SchemaPersonEmail.optional(),
				linkedin_url: z.string().nullable().optional(),
				social_networks: SchemaCompanySocialNetworks.optional(),
				industry: z.string().nullable().optional(),
				keywords: z.array(z.string()).optional(),
				naics_codes: z.array(z.number().int()).optional(),
				ai_industries: z.array(z.string()).optional(),
				type: z.string().nullable().optional(),
				business_type: z.string().nullable().optional(),
				revenue_stream: z.string().nullable().optional(),
				founded: z.number().int().nullable().optional(),
				employee_count: z.number().int().nullable().optional(),
				employee_range: z.string().nullable().optional(),
				location: z
					.object({
						city: z.string().nullable(),
						state: z.string().nullable(),
						state_code: z.string().nullable(),
						country: z.string().nullable(),
						country_code: z.string().nullable(),
						raw_address: z.string().nullable(),
					})
					.passthrough()
					.nullable()
					.optional(),
				other_locations: z
					.array(SchemaPersonPositionCompanyLocation)
					.optional(),
				technologies: z.array(SchemaCompanyTechnology).optional(),
				technologies_checked_at: z.iso.datetime().nullable().optional(),
			})
			.passthrough()
			.nullable(),
		position_index: z.number().int().min(0),
		id: z.string().nullable(),
	})
	.passthrough();
export const SchemaPersonEdits = z
	.object({
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
	})
	.passthrough();
export const SchemaPersonSaved = z
	.object({
		id: z.string().nullable(),
		saved_at: z.iso.datetime().nullable(),
		lists: z.array(SchemaPersonSavedList),
		edits: SchemaPersonEdits.optional(),
	})
	.passthrough();
export const SchemaPerson = z
	.object({
		id: z.string(),
		full_name: z.string().nullable(),
		first_name: z.string().nullable(),
		last_name: z.string().nullable(),
		email: SchemaPersonEmail,
		mobile_phone: SchemaPersonMobilePhone,
		location: z
			.object({
				city: z.string().nullable(),
				state: z.string().nullable(),
				state_code: z.string().nullable(),
				country: z.string().nullable(),
				country_code: z.string().nullable(),
				time_zone: z.string().nullable(),
				time_zone_offset: z.number().nullable(),
			})
			.passthrough()
			.nullable(),
		linkedin_url: z.string().nullable(),
		linkedin_id: z.number().int().min(1).nullable(),
		followers: z.number().int().min(0).nullable(),
		primary_position: z
			.object({
				job_title: z.string().nullable(),
				normalized_job_title: z.string().nullable(),
				seniority: z.string().nullable(),
				departments: z.array(z.string()),
				start_date: z.string().nullable(),
				company: z
					.object({
						id: z.string().nullable().optional(),
						name: z.string().nullable().optional(),
						description: z.string().nullable().optional(),
						logo: z.url().nullable().optional(),
						website: z.string().nullable().optional(),
						email: SchemaPersonEmail.optional(),
						linkedin_url: z.string().nullable().optional(),
						social_networks: SchemaCompanySocialNetworks.optional(),
						industry: z.string().nullable().optional(),
						keywords: z.array(z.string()).optional(),
						naics_codes: z.array(z.number().int()).optional(),
						ai_industries: z.array(z.string()).optional(),
						type: z.string().nullable().optional(),
						business_type: z.string().nullable().optional(),
						revenue_stream: z.string().nullable().optional(),
						founded: z.number().int().nullable().optional(),
						employee_count: z.number().int().nullable().optional(),
						employee_range: z.string().nullable().optional(),
						location: z
							.object({
								city: z.string().nullable(),
								state: z.string().nullable(),
								state_code: z.string().nullable(),
								country: z.string().nullable(),
								country_code: z.string().nullable(),
								raw_address: z.string().nullable(),
							})
							.passthrough()
							.nullable()
							.optional(),
						other_locations: z
							.array(SchemaPersonPositionCompanyLocation)
							.optional(),
						technologies: z.array(SchemaCompanyTechnology).optional(),
						technologies_checked_at: z.iso.datetime().nullable().optional(),
					})
					.passthrough()
					.nullable(),
				position_index: z.number().int().min(0),
				id: z.string().nullable(),
			})
			.passthrough()
			.nullable(),
		other_positions: z.array(SchemaPersonPosition).optional(),
		saved: z
			.object({
				id: z.string().nullable(),
				saved_at: z.iso.datetime().nullable(),
				lists: z.array(SchemaPersonSavedList),
				edits: SchemaPersonEdits.optional(),
			})
			.passthrough()
			.nullable(),
		matched_url: z.string().nullable().optional(),
	})
	.passthrough();
export const SchemaEnrichmentResultItem = z
	.object({
		identifier: z.string(),
		status: SchemaEnrichmentResultStatus,
		matched_by: z.string().nullable().optional(),
		input: z.record(z.string(), z.string()),
		person: z
			.union([SchemaPerson, SchemaEnrichmentFinderPerson])
			.nullable()
			.optional(),
		company: SchemaCompany.nullable().optional(),
		error: z
			.object({ code: z.string(), message: z.string() })
			.passthrough()
			.optional(),
	})
	.passthrough();
export const SchemaEnrichmentResultsMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		pagination: z
			.object({
				next_cursor: z.string().nullable(),
				limit: z.number().int().min(1).max(500),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaEnrichmentResultsResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaEnrichmentResultItem),
		metadata: SchemaEnrichmentResultsMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEnumName = z.enum([
	'industries',
	'countries',
	'employee_ranges',
	'company_types',
	'business_types',
	'revenue_streams',
	'keywords_sources',
	'departments',
	'seniorities',
	'regions',
	'ai_industries',
]);
export const SchemaEnumValues = z.json();
export const SchemaEnums = z
	.object({
		industries: z.record(z.string(), z.array(z.string())),
		countries: z.array(z.string()),
		employee_ranges: z.array(z.string()),
		company_types: z.array(z.string()),
		business_types: z.array(z.string()),
		revenue_streams: z.array(z.string()),
		keywords_sources: z.array(z.string()),
		departments: z.record(z.string(), z.array(z.string())),
		seniorities: z.array(z.string()),
		regions: z.record(z.string(), z.array(z.string())),
		ai_industries: z.record(z.string(), z.array(z.string())),
	})
	.passthrough();
export const SchemaEnumsGetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaEnumValues,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaEnumsListResponse = z
	.object({
		success: z.boolean(),
		data: SchemaEnums,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaExportStatus = z.enum(['in_progress', 'done', 'failed']);
export const SchemaExportRecordType = z.enum(['people', 'companies']);
export const SchemaExportScope = z.enum(['all', 'with_email']);
export const SchemaExport = z
	.object({
		id: z.string(),
		name: z.string(),
		status: SchemaExportStatus,
		record_type: SchemaExportRecordType,
		source: z
			.object({
				type: z.enum(['search', 'list']),
				list_id: z.string().nullable(),
				list_name: z.string().nullable(),
				search_id: z.string().nullable(),
			})
			.passthrough()
			.nullable(),
		scope: SchemaExportScope,
		file_format: z.enum(['csv', 'xlsx']),
		counts: z
			.object({
				requested: z.number().int().min(0),
				exported: z.number().int().min(0),
				with_email: z.number().int().min(0),
				withheld_emails: z.number().int().min(0),
			})
			.passthrough(),
		total: z.number().int().min(0),
		credits: z
			.object({
				emails_charged: z.number().int().min(0),
				total: z.number().int().min(0),
			})
			.passthrough(),
		data_file_url: z.url().nullable(),
		stopped_reason: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		owner: z
			.object({
				id: z.string(),
				first_name: z.string().nullable(),
				last_name: z.string().nullable(),
				email: z.string().nullable(),
				profile_photo: z.string().nullable(),
			})
			.passthrough()
			.nullable(),
	})
	.passthrough();
export const SchemaExportPositionPin = z
	.object({
		person_id: z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')),
		position_id: z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
		position_index: z.number().min(0).optional(),
	})
	.strict();
export const SchemaExportResponse = z
	.object({
		success: z.boolean(),
		data: SchemaExport,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaExportStart = z
	.object({
		id: z.string(),
		status: SchemaExportStatus,
		requested: z.number().int().min(0),
	})
	.passthrough();
export const SchemaExportStartResponse = z
	.object({
		success: z.boolean(),
		data: SchemaExportStart,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaIndustrySuggestion = z
	.object({ type: z.literal('industry'), value: z.string(), group: z.string() })
	.passthrough();
export const SchemaPushAllResult = z
	.object({ integration: z.string(), records_queued: z.number().int().min(0) })
	.passthrough();
export const SchemaIntegrationPushAllJob = z
	.object({
		id: z.string(),
		type: z.literal('integration_push_all'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				integration: z.string(),
				records_queued: z.number().int().min(0),
			})
			.passthrough()
			.nullable(),
	})
	.passthrough();
export const SchemaPeopleExportJob = z
	.object({
		id: z.string(),
		type: z.literal('people_export'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaPeopleDeleteJob = z
	.object({
		id: z.string(),
		type: z.literal('people_delete'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				deleted: z.number().int().min(0),
				skipped: z.number().int().min(0),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaPeopleListsSetJob = z
	.object({
		id: z.string(),
		type: z.literal('people_lists_set'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				updated: z.number().int().min(0),
				skipped: z.number().int().min(0),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaListDeleteResult = z
	.object({ list: z.boolean(), records_deleted: z.number().int().min(0) })
	.passthrough();
export const SchemaListDeleteJob = z
	.object({
		id: z.string(),
		type: z.literal('list_delete'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({ list: z.boolean(), records_deleted: z.number().int().min(0) })
			.passthrough(),
	})
	.passthrough();
export const SchemaRestoreResult = z
	.object({
		restored: z.number().int().min(0),
		lists_restored: z.number().int().min(0),
		skipped: z.number().int().min(0),
	})
	.passthrough();
export const SchemaTrashRestoreJob = z
	.object({
		id: z.string(),
		type: z.literal('trash_restore'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				restored: z.number().int().min(0),
				lists_restored: z.number().int().min(0),
				skipped: z.number().int().min(0),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaPeopleSaveSearchJob = z
	.object({
		id: z.string(),
		type: z.literal('people_save_search'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				requested: z.number().int().min(0),
				saved: z.number().int().min(0),
				not_found: z.number().int().min(0),
				stopped_reason: z.string().nullable(),
				truncated: z.boolean(),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaPeopleEnrichSearchJob = z
	.object({
		id: z.string(),
		type: z.literal('people_enrich_search'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				requested: z.number().int().min(0),
				truncated: z.boolean(),
				found: z.number().int().min(0),
				already_not_found: z.number().int().min(0),
				stopped_reason: z.string().nullable(),
				capped_by_plan: z.number().int().min(1).optional(),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaLeadEnrollRunResult = z
	.object({
		added: z.number().int().min(0),
		already_enrolled: z.number().int().min(0),
		opted_out: z.number().int().min(0),
		no_email: z.number().int().min(0),
		not_found: z.number().int().min(0),
	})
	.passthrough();
export const SchemaSequencesLeadsEnrollJob = z
	.object({
		id: z.string(),
		type: z.literal('sequences_leads_enroll'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				added: z.number().int().min(0),
				already_enrolled: z.number().int().min(0),
				opted_out: z.number().int().min(0),
				no_email: z.number().int().min(0),
				not_found: z.number().int().min(0),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaLeadBulkRunResult = z
	.object({
		matched: z.number().int().min(0),
		updated: z.number().int().min(0),
		skipped: z.array(
			z
				.object({ person_id: z.string().nullable(), reason: z.string() })
				.passthrough(),
		),
	})
	.passthrough();
export const SchemaSequencesLeadsPauseJob = z
	.object({
		id: z.string(),
		type: z.literal('sequences_leads_pause'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				matched: z.number().int().min(0),
				updated: z.number().int().min(0),
				skipped: z.array(
					z
						.object({ person_id: z.string().nullable(), reason: z.string() })
						.passthrough(),
				),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaSequencesLeadsOptOutJob = z
	.object({
		id: z.string(),
		type: z.literal('sequences_leads_opt_out'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				matched: z.number().int().min(0),
				updated: z.number().int().min(0),
				skipped: z.array(
					z
						.object({ person_id: z.string().nullable(), reason: z.string() })
						.passthrough(),
				),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaSequencesLeadsResumeJob = z
	.object({
		id: z.string(),
		type: z.literal('sequences_leads_resume'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z
			.object({
				matched: z.number().int().min(0),
				updated: z.number().int().min(0),
				skipped: z.array(
					z
						.object({ person_id: z.string().nullable(), reason: z.string() })
						.passthrough(),
				),
			})
			.passthrough(),
	})
	.passthrough();
export const SchemaLeadRemoveRunResult = z
	.object({ removed: z.number().int().min(0) })
	.passthrough();
export const SchemaSequencesLeadsRemoveJob = z
	.object({
		id: z.string(),
		type: z.literal('sequences_leads_remove'),
		status: SchemaJobStatus,
		total: z.number().int().min(0).nullable(),
		processed: z.number().int().min(0).nullable(),
		progress_percent: z.number().int().min(0).max(100).nullable(),
		error: z.string().nullable(),
		resource_url: z.string().nullable(),
		created_at: z.iso.datetime().nullable(),
		finished_at: z.iso.datetime().nullable(),
		result: z.object({ removed: z.number().int().min(0) }).passthrough(),
	})
	.passthrough();
export const SchemaJob = z.union([
	SchemaPeopleExportJob,
	SchemaCompaniesExportJob,
	SchemaCsvEnrichmentJob,
	SchemaEmailVerificationJob,
	SchemaPeopleDeleteJob,
	SchemaCompaniesDeleteJob,
	SchemaPeopleListsSetJob,
	SchemaCompaniesListsSetJob,
	SchemaListDeleteJob,
	SchemaTrashRestoreJob,
	SchemaIntegrationPushAllJob,
	SchemaPeopleSaveSearchJob,
	SchemaPeopleEnrichSearchJob,
	SchemaCompaniesSaveSearchJob,
	SchemaSequencesLeadsEnrollJob,
	SchemaSequencesLeadsPauseJob,
	SchemaSequencesLeadsOptOutJob,
	SchemaSequencesLeadsResumeJob,
	SchemaSequencesLeadsRemoveJob,
]);
export const SchemaJobChangeType = z.enum(['any', 'promotion', 'new_company']);
export const SchemaJobResponse = z
	.object({
		success: z.boolean(),
		data: SchemaJob,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaJobTitleMatchMode = z.enum(['CONTAINS', 'EXACT', 'SMART']);
export const SchemaJobTitleSuggestion = z
	.object({ type: z.literal('job_title'), value: z.string() })
	.passthrough();
export const SchemaListType = z.enum(['people', 'companies']);
export const SchemaUserRef = z
	.object({
		id: z.string(),
		first_name: z.string().nullable(),
		last_name: z.string().nullable(),
		photo_url: z.string().nullable(),
	})
	.passthrough();
export const SchemaList = z
	.object({
		id: z.string(),
		name: z.string(),
		type: SchemaListType,
		records_count: z.number().int().min(0),
		last_added_record_at: z.iso.datetime().nullable(),
		created_at: z.iso.datetime(),
		updated_at: z.iso.datetime(),
		owner: z
			.object({
				id: z.string(),
				first_name: z.string().nullable(),
				last_name: z.string().nullable(),
				photo_url: z.string().nullable(),
			})
			.passthrough()
			.nullable(),
	})
	.passthrough();
export const SchemaListSortBy = z.enum([
	'name',
	'records_count',
	'owner',
	'created_at',
	'updated_at',
]);
export const SchemaListsCreateRequest = z
	.object({
		name: z.string().min(1).max(100),
		type: z.enum(['people', 'companies']),
	})
	.strict();
export const SchemaListsCreateResponse = z
	.object({
		success: z.boolean(),
		data: SchemaList,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaListsDeleteResponse = z
	.object({
		success: z.boolean(),
		data: SchemaListDeleteJob,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaListsGetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaList,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaSavedView = z
	.object({
		type: SchemaListType,
		saved: z.enum(['any', 'without_list']),
		records_count: z.number().int().min(0).nullable(),
		last_saved_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaListsListMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		pagination: SchemaPagination,
		sort_by: z.string().nullable(),
		sort_direction: z.string().nullable(),
		saved_views: z.array(SchemaSavedView).optional(),
	})
	.passthrough();
export const SchemaListsListResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaList),
		metadata: SchemaListsListMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaListsUpdateRequest = z
	.object({ name: z.string().min(1).max(100) })
	.strict();
export const SchemaListsUpdateResponse = z
	.object({
		success: z.boolean(),
		data: SchemaList,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaLocationLevel = z.enum([
	'region',
	'country',
	'state',
	'city',
]);
export const SchemaLocationStringFilter = z
	.object({
		include: z.array(z.string().min(2).max(200)).max(100).optional(),
		exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
	})
	.strict();
export const SchemaLocationSuggestion = z
	.object({
		type: z.literal('location'),
		value: z.string(),
		level: SchemaLocationLevel,
		city: z.string().nullable(),
		state: z.string().nullable(),
		state_code: z.string().nullable(),
		country: z.string().nullable(),
		country_code: z.string().nullable(),
		country_codes: z.array(z.string()).optional(),
	})
	.passthrough();
export const SchemaMatchingTitle = z
	.object({ title: z.string(), count: z.number().int().min(0) })
	.passthrough();
export const SchemaWorkspaceRole = z.enum(['admin', 'member']);
export const SchemaWorkspaceRef = z
	.object({
		id: z.number().int(),
		name: z.string().nullable(),
		role: SchemaWorkspaceRole,
	})
	.passthrough();
export const SchemaRequestChannel = z.enum([
	'app',
	'extension',
	'sheets',
	'api',
	'system',
	'mcp',
]);
export const SchemaMeAuth = z
	.object({
		channel: SchemaRequestChannel,
		api_key_id: z.string().nullable(),
		session_id: z.string().nullable(),
	})
	.passthrough();
export const SchemaMe = z
	.object({
		id: z.string(),
		email: z.email().nullable(),
		pending_email: z.email().nullable(),
		first_name: z.string().nullable(),
		last_name: z.string().nullable(),
		phone: z.string().nullable(),
		country: z.string().nullable(),
		timezone: z.string().nullable(),
		profile_photo: z.string().nullable(),
		linkedin_url: z.string().nullable(),
		email_verified: z.boolean(),
		phone_verified: z.boolean(),
		status: SchemaAccountStatus,
		created_at: z.iso.datetime().nullable(),
		workspace: z
			.object({
				id: z.number().int(),
				name: z.string().nullable(),
				role: SchemaWorkspaceRole,
			})
			.passthrough()
			.nullable(),
		auth: SchemaMeAuth,
	})
	.passthrough();
export const SchemaMeGetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaMe,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaNotificationStatus = z
	.enum([
		'done',
		'success',
		'failed',
		'error',
		'in_progress',
		'processing',
		'stopped',
		'info',
	])
	.nullable();
export const SchemaNotificationLinkKind = z.enum(['external', 'app', 'file']);
export const SchemaNotificationLink = z
	.object({
		url: z.string(),
		label: z.string().nullable(),
		kind: SchemaNotificationLinkKind,
		file_name: z.string().nullable(),
	})
	.passthrough()
	.nullable();
export const SchemaNotification = z
	.object({
		id: z.string().regex(new RegExp('^[0-9a-f]{24}$')),
		workspace_id: z.number().int(),
		type: z.string(),
		status: SchemaNotificationStatus,
		title: z.string().nullable(),
		body: z.string().nullable(),
		body_format: z.enum(['text', 'html']),
		link: SchemaNotificationLink,
		subject_id: z.string().nullable(),
		read: z.boolean(),
		read_at: z.iso.datetime().nullable(),
		created_at: z.iso.datetime().nullable(),
	})
	.passthrough();
export const SchemaNotificationsListMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		pagination: SchemaPagination,
		unread_count: z.number().int().min(0),
	})
	.passthrough();
export const SchemaNotificationsListResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaNotification),
		metadata: SchemaNotificationsListMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaNotificationsMarkReadRequest = z
	.object({
		ids: z
			.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
			.min(1)
			.max(100)
			.optional(),
		all: z.boolean().optional(),
	})
	.strict();
export const SchemaNotificationsMarkReadResult = z
	.object({
		updated_count: z.number().int().min(0),
		unread_count: z.number().int().min(0),
	})
	.passthrough();
export const SchemaNotificationsMarkReadResponse = z
	.object({
		success: z.boolean(),
		data: SchemaNotificationsMarkReadResult,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleMatchedBy = z.enum([
	'id',
	'linkedin_id',
	'linkedin_url',
	'email',
	'name_and_company',
]);
export const SchemaPeopleLookupSkip = z
	.object({ field: SchemaPeopleMatchedBy, reason: z.string() })
	.passthrough();
export const SchemaPeopleBulkEnrichInvalid = z
	.object({
		identifier: z.string(),
		reason: z.string(),
		skipped: z.array(SchemaPeopleLookupSkip).optional(),
		unknown_fields: z.array(z.string()).optional(),
	})
	.passthrough();
export const SchemaPeopleBulkEnrichItem = z
	.object({
		identifier: z.string().optional(),
		id: z.string().optional(),
		linkedin_id: z.union([z.string(), z.number().int()]).optional(),
		linkedin_url: z.string().optional(),
		email: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		company_domain: z.string().optional(),
		company_name: z.string().optional(),
	})
	.strict();
export const SchemaPeopleBulkEnrichMatch = z
	.object({
		identifier: z.string(),
		matched_by: SchemaPeopleMatchedBy,
		person: SchemaPerson,
	})
	.passthrough();
export const SchemaPeopleBulkEnrichMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		total: z.number().int().min(0),
		matched_count: z.number().int().min(0),
		not_matched_count: z.number().int().min(0),
		invalid_count: z.number().int().min(0),
	})
	.passthrough();
export const SchemaPeopleBulkEnrichNotMatched = z
	.object({ identifier: z.string(), attempted: z.array(SchemaPeopleMatchedBy) })
	.passthrough();
export const SchemaPeopleBulkEnrichRequest = z
	.object({
		data: z.array(SchemaPeopleBulkEnrichItem).min(1).max(50),
		enrich_email: z.boolean().optional(),
		enrich_phone: z.boolean().optional(),
	})
	.strict();
export const SchemaPeopleBulkEnrichResult = z
	.object({
		matched: z.array(SchemaPeopleBulkEnrichMatch),
		not_matched: z.array(SchemaPeopleBulkEnrichNotMatched),
		invalid: z.array(SchemaPeopleBulkEnrichInvalid),
	})
	.passthrough();
export const SchemaPeopleBulkEnrichResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPeopleBulkEnrichResult,
		metadata: SchemaPeopleBulkEnrichMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleCompanyCountryFilter = z
	.object({
		include: z.array(z.string().min(1).max(512)).max(500).optional(),
		exclude: z.array(z.string().max(512)).max(500).optional(),
		headquarters_only: z.boolean().optional(),
	})
	.strict();
export const SchemaPeopleCompanyDomainFilter = z
	.object({
		include: z.array(z.string().min(3).max(253)).max(100).optional(),
		exclude: z.array(z.string().min(3).max(253)).max(100).optional(),
		match_mode: z
			.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
			.optional(),
	})
	.strict();
export const SchemaPeopleCompanyIdFilter = z
	.object({
		include: z
			.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
			.max(20000)
			.optional(),
		exclude: z
			.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
			.max(20000)
			.optional(),
	})
	.strict();
export const SchemaPeopleCompanyLinkedinUrlFilter = z
	.object({
		include: z.array(z.string()).max(500).optional(),
		exclude: z.array(z.string()).max(500).optional(),
	})
	.strict();
export const SchemaPeopleCompanyNameFilter = z
	.object({
		include: z.array(z.string().min(1).max(512)).max(500).optional(),
		exclude: z.array(z.string().max(512)).max(500).optional(),
		match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
	})
	.strict();
export const SchemaPeopleCompanyRefFilter = z
	.object({
		id: z
			.object({
				include: z
					.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
					.max(20000)
					.optional(),
				exclude: z
					.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
					.max(20000)
					.optional(),
			})
			.strict()
			.optional(),
		domain: z
			.object({
				include: z.array(z.string().min(3).max(253)).max(100).optional(),
				exclude: z.array(z.string().min(3).max(253)).max(100).optional(),
				match_mode: z
					.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
					.optional(),
			})
			.strict()
			.optional(),
		name: z
			.object({
				include: z.array(z.string().min(1).max(512)).max(500).optional(),
				exclude: z.array(z.string().max(512)).max(500).optional(),
				match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
			})
			.strict()
			.optional(),
		linkedin_id: z
			.object({
				include: z.array(z.number().int().min(1)).max(500).optional(),
				exclude: z.array(z.number().int().min(1)).max(500).optional(),
			})
			.strict()
			.optional(),
		linkedin_url: z
			.object({
				include: z.array(z.string()).max(500).optional(),
				exclude: z.array(z.string()).max(500).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const SchemaPeopleEmailContactDetailsFilter = z
	.object({
		status: z.array(SchemaEmailContactStatus).max(4).optional(),
		revealed: z.boolean().optional(),
	})
	.strict();
export const SchemaPhoneContactStatus = z.enum([
	'found',
	'not_found',
	'unknown',
]);
export const SchemaPeoplePhoneContactDetailsFilter = z
	.object({
		status: z.array(SchemaPhoneContactStatus).max(3).optional(),
		revealed: z.boolean().optional(),
	})
	.strict();
export const SchemaPeopleContactDetailsFilter = z
	.object({
		email: z
			.object({
				status: z.array(SchemaEmailContactStatus).max(4).optional(),
				revealed: z.boolean().optional(),
			})
			.strict()
			.optional(),
		phone: z
			.object({
				status: z.array(SchemaPhoneContactStatus).max(3).optional(),
				revealed: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const SchemaPeopleCountValue = z
	.object({
		value: z.string(),
		name: z.string().optional(),
		count: z.number().int().min(0),
	})
	.passthrough();
export const SchemaPeopleCountBreakdown = z
	.object({
		values: z.array(SchemaPeopleCountValue),
		unknown: z.number().int().min(0),
	})
	.passthrough();
export const SchemaPeopleCountPivotRow = z
	.object({
		country: z.string().optional(),
		department: z
			.enum([
				'C-Suite',
				'Consulting',
				'Design',
				'Education & Coaching',
				'Engineering & Technical',
				'Finance',
				'Human Resources',
				'Information Technology',
				'Legal',
				'Marketing',
				'Medical & Health',
				'Operations',
				'Procurement & Purchasing',
				'Product',
				'Sales',
			])
			.optional(),
		seniority: z
			.enum([
				'Owner',
				'C-Suite',
				'Partner',
				'VP',
				'Head',
				'Director',
				'Manager',
				'Senior',
				'Mid-level',
				'Entry',
				'Intern',
				'Unpaid',
			])
			.optional(),
		count: z.number().int().min(0),
	})
	.passthrough();
export const SchemaPeopleCount = z
	.object({
		total: z.number().int().min(0),
		groups: z
			.object({
				country: SchemaPeopleCountBreakdown.optional(),
				department: SchemaPeopleCountBreakdown.optional(),
				seniority: SchemaPeopleCountBreakdown.optional(),
			})
			.passthrough()
			.optional(),
		pivot: z.array(SchemaPeopleCountPivotRow).optional(),
	})
	.passthrough();
export const SchemaPeopleCountGroupBy = z.enum([
	'country',
	'department',
	'seniority',
]);
export const SchemaPeopleCountMetadata = z
	.object({ timestamp: z.iso.datetime(), counted_at: z.iso.datetime() })
	.passthrough();
export const SchemaPersonIdFilter = z
	.object({
		include: z
			.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
			.max(100)
			.optional(),
		exclude: z
			.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
			.max(100)
			.optional(),
	})
	.strict();
export const SchemaPersonNameFilter = z
	.object({
		include: z.array(z.string().min(1).max(512)).max(500).optional(),
		exclude: z.array(z.string().min(1).max(512)).max(500).optional(),
	})
	.strict();
export const SchemaPersonLinkedinUrlFilter = z
	.object({
		include: z.array(z.string().min(1).max(512)).min(1).max(50).optional(),
	})
	.strict();
export const SchemaPersonRefFilter = z
	.object({
		id: z
			.object({
				include: z
					.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
					.max(100)
					.optional(),
				exclude: z
					.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
					.max(100)
					.optional(),
			})
			.strict()
			.optional(),
		name: z
			.object({
				include: z.array(z.string().min(1).max(512)).max(500).optional(),
				exclude: z.array(z.string().min(1).max(512)).max(500).optional(),
			})
			.strict()
			.optional(),
		linkedin_url: z
			.object({
				include: z.array(z.string().min(1).max(512)).min(1).max(50).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const SchemaSmartJobTitleLevel = z.enum([
	'SAME_ROLE',
	'SIMILAR',
	'RELATED',
]);
export const SchemaPersonJobTitleFilter = z
	.object({
		include: z.array(z.string().min(2).max(100)).max(100).optional(),
		exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
		match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
		smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
		boolean_search: z.string().max(20000).optional(),
	})
	.strict();
export const SchemaSeniority = z.enum([
	'Owner',
	'C-Suite',
	'Partner',
	'VP',
	'Head',
	'Director',
	'Manager',
	'Senior',
	'Mid-level',
	'Entry',
	'Intern',
	'Unpaid',
]);
export const SchemaSeniorityFilter = z
	.object({
		include: z.array(SchemaSeniority).max(12).optional(),
		exclude: z.array(SchemaSeniority).max(12).optional(),
	})
	.strict();
export const SchemaPersonMonthsRangeFilter = z
	.object({
		min: z.number().int().min(0).max(600).optional(),
		max: z.number().int().min(0).max(600).optional(),
	})
	.strict();
export const SchemaPersonJobChangeFilter = z
	.object({
		timeframe_months: z.number().int().min(1).max(1000),
		change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
	})
	.strict();
export const SchemaPeopleIndustryFilter = z
	.object({
		include: z.array(z.string()).max(500).optional(),
		exclude: z.array(z.string()).max(500).optional(),
	})
	.strict();
export const SchemaPeopleNumberRangeFilter = z
	.object({ min: z.number().optional(), max: z.number().optional() })
	.strict();
export const SchemaPeopleNumberIncludeExcludeFilter = z
	.object({
		include: z.array(z.number()).max(500).optional(),
		exclude: z.array(z.number()).max(500).optional(),
	})
	.strict();
export const SchemaPeopleSavedScope = z.enum(['any', 'none', 'without_list']);
export const SchemaPeopleSavedAtRange = z
	.object({ from: z.string().optional(), to: z.string().optional() })
	.strict();
export const SchemaPeopleListsFilter = z
	.object({
		include: z.array(z.string().min(1).max(64)).max(100).optional(),
		exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
		saved: z.enum(['any', 'none', 'without_list']).optional(),
		saved_at: z
			.object({ from: z.string().optional(), to: z.string().optional() })
			.strict()
			.optional(),
	})
	.strict();
export const SchemaPeopleDuplicatesFilter = z
	.object({ exclude_exported: z.boolean().optional() })
	.strict();
export const SchemaPeopleFilters = z
	.object({
		person: z
			.object({
				id: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
							.max(100)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
							.max(100)
							.optional(),
					})
					.strict()
					.optional(),
				name: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().min(1).max(512)).max(500).optional(),
					})
					.strict()
					.optional(),
				linkedin_url: z
					.object({
						include: z
							.array(z.string().min(1).max(512))
							.min(1)
							.max(50)
							.optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		person_location: z
			.object({
				include: z.array(z.string().min(2).max(200)).max(100).optional(),
				exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
			})
			.strict()
			.optional(),
		company_keywords: z
			.object({
				include: z.array(z.string().min(3).max(100)).min(1).max(20),
				exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
				include_all: z.boolean().optional(),
				sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
			})
			.strict()
			.optional(),
		person_job_title: z
			.object({
				include: z.array(z.string().min(2).max(100)).max(100).optional(),
				exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
				match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
				smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
				boolean_search: z.string().max(20000).optional(),
			})
			.strict()
			.optional(),
		person_seniority: z
			.object({
				include: z.array(SchemaSeniority).max(12).optional(),
				exclude: z.array(SchemaSeniority).max(12).optional(),
			})
			.strict()
			.optional(),
		person_department: z
			.object({
				include: z.array(SchemaDepartment).max(196).optional(),
				exclude: z.array(SchemaDepartment).max(196).optional(),
			})
			.strict()
			.optional(),
		person_months_in_current_role: z
			.object({
				min: z.number().int().min(0).max(600).optional(),
				max: z.number().int().min(0).max(600).optional(),
			})
			.strict()
			.optional(),
		person_months_in_current_company: z
			.object({
				min: z.number().int().min(0).max(600).optional(),
				max: z.number().int().min(0).max(600).optional(),
			})
			.strict()
			.optional(),
		person_job_change: z
			.object({
				timeframe_months: z.number().int().min(1).max(1000),
				change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
			})
			.strict()
			.optional(),
		company: z
			.object({
				id: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
							.max(20000)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
							.max(20000)
							.optional(),
					})
					.strict()
					.optional(),
				domain: z
					.object({
						include: z.array(z.string().min(3).max(253)).max(100).optional(),
						exclude: z.array(z.string().min(3).max(253)).max(100).optional(),
						match_mode: z
							.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
							.optional(),
					})
					.strict()
					.optional(),
				name: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
					})
					.strict()
					.optional(),
				linkedin_id: z
					.object({
						include: z.array(z.number().int().min(1)).max(500).optional(),
						exclude: z.array(z.number().int().min(1)).max(500).optional(),
					})
					.strict()
					.optional(),
				linkedin_url: z
					.object({
						include: z.array(z.string()).max(500).optional(),
						exclude: z.array(z.string()).max(500).optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		company_industry: z
			.object({
				include: z.array(z.string()).max(500).optional(),
				exclude: z.array(z.string()).max(500).optional(),
			})
			.strict()
			.optional(),
		company_headcount_range: z
			.array(SchemaCompanyEmployeeRange)
			.min(1)
			.max(8)
			.optional(),
		company_country: z
			.object({
				include: z.array(z.string().min(1).max(512)).max(500).optional(),
				exclude: z.array(z.string().max(512)).max(500).optional(),
				headquarters_only: z.boolean().optional(),
			})
			.strict()
			.optional(),
		company_type: z
			.object({
				include: z.array(SchemaCompanyType).max(9).optional(),
				exclude: z.array(SchemaCompanyType).max(9).optional(),
			})
			.strict()
			.optional(),
		company_business_type: z
			.object({
				include: z.array(SchemaCompanyBusinessType).max(4).optional(),
				exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
			})
			.strict()
			.optional(),
		company_revenue_stream: z
			.object({
				include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
				exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
			})
			.strict()
			.optional(),
		company_ai_industry: z
			.object({
				include: z.array(SchemaAiIndustry).max(126).optional(),
				exclude: z.array(SchemaAiIndustry).max(126).optional(),
			})
			.strict()
			.optional(),
		company_founded: z
			.object({ min: z.number().optional(), max: z.number().optional() })
			.strict()
			.optional(),
		company_headcount_custom: z
			.object({ min: z.number().optional(), max: z.number().optional() })
			.strict()
			.optional(),
		company_headcount_by_department: z
			.array(SchemaCompanyHeadcountByDepartmentRow)
			.min(1)
			.max(10)
			.optional(),
		company_naics: z
			.object({
				include: z.array(z.number()).max(500).optional(),
				exclude: z.array(z.number()).max(500).optional(),
			})
			.strict()
			.optional(),
		company_location: z
			.object({
				include: z.array(z.string().min(2).max(200)).max(100).optional(),
				exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
				headquarters_only: z.boolean().optional(),
			})
			.strict()
			.optional(),
		company_technologies: z
			.object({
				include: z
					.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
					.max(500)
					.optional(),
				exclude: z
					.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
					.max(500)
					.optional(),
				match_mode: z.enum(['ANY', 'ALL']).optional(),
			})
			.strict()
			.optional(),
		company_technology_categories: z
			.object({
				include: z
					.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
					.max(200)
					.optional(),
				exclude: z
					.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
					.max(200)
					.optional(),
			})
			.strict()
			.optional(),
		contact_details: z
			.object({
				email: z
					.object({
						status: z.array(SchemaEmailContactStatus).max(4).optional(),
						revealed: z.boolean().optional(),
					})
					.strict()
					.optional(),
				phone: z
					.object({
						status: z.array(SchemaPhoneContactStatus).max(3).optional(),
						revealed: z.boolean().optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		lists: z
			.object({
				include: z.array(z.string().min(1).max(64)).max(100).optional(),
				exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
				saved: z.enum(['any', 'none', 'without_list']).optional(),
				saved_at: z
					.object({ from: z.string().optional(), to: z.string().optional() })
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		duplicates: z
			.object({ exclude_exported: z.boolean().optional() })
			.strict()
			.optional(),
		max_person_per_company: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export const SchemaPeopleCountRequest = z
	.object({
		filters: z
			.object({
				person: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.min(1)
									.max(50)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				person_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				person_job_title: z
					.object({
						include: z.array(z.string().min(2).max(100)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
						match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
						smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
						boolean_search: z.string().max(20000).optional(),
					})
					.strict()
					.optional(),
				person_seniority: z
					.object({
						include: z.array(SchemaSeniority).max(12).optional(),
						exclude: z.array(SchemaSeniority).max(12).optional(),
					})
					.strict()
					.optional(),
				person_department: z
					.object({
						include: z.array(SchemaDepartment).max(196).optional(),
						exclude: z.array(SchemaDepartment).max(196).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_role: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_company: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_job_change: z
					.object({
						timeframe_months: z.number().int().min(1).max(1000),
						change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
					})
					.strict()
					.optional(),
				company: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								match_mode: z
									.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
								match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z.array(z.string()).max(500).optional(),
								exclude: z.array(z.string()).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string()).max(500).optional(),
						exclude: z.array(z.string()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				contact_details: z
					.object({
						email: z
							.object({
								status: z.array(SchemaEmailContactStatus).max(4).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
						phone: z
							.object({
								status: z.array(SchemaPhoneContactStatus).max(3).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						include: z.array(z.string().min(1).max(64)).max(100).optional(),
						exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						saved_at: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				duplicates: z
					.object({ exclude_exported: z.boolean().optional() })
					.strict()
					.optional(),
				max_person_per_company: z.number().int().min(1).max(100).optional(),
			})
			.strict(),
		group_by: z.array(SchemaPeopleCountGroupBy).max(3).optional(),
		pivot: z.boolean().optional(),
		country_limit: z.number().int().min(1).max(250).optional(),
	})
	.strict();
export const SchemaPeopleCountResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPeopleCount,
		metadata: SchemaPeopleCountMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleCreditsPreview = z
	.object({
		requested: z.number().int().min(0),
		savable: z.number().int().min(0),
		not_matched: z.number().int().min(0),
		invalid: z.number().int().min(0),
		emails: z
			.object({
				to_charge: z.number().int().min(0),
				already_owned: z.number().int().min(0),
				without_email: z.number().int().min(0),
				edited: z.number().int().min(0),
			})
			.passthrough(),
		credits_needed: z.number().int().min(0),
		credits_available: z.number().int().min(0),
		enough_credits: z.boolean(),
		truncated: z.boolean(),
		estimate: z.boolean(),
		sample_size: z.number().int().nullable(),
	})
	.passthrough();
export const SchemaPeopleSortBy = z.enum([
	'person_first_name',
	'person_last_name',
	'person_seniority',
	'company_employee_count',
	'company_name',
	'company_industry',
	'person_country',
	'company_founded',
	'person_email_available',
	'person_job_title',
	'company_country',
	'company_type',
	'company_business_type',
	'company_revenue_stream',
	'person_saved_at',
]);
export const SchemaPeopleSaveItem = z
	.object({
		identifier: z.string().optional(),
		id: z.string().min(1).optional(),
		linkedin_url: z.string().min(1).optional(),
		primary_position_id: z
			.string()
			.regex(new RegExp('^[0-9a-fA-F]{24}$'))
			.optional(),
		primary_position_index: z.number().int().min(0).optional(),
		primary_company_id: z.string().min(1).optional(),
	})
	.strict();
export const SchemaPeopleCreditsPreviewRequest = z
	.object({
		filters: z
			.object({
				person: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.min(1)
									.max(50)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				person_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				person_job_title: z
					.object({
						include: z.array(z.string().min(2).max(100)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
						match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
						smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
						boolean_search: z.string().max(20000).optional(),
					})
					.strict()
					.optional(),
				person_seniority: z
					.object({
						include: z.array(SchemaSeniority).max(12).optional(),
						exclude: z.array(SchemaSeniority).max(12).optional(),
					})
					.strict()
					.optional(),
				person_department: z
					.object({
						include: z.array(SchemaDepartment).max(196).optional(),
						exclude: z.array(SchemaDepartment).max(196).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_role: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_company: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_job_change: z
					.object({
						timeframe_months: z.number().int().min(1).max(1000),
						change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
					})
					.strict()
					.optional(),
				company: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								match_mode: z
									.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
								match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z.array(z.string()).max(500).optional(),
								exclude: z.array(z.string()).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string()).max(500).optional(),
						exclude: z.array(z.string()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				contact_details: z
					.object({
						email: z
							.object({
								status: z.array(SchemaEmailContactStatus).max(4).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
						phone: z
							.object({
								status: z.array(SchemaPhoneContactStatus).max(3).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						include: z.array(z.string().min(1).max(64)).max(100).optional(),
						exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						saved_at: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				duplicates: z
					.object({ exclude_exported: z.boolean().optional() })
					.strict()
					.optional(),
				max_person_per_company: z.number().int().min(1).max(100).optional(),
			})
			.strict()
			.optional(),
		sort_by: z
			.enum([
				'person_first_name',
				'person_last_name',
				'person_seniority',
				'company_employee_count',
				'company_name',
				'company_industry',
				'person_country',
				'company_founded',
				'person_email_available',
				'person_job_title',
				'company_country',
				'company_type',
				'company_business_type',
				'company_revenue_stream',
				'person_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		exclude_ids: z.array(z.string()).max(25000).optional(),
		limit: z.number().int().min(1).max(1000000).optional(),
		list_ids: z.array(z.string()).max(20).optional(),
		allow_estimate: z.boolean().optional(),
		data: z
			.array(z.union([z.string(), SchemaPeopleSaveItem]))
			.min(1)
			.max(25000)
			.optional(),
	})
	.strict();
export const SchemaPeopleCreditsPreviewResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPeopleCreditsPreview,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleEditsUpdateRequest = z
	.object({
		first_name: z.string().max(100).nullable().optional(),
		last_name: z.string().max(100).nullable().optional(),
		email: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
	})
	.strict();
export const SchemaPeopleEditsUpdateResult = z
	.object({ id: z.string(), edits: SchemaPersonEdits })
	.passthrough();
export const SchemaPeopleEditsUpdateResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPeopleEditsUpdateResult,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleEnrichLookup = z
	.object({
		id: z.string().optional(),
		linkedin_id: z.union([z.string(), z.number().int()]).optional(),
		linkedin_url: z.string().optional(),
		email: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		company_domain: z.string().optional(),
		company_name: z.string().optional(),
	})
	.strict();
export const SchemaPeopleEnrichMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		matched_by: SchemaPeopleMatchedBy.optional(),
	})
	.passthrough();
export const SchemaPeopleEnrichRequest = z
	.object({
		data: z
			.object({
				id: z.string().optional(),
				linkedin_id: z.union([z.string(), z.number().int()]).optional(),
				linkedin_url: z.string().optional(),
				email: z.string().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				company_domain: z.string().optional(),
				company_name: z.string().optional(),
			})
			.strict(),
		enrich_email: z.boolean().optional(),
		enrich_phone: z.boolean().optional(),
	})
	.strict();
export const SchemaPeopleEnrichResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPerson.nullable(),
		metadata: SchemaPeopleEnrichMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleEnrichSearchRequest = z
	.object({
		filters: z
			.object({
				person: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.min(1)
									.max(50)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				person_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				person_job_title: z
					.object({
						include: z.array(z.string().min(2).max(100)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
						match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
						smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
						boolean_search: z.string().max(20000).optional(),
					})
					.strict()
					.optional(),
				person_seniority: z
					.object({
						include: z.array(SchemaSeniority).max(12).optional(),
						exclude: z.array(SchemaSeniority).max(12).optional(),
					})
					.strict()
					.optional(),
				person_department: z
					.object({
						include: z.array(SchemaDepartment).max(196).optional(),
						exclude: z.array(SchemaDepartment).max(196).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_role: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_company: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_job_change: z
					.object({
						timeframe_months: z.number().int().min(1).max(1000),
						change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
					})
					.strict()
					.optional(),
				company: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								match_mode: z
									.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
								match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z.array(z.string()).max(500).optional(),
								exclude: z.array(z.string()).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string()).max(500).optional(),
						exclude: z.array(z.string()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				contact_details: z
					.object({
						email: z
							.object({
								status: z.array(SchemaEmailContactStatus).max(4).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
						phone: z
							.object({
								status: z.array(SchemaPhoneContactStatus).max(3).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						include: z.array(z.string().min(1).max(64)).max(100).optional(),
						exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						saved_at: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				duplicates: z
					.object({ exclude_exported: z.boolean().optional() })
					.strict()
					.optional(),
				max_person_per_company: z.number().int().min(1).max(100).optional(),
			})
			.strict(),
		sort_by: z
			.enum([
				'person_first_name',
				'person_last_name',
				'person_seniority',
				'company_employee_count',
				'company_name',
				'company_industry',
				'person_country',
				'company_founded',
				'person_email_available',
				'person_job_title',
				'company_country',
				'company_type',
				'company_business_type',
				'company_revenue_stream',
				'person_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		exclude_ids: z.array(z.string()).max(100000).optional(),
		limit: z.number().int().min(1).max(100000).optional(),
	})
	.strict();
export const SchemaPeopleEnrichSearchResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPeopleEnrichSearchJob,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleEnrichmentItem = z
	.object({
		identifier: z.string().max(128).optional(),
		linkedin_url: z.string().max(512).optional(),
		email: z.string().max(512).optional(),
		first_name: z.string().max(512).optional(),
		last_name: z.string().max(512).optional(),
		company_domain: z.string().max(512).optional(),
		company_name: z.string().max(512).optional(),
	})
	.strict();
export const SchemaPeopleEnrichmentCreateRequest = z
	.object({
		name: z.string().max(128).optional(),
		data: z.array(SchemaPeopleEnrichmentItem).min(1).max(10000),
		enrich_email: z.boolean().optional(),
		enrich_phone: z.boolean().optional(),
	})
	.strict();
export const SchemaPeopleExportRequest = z
	.object({
		ids: z.array(z.string()).min(1).max(25000).optional(),
		filters: z
			.object({
				person: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.min(1)
									.max(50)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				person_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				person_job_title: z
					.object({
						include: z.array(z.string().min(2).max(100)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
						match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
						smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
						boolean_search: z.string().max(20000).optional(),
					})
					.strict()
					.optional(),
				person_seniority: z
					.object({
						include: z.array(SchemaSeniority).max(12).optional(),
						exclude: z.array(SchemaSeniority).max(12).optional(),
					})
					.strict()
					.optional(),
				person_department: z
					.object({
						include: z.array(SchemaDepartment).max(196).optional(),
						exclude: z.array(SchemaDepartment).max(196).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_role: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_company: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_job_change: z
					.object({
						timeframe_months: z.number().int().min(1).max(1000),
						change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
					})
					.strict()
					.optional(),
				company: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								match_mode: z
									.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
								match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z.array(z.string()).max(500).optional(),
								exclude: z.array(z.string()).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string()).max(500).optional(),
						exclude: z.array(z.string()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				contact_details: z
					.object({
						email: z
							.object({
								status: z.array(SchemaEmailContactStatus).max(4).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
						phone: z
							.object({
								status: z.array(SchemaPhoneContactStatus).max(3).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						include: z.array(z.string().min(1).max(64)).max(100).optional(),
						exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						saved_at: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				duplicates: z
					.object({ exclude_exported: z.boolean().optional() })
					.strict()
					.optional(),
				max_person_per_company: z.number().int().min(1).max(100).optional(),
			})
			.strict()
			.optional(),
		sort_by: z
			.enum([
				'person_first_name',
				'person_last_name',
				'person_seniority',
				'company_employee_count',
				'company_name',
				'company_industry',
				'person_country',
				'company_founded',
				'person_email_available',
				'person_job_title',
				'company_country',
				'company_type',
				'company_business_type',
				'company_revenue_stream',
				'person_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		limit: z.number().min(1).max(1000000).optional(),
		exclude_ids: z.array(z.string()).max(25000).optional(),
		extra_ids: z.array(z.string()).max(25000).optional(),
		pins: z.array(SchemaExportPositionPin).max(25000).optional(),
		scope: z.enum(['all', 'with_email']).optional(),
		columns: z
			.array(
				z.enum([
					'first_name',
					'last_name',
					'name',
					'linkedin_url',
					'email',
					'email_domain_status',
					'mobile_phone',
					'job_title',
					'normalized_job_title',
					'departments',
					'seniority',
					'person_country',
					'person_country_code',
					'person_state',
					'person_city',
					'person_time_zone',
					'person_time_zone_offset',
					'person_id',
					'in_lists',
					'saved_at',
					'company_name',
					'company_industry',
					'company_domain',
					'employee_range',
					'employee_count',
					'company_linkedin_url',
					'company_type',
					'company_country',
					'company_country_code',
					'company_state',
					'company_city',
					'company_raw_address',
					'company_keywords',
					'company_description',
					'company_founded',
					'company_logo_url',
					'company_email_domain',
					'company_email_provider',
					'company_id',
					'company_in_lists',
					'company_saved_at',
					'company_ai_industries',
					'other_positions',
				]),
			)
			.min(1)
			.max(43)
			.optional(),
		file_format: z.enum(['csv', 'xlsx']).optional(),
		name: z.string().max(64).optional(),
		source: SchemaExportSourceInput.optional(),
	})
	.strict();
export const SchemaPeopleGetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPerson,
		metadata: SchemaPeopleEnrichMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleListsAddStatus = z.enum([
	'added',
	'already_in_list',
	'not_saved',
	'invalid',
]);
export const SchemaPeopleListsAddItem = z
	.object({ id: z.string(), status: SchemaPeopleListsAddStatus })
	.passthrough();
export const SchemaPeopleListsAddRequest = z
	.object({ list_id: z.string(), ids: z.array(z.string()).min(1).max(500) })
	.strict();
export const SchemaPeopleListsAddResult = z
	.object({
		added: z.number().int().min(0),
		items: z.array(SchemaPeopleListsAddItem),
	})
	.passthrough();
export const SchemaPeopleListsAddResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPeopleListsAddResult,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleListsRemoveRequest = z
	.object({ list_id: z.string(), ids: z.array(z.string()).min(1).max(500) })
	.strict();
export const SchemaPeopleListsRemoveResponse = z
	.object({
		success: z.boolean(),
		data: SchemaListMembershipRemoveResult,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleListsSetRequest = z
	.object({
		ids: z.array(z.string()).min(1).max(25000).optional(),
		filters: z
			.object({
				person: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.min(1)
									.max(50)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				person_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				person_job_title: z
					.object({
						include: z.array(z.string().min(2).max(100)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
						match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
						smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
						boolean_search: z.string().max(20000).optional(),
					})
					.strict()
					.optional(),
				person_seniority: z
					.object({
						include: z.array(SchemaSeniority).max(12).optional(),
						exclude: z.array(SchemaSeniority).max(12).optional(),
					})
					.strict()
					.optional(),
				person_department: z
					.object({
						include: z.array(SchemaDepartment).max(196).optional(),
						exclude: z.array(SchemaDepartment).max(196).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_role: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_company: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_job_change: z
					.object({
						timeframe_months: z.number().int().min(1).max(1000),
						change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
					})
					.strict()
					.optional(),
				company: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								match_mode: z
									.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
								match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z.array(z.string()).max(500).optional(),
								exclude: z.array(z.string()).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string()).max(500).optional(),
						exclude: z.array(z.string()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				contact_details: z
					.object({
						email: z
							.object({
								status: z.array(SchemaEmailContactStatus).max(4).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
						phone: z
							.object({
								status: z.array(SchemaPhoneContactStatus).max(3).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						include: z.array(z.string().min(1).max(64)).max(100).optional(),
						exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						saved_at: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				duplicates: z
					.object({ exclude_exported: z.boolean().optional() })
					.strict()
					.optional(),
				max_person_per_company: z.number().int().min(1).max(100).optional(),
			})
			.strict()
			.optional(),
		sort_by: z
			.enum([
				'person_first_name',
				'person_last_name',
				'person_seniority',
				'company_employee_count',
				'company_name',
				'company_industry',
				'person_country',
				'company_founded',
				'person_email_available',
				'person_job_title',
				'company_country',
				'company_type',
				'company_business_type',
				'company_revenue_stream',
				'person_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		limit: z.number().min(1).max(25000).optional(),
		exclude_ids: z.array(z.string()).max(25000).optional(),
		extra_ids: z.array(z.string()).max(25000).optional(),
		list_ids: z.array(z.string()).min(1).max(100),
	})
	.strict();
export const SchemaPeopleListsSetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPeopleListsSetJob,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleSaveRequest = z
	.object({
		data: z
			.array(z.union([z.string(), SchemaPeopleSaveItem]))
			.min(1)
			.max(500),
		list_ids: z.array(z.string()).min(1).max(20),
	})
	.strict();
export const SchemaPersonSaveEmailHandedOver = z
	.object({
		status: z.string().nullable(),
		address: z.string(),
		revealed: z.literal(true),
	})
	.passthrough();
export const SchemaPersonSaveEmailSearching = z
	.object({
		status: z.literal('searching'),
		address: z.string().nullable(),
		revealed: z.literal(false),
		retry_after: z.number().int().min(1).optional(),
	})
	.passthrough();
export const SchemaPersonSaveEmail = z.union([
	SchemaPersonSaveEmailHandedOver,
	SchemaPersonSaveEmailSearching,
]);
export const SchemaPersonSaveSaved = z
	.object({
		identifier: z.string(),
		id: z.string(),
		matched_by: z.string(),
		list_ids: z.array(z.string()),
		saved_at: z.iso.datetime().nullable(),
		email: z
			.union([SchemaPersonSaveEmailHandedOver, SchemaPersonSaveEmailSearching])
			.nullable(),
	})
	.passthrough();
export const SchemaPeopleSaveResult = z
	.object({
		saved: z.array(SchemaPersonSaveSaved),
		not_matched: z.array(SchemaSaveNotMatched),
		invalid: z.array(SchemaSaveInvalid),
		failed: z.array(SchemaSaveFailed),
	})
	.passthrough();
export const SchemaPeopleSaveResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPeopleSaveResult,
		metadata: SchemaSaveResultMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleSaveSearchRequest = z
	.object({
		filters: z
			.object({
				person: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.min(1)
									.max(50)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				person_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				person_job_title: z
					.object({
						include: z.array(z.string().min(2).max(100)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
						match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
						smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
						boolean_search: z.string().max(20000).optional(),
					})
					.strict()
					.optional(),
				person_seniority: z
					.object({
						include: z.array(SchemaSeniority).max(12).optional(),
						exclude: z.array(SchemaSeniority).max(12).optional(),
					})
					.strict()
					.optional(),
				person_department: z
					.object({
						include: z.array(SchemaDepartment).max(196).optional(),
						exclude: z.array(SchemaDepartment).max(196).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_role: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_company: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_job_change: z
					.object({
						timeframe_months: z.number().int().min(1).max(1000),
						change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
					})
					.strict()
					.optional(),
				company: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								match_mode: z
									.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
								match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z.array(z.string()).max(500).optional(),
								exclude: z.array(z.string()).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string()).max(500).optional(),
						exclude: z.array(z.string()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				contact_details: z
					.object({
						email: z
							.object({
								status: z.array(SchemaEmailContactStatus).max(4).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
						phone: z
							.object({
								status: z.array(SchemaPhoneContactStatus).max(3).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						include: z.array(z.string().min(1).max(64)).max(100).optional(),
						exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						saved_at: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				duplicates: z
					.object({ exclude_exported: z.boolean().optional() })
					.strict()
					.optional(),
				max_person_per_company: z.number().int().min(1).max(100).optional(),
			})
			.strict(),
		sort_by: z
			.enum([
				'person_first_name',
				'person_last_name',
				'person_seniority',
				'company_employee_count',
				'company_name',
				'company_industry',
				'person_country',
				'company_founded',
				'person_email_available',
				'person_job_title',
				'company_country',
				'company_type',
				'company_business_type',
				'company_revenue_stream',
				'person_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		list_ids: z.array(z.string()).max(20).optional(),
		search_id: z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
		exclude_ids: z.array(z.string()).max(100000).optional(),
		limit: z.number().int().min(1).max(100000).optional(),
	})
	.strict();
export const SchemaPeopleSaveSearchResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPeopleSaveSearchJob,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPeopleSearchCompanyFilter = z
	.object({
		truncated: z.literal(true),
		companies_matched: z.number().int().min(0),
		companies_used: z.number().int().min(0),
		filters: z.array(z.string()),
	})
	.passthrough();
export const SchemaPeopleSearchPagination = z
	.object({
		page: z.number().int().min(1),
		per_page: z.number().int().min(1),
		total_pages: z.number().int().min(1),
		total_count: z.number().int().min(0),
		max_page: z.number().int().min(1),
		truncated: z.boolean(),
		total_is_estimate: z.boolean(),
	})
	.passthrough();
export const SchemaPeopleSearchSortIgnored = z
	.object({
		requested_sort_by: z.string(),
		requested_sort_direction: z.enum(['asc', 'desc']).nullable(),
		reason: z.literal('too_many_results'),
		max_results: z.number().int().min(1),
	})
	.passthrough();
export const SchemaPeopleSearchMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		sort_by: z.string(),
		sort_direction: SchemaSortDirection,
		pagination: SchemaPeopleSearchPagination,
		company_filter: SchemaPeopleSearchCompanyFilter.optional(),
		sort_ignored: SchemaPeopleSearchSortIgnored.optional(),
	})
	.passthrough();
export const SchemaPeopleSearchRequest = z
	.object({
		filters: z
			.object({
				person: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.min(1)
									.max(50)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				person_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				person_job_title: z
					.object({
						include: z.array(z.string().min(2).max(100)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
						match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
						smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
						boolean_search: z.string().max(20000).optional(),
					})
					.strict()
					.optional(),
				person_seniority: z
					.object({
						include: z.array(SchemaSeniority).max(12).optional(),
						exclude: z.array(SchemaSeniority).max(12).optional(),
					})
					.strict()
					.optional(),
				person_department: z
					.object({
						include: z.array(SchemaDepartment).max(196).optional(),
						exclude: z.array(SchemaDepartment).max(196).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_role: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_company: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_job_change: z
					.object({
						timeframe_months: z.number().int().min(1).max(1000),
						change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
					})
					.strict()
					.optional(),
				company: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								match_mode: z
									.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
								match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z.array(z.string()).max(500).optional(),
								exclude: z.array(z.string()).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string()).max(500).optional(),
						exclude: z.array(z.string()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				contact_details: z
					.object({
						email: z
							.object({
								status: z.array(SchemaEmailContactStatus).max(4).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
						phone: z
							.object({
								status: z.array(SchemaPhoneContactStatus).max(3).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						include: z.array(z.string().min(1).max(64)).max(100).optional(),
						exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						saved_at: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				duplicates: z
					.object({ exclude_exported: z.boolean().optional() })
					.strict()
					.optional(),
				max_person_per_company: z.number().int().min(1).max(100).optional(),
			})
			.strict(),
		sort_by: z
			.enum([
				'person_first_name',
				'person_last_name',
				'person_seniority',
				'company_employee_count',
				'company_name',
				'company_industry',
				'person_country',
				'company_founded',
				'person_email_available',
				'person_job_title',
				'company_country',
				'company_type',
				'company_business_type',
				'company_revenue_stream',
				'person_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		page: z.number().int().min(1).max(4000).optional(),
		per_page: z
			.union([z.literal(25), z.literal(50), z.literal(100)])
			.optional(),
		enrich_email: z.boolean().optional(),
		enrich_phone: z.boolean().optional(),
	})
	.strict();
export const SchemaPeopleSearchResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaPerson),
		metadata: SchemaPeopleSearchMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaPersonSuggestion = z
	.object({
		type: z.literal('person'),
		value: z.string(),
		id: z.string(),
		job_title: z.string().nullable(),
		company: z
			.object({ id: z.string(), name: z.string(), logo: z.url().nullable() })
			.passthrough()
			.nullable(),
		linkedin_url: z.url().nullable(),
		saved: z.boolean(),
	})
	.passthrough();
export const SchemaRateLimitWindows = z
	.object({
		second: z.number().int().min(0),
		minute: z.number().int().min(0),
		day: z.number().int().min(0),
	})
	.passthrough();
export const SchemaRateLimitBucketStatus = z
	.object({
		limits: SchemaRateLimitWindows,
		used: z
			.object({ minute: z.number().int().min(0), day: z.number().int().min(0) })
			.passthrough(),
		reset: z
			.object({ minute: z.number().int().min(0), day: z.number().int().min(0) })
			.passthrough(),
	})
	.passthrough();
export const SchemaRateLimitBuckets = z
	.object({
		search: SchemaRateLimitBucketStatus,
		enrich: SchemaRateLimitBucketStatus,
		jobs: SchemaRateLimitBucketStatus,
		poll: SchemaRateLimitBucketStatus,
		email: SchemaRateLimitBucketStatus,
	})
	.passthrough()
	.catchall(SchemaRateLimitBucketStatus);
export const SchemaRateLimitTier = z.enum([
	'free',
	'freeWallet',
	'tier49',
	'tier99',
	'tier199',
	'tier399',
]);
export const SchemaRateLimitStatus = z
	.object({
		tier: SchemaRateLimitTier,
		plan_name: z.string().nullable(),
		enforced_channels: z.array(SchemaRequestChannel),
		enforced: z.boolean(),
		buckets: SchemaRateLimitBuckets,
	})
	.passthrough();
export const SchemaRateLimitsGetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaRateLimitStatus,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaTrashKind = z.enum(['person', 'company', 'list']);
export const SchemaRestoreTrashRequest = z
	.object({
		kind: z.enum(['person', 'company', 'list']),
		ids: z.array(z.string()).min(1).max(25000).optional(),
		all: z.boolean().optional(),
		search: z.string().max(200).optional(),
		since: z.string().optional(),
	})
	.strict();
export const SchemaSearchMatchingTitlesMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		limit: z.number().int().min(1).max(50),
		returned: z.number().int().min(0),
		cached: z.boolean(),
	})
	.passthrough();
export const SchemaSearchMatchingTitlesRequest = z
	.object({
		boolean_search: z.string().min(2).max(20000),
		limit: z.number().int().min(1).max(50).optional(),
	})
	.strict();
export const SchemaSearchMatchingTitlesResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaMatchingTitle),
		metadata: SchemaSearchMatchingTitlesMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaSearchSmartJobTitlesMetadata = z
	.object({ timestamp: z.iso.datetime(), cached: z.boolean() })
	.passthrough();
export const SchemaSmartJobTitle = z
	.object({
		title: z.string(),
		level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']),
		new_people: z.number().int().min(1).nullable(),
	})
	.passthrough();
export const SchemaSmartExcludeJobTitle = z
	.object({
		title: z.string(),
		removed_people: z.number().int().min(0).nullable(),
	})
	.passthrough();
export const SchemaSmartJobTitlesData = z
	.object({
		intent: z.string(),
		titles: z.array(SchemaSmartJobTitle),
		exclude_titles: z.array(SchemaSmartExcludeJobTitle),
	})
	.passthrough();
export const SchemaSearchSmartJobTitlesResponse = z
	.object({
		success: z.boolean(),
		data: SchemaSmartJobTitlesData,
		metadata: SchemaSearchSmartJobTitlesMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaSuggestType = z.enum([
	'location',
	'job_title',
	'industry',
	'company_keywords',
	'person',
	'company',
	'technology',
]);
export const SchemaSearchSuggestMetadata = z
	.object({
		timestamp: z.iso.datetime(),
		type: SchemaSuggestType,
		query: z.string(),
	})
	.passthrough();
export const SchemaSearchSuggestRequest = z
	.object({
		type: z.enum([
			'location',
			'job_title',
			'industry',
			'company_keywords',
			'person',
			'company',
			'technology',
		]),
		query: z.string().max(100).optional(),
		limit: z.number().int().min(1).max(25).optional(),
		ids: z.array(z.string()).max(500).optional(),
	})
	.strict();
export const SchemaTechnologySuggestion = z
	.object({
		type: z.literal('technology'),
		value: z.string(),
		kind: z.enum(['technology', 'category']),
		id: z.string(),
		name: z.string(),
		icon_url: z.url().nullable().optional(),
		category_names: z.array(z.string()).optional(),
		company_count: z.number().int().min(0),
	})
	.passthrough();
export const SchemaSuggestion = z.union([
	SchemaLocationSuggestion,
	SchemaJobTitleSuggestion,
	SchemaIndustrySuggestion,
	SchemaCompanyKeywordSuggestion,
	SchemaPersonSuggestion,
	SchemaCompanySuggestion,
	SchemaTechnologySuggestion,
]);
export const SchemaSearchSuggestResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaSuggestion),
		metadata: SchemaSearchSuggestMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaSmartJobTitlesRequest = z
	.object({
		job_titles: z.array(z.string()).min(1).max(20),
		exclude_job_titles: z.array(z.string()).max(20).optional(),
		filters: z
			.object({
				person: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.min(1)
									.max(50)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				person_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				person_job_title: z
					.object({
						include: z.array(z.string().min(2).max(100)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
						match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
						smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
						boolean_search: z.string().max(20000).optional(),
					})
					.strict()
					.optional(),
				person_seniority: z
					.object({
						include: z.array(SchemaSeniority).max(12).optional(),
						exclude: z.array(SchemaSeniority).max(12).optional(),
					})
					.strict()
					.optional(),
				person_department: z
					.object({
						include: z.array(SchemaDepartment).max(196).optional(),
						exclude: z.array(SchemaDepartment).max(196).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_role: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_company: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_job_change: z
					.object({
						timeframe_months: z.number().int().min(1).max(1000),
						change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
					})
					.strict()
					.optional(),
				company: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								match_mode: z
									.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
								match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z.array(z.string()).max(500).optional(),
								exclude: z.array(z.string()).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string()).max(500).optional(),
						exclude: z.array(z.string()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				contact_details: z
					.object({
						email: z
							.object({
								status: z.array(SchemaEmailContactStatus).max(4).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
						phone: z
							.object({
								status: z.array(SchemaPhoneContactStatus).max(3).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						include: z.array(z.string().min(1).max(64)).max(100).optional(),
						exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						saved_at: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				duplicates: z
					.object({ exclude_exported: z.boolean().optional() })
					.strict()
					.optional(),
				max_person_per_company: z.number().int().min(1).max(100).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const SchemaTrashCompaniesAddResponse = z
	.object({
		success: z.boolean(),
		data: SchemaCompaniesDeleteJob,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaTrashCompaniesRequest = z
	.object({
		ids: z.array(z.string()).min(1).max(25000).optional(),
		filters: z
			.object({
				company: z
					.object({
						id: z
							.object({
								include: z.array(z.string()).max(20000).optional(),
								exclude: z.array(z.string()).max(20000).optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						include: z.array(z.string()).max(100).optional(),
						exclude: z.array(z.string()).max(100).optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		sort_by: z
			.enum([
				'company_name',
				'company_employee_count',
				'company_industry',
				'company_country',
				'company_founded',
				'company_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		limit: z.number().min(1).max(25000).optional(),
		exclude_ids: z.array(z.string()).max(25000).optional(),
		extra_ids: z.array(z.string()).max(25000).optional(),
	})
	.strict();
export const SchemaTrashItem = z
	.object({
		id: z.string(),
		kind: SchemaTrashKind,
		name: z.string(),
		detail: z.string().nullable(),
		lists: z.array(
			z
				.object({ id: z.string(), name: z.string(), deleted: z.boolean() })
				.passthrough(),
		),
		deleted_by: z
			.object({ id: z.string(), name: z.string() })
			.passthrough()
			.nullable(),
		deleted_at: z.iso.datetime(),
		expires_at: z.iso.datetime(),
		cascade_of_list: z
			.object({ id: z.string(), name: z.string() })
			.passthrough()
			.nullable(),
		member_count: z.number().int().min(0).optional(),
		list_type: z.enum(['people', 'companies']).optional(),
	})
	.passthrough();
export const SchemaTrashListMetadata = z
	.object({ timestamp: z.iso.datetime(), pagination: SchemaPagination })
	.passthrough();
export const SchemaTrashListResponse = z
	.object({
		success: z.boolean(),
		data: z.array(SchemaTrashItem),
		metadata: SchemaTrashListMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaTrashPeopleAddResponse = z
	.object({
		success: z.boolean(),
		data: SchemaPeopleDeleteJob,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaTrashPeopleRequest = z
	.object({
		ids: z.array(z.string()).min(1).max(25000).optional(),
		filters: z
			.object({
				person: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(100)
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.min(1)
									.max(50)
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				person_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
					})
					.strict()
					.optional(),
				company_keywords: z
					.object({
						include: z.array(z.string().min(3).max(100)).min(1).max(20),
						exclude: z.array(z.string().min(3).max(100)).max(20).optional(),
						include_all: z.boolean().optional(),
						sources: z.array(SchemaKeywordsSource).min(1).max(3).optional(),
					})
					.strict()
					.optional(),
				person_job_title: z
					.object({
						include: z.array(z.string().min(2).max(100)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(100)).max(100).optional(),
						match_mode: z.enum(['CONTAINS', 'EXACT', 'SMART']).optional(),
						smart_level: z.enum(['SAME_ROLE', 'SIMILAR', 'RELATED']).optional(),
						boolean_search: z.string().max(20000).optional(),
					})
					.strict()
					.optional(),
				person_seniority: z
					.object({
						include: z.array(SchemaSeniority).max(12).optional(),
						exclude: z.array(SchemaSeniority).max(12).optional(),
					})
					.strict()
					.optional(),
				person_department: z
					.object({
						include: z.array(SchemaDepartment).max(196).optional(),
						exclude: z.array(SchemaDepartment).max(196).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_role: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_months_in_current_company: z
					.object({
						min: z.number().int().min(0).max(600).optional(),
						max: z.number().int().min(0).max(600).optional(),
					})
					.strict()
					.optional(),
				person_job_change: z
					.object({
						timeframe_months: z.number().int().min(1).max(1000),
						change_type: z.enum(['any', 'promotion', 'new_company']).optional(),
					})
					.strict()
					.optional(),
				company: z
					.object({
						id: z
							.object({
								include: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
								exclude: z
									.array(z.string().regex(new RegExp('^[0-9a-fA-F]{24}$')))
									.max(20000)
									.optional(),
							})
							.strict()
							.optional(),
						domain: z
							.object({
								include: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								exclude: z
									.array(z.string().min(3).max(253))
									.max(100)
									.optional(),
								match_mode: z
									.enum(['ORGANIZATION', 'PRIMARY', 'LINKEDIN_WEBSITE'])
									.optional(),
							})
							.strict()
							.optional(),
						name: z
							.object({
								include: z
									.array(z.string().min(1).max(512))
									.max(500)
									.optional(),
								exclude: z.array(z.string().max(512)).max(500).optional(),
								match_mode: z.enum(['EXACT', 'CONTAINS']).optional(),
							})
							.strict()
							.optional(),
						linkedin_id: z
							.object({
								include: z.array(z.number().int().min(1)).max(500).optional(),
								exclude: z.array(z.number().int().min(1)).max(500).optional(),
							})
							.strict()
							.optional(),
						linkedin_url: z
							.object({
								include: z.array(z.string()).max(500).optional(),
								exclude: z.array(z.string()).max(500).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				company_industry: z
					.object({
						include: z.array(z.string()).max(500).optional(),
						exclude: z.array(z.string()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_headcount_range: z
					.array(SchemaCompanyEmployeeRange)
					.min(1)
					.max(8)
					.optional(),
				company_country: z
					.object({
						include: z.array(z.string().min(1).max(512)).max(500).optional(),
						exclude: z.array(z.string().max(512)).max(500).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_type: z
					.object({
						include: z.array(SchemaCompanyType).max(9).optional(),
						exclude: z.array(SchemaCompanyType).max(9).optional(),
					})
					.strict()
					.optional(),
				company_business_type: z
					.object({
						include: z.array(SchemaCompanyBusinessType).max(4).optional(),
						exclude: z.array(SchemaCompanyBusinessType).max(4).optional(),
					})
					.strict()
					.optional(),
				company_revenue_stream: z
					.object({
						include: z.array(SchemaCompanyRevenueStream).max(12).optional(),
						exclude: z.array(SchemaCompanyRevenueStream).max(12).optional(),
					})
					.strict()
					.optional(),
				company_ai_industry: z
					.object({
						include: z.array(SchemaAiIndustry).max(126).optional(),
						exclude: z.array(SchemaAiIndustry).max(126).optional(),
					})
					.strict()
					.optional(),
				company_founded: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_custom: z
					.object({ min: z.number().optional(), max: z.number().optional() })
					.strict()
					.optional(),
				company_headcount_by_department: z
					.array(SchemaCompanyHeadcountByDepartmentRow)
					.min(1)
					.max(10)
					.optional(),
				company_naics: z
					.object({
						include: z.array(z.number()).max(500).optional(),
						exclude: z.array(z.number()).max(500).optional(),
					})
					.strict()
					.optional(),
				company_location: z
					.object({
						include: z.array(z.string().min(2).max(200)).max(100).optional(),
						exclude: z.array(z.string().min(2).max(200)).max(100).optional(),
						headquarters_only: z.boolean().optional(),
					})
					.strict()
					.optional(),
				company_technologies: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(500)
							.optional(),
						match_mode: z.enum(['ANY', 'ALL']).optional(),
					})
					.strict()
					.optional(),
				company_technology_categories: z
					.object({
						include: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
						exclude: z
							.array(z.string().regex(new RegExp('^[1-9][0-9]{0,9}$')))
							.max(200)
							.optional(),
					})
					.strict()
					.optional(),
				contact_details: z
					.object({
						email: z
							.object({
								status: z.array(SchemaEmailContactStatus).max(4).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
						phone: z
							.object({
								status: z.array(SchemaPhoneContactStatus).max(3).optional(),
								revealed: z.boolean().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				lists: z
					.object({
						include: z.array(z.string().min(1).max(64)).max(100).optional(),
						exclude: z.array(z.string().min(1).max(64)).max(1000).optional(),
						saved: z.enum(['any', 'none', 'without_list']).optional(),
						saved_at: z
							.object({
								from: z.string().optional(),
								to: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				duplicates: z
					.object({ exclude_exported: z.boolean().optional() })
					.strict()
					.optional(),
				max_person_per_company: z.number().int().min(1).max(100).optional(),
			})
			.strict()
			.optional(),
		sort_by: z
			.enum([
				'person_first_name',
				'person_last_name',
				'person_seniority',
				'company_employee_count',
				'company_name',
				'company_industry',
				'person_country',
				'company_founded',
				'person_email_available',
				'person_job_title',
				'company_country',
				'company_type',
				'company_business_type',
				'company_revenue_stream',
				'person_saved_at',
			])
			.optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		limit: z.number().min(1).max(25000).optional(),
		exclude_ids: z.array(z.string()).max(25000).optional(),
		extra_ids: z.array(z.string()).max(25000).optional(),
	})
	.strict();
export const SchemaTrashRestoreResponse = z
	.object({
		success: z.boolean(),
		data: SchemaTrashRestoreJob,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
export const SchemaUsageAction = z.enum([
	'search',
	'enrich',
	'enrichment',
	'save',
	'export',
	'csv_enrichment',
	'email_verify',
	'other',
]);
export const SchemaUsageChannel = z.enum([
	'app',
	'extension',
	'sheets',
	'api',
	'mcp',
]);
export const SchemaUsageEntity = z.enum(['people', 'companies']);
export const SchemaUsageGroupBy = z.enum(['day', 'source']);
export const SchemaUsageSeriesRow = z
	.object({
		key: z.string(),
		channel: z.string().optional(),
		action: z.string().optional(),
		entity: z.string().optional(),
		email_search: z.number().int().min(0),
		email_verification: z.number().int().min(0),
		phone_search: z.number().int().min(0),
		email_credits: z.number().int().min(0),
		verification_credits: z.number().int().min(0),
		phone_credits: z.number().int().min(0),
		searches: z.number().int().min(0),
		enriches: z.number().int().min(0),
		people_searches: z.number().int().min(0),
		company_searches: z.number().int().min(0),
		people_enriches: z.number().int().min(0),
		company_enriches: z.number().int().min(0),
		email_finds: z.number().int().min(0),
	})
	.passthrough();
export const SchemaUsageTotals = z
	.object({
		email_search: z.number().int().min(0),
		email_verification: z.number().int().min(0),
		phone_search: z.number().int().min(0),
		email_credits: z.number().int().min(0),
		verification_credits: z.number().int().min(0),
		phone_credits: z.number().int().min(0),
		searches: z.number().int().min(0),
		enriches: z.number().int().min(0),
		people_searches: z.number().int().min(0),
		company_searches: z.number().int().min(0),
		people_enriches: z.number().int().min(0),
		company_enriches: z.number().int().min(0),
		email_finds: z.number().int().min(0),
		total_credits: z.number().int().min(0),
	})
	.passthrough();
export const SchemaUsageSummary = z
	.object({ totals: SchemaUsageTotals, series: z.array(SchemaUsageSeriesRow) })
	.passthrough();
export const SchemaUsageSummaryGetResponse = z
	.object({
		success: z.boolean(),
		data: SchemaUsageSummary,
		metadata: SchemaEnvelopeMetadata,
		errors: z.array(SchemaApiError).optional(),
	})
	.passthrough();
