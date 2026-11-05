import { z } from 'zod';

const id = z.union([z.string(), z.number()]);

/**
 * Better Proposals proposal.
 * Official: GET /proposal, GET /proposal/:PROPOSAL_ID
 * https://betterproposals.io/resources/api/
 */
export const BetterProposalsProposal = z
	.object({
		ID: id,
		CompanyName: z.string().optional().nullable(),
		CompanyCRMID: z.string().optional().nullable(),
		TypeID: id.optional().nullable(),
		BrandID: id.optional().nullable(),
		CoverID: id.optional().nullable(),
		QuoteID: id.optional().nullable(),
		CurrencyCode: z.string().optional().nullable(),
		CurrencyName: z.string().optional().nullable(),
		CurrencySymbol: z.string().optional().nullable(),
		DateCreated: z.string().optional().nullable(),
		Preview: z.string().optional().nullable(),
		ProposalView: z.string().optional().nullable(),
	})
	.loose();

export type BetterProposalsProposal = z.infer<typeof BetterProposalsProposal>;

/**
 * Better Proposals template.
 * Official: GET /template, GET /template/:TEMPLATE_ID
 * https://betterproposals.io/resources/api/
 */
export const BetterProposalsTemplate = z
	.object({
		ID: id,
		TemplateName: z.string().optional().nullable(),
		CoverID: id.optional().nullable(),
		BrandID: id.optional().nullable(),
		Description: z.string().optional().nullable(),
	})
	.loose();

export type BetterProposalsTemplate = z.infer<typeof BetterProposalsTemplate>;

/**
 * Better Proposals document type.
 * Official: GET /doctype, POST /doctype/create
 * https://betterproposals.io/resources/api/
 */
export const BetterProposalsDocumentType = z
	.object({
		ID: id,
		TypeName: z.string(),
		TypeColour: z.string().optional().nullable(),
		TypeNameSingular: z.string().optional().nullable(),
		TypeIcon: z.string().optional().nullable(),
	})
	.loose();

export type BetterProposalsDocumentType = z.infer<
	typeof BetterProposalsDocumentType
>;

/**
 * Better Proposals quote.
 * Official: GET /quote, GET /quote/:QUOTE_ID
 * https://betterproposals.io/resources/api/
 */
export const BetterProposalsQuote = z
	.object({
		ID: id,
		CompanyID: id.optional().nullable(),
		QuoteAmount: z.string().optional().nullable(),
		QuoteTotal: z.string().optional().nullable(),
		Status: z.union([z.string(), z.number()]).optional().nullable(),
	})
	.loose();

export type BetterProposalsQuote = z.infer<typeof BetterProposalsQuote>;

/**
 * Better Proposals company.
 * Official: GET /company, GET /company/:COMPANY_ID, POST /company/create
 * https://betterproposals.io/resources/api/
 */
export const BetterProposalsCompany = z
	.object({
		ID: id,
		CompanyName: z.string(),
		CompanyCRMID: z.string().optional().nullable(),
		AccountID: id.optional().nullable(),
		DemoCompany: z.union([z.string(), z.number()]).optional().nullable(),
		DateCreated: z.string().optional().nullable(),
	})
	.loose();

export type BetterProposalsCompany = z.infer<typeof BetterProposalsCompany>;

/**
 * Better Proposals currency.
 * Official: GET /currency, GET /currency/:CURRENCY_ID
 * https://betterproposals.io/resources/api/
 */
export const BetterProposalsCurrency = z
	.object({
		ID: id,
		CurrencyName: z.string().optional().nullable(),
		CurrencySymbol: z.string().optional().nullable(),
		CurrencyCode: z.string().optional().nullable(),
		ZeroDecimal: z.union([z.string(), z.number()]).optional().nullable(),
		StripeSupport: z.union([z.string(), z.number()]).optional().nullable(),
		PaypalSupport: z.union([z.string(), z.number()]).optional().nullable(),
	})
	.loose();

export type BetterProposalsCurrency = z.infer<typeof BetterProposalsCurrency>;

/**
 * Better Proposals account settings.
 * Official: GET /settings
 * https://betterproposals.io/resources/api/
 */
export const BetterProposalsSettings = z
	.object({
		ID: id.optional().nullable(),
		AccountID: id.optional().nullable(),
		CurrencyID: id.optional().nullable(),
		Tax: z.union([z.string(), z.number()]).optional().nullable(),
		TaxLabel: z.string().optional().nullable(),
		TaxAmount: z.string().optional().nullable(),
		TimeZone: z.string().optional().nullable(),
		CustomerJourneysActive: z
			.union([z.string(), z.number()])
			.optional()
			.nullable(),
		CustomerJourneysDefault: id.optional().nullable(),
	})
	.loose();

export type BetterProposalsSettings = z.infer<typeof BetterProposalsSettings>;

/**
 * Better Proposals default brand settings.
 * Official: GET /settings/brand
 * https://betterproposals.io/resources/api/
 */
export const BetterProposalsBrand = z
	.object({
		ID: id.optional().nullable(),
		Name: z.string().optional().nullable(),
		CompanyName: z.string().optional().nullable(),
		CurrencyID: id.optional().nullable(),
		Tax: z.union([z.string(), z.number()]).optional().nullable(),
		TaxLabel: z.string().optional().nullable(),
		TaxAmount: z.string().optional().nullable(),
		Default: z.union([z.string(), z.number()]).optional().nullable(),
	})
	.loose();

export type BetterProposalsBrand = z.infer<typeof BetterProposalsBrand>;

/**
 * Better Proposals custom merge tag.
 * Official: GET /settings/merge_tag
 * https://betterproposals.io/resources/api/
 */
export const BetterProposalsMergeTag = z
	.object({
		ID: id,
		Name: z.string().optional().nullable(),
		Tag: z.string().optional().nullable(),
		Fallback: z.string().optional().nullable(),
	})
	.loose();

export type BetterProposalsMergeTag = z.infer<typeof BetterProposalsMergeTag>;

/**
 * Better Proposals proposal cover.
 * Official: POST /proposal/cover/create
 * https://betterproposals.io/resources/api/
 */
export const BetterProposalsCover = z
	.object({
		ID: id.optional(),
		Name: z.string().optional().nullable(),
		BrandID: id.optional().nullable(),
		Headline: z.string().optional().nullable(),
		Subheader: z.string().optional().nullable(),
		BGColour: z.string().optional().nullable(),
		TextColour: z.string().optional().nullable(),
		TextAlign: z.string().optional().nullable(),
		ButtonStyle: z.string().optional().nullable(),
		ButtonText: z.string().optional().nullable(),
	})
	.loose();

export type BetterProposalsCover = z.infer<typeof BetterProposalsCover>;
