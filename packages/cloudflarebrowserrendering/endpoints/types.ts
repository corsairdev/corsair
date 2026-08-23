import { z } from 'corsair/core';

// --- INPUT SCHEMAS ---

export const ListAccountsGetInputSchema = z.object({}).strict();
export type ListAccountsGetInput = z.infer<typeof ListAccountsGetInputSchema>;

export const CaptureScreenshotCreateInputSchema = z
	.object({
		accountId: z.string().describe('The Cloudflare account ID'),
		url: z.string().url().describe('The URL to capture'),
		viewportWidth: z.number().optional().describe('Viewport width in pixels'),
		viewportHeight: z.number().optional().describe('Viewport height in pixels'),
	})
	.strict();
export type CaptureScreenshotCreateInput = z.infer<
	typeof CaptureScreenshotCreateInputSchema
>;

export const TakeWebpageSnapshotCreateInputSchema = z
	.object({
		accountId: z.string().describe('The Cloudflare account ID'),
		url: z.string().url().describe('The URL to snapshot'),
	})
	.strict();
export type TakeWebpageSnapshotCreateInput = z.infer<
	typeof TakeWebpageSnapshotCreateInputSchema
>;

export const ScrapeHtmlElementsCreateInputSchema = z
	.object({
		accountId: z.string().describe('The Cloudflare account ID'),
		url: z.string().url().describe('The URL to scrape'),
		selectors: z
			.array(z.string())
			.describe(
				'Array of CSS selectors to scrape (e.g., ["h1", ".class-name"])',
			),
	})
	.strict();
export type ScrapeHtmlElementsCreateInput = z.infer<
	typeof ScrapeHtmlElementsCreateInputSchema
>;

// --- OUTPUT SCHEMAS ---

export const AccountSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const ListAccountsGetOutputSchema = z.array(AccountSchema);
export type ListAccountsGetResponse = z.infer<
	typeof ListAccountsGetOutputSchema
>;

export const CaptureScreenshotCreateOutputSchema = z
	.string()
	.describe('Base64 encoded screenshot image');
export type CaptureScreenshotCreateResponse = z.infer<
	typeof CaptureScreenshotCreateOutputSchema
>;

export const TakeWebpageSnapshotCreateOutputSchema = z.object({
	html: z.string().describe('Rendered HTML content of the page'),
	screenshot: z.string().describe('Base64 encoded screenshot image'),
});
export type TakeWebpageSnapshotCreateResponse = z.infer<
	typeof TakeWebpageSnapshotCreateOutputSchema
>;
export const ScrapeHtmlElementsCreateOutputSchema = z
	.record(z.string(), z.unknown())
	.describe('Scraped HTML element data from Cloudflare');
export type ScrapeHtmlElementsCreateResponse = z.infer<
	typeof ScrapeHtmlElementsCreateOutputSchema
>;

// --- EXPORTS FOR INDEX.TS ---

export const CloudflareBrowserRenderingEndpointInputSchemas = {
	listAccountsGet: ListAccountsGetInputSchema,
	captureScreenshotCreate: CaptureScreenshotCreateInputSchema,
	takeWebpageSnapshotCreate: TakeWebpageSnapshotCreateInputSchema,
	scrapeHtmlElementsCreate: ScrapeHtmlElementsCreateInputSchema,
} as const;

export const CloudflareBrowserRenderingEndpointOutputSchemas = {
	listAccountsGet: ListAccountsGetOutputSchema,
	captureScreenshotCreate: CaptureScreenshotCreateOutputSchema,
	takeWebpageSnapshotCreate: TakeWebpageSnapshotCreateOutputSchema,
	scrapeHtmlElementsCreate: ScrapeHtmlElementsCreateOutputSchema,
} as const;

export type CloudflareBrowserRenderingEndpointInputs = {
	listAccountsGet: ListAccountsGetInput;
	captureScreenshotCreate: CaptureScreenshotCreateInput;
	takeWebpageSnapshotCreate: TakeWebpageSnapshotCreateInput;
	scrapeHtmlElementsCreate: ScrapeHtmlElementsCreateInput;
};

export type CloudflareBrowserRenderingEndpointOutputs = {
	listAccountsGet: ListAccountsGetResponse;
	captureScreenshotCreate: CaptureScreenshotCreateResponse;
	takeWebpageSnapshotCreate: TakeWebpageSnapshotCreateResponse;
	scrapeHtmlElementsCreate: ScrapeHtmlElementsCreateResponse;
};
