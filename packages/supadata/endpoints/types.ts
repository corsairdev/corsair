import { z } from 'zod';

// ==========================================
// 1. Transcript (GET /transcript)
// ==========================================

export const TranscriptInputSchema = z.object({
	url: z.string().url('A valid URL is required'),
	lang: z.string().optional(),
	text: z.boolean().optional(),
	chunkSize: z.number().min(50).max(10000).optional(),
	mode: z.enum(['auto', 'native', 'generate']).optional(),
});

export type TranscriptInput = z.infer<typeof TranscriptInputSchema>;

export const TranscriptChunkSchema = z.object({
	text: z.string(),
	offset: z.number().optional(),
	duration: z.number().optional(),
	lang: z.string().optional(),
});

export type TranscriptChunk = z.infer<typeof TranscriptChunkSchema>;

export const TranscriptDirectResponseSchema = z.object({
	lang: z.string().optional(),
	availableLangs: z.array(z.string()).optional(),
	content: z.union([z.string(), z.array(TranscriptChunkSchema)]),
});

export const TranscriptJobResponseSchema = z.object({
	jobId: z.string(),
	status: z.enum(['queued', 'processing', 'completed', 'failed']).optional(),
	message: z.string().optional(),
});

export const TranscriptOutputSchema = z.union([
	TranscriptDirectResponseSchema,
	TranscriptJobResponseSchema,
]);

export type TranscriptOutput = z.infer<typeof TranscriptOutputSchema>;

// ==========================================
// 2. Transcript Job (GET /transcript/{jobId})
// ==========================================

export const TranscriptJobInputSchema = z.object({
	jobId: z.string().min(1, 'Job ID is required'),
});

export type TranscriptJobInput = z.infer<typeof TranscriptJobInputSchema>;

export const TranscriptJobStatusOutputSchema = z.object({
	jobId: z.string(),
	status: z.enum(['queued', 'processing', 'completed', 'failed']),
	error: z.string().optional(),
	result: TranscriptDirectResponseSchema.optional(),
});

export type TranscriptJobStatusOutput = z.infer<
	typeof TranscriptJobStatusOutputSchema
>;

// ==========================================
// 3. Metadata (GET /metadata)
// ==========================================

export const MetadataInputSchema = z.object({
	url: z.string().url('A valid URL is required'),
});

export type MetadataInput = z.infer<typeof MetadataInputSchema>;

export const MetadataAuthorSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	username: z.string().optional(),
	url: z.string().optional(),
	avatar: z.string().optional(),
	verified: z.boolean().optional(),
});

export type MetadataAuthor = z.infer<typeof MetadataAuthorSchema>;

export const MetadataOutputSchema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	author: z.union([z.string(), MetadataAuthorSchema]).optional(),
	authorId: z.string().optional(),
	authorUrl: z.string().optional(),
	publishedAt: z.string().optional(),
	duration: z.number().optional(),
	viewsCount: z.number().optional(),
	likesCount: z.number().optional(),
	commentsCount: z.number().optional(),
	sharesCount: z.number().optional(),
	thumbnail: z.string().optional(),
	platform: z.string().optional(),
	raw: z.record(z.string(), z.unknown()).optional(),
});

export type MetadataOutput = z.infer<typeof MetadataOutputSchema>;

// ==========================================
// 4. Web Scrape (GET /web/scrape)
// ==========================================

export const WebScrapeInputSchema = z.object({
	url: z.string().url('A valid URL is required'),
	noLinks: z.boolean().optional(),
});

export type WebScrapeInput = z.infer<typeof WebScrapeInputSchema>;

export const WebScrapeOutputSchema = z.object({
	url: z.string().optional(),
	title: z.string().optional(),
	content: z.string(),
	markdown: z.string().optional(),
	html: z.string().optional(),
});

export type WebScrapeOutput = z.infer<typeof WebScrapeOutputSchema>;

// ==========================================
// 5. Website URL Map (GET /web/map)
// ==========================================

export const WebMapInputSchema = z.object({
	url: z.string().url('A valid URL is required'),
	limit: z.number().optional(),
});

export type WebMapInput = z.infer<typeof WebMapInputSchema>;

export const WebMapOutputSchema = z.object({
	url: z.string().optional(),
	links: z.array(z.string()).optional(),
	urls: z.array(z.string()).optional(),
});

export type WebMapOutput = z.infer<typeof WebMapOutputSchema>;

// ==========================================
// 6. YouTube Search (GET /youtube/search)
// ==========================================

export const YoutubeSearchInputSchema = z.object({
	query: z.string().min(1, 'Query is required'),
	type: z.enum(['video', 'channel', 'playlist']).optional(),
	limit: z.number().optional(),
});

export type YoutubeSearchInput = z.infer<typeof YoutubeSearchInputSchema>;

export const YoutubeSearchResultItemSchema = z.object({
	type: z.string().optional(),
	id: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	thumbnail: z.string().optional(),
	channelTitle: z.string().optional(),
	channelId: z.string().optional(),
	publishedAt: z.string().optional(),
	duration: z.number().optional(),
	viewsCount: z.number().optional(),
});

export type YoutubeSearchResultItem = z.infer<
	typeof YoutubeSearchResultItemSchema
>;

export const YoutubeSearchOutputSchema = z.object({
	query: z.string().optional(),
	nextPageToken: z.string().optional(),
	results: z.array(YoutubeSearchResultItemSchema),
});

export type YoutubeSearchOutput = z.infer<typeof YoutubeSearchOutputSchema>;

// ==========================================
// Schema Collections
// ==========================================

export type SupadataEndpointInputs = {
	transcriptGet: TranscriptInput;
	transcriptGetJob: TranscriptJobInput;
	metadataGet: MetadataInput;
	webScrape: WebScrapeInput;
	webMap: WebMapInput;
	youtubeSearch: YoutubeSearchInput;
};

export type SupadataEndpointOutputs = {
	transcriptGet: TranscriptOutput;
	transcriptGetJob: TranscriptJobStatusOutput;
	metadataGet: MetadataOutput;
	webScrape: WebScrapeOutput;
	webMap: WebMapOutput;
	youtubeSearch: YoutubeSearchOutput;
};

export const SupadataEndpointInputSchemas = {
	transcriptGet: TranscriptInputSchema,
	transcriptGetJob: TranscriptJobInputSchema,
	metadataGet: MetadataInputSchema,
	webScrape: WebScrapeInputSchema,
	webMap: WebMapInputSchema,
	youtubeSearch: YoutubeSearchInputSchema,
} as const;

export const SupadataEndpointOutputSchemas = {
	transcriptGet: TranscriptOutputSchema,
	transcriptGetJob: TranscriptJobStatusOutputSchema,
	metadataGet: MetadataOutputSchema,
	webScrape: WebScrapeOutputSchema,
	webMap: WebMapOutputSchema,
	youtubeSearch: YoutubeSearchOutputSchema,
} as const;
