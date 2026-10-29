import { BLANK_WORKBOOK_BYTES } from '../blank-workbook';
import { XLSX_MEDIA_TYPE } from '../client';
import type { ExcelEndpoints } from '../index';
import { driveContentUrl } from '../workbook-path';
import { callExcel } from './call';
import {
	driveItemListSchema,
	driveItemSchema,
	FilesCreateInputSchema,
	FilesFindInputSchema,
} from './types';

export const create: ExcelEndpoints['filesCreate'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.files.create',
		FilesCreateInputSchema,
		driveItemSchema,
		input,
		(body) => ({
			method: 'PUT',
			url: driveContentUrl(body),
			mediaType: XLSX_MEDIA_TYPE,
			body: new Blob([BLANK_WORKBOOK_BYTES], { type: XLSX_MEDIA_TYPE }),
		}),
		(body, response) => ({
			path: body.path,
			itemId: response.id,
		}),
	);
};

export const find: ExcelEndpoints['filesFind'] = async (ctx, input) => {
	const found = await callExcel(
		ctx,
		'excel.files.find',
		FilesFindInputSchema,
		driveItemListSchema,
		input,
		(body) => {
			// encodeURI leaves # and ? intact, which would split the request URL.
			const q = encodeURIComponent(body.query);
			const root =
				body.driveId === undefined
					? '/me/drive/root'
					: `/drives/${encodeURIComponent(body.driveId)}/root`;
			return {
				method: 'GET',
				url: `${root}/search(q='${q}')`,
				query: { $top: body.top },
			};
		},
		(body) => ({
			query: body.query,
		}),
	);
	return {
		...found,
		value: found.value.filter((item) =>
			item.name.toLowerCase().endsWith('.xlsx'),
		),
	};
};
