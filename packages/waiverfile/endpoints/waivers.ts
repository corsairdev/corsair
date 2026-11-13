import type { WaiverFileEndpoints } from '..';
import { call, download } from './call';
import { countFrom, xmlSingleWaiver, xmlWaivers } from './shape';
import {
	WaiverFileEndpointInputSchemas as Inputs,
	WaiverFileEndpointOutputSchemas as Outputs,
} from './types';

export const get: WaiverFileEndpoints['waiversGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'waivers.get',
			input: Inputs.waiversGet,
			output: Outputs.waiversGet,
		},
		input,
		({ waiverID }) => ({
			method: 'GET',
			path: '/api/v1/GetWaiver',
			query: { waiverID },
		}),
		{
			// The waiver arrives under a top-level `Waiver`, converted from XML.
			shape: (raw) => xmlSingleWaiver(raw, '/api/v1/GetWaiver'),
			log: (_, result) => ({
				id: result.WaiverID ?? undefined,
				// The signer's name is the one identifying field worth logging; the
				// email, phone and date of birth are not.
				signed: result.HasSignature === 'true',
				participants: result.Particpants?.length ?? 0,
			}),
		},
	);

export const getLite: WaiverFileEndpoints['waiversGetLite'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'waivers.getLite',
			input: Inputs.waiversGetLite,
			output: Outputs.waiversGetLite,
		},
		input,
		({ waiverID }) => ({
			method: 'GET',
			path: '/api/v1/GetWaiverLite',
			query: { waiverID },
		}),
		{
			shape: (raw) => xmlSingleWaiver(raw, '/api/v1/GetWaiverLite'),
			log: (_, result) => ({ id: result.WaiverID ?? undefined }),
		},
	);

export const search: WaiverFileEndpoints['waiversSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'waivers.search',
			input: Inputs.waiversSearch,
			output: Outputs.waiversSearch,
		},
		input,
		({ terms }) => ({
			method: 'GET',
			path: '/api/v1/SearchWaivers',
			query: { terms },
		}),
		{
			shape: (raw) => xmlWaivers(raw, '/api/v1/SearchWaivers'),
			// The search term is a person's name, so only the count is logged.
			log: (_, result) => ({ count: result.Waivers?.length ?? 0 }),
		},
	);

export const byReference: WaiverFileEndpoints['waiversByReference'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'waivers.byReference',
			input: Inputs.waiversByReference,
			output: Outputs.waiversByReference,
		},
		input,
		({ refID1, refID2, refID3, refIDAny }) => ({
			method: 'GET',
			path: '/api/v1/GetWaiversByReferenceID',
			query: { refID1, refID2, refID3, refIDAny },
		}),
		{
			shape: (raw) => xmlWaivers(raw, '/api/v1/GetWaiversByReferenceID'),
			log: (_, result) => ({ count: result.Waivers?.length ?? 0 }),
		},
	);

/**
 * A page of full waivers signed in a range. `pageIndex` starts at 0, unlike
 * `waivers.data`, which starts at 1.
 */
export const list: WaiverFileEndpoints['waiversList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'waivers.list',
			input: Inputs.waiversList,
			output: Outputs.waiversList,
		},
		input,
		({ startDate, endDate, pageIndex, pageSize }) => ({
			method: 'GET',
			path: '/api/v1/GetAllWaiversByDateRange',
			query: { startDate, endDate, pageIndex, pageSize },
		}),
		{
			shape: (raw) => xmlWaivers(raw, '/api/v1/GetAllWaiversByDateRange'),
			log: (parsed, result) => ({
				count: result.Waivers?.length ?? 0,
				page: parsed.pageIndex,
			}),
		},
	);

/** The same range without the agreement text, signatures or event detail. */
export const listLite: WaiverFileEndpoints['waiversListLite'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'waivers.listLite',
			input: Inputs.waiversListLite,
			output: Outputs.waiversListLite,
		},
		input,
		({ startDate, endDate, pageIndex, pageSize }) => ({
			method: 'GET',
			path: '/api/v1/GetAllWaiversByDateRangeLite',
			query: { startDate, endDate, pageIndex, pageSize },
		}),
		{
			shape: (raw) => xmlWaivers(raw, '/api/v1/GetAllWaiversByDateRangeLite'),
			log: (parsed, result) => ({
				count: result.Waivers?.length ?? 0,
				page: parsed.pageIndex,
			}),
		},
	);

/**
 * How many waivers the range holds, which is what plans the paging. Despite the
 * route name, WaiverFile answers the number of waivers, not of pages.
 */
export const pageCount: WaiverFileEndpoints['waiversPageCount'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'waivers.pageCount',
			input: Inputs.waiversPageCount,
			output: Outputs.waiversPageCount,
		},
		input,
		({ startDate, endDate }) => ({
			method: 'GET',
			path: '/api/v1/GetAllWaiversByDateRangePageCount',
			query: { startDate, endDate },
		}),
		{
			shape: (raw) =>
				countFrom(raw, '/api/v1/GetAllWaiversByDateRangePageCount'),
			log: (_, result) => ({ count: result.Count ?? undefined }),
		},
	);

/**
 * Report-style rows, one per participant. `consolidateParticipants` is
 * documented as reserved — the API ignores it and still returns one row each.
 */
export const data: WaiverFileEndpoints['waiversData'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'waivers.data',
			input: Inputs.waiversData,
			output: Outputs.waiversData,
		},
		input,
		({
			startDate,
			endDate,
			includeCustomColumns,
			consolidateParticipants,
			pageIndex,
			pageSize,
		}) => ({
			method: 'GET',
			path: '/api/v1/GetWaiverData',
			query: {
				startDate,
				endDate,
				includeCustomColumns,
				consolidateParticipants,
				pageIndex,
				pageSize,
			},
		}),
		{
			log: (parsed, result) => ({
				rows: result.Table.length,
				page: parsed.pageIndex,
				customColumns: parsed.includeCustomColumns,
			}),
		},
	);

export const dataCount: WaiverFileEndpoints['waiversDataCount'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'waivers.dataCount',
			input: Inputs.waiversDataCount,
			output: Outputs.waiversDataCount,
		},
		input,
		({ startDate, endDate }) => ({
			method: 'GET',
			path: '/api/v1/GetWaiverDataCount',
			query: { startDate, endDate },
		}),
		{
			shape: (raw) => countFrom(raw, '/api/v1/GetWaiverDataCount'),
			log: (_, result) => ({ count: result.Count ?? undefined }),
		},
	);

/**
 * Downloads the waiver as a PDF.
 *
 * The response is a file, not JSON. The shared transport reads every body as text,
 * which decodes a PDF's binary bytes lossily, so this operation downloads the bytes
 * directly and hands them back base64-encoded with their real length. A caller can
 * write `Buffer.from(result.content, 'base64')` to a file.
 */
export const pdf: WaiverFileEndpoints['waiversPdf'] = (ctx, input) =>
	download(
		ctx,
		{
			event: 'waivers.pdf',
			input: Inputs.waiversPdf,
			output: Outputs.waiversPdf,
		},
		input,
		({ waiverID }) => ({
			path: '/api/v1/GetWaiverPDF',
			query: { waiverID },
		}),
		{
			shape: (file, parsed) => ({
				waiverID: parsed.waiverID,
				contentType: file.contentType,
				// The length of the bytes actually received, not a decoded string.
				bytes: file.bytes.byteLength,
				content: file.bytes.toString('base64'),
			}),
			log: (parsed, result) => ({
				waiverID: parsed.waiverID,
				bytes: result.bytes,
			}),
		},
	);
