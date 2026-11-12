import { z } from 'zod';

// Inputs use Userflow's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field Userflow adds or omits cannot fail a
// call that has already happened.
// Reference: https://userflow.com/docs/api (fetched with a browser user agent;
// the docs site answers 403 to a bare request).

/** A user or group id: an opaque string, usually a UUID from your own app. */
const IdSchema = z.string().min(1);

/**
 * A free-form attribute value. Userflow accepts either a literal or an
 * operation such as `{ add: 1 }` or `{ set_once: 'x' }`, so the schema passes
 * anything through and the API decides.
 */
const AttributeValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.record(z.string(), z.unknown()),
	z.array(z.string()),
	z.null(),
]);

const AttributesSchema = z.record(z.string(), AttributeValueSchema);

/**
 * Paging. Every list takes `limit` (1-100, default 10) and `starting_after`,
 * and answers `next_page_url` — which is always set, even on the last page, so
 * `has_more` is what says whether to continue.
 */
/**
 * Userflow accepts `order_by` as a single field or an array, and a leading `-` on any
 * field means descending. Both forms and both directions are accepted here, then
 * flattened to the array the request builder sends.
 */
function orderBySchema<const T extends readonly [string, ...string[]]>(
	fields: T,
	description: string,
) {
	const base = z.enum(fields);
	const withDescending = z.union([
		base,
		z
			.string()
			.refine(
				(value): boolean =>
					value.startsWith('-') &&
					(fields as readonly string[]).includes(value.slice(1)),
				{
					message: `Use one of ${fields.join(', ')}, optionally prefixed with "-".`,
				},
			),
	]);
	return z
		.union([withDescending, z.array(withDescending).min(1)])
		.optional()
		.describe(description);
}

const PagingSchema = {
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Items per page, 1 to 100. Userflow defaults to 10.'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'Return items after this id. The last item id of the previous page works, as does the `next_page_url`.',
		),
};

/**
 * Only objects whose `object` is the documented type are kept, because
 * Userflow expands relationships in place: a `memberships` field is null unless
 * asked for and an array when it is.
 */
function listOf<T extends z.ZodType>(item: T) {
	return z
		.object({
			object: z.literal('list').nullish(),
			data: z.array(item).nullish(),
			has_more: z.boolean().nullish(),
			url: z.string().nullish(),
			next_page_url: z.string().nullish(),
		})
		.loose();
}

const GroupSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('group').nullish(),
		// unknown: attributes are free-form caller data, so their values have no
		// static type; the keys are validated by Userflow, not by this schema.
		attributes: z.record(z.string(), z.unknown()).nullish(),
		created_at: z.string().nullish(),
		// null unless expanded with ?expand=users or ?expand=memberships.
		// unknown: an expanded entry is a full user or membership, whose own schema
		// would duplicate the models below; the raw objects are passed through.
		users: z.array(z.unknown()).nullish(),
		memberships: z.array(z.unknown()).nullish(),
	})
	.loose();

export type UserflowGroup = z.infer<typeof GroupSchema>;

const GroupMembershipSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('group_membership').nullish(),
		attributes: z.record(z.string(), z.unknown()).nullish(),
		created_at: z.string().nullish(),
		group_id: z.string().nullish(),
		user_id: z.string().nullish(),
		// null unless expanded with ?expand=group or ?expand=user.
		group: GroupSchema.nullish(),
		user: z.unknown().nullish(),
	})
	.loose();

export type UserflowGroupMembership = z.infer<typeof GroupMembershipSchema>;

const UserSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('user').nullish(),
		attributes: z.record(z.string(), z.unknown()).nullish(),
		created_at: z.string().nullish(),
		// Both are null unless expanded.
		groups: z.array(GroupSchema).nullish(),
		memberships: z.array(GroupMembershipSchema).nullish(),
	})
	.loose();

export type UserflowUser = z.infer<typeof UserSchema>;

const ExpandSchema = z
	.string()
	.optional()
	.describe(
		'Relationships to expand, e.g. `memberships.group`. Dot-separated, at most four levels.',
	);

// ── users ─────────────────────────────────────────────────────────────────

const UsersUpsertInputSchema = z
	.object({
		id: IdSchema.describe(
			'Your own id for the user. This is the key: an unseen id creates the user, a known one merges the attributes in.',
		),
		attributes: AttributesSchema.optional().describe(
			'Attributes to set. A literal sets the value; `{ add: 1 }`, `{ set_once: ... }` and `{ subtract: 1 }` are operations. Attributes not sent are left alone.',
		),
		groups: z
			.array(
				z
					.object({
						id: IdSchema,
						attributes: AttributesSchema.optional(),
					})
					.loose(),
			)
			.optional()
			.describe(
				'Groups to create or update and ensure membership of. Cannot be combined with `memberships`.',
			),
		memberships: z
			.array(
				z
					.object({
						attributes: AttributesSchema.optional().describe(
							'Attributes of the membership itself, such as the role.',
						),
						group: z
							.object({
								id: IdSchema,
								attributes: AttributesSchema.optional(),
							})
							.loose(),
					})
					.loose(),
			)
			.optional()
			.describe(
				'Memberships to create or update, each naming its group. Use this instead of `groups` to set membership attributes.',
			),
		prune_memberships: z
			.boolean()
			.optional()
			.describe(
				'Remove memberships not listed. Only set it when the list is complete, since anything missing is removed.',
			),
	})
	.superRefine((value, ctx) => {
		if (value.groups && value.memberships) {
			ctx.addIssue({
				code: 'custom',
				path: ['memberships'],
				message: 'Send either groups or memberships, not both.',
			});
		}
		if (value.prune_memberships && !value.groups && !value.memberships) {
			ctx.addIssue({
				code: 'custom',
				path: ['prune_memberships'],
				message:
					'prune_memberships removes every membership when no groups or memberships are sent.',
			});
		}
	});

export type UsersUpsertInput = z.infer<typeof UsersUpsertInputSchema>;

const UsersUpsertResponseSchema = UserSchema;

export type UsersUpsertResponse = z.infer<typeof UsersUpsertResponseSchema>;

const UsersGetInputSchema = z.object({
	id: IdSchema,
	expand: ExpandSchema,
});

export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

const UsersGetResponseSchema = UserSchema;

export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

const UsersDeleteInputSchema = z.object({ id: IdSchema });

export type UsersDeleteInput = z.infer<typeof UsersDeleteInputSchema>;

/** Deleting is idempotent: an unknown id still answers `deleted: true`. */
const UsersDeleteResponseSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('user').nullish(),
		deleted: z.boolean().nullish(),
	})
	.loose();

export type UsersDeleteResponse = z.infer<typeof UsersDeleteResponseSchema>;

const UsersListInputSchema = z.object({
	...PagingSchema,
	email: z
		.string()
		.optional()
		.describe('Only the user whose `email` attribute equals this value.'),
	group_id: z.string().optional().describe('Only members of this group.'),
	segment_id: z
		.string()
		.optional()
		.describe(
			'Only users in this segment; the id is in the segment menu in the UI.',
		),
	condition: z
		.string()
		.optional()
		.describe(
			'A filter expression over any attribute, e.g. `attributes.plan_name:eq:plus`.',
		),
	order_by: orderBySchema(
		[
			'created_at',
			'attributes.signed_up_at',
			'attributes.last_seen_at',
			'attributes.name',
		],
		'Sort field or fields, each optionally prefixed with "-" for descending. Userflow defaults to `created_at`.',
	),
	expand: ExpandSchema,
});

export type UsersListInput = z.infer<typeof UsersListInputSchema>;

const UsersListResponseSchema = listOf(UserSchema);

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// ── groups ────────────────────────────────────────────────────────────────

const GroupsUpsertInputSchema = z.object({
	id: IdSchema.describe(
		'Your own id for the group. An unseen id creates it, a known one merges the attributes in.',
	),
	attributes: AttributesSchema.optional(),
});

export type GroupsUpsertInput = z.infer<typeof GroupsUpsertInputSchema>;

const GroupsUpsertResponseSchema = GroupSchema;

export type GroupsUpsertResponse = z.infer<typeof GroupsUpsertResponseSchema>;

const GroupsGetInputSchema = z.object({
	id: IdSchema,
	expand: ExpandSchema,
});

export type GroupsGetInput = z.infer<typeof GroupsGetInputSchema>;

const GroupsGetResponseSchema = GroupSchema;

export type GroupsGetResponse = z.infer<typeof GroupsGetResponseSchema>;

const GroupsDeleteInputSchema = z.object({ id: IdSchema });

export type GroupsDeleteInput = z.infer<typeof GroupsDeleteInputSchema>;

const GroupsDeleteResponseSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('group').nullish(),
		deleted: z.boolean().nullish(),
	})
	.loose();

export type GroupsDeleteResponse = z.infer<typeof GroupsDeleteResponseSchema>;

const GroupsListInputSchema = z.object({
	...PagingSchema,
	condition: z.string().optional(),
	user_id: z
		.string()
		.optional()
		.describe('Only the groups this user belongs to.'),
	segment_id: z
		.string()
		.optional()
		.describe('Only the groups in this segment.'),
	order_by: orderBySchema(
		['created_at', 'attributes.name'],
		'Sort field or fields, each optionally prefixed with "-" for descending.',
	),
	expand: ExpandSchema,
});

export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;

const GroupsListResponseSchema = listOf(GroupSchema);

export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;

// ── memberships ───────────────────────────────────────────────────────────

/**
 * Memberships cannot be created, updated or listed on their own. They are
 * written by embedding them in `users.upsert`, read by expanding a user or
 * group, and removed here.
 */
const MembershipsRemoveInputSchema = z.object({
	user_id: IdSchema,
	group_id: IdSchema.describe('The user is removed from this group only.'),
});

export type MembershipsRemoveInput = z.infer<
	typeof MembershipsRemoveInputSchema
>;

const MembershipsRemoveResponseSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('group_membership').nullish(),
		deleted: z.boolean().nullish(),
	})
	.loose();

export type MembershipsRemoveResponse = z.infer<
	typeof MembershipsRemoveResponseSchema
>;

// ── events ────────────────────────────────────────────────────────────────

const EventsTrackInputSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.describe(
				'The event name, such as `subscription_activated`. Letters, digits, underscores, dashes, dots, parentheses and spaces only.',
			),
		user_id: IdSchema.optional().describe(
			'The user who did it. At least one of user_id and group_id is required.',
		),
		group_id: IdSchema.optional().describe(
			'The group it happened in. At least one of user_id and group_id is required.',
		),
		attributes: AttributesSchema.optional().describe(
			'Attributes of the event itself, such as a plan name or price.',
		),
		time: z
			.string()
			.optional()
			.describe(
				'ISO 8601 when it happened, for importing historic events. Defaults to now.',
			),
	})
	.superRefine((value, ctx) => {
		if (value.user_id === undefined && value.group_id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['user_id'],
				message: 'An event needs a user_id, a group_id, or both.',
			});
		}
	});

export type EventsTrackInput = z.infer<typeof EventsTrackInputSchema>;

const EventSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('event').nullish(),
		attributes: z.record(z.string(), z.unknown()).nullish(),
		created_at: z.string().nullish(),
		group_id: z.string().nullish(),
		user_id: z.string().nullish(),
		name: z.string().nullish(),
		time: z.string().nullish(),
		group: GroupSchema.nullish(),
		user: UserSchema.nullish(),
	})
	.loose();

export type UserflowEvent = z.infer<typeof EventSchema>;

const EventsTrackResponseSchema = EventSchema;

export type EventsTrackResponse = z.infer<typeof EventsTrackResponseSchema>;

// ── content ───────────────────────────────────────────────────────────────

export const USERFLOW_CONTENT_TYPES = [
	'announcement',
	'assistant',
	'banner',
	'checklist',
	'embed',
	'flow',
	'launcher',
	'resource_center',
	'tracker',
] as const;

const ContentSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('content').nullish(),
		created_at: z.string().nullish(),
		draft_version_id: z.string().nullish(),
		published_version_id: z.string().nullish(),
		labels: z.array(z.string()).nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		// null unless expanded.
		draft_version: z.unknown().nullish(),
		published_version: z.unknown().nullish(),
	})
	.loose();

export type UserflowContent = z.infer<typeof ContentSchema>;

const ContentGetInputSchema = z.object({
	id: IdSchema,
	expand: ExpandSchema,
});

export type ContentGetInput = z.infer<typeof ContentGetInputSchema>;

const ContentGetResponseSchema = ContentSchema;

export type ContentGetResponse = z.infer<typeof ContentGetResponseSchema>;

const ContentListInputSchema = z.object({
	...PagingSchema,
	type: z
		.enum(USERFLOW_CONTENT_TYPES)
		.optional()
		.describe('Only content of this type.'),
	order_by: orderBySchema(
		['created_at', 'name'],
		'Sort field or fields, each optionally prefixed with "-" for descending.',
	),
	// draft_version and published_version come back null unless expanded.
	expand: ExpandSchema,
});

export type ContentListInput = z.infer<typeof ContentListInputSchema>;

const ContentListResponseSchema = listOf(ContentSchema);

export type ContentListResponse = z.infer<typeof ContentListResponseSchema>;

// ── content versions ──────────────────────────────────────────────────────

const ContentVersionSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('content_version').nullish(),
		created_at: z.string().nullish(),
		description: z.string().nullish(),
		edited_at: z.string().nullish(),
		number: z.number().nullish(),
		// null unless expanded; a version holds its flow questions or a
		// checklist's tasks.
		questions: z.array(z.unknown()).nullish(),
		tasks: z.array(z.unknown()).nullish(),
	})
	.loose();

export type UserflowContentVersion = z.infer<typeof ContentVersionSchema>;

const ContentVersionsGetInputSchema = z.object({
	id: IdSchema,
	expand: ExpandSchema,
});

export type ContentVersionsGetInput = z.infer<
	typeof ContentVersionsGetInputSchema
>;

const ContentVersionsGetResponseSchema = ContentVersionSchema;

export type ContentVersionsGetResponse = z.infer<
	typeof ContentVersionsGetResponseSchema
>;

const ContentVersionsListInputSchema = z.object({
	content_id: IdSchema.describe(
		'Required: Userflow cannot list versions across content objects.',
	),
	...PagingSchema,
	number: z.number().int().optional().describe('A specific version number.'),
	order_by: orderBySchema(
		['number'],
		'Sort by version number, optionally prefixed with "-" for descending.',
	),
	// Questions and tasks come back null unless the version is expanded.
	expand: ExpandSchema,
});

export type ContentVersionsListInput = z.infer<
	typeof ContentVersionsListInputSchema
>;

const ContentVersionsListResponseSchema = listOf(ContentVersionSchema);

export type ContentVersionsListResponse = z.infer<
	typeof ContentVersionsListResponseSchema
>;

// ── content sessions ──────────────────────────────────────────────────────

const ContentSessionSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('content_session').nullish(),
		completed_at: z.string().nullish(),
		completed: z.boolean().nullish(),
		content_id: z.string().nullish(),
		created_at: z.string().nullish(),
		group_id: z.string().nullish(),
		is_preview: z.boolean().nullish(),
		last_activity_at: z.string().nullish(),
		launcher_activated: z.boolean().nullish(),
		progress: z
			.string()
			.nullish()
			.describe('A decimal string from `0` to `1`, where `1` is complete.'),
		user_id: z.string().nullish(),
		version_id: z.string().nullish(),
		answers: z.array(z.unknown()).nullish(),
		content: ContentSchema.nullish(),
		group: GroupSchema.nullish(),
		user: UserSchema.nullish(),
		version: z.unknown().nullish(),
	})
	.loose();

export type UserflowContentSession = z.infer<typeof ContentSessionSchema>;

const ContentSessionsGetInputSchema = z.object({
	id: IdSchema,
	expand: ExpandSchema,
});

export type ContentSessionsGetInput = z.infer<
	typeof ContentSessionsGetInputSchema
>;

const ContentSessionsGetResponseSchema = ContentSessionSchema;

export type ContentSessionsGetResponse = z.infer<
	typeof ContentSessionsGetResponseSchema
>;

const ContentSessionsEndInputSchema = z.object({ id: IdSchema });

export type ContentSessionsEndInput = z.infer<
	typeof ContentSessionsEndInputSchema
>;

const ContentSessionsEndResponseSchema = ContentSessionSchema;

export type ContentSessionsEndResponse = z.infer<
	typeof ContentSessionsEndResponseSchema
>;

const ContentSessionsDeleteInputSchema = z.object({ id: IdSchema });

export type ContentSessionsDeleteInput = z.infer<
	typeof ContentSessionsDeleteInputSchema
>;

const ContentSessionsDeleteResponseSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('content_session').nullish(),
		deleted: z.boolean().nullish(),
	})
	.loose();

export type ContentSessionsDeleteResponse = z.infer<
	typeof ContentSessionsDeleteResponseSchema
>;

const ContentSessionsListInputSchema = z.object({
	...PagingSchema,
	content_id: z.string().optional().describe('Only sessions of this content.'),
	user_id: z.string().optional().describe('Only this user sessions.'),
	order_by: orderBySchema(
		['created_at', 'last_activity_at'],
		'Sort field or fields, each optionally prefixed with "-" for descending.',
	),
	expand: ExpandSchema,
});

export type ContentSessionsListInput = z.infer<
	typeof ContentSessionsListInputSchema
>;

const ContentSessionsListResponseSchema = listOf(ContentSessionSchema);

export type ContentSessionsListResponse = z.infer<
	typeof ContentSessionsListResponseSchema
>;

// ── definitions ───────────────────────────────────────────────────────────

export const USERFLOW_ATTRIBUTE_SCOPES = [
	'event',
	'group',
	'group_membership',
	'user',
] as const;

const AttributeDefinitionSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('attribute_definition').nullish(),
		created_at: z.string().nullish(),
		data_type: z.string().nullish(),
		description: z.string().nullish(),
		display_name: z.string().nullish(),
		name: z.string().nullish(),
		scope: z.string().nullish(),
	})
	.loose();

export type UserflowAttributeDefinition = z.infer<
	typeof AttributeDefinitionSchema
>;

const AttributesListInputSchema = z.object({
	...PagingSchema,
	scope: z
		.enum(USERFLOW_ATTRIBUTE_SCOPES)
		.optional()
		.describe('Only attributes attached to this kind of object.'),
	event_name: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Only attributes used by any of these events.'),
	order_by: orderBySchema(
		['created_at', 'display_name', 'name'],
		'Sort field or fields, each optionally prefixed with "-" for descending.',
	),
});

export type AttributesListInput = z.infer<typeof AttributesListInputSchema>;

const AttributesListResponseSchema = listOf(AttributeDefinitionSchema);

export type AttributesListResponse = z.infer<
	typeof AttributesListResponseSchema
>;

const EventDefinitionSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('event_definition').nullish(),
		created_at: z.string().nullish(),
		description: z.string().nullish(),
		display_name: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type UserflowEventDefinition = z.infer<typeof EventDefinitionSchema>;

const EventDefinitionsListInputSchema = z.object({
	...PagingSchema,
	order_by: orderBySchema(
		['created_at', 'display_name', 'name'],
		'Sort field or fields, each optionally prefixed with "-" for descending.',
	),
});

export type EventDefinitionsListInput = z.infer<
	typeof EventDefinitionsListInputSchema
>;

const EventDefinitionsListResponseSchema = listOf(EventDefinitionSchema);

export type EventDefinitionsListResponse = z.infer<
	typeof EventDefinitionsListResponseSchema
>;

// ── webhook subscriptions ─────────────────────────────────────────────────

/**
 * A subscription carries its own `whsec_` signing secret, which is returned on
 * create and on a PATCH — the only two places Userflow ever shows it.
 */
const WebhookSubscriptionSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('webhook_subscription').nullish(),
		api_version: z.string().nullish(),
		created_at: z.string().nullish(),
		disabled: z.boolean().nullish(),
		secret: z
			.string()
			.nullish()
			.describe('Returned on create and update only, to verify signatures.'),
		topics: z.array(z.string()).nullish(),
		url: z.string().nullish(),
	})
	.loose();

export type UserflowWebhookSubscription = z.infer<
	typeof WebhookSubscriptionSchema
>;

const WebhookSubscriptionsCreateInputSchema = z.object({
	url: z.string().min(1).describe('Where Userflow posts the notifications.'),
	topics: z
		.array(z.string().min(1))
		.min(1)
		.describe(
			'Namespaced topics: `user`, `event`, `user.created`, `event.tracked.flow_started`, or `*` for everything.',
		),
	api_version: z.string().optional().describe('Defaults to `2020-01-03`.'),
});

export type WebhookSubscriptionsCreateInput = z.infer<
	typeof WebhookSubscriptionsCreateInputSchema
>;

const WebhookSubscriptionsCreateResponseSchema = WebhookSubscriptionSchema;

export type WebhookSubscriptionsCreateResponse = z.infer<
	typeof WebhookSubscriptionsCreateResponseSchema
>;

const WebhookSubscriptionsGetInputSchema = z.object({ id: IdSchema });

export type WebhookSubscriptionsGetInput = z.infer<
	typeof WebhookSubscriptionsGetInputSchema
>;

const WebhookSubscriptionsGetResponseSchema = WebhookSubscriptionSchema;

export type WebhookSubscriptionsGetResponse = z.infer<
	typeof WebhookSubscriptionsGetResponseSchema
>;

const WebhookSubscriptionsUpdateInputSchema = z
	.object({
		id: IdSchema,
		url: z.string().min(1).optional(),
		topics: z.array(z.string().min(1)).min(1).optional(),
		api_version: z.string().optional(),
		disabled: z
			.boolean()
			.optional()
			.describe('true stops delivery without deleting the subscription.'),
	})
	.superRefine((value, ctx) => {
		const { id: _id, ...fields } = value;
		if (Object.values(fields).every((field) => field === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['id'],
				message: 'Send at least one field to change.',
			});
		}
	});

export type WebhookSubscriptionsUpdateInput = z.infer<
	typeof WebhookSubscriptionsUpdateInputSchema
>;

const WebhookSubscriptionsUpdateResponseSchema = WebhookSubscriptionSchema;

export type WebhookSubscriptionsUpdateResponse = z.infer<
	typeof WebhookSubscriptionsUpdateResponseSchema
>;

const WebhookSubscriptionsDeleteInputSchema = z.object({ id: IdSchema });

export type WebhookSubscriptionsDeleteInput = z.infer<
	typeof WebhookSubscriptionsDeleteInputSchema
>;

const WebhookSubscriptionsDeleteResponseSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('webhook_subscription').nullish(),
		deleted: z.boolean().nullish(),
	})
	.loose();

export type WebhookSubscriptionsDeleteResponse = z.infer<
	typeof WebhookSubscriptionsDeleteResponseSchema
>;

const WebhookSubscriptionsListInputSchema = z.object({
	...PagingSchema,
	order_by: orderBySchema(
		['created_at', 'url'],
		'Sort field or fields, each optionally prefixed with "-" for descending.',
	),
});

export type WebhookSubscriptionsListInput = z.infer<
	typeof WebhookSubscriptionsListInputSchema
>;

const WebhookSubscriptionsListResponseSchema = listOf(
	WebhookSubscriptionSchema,
);

export type WebhookSubscriptionsListResponse = z.infer<
	typeof WebhookSubscriptionsListResponseSchema
>;

// ── accounts (Accounts API) ───────────────────────────────────────────────

const EnvironmentSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('environment').nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		created_at: z.string().nullish(),
		is_primary: z.boolean().nullish(),
		is_deactivated: z.boolean().nullish(),
		region: z.string().nullish(),
	})
	.loose();

export type UserflowEnvironment = z.infer<typeof EnvironmentSchema>;

const AccountSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('account').nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		created_at: z.string().nullish(),
		is_2fa_enforced: z.boolean().nullish(),
		// null unless expanded with ?expand=environments.
		environments: z.array(EnvironmentSchema).nullish(),
	})
	.loose();

export type UserflowAccount = z.infer<typeof AccountSchema>;

const AccountsListInputSchema = z.object({
	...PagingSchema,
	order_by: orderBySchema(
		['name', 'created_at'],
		'Sort field or fields, each optionally prefixed with "-" for descending.',
	),
});

export type AccountsListInput = z.infer<typeof AccountsListInputSchema>;

const AccountsListResponseSchema = listOf(AccountSchema);

export type AccountsListResponse = z.infer<typeof AccountsListResponseSchema>;

const AccountsGetInputSchema = z.object({
	id: IdSchema,
	expand: ExpandSchema,
});

export type AccountsGetInput = z.infer<typeof AccountsGetInputSchema>;

const AccountsGetResponseSchema = AccountSchema;

export type AccountsGetResponse = z.infer<typeof AccountsGetResponseSchema>;

// ── members and invites (Accounts API) ────────────────────────────────────

export const USERFLOW_MEMBER_ROLES = [
	'owner',
	'admin',
	'editor',
	'viewer',
] as const;

const PermissionSchema = z
	.object({
		action: z
			.string()
			.describe('`manage_team` for admins, `publish_flow` for editors.'),
		subject: z.enum(['account', 'environment']),
		subject_id: z
			.string()
			.describe('An account or environment id, or `*` for every environment.'),
	})
	.loose();

const MemberSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('member').nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		created_at: z.string().nullish(),
		avatar_url: z.string().nullish(),
		is_2fa_enabled: z.boolean().nullish(),
		has_sso: z.boolean().nullish(),
		has_password: z.boolean().nullish(),
		role: z.string().nullish(),
		permissions: z.array(PermissionSchema).nullish(),
	})
	.loose();

export type UserflowMember = z.infer<typeof MemberSchema>;

const MembersListInputSchema = z.object({
	account_id: IdSchema,
	...PagingSchema,
	email: z.array(z.string().min(1)).min(1).optional(),
	role: z.array(z.enum(USERFLOW_MEMBER_ROLES)).min(1).optional(),
	order_by: orderBySchema(
		['created_at'],
		'Sort by `created_at`, or `-created_at` for newest first.',
	),
});

export type MembersListInput = z.infer<typeof MembersListInputSchema>;

const MembersListResponseSchema = listOf(MemberSchema);

export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;

const MembersGetInputSchema = z.object({
	account_id: IdSchema,
	id: IdSchema,
});

export type MembersGetInput = z.infer<typeof MembersGetInputSchema>;

const MembersGetResponseSchema = MemberSchema;

export type MembersGetResponse = z.infer<typeof MembersGetResponseSchema>;

const MembersUpdateInputSchema = z.object({
	account_id: IdSchema,
	id: IdSchema,
	role: z
		.enum(USERFLOW_MEMBER_ROLES)
		.optional()
		.describe('The member new role in this account.'),
	permissions: z
		.array(PermissionSchema)
		.optional()
		.describe('Replaces the member permissions. Omit to leave them alone.'),
});

export type MembersUpdateInput = z.infer<typeof MembersUpdateInputSchema>;

const MembersUpdateResponseSchema = MemberSchema;

export type MembersUpdateResponse = z.infer<typeof MembersUpdateResponseSchema>;

const MembersRemoveInputSchema = z.object({
	account_id: IdSchema,
	id: IdSchema,
});

export type MembersRemoveInput = z.infer<typeof MembersRemoveInputSchema>;

const MembersRemoveResponseSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('member').nullish(),
		deleted: z.boolean().nullish(),
	})
	.loose();

export type MembersRemoveResponse = z.infer<typeof MembersRemoveResponseSchema>;

const InviteSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('invite').nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		sender_id: z.string().nullish(),
		created_at: z.string().nullish(),
		is_expired: z.boolean().nullish(),
		role: z.string().nullish(),
		permissions: z.array(PermissionSchema).nullish(),
	})
	.loose();

export type UserflowInvite = z.infer<typeof InviteSchema>;

const InvitesListInputSchema = z.object({
	account_id: IdSchema,
	...PagingSchema,
	email: z.string().optional().describe('Only the invite for this address.'),
	is_expired: z
		.boolean()
		.optional()
		.describe('Only expired invites, or only the ones still open.'),
	order_by: orderBySchema(
		['name', 'created_at'],
		'Sort field or fields, each optionally prefixed with "-" for descending.',
	),
});

export type InvitesListInput = z.infer<typeof InvitesListInputSchema>;

const InvitesListResponseSchema = listOf(InviteSchema);

export type InvitesListResponse = z.infer<typeof InvitesListResponseSchema>;

const InvitesGetInputSchema = z.object({
	account_id: IdSchema,
	id: IdSchema,
});

export type InvitesGetInput = z.infer<typeof InvitesGetInputSchema>;

const InvitesGetResponseSchema = InviteSchema;

export type InvitesGetResponse = z.infer<typeof InvitesGetResponseSchema>;

const InvitesCreateInputSchema = z.object({
	account_id: IdSchema,
	name: z.string().min(1),
	email: z.string().min(1),
	role: z
		.enum(['admin', 'editor', 'viewer'])
		.describe('owner is not invitable; that role is transferred.'),
	permissions: z.array(PermissionSchema).min(1).optional(),
});

export type InvitesCreateInput = z.infer<typeof InvitesCreateInputSchema>;

const InvitesCreateResponseSchema = InviteSchema;

export type InvitesCreateResponse = z.infer<typeof InvitesCreateResponseSchema>;

const InvitesDeleteInputSchema = z.object({
	account_id: IdSchema,
	id: IdSchema,
});

export type InvitesDeleteInput = z.infer<typeof InvitesDeleteInputSchema>;

const InvitesDeleteResponseSchema = z
	.object({
		id: z.string().nullish(),
		object: z.literal('invite').nullish(),
		deleted: z.boolean().nullish(),
	})
	.loose();

export type InvitesDeleteResponse = z.infer<typeof InvitesDeleteResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type UserflowEndpointInputs = {
	usersUpsert: UsersUpsertInput;
	usersGet: UsersGetInput;
	usersDelete: UsersDeleteInput;
	usersList: UsersListInput;
	groupsUpsert: GroupsUpsertInput;
	groupsGet: GroupsGetInput;
	groupsDelete: GroupsDeleteInput;
	groupsList: GroupsListInput;
	membershipsRemove: MembershipsRemoveInput;
	eventsTrack: EventsTrackInput;
	contentGet: ContentGetInput;
	contentList: ContentListInput;
	contentVersionsGet: ContentVersionsGetInput;
	contentVersionsList: ContentVersionsListInput;
	contentSessionsGet: ContentSessionsGetInput;
	contentSessionsEnd: ContentSessionsEndInput;
	contentSessionsDelete: ContentSessionsDeleteInput;
	contentSessionsList: ContentSessionsListInput;
	attributesList: AttributesListInput;
	eventDefinitionsList: EventDefinitionsListInput;
	webhookSubscriptionsCreate: WebhookSubscriptionsCreateInput;
	webhookSubscriptionsGet: WebhookSubscriptionsGetInput;
	webhookSubscriptionsUpdate: WebhookSubscriptionsUpdateInput;
	webhookSubscriptionsDelete: WebhookSubscriptionsDeleteInput;
	webhookSubscriptionsList: WebhookSubscriptionsListInput;
	accountsList: AccountsListInput;
	accountsGet: AccountsGetInput;
	membersList: MembersListInput;
	membersGet: MembersGetInput;
	membersUpdate: MembersUpdateInput;
	membersRemove: MembersRemoveInput;
	invitesList: InvitesListInput;
	invitesGet: InvitesGetInput;
	invitesCreate: InvitesCreateInput;
	invitesDelete: InvitesDeleteInput;
};

export type UserflowEndpointOutputs = {
	usersUpsert: UsersUpsertResponse;
	usersGet: UsersGetResponse;
	usersDelete: UsersDeleteResponse;
	usersList: UsersListResponse;
	groupsUpsert: GroupsUpsertResponse;
	groupsGet: GroupsGetResponse;
	groupsDelete: GroupsDeleteResponse;
	groupsList: GroupsListResponse;
	membershipsRemove: MembershipsRemoveResponse;
	eventsTrack: EventsTrackResponse;
	contentGet: ContentGetResponse;
	contentList: ContentListResponse;
	contentVersionsGet: ContentVersionsGetResponse;
	contentVersionsList: ContentVersionsListResponse;
	contentSessionsGet: ContentSessionsGetResponse;
	contentSessionsEnd: ContentSessionsEndResponse;
	contentSessionsDelete: ContentSessionsDeleteResponse;
	contentSessionsList: ContentSessionsListResponse;
	attributesList: AttributesListResponse;
	eventDefinitionsList: EventDefinitionsListResponse;
	webhookSubscriptionsCreate: WebhookSubscriptionsCreateResponse;
	webhookSubscriptionsGet: WebhookSubscriptionsGetResponse;
	webhookSubscriptionsUpdate: WebhookSubscriptionsUpdateResponse;
	webhookSubscriptionsDelete: WebhookSubscriptionsDeleteResponse;
	webhookSubscriptionsList: WebhookSubscriptionsListResponse;
	accountsList: AccountsListResponse;
	accountsGet: AccountsGetResponse;
	membersList: MembersListResponse;
	membersGet: MembersGetResponse;
	membersUpdate: MembersUpdateResponse;
	membersRemove: MembersRemoveResponse;
	invitesList: InvitesListResponse;
	invitesGet: InvitesGetResponse;
	invitesCreate: InvitesCreateResponse;
	invitesDelete: InvitesDeleteResponse;
};

export const UserflowEndpointInputSchemas = {
	usersUpsert: UsersUpsertInputSchema,
	usersGet: UsersGetInputSchema,
	usersDelete: UsersDeleteInputSchema,
	usersList: UsersListInputSchema,
	groupsUpsert: GroupsUpsertInputSchema,
	groupsGet: GroupsGetInputSchema,
	groupsDelete: GroupsDeleteInputSchema,
	groupsList: GroupsListInputSchema,
	membershipsRemove: MembershipsRemoveInputSchema,
	eventsTrack: EventsTrackInputSchema,
	contentGet: ContentGetInputSchema,
	contentList: ContentListInputSchema,
	contentVersionsGet: ContentVersionsGetInputSchema,
	contentVersionsList: ContentVersionsListInputSchema,
	contentSessionsGet: ContentSessionsGetInputSchema,
	contentSessionsEnd: ContentSessionsEndInputSchema,
	contentSessionsDelete: ContentSessionsDeleteInputSchema,
	contentSessionsList: ContentSessionsListInputSchema,
	attributesList: AttributesListInputSchema,
	eventDefinitionsList: EventDefinitionsListInputSchema,
	webhookSubscriptionsCreate: WebhookSubscriptionsCreateInputSchema,
	webhookSubscriptionsGet: WebhookSubscriptionsGetInputSchema,
	webhookSubscriptionsUpdate: WebhookSubscriptionsUpdateInputSchema,
	webhookSubscriptionsDelete: WebhookSubscriptionsDeleteInputSchema,
	webhookSubscriptionsList: WebhookSubscriptionsListInputSchema,
	accountsList: AccountsListInputSchema,
	accountsGet: AccountsGetInputSchema,
	membersList: MembersListInputSchema,
	membersGet: MembersGetInputSchema,
	membersUpdate: MembersUpdateInputSchema,
	membersRemove: MembersRemoveInputSchema,
	invitesList: InvitesListInputSchema,
	invitesGet: InvitesGetInputSchema,
	invitesCreate: InvitesCreateInputSchema,
	invitesDelete: InvitesDeleteInputSchema,
} as const;

export const UserflowEndpointOutputSchemas = {
	usersUpsert: UsersUpsertResponseSchema,
	usersGet: UsersGetResponseSchema,
	usersDelete: UsersDeleteResponseSchema,
	usersList: UsersListResponseSchema,
	groupsUpsert: GroupsUpsertResponseSchema,
	groupsGet: GroupsGetResponseSchema,
	groupsDelete: GroupsDeleteResponseSchema,
	groupsList: GroupsListResponseSchema,
	membershipsRemove: MembershipsRemoveResponseSchema,
	eventsTrack: EventsTrackResponseSchema,
	contentGet: ContentGetResponseSchema,
	contentList: ContentListResponseSchema,
	contentVersionsGet: ContentVersionsGetResponseSchema,
	contentVersionsList: ContentVersionsListResponseSchema,
	contentSessionsGet: ContentSessionsGetResponseSchema,
	contentSessionsEnd: ContentSessionsEndResponseSchema,
	contentSessionsDelete: ContentSessionsDeleteResponseSchema,
	contentSessionsList: ContentSessionsListResponseSchema,
	attributesList: AttributesListResponseSchema,
	eventDefinitionsList: EventDefinitionsListResponseSchema,
	webhookSubscriptionsCreate: WebhookSubscriptionsCreateResponseSchema,
	webhookSubscriptionsGet: WebhookSubscriptionsGetResponseSchema,
	webhookSubscriptionsUpdate: WebhookSubscriptionsUpdateResponseSchema,
	webhookSubscriptionsDelete: WebhookSubscriptionsDeleteResponseSchema,
	webhookSubscriptionsList: WebhookSubscriptionsListResponseSchema,
	accountsList: AccountsListResponseSchema,
	accountsGet: AccountsGetResponseSchema,
	membersList: MembersListResponseSchema,
	membersGet: MembersGetResponseSchema,
	membersUpdate: MembersUpdateResponseSchema,
	membersRemove: MembersRemoveResponseSchema,
	invitesList: InvitesListResponseSchema,
	invitesGet: InvitesGetResponseSchema,
	invitesCreate: InvitesCreateResponseSchema,
	invitesDelete: InvitesDeleteResponseSchema,
} as const;
