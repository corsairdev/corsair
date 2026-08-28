import { logEventFromContext } from 'corsair/core';
import { fetchPlayHtml, resolveBaseUrl } from '../client';
import type { ClickhouseEndpoints } from '../index';
import {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './types';

export const getPlayInterface: ClickhouseEndpoints['getPlayInterface'] = async (
	ctx,
	rawInput,
) => {
	ClickhouseEndpointInputSchemas.getPlayInterface.parse(rawInput);
	const baseUrl = await resolveBaseUrl(ctx);

	const html = await fetchPlayHtml(baseUrl, ctx.key);

	await logEventFromContext(
		ctx,
		'clickhouse.play.get',
		{ sizeBytes: html.length },
		'completed',
	);

	return ClickhouseEndpointOutputSchemas.getPlayInterface.parse({
		url: baseUrl.replace(/\/+$/, '') + '/play',
		html,
		sizeBytes: html.length,
	});
};
