import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createBlogPost: CloudcartEndpoints['createBlogPost'] = async (
	ctx,
	input,
) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['createBlogPost']
	>('blog-posts', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.createBlogPost',
		{ ...input },
		'completed',
	);
	return result;
};

export const getBlogPost: CloudcartEndpoints['getBlogPost'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['getBlogPost']
	>(`blog-posts/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.getBlogPost',
		{ ...input },
		'completed',
	);
	return result;
};

export const listBlogPosts: CloudcartEndpoints['listBlogPosts'] = async (
	ctx,
	input,
) => {
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['listBlogPosts']
	>('blog-posts', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.listBlogPosts',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateBlogPost: CloudcartEndpoints['updateBlogPost'] = async (
	ctx,
	input,
) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['updateBlogPost']
	>(`blog-posts/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.updateBlogPost',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteBlogPost: CloudcartEndpoints['deleteBlogPost'] = async (
	ctx,
	input,
) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['deleteBlogPost']
	>(`blog-posts/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.deleteBlogPost',
		{ ...input },
		'completed',
	);
	return result;
};

export const createBlogCategory: CloudcartEndpoints['createBlogCategory'] =
	async (ctx, input) => {
		const { data, ...rest } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['createBlogCategory']
		>('blog-categories', ctx.key, {
			method: 'POST',
			body: data || rest,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.blogs.createBlogCategory',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getBlogCategory: CloudcartEndpoints['getBlogCategory'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['getBlogCategory']
	>(`blog-categories/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.getBlogCategory',
		{ ...input },
		'completed',
	);
	return result;
};

export const listBlogCategories: CloudcartEndpoints['listBlogCategories'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listBlogCategories']
		>('blog-categories', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.blogs.listBlogCategories',
			{ ...input },
			'completed',
		);
		return result;
	};

export const updateBlogCategory: CloudcartEndpoints['updateBlogCategory'] =
	async (ctx, input) => {
		const { id, data, ...rest } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['updateBlogCategory']
		>(`blog-categories/${encodeURIComponent(String(id))}`, ctx.key, {
			method: 'PATCH',
			body: data || rest,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.blogs.updateBlogCategory',
			{ ...input },
			'completed',
		);
		return result;
	};

export const deleteBlogCategory: CloudcartEndpoints['deleteBlogCategory'] =
	async (ctx, input) => {
		const { id } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['deleteBlogCategory']
		>(`blog-categories/${encodeURIComponent(String(id))}`, ctx.key, {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'cloudcart.blogs.deleteBlogCategory',
			{ ...input },
			'completed',
		);
		return result;
	};

export const createBlogTag: CloudcartEndpoints['createBlogTag'] = async (
	ctx,
	input,
) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['createBlogTag']
	>('blog-tags', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.createBlogTag',
		{ ...input },
		'completed',
	);
	return result;
};

export const getBlogTag: CloudcartEndpoints['getBlogTag'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['getBlogTag']
	>(`blog-tags/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.getBlogTag',
		{ ...input },
		'completed',
	);
	return result;
};

export const listBlogTags: CloudcartEndpoints['listBlogTags'] = async (
	ctx,
	input,
) => {
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['listBlogTags']
	>('blog-tags', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.listBlogTags',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateBlogTag: CloudcartEndpoints['updateBlogTag'] = async (
	ctx,
	input,
) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['updateBlogTag']
	>(`blog-tags/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.updateBlogTag',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteBlogTag: CloudcartEndpoints['deleteBlogTag'] = async (
	ctx,
	input,
) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['deleteBlogTag']
	>(`blog-tags/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.deleteBlogTag',
		{ ...input },
		'completed',
	);
	return result;
};

export const getBlogAuthor: CloudcartEndpoints['getBlogAuthor'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['getBlogAuthor']
	>(`blog-authors/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.blogs.getBlogAuthor',
		{ ...input },
		'completed',
	);
	return result;
};
