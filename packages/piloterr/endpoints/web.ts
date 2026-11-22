import type { PiloterrEndpoints } from '..';
import { call } from './call';
import {
	PiloterrEndpointInputSchemas as Inputs,
	PiloterrEndpointOutputSchemas as Outputs,
	shapeScreenshotFile,
} from './types';

const V2 = '/v2';

/**
 * With returnPageSource the API answers { "return": "<html>" } instead of
 * the bare HTML string (live, 2026-11-21); both come back as the string.
 */
// unknown: raw is the response body (a string, or the page-source object).
function pageHtml(raw: unknown): unknown {
	if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
		const record = raw as Record<string, unknown>;
		if (typeof record.return === 'string') return record.return;
		if (typeof record.result === 'string') return record.result;
	}
	return raw;
}

export const crawler: PiloterrEndpoints['webCrawler'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'web.crawler',
			input: Inputs.webCrawler,
			output: Outputs.webCrawler,
		},
		input,
		({ query, allowRedirects, returnPageSource, fields }) => ({
			method: 'GET',
			path: `${V2}/website/crawler`,
			query: {
				query,
				allow_redirects: allowRedirects,
				return_page_source: returnPageSource,
				fields,
			},
		}),
		{ shape: pageHtml },
	);

export const rendering: PiloterrEndpoints['webRendering'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'web.rendering',
			input: Inputs.webRendering,
			output: Outputs.webRendering,
		},
		input,
		({
			query,
			waitInSeconds,
			waitFor,
			blockAds,
			timeout,
			returnPageSource,
			fields,
		}) => ({
			method: 'GET',
			path: `${V2}/website/rendering`,
			query: {
				query,
				wait_in_seconds: waitInSeconds,
				wait_for: waitFor,
				block_ads: blockAds,
				timeout,
				return_page_source: returnPageSource,
				fields,
			},
		}),
		{ shape: pageHtml },
	);

export const screenshot: PiloterrEndpoints['webScreenshot'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'web.screenshot',
			input: Inputs.webScreenshot,
			output: Outputs.webScreenshot,
		},
		input,
		({
			url,
			format,
			device,
			fullPage,
			fullPageScroll,
			fullPageScrollDuration,
			viewportWidth,
			viewportHeight,
			scaleFactor,
			imageQuality,
			selector,
			cache,
			cacheTtl,
			removeSelectors,
			removeCookieBanners,
			removeAds,
			blockResources,
			blockUrls,
			delay,
			waitForSelector,
		}) => ({
			method: 'GET',
			path: `${V2}/website/screenshot`,
			// Screenshot answers are binary, so fields filtering does not apply.
			responseType: 'binary',
			query: {
				url,
				format,
				device,
				full_page: fullPage,
				full_page_scroll: fullPageScroll,
				full_page_scroll_duration: fullPageScrollDuration,
				viewport_width: viewportWidth,
				viewport_height: viewportHeight,
				scale_factor: scaleFactor,
				image_quality: imageQuality,
				selector,
				cache,
				cache_ttl: cacheTtl,
				remove_selectors: removeSelectors,
				remove_cookie_banners: removeCookieBanners,
				remove_ads: removeAds,
				block_resources: blockResources,
				block_urls: blockUrls,
				delay,
				wait_for_selector: waitForSelector,
			},
		}),
		{ shape: shapeScreenshotFile },
	);

export const technology: PiloterrEndpoints['webTechnology'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'web.technology',
			input: Inputs.webTechnology,
			output: Outputs.webTechnology,
		},
		input,
		({ query, mode, fields }) => ({
			method: 'GET',
			path: `${V2}/website/technology`,
			query: { query, mode, fields },
		}),
	);

export const emailPhoneExtractor: PiloterrEndpoints['webEmailPhoneExtractor'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'web.emailPhoneExtractor',
				input: Inputs.webEmailPhoneExtractor,
				output: Outputs.webEmailPhoneExtractor,
			},
			input,
			({ query, countryCode, fields }) => ({
				method: 'GET',
				path: `${V2}/website/email_phone_extractor`,
				query: {
					query,
					country_code: countryCode,
					fields,
				},
			}),
			{
				log: (_, extracted) => ({
					emails: extracted.emails?.length ?? 0,
				}),
			},
		);

export const webunlocker: PiloterrEndpoints['webWebunlocker'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'web.webunlocker',
			input: Inputs.webWebunlocker,
			output: Outputs.webWebunlocker,
		},
		input,
		({ query, allowRedirects, returnPageSource, fields }) => ({
			method: 'GET',
			path: `${V2}/website/webunlocker`,
			query: {
				query,
				allow_redirects: allowRedirects,
				return_page_source: returnPageSource,
				fields,
			},
		}),
		{ shape: pageHtml },
	);
