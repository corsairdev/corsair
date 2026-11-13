import type { ScrapeDoEndpoints } from '..';
import { parseJsonObject, ScrapeDoAPIError } from '../client';
import { call, scrapeQuery } from './call';
import {
	ScrapeDoEndpointInputSchemas as Inputs,
	ScrapeDoEndpointOutputSchemas as Outputs,
	RawScreenshotSchema,
} from './types';

export const html: ScrapeDoEndpoints['scrapeHtml'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrape.html',
			input: Inputs.scrapeHtml,
			output: Outputs.scrapeHtml,
		},
		input,
		(parsed) => ({
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { ...scrapeQuery(parsed), output: parsed.output },
		}),
		{
			// The body is the page itself, and its status is the target's status:
			// a 404 target still returns its page and still costs a credit.
			shape: (answer) => ({
				html: answer.body,
				status_code: answer.status,
				content_type: answer.contentType,
			}),
			log: (parsed, result) => ({
				url: parsed.url,
				statusCode: result.status_code,
				bytes: result.html.length,
			}),
		},
	);

export const markdown: ScrapeDoEndpoints['scrapeMarkdown'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrape.markdown',
			input: Inputs.scrapeMarkdown,
			output: Outputs.scrapeMarkdown,
		},
		input,
		(parsed) => ({
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { ...scrapeQuery(parsed), output: 'markdown' },
		}),
		{
			shape: (answer) => ({
				markdown: answer.body,
				status_code: answer.status,
			}),
			log: (parsed, result) => ({
				url: parsed.url,
				statusCode: result.status_code,
				chars: result.markdown.length,
			}),
		},
	);

export const json: ScrapeDoEndpoints['scrapeJson'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrape.json',
			input: Inputs.scrapeJson,
			output: Outputs.scrapeJson,
		},
		input,
		(parsed) => ({
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: {
				...scrapeQuery(parsed),
				returnJSON: true,
				showFrames: parsed.showFrames,
				showWebsocketRequests: parsed.showWebsocketRequests,
			},
		}),
		{
			shape: (answer) => {
				const body = parseJsonObject(answer.body);
				return {
					status_code: body.statusCode,
					content: body.content,
					network_requests: body.networkRequests,
					websocket_requests: body.websocketRequests,
					frames: body.frames,
				};
			},
			log: (parsed, result) => ({
				url: parsed.url,
				statusCode: result.status_code,
				requests: result.network_requests.length,
			}),
		},
	);

export const screenshot: ScrapeDoEndpoints['scrapeScreenshot'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrape.screenshot',
			input: Inputs.scrapeScreenshot,
			output: Outputs.scrapeScreenshot,
		},
		input,
		(parsed) => ({
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: {
				...scrapeQuery(parsed),
				// A screenshot is only returned inside the JSON answer, and the live
				// API answers 400 for `screenShot` without `returnJSON`.
				returnJSON: true,
				// Only the flag the caller asked for is sent: `screenShot: false`
				// beside `fullScreenShot: true` is accepted but is meaningless noise.
				screenShot:
					parsed.fullPage === true || parsed.selector !== undefined
						? undefined
						: true,
				fullScreenShot: parsed.fullPage === true ? true : undefined,
				// A CSS selector for one element, sent as is.
				particularScreenShot: parsed.selector,
			},
		}),
		{
			shape: (answer) => {
				const body = parseJsonObject(answer.body);
				// Each entry is `{ type, image, error }`; the image is the base64 PNG.
				const shots = RawScreenshotSchema.array().parse(body.screenShots ?? []);
				const images = shots.flatMap((shot) =>
					shot.image ? [shot.image] : [],
				);
				// No image is a failed capture even when no entry names an error, so it
				// never reads as a completed screenshot.
				if (images.length === 0) {
					const failure =
						shots.find((shot) => shot.error)?.error ??
						'the answer held no image';
					throw new ScrapeDoAPIError(
						`Scrape.do could not take the screenshot: ${failure}`,
						{
							status: answer.status,
							message: failure,
							method: 'GET',
						},
					);
				}
				return {
					screenshots: images,
					status_code: body.statusCode,
				};
			},
			log: (parsed, result) => ({
				url: parsed.url,
				statusCode: result.status_code,
				images: result.screenshots.length,
			}),
		},
	);
