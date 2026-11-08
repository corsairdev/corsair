import { asRecord } from 'corsair/core';
import type { FluxguardContext, FluxguardEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	FluxguardEndpointInputSchemas as Inputs,
	FluxguardEndpointOutputSchemas as Outputs,
} from './types';

export const addPage: FluxguardEndpoints['monitoringAddPage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'monitoring.addPage',
			input: Inputs.monitoringAddPage,
			output: Outputs.monitoringAddPage,
		},
		input,
		(page) => ({
			method: 'POST',
			path: '/add-page',
			// Only send what the caller set: the API rejects site settings when
			// the page goes into an existing site, and an explicit `undefined`
			// would still be a field.
			body: {
				url: page.url,
				...(page.siteId === undefined ? {} : { siteId: page.siteId }),
				...(page.sessionId === undefined ? {} : { sessionId: page.sessionId }),
				...(page.categories === undefined
					? {}
					: { categories: page.categories }),
				...(page.categoryId === undefined
					? {}
					: { categoryId: page.categoryId }),
				...(page.categoryName === undefined
					? {}
					: { categoryName: page.categoryName }),
				...(page.siteNickname === undefined
					? {}
					: { siteNickname: page.siteNickname }),
			},
		}),
		{
			log: (_, result) => ({
				siteId: result.siteId,
				sessionId: result.sessionId,
				pageId: result.pageId,
			}),
		},
	);

export const startCrawl: FluxguardEndpoints['monitoringStartCrawl'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'monitoring.startCrawl',
			input: Inputs.monitoringStartCrawl,
			output: Outputs.monitoringStartCrawl,
		},
		input,
		({ siteId, sessionId }) => ({
			method: 'POST',
			path: `/site/${segment(siteId)}/session/${segment(sessionId)}/crawl`,
		}),
		{
			// A crawl trigger answers 204 with no body: the capture runs in the
			// background and the result is read with monitoring.getPage.
			shape: (_, { siteId, sessionId }) => ({ siteId, sessionId }),
			log: (_, result) => ({
				siteId: result.siteId,
				sessionId: result.sessionId,
			}),
		},
	);

export const getPage: FluxguardEndpoints['monitoringGetPage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'monitoring.getPage',
			input: Inputs.monitoringGetPage,
			output: Outputs.monitoringGetPage,
		},
		input,
		({ siteId, sessionId, pageId }) => ({
			method: 'GET',
			path: `/site/${segment(siteId)}/session/${segment(sessionId)}/page/${segment(pageId)}`,
		}),
		{
			shape: (raw, { siteId, sessionId, pageId }) => {
				// An unknown site, session or page answers 204 with no body
				// rather than a 404.
				if (raw === undefined) {
					throw new Error(
						`Fluxguard has no page ${pageId} in session ${sessionId} of site ${siteId}`,
					);
				}
				return normalizePage(raw);
			},
			log: (_, result) => ({ pageId: result.id }),
		},
	);

/**
 * The page carries `siteCategories` and `pageCategories` as arrays of category
 * names, but a page created before a category existed can omit the key.
 * Normalise to an empty array so the declared schema always holds.
 */
export function normalizePage(raw: unknown): unknown {
	const page = asRecord(raw);
	if (!page) return raw;
	return {
		...page,
		siteCategories: toNameArray(page.siteCategories),
		pageCategories: toNameArray(page.pageCategories),
	};
}

function toNameArray(value: unknown): string[] {
	if (value === undefined || value === null) return [];
	return Array.isArray(value) ? (value as string[]) : [];
}

export const removePage: FluxguardEndpoints['monitoringDeletePage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'monitoring.deletePage',
			input: Inputs.monitoringDeletePage,
			output: Outputs.monitoringDeletePage,
		},
		input,
		({ siteId, sessionId, pageId }) => ({
			method: 'DELETE',
			path: `/site/${segment(siteId)}/session/${segment(sessionId)}/page/${segment(pageId)}`,
		}),
		{
			// A delete answers 204. Fluxguard keeps the row with status `ignore`
			// rather than removing it, so the identifiers are echoed back.
			shape: (_, { siteId, sessionId, pageId }) => ({
				success: true,
				siteId,
				sessionId,
				pageId,
			}),
			log: ({ siteId, pageId }) => ({ siteId, pageId }),
		},
	);

export const removeSite: FluxguardEndpoints['monitoringDeleteSite'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'monitoring.deleteSite',
			input: Inputs.monitoringDeleteSite,
			output: Outputs.monitoringDeleteSite,
		},
		input,
		({ siteId }) => ({
			method: 'DELETE',
			path: `/site/${segment(siteId)}`,
		}),
		{
			shape: (_, { siteId }) => ({ success: true, siteId }),
			log: ({ siteId }) => ({ siteId }),
		},
	);

export type { FluxguardContext };
