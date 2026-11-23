import type { CanvaEndpoints } from '../index';
import { callCanva, defined, seg } from './shared';
import type { CanvaEndpointOutputs } from './types';

// Canva's design analytics are a preview API for Canva Enterprise users.

export const get: CanvaEndpoints['analyticsGet'] = async (ctx, input) =>
	callCanva<CanvaEndpointOutputs['analyticsGet']>(
		ctx,
		'analytics.get',
		{ ...input },
		`v1/designs/${seg(input.designId)}/analytics`,
	);

export const listViewers: CanvaEndpoints['analyticsListViewers'] = async (
	ctx,
	input,
) => {
	const { designId, ...query } = input;
	return callCanva<CanvaEndpointOutputs['analyticsListViewers']>(
		ctx,
		'analytics.listViewers',
		{ ...input },
		`v1/designs/${seg(designId)}/analytics/viewers`,
		{ method: 'GET', query: defined(query) },
	);
};

export const listViewsOverTime: CanvaEndpoints['analyticsListViewsOverTime'] =
	async (ctx, input) => {
		const { designId, ...query } = input;
		return callCanva<CanvaEndpointOutputs['analyticsListViewsOverTime']>(
			ctx,
			'analytics.listViewsOverTime',
			{ ...input },
			`v1/designs/${seg(designId)}/analytics/views-over-time`,
			{ method: 'GET', query: defined(query) },
		);
	};

// A read, though Canva takes it as a POST so the page ids fit in a body.
export const listPageViews: CanvaEndpoints['analyticsListPageViews'] = async (
	ctx,
	input,
) => {
	const { designId, ...body } = input;
	return callCanva<CanvaEndpointOutputs['analyticsListPageViews']>(
		ctx,
		'analytics.listPageViews',
		{ designId, pages: input.page_ids.length },
		`v1/designs/${seg(designId)}/analytics/page-views`,
		{ method: 'POST', body: defined(body) },
	);
};

export const listLinks: CanvaEndpoints['analyticsListLinks'] = async (
	ctx,
	input,
) => {
	const { designId, ...query } = input;
	return callCanva<CanvaEndpointOutputs['analyticsListLinks']>(
		ctx,
		'analytics.listLinks',
		{ ...input },
		`v1/designs/${seg(designId)}/analytics/links`,
		{ method: 'GET', query: defined(query) },
	);
};
