import { z } from 'zod';

// Inputs use More Trees' own parameter names. Sources: the API guide
// (https://moretrees.eco/learn/user-guides/api) and the OpenAPI documents the
// services publish at /<service>-api/v3/api-docs (the `external` tag; the
// transaction service's document answered 500 on 11-26, so trees.plant
// follows the guide). Responses are loose objects with nullish fields.
//
// IDs: More Trees issues 64-bit project and tree IDs (1212386588741402633)
// that a JavaScript number cannot hold. Every ID in a response is a string;
// ID inputs take that string, or a number for small IDs.

const IdOutput = z
	.string()
	.describe('A More Trees ID, as a string (IDs can exceed 2^53).');

const IdInput = z
	.union([
		z.string().regex(/^\d+$/, 'IDs are digits'),
		z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
	])
	.describe(
		'A More Trees ID. Pass the string from projects.list unchanged; large IDs do not fit in a number.',
	);

const AccountCodeInput = z
	.string()
	.min(1)
	.describe(
		'The More Trees account code, from Settings > Account Settings. Defaults to the stored account_code.',
	);

// ── account.get ───────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({
	accountCode: AccountCodeInput.optional(),
});

export type AccountGetInput = z.input<typeof AccountGetInputSchema>;

// AccountInformation in the user-management OpenAPI document.
const AccountGetResponseSchema = z
	.object({
		account_code: z.string().nullish(),
		account_name: z.string().nullish(),
		credit_balance: z.number().nullish(),
		forest_name: z.string().nullish(),
		forest_slug: z.string().nullish(),
	})
	.loose();

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── forest.get ────────────────────────────────────────────────────────────

const ForestGetInputSchema = z.object({
	forestSlugOrAccountCode: z
		.string()
		.min(1)
		.optional()
		.describe(
			'The forest slug or the account code, from Settings > Account Settings. Defaults to the stored account_code.',
		),
});

export type ForestGetInput = z.input<typeof ForestGetInputSchema>;

// ForestDto in the user-management OpenAPI document.
const ForestGetResponseSchema = z
	.object({
		forest_name: z.string().nullish(),
		logo_url: z.string().nullish(),
		brand_color: z.string().nullish(),
		totals: z
			.object({
				trees_planted: z.number().nullish(),
				trees_gifted: z.number().nullish(),
				trees_received: z.number().nullish(),
				co2_captured: z.number().nullish(),
				projects_supported: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type ForestGetResponse = z.infer<typeof ForestGetResponseSchema>;

// ── projects.list ─────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

// TreeInformationDto. The guide spells the CO2 field `tonnes_c02`; the
// OpenAPI document and the live API (11-26) use `tonnes_co2`.
const ProjectTreeSchema = z
	.object({
		default: z.boolean().nullish(),
		id: IdOutput.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		tonnes_co2: z.number().nullish(),
		credits_required: z.number().nullish(),
		tree_image: z.string().nullish(),
		total: z.number().nullish(),
	})
	.loose();

// ProjectInformationDto.
const ProjectSchema = z
	.object({
		default: z.boolean().nullish(),
		id: IdOutput.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		country: z.string().nullish(),
		project_type: z.string().nullish(),
		supplier_name: z.string().nullish(),
		project_image: z.string().nullish(),
		trees: z.array(ProjectTreeSchema).nullish(),
	})
	.loose();

// ProjectsInformationDto: `{ data: [...] }`. The live API also sends `total`
// (the project count). The guide's bare array is wrong.
const ProjectsListResponseSchema = z
	.object({
		data: z.array(ProjectSchema),
		total: z.number().nullish(),
	})
	.loose();

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

// ── projects.calculateCo2 ─────────────────────────────────────────────────

const ProjectsCalculateCo2InputSchema = z.object({
	totalTreesByProjectTree: z
		.record(
			z.string().regex(/^\d+$/, 'keys are project tree IDs'),
			z.object({
				receivedAndPlantedTrees: z
					.number()
					.int()
					.nonnegative()
					.optional()
					.describe('Trees received and planted.'),
				giftedAndPlantedTrees: z
					.number()
					.int()
					.nonnegative()
					.optional()
					.describe('Trees gifted and planted.'),
			}),
		)
		.describe(
			'Tree counts keyed by project tree ID. Project tree IDs are not tree IDs and no API-key route lists them; 26 and 28 are known (probed 11-26).',
		),
});

export type ProjectsCalculateCo2Input = z.input<
	typeof ProjectsCalculateCo2InputSchema
>;

// TotalProjectAndCo2Dto.
const ProjectsCalculateCo2ResponseSchema = z
	.object({
		totalCo2: z.number().nullish(),
		supportedProjects: z.number().nullish(),
	})
	.loose();

export type ProjectsCalculateCo2Response = z.infer<
	typeof ProjectsCalculateCo2ResponseSchema
>;

// ── trees.plant ───────────────────────────────────────────────────────────

const RecipientSchema = z
	.object({
		account_code: z
			.string()
			.optional()
			.describe('The recipient More Trees account code.'),
		email: z
			.string()
			.optional()
			.describe(
				'The recipient email address; required when account_code is not given.',
			),
		name: z.string().min(1).describe("The recipient's name."),
		quantity: z
			.number()
			.int()
			.positive()
			.describe('How many trees to plant for this recipient.'),
	})
	.superRefine((value, ctx) => {
		if (!value.account_code && !value.email) {
			ctx.addIssue({
				code: 'custom',
				message: 'each recipient needs an account_code or an email',
			});
		}
	});

const PlantCommon = {
	payment_account_code: z
		.string()
		.min(1)
		.optional()
		.describe(
			'The account code of the payment account the credits come from. Defaults to the stored account_code.',
		),
	test: z
		.boolean()
		.optional()
		.describe(
			'True evaluates the request as a dry run without persisting changes; the balance must still cover it (400 MTT-6006 otherwise). Defaults to false, which plants real trees and spends credits.',
		),
	project_id: IdInput.optional().describe(
		'The project to plant in, from projects.list; omitted selects the default project.',
	),
	tree_id: IdInput.optional().describe(
		'The tree to plant, from the project in projects.list; omitted selects the default tree.',
	),
};

const TreesPlantSelfInputSchema = z.object({
	...PlantCommon,
	plant_for_others: z.literal(false),
	quantity: z
		.number()
		.int()
		.positive()
		.describe('The total quantity of trees to plant; must be greater than 0.'),
});

export type TreesPlantSelfInput = z.input<typeof TreesPlantSelfInputSchema>;

const TreesPlantOthersInputSchema = z.object({
	...PlantCommon,
	plant_for_others: z.literal(true),
	recipients: z
		.array(RecipientSchema)
		.min(1)
		.describe('The recipients to plant for.'),
});

export type TreesPlantOthersInput = z.input<typeof TreesPlantOthersInputSchema>;

const TreesPlantInputSchema = z.discriminatedUnion('plant_for_others', [
	TreesPlantSelfInputSchema,
	TreesPlantOthersInputSchema,
]);

export type TreesPlantInput = z.input<typeof TreesPlantInputSchema>;

const TreesPlantResponseSchema = z
	.object({
		test: z.boolean().nullish(),
		plant_for_others: z.boolean().nullish(),
		credits_used: z.number().nullish(),
		credits_remaining: z.number().nullish(),
		project_id: IdOutput.nullish(),
		tree_id: IdOutput.nullish(),
		recipients: z
			.array(
				z
					.object({
						account_code: z.string().nullish(),
						account_name: z.string().nullish(),
						quantity: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type TreesPlantResponse = z.infer<typeof TreesPlantResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type MoreTreesEndpointInputs = {
	accountGet: AccountGetInput;
	forestGet: ForestGetInput;
	projectsList: ProjectsListInput;
	projectsCalculateCo2: ProjectsCalculateCo2Input;
	treesPlant: TreesPlantInput;
};

export type MoreTreesEndpointOutputs = {
	accountGet: AccountGetResponse;
	forestGet: ForestGetResponse;
	projectsList: ProjectsListResponse;
	projectsCalculateCo2: ProjectsCalculateCo2Response;
	treesPlant: TreesPlantResponse;
};

export const MoreTreesEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	forestGet: ForestGetInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsCalculateCo2: ProjectsCalculateCo2InputSchema,
	treesPlant: TreesPlantInputSchema,
} as const;

export const MoreTreesEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	forestGet: ForestGetResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsCalculateCo2: ProjectsCalculateCo2ResponseSchema,
	treesPlant: TreesPlantResponseSchema,
} as const;
