import { z } from 'zod';

const OptionalText = z.string().nullable().optional();
const UnixOrDate = z.union([z.number(), z.string()]).nullable().optional();
const SuccessValue = z.union([z.boolean(), z.string()]);
// Published response envelopes are extensible provider objects.
const ResponseEnvelope = z
	.object({ success: SuccessValue, message: z.string().optional() })
	.passthrough();

// Endorsal adds fields to these resource objects over time; known fields are
// validated while documented provider extensions remain forward-compatible.
export const TestimonialSchema = z
	.object({
		_id: z.string().optional(),
		name: OptionalText,
		propertyID: OptionalText,
		comments: OptionalText,
		// Documented as 1-5, but the reference's own Wall of Love example returns 0.
		rating: z.number().nullable().optional(),
		avatar: z
			.object({
				url: OptionalText,
				sizes: z
					.object({
						small: OptionalText,
						medium: OptionalText,
						large: OptionalText,
						original: OptionalText,
					})
					.passthrough()
					.nullable()
					.optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		email: OptionalText,
		location: OptionalText,
		position: OptionalText,
		company: OptionalText,
		formID: OptionalText,
		added: UnixOrDate,
		approved: z.number().int().nullable().optional(),
		featured: z.number().int().nullable().optional(),
		// Tag IDs; the reference's Wall of Love example includes a null entry.
		tags: z.array(z.string().nullable()).nullable().optional(),
	})
	.passthrough();

export const NewTestimonialSchema = z
	.object({
		name: z.string().min(1),
		propertyID: z.string().min(1),
		comments: z.string().min(1),
		rating: z.number().int().min(1).max(5).optional(),
		avatar: z.string().optional(),
		email: z.string().optional(),
		location: z.string().optional(),
		position: z.string().optional(),
		company: z.string().optional(),
		approved: z.number().int().min(0).max(2).optional(),
		featured: z.number().int().min(0).max(1).optional(),
		added: z.string().min(13).optional(),
	})
	.strict();

// Tag and contact objects have provider-defined nullable fields in real
// responses even where the published component schemas omit nullability.
export const TagSchema = z
	.object({
		_id: z.string().optional(),
		name: OptionalText,
		type: OptionalText,
		propertyID: OptionalText,
		slug: OptionalText,
		description: OptionalText,
		image: OptionalText,
		link: OptionalText,
		sku: OptionalText,
		edited: UnixOrDate,
	})
	.passthrough();

export const NewTagSchema = z
	.object({
		name: z.string().min(1),
		type: z.string().min(1),
		description: z.string().optional(),
		image: z.string().optional(),
		link: z.string().optional(),
		sku: z.string().optional(),
	})
	.strict();

const TagAssociationSchema = z.union([
	NewTagSchema,
	z.object({ _id: z.string().min(1) }).passthrough(),
]);

export const ContactSchema = z
	.object({
		_id: z.string().optional(),
		name: OptionalText,
		firstName: OptionalText,
		lastName: OptionalText,
		email: OptionalText,
		phone: OptionalText,
		externalID: OptionalText,
		importedFrom: OptionalText,
		avatar: OptionalText,
		location: OptionalText,
		position: OptionalText,
		company: OptionalText,
		website: OptionalText,
		propertyID: OptionalText,
		customAttributes: z.record(z.string(), z.json()).nullable().optional(),
		activity: z
			.object({
				added: UnixOrDate,
				updated: UnixOrDate,
				lastContacted: UnixOrDate,
				lastOpened: UnixOrDate,
				lastClicked: UnixOrDate,
				lastEmailOpened: UnixOrDate,
				lastEmailClicked: UnixOrDate,
			})
			.passthrough()
			.nullable()
			.optional(),
	})
	.passthrough();

// `customAttributes` and update fields are intentionally arbitrary JSON maps;
// their names and values are defined by each Endorsal property, not the API.
const JsonObjectSchema = z.record(z.string(), z.json());

export const NewContactSchema = z
	.object({
		name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		avatar: z.string().optional(),
		location: z.string().optional(),
		position: z.string().optional(),
		company: z.string().optional(),
		website: z.string().optional(),
		externalID: z.string().optional(),
		importedFrom: z.string().optional(),
		propertyID: z.string().optional(),
		customAttributes: JsonObjectSchema.optional(),
	})
	.strict()
	.refine((value) => Boolean(value.email || value.phone), {
		message: 'Provide at least one of email or phone',
	});

export const WidgetSchema = z
	.object({
		_id: z.string().optional(),
		widgetName: OptionalText,
		widgetTheme: OptionalText,
		formID: OptionalText,
		propertyID: z.union([z.string(), z.json()]).nullable().optional(),
		widgetLayout: OptionalText,
		carouselSettings: z.record(z.string(), z.json()).nullable().optional(),
		gridSettings: z.record(z.string(), z.json()).nullable().optional(),
		source: OptionalText,
		hideTestimonials: z.boolean().nullable().optional(),
		hiddenTestimonials: z
			.union([z.array(z.string()), z.record(z.string(), z.json())])
			.nullable()
			.optional(),
		onlyShowFeatured: z.boolean().nullable().optional(),
		showSource: z.boolean().nullable().optional(),
		showBranding: z.boolean().nullable().optional(),
		randomize: z.boolean().nullable().optional(),
		showRecency: z.boolean().nullable().optional(),
		widgetTag: OptionalText,
		edited: UnixOrDate,
		testimonials: z.array(TestimonialSchema).optional(),
	})
	.passthrough();

const ComparisonOperatorSchema = z
	.string()
	.pipe(z.enum(['=', '>', '>=', '<', '<=', '!=', 'contains', 'in']));

export const MatchSchema = z
	.object({
		field: z.string().min(1),
		operator: ComparisonOperatorSchema,
		value: z.union([
			z.string(),
			z.number(),
			z.null(),
			z.array(z.union([z.string(), z.number()])),
		]),
	})
	.strict()
	.refine((match) => match.operator !== 'in' || Array.isArray(match.value), {
		message: 'The "in" operator requires an array value',
	});

const EmptyInput = z.object({}).strict();
const IdInput = z.object({ id: z.string().min(1) }).strict();
const UpdateInput = IdInput.extend({ fields: JsonObjectSchema }).strict();
const SearchInput = z.object({ query: z.array(MatchSchema) }).strict();
const RenderInput = z.object({ render: z.boolean().optional() }).strict();
const IdRenderInput = IdInput.extend({
	render: z.boolean().optional(),
}).strict();
const AddTagsInput = IdInput.extend({
	tags: z.array(TagAssociationSchema),
}).strict();
const CreateContactInput = z
	.object({
		contact: NewContactSchema,
		campaignID: z.string().optional(),
	})
	.strict();

// Response envelopes retain undocumented provider metadata without weakening
// validation of their documented success/data fields.
const TestimonialResponseSchema = z
	.object({ success: z.boolean(), data: TestimonialSchema })
	.passthrough();
const TestimonialListResponseSchema = z
	.object({ success: z.boolean(), data: z.array(TestimonialSchema) })
	.passthrough();
// The reference marks only `success` as required on search responses, so a
// search with no match may omit `data`.
const TestimonialSearchResponseSchema = z
	.object({ success: z.boolean(), data: z.array(TestimonialSchema).optional() })
	.passthrough();
const TagResponseSchema = z
	.object({ success: SuccessValue, data: TagSchema })
	.passthrough();
const TagListResponseSchema = z
	.object({ success: z.boolean(), data: z.array(TagSchema) })
	.passthrough();
const ContactResponseSchema = z
	.object({ success: SuccessValue, data: ContactSchema })
	.passthrough();
const ContactListResponseSchema = z
	.object({ success: z.boolean(), data: z.array(ContactSchema) })
	.passthrough();
const ContactSearchResponseSchema = z
	.object({ success: z.boolean(), data: z.array(ContactSchema).optional() })
	.passthrough();
const WidgetListResponseSchema = z
	.object({ success: z.boolean(), data: z.array(WidgetSchema) })
	.passthrough();
const WidgetResponseSchema = z
	.object({ success: z.boolean(), data: WidgetSchema })
	.passthrough();

// Campaign entries are documented as extensible JSON objects without a fixed
// property list, so validate the object shape while preserving provider fields.
const CampaignSchema = z.record(z.string(), z.json());
const CampaignListResponseSchema = z
	.object({ success: z.boolean(), data: z.array(CampaignSchema) })
	.passthrough();
const CampaignResponseSchema = z
	.object({ success: z.boolean(), data: CampaignSchema })
	.passthrough();
const WallOfLoveSchema = WidgetSchema.extend({
	settings: z.record(z.string(), z.json()).nullable().optional(),
	truncate: z.record(z.string(), z.json()).nullable().optional(),
}).passthrough();
const WallOfLoveResponseSchema = z.union([
	z.object({ success: z.boolean(), data: WallOfLoveSchema }).passthrough(),
	z.string(),
]);

export const EndorsalEndpointInputSchemas = {
	testimonialsList: EmptyInput,
	testimonialsGet: IdInput,
	testimonialsCreate: NewTestimonialSchema,
	testimonialsUpdate: UpdateInput,
	testimonialsDelete: IdInput,
	testimonialsAddTags: AddTagsInput,
	testimonialsSearch: SearchInput,
	testimonialsByTag: IdInput,
	testimonialsByContact: IdInput,
	contactsList: EmptyInput,
	contactsCreate: CreateContactInput,
	contactsGet: IdInput,
	contactsUpdate: UpdateInput,
	contactsArchive: IdInput,
	contactsSearch: SearchInput,
	tagsList: EmptyInput,
	tagsCreate: NewTagSchema,
	tagsGet: IdInput,
	tagsUpdate: UpdateInput,
	tagsDelete: IdInput,
	widgetsList: EmptyInput,
	widgetsGet: IdRenderInput,
	wallOfLoveGet: RenderInput,
	campaignsList: EmptyInput,
	campaignsGet: IdInput,
} as const;

export const EndorsalEndpointOutputSchemas = {
	testimonialsList: TestimonialListResponseSchema,
	testimonialsGet: TestimonialResponseSchema,
	testimonialsCreate: TestimonialResponseSchema,
	testimonialsUpdate: ResponseEnvelope,
	testimonialsDelete: ResponseEnvelope,
	testimonialsAddTags: TestimonialResponseSchema,
	testimonialsSearch: TestimonialSearchResponseSchema,
	testimonialsByTag: TestimonialListResponseSchema,
	testimonialsByContact: TestimonialListResponseSchema,
	contactsList: ContactListResponseSchema,
	contactsCreate: ContactResponseSchema,
	contactsGet: ContactResponseSchema,
	contactsUpdate: ResponseEnvelope,
	contactsArchive: ResponseEnvelope,
	contactsSearch: ContactSearchResponseSchema,
	tagsList: TagListResponseSchema,
	tagsCreate: TagResponseSchema,
	tagsGet: TagResponseSchema,
	tagsUpdate: ResponseEnvelope,
	tagsDelete: ResponseEnvelope,
	widgetsList: WidgetListResponseSchema,
	widgetsGet: z.union([WidgetResponseSchema, z.string()]),
	wallOfLoveGet: WallOfLoveResponseSchema,
	campaignsList: CampaignListResponseSchema,
	campaignsGet: CampaignResponseSchema,
} as const;

export type EndorsalEndpointInputs = {
	[K in keyof typeof EndorsalEndpointInputSchemas]: z.infer<
		(typeof EndorsalEndpointInputSchemas)[K]
	>;
};

export type EndorsalEndpointOutputs = {
	[K in keyof typeof EndorsalEndpointOutputSchemas]: z.infer<
		(typeof EndorsalEndpointOutputSchemas)[K]
	>;
};

export type EndorsalEndpointName = keyof EndorsalEndpointInputs;
