import { z } from 'zod';

const ThinkificBundleResponseSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		description: z.string().optional(),
		tagline: z.string().optional(),
		banner_image_url: z.string().optional(),
		course_ids: z.array(z.number()),
		bundle_card_image_url: z.string().optional(),
	})
	.strict();
const ThinkificCourseResponseSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		slug: z.string().optional(),
		subtitle: z.string().optional(),
		product_id: z.number(),
		description: z.string().optional(),
		course_card_text: z.string().optional(),
		intro_video_youtube: z.string().optional(),
		contact_information: z.string().optional(),
		keywords: z.string().optional(),
		duration: z.string().optional(),
		banner_image_url: z.string().optional(),
		course_card_image_url: z.string().optional(),
		intro_video_wistia_identifier: z.string().optional(),
		administrator_user_ids: z.array(z.number()).optional(),
		chapter_ids: z.array(z.number()),
		reviews_enabled: z.boolean(),
		user_id: z.number().optional(),
		instructor_id: z.number(),
	})
	.strict();
const ThinkificPaginationSchema = z
	.object({
		current_page: z.number().optional(),
		next_page: z.number().optional(),
		prev_page: z.number().optional(),
		total_pages: z.number().optional(),
		total_items: z.number().optional(),
		entries_info: z.string().optional(),
	})
	.strict();
const ThinkificMetaSchema = z
	.object({
		pagination: ThinkificPaginationSchema.optional(),
	})
	.strict();
const ThinkificGetCoursesResponseSchema = z
	.object({
		items: z.array(ThinkificCourseResponseSchema).optional(),
		meta: ThinkificMetaSchema.optional(),
	})
	.strict();
const ThinkificEnrollmentResponseSchema = z
	.object({
		id: z.number(),
		user_email: z.string(),
		user_name: z.string(),
		user_id: z.number(),
		course_name: z.string(),
		course_id: z.number(),
		percentage_completed: z.number(),
		expired: z.boolean(),
		is_free_trial: z.boolean(),
		completed: z.boolean(),
		started_at: z.string().datetime({ offset: true }),
		activated_at: z.string().datetime({ offset: true }),
		completed_at: z.string().datetime({ offset: true }),
		updated_at: z.string().datetime({ offset: true }),
		expiry_date: z.string().datetime({ offset: true }),
	})
	.strict();
const ThinkificGetEnrollmentsResponseSchema = z
	.object({
		items: z.array(ThinkificEnrollmentResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificChapterResponseSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		position: z.number(),
		description: z.string().optional(),
		duration_in_seconds: z.number().optional(),
		content_ids: z.array(z.number()),
	})
	.strict();
const ThinkificContentResponseSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		position: z.number(),
		chapter_id: z.number(),
		contentable_type: z.enum([
			'Assignment',
			'Audio',
			'Download',
			'BrilliumExam',
			'Disqus',
			'HtmlItem',
			'Iframe',
			'LiveLesson',
			'Lesson',
			'Pdf',
			'Presentation',
			'Quiz',
			'Survey',
		] as const),
		free: z.boolean(),
		take_url: z.string(),
	})
	.strict();
const ThinkificGetContentsResponseSchema = z
	.object({
		items: z.array(ThinkificContentResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificCollectionResponseSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		description: z.string(),
		slug: z.string().optional(),
		created_at: z.string().datetime({ offset: true }),
		product_ids: z.array(z.number()),
		default: z.boolean(),
	})
	.strict();
const ThinkificGetCollectionsResponseSchema = z
	.object({
		items: z.array(ThinkificCollectionResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificCollectionRequestSchema = z
	.object({
		name: z.string(),
		description: z.string(),
		slug: z.string(),
	})
	.strict();
const ThinkificProductPriceResponseSchema = z
	.object({
		id: z.number().optional(),
		is_primary: z.boolean().optional(),
		payment_type: z
			.enum(['free', 'one-time', 'subscription', 'payment-plan'] as const)
			.optional(),
		label: z.string().nullable().optional(),
		price: z.string().optional(),
		days_until_expiry: z.string().nullable().optional(),
		pay_button_text: z.string().nullable().optional(),
		number_of_payments: z.string().nullable().optional(),
		interval: z.enum(['month', 'year'] as const).optional(),
		interval_count: z.string().optional(),
		trial_interval: z
			.enum(['day', 'month'] as const)
			.nullable()
			.optional(),
		trial_interval_count: z.string().nullable().optional(),
		custom_first_price: z.string().nullable().optional(),
		price_name: z.string().optional(),
		currency: z.string().optional(),
	})
	.strict();
const ThinkificProductResponseSchema = z
	.object({
		id: z.number().optional(),
		created_at: z.string().datetime({ offset: true }).optional(),
		productable_id: z.number().optional(),
		productable_type: z.string().optional(),
		price: z.number().optional(),
		position: z.number().optional(),
		status: z.string().optional(),
		name: z.string().optional(),
		private: z.boolean().optional(),
		hidden: z.boolean().optional(),
		subscription: z.boolean().optional(),
		days_until_expiry: z.number().optional(),
		has_certificate: z.boolean().optional(),
		keywords: z.string().optional(),
		seo_title: z.string().optional(),
		seo_description: z.string().optional(),
		collection_ids: z.array(z.number()).optional(),
		related_product_ids: z.array(z.number()).optional(),
		description: z.string().optional(),
		card_image_url: z.string().optional(),
		slug: z.string().optional(),
		product_prices: z.array(ThinkificProductPriceResponseSchema).optional(),
	})
	.strict();
const ThinkificGetProductsResponseSchema = z
	.object({
		items: z.array(ThinkificProductResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificMembershipsRequestSchema = z
	.object({
		product_ids: z.array(z.number()),
	})
	.strict();
const ThinkificCouponResponseSchema = z
	.object({
		id: z.number(),
		code: z.string(),
		note: z.string(),
		quantity_used: z.number(),
		quantity: z.number(),
		promotion_id: z.number(),
		created_at: z.string().datetime({ offset: true }),
	})
	.strict();
const ThinkificGetCouponResponseSchema = z
	.object({
		items: z.array(ThinkificCouponResponseSchema).optional(),
		meta: ThinkificMetaSchema.optional(),
	})
	.strict();
const ThinkificCreateCouponRequestSchema = z
	.object({
		code: z.string(),
		note: z.string().optional(),
		quantity: z.number().optional(),
	})
	.strict();
const ThinkificBulkCreateCouponRequestSchema = z
	.object({
		bulk_quantity_per_coupon: z.number().optional(),
		bulk_coupon_code_length: z.number().optional(),
		bulk_quantity: z.number().optional(),
	})
	.strict();
const ThinkificCreateBulkCouponResponseSchema = z
	.object({
		items: z.array(ThinkificCouponResponseSchema).optional(),
	})
	.strict();
const ThinkificUpdateCouponSchema = z
	.object({
		code: z.string(),
		note: z.string().optional(),
		quantity_used: z.string().optional(),
		quantity: z.number().optional(),
	})
	.strict();
const ThinkificGetChaptersResponseSchema = z
	.object({
		items: z.array(ThinkificChapterResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificCustomProfileFieldDefinitionsResponseSchema = z
	.object({
		id: z.number(),
		label: z.string(),
		field_type: z.string(),
		required: z.boolean(),
	})
	.strict();
const ThinkificGetCustomProfileFieldDefinitionsSchema = z
	.object({
		items: z.array(ThinkificCustomProfileFieldDefinitionsResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificCreateEnrollmentRequestSchema = z
	.object({
		course_id: z.number().optional(),
		user_id: z.number().optional(),
		activated_at: z.string().datetime({ offset: true }).optional(),
		expiry_date: z.string().datetime({ offset: true }).optional(),
	})
	.strict();
const ThinkificUpdateEnrollmentRequestSchema = z
	.object({
		activated_at: z.string().datetime({ offset: true }).optional(),
		expiry_date: z.string().datetime({ offset: true }).optional(),
	})
	.strict();
const ThinkificExternalOrderTransactionSchema = z
	.object({
		amount: z.number(),
		currency: z.string(),
		reference: z.string().optional(),
		action: z.string().optional(),
	})
	.strict();
const ThinkificExternalOrderRequestSchema = z
	.object({
		payment_provider: z.string(),
		user_id: z.number(),
		product_id: z.number(),
		order_type: z.enum(['one-time', 'subscription', 'payment-plan'] as const),
		transaction: ThinkificExternalOrderTransactionSchema.optional(),
	})
	.strict();
const ThinkificGroupResponseSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		token: z.string(),
		created_at: z.string().datetime({ offset: true }),
	})
	.strict();
const ThinkificGetGroupsResponseSchema = z
	.object({
		items: z.array(ThinkificGroupResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificGroupRequestSchema = z
	.object({
		name: z.string(),
	})
	.strict();
const ThinkificGetGroupAnalystsResponseSchema = z
	.object({
		group_analysts: z.array(z.number()),
	})
	.strict();
const ThinkificGroupAddAnalystRequestSchema = z
	.object({
		user_ids: z.array(z.number()),
	})
	.strict();
const ThinkificGroupAnalystsAddGroupRequestSchema = z
	.object({
		group_ids: z.array(z.number()),
	})
	.strict();
const ThinkificInstructorResponseSchema = z
	.object({
		id: z.number(),
		user_id: z.number().optional(),
		title: z.string().optional(),
		first_name: z.string(),
		last_name: z.string(),
		bio: z.string().optional(),
		slug: z.string().optional(),
		avatar_url: z.string().optional(),
		email: z.string().optional(),
		created_at: z.string(),
	})
	.strict();
const ThinkificGetInstructorsResponseSchema = z
	.object({
		items: z.array(ThinkificInstructorResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificInstructorRequestSchema = z
	.object({
		user_id: z.number().optional(),
		title: z.string().optional(),
		first_name: z.string(),
		last_name: z.string(),
		bio: z.string().optional(),
		slug: z.string(),
		avatar_url: z.string().optional(),
		email: z.string().optional(),
	})
	.strict();
const ThinkificItemSchema = z
	.object({
		product_id: z.number().optional(),
		product_name: z.string().optional(),
		amount_dollars: z.number().optional(),
		amount_cents: z.number().optional(),
	})
	.strict();
const ThinkificOrderResponseSchema = z
	.object({
		user_id: z.number(),
		user_email: z.string(),
		user_name: z.string(),
		product_name: z.string(),
		product_id: z.number(),
		amount_dollars: z.string(),
		amount_cents: z.number(),
		subscription: z.boolean(),
		coupon_code: z.string().optional(),
		coupon_id: z.number().optional(),
		items: z.array(ThinkificItemSchema).optional(),
		affiliate_referral_code: z.string().optional(),
		status: z.string(),
		'created at': z.string().optional(),
		id: z.number(),
	})
	.strict();
const ThinkificGetOrdersResponseSchema = z
	.object({
		items: z.array(ThinkificOrderResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificCreateGroupUsersRequestSchema = z
	.object({
		user_id: z.number(),
		group_names: z.array(z.string()),
	})
	.strict();
const ThinkificPromotionResponseSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		starts_at: z.string().datetime({ offset: true }).optional(),
		expires_at: z.string().datetime({ offset: true }).optional(),
		discount_type: z.enum(['fixed', 'percentage'] as const).optional(),
		amount: z.number().optional(),
		coupon_ids: z.array(z.number()).optional(),
		duration: z.number().optional(),
	})
	.strict();
const ThinkificProductPublishRequestSchema = z
	.object({
		product_id: z.number(),
		status: z.string(),
		response_text: z.string().optional(),
		requesting_user_id: z.number(),
		responding_user_id: z.number().optional(),
		completed_at: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.strict();
// The v1 list component points to PromotionResponse, but the operation and detail route return ProductPublishRequest records.
const ThinkificGetProductPublishResponseSchema = z
	.object({
		items: z.array(ThinkificProductPublishRequestSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificProductPublishRequestBodySchema = z
	.object({
		user_id: z.number(),
		response_text: z.string().optional(),
		notify_requester: z.boolean().optional(),
	})
	.strict();
const ThinkificGetPromotionsResponseSchema = z
	.object({
		items: z.array(ThinkificPromotionResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificPromotionRequestSchema = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		starts_at: z.string().datetime({ offset: true }).optional(),
		expires_at: z.string().datetime({ offset: true }).optional(),
		discount_type: z.enum(['fixed', 'percentage'] as const),
		amount: z.number(),
		product_ids: z.array(z.number()).optional(),
		coupon_ids: z.array(z.number()).optional(),
		duration: z.number().optional(),
	})
	.strict();
const ThinkificCourseReviewResponseSchema = z
	.object({
		id: z.number(),
		rating: z.number(),
		title: z.string(),
		review_text: z.string(),
		user_id: z.number(),
		course_id: z.number(),
		approved: z.boolean(),
		created_at: z.string().datetime({ offset: true }).optional(),
	})
	.strict();
const ThinkificGetCourseReviewsResponseSchema = z
	.object({
		items: z.array(ThinkificCourseReviewResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificCreateCourseReviewRequestSchema = z
	.object({
		rating: z.number(),
		title: z.string(),
		review_text: z.string(),
		user_id: z.number(),
		approved: z.boolean(),
	})
	.strict();
const ThinkificCustomProfileFieldSchema = z
	.object({
		id: z.number().optional(),
		value: z.string().optional(),
		label: z.string().optional(),
		custom_profile_field_definition_id: z.number().optional(),
	})
	.strict();
const ThinkificUserResponseSchema = z
	.object({
		id: z.number().optional(),
		created_at: z.string().datetime({ offset: true }).optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		full_name: z.string().optional(),
		company: z.string().optional(),
		email: z.string().email().optional(),
		roles: z
			.array(
				z.enum([
					'affiliate',
					'course_admin',
					'group_analyst',
					'site_admin',
				] as const),
			)
			.optional(),
		avatar_url: z.string().optional(),
		bio: z.string().optional(),
		headline: z.string().optional(),
		affiliate_code: z.string().optional(),
		external_source: z.string().optional(),
		affiliate_commission: z.number().optional(),
		affiliate_commission_type: z.string().optional(),
		affiliate_payout_email: z.string().optional(),
		administered_course_ids: z.array(z.number()).optional(),
		custom_profile_fields: z
			.array(ThinkificCustomProfileFieldSchema)
			.optional(),
	})
	.strict();
const ThinkificGetUsersResponseSchema = z
	.object({
		items: z.array(ThinkificUserResponseSchema),
		meta: ThinkificMetaSchema,
	})
	.strict();
const ThinkificCustomProfileFieldRequestSchema = z
	.object({
		value: z.string().optional(),
		custom_profile_field_definition_id: z.number(),
	})
	.strict();
const ThinkificCreateUserRequestSchema = z
	.object({
		first_name: z.string(),
		last_name: z.string(),
		email: z.string().email(),
		password: z.string().min(6).optional(),
		roles: z
			.array(
				z.enum([
					'affiliate',
					'course_admin',
					'group_analyst',
					'site_admin',
				] as const),
			)
			.optional(),
		bio: z.string().optional(),
		company: z.string().optional(),
		headline: z.string().optional(),
		affiliate_code: z.string().optional(),
		affiliate_commission: z.number().optional(),
		affiliate_commission_type: z.string().optional(),
		affiliate_payout_email: z.string().optional(),
		custom_profile_fields: z
			.array(ThinkificCustomProfileFieldRequestSchema)
			.optional(),
		skip_custom_fields_validation: z.boolean().optional(),
		send_welcome_email: z.boolean().optional(),
		external_id: z.string().optional(),
		provider: z.enum(['SSO', 'OPENID_CONNECT'] as const).optional(),
	})
	.strict();
const ThinkificUpdateUserRequestSchema = z
	.object({
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().email().optional(),
		password: z.string().min(6).optional(),
		roles: z
			.array(
				z.enum([
					'affiliate',
					'course_admin',
					'group_analyst',
					'site_admin',
				] as const),
			)
			.optional(),
		avatar_url: z.string().optional(),
		bio: z.string().optional(),
		company: z.string().optional(),
		headline: z.string().optional(),
		external_source: z.string().optional(),
		affiliate_code: z.string().optional(),
		affiliate_commission: z.number().optional(),
		affiliate_commission_type: z.string().optional(),
		affiliate_payout_email: z.string().optional(),
		custom_profile_fields: z
			.array(ThinkificCustomProfileFieldRequestSchema)
			.optional(),
	})
	.strict();
const ThinkificAuthenticationResponseSchema = z
	.object({
		provider: z.enum(['SSO', 'OPENID_CONNECT'] as const).optional(),
		external_id: z.string().optional(),
	})
	.strict();
const ThinkificExpressSignInLinkResponseSchema = z
	.object({
		user_id: z.number(),
		url: z.string().url(),
	})
	.strict();

export const ThinkificComponentSchemas = {
	BundleResponse: ThinkificBundleResponseSchema,
	CourseResponse: ThinkificCourseResponseSchema,
	Pagination: ThinkificPaginationSchema,
	Meta: ThinkificMetaSchema,
	GetCoursesResponse: ThinkificGetCoursesResponseSchema,
	EnrollmentResponse: ThinkificEnrollmentResponseSchema,
	GetEnrollmentsResponse: ThinkificGetEnrollmentsResponseSchema,
	ChapterResponse: ThinkificChapterResponseSchema,
	ContentResponse: ThinkificContentResponseSchema,
	GetContentsResponse: ThinkificGetContentsResponseSchema,
	CollectionResponse: ThinkificCollectionResponseSchema,
	GetCollectionsResponse: ThinkificGetCollectionsResponseSchema,
	CollectionRequest: ThinkificCollectionRequestSchema,
	ProductPriceResponse: ThinkificProductPriceResponseSchema,
	ProductResponse: ThinkificProductResponseSchema,
	GetProductsResponse: ThinkificGetProductsResponseSchema,
	MembershipsRequest: ThinkificMembershipsRequestSchema,
	CouponResponse: ThinkificCouponResponseSchema,
	GetCouponResponse: ThinkificGetCouponResponseSchema,
	CreateCouponRequest: ThinkificCreateCouponRequestSchema,
	BulkCreateCouponRequest: ThinkificBulkCreateCouponRequestSchema,
	CreateBulkCouponResponse: ThinkificCreateBulkCouponResponseSchema,
	UpdateCoupon: ThinkificUpdateCouponSchema,
	GetChaptersResponse: ThinkificGetChaptersResponseSchema,
	CustomProfileFieldDefinitionsResponse:
		ThinkificCustomProfileFieldDefinitionsResponseSchema,
	GetCustomProfileFieldDefinitions:
		ThinkificGetCustomProfileFieldDefinitionsSchema,
	CreateEnrollmentRequest: ThinkificCreateEnrollmentRequestSchema,
	UpdateEnrollmentRequest: ThinkificUpdateEnrollmentRequestSchema,
	ExternalOrderTransaction: ThinkificExternalOrderTransactionSchema,
	ExternalOrderRequest: ThinkificExternalOrderRequestSchema,
	GroupResponse: ThinkificGroupResponseSchema,
	GetGroupsResponse: ThinkificGetGroupsResponseSchema,
	GroupRequest: ThinkificGroupRequestSchema,
	GetGroupAnalystsResponse: ThinkificGetGroupAnalystsResponseSchema,
	GroupAddAnalystRequest: ThinkificGroupAddAnalystRequestSchema,
	GroupAnalystsAddGroupRequest: ThinkificGroupAnalystsAddGroupRequestSchema,
	InstructorResponse: ThinkificInstructorResponseSchema,
	GetInstructorsResponse: ThinkificGetInstructorsResponseSchema,
	InstructorRequest: ThinkificInstructorRequestSchema,
	Item: ThinkificItemSchema,
	OrderResponse: ThinkificOrderResponseSchema,
	GetOrdersResponse: ThinkificGetOrdersResponseSchema,
	CreateGroupUsersRequest: ThinkificCreateGroupUsersRequestSchema,
	PromotionResponse: ThinkificPromotionResponseSchema,
	GetProductPublishResponse: ThinkificGetProductPublishResponseSchema,
	ProductPublishRequest: ThinkificProductPublishRequestSchema,
	ProductPublishRequestBody: ThinkificProductPublishRequestBodySchema,
	GetPromotionsResponse: ThinkificGetPromotionsResponseSchema,
	PromotionRequest: ThinkificPromotionRequestSchema,
	CourseReviewResponse: ThinkificCourseReviewResponseSchema,
	GetCourseReviewsResponse: ThinkificGetCourseReviewsResponseSchema,
	CreateCourseReviewRequest: ThinkificCreateCourseReviewRequestSchema,
	CustomProfileField: ThinkificCustomProfileFieldSchema,
	UserResponse: ThinkificUserResponseSchema,
	GetUsersResponse: ThinkificGetUsersResponseSchema,
	CustomProfileFieldRequest: ThinkificCustomProfileFieldRequestSchema,
	CreateUserRequest: ThinkificCreateUserRequestSchema,
	UpdateUserRequest: ThinkificUpdateUserRequestSchema,
	AuthenticationResponse: ThinkificAuthenticationResponseSchema,
	ExpressSignInLinkResponse: ThinkificExpressSignInLinkResponseSchema,
} as const;

export const ThinkificOperationInputSchemas = {
	bundles_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	bundles_listCourses: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	bundles_listEnrollments: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			query: z
				.object({
					page: z.number().optional(),
					limit: z.number().optional(),
					'query[user_id]': z.number().optional(),
					'query[email]': z.string().optional(),
					'query[completed]': z.string().datetime({ offset: true }).optional(),
					'query[expired]': z.string().datetime({ offset: true }).optional(),
					'query[created_after]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[created_before]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[created_on]': z.string().datetime({ offset: true }).optional(),
					'query[created_on_or_after]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[created_on_or_before]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[updated_after]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[updated_before]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[updated_on]': z.string().datetime({ offset: true }).optional(),
					'query[updated_on_or_after]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[updated_on_or_before]': z
						.string()
						.datetime({ offset: true })
						.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	bundles_createEnrollment: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: z
				.object({
					user_id: z.number(),
					activated_at: z.string().datetime({ offset: true }).optional(),
					expiry_date: z.string().datetime({ offset: true }).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	bundles_updateEnrollments: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: z
				.object({
					user_id: z.number(),
					activated_at: z.string().datetime({ offset: true }).optional(),
					expiry_date: z.string().datetime({ offset: true }).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	chapters_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	chapters_listContents: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	categories_list: z
		.object({
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	categories_create: z
		.object({
			body: ThinkificCollectionRequestSchema.optional(),
		})
		.strict(),
	categories_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	categories_update: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: ThinkificCollectionRequestSchema.optional(),
		})
		.strict(),
	categories_remove: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	categories_listProducts: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	categoryMemberships_addProducts: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: ThinkificMembershipsRequestSchema,
		})
		.strict(),
	categoryMemberships_removeProducts: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: ThinkificMembershipsRequestSchema,
		})
		.strict(),
	coupons_list: z
		.object({
			query: z
				.object({
					promotion_id: z.number(),
					page: z.number().optional(),
					limit: z.number().optional(),
				})
				.strict(),
		})
		.strict(),
	coupons_create: z
		.object({
			query: z.object({ promotion_id: z.number() }).strict(),
			body: ThinkificCreateCouponRequestSchema,
		})
		.strict(),
	coupons_bulkCreate: z
		.object({
			query: z.object({ promotion_id: z.number() }).strict(),
			body: ThinkificBulkCreateCouponRequestSchema,
		})
		.strict(),
	coupons_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	coupons_update: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: ThinkificUpdateCouponSchema,
		})
		.strict(),
	coupons_remove: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	contents_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	courses_list: z
		.object({
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	courses_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	courses_listChapters: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	customProfileFields_list: z
		.object({
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	enrollments_list: z
		.object({
			query: z
				.object({
					page: z.number().optional(),
					limit: z.number().optional(),
					'query[user_id]': z.number().optional(),
					'query[course_id]': z.number().optional(),
					'query[email]': z.string().optional(),
					'query[free_trial]': z.boolean().optional(),
					'query[full]': z.boolean().optional(),
					'query[completed]': z.boolean().optional(),
					'query[expired]': z.boolean().optional(),
					'query[created_on]': z.string().datetime({ offset: true }).optional(),
					'query[created_before]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[created_on_or_before]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[created_after]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[created_on_or_after]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[updated_on]': z.string().datetime({ offset: true }).optional(),
					'query[updated_before]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[updated_on_or_before]': z
						.string()
						.datetime({ offset: true })
						.optional(),
					'query[updated_after]': z
						.string()
						.datetime({ offset: true })
						.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	enrollments_create: z
		.object({
			body: ThinkificCreateEnrollmentRequestSchema,
		})
		.strict(),
	enrollments_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	enrollments_update: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: ThinkificUpdateEnrollmentRequestSchema,
		})
		.strict(),
	externalOrders_create: z
		.object({
			body: ThinkificExternalOrderRequestSchema.optional(),
		})
		.strict(),
	externalOrders_refund: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: ThinkificExternalOrderTransactionSchema.optional(),
		})
		.strict(),
	externalOrders_purchase: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			body: ThinkificExternalOrderTransactionSchema.optional(),
		})
		.strict(),
	groups_list: z
		.object({
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	groups_create: z
		.object({
			body: ThinkificGroupRequestSchema.optional(),
		})
		.strict(),
	groups_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	groups_remove: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	groups_listAnalysts: z
		.object({
			path: z.object({ group_id: z.number() }).strict(),
		})
		.strict(),
	groups_assignAnalysts: z
		.object({
			path: z.object({ group_id: z.number() }).strict(),
			body: ThinkificGroupAddAnalystRequestSchema.optional(),
		})
		.strict(),
	groups_removeAnalyst: z
		.object({
			path: z.object({ group_id: z.number(), user_id: z.number() }).strict(),
		})
		.strict(),
	groupAnalysts_addGroup: z
		.object({
			path: z.object({ user_id: z.number() }).strict(),
			body: ThinkificGroupAnalystsAddGroupRequestSchema.optional(),
		})
		.strict(),
	groupAnalysts_removeGroup: z
		.object({
			path: z.object({ user_id: z.number(), group_id: z.number() }).strict(),
		})
		.strict(),
	instructors_list: z
		.object({
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	instructors_create: z
		.object({
			body: ThinkificInstructorRequestSchema,
		})
		.strict(),
	instructors_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	instructors_update: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: ThinkificInstructorRequestSchema,
		})
		.strict(),
	instructors_remove: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	orders_list: z
		.object({
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	orders_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	groupUsers_addUsers: z
		.object({
			body: ThinkificCreateGroupUsersRequestSchema,
		})
		.strict(),
	productPublishRequests_list: z
		.object({
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	productPublishRequests_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	productPublishRequests_approve: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: ThinkificProductPublishRequestBodySchema.optional(),
		})
		.strict(),
	productPublishRequests_deny: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: ThinkificProductPublishRequestBodySchema.optional(),
		})
		.strict(),
	products_list: z
		.object({
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	products_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	products_listRelated: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	promotions_list: z
		.object({
			query: z
				.object({ page: z.number().optional(), limit: z.number().optional() })
				.strict()
				.optional(),
		})
		.strict(),
	promotions_create: z
		.object({
			body: ThinkificPromotionRequestSchema.optional(),
		})
		.strict(),
	promotions_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	promotions_update: z
		.object({
			path: z.object({ id: z.number() }).strict(),
			body: ThinkificPromotionRequestSchema.optional(),
		})
		.strict(),
	promotions_remove: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	promotions_getByCoupon: z
		.object({
			query: z
				.object({ product_id: z.number(), coupon_code: z.string() })
				.strict(),
		})
		.strict(),
	courseReviews_list: z
		.object({
			query: z
				.object({
					course_id: z.number(),
					page: z.number().optional(),
					limit: z.number().optional(),
					approved: z.boolean().optional(),
				})
				.strict(),
		})
		.strict(),
	courseReviews_create: z
		.object({
			query: z.object({ course_id: z.number() }).strict(),
			body: ThinkificCreateCourseReviewRequestSchema,
		})
		.strict(),
	courseReviews_get: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
	users_list: z
		.object({
			query: z
				.object({
					page: z.number().optional(),
					limit: z.number().optional(),
					'query[email]': z.string().optional(),
					'query[role]': z.string().optional(),
					'query[external_source]': z.string().optional(),
					'query[custom_profile_field_label]': z.string().optional(),
					'query[custom_profile_field_value]': z.string().optional(),
					'query[group_id]': z.number().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	users_create: z
		.object({
			body: ThinkificCreateUserRequestSchema,
		})
		.strict(),
	users_get: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z
				.object({
					provider: z.enum(['SSO', 'OPENID_CONNECT'] as const).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	users_update: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z
				.object({
					provider: z.enum(['SSO', 'OPENID_CONNECT'] as const).optional(),
				})
				.strict()
				.optional(),
			body: ThinkificUpdateUserRequestSchema,
		})
		.strict(),
	users_remove: z
		.object({
			path: z.object({ id: z.string() }).strict(),
			query: z
				.object({
					provider: z.enum(['SSO', 'OPENID_CONNECT'] as const).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	users_getAuthentication: z
		.object({
			path: z
				.object({
					id: z.string(),
					provider: z.enum(['SSO', 'OPENID_CONNECT'] as const),
				})
				.strict(),
		})
		.strict(),
	users_createExpressSignInLink: z
		.object({
			path: z.object({ id: z.number() }).strict(),
		})
		.strict(),
} as const;

export const ThinkificOperationOutputSchemas = {
	bundles_get: ThinkificBundleResponseSchema,
	bundles_listCourses: ThinkificGetCoursesResponseSchema,
	bundles_listEnrollments: ThinkificGetEnrollmentsResponseSchema,
	bundles_createEnrollment: z.undefined(),
	bundles_updateEnrollments: z.undefined(),
	chapters_get: ThinkificChapterResponseSchema,
	chapters_listContents: ThinkificGetContentsResponseSchema,
	categories_list: ThinkificGetCollectionsResponseSchema,
	categories_create: ThinkificCollectionResponseSchema,
	categories_get: ThinkificCollectionResponseSchema,
	categories_update: z.undefined(),
	categories_remove: z.undefined(),
	categories_listProducts: ThinkificGetProductsResponseSchema,
	categoryMemberships_addProducts: z.undefined(),
	categoryMemberships_removeProducts: z.undefined(),
	coupons_list: ThinkificGetCouponResponseSchema,
	coupons_create: ThinkificCouponResponseSchema,
	coupons_bulkCreate: ThinkificCreateBulkCouponResponseSchema,
	coupons_get: ThinkificCouponResponseSchema,
	coupons_update: z.undefined(),
	coupons_remove: z.undefined(),
	contents_get: ThinkificContentResponseSchema,
	courses_list: ThinkificGetCoursesResponseSchema,
	courses_get: ThinkificCourseResponseSchema,
	courses_listChapters: ThinkificGetChaptersResponseSchema,
	customProfileFields_list: ThinkificGetCustomProfileFieldDefinitionsSchema,
	enrollments_list: ThinkificGetEnrollmentsResponseSchema,
	enrollments_create: ThinkificEnrollmentResponseSchema,
	enrollments_get: ThinkificEnrollmentResponseSchema,
	enrollments_update: z.undefined(),
	externalOrders_create: z
		.object({
			id: z.number().optional(),
		})
		.strict(),
	externalOrders_refund: z.undefined(),
	externalOrders_purchase: z.undefined(),
	groups_list: ThinkificGetGroupsResponseSchema,
	groups_create: ThinkificGroupResponseSchema,
	groups_get: ThinkificGroupResponseSchema,
	groups_remove: z.undefined(),
	groups_listAnalysts: ThinkificGetGroupAnalystsResponseSchema,
	groups_assignAnalysts: z.undefined(),
	groups_removeAnalyst: z.undefined(),
	groupAnalysts_addGroup: z.undefined(),
	groupAnalysts_removeGroup: z.undefined(),
	instructors_list: ThinkificGetInstructorsResponseSchema,
	instructors_create: ThinkificInstructorResponseSchema,
	instructors_get: ThinkificInstructorResponseSchema,
	instructors_update: z.undefined(),
	instructors_remove: z.undefined(),
	orders_list: ThinkificGetOrdersResponseSchema,
	orders_get: ThinkificOrderResponseSchema,
	groupUsers_addUsers: z.undefined(),
	productPublishRequests_list: ThinkificGetProductPublishResponseSchema,
	productPublishRequests_get: ThinkificProductPublishRequestSchema,
	productPublishRequests_approve: z.undefined(),
	productPublishRequests_deny: z.undefined(),
	products_list: ThinkificGetProductsResponseSchema,
	products_get: ThinkificProductResponseSchema,
	products_listRelated: ThinkificGetProductsResponseSchema,
	promotions_list: ThinkificGetPromotionsResponseSchema,
	promotions_create: ThinkificPromotionResponseSchema,
	promotions_get: ThinkificPromotionResponseSchema,
	promotions_update: z.undefined(),
	promotions_remove: z.undefined(),
	promotions_getByCoupon: ThinkificPromotionResponseSchema,
	courseReviews_list: ThinkificGetCourseReviewsResponseSchema,
	courseReviews_create: ThinkificCourseReviewResponseSchema,
	courseReviews_get: ThinkificCourseReviewResponseSchema,
	users_list: ThinkificGetUsersResponseSchema,
	users_create: ThinkificUserResponseSchema,
	users_get: ThinkificUserResponseSchema,
	users_update: z.undefined(),
	users_remove: z.undefined(),
	users_getAuthentication: ThinkificAuthenticationResponseSchema,
	users_createExpressSignInLink: ThinkificExpressSignInLinkResponseSchema,
} as const;
