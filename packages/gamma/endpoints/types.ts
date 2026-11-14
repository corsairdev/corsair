import { z } from 'zod';

// Inputs use Gamma's own camelCase names. Outputs are `.loose()` with their
// documented fields nullish, so a field Gamma adds or omits cannot fail a read
// that has already happened. Shapes come from the OpenAPI fragments embedded in
// https://developers.gamma.app.

const GammaIdSchema = z
	.string()
	.min(1)
	.describe(
		'The Gamma file ID, or the doc ID from a `gamma.app/docs/...` URL.',
	);

const GenerationIdSchema = z
	.string()
	.min(1)
	.describe('The `generationId` a create returned.');

export const GAMMA_FORMATS = [
	'presentation',
	'document',
	'social',
	'webpage',
] as const;
// The agent route makes the first three; a webpage is Classic only.
export const GAMMA_AGENT_FORMATS = [
	'presentation',
	'document',
	'social',
] as const;
export const GAMMA_TEXT_MODES = ['generate', 'condense', 'preserve'] as const;
export const GAMMA_EXPORT_FORMATS = ['pdf', 'pptx', 'png'] as const;

export const GAMMA_GENERATION_STATUSES = [
	'pending',
	'completed',
	'failed',
] as const;
export const GAMMA_EXPORT_STATUSES = [
	'pending',
	'completed',
	'failed',
] as const;

const CardDimensionsSchema = z.enum([
	'16x9',
	'1x1',
	'4x3',
	'4x5',
	'9x16',
	'a4',
	'fluid',
	'letter',
	'pageless',
]);

const TextOptionsSchema = z.object({
	amount: z
		.enum(['brief', 'medium', 'detailed', 'extensive'])
		.optional()
		.describe('How much text each card gets.'),
	language: z
		.string()
		.min(1)
		.optional()
		.describe('A language code, such as `en`.'),
	tone: z.string().optional(),
	audience: z.string().optional(),
});

const ImageOptionsSchema = z.object({
	source: z
		.enum([
			'aiGenerated',
			'giphy',
			'noImages',
			'pexels',
			'pictographic',
			'placeholder',
			'themeAccent',
			'webAllImages',
			'webFreeToUse',
			'webFreeToUseCommercially',
		])
		.optional()
		.describe('Where images come from. `noImages` generates none.'),
	model: z
		.string()
		.optional()
		.describe('An image model, such as `flux-1-pro`.'),
	style: z.string().optional(),
});

const HeaderFooterElementSchema = z.object({
	type: z.enum(['cardNumber', 'image', 'text']),
	source: z.enum(['custom', 'themeLogo']).optional(),
	src: z.string().optional().describe('Required when `source` is `custom`.'),
	value: z.string().optional().describe('Required when `type` is `text`.'),
	size: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
});

const CardOptionsSchema = z.object({
	dimensions: CardDimensionsSchema.optional(),
	headerFooter: z
		.object({
			topLeft: HeaderFooterElementSchema.optional(),
			topCenter: HeaderFooterElementSchema.optional(),
			topRight: HeaderFooterElementSchema.optional(),
			bottomLeft: HeaderFooterElementSchema.optional(),
			bottomCenter: HeaderFooterElementSchema.optional(),
			bottomRight: HeaderFooterElementSchema.optional(),
			hideFromFirstCard: z.boolean().optional(),
			hideFromLastCard: z.boolean().optional(),
		})
		.optional(),
});

const SharingOptionsSchema = z.object({
	workspaceAccess: z
		.enum(['comment', 'edit', 'fullAccess', 'noAccess', 'view'])
		.optional(),
	externalAccess: z.enum(['comment', 'edit', 'noAccess', 'view']).optional(),
	emailOptions: z
		.object({
			access: z.enum(['comment', 'edit', 'fullAccess', 'view']).optional(),
			recipients: z.array(z.string().min(3)).min(1),
		})
		.optional(),
});

// ── generations.create ────────────────────────────────────────────────────

const PageGenerationSchema = z.object({
	inputText: z.string().min(1).max(400_000),
	title: z.string().min(1).max(500).optional(),
	textMode: z.enum(GAMMA_TEXT_MODES).optional(),
	format: z.enum(GAMMA_FORMATS).optional(),
	cardSplit: z.enum(['auto', 'inputTextBreaks']).optional(),
	additionalInstructions: z.string().max(5000).optional(),
	numCards: z.number().min(1).optional(),
	path: z
		.string()
		.min(1)
		.max(500)
		.optional()
		.describe(
			'URL slug for this page in a published site. Ignored for the first page.',
		),
	textOptions: TextOptionsSchema.optional(),
	imageOptions: ImageOptionsSchema.optional(),
});

const GenerationsCreateInputSchema = z
	.object({
		// A generation takes either a single `inputText` or a `pages` array, and
		// Gamma refuses a body with neither.
		inputText: z.string().min(1).max(400_000).optional(),
		pages: z
			.array(PageGenerationSchema)
			.min(1)
			.max(50)
			.optional()
			.describe(
				'A multi-page gamma. Takes precedence over the per-page fields at the top level.',
			),
		format: z.enum(GAMMA_FORMATS).optional(),
		textMode: z.enum(GAMMA_TEXT_MODES).optional(),
		cardSplit: z.enum(['auto', 'inputTextBreaks']).optional(),
		exportAs: z
			.enum(GAMMA_EXPORT_FORMATS)
			.optional()
			.describe(
				'Export automatically once the gamma is done. A `png` export is a zip of one image per card.',
			),
		title: z.string().min(1).max(500).optional(),
		additionalInstructions: z.string().max(5000).optional(),
		publish: z
			.boolean()
			.optional()
			.describe(
				'Publish a multi-page gamma as a site once every page succeeds.',
			),
		numCards: z.number().min(1).optional(),
		themeId: z.string().optional().describe('An `id` from `themes.list`.'),
		textOptions: TextOptionsSchema.optional(),
		imageOptions: ImageOptionsSchema.optional(),
		cardOptions: CardOptionsSchema.optional(),
		sharingOptions: SharingOptionsSchema.optional(),
		folderId: z
			.string()
			.optional()
			.describe('The folder to place the gamma in.'),
	})
	.superRefine((value, ctx) => {
		const hasText = value.inputText !== undefined;
		const hasPages = value.pages !== undefined;
		if (hasText === hasPages) {
			ctx.addIssue({
				code: 'custom',
				path: [hasText ? 'pages' : 'inputText'],
				message:
					'Send either `inputText` for one page or a `pages` array, not both and not neither.',
			});
		}
		if (value.publish === true && !hasPages) {
			ctx.addIssue({
				code: 'custom',
				path: ['publish'],
				message:
					'`publish` applies to a multi-page generation, so it needs `pages`.',
			});
		}
	});

export type GenerationsCreateInput = z.input<
	typeof GenerationsCreateInputSchema
>;

const CreateGenerationResponseSchema = z
	.object({
		generationId: z.string(),
		warnings: z
			.string()
			.nullish()
			.describe('File-level warnings, such as an option Gamma ignored.'),
		pageWarnings: z
			.array(z.string().nullable())
			.nullish()
			.describe('One entry per requested page, index-aligned with `pages`.'),
	})
	.loose();

export type CreateGenerationResponse = z.infer<
	typeof CreateGenerationResponseSchema
>;

// ── generations.get ───────────────────────────────────────────────────────

const GenerationGetInputSchema = z.object({ generationId: GenerationIdSchema });

export type GenerationGetInput = z.input<typeof GenerationGetInputSchema>;

const CreditsSchema = z
	.object({
		deducted: z.number().nullish(),
		remaining: z.number().nullish(),
	})
	.loose();

// Gamma's documented error object, on a failed job or a failed page.
const JobErrorSchema = z
	.object({
		message: z.string().nullish(),
		statusCode: z.number().nullish(),
	})
	.loose();

const PageResultSchema = z
	.object({
		status: z.string().nullish(),
		gammaId: z.string().nullish(),
		gammaUrl: z.string().nullish(),
		error: JobErrorSchema.nullish(),
		exportUrl: z.string().nullish(),
	})
	.loose();

const GenerationStatusResponseSchema = z
	.object({
		generationId: z.string(),
		status: z
			.string()
			.describe('`pending` is not final; `completed` and `failed` are.'),
		gammaId: z
			.string()
			.nullish()
			.describe('Set once the generation completes.'),
		gammaUrl: z.string().nullish(),
		error: JobErrorSchema.nullish(),
		exportUrl: z
			.string()
			.nullish()
			.describe(
				'A download link for the export, valid for about a week. Anyone holding it can download the file, so treat it as a secret and do not log it.',
			),
		credits: CreditsSchema.nullish(),
		pages: z
			.array(PageResultSchema)
			.nullish()
			.describe('Per-page results, only for a multi-page generation.'),
	})
	.loose();

export type GenerationStatusResponse = z.infer<
	typeof GenerationStatusResponseSchema
>;

// ── agent.generate / agent.get ────────────────────────────────────────────

// The agent route runs Gamma 5 from a single brief, which is the one to use for
// a new presentation, document or social post.
const AgentGenerateInputSchema = z.object({
	prompt: z
		.string()
		.min(1)
		.describe('The brief: what to generate. The only required field.'),
	title: z.string().optional(),
	format: z
		.enum(GAMMA_AGENT_FORMATS)
		.optional()
		.describe(
			'Defaults to `presentation`. A webpage needs `generations.create`.',
		),
	numCards: z
		.number()
		.min(1)
		.optional()
		.describe('Target cards, capped by the plan’s maximum.'),
	themeId: z.string().optional(),
	templateId: z
		.string()
		.optional()
		.describe('An accessible workspace template.'),
	quality: z
		.enum(['lite', 'standard', 'max'])
		.optional()
		.describe('A quality preset; `max` spends more credits.'),
	additionalInstructions: z.string().optional(),
	exportAs: z.enum(GAMMA_EXPORT_FORMATS).optional(),
	folderId: z.string().optional(),
	sourceUrls: z
		.array(z.url())
		.max(10)
		.optional()
		.describe('Up to 10 pages the agent reads as source material.'),
	disableConnectors: z
		.boolean()
		.optional()
		.describe('Opt this run out of the workspace’s connectors.'),
	sharingOptions: SharingOptionsSchema.optional(),
});

export type AgentGenerateInput = z.input<typeof AgentGenerateInputSchema>;

const AgentWarningSchema = z
	.object({
		code: z
			.string()
			.describe('Such as `ignored_folder_id` or `export_failed`.'),
		message: z.string().nullish(),
	})
	.loose();

// A 202 without the ID leaves a started job nobody can poll, so it is required.
const AgentGenerationResponseSchema = z
	.object({
		generationId: z.string().min(1),
		status: z.string().nullish(),
		warnings: z
			.array(AgentWarningSchema)
			.nullish()
			.describe(
				'Options Gamma ignored or could not apply. Keep them: the status read does not always repeat them.',
			),
	})
	.loose();

export type AgentGenerationResponse = z.infer<
	typeof AgentGenerationResponseSchema
>;

const AgentGetInputSchema = z.object({ generationId: GenerationIdSchema });

export type AgentGetInput = z.input<typeof AgentGetInputSchema>;

// The agent status has the same terminal states as a Classic one, but nests the
// gamma under `gamma` (which can appear while still pending) and adds the
// agent's own summary, progress and a machine-readable failure reason.
const AgentStatusResponseSchema = z
	.object({
		generationId: z.string(),
		status: z
			.string()
			.describe('`pending` is not final; `completed` and `failed` are.'),
		gamma: z
			.object({
				gammaId: z.string(),
				gammaUrl: z.string().nullish(),
				title: z.string().nullish(),
			})
			.loose()
			.nullish()
			.describe(
				'The generated gamma. Can appear while pending, once the document exists.',
			),
		result: z
			.object({ summary: z.string().nullish() })
			.loose()
			.nullish()
			.describe('The agent’s summary of what it made, once completed.'),
		progress: z
			.object({
				done: z.number().nullish(),
				total: z.number().nullish(),
				percent: z.number().nullish().describe('0 to 99 until completed.'),
			})
			.loose()
			.nullish(),
		error: JobErrorSchema.extend({
			reason: z
				.string()
				.nullish()
				.describe(
					'Such as `insufficient_credits`, `timeout` or `generation_failed`.',
				),
		})
			.loose()
			.nullish(),
		exportUrl: z
			.string()
			.nullish()
			.describe(
				'A download link for the export, valid for about a week. Anyone holding it can download the file, so treat it as a secret and do not log it.',
			),
		warnings: z.array(AgentWarningSchema).nullish(),
		credits: CreditsSchema.nullish(),
		updatedTime: z.string().nullish(),
	})
	.loose();

export type AgentStatusResponse = z.infer<typeof AgentStatusResponseSchema>;

// ── gammas ────────────────────────────────────────────────────────────────

const AuthorSchema = z
	.object({
		name: z.string().nullish(),
		avatarUrl: z.string().nullish(),
	})
	.loose();

export const GammaSchema = z
	.object({
		id: z.string(),
		title: z.string().nullish(),
		type: z.string().nullish().describe('`regular` or `template`.'),
		url: z.string().nullish(),
		thumbnailUrl: z
			.string()
			.nullish()
			.describe(
				'Usually signed and valid about a week, so re-read rather than store it.',
			),
		description: z.string().nullish(),
		author: AuthorSchema.nullish(),
		createdTime: z.string().nullish(),
		updatedTime: z.string().nullish(),
		themeId: z.string().nullish(),
		archived: z.boolean().nullish(),
		// Not in Gamma's OpenAPI, but the live API returns it (checked 11-14).
		folderId: z.string().nullish(),
	})
	.loose();

export type Gamma = z.infer<typeof GammaSchema>;

const GammaGetInputSchema = z.object({ gammaId: GammaIdSchema });

export type GammaGetInput = z.input<typeof GammaGetInputSchema>;

const GammaGetResponseSchema = GammaSchema.loose();

export type GammaGetResponse = z.infer<typeof GammaGetResponseSchema>;

const GammaArchiveInputSchema = z.object({ gammaId: GammaIdSchema });

export type GammaArchiveInput = z.input<typeof GammaArchiveInputSchema>;

// Gamma answers `{ gammaId, archived: true }`; the endpoint maps that to this,
// so a body that does not confirm the archive fails here.
const ArchivedResponseSchema = z.object({
	success: z.literal(true),
	gamma_id: z.string().min(1),
});

export type ArchivedResponse = z.infer<typeof ArchivedResponseSchema>;

const GammaRemoveInputSchema = z.object({ gammaId: GammaIdSchema });

export type GammaRemoveInput = z.input<typeof GammaRemoveInputSchema>;

const GammaRemoveResponseSchema = z
	.object({
		status: z.string().nullish().describe('`deleted` once Gamma removed it.'),
		gammaId: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

export type GammaRemoveResponse = z.infer<typeof GammaRemoveResponseSchema>;

const GammasSearchInputSchema = z
	.object({
		q: z
			.string()
			.optional()
			.describe(
				'Full-text query over titles and body text. Optional only when `createdBy`, `updatedAfter` or `updatedBefore` is set.',
			),
		createdBy: z
			.string()
			.optional()
			.describe(
				'Only gammas this user created: `me`, an email address or a user ID.',
			),
		updatedAfter: z.string().optional().describe('ISO 8601.'),
		updatedBefore: z.string().optional().describe('ISO 8601.'),
		includeArchived: z.boolean().optional(),
		limit: z.number().int().min(1).max(25).optional(),
	})
	.refine(
		(value) =>
			(value.q !== undefined && value.q.length > 0) ||
			value.createdBy !== undefined ||
			value.updatedAfter !== undefined ||
			value.updatedBefore !== undefined,
		{
			message:
				'Send `q`, or at least one of `createdBy`, `updatedAfter` or `updatedBefore`.',
			path: ['q'],
		},
	);

export type GammasSearchInput = z.input<typeof GammasSearchInputSchema>;

const SearchHitSchema = z
	.object({
		id: z.string(),
		title: z.string().nullish(),
		url: z.string().nullish(),
		highlight: z
			.string()
			.nullish()
			.describe('The matching passage, when `q` was sent.'),
		createdBy: z.string().nullish(),
		updatedTime: z.string().nullish(),
		archived: z.boolean().nullish(),
	})
	.loose();

export type GammaSearchHit = z.infer<typeof SearchHitSchema>;

const GammasSearchResponseSchema = z
	.object({ hits: z.array(SearchHitSchema) })
	.loose();

export type GammasSearchResponse = z.infer<typeof GammasSearchResponseSchema>;

// ── exports ───────────────────────────────────────────────────────────────

const GammaExportInputSchema = z.object({
	gammaId: GammaIdSchema,
	format: z
		.enum(GAMMA_EXPORT_FORMATS)
		.describe(
			'Sent as Gamma’s `exportAs`, which is required. A `png` export is a zip of one image per card.',
		),
});

export type GammaExportInput = z.input<typeof GammaExportInputSchema>;

const ExportStartResponseSchema = z
	.object({
		exportId: z.string(),
		status: z.string().nullish(),
	})
	.loose();

export type ExportStartResponse = z.infer<typeof ExportStartResponseSchema>;

const ExportGetInputSchema = z.object({
	exportId: z.string().min(1).describe('The `exportId` the export returned.'),
});

export type ExportGetInput = z.input<typeof ExportGetInputSchema>;

const ExportStatusResponseSchema = z
	.object({
		exportId: z.string().nullish(),
		gammaId: z.string().nullish(),
		exportAs: z.string().nullish(),
		status: z
			.string()
			.describe('`pending` is not final; `completed` and `failed` are.'),
		exportUrl: z
			.string()
			.nullish()
			.describe(
				'A download link valid about a week. Anyone holding it can download the file, so treat it as a secret and do not log it.',
			),
		error: JobErrorSchema.nullish(),
	})
	.loose();

export type ExportStatusResponse = z.infer<typeof ExportStatusResponseSchema>;

// ── workspace ─────────────────────────────────────────────────────────────

const ListCursorInputSchema = z.object({
	query: z.string().optional().describe('Filter by name.'),
	limit: z.number().int().min(1).max(50).optional(),
	after: z
		.string()
		.min(1)
		.optional()
		.describe('The `nextCursor` of the page before.'),
});

const ThemesListInputSchema = ListCursorInputSchema.extend({
	type: z
		.enum(['standard', 'custom'])
		.optional()
		.describe(
			'`standard` for Gamma’s own themes, `custom` for the workspace’s.',
		),
});

export type ThemesListInput = z.input<typeof ThemesListInputSchema>;

const ThemeSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		type: z.string().nullish().describe('`standard` or `custom`.'),
	})
	.loose();

export type GammaTheme = z.infer<typeof ThemeSchema>;

const ThemesListResponseSchema = z
	.object({
		data: z.array(ThemeSchema),
		hasMore: z.boolean().nullish(),
		nextCursor: z
			.string()
			.nullable()
			.describe('The `after` for the next page; null when there is none.'),
	})
	.loose();

export type ThemesListResponse = z.infer<typeof ThemesListResponseSchema>;

const FoldersListInputSchema = ListCursorInputSchema;

export type FoldersListInput = z.input<typeof FoldersListInputSchema>;

const FolderSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
	})
	.loose();

export type GammaFolder = z.infer<typeof FolderSchema>;

const FoldersListResponseSchema = z
	.object({
		data: z.array(FolderSchema),
		hasMore: z.boolean().nullish(),
		nextCursor: z.string().nullable(),
	})
	.loose();

export type FoldersListResponse = z.infer<typeof FoldersListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type GammaEndpointInputs = {
	generationsCreate: GenerationsCreateInput;
	generationsGet: GenerationGetInput;
	agentGenerate: AgentGenerateInput;
	agentGet: AgentGetInput;
	gammasGet: GammaGetInput;
	gammasSearch: GammasSearchInput;
	gammasArchive: GammaArchiveInput;
	gammasRemove: GammaRemoveInput;
	exportsStart: GammaExportInput;
	exportsGet: ExportGetInput;
	themesList: ThemesListInput;
	foldersList: FoldersListInput;
};

export type GammaEndpointOutputs = {
	generationsCreate: CreateGenerationResponse;
	generationsGet: GenerationStatusResponse;
	agentGenerate: AgentGenerationResponse;
	agentGet: AgentStatusResponse;
	gammasGet: GammaGetResponse;
	gammasSearch: GammasSearchResponse;
	gammasArchive: ArchivedResponse;
	gammasRemove: GammaRemoveResponse;
	exportsStart: ExportStartResponse;
	exportsGet: ExportStatusResponse;
	themesList: ThemesListResponse;
	foldersList: FoldersListResponse;
};

export const GammaEndpointInputSchemas = {
	generationsCreate: GenerationsCreateInputSchema,
	generationsGet: GenerationGetInputSchema,
	agentGenerate: AgentGenerateInputSchema,
	agentGet: AgentGetInputSchema,
	gammasGet: GammaGetInputSchema,
	gammasSearch: GammasSearchInputSchema,
	gammasArchive: GammaArchiveInputSchema,
	gammasRemove: GammaRemoveInputSchema,
	exportsStart: GammaExportInputSchema,
	exportsGet: ExportGetInputSchema,
	themesList: ThemesListInputSchema,
	foldersList: FoldersListInputSchema,
} as const;

export const GammaEndpointOutputSchemas = {
	generationsCreate: CreateGenerationResponseSchema,
	generationsGet: GenerationStatusResponseSchema,
	agentGenerate: AgentGenerationResponseSchema,
	agentGet: AgentStatusResponseSchema,
	gammasGet: GammaGetResponseSchema,
	gammasSearch: GammasSearchResponseSchema,
	gammasArchive: ArchivedResponseSchema,
	gammasRemove: GammaRemoveResponseSchema,
	exportsStart: ExportStartResponseSchema,
	exportsGet: ExportStatusResponseSchema,
	themesList: ThemesListResponseSchema,
	foldersList: FoldersListResponseSchema,
} as const;
