import { z } from 'zod';

// Inputs use More Trees' own parameter names from the API guide
// (https://moretrees.eco/learn/user-guides/api). The docs publish no
// response schemas, so read outputs pass through as open records (the
// projects list as an array of them) and only the plant response is typed.

// ── account.get ───────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({
	accountCode: z
		.string()
		.min(1)
		.describe('The More Trees account code, from Settings > Account Settings.'),
});

export type AccountGetInput = z.input<typeof AccountGetInputSchema>;

const AccountGetResponseSchema = z.record(z.string(), z.unknown());

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── forest.get ────────────────────────────────────────────────────────────

const ForestGetInputSchema = z.object({
	forestSlugOrAccountCode: z
		.string()
		.min(1)
		.describe(
			'The forest slug or the account code, from Settings > Account Settings.',
		),
});

export type ForestGetInput = z.input<typeof ForestGetInputSchema>;

const ForestGetResponseSchema = z.record(z.string(), z.unknown());

export type ForestGetResponse = z.infer<typeof ForestGetResponseSchema>;

// ── projects.list ─────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

// The guide documents the projects response as an array of project records.
const ProjectsListResponseSchema = z.array(z.record(z.string(), z.unknown()));

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

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

const TreesPlantSelfInputSchema = z.object({
	payment_account_code: z
		.string()
		.min(1)
		.describe('The account code of the payment account the credits come from.'),
	test: z
		.boolean()
		.optional()
		.describe(
			'True evaluates the request as a dry run without persisting changes. Defaults to false.',
		),
	plant_for_others: z.literal(false),
	quantity: z
		.number()
		.int()
		.positive()
		.describe('The total quantity of trees to plant; must be greater than 0.'),
	project_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The project to plant in; omitted selects the default project.'),
	tree_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The tree to plant; omitted selects the default tree.'),
});

export type TreesPlantSelfInput = z.input<typeof TreesPlantSelfInputSchema>;

const TreesPlantOthersInputSchema = z.object({
	payment_account_code: z
		.string()
		.min(1)
		.describe('The account code of the payment account the credits come from.'),
	test: z
		.boolean()
		.optional()
		.describe(
			'True evaluates the request as a dry run without persisting changes. Defaults to false.',
		),
	plant_for_others: z.literal(true),
	project_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The project to plant in; omitted selects the default project.'),
	tree_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The tree to plant; omitted selects the default tree.'),
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
		project_id: z.number().nullish(),
		tree_id: z.number().nullish(),
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
	treesPlant: TreesPlantInput;
};

export type MoreTreesEndpointOutputs = {
	accountGet: AccountGetResponse;
	forestGet: ForestGetResponse;
	projectsList: ProjectsListResponse;
	treesPlant: TreesPlantResponse;
};

export const MoreTreesEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	forestGet: ForestGetInputSchema,
	projectsList: ProjectsListInputSchema,
	treesPlant: TreesPlantInputSchema,
} as const;

export const MoreTreesEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	forestGet: ForestGetResponseSchema,
	projectsList: ProjectsListResponseSchema,
	treesPlant: TreesPlantResponseSchema,
} as const;
