import { z } from 'zod';
import { EXIST_MAX_BATCH_SIZE } from '../client';

// ─────────────────────────────────────────────────────────────────────────────
// Shared building blocks
// @see https://developer.exist.io/reference/object_types/
// ─────────────────────────────────────────────────────────────────────────────

/**
 * "yyyy-mm-dd", the only date format Exist accepts or returns. `z.iso.date()`
 * validates the calendar too, so an impossible day like 2026-02-31 is rejected
 * before it reaches the API rather than being stored against the wrong date.
 */
const ExistDateSchema = z.iso.date();

const PageSchema = z.number().int().min(1).optional();
const LimitSchema = z.number().int().min(1).optional();
/** `limit` is capped at 100 on values, correlations and insights. */
const CappedLimitSchema = z.number().int().min(1).max(100).optional();

const ExistGroupSchema = z
	.object({
		name: z.string(),
		label: z.string(),
		priority: z.number(),
	})
	.loose();

const ExistServiceSchema = z
	.object({
		name: z.string(),
		label: z.string(),
	})
	.loose();

/**
 * Attribute values are typed by the owning attribute's `value_type`, so the
 * wire value is a string, number or boolean — and is null on days with no data.
 */
const ExistValueSchema = z
	.union([z.string(), z.number(), z.boolean()])
	.nullable();

const ExistAttributeValueSchema = z
	.object({
		date: z.string(),
		value: ExistValueSchema,
	})
	.loose();

/** An attribute template, i.e. an attribute Exist knows how to create. */
const ExistAttributeTemplateSchema = z
	.object({
		name: z.string(),
		label: z.string(),
		group: ExistGroupSchema,
		priority: z.number(),
		value_type: z.number(),
		value_type_description: z.string(),
	})
	.loose();

/** An attribute belonging to a user. `template` is null for custom attributes. */
const ExistAttributeSchema = z
	.object({
		template: z.string().nullable().optional(),
		name: z.string(),
		label: z.string(),
		group: ExistGroupSchema,
		service: ExistServiceSchema.nullable().optional(),
		active: z.boolean(),
		priority: z.number(),
		manual: z.boolean(),
		value_type: z.number(),
		value_type_description: z.string(),
		available_services: z.array(ExistServiceSchema).optional(),
	})
	.loose();

const ExistAttributeWithValuesSchema = ExistAttributeSchema.extend({
	values: z.array(ExistAttributeValueSchema),
});

const ExistAverageSchema = z
	.object({
		attribute: z.string(),
		date: z.string(),
		overall: z.number().nullable(),
		monday: z.number().nullable(),
		tuesday: z.number().nullable(),
		wednesday: z.number().nullable(),
		thursday: z.number().nullable(),
		friday: z.number().nullable(),
		saturday: z.number().nullable(),
		sunday: z.number().nullable(),
	})
	.loose();

const ExistCorrelationRatingSchema = z
	.object({
		positive: z.boolean(),
		rating_type: z.number(),
		rating: z.string(),
	})
	.loose();

const ExistCorrelationSchema = z
	.object({
		date: z.string(),
		period: z.number(),
		offset: z.number(),
		attribute: z.string(),
		attribute2: z.string(),
		value: z.number(),
		p: z.number(),
		percentage: z.number(),
		stars: z.number(),
		second_person: z.string(),
		second_person_elements: z.array(z.string()),
		attribute_category: z.string().nullable().optional(),
		strength_description: z.string().nullable().optional(),
		stars_description: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		occurrence: z.string().nullable().optional(),
		rating: ExistCorrelationRatingSchema.nullable().optional(),
	})
	.loose();

const ExistInsightTypeSchema = z
	.object({
		name: z.string(),
		period: z.number(),
		priority: z.number(),
		attribute: ExistAttributeTemplateSchema.nullable().optional(),
	})
	.loose();

const ExistInsightSchema = z
	.object({
		created: z.string(),
		target_date: z.string().nullable(),
		type: ExistInsightTypeSchema,
		html: z.string(),
		text: z.string(),
	})
	.loose();

const ExistProfileSchema = z
	.object({
		username: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		avatar: z.string().nullable().optional(),
		timezone: z.string(),
		local_time: z.string(),
		imperial_distance: z.boolean(),
		imperial_weight: z.boolean(),
		imperial_energy: z.boolean(),
		imperial_liquid: z.boolean(),
		imperial_temperature: z.boolean(),
		trial: z.boolean(),
		delinquent: z.boolean(),
	})
	.loose();

/** Every Exist list endpoint returns this envelope. */
function paged<T extends z.ZodTypeAny>(results: T) {
	return z.object({
		count: z.number(),
		next: z.string().nullable(),
		previous: z.string().nullable(),
		results: z.array(results),
	});
}

/**
 * Write endpoints answer 200 when every object succeeded and 202 when some
 * failed; either way the body carries both arrays. Failed objects echo back
 * the submitted fields plus `error` and `error_code`.
 * @see https://developer.exist.io/reference/writing_data/
 */
const ExistWriteFailureSchema = z
	.object({
		error: z.string(),
		error_code: z.string(),
	})
	.loose();

function writeResponse<T extends z.ZodTypeAny>(success: T) {
	return z.object({
		success: z.array(success),
		failed: z.array(ExistWriteFailureSchema),
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// users.getProfile — GET /api/2/accounts/profile/
// @see https://developer.exist.io/reference/users/
// ─────────────────────────────────────────────────────────────────────────────

const UsersGetProfileInputSchema = z.object({});
export type UsersGetProfileInput = z.infer<typeof UsersGetProfileInputSchema>;

const UsersGetProfileResponseSchema = ExistProfileSchema;
export type UsersGetProfileResponse = z.infer<
	typeof UsersGetProfileResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// attributes.list — GET /api/2/attributes/
// @see https://developer.exist.io/reference/attributes/
// ─────────────────────────────────────────────────────────────────────────────

const AttributesListInputSchema = z.object({
	page: PageSchema,
	limit: LimitSchema,
	/** Group names to filter by, e.g. `['activity', 'workouts']`. */
	groups: z.array(z.string()).optional(),
	/** Attribute names to filter by. */
	attributes: z.array(z.string()).optional(),
	/** Only return templated attributes. */
	exclude_custom: z.boolean().optional(),
	/** True returns only manual attributes, false excludes them. */
	manual: z.boolean().optional(),
	/** Include attributes with `active: false`, which are hidden by default. */
	include_inactive: z.boolean().optional(),
	/** Include attributes with a priority >= 10. */
	include_low_priority: z.boolean().optional(),
	/** Only return attributes owned by this OAuth2 client. */
	owned: z.boolean().optional(),
});
export type AttributesListInput = z.infer<typeof AttributesListInputSchema>;

const AttributesListResponseSchema = paged(ExistAttributeSchema);
export type AttributesListResponse = z.infer<
	typeof AttributesListResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// attributes.listTemplates — GET /api/2/attributes/templates/
// @see https://developer.exist.io/reference/attributes/
// ─────────────────────────────────────────────────────────────────────────────

const AttributesListTemplatesInputSchema = z.object({
	page: PageSchema,
	limit: LimitSchema,
	include_low_priority: z.boolean().optional(),
	groups: z.array(z.string()).optional(),
});
export type AttributesListTemplatesInput = z.infer<
	typeof AttributesListTemplatesInputSchema
>;

const AttributesListTemplatesResponseSchema = paged(
	ExistAttributeTemplateSchema,
);
export type AttributesListTemplatesResponse = z.infer<
	typeof AttributesListTemplatesResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// attributes.listWithValues — GET /api/2/attributes/with-values/
// @see https://developer.exist.io/reference/attributes/
// ─────────────────────────────────────────────────────────────────────────────

const AttributesListWithValuesInputSchema = z
	.object({
		page: PageSchema,
		limit: LimitSchema,
		/** How many days of values to include per attribute. Max 31, default 1. */
		days: z.number().int().min(1).max(31).optional(),
		/** Most recent date included in `values`. */
		date_max: ExistDateSchema.optional(),
		groups: z.array(z.string()).optional(),
		/** Filter by attribute name — use this or `templates`, not both. */
		attributes: z.array(z.string()).optional(),
		/** Filter by attribute template name — use this or `attributes`, not both. */
		templates: z.array(z.string()).optional(),
		manual: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (
			(value.attributes?.length ?? 0) > 0 &&
			(value.templates?.length ?? 0) > 0
		) {
			ctx.addIssue({
				code: 'custom',
				// "rather than using both, you would use one or the other of
				// attributes and templates to filter" — the official reference.
				message:
					'Filter by `attributes` or `templates`, not both — Exist accepts only one',
				path: ['templates'],
			});
		}
	});
export type AttributesListWithValuesInput = z.infer<
	typeof AttributesListWithValuesInputSchema
>;

const AttributesListWithValuesResponseSchema = paged(
	ExistAttributeWithValuesSchema,
);
export type AttributesListWithValuesResponse = z.infer<
	typeof AttributesListWithValuesResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// attributes.listOwned — GET /api/2/attributes/owned/
// @see https://developer.exist.io/reference/attribute_ownership/
// ─────────────────────────────────────────────────────────────────────────────

const AttributesListOwnedInputSchema = z.object({
	page: PageSchema,
	limit: LimitSchema,
	groups: z.array(z.string()).optional(),
	attributes: z.array(z.string()).optional(),
	exclude_custom: z.boolean().optional(),
	manual: z.boolean().optional(),
	include_inactive: z.boolean().optional(),
	include_low_priority: z.boolean().optional(),
});
export type AttributesListOwnedInput = z.infer<
	typeof AttributesListOwnedInputSchema
>;

const AttributesListOwnedResponseSchema = paged(ExistAttributeSchema);
export type AttributesListOwnedResponse = z.infer<
	typeof AttributesListOwnedResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// attributes.acquire — POST /api/2/attributes/acquire/
// @see https://developer.exist.io/reference/attribute_ownership/
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Each object identifies an attribute either by `template` (creating it if the
 * user does not have it yet) or by `name` (an attribute that already exists).
 */
const AcquireAttributeSchema = z
	.object({
		/** Attribute template name, e.g. `mood`. */
		template: z.string().optional(),
		/** Existing attribute name, e.g. `mood_note`. */
		name: z.string().optional(),
		/** Mark the attribute as manually updated. */
		manual: z.boolean().optional(),
	})
	.refine((value) => Boolean(value.template ?? value.name), {
		message: 'Each attribute must set either `template` or `name`',
	});

const AttributesAcquireInputSchema = z.object({
	attributes: z.array(AcquireAttributeSchema).min(1).max(EXIST_MAX_BATCH_SIZE),
	/** Return the full attribute object for each successful acquisition. */
	success_objects: z.boolean().optional(),
});
export type AttributesAcquireInput = z.infer<
	typeof AttributesAcquireInputSchema
>;

const AttributesAcquireResponseSchema = writeResponse(
	z.object({ name: z.string() }).loose(),
);
export type AttributesAcquireResponse = z.infer<
	typeof AttributesAcquireResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// attributes.release — POST /api/2/attributes/release/
// @see https://developer.exist.io/reference/attribute_ownership/
// ─────────────────────────────────────────────────────────────────────────────

const AttributesReleaseInputSchema = z.object({
	attributes: z
		.array(z.object({ name: z.string() }))
		.min(1)
		.max(EXIST_MAX_BATCH_SIZE),
});
export type AttributesReleaseInput = z.infer<
	typeof AttributesReleaseInputSchema
>;

const AttributesReleaseResponseSchema = writeResponse(
	z.object({ name: z.string() }).loose(),
);
export type AttributesReleaseResponse = z.infer<
	typeof AttributesReleaseResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// attributes.increment — POST /api/2/attributes/increment/
// @see https://developer.exist.io/reference/writing_data/
// ─────────────────────────────────────────────────────────────────────────────

const IncrementAttributeSchema = z.object({
	/** The attribute name, which must already be owned by this client. */
	name: z.string(),
	/** Defaults to the user's current date when omitted. */
	date: ExistDateSchema.optional(),
	/** The delta to add. String, scale and time-of-day types cannot be incremented. */
	value: z.number(),
});

const AttributesIncrementInputSchema = z.object({
	attributes: z
		.array(IncrementAttributeSchema)
		.min(1)
		.max(EXIST_MAX_BATCH_SIZE),
});
export type AttributesIncrementInput = z.infer<
	typeof AttributesIncrementInputSchema
>;

const AttributesIncrementResponseSchema = writeResponse(
	z
		.object({
			name: z.string(),
			value: z.number(),
			/** The new total for the day after the delta was applied. */
			current: z.number().optional(),
		})
		.loose(),
);
export type AttributesIncrementResponse = z.infer<
	typeof AttributesIncrementResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// attributes.update — POST /api/2/attributes/update/
// @see https://developer.exist.io/reference/writing_data/
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single total value for one attribute on one day. Unlike `increment`, this
 * overwrites whatever Exist already held for that day. Exist validates values
 * only broadly against the attribute's `value_type`, so callers must send the
 * right shape themselves.
 */
const UpdateAttributeSchema = z.object({
	/** The attribute name, which must already be owned by this client. */
	name: z.string(),
	/** The day this value belongs to, in the user's local time. */
	date: ExistDateSchema,
	/**
	 * The new total for the day. Exist will not accept null for an attribute
	 * that already holds a non-null value, to prevent accidental data loss.
	 */
	value: ExistValueSchema,
});

const AttributesUpdateInputSchema = z.object({
	attributes: z.array(UpdateAttributeSchema).min(1).max(EXIST_MAX_BATCH_SIZE),
});
export type AttributesUpdateInput = z.infer<typeof AttributesUpdateInputSchema>;

const AttributesUpdateResponseSchema = writeResponse(
	z
		.object({
			name: z.string(),
			date: z.string(),
			value: ExistValueSchema,
		})
		.loose(),
);
export type AttributesUpdateResponse = z.infer<
	typeof AttributesUpdateResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// averages.list — GET /api/2/averages/
// @see https://developer.exist.io/reference/averages/
// ─────────────────────────────────────────────────────────────────────────────

const AveragesListInputSchema = z.object({
	page: PageSchema,
	limit: LimitSchema,
	/** Oldest date, inclusive. */
	date_min: ExistDateSchema.optional(),
	/** Most recent date, inclusive. */
	date_max: ExistDateSchema.optional(),
	groups: z.array(z.string()).optional(),
	attributes: z.array(z.string()).optional(),
	/** Return every historical average rather than only the latest set. */
	include_historical: z.boolean().optional(),
});
export type AveragesListInput = z.infer<typeof AveragesListInputSchema>;

const AveragesListResponseSchema = paged(ExistAverageSchema);
export type AveragesListResponse = z.infer<typeof AveragesListResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// correlations.list — GET /api/2/correlations/
// @see https://developer.exist.io/reference/correlations/
// ─────────────────────────────────────────────────────────────────────────────

const CorrelationsListInputSchema = z.object({
	page: PageSchema,
	limit: CappedLimitSchema,
	/** Only return strong correlations. */
	strong: z.boolean().optional(),
	/** Only return five-star (most confident) correlations. */
	confident: z.boolean().optional(),
	/** Only return correlations involving this attribute. */
	attribute: z.string().optional(),
});
export type CorrelationsListInput = z.infer<typeof CorrelationsListInputSchema>;

const CorrelationsListResponseSchema = paged(ExistCorrelationSchema);
export type CorrelationsListResponse = z.infer<
	typeof CorrelationsListResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// insights.list — GET /api/2/insights/
// @see https://developer.exist.io/reference/insights/
// ─────────────────────────────────────────────────────────────────────────────

const InsightsListInputSchema = z.object({
	page: PageSchema,
	limit: CappedLimitSchema,
	/** Oldest date, inclusive. */
	date_min: ExistDateSchema.optional(),
	/** Most recent date, inclusive. */
	date_max: ExistDateSchema.optional(),
	/** Insight priority: 1 is today, 4 is last month. */
	priority: z.number().int().optional(),
});
export type InsightsListInput = z.infer<typeof InsightsListInputSchema>;

const InsightsListResponseSchema = paged(ExistInsightSchema);
export type InsightsListResponse = z.infer<typeof InsightsListResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// oauth.authorize — builds https://exist.io/oauth2/authorize (no API call)
// @see https://developer.exist.io/reference/authentication/oauth2/
// ─────────────────────────────────────────────────────────────────────────────

const OauthAuthorizeInputSchema = z.object({
	/**
	 * Scopes to request. Defaults to the scopes the plugin was configured with.
	 * Exist only exposes attributes matching the granted scopes, so request the
	 * narrowest set the integration needs.
	 */
	scopes: z.array(z.string()).min(1).optional(),
});
export type OauthAuthorizeInput = z.infer<typeof OauthAuthorizeInputSchema>;

const OauthAuthorizeResponseSchema = z.object({
	/** The authorisation URL to send the user to. */
	url: z.string(),
	/**
	 * Unguessable CSRF value embedded as the `state` parameter. Store it and
	 * compare it against the `state` Exist returns to the redirect URI.
	 */
	state: z.string(),
	/** The scopes actually requested in the URL. */
	scopes: z.array(z.string()),
});
export type OauthAuthorizeResponse = z.infer<
	typeof OauthAuthorizeResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Aggregates
// ─────────────────────────────────────────────────────────────────────────────

export type ExistEndpointInputs = {
	usersGetProfile: UsersGetProfileInput;
	attributesList: AttributesListInput;
	attributesListTemplates: AttributesListTemplatesInput;
	attributesListWithValues: AttributesListWithValuesInput;
	attributesListOwned: AttributesListOwnedInput;
	attributesAcquire: AttributesAcquireInput;
	attributesRelease: AttributesReleaseInput;
	attributesIncrement: AttributesIncrementInput;
	attributesUpdate: AttributesUpdateInput;
	oauthAuthorize: OauthAuthorizeInput;
	averagesList: AveragesListInput;
	correlationsList: CorrelationsListInput;
	insightsList: InsightsListInput;
};

export type ExistEndpointOutputs = {
	usersGetProfile: UsersGetProfileResponse;
	attributesList: AttributesListResponse;
	attributesListTemplates: AttributesListTemplatesResponse;
	attributesListWithValues: AttributesListWithValuesResponse;
	attributesListOwned: AttributesListOwnedResponse;
	attributesAcquire: AttributesAcquireResponse;
	attributesRelease: AttributesReleaseResponse;
	attributesIncrement: AttributesIncrementResponse;
	attributesUpdate: AttributesUpdateResponse;
	oauthAuthorize: OauthAuthorizeResponse;
	averagesList: AveragesListResponse;
	correlationsList: CorrelationsListResponse;
	insightsList: InsightsListResponse;
};

export const ExistEndpointInputSchemas = {
	usersGetProfile: UsersGetProfileInputSchema,
	attributesList: AttributesListInputSchema,
	attributesListTemplates: AttributesListTemplatesInputSchema,
	attributesListWithValues: AttributesListWithValuesInputSchema,
	attributesListOwned: AttributesListOwnedInputSchema,
	attributesAcquire: AttributesAcquireInputSchema,
	attributesRelease: AttributesReleaseInputSchema,
	attributesIncrement: AttributesIncrementInputSchema,
	attributesUpdate: AttributesUpdateInputSchema,
	oauthAuthorize: OauthAuthorizeInputSchema,
	averagesList: AveragesListInputSchema,
	correlationsList: CorrelationsListInputSchema,
	insightsList: InsightsListInputSchema,
} as const;

export const ExistEndpointOutputSchemas = {
	usersGetProfile: UsersGetProfileResponseSchema,
	attributesList: AttributesListResponseSchema,
	attributesListTemplates: AttributesListTemplatesResponseSchema,
	attributesListWithValues: AttributesListWithValuesResponseSchema,
	attributesListOwned: AttributesListOwnedResponseSchema,
	attributesAcquire: AttributesAcquireResponseSchema,
	attributesRelease: AttributesReleaseResponseSchema,
	attributesIncrement: AttributesIncrementResponseSchema,
	attributesUpdate: AttributesUpdateResponseSchema,
	oauthAuthorize: OauthAuthorizeResponseSchema,
	averagesList: AveragesListResponseSchema,
	correlationsList: CorrelationsListResponseSchema,
	insightsList: InsightsListResponseSchema,
} as const;

export {
	ExistAttributeSchema,
	ExistAttributeTemplateSchema,
	ExistAttributeValueSchema,
	ExistAttributeWithValuesSchema,
	ExistAverageSchema,
	ExistCorrelationSchema,
	ExistGroupSchema,
	ExistInsightSchema,
	ExistProfileSchema,
	ExistServiceSchema,
};
