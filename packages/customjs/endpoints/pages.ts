import type { CustomjsEndpoints } from '..';
import { call } from './call';
import {
	CustomjsEndpointInputSchemas as Inputs,
	CustomjsEndpointOutputSchemas as Outputs,
} from './types';

/** The live route answers a bare array; the wrapper names it `pages`. */
export const list: CustomjsEndpoints['pagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pages.list',
			input: Inputs.pagesList,
			output: Outputs.pagesList,
			reader: 'pages',
			replayable: true,
		},
		input,
		() => ({ method: 'GET', path: '/pages/api/page' }),
		{
			// A workspace with no pages answers 200 with `[]`. Nothing else can be
			// an empty array, so an absent body is the only case this fills in.
			shape: (raw) => ({ pages: raw ?? [] }),
			log: (_, result) => ({ count: result.pages.length }),
		},
	);

/**
 * Create answers 201 with `shortId` and no `name`, unlike the docs' sample. The
 * name is not unique: two pages with the same name are two pages.
 */
export const create: CustomjsEndpoints['pagesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pages.create',
			input: Inputs.pagesCreate,
			output: Outputs.pagesCreate,
			reader: 'pages',
			// A replay would publish a second page, so this is never retried.
			replayable: false,
		},
		input,
		({ name, htmlContent, slug }) => ({
			method: 'POST',
			path: '/pages/page/upload-html',
			body: {
				name,
				htmlContent,
				...(slug === undefined ? {} : { slug }),
			},
		}),
		{
			log: (parsed, result) => ({
				name: parsed.name,
				pageId: result.pageId,
				htmlLength: parsed.htmlContent.length,
			}),
		},
	);

/** The live URL does not change, so the page updates in place. */
export const update: CustomjsEndpoints['pagesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pages.update',
			input: Inputs.pagesUpdate,
			output: Outputs.pagesUpdate,
			reader: 'pages',
			// Replacing the HTML with the same HTML leaves the page as it was.
			replayable: true,
		},
		input,
		({ pageId, htmlContent, name }) => ({
			method: 'PUT',
			path: `/pages/api/page/id/${encodeURIComponent(pageId)}/update-html`,
			body: {
				htmlContent,
				...(name === undefined ? {} : { name }),
			},
		}),
		{
			log: (parsed, result) => ({
				pageId: parsed.pageId,
				renamed: parsed.name !== undefined,
				htmlLength: parsed.htmlContent.length,
				htmlFileUrl: result.htmlFileUrl,
			}),
		},
	);

/**
 * Answers 200 with `{}` whether or not the page existed, so the response says
 * only that CustomJS accepted the call. Read `pages.list` to confirm.
 */
export const remove: CustomjsEndpoints['pagesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pages.delete',
			input: Inputs.pagesDelete,
			output: Outputs.pagesDelete,
			reader: 'pages',
			replayable: true,
		},
		input,
		({ pageId }) => ({
			method: 'DELETE',
			path: `/pages/api/page/id/${encodeURIComponent(pageId)}`,
		}),
		{
			// The route confirms nothing, so trust the request it accepted.
			shape: (_, { pageId }) => ({ success: true, pageId }),
			log: ({ pageId }) => ({ pageId }),
		},
	);
