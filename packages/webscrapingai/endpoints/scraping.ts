import { logEventFromContext } from 'corsair/core';
import type { WebScrapingAIEndpoints } from '..';
import { makeWebScrapingAIRequest } from '../client';
import {
	GetHtmlInputSchema,
	GetSelectedHtmlInputSchema,
	GetSelectedMultipleInputSchema,
	GetTextInputSchema,
	HtmlResponseSchema,
	SelectedHtmlResponseSchema,
	SelectedMultipleResponseSchema,
	TextResponseSchema,
} from './types';

export const getHtml: WebScrapingAIEndpoints['scrapingGetHtml'] = async (
	ctx,
	rawInput,
) => {
	const input = GetHtmlInputSchema.parse(rawInput);
	const response = HtmlResponseSchema.parse(
		await makeWebScrapingAIRequest<unknown>('/html', ctx.key, input),
	);
	await logEventFromContext(
		ctx,
		'webscrapingai.scraping.getHtml',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const getSelectedHtml: WebScrapingAIEndpoints['scrapingGetSelectedHtml'] =
	async (ctx, rawInput) => {
		const input = GetSelectedHtmlInputSchema.parse(rawInput);
		const response = SelectedHtmlResponseSchema.parse(
			await makeWebScrapingAIRequest<unknown>('/selected', ctx.key, input),
		);
		await logEventFromContext(
			ctx,
			'webscrapingai.scraping.getSelectedHtml',
			{ url: input.url, selector: input.selector },
			'completed',
		);
		return response;
	};

export const getSelectedMultiple: WebScrapingAIEndpoints['scrapingGetSelectedMultiple'] =
	async (ctx, rawInput) => {
		const input = GetSelectedMultipleInputSchema.parse(rawInput);
		const { selectors, ...query } = input;
		const response = SelectedMultipleResponseSchema.parse(
			await makeWebScrapingAIRequest<unknown>('/selected-multiple', ctx.key, {
				...query,
				'selectors[]': selectors,
			}),
		);
		await logEventFromContext(
			ctx,
			'webscrapingai.scraping.getSelectedMultiple',
			{ url: input.url, selectors },
			'completed',
		);
		return response;
	};

export const getText: WebScrapingAIEndpoints['scrapingGetText'] = async (
	ctx,
	rawInput,
) => {
	const input = GetTextInputSchema.parse(rawInput);
	const response = TextResponseSchema.parse(
		await makeWebScrapingAIRequest<unknown>('/text', ctx.key, input),
	);
	await logEventFromContext(
		ctx,
		'webscrapingai.scraping.getText',
		{ url: input.url, textFormat: input.text_format },
		'completed',
	);
	return response;
};
