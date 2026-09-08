import { logEventFromContext } from 'corsair/core';
import { compactQuery, toCommaList } from '../client';
import type { ExistEndpoints } from '../index';
import { persistAttributes, persistAttributesWithValues } from './persist';
import { parseExistInput, validatedExistRequest } from './validate';

/**
 * Summarises a write batch for the operation log. Exist attribute values are
 * personal analytics data (mood notes, weight, location counts), so the values
 * themselves are deliberately left out — the log keeps only what is needed to
 * trace an operation: how many objects were sent, which attributes they
 * targeted, and which days they covered.
 */
type WriteBatchSummary = {
	count: number;
	attributes: string[];
	dates?: string[];
};

function writeBatchSummary(
	attributes: readonly { name: string; date?: string }[],
): WriteBatchSummary {
	const names = [...new Set(attributes.map((a) => a.name))];
	const dates = [
		...new Set(
			attributes
				.map((a) => a.date)
				.filter((date): date is string => date !== undefined),
		),
	].sort();
	return {
		count: attributes.length,
		attributes: names,
		...(dates.length > 0 ? { dates } : {}),
	};
}

/**
 * List the user's attributes without values.
 * @see https://developer.exist.io/reference/attributes/
 */
export const list: ExistEndpoints['attributesList'] = async (ctx, input) => {
	const parsed = parseExistInput('attributesList', input);
	const result = await validatedExistRequest(
		'attributesList',
		'attributes/',
		ctx,
		{
			method: 'GET',
			query: compactQuery({
				page: parsed.page,
				limit: parsed.limit,
				groups: toCommaList(parsed.groups),
				attributes: toCommaList(parsed.attributes),
				exclude_custom: parsed.exclude_custom,
				manual: parsed.manual,
				include_inactive: parsed.include_inactive,
				include_low_priority: parsed.include_low_priority,
				owned: parsed.owned,
			}),
		},
	);

	await persistAttributes(ctx, result.results);
	await logEventFromContext(
		ctx,
		'exist.attributes.list',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * List the attribute templates Exist supports.
 * @see https://developer.exist.io/reference/attributes/
 */
export const listTemplates: ExistEndpoints['attributesListTemplates'] = async (
	ctx,
	input,
) => {
	const parsed = parseExistInput('attributesListTemplates', input);
	const result = await validatedExistRequest(
		'attributesListTemplates',
		'attributes/templates/',
		ctx,
		{
			method: 'GET',
			query: compactQuery({
				page: parsed.page,
				limit: parsed.limit,
				include_low_priority: parsed.include_low_priority,
				groups: toCommaList(parsed.groups),
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'exist.attributes.listTemplates',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * List the user's attributes along with their recent day values.
 * @see https://developer.exist.io/reference/attributes/
 */
export const listWithValues: ExistEndpoints['attributesListWithValues'] =
	async (ctx, input) => {
		const parsed = parseExistInput('attributesListWithValues', input);
		const result = await validatedExistRequest(
			'attributesListWithValues',
			'attributes/with-values/',
			ctx,
			{
				method: 'GET',
				query: compactQuery({
					page: parsed.page,
					limit: parsed.limit,
					days: parsed.days,
					date_max: parsed.date_max,
					groups: toCommaList(parsed.groups),
					attributes: toCommaList(parsed.attributes),
					templates: toCommaList(parsed.templates),
					manual: parsed.manual,
				}),
			},
		);

		await persistAttributesWithValues(ctx, result.results);
		await logEventFromContext(
			ctx,
			'exist.attributes.listWithValues',
			{ ...input },
			'completed',
		);
		return result;
	};

/**
 * List the attributes this OAuth2 client already owns.
 * @see https://developer.exist.io/reference/attribute_ownership/
 */
export const listOwned: ExistEndpoints['attributesListOwned'] = async (
	ctx,
	input,
) => {
	const parsed = parseExistInput('attributesListOwned', input);
	const result = await validatedExistRequest(
		'attributesListOwned',
		'attributes/owned/',
		ctx,
		{
			method: 'GET',
			query: compactQuery({
				page: parsed.page,
				limit: parsed.limit,
				groups: toCommaList(parsed.groups),
				attributes: toCommaList(parsed.attributes),
				exclude_custom: parsed.exclude_custom,
				manual: parsed.manual,
				include_inactive: parsed.include_inactive,
				include_low_priority: parsed.include_low_priority,
			}),
		},
	);

	await persistAttributes(ctx, result.results);
	await logEventFromContext(
		ctx,
		'exist.attributes.listOwned',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Take ownership of attributes so this client can write values for them.
 * Acquiring a template the user does not have yet creates that attribute.
 * @see https://developer.exist.io/reference/attribute_ownership/
 */
export const acquire: ExistEndpoints['attributesAcquire'] = async (
	ctx,
	input,
) => {
	const parsed = parseExistInput('attributesAcquire', input);
	const result = await validatedExistRequest(
		'attributesAcquire',
		'attributes/acquire/',
		ctx,
		{
			method: 'POST',
			body: parsed.attributes,
			query: compactQuery({
				success_objects: parsed.success_objects === true ? 1 : undefined,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'exist.attributes.acquire',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Give up ownership of attributes previously acquired by this client.
 * @see https://developer.exist.io/reference/attribute_ownership/
 */
export const release: ExistEndpoints['attributesRelease'] = async (
	ctx,
	input,
) => {
	const parsed = parseExistInput('attributesRelease', input);
	const result = await validatedExistRequest(
		'attributesRelease',
		'attributes/release/',
		ctx,
		{
			method: 'POST',
			body: parsed.attributes,
		},
	);

	await logEventFromContext(
		ctx,
		'exist.attributes.release',
		{ ...input },
		'completed',
	);
	return result;
};

/**
 * Apply deltas to owned attributes rather than overwriting the day's total.
 * @see https://developer.exist.io/reference/writing_data/
 */
export const increment: ExistEndpoints['attributesIncrement'] = async (
	ctx,
	input,
) => {
	const parsed = parseExistInput('attributesIncrement', input);
	const result = await validatedExistRequest(
		'attributesIncrement',
		'attributes/increment/',
		ctx,
		{
			method: 'POST',
			body: parsed.attributes,
		},
	);

	await logEventFromContext(
		ctx,
		'exist.attributes.increment',
		writeBatchSummary(parsed.attributes),
		'completed',
	);
	return result;
};

/**
 * Overwrite owned attributes' totals for a given day. Use `increment` instead
 * when the client would otherwise have to track the running total itself.
 * @see https://developer.exist.io/reference/writing_data/
 */
export const update: ExistEndpoints['attributesUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = parseExistInput('attributesUpdate', input);
	const result = await validatedExistRequest(
		'attributesUpdate',
		'attributes/update/',
		ctx,
		{
			method: 'POST',
			body: parsed.attributes,
		},
	);

	await logEventFromContext(
		ctx,
		'exist.attributes.update',
		writeBatchSummary(parsed.attributes),
		'completed',
	);
	return result;
};
