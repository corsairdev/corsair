import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	CloudcartEndpointOutputSchemas,
	CreateBlogCategoryInputSchema,
	CreateBlogPostInputSchema,
	CreateBlogTagInputSchema,
	DeleteBlogCategoryInputSchema,
	DeleteBlogPostInputSchema,
	DeleteBlogTagInputSchema,
	GetBlogAuthorInputSchema,
	GetBlogCategoryInputSchema,
	GetBlogPostInputSchema,
	GetBlogTagInputSchema,
	ListBlogCategoriesInputSchema,
	ListBlogPostsInputSchema,
	ListBlogTagsInputSchema,
	UpdateBlogCategoryInputSchema,
	UpdateBlogPostInputSchema,
	UpdateBlogTagInputSchema,
} from './types';

export const createBlogPost: CloudcartEndpoints['createBlogPost'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.createBlogPost',
		inputSchema: CreateBlogPostInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createBlogPost,
		method: 'POST',
		path: 'blog-posts',
	});

export const getBlogPost: CloudcartEndpoints['getBlogPost'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.getBlogPost',
		inputSchema: GetBlogPostInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getBlogPost,
		path: (parsed) => `blog-posts/${pathId(parsed.id)}`,
	});

export const listBlogPosts: CloudcartEndpoints['listBlogPosts'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.listBlogPosts',
		inputSchema: ListBlogPostsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listBlogPosts,
		path: 'blog-posts',
	});

export const updateBlogPost: CloudcartEndpoints['updateBlogPost'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.updateBlogPost',
		inputSchema: UpdateBlogPostInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateBlogPost,
		method: 'PATCH',
		path: (parsed) => `blog-posts/${pathId(parsed.id)}`,
	});

export const deleteBlogPost: CloudcartEndpoints['deleteBlogPost'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.deleteBlogPost',
		inputSchema: DeleteBlogPostInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteBlogPost,
		method: 'DELETE',
		path: (parsed) => `blog-posts/${pathId(parsed.id)}`,
	});

export const createBlogCategory: CloudcartEndpoints['createBlogCategory'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.createBlogCategory',
		inputSchema: CreateBlogCategoryInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createBlogCategory,
		method: 'POST',
		path: 'blog-categories',
	});

export const getBlogCategory: CloudcartEndpoints['getBlogCategory'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.getBlogCategory',
		inputSchema: GetBlogCategoryInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getBlogCategory,
		path: (parsed) => `blog-categories/${pathId(parsed.id)}`,
	});

export const listBlogCategories: CloudcartEndpoints['listBlogCategories'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.listBlogCategories',
		inputSchema: ListBlogCategoriesInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listBlogCategories,
		path: 'blog-categories',
	});

export const updateBlogCategory: CloudcartEndpoints['updateBlogCategory'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.updateBlogCategory',
		inputSchema: UpdateBlogCategoryInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateBlogCategory,
		method: 'PATCH',
		path: (parsed) => `blog-categories/${pathId(parsed.id)}`,
	});

export const deleteBlogCategory: CloudcartEndpoints['deleteBlogCategory'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.deleteBlogCategory',
		inputSchema: DeleteBlogCategoryInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteBlogCategory,
		method: 'DELETE',
		path: (parsed) => `blog-categories/${pathId(parsed.id)}`,
	});

export const createBlogTag: CloudcartEndpoints['createBlogTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.createBlogTag',
		inputSchema: CreateBlogTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createBlogTag,
		method: 'POST',
		path: 'blog-tags',
	});

export const getBlogTag: CloudcartEndpoints['getBlogTag'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.getBlogTag',
		inputSchema: GetBlogTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getBlogTag,
		path: (parsed) => `blog-tags/${pathId(parsed.id)}`,
	});

export const listBlogTags: CloudcartEndpoints['listBlogTags'] = (ctx, input) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.listBlogTags',
		inputSchema: ListBlogTagsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listBlogTags,
		path: 'blog-tags',
	});

export const updateBlogTag: CloudcartEndpoints['updateBlogTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.updateBlogTag',
		inputSchema: UpdateBlogTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateBlogTag,
		method: 'PATCH',
		path: (parsed) => `blog-tags/${pathId(parsed.id)}`,
	});

export const deleteBlogTag: CloudcartEndpoints['deleteBlogTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.deleteBlogTag',
		inputSchema: DeleteBlogTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteBlogTag,
		method: 'DELETE',
		path: (parsed) => `blog-tags/${pathId(parsed.id)}`,
	});

export const getBlogAuthor: CloudcartEndpoints['getBlogAuthor'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.blogs.getBlogAuthor',
		inputSchema: GetBlogAuthorInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getBlogAuthor,
		path: (parsed) => `blog-authors/${pathId(parsed.id)}`,
	});
