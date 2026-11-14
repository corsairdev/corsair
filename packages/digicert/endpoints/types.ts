import { z } from 'zod';

const PageSchema = z
	.object({
		total: z.number(),
		limit: z.number(),
		offset: z.number(),
	})
	.passthrough();

// CertCentral documents additive response fields; validate known keys and retain provider additions.
const UserSchema = z
	.object({
		id: z.number(),
		username: z.string(),
		account_id: z.number(),
		first_name: z.string(),
		last_name: z.string(),
		email: z.string(),
		job_title: z.string().optional(),
		telephone: z.string().optional(),
		status: z.string(),
		// Nested container records follow the same documented additive response behavior.
		container: z
			.object({
				id: z.number(),
				public_id: z.string().optional(),
				name: z.string(),
				parent_id: z.number().optional(),
				template_id: z.number().optional(),
				ekey: z.string().optional(),
				has_logo: z.boolean().optional(),
				is_active: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		access_roles: z.array(
			z.object({ id: z.number(), name: z.string() }).passthrough(),
		),
		type: z.string(),
		has_container_assignments: z.boolean(),
		container_assignments: z
			.array(
				z
					.object({
						id: z.number(),
						parent_id: z.number(),
						name: z.string(),
						is_active: z.boolean(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

// CertCentral documents additive response fields; validate known keys and retain provider additions.
const OrderSchema = z
	.object({
		id: z.number(),
		// Nested certificate records may also gain documented additive fields.
		certificate: z
			.object({
				id: z.number(),
				common_name: z.string(),
				dns_names: z.array(z.string()).optional(),
				valid_till: z.string().optional(),
				days_remaining: z.number().optional(),
				signature_hash: z.string().optional(),
			})
			.passthrough()
			.optional(),
		status: z.string(),
		is_renewed: z.boolean().optional(),
		date_created: z.string().optional(),
		// This endpoint documents organizations as either an object or an empty array.
		organization: z
			.union([
				z.object({ id: z.number(), name: z.string() }).passthrough(),
				z.array(z.never()),
			])
			.optional(),
		validity_years: z.number().optional(),
		disable_renewal_notifications: z.boolean().optional(),
		// Nested container records may gain additive properties.
		container: z
			.object({ id: z.number(), name: z.string() })
			.passthrough()
			.optional(),
		// Product response details are extensible in the Services API.
		product: z
			.object({ name_id: z.string(), name: z.string(), type: z.string() })
			.passthrough()
			.optional(),
		has_duplicates: z.boolean().optional(),
		product_name_id: z.string().optional(),
	})
	.passthrough();

// CertCentral documents additive response fields; validate known keys and retain provider additions.
const OrganizationSchema = z
	.object({
		id: z.number(),
		status: z.string(),
		name: z.string(),
		display_name: z.string().optional(),
		is_active: z.boolean(),
		address: z.string().optional(),
		address2: z.string().optional(),
		zip: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		country: z.string().optional(),
		telephone: z.string().optional(),
		// Nested container records may gain additive properties.
		container: z
			.object({
				id: z.number(),
				parent_id: z.number(),
				name: z.string(),
				is_active: z.boolean(),
			})
			.passthrough()
			.optional(),
		container_id_assignments: z.array(z.string()).optional(),
	})
	.passthrough();

const UsersListInputSchema = z
	.object({
		container_id: z.number().int().positive().optional(),
		access_role_id: z.number().int().positive().optional(),
		without_container: z.boolean().optional(),
		filters: z
			.object({
				status: z.enum(['active', 'incomplete', 'inactive']).optional(),
				search: z.string().optional(),
			})
			.strict()
			.optional(),
		sort: z.string().optional(),
		offset: z.number().int().min(0).optional(),
		limit: z.number().int().min(0).optional(),
	})
	.strict();

const OrdersListInputSchema = z
	.object({
		filters: z
			.object({
				id: z.string().optional(),
				status: z
					.enum([
						'pending',
						'issued',
						'rejected',
						'revoked',
						'waiting_pickup',
						'reissue_pending',
						'canceled',
						'active_issued',
					])
					.optional(),
				organization_id: z.string().optional(),
				product_name_id: z.string().optional(),
				valid_till: z.string().optional(),
				user_id: z.string().optional(),
				common_name: z.string().optional(),
				domain_name: z.string().optional(),
				date_created: z.string().optional(),
				container_id: z.string().optional(),
				is_renewed: z.enum(['0', '1']).optional(),
				disable_renewal_notifications: z.enum(['0', '1']).optional(),
				email: z.string().optional(),
				certificate_id: z.string().optional(),
				origin: z.enum(['certcentral', 'migrated']).optional(),
				serial_number: z.string().optional(),
				search: z.string().optional(),
			})
			.strict()
			.optional(),
		sort: z.string().optional(),
		offset: z.number().int().min(0).optional(),
		limit: z.number().int().min(0).max(5000).optional(),
	})
	.strict();

const OrganizationsListInputSchema = z
	.object({
		include_validation: z.boolean().optional(),
		filters: z
			.object({
				status: z.enum(['active', 'inactive']).optional(),
				validation: z.enum(['pending', 'not_pending']).optional(),
				container_id_for_organization: z.string().optional(),
				search: z.string().optional(),
			})
			.strict()
			.optional(),
		sort: z.string().optional(),
		limit: z.number().int().min(0).max(1000).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

const IntermediatesListInputSchema = z.object({}).strict();
const AccountManagerLocalesInputSchema = z.object({}).strict();
const PrivateCAHelperInputSchema = z.object({}).strict();
const CertificateTagsInputSchema = z
	.object({ certificateId: z.string().min(1), tags: z.array(z.string()) })
	.strict();
const VerifyTemplateInputSchema = z
	.object({ template: z.string().min(1) })
	.strict();
const TrustLifecycleVersionInputSchema = z.object({}).strict();
const ContentTrustInfoInputSchema = z
	.object({ lang: z.string().min(2).max(35) })
	.strict();

const IntermediatesResponseSchema = z
	.object({
		intermediates: z.array(
			z
				.object({
					id: z.string(),
					subject_common_name: z.string(),
					subject_org_name: z.string(),
					valid_from: z.string().optional(),
					issuer_common_name: z.string(),
					status: z.string(),
					valid_to: z.string(),
					serial_number: z.string(),
					thumbprint: z.string(),
					signature_hash: z.string(),
					is_private: z.string(),
					is_root: z.string(),
					pem: z.string(),
				})
				.passthrough(),
		),
	})
	.passthrough();

const AccountManagerLocalesResponseSchema = z.array(
	z
		.object({
			code: z
				.enum([
					'de_DE',
					'en_US',
					'es_ES',
					'fr_FR',
					'it_IT',
					'ja_JP',
					'ko_KR',
					'pt_PT',
					'ru_RU',
					'zh_CN',
					'zh_TW',
				])
				// DigiCert adds locales over time (the live list has nl_NL, which the reference omits).
				.or(z.string())
				.optional(),
			language: z
				.enum([
					'Deutsch',
					'English',
					'Español',
					'Français',
					'Italiano',
					'日本語',
					'한국어',
					'Português',
					'Русский',
					'简体中文',
					'繁體中文',
				])
				.or(z.string())
				.optional(),
		})
		.passthrough(),
);

const PrivateCAHelperResponseSchema = z
	.object({ version: z.string() })
	.passthrough();

const TrustLifecycleVersionResponseSchema = z
	.object({ version: z.string() })
	.passthrough();
const ContentTrustInfoResponseSchema = z
	.object({
		lang: z.string().optional(),
		specs: z.string().optional(),
		name: z.string().optional(),
		logo: z.string().url().optional(),
		region: z.string().optional(),
		description: z.string().max(255).optional(),
		oauth2: z.string().url().optional(),
		methods: z.array(z.string()).optional(),
		authType: z.array(z.string()).optional(),
	})
	.passthrough();

const ReportNamesInputSchema = z
	.object({ report_display_name: z.string().optional() })
	.strict();
const ReportTypesInputSchema = z
	.object({ language_id: z.number().int().positive().optional() })
	.strict();
const ReportHistoryInputSchema = z
	.object({
		offset: z.number().int().min(0).optional(),
		limit: z.number().int().positive().optional(),
		report_display_name: z.string().optional(),
		schedule: z.enum(['ON_DEMAND', 'WEEKLY', 'MONTHLY']).optional(),
		status: z.enum(['SCHEDULED', 'GENERATING', 'READY', 'FAILED']).optional(),
		report_type: z.string().optional(),
		report_type_display_name: z.string().optional(),
		search: z.string().optional(),
		sort_by: z
			.enum([
				'report_display_name',
				'report_type',
				'schedule',
				'format',
				'report_start_date',
			])
			.optional(),
		sort_direction: z.enum(['ASC', 'DESC']).optional(),
		language_id: z.number().int().positive().optional(),
	})
	.strict();
const ReportDetailsInputSchema = z
	.object({
		reportIdentifier: z.string().uuid(),
		language_id: z.number().int().positive().optional(),
	})
	.strict();

const ReportTypeSchema = z
	.object({
		report_type: z.string(),
		display_name: z.string(),
		supported_formats: z.array(z.string()),
		custom_fields_enabled: z.boolean(),
		sub_account_enabled: z.boolean(),
		division_enabled: z.boolean(),
		report_description: z.string(),
		status: z.boolean(),
		is_customizable: z.boolean().optional(),
		is_customisable: z.boolean().optional(),
	})
	.passthrough();
const ReportHistoryItemSchema = z
	.object({
		report_display_name: z.string(),
		report_identifier: z.string().uuid(),
		report_run_identifier: z.string().optional(),
		created_by_user_id: z.number().or(z.string()),
		created_by_user_name: z.string(),
		created_date: z.string(),
		report_type: z.string(),
		report_type_display_name: z.string(),
		report_start_date: z.string().optional(),
		report_end_date: z.string().optional(),
		schedule: z.string().optional(),
		format: z.array(z.string()).optional(),
		status: z.string(),
		manually_triggered: z.boolean().optional(),
		split_report_count: z.number().optional(),
		data_from_date: z.string().optional(),
		data_to_date: z.string().optional(),
	})
	.passthrough();
const ReportDetailsSchema = z
	.object({
		report: z
			.object({
				report_display_name: z.string(),
				report_identifier: z.string().uuid(),
				created_by_user_id: z.number().or(z.string()),
				created_by_user_name: z.string(),
				created_date: z.string(),
				report_metadata: z
					.object({
						report_type: z.string(),
						columns: z.array(
							z.object({ identifier: z.string() }).passthrough(),
						),
						filters: z
							.array(
								z
									.object({
										filter_identifier: z.string(),
										column_identifier: z.string(),
										values: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
						sources: z
							.object({
								division_filter_type: z.string().optional(),
								sub_account_filter_type: z.string().optional(),
								divisions: z.array(z.number()).nullable().optional(),
								sub_accounts: z.array(z.number()).nullable().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
				schedule: z
					.object({
						frequency: z.string(),
						weekday_to_run: z.string().optional(),
						weekday_frequency: z.string().optional(),
						run_until: z.string().optional(),
						repeat_every: z.number().optional(),
						repeat_on: z.string().optional(),
						repeat_on_date: z
							.object({
								date: z.number().optional(),
								last_day_of_the_month: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough(),
				next_run_date: z.string().optional(),
				format: z.array(z.string()),
				status: z.string(),
				notification_emails: z
					.array(
						z
							.object({
								user_id: z.number(),
								first_name: z.string(),
								last_name: z.string(),
								email: z.string(),
							})
							.passthrough(),
					)
					.nullable()
					.optional(),
			})
			.passthrough(),
	})
	.passthrough();

const CustomReportFields = [
	'account_id',
	'additional_emails',
	'agreement_id',
	'auto_renew',
	'ca_cert_id',
	'certificate_tracker_id',
	'common_name',
	'contacts_email',
	'container_id',
	'container_name',
	'cost',
	'csr',
	'custom_renewal_message',
	'customer_order_id',
	'date_created',
	'dcv_method',
	'disable_issuance_email',
	'disable_renewal_notifications',
	'dns_names',
	'email',
	'firstname',
	'has_duplicates',
	'id',
	'is_out_of_contract',
	'is_renewed',
	'issuer_common_name',
	'job_title',
	'lastname',
	'locale',
	'metadata',
	'org_addr1',
	'org_addr2',
	'organization_city',
	'organization_country',
	'organization_id',
	'organization_name',
	'organization_state',
	'organization_unit',
	'pay_type',
	'plus_feature',
	'product_id',
	'product_name',
	'product_name_id',
	'product_type',
	'purchased_dns_names',
	'receipt_id',
	'Renewed',
	'renewed_order_id',
	'serial_number',
	'server_platform_id',
	'signature_hash',
	'status',
	'telephone',
	'thumbprint',
	'user_assignments',
	'user_email',
	'user_first_name',
	'user_id',
	'user_last_name',
	'valid_from',
	'valid_till',
	'validity_years',
] as const;
const CustomReportSortField = [
	'valid_till',
	'container_id',
	'organization_id',
	'product_name_id',
	'serial_number',
	'signature_hash',
	'user_id',
	'date_created',
	'ca_cert_id',
	'common_name',
	'dns_names',
	'locale',
	'thumbprint',
	'email',
] as const;
const CustomReportQueryInputSchema = z
	.object({
		fields: z.array(z.enum(CustomReportFields)).min(1),
		id: z.number().int().positive().optional(),
		status: z.string().optional(),
		valid_from: z.string().optional(),
		valid_till: z.string().optional(),
		container_id: z.string().optional(),
		organization_id: z.string().optional(),
		product_name_id: z.string().optional(),
		serial_number: z.string().optional(),
		signature_hash: z.string().optional(),
		user_id: z.string().optional(),
		date_created: z.string().optional(),
		ca_cert_id: z.string().optional(),
		common_name: z.string().optional(),
		dns_names: z.string().optional(),
		locale: z.string().optional(),
		thumbprint: z.string().optional(),
		email: z.string().email().optional(),
		search: z.string().optional(),
		sort: z
			.tuple([z.enum(CustomReportSortField), z.enum(['ASC', 'DESC'])])
			.optional(),
		offset: z.number().int().min(0).optional(),
		limit: z.number().int().min(1).max(1000).optional(),
	})
	.strict();
const CustomReportByIdInputSchema = z
	.object({
		id: z.number().int().positive(),
		fields: z.array(z.enum(CustomReportFields)).min(1),
	})
	.strict();
// `unknown`: Custom Reports returns user-selected nullable/scalar fields with no
// common narrower value type, so this recursive GraphQL JSON schema stays generic.
const GraphQLValueSchema: z.ZodType<unknown> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(GraphQLValueSchema),
		z.record(z.string(), GraphQLValueSchema),
	]),
);
const CustomReportOrdersResponseSchema = z
	.object({
		data: z
			.object({
				order_details: z.array(z.record(z.string(), GraphQLValueSchema)),
			})
			.passthrough(),
	})
	.passthrough();
const CustomReportByIdResponseSchema = z
	.object({
		data: z
			.object({
				order_details_by_id: z
					.record(z.string(), GraphQLValueSchema)
					.nullable(),
			})
			.passthrough(),
	})
	.passthrough();

export type UsersListInput = z.infer<typeof UsersListInputSchema>;
export type UsersListResponse = {
	users: z.infer<typeof UserSchema>[];
	page: z.infer<typeof PageSchema>;
};
export type OrdersListInput = z.infer<typeof OrdersListInputSchema>;
export type OrdersListResponse = {
	orders: z.infer<typeof OrderSchema>[];
	page: z.infer<typeof PageSchema>;
};
export type OrganizationsListInput = z.infer<
	typeof OrganizationsListInputSchema
>;
export type OrganizationsListResponse = {
	organizations: z.infer<typeof OrganizationSchema>[];
	page: z.infer<typeof PageSchema>;
};
export type IntermediatesListInput = z.infer<
	typeof IntermediatesListInputSchema
>;
export type IntermediatesListResponse = z.infer<
	typeof IntermediatesResponseSchema
>;
export type AccountManagerLocalesResponse = z.infer<
	typeof AccountManagerLocalesResponseSchema
>;
export type PrivateCAHelperResponse = z.infer<
	typeof PrivateCAHelperResponseSchema
>;
export type AccountManagerLocalesInput = z.infer<
	typeof AccountManagerLocalesInputSchema
>;
export type PrivateCAHelperInput = z.infer<typeof PrivateCAHelperInputSchema>;
export type CertificateTagsInput = z.infer<typeof CertificateTagsInputSchema>;
export type VerifyTemplateInput = z.infer<typeof VerifyTemplateInputSchema>;
export type TrustLifecycleVersionResponse = z.infer<
	typeof TrustLifecycleVersionResponseSchema
>;
export type ContentTrustInfoInput = z.infer<typeof ContentTrustInfoInputSchema>;
export type ContentTrustInfoResponse = z.infer<
	typeof ContentTrustInfoResponseSchema
>;
export type ReportNamesInput = z.infer<typeof ReportNamesInputSchema>;
export type ReportNamesResponse = { report_names: string[] };
export type ReportTypesInput = z.infer<typeof ReportTypesInputSchema>;
export type ReportTypesResponse = {
	report_types: z.infer<typeof ReportTypeSchema>[];
};
export type ReportHistoryInput = z.infer<typeof ReportHistoryInputSchema>;
export type ReportHistoryResponse = {
	page: z.infer<typeof PageSchema>;
	report_history: z.infer<typeof ReportHistoryItemSchema>[];
};
export type ReportDetailsInput = z.infer<typeof ReportDetailsInputSchema>;
export type ReportDetailsResponse = z.infer<typeof ReportDetailsSchema>;
export type CustomReportQueryInput = z.infer<
	typeof CustomReportQueryInputSchema
>;
export type CustomReportByIdInput = z.infer<typeof CustomReportByIdInputSchema>;
export type CustomReportOrdersResponse = z.infer<
	typeof CustomReportOrdersResponseSchema
>;
export type CustomReportByIdResponse = z.infer<
	typeof CustomReportByIdResponseSchema
>;

export type DigicertEndpointInputs = {
	usersList: UsersListInput;
	ordersList: OrdersListInput;
	organizationsList: OrganizationsListInput;
	intermediatesList: IntermediatesListInput;
	accountManagerLocales: AccountManagerLocalesInput;
	privateCAHelper: PrivateCAHelperInput;
	certificateTags: CertificateTagsInput;
	verifyTemplate: VerifyTemplateInput;
	trustLifecycleVersion: z.infer<typeof TrustLifecycleVersionInputSchema>;
	contentTrustInfoV0: ContentTrustInfoInput;
	contentTrustInfoV1: ContentTrustInfoInput;
	reportNames: ReportNamesInput;
	reportTypes: ReportTypesInput;
	reportHistory: ReportHistoryInput;
	reportDetails: ReportDetailsInput;
	customReportQuery: CustomReportQueryInput;
	customReportById: CustomReportByIdInput;
};
export type DigicertEndpointOutputs = {
	usersList: UsersListResponse;
	ordersList: OrdersListResponse;
	organizationsList: OrganizationsListResponse;
	intermediatesList: IntermediatesListResponse;
	accountManagerLocales: AccountManagerLocalesResponse;
	privateCAHelper: PrivateCAHelperResponse;
	certificateTags: undefined;
	verifyTemplate: undefined;
	trustLifecycleVersion: TrustLifecycleVersionResponse;
	contentTrustInfoV0: ContentTrustInfoResponse;
	contentTrustInfoV1: ContentTrustInfoResponse;
	reportNames: ReportNamesResponse;
	reportTypes: ReportTypesResponse;
	reportHistory: ReportHistoryResponse;
	reportDetails: ReportDetailsResponse;
	customReportQuery: CustomReportOrdersResponse;
	customReportById: CustomReportByIdResponse;
};

export const DigicertEndpointInputSchemas = {
	usersList: UsersListInputSchema,
	ordersList: OrdersListInputSchema,
	organizationsList: OrganizationsListInputSchema,
	intermediatesList: IntermediatesListInputSchema,
	accountManagerLocales: AccountManagerLocalesInputSchema,
	privateCAHelper: PrivateCAHelperInputSchema,
	certificateTags: CertificateTagsInputSchema,
	verifyTemplate: VerifyTemplateInputSchema,
	trustLifecycleVersion: TrustLifecycleVersionInputSchema,
	contentTrustInfoV0: ContentTrustInfoInputSchema,
	contentTrustInfoV1: ContentTrustInfoInputSchema,
	reportNames: ReportNamesInputSchema,
	reportTypes: ReportTypesInputSchema,
	reportHistory: ReportHistoryInputSchema,
	reportDetails: ReportDetailsInputSchema,
	customReportQuery: CustomReportQueryInputSchema,
	customReportById: CustomReportByIdInputSchema,
} as const;
export const DigicertEndpointOutputSchemas = {
	usersList: z
		.object({ users: z.array(UserSchema), page: PageSchema })
		.passthrough(),
	ordersList: z
		.object({ orders: z.array(OrderSchema), page: PageSchema })
		.passthrough(),
	organizationsList: z
		.object({ organizations: z.array(OrganizationSchema), page: PageSchema })
		.passthrough(),
	intermediatesList: IntermediatesResponseSchema,
	accountManagerLocales: AccountManagerLocalesResponseSchema,
	privateCAHelper: PrivateCAHelperResponseSchema,
	certificateTags: z.undefined(),
	verifyTemplate: z.undefined(),
	trustLifecycleVersion: TrustLifecycleVersionResponseSchema,
	contentTrustInfoV0: ContentTrustInfoResponseSchema,
	contentTrustInfoV1: ContentTrustInfoResponseSchema,
	reportNames: z.object({ report_names: z.array(z.string()) }).passthrough(),
	reportTypes: z
		.object({ report_types: z.array(ReportTypeSchema) })
		.passthrough(),
	reportHistory: z
		.object({
			page: PageSchema,
			report_history: z.array(ReportHistoryItemSchema),
		})
		.passthrough(),
	reportDetails: ReportDetailsSchema,
	customReportQuery: CustomReportOrdersResponseSchema,
	customReportById: CustomReportByIdResponseSchema,
} as const;
