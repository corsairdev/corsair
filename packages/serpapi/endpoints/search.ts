import { logEventFromContext } from 'corsair/core';
import type { SerpapiEndpoints } from '../index';
import { auditPayload } from './logging';
import { serpapiSearch } from './shared';

/** Confirmed live: `GET /search?engine=google`, requires `q`. */
export const search: SerpapiEndpoints['searchSearch'] = async (ctx, input) => {
	const result = await serpapiSearch(ctx, 'google', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.search',
		auditPayload(input, ['location', 'hl', 'gl', 'device']),
		'completed',
	);
	return result;
};

export const imageSearch: SerpapiEndpoints['searchImageSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_images', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.imageSearch',
		auditPayload(input, ['location', 'hl', 'gl', 'num']),
		'completed',
	);
	return result;
};

export const imagesLightSearch: SerpapiEndpoints['searchImagesLightSearch'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'google_images_light', input);
		await logEventFromContext(
			ctx,
			'serpapi.search.imagesLightSearch',
			auditPayload(input, ['location', 'hl', 'gl']),
			'completed',
		);
		return result;
	};

export const videosLightSearch: SerpapiEndpoints['searchVideosLightSearch'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'google_videos_light', input);
		await logEventFromContext(
			ctx,
			'serpapi.search.videosLightSearch',
			auditPayload(input, ['location', 'hl', 'gl']),
			'completed',
		);
		return result;
	};

export const mapsSearch: SerpapiEndpoints['searchMapsSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_maps', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.mapsSearch',
		auditPayload(input, ['ll', 'type']),
		'completed',
	);
	return result;
};

/** Confirmed live: needs `data_id` (a place's Maps data id), not a free-text query. */
export const mapsPosts: SerpapiEndpoints['searchMapsPosts'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_maps_posts', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.mapsPosts',
		auditPayload(input, ['data_id']),
		'completed',
	);
	return result;
};

export const jobsSearch: SerpapiEndpoints['searchJobsSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_jobs', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.jobsSearch',
		auditPayload(input, ['location', 'hl', 'gl']),
		'completed',
	);
	return result;
};

/** Confirmed live: `q` is optional - a bare call with no query still succeeds. */
export const playSearch: SerpapiEndpoints['searchPlaySearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_play', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.playSearch',
		auditPayload(input, ['gl', 'hl']),
		'completed',
	);
	return result;
};

export const playProduct: SerpapiEndpoints['searchPlayProduct'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_play_product', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.playProduct',
		auditPayload(input, ['product_id', 'store']),
		'completed',
	);
	return result;
};

export const scholarSearch: SerpapiEndpoints['searchScholarSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_scholar', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.scholarSearch',
		auditPayload(input, ['hl']),
		'completed',
	);
	return result;
};

export const scholarAuthor: SerpapiEndpoints['searchScholarAuthor'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_scholar_author', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.scholarAuthor',
		auditPayload(input, ['author_id']),
		'completed',
	);
	return result;
};

/** `q` here identifies the paper (a Google Scholar result id), not a search term. */
export const scholarCite: SerpapiEndpoints['searchScholarCite'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_scholar_cite', input);
	await logEventFromContext(ctx, 'serpapi.search.scholarCite', {}, 'completed');
	return result;
};

export const trendsSearch: SerpapiEndpoints['searchTrendsSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_trends', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.trendsSearch',
		auditPayload(input, ['category', 'data_type', 'geo']),
		'completed',
	);
	return result;
};

export const financeSearch: SerpapiEndpoints['searchFinanceSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_finance', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.financeSearch',
		auditPayload(input, ['hl']),
		'completed',
	);
	return result;
};

/** Confirmed live: `q` is optional - a bare call with no query still succeeds. */
export const newsSearch: SerpapiEndpoints['searchNewsSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_news', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.newsSearch',
		auditPayload(input, ['location', 'hl', 'gl']),
		'completed',
	);
	return result;
};

export const shoppingSearch: SerpapiEndpoints['searchShoppingSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_shopping', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.shoppingSearch',
		auditPayload(input, ['location', 'hl', 'gl']),
		'completed',
	);
	return result;
};

export const hotelSearch: SerpapiEndpoints['searchHotelSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_hotels', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.hotelSearch',
		auditPayload(input, [
			'check_in_date',
			'check_out_date',
			'adults',
			'currency',
		]),
		'completed',
	);
	return result;
};

export const hotelsAutocomplete: SerpapiEndpoints['searchHotelsAutocomplete'] =
	async (ctx, input) => {
		const result = await serpapiSearch(
			ctx,
			'google_hotels_autocomplete',
			input,
		);
		await logEventFromContext(
			ctx,
			'serpapi.search.hotelsAutocomplete',
			{},
			'completed',
		);
		return result;
	};

export const eventSearch: SerpapiEndpoints['searchEventSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_events', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.eventSearch',
		auditPayload(input, ['location', 'hl', 'gl']),
		'completed',
	);
	return result;
};

export const localServicesSearch: SerpapiEndpoints['searchLocalServicesSearch'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'google_local_services', input);
		await logEventFromContext(
			ctx,
			'serpapi.search.localServicesSearch',
			auditPayload(input, ['location', 'hl', 'gl']),
			'completed',
		);
		return result;
	};

export const forumsSearch: SerpapiEndpoints['searchForumsSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_forums', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.forumsSearch',
		auditPayload(input, ['location', 'hl', 'gl']),
		'completed',
	);
	return result;
};

/** Confirmed live: requires a publicly accessible `url`, not `q`. */
export const lensSearch: SerpapiEndpoints['searchLensSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_lens', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.lensSearch',
		// `url` deliberately excluded: it's the caller's own input (an image
		// URL, potentially private), not a structural identifier.
		auditPayload(input, ['hl', 'country']),
		'completed',
	);
	return result;
};

export const lightSearch: SerpapiEndpoints['searchLightSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_light', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.lightSearch',
		auditPayload(input, ['location', 'hl', 'gl']),
		'completed',
	);
	return result;
};

/** `q` here is the URL to look up "About this result" information for, not a search term. */
export const aboutThisResult: SerpapiEndpoints['searchAboutThisResult'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'google_about_this_result', input);
		await logEventFromContext(
			ctx,
			'serpapi.search.aboutThisResult',
			{},
			'completed',
		);
		return result;
	};

export const patentDetails: SerpapiEndpoints['searchPatentDetails'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'google_patents_details', input);
	await logEventFromContext(
		ctx,
		'serpapi.search.patentDetails',
		auditPayload(input, ['patent_id']),
		'completed',
	);
	return result;
};

export const imagesRelatedContent: SerpapiEndpoints['searchImagesRelatedContent'] =
	async (ctx, input) => {
		const result = await serpapiSearch(
			ctx,
			'google_images_related_content',
			input,
		);
		await logEventFromContext(
			ctx,
			'serpapi.search.imagesRelatedContent',
			auditPayload(input, ['related_content_id']),
			'completed',
		);
		return result;
	};
