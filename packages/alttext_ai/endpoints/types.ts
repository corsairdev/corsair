import { z } from 'zod';

export const AltTextAiImageSchema = z
	.object({
		asset_id: z.string().optional(),
		url: z.string().optional(),
		alt_text: z.string().nullable().optional(),
		alt_texts: z.record(z.string(), z.string()).optional(),
		tags: z.array(z.string()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		created_at: z.number().optional(),
		credits_used: z.number().optional(),
		errors: z.record(z.string(), z.unknown()).optional(),
		error_code: z.string().nullable().optional(),
	})
	.loose();

export type AltTextAiImage = z.infer<typeof AltTextAiImageSchema>;

export const ListImagesInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page (max 100)'),
	url: z.string().optional().describe('Exact image URL filter (no wildcards)'),
});

export type ListImagesInput = z.infer<typeof ListImagesInputSchema>;

export const ListImagesResponseSchema = z
	.object({
		images: z.array(AltTextAiImageSchema),
	})
	.loose();

export type ListImagesResponse = z.infer<typeof ListImagesResponseSchema>;

export const ImagePayloadSchema = z
	.object({
		url: z.string().url().optional(),
		raw: z.string().optional(),
		asset_id: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose()
	.refine(
		(image) => {
			const hasUrl = Boolean(image.url);
			const hasRaw = Boolean(image.raw);
			return (hasUrl || hasRaw) && !(hasUrl && hasRaw);
		},
		{ message: 'Provide exactly one of image.url or image.raw' },
	);

export const CreateImageInputSchema = z
	.object({
		image: ImagePayloadSchema,
		async: z.boolean().optional(),
		lang: z.string().optional(),
		max_chars: z.number().int().min(80).max(500).optional(),
		model_name: z
			.enum([
				'describe-detailed',
				'describe-regular',
				'describe-factual',
				'succinct-describe-factual',
				'describe-terse',
			])
			.optional(),
		keywords: z.array(z.string()).max(6).optional(),
		negative_keywords: z.array(z.string()).max(6).optional(),
		keyword_source: z.string().optional(),
		gpt_prompt: z.string().optional(),
		overwrite: z.boolean().optional(),
		timeout_secs: z.number().int().min(5).max(30).optional(),
		webhook_url: z.string().optional(),
		ecomm: z
			.object({
				product: z.string().optional(),
				brand: z.string().optional(),
				color: z.string().optional(),
			})
			.optional(),
	})
	.loose();

export type CreateImageInput = z.infer<typeof CreateImageInputSchema>;

export const CreateImageResponseSchema = AltTextAiImageSchema;

export type CreateImageResponse = z.infer<typeof CreateImageResponseSchema>;

export const GetImageInputSchema = z.object({
	assetId: z.string().min(1).describe('Asset ID of the image'),
});

export type GetImageInput = z.infer<typeof GetImageInputSchema>;

export const GetImageResponseSchema = AltTextAiImageSchema;

export type GetImageResponse = z.infer<typeof GetImageResponseSchema>;

export const UpdateImageInputSchema = z.object({
	assetId: z.string().min(1).describe('Asset ID of the image to update'),
	lang: z.string().optional().describe('Language code(s), comma-separated'),
	overwrite: z.boolean().optional(),
	image: z
		.object({
			alt_text: z.string().optional(),
			asset_id: z.string().optional(),
			metadata: z.record(z.string(), z.unknown()).optional(),
		})
		.loose(),
});

export type UpdateImageInput = z.infer<typeof UpdateImageInputSchema>;

export const UpdateImageResponseSchema = AltTextAiImageSchema;

export type UpdateImageResponse = z.infer<typeof UpdateImageResponseSchema>;

export const DeleteImageInputSchema = z.object({
	assetId: z.string().min(1).describe('Asset ID of the image to delete'),
});

export type DeleteImageInput = z.infer<typeof DeleteImageInputSchema>;

export const DeleteImageResponseSchema = AltTextAiImageSchema;

export type DeleteImageResponse = z.infer<typeof DeleteImageResponseSchema>;

export const SearchImagesInputSchema = z.object({
	q: z
		.string()
		.min(1)
		.max(256)
		.describe('Search query (alt text, asset ID, or URL substring)'),
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

export type SearchImagesInput = z.infer<typeof SearchImagesInputSchema>;

export const SearchImagesResponseSchema = z
	.object({
		images: z.array(AltTextAiImageSchema),
	})
	.loose();

export type SearchImagesResponse = z.infer<typeof SearchImagesResponseSchema>;

export const BulkCreateInputSchema = z.object({
	file: z.instanceof(Blob).describe('CSV file with image URLs to process'),
	email: z
		.string()
		.email()
		.optional()
		.describe('Optional email for bulk upload results'),
});

export type BulkCreateInput = z.infer<typeof BulkCreateInputSchema>;

export const BulkCreateResponseSchema = z
	.object({
		success: z.boolean().optional(),
		rows: z.number().optional(),
		row_errors: z.array(z.tuple([z.number(), z.string()])).optional(),
		error: z.string().nullable().optional(),
	})
	.loose();

export type BulkCreateResponse = z.infer<typeof BulkCreateResponseSchema>;

export const PageScrapeInputSchema = z
	.object({
		page_scrape: z
			.object({
				url: z.string().url().optional(),
				html: z.string().optional(),
			})
			.loose()
			.refine((page) => Boolean(page.url) || Boolean(page.html), {
				message: 'page_scrape.url or page_scrape.html is required',
			}),
		keywords: z.array(z.string()).max(6).optional(),
		negative_keywords: z.array(z.string()).max(6).optional(),
		lang: z.string().optional(),
		include_existing: z.boolean().optional(),
	})
	.loose();

export type PageScrapeInput = z.infer<typeof PageScrapeInputSchema>;

export const ScrapedImageSchema = z
	.object({
		src: z.string().optional(),
		alt: z.string().nullable().optional(),
		width: z.number().nullable().optional(),
		height: z.number().nullable().optional(),
		skip_reason: z.string().nullable().optional(),
	})
	.loose();

export const PageScrapeResponseSchema = z
	.object({
		url: z.string().nullable().optional(),
		total_processed: z.number().optional(),
		errors: z.unknown().nullable().optional(),
		scraped_images: z.array(ScrapedImageSchema).optional(),
	})
	.loose();

export type PageScrapeResponse = z.infer<typeof PageScrapeResponseSchema>;

export const GetAccountInputSchema = z.object({});

export type GetAccountInput = z.infer<typeof GetAccountInputSchema>;

export const AltTextAiAccountSchema = z
	.object({
		name: z.string().optional(),
		webhook_url: z.string().nullable().optional(),
		notification_email: z.string().nullable().optional(),
		usage: z.number().optional(),
		usage_limit: z.number().optional(),
		whitelabel: z.boolean().optional(),
		default_lang: z.string().optional(),
		ending_period: z.boolean().optional(),
		no_quotes: z.boolean().optional(),
		remove_symbols: z.array(z.string()).nullable().optional(),
		gpt_prompt: z.string().nullable().optional(),
		max_chars: z.number().nullable().optional(),
		subscription: z
			.object({
				plan_name: z.string().optional(),
				usage_quota: z.number().optional(),
				status: z.string().optional(),
				expires_at: z.string().optional(),
			})
			.nullable()
			.optional(),
		errors: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type AltTextAiAccount = z.infer<typeof AltTextAiAccountSchema>;

export const GetAccountResponseSchema = AltTextAiAccountSchema;

export type GetAccountResponse = z.infer<typeof GetAccountResponseSchema>;

export const UpdateAccountInputSchema = z.object({
	account: z
		.object({
			name: z.string().optional(),
			webhook_url: z.string().optional(),
			notification_email: z.string().optional(),
			max_chars: z.number().optional(),
			gpt_prompt: z.string().nullable().optional(),
			remove_symbols: z.array(z.string()).optional(),
		})
		.loose(),
});

export type UpdateAccountInput = z.infer<typeof UpdateAccountInputSchema>;

export const UpdateAccountResponseSchema = AltTextAiAccountSchema;

export type UpdateAccountResponse = z.infer<typeof UpdateAccountResponseSchema>;

export const AltTextAiEndpointInputSchemas = {
	list: ListImagesInputSchema,
	create: CreateImageInputSchema,
	get: GetImageInputSchema,
	update: UpdateImageInputSchema,
	delete: DeleteImageInputSchema,
	search: SearchImagesInputSchema,
	bulkCreate: BulkCreateInputSchema,
	pageScrape: PageScrapeInputSchema,
	getAccount: GetAccountInputSchema,
	updateAccount: UpdateAccountInputSchema,
} as const;

export const AltTextAiEndpointOutputSchemas = {
	list: ListImagesResponseSchema,
	create: CreateImageResponseSchema,
	get: GetImageResponseSchema,
	update: UpdateImageResponseSchema,
	delete: DeleteImageResponseSchema,
	search: SearchImagesResponseSchema,
	bulkCreate: BulkCreateResponseSchema,
	pageScrape: PageScrapeResponseSchema,
	getAccount: GetAccountResponseSchema,
	updateAccount: UpdateAccountResponseSchema,
} as const;

export type AltTextAiEndpointInputs = {
	list: ListImagesInput;
	create: CreateImageInput;
	get: GetImageInput;
	update: UpdateImageInput;
	delete: DeleteImageInput;
	search: SearchImagesInput;
	bulkCreate: BulkCreateInput;
	pageScrape: PageScrapeInput;
	getAccount: GetAccountInput;
	updateAccount: UpdateAccountInput;
};

export type AltTextAiEndpointOutputs = {
	list: ListImagesResponse;
	create: CreateImageResponse;
	get: GetImageResponse;
	update: UpdateImageResponse;
	delete: DeleteImageResponse;
	search: SearchImagesResponse;
	bulkCreate: BulkCreateResponse;
	pageScrape: PageScrapeResponse;
	getAccount: GetAccountResponse;
	updateAccount: UpdateAccountResponse;
};
