import { z } from 'zod';

// ─── Shared sub-schemas ───────────────────────────────────────────────────────

const UserIdentifierSchema = z.object({
	hashedEmail: z
		.string()
		.optional()
		.describe(
			'SHA-256 hashed email address, lowercased and trimmed before hashing',
		),
	hashedPhoneNumber: z
		.string()
		.optional()
		.describe(
			'SHA-256 hashed phone number in E.164 format (e.g. +1234567890)',
		),
	mobileId: z.string().optional().describe('Mobile device advertising ID'),
	thirdPartyUserId: z
		.string()
		.optional()
		.describe('Third-party user identifier'),
	addressInfo: z
		.object({
			hashedFirstName: z.string().optional(),
			hashedLastName: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			countryCode: z.string().optional(),
			postalCode: z.string().optional(),
			hashedStreetAddress: z.string().optional(),
		})
		.optional()
		.describe('Address-based user identifier with SHA-256 hashed fields'),
});

// ─── Input schemas ────────────────────────────────────────────────────────────

const CampaignsGetByIdInputSchema = z.object({
	customerId: z
		.string()
		.describe(
			'Google Ads customer ID (digits only, no dashes). e.g. "1234567890"',
		),
	campaignId: z.string().describe('The campaign ID to retrieve'),
});

export type CampaignsGetByIdInput = z.infer<typeof CampaignsGetByIdInputSchema>;

const CampaignsGetByNameInputSchema = z.object({
	customerId: z
		.string()
		.describe(
			'Google Ads customer ID (digits only, no dashes). e.g. "1234567890"',
		),
	campaignName: z.string().describe('The exact campaign name to search for'),
});

export type CampaignsGetByNameInput = z.infer<
	typeof CampaignsGetByNameInputSchema
>;

const CustomerListsGetManyInputSchema = z.object({
	customerId: z
		.string()
		.describe(
			'Google Ads customer ID (digits only, no dashes). e.g. "1234567890"',
		),
	pageSize: z
		.number()
		.optional()
		.describe('Maximum number of results to return. Defaults to 1000.'),
	pageToken: z
		.string()
		.optional()
		.describe('Page token for pagination from a previous response'),
});

export type CustomerListsGetManyInput = z.infer<
	typeof CustomerListsGetManyInputSchema
>;

const CustomerListsCreateInputSchema = z.object({
	customerId: z
		.string()
		.describe(
			'Google Ads customer ID (digits only, no dashes). e.g. "1234567890"',
		),
	listName: z.string().describe('Name for the new customer list'),
	description: z
		.string()
		.optional()
		.describe('Description of the customer list'),
	membershipLifeSpan: z
		.number()
		.optional()
		.describe(
			'Number of days a user stays in the list after last contact. Defaults to 10000 (no expiry).',
		),
	uploadKeyType: z
		.enum(['CONTACT_INFO', 'CRM_ID', 'MOBILE_ADVERTISING_ID'])
		.optional()
		.describe(
			'The type of key used for matching. Defaults to CONTACT_INFO.',
		),
});

export type CustomerListsCreateInput = z.infer<
	typeof CustomerListsCreateInputSchema
>;

const CustomerListsAddOrRemoveInputSchema = z.object({
	customerId: z
		.string()
		.describe(
			'Google Ads customer ID (digits only, no dashes). e.g. "1234567890"',
		),
	userListResourceName: z
		.string()
		.describe(
			'Resource name of the user list. e.g. "customers/1234567890/userLists/123456"',
		),
	operations: z
		.array(
			z.object({
				create: z
					.object({
						userIdentifiers: z.array(UserIdentifierSchema),
					})
					.optional()
					.describe('Add users to the list'),
				remove: z
					.object({
						userIdentifiers: z.array(UserIdentifierSchema),
					})
					.optional()
					.describe('Remove users from the list'),
			}),
		)
		.describe(
			'List of add/remove operations. Each operation should have either "create" or "remove".',
		),
});

export type CustomerListsAddOrRemoveInput = z.infer<
	typeof CustomerListsAddOrRemoveInputSchema
>;

export const GoogleAdsEndpointInputSchemas = {
	campaignsGetById: CampaignsGetByIdInputSchema,
	campaignsGetByName: CampaignsGetByNameInputSchema,
	customerListsGetMany: CustomerListsGetManyInputSchema,
	customerListsCreate: CustomerListsCreateInputSchema,
	customerListsAddOrRemove: CustomerListsAddOrRemoveInputSchema,
} as const;

export type GoogleAdsEndpointInputs = {
	[K in keyof typeof GoogleAdsEndpointInputSchemas]: z.infer<
		(typeof GoogleAdsEndpointInputSchemas)[K]
	>;
};

// ─── Output schemas ───────────────────────────────────────────────────────────

const CampaignSchema = z.object({
	resourceName: z.string().optional(),
	id: z.string().optional(),
	name: z.string().optional(),
	status: z
		.enum(['ENABLED', 'PAUSED', 'REMOVED', 'UNKNOWN', 'UNSPECIFIED'])
		.optional(),
	advertisingChannelType: z.string().optional(),
	biddingStrategyType: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	campaignBudget: z.string().optional(),
	servingStatus: z.string().optional(),
	optimizationScore: z.number().optional(),
});

const CampaignBudgetSchema = z.object({
	resourceName: z.string().optional(),
	id: z.string().optional(),
	name: z.string().optional(),
	amountMicros: z.string().optional(),
	deliveryMethod: z.string().optional(),
	status: z.string().optional(),
});

const CampaignRowSchema = z.object({
	campaign: CampaignSchema.optional(),
	campaignBudget: CampaignBudgetSchema.optional(),
});

const CampaignSearchResponseSchema = z.object({
	results: z.array(CampaignRowSchema).optional(),
	fieldMask: z.string().optional(),
	totalResultsCount: z.string().optional(),
	nextPageToken: z.string().optional(),
});

export type CampaignsGetByIdResponse = z.infer<
	typeof CampaignSearchResponseSchema
>;
export type CampaignsGetByNameResponse = z.infer<
	typeof CampaignSearchResponseSchema
>;

const UserListSchema = z.object({
	resourceName: z.string().optional(),
	id: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	type: z.string().optional(),
	membershipStatus: z.string().optional(),
	sizeForDisplay: z.string().optional(),
	sizeForSearch: z.string().optional(),
	membershipLifeSpan: z.string().optional(),
	readOnly: z.boolean().optional(),
});

const UserListRowSchema = z.object({
	userList: UserListSchema.optional(),
});

const UserListSearchResponseSchema = z.object({
	results: z.array(UserListRowSchema).optional(),
	fieldMask: z.string().optional(),
	totalResultsCount: z.string().optional(),
	nextPageToken: z.string().optional(),
});

export type CustomerListsGetManyResponse = z.infer<
	typeof UserListSearchResponseSchema
>;

const MutateUserListsResponseSchema = z.object({
	results: z
		.array(
			z.object({
				resourceName: z.string().optional(),
			}),
		)
		.optional(),
});

export type CustomerListsCreateResponse = z.infer<
	typeof MutateUserListsResponseSchema
>;

const AddOrRemoveResponseSchema = z.object({
	job: z
		.object({
			resourceName: z.string().optional(),
			id: z.string().optional(),
			status: z.string().optional(),
			type: z.string().optional(),
			failureReason: z.string().optional(),
		})
		.optional(),
	message: z.string().optional(),
});

export type CustomerListsAddOrRemoveResponse = z.infer<
	typeof AddOrRemoveResponseSchema
>;

export type GoogleAdsEndpointOutputs = {
	campaignsGetById: CampaignsGetByIdResponse;
	campaignsGetByName: CampaignsGetByNameResponse;
	customerListsGetMany: CustomerListsGetManyResponse;
	customerListsCreate: CustomerListsCreateResponse;
	customerListsAddOrRemove: CustomerListsAddOrRemoveResponse;
};

export const GoogleAdsEndpointOutputSchemas = {
	campaignsGetById: CampaignSearchResponseSchema,
	campaignsGetByName: CampaignSearchResponseSchema,
	customerListsGetMany: UserListSearchResponseSchema,
	customerListsCreate: MutateUserListsResponseSchema,
	customerListsAddOrRemove: AddOrRemoveResponseSchema,
} as const;
