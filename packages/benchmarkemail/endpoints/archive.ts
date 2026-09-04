/**
 * Benchmark Email archive endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Archive folder)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import { compactQuery } from './shared';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const addEmailToArchive: BenchmarkEmailEndpoints['archiveAddEmailToArchive'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveAddEmailToArchive']
		>(`Archive/`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.addEmailToArchive',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteEmailFromArchive: BenchmarkEmailEndpoints['archiveDeleteEmailFromArchive'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveDeleteEmailFromArchive']
		>(`Archive/${encodeURIComponent(input.id)}`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.deleteEmailFromArchive',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getArchiveDomainName: BenchmarkEmailEndpoints['archiveGetArchiveDomainName'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveGetArchiveDomainName']
		>(`Client/Archive/Domain`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.getArchiveDomainName',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getArchiveEmailDetails: BenchmarkEmailEndpoints['archiveGetArchiveEmailDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveGetArchiveEmailDetails']
		>(`Archive/${encodeURIComponent(input.archiveID)}/Detail`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.getArchiveEmailDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getArchiveEmails: BenchmarkEmailEndpoints['archiveGetArchiveEmails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveGetArchiveEmails']
		>(`Archive/`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.getArchiveEmails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getArchiveHomeData: BenchmarkEmailEndpoints['archiveGetArchiveHomeData'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveGetArchiveHomeData']
		>(
			`Archive/ArchiveHome/${encodeURIComponent(input.domain)}/${encodeURIComponent(input.type)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.getArchiveHomeData',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getArchiveHomePage: BenchmarkEmailEndpoints['archiveGetArchiveHomePage'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveGetArchiveHomePage']
		>(`Archive/ArchiveHomePage`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.getArchiveHomePage',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getArchivePages: BenchmarkEmailEndpoints['archiveGetArchivePages'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveGetArchivePages']
		>(`Archive/ArchivePages`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.getArchivePages',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getDetailsAboutArchivePage: BenchmarkEmailEndpoints['archiveGetDetailsAboutArchivePage'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveGetDetailsAboutArchivePage']
		>(`Archive/Domain`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.getDetailsAboutArchivePage',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getHTMLForArchiveNewsletter: BenchmarkEmailEndpoints['archiveGetHTMLForArchiveNewsletter'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveGetHTMLForArchiveNewsletter']
		>(`Archive/ArchiveEmail/${encodeURIComponent(input.domain)}`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.getHTMLForArchiveNewsletter',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getHTMLForButton: BenchmarkEmailEndpoints['archiveGetHTMLForButton'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveGetHTMLForButton']
		>(`Archive/${encodeURIComponent(input.mode)}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.getHTMLForButton',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getImageForButton: BenchmarkEmailEndpoints['archiveGetImageForButton'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveGetImageForButton']
		>(`Archive/Image/${encodeURIComponent(input.mode)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.getImageForButton',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateArchiveHomePage: BenchmarkEmailEndpoints['archiveUpdateArchiveHomePage'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveUpdateArchiveHomePage']
		>(`Archive/AddArchiveHome`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.updateArchiveHomePage',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateArchiveHomePageData: BenchmarkEmailEndpoints['archiveUpdateArchiveHomePageData'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['archiveUpdateArchiveHomePageData']
		>(`Archive/`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.archive.updateArchiveHomePageData',
			{ ...input },
			'completed',
		);
		return response;
	};
