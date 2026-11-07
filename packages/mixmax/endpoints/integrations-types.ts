import { z } from 'zod';

// Editor integrations: slash commands, enhancements, link resolvers and
// sidebar apps (developer.mixmax.com/reference, Integrations section). Field
// names, types, and required-ness mirror the official IntegrationItem,
// IntegrationCommand, IntegrationEnhancement, IntegrationLinkResolver,
// IntegrationSidebar and their *Page schemas and the
// /v1/integrations/* operation definitions.

// The base fields every integrations item shares, matching the official
// IntegrationItem schema. The provider declares these response components as
// untyped objects (additionalProperties: true and no required fields), so no
// narrower contract is published: the documented fields stay optional and the
// object stays passthrough.
export const IntegrationItemSchema = z
	.object({
		// The item's id, used to delete it.
		_id: z.string().optional(),
		// A separate id used only for analytics.
		id: z.string().optional(),
		// Items without `userId` are Mixmax's own.
		userId: z.string().optional(),
		name: z.string().optional(),
		// ISO 8601 date-time string.
		createdAt: z.string().optional(),
	})
	.passthrough();

export type IntegrationItem = z.infer<typeof IntegrationItemSchema>;

// A slash command, matching the official IntegrationCommand schema: an
// IntegrationItem plus the command fields, all optional and passthrough for
// the same untyped-object reason.
export const IntegrationCommandSchema = IntegrationItemSchema.extend({
	// The commands, letters and digits only, without the leading slash.
	commands: z.array(z.string()).optional(),
	// Placeholder text shown after the command.
	parameterPlaceholder: z.string().optional(),
	commandParameterHintsUrl: z.string().optional(),
	commandResolverUrl: z.string().optional(),
});

export type IntegrationCommand = z.infer<typeof IntegrationCommandSchema>;

export const IntegrationCommandPageSchema = z.object({
	results: z.array(IntegrationCommandSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type IntegrationCommandPage = z.infer<
	typeof IntegrationCommandPageSchema
>;

// An editor enhancement, matching the official IntegrationEnhancement
// schema: an IntegrationItem plus the enhancement fields, all optional and
// passthrough for the same untyped-object reason.
export const IntegrationEnhancementSchema = IntegrationItemSchema.extend({
	icon: z.string().optional(),
	iconTooltip: z.string().optional(),
	editorUrl: z.string().optional(),
	resolverUrl: z.string().optional(),
	activateUrl: z.string().optional(),
	// The editor iframe's size, in pixels.
	editorHeight: z.number().optional(),
	editorWidth: z.number().optional(),
	commands: z.array(z.string()).optional(),
	category: z.string().optional(),
	isEditable: z.boolean().optional(),
});

export type IntegrationEnhancement = z.infer<
	typeof IntegrationEnhancementSchema
>;

export const IntegrationEnhancementPageSchema = z.object({
	results: z.array(IntegrationEnhancementSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type IntegrationEnhancementPage = z.infer<
	typeof IntegrationEnhancementPageSchema
>;

// A link resolver, matching the official IntegrationLinkResolver schema: an
// IntegrationItem plus the resolver fields, all optional and passthrough for
// the same untyped-object reason. `order` only ever comes back in responses;
// the create body does not take it.
export const IntegrationLinkResolverSchema = IntegrationItemSchema.extend({
	description: z.string().optional(),
	// A JavaScript regular expression the URL must match.
	regex: z.string().optional(),
	resolverUrl: z.string().optional(),
	order: z.number().int().optional(),
});

export type IntegrationLinkResolver = z.infer<
	typeof IntegrationLinkResolverSchema
>;

export const IntegrationLinkResolverPageSchema = z.object({
	results: z.array(IntegrationLinkResolverSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type IntegrationLinkResolverPage = z.infer<
	typeof IntegrationLinkResolverPageSchema
>;

// A sidebar app, matching the official IntegrationSidebar schema: an
// IntegrationItem plus the sidebar fields, all optional and passthrough for
// the same untyped-object reason.
export const IntegrationSidebarSchema = IntegrationItemSchema.extend({
	url: z.string().optional(),
	iconImage: z.string().optional(),
	iconName: z.string().optional(),
	iconColor: z.string().optional(),
});

export type IntegrationSidebar = z.infer<typeof IntegrationSidebarSchema>;

export const IntegrationSidebarPageSchema = z.object({
	results: z.array(IntegrationSidebarSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type IntegrationSidebarPage = z.infer<
	typeof IntegrationSidebarPageSchema
>;

export const IntegrationsCommandsListInputSchema = z.object({
	// How many items per page. Defaults to 50, at most 300.
	limit: z.coerce.number().int().max(300).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type IntegrationsCommandsListInput = z.infer<
	typeof IntegrationsCommandsListInputSchema
>;

export const IntegrationsCommandsListOutputSchema =
	IntegrationCommandPageSchema;

export type IntegrationsCommandsListOutput = z.infer<
	typeof IntegrationsCommandsListOutputSchema
>;

export const IntegrationsCommandsCreateInputSchema = z.object({
	name: z.string().min(1),
	// The commands, letters and digits only, without the leading slash.
	commands: z.array(z.string()).optional(),
	// Placeholder text shown after the command.
	parameterPlaceholder: z.string().min(1),
	commandParameterHintsUrl: z.string().min(1),
	commandResolverUrl: z.string().min(1),
});

export type IntegrationsCommandsCreateInput = z.infer<
	typeof IntegrationsCommandsCreateInputSchema
>;

// POST /v1/integrations/commands answers 200 with the new slash command.
export const IntegrationsCommandsCreateOutputSchema = IntegrationCommandSchema;

export type IntegrationsCommandsCreateOutput = z.infer<
	typeof IntegrationsCommandsCreateOutputSchema
>;

export const IntegrationsCommandsDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type IntegrationsCommandsDeleteInput = z.infer<
	typeof IntegrationsCommandsDeleteInputSchema
>;

// DELETE /v1/integrations/commands/{id} answers 204 with no body.
export const IntegrationsCommandsDeleteOutputSchema = z.undefined();

export type IntegrationsCommandsDeleteOutput = z.infer<
	typeof IntegrationsCommandsDeleteOutputSchema
>;

export const IntegrationsEnhancementsListInputSchema = z.object({
	// How many items per page. Defaults to 50, at most 300.
	limit: z.coerce.number().int().max(300).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type IntegrationsEnhancementsListInput = z.infer<
	typeof IntegrationsEnhancementsListInputSchema
>;

export const IntegrationsEnhancementsListOutputSchema =
	IntegrationEnhancementPageSchema;

export type IntegrationsEnhancementsListOutput = z.infer<
	typeof IntegrationsEnhancementsListOutputSchema
>;

export const IntegrationsEnhancementsCreateInputSchema = z.object({
	name: z.string().optional(),
	icon: z.string().min(1),
	iconTooltip: z.string().min(1),
	editorUrl: z.string().min(1),
	resolverUrl: z.string().min(1),
	activateUrl: z.string().optional(),
	// The editor iframe's size, in pixels.
	editorHeight: z.number().optional(),
	editorWidth: z.number().optional(),
	commands: z.array(z.string()).optional(),
	category: z.string().optional(),
	isEditable: z.boolean().optional(),
});

export type IntegrationsEnhancementsCreateInput = z.infer<
	typeof IntegrationsEnhancementsCreateInputSchema
>;

// POST /v1/integrations/enhancements answers 200 with the new enhancement.
export const IntegrationsEnhancementsCreateOutputSchema =
	IntegrationEnhancementSchema;

export type IntegrationsEnhancementsCreateOutput = z.infer<
	typeof IntegrationsEnhancementsCreateOutputSchema
>;

export const IntegrationsEnhancementsDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type IntegrationsEnhancementsDeleteInput = z.infer<
	typeof IntegrationsEnhancementsDeleteInputSchema
>;

// DELETE /v1/integrations/enhancements/{id} answers 204 with no body.
export const IntegrationsEnhancementsDeleteOutputSchema = z.undefined();

export type IntegrationsEnhancementsDeleteOutput = z.infer<
	typeof IntegrationsEnhancementsDeleteOutputSchema
>;

export const IntegrationsLinkResolversListInputSchema = z.object({
	// How many items per page. Defaults to 50, at most 300.
	limit: z.coerce.number().int().max(300).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type IntegrationsLinkResolversListInput = z.infer<
	typeof IntegrationsLinkResolversListInputSchema
>;

export const IntegrationsLinkResolversListOutputSchema =
	IntegrationLinkResolverPageSchema;

export type IntegrationsLinkResolversListOutput = z.infer<
	typeof IntegrationsLinkResolversListOutputSchema
>;

export const IntegrationsLinkResolversCreateInputSchema = z.object({
	description: z.string().min(1),
	// A JavaScript regular expression the URL must match.
	regex: z.string().min(1),
	resolverUrl: z.string().min(1),
});

export type IntegrationsLinkResolversCreateInput = z.infer<
	typeof IntegrationsLinkResolversCreateInputSchema
>;

// POST /v1/integrations/linkresolvers answers 200 with the new link
// resolver.
export const IntegrationsLinkResolversCreateOutputSchema =
	IntegrationLinkResolverSchema;

export type IntegrationsLinkResolversCreateOutput = z.infer<
	typeof IntegrationsLinkResolversCreateOutputSchema
>;

export const IntegrationsLinkResolversDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type IntegrationsLinkResolversDeleteInput = z.infer<
	typeof IntegrationsLinkResolversDeleteInputSchema
>;

// DELETE /v1/integrations/linkresolvers/{id} answers 204 with no body.
export const IntegrationsLinkResolversDeleteOutputSchema = z.undefined();

export type IntegrationsLinkResolversDeleteOutput = z.infer<
	typeof IntegrationsLinkResolversDeleteOutputSchema
>;

// GET /v1/integrations/sidebars takes no query parameters: the provider
// returns 500 when `limit` is passed, and the list is not paginated.
export const IntegrationsSidebarsListInputSchema = z.object({});

export type IntegrationsSidebarsListInput = z.infer<
	typeof IntegrationsSidebarsListInputSchema
>;

export const IntegrationsSidebarsListOutputSchema =
	IntegrationSidebarPageSchema;

export type IntegrationsSidebarsListOutput = z.infer<
	typeof IntegrationsSidebarsListOutputSchema
>;

export const IntegrationsSidebarsCreateInputSchema = z.object({
	name: z.string().min(1),
	url: z.string().min(1),
	// Give the app an `iconImage`, or both `iconName` and `iconColor`.
	iconImage: z.string().optional(),
	iconName: z.string().optional(),
	iconColor: z.string().optional(),
});

export type IntegrationsSidebarsCreateInput = z.infer<
	typeof IntegrationsSidebarsCreateInputSchema
>;

// POST /v1/integrations/sidebars answers 200 with the new sidebar app.
export const IntegrationsSidebarsCreateOutputSchema = IntegrationSidebarSchema;

export type IntegrationsSidebarsCreateOutput = z.infer<
	typeof IntegrationsSidebarsCreateOutputSchema
>;

export const IntegrationsSidebarsDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type IntegrationsSidebarsDeleteInput = z.infer<
	typeof IntegrationsSidebarsDeleteInputSchema
>;

// DELETE /v1/integrations/sidebars/{id} answers 204 with no body.
export const IntegrationsSidebarsDeleteOutputSchema = z.undefined();

export type IntegrationsSidebarsDeleteOutput = z.infer<
	typeof IntegrationsSidebarsDeleteOutputSchema
>;
