import { z } from 'zod';

const CauseSchema = z.object({
	id: z.number().describe('Cause ID.'),
	name: z.string().describe('Cause name.'),
	logo: z.string().nullable().describe('Cause logo URL.'),
	color: z.string().describe('Cause color in hexadecimal format.'),
});

const NonProfitSchema = z.object({
	ein: z.string().describe('Employer Identification Number.'),
	name: z.string().describe('Organization name.'),
	website: z.string().nullable().describe('Organization website URL.'),
	city: z.string().describe('Organization city.'),
	state: z.string().describe('Organization state.'),
	public_path: z.string().describe('Daffy public profile path.'),
	public_url: z.string().describe('Daffy public profile URL.'),
	latitude: z.number().nullable().optional().describe('Organization latitude.'),
	longitude: z
		.number()
		.nullable()
		.optional()
		.describe('Organization longitude.'),
	logo: z.string().nullable().describe('Organization logo URL.'),
	cause: CauseSchema.describe('Primary charitable cause.'),
	causes: z.array(CauseSchema).describe('All charitable causes.'),
});

const UserSummarySchema = z.object({
	id: z.number().describe('User ID.'),
	name: z.string().describe('User name.'),
	avatar: z.string().nullable().describe('User avatar URL.'),
	slug: z.string().describe('User profile slug.'),
});

const FundSchema = z.object({
	id: z.number().describe('Fund ID.'),
	name: z.string().describe('Fund name.'),
	summary: z.string().describe('Fund summary.'),
	causes: z.array(CauseSchema).describe('Fund charitable causes.'),
	users: z.array(UserSummarySchema).describe('Fund members.'),
});

const UserSchema = UserSummarySchema.extend({
	cover_image: z.string().nullable().describe('User cover image URL.'),
	fund_name: z.string().describe('User fund name.'),
	current_fund: FundSchema.describe('Current donor-advised fund.'),
	follows_user: z.boolean().describe('Whether the viewer follows this user.'),
	follows_viewer: z.boolean().describe('Whether this user follows the viewer.'),
	onboarding_status: z.string().describe('User onboarding status.'),
});

const GiftSchema = z.object({
	name: z.string().describe('Gift beneficiary name.'),
	amount: z.number().describe('Gift amount in US dollars.'),
	message: z.string().nullable().describe('Gift message.'),
	code: z.string().uuid().describe('Unique gift code.'),
	ein: z.string().nullable().describe('Associated nonprofit EIN.'),
	seen: z.boolean().describe('Whether the gift was seen.'),
	status: z
		.enum(['new', 'accepted', 'denied', 'claimed'])
		.describe('Gift status.'),
	updated_at: z.string().describe('Gift status update timestamp.'),
	created_at: z.string().describe('Gift creation timestamp.'),
	claimed: z.boolean().describe('Whether the gift was claimed.'),
	url: z.string().describe('Shareable gift URL.'),
});

const ContributionSchema = z.object({
	units: z.number().describe('Number of contributed units.'),
	type: z.string().describe('Contribution payment type.'),
	status: z.string().describe('Contribution status.'),
	valuation: z.number().describe('Unit valuation in US dollars.'),
	currency: z.string().describe('Contributed currency or symbol.'),
	frequency: z.string().describe('Contribution frequency.'),
	created_at: z.string().describe('Contribution creation timestamp.'),
	received_at: z
		.string()
		.nullable()
		.describe('Contribution received timestamp.'),
	completed_at: z
		.string()
		.nullable()
		.describe('Contribution completion timestamp.'),
	id: z.number().describe('Contribution ID.'),
});

// Donation list responses contain a compact nonprofit record. The full
// nonprofit lookup response additionally includes a primary cause and causes.
const DonationNonProfitSchema = z.object({
	ein: z.string().describe('Employer Identification Number.'),
	name: z.string().describe('Organization name.'),
	website: z.string().nullable().describe('Organization website URL.'),
	city: z.string().describe('Organization city.'),
	state: z.string().describe('Organization state.'),
	public_path: z.string().describe('Daffy public profile path.'),
	public_url: z.string().describe('Daffy public profile URL.'),
	logo: z.string().nullable().describe('Organization logo URL.'),
	cause_id: z.number().optional().describe('Primary charitable cause ID.'),
});

const DonationSchema = z.object({
	id: z.number().describe('Donation ID.'),
	amount: z.number().optional().describe('Donation amount in US dollars.'),
	user_id: z.number().optional().describe('Donating user ID.'),
	status: z.string().describe('Donation status.'),
	note: z.string().nullable().describe('Public donation note.'),
	scheduled_donation_id: z
		.number()
		.nullable()
		.optional()
		.describe('Scheduled donation ID.'),
	visibility: z.string().optional().describe('Donation visibility.'),
	created_at: z.string().describe('Donation creation timestamp.'),
	mailed_at: z.string().nullable().describe('Donation mailed timestamp.'),
	non_profit: DonationNonProfitSchema.describe('Recipient nonprofit.'),
	fund: z
		.object({ id: z.number(), name: z.string() })
		.optional()
		.describe('Donor fund.'),
	user: UserSummarySchema.extend({ city: z.string().nullable() })
		.optional()
		.describe('Donating user.'),
});

const PaginationMetaSchema = z.object({
	count: z.number().describe('Number of records.'),
	page: z.number().describe('Current page number.'),
	last: z.number().describe('Last available page number.'),
});

function paginated<Item extends z.ZodType>(item: Item) {
	return z.object({
		items: z.array(item).describe('Page of returned records.'),
		meta: PaginationMetaSchema.describe('Pagination metadata.'),
	});
}

const PageInputSchema = z.object({
	page: z.number().int().positive().optional(),
});

export const DaffyEndpointInputSchemas = {
	createGift: z.object({
		name: z.string().trim().min(1),
		amount: z.number().min(18),
	}),
	getBalance: z.object({}),
	getContributions: PageInputSchema,
	getDonations: PageInputSchema,
	getGiftByCode: z.object({ code: z.string().uuid() }),
	getGifts: PageInputSchema,
	getNonProfitByEin2: z.object({ ein: z.string().trim().min(1) }),
	getUserCauses: z.object({ userId: z.number().int().positive() }),
	getUserDonations: PageInputSchema.extend({
		userId: z.number().int().positive(),
	}),
	getUserProfile: z.object({}),
	getUserByUsername: z.object({ username: z.string().trim().min(1) }),
	searchNonProfits: PageInputSchema.extend({
		causeId: z.number().int().positive().optional(),
		query: z.string().trim().min(1).optional(),
	}),
} as const;

export const DaffyEndpointOutputSchemas = {
	createGift: GiftSchema,
	getBalance: z.object({
		amount: z.number(),
		pending_deposit_balance: z.number(),
		portfolio_balance: z.number(),
		available_balance: z.number(),
	}),
	getContributions: paginated(ContributionSchema),
	getDonations: paginated(DonationSchema),
	getGiftByCode: GiftSchema,
	getGifts: paginated(GiftSchema),
	getNonProfitByEin2: NonProfitSchema,
	getUserCauses: z.array(CauseSchema),
	getUserDonations: paginated(DonationSchema),
	getUserProfile: UserSchema,
	getUserByUsername: UserSchema,
	searchNonProfits: paginated(NonProfitSchema),
} as const;

export type DaffyEndpointInputs = {
	[K in keyof typeof DaffyEndpointInputSchemas]: z.infer<
		(typeof DaffyEndpointInputSchemas)[K]
	>;
};
export type DaffyEndpointOutputs = {
	[K in keyof typeof DaffyEndpointOutputSchemas]: z.infer<
		(typeof DaffyEndpointOutputSchemas)[K]
	>;
};
