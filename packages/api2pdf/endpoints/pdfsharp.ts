import { logEventFromContext } from 'corsair/core';
import {
	assertApi2PdfSuccess,
	buildPostPayload,
	makeApi2PdfRequest,
} from '../client';
import type { Api2PdfEndpoints } from '../index';
import { cachePdfJob } from './shared';
import type { Api2PdfJobResponse } from './types';

export const mergePdfs: Api2PdfEndpoints['mergePdfs'] = async (ctx, input) => {
	const response = assertApi2PdfSuccess(
		await makeApi2PdfRequest<Api2PdfJobResponse>('/pdfsharp/merge', {
			apiKey: ctx.key,
			method: 'POST',
			body: buildPostPayload(
				{ urls: input.urls },
				{ inline: input.inline, fileName: input.fileName },
			),
		}),
	);

	await cachePdfJob(ctx, 'mergePdfs', response);
	await logEventFromContext(
		ctx,
		'api2pdf.pdfsharp.mergePdfs',
		{ urlCount: input.urls.length },
		'completed',
	);

	return response;
};

export const extractPages: Api2PdfEndpoints['extractPages'] = async (
	ctx,
	input,
) => {
	// Optional start/end are omitted when unset; Record keeps a flexible POST body
	// without inventing a second schema for the wire payload.
	const body: Record<string, unknown> = { url: input.url };
	if (input.start != null) body.start = input.start;
	if (input.end != null) body.end = input.end;

	const response = assertApi2PdfSuccess(
		await makeApi2PdfRequest<Api2PdfJobResponse>('/pdfsharp/extract-pages', {
			apiKey: ctx.key,
			method: 'POST',
			body: buildPostPayload(body, {
				inline: input.inline,
				fileName: input.fileName,
			}),
		}),
	);

	await cachePdfJob(ctx, 'extractPages', response);
	await logEventFromContext(
		ctx,
		'api2pdf.pdfsharp.extractPages',
		{ url: input.url },
		'completed',
	);

	return response;
};

export const optimizePdf: Api2PdfEndpoints['optimizePdf'] = async (
	ctx,
	input,
) => {
	const response = assertApi2PdfSuccess(
		await makeApi2PdfRequest<Api2PdfJobResponse>('/pdfsharp/compress', {
			apiKey: ctx.key,
			method: 'POST',
			body: buildPostPayload(
				{ url: input.url },
				{ inline: input.inline, fileName: input.fileName },
			),
		}),
	);

	await cachePdfJob(ctx, 'optimizePdf', response);
	await logEventFromContext(
		ctx,
		'api2pdf.pdfsharp.optimizePdf',
		{ url: input.url },
		'completed',
	);

	return response;
};

export const watermarkPdf: Api2PdfEndpoints['watermarkPdf'] = async (
	ctx,
	input,
) => {
	// Watermark styling fields are optional upstream; omit them when unset so the
	// API applies its own defaults instead of receiving explicit nulls.
	const body: Record<string, unknown> = { url: input.url, text: input.text };
	if (input.fontSize != null) body.fontSize = input.fontSize;
	if (input.color != null) body.color = input.color;
	if (input.opacity != null) body.opacity = input.opacity;
	if (input.rotation != null) body.rotation = input.rotation;

	const response = assertApi2PdfSuccess(
		await makeApi2PdfRequest<Api2PdfJobResponse>('/pdfsharp/watermark', {
			apiKey: ctx.key,
			method: 'POST',
			body: buildPostPayload(body, {
				inline: input.inline,
				fileName: input.fileName,
			}),
		}),
	);

	await cachePdfJob(ctx, 'watermarkPdf', response);
	await logEventFromContext(
		ctx,
		'api2pdf.pdfsharp.watermarkPdf',
		{ url: input.url },
		'completed',
	);

	return response;
};
