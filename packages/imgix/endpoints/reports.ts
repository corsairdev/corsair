import { logEventFromContext } from 'corsair/core';
import type { ImgixEndpoints } from '..';
import { makeImgixRequest } from '../client';
import { ImgixEndpointInputSchemas, ImgixEndpointOutputSchemas } from './types';

export const list: ImgixEndpoints['reports.list'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['reports.list'].parse(input);

	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.completed !== undefined) {
		query['filter[completed]'] = parsedInput.completed;
	}
	if (parsedInput.report_type !== undefined) {
		query['filter[report_type]'] = parsedInput.report_type;
	}
	if (parsedInput.sort !== undefined) {
		query.sort = parsedInput.sort;
	}
	if (parsedInput.page_number !== undefined) {
		query['page[number]'] = parsedInput.page_number;
	}
	if (parsedInput.page_size !== undefined) {
		query['page[size]'] = parsedInput.page_size;
	}

	const response = await makeImgixRequest(ctx.key, {
		method: 'GET',
		path: 'reports',
		query,
	});

	const parsed = ImgixEndpointOutputSchemas['reports.list'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.reports.list',
		{ count: parsed.data.length },
		'completed',
	);

	return parsed;
};

export const get: ImgixEndpoints['reports.get'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['reports.get'].parse(input);

	const response = await makeImgixRequest(ctx.key, {
		method: 'GET',
		path: `reports/${encodeURIComponent(parsedInput.report_id)}`,
	});

	const parsed = ImgixEndpointOutputSchemas['reports.get'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.reports.get',
		{ report_id: parsed.data.id },
		'completed',
	);

	return parsed;
};
