import { z } from 'zod';

// ============================================================================
// Events
// ============================================================================

export const CustomEventFieldAttributeSchema = z
	.object({
		id: z.number().optional(),
		key: z.string(),
		value: z.union([z.string(), z.number(), z.boolean()]),
	})
	.passthrough();

export type CustomEventFieldAttribute = z.infer<
	typeof CustomEventFieldAttributeSchema
>;

export const FomoEventSchema = z
	.object({
		id: z.number().int(),
		external_id: z.string().nullable().optional(),
		event_type_id: z.union([z.number(), z.string()]).nullable().optional(),
		event_type_tag: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		email_address: z.string().nullable().optional(),
		ip_address: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		province: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		image_url: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		created_at_to_seconds_from_epoch: z.number().nullable().optional(),
		message: z.string().nullable().optional(),
		link: z.string().nullable().optional(),
		custom_event_fields_attributes: z
			.array(CustomEventFieldAttributeSchema)
			.nullable()
			.optional(),
	})
	.passthrough();

export type FomoEvent = z.infer<typeof FomoEventSchema>;

export const EventsMetaSchema = z
	.object({
		per_page: z.number().optional(),
		page: z.number().optional(),
		total_count: z.number().optional(),
		total_pages: z.number().optional(),
	})
	.passthrough();

export type EventsMeta = z.infer<typeof EventsMetaSchema>;

export const EventsListInputSchema = z
	.object({
		per: z.number().int().positive().optional(),
		page: z.number().int().positive().optional(),
		show_meta: z.boolean().optional(),
	})
	.strict();

export type EventsListInput = z.infer<typeof EventsListInputSchema>;

export const EventsListOutputSchema = z.union([
	z.array(FomoEventSchema),
	z
		.object({
			events: z.array(FomoEventSchema),
			meta: EventsMetaSchema.optional(),
		})
		.passthrough(),
]);

export type EventsListOutput = z.infer<typeof EventsListOutputSchema>;

export const EventsGetInputSchema = z
	.object({
		id: z.union([z.number().int(), z.string()]),
	})
	.strict();

export type EventsGetInput = z.infer<typeof EventsGetInputSchema>;

export const EventsGetOutputSchema = FomoEventSchema;
export type EventsGetOutput = z.infer<typeof EventsGetOutputSchema>;

export const EventsCreateInputSchema = z
	.object({
		event_type_id: z.union([z.number().int(), z.string()]).optional(),
		event_type_tag: z.string().optional(),
		url: z.string().optional(),
		first_name: z.string().optional(),
		email_address: z.string().optional(),
		ip_address: z.string().optional(),
		city: z.string().optional(),
		province: z.string().optional(),
		country: z.string().optional(),
		title: z.string().optional(),
		image_url: z.string().optional(),
		external_id: z.string().optional(),
		custom_event_fields_attributes: z
			.array(
				z.object({
					id: z.number().optional(),
					key: z.string(),
					value: z.union([z.string(), z.number(), z.boolean()]),
				}),
			)
			.optional(),
	})
	.strict();

export type EventsCreateInput = z.infer<typeof EventsCreateInputSchema>;

export const EventsCreateOutputSchema = FomoEventSchema;
export type EventsCreateOutput = z.infer<typeof EventsCreateOutputSchema>;

export const EventsUpdateInputSchema = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		event_type_id: z.union([z.number().int(), z.string()]).optional(),
		event_type_tag: z.string().optional(),
		url: z.string().optional(),
		first_name: z.string().optional(),
		email_address: z.string().optional(),
		ip_address: z.string().optional(),
		city: z.string().optional(),
		province: z.string().optional(),
		country: z.string().optional(),
		title: z.string().optional(),
		image_url: z.string().optional(),
		external_id: z.string().optional(),
		created_at: z.string().optional(),
		custom_event_fields_attributes: z
			.array(
				z.object({
					id: z.number().optional(),
					key: z.string(),
					value: z.union([z.string(), z.number(), z.boolean()]),
				}),
			)
			.optional(),
	})
	.strict();

export type EventsUpdateInput = z.infer<typeof EventsUpdateInputSchema>;

export const EventsUpdateOutputSchema = FomoEventSchema;
export type EventsUpdateOutput = z.infer<typeof EventsUpdateOutputSchema>;

export const EventsDeleteInputSchema = z
	.object({
		id: z.union([z.number().int(), z.string()]),
	})
	.strict();

export type EventsDeleteInput = z.infer<typeof EventsDeleteInputSchema>;

export const EventsDeleteOutputSchema = z
	.object({
		message: z.string(),
	})
	.passthrough();

export type EventsDeleteOutput = z.infer<typeof EventsDeleteOutputSchema>;

export const EventsSearchInputSchema = z
	.object({
		field: z.enum(['email_address', 'external_id']),
		q: z.string().min(1, 'Search query cannot be empty'),
	})
	.strict();

export type EventsSearchInput = z.infer<typeof EventsSearchInputSchema>;

export const EventsSearchOutputSchema = FomoEventSchema;
export type EventsSearchOutput = z.infer<typeof EventsSearchOutputSchema>;

// ============================================================================
// Templates (Event Types)
// ============================================================================

export const TemplateSchema = z
	.object({
		id: z.number().int(),
		event_type_tag: z.string().nullable().optional(),
		name: z.string(),
		message: z.string().nullable().optional(),
		markdown_enabled: z.boolean().nullable().optional(),
		image_url: z.string().nullable().optional(),
		use_avatar: z.boolean().nullable().optional(),
		use_ip_mapping: z.boolean().nullable().optional(),
	})
	.passthrough();

export type Template = z.infer<typeof TemplateSchema>;

export const TemplatesListInputSchema = z
	.object({
		per: z.number().int().positive().optional(),
		page: z.number().int().positive().optional(),
	})
	.strict();

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

export const TemplatesListOutputSchema = z.union([
	z.array(TemplateSchema),
	z
		.object({
			event_types: z.array(TemplateSchema),
		})
		.passthrough(),
]);

export type TemplatesListOutput = z.infer<typeof TemplatesListOutputSchema>;

export const TemplatesGetInputSchema = z
	.object({
		id: z.union([z.number().int(), z.string()]),
	})
	.strict();

export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;

export const TemplatesGetOutputSchema = TemplateSchema;
export type TemplatesGetOutput = z.infer<typeof TemplatesGetOutputSchema>;

export const TemplatesCreateInputSchema = z
	.object({
		name: z.string().min(1, 'Template name is required'),
		message: z.string().min(1, 'Template message is required'),
		markdown_enabled: z.boolean().optional(),
		image_url: z.string().optional(),
		use_avatar: z.boolean().optional(),
		use_ip_mapping: z.boolean().optional(),
	})
	.strict();

export type TemplatesCreateInput = z.infer<typeof TemplatesCreateInputSchema>;

export const TemplatesCreateOutputSchema = TemplateSchema;
export type TemplatesCreateOutput = z.infer<typeof TemplatesCreateOutputSchema>;

export const TemplatesUpdateInputSchema = z
	.object({
		id: z.union([z.number().int(), z.string()]),
		name: z.string().optional(),
		message: z.string().optional(),
		markdown_enabled: z.boolean().optional(),
		image_url: z.string().optional(),
		use_avatar: z.boolean().optional(),
		use_ip_mapping: z.boolean().optional(),
	})
	.strict();

export type TemplatesUpdateInput = z.infer<typeof TemplatesUpdateInputSchema>;

export const TemplatesUpdateOutputSchema = TemplateSchema;
export type TemplatesUpdateOutput = z.infer<typeof TemplatesUpdateOutputSchema>;

export const TemplatesDeleteInputSchema = z
	.object({
		id: z.union([z.number().int(), z.string()]),
	})
	.strict();

export type TemplatesDeleteInput = z.infer<typeof TemplatesDeleteInputSchema>;

export const TemplatesDeleteOutputSchema = z
	.object({
		message: z.string().optional(),
		success: z.boolean().optional(),
	})
	.passthrough();

export type TemplatesDeleteOutput = z.infer<typeof TemplatesDeleteOutputSchema>;

// ============================================================================
// Application & Stats
// ============================================================================

export const ApplicationSettingsSchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		url: z.string().optional(),
		page_load: z.number().optional(),
		maximum_per_page: z.number().optional(),
		display_for: z.number().optional(),
		display_interval: z.number().optional(),
		randomize: z.union([z.number(), z.boolean()]).optional(),
		closable: z.union([z.number(), z.boolean()]).optional(),
		display_period: z.number().optional(),
		display_threshold: z.number().optional(),
		time_ago_period: z.number().optional(),
		time_ago_threshold: z.number().optional(),
		hide_mobile: z.boolean().optional(),
		loop_notification: z.boolean().optional(),
		position: z.string().optional(),
		theme: z.string().optional(),
		utm_source: z.string().optional(),
		utm_medium: z.string().optional(),
		client_id: z.string().optional(),
		client_secret: z.string().optional(),
		// `unknown` because nested event type attributes in application response can contain arbitrary provider fields.
		event_types_attributes: z
			.array(z.record(z.string(), z.unknown()))
			.optional(),
		// `unknown` because stat_application object contains dynamic engagement metrics from the provider.
		stat_application: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export type ApplicationSettings = z.infer<typeof ApplicationSettingsSchema>;

export const ApplicationGetInputSchema = z
	.object({
		id: z.union([z.number().int(), z.string()]).optional(),
	})
	.strict();

export type ApplicationGetInput = z.infer<typeof ApplicationGetInputSchema>;

export const ApplicationGetOutputSchema = ApplicationSettingsSchema;
export type ApplicationGetOutput = z.infer<typeof ApplicationGetOutputSchema>;

export const ApplicationUpdateInputSchema = z
	.object({
		id: z.union([z.number().int(), z.string()]).optional(),
		name: z.string().optional(),
		url: z.string().optional(),
		language: z.string().max(255).optional(),
		page_load: z.number().optional(),
		maximum_per_page: z.number().optional(),
		display_for: z.number().optional(),
		display_interval: z.number().optional(),
		randomize: z.union([z.number(), z.boolean()]).optional(),
		closable: z.union([z.number(), z.boolean()]).optional(),
		display_period: z.number().optional(),
		display_threshold: z.number().optional(),
		time_ago_period: z.number().optional(),
		time_ago_threshold: z.number().optional(),
		hide_mobile: z.boolean().optional(),
		loop_notification: z.boolean().optional(),
		position: z
			.enum(['bottom_left', 'bottom_right', 'top_left', 'top_right'])
			.optional(),
		theme: z.enum(['theme1', 'theme2', 'custom']).optional(),
		utm_source: z.string().optional(),
		utm_medium: z.string().optional(),
		// Fomo's update sample sends event types as objects. `_destroy` is left out so this
		// operation stays a settings change and can't delete event types.
		event_types_attributes: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						message: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();

export type ApplicationUpdateInput = z.infer<
	typeof ApplicationUpdateInputSchema
>;

export const ApplicationUpdateOutputSchema = ApplicationSettingsSchema;
export type ApplicationUpdateOutput = z.infer<
	typeof ApplicationUpdateOutputSchema
>;

export const ApplicationGetStatsInputSchema = z
	.object({
		date_range: z.object({
			from: z.string(),
			to: z.string(),
		}),
	})
	.strict();

export type ApplicationGetStatsInput = z.infer<
	typeof ApplicationGetStatsInputSchema
>;

export const ApplicationStatsDaySchema = z
	.object({
		converted_sale_in_cents: z.number().optional(),
		conversions_count: z.number().optional(),
		click_count: z.number().optional(),
		impr_count: z.number().optional(),
		hover_count: z.number().optional(),
	})
	.passthrough();

export const ApplicationStatsTotalsSchema = z
	.object({
		converted_sale_in_cents: z.number().optional(),
		conversions_count: z.number().optional(),
		click_count: z.number().optional(),
		impr_count: z.number().optional(),
		hover_count: z.number().optional(),
		goal_conversion_count: z.number().optional(),
		goal_converted_sale_in_dollars: z.number().optional(),
	})
	.passthrough();

export const ApplicationGetStatsOutputSchema = z
	.object({
		graph: z.record(z.string(), ApplicationStatsDaySchema).optional(),
		totals: ApplicationStatsTotalsSchema.optional(),
		date_range: z
			.object({
				from: z.string().optional(),
				to: z.string().optional(),
			})
			.optional(),
		has_ga_conversions: z.boolean().optional(),
	})
	.passthrough();

export type ApplicationGetStatsOutput = z.infer<
	typeof ApplicationGetStatsOutputSchema
>;

// ============================================================================
// Endpoint Collections
// ============================================================================

export type FomoEndpointInputs = {
	'events.list': EventsListInput;
	'events.get': EventsGetInput;
	'events.create': EventsCreateInput;
	'events.update': EventsUpdateInput;
	'events.delete': EventsDeleteInput;
	'events.search': EventsSearchInput;
	'templates.list': TemplatesListInput;
	'templates.get': TemplatesGetInput;
	'templates.create': TemplatesCreateInput;
	'templates.update': TemplatesUpdateInput;
	'templates.delete': TemplatesDeleteInput;
	'application.get': ApplicationGetInput;
	'application.update': ApplicationUpdateInput;
	'application.getStats': ApplicationGetStatsInput;
};

export type FomoEndpointOutputs = {
	'events.list': EventsListOutput;
	'events.get': EventsGetOutput;
	'events.create': EventsCreateOutput;
	'events.update': EventsUpdateOutput;
	'events.delete': EventsDeleteOutput;
	'events.search': EventsSearchOutput;
	'templates.list': TemplatesListOutput;
	'templates.get': TemplatesGetOutput;
	'templates.create': TemplatesCreateOutput;
	'templates.update': TemplatesUpdateOutput;
	'templates.delete': TemplatesDeleteOutput;
	'application.get': ApplicationGetOutput;
	'application.update': ApplicationUpdateOutput;
	'application.getStats': ApplicationGetStatsOutput;
};

export const FomoEndpointInputSchemas = {
	'events.list': EventsListInputSchema,
	'events.get': EventsGetInputSchema,
	'events.create': EventsCreateInputSchema,
	'events.update': EventsUpdateInputSchema,
	'events.delete': EventsDeleteInputSchema,
	'events.search': EventsSearchInputSchema,
	'templates.list': TemplatesListInputSchema,
	'templates.get': TemplatesGetInputSchema,
	'templates.create': TemplatesCreateInputSchema,
	'templates.update': TemplatesUpdateInputSchema,
	'templates.delete': TemplatesDeleteInputSchema,
	'application.get': ApplicationGetInputSchema,
	'application.update': ApplicationUpdateInputSchema,
	'application.getStats': ApplicationGetStatsInputSchema,
} as const;

export const FomoEndpointOutputSchemas = {
	'events.list': EventsListOutputSchema,
	'events.get': EventsGetOutputSchema,
	'events.create': EventsCreateOutputSchema,
	'events.update': EventsUpdateOutputSchema,
	'events.delete': EventsDeleteOutputSchema,
	'events.search': EventsSearchOutputSchema,
	'templates.list': TemplatesListOutputSchema,
	'templates.get': TemplatesGetOutputSchema,
	'templates.create': TemplatesCreateOutputSchema,
	'templates.update': TemplatesUpdateOutputSchema,
	'templates.delete': TemplatesDeleteOutputSchema,
	'application.get': ApplicationGetOutputSchema,
	'application.update': ApplicationUpdateOutputSchema,
	'application.getStats': ApplicationGetStatsOutputSchema,
} as const;
