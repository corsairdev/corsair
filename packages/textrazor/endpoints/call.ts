import { logEventFromContext } from 'corsair/core';
import { assertTextrazorOk, makeTextrazorRequest } from '../client';
import type { TextrazorContext } from '../index';

export async function textrazorCall<T extends { ok?: boolean }>(
	ctx: TextrazorContext,
	event: string,
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	input: object,
	options: {
		form?: Record<string, unknown>;
		json?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const result = assertTextrazorOk(
		await makeTextrazorRequest<T>(path, ctx.key, {
			method,
			form: options.form,
			json: options.json,
			query: options.query,
		}),
	);
	await logEventFromContext(
		ctx,
		event,
		input as Record<string, unknown>,
		'completed',
	);
	return result;
}

export function analysisForm(input: {
	text?: string;
	url?: string;
	extractors?: string[];
	classifiers?: string[];
	classifierMaxCategories?: number;
	cleanupMode?: string;
	cleanupReturnCleaned?: boolean;
	cleanupReturnRaw?: boolean;
	cleanupUseMetadata?: boolean;
	cleanupCleanHtmlPrecision?: number;
	cleanupCleanHtmlUseTitle?: boolean;
	downloadRunJavascript?: boolean;
	downloadUserAgent?: string;
	entitiesAllowOverlap?: boolean;
	entitiesDictionaries?: string[];
	entitiesFilterDbpediaTypes?: string[];
	entitiesFilterFreebaseTypes?: string[];
	entitiesIncludeAddressPlaces?: boolean;
	languageOverride?: string;
	rules?: string;
}): Record<string, unknown> {
	return {
		text: input.text,
		url: input.url,
		extractors: input.extractors,
		classifiers: input.classifiers,
		'classifier.maxCategories': input.classifierMaxCategories,
		'cleanup.mode': input.cleanupMode,
		'cleanup.returnCleaned': input.cleanupReturnCleaned,
		'cleanup.returnRaw': input.cleanupReturnRaw,
		'cleanup.useMetadata': input.cleanupUseMetadata,
		'cleanup.cleanHTML.precision': input.cleanupCleanHtmlPrecision,
		'cleanup.cleanHTML.useTitle': input.cleanupCleanHtmlUseTitle,
		'download.runJavascript': input.downloadRunJavascript,
		'download.userAgent': input.downloadUserAgent,
		'entities.allowOverlap': input.entitiesAllowOverlap,
		'entities.dictionaries': input.entitiesDictionaries,
		'entities.filterDbpediaTypes': input.entitiesFilterDbpediaTypes,
		'entities.filterFreebaseTypes': input.entitiesFilterFreebaseTypes,
		'entities.includeAddressPlaces': input.entitiesIncludeAddressPlaces,
		languageOverride: input.languageOverride,
		rules: input.rules,
	};
}
