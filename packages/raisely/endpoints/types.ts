import { z } from 'zod';

/** Raisely pages by offset; the docs document `limit` but no maximum. */
const LimitSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Records per page. Raisely applies its own default when omitted.');

const OffsetSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe(
		'Records to skip. Pass the `next_offset` from the previous page rather than computing it.',
	);

const SearchSchema = z.string().optional().describe('A search phrase.');

const SortSchema = z
	.string()
	.optional()
	.describe('The attribute to sort on, used with `order`.');

const OrderSchema = z
	.enum(['asc', 'desc'])
	.optional()
	.describe('The sort direction; only applied when `sort` is also set.');

const PrivateSchema = z
	.boolean()
	.optional()
	.describe(
		'Return the full record. Only meaningful with a token that can see private fields.',
	);

/** Every list query shares these. */
const listQueryFields = {
	limit: LimitSchema,
	offset: OffsetSchema,
	q: SearchSchema,
	sort: SortSchema,
	order: OrderSchema,
	private: PrivateSchema,
};

/** The `pagination` block Raisely returns on every collection. */
export const PaginationSchema = z
	.object({
		total: z.number().nullish(),
		pages: z.number().nullish(),
		offset: z.number().nullish(),
		limit: z.number().nullish(),
		// Raisely sends `false`, not null, when there is no page on that side.
		prevUrl: z.union([z.string(), z.boolean()]).nullish(),
		nextUrl: z.union([z.string(), z.boolean()]).nullish(),
	})
	.loose();

export type RaiselyPagination = z.infer<typeof PaginationSchema>;

/**
 * `next_offset` and `total` are declared rather than added by a transform,
 * because the docs generator reads a transform's input side and would omit them.
 */
const pagingFields = {
	pagination: PaginationSchema.nullish(),
	next_offset: z
		.number()
		.nullable()
		.describe('Pass as `offset` to read the next page; null on the last.'),
	total: z.number().nullable(),
};

/** One designation's share of a split donation, in cents. */
export const AllocationSchema = z
	.object({
		amount: z.number().nullish(),
		amountRefunded: z.number().nullish(),
		campaignAmount: z.number().nullish(),
		campaignAmountRefunded: z.number().nullish(),
		designationUuid: z.string().nullish(),
		designation: z
			.object({
				uuid: z.string().nullish(),
				name: z.string().nullish(),
				publicName: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

/** One item a donation paid for: a ticket, a registration or a product. */
export const DonationItemSchema = z
	.object({
		amount: z.number().nullish(),
		amountRefunded: z.number().nullish(),
		attendance: z.string().nullish(),
		quantity: z.number().nullish(),
		description: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

/** A user reference embedded in a profile or donation. */
export const NestedUserSchema = z
	.object({
		uuid: z.string().nullish(),
		email: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		fullName: z.string().nullish(),
		photoUrl: z.string().nullish(),
	})
	.loose();

/**
 * Raisely returns the account's own custom values under `public` and `private`
 * maps with no fixed shape, so each value is a scalar, a list of scalars (a
 * multi-select field) or one nested map; the keys are the account's.
 */
export const CustomValuesSchema = z
	.record(
		z.string(),
		z
			.union([
				z.string(),
				z.number(),
				z.boolean(),
				// A theme setting nests, so one level of object is allowed.
				z.record(
					z.string(),
					z.union([z.string(), z.number(), z.boolean()]).nullish(),
				),
				z.array(z.union([z.string(), z.number(), z.boolean()])),
			])
			.nullish(),
	)
	.nullish();

/**
 * The same maps as Raisely returns them. A campaign's `config` nests objects
 * inside arrays several levels deep (menus, donation amounts, page layouts), and
 * an account's custom fields can hold lists, so the output side takes any JSON
 * value. Inputs keep `CustomValuesSchema`.
 */
const CustomValuesOutputSchema = z
	// unknown: the keys and value shapes are the account's own configuration.
	.record(z.string(), z.unknown())
	.nullish();

// ── campaigns ─────────────────────────────────────────────────────────────

const CampaignsListInputSchema = z.object({
	...listQueryFields,
	path: z.string().optional().describe('Only the campaign with this path.'),
	mode: z.string().optional().describe('The campaign mode.'),
	status: z.string().optional().describe('The campaign status.'),
	prune_config: z
		.boolean()
		.optional()
		.describe('Drop `config` from each record to shrink the response.'),
	include_tags: z.boolean().optional(),
});

export type CampaignsListInput = z.input<typeof CampaignsListInputSchema>;

const CampaignProfileSchema = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		path: z.string().nullish(),
		photoUrl: z.string().nullish(),
	})
	.loose();

const CampaignSchema = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		path: z.string().nullish(),
		url: z.string().nullish(),
		mode: z.string().nullish(),
		status: z.string().nullish(),
		currency: z.string().nullish(),
		goal: z.number().nullish(),
		total: z.number().nullish(),
		totalPercent: z.number().nullish(),
		grandTotal: z.number().nullish(),
		version: z.string().nullish(),
		theme: z.string().nullish(),
		primaryDomain: z.string().nullish(),
		organisationUuid: z.string().nullish(),
		campaignEndsAt: z.string().nullish(),
		createdAt: z.string().nullish(),
		deletedAt: z.string().nullish(),
		defaultDesignation: z.string().nullish(),
		isTaxDeductible: z.boolean().nullish(),
		enablePartialTaxReceipting: z.boolean().nullish(),
		allowExperiments: z.boolean().nullish(),
		showRaiselyCheckbox: z.boolean().nullish(),
		publicKey: z.string().nullish(),
		// `privateKey`, the campaign's secret API key, is removed by the shaper.
		profile: CampaignProfileSchema.nullish(),
		urls: z.array(z.string()).nullish(),
		// The campaign's theme settings, which nest: a key can hold another
		// object. It is what `pruneConfig` exists to drop, because it dwarfs
		// every other field.
		config: CustomValuesOutputSchema,
		public: CustomValuesOutputSchema,
		private: CustomValuesOutputSchema,
	})
	.loose();

export type RaiselyCampaign = z.infer<typeof CampaignSchema>;

const CampaignsListResponseSchema = z.object({
	campaigns: z.array(CampaignSchema),
	...pagingFields,
});

export type CampaignsListResponse = z.infer<typeof CampaignsListResponseSchema>;

const CampaignsGetInputSchema = z.object({
	campaign: z
		.string()
		.min(1)
		.describe('The campaign uuid or path, as returned by `campaigns.list`.'),
	private: PrivateSchema,
});

export type CampaignsGetInput = z.input<typeof CampaignsGetInputSchema>;

const CampaignsGetResponseSchema = z.object({ campaign: CampaignSchema });
export type CampaignsGetResponse = z.infer<typeof CampaignsGetResponseSchema>;

// ── donations ─────────────────────────────────────────────────────────────

const DonationsListInputSchema = z.object({
	...listQueryFields,
	campaign: z.string().optional().describe('Only this campaign uuid.'),
	profile: z.string().optional().describe('Only this profile uuid.'),
	user: z.string().optional().describe('Only this user uuid.'),
	organisation: z.string().optional().describe('Only this organisation uuid.'),
	designation: z.string().optional().describe('Only this designation uuid.'),
	subscription: z.string().optional(),
	status: z.string().optional(),
	mode: z.string().optional().describe('`LIVE` or `TEST`.'),
	currency: z.string().optional(),
	type: z.string().optional().describe('The donation type.'),
	is_suspicious: z.boolean().optional(),
});

export type DonationsListInput = z.input<typeof DonationsListInputSchema>;

const NestedProfileSchema = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		path: z.string().nullish(),
		photoUrl: z.string().nullish(),
	})
	.loose();

/** A profile reference as the profile resource itself embeds one. */
const NestedProfileRefSchema = NestedProfileSchema;

const DonationSchema = z
	.object({
		uuid: z.string().nullish(),
		id: z.number().nullish(),
		amount: z.number().nullish(),
		amountRefunded: z.number().nullish(),
		currency: z.string().nullish(),
		currencySymbol: z.string().nullish(),
		campaignCurrency: z.string().nullish(),
		campaignAmount: z.number().nullish(),
		campaignUuid: z.string().nullish(),
		displayTotal: z.number().nullish(),
		donationTotal: z.number().nullish(),
		organisationUuid: z.string().nullish(),
		profileUuid: z.string().nullish(),
		profile: NestedProfileSchema.nullish(),
		date: z.string().nullish(),
		createdAt: z.string().nullish(),
		email: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		fullName: z.string().nullish(),
		preferredName: z.string().nullish(),
		message: z.string().nullish(),
		anonymous: z.boolean().nullish(),
		method: z.string().nullish(),
		methodType: z.string().nullish(),
		mode: z.string().nullish(),
		status: z.string().nullish(),
		processing: z.string().nullish(),
		declineCode: z.string().nullish(),
		isFraud: z.boolean().nullish(),
		isSuspicious: z.boolean().nullish(),
		fee: z.number().nullish(),
		feeOptIn: z.boolean().nullish(),
		feeModel: z.string().nullish(),
		gst: z.number().nullish(),
		includesGiftAid: z.boolean().nullish(),
		giftAidText: z.string().nullish(),
		country: z.string().nullish(),
		postcode: z.string().nullish(),
		phoneNumber: z.string().nullish(),
		designationUuid: z.string().nullish(),
		designation: z
			.object({
				uuid: z.string().nullish(),
				name: z.string().nullish(),
				publicName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		allocations: z.array(AllocationSchema).nullish(),
		items: z.array(DonationItemSchema).nullish(),
		itemTypes: z
			.array(z.string())
			.nullish()
			.describe('Any of DONATION, REGISTRATION, TICKET or OTHER.'),
		// unknown: the UTM parameters Raisely recorded on the creating
		// interaction, whose names come from the caller's own links.
		context: z.record(z.string(), z.string()).nullish(),
		public: CustomValuesOutputSchema,
		private: CustomValuesOutputSchema,
	})
	.loose();

export type RaiselyDonation = z.infer<typeof DonationSchema>;

const DonationsListResponseSchema = z.object({
	donations: z.array(DonationSchema),
	...pagingFields,
});

export type DonationsListResponse = z.infer<typeof DonationsListResponseSchema>;

const DonationsGetInputSchema = z.object({
	donation_uuid: z.string().min(1).describe('The donation uuid.'),
	private: PrivateSchema,
});

export type DonationsGetInput = z.input<typeof DonationsGetInputSchema>;

const DonationsGetResponseSchema = z.object({ donation: DonationSchema });
export type DonationsGetResponse = z.infer<typeof DonationsGetResponseSchema>;

/**
 * The body the create route takes. Its five required fields are the ones
 * Raisely rejects a donation without; everything else is optional.
 */
const DonationsCreateInputSchema = z.object({
	amount: z
		.number()
		.int()
		.min(1)
		.describe(
			'The donation total in the smallest currency unit, so 2500 is $25.00.',
		),
	currency: z.string().length(3).describe('A three-letter currency code.'),
	email: z.string().describe('The donor email.'),
	method: z
		.string()
		.min(1)
		.describe(
			'The payment gateway, such as `CREDIT_CARD`, `PAYPAL` or `APPLE_PAY`.',
		),
	type: z
		.enum(['ONLINE', 'OFFLINE'])
		.describe('Whether the donation was taken online or recorded by hand.'),
	campaign_uuid: z
		.string()
		.optional()
		.describe('The campaign the donation belongs to.'),
	profile_uuid: z
		.string()
		.optional()
		.describe('The fundraising profile the donation is credited to.'),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	fullName: z.string().optional(),
	preferredName: z.string().optional(),
	message: z.string().optional(),
	anonymous: z.boolean().optional(),
	date: z.string().optional().describe('An ISO 8601 timestamp.'),
	country: z.string().optional(),
	postcode: z.string().optional(),
	address1: z.string().optional(),
	address2: z.string().optional(),
	phoneNumber: z.string().optional(),
	mode: z.enum(['LIVE', 'TEST']).optional(),
	designation: z
		.string()
		.optional()
		.describe('The designation uuid to attribute the donation to.'),
	public: CustomValuesSchema,
	private: CustomValuesSchema,
});

export type DonationsCreateInput = z.input<typeof DonationsCreateInputSchema>;

const DonationsCreateResponseSchema = z.object({ donation: DonationSchema });
export type DonationsCreateResponse = z.infer<
	typeof DonationsCreateResponseSchema
>;

// ── profiles ──────────────────────────────────────────────────────────────

const ProfilesListInputSchema = z.object({
	...listQueryFields,
	campaign: z
		.string()
		.min(1)
		.describe(
			'The campaign uuid or path. Raisely requires this on `/profiles`.',
		),
	rank: z.boolean().optional().describe('Include the rank fields.'),
	rank_donors: z.boolean().optional(),
	rank_activity_total: z.boolean().optional(),
	rank_activity_time: z.boolean().optional(),
});

export type ProfilesListInput = z.input<typeof ProfilesListInputSchema>;

const ProfileSchema = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		path: z.string().nullish(),
		photoUrl: z.string().nullish(),
		type: z.string().nullish(),
		status: z.string().nullish(),
		description: z.string().nullish(),
		currency: z.string().nullish(),
		goal: z.number().nullish(),
		total: z.number().nullish(),
		grandTotal: z.number().nullish(),
		campaignTotal: z.number().nullish(),
		campaignDisplayTotal: z.number().nullish(),
		activityTotal: z.number().nullish(),
		activityTotalPercent: z.number().nullish(),
		donationCount: z.number().nullish(),
		donationRecordCount: z.number().nullish(),
		uniqueDonors: z.number().nullish(),
		selfDonationTotal: z.number().nullish(),
		nonSelfDonationTotal: z.number().nullish(),
		exerciseTotal: z.number().nullish(),
		exerciseTotalTime: z.number().nullish(),
		exerciseGoal: z.number().nullish(),
		exerciseGoalTime: z.number().nullish(),
		isCampaignProfile: z.boolean().nullish(),
		paid: z.boolean().nullish(),
		shared: z.boolean().nullish(),
		pronouns: z.string().nullish(),
		fundraiserTheme: z.string().nullish(),
		facebookFundraiserId: z.string().nullish(),
		subscriptionCount: z.number().nullish(),
		teamProfileCount: z.number().nullish(),
		organisationProfileCount: z.number().nullish(),
		individualProfileCount: z.number().nullish(),
		campaignUuid: z.string().nullish(),
		userUuid: z.string().nullish(),
		parentUuid: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		user: NestedUserSchema.nullish(),
		parent: NestedProfileRefSchema.nullish(),
		teamProfile: NestedProfileRefSchema.nullish(),
		organisationProfile: NestedProfileRefSchema.nullish(),
		tags: z.array(z.string()).nullish(),
		public: CustomValuesOutputSchema,
		private: CustomValuesOutputSchema,
	})
	.loose();

export type RaiselyProfile = z.infer<typeof ProfileSchema>;

const ProfilesListResponseSchema = z.object({
	profiles: z.array(ProfileSchema),
	...pagingFields,
});

export type ProfilesListResponse = z.infer<typeof ProfilesListResponseSchema>;

const ProfilesGetInputSchema = z.object({
	profile_path: z
		.string()
		.min(1)
		.describe('The profile uuid or path, as returned by `profiles.list`.'),
	private: PrivateSchema,
});

export type ProfilesGetInput = z.input<typeof ProfilesGetInputSchema>;

const ProfilesGetResponseSchema = z.object({ profile: ProfileSchema });
export type ProfilesGetResponse = z.infer<typeof ProfilesGetResponseSchema>;

/**
 * The profile fields a caller may change. The uuid and path are the record's
 * identity and are not writable, which is why they are absent.
 */
const ProfilesUpdateInputSchema = z.object({
	profile_path: z.string().min(1),
	name: z.string().optional(),
	// Raisely clears a field on a PATCH only when it is sent as null; leaving it
	// out keeps the old value.
	description: z
		.string()
		.nullable()
		.optional()
		.describe('The profile description; null clears it.'),
	goal: z.number().int().min(0).optional(),
	photoUrl: z
		.string()
		.nullable()
		.optional()
		.describe('The profile photo URL; null clears it.'),
	pronouns: z
		.string()
		.nullable()
		.optional()
		.describe('The fundraiser pronouns; null clears them.'),
	shared: z.boolean().optional(),
	status: z.string().optional(),
	public: CustomValuesSchema,
	private: CustomValuesSchema,
});

export type ProfilesUpdateInput = z.input<typeof ProfilesUpdateInputSchema>;

const ProfilesUpdateResponseSchema = z.object({ profile: ProfileSchema });
export type ProfilesUpdateResponse = z.infer<
	typeof ProfilesUpdateResponseSchema
>;

// ── designations ──────────────────────────────────────────────────────────

const DesignationsListInputSchema = z.object({
	...listQueryFields,
	campaign: z
		.string()
		.optional()
		.describe('Only the designations of this campaign.'),
	status: z.string().optional(),
});

export type DesignationsListInput = z.input<typeof DesignationsListInputSchema>;

const DesignationSchema = z
	.object({
		uuid: z.string().nullish(),
		name: z.string().nullish(),
		publicName: z.string().nullish(),
		externalId: z.string().nullish(),
		status: z.string().nullish(),
		organisationId: z.number().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type RaiselyDesignation = z.infer<typeof DesignationSchema>;

const DesignationsListResponseSchema = z.object({
	designations: z.array(DesignationSchema),
	...pagingFields,
});

export type DesignationsListResponse = z.infer<
	typeof DesignationsListResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RaiselyEndpointInputs = {
	campaignsList: CampaignsListInput;
	campaignsGet: CampaignsGetInput;
	donationsList: DonationsListInput;
	donationsGet: DonationsGetInput;
	donationsCreate: DonationsCreateInput;
	profilesList: ProfilesListInput;
	profilesGet: ProfilesGetInput;
	profilesUpdate: ProfilesUpdateInput;
	designationsList: DesignationsListInput;
};

export type RaiselyEndpointOutputs = {
	campaignsList: CampaignsListResponse;
	campaignsGet: CampaignsGetResponse;
	donationsList: DonationsListResponse;
	donationsGet: DonationsGetResponse;
	donationsCreate: DonationsCreateResponse;
	profilesList: ProfilesListResponse;
	profilesGet: ProfilesGetResponse;
	profilesUpdate: ProfilesUpdateResponse;
	designationsList: DesignationsListResponse;
};

export const RaiselyEndpointInputSchemas = {
	campaignsList: CampaignsListInputSchema,
	campaignsGet: CampaignsGetInputSchema,
	donationsList: DonationsListInputSchema,
	donationsGet: DonationsGetInputSchema,
	donationsCreate: DonationsCreateInputSchema,
	profilesList: ProfilesListInputSchema,
	profilesGet: ProfilesGetInputSchema,
	profilesUpdate: ProfilesUpdateInputSchema,
	designationsList: DesignationsListInputSchema,
} as const;

export const RaiselyEndpointOutputSchemas = {
	campaignsList: CampaignsListResponseSchema,
	campaignsGet: CampaignsGetResponseSchema,
	donationsList: DonationsListResponseSchema,
	donationsGet: DonationsGetResponseSchema,
	donationsCreate: DonationsCreateResponseSchema,
	profilesList: ProfilesListResponseSchema,
	profilesGet: ProfilesGetResponseSchema,
	profilesUpdate: ProfilesUpdateResponseSchema,
	designationsList: DesignationsListResponseSchema,
} as const;
