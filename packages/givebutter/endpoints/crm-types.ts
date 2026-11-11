import { z } from 'zod';

const RouteId = z.union([z.string(), z.number()]).refine((value) => {
	const text = String(value);
	return (
		text.length > 0 && !['.', '..'].includes(text) && !/[\\/'"]/u.test(text)
	);
}, 'Route identifiers must be safe path segments');

// The provider leaves several nested CRM value shapes open; retain those values while
// validating the documented top-level resource fields below.
const JsonObject = z.object({}).loose();
const NullableString = z.string().nullable();
const PageInput = z.object({ page: z.number().int().min(1).optional() });
const ContactType = z.enum(['individual', 'company']);
const Gender = z.enum(['male', 'female', 'other']);
const ActivityType = z.enum([
	'email',
	'meeting',
	'note',
	'phone_call',
	'sms',
	'completed_task',
	'volunteer_activity',
]);

const ContactResource = z
	.object({
		id: z.string(),
		external_id: NullableString.optional(),
		type: ContactType.optional(),
		first_name: NullableString.optional(),
		last_name: NullableString.optional(),
		primary_email: NullableString.optional(),
		primary_phone: NullableString.optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.loose();

const ActivityResource = z
	.object({
		id: z.string(),
		type: ActivityType.optional(),
		created_at: z.string().optional(),
	})
	.loose();
const FundResource = z
	.object({ id: z.string(), name: z.string().optional() })
	.loose();
const HouseholdResource = z
	.object({ id: z.string(), name: z.string().optional() })
	.loose();

const PageSchema = z.object({
	data: z.array(JsonObject),
	links: z.object({
		first: NullableString,
		last: NullableString,
		prev: NullableString,
		next: NullableString,
	}),
	meta: z.object({
		current_page: z.number().int().min(1),
		from: z.number().int().min(1).nullable(),
		last_page: z.number().int().min(1),
		links: z.array(
			z.object({ url: NullableString, label: z.string(), active: z.boolean() }),
		),
		path: NullableString,
		per_page: z.number().int().min(0),
		to: z.number().int().min(1).nullable(),
		total: z.number().int().min(0),
	}),
});

const ContactFields = {
	first_name: z.string().max(255).nullable().optional(),
	last_name: z.string().max(255).nullable().optional(),
	middle_name: z.string().max(255).nullable().optional(),
	preferred_name: z.string().max(255).nullable().optional(),
	gender: Gender.optional(),
	pronouns: z.string().max(255).nullable().optional(),
	suffix: z.string().max(32).nullable().optional(),
	prefix: z.string().max(32).nullable().optional(),
	type: ContactType.optional(),
	company_name: z.string().max(255).nullable().optional(),
	employer: z.string().max(255).nullable().optional(),
	company: z.string().max(255).nullable().optional(),
	title: z.string().max(255).nullable().optional(),
	twitter_url: NullableString.optional(),
	linkedin_url: NullableString.optional(),
	facebook_url: NullableString.optional(),
	tiktok_url: NullableString.optional(),
	instagram_url: NullableString.optional(),
	note: NullableString.optional(),
	external_id: z.string().max(255).nullable().optional(),
	contact_since: NullableString.optional(),
	dob: z.string().optional(),
	custom_fields: z.array(z.string()).nullable().optional(),
	tags: z.array(z.string()).nullable().optional(),
} as const;

const ContactCreateInputSchema = z.object({
	...ContactFields,
	primary_email: NullableString.optional(),
	primary_phone: NullableString.optional(),
	address_1: z.string().max(255).nullable().optional(),
	address_2: z.string().max(255).nullable().optional(),
	city: z.string().max(255).nullable().optional(),
	state: z.string().max(255).nullable().optional(),
	zipcode: z.string().max(255).nullable().optional(),
	country: NullableString.optional(),
	primary_address_1: z.string().max(255).nullable().optional(),
	primary_address_2: z.string().max(255).nullable().optional(),
	primary_city: z.string().max(255).nullable().optional(),
	primary_state: z.string().max(255).nullable().optional(),
	primary_zipcode: z.string().max(255).nullable().optional(),
	primary_country: NullableString.optional(),
	emails: z.array(z.string()).nullable().optional(),
	phones: z.array(z.string()).nullable().optional(),
	email_subscription: z.boolean().nullable().optional(),
	phone_subscription: z.boolean().nullable().optional(),
	address_subscription: z.boolean().nullable().optional(),
	addresses: z.array(JsonObject).nullable().optional(),
	force_create: z.boolean().optional(),
});

const ContactUpdateInputSchema = z.object({
	contact: RouteId,
	...ContactFields,
	website_url: z.string().max(2048).nullable().optional(),
	bio: z.string().max(2000).nullable().optional(),
	email_opt_in: z.boolean().nullable().optional(),
	sms_opt_in: z.boolean().nullable().optional(),
	address_subscription: z.boolean().nullable().optional(),
	remove_emails: z.array(z.string()).nullable().optional(),
	remove_phones: z.array(z.string()).nullable().optional(),
	remove_address_ids: z.array(z.number().int()).nullable().optional(),
	emails: z.array(JsonObject).nullable().optional(),
	phones: z.array(JsonObject).nullable().optional(),
	addresses: z.array(JsonObject).nullable().optional(),
});

const ContactPathInputSchema = z.object({ contact: RouteId });
const ContactActivityPathInputSchema = z.object({
	contact: RouteId,
	activity: RouteId,
});
const TagInputSchema = z.object({
	contact: RouteId,
	tags: z.array(z.string().max(64)).min(1),
});
const HouseholdPathInputSchema = z.object({ household: RouteId });
const HouseholdContactPathInputSchema = z.object({
	household: RouteId,
	contact: RouteId,
});
const FundPathInputSchema = z.object({ fund: RouteId });

export const GivebutterCrmEndpointInputSchemas = {
	listContacts: z
		.object({
			type: ContactType.optional(),
			createdAfter: z.string().optional(),
			createdBefore: z.string().optional(),
			updatedAfter: z.string().optional(),
			updatedBefore: z.string().optional(),
			totalContributionsMin: z.number().optional(),
			totalContributionsMax: z.number().optional(),
			recurringContributionsMin: z.number().optional(),
			recurringContributionsMax: z.number().optional(),
			tags: z.string().optional(),
			sortBy: z
				.enum([
					'name_or_company',
					'primary_email',
					'point_of_contact',
					'created_at',
					'total_contributions',
					'recurring_contributions',
					'last_donation_amount',
				])
				.optional(),
			sortByDesc: z
				.enum([
					'name_or_company',
					'primary_email',
					'point_of_contact',
					'created_at',
					'total_contributions',
					'recurring_contributions',
					'last_donation_amount',
				])
				.optional(),
			email: z.string().optional(),
			primaryEmail: z.string().optional(),
			firstName: z.string().max(1000).optional(),
			lastName: z.string().max(1000).optional(),
		})
		.extend(PageInput.shape),
	createContact: ContactCreateInputSchema,
	getContact: ContactPathInputSchema,
	updateContact: ContactUpdateInputSchema,
	deleteContact: ContactPathInputSchema,
	restoreContact: ContactPathInputSchema,
	listActivities: z
		.object({ contact: RouteId, type: ActivityType.optional() })
		.extend(PageInput.shape),
	createActivity: z.object({
		contact: RouteId,
		type: ActivityType,
		note: NullableString.optional(),
		subject: z.string().max(255).nullable().optional(),
		occurred_at: NullableString.optional(),
		timezone: z.string().max(255).nullable().optional(),
	}),
	getActivity: ContactActivityPathInputSchema,
	updateActivity: ContactActivityPathInputSchema,
	deleteActivity: ContactActivityPathInputSchema,
	addTags: TagInputSchema,
	removeTags: TagInputSchema,
	syncTags: TagInputSchema,
	listFunds: z.object({}).extend(PageInput.shape),
	createFund: z.object({
		name: z.string().max(255),
		code: NullableString.optional(),
	}),
	getFund: FundPathInputSchema,
	updateFund: z.object({
		fund: RouteId,
		name: z.string().max(255),
		code: NullableString.optional(),
	}),
	deleteFund: FundPathInputSchema,
	listHouseholds: z.object({
		headContactId: z.string().optional(),
		contacts: z.string().optional(),
		query: z.string().optional(),
		sortBy: z.string().optional(),
		sortByDesc: z.string().optional(),
		// `page` is the only pagination query parameter documented by Givebutter's
		// OpenAPI contract; the other paginated responses expose navigation links only.
		page: z.number().int().min(1).optional(),
	}),
	createHousehold: z.object({
		name: z.string().max(255),
		head_contact_id: z.number().int().nullable().optional(),
		note: NullableString.optional(),
		envelope_name: z.string().max(255).nullable().optional(),
	}),
	getHousehold: HouseholdPathInputSchema,
	updateHousehold: z.object({
		household: RouteId,
		name: z.string().max(255).optional(),
		head_contact_id: z.number().int().nullable().optional(),
		note: NullableString.optional(),
		envelope_name: z.string().max(255).nullable().optional(),
	}),
	deleteHousehold: HouseholdPathInputSchema,
	listHouseholdContacts: HouseholdPathInputSchema.extend(PageInput.shape),
	addHouseholdContact: z.object({
		household: RouteId,
		contact_id: z.number().int(),
	}),
	getHouseholdContact: HouseholdContactPathInputSchema,
	removeHouseholdContact: HouseholdContactPathInputSchema,
} as const;

export const GivebutterCrmEndpointOutputSchemas = {
	listContacts: PageSchema.extend({ data: z.array(ContactResource) }),
	createContact: ContactResource,
	getContact: ContactResource,
	updateContact: ContactResource,
	deleteContact: z.void(),
	restoreContact: ContactResource,
	listActivities: PageSchema.extend({ data: z.array(ActivityResource) }),
	createActivity: ActivityResource,
	getActivity: ActivityResource,
	updateActivity: ActivityResource,
	deleteActivity: z.void(),
	addTags: JsonObject,
	removeTags: JsonObject,
	syncTags: JsonObject,
	listFunds: PageSchema.extend({ data: z.array(FundResource) }),
	createFund: FundResource,
	getFund: FundResource,
	updateFund: FundResource,
	deleteFund: z.void(),
	listHouseholds: z.array(HouseholdResource),
	createHousehold: HouseholdResource,
	getHousehold: HouseholdResource,
	updateHousehold: HouseholdResource,
	deleteHousehold: z.void(),
	listHouseholdContacts: PageSchema,
	addHouseholdContact: JsonObject,
	getHouseholdContact: JsonObject,
	removeHouseholdContact: JsonObject,
} as const;

export type GivebutterCrmEndpointInputs = {
	[K in keyof typeof GivebutterCrmEndpointInputSchemas]: z.infer<
		(typeof GivebutterCrmEndpointInputSchemas)[K]
	>;
};
export type GivebutterCrmEndpointOutputs = {
	[K in keyof typeof GivebutterCrmEndpointOutputSchemas]: z.infer<
		(typeof GivebutterCrmEndpointOutputSchemas)[K]
	>;
};
