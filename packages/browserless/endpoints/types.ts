import { z } from 'zod';
import {
	BrowserlessFile,
	BrowserlessHtml,
	BrowserlessScrapeResult,
	BrowserlessUnblockResult,
} from '../schema';

const WaitUntil = z.enum([
	'load',
	'domcontentloaded',
	'networkidle0',
	'networkidle2',
]);

const LaunchQuery = {
	stealth: z.boolean().optional(),
	timeout: z.number().int().positive().optional(),
	proxy: z.string().optional(),
	blockAds: z.boolean().optional(),
};

const GotoOptions = z
	.object({
		waitUntil: WaitUntil.optional(),
		timeout: z.number().int().positive().optional(),
	})
	.optional();

const WaitForSelector = z
	.object({
		selector: z.string().min(1),
		timeout: z.number().int().positive().optional(),
	})
	.optional();

const UrlOrHtml = {
	url: z.string().url().optional(),
	html: z.string().min(1).optional(),
	gotoOptions: GotoOptions,
	waitForTimeout: z.number().int().nonnegative().optional(),
	waitForSelector: WaitForSelector,
	bestAttempt: z.boolean().optional(),
	...LaunchQuery,
};

function requireUrlOrHtml<T extends { url?: string; html?: string }>(
	schema: z.ZodType<T>,
) {
	return schema.refine((value) => Boolean(value.url) !== Boolean(value.html), {
		message: 'Provide exactly one of url or html',
	});
}

export const ContentGetInputSchema = requireUrlOrHtml(z.object(UrlOrHtml));
export type ContentGetInput = z.infer<typeof ContentGetInputSchema>;
export const ContentGetOutputSchema = BrowserlessHtml;
export type ContentGetOutput = z.infer<typeof ContentGetOutputSchema>;

export const ScreenshotCreateInputSchema = requireUrlOrHtml(
	z.object({
		...UrlOrHtml,
		options: z
			.object({
				fullPage: z.boolean().optional(),
				type: z.enum(['png', 'jpeg', 'webp']).optional(),
				quality: z.number().int().min(0).max(100).optional(),
				clip: z
					.object({
						x: z.number(),
						y: z.number(),
						width: z.number(),
						height: z.number(),
					})
					.optional(),
			})
			.optional(),
	}),
);
export type ScreenshotCreateInput = z.infer<typeof ScreenshotCreateInputSchema>;
export const ScreenshotCreateOutputSchema = BrowserlessFile;
export type ScreenshotCreateOutput = z.infer<
	typeof ScreenshotCreateOutputSchema
>;

export const PdfCreateInputSchema = requireUrlOrHtml(
	z.object({
		...UrlOrHtml,
		options: z
			.object({
				format: z
					.enum([
						'Letter',
						'Legal',
						'Tabloid',
						'Ledger',
						'A0',
						'A1',
						'A2',
						'A3',
						'A4',
						'A5',
						'A6',
					])
					.optional(),
				printBackground: z.boolean().optional(),
				displayHeaderFooter: z.boolean().optional(),
				tagged: z.boolean().optional(),
				pageRanges: z.string().optional(),
			})
			.optional(),
	}),
);
export type PdfCreateInput = z.infer<typeof PdfCreateInputSchema>;
export const PdfCreateOutputSchema = BrowserlessFile;
export type PdfCreateOutput = z.infer<typeof PdfCreateOutputSchema>;

export const ScrapeCreateInputSchema = z.object({
	url: z.string().url(),
	elements: z.array(z.object({ selector: z.string().min(1) })).min(1),
	gotoOptions: GotoOptions,
	waitForTimeout: z.number().int().nonnegative().optional(),
	waitForSelector: WaitForSelector,
	bestAttempt: z.boolean().optional(),
	...LaunchQuery,
});
export type ScrapeCreateInput = z.infer<typeof ScrapeCreateInputSchema>;
export const ScrapeCreateOutputSchema = BrowserlessScrapeResult;
export type ScrapeCreateOutput = z.infer<typeof ScrapeCreateOutputSchema>;

export const FunctionRunInputSchema = z.object({
	code: z.string().min(1),
	context: z.record(z.string(), z.unknown()).optional(),
	...LaunchQuery,
});
export type FunctionRunInput = z.infer<typeof FunctionRunInputSchema>;
export const FunctionRunOutputSchema = z.object({
	contentType: z.string(),
	data: z.unknown().optional(),
	base64: z.string().optional(),
	filename: z.string().optional(),
});
export type FunctionRunOutput = z.infer<typeof FunctionRunOutputSchema>;

export const UnblockCreateInputSchema = z.object({
	url: z.string().url(),
	content: z.boolean().optional(),
	cookies: z.boolean().optional(),
	screenshot: z.boolean().optional(),
	browserWSEndpoint: z.boolean().optional(),
	ttl: z.number().int().positive().optional(),
	gotoOptions: GotoOptions,
	waitForTimeout: z.number().int().nonnegative().optional(),
	waitForSelector: WaitForSelector,
	bestAttempt: z.boolean().optional(),
	...LaunchQuery,
});
export type UnblockCreateInput = z.infer<typeof UnblockCreateInputSchema>;
export const UnblockCreateOutputSchema = BrowserlessUnblockResult;
export type UnblockCreateOutput = z.infer<typeof UnblockCreateOutputSchema>;

export const DownloadCreateInputSchema = z.object({
	code: z.string().min(1),
	context: z.record(z.string(), z.unknown()).optional(),
	...LaunchQuery,
});
export type DownloadCreateInput = z.infer<typeof DownloadCreateInputSchema>;
export const DownloadCreateOutputSchema = BrowserlessFile;
export type DownloadCreateOutput = z.infer<typeof DownloadCreateOutputSchema>;

export const BrowserlessEndpointInputSchemas = {
	contentGet: ContentGetInputSchema,
	screenshotCreate: ScreenshotCreateInputSchema,
	pdfCreate: PdfCreateInputSchema,
	scrapeCreate: ScrapeCreateInputSchema,
	functionRun: FunctionRunInputSchema,
	unblockCreate: UnblockCreateInputSchema,
	downloadCreate: DownloadCreateInputSchema,
} as const;

export const BrowserlessEndpointOutputSchemas = {
	contentGet: ContentGetOutputSchema,
	screenshotCreate: ScreenshotCreateOutputSchema,
	pdfCreate: PdfCreateOutputSchema,
	scrapeCreate: ScrapeCreateOutputSchema,
	functionRun: FunctionRunOutputSchema,
	unblockCreate: UnblockCreateOutputSchema,
	downloadCreate: DownloadCreateOutputSchema,
} as const;

export type BrowserlessEndpointInputs = {
	[K in keyof typeof BrowserlessEndpointInputSchemas]: z.infer<
		(typeof BrowserlessEndpointInputSchemas)[K]
	>;
};

export type BrowserlessEndpointOutputs = {
	[K in keyof typeof BrowserlessEndpointOutputSchemas]: z.infer<
		(typeof BrowserlessEndpointOutputSchemas)[K]
	>;
};
