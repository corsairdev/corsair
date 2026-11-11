import { z } from 'zod';
import {
	GivebutterCrmEndpointInputSchemas,
	GivebutterCrmEndpointOutputSchemas,
} from './crm-types';
import {
	GivebutterFinancialEndpointInputSchemas,
	GivebutterFinancialEndpointOutputSchemas,
} from './financial-types';

const RouteId = z.union([z.string(), z.number()]).refine((value) => {
	const text = String(value);
	return (
		text.length > 0 && !['.', '..'].includes(text) && !/[\\/'"]/u.test(text)
	);
}, 'Route identifiers must be safe path segments');

// Some documented nested API values have no stable field contract; preserve them without
// making the documented resource envelope itself untyped.
const JsonObject = z.object({}).loose();
const NullableString = z.string().nullable();
const PageInput = z.object({ page: z.number().int().min(1).optional() });
const CampaignType = z.enum(['general', 'collect', 'fundraise', 'event']);
const DiscountCodeType = z.enum(['percentage', 'fixed']);

const CampaignSettings = z
	// Givebutter documents setting values without a value schema, so this remains opaque.
	.object({ name: z.string(), value: z.unknown().optional() })
	.loose();

const CampaignResource = z
	.object({
		id: z.string(),
		code: z.string(),
		account_id: z.string(),
		event_id: z.string(),
		type: z.string(),
		title: z.string(),
		subtitle: NullableString,
		description: NullableString,
		slug: z.string(),
		url: z.string(),
		goal: z.number().int().nullable(),
		raised: z.number(),
		donors: z.number().int(),
		currency: z.string(),
		cover: z.string(),
		status: z.string(),
		timezone: NullableString,
		end_at: NullableString,
		settings: z.array(JsonObject).nullable(),
		created_at: z.string(),
		updated_at: z.string(),
	})
	.partial()
	.extend({ id: z.string() })
	.loose();

const CampaignFields = {
	type: CampaignType.optional(),
	title: z.string().max(150).optional(),
	subtitle: NullableString.optional(),
	description: NullableString.optional(),
	goal: z.number().int().min(0).nullable().optional(),
	end_at: NullableString.optional(),
	slug: z.string().max(255).optional(),
	timezone: NullableString.optional(),
	currency: z.enum(['USD']).optional(),
	settings: z.array(CampaignSettings).nullable().optional(),
} as const;

const CampaignCreateInputSchema = z.object({
	...CampaignFields,
	type: CampaignType,
	title: z.string().max(150),
});
const CampaignUpdateInputSchema = z.object({
	campaign: RouteId,
	published: z.boolean().optional(),
	public: z.boolean().optional(),
	short_code: NullableString.optional(),
	beneficiary_id: z.number().int().nullable().optional(),
	default_appeal_id: z.number().int().nullable().optional(),
	cover: JsonObject.optional(),
	...CampaignFields,
});

const DiscountCodeFields = {
	type: DiscountCodeType.optional(),
	active: z.boolean().optional(),
	amount: z.number().min(1).max(100),
	code: z.string().max(255).optional(),
	items: z.array(z.string()).nullable().optional(),
	include_future: z.boolean().optional(),
	uses: z.number().min(1).nullable().optional(),
	starts_at: NullableString.optional(),
	expires_at: NullableString.optional(),
} as const;

const DiscountCodeCreateInputSchema = z.object({
	campaign: RouteId,
	type: DiscountCodeType,
	active: z.boolean(),
	amount: z.number().min(1).max(100),
	code: z.string().max(255),
	items: z.array(z.string()).nullable().optional(),
	include_future: z.boolean().optional(),
	uses: z.number().min(1).nullable().optional(),
	starts_at: NullableString.optional(),
	expires_at: NullableString.optional(),
});
const DiscountCodeUpdateInputSchema = z.object({
	campaign: RouteId,
	discountCode: RouteId,
	...DiscountCodeFields,
});

const TicketCreateInputSchema = z.object({
	campaign: RouteId,
	name: z.string().max(255),
	price: z.number().min(0),
	total_quantity: z.number().int().min(0).nullable().optional(),
	subtype: z.enum(['physical', 'digital', 'hybrid']).nullable().optional(),
	active: z.boolean().nullable().optional(),
	retail_price: z.number().min(0).nullable().optional(),
	description: z.string().max(5000).nullable().optional(),
	bundle_only: z.boolean().nullable().optional(),
	hide_remaining: z.boolean().nullable().optional(),
	scope: z.enum(['registrant', 'event']).nullable().optional(),
	bundles: z.array(z.string()).nullable().optional(),
	custom_fields: z.array(z.string()).nullable().optional(),
	pictures: z.array(z.string()).nullable().optional(),
});

const PageSchema = z.object({
	data: z.array(JsonObject),
	links: z.object({
		first: NullableString,
		last: NullableString,
		prev: NullableString,
		next: NullableString,
	}),
	meta: z.object({
		current_page: z.number().int(),
		from: z.number().int().nullable(),
		last_page: z.number().int(),
		links: z.array(
			z.object({ url: NullableString, label: z.string(), active: z.boolean() }),
		),
		path: NullableString,
		per_page: z.number().int(),
		to: z.number().int().nullable(),
		total: z.number().int(),
	}),
});
const CampaignPageSchema = PageSchema.extend({
	meta: PageSchema.shape.meta.extend({ unfiltered_total: z.string() }),
});
const EmptyInputSchema = z.object({});
const CampaignPathInputSchema = z.object({ campaign: RouteId });
const CampaignMemberPathInputSchema = z.object({
	campaign: RouteId,
	member: RouteId,
});
const CampaignTeamPathInputSchema = z.object({
	campaign: RouteId,
	team: RouteId,
});
const CampaignTicketPathInputSchema = z.object({
	campaign: RouteId,
	ticketId: RouteId,
});
const DiscountCodePathInputSchema = z.object({
	campaign: RouteId,
	discountCode: RouteId,
});
const TicketPathInputSchema = z.object({ ticket: RouteId });

export const GivebutterEndpointInputSchemas = {
	listCampaigns: z
		.object({ scope: z.string().optional() })
		.extend(PageInput.shape),
	createCampaign: CampaignCreateInputSchema,
	getCampaign: CampaignPathInputSchema,
	updateCampaign: CampaignUpdateInputSchema,
	deleteCampaign: CampaignPathInputSchema,
	listDiscountCodes: CampaignPathInputSchema.extend(PageInput.shape),
	createDiscountCode: DiscountCodeCreateInputSchema,
	getDiscountCode: DiscountCodePathInputSchema,
	updateDiscountCode: DiscountCodeUpdateInputSchema,
	deleteDiscountCode: DiscountCodePathInputSchema,
	listMembers: CampaignPathInputSchema.extend(PageInput.shape),
	getMember: CampaignMemberPathInputSchema,
	deleteMember: CampaignMemberPathInputSchema,
	listTeams: CampaignPathInputSchema.extend(PageInput.shape),
	getTeam: CampaignTeamPathInputSchema,
	deleteTeam: CampaignTeamPathInputSchema,
	listTicketItems: CampaignPathInputSchema.extend(PageInput.shape),
	createTicketItem: TicketCreateInputSchema,
	getTicketItem: CampaignTicketPathInputSchema,
	listTickets: EmptyInputSchema.extend(PageInput.shape),
	getTicket: TicketPathInputSchema,
	getSsoAccount: EmptyInputSchema,
	getSsoCampaign: CampaignPathInputSchema,
	...GivebutterCrmEndpointInputSchemas,
	...GivebutterFinancialEndpointInputSchemas,
} as const;

export const GivebutterEndpointOutputSchemas = {
	listCampaigns: CampaignPageSchema.extend({ data: z.array(CampaignResource) }),
	createCampaign: CampaignResource,
	getCampaign: CampaignResource,
	updateCampaign: CampaignResource,
	deleteCampaign: z.void(),
	listDiscountCodes: PageSchema,
	createDiscountCode: JsonObject,
	getDiscountCode: JsonObject,
	updateDiscountCode: JsonObject,
	deleteDiscountCode: z.void(),
	listMembers: z.union([PageSchema, JsonObject]),
	getMember: JsonObject,
	deleteMember: z.void(),
	listTeams: PageSchema,
	getTeam: JsonObject,
	deleteTeam: z.void(),
	listTicketItems: PageSchema,
	createTicketItem: JsonObject,
	getTicketItem: JsonObject,
	listTickets: PageSchema,
	getTicket: JsonObject,
	getSsoAccount: JsonObject,
	getSsoCampaign: JsonObject,
	...GivebutterCrmEndpointOutputSchemas,
	...GivebutterFinancialEndpointOutputSchemas,
} as const;

export type GivebutterEndpointInputs = {
	[K in keyof typeof GivebutterEndpointInputSchemas]: z.infer<
		(typeof GivebutterEndpointInputSchemas)[K]
	>;
};
export type GivebutterEndpointOutputs = {
	[K in keyof typeof GivebutterEndpointOutputSchemas]: z.infer<
		(typeof GivebutterEndpointOutputSchemas)[K]
	>;
};
