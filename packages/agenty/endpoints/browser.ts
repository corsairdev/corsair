import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const captureScreenshotRoute = getRoute('captureScreenshot');
export const captureScreenshot: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, captureScreenshotRoute);
};

const captureScreenshotWithOptionsRoute = getRoute(
	'captureScreenshotWithOptions',
);
export const captureScreenshotWithOptions: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, captureScreenshotWithOptionsRoute);
};

const convertUrlToPdfRoute = getRoute('convertUrlToPdf');
export const convertUrlToPdf: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, convertUrlToPdfRoute);
};

const convertUrlToPdfWithOptionsRoute = getRoute('convertUrlToPdfWithOptions');
export const convertUrlToPdfWithOptions: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, convertUrlToPdfWithOptionsRoute);
};

const extractBrowserStructuredDataRoute = getRoute(
	'extractBrowserStructuredData',
);
export const extractBrowserStructuredData: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, extractBrowserStructuredDataRoute);
};

const extractStructuredDataRoute = getRoute('extractStructuredData');
export const extractStructuredData: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, extractStructuredDataRoute);
};

const getBrowserRedirectsRoute = getRoute('getBrowserRedirects');
export const getBrowserRedirects: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getBrowserRedirectsRoute);
};

const getPageContentRoute = getRoute('getPageContent');
export const getPageContent: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getPageContentRoute);
};

const getPageContentWithOptionsRoute = getRoute('getPageContentWithOptions');
export const getPageContentWithOptions: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, getPageContentWithOptionsRoute);
};

const getRedirectsWithOptionsRoute = getRoute('getRedirectsWithOptions');
export const getRedirectsWithOptions: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, getRedirectsWithOptionsRoute);
};

const scrapeWebpageDataRoute = getRoute('scrapeWebpageData');
export const scrapeWebpageData: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, scrapeWebpageDataRoute);
};

export const BrowserEndpoints = {
	captureScreenshot,
	captureScreenshotWithOptions,
	convertUrlToPdf,
	convertUrlToPdfWithOptions,
	extractBrowserStructuredData,
	extractStructuredData,
	getBrowserRedirects,
	getPageContent,
	getPageContentWithOptions,
	getRedirectsWithOptions,
	scrapeWebpageData,
} as const;
