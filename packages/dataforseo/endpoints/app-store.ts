import type { DataForSeoEndpoints } from '..';
import { call } from './call';

// The App Store API is task-based: post a task, then fetch its result by the
// returned task id once it is ready (status 40602 means it is still queued).

const taskId = (parsed: { id: string }) => ({ id: parsed.id });

export const searchTask: DataForSeoEndpoints['appStoreSearchTask'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'appStoreSearchTask',
		'appStore.searchTask',
		{
			method: 'POST',
			path: '/v3/app_data/apple/app_searches/task_post',
		},
		input,
	);

export const searchResult: DataForSeoEndpoints['appStoreSearchResult'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'appStoreSearchResult',
		'appStore.searchResult',
		{
			method: 'GET',
			path: '/v3/app_data/apple/app_searches/task_get/advanced/{id}',
			pathParams: taskId,
		},
		input,
	);

export const infoTask: DataForSeoEndpoints['appStoreInfoTask'] = (ctx, input) =>
	call(
		ctx,
		'appStoreInfoTask',
		'appStore.infoTask',
		{
			method: 'POST',
			path: '/v3/app_data/apple/app_info/task_post',
		},
		input,
	);

export const infoResult: DataForSeoEndpoints['appStoreInfoResult'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'appStoreInfoResult',
		'appStore.infoResult',
		{
			method: 'GET',
			path: '/v3/app_data/apple/app_info/task_get/advanced/{id}',
			pathParams: taskId,
		},
		input,
	);

export const reviewsTask: DataForSeoEndpoints['appStoreReviewsTask'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'appStoreReviewsTask',
		'appStore.reviewsTask',
		{
			method: 'POST',
			path: '/v3/app_data/apple/app_reviews/task_post',
		},
		input,
	);

export const reviewsResult: DataForSeoEndpoints['appStoreReviewsResult'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'appStoreReviewsResult',
		'appStore.reviewsResult',
		{
			method: 'GET',
			path: '/v3/app_data/apple/app_reviews/task_get/advanced/{id}',
			pathParams: taskId,
		},
		input,
	);
