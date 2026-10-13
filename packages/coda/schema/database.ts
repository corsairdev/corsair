import { z } from 'zod';

// Entities follow the Coda API v1 response objects: https://coda.io/developers/apis/v1
// Fields that only the "get" variant of an object returns (list endpoints return a reference) are optional.

const WorkspaceReference = z.object({
	id: z.string(),
	type: z.string(),
	organizationId: z.string().optional(),
	browserLink: z.string(),
	name: z.string().optional(),
});

const FolderReference = z.object({
	id: z.string(),
	type: z.string(),
	browserLink: z.string(),
	name: z.string().optional(),
});

const PageReference = z.object({
	id: z.string(),
	type: z.string(),
	href: z.string(),
	browserLink: z.string(),
	name: z.string(),
});

const TableReference = z.object({
	id: z.string(),
	type: z.string(),
	tableType: z.string(),
	href: z.string(),
	browserLink: z.string(),
	name: z.string(),
	parent: PageReference.optional(),
});

const ColumnReference = z.object({
	id: z.string(),
	type: z.string(),
	href: z.string(),
});

const Icon = z.object({
	name: z.string(),
	type: z.string(),
	browserLink: z.string(),
});

const PersonValue = z.object({
	'@context': z.string(),
	'@type': z.string(),
	additionalType: z.string().optional(),
	name: z.string(),
	email: z.string().optional(),
});

// https://coda.io/developers/apis/v1#tag/Docs/operation/getDoc
export const CodaDocument = z.object({
	id: z.string(),
	type: z.string().optional(),
	href: z.string().optional(),
	browserLink: z.string().optional(),
	icon: Icon.optional(),
	name: z.string(),
	owner: z.string().optional(),
	ownerName: z.string().optional(),
	docSize: z
		.object({
			totalRowCount: z.number(),
			tableAndViewCount: z.number(),
			baseTableCount: z.number().optional(),
			pageCount: z.number(),
			overApiSizeLimit: z.boolean(),
		})
		.optional(),
	sourceDoc: z
		.object({
			id: z.string(),
			type: z.string(),
			href: z.string(),
			browserLink: z.string(),
		})
		.optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	published: z
		.object({
			description: z.string().optional(),
			browserLink: z.string(),
			imageLink: z.string().optional(),
			discoverable: z.boolean(),
			earnCredit: z.boolean(),
			mode: z.string(),
			categories: z.array(z.object({ name: z.string() })),
		})
		.optional(),
	folder: FolderReference.optional(),
	workspace: WorkspaceReference.optional(),
	workspaceId: z.string().optional(),
	folderId: z.string().optional(),
});

export type CodaDocument = z.infer<typeof CodaDocument>;

// https://coda.io/developers/apis/v1#tag/Pages/operation/getPage
export const CodaPage = z.object({
	id: z.string(),
	type: z.string(),
	href: z.string(),
	browserLink: z.string(),
	name: z.string(),
	subtitle: z.string().optional(),
	icon: Icon.optional(),
	image: z
		.object({
			browserLink: z.string(),
			type: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
		})
		.optional(),
	contentType: z.string(),
	isHidden: z.boolean(),
	isEffectivelyHidden: z.boolean(),
	parent: PageReference.optional(),
	children: z.array(PageReference),
	authors: z.array(PersonValue).optional(),
	createdAt: z.string().optional(),
	createdBy: PersonValue.optional(),
	updatedAt: z.string().optional(),
	updatedBy: PersonValue.optional(),
});

export type CodaPage = z.infer<typeof CodaPage>;

// https://coda.io/developers/apis/v1#tag/Tables/operation/getTable
export const CodaTable = z.object({
	id: z.string(),
	type: z.string(),
	tableType: z.string(),
	href: z.string(),
	browserLink: z.string(),
	name: z.string(),
	parent: PageReference.optional(),
	parentTable: TableReference.optional(),
	displayColumn: ColumnReference.optional(),
	rowCount: z.number().optional(),
	sorts: z
		.array(z.object({ column: ColumnReference, direction: z.string() }))
		.optional(),
	layout: z.string().optional(),
	filter: z
		.object({
			valid: z.boolean(),
			isVolatile: z.boolean().optional(),
			hasUserFormula: z.boolean().optional(),
			hasTodayFormula: z.boolean().optional(),
			hasNowFormula: z.boolean().optional(),
		})
		.optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type CodaTable = z.infer<typeof CodaTable>;

// https://coda.io/developers/apis/v1#tag/Columns/operation/getColumn
export const CodaColumn = z.object({
	id: z.string(),
	type: z.string(),
	href: z.string(),
	name: z.string(),
	display: z.boolean().optional(),
	calculated: z.boolean().optional(),
	formula: z.string().optional(),
	defaultValue: z.string().optional(),
	format: z.object({ type: z.string(), isArray: z.boolean() }).loose(),
	parent: TableReference.optional(),
});

export type CodaColumn = z.infer<typeof CodaColumn>;

// https://coda.io/developers/apis/v1#tag/Rows/operation/getRow
export const CodaRow = z.object({
	id: z.string(),
	type: z.string(),
	href: z.string(),
	name: z.string(),
	index: z.number(),
	browserLink: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	values: z.record(z.string(), z.json()),
});

export type CodaRow = z.infer<typeof CodaRow>;

// https://coda.io/developers/apis/v1#tag/Folders/operation/getFolder
export const CodaFolder = z.object({
	id: z.string(),
	type: z.string(),
	name: z.string(),
	browserLink: z.string(),
	description: z.string().optional(),
	icon: Icon.optional(),
	iconColor: z.string().optional(),
	createdAt: z.string().optional(),
	canEdit: z.boolean().optional(),
	workspace: WorkspaceReference.optional(),
});

export type CodaFolder = z.infer<typeof CodaFolder>;

// https://coda.io/developers/apis/v1#tag/Formulas/operation/getFormula
export const CodaFormula = z.object({
	id: z.string(),
	type: z.string(),
	href: z.string(),
	name: z.string(),
	parent: PageReference.optional(),
	value: z.json().optional(),
});

export type CodaFormula = z.infer<typeof CodaFormula>;

// https://coda.io/developers/apis/v1#tag/Controls/operation/getControl
export const CodaControl = z.object({
	id: z.string(),
	type: z.string(),
	href: z.string(),
	name: z.string(),
	parent: PageReference.optional(),
	controlType: z.string().optional(),
	value: z.json().optional(),
});

export type CodaControl = z.infer<typeof CodaControl>;

const PackImageFile = z.object({
	filename: z.string(),
	imageUrl: z.string(),
	assetId: z.string(),
	altText: z.string().optional(),
	mimeType: z.string().optional(),
});

const PackRateLimit = z.object({
	intervalSeconds: z.number(),
	operationsPerInterval: z.number(),
});

// https://coda.io/developers/apis/v1#tag/Packs/operation/getPack
export const CodaPack = z.object({
	id: z.number(),
	logoUrl: z.string().optional(),
	coverUrl: z.string().optional(),
	exampleImages: z.array(PackImageFile).optional(),
	agentImages: z.array(PackImageFile).optional(),
	workspaceId: z.string(),
	categories: z.array(
		z.object({
			categoryId: z.string(),
			categoryName: z.string(),
			categorySlug: z.string().optional(),
		}),
	),
	certified: z.boolean().optional(),
	certifiedAgent: z.boolean().optional(),
	sourceCodeVisibility: z.string().optional(),
	packEntrypoints: z.array(z.string()).optional(),
	verifiedVersion: z.string().optional(),
	name: z.string(),
	description: z.string(),
	shortDescription: z.string(),
	agentShortDescription: z.string().optional(),
	agentDescription: z.string().optional(),
	supportEmail: z.string().optional(),
	termsOfServiceUrl: z.string().optional(),
	privacyPolicyUrl: z.string().optional(),
	overallRateLimit: PackRateLimit.optional(),
	perConnectionRateLimit: PackRateLimit.optional(),
	featuredDocStatus: z.string().optional(),
	additionalInformation: z
		.object({
			privacyCollectsPersonalInfo: z.boolean().nullable().optional(),
			privacyPersonalInfoCategories: z.array(z.string()).nullable().optional(),
			privacyDataUsagePurposes: z.array(z.string()).nullable().optional(),
			privacyDataCollectedBy: z.array(z.string()).nullable().optional(),
		})
		.optional(),
});

export type CodaPack = z.infer<typeof CodaPack>;
