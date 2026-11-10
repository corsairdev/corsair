import { z } from 'zod';

/**
 * Referral Rock pages by **offset and count**, and its documented default count
 * is the integer maximum, so an unbounded call returns everything. The plugin
 * leaves the default alone but exposes both fields.
 */
const OffsetSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe(
		'Records to skip, 0-based. Pass `next_offset` from the previous page.',
	);

const CountSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe(
		'Records to return. Referral Rock returns everything matching when this is omitted.',
	);

const DateFromSchema = z
	.string()
	.optional()
	.describe('Only records created after this date.');
const DateToSchema = z
	.string()
	.optional()
	.describe('Only records created before this date.');

const pagingFields = {
	offset: z.number().nullable(),
	total: z.number().nullable(),
	next_offset: z
		.number()
		.nullable()
		.describe('Pass as `offset` to read the next page; null on the last.'),
	message: z
		.string()
		.nullish()
		.describe(
			'Referral Rock’s own note. On a collection it can explain why nothing matched.',
		),
};

const pagingQuery = {
	offset: OffsetSchema,
	count: CountSchema,
	date_from: DateFromSchema,
	date_to: DateToSchema,
};

// ── programs ──────────────────────────────────────────────────────────────

const ProgramsListInputSchema = z.object({
	program_id: z
		.string()
		.optional()
		.describe('A program id; when given, only that program is returned.'),
	offset: OffsetSchema,
	count: CountSchema,
});

export type ProgramsListInput = z.input<typeof ProgramsListInputSchema>;

const ProgramSchema = z
	.object({
		id: z.string().nullish(),
		isActive: z.boolean().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		title: z.string().nullish(),
		memberOffer: z.string().nullish(),
		referralOffer: z.string().nullish(),
		directUrl: z.string().nullish(),
		widgetUrl: z.string().nullish(),
	})
	.loose();

export type ReferralrockProgram = z.infer<typeof ProgramSchema>;

const ProgramsListResponseSchema = z.object({
	programs: z.array(ProgramSchema),
	...pagingFields,
});

export type ProgramsListResponse = z.infer<typeof ProgramsListResponseSchema>;

// ── members ───────────────────────────────────────────────────────────────

/**
 * `sort` takes a fixed set of column names. Referral Rock says an unrecognised
 * value is **silently ignored** and the default used, so the enum is the only
 * way a caller learns a typo.
 */
const MemberSortSchema = z.enum([
	'Member_Views_Desc',
	'Member_Views_Asc',
	'Page_Views_Desc',
	'Page_Views_Asc',
	'Lead_Count_Desc',
	'Lead_Count_Asc',
	'Reward_Issued_Total_Desc',
	'Reward_Issued_Total_Asc',
	'Member_Full_Name_Desc',
	'Member_Full_Name_Asc',
	'Create_Dt_Desc',
	'Create_Dt_Asc',
]);

const MembersListInputSchema = z.object({
	...pagingQuery,
	program_id: z.string().optional().describe('A program id, name or title.'),
	query: z
		.string()
		.optional()
		.describe(
			'A value the member must match on email, internal id, external id or referral code.',
		),
	show_disabled: z
		.boolean()
		.optional()
		.describe('Include disabled members. Defaults to false.'),
	sort: MemberSortSchema.optional(),
});

export type MembersListInput = z.input<typeof MembersListInputSchema>;

const PayoutInfoSchema = z
	.object({
		payoutType: z.string().nullish(),
		useDefaultValues: z.boolean().nullish(),
		email: z.string().nullish(),
	})
	.loose();

const MemberSchema = z
	.object({
		id: z.string().nullish(),
		displayName: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		externalIdentifier: z.string().nullish(),
		dateOfBirth: z.string().nullish(),
		addressLine1: z.string().nullish(),
		addressLine2: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
		countrySubdivision: z.string().nullish(),
		country: z.string().nullish(),
		postalCode: z.string().nullish(),
		disabledFlag: z.boolean().nullish(),
		disabledReason: z.string().nullish(),
		customOverrideURL: z.string().nullish(),
		payoutInfo: PayoutInfoSchema.nullish(),
		customOption1Name: z.string().nullish(),
		customOption1Value: z.string().nullish(),
		customText1Name: z.string().nullish(),
		customText1Value: z.string().nullish(),
		customText2Name: z.string().nullish(),
		customText2Value: z.string().nullish(),
		programId: z.string().nullish(),
		programTitle: z.string().nullish(),
		programName: z.string().nullish(),
		referralCode: z.string().nullish(),
		referralUrl: z.string().nullish(),
		memberUrl: z.string().nullish(),
		emailShares: z.number().nullish(),
		socialShares: z.number().nullish(),
		views: z.number().nullish(),
		referrals: z.number().nullish(),
		lastShare: z.string().nullish(),
		referralsApproved: z.number().nullish(),
		referralsQualified: z.number().nullish(),
		referralsPending: z.number().nullish(),
		referralsApprovedAmount: z.number().nullish(),
		rewardsPendingAmount: z.number().nullish(),
		rewardsIssuedAmount: z.number().nullish(),
		rewardAmountTotal: z.number().nullish(),
		rewards: z.number().nullish(),
		createDt: z.string().nullish(),
		status: z.string().nullish(),
		utmSource: z.string().nullish(),
		utmMedium: z.string().nullish(),
		utmCampaign: z.string().nullish(),
		activatedDate: z.string().nullish(),
		lastActiveDate: z.string().nullish(),
	})
	.loose();

export type ReferralrockMember = z.infer<typeof MemberSchema>;

const MembersListResponseSchema = z.object({
	members: z.array(MemberSchema),
	...pagingFields,
});

export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;

const MembersCreateInputSchema = z.object({
	program_id: z.string().min(1).describe('The program the member joins.'),
	first_name: z.string().min(1),
	email: z.string().min(1).describe('The member’s email address.'),
	last_name: z.string().optional(),
	referral_code: z
		.string()
		.optional()
		.describe(
			'A code the member shares; Referral Rock generates one when omitted.',
		),
	phone: z.string().optional(),
	external_identifier: z
		.string()
		.optional()
		.describe('Your own id, for linking the member to another system.'),
	date_of_birth: z.string().optional(),
	address_line1: z.string().optional(),
	address_line2: z.string().optional(),
	city: z.string().optional(),
	region: z
		.string()
		.optional()
		.describe('A region name or ISO 3166-2 code; requires `country`.'),
	country: z.string().optional().describe('A country name or ISO 3166-2 code.'),
	postal_code: z.string().optional(),
	should_send_email: z
		.boolean()
		.optional()
		.describe('Send the program’s confirmation email. Defaults to false.'),
});

export type MembersCreateInput = z.input<typeof MembersCreateInputSchema>;

const MembersCreateResponseSchema = z.object({
	member: MemberSchema.nullish(),
	message: z.string().nullish(),
});

export type MembersCreateResponse = z.infer<typeof MembersCreateResponseSchema>;

// ── referrals ─────────────────────────────────────────────────────────────

const ReferralSortSchema = z.enum([
	'Create_Dt_Desc',
	'Create_Dt_Asc',
	'Referral_Status_Desc',
	'Referral_Status_Asc',
	'Referral_Amount_Desc',
	'Referral_Amount_Asc',
]);

const ReferralStatusSchema = z
	.string()
	.describe(
		'The referral status, such as `Pending`, `Approved`, `Qualified` or `Denied`.',
	);

const ReferralsListInputSchema = z.object({
	...pagingQuery,
	program_id: z.string().optional(),
	member_id: z.string().optional(),
	status: ReferralStatusSchema.optional(),
	sort: ReferralSortSchema.optional(),
});

export type ReferralsListInput = z.input<typeof ReferralsListInputSchema>;

const ReferralSchema = z
	.object({
		id: z.string().nullish(),
		displayName: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		fullName: z.string().nullish(),
		email: z.string().nullish(),
		externalIdentifier: z.string().nullish(),
		phoneNumber: z.string().nullish(),
		amount: z.number().nullish(),
		amountFormatted: z.string().nullish(),
		preferredContact: z.string().nullish(),
		createDate: z.string().nullish(),
		updateDate: z.string().nullish(),
		source: z.string().nullish(),
		programId: z.string().nullish(),
		programName: z.string().nullish(),
		programTitle: z.string().nullish(),
		referringMemberId: z.string().nullish(),
		referringMemberName: z.string().nullish(),
		memberEmail: z.string().nullish(),
		memberReferralCode: z.string().nullish(),
		memberExternalIdentifier: z.string().nullish(),
		approvedDate: z.string().nullish(),
		qualifiedDate: z.string().nullish(),
		status: z.string().nullish(),
		companyName: z.string().nullish(),
		note: z.string().nullish(),
		publicNote: z.string().nullish(),
		conversionNote: z.string().nullish(),
		customOption1Name: z.string().nullish(),
		customOption2Name: z.string().nullish(),
		customText1Name: z.string().nullish(),
		customText2Name: z.string().nullish(),
		customText3Name: z.string().nullish(),
		customOption1Value: z.string().nullish(),
		customOption2Value: z.string().nullish(),
		customText1Value: z.string().nullish(),
		customText2Value: z.string().nullish(),
		customText3Value: z.string().nullish(),
		utmSource: z.string().nullish(),
		utmMedium: z.string().nullish(),
		utmCampaign: z.string().nullish(),
		addressLine1: z.string().nullish(),
		addressLine2: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
		postalCode: z.string().nullish(),
		country: z.string().nullish(),
	})
	.loose();

export type ReferralrockReferral = z.infer<typeof ReferralSchema>;

const ReferralsListResponseSchema = z.object({
	referrals: z.array(ReferralSchema),
	...pagingFields,
});

export type ReferralsListResponse = z.infer<typeof ReferralsListResponseSchema>;

const PreferredContactSchema = z.enum([
	'email',
	'callMorning',
	'callAfternoon',
	'callEvening',
]);

const ReferralsCreateInputSchema = z.object({
	referral_code: z
		.string()
		.min(1)
		.describe('The referral code of the member who introduced this referral.'),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().optional(),
	phone_number: z.string().optional(),
	preferred_contact: PreferredContactSchema.optional(),
	external_identifier: z
		.string()
		.optional()
		.describe('Your own id, such as an order number.'),
	amount: z
		.number()
		.optional()
		.describe('The order amount, which reward rules can key on.'),
	company_name: z.string().optional(),
	note: z.string().optional(),
	public_note: z.string().optional(),
	custom_option1_name: z.string().optional(),
	custom_option2_name: z.string().optional(),
	custom_text1_name: z.string().optional(),
	custom_text2_name: z.string().optional(),
	custom_text3_name: z.string().optional(),
	custom_option1_value: z.string().optional(),
	custom_option2_value: z.string().optional(),
	custom_text1_value: z.string().optional(),
	custom_text2_value: z.string().optional(),
	custom_text3_value: z.string().optional(),
});

export type ReferralsCreateInput = z.input<typeof ReferralsCreateInputSchema>;

const ReferralsCreateResponseSchema = z.object({
	referral: ReferralSchema.nullish(),
	message: z.string().nullish(),
});

export type ReferralsCreateResponse = z.infer<
	typeof ReferralsCreateResponseSchema
>;

// ── rewards ───────────────────────────────────────────────────────────────

const RewardsListInputSchema = z.object({
	...pagingQuery,
	program_id: z.string().optional(),
	member_id: z.string().optional(),
	query: z.string().optional(),
	status: z
		.string()
		.optional()
		.describe('The reward status, such as `Pending`, `Issued` or `Paid`.'),
	sort: z.string().optional(),
});

export type RewardsListInput = z.input<typeof RewardsListInputSchema>;

const RewardSchema = z
	.object({
		id: z.string().nullish(),
		payoutId: z.string().nullish(),
		payoutDescription: z.string().nullish(),
		programId: z.string().nullish(),
		programName: z.string().nullish(),
		memberId: z.string().nullish(),
		referralId: z.string().nullish(),
		type: z.string().nullish(),
		recipientId: z.string().nullish(),
		recipientName: z.string().nullish(),
		recipientEmailAddress: z.string().nullish(),
		recipientExternalIdentifier: z.string().nullish(),
		externalIdentifier: z.string().nullish(),
		status: z.string().nullish(),
		amount: z.number().nullish(),
		createDate: z.string().nullish(),
		issueDate: z.string().nullish(),
		eligibilityDate: z.string().nullish(),
		description: z.string().nullish(),
		transactionID: z.string().nullish(),
		updateDate: z.string().nullish(),
		referralDisplayName: z.string().nullish(),
		currencyCode: z.string().nullish(),
		source: z.string().nullish(),
		programRewardRuleId: z.string().nullish(),
		paymentType: z.string().nullish(),
		paymentCode: z.string().nullish(),
		completeNote: z.string().nullish(),
		reason: z.string().nullish(),
		reasonOther: z.string().nullish(),
	})
	.loose();

export type ReferralrockReward = z.infer<typeof RewardSchema>;

const RewardsListResponseSchema = z.object({
	rewards: z.array(RewardSchema),
	...pagingFields,
});

export type RewardsListResponse = z.infer<typeof RewardsListResponseSchema>;

const RewardsCreateInputSchema = z.object({
	member_id: z.string().min(1).describe('The member the reward is for.'),
	amount: z.number().min(0).describe('The reward amount.'),
	payout_id: z.string().optional().describe('The payout type to issue.'),
	description: z.string().optional(),
	eligibility_date: z
		.string()
		.optional()
		.describe('When the reward becomes eligible, as ISO 8601.'),
	referral_id: z
		.string()
		.optional()
		.describe('The referral the reward is attributed to.'),
});

export type RewardsCreateInput = z.input<typeof RewardsCreateInputSchema>;

const RewardsCreateResponseSchema = z.object({
	reward: RewardSchema.nullish(),
	message: z.string().nullish(),
});

export type RewardsCreateResponse = z.infer<typeof RewardsCreateResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type ReferralrockEndpointInputs = {
	programsList: ProgramsListInput;
	membersList: MembersListInput;
	membersCreate: MembersCreateInput;
	referralsList: ReferralsListInput;
	referralsCreate: ReferralsCreateInput;
	rewardsList: RewardsListInput;
	rewardsCreate: RewardsCreateInput;
};

export type ReferralrockEndpointOutputs = {
	programsList: ProgramsListResponse;
	membersList: MembersListResponse;
	membersCreate: MembersCreateResponse;
	referralsList: ReferralsListResponse;
	referralsCreate: ReferralsCreateResponse;
	rewardsList: RewardsListResponse;
	rewardsCreate: RewardsCreateResponse;
};

export const ReferralrockEndpointInputSchemas = {
	programsList: ProgramsListInputSchema,
	membersList: MembersListInputSchema,
	membersCreate: MembersCreateInputSchema,
	referralsList: ReferralsListInputSchema,
	referralsCreate: ReferralsCreateInputSchema,
	rewardsList: RewardsListInputSchema,
	rewardsCreate: RewardsCreateInputSchema,
} as const;

export const ReferralrockEndpointOutputSchemas = {
	programsList: ProgramsListResponseSchema,
	membersList: MembersListResponseSchema,
	membersCreate: MembersCreateResponseSchema,
	referralsList: ReferralsListResponseSchema,
	referralsCreate: ReferralsCreateResponseSchema,
	rewardsList: RewardsListResponseSchema,
	rewardsCreate: RewardsCreateResponseSchema,
} as const;
