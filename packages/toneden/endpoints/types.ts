import { z } from 'zod';

/**
 * ToneDen's published OpenAPI gives every path and marks no request body field
 * as required: a create takes the resource's own fields, and an update takes the
 * subset to change. The schemas below therefore type the documented field names
 * as optional, and the plugin sends only what the caller sets.
 *
 * Response schemas mirror the same field lists. ToneDen sends many more fields
 * than any one integration reads, so the objects are `.loose()`.
 */

/** A link, the unit ToneDen uses for a smart link or fan link. */
const LinkSchema = z
	.object({
		id: z.number().nullish(),
		title: z.string().nullish(),
		user_id: z.number().nullish(),
		target_type: z.string().nullish(),
		target_url: z.string().nullish(),
		custom_domain: z.string().nullish(),
		subdomain: z.string().nullish(),
		shortened_path: z.string().nullish(),
		isrc: z.string().nullish(),
		upc: z.string().nullish(),
		click_count: z.number().nullish(),
		clickthrough_count: z.number().nullish(),
		show_socials: z.boolean().nullish(),
		skip_landing_page: z.boolean().nullish(),
		sort_services_by_clickthroughs: z.boolean().nullish(),
		use_saved_service: z.boolean().nullish(),
		affiliate_codes: z.array(z.object({}).loose()).nullish(),
		pixels: z.array(z.object({}).loose()).nullish(),
		services: z.array(z.object({}).loose()).nullish(),
		social_settings: z.object({}).loose().nullish(),
		header: z.string().nullish(),
		metadata_title: z.string().nullish(),
		metadata_description: z.string().nullish(),
		metadata_image_url: z.string().nullish(),
		author: z.string().nullish(),
		bg_color: z.string().nullish(),
		bg_url: z.string().nullish(),
		image_url: z.string().nullish(),
		preview_url: z.string().nullish(),
		autoplay_preview: z.boolean().nullish(),
		button_color: z.string().nullish(),
		call_to_action: z.string().nullish(),
		date: z.string().nullish(),
		location: z.string().nullish(),
		price: z.string().nullish(),
	})
	.loose();
export type LinkOutput = z.output<typeof LinkSchema>;

const AttachmentSchema = z
	.object({
		id: z.number().nullish(),
		owner_id: z.number().nullish(),
		type: z.string().nullish().describe('contest or unlock'),
		actions: z.array(z.object({}).loose()).nullish(),
		artwork_url: z.string().nullish(),
		title: z.string().nullish(),
		link_path: z.string().nullish(),
		is_private: z.boolean().nullish(),
		is_hidden: z.boolean().nullish(),
		secret_token: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();
export type AttachmentOutput = z.output<typeof AttachmentSchema>;

const AdCampaignSchema = z
	.object({
		id: z.number().nullish(),
		title: z.string().nullish(),
		status: z.string().nullish(),
		target_type: z.string().nullish(),
		target: z.string().nullish(),
		user_id: z.number().nullish(),
	})
	.loose();
export type AdCampaignOutput = z.output<typeof AdCampaignSchema>;

const PlaybookCampaignSchema = z
	.object({
		id: z.number().nullish(),
		title: z.string().nullish(),
		user_id: z.number().nullish(),
		template_id: z.number().nullish(),
		is_archived: z.boolean().nullish(),
		status: z.string().nullish(),
		subcampaigns: z.array(z.object({}).loose()).nullish(),
	})
	.loose();
export type PlaybookCampaignOutput = z.output<typeof PlaybookCampaignSchema>;

const UserSchema = z
	.object({
		id: z.number().nullish(),
		username: z.string().nullish(),
		display_name: z.string().nullish(),
		email: z.string().nullish(),
		type: z.string().nullish(),
		about: z.string().nullish(),
		avatar_url: z.string().nullish(),
		account_count: z.number().nullish(),
		birthday: z.string().nullish(),
		city: z.string().nullish(),
		country: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		state: z.string().nullish(),
		subscription_id: z.number().nullish(),
	})
	.loose();
export type UserOutput = z.output<typeof UserSchema>;

/** A single-object envelope. ToneDen wraps a read in the resource name. */
const Wrapped = <K extends string, T extends z.ZodType>(key: K, value: T) =>
	z.object({ [key]: value } as Record<K, T>).loose();

const LinkEnvelopeSchema = Wrapped('link', LinkSchema);
const AttachmentEnvelopeSchema = Wrapped('attachment', AttachmentSchema);
const AdCampaignEnvelopeSchema = Wrapped('ad_campaign', AdCampaignSchema);
const PlaybookEnvelopeSchema = Wrapped(
	'playbook_campaign',
	PlaybookCampaignSchema,
);
const UserEnvelopeSchema = Wrapped('user', UserSchema);

/** A list envelope. */
const ListEnvelope = <K extends string, T extends z.ZodType>(
	key: K,
	value: T,
) => z.object({ [key]: z.array(value) } as Record<K, z.ZodArray<T>>).loose();

const LinksEnvelopeSchema = ListEnvelope('links', LinkSchema);
const AttachmentsEnvelopeSchema = ListEnvelope('attachments', AttachmentSchema);
const AdCampaignsEnvelopeSchema = ListEnvelope(
	'ad_campaigns',
	AdCampaignSchema,
);
const UserListsEnvelopeSchema = ListEnvelope(
	'user_lists',
	z
		.object({
			id: z.number().nullish(),
			name: z.string().nullish(),
			type: z.string().nullish(),
			external_ad_account_id: z.string().nullish(),
			size: z.number().nullish(),
		})
		.loose(),
);

/** The insight routes return a time series of data points. */
const InsightsSchema = z
	.object({
		data: z.array(z.object({}).loose()).nullish(),
		series: z.array(z.object({}).loose()).nullish(),
	})
	.loose();
export type InsightsOutput = z.output<typeof InsightsSchema>;

/** `/links/validPath` answers 200 with a verdict rather than an error. */
const ValidPathSchema = z
	.object({
		valid: z.boolean(),
		reason: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();
export type ValidPathOutput = z.output<typeof ValidPathSchema>;

/** The shareable link a caller gets back from `/links/expand`. */
const ExpandedLinkSchema = z
	.object({
		is_active: z.boolean().nullish(),
		pixels: z.array(z.object({}).loose()).nullish(),
		services: z.array(z.object({}).loose()).nullish(),
		socials: z.array(z.object({}).loose()).nullish(),
		url: z.string().nullish(),
	})
	.loose();
export type ExpandedLinkOutput = z.output<typeof ExpandedLinkSchema>;

/** The list fields a link write accepts, all optional. */
const LinkWriteFields = {
	title: z.string().optional(),
	target_type: z.string().optional().describe('What the link promotes'),
	target_url: z.string().optional(),
	custom_domain: z.string().optional(),
	subdomain: z.string().optional(),
	shortened_path: z
		.string()
		.optional()
		.describe('Check availability with `links.validPath` first'),
	isrc: z.string().optional(),
	upc: z.string().optional(),
	show_socials: z.boolean().optional(),
	skip_landing_page: z.boolean().optional(),
	sort_services_by_clickthroughs: z.boolean().optional(),
	use_saved_service: z.boolean().optional(),
	affiliate_codes: z.array(z.object({}).loose()).optional(),
	pixels: z.array(z.object({}).loose()).optional(),
	services: z.array(z.object({}).loose()).optional(),
	// unknown: ToneDen documents social settings as a free-form object per service.
	social_settings: z.record(z.string(), z.unknown()).optional(),
	header: z.string().optional(),
	metadata_title: z.string().optional(),
	metadata_description: z.string().optional(),
	metadata_image_url: z.string().optional(),
	author: z.string().optional(),
	bg_color: z.string().optional(),
	bg_url: z.string().optional(),
	image_url: z.string().optional(),
	preview_url: z.string().optional(),
	autoplay_preview: z.boolean().optional(),
	button_color: z.string().optional(),
	call_to_action: z.string().optional(),
	date: z.string().optional(),
	location: z.string().optional(),
	price: z.string().optional(),
};

const AttachmentWriteFields = {
	type: z.string().optional().describe('contest or unlock'),
	title: z.string().optional(),
	artwork_url: z.string().optional(),
	link_path: z.string().optional(),
	is_private: z.boolean().optional(),
	is_hidden: z.boolean().optional(),
	message: z.string().optional(),
	actions: z.array(z.object({}).loose()).optional(),
};

// ---------------------------------------------------------------------------
// links
// ---------------------------------------------------------------------------

const UserLinksInputSchema = z.object({
	user_id: z.number().int().positive(),
	target_type: z.string().optional(),
	offset: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).optional(),
});
export type UserLinksInput = z.input<typeof UserLinksInputSchema>;

const GetLinkInputSchema = z.object({ link_id: z.number().int().positive() });
export type GetLinkInput = z.input<typeof GetLinkInputSchema>;

const CreateLinkInputSchema = z.object(LinkWriteFields);
export type CreateLinkInput = z.input<typeof CreateLinkInputSchema>;

/**
 * An update whose only key is `campaign_id` would send an empty body that
 * changes nothing, so it is refused like the other updates.
 */
function requireChange(
	// unknown: the loose write schemas pass through any provider field.
	value: Record<string, unknown>,
	ctx: z.RefinementCtx,
): void {
	const changed = Object.entries(value).some(
		([key, entry]) => key !== 'campaign_id' && entry !== undefined,
	);
	if (!changed) {
		ctx.addIssue({
			code: 'custom',
			message: 'Pass at least one field to change',
			path: ['campaign_id'],
		});
	}
}

const UpdateLinkInputSchema = z
	.object({ link_id: z.number().int().positive(), ...LinkWriteFields })
	.superRefine((value, ctx) => {
		// An update with no field to change sends an empty body, which ToneDen
		// answers with the unchanged link. Catch it here instead.
		const { link_id, ...fields } = value;
		void link_id;
		if (Object.values(fields).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Pass at least one field to change',
				path: ['title'],
			});
		}
	});
export type UpdateLinkInput = z.input<typeof UpdateLinkInputSchema>;

const DeleteLinkInputSchema = GetLinkInputSchema;
export type DeleteLinkInput = z.input<typeof DeleteLinkInputSchema>;

const ExpandLinkInputSchema = z.object({
	url: z
		.string()
		.optional()
		.describe('A music or podcast URL to expand into a link'),
});
export type ExpandLinkInput = z.input<typeof ExpandLinkInputSchema>;

const ValidPathInputSchema = z.object({
	path: z.string().min(1).describe('The path to check'),
	subdomain: z.string().optional(),
	custom_domain: z.string().optional(),
});
export type ValidPathInput = z.input<typeof ValidPathInputSchema>;

const LinkInsightsInputSchema = z.object({
	link_id: z.number().int().positive(),
	metric: z
		.enum(['clicks', 'clickthroughs', 'rsvps'])
		.describe('Which action to count; `rsvps` only works on livestream links'),
	start_date: z
		.string()
		.optional()
		.describe('ISO 8601 date; only actions after it are counted'),
	end_date: z
		.string()
		.optional()
		.describe('ISO 8601 date; only actions before it are counted'),
	aggregate_interval: z.enum(['day', 'hour', 'week']).optional(),
	aggregate_geo: z.enum(['city', 'country', 'region']).optional(),
	aggregate_by_referrer: z.boolean().optional(),
	aggregate_by_service: z.boolean().optional(),
	for_distinct_fans: z
		.boolean()
		.optional()
		.describe('Count one action per fan'),
});
export type LinkInsightsInput = z.input<typeof LinkInsightsInputSchema>;

const LinkInsightsOverviewInputSchema = z.object({
	link_id: z.number().int().positive(),
});
export type LinkInsightsOverviewInput = z.input<
	typeof LinkInsightsOverviewInputSchema
>;

// ---------------------------------------------------------------------------
// attachments
// ---------------------------------------------------------------------------

const UserAttachmentsInputSchema = z.object({
	user_id: z.number().int().positive(),
	type: z
		.enum(['unlock', 'contest'])
		.describe('Which kind of attachment to list; ToneDen requires it'),
	offset: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).optional(),
});
export type UserAttachmentsInput = z.input<typeof UserAttachmentsInputSchema>;

const AttachmentIdInputSchema = z.object({
	attachment_id: z.number().int().positive(),
});
export type AttachmentIdInput = z.input<typeof AttachmentIdInputSchema>;

const CreateAttachmentInputSchema = z.object(AttachmentWriteFields);
export type CreateAttachmentInput = z.input<typeof CreateAttachmentInputSchema>;

const UpdateAttachmentInputSchema = z
	.object({
		attachment_id: z.number().int().positive(),
		...AttachmentWriteFields,
	})
	.superRefine((value, ctx) => {
		const { attachment_id, ...fields } = value;
		void attachment_id;
		if (Object.values(fields).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Pass at least one field to change',
				path: ['title'],
			});
		}
	});
export type UpdateAttachmentInput = z.input<typeof UpdateAttachmentInputSchema>;

// The totals and platform routes take only the attachment ID.
const AttachmentStatsInputSchema = z.object({
	attachment_id: z.number().int().positive(),
});
export type AttachmentStatsInput = z.input<typeof AttachmentStatsInputSchema>;

// The entries and unlocks time series take a start date and an interval.
const AttachmentSeriesInputSchema = z.object({
	attachment_id: z.number().int().positive(),
	start_date: z
		.string()
		.optional()
		.describe(
			'Earliest date to include; ToneDen defaults to the attachment creation',
		),
	aggregate_interval: z
		.enum(['day', 'hour', 'week'])
		.optional()
		.describe('One data point per day (default), hour or week'),
});
export type AttachmentSeriesInput = z.input<typeof AttachmentSeriesInputSchema>;

const AttachmentStatsSchema = z
	.object({
		data: z.array(z.object({}).loose()).nullish(),
		totals: z.object({}).loose().nullish(),
	})
	.loose();

// ---------------------------------------------------------------------------
// advertising
// ---------------------------------------------------------------------------

const ListCampaignsInputSchema = z.object({
	user_id: z.number().int().positive(),
	offset: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).optional(),
});
export type ListCampaignsInput = z.input<typeof ListCampaignsInputSchema>;

const CampaignIdInputSchema = z.object({
	campaign_id: z.number().int().positive(),
});
export type CampaignIdInput = z.input<typeof CampaignIdInputSchema>;

/**
 * A campaign write. The documented body is the campaign's own schema with no
 * required field, so the fields are optional here and the plugin forwards only
 * the ones the caller sets.
 */
const CampaignWriteSchema = z
	.object({
		title: z.string().optional(),
		status: z.string().optional(),
		target_type: z.string().optional(),
		target: z.string().optional(),
	})
	.loose();
export type CampaignWriteInput = z.input<typeof CampaignWriteSchema>;

const UserListsInputSchema = z.object({
	user_id: z.number().int().positive(),
});
export type UserListsInput = z.input<typeof UserListsInputSchema>;

const CreateUserListInputSchema = z.object({
	external_ad_account_id: z.string().min(1),
	type: z.string().min(1),
});
export type CreateUserListInput = z.input<typeof CreateUserListInputSchema>;

/** A person in a user list or a conversion, as ToneDen documents it. */
const UserListUserSchema = z.object({
	email: z.string().optional(),
	phone: z.string().optional(),
	id: z.string().optional().describe('Your own external ID for the person'),
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().length(2).optional().describe('2-letter country code'),
	zip: z.string().optional(),
	gender: z.enum(['m', 'f']).optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
});

const UpdateUserListContactsInputSchema = z
	.object({
		list_id: z.number().int().positive(),
		add: z.array(UserListUserSchema).min(1).optional(),
		remove: z.array(UserListUserSchema).min(1).optional(),
	})
	.superRefine((value, ctx) => {
		// One of the two lists has to say what to change.
		if (value.add === undefined && value.remove === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Pass `add`, `remove`, or both',
				path: ['add'],
			});
		}
	});
export type UpdateUserListContactsInput = z.input<
	typeof UpdateUserListContactsInputSchema
>;

const OfflineConversionsInputSchema = z.object({
	user_id: z.number().int().positive(),
	events: z
		.array(
			z.object({
				user: UserListUserSchema.describe('Who performed the event'),
				event: z.enum([
					'ViewContent',
					'Search',
					'AddToCart',
					'AddToWishlist',
					'InitiateCheckout',
					'AddPaymentInfo',
					'Purchase',
					'Lead',
				]),
				timestamp: z.number().describe('UNIX timestamp of the event'),
				value: z
					.number()
					.optional()
					.describe('What the customer spent, for a Purchase'),
			}),
		)
		.min(1)
		.describe('The conversion events; sent as the request body array'),
});
export type OfflineConversionsInput = z.input<
	typeof OfflineConversionsInputSchema
>;

// ---------------------------------------------------------------------------
// playbook campaigns
// ---------------------------------------------------------------------------

const PlaybookIdInputSchema = z.object({
	campaign_id: z.number().int().positive(),
});
export type PlaybookIdInput = z.input<typeof PlaybookIdInputSchema>;

const PlaybookWriteSchema = z
	.object({
		title: z.string().optional(),
		template_id: z.number().int().optional(),
		is_archived: z.boolean().optional(),
		status: z.string().optional(),
	})
	.loose();
export type PlaybookWriteInput = z.input<typeof PlaybookWriteSchema>;

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------

const UserIdInputSchema = z.object({
	user_id: z
		.union([z.number().int().positive(), z.literal('me')])
		.describe("A user ID, or 'me' for the connected user"),
});
export type UserIdInput = z.input<typeof UserIdInputSchema>;

const UpdateUserInputSchema = z
	.object({
		user_id: z.number().int().positive(),
		username: z.string().optional(),
		display_name: z.string().optional(),
		email: z.email().optional(),
		about: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		country: z.string().optional(),
		avatar_url: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		const { user_id, ...fields } = value;
		void user_id;
		if (Object.values(fields).every((entry) => entry === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Pass at least one field to change',
				path: ['username'],
			});
		}
	});
export type UpdateUserInput = z.input<typeof UpdateUserInputSchema>;

/** A delete answers `{ success }`, or the deleted resource. */
const DeleteResultSchema = z.union([
	z.object({ success: z.boolean() }).loose(),
	z.object({}).loose(),
]);

export type ToneDenEndpointInputs = {
	listUserLinks: UserLinksInput;
	getLink: GetLinkInput;
	createLink: CreateLinkInput;
	updateLink: UpdateLinkInput;
	deleteLink: DeleteLinkInput;
	expandLink: ExpandLinkInput;
	validPath: ValidPathInput;
	linkInsights: LinkInsightsInput;
	linkInsightsOverview: LinkInsightsOverviewInput;
	listUserAttachments: UserAttachmentsInput;
	getAttachment: AttachmentIdInput;
	createAttachment: CreateAttachmentInput;
	updateAttachment: UpdateAttachmentInput;
	deleteAttachment: AttachmentIdInput;
	attachmentEntries: AttachmentSeriesInput;
	attachmentEntriesTotals: AttachmentStatsInput;
	attachmentUnlocks: AttachmentSeriesInput;
	attachmentUnlocksTotals: AttachmentStatsInput;
	attachmentUnlockPlatforms: AttachmentStatsInput;
	listCampaigns: ListCampaignsInput;
	getCampaign: CampaignIdInput;
	createCampaign: CampaignWriteInput;
	updateCampaign: CampaignWriteInput & { campaign_id: number };
	deleteCampaign: CampaignIdInput;
	campaignInsights: CampaignIdInput;
	campaignCreativeInsights: CampaignIdInput;
	listUserLists: UserListsInput;
	createUserList: CreateUserListInput;
	updateUserListContacts: UpdateUserListContactsInput;
	offlineConversions: OfflineConversionsInput;
	getPlaybookCampaign: PlaybookIdInput;
	createPlaybookCampaign: PlaybookWriteInput;
	updatePlaybookCampaign: PlaybookWriteInput & { campaign_id: number };
	deletePlaybookCampaign: PlaybookIdInput;
	getUser: UserIdInput;
	updateUser: UpdateUserInput;
};

export type ToneDenEndpointOutputs = {
	listUserLinks: z.output<typeof LinksEnvelopeSchema>;
	getLink: z.output<typeof LinkEnvelopeSchema>;
	createLink: z.output<typeof LinkEnvelopeSchema>;
	updateLink: z.output<typeof LinkEnvelopeSchema>;
	deleteLink: z.output<typeof DeleteResultSchema>;
	expandLink: ExpandedLinkOutput;
	validPath: ValidPathOutput;
	linkInsights: InsightsOutput;
	linkInsightsOverview: InsightsOutput;
	listUserAttachments: z.output<typeof AttachmentsEnvelopeSchema>;
	getAttachment: z.output<typeof AttachmentEnvelopeSchema>;
	createAttachment: z.output<typeof AttachmentEnvelopeSchema>;
	updateAttachment: z.output<typeof AttachmentEnvelopeSchema>;
	deleteAttachment: z.output<typeof DeleteResultSchema>;
	attachmentEntries: z.output<typeof AttachmentStatsSchema>;
	attachmentEntriesTotals: z.output<typeof AttachmentStatsSchema>;
	attachmentUnlocks: z.output<typeof AttachmentStatsSchema>;
	attachmentUnlocksTotals: z.output<typeof AttachmentStatsSchema>;
	attachmentUnlockPlatforms: z.output<typeof AttachmentStatsSchema>;
	listCampaigns: z.output<typeof AdCampaignsEnvelopeSchema>;
	getCampaign: z.output<typeof AdCampaignEnvelopeSchema>;
	createCampaign: z.output<typeof AdCampaignEnvelopeSchema>;
	updateCampaign: z.output<typeof AdCampaignEnvelopeSchema>;
	deleteCampaign: z.output<typeof DeleteResultSchema>;
	campaignInsights: InsightsOutput;
	campaignCreativeInsights: InsightsOutput;
	listUserLists: z.output<typeof UserListsEnvelopeSchema>;
	createUserList: z.output<typeof UserListsEnvelopeSchema>;
	updateUserListContacts: z.output<typeof DeleteResultSchema>;
	offlineConversions: z.output<typeof DeleteResultSchema>;
	getPlaybookCampaign: z.output<typeof PlaybookEnvelopeSchema>;
	createPlaybookCampaign: z.output<typeof PlaybookEnvelopeSchema>;
	updatePlaybookCampaign: z.output<typeof PlaybookEnvelopeSchema>;
	deletePlaybookCampaign: z.output<typeof DeleteResultSchema>;
	getUser: z.output<typeof UserEnvelopeSchema>;
	updateUser: z.output<typeof UserEnvelopeSchema>;
};

export const ToneDenEndpointInputSchemas = {
	listUserLinks: UserLinksInputSchema,
	getLink: GetLinkInputSchema,
	createLink: CreateLinkInputSchema,
	updateLink: UpdateLinkInputSchema,
	deleteLink: DeleteLinkInputSchema,
	expandLink: ExpandLinkInputSchema,
	validPath: ValidPathInputSchema,
	linkInsights: LinkInsightsInputSchema,
	linkInsightsOverview: LinkInsightsOverviewInputSchema,
	listUserAttachments: UserAttachmentsInputSchema,
	getAttachment: AttachmentIdInputSchema,
	createAttachment: CreateAttachmentInputSchema,
	updateAttachment: UpdateAttachmentInputSchema,
	deleteAttachment: AttachmentIdInputSchema,
	attachmentEntries: AttachmentSeriesInputSchema,
	attachmentEntriesTotals: AttachmentStatsInputSchema,
	attachmentUnlocks: AttachmentSeriesInputSchema,
	attachmentUnlocksTotals: AttachmentStatsInputSchema,
	attachmentUnlockPlatforms: AttachmentStatsInputSchema,
	listCampaigns: ListCampaignsInputSchema,
	getCampaign: CampaignIdInputSchema,
	createCampaign: CampaignWriteSchema,
	updateCampaign: CampaignWriteSchema.extend({
		campaign_id: z.number().int().positive(),
	}).superRefine(requireChange),
	deleteCampaign: CampaignIdInputSchema,
	campaignInsights: CampaignIdInputSchema,
	campaignCreativeInsights: CampaignIdInputSchema,
	listUserLists: UserListsInputSchema,
	createUserList: CreateUserListInputSchema,
	updateUserListContacts: UpdateUserListContactsInputSchema,
	offlineConversions: OfflineConversionsInputSchema,
	getPlaybookCampaign: PlaybookIdInputSchema,
	createPlaybookCampaign: PlaybookWriteSchema,
	updatePlaybookCampaign: PlaybookWriteSchema.extend({
		campaign_id: z.number().int().positive(),
	}).superRefine(requireChange),
	deletePlaybookCampaign: PlaybookIdInputSchema,
	getUser: UserIdInputSchema,
	updateUser: UpdateUserInputSchema,
} as const;

export const ToneDenEndpointOutputSchemas = {
	listUserLinks: LinksEnvelopeSchema,
	getLink: LinkEnvelopeSchema,
	createLink: LinkEnvelopeSchema,
	updateLink: LinkEnvelopeSchema,
	deleteLink: DeleteResultSchema,
	expandLink: ExpandedLinkSchema,
	validPath: ValidPathSchema,
	linkInsights: InsightsSchema,
	linkInsightsOverview: InsightsSchema,
	listUserAttachments: AttachmentsEnvelopeSchema,
	getAttachment: AttachmentEnvelopeSchema,
	createAttachment: AttachmentEnvelopeSchema,
	updateAttachment: AttachmentEnvelopeSchema,
	deleteAttachment: DeleteResultSchema,
	attachmentEntries: AttachmentStatsSchema,
	attachmentEntriesTotals: AttachmentStatsSchema,
	attachmentUnlocks: AttachmentStatsSchema,
	attachmentUnlocksTotals: AttachmentStatsSchema,
	attachmentUnlockPlatforms: AttachmentStatsSchema,
	listCampaigns: AdCampaignsEnvelopeSchema,
	getCampaign: AdCampaignEnvelopeSchema,
	createCampaign: AdCampaignEnvelopeSchema,
	updateCampaign: AdCampaignEnvelopeSchema,
	deleteCampaign: DeleteResultSchema,
	campaignInsights: InsightsSchema,
	campaignCreativeInsights: InsightsSchema,
	listUserLists: UserListsEnvelopeSchema,
	createUserList: UserListsEnvelopeSchema,
	updateUserListContacts: DeleteResultSchema,
	offlineConversions: DeleteResultSchema,
	getPlaybookCampaign: PlaybookEnvelopeSchema,
	createPlaybookCampaign: PlaybookEnvelopeSchema,
	updatePlaybookCampaign: PlaybookEnvelopeSchema,
	deletePlaybookCampaign: DeleteResultSchema,
	getUser: UserEnvelopeSchema,
	updateUser: UserEnvelopeSchema,
} as const;
